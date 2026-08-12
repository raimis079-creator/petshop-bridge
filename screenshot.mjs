process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import fs from 'fs';
import { execSync } from 'child_process';
const B='https://dev.avesa.lt';
const U=process.env.WP_USER,P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='Basic '+Buffer.from(U+':'+P).toString('base64');
const TOK=process.env.GH_TOKEN||'', REPO=process.env.GH_REPO||'';
fs.mkdirSync('screenshots',{recursive:true});
const out={marker:'KLAIDOS RECON v1 KOPIJA', ts:new Date().toISOString()};

async function wp(p,o={}){try{const r=await fetch(B+p,{...o,headers:{'Authorization':AUTH,'Content-Type':'application/json',...(o.headers||{})}});return{status:r.status,text:await r.text()}}catch(e){return{status:0,text:String(e)}}}
function js(t){const i=Math.min(...['[','{'].map(c=>{const x=t.indexOf(c);return x<0?1e9:x}));try{return JSON.parse(t.slice(i))}catch(e){return null}}
async function putResult(name,obj){
  const path='screenshots/'+name;
  const body={message:'res '+name,content:Buffer.from(JSON.stringify(obj,null,1)).toString('base64')};
  try{
    const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK}});
    if(g.status===200){ const j=await g.json(); body.sha=j.sha; }
  }catch(e){}
  const r=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json'},body:JSON.stringify(body)});
  return r.status;
}

/* ---- TEMP recon snippet ---- */
const php = `
add_action('init', function(){
  if ( ( $_GET['ps_rec'] ?? '' ) !== 'Kl8xQ2v1' ) return;
  @set_time_limit(120);
  $o = array('marker'=>'RECON KOPIJA v1');

  /* 1. mu-plugins failai + versijos */
  $dir = WPMU_PLUGIN_DIR;
  $failai = array();
  foreach ( (array) glob($dir.'/*.php') as $f ) {
    $t = (string) @file_get_contents($f);
    $v = '';
    if ( preg_match('/Petshop[^\\\\n]{0,60}?v(\\\\d+\\\\.\\\\d+)/i', substr($t,0,4000), $m) ) { $v = $m[1]; }
    $failai[ basename($f) ] = array(
      'v'      => $v,
      'kb'     => (int) round(strlen($t)/1024),
      'kopij'  => preg_match_all('/kopij/i', $t),
      'duplic' => preg_match_all('/duplicat/i', $t),
    );
  }
  $o['mu'] = $failai;

  /* 2. ar WooCommerce dublikavimas gyvas */
  $o['wc_duplicate_class'] = class_exists('WC_Admin_Duplicate_Product');
  $o['wc_duplicate_hook']  = has_filter('post_row_actions') ? 1 : 0;

  /* 3. Gavimo modulio naujos prekes forma */
  $g = @file_get_contents($dir.'/petshop-gavimas.php');
  if ($g !== false) {
    $o['gavimas'] = array(
      'baitai'        => strlen($g),
      'naujaAtverti'  => substr_count($g,'naujaAtverti'),
      'g_nauja_btn'   => substr_count($g,'g-nauja-btn'),
      'ajax_nauja'    => substr_count($g,'ps_gav_nauja'),
      'kopija'        => preg_match_all('/kopij/i',$g),
      'panasi'        => preg_match_all('/panas/i',$g),
      'versija'       => (preg_match('/Petshop Gavimas v([\\\\d.]+)/i',$g,$m)? $m[1] : '?'),
    );
  } else { $o['gavimas'] = 'NERA FAILO'; }

  /* 4. Katalogo modulis */
  $k = @file_get_contents($dir.'/petshop-katalogas.php');
  if ($k !== false) {
    $o['katalogas'] = array(
      'baitai'  => strlen($k),
      'versija' => (preg_match('/Petshop Katalogas v([\\\\d.]+)/i',$k,$m)? $m[1] : '?'),
      'kopija'  => preg_match_all('/kopij/i',$k),
      'eilutes_veiksmai' => substr_count($k,'row-actions'),
    );
  } else { $o['katalogas'] = 'NERA FAILO'; }

  /* 5. Rinkiniai (ten kopijavimas jau padarytas — pavyzdys) */
  $r = @file_get_contents($dir.'/petshop-rinkiniai.php');
  $o['rinkiniai'] = ($r===false) ? 'NERA' : array('baitai'=>strlen($r),'kopija'=>preg_match_all('/kopij/i',$r));

  header('Content-Type: application/json; charset=utf-8');
  echo wp_json_encode($o, JSON_UNESCAPED_UNICODE);
  exit;
}, 1);
`;

const s1=await wp('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP Klaidos Recon Kopija v1',code:php,scope:'global',active:true,priority:5})});
const j1=js(s1.text); out.snip=j1&&j1.id?j1.id:s1.text.slice(0,200);
await new Promise(r=>setTimeout(r,4000));

try{
  const res=execSync(`curl -sk "${B}/?ps_rec=Kl8xQ2v1" --max-time 90`,{encoding:'utf8',maxBuffer:20*1024*1024});
  out.recon = js(res) || res.slice(0,2000);
}catch(e){ out.recon_err=String(e).slice(0,400); }

/* deaktyvuojam TEMP */
if (j1 && j1.id) { await wp('/wp-json/code-snippets/v1/snippets/'+j1.id,{method:'DELETE'}); }

out.put = await putResult('klaidos_recon1.json', out);
console.log(JSON.stringify(out).slice(0,3000));
