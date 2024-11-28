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
use std::collections::BinaryHeap;
use std::cmp::Reverse;
use shuttle_persist::PersistInstance;

#[derive(Debug, Serialize, Deserialize)]
struct Entry {
    name: String,
    time: i32,
}   

#[derive(Debug, Clone, Serialize, Deserialize)]
struct LeaderboardEntry {
    position: usize,
    name: String,
    time: i32,
}

#[derive(Clone)]
struct AppState {
    heap: Arc<Mutex<BinaryHeap<Reverse<Entry>>>>,
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
    if entry.time <= 0 || entry.time > 3600*1000 {  // Max 1 hour in seconds
        return (
            StatusCode::BAD_REQUEST,
            Json("Time must be between 1 and 3600 seconds")
        ).into_response();
    }

    let mut leaderboard = state.heap.lock().await;
    
    // Limit total entries to 100
    if leaderboard.len() >= 100 {
        let max_time = leaderboard.peek().map(|Reverse(entry)| entry.time).unwrap_or(i32::MAX);
        if entry.time >= max_time {
            return (
                StatusCode::BAD_REQUEST,
                Json("Leaderboard full and this score doesn't qualify")
            ).into_response();
        }
        leaderboard.pop();  // Remove the worst score
    }

    leaderboard.push(Reverse(entry));
    
    let entries: Vec<Entry> = leaderboard
        .iter()
        .map(|Reverse(entry)| Entry {
            name: entry.name.clone(),
            time: entry.time,
        })
        .collect();
    
    state.persist.save("leaderboard", entries)
        .expect("Failed to save leaderboard");
        
    (StatusCode::CREATED, Json("Score added successfully")).into_response()
}

async fn get_leaderboard(
    State(state): State<AppState>,
) -> Json<Vec<LeaderboardEntry>> {
    let leaderboard = state.heap.lock().await;
    let mut entries: Vec<LeaderboardEntry> = leaderboard
        .iter()
        .enumerate()
        .map(|(i, Reverse(entry))| LeaderboardEntry {
            position: i + 1, 
            name: entry.name.clone(),
            time: entry.time,
        })
        .collect();

    entries.sort_by(|a, b| a.time.partial_cmp(&b.time).unwrap_or(std::cmp::Ordering::Equal));
    
    for (i, entry) in entries.iter_mut().enumerate() {
        entry.position = i + 1;
    }

    Json(entries)
}

async fn delete_all(
    State(state): State<AppState>,
) -> impl IntoResponse {
    let mut leaderboard = state.heap.lock().await;
    leaderboard.clear();
    
    // Save empty leaderboard
    state.persist.save("leaderboard", Vec::<Entry>::new())
        .expect("Failed to save leaderboard");
    
    (StatusCode::OK, Json("All entries deleted successfully")).into_response()
}

async fn delete_entry(
    State(state): State<AppState>,
    Path(name): Path<String>,
) -> impl IntoResponse {
    if name.is_empty() || name.len() > 20 {
        return (
            StatusCode::BAD_REQUEST,
            Json("Invalid name length")
        ).into_response();
    }

    let mut leaderboard = state.heap.lock().await;
    let initial_len = leaderboard.len();
    
    leaderboard.retain(|Reverse(entry)| entry.name != name);
    
    if leaderboard.len() < initial_len {
        let entries: Vec<Entry> = leaderboard
            .iter()
            .map(|Reverse(entry)| Entry {
                name: entry.name.clone(),
                time: entry.time,
            })
            .collect();
        
        state.persist.save("leaderboard", entries)
            .expect("Failed to save leaderboard");
        
        (StatusCode::OK, Json("Entry deleted successfully")).into_response()
    } else {
        (StatusCode::NOT_FOUND, Json("Entry not found")).into_response()
    }
}

#[shuttle_runtime::main]
async fn axum(
    #[shuttle_persist::Persist] persist: PersistInstance,
) -> shuttle_axum::ShuttleAxum {
    let mut heap = BinaryHeap::new();
    if let Ok(entries) = persist.load::<Vec<Entry>>("leaderboard") {
        for entry in entries {
            heap.push(Reverse(entry));
        }
    }

    let shared_state = AppState {
        heap: Arc::new(Mutex::new(heap)),
        persist,
    };

    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods([Method::GET, Method::POST, Method::DELETE])
        .allow_headers(Any);

    let router = Router::new()
        .route("/score", post(add_score))
        .route("/leaderboard", get(get_leaderboard))
        .route("/entry/:name", delete(delete_entry))
        .route("/clear", delete(delete_all))
        .with_state(shared_state)
        .layer(cors);

    Ok(router.into())
}