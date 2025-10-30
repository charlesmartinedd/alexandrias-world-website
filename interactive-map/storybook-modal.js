// Storybook Modal Functionality
// Loads stories dynamically from GitHub repository

class StorybookModal {
    constructor() {
        this.currentPage = 1;
        this.totalPages = 14;
        this.storyData = null;
        this.countryCode = null;
        this.init();
    }

    init() {
        // Create modal HTML structure
        this.createModalHTML();
        this.attachEventListeners();
    }

    createModalHTML() {
        const modalHTML = `
            <!-- Storybook Modal -->
            <div id="storybook-modal" class="storybook-modal">
                <div class="modal-content">
                    <button class="close-btn" id="close-modal">&times;</button>

                    <div class="book-container">
                        <div class="page-display">
                            <img id="page-image" src="" alt="Story Page" />
                            <div class="page-text" id="page-text"></div>
                        </div>

                        <div class="controls">
                            <button class="nav-btn" id="prev-page">← Previous</button>
                            <div class="page-info">
                                Page <span id="current-page">1</span> of <span id="total-pages">14</span>
                            </div>
                            <button class="nav-btn" id="next-page">Next →</button>
                        </div>

                        <div class="page-dots" id="page-dots"></div>

                        <div class="action-buttons">
                            <button class="action-btn" id="read-aloud">🔊 Read Aloud</button>
                            <button class="action-btn" id="collect-stamp" style="display:none;">⭐ Collect Stamp!</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    attachEventListeners() {
        document.getElementById('close-modal').addEventListener('click', () => this.closeModal());
        document.getElementById('prev-page').addEventListener('click', () => this.prevPage());
        document.getElementById('next-page').addEventListener('click', () => this.nextPage());
        document.getElementById('read-aloud').addEventListener('click', () => this.readAloud());
        document.getElementById('collect-stamp').addEventListener('click', () => this.collectStamp());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.isOpen()) {
                if (e.key === 'Escape') this.closeModal();
                if (e.key === 'ArrowLeft') this.prevPage();
                if (e.key === 'ArrowRight') this.nextPage();
            }
        });
    }

    async openStory(countryCode, countryName) {
        this.countryCode = countryCode;
        const countryFolder = getCountryFolder(countryCode);

        if (!countryFolder) {
            alert(`Sorry, ${countryName}'s storybook is coming soon! 🌍✨`);
            return;
        }

        try {
            // Load story data from GitHub
            const storyUrl = getStoryUrl(countryFolder);
            const response = await fetch(storyUrl);

            if (!response.ok) {
                throw new Error('Story not found');
            }

            this.storyData = await response.json();
            this.totalPages = this.storyData.pages.length;
            this.currentPage = 1;

            // Show modal
            document.getElementById('storybook-modal').style.display = 'flex';
            document.getElementById('total-pages').textContent = this.totalPages;

            // Create page dots
            this.createPageDots();

            // Load first page
            this.loadPage(1);

        } catch (error) {
            console.error('Error loading story:', error);
            alert(`Sorry, couldn't load ${countryName}'s story. Please try again! 🌍`);
        }
    }

    loadPage(pageNum) {
        if (!this.storyData || pageNum < 1 || pageNum > this.totalPages) return;

        this.currentPage = pageNum;
        const page = this.storyData.pages[pageNum - 1];

        // Load image from GitHub
        const imageUrl = getImageUrl(getCountryFolder(this.countryCode), page.image);
        document.getElementById('page-image').src = imageUrl;
        document.getElementById('page-text').textContent = page.text || '';
        document.getElementById('current-page').textContent = pageNum;

        // Update page dots
        this.updatePageDots();

        // Show/hide collect stamp button on last page
        if (pageNum === this.totalPages) {
            document.getElementById('collect-stamp').style.display = 'inline-block';
        } else {
            document.getElementById('collect-stamp').style.display = 'none';
        }

        // Update navigation buttons
        document.getElementById('prev-page').disabled = (pageNum === 1);
        document.getElementById('next-page').disabled = (pageNum === this.totalPages);
    }

    createPageDots() {
        const dotsContainer = document.getElementById('page-dots');
        dotsContainer.innerHTML = '';

        for (let i = 1; i <= this.totalPages; i++) {
            const dot = document.createElement('span');
            dot.className = 'page-dot';
            dot.dataset.page = i;
            dot.addEventListener('click', () => this.loadPage(i));
            dotsContainer.appendChild(dot);
        }
    }

    updatePageDots() {
        const dots = document.querySelectorAll('.page-dot');
        dots.forEach((dot, index) => {
            if (index + 1 === this.currentPage) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    nextPage() {
        if (this.currentPage < this.totalPages) {
            this.loadPage(this.currentPage + 1);
        }
    }

    prevPage() {
        if (this.currentPage > 1) {
            this.loadPage(this.currentPage - 1);
        }
    }

    readAloud() {
        const text = document.getElementById('page-text').textContent;
        if ('speechSynthesis' in window && text) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.9;
            window.speechSynthesis.speak(utterance);
        } else {
            alert('Text-to-speech is not available in your browser.');
        }
    }

    collectStamp() {
        // Save to localStorage
        const stamps = JSON.parse(localStorage.getItem('alexandria-stamps') || '[]');
        if (!stamps.includes(this.countryCode)) {
            stamps.push(this.countryCode);
            localStorage.setItem('alexandria-stamps', JSON.stringify(stamps));

            // Show celebration
            this.showCelebration();
        }
    }

    showCelebration() {
        alert(`🎉 Congratulations! You collected a stamp from ${this.storyData.country}! 🎊`);
        // You can add more elaborate celebration animations here
    }

    closeModal() {
        document.getElementById('storybook-modal').style.display = 'none';
        window.speechSynthesis.cancel();
    }

    isOpen() {
        return document.getElementById('storybook-modal').style.display === 'flex';
    }
}

// Initialize storybook modal when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.storybookModal = new StorybookModal();
});
