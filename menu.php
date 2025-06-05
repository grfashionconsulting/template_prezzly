<!-- Menu Desktop -->
<nav class="desktop-nav">
    <div class="nav-container">
        <div class="nav-home">
            <a href="<?php print $config_baseHREF; ?>" class="home-icon">
                <i class="fas fa-home"></i>
            </a>
        </div>
        
        <div class="nav-menu">
            <ul class="nav-left">
                <?php if (isset($config_useCategoryHierarchy) && $config_useCategoryHierarchy): ?>
                    <li class="dropdown-item">
                        <a href="#" class="dropdown-toggle" data-category="0">
                            <?php print translate("Category"); ?>
                            <i class="fas fa-chevron-down"></i>
                        </a>
                        <ul id="menu_cat0" class="dropdown-menu">
                            <li><div class="loading-spinner"></div></li>
                        </ul>
                    </li>
                <?php else: ?>
                    <li><a href="<?php print tapestry_indexHREF("category"); ?>"><?php print translate("Category"); ?></a></li>
                <?php endif; ?>
                <li><a href="<?php print tapestry_indexHREF("brand"); ?>"><?php print translate("Brand"); ?></a></li>
                <li><a href="<?php print tapestry_indexHREF("merchant"); ?>"><?php print translate("Merchant"); ?></a></li>
            </ul>
        </div>

        <?php if ($config_useVoucherCodes || $config_useShoppingList): ?>
            <div class="nav-right">
                <ul>
                    <?php if (isset($config_useVoucherCodes) && $config_useVoucherCodes): ?>
                        <li>
                            <a href="<?php print $config_baseHREF; ?>vouchers.php">
                                <i class="fas fa-ticket-alt"></i> 
                                <?php print translate("Voucher Codes"); ?>
                            </a>
                        </li>
                    <?php endif; ?>
                    <?php if (isset($config_useShoppingList) && $config_useShoppingList): ?>
                        <li>
                            <a href="<?php print tapestry_shoppingListHREF(); ?>">
                                <i class="fas fa-shopping-cart"></i> 
                                <?php print translate("My Shopping List"); ?> 
                                (<?php $menu_shoppingList = tapestry_shoppingList(); print count($menu_shoppingList); ?>)
                            </a>
                        </li>
                    <?php endif; ?>
                </ul>
            </div>
        <?php endif; ?>
    </div>
</nav>

<!-- Menu Mobile -->
<nav class="mobile-nav">
    <div class="mobile-menu-container">
        <ul class="mobile-menu">
            <li>
                <a href="<?php print tapestry_indexHREF("category"); ?>">
                    <?php print translate("Categorie"); ?>
                </a>
            </li>
            <li>
                <a href="<?php print tapestry_indexHREF("brand"); ?>">
                    <?php print translate("Marchi"); ?>
                </a>
            </li>
            <li>
                <a href="<?php print tapestry_indexHREF("merchant"); ?>">
                    <?php print translate("Negozi"); ?>
                </a>
            </li>
            <li>
                <a href="<?php print $config_baseHREF; ?>offers.php">
                    <?php print translate("Offerte"); ?>
                </a>
            </li>
            <?php if (isset($config_useShoppingList) && $config_useShoppingList): ?>
                <li>
                    <a href="<?php print tapestry_shoppingListHREF(); ?>">
                        <i class="fas fa-shopping-cart"></i>
                        <?php print translate("Lista della spesa"); ?>
                        (<?php $menu_shoppingList = tapestry_shoppingList(); print count($menu_shoppingList); ?>)
                    </a>
                </li>
            <?php endif; ?>
        </ul>
    </div>
</nav>

<!-- Le funzionalità JavaScript sono gestite in scripts.js -->