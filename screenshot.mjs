process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import fs from 'fs';
import { execSync } from 'child_process';
const B='https://dev.avesa.lt';
const U=process.env.WP_USER,P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='Basic '+Buffer.from(U+':'+P).toString('base64');
const TOK=process.env.GH_TOKEN||'', REPO=process.env.GH_REPO||'';
fs.mkdirSync('screenshots',{recursive:true});
const out={marker:'SERIMAS', ts:new Date().toISOString()};
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
const s1=await wp('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP Serimas Deploy2',code:phpDep,scope:'global',active:true,priority:5})});
const j1=js(s1.text);
await new Promise(r=>setTimeout(r,4000));
/* DRY: kiek Quattro prekiu turi serima tekste, bet ne sekcijoje */
const phpT = `
add_action('init', function(){
  if ( ( \$_GET['ps_t'] ?? '' ) !== 'Sr5tQ2' ) return;
  @set_time_limit(240);
  global \$wpdb; \$p=\$wpdb->prefix;
  \$o=array('v'=>Petshop_Gavimas::VERSIJA);
  \$ids=\$wpdb->get_col("SELECT ID FROM {\$p}posts WHERE post_type='product' AND post_status IN ('publish','draft') AND post_content LIKE '%erimo rekomendacij%' LIMIT 300");
  \$o['rasta']=count(\$ids);
  \$pvz=array();
  foreach (array_slice(\$ids,0,4) as \$pid) {
    \$t=get_post_field('post_content',\$pid);
    \$pl=preg_replace('~<\\s*(br|/p|/div|/li)\\s*/?>~i', "\n", \$t);
    \$pl=html_entity_decode(wp_strip_all_tags(\$pl), ENT_QUOTES, 'UTF-8');
    \$luk=Petshop_Katalogas::sekciju_lukesciai(wp_get_post_terms(\$pid,'product_cat',array('fields'=>'slugs')));
    \$info=null;
    \$r=Petshop_Gavimas::skaidyti(\$pl, array_keys(\$luk['sekcijos']), \$info);
    \$pvz[]=array('id'=>\$pid,'pav'=>mb_substr(get_the_title(\$pid),0,40),
      'sekcijos'=>array_keys(\$r),
      'serimas'=>isset(\$r['Šėrimo instrukcija']) ? mb_substr(\$r['Šėrimo instrukcija'],0,80) : 'NERA');
  }
  \$o['pavyzdziai']=\$pvz;
  header('Content-Type: application/json; charset=utf-8'); echo wp_json_encode(\$o,JSON_UNESCAPED_UNICODE); exit;
}, 1);
`;
const s2=await wp('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP Serimas Testas2',code:phpT,scope:'global',active:true,priority:5})});
const j2=js(s2.text);
await new Promise(r=>setTimeout(r,4000));
try{ out.testas=js(execSync('curl -sk "'+B+'/?ps_t=Sr5tQ2" --max-time 150',{encoding:'utf8',maxBuffer:20*1024*1024})); }catch(e){ out.t_err='ERR'; }
for (const j of [j1,j2]) { if(j&&j.id) await wp('/wp-json/code-snippets/v1/snippets/'+j.id,{method:'DELETE'}); }
const body={message:'res serimas',content:Buffer.from(JSON.stringify(out,null,1)).toString('base64')};
const g=await fetch('https://api.github.com/repos/'+REPO+'/contents/screenshots/serimas2.json',{headers:{'Authorization':'Bearer '+TOK}});
if(g.status===200){ body.sha=(await g.json()).sha; }
await fetch('https://api.github.com/repos/'+REPO+'/contents/screenshots/serimas2.json',{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json'},body:JSON.stringify(body)});
console.log('ok');
