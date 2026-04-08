<?php
/**
 * Nono Mags Child Theme — functions.php
 *
 * Parent theme: Bricks Builder ("bricks" theme slug).
 * Enqueues parent + child styles, loads Inter font,
 * registers WooCommerce support, and provides helper
 * hooks for GST note and shipping labels.
 */

// ── Enqueue parent + child styles ──────────────────────────────
add_action( 'wp_enqueue_scripts', 'nonomags_enqueue_styles', 20 );
function nonomags_enqueue_styles() {
    // Parent theme (Bricks)
    wp_enqueue_style(
        'bricks-parent-style',
        get_template_directory_uri() . '/style.css',
        [],
        wp_get_theme( 'bricks' )->get( 'Version' )
    );

    // Child theme
    wp_enqueue_style(
        'nonomags-child-style',
        get_stylesheet_uri(),
        [ 'bricks-parent-style' ],
        wp_get_theme()->get( 'Version' )
    );

    // Google Fonts — Inter (matches React app font stack)
    wp_enqueue_style(
        'nonomags-fonts',
        'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap',
        [],
        null
    );
}

// ── WooCommerce theme support ───────────────────────────────────
add_action( 'after_setup_theme', 'nonomags_woocommerce_support' );
function nonomags_woocommerce_support() {
    add_theme_support( 'woocommerce' );
    add_theme_support( 'wc-product-gallery-zoom' );
    add_theme_support( 'wc-product-gallery-lightbox' );
    add_theme_support( 'wc-product-gallery-slider' );
}

// ── NZ GST note below cart totals ──────────────────────────────
add_action( 'woocommerce_cart_totals_after_order_total', 'nonomags_gst_note' );
add_action( 'woocommerce_review_order_after_order_total', 'nonomags_gst_note' );
function nonomags_gst_note() {
    echo '<tr class="nm-gst-row">
        <td colspan="2">
            <small class="nm-gst-note">* All prices include 15% GST (NZ)</small>
        </td>
    </tr>';
}

// ── Free shipping threshold label ──────────────────────────────
add_filter( 'woocommerce_cart_shipping_method_full_label', 'nonomags_free_shipping_label', 10, 2 );
function nonomags_free_shipping_label( $label, $method ) {
    if ( 'free_shipping' === $method->method_id ) {
        $label = '<strong>Free Delivery</strong> <small>(orders over $500)</small>';
    }
    return $label;
}

// ── Breadcrumb home text ────────────────────────────────────────
add_filter( 'woocommerce_breadcrumb_defaults', 'nonomags_breadcrumb_defaults' );
function nonomags_breadcrumb_defaults( $defaults ) {
    $defaults['home'] = 'Home';
    return $defaults;
}

// ── Add body class for easy CSS targeting ──────────────────────
add_filter( 'body_class', 'nonomags_body_class' );
function nonomags_body_class( $classes ) {
    $classes[] = 'nonomags-theme';
    return $classes;
}
