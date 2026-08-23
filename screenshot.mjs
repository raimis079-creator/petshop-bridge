process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCFpc3NldCgkX0dFVFsncHNfcmVjOCddKSB8fCAkX0dFVFsncHNfcmVjOCddIT09J1JVTicpIHJldHVybjsKIGdsb2JhbCAkd3BkYjsgJFQ9YXJyYXkoJ3YnPT4nUkVDOCcpOwogJG89d2NfZ2V0X29yZGVyKDM1MDY2KTsKICRUWydtZXRhJ109YXJyYXkoKTsKIGZvcmVhY2goJG8tPmdldF9tZXRhX2RhdGEoKSBhcyAkbSl7ICRkPSRtLT5nZXRfZGF0YSgpOyBpZihzdHJwb3MoJGRbJ2tleSddLCdfcHMnKT09PTB8fHN0cnBvcygkZFsna2V5J10sJ19vcmQnKT09PTApICRUWydtZXRhJ11bJGRbJ2tleSddXT1pc19zY2FsYXIoJGRbJ3ZhbHVlJ10pPyRkWyd2YWx1ZSddOmpzb25fZW5jb2RlKCRkWyd2YWx1ZSddKTsgfQogJFRbJ3Bhc3RhYm9zJ109YXJyYXkoKTsKIGZvcmVhY2god2NfZ2V0X29yZGVyX25vdGVzKGFycmF5KCdvcmRlcl9pZCc9PjM1MDY2LCdsaW1pdCc9PjIwKSkgYXMgJG4peyAkVFsncGFzdGFib3MnXVtdPSRuLT5kYXRlX2NyZWF0ZWQtPmRhdGUoJ0g6aScpLicgJy5tYl9zdWJzdHIoJG4tPmNvbnRlbnQsMCwxNDApOyB9CiBpZihjbGFzc19leGlzdHMoJ1BldHNob3BfQVZfVGlla2ltYXMnKSl7CiAgICRUWyd0aWVraW1hc19rbGFzZSddPTE7CiAgIGZvcmVhY2goJG8tPmdldF9pdGVtcygpIGFzICRpaWQ9PiRpdCl7CiAgICAgJGI9UGV0c2hvcF9BVl9UaWVraW1hczo6ZWlsdXRlc19idWtsZSgzNTA2NiwkaWlkKTsKICAgICAkVFsnZWlsdXRlcyddWyRpaWRdPWFycmF5KCdwaWQnPT4kaXQtPmdldF9wcm9kdWN0X2lkKCksJ3NyYyc9PiRpdC0+Z2V0X21ldGEoJ19wc19zb3VyY2UnKSwnYnVrbGUnPT4kYj8kYi0+YnVzZW5hOm51bGwsJ3BhcnRpamEnPT4kYj8kYi0+cGFydGlqYV9pZDpudWxsKTsKICAgfQogfQogJHQ9JHdwZGItPnByZWZpeC4ncHNfdGlla2ltYXNfZWlsJzsKICRUWydwc190aWVraW1hc19laWwnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCAqIEZST00gJHQgT1JERVIgQlkgaWQgREVTQyBMSU1JVCAxMCIsQVJSQVlfQSk7CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogZWNobyBqc29uX2VuY29kZSgkVCwgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0sNSk7Cg==';
const out={v:'REC8'};
const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){
  const u='https://api.github.com/repos/'+REPO+'/contents/'+path;
  const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha)b.sha=sha;
  return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status;
}
const A={Authorization:AUTH,'Content-Type':'application/json'};
const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
let sid=null;
try{
  const c=await fetch(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP Test Uzsakymai v11 (35066 tiekimas)',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; const ct=await c.text(); try{j=JSON.parse(ct);}catch(e){}
  out.sukurta=j&&j.id?j.id:{s:c.status,t:ct.slice(0,300)};
  if(j&&j.id){
    sid=j.id;
    await miegok(6000);
    const d=await fetch(WP+'/?ps_rec8=RUN');
    const raw=d.headers.getSetCookie?d.headers.getSetCookie():[];
    try{ out.R=JSON.parse(await d.text()); }catch(e){ out.R='ne-json'; }
    const cookies=[];
    for(const s of raw){ const p=s.split(';')[0]; const i=p.indexOf('='); const n=p.slice(0,i), v=p.slice(i+1); if(n) cookies.push({name:n,value:v,domain:'dev.avesa.lt',path:'/',secure:true,httpOnly:false}); }
    await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})});
    out.isjungta=sid;
  }
}catch(e){ out.klaida=String(e).slice(0,600);
  if(sid){ try{ await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(x){} } }
await put('screenshots/rec8.json', Buffer.from(JSON.stringify(out,null,1)), 'REC8');
