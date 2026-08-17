process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmICgoaXNzZXQoJF9HRVRbJ3BzX2M5MDcnXSk/JF9HRVRbJ3BzX2M5MDcnXTonJykhPT0nQzkwNycpIHJldHVybjsKIEBzZXRfdGltZV9saW1pdCg5MDApOwogZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OwogJHBhayA9IGlzc2V0KCRfR0VUWydwYWsnXSk/JF9HRVRbJ3BhayddOicnOwogJG89YXJyYXkoJ3YnPT4nQzkwNycsJ3Bhayc9PiRwYWssJ3RzJz0+ZGF0ZSgnSDppOnMnKSk7CgogJHJzPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHRhYmxlX25hbWUgdCwgUk9VTkQoKGRhdGFfbGVuZ3RoK2luZGV4X2xlbmd0aCkvMTAyNC8xMDI0LDMpIG1iCiAgICBGUk9NIGluZm9ybWF0aW9uX3NjaGVtYS50YWJsZXMgV0hFUkUgdGFibGVfc2NoZW1hPURBVEFCQVNFKCkgQU5EIGVuZ2luZT0nTXlJU0FNJwogICAgT1JERVIgQlkgKGRhdGFfbGVuZ3RoK2luZGV4X2xlbmd0aCkgQVNDIiwgQVJSQVlfQSk7CiAkZ3J1cGU9ZnVuY3Rpb24oJHQpIHVzZSAoJFApewogICBpZihwcmVnX21hdGNoKCcvX2Jha198X2JhayR8X2JhY2t1cC9pJywkdCkpIHJldHVybiAnYmFrJzsKICAgaWYoc3RycG9zKCR0LCRQLidwc18nKT09PTApIHJldHVybiAncHMnOwogICBpZihwcmVnX21hdGNoKCcvXicucHJlZ19xdW90ZSgkUCwnLycpLicocG9zdHN8cG9zdG1ldGF8b3B0aW9uc3x1c2Vyc3x1c2VybWV0YXx0ZXJtc3x0ZXJtbWV0YXx0ZXJtX3RheG9ub215fHRlcm1fcmVsYXRpb25zaGlwc3xjb21tZW50c3xjb21tZW50bWV0YXxsaW5rcykkLycsJHQpKSByZXR1cm4gJ3dwX2NvcmUnOwogICBpZihzdHJwb3MoJHQsJFAuJ3djXycpPT09MCB8fCBzdHJwb3MoJHQsJFAuJ3dvb2NvbW1lcmNlXycpPT09MCkgcmV0dXJuICd3b28nOwogICBpZihzdHJwb3MoJHQsJFAuJ2FjdGlvbnNjaGVkdWxlcicpPT09MCkgcmV0dXJuICdhcyc7CiAgIHJldHVybiAna2l0YSc7CiB9OwogJG5vcmk9ZXhwbG9kZSgnLCcsICRwYWspOwogJHNhcj1hcnJheSgpOwogZm9yZWFjaCgkcnMgYXMgJHgpeyBpZihpbl9hcnJheSgkZ3J1cGUoJHhbJ3QnXSksICRub3JpLCB0cnVlKSkgJHNhcltdPSR4Wyd0J107IH0KICRvWydraWVrJ109Y291bnQoJHNhcik7CiBpZighJHNhcil7IGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0OyB9CgogJG9rPWFycmF5KCk7ICRrbGFpZG9zPWFycmF5KCk7ICRuZWF0PWFycmF5KCk7ICR0MD1taWNyb3RpbWUodHJ1ZSk7CiBmb3JlYWNoKCRzYXIgYXMgJHQpewogICAkcHJpZXM9KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gYCR0YCIpOwogICAkd3BkYi0+cXVlcnkoIkFMVEVSIFRBQkxFIGAkdGAgRU5HSU5FPUlubm9EQiwgUk9XX0ZPUk1BVD1EWU5BTUlDIik7CiAgICRlcnI9JHdwZGItPmxhc3RfZXJyb3I7CiAgICRlbmc9JHdwZGItPmdldF92YXIoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBlbmdpbmUgRlJPTSBpbmZvcm1hdGlvbl9zY2hlbWEudGFibGVzIFdIRVJFIHRhYmxlX3NjaGVtYT1EQVRBQkFTRSgpIEFORCB0YWJsZV9uYW1lPSVzIiwkdCkpOwogICAkcG89KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gYCR0YCIpOwogICBpZigkZXJyKXsgJGtsYWlkb3NbXT1hcnJheSgkdCxzdWJzdHIoJGVyciwwLDE0MCkpOyB9CiAgIGVsc2VpZigkZW5nIT09J0lubm9EQicpeyAkbmVhdFtdPWFycmF5KCR0LCRlbmcpOyB9CiAgIGVsc2VpZigkcHJpZXMhPT0kcG8peyAka2xhaWRvc1tdPWFycmF5KCR0LCJFSUxVQ0lVIE5FU1VUQVBJTUFTICRwcmllcyAtPiAkcG8iKTsgfQogICBlbHNlIHsgJG9rW109YXJyYXkoJHQsJHByaWVzKTsgfQogfQogJG9bJ3RydWttZV9zJ109cm91bmQobWljcm90aW1lKHRydWUpLSR0MCwxKTsKICRvWydva19uJ109Y291bnQoJG9rKTsgJG9bJ2tsYWlkdV9uJ109Y291bnQoJGtsYWlkb3MpOyAkb1snbmVhdHNpdmFydGVfbiddPWNvdW50KCRuZWF0KTsKICRvWydrbGFpZG9zJ109JGtsYWlkb3M7ICRvWyduZWF0c2l2YXJ0ZSddPSRuZWF0OwogJG9bJ29rJ109YXJyYXlfc2xpY2UoJG9rLDAsNSk7CiAvLyBiZW5kcmEgYnVzZW5hIHBvIHBha2V0bwogJGc9JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgZW5naW5lIGUsIENPVU5UKCopIG4sIFJPVU5EKFNVTShkYXRhX2xlbmd0aCtpbmRleF9sZW5ndGgpLzEwMjQvMTAyNCwxKSBtYgogICBGUk9NIGluZm9ybWF0aW9uX3NjaGVtYS50YWJsZXMgV0hFUkUgdGFibGVfc2NoZW1hPURBVEFCQVNFKCkgR1JPVVAgQlkgZW5naW5lIiwgQVJSQVlfQSk7CiAkb1snYnVzZW5hJ109JGc7CiAkd3BkYi0+cXVlcnkoIlVQREFURSB7JFB9c25pcHBldHMgU0VUIGFjdGl2ZT0wIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIik7CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSwgMTMxKTsK';
const out={versija:'C907',paketai:[]};
async function put(name,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/${name}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  const r=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/${name}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)});
  return r.status;
}
async function api(p,o={}){ const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(n,b64){ const code=Buffer.from(b64,'base64').toString('utf8'); const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:n,code,scope:'global',active:true,priority:5})}); let j=null; try{j=JSON.parse(cr.t);}catch(e){} return j?j.id:null; }
async function off(id){ if(id) await api('/wp-json/code-snippets/v1/snippets/'+id,{method:'POST',body:JSON.stringify({id,active:false})}); }
try{
  const s=await snip('TEMP C907',B64);
  await new Promise(r=>setTimeout(r,6000));
  const r=await fetch(WP+'/?ps_c907=C907&pak=bak,ps,woo');
  const txt=await r.text();
  try{ out.paketai.push(JSON.parse(txt)); }catch(e){ out.zalias=txt.slice(0,600); }
  await off(s);
  // greita gyvybes patikra
  const home=await fetch(WP+'/'); out.parduotuve=home.status;
  const kat=await fetch(WP+'/wp-admin/admin.php?page=ps-katalogas',{headers:{Authorization:AUTH}}); out.katalogas=kat.status;
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('c907.json', Buffer.from(JSON.stringify(out)), 'c907 paketas1');
