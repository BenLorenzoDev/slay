// Galactic Animation with Continuous Colorful Smoke Trail
const canvas = document.getElementById('galaxy-canvas');
const ctx = canvas.getContext('2d');

// Enable smooth rendering
ctx.imageSmoothingEnabled = true;
ctx.imageSmoothingQuality = 'high';

// Set canvas size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Star class for background
class Star {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2;
        this.brightness = Math.random();
        this.twinkleSpeed = Math.random() * 0.05 + 0.01;
        this.color = this.getStarColor();
    }
    
    getStarColor() {
        const colors = [
            '#ffffff', '#ffe9c4', '#d4f1ff', '#ffd4ff', '#e4d4ff'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    update() {
        this.brightness += this.twinkleSpeed;
        if (this.brightness > 1 || this.brightness < 0) {
            this.twinkleSpeed = -this.twinkleSpeed;
        }
    }
    
    draw() {
        ctx.save();
        ctx.globalAlpha = this.brightness;
        
        // Draw star glow
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 3);
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fillRect(this.x - this.size * 3, this.y - this.size * 3, this.size * 6, this.size * 6);
        
        // Draw star core
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
}

// Nebula Particle class
class NebulaParticle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 150 + 50;
        this.hue = Math.random() * 360;
        this.saturation = 70;
        this.lightness = 50;
        this.opacity = Math.random() * 0.03 + 0.01;
        this.speedX = (Math.random() - 0.5) * 0.2;
        this.speedY = (Math.random() - 0.5) * 0.2;
        this.life = 0;
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.hue += 0.5;
        this.life += 0.01;
        this.size *= 1.001;
        
        // Slowly fade
        if (this.life > 0.5) {
            this.opacity *= 0.995;
        }
    }
    
    draw() {
        ctx.save();
        
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        gradient.addColorStop(0, `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${this.opacity})`);
        gradient.addColorStop(0.4, `hsla(${this.hue + 30}, ${this.saturation}%, ${this.lightness - 10}%, ${this.opacity * 0.5})`);
        gradient.addColorStop(1, `hsla(${this.hue + 60}, ${this.saturation}%, ${this.lightness - 20}%, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(this.x - this.size, this.y - this.size, this.size * 2, this.size * 2);
        
        ctx.restore();
    }
}

// Continuous Trail Particle class
class TrailParticle {
    constructor(x, y, hue, size = null, velocity = null) {
        this.x = x;
        this.y = y;
        this.size = size || Math.random() * 15 + 5;
        this.hue = hue;
        this.saturation = 80 + Math.random() * 20;
        this.lightness = 60 + Math.random() * 20;
        this.opacity = 0.6;
        this.life = 1;
        this.decay = 0.01;
        
        if (velocity) {
            this.speedX = velocity.x * 0.2 + (Math.random() - 0.5) * 0.5;
            this.speedY = velocity.y * 0.2 + (Math.random() - 0.5) * 0.5;
        } else {
            this.speedX = (Math.random() - 0.5) * 1;
            this.speedY = (Math.random() - 0.5) * 1;
        }
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.speedX *= 0.98;
        this.speedY *= 0.98;
        this.life -= this.decay;
        this.opacity = this.life * 0.6;
        this.size *= 1.02; // Expand slightly
    }
    
    draw() {
        ctx.save();
        
        // Multi-layer glow effect
        for (let i = 3; i > 0; i--) {
            const gradient = ctx.createRadialGradient(
                this.x, this.y, 0,
                this.x, this.y, this.size * i
            );
            
            const alpha = this.opacity * (0.3 / i);
            gradient.addColorStop(0, `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${alpha})`);
            gradient.addColorStop(0.4, `hsla(${this.hue + 20}, ${this.saturation}%, ${this.lightness - 10}%, ${alpha * 0.5})`);
            gradient.addColorStop(1, 'transparent');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * i, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    }
}

// Continuous Trail System
class ContinuousTrail {
    constructor() {
        this.points = [];
        this.maxPoints = 50;
        this.lastX = null;
        this.lastY = null;
        this.hue = 0;
        this.lastTime = Date.now();
    }
    
    addPoint(x, y) {
        const currentTime = Date.now();
        const timeDelta = currentTime - this.lastTime;
        
        if (this.lastX !== null && this.lastY !== null) {
            const distance = Math.sqrt((x - this.lastX) ** 2 + (y - this.lastY) ** 2);
            
            // Calculate velocity for smooth interpolation
            const velocity = {
                x: (x - this.lastX) / (timeDelta + 1),
                y: (y - this.lastY) / (timeDelta + 1)
            };
            
            // Interpolate points for continuous trail
            const steps = Math.max(1, Math.floor(distance / 3));
            
            for (let i = 0; i <= steps; i++) {
                const t = i / steps;
                const interpX = this.lastX + (x - this.lastX) * t;
                const interpY = this.lastY + (y - this.lastY) * t;
                
                this.points.push({
                    x: interpX,
                    y: interpY,
                    hue: this.hue,
                    life: 1,
                    velocity: velocity
                });
                
                // Advance hue for rainbow effect
                this.hue = (this.hue + 2) % 360;
            }
            
            // Limit trail length
            while (this.points.length > this.maxPoints) {
                this.points.shift();
            }
        }
        
        this.lastX = x;
        this.lastY = y;
        this.lastTime = currentTime;
    }
    
    update() {
        this.points.forEach(point => {
            point.life -= 0.015;
        });
        
        this.points = this.points.filter(p => p.life > 0);
    }
    
    draw() {
        if (this.points.length < 2) return;
        
        // Draw continuous flowing trail
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        
        // Create smooth bezier path
        ctx.beginPath();
        ctx.moveTo(this.points[0].x, this.points[0].y);
        
        for (let i = 1; i < this.points.length - 1; i++) {
            const cp = this.points[i];
            const next = this.points[i + 1];
            
            const cpx = (cp.x + next.x) / 2;
            const cpy = (cp.y + next.y) / 2;
            
            ctx.quadraticCurveTo(cp.x, cp.y, cpx, cpy);
        }
        
        // Create gradient along the trail
        if (this.points.length > 1) {
            const gradient = ctx.createLinearGradient(
                this.points[0].x, this.points[0].y,
                this.points[this.points.length - 1].x, 
                this.points[this.points.length - 1].y
            );
            
            this.points.forEach((point, index) => {
                const position = index / (this.points.length - 1);
                gradient.addColorStop(
                    position,
                    `hsla(${point.hue}, 100%, 60%, ${point.life * 0.5})`
                );
            });
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 20;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.stroke();
            
            // Second pass for glow
            ctx.lineWidth = 40;
            ctx.globalAlpha = 0.3;
            ctx.stroke();
        }
        
        ctx.restore();
    }
}

// Initialize particles and systems
const stars = [];
const nebulaParticles = [];
const trailParticles = [];
const continuousTrail = new ContinuousTrail();

// Create starfield
for (let i = 0; i < 200; i++) {
    stars.push(new Star());
}

// Mouse tracking
let mouseX = canvas.width / 2;
let mouseY = canvas.height / 2;
let isMouseMoving = false;
let mouseTimer;
let colorHue = 0;

// Track mouse movement
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    isMouseMoving = true;
    
    // Add to continuous trail
    continuousTrail.addPoint(mouseX, mouseY);
    
    // Create trail particles
    for (let i = 0; i < 3; i++) {
        const particle = new TrailParticle(
            mouseX + (Math.random() - 0.5) * 10,
            mouseY + (Math.random() - 0.5) * 10,
            colorHue,
            Math.random() * 10 + 5,
            { x: e.movementX || 0, y: e.movementY || 0 }
        );
        trailParticles.push(particle);
    }
    
    // Advance color
    colorHue = (colorHue + 3) % 360;
    
    clearTimeout(mouseTimer);
    mouseTimer = setTimeout(() => {
        isMouseMoving = false;
    }, 100);
});

// Touch support
document.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
        const touch = e.touches[0];
        mouseX = touch.clientX;
        mouseY = touch.clientY;
        isMouseMoving = true;
        
        continuousTrail.addPoint(mouseX, mouseY);
        
        for (let i = 0; i < 3; i++) {
            const particle = new TrailParticle(
                mouseX + (Math.random() - 0.5) * 10,
                mouseY + (Math.random() - 0.5) * 10,
                colorHue
            );
            trailParticles.push(particle);
        }
        
        colorHue = (colorHue + 3) % 360;
        
        clearTimeout(mouseTimer);
        mouseTimer = setTimeout(() => {
            isMouseMoving = false;
        }, 100);
    }
});

// Nebula generation timer
let nebulaTimer = 0;

// Main animation loop
function animate() {
    // Create deep space background
    ctx.fillStyle = 'rgba(5, 0, 15, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw and update stars
    stars.forEach(star => {
        star.update();
        star.draw();
    });
    
    // Generate nebula particles occasionally
    nebulaTimer++;
    if (nebulaTimer > 60) {
        nebulaTimer = 0;
        if (Math.random() > 0.5) {
            nebulaParticles.push(new NebulaParticle(
                Math.random() * canvas.width,
                Math.random() * canvas.height
            ));
        }
    }
    
    // Update and draw nebula
    for (let i = nebulaParticles.length - 1; i >= 0; i--) {
        const particle = nebulaParticles[i];
        particle.update();
        particle.draw();
        
        if (particle.opacity < 0.001) {
            nebulaParticles.splice(i, 1);
        }
    }
    
    // Update and draw continuous trail
    continuousTrail.update();
    continuousTrail.draw();
    
    // Update and draw trail particles
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    
    for (let i = trailParticles.length - 1; i >= 0; i--) {
        const particle = trailParticles[i];
        particle.update();
        
        if (particle.life > 0) {
            particle.draw();
        } else {
            trailParticles.splice(i, 1);
        }
    }
    
    ctx.restore();
    
    // Add cosmic dust effect
    if (Math.random() > 0.98) {
        const dustX = Math.random() * canvas.width;
        const dustY = Math.random() * canvas.height;
        
        ctx.save();
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(dustX, dustY, Math.random() * 1, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
    
    // Limit particles for performance
    if (nebulaParticles.length > 10) {
        nebulaParticles.splice(0, nebulaParticles.length - 10);
    }
    
    if (trailParticles.length > 100) {
        trailParticles.splice(0, trailParticles.length - 100);
    }
    
    requestAnimationFrame(animate);
}

// Start animation
animate();

// Create initial nebula burst
setTimeout(() => {
    for (let i = 0; i < 5; i++) {
        nebulaParticles.push(new NebulaParticle(
            canvas.width / 2 + (Math.random() - 0.5) * 300,
            canvas.height / 2 + (Math.random() - 0.5) * 300
        ));
    }
}, 1000);