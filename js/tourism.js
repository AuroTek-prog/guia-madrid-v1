function renderPage() {
    // Esta función necesita datos adicionales de madrid.json
    fetch(`${window.ROOT_PATH}data/madrid.json`)
        .then(response => response.json())
        .then(madridData => {
            // Actualizar textos estáticos
            document.title = t('tourism.title');
            document.getElementById('page-title').textContent = t('tourism.title');
            document.getElementById('hero-category').textContent = t('tourism.hero_slogan');
            document.getElementById('hero-headline').textContent = 'Madrid Te Espera';
            document.getElementById('hero-description').textContent = t('tourism.hero_description');
            document.getElementById('experiences-headline').textContent = t('tourism.experiences_title');
            document.getElementById('experiences-subtitle').textContent = t('tourism.experiences_subtitle');
            document.getElementById('fab-text').textContent = t('tourism.map_view');
            
            // --- CORRECCIÓN CLAVE AQUÍ ---
            // Usamos window.ROOT_PATH para construir la ruta completa y correcta
            document.querySelector('#hero-image .bg-cover').style.backgroundImage = `url('${window.ROOT_PATH}${madridData.hero.image}')`;
            
            // Renderizar el feed de experiencias
            const feedContainer = document.getElementById('experiences-feed');
            feedContainer.innerHTML = ''; // Limpiar contenido previo

            madridData.experiences.forEach(exp => {
                const card = document.createElement('div');
                card.className = '@container group cursor-pointer';
                card.innerHTML = `
                    <div class="flex flex-col items-stretch justify-start rounded-2xl shadow-xl bg-white dark:bg-surface-dark overflow-hidden transition-transform duration-300 hover:shadow-2xl hover:-translate-y-1 ring-1 ring-black/5 dark:ring-white/5">
                        <div class="relative w-full aspect-[4/5] sm:aspect-video bg-center bg-no-repeat bg-cover" style="background-image: url('${window.ROOT_PATH}${exp.image}');">
                            <div class="absolute top-4 left-4">
                                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md text-white border border-white/20 shadow-sm uppercase tracking-wider">
                                    ${t(`tourism.categories.${exp.categoryKey}`)}
                                </span>
                            </div>
                        </div>
                        <div class="flex w-full grow flex-col items-start justify-center gap-3 p-6">
                            <div class="flex flex-col gap-2 w-full">
                                <div class="flex justify-between items-start w-full">
                                    <p class="text-gray-900 dark:text-white text-2xl font-bold leading-tight tracking-tight">${t(`tourism.places.${exp.nameKey}`)}</p>
                                    <span class="material-symbols-outlined text-gray-400 dark:text-gray-500" style="font-size: 20px;">favorite_border</span>
                                </div>
                                <p class="text-gray-600 dark:text-gray-400 text-base font-light leading-relaxed line-clamp-2">
                                    ${t(`tourism.places.${exp.descriptionKey}`)}
                                </p>
                            </div>
                            <div class="w-full pt-2">
                                <button class="flex w-full items-center justify-center rounded-lg h-12 bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-white/10 text-sm font-semibold tracking-wide transition-colors gap-2">
                                    <span>${t('tourism.explore_details')}</span>
                                    <span class="material-symbols-outlined" style="font-size: 18px;">arrow_forward</span>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
                feedContainer.appendChild(card);
            });
        })
        .catch(error => console.error('Error loading Madrid data:', error));
}