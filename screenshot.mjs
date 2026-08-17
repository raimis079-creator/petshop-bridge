process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmICgoaXNzZXQoJF9HRVRbJ3BzX3N2J10pPyRfR0VUWydwc19zdiddOicnKSE9PSdLQVQxJykgcmV0dXJuOwogQHNldF90aW1lX2xpbWl0KDMwMCk7CiBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCd2Jz0+J0tBVDEnLCd0cyc9PmRhdGUoJ1ktbS1kIEg6aTpzJykpOwogJGY9V1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1rYXRhbG9nYXMucGhwJzsKICRvWyd5cmEnXT1maWxlX2V4aXN0cygkZik7CiBpZighJG9bJ3lyYSddKXsgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7IH0KICRzPWZpbGVfZ2V0X2NvbnRlbnRzKCRmKTsKICRvWydkeWRpcyddPXN0cmxlbigkcyk7ICRvWydtZDUnXT1tZDUoJHMpOwogaWYgKHByZWdfbWF0Y2goJy9WZXJzaW9uOlxzKihbMC05Ll0rKS9pJywkcywkbSkpICRvWyd2ZXJzaWphJ109JG1bMV07CgogLyogZWlsdXRlcywga3VyIG1pbmltYSBwYWllc2thIC8gZmlsdHJ1IGlzc2F1Z29qaW1hcyAqLwogJEw9ZXhwbG9kZSgiXG4iLCRzKTsgJGhpdD1hcnJheSgpOwogZm9yZWFjaCgkTCBhcyAkaT0+JGxuKXsKICAgaWYgKHByZWdfbWF0Y2goJy91c2VyX21ldGF8dXBkYXRlX29wdGlvbnxnZXRfb3B0aW9ufFwkX0dFVFxbLihxfHBhaWVza2F8c2VhcmNofGZfcSkuXF18cHNfa2F0X3xmaWx0ci9pJywkbG4pKSB7CiAgICAgJHQ9dHJpbSgkbG4pOwogICAgIGlmICgkdCE9PScnICYmIHN0cmxlbigkdCk8MjIwKSAkaGl0W109YXJyYXkoJGkrMSwkdCk7CiAgIH0KIH0KICRvWydlaWx1Y2l1X3Jhc3RhJ109Y291bnQoJGhpdCk7CiAkb1snZWlsdXRlcyddPWFycmF5X3NsaWNlKCRoaXQsMCw3MCk7CgogLyoga29raWUgdXNlcl9tZXRhIC8gb3B0aW9uIHJha3RhaSByZWFsaWFpIG5hdWRvamFtaSAqLwogcHJlZ19tYXRjaF9hbGwoIi8oPzp1cGRhdGVfdXNlcl9tZXRhfGdldF91c2VyX21ldGEpXHMqXChbXixdKyxccyonKFteJ10rKScvIiwkcywkbTEpOwogJG9bJ3VzZXJfbWV0YV9yYWt0YWknXT1hcnJheV92YWx1ZXMoYXJyYXlfdW5pcXVlKCRtMVsxXSkpOwogcHJlZ19tYXRjaF9hbGwoIi8oPzp1cGRhdGVfb3B0aW9ufGdldF9vcHRpb24pXHMqXChccyonKFteJ10rKScvIiwkcywkbTIpOwogJG9bJ29wdGlvbl9yYWt0YWknXT1hcnJheV92YWx1ZXMoYXJyYXlfdW5pcXVlKCRtMlsxXSkpOwoKIC8qIGFyIERCIHRpa3JhaSBsYWlrbyBaWiBURVNUICovCiAkcm93cz0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCB1bWV0YV9pZCwgdXNlcl9pZCwgbWV0YV9rZXksIExFRlQobWV0YV92YWx1ZSwzMDApIHYgRlJPTSB7JFB9dXNlcm1ldGEKICAgV0hFUkUgbWV0YV92YWx1ZSBMSUtFICclWlogVEVTVCUnIE9SIChtZXRhX2tleSBMSUtFICcla2F0JScgQU5EIG1ldGFfdmFsdWUgTElLRSAnJVpaJScpIiwgQVJSQVlfQSk7CiAkb1sndXNlcm1ldGFfc3VfenonXT0kcm93czsKICRvcHQ9JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1Qgb3B0aW9uX25hbWUsIExFRlQob3B0aW9uX3ZhbHVlLDMwMCkgdiBGUk9NIHskUH1vcHRpb25zIFdIRVJFIG9wdGlvbl92YWx1ZSBMSUtFICclWlogVEVTVCUnIiwgQVJSQVlfQSk7CiAkb1snb3B0aW9uc19zdV96eiddPSRvcHQ7CgogJHdwZGItPnF1ZXJ5KCJVUERBVEUgeyRQfXNuaXBwZXRzIFNFVCBhY3RpdmU9MCBXSEVSRSBuYW1lIExJS0UgJ1RFTVAlJyIpOwogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0sIDEzMSk7Cg==';
const out={versija:'KAT1'};
async function put(name,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/${name}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/${name}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)});
}
async function api(p,o={}){ const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(n,b64){ const code=Buffer.from(b64,'base64').toString('utf8'); const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:n,code,scope:'global',active:true,priority:5})}); let j=null; try{j=JSON.parse(cr.t);}catch(e){} return j?j.id:null; }
async function off(id){ if(id) await api('/wp-json/code-snippets/v1/snippets/'+id,{method:'POST',body:JSON.stringify({id,active:false})}); }
try{
  const s=await snip('TEMP KAT1',B64);
  await new Promise(r=>setTimeout(r,6000));
  const t=await (await fetch(WP+'/?ps_sv=KAT1')).text();
  try{ out.rez=JSON.parse(t); }catch(e){ out.raw=t.slice(0,1500); }
  await off(s);
}catch(e){ out.klaida=String(e).slice(0,300); }
await put('kat1.json', Buffer.from(JSON.stringify(out)), 'kat1');
console.log('ok');
