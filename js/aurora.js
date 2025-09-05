// Aurora Borealis Background Effect
(function() {
    const canvas = document.getElementById('aurora-canvas');
    const ctx = canvas.getContext('2d');
    
    let width, height;
    let time = 0;
    let waves = [];
    
    // Resize canvas
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    
    resize();
    window.addEventListener('resize', resize);
    
    // Aurora wave class
    class AuroraWave {
        constructor(options) {
            this.amplitude = options.amplitude || 50;
            this.wavelength = options.wavelength || 0.01;
            this.speed = options.speed || 0.005;
            this.offset = options.offset || 0;
            this.yOffset = options.yOffset || height / 2;
            this.colors = options.colors || [
                { r: 102, g: 126, b: 234 },  // Blue-purple
                { r: 147, g: 51, b: 234 },   // Purple
                { r: 16, g: 185, b: 129 }     // Green
            ];
            this.opacity = options.opacity || 0.1;
        }
        
        draw(ctx, time) {
            ctx.beginPath();
            
            // Create gradient
            const gradient = ctx.createLinearGradient(0, 0, width, height);
            const color1 = this.colors[0];
            const color2 = this.colors[1];
            const color3 = this.colors[2];
            
            gradient.addColorStop(0, `rgba(${color1.r}, ${color1.g}, ${color1.b}, ${this.opacity})`);
            gradient.addColorStop(0.5, `rgba(${color2.r}, ${color2.g}, ${color2.b}, ${this.opacity})`);
            gradient.addColorStop(1, `rgba(${color3.r}, ${color3.g}, ${color3.b}, ${this.opacity})`);
            
            ctx.fillStyle = gradient;
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 2;
            
            // Draw wave
            for (let x = 0; x <= width; x += 10) {
                const y = this.yOffset + 
                    Math.sin(x * this.wavelength + time * this.speed + this.offset) * this.amplitude +
                    Math.sin(x * this.wavelength * 2 + time * this.speed * 1.5) * (this.amplitude / 2);
                
                if (x === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            
            // Complete the shape
            ctx.lineTo(width, height);
            ctx.lineTo(0, height);
            ctx.closePath();
            
            // Apply blur effect
            ctx.filter = 'blur(40px)';
            ctx.fill();
            ctx.filter = 'none';
        }
    }
    
    // Initialize waves
    function initWaves() {
        waves = [
            new AuroraWave({
                amplitude: 100,
                wavelength: 0.003,
                speed: 0.002,
                offset: 0,
                yOffset: height * 0.3,
                opacity: 0.15,
                colors: [
                    { r: 102, g: 126, b: 234 },
                    { r: 147, g: 51, b: 234 },
                    { r: 236, g: 72, b: 153 }
                ]
            }),
            new AuroraWave({
                amplitude: 80,
                wavelength: 0.004,
                speed: -0.003,
                offset: Math.PI / 2,
                yOffset: height * 0.5,
                opacity: 0.12,
                colors: [
                    { r: 16, g: 185, b: 129 },
                    { r: 59, g: 130, b: 246 },
                    { r: 147, g: 51, b: 234 }
                ]
            }),
            new AuroraWave({
                amplitude: 60,
                wavelength: 0.005,
                speed: 0.004,
                offset: Math.PI,
                yOffset: height * 0.7,
                opacity: 0.1,
                colors: [
                    { r: 236, g: 72, b: 153 },
                    { r: 147, g: 51, b: 234 },
                    { r: 102, g: 126, b: 234 }
                ]
            })
        ];
    }
    
    initWaves();
    
    // Animation particles
    class Particle {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.2;
            this.hue = Math.random() * 60 + 240; // Blue-purple range
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            // Wrap around edges
            if (this.x < 0) this.x = width;
            if (this.x > width) this.x = 0;
            if (this.y < 0) this.y = height;
            if (this.y > height) this.y = 0;
            
            // Slowly fade
            this.opacity *= 0.999;
            if (this.opacity < 0.01) {
                this.reset();
            }
        }
        
        draw(ctx) {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = `hsl(${this.hue}, 70%, 60%)`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            
            // Add glow
            ctx.filter = 'blur(3px)';
            ctx.fill();
            ctx.filter = 'none';
            ctx.restore();
        }
    }
    
    // Create particles
    const particles = [];
    for (let i = 0; i < 50; i++) {
        particles.push(new Particle());
    }
    
    // Animation loop
    function animate() {
        // Clear with fade effect
        ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
        ctx.fillRect(0, 0, width, height);
        
        // Draw aurora waves
        waves.forEach(wave => {
            wave.draw(ctx, time);
        });
        
        // Update and draw particles
        particles.forEach(particle => {
            particle.update();
            particle.draw(ctx);
        });
        
        time += 1;
        requestAnimationFrame(animate);
    }
    
    // Start animation
    animate();
    
    // Reinitialize waves on resize
    window.addEventListener('resize', () => {
        initWaves();
    });
})();