process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfaDE0OCddKSA/ICRfR0VUWydwc19oMTQ4J10gOiAnJykgIT09ICdHTycpIHJldHVybjsKIEBzZXRfdGltZV9saW1pdCgxODApOwogZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OwogJG89YXJyYXkoJ3YnPT4nSDE0OCcsJ2xhaWthcyc9PmN1cnJlbnRfdGltZSgnbXlzcWwnKSwnUkVaSU1BUyc9PidESUFHTk9TVElLQScpOwogJGF2PWFycmF5KDE3Mzk0LDE3NDAwLDE3Mzk3LDE3NDA2LDE3NDE1LDE3NDEyLDE3NDIxLDE3NDE4LDE3NDAzLDE3NDA5KTsKICRlaWw9YXJyYXkoKTsKIGZvcmVhY2goJGF2IGFzICRhKXsKICAgJHA9d2NfZ2V0X3Byb2R1Y3QoJGEpOwogICAkZWlsW109YXJyYXkoJ0FWJz0+JGEsCiAgICAgJ19vd25fc3RvY2tfcXR5Jz0+KHN0cmluZylnZXRfcG9zdF9tZXRhKCRhLCdfb3duX3N0b2NrX3F0eScsdHJ1ZSksCiAgICAgJ196Yl9xdHknPT4oc3RyaW5nKWdldF9wb3N0X21ldGEoJGEsJ196Yl9xdHknLHRydWUpLAogICAgICdfdmZfcXR5Jz0+KHN0cmluZylnZXRfcG9zdF9tZXRhKCRhLCdfdmZfcXR5Jyx0cnVlKSwKICAgICAnX3N0b2NrJz0+KHN0cmluZylnZXRfcG9zdF9tZXRhKCRhLCdfc3RvY2snLHRydWUpLAogICAgICd3Yyc9PiRwPyRwLT5nZXRfc3RvY2tfcXVhbnRpdHkoKTpudWxsLAogICAgICdzcmMnPT4oc3RyaW5nKWdldF9wb3N0X21ldGEoJGEsJ19hY3RpdmVfZnVsZmlsbG1lbnRfc291cmNlJyx0cnVlKSk7CiB9CiAkb1snYnVzZW5hJ109JGVpbDsKCiAvKiBhciB5cmEga2FibGl1a3UgYW50IGxpa3VjaW8gKi8KIGdsb2JhbCAkd3BfZmlsdGVyOwogZm9yZWFjaChhcnJheSgnd29vY29tbWVyY2VfdXBkYXRlX3Byb2R1Y3QnLCd3b29jb21tZXJjZV9wcm9kdWN0X3NldF9zdG9jaycsJ3VwZGF0ZWRfcG9zdF9tZXRhJywnd29vY29tbWVyY2VfdXBkYXRlZF9wcm9kdWN0X3N0b2NrJykgYXMgJGgpewogICAkc2FyPWFycmF5KCk7CiAgIGlmKGlzc2V0KCR3cF9maWx0ZXJbJGhdKSl7CiAgICAgZm9yZWFjaCgkd3BfZmlsdGVyWyRoXS0+Y2FsbGJhY2tzIGFzICRwcj0+JGNiKXsKICAgICAgIGZvcmVhY2goJGNiIGFzICRpZD0+JGMpewogICAgICAgICAkZm49JGNbJ2Z1bmN0aW9uJ107CiAgICAgICAgIGlmKGlzX2FycmF5KCRmbikpICRmbj0oaXNfb2JqZWN0KCRmblswXSk/Z2V0X2NsYXNzKCRmblswXSk6KHN0cmluZykkZm5bMF0pLic6OicuJGZuWzFdOwogICAgICAgICBlbHNlaWYoJGZuIGluc3RhbmNlb2YgQ2xvc3VyZSkgJGZuPSdDbG9zdXJlJzsKICAgICAgICAgJHNhcltdPSRwci4nICcuKGlzX3N0cmluZygkZm4pPyRmbjonPycpOwogICAgICAgfQogICAgIH0KICAgfQogICAkb1sna2FibGl1a2FpXycuJGhdPSRzYXI7CiB9CgogLyogR1JZTkFTIHRlc3RhczogcGVyc2thaWNpdW9qdSB2aWVuYSBwcmVrZSBpciB6aXVyaXUga2EgZHVvZGEgKi8KICRGPW5ldyBQZXRzaG9wX0Z1bGZpbGxtZW50KCk7CiAkdD0xNzM5NDsKICRvWyd0ZXN0YXNfcHJpZXMnXT0kRi0+Z2V0X2FsbF9xdWFudGl0aWVzKCR0KTsKICRvWyd0ZXN0YXNfdG90YWxfbWV0b2RhcyddPSRGLT5nZXRfdG90YWxfcXVhbnRpdHkoJHQpOwogJG9bJ3Rlc3Rhc19zcmMnXT0kRi0+cmVjYWxjdWxhdGUoJHQpOwogJG9bJ3Rlc3Rhc19wb193YyddPXdjX2dldF9wcm9kdWN0KCR0KS0+Z2V0X3N0b2NrX3F1YW50aXR5KCk7CiAkb1sndGVzdGFzX3BvX21ldGEnXT0oc3RyaW5nKWdldF9wb3N0X21ldGEoJHQsJ19zdG9jaycsdHJ1ZSk7CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0sIDEzMSk7Cg==';
const out={versija:'H148'};
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
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP H148 Monge merge APPLY',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; try{j=JSON.parse(cr.t);}catch(e){}
  await miegok(9000);
  const rA=await fetch(WP+'/?ps_h148=GO'); const tA=await rA.text();
  try{ out.A=JSON.parse(tA); }catch(e){ out.A={ZALIAS:tA.slice(0,700)}; }
  if(j&&j.id) await api('/wp-json/code-snippets/v1/snippets/'+j.id,{method:'POST',body:JSON.stringify({id:j.id,active:false})});
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('screenshots/h148.json', Buffer.from(JSON.stringify(out,null,1)), 'h148 Monge merge APPLY');
