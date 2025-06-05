<?php
// Variabili di esempio - sostituire con dati reali del database
$vendor_name = "Bauzaar IT";
$vendor_logo = "/logos/Bauzaar%20IT.img";
$vendor_banner = "https://prezzly.it/negozio/images/banner_1.png";
$vendor_description = "Benvenuti nel nostro negozio! Offriamo prodotti di alta qualità e un servizio clienti eccellente.";
$vendor_website = "https://www.sito-del-negozio.it";
$vendor_phone = "+391234567890";
$vendor_whatsapp = "391234567890";
$vendor_email = "info@bauzaar-it.com";
?>

<!-- Banner Sezione -->
<?php if (!empty($vendor_banner)): ?>
<section class="vendor-banner-simple">
    <img src="<?php echo htmlspecialchars($vendor_banner); ?>" 
         alt="Banner <?php echo htmlspecialchars($vendor_name); ?>"
         class="banner-image-simple">
</section>
<?php endif; ?>

<!-- Contenuto Principale Venditore -->
<section class="vendor-main-simple">
    <div class="vendor-content-grid">
        
        <!-- Logo -->
        <div class="vendor-logo-section">
            <div class="logo-container-simple">
                <img src="<?php echo htmlspecialchars($vendor_logo); ?>" 
                     alt="Logo <?php echo htmlspecialchars($vendor_name); ?>"
                     class="vendor-logo-simple"
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                <div class="logo-fallback-simple" style="display:none;">
                    <i class="fas fa-store"></i>
                </div>
            </div>
        </div>

        <!-- Descrizione -->
        <div class="vendor-description-section">
            <h1 class="vendor-name"><?php echo htmlspecialchars($vendor_name); ?></h1>
            <p class="vendor-description-text">
                <?php echo htmlspecialchars($vendor_description); ?>
            </p>
        </div>

        <!-- Pulsanti Contatto -->
        <div class="vendor-actions-section">
            <div class="contact-buttons-simple">
                
                <a href="mailto:<?php echo htmlspecialchars($vendor_email); ?>" 
                   class="contact-btn-simple contact-email">
                    <i class="fas fa-envelope"></i>
                    <span>Contattaci</span>
                </a>

                <a href="tel:<?php echo htmlspecialchars($vendor_phone); ?>" 
                   class="contact-btn-simple contact-phone">
                    <i class="fas fa-phone"></i>
                    <span>Chiamaci</span>
                </a>

                <a href="https://wa.me/<?php echo htmlspecialchars($vendor_whatsapp); ?>" 
                   class="contact-btn-simple contact-whatsapp" 
                   target="_blank" 
                   rel="noopener">
                    <i class="fab fa-whatsapp"></i>
                    <span>WhatsApp</span>
                </a>

                <?php if (!empty($vendor_website)): ?>
                <a href="<?php echo htmlspecialchars($vendor_website); ?>" 
                   class="contact-btn-simple contact-website" 
                   target="_blank" 
                   rel="noopener">
                    <i class="fas fa-globe"></i>
                    <span>Sito Web</span>
                </a>
                <?php endif; ?>

            </div>
        </div>

    </div>
</section>