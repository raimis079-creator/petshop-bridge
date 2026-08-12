process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import fs from 'fs';
import { execSync } from 'child_process';
const B='https://dev.avesa.lt';
const U=process.env.WP_USER,P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='Basic '+Buffer.from(U+':'+P).toString('base64');
const TOK=process.env.GH_TOKEN||'', REPO=process.env.GH_REPO||'';
fs.mkdirSync('screenshots',{recursive:true});
const out={marker:'ATSTATYMAS DRY', ts:new Date().toISOString()};
async function wp(p,o={}){try{const r=await fetch(B+p,{...o,headers:{'Authorization':AUTH,'Content-Type':'application/json',...(o.headers||{})}});return{status:r.status,text:await r.text()}}catch(e){return{status:0,text:String(e)}}}
function js(t){const i=Math.min(...['[','{'].map(c=>{const x=t.indexOf(c);return x<0?1e9:x}));try{return JSON.parse(t.slice(i))}catch(e){return null}}
const php = `
add_action('init', function(){
  if ( ( $_GET['ps_rec'] ?? '' ) !== 'At5tR7' ) return;
  @set_time_limit(240);
  global $wpdb; $p=$wpdb->prefix;
  $o=array('marker'=>'ATSTATYMAS');

  $z=$p.'ps_ivykiai';
  $o['stulpeliai']=$wpdb->get_col("SHOW COLUMNS FROM {$z}");
  $o['pavyzdys']=$wpdb->get_results("SELECT * FROM {$z} ORDER BY id DESC LIMIT 3", ARRAY_A);

  /* katalogo zurnalas — kur rasomi rankiniai isemimai */
  $k=$p.'ps_katalogo_zurnalas';
  $o['kat_zurnalas']=($wpdb->get_var("SHOW TABLES LIKE '{$k}'")===$k);
  if($o['kat_zurnalas']){
    $o['kat_stulpeliai']=$wpdb->get_col("SHOW COLUMNS FROM {$k}");
    $o['kat_pavyzdys']=$wpdb->get_results("SELECT * FROM {$k} WHERE laukas='post_status' ORDER BY id DESC LIMIT 5", ARRAY_A);
  }
  header('Content-Type: application/json; charset=utf-8'); echo wp_json_encode($o, JSON_UNESCAPED_UNICODE); exit;
}, 1);
`;
const s1=await wp('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP Atstatymas Recon v1',code:php,scope:'global',active:true,priority:5})});
const j1=js(s1.text); out.snip=j1&&j1.id?j1.id:s1.text.slice(0,150);
await new Promise(r=>setTimeout(r,4000));
try{
  const res=execSync(`curl -sk "${B}/?ps_rec=At5tR7" --max-time 120`,{encoding:'utf8',maxBuffer:20*1024*1024});
  out.recon=js(res)||res.slice(0,900);
}catch(e){ out.err=String(e).slice(0,300); }
if(j1&&j1.id) await wp('/wp-json/code-snippets/v1/snippets/'+j1.id,{method:'DELETE'});
const body={message:'res atst',content:Buffer.from(JSON.stringify(out,null,1)).toString('base64')};
const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/atst.json`,{headers:{'Authorization':'Bearer '+TOK}});
if(g.status===200){ body.sha=(await g.json()).sha; }
await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/atst.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json'},body:JSON.stringify(body)});
console.log('ok');
