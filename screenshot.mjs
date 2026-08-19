process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const out={versija:'H109'};
async function put(path,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
async function api(p,o={}){ try{const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()};}catch(e){return {s:0,t:String(e).slice(0,200)};} }
try{
  const ls=await api('/wp-json/code-snippets/v1/snippets');
  let sar=[]; try{sar=JSON.parse(ls.t);}catch(e){}
  const s=(Array.isArray(sar)?sar:[]).find(x=>String(x.name||'').startsWith('SEO Auto H1'));
  if(!s){ out.klaida='snippetas nerastas'; }
  else{
    out.snip={id:s.id, name:s.name, active:s.active, scope:s.scope, ilgis:(s.code||'').length};
    const eil=(s.code||'').split('\n');
    out.eilutes_su_adresais=[];
    eil.forEach((l,i)=>{ if(l.includes('/cart/')||l.includes('/checkout/')) out.eilutes_su_adresais.push((i+1)+': '+l.trim().slice(0,200)); });
    out.kodo_pradzia=eil.slice(0,14).map((l,i)=>(i+1)+': '+l.trim().slice(0,150));
    const c=(s.code||'');
    out.ar_naudoja_ID = /is_cart\(\)|is_checkout\(\)|wc_get_page_id|get_option\(\s*['"]woocommerce_(cart|checkout)_page_id/.test(c) ? 'TAIP (atsparu slug keitimui)' : 'ne';
  }
}catch(e){ out.klaida=String(e).slice(0,300); }
await put('screenshots/h109.json', Buffer.from(JSON.stringify(out,null,1)), 'h109 SEO Auto H1 snippeto perziura');
