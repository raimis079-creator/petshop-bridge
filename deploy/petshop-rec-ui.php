<?php
/**
 * Plugin Name: Petshop Rec UI
 * Description: Rekomendaciju blokas "Mano augintinis" puslapyje + rec_clicked ivykis. M8 neliestas — blokas prisideda pats.
 * Version: 1.0
 *
 * Rodo variklio v1 (GET /petshop/v1/pet-recommendations/{id}) TOP kandidatus
 * pirmam aktyviam augintiniui. Jei variklis grazina failed — blokas tyliai
 * nesirodo (priezastis jau guli ps_rec_log, klientui klaidu nerodom).
 *
 * rec_clicked (§4.2): paspaudus korta, pries navigacija sendBeacon
 * 'rec_clicked' su recommendation_id:product_id — uzdaro piltuvelio spraga
 * shown -> clicked -> add_to_cart -> purchased.
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

class Petshop_Rec_UI {

	const VERSIJA = '1.0';

	public static function init() {
		add_action( 'wp_footer', array( __CLASS__, 'blokas' ), 70 );
	}

	public static function blokas() {
		if ( is_admin() || ! is_user_logged_in() ) { return; }
		if ( ! function_exists( 'is_account_page' ) || ! is_account_page() ) { return; }
		$ajax = esc_js( admin_url( 'admin-ajax.php' ) );
		$rest = esc_js( esc_url_raw( rest_url( 'petshop/v1/' ) ) );
		$nonce = esc_js( wp_create_nonce( 'wp_rest' ) );
		?>
<script id="ps-rec-ui">
(function(){
'use strict';
if(!/\/augintinis\//.test(location.pathname))return;
var REST='<?php echo $rest; ?>',NONCE='<?php echo $nonce; ?>',AJAX='<?php echo $ajax; ?>';
function h(t,c,html){var e=document.createElement(t);if(c)e.className=c;if(html!==undefined)e.innerHTML=html;return e;}
function beacon(tipas,verte){
 try{var fd=new FormData();fd.append('action','ps_anketa_ivykis_rec');fd.append('tipas',tipas);fd.append('verte',verte);
  if(!(navigator.sendBeacon&&navigator.sendBeacon(AJAX,fd)))fetch(AJAX,{method:'POST',body:fd,keepalive:true,credentials:'same-origin'}).catch(function(){});
 }catch(e){}
}
function gauti(u){return fetch(u,{headers:{'X-WP-Nonce':NONCE},credentials:'same-origin'}).then(function(r){return r.ok?r.json():null;});}
gauti(REST+'pet-profile').then(function(d){
 if(!d)return null;
 var petai=Array.isArray(d)?d:(d.pets||d.items||[]);
 var pet=null;
 petai.forEach(function(p){if(!pet&&p&&p.id&&p.status!=='deleted')pet=p;if(p&&p.is_primary&&p.status!=='deleted')pet=p;});
 return pet?gauti(REST+'pet-recommendations/'+pet.id).then(function(r){return r&&{pet:pet,r:r};}):null;
}).then(function(x){
 if(!x||!x.r||x.r.rezultatas!=='ok'||!x.r.candidates||!x.r.candidates.length)return;
 var rid=x.r.recommendation_id||'';
 var kont=document.querySelector('.woocommerce-MyAccount-content')||document.querySelector('#pspet-form-host');
 if(!kont)return;
 var box=h('div','ps-rec-blokas');
 box.style.cssText='margin:26px 0;padding:20px;border:1px solid #e3e3de;border-radius:12px;background:#fbfbf8';
 var vardas=x.pet.pet_name||x.pet.name||'';
 box.appendChild(h('h3','','Rekomendacijos'+(vardas?(' '+vardas+' mitybai'):'')));
 box.appendChild(h('p','','Parinkta pagal profilį — tik maistas su patikrinta šėrimo lentele.'));
 var eile=h('div','');
 eile.style.cssText='display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:14px';
 x.r.candidates.forEach(function(c){
  var a=h('a','ps-rec-korta');
  a.href=c.permalink;
  a.style.cssText='display:block;padding:12px;border:1px solid #e6e6e0;border-radius:10px;background:#fff;text-decoration:none;color:inherit';
  var img=c.image?('<img src="'+c.image+'" alt="" style="width:100%;height:120px;object-fit:contain">'):'';
  var zym=c.need_match?'<div style="font-size:11px;color:#2e6b46;font-weight:600">Atitinka poreikį</div>':'';
  a.innerHTML=img+zym+'<div style="font-size:13px;line-height:1.35;margin-top:6px">'+c.name+'</div>'
   +'<div style="font-weight:700;margin-top:4px">'+Number(c.price).toFixed(2).replace('.',',')+' €</div>'
   +(c.protein_sources&&c.protein_sources.length?('<div style="font-size:11px;color:#777">'+c.protein_sources.join(', ')+'</div>'):'');
  a.addEventListener('click',function(){beacon('rec_clicked',rid+':'+c.product_id);});
  eile.appendChild(a);
 });
 box.appendChild(eile);
 kont.appendChild(box);
}).catch(function(){});
})();
</script>
		<?php
	}

	/** rec_clicked priemimas — atskiras action, sritis='rec'. */
	public static function ajax() {
		if ( ! class_exists( 'Petshop_Statistika' ) ) { wp_send_json_error(); }
		$tipas = isset( $_POST['tipas'] ) ? sanitize_key( wp_unslash( $_POST['tipas'] ) ) : '';
		if ( $tipas !== 'rec_clicked' ) { wp_send_json_error( 'tipas' ); }
		$verte = isset( $_POST['verte'] ) ? substr( sanitize_text_field( wp_unslash( $_POST['verte'] ) ), 0, 190 ) : '';
		Petshop_Statistika::irasyti( 'rec_clicked', array(
			'sritis' => 'rec', 'verte' => $verte, 'user_id' => get_current_user_id(),
		) );
		wp_send_json_success();
	}
}

add_action( 'wp_ajax_ps_anketa_ivykis_rec', array( 'Petshop_Rec_UI', 'ajax' ) );
add_action( 'wp_ajax_nopriv_ps_anketa_ivykis_rec', array( 'Petshop_Rec_UI', 'ajax' ) );
Petshop_Rec_UI::init();
