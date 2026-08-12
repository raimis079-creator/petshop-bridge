process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import fs from 'fs';
const B='https://dev.avesa.lt';
const U=process.env.WP_USER,P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='Basic '+Buffer.from(U+':'+P).toString('base64');
const TOK=process.env.GH_TOKEN||'', REPO=process.env.GH_REPO||'';
fs.mkdirSync('screenshots',{recursive:true});
const out={marker:'VALYMAS 2', ts:new Date().toISOString()};
async function wp(p,o={}){try{const r=await fetch(B+p,{...o,headers:{'Authorization':AUTH,'Content-Type':'application/json',...(o.headers||{})}});return{status:r.status,text:await r.text()}}catch(e){return{status:0,text:String(e)}}}
function js(t){const i=Math.min(...['[','{'].map(c=>{const x=t.indexOf(c);return x<0?1e9:x}));try{return JSON.parse(t.slice(i))}catch(e){return null}}
const u=await wp('/wp-json/wc/v3/products/19902',{method:'PUT',body:JSON.stringify({short_description:''})});
out.put_status=u.status;
const v=await wp('/wp-json/wc/v3/products/19902?_fields=id,short_description,description');
const j=js(v.text);
out.po = j ? {id:j.id, trumpas:JSON.stringify(j.short_description), apr_ilgis:(j.description||'').length} : String(v.text).slice(0,200);
const body={message:'res valymas2',content:Buffer.from(JSON.stringify(out,null,1)).toString('base64')};
const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/valymas2.json`,{headers:{'Authorization':'Bearer '+TOK}});
if(g.status===200){ body.sha=(await g.json()).sha; }
await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/valymas2.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json'},body:JSON.stringify(body)});
console.log(JSON.stringify(out));
