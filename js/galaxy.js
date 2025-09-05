// Smoke Animation - Subtle and Elegant Background Effect
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
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 80 + 40;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = Math.random() * -0.8 - 0.2;
        this.opacity = 0;
        this.targetOpacity = Math.random() * 0.08 + 0.02;
        this.life = 0;
        this.maxLife = Math.random() * 200 + 300;
        this.angle = Math.random() * Math.PI * 2;
        this.angleSpeed = (Math.random() - 0.5) * 0.02;
        this.growing = true;
    }

    update() {
        // Update life cycle
        this.life++;
        
        // Fade in effect
        if (this.growing && this.opacity < this.targetOpacity) {
            this.opacity += 0.001;
        }
        
        // Start fading when life is almost over
        if (this.life > this.maxLife * 0.8) {
            this.opacity -= 0.002;
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
        if (this.size < 200) {
            this.size += 0.3;
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
        
        // Soft white/gray smoke colors
        const lightness = 85 + Math.random() * 10;
        gradient.addColorStop(0, `hsla(250, 20%, ${lightness}%, ${this.opacity})`);
        gradient.addColorStop(0.4, `hsla(250, 15%, ${lightness}%, ${this.opacity * 0.8})`);
        gradient.addColorStop(0.7, `hsla(250, 10%, ${lightness}%, ${this.opacity * 0.4})`);
        gradient.addColorStop(1, `hsla(250, 10%, ${lightness}%, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fill();
        
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

// Create initial ambient particles
for (let i = 0; i < 30; i++) {
    ambientParticles.push(new AmbientParticle());
}

// Mouse interaction
let mouseX = canvas.width / 2;
let mouseY = canvas.height / 2;
let isMouseMoving = false;
let mouseTimer;

canvas.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    isMouseMoving = true;
    
    clearTimeout(mouseTimer);
    mouseTimer = setTimeout(() => {
        isMouseMoving = false;
    }, 100);
});

// Touch support
canvas.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
        isMouseMoving = true;
        
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
    
    // Update and draw ambient particles
    ambientParticles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    
    // Generate smoke particles at regular intervals
    smokeGenerationTimer++;
    if (smokeGenerationTimer > 15) {
        smokeGenerationTimer = 0;
        
        // Generate from bottom of screen
        if (Math.random() > 0.3) {
            smokeParticles.push(new SmokeParticle(
                Math.random() * canvas.width,
                canvas.height + 50
            ));
        }
        
        // Generate from sides occasionally
        if (Math.random() > 0.7) {
            const side = Math.random() > 0.5 ? 0 : canvas.width;
            smokeParticles.push(new SmokeParticle(
                side,
                canvas.height * 0.7 + Math.random() * canvas.height * 0.3
            ));
        }
    }
    
    // Generate smoke when mouse moves
    if (isMouseMoving && Math.random() > 0.7) {
        const particle = new SmokeParticle(
            mouseX + (Math.random() - 0.5) * 50,
            mouseY + (Math.random() - 0.5) * 50
        );
        particle.targetOpacity = 0.04;
        particle.size = 30;
        smokeParticles.push(particle);
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
    if (smokeParticles.length > 40) {
        smokeParticles.splice(0, smokeParticles.length - 40);
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
                canvas.height * 0.7
            ));
        }, i * 200);
    }
}, 1000);