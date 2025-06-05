<script type="text/javascript">
$(function() {
    $("#q").autocomplete({
        source: function(request, response) {
            $.ajax({
                url: "<?php print $config_baseHREF; ?>searchJSON.php",
                dataType: "json",
                data: { q: request.term },
                success: function(data) {
                    response($.map(data.products, function(item) { 
                        return { label: item.name, value: item.name }; 
                    }));
                }
            });
        },
        minLength: 2,
        open: function() { 
            $(this).removeClass("ui-corner-all").addClass("ui-corner-top"); 
        },
        close: function() { 
            $(this).removeClass("ui-corner-top").addClass("ui-corner-all"); 
        }
    }).keydown(function(e){ 
        if (e.keyCode === 13) { 
            $("#search").trigger('submit'); 
        }
    });
});
</script>

<div class="search-section">
    <!-- Logo Desktop -->
    <div class="logo-desktop">
        <a href="<?php print $config_baseHREF; ?>">
            <img src="/images/logo.png" alt="Logo Prezzly">
        </a>
    </div>

    <!-- Logo Mobile -->
    <div class="logo-mobile">
        <a href="<?php print $config_baseHREF; ?>">
            <img src="/images/logo.png" alt="Logo Prezzly">
        </a>
    </div>

    <!-- Form di ricerca con struttura semplificata -->
    <div class="search-container">
        <form id="search" name="search" action="<?php print $config_baseHREF ?>search.php" class="search-form">
            <div class="search-input-group">
                <!-- Input wrapper semplificato -->
                <div class="search-input-wrapper ui-widget">
                    <input 
                        id="q" 
                        name="q" 
                        required="required" 
                        type="text" 
                        class="search-input"
                        placeholder="<?php print translate("Start typing"); ?>..." 
                        value="<?php print ((isset($q) && !isset($parts[1]) && !isset($product["products"])) ? $q : ""); ?>"
                        autocomplete="off"
                    >
                </div>
                <!-- Pulsante separato -->
                <button type="submit" class="search-button">
                    <i class="fas fa-search"></i>
                    <span class="button-text"><?php print translate("Search"); ?></span>
                </button>
            </div>
        </form>
    </div>
</div>