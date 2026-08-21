process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICRyID0gaXNzZXQoJF9HRVRbJ3BzX3IyMDUnXSkgPyAkX0dFVFsncHNfcjIwNSddIDogJyc7CiBpZigkciAhPT0gJ0RSWScgJiYgJHIgIT09ICdBUFBMWScpIHJldHVybjsKICRvID0gYXJyYXkoJ3YnPT4nUjIwNScsJ3JlemltYXMnPT4kcik7CgogLyogbWVuaXUgcHVua3RvIElEID0+IGxhdWtvIElEICovCiAkcGxhbmFzID0gYXJyYXkoCiAgIDM0MjQ4ID0+IDM0OTQ0LCAgLyogU3VzaWRlayBrb25zZXJ2dSByaW5raW5pIHN1bmltcyAqLwogICAzNDI0OSA9PiAzNDk0OCwgIC8qIFN1c2lkZWsga29uc2VydnUgcmlua2luaSBrYXRlbXMgKi8KICk7CgogJGVpbCA9IGFycmF5KCk7CiBmb3JlYWNoKCRwbGFuYXMgYXMgJG1pZCA9PiAkbGlkKXsKICAgJG1wID0gZ2V0X3Bvc3QoJG1pZCk7CiAgICRscCA9IGdldF9wb3N0KCRsaWQpOwogICAkc2VuYSA9IGdldF9wb3N0X21ldGEoJG1pZCwgJ19tZW51X2l0ZW1fdXJsJywgdHJ1ZSk7CiAgICRuYXVqYSA9ICRscCA/IGdldF9wZXJtYWxpbmsoJGxpZCkgOiAnJzsKICAgJGUgPSBhcnJheSgKICAgICAnbWVuaXVfaWQnPT4kbWlkLAogICAgICdtZW5pdV9wYXYnPT4kbXAgPyAkbXAtPnBvc3RfdGl0bGUgOiAnTkVSQScsCiAgICAgJ2xhdWtvX2lkJz0+JGxpZCwKICAgICAnbGF1a29fcGF2Jz0+JGxwID8gJGxwLT5wb3N0X3RpdGxlIDogJ05FUkEnLAogICAgICdsYXVrb19idXNlbmEnPT4kbHAgPyAkbHAtPnBvc3Rfc3RhdHVzIDogJ05FUkEnLAogICAgICdzZW5hX3VybCc9PiRzZW5hLAogICAgICduYXVqYV91cmwnPT4kbmF1amEsCiAgICk7CiAgIC8qIHNhdWdpa2xpYWk6IHRhaWtpbnlzIHR1cmkgZWd6aXN0dW90aSwgYnV0aSBwdWJsaXNoIGlyIGJ1dGkgbGF1a2FzICovCiAgICRvayA9ICRtcCAmJiAkbHAgJiYgJGxwLT5wb3N0X3N0YXR1cyA9PT0gJ3B1Ymxpc2gnCiAgICAgICYmIGdldF9wb3N0X21ldGEoJGxpZCwnX3BzX2xhdWthcycsdHJ1ZSkgPT09ICd5ZXMnICYmICRuYXVqYSAhPT0gJyc7CiAgICRlWydzYXVnaWtsaXMnXSA9ICRvayA/ICdPSycgOiAnU1RPUCc7CiAgIGlmKCRvayAmJiAkciA9PT0gJ0FQUExZJyl7CiAgICAgJGVbJ2lyYXN5dGEnXSA9IHVwZGF0ZV9wb3N0X21ldGEoJG1pZCwgJ19tZW51X2l0ZW1fdXJsJywgJG5hdWphKSAhPT0gZmFsc2UgPyAnT0snIDogJ2JlIHBva3ljaW8nOwogICAgICRlWydwbyddID0gZ2V0X3Bvc3RfbWV0YSgkbWlkLCdfbWVudV9pdGVtX3VybCcsdHJ1ZSk7CiAgIH0KICAgJGVpbFtdID0gJGU7CiB9CiAkb1snZWlsdXRlcyddID0gJGVpbDsKIGlmKCRyID09PSAnQVBQTFknKXsgd3BfY2FjaGVfZmx1c2goKTsgfQoKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiBlY2hvIHdwX2pzb25fZW5jb2RlKCRvLCBKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVMpOwogZXhpdDsKfSwgMTMxKTsK';
const out={versija:'R205'};
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
  const kunas=JSON.stringify({name:'TEMP R205 Meniu nuorodos',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5});
  const c=await fetch(SNIP,{method:'POST',headers:A,body:kunas});
  let j=null; const ct=await c.text(); try{j=JSON.parse(ct);}catch(e){}
  out.sukurta=j&&j.id?j.id:{s:c.status,t:ct.slice(0,200)};
  if(j&&j.id){
    await miegok(6000);
    const d1=await fetch(WP+'/?ps_r205=DRY'); try{ out.DRY=JSON.parse(await d1.text()); }catch(e){ out.DRY='klaida'; }
    let visi_ok = out.DRY && out.DRY.eilutes && out.DRY.eilutes.every(x=>x.saugiklis==='OK');
    out.visi_ok=visi_ok;
    if(visi_ok){
      const d2=await fetch(WP+'/?ps_r205=APPLY'); try{ out.APPLY=JSON.parse(await d2.text()); }catch(e){ out.APPLY='klaida'; }
      await miegok(2500);
      /* patikra: meniu HTML + HTTP statusai */
      const hp=await fetch(WP+'/kategorija/rinkiniai/'); const html=await hp.text();
      out.meniu_html=[];
      for(const m of (html.match(/<a[^>]+href="[^"]+"[^>]*>\s*Susid[^<]{0,45}<\/a>/g)||[])){
        out.meniu_html.push(m.replace(/\s+/g,' ').slice(0,180));
      }
      out.statusai=[];
      for(const e of out.APPLY.eilutes||[]){
        const q=await fetch(e.nauja_url,{redirect:'manual'});
        out.statusai.push({t:e.meniu_pav, url:e.nauja_url, s:q.status});
      }
    }
    await fetch(SNIP+'/'+j.id,{method:'POST',headers:A,body:JSON.stringify({id:j.id,active:false})});
    out.deaktyvuota=j.id;
  }
}catch(e){ out.klaida=String(e).slice(0,500); }
await put('screenshots/r205.json', Buffer.from(JSON.stringify(out,null,1)), 'r205 meniu nuorodos');
