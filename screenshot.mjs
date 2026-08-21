process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfcjIwMCddKSA/ICRfR0VUWydwc19yMjAwJ10gOiAnJykgIT09ICdHTycpIHJldHVybjsKIGdsb2JhbCAkd3BkYjsKICRvID0gYXJyYXkoJ3YnPT4nUjIwMCcpOwoKIC8qIDEuIG11LXBsdWdpbnMgaW52ZW50b3JpdXMgKi8KICRkaXIgPSBkZWZpbmVkKCdXUE1VX1BMVUdJTl9ESVInKSA/IFdQTVVfUExVR0lOX0RJUiA6IFdQX0NPTlRFTlRfRElSLicvbXUtcGx1Z2lucyc7CiAkZmlsZXMgPSBhcnJheV9tZXJnZSgoYXJyYXkpZ2xvYigkZGlyLicvKi5waHAnKSwgKGFycmF5KWdsb2IoJGRpci4nLyovKi5waHAnKSk7CiAkbXUgPSBhcnJheSgpOwogZm9yZWFjaCgkZmlsZXMgYXMgJGYpewogICAkaCA9IEBmaWxlX2dldF9jb250ZW50cygkZiwgZmFsc2UsIG51bGwsIDAsIDEyMDApOwogICAkdmVyID0gJyc7CiAgIGlmKHByZWdfbWF0Y2goJy9WZXJzaW9uOlxzKihbMC05XVswLTlhLXpBLVouXy1dKikvJywgKHN0cmluZykkaCwgJG0pKSAkdmVyID0gJG1bMV07CiAgICRtdVtiYXNlbmFtZSgkZildID0gYXJyYXkoZmlsZXNpemUoJGYpLCAkdmVyLCBzdWJzdHIobWQ1X2ZpbGUoJGYpLDAsMTApKTsKIH0KIGtzb3J0KCRtdSk7CiAkb1snbXUnXSA9ICRtdTsKCiAvKiAyLiBrdXIgbWluaW1pIHJha3RpbmlhaSB0ZWtzdGFpICovCiAkaWVza290aSA9IGFycmF5KAogICAncHMtbGF1a2FpJywgJ3BzLXJpbmtpbmlhaScsCiAgICJHcnVwaVx4YzVceGIzIG51b3RyYXVrb3MiLCAnU3VyZW5rYW1pIHJpbmtpbmlhaScsICdQYXJ1b1x4YzVceGExdGkgcmlua2luaWFpJywKICAgJ1N1a3VydGkgcmlua2luJywgJ0dydXBpJywgJ3ZpZXRvcyBkYXInLCAna2xpZW50YXMgbmVtYXRvJwogKTsKICRyYWRvID0gYXJyYXkoKTsKICR0dXJpbnlzID0gYXJyYXkoKTsKIGZvcmVhY2goJGZpbGVzIGFzICRmKXsKICAgJGMgPSBAZmlsZV9nZXRfY29udGVudHMoJGYpOwogICBpZigkYyA9PT0gZmFsc2UpIGNvbnRpbnVlOwogICAkdHVyaW55c1tiYXNlbmFtZSgkZildID0gJGM7CiAgIGZvcmVhY2goJGllc2tvdGkgYXMgJHEpewogICAgIGlmKHN0cnBvcygkYywgJHEpICE9PSBmYWxzZSkgJHJhZG9bJHFdW10gPSBiYXNlbmFtZSgkZik7CiAgIH0KIH0KICRvWydyYWRvJ10gPSAkcmFkbzsKCiAvKiAzLiBmYWlsYWksIGt1cml1b3NlIHlyYSDigJ5HcnVwaSIgYXJiYSBwcy1sYXVrYWkg4oCUIGlzIGp1IHRyYXVraWFtIG9wY2lqYXMvbWV0YSAqLwogJHRhaWtpbmlhaSA9IGFycmF5KCk7CiBmb3JlYWNoKCR0dXJpbnlzIGFzICRuPT4kYyl7CiAgIGlmKHN0cnBvcygkYywncHMtbGF1a2FpJykhPT1mYWxzZSB8fCBzdHJwb3MoJGMsIkdydXBpXHhjNVx4YjMgbnVvdHJhdWtvcyIpIT09ZmFsc2UpICR0YWlraW5pYWlbXSA9ICRuOwogfQogJG9bJ3RhaWtpbmlhaSddID0gJHRhaWtpbmlhaTsKICRvcHMgPSBhcnJheSgpOyAkbWV0b3MgPSBhcnJheSgpOyAkYWpheCA9IGFycmF5KCk7CiBmb3JlYWNoKCR0YWlraW5pYWkgYXMgJG4pewogICAkYyA9ICR0dXJpbnlzWyRuXTsKICAgaWYocHJlZ19tYXRjaF9hbGwoJy8oPzpnZXR8dXBkYXRlfGRlbGV0ZSlfb3B0aW9uXChccypbXCciXShbXlwnIl0rKVtcJyJdLycsICRjLCAkbSkpICRvcHMgPSBhcnJheV9tZXJnZSgkb3BzLCAkbVsxXSk7CiAgIGlmKHByZWdfbWF0Y2hfYWxsKCcvW1wnIl0oX1thLXowLTlfXXszLDQwfSlbXCciXS8nLCAkYywgJG0pKSAkbWV0b3MgPSBhcnJheV9tZXJnZSgkbWV0b3MsICRtWzFdKTsKICAgaWYocHJlZ19tYXRjaF9hbGwoJy93cF9hamF4XyhbYS16MC05X10rKS8nLCAkYywgJG0pKSAkYWpheCA9IGFycmF5X21lcmdlKCRhamF4LCAkbVsxXSk7CiB9CiAkb1snb3BjaWpvc19rb2RlJ10gPSBhcnJheV92YWx1ZXMoYXJyYXlfdW5pcXVlKCRvcHMpKTsKICRvWydtZXRhX2tvZGUnXSAgICA9IGFycmF5X3ZhbHVlcyhhcnJheV9zbGljZShhcnJheV91bmlxdWUoJG1ldG9zKSwgMCwgMTIwKSk7CiAkb1snYWpheCddICAgICAgICAgPSBhcnJheV92YWx1ZXMoYXJyYXlfdW5pcXVlKCRhamF4KSk7CgogLyogNC4gd3Bfb3B0aW9ucywga3VyIHBhdmFkaW5pbWUgbGF1a2FpIC8gcmlua2luaSAvIGdydXAgKi8KICRyb3dzID0gJHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1Qgb3B0aW9uX25hbWUsIExFTkdUSChvcHRpb25fdmFsdWUpIEFTIGlsZ2lzIEZST00geyR3cGRiLT5vcHRpb25zfQogICBXSEVSRSBvcHRpb25fbmFtZSBMSUtFICclbGF1a2FpJScgT1Igb3B0aW9uX25hbWUgTElLRSAnJXJpbmtpbmklJyBPUiBvcHRpb25fbmFtZSBMSUtFICclZ3J1cCUnIE9SIG9wdGlvbl9uYW1lIExJS0UgJ3BzXyUnCiAgIE9SREVSIEJZIG9wdGlvbl9uYW1lIExJTUlUIDIwMCIsIEFSUkFZX0EpOwogJG9bJ29wdGlvbnMnXSA9ICRyb3dzOwoKIC8qIDUuIGtvbmtyZXR1cyBwcm9kdWt0YXMgaXMgZWtyYW5vIG51b3RyYXVrb3MgKi8KICRwID0gZ2V0X3BhZ2VfYnlfcGF0aCgndGVzdC1rb25zZXJ2dS1kZXplLTQwMC1iZS12aXN0aWVub3MnLCBPQkpFQ1QsICdwcm9kdWN0Jyk7CiBpZigkcCl7CiAgICRtZXRhID0gZ2V0X3Bvc3RfbWV0YSgkcC0+SUQpOwogICAkdHJ1bXBhaSA9IGFycmF5KCk7CiAgIGZvcmVhY2goJG1ldGEgYXMgJGs9PiR2KXsKICAgICAkdmFsID0gaXNfYXJyYXkoJHYpID8gKGlzc2V0KCR2WzBdKT8kdlswXTonJykgOiAkdjsKICAgICBpZighaXNfc2NhbGFyKCR2YWwpKSAkdmFsID0gd3BfanNvbl9lbmNvZGUoJHZhbCk7CiAgICAgJHRydW1wYWlbJGtdID0gbWJfc3Vic3RyKChzdHJpbmcpJHZhbCwgMCwgMTgwKTsKICAgfQogICAkb1sncHJla2UnXSA9IGFycmF5KAogICAgICdJRCc9PiRwLT5JRCwgJ3RpdGxlJz0+JHAtPnBvc3RfdGl0bGUsICdzdGF0dXMnPT4kcC0+cG9zdF9zdGF0dXMsCiAgICAgJ3R5cGUnPT4kcC0+cG9zdF90eXBlLCAndGh1bWInPT5nZXRfcG9zdF90aHVtYm5haWxfaWQoJHAtPklEKSwKICAgICAna2F0ZWdvcmlqb3MnPT53cF9nZXRfcG9zdF90ZXJtcygkcC0+SUQsJ3Byb2R1Y3RfY2F0JyxhcnJheSgnZmllbGRzJz0+J3NsdWdzJykpLAogICAgICdtZXRhJz0+JHRydW1wYWksCiAgICk7CiB9IGVsc2UgewogICAkb1sncHJla2UnXSA9ICdORVJBU1RBIHBhZ2FsIHNsdWcnOwogfQoKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiBlY2hvIHdwX2pzb25fZW5jb2RlKCRvLCBKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVMpOwogZXhpdDsKfSwgMTMxKTsK';
const out={versija:'R200'};
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
  /* 0. isjungiam senus TEMP */
  const f0=await fetch(SNIP,{headers:A}); let visi=[]; try{visi=JSON.parse(await f0.text());}catch(e){}
  out.snippetu_kiek=Array.isArray(visi)?visi.length:'?';
  if(Array.isArray(visi)){ for(const s of visi){ if(String(s.name||'').startsWith('TEMP')&&s.active){ await fetch(SNIP+'/'+s.id,{method:'POST',headers:A,body:JSON.stringify({id:s.id,active:false})}); out.isjungta=(out.isjungta||[]).concat(s.id); } } }
  /* 1. kuriam snippeta */
  const kunas=JSON.stringify({name:'TEMP R200 Laukai recon v1',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5});
  const c=await fetch(SNIP,{method:'POST',headers:A,body:kunas});
  let j=null; const ct=await c.text(); try{j=JSON.parse(ct);}catch(e){}
  out.sukurta = j&&j.id ? j.id : {s:c.status,t:ct.slice(0,300)};
  if(j&&j.id){
    await miegok(6000);
    const r=await fetch(WP+'/?ps_r200=GO'); const t=await r.text();
    try{ out.DUOM=JSON.parse(t); }catch(e){ out.DUOM={s:r.status, zalias:t.slice(0,600)}; }
    await miegok(1500);
    await fetch(SNIP+'/'+j.id,{method:'POST',headers:A,body:JSON.stringify({id:j.id,active:false})});
    out.deaktyvuota=j.id;
  }
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('screenshots/r200.json', Buffer.from(JSON.stringify(out,null,1)), 'r200 laukai recon');
