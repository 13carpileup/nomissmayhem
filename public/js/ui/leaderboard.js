export class Leaderboard {
    constructor(currentLevel) {
        this.leaderboardElement = document.getElementById('leaderboard-entries');
        this.updateInterval = 5000; // Update every 5 seconds
        this.online = 1;
        this.level = currentLevel
        this.startUpdating();
    }

    async updateLeaderboard() {
        if (!this.online) {
            return 0;
        }
        try {
            const response = await fetch('https://nomissmayhem.shuttleapp.rs/leaderboard');
            let leaderboardData = await response.json();
            leaderboardData = leaderboardData[this.currentLevel]
            console.log(leaderboardData)
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
        this.updateLeaderboard(this.currentLevel);
        
        // Set up periodic updates
        setInterval(() => this.updateLeaderboard(this.currentLevel), this.updateInterval);
    }

    updateLevel(newLevel) {
        // Initial update
        this.currentLevel = newLevel;
    }
}
