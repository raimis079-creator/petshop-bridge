process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const out={};
try{
  const r=await fetch(WP+'/product/test-konservu-deze-800-be-vistienos/',{headers:{Authorization:AUTH}});
  out.http=r.status;
  const t=await r.text();
  out.ilgis=t.length;
  out.fatal=(t.match(/Fatal error[^<]{0,220}/)||[null])[0];
  out.warning=(t.match(/Warning:[^<]{0,180}/)||[null])[0];
  out.parse=(t.match(/Parse error[^<]{0,220}/)||[null])[0];
  out.tk_pr = t.indexOf('pslk-tk-pr')>0;
  out.tk_dov = t.indexOf('pslk-tk-dov')>0;
  out.sena_juosta = t.indexOf('pslk-juosta')>0;
  out.versija_html = (t.match(/v1\.\d\d/)||[null])[0];
}catch(e){ out.err=String(e).slice(0,200); }
let sha=null;
try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/probe125.json`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
const body={message:'rez',content:Buffer.from(JSON.stringify(out)).toString('base64')}; if(sha) body.sha=sha;
await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/probe125.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(body)});
console.log('ok');
