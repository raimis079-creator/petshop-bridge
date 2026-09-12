<?php
/** TEMP PS S1677 cn — snippet #619 pavadinimas -> v1.4. */
add_action('init', function(){ if(!isset($_GET['ps_s1677cn'])) return; global $wpdb; $t=$wpdb->prefix.'snippets';
  $wpdb->update($t,array('name'=>'Petshop Consent Bridge v1.4 (Complianz -> GTM, legalus denied default)'),array('id'=>619)); wp_cache_flush();
  header('Content-Type: application/json'); echo json_encode($wpdb->get_row("SELECT id,name,MD5(code) m FROM $t WHERE id=619",ARRAY_A)); exit; });
