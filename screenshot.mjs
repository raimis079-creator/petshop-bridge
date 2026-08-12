process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import fs from 'fs';
import { execSync } from 'child_process';
const B='https://dev.avesa.lt';
const U=process.env.WP_USER,P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='Basic '+Buffer.from(U+':'+P).toString('base64');
const TOK=process.env.GH_TOKEN||'', REPO=process.env.GH_REPO||'';
fs.mkdirSync('screenshots',{recursive:true});
const out={marker:'LIKUCIU TESTAS 2', ts:new Date().toISOString()};
async function wp(p,o={}){try{const r=await fetch(B+p,{...o,headers:{'Authorization':AUTH,'Content-Type':'application/json',...(o.headers||{})}});return{status:r.status,text:await r.text()}}catch(e){return{status:0,text:String(e)}}}
function js(t){const i=Math.min(...['[','{'].map(c=>{const x=t.indexOf(c);return x<0?1e9:x}));try{return JSON.parse(t.slice(i))}catch(e){return null}}
const php = `
add_action('init', function(){
  if ( ( $_GET['ps_t'] ?? '' ) !== 'Lk9tT3' ) return;
  @set_time_limit(180);
  $step = (string)($_GET['step'] ?? '1');
  $adm=get_users(array('role'=>'administrator','number'=>1));
  wp_set_current_user($adm?$adm[0]->ID:0);

  if ( $step === '1' ) {
    $o=array('marker'=>'BUKLE','v'=>Petshop_Katalogas::VERSIJA);
    foreach ( array(19715,16760,15835,19902,25319) as $pid ) {
      $pr=wc_get_product($pid);
      $o['preke_'.$pid]=array(
        'sand'=>get_post_meta($pid,'_ps_sandelis',true),
        'rankinis'=>Petshop_Katalogas::likutis_rankinis($pid) ? 'taip':'ne',
        'laukas'=>Petshop_Katalogas::av_laukas($pid),
        '_stock'=>get_post_meta($pid,'_stock',true),
        '_own'=>get_post_meta($pid,'_own_stock_qty',true),
        'wc_qty'=>$pr?$pr->get_stock_quantity():null,
        'wc_status'=>$pr?$pr->get_stock_status():null,
      );
    }
    header('Content-Type: application/json; charset=utf-8'); echo wp_json_encode($o, JSON_UNESCAPED_UNICODE); exit;
  }

  /* step 2: grazinam Ambrosia -1 ; step 3: VF bandymas */
  $pid = ( $step === '3' ) ? 25319 : 19715;
  $iv  = ( $step === '3' ) ? '5' : '-1';
  $_POST['priezastis']='inventorizacija';
  $_POST['pakeitimai']=wp_json_encode(array(array('id'=>$pid,'ivestis'=>$iv)));
  $_POST['nonce']=wp_create_nonce('ps_kat');
  $_REQUEST=$_POST;
  Petshop_Katalogas::ajax_av_irasyti();
}, 1);
`;
const s1=await wp('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP Likuciu Testas v3',code:php,scope:'global',active:true,priority:5})});
const j1=js(s1.text); out.snip=j1&&j1.id?j1.id:s1.text.slice(0,150);
await new Promise(r=>setTimeout(r,4000));
for (const st of ['2','3','1']) {
  try{
    const res=execSync(`curl -sk "${B}/?ps_t=Lk9tT3&step=${st}" --max-time 120`,{encoding:'utf8',maxBuffer:20*1024*1024});
    out['step'+st]=js(res)||res.slice(0,400);
  }catch(e){ out['step'+st]='ERR '+String(e).slice(0,200); }
  await new Promise(r=>setTimeout(r,1500));
}
if(j1&&j1.id) await wp('/wp-json/code-snippets/v1/snippets/'+j1.id,{method:'DELETE'});
const body={message:'res lik2',content:Buffer.from(JSON.stringify(out,null,1)).toString('base64')};
const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/lik2.json`,{headers:{'Authorization':'Bearer '+TOK}});
if(g.status===200){ body.sha=(await g.json()).sha; }
await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/lik2.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json'},body:JSON.stringify(body)});
console.log('ok');
