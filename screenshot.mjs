process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import fs from 'fs';
import { execSync } from 'child_process';
const B='https://dev.avesa.lt';
const U=process.env.WP_USER,P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='Basic '+Buffer.from(U+':'+P).toString('base64');
const TOK=process.env.GH_TOKEN||'', REPO=process.env.GH_REPO||'';
fs.mkdirSync('screenshots',{recursive:true});
const out={marker:'KLAIDOS DUMP v1', ts:new Date().toISOString()};

async function wp(p,o={}){try{const r=await fetch(B+p,{...o,headers:{'Authorization':AUTH,'Content-Type':'application/json',...(o.headers||{})}});return{status:r.status,text:await r.text()}}catch(e){return{status:0,text:String(e)}}}
function js(t){const i=Math.min(...['[','{'].map(c=>{const x=t.indexOf(c);return x<0?1e9:x}));try{return JSON.parse(t.slice(i))}catch(e){return null}}
async function putResult(name,obj){
  const path='screenshots/'+name;
  const body={message:'res '+name,content:Buffer.from(JSON.stringify(obj,null,1)).toString('base64')};
  try{
    const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK}});
    if(g.status===200){ const j=await g.json(); body.sha=j.sha; }
  }catch(e){}
  const r=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json'},body:JSON.stringify(body)});
  return r.status;
}

/* ---- TEMP recon snippet ---- */
const php = `
add_action('init', function(){
  if ( ( $_GET['ps_dump'] ?? '' ) !== 'Dm9xR4' ) return;
  @set_time_limit(180);
  $f = $_GET['f'] ?? '';
  $p = WPMU_PLUGIN_DIR.'/'.basename($f);
  if ( ! file_exists($p) ) { header('Content-Type: application/json'); echo wp_json_encode(array('err'=>'nera','p'=>$p)); exit; }
  $t = file_get_contents($p);
  header('Content-Type: application/json; charset=utf-8');
  echo wp_json_encode(array('f'=>basename($f),'bytes'=>strlen($t),'md5'=>md5($t),'b64'=>base64_encode($t)));
  exit;
}, 1);
`;

const s1=await wp('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP Klaidos Dump v1',code:php,scope:'global',active:true,priority:5})});
const j1=js(s1.text); out.snip=j1&&j1.id?j1.id:s1.text.slice(0,200);
await new Promise(r=>setTimeout(r,4000));

for (const f of ['petshop-gavimas.php','petshop-katalogas.php']) {
  try{
    const res=execSync(`curl -sk "${B}/?ps_dump=Dm9xR4&f=${f}" --max-time 120`,{encoding:'utf8',maxBuffer:60*1024*1024});
    const j=js(res);
    if (j && j.b64) {
      fs.writeFileSync('screenshots/'+f+'.b64', j.b64);
      out[f]={bytes:j.bytes, md5:j.md5};
      const body={message:'dump '+f, content:Buffer.from(j.b64).toString('base64')};
      const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/${f}.b64`,{headers:{'Authorization':'Bearer '+TOK}});
      if(g.status===200){ body.sha=(await g.json()).sha; }
      const r=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/${f}.b64`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json'},body:JSON.stringify(body)});
      out[f].put=r.status;
    } else { out[f]=res.slice(0,300); }
  }catch(e){ out[f]='ERR '+String(e).slice(0,200); }
}

if (j1 && j1.id) { await wp('/wp-json/code-snippets/v1/snippets/'+j1.id,{method:'DELETE'}); }
out.put = await putResult('klaidos_dump.json', out);
console.log(JSON.stringify(out).slice(0,2000));
