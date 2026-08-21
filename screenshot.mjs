process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICRyID0gaXNzZXQoJF9HRVRbJ3BzX3IyMDcnXSkgPyAkX0dFVFsncHNfcjIwNyddIDogJyc7CiBpZigkciAhPT0gJ0RSWScgJiYgJHIgIT09ICdBUFBMWScpIHJldHVybjsKICRvID0gYXJyYXkoJ3YnPT4nUjIwNycsJ3JlemltYXMnPT4kcik7CiAkZGFyeXRpID0gKCRyID09PSAnQVBQTFknKTsKCiBpZighY2xhc3NfZXhpc3RzKCdQZXRzaG9wX0xhdWthaScpKXsgJG9bJ2tsYWlkYSddPSduZXJhIGtsYXNlcyc7IGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0OyB9CgogLyogLS0tLS0tLS0tLSAxLiBQVUJMSUtBVklNQVMgLS0tLS0tLS0tLSAqLwogJHB1YiA9IGFycmF5KDM0OTM3LCAzNDkzNiwgMzQ5MzMsIDM0OTM0KTsKICRwMSA9IGFycmF5KCk7CiBmb3JlYWNoKCRwdWIgYXMgJGlkKXsKICAgJHAgPSBnZXRfcG9zdCgkaWQpOwogICAkZSA9IGFycmF5KCdpZCc9PiRpZCwgJ3Bhdic9PiRwPyRwLT5wb3N0X3RpdGxlOidORVJBJywgJ2J1dm8nPT4kcD8kcC0+cG9zdF9zdGF0dXM6Jy0nLAogICAgICAgICAgICAgICdwcmVraXUnPT5jb3VudChQZXRzaG9wX0xhdWthaTo6a3JlcHN5cygkaWQpKSk7CiAgICRlWydzYXVnaWtsaXMnXSA9ICgkcCAmJiBnZXRfcG9zdF9tZXRhKCRpZCwnX3BzX2xhdWthcycsdHJ1ZSk9PT0neWVzJyAmJiAkZVsncHJla2l1J10gPj0gMikgPyAnT0snIDogJ1NUT1AnOwogICBpZigkZGFyeXRpICYmICRlWydzYXVnaWtsaXMnXT09PSdPSycgJiYgJHAtPnBvc3Rfc3RhdHVzICE9PSAncHVibGlzaCcpewogICAgIHdwX3VwZGF0ZV9wb3N0KGFycmF5KCdJRCc9PiRpZCwgJ3Bvc3Rfc3RhdHVzJz0+J3B1Ymxpc2gnKSk7CiAgICAgJGVbJ3BvJ10gPSBnZXRfcG9zdF9zdGF0dXMoJGlkKTsKICAgfSBlbHNlaWYoJGRhcnl0aSl7ICRlWydwbyddID0gZ2V0X3Bvc3Rfc3RhdHVzKCRpZCk7IH0KICAgJHAxW10gPSAkZTsKIH0KICRvWydwdWJsaWthdmltYXMnXSA9ICRwMTsKCiAvKiAtLS0tLS0tLS0tIDIuIElFSklNTyBaWU1FUyAtLS0tLS0tLS0tICovCiAvKiBWaWVuYXMgaWVqaW1hcyBncnVwZWkuIEtpdGllbXMgdG9zIGdydXBlcyBsYXVrYW1zIHp5bWUgbnVpbWFtLiAqLwogJGllaiA9IGFycmF5KCdzdW55cyc9PjM0OTM3LCAna2F0ZXMnPT4zNDkzNiwgJ2tyYW10YWxhaSc9PjM0OTMzLAogICAgICAgICAgICAgICdrb25zX3N1bmltcyc9PjM0OTQ0LCAna29uc19rYXRlcyc9PjM0OTQ4KTsKICRwMiA9IGFycmF5KCk7CiBmb3JlYWNoKCRpZWogYXMgJGdydXBlID0+ICRpZCl7CiAgICRlID0gYXJyYXkoJ2dydXBlJz0+JGdydXBlLCAnaWVqaW1hcyc9PiRpZCwgJ3Bhdic9PmdldF90aGVfdGl0bGUoJGlkKSwKICAgICAgICAgICAgICAnYnV2byc9PmdldF9wb3N0X21ldGEoJGlkLCdfcHNfbGF1a2FzX2llamltYXMnLHRydWUpID86ICctJyk7CiAgIGlmKCRkYXJ5dGkpewogICAgICRxID0gbmV3IFdQX1F1ZXJ5KGFycmF5KCdwb3N0X3R5cGUnPT4ncHJvZHVjdCcsJ3Bvc3Rfc3RhdHVzJz0+YXJyYXkoJ3B1Ymxpc2gnLCdkcmFmdCcpLAogICAgICAgJ3Bvc3RzX3Blcl9wYWdlJz0+NjAsJ2ZpZWxkcyc9PidpZHMnLAogICAgICAgJ21ldGFfcXVlcnknPT5hcnJheShhcnJheSgna2V5Jz0+J19wc19sYXVrYXMnLCd2YWx1ZSc9Pid5ZXMnKSkpKTsKICAgICBmb3JlYWNoKCRxLT5wb3N0cyBhcyAka2lkKXsKICAgICAgIGlmKFBldHNob3BfTGF1a2FpOjpncnVwZSgka2lkKSAhPT0gJGdydXBlKSBjb250aW51ZTsKICAgICAgIGlmKChpbnQpJGtpZCA9PT0gKGludCkkaWQpeyB1cGRhdGVfcG9zdF9tZXRhKCRraWQsJ19wc19sYXVrYXNfaWVqaW1hcycsJ3llcycpOyB9CiAgICAgICBlbHNlIHsgZGVsZXRlX3Bvc3RfbWV0YSgka2lkLCdfcHNfbGF1a2FzX2llamltYXMnKTsgfQogICAgIH0KICAgICAkZVsncG8nXSA9IGdldF9wb3N0X21ldGEoJGlkLCdfcHNfbGF1a2FzX2llamltYXMnLHRydWUpOwogICAgICRlWydtYXRvbXVtYXNfa2Vpc3RhJ10gPSBQZXRzaG9wX0xhdWthaTo6c3V0dmFya3l0aV9tYXRvbXVtYSgkZ3J1cGUpOwogICB9CiAgICRwMltdID0gJGU7CiB9CiAkb1snaWVqaW1haSddID0gJHAyOwoKIC8qIC0tLS0tLS0tLS0gMy4gTUVOSVUgTlVPUk9ET1MgLS0tLS0tLS0tLSAqLwogJHBsYW5hcyA9IGFycmF5KDM0MjUwPT4zNDkzNywgMzQyNTE9PjM0OTM2LCAzNDI1Mj0+MzQ5MzMpOwogJHAzID0gYXJyYXkoKTsKIGZvcmVhY2goJHBsYW5hcyBhcyAkbWlkPT4kbGlkKXsKICAgJG1wID0gZ2V0X3Bvc3QoJG1pZCk7ICRscCA9IGdldF9wb3N0KCRsaWQpOwogICAkbmF1amEgPSAkbHAgPyBnZXRfcGVybWFsaW5rKCRsaWQpIDogJyc7CiAgICRlID0gYXJyYXkoJ21lbml1X2lkJz0+JG1pZCwnbWVuaXVfcGF2Jz0+JG1wPyRtcC0+cG9zdF90aXRsZTonTkVSQScsCiAgICAgICAgICAgICAgJ3RhaWtpbnlzJz0+JGxpZCwndGFpa2luaW9fYnVzZW5hJz0+JGxwP2dldF9wb3N0X3N0YXR1cygkbGlkKTonLScsCiAgICAgICAgICAgICAgJ3NlbmEnPT5nZXRfcG9zdF9tZXRhKCRtaWQsJ19tZW51X2l0ZW1fdXJsJyx0cnVlKSwnbmF1amEnPT4kbmF1amEpOwogICAvKiBEUlkgbWV0dSB0YWlraW55cyBkYXIganVvZHJhc3RpcyDigJQgamlzIHB1Ymxpa3VvamFtYXMgMSB6aW5nc255amUuCiAgICAgIFRvZGVsIHByaWltYW0gaXIgdHVvcywga3VyaWUgeXJhIHB1Ymxpa2F2aW1vIHNhcmFzZS4gKi8KICAgJGJ1c19wdWJsaXNoID0gKGdldF9wb3N0X3N0YXR1cygkbGlkKT09PSdwdWJsaXNoJykgfHwgaW5fYXJyYXkoKGludCkkbGlkLCAkcHViLCB0cnVlKTsKICAgJG9rID0gJG1wICYmICRscCAmJiAkYnVzX3B1Ymxpc2gKICAgICAgJiYgZ2V0X3Bvc3RfbWV0YSgkbGlkLCdfcHNfbGF1a2FzJyx0cnVlKT09PSd5ZXMnICYmICRuYXVqYSE9PScnOwogICAkZVsnc2F1Z2lrbGlzJ10gPSAkb2sgPyAnT0snIDogJ1NUT1AnOwogICBpZigkZGFyeXRpICYmICRvayl7IHVwZGF0ZV9wb3N0X21ldGEoJG1pZCwnX21lbnVfaXRlbV91cmwnLCRuYXVqYSk7ICRlWydwbyddPWdldF9wb3N0X21ldGEoJG1pZCwnX21lbnVfaXRlbV91cmwnLHRydWUpOyB9CiAgICRwM1tdID0gJGU7CiB9CiAkb1snbWVuaXUnXSA9ICRwMzsKCiAvKiAtLS0tLS0tLS0tIDQuIEtBVEVHT1JJSk9TIC0tLS0tLS0tLS0gKi8KICR0X3JpbmsgPSBnZXRfdGVybV9ieSgnc2x1ZycsJ3JpbmtpbmlhaScsJ3Byb2R1Y3RfY2F0Jyk7CiAkdF9rb25zID0gZ2V0X3Rlcm1fYnkoJ3NsdWcnLCdrb25zZXJ2dS1yaW5raW5pYWknLCdwcm9kdWN0X2NhdCcpOwogJHRfa3JhbSA9IGdldF90ZXJtX2J5KCdzbHVnJywna3JhbXRhbHUtcmlua2luaWFpJywncHJvZHVjdF9jYXQnKTsKICR0X2trYXQgPSBnZXRfdGVybV9ieSgnc2x1ZycsJ2tvbnNlcnZhaS1rYXRlbXMnLCdwcm9kdWN0X2NhdCcpOwogJHA0ID0gYXJyYXkoKTsKCiAvKiA0YS4gIzM0OTQ4IGlza3JpdGVzIGlzIFJJTktJTklVIG1lZHppbyDigJQgcHJpc2tpcmlhbSBrYWlwICMzNDk0NyAqLwogJGUgPSBhcnJheSgnaWQnPT4zNDk0OCwnYnV2byc9PndwX2dldF9wb3N0X3Rlcm1zKDM0OTQ4LCdwcm9kdWN0X2NhdCcsYXJyYXkoJ2ZpZWxkcyc9PiduYW1lcycpKSk7CiAkbmF1amkgPSBhcnJheV9maWx0ZXIoYXJyYXkoJHRfa2thdD8kdF9ra2F0LT50ZXJtX2lkOjAsICR0X2tvbnM/JHRfa29ucy0+dGVybV9pZDowLCAkdF9yaW5rPyR0X3JpbmstPnRlcm1faWQ6MCkpOwogJGVbJ25hdWppX2lkJ10gPSBhcnJheV92YWx1ZXMoJG5hdWppKTsKICRlWydzYXVnaWtsaXMnXSA9IGNvdW50KCRuYXVqaSk9PT0zID8gJ09LJyA6ICdTVE9QJzsKIGlmKCRkYXJ5dGkgJiYgJGVbJ3NhdWdpa2xpcyddPT09J09LJyl7CiAgIHdwX3NldF9vYmplY3RfdGVybXMoMzQ5NDgsIGFycmF5X3ZhbHVlcyhhcnJheV9tYXAoJ2ludHZhbCcsJG5hdWppKSksICdwcm9kdWN0X2NhdCcsIGZhbHNlKTsKICAgJGVbJ3BvJ10gPSB3cF9nZXRfcG9zdF90ZXJtcygzNDk0OCwncHJvZHVjdF9jYXQnLGFycmF5KCdmaWVsZHMnPT4nbmFtZXMnKSk7CiB9CiAkcDRbXSA9ICRlOwoKIC8qIDRiLiBza2FuZXN0dSBkZXplcyBpcyDigJ5LcmFtdGFsdSByaW5raW5pYWkiIHBhc2FsaW5hbSAqLwogZm9yZWFjaChhcnJheSgzNDkzNywzNDkzNSkgYXMgJGlkKXsKICAgJGUyID0gYXJyYXkoJ2lkJz0+JGlkLCdwYXYnPT5nZXRfdGhlX3RpdGxlKCRpZCksCiAgICAgICAgICAgICAgICdidXZvJz0+d3BfZ2V0X3Bvc3RfdGVybXMoJGlkLCdwcm9kdWN0X2NhdCcsYXJyYXkoJ2ZpZWxkcyc9PiduYW1lcycpKSk7CiAgICRlMlsnc2F1Z2lrbGlzJ10gPSAkdF9rcmFtID8gJ09LJyA6ICdTVE9QJzsKICAgaWYoJGRhcnl0aSAmJiAkdF9rcmFtKXsKICAgICB3cF9yZW1vdmVfb2JqZWN0X3Rlcm1zKCRpZCwgKGludCkkdF9rcmFtLT50ZXJtX2lkLCAncHJvZHVjdF9jYXQnKTsKICAgICAkZTJbJ3BvJ10gPSB3cF9nZXRfcG9zdF90ZXJtcygkaWQsJ3Byb2R1Y3RfY2F0JyxhcnJheSgnZmllbGRzJz0+J25hbWVzJykpOwogICB9CiAgICRwNFtdID0gJGUyOwogfQogJG9bJ2thdGVnb3Jpam9zJ10gPSAkcDQ7CgogaWYoJGRhcnl0aSl7CiAgIGZvcmVhY2goYXJyYXkoMzQ5MzMsMzQ5MzQsMzQ5MzUsMzQ5MzYsMzQ5MzcsMzQ5NDQsMzQ5NDgpIGFzICRpZCl7IHdjX2RlbGV0ZV9wcm9kdWN0X3RyYW5zaWVudHMoJGlkKTsgfQogICB3cF9jYWNoZV9mbHVzaCgpOwogfQoKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiBlY2hvIHdwX2pzb25fZW5jb2RlKCRvLCBKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVMpOwogZXhpdDsKfSwgMTMxKTsK';
const out={versija:'R207'};
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
  const kunas=JSON.stringify({name:'TEMP R207 Dezes gyvai v2',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5});
  const c=await fetch(SNIP,{method:'POST',headers:A,body:kunas});
  let j=null; const ct=await c.text(); try{j=JSON.parse(ct);}catch(e){}
  out.sukurta=j&&j.id?j.id:{s:c.status,t:ct.slice(0,200)};
  if(j&&j.id){
    await miegok(6000);
    const d1=await fetch(WP+'/?ps_r207=DRY'); try{ out.DRY=JSON.parse(await d1.text()); }catch(e){ out.DRY_zalias=(await d1.text?'':''); }
    const D=out.DRY;
    let ok = D && [].concat(D.publikavimas||[],D.iejimai||[],D.meniu||[],D.kategorijos||[])
              .every(x=>x.saugiklis===undefined||x.saugiklis==='OK');
    out.visi_ok=ok;
    if(ok){
      const d2=await fetch(WP+'/?ps_r207=APPLY'); try{ out.APPLY=JSON.parse(await d2.text()); }catch(e){ out.APPLY='klaida'; }
      await miegok(3000);
      /* patikra: visi penki meniu punktai */
      const hp=await fetch(WP+'/kategorija/rinkiniai/'); const html=await hp.text();
      out.nuorodos=[];
      const re=/<a[^>]+href="([^"]+)"[^>]*>\s*(Susid[^<]{0,45}?)\s*<\/a>/g; let m; const matyti=new Set();
      while((m=re.exec(html))){ if(matyti.has(m[2])) continue; matyti.add(m[2]); out.nuorodos.push({t:m[2],url:m[1]}); }
      for(const n of out.nuorodos){
        if(n.url.indexOf('http')!==0) { n.s='#'; continue; }
        const q=await fetch(n.url,{redirect:'manual'}); n.s=q.status;
      }
      /* ekrano nuotrauka */
      try{
        const {chromium}=await import('playwright');
        const b=await chromium.launch();
        const ctx=await b.newContext({viewport:{width:1400,height:1000},ignoreHTTPSErrors:true});
        const p=await ctx.newPage();
        await p.goto(WP+'/kategorija/rinkiniai/',{waitUntil:'domcontentloaded',timeout:60000});
        await p.waitForTimeout(4500);
        await put('screenshots/r207_kategorija.png', await p.screenshot(), 'r207 kategorija');
        await b.close(); out.nuotrauka='OK';
      }catch(e){ out.nuotrauka=String(e).slice(0,150); }
    }
    await fetch(SNIP+'/'+j.id,{method:'POST',headers:A,body:JSON.stringify({id:j.id,active:false})});
    out.deaktyvuota=j.id;
  }
}catch(e){ out.klaida=String(e).slice(0,500); }
await put('screenshots/r207.json', Buffer.from(JSON.stringify(out,null,1)), 'r207 dezes gyvai');
