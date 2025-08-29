// Admin Panel JavaScript
class AdminManager {
    constructor() {
        this.posts = [];
        this.filteredPosts = [];
        this.isLoggedIn = false;
        this.editingPostId = null;
        this.init();
    }

    init() {
        this.checkLoginStatus();
        this.setupEventListeners();
        this.setupDarkMode();
        this.loadPosts();
    }

    checkLoginStatus() {
        const loginStatus = sessionStorage.getItem('adminLoggedIn');
        this.isLoggedIn = loginStatus === 'true';
        
        if (this.isLoggedIn) {
            this.showDashboard();
        } else {
            this.showLogin();
        }
    }

    setupEventListeners() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.handleLogout();
            });
        }

        // Post form
        const postForm = document.getElementById('postForm');
        if (postForm) {
            postForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handlePostSubmit();
            });
        }

        // Quick edit form
        const quickEditForm = document.getElementById('quickEditForm');
        if (quickEditForm) {
            quickEditForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleQuickEdit();
            });
        }

        // Cancel edit button
        const cancelEditBtn = document.getElementById('cancelEdit');
        if (cancelEditBtn) {
            cancelEditBtn.addEventListener('click', () => {
                this.cancelEdit();
            });
        }

        // Featured image upload
        const featuredImageInput = document.getElementById('featuredImage');
        if (featuredImageInput) {
            featuredImageInput.addEventListener('change', (e) => {
                this.handleFeaturedImageUpload(e);
            });
        }

        // Gallery images upload
        const galleryImagesInput = document.getElementById('galleryImages');
        if (galleryImagesInput) {
            galleryImagesInput.addEventListener('change', (e) => {
                this.handleGalleryImagesUpload(e);
            });
        }

        // Admin search and filters
        const adminSearchInput = document.getElementById('adminSearchInput');
        if (adminSearchInput) {
            adminSearchInput.addEventListener('input', () => {
                this.filterAdminPosts();
            });
        }

        const adminCategoryFilter = document.getElementById('adminCategoryFilter');
        if (adminCategoryFilter) {
            adminCategoryFilter.addEventListener('change', () => {
                this.filterAdminPosts();
            });
        }

        const adminStatusFilter = document.getElementById('adminStatusFilter');
        if (adminStatusFilter) {
            adminStatusFilter.addEventListener('change', () => {
                this.filterAdminPosts();
            });
        }

        // Dark mode toggle for admin
        const darkModeToggleAdmin = document.getElementById('darkModeToggleAdmin');
        if (darkModeToggleAdmin) {
            darkModeToggleAdmin.addEventListener('click', () => {
                this.toggleDarkMode();
            });
        }

        // Draft checkbox toggle
        const isDraftCheckbox = document.getElementById('isDraft');
        if (isDraftCheckbox) {
            isDraftCheckbox.addEventListener('change', (e) => {
                this.updateSubmitButtonText(e.target.checked);
            });
        }

        // Post type change handler
        const postTypeSelect = document.getElementById('postType');
        if (postTypeSelect) {
            postTypeSelect.addEventListener('change', (e) => {
                this.toggleVideoFields(e.target.value === 'video');
            });
        }

        // CSV export functionality
        const exportUsersBtn = document.getElementById('exportUsersBtn');
        if (exportUsersBtn) {
            exportUsersBtn.addEventListener('click', () => {
                this.exportUsersToCSV();
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
        const darkModeToggle = document.getElementById('darkModeToggleAdmin');
        if (darkModeToggle) {
            const icon = darkModeToggle.querySelector('i');
            const text = darkModeToggle.childNodes[1];
            if (icon) {
                icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
            }
            if (text) {
                text.textContent = isDark ? ' Light Mode' : ' Dark Mode';
            }
        }
    }

    handleLogin() {
        const passwordInput = document.getElementById('password');
        const errorDiv = document.getElementById('loginError');
        const password = passwordInput.value;

        // Simple password check (in production, use proper authentication)
        if (password === 'admin123') {
            sessionStorage.setItem('adminLoggedIn', 'true');
            this.isLoggedIn = true;
            this.showDashboard();
            errorDiv.textContent = '';
        } else {
            errorDiv.textContent = 'Invalid password. Please try again.';
            passwordInput.value = '';
        }
    }

    handleLogout() {
        sessionStorage.removeItem('adminLoggedIn');
        this.isLoggedIn = false;
        this.showLogin();
    }

    showLogin() {
        const loginPage = document.getElementById('loginPage');
        const adminDashboard = document.getElementById('adminDashboard');
        
        if (loginPage) loginPage.style.display = 'flex';
        if (adminDashboard) adminDashboard.style.display = 'none';
    }

    showDashboard() {
        const loginPage = document.getElementById('loginPage');
        const adminDashboard = document.getElementById('adminDashboard');
        
        if (loginPage) loginPage.style.display = 'none';
        if (adminDashboard) adminDashboard.style.display = 'block';
        
        this.loadPosts();
        this.renderAdminPosts();
        this.loadUsers();
        this.renderAdminUsers();
    }

    loadPosts() {
        const savedPosts = localStorage.getItem('blogPosts');
        if (savedPosts) {
            this.posts = JSON.parse(savedPosts);
        }
        this.filteredPosts = [...this.posts];
    }

    savePosts() {
        localStorage.setItem('blogPosts', JSON.stringify(this.posts));
    }

    async handleFeaturedImageUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        try {
            const resizedFile = await this.resizeImage(file, 800, 0.8);
            const base64 = await this.convertImageToBase64(resizedFile);
            
            const preview = document.getElementById('featuredImagePreview');
            if (preview) {
                preview.src = base64;
                preview.style.display = 'block';
            }
        } catch (error) {
            console.error('Error processing featured image:', error);
            alert('Error processing image. Please try again.');
        }
    }

    async handleGalleryImagesUpload(event) {
        const files = Array.from(event.target.files);
        if (files.length === 0) return;

        const galleryPreview = document.getElementById('galleryPreview');
        if (!galleryPreview) return;

        galleryPreview.innerHTML = '<div class="loading"><div class="spinner"></div></div>';

        try {
            const processedImages = [];
            
            for (const file of files) {
                const resizedFile = await this.resizeImage(file, 600, 0.8);
                const base64 = await this.convertImageToBase64(resizedFile);
                processedImages.push(base64);
            }

            galleryPreview.innerHTML = processedImages.map((img, index) => `
                <div style="position: relative;">
                    <img src="${img}" alt="Gallery image ${index + 1}" class="gallery-image">
                    <button type="button" onclick="this.parentElement.remove()" 
                            style="position: absolute; top: 5px; right: 5px; background: rgba(255,0,0,0.8); color: white; border: none; border-radius: 50%; width: 25px; height: 25px; cursor: pointer; font-size: 12px;">×</button>
                </div>
            `).join('');
        } catch (error) {
            console.error('Error processing gallery images:', error);
            alert('Error processing images. Please try again.');
            galleryPreview.innerHTML = '';
        }
    }

    handlePostSubmit() {
        const form = document.getElementById('postForm');
        const formData = new FormData(form);
        
        const title = formData.get('title').trim();
        const category = formData.get('category');
        const excerpt = formData.get('excerpt').trim();
        const content = formData.get('content').trim();
        const postType = document.getElementById('postType').value;
        const videoUrl = document.getElementById('videoUrl').value.trim();
        const isDraft = document.getElementById('isDraft').checked;
        
        if (!title || !category || !excerpt || !content) {
            alert('Please fill in all required fields.');
            return;
        }

        if (postType === 'video' && !videoUrl) {
            alert('Please provide a video URL for video posts.');
            return;
        }

        // Get featured image
        const featuredImagePreview = document.getElementById('featuredImagePreview');
        const featuredImage = featuredImagePreview && featuredImagePreview.style.display !== 'none' 
            ? featuredImagePreview.src : null;

        // Get gallery images
        const galleryImages = Array.from(document.querySelectorAll('#galleryPreview img'))
            .map(img => img.src);

        const post = {
            id: this.editingPostId || Date.now(),
            title,
            excerpt,
            content: this.formatContent(content),
            category,
            type: postType,
            status: isDraft ? 'draft' : 'published',
            date: this.editingPostId ? 
                this.posts.find(p => p.id === this.editingPostId).date : 
                new Date().toISOString(),
            featuredImage,
            gallery: galleryImages,
            videoUrl: postType === 'video' ? videoUrl : null
        };

        if (this.editingPostId) {
            // Update existing post
            const index = this.posts.findIndex(p => p.id === this.editingPostId);
            if (index !== -1) {
                this.posts[index] = post;
            }
        } else {
            // Add new post
            this.posts.unshift(post);
        }

        this.savePosts();
        this.resetForm();
        this.renderAdminPosts();
        
        const action = this.editingPostId ? 'updated' : 'created';
        alert(`Post ${action} successfully!`);
    }

    formatContent(content) {
        // Simple content formatting - convert line breaks to paragraphs
        return content
            .split('\n\n')
            .map(paragraph => paragraph.trim())
            .filter(paragraph => paragraph.length > 0)
            .map(paragraph => `<p>${paragraph.replace(/\n/g, '<br>')}</p>`)
            .join('\n');
    }

    resetForm() {
        const form = document.getElementById('postForm');
        if (form) form.reset();
        
        const featuredImagePreview = document.getElementById('featuredImagePreview');
        if (featuredImagePreview) {
            featuredImagePreview.style.display = 'none';
            featuredImagePreview.src = '';
        }
        
        const galleryPreview = document.getElementById('galleryPreview');
        if (galleryPreview) galleryPreview.innerHTML = '';
        
        const cancelEditBtn = document.getElementById('cancelEdit');
        if (cancelEditBtn) cancelEditBtn.style.display = 'none';
        
        this.editingPostId = null;
        this.updateSubmitButtonText(false);
        
        // Reset form title
        const formTitle = document.querySelector('.post-form h3');
        if (formTitle) formTitle.textContent = 'Create New Post';
    }

    editPost(postId) {
        const post = this.posts.find(p => p.id === postId);
        if (!post) return;

        this.editingPostId = postId;
        
        // Fill form with post data
        document.getElementById('postTitle').value = post.title;
        document.getElementById('postCategory').value = post.category;
        document.getElementById('postExcerpt').value = post.excerpt;
        document.getElementById('postContent').value = post.content.replace(/<p>/g, '').replace(/<\/p>/g, '\n\n').replace(/<br>/g, '\n');
        document.getElementById('postType').value = post.type || 'article';
        document.getElementById('videoUrl').value = post.videoUrl || '';
        document.getElementById('isDraft').checked = post.status === 'draft';
        
        // Toggle video fields based on post type
        this.toggleVideoFields(post.type === 'video');
        
        // Set featured image
        if (post.featuredImage) {
            const featuredImagePreview = document.getElementById('featuredImagePreview');
            if (featuredImagePreview) {
                featuredImagePreview.src = post.featuredImage;
                featuredImagePreview.style.display = 'block';
            }
        }
        
        // Set gallery images
        if (post.gallery && post.gallery.length > 0) {
            const galleryPreview = document.getElementById('galleryPreview');
            if (galleryPreview) {
                galleryPreview.innerHTML = post.gallery.map((img, index) => `
                    <div style="position: relative;">
                        <img src="${img}" alt="Gallery image ${index + 1}" class="gallery-image">
                        <button type="button" onclick="this.parentElement.remove()" 
                                style="position: absolute; top: 5px; right: 5px; background: rgba(255,0,0,0.8); color: white; border: none; border-radius: 50%; width: 25px; height: 25px; cursor: pointer; font-size: 12px;">×</button>
                    </div>
                `).join('');
            }
        }
        
        // Update UI
        const cancelEditBtn = document.getElementById('cancelEdit');
        if (cancelEditBtn) cancelEditBtn.style.display = 'inline-block';
        
        const formTitle = document.querySelector('.post-form h3');
        if (formTitle) formTitle.textContent = 'Edit Post';
        
        this.updateSubmitButtonText(post.status === 'draft');
        
        // Scroll to form
        document.querySelector('.post-form').scrollIntoView({ behavior: 'smooth' });
    }

    toggleVideoFields(isVideo) {
        const videoUrlGroup = document.getElementById('videoUrlGroup');
        if (videoUrlGroup) {
            videoUrlGroup.style.display = isVideo ? 'block' : 'none';
        }
    }

    cancelEdit() {
        this.resetForm();
    }

    deletePost(postId) {
        if (!confirm('Are you sure you want to delete this post?')) return;
        
        this.posts = this.posts.filter(p => p.id !== postId);
        this.savePosts();
        this.renderAdminPosts();
        alert('Post deleted successfully!');
    }

    openQuickEdit(postId) {
        const post = this.posts.find(p => p.id === postId);
        if (!post) return;

        document.getElementById('quickEditPostId').value = postId;
        document.getElementById('quickEditTitle').value = post.title;
        document.getElementById('quickEditCategory').value = post.category;
        document.getElementById('quickEditExcerpt').value = post.excerpt;
        document.getElementById('quickEditDraft').checked = post.status === 'draft';
        
        document.getElementById('quickEditModal').style.display = 'block';
    }

    handleQuickEdit() {
        const postId = parseInt(document.getElementById('quickEditPostId').value);
        const title = document.getElementById('quickEditTitle').value.trim();
        const category = document.getElementById('quickEditCategory').value;
        const excerpt = document.getElementById('quickEditExcerpt').value.trim();
        const isDraft = document.getElementById('quickEditDraft').checked;
        
        if (!title || !category || !excerpt) {
            alert('Please fill in all required fields.');
            return;
        }

        const postIndex = this.posts.findIndex(p => p.id === postId);
        if (postIndex !== -1) {
            this.posts[postIndex] = {
                ...this.posts[postIndex],
                title,
                category,
                excerpt,
                status: isDraft ? 'draft' : 'published'
            };
            
            this.savePosts();
            this.renderAdminPosts();
            this.closeQuickEditModal();
            alert('Post updated successfully!');
        }
    }

    closeQuickEditModal() {
        document.getElementById('quickEditModal').style.display = 'none';
    }

    filterAdminPosts() {
        const searchQuery = document.getElementById('adminSearchInput').value.toLowerCase();
        const categoryFilter = document.getElementById('adminCategoryFilter').value;
        const statusFilter = document.getElementById('adminStatusFilter').value;
        
        this.filteredPosts = this.posts.filter(post => {
            const matchesSearch = !searchQuery || 
                post.title.toLowerCase().includes(searchQuery) ||
                post.excerpt.toLowerCase().includes(searchQuery);
            
            const matchesCategory = !categoryFilter || post.category === categoryFilter;
            const matchesStatus = !statusFilter || post.status === statusFilter;
            
            return matchesSearch && matchesCategory && matchesStatus;
        });
        
        this.renderAdminPosts();
    }

    renderAdminPosts() {
        const tbody = document.getElementById('postsTableBody');
        if (!tbody) return;

        if (this.filteredPosts.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                        No posts found
                    </td>
                </tr>
            `;
            return;
        }

        // Sort posts by date (newest first)
        this.filteredPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

        tbody.innerHTML = this.filteredPosts.map(post => `
            <tr>
                <td>
                    <strong>${post.title}</strong>
                    <br>
                    <small style="color: var(--text-secondary);">${post.excerpt.substring(0, 100)}${post.excerpt.length > 100 ? '...' : ''}</small>
                </td>
                <td>
                    <span class="post-category">${this.formatCategory(post.category)}</span>
                </td>
                <td>
                    <span class="post-status status-${post.status}">${post.status}</span>
                </td>
                <td>${this.formatDate(post.date)}</td>
                <td>
                    <div class="post-actions">
                        <button onclick="adminManager.openQuickEdit(${post.id})" class="btn btn-sm btn-warning" title="Quick Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="adminManager.editPost(${post.id})" class="btn btn-sm btn-primary" title="Full Edit">
                            <i class="fas fa-pen"></i>
                        </button>
                        <button onclick="adminManager.deletePost(${post.id})" class="btn btn-sm btn-danger" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    updateSubmitButtonText(isDraft) {
        const submitBtnText = document.getElementById('submitBtnText');
        if (submitBtnText) {
            if (this.editingPostId) {
                submitBtnText.textContent = isDraft ? 'Save as Draft' : 'Update Post';
            } else {
                submitBtnText.textContent = isDraft ? 'Save as Draft' : 'Publish Post';
            }
        }
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
            month: 'short',
            day: 'numeric'
        });
    }

    async convertImageToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    async resizeImage(file, maxWidth = 800, quality = 0.8) {
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

    // User Management Methods
    loadUsers() {
        const savedUsers = localStorage.getItem('registeredUsers');
        this.users = savedUsers ? JSON.parse(savedUsers) : [];
    }

    renderAdminUsers() {
        const tbody = document.getElementById('usersTableBody');
        const userCount = document.getElementById('userCount');
        
        if (!tbody || !userCount) return;

        userCount.textContent = `Total registered users: ${this.users.length}`;

        if (this.users.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="4" style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                        No registered users yet
                    </td>
                </tr>
            `;
            return;
        }

        // Sort users by registration date (newest first)
        this.users.sort((a, b) => new Date(b.registrationDate) - new Date(a.registrationDate));

        tbody.innerHTML = this.users.map(user => `
            <tr>
                <td><strong>${user.name}</strong></td>
                <td>${user.email}</td>
                <td>${this.formatDate(user.registrationDate)}</td>
                <td>
                    <span class="post-status status-published">Active</span>
                </td>
            </tr>
        `).join('');
    }

    exportUsersToCSV() {
        if (this.users.length === 0) {
            alert('No users to export.');
            return;
        }

        // Create CSV content
        const headers = ['Name', 'Email', 'Registration Date'];
        const csvContent = [
            headers.join(','),
            ...this.users.map(user => [
                `"${user.name}"`,
                `"${user.email}"`,
                `"${this.formatDate(user.registrationDate)}"`
            ].join(','))
        ].join('\n');

        // Create and download file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `registered_users_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        alert(`Successfully exported ${this.users.length} users to CSV file.`);
    }
}

// Global functions for onclick handlers
function closeQuickEditModal() {
    document.getElementById('quickEditModal').style.display = 'none';
}

// Initialize the admin manager when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.adminManager = new AdminManager();
});
