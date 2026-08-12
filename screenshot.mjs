process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import fs from 'fs';
import { execSync } from 'child_process';
const B='https://dev.avesa.lt';
const U=process.env.WP_USER,P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='Basic '+Buffer.from(U+':'+P).toString('base64');
const TOK=process.env.GH_TOKEN||'', REPO=process.env.GH_REPO||'';
fs.mkdirSync('screenshots',{recursive:true});
const out={marker:'KORTELES INVENTORIUS', ts:new Date().toISOString()};
async function wp(p,o={}){try{const r=await fetch(B+p,{...o,headers:{'Authorization':AUTH,'Content-Type':'application/json',...(o.headers||{})}});return{status:r.status,text:await r.text()}}catch(e){return{status:0,text:String(e)}}}
function js(t){const i=Math.min(...['[','{'].map(c=>{const x=t.indexOf(c);return x<0?1e9:x}));try{return JSON.parse(t.slice(i))}catch(e){return null}}
const php = `
add_action('init', function(){
  if ( ( $_GET['ps_rec'] ?? '' ) !== 'Kv7tI1' ) return;
  @set_time_limit(240);
  $o=array('marker'=>'INVENTORIUS');
  $pids = array( 19902, 34907, 25319 );
  foreach ($pids as $pid) {
    ob_start(); Petshop_Katalogas::kortele($pid); $h=ob_get_clean();
    $mygtukai=array(); preg_match_all('/<button[^>]*class="([^"]*)"[^>]*>(.*?)<\\/button>/is', $h, $m);
    foreach ($m[1] as $i=>$kl) { $mygtukai[] = trim(wp_strip_all_tags($m[2][$i])).' ['.$kl.']'; }
    $red=array(); preg_match_all('/class="[^"]*kort-red[^"]*"[^>]*data-laukas="([^"]*)"/', $h, $r);
    $sekcijos=array(); preg_match_all('/<div class="kort-pane[^"]*" data-p="([a-z]+)"/', $h, $s);
    $o['preke_'.$pid]=array(
      'pav'=>mb_substr(html_entity_decode(get_the_title($pid)),0,42),
      'sandelis'=>get_post_meta($pid,'_ps_sandelis',true),
      'busena'=>get_post_status($pid),
      'skirtukai'=>$s[1],
      'mygtukai'=>array_values(array_unique($mygtukai)),
      'redaguojami_laukai'=>array_values(array_unique($r[1])),
      'AV_blokas'=> (strpos($h,'kort-av-red')!==false || strpos($h,'ps_kat_av')!==false || strpos($h,'AV likutis')!==false),
      'ilgis'=>strlen($h),
    );
  }
  /* kaip AV likutis apskritai redaguojamas — ieskom kode */
  $k=@file_get_contents(WPMU_PLUGIN_DIR.'/petshop-katalogas.php');
  $eil=array();
  foreach (explode("\\n",$k) as $i=>$l) {
    if (stripos($l,'ps_kat_av')!==false || stripos($l,'av_irasyti')!==false || stripos($l,'kort-likutis')!==false) {
      $eil[]=($i+1).': '.trim(mb_substr($l,0,150));
    }
  }
  $o['av_kode']=$eil;
  header('Content-Type: application/json; charset=utf-8'); echo wp_json_encode($o, JSON_UNESCAPED_UNICODE); exit;
}, 1);
`;
const s1=await wp('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP Korteles Inventorius v1',code:php,scope:'global',active:true,priority:5})});
const j1=js(s1.text); out.snip=j1&&j1.id?j1.id:s1.text.slice(0,150);
await new Promise(r=>setTimeout(r,4000));
try{
  const res=execSync(`curl -sk "${B}/?ps_rec=Kv7tI1" --max-time 150`,{encoding:'utf8',maxBuffer:40*1024*1024});
  out.recon=js(res)||res.slice(0,1500);
}catch(e){ out.err=String(e).slice(0,400); }
if(j1&&j1.id) await wp('/wp-json/code-snippets/v1/snippets/'+j1.id,{method:'DELETE'});
const body={message:'res inv',content:Buffer.from(JSON.stringify(out,null,1)).toString('base64')};
const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/inv.json`,{headers:{'Authorization':'Bearer '+TOK}});
if(g.status===200){ body.sha=(await g.json()).sha; }
await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/inv.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json'},body:JSON.stringify(body)});
console.log('ok');
