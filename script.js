
        function toggleMobileMenu() {
            const menu = document.getElementById('mobileMenu');
            menu.classList.toggle('active');
            document.querySelector('.hamburger').classList.toggle('active');
        }
        function closeMenu() {
            document.getElementById('mobileMenu').classList.remove('active');
            document.querySelector('.hamburger').classList.remove('active');
        }

        // TYPING ANIMATION
        const typedTextSpan = document.querySelector(".typed-text");
        const textArray = ["Professional Web Developer", "Web to App Expert", "Creative Web Designer", "UI/UX Specialist"];
        const typingSpeed = 100;
        const erasingSpeed = 50;
        const newTextDelay = 2000; 
        let textArrayIndex = 0;
        let charIndex = 0;

        function type() {
            if (charIndex < textArray[textArrayIndex].length) {
                typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
                charIndex++;
                setTimeout(type, typingSpeed);
            } else {
                setTimeout(erase, newTextDelay);
            }
        }

        function erase() {
            if (charIndex > 0) {
                typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
                charIndex--;
                setTimeout(erase, erasingSpeed);
            } else {
                textArrayIndex++;
                if (textArrayIndex >= textArray.length) textArrayIndex = 0;
                setTimeout(type, typingSpeed + 500);
            }
        }

        // Web3Forms AJAX Handling (Prevents redirecting and refreshes the form)
        const form = document.getElementById('contactForm');
        const statusDiv = document.getElementById('formStatus');
        const submitBtn = document.getElementById('submitBtn');

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            submitBtn.disabled = true;
            submitBtn.innerText = "Sending...";
            statusDiv.className = "form-status";
            statusDiv.innerText = "";

            const formData = new FormData(form);
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            })
            .then(async (response) => {
                let res = await response.json();
                if (response.status == 200) {
                    statusDiv.classList.add('success');
                    statusDiv.innerText = "Message submitted successfully!";
                    form.reset(); // Automatic Refresh/Reset the form fields
                } else {
                    statusDiv.classList.add('error');
                    statusDiv.innerText = res.message || "Something went wrong.";
                }
            })
            .catch(error => {
                statusDiv.classList.add('error');
                statusDiv.innerText = "Network error. Please try again later.";
            })
            .then(() => {
                submitBtn.disabled = false;
                submitBtn.innerText = "Send Message";
                setTimeout(() => {
                    statusDiv.style.display = "none";
                }, 5000); // Message 5 seconds baad hide ho jayega
            });
        });

        document.addEventListener("DOMContentLoaded", function() { 
            if(textArray.length) setTimeout(type, newTextDelay + 250);
            
            const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('reveal');
                    }
                });
            }, observerOptions);

            document.querySelectorAll('section').forEach(section => observer.observe(section));
            document.querySelectorAll('.scroll-animate').forEach(el => observer.observe(el));
        });

        // SMOOTH SCROLL NAVIGATION FIXED
        document.querySelectorAll('.nav-links a, .logo-text, .footer-links a, .mobile-menu a').forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (!href.startsWith('#')) return;
                
                e.preventDefault();
                const targetSection = document.querySelector(href);
                
                if (targetSection) {
                    if (window.innerWidth > 768 && href !== '#contact') {
                        const sections = Array.from(document.querySelectorAll('section'));
                        const targetIndex = sections.indexOf(targetSection);
                        const vh = window.innerHeight;
                        window.scrollTo({ top: targetIndex * vh, behavior: 'smooth' });
                    } else {
                        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }
            });
        });

        // 🚀 ADVANCED CANVAS: PARTICLE EXPLOSION ON LOAD & HOVER (Crimson Theme)
        const canvas = document.getElementById('bgCanvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            let width, height, particles = [];
            let mouse = { x: null, y: null };

            function resize() {
                width = canvas.width = window.innerWidth;
                height = canvas.height = window.innerHeight;
            }
            window.addEventListener('resize', resize);
            resize();

            class Particle {
                constructor(x, y, isExplosion = false) {
                    this.x = x;
                    this.y = y;
                    const angle = Math.random() * Math.PI * 2;
                    const speed = isExplosion ? (Math.random() * 4 + 2) : (Math.random() * 1.5 + 0.5);
                    this.vx = Math.cos(angle) * speed;
                    this.vy = Math.sin(angle) * speed;
                    this.radius = Math.random() * 3 + 1;
                    this.alpha = 1;
                    this.decay = Math.random() * 0.015 + 0.005; 
                    this.color = Math.random() > 0.3 ? 'rgba(225, 29, 72, ' : 'rgba(190, 18, 60, '; 
                }
                update() {
                    this.x += this.vx;
                    this.y += this.vy;
                    this.alpha -= this.decay;
                }
                draw() {
                    ctx.save();
                    ctx.globalAlpha = this.alpha;
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                    ctx.fillStyle = this.color + this.alpha + ')';
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = 'rgba(225, 29, 72, 0.8)';
                    ctx.fill();
                    ctx.restore();
                }
            }

            function triggerLoadExplosion() {
                const centerX = width / 2;
                const centerY = height / 2;
                for (let i = 0; i < 150; i++) {
                    particles.push(new Particle(centerX, centerY, true));
                }
            }

            function spawnAmbient() {
                if (particles.length < 100) {
                    particles.push(new Particle(Math.random() * width, Math.random() * height, false));
                }
            }

            window.addEventListener('mousemove', function(e) {
                if (e.clientY < window.innerHeight) {
                    mouse.x = e.clientX;
                    mouse.y = e.clientY;
                    for (let i = 0; i < 3; i++) {
                        particles.push(new Particle(mouse.x, mouse.y, true));
                    }
                }
            });

            function animate() {
                ctx.clearRect(0, 0, width, height);
                
                spawnAmbient();

                for (let i = particles.length - 1; i >= 0; i--) {
                    particles[i].update();
                    if (particles[i].alpha <= 0 || particles[i].x < 0 || particles[i].x > width || particles[i].y < 0 || particles[i].y > height) {
                        particles.splice(i, 1);
                    } else {
                        particles[i].draw();
                    }
                }
                requestAnimationFrame(animate);
            }

            triggerLoadExplosion();
            animate();
        }
    