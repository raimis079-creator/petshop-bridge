process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIEVsbmlvIFJhZ3UgQnJlbmRhcyB2MS4wIChEdXZvKykgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICRyPSRfR0VUWydwc19icm5kJ10gPz8gJyc7IGlmKCRyIT09J0RSWScgJiYgJHIhPT0nQVBQTFknKSByZXR1cm47CiBnbG9iYWwgJHdwZGI7CiAkaWRzPVszNTEyNCwzNTEyNiwzNTEyOCwzNTEzMCwzNTEzMiwzNTEzNCwzNTEzNiwzNTEzOF07CiAkbz1bJ3YnPT4nQlJORDEnLCdyZXppbWFzJz0+JHJdOwoKIC8vIDEpIHN1cmFuZGFtIHRlcm1pbmEsIE5FS1VSSUFNIG5hdWpvCiAka2FuZD1bJ0R1dm8rJywnRHV2byArJywnRHV2byBQbGl1cycsJ0RVVk8rJywnRHV2byddOwogJHQ9bnVsbDsgJGthaXA9bnVsbDsKIGZvcmVhY2goJGthbmQgYXMgJGspeyAkeD1nZXRfdGVybV9ieSgnbmFtZScsJGssJ3Byb2R1Y3RfYnJhbmQnKTsgaWYoJHgpeyAkdD0keDsgJGthaXA9J25hbWU6ICcuJGs7IGJyZWFrOyB9IH0KIGlmKCEkdCl7IGZvcmVhY2goWydkdXZvJywnZHV2by1wbGl1cycsJ2R1dm8tcGx1cyddIGFzICRzKXsgJHg9Z2V0X3Rlcm1fYnkoJ3NsdWcnLCRzLCdwcm9kdWN0X2JyYW5kJyk7IGlmKCR4KXsgJHQ9JHg7ICRrYWlwPSdzbHVnOiAnLiRzOyBicmVhazsgfSB9IH0KICRvWydyYXN0YXNfdGVybWluYXMnXSA9ICR0ID8gWydpZCc9PiR0LT50ZXJtX2lkLCduYW1lJz0+JHQtPm5hbWUsJ3NsdWcnPT4kdC0+c2x1ZywnY291bnQnPT4kdC0+Y291bnQsJ2thaXAnPT4ka2FpcF0gOiBudWxsOwoKIC8vIHZpc2kgcGFuYXN1cyB0ZXJtaW5haSAtIGthZCBtYXR5dHVtLCBrYXMgeXJhCiAkb1sncGFuYXN1cyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHQudGVybV9pZCx0Lm5hbWUsdC5zbHVnLHR0LmNvdW50IEZST00geyR3cGRiLT50ZXJtc30gdAogICBKT0lOIHskd3BkYi0+dGVybV90YXhvbm9teX0gdHQgT04gdHQudGVybV9pZD10LnRlcm1faWQKICAgV0hFUkUgdHQudGF4b25vbXk9J3Byb2R1Y3RfYnJhbmQnIEFORCB0Lm5hbWUgTElLRSAnJXV2byUnIE9SREVSIEJZIHR0LmNvdW50IERFU0MiLCBBUlJBWV9BKTsKCiBpZighJHQpeyAkb1sna2xhaWRhJ109J0R1dm8gdGVybWluYXMgcHJvZHVjdF9icmFuZCBuZXJhc3RhcyAtIG5hdWpvIG5la3VyaXUnOyAKICAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUFJFVFRZX1BSSU5UKTsgZXhpdDsgfQoKICRvWydlaWwnXT1bXTsKIGZvcmVhY2goJGlkcyBhcyAkcGlkKXsKICAgJHA9Z2V0X3Bvc3QoJHBpZCk7CiAgICRlc2FtaT13cF9nZXRfb2JqZWN0X3Rlcm1zKCRwaWQsJ3Byb2R1Y3RfYnJhbmQnLFsnZmllbGRzJz0+J25hbWVzJ10pOwogICAkZT1bJ2lkJz0+JHBpZCwncGF2Jz0+JHA/bWJfc3Vic3RyKCRwLT5wb3N0X3RpdGxlLDAsNjIpOidORVJBJywKICAgICAgICdzdGF0dXNhcyc9PiRwPyRwLT5wb3N0X3N0YXR1czpudWxsLCdidXZlc19icmVuZGFzJz0+aXNfd3BfZXJyb3IoJGVzYW1pKT9bXTokZXNhbWldOwogICBpZighJHAgfHwgJHAtPnBvc3RfdHlwZSE9PSdwcm9kdWN0Jyl7ICRlWyd2ZWlrc21hcyddPSdQUkFMRUlTVEEgKG5lIHByZWtlKSc7ICRvWydlaWwnXVtdPSRlOyBjb250aW51ZTsgfQogICBpZigkcj09PSdBUFBMWScpewogICAgICRyZXM9d3Bfc2V0X29iamVjdF90ZXJtcygkcGlkLFsoaW50KSR0LT50ZXJtX2lkXSwncHJvZHVjdF9icmFuZCcsZmFsc2UpOwogICAgICRlWyd2ZWlrc21hcyddPWlzX3dwX2Vycm9yKCRyZXMpPygnS0xBSURBOiAnLiRyZXMtPmdldF9lcnJvcl9tZXNzYWdlKCkpOidQUklTS0lSVEEnOwogICAgIHdjX2RlbGV0ZV9wcm9kdWN0X3RyYW5zaWVudHMoJHBpZCk7IGNsZWFuX3Bvc3RfY2FjaGUoJHBpZCk7CiAgICAgJGVbJ3BvJ109d3BfZ2V0X29iamVjdF90ZXJtcygkcGlkLCdwcm9kdWN0X2JyYW5kJyxbJ2ZpZWxkcyc9PiduYW1lcyddKTsKICAgfSBlbHNlIHsgJGVbJ3ZlaWtzbWFzJ109J0JVVFUgUFJJU0tJUlRBJzsgfQogICAkb1snZWlsJ11bXT0kZTsKIH0KIGlmKCRyPT09J0FQUExZJyl7IHdwX3VwZGF0ZV90ZXJtX2NvdW50X25vdyhbJHQtPnRlcm1faWRdLCdwcm9kdWN0X2JyYW5kJyk7CiAgICRvWyd0ZXJtaW5vX2NvdW50X3BvJ109KGludClnZXRfdGVybSgkdC0+dGVybV9pZCktPmNvdW50OyB9CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUFJFVFRZX1BSSU5UKTsgZXhpdDsKfSw5OSk7Cg==';
const VER='BRND-v1.0'; const out={v:VER};
const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(p,buf,m){ const u='https://api.github.com/repos/'+REPO+'/contents/'+p; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:m,content:buf.toString('base64')}; if(sha)b.sha=sha;
  return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
async function fx(u,o,k){ for(let i=0;i<5;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(7000);} } throw new Error('fx:'+k); }
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
const UA={'Cache-Control':'no-cache','User-Agent':'Mozilla/5.0'};
let sid=null;
try{
  const l=await fx(SNIP,{headers:A},'list'); const arr=JSON.parse(await l.text());
  for(const s of (Array.isArray(arr)?arr:[]).filter(s=>s.active&&/^TEMP/.test(s.name||''))){
    await fetch(SNIP+'/'+s.id,{method:'POST',headers:A,body:JSON.stringify({id:s.id,active:false})}); }
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP PS Elnio Ragu Brendas v1.0 (Duvo+)',
    code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'create');
  sid=JSON.parse(await c.text()).id; await miegok(9000);
  const d=await fx(WP+'/?ps_brnd=DRY',{headers:UA},'dry');
  const dt=await d.text(); let DJ=null; try{ DJ=JSON.parse(dt); }catch(e){ out.dry_zalias=dt.slice(0,1200); }
  out.dry=DJ;
  if(DJ && DJ.rastas_terminas){
    await miegok(2500);
    const a=await fx(WP+'/?ps_brnd=APPLY',{headers:UA},'apply');
    const at=await a.text(); try{ out.apply=JSON.parse(at); }catch(e){ out.apply_zalias=at.slice(0,1200); }
  }
}catch(e){ out.klaida=String(e).slice(0,500); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put('analize/brendas_status.json', Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
