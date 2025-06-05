<?php
// Mobile Filter Toggle
echo '<div class="filters-mobile-toggle">';
echo '<button type="button" class="filters-toggle-btn" id="filtersToggleBtn">';
echo '<i class="fas fa-filter"></i> ';
echo translate("Filter These Results");
echo '<i class="fas fa-chevron-down toggle-icon"></i>';
echo '</button>';
echo '</div>';

// Filters Container
echo '<div class="filters-container" id="filtersContainer">';
echo '<form id="refine" method="GET" action="'.$config_baseHREF.'search.php" class="filters-form">';

// Hidden fields to preserve values
echo '<input type="hidden" name="q" value="'.htmlspecialchars($q, ENT_QUOTES, $config_charset).'" />';
if ($merchantFilter) echo '<input type="hidden" name="merchantFilter" value="'.htmlspecialchars($merchantFilter, ENT_QUOTES, $config_charset).'" />';
if ($categoryFilter) echo '<input type="hidden" name="categoryFilter" value="'.htmlspecialchars($categoryFilter, ENT_QUOTES, $config_charset).'" />';
if ($brandFilter) echo '<input type="hidden" name="brandFilter" value="'.htmlspecialchars($brandFilter, ENT_QUOTES, $config_charset).'" />';

// Merchant Filter
if ($parts[0] != "merchant") {
  $sql1 = "SELECT DISTINCT(merchant) FROM `".$config_databaseTablePrefix."products` WHERE ".$where.$priceWhere." ORDER BY merchant";
  if (database_querySelect($sql1,$rows1)) {
    echo '<div class="filter-group">';
    echo '<label class="filter-label">'.translate("Merchant").'</label>';
    echo '<div class="filter-input-wrapper">';
    echo '<select name="merchantFilter" class="filter-select" onchange="submitFilterForm()">';
    echo '<option value="">'.translate("All").'</option>';
    foreach($rows1 as $row) {
      $selected = ($merchantFilter==$row["merchant"]?"selected='selected'":"");
      echo '<option value="'.htmlspecialchars($row["merchant"],ENT_QUOTES,$config_charset).'" '.$selected.'>'.$row["merchant"].'</option>';
    }
    echo '</select>';
    echo '<i class="fas fa-chevron-down select-icon"></i>';
    echo '</div>';
    echo '</div>';
  }
}

// Category Filter with hierarchy or base
if ($config_useCategoryHierarchy) {
  $sql1 = "SELECT DISTINCT(categoryid) FROM `".$config_databaseTablePrefix."products` WHERE ".$where.$priceWhere." AND categoryid > 0";
  if (database_querySelect($sql1,$rows1)) {
    $categoryids = array();
    foreach($rows1 as $row) {
      $categoryids[] = $row["categoryid"];
    }
    if ((count($categoryids) > 1) || $categoryFilter) {
      $categories = tapestry_categoryHierarchyArray($categoryids);
      echo '<div class="filter-group">';
      echo '<label class="filter-label">'.translate("Category").'</label>';
      echo '<div class="filter-input-wrapper">';
      echo '<select name="categoryFilter" class="filter-select" onchange="submitFilterForm()">';
      echo '<option value="">'.translate("All").'</option>';
      foreach($categories as $id => $path) {
        $selected = ($categoryFilter==$id?"selected='selected'":"");
        echo '<option value="'.$id.'" '.$selected.'>'.$path.'</option>';
      }
      echo '</select>';
      echo '<i class="fas fa-chevron-down select-icon"></i>';
      echo '</div>';
      echo '</div>';
    }
  }
} elseif ($parts[0] != "category") {
  $sql1 = "SELECT DISTINCT(category) FROM `".$config_databaseTablePrefix."products` WHERE ".$where.$priceWhere." AND category <> '' ORDER BY category";
  if (database_querySelect($sql1,$rows1)) {
    echo '<div class="filter-group">';
    echo '<label class="filter-label">'.translate("Category").'</label>';
    echo '<div class="filter-input-wrapper">';
    echo '<select name="categoryFilter" class="filter-select" onchange="submitFilterForm()">';
    echo '<option value="">'.translate("All").'</option>';
    foreach($rows1 as $row) {
      $selected = ($categoryFilter==$row["category"]?"selected='selected'":"");
      echo '<option value="'.htmlspecialchars($row["category"],ENT_QUOTES,$config_charset).'" '.$selected.'>'.$row["category"].'</option>';
    }
    echo '</select>';
    echo '<i class="fas fa-chevron-down select-icon"></i>';
    echo '</div>';
    echo '</div>';
  }
}

// Brand Filter
if ($parts[0] != "brand") {
  $sql1 = "SELECT DISTINCT(brand) FROM `".$config_databaseTablePrefix."products` WHERE ".$where.$priceWhere." AND brand <> '' ORDER BY brand";
  if (database_querySelect($sql1,$rows1)) {
    echo '<div class="filter-group">';
    echo '<label class="filter-label">'.translate("Brand").'</label>';
    echo '<div class="filter-input-wrapper">';
    echo '<select name="brandFilter" class="filter-select" onchange="submitFilterForm()">';
    echo '<option value="">'.translate("All").'</option>';
    foreach($rows1 as $row) {
      $selected = ($brandFilter==$row["brand"]?"selected='selected'":"");
      echo '<option value="'.htmlspecialchars($row["brand"],ENT_QUOTES,$config_charset).'" '.$selected.'>'.$row["brand"].'</option>';
    }
    echo '</select>';
    echo '<i class="fas fa-chevron-down select-icon"></i>';
    echo '</div>';
    echo '</div>';
  }
}

// Price Range Filters
echo '<div class="filter-group price-filter-group">';
echo '<label class="filter-label">Fascia di prezzo</label>';
echo '<div class="price-inputs-wrapper">';
echo '<div class="price-input-group">';
echo '<label class="price-input-label">'.$config_currencyHTML.' '.translate("from").'</label>';
echo '<input name="minPrice" type="number" class="price-input" value="'.htmlspecialchars($minPrice,ENT_QUOTES,$config_charset).'" onchange="submitFilterForm()" placeholder="Min" />';
echo '</div>';
echo '<div class="price-separator">-</div>';
echo '<div class="price-input-group">';
echo '<label class="price-input-label">'.$config_currencyHTML.' '.translate("to").'</label>';
echo '<input name="maxPrice" type="number" class="price-input" value="'.htmlspecialchars($maxPrice,ENT_QUOTES,$config_charset).'" onchange="submitFilterForm()" placeholder="Max" />';
echo '</div>';
echo '</div>';
echo '</div>';

// Submit Button
echo '<div class="filter-submit-group">';
echo '<button type="submit" class="filter-submit-btn">';
echo '<i class="fas fa-search"></i> ';
echo translate("Filter These Results");
echo '</button>';
echo '</div>';

echo '</form>';
echo '</div>';
?>

<script>
function submitFilterForm() {
    document.getElementById("refine").submit();
}

// Mobile filters toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const toggleBtn = document.getElementById('filtersToggleBtn');
    const filtersContainer = document.getElementById('filtersContainer');
    
    if (toggleBtn && filtersContainer) {
        // Check if we're on mobile
        const isMobile = window.innerWidth <= 768;
        
        // Set initial state
        if (isMobile) {
            filtersContainer.classList.add('collapsed');
        }
        
        toggleBtn.addEventListener('click', function() {
            const isCollapsed = filtersContainer.classList.contains('collapsed');
            const toggleIcon = toggleBtn.querySelector('.toggle-icon');
            
            if (isCollapsed) {
                filtersContainer.classList.remove('collapsed');
                toggleIcon.style.transform = 'rotate(180deg)';
            } else {
                filtersContainer.classList.add('collapsed');
                toggleIcon.style.transform = 'rotate(0deg)';
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', function() {
            const isMobile = window.innerWidth <= 768;
            
            if (!isMobile) {
                filtersContainer.classList.remove('collapsed');
                toggleBtn.querySelector('.toggle-icon').style.transform = 'rotate(0deg)';
            } else if (!filtersContainer.classList.contains('collapsed')) {
                // On mobile, start collapsed
                filtersContainer.classList.add('collapsed');
            }
        });
    }
});
</script>