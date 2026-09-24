<?php
/** Plugin Name: TEMP PS S1716n zb-matmenys (1 deploy / 2 kopija+valymas / 3 testas / 9 isjungti+atstatyti) */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1716n'])) return;
  $f=$_GET['ps_s1716n']; @set_time_limit(170); global $wpdb; $r=['v'=>'S1716n','faze'=>$f];
  $fn=WPMU_PLUGIN_DIR.'/petshop-zb-matmenys.php'; $arch=dirname(rtrim(ABSPATH,'/')).'/ps-archyvas/'; $kopija=$arch.'zb_matmenys_s1716.json';
  $src=<<<'PHPSRC'
<?php
/**
 * Plugin Name: Petshop ZB matmenys v1.0 (ZB feed'o matmenų nenaudoti)
 * Description: ZB (Žalioji Banga) XML matmenys nepatikimi (0×0×0, metrai vietoj cm, 20×20×20 nuo 2 iki 12 kg, maišai
 *   80 cm), o Venipak pluginas pagal juos atmeta paštomatą (riba 61×41×39,5 cm) — 12–20 kg maišai kasoje gaudavo tik
 *   kurjerį, nors į paštomatą telpa (Raimis, 2026-09-24). Šis modulis ZB prekėms (`_zb_enabled=yes` arba
 *   `_ps_sandelis=zb`) neleidžia išsaugoti WC matmenų `_length/_width/_height`: `petshop-xml` importas juos rašo per
 *   `update_post_meta`, todėl `added/updated_post_meta` kabliai juos iškart ištrina. Žali ZB laukai `_zb_length` ir kt.
 *   lieka. Paštomato galimybę toliau lemia svoris (Venipak inst. riba) ir varnelė „Tik kurjeriu".
 * Version: 1.0
 * S1716 (2026-09-25). Išjungti: opcija `ps_zb_matmenys_isjungta`=1. Kopija prieš valymą: `ps-archyvas/zb_matmenys_s1716.json`
 *   ir opcija `ps_s1716_zb_matmenys_bak`.
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

class Petshop_ZB_Matmenys {
	const RAKTAI = array( '_length', '_width', '_height' );
	private static $vyksta = false;

	public static function init() {
		add_action( 'added_post_meta', array( __CLASS__, 'meta' ), 10, 4 );
		add_action( 'updated_post_meta', array( __CLASS__, 'meta' ), 10, 4 );
	}

	public static function zb( $pid ) {
		$pid = (int) $pid; if ( $pid <= 0 ) { return false; }
		if ( get_post_meta( $pid, '_zb_enabled', true ) === 'yes' ) { return true; }
		return strtolower( (string) get_post_meta( $pid, '_ps_sandelis', true ) ) === 'zb';
	}

	public static function meta( $meta_id, $pid, $key, $value ) {
		if ( self::$vyksta || ! in_array( $key, self::RAKTAI, true ) ) { return; }
		if ( get_option( 'ps_zb_matmenys_isjungta' ) ) { return; }
		$tipas = get_post_type( $pid );
		if ( $tipas !== 'product' && $tipas !== 'product_variation' ) { return; }
		$pid_t = ( $tipas === 'product_variation' ) ? (int) wp_get_post_parent_id( $pid ) : (int) $pid;
		if ( ! self::zb( $pid_t ) ) { return; }
		self::$vyksta = true;
		delete_post_meta( $pid, $key );
		self::$vyksta = false;
	}

	/** ZB prekės su WC matmenimis: [id => [l,w,h]] */
	public static function sarasas() {
		global $wpdb; $out = array();
		$ids = $wpdb->get_col( "SELECT DISTINCT p.ID FROM {$wpdb->posts} p JOIN {$wpdb->postmeta} m ON m.post_id=p.ID AND m.meta_key IN ('_length','_width','_height') AND m.meta_value<>'' WHERE p.post_type IN ('product','product_variation')" );
		foreach ( $ids as $id ) {
			$id = (int) $id; $t = ( get_post_type( $id ) === 'product_variation' ) ? (int) wp_get_post_parent_id( $id ) : $id;
			if ( ! self::zb( $t ) ) { continue; }
			$out[ $id ] = array( get_post_meta( $id, '_length', true ), get_post_meta( $id, '_width', true ), get_post_meta( $id, '_height', true ) );
		}
		return $out;
	}

	/** Vienkartinis valymas pagal sarasas(); senos reikšmės — opcijoje. Grąžina išvalytų skaičių. */
	public static function isvalyti( $sarasas, $bak_opcija = 'ps_s1716_zb_matmenys_bak' ) {
		$bak = get_option( $bak_opcija, array() ); $n = 0;
		foreach ( $sarasas as $id => $d ) {
			$bak[ $id ] = $d;
			self::$vyksta = true;
			foreach ( self::RAKTAI as $k ) { delete_post_meta( (int) $id, $k ); }
			self::$vyksta = false;
			if ( function_exists( 'wc_delete_product_transients' ) ) { wc_delete_product_transients( (int) $id ); }
			$n++;
		}
		update_option( $bak_opcija, $bak, false );
		return $n;
	}
}
Petshop_ZB_Matmenys::init();
PHPSRC;
  try{
    if($f==='1'){ if(file_exists($fn)) throw new Exception('failas jau yra'); $tok=@token_get_all($src,TOKEN_PARSE); if(!$tok) throw new Exception('token'); file_put_contents($fn,$src); $r['md5']=md5_file($fn); $r['dydis']=filesize($fn);
      $h=wp_remote_get(home_url('/?nc='.mt_rand()),['timeout'=>40,'sslverify'=>false]); $r['heartbeat']=wp_remote_retrieve_response_code($h); if($r['heartbeat']>=500||$r['heartbeat']==0){ rename($fn,$fn.'.off_s1716'); $r['ROLLBACK']=1; } }
    if($f==='2'){ if(!class_exists('Petshop_ZB_Matmenys')) throw new Exception('klase neikelta');
      $s=Petshop_ZB_Matmenys::sarasas(); $r['kopijoje_prekiu']=count($s);
      if(!is_dir($arch)||!is_writable($arch)) throw new Exception('ps-archyvas nerasomas');
      if(file_put_contents($kopija,json_encode(['data'=>current_time('mysql'),'n'=>count($s),'matmenys'=>$s],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT))===false) throw new Exception('kopija neirasyta');
      $chk=json_decode(file_get_contents($kopija),true); if(!is_array($chk)||count($chk['matmenys'])!==count($s)) throw new Exception('kopija nesutampa');
      $r['kopija']=[$kopija,filesize($kopija),md5_file($kopija)];
      $r['isvalyta']=Petshop_ZB_Matmenys::isvalyti($s); $r['bak_opcija_n']=count(get_option('ps_s1716_zb_matmenys_bak',[]));
      $r['liko_zb_su_matmenimis']=count(Petshop_ZB_Matmenys::sarasas());
      update_post_meta(12466,'_length','80'); $r['kablio_testas_po_update']=get_post_meta(12466,'_length',true); $r['zb_raw_liko']=get_post_meta(12466,'_zb_length',true);
      if(function_exists('wp_cache_clear_cache')) wp_cache_clear_cache(); }
    if($f==='3'){ wc_load_cart(); WC()->customer->set_shipping_country('LT'); WC()->customer->set_shipping_postcode('01100'); foreach([12466=>'Eukanuba 12 kg',12673=>'Gemon Kitten 20 kg',12719=>'Real Dog 15 kg',17978=>'Josera 12,5 kg'] as $pid=>$pav){ WC()->cart->empty_cart(false); WC()->cart->add_to_cart($pid,1); WC()->cart->calculate_totals(); $pk=WC()->shipping()->calculate_shipping(WC()->cart->get_shipping_packages()); $o=[]; foreach($pk as $i=>$p){ foreach($p['rates'] as $rid=>$rt) $o[]=$rid.' '.$rt->get_cost(); $o['default']=wc_get_default_shipping_method_for_package($i,$p,''); } $r['tarifai'][$pid.' '.$pav]=['kg'=>get_post_meta($pid,'_weight',true),'dims'=>get_post_meta($pid,'_length',true).'x'.get_post_meta($pid,'_width',true).'x'.get_post_meta($pid,'_height',true),'rates'=>$o]; }
      WC()->cart->empty_cart(false); WC()->cart->add_to_cart(12673,2); WC()->cart->calculate_totals(); $pk=WC()->shipping()->calculate_shipping(WC()->cart->get_shipping_packages()); $o=[]; foreach($pk as $p){ foreach($p['rates'] as $rid=>$rt) $o[]=$rid; } $r['tarifai']['2x Gemon 20 kg = 40 kg']=$o; WC()->cart->empty_cart(false); }
    if($f==='9'){ if(file_exists($fn)) rename($fn,$fn.'.off_s1716'); $bak=file_exists($kopija)?(json_decode(file_get_contents($kopija),true)['matmenys']??[]):get_option('ps_s1716_zb_matmenys_bak',[]); $n=0; foreach($bak as $id=>$d){ update_post_meta((int)$id,'_length',$d[0]); update_post_meta((int)$id,'_width',$d[1]); update_post_meta((int)$id,'_height',$d[2]); $n++; } $r['atstatyta']=$n; }
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  wp_send_json($r);
}, 1);
