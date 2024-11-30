export class Leaderboard {
    constructor(currentLevel) {
        this.leaderboardElement = document.getElementById('leaderboard-entries');
        this.updateInterval = 5000; // Update every 5 seconds
        this.startUpdating(currentLevel);
    }

    async updateLeaderboard(currentLevel) {
        try {
            const response = await fetch('https://nomissmayhem.shuttleapp.rs/leaderboard');
            let leaderboardData = await response.json();
            leaderboardData = leaderboardData[currentLevel]
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

    startUpdating(currentLevel) {
        // Initial update
        this.updateLeaderboard(currentLevel);
        
        // Set up periodic updates
        setInterval(() => this.updateLeaderboard(currentLevel), this.updateInterval);
    }
}
