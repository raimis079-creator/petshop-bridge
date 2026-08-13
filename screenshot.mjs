process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import fs from 'fs';
import { execSync } from 'child_process';
const B='https://dev.avesa.lt';
const U=process.env.WP_USER,P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='Basic '+Buffer.from(U+':'+P).toString('base64');
const TOK=process.env.GH_TOKEN||'', REPO=process.env.GH_REPO||'';
fs.mkdirSync('screenshots',{recursive:true});
const out={marker:'MASINIS DRY', ts:new Date().toISOString()};
async function wp(p,o={}){try{const r=await fetch(B+p,{...o,headers:{'Authorization':AUTH,'Content-Type':'application/json',...(o.headers||{})}});return{status:r.status,text:await r.text()}}catch(e){return{status:0,text:String(e)}}}
function js(t){const i=Math.min(...['[','{'].map(c=>{const x=t.indexOf(c);return x<0?1e9:x}));try{return JSON.parse(t.slice(i))}catch(e){return null}}
const phpDep = `
add_action('wp_loaded', function(){
  if ( ( \$_GET['ps_dep'] ?? '' ) !== 'Kp5tW7' ) return;
  @set_time_limit(240);
  \$o=array(); \$f=basename( \$_GET['f'] ?? '' ); \$b64=\$_POST['turinys'] ?? '';
  if(!\$f||!\$b64){ \$o['err']='nera'; header('Content-Type: application/json'); echo wp_json_encode(\$o); exit; }
  \$k=base64_decode(\$b64); \$o['md5']=md5(\$k);
  \$ok=null;
  try{ @token_get_all(\$k, TOKEN_PARSE); \$ok=true; }
  catch(\\ParseError \$e){ \$ok=false; \$o['lint']=\$e->getMessage(); }
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
const s1=await wp('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP Masinis Deploy',code:phpDep,scope:'global',active:true,priority:5})});
const j1=js(s1.text);
await new Promise(r=>setTimeout(r,4000));
try{
  const gg=await fetch('https://api.github.com/repos/'+REPO+'/contents/deploy/petshop-katalogas.php.b64?ref=719101c3a2158907fe207feb574b6de2e94ac256',{headers:{'Authorization':'Bearer '+TOK}});
  const gj=await gg.json();
  const raw=Buffer.from(gj.content||'','base64').toString('utf8').trim();
  fs.writeFileSync('/tmp/pl.txt','turinys='+encodeURIComponent(raw));
  out.deploy=js(execSync('curl -sk -X POST "'+B+'/?ps_dep=Kp5tW7&f=petshop-katalogas.php" --data @/tmp/pl.txt --max-time 180',{encoding:'utf8',maxBuffer:20*1024*1024}));
}catch(e){ out.deploy_err=String(e).slice(0,200); }
const b64=execSync('curl -s "https://raw.githubusercontent.com/'+REPO+'/main/deploy/probe.php.b64"',{encoding:'utf8'}).trim();
const php=Buffer.from(b64,'base64').toString('utf8');
const s2=await wp('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'PS Masinis Sudeliojimas v1 (DRY/APPLY)',code:php,scope:'global',active:true,priority:5})});
const j2=js(s2.text); out.snip_id=j2&&j2.id?j2.id:s2.text.slice(0,150);
await new Promise(r=>setTimeout(r,4000));
try{ out.dry=js(execSync('curl -sk "'+B+'/?ps_ms=Ms8tD3&rezimas=dry" --max-time 500',{encoding:'utf8',maxBuffer:60*1024*1024})); }catch(e){ out.err='ERR '+String(e).slice(0,200); }
if(j1&&j1.id) await wp('/wp-json/code-snippets/v1/snippets/'+j1.id,{method:'DELETE'});
/* masinio snippeto NETRINAM — reikes APPLY */
const d=out.dry||{};
const sar=d.sarasas||[]; delete d.sarasas;
out.santrauka=d;
out.pavyzdziai=sar.filter(x=>x.b==='PAGERINTU').slice(0,10);
out.nepavyko_pvz=sar.filter(x=>x.b==='NEPAVYKO').slice(0,10);
fs.writeFileSync('screenshots/masinis_sarasas.json', JSON.stringify(sar,null,1));
try{ const body={message:'sar',content:fs.readFileSync('screenshots/masinis_sarasas.json').toString('base64')};
  const g=await fetch('https://api.github.com/repos/'+REPO+'/contents/screenshots/masinis_sarasas.json',{headers:{'Authorization':'Bearer '+TOK}});
  if(g.status===200){ body.sha=(await g.json()).sha; }
  await fetch('https://api.github.com/repos/'+REPO+'/contents/screenshots/masinis_sarasas.json',{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json'},body:JSON.stringify(body)});
}catch(e){}
const body={message:'res masinis',content:Buffer.from(JSON.stringify(out,null,1)).toString('base64')};
const g=await fetch('https://api.github.com/repos/'+REPO+'/contents/screenshots/masinis.json',{headers:{'Authorization':'Bearer '+TOK}});
if(g.status===200){ body.sha=(await g.json()).sha; }
await fetch('https://api.github.com/repos/'+REPO+'/contents/screenshots/masinis.json',{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json'},body:JSON.stringify(body)});
console.log('ok');
