// ===========================
// Mobile Menu Toggle
// ===========================
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// ===========================
// Smooth Scrolling
// ===========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===========================
// Navbar Scroll Effect
// ===========================
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(10, 14, 26, 0.98)';
        navbar.style.boxShadow = '0 4px 16px rgba(0, 217, 255, 0.1)';
    } else {
        navbar.style.background = 'rgba(10, 14, 26, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// ===========================
// Intersection Observer for Animations
// ===========================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections and cards
document.querySelectorAll('.section, .project-card, .skill-category, .timeline-item, .case-study-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ===========================
// Pipeline Canvas Animation (CI/CD Flow)
// ===========================
const canvas = document.getElementById('pipelineCanvas');
const ctx = canvas.getContext('2d');

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

// ===========================
// Typing Effect Disabled (not needed for new layout)
// ===========================
// const typingText = document.querySelector('.typing-text');
// Disabled as we now use static text in split-screen layout

// ===========================
// Contact Form Handling
// ===========================
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        // Create mailto link
        const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
        const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
        const mailtoLink = `mailto:singh.ritooraj@gmail.com?subject=${subject}&body=${body}`;

        window.location.href = mailtoLink;

        // Show success message
        alert('Thank you for reaching out! Your default email client will open.');

        // Reset form
        contactForm.reset();
    });
}

// ===========================
// Skill Tags Hover Effect
// ===========================
document.querySelectorAll('.tag').forEach(tag => {
    tag.addEventListener('mouseenter', function() {
        this.style.background = 'rgba(0, 217, 255, 0.1)';
    });
    
    tag.addEventListener('mouseleave', function() {
        this.style.background = '';
    });
});

// ===========================
// Parallax Effect (Disabled for split-screen hero)
// ===========================
// window.addEventListener('scroll', () => {
//     const scrolled = window.pageYOffset;
//     const hero = document.querySelector('.hero');
//     if (hero) {
//         hero.style.transform = `translateY(${scrolled * 0.5}px)`;
//         hero.style.opacity = 1 - scrolled / 700;
//     }
// });

// ===========================
// Pipeline Animation in Architecture Section
// ===========================
const pipelineSteps = document.querySelectorAll('.pipeline-step');
let currentStep = 0;

function animatePipeline() {
    pipelineSteps.forEach((step, index) => {
        step.style.transform = 'scale(1)';
        step.style.boxShadow = '';
    });

    if (pipelineSteps[currentStep]) {
        pipelineSteps[currentStep].style.transform = 'scale(1.1)';
        pipelineSteps[currentStep].style.boxShadow = '0 0 20px rgba(0, 217, 255, 0.5)';
    }

    currentStep = (currentStep + 1) % pipelineSteps.length;
}

// Start pipeline animation when in view
const pipelineSection = document.querySelector('.pipeline');
if (pipelineSection) {
    const pipelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setInterval(animatePipeline, 1500);
                pipelineObserver.unobserve(entry.target);
            }
        });
    });
    pipelineObserver.observe(pipelineSection);
}

// ===========================
// Infrastructure Layers Animation
// ===========================
const infraLayers = document.querySelectorAll('.infra-layer');
infraLayers.forEach((layer, index) => {
    const layerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }, index * 200);
                layerObserver.unobserve(entry.target);
            }
        });
    });

    layer.style.opacity = '0';
    layer.style.transform = 'translateX(-30px)';
    layer.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    layerObserver.observe(layer);
});

// ===========================
// Terminal Command Animation
// ===========================
const terminalLines = document.querySelectorAll('.terminal-line');
terminalLines.forEach((line, index) => {
    const termObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }, index * 300);
                termObserver.unobserve(entry.target);
            }
        });
    });

    line.style.opacity = '0';
    line.style.transform = 'translateX(-20px)';
    line.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    termObserver.observe(line);
});

// ===========================
// Stats Counter Animation
// ===========================
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statCards = entry.target.querySelectorAll('.stat-card h4');
            statCards.forEach(card => {
                const value = parseInt(card.textContent);
                if (!isNaN(value)) {
                    animateCounter(card, value);
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
});

const statsGrid = document.querySelector('.stats-grid');
if (statsGrid) {
    statsObserver.observe(statsGrid);
}

// ===========================
// Project Cards Stagger Animation
// ===========================
const projectCardsForAnimation = document.querySelectorAll('.project-card');
projectCardsForAnimation.forEach((card, index) => {
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 150);
                cardObserver.unobserve(entry.target);
            }
        });
    });

    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    cardObserver.observe(card);
});

