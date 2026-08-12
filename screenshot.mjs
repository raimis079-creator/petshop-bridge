process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import fs from 'fs';
import { execSync } from 'child_process';
const B='https://dev.avesa.lt';
const U=process.env.WP_USER,P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='Basic '+Buffer.from(U+':'+P).toString('base64');
const TOK=process.env.GH_TOKEN||'', REPO=process.env.GH_REPO||'';
fs.mkdirSync('screenshots',{recursive:true});
const out={marker:'INVENTORIUS 2', ts:new Date().toISOString()};
async function wp(p,o={}){try{const r=await fetch(B+p,{...o,headers:{'Authorization':AUTH,'Content-Type':'application/json',...(o.headers||{})}});return{status:r.status,text:await r.text()}}catch(e){return{status:0,text:String(e)}}}
function js(t){const i=Math.min(...['[','{'].map(c=>{const x=t.indexOf(c);return x<0?1e9:x}));try{return JSON.parse(t.slice(i))}catch(e){return null}}
const php = `
add_action('init', function(){
  if ( ( $_GET['ps_rec'] ?? '' ) !== 'In8tV2' ) return;
  @set_time_limit(240);
  $o=array('marker'=>'INV2');
  $pid = (int)($_GET['pid'] ?? 34907);
  ob_start(); Petshop_Katalogas::kortele($pid); $h=ob_get_clean();
  $o['pid']=$pid; $o['pav']=mb_substr(html_entity_decode(get_the_title($pid)),0,40);

  /* skaidom i skirtukus */
  $dalys=preg_split('/<div class="kort-pane[^"]*" data-p="([a-z]+)">/', $h, -1, PREG_SPLIT_DELIM_CAPTURE);
  $panes=array();
  for($i=1;$i<count($dalys);$i+=2){ $panes[$dalys[$i]] = $dalys[$i+1] ?? ''; }

  foreach($panes as $p=>$t){
    $el=array();
    /* antrastes */
    preg_match_all('/<div class="kort-antr">(.*?)<\\/div>/s',$t,$a);
    foreach($a[1] as $x){ $el['blokai'][]=trim(mb_substr(wp_strip_all_tags($x),0,40)); }
    /* mygtukai */
    preg_match_all('/<button[^>]*class="([^"]*)"[^>]*>(.*?)<\\/button>/is',$t,$b);
    foreach($b[2] as $i2=>$x){ $el['mygtukai'][]=trim(wp_strip_all_tags($x)).' ['.$b[1][$i2].']'; }
    /* nuorodos su klase */
    preg_match_all('/<a[^>]*class="([^"]*)"[^>]*>(.*?)<\\/a>/is',$t,$c);
    foreach($c[2] as $i2=>$x){ $el['nuorodos'][]=trim(wp_strip_all_tags($x)).' ['.$c[1][$i2].']'; }
    /* redaguojami laukai */
    preg_match_all('/data-laukas="([^"]*)"/',$t,$d2);
    $el['laukai']=array_values(array_unique($d2[1]));
    /* select */
    preg_match_all('/<select[^>]*class="([^"]*)"/',$t,$e2);
    $el['select']=array_values(array_unique($e2[1]));
    foreach($el as $k=>$v){ $el[$k]=array_values(array_unique((array)$v)); }
    $panes_out[$p]=$el;
  }
  $o['skirtukai']=$panes_out;
  header('Content-Type: application/json; charset=utf-8'); echo wp_json_encode($o, JSON_UNESCAPED_UNICODE); exit;
}, 1);
`;
const s1=await wp('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP Inventorius v2',code:php,scope:'global',active:true,priority:5})});
const j1=js(s1.text); out.snip=j1&&j1.id?j1.id:s1.text.slice(0,150);
await new Promise(r=>setTimeout(r,4000));
try{
  const res=execSync(`curl -sk "${B}/?ps_rec=In8tV2&pid=34907" --max-time 150`,{encoding:'utf8',maxBuffer:40*1024*1024});
  out.recon=js(res)||res.slice(0,1500);
}catch(e){ out.err=String(e).slice(0,400); }
if(j1&&j1.id) await wp('/wp-json/code-snippets/v1/snippets/'+j1.id,{method:'DELETE'});
const body={message:'res inv2',content:Buffer.from(JSON.stringify(out,null,1)).toString('base64')};
const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/inv2.json`,{headers:{'Authorization':'Bearer '+TOK}});
if(g.status===200){ body.sha=(await g.json()).sha; }
await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/inv2.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json'},body:JSON.stringify(body)});
console.log('ok');
