process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import fs from 'fs';
import { execSync } from 'child_process';
const B='https://dev.avesa.lt';
const U=process.env.WP_USER,P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='Basic '+Buffer.from(U+':'+P).toString('base64');
const TOK=process.env.GH_TOKEN||'', REPO=process.env.GH_REPO||'';
fs.mkdirSync('screenshots',{recursive:true});
const out={marker:'APPLY 20 v5', ts:new Date().toISOString()};
async function wp(p,o={}){try{const r=await fetch(B+p,{...o,headers:{'Authorization':AUTH,'Content-Type':'application/json',...(o.headers||{})}});return{status:r.status,text:await r.text()}}catch(e){return{status:0,text:String(e)}}}
function js(t){const i=Math.min(...['[','{'].map(c=>{const x=t.indexOf(c);return x<0?1e9:x}));try{return JSON.parse(t.slice(i))}catch(e){return null}}
const b64=execSync('curl -s "https://raw.githubusercontent.com/'+REPO+'/main/deploy/probe.php.b64"',{encoding:'utf8'}).trim();
const php=Buffer.from(b64,'base64').toString('utf8');
await wp('/wp-json/code-snippets/v1/snippets/2868',{method:'POST',body:JSON.stringify({id:2868,name:'PS Masinis Sudeliojimas v5',code:php,scope:'global',active:true})});
await new Promise(r=>setTimeout(r,4500));
try{
  const raw=execSync('curl -sk "'+B+'/?ps_ms=Ms8tD3&rezimas=apply&grupe=saugu&riba=20" --max-time 400',{encoding:'utf8',maxBuffer:60*1024*1024});
  out.apply=js(raw); if(!out.apply) out.raw=raw.slice(0,900);
}catch(e){ out.err=String(e).slice(0,250); }
const body={message:'res apply5',content:Buffer.from(JSON.stringify(out,null,1)).toString('base64')};
const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/apply5.json`,{headers:{'Authorization':'Bearer '+TOK}});
if(g.status===200){ body.sha=(await g.json()).sha; }
await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/apply5.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json'},body:JSON.stringify(body)});
console.log('ok');
