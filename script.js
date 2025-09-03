    document.addEventListener("DOMContentLoaded", () => {
      let currentQRContent = ''; let selectedLogo = null; let currentLanguage = 'es';
      let qrCodeInstance = null; let currentColor = '#000000';
      let currentDotStyle = 'rounded'; let currentTemplate = 'default';
      let currentBackgroundColor = '#ffffff'; let currentEyeStyle = 'rounded';
      let qrHistory = JSON.parse(localStorage.getItem('qrHistory')) || [];
      let currentModal = '';

      const qrPlaceholder = document.getElementById('qr-placeholder');
      const finalQrPreview = document.getElementById('final-qr-preview');

      const translations = {
        es: {
          header_title: "Generador QR", generator_title: "Tipos de QR", customization_title: "Personalización",
          preview_title: "Vista Previa", qr_placeholder_title: "Selecciona un tipo de QR para comenzar",
          customization_color_label: "Color del código QR", customization_dots_label: "Forma de los puntos",
          dots_rounded: "Redondeados", dots_square: "Cuadrados", dots_dot: "Puntos",
          templates_title: "Plantillas", template_frame: "Con marco",
          card_web_title: "Sitio Web", card_web_subtitle: "Enlaza a cualquier URL", card_insta_title: "Instagram", card_insta_subtitle: "Comparte tu perfil",
          card_wa_title: "WhatsApp", card_wa_subtitle: "Recibe mensajes directos", card_wifi_title: "Wi-Fi", card_wifi_subtitle: "Conecta automáticamente",
          card_call_title: "Teléfono", card_call_subtitle: "Llama con un toque", card_email_title: "Email", card_email_subtitle: "Envía correos fácilmente",
          card_sms_title: "SMS", card_sms_subtitle: "Envía mensajes de texto", card_vcard_title: "Contacto", card_vcard_subtitle: "Comparte tu vCard",
          card_location_title: "Ubicación", card_location_subtitle: "Comparte una ubicación",
          download_button: "Descargar HD",
          benefits_title: "Beneficios del Generador QR", benefits_subtitle: "Crea códigos QR estáticos y personalizados de forma rápida y gratuita. Ideal para tarjetas de presentación, menús, eventos y más.",
          benefit_1: "Códigos QR ilimitados", benefit_2: "Personalización de logos", benefit_3: "No requiere registro", benefit_4: "Totalmente gratuito",
          footer_developed_by: "Desarrollado por", footer_privacy: "Política de Privacidad", footer_terms: "Términos y Condiciones", footer_donate: "Donar",
          modal_config_web: "Configurar QR de Sitio Web", modal_url_label: "URL del sitio web", modal_config_insta: "Configurar QR de Instagram", modal_user_label: "Nombre de usuario (sin @)",
          modal_config_wa: "Configurar QR de WhatsApp", modal_msg_label: "Mensaje (opcional)", modal_config_wifi: "Configurar QR de Wi-Fi", modal_ssid_label: "Nombre de la Red (SSID)", modal_pass_label: "Contraseña", modal_encrypt_label: "Tipo de Cifrado",
          modal_config_call: "Configurar QR de Llamada", modal_phone_num_label: "Número de Teléfono", modal_config_email: "Configurar QR de Email", modal_email_addr_label: "Dirección de correo", modal_subject_label: "Asunto", modal_body_label: "Cuerpo del mensaje",
          modal_config_sms: "Configurar QR para SMS", modal_sms_body_label: "Mensaje", modal_config_vcard: "Configurar QR de Contacto (vCard)", modal_vcard_name_label: "Nombre Completo", modal_vcard_org_label: "Organización", modal_vcard_email_label: "Email", modal_vcard_web_label: "Sitio Web",
          modal_config_location: "Configurar QR de Ubicación", modal_loc_lat_label: "Latitud", modal_loc_lon_label: "Longitud",
          modal_close_button: "Cerrar", modal_generate_button: "Generar QR", frame_logo_title: "Logo (Opcional)",
          privacy_title: "Política de Privacidad", privacy_text: "Esta aplicación es de código abierto y no almacena ningún dato ingresado por el usuario. Toda la generación de códigos QR se realiza en el lado del cliente (en su navegador).",
          terms_title: "Términos y Condiciones", terms_text: "El uso de este servicio es gratuito. Usted es responsable del contenido que genera. No se permite el uso para fines ilícitos.",
        },
        en: {
          header_title: "QR Generator", generator_title: "QR Types", customization_title: "Customization",
          preview_title: "Preview", qr_placeholder_title: "Select a QR type to begin",
          customization_color_label: "QR code color", customization_dots_label: "Dot shape",
          dots_rounded: "Rounded", dots_square: "Square", dots_dot: "Dots",
          templates_title: "Templates", template_frame: "With frame",
          card_web_title: "Website", card_web_subtitle: "Link to any URL", card_insta_title: "Instagram", card_insta_subtitle: "Share your profile",
          card_wa_title: "WhatsApp", card_wa_subtitle: "Receive direct messages", card_wifi_title: "Wi-Fi", card_wifi_subtitle: "Connect automatically",
          card_call_title: "Phone", card_call_subtitle: "Call with one tap", card_email_title: "Email", card_email_subtitle: "Send emails easily",
          card_sms_title: "SMS", card_sms_subtitle: "Send a text message", card_vcard_title: "Contact", card_vcard_subtitle: "Share your vCard",
          card_location_title: "Location", card_location_subtitle: "Share a map location",
          download_button: "Download HD",
          benefits_title: "Benefits of the QR Generator", benefits_subtitle: "Create static and personalized QR codes quickly and for free. Ideal for business cards, menus, events, and more.",
          benefit_1: "Unlimited QR codes", benefit_2: "Logo customization", benefit_3: "No registration required", benefit_4: "Completely free",
          footer_developed_by: "Developed by", footer_privacy: "Privacy Policy", footer_terms: "Terms and Conditions", footer_donate: "Donate",
          modal_config_web: "Configure Website QR", modal_url_label: "Website URL", modal_config_insta: "Configure Instagram QR", modal_user_label: "Username (without @)",
          modal_config_wa: "Configure WhatsApp QR", modal_msg_label: "Message (optional)", modal_config_wifi: "Configure Wi-Fi QR", modal_ssid_label: "Network Name (SSID)", modal_pass_label: "Password", modal_encrypt_label: "Encryption Type",
          modal_config_call: "Configure Call QR", modal_phone_num_label: "Phone Number", modal_config_email: "Configure Email QR", modal_email_addr_label: "Email address", modal_subject_label: "Subject", modal_body_label: "Message body",
          modal_config_sms: "Configure SMS QR", modal_sms_body_label: "Message", modal_config_vcard: "Configure Contact QR (vCard)", modal_vcard_name_label: "Full Name", modal_vcard_org_label: "Organization", modal_vcard_email_label: "Email", modal_vcard_web_label: "Website",
          modal_config_location: "Configure Location QR", modal_loc_lat_label: "Latitude", modal_loc_lon_label: "Longitude",
          modal_close_button: "Close", modal_generate_button: "Generate QR", frame_logo_title: "Logo (Optional)",
          privacy_title: "Privacy Policy", privacy_text: "This application is open source and does not store any data entered by the user. All QR code generation is done on the client side (in your browser).",
          terms_title: "Terms and Conditions", terms_text: "Use of this service is free. You are responsible for the content you generate. Use for illegal purposes is not permitted..",
        }
      };

      const setLanguage = (lang) => {
        currentLanguage = lang; document.documentElement.lang = lang;
        document.querySelectorAll('[data-translate]').forEach(el => {
          const key = el.getAttribute('data-translate');
          if (translations[lang] && translations[lang][key]) { el.textContent = translations[lang][key]; }
        });
        document.getElementById('lang-toggle').textContent = lang === 'es' ? 'EN' : 'ES';
      };

      // Función para actualizar el historial
      const updateHistory = (qrData) => {
        // Limitar el historial a 5 elementos
        if (qrHistory.length >= 5) {
          qrHistory.pop();
        }
        qrHistory.unshift(qrData);
        localStorage.setItem('qrHistory', JSON.stringify(qrHistory));
        renderHistory();
      };
      
      // Función para renderizar el historial
      const renderHistory = () => {
        const historyContainer = document.getElementById('qr-history');
        if (qrHistory.length === 0) {
          historyContainer.innerHTML = '<p class="text-sm text-gray-500 text-center py-4">Tus códigos QR aparecerán aquí</p>';
          return;
        }
        
        historyContainer.innerHTML = qrHistory.map((item, index) => `
          <div class="history-item fade-in" data-history-index="${index}">
            <div class="history-qr">
              <img src="${item.thumbnail}" alt="QR histórico" class="w-full h-full">
            </div>
            <div class="flex-1 truncate">
              <p class="text-sm font-medium truncate">${item.type}</p>
              <p class="text-xs text-gray-500 truncate">${new Date(item.timestamp).toLocaleString()}</p>
            </div>
            <button class="history-action p-1 text-gray-500 hover:text-primary-600">
              <i class="fas fa-redo"></i>
            </button>
          </div>
        `).join('');
        
        // Añadir event listeners a los elementos del historial
        document.querySelectorAll('.history-item').forEach(item => {
          item.addEventListener('click', (e) => {
            if (!e.target.closest('.history-action')) {
              const index = item.dataset.historyIndex;
              loadFromHistory(index);
            }
          });
        });
        
        document.querySelectorAll('.history-action').forEach(button => {
          button.addEventListener('click', (e) => {
            e.stopPropagation();
            const index = button.closest('.history-item').dataset.historyIndex;
            loadFromHistory(index);
          });
        });
      };
      
      // Función para cargar desde el historial
      const loadFromHistory = (index) => {
        const item = qrHistory[index];
        if (item) {
          currentQRContent = item.config.content;
          currentColor = item.config.color;
          currentBackgroundColor = item.config.bgColor;
          currentDotStyle = item.config.dotStyle;
          currentEyeStyle = item.config.eyeStyle;
          currentTemplate = item.config.template;
          selectedLogo = item.config.logo;
          
          // Actualizar UI para reflejar los valores cargados
          document.querySelectorAll('.color-option').forEach(opt => {
            if (opt.dataset.color === currentColor) {
              opt.classList.add('active');
            } else {
              opt.classList.remove('active');
            }
          });
          
          document.querySelectorAll('[data-bg-color]').forEach(opt => {
            if (opt.dataset.bgColor === currentBackgroundColor) {
              opt.classList.add('active');
            } else {
              opt.classList.remove('active');
            }
          });
          
          document.querySelector(`input[name="dots-style"][value="${currentDotStyle}"]`).checked = true;
          document.querySelector(`input[name="eyes-style"][value="${currentEyeStyle}"]`).checked = true;
          
          document.querySelectorAll('.template-option').forEach(t => {
            if (t.dataset.template === currentTemplate) {
              t.classList.add('selected');
            } else {
              t.classList.remove('selected');
            }
          });
          
          renderFinalQR();
        }
      };

      const renderFinalQR = () => {
        if (!currentQRContent) return;
        qrPlaceholder.style.display = 'none'; finalQrPreview.innerHTML = '';
        const qrOptions = {
          width: finalQrPreview.clientWidth, height: finalQrPreview.clientHeight, data: currentQRContent, image: selectedLogo,
          dotsOptions: { color: currentColor, type: currentDotStyle },
          backgroundOptions: { color: currentBackgroundColor },
          imageOptions: { hideBackgroundDots: true, imageSize: 0.35, margin: 5 },
          cornersSquareOptions: { type: currentEyeStyle },
          cornersDotOptions: { type: currentEyeStyle }
        };
        
        // Aplicar plantillas
        if (currentTemplate === 'frame') {
          qrOptions.dotsOptions.color = '#4f46e5';
          qrOptions.backgroundOptions.color = '#f3f4f6';
        } else if (currentTemplate === 'modern') {
          qrOptions.dotsOptions.color = '#3b82f6';
          qrOptions.cornersSquareOptions.type = 'extra-rounded';
          qrOptions.cornersDotOptions.type = 'dot';
        } else if (currentTemplate === 'elegant') {
          qrOptions.dotsOptions.color = '#7c3aed';
          qrOptions.backgroundOptions.color = '#f5f3ff';
          qrOptions.dotsOptions.type = 'dot';
        }
        
        qrCodeInstance = new QRCodeStyling(qrOptions);
        qrCodeInstance.append(finalQrPreview);
        
        // Guardar en historial
        setTimeout(() => {
          html2canvas(finalQrPreview).then(canvas => {
            const thumbnail = canvas.toDataURL('image/jpeg', 0.5);
            updateHistory({
              type: document.querySelector(`[data-modal-id="${currentModal}"] .font-semibold`).textContent,
              timestamp: Date.now(),
              thumbnail: thumbnail,
              config: {
                content: currentQRContent,
                color: currentColor,
                bgColor: currentBackgroundColor,
                dotStyle: currentDotStyle,
                eyeStyle: currentEyeStyle,
                template: currentTemplate,
                logo: selectedLogo
              }
            });
          });
        }, 500);
      };
      
      const downloadQR = (format = 'png') => {
        if (!currentQRContent) { alert('Primero genere un código QR.'); return; }
        const downloadInstance = new QRCodeStyling({
          width: 1000, height: 1000, data: currentQRContent, image: selectedLogo,
          dotsOptions: { color: currentColor, type: currentDotStyle },
          backgroundOptions: { color: "transparent" },
          imageOptions: { hideBackgroundDots: true, imageSize: 0.35, margin: 20 },
          cornersSquareOptions: { type: currentEyeStyle },
          cornersDotOptions: { type: currentEyeStyle }
        });
        downloadInstance.download({ name: "qr-choco-creativo", extension: format });
      };

      const setupEventListeners = () => {
        document.getElementById('customization-toggle').addEventListener('click', () => {
          const panel = document.getElementById('customization-panel');
          const arrow = document.getElementById('customization-arrow');
          panel.classList.toggle('max-h-0'); panel.classList.toggle('pt-4');
          arrow.classList.toggle('rotate-180');
        });
        
        document.querySelectorAll('.color-option').forEach(option => option.addEventListener('click', (e) => {
          document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('active'));
          e.target.classList.add('active'); currentColor = e.target.dataset.color;
          if (currentQRContent) renderFinalQR();
        }));
        
        document.querySelectorAll('[data-bg-color]').forEach(option => {
          option.addEventListener('click', (e) => {
            document.querySelectorAll('[data-bg-color]').forEach(opt => opt.classList.remove('active'));
            e.target.classList.add('active');
            currentBackgroundColor = e.target.dataset.bgColor;
            if (currentQRContent) renderFinalQR();
          });
        });
        
        document.querySelectorAll('input[name="dots-style"]').forEach(radio => radio.addEventListener('change', (e) => {
          currentDotStyle = e.target.value; if (currentQRContent) renderFinalQR();
        }));
        
        document.querySelectorAll('input[name="eyes-style"]').forEach(radio => {
          radio.addEventListener('change', (e) => {
            currentEyeStyle = e.target.value;
            if (currentQRContent) renderFinalQR();
          });
        });
        
        document.querySelectorAll('.template-option').forEach(template => template.addEventListener('click', (e) => {
          document.querySelectorAll('.template-option').forEach(t => t.classList.remove('selected'));
          const current = e.target.closest('.template-option');
          current.classList.add('selected'); currentTemplate = current.dataset.template;
          if (currentQRContent) renderFinalQR();
        }));
        
        document.getElementById('download-png').addEventListener('click', () => downloadQR('png'));
        document.getElementById('download-svg').addEventListener('click', () => downloadQR('svg'));
        
        document.getElementById('toggle-dark').addEventListener('click', () => {
          document.documentElement.classList.toggle('dark');
        });
        
        document.getElementById('lang-toggle').addEventListener('click', () => setLanguage(currentLanguage === 'es' ? 'en' : 'es'));
        
        document.getElementById('qr-type-selector').addEventListener('click', (e) => {
          const card = e.target.closest('.qr-type-card');
          if (card && card.dataset.modalId) {
            selectedLogo = null; 
            currentModal = card.dataset.modalId;
            openModal(card.dataset.modalId);
          }
        });
        
        document.getElementById('privacy-link').addEventListener('click', (e) => { e.preventDefault(); openModal('modal-privacy'); });
        document.getElementById('terms-link').addEventListener('click', (e) => { e.preventDefault(); openModal('modal-terms'); });
        
        // Event listeners para los selectores de color personalizados
        document.getElementById('custom-color-picker').addEventListener('input', (e) => {
          currentColor = e.target.value;
          if (currentQRContent) renderFinalQR();
        });
        
        document.getElementById('custom-bg-color-picker').addEventListener('input', (e) => {
          currentBackgroundColor = e.target.value;
          if (currentQRContent) renderFinalQR();
        });
        
        // Event listener para el botón de borrar historial
        document.getElementById('clear-history').addEventListener('click', () => {
          if (confirm('¿Estás seguro de que quieres borrar todo el historial?')) {
            qrHistory = [];
            localStorage.setItem('qrHistory', JSON.stringify(qrHistory));
            renderHistory();
          }
        });
        
        // Event listeners para los nuevos botones de compartir
        document.getElementById('copy-image-btn').addEventListener('click', () => {
            if (!currentQRContent) {
                alert('Primero genere un código QR para copiar.');
                return;
            }
            html2canvas(finalQrPreview).then(canvas => {
                canvas.toBlob(blob => {
                    try {
                        navigator.clipboard.write([
                            new ClipboardItem({ 'image/png': blob })
                        ]);
                        alert('¡Imagen del QR copiada al portapapeles!');
                    } catch (error) {
                        console.error('Error al copiar la imagen: ', error);
                        alert('Tu navegador no soporta copiar imágenes al portapapeles o hubo un error.');
                    }
                });
            });
        });

        document.getElementById('share-image-btn').addEventListener('click', async () => {
            if (!currentQRContent) {
                alert('Primero genere un código QR para compartir.');
                return;
            }

            try {
                const canvas = await html2canvas(finalQrPreview);
                const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
                const file = new File([blob], 'qr-choco-creativo.png', { type: 'image/png' });
                const shareData = {
                    files: [file],
                    title: 'Código QR de Chocó Creativo',
                    text: '¡Mira este código QR que creé con el generador de Chocó Creativo!',
                };

                if (navigator.canShare && navigator.canShare(shareData)) {
                    await navigator.share(shareData);
                } else {
                    alert('Tu navegador no soporta la función de compartir archivos.');
                }
            } catch (error) {
                console.error('Error al compartir:', error);
                alert('No se pudo compartir la imagen del QR.');
            }
        });
      };

      const injectModals = () => {
        const commonModalSections = (type) => `
          <div class="mt-4 border-t pt-4 dark:border-gray-600">
            <label class="block text-sm font-medium mb-2" data-translate="frame_logo_title"></label>
            <input type="file" class="logo-input text-sm w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:text-gray-300" accept="image/*" data-modal-type="${type}">
            <img class="logo-preview hidden w-16 h-16 mt-2 rounded-md object-contain bg-gray-100 dark:bg-gray-700" id="logo-preview-${type}">
          </div>
          <div class="mt-6 flex justify-end gap-2">
            <button class="modal-close bg-gray-200 dark:bg-gray-600 px-4 py-2 rounded-lg" data-translate="modal_close_button"></button>
            <button data-qr-type="${type}" class="generate-qr-button bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg" data-translate="modal_generate_button"></button>
          </div>`;
          
        document.getElementById('modal-container').innerHTML = `
        <div id="modal-overlay" class="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300 z-50 p-4 hidden">
          <div class="modal-content-wrapper w-full max-w-md">
            <div id="modal-web" class="modal-content bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hidden"><h3 class="text-lg font-bold mb-4" data-translate="modal_config_web"></h3><label class="block mb-2 text-sm" data-translate="modal_url_label"></label><input id="web-url" type="url" class="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600" placeholder="https://ejemplo.com">${commonModalSections('web')}</div>
            <div id="modal-instagram" class="modal-content bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hidden"><h3 class="text-lg font-bold mb-4" data-translate="modal_config_insta"></h3><label class="block mb-2 text-sm" data-translate="modal_user_label"></label><input id="instagram-user" type="text" class="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600" placeholder="usuario.de.instagram">${commonModalSections('instagram')}</div>
            <div id="modal-whatsapp" class="modal-content bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hidden"><h3 class="text-lg font-bold mb-4" data-translate="modal_config_wa"></h3><label class="block mb-2 text-sm" data-translate="modal_phone_num_label"></label><input id="whatsapp-phone" type="tel" class="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600" placeholder="573001234567"><label class="block mt-4 mb-2 text-sm" data-translate="modal_msg_label"></label><textarea id="whatsapp-message" class="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600" rows="2" placeholder="¡Hola!"></textarea>${commonModalSections('whatsapp')}</div>
            <div id="modal-wifi" class="modal-content bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hidden"><h3 class="text-lg font-bold mb-4" data-translate="modal_config_wifi"></h3><label class="block mb-2 text-sm" data-translate="modal_ssid_label"></label><input id="wifi-ssid" type="text" class="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600" placeholder="NombreDeMiRed"><label class="block mt-4 mb-2 text-sm" data-translate="modal_pass_label"></label><input id="wifi-password" type="password" class="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600"><label class="block mt-4 mb-2 text-sm" data-translate="modal_encrypt_label"></label><select id="wifi-encryption" class="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600"><option value="WPA">WPA/WPA2</option><option value="WEP">WEP</option><option value="nopass">Sin contraseña</option></select>${commonModalSections('wifi')}</div>
            <div id="modal-call" class="modal-content bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hidden"><h3 class="text-lg font-bold mb-4" data-translate="modal_config_call"></h3><label class="block mb-2 text-sm" data-translate="modal_phone_num_label"></label><input id="call-phone" type="tel" class="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600" placeholder="+573001234567">${commonModalSections('call')}</div>
            <div id="modal-email" class="modal-content bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hidden"><h3 class="text-lg font-bold mb-4" data-translate="modal_config_email"></h3><label class="block mb-2 text-sm" data-translate="modal_email_addr_label"></label><input id="email-addr" type="email" class="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600" placeholder="correo@ejemplo.com"><label class="block mt-4 mb-2 text-sm" data-translate="modal_subject_label"></label><input id="email-subject" type="text" class="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600" placeholder="Asunto"><label class="block mt-4 mb-2 text-sm" data-translate="modal_body_label"></label><textarea id="email-body" class="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600" rows="2"></textarea>${commonModalSections('email')}</div>
            <div id="modal-sms" class="modal-content bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hidden"><h3 class="text-lg font-bold mb-4" data-translate="modal_config_sms"></h3><label class="block mb-2 text-sm" data-translate="modal_phone_num_label"></label><input id="sms-phone" type="tel" class="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600" placeholder="+573001234567"><label class="block mt-4 mb-2 text-sm" data-translate="modal_sms_body_label"></label><textarea id="sms-body" class="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600" rows="3" placeholder="Mensaje..."></textarea>${commonModalSections('sms')}</div>
            <div id="modal-vcard" class="modal-content bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hidden"><h3 class="text-lg font-bold mb-4" data-translate="modal_config_vcard"></h3><div class="space-y-3 text-left"><label class="block text-sm" data-translate="modal_vcard_name_label"></label><input id="vcard-name" type="text" class="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600" placeholder="Juan Pérez"><label class="block text-sm" data-translate="modal_phone_num_label"></label><input id="vcard-phone" type="tel" class="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600" placeholder="+573001234567"><label class="block text-sm" data-translate="modal_vcard_email_label"></label><input id="vcard-email" type="email" class="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600" placeholder="juan.perez@email.com"><label class="block text-sm" data-translate="modal_vcard_org_label"></label><input id="vcard-org" type="text" class="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600" placeholder="Empresa"><label class="block text-sm" data-translate="modal_vcard_web_label"></label><input id="vcard-web" type="url" class="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600" placeholder="https://tu-sitio.com"></div>${commonModalSections('vcard')}</div>
            <div id="modal-location" class="modal-content bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hidden"><h3 class="text-lg font-bold mb-4" data-translate="modal_config_location"></h3><label class="block mb-2 text-sm" data-translate="modal_loc_lat_label"></label><input id="loc-lat" type="text" class="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600" placeholder="Ej: 4.60971"><label class="block mt-4 mb-2 text-sm" data-translate="modal_loc_lon_label"></label><input id="loc-lon" type="text" class="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600" placeholder="Ej: -74.08175">${commonModalSections('location')}</div>
            
            <div id="modal-spotify" class="modal-content bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hidden"><h3 class="text-lg font-bold mb-4">Configurar QR de Spotify</h3><label class="block mb-2 text-sm">URL de Spotify</label><input id="spotify-url" type="url" class="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600" placeholder="https://open.spotify.com/track/..."><p class="text-xs text-gray-500 mt-1">Pega el enlace de una canción, álbum o playlist de Spotify</p>${commonModalSections('spotify')}</div>
            
            <div id="modal-telegram" class="modal-content bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hidden"><h3 class="text-lg font-bold mb-4">Configurar QR de Telegram</h3><label class="block mb-2 text-sm">Nombre de usuario o URL</label><input id="telegram-username" type="text" class="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600" placeholder="usuario o t.me/enlace"><p class="text-xs text-gray-500 mt-1">Ingresa el usuario (sin @) o la URL completa de Telegram</p>${commonModalSections('telegram')}</div>
            
            <div id="modal-privacy" class="modal-content bg-white dark:bg-gray-800 p-6 rounded-2xl w-full max-w-lg hidden"><h3 class="text-lg font-bold mb-2" data-translate="privacy_title"></h3><p class="text-sm" data-translate="privacy_text"></p><button class="modal-close mt-4 bg-indigo-600 text-white px-3 py-1 rounded-lg" data-translate="modal_close_button"></button></div>
            <div id="modal-terms" class="modal-content bg-white dark:bg-gray-800 p-6 rounded-2xl w-full max-w-lg hidden"><h3 class="text-lg font-bold mb-2" data-translate="terms_title"></h3><p class="text-sm" data-translate="terms_text"></p><button class="modal-close mt-4 bg-indigo-600 text-white px-3 py-1 rounded-lg" data-translate="modal_close_button"></button></div>
          </div>
        </div>`;
      };
      
      const setupModalLogic = () => {
        const modalOverlay = document.getElementById('modal-overlay');
        const openModal = (modalId) => {
          modalOverlay.querySelectorAll('.modal-content').forEach(m => m.classList.add('hidden'));
          const modal = document.getElementById(modalId);
          if (modal) modal.classList.remove('hidden');
          modalOverlay.classList.remove('hidden');
        };
        const closeModal = () => modalOverlay.classList.add('hidden');
        window.openModal = openModal;
        modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay || e.target.closest('.modal-close')) { closeModal(); } });
        document.addEventListener('change', (event) => {
          if (event.target.matches('.logo-input')) {
            const type = event.target.dataset.modalType; const preview = document.getElementById(`logo-preview-${type}`);
            if (event.target.files && event.target.files[0]) {
              const reader = new FileReader();
              reader.onload = (e) => { selectedLogo = e.target.result; if(preview) { preview.src = selectedLogo; preview.classList.remove('hidden'); } };
              reader.readAsDataURL(event.target.files[0]);
            }
          }
        });
        document.addEventListener('click', (e) => {
          if (e.target.closest('.generate-qr-button')) {
            const type = e.target.closest('.generate-qr-button').dataset.qrType;
            let content = '';
            switch(type) {
              case 'web': content = document.getElementById('web-url').value; break;
              case 'instagram': content = `https://www.instagram.com/${document.getElementById('instagram-user').value.replace('@', '')}`; break;
              case 'whatsapp': content = `https://wa.me/${document.getElementById('whatsapp-phone').value.replace(/\s/g, '')}?text=${encodeURIComponent(document.getElementById('whatsapp-message').value)}`; break;
              case 'wifi': content = `WIFI:T:${document.getElementById('wifi-encryption').value};S:${document.getElementById('wifi-ssid').value};P:${document.getElementById('wifi-password').value};;`; break;
              case 'call': content = `tel:${document.getElementById('call-phone').value.replace(/\s/g, '')}`; break;
              case 'email': content = `mailto:${document.getElementById('email-addr').value}?subject=${encodeURIComponent(document.getElementById('email-subject').value)}&body=${encodeURIComponent(document.getElementById('email-body').value)}`; break;
              case 'sms': content = `smsto:${document.getElementById('sms-phone').value.replace(/\s/g, '')}:${document.getElementById('sms-body').value}`; break;
              case 'vcard':
                const vname = document.getElementById('vcard-name').value; const vphone = document.getElementById('vcard-phone').value; const vemail = document.getElementById('vcard-email').value; const vorg = document.getElementById('vcard-org').value; const vweb = document.getElementById('vcard-web').value;
                content = `BEGIN:VCARD\nVERSION:3.0\nFN:${vname}\nORG:${vorg}\nTEL;TYPE=CELL:${vphone}\nEMAIL:${vemail}\nURL:${vweb}\nEND:VCARD`; break;
              case 'location': content = `geo:${document.getElementById('loc-lat').value},${document.getElementById('loc-lon').value}`; break;
              case 'spotify': content = document.getElementById('spotify-url').value; break;
              case 'telegram': 
                const username = document.getElementById('telegram-username').value;
                content = username.startsWith('http') ? username : `https://t.me/${username.replace('@', '')}`;
                break;
            }
            if (content && content.length > 5) { 
              currentQRContent = content; 
              renderFinalQR(); 
              closeModal(); 
            } else { 
              alert('Por favor, completa los campos requeridos.'); 
            }
          }
        });
      };
      
      const checkSystemDarkMode = () => { if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) { document.documentElement.classList.add('dark'); }};
      
      // Inicializar la aplicación
      injectModals(); 
      setupModalLogic(); 
      setLanguage('es');
      setupEventListeners(); 
      checkSystemDarkMode();
      renderHistory();
    });