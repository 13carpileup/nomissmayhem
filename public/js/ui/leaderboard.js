export class Leaderboard {
    constructor() {
        this.leaderboardElement = document.getElementById('leaderboard-entries');
        this.updateInterval = 5000; // Update every 5 seconds
        this.startUpdating();
    }

    async updateLeaderboard() {
        try {
            const response = await fetch('https://nomissmayhem.shuttleapp.rs/leaderboard');
            const leaderboardData = await response.json();
            
            leaderboardData.splice(10);

            this.leaderboardElement.innerHTML = leaderboardData
                .map((entry, index) => `
                    <div class="leaderboard-entry">
                        ${index + 1}. ${entry.name} - ${entry.time / 1000} seconds
                    </div>
                `)
                .join('');
        } catch (error) {
            console.error('Error updating leaderboard:', error);
        }
    }

    startUpdating() {
        // Initial update
        this.updateLeaderboard();
        
        // Set up periodic updates
        setInterval(() => this.updateLeaderboard(), this.updateInterval);
    }
}
