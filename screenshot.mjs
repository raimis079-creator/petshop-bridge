process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import fs from 'fs';
import { execSync } from 'child_process';
const B='https://dev.avesa.lt';
const U=process.env.WP_USER,P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='Basic '+Buffer.from(U+':'+P).toString('base64');
const TOK=process.env.GH_TOKEN||'', REPO=process.env.GH_REPO||'';
fs.mkdirSync('screenshots',{recursive:true});
const out={marker:'KORTELE KLAIDA', ts:new Date().toISOString()};
async function wp(p,o={}){try{const r=await fetch(B+p,{...o,headers:{'Authorization':AUTH,'Content-Type':'application/json',...(o.headers||{})}});return{status:r.status,text:await r.text()}}catch(e){return{status:0,text:String(e)}}}
function js(t){const i=Math.min(...['[','{'].map(c=>{const x=t.indexOf(c);return x<0?1e9:x}));try{return JSON.parse(t.slice(i))}catch(e){return null}}
const php = `
add_action('init', function(){
  if ( ( $_GET['ps_rec'] ?? '' ) !== 'Kk3tE1' ) return;
  @set_time_limit(180);
  @ini_set('display_errors', 1);
  $o=array('marker'=>'KORTELE');
  $pid = (int) ( $_GET['pid'] ?? 19902 );
  $o['pid']=$pid;
  $o['klases']=array('katalogas'=>class_exists('Petshop_Katalogas'),'partijos'=>class_exists('Petshop_Partijos'));
  if (class_exists('Petshop_Partijos')) {
    $o['medziagos_yra']=method_exists('Petshop_Partijos','medziagos');
    $o['tipai_yra']=method_exists('Petshop_Partijos','tipai');
    $o['trinti_yra']=method_exists('Petshop_Partijos','trinti_pakuote');
    $o['versija']=defined('Petshop_Partijos::VERSIJA') ? Petshop_Partijos::VERSIJA : '?';
  }
  $o['kat_versija']=class_exists('Petshop_Katalogas') && defined('Petshop_Katalogas::VERSIJA') ? Petshop_Katalogas::VERSIJA : '?';
  try {
    ob_start();
    Petshop_Katalogas::kortele($pid);
    $h=ob_get_clean();
    $o['html_ilgis']=strlen($h);
    $o['turi_pak']= (strpos($h,'kort-pak')!==false);
    $o['fatal']= (stripos($h,'Fatal error')!==false || stripos($h,'Warning')!==false) ? substr($h, max(0,stripos($h,'error')-200), 600) : '';
  } catch ( \\Throwable $e ) {
    if (ob_get_level()) { ob_end_clean(); }
    $o['klaida']=get_class($e).': '.$e->getMessage().' @ '.basename($e->getFile()).':'.$e->getLine();
  }
  header('Content-Type: application/json; charset=utf-8'); echo wp_json_encode($o, JSON_UNESCAPED_UNICODE); exit;
}, 1);
`;
const s1=await wp('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP Kortele Klaida v1',code:php,scope:'global',active:true,priority:5})});
const j1=js(s1.text); out.snip=j1&&j1.id?j1.id:s1.text.slice(0,150);
await new Promise(r=>setTimeout(r,4000));
try{
  const res=execSync(`curl -sk "${B}/?ps_rec=Kk3tE1&pid=19902" --max-time 120`,{encoding:'utf8',maxBuffer:40*1024*1024});
  out.recon=js(res)||res.slice(0,1500);
}catch(e){ out.err=String(e).slice(0,400); }
if(j1&&j1.id) await wp('/wp-json/code-snippets/v1/snippets/'+j1.id,{method:'DELETE'});
const body={message:'res kk',content:Buffer.from(JSON.stringify(out,null,1)).toString('base64')};
const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/kk.json`,{headers:{'Authorization':'Bearer '+TOK}});
if(g.status===200){ body.sha=(await g.json()).sha; }
await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/kk.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json'},body:JSON.stringify(body)});
console.log('ok');
