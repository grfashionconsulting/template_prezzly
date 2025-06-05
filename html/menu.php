<?php
// Determina se siamo nella homepage Google style
$isGoogleHomepage = !isset($_GET['q']) && !isset($parts[1]) && basename($_SERVER['PHP_SELF']) == 'index.php';

// Se siamo nella homepage Google, il menu è già gestito da searchform.php
if ($isGoogleHomepage) {
    return;
}
?>

<!-- Menu Navigation Results Style - Solo per pagine non-homepage -->
<nav class="nav-menu-results">
    <div class="nav-menu-content">
        <!-- Link "Tutti" per ricerca generale -->
        <a href="<?php print $config_baseHREF; ?>search.php<?php echo isset($q) ? '?q=' . urlencode($q) : ''; ?>" 
           class="<?php echo (strpos($_SERVER['REQUEST_URI'], 'search.php') !== false && !isset($_GET['categoryFilter']) && !isset($_GET['brandFilter']) && !isset($_GET['merchantFilter'])) ? 'active' : ''; ?>">
            <i class="fas fa-search"></i> Tutti
        </a>
        
        <!-- Dropdown Categorie -->
        <?php if (isset($config_useCategoryHierarchy) && $config_useCategoryHierarchy): ?>
            <div class="nav-dropdown">
                <a href="#" class="dropdown-toggle" data-category="0">
                    <i class="fas fa-th-large"></i> Categorie
                    <i class="fas fa-chevron-down dropdown-arrow"></i>
                </a>
                <div class="nav-dropdown-menu" id="categoriesDropdown">
                    <div class="loading-spinner"></div>
                </div>
            </div>
        <?php else: ?>
            <a href="<?php print tapestry_indexHREF("category"); ?>" 
               class="<?php echo (strpos($_SERVER['REQUEST_URI'], 'category') !== false) ? 'active' : ''; ?>">
                <i class="fas fa-th-large"></i> Categorie
            </a>
        <?php endif; ?>
        
        <!-- Link Marchi -->
        <a href="<?php print tapestry_indexHREF("brand"); ?>"
           class="<?php echo (strpos($_SERVER['REQUEST_URI'], 'brand') !== false) ? 'active' : ''; ?>">
            <i class="fas fa-tags"></i> Marchi
        </a>
        
        <!-- Link Negozi -->
        <a href="<?php print tapestry_indexHREF("merchant"); ?>"
           class="<?php echo (strpos($_SERVER['REQUEST_URI'], 'merchant') !== false) ? 'active' : ''; ?>">
            <i class="fas fa-store"></i> Negozi
        </a>
        
        <!-- Link Offerte/Voucher -->
        <?php if (isset($config_useVoucherCodes) && $config_useVoucherCodes): ?>
            <a href="<?php print $config_baseHREF; ?>vouchers.php"
               class="<?php echo (strpos($_SERVER['REQUEST_URI'], 'vouchers.php') !== false) ? 'active' : ''; ?>">
                <i class="fas fa-ticket-alt"></i> Offerte
            </a>
        <?php endif; ?>

        <!-- Dropdown Filtri Avanzati -->
        <div class="nav-dropdown">
            <a href="#" class="dropdown-toggle">
                <i class="fas fa-filter"></i> Filtri
                <i class="fas fa-chevron-down dropdown-arrow"></i>
            </a>
            <div class="nav-dropdown-menu" id="filtersDropdown">
                <!-- Filtri rapidi -->
                <a href="<?php print $config_baseHREF; ?>search.php<?php echo isset($q) ? '?q=' . urlencode($q) . '&' : '?'; ?>sort=price_asc">
                    <i class="fas fa-sort-amount-up"></i> Prezzo crescente
                </a>
                <a href="<?php print $config_baseHREF; ?>search.php<?php echo isset($q) ? '?q=' . urlencode($q) . '&' : '?'; ?>sort=price_desc">
                    <i class="fas fa-sort-amount-down"></i> Prezzo decrescente
                </a>
                <a href="<?php print $config_baseHREF; ?>search.php<?php echo isset($q) ? '?q=' . urlencode($q) . '&' : '?'; ?>sort=name_asc">
                    <i class="fas fa-sort-alpha-up"></i> Nome A-Z
                </a>
                <a href="<?php print $config_baseHREF; ?>search.php<?php echo isset($q) ? '?q=' . urlencode($q) . '&' : '?'; ?>sort=popular">
                    <i class="fas fa-star"></i> Più popolari
                </a>
            </div>
        </div>

        <!-- Link Shopping List se abilitata -->
        <?php if (isset($config_useShoppingList) && $config_useShoppingList): ?>
            <a href="<?php print tapestry_shoppingListHREF(); ?>"
               class="<?php echo (strpos($_SERVER['REQUEST_URI'], 'shoppinglist') !== false) ? 'active' : ''; ?> shopping-list-nav">
                <i class="fas fa-shopping-cart"></i> 
                Lista 
                <span class="nav-count">(<?php $menu_shoppingList = tapestry_shoppingList(); print count($menu_shoppingList); ?>)</span>
            </a>
        <?php endif; ?>

    </div>
</nav>

<!-- Menu Mobile Toggle per risultati -->
<div class="mobile-nav-toggle" id="mobileNavToggle">
    <button class="mobile-nav-btn">
        <i class="fas fa-bars"></i>
        <span>Menu</span>
    </button>
</div>

<!-- Menu Mobile Overlay -->
<div class="mobile-nav-overlay" id="mobileNavOverlay">
    <div class="mobile-nav-content">
        <div class="mobile-nav-header">
            <h3>Navigazione</h3>
            <button class="mobile-nav-close" id="mobileNavClose">
                <i class="fas fa-times"></i>
            </button>
        </div>
        
        <div class="mobile-nav-links">
            <a href="<?php print $config_baseHREF; ?>search.php<?php echo isset($q) ? '?q=' . urlencode($q) : ''; ?>">
                <i class="fas fa-search"></i> Tutti i risultati
            </a>
            
            <a href="<?php print tapestry_indexHREF("category"); ?>">
                <i class="fas fa-th-large"></i> Categorie
            </a>
            
            <a href="<?php print tapestry_indexHREF("brand"); ?>">
                <i class="fas fa-tags"></i> Marchi
            </a>
            
            <a href="<?php print tapestry_indexHREF("merchant"); ?>">
                <i class="fas fa-store"></i> Negozi
            </a>
            
            <?php if (isset($config_useVoucherCodes) && $config_useVoucherCodes): ?>
                <a href="<?php print $config_baseHREF; ?>vouchers.php">
                    <i class="fas fa-ticket-alt"></i> Offerte
                </a>
            <?php endif; ?>
            
            <?php if (isset($config_useShoppingList) && $config_useShoppingList): ?>
                <a href="<?php print tapestry_shoppingListHREF(); ?>">
                    <i class="fas fa-shopping-cart"></i> 
                    Lista della spesa 
                    <span class="nav-count">(<?php print count($menu_shoppingList); ?>)</span>
                </a>
            <?php endif; ?>
            
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
            
            <!-- Filtri rapidi mobile -->
            <div class="mobile-quick-filters">
                <h4>Ordina per:</h4>
                <a href="<?php print $config_baseHREF; ?>search.php<?php echo isset($q) ? '?q=' . urlencode($q) . '&' : '?'; ?>sort=price_asc">
                    <i class="fas fa-sort-amount-up"></i> Prezzo crescente
                </a>
                <a href="<?php print $config_baseHREF; ?>search.php<?php echo isset($q) ? '?q=' . urlencode($q) . '&' : '?'; ?>sort=price_desc">
                    <i class="fas fa-sort-amount-down"></i> Prezzo decrescente
                </a>
                <a href="<?php print $config_baseHREF; ?>search.php<?php echo isset($q) ? '?q=' . urlencode($q) . '&' : '?'; ?>sort=name_asc">
                    <i class="fas fa-sort-alpha-up"></i> Nome A-Z
                </a>
            </div>
        </div>
    </div>
</div>

<script>
// Gestione menu mobile per layout risultati
document.addEventListener('DOMContentLoaded', function() {
    const mobileToggle = document.getElementById('mobileNavToggle');
    const mobileOverlay = document.getElementById('mobileNavOverlay');
    const mobileClose = document.getElementById('mobileNavClose');
    
    if (mobileToggle && mobileOverlay) {
        mobileToggle.addEventListener('click', function() {
            mobileOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        function closeMobileNav() {
            mobileOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
        
        if (mobileClose) {
            mobileClose.addEventListener('click', closeMobileNav);
        }
        
        mobileOverlay.addEventListener('click', function(e) {
            if (e.target === mobileOverlay) {
                closeMobileNav();
            }
        });
        
        // Chiudi con ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mobileOverlay.classList.contains('active')) {
                closeMobileNav();
            }
        });
    }
});
</script>