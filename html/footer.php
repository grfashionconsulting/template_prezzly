<?php
      if (file_exists("html/user_footer_before.php")) require("html/user_footer_before.php");
    ?>

<!-- Pre-Footer con form per la newsletter -->
<section class="newsletter-section">
    <div class="newsletter-container">
        <div class="newsletter-content">
            <h4>Iscriviti alla nostra Newsletter</h4>
            <form class="newsletter-form">
                <div class="newsletter-input-group">
                    <input 
                        type="email" 
                        class="newsletter-input"
                        placeholder="Inserisci la tua email" 
                        required
                    >
                    <button type="submit" class="newsletter-button">
                        Iscriviti
                    </button>
                </div>
            </form>
            
            <div class="latest-searches">
                <?php
                print "<p>Latest Searches</p>";
                $sql = "SELECT * FROM pt_querylog ORDER BY id DESC LIMIT 5";
                if (database_querySelect($sql, $rows)) {
                    foreach($rows as $row) {
                        $url = $config_baseHREF . "search.php?q=" . urlencode($row["query"]);
                        print "<a href='" . $url . "' class='search-link'>" . $row["query"] . "</a>";
                    }
                }
                ?> 
            </div>
        </div>
    </div>
</section>

<!-- Footer principale -->
<footer class="main-footer">
    <div class="footer-container">
        <div class="footer-grid">
            <div class="footer-column">
                <h5>Chi Siamo</h5>
                <p>Informazioni su Prezzly.</p>
            </div>
            
            <div class="footer-column">
                <h5>Servizi</h5>
                <ul class="footer-links">
                    <li><a href="#">Servizio 1</a></li>
                    <li><a href="#">Servizio 2</a></li>
                    <li><a href="#">Servizio 3</a></li>
                    <li><a href="#">Servizio 4</a></li>
                </ul>
            </div>
            
            <div class="footer-column">
                <h5>Supporto</h5>
                <ul class="footer-links">
                    <li><a href="#">Supporto 1</a></li>
                    <li><a href="#">Supporto 2</a></li>
                    <li><a href="#">Supporto 3</a></li>
                    <li><a href="#">Supporto 4</a></li>
                </ul>
            </div>
            
            <div class="footer-column">
                <h5>Seguici</h5>
                <ul class="footer-links social-links">
                    <li>
                        <a href="#">
                            <i class="fab fa-facebook-f"></i>
                            Facebook
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <i class="fab fa-instagram"></i>
                            Instagram
                        </a>
                    </li>
                </ul>
            </div>
        </div>
        
        <div class="footer-bottom">
            <p>&copy; <?php echo date('Y'); ?> Prezzly. Tutti i diritti riservati.</p>
        </div>
    </div>
</footer>

<!-- L'inizializzazione JavaScript è gestita in scripts.js -->

</body>
</html>