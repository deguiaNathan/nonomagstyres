<?php
/**
 * Theme bootstrap for the exact React-powered WordPress theme.
 *
 * @package NonoMagsExact
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function nonomags_exact_setup() {
	add_theme_support( 'title-tag' );
	add_theme_support(
		'html5',
		array(
			'search-form',
			'comment-form',
			'comment-list',
			'gallery',
			'caption',
			'style',
			'script',
		)
	);
	add_theme_support( 'woocommerce' );
	add_theme_support( 'wc-product-gallery-zoom' );
	add_theme_support( 'wc-product-gallery-lightbox' );
	add_theme_support( 'wc-product-gallery-slider' );
}
add_action( 'after_setup_theme', 'nonomags_exact_setup' );

function nonomags_exact_is_woo_available() {
	return class_exists( 'WooCommerce' ) && function_exists( 'wc_get_product' );
}

function nonomags_exact_is_store_context() {
	if ( ! nonomags_exact_is_woo_available() ) {
		return false;
	}

	return ( function_exists( 'is_shop' ) && is_shop() )
		|| is_post_type_archive( 'product' )
		|| ( function_exists( 'is_product_taxonomy' ) && is_product_taxonomy() );
}

function nonomags_exact_is_native_checkout_request() {
	if ( ! nonomags_exact_is_woo_available() || ! function_exists( 'is_checkout' ) || ! is_checkout() ) {
		return false;
	}

	$native_checkout = isset( $_GET['native-checkout'] ) ? sanitize_text_field( wp_unslash( $_GET['native-checkout'] ) ) : '';

	return '1' === (string) $native_checkout;
}

function nonomags_exact_get_asset( $pattern ) {
	$matches = glob( get_template_directory() . '/assets/app/assets/' . $pattern );

	if ( empty( $matches ) ) {
		return null;
	}

	sort( $matches );
	$file = $matches[0];

	return array(
		'path'    => $file,
		'url'     => get_template_directory_uri() . '/assets/app/assets/' . basename( $file ),
		'version' => (string) filemtime( $file ),
	);
}

function nonomags_exact_has_app_bundle() {
	return nonomags_exact_get_asset( 'index-*.js' ) && nonomags_exact_get_asset( 'index-*.css' );
}

function nonomags_exact_get_shop_url() {
	if ( nonomags_exact_is_woo_available() ) {
		$shop_page_id = wc_get_page_id( 'shop' );
		if ( $shop_page_id > 0 ) {
			return get_permalink( $shop_page_id );
		}
	}

	return home_url( '/shop/' );
}

function nonomags_exact_get_cart_url() {
	if ( nonomags_exact_is_woo_available() && function_exists( 'wc_get_cart_url' ) ) {
		return wc_get_cart_url();
	}

	return home_url( '/cart/' );
}

function nonomags_exact_get_checkout_url() {
	if ( nonomags_exact_is_woo_available() && function_exists( 'wc_get_checkout_url' ) ) {
		return wc_get_checkout_url();
	}

	return home_url( '/checkout/' );
}

function nonomags_exact_get_account_url() {
	if ( nonomags_exact_is_woo_available() && function_exists( 'wc_get_page_permalink' ) ) {
		$account_url = wc_get_page_permalink( 'myaccount' );
		if ( $account_url ) {
			return $account_url;
		}
	}

	return '';
}

function nonomags_exact_get_terms_url() {
	$terms_page_id = absint( get_option( 'woocommerce_terms_page_id', 0 ) );
	if ( $terms_page_id > 0 ) {
		$terms_url = get_permalink( $terms_page_id );
		if ( $terms_url ) {
			return $terms_url;
		}
	}

	return '';
}

function nonomags_exact_get_current_template() {
	if ( is_front_page() || is_home() ) {
		return 'home';
	}

	if ( ( function_exists( 'is_cart' ) && is_cart() ) || ( function_exists( 'is_checkout' ) && is_checkout() ) ) {
		return 'checkout';
	}

	if ( nonomags_exact_is_store_context() ) {
		return 'store';
	}

	if ( is_singular( 'product' ) ) {
		return 'product';
	}

	return 'page';
}

function nonomags_exact_get_fitting_stations() {
	$stations = array(
		array(
			'value'    => 'auckland-central',
			'label'    => 'Tyre Plus - Auckland Central',
			'city'     => 'Auckland',
			'postcode' => '1010',
		),
		array(
			'value'    => 'auckland-east',
			'label'    => 'Fast Fit - East Auckland',
			'city'     => 'Auckland',
			'postcode' => '2013',
		),
		array(
			'value'    => 'wellington',
			'label'    => 'Capital Tyres - Wellington CBD',
			'city'     => 'Wellington',
			'postcode' => '6011',
		),
		array(
			'value'    => 'christchurch',
			'label'    => 'South Island Tyres - Christchurch',
			'city'     => 'Christchurch',
			'postcode' => '8011',
		),
		array(
			'value'    => 'hamilton',
			'label'    => 'Waikato Wheel Works - Hamilton',
			'city'     => 'Hamilton',
			'postcode' => '3204',
		),
	);

	return apply_filters( 'nonomags_exact_fitting_stations', $stations );
}

function nonomags_exact_get_currency_config() {
	$currency_code  = nonomags_exact_is_woo_available() ? get_woocommerce_currency() : 'NZD';
	$currency_symbol = nonomags_exact_is_woo_available()
		? html_entity_decode( wp_strip_all_tags( get_woocommerce_currency_symbol( $currency_code ) ) )
		: '$';
	$minor_unit     = nonomags_exact_is_woo_available() && function_exists( 'wc_get_price_decimals' )
		? (int) wc_get_price_decimals()
		: 2;

	return array(
		'currencyCode'      => $currency_code,
		'currencySymbol'    => $currency_symbol,
		'currencyMinorUnit' => $minor_unit,
		'currencyPrefix'    => $currency_symbol,
		'currencySuffix'    => '',
	);
}

function nonomags_exact_get_current_product_runtime() {
	if ( ! is_singular( 'product' ) || ! nonomags_exact_is_woo_available() ) {
		return array();
	}

	$product = wc_get_product( get_queried_object_id() );
	if ( ! $product ) {
		return array();
	}

	return array(
		'id'        => $product->get_id(),
		'slug'      => $product->get_slug(),
		'permalink' => get_permalink( $product->get_id() ),
	);
}

function nonomags_exact_get_runtime_config() {
	$checkout_url = nonomags_exact_get_checkout_url();

	return array(
		'enabled'           => true,
		'wooEnabled'        => nonomags_exact_is_woo_available(),
		'restUrl'           => rest_url(),
		'apiBase'           => rest_url( 'nonomags/v1/' ),
		'storeApiBase'      => rest_url( 'wc/store/v1/' ),
		'homeUrl'           => home_url( '/' ),
		'shopUrl'           => nonomags_exact_get_shop_url(),
		'cartUrl'           => nonomags_exact_get_cart_url(),
		'checkoutUrl'       => $checkout_url,
		'nativeCheckoutUrl' => add_query_arg( 'native-checkout', '1', $checkout_url ),
		'accountUrl'        => nonomags_exact_get_account_url(),
		'privacyPolicyUrl'  => function_exists( 'get_privacy_policy_url' ) ? get_privacy_policy_url() : '',
		'termsUrl'          => nonomags_exact_get_terms_url(),
		'currentTemplate'   => nonomags_exact_get_current_template(),
		'currentProduct'    => nonomags_exact_get_current_product_runtime(),
		'showPrototypeTools' => false,
		'storeApiNonce'     => nonomags_exact_is_woo_available() ? wp_create_nonce( 'wc_store_api' ) : '',
		'currency'          => nonomags_exact_get_currency_config(),
		'fittingStations'   => nonomags_exact_get_fitting_stations(),
	);
}

function nonomags_exact_enqueue_assets() {
	if ( is_admin() ) {
		return;
	}

	wp_enqueue_style(
		'nonomags-exact-theme',
		get_stylesheet_uri(),
		array(),
		wp_get_theme()->get( 'Version' )
	);

	$native_checkout = nonomags_exact_is_native_checkout_request();
	$bridge_deps     = array( 'nonomags-exact-theme' );

	$app_css = nonomags_exact_get_asset( 'index-*.css' );
	if ( $app_css && ! $native_checkout ) {
		wp_enqueue_style(
			'nonomags-exact-app',
			$app_css['url'],
			array( 'nonomags-exact-theme' ),
			$app_css['version']
		);
		$bridge_deps[] = 'nonomags-exact-app';
	}

	$bridge_css_path = get_template_directory() . '/assets/css/wp-bridge.css';
	if ( file_exists( $bridge_css_path ) ) {
		wp_enqueue_style(
			'nonomags-exact-bridge',
			get_template_directory_uri() . '/assets/css/wp-bridge.css',
			$bridge_deps,
			(string) filemtime( $bridge_css_path )
		);
	}

	$app_js = nonomags_exact_get_asset( 'index-*.js' );
	if ( $app_js && ! $native_checkout ) {
		wp_enqueue_script(
			'nonomags-exact-app',
			$app_js['url'],
			array(),
			$app_js['version'],
			true
		);

		wp_add_inline_script(
			'nonomags-exact-app',
			'window.NonoMagsWp = ' . wp_json_encode( nonomags_exact_get_runtime_config(), JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE ) . ';',
			'before'
		);
	}
}
add_action( 'wp_enqueue_scripts', 'nonomags_exact_enqueue_assets', 20 );

function nonomags_exact_module_script_tag( $tag, $handle, $src ) {
	if ( 'nonomags-exact-app' !== $handle ) {
		return $tag;
	}

	return sprintf(
		'<script type="module" crossorigin src="%s"></script>',
		esc_url( $src )
	);
}
add_filter( 'script_loader_tag', 'nonomags_exact_module_script_tag', 10, 3 );

function nonomags_exact_dequeue_wordpress_frontend_styles() {
	if ( is_admin() ) {
		return;
	}

	wp_dequeue_style( 'wp-block-library' );
	wp_dequeue_style( 'wp-block-library-theme' );
	wp_dequeue_style( 'classic-theme-styles' );
	wp_dequeue_style( 'global-styles' );
}
add_action( 'wp_enqueue_scripts', 'nonomags_exact_dequeue_wordpress_frontend_styles', 100 );

function nonomags_exact_admin_notice_missing_bundle() {
	if ( ! current_user_can( 'switch_themes' ) || nonomags_exact_has_app_bundle() ) {
		return;
	}

	echo '<div class="notice notice-error"><p><strong>Nono Mags Exact:</strong> React build assets are missing. Run <code>npm run build:wp-theme</code> from the project root, then re-upload the theme zip.</p></div>';
}
add_action( 'admin_notices', 'nonomags_exact_admin_notice_missing_bundle' );

function nonomags_exact_admin_notice_missing_woocommerce() {
	if ( ! current_user_can( 'activate_plugins' ) || nonomags_exact_is_woo_available() ) {
		return;
	}

	echo '<div class="notice notice-warning"><p><strong>Nono Mags Exact:</strong> WooCommerce is required for live products, cart, and checkout. Activate WooCommerce before using the storefront routes.</p></div>';
}
add_action( 'admin_notices', 'nonomags_exact_admin_notice_missing_woocommerce' );

function nonomags_exact_require_woocommerce() {
	if ( nonomags_exact_is_woo_available() ) {
		return true;
	}

	return new WP_Error(
		'nonomags_woocommerce_required',
		'WooCommerce must be active for this theme integration.',
		array( 'status' => 503 )
	);
}

function nonomags_exact_find_attribute_values( $product, $candidates ) {
	$normalized_candidates = array_map(
		static function ( $candidate ) {
			return sanitize_title( (string) $candidate );
		},
		$candidates
	);

	foreach ( $product->get_attributes() as $attribute ) {
		$attribute_names = array_unique(
			array_filter(
				array(
					strtolower( (string) $attribute->get_name() ),
					sanitize_title( (string) $attribute->get_name() ),
				)
			)
		);

		if ( empty( array_intersect( $normalized_candidates, $attribute_names ) ) ) {
			continue;
		}

		if ( $attribute->is_taxonomy() ) {
			$values = wc_get_product_terms(
				$product->get_id(),
				$attribute->get_name(),
				array(
					'fields' => 'names',
				)
			);
		} else {
			$values = $attribute->get_options();
		}

		$values = array_values(
			array_filter(
				array_map(
					static function ( $value ) {
						return trim( wp_strip_all_tags( (string) $value ) );
					},
					(array) $values
				)
			)
		);

		if ( ! empty( $values ) ) {
			return $values;
		}
	}

	return array();
}

function nonomags_exact_get_product_categories( $product_id ) {
	$terms = wp_get_post_terms(
		$product_id,
		'product_cat',
		array(
			'fields' => 'names',
		)
	);

	if ( is_wp_error( $terms ) ) {
		return array();
	}

	return array_values( array_filter( array_map( 'trim', $terms ) ) );
}

function nonomags_exact_extract_product_size( $product ) {
	$size_values = nonomags_exact_find_attribute_values(
		$product,
		array(
			'pa_size',
			'size',
			'tyre-size',
			'tyre_size',
			'wheel-size',
			'wheel_size',
			'rim-size',
			'rim_size',
		)
	);

	if ( ! empty( $size_values[0] ) ) {
		return $size_values[0];
	}

	$search_source = trim( $product->get_name() . ' ' . $product->get_sku() );

	if ( preg_match( '/\b\d{3}\/\d{2}R\d{2}\b/i', $search_source, $matches ) ) {
		return strtoupper( $matches[0] );
	}

	if ( preg_match( '/\b\d{2}x\d(?:\.\d)?(?:\s*5x\d+(?:\.\d+)?)?\b/i', $search_source, $matches ) ) {
		return strtoupper( preg_replace( '/\s+/', ' ', $matches[0] ) );
	}

	if ( $product->get_sku() ) {
		return $product->get_sku();
	}

	return 'Exact fit available';
}

function nonomags_exact_extract_product_width( $product, $size ) {
	$width_values = nonomags_exact_find_attribute_values(
		$product,
		array(
			'pa_width',
			'width',
			'tyre-width',
			'tyre_width',
		)
	);

	if ( ! empty( $width_values[0] ) ) {
		if ( preg_match( '/\d+/', $width_values[0], $matches ) ) {
			return $matches[0];
		}

		return $width_values[0];
	}

	if ( preg_match( '/\b(\d{3})\/\d{2}R\d{2}\b/i', $size, $matches ) ) {
		return $matches[1];
	}

	return '';
}

function nonomags_exact_extract_product_brand( $product ) {
	$brand_values = nonomags_exact_find_attribute_values(
		$product,
		array(
			'pa_brand',
			'brand',
			'manufacturer',
			'make',
		)
	);

	if ( ! empty( $brand_values[0] ) ) {
		return $brand_values[0];
	}

	$name_parts = preg_split( '/\s+/', trim( $product->get_name() ) );

	return ! empty( $name_parts[0] ) ? $name_parts[0] : 'Nono Mags';
}

function nonomags_exact_get_product_images( $product ) {
	$image_ids = array_unique(
		array_filter(
			array_merge(
				array( $product->get_image_id() ),
				$product->get_gallery_image_ids()
			)
		)
	);

	$images = array();

	foreach ( $image_ids as $image_id ) {
		$image_url = wp_get_attachment_image_url( $image_id, 'large' );
		if ( ! $image_url ) {
			$image_url = wp_get_attachment_image_url( $image_id, 'full' );
		}

		if ( $image_url ) {
			$images[] = $image_url;
		}
	}

	if ( empty( $images ) ) {
		$images[] = wc_placeholder_img_src( 'woocommerce_single' );
	}

	return array_values( array_unique( $images ) );
}

function nonomags_exact_get_clean_text( $text ) {
	return trim( preg_replace( '/\s+/', ' ', wp_strip_all_tags( (string) $text ) ) );
}

function nonomags_exact_get_product_specs( $product ) {
	$specs = array();

	if ( $product->get_sku() ) {
		$specs[] = array(
			'label' => 'SKU',
			'value' => $product->get_sku(),
		);
	}

	foreach ( $product->get_attributes() as $attribute ) {
		if ( ! $attribute->get_visible() ) {
			continue;
		}

		$attribute_key = sanitize_title( (string) $attribute->get_name() );
		if ( in_array( $attribute_key, array( 'pa_brand', 'brand', 'pa_size', 'size', 'pa_width', 'width', 'tyre-width', 'tyre_size', 'tyre-size' ), true ) ) {
			continue;
		}

		if ( $attribute->is_taxonomy() ) {
			$values = wc_get_product_terms(
				$product->get_id(),
				$attribute->get_name(),
				array(
					'fields' => 'names',
				)
			);
		} else {
			$values = $attribute->get_options();
		}

		$values = array_values( array_filter( array_map( 'trim', array_map( 'wp_strip_all_tags', (array) $values ) ) ) );
		if ( empty( $values ) ) {
			continue;
		}

		$specs[] = array(
			'label' => wc_attribute_label( $attribute->get_name() ),
			'value' => implode( ', ', $values ),
		);
	}

	if ( null !== $product->get_stock_quantity() ) {
		$specs[] = array(
			'label' => 'Stock',
			'value' => (string) $product->get_stock_quantity(),
		);
	}

	return array_slice( $specs, 0, 8 );
}

function nonomags_exact_get_product_badge( $product ) {
	$is_new = false;

	$created_at = $product->get_date_created();
	if ( $created_at ) {
		$is_new = $created_at->getTimestamp() >= strtotime( '-45 days' );
	}

	if ( $product->is_on_sale() ) {
		return array(
			'label' => 'Sale',
			'color' => 'bg-[#FF5C00]',
			'isNew' => $is_new,
		);
	}

	if ( $product->is_featured() ) {
		return array(
			'label' => 'Featured',
			'color' => 'bg-[#132043]',
			'isNew' => $is_new,
		);
	}

	if ( $is_new ) {
		return array(
			'label' => 'New',
			'color' => 'bg-emerald-600',
			'isNew' => true,
		);
	}

	return array(
		'label' => '',
		'color' => 'bg-[#132043]',
		'isNew' => false,
	);
}

function nonomags_exact_normalize_product( $product ) {
	if ( ! $product ) {
		return null;
	}

	$images       = nonomags_exact_get_product_images( $product );
	$categories   = nonomags_exact_get_product_categories( $product->get_id() );
	$size         = nonomags_exact_extract_product_size( $product );
	$brand        = nonomags_exact_extract_product_brand( $product );
	$width        = nonomags_exact_extract_product_width( $product, $size );
	$badge_config = nonomags_exact_get_product_badge( $product );
	$price        = (float) wc_get_price_to_display( $product );
	$regular_raw  = $product->get_regular_price();
	$regular      = '' !== $regular_raw
		? (float) wc_get_price_to_display(
			$product,
			array(
				'price' => (float) $regular_raw,
			)
		)
		: null;

	if ( null !== $regular && $regular <= $price ) {
		$regular = null;
	}

	$summary     = nonomags_exact_get_clean_text( $product->get_short_description() );
	$description = nonomags_exact_get_clean_text( $product->get_description() );
	$rating      = (float) $product->get_average_rating();
	$review_count = (int) $product->get_review_count();

	return array(
		'id'            => $product->get_id(),
		'slug'          => $product->get_slug(),
		'permalink'     => get_permalink( $product->get_id() ),
		'brand'         => $brand,
		'name'          => $product->get_name(),
		'category'      => ! empty( $categories[0] ) ? $categories[0] : 'Tyres',
		'categories'    => $categories,
		'size'          => $size,
		'width'         => $width,
		'price'         => round( $price, 2 ),
		'originalPrice' => null !== $regular ? round( $regular, 2 ) : null,
		'rating'        => $rating > 0 ? $rating : 0,
		'reviews'       => $review_count,
		'badge'         => $badge_config['label'],
		'badgeColor'    => $badge_config['color'],
		'inStock'       => $product->is_in_stock(),
		'image'         => $images[0],
		'images'        => $images,
		'isNew'         => $badge_config['isNew'],
		'summary'       => $summary,
		'description'   => $description,
		'specs'         => nonomags_exact_get_product_specs( $product ),
		'hasOptions'    => $product->is_type( 'variable' ),
		'purchasable'   => $product->is_purchasable(),
	);
}

function nonomags_exact_get_product_reviews( $product_id ) {
	$comments = get_comments(
		array(
			'post_id' => $product_id,
			'status'  => 'approve',
			'type'    => 'review',
			'number'  => 6,
		)
	);

	$reviews = array();

	foreach ( $comments as $comment ) {
		$rating = (int) get_comment_meta( $comment->comment_ID, 'rating', true );

		$reviews[] = array(
			'id'       => (int) $comment->comment_ID,
			'name'     => get_comment_author( $comment ),
			'location' => 'Verified buyer',
			'rating'   => $rating > 0 ? $rating : 5,
			'date'     => get_comment_date( 'M j, Y', $comment ),
			'text'     => nonomags_exact_get_clean_text( $comment->comment_content ),
		);
	}

	return $reviews;
}

function nonomags_exact_resolve_product( $product_ref ) {
	if ( is_numeric( $product_ref ) ) {
		return wc_get_product( (int) $product_ref );
	}

	$post = get_page_by_path( sanitize_title( (string) $product_ref ), OBJECT, 'product' );
	if ( ! $post instanceof WP_Post ) {
		return null;
	}

	return wc_get_product( $post->ID );
}

function nonomags_exact_rest_products() {
	$woocommerce = nonomags_exact_require_woocommerce();
	if ( is_wp_error( $woocommerce ) ) {
		return $woocommerce;
	}

	$products = wc_get_products(
		array(
			'status'            => 'publish',
			'limit'             => -1,
			'orderby'           => 'menu_order',
			'order'             => 'ASC',
			'catalog_visibility' => 'visible',
			'return'            => 'objects',
		)
	);

	$items         = array();
	$categories    = array();
	$brands        = array();
	$widths        = array();
	$maximum_price = 0;

	foreach ( $products as $product ) {
		$normalized = nonomags_exact_normalize_product( $product );
		if ( ! $normalized ) {
			continue;
		}

		$items[]       = $normalized;
		$categories    = array_merge( $categories, $normalized['categories'] );
		$brands[]      = $normalized['brand'];
		$maximum_price = max( $maximum_price, (float) $normalized['price'] );

		if ( ! empty( $normalized['width'] ) ) {
			$widths[] = $normalized['width'];
		}
	}

	$categories = array_values( array_unique( array_filter( $categories ) ) );
	$brands     = array_values( array_unique( array_filter( $brands ) ) );
	$widths     = array_values( array_unique( array_filter( $widths ) ) );

	sort( $categories );
	sort( $brands );
	sort( $widths, SORT_NATURAL );

	return rest_ensure_response(
		array(
			'items'   => $items,
			'filters' => array(
				'categories' => $categories,
				'brands'     => $brands,
				'widths'     => $widths,
				'maxPrice'   => (int) ceil( $maximum_price ),
			),
		)
	);
}

function nonomags_exact_rest_product( $request ) {
	$woocommerce = nonomags_exact_require_woocommerce();
	if ( is_wp_error( $woocommerce ) ) {
		return $woocommerce;
	}

	$product_ref = $request->get_param( 'product' );
	$product     = nonomags_exact_resolve_product( $product_ref );

	if ( ! $product || 'publish' !== $product->get_status() ) {
		return new WP_Error(
			'nonomags_product_not_found',
			'Product not found.',
			array( 'status' => 404 )
		);
	}

	$related_products = array();
	$related_ids      = wc_get_related_products( $product->get_id(), 4 );

	foreach ( $related_ids as $related_id ) {
		$related_product = wc_get_product( $related_id );
		if ( ! $related_product ) {
			continue;
		}

		$normalized_related = nonomags_exact_normalize_product( $related_product );
		if ( $normalized_related ) {
			$related_products[] = $normalized_related;
		}
	}

	return rest_ensure_response(
		array(
			'product' => nonomags_exact_normalize_product( $product ),
			'related' => $related_products,
			'reviews' => nonomags_exact_get_product_reviews( $product->get_id() ),
		)
	);
}

function nonomags_exact_gateway_requires_native_checkout( $gateway_id ) {
	$store_api_safe_gateways = array( 'bacs', 'cheque', 'cod' );

	return ! in_array( $gateway_id, $store_api_safe_gateways, true );
}

function nonomags_exact_rest_payment_methods() {
	$woocommerce = nonomags_exact_require_woocommerce();
	if ( is_wp_error( $woocommerce ) ) {
		return $woocommerce;
	}

	$methods = array();

	if ( nonomags_exact_is_woo_available() && function_exists( 'WC' ) && WC()->payment_gateways() ) {
		$gateways = WC()->payment_gateways()->payment_gateways();

		foreach ( $gateways as $gateway ) {
			if ( empty( $gateway->enabled ) || 'yes' !== $gateway->enabled ) {
				continue;
			}

			if ( method_exists( $gateway, 'is_available' ) && ! $gateway->is_available() ) {
				continue;
			}

			$methods[] = array(
				'id'                   => $gateway->id,
				'title'                => method_exists( $gateway, 'get_title' ) ? $gateway->get_title() : $gateway->title,
				'description'          => method_exists( $gateway, 'get_description' ) ? wp_strip_all_tags( $gateway->get_description() ) : wp_strip_all_tags( $gateway->description ),
				'orderButtonText'      => ! empty( $gateway->order_button_text ) ? $gateway->order_button_text : 'Place order',
				'requiresNativeCheckout' => nonomags_exact_gateway_requires_native_checkout( $gateway->id ),
				'supports'             => array_values( array_map( 'strval', (array) $gateway->supports ) ),
			);
		}
	}

	if ( empty( $methods ) ) {
		$methods[] = array(
			'id'                     => 'native_checkout',
			'title'                  => 'Secure WooCommerce Checkout',
			'description'            => 'Continue in the native WooCommerce checkout flow.',
			'orderButtonText'        => 'Continue to checkout',
			'requiresNativeCheckout' => true,
			'supports'               => array(),
		);
	}

	return rest_ensure_response(
		array(
			'methods' => $methods,
		)
	);
}

function nonomags_exact_register_rest_routes() {
	register_rest_route(
		'nonomags/v1',
		'/products',
		array(
			'methods'             => WP_REST_Server::READABLE,
			'callback'            => 'nonomags_exact_rest_products',
			'permission_callback' => '__return_true',
		)
	);

	register_rest_route(
		'nonomags/v1',
		'/products/(?P<product>[A-Za-z0-9\-_]+)',
		array(
			'methods'             => WP_REST_Server::READABLE,
			'callback'            => 'nonomags_exact_rest_product',
			'permission_callback' => '__return_true',
		)
	);

	register_rest_route(
		'nonomags/v1',
		'/payment-methods',
		array(
			'methods'             => WP_REST_Server::READABLE,
			'callback'            => 'nonomags_exact_rest_payment_methods',
			'permission_callback' => '__return_true',
		)
	);
}
add_action( 'rest_api_init', 'nonomags_exact_register_rest_routes' );

function nonomags_exact_render_native_checkout() {
	$content = '[woocommerce_checkout]';

	if ( nonomags_exact_is_woo_available() ) {
		$checkout_page_id = wc_get_page_id( 'checkout' );
		if ( $checkout_page_id > 0 ) {
			$checkout_page = get_post( $checkout_page_id );
			if ( $checkout_page instanceof WP_Post && ! empty( $checkout_page->post_content ) ) {
				$content = $checkout_page->post_content;
			}
		}
	}

	?>
	<main class="nonomags-exact-native-shell">
		<div class="nonomags-exact-native-container">
			<header class="nonomags-exact-native-header">
				<p class="nonomags-exact-native-kicker">WooCommerce Secure Checkout</p>
				<h1>Complete your order</h1>
				<p>Finish payment using your store's native gateway flow.</p>
			</header>
			<section class="nonomags-exact-native-panel">
				<?php echo apply_filters( 'the_content', $content ); ?>
			</section>
		</div>
	</main>
	<?php
}

function nonomags_exact_render_app_shell() {
	$has_bundle       = nonomags_exact_has_app_bundle();
	$native_checkout  = nonomags_exact_is_native_checkout_request();
	$body_theme_class = $native_checkout ? 'nonomags-exact-native-theme' : 'nonomags-exact-app-theme';
	?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<?php wp_head(); ?>
</head>
<body <?php body_class( $body_theme_class ); ?>>
<?php wp_body_open(); ?>
<?php if ( $native_checkout ) : ?>
	<?php nonomags_exact_render_native_checkout(); ?>
<?php else : ?>
	<div id="root"></div>
	<noscript class="nonomags-exact-noscript">
		JavaScript is required to view this theme.
	</noscript>
	<?php if ( ! $has_bundle ) : ?>
		<div class="nonomags-exact-missing-assets">
			<p>Theme assets are missing. Run <code>npm run build:wp-theme</code> and upload the generated zip again.</p>
		</div>
	<?php endif; ?>
<?php endif; ?>
<?php wp_footer(); ?>
</body>
</html>
	<?php
}
