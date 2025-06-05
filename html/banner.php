<?php
// Determina se siamo nella homepage Google style
$isGoogleHomepage = !isset($_GET['q']) && !isset($parts[1]) && basename($_SERVER['PHP_SELF']) == 'index.php';

// Se siamo nella homepage Google, non mostrare breadcrumbs tradizionali
if ($isGoogleHomepage) {
    return;
}
?>

<!-- Breadcrumbs per layout risultati Google style -->
<div class="breadcrumbs-container-google">
    <div class="breadcrumbs-content">
        <nav class="breadcrumbs" aria-label="Breadcrumb">
            <ol class="breadcrumb-list">
                <li class="breadcrumb-item">
                    <a href="<?php print $config_baseHREF; ?>">
                        <i class="fas fa-home"></i>
                        <span class="sr-only"><?php print translate("Home"); ?></span>
                    </a>
                </li>
                <?php
                    if (isset($banner["breadcrumbs"])) {
                        $i = 0;
                        $c = count($banner["breadcrumbs"]);
                        
                        foreach($banner["breadcrumbs"] as $breadcrumb) {
                            $i++;
                            $isCurrent = ($i == $c);
                            
                            echo '<li class="breadcrumb-item' . ($isCurrent ? ' current' : '') . '">';
                            if ($isCurrent) {
                                echo '<span aria-current="page" class="breadcrumb-current">' . $breadcrumb["title"] . '</span>';
                            } else {
                                echo '<a href="' . $breadcrumb["href"] . '" class="breadcrumb-link">' . $breadcrumb["title"] . '</a>';
                            }
                            echo '</li>';
                        }
                    } elseif(isset($banner["h2"])) {
                        $banner["h2"] = strip_tags($banner["h2"]);
                        $parts = explode("/", $banner["h2"]);
                        
                        foreach($parts as $part) {
                            echo '<li class="breadcrumb-item current">';
                            echo '<span aria-current="page" class="breadcrumb-current">' . trim($part) . '</span>';
                            echo '</li>';
                        }
                    }
                ?>
            </ol>
        </nav>

        <!-- Informazioni risultati/pagina -->
        <?php if (isset($banner["h3"]) || isset($q)): ?>
            <div class="page-info">
                <?php 
                // Mostra info sui risultati se siamo in una ricerca
                if (isset($q) && isset($navigation["resultCount"])) {
                    $resultCount = number_format($navigation["resultCount"], 0, ',', '.');
                    $searchTime = isset($searchTime) ? $searchTime : '0.42';
                    echo '<p class="search-info">';
                    echo 'Circa ' . $resultCount . ' risultati (' . $searchTime . ' secondi) per ';
                    echo '<strong>"' . htmlspecialchars($q, ENT_QUOTES, $config_charset) . '"</strong>';
                    echo '</p>';
                } elseif (isset($banner["h3"])) {
                    // Processa banner h3 per mobile break
                    $h3Content = $banner["h3"];
                    if (strpos($_SERVER["PHP_SELF"], "search.php") || strpos($_SERVER["PHP_SELF"], "categories.php")) {
                        $h3Content = str_replace(" | ".translate("Price"), " <br class='mobile-break' />".translate("Price"), $h3Content);
                    }
                    echo '<h1 class="page-title">' . $h3Content . '</h1>';
                }
                ?>
            </div>
        <?php endif; ?>

        <!-- Filtri attivi (se presenti) -->
        <?php if (isset($_GET['categoryFilter']) || isset($_GET['brandFilter']) || isset($_GET['merchantFilter']) || isset($_GET['minPrice']) || isset($_GET['maxPrice'])): ?>
            <div class="active-filters">
                <span class="filters-label">
                    <i class="fas fa-filter"></i> Filtri attivi:
                </span>
                <div class="active-filters-list">
                    <?php if (isset($_GET['categoryFilter']) && $_GET['categoryFilter']): ?>
                        <span class="active-filter">
                            Categoria: <?php echo htmlspecialchars($_GET['categoryFilter'], ENT_QUOTES, $config_charset); ?>
                            <a href="<?php echo $this->removeFilterFromUrl('categoryFilter'); ?>" class="remove-filter">
                                <i class="fas fa-times"></i>
                            </a>
                        </span>
                    <?php endif; ?>
                    
                    <?php if (isset($_GET['brandFilter']) && $_GET['brandFilter']): ?>
                        <span class="active-filter">
                            Marchio: <?php echo htmlspecialchars($_GET['brandFilter'], ENT_QUOTES, $config_charset); ?>
                            <a href="<?php echo $this->removeFilterFromUrl('brandFilter'); ?>" class="remove-filter">
                                <i class="fas fa-times"></i>
                            </a>
                        </span>
                    <?php endif; ?>
                    
                    <?php if (isset($_GET['merchantFilter']) && $_GET['merchantFilter']): ?>
                        <span class="active-filter">
                            Negozio: <?php echo htmlspecialchars($_GET['merchantFilter'], ENT_QUOTES, $config_charset); ?>
                            <a href="<?php echo $this->removeFilterFromUrl('merchantFilter'); ?>" class="remove-filter">
                                <i class="fas fa-times"></i>
                            </a>
                        </span>
                    <?php endif; ?>
                    
                    <?php if ((isset($_GET['minPrice']) && $_GET['minPrice']) || (isset($_GET['maxPrice']) && $_GET['maxPrice'])): ?>
                        <span class="active-filter">
                            Prezzo: 
                            <?php 
                            if (isset($_GET['minPrice']) && $_GET['minPrice']) {
                                echo '€' . htmlspecialchars($_GET['minPrice'], ENT_QUOTES, $config_charset);
                            } else {
                                echo '€0';
                            }
                            echo ' - ';
                            if (isset($_GET['maxPrice']) && $_GET['maxPrice']) {
                                echo '€' . htmlspecialchars($_GET['maxPrice'], ENT_QUOTES, $config_charset);
                            } else {
                                echo '∞';
                            }
                            ?>
                            <a href="<?php echo $this->removeFilterFromUrl(['minPrice', 'maxPrice']); ?>" class="remove-filter">
                                <i class="fas fa-times"></i>
                            </a>
                        </span>
                    <?php endif; ?>
                    
                    <!-- Link rimuovi tutti i filtri -->
                    <a href="<?php echo $this->removeAllFilters(); ?>" class="clear-all-filters">
                        <i class="fas fa-times-circle"></i> Rimuovi tutti
                    </a>
                </div>
            </div>
        <?php endif; ?>

        <!-- Suggerimenti di ricerca -->
        <?php if (isset($q) && isset($navigation["resultCount"]) && $navigation["resultCount"] == 0): ?>
            <div class="search-suggestions">
                <p class="suggestions-title">
                    <i class="fas fa-lightbulb"></i> Prova invece:
                </p>
                <div class="suggestions-list">
                    <?php
                    // Genera suggerimenti basati sulla query
                    $suggestions = $this->generateSearchSuggestions($q);
                    foreach ($suggestions as $suggestion) {
                        echo '<a href="' . $config_baseHREF . 'search.php?q=' . urlencode($suggestion) . '" class="suggestion-link">';
                        echo htmlspecialchars($suggestion, ENT_QUOTES, $config_charset);
                        echo '</a>';
                    }
                    ?>
                </div>
            </div>
        <?php endif; ?>

    </div>
</div>

<style>
/* Stili specifici per breadcrumbs Google style */
.breadcrumbs-container-google {
    background: white;
    border-bottom: 1px solid var(--google-border);
    padding: 15px 0 20px;
    margin-bottom: 0;
}

.breadcrumbs-content {
    max-width: var(--container-max-width);
    margin: 0 auto;
    padding: 0 20px;
    margin-left: 170px; /* Allinea con search box */
}

.breadcrumb-list {
    list-style: none;
    margin: 0 0 10px 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    font-size: 13px;
}

.breadcrumb-item {
    display: flex;
    align-items: center;
}

.breadcrumb-item:not(:last-child)::after {
    content: '>';
    color: var(--text-light);
    margin-left: 8px;
    font-size: 11px;
}

.breadcrumb-item a {
    color: var(--primary-color);
    text-decoration: none;
    font-size: 13px;
}

.breadcrumb-item a:hover {
    text-decoration: underline;
}

.breadcrumb-current {
    color: var(--text-light);
    font-size: 13px;
}

.search-info {
    color: var(--text-light);
    font-size: 14px;
    margin: 0;
}

.page-title {
    color: var(--text-color);
    font-size: 20px;
    margin: 0;
    font-weight: 400;
}

.active-filters {
    margin: 15px 0 0 0;
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
}

.filters-label {
    color: var(--text-light);
    font-size: 13px;
    font-weight: 600;
}

.active-filters-list {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    align-items: center;
}

.active-filter {
    background: var(--primary-color);
    color: white;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 12px;
    display: flex;
    align-items: center;
    gap: 5px;
}

.remove-filter {
    color: white;
    text-decoration: none;
    opacity: 0.8;
}

.remove-filter:hover {
    opacity: 1;
}

.clear-all-filters {
    color: var(--danger-color);
    text-decoration: none;
    font-size: 12px;
    padding: 4px 8px;
    border-radius: 4px;
    transition: background-color 0.3s;
}

.clear-all-filters:hover {
    background: rgba(220, 53, 69, 0.1);
    text-decoration: none;
}

.search-suggestions {
    margin: 15px 0 0 0;
    padding: 15px;
    background: var(--google-gray);
    border-radius: 8px;
}

.suggestions-title {
    color: var(--text-color);
    font-size: 14px;
    margin: 0 0 10px 0;
    font-weight: 600;
}

.suggestions-list {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

.suggestion-link {
    color: var(--primary-color);
    text-decoration: none;
    padding: 4px 8px;
    border-radius: 4px;
    background: white;
    font-size: 13px;
    transition: all 0.3s;
}

.suggestion-link:hover {
    background: var(--primary-color);
    color: white;
    text-decoration: none;
}

/* Mobile responsive */
@media (max-width: 768px) {
    .breadcrumbs-content {
        margin-left: 0;
        padding: 0 15px;
    }
    
    .breadcrumb-list {
        font-size: 12px;
    }
    
    .mobile-break {
        display: block;
    }
    
    .active-filters {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
    }
    
    .page-title {
        font-size: 18px;
    }
}
</style>

<?php
// Helper functions per la gestione dei filtri
if (!function_exists('removeFilterFromUrl')) {
    function removeFilterFromUrl($filterName) {
        $params = $_GET;
        if (is_array($filterName)) {
            foreach ($filterName as $name) {
                unset($params[$name]);
            }
        } else {
            unset($params[$filterName]);
        }
        
        $baseUrl = strtok($_SERVER["REQUEST_URI"], '?');
        return $baseUrl . (empty($params) ? '' : '?' . http_build_query($params));
    }
}

if (!function_exists('removeAllFilters')) {
    function removeAllFilters() {
        $params = $_GET;
        unset($params['categoryFilter']);
        unset($params['brandFilter']);
        unset($params['merchantFilter']);
        unset($params['minPrice']);
        unset($params['maxPrice']);
        
        $baseUrl = strtok($_SERVER["REQUEST_URI"], '?');
        return $baseUrl . (empty($params) ? '' : '?' . http_build_query($params));
    }
}

if (!function_exists('generateSearchSuggestions')) {
    function generateSearchSuggestions($query) {
        // Genera suggerimenti semplici basati sulla query
        $suggestions = [];
        
        // Suggerimenti generici
        $genericSuggestions = ['iPhone', 'Samsung', 'PlayStation', 'iPad', 'MacBook', 'AirPods'];
        
        // Prendi alcuni suggerimenti casuali
        $randomSuggestions = array_rand(array_flip($genericSuggestions), min(3, count($genericSuggestions)));
        
        return is_array($randomSuggestions) ? $randomSuggestions : [$randomSuggestions];
    }
}
?>