process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIEswIEthbXBhbmlqdSBMYW5nbyBadmFsZ3liYSB2MS4wIChyZWFkLW9ubHkpICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogICR2ID0gaXNzZXQoJF9HRVRbJ3BzX2JpcyddKSA/ICRfR0VUWydwc19iaXMnXSA6ICcnOwogIGlmICgkdiAhPT0gJ0swJykgcmV0dXJuOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgJG8gPSBhcnJheSgndic9PidLMC12MS4wJyk7CiAgdHJ5IHsKICAgIGdsb2JhbCAkd3BkYjsgJHAgPSAkd3BkYi0+cHJlZml4OwoKICAgIC8qIC0tLSBrbGFzZXMgLS0tICovCiAgICAka2xzID0gYXJyYXkoJ1BldHNob3BfRW1haWxfRGlzcGF0Y2gnLCdQZXRzaG9wX0VTUF9TZW5kZXJfQWRhcHRlcicsJ1BldHNob3BfQ29uc2VudF9Mb2cnLCdQZXRzaG9wX0NvbnNlbnRfU3luYycsJ1BldHNob3BfRXZlbnRfUmVnaXN0cnknLCdQZXRzaG9wX01hZ2ljX0xvZ2luJyk7CiAgICAkb1sna2xhc2VzJ10gPSBhcnJheSgpOwogICAgZm9yZWFjaCAoJGtscyBhcyAkYykgewogICAgICBpZiAoIWNsYXNzX2V4aXN0cygkYykpIHsgJG9bJ2tsYXNlcyddWyRjXSA9ICdORVJBJzsgY29udGludWU7IH0KICAgICAgJHJjID0gbmV3IFJlZmxlY3Rpb25DbGFzcygkYyk7CiAgICAgICRtID0gYXJyYXkoKTsKICAgICAgZm9yZWFjaCAoJHJjLT5nZXRNZXRob2RzKCkgYXMgJG1lKSB7CiAgICAgICAgaWYgKCRtZS0+Y2xhc3MgIT09ICRjKSBjb250aW51ZTsKICAgICAgICAkcGFyID0gYXJyYXkoKTsKICAgICAgICBmb3JlYWNoICgkbWUtPmdldFBhcmFtZXRlcnMoKSBhcyAkcHApIHsKICAgICAgICAgICR0ID0gJHBwLT5nZXRUeXBlKCk7ICRzID0gKCR0ID8gJHQuJyAnIDogJycpLickJy4kcHAtPmdldE5hbWUoKTsKICAgICAgICAgIGlmICgkcHAtPmlzRGVmYXVsdFZhbHVlQXZhaWxhYmxlKCkpIHsgJGQgPSAkcHAtPmdldERlZmF1bHRWYWx1ZSgpOyAkcyAuPSAnPScuKGlzX2FycmF5KCRkKT8nW10nOnZhcl9leHBvcnQoJGQsdHJ1ZSkpOyB9CiAgICAgICAgICAkcGFyW10gPSAkczsKICAgICAgICB9CiAgICAgICAgJG1bXSA9ICgkbWUtPmlzU3RhdGljKCk/J3N0YXRpYyAnOicnKS4kbWUtPmdldE5hbWUoKS4nKCcuaW1wbG9kZSgnLCAnLCRwYXIpLicpJzsKICAgICAgfQogICAgICAkb1sna2xhc2VzJ11bJGNdID0gYXJyYXkoJ2ZhaWxhcyc9PnN0cl9yZXBsYWNlKFdQX0NPTlRFTlRfRElSLCcnLCRyYy0+Z2V0RmlsZU5hbWUoKSksICdtZXRvZGFpJz0+JG0pOwogICAgfQoKICAgIC8qIC0tLSBsZW50ZWxlcyAtLS0gKi8KICAgICRsZW50ID0gYXJyYXkoJ3BzX2VtYWlsX2pvYnMnLCdwc19uZXdzbGV0dGVyJywncHNfY29uc2VudF9sb2cnLCdwc19zdXBwcmVzc2lvbicsJ3BzX2VtYWlsX3N1cHByZXNzaW9uJywncHNfZXZlbnRfbG9nJyk7CiAgICAkb1snbGVudGVsZXMnXSA9IGFycmF5KCk7CiAgICBmb3JlYWNoICgkbGVudCBhcyAkTCkgewogICAgICAkVCA9ICRwLiRMOwogICAgICBpZiAoJHdwZGItPmdldF92YXIoIlNIT1cgVEFCTEVTIExJS0UgJyRUJyIpICE9PSAkVCkgeyAkb1snbGVudGVsZXMnXVskTF0gPSAnTkVSQSc7IGNvbnRpbnVlOyB9CiAgICAgICRvWydsZW50ZWxlcyddWyRMXSA9IGFycmF5KAogICAgICAgICdzdHVscGVsaWFpJyA9PiAkd3BkYi0+Z2V0X2NvbCgiU0hPVyBDT0xVTU5TIEZST00gYCRUYCIsIDApLAogICAgICAgICdlaWx1Y2l1JyAgICA9PiAoaW50KSAkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gYCRUYCIpLAogICAgICApOwogICAgfQogICAgLyogdmlzb3MgcHNfIGxlbnRlbGVzICovCiAgICAkb1sndmlzb3NfcHNfbGVudGVsZXMnXSA9ICR3cGRiLT5nZXRfY29sKCR3cGRiLT5wcmVwYXJlKCJTSE9XIFRBQkxFUyBMSUtFICVzIiwgJHAuJ3BzXyUnKSwgMCk7CgogICAgLyogLS0tIHBzX2VtYWlsX2pvYnMgYnVzZW5vcyBpciBzcmF1dGFpIC0tLSAqLwogICAgJEogPSAkcC4ncHNfZW1haWxfam9icyc7CiAgICBpZiAoJHdwZGItPmdldF92YXIoIlNIT1cgVEFCTEVTIExJS0UgJyRKJyIpID09PSAkSikgewogICAgICAkb1snam9ic19zdGF0dXMnXSA9ICR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHN0YXR1cywgQ09VTlQoKikgbiBGUk9NIGAkSmAgR1JPVVAgQlkgc3RhdHVzIiwgQVJSQVlfQSk7CiAgICAgICRvWydqb2JzX2Zsb3cnXSAgID0gJHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgZmxvdywgZmxvd19jbGFzcywgQ09VTlQoKikgbiBGUk9NIGAkSmAgR1JPVVAgQlkgZmxvdywgZmxvd19jbGFzcyBMSU1JVCAzMCIsIEFSUkFZX0EpOwogICAgfQoKICAgIC8qIC0tLSBzcmF1dHUgcmVnaXN0cmFzIC8gc2FibG9uYWkgLS0tICovCiAgICAkb1snb3BjaWpvcyddID0gYXJyYXkoKTsKICAgIGZvcmVhY2ggKGFycmF5KCdwc19lbWFpbF9mbG93cycsJ3BldHNob3BfZW1haWxfZmxvd3MnLCdwc19mbG93c190ZXN0JywncGV0c2hvcF9mbG93c190ZXN0JywncHNfZW1haWxfdGVzdF9mbG93cycpIGFzICRvaykgewogICAgICAkdmFsID0gZ2V0X29wdGlvbigkb2ssICdfX05FUkFfXycpOwogICAgICBpZiAoJHZhbCAhPT0gJ19fTkVSQV9fJykgJG9bJ29wY2lqb3MnXVskb2tdID0gaXNfc2NhbGFyKCR2YWwpID8gJHZhbCA6IGpzb25fZW5jb2RlKCR2YWwpOwogICAgfQogICAgJG9bJ29wY2lqb3NfcHMnXSA9ICR3cGRiLT5nZXRfY29sKCR3cGRiLT5wcmVwYXJlKAogICAgICAiU0VMRUNUIG9wdGlvbl9uYW1lIEZST00geyR3cGRiLT5vcHRpb25zfSBXSEVSRSBvcHRpb25fbmFtZSBMSUtFICVzIE9SIG9wdGlvbl9uYW1lIExJS0UgJXMgTElNSVQgNjAiLAogICAgICAncHNfJWVtYWlsJScsICdwZXRzaG9wXyVlbWFpbCUnKSwgMCk7CgogICAgLyogLS0tIHNhYmxvbnUgZmFpbGFpIC0tLSAqLwogICAgZm9yZWFjaCAoYXJyYXkoV1BfQ09OVEVOVF9ESVIuJy9tdS1wbHVnaW5zL3NhYmxvbmFpJywgV1BfQ09OVEVOVF9ESVIuJy9tdS1wbHVnaW5zL3BldHNob3Atc2FibG9uYWknLCBXUF9QTFVHSU5fRElSLicvcGV0c2hvcC1lc3Avc2FibG9uYWknKSBhcyAkZCkgewogICAgICBpZiAoaXNfZGlyKCRkKSkgJG9bJ3NhYmxvbnVfa2F0YWxvZ2FzJ11bJGRdID0gYXJyYXlfdmFsdWVzKGFycmF5X2RpZmYoc2NhbmRpcigkZCksIGFycmF5KCcuJywnLi4nKSkpOwogICAgfQoKICAgIC8qIC0tLSBtdS1wbHVnaW5zIHNhcmFzYXMgLS0tICovCiAgICAkb1snbXVfcGx1Z2lucyddID0gYXJyYXlfdmFsdWVzKGFycmF5X2ZpbHRlcihzY2FuZGlyKFdQTVVfUExVR0lOX0RJUiksIGZ1bmN0aW9uKCRmKXsgcmV0dXJuIHN1YnN0cigkZiwtNCk9PT0nLnBocCc7IH0pKTsKCiAgfSBjYXRjaCAoVGhyb3dhYmxlICRlKSB7ICRvWydGQVRBTCddID0gJGUtPmdldE1lc3NhZ2UoKS4nIEAgJy4kZS0+Z2V0TGluZSgpOyB9CiAgZWNobyBqc29uX2VuY29kZSgkbywgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSk7Cg==';
const VER='K0-133126';
const GKEY='ps_bis';
const PHASES=["K0"];
const OUT='analize/k0.json';
const out={v:VER};
const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(p,buf,m){ const u='https://api.github.com/repos/'+REPO+'/contents/'+p; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:m,content:buf.toString('base64')}; if(sha)b.sha=sha;
  return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
async function fx(u,o,k){ for(let i=0;i<5;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(8000);} } throw new Error('fx:'+k); }
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
const UA={'Cache-Control':'no-cache','User-Agent':'Mozilla/5.0'};
let sid=null;
try{
  const l=await fx(SNIP,{headers:A},'list'); const arr=JSON.parse(await l.text());
  for(const s of (Array.isArray(arr)?arr:[]).filter(s=>s.active&&/^TEMP/.test(s.name||''))){
    await fetch(SNIP+'/'+s.id,{method:'POST',headers:A,body:JSON.stringify({id:s.id,active:false})}); }
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP PS '+VER,
    code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'create');
  const ct=await c.text(); out.kurimas=c.status; try{sid=JSON.parse(ct).id; out.sid=sid;}catch(e){out.kurimo_atsakas=ct.slice(0,400);}
  await miegok(9000);
  for(let i=0;i<PHASES.length;i++){
    const f=PHASES[i];
    if(i>0) await miegok(5000);
    const d=await fx(WP+'/?'+GKEY+'='+encodeURIComponent(f),{headers:UA},'faze_'+f);
    const t=await d.text();
    try{ out[f]=JSON.parse(t); }catch(e){ out['zalias_'+f]=t.slice(0,1500); }
  }
}catch(e){ out.klaida=String(e).slice(0,500); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put(OUT, Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
