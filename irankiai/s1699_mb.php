<?php
/** Plugin Name: TEMP PS S1699 paieskos DRY testas (read-only) */


final class Petshop_Paieska_T {
	const SINONIMAI = array(
		'jesera' => 'josera', 'jassera' => 'josera', 'jorsera' => 'josera', 'josena' => 'josera', 'joseta' => 'josera',
		'eucanuba' => 'eukanuba', 'eukanuva' => 'eukanuba',
		'expulsion' => 'exclusion', 'exclusive' => 'exclusion', 'exlusion' => 'exclusion', 'exclusion hypoalergenic' => 'exclusion hypoallergenic',
		'royal canine' => 'royal canin', 'royalcanin' => 'royal canin', 'royal cani' => 'royal canin',
		'anikonds' => 'animonda', 'animonda vom feinstein' => 'animonda vom feinsten', 'vom feinstein' => 'vom feinsten',
		'sum palst' => 'sum-plast', 'sumplast' => 'sum-plast',
		'gastrointensial' => 'gastrointestinal', 'gastrointestinial' => 'gastrointestinal', 'gastro intestinal' => 'gastrointestinal',
		'hypoalergenic' => 'hypoallergenic', 'hipoalergenis' => 'hypoallergenic', 'hipoalerginis' => 'hypoallergenic',
		'churru' => 'churu', 'ciuru' => 'churu',
		'furminatorius' => 'furminator', 'flexy' => 'flexi',
		'katės pieno pakaitalas' => 'pieno pakaitalas', 'kačių pieno pakaitalas' => 'pieno pakaitalas',
		'ausu valiklis' => 'ausų valiklis',
	);
	const STOP = array( 'ir', 'su', 'be', 'iš', 'is', 'the', 'and', 'for', 'sausas', 'sausasmaistas', 'maistas', 'pašaras', 'pasaras' );

	public static function init() {
		if ( is_admin() && ! wp_doing_ajax() ) { return; }
		if ( get_option( 'ps_paieska_isjungta' ) ) { return; }
		add_filter( 'posts_search', array( __CLASS__, 'posts_search' ), 20, 2 );
	}

	/** Ar tai produktų paieška (WC arba Flatsome ajax). */
	private static function produktu( WP_Query $q ) {
		$s = trim( (string) $q->get( 's' ) );
		if ( '' === $s ) { return false; }
		$pt = $q->get( 'post_type' );
		if ( is_array( $pt ) ) { return in_array( 'product', $pt, true ); }
		return 'product' === $pt || ( '' === $pt && $q->is_main_query() && isset( $_GET['post_type'] ) && 'product' === $_GET['post_type'] );
	}

	public static function normalizuoti( $s ) {
		$s = html_entity_decode( $s, ENT_QUOTES, 'UTF-8' );
		$s = mb_strtolower( trim( preg_replace( '/\s+/u', ' ', $s ) ) );
		foreach ( self::SINONIMAI as $nuo => $i ) {
			if ( false !== mb_strpos( $s, $nuo ) ) { $s = str_replace( $nuo, $i, $s ); }
		}
		return $s;
	}

	/** Žodžio kamienas LIKE'ui: ≥8 raidžių → 6, 6–7 → 5, kitaip visas. Skaičiai ir SKU lieka. */
	public static function kamienas( $w ) {
		if ( preg_match( '/\d/', $w ) ) { return $w; }
		$n = mb_strlen( $w );
		if ( $n >= 8 ) { return mb_substr( $w, 0, 6 ); }
		if ( $n >= 6 ) { return mb_substr( $w, 0, 5 ); }
		return $w;
	}

	public static function posts_search( $search, $q ) {
		if ( ! self::produktu( $q ) ) { return $search; }
		global $wpdb;
		$s = self::normalizuoti( (string) $q->get( 's' ) );
		$zodziai = array_values( array_filter( preg_split( '/[\s,\/]+/u', $s ), function ( $w ) { return '' !== $w && ! in_array( $w, self::STOP, true ); } ) );
		if ( ! $zodziai ) { return $search; }

		$and = array();
		foreach ( $zodziai as $w ) {
			$k = '%' . $wpdb->esc_like( self::kamienas( $w ) ) . '%';
			$and[] = $wpdb->prepare( "({$wpdb->posts}.post_title LIKE %s OR {$wpdb->posts}.post_excerpt LIKE %s OR {$wpdb->posts}.post_content LIKE %s)", $k, $k, $k );
		}
		$where = '(' . implode( ' AND ', $and ) . ')';

		// SKU / ID: visa užklausa be tarpų
		$sku = preg_replace( '/\s+/u', '', $s );
		if ( '' !== $sku && mb_strlen( $sku ) <= 20 && preg_match( '/\d/', $sku ) ) {
			$where .= $wpdb->prepare( " OR {$wpdb->posts}.ID IN (SELECT post_id FROM {$wpdb->postmeta} WHERE meta_key='_sku' AND meta_value LIKE %s)", '%' . $wpdb->esc_like( $sku ) . '%' );
			if ( ctype_digit( $sku ) ) { $where .= $wpdb->prepare( " OR {$wpdb->posts}.ID = %d", (int) $sku ); }
		}
		return " AND ({$where}) ";
	}
}


add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1699'])||$_GET['ps_s1699']!=='1') return;
  header('Content-Type: application/json; charset=utf-8'); $o=array('v'=>'S1699 mb');
  $fr=array('prolivet','animonda vom feinstein','virbac','royal canin sterilised in jelly','19997','hill\'s science plan kitten','jesera festivalis','eucanuba puppy','expulsion','exclusive','royal canine renal cat','anikonds vom feinstein','kiauliena su zirneis','kiauliena su zirneleis','purskiamas ausu valiklis','inps11','hyos02','sum palst','katės pieno pakaitalas','gastrointestinial','josera sensi adult','josera help weight &amp; diabetic','leger','leger 10','ambrosia begrūdis su ėriena ir šviežia elniena sausasmaistas','exclusion','miamor','kraikas','shuttle','žuvis','farmina n&amp;d','malt-soft','royal canin yorkshire','trainer','dovanu kuponas');
  foreach($fr as $s){
    $q1=new WP_Query(array('s'=>$s,'post_type'=>'product','post_status'=>'publish','posts_per_page'=>3,'fields'=>'ids')); $a=$q1->found_posts;
    add_filter('posts_search',array('Petshop_Paieska_T','posts_search'),20,2);
    $q2=new WP_Query(array('s'=>$s,'post_type'=>'product','post_status'=>'publish','posts_per_page'=>3,'fields'=>'ids')); $b=$q2->found_posts;
    remove_filter('posts_search',array('Petshop_Paieska_T','posts_search'),20);
    $t=array(); foreach($q2->posts as $id) $t[]=mb_substr(get_the_title($id),0,45);
    $o['t'][]=array('s'=>$s,'buvo'=>$a,'bus'=>$b,'pvz'=>$t);
  }
  echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
