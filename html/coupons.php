<div class='pt_co'>

  <?php if (isset($coupons)): ?>

    <?php foreach($coupons["vouchers"] as $voucher): ?>

    <div class='row'>

      <div class='small-12 columns'>

        <div class='pt_co_each'>

          <div class='row'>

            <div class='small-12 medium-2 columns'>

              <?php if (isset($voucher["logo"])): ?>

                <img alt='<?php print htmlspecialchars($voucher["merchant"],ENT_QUOTES,$config_charset); ?> <?php print translate("Logo"); ?>' src='<?php print $voucher["logo"]; ?>' />

              <?php else: ?>

                <p><?php print $voucher["merchant"]; ?></p>

              <?php endif; ?>

            </div>

            <div class='small-12 medium-7 columns'>

              <p><?php print $voucher["text"]; ?></p>

            </div>

            <div class='small-12 medium-3 columns pt_co_link'>

              <a class='button tiny radius secondary' href='<?php print $voucher["href"]; ?>'><?php print translate("View Products"); ?></a>

            </div>

          </div>

        </div>

      </div>

    </div>

    <?php endforeach; ?>

  <?php else: ?>

    <div class='row'>

      <div class='small-12 columns'>

        <p><?php print translate("There are no voucher codes to display."); ?></p>

      </div>

    </div>

  <?php endif; ?>

</div>