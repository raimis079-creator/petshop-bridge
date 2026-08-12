process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import fs from 'fs';
import { execSync } from 'child_process';
const B='https://dev.avesa.lt';
const U=process.env.WP_USER,P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='Basic '+Buffer.from(U+':'+P).toString('base64');
const TOK=process.env.GH_TOKEN||'', REPO=process.env.GH_REPO||'';
fs.mkdirSync('screenshots',{recursive:true});
const out={marker:'VALYMAS', ts:new Date().toISOString()};
async function wp(p,o={}){try{const r=await fetch(B+p,{...o,headers:{'Authorization':AUTH,'Content-Type':'application/json',...(o.headers||{})}});return{status:r.status,text:await r.text()}}catch(e){return{status:0,text:String(e)}}}
function js(t){const i=Math.min(...['[','{'].map(c=>{const x=t.indexOf(c);return x<0?1e9:x}));try{return JSON.parse(t.slice(i))}catch(e){return null}}
const php = `
add_action('init', function(){
  if ( ( $_GET['ps_v'] ?? '' ) !== 'Vl3tC1' ) return;
  global $wpdb; $p=$wpdb->prefix; $t=$p.'ps_partijos';
  $o=array('marker'=>'VALYMAS');
  $eil=$wpdb->get_row("SELECT * FROM {$t} WHERE tiekejas='TESTAS' ORDER BY id DESC LIMIT 1", ARRAY_A);
  if(!$eil){ $o['rasta']=false; }
  else {
    $pid=(int)$eil['product_id'];
    $o['rasta']=array('id'=>$eil['id'],'pid'=>$pid,'kiekis'=>$eil['kiekis_gautas']);
    $wpdb->delete($t, array('id'=>(int)$eil['id']), array('%d'));
    $pr=wc_get_product($pid);
    if($pr){ $pr->set_manage_stock(true); $pr->set_stock_quantity(8); $pr->set_stock_status('instock'); $pr->save(); }
    if(class_exists('Petshop_Partijos') && method_exists('Petshop_Partijos','perskaiciuoti_savikaina')){
      try { Petshop_Partijos::perskaiciuoti_savikaina($pid); } catch (\\Throwable $e) {}
    }
    clean_post_cache($pid);
    $o['po_valymo']=array('_stock'=>get_post_meta($pid,'_stock',true),
      'partiju'=>(int)$wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM {$t} WHERE product_id=%d",$pid)));
  }
  delete_transient('ps_kat_duomenys');
  header('Content-Type: application/json; charset=utf-8'); echo wp_json_encode($o,JSON_UNESCAPED_UNICODE); exit;
}, 1);
`;
const s1=await wp('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP Valymas v73',code:php,scope:'global',active:true,priority:5})});
const j1=js(s1.text);
await new Promise(r=>setTimeout(r,4000));
try{
  const res=execSync(`curl -sk "${B}/?ps_v=Vl3tC1" --max-time 120`,{encoding:'utf8',maxBuffer:20*1024*1024});
  out.rez=js(res)||res.slice(0,400);
}catch(e){ out.err=String(e).slice(0,250); }
if(j1&&j1.id) await wp('/wp-json/code-snippets/v1/snippets/'+j1.id,{method:'DELETE'});
const body={message:'res val',content:Buffer.from(JSON.stringify(out,null,1)).toString('base64')};
const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/val73.json`,{headers:{'Authorization':'Bearer '+TOK}});
if(g.status===200){ body.sha=(await g.json()).sha; }
await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/val73.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json'},body:JSON.stringify(body)});
console.log('ok');
