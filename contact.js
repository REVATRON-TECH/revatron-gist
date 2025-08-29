// Contact Page JavaScript
class ContactManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupDarkMode();
        this.checkUserSession();
    }

    setupEventListeners() {
        // Contact form submission
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleContactSubmit();
            });
        }

        // Dark mode toggle
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (darkModeToggle) {
            darkModeToggle.addEventListener('click', () => {
                this.toggleDarkMode();
            });
        }

        // Sign in/out functionality
        const signInBtn = document.getElementById('signInBtn');
        const signOutBtn = document.getElementById('signOutBtn');
        
        if (signInBtn) {
            signInBtn.addEventListener('click', () => {
                window.location.href = 'index.html';
            });
        }
        
        if (signOutBtn) {
            signOutBtn.addEventListener('click', () => {
                this.handleSignOut();
            });
        }
    }

    setupDarkMode() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
            this.updateDarkModeIcon(savedTheme === 'dark');
        }
    }

    toggleDarkMode() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        this.updateDarkModeIcon(newTheme === 'dark');
    }

    updateDarkModeIcon(isDark) {
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (darkModeToggle) {
            const icon = darkModeToggle.querySelector('i');
            if (icon) {
                icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
            }
        }
    }

    checkUserSession() {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.updateUserInterface();
        }
    }

    updateUserInterface() {
        const signInBtn = document.getElementById('signInBtn');
        const userMenu = document.getElementById('userMenu');
        const userEmail = document.getElementById('userEmail');
        
        if (this.currentUser) {
            if (signInBtn) signInBtn.style.display = 'none';
            if (userMenu) userMenu.style.display = 'flex';
            if (userEmail) userEmail.textContent = this.currentUser.email;
        } else {
            if (signInBtn) signInBtn.style.display = 'block';
            if (userMenu) userMenu.style.display = 'none';
        }
    }

    handleSignOut() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        this.updateUserInterface();
    }

    handleContactSubmit() {
        const form = document.getElementById('contactForm');
        const formData = new FormData(form);
        
        const contactData = {
            firstName: formData.get('firstName').trim(),
            lastName: formData.get('lastName').trim(),
            email: formData.get('email').trim(),
            subject: formData.get('subject'),
            message: formData.get('message').trim(),
            newsletter: formData.get('newsletter') === 'on',
            timestamp: new Date().toISOString()
        };

        // Validation
        if (!contactData.firstName || !contactData.lastName || !contactData.email || 
            !contactData.subject || !contactData.message) {
            alert('Please fill in all required fields.');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(contactData.email)) {
            alert('Please enter a valid email address.');
            return;
        }

        // Save contact message to localStorage
        this.saveContactMessage(contactData);
        
        // Show success message
        alert('Thank you for your message! We\'ll get back to you soon.');
        
        // Reset form
        form.reset();
    }

    saveContactMessage(contactData) {
        const savedMessages = localStorage.getItem('contactMessages');
        const messages = savedMessages ? JSON.parse(savedMessages) : [];
        
        messages.push({
            id: Date.now(),
            ...contactData
        });
        
        localStorage.setItem('contactMessages', JSON.stringify(messages));
    }
}

// Initialize contact manager when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.contactManager = new ContactManager();
});
