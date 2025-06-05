/**
 * Prezzly Frontend Scripts
 * Sostituisce le funzionalità di Foundation 5 con JavaScript vanilla moderno
 */

(function() {
    'use strict';

    // Utility per rilevare se è mobile
    const isMobile = () => window.innerWidth <= 768;

    // Utility per debouncing
    const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    /**
     * Gestione Dropdown Menu
     */
    class DropdownManager {
        constructor() {
            this.dropdowns = document.querySelectorAll('.dropdown-item');
            this.loadCatDone = []; // Array per tracciare le categorie caricate
            this.init();
        }

        init() {
            this.dropdowns.forEach(dropdown => {
                const toggle = dropdown.querySelector('.dropdown-toggle');
                const menu = dropdown.querySelector('.dropdown-menu');

                if (toggle && menu) {
                    // Gestione click
                    toggle.addEventListener('click', (e) => {
                        e.preventDefault();
                        
                        // Carica categorie se necessario
                        const categoryId = toggle.getAttribute('data-category');
                        if (categoryId !== null) {
                            this.loadCategories(categoryId);
                        }
                        
                        this.toggleDropdown(dropdown);
                    });

                    // Gestione hover su desktop
                    if (!isMobile()) {
                        dropdown.addEventListener('mouseenter', () => {
                            this.showDropdown(dropdown);
                        });

                        dropdown.addEventListener('mouseleave', () => {
                            this.hideDropdown(dropdown);
                        });
                    }
                }
            });

            // Chiudi dropdown cliccando fuori
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.dropdown-item')) {
                    this.hideAllDropdowns();
                }
            });

            // Gestione tasto ESC
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.hideAllDropdowns();
                }
            });
        }

        toggleDropdown(dropdown) {
            const menu = dropdown.querySelector('.dropdown-menu');
            const isOpen = menu.classList.contains('show');

            this.hideAllDropdowns();

            if (!isOpen) {
                this.showDropdown(dropdown);
            }
        }

        showDropdown(dropdown) {
            const menu = dropdown.querySelector('.dropdown-menu');
            menu.classList.add('show');
            
            // Accessibilità
            const toggle = dropdown.querySelector('.dropdown-toggle');
            toggle.setAttribute('aria-expanded', 'true');
        }

        hideDropdown(dropdown) {
            const menu = dropdown.querySelector('.dropdown-menu');
            menu.classList.remove('show');
            
            // Accessibilità
            const toggle = dropdown.querySelector('.dropdown-toggle');
            toggle.setAttribute('aria-expanded', 'false');
        }

        hideAllDropdowns() {
            this.dropdowns.forEach(dropdown => {
                this.hideDropdown(dropdown);
            });
        }

        loadCategories(id) {
            if (this.loadCatDone[id]) return;
            
            const menuElement = document.getElementById(`menu_cat${id}`);
            if (!menuElement) return;
            
            // Mostra loading
            menuElement.innerHTML = '<li><div class="loading-spinner"></div></li>';
            
            // Estrai il baseHREF dal primo script tag che lo contiene
            const scripts = document.querySelectorAll('script');
            let baseHREF = '';
            for (let script of scripts) {
                if (script.textContent && script.textContent.includes('searchJSON.php')) {
                    const match = script.textContent.match(/url:\s*["']([^"']*?)searchJSON\.php/);
                    if (match) {
                        baseHREF = match[1];
                        break;
                    }
                }
            }
            
            // Fallback se non troviamo il baseHREF
            if (!baseHREF) {
                baseHREF = window.location.origin + '/';
            }
            
            // Carica le categorie
            fetch(`${baseHREF}html/menu_categories.php?parent=${id}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.text();
                })
                .then(data => {
                    menuElement.innerHTML = data;
                    this.loadCatDone[id] = true;
                })
                .catch(error => {
                    console.error('Errore nel caricamento delle categorie:', error);
                    menuElement.innerHTML = '<li><a href="#">Errore nel caricamento</a></li>';
                });
        }
    }

    /**
     * Gestione Ricerca Migliorata
     */
    class SearchManager {
        constructor() {
            this.searchForm = document.getElementById('search');
            this.searchInput = document.getElementById('q');
            this.searchWrapper = document.querySelector('.search-input-group');
            this.init();
        }

        init() {
            if (!this.searchForm || !this.searchInput) return;

            // Prevenire form duplicati
            this.preventDuplicateForms();

            // Gestione submit form
            this.searchForm.addEventListener('submit', (e) => {
                const query = this.searchInput.value.trim();
                if (!query) {
                    e.preventDefault();
                    this.showError('Inserisci un termine di ricerca');
                    return;
                }
            });

            // Gestione focus migliorata
            this.setupFocusHandling();
            
            // Fix per autocomplete jQuery UI
            this.setupAutocompleteEnhancements();
        }

        preventDuplicateForms() {
            // Rimuovi eventuali form duplicati che potrebbero apparire
            const forms = document.querySelectorAll('#search');
            if (forms.length > 1) {
                for (let i = 1; i < forms.length; i++) {
                    forms[i].remove();
                }
            }

            // Assicurati che il form sia unico
            if (this.searchForm) {
                this.searchForm.setAttribute('data-search-form', 'primary');
            }
        }

        setupFocusHandling() {
            if (!this.searchInput || !this.searchWrapper) return;

            // Focus enhancement
            this.searchInput.addEventListener('focus', () => {
                this.searchWrapper.classList.add('focused');
                this.searchInput.closest('.search-input-wrapper').classList.add('focused');
            });

            this.searchInput.addEventListener('blur', () => {
                // Ritarda la rimozione per permettere il click sui suggerimenti
                setTimeout(() => {
                    this.searchWrapper.classList.remove('focused');
                    this.searchInput.closest('.search-input-wrapper').classList.remove('focused');
                }, 200);
            });

            // Prevenire doppio click sui container
            this.searchWrapper.addEventListener('click', (e) => {
                if (e.target === this.searchWrapper) {
                    this.searchInput.focus();
                }
            });
        }

        setupAutocompleteEnhancements() {
            // Aspetta che jQuery UI sia disponibile
            if (typeof $ !== 'undefined' && $.fn.autocomplete) {
                $(this.searchInput).on('autocompleteopen', () => {
                    // Assicurati che l'autocomplete appaia sopra tutto
                    $('.ui-autocomplete').css('z-index', 10000);
                });

                $(this.searchInput).on('autocompleteclose', () => {
                    // Rimuovi il focus quando l'autocomplete si chiude
                    this.searchWrapper.classList.remove('focused');
                });

                // Fix per posizionamento autocomplete
                $(this.searchInput).on('autocompletefocus', function(event, ui) {
                    // Prevenire che il valore venga inserito durante la navigazione
                    event.preventDefault();
                });
            }
        }

        showError(message) {
            // Rimuovi errori precedenti
            const existingError = document.querySelector('.search-error');
            if (existingError) {
                existingError.remove();
            }

            // Crea nuovo messaggio di errore
            const errorDiv = document.createElement('div');
            errorDiv.className = 'search-error';
            errorDiv.textContent = message;
            errorDiv.style.cssText = `
                color: #dc3545;
                font-size: 14px;
                margin-top: 5px;
                padding: 5px;
                border-radius: 4px;
                background: #f8d7da;
                text-align: center;
                animation: slideIn 0.3s ease-out;
            `;

            // Inserisci dopo il form
            this.searchForm.parentNode.insertBefore(errorDiv, this.searchForm.nextSibling);

            // Rimuovi dopo 3 secondi
            setTimeout(() => {
                if (errorDiv.parentNode) {
                    errorDiv.style.animation = 'slideOut 0.3s ease-out';
                    setTimeout(() => errorDiv.remove(), 300);
                }
            }, 3000);

            // Focus sull'input
            this.searchInput.focus();
        }
    }

    /**
     * Gestione Newsletter
     */
    class NewsletterManager {
        constructor() {
            this.form = document.querySelector('.newsletter-form');
            this.init();
        }

        init() {
            if (!this.form) return;

            this.form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSubmit(e);
            });
        }

        async handleSubmit(e) {
            const formData = new FormData(this.form);
            const email = formData.get('email') || this.form.querySelector('input[type="email"]').value;

            if (!this.isValidEmail(email)) {
                this.showMessage('Inserisci un indirizzo email valido', 'error');
                return;
            }

            try {
                // Qui andrà la chiamata AJAX per iscrivere alla newsletter
                // Per ora mostriamo solo un messaggio di successo
                this.showMessage('Iscrizione completata con successo!', 'success');
                this.form.reset();
            } catch (error) {
                this.showMessage('Errore durante l\'iscrizione. Riprova più tardi.', 'error');
            }
        }

        isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }

        showMessage(message, type) {
            // Rimuovi messaggi precedenti
            const existingMessage = document.querySelector('.newsletter-message');
            if (existingMessage) {
                existingMessage.remove();
            }

            // Crea nuovo messaggio
            const messageDiv = document.createElement('div');
            messageDiv.className = 'newsletter-message';
            messageDiv.textContent = message;
            
            const bgColor = type === 'success' ? '#d4edda' : '#f8d7da';
            const textColor = type === 'success' ? '#155724' : '#721c24';
            
            messageDiv.style.cssText = `
                background: ${bgColor};
                color: ${textColor};
                padding: 10px;
                margin-top: 10px;
                border-radius: 4px;
                text-align: center;
                animation: slideIn 0.3s ease-out;
            `;

            this.form.appendChild(messageDiv);

            // Rimuovi dopo 5 secondi
            setTimeout(() => {
                messageDiv.style.animation = 'slideOut 0.3s ease-out';
                setTimeout(() => messageDiv.remove(), 300);
            }, 5000);
        }
    }

    /**
     * Gestione Responsive
     */
    class ResponsiveManager {
        constructor() {
            this.init();
        }

        init() {
            // Gestione resize window
            window.addEventListener('resize', debounce(() => {
                this.handleResize();
            }, 250));

            // Inizializzazione
            this.handleResize();
        }

        handleResize() {
            // Aggiorna classi CSS per responsive
            document.body.classList.toggle('is-mobile', isMobile());
            
            // Chiudi dropdown su resize se diventa mobile
            if (isMobile()) {
                document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
                    menu.classList.remove('show');
                });
            }
        }
    }

    /**
     * Gestione Accessibilità
     */
    class AccessibilityManager {
        constructor() {
            this.init();
        }

        init() {
            // Gestione navigazione da tastiera
            document.addEventListener('keydown', (e) => {
                // Tab trap per dropdown aperti
                if (e.key === 'Tab') {
                    this.handleTabKey(e);
                }
            });

            // Miglioramento focus per elementi interattivi
            this.enhanceFocusManagement();
        }

        handleTabKey(e) {
            const openDropdown = document.querySelector('.dropdown-menu.show');
            if (openDropdown) {
                const focusableElements = openDropdown.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        }

        enhanceFocusManagement() {
            // Evidenzia meglio il focus per navigazione da tastiera
            document.addEventListener('keydown', () => {
                document.body.classList.add('keyboard-navigation');
            });

            document.addEventListener('mousedown', () => {
                document.body.classList.remove('keyboard-navigation');
            });
        }
    }

    /**
     * Gestione Smooth Scroll
     */
    class SmoothScrollManager {
        constructor() {
            this.init();
        }

        init() {
            // Smooth scroll per anchor links
            document.addEventListener('click', (e) => {
                const target = e.target.closest('a[href^="#"]');
                if (target) {
                    const href = target.getAttribute('href');
                    if (href !== '#' && href.length > 1) {
                        const element = document.querySelector(href);
                        if (element) {
                            e.preventDefault();
                            this.scrollToElement(element);
                        }
                    }
                }
            });
        }

        scrollToElement(element) {
            const headerHeight = 80; // Altezza header approssimativa
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - headerHeight;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }

    /**
     * Performance Optimization
     */
    class PerformanceManager {
        constructor() {
            this.init();
        }

        init() {
            // Lazy loading per immagini (se necessario)
            this.initLazyLoading();
            
            // Preload dei link importanti
            this.initLinkPreloading();
        }

        initLazyLoading() {
            if ('IntersectionObserver' in window) {
                const images = document.querySelectorAll('img[data-src]');
                const imageObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            img.src = img.dataset.src;
                            img.classList.remove('lazy');
                            imageObserver.unobserve(img);
                        }
                    });
                });

                images.forEach(img => imageObserver.observe(img));
            }
        }

        initLinkPreloading() {
            // Preload dei link al hover (solo su desktop)
            if (!isMobile()) {
                document.addEventListener('mouseover', (e) => {
                    const link = e.target.closest('a[href]');
                    if (link && link.hostname === window.location.hostname) {
                        this.preloadLink(link.href);
                    }
                });
            }
        }

        preloadLink(href) {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = href;
            document.head.appendChild(link);
        }
    }

    /**
     * Gestione Form Recensioni
     */
    class ReviewManager {
        constructor() {
            this.reviewForm = document.getElementById('reviewForm');
            this.init();
        }

        init() {
            if (!this.reviewForm) return;

            // Gestione submit form recensioni
            this.reviewForm.addEventListener('submit', (e) => {
                this.handleReviewSubmit(e);
            });

            // Gestione rating select con preview
            const ratingSelect = document.getElementById('rating');
            if (ratingSelect) {
                this.setupRatingPreview(ratingSelect);
            }
        }

        handleReviewSubmit(e) {
            const ratingSelect = document.getElementById('rating');
            const confirmField = document.getElementById('confirm');
            
            if (ratingSelect && confirmField) {
                confirmField.value = ratingSelect.value;
            }

            // Validazione opzionale
            const commentsField = document.getElementById('comments');
            if (commentsField && commentsField.value.length > 500) {
                e.preventDefault();
                this.showMessage('Il commento è troppo lungo (max 500 caratteri)', 'error');
                return;
            }

            // Mostra feedback di invio
            this.showSubmitFeedback();
        }

        setupRatingPreview(ratingSelect) {
            // Crea preview stelle
            const preview = document.createElement('div');
            preview.className = 'rating-preview';
            preview.innerHTML = '<span class="preview-label">Anteprima: </span><span class="preview-stars"></span>';
            
            ratingSelect.parentNode.appendChild(preview);

            // Aggiorna preview al cambio
            ratingSelect.addEventListener('change', () => {
                this.updateRatingPreview(ratingSelect.value, preview.querySelector('.preview-stars'));
            });

            // Inizializza con valore corrente
            this.updateRatingPreview(ratingSelect.value, preview.querySelector('.preview-stars'));
        }

        updateRatingPreview(rating, container) {
            const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
            container.textContent = stars;
            container.style.color = '#ffc107';
        }

        showSubmitFeedback() {
            const submitBtn = this.reviewForm.querySelector('.submit-review-btn');
            if (submitBtn) {
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Invio in corso...';
                submitBtn.disabled = true;

                // Ripristina dopo un po' (se non viene reindirizzato)
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 3000);
            }
        }

        showMessage(message, type) {
            const existingMessage = this.reviewForm.querySelector('.review-message');
            if (existingMessage) {
                existingMessage.remove();
            }

            const messageDiv = document.createElement('div');
            messageDiv.className = 'review-message';
            messageDiv.textContent = message;
            
            const bgColor = type === 'success' ? '#d4edda' : '#f8d7da';
            const textColor = type === 'success' ? '#155724' : '#721c24';
            
            messageDiv.style.cssText = `
                background: ${bgColor};
                color: ${textColor};
                padding: 10px;
                margin: 10px 0;
                border-radius: 4px;
                animation: slideIn 0.3s ease-out;
            `;

            this.reviewForm.insertBefore(messageDiv, this.reviewForm.firstChild);

            setTimeout(() => {
                messageDiv.remove();
            }, 5000);
        }
    }

    /**
     * Gestione Lazy Loading Immagini
     */
    class ImageManager {
        constructor() {
            this.init();
        }

        init() {
            // Lazy loading per immagini prodotti
            if ('IntersectionObserver' in window) {
                this.setupLazyLoading();
            }

            // Gestione errori immagini
            this.setupImageErrorHandling();
        }

        setupLazyLoading() {
            const images = document.querySelectorAll('img[loading="lazy"]');
            
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        this.loadImage(img);
                        imageObserver.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px'
            });

            images.forEach(img => {
                imageObserver.observe(img);
            });
        }

        loadImage(img) {
            img.style.transition = 'opacity 0.3s';
            img.style.opacity = '0';
            
            const tempImg = new Image();
            tempImg.onload = () => {
                img.src = tempImg.src;
                img.style.opacity = '1';
            };
            tempImg.src = img.src;
        }

        setupImageErrorHandling() {
            document.addEventListener('error', (e) => {
                if (e.target.tagName === 'IMG') {
                    this.handleImageError(e.target);
                }
            }, true);
        }

        handleImageError(img) {
            // Sostituisci con placeholder
            const placeholder = document.createElement('div');
            placeholder.className = 'image-error-placeholder';
            placeholder.innerHTML = '<i class="fas fa-image"></i><span>Immagine non disponibile</span>';
            placeholder.style.cssText = `
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                background: #f8f9fa;
                color: #6c757d;
                width: 100%;
                height: 100%;
                min-height: 120px;
                border-radius: 4px;
            `;
            
            img.parentNode.replaceChild(placeholder, img);
        }
    }

    /**
     * Gestione Shopping List Interattiva
     */
    class ShoppingListManager {
        constructor() {
            this.init();
        }

        init() {
            // Gestione click su link shopping list
            document.addEventListener('click', (e) => {
                const shoppingLink = e.target.closest('.shopping-list-link');
                if (shoppingLink && shoppingLink.href.includes('add=')) {
                    this.handleAddToShoppingList(e, shoppingLink);
                }
            });
        }

        handleAddToShoppingList(e, link) {
            e.preventDefault();
            
            // Mostra feedback immediato
            const originalContent = link.innerHTML;
            link.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Aggiunta...';
            
            // Simula aggiunta (in realtà farà la richiesta vera)
            setTimeout(() => {
                // Aggiorna l'interfaccia per mostrare che è stata aggiunta
                link.classList.remove('add-to-list');
                link.classList.add('in-list');
                link.innerHTML = '<i class="fas fa-check"></i> Nella Lista';
                
                // Aggiorna href per rimuovere il parametro add
                link.href = link.href.split('?')[0];
                
                // Mostra notifica di successo
                this.showNotification('Prodotto aggiunto alla lista della spesa!', 'success');
            }, 500);
        }

        showNotification(message, type) {
            // Rimuovi notifiche esistenti
            const existing = document.querySelector('.shopping-notification');
            if (existing) {
                existing.remove();
            }

            // Crea notifica
            const notification = document.createElement('div');
            notification.className = 'shopping-notification';
            notification.textContent = message;
            
            const bgColor = type === 'success' ? '#28a745' : '#dc3545';
            
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${bgColor};
                color: white;
                padding: 15px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                z-index: 10000;
                animation: slideInRight 0.3s ease-out;
            `;

            document.body.appendChild(notification);

            // Rimuovi dopo 3 secondi
            setTimeout(() => {
                notification.style.animation = 'slideOutRight 0.3s ease-out';
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }
    }

    /**
     * Gestione Filtri Avanzati
     */
    class FiltersManager {
        constructor() {
            this.filtersForm = document.getElementById('refine');
            this.init();
        }

        init() {
            if (!this.filtersForm) return;

            // Gestione auto-submit filtri con debounce
            this.setupAutoSubmit();
            
            // Gestione reset filtri
            this.setupResetFilters();
            
            // Gestione indicatori filtri attivi
            this.setupActiveFiltersIndicator();
        }

        setupAutoSubmit() {
            const inputs = this.filtersForm.querySelectorAll('select, input[type="number"]');
            
            inputs.forEach(input => {
                if (input.type === 'number') {
                    // Debounce per input numerici
                    input.addEventListener('input', debounce(() => {
                        this.submitFilters();
                    }, 1000));
                } else {
                    // Submit immediato per select
                    input.addEventListener('change', () => {
                        this.submitFilters();
                    });
                }
            });
        }

        setupResetFilters() {
            // Aggiungi pulsante reset se non esiste
            let resetBtn = this.filtersForm.querySelector('.filters-reset-btn');
            if (!resetBtn) {
                resetBtn = document.createElement('button');
                resetBtn.type = 'button';
                resetBtn.className = 'filters-reset-btn';
                resetBtn.innerHTML = '<i class="fas fa-times"></i> Azzera Filtri';
                resetBtn.style.cssText = `
                    background: #6c757d;
                    color: white;
                    border: none;
                    padding: 8px 12px;
                    border-radius: 4px;
                    font-size: 12px;
                    cursor: pointer;
                    margin-top: 10px;
                `;
                
                const submitGroup = this.filtersForm.querySelector('.filter-submit-group');
                if (submitGroup) {
                    submitGroup.appendChild(resetBtn);
                }
            }

            resetBtn.addEventListener('click', () => {
                this.resetFilters();
            });
        }

        setupActiveFiltersIndicator() {
            // Mostra indicatore di filtri attivi
            this.updateActiveFiltersIndicator();
            
            // Aggiorna quando cambiano i filtri
            const inputs = this.filtersForm.querySelectorAll('select, input[type="number"]');
            inputs.forEach(input => {
                input.addEventListener('change', () => {
                    this.updateActiveFiltersIndicator();
                });
            });
        }

        updateActiveFiltersIndicator() {
            const inputs = this.filtersForm.querySelectorAll('select, input[type="number"]');
            let activeCount = 0;

            inputs.forEach(input => {
                if (input.value && input.value !== '') {
                    activeCount++;
                }
            });

            // Aggiorna contatore nel pulsante filtri mobile
            const mobileToggle = document.querySelector('.filters-toggle-btn');
            if (mobileToggle) {
                const text = mobileToggle.textContent.split('(')[0].trim();
                if (activeCount > 0) {
                    mobileToggle.innerHTML = `<i class="fas fa-filter"></i> ${text} (${activeCount}) <i class="fas fa-chevron-down toggle-icon"></i>`;
                } else {
                    mobileToggle.innerHTML = `<i class="fas fa-filter"></i> ${text} <i class="fas fa-chevron-down toggle-icon"></i>`;
                }
            }
        }

        submitFilters() {
            // Aggiungi loading state
            const submitBtn = this.filtersForm.querySelector('.filter-submit-btn');
            if (submitBtn) {
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Filtraggio...';
                submitBtn.disabled = true;
                
                // Il form verrà inviato, quindi non serve ripristinare
            }
            
            this.filtersForm.submit();
        }

        resetFilters() {
            // Reset tutti i campi
            const inputs = this.filtersForm.querySelectorAll('select, input[type="number"]');
            inputs.forEach(input => {
                if (input.tagName === 'SELECT') {
                    input.selectedIndex = 0;
                } else {
                    input.value = '';
                }
            });

            // Submit form con filtri resettati
            this.submitFilters();
        }
    }

    /**
     * Gestione A-to-Z Layout
     */
    class AtoZManager {
        constructor() {
            this.navigation = document.querySelector('.atoz-navigation');
            this.sections = document.querySelectorAll('.atoz-letter-section');
            this.navLinks = document.querySelectorAll('.atoz-nav-link');
            this.backToTopBtn = document.querySelector('.back-to-top-btn');
            this.init();
        }

        init() {
            if (!this.navigation || this.sections.length === 0) return;

            // Setup smooth scroll per i link alfabetici
            this.setupSmoothScroll();
            
            // Setup highlight lettera attiva durante scroll
            this.setupActiveLetterHighlight();
            
            // Setup back to top button
            this.setupBackToTop();
            
            // Setup keyboard navigation
            this.setupKeyboardNavigation();
        }

        setupSmoothScroll() {
            this.navLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetId = link.getAttribute('href');
                    const targetElement = document.querySelector(targetId);
                    
                    if (targetElement) {
                        // Calcola offset per navigazione sticky
                        const navigationHeight = this.navigation.offsetHeight;
                        const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                        const offsetPosition = elementPosition - navigationHeight - 20;

                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });

                        // Aggiorna stato attivo
                        this.updateActiveNavLink(link);
                    }
                });
            });
        }

        setupActiveLetterHighlight() {
            if ('IntersectionObserver' in window) {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const sectionId = entry.target.id;
                            const correspondingNavLink = document.querySelector(`a[href="#${sectionId}"]`);
                            if (correspondingNavLink) {
                                this.updateActiveNavLink(correspondingNavLink);
                            }
                        }
                    });
                }, {
                    rootMargin: '-20% 0px -70% 0px'
                });

                this.sections.forEach(section => {
                    observer.observe(section);
                });
            }
        }

        updateActiveNavLink(activeLink) {
            // Rimuovi stato attivo da tutti i link
            this.navLinks.forEach(link => {
                link.classList.remove('active');
            });
            
            // Aggiungi stato attivo al link corrente
            activeLink.classList.add('active');
        }

        setupBackToTop() {
            if (!this.backToTopBtn) return;

            this.backToTopBtn.addEventListener('click', (e) => {
                e.preventDefault();
                
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });

            // Mostra/nascondi in base alla posizione scroll
            let ticking = false;
            
            window.addEventListener('scroll', () => {
                if (!ticking) {
                    requestAnimationFrame(() => {
                        const scrollTop = window.pageYOffset;
                        const showButton = scrollTop > 300;
                        
                        this.backToTopBtn.style.opacity = showButton ? '1' : '0.7';
                        this.backToTopBtn.style.transform = showButton ? 'scale(1)' : 'scale(0.9)';
                        
                        ticking = false;
                    });
                    ticking = true;
                }
            });
        }

        setupKeyboardNavigation() {
            // Navigazione rapida con tastiera (A-Z)
            document.addEventListener('keydown', (e) => {
                // Solo se non stiamo scrivendo in un input
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
                
                const key = e.key.toUpperCase();
                
                // Se è una lettera, cerca la sezione corrispondente
                if (key.match(/[A-Z]/) && key.length === 1) {
                    const targetSection = document.getElementById(`letter-${key.toLowerCase()}`);
                    if (targetSection) {
                        e.preventDefault();
                        
                        // Scroll alla sezione
                        const navigationHeight = this.navigation.offsetHeight;
                        const elementPosition = targetSection.getBoundingClientRect().top + window.pageYOffset;
                        const offsetPosition = elementPosition - navigationHeight - 20;

                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });

                        // Aggiorna stato attivo
                        const correspondingNavLink = document.querySelector(`a[href="#letter-${key.toLowerCase()}"]`);
                        if (correspondingNavLink) {
                            this.updateActiveNavLink(correspondingNavLink);
                        }

                        // Mostra feedback visivo
                        this.showKeyboardFeedback(key);
                    }
                }
            });
        }

        showKeyboardFeedback(letter) {
            // Crea feedback temporaneo per navigazione da tastiera
            const feedback = document.createElement('div');
            feedback.textContent = `Navigato alla lettera: ${letter}`;
            feedback.style.cssText = `
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: var(--primary-color);
                color: white;
                padding: 10px 20px;
                border-radius: 20px;
                z-index: 10000;
                font-weight: 600;
                font-size: 14px;
                animation: slideIn 0.3s ease-out;
            `;

            document.body.appendChild(feedback);

            // Rimuovi dopo 2 secondi
            setTimeout(() => {
                feedback.style.animation = 'slideOut 0.3s ease-out';
                setTimeout(() => feedback.remove(), 300);
            }, 2000);
        }
    }

    /**
     * Gestione Home Categories
     */
    class HomeCategoriesManager {
        constructor() {
            this.categoriesGrid = document.querySelector('.categories-grid');
            this.categoryCards = document.querySelectorAll('.category-card');
            this.init();
        }

        init() {
            if (!this.categoriesGrid) return;

            // Setup gestione click per categorie "coming soon"
            this.setupComingSoonHandling();
            
            // Setup analytics tracking (opzionale)
            this.setupCategoryTracking();
            
            // Setup lazy loading per immagini categorie
            this.setupCategoryImagesLazyLoading();
        }

        setupComingSoonHandling() {
            const comingSoonCards = document.querySelectorAll('.category-card.coming-soon');
            
            comingSoonCards.forEach(card => {
                const link = card.querySelector('.category-link');
                
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    
                    const categoryName = card.getAttribute('data-category');
                    this.showComingSoonMessage(categoryName);
                });
            });
        }

        showComingSoonMessage(categoryName) {
            // Rimuovi messaggi precedenti
            const existingMessage = document.querySelector('.coming-soon-notification');
            if (existingMessage) {
                existingMessage.remove();
            }

            // Crea notifica
            const notification = document.createElement('div');
            notification.className = 'coming-soon-notification';
            notification.innerHTML = `
                <div class="notification-content">
                    <i class="fas fa-clock"></i>
                    <div class="notification-text">
                        <strong>${categoryName}</strong> sarà disponibile a breve!
                        <br><small>Ti avviseremo quando sarà attiva.</small>
                    </div>
                    <button type="button" class="close-notification">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
            
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--warning-color);
                color: #856404;
                border: 1px solid #ffeaa7;
                border-radius: 8px;
                z-index: 10000;
                animation: slideInRight 0.3s ease-out;
                max-width: 300px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            `;

            document.body.appendChild(notification);

            // Setup close button
            const closeBtn = notification.querySelector('.close-notification');
            closeBtn.addEventListener('click', () => {
                notification.style.animation = 'slideOutRight 0.3s ease-out';
                setTimeout(() => notification.remove(), 300);
            });

            // Auto-remove dopo 4 secondi
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.style.animation = 'slideOutRight 0.3s ease-out';
                    setTimeout(() => notification.remove(), 300);
                }
            }, 4000);
        }

        setupCategoryTracking() {
            // Tracking per analytics (Google Analytics, etc.)
            this.categoryCards.forEach(card => {
                const link = card.querySelector('.category-link');
                const categoryName = card.getAttribute('data-category');
                
                link.addEventListener('click', () => {
                    // Invia evento di tracking
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'category_click', {
                            'category_name': categoryName,
                            'event_category': 'navigation'
                        });
                    }
                    
                    console.log(`📊 Category clicked: ${categoryName}`);
                });
            });
        }

        setupCategoryImagesLazyLoading() {
            // Lazy loading già gestito dal browser con loading="lazy"
            // Ma possiamo aggiungere fallback per browser più vecchi
            if ('IntersectionObserver' in window) {
                const imageObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            
                            // Aggiungi classe per animazione fade-in
                            img.style.transition = 'opacity 0.3s';
                            img.style.opacity = '0';
                            
                            img.onload = () => {
                                img.style.opacity = '1';
                            };
                            
                            imageObserver.unobserve(img);
                        }
                    });
                });

                const categoryImages = document.querySelectorAll('.category-image');
                categoryImages.forEach(img => {
                    imageObserver.observe(img);
                });
            }
        }
    }

    /**
     * Gestione Shopping List Avanzata
     */
    class ShoppingListAdvancedManager {
        constructor() {
            this.shoppingSection = document.querySelector('.shopping-list-section');
            this.removeLinks = document.querySelectorAll('.remove-btn');
            this.notifications = document.querySelectorAll('.shopping-list-notification');
            this.init();
        }

        init() {
            if (!this.shoppingSection) return;

            // Setup conferma rimozione con UX migliorata
            this.setupRemoveConfirmation();
            
            // Setup gestione notifiche
            this.setupNotificationsHandling();
            
            // Setup monitoraggio variazioni prezzi
            this.setupPriceChangeHighlight();
            
            // Setup auto-refresh (opzionale)
            this.setupAutoRefresh();
        }

        setupRemoveConfirmation() {
            this.removeLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    
                    const productName = this.getProductNameFromUrl(link.href);
                    this.showRemoveConfirmation(productName, link.href);
                });
            });
        }

        getProductNameFromUrl(url) {
            const urlParams = new URLSearchParams(url.split('?')[1]);
            return decodeURIComponent(urlParams.get('remove') || 'questo prodotto');
        }

        showRemoveConfirmation(productName, removeUrl) {
            // Crea modal di conferma moderno
            const modal = document.createElement('div');
            modal.className = 'remove-confirmation-modal';
            modal.innerHTML = `
                <div class="modal-overlay"></div>
                <div class="modal-content">
                    <div class="modal-header">
                        <i class="fas fa-exclamation-triangle"></i>
                        <h3>Conferma Rimozione</h3>
                    </div>
                    <div class="modal-body">
                        <p>Sei sicuro di voler rimuovere <strong>"${productName}"</strong> dalla tua lista della spesa?</p>
                        <small>Questa azione non può essere annullata.</small>
                    </div>
                    <div class="modal-actions">
                        <button type="button" class="cancel-btn">Annulla</button>
                        <button type="button" class="confirm-btn">Rimuovi</button>
                    </div>
                </div>
            `;
            
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: fadeIn 0.3s ease-out;
            `;

            document.body.appendChild(modal);
            document.body.style.overflow = 'hidden';

            // Setup azioni modal
            const cancelBtn = modal.querySelector('.cancel-btn');
            const confirmBtn = modal.querySelector('.confirm-btn');
            const overlay = modal.querySelector('.modal-overlay');

            const closeModal = () => {
                modal.style.animation = 'fadeOut 0.3s ease-out';
                document.body.style.overflow = '';
                setTimeout(() => modal.remove(), 300);
            };

            cancelBtn.addEventListener('click', closeModal);
            overlay.addEventListener('click', closeModal);
            
            confirmBtn.addEventListener('click', () => {
                // Mostra loading
                confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Rimozione...';
                confirmBtn.disabled = true;
                
                // Procedi con la rimozione
                setTimeout(() => {
                    window.location.href = removeUrl;
                }, 500);
            });

            // Gestione ESC key
            const handleEsc = (e) => {
                if (e.key === 'Escape') {
                    closeModal();
                    document.removeEventListener('keydown', handleEsc);
                }
            };
            document.addEventListener('keydown', handleEsc);
        }

        setupNotificationsHandling() {
            this.notifications.forEach(notification => {
                const closeBtn = notification.querySelector('.close-notification');
                
                if (closeBtn) {
                    closeBtn.addEventListener('click', () => {
                        notification.style.animation = 'slideOut 0.3s ease-out';
                        setTimeout(() => {
                            notification.style.display = 'none';
                        }, 300);
                    });
                }

                // Auto-hide dopo 8 secondi
                setTimeout(() => {
                    if (notification.style.display !== 'none') {
                        notification.style.animation = 'slideOut 0.3s ease-out';
                        setTimeout(() => {
                            notification.style.display = 'none';
                        }, 300);
                    }
                }, 8000);
            });
        }

        setupPriceChangeHighlight() {
            // Evidenzia variazioni prezzi significative
            const priceChanges = document.querySelectorAll('.price-change');
            
            priceChanges.forEach(change => {
                if (change.classList.contains('price-down')) {
                    // Animazione per prezzi in calo
                    change.style.animation = 'pulse 2s infinite';
                } else if (change.classList.contains('price-up')) {
                    // Evidenzia aumenti di prezzo
                    change.style.fontWeight = '700';
                }
            });
        }

        setupAutoRefresh() {
            // Auto-refresh ogni 5 minuti per aggiornare prezzi
            const refreshInterval = 5 * 60 * 1000; // 5 minuti
            
            setInterval(() => {
                // Solo se la pagina è visibile
                if (!document.hidden) {
                    this.checkForPriceUpdates();
                }
            }, refreshInterval);
        }

        checkForPriceUpdates() {
            // Implementazione per controllo aggiornamenti prezzi via AJAX
            console.log('🔄 Controllo aggiornamenti prezzi...');
            
            // Qui andrà la logica per fare una chiamata AJAX
            // per controllare se ci sono stati cambiamenti nei prezzi
            // e aggiornare l'interfaccia di conseguenza
        }
    }

    /**
     * Gestione Vendor/Merchant Page
     */
    class VendorManager {
        constructor() {
            this.vendorSection = document.querySelector('.vendor-page-section');
            this.contactButtons = document.querySelectorAll('.contact-btn');
            this.vendorBanner = document.querySelector('.vendor-banner-image');
            this.vendorLogo = document.querySelector('.vendor-logo-image');
            this.init();
        }

        init() {
            if (!this.vendorSection) return;

            // Setup analytics tracking per contatti
            this.setupContactTracking();
            
            // Setup lazy loading per banner
            this.setupBannerOptimization();
            
            // Setup gestione errori immagini
            this.setupImageErrorHandling();
            
            // Setup scroll effects
            this.setupScrollEffects();
            
            // Setup click-to-call migliorato
            this.setupEnhancedCalling();
        }

        setupContactTracking() {
            this.contactButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    const actionType = this.getContactActionType(button);
                    const vendorName = this.getVendorName();
                    
                    // Analytics tracking
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'vendor_contact', {
                            'contact_method': actionType,
                            'vendor_name': vendorName,
                            'event_category': 'vendor_interaction'
                        });
                    }
                    
                    // Visual feedback
                    this.showContactFeedback(button, actionType);
                    
                    console.log(`📞 Contact action: ${actionType} for ${vendorName}`);
                });
            });
        }

        getContactActionType(button) {
            if (button.classList.contains('phone-btn')) return 'phone';
            if (button.classList.contains('whatsapp-btn')) return 'whatsapp';
            if (button.classList.contains('email-btn')) return 'email';
            if (button.classList.contains('primary-btn')) return 'website';
            return 'unknown';
        }

        getVendorName() {
            const titleElement = document.querySelector('.vendor-hero-title');
            return titleElement ? titleElement.textContent : 'Unknown Vendor';
        }

        showContactFeedback(button, actionType) {
            // Salva contenuto originale
            const originalContent = button.innerHTML;
            
            // Mostra feedback in base al tipo di contatto
            let feedbackContent = '';
            switch (actionType) {
                case 'phone':
                    feedbackContent = '<i class="fas fa-phone fa-pulse"></i><div class="btn-content"><span class="btn-label">Chiamata in corso...</span><small class="btn-description">Connessione telefonica</small></div>';
                    break;
                case 'whatsapp':
                    feedbackContent = '<i class="fab fa-whatsapp fa-pulse"></i><div class="btn-content"><span class="btn-label">Apertura WhatsApp...</span><small class="btn-description">Reindirizzamento in corso</small></div>';
                    break;
                case 'email':
                    feedbackContent = '<i class="fas fa-envelope fa-pulse"></i><div class="btn-content"><span class="btn-label">Apertura Email...</span><small class="btn-description">Avvio client email</small></div>';
                    break;
                case 'website':
                    feedbackContent = '<i class="fas fa-globe fa-pulse"></i><div class="btn-content"><span class="btn-label">Reindirizzamento...</span><small class="btn-description">Apertura sito web</small></div>';
                    break;
            }
            
            if (feedbackContent) {
                button.innerHTML = feedbackContent;
                button.style.pointerEvents = 'none';
                
                // Ripristina dopo 2 secondi
                setTimeout(() => {
                    button.innerHTML = originalContent;
                    button.style.pointerEvents = 'auto';
                }, 2000);
            }
        }

        setupBannerOptimization() {
            if (!this.vendorBanner) return;

            // Parallax effect per il banner
            let ticking = false;
            
            const updateBannerPosition = () => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.5;
                
                this.vendorBanner.style.transform = `translateY(${rate}px)`;
                ticking = false;
            };

            window.addEventListener('scroll', () => {
                if (!ticking) {
                    requestAnimationFrame(updateBannerPosition);
                    ticking = true;
                }
            });
        }

        setupImageErrorHandling() {
            // Gestione errore logo
            if (this.vendorLogo) {
                this.vendorLogo.addEventListener('error', () => {
                    const logoContainer = this.vendorLogo.closest('.vendor-logo');
                    const fallback = logoContainer.querySelector('.vendor-logo-fallback');
                    
                    this.vendorLogo.style.display = 'none';
                    if (fallback) {
                        fallback.style.display = 'flex';
                    }
                });
            }

            // Gestione errore banner
            if (this.vendorBanner) {
                this.vendorBanner.addEventListener('error', () => {
                    const bannerContainer = this.vendorBanner.closest('.vendor-banner');
                    bannerContainer.style.background = 'linear-gradient(135deg, var(--primary-color), #1e4080)';
                    bannerContainer.innerHTML = `
                        <div class="banner-fallback">
                            <i class="fas fa-store"></i>
                            <h2>Negozio Verificato</h2>
                        </div>
                    `;
                });
            }
        }

        setupScrollEffects() {
            // Animazioni al scroll per le info cards
            if ('IntersectionObserver' in window) {
                const cardObserver = new IntersectionObserver((entries) => {
                    entries.forEach((entry, index) => {
                        if (entry.isIntersecting) {
                            setTimeout(() => {
                                entry.target.style.opacity = '1';
                                entry.target.style.transform = 'translateY(0)';
                            }, index * 100);
                            cardObserver.unobserve(entry.target);
                        }
                    });
                });

                const infoCards = document.querySelectorAll('.info-card');
                infoCards.forEach(card => {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    card.style.transition = 'all 0.6s ease-out';
                    cardObserver.observe(card);
                });
            }
        }

        setupEnhancedCalling() {
            const phoneButtons = document.querySelectorAll('.phone-btn');
            
            phoneButtons.forEach(button => {
                // Rileva se è mobile per mostrare opzioni aggiuntive
                if (this.isMobileDevice()) {
                    button.addEventListener('click', (e) => {
                        // Su mobile, lascia che il browser gestisca tel:
                        return true;
                    });
                } else {
                    // Su desktop, mostra un messaggio informativo
                    button.addEventListener('click', (e) => {
                        e.preventDefault();
                        
                        const phoneNumber = button.href.replace('tel:', '');
                        this.showDesktopCallInfo(phoneNumber);
                    });
                }
            });
        }

        isMobileDevice() {
            return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        }

        showDesktopCallInfo(phoneNumber) {
            // Crea notifica per desktop con numero di telefono
            const notification = document.createElement('div');
            notification.className = 'desktop-call-notification';
            notification.innerHTML = `
                <div class="notification-content">
                    <i class="fas fa-phone"></i>
                    <div class="notification-text">
                        <strong>Numero di Telefono</strong>
                        <span>${phoneNumber}</span>
                        <small>Chiama da un dispositivo mobile o copia il numero</small>
                    </div>
                    <button type="button" class="copy-number-btn" data-number="${phoneNumber}">
                        <i class="fas fa-copy"></i>
                    </button>
                    <button type="button" class="close-notification">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
            
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                border: 1px solid var(--border-color);
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.2);
                z-index: 10000;
                max-width: 350px;
                animation: slideInRight 0.3s ease-out;
            `;

            document.body.appendChild(notification);

            // Setup copy button
            const copyBtn = notification.querySelector('.copy-number-btn');
            copyBtn.addEventListener('click', async () => {
                try {
                    await navigator.clipboard.writeText(phoneNumber);
                    copyBtn.innerHTML = '<i class="fas fa-check"></i>';
                    copyBtn.style.background = 'var(--success-color)';
                    
                    setTimeout(() => {
                        copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
                        copyBtn.style.background = '';
                    }, 2000);
                } catch (err) {
                    console.error('Errore nella copia:', err);
                }
            });

            // Setup close button
            const closeBtn = notification.querySelector('.close-notification');
            closeBtn.addEventListener('click', () => {
                notification.style.animation = 'slideOutRight 0.3s ease-out';
                setTimeout(() => notification.remove(), 300);
            });

            // Auto-remove dopo 8 secondi
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.style.animation = 'slideOutRight 0.3s ease-out';
                    setTimeout(() => notification.remove(), 300);
                }
            }, 8000);
        }
    }

    /**
     * Inizializzazione Principale
     */
    class PrezzlyApp {
        constructor() {
            this.managers = {};
            this.init();
        }

        init() {
            // Aspetta che il DOM sia pronto
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.initializeManagers());
            } else {
                this.initializeManagers();
            }
        }

        initializeManagers() {
            try {
                // Inizializza tutti i manager
                this.managers.dropdown = new DropdownManager();
                this.managers.search = new SearchManager();
                this.managers.newsletter = new NewsletterManager();
                this.managers.responsive = new ResponsiveManager();
                this.managers.accessibility = new AccessibilityManager();
                this.managers.smoothScroll = new SmoothScrollManager();
                this.managers.performance = new PerformanceManager();
                this.managers.review = new ReviewManager();
                this.managers.image = new ImageManager();
                this.managers.shoppingList = new ShoppingListManager();
                this.managers.filters = new FiltersManager();
                this.managers.atoz = new AtoZManager();
                this.managers.homeCategories = new HomeCategoriesManager();
                this.managers.shoppingListAdvanced = new ShoppingListAdvancedManager();
                this.managers.vendor = new VendorManager();

                console.log('✅ Prezzly frontend modernizzato caricato correttamente');
                
                // Dispatch evento personalizzato per indicare che l'app è pronta
                document.dispatchEvent(new CustomEvent('prezzly:ready', {
                    detail: { managers: this.managers }
                }));

            } catch (error) {
                console.error('❌ Errore durante l\'inizializzazione di Prezzly:', error);
            }
        }

        // API pubblica per interagire con l'app
        getManager(name) {
            return this.managers[name];
        }
    }

    // Inizializza l'applicazione
    window.PrezzlyApp = new PrezzlyApp();

    // CSS animations per i messaggi
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes slideOut {
            from {
                opacity: 1;
                transform: translateY(0);
            }
            to {
                opacity: 0;
                transform: translateY(-10px);
            }
        }

        .keyboard-navigation *:focus {
            outline: 2px solid var(--primary-color) !important;
            outline-offset: 2px !important;
        }

        .search-input-wrapper.focused {
            box-shadow: 0 0 0 3px rgba(44, 90, 160, 0.1);
        }
    `;
    document.head.appendChild(style);

})();