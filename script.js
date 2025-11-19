// Esperar a que el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== NAVEGACIÓN MÓVIL =====
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    mobileToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });

    // Cerrar menú al hacer clic en un link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
        });
    });

    // ===== TEMA OSCURO/CLARO =====
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    const themeIcon = themeToggle.querySelector('i');

    // Cargar tema guardado
    const savedTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', function() {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    }

    // ===== NAVEGACIÓN STICKY CON SCROLL =====
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        if (currentScroll <= 0) {
            navbar.style.transform = 'translateY(0)';
        } else if (currentScroll > lastScroll) {
            // Scroll hacia abajo - ocultar navbar
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scroll hacia arriba - mostrar navbar
            navbar.style.transform = 'translateY(0)';
        }

        lastScroll = currentScroll;
    });

    // ===== RESALTAR SECCIÓN ACTIVA EN NAV =====
    const sections = document.querySelectorAll('section[id]');

    function highlightNavigation() {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLink?.classList.add('active');
            } else {
                navLink?.classList.remove('active');
            }
        });
    }

    window.addEventListener('scroll', highlightNavigation);

    // ===== FILTRO DE PROYECTOS =====
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');

            // Actualizar botón activo
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Filtrar proyectos con animación
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
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

// ===== FORMULARIO DE CONTACTO =====
    const contactForm = document.getElementById('contactForm');

    contactForm.addEventListener('submit', function(e) {
        // Obtener valores del formulario
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        // Validación básica antes de enviar
        if (!name || !email || !message) {
            e.preventDefault();
            showNotification('Por favor, completa todos los campos', 'error');
            return;
        }

        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            e.preventDefault();
            showNotification('Por favor, introduce un email válido', 'error');
            return;
        }

        // Cambiar texto del botón mientras se envía
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;

        // Limpiar formulario inmediatamente después de enviar
        setTimeout(() => {
            contactForm.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 100);
        
        // El formulario se enviará automáticamente a Formspree (no preventDefault)
    });

    // Limpiar formulario al volver de la página de confirmación de Formspree
    window.addEventListener('pageshow', function(event) {
        // Detectar si venimos de otra página (navegación hacia atrás)
        if (event.persisted || performance.getEntriesByType('navigation')[0]?.type === 'back_forward') {
            contactForm.reset();
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            submitBtn.textContent = 'Enviar Mensaje';
            submitBtn.disabled = false;
        }
    });
    // ===== SISTEMA DE NOTIFICACIONES =====
    function showNotification(message, type = 'success') {
        // Crear elemento de notificación
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;

        // Estilos de la notificación
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#48bb78' : '#f56565'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            max-width: 300px;
        `;

        document.body.appendChild(notification);

        // Remover después de 3 segundos
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Agregar animaciones CSS para notificaciones
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // ===== SMOOTH SCROLL MEJORADO =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const offsetTop = target.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===== ANIMACIÓN DEL TEXTO DEL HERO =====
const heroTitle = document.querySelector('.hero-title');
if (heroTitle) {
    // Extraer solo el texto, manteniendo la estructura HTML
    const fullText = "Hola, soy ";
    const highlightText = "Gonzalo"; // ← CAMBIA ESTO POR TU NOMBRE
    
    heroTitle.innerHTML = '';
    let i = 0;
    let j = 0;
    let writingName = false;

    function typeWriter() {
        if (!writingName) {
            // Escribir "Hola, soy "
            if (i < fullText.length) {
                heroTitle.innerHTML += fullText.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            } else {
                // Crear el span highlight
                const span = document.createElement('span');
                span.className = 'highlight';
                heroTitle.appendChild(span);
                writingName = true;
                setTimeout(typeWriter, 50);
            }
        } else {
            // Escribir el nombre dentro del span
            if (j < highlightText.length) {
                const span = heroTitle.querySelector('.highlight');
                span.innerHTML += highlightText.charAt(j);
                j++;
                setTimeout(typeWriter, 50);
            }
        }
    }

    // Iniciar animación después de un pequeño delay
    setTimeout(typeWriter, 500);
}

    // ===== CONTADOR DE SCROLL PROGRESS =====
    const scrollProgress = document.createElement('div');
    scrollProgress.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, #667eea, #764ba2);
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(scrollProgress);

    window.addEventListener('scroll', function() {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        scrollProgress.style.width = scrolled + '%';
    });

    // ===== EFECTO PARALLAX EN HERO (DESACTIVADO) =====
if (window.innerWidth > 768) {
        const hero = document.querySelector('.hero-content');
        const heroSection = document.querySelector('.hero');
        
        if (hero && heroSection) {
            window.addEventListener('scroll', function() {
                const scrolled = window.pageYOffset;
                const heroHeight = heroSection.offsetHeight;
                
                // Solo aplicar parallax mientras el hero está visible
                if (scrolled < heroHeight) {
                    // Efecto más sutil (0.3 en lugar de 0.5)
                    hero.style.transform = `translateY(${scrolled * 0.3}px)`;
                    // Añadir efecto de fade out gradual
                    hero.style.opacity = 1 - (scrolled / heroHeight) * 0.5;
                }
            });
        }
    }

    console.log('🚀 Portfolio cargado correctamente!');
});
