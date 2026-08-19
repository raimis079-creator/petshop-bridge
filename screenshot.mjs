process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfaDA4OCddKSA/ICRfR0VUWydwc19oMDg4J10gOiAnJykgIT09ICdQRVJGJykgcmV0dXJuOwogQHNldF90aW1lX2xpbWl0KDE4MCk7CiBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7CiAkbyA9IGFycmF5KCd2Jz0+J0gwODgnKTsKIHRyeSB7CiAgICRvWydwaHAnXSA9IFBIUF9WRVJTSU9OOwogICAkb1snYXRtaW50aWVzX3JpYmEnXSA9IGluaV9nZXQoJ21lbW9yeV9saW1pdCcpOwogICAkb1snd3BfbWVtb3J5J10gPSBkZWZpbmVkKCdXUF9NRU1PUllfTElNSVQnKSA/IFdQX01FTU9SWV9MSU1JVCA6ICduZW51c3RhdHl0YSc7CiAgICRvWydvYmplY3RfY2FjaGUnXSA9IHdwX3VzaW5nX2V4dF9vYmplY3RfY2FjaGUoKSA/ICdZUkEnIDogJ05FUkEnOwogICBpZihmdW5jdGlvbl9leGlzdHMoJ29wY2FjaGVfZ2V0X3N0YXR1cycpKXsgJHM9QG9wY2FjaGVfZ2V0X3N0YXR1cyhmYWxzZSk7ICRvWydvcGNhY2hlJ109ICgkcyAmJiAhZW1wdHkoJHNbJ29wY2FjaGVfZW5hYmxlZCddKSkgPyAnSUpVTkdUQVMnIDogJ0lTSlVOR1RBUyc7IH0KICAgZWxzZSB7ICRvWydvcGNhY2hlJ109J25lcmEgZnVua2Npam9zJzsgfQogICAkb1sndXprbGF1c3UnXSA9IChpbnQpIGdldF9udW1fcXVlcmllcygpOwogICAkb1snZ2VuZXJhdmltb19sYWlrYXNfcyddID0gKGZsb2F0KSB0aW1lcl9zdG9wKDAsIDMpOwogICAkb1snYXRtaW50aWVzX01CJ10gPSByb3VuZChtZW1vcnlfZ2V0X3BlYWtfdXNhZ2UodHJ1ZSkvMTA0ODU3NiwgMSk7CiAgICRvWydha3R5dnVzX3BsdWdpbmFpJ10gPSBjb3VudCgoYXJyYXkpIGdldF9vcHRpb24oJ2FjdGl2ZV9wbHVnaW5zJywgYXJyYXkoKSkpOwogICAkb1snbXVfZmFpbGFpJ10gPSBjb3VudChnbG9iKFdQTVVfUExVR0lOX0RJUi4nLyoucGhwJykpOwogICAkb1snYXV0b2xvYWRfS0InXSA9IHJvdW5kKCgoZmxvYXQpICR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgU1VNKExFTkdUSChvcHRpb25fdmFsdWUpKSBGUk9NIHskUH1vcHRpb25zIFdIRVJFIGF1dG9sb2FkPSd5ZXMnIikpLzEwMjQsIDEpOwogICAkb1snYXV0b2xvYWRfaXJhc3UnXSA9IChpbnQpICR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JFB9b3B0aW9ucyBXSEVSRSBhdXRvbG9hZD0neWVzJyIpOwogICAkb1snYXV0b2xvYWRfdG9wJ10gPSAkd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBvcHRpb25fbmFtZSwgUk9VTkQoTEVOR1RIKG9wdGlvbl92YWx1ZSkvMTAyNCwxKSBrYiBGUk9NIHskUH1vcHRpb25zIFdIRVJFIGF1dG9sb2FkPSd5ZXMnIE9SREVSIEJZIExFTkdUSChvcHRpb25fdmFsdWUpIERFU0MgTElNSVQgOCIsIEFSUkFZX0EpOwogICAkb1sndHJhbnNpZW50dSddID0gKGludCkgJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskUH1vcHRpb25zIFdIRVJFIG9wdGlvbl9uYW1lIExJS0UgJ190cmFuc2llbnRfJSciKTsKICAgJG9bJ3ByZWtpdV9wdWJsaXNoJ10gPSAoaW50KSAkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyRQfXBvc3RzIFdIRVJFIHBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHBvc3Rfc3RhdHVzPSdwdWJsaXNoJyIpOwogfSBjYXRjaCAoVGhyb3dhYmxlICRlKSB7ICRvWydrbGFpZGEnXSA9ICRlLT5nZXRNZXNzYWdlKCk7IH0KICR3cGRiLT5xdWVyeSgiVVBEQVRFIHskUH1zbmlwcGV0cyBTRVQgYWN0aXZlPTAgV0hFUkUgbmFtZSBMSUtFICdURU1QJSciKTsKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSwgMTMxKTsK';
const out={versija:'H088'};
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
  const likę=(Array.isArray(sar)?sar:[]).filter(s=>String(s.name||'').startsWith('TEMP')&&s.active);
  out.TEMP_rasta_aktyviu_pries = likę.map(s=>s.id+':'+s.name);
  for(const s of likę){ await api('/wp-json/code-snippets/v1/snippets/'+s.id,{method:'POST',body:JSON.stringify({id:s.id,active:false})}); }
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP H088 serverio profilis',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; try{j=JSON.parse(cr.t);}catch(e){}
  await miegok(9000);
  const rr=await fetch(WP+'/?ps_h088=PERF'); const tt=await rr.text();
  try{ out.SERVERIS=JSON.parse(tt); }catch(e){ out.SERVERIS={ZALIAS:tt.slice(0,500)}; }
  if(j&&j.id) await api('/wp-json/code-snippets/v1/snippets/'+j.id,{method:'POST',body:JSON.stringify({id:j.id,active:false})});
  const fr=await fetch(WP+'/',{redirect:'manual'}); out.frontas=fr.status;
  const r3=await api('/wp-json/code-snippets/v1/snippets'); let s3=[]; try{s3=JSON.parse(r3.t);}catch(e){}
  out.TEMP_liko_aktyviu = Array.isArray(s3) ? s3.filter(x=>String(x.name||'').startsWith('TEMP')&&x.active).length : '?';
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('screenshots/h088.json', Buffer.from(JSON.stringify(out,null,1)), 'h088 serverio nasumo profilis');
