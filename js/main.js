// Estado global de la aplicación
window.appState = {
    apartmentId: null,
    lang: 'es',
    apartmentData: null,
    translations: null
};

// Función principal de inicialización
async function initializeApp() {
    const params = new URLSearchParams(window.location.search);
    window.appState.apartmentId = params.get('apartment') || 'sol-101';
    window.appState.lang = params.get('lang') || 'es';

    try {
        // Cargar datos en paralelo para mayor velocidad usando la ruta raíz
        const [apartmentRes, translationsRes] = await Promise.all([
            fetch(`${window.ROOT_PATH}data/apartments.json`),
            fetch(`${window.ROOT_PATH}data/${window.appState.lang}.json`)
        ]);

        if (!apartmentRes.ok || !translationsRes.ok) {
            throw new Error("No se pudieron cargar los archivos de datos.");
        }

        window.appState.apartmentData = await apartmentRes.json();
        window.appState.translations = await translationsRes.json();

        document.documentElement.lang = window.appState.lang;

        if (typeof renderPage === 'function') {
            renderPage();
        }

    } catch (error) {
        console.error("Error al inicializar la aplicación:", error);
        document.body.innerHTML = `
            <div class="container p-4 text-center">
                <h1 class="text-2xl font-bold text-red-600">Error al cargar la guía</h1>
                <p>Por favor, comprueba tu conexión e inténtalo de nuevo.</p>
            </div>
        `;
    }
}

// Función de traducción (t)
function t(key) {
    const keys = key.split('.');
    let value = window.appState.translations;
    
    for (const k of keys) {
        value = value?.[k];
    }
    return value || `[${key}]`;
}

// Función global para copiar al portapapeles
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification(t('common.copied'));
    }).catch(err => {
        console.error('Error al copiar: ', err);
        showNotification('Error al copiar');
    });
}

// Función global para mostrar notificaciones
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-opacity duration-300';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => { notification.style.opacity = '0'; }, 2000);
    setTimeout(() => { if (document.body.contains(notification)) document.body.removeChild(notification); }, 2300);
}

document.addEventListener('DOMContentLoaded', initializeApp);