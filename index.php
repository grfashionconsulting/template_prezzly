<?php
require("includes/common.php");
require("html/header.php");
require("html/searchform.php");
require("html/menu.php"); 
require("html/homeslider.php");
require("html/homecategorie.php");
?>

<main class="homepage-content">
    <!-- Sezione Profumeria -->
    <section class="featured-section">
        <div class="section-container">
            <div class="section-header">
                <h1>Profumeria</h1>
                <hr class="section-divider">
            </div>
            <div class="section-content">
                <?php 
                $featuredSection["section"] = "profumi";
                require("featuredSection.php");  
                ?> 
            </div>
        </div>
    </section>

    <!-- Sezione Auto e Moto -->
    <section class="featured-section">
        <div class="section-container">
            <div class="section-header">
                <h1>Auto e Moto</h1>
                <hr class="section-divider">
            </div>
            <div class="section-content">
                <?php
                $featuredSection["section"] = "auto";
                require("featuredSection.php");
                ?>
            </div>
        </div>
    </section>

    <!-- Sezione Alimenti e Bevande -->
    <section class="featured-section">
        <div class="section-container">
            <div class="section-header">
                <h1>Alimenti e Bevande</h1>
                <hr class="section-divider">
            </div>
            <div class="section-content">
                <?php 
                $featuredSection["section"] = "alimenti";
                require("featuredSection.php");  
                ?> 
            </div>
        </div>
    </section>

    <!-- Sezione Salute e Benessere -->
    <section class="featured-section">
        <div class="section-container">
            <div class="section-header">
                <h1>Salute e Benessere</h1>
                <hr class="section-divider">
            </div>
            <div class="section-content">
                <?php
                $featuredSection["section"] = "salute";
                require("featuredSection.php");
                ?>
            </div>
        </div>
    </section>

    <!-- Sezione Caffè -->
    <section class="featured-section">
        <div class="section-container">
            <div class="section-header">
                <h1>Caffè</h1>
                <hr class="section-divider">
            </div>
            <div class="section-content">
                <?php
                $featuredSection["section"] = "caffe";
                require("featuredSection.php");
                ?>
            </div>
        </div>
    </section>

    <!-- Sezione Informativa -->
    <section class="info-section">
        <div class="info-container">
            <div class="info-header">
                <h1>Acquista e Risparmia con eShoppingItaly.com</h1>
            </div>
            <div class="info-content">
                <p>
                    Confronta i Prezzi dei prodotti italiani e risparmia con eShopping Italy, 
                    la tua guida per gli acquisti. Prima di effettuare i tuoi acquisti online 
                    utilizza il nostro servizio di comparazione prezzi per trovare il prodotto 
                    più conveniente. Migliaia di offerte dei migliori negozi e-commerce italiani: 
                    cerca il nome di un prodotto nel motore di ricerca oppure sfoglia le categorie 
                    e scegli l'offerta che preferisci.
                </p>
            </div>
        </div>
    </section>
</main>

<?php
require("html/footer.php");
?>