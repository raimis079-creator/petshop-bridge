
	/* ============================ v3.33: „+ NAUJAS UŽSAKYMAS“ telefonu (Raimis 09-05 B) ============================ */

	protected static function naujas_langas() { return isset( $_GET['view'] ) && 'naujas' === $_GET['view'] && ! self::senas(); }

	/** Pristatymo būdai telefoniniam užsakymui — iš WC zonos „LT“ (šalis) instancijų: Venipak kurjeris (instancijos pagal svorį), Venipak paštomatas, LP paštomatas (plan TERMINAL), LP kurjeris (HANDS). Kainos — instancijos `fee` / `fixed_cost` (be PVM) + nemokamo riba; darbuotojas gali pataisyti. `rate` — pristatymo PVM (LT standartinis). */
	protected static function naujas_pristatymas() {
		$out = array( 'venipak_kurjeris' => array( 't' => 'Venipak kurjeris', 'tipas' => 'kurjeris', 'inst' => array() ), 'venipak_pastomatas' => array( 't' => 'Venipak paštomatas', 'tipas' => 'pastomatas', 'inst' => array() ), 'lp' => array( 't' => 'LP Express paštomatas', 'tipas' => 'lp', 'inst' => array() ), 'lp_kurjeris' => array( 't' => 'LP Express kurjeris', 'tipas' => 'lp_kurjeris', 'inst' => array() ) );
		$zonos = WC_Shipping_Zones::get_zones(); $kand = array();
		foreach ( $zonos as $zi => $z ) { $lt = false; $tik_salis = true; foreach ( (array) $z['zone_locations'] as $l ) { if ( 'country' === $l->type && 'LT' === $l->code ) { $lt = true; } if ( 'country' !== $l->type ) { $tik_salis = false; } } if ( $lt ) { $kand[ $tik_salis ? 0 : 1 ][] = $zi; } }
		$pasirinkta = ! empty( $kand[0] ) ? $kand[0][0] : ( ! empty( $kand[1] ) ? $kand[1][0] : null ); // v3.33.1: „Lietuva“ (tik šalis), ne „Neringos savivaldybė“ (LT + pašto kodai 931*)
		foreach ( $zonos as $zi => $z ) {
			if ( $zi !== $pasirinkta ) { continue; }
			foreach ( $z['shipping_methods'] as $m ) {
				if ( 'yes' !== $m->enabled ) { continue; } $s = (array) $m->instance_settings;
				$row = array( 'id' => $m->id, 'inst' => (int) $m->instance_id, 'title' => (string) $m->title, 'fee' => 0.0, 'nuo' => (float) str_replace( ',', '.', (string) ( $s['minimum_weight'] ?? '' ) ), 'iki' => (float) str_replace( ',', '.', (string) ( $s['maximum_weight'] ?? '' ) ), 'nemok' => 0.0 );
				if ( 'shopup_venipak_shipping_courier_method' === $m->id ) { $row['fee'] = (float) str_replace( ',', '.', (string) ( $s['fee'] ?? 0 ) ); $row['nemok'] = (float) str_replace( ',', '.', (string) ( $s['min_amount_for_free_shipping'] ?? 0 ) ); $out['venipak_kurjeris']['inst'][] = $row; }
				elseif ( 'shopup_venipak_shipping_pickup_method' === $m->id ) { $row['fee'] = (float) str_replace( ',', '.', (string) ( $s['fee'] ?? 0 ) ); $row['nemok'] = (float) str_replace( ',', '.', (string) ( $s['min_amount_for_free_shipping'] ?? 0 ) ); $out['venipak_pastomatas']['inst'][] = $row; }
				elseif ( 'woo_lithuaniapost_lpexpress_terminal' === $m->id ) { $row['fee'] = (float) str_replace( ',', '.', (string) ( $s['fixed_cost'] ?? 0 ) ); $row['nemok'] = (float) str_replace( ',', '.', (string) ( $s['free_shipping_cost'] ?? 0 ) ); $out[ 'HANDS' === ( $s['plan'] ?? '' ) ? 'lp_kurjeris' : 'lp' ]['inst'][] = $row; }
			}
			break;
		}
		foreach ( $out as $k => $x ) { if ( ! $x['inst'] ) { unset( $out[ $k ] ); } else { usort( $out[ $k ]['inst'], function ( $a, $b ) { return $a['nuo'] <=> $b['nuo']; } ); } }
		if ( get_option( 'ps_dl_atsiemimas_av' ) ) { $out['av'] = array( 't' => 'Atsiėmimas AV', 'tipas' => 'av', 'inst' => array( array( 'id' => 'local_pickup', 'inst' => 0, 'title' => 'Atsiėmimas AV', 'fee' => 0.0, 'nuo' => 0.0, 'iki' => 0.0, 'nemok' => 0.0 ) ) ); } // C (išjungta, kol Raimis neįjungė)
		$rates = WC_Tax::find_shipping_rates( array( 'country' => 'LT', 'state' => '', 'postcode' => '', 'city' => '', 'tax_class' => '' ) ); $rate = 0.0; foreach ( (array) $rates as $r ) { $rate += (float) $r['rate']; }
		return array( $out, $rate );
	}

	/** Langas `view=naujas` — telefoninio užsakymo forma (klientas · prekės · pristatymas · apmokėjimas). Viskas vienoje formoje, POST `ps_dl_naujas`. */
	protected static function naujas() {
		list( $pm, $rate ) = self::naujas_pristatymas(); $n = wp_create_nonce( 'ps_dl_zurnalas' );
		echo '<main class="dl-main"><h1 class="dl-h1">Naujas užsakymas <small>telefonu / vietoje — kainos parduotuvės (su akcijomis), nuolaida tik su pastaba · užsakymas toliau eina įprastai (Gauti → Surinkti → lipdukas)</small></h1>';
		echo '<form method="post" action="' . esc_url( admin_url( 'admin-post.php' ) ) . '" class="dl-nu" id="dlNu" data-rate="' . esc_attr( number_format( $rate, 4, '.', '' ) ) . '" data-pm="' . esc_attr( wp_json_encode( $pm ) ) . '" data-n="' . esc_attr( $n ) . '">' . wp_nonce_field( 'ps_dl_naujas', '_wpnonce', true, false ) . '<input type="hidden" name="action" value="ps_dl_naujas">';
		echo '<section class="dl-kortele"><h2>1. Klientas</h2><div class="dl-nu-p"><input type="search" id="nuKlQ" placeholder="Ieškoti: telefonas, el. paštas, vardas — ankstesni pirkėjai" autocomplete="off"><div class="dl-nu-r" id="nuKlR"></div></div>'
			. '<input type="hidden" name="kl[uid]" id="nuUid" value="0"><div class="e2"><label>Vardas<input name="kl[vardas]" required></label><label>Pavardė<input name="kl[pavarde]"></label></div>'
			. '<div class="e2"><label>Telefonas<input name="kl[tel]" type="tel" required placeholder="+370…"></label><label>El. paštas <span class="pilkas maz">(gali nebūti; LP Express — privalomas)</span><input name="kl[el]" type="email"></label></div>'
			. '<label>Įmonė <span class="pilkas maz">(jei sąskaita įmonei)</span><input name="kl[imone]"></label>'
			. '<div class="dl-nu-adr"><label>Adresas (gatvė, namas, butas)<input name="kl[adresas]"></label><div class="e2"><label>Miestas<input name="kl[miestas]"></label><label>Pašto kodas<input name="kl[kodas]"></label></div></div></section>';
		echo '<section class="dl-kortele"><h2>2. Prekės</h2><div class="dl-nu-p"><input type="search" id="nuPrQ" placeholder="Ieškoti prekės: pavadinimas arba SKU" autocomplete="off"><div class="dl-nu-r" id="nuPrR"></div></div>'
			. '<table class="dl-tbl dl-nu-t" id="nuPrT"><thead><tr><th>Prekė</th><th class="c">Kiekis</th><th class="r">Kaina su PVM</th><th class="r">Suma</th><th></th></tr></thead><tbody></tbody></table><div class="pilkas maz" id="nuPrN">Prekių dar nėra — ieškok viršuje.</div>'
			. '<div class="dl-nu-nuol"><label>Nuolaida <input type="number" name="nuolaida" id="nuNuol" min="0" step="0.01" value="0"> €</label> <label class="dl-nu-nuolp">Pastaba <input name="nuolaida_pastaba" id="nuNuolP" placeholder="kodėl (privaloma, jei nuolaida)"></label></div></section>';
		$opts = ''; foreach ( $pm as $k => $x ) { $opts .= '<option value="' . esc_attr( $k ) . '" data-tipas="' . esc_attr( $x['tipas'] ) . '">' . esc_html( $x['t'] ) . '</option>'; }
		echo '<section class="dl-kortele"><h2>3. Pristatymas</h2><div class="e2"><label>Būdas<select name="prist" id="nuPrist">' . $opts . '</select></label><label>Kaina su PVM <span class="pilkas maz" id="nuPristN"></span><input type="number" name="prist_kaina" id="nuPristK" min="0" step="0.01" value="0"></label></div>'
			. '<div class="dl-nu-vieta" id="nuVieta" style="display:none"><div class="e2"><label>Paštomato paieška<input type="search" id="nuVietaQ" placeholder="pvz. Kaunas"></label><label>Paštomatas<select name="vieta" id="nuVietaS"><option value="">— nepasirinkta —</option></select></label></div><div class="pilkas maz" id="nuVietaN"></div></div>'
			. '<label>Pastaba užsakymui <span class="pilkas maz">(matys sandėlys ir klientas)</span><input name="pastaba"></label></section>';
		echo '<section class="dl-kortele"><h2>4. Apmokėjimas</h2><div class="dl-nu-mok"><label><input type="radio" name="mok" value="pavedimu" checked> Pavedimu — laukiam pinigų: klientui išankstinė sąskaita ir rekvizitai el. paštu (jei yra), užsakymas „Neapmokėti“, gavus — „Pažymėti apmokėtu“</label><label><input type="radio" name="mok" value="vietoje"> Apmokėta vietoje (grynais / kortele) — užsakymas iškart į darbą</label></div>'
			. '<div class="dl-nu-viso"><span>Prekės <b id="nuS1">0,00</b> €</span><span>Nuolaida <b id="nuS2">0,00</b> €</span><span>Pristatymas <b id="nuS3">0,00</b> €</span><span class="dl-nu-total">Iš viso <b id="nuS4">0,00</b> €</span></div>'
			. '<div class="dl-kr-v"><button type="button" class="v p" id="nuSubmit">Sukurti užsakymą</button> <a class="pilkas maz" href="' . esc_url( admin_url( 'admin.php?page=' . self::SLUG ) ) . '">atgal į užsakymus</a></div></section></form></main>';
	}

	/** JS naujam užsakymui — po pagrindinio `skriptas()` (naudoja `esc`, `dlgForm`, `ajaxurl`). */
	protected static function naujas_skriptas() {
		?>
<script id="dl-nu-js">
(function(){ var F=document.getElementById('dlNu'); if(!F) return; var RATE=parseFloat(F.getAttribute('data-rate')||'21')/100, PM=JSON.parse(F.getAttribute('data-pm')||'{}'), N=F.getAttribute('data-n'); var $=function(i){return document.getElementById(i);};
	var esc=window.dlEsc||function(s){ return String(s==null?'':s).replace(/[<>&"]/g,function(c){return {'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c];}); }; var dlgForm=window.dlgForm||function(d,f){ if(window.confirm(d.tekstas||'')) f.submit(); }; // v3.33.2: dl-js yra IIFE — esc/dlgForm iš window
	var eur=function(v){ return (Math.round(v*100)/100).toFixed(2).replace('.',','); }; var t=null;
	function deb(fn){ return function(){ clearTimeout(t); var a=arguments; t=setTimeout(function(){ fn.apply(null,a); },250); }; }
	/* klientai */
	$('nuKlQ').oninput=deb(function(){ var q=$('nuKlQ').value.trim(); var R=$('nuKlR'); if(q.length<2){ R.innerHTML=''; return; } fetch(ajaxurl+'?action=ps_dl_klientai&q='+encodeURIComponent(q)+'&n='+encodeURIComponent(N),{credentials:'same-origin'}).then(function(x){return x.json();}).then(function(j){ if(!j||!j.success){ R.innerHTML='<div class="pilkas maz">paieška nepavyko</div>'; return; } if(!j.data.length){ R.innerHTML='<div class="pilkas maz">nerasta — pildyk naują klientą žemiau</div>'; return; } R.innerHTML=j.data.map(function(k,i){ return '<a href="#" class="dl-nu-k" data-i="'+i+'"><b>'+esc(k.vardas+' '+k.pavarde)+'</b> · '+esc(k.tel||'—')+' · '+esc(k.el||'—')+(k.adresas?'<br><span class="pilkas maz">'+esc(k.adresas+', '+k.miestas+' '+k.kodas)+'</span>':'')+(k.pask?' <span class="pilkas maz">· pask. užsakymas '+esc(k.pask)+'</span>':'')+'</a>'; }).join(''); R._d=j.data; }); });
	$('nuKlR').onclick=function(e){ var a=e.target.closest('.dl-nu-k'); if(!a) return; e.preventDefault(); var k=$('nuKlR')._d[+a.getAttribute('data-i')]; ['vardas','pavarde','tel','el','imone','adresas','miestas','kodas'].forEach(function(f){ var i=F.querySelector('[name="kl['+f+']"]'); if(i) i.value=k[f]||''; }); $('nuUid').value=k.uid||0; $('nuKlR').innerHTML='<div class="pilkas maz">užpildyta iš ankstesnio pirkėjo — patikrink</div>'; $('nuKlQ').value=''; };
	/* prekės */
	var PR=[]; $('nuPrQ').oninput=deb(function(){ var q=$('nuPrQ').value.trim(); var R=$('nuPrR'); if(q.length<2){ R.innerHTML=''; return; } fetch(ajaxurl+'?action=ps_dl_prekes&q='+encodeURIComponent(q)+'&n='+encodeURIComponent(N),{credentials:'same-origin'}).then(function(x){return x.json();}).then(function(j){ if(!j||!j.success){ R.innerHTML='<div class="pilkas maz">paieška nepavyko</div>'; return; } if(!j.data.length){ R.innerHTML='<div class="pilkas maz">nerasta</div>'; return; } R.innerHTML=j.data.map(function(p,i){ return '<a href="#" class="dl-nu-k" data-i="'+i+'"><b>'+esc(p.n)+'</b> <span class="pilkas maz">'+esc(p.sku)+'</span> · '+eur(p.kaina)+' €'+(p.reg>p.kaina?' <s class="pilkas maz">'+eur(p.reg)+'</s>':'')+' · <span class="'+(p.av>0?'':'pilkas')+' maz">AV '+esc(String(p.av))+'</span> <span class="pilkas maz">· WC '+esc(String(p.stock))+'</span></a>'; }).join(''); R._d=j.data; }); });
	$('nuPrR').onclick=function(e){ var a=e.target.closest('.dl-nu-k'); if(!a) return; e.preventDefault(); var p=$('nuPrR')._d[+a.getAttribute('data-i')]; var ex=PR.filter(function(x){return x.id===p.id;})[0]; if(ex){ ex.q++; } else { PR.push({id:p.id,n:p.n,sku:p.sku,q:1,kaina:+p.kaina,reg:+p.reg,svoris:+p.svoris}); } $('nuPrR').innerHTML=''; $('nuPrQ').value=''; rodyk(); };
	function rodyk(){ var tb=$('nuPrT').querySelector('tbody'); tb.innerHTML=PR.map(function(p,i){ return '<tr><td>'+esc(p.n)+' <span class="pilkas maz">'+esc(p.sku)+'</span><input type="hidden" name="pr['+i+'][id]" value="'+p.id+'"></td><td class="c"><input type="number" name="pr['+i+'][q]" min="1" step="1" value="'+p.q+'" data-i="'+i+'" data-f="q"></td><td class="r"><input type="number" name="pr['+i+'][kaina]" min="0" step="0.01" value="'+p.kaina.toFixed(2)+'" data-i="'+i+'" data-f="kaina">'+(p.reg>p.kaina+0.004?' <span class="pilkas maz">akcija, buvo '+eur(p.reg)+'</span>':'')+'</td><td class="r"><b>'+eur(p.q*p.kaina)+'</b> €</td><td><a href="#" class="raud maz dl-nu-x" data-i="'+i+'">išimti</a></td></tr>'; }).join(''); $('nuPrN').textContent=PR.length?'':'Prekių dar nėra — ieškok viršuje.'; sumos(); }
	$('nuPrT').oninput=function(e){ var i=e.target.getAttribute('data-i'), f=e.target.getAttribute('data-f'); if(i===null||!f) return; var v=parseFloat(e.target.value); if(isNaN(v)) return; PR[+i][f]=f==='q'?Math.max(1,Math.round(v)):Math.max(0,v); var tr=e.target.closest('tr'); tr.children[3].innerHTML='<b>'+eur(PR[+i].q*PR[+i].kaina)+'</b> €'; sumos(); };
	$('nuPrT').onclick=function(e){ var x=e.target.closest('.dl-nu-x'); if(!x) return; e.preventDefault(); PR.splice(+x.getAttribute('data-i'),1); rodyk(); };
	/* pristatymas */
	var VIETOS={}; var pristRank=false;
	function prist(){ var k=$('nuPrist').value, m=PM[k]; var S=$('nuVieta'); if(!m){ return; } var tipas=m.tipas; S.style.display=(tipas==='pastomatas'||tipas==='lp')?'block':'none'; F.querySelector('.dl-nu-adr').style.display=tipas==='av'?'none':''; $('nuVietaS').required=(tipas==='pastomatas'||tipas==='lp');
		if(!pristRank){ var sub=0,sv=0; PR.forEach(function(p){ sub+=p.q*p.kaina; sv+=p.q*(p.svoris||0); }); sub-=parseFloat($('nuNuol').value||'0')||0; var inst=m.inst[0]; m.inst.forEach(function(x){ if(sv>x.nuo&&(!x.iki||sv<=x.iki)) inst=x; }); var g=inst?Math.round(inst.fee*(1+RATE)*100)/100:0; if(inst&&inst.nemok>0&&sub>=inst.nemok) g=0; $('nuPristK').value=g.toFixed(2); $('nuPristN').textContent=inst?('(pagal parduotuvę: '+eur(g)+' €'+(inst.nemok>0?', nemokamas nuo '+eur(inst.nemok)+' €':'')+(sv>0?', svoris '+sv.toFixed(1)+' kg':'')+')'):''; }
		if(tipas==='pastomatas'||tipas==='lp'){ var vez=tipas; if(VIETOS[vez]){ pild(VIETOS[vez],''); } else { $('nuVietaN').textContent='kraunama…'; fetch(ajaxurl+'?action=ps_dl_vietos&vez='+vez+'&n='+encodeURIComponent(N),{credentials:'same-origin'}).then(function(x){return x.json();}).then(function(j){ if(!j||!j.success){ $('nuVietaN').textContent='sąrašo įkelti nepavyko'; return; } VIETOS[vez]=j.data; pild(j.data,$('nuVietaQ').value); }).catch(function(){ $('nuVietaN').textContent='sąrašo įkelti nepavyko'; }); } }
		sumos(); }
	function pild(V,q){ q=(q||'').toLowerCase(); var n=0, opts='<option value="">— pasirink —</option>', cur=$('nuVietaS').value; V.forEach(function(v){ if(q&&(v[1]+' '+v[2]).toLowerCase().indexOf(q)<0) return; n++; if(n>300) return; opts+='<option value="'+esc(v[0])+'"'+(v[0]===cur?' selected':'')+'>'+esc(v[2])+'</option>'; }); $('nuVietaS').innerHTML=opts; $('nuVietaN').textContent=(n>300?'rodoma 300 iš ':'')+n+' iš '+V.length+' (LT) — ieškok pagal miestą'; }
	$('nuVietaQ').oninput=function(){ var m=PM[$('nuPrist').value]; if(m&&VIETOS[m.tipas]) pild(VIETOS[m.tipas],$('nuVietaQ').value); };
	$('nuPrist').onchange=function(){ pristRank=false; prist(); }; $('nuPristK').oninput=function(){ pristRank=true; sumos(); }; $('nuNuol').oninput=function(){ if(!pristRank) prist(); else sumos(); };
	function sumos(){ var s=0; PR.forEach(function(p){ s+=p.q*p.kaina; }); var nu=Math.min(s,parseFloat($('nuNuol').value||'0')||0), pr=parseFloat($('nuPristK').value||'0')||0; $('nuS1').textContent=eur(s); $('nuS2').textContent=nu>0?'−'+eur(nu):'0,00'; $('nuS3').textContent=eur(pr); $('nuS4').textContent=eur(s-nu+pr); $('nuNuolP').style.display=nu>0?'':'none'; }
	var origRodyk=rodyk; rodyk=function(){ origRodyk(); if(!pristRank) prist(); };
	$('nuSubmit').onclick=function(){ var kl=function(f){ return (F.querySelector('[name="kl['+f+']"]').value||'').trim(); }; var m=PM[$('nuPrist').value]||{tipas:''}; var err='';
		if(!PR.length) err='pridėk bent vieną prekę'; else if(!kl('vardas')) err='įrašyk kliento vardą'; else if(!kl('tel')) err='įrašyk telefoną'; else if(m.tipas==='kurjeris'&&(!kl('adresas')||!kl('miestas')||!kl('kodas'))) err='kurjeriui reikia adreso, miesto ir pašto kodo'; else if((m.tipas==='pastomatas'||m.tipas==='lp')&&!$('nuVietaS').value) err='pasirink paštomatą'; else if((m.tipas==='lp'||m.tipas==='lp_kurjeris')&&!kl('el')) err='LP Express siuntai reikia kliento el. pašto — įrašyk arba rink Venipak'; else if((parseFloat($('nuNuol').value||'0')||0)>0&&!$('nuNuolP').value.trim()) err='nuolaidai reikia pastabos';
		if(err){ alert(err); return; } var mok=F.querySelector('[name=mok]:checked').value, el=kl('el');
		dlgForm({antraste:'Naujas užsakymas · '+$('nuS4').textContent+' €',tekstas:(mok==='vietoje'?'Užsakymas sukuriamas kaip APMOKĖTAS (vietoje) ir iškart eina į darbą: Gauti → rūšiavimas → Surinkti → lipdukas. Likučiai nurašomi, PVM sąskaita — įvykdžius, kaip visada.':'Užsakymas sukuriamas kaip NEAPMOKĖTAS (pavedimu): '+(el?'klientui ('+el+') išeina laiškas su išankstine sąskaita ir rekvizitais; ':'el. pašto nėra — rekvizitus pasakyk telefonu; ')+'gavus pinigus — „Pažymėti apmokėtu“ skydelyje.')+(PR.some(function(p){return p.reg>p.kaina+0.004;})||(parseFloat($('nuNuol').value||'0')||0)>0?' Kainos / nuolaida — kaip įrašyta, pastaba lieka užsakyme.':''),ok:'Sukurti'},F); };
	prist();
})();
</script>
		<?php
	}

	/** AJAX `ps_dl_klientai`: ankstesni pirkėjai pagal telefoną / el. paštą / vardą — iš užsakymų adresų (HPOS `wc_order_addresses`, billing) + registruotų vartotojų. Grąžina iki 8 [{vardas,pavarde,tel,el,imone,adresas,miestas,kodas,uid,pask}]. */
	public static function ajax_klientai() {
		if ( ! current_user_can( 'edit_shop_orders' ) || ! check_ajax_referer( 'ps_dl_zurnalas', 'n', false ) ) { wp_send_json_error( 'teisės', 403 ); }
		global $wpdb; $q = trim( (string) wp_unslash( $_GET['q'] ?? '' ) ); if ( mb_strlen( $q ) < 2 ) { wp_send_json_success( array() ); }
		$like = '%' . $wpdb->esc_like( $q ) . '%'; $tel = '%' . $wpdb->esc_like( preg_replace( '/\D+/', '', $q ) ) . '%'; $out = array(); $seen = array();
		$rows = $wpdb->get_results( $wpdb->prepare( "SELECT a.first_name, a.last_name, a.company, a.address_1, a.city, a.postcode, a.email, a.phone, o.customer_id, o.date_created_gmt, o.id FROM {$wpdb->prefix}wc_order_addresses a JOIN {$wpdb->prefix}wc_orders o ON o.id = a.order_id AND o.type = 'shop_order' WHERE a.address_type = 'billing' AND ( a.email LIKE %s OR REPLACE(REPLACE(REPLACE(a.phone,' ',''),'-',''),'+','') LIKE %s OR CONCAT(a.first_name,' ',a.last_name) LIKE %s ) ORDER BY o.date_created_gmt DESC LIMIT 40", $like, strlen( trim( $tel, '%' ) ) >= 5 ? $tel : '#nera#', $like ) );
		foreach ( (array) $rows as $r ) { $k = mb_strtolower( (string) $r->email ) . '|' . preg_replace( '/\D+/', '', (string) $r->phone ); if ( isset( $seen[ $k ] ) ) { continue; } $seen[ $k ] = 1;
			$out[] = array( 'vardas' => $r->first_name, 'pavarde' => $r->last_name, 'imone' => $r->company, 'adresas' => $r->address_1, 'miestas' => $r->city, 'kodas' => $r->postcode, 'el' => $r->email, 'tel' => $r->phone, 'uid' => (int) $r->customer_id, 'pask' => substr( (string) $r->date_created_gmt, 0, 10 ) . ' #' . $r->id ); if ( count( $out ) >= 8 ) { break; } }
		if ( count( $out ) < 8 ) {
			$us = $wpdb->get_results( $wpdb->prepare( "SELECT u.ID, u.user_email FROM {$wpdb->users} u LEFT JOIN {$wpdb->usermeta} m ON m.user_id = u.ID AND m.meta_key = 'billing_phone' WHERE u.user_email LIKE %s OR u.display_name LIKE %s OR REPLACE(REPLACE(REPLACE(IFNULL(m.meta_value,''),' ',''),'-',''),'+','') LIKE %s LIMIT 8", $like, $like, strlen( trim( $tel, '%' ) ) >= 5 ? $tel : '#nera#' ) );
			foreach ( (array) $us as $u ) { $c = new WC_Customer( (int) $u->ID ); $k = mb_strtolower( (string) $u->user_email ) . '|' . preg_replace( '/\D+/', '', (string) $c->get_billing_phone() ); if ( isset( $seen[ $k ] ) ) { continue; } $seen[ $k ] = 1;
				$out[] = array( 'vardas' => $c->get_billing_first_name() ? $c->get_billing_first_name() : $c->get_first_name(), 'pavarde' => $c->get_billing_last_name() ? $c->get_billing_last_name() : $c->get_last_name(), 'imone' => $c->get_billing_company(), 'adresas' => $c->get_billing_address_1(), 'miestas' => $c->get_billing_city(), 'kodas' => $c->get_billing_postcode(), 'el' => $u->user_email, 'tel' => $c->get_billing_phone(), 'uid' => (int) $u->ID, 'pask' => '' ); if ( count( $out ) >= 8 ) { break; } }
		}
		wp_send_json_success( $out );
	}

	/** AJAX `ps_dl_prekes`: prekių paieška pavadinimu / SKU (publikuotos prekės ir variacijos, `wc_product_meta_lookup`). Grąžina iki 12 [{id,n,sku,kaina (su PVM, su akcija),reg,stock,av,svoris}]. */
	public static function ajax_prekes() {
		if ( ! current_user_can( 'edit_shop_orders' ) || ! check_ajax_referer( 'ps_dl_zurnalas', 'n', false ) ) { wp_send_json_error( 'teisės', 403 ); }
		global $wpdb; $q = trim( (string) wp_unslash( $_GET['q'] ?? '' ) ); if ( mb_strlen( $q ) < 2 ) { wp_send_json_success( array() ); }
		$like = '%' . $wpdb->esc_like( $q ) . '%'; $out = array();
		$ids = $wpdb->get_col( $wpdb->prepare( "SELECT p.ID FROM {$wpdb->posts} p JOIN {$wpdb->prefix}wc_product_meta_lookup l ON l.product_id = p.ID WHERE p.post_status = 'publish' AND p.post_type IN ('product','product_variation') AND ( p.post_title LIKE %s OR l.sku LIKE %s ) ORDER BY l.stock_status = 'instock' DESC, p.post_title ASC LIMIT 12", $like, $like ) );
		foreach ( (array) $ids as $id ) { $p = wc_get_product( (int) $id ); if ( ! $p || $p->is_type( 'variable' ) || '' === $p->get_price() ) { continue; }
			$out[] = array( 'id' => (int) $id, 'n' => $p->get_name(), 'sku' => (string) $p->get_sku(), 'kaina' => round( (float) wc_get_price_including_tax( $p ), 2 ), 'reg' => round( (float) wc_get_price_including_tax( $p, array( 'price' => $p->get_regular_price() ) ), 2 ), 'stock' => (int) $p->get_stock_quantity(), 'av' => class_exists( 'Petshop_AV_Stock' ) ? (int) Petshop_AV_Stock::qty( (int) $id ) : (int) $p->get_stock_quantity(), 'svoris' => (float) $p->get_weight() ); }
		wp_send_json_success( $out );
	}

	/** POST `ps_dl_naujas` — telefoninis užsakymas (Raimis 09-05 B): svečio (arba rasto vartotojo) užsakymas `created_via=darbalaukis`, prekės parduotuvės kainomis (darbuotojo įrašytomis, su PVM),
	 *  nuolaida (€, proporcingai eilutėms — WC „nuolaida“, pastaba privaloma), pristatymas iš WC zonos instancijų (kaina darbuotojo), Venipak paštomatas per plugino `venipak_store_order_pickup`,
	 *  LP terminalas plugino meta. Apmokėjimas: `pavedimu` → bacs + on-hold (WC / temos srautas kaip kasoje: laiškas su išankstine); `vietoje` → „Apmokėta vietoje“ + processing (varikliai kaip po Paysera). */
	public static function naujas_vykdyti() {
		if ( ! current_user_can( 'edit_shop_orders' ) ) { wp_die( 'Nepakanka teisių' ); }
		check_admin_referer( 'ps_dl_naujas' ); $u = wp_get_current_user(); $atgal = admin_url( 'admin.php?page=' . self::SLUG . '&view=naujas' );
		$klaida = function ( $t ) use ( $atgal ) { wp_safe_redirect( add_query_arg( array( 'pd_ok' => 'dl_klaida', 'pd_nr' => rawurlencode( '—|' . $t ) ), $atgal ) ); exit; };
		$kl = array_map( function ( $v ) { return sanitize_text_field( wp_unslash( (string) $v ) ); }, (array) ( $_POST['kl'] ?? array() ) );
		$mok = sanitize_key( $_POST['mok'] ?? 'pavedimu' ); if ( ! in_array( $mok, array( 'pavedimu', 'vietoje' ), true ) ) { $klaida( 'nežinomas apmokėjimo būdas' ); }
		list( $pm, $rate ) = self::naujas_pristatymas(); $pk = sanitize_key( $_POST['prist'] ?? '' ); if ( ! isset( $pm[ $pk ] ) ) { $klaida( 'pasirink pristatymo būdą' ); } $tipas = $pm[ $pk ]['tipas'];
		if ( '' === ( $kl['vardas'] ?? '' ) || '' === ( $kl['tel'] ?? '' ) ) { $klaida( 'reikia kliento vardo ir telefono' ); }
		if ( '' !== ( $kl['el'] ?? '' ) && ! is_email( $kl['el'] ) ) { $klaida( 'blogas el. paštas' ); }
		if ( 'kurjeris' === $tipas && ( '' === ( $kl['adresas'] ?? '' ) || '' === ( $kl['miestas'] ?? '' ) || '' === ( $kl['kodas'] ?? '' ) ) ) { $klaida( 'kurjeriui reikia adreso, miesto ir pašto kodo' ); }
		if ( in_array( $tipas, array( 'lp', 'lp_kurjeris' ), true ) && ! is_email( $kl['el'] ?? '' ) ) { $klaida( 'LP Express siuntai reikia kliento el. pašto (LP sistema be jo siuntos nesukuria) — įrašyk arba rink Venipak' ); } // v3.33.1 (T3: LP API klaida receiver.contacts.email)
		$vieta = sanitize_text_field( wp_unslash( $_POST['vieta'] ?? '' ) ); if ( in_array( $tipas, array( 'pastomatas', 'lp' ), true ) && '' === $vieta ) { $klaida( 'pasirink paštomatą' ); }
		$nuol = round( max( 0, (float) ( $_POST['nuolaida'] ?? 0 ) ), 2 ); $nuol_p = sanitize_text_field( wp_unslash( $_POST['nuolaida_pastaba'] ?? '' ) ); if ( $nuol > 0 && '' === $nuol_p ) { $klaida( 'nuolaidai reikia pastabos' ); }
		$prekes = array(); $viso_g = 0.0; $svoris = 0.0;
		foreach ( (array) ( $_POST['pr'] ?? array() ) as $r ) { $pid = absint( $r['id'] ?? 0 ); $q = absint( $r['q'] ?? 0 ); $kaina = round( max( 0, (float) ( $r['kaina'] ?? 0 ) ), 2 ); if ( ! $pid || $q < 1 ) { continue; } $p = wc_get_product( $pid ); if ( ! $p || $p->is_type( 'variable' ) ) { $klaida( 'prekės #' . $pid . ' nėra' ); } $prekes[] = array( 'p' => $p, 'q' => $q, 'kaina' => $kaina, 'g' => $kaina * $q ); $viso_g += $kaina * $q; $svoris += (float) $p->get_weight() * $q; }
		if ( ! $prekes ) { $klaida( 'pridėk bent vieną prekę' ); } if ( $nuol > $viso_g ) { $klaida( 'nuolaida didesnė už prekių sumą' ); }
		$prist_g = round( max( 0, (float) ( $_POST['prist_kaina'] ?? 0 ) ), 2 ); $pastaba = sanitize_textarea_field( wp_unslash( $_POST['pastaba'] ?? '' ) );
		$inst = $pm[ $pk ]['inst'][0]; foreach ( $pm[ $pk ]['inst'] as $x ) { if ( $svoris > $x['nuo'] && ( ! $x['iki'] || $svoris <= $x['iki'] ) ) { $inst = $x; } }
		$uid = absint( $kl['uid'] ?? 0 ); if ( $uid && ! get_user_by( 'id', $uid ) ) { $uid = 0; }
		// LP terminalas — patikra sąraše
		$lp_t = null; if ( 'lp' === $tipas ) { global $wpdb; $lp_t = $wpdb->get_row( $wpdb->prepare( "SELECT terminal_id, name, address, city FROM {$wpdb->prefix}woo_lithuaniapost_unisend_terminals WHERE terminal_id = %s AND country_code = 'LT' LIMIT 1", $vieta ), ARRAY_A ); if ( ! $lp_t ) { $klaida( 'tokio LP paštomato sąraše nėra (' . $vieta . ')' ); } }
		$vp_t = null; if ( 'pastomatas' === $tipas ) { if ( ! function_exists( 'venipak_find_pickup_by_id' ) ) { $klaida( 'Venipak plugino nėra' ); } $vp_t = venipak_find_pickup_by_id( $vieta ); if ( ! $vp_t ) { $klaida( 'tokio Venipak paštomato sąraše nėra (' . $vieta . ')' ); } }
		$laiskas = 0;
		try {
			$n = wc_create_order( array( 'customer_id' => $uid, 'created_via' => 'darbalaukis', 'status' => 'pending' ) ); if ( is_wp_error( $n ) || ! $n ) { $klaida( 'užsakymo sukurti nepavyko' . ( is_wp_error( $n ) ? ': ' . $n->get_error_message() : '' ) ); }
			$adr = array( 'first_name' => $kl['vardas'], 'last_name' => $kl['pavarde'] ?? '', 'company' => $kl['imone'] ?? '', 'address_1' => $kl['adresas'] ?? '', 'address_2' => '', 'city' => $kl['miestas'] ?? '', 'state' => '', 'postcode' => $kl['kodas'] ?? '', 'country' => 'LT', 'email' => $kl['el'] ?? '', 'phone' => $kl['tel'] );
			$n->set_address( $adr, 'billing' ); unset( $adr['email'] ); $n->set_address( $adr, 'shipping' ); $n->set_currency( get_woocommerce_currency() ); $n->set_prices_include_tax( true ); $n->set_customer_note( $pastaba );
			$eil_t = array(); $lik = $nuol;
			foreach ( $prekes as $i => $x ) {
				$p = $x['p']; $q = $x['q']; $dalis = ( $viso_g > 0 && $nuol > 0 ) ? ( $i === count( $prekes ) - 1 ? $lik : round( $nuol * $x['g'] / $viso_g, 2 ) ) : 0.0; $lik = round( $lik - $dalis, 2 );
				$it = new WC_Order_Item_Product(); $it->set_product( $p ); $it->set_quantity( $q );
				$sub = (float) wc_get_price_excluding_tax( $p, array( 'qty' => 1, 'price' => $x['g'] ) ); $tot = (float) wc_get_price_excluding_tax( $p, array( 'qty' => 1, 'price' => max( 0, $x['g'] - $dalis ) ) );
				$it->set_subtotal( $sub ); $it->set_total( $tot ); $reg_g = round( (float) wc_get_price_including_tax( $p ), 2 ); if ( abs( $reg_g - $x['kaina'] ) > 0.004 ) { $it->add_meta_data( '_ps_kaina_pakeista', $reg_g . ' → ' . $x['kaina'], true ); }
				$n->add_item( $it ); $eil_t[] = $q . '× ' . mb_substr( $p->get_name(), 0, 40 );
			}
			$sh = new WC_Order_Item_Shipping(); $sh->set_method_title( 'av' === $tipas ? 'Atsiėmimas AV' : $inst['title'] ); $sh->set_method_id( $inst['id'] ); $sh->set_instance_id( (int) $inst['inst'] ); $sh->set_total( $rate > 0 ? round( $prist_g / ( 1 + $rate / 100 ), 6 ) : $prist_g ); $n->add_item( $sh );
			if ( $vp_t ) { if ( function_exists( 'venipak_store_order_pickup' ) ) { venipak_store_order_pickup( $n, (int) $vieta ); } else { $n->update_meta_data( 'venipak_pickup_point', (string) (int) $vieta ); } }
			if ( $lp_t ) { $n->update_meta_data( '_woo_lithuaniapost_lpexpress_terminal_id', $lp_t['terminal_id'] ); $n->update_meta_data( '_woo_lithuaniapost_lpexpress_terminal', sprintf( '%s - %s, %s', $lp_t['name'], $lp_t['address'], $lp_t['city'] ) ); $n->update_meta_data( '_woo_lithuaniapost_lpexpress_shipping_method_instance_id', (string) $inst['inst'] ); }
			$n->update_meta_data( '_ps_telefonu', current_time( 'mysql' ) . '|' . $u->display_name ); if ( $nuol > 0 ) { $n->update_meta_data( '_ps_nuolaida', (string) $nuol ); $n->update_meta_data( '_ps_nuolaida_pastaba', $nuol_p ); }
			$n->calculate_totals( true ); $n->save(); $id = $n->get_id(); $n = wc_get_order( $id );
			$n->add_order_note( sprintf( 'Darbalaukis: užsakymas priimtas telefonu / vietoje (%s). Prekės: %s. Pristatymas: %s%s — %s €. %sApmokėjimas: %s.', $u->display_name, implode( ', ', $eil_t ), $pm[ $pk ]['t'], $vp_t ? ' „' . ( $vp_t['name'] ?? '' ) . ', ' . ( $vp_t['city'] ?? '' ) . '“' : ( $lp_t ? ' „' . $lp_t['name'] . ', ' . $lp_t['city'] . '“' : '' ), self::eur( $prist_g ), $nuol > 0 ? 'Nuolaida ' . self::eur( $nuol ) . ' € — ' . $nuol_p . '. ' : '', 'vietoje' === $mok ? 'apmokėta vietoje' : 'pavedimu — laukiam' ), false, true );
			if ( 'vietoje' === $mok ) { $n->set_payment_method( 'cod' ); $n->set_payment_method_title( 'Apmokėta vietoje' ); $n->set_date_paid( time() ); $n->save(); $n->update_status( 'processing', 'Darbalaukis: apmokėta vietoje (' . $u->display_name . ').', true ); }
			else { $n->set_payment_method( 'bacs' ); $n->set_payment_method_title( 'Bankinis pavedimas' ); $n->save(); $n->update_status( 'on-hold', 'Darbalaukis: telefoninis užsakymas, laukiam pavedimo (' . $u->display_name . ').' );
				if ( is_email( $kl['el'] ?? '' ) ) { do_action( 'petshop_send_order_received_email', $id ); $laiskas = 1; } } // v3.33.1: temos laiškas „Užsakymas gautas“ su išankstine (IAPV) ir rekvizitais — kasoje jį planuoja tema po checkout, čia kviečiam patys
			$n = wc_get_order( $id );
			if ( class_exists( 'Petshop_Uzsakymu_Ivykiai' ) ) { Petshop_Uzsakymu_Ivykiai::irasyti( array( 'uzsakymas' => $id, 'sritis' => 'desk', 'veiksmas' => 'naujas', 'rezultatas' => 'ok', 'kanalas' => 'web', 'kas' => $u->ID, 'kas_vardas' => $u->display_name, 'po' => array( 'mok' => $mok, 'prist' => $pk, 'vieta' => $vieta, 'nuolaida' => $nuol, 'suma' => (float) $n->get_total(), 'klientas' => $uid, 'prekes' => $eil_t ), 'pastaba' => 'telefoninis užsakymas ' . self::eur( $n->get_total() ) . ' € (' . ( 'vietoje' === $mok ? 'apmokėta vietoje' : 'pavedimu' ) . ')' ) ); }
			do_action( 'ps_juosta_isvalyti' );
			$t = 'užsakymas sukurtas — ' . self::eur( $n->get_total() ) . ' €, ' . $pm[ $pk ]['t'] . ( 'vietoje' === $mok ? ', apmokėta vietoje — eina į darbą' : ', laukiam pavedimo (' . self::PAKART_BANKAS . ', paskirtis „Užsakymas #' . $n->get_order_number() . '“' . ( $laiskas ? '; klientui išėjo laiškas su išankstine' : '; el. pašto nėra — rekvizitus pasakyk klientui' ) . ')' );
			wp_safe_redirect( add_query_arg( array( 'pd_ok' => 'dl_info', 'pd_nr' => rawurlencode( $n->get_order_number() . '|' . $t ) ), admin_url( 'admin.php?page=' . self::SLUG . '&eile=' . ( 'vietoje' === $mok ? 'siandien' : 'neapmoketi' ) . '&atidaryti=' . $id ) ) ); exit;
		} catch ( Throwable $ex ) { $klaida( 'klaida: ' . $ex->getMessage() ); }
	}
