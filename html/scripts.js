/**
 * Prezzly Frontend Scripts - Complete Google Style Implementation
 * Sostituisce le funzionalità di Foundation 5 con JavaScript vanilla moderno
 * Aggiunge Voice Search, Google Layout e Enhanced Management
 */

(function() {
    'use strict';

    // === UTILITY FUNCTIONS ===
    
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

    // Utility per throttling
    const throttle = (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    };

    // Utility per animazioni CSS
    const animate = (element, animation, duration = 300) => {
        return new Promise(resolve => {
            element.style.animationDuration = `${duration}ms`;
            element.style.animationName = animation;
            element.addEventListener('animationend', resolve, { once: true });
        });
    };

    // Utility per eventi custom
    const dispatchCustomEvent = (eventName, detail = {}) => {
        document.dispatchEvent(new CustomEvent(eventName, { detail }));
    };

    // === VOICE SEARCH MANAGER ===
    
    /**
     * Gestisce la ricerca vocale con Web Speech API
     */
    class VoiceSearchManager {
        constructor() {
            this.recognition = null;
            this.isListening = false;
            this.isSupported = false;
            this.currentInput = null;
            this.settings = {
                language: 'it-IT',
                continuous: false,
                interimResults: false,
                maxAlternatives: 1,
                autoSubmit: true,
                autoSubmitDelay: 800
            };
            this.init();
        }

        init() {
            this.checkSupport();
            this.setupVoiceRecognition();
            this.bindEvents();
            this.addStyles();
        }

        checkSupport() {
            this.isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
            
            if (!this.isSupported) {
                // Nascondi i pulsanti microfono se non supportato
                document.querySelectorAll('.voice-search-btn').forEach(btn => {
                    btn.style.display = 'none';
                });
                console.log('🎤 Ricerca vocale non supportata in questo browser');
                return false;
            }

            // Verifica se siamo su HTTPS (richiesto per Web Speech API)
            if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
                console.warn('🎤 La ricerca vocale richiede HTTPS');
                this.showError('La ricerca vocale richiede una connessione sicura (HTTPS)');
                return false;
            }

            return true;
        }

        setupVoiceRecognition() {
            if (!this.isSupported) return;

            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            
            // Configurazione
            Object.assign(this.recognition, this.settings);

            // Event handlers
            this.recognition.onstart = () => this.onStart();
            this.recognition.onresult = (event) => this.onResult(event);
            this.recognition.onerror = (event) => this.onError(event);
            this.recognition.onend = () => this.onEnd();
            this.recognition.onspeechstart = () => this.onSpeechStart();
            this.recognition.onspeechend = () => this.onSpeechEnd();
            this.recognition.onnomatch = () => this.onNoMatch();
        }

        bindEvents() {
            // Aggiungi listener a tutti i pulsanti microfono
            document.addEventListener('click', (e) => {
                const voiceBtn = e.target.closest('.voice-search-btn');
                if (voiceBtn) {
                    e.preventDefault();
                    this.toggleListening(voiceBtn);
                }
            });

            // Keyboard shortcut (Ctrl + Shift + V)
            document.addEventListener('keydown', (e) => {
                if (e.ctrlKey && e.shiftKey && e.key === 'V') {
                    e.preventDefault();
                    const activeBtn = document.querySelector('.voice-search-btn:not([style*="display: none"])');
                    if (activeBtn) {
                        this.toggleListening(activeBtn);
                    }
                }
            });

            // ESC per fermare listening
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isListening) {
                    this.stopListening();
                }
            });

            // Click su voice feedback per cancellare
            document.addEventListener('click', (e) => {
                if (e.target.closest('.voice-cancel-btn')) {
                    this.stopListening();
                }
            });
        }

        addStyles() {
            // Aggiungi stili CSS per feedback visivo
            if (!document.getElementById('voice-search-styles')) {
                const style = document.createElement('style');
                style.id = 'voice-search-styles';
                style.textContent = `
                    .voice-search-btn.listening {
                        animation: voicePulse 1.5s infinite;
                        color: var(--danger-color, #dc3545) !important;
                    }
                    
                    @keyframes voicePulse {
                        0% { transform: scale(1); opacity: 1; }
                        50% { transform: scale(1.1); opacity: 0.8; }
                        100% { transform: scale(1); opacity: 1; }
                    }
                    
                    .voice-feedback {
                        backdrop-filter: blur(4px);
                    }
                    
                    .voice-feedback.active {
                        animation: voiceFadeIn 0.3s ease-out;
                    }
                    
                    @keyframes voiceFadeIn {
                        from { 
                            opacity: 0; 
                            transform: translate(-50%, -50%) scale(0.8); 
                        }
                        to { 
                            opacity: 1; 
                            transform: translate(-50%, -50%) scale(1); 
                        }
                    }
                `;
                document.head.appendChild(style);
            }
        }

        toggleListening(button) {
            if (!this.isSupported) {
                this.showNotSupported();
                return;
            }

            if (this.isListening) {
                this.stopListening();
            } else {
                this.startListening(button);
            }
        }

        startListening(button) {
            if (!this.recognition || this.isListening) return;

            // Trova l'input associato
            this.currentInput = this.findAssociatedInput(button);
            if (!this.currentInput) {
                console.error('🎤 Nessun input di ricerca trovato');
                return;
            }

            try {
                this.recognition.start();
                console.log('🎤 Avvio ricerca vocale...');
            } catch (error) {
                console.error('🎤 Errore avvio ricerca vocale:', error);
                this.showError('Errore nell\'avvio della ricerca vocale');
            }
        }

        stopListening() {
            if (this.recognition && this.isListening) {
                this.recognition.stop();
            }
        }

        findAssociatedInput(button) {
            // Trova l'input di ricerca nello stesso container
            const containers = [
                '.search-container-homepage', 
                '.search-container-results',
                '.search-form',
                '.search-input-group'
            ];
            
            for (const containerSelector of containers) {
                const container = button.closest(containerSelector);
                if (container) {
                    const input = container.querySelector('.search-input, input[name="q"], #q');
                    if (input) return input;
                }
            }
            
            // Fallback: trova qualsiasi input di ricerca nella pagina
            return document.querySelector('.search-input, input[name="q"], #q');
        }

        onStart() {
            this.isListening = true;
            
            // Aggiungi classe listening a tutti i pulsanti
            document.querySelectorAll('.voice-search-btn').forEach(btn => {
                btn.classList.add('listening');
                btn.setAttribute('title', 'Sto ascoltando... (ESC per fermare)');
            });

            // Mostra feedback
            this.showVoiceFeedback('Sto ascoltando...', 'listening');
            
            // Analytics
            this.trackEvent('voice_search_start');
            
            console.log('🎤 Ricerca vocale avviata');
        }

        onSpeechStart() {
            this.showVoiceFeedback('Ti sto sentendo...', 'speaking');
        }

        onSpeechEnd() {
            this.showVoiceFeedback('Elaborando...', 'processing');
        }

        onResult(event) {
            const result = event.results[0];
            const transcript = result[0].transcript.trim();
            const confidence = result[0].confidence;
            
            console.log(`🎤 Riconosciuto: "${transcript}" (confidenza: ${confidence.toFixed(2)})`);

            if (this.currentInput && transcript) {
                // Inserisci il testo nell'input
                this.currentInput.value = transcript;
                
                // Trigger eventi per compatibilità
                ['input', 'change'].forEach(eventType => {
                    this.currentInput.dispatchEvent(new Event(eventType, { bubbles: true }));
                });
                
                // Mostra conferma
                this.showVoiceFeedback(`"${transcript}"`, 'success');
                
                // Analytics
                this.trackEvent('voice_search_success', { transcript, confidence });
                
                // Auto-submit se abilitato
                if (this.settings.autoSubmit) {
                    setTimeout(() => {
                        this.submitSearch();
                    }, this.settings.autoSubmitDelay);
                } else {
                    // Focus sull'input per permettere editing
                    this.currentInput.focus();
                    this.currentInput.setSelectionRange(transcript.length, transcript.length);
                }

                // Dispatch evento custom
                dispatchCustomEvent('prezzly:voice-search', { 
                    query: transcript, 
                    confidence,
                    input: this.currentInput 
                });
            }
        }

        onError(event) {
            this.isListening = false;
            
            let errorMessage = 'Errore sconosciuto';
            let errorCode = event.error;
            
            switch (errorCode) {
                case 'no-speech':
                    errorMessage = 'Nessun audio rilevato. Riprova.';
                    break;
                case 'audio-capture':
                    errorMessage = 'Microfono non disponibile';
                    break;
                case 'not-allowed':
                    errorMessage = 'Permesso microfono negato';
                    this.showPermissionHelp();
                    break;
                case 'network':
                    errorMessage = 'Errore di rete';
                    break;
                case 'service-not-allowed':
                    errorMessage = 'Servizio non consentito';
                    break;
                case 'aborted':
                    errorMessage = 'Ricerca interrotta';
                    break;
                case 'language-not-supported':
                    errorMessage = 'Lingua non supportata';
                    break;
                default:
                    errorMessage = `Errore: ${errorCode}`;
            }
            
            console.error('🎤 Errore ricerca vocale:', errorCode);
            this.showError(errorMessage);
            this.trackEvent('voice_search_error', { errorCode, errorMessage });
            this.cleanup();
        }

        onEnd() {
            this.isListening = false;
            this.cleanup();
            console.log('🎤 Ricerca vocale terminata');
        }

        onNoMatch() {
            this.showError('Non ho capito, riprova parlando più chiaramente');
        }

        cleanup() {
            // Rimuovi classe listening
            document.querySelectorAll('.voice-search-btn').forEach(btn => {
                btn.classList.remove('listening');
                btn.setAttribute('title', 'Ricerca vocale (Ctrl+Shift+V)');
            });
            
            // Nascondi feedback dopo un breve ritardo
            setTimeout(() => {
                this.hideVoiceFeedback();
            }, 2000);
        }

        submitSearch() {
            if (this.currentInput && this.currentInput.value.trim()) {
                const form = this.currentInput.closest('form');
                if (form) {
                    console.log('🎤 Invio automatico ricerca:', this.currentInput.value);
                    form.submit();
                } else {
                    // Fallback: trigger submit event
                    this.currentInput.dispatchEvent(new KeyboardEvent('keydown', {
                        key: 'Enter',
                        keyCode: 13,
                        bubbles: true
                    }));
                }
            }
        }

        showVoiceFeedback(message, type = 'info') {
            const feedback = document.getElementById('voiceFeedback');
            const status = document.getElementById('voiceStatus');
            
            if (feedback && status) {
                status.textContent = message;
                
                // Aggiorna icona basata sul tipo
                const icon = feedback.querySelector('.voice-microphone i');
                if (icon) {
                    icon.className = this.getIconForType(type);
                }
                
                // Mostra feedback
                feedback.classList.add('active');
                
                // Auto-hide per alcuni tipi
                if (type === 'success') {
                    setTimeout(() => this.hideVoiceFeedback(), 2000);
                }
            }
        }

        getIconForType(type) {
            const icons = {
                listening: 'fas fa-microphone',
                speaking: 'fas fa-microphone-alt',
                processing: 'fas fa-cog fa-spin',
                success: 'fas fa-check-circle',
                error: 'fas fa-exclamation-triangle'
            };
            return icons[type] || 'fas fa-microphone';
        }

        hideVoiceFeedback() {
            const feedback = document.getElementById('voiceFeedback');
            if (feedback) {
                feedback.classList.remove('active');
            }
        }

        showError(message) {
            this.showVoiceFeedback(message, 'error');
            console.error('🎤', message);
        }

        showNotSupported() {
            this.showError('Ricerca vocale non supportata in questo browser');
        }

        showPermissionHelp() {
            const helpMessage = 'Per usare la ricerca vocale, abilita il microfono nelle impostazioni del browser';
            this.showError(helpMessage);
            
            // Mostra istruzioni aggiuntive
            setTimeout(() => {
                if (confirm('Vuoi vedere le istruzioni per abilitare il microfono?')) {
                    this.openPermissionHelp();
                }
            }, 3000);
        }

        openPermissionHelp() {
            const helpUrl = 'https://support.google.com/chrome/answer/2693767';
            window.open(helpUrl, '_blank');
        }

        trackEvent(eventName, data = {}) {
            // Google Analytics tracking
            if (typeof gtag !== 'undefined') {
                gtag('event', eventName, {
                    event_category: 'voice_search',
                    ...data
                });
            }
            
            // Custom analytics
            dispatchCustomEvent(`prezzly:${eventName}`, data);
        }

        // API pubblica
        isAvailable() {
            return this.isSupported;
        }

        getCurrentInput() {
            return this.currentInput;
        }

        getSettings() {
            return { ...this.settings };
        }

        updateSettings(newSettings) {
            this.settings = { ...this.settings, ...newSettings };
            if (this.recognition) {
                Object.assign(this.recognition, this.settings);
            }
        }
    }

    // === GOOGLE LAYOUT MANAGER ===
    
    /**
     * Gestisce il layout in stile Google e le transizioni
     */
    class GoogleLayoutManager {
        constructor() {
            this.isHomepage = this.detectHomepage();
            this.observers = new Map();
            this.resizeObserver = null;
            this.init();
        }

        init() {
            this.setupLayoutDetection();
            this.setupSearchEnhancements();
            this.setupNavigationDropdowns();
            this.setupMobileOptimizations();
            this.setupKeyboardShortcuts();
            this.setupScrollEffects();
            this.setupAccessibility();
            this.setupPerformanceOptimizations();
        }

        detectHomepage() {
            return document.querySelector('.homepage-layout') !== null;
        }

        setupLayoutDetection() {
            // Observer per cambiamenti nel DOM che possano indicare cambio layout
            const layoutObserver = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList') {
                        const wasHomepage = this.isHomepage;
                        this.isHomepage = this.detectHomepage();
                        
                        if (wasHomepage !== this.isHomepage) {
                            this.onLayoutChange();
                        }
                    }
                });
            });

            layoutObserver.observe(document.body, {
                childList: true,
                subtree: true
            });

            this.observers.set('layout', layoutObserver);
        }

        onLayoutChange() {
            console.log(`🔄 Layout changed to: ${this.isHomepage ? 'Homepage' : 'Results'}`);
            
            // Re-initialize components per il nuovo layout
            this.setupSearchEnhancements();
            this.setupMobileOptimizations();
            
            // Dispatch evento
            dispatchCustomEvent('prezzly:layout-change', { 
                isHomepage: this.isHomepage 
            });
        }

        setupSearchEnhancements() {
            // Migliora l'autocomplete per il design Google
            this.enhanceAutocomplete();
            
            // Aggiungi gestione focus migliorata
            this.setupFocusEnhancements();
            
            // Gestione form submission
            this.setupFormSubmission();
            
            // Setup search suggestions
            this.setupSearchSuggestions();
        }

        enhanceAutocomplete() {
            // Aspetta che jQuery UI sia disponibile
            if (typeof $ !== 'undefined' && $.fn.autocomplete) {
                $('.search-input').each(function() {
                    const $input = $(this);
                    const isHomepage = $input.hasClass('search-input-homepage');
                    
                    // Configurazione autocomplete personalizzata
                    const autocompleteConfig = {
                        position: { 
                            my: "left top", 
                            at: "left bottom",
                            collision: "flip"
                        },
                        open: function() {
                            const $widget = $(this).autocomplete('widget');
                            $widget.css({
                                'border-radius': isHomepage ? '0 0 24px 24px' : '0 0 20px 20px',
                                'margin-top': '-1px',
                                'box-shadow': '0 4px 6px rgba(0,0,0,0.1)',
                                'border': 'none',
                                'border-top': '1px solid #dadce0',
                                'z-index': '1000'
                            });
                        },
                        close: function() {
                            // Nessuna azione speciale alla chiusura
                        },
                        select: function(event, ui) {
                            // Aggiungi ritardo per permettere la selezione
                            setTimeout(() => {
                                const form = this.closest('form');
                                if (form) {
                                    form.submit();
                                }
                            }, 100);
                        }
                    };
                    
                    // Applica configurazione se non già configurato
                    if (!$input.hasClass('ui-autocomplete-input')) {
                        $input.autocomplete(autocompleteConfig);
                    } else {
                        // Aggiorna configurazione esistente
                        $input.autocomplete('option', autocompleteConfig);
                    }
                });
            }
        }

        setupFocusEnhancements() {
            // Focus migliorato per search input
            document.querySelectorAll('.search-input').forEach(input => {
                // Focus enhancement
                input.addEventListener('focus', () => {
                    const container = input.closest('.search-container-homepage, .search-container-results, .search-input-group');
                    if (container) {
                        container.classList.add('focused');
                    }
                    
                    // Analytics
                    this.trackInteraction('search_focus');
                });

                input.addEventListener('blur', () => {
                    const container = input.closest('.search-container-homepage, .search-container-results, .search-input-group');
                    if (container) {
                        setTimeout(() => {
                            container.classList.remove('focused');
                        }, 200); // Ritardo per permettere click su autocomplete
                    }
                });

                // Gestione typing
                input.addEventListener('input', debounce(() => {
                    this.onSearchInput(input);
                }, 300));
            });
        }

        onSearchInput(input) {
            const query = input.value.trim();
            
            if (query.length >= 2) {
                // Trigger search suggestions
                this.updateSearchSuggestions(input, query);
                
                // Analytics
                this.trackInteraction('search_typing', { queryLength: query.length });
            }
        }

        updateSearchSuggestions(input, query) {
            // Implementazione base per suggerimenti
            // In produzione, questo dovrebbe chiamare l'API
            const suggestions = this.generateSuggestions(query);
            
            if (suggestions.length > 0) {
                dispatchCustomEvent('prezzly:search-suggestions', {
                    query,
                    suggestions,
                    input
                });
            }
        }

        generateSuggestions(query) {
            // Suggerimenti base - in produzione usare API
            const commonSuggestions = [
                'iPhone', 'Samsung Galaxy', 'MacBook Pro', 'iPad', 'AirPods',
                'PlayStation 5', 'Nintendo Switch', 'Xbox Series X', 'Tesla',
                'Dyson', 'Sony', 'Canon', 'Nike', 'Adidas'
            ];
            
            return commonSuggestions
                .filter(suggestion => 
                    suggestion.toLowerCase().includes(query.toLowerCase())
                )
                .slice(0, 5);
        }

        setupFormSubmission() {
            // Gestione migliorata submission form
            document.querySelectorAll('form[id="search"], .search-form, .search-form-homepage, .search-form-results').forEach(form => {
                form.addEventListener('submit', (e) => {
                    const input = form.querySelector('.search-input, input[name="q"]');
                    const query = input ? input.value.trim() : '';
                    
                    if (!query) {
                        e.preventDefault();
                        input?.focus();
                        this.showError(input, 'Inserisci un termine di ricerca');
                        return;
                    }
                    
                    // Aggiungi classe loading al submit button
                    const submitBtn = form.querySelector('.search-submit-btn, .google-btn, .search-button');
                    if (submitBtn) {
                        this.setButtonLoading(submitBtn, true);
                    }
                    
                    // Analytics
                    this.trackInteraction('search_submit', { query });
                    
                    console.log('🔍 Ricerca inviata:', query);
                });
            });
        }

        setButtonLoading(button, loading) {
            if (loading) {
                button.classList.add('loading');
                button.style.pointerEvents = 'none';
                button.setAttribute('data-original-html', button.innerHTML);
                
                if (button.classList.contains('google-btn')) {
                    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Ricerca...';
                } else {
                    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                }
            } else {
                button.classList.remove('loading');
                button.style.pointerEvents = '';
                const originalHtml = button.getAttribute('data-original-html');
                if (originalHtml) {
                    button.innerHTML = originalHtml;
                    button.removeAttribute('data-original-html');
                }
            }
        }

        setupNavigationDropdowns() {
            // Gestione dropdown navigazione
            document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
                const trigger = dropdown.querySelector('.dropdown-toggle, .nav-dropdown > a');
                const menu = dropdown.querySelector('.nav-dropdown-menu');
                const arrow = dropdown.querySelector('.dropdown-arrow');
                
                if (trigger && menu) {
                    trigger.addEventListener('click', (e) => {
                        e.preventDefault();
                        
                        // Chiudi altri dropdown
                        document.querySelectorAll('.nav-dropdown').forEach(other => {
                            if (other !== dropdown) {
                                other.classList.remove('active');
                                const otherMenu = other.querySelector('.nav-dropdown-menu');
                                if (otherMenu) otherMenu.classList.remove('show');
                            }
                        });
                        
                        // Toggle questo dropdown
                        const isActive = dropdown.classList.contains('active');
                        dropdown.classList.toggle('active');
                        menu.classList.toggle('show');
                        
                        // Carica contenuto se necessario
                        if (!isActive && menu.classList.contains('show')) {
                            this.loadDropdownContent(dropdown, menu);
                        }
                        
                        // Analytics
                        this.trackInteraction('dropdown_toggle', { 
                            dropdownId: dropdown.id || 'unknown'
                        });
                    });
                }
            });

            // Chiudi dropdown cliccando fuori
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.nav-dropdown')) {
                    this.closeAllDropdowns();
                }
            });

            // Gestione ESC
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.closeAllDropdowns();
                }
            });
        }

        closeAllDropdowns() {
            document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
                dropdown.classList.remove('active');
                const menu = dropdown.querySelector('.nav-dropdown-menu');
                if (menu) menu.classList.remove('show');
            });
        }

        loadDropdownContent(dropdown, menu) {
            // Carica categorie dinamicamente per il dropdown categorie
            if (menu.id === 'categoriesDropdown' && !menu.dataset.loaded) {
                this.loadCategoriesDropdown(menu);
            } else if (menu.id === 'filtersDropdown' && !menu.dataset.loaded) {
                this.loadFiltersDropdown(menu);
            }
        }

        loadCategoriesDropdown(menu) {
            // Mostra loading
            menu.innerHTML = '<div class="loading-spinner" style="margin: 20px auto;"></div>';
            
            // Simula caricamento categorie (sostituire con chiamata AJAX vera)
            setTimeout(() => {
                const categories = [
                    { name: 'Elettronica', href: '/categoria/elettronica', icon: 'fas fa-laptop' },
                    { name: 'Moda', href: '/categoria/moda', icon: 'fas fa-tshirt' },
                    { name: 'Casa e Giardino', href: '/categoria/casa-giardino', icon: 'fas fa-home' },
                    { name: 'Sport e Tempo Libero', href: '/categoria/sport', icon: 'fas fa-running' },
                    { name: 'Auto e Moto', href: '/categoria/auto-moto', icon: 'fas fa-car' },
                    { name: 'Salute e Bellezza', href: '/categoria/salute-bellezza', icon: 'fas fa-heartbeat' },
                    { name: 'Libri e Media', href: '/categoria/libri', icon: 'fas fa-book' },
                    { name: 'Giocattoli', href: '/categoria/giocattoli', icon: 'fas fa-gamepad' }
                ];
                
                menu.innerHTML = categories.map(cat => 
                    `<a href="${cat.href}">
                        <i class="${cat.icon}"></i> ${cat.name}
                    </a>`
                ).join('');
                
                menu.dataset.loaded = 'true';
            }, 500);
        }

        loadFiltersDropdown(menu) {
            // Carica filtri rapidi
            const currentUrl = new URL(window.location);
            const query = currentUrl.searchParams.get('q') || '';
            
            const filters = [
                { name: 'Prezzo crescente', param: 'sort=price_asc', icon: 'fas fa-sort-amount-up' },
                { name: 'Prezzo decrescente', param: 'sort=price_desc', icon: 'fas fa-sort-amount-down' },
                { name: 'Nome A-Z', param: 'sort=name_asc', icon: 'fas fa-sort-alpha-up' },
                { name: 'Più popolari', param: 'sort=popular', icon: 'fas fa-star' },
                { name: 'Novità', param: 'sort=newest', icon: 'fas fa-clock' }
            ];
            
            menu.innerHTML = filters.map(filter => {
                const url = new URL(window.location.origin + window.location.pathname);
                if (query) url.searchParams.set('q', query);
                url.searchParams.set('sort', filter.param.split('=')[1]);
                
                return `<a href="${url.toString()}">
                    <i class="${filter.icon}"></i> ${filter.name}
                </a>`;
            }).join('');
            
            menu.dataset.loaded = 'true';
        }

        setupSearchSuggestions() {
            // Setup per suggerimenti di ricerca in tempo reale
            const suggestionContainer = this.createSuggestionContainer();
            
            // Listener per suggerimenti custom
            document.addEventListener('prezzly:search-suggestions', (e) => {
                this.displaySuggestions(e.detail.suggestions, e.detail.input);
            });
        }

        createSuggestionContainer() {
            if (document.getElementById('search-suggestions')) return;
            
            const container = document.createElement('div');
            container.id = 'search-suggestions';
            container.className = 'search-suggestions-container';
            container.innerHTML = `
                <div class="suggestions-header">
                    <span>Suggerimenti:</span>
                </div>
                <div class="suggestions-list"></div>
            `;
            
            // Stili inline
            container.style.cssText = `
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: white;
                border: 1px solid #dadce0;
                border-radius: 0 0 20px 20px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                z-index: 999;
                display: none;
                font-size: 14px;
            `;
            
            document.body.appendChild(container);
            return container;
        }

        displaySuggestions(suggestions, inputElement) {
            const container = document.getElementById('search-suggestions');
            if (!container || !suggestions.length) return;
            
            const suggestionsList = container.querySelector('.suggestions-list');
            suggestionsList.innerHTML = suggestions.map(suggestion => 
                `<div class="suggestion-item" data-suggestion="${suggestion}">
                    <i class="fas fa-search"></i> ${suggestion}
                </div>`
            ).join('');
            
            // Posiziona il container
            const inputRect = inputElement.getBoundingClientRect();
            container.style.top = `${inputRect.bottom + window.scrollY}px`;
            container.style.left = `${inputRect.left + window.scrollX}px`;
            container.style.width = `${inputRect.width}px`;
            container.style.display = 'block';
            
            // Gestisci click sui suggerimenti
            suggestionsList.addEventListener('click', (e) => {
                const suggestionItem = e.target.closest('.suggestion-item');
                if (suggestionItem) {
                    const suggestion = suggestionItem.dataset.suggestion;
                    inputElement.value = suggestion;
                    container.style.display = 'none';
                    
                    // Submit form
                    const form = inputElement.closest('form');
                    if (form) form.submit();
                }
            });
        }

        setupMobileOptimizations() {
            // Ottimizzazioni per mobile
            if (isMobile()) {
                this.optimizeForMobile();
            }
            
            // Listener per resize
            const resizeHandler = debounce(() => {
                if (isMobile()) {
                    this.optimizeForMobile();
                } else {
                    this.optimizeForDesktop();
                }
            }, 250);
            
            window.addEventListener('resize', resizeHandler);
            
            // Setup mobile navigation
            this.setupMobileNavigation();
        }

        optimizeForMobile() {
            // Ottimizzazioni specifiche per mobile
            document.querySelectorAll('.search-input').forEach(input => {
                input.setAttribute('autocomplete', 'off');
                input.setAttribute('autocorrect', 'off');
                input.setAttribute('autocapitalize', 'off');
                input.setAttribute('spellcheck', 'false');
            });

            // Gestione viewport per evitare zoom su iOS
            let viewport = document.querySelector('meta[name="viewport"]');
            if (!viewport) {
                viewport = document.createElement('meta');
                viewport.name = 'viewport';
                document.head.appendChild(viewport);
            }
            viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
            
            // Setup touch gestures
            this.setupTouchGestures();
        }

        optimizeForDesktop() {
            // Ripristina impostazioni desktop
            document.querySelectorAll('.search-input').forEach(input => {
                ['autocomplete', 'autocorrect', 'autocapitalize', 'spellcheck'].forEach(attr => {
                    input.removeAttribute(attr);
                });
            });
            
            const viewport = document.querySelector('meta[name="viewport"]');
            if (viewport) {
                viewport.content = 'width=device-width, initial-scale=1.0';
            }
        }

        setupTouchGestures() {
            // Implementa gesture di swipe per mobile navigation
            let startY = 0;
            let startX = 0;
            
            document.addEventListener('touchstart', (e) => {
                startY = e.touches[0].clientY;
                startX = e.touches[0].clientX;
            }, { passive: true });
            
            document.addEventListener('touchend', (e) => {
                const endY = e.changedTouches[0].clientY;
                const endX = e.changedTouches[0].clientX;
                const diffY = startY - endY;
                const diffX = startX - endX;
                
                // Swipe up per aprire filtri
                if (diffY > 50 && Math.abs(diffX) < 100) {
                    const filtersToggle = document.querySelector('.filters-toggle-btn');
                    if (filtersToggle && window.scrollY > 100) {
                        filtersToggle.click();
                    }
                }
                
                // Swipe left per aprire menu mobile
                if (diffX > 50 && Math.abs(diffY) < 100) {
                    const mobileToggle = document.querySelector('.mobile-nav-btn');
                    if (mobileToggle) {
                        mobileToggle.click();
                    }
                }
            }, { passive: true });
        }

        setupMobileNavigation() {
            // Gestione menu mobile per layout risultati
            const mobileToggle = document.querySelector('.mobile-nav-btn, #mobileNavToggle');
            const mobileOverlay = document.querySelector('.mobile-nav-overlay, #mobileNavOverlay');
            const mobileClose = document.querySelector('.mobile-nav-close, #mobileNavClose');
            
            if (mobileToggle && mobileOverlay) {
                mobileToggle.addEventListener('click', () => {
                    mobileOverlay.classList.add('active');
                    document.body.style.overflow = 'hidden';
                    this.trackInteraction('mobile_menu_open');
                });
                
                const closeMobileNav = () => {
                    mobileOverlay.classList.remove('active');
                    document.body.style.overflow = '';
                    this.trackInteraction('mobile_menu_close');
                };
                
                if (mobileClose) {
                    mobileClose.addEventListener('click', closeMobileNav);
                }
                
                mobileOverlay.addEventListener('click', (e) => {
                    if (e.target === mobileOverlay) {
                        closeMobileNav();
                    }
                });
                
                // Chiudi con ESC
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape' && mobileOverlay.classList.contains('active')) {
                        closeMobileNav();
                    }
                });
            }
        }

        setupKeyboardShortcuts() {
            document.addEventListener('keydown', (e) => {
                // Focus su search (/)
                if (e.key === '/' && !this.isInputFocused()) {
                    e.preventDefault();
                    this.focusSearch();
                }
                
                // Ctrl/Cmd + K per focus search (come Google)
                if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                    e.preventDefault();
                    this.focusSearch();
                }
                
                // Escape per varie azioni
                if (e.key === 'Escape') {
                    this.handleEscape();
                }
                
                // Tab per navigazione migliorata
                if (e.key === 'Tab') {
                    this.handleTabNavigation(e);
                }
            });
        }

        isInputFocused() {
            const activeElement = document.activeElement;
            return activeElement && (
                activeElement.tagName === 'INPUT' || 
                activeElement.tagName === 'TEXTAREA' ||
                activeElement.contentEditable === 'true'
            );
        }

        focusSearch() {
            const searchInput = document.querySelector('.search-input, input[name="q"], #q');
            if (searchInput) {
                searchInput.focus();
                searchInput.select();
                this.trackInteraction('keyboard_focus_search');
            }
        }

        handleEscape() {
            // Chiudi dropdown
            this.closeAllDropdowns();
            
            // Cancella ricerca se focus su input
            if (this.isInputFocused() && document.activeElement.classList.contains('search-input')) {
                document.activeElement.value = '';
                this.trackInteraction('escape_clear_search');
            }
            
            // Chiudi suggerimenti
            const suggestions = document.getElementById('search-suggestions');
            if (suggestions) {
                suggestions.style.display = 'none';
            }
        }

        handleTabNavigation(e) {
            // Implementa tab trapping per dropdown aperti
            const openDropdown = document.querySelector('.nav-dropdown.active');
            if (openDropdown) {
                const focusableElements = openDropdown.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement?.focus();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement?.focus();
                }
            }
        }

        setupScrollEffects() {
            // Effetti di scroll per sticky elements
            let ticking = false;
            
            const scrollHandler = () => {
                if (!ticking) {
                    requestAnimationFrame(() => {
                        this.updateScrollEffects();
                        ticking = false;
                    });
                    ticking = true;
                }
            };
            
            window.addEventListener('scroll', scrollHandler, { passive: true });
        }

        updateScrollEffects() {
            const scrollY = window.pageYOffset;
            
            // Aggiorna header shadow basato su scroll
            const resultsHeader = document.querySelector('.results-header');
            if (resultsHeader) {
                if (scrollY > 10) {
                    resultsHeader.style.boxShadow = '0 2px 10px rgba(32,33,36,.28)';
                } else {
                    resultsHeader.style.boxShadow = '0 1px 6px rgba(32,33,36,.28)';
                }
            }
            
            // Show/hide back to top button
            const backToTop = document.querySelector('.back-to-top-btn');
            if (backToTop) {
                if (scrollY > 300) {
                    backToTop.style.opacity = '1';
                    backToTop.style.transform = 'scale(1)';
                } else {
                    backToTop.style.opacity = '0.7';
                    backToTop.style.transform = 'scale(0.9)';
                }
            }
        }

        setupAccessibility() {
            // Miglioramenti per accessibilità
            this.enhanceKeyboardNavigation();
            this.addAriaLabels();
            this.setupScreenReaderSupport();
        }

        enhanceKeyboardNavigation() {
            // Evidenzia meglio il focus per navigazione da tastiera
            let isKeyboardNavigation = false;
            
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    isKeyboardNavigation = true;
                    document.body.classList.add('keyboard-navigation');
                }
            });
            
            document.addEventListener('mousedown', () => {
                isKeyboardNavigation = false;
                document.body.classList.remove('keyboard-navigation');
            });
        }

        addAriaLabels() {
            // Aggiungi aria-labels mancanti
            document.querySelectorAll('.search-input').forEach((input, index) => {
                if (!input.getAttribute('aria-label')) {
                    input.setAttribute('aria-label', 'Campo di ricerca prodotti');
                }
            });
            
            document.querySelectorAll('.voice-search-btn').forEach(btn => {
                if (!btn.getAttribute('aria-label')) {
                    btn.setAttribute('aria-label', 'Avvia ricerca vocale');
                }
            });
        }

        setupScreenReaderSupport() {
            // Annunci per screen reader
            this.createLiveRegion();
            
            // Listener per aggiornamenti
            document.addEventListener('prezzly:voice-search', (e) => {
                this.announceToScreenReader(`Ricerca vocale completata: ${e.detail.query}`);
            });
        }

        createLiveRegion() {
            if (document.getElementById('screen-reader-announcements')) return;
            
            const liveRegion = document.createElement('div');
            liveRegion.id = 'screen-reader-announcements';
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            liveRegion.className = 'sr-only';
            
            document.body.appendChild(liveRegion);
        }

        announceToScreenReader(message) {
            const liveRegion = document.getElementById('screen-reader-announcements');
            if (liveRegion) {
                liveRegion.textContent = message;
                
                // Clear dopo un po'
                setTimeout(() => {
                    liveRegion.textContent = '';
                }, 1000);
            }
        }

        setupPerformanceOptimizations() {
            // Lazy loading per elementi non critici
            this.setupLazyLoading();
            
            // Preload dei link importanti
            this.setupLinkPreloading();
            
            // Resource hints
            this.addResourceHints();
        }

        setupLazyLoading() {
            if ('IntersectionObserver' in window) {
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

                // Osserva immagini lazy
                document.querySelectorAll('img[loading="lazy"], img[data-src]').forEach(img => {
                    imageObserver.observe(img);
                });
                
                this.observers.set('images', imageObserver);
            }
        }

        loadImage(img) {
            const src = img.dataset.src || img.src;
            if (src && img.src !== src) {
                img.style.transition = 'opacity 0.3s';
                img.style.opacity = '0';
                
                const tempImg = new Image();
                tempImg.onload = () => {
                    img.src = tempImg.src;
                    img.style.opacity = '1';
                    img.removeAttribute('data-src');
                };
                tempImg.onerror = () => {
                    this.handleImageError(img);
                };
                tempImg.src = src;
            }
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
                font-size: 14px;
            `;
            
            img.parentNode?.replaceChild(placeholder, img);
        }

        setupLinkPreloading() {
            // Preload dei link al hover (solo su desktop)
            if (!isMobile()) {
                const preloadedUrls = new Set();
                
                document.addEventListener('mouseover', throttle((e) => {
                    const link = e.target.closest('a[href]');
                    if (link && link.hostname === window.location.hostname && !preloadedUrls.has(link.href)) {
                        this.preloadLink(link.href);
                        preloadedUrls.add(link.href);
                    }
                }, 100));
            }
        }

        preloadLink(href) {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = href;
            document.head.appendChild(link);
        }

        addResourceHints() {
            // Aggiungi DNS prefetch per domini esterni
            const domains = ['fonts.googleapis.com', 'cdnjs.cloudflare.com'];
            domains.forEach(domain => {
                if (!document.querySelector(`link[href="//${domain}"]`)) {
                    const link = document.createElement('link');
                    link.rel = 'dns-prefetch';
                    link.href = `//${domain}`;
                    document.head.appendChild(link);
                }
            });
        }

        showError(input, message) {
            // Mostra errore visivo
            const container = input?.closest('.search-container-homepage, .search-container-results, .search-input-group');
            if (container) {
                container.classList.add('error');
                setTimeout(() => {
                    container.classList.remove('error');
                }, 3000);
            }
            
            // Mostra tooltip errore
            this.showTooltip(input, message, 'error');
        }

        showTooltip(element, message, type = 'info') {
            if (!element) return;
            
            // Rimuovi tooltip esistenti
            document.querySelectorAll('.search-tooltip').forEach(tooltip => {
                tooltip.remove();
            });
            
            const tooltip = document.createElement('div');
            tooltip.className = `search-tooltip ${type}`;
            tooltip.textContent = message;
            tooltip.style.cssText = `
                position: absolute;
                top: 100%;
                left: 50%;
                transform: translateX(-50%);
                background: ${type === 'error' ? '#dc3545' : '#6c757d'};
                color: white;
                padding: 8px 12px;
                border-radius: 4px;
                font-size: 12px;
                z-index: 1000;
                margin-top: 5px;
                white-space: nowrap;
                pointer-events: none;
                animation: tooltipFadeIn 0.3s ease-out;
            `;
            
            const container = element.closest('.search-container-homepage, .search-container-results, .search-input-group');
            if (container) {
                container.style.position = 'relative';
                container.appendChild(tooltip);
                
                setTimeout(() => {
                    tooltip.remove();
                }, 3000);
            }
        }

        trackInteraction(action, data = {}) {
            // Analytics tracking
            if (typeof gtag !== 'undefined') {
                gtag('event', action, {
                    event_category: 'ui_interaction',
                    ...data
                });
            }
            
            dispatchCustomEvent(`prezzly:${action}`, data);
        }

        // API pubblica
        getCurrentLayout() {
            return this.isHomepage ? 'homepage' : 'results';
        }

        switchLayout(layout) {
            // Utile per testing o switching programmático
            if (layout === 'homepage' && !this.isHomepage) {
                document.body.classList.add('google-homepage');
                document.body.classList.remove('google-results');
            } else if (layout === 'results' && this.isHomepage) {
                document.body.classList.add('google-results');
                document.body.classList.remove('google-homepage');
            }
        }

        cleanup() {
            // Cleanup observers
            this.observers.forEach(observer => {
                observer.disconnect();
            });
            this.observers.clear();
            
            if (this.resizeObserver) {
                this.resizeObserver.disconnect();
            }
        }
    }

    // === DROPDOWN MANAGER (LEGACY COMPATIBILITY) ===
    
    /**
     * Gestione Dropdown Menu (compatibilità con codice esistente)
     */
    class DropdownManager {
        constructor() {
            this.dropdowns = document.querySelectorAll('.dropdown-item');
            this.loadCatDone = [];
            this.init();
        }

        init() {
            this.dropdowns.forEach(dropdown => {
                const toggle = dropdown.querySelector('.dropdown-toggle');
                const menu = dropdown.querySelector('.dropdown-menu');

                if (toggle && menu) {
                    toggle.addEventListener('click', (e) => {
                        e.preventDefault();
                        
                        const categoryId = toggle.getAttribute('data-category');
                        if (categoryId !== null) {
                            this.loadCategories(categoryId);
                        }
                        
                        this.toggleDropdown(dropdown);
                    });

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

            document.addEventListener('click', (e) => {
                if (!e.target.closest('.dropdown-item')) {
                    this.hideAllDropdowns();
                }
            });

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
            
            const toggle = dropdown.querySelector('.dropdown-toggle');
            toggle.setAttribute('aria-expanded', 'true');
        }

        hideDropdown(dropdown) {
            const menu = dropdown.querySelector('.dropdown-menu');
            menu.classList.remove('show');
            
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
            
            menuElement.innerHTML = '<li><div class="loading-spinner"></div></li>';
            
            // Estrai il baseHREF 
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
            
            if (!baseHREF) {
                baseHREF = window.location.origin + '/';
            }
            
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

    // === ENHANCED PREZZLY MANAGER ===
    
    /**
     * Manager principale che coordina tutti i componenti
     */
    class EnhancedPrezzlyManager {
        constructor() {
            this.components = {};
            this.isInitialized = false;
            this.settings = {
                enableVoiceSearch: true,
                enableAnalytics: true,
                enablePerformanceOptimizations: true,
                debug: false
            };
            this.init();
        }

        init() {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.initialize());
            } else {
                this.initialize();
            }
        }

        initialize() {
            try {
                this.setupEnvironment();
                this.initializeComponents();
                this.setupGlobalEventListeners();
                this.setupAnalytics();
                this.setupPerformanceMonitoring();
                
                this.isInitialized = true;
                this.onReady();
                
            } catch (error) {
                console.error('❌ Errore inizializzazione Enhanced Prezzly Manager:', error);
                this.handleInitializationError(error);
            }
        }

        setupEnvironment() {
            // Setup dell'ambiente di esecuzione
            this.detectEnvironment();
            this.addGlobalStyles();
            this.setupErrorHandling();
        }

        detectEnvironment() {
            // Rileva ambiente di esecuzione
            this.environment = {
                isMobile: isMobile(),
                isTouch: 'ontouchstart' in window,
                isHttps: location.protocol === 'https:',
                userAgent: navigator.userAgent,
                language: navigator.language,
                platform: navigator.platform,
                cookiesEnabled: navigator.cookieEnabled,
                onlineStatus: navigator.onLine
            };
            
            if (this.settings.debug) {
                console.log('🔍 Environment detected:', this.environment);
            }
        }

        addGlobalStyles() {
            // Aggiungi stili CSS globali se non già presenti
            if (!document.getElementById('prezzly-global-styles')) {
                const style = document.createElement('style');
                style.id = 'prezzly-global-styles';
                style.textContent = `
                    /* Tooltip animations */
                    @keyframes tooltipFadeIn {
                        from { opacity: 0; transform: translateX(-50%) translateY(-5px); }
                        to { opacity: 1; transform: translateX(-50%) translateY(0); }
                    }
                    
                    /* Error states */
                    .search-container-homepage.error .search-input-homepage,
                    .search-container-results.error .search-input-results,
                    .search-input-group.error .search-input {
                        border-color: #dc3545 !important;
                        box-shadow: 0 2px 8px rgba(220, 53, 69, 0.2) !important;
                    }
                    
                    /* Loading states */
                    .loading::after {
                        content: '';
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        width: 12px;
                        height: 12px;
                        margin: -6px 0 0 -6px;
                        border: 2px solid currentColor;
                        border-radius: 50%;
                        border-top-color: transparent;
                        animation: spin 1s linear infinite;
                    }
                    
                    .loading {
                        position: relative;
                        pointer-events: none;
                    }
                    
                    .loading > * {
                        opacity: 0.5;
                    }
                    
                    /* Keyboard navigation */
                    .keyboard-navigation *:focus {
                        outline: 3px solid var(--primary-color, #1E293B) !important;
                        outline-offset: 2px !important;
                        box-shadow: 0 0 0 5px rgba(30, 41, 59, 0.2) !important;
                    }
                    
                    /* Reduced motion support */
                    @media (prefers-reduced-motion: reduce) {
                        *, *::before, *::after {
                            animation-duration: 0.01ms !important;
                            animation-iteration-count: 1 !important;
                            transition-duration: 0.01ms !important;
                        }
                    }
                    
                    /* High contrast support */
                    @media (prefers-contrast: high) {
                        .search-input-homepage,
                        .search-input-results,
                        .search-input {
                            border-width: 2px !important;
                        }
                        
                        .google-btn {
                            border-width: 2px !important;
                        }
                    }
                `;
                document.head.appendChild(style);
            }
        }

        setupErrorHandling() {
            // Global error handler
            window.addEventListener('error', (e) => {
                if (this.settings.debug) {
                    console.error('🚨 Global error:', e.error);
                }
                this.handleGlobalError(e.error);
            });
            
            window.addEventListener('unhandledrejection', (e) => {
                if (this.settings.debug) {
                    console.error('🚨 Unhandled promise rejection:', e.reason);
                }
                this.handleGlobalError(e.reason);
            });
        }

        initializeComponents() {
            // Inizializza tutti i componenti
            this.components.voice = new VoiceSearchManager();
            this.components.layout = new GoogleLayoutManager();
            this.components.dropdown = new DropdownManager(); // Legacy compatibility
            
            // Altri manager esistenti (da mantenere per compatibilità)
            this.components.newsletter = this.initializeNewsletterManager();
            this.components.responsive = this.initializeResponsiveManager();
            this.components.accessibility = this.initializeAccessibilityManager();
            this.components.smoothScroll = this.initializeSmoothScrollManager();
            this.components.performance = this.initializePerformanceManager();
            this.components.review = this.initializeReviewManager();
            this.components.image = this.initializeImageManager();
            this.components.shoppingList = this.initializeShoppingListManager();
            this.components.filters = this.initializeFiltersManager();
            
            if (this.settings.debug) {
                console.log('✅ Tutti i componenti inizializzati:', Object.keys(this.components));
            }
        }

        // Inizializzatori per componenti legacy (mantenuti per compatibilità)
        initializeNewsletterManager() {
            const form = document.querySelector('.newsletter-form');
            if (!form) return null;

            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleNewsletterSubmit(e);
            });

            return { form };
        }

        handleNewsletterSubmit(e) {
            const formData = new FormData(e.target);
            const email = formData.get('email') || e.target.querySelector('input[type="email"]').value;

            if (!this.isValidEmail(email)) {
                this.showMessage('Inserisci un indirizzo email valido', 'error');
                return;
            }

            try {
                this.showMessage('Iscrizione completata con successo!', 'success');
                e.target.reset();
                this.trackEvent('newsletter_signup', { email: email.split('@')[1] }); // Track domain only
            } catch (error) {
                this.showMessage('Errore durante l\'iscrizione. Riprova più tardi.', 'error');
            }
        }

        isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }

        showMessage(message, type) {
            // Implementazione base per messaggi
            const existingMessage = document.querySelector('.prezzly-message');
            if (existingMessage) {
                existingMessage.remove();
            }

            const messageDiv = document.createElement('div');
            messageDiv.className = 'prezzly-message';
            messageDiv.textContent = message;
            
            const bgColor = type === 'success' ? '#d4edda' : '#f8d7da';
            const textColor = type === 'success' ? '#155724' : '#721c24';
            
            messageDiv.style.cssText = `
                background: ${bgColor};
                color: ${textColor};
                padding: 10px 15px;
                margin: 10px 0;
                border-radius: 4px;
                text-align: center;
                animation: slideIn 0.3s ease-out;
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                max-width: 300px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            `;

            document.body.appendChild(messageDiv);

            setTimeout(() => {
                messageDiv.style.animation = 'slideOut 0.3s ease-out';
                setTimeout(() => messageDiv.remove(), 300);
            }, 5000);
        }

        initializeResponsiveManager() {
            const resizeHandler = debounce(() => {
                dispatchCustomEvent('prezzly:resize', { 
                    width: window.innerWidth, 
                    height: window.innerHeight,
                    isMobile: isMobile()
                });
            }, 250);

            window.addEventListener('resize', resizeHandler);
            return { resizeHandler };
        }

        initializeAccessibilityManager() {
            // Enhanced accessibility già gestita dal GoogleLayoutManager
            return { enabled: true };
        }

        initializeSmoothScrollManager() {
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

            return { enabled: true };
        }

        scrollToElement(element) {
            const headerHeight = 80;
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - headerHeight;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }

        initializePerformanceManager() {
            // Performance già gestita dal GoogleLayoutManager
            return { enabled: true };
        }

        initializeReviewManager() {
            const reviewForm = document.getElementById('reviewForm');
            if (!reviewForm) return null;

            reviewForm.addEventListener('submit', (e) => {
                this.handleReviewSubmit(e);
            });

            return { form: reviewForm };
        }

        handleReviewSubmit(e) {
            const ratingSelect = document.getElementById('rating');
            const confirmField = document.getElementById('confirm');
            
            if (ratingSelect && confirmField) {
                confirmField.value = ratingSelect.value;
            }

            const commentsField = document.getElementById('comments');
            if (commentsField && commentsField.value.length > 500) {
                e.preventDefault();
                this.showMessage('Il commento è troppo lungo (max 500 caratteri)', 'error');
                return;
            }

            this.showSubmitFeedback(e.target);
        }

        showSubmitFeedback(form) {
            const submitBtn = form.querySelector('.submit-review-btn');
            if (submitBtn) {
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Invio in corso...';
                submitBtn.disabled = true;

                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 3000);
            }
        }

        initializeImageManager() {
            // Image management già gestita dal GoogleLayoutManager
            return { enabled: true };
        }

        initializeShoppingListManager() {
            document.addEventListener('click', (e) => {
                const shoppingLink = e.target.closest('.shopping-list-link');
                if (shoppingLink && shoppingLink.href.includes('add=')) {
                    this.handleAddToShoppingList(e, shoppingLink);
                }
            });

            return { enabled: true };
        }

        handleAddToShoppingList(e, link) {
            e.preventDefault();
            
            const originalContent = link.innerHTML;
            link.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Aggiunta...';
            
            setTimeout(() => {
                link.classList.remove('add-to-list');
                link.classList.add('in-list');
                link.innerHTML = '<i class="fas fa-check"></i> Nella Lista';
                link.href = link.href.split('?')[0];
                
                this.showMessage('Prodotto aggiunto alla lista della spesa!', 'success');
                this.trackEvent('shopping_list_add');
            }, 500);
        }

        initializeFiltersManager() {
            const filtersForm = document.getElementById('refine');
            if (!filtersForm) return null;

            this.setupAutoSubmit(filtersForm);
            return { form: filtersForm };
        }

        setupAutoSubmit(form) {
            const inputs = form.querySelectorAll('select, input[type="number"]');
            
            inputs.forEach(input => {
                if (input.type === 'number') {
                    input.addEventListener('input', debounce(() => {
                        form.submit();
                    }, 1000));
                } else {
                    input.addEventListener('change', () => {
                        form.submit();
                    });
                }
            });
        }

        setupGlobalEventListeners() {
            // Listener per eventi custom
            document.addEventListener('prezzly:voice-search', (e) => {
                this.onVoiceSearch(e.detail);
            });

            document.addEventListener('prezzly:layout-change', (e) => {
                this.onLayoutChange(e.detail);
            });

            // Online/Offline detection
            window.addEventListener('online', () => {
                this.onConnectionChange(true);
            });

            window.addEventListener('offline', () => {
                this.onConnectionChange(false);
            });
        }

        onVoiceSearch(detail) {
            if (this.settings.debug) {
                console.log('🎤 Voice search completed:', detail);
            }
            
            this.trackEvent('voice_search_completed', {
                query_length: detail.query.length,
                confidence: detail.confidence
            });
        }

        onLayoutChange(detail) {
            if (this.settings.debug) {
                console.log('🔄 Layout changed:', detail);
            }
            
            this.trackEvent('layout_change', detail);
        }

        onConnectionChange(isOnline) {
            if (this.settings.debug) {
                console.log('🌐 Connection status:', isOnline ? 'Online' : 'Offline');
            }
            
            this.environment.onlineStatus = isOnline;
            
            if (!isOnline) {
                this.showMessage('Connessione persa. Alcune funzioni potrebbero non funzionare.', 'error');
            }
        }

        setupAnalytics() {
            if (!this.settings.enableAnalytics) return;

            // Setup Google Analytics se disponibile
            if (typeof gtag !== 'undefined') {
                this.trackEvent('prezzly_initialized', {
                    version: '2.0.0',
                    environment: this.environment.isMobile ? 'mobile' : 'desktop'
                });
            }

            // Setup performance tracking
            if ('PerformanceObserver' in window) {
                this.setupPerformanceTracking();
            }
        }

        setupPerformanceTracking() {
            try {
                // Track Core Web Vitals
                const observer = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (entry.name === 'first-contentful-paint') {
                            this.trackEvent('performance_fcp', { value: entry.startTime });
                        }
                        if (entry.name === 'largest-contentful-paint') {
                            this.trackEvent('performance_lcp', { value: entry.startTime });
                        }
                    }
                });

                observer.observe({ entryTypes: ['paint', 'largest-contentful-paint'] });
            } catch (error) {
                console.warn('Performance tracking not supported:', error);
            }
        }

        setupPerformanceMonitoring() {
            if (!this.settings.enablePerformanceOptimizations) return;

            // Monitor memory usage se disponibile
            if ('memory' in performance) {
                setInterval(() => {
                    const memInfo = performance.memory;
                    if (memInfo.usedJSHeapSize > memInfo.jsHeapSizeLimit * 0.9) {
                        console.warn('⚠️ High memory usage detected');
                        this.optimizeMemoryUsage();
                    }
                }, 30000); // Check ogni 30 secondi
            }

            // Monitor frame rate
            let lastTime = performance.now();
            let frameCount = 0;
            
            const checkFrameRate = (time) => {
                frameCount++;
                if (time - lastTime >= 1000) {
                    const fps = Math.round(frameCount * 1000 / (time - lastTime));
                    if (fps < 30) {
                        console.warn('⚠️ Low frame rate detected:', fps);
                        this.optimizePerformance();
                    }
                    frameCount = 0;
                    lastTime = time;
                }
                requestAnimationFrame(checkFrameRate);
            };
            
            requestAnimationFrame(checkFrameRate);
        }

        optimizeMemoryUsage() {
            // Cleanup non-essential data
            this.cleanupObservers();
            
            // Force garbage collection se disponibile
            if (window.gc) {
                window.gc();
            }
        }

        optimizePerformance() {
            // Disable non-essential animations
            document.body.classList.add('reduced-motion');
            
            // Reduce image quality
            document.querySelectorAll('img').forEach(img => {
                if (img.loading !== 'lazy') {
                    img.loading = 'lazy';
                }
            });
        }

        cleanupObservers() {
            // Cleanup observers from components
            Object.values(this.components).forEach(component => {
                if (component && typeof component.cleanup === 'function') {
                    component.cleanup();
                }
            });
        }

        onReady() {
            console.log('✅ Enhanced Prezzly Manager pronto');
            
            // Dispatch evento di ready
            dispatchCustomEvent('prezzly:ready', {
                version: '2.0.0',
                components: Object.keys(this.components),
                environment: this.environment,
                isInitialized: this.isInitialized
            });

            // Show readiness indicator se in debug mode
            if (this.settings.debug) {
                this.showDebugInfo();
            }

            // Track initialization time
            this.trackEvent('initialization_complete', {
                loadTime: performance.now(),
                componentsCount: Object.keys(this.components).length
            });
        }

        showDebugInfo() {
            console.table({
                'Voice Search': this.components.voice?.isAvailable() ? '✅' : '❌',
                'Google Layout': this.components.layout ? '✅' : '❌',
                'Mobile': this.environment.isMobile ? '📱' : '🖥️',
                'HTTPS': this.environment.isHttps ? '🔒' : '🔓',
                'Online': this.environment.onlineStatus ? '🌐' : '📴'
            });
        }

        handleInitializationError(error) {
            console.error('💥 Initialization failed:', error);
            
            // Fallback per funzionalità essenziali
            this.setupFallbackMode();
            
            // Track error
            this.trackEvent('initialization_error', {
                error: error.message,
                stack: error.stack
            });
        }

        setupFallbackMode() {
            console.log('🔧 Attivazione modalità fallback...');
            
            // Basic search functionality
            document.querySelectorAll('form[id="search"]').forEach(form => {
                form.addEventListener('submit', (e) => {
                    const input = form.querySelector('input[name="q"]');
                    if (!input?.value.trim()) {
                        e.preventDefault();
                        alert('Inserisci un termine di ricerca');
                    }
                });
            });
        }

        handleGlobalError(error) {
            if (this.settings.debug) {
                console.error('🚨 Handled global error:', error);
            }
            
            this.trackEvent('global_error', {
                error: error.message || error.toString()
            });
        }

        trackEvent(eventName, data = {}) {
            try {
                // Google Analytics
                if (typeof gtag !== 'undefined') {
                    gtag('event', eventName, {
                        event_category: 'prezzly_enhanced',
                        custom_map: data,
                        ...data
                    });
                }
                
                // Custom event
                dispatchCustomEvent(`prezzly:${eventName}`, data);
                
                if (this.settings.debug) {
                    console.log('📊 Event tracked:', eventName, data);
                }
            } catch (error) {
                console.warn('Analytics tracking failed:', error);
            }
        }

        // === API PUBBLICA ===

        // Getters per componenti
        getVoiceSearch() {
            return this.components.voice;
        }

        getLayoutManager() {
            return this.components.layout;
        }

        getComponent(name) {
            return this.components[name];
        }

        // Stato e configurazione
        isReady() {
            return this.isInitialized;
        }

        getEnvironment() {
            return { ...this.environment };
        }

        getSettings() {
            return { ...this.settings };
        }

        updateSettings(newSettings) {
            this.settings = { ...this.settings, ...newSettings };
            
            // Applica nuove impostazioni ai componenti
            if (newSettings.debug !== undefined) {
                console.log('🔧 Debug mode:', newSettings.debug ? 'enabled' : 'disabled');
            }
        }

        // Metodi di utilità
        triggerVoiceSearch() {
            const voiceBtn = document.querySelector('.voice-search-btn:not([style*="display: none"])');
            if (voiceBtn && this.components.voice) {
                this.components.voice.toggleListening(voiceBtn);
            } else {
                console.warn('Voice search not available');
            }
        }

        focusSearch() {
            const searchInput = document.querySelector('.search-input, input[name="q"], #q');
            if (searchInput) {
                searchInput.focus();
                searchInput.select();
                this.trackEvent('programmatic_focus_search');
            }
        }

        // Cleanup
        destroy() {
            console.log('🧹 Cleanup Enhanced Prezzly Manager...');
            
            // Cleanup components
            this.cleanupObservers();
            
            // Remove global styles
            const globalStyles = document.getElementById('prezzly-global-styles');
            if (globalStyles) {
                globalStyles.remove();
            }
            
            // Clear components
            this.components = {};
            this.isInitialized = false;
            
            console.log('✅ Cleanup completato');
        }
    }

    // === INIZIALIZZAZIONE PRINCIPALE ===

    // Inizializza l'enhanced manager
    window.prezzlyEnhanced = new EnhancedPrezzlyManager();

    // Esponi API globali per compatibilità e debugging
    window.prezzlyVoice = () => window.prezzlyEnhanced?.getVoiceSearch();
    window.prezzlyLayout = () => window.prezzlyEnhanced?.getLayoutManager();
    
    // Legacy compatibility
    window.PrezzlyApp = {
        getManager: (name) => window.prezzlyEnhanced?.getComponent(name),
        managers: window.prezzlyEnhanced?.components || {}
    };

    // Debugging helpers
    if (window.location.hostname === 'localhost' || window.location.search.includes('debug=true')) {
        window.prezzlyDebug = {
            enhanced: window.prezzlyEnhanced,
            components: () => window.prezzlyEnhanced?.components,
            environment: () => window.prezzlyEnhanced?.getEnvironment(),
            triggerVoice: () => window.prezzlyEnhanced?.triggerVoiceSearch(),
            focusSearch: () => window.prezzlyEnhanced?.focusSearch()
        };
        
        console.log('🔧 Debug mode enabled. Use window.prezzlyDebug for debugging.');
    }

    // Success message
    console.log('✨ Prezzly Enhanced Scripts loaded successfully!');

})();