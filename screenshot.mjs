process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfaDE4MyddKSA/ICRfR0VUWydwc19oMTgzJ10gOiAnJykgIT09ICdHTycpIHJldHVybjsKIEBzZXRfdGltZV9saW1pdCgxODApOwogZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OwogJG89YXJyYXkoJ3YnPT4nSDE4MycsJ2xhaWthcyc9PmN1cnJlbnRfdGltZSgnbXlzcWwnKSwnUkVaSU1BUyc9PidSRUNPTi1PTkxZJyk7CiAkZj1XUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWRlc2sucGhwJzsKICRvWydmYWlsYXNfeXJhJ109ZmlsZV9leGlzdHMoJGYpOyAkb1snZHlkaXMnXT1AZmlsZXNpemUoJGYpOyAkb1snbWQ1J109QG1kNV9maWxlKCRmKTsKICRlaWw9QGZpbGUoJGYpOyAkb1snZWlsdWNpdSddPWlzX2FycmF5KCRlaWwpP2NvdW50KCRlaWwpOjA7CiBpZighJGVpbCl7IGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0OyB9CgogJHJhc3RpPWZ1bmN0aW9uKCRyZSkgdXNlKCRlaWwpeyAkaD1hcnJheSgpOwogICBmb3JlYWNoKCRlaWwgYXMgJGk9PiRsKXsgaWYocHJlZ19tYXRjaCgkcmUsJGwpKSAkaFtdPSgkaSsxKS4nOiAnLnRyaW0obWJfc3Vic3RyKCRsLDAsMTUwKSk7IH0KICAgcmV0dXJuIGFycmF5X3NsaWNlKCRoLDAsMjUpOyB9OwoKICRvWyduZWFwbW9rZXRpJ10gID0gJHJhc3RpKCcvbmVhcG1va2V0aXxOZWFwbW9rxJd0aS91Jyk7CiAkb1snenltZXMnXSAgICAgICA9ICRyYXN0aSgnL3p5bWV8enltLXxiYWRnZXxwaWxsfGtvcnRlbGUtenltZXxleGNsIC91Jyk7CiAkb1snYXRzYXVrdGknXSAgICA9ICRyYXN0aSgnL2F0c2F1a3RpfGNhbmNlbGxlZHxyZXN0b2NrfHdjX21heWJlX2luY3JlYXNlL3UnKTsKICRvWydiYWNzJ10gICAgICAgID0gJHJhc3RpKCcvYmFjc3xwYXltZW50X21ldGhvZC91Jyk7CiAkb1snZHVubmluZyddICAgICA9ICRyYXN0aSgnL2R1bm5pbmcvdScpOwoKIC8qIGR1bm5pbmctMSBzYWJsb25hcyDigJQga3VyIGppcyAqLwogJHNhYiA9IGFycmF5KCk7CiBmb3JlYWNoKGFycmF5KFdQTVVfUExVR0lOX0RJUiwgV1BfUExVR0lOX0RJUi4nL3BldHNob3AtY29yZScsIGdldF9zdHlsZXNoZWV0X2RpcmVjdG9yeSgpKSBhcyAkZCl7CiAgIGZvcmVhY2goKGFycmF5KUBnbG9iKCRkLicvKmR1bm5pbmcqJykgYXMgJHgpICRzYWJbXT1zdHJfcmVwbGFjZShXUF9DT05URU5UX0RJUiwnJywkeCk7CiAgIGZvcmVhY2goKGFycmF5KUBnbG9iKCRkLicvKiovKmR1bm5pbmcqJykgYXMgJHgpICRzYWJbXT1zdHJfcmVwbGFjZShXUF9DT05URU5UX0RJUiwnJywkeCk7CiB9CiAkb1snZHVubmluZ19mYWlsYWknXT1hcnJheV92YWx1ZXMoYXJyYXlfdW5pcXVlKCRzYWIpKTsKICRvWydkdW5uaW5nX29wdGlvbiddPWdldF9vcHRpb24oJ3BzX2xhaXNrYWlfZHVubmluZ18xJykgPyAnb3B0aW9uIHlyYScgOiAnb3B0aW9uIG5lcmEnOwoKIC8qIHJlYWx1cyBvbi1ob2xkIGJhY3MgdXpzYWt5bWFpIGlyIGp1IGFteml1cyAqLwogJG9bJ29uaG9sZCddID0gJHdwZGItPmdldF9yZXN1bHRzKAogICAiU0VMRUNUIGlkLCBwYXltZW50X21ldGhvZCwgc3RhdHVzLCBkYXRlX2NyZWF0ZWRfZ210LAogICAgIFRJTUVTVEFNUERJRkYoSE9VUiwgZGF0ZV9jcmVhdGVkX2dtdCwgVVRDX1RJTUVTVEFNUCgpKSB2YWwKICAgIEZST00geyRQfXdjX29yZGVycyBXSEVSRSBzdGF0dXM9J3djLW9uLWhvbGQnIE9SREVSIEJZIGlkIERFU0MgTElNSVQgMTUiLCBBUlJBWV9BKTsKICRvWydiYWNzX3Zpc28nXSA9IChpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskUH13Y19vcmRlcnMgV0hFUkUgcGF5bWVudF9tZXRob2Q9J2JhY3MnIik7CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0sIDEzMSk7Cg==';
const out={versija:'H183'};
const miegok=(ms)=>new Promise(r=>setTimeout(r,ms));
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
  for(const s of (Array.isArray(sar)?sar:[])){ if(String(s.name||'').startsWith('TEMP') && s.active){ await api('/wp-json/code-snippets/v1/snippets/'+s.id,{method:'POST',body:JSON.stringify({id:s.id,active:false})}); } }
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP H183 Monge merge APPLY',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; try{j=JSON.parse(cr.t);}catch(e){}
  await miegok(9000);
  const rA=await fetch(WP+'/?ps_h183=GO'); const tA=await rA.text();
  try{ out.A=JSON.parse(tA); }catch(e){ out.A={ZALIAS:tA.slice(0,700)}; }
  if(j&&j.id) await api('/wp-json/code-snippets/v1/snippets/'+j.id,{method:'POST',body:JSON.stringify({id:j.id,active:false})});
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('screenshots/h183.json', Buffer.from(JSON.stringify(out,null,1)), 'h183 Monge merge APPLY');
