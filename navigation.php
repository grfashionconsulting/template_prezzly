<?php
function navigation_display($navigation, $class) {
    global $config_baseHREF;
    global $config_resultsPerPage;
    global $rewrite;
    global $page;
    global $sort;
    global $q;

    $totalPages = ceil($navigation["resultCount"] / $config_resultsPerPage);

    echo '<div class="pagination-wrapper ' . $class . '">';
    echo '<nav class="pagination" aria-label="Navigazione pagine">';
    echo '<ul class="pagination-list">';

    // Pulsante Previous
    if ($page > 1) {
        $prevPage = ($page - 1);
        
        if ($rewrite) {
            if ($prevPage == 1) {
                $prevHREF = "./";
            } else {
                $prevHREF = $prevPage . ".html";
            }
        } else {
            $prevHREF = $config_baseHREF . "search.php?q=" . urlencode($q) . "&page=" . $prevPage . "&sort=" . $sort;
        }
        
        echo '<li class="pagination-item pagination-prev">';
        echo '<a href="' . $prevHREF . '" aria-label="Pagina precedente">';
        echo '<i class="fas fa-chevron-left"></i>';
        echo '</a></li>';
    } else {
        echo '<li class="pagination-item pagination-prev disabled">';
        echo '<span aria-label="Pagina precedente (non disponibile)">';
        echo '<i class="fas fa-chevron-left"></i>';
        echo '</span></li>';
    }

    // Calcolo range pagine
    if ($page < 5) {
        $pageFrom = 1;
        $pageTo = 9;
    } else {
        $pageFrom = ($page - 4);
        $pageTo = ($page + 4);
    }

    if ($pageTo > $totalPages) {
        $pageTo = $totalPages;
        $pageFrom = $totalPages - 8;
    }

    if ($pageFrom <= 1) {
        $pageFrom = 1;
    } else {
        // Aggiungi link alla prima pagina e puntini
        if ($rewrite) {
            $pageOneHREF = "./";
        } else {
            $pageOneHREF = $config_baseHREF . "search.php?q=" . urlencode($q) . "&page=1&sort=" . $sort;
        }
        
        echo '<li class="pagination-item">';
        echo '<a href="' . $pageOneHREF . '">1</a>';
        echo '</li>';
        
        echo '<li class="pagination-item pagination-ellipsis">';
        echo '<span>&hellip;</span>';
        echo '</li>';
    }

    // Numeri di pagina
    for ($i = $pageFrom; $i <= $pageTo; $i++) {
        if ($rewrite) {
            if ($i == 1) {
                $pageHREF = "./";
            } else {
                $pageHREF = $i . ".html";
            }
        } else {
            $pageHREF = $config_baseHREF . "search.php?q=" . urlencode($q) . "&page=" . $i . "&sort=" . $sort;
        }
        
        if ($page != $i) {
            if ($class == "desktop-pagination") {
                echo '<li class="pagination-item">';
                echo '<a href="' . $pageHREF . '">' . $i . '</a>';
                echo '</li>';
            }
        } else {
            echo '<li class="pagination-item pagination-current">';
            echo '<span aria-current="page">' . $i . '</span>';
            echo '</li>';
        }
    }

    // Pulsante Next
    if ($page < $totalPages) {
        $nextPage = ($page + 1);
        
        if ($rewrite) {
            $nextHREF = $nextPage . ".html";
        } else {
            $nextHREF = $config_baseHREF . "search.php?q=" . urlencode($q) . "&page=" . $nextPage . "&sort=" . $sort;
        }
        
        echo '<li class="pagination-item pagination-next">';
        echo '<a href="' . $nextHREF . '" aria-label="Pagina successiva">';
        echo '<i class="fas fa-chevron-right"></i>';
        echo '</a></li>';
    } else {
        echo '<li class="pagination-item pagination-next disabled">';
        echo '<span aria-label="Pagina successiva (non disponibile)">';
        echo '<i class="fas fa-chevron-right"></i>';
        echo '</span></li>';
    }

    echo '</ul>';
    echo '</nav>';
    echo '</div>';
}

if ($navigation["resultCount"] > $config_resultsPerPage) {
    navigation_display($navigation, "mobile-pagination");
    navigation_display($navigation, "desktop-pagination");
}
?>