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
                const placeName = t(`tourism.places.${exp.nameKey}`);

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
                                    <!-- CAMBIO CLAVE: Añadimos una clase específica al título -->
                                    <p class="place-title text-gray-900 dark:text-white text-2xl font-bold leading-tight tracking-tight">${placeName}</p>
                                    <span class="material-symbols-outlined text-gray-400 dark:text-gray-500" style="font-size: 20px;">favorite_border</span>
                                </div>
                                <p class="text-gray-600 dark:text-gray-400 text-base font-light leading-relaxed line-clamp-2">
                                    ${t(`tourism.places.${exp.descriptionKey}`)}
                                </p>
                            </div>
                            <div class="w-full pt-2">
                                <!-- CAMBIO CLAVE: Usamos una clase simple y consistente -->
                                <button class="details-btn flex w-full items-center justify-center rounded-lg h-12 bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-white/10 text-sm font-semibold tracking-wide transition-colors gap-2">
                                    <span>${t('tourism.explore_details')}</span>
                                    <span class="material-symbols-outlined" style="font-size: 18px;">arrow_forward</span>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
                feedContainer.appendChild(card);
            });
            
            // Configurar el modal de selección de mapa
            setupMapModal();
            
            // Configurar los botones de detalles con el nuevo enfoque
            setupDetailsButtons();
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

// NUEVO Y MÁS ROBUSTO setupDetailsButtons
function setupDetailsButtons() {
    const feedContainer = document.getElementById('experiences-feed');
    
    // Usamos delegación de eventos. Es más eficiente.
    feedContainer.addEventListener('click', (event) => {
        // Comprobamos si el elemento clicado es un botón de detalles
        const button = event.target.closest('.details-btn');
        
        if (button) {
            console.log('¡EVENTO DE CLIC DETECTADO!'); // Mensaje de depuración
            
            // Desde el botón, subimos hasta la tarjeta completa
            const card = button.closest('.@container');
            
            // Dentro de la tarjeta, buscamos el elemento con el título
            const titleElement = card.querySelector('.place-title');
            
            if (titleElement) {
                // Obtenemos el texto del título (el nombre del lugar)
                const placeName = titleElement.textContent.trim();
                
                console.log(`Nombre del lugar obtenido: "${placeName}"`); // Mensaje de depuración
                
                // Construimos la URL de búsqueda
                const searchQuery = encodeURIComponent(`${placeName} Madrid`);
                const searchUrl = `https://www.google.com/search?q=${searchQuery}`;
                
                console.log(`URL a abrir: ${searchUrl}`); // Mensaje de depuración
                
                // Abrimos la URL. Usamos _blank para intentar abrir en una nueva pestaña.
                window.open(searchUrl, '_blank');
            } else {
                console.error('No se pudo encontrar el título del lugar en la tarjeta.');
            }
        }
    });
}

// Inicializar la página cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', renderPage);
