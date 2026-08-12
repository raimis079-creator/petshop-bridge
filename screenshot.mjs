process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import fs from 'fs';
import { execSync } from 'child_process';
const B='https://dev.avesa.lt';
const U=process.env.WP_USER,P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='Basic '+Buffer.from(U+':'+P).toString('base64');
const TOK=process.env.GH_TOKEN||'', REPO=process.env.GH_REPO||'';
fs.mkdirSync('screenshots',{recursive:true});
const out={marker:'VF PUBLISH RECON', ts:new Date().toISOString()};
async function wp(p,o={}){try{const r=await fetch(B+p,{...o,headers:{'Authorization':AUTH,'Content-Type':'application/json',...(o.headers||{})}});return{status:r.status,text:await r.text()}}catch(e){return{status:0,text:String(e)}}}
function js(t){const i=Math.min(...['[','{'].map(c=>{const x=t.indexOf(c);return x<0?1e9:x}));try{return JSON.parse(t.slice(i))}catch(e){return null}}
const php = `
add_action('init', function(){
  if ( ( $_GET['ps_rec'] ?? '' ) !== 'Vf3tR6' ) return;
  @set_time_limit(180);
  $o=array('marker'=>'VF PUBLISH');
  $rasta=array();
  $dirs=array(WP_PLUGIN_DIR, WPMU_PLUGIN_DIR, get_stylesheet_directory());
  foreach($dirs as $d){
    $it=new RecursiveIteratorIterator(new RecursiveDirectoryIterator($d, FilesystemIterator::SKIP_DOTS));
    foreach($it as $file){
      if(!$file->isFile() || substr($file->getFilename(),-4)!=='.php') continue;
      $t=@file_get_contents($file->getPathname());
      if($t===false) continue;
      if(strpos($t,'petshop_vf_sync_publish_daily')!==false){
        $rasta[]=array('failas'=>str_replace(ABSPATH,'',$file->getPathname()),'dydis'=>strlen($t));
      }
    }
  }
  $o['failai']=$rasta;
  /* pagrindinio failo turinys */
  if($rasta){
    $kelias=ABSPATH.$rasta[0]['failas'];
    $o['b64']=base64_encode(file_get_contents($kelias));
    $o['kelias']=$rasta[0]['failas'];
  }
  /* ar snippetuose yra */
  global $wpdb;
  $sn=$wpdb->prefix.'snippets';
  if($wpdb->get_var("SHOW TABLES LIKE '{$sn}'")===$sn){
    $o['snippetai']=$wpdb->get_results("SELECT id,name,active FROM {$sn} WHERE code LIKE '%vf_sync_publish%' OR code LIKE '%publish_daily%'", ARRAY_A);
  }
  header('Content-Type: application/json; charset=utf-8'); echo wp_json_encode($o, JSON_UNESCAPED_UNICODE); exit;
}, 1);
`;
const s1=await wp('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP VF Publish Recon v1',code:php,scope:'global',active:true,priority:5})});
const j1=js(s1.text); out.snip=j1&&j1.id?j1.id:s1.text.slice(0,150);
await new Promise(r=>setTimeout(r,4000));
try{
  const res=execSync(`curl -sk "${B}/?ps_rec=Vf3tR6" --max-time 150`,{encoding:'utf8',maxBuffer:60*1024*1024});
  const j=js(res);
  if(j&&j.b64){
    const body={message:'vf publish',content:Buffer.from(j.b64).toString('base64')};
    const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/vfpub.b64`,{headers:{'Authorization':'Bearer '+TOK}});
    if(g.status===200){ body.sha=(await g.json()).sha; }
    await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/vfpub.b64`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json'},body:JSON.stringify(body)});
    delete j.b64;
  }
  out.recon=j||res.slice(0,800);
}catch(e){ out.err=String(e).slice(0,300); }
if(j1&&j1.id) await wp('/wp-json/code-snippets/v1/snippets/'+j1.id,{method:'DELETE'});
const body={message:'res vfpub',content:Buffer.from(JSON.stringify(out,null,1)).toString('base64')};
const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/vfpub.json`,{headers:{'Authorization':'Bearer '+TOK}});
if(g.status===200){ body.sha=(await g.json()).sha; }
await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/vfpub.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json'},body:JSON.stringify(body)});
console.log('ok');
