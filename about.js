// About Page JavaScript
class AboutManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupDarkMode();
        this.checkUserSession();
        this.animateStats();
    }

    setupEventListeners() {
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

    animateStats() {
        const statItems = document.querySelectorAll('.stat-item h3');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const finalValue = target.textContent;
                    const numericValue = parseInt(finalValue.replace(/[^\d]/g, ''));
                    const suffix = finalValue.replace(/[\d,]/g, '');
                    
                    this.animateNumber(target, 0, numericValue, suffix, 2000);
                    observer.unobserve(target);
                }
            });
        });

        statItems.forEach(item => {
            observer.observe(item);
        });
    }

    animateNumber(element, start, end, suffix, duration) {
        const startTime = performance.now();
        
        const updateNumber = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const current = Math.floor(start + (end - start) * this.easeOutQuart(progress));
            element.textContent = current.toLocaleString() + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            }
        };
        
        requestAnimationFrame(updateNumber);
    }

    easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
    }
}

// Initialize about manager when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.aboutManager = new AboutManager();
});
