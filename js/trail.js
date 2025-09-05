// Professional Mouse Trail Effect inspired by Mark Renzo
(function() {
    const canvas = document.getElementById('trail-canvas');
    const ctx = canvas.getContext('2d');
    
    // Canvas setup
    function setupCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '9999';
    }
    
    setupCanvas();
    window.addEventListener('resize', setupCanvas);
    
    // Trail particle class
    class TrailParticle {
        constructor(x, y, dx, dy) {
            this.x = x;
            this.y = y;
            this.baseX = x;
            this.baseY = y;
            this.dx = dx * 0.1;
            this.dy = dy * 0.1;
            this.life = 1;
            this.decay = 0.03; // Faster decay for performance
            this.size = Math.random() * 3 + 1;
            this.maxSize = this.size * 2;
            this.growth = 0.05;
            this.color = this.getColor();
        }
        
        getColor() {
            // Professional gradient colors
            const colors = [
                { r: 59, g: 130, b: 246 },   // Blue
                { r: 147, g: 51, b: 234 },    // Purple
                { r: 236, g: 72, b: 153 },    // Pink
                { r: 34, g: 197, b: 94 }      // Green
            ];
            return colors[Math.floor(Math.random() * colors.length)];
        }
        
        update() {
            this.x += this.dx;
            this.y += this.dy;
            this.dx *= 0.98;
            this.dy *= 0.98;
            this.life -= this.decay;
            
            // Expand size
            if (this.size < this.maxSize) {
                this.size += this.growth;
            }
        }
        
        draw() {
            if (this.life <= 0) return;
            
            ctx.save();
            ctx.globalAlpha = this.life * 0.5;
            
            // Create gradient
            const gradient = ctx.createRadialGradient(
                this.x, this.y, 0,
                this.x, this.y, this.size * 2
            );
            
            const { r, g, b } = this.color;
            gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${this.life * 0.3})`);
            gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${this.life * 0.1})`);
            gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
            ctx.fill();
            
            // Inner glow
            ctx.globalAlpha = this.life;
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${this.life * 0.8})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 0.5, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
        }
    }
    
    // Cursor glow effect
    class CursorGlow {
        constructor() {
            this.x = 0;
            this.y = 0;
            this.targetX = 0;
            this.targetY = 0;
            this.size = 20;
            this.opacity = 0;
        }
        
        update(mouseX, mouseY, isMoving) {
            this.targetX = mouseX;
            this.targetY = mouseY;
            
            // Smooth following
            this.x += (this.targetX - this.x) * 0.2;
            this.y += (this.targetY - this.y) * 0.2;
            
            // Fade in/out based on movement
            if (isMoving) {
                this.opacity = Math.min(this.opacity + 0.05, 0.3);
            } else {
                this.opacity = Math.max(this.opacity - 0.02, 0);
            }
        }
        
        draw() {
            if (this.opacity <= 0) return;
            
            ctx.save();
            ctx.globalAlpha = this.opacity;
            
            // Outer glow
            const gradient = ctx.createRadialGradient(
                this.x, this.y, 0,
                this.x, this.y, this.size
            );
            
            gradient.addColorStop(0, 'rgba(147, 51, 234, 0.3)');
            gradient.addColorStop(0.5, 'rgba(59, 130, 246, 0.1)');
            gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
        }
    }
    
    // Trail system
    const particles = [];
    const cursorGlow = new CursorGlow();
    let mouseX = 0;
    let mouseY = 0;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let isMouseMoving = false;
    let mouseTimer;
    
    // Mouse tracking
    document.addEventListener('mousemove', (e) => {
        prevMouseX = mouseX;
        prevMouseY = mouseY;
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        const dx = mouseX - prevMouseX;
        const dy = mouseY - prevMouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Create particles based on movement speed
        if (distance > 2) {
            const particleCount = Math.min(Math.floor(distance / 8), 2); // Fewer particles for performance
            for (let i = 0; i < particleCount; i++) {
                particles.push(new TrailParticle(
                    mouseX + (Math.random() - 0.5) * 5,
                    mouseY + (Math.random() - 0.5) * 5,
                    dx,
                    dy
                ));
            }
        }
        
        isMouseMoving = true;
        clearTimeout(mouseTimer);
        mouseTimer = setTimeout(() => {
            isMouseMoving = false;
        }, 100);
    });
    
    // Touch support
    document.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            const touch = e.touches[0];
            prevMouseX = mouseX;
            prevMouseY = mouseY;
            mouseX = touch.clientX;
            mouseY = touch.clientY;
            
            const dx = mouseX - prevMouseX;
            const dy = mouseY - prevMouseY;
            
            particles.push(new TrailParticle(mouseX, mouseY, dx, dy));
            
            isMouseMoving = true;
            clearTimeout(mouseTimer);
            mouseTimer = setTimeout(() => {
                isMouseMoving = false;
            }, 100);
        }
    });
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw cursor glow
        cursorGlow.update(mouseX, mouseY, isMouseMoving);
        cursorGlow.draw();
        
        // Update and draw particles
        for (let i = particles.length - 1; i >= 0; i--) {
            const particle = particles[i];
            particle.update();
            particle.draw();
            
            // Remove dead particles
            if (particle.life <= 0) {
                particles.splice(i, 1);
            }
        }
        
        // Limit particle count for performance
        if (particles.length > 30) {
            particles.splice(0, particles.length - 30);
        }
        
        requestAnimationFrame(animate);
    }
    
    animate();
})();