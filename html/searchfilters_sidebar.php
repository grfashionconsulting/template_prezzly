<script type='text/JavaScript'>
  function pt_sf_small_onClick() {
    document.getElementById("pt_sf_small").innerHTML = "";
    document.getElementById("pt_sf_medium").className = "";
  }

  function submitFilterForm() {
    document.getElementById("refine").submit();
  }
</script>

<?php

print "<div id='pt_sf_small' class='show-for-small-only'>";
print "<div class='row'>";
print "<div class='small-12 columns pt_sf_small'>";
print "<button onclick='JavaScript:pt_sf_small_onClick();' class='button tiny secondary'>".translate("Filter These Results")." &darr;</button>";
print "</div>";
print "</div>";
print "</div>";

print "<div id='pt_sf_medium' class='show-for-medium-up'>";
print "<div class='row pt_sf'>";
print "<form id='refine' method='GET' action='".$config_baseHREF."search.php'>";

// Campi hidden per conservare i valori
print "<input type='hidden' name='q' value='".htmlspecialchars($q, ENT_QUOTES, $config_charset)."' />";
if ($merchantFilter) print "<input type='hidden' name='merchantFilter' value='".htmlspecialchars($merchantFilter, ENT_QUOTES, $config_charset)."' />";
if ($categoryFilter) print "<input type='hidden' name='categoryFilter' value='".htmlspecialchars($categoryFilter, ENT_QUOTES, $config_charset)."' />";
if ($brandFilter) print "<input type='hidden' name='brandFilter' value='".htmlspecialchars($brandFilter, ENT_QUOTES, $config_charset)."' />";

// Merchant
if ($parts[0] != "merchant") {
  $sql1 = "SELECT DISTINCT(merchant) FROM `".$config_databaseTablePrefix."products` WHERE ".$where.$priceWhere." ORDER BY merchant";
  if (database_querySelect($sql1,$rows1)) {
    print "<div class='small-12 columns'>";
    print "<label>".translate("Merchant")."<br />";
    print "<select name='merchantFilter' onchange='submitFilterForm()'>";
    print "<option value=''>".translate("All")."</option>";
    foreach($rows1 as $row) {
      $selected = ($merchantFilter==$row["merchant"]?"selected='selected'":"");
      print "<option value='".htmlspecialchars($row["merchant"],ENT_QUOTES,$config_charset)."' ".$selected.">".$row["merchant"]."</option>";
    }
    print "</select>";
    print "</label>";
    print "</div>";
  }
}

// Categoria con gerarchia o base
if ($config_useCategoryHierarchy) {
  $sql1 = "SELECT DISTINCT(categoryid) FROM `".$config_databaseTablePrefix."products` WHERE ".$where.$priceWhere." AND categoryid > 0";
  if (database_querySelect($sql1,$rows1)) {
    $categoryids = array();
    foreach($rows1 as $row) {
      $categoryids[] = $row["categoryid"];
    }
    if ((count($categoryids) > 1) || $categoryFilter) {
      $categories = tapestry_categoryHierarchyArray($categoryids);
      print "<div class='small-12 columns'>";
      print "<label>".translate("Category")."<br />";
      print "<select name='categoryFilter' onchange='submitFilterForm()'>";
      print "<option value=''>".translate("All")."</option>";
      foreach($categories as $id => $path) {
        $selected = ($categoryFilter==$id?"selected='selected'":"");
        print "<option value='".$id."' ".$selected.">".$path."</option>";
      }
      print "</select>";
      print "</label>";
      print "</div>";
    }
  }
} elseif ($parts[0] != "category") {
  $sql1 = "SELECT DISTINCT(category) FROM `".$config_databaseTablePrefix."products` WHERE ".$where.$priceWhere." AND category <> '' ORDER BY category";
  if (database_querySelect($sql1,$rows1)) {
    print "<div class='small-12 columns'>";
    print "<label>".translate("Category")."<br />";
    print "<select name='categoryFilter' onchange='submitFilterForm()'>";
    print "<option value=''>".translate("All")."</option>";
    foreach($rows1 as $row) {
      $selected = ($categoryFilter==$row["category"]?"selected='selected'":"");
      print "<option value='".htmlspecialchars($row["category"],ENT_QUOTES,$config_charset)."' ".$selected.">".$row["category"]."</option>";
    }
    print "</select>";
    print "</label>";
    print "</div>";
  }
}

// Brand
if ($parts[0] != "brand") {
  $sql1 = "SELECT DISTINCT(brand) FROM `".$config_databaseTablePrefix."products` WHERE ".$where.$priceWhere." AND brand <> '' ORDER BY brand";
  if (database_querySelect($sql1,$rows1)) {
    print "<div class='small-12 columns'>";
    print "<label>".translate("Brand")."<br />";
    print "<select name='brandFilter' onchange='submitFilterForm()'>";
    print "<option value=''>".translate("All")."</option>";
    foreach($rows1 as $row) {
      $selected = ($brandFilter==$row["brand"]?"selected='selected'":"");
      print "<option value='".htmlspecialchars($row["brand"],ENT_QUOTES,$config_charset)."' ".$selected.">".$row["brand"]."</option>";
    }
    print "</select>";
    print "</label>";
    print "</div>";
  }
}

// Prezzo
print "<div class='small-12 columns'>";
print "<div class='row'>";
print "<div class='small-12 columns'>";
print "<label>".$config_currencyHTML."&nbsp;".translate("from")."</label>";
print "<input name='minPrice' style='display:inline;' class='pt_sf_price' type='number' value='".htmlspecialchars($minPrice,ENT_QUOTES,$config_charset)."' onchange='submitFilterForm()' />";
print "</div>";
print "<div class='small-12 columns'>";
print "<label>".$config_currencyHTML."&nbsp;".translate("to")."</label>";
print "<input name='maxPrice' style='display:inline;' class='pt_sf_price' type='number' value='".htmlspecialchars($maxPrice,ENT_QUOTES,$config_charset)."' onchange='submitFilterForm()' />";
print "</div>";
print "</div>";
print "</div>";

// Pulsante (non necessario ma lo lasciamo per sicurezza)
print "<div class='small-12 columns' style='text-align:left;float:left;'>";
print "<label>&nbsp;</label>";
print "<button type='submit' class='button tiny pt_sf_submit'>".translate("Filter These Results")."</button>";
print "</div>";

print "</form>";
print "</div>";
print "</div>";
?>