// ===========================
// Timeline Markers Animation
// ===========================
const timelineMarkers = document.querySelectorAll('.timeline-marker');
timelineMarkers.forEach((marker, index) => {
    const markerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.transform = 'translateX(-50%) scale(1)';
                    entry.target.style.opacity = '1';
                }, index * 200);
                markerObserver.unobserve(entry.target);
            }
        });
    });

    marker.style.transform = 'translateX(-50%) scale(0)';
    marker.style.opacity = '0';
    marker.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
    markerObserver.observe(marker);
});

// ===========================
// Scroll Progress Indicator
// ===========================
function updateScrollProgress() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercentage = (scrollTop / scrollHeight) * 100;

    // Create progress bar if it doesn't exist
    let progressBar = document.querySelector('.scroll-progress');
    if (!progressBar) {
        progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            height: 3px;
            background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
            z-index: 9999;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(progressBar);
    }

    progressBar.style.width = `${scrollPercentage}%`;
}

window.addEventListener('scroll', updateScrollProgress);

// ===========================
// Lazy Load Images
// ===========================
const images = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
        }
    });
});

images.forEach(img => imageObserver.observe(img));

// ===========================
// Achievement Cards Pulse Animation
// ===========================
const achievementCards = document.querySelectorAll('.achievement-card');
achievementCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        const icon = this.querySelector('.achievement-icon');
        icon.style.animation = 'pulse 0.5s ease';
        setTimeout(() => {
            icon.style.animation = '';
        }, 500);
    });
});

// Pulse animation
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
    }
`;
document.head.appendChild(style);

// ===========================
// Dynamic Year in Footer
// ===========================
const updateFooterYear = () => {
    const yearElements = document.querySelectorAll('.footer-content p');
    yearElements.forEach(el => {
        if (el.textContent.includes('2026')) {
            el.textContent = el.textContent.replace('2026', new Date().getFullYear());
        }
    });
};

updateFooterYear();

// ===========================
// Keyboard Navigation
// ===========================
document.addEventListener('keydown', (e) => {
    const sections = ['home', 'about', 'skills', 'projects', 'experience', 'architecture', 'certifications', 'contact'];
    const currentSection = sections.findIndex(section => {
        const element = document.getElementById(section);
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        return rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2;
    });

    if (e.key === 'ArrowDown' && currentSection < sections.length - 1) {
        const nextSection = document.getElementById(sections[currentSection + 1]);
        if (nextSection) {
            nextSection.scrollIntoView({ behavior: 'smooth' });
        }
    } else if (e.key === 'ArrowUp' && currentSection > 0) {
        const prevSection = document.getElementById(sections[currentSection - 1]);
        if (prevSection) {
            prevSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
});

// ===========================
// Back to Top Button
// ===========================
const createBackToTopButton = () => {
    const button = document.createElement('button');
    button.innerHTML = '<i class="fas fa-arrow-up"></i>';
    button.className = 'back-to-top';
    button.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        border: none;
        border-radius: 50%;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 999;
        box-shadow: 0 4px 16px rgba(0, 217, 255, 0.3);
    `;

    button.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    document.body.appendChild(button);

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            button.style.opacity = '1';
            button.style.visibility = 'visible';
        } else {
            button.style.opacity = '0';
            button.style.visibility = 'hidden';
        }
    });

    button.addEventListener('mouseenter', () => {
        button.style.transform = 'translateY(-5px) scale(1.1)';
    });

    button.addEventListener('mouseleave', () => {
        button.style.transform = 'translateY(0) scale(1)';
    });
};

createBackToTopButton();

// ===========================
// Console Easter Egg
// ===========================
console.log('%cHey there, DevOps engineer! 👋', 'color: #00D9FF; font-size: 20px; font-weight: bold;');
console.log('%cLooking at the console? I like your curiosity! 🚀', 'color: #7B2FF7; font-size: 14px;');
console.log('%c$ whoami\nRituraj Singh - DevOps Engineer', 'color: #00FFA3; font-family: monospace; font-size: 12px;');
console.log('%c$ current_mission\nAutomating everything that moves and building scalable infrastructure 💻', 'color: #00FFA3; font-family: monospace; font-size: 12px;');
console.log('%c$ contact\nEmail: singh.ritooraj@gmail.com\nGitHub: github.com/ritooraj01', 'color: #00FFA3; font-family: monospace; font-size: 12px;');
console.log('%cLet\'s connect and build something amazing together! 🎯', 'color: #FF006E; font-size: 14px;');

// ===========================
// Performance Monitoring
// ===========================
if ('performance' in window) {
    window.addEventListener('load', () => {
        const perfData = performance.getEntriesByType('navigation')[0];
        console.log(`%cPage Load Performance:`, 'color: #FFD60A; font-weight: bold;');
        console.log(`⚡ DOM Content Loaded: ${(perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart).toFixed(2)}ms`);
        console.log(`🚀 Total Load Time: ${(perfData.loadEventEnd - perfData.loadEventStart).toFixed(2)}ms`);
    });
}

// ===========================
// 🌗 Dark/Light Mode Toggle
// ===========================
const themeToggle = document.querySelector('.theme-toggle');
const htmlElement = document.documentElement;

// Check for saved theme preference or default to 'dark'
const currentTheme = localStorage.getItem('theme') || 'dark';
htmlElement.setAttribute('data-theme', currentTheme);
updateThemeIcon(currentTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
    
    // Add rotation animation
    themeToggle.style.transform = 'rotate(360deg)';
    setTimeout(() => {
        themeToggle.style.transform = 'rotate(0deg)';
    }, 500);
});

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    if (theme === 'dark') {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
}

// ===========================
// 🎯 Project Filtering System
// ===========================
const filterButtons = document.querySelectorAll('.filter-btn');
const allProjectCards = document.querySelectorAll('.project-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        const filterValue = button.getAttribute('data-filter');
        
        allProjectCards.forEach(card => {
            const categories = card.getAttribute('data-category').toLowerCase();
            
            if (filterValue === 'all' || categories.includes(filterValue.toLowerCase())) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 10);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    });
});

// ===========================
// 🖱️ Custom Cursor Effects
// ===========================
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;
let followerX = 0;
let followerY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateCursor() {
    // Main cursor follows immediately
    cursorX += (mouseX - cursorX) * 0.9;
    cursorY += (mouseY - cursorY) * 0.9;
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    
    // Follower has a delay
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    cursorFollower.style.left = followerX + 'px';
    cursorFollower.style.top = followerY + 'px';
    
    requestAnimationFrame(animateCursor);
}

// Only run cursor effects on desktop
if (window.innerWidth > 768) {
    animateCursor();
}

// Add cursor interactions
const interactiveElements = document.querySelectorAll('a, button, .project-card, .filter-btn');
interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'scale(2)';
        cursorFollower.style.transform = 'scale(1.5)';
    });
    
    el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'scale(1)';
        cursorFollower.style.transform = 'scale(1)';
    });
});

// ===========================
// ⏳ Terminal Loading Screen Animation
// ===========================
window.addEventListener('load', () => {
    const loadingScreen = document.querySelector('.loading-screen');
    const terminalLines = document.querySelectorAll('.loading-line');
    const progressBar = document.getElementById('terminalProgress');
    const progressText = document.getElementById('progressText');
    const cursor = document.querySelector('.terminal-cursor');
    
    // Show first line immediately
    document.querySelector('.terminal-line:first-child').classList.add('visible');
    
    // Animate terminal lines sequentially
    terminalLines.forEach((line, index) => {
        const delay = parseInt(line.dataset.delay) || 0;
        setTimeout(() => {
            line.classList.add('visible');
            
            // Start progress bar animation when it appears
            if (line.querySelector('.progress-bar-container')) {
                animateProgressBar();
            }
        }, delay);
    });
    
    // Progress bar animation
    function animateProgressBar() {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 8 + 2;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                
                // Show cursor and hide loading screen
                setTimeout(() => {
                    cursor.classList.add('visible');
                    setTimeout(() => {
                        loadingScreen.style.opacity = '0';
                        setTimeout(() => {
                            loadingScreen.style.display = 'none';
                        }, 500);
                    }, 800);
                }, 200);
            }
            
            progressBar.style.width = progress + '%';
            progressText.textContent = Math.floor(progress) + '%';
        }, 100);
    }
});

// ===========================
// 📊 Skill Progress Bar Animation
// ===========================
const skillProgressBars = document.querySelectorAll('.skill-progress-fill');
const skillPercentages = document.querySelectorAll('.skill-percentage');

const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const progressBar = entry.target;
            const targetProgress = progressBar.getAttribute('data-progress');
            const percentage = progressBar.parentElement.parentElement.querySelector('.skill-percentage');
            
            // Animate progress bar
            setTimeout(() => {
                progressBar.style.width = targetProgress + '%';
            }, 100);
            
            // Animate percentage counter
            let currentProgress = 0;
            const interval = setInterval(() => {
                if (currentProgress >= targetProgress) {
                    clearInterval(interval);
                    percentage.textContent = targetProgress + '%';
                } else {
                    currentProgress += 1;
                    percentage.textContent = currentProgress + '%';
                }
            }, 20);
            
            skillObserver.unobserve(progressBar);
        }
    });
}, { threshold: 0.5 });

skillProgressBars.forEach(bar => skillObserver.observe(bar));

// ===========================
// 💻 Interactive Terminal Functionality
// ===========================
const terminalInput = document.getElementById('terminal-input');
const terminalOutput = document.getElementById('terminal-output');

const commands = {
    help: `Available commands:
  - <span style="color: #00D9FF">help</span> : Show this help message
  - <span style="color: #00D9FF">about</span> : About Rituraj Singh
  - <span style="color: #00D9FF">skills</span> : List technical skills
  - <span style="color: #00D9FF">projects</span> : Show recent projects
  - <span style="color: #00D9FF">contact</span> : Get contact information
  - <span style="color: #00D9FF">whoami</span> : Who am I?
  - <span style="color: #00D9FF">clear</span> : Clear terminal`,
    
    about: `<span style="color: #00FFA3">Rituraj Singh - DevOps Engineer</span>
  
  Passionate about automating infrastructure and building scalable systems.
  Currently working at GeeksforGeeks, managing AWS cloud infrastructure,
  CI/CD pipelines, and ensuring 99.9% uptime for millions of users.`,
    
    skills: `<span style="color: #00FFA3">Core Skills:</span>
  ☁️  AWS (ECS, EC2, S3, CloudWatch, Lambda)
  🐳  Docker & Kubernetes
  🔧  CI/CD (Jenkins, GitHub Actions)
  📊  Monitoring (CloudWatch, Nagios, Uptime Kuma)
  🐍  Python & Shell Scripting
  🔒  DevSecOps & Security`,
    
    projects: `<span style="color: #00FFA3">Featured Projects:</span>
  1. 🚀 CI/CD Pipeline Automation - Jenkins + AWS ECS
  2. 📊 Real-time Observability Dashboard - CloudWatch + Python
  3. 🔒 Security Automation Suite - WAF + CloudWatch
  4. 🌐 Multi-environment Infrastructure - AWS + Terraform`,
    
    contact: `<span style="color: #00FFA3">Contact Information:</span>
  📧 Email: singh.ritooraj@gmail.com
  💼 LinkedIn: linkedin.com/in/rituraj-singh
  🐙 GitHub: github.com/ritooraj01
  📍 Location: New Delhi, India`,
    
    whoami: `<span style="color: #00D9FF; font-size: 1.2em">DevOps Engineer | Cloud Enthusiast | Automation Advocate</span>
  
  "I turn coffee into infrastructure automation" ☕️ → 🚀`,
    
    clear: 'CLEAR_TERMINAL'
};

if (terminalInput) {
    terminalInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const command = terminalInput.value.trim().toLowerCase();
            
            // Display command
            const commandLine = document.createElement('div');
            commandLine.innerHTML = `<span style="color: #00D9FF">visitor@portfolio:~$</span> ${command}`;
            terminalOutput.appendChild(commandLine);
            
            // Execute command
            if (command === 'clear') {
                terminalOutput.innerHTML = '';
            } else if (commands[command]) {
                const output = document.createElement('div');
                output.innerHTML = commands[command];
                output.style.marginBottom = '1rem';
                terminalOutput.appendChild(output);
            } else if (command) {
                const error = document.createElement('div');
                error.innerHTML = `<span style="color: #FF006E">Command not found: ${command}</span>. Type <span style="color: #00D9FF">help</span> for available commands.`;
                error.style.marginBottom = '1rem';
                terminalOutput.appendChild(error);
            }
            
            // Clear input
            terminalInput.value = '';
            
            // Scroll to bottom
            terminalOutput.scrollTop = terminalOutput.scrollHeight;
        }
    });
}

// ===========================
// 📱 Mobile Bottom Navigation Active State
// ===========================
const mobileNavItems = document.querySelectorAll('.mobile-bottom-nav .nav-item');
const sections = document.querySelectorAll('.section');

function updateMobileNav() {
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 200) {
            currentSection = section.getAttribute('id');
        }
    });
    
    mobileNavItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${currentSection}`) {
            item.classList.add('active');
        }
    });
}

if (window.innerWidth <= 768) {
    window.addEventListener('scroll', updateMobileNav);
}

// ===========================
// Initialize Everything
// ===========================
document.addEventListener('DOMContentLoaded', () => {
    console.log('Portfolio initialized successfully! 🎉');
});
