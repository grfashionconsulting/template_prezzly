<?php
  $product_main = $product["products"][0];

  $product_bestPriceText = (count($product["products"])>1?translate("Best Price"):translate("Best Price"));

  $product_bestPriceMerchants = array();

  foreach($product["products"] as $p)
  {
    if ($p["price"] == $product_main["price"])
    {
      $html = "<a target='_BLANK' href='".tapestry_buyURL($p)."'>".$p["merchant"]."</a>";

      if ($p["voucher_code"])
      {
        $html .= " (".translate("using voucher code")." <span class='voucher-code-inline'>".$p["voucher_code"]."</span>)";
      }

      $product_bestPriceMerchants[] = $html;
    }
  }

  $product_bestPriceMerchants = implode(", ",$product_bestPriceMerchants);

  if ($config_useShoppingList)
  {
    $product_shoppingList = tapestry_shoppingList();

    if (isset($product_shoppingList[$product_main["name"]]))
    {
      $product_shoppingListHTML = "<div class='shopping-list-status in-list'><a href='".tapestry_shoppingListHREF()."'><i class='fas fa-check'></i> ".translate("This item is in your Shopping List")."</a></div>";
    }
    else
    {
      $product_shoppingListHTML = "<div class='shopping-list-status add-to-list'><a href='".tapestry_shoppingListHREF()."?add=".urlencode($product_main["name"])."'><i class='fas fa-shopping-cart'></i> ".translate("Add to Shopping List")."</a></div>";
    }
  }
?>

<section class="product-detail-section">
    <div class="product-detail-container">
        
        <article class="product-detail-card">
            
            <!-- Product Image -->
            <?php if ($product_main["image_url"]): ?>
                <div class="product-image-wrapper">
                    <div class="product-image-container">
                        <img 
                            alt="<?php print translate("Image of"); ?> <?php print htmlspecialchars($product_main["name"],ENT_QUOTES,$config_charset); ?>" 
                            src="<?php print $config_baseHREF."imageCache.php?src=".base64_encode($product_main["image_url"]); ?>" 
                            class="product-image"
                        />
                    </div>
                </div>
            <?php endif; ?>

            <!-- Product Information -->
            <div class="product-info-wrapper">
                <div class="product-info-container">
                    
                    <!-- Product Title -->
                    <header class="product-header">
                        <h1 class="product-title"><?php print $product_main["name"]; ?></h1>
                    </header>

                    <!-- Product Metadata -->
                    <div class="product-metadata">
                        
                        <!-- Brand -->
                        <?php if($product_main["brand"]): ?>
                            <div class="product-brand">
                                <span class="metadata-label">Marchio:</span>
                                <a href="<?php print tapestry_indexHREF("brand",$product_main["brand"]); ?>" class="brand-link">
                                    <?php print $product_main["brand"]; ?>
                                </a>
                            </div>
                        <?php endif; ?>

                        <!-- Category -->
                        <?php if($product_main["category"]): ?>
                            <div class="product-category">
                                <span class="metadata-label">Categoria:</span>
                                <a href="<?php print tapestry_indexHREF("category",$product_main["category"]); ?>" class="category-link">
                                    <?php print $product_main["category"]; ?>
                                </a>
                            </div>
                        <?php endif; ?>

                    </div>

                    <!-- Price Information -->
                    <div class="product-pricing">
                        <div class="price-container">
                            <span class="price-label"><?php print $product_bestPriceText; ?>:</span>
                            <span class="price-value"><?php print tapestry_price($product_main["price"]); ?></span>
                        </div>
                        
                        <div class="merchants-info">
                            <span class="merchants-label"><?php print translate("from"); ?></span>
                            <div class="merchants-list">
                                <?php print $product_bestPriceMerchants; ?>
                            </div>
                        </div>
                    </div>

                    <!-- Shopping List Action -->
                    <?php if (isset($product_shoppingListHTML)): ?>
                        <div class="product-actions">
                            <?php print $product_shoppingListHTML; ?>
                        </div>
                    <?php endif; ?>

                    <!-- Extra HTML -->
                    <?php if (isset($product_main["extraHTML"])): ?>
                        <div class="product-extra">
                            <?php print $product_main["extraHTML"]; ?>
                        </div>
                    <?php endif; ?>

                </div>
            </div>

        </article>

    </div>
</section>