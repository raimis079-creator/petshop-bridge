<?php
/**
 * Plugin Name: Petshop Higiena
 * Description: Nerodo WordPress versijos ir nereikalingų antraščių. Versijos atskleidimas leidžia iš karto atrinkti svetaines pagal žinomas spragas.
 * Version: 1.0.0
 */
if (!defined('ABSPATH')) exit;

// <meta name="generator" content="WordPress x.y.z">
remove_action('wp_head', 'wp_generator');
add_filter('the_generator', '__return_empty_string');

// Really Simple Discovery ir Windows Live Writer — nenaudojami, bet skelbia versiją
remove_action('wp_head', 'rsd_link');
remove_action('wp_head', 'wlwmanifest_link');

// X-Pingback antraštė
add_filter('wp_headers', function ($h) { unset($h['X-Pingback']); return $h; });
