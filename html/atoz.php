<?php
  $atoz["itemsByLetter"] = array();

  foreach($atoz["items"] as $item)
  {
    $atoz_letter = tapestry_mb_strtoupper(tapestry_mb_substr($item["name"],0,1));
    $atoz["itemsByLetter"][$atoz_letter][] = $item;
  }
?>

<section class="atoz-section">
    <div class="atoz-container">
        
        <!-- Navigazione alfabetica rapida -->
        <nav class="atoz-navigation" aria-label="Navigazione alfabetica">
            <div class="atoz-nav-title">
                <h3>Vai alla lettera:</h3>
            </div>
            <div class="atoz-nav-letters">
                <?php foreach($atoz["itemsByLetter"] as $nav_letter => $nav_items): ?>
                    <a href="#letter-<?php print strtolower($nav_letter); ?>" class="atoz-nav-link">
                        <?php print $nav_letter; ?>
                    </a>
                <?php endforeach; ?>
            </div>
        </nav>

        <!-- Contenuto organizzato per lettera -->
        <div class="atoz-content">
            <?php foreach($atoz["itemsByLetter"] as $atoz_letter => $atoz_items): ?>
                
                <section class="atoz-letter-section" id="letter-<?php print strtolower($atoz_letter); ?>">
                    
                    <!-- Header della lettera -->
                    <header class="atoz-letter-header">
                        <h2 class="atoz-letter-title"><?php print $atoz_letter; ?></h2>
                        <div class="atoz-letter-count">
                            <span><?php print count($atoz_items); ?> 
                            <?php print count($atoz_items) === 1 ? 'elemento' : 'elementi'; ?></span>
                        </div>
                    </header>

                    <!-- Griglia degli elementi -->
                    <div class="atoz-items-grid">
                        <?php foreach($atoz_items as $atoz_item): ?>
                            
                            <article class="atoz-item-card">
                                <a href="<?php print $atoz_item["href"]; ?>" class="atoz-item-link">
                                    
                                    <?php if (isset($atoz_item["logo"])): ?>
                                        <!-- Elemento con logo -->
                                        <div class="atoz-item-image">
                                            <img 
                                                alt="<?php print htmlspecialchars($atoz_item["name"],ENT_QUOTES,$config_charset); ?>" 
                                                src="<?php print $atoz_item["logo"]; ?>" 
                                                class="atoz-logo"
                                                loading="lazy"
                                            />
                                        </div>
                                        <div class="atoz-item-name-with-logo">
                                            <span><?php print $atoz_item["name"]; ?></span>
                                        </div>
                                    <?php else: ?>
                                        <!-- Elemento solo testo -->
                                        <div class="atoz-item-text">
                                            <span class="atoz-item-name">
                                                <?php print $atoz_item["name"]; ?>
                                            </span>
                                            <i class="fas fa-arrow-right atoz-arrow"></i>
                                        </div>
                                    <?php endif; ?>
                                    
                                </a>
                            </article>

                        <?php endforeach; ?>
                    </div>

                </section>

            <?php endforeach; ?>
        </div>

        <!-- Torna su (per liste lunghe) -->
        <div class="atoz-back-to-top">
            <a href="#top" class="back-to-top-btn">
                <i class="fas fa-chevron-up"></i>
                <span>Torna su</span>
            </a>
        </div>

    </div>
</section>