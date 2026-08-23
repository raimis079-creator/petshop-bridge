process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCFpc3NldCgkX0dFVFsncHNfcmVjMTMnXSkgfHwgJF9HRVRbJ3BzX3JlYzEzJ10hPT0nUlVOJykgcmV0dXJuOwogZ2xvYmFsICR3cGRiOyAkVD1hcnJheSgndic9PidSRUMxMycpOwogaWYoZnVuY3Rpb25fZXhpc3RzKCd2ZW5pcGFrX2ZldGNoX3BpY2t1cHMnKSl7CiAgIGZvcmVhY2godmVuaXBha19mZXRjaF9waWNrdXBzKCdMVCcpIGFzICRwKXsKICAgICBpZihtYl9zdHJpcG9zKCRwWydjaXR5J10sJ05lbWVuJykhPT1mYWxzZSB8fCBtYl9zdHJpcG9zKCRwWydhZGRyZXNzJ10sJ8WgdmVuxI1pb25pxbMnKSE9PWZhbHNlIHx8IG1iX3N0cmlwb3MoJHBbJ25hbWUnXSwnTmVtZW4nKSE9PWZhbHNlKXsKICAgICAgICRUWyduZW1lbmNpbmUnXVtdPWFycmF5KCdpZCc9PiRwWydpZCddLCdjb2RlJz0+JHBbJ2NvZGUnXSwnbmFtZSc9PiRwWyduYW1lJ10sJ2Rpc3BsYXknPT4kcFsnZGlzcGxheV9uYW1lJ10sCiAgICAgICAgICdjaXR5Jz0+JHBbJ2NpdHknXSwnYWRkcmVzcyc9PiRwWydhZGRyZXNzJ10sJ3ppcCc9PiRwWyd6aXAnXSwndHlwZSc9PiRwWyd0eXBlJ10sJ3NpemUnPT4kcFsnc2l6ZV9saW1pdCddLAogICAgICAgICAnbWF4Jz0+YXJyYXkoJHBbJ21heF9sZW5ndGgnXSwkcFsnbWF4X3dpZHRoJ10sJHBbJ21heF9oZWlnaHQnXSkpOwogICAgIH0KICAgfQogfQogJFRbJ3NpdW50b3Nfa2xhc2UnXT1jbGFzc19leGlzdHMoJ1BldHNob3BfU2l1bnRvcycpOwogaWYoY2xhc3NfZXhpc3RzKCdQZXRzaG9wX1NpdW50b3MnKSl7CiAgICRyYz1uZXcgUmVmbGVjdGlvbkNsYXNzKCdQZXRzaG9wX1NpdW50b3MnKTsKICAgJFRbJ3NpdW50b3NfZmFpbGFzJ109YmFzZW5hbWUoJHJjLT5nZXRGaWxlTmFtZSgpKTsKICAgZm9yZWFjaCgkcmMtPmdldE1ldGhvZHMoKSBhcyAkbSl7IGlmKCRtLT5jbGFzcz09PSRyYy0+Z2V0TmFtZSgpKSAkVFsnc2l1bnRvc19tZXRvZGFpJ11bXT0kbS0+Z2V0TmFtZSgpLicvJy4kbS0+Z2V0TnVtYmVyT2ZQYXJhbWV0ZXJzKCk7IH0KIH0KIGZvcmVhY2goJHdwZGItPmdldF9jb2woIlNIT1cgVEFCTEVTIExJS0UgJyVwc19zaXVudCUnIikgYXMgJHQpewogICAkVFsnbGVudGVsZXMnXVskdF09JHdwZGItPmdldF9yZXN1bHRzKCJERVNDUklCRSAkdCIsQVJSQVlfQSk7CiB9CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogZWNobyBqc29uX2VuY29kZSgkVCwgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0sNSk7Cg==';
const out={v:'REC13'};
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
  const c=await fetch(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP Recon H237 v1 (Nemencine + siuntos)',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; const ct=await c.text(); try{j=JSON.parse(ct);}catch(e){}
  out.sukurta=j&&j.id?j.id:{s:c.status,t:ct.slice(0,300)};
  if(j&&j.id){
    sid=j.id; await miegok(6000);
    const d=await fetch(WP+'/?ps_rec13=RUN');
    const t=await d.text();
    try{ out.R=JSON.parse(t); }catch(e){ out.R='ne-json: '+t.slice(0,500); }
    await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})});
    out.isjungta=sid;
  }
}catch(e){ out.klaida=String(e).slice(0,600); }
await put('screenshots/rec13.json', Buffer.from(JSON.stringify(out,null,1)), 'REC13');
