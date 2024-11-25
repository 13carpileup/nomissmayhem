export class Music {
    constructor() {
        this.tracks = [
            '../assets/Counterspell.mp3',

        ];

        this.currentTrackIndex = 0;
        this.nextTrackIndex = 1;
        this.currentAudio = new Audio();
        this.nextAudio = new Audio();
        this.fadeTime = 2000; // 2 seconds crossfade
        this.isFirstPlay = true;
    }

    init() {
        this.currentAudio.src = this.tracks[this.currentTrackIndex];
        this.nextAudio.src = this.tracks[this.nextTrackIndex];
        this.currentAudio.volume = 0;
        this.nextAudio.volume = 0;

        // Setup event listeners for track ending
        this.currentAudio.addEventListener('ended', () => this.crossfade());
        this.nextAudio.addEventListener('ended', () => this.crossfade());
    }

    play() {
        if (this.isFirstPlay) {
            this.fadeIn(this.currentAudio);
            this.currentAudio.play();
            this.isFirstPlay = false;
        }
    }

    fadeIn(audio, callback) {
        let volume = 0;
        const interval = 50;
        const step = interval / this.fadeTime;

        const fadeInterval = setInterval(() => {
            volume += step;
            if (volume >= 1) {
                volume = 1;
                clearInterval(fadeInterval);
                if (callback) callback();
            }
            audio.volume = volume;
        }, interval);
    }

    fadeOut(audio, callback) {
        let volume = audio.volume;
        const interval = 50;
        const step = interval / this.fadeTime;

        const fadeInterval = setInterval(() => {
            volume -= step;
            if (volume <= 0) {
                volume = 0;
                clearInterval(fadeInterval);
                audio.pause();
                if (callback) callback();
            }
            audio.volume = volume;
        }, interval);
    }

    crossfade() {
        // Swap current and next tracks
        const temp = this.currentAudio;
        this.currentAudio = this.nextAudio;
        this.nextAudio = temp;

        // Update track indices
        this.currentTrackIndex = this.nextTrackIndex;
        this.nextTrackIndex = (this.nextTrackIndex + 1) % this.tracks.length;

        // Prepare next track
        this.nextAudio.src = this.tracks[this.nextTrackIndex];
        this.nextAudio.volume = 0;

        // Start crossfade
        this.fadeIn(this.currentAudio);
        this.fadeOut(this.nextAudio);
    }

    stop() {
        this.fadeOut(this.currentAudio);
        this.fadeOut(this.nextAudio);
    }
}
