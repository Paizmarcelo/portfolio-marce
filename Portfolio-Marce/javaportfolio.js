// Wait for the DOM to be fully loaded before running scripts
document.addEventListener('DOMContentLoaded', function() {
    
    // --- DOM Elements ---
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const contactForm = document.getElementById('contact-form');
    // const skillBars = document.querySelectorAll('.skill-progress'); // REMOVED: No longer needed
    const themeToggle = document.getElementById('theme-toggle');
    const preloader = document.getElementById('preloader');

    // --- Initializations ---
    initializePreloader();
    initializeTheme();
    initializeNavigation();
    initializeScrollEffects();
    // initializeSkillBars(); // REMOVED: No longer needed
    if (contactForm) {
        initializeContactForm();
    }

    // --- Preloader ---
    function initializePreloader() {
        window.addEventListener('load', () => {
            if(preloader) {
                preloader.classList.add('hidden');
            }
        });
    }

    // --- Theme Switcher ---
    function initializeTheme() {
        if (!themeToggle) return;
        // Apply saved theme on load
        if (localStorage.getItem('theme') === 'dark') {
            document.body.classList.add('dark-mode');
            themeToggle.checked = true;
        }

        // Theme toggle event listener
        themeToggle.addEventListener('change', () => {
            if (themeToggle.checked) {
                document.body.classList.add('dark-mode');
                localStorage.setItem('theme', 'dark');
            } else {
                document.body.classList.remove('dark-mode');
                localStorage.setItem('theme', 'light');
            }
        });
    }
    
    // --- Navigation ---
    function initializeNavigation() {
        if (!hamburger || !navMenu) return;
        // Mobile menu toggle
        hamburger.addEventListener('click', toggleMobileMenu);

        // Close mobile menu when a link is clicked
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('active')) {
                    closeMobileMenu();
                }
            });
        });

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                try {
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        const offsetTop = targetElement.offsetTop - 70; // Navbar height offset
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });
                    }
                } catch (error) {
                    console.error('Error finding element for smooth scroll:', error);
                }
            });
        });
    }

    function toggleMobileMenu() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
    }

    function closeMobileMenu() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    // --- Scroll Effects ---
    function initializeScrollEffects() {
        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial check on load
    }

    function handleScroll() {
        // Sticky navbar background
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
        // Highlight active nav link on scroll
        updateActiveNavLink();
    }

    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        let currentSectionId = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                currentSectionId = section.getAttribute('id');
            }
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }

    // --- Skill Bars Animation (REMOVED) ---
    // The function 'initializeSkillBars' was removed as it's no longer necessary with the new design.

    // --- Contact Form ---
    function initializeContactForm() {
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input)); // Validate on blur
            input.addEventListener('input', () => clearFieldError(input)); // Clear error on input
        });
        contactForm.addEventListener('submit', handleFormSubmit);
    }

    async function handleFormSubmit(e) {
        e.preventDefault();
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const successMessage = contactForm.querySelector('.form-success-message');
        
        if (!validateAllFields()) {
            return;
        }

        // Show loading state
        submitButton.classList.add('loading');
        submitButton.disabled = true;
        successMessage.textContent = '';

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Show success message
        contactForm.reset();
        successMessage.textContent = '¡Mensaje enviado! Gracias por contactarme.';
        setTimeout(() => successMessage.textContent = '', 5000); // Clear message after 5s

        // Reset button state
        submitButton.classList.remove('loading');
        submitButton.disabled = false;
    }

    function validateField(field) {
        let error = '';
        const value = field.value.trim();

        if (field.required && !value) {
            error = 'Este campo es requerido.';
        } else {
            switch (field.name) {
                case 'name':
                    if (value.length < 2) error = 'El nombre debe tener al menos 2 caracteres.';
                    break;
                case 'email':
                    if (!/^\S+@\S+\.\S+$/.test(value)) error = 'Por favor, ingresa un email válido.';
                    break;
                case 'subject':
                    if (value.length < 5) error = 'El asunto debe tener al menos 5 caracteres.';
                    break;
                case 'message':
                    if (value.length < 10) error = 'El mensaje debe tener al menos 10 caracteres.';
                    break;
            }
        }
        showFieldError(field, error);
        return !error;
    }

    function validateAllFields() {
        let isValid = true;
        contactForm.querySelectorAll('input, textarea').forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });
        return isValid;
    }

    function showFieldError(field, message) {
        const errorContainer = field.nextElementSibling;
        if (errorContainer && errorContainer.classList.contains('error-message')) {
            errorContainer.textContent = message;
        }
    }

    function clearFieldError(field) {
        showFieldError(field, '');
    }
});