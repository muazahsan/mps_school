/**
 * Drawing Module
 * Handles HTML5 Canvas drawing functionality with pen tools, colors, and save/load features
 */

class DrawingCanvas {
    constructor(canvasId, options = {}) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = null;
        this.isDrawing = false;
        this.lastX = 0;
        this.lastY = 0;
        
        // Drawing settings
        this.currentTool = 'pen';
        this.currentColor = '#000000';
        this.currentSize = 3;
        this.eraserSize = 10;
        
        // Colors palette
        this.colors = [
            '#000000', '#FF0000', '#00FF00', '#0000FF',
            '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500'
        ];
        
        // Options
        this.options = {
            width: 600,
            height: 400,
            backgroundColor: '#FFFFFF',
            ...options
        };
        
        // Save/load functionality
        this.saveKey = 'drawing_';
        this.autoSaveInterval = null;
        
        this.init();
    }

    /**
     * Initialize the canvas
     */
    init() {
        if (!this.canvas) {
            console.error('Canvas element not found');
            return;
        }

        this.ctx = this.canvas.getContext('2d');
        this.setupCanvas();
        this.setupEventListeners();
        this.setupTools();
        this.loadDrawing();
        this.startAutoSave();
        
        console.log('Drawing canvas initialized');
    }

    /**
     * Setup canvas properties
     */
    setupCanvas() {
        // Set canvas size
        this.canvas.width = this.options.width;
        this.canvas.height = this.options.height;
        
        // Set background
        this.ctx.fillStyle = this.options.backgroundColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Set default drawing properties
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.strokeStyle = this.currentColor;
        this.ctx.lineWidth = this.currentSize;
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Mouse events
        this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
        this.canvas.addEventListener('mousemove', (e) => this.draw(e));
        this.canvas.addEventListener('mouseup', () => this.stopDrawing());
        this.canvas.addEventListener('mouseout', () => this.stopDrawing());

        // Touch events for mobile
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.startDrawing(e.touches[0]);
        });
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            this.draw(e.touches[0]);
        });
        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.stopDrawing();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    /**
     * Setup drawing tools
     */
    setupTools() {
        // Create tool buttons if they don't exist
        this.createToolButtons();
        
        // Setup color palette
        this.createColorPalette();
        
        // Setup size controls
        this.createSizeControls();
    }

    /**
     * Create tool buttons
     */
    createToolButtons() {
        const toolContainer = document.querySelector('.drawing-tools') || this.createToolContainer();
        
        const tools = [
            { id: 'pen', icon: '✏️', label: 'Pen' },
            { id: 'eraser', icon: '🧽', label: 'Eraser' },
            { id: 'clear', icon: '🗑️', label: 'Clear' },
            { id: 'save', icon: '💾', label: 'Save' },
            { id: 'load', icon: '📁', label: 'Load' }
        ];

        tools.forEach(tool => {
            const button = document.createElement('button');
            button.className = 'tool-btn';
            button.dataset.tool = tool.id;
            button.innerHTML = `${tool.icon} <span>${tool.label}</span>`;
            button.addEventListener('click', () => this.selectTool(tool.id));
            
            toolContainer.appendChild(button);
        });
    }

    /**
     * Create tool container
     */
    createToolContainer() {
        const container = document.createElement('div');
        container.className = 'drawing-tools';
        container.style.cssText = `
            display: flex;
            gap: 10px;
            margin-bottom: 15px;
            flex-wrap: wrap;
        `;
        
        this.canvas.parentNode.insertBefore(container, this.canvas);
        return container;
    }

    /**
     * Create color palette
     */
    createColorPalette() {
        const colorContainer = document.querySelector('.color-palette') || this.createColorContainer();
        
        this.colors.forEach(color => {
            const colorBtn = document.createElement('button');
            colorBtn.className = 'color-btn';
            colorBtn.style.backgroundColor = color;
            colorBtn.dataset.color = color;
            colorBtn.addEventListener('click', () => this.selectColor(color));
            
            colorContainer.appendChild(colorBtn);
        });
    }

    /**
     * Create color container
     */
    createColorContainer() {
        const container = document.createElement('div');
        container.className = 'color-palette';
        container.style.cssText = `
            display: flex;
            gap: 5px;
            margin-bottom: 15px;
            flex-wrap: wrap;
        `;
        
        this.canvas.parentNode.insertBefore(container, this.canvas);
        return container;
    }

    /**
     * Create size controls
     */
    createSizeControls() {
        const sizeContainer = document.querySelector('.size-controls') || this.createSizeContainer();
        
        const sizes = [
            { value: 2, label: 'Small' },
            { value: 5, label: 'Medium' },
            { value: 10, label: 'Large' }
        ];

        sizes.forEach(size => {
            const button = document.createElement('button');
            button.className = 'size-btn';
            button.dataset.size = size.value;
            button.textContent = size.label;
            button.addEventListener('click', () => this.selectSize(size.value));
            
            sizeContainer.appendChild(button);
        });
    }

    /**
     * Create size container
     */
    createSizeContainer() {
        const container = document.createElement('div');
        container.className = 'size-controls';
        container.style.cssText = `
            display: flex;
            gap: 10px;
            margin-bottom: 15px;
        `;
        
        this.canvas.parentNode.insertBefore(container, this.canvas);
        return container;
    }

    /**
     * Start drawing
     */
    startDrawing(e) {
        this.isDrawing = true;
        const rect = this.canvas.getBoundingClientRect();
        this.lastX = e.clientX - rect.left;
        this.lastY = e.clientY - rect.top;
    }

    /**
     * Draw on canvas
     */
    draw(e) {
        if (!this.isDrawing) return;

        const rect = this.canvas.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;

        this.ctx.beginPath();
        this.ctx.moveTo(this.lastX, this.lastY);
        this.ctx.lineTo(currentX, currentY);
        this.ctx.stroke();

        this.lastX = currentX;
        this.lastY = currentY;
    }

    /**
     * Stop drawing
     */
    stopDrawing() {
        this.isDrawing = false;
    }

    /**
     * Select drawing tool
     */
    selectTool(tool) {
        this.currentTool = tool;
        
        // Update tool buttons
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tool === tool);
        });

        switch (tool) {
            case 'pen':
                this.ctx.globalCompositeOperation = 'source-over';
                this.ctx.strokeStyle = this.currentColor;
                this.ctx.lineWidth = this.currentSize;
                break;
            case 'eraser':
                this.ctx.globalCompositeOperation = 'destination-out';
                this.ctx.lineWidth = this.eraserSize;
                break;
            case 'clear':
                this.clearCanvas();
                break;
            case 'save':
                this.saveDrawing();
                break;
            case 'load':
                this.loadDrawing();
                break;
        }
    }

    /**
     * Select color
     */
    selectColor(color) {
        this.currentColor = color;
        this.ctx.strokeStyle = color;
        
        // Update color buttons
        document.querySelectorAll('.color-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.color === color);
        });
    }

    /**
     * Select size
     */
    selectSize(size) {
        this.currentSize = size;
        this.ctx.lineWidth = size;
        
        // Update size buttons
        document.querySelectorAll('.size-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.size == size);
        });
    }

    /**
     * Clear canvas
     */
    clearCanvas() {
        this.ctx.fillStyle = this.options.backgroundColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Save drawing to localStorage
     */
    saveDrawing() {
        try {
            const imageData = this.canvas.toDataURL('image/png');
            const key = this.saveKey + Date.now();
            localStorage.setItem(key, imageData);
            
            // Show success message
            this.showMessage('Drawing saved successfully!', 'success');
            
            console.log('Drawing saved:', key);
        } catch (error) {
            console.error('Error saving drawing:', error);
            this.showMessage('Error saving drawing', 'error');
        }
    }

    /**
     * Load drawing from localStorage
     */
    loadDrawing() {
        try {
            // Get the most recent drawing
            const keys = Object.keys(localStorage).filter(key => key.startsWith(this.saveKey));
            if (keys.length === 0) return;

            const latestKey = keys.sort().pop();
            const imageData = localStorage.getItem(latestKey);
            
            if (imageData) {
                const img = new Image();
                img.onload = () => {
                    this.clearCanvas();
                    this.ctx.drawImage(img, 0, 0);
                };
                img.src = imageData;
                
                this.showMessage('Drawing loaded successfully!', 'success');
            }
        } catch (error) {
            console.error('Error loading drawing:', error);
            this.showMessage('Error loading drawing', 'error');
        }
    }

    /**
     * Start auto-save functionality
     */
    startAutoSave() {
        this.autoSaveInterval = setInterval(() => {
            if (this.hasChanges()) {
                this.autoSave();
            }
        }, 30000); // Auto-save every 30 seconds
    }

    /**
     * Stop auto-save
     */
    stopAutoSave() {
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
            this.autoSaveInterval = null;
        }
    }

    /**
     * Check if canvas has changes
     */
    hasChanges() {
        // Simple check - in a real app, you might track drawing operations
        return true;
    }

    /**
     * Auto-save drawing
     */
    autoSave() {
        try {
            const imageData = this.canvas.toDataURL('image/png');
            const key = this.saveKey + 'autosave';
            localStorage.setItem(key, imageData);
        } catch (error) {
            console.error('Auto-save failed:', error);
        }
    }

    /**
     * Handle keyboard shortcuts
     */
    handleKeyboard(e) {
        switch (e.key) {
            case 'c':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    this.clearCanvas();
                }
                break;
            case 's':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    this.saveDrawing();
                }
                break;
            case 'z':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    this.undo();
                }
                break;
            case 'Escape':
                this.stopDrawing();
                break;
        }
    }

    /**
     * Undo last action (simple implementation)
     */
    undo() {
        // This is a simplified undo - in a real app, you'd track drawing operations
        this.showMessage('Undo functionality not implemented', 'info');
    }

    /**
     * Show message to user
     */
    showMessage(message, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `drawing-message ${type}`;
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 10px 15px;
            border-radius: 5px;
            color: white;
            font-weight: bold;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;

        // Set background color based on type
        const colors = {
            success: '#4CAF50',
            error: '#F44336',
            info: '#2196F3'
        };
        messageDiv.style.backgroundColor = colors[type] || colors.info;

        document.body.appendChild(messageDiv);

        // Remove after 3 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }

    /**
     * Export drawing as image
     */
    exportAsImage(format = 'png') {
        try {
            const link = document.createElement('a');
            link.download = `drawing_${Date.now()}.${format}`;
            link.href = this.canvas.toDataURL(`image/${format}`);
            link.click();
        } catch (error) {
            console.error('Error exporting image:', error);
            this.showMessage('Error exporting image', 'error');
        }
    }

    /**
     * Get canvas data URL
     */
    getDataURL(format = 'png') {
        return this.canvas.toDataURL(`image/${format}`);
    }

    /**
     * Resize canvas
     */
    resize(width, height) {
        this.options.width = width;
        this.options.height = height;
        this.canvas.width = width;
        this.canvas.height = height;
        this.setupCanvas();
    }

    /**
     * Destroy canvas and cleanup
     */
    destroy() {
        this.stopAutoSave();
        
        // Remove event listeners
        this.canvas.removeEventListener('mousedown', this.startDrawing);
        this.canvas.removeEventListener('mousemove', this.draw);
        this.canvas.removeEventListener('mouseup', this.stopDrawing);
        this.canvas.removeEventListener('mouseout', this.stopDrawing);
        
        // Clear canvas
        this.clearCanvas();
    }
}

// Initialize drawing canvas when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Auto-initialize if canvas exists
    const canvas = document.querySelector('canvas[data-drawing]');
    if (canvas) {
        window.DrawingCanvas = new DrawingCanvas(canvas.id);
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DrawingCanvas;
} 