<!-- Dati del venditore (da sostituire con variabili PHP) -->
<?php
// Esempio di variabili che dovrebbero venire dal database
$vendor = [
    'name' => 'Bauzaar IT',
    'logo' => '/logos/Bauzaar%20IT.img',
    'banner' => 'https://prezzly.it/negozio/images/banner_1.png',
    'description' => 'Benvenuti nel nostro negozio! Offriamo prodotti di alta qualità e un servizio clienti eccellente. Da oltre 10 anni siamo il punto di riferimento per i nostri clienti, garantendo sempre la massima professionalità e competenza nel settore.',
    'website' => 'https://www.sito-del-negozio.it',
    'phone' => '+391234567890',
    'whatsapp' => '391234567890',
    'email' => 'info@bauzaar-it.com',
    'rating' => 4.8,
    'reviews_count' => 156,
    'established_year' => 2014,
    'location' => 'Milano, Italia'
];
?>

<section class="vendor-page-section">
    <div class="vendor-page-container">

        <!-- Hero Banner Section -->
        <div class="vendor-hero-section">
            <?php if (!empty($vendor['banner'])): ?>
                <div class="vendor-banner">
                    <img 
                        src="<?php echo htmlspecialchars($vendor['banner']); ?>" 
                        alt="Banner <?php echo htmlspecialchars($vendor['name']); ?>"
                        class="vendor-banner-image"
                        loading="eager"
                    />
                    <div class="vendor-banner-overlay">
                        <div class="vendor-hero-content">
                            <h1 class="vendor-hero-title"><?php echo htmlspecialchars($vendor['name']); ?></h1>
                            <div class="vendor-hero-meta">
                                <div class="vendor-rating">
                                    <div class="stars">
                                        <?php for($i = 1; $i <= 5; $i++): ?>
                                            <i class="fas fa-star <?php echo $i <= floor($vendor['rating']) ? 'filled' : 'empty'; ?>"></i>
                                        <?php endfor; ?>
                                    </div>
                                    <span class="rating-text"><?php echo $vendor['rating']; ?> (<?php echo $vendor['reviews_count']; ?> recensioni)</span>
                                </div>
                                <div class="vendor-location">
                                    <i class="fas fa-map-marker-alt"></i>
                                    <span><?php echo htmlspecialchars($vendor['location']); ?></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            <?php endif; ?>
        </div>

        <!-- Vendor Information Section -->
        <div class="vendor-info-section">
            <div class="vendor-info-grid">
                
                <!-- Logo e Info Principali -->
                <div class="vendor-main-info">
                    <div class="vendor-logo-container">
                        <div class="vendor-logo">
                            <img 
                                src="<?php echo htmlspecialchars($vendor['logo']); ?>" 
                                alt="Logo <?php echo htmlspecialchars($vendor['name']); ?>"
                                class="vendor-logo-image"
                                onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
                            />
                            <div class="vendor-logo-fallback" style="display:none;">
                                <i class="fas fa-store"></i>
                                <span><?php echo substr($vendor['name'], 0, 2); ?></span>
                            </div>
                        </div>
                        
                        <div class="vendor-badges">
                            <span class="vendor-badge verified">
                                <i class="fas fa-check-circle"></i>
                                Verificato
                            </span>
                            <span class="vendor-badge established">
                                <i class="fas fa-calendar-alt"></i>
                                Dal <?php echo $vendor['established_year']; ?>
                            </span>
                        </div>
                    </div>

                    <div class="vendor-description">
                        <h2>Chi Siamo</h2>
                        <p><?php echo htmlspecialchars($vendor['description']); ?></p>
                    </div>
                </div>

                <!-- Contact Actions -->
                <div class="vendor-contact-section">
                    <h3 class="contact-title">Contattaci</h3>
                    
                    <div class="contact-buttons">
                        
                        <a href="<?php echo htmlspecialchars($vendor['website']); ?>" 
                           class="contact-btn primary-btn" 
                           target="_blank" 
                           rel="noopener">
                            <i class="fas fa-globe"></i>
                            <div class="btn-content">
                                <span class="btn-label">Visita Sito</span>
                                <small class="btn-description">Vai al negozio online</small>
                            </div>
                        </a>

                        <a href="tel:<?php echo htmlspecialchars($vendor['phone']); ?>" 
                           class="contact-btn phone-btn">
                            <i class="fas fa-phone"></i>
                            <div class="btn-content">
                                <span class="btn-label">Chiama Ora</span>
                                <small class="btn-description"><?php echo htmlspecialchars($vendor['phone']); ?></small>
                            </div>
                        </a>

                        <a href="https://wa.me/<?php echo htmlspecialchars($vendor['whatsapp']); ?>" 
                           class="contact-btn whatsapp-btn" 
                           target="_blank" 
                           rel="noopener">
                            <i class="fab fa-whatsapp"></i>
                            <div class="btn-content">
                                <span class="btn-label">WhatsApp</span>
                                <small class="btn-description">Messaggio diretto</small>
                            </div>
                        </a>

                        <a href="mailto:<?php echo htmlspecialchars($vendor['email']); ?>" 
                           class="contact-btn email-btn">
                            <i class="fas fa-envelope"></i>
                            <div class="btn-content">
                                <span class="btn-label">Email</span>
                                <small class="btn-description">Scrivici una mail</small>
                            </div>
                        </a>

                    </div>

                    <!-- Trust Signals -->
                    <div class="trust-signals">
                        <div class="trust-item">
                            <i class="fas fa-shield-alt"></i>
                            <span>Acquisti Sicuri</span>
                        </div>
                        <div class="trust-item">
                            <i class="fas fa-shipping-fast"></i>
                            <span>Spedizione Veloce</span>
                        </div>
                        <div class="trust-item">
                            <i class="fas fa-undo"></i>
                            <span>Reso Facile</span>
                        </div>
                        <div class="trust-item">
                            <i class="fas fa-headset"></i>
                            <span>Supporto 24/7</span>
                        </div>
                    </div>

                </div>

            </div>
        </div>

        <!-- Additional Info Section -->
        <div class="vendor-additional-info">
            <div class="info-cards-grid">
                
                <div class="info-card">
                    <div class="info-card-icon">
                        <i class="fas fa-award"></i>
                    </div>
                    <div class="info-card-content">
                        <h4>Qualità Garantita</h4>
                        <p>Tutti i nostri prodotti sono selezionati per offrire la massima qualità</p>
                    </div>
                </div>

                <div class="info-card">
                    <div class="info-card-icon">
                        <i class="fas fa-users"></i>
                    </div>
                    <div class="info-card-content">
                        <h4>Clienti Soddisfatti</h4>
                        <p>Oltre <?php echo $vendor['reviews_count']; ?> clienti hanno scelto il nostro servizio</p>
                    </div>
                </div>

                <div class="info-card">
                    <div class="info-card-icon">
                        <i class="fas fa-clock"></i>
                    </div>
                    <div class="info-card-content">
                        <h4>Esperienza</h4>
                        <p><?php echo date('Y') - $vendor['established_year']; ?> anni di esperienza nel settore</p>
                    </div>
                </div>

                <div class="info-card">
                    <div class="info-card-icon">
                        <i class="fas fa-thumbs-up"></i>
                    </div>
                    <div class="info-card-content">
                        <h4>Affidabilità</h4>
                        <p>Rating medio di <?php echo $vendor['rating']; ?>/5 stelle</p>
                    </div>
                </div>

            </div>
        </div>

    </div>
</section>

<!-- Sezione Prodotti del Venditore -->
<section class="vendor-products-section">
    <div class="vendor-products-container">
        <header class="vendor-products-header">
            <h2>I Nostri Prodotti</h2>
            <p>Scopri la nostra selezione di prodotti di qualità</p>
        </header>
        
        <!-- Qui andrà inclusa la lista prodotti del venditore -->
        <div class="vendor-products-grid">
            <?php
            // Qui andrà il codice PHP per mostrare i prodotti del venditore
            // require("vendor_products.php");
            ?>
            
            <!-- Placeholder per i prodotti -->
            <div class="products-placeholder">
                <div class="placeholder-content">
                    <i class="fas fa-boxes"></i>
                    <h3>Prodotti in Caricamento</h3>
                    <p>I prodotti di questo venditore verranno mostrati qui</p>
                    <a href="#" class="view-products-btn">
                        <i class="fas fa-eye"></i>
                        Vedi Tutti i Prodotti
                    </a>
                </div>
            </div>
            
        </div>
    </div>
</section>