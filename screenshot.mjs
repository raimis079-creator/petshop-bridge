process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import fs from 'fs';
import { execSync } from 'child_process';
const B='https://dev.avesa.lt';
const U=process.env.WP_USER,P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='Basic '+Buffer.from(U+':'+P).toString('base64');
const TOK=process.env.GH_TOKEN||'', REPO=process.env.GH_REPO||'';
fs.mkdirSync('screenshots',{recursive:true});
const out={marker:'VARTAI RECON', ts:new Date().toISOString()};
async function wp(p,o={}){try{const r=await fetch(B+p,{...o,headers:{'Authorization':AUTH,'Content-Type':'application/json',...(o.headers||{})}});return{status:r.status,text:await r.text()}}catch(e){return{status:0,text:String(e)}}}
function js(t){const i=Math.min(...['[','{'].map(c=>{const x=t.indexOf(c);return x<0?1e9:x}));try{return JSON.parse(t.slice(i))}catch(e){return null}}
const php = `
add_action('init', function(){
  if ( ( $_GET['ps_rec'] ?? '' ) !== 'Va9tR5' ) return;
  @set_time_limit(180);
  global $wpdb; $p=$wpdb->prefix;
  $o=array('marker'=>'VARTAI');

  /* 1. vartu failas */
  $f=WPMU_PLUGIN_DIR.'/petshop-vartai.php';
  $o['vartai_b64']= file_exists($f) ? base64_encode(file_get_contents($f)) : 'NERA';

  /* 2. cron uzduotys */
  $cr=_get_cron_array(); $sar=array();
  foreach((array)$cr as $laikas=>$kabliai){
    foreach($kabliai as $hook=>$x){
      if ( stripos($hook,'petshop')!==false || stripos($hook,'ps_')!==false || stripos($hook,'vf')!==false || stripos($hook,'zb')!==false || stripos($hook,'vartai')!==false || stripos($hook,'pmxi')!==false || stripos($hook,'import')!==false ) {
        $sar[]=array('hook'=>$hook,'kada'=>date('Y-m-d H:i',$laikas),'kada_lt'=>get_date_from_gmt(date('Y-m-d H:i:s',$laikas),'Y-m-d H:i'));
      }
    }
  }
  $o['cron']=$sar;

  /* 3. prekes 25319 duomenys */
  $pid=25319;
  $o['preke']=array('sku'=>get_post_meta($pid,'_sku',true),'busena'=>get_post_status($pid),
    'vf'=>get_post_meta($pid,'_vf_enabled',true),'zb'=>get_post_meta($pid,'_zb_enabled',true),
    'sandelis'=>get_post_meta($pid,'_ps_sandelis',true),
    'vf_qty'=>get_post_meta($pid,'_vf_qty',true),'zb_qty'=>get_post_meta($pid,'_zb_qty',true),
    'vartai'=>get_post_meta($pid,'_ps_vartai',true),
    'i_juodrasti'=>get_post_meta($pid,'_ps_i_juodrasti',true),
    'publikuota'=>get_post_meta($pid,'_ps_publikuota',true));
  $visi=$wpdb->get_results($wpdb->prepare("SELECT meta_key,LEFT(meta_value,60) v FROM {$p}postmeta WHERE post_id=%d AND meta_key LIKE '_ps%%'",$pid),ARRAY_A);
  $o['ps_meta']=$visi;

  /* 4. kiek prekiu 07:01 pakeista i publish (is zurnalo) */
  $z=$p.'ps_katalogo_zurnalas';
  $lentele=$wpdb->get_var("SHOW TABLES LIKE '{$z}'");
  if(!$lentele){ $z=$p.'ps_ivykiai'; $lentele=$wpdb->get_var("SHOW TABLES LIKE '{$z}'"); }
  $o['zurnalas']=$lentele;
  if($lentele){
    $o['stulpeliai']=$wpdb->get_col("SHOW COLUMNS FROM {$z}");
    $o['siandien']=$wpdb->get_results("SELECT * FROM {$z} WHERE sukurta >= '2026-08-12 06:00:00' AND sukurta <= '2026-08-12 08:00:00' LIMIT 10", ARRAY_A);
    $o['kiek_07']= (int) $wpdb->get_var("SELECT COUNT(*) FROM {$z} WHERE sukurta >= '2026-08-12 06:30:00' AND sukurta <= '2026-08-12 07:30:00'");
  }
  header('Content-Type: application/json; charset=utf-8'); echo wp_json_encode($o, JSON_UNESCAPED_UNICODE); exit;
}, 1);
`;
const s1=await wp('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP Vartai Recon v1',code:php,scope:'global',active:true,priority:5})});
const j1=js(s1.text); out.snip=j1&&j1.id?j1.id:s1.text.slice(0,150);
await new Promise(r=>setTimeout(r,4000));
try{
  const res=execSync(`curl -sk "${B}/?ps_rec=Va9tR5" --max-time 120`,{encoding:'utf8',maxBuffer:40*1024*1024});
  const j=js(res);
  if(j&&j.vartai_b64&&j.vartai_b64!=='NERA'){ fs.writeFileSync('screenshots/vartai.b64', j.vartai_b64);
    const body={message:'vartai',content:Buffer.from(j.vartai_b64).toString('base64')};
    const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/vartai.b64`,{headers:{'Authorization':'Bearer '+TOK}});
    if(g.status===200){ body.sha=(await g.json()).sha; }
    await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/vartai.b64`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json'},body:JSON.stringify(body)});
    delete j.vartai_b64; j.vartai='irasyta i vartai.b64';
  }
  out.recon=j||res.slice(0,1000);
}catch(e){ out.err=String(e).slice(0,300); }
if(j1&&j1.id) await wp('/wp-json/code-snippets/v1/snippets/'+j1.id,{method:'DELETE'});
const body={message:'res vartai',content:Buffer.from(JSON.stringify(out,null,1)).toString('base64')};
const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/vartai.json`,{headers:{'Authorization':'Bearer '+TOK}});
if(g.status===200){ body.sha=(await g.json()).sha; }
await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/vartai.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json'},body:JSON.stringify(body)});
console.log('ok');
