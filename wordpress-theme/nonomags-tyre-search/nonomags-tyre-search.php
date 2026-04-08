<?php
/**
 * Plugin Name:  Nono Mags Tyre Search
 * Description:  Filters the WooCommerce shop by tyre size via ?tyre_size=205-55-R16.
 *               Works with the Width / Profile / Rim product attributes defined in the migration plan.
 *               Also shows a friendly stub notice for ?rego= until a fitment API is integrated.
 * Version:      1.0.0
 * Requires Plugins: woocommerce
 */

defined( 'ABSPATH' ) || exit;

// ── Filter the WooCommerce shop query ──────────────────────────────────────────
add_action( 'woocommerce_product_query', 'nm_filter_by_tyre_size' );
function nm_filter_by_tyre_size( WP_Query $q ) {
    $size = nm_parse_tyre_size();
    if ( ! $size ) return;

    $tax_query = (array) $q->get( 'tax_query' );

    $tax_query[] = [ 'taxonomy' => 'pa_width',   'field' => 'slug', 'terms' => $size['width'] ];
    $tax_query[] = [ 'taxonomy' => 'pa_profile',  'field' => 'slug', 'terms' => $size['profile'] ];
    $tax_query[] = [ 'taxonomy' => 'pa_rim',      'field' => 'slug', 'terms' => $size['rim'] ];
    $tax_query['relation'] = 'AND';

    $q->set( 'tax_query', $tax_query );
}

// ── Notice above the product grid ──────────────────────────────────────────────
add_action( 'woocommerce_before_shop_loop', 'nm_tyre_search_notice', 5 );
function nm_tyre_search_notice() {

    // Size filter notice
    $size = nm_parse_tyre_size();
    if ( $size ) {
        $label = esc_html( $size['width'] . '/' . $size['profile'] . ' R' . $size['rim'] );
        $clear = esc_url( wc_get_page_permalink( 'shop' ) );
        echo '<div class="nm-search-notice">'
            . 'Showing tyres for size: <strong>' . $label . '</strong>'
            . ' <a href="' . $clear . '" class="nm-notice-clear">Clear &times;</a>'
            . '</div>';
        return;
    }

    // Rego stub notice
    if ( ! empty( $_GET['rego'] ) ) {
        $rego  = strtoupper( sanitize_text_field( wp_unslash( $_GET['rego'] ) ) );
        $clear = esc_url( wc_get_page_permalink( 'shop' ) );
        echo '<div class="nm-search-notice nm-search-notice--rego">'
            . 'Rego lookup for <strong>' . esc_html( $rego ) . '</strong> is coming soon &mdash; '
            . 'try <a href="' . $clear . '">searching by size</a> in the meantime.'
            . '</div>';
    }
}

// ── Inline styles (self-contained, matches brand palette) ──────────────────────
add_action( 'wp_head', 'nm_tyre_search_styles' );
function nm_tyre_search_styles() {
    if ( ! is_shop() && ! is_product_taxonomy() ) return;
    echo '<style>
.nm-search-notice {
    background: rgba(255,92,0,0.08);
    border-left: 3px solid #FF5C00;
    padding: 10px 16px;
    border-radius: 6px;
    font-size: 14px;
    margin-bottom: 20px;
    color: #374151;
}
.nm-search-notice--rego {
    background: rgba(19,32,67,0.06);
    border-left-color: #132043;
}
.nm-notice-clear {
    margin-left: 12px;
    color: #6B7280;
    font-size: 13px;
    text-decoration: none;
}
.nm-notice-clear:hover { color: #FF5C00; }
    </style>';
}

// ── Shared parser ───────────────────────────────────────────────────────────────
// Accepts: 205-55-R16 or 205-55-16
function nm_parse_tyre_size() {
    if ( empty( $_GET['tyre_size'] ) ) return null;

    $raw = sanitize_text_field( wp_unslash( $_GET['tyre_size'] ) );

    if ( ! preg_match( '/^(\d{3})-(\d{2,3})-R?(\d{2,3})$/i', $raw, $m ) ) return null;

    return [
        'width'   => $m[1],
        'profile' => $m[2],
        'rim'     => $m[3],
    ];
}
