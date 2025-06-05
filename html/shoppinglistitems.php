<section class="shopping-list-section">
    <div class="shopping-list-container">

        <!-- Prodotti Disponibili -->
        <?php if (!empty($shoppinglistitems["available"])): ?>
            <div class="available-items">
                <header class="shopping-list-header">
                    <h3 class="section-title">
                        <i class="fas fa-check-circle"></i>
                        Prodotti Disponibili
                        <span class="items-count">(<?php echo count($shoppinglistitems["available"]); ?>)</span>
                    </h3>
                </header>

                <div class="shopping-items-grid">
                    <?php foreach($shoppinglistitems["available"] as $item): ?>
                        <?php
                        $product = $item["rows"][0];
                        $product["productHREF"] = tapestry_productHREF($product);
                        $product["numMerchants"] = count($item["rows"]);
                        $product["minPrice"] = $product["price"];

                        // Calcolo variazione prezzo
                        if ($product["price"] == $item["price"]) {
                            $product["deltaHTML"] = "<span class='price-change no-change'>
                                <i class='fas fa-equals'></i> 
                                <span>".translate("no price change")."</span>
                            </span>";
                            $priceChangeClass = "no-change";
                        } elseif($product["price"] > $item["price"]) {
                            $product["deltaHTML"] = "<span class='price-change price-up'>
                                <i class='fas fa-arrow-up'></i> 
                                <span>+".tapestry_price(tapestry_decimalise($product["price"] - $item["price"]))."</span>
                            </span>";
                            $priceChangeClass = "price-up";
                        } else {
                            $product["deltaHTML"] = "<span class='price-change price-down'>
                                <i class='fas fa-arrow-down'></i> 
                                <span>-".tapestry_price(tapestry_decimalise($item["price"] - $product["price"]))."</span>
                            </span>";
                            $priceChangeClass = "price-down";
                        }
                        ?>

                        <article class="shopping-item-card available-item <?php echo $priceChangeClass; ?>">
                            
                            <!-- Immagine Prodotto -->
                            <div class="item-image-wrapper">
                                <a href="<?php print $product["productHREF"]; ?>" class="item-image-link">
                                    <?php if ($product["image_url"]): ?>
                                        <img 
                                            alt="<?php print translate("Image of"); ?> <?php print htmlspecialchars($product["name"],ENT_QUOTES,$config_charset); ?>" 
                                            class="item-image" 
                                            src="<?php print htmlspecialchars($product["image_url"],ENT_QUOTES,$config_charset); ?>"
                                            loading="lazy"
                                        />
                                    <?php else: ?>
                                        <div class="no-image-placeholder">
                                            <i class="fas fa-image"></i>
                                        </div>
                                    <?php endif; ?>
                                </a>
                            </div>

                            <!-- Informazioni Prodotto -->
                            <div class="item-info">
                                <header class="item-header">
                                    <h4 class="item-title">
                                        <a href="<?php print $product["productHREF"]; ?>" class="item-title-link">
                                            <?php print $product["name"]; ?>
                                        </a>
                                    </h4>
                                </header>

                                <?php if ($product["description"]): ?>
                                    <div class="item-description">
                                        <p><?php print tapestry_substr($product["description"], 150, "..."); ?></p>
                                    </div>
                                <?php endif; ?>
                            </div>

                            <!-- Prezzo e Azioni -->
                            <div class="item-actions">
                                
                                <!-- Prezzo -->
                                <div class="price-section">
                                    <div class="current-price">
                                        <span class="price-label">
                                            <?php print ($product["numMerchants"] > 1 ? translate("now from") : translate("now")); ?>
                                        </span>
                                        <span class="price-value">
                                            <?php print tapestry_price($product["minPrice"]); ?>
                                        </span>
                                    </div>
                                    
                                    <!-- Variazione Prezzo -->
                                    <div class="price-change-info">
                                        <?php print $product["deltaHTML"]; ?>
                                    </div>
                                </div>

                                <!-- Bottoni Azione -->
                                <div class="action-buttons">
                                    <a href="<?php print $product["productHREF"]; ?>" class="compare-btn">
                                        <?php if ($product["numMerchants"] > 1): ?>
                                            <i class="fas fa-balance-scale"></i>
                                            <?php print translate("Compare")." ".$product["numMerchants"]." ".translate("Prices"); ?>
                                        <?php else: ?>
                                            <i class="fas fa-info-circle"></i>
                                            <?php print translate("More Information"); ?>
                                        <?php endif; ?>
                                    </a>

                                    <a href="?remove=<?php print urlencode($product["name"]); ?>" class="remove-btn" onclick="return confirm('Rimuovere questo prodotto dalla lista?')">
                                        <i class="fas fa-times"></i>
                                        <?php print translate("Remove"); ?>
                                    </a>
                                </div>

                            </div>

                        </article>

                    <?php endforeach; ?>
                </div>
            </div>
        <?php endif; ?>

        <!-- Prodotti Non Disponibili -->
        <?php if (!empty($shoppinglistitems["unavailable"])): ?>
            <div class="unavailable-items">
                <header class="shopping-list-header">
                    <h3 class="section-title">
                        <i class="fas fa-exclamation-triangle"></i>
                        Prodotti Non Disponibili
                        <span class="items-count">(<?php echo count($shoppinglistitems["unavailable"]); ?>)</span>
                    </h3>
                </header>

                <div class="shopping-items-grid">
                    <?php foreach($shoppinglistitems["unavailable"] as $item): ?>
                        <?php $product = $item["rows"][0]; ?>

                        <article class="shopping-item-card unavailable-item">
                            
                            <!-- Placeholder Immagine -->
                            <div class="item-image-wrapper">
                                <div class="unavailable-image-placeholder">
                                    <i class="fas fa-ban"></i>
                                </div>
                            </div>

                            <!-- Informazioni Prodotto -->
                            <div class="item-info">
                                <header class="item-header">
                                    <h4 class="item-title unavailable-title">
                                        <?php print $product["name"]; ?>
                                    </h4>
                                </header>

                                <div class="unavailable-message">
                                    <p>
                                        <i class="fas fa-info-circle"></i>
                                        <?php print translate("Item not currently available."); ?>
                                    </p>
                                </div>
                            </div>

                            <!-- Azioni -->
                            <div class="item-actions">
                                <div class="action-buttons">
                                    <a href="?remove=<?php print urlencode($product["name"]); ?>" class="remove-btn" onclick="return confirm('Rimuovere questo prodotto dalla lista?')">
                                        <i class="fas fa-times"></i>
                                        <?php print translate("Remove"); ?>
                                    </a>
                                </div>
                            </div>

                        </article>

                    <?php endforeach; ?>
                </div>
            </div>
        <?php endif; ?>

        <!-- Messaggio Lista Piena -->
        <?php if (isset($shoppinglistitems["full"])): ?>
            <div class="shopping-list-notification full-list-warning">
                <div class="notification-content">
                    <i class="fas fa-exclamation-circle"></i>
                    <div class="notification-text">
                        <h4>Lista della Spesa Piena</h4>
                        <p><?php print translate("Sorry, your Shopping List is full."); ?></p>
                    </div>
                    <button type="button" class="close-notification" onclick="this.parentElement.parentElement.style.display='none'">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        <?php endif; ?>

        <!-- Vuoto State -->
        <?php if (empty($shoppinglistitems["available"]) && empty($shoppinglistitems["unavailable"])): ?>
            <div class="empty-shopping-list">
                <div class="empty-state-content">
                    <div class="empty-state-icon">
                        <i class="fas fa-shopping-cart"></i>
                    </div>
                    <h3>La tua lista della spesa è vuota</h3>
                    <p>Inizia ad aggiungere prodotti alla tua lista per tenere traccia dei prezzi e delle offerte migliori.</p>
                    <a href="<?php print $config_baseHREF; ?>" class="start-shopping-btn">
                        <i class="fas fa-search"></i>
                        Inizia a cercare prodotti
                    </a>
                </div>
            </div>
        <?php endif; ?>

    </div>
</section>