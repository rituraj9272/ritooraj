// ===========================
// Dynamic Particle Network Background
// Feature-detected + desktop-gated + reduced-motion aware
// ===========================

import { prefersReducedMotion } from './reduced-motion.js';

export function initBackgroundCanvas() {
    try {
        const canvas = globalThis.document.getElementById('pipelineCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext && canvas.getContext('2d');
        if (!ctx) return;

        if (prefersReducedMotion()) return;

        let running = true;
        const onVisibility = () => { running = !globalThis.document.hidden; };
        globalThis.document.addEventListener('visibilitychange', onVisibility);

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 1.5;
                this.vy = (Math.random() - 0.5) * 1.5;
                this.size = Math.random() * 2 + 1;
                this.color = Math.random() > 0.5 ? 'rgba(0, 217, 255, 0.7)' : 'rgba(123, 47, 247, 0.7)';
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Bounce off edges
                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            }

            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const particles = Array.from({ length: 80 }, () => new Particle());

        function animateCanvas() {
            if (!running) {
                requestAnimationFrame(animateCanvas);
                return;
            }
            
            // Subtle fade effect instead of clearRect
            ctx.fillStyle = 'rgba(10, 10, 10, 0.2)'; 
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw and update particles
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });

            // Draw connections
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 120) {
                        const opacity = 1 - (distance / 120);
                        ctx.strokeStyle = `rgba(0, 217, 255, ${opacity * 0.5})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(animateCanvas);
        }

        animateCanvas();
    } catch (_err) {
        // Degrade silently
    }
}

export default initBackgroundCanvas;
