// Galaxy Animation - Smooth Interactive Milky Way Rainbow Effect
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

// Mouse position tracking with smoothing
let mouse = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    targetX: canvas.width / 2,
    targetY: canvas.height / 2,
    isMoving: false,
    velocity: { x: 0, y: 0 }
};

// Smooth mouse position interpolation
function updateMousePosition() {
    // Smooth interpolation
    const ease = 0.15;
    mouse.x += (mouse.targetX - mouse.x) * ease;
    mouse.y += (mouse.targetY - mouse.y) * ease;
    
    // Calculate velocity for smoother particle generation
    mouse.velocity.x = mouse.targetX - mouse.x;
    mouse.velocity.y = mouse.targetY - mouse.y;
}

// Update mouse target position
document.addEventListener('mousemove', (e) => {
    mouse.targetX = e.clientX;
    mouse.targetY = e.clientY;
    mouse.isMoving = true;
    
    clearTimeout(mouse.timer);
    mouse.timer = setTimeout(() => {
        mouse.isMoving = false;
    }, 150);
});

// Touch support for mobile
document.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
        mouse.targetX = e.touches[0].clientX;
        mouse.targetY = e.touches[0].clientY;
        mouse.isMoving = true;
    }
});

// Smooth Particle class
class Particle {
    constructor(x, y, hue, size = null) {
        this.x = x;
        this.y = y;
        this.size = size || (Math.random() * 2 + 0.5);
        // Much gentler speeds for smoother movement
        this.speedX = (Math.random() - 0.5) * 1;
        this.speedY = (Math.random() - 0.5) * 1;
        this.color = hue;
        this.life = 1;
        this.decay = Math.random() * 0.003 + 0.002; // Slower decay
        this.trail = [];
        this.maxTrailLength = 15;
        // Add acceleration for natural movement
        this.accX = 0;
        this.accY = 0;
    }

    update() {
        // Store trail position
        if (Math.random() > 0.3) { // Don't store every frame for performance
            this.trail.push({ 
                x: this.x, 
                y: this.y, 
                life: this.life,
                size: this.size 
            });
            if (this.trail.length > this.maxTrailLength) {
                this.trail.shift();
            }
        }

        // Apply acceleration for organic movement
        this.accX = (Math.random() - 0.5) * 0.05;
        this.accY = (Math.random() - 0.5) * 0.05;
        
        this.speedX += this.accX;
        this.speedY += this.accY;
        
        // Apply friction for smoother movement
        this.speedX *= 0.98;
        this.speedY *= 0.98;
        
        // Update position
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Gentle decay
        this.life -= this.decay;
        if (this.size > 0.1) this.size -= 0.005;
    }

    draw() {
        ctx.save();
        
        // Draw smooth trail
        if (this.trail.length > 1) {
            ctx.beginPath();
            ctx.moveTo(this.trail[0].x, this.trail[0].y);
            
            // Use quadratic curves for smoother trails
            for (let i = 1; i < this.trail.length - 1; i++) {
                const cp = this.trail[i];
                const next = this.trail[i + 1];
                const midX = (cp.x + next.x) / 2;
                const midY = (cp.y + next.y) / 2;
                
                ctx.quadraticCurveTo(cp.x, cp.y, midX, midY);
            }
            
            // Gradient stroke for trail
            const gradient = ctx.createLinearGradient(
                this.trail[0].x, this.trail[0].y,
                this.x, this.y
            );
            gradient.addColorStop(0, `hsla(${this.color}, 70%, 50%, 0)`);
            gradient.addColorStop(0.5, `hsla(${this.color}, 80%, 55%, ${this.life * 0.2})`);
            gradient.addColorStop(1, `hsla(${this.color}, 90%, 60%, ${this.life * 0.4})`);
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = this.size * 2;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.globalAlpha = this.life * 0.6;
            ctx.stroke();
        }
        
        // Ultra-smooth glow effect
        const glowSize = this.size * 8;
        const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, glowSize
        );
        
        gradient.addColorStop(0, `hsla(${this.color}, 100%, 70%, ${this.life * 0.6})`);
        gradient.addColorStop(0.3, `hsla(${this.color}, 100%, 60%, ${this.life * 0.3})`);
        gradient.addColorStop(0.6, `hsla(${this.color}, 90%, 50%, ${this.life * 0.1})`);
        gradient.addColorStop(1, `hsla(${this.color}, 80%, 40%, 0)`);
        
        ctx.globalAlpha = this.life * 0.7;
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, glowSize, 0, Math.PI * 2);
        ctx.fill();
        
        // Bright core with soft edges
        ctx.globalAlpha = this.life;
        ctx.fillStyle = `hsla(${this.color}, 100%, 90%, ${this.life * 0.8})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
}

// Flowing trail system for ultra-smooth effect
class FlowTrail {
    constructor() {
        this.points = [];
        this.maxPoints = 40;
    }
    
    addPoint(x, y, hue) {
        this.points.push({
            x: x,
            y: y,
            hue: hue,
            life: 1,
            size: 15
        });
        
        if (this.points.length > this.maxPoints) {
            this.points.shift();
        }
    }
    
    update() {
        this.points.forEach(point => {
            point.life -= 0.02;
            point.size *= 0.98;
        });
        
        this.points = this.points.filter(p => p.life > 0);
    }
    
    draw() {
        if (this.points.length < 2) return;
        
        ctx.save();
        
        // Draw smooth bezier curve through points
        ctx.beginPath();
        ctx.moveTo(this.points[0].x, this.points[0].y);
        
        for (let i = 0; i < this.points.length - 2; i++) {
            const p0 = this.points[i];
            const p1 = this.points[i + 1];
            const p2 = this.points[i + 2];
            
            const cp1x = p1.x;
            const cp1y = p1.y;
            const cp2x = p1.x;
            const cp2y = p1.y;
            const endX = (p1.x + p2.x) / 2;
            const endY = (p1.y + p2.y) / 2;
            
            ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY);
        }
        
        // Create flowing gradient
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
                    `hsla(${point.hue}, 100%, 60%, ${point.life * 0.3})`
                );
            });
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 25;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.globalCompositeOperation = 'lighter';
            ctx.globalAlpha = 0.4;
            ctx.stroke();
            
            // Second pass for glow
            ctx.lineWidth = 50;
            ctx.globalAlpha = 0.1;
            ctx.stroke();
        }
        
        ctx.restore();
    }
}

// Initialize smooth systems
const particles = [];
const flowTrail = new FlowTrail();
const stars = [];
let hue = 0;

// Create subtle background stars
for (let i = 0; i < 80; i++) {
    stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5,
        brightness: Math.random()
    });
}

// Main animation loop
function animate() {
    // Ultra-smooth fade effect (smaller fade = smoother trails)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.02)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Update smooth mouse position
    updateMousePosition();
    
    // Draw stars with twinkle
    ctx.save();
    stars.forEach(star => {
        star.brightness += (Math.random() - 0.5) * 0.01;
        star.brightness = Math.max(0.2, Math.min(1, star.brightness));
        
        ctx.globalAlpha = star.brightness * 0.6;
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
    });
    ctx.restore();
    
    // Update and draw flow trail
    if (mouse.isMoving) {
        flowTrail.addPoint(mouse.x, mouse.y, hue);
    }
    flowTrail.update();
    flowTrail.draw();
    
    // Generate smooth particle stream when mouse moves
    if (mouse.isMoving) {
        // Fewer particles but more consistent generation
        if (Math.random() > 0.2) {
            // Main particle at cursor
            particles.push(new Particle(
                mouse.x + (Math.random() - 0.5) * 10,
                mouse.y + (Math.random() - 0.5) * 10,
                hue
            ));
            
            // Orbiting particles for richness
            const angle = (Date.now() / 100) + Math.random() * Math.PI * 2;
            const distance = 20 + Math.random() * 30;
            particles.push(new Particle(
                mouse.x + Math.cos(angle) * distance,
                mouse.y + Math.sin(angle) * distance,
                hue + 30,
                Math.random() * 1.5 + 0.5
            ));
        }
    }
    
    // Update and draw particles with smooth rendering
    ctx.save();
    ctx.globalCompositeOperation = 'screen'; // Additive blending for glow
    
    particles.forEach((particle, index) => {
        particle.update();
        particle.draw();
        
        if (particle.life <= 0) {
            particles.splice(index, 1);
        }
    });
    
    ctx.restore();
    
    // Smooth rainbow hue transition
    hue += 0.5; // Slower color change for smoothness
    if (hue > 360) hue = 0;
    
    // Super subtle mouse glow
    if (mouse.isMoving) {
        ctx.save();
        const glowGradient = ctx.createRadialGradient(
            mouse.x, mouse.y, 0,
            mouse.x, mouse.y, 200
        );
        glowGradient.addColorStop(0, `hsla(${hue}, 100%, 50%, 0.05)`);
        glowGradient.addColorStop(0.5, `hsla(${hue}, 100%, 50%, 0.02)`);
        glowGradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = glowGradient;
        ctx.globalCompositeOperation = 'lighter';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
    }
    
    // Limit particles for performance
    if (particles.length > 150) {
        particles.splice(0, particles.length - 150);
    }
    
    requestAnimationFrame(animate);
}

// Start smooth animation
animate();

// Gentle welcome effect
setTimeout(() => {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    for (let i = 0; i < 20; i++) {
        const angle = (Math.PI * 2 * i) / 20;
        const particle = new Particle(centerX, centerY, i * 18);
        particle.speedX = Math.cos(angle) * 2;
        particle.speedY = Math.sin(angle) * 2;
        particle.size = 2;
        particles.push(particle);
    }
}, 500);