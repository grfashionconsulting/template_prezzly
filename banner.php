<div class="breadcrumbs-container">
    <nav class="breadcrumbs" aria-label="Breadcrumb">
        <ol class="breadcrumb-list">
            <li class="breadcrumb-item">
                <a href="<?php print $config_baseHREF; ?>"><?php print translate("Home"); ?></a>
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
                            echo '<span aria-current="page">' . $breadcrumb["title"] . '</span>';
                        } else {
                            echo '<a href="' . $breadcrumb["href"] . '">' . $breadcrumb["title"] . '</a>';
                        }
                        echo '</li>';
                    }
                } elseif(isset($banner["h2"])) {
                    $banner["h2"] = strip_tags($banner["h2"]);
                    $parts = explode("/", $banner["h2"]);
                    
                    foreach($parts as $part) {
                        echo '<li class="breadcrumb-item current"><span aria-current="page">' . $part . '</span></li>';
                    }
                }
            ?>
        </ol>
    </nav>
</div>

<?php
    if (strpos($_SERVER["PHP_SELF"], "search.php") || strpos($_SERVER["PHP_SELF"], "categories.php")) {
        if (isset($banner["h3"])) {
            $banner["h3"] = str_replace(" | ".translate("Price"), " <br class='mobile-break' />".translate("Price"), $banner["h3"]);
        }
    }
?>

<div class="page-header">
    <div class="page-header-content">
        <?php print (isset($banner["h3"]) ? "<h3>" . $banner["h3"] . "</h3>" : ""); ?>
    </div>
</div>