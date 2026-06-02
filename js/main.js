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
        // Inicializar atributos de accesibilidad (Abierto por defecto)
        toggleBtn.setAttribute('aria-expanded', 'true');
        toggleBtn.setAttribute('aria-controls', 'machinery-gallery');
        gallery.setAttribute('aria-hidden', 'false');
        arrow.style.transform = 'rotate(180deg)';

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
            toast.style.background = 'rgba(236, 94, 40, 0.15)'; // Naranja translúcido
            toast.style.borderColor = 'rgba(236, 94, 40, 0.3)';
        } else {
            toast.style.background = 'rgba(239, 68, 68, 0.15)'; // Rojo translúcido
            toast.style.borderColor = 'rgba(239, 68, 68, 0.3)';
        }

        // Icono y Texto
        const iconColor = type === 'success' ? '#ec5e28' : '#ef4444';
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

    // === 5. CONTROL DE PESTAÑAS COMPRA/VENTA Y VALIDACIÓN ===
    const tabBuy = document.getElementById('tab-buy');
    const tabSell = document.getElementById('tab-sell');
    const buyCatalog = document.getElementById('buy-catalog');
    const sellFormContainer = document.getElementById('sell-form-container');

    if (tabBuy && tabSell && buyCatalog && sellFormContainer) {
        tabBuy.addEventListener('click', () => {
            // Activar botón Comprar
            tabBuy.classList.add('bg-brand', 'text-black');
            tabBuy.classList.remove('text-gray-400', 'hover:text-white');

            // Desactivar botón Vender
            tabSell.classList.remove('bg-brand', 'text-black');
            tabSell.classList.add('text-gray-400', 'hover:text-white');

            // Mostrar Catálogo, Ocultar Formulario
            sellFormContainer.classList.add('hidden');
            sellFormContainer.classList.remove('opacity-100', 'scale-100');
            sellFormContainer.classList.add('opacity-0', 'scale-95');

            buyCatalog.classList.remove('hidden');
            setTimeout(() => {
                buyCatalog.classList.add('opacity-100', 'scale-100');
                buyCatalog.classList.remove('opacity-0', 'scale-95');
            }, 50);
        });

        tabSell.addEventListener('click', () => {
            // Activar botón Vender
            tabSell.classList.add('bg-brand', 'text-black');
            tabSell.classList.remove('text-gray-400', 'hover:text-white');

            // Desactivar botón Comprar
            tabBuy.classList.remove('bg-brand', 'text-black');
            tabBuy.classList.add('text-gray-400', 'hover:text-white');

            // Mostrar Formulario, Ocultar Catálogo
            buyCatalog.classList.add('hidden');
            buyCatalog.classList.remove('opacity-100', 'scale-100');
            buyCatalog.classList.add('opacity-0', 'scale-95');

            sellFormContainer.classList.remove('hidden');
            setTimeout(() => {
                sellFormContainer.classList.add('opacity-100', 'scale-100');
                sellFormContainer.classList.remove('opacity-0', 'scale-95');
            }, 50);
        });
    }

    // Validación del Formulario de Venta (Zero Trust)
    const sellForm = document.getElementById('sell-machinery-form');
    if (sellForm) {
        sellForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const typeInput = document.getElementById('sell-type');
            const brandInput = document.getElementById('sell-brand');
            const modelInput = document.getElementById('sell-model');
            const yearInput = document.getElementById('sell-year');
            const hoursInput = document.getElementById('sell-hours');
            const conditionInput = document.getElementById('sell-condition');
            const priceInput = document.getElementById('sell-price');
            const nameInput = document.getElementById('sell-contact-name');
            const emailInput = document.getElementById('sell-contact-email');

            let isValid = true;

            // Resetear errores anteriores
            const allInputs = [typeInput, brandInput, modelInput, yearInput, hoursInput, conditionInput, priceInput, nameInput, emailInput];
            allInputs.forEach(input => {
                if (input) {
                    input.style.borderColor = '';
                }
            });

            // Saneamiento de strings (XSS Shield)
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

            // Validar Tipo
            if (!typeInput || !typeInput.value) {
                isValid = false;
                markAsError(typeInput);
            }

            // Validar Marca
            const brandValue = brandInput ? sanitize(brandInput.value) : '';
            if (brandValue.length < 2) {
                isValid = false;
                markAsError(brandInput);
            }

            // Validar Modelo
            const modelValue = modelInput ? sanitize(modelInput.value) : '';
            if (modelValue.length < 1) {
                isValid = false;
                markAsError(modelInput);
            }

            // Validar Año
            const currentYear = new Date().getFullYear();
            const yearValue = yearInput ? parseInt(yearInput.value, 10) : 0;
            if (isNaN(yearValue) || yearValue < 1980 || yearValue > currentYear + 1) {
                isValid = false;
                markAsError(yearInput);
            }

            // Validar Horas
            const hoursValue = hoursInput ? parseInt(hoursInput.value, 10) : -1;
            if (isNaN(hoursValue) || hoursValue < 0) {
                isValid = false;
                markAsError(hoursInput);
            }

            // Validar Condición
            if (!conditionInput || !conditionInput.value) {
                isValid = false;
                markAsError(conditionInput);
            }

            // Validar Precio
            const priceValue = priceInput ? parseFloat(priceInput.value) : -1;
            if (isNaN(priceValue) || priceValue <= 0) {
                isValid = false;
                markAsError(priceInput);
            }

            // Validar Nombre de Contacto
            const nameValue = nameInput ? sanitize(nameInput.value) : '';
            if (nameValue.length < 2) {
                isValid = false;
                markAsError(nameInput);
            }

            // Validar Email de Contacto (regex RFC 5322)
            const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
            const emailValue = emailInput ? sanitize(emailInput.value) : '';
            if (!emailRegex.test(emailValue)) {
                isValid = false;
                markAsError(emailInput);
            }

            if (isValid) {
                console.log('[SECURITY LOG] Formulario de venta validado y saneado con éxito.');
                console.log('[DATA TRANSIT]', {
                    type: typeInput.value,
                    brand: brandValue,
                    model: modelValue,
                    year: yearValue,
                    hours: hoursValue,
                    condition: conditionInput.value,
                    price: priceValue,
                    contactName: nameValue,
                    contactEmail: emailValue
                });

                showToast('¡Propuesta enviada con éxito! Evaluaremos tu equipo a la brevedad.', 'success');
                sellForm.reset();
            } else {
                showToast('Por favor, completa los campos requeridos en rojo.', 'error');
            }
        });
    }

    // === 6. BASE DE DATOS DE MAQUINARIA Y MODAL DETALLADO ===
    const machineryData = {
        'cat-d8t-2019': {
            title: 'Tractor Caterpillar D8T',
            tag: 'Venta',
            year: '2019',
            hours: '10,556.8 hrs',
            description: 'Tractor Caterpillar D8T en excelentes condiciones operativas, motor Cat C15 de alto rendimiento, cabina cerrada climatizada con mandos joystick y ripper trasero de tres vástagos.',
            price: '$608,000 USD NETO',
            specs: {
                'Motor': 'Cat C15 ACERT',
                'Peso Operativo': '37.2 Ton',
                'Potencia': '347 hp',
                'Longitud': '7.8 metros',
                'Altura': '3.4 metros',
                'Ancho': '3.0 metros',
                'Anchura Orugas': '711 mm',
                'Equipamiento': 'Cabina Cerrada con A/C, Ripper trasero, Suspensión Neumática',
                'Dirección': 'Mandos tipo Joystick',
                'Ubicación': 'Texcoco'
            },
            images: [
                'assets/caterpillar_d8t/1.jpeg',
                'assets/caterpillar_d8t/2.jpeg',
                'assets/caterpillar_d8t/3.jpeg',
                'assets/caterpillar_d8t/4.jpeg',
                'assets/caterpillar_d8t/5.jpeg',
                'assets/caterpillar_d8t/6.jpeg',
                'assets/caterpillar_d8t/7.jpeg',
                'assets/caterpillar_d8t/8.jpeg',
                'assets/caterpillar_d8t/9.jpeg',
                'assets/caterpillar_d8t/10.jpeg',
                'assets/caterpillar_d8t/11.jpeg',
                'assets/caterpillar_d8t/12.jpeg',
                'assets/caterpillar_d8t/13.jpeg',
                'assets/caterpillar_d8t/14.jpeg'
            ]
        },
        'cat-d8t-2022': {
            title: 'Tractor Caterpillar D8T',
            tag: 'Venta',
            year: '2022',
            hours: '3,851.7 hrs',
            description: 'Tractor Caterpillar D8T seminuevo con muy pocas horas de uso. Equipado con motor C15, cadenas al 85% de vida útil, cuchilla tipo U de alta capacidad y cabina cerrada climatizada.',
            price: '$708,000 USD NETO',
            specs: {
                'Motor': 'Cat C15 ACERT',
                'Peso Operativo': '37.2 Ton',
                'Potencia': '347 hp',
                'Longitud': '7.8 metros',
                'Altura': '3.4 metros',
                'Ancho': '3.0 metros',
                'Anchura Orugas': '711 mm',
                'Estado Cadenas': '85% de vida útil',
                'Cuchilla': 'Tipo U (MAQUINARIA: General)',
                'Equipamiento': 'Cabina Cerrada con A/C, Suspensión Neumática',
                'Dirección': 'Mandos tipo Joystick',
                'Ubicación': 'Texcoco'
            },
            images: [
                'assets/caterpillar_d8t_2/1.jpeg',
                'assets/caterpillar_d8t_2/2.jpeg',
                'assets/caterpillar_d8t_2/3.jpeg',
                'assets/caterpillar_d8t_2/4.jpeg',
                'assets/caterpillar_d8t_2/5.jpeg',
                'assets/caterpillar_d8t_2/6.jpeg',
                'assets/caterpillar_d8t_2/7.jpeg',
                'assets/caterpillar_d8t_2/8.jpeg',
                'assets/caterpillar_d8t_2/9.jpeg',
                'assets/caterpillar_d8t_2/10.jpeg',
                'assets/caterpillar_d8t_2/11.jpeg',
                'assets/caterpillar_d8t_2/12.jpeg',
                'assets/caterpillar_d8t_2/13.jpeg'
            ]
        }
    };

    // Referencias del Modal
    const specModal = document.getElementById('spec-modal');
    const modalCloseBtn = document.getElementById('modal-close');
    const modalSlides = document.getElementById('modal-carousel-slides');
    const modalIndicators = document.getElementById('modal-carousel-indicators');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');

    const modalTag = document.getElementById('modal-tag');
    const modalTitle = document.getElementById('modal-title');
    const modalSubtitle = document.getElementById('modal-subtitle');
    const modalDesc = document.getElementById('modal-description');
    const modalSpecsTable = document.getElementById('modal-specs-table');
    const modalPrice = document.getElementById('modal-price');
    const inquireBtn = document.getElementById('modal-inquire-btn');

    let currentSlide = 0;
    let currentImages = [];
    let activeId = null;

    // Actualizar posición del Carrusel
    function updateCarousel() {
        if (!modalSlides) return;
        modalSlides.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        // Actualizar indicadores
        const dots = modalIndicators.querySelectorAll('.carousel-indicator');
        dots.forEach((dot, index) => {
            if (index === currentSlide) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    // Inicializar navegación del Carrusel
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (currentImages.length <= 1) return;
            currentSlide = (currentSlide - 1 + currentImages.length) % currentImages.length;
            updateCarousel();
        });

        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (currentImages.length <= 1) return;
            currentSlide = (currentSlide + 1) % currentImages.length;
            updateCarousel();
        });
    }

    // Abrir Modal
    function openModal(id) {
        const data = machineryData[id];
        if (!data) return;

        activeId = id;
        currentSlide = 0;
        currentImages = data.images;

        // Rellenar información de textos
        if (modalTag) modalTag.textContent = data.tag;
        if (modalTitle) modalTitle.textContent = data.title;
        if (modalSubtitle) modalSubtitle.textContent = `Año: ${data.year} | Horas: ${data.hours}`;
        if (modalDesc) modalDesc.textContent = data.description;
        if (modalPrice) modalPrice.textContent = data.price;

        // Rellenar tabla técnica
        if (modalSpecsTable) {
            modalSpecsTable.innerHTML = '';
            Object.entries(data.specs).forEach(([key, value]) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <th class="font-bold text-white uppercase tracking-wider text-[10px] w-[35%] align-top text-left">${key}</th>
                    <td class="text-gray-400 text-xs">${value}</td>
                `;
                modalSpecsTable.appendChild(tr);
            });
        }

        // Crear slides de imágenes
        if (modalSlides) {
            modalSlides.innerHTML = '';
            currentImages.forEach((imgSrc) => {
                const slide = document.createElement('div');
                slide.className = 'carousel-slide';
                slide.innerHTML = `<img src="${imgSrc}" alt="${data.title}" class="w-full h-full object-cover">`;
                modalSlides.appendChild(slide);
            });
            modalSlides.style.transform = 'translateX(0)';
        }

        // Crear indicadores del Carrusel
        if (modalIndicators) {
            modalIndicators.innerHTML = '';
            if (currentImages.length > 1) {
                currentImages.forEach((_, index) => {
                    const dot = document.createElement('div');
                    dot.className = `carousel-indicator ${index === 0 ? 'active' : ''}`;
                    dot.addEventListener('click', (e) => {
                        e.stopPropagation();
                        currentSlide = index;
                        updateCarousel();
                    });
                    modalIndicators.appendChild(dot);
                });
                if (prevBtn) prevBtn.style.display = 'flex';
                if (nextBtn) nextBtn.style.display = 'flex';
            } else {
                if (prevBtn) prevBtn.style.display = 'none';
                if (nextBtn) nextBtn.style.display = 'none';
            }
        }

        // Mostrar Backdrop
        if (specModal) {
            specModal.classList.add('active');
            document.body.classList.add('overflow-hidden');
        }
    }

    // Cerrar Modal
    function closeModal() {
        if (specModal) {
            specModal.classList.remove('active');
            document.body.classList.remove('overflow-hidden');
        }
        activeId = null;
    }

    // Event listeners para abrir modal en clics de tarjetas o botones
    document.addEventListener('click', (e) => {
        const trigger = e.target.closest('[data-open-modal]');
        if (trigger) {
            e.preventDefault();
            const id = trigger.getAttribute('data-open-modal');
            openModal(id);
        }
    });

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    }

    if (specModal) {
        specModal.addEventListener('click', (e) => {
            if (e.target === specModal) {
                closeModal();
            }
        });
    }

    // Escuchar tecla Esc para cerrar modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });

    // Acción de "Me interesa este equipo" (Pre-llenar contacto)
    if (inquireBtn) {
        inquireBtn.addEventListener('click', () => {
            if (!activeId) return;
            const data = machineryData[activeId];
            if (!data) return;

            closeModal();

            const messageInput = document.getElementById('contact-message');
            if (messageInput) {
                // Pre-llenar textarea
                messageInput.value = `Hola, estoy interesado en adquirir el equipo: ${data.title} (${data.tag}, Año ${data.year}, con ${data.hours} de uso) anunciado en ${data.price}. Solicito ficha técnica completa e información para proceder.`;
                
                // Desplazamiento suave al formulario
                const contactSection = document.getElementById('contacto');
                if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                    
                    // Focalizar primer campo del formulario tras scroll
                    setTimeout(() => {
                        const nameInput = document.getElementById('contact-name');
                        if (nameInput) {
                            nameInput.focus();
                        }
                    }, 800);
                }
            }
        });
    }
});
