process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import fs from 'fs';
import { execSync } from 'child_process';
const B='https://dev.avesa.lt';
const U=process.env.WP_USER,P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='Basic '+Buffer.from(U+':'+P).toString('base64');
const TOK=process.env.GH_TOKEN||'', REPO=process.env.GH_REPO||'';
fs.mkdirSync('screenshots',{recursive:true});
const out={marker:'NUOTRAUKA RECON 2', ts:new Date().toISOString()};
async function wp(p,o={}){try{const r=await fetch(B+p,{...o,headers:{'Authorization':AUTH,'Content-Type':'application/json',...(o.headers||{})}});return{status:r.status,text:await r.text()}}catch(e){return{status:0,text:String(e)}}}
function js(t){const i=Math.min(...['[','{'].map(c=>{const x=t.indexOf(c);return x<0?1e9:x}));try{return JSON.parse(t.slice(i))}catch(e){return null}}
const php = `
add_action('init', function(){
  if ( ( $_GET['ps_rec'] ?? '' ) !== 'Nu7tR4' ) return;
  @set_time_limit(180);
  global $wpdb; $p=$wpdb->prefix;
  $o=array('marker'=>'RECON 2');

  /* attachment 34901 */
  $a=get_post(34901);
  $o['att']= $a ? array('id'=>$a->ID,'tipas'=>$a->post_type,'tevas'=>(int)$a->post_parent,
     'data'=>$a->post_date,'failas'=>get_post_meta(34901,'_wp_attached_file',true),
     'diske'=>file_exists(get_attached_file(34901)),
     'url'=>wp_get_attachment_url(34901)) : 'NERA';

  /* kokios prekes rodo i 34901 */
  $o['naudoja_34901']=$wpdb->get_col("SELECT post_id FROM {$p}postmeta WHERE meta_key='_thumbnail_id' AND meta_value='34901'");

  /* ivykiu zurnalas abiem prekem */
  $lent=$p.'ps_ivykiai';
  $o['zurnalo_lentele']=($wpdb->get_var("SHOW TABLES LIKE '{$lent}'")===$lent);
  if($o['zurnalo_lentele']){
    $o['stulpeliai']=$wpdb->get_col("SHOW COLUMNS FROM {$lent}");
    $o['ivykiai_19089']=$wpdb->get_results("SELECT * FROM {$lent} WHERE preke_id=19089 ORDER BY id DESC LIMIT 12", ARRAY_A);
    $o['ivykiai_34907']=$wpdb->get_results("SELECT * FROM {$lent} WHERE preke_id=34907 ORDER BY id DESC LIMIT 8", ARRAY_A);
  }

  /* ar originalo puslapis rodo nuotrauka */
  $o['orig']=array('id'=>19089,'thumb'=>(int)get_post_meta(19089,'_thumbnail_id',true),
     'galerija'=>get_post_meta(19089,'_product_image_gallery',true),
     'nuoroda'=>get_permalink(19089),'busena'=>get_post_status(19089));

  /* visi 2026/08 ikelti attachment'ai */
  $o['rugpjucio_att']=$wpdb->get_results("SELECT ID, post_title, post_date, post_parent FROM {$p}posts WHERE post_type='attachment' AND ID BETWEEN 34890 AND 34920 ORDER BY ID", ARRAY_A);

  header('Content-Type: application/json; charset=utf-8'); echo wp_json_encode($o, JSON_UNESCAPED_UNICODE); exit;
}, 1);
`;
const s1=await wp('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP Nuotrauka Recon v2',code:php,scope:'global',active:true,priority:5})});
const j1=js(s1.text); out.snip=j1&&j1.id?j1.id:s1.text.slice(0,150);
await new Promise(r=>setTimeout(r,4000));
try{
  const res=execSync(`curl -sk "${B}/?ps_rec=Nu7tR4" --max-time 120`,{encoding:'utf8',maxBuffer:20*1024*1024});
  out.recon=js(res)||res.slice(0,1500);
}catch(e){ out.err=String(e).slice(0,300); }
/* originalo puslapis — ar <img> yra */
try{
  const h=execSync(`curl -sk "${B}/?p=19089" --max-time 60`,{encoding:'utf8',maxBuffer:20*1024*1024});
  out.puslapis={ ilgis:h.length,
    turi_34901: h.indexOf('triusio-ausys-baltos')>=0,
    woocommerce_placeholder: h.indexOf('woocommerce-placeholder')>=0 };
}catch(e){ out.pusl_err=String(e).slice(0,200); }
if(j1&&j1.id) await wp('/wp-json/code-snippets/v1/snippets/'+j1.id,{method:'DELETE'});
const body={message:'res n2',content:Buffer.from(JSON.stringify(out,null,1)).toString('base64')};
const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/nuotrauka2.json`,{headers:{'Authorization':'Bearer '+TOK}});
if(g.status===200){ body.sha=(await g.json()).sha; }
await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/nuotrauka2.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json'},body:JSON.stringify(body)});
console.log('ok');
