use axum::{
    routing::{get, post},
    Router,
    Json,
    extract::State,
    http::Method,
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

#[derive(Clone)]
struct AppState {
    heap: Arc<Mutex<BinaryHeap<Reverse<Entry>>>>,
    persist: PersistInstance,
}

async fn add_score(
    State(state): State<AppState>,
    Json(entry): Json<Entry>,
) -> Json<&'static str> {
    let mut leaderboard = state.heap.lock().await;
    leaderboard.push(Reverse(entry));
    
    // Save the updated leaderboard
    let entries: Vec<Entry> = leaderboard
        .iter()
        .map(|Reverse(entry)| Entry {
            name: entry.name.clone(),
            time: entry.time,
        })
        .collect();
    
    state.persist.save("leaderboard", entries)
        .expect("Failed to save leaderboard");
        
    Json("Score added successfully")
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

    // Sort by time ascending
    entries.sort_by(|a, b| a.time.partial_cmp(&b.time).unwrap_or(std::cmp::Ordering::Equal));
    
    // Update positions after sorting
    for (i, entry) in entries.iter_mut().enumerate() {
        entry.position = i + 1;
    }

    Json(entries)
}

#[shuttle_runtime::main]
async fn axum(
    #[shuttle_persist::Persist] persist: PersistInstance,
) -> shuttle_axum::ShuttleAxum {
    // Initialize heap with persisted data
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

    // Configure CORS
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods([Method::GET, Method::POST])
        .allow_headers(Any);

        
    let router = Router::new()
        .route("/score", post(add_score))
        .route("/leaderboard", get(get_leaderboard))
        .with_state(shared_state)
        .layer(cors);

    Ok(router.into())
}