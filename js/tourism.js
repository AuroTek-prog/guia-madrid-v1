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
            
            // Usamos window.ROOT_PATH para construir la ruta completa y correcta
            document.querySelector('#hero-image .bg-cover').style.backgroundImage = `url('${window.ROOT_PATH}${madridData.hero.image}')`;
            
            // Renderizar el feed de experiencias
            const feedContainer = document.getElementById('experiences-feed');
            feedContainer.innerHTML = ''; // Limpiar contenido previo

            madridData.experiences.forEach(exp => {
                // Obtenemos el nombre del lugar traducido
                const placeName = t(`tourism.places.${exp.nameKey}`);

                // --- DEPURACIÓN ---
                // Puedes abrir la consola de desarrolladores en tu navegador (Safari en Mac conectado a tu iPhone) para ver estos logs.
                // Esto nos ayudará a saber si el nombre del lugar se está obteniendo correctamente.
                if (!placeName || placeName.includes('tourism.places.')) {
                    console.warn(`Advertencia: La traducción para la clave '${exp.nameKey}' no se encontró. El botón podría no funcionar correctamente.`);
                } else {
                    console.log(`Lugar encontrado: ${placeName}`);
                }
                // --- FIN DE LA DEPURACIÓN ---

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
                                    <p class="text-gray-900 dark:text-white text-2xl font-bold leading-tight tracking-tight">${placeName}</p>
                                    <span class="material-symbols-outlined text-gray-400 dark:text-gray-500" style="font-size: 20px;">favorite_border</span>
                                </div>
                                <p class="text-gray-600 dark:text-gray-400 text-base font-light leading-relaxed line-clamp-2">
                                    ${t(`tourism.places.${exp.descriptionKey}`)}
                                </p>
                            </div>
                            <div class="w-full pt-2">
                                <!-- CAMBIO CLAVE: El botón ya no necesita atributos de datos -->
                                <button class="details-button flex w-full items-center justify-center rounded-lg h-12 bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-white/10 text-sm font-semibold tracking-wide transition-colors gap-2">
                                    <span>${t('tourism.explore_details')}</span>
                                    <span class="material-symbols-outlined" style="font-size: 18px;">arrow_forward</span>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
                feedContainer.appendChild(card);

                // --- CAMBIO MÁS IMPORTANTE ---
                // Adjuntamos el evento de clic directamente al botón recién creado.
                const detailsButton = card.querySelector('.details-button');
                if (detailsButton) {
                    detailsButton.addEventListener('click', () => {
                        // Usamos la variable 'placeName' que capturamos antes
                        console.log(`Botón presionado. Buscando información sobre: ${placeName}`);
                        
                        // Creamos la consulta de búsqueda, añadiendo "Madrid" para mayor precisión
                        const searchQuery = encodeURIComponent(`${placeName} Madrid`);
                        
                        // Construimos la URL de búsqueda de Google
                        const searchUrl = `https://www.google.com/search?q=${searchQuery}`;
                        
                        console.log(`Abriendo URL: ${searchUrl}`);
                        
                        // Usamos window.open() para abrir en una nueva pestaña/ventana.
                        // Esto es más explícito y a menudo más fiable en móviles.
                        window.open(searchUrl, '_blank');
                    });
                }
            });
            
            // Configurar el modal de selección de mapa
            setupMapModal();
        })
        .catch(error => console.error('Error loading Madrid data:', error));
}

function setupMapModal() {
    const mapButton = document.getElementById('map-button');
    const mapModal = document.getElementById('map-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const mapOptions = document.querySelectorAll('.map-option');
    
    mapButton.addEventListener('click', () => {
        mapModal.classList.add('show');
    });
    
    closeModalBtn.addEventListener('click', () => {
        mapModal.classList.remove('show');
    });
    
    mapModal.addEventListener('click', (e) => {
        if (e.target === mapModal) {
            mapModal.classList.remove('show');
        }
    });
    
    mapOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            const mapType = option.getAttribute('data-map');
            openMap(mapType);
            mapModal.classList.remove('show');
        });
    });
}

function openMap(mapType) {
    const lat = 40.4168;
    const lng = -3.7038;
    const query = encodeURIComponent('Madrid, España');
    const label = encodeURIComponent('Puntos de interés en Madrid');
    
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    let mapUrl;

    if (isIOS) {
        switch (mapType) {
            case 'google':
                mapUrl = `comgooglemaps://?center=${lat},${lng}&q=${query}&zoom=12`;
                window.location.href = mapUrl;
                setTimeout(() => {
                    window.location.href = `https://www.google.com/maps/search/?api=1&query=${query}`;
                }, 500);
                return;
            case 'apple':
                mapUrl = `maps://?q=${label}&ll=${lat},${lng}`;
                break;
            case 'waze':
                mapUrl = `waze://?ll=${lat},${lng}&navigate=yes`;
                window.location.href = mapUrl;
                setTimeout(() => {
                    window.location.href = `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`;
                }, 500);
                return;
            default:
                mapUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;
        }
    } else {
        switch (mapType) {
            case 'google':
                mapUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;
                break;
            case 'apple':
                mapUrl = `http://maps.apple.com/?q=${query}&ll=${lat},${lng}`;
                break;
            case 'waze':
                mapUrl = `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`;
                break;
            default:
                mapUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;
        }
    }
    
    window.location.href = mapUrl;
}

// La función setupDetailsButtons ya no es necesaria, la hemos eliminado.

// Inicializar la página cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', renderPage);
