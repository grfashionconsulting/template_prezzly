<?php
// Determina se siamo nella homepage o in altre pagine
$isHomepage = (basename($_SERVER['PHP_SELF']) == 'index.php' && !isset($_GET['q']) && !isset($parts[1]));
?>

<script type="text/javascript">
$(function() {
    // Autocomplete per entrambi i campi di ricerca
    $(".search-input").autocomplete({
        source: function(request, response) {
            $.ajax({
                url: "<?php print $config_baseHREF; ?>searchJSON.php",
                dataType: "json",
                data: { q: request.term },
                success: function(data) {
                    response($.map(data.products, function(item) { 
                        return { label: item.name, value: item.name }; 
                    }));
                }
            });
        },
        minLength: 2,
        open: function() { 
            $(this).removeClass("ui-corner-all").addClass("ui-corner-top"); 
        },
        close: function() { 
            $(this).removeClass("ui-corner-top").addClass("ui-corner-all"); 
        }
    }).keydown(function(e){ 
        if (e.keyCode === 13) { 
            $(this).closest('form').trigger('submit'); 
        }
    });
});
</script>

<?php if ($isHomepage): ?>
<!-- LAYOUT HOMEPAGE TIPO GOOGLE -->
<div class="homepage-layout">
    <!-- Header minimale -->
    <header class="homepage-header">
        <div class="homepage-header-links">
            <a href="<?php print tapestry_indexHREF("merchant"); ?>">Negozi</a>
            <a href="<?php print tapestry_indexHREF("category"); ?>">Categorie</a>
            <?php if (isset($config_useShoppingList) && $config_useShoppingList): ?>
                <a href="<?php print tapestry_shoppingListHREF(); ?>" class="shopping-link">
                    <i class="fas fa-shopping-cart"></i>
                    Lista (<?php $menu_shoppingList = tapestry_shoppingList(); print count($menu_shoppingList); ?>)
                </a>
            <?php endif; ?>
        </div>
    </header>

    <!-- Contenuto principale centrato -->
    <main class="homepage-main">
        <!-- Logo grande centrato -->
        <div class="homepage-logo">
            <img src="<?php print $config_baseHREF; ?>images/logo.png" alt="Prezzly" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
            <h1 class="logo-text" style="display:none;">Prezzly</h1>
        </div>

        <!-- Form di ricerca centrato -->
        <div class="homepage-search">
            <form id="search" name="search" action="<?php print $config_baseHREF ?>search.php" class="search-form-homepage">
                <div class="search-container-homepage">
                    <input 
                        id="q" 
                        name="q" 
                        required="required" 
                        type="text" 
                        class="search-input search-input-homepage"
                        placeholder="Cerca prodotti, marchi, negozi..." 
                        value=""
                        autocomplete="off"
                    >
                    <div class="search-icons-homepage">
                        <button type="button" class="search-icon-btn voice-search-btn" title="Ricerca vocale">
                            <i class="fas fa-microphone"></i>
                        </button>
                        <button type="submit" class="search-icon-btn search-submit-btn" title="Cerca">
                            <i class="fas fa-search"></i>
                        </button>
                    </div>
                </div>
            </form>
        </div>

        <!-- Pulsanti azione -->
        <div class="homepage-buttons">
            <button type="submit" form="search" class="google-btn">Cerca su Prezzly</button>
            <a href="<?php print tapestry_indexHREF("category"); ?>" class="google-btn">Sfoglia Categorie</a>
        </div>

        <!-- Link rapidi opzionali -->
        <div class="homepage-quick-links">
            <p>Ricerche popolari:</p>
            <div class="quick-links-container">
                <a href="<?php print $config_baseHREF; ?>search.php?q=iPhone">iPhone</a>
                <a href="<?php print $config_baseHREF; ?>search.php?q=Samsung">Samsung</a>
                <a href="<?php print $config_baseHREF; ?>search.php?q=PlayStation">PlayStation</a>
                <a href="<?php print $config_baseHREF; ?>search.php?q=iPad">iPad</a>
            </div>
        </div>
    </main>
</div>

<?php else: ?>
<!-- LAYOUT RISULTATI TIPO GOOGLE -->
<div class="results-header">
    <div class="results-header-content">
        <!-- Logo piccolo a sinistra -->
        <div class="results-logo">
            <a href="<?php print $config_baseHREF; ?>">
                <img src="<?php print $config_baseHREF; ?>images/logo.png" alt="Prezzly" onerror="this.style.display='none'; this.nextElementSibling.style.display='inline';">
                <span class="logo-text" style="display:none;">Prezzly</span>
            </a>
        </div>
        
        <!-- Form di ricerca a destra del logo -->
        <div class="results-search">
            <form id="search" name="search" action="<?php print $config_baseHREF ?>search.php" class="search-form-results">
                <div class="search-container-results">
                    <input 
                        id="q" 
                        name="q" 
                        required="required" 
                        type="text" 
                        class="search-input search-input-results"
                        placeholder="Cerca..." 
                        value="<?php print ((isset($q) && !isset($parts[1]) && !isset($product["products"])) ? htmlspecialchars($q, ENT_QUOTES, $config_charset) : ""); ?>"
                        autocomplete="off"
                    >
                    <div class="search-icons-results">
                        <button type="button" class="search-icon-btn voice-search-btn" title="Ricerca vocale">
                            <i class="fas fa-microphone"></i>
                        </button>
                        <button type="submit" class="search-icon-btn search-submit-btn" title="Cerca">
                            <i class="fas fa-search"></i>
                        </button>
                    </div>
                </div>
            </form>
        </div>

        <!-- Azioni aggiuntive -->
        <div class="results-actions">
            <?php if (isset($config_useShoppingList) && $config_useShoppingList): ?>
                <a href="<?php print tapestry_shoppingListHREF(); ?>" class="action-link" title="Lista della spesa">
                    <i class="fas fa-shopping-cart"></i>
                    <span class="action-count"><?php $menu_shoppingList = tapestry_shoppingList(); print count($menu_shoppingList); ?></span>
                </a>
            <?php endif; ?>
            <button class="search-icon-btn menu-toggle-btn" title="Menu">
                <i class="fas fa-bars"></i>
            </button>
        </div>
    </div>
</div>

<!-- Menu navigazione sotto l'header -->
<nav class="nav-menu-results">
    <div class="nav-menu-content">
        <a href="<?php print $config_baseHREF; ?>search.php<?php echo isset($q) ? '?q=' . urlencode($q) : ''; ?>" 
           class="<?php echo (strpos($_SERVER['REQUEST_URI'], 'search.php') !== false && !isset($_GET['categoryFilter']) && !isset($_GET['brandFilter'])) ? 'active' : ''; ?>">
            <i class="fas fa-search"></i> Tutti
        </a>
        
        <?php if (isset($config_useCategoryHierarchy) && $config_useCategoryHierarchy): ?>
            <div class="nav-dropdown">
                <a href="#" class="dropdown-toggle">
                    <i class="fas fa-th-large"></i> Categorie
                    <i class="fas fa-chevron-down dropdown-arrow"></i>
                </a>
                <div class="nav-dropdown-menu" id="categoriesDropdown">
                    <div class="loading-spinner"></div>
                </div>
            </div>
        <?php else: ?>
            <a href="<?php print tapestry_indexHREF("category"); ?>">
                <i class="fas fa-th-large"></i> Categorie
            </a>
        <?php endif; ?>
        
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
    </div>
</nav>

<?php endif; ?>

<!-- Voice Search Feedback (presente in entrambi i layout) -->
<div class="voice-feedback" id="voiceFeedback">
    <div class="voice-microphone">
        <i class="fas fa-microphone"></i>
    </div>
    <p id="voiceStatus">Sto ascoltando...</p>
    <button type="button" class="voice-cancel-btn" onclick="window.prezzlyVoice?.stopListening()">
        <i class="fas fa-times"></i>
    </button>
</div>