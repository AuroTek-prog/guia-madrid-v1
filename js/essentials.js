function renderPage() {
    const apt = window.appState.apartmentData[window.appState.apartmentId];
    if (!apt) return;

    // Actualizar textos estáticos de la página
    document.title = t('essentials.title');
    document.getElementById('page-title').textContent = t('essentials.title');
    document.getElementById('apartment-name').textContent = apt.name;
    document.getElementById('apartment-address').textContent = apt.address;

    // --- Header Image ---
    document.getElementById('header-image').style.backgroundImage = `url(${window.ROOT_PATH}${apt.images.portada})`;

    // --- WiFi Section ---
    document.getElementById('wifi-title').innerHTML = `<span class="material-symbols-outlined text-primary">wifi</span> ${t('essentials.wifi_title')}`;
    document.getElementById('wifi-network-label').textContent = t('essentials.wifi_network');
    document.getElementById('wifi-password-label').textContent = t('essentials.wifi_password');
    document.getElementById('wifi-network').textContent = apt.wifi.network;
    document.getElementById('wifi-password').textContent = apt.wifi.password;
    document.getElementById('wifi-hint').textContent = t('essentials.wifi_qr_code_hint');
    
    const copyBtn = document.getElementById('wifi-copy-btn');
    copyBtn.onclick = () => copyToClipboard(apt.wifi.password);
    copyBtn.setAttribute('title', t('common.copy'));

    // --- Access Instructions ---
    document.getElementById('access-title').textContent = t('essentials.access_title');
    document.getElementById('access-code-label').textContent = t('essentials.access_code');
    document.getElementById('access-instructions-label').textContent = t('essentials.access_instructions');
    document.getElementById('access-code').textContent = apt.access.code;
    
    const stepsList = document.getElementById('access-steps-list');
    stepsList.innerHTML = ''; // Limpiar pasos previos
    
    apt.access.instructions.forEach((instruction, index) => {
        const li = document.createElement('li');
        li.className = 'flex gap-3 items-start';
        li.innerHTML = `
            <span class="flex items-center justify-center size-6 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-bold shrink-0 mt-0.5">${index + 1}</span>
            <p class="text-sm text-text-muted-light dark:text-text-muted-dark leading-relaxed">${instruction}</p>
        `;
        stepsList.appendChild(li);
    });

    // --- House Rules ---
    document.getElementById('house-rules-title').textContent = t('essentials.house_rules_title');
    const rulesGrid = document.getElementById('house-rules-grid');
    rulesGrid.innerHTML = ''; // Limpiar reglas previas

    apt.houseRules.forEach(rule => {
        const ruleCard = document.createElement('div');
        ruleCard.className = 'bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col items-center text-center gap-2';
        
        let colorClass = '';
        switch(rule.color) {
            case 'red': colorClass = 'bg-red-50 dark:bg-red-900/20 text-red-500'; break;
            case 'indigo': colorClass = 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500'; break;
            case 'green': colorClass = 'bg-green-50 dark:bg-green-900/20 text-green-500'; break;
            case 'amber': colorClass = 'bg-amber-50 dark:bg-amber-900/20 text-amber-500'; break;
        }

        ruleCard.innerHTML = `
            <div class="size-10 rounded-full ${colorClass} flex items-center justify-center">
                <span class="material-symbols-outlined">${rule.icon}</span>
            </div>
            <span class="text-sm font-semibold">${t(`essentials.rules_${rule.titleKey}`)}</span>
            ${rule.subtitleKey ? `<span class="text-xs text-text-muted-light dark:text-text-muted-dark">${t(`essentials.rules_${rule.subtitleKey}`)}</span>` : ''}
        `;
        rulesGrid.appendChild(ruleCard);
    });

    // --- Host Contact ---
    document.getElementById('host-photo').style.backgroundImage = `url(${window.ROOT_PATH}${apt.host.photo})`;
    document.getElementById('host-name').textContent = `${t('essentials.contact_host')} ${apt.host.name}`;
    document.getElementById('host-response-time').textContent = t('essentials.usually_responds');

    // --- Navegación Inferior ---
    const baseUrl = `?apartment=${window.appState.apartmentId}&lang=${window.appState.lang}`;
    document.querySelector('#nav-home span:last-child').textContent = t('navigation.nav_home');
    document.querySelector('#nav-devices span:last-child').textContent = t('navigation.devices_title');
    document.querySelector('#nav-recommendations span:last-child').textContent = t('navigation.recommendations_title');
    document.querySelector('#nav-tourism span:last-child').textContent = t('navigation.tourism_title');

    document.getElementById('nav-home').href = `${window.ROOT_PATH}index.html${baseUrl}`;
    document.getElementById('nav-devices').href = `devices.html${baseUrl}`;
    document.getElementById('nav-recommendations').href = `recommendations.html${baseUrl}`;
    document.getElementById('nav-tourism').href = `tourism.html${baseUrl}`;

    // Marcar la página actual como activa
    document.getElementById('nav-home').classList.remove('opacity-50');
    document.getElementById('nav-home').classList.add('text-primary');
}

function contactHost() {
    const phoneNumber = apt.host.phone;
    if (phoneNumber) {
        window.open(`tel:${phoneNumber}`, '_self');
    } else {
        showNotification("El número de teléfono del anfitrión no está disponible.");
    }
}