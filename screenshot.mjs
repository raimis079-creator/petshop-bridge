process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import fs from 'fs';
const B='https://dev.avesa.lt';
const U=process.env.WP_USER,P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='Basic '+Buffer.from(U+':'+P).toString('base64');
const TOK=process.env.GH_TOKEN||'', REPO=process.env.GH_REPO||'';
fs.mkdirSync('screenshots',{recursive:true});
const out={marker:'TESTO VALYMAS', ts:new Date().toISOString()};
async function wp(p,o={}){try{const r=await fetch(B+p,{...o,headers:{'Authorization':AUTH,'Content-Type':'application/json',...(o.headers||{})}});return{status:r.status,text:await r.text()}}catch(e){return{status:0,text:String(e)}}}
function js(t){const i=Math.min(...['[','{'].map(c=>{const x=t.indexOf(c);return x<0?1e9:x}));try{return JSON.parse(t.slice(i))}catch(e){return null}}
const r=await wp('/wp-json/wc/v3/products?search=pliu%C5%A1inis%20m%C4%97lynasis%20banginis&per_page=5&_fields=id,name,short_description');
const j=js(r.text);
out.rasta = Array.isArray(j)? j.map(x=>({id:x.id,n:x.name,s:(x.short_description||'').slice(0,120)})) : String(r.text).slice(0,300);
if (Array.isArray(j)) {
  for (const x of j) {
    if ((x.short_description||'').indexOf('[TESTAS]')>=0) {
      const svarus=(x.short_description||'').replace(/\s*\[TESTAS\]/g,'').trim();
      const u=await wp('/wp-json/wc/v3/products/'+x.id,{method:'PUT',body:JSON.stringify({short_description:svarus})});
      out['isvalyta_'+x.id]={status:u.status, liko:(js(u.text)||{}).short_description};
    }
  }
}
const v=await wp('/wp-json/wc/v3/products?search=pliu%C5%A1inis%20m%C4%97lynasis%20banginis&per_page=5&_fields=id,short_description');
out.po_valymo = js(v.text);
const body={message:'res valymas',content:Buffer.from(JSON.stringify(out,null,1)).toString('base64')};
const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/valymas.json`,{headers:{'Authorization':'Bearer '+TOK}});
if(g.status===200){ body.sha=(await g.json()).sha; }
await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/valymas.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json'},body:JSON.stringify(body)});
console.log(JSON.stringify(out).slice(0,1200));
