<section class="ratings-section">
    <div class="ratings-container">

        <!-- Existing Reviews -->
        <?php if(isset($ratings["reviews"])): ?>
            <div class="reviews-list">
                <h3 class="reviews-title">Recensioni degli utenti</h3>
                
                <?php foreach($ratings["reviews"] as $review): ?>
                    <article class="review-item">
                        <div class="review-rating">
                            <?php print tapestry_stars($review["rating"],""); ?>
                        </div>
                        
                        <div class="review-content">
                            <?php if ($review["comments"]): ?>
                                <p class="review-text">
                                    <?php print htmlspecialchars($review["comments"],ENT_QUOTES,$config_charset); ?>
                                </p>
                            <?php else: ?>
                                <p class="review-text no-comment">
                                    <em><?php print translate("This reviewer did not leave any comments."); ?></em>
                                </p>
                            <?php endif; ?>
                        </div>
                    </article>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>

        <!-- Review Form Section -->
        <div class="review-form-section">
            <h3 class="form-title">Lascia una recensione</h3>
            
            <div class="review-form-container">
                <?php if(isset($_GET["pending"])): ?>
                    <!-- Pending Review Message -->
                    <div class="review-pending">
                        <div class="pending-icon">
                            <i class="fas fa-clock"></i>
                        </div>
                        <p class="pending-message">
                            <em><?php print translate("Your review is pending approval. Thank you for your contribution."); ?></em>
                        </p>
                    </div>
                    
                <?php else: ?>
                    <!-- Review Form -->
                    <form method="post" class="review-form" id="reviewForm">
                        
                        <div class="form-group">
                            <label for="rating" class="rating-label">
                                <?php print translate("Your Rating"); ?>
                            </label>
                            <div class="rating-input-wrapper">
                                <select name="rating" id="rating" class="rating-select">
                                    <option value="5">★★★★★ (5 stelle)</option>
                                    <option value="4">★★★★☆ (4 stelle)</option>
                                    <option value="3">★★★☆☆ (3 stelle)</option>
                                    <option value="2">★★☆☆☆ (2 stelle)</option>
                                    <option value="1">★☆☆☆☆ (1 stella)</option>
                                </select>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="comments" class="comments-label">
                                <?php print translate("Your Comments (optional)"); ?>
                            </label>
                            <textarea 
                                name="comments" 
                                id="comments"
                                class="comments-textarea"
                                placeholder="<?php print translate("Your Comments (optional)"); ?>"
                                rows="4"
                            ></textarea>
                        </div>

                        <div class="form-actions">
                            <button type="submit" class="submit-review-btn" onclick="document.getElementById('confirm').value=document.getElementById('rating').value;">
                                <i class="fas fa-paper-plane"></i>
                                <?php print translate("Submit"); ?>
                            </button>
                        </div>

                        <!-- Hidden Fields -->
                        <input type="hidden" name="submit" value="1" />
                        <input type="hidden" name="confirm" id="confirm" value="" />
                        
                    </form>
                    
                <?php endif; ?>
            </div>
        </div>

    </div>
</section>