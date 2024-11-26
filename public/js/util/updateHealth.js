export class PixelHealthBar {
    constructor(maxHealth, options = {}) {
        this.maxHealth = maxHealth;
        this.options = {
            width: options.width || 100,
            height: options.height || 20,
            x: options.x || 20,
            y: options.y || 20,
            backgroundColor: options.backgroundColor || '#111',
            borderColor: options.borderColor || '#fff',
            healthyColor: options.healthyColor || '#3f3',
            warningColor: options.warningColor || '#ff3',
            dangerColor: options.dangerColor || '#f33',
            emptyColor: options.emptyColor || '#444'
        };

        this.segmentCount = Math.ceil(maxHealth / 10);

        this.segments = [];
        this.initialize();
    }

    initialize() {
        this.container = document.createElement('div');
        this.container.style.cssText = `
            position: fixed;
            top: ${this.options.y}px;
            left: ${this.options.x}px;
            width: ${this.options.width}px;
            height: ${this.options.height}px;
            background-color: ${this.options.backgroundColor};
            border: 2px solid ${this.options.borderColor};
            image-rendering: pixelated;
            display: flex;
            padding: 2px;
            box-sizing: border-box;
        `;

        const segmentWidth = (this.options.width - 8) / this.segmentCount;
        
        for (let i = 0; i < this.segmentCount; i++) {
            const segment = document.createElement('div');
            segment.style.cssText = `
                width: ${segmentWidth - 1}px;
                height: 100%;
                background-color: ${this.options.healthyColor};
                margin-right: 1px;
                transition: background-color 0.2s ease-out;
            `;
            this.segments.push(segment);
            this.container.appendChild(segment);
        }

        document.body.appendChild(this.container);
    }

    update(currentHealth) {
        const filledSegments = Math.ceil(currentHealth / 10);
        const healthPercent = currentHealth / this.maxHealth;

        this.segments.forEach((segment, index) => {
            if (index < filledSegments) {
                if (healthPercent > 0.6) {
                    segment.style.backgroundColor = this.options.healthyColor;
                } else if (healthPercent > 0.3) {
                    segment.style.backgroundColor = this.options.warningColor;
                } else {
                    segment.style.backgroundColor = this.options.dangerColor;
                }
            } else {
                segment.style.backgroundColor = this.options.emptyColor;
            }
        });
    }

    setMaxHealth(newMax) {
        console.log('hellooooooo')
        this.maxHealth = newMax;
        const newSegmentCount = Math.ceil(newMax / 10);
        console.log('update neaht')
        console.log('hawk tuah')
        if (newSegmentCount !== this.segmentCount) {
            console.log('update segs')
            this.segmentCount = newSegmentCount;
            this.container.innerHTML = ''; // Clear existing segments
            this.segments = [];
            
            const segmentWidth = (this.options.width - 8) / this.segmentCount;
            
            for (let i = 0; i < this.segmentCount; i++) {
                const segment = document.createElement('div');
                segment.style.cssText = `
                    width: ${segmentWidth - 1}px;
                    height: 100%;
                    background-color: ${this.options.emptyColor};
                    margin-right: 1px;
                    transition: background-color 0.2s ease-out;
                `;
                this.segments.push(segment);
                this.container.appendChild(segment);
            }
        }
    }

    destroy() {
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
    }
}

export default PixelHealthBar;

