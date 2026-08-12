process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import fs from 'fs';
import { execSync } from 'child_process';
const B='https://dev.avesa.lt';
const U=process.env.WP_USER,P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='Basic '+Buffer.from(U+':'+P).toString('base64');
const TOK=process.env.GH_TOKEN||'', REPO=process.env.GH_REPO||'';
fs.mkdirSync('screenshots',{recursive:true});
const out={marker:'V710', ts:new Date().toISOString()};
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
  try{ @token_get_all(\$k, TOKEN_PARSE); \$ok=true; }
  catch(\\ParseError \$e){ \$ok=false; \$o['lint']='ParseError: '.\$e->getMessage(); }
  \$o['sintakse_ok']=\$ok;
  if(\$ok){
    \$d=WPMU_PLUGIN_DIR.'/'.\$f;
    if(file_exists(\$d)){ @copy(\$d, WPMU_PLUGIN_DIR.'/.bak-'.\$f.'-'.date('Ymd-His')); }
    file_put_contents(\$d,\$k); \$o['sutampa']=(md5_file(\$d)===\$o['md5']);
    delete_transient('ps_kat_duomenys');
  }
  header('Content-Type: application/json; charset=utf-8'); echo wp_json_encode(\$o); exit;
}, 99);
`;
const s1=await wp('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP V710 Deploy',code:phpDep,scope:'global',active:true,priority:5})});
const j1=js(s1.text);
await new Promise(r=>setTimeout(r,4000));
try{
  const gg=await fetch('https://api.github.com/repos/'+REPO+'/contents/deploy/petshop-katalogas.php.b64?ref=1a433703b2c389a096addb86c7fd0405a47638c8',{headers:{'Authorization':'Bearer '+TOK}});
  const gj=await gg.json();
  const raw=Buffer.from(gj.content||'','base64').toString('utf8').trim();
  fs.writeFileSync('/tmp/pl.txt','turinys='+encodeURIComponent(raw));
  out.deploy=js(execSync('curl -sk -X POST "'+B+'/?ps_dep=Kp5tW7&f=petshop-katalogas.php" --data @/tmp/pl.txt --max-time 180',{encoding:'utf8',maxBuffer:20*1024*1024}));
}catch(e){ out.deploy_err=String(e).slice(0,200); }
/* patikra: Ambrosia prekes kortele */
const phpT = `
add_action('init', function(){
  if ( ( \$_GET['ps_t'] ?? '' ) !== 'Av9tZ1' ) return;
  \$o=array('v'=>Petshop_Katalogas::VERSIJA);
  foreach ( array(19715, 25319) as \$pid ) {
    ob_start(); Petshop_Katalogas::kortele(\$pid); \$h=ob_get_clean();
    preg_match('/Šaltiniai.*?<\\/table>/s', \$h, \$m);
    \$lent = \$m ? trim(preg_replace('/\\s+/', ' ', wp_strip_all_tags(\$m[0]))) : 'nerasta';
    preg_match('/kort-kodel">([^<]*)</', \$h, \$k);
    \$o['preke_'.\$pid]=array(
      'sand'=>get_post_meta(\$pid,'_ps_sandelis',true),
      'saltiniai'=>mb_substr(\$lent,0,220),
      'kodel'=>\$k? \$k[1] : '',
      'gavimo_laukai'=>substr_count(\$h,'kort-lik-gal'),
    );
  }
  header('Content-Type: application/json; charset=utf-8'); echo wp_json_encode(\$o,JSON_UNESCAPED_UNICODE); exit;
}, 1);
`;
const s2=await wp('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP V710 Testas',code:phpT,scope:'global',active:true,priority:5})});
const j2=js(s2.text);
await new Promise(r=>setTimeout(r,4000));
try{ out.testas=js(execSync('curl -sk "'+B+'/?ps_t=Av9tZ1" --max-time 120',{encoding:'utf8',maxBuffer:20*1024*1024})); }catch(e){ out.t_err='ERR'; }
for (const j of [j1,j2]) { if(j&&j.id) await wp('/wp-json/code-snippets/v1/snippets/'+j.id,{method:'DELETE'}); }
const body={message:'res v710',content:Buffer.from(JSON.stringify(out,null,1)).toString('base64')};
const g=await fetch('https://api.github.com/repos/'+REPO+'/contents/screenshots/v710.json',{headers:{'Authorization':'Bearer '+TOK}});
if(g.status===200){ body.sha=(await g.json()).sha; }
await fetch('https://api.github.com/repos/'+REPO+'/contents/screenshots/v710.json',{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json'},body:JSON.stringify(body)});
console.log('ok');
