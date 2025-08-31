document.addEventListener("DOMContentLoaded", () => {

    let currentQRContent = '';
    let selectedLogo = null;
    let currentLanguage = 'es';
    let qrCodeInstance = null;

    
    const qrPlaceholder = document.getElementById('qr-placeholder');
    const finalQrPreview = document.getElementById('final-qr-preview');
    const modalContainer = document.getElementById('modal-container');

    const translations = {
        es: {
            header_title: "Generador QR ", generator_title: "1. Seleccione un tipo de código QR", card_web_title: "Sitio web", card_web_subtitle: "Enlace a cualquier URL.", card_insta_title: "Instagram", card_insta_subtitle: "Comparta su perfil.", card_wa_title: "WhatsApp", card_wa_subtitle: "Reciba mensajes.", card_wifi_title: "Wi-Fi", card_wifi_subtitle: "Conéctese a una red.", card_call_title: "Llamar", card_call_subtitle: "Genere un QR para llamar.", card_email_title: "Email", card_email_subtitle: "Envíe un correo electrónico.", qr_placeholder: "Elija un tipo de código QR a la izquierda", download_button: "Descargar QR", benefits_title: "Beneficios del Generador QR", benefits_subtitle: "Cree códigos QR estáticos y personalizados de forma rápida y gratuita. Ideal para tarjetas de presentación, menús, eventos y mucho más, sin necesidad de ser un experto.", benefit_1: "Códigos QR estáticos ilimitados", benefit_2: "Personalización de logos", benefit_3: "No requiere registro", benefit_4: "Totalmente gratuito y de código abierto", info_1: "Páginas de destino personalizadas", info_2: "Cadidades ilimitadas códigos QR", info_3: "Colores y formas personalizados", info_4: "Agregar logotipos a los códigos QR", footer_developed_by: "Desarrollado por", footer_privacy: "Política de Privacidad", footer_terms: "Términos y Condiciones", footer_donate: "Donar", modal_config_web: "Configurar QR de Sitio Web", modal_url_label: "URL del sitio web", modal_config_insta: "Configurar QR de Instagram", modal_user_label: "Nombre de usuario (sin @)", modal_config_wa: "Configurar QR de WhatsApp", modal_msg_label: "Mensaje (opcional)", modal_config_wifi: "Configurar QR de Wi-Fi", modal_ssid_label: "Nombre de la Red (SSID)", modal_pass_label: "Contraseña", modal_encrypt_label: "Tipo de Cifrado", modal_config_call: "Configurar QR de Llamada", modal_country_code_label: "Código de País", modal_phone_num_label: "Número de Teléfono", modal_wa_phone_num_label: "Número de Teléfono", modal_config_email: "Configurar QR de Email", modal_email_addr_label: "Dirección de correo", modal_subject_label: "Asunto", modal_body_label: "Cuerpo del mensaje", modal_close_button: "Cerrar", modal_generate_button: "Generar QR", frame_logo_title: "Logo (Opcional)", privacy_title: "Política de Privacidad", privacy_text: "Esta aplicación es de código abierto y no almacena ningún dato ingresado por el usuario. Toda la generación de códigos QR se realiza en el lado del cliente (en su navegador).", terms_title: "Términos y Condiciones", terms_text: "El uso de este servicio es gratuito. Usted es responsable del contenido que genera. No se permite el uso para fines ilícitos.", donate_title: "Apoya el Proyecto", donate_text: "Si esta herramienta te resulta útil, considera hacer una donación para apoyar su desarrollo y mantenimiento.",
        },
        en: {
            header_title: "QR Generator", generator_title: "1. Select a QR code type", card_web_title: "Website", card_web_subtitle: "Link to any URL.", card_insta_title: "Instagram", card_insta_subtitle: "Share your profile.", card_wa_title: "WhatsApp", card_wa_subtitle: "Receive messages.", card_wifi_title: "Wi-Fi", card_wifi_subtitle: "Connect to a network.", card_call_title: "Call", card_call_subtitle: "Generate a QR to call.", card_email_title: "Email", card_email_subtitle: "Send an email.", qr_placeholder: "Choose a QR code type on the left", download_button: "Download QR", benefits_title: "Benefits of Modern QR", benefits_subtitle: "Create custom static QR codes quickly and for free. Ideal for business cards, menus, events, and much more, without needing to be an expert.", benefit_1: "Unlimited static QR codes", benefit_2: "Logo customization", benefit_3: "No registration required", benefit_4: "Completely free and open source", info_1: "Custom landing pages", info_2: "Unlimited QR code capacities", info_3: "Custom colors & shapes", info_4: "Add logos to QR codes", footer_developed_by: "Developed by", footer_privacy: "Privacy Policy", footer_terms: "Terms and Conditions", footer_donate: "Donate", modal_config_web: "Configure Website QR", modal_url_label: "Website URL", modal_config_insta: "Configure Instagram QR", modal_user_label: "Username (without @)", modal_config_wa: "Configure WhatsApp QR", modal_msg_label: "Message (optional)", modal_config_wifi: "Configure Wi-Fi QR", modal_ssid_label: "Network Name (SSID)", modal_pass_label: "Password", modal_encrypt_label: "Encryption Type", modal_config_call: "Configure Call QR", modal_country_code_label: "Country Code", modal_phone_num_label: "Phone Number", modal_wa_phone_num_label: "Phone Number", modal_config_email: "Configure Email QR", modal_email_addr_label: "Email address", modal_subject_label: "Subject", modal_body_label: "Message body", modal_close_button: "Close", modal_generate_button: "Generate QR", frame_logo_title: "Logo (Optional)", privacy_title: "Privacy Policy", privacy_text: "This application is open source and does not store any data entered by the user. All QR code generation is done on the client side (in your browser).", terms_title: "Terms and Conditions", terms_text: "Use of this service is free. You are responsible for the content you generate. Use for illegal purposes is not permitted.", donate_title: "Support the Project", donate_text: "If you find this tool useful, please consider making a donation to support its development and maintenance.",
        }
    };

    const countries = [
        { name: "Argentina", code: "+54" }, { name: "Australia", code: "+61" }, { name: "Austria", code: "+43" }, { name: "Canadá", code: "+1" }, { name: "Colombia", code: "+57" }, { name: "México", code: "+52" }, { name: "España", code: "+34" }, { name: "Estados Unidos", code: "+1" }, { name: "Reino Unido", code: "+44" },
    ];
    
    const setLanguage = (lang) => {
        currentLanguage = lang;
        document.documentElement.lang = lang;
        document.querySelectorAll('[data-translate]').forEach(el => {
            const key = el.getAttribute('data-translate');
            el.textContent = translations[lang]?.[key] || el.textContent;
        });
        document.getElementById('lang-toggle').textContent = lang === 'es' ? 'EN' : 'ES';
    };

    const injectModals = () => {
        const commonModalSections = (type) => `
            <div class="mt-4 border-t pt-4">
                <label class="block text-sm font-medium mb-2" data-translate="frame_logo_title"></label>
                <input type="file" class="logo-input text-sm w-full" accept="image/*" data-modal-type="${type}">
                <img class="logo-preview hidden w-16 h-16 mt-2 rounded-md object-contain" id="logo-preview-${type}">
            </div>
            <div class="mt-6 flex justify-end gap-2">
                <button class="modal-close bg-gray-300 dark:bg-gray-500 px-4 py-2 rounded-lg" data-translate="modal_close_button"></button>
                <button data-qr-type="${type}" class="generate-qr-button bg-indigo-600 text-white px-4 py-2 rounded-lg" data-translate="modal_generate_button"></button>
            </div>`;

        modalContainer.innerHTML = `
            <div id="modal-overlay" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center transition-opacity duration-300 z-30 p-4 hidden">
                <div id="modal-web" class="modal-content bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-md hidden"><h3 class="text-lg font-bold mb-4" data-translate="modal_config_web"></h3><label class="block mb-2 text-sm font-medium" data-translate="modal_url_label"></label><input id="web-url" type="url" class="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600" placeholder="https://ejemplo.com">${commonModalSections('web')}</div>
                <div id="modal-instagram" class="modal-content bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-md hidden"><h3 class="text-lg font-bold mb-4" data-translate="modal_config_insta"></h3><label class="block mb-2 text-sm font-medium" data-translate="modal_user_label"></label><input id="instagram-user" type="text" class="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600" placeholder="usuario.de.instagram">${commonModalSections('instagram')}</div>
                
                <div id="modal-whatsapp" class="modal-content bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-md hidden">
                    <h3 class="text-lg font-bold mb-4" data-translate="modal_config_wa"></h3>
                    <label class="block mb-2 text-sm font-medium" data-translate="modal_country_code_label"></label>
                    <select id="whatsapp-country-code" class="w-full border rounded-lg p-2 mb-4 dark:bg-gray-700 dark:border-gray-600"></select>
                    <label class="block mb-2 text-sm font-medium" data-translate="modal_wa_phone_num_label"></label>
                    <input id="whatsapp-phone" type="tel" class="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600" placeholder="3001234567">
                    <label class="block mt-4 mb-2 text-sm font-medium" data-translate="modal_msg_label"></label>
                    <textarea id="whatsapp-message" class="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600" rows="2" placeholder="¡Hola!"></textarea>
                    ${commonModalSections('whatsapp')}
                </div>

                <div id="modal-wifi" class="modal-content bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-md hidden"><h3 class="text-lg font-bold mb-4" data-translate="modal_config_wifi"></h3><label class="block mb-2 text-sm font-medium" data-translate="modal_ssid_label"></label><input id="wifi-ssid" type="text" class="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600" placeholder="NombreDeMiRed"><label class="block mt-4 mb-2 text-sm font-medium" data-translate="modal_pass_label"></label><input id="wifi-password" type="password" class="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600"><label class="block mt-4 mb-2 text-sm font-medium" data-translate="modal_encrypt_label"></label><select id="wifi-encryption" class="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600"><option value="WPA">WPA/WPA2</option><option value="WEP">WEP</option><option value="nopass">Sin contraseña</option></select>${commonModalSections('wifi')}</div>
                
                <div id="modal-call" class="modal-content bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-md hidden">
                    <h3 class="text-lg font-bold mb-4" data-translate="modal_config_call"></h3>
                    <label class="block mb-2 text-sm font-medium" data-translate="modal_country_code_label"></label>
                    <select id="call-country-code" class="w-full border rounded-lg p-2 mb-4 dark:bg-gray-700 dark:border-gray-600"></select>
                    <label class="block mb-2 text-sm font-medium" data-translate="modal_phone_num_label"></label>
                    <input id="call-phone" type="tel" class="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600" placeholder="1234567890">
                    ${commonModalSections('call')}
                </div>

                <div id="modal-email" class="modal-content bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-md hidden"><h3 class="text-lg font-bold mb-4" data-translate="modal_config_email"></h3><label class="block mb-2 text-sm font-medium" data-translate="modal_email_addr_label"></label><input id="email-addr" type="email" class="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600" placeholder="correo@ejemplo.com"><label class="block mt-4 mb-2 text-sm font-medium" data-translate="modal_subject_label"></label><input id="email-subject" type="text" class="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600" placeholder="Asunto del correo"><label class="block mt-4 mb-2 text-sm font-medium" data-translate="modal_body_label"></label><textarea id="email-body" class="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600" rows="2"></textarea>${commonModalSections('email')}</div>
                <div id="modal-privacy" class="modal-content bg-white dark:bg-gray-800 p-6 rounded-2xl w-full max-w-lg hidden"><h3 class="text-lg font-bold mb-2" data-translate="privacy_title"></h3><p class="text-sm" data-translate="privacy_text"></p><button class="modal-close mt-4 bg-indigo-600 text-white px-3 py-1 rounded-lg" data-translate="modal_close_button"></button></div>
                <div id="modal-terms" class="modal-content bg-white dark:bg-gray-800 p-6 rounded-2xl w-full max-w-lg hidden"><h3 class="text-lg font-bold mb-2" data-translate="terms_title"></h3><p class="text-sm" data-translate="terms_text"></p><button class="modal-close mt-4 bg-indigo-600 text-white px-3 py-1 rounded-lg" data-translate="modal_close_button"></button></div>
                <div id="modal-donate" class="modal-content bg-white dark:bg-gray-800 p-6 rounded-2xl w-full max-w-sm hidden">
                    <h3 class="text-lg font-bold mb-2" data-translate="donate_title"></h3>
                    <p class="text-sm mb-4" data-translate="donate_text"></p>
                    <div id="paypal-container-A99FKDAC3VML2"></div>
                    <script>  paypal.HostedButtons({    hostedButtonId: "A99FKDAC3VML2",  }).render("#paypal-container-A99FKDAC3VML2").</script>
                    <button class="modal-close mt-4 bg-gray-300 dark:bg-gray-500 w-full py-2 rounded-lg" data-translate="modal_close_button"></button>
                </div>
            </div>`;
    };

       const populateCountryCodes = (selectId) => {
        const select = document.getElementById(selectId);
        if (select && select.options.length === 0) { 
            const defaultOption = document.createElement('option');
            defaultOption.value = "";
            defaultOption.textContent = "-- Seleccionar --";
            select.appendChild(defaultOption);

            countries.sort((a, b) => a.name.localeCompare(b.name)).forEach(country => {
                const option = document.createElement('option');
                option.value = country.code;
                option.textContent = `${country.name} (${country.code})`;
                select.appendChild(option);
            });
        }
    };
    
    const setupModalEvents = () => {
        const modalOverlay = document.getElementById('modal-overlay');

        const openModal = (modalId) => {
            modalContainer.querySelectorAll('.modal-content').forEach(m => m.classList.add('hidden'));
            const modal = document.getElementById(modalId);
            if (modal) modal.classList.remove('hidden');
            modalOverlay.classList.remove('hidden');
        };

        const closeModal = () => {
             modalOverlay.classList.add('hidden');
             modalOverlay.querySelectorAll('.modal-content').forEach(m => m.classList.add('hidden'));
        };
        
        document.getElementById('qr-type-selector').addEventListener('click', (e) => {
            const card = e.target.closest('.qr-card');
            if (card && card.dataset.modalId) {
                selectedLogo = null; 
                document.querySelectorAll('.logo-input').forEach(input => input.value = '');
                document.querySelectorAll('.logo-preview').forEach(preview => preview.classList.add('hidden'));
                openModal(card.dataset.modalId);
            }
        });
        
        document.getElementById('privacy-link').addEventListener('click', (e) => { e.preventDefault(); openModal('modal-privacy'); });
        document.getElementById('terms-link').addEventListener('click', (e) => { e.preventDefault(); openModal('modal-terms'); });
        document.getElementById('donate-button').addEventListener('click', () => openModal('modal-donate'));

        document.addEventListener('change', (event) => {
            if (event.target.matches('.logo-input')) {
                const type = event.target.dataset.modalType;
                const preview = document.getElementById(`logo-preview-${type}`);
                
                if (event.target.files && event.target.files[0]) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        selectedLogo = e.target.result;
                        if(preview) {
                            preview.src = selectedLogo;
                            preview.classList.remove('hidden');
                        }
                    };
                    reader.readAsDataURL(event.target.files[0]);
                } else {
                    selectedLogo = null;
                     if(preview) {
                        preview.classList.add('hidden');
                    }
                }
            }
        });

          document.getElementById('modal-container').addEventListener('change', (event) => {
            const targetId = event.target.id;
            if (targetId === 'call-country-code' || targetId === 'whatsapp-country-code') {
                const phoneInputId = targetId === 'call-country-code' ? 'call-phone' : 'whatsapp-phone';
                const phoneInput = document.getElementById(phoneInputId);
                if (phoneInput) {
                    const selectedCode = event.target.value;
                    const selectedCountry = countries.find(country => country.code === selectedCode);
                    phoneInput.placeholder = selectedCountry ? selectedCountry.code.replace('+', '') + '...' : '...';
                }
            }
        });

        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay || e.target.classList.contains('modal-close')) {
                closeModal();
            }
        });
    };

    const renderFinalQR = () => {
        if (!currentQRContent) return;
        qrPlaceholder.style.display = 'none';
        finalQrPreview.innerHTML = '';
        qrCodeInstance = new QRCodeStyling({
            width: 250, height: 250, data: currentQRContent, image: selectedLogo,
            dotsOptions: { color: "#000", type: "rounded" },
            backgroundOptions: { color: "#fff" }, 
            imageOptions: { hideBackgroundDots: true, imageSize: 0.35, margin: 10 },
            cornersSquareOptions: { type: "extra-rounded" },
            cornersDotOptions: { type: "dot" },
        });
        qrCodeInstance.append(finalQrPreview);
    };
    
    document.getElementById('toggle-dark').addEventListener('click', () => { document.documentElement.classList.toggle('dark'); });
    document.getElementById('lang-toggle').addEventListener('click', () => setLanguage(currentLanguage === 'es' ? 'en' : 'es'));
    
    document.getElementById('download-png').addEventListener('click', () => {
        if (!qrCodeInstance) { 
            alert(currentLanguage === 'es' ? 'Primero genere un código QR.' : 'First, generate a QR code.'); 
            return; 
        }
        const highQualityQr = new QRCodeStyling({
            width: 1000, height: 1000, data: currentQRContent, image: selectedLogo,
            dotsOptions: { color: "#000", type: "rounded" },
            backgroundOptions: { color: "transparent" },
            imageOptions: { hideBackgroundDots: true, imageSize: 0.35, margin: 10 },
            cornersSquareOptions: { type: "extra-rounded" },
            cornersDotOptions: { type: "dot" },
        });
        highQualityQr.download({ name: "qr-moderno-transparente", extension: "png" });
    });

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('generate-qr-button')) {
            const type = e.target.dataset.qrType;
            let content = '';

            switch(type) {
                case 'web':
                    content = document.getElementById('web-url').value;
                    break;
                case 'instagram':
                    const user = document.getElementById('instagram-user').value;
                    if (user) content = `https://www.instagram.com/${user.replace('@', '')}`;
                    break;
                case 'whatsapp':
                   
                    const waCountryCode = document.getElementById('whatsapp-country-code').value;
                    const waPhone = document.getElementById('whatsapp-phone').value;
                    if (waCountryCode && waPhone) {
                        const fullNumber = waCountryCode.replace('+', '') + waPhone.replace(/\s/g, '');
                        const msg = document.getElementById('whatsapp-message').value;
                        content = `https://wa.me/${fullNumber}?text=${encodeURIComponent(msg)}`;
                    }
                    break;
                case 'wifi':
                    const ssid = document.getElementById('wifi-ssid').value;
                    if (ssid) {
                        const pass = document.getElementById('wifi-password').value;
                        const enc = document.getElementById('wifi-encryption').value;
                        content = `WIFI:T:${enc};S:${ssid};P:${pass};;`;
                    }
                    break;
                case 'call':
                    const callCountryCode = document.getElementById('call-country-code').value;
                    const callPhone = document.getElementById('call-phone').value;
                    if (callCountryCode && callPhone) {
                        content = `tel:${callCountryCode}${callPhone.replace(/\s/g, '')}`;
                    } else if (callPhone) {
                        content = `tel:${callPhone.replace(/\s/g, '')}`;
                    }
                    break;
                case 'email':
                    const addr = document.getElementById('email-addr').value;
                    if (addr) {
                        const sub = document.getElementById('email-subject').value;
                        const body = document.getElementById('email-body').value;
                        content = `mailto:${addr}?subject=${encodeURIComponent(sub)}&body=${encodeURIComponent(body)}`;
                    }
                    break;
            }
            
            if (content) { 
                currentQRContent = content; 
                renderFinalQR(); 
                document.getElementById('modal-overlay').classList.add('hidden');
            } else { 
                alert(currentLanguage === 'es' ? 'Por favor, ingrese el contenido principal para el QR.' : 'Please enter the main content for the QR.'); 
            }
        }
    });
    
    // --- INITIALIZATION ---
    injectModals();
  
    populateCountryCodes('call-country-code');
    populateCountryCodes('whatsapp-country-code');
    setupModalEvents();
    setLanguage('es');
});