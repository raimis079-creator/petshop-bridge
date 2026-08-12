process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import fs from 'fs';
import { execSync } from 'child_process';
const B='https://dev.avesa.lt';
const U=process.env.WP_USER,P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='Basic '+Buffer.from(U+':'+P).toString('base64');
const TOK=process.env.GH_TOKEN||'', REPO=process.env.GH_REPO||'';
fs.mkdirSync('screenshots',{recursive:true});
const out={marker:'REGRESIJOS AUDITAS', ts:new Date().toISOString()};
async function wp(p,o={}){try{const r=await fetch(B+p,{...o,headers:{'Authorization':AUTH,'Content-Type':'application/json',...(o.headers||{})}});return{status:r.status,text:await r.text()}}catch(e){return{status:0,text:String(e)}}}
function js(t){const i=Math.min(...['[','{'].map(c=>{const x=t.indexOf(c);return x<0?1e9:x}));try{return JSON.parse(t.slice(i))}catch(e){return null}}
const php = `
add_action('init', function(){
  if ( ( $_GET['ps_rec'] ?? '' ) !== 'Rg2tA1' ) return;
  @set_time_limit(240);
  $o=array('marker'=>'AUDITAS');
  $d=WPMU_PLUGIN_DIR;

  /* zymekliai, kuriuos tikrinam kiekvienoje versijoje */
  $zym = array(
    'AV likucio redagavimas' => 'kort-av',
    'ajax_av_irasyti'        => 'ps_kat_av',
    'Sudelioti i lentyneles' => 'Sudėlioti',
    'Antrasciu karkasas'     => 'ka-karkasas',
    'Aprasymo irasymas'      => 'ka-irasyti',
    'Trumpas aprasymas'      => 'kort-tr-red',
    'GPAIS pakuote'          => 'kort-pak',
    'Kopijuoti i nauja'      => 'Kopijuoti į naują',
    'Isimta ranka'           => 'kort-ranka',
    'Kaina redaguojama'      => 'kort-kaina',
    'SKU redagavimas'        => 'kort-sku',
    'Nuotrauku valdymas'     => 'ps_kat_nuotraukos',
    'Masiniai veiksmai'      => 'ps_kat_masinis',
    'Partijos kortelėje'     => 'ps_kat_partija',
  );

  $failai = array();
  foreach ( (array) glob($d.'/.bak-petshop-katalogas.php-*') as $f ) { $failai[basename($f)] = $f; }
  ksort($failai);
  $failai['DABAR petshop-katalogas.php'] = $d.'/petshop-katalogas.php';

  $rez=array();
  foreach ($failai as $vardas => $kelias) {
    $t = @file_get_contents($kelias);
    if ($t===false) continue;
    $eil = array('kb'=>(int)round(strlen($t)/1024));
    if (preg_match("/const VERSIJA\\s*=\\s*'([^']+)'/", $t, $m)) { $eil['v']=$m[1]; }
    foreach ($zym as $pav => $z) { $eil[$pav] = (substr_count($t, $z) > 0) ? substr_count($t,$z) : 0; }
    $rez[$vardas]=$eil;
  }
  $o['katalogas']=$rez;

  /* gavimo modulis — ten irgi yra „Sudelioti" */
  $gr=array();
  $gf=array();
  foreach ( (array) glob($d.'/.bak-petshop-gavimas.php-*') as $f ) { $gf[basename($f)]=$f; }
  ksort($gf);
  $gf['DABAR petshop-gavimas.php']=$d.'/petshop-gavimas.php';
  foreach ($gf as $vardas=>$kelias){
    $t=@file_get_contents($kelias); if($t===false) continue;
    $gr[$vardas]=array('kb'=>(int)round(strlen($t)/1024),
      'Sudelioti'=>substr_count($t,'Sudėlioti'),
      'n-sudelioti'=>substr_count($t,'n-sudelioti'),
      'kurti-dar'=>substr_count($t,'n-kurti-dar'));
  }
  $o['gavimas']=$gr;
  header('Content-Type: application/json; charset=utf-8'); echo wp_json_encode($o, JSON_UNESCAPED_UNICODE); exit;
}, 1);
`;
const s1=await wp('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP Regresijos Auditas v1',code:php,scope:'global',active:true,priority:5})});
const j1=js(s1.text); out.snip=j1&&j1.id?j1.id:s1.text.slice(0,150);
await new Promise(r=>setTimeout(r,4000));
try{
  const res=execSync(`curl -sk "${B}/?ps_rec=Rg2tA1" --max-time 150`,{encoding:'utf8',maxBuffer:40*1024*1024});
  out.recon=js(res)||res.slice(0,1500);
}catch(e){ out.err=String(e).slice(0,400); }
if(j1&&j1.id) await wp('/wp-json/code-snippets/v1/snippets/'+j1.id,{method:'DELETE'});
const body={message:'res audit',content:Buffer.from(JSON.stringify(out,null,1)).toString('base64')};
const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/audit.json`,{headers:{'Authorization':'Bearer '+TOK}});
if(g.status===200){ body.sha=(await g.json()).sha; }
await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/audit.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json'},body:JSON.stringify(body)});
console.log('ok');
