process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import fs from 'fs';
import { execSync } from 'child_process';
const B='https://dev.avesa.lt';
const U=process.env.WP_USER,P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='Basic '+Buffer.from(U+':'+P).toString('base64');
const TOK=process.env.GH_TOKEN||'', REPO=process.env.GH_REPO||'';
fs.mkdirSync('screenshots',{recursive:true});
const out={marker:'PUBLIKAVIMO RECON', ts:new Date().toISOString()};
async function wp(p,o={}){try{const r=await fetch(B+p,{...o,headers:{'Authorization':AUTH,'Content-Type':'application/json',...(o.headers||{})}});return{status:r.status,text:await r.text()}}catch(e){return{status:0,text:String(e)}}}
function js(t){const i=Math.min(...['[','{'].map(c=>{const x=t.indexOf(c);return x<0?1e9:x}));try{return JSON.parse(t.slice(i))}catch(e){return null}}
const php = `
add_action('init', function(){
  if ( ( $_GET['ps_rec'] ?? '' ) !== 'Pb9xK5' ) return;
  @set_time_limit(240);
  global $wpdb; $p=$wpdb->prefix;
  $o=array('marker'=>'RECON PUBLIKAVIMAS');

  /* 1. Kas kode raso post_status = publish */
  $vietos=array();
  $dirs=array(WPMU_PLUGIN_DIR, WP_PLUGIN_DIR.'/petshop-xml');
  foreach ($dirs as $d) {
    if (!is_dir($d)) continue;
    $it = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($d));
    foreach ($it as $f) {
      if (!$f->isFile() || substr($f->getFilename(),-4)!=='.php') continue;
      if (strpos($f->getFilename(),'.bak-')===0) continue;
      $t=@file_get_contents($f->getPathname());
      if ($t===false) continue;
      $eil=explode("\\n",$t);
      foreach ($eil as $i=>$l) {
        if ( preg_match('~publish~i',$l) && preg_match('~post_status|set_status|wp_publish_post~i',$l) ) {
          $vietos[] = basename($f->getPathname()).':'.($i+1).' '.trim(mb_substr($l,0,150));
        }
      }
    }
  }
  $o['publish_vietos']=$vietos;

  /* 2. Vartu failas */
  $v=@file_get_contents(WPMU_PLUGIN_DIR.'/petshop-vartai.php');
  $o['vartai']= $v===false ? 'NERA' : base64_encode($v);

  /* 3. Snippetai su publish */
  $sn=$wpdb->get_results("SELECT id,name,active FROM {$p}snippets WHERE code LIKE '%post_status%' AND code LIKE '%publish%'", ARRAY_A);
  $o['snippetai']=$sn;

  /* 4. VF/ZB prekes, kurios siandien tapo publish */
  $siandien=date('Y-m-d');
  $eil=$wpdb->get_results($wpdb->prepare(
    "SELECT ID, post_title, post_status, post_modified FROM {$p}posts
      WHERE post_type='product' AND post_status='publish' AND post_modified >= %s ORDER BY post_modified DESC LIMIT 40",
      $siandien.' 00:00:00'), ARRAY_A);
  foreach ($eil as &$e) {
    $e['vf']=get_post_meta($e['ID'],'_vf_enabled',true);
    $e['zb']=get_post_meta($e['ID'],'_zb_enabled',true);
    $e['vartai']=get_post_meta($e['ID'],'_ps_publikuota',true);
    $e['juodr']=get_post_meta($e['ID'],'_ps_i_juodrasti',true);
  }
  $o['siandien_publish']=$eil;
  $o['siandien_publish_kiek']=count($eil);

  header('Content-Type: application/json; charset=utf-8'); echo wp_json_encode($o, JSON_UNESCAPED_UNICODE); exit;
}, 1);
`;
const s1=await wp('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP Publikavimo Recon v1',code:php,scope:'global',active:true,priority:5})});
const j1=js(s1.text); out.snip=j1&&j1.id?j1.id:s1.text.slice(0,150);
await new Promise(r=>setTimeout(r,4000));
try{
  const res=execSync(`curl -sk "${B}/?ps_rec=Pb9xK5" --max-time 180`,{encoding:'utf8',maxBuffer:40*1024*1024});
  out.recon=js(res)||res.slice(0,1500);
}catch(e){ out.err=String(e).slice(0,300); }
if(j1&&j1.id) await wp('/wp-json/code-snippets/v1/snippets/'+j1.id,{method:'DELETE'});
const body={message:'res pub',content:Buffer.from(JSON.stringify(out,null,1)).toString('base64')};
const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/publikavimas.json`,{headers:{'Authorization':'Bearer '+TOK}});
if(g.status===200){ body.sha=(await g.json()).sha; }
await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/publikavimas.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json'},body:JSON.stringify(body)});
console.log('ok');
