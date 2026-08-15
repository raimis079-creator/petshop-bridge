process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const out={};
async function api(path,opt={}){ const r=await fetch(WP+path,{...opt,headers:{Authorization:AUTH,'Content-Type':'application/json',...(opt.headers||{})}}); return {s:r.status,t:await r.text()}; }
/* konkretus 547 */
try{ const r=await api('/wp-json/code-snippets/v1/snippets/547');
  out.s547 = r.s===200 ? (()=>{const j=JSON.parse(r.t); return {id:j.id,pav:j.name,aktyvus:j.active,ilgis:(j.code||'').length,
    kabliukas:(j.code||'').match(/add_action\(\s*['"]([a-z_]+)/i)?.[1]||'?',
    pradzia:(j.code||'').slice(0,260)};})() : {http:r.s, t:r.t.slice(0,160)};
}catch(e){ out.e547=String(e).slice(0,180); }
/* visi puslapiai */
try{
  let visi=[];
  for (let p=1;p<=6;p++){
    const r=await api('/wp-json/code-snippets/v1/snippets?per_page=100&page='+p);
    if(r.s!==200) break;
    const j=JSON.parse(r.t); if(!j.length) break;
    visi = visi.concat(j.map(s=>({id:s.id,pav:s.name,akt:s.active})));
    if(j.length<100) break;
  }
  out.viso = visi.length;
  out.rinkiniu_snippetai = visi.filter(s=>/rinkin|susid|kategor|juost|kviet|blok/i.test(s.pav));
  out.id_ruozas = { min: Math.min(...visi.map(s=>s.id)), max: Math.max(...visi.map(s=>s.id)) };
  out.aktyvus = visi.filter(s=>s.akt);
  out.apie547 = visi.filter(s=>s.id>=540 && s.id<=560);
}catch(e){ out.e_sar=String(e).slice(0,180); }
let sha=null;
try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/s547.json`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
const body={message:'rez',content:Buffer.from(JSON.stringify(out)).toString('base64')}; if(sha) body.sha=sha;
await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/s547.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(body)});
console.log('ok');
