/**
 * HotGear Website - Lógica Interactiva y Seguridad
 * Autor: Jazmin (Apex Software Engineer & Systems Architect)
 */

document.addEventListener('DOMContentLoaded', () => {
    // === 1. CONTROL DE LA GALERÍA DE MAQUINARIA ===
    const toggleBtn = document.getElementById('toggle-gallery');
    const gallery = document.getElementById('machinery-gallery');
    const arrow = document.getElementById('gallery-arrow');

    if (toggleBtn && gallery && arrow) {
        // Inicializar atributos de accesibilidad
        toggleBtn.setAttribute('aria-expanded', 'false');
        toggleBtn.setAttribute('aria-controls', 'machinery-gallery');
        gallery.setAttribute('aria-hidden', 'true');

        toggleBtn.addEventListener('click', () => {
            const isVisible = gallery.classList.toggle('visible');
            
            // Actualizar accesibilidad
            toggleBtn.setAttribute('aria-expanded', isVisible ? 'true' : 'false');
            gallery.setAttribute('aria-hidden', isVisible ? 'false' : 'true');

            // Rotar flecha
            if (isVisible) {
                arrow.style.transform = 'rotate(180deg)';
            } else {
                arrow.style.transform = 'rotate(0deg)';
            }
        });
    }

    // === 2. SANEAMIENTO Y VALIDACIÓN DE FORMULARIO (ZERO TRUST) ===
    const contactForm = document.querySelector('#contacto form');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevenir recarga física de la página

            // Obtener elementos
            const nameInput = document.getElementById('contact-name');
            const companyInput = document.getElementById('contact-company');
            const emailInput = document.getElementById('contact-email');
            const messageInput = document.getElementById('contact-message');

            let isValid = true;

            // Resetear estados de error previos
            [nameInput, emailInput, messageInput].forEach(input => {
                if (input) {
                    input.classList.remove('border-red-500', 'focus:border-red-500');
                    input.style.borderColor = '';
                }
            });

            // Saneamiento básico de strings (Protección XSS)
            const sanitize = (str) => {
                return str
                    .trim()
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;')
                    .replace(/'/g, '&#x27;')
                    .replace(/\//g, '&#x2F;');
            };

            const nameValue = nameInput ? sanitize(nameInput.value) : '';
            const companyValue = companyInput ? sanitize(companyInput.value) : '';
            const emailValue = emailInput ? sanitize(emailInput.value) : '';
            const messageValue = messageInput ? sanitize(messageInput.value) : '';

            // Expresión regular RFC 5322 para validación estricta de correo electrónico
            const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

            // Validar Nombre
            if (nameValue.length < 2) {
                isValid = false;
                markAsError(nameInput, 'El nombre debe tener al menos 2 caracteres.');
            }

            // Validar Email
            if (!emailRegex.test(emailValue)) {
                isValid = false;
                markAsError(emailInput, 'Por favor, introduce un correo electrónico válido.');
            }

            // Validar Mensaje
            if (messageValue.length < 10) {
                isValid = false;
                markAsError(messageInput, 'El mensaje debe tener al menos 10 caracteres.');
            }

            if (isValid) {
                // Simulación inmutable del ciclo de vida de los datos de contacto
                console.log('[SECURITY LOG] Formulario de contacto validado y saneado con éxito.');
                console.log('[DATA TRANSIT]', {
                    name: nameValue,
                    company: companyValue,
                    email: emailValue,
                    message: messageValue
                });

                // Mostrar Toast de Éxito
                showToast('¡Solicitud enviada con éxito! Nos pondremos en contacto pronto.', 'success');

                // Limpiar formulario
                contactForm.reset();
            } else {
                showToast('Por favor, corrige los campos marcados en rojo.', 'error');
            }
        });
    }

    // Función auxiliar para marcar campos con error
    function markAsError(element, message) {
        if (!element) return;
        element.style.borderColor = '#ef4444'; // Rojo de advertencia
        element.focus();
    }

    // === 3. SISTEMA DE NOTIFICACIONES TOAST (PREMIUM & GLASSMORPHIC) ===
    function showToast(message, type = 'success') {
        // Eliminar toasts previos para evitar saturación del DOM
        const existingToast = document.querySelector('.hg-toast');
        if (existingToast) {
            existingToast.remove();
        }

        // Crear contenedor del Toast
        const toast = document.createElement('div');
        toast.className = `hg-toast fixed bottom-8 right-8 z-50 p-5 rounded-lg shadow-2xl flex items-center gap-4 transition-all duration-500 transform translate-y-10 opacity-0`;
        
        // Estilos Glassmorphic Premium con HSL
        toast.style.backdropFilter = 'blur(16px)';
        toast.style.webkitBackdropFilter = 'blur(16px)';
        toast.style.border = '1px solid rgba(255, 255, 255, 0.08)';

        if (type === 'success') {
            toast.style.background = 'rgba(255, 140, 0, 0.15)'; // Naranja translúcido
            toast.style.borderColor = 'rgba(255, 140, 0, 0.3)';
        } else {
            toast.style.background = 'rgba(239, 68, 68, 0.15)'; // Rojo translúcido
            toast.style.borderColor = 'rgba(239, 68, 68, 0.3)';
        }

        // Icono y Texto
        const iconColor = type === 'success' ? '#FF8C00' : '#ef4444';
        toast.innerHTML = `
            <svg class="w-6 h-6 shrink-0" fill="none" stroke="${iconColor}" stroke-width="2" viewBox="0 0 24 24" style="filter: drop-shadow(0 0 4px ${iconColor}40)">
                ${type === 'success' 
                    ? '<path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />'
                    : '<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />'
                }
            </svg>
            <span class="text-white text-sm font-medium tracking-wide">${message}</span>
        `;

        document.body.appendChild(toast);

        // Disparar animación de entrada (micro-animación)
        setTimeout(() => {
            toast.classList.remove('translate-y-10', 'opacity-0');
            toast.classList.add('translate-y-0', 'opacity-100');
        }, 50);

        // Desvanecimiento y eliminación automática tras 4 segundos
        setTimeout(() => {
            toast.classList.remove('translate-y-0', 'opacity-100');
            toast.classList.add('translate-y-10', 'opacity-0');
            setTimeout(() => {
                toast.remove();
            }, 500);
        }, 4000);
    }

    // === 4. CONTROL DEL MENÚ HAMBURGUESA (MÓVIL) ===
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded ? 'true' : 'false');
            mobileMenu.classList.toggle('hidden');
        });

        // Cerrar menú móvil al hacer clic en cualquier enlace
        const mobileLinks = mobileMenu.querySelectorAll('a, button');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }
});
