process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfcjIyMiddKSA/ICRfR0VUWydwc19yMjIyJ10gOiAnJykgIT09ICdHTycpIHJldHVybjsKICRvID0gYXJyYXkoJ3YnPT4nUjIyMicpOwogJGYgPSBXUF9QTFVHSU5fRElSLicvcGV0c2hvcC14bWwvcGV0c2hvcC14bWwucGhwJzsKIGlmKCFmaWxlX2V4aXN0cygkZikpewogICAkbXUgPSBkZWZpbmVkKCdXUE1VX1BMVUdJTl9ESVInKT9XUE1VX1BMVUdJTl9ESVI6V1BfQ09OVEVOVF9ESVIuJy9tdS1wbHVnaW5zJzsKICAgJGYgPSAkbXUuJy9wZXRzaG9wLXhtbC5waHAnOwogfQogJG9bJ2ZhaWxhcyddID0gYXJyYXkoJ2tlbGlhcyc9PiRmLCd5cmEnPT5maWxlX2V4aXN0cygkZiksJ2R5ZGlzJz0+QGZpbGVzaXplKCRmKSwnbWQ1Jz0+QG1kNV9maWxlKCRmKSk7CiAkZWlsID0gQGZpbGUoJGYpOwogaWYoJGVpbCl7CiAgICRvWyd2aXNvX2VpbHVjaXUnXSA9IGNvdW50KCRlaWwpOwogICAkb1sna29udGVrc3RhcyddID0gYXJyYXkoKTsKICAgZm9yZWFjaChyYW5nZSgzMTUsIDM3NSkgYXMgJG4pewogICAgIGlmKGlzc2V0KCRlaWxbJG4tMV0pKSAkb1sna29udGVrc3RhcyddWyRuXSA9IHJ0cmltKCRlaWxbJG4tMV0pOwogICB9CiB9CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogZWNobyB3cF9qc29uX2VuY29kZSgkbywgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTKTsgZXhpdDsKfSwgMTMxKTsK';
const out={versija:'R222'};
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
  const kunas=JSON.stringify({name:'ZZ R222 XML eilutes',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5});
  const c=await fetch(SNIP,{method:'POST',headers:A,body:kunas});
  let j=null; const ct=await c.text(); try{j=JSON.parse(ct);}catch(e){}
  out.sukurta=j&&j.id?j.id:{s:c.status,t:ct.slice(0,200)};
  if(j&&j.id){
    await miegok(6000);
    const rr=await fetch(WP+'/?ps_r222=GO'); const tt=await rr.text();
    try{ out.DUOM=JSON.parse(tt); }catch(e){ out.zalias=tt.slice(0,400); }
    await fetch(SNIP+'/'+j.id,{method:'POST',headers:A,body:JSON.stringify({id:j.id,active:false})});
  }
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('screenshots/r222.json', Buffer.from(JSON.stringify(out,null,1)), 'r222 xml eilutes');
