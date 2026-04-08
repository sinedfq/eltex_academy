const BLOG_STORAGE_KEY = 'blogArticles';
const articles = loadArticles();

function getArticlesContainer() {
    return document.querySelector('.blog-container');
}

function loadArticles() {
    try {
        return JSON.parse(localStorage.getItem(BLOG_STORAGE_KEY)) || [];
    } catch {
        return [];
    }
}

function saveArticles() {
    localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(articles));
}

function createArticleMarkup(article, index) {
    return `
        <div class="blog-article">
            <button type="button" class="blog-delete" data-index="${index}">X</button>
            <img src="source/blank.svg" alt="Фото статьи" />
            <div class="blog-content">
                <p class="blog-text">${article.title}</p>
                <p class="blog-description">${article.text}</p>
                <p class="blog-date">Опубликовано: ${article.date}</p>
            </div>
        </div>
    `;
}

function renderArticles() {
    const container = getArticlesContainer();

    if (!container) {
        return;
    }

    container.innerHTML = articles.map(createArticleMarkup).join('');
    calculateArticles();
}

function calculateArticles() {
    const articlesCount = document.querySelectorAll('.blog-article').length;
    const counter = document.getElementById('article-counter');
    const commentsCounter = document.getElementById('article-comments-counter');
    const emptyState = document.getElementById('blog-empty-state');

    if (emptyState) {
        emptyState.hidden = articlesCount > 0;
    }

    if (counter) {
        counter.textContent = String(articlesCount);
    }

    if (commentsCounter) {
        commentsCounter.textContent = '0';
    }
}

function setupDialogs() {
    const statsDialog = document.getElementById('article-dialog');
    const addDialog = document.getElementById('add-news-dialog');
    const openStatsButton = document.getElementById('open-stats-dialog');
    const closeStatsButton = document.getElementById('close-article-dialog');
    const openAddButton = document.getElementById('open-add-dialog');
    const closeAddButton = document.getElementById('close-add-dialog');

    if (
        !statsDialog ||
        !addDialog ||
        !openStatsButton ||
        !closeStatsButton ||
        !openAddButton ||
        !closeAddButton
    ) {
        return;
    }

    openStatsButton.addEventListener('click', () => statsDialog.showModal());
    closeStatsButton.addEventListener('click', () => statsDialog.close());
    openAddButton.addEventListener('click', () => addDialog.showModal());
    closeAddButton.addEventListener('click', () => addDialog.close());
}

function setupSideMenu() {
    const menu = document.querySelector('.blog-side-menu');
    const toggleButton = document.getElementById('toggle-blog-menu');

    if (!menu || !toggleButton) {
        return;
    }

    toggleButton.addEventListener('click', () => {
        if (isLoading) {
            return;
        }

        menu.classList.toggle('is-open');
    });
}

function setupAddNewsForm() {
    const form = document.getElementById('add-news-form');
    const titleInput = document.getElementById('news-title');
    const textInput = document.getElementById('news-text');
    const addDialog = document.getElementById('add-news-dialog');

    if (!form || !titleInput || !textInput || !addDialog) {
        return;
    }

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        if (isLoading) {
            return;
        }

        const title = titleInput.value.trim();
        const text = textInput.value.trim();

        if (!title || !text) {
            return;
        }

        articles.push({
            title,
            text,
            date: new Date().toLocaleDateString('ru-RU')
        });

        saveArticles();
        renderArticles();
        form.reset();
        addDialog.close();
    });
}

function setupDeleteButtons() {
    const container = getArticlesContainer();

    if (!container) {
        return;
    }

    container.addEventListener('click', (event) => {
        if (isLoading) {
            return;
        }

        const deleteButton = event.target.closest('.blog-delete');

        if (!deleteButton) {
            return;
        }

        const articleIndex = Number(deleteButton.dataset.index);

        articles.splice(articleIndex, 1);
        saveArticles();
        renderArticles();
    });
}

renderArticles();
setupDeleteButtons();
setupSideMenu();
setupDialogs();
setupAddNewsForm();

async function initializeBlog() {
    setLoadingState(true);
    await wait(INITIAL_LOAD_DELAY_MS);
    calculateArticles();
    setLoadingState(false);
}

initializeBlog();
