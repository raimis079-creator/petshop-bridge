process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCFpc3NldCgkX0dFVFsncHNfcmVjMTEnXSkgfHwgJF9HRVRbJ3BzX3JlYzExJ10hPT0nUlVOJykgcmV0dXJuOwogJFQ9YXJyYXkoJ3YnPT4nUkVDMTEnKTsKICRyZz1uZXcgUmVmbGVjdGlvbk1ldGhvZCgnUGV0c2hvcF9BVl9Ecm9wc2hpcCcsJ2dydXB1b3RpJyk7ICRyZy0+c2V0QWNjZXNzaWJsZSh0cnVlKTsKICRvPXdjX2dldF9vcmRlcigzNTA2Nik7CiAkVFsncHJpZXMnXT1hcnJheV9rZXlzKCRyZy0+aW52b2tlKG51bGwsYXJyYXkoMzUwNjYpKSk7CiAkby0+dXBkYXRlX21ldGFfZGF0YSgnX3BzX2Ryb3BzaGlwX3NlbnQnLCcyMDI2LTA4LTIzIDEyOjAwOjAwJyk7CiAkby0+dXBkYXRlX21ldGFfZGF0YSgnX3BzX2Ryb3BzaGlwX3RvJywndmYnKTsKICRvLT5zYXZlKCk7CiAkVFsncG9fdmZfcGVyZGF2aW1vJ109YXJyYXlfa2V5cygkcmctPmludm9rZShudWxsLGFycmF5KDM1MDY2KSkpOwogJFRbJ3ByaW5zX3ByYXJhc3RhcyddPShpbl9hcnJheSgncHJpbnMnLCRUWydwcmllcyddLHRydWUpICYmICFpbl9hcnJheSgncHJpbnMnLCRUWydwb192Zl9wZXJkYXZpbW8nXSx0cnVlKSk7CiAkbz13Y19nZXRfb3JkZXIoMzUwNjYpOwogJG8tPmRlbGV0ZV9tZXRhX2RhdGEoJ19wc19kcm9wc2hpcF9zZW50Jyk7ICRvLT5kZWxldGVfbWV0YV9kYXRhKCdfcHNfZHJvcHNoaXBfdG8nKTsgJG8tPnNhdmUoKTsKICRUWydhdHN0YXR5dGEnXT1hcnJheV9rZXlzKCRyZy0+aW52b2tlKG51bGwsYXJyYXkoMzUwNjYpKSk7CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogZWNobyBqc29uX2VuY29kZSgkVCwgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0sNSk7Cg==';
const out={v:'REC11'};
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
  const c=await fetch(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP Patikra H233 v4 (dropship_sent per uzsakyma)',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; const ct=await c.text(); try{j=JSON.parse(ct);}catch(e){}
  out.sukurta=j&&j.id?j.id:{s:c.status,t:ct.slice(0,300)};
  if(j&&j.id){
    sid=j.id;
    await miegok(6000);
    const d=await fetch(WP+'/?ps_rec11=RUN');
    const raw=d.headers.getSetCookie?d.headers.getSetCookie():[];
    try{ out.R=JSON.parse(await d.text()); }catch(e){ out.R='ne-json'; }
    const cookies=[];
    for(const s of raw){ const p=s.split(';')[0]; const i=p.indexOf('='); const n=p.slice(0,i), v=p.slice(i+1); if(n) cookies.push({name:n,value:v,domain:'dev.avesa.lt',path:'/',secure:true,httpOnly:false}); }
    await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})});
    out.isjungta=sid;
  }
}catch(e){ out.klaida=String(e).slice(0,600);
  if(sid){ try{ await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(x){} } }
await put('screenshots/rec11.json', Buffer.from(JSON.stringify(out,null,1)), 'REC11');
