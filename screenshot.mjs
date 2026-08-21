process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICRyID0gaXNzZXQoJF9HRVRbJ3BzX3IyMjYnXSkgPyAkX0dFVFsncHNfcjIyNiddIDogJyc7CiBpZigkciAhPT0gJ0dPJykgcmV0dXJuOwogJG8gPSBhcnJheSgndic9PidSMjI2Jyk7CiAkb3JpZ2luYWxvX21kNSA9ICc0MjY0OThlNDU5OWRjNjA1Y2I1YTM5MzFmZmJlZTJhZSc7CiAkZiA9IFdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLXhtbC9wZXRzaG9wLXhtbC5waHAnOwogJGJkaXIgPSBXUF9DT05URU5UX0RJUi4nL3VwbG9hZHMvcHMtYmFja3Vwcyc7CgogJG9bJ2RhYmFyX21kNSddID0gQG1kNV9maWxlKCRmKTsKICRrb3Bpam9zID0gZ2xvYigkYmRpci4nL3BldHNob3AteG1sLiouYmFrLnBocCcpOwogJG9bJ2tvcGlqb3MnXSA9IGFycmF5KCk7CiAkdGlua2FtYSA9ICcnOwogZm9yZWFjaCgoYXJyYXkpJGtvcGlqb3MgYXMgJGspewogICAkbSA9IG1kNV9maWxlKCRrKTsKICAgJG9bJ2tvcGlqb3MnXVtiYXNlbmFtZSgkayldID0gJG07CiAgIGlmKCRtID09PSAkb3JpZ2luYWxvX21kNSkgJHRpbmthbWEgPSAkazsgICAvKiBpbWFtIFRBLCBrdXJpb3MgbWQ1ID0gb3JpZ2luYWxhcyAqLwogfQogJG9bJ3RpbmthbWEnXSA9ICR0aW5rYW1hID8gYmFzZW5hbWUoJHRpbmthbWEpIDogJ05FUkFTVEEnOwoKIGlmKCR0aW5rYW1hKXsKICAgJGtvZGFzID0gZmlsZV9nZXRfY29udGVudHMoJHRpbmthbWEpOwogICAkdCA9IEB0b2tlbl9nZXRfYWxsKCRrb2RhcywgVE9LRU5fUEFSU0UpOwogICAkb1snc2ludGFrc2UnXSA9IGlzX2FycmF5KCR0KSA/ICdPSycgOiAnS0xBSURBJzsKICAgaWYoaXNfYXJyYXkoJHQpICYmIG1kNSgka29kYXMpID09PSAkb3JpZ2luYWxvX21kNSl7CiAgICAgJG9bJ2lyYXN5dGEnXSA9IGZpbGVfcHV0X2NvbnRlbnRzKCRmLCAka29kYXMpICE9PSBmYWxzZSA/ICdPSycgOiAnTkUnOwogICAgIGNsZWFyc3RhdGNhY2hlKCk7CiAgICAgJG9bJ3BvX21kNSddID0gbWQ1X2ZpbGUoJGYpOwogICAgICRvWydhdHN0YXR5dGEnXSA9ICgkb1sncG9fbWQ1J10gPT09ICRvcmlnaW5hbG9fbWQ1KSA/ICdUQUlQJyA6ICdORSc7CiAgICAgJG9bJ2Z1bmtjaWphX2xpa28nXSA9IGZ1bmN0aW9uX2V4aXN0cygncGV0c2hvcF94bWxfdGVrc3RhcycpID8gJ3Npb2plIHV6a2xhdXNvamUgZGFyIHlyYSAoc2VuYXMga29kYXMgamF1IGlyYXN5dGFzKScgOiAnbmUnOwogICB9CiB9CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogZWNobyB3cF9qc29uX2VuY29kZSgkbywgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTKTsgZXhpdDsKfSwgMTMxKTsK';
const out={versija:'R226'};
const miegok=(ms)=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
const A={Authorization:AUTH,'Content-Type':'application/json'};
const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
try{
  const kunas=JSON.stringify({name:'ZZ R226 XML eilutes',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5});
  const c=await fetch(SNIP,{method:'POST',headers:A,body:kunas});
  let j=null; const ct=await c.text(); try{j=JSON.parse(ct);}catch(e){}
  out.sukurta=j&&j.id?j.id:{s:c.status,t:ct.slice(0,200)};
  if(j&&j.id){
    await miegok(6000);
    const rr=await fetch(WP+'/?ps_r226=GO'); const tt=await rr.text();
    try{ out.DEPLOY=JSON.parse(tt); }catch(e){ out.zalias=tt.slice(0,400); }
    await miegok(3000);
    for(const [v,k] of [['pradzia','/'],['parduotuve','/parduotuve/']]){
      const q=await fetch(WP+k); const h=await q.text();
      out[v]={s:q.status, fatal:/Fatal error|Parse error/i.test(h)?'TAIP':'ne'};
    }
    await fetch(SNIP+'/'+j.id,{method:'POST',headers:A,body:JSON.stringify({id:j.id,active:false})});
  }
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('screenshots/r226.json', Buffer.from(JSON.stringify(out,null,1)), 'r226 xml eilutes');
