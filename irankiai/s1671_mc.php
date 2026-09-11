<?php
/** Plugin Name: TEMP PS S1671 mc noop */
add_action('init', function(){ if(isset($_GET['ps_s1671m'])){ header('Content-Type: application/json'); echo json_encode(array('v'=>'S1671mc','ok'=>1)); exit; } });
