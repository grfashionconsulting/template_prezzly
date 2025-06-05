<section class="home-categories-section">
    <div class="home-categories-container">
        
        <header class="home-categories-header">
            <h2 class="categories-title">Esplora le Categorie</h2>
            <p class="categories-subtitle">Trova quello che cerchi nelle nostre categorie principali</p>
        </header>

        <div class="categories-grid">
            <?php 
            $categories = [
                ['name' => 'Moda', 'image' => '/images/Moda_categoria.png', 'link' => '/categoria/moda.php'],
                ['name' => 'Enogastronomia', 'image' => '/images/Enogastronomia_categoria.png', 'link' => '/categoria/enogastronomia.php'],
                ['name' => 'Salute e Bellezza', 'image' => '/images/Salute e Bellezza_categoria.png', 'link' => '/categoria/salaute-bellezza.php'],
                ['name' => 'Casa e Giardino', 'image' => '/images/Casa e Giardino_categoria.png', 'link' => '/categoria/casa-giardino.php'],
                ['name' => 'Auto Moto Accessori', 'image' => '/images/Auto Moto Accessori_categoria.png', 'link' => '#'],
                ['name' => 'Sport e Tempo libero', 'image' => '/images/Sport e Tempo libero_categoria.png', 'link' => '#'],
                ['name' => 'Prodotti per Infanzia', 'image' => '/images/Prodotti per Infanzia_categoria.png', 'link' => '#'],
                ['name' => 'Elettronica e Informatica', 'image' => '/images/Elettronica e Informatica_categoria.png', 'link' => '#'],
                ['name' => 'Elettrodomestici', 'image' => '/images/Elettrodomestici_categoria.png', 'link' => '#'],
                ['name' => 'Gioielli', 'image' => '/images/Gioielli_categoria.png', 'link' => '#'],
                ['name' => 'Viaggiare', 'image' => '/images/Viaggiare_categoria.png', 'link' => '#'],
                ['name' => 'Telefonia', 'image' => '/images/Telefonia_categoria.png', 'link' => '#'],
                ['name' => 'Articoli erotici', 'image' => '/images/Articoli erotici_categoria.png', 'link' => '#'],
                ['name' => 'Prodotti per Animali', 'image' => '/images/Prodotti per Animali_categoria.png', 'link' => '#'],
                ['name' => 'Attrezzature da lavoro', 'image' => '/images/Attrezzature da lavoro_categoria.png', 'link' => '#'],
                ['name' => 'Servizi alle imprese', 'image' => '/images/Servizi alle imprese_categoria.png', 'link' => '#']
            ];

            foreach ($categories as $index => $category) {
                $isComingSoon = ($category['link'] === '#');
                $cardClass = $isComingSoon ? 'category-card coming-soon' : 'category-card';
                
                echo "<article class='{$cardClass}' data-category='{$category['name']}'>
                        <a href='{$category['link']}' class='category-link' " . ($isComingSoon ? "onclick='return false;'" : "") . ">
                            <div class='category-image-wrapper'>
                                <img 
                                    src='{$category['image']}' 
                                    alt='Categoria {$category['name']}' 
                                    class='category-image'
                                    loading='lazy'
                                />
                                " . ($isComingSoon ? "<div class='coming-soon-overlay'>
                                    <span class='coming-soon-text'>Prossimamente</span>
                                </div>" : "") . "
                            </div>
                            <div class='category-info'>
                                <h3 class='category-name'>{$category['name']}</h3>
                                " . (!$isComingSoon ? "<div class='category-arrow'>
                                    <i class='fas fa-arrow-right'></i>
                                </div>" : "") . "
                            </div>
                        </a>
                      </article>";
            }
            ?>
        </div>

        <div class="categories-footer">
            <div class="categories-cta">
                <p>Non trovi quello che cerchi?</p>
                <a href="<?php print tapestry_indexHREF("category"); ?>" class="view-all-categories-btn">
                    <i class="fas fa-th-large"></i>
                    Vedi tutte le categorie
                </a>
            </div>
        </div>

    </div>
</section>