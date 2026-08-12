process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import fs from 'fs';
import { execSync } from 'child_process';
const B='https://dev.avesa.lt';
const U=process.env.WP_USER,P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='Basic '+Buffer.from(U+':'+P).toString('base64');
const TOK=process.env.GH_TOKEN||'', REPO=process.env.GH_REPO||'';
fs.mkdirSync('screenshots',{recursive:true});
const out={marker:'V73', ts:new Date().toISOString()};
async function wp(p,o={}){try{const r=await fetch(B+p,{...o,headers:{'Authorization':AUTH,'Content-Type':'application/json',...(o.headers||{})}});return{status:r.status,text:await r.text()}}catch(e){return{status:0,text:String(e)}}}
function js(t){const i=Math.min(...['[','{'].map(c=>{const x=t.indexOf(c);return x<0?1e9:x}));try{return JSON.parse(t.slice(i))}catch(e){return null}}
const phpDep = `
add_action('wp_loaded', function(){
  if ( ( \$_GET['ps_dep'] ?? '' ) !== 'Kp5tW7' ) return;
  @set_time_limit(240);
  \$o=array('marker'=>'DEPLOY');
  \$f=basename( \$_GET['f'] ?? '' ); \$b64=\$_POST['turinys'] ?? '';
  if(!\$f||!\$b64){ \$o['err']='nera'; header('Content-Type: application/json'); echo wp_json_encode(\$o); exit; }
  \$k=base64_decode(\$b64); \$o['md5']=md5(\$k);
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
const s1=await wp('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP V73 Deploy',code:phpDep,scope:'global',active:true,priority:5})});
const j1=js(s1.text);
await new Promise(r=>setTimeout(r,4000));
try{
  const gg=await fetch('https://api.github.com/repos/'+REPO+'/contents/deploy/petshop-katalogas.php.b64?ref=6b6b294b7f5db2004754d713418607a99fa1e4c4',{headers:{'Authorization':'Bearer '+TOK}});
  const gj=await gg.json();
  const raw=Buffer.from(gj.content||'','base64').toString('utf8').trim();
  fs.writeFileSync('/tmp/pl.txt','turinys='+encodeURIComponent(raw));
  const res=execSync('curl -sk -X POST "'+B+'/?ps_dep=Kp5tW7&f=petshop-katalogas.php" --data @/tmp/pl.txt --max-time 180',{encoding:'utf8',maxBuffer:20*1024*1024});
  out.deploy=js(res)||res.slice(0,250);
}catch(e){ out.deploy_err=String(e).slice(0,250); }

/* TESTAS: partiju blokas + nauja partija Ambrosia prekei */
const phpT = `
add_action('init', function(){
  if ( ( \$_GET['ps_t'] ?? '' ) !== 'Pt7tN1' ) return;
  @set_time_limit(180);
  \$adm=get_users(array('role'=>'administrator','number'=>1)); wp_set_current_user(\$adm?\$adm[0]->ID:0);
  \$step=(string)(\$_GET['step'] ?? '1');
  if (\$step==='1') {
    \$o=array('v'=>Petshop_Katalogas::VERSIJA);
    foreach ( array(19715,16760,19902,25319) as \$pid ) {
      ob_start(); Petshop_Katalogas::kortele(\$pid); \$h=ob_get_clean();
      \$o['preke_'.\$pid]=array(
        'sand'=>get_post_meta(\$pid,'_ps_sandelis',true),
        'partiju_blokas'=>substr_count(\$h,'kort-part'),
        'nauja_partija'=>substr_count(\$h,'kpart-atverti'),
        'galiojimo_laukas'=>substr_count(\$h,'geriausia_iki'),
        'likutis'=>substr_count(\$h,'kort-lik-irasyti'),
      );
    }
    header('Content-Type: application/json; charset=utf-8'); echo wp_json_encode(\$o,JSON_UNESCAPED_UNICODE); exit;
  }
  \$_POST=array('id'=>19715,'kiekis'=>3,'geriausia_iki'=>'2027-03-31','savikaina'=>'','tiekejas'=>'TESTAS','nonce'=>wp_create_nonce('ps_kat'));
  \$_REQUEST=\$_POST;
  Petshop_Katalogas::ajax_partija_nauja();
}, 1);
`;
const s2=await wp('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP V73 Testas',code:phpT,scope:'global',active:true,priority:5})});
const j2=js(s2.text);
await new Promise(r=>setTimeout(r,4000));
for (const st of ['1','2','1']) {
  try{
    const res=execSync('curl -sk "'+B+'/?ps_t=Pt7tN1&step='+st+'" --max-time 120',{encoding:'utf8',maxBuffer:20*1024*1024});
    out['step'+st+'_'+(out['step'+st]?'b':'a')]=js(res)||res.slice(0,300);
  }catch(e){ out['step'+st]='ERR'; }
  await new Promise(r=>setTimeout(r,1200));
}
for (const j of [j1,j2]) { if(j&&j.id) await wp('/wp-json/code-snippets/v1/snippets/'+j.id,{method:'DELETE'}); }
const body={message:'res v73',content:Buffer.from(JSON.stringify(out,null,1)).toString('base64')};
const g=await fetch('https://api.github.com/repos/'+REPO+'/contents/screenshots/v73.json',{headers:{'Authorization':'Bearer '+TOK}});
if(g.status===200){ body.sha=(await g.json()).sha; }
await fetch('https://api.github.com/repos/'+REPO+'/contents/screenshots/v73.json',{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json'},body:JSON.stringify(body)});
console.log('ok');
