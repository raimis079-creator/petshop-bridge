process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import fs from 'fs';
import { execSync } from 'child_process';
const B='https://dev.avesa.lt';
const U=process.env.WP_USER,P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='Basic '+Buffer.from(U+':'+P).toString('base64');
const TOK=process.env.GH_TOKEN||'', REPO=process.env.GH_REPO||'';
fs.mkdirSync('screenshots',{recursive:true});
const out={marker:'KLAIDOS RECON v2 KOPIJA', ts:new Date().toISOString()};

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
  if ( ( $_GET['ps_rec'] ?? '' ) !== 'Kl8xQ2v2' ) return;
  @set_time_limit(120);
  $o = array('marker'=>'RECON KOPIJA v2');
  $dir = WPMU_PLUGIN_DIR;
  foreach ( array('petshop-katalogas.php','petshop-gavimas.php') as $f ) {
    $t = @file_get_contents($dir.'/'.$f);
    if ($t===false) { $o[$f]='NERA'; continue; }
    $eil = explode("\\n", $t);
    $rasta = array();
    foreach ($eil as $i=>$l) {
      if ( stripos($l,'kopij')!==false ) { $rasta[] = ($i+1).': '.trim(mb_substr($l,0,190)); }
    }
    $o[$f] = $rasta;
  }
  /* katalogo eiluciu veiksmai / mygtukai */
  $k = @file_get_contents($dir.'/petshop-katalogas.php');
  $o['katalogo_veiksmai'] = array();
  foreach (array('Redaguoti','Peržiūrėti','Ištrinti','Dubliuoti','Nauja prekė','naujas','pk-veiksmai') as $z) {
    $o['katalogo_veiksmai'][$z] = substr_count($k, $z);
  }
  header('Content-Type: application/json; charset=utf-8');
  echo wp_json_encode($o, JSON_UNESCAPED_UNICODE);
  exit;
}, 1);
`;

const s1=await wp('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP Klaidos Recon Kopija v2',code:php,scope:'global',active:true,priority:5})});
const j1=js(s1.text); out.snip=j1&&j1.id?j1.id:s1.text.slice(0,200);
await new Promise(r=>setTimeout(r,4000));

try{
  const res=execSync(`curl -sk "${B}/?ps_rec=Kl8xQ2v2" --max-time 90`,{encoding:'utf8',maxBuffer:20*1024*1024});
  out.recon = js(res) || res.slice(0,2000);
}catch(e){ out.recon_err=String(e).slice(0,400); }

/* deaktyvuojam TEMP */
if (j1 && j1.id) { await wp('/wp-json/code-snippets/v1/snippets/'+j1.id,{method:'DELETE'}); }

out.put = await putResult('klaidos_recon2.json', out);
console.log(JSON.stringify(out).slice(0,3000));
