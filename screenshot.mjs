process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import fs from 'fs';
const B='https://dev.avesa.lt';
const U=process.env.WP_USER,P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='Basic '+Buffer.from(U+':'+P).toString('base64');
const TOK=process.env.GH_TOKEN||'', REPO=process.env.GH_REPO||'';
fs.mkdirSync('screenshots',{recursive:true});
const out={marker:'SNIPPET 565', ts:new Date().toISOString()};
async function wp(p,o={}){try{const r=await fetch(B+p,{...o,headers:{'Authorization':AUTH,'Content-Type':'application/json',...(o.headers||{})}});return{status:r.status,text:await r.text()}}catch(e){return{status:0,text:String(e)}}}
function js(t){const i=Math.min(...['[','{'].map(c=>{const x=t.indexOf(c);return x<0?1e9:x}));try{return JSON.parse(t.slice(i))}catch(e){return null}}
const r=await wp('/wp-json/code-snippets/v1/snippets/565');
const j=js(r.text);
out.status=r.status;
if(j&&j.code){
  out.pavadinimas=j.name; out.aktyvus=j.active; out.ilgis=j.code.length;
  const body={message:'sn565',content:Buffer.from(j.code).toString('base64')};
  const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/sn565.php`,{headers:{'Authorization':'Bearer '+TOK}});
  if(g.status===200){ body.sha=(await g.json()).sha; }
  await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/sn565.php`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json'},body:JSON.stringify(body)});
} else { out.atsakymas=String(r.text).slice(0,400); }
const body={message:'res sn565',content:Buffer.from(JSON.stringify(out,null,1)).toString('base64')};
const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/sn565.json`,{headers:{'Authorization':'Bearer '+TOK}});
if(g.status===200){ body.sha=(await g.json()).sha; }
await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/sn565.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json'},body:JSON.stringify(body)});
console.log(JSON.stringify(out));
