<?php
/**
 * Petshop Sargas Saugumas v1.0 (S1678) — xmlrpc uždarymas, vartotojų neatskleidimas, saugumo antraštės, Store API limitas.
 * Prisijungimo (wp-login) ir prisijungusių vartotojų REST neliečia. Bridge (app password) neliečia.
 */
if (!defined('ABSPATH')) exit;

// 1. XML-RPC: išjungtas visiškai + X-Pingback antraštė nuimta
add_filter('xmlrpc_enabled', '__return_false');
add_filter('xmlrpc_methods', '__return_empty_array');
add_filter('wp_headers', function($h){ unset($h['X-Pingback']); return $h; });
if (defined('XMLRPC_REQUEST') && XMLRPC_REQUEST) { status_header(403); header('Content-Type: text/plain'); exit('403'); }

// 2. Vartotojų atskleidimas: /wp/v2/users tik prisijungusiems; ?author=N ir autoriaus archyvai → 404 svečiams
add_filter('rest_pre_dispatch', function($result, $server, $request){
  if (is_user_logged_in()) return $result;
  $r = $request->get_route();
  if (preg_match('#^/wp/v2/users(/|$)#', $r)) return new WP_Error('ps_rest_forbidden', 'Draudžiama', array('status' => 401));
  return $result;
}, 5, 3);
add_action('init', function(){
  if (is_admin() || is_user_logged_in()) return;
  if (isset($_GET['author']) || (isset($_SERVER['REQUEST_URI']) && preg_match('#^/author/#', $_SERVER['REQUEST_URI']))) {
    status_header(404); nocache_headers(); header('Content-Type: text/plain; charset=UTF-8'); exit('404');
  }
}, 1);
add_filter('author_rewrite_rules', '__return_empty_array');
// oEmbed autoriaus laukai
add_filter('oembed_response_data', function($d){ unset($d['author_name'], $d['author_url']); return $d; });

// 3. Saugumo antraštės (PHP atsakymams; statiniams — .htaccess)
add_action('send_headers', function(){
  if (headers_sent()) return;
  header('X-Frame-Options: SAMEORIGIN');
  header('X-Content-Type-Options: nosniff');
  header('Referrer-Policy: strict-origin-when-cross-origin');
  if (is_ssl()) header('Strict-Transport-Security: max-age=31536000');
});

// 4. WooCommerce Store API rate limit (25 užklausos / 10 s vienam IP)
add_filter('woocommerce_store_api_rate_limit_options', function($o){
  $o['enabled'] = true; $o['limit'] = 25; $o['seconds'] = 10; return $o;
});
