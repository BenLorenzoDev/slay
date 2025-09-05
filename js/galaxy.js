// Smoke Animation with Mouse Trail Effect
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

// Smoke Particle class
class SmokeParticle {
    constructor(x, y, isMouseTrail = false) {
        this.x = x;
        this.y = y;
        this.isMouseTrail = isMouseTrail;
        
        if (isMouseTrail) {
            // Mouse trail particles are smaller and fade faster
            this.size = Math.random() * 20 + 10;
            this.targetOpacity = Math.random() * 0.15 + 0.05;
            this.maxLife = Math.random() * 60 + 40;
            this.speedX = (Math.random() - 0.5) * 0.8;
            this.speedY = Math.random() * -0.5 - 0.3;
        } else {
            // Background smoke particles
            this.size = Math.random() * 80 + 40;
            this.targetOpacity = Math.random() * 0.08 + 0.02;
            this.maxLife = Math.random() * 200 + 300;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = Math.random() * -0.8 - 0.2;
        }
        
        this.opacity = 0;
        this.life = 0;
        this.angle = Math.random() * Math.PI * 2;
        this.angleSpeed = (Math.random() - 0.5) * 0.02;
        this.growing = true;
    }

    update() {
        // Update life cycle
        this.life++;
        
        // Fade in effect
        if (this.growing && this.opacity < this.targetOpacity) {
            this.opacity += this.isMouseTrail ? 0.01 : 0.001;
        }
        
        // Start fading when life is almost over
        if (this.life > this.maxLife * 0.7) {
            this.opacity -= this.isMouseTrail ? 0.01 : 0.002;
            this.growing = false;
        }
        
        // Natural upward drift
        this.speedY *= 0.99;
        this.y += this.speedY;
        
        // Gentle horizontal sway using sine wave
        this.x += this.speedX + Math.sin(this.life * 0.01) * 0.2;
        
        // Slow rotation
        this.angle += this.angleSpeed;
        
        // Gradual size increase (smoke expands)
        if (this.size < (this.isMouseTrail ? 50 : 200)) {
            this.size += this.isMouseTrail ? 0.5 : 0.3;
        }
        
        // Apply gentle wind effect
        this.speedX += (Math.random() - 0.5) * 0.02;
        this.speedX *= 0.98; // Damping
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        
        // Create gradient for each smoke particle
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
        
        if (this.isMouseTrail) {
            // Mouse trail has a slight purple tint
            const hue = 250 + Math.random() * 20;
            const lightness = 75 + Math.random() * 15;
            gradient.addColorStop(0, `hsla(${hue}, 30%, ${lightness}%, ${this.opacity})`);
            gradient.addColorStop(0.4, `hsla(${hue}, 20%, ${lightness}%, ${this.opacity * 0.8})`);
            gradient.addColorStop(0.7, `hsla(${hue}, 15%, ${lightness}%, ${this.opacity * 0.4})`);
            gradient.addColorStop(1, `hsla(${hue}, 10%, ${lightness}%, 0)`);
        } else {
            // Background smoke is neutral gray
            const lightness = 85 + Math.random() * 10;
            gradient.addColorStop(0, `hsla(250, 20%, ${lightness}%, ${this.opacity})`);
            gradient.addColorStop(0.4, `hsla(250, 15%, ${lightness}%, ${this.opacity * 0.8})`);
            gradient.addColorStop(0.7, `hsla(250, 10%, ${lightness}%, ${this.opacity * 0.4})`);
            gradient.addColorStop(1, `hsla(250, 10%, ${lightness}%, 0)`);
        }
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
}

// Mouse Trail System
class MouseTrail {
    constructor() {
        this.points = [];
        this.maxPoints = 10;
        this.lastX = null;
        this.lastY = null;
        this.trailTimer = 0;
    }
    
    addPoint(x, y) {
        // Only add point if mouse has moved enough
        if (this.lastX !== null && this.lastY !== null) {
            const distance = Math.sqrt((x - this.lastX) ** 2 + (y - this.lastY) ** 2);
            
            // Only create trail if mouse moved more than 5 pixels
            if (distance > 5) {
                this.points.push({ x, y, life: 1 });
                
                if (this.points.length > this.maxPoints) {
                    this.points.shift();
                }
                
                this.lastX = x;
                this.lastY = y;
                
                return true; // Signal to create smoke particle
            }
        } else {
            this.lastX = x;
            this.lastY = y;
        }
        
        return false;
    }
    
    update() {
        // Decay trail points
        this.points.forEach(point => {
            point.life -= 0.02;
        });
        
        // Remove dead points
        this.points = this.points.filter(p => p.life > 0);
    }
    
    draw() {
        if (this.points.length < 2) return;
        
        ctx.save();
        
        // Draw smooth trail line
        ctx.beginPath();
        ctx.moveTo(this.points[0].x, this.points[0].y);
        
        for (let i = 1; i < this.points.length; i++) {
            const prev = this.points[i - 1];
            const curr = this.points[i];
            
            // Use quadratic curves for smooth trail
            const midX = (prev.x + curr.x) / 2;
            const midY = (prev.y + curr.y) / 2;
            
            ctx.quadraticCurveTo(prev.x, prev.y, midX, midY);
        }
        
        // Style the trail
        ctx.strokeStyle = `rgba(255, 255, 255, 0.02)`;
        ctx.lineWidth = 30;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.globalCompositeOperation = 'lighter';
        ctx.stroke();
        
        ctx.restore();
    }
}

// Ambient floating particles for depth
class AmbientParticle {
    constructor() {
        this.reset();
        this.y = Math.random() * canvas.height;
    }
    
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 50;
        this.size = Math.random() * 3 + 1;
        this.speedY = Math.random() * -0.5 - 0.1;
        this.speedX = (Math.random() - 0.5) * 0.2;
        this.opacity = Math.random() * 0.3 + 0.1;
        this.pulse = Math.random() * Math.PI * 2;
    }
    
    update() {
        this.y += this.speedY;
        this.x += this.speedX + Math.sin(this.pulse) * 0.3;
        this.pulse += 0.02;
        
        // Reset when particle goes off screen
        if (this.y < -50) {
            this.reset();
        }
    }
    
    draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity * Math.sin(this.pulse) * 0.5 + 0.5;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// Initialize particles arrays
const smokeParticles = [];
const ambientParticles = [];
const mouseTrail = new MouseTrail();

// Create initial ambient particles
for (let i = 0; i < 30; i++) {
    ambientParticles.push(new AmbientParticle());
}

// Mouse interaction
let mouseX = canvas.width / 2;
let mouseY = canvas.height / 2;
let isMouseMoving = false;
let mouseTimer;
let lastMouseTime = 0;

// Track mouse movement
document.addEventListener('mousemove', (e) => {
    const currentTime = Date.now();
    mouseX = e.clientX;
    mouseY = e.clientY;
    isMouseMoving = true;
    
    // Add to trail and create smoke particles
    if (mouseTrail.addPoint(mouseX, mouseY)) {
        // Create multiple small smoke particles for trail
        if (currentTime - lastMouseTime > 30) { // Throttle particle creation
            for (let i = 0; i < 2; i++) {
                const offsetX = (Math.random() - 0.5) * 20;
                const offsetY = (Math.random() - 0.5) * 20;
                smokeParticles.push(new SmokeParticle(
                    mouseX + offsetX,
                    mouseY + offsetY,
                    true // Mark as mouse trail particle
                ));
            }
            lastMouseTime = currentTime;
        }
    }
    
    clearTimeout(mouseTimer);
    mouseTimer = setTimeout(() => {
        isMouseMoving = false;
    }, 100);
});

// Touch support
document.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
        const currentTime = Date.now();
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
        isMouseMoving = true;
        
        // Add to trail and create smoke particles
        if (mouseTrail.addPoint(mouseX, mouseY)) {
            if (currentTime - lastMouseTime > 30) {
                for (let i = 0; i < 2; i++) {
                    const offsetX = (Math.random() - 0.5) * 20;
                    const offsetY = (Math.random() - 0.5) * 20;
                    smokeParticles.push(new SmokeParticle(
                        mouseX + offsetX,
                        mouseY + offsetY,
                        true
                    ));
                }
                lastMouseTime = currentTime;
            }
        }
        
        clearTimeout(mouseTimer);
        mouseTimer = setTimeout(() => {
            isMouseMoving = false;
        }, 100);
    }
});

// Smoke generation timer
let smokeGenerationTimer = 0;

// Main animation loop
function animate() {
    // Clear canvas with subtle fade
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw mouse trail
    mouseTrail.update();
    mouseTrail.draw();
    
    // Update and draw ambient particles
    ambientParticles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    
    // Generate background smoke particles at regular intervals
    smokeGenerationTimer++;
    if (smokeGenerationTimer > 15) {
        smokeGenerationTimer = 0;
        
        // Generate from bottom of screen
        if (Math.random() > 0.3) {
            smokeParticles.push(new SmokeParticle(
                Math.random() * canvas.width,
                canvas.height + 50,
                false
            ));
        }
        
        // Generate from sides occasionally
        if (Math.random() > 0.7) {
            const side = Math.random() > 0.5 ? 0 : canvas.width;
            smokeParticles.push(new SmokeParticle(
                side,
                canvas.height * 0.7 + Math.random() * canvas.height * 0.3,
                false
            ));
        }
    }
    
    // Update and draw smoke particles
    for (let i = smokeParticles.length - 1; i >= 0; i--) {
        const particle = smokeParticles[i];
        particle.update();
        
        if (particle.opacity > 0) {
            particle.draw();
        } else {
            // Remove dead particles
            smokeParticles.splice(i, 1);
        }
    }
    
    // Add subtle vignette effect
    const vignette = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width * 0.7
    );
    vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vignette.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Limit smoke particles for performance
    if (smokeParticles.length > 60) {
        // Prioritize keeping mouse trail particles
        const mouseTrailParticles = smokeParticles.filter(p => p.isMouseTrail);
        const backgroundParticles = smokeParticles.filter(p => !p.isMouseTrail);
        
        // Keep more recent particles
        if (mouseTrailParticles.length > 30) {
            mouseTrailParticles.splice(0, mouseTrailParticles.length - 30);
        }
        if (backgroundParticles.length > 30) {
            backgroundParticles.splice(0, backgroundParticles.length - 30);
        }
        
        smokeParticles.length = 0;
        smokeParticles.push(...mouseTrailParticles, ...backgroundParticles);
    }
    
    requestAnimationFrame(animate);
}

// Start animation
animate();

// Initial smoke burst
setTimeout(() => {
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            smokeParticles.push(new SmokeParticle(
                canvas.width / 2 + (Math.random() - 0.5) * 200,
                canvas.height * 0.7,
                false
            ));
        }, i * 200);
    }
}, 1000);