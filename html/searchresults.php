<?php
  $shoppingListCookie = "shoppingList".bin2hex($config_baseHREF);
  $shoppingList = (isset($_COOKIE[$shoppingListCookie])?unserialize($_COOKIE[$shoppingListCookie]):array());
?>

<?php
  if (file_exists("html/user_searchresults_before.php")) require("html/user_searchresults_before.php");
?>

<section class="search-results-section">
    
    <?php if(strpos($_SERVER["PHP_SELF"],"products.php")===FALSE): ?>
        <!-- Layout with sidebar filters -->
        <div class="search-layout-with-sidebar">
            
            <!-- Filters Sidebar -->
            <aside class="search-filters-sidebar">
                <?php require("html/searchfilters_sidebar.php"); ?>
            </aside>

            <!-- Main Results -->
            <main class="search-results-main">
                <div class="search-results-grid">
                    <?php foreach($searchresults["products"] as $product): ?>
                        
                        <article class="product-result-card">
                            
                            <!-- Product Image -->
                            <div class="product-result-image">
                                <a href="<?php print $product["productHREF"]; ?>" class="product-image-link">
                                    <?php if ($product["image_url"]): ?>
                                        <img 
                                            alt="<?php print translate("Image of"); ?> <?php print htmlspecialchars($product["name"],ENT_QUOTES,$config_charset); ?>" 
                                            class="product-result-img" 
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

                            <!-- Product Info -->
                            <div class="product-result-info">
                                
                                <header class="product-result-header">
                                    <h3 class="product-result-title">
                                        <a href="<?php print $product["productHREF"]; ?>" class="product-title-link">
                                            <?php print $product["name"]; ?>
                                        </a>
                                    </h3>
                                    
                                    <?php if ($config_useInteraction && $product["rating"]): ?>
                                        <div class="product-rating">
                                            <?php print tapestry_stars($product["rating"],""); ?>
                                        </div>
                                    <?php endif; ?>
                                </header>

                                <?php if ($product["description"]): ?>
                                    <div class="product-description">
                                        <p><?php print tapestry_substr($product["description"],250,"..."); ?></p>
                                    </div>
                                <?php endif; ?>

                            </div>

                            <!-- Price and Actions -->
                            <div class="product-result-actions">
                                
                                <div class="price-section">
                                    <div class="price-info">
                                        <?php if ($product["numMerchants"] > 1): ?>
                                            <span class="price-from"><?php print translate("from"); ?></span>
                                        <?php endif; ?>
                                        <span class="price-value">
                                            <?php 
                                                if ($product["minPrice"] == 0.00) {
                                                    print "Chiama per il prezzo";
                                                } else {
                                                    print tapestry_price($product["minPrice"]);
                                                }
                                            ?>
                                        </span>
                                    </div>
                                </div>

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

                                    <?php if ($config_useShoppingList): ?>
                                        <div class="shopping-list-action">
                                            <?php if (isset($shoppingList[$product["name"]])): ?>
                                                <a href="<?php print tapestry_shoppingListHREF(); ?>" class="shopping-list-link in-list">
                                                    <i class="fas fa-check"></i> 
                                                    <?php print translate("In Shopping List"); ?>
                                                </a>
                                            <?php else: ?>
                                                <a href="<?php print tapestry_shoppingListHREF(); ?>?add=<?php print urlencode($product["name"]); ?>" class="shopping-list-link add-to-list">
                                                    <i class="fas fa-shopping-cart"></i> 
                                                    <?php print translate("Add to Shopping List"); ?>
                                                </a>
                                            <?php endif; ?>
                                        </div>
                                    <?php endif; ?>
                                </div>

                            </div>

                        </article>

                    <?php endforeach; ?>
                </div>
            </main>

        </div>

    <?php else: ?>
        <!-- Full width layout (for products page) -->
        <div class="search-layout-full-width">
            <div class="search-results-grid">
                <?php foreach($searchresults["products"] as $product): ?>
                    
                    <article class="product-result-card">
                        
                        <!-- Product Image -->
                        <div class="product-result-image">
                            <a href="<?php print $product["productHREF"]; ?>" class="product-image-link">
                                <?php if ($product["image_url"]): ?>
                                    <img 
                                        alt="<?php print translate("Image of"); ?> <?php print htmlspecialchars($product["name"],ENT_QUOTES,$config_charset); ?>" 
                                        class="product-result-img" 
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

                        <!-- Product Info -->
                        <div class="product-result-info">
                            
                            <header class="product-result-header">
                                <h3 class="product-result-title">
                                    <a href="<?php print $product["productHREF"]; ?>" class="product-title-link">
                                        <?php print $product["name"]; ?>
                                    </a>
                                </h3>
                                
                                <?php if ($config_useInteraction && $product["rating"]): ?>
                                    <div class="product-rating">
                                        <?php print tapestry_stars($product["rating"],""); ?>
                                    </div>
                                <?php endif; ?>
                            </header>

                            <?php if ($product["description"]): ?>
                                <div class="product-description">
                                    <p><?php print tapestry_substr($product["description"],250,"..."); ?></p>
                                </div>
                            <?php endif; ?>

                        </div>

                        <!-- Price and Actions -->
                        <div class="product-result-actions">
                            
                            <div class="price-section">
                                <div class="price-info">
                                    <?php if ($product["numMerchants"] > 1): ?>
                                        <span class="price-from"><?php print translate("from"); ?></span>
                                    <?php endif; ?>
                                    <span class="price-value">
                                        <?php 
                                            if ($product["minPrice"] == 0.00) {
                                                print "Chiama per il prezzo";
                                            } else {
                                                print tapestry_price($product["minPrice"]);
                                            }
                                        ?>
                                    </span>
                                </div>
                            </div>

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

                                <?php if ($config_useShoppingList): ?>
                                    <div class="shopping-list-action">
                                        <?php if (isset($shoppingList[$product["name"]])): ?>
                                            <a href="<?php print tapestry_shoppingListHREF(); ?>" class="shopping-list-link in-list">
                                                <i class="fas fa-check"></i> 
                                                <?php print translate("In Shopping List"); ?>
                                            </a>
                                        <?php else: ?>
                                            <a href="<?php print tapestry_shoppingListHREF(); ?>?add=<?php print urlencode($product["name"]); ?>" class="shopping-list-link add-to-list">
                                                <i class="fas fa-shopping-cart"></i> 
                                                <?php print translate("Add to Shopping List"); ?>
                                            </a>
                                        <?php endif; ?>
                                    </div>
                                <?php endif; ?>
                            </div>

                        </div>

                    </article>

                <?php endforeach; ?>
            </div>
        </div>

    <?php endif; ?>

</section>

<?php
  if (file_exists("html/user_searchresults_after.php")) require("html/user_searchresults_after.php");
?>