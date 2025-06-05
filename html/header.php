<?php
  if (file_exists("html/user_header_before.php")) require("html/user_header_before.php");

  header("Content-Type: text/html;charset=".$config_charset);
  
  // Determina se siamo nella homepage Google style
  $isGoogleHomepage = !isset($_GET['q']) && !isset($parts[1]) && basename($_SERVER['PHP_SELF']) == 'index.php';
?>
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="<?php echo $config_charset; ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php print (isset($header["title"])?htmlspecialchars($header["title"],ENT_QUOTES,$config_charset):$config_title); ?></title>

    <?php if (isset($header["meta"])): foreach($header["meta"] as $name => $content): ?>
        <meta name="<?php print $name; ?>" content="<?php print htmlspecialchars($content,ENT_QUOTES,$config_charset); ?>">
    <?php endforeach; endif; ?>

    <!-- Preconnect per performance -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://cdnjs.cloudflare.com">

    <!-- Font Awesome per le icone -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    
    <!-- jQuery UI per l'autocomplete -->
    <link rel="stylesheet" href="<?php print $config_baseHREF; ?>html/vendor/jquery-ui.min.css">
    
    <!-- CSS principale del template -->
    <link rel="stylesheet" href="<?php print $config_baseHREF; ?>html/style.css">

    <!-- CSS aggiuntivo per Google Style (verrà aggiunto a style.css) -->
    <?php if ($isGoogleHomepage): ?>
    <style>
        /* Nascondere elementi non necessari in homepage Google */
        .desktop-nav,
        .mobile-nav,
        .breadcrumbs-container {
            display: none !important;
        }
        
        /* Assicurarsi che la homepage abbia sfondo bianco */
        body {
            background: white;
        }
    </style>
    <?php endif; ?>

    <!-- Script necessari -->
    <script src="<?php print $config_baseHREF; ?>html/vendor/jquery.min.js"></script>
    <script src="<?php print $config_baseHREF; ?>html/vendor/jquery-ui.min.js"></script>
    
    <!-- Script personalizzato originale -->
    <script src="<?php print $config_baseHREF; ?>html/scripts.js"></script>

    <!-- PWA e Meta Tags aggiuntivi -->
    <meta name="theme-color" content="#1E293B">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">
    <meta name="apple-mobile-web-app-title" content="Prezzly">

    <!-- Structured Data per SEO -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Prezzly",
        "url": "<?php echo $config_baseHREF; ?>",
        "potentialAction": {
            "@type": "SearchAction",
            "target": {
                "@type": "EntryPoint",
                "urlTemplate": "<?php echo $config_baseHREF; ?>search.php?q={search_term_string}"
            },
            "query-input": "required name=search_term_string"
        },
        "sameAs": [
            "<?php echo $config_baseHREF; ?>",
            "<?php echo $config_baseHREF; ?>category/",
            "<?php echo $config_baseHREF; ?>brand/",
            "<?php echo $config_baseHREF; ?>merchant/"
        ]
    }
    </script>

    <!-- Preload per risorse critiche -->
    <?php if ($isGoogleHomepage): ?>
    <link rel="preload" href="<?php print $config_baseHREF; ?>images/logo.png" as="image">
    <?php endif; ?>

    <!-- DNS Prefetch per domini esterni -->
    <link rel="dns-prefetch" href="//fonts.googleapis.com">
    <link rel="dns-prefetch" href="//cdnjs.cloudflare.com">

</head>
<body class="<?php echo $isGoogleHomepage ? 'google-homepage' : 'google-results'; ?>">
    
    <!-- Skip Link per accessibilità -->
    <a href="#main-content" class="skip-link">Vai al contenuto principale</a>

    <?php
        if (file_exists("html/user_header_after.php")) require("html/user_header_after.php");
    ?>

    <!-- Main content wrapper -->
    <div id="main-content">