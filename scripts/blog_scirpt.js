function getArticlesContainer() {
    return document.querySelector('.blog-container');
}

function calculateArticles() {
    const articles = document.querySelectorAll('.blog-article');
    const articlesCount = articles.length;
    const counter = document.getElementById('article-counter');
    const commentsCounter = document.getElementById('article-comments-counter');
    const emptyState = document.getElementById('blog-empty-state');

    if (emptyState) {
        emptyState.hidden = articlesCount > 0;
    }

    if (!counter) {
        return articlesCount;
    }

    counter.textContent = String(articlesCount);

    if (commentsCounter) {
        commentsCounter.textContent = '0';
    }

    return articlesCount;
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

    openStatsButton.addEventListener('click', () => {
        if (isLoading) {
            return;
        }

        calculateArticles();
        statsDialog.showModal();
    });

    closeStatsButton.addEventListener('click', () => {
        if (isLoading) {
            return;
        }

        statsDialog.close();
    });

    openAddButton.addEventListener('click', () => {
        if (isLoading) {
            return;
        }

        addDialog.showModal();
    });

    closeAddButton.addEventListener('click', () => {
        if (isLoading) {
            return;
        }

        addDialog.close();
    });
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
    const container = getArticlesContainer();
    const addDialog = document.getElementById('add-news-dialog');

    if (!form || !titleInput || !textInput || !container || !addDialog) {
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

        setLoadingState(true);
        await wait(ADD_ARTICLE_DELAY_MS);

        const article = document.createElement('div');
        article.className = 'blog-article';
        article.innerHTML = `
            <button type="button" class="blog-delete">X</button>
            <img src="source/blank.svg" alt="Р¤РѕС‚Рѕ" />
            <div class="blog-content">
                <p class="blog-text">${title}</p>
                <p class="blog-date">Опубликовано: ${new Date().toLocaleDateString('ru-RU')}</p>
            </div>
        `;

        container.append(article);
        form.reset();
        addDialog.close();
        calculateArticles();
        setLoadingState(false);
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

        if (!deleteButton || !container.contains(deleteButton)) {
            return;
        }

        const article = deleteButton.closest('.blog-article');

        if (article) {
            article.remove();
            calculateArticles();
        }
    });
}

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
