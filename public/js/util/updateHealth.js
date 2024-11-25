export class HealthBar {
    constructor(maxHealth, options = {}) {
        this.maxHealth = maxHealth;
        this.options = {
            width: options.width || 200,
            height: options.height || 20,
            x: options.x || 20,
            y: options.y || 20,
            borderRadius: options.borderRadius || 10,
            backgroundColor: options.backgroundColor || '#333',
            borderColor: options.borderColor || '#000',
            healthyColor: options.healthyColor || '#33ff33',
            warningColor: options.warningColor || '#ffff33',
            dangerColor: options.dangerColor || '#ff3333'
        };

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
            border-radius: ${this.options.borderRadius}px;
            overflow: hidden;
        `;
        
        this.bar = document.createElement('div');
        this.bar.style.cssText = `
            width: 100%;
            height: 100%;
            background-color: ${this.options.healthyColor};
            transition: width 0.2s ease-out;
        `;
        
        this.container.appendChild(this.bar);
        document.body.appendChild(this.container);
    }

    update(currentHealth) {
        const healthPercent = Math.max(0, currentHealth / this.maxHealth);
        this.bar.style.width = `${healthPercent * 100}%`;
        
        // Update color based on health percentage
        if (healthPercent > 0.6) {
            this.bar.style.backgroundColor = this.options.healthyColor;
        } else if (healthPercent > 0.3) {
            this.bar.style.backgroundColor = this.options.warningColor;
        } else {
            this.bar.style.backgroundColor = this.options.dangerColor;
        }
    }

    setMaxHealth(newMax) {
        this.maxHealth = newMax;
    }

    destroy() {
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
    }
}

export default HealthBar;