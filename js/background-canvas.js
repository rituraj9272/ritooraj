// ===========================
// Pipeline Canvas Animation (CI/CD Flow) — particle background.
// Feature-detected + desktop-gated + reduced-motion aware (Requirement 10.2,
// 13.3, 14.3). A failure or unsupported environment degrades silently: the
// canvas stays hidden and the underlying content remains visible/navigable.
// ===========================

import { prefersReducedMotion } from './reduced-motion.js';

export function initBackgroundCanvas() {
    try {
        const canvas = globalThis.document.getElementById('pipelineCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext && canvas.getContext('2d');
        if (!ctx) return; // unsupported -> degrade (10.2)

        // Skip the animation loop entirely under reduced motion (13.3). The
        // canvas is simply left blank/static; content is unaffected.
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

        // Pipeline particles
        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = -10;
                this.speed = Math.random() * 2 + 1;
                this.size = Math.random() * 2 + 1;
                this.opacity = Math.random() * 0.5 + 0.3;
            }

            update() {
                this.y += this.speed;
                if (this.y > canvas.height) {
                    this.reset();
                }
            }

            draw() {
                ctx.fillStyle = `rgba(0, 217, 255, ${this.opacity})`;
                ctx.fillRect(this.x, this.y, this.size, this.size);
            }
        }

        // Connection lines
        class Connection {
            constructor() {
                this.x1 = Math.random() * canvas.width;
                this.y1 = Math.random() * canvas.height;
                this.x2 = Math.random() * canvas.width;
                this.y2 = Math.random() * canvas.height;
                this.opacity = Math.random() * 0.3;
                this.fadeDirection = Math.random() > 0.5 ? 1 : -1;
            }

            update() {
                this.opacity += this.fadeDirection * 0.01;
                if (this.opacity <= 0 || this.opacity >= 0.3) {
                    this.fadeDirection *= -1;
                }
            }

            draw() {
                ctx.strokeStyle = `rgba(123, 47, 247, ${this.opacity})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(this.x1, this.y1);
                ctx.lineTo(this.x2, this.y2);
                ctx.stroke();
            }
        }

        const particles = Array.from({ length: 50 }, () => new Particle());
        const connections = Array.from({ length: 5 }, () => new Connection());

        function animateCanvas() {
            if (!running) {
                requestAnimationFrame(animateCanvas); // pause when tab hidden (14.3)
                return;
            }
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw connections
            connections.forEach(connection => {
                connection.update();
                connection.draw();
            });

            // Draw particles
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });

            requestAnimationFrame(animateCanvas);
        }

        animateCanvas();
    } catch (_err) {
        // Degrade silently; the page stays visible and navigable (10.2).
    }
}

export default initBackgroundCanvas;
