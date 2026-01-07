function renderPage() {
    const apt = window.appState.apartmentData[window.appState.apartmentId];
    if (!apt) return;
    document.title = t('essentials.title');
    document.getElementById('page-title').textContent = t('essentials.title');
    document.getElementById('apartment-name').textContent = apt.name;
    document.getElementById('apartment-address').textContent = apt.address;
    document.getElementById('wifi-title').innerHTML = `<span class="material-symbols-outlined text-primary">wifi</span> ${t('essentials.wifi_title')}`;
    document.getElementById('wifi-network-label').textContent = t('essentials.wifi_network');
    document.getElementById('wifi-password-label').textContent = t('essentials.wifi_password');
    document.getElementById('wifi-network').textContent = apt.wifi.network;
    document.getElementById('wifi-password').textContent = apt.wifi.password;
    const copyBtn = document.getElementById('wifi-copy-btn');
    copyBtn.onclick = () => copyToClipboard(apt.wifi.password);
    copyBtn.setAttribute('title', t('common.copy'));
    document.getElementById('access-title').textContent = t('essentials.access_title');
    document.getElementById('access-code-label').textContent = t('essentials.access_code');
    document.getElementById('access-instructions-label').textContent = t('essentials.access_instructions');
    document.getElementById('access-code').textContent = apt.access.code;
    let instructionsText = "";
    if (apt.access.type === 'keybox') { instructionsText = "Localiza la caja de llaves negra a la izquierda de la puerta. Introduce el código y tira de la palanca."; } else if (apt.access.type === 'keypad') { instructionsText = "Pasa la tarjeta por el lector. La luz se pondrá verde y la cerradura se desbloqueará."; }
    document.getElementById('access-instructions-text').textContent = instructionsText;
}