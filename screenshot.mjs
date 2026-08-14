process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const IDS='20327,21220,21223,21256,21262,21878,21884,21890,21893,21899,21905,22302,22421,22935,23796,23807,23825,23834,23837,23846,23849,23852,23855,24492,25340,26461'.split(',');
const out={};
for(let i=0;i<IDS.length;i+=10){
  const dalis=IDS.slice(i,i+10).join(',');
  const r=await fetch('https://dev.avesa.lt/wp-json/wc/v3/products?include='+dalis+'&per_page=10&_fields=id,short_description,description',{headers:{Authorization:AUTH}});
  if(r.status!==200){ out['err_'+i]=r.status; continue; }
  for(const p of await r.json()){
    out[p.id]={s:(p.short_description||'').slice(0,4000), d:(p.description||'').slice(0,4000)};
  }
}
let sha=null;
try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/apr.json`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
const body={message:'apr',content:Buffer.from(JSON.stringify(out)).toString('base64')}; if(sha) body.sha=sha;
const p=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/apr.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(body)});
console.log('put',p.status,Object.keys(out).length);
