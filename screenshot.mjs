process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import fs from 'fs';
import { execSync } from 'child_process';
const B='https://dev.avesa.lt';
const U=process.env.WP_USER,P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='Basic '+Buffer.from(U+':'+P).toString('base64');
const TOK=process.env.GH_TOKEN||'', REPO=process.env.GH_REPO||'';
fs.mkdirSync('screenshots',{recursive:true});
const out={marker:'RANKOS DEPLOY', ts:new Date().toISOString()};
async function wp(p,o={}){try{const r=await fetch(B+p,{...o,headers:{'Authorization':AUTH,'Content-Type':'application/json',...(o.headers||{})}});return{status:r.status,text:await r.text()}}catch(e){return{status:0,text:String(e)}}}
function js(t){const i=Math.min(...['[','{'].map(c=>{const x=t.indexOf(c);return x<0?1e9:x}));try{return JSON.parse(t.slice(i))}catch(e){return null}}
const phpDep = `
add_action('wp_loaded', function(){
  if ( ( \$_GET['ps_dep'] ?? '' ) !== 'Kp5tW7' ) return;
  @set_time_limit(240);
  \$o=array('marker'=>'DEPLOY');
  \$f=basename( \$_GET['f'] ?? '' ); \$b64=\$_POST['turinys'] ?? '';
  if(!\$f||!\$b64){ \$o['err']='nera'; header('Content-Type: application/json'); echo wp_json_encode(\$o); exit; }
  \$k=base64_decode(\$b64); \$o['f']=\$f; \$o['md5']=md5(\$k);
  \$ok=null;
  try{ @token_get_all(\$k, TOKEN_PARSE); \$ok=true; \$o['lint']='OK'; }
  catch(\\ParseError \$e){ \$ok=false; \$o['lint']='ParseError: '.\$e->getMessage().' eil. '.\$e->getLine(); }
  \$o['sintakse_ok']=\$ok;
  if(\$ok){
    \$d=WPMU_PLUGIN_DIR.'/'.\$f;
    if(file_exists(\$d)){ \$b=WPMU_PLUGIN_DIR.'/.bak-'.\$f.'-'.date('Ymd-His'); @copy(\$d,\$b); \$o['backup']=basename(\$b); }
    file_put_contents(\$d,\$k); \$o['dest_md5']=md5_file(\$d); \$o['sutampa']=(\$o['dest_md5']===\$o['md5']);
    delete_transient('ps_kat_duomenys');
  }
  header('Content-Type: application/json; charset=utf-8'); echo wp_json_encode(\$o); exit;
}, 99);
`;
const s1=await wp('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP Rankos Deploy v1',code:phpDep,scope:'global',active:true,priority:5})});
const j1=js(s1.text); out.snip=j1&&j1.id?j1.id:s1.text.slice(0,150);
await new Promise(r=>setTimeout(r,4000));
for (const f of ['petshop-rankos.php','petshop-katalogas.php']) {
  try{
    const gg=await fetch('https://api.github.com/repos/'+REPO+'/contents/deploy/'+f+'.b64?ref=0bbbbd73c49750c930babe7b8850dcdd2b108554',{headers:{'Authorization':'Bearer '+TOK}});
    const gj=await gg.json();
    const raw=Buffer.from(gj.content||'','base64').toString('utf8').trim();
    fs.writeFileSync('/tmp/pl.txt','turinys='+encodeURIComponent(raw));
    const res=execSync('curl -sk -X POST "'+B+'/?ps_dep=Kp5tW7&f='+f+'" --data @/tmp/pl.txt --max-time 180',{encoding:'utf8',maxBuffer:20*1024*1024});
    out['dep_'+f]=js(res)||res.slice(0,300);
  }catch(e){ out['dep_'+f]='ERR '+String(e).slice(0,200); }
}
/* TESTAS: ar vartai realiai stabdo automatika */
const phpT = `
add_action('init', function(){
  if ( ( \$_GET['ps_test'] ?? '' ) !== 'Rk8tT1' ) return;
  @set_time_limit(180);
  \$o=array('marker'=>'RANKOS TESTAS');
  \$pid=25319;
  \$o['modulis']=class_exists('Petshop_Rankos');
  /* 1. imituojam ZMOGAUS isemima */
  \$adm=get_users(array('role'=>'administrator','number'=>1));
  wp_set_current_user(\$adm ? \$adm[0]->ID : 0);
  wp_update_post(array('ID'=>\$pid,'post_status'=>'draft'));
  \$o['po_isemimo']=array('busena'=>get_post_status(\$pid),'zyme'=>get_post_meta(\$pid,'_ps_ranka_isimta',true),
     'kada'=>get_post_meta(\$pid,'_ps_ranka_isimta_kada',true),'kas'=>get_post_meta(\$pid,'_ps_ranka_isimta_kas',true));
  /* 2. imituojam AUTOMATIKA (cron be naudotojo) */
  wp_set_current_user(0);
  if(!defined('DOING_CRON')) define('DOING_CRON', true);
  wp_update_post(array('ID'=>\$pid,'post_status'=>'publish'));
  clean_post_cache(\$pid);
  \$o['po_automatikos']=get_post_status(\$pid);
  \$o['vartai_veikia']=(get_post_status(\$pid)==='draft');
  header('Content-Type: application/json; charset=utf-8'); echo wp_json_encode(\$o, JSON_UNESCAPED_UNICODE); exit;
}, 5);
`;
const s2=await wp('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP Rankos Testas v1',code:phpT,scope:'global',active:true,priority:6})});
const j2=js(s2.text);
await new Promise(r=>setTimeout(r,4000));
try{
  const res=execSync('curl -sk "'+B+'/?ps_test=Rk8tT1" --max-time 120',{encoding:'utf8',maxBuffer:20*1024*1024});
  out.testas=js(res)||res.slice(0,600);
}catch(e){ out.test_err=String(e).slice(0,300); }
for (const j of [j1,j2]) { if(j&&j.id) await wp('/wp-json/code-snippets/v1/snippets/'+j.id,{method:'DELETE'}); }
const body={message:'res rankos',content:Buffer.from(JSON.stringify(out,null,1)).toString('base64')};
const g=await fetch('https://api.github.com/repos/'+REPO+'/contents/screenshots/rankos.json',{headers:{'Authorization':'Bearer '+TOK}});
if(g.status===200){ body.sha=(await g.json()).sha; }
await fetch('https://api.github.com/repos/'+REPO+'/contents/screenshots/rankos.json',{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json'},body:JSON.stringify(body)});
console.log(JSON.stringify(out).slice(0,1200));
