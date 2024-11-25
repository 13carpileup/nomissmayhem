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

#[derive(Debug, Serialize, Deserialize)]
struct Entry {
    name: String,
    time: i32,
}


#[derive(Debug, Clone, Serialize)]
struct LeaderboardEntry {
    position: usize,
    name: String,
    time: i32,
}

// Custom comparison for BinaryHeap to sort by time
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

type SharedState = Arc<Mutex<BinaryHeap<Reverse<Entry>>>>;

async fn add_score(
    State(state): State<SharedState>,
    Json(entry): Json<Entry>,
) -> Json<&'static str> {
    let mut leaderboard = state.lock().await;
    leaderboard.push(Reverse(entry));
    Json("Score added successfully")
}

async fn get_leaderboard(
    State(state): State<SharedState>,
) -> Json<Vec<LeaderboardEntry>> {
    let leaderboard = state.lock().await;
    let entries: Vec<LeaderboardEntry> = leaderboard
        .iter()
        .take(10)
        .enumerate()
        .map(|(i, Reverse(entry))| LeaderboardEntry {
            position: i + 1,
            name: entry.name.clone(),
            time: entry.time,
        })
        .collect();
    Json(entries)
}

#[shuttle_runtime::main]
async fn axum() -> shuttle_axum::ShuttleAxum {
    let shared_state = Arc::new(Mutex::new(BinaryHeap::new()));

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