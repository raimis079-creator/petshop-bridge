process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import fs from 'fs';
import { execSync } from 'child_process';
const B='https://dev.avesa.lt';
const U=process.env.WP_USER,P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='Basic '+Buffer.from(U+':'+P).toString('base64');
const TOK=process.env.GH_TOKEN||'', REPO=process.env.GH_REPO||'';
fs.mkdirSync('screenshots',{recursive:true});
const out={marker:'LIKUCIU TESTAS', ts:new Date().toISOString()};
async function wp(p,o={}){try{const r=await fetch(B+p,{...o,headers:{'Authorization':AUTH,'Content-Type':'application/json',...(o.headers||{})}});return{status:r.status,text:await r.text()}}catch(e){return{status:0,text:String(e)}}}
function js(t){const i=Math.min(...['[','{'].map(c=>{const x=t.indexOf(c);return x<0?1e9:x}));try{return JSON.parse(t.slice(i))}catch(e){return null}}
const php = `
add_action('init', function(){
  if ( ( $_GET['ps_t'] ?? '' ) !== 'Lk9tT2' ) return;
  @set_time_limit(180);
  $o=array('marker'=>'LIKUCIAI','v'=>Petshop_Katalogas::VERSIJA);
  $adm=get_users(array('role'=>'administrator','number'=>1));
  wp_set_current_user($adm?$adm[0]->ID:0);

  foreach ( array(19715=>'ambrosia', 16760=>'prins', 15835=>'belcor_tofu', 19902=>'av', 25319=>'vf') as $pid=>$laukiam ) {
    $pr = wc_get_product($pid);
    $e = array(
      'sandelis'=>get_post_meta($pid,'_ps_sandelis',true),
      'rankinis'=>Petshop_Katalogas::likutis_rankinis($pid),
      'laukas'=>Petshop_Katalogas::av_laukas($pid),
      'pries_stock'=>get_post_meta($pid,'_stock',true),
      'pries_own'=>get_post_meta($pid,'_own_stock_qty',true),
      'manage'=>$pr?($pr->get_manage_stock()?1:0):null,
    );
    $o['preke_'.$pid]=$e;
  }

  /* REALUS IRASYMAS i Ambrosia preke: +1 ir atgal -1 */
  $pid=19715;
  $_POST['priezastis']='inventorizacija';
  $_POST['pakeitimai']=wp_json_encode(array(array('id'=>$pid,'ivestis'=>'+1')));
  $_POST['nonce']=wp_create_nonce('ps_kat');
  $_REQUEST=$_POST;
  ob_start();
  try { Petshop_Katalogas::ajax_av_irasyti(); } catch ( \\Throwable $e ) {}
  $r1=ob_get_clean();
  clean_post_cache($pid);
  $o['po_plius']=array('atsakymas'=>mb_substr($r1,0,200),
    '_stock'=>get_post_meta($pid,'_stock',true),
    '_own'=>get_post_meta($pid,'_own_stock_qty',true),
    'wc_qty'=>(wc_get_product($pid) ? wc_get_product($pid)->get_stock_quantity() : null));

  $_POST['pakeitimai']=wp_json_encode(array(array('id'=>$pid,'ivestis'=>'-1')));
  $_REQUEST=$_POST;
  ob_start();
  try { Petshop_Katalogas::ajax_av_irasyti(); } catch ( \\Throwable $e ) {}
  $r2=ob_get_clean();
  clean_post_cache($pid);
  $o['po_minus']=array('_stock'=>get_post_meta($pid,'_stock',true),
    'wc_qty'=>(wc_get_product($pid) ? wc_get_product($pid)->get_stock_quantity() : null));

  /* VF preke — turi buti atmesta */
  $_POST['pakeitimai']=wp_json_encode(array(array('id'=>25319,'ivestis'=>'5')));
  $_REQUEST=$_POST;
  ob_start();
  try { Petshop_Katalogas::ajax_av_irasyti(); } catch ( \\Throwable $e ) {}
  $o['vf_bandymas']=mb_substr(ob_get_clean(),0,260);

  header('Content-Type: application/json; charset=utf-8'); echo wp_json_encode($o, JSON_UNESCAPED_UNICODE); exit;
}, 1);
`;
const s1=await wp('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP Likuciu Testas v1',code:php,scope:'global',active:true,priority:5})});
const j1=js(s1.text); out.snip=j1&&j1.id?j1.id:s1.text.slice(0,150);
await new Promise(r=>setTimeout(r,4000));
try{
  const res=execSync(`curl -sk "${B}/?ps_t=Lk9tT2" --max-time 150`,{encoding:'utf8',maxBuffer:40*1024*1024});
  out.testas=js(res)||res.slice(0,1200);
}catch(e){ out.err=String(e).slice(0,300); }
if(j1&&j1.id) await wp('/wp-json/code-snippets/v1/snippets/'+j1.id,{method:'DELETE'});
const body={message:'res lik',content:Buffer.from(JSON.stringify(out,null,1)).toString('base64')};
const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/lik.json`,{headers:{'Authorization':'Bearer '+TOK}});
if(g.status===200){ body.sha=(await g.json()).sha; }
await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/lik.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json'},body:JSON.stringify(body)});
console.log('ok');
