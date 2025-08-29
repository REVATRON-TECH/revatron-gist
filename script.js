// Blog Website Main JavaScript
class BlogManager {
    constructor() {
        this.posts = [];
        this.filteredPosts = [];
        this.currentCategory = 'all';
        this.searchQuery = '';
        this.currentUser = null;
        this.currentPostId = null;
        this.init();
    }

    init() {
        this.loadPosts();
        this.setupEventListeners();
        this.setupDarkMode();
        this.checkUserSession();
        this.createSamplePosts();
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.getElementById('searchBtn');
        
        if (searchInput && searchBtn) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value.toLowerCase();
                this.filterPosts();
            });
            
            searchBtn.addEventListener('click', () => {
                this.filterPosts();
            });
            
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.filterPosts();
                }
            });
        }

        // Category filtering
        const categoryBtns = document.querySelectorAll('.category-btn');
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Remove active class from all buttons
                categoryBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                e.target.classList.add('active');
                
                this.currentCategory = e.target.dataset.category;
                this.filterPosts();
            });
        });

        // Dark mode toggle
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (darkModeToggle) {
            darkModeToggle.addEventListener('click', () => {
                this.toggleDarkMode();
            });
        }

        // Sign in functionality
        const signInBtn = document.getElementById('signInBtn');
        const signInForm = document.getElementById('signInForm');
        const registerForm = document.getElementById('registerForm');
        const signOutBtn = document.getElementById('signOutBtn');
        
        if (signInBtn) {
            signInBtn.addEventListener('click', () => {
                this.openSignInModal();
            });
        }
        
        if (signInForm) {
            signInForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSignIn();
            });
        }
        
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegister();
            });
        }
        
        if (signOutBtn) {
            signOutBtn.addEventListener('click', () => {
                this.handleSignOut();
            });
        }

        // Comment functionality
        const submitCommentBtn = document.getElementById('submitComment');
        if (submitCommentBtn) {
            submitCommentBtn.addEventListener('click', () => {
                this.submitComment();
            });
        }

        // Modal functionality
        const modal = document.getElementById('postModal');
        const closeBtn = document.querySelector('.close');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }
        
        if (modal) {
            window.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
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

    loadPosts() {
        const savedPosts = localStorage.getItem('blogPosts');
        if (savedPosts) {
            this.posts = JSON.parse(savedPosts);
        }
        this.filterPosts();
    }

    createSamplePosts() {
        if (this.posts.length === 0) {
            const samplePosts = [
                {
                    id: 1,
                    title: "Getting Started with JavaScript ES6",
                    excerpt: "Learn the modern features of JavaScript ES6 including arrow functions, destructuring, and modules.",
                    content: `
                        <h2>Introduction to ES6</h2>
                        <p>JavaScript ES6 (ECMAScript 2015) introduced many powerful features that make JavaScript development more efficient and enjoyable.</p>
                        
                        <h3>Arrow Functions</h3>
                        <p>Arrow functions provide a more concise way to write functions:</p>
                        <pre><code>const add = (a, b) => a + b;</code></pre>
                        
                        <h3>Destructuring</h3>
                        <p>Destructuring allows you to extract values from arrays and objects:</p>
                        <pre><code>const {name, age} = person;</code></pre>
                        
                        <h3>Template Literals</h3>
                        <p>Template literals make string interpolation easier:</p>
                        <pre><code>const message = \`Hello, \${name}!\`;</code></pre>
                    `,
                    category: "programming",
                    status: "published",
                    date: new Date('2024-01-15').toISOString(),
                    featuredImage: null,
                    gallery: []
                },
                {
                    id: 2,
                    title: "The Future of Artificial Intelligence",
                    excerpt: "Exploring the latest developments in AI and machine learning technologies.",
                    content: `
                        <h2>AI Revolution</h2>
                        <p>Artificial Intelligence is transforming every aspect of our lives, from healthcare to transportation.</p>
                        
                        <h3>Machine Learning</h3>
                        <p>Machine learning algorithms are becoming more sophisticated and accessible.</p>
                        
                        <h3>Natural Language Processing</h3>
                        <p>NLP has made significant strides with models like GPT and BERT.</p>
                        
                        <h3>Computer Vision</h3>
                        <p>Computer vision applications are revolutionizing industries like automotive and healthcare.</p>
                    `,
                    category: "ai",
                    status: "published",
                    date: new Date('2024-01-20').toISOString(),
                    featuredImage: null,
                    gallery: []
                },
                {
                    id: 3,
                    title: "Building Responsive Web Applications",
                    excerpt: "Best practices for creating web applications that work seamlessly across all devices.",
                    content: `
                        <h2>Responsive Design Principles</h2>
                        <p>Creating responsive web applications is essential in today's multi-device world.</p>
                        
                        <h3>Mobile-First Approach</h3>
                        <p>Start designing for mobile devices and progressively enhance for larger screens.</p>
                        
                        <h3>Flexible Grid Systems</h3>
                        <p>Use CSS Grid and Flexbox for creating flexible layouts.</p>
                        
                        <h3>Media Queries</h3>
                        <p>Implement breakpoints to adapt your design for different screen sizes.</p>
                    `,
                    category: "web-development",
                    status: "published",
                    date: new Date('2024-01-25').toISOString(),
                    featuredImage: null,
                    gallery: []
                },
                {
                    id: 4,
                    title: "Mobile App Development Trends 2024",
                    excerpt: "Discover the latest trends and technologies shaping mobile app development.",
                    content: `
                        <h2>Mobile Development Landscape</h2>
                        <p>The mobile app development industry continues to evolve with new frameworks and technologies.</p>
                        
                        <h3>Cross-Platform Development</h3>
                        <p>React Native and Flutter are leading the cross-platform development space.</p>
                        
                        <h3>Progressive Web Apps</h3>
                        <p>PWAs offer native-like experiences through web technologies.</p>
                        
                        <h3>5G Integration</h3>
                        <p>5G networks are enabling new possibilities for mobile applications.</p>
                    `,
                    category: "mobile",
                    status: "published",
                    date: new Date('2024-02-01').toISOString(),
                    featuredImage: null,
                    gallery: []
                },
                {
                    id: 5,
                    title: "Cloud Computing Fundamentals",
                    excerpt: "Understanding the basics of cloud computing and its impact on modern technology.",
                    content: `
                        <h2>Introduction to Cloud Computing</h2>
                        <p>Cloud computing has revolutionized how we store, process, and access data.</p>
                        
                        <h3>Service Models</h3>
                        <p>Learn about IaaS, PaaS, and SaaS service models.</p>
                        
                        <h3>Deployment Models</h3>
                        <p>Understand public, private, and hybrid cloud deployments.</p>
                        
                        <h3>Benefits and Challenges</h3>
                        <p>Explore the advantages and potential drawbacks of cloud adoption.</p>
                    `,
                    category: "technology",
                    status: "published",
                    date: new Date('2024-02-05').toISOString(),
                    featuredImage: null,
                    gallery: []
                },
                {
                    id: 6,
                    title: "Cybersecurity Best Practices",
                    excerpt: "Essential security measures every developer and organization should implement.",
                    content: `
                        <h2>Cybersecurity Essentials</h2>
                        <p>In today's digital landscape, cybersecurity is more important than ever.</p>
                        
                        <h3>Password Security</h3>
                        <p>Implement strong password policies and multi-factor authentication.</p>
                        
                        <h3>Data Encryption</h3>
                        <p>Protect sensitive data with proper encryption techniques.</p>
                        
                        <h3>Regular Updates</h3>
                        <p>Keep systems and software updated to patch security vulnerabilities.</p>
                    `,
                    category: "technology",
                    status: "published",
                    date: new Date('2024-02-10').toISOString(),
                    featuredImage: null,
                    gallery: []
                },
                {
                    id: 7,
                    title: "Introduction to DevOps",
                    excerpt: "Learn how DevOps practices can improve software development and deployment.",
                    content: `
                        <h2>DevOps Culture</h2>
                        <p>DevOps bridges the gap between development and operations teams.</p>
                        
                        <h3>Continuous Integration</h3>
                        <p>Automate code integration and testing processes.</p>
                        
                        <h3>Continuous Deployment</h3>
                        <p>Streamline the deployment pipeline for faster releases.</p>
                        
                        <h3>Infrastructure as Code</h3>
                        <p>Manage infrastructure through code and version control.</p>
                    `,
                    category: "programming",
                    status: "draft",
                    date: new Date('2024-02-15').toISOString(),
                    featuredImage: null,
                    gallery: [],
                    type: "article"
                },
                {
                    id: 8,
                    title: "Building Modern Web Applications - Video Tutorial",
                    excerpt: "Watch this comprehensive video guide on creating responsive web applications with modern frameworks.",
                    content: `
                        <h2>Modern Web Development</h2>
                        <p>This video tutorial covers the essential concepts of building modern web applications.</p>
                        
                        <h3>Topics Covered</h3>
                        <ul>
                            <li>React.js fundamentals</li>
                            <li>State management</li>
                            <li>API integration</li>
                            <li>Responsive design</li>
                        </ul>
                        
                        <p>Follow along with the practical examples and build your own web application.</p>
                    `,
                    category: "web-development",
                    status: "published",
                    date: new Date('2024-02-20').toISOString(),
                    featuredImage: null,
                    gallery: [],
                    type: "video",
                    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
                }
            ];
            
            this.posts = samplePosts;
            localStorage.setItem('blogPosts', JSON.stringify(this.posts));
        }
    }

    filterPosts() {
        this.filteredPosts = this.posts.filter(post => {
            // Only show published posts on the main site
            if (post.status !== 'published') return false;
            
            // Category filter
            const categoryMatch = this.currentCategory === 'all' || post.category === this.currentCategory;
            
            // Search filter
            const searchMatch = this.searchQuery === '' || 
                post.title.toLowerCase().includes(this.searchQuery) ||
                post.excerpt.toLowerCase().includes(this.searchQuery) ||
                post.content.toLowerCase().includes(this.searchQuery);
            
            return categoryMatch && searchMatch;
        });
        
        this.renderPosts();
    }

    renderPosts() {
        const container = document.getElementById('postsContainer');
        if (!container) return;

        if (this.filteredPosts.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: var(--text-secondary);">
                    <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                    <h3>No posts found</h3>
                    <p>Try adjusting your search or category filter.</p>
                </div>
            `;
            return;
        }

        // Sort posts by date (newest first)
        this.filteredPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

        container.innerHTML = this.filteredPosts.map(post => `
            <article class="post-card fade-in" onclick="blogManager.openPost(${post.id})">
                ${post.type === 'video' ? `
                    <div class="post-video">
                        ${post.videoUrl ? 
                            `<div class="video-embed">
                                <iframe src="${post.videoUrl}" allowfullscreen></iframe>
                            </div>` :
                            '<i class="fas fa-play-circle"></i>'
                        }
                    </div>
                ` : `
                    <div class="post-image">
                        ${post.featuredImage ? 
                            `<img src="${post.featuredImage}" alt="${post.title}">` : 
                            '<i class="fas fa-image"></i>'
                        }
                    </div>
                `}
                <div class="post-content">
                    <div class="post-meta">
                        <span class="post-category">${this.formatCategory(post.category)}</span>
                        <span>${this.formatDate(post.date)}</span>
                        ${post.type === 'video' ? '<i class="fas fa-video" style="margin-left: 0.5rem; color: var(--accent-color);"></i>' : ''}
                    </div>
                    <h2 class="post-title">${post.title}</h2>
                    <p class="post-excerpt">${post.excerpt}</p>
                    <span class="post-status status-${post.status}">${post.status}</span>
                </div>
            </article>
        `).join('');
    }

    openPost(postId) {
        const post = this.posts.find(p => p.id === postId);
        if (!post) return;

        const modal = document.getElementById('postModal');
        const modalContent = document.getElementById('modalContent');
        
        if (!modal || !modalContent) return;

        modalContent.innerHTML = `
            ${post.type === 'video' && post.videoUrl ? 
                `<div class="modal-post-video">
                    <div class="video-embed">
                        <iframe src="${post.videoUrl}" allowfullscreen></iframe>
                    </div>
                </div>` :
                post.featuredImage ? 
                    `<img src="${post.featuredImage}" alt="${post.title}" class="modal-post-image">` : 
                    ''
            }
            <div class="modal-post-content">
                <h1 class="modal-post-title">${post.title}</h1>
                <div class="modal-post-meta">
                    <span><i class="fas fa-calendar"></i> ${this.formatDate(post.date)}</span>
                    <span><i class="fas fa-tag"></i> ${this.formatCategory(post.category)}</span>
                    <span><i class="fas fa-eye"></i> ${post.status}</span>
                    ${post.type === 'video' ? '<span><i class="fas fa-video"></i> Video Post</span>' : ''}
                </div>
                <div class="modal-post-body">
                    ${post.content}
                    ${post.gallery && post.gallery.length > 0 ? `
                        <h3>Gallery</h3>
                        <div class="post-gallery">
                            ${post.gallery.map(img => `
                                <img src="${img}" alt="Gallery image" class="gallery-image" onclick="this.style.transform = this.style.transform ? '' : 'scale(2)'; this.style.zIndex = this.style.zIndex ? '' : '1000'; this.style.position = this.style.position ? '' : 'fixed'; this.style.top = this.style.top ? '' : '50%'; this.style.left = this.style.left ? '' : '50%'; this.style.transform = this.style.transform ? '' : 'translate(-50%, -50%) scale(2)';">
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
        
        this.currentPostId = postId;
        this.loadComments(postId);
        this.updateCommentSection();
        
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Close modal when clicking outside or on close button
        modal.onclick = (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        };
    }

    formatCategory(category) {
        return category.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // User Authentication Methods
    checkUserSession() {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.updateUserInterface();
        }
    }

    openSignInModal() {
        const modal = document.getElementById('signInModal');
        if (modal) {
            modal.style.display = 'block';
        }
    }

    handleSignIn() {
        const email = document.getElementById('signInEmail').value.trim();
        const password = document.getElementById('signInPassword').value;
        const loginError = document.getElementById('loginError');
        
        if (!email || !password) {
            loginError.textContent = 'Please fill in all fields.';
            return;
        }
        
        // Check if user exists in registered users
        const registeredUsers = this.getRegisteredUsers();
        const user = registeredUsers.find(u => u.email === email);
        
        if (!user) {
            loginError.textContent = 'No account found with this email. Please create an account first.';
            return;
        }
        
        if (user.password !== password) {
            loginError.textContent = 'Invalid password. Please try again.';
            return;
        }
        
        // Successful login
        this.currentUser = {
            email: user.email,
            name: user.name,
            loginTime: new Date().toISOString()
        };
        
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        this.updateUserInterface();
        this.closeSignInModal();
        this.updateCommentSection();
        loginError.textContent = '';
    }

    handleRegister() {
        const name = document.getElementById('registerName').value.trim();
        const email = document.getElementById('registerEmail').value.trim();
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const registerError = document.getElementById('registerError');
        
        // Validation
        if (!name || !email || !password || !confirmPassword) {
            registerError.textContent = 'Please fill in all fields.';
            return;
        }
        
        if (password.length < 6) {
            registerError.textContent = 'Password must be at least 6 characters long.';
            return;
        }
        
        if (password !== confirmPassword) {
            registerError.textContent = 'Passwords do not match.';
            return;
        }
        
        // Check if email already exists
        const registeredUsers = this.getRegisteredUsers();
        if (registeredUsers.find(u => u.email === email)) {
            registerError.textContent = 'An account with this email already exists.';
            return;
        }
        
        // Create new user account
        const newUser = {
            name: name,
            email: email,
            password: password,
            registrationDate: new Date().toISOString()
        };
        
        registeredUsers.push(newUser);
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
        
        // Auto sign in the new user
        this.currentUser = {
            email: newUser.email,
            name: newUser.name,
            loginTime: new Date().toISOString()
        };
        
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        this.updateUserInterface();
        this.closeSignInModal();
        this.updateCommentSection();
        registerError.textContent = '';
        
        alert('Account created successfully! You are now signed in.');
    }

    getRegisteredUsers() {
        const users = localStorage.getItem('registeredUsers');
        return users ? JSON.parse(users) : [];
    }

    closeSignInModal() {
        const modal = document.getElementById('signInModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    handleSignOut() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        this.updateUserInterface();
        this.updateCommentSection();
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

    // Comment System Methods
    loadComments(postId) {
        const savedComments = localStorage.getItem('postComments');
        const allComments = savedComments ? JSON.parse(savedComments) : {};
        return allComments[postId] || [];
    }

    saveComments(postId, comments) {
        const savedComments = localStorage.getItem('postComments');
        const allComments = savedComments ? JSON.parse(savedComments) : {};
        allComments[postId] = comments;
        localStorage.setItem('postComments', JSON.stringify(allComments));
    }

    updateCommentSection() {
        const commentForm = document.getElementById('commentForm');
        const signInPrompt = document.getElementById('signInPrompt');
        const commentsList = document.getElementById('commentsList');
        
        if (!this.currentPostId) return;
        
        if (this.currentUser) {
            if (commentForm) commentForm.style.display = 'block';
            if (signInPrompt) signInPrompt.style.display = 'none';
        } else {
            if (commentForm) commentForm.style.display = 'none';
            if (signInPrompt) signInPrompt.style.display = 'block';
        }
        
        this.renderComments();
    }

    renderComments() {
        const commentsList = document.getElementById('commentsList');
        if (!commentsList || !this.currentPostId) return;
        
        const comments = this.loadComments(this.currentPostId);
        
        if (comments.length === 0) {
            commentsList.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">No comments yet. Be the first to comment!</p>';
            return;
        }
        
        commentsList.innerHTML = comments.map(comment => `
            <div class="comment">
                <div class="comment-header">
                    <span class="comment-author">${comment.author}</span>
                    <span class="comment-date">${this.formatDate(comment.date)}</span>
                </div>
                <div class="comment-text">${comment.text}</div>
            </div>
        `).join('');
    }

    submitComment() {
        if (!this.currentUser || !this.currentPostId) return;
        
        const commentText = document.getElementById('commentText').value.trim();
        if (!commentText) {
            alert('Please enter a comment.');
            return;
        }
        
        const comments = this.loadComments(this.currentPostId);
        const newComment = {
            id: Date.now(),
            author: this.currentUser.name,
            email: this.currentUser.email,
            text: commentText,
            date: new Date().toISOString()
        };
        
        comments.push(newComment);
        this.saveComments(this.currentPostId, comments);
        
        document.getElementById('commentText').value = '';
        this.renderComments();
    }
}

// Global functions for modal handling
function closeSignInModal() {
    const modal = document.getElementById('signInModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function showLoginForm() {
    document.getElementById('loginFormContainer').style.display = 'block';
    document.getElementById('registerFormContainer').style.display = 'none';
    document.getElementById('loginTab').classList.add('active');
    document.getElementById('registerTab').classList.remove('active');
    
    // Clear error messages
    document.getElementById('loginError').textContent = '';
    document.getElementById('registerError').textContent = '';
}

function showRegisterForm() {
    document.getElementById('loginFormContainer').style.display = 'none';
    document.getElementById('registerFormContainer').style.display = 'block';
    document.getElementById('loginTab').classList.remove('active');
    document.getElementById('registerTab').classList.add('active');
    
    // Clear error messages
    document.getElementById('loginError').textContent = '';
    document.getElementById('registerError').textContent = '';
}

// Initialize the blog manager when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.blogManager = new BlogManager();
});

// Utility functions for image handling
function convertImageToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function resizeImage(file, maxWidth = 800, quality = 0.8) {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = () => {
            const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
            canvas.width = img.width * ratio;
            canvas.height = img.height * ratio;
            
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            canvas.toBlob(resolve, 'image/jpeg', quality);
        };
        
        img.src = URL.createObjectURL(file);
    });
}
