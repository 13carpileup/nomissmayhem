use axum::{
    extract::{Path, State}, 
    http::{Method, StatusCode}, 
    routing::{delete, get, post}, 
    Json, Router, response::IntoResponse
};
use tower_http::cors::{CorsLayer, Any};
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use tokio::sync::Mutex;
use std::collections::{BinaryHeap, HashMap};
use std::cmp::Reverse;
use shuttle_persist::PersistInstance;

#[derive(Debug, Serialize, Deserialize, Clone)]
struct Entry {
    name: String,
    time: i32,
    level: String,
}   

#[derive(Debug, Clone, Serialize, Deserialize)]
struct LeaderboardEntry {
    position: usize,
    name: String,
    time: i32,
    level: String,
}

#[derive(Clone)]
struct AppState {
    heaps: Arc<Mutex<HashMap<String, BinaryHeap<Reverse<Entry>>>>>,
    persist: PersistInstance,
}

impl Ord for Entry {
    fn cmp(&self, other: &Self) -> std::cmp::Ordering {
        self.time.cmp(&other.time)
    }
}

impl PartialOrd for Entry {
    fn partial_cmp(&self, other: &Self) -> Option<std::cmp::Ordering> {
        Some(self.cmp(other))
    }
}

impl PartialEq for Entry {
    fn eq(&self, other: &Self) -> bool {
        self.time == other.time
    }
}

impl Eq for Entry {}

async fn add_score(
    State(state): State<AppState>,
    Json(entry): Json<Entry>,
) -> impl IntoResponse {
    // Validate name length (between 1 and 20 characters)
    if entry.name.is_empty() || entry.name.len() > 20 {
        return (
            StatusCode::BAD_REQUEST,
            Json("Name must be between 1 and 20 characters")
        ).into_response();
    }

    // Validate time (positive and reasonable)
    if entry.time <= 0 || entry.time > 3600*1000 {  // Max 1 hour in milliseconds
        return (
            StatusCode::BAD_REQUEST,
            Json("Time must be between 1 and 3600000 milliseconds")
        ).into_response();
    }

    // Validate level (non-empty)
    if entry.level.is_empty() {
        return (
            StatusCode::BAD_REQUEST,
            Json("Level must not be empty")
        ).into_response();
    }

    let mut heaps = state.heaps.lock().await;
    let leaderboard = heaps.entry(entry.level.clone()).or_insert_with(BinaryHeap::new);

    leaderboard.push(Reverse(entry.clone()));
    
    let entries: HashMap<String, Vec<Entry>> = heaps
        .iter()
        .map(|(level, heap)| {
            (level.clone(), heap.iter().map(|Reverse(entry)| entry.clone()).collect())
        })
        .collect();
    
    state.persist.save("leaderboards", entries)
        .expect("Failed to save leaderboards");
        
    (StatusCode::CREATED, Json("Score added successfully")).into_response()
}

async fn get_leaderboard(
    State(state): State<AppState>,
) -> Json<HashMap<String, Vec<LeaderboardEntry>>> {
    let heaps = state.heaps.lock().await;
    let mut leaderboards = HashMap::new();

    for (level, heap) in heaps.iter() {
        let mut entries: Vec<LeaderboardEntry> = heap
            .iter()
            .enumerate()
            .map(|(i, Reverse(entry))| LeaderboardEntry {
                position: i + 1, 
                name: entry.name.clone(),
                time: entry.time,
                level: entry.level.clone(),
            })
            .collect();

        entries.sort_by(|a, b| a.time.partial_cmp(&b.time).unwrap_or(std::cmp::Ordering::Equal));
        
        for (i, entry) in entries.iter_mut().enumerate() {
            entry.position = i + 1;
        }

        leaderboards.insert(level.clone(), entries);
    }

    Json(leaderboards)
}

async fn delete_all(
    State(state): State<AppState>,
) -> impl IntoResponse {
    let mut heaps = state.heaps.lock().await;
    heaps.clear();
    
    // Save empty leaderboards
    state.persist.save("leaderboards", HashMap::<String, Vec<Entry>>::new())
        .expect("Failed to save leaderboards");
    
    (StatusCode::OK, Json("All entries deleted successfully")).into_response()
}

async fn delete_entry(
    State(state): State<AppState>,
    Path((level, name)): Path<(String, String)>,
) -> impl IntoResponse {
    if name.is_empty() || name.len() > 20 {
        return (
            StatusCode::BAD_REQUEST,
            Json("Invalid name length")
        ).into_response();
    }

    if level.is_empty() {
        return (
            StatusCode::BAD_REQUEST,
            Json("Invalid level")
        ).into_response();
    }

    let mut heaps = state.heaps.lock().await;
    
    if let Some(leaderboard) = heaps.get_mut(&level) {
        let initial_len = leaderboard.len();
        
        leaderboard.retain(|Reverse(entry)| entry.name != name);
        
        if leaderboard.len() < initial_len {
            let entries: HashMap<String, Vec<Entry>> = heaps
                .iter()
                .map(|(level, heap)| {
                    (level.clone(), heap.iter().map(|Reverse(entry)| entry.clone()).collect())
                })
                .collect();
            
            state.persist.save("leaderboards", entries)
                .expect("Failed to save leaderboards");
            
            return (StatusCode::OK, Json("Entry deleted successfully")).into_response();
        }
    }

    (StatusCode::NOT_FOUND, Json("Entry not found")).into_response()
}

#[shuttle_runtime::main]
async fn axum(
    #[shuttle_persist::Persist] persist: PersistInstance,
) -> shuttle_axum::ShuttleAxum {
    let mut heaps = HashMap::new();
    if let Ok(entries) = persist.load::<HashMap<String, Vec<Entry>>>("leaderboards") {
        for (level, level_entries) in entries {
            let heap = level_entries.into_iter().map(|entry| Reverse(entry)).collect();
            heaps.insert(level, heap);
        }
    }

    let shared_state = AppState {
        heaps: Arc::new(Mutex::new(heaps)),
        persist,
    };

    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods([Method::GET, Method::POST, Method::DELETE])
        .allow_headers(Any);

    let router = Router::new()
        .route("/score", post(add_score))
        .route("/leaderboard", get(get_leaderboard))
        .route("/entry/:level/:name", delete(delete_entry))
        .route("/clear", delete(delete_all))
        .with_state(shared_state)
        .layer(cors);

    Ok(router.into())
}

