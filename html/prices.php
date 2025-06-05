<?php
  $prices_showVoucherCodes = FALSE;

  foreach($prices["products"] as $product)
  {
    if ($product["voucher_code"])
    {
      $prices_showVoucherCodes = TRUE;
    }
  }
?>

<section class="prices-section">
    <div class="prices-container">
        
        <!-- Desktop Table -->
        <div class="prices-table-wrapper desktop-prices">
            <table class="prices-table">
                <thead>
                    <tr>
                        <th class="merchant-column"><?php print translate("Stockist"); ?></th>
                        <th class="product-name-column"><?php print translate("Catalogue Product Name"); ?></th>
                        <th class="price-column"><?php print translate("Price"); ?></th>
                        <?php if ($prices_showVoucherCodes): ?>
                            <th class="voucher-column"><?php print translate("Voucher Code"); ?></th>
                        <?php endif; ?>
                        <th class="action-column">&nbsp;</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach($prices["products"] as $product): ?>
                        <tr class="price-row">
                            <!-- Merchant Logo/Name -->
                            <td class="merchant-cell">
                                <?php if (file_exists("logos/".$product["merchant"].$config_logoExtension)): ?>
                                    <a href="<?php print tapestry_buyURL($product); ?>" class="merchant-logo-link">
                                        <img 
                                            alt="<?php print htmlspecialchars($product["merchant"],ENT_QUOTES,$config_charset); ?> <?php print translate("Logo"); ?>" 
                                            src="<?php print $config_baseHREF."logos/".str_replace(" ","%20",$product["merchant"]).$config_logoExtension; ?>" 
                                            class="merchant-logo"
                                        />
                                    </a>
                                <?php else: ?>
                                    <a href="<?php print tapestry_buyURL($product); ?>" class="merchant-text-link">
                                        <?php print $product["merchant"]; ?>
                                    </a>
                                <?php endif; ?>
                            </td>

                            <!-- Product Name -->
                            <td class="product-name-cell">
                                <?php print $product["original_name"]; ?>
                            </td>

                            <!-- Price -->
                            <td class="price-cell">
                                <span class="price-value">
                                    <?php if ($product["price"] == 0.00) { 
                                        print "Chiama per il prezzo"; 
                                    } else { 
                                        print tapestry_price($product["price"]); 
                                    } ?>
                                </span>
                            </td>

                            <!-- Voucher Code -->
                            <?php if ($prices_showVoucherCodes): ?>
                                <td class="voucher-cell">
                                    <?php if ($product["voucher_code"]): ?>
                                        <span class="voucher-code"><?php print $product["voucher_code"]; ?></span>
                                    <?php else: ?>
                                        <span class="no-voucher">-</span>
                                    <?php endif; ?>
                                </td>
                            <?php endif; ?>

                            <!-- Visit Store Button -->
                            <td class="action-cell">
                                <a href="<?php print tapestry_buyURL($product); ?>" class="visit-store-btn">
                                    <?php print translate("Visit Store"); ?>
                                </a>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>

        <!-- Mobile Cards -->
        <div class="mobile-prices">
            <?php foreach($prices["products"] as $product): ?>
                <div class="price-card">
                    <div class="price-card-header">
                        <div class="merchant-info">
                            <?php if (file_exists("logos/".$product["merchant"].$config_logoExtension)): ?>
                                <img 
                                    alt="<?php print htmlspecialchars($product["merchant"],ENT_QUOTES,$config_charset); ?> Logo" 
                                    src="<?php print $config_baseHREF."logos/".str_replace(" ","%20",$product["merchant"]).$config_logoExtension; ?>" 
                                    class="merchant-logo-mobile"
                                />
                            <?php else: ?>
                                <span class="merchant-name"><?php print $product["merchant"]; ?></span>
                            <?php endif; ?>
                        </div>
                        
                        <div class="price-mobile">
                            <?php if ($product["price"] == 0.00) { 
                                print "Chiama per il prezzo"; 
                            } else { 
                                print tapestry_price($product["price"]); 
                            } ?>
                        </div>
                    </div>

                    <div class="price-card-body">
                        <div class="product-name-mobile">
                            <?php print $product["original_name"]; ?>
                        </div>

                        <?php if ($prices_showVoucherCodes && $product["voucher_code"]): ?>
                            <div class="voucher-mobile">
                                <span class="voucher-label"><?php print translate("Voucher Code"); ?>:</span>
                                <span class="voucher-code-mobile"><?php print $product["voucher_code"]; ?></span>
                            </div>
                        <?php endif; ?>
                    </div>

                    <div class="price-card-footer">
                        <a href="<?php print tapestry_buyURL($product); ?>" class="visit-store-btn-mobile">
                            <?php print translate("Visit Store"); ?>
                        </a>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>

    </div>
</section>