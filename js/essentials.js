/* =====================================================
   HELPERS SEGUROS (ANTI-CRASH)
===================================================== */
function safeGet(id) {
    const el = document.getElementById(id);
    if (!el) {
        console.warn(`⚠️ Elemento #${id} no encontrado en el DOM`);
        return null;
    }
    return el;
}

function safeText(id, value) {
    const el = safeGet(id);
    if (el && value !== undefined && value !== null) {
        el.textContent = value;
    }
}

function safeHTML(id, html) {
    const el = safeGet(id);
    if (el && html !== undefined && html !== null) {
        el.innerHTML = html;
    }
}

/* =====================================================
   INIT
===================================================== */
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await initializeApp();
        if (typeof renderPage === 'function') {
            renderPage();
        }
    } catch (err) {
        console.error('❌ Error inicializando la app:', err);
        document.body.innerHTML = `<h1>Error al cargar la guía</h1>`;
    }
});

/* =====================================================
   RENDER PAGE
===================================================== */
function renderPage() {
    const { apartmentData, apartmentId, lang } = window.appState || {};
    const apt = apartmentData?.[apartmentId];

    if (!apt) {
        console.error("❌ No se encontraron los datos del apartamento.");
        document.body.innerHTML = `<h1>Error: Apartamento no encontrado</h1>`;
        return;
    }

    /* =========================
       TEXTOS GENERALES
    ========================= */
    document.title = t('essentials.title');
    safeText('page-title', t('essentials.title'));
    safeText('apartment-name', apt.name);
    safeText('apartment-address', apt.address);

    /* =========================
       HEADER IMAGE
    ========================= */
    const headerImage = safeGet('header-image');
    if (headerImage && apt.images?.portada) {
        headerImage.style.backgroundImage =
            `url(${window.ROOT_PATH}${apt.images.portada})`;
    }

    /* =========================
       WIFI
    ========================= */
    safeHTML(
        'wifi-title',
        `<span class="material-symbols-outlined text-primary">wifi</span> ${t('essentials.wifi_title')}`
    );

    safeText('wifi-network-label', t('essentials.wifi_network'));
    safeText('wifi-password-label', t('essentials.wifi_password'));
    safeText('wifi-network', apt.wifi?.network);
    safeText('wifi-password', apt.wifi?.password);
    safeText('wifi-hint', t('essentials.wifi_qr_code_hint'));

    const copyBtn = safeGet('wifi-copy-btn');
    if (copyBtn && apt.wifi?.password) {
        copyBtn.onclick = () => copyToClipboard(apt.wifi.password);
        copyBtn.title = t('common.copy');
    }

    /* =========================
       ACCESS INSTRUCTIONS
    ========================= */
    safeText('access-title', t('essentials.access_title'));
    safeText('access-code-label', t('essentials.access_code'));
    safeText('access-instructions-label', t('essentials.access_instructions'));
    safeText('access-code', apt.access?.code);

    const stepsList = safeGet('access-steps-list');
    if (stepsList && Array.isArray(apt.access?.instructions)) {
        stepsList.innerHTML = '';
        apt.access.instructions.forEach((instruction, index) => {
            const li = document.createElement('li');
            li.className = 'flex gap-3 items-start';
            li.innerHTML = `
                <span class="flex items-center justify-center size-6 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-bold shrink-0 mt-0.5">
                    ${index + 1}
                </span>
                <p class="text-sm text-text-muted-light dark:text-text-muted-dark leading-relaxed">
                    ${instruction}
                </p>
            `;
            stepsList.appendChild(li);
        });
    }

    /* =========================
       HOUSE RULES
    ========================= */
    safeText('house-rules-title', t('essentials.house_rules_title'));

    const rulesGrid = safeGet('house-rules-grid');
    if (rulesGrid && Array.isArray(apt.houseRules)) {
        rulesGrid.innerHTML = '';

        const colorMap = {
            red: 'bg-red-50 dark:bg-red-900/20 text-red-500',
            indigo: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500',
            green: 'bg-green-50 dark:bg-green-900/20 text-green-500',
            amber: 'bg-amber-50 dark:bg-amber-900/20 text-amber-500'
        };

        apt.houseRules.forEach(rule => {
            const ruleCard = document.createElement('div');
            ruleCard.className =
                'bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col items-center text-center gap-2';

            const colorClass = colorMap[rule.color] || 'bg-gray-100 text-gray-500';

            ruleCard.innerHTML = `
                <div class="size-10 rounded-full ${colorClass} flex items-center justify-center">
                    <span class="material-symbols-outlined">${rule.icon}</span>
                </div>
                <span class="text-sm font-semibold">
                    ${t(`essentials.rules_${rule.titleKey}`)}
                </span>
                ${
                    rule.subtitleKey
                        ? `<span class="text-xs text-text-muted-light dark:text-text-muted-dark">
                            ${t(`essentials.rules_${rule.subtitleKey}`)}
                           </span>`
                        : ''
                }
            `;
            rulesGrid.appendChild(ruleCard);
        });
    }

    /* =========================
       HOST CONTACT
    ========================= */
    const hostPhoto = safeGet('host-photo');
    if (hostPhoto && apt.host?.photo) {
        hostPhoto.style.backgroundImage =
            `url(${window.ROOT_PATH}${apt.host.photo})`;
    }

    safeText(
        'host-name',
        `${t('essentials.contact_host')} ${apt.host?.name || ''}`
    );
    safeText('host-response-time', t('essentials.usually_responds'));

    /* =========================
       BOTTOM NAVIGATION
    ========================= */
    const baseUrl = `?apartment=${apartmentId}&lang=${lang}`;

    safeText('nav-home-text', t('navigation.nav_home'));
    safeText('nav-devices-text', t('navigation.devices_title'));
    safeText('nav-recommendations-text', t('navigation.recommendations_title'));
    safeText('nav-tourism-text', t('navigation.tourism_title'));

    const navHome = safeGet('nav-home');
    const navDevices = safeGet('nav-devices');
    const navRecommendations = safeGet('nav-recommendations');
    const navTourism = safeGet('nav-tourism');

    if (navHome) navHome.href = `${window.ROOT_PATH}index.html${baseUrl}`;
    if (navDevices) navDevices.href = `devices.html${baseUrl}`;
    if (navRecommendations) navRecommendations.href = `recommendations.html${baseUrl}`;
    if (navTourism) navTourism.href = `tourism.html${baseUrl}`;

    navHome?.classList.remove('opacity-50');
    navHome?.classList.add('text-primary');

    /* =========================
       CONTACT HOST (ROBUSTO)
    ========================= */
    window.contactHost = () => {
        const phoneNumber = apt.host?.phone;
        if (phoneNumber) {
            window.open(`tel:${phoneNumber}`, '_self');
        } else {
            showNotification(
                t('common.phone_not_available') ||
                'El número de teléfono del anfitrión no está disponible.'
            );
        }
    };
}
