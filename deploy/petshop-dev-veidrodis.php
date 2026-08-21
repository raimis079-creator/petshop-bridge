<?php
/**
 * Plugin Name: Petshop Dev Veidrodis v1.0 (R194)
 * Description: dev.avesa.lt lankytojams perraso petshop.lt nuorodas i dev.avesa.lt ir prideda noindex. LAIKINAS — trinti po DNS perjungimo.
 */
if (!defined('ABSPATH')) exit;
if (isset($_SERVER['HTTP_HOST']) && strtolower($_SERVER['HTTP_HOST']) === 'dev.avesa.lt') {
  header('X-Robots-Tag: noindex, nofollow', true);
  ob_start(function($html){
    if (!is_string($html) || $html === '') return $html;
    $html = str_replace('https://petshop.lt', 'https://dev.avesa.lt', $html);
    $html = str_replace('http://petshop.lt', 'https://dev.avesa.lt', $html);
    $html = str_replace('https:\/\/petshop.lt', 'https:\/\/dev.avesa.lt', $html);
    $html = str_replace('http:\/\/petshop.lt', 'https:\/\/dev.avesa.lt', $html);
    $html = str_replace('//petshop.lt/', '//dev.avesa.lt/', $html);
    return $html;
  });
}
