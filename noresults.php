<section class="no-results-section">
    <div class="no-results-container">
        <div class="no-results-content">
            <div class="no-results-icon">
                <i class="fas fa-search-minus"></i>
            </div>
            
            <h2>Nessun risultato trovato</h2>
            
            <p>
                Spiacenti, non abbiamo trovato risultati per 
                <strong>"<?php echo htmlspecialchars($q, ENT_QUOTES, $config_charset); ?>"</strong>
            </p>
            
            <div class="no-results-suggestions">
                <h3>Prova a:</h3>
                <ul class="suggestions-list">
                    <li>Controllare l'ortografia dei termini di ricerca</li>
                    <li>Usare termini più generici o meno specifici</li>
                    <li>Provare sinonimi o parole alternative</li>
                    <li>Ridurre il numero di parole chiave</li>
                </ul>
            </div>
            
            <div class="no-results-alternatives">
                <h3>Oppure esplora:</h3>
                <div class="alternatives-grid">
                    <a href="<?php print tapestry_indexHREF("category"); ?>" class="alternative-link">
                        <i class="fas fa-list"></i>
                        <span>Sfoglia Categorie</span>
                    </a>
                    
                    <a href="<?php print tapestry_indexHREF("brand"); ?>" class="alternative-link">
                        <i class="fas fa-tags"></i>
                        <span>Cerca per Marchio</span>
                    </a>
                    
                    <a href="<?php print tapestry_indexHREF("merchant"); ?>" class="alternative-link">
                        <i class="fas fa-store"></i>
                        <span>Esplora Negozi</span>
                    </a>
                    
                    <a href="<?php print $config_baseHREF; ?>" class="alternative-link">
                        <i class="fas fa-home"></i>
                        <span>Torna alla Home</span>
                    </a>
                </div>
            </div>
            
            <div class="search-again">
                <form id="search-again" action="<?php print $config_baseHREF ?>search.php" class="search-again-form">
                    <div class="search-again-input-group">
                        <input 
                            type="text" 
                            name="q" 
                            placeholder="Prova una nuova ricerca..." 
                            class="search-again-input"
                            value=""
                        >
                        <button type="submit" class="search-again-button">
                            <i class="fas fa-search"></i>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</section>