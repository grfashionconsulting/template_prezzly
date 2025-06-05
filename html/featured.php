<div class='row pt_fp'>

  <div class='small-12 columns'>

    <ul class="small-block-grid-2 medium-block-grid-5">

      <?php foreach($featured["products"] as $k=> $product): ?>

        <li class='pt_fp_each'>

          <a href='<?php print $product["productHREF"]; ?>'><span class='pt_fp_name'><?php print $product["name"]; ?></span></a>

          <?php if ($product["image_url"]): ?>

            <br />

            <a href='<?php print $product["productHREF"]; ?>'><img alt='<?php print translate("Image of"); ?> <?php print htmlspecialchars($product["name"],ENT_QUOTES,$config_charset); ?>' class='pt_fp_image' src='<?php print htmlspecialchars($product["image_url"],ENT_QUOTES,$config_charset); ?>' /></a>

          <?php endif; ?>

          <br />

          <span class='pt_fp_from'><?php print ($product["numMerchants"]>1?translate("from")."&nbsp;":""); ?></span>

          <span class='pt_fp_price'><?php print tapestry_price($product["minPrice"]); ?></span>

          <?php if ($config_useInteraction): ?>

            <br />

            <span class='pt_fp_interaction'>

            <?php if ($product["reviews"]): ?>

              <?php print tapestry_stars($product["rating"],"s"); ?>&nbsp;<a href='<?php print $product["reviewHREF"]; ?>'><?php print $product["reviews"]." ".translate("Reviews"); ?></a>

            <?php else: ?>

              <a href='<?php print $product["reviewHREF"]; ?>'><?php print translate("Review This Product"); ?></a>

            <?php endif; ?>

            </span>

          <?php endif; ?>

          <br />

          <?php if (isset($product["api"])): ?>

            <a class='button tiny radius success' href='<?php print $product["productHREF"]; ?>'><?php print translate("Visit Store"); ?></a>

          <?php else: ?>

            <a class='button tiny radius secondary' href='<?php print $product["productHREF"]; ?>'><?php print ($product["numMerchants"]>1?translate("Compare")." ".$product["numMerchants"]." ".translate("Prices"):translate("More Information")); ?></a>

          <?php endif; ?>

        </li>

      <?php endforeach; ?>

    </ul>

  </div>

 </div>