process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIGxhaXNrbyBsb2dvIHJlY29uICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfbGcnXSl8fCRfR0VUWydwc19sZyddIT09J1InKSByZXR1cm47CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAkbz1hcnJheSgndic9PidMRzEnKTsKICB0cnl7CiAgICBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7CiAgICAka2V5cz1hcnJheSgnUGFrZWl0aW1vIMSvcmHFoWFzJywnR2F2b3RlIMWhxK8gbGFpxaFrxIUsIG5lcyBwYXNpa2VpdMSXJywnbG9nbycpOwogICAgZm9yZWFjaChhcnJheShXUE1VX1BMVUdJTl9ESVIsV1BfUExVR0lOX0RJUi4nL3BldHNob3AtY29yZScpIGFzICRkKXsgJGl0PW5ldyBSZWN1cnNpdmVJdGVyYXRvckl0ZXJhdG9yKG5ldyBSZWN1cnNpdmVEaXJlY3RvcnlJdGVyYXRvcigkZCxGaWxlc3lzdGVtSXRlcmF0b3I6OlNLSVBfRE9UUykpOwogICAgICBmb3JlYWNoKCRpdCBhcyAkZmkpeyBpZighcHJlZ19tYXRjaCgnL1wucGhwJC8nLCRmaS0+Z2V0RmlsZW5hbWUoKSkpIGNvbnRpbnVlOyAkYz1AZmlsZV9nZXRfY29udGVudHMoJGZpLT5nZXRQYXRobmFtZSgpKTsgJHJlbD1zdHJfcmVwbGFjZShBQlNQQVRILCcnLCRmaS0+Z2V0UGF0aG5hbWUoKSk7CiAgICAgICAgaWYoc3RyaXBvcygkYywnUGFrZWl0aW1vIMSvcmHFoWFzJykhPT1mYWxzZXx8c3RyaXBvcygkYywnR2F2b3RlIMWhxK8gbGFpxaFrxIUsIG5lcyBwYXNpa2VpdMSXJykhPT1mYWxzZSkgJG9bJ2NvbnNlbnRfdHBsJ11bXT0kcmVsOwogICAgICAgIGlmKHByZWdfbWF0Y2hfYWxsKCcvW15cbl17MCw4MH0obG9nb3w8aW1nW14+XXswLDIwMH0pW15cbl17MCwxMjB9L2knLCRjLCRtKSAmJiAoc3RyaXBvcygkcmVsLCdlbWFpbCcpIT09ZmFsc2V8fHN0cmlwb3MoJHJlbCwnbGFpc2snKSE9PWZhbHNlfHxzdHJpcG9zKCRyZWwsJ21haWwnKSE9PWZhbHNlfHxzdHJpcG9zKCRyZWwsJ3RlbXBsYXRlJykhPT1mYWxzZXx8c3RyaXBvcygkcmVsLCdzYWJsb24nKSE9PWZhbHNlKSkgJG9bJ2xvZ29fbGluZXMnXVskcmVsXT1hcnJheV9zbGljZShhcnJheV92YWx1ZXMoYXJyYXlfdW5pcXVlKCRtWzBdKSksMCw4KTsKICAgICAgfSB9CiAgICAvLyBzZW50IGNvbnNlbnQgam9iIGh0bWw/IHBzX2VtYWlsX2pvYnMgbmV0dXJpIGh0bWw7IGFyIHlyYSByZW5kZXJlZCBjb250ZW50IGFyY2h5dmUKICAgICRhPWdldF9vcHRpb24oJ3BzX2xhaXNrdV9hcmNoeXZhcycpOyBpZihpc19hcnJheSgkYSkpeyAkb1snYXJjaHl2YXNfbiddPWNvdW50KCRhKTsgJG9bJ2FyY2h5dmFzX2tleXMnXT1hcnJheV9rZXlzKHJlc2V0KCRhKSk7IH0KICAgIC8vIHJlZmlsbF9kdWUgIzQ1IGthaXAgcGFseWdpbmltYXM6IHJlbmRlcmludGkgcGVyIGtsYXNlPwogICAgJG9bJ2xvZ29fb3B0cyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIG9wdGlvbl9uYW1lLExFRlQob3B0aW9uX3ZhbHVlLDIwMCkgdiBGUk9NIHskcH1vcHRpb25zIFdIRVJFIChvcHRpb25fbmFtZSBMSUtFICclbG9nbyUnIE9SIG9wdGlvbl9uYW1lIExJS0UgJ3BzX2VtYWlsJScgT1Igb3B0aW9uX25hbWUgTElLRSAncGV0c2hvcF9lbWFpbCUnIE9SIG9wdGlvbl9uYW1lIExJS0UgJ3BzX2xhaXNrJScpIEFORCBvcHRpb25fbmFtZSBOT1QgTElLRSAnX3RyYW5zaWVudCUnIixBUlJBWV9BKTsKICAgICR0bT1nZXRfdGhlbWVfbW9kcygpOyBmb3JlYWNoKCR0bSBhcyAkaz0+JHYpeyBpZihzdHJpcG9zKCRrLCdsb2dvJykhPT1mYWxzZSkgJG9bJ3RoZW1lX2xvZ28nXVska109aXNfc2NhbGFyKCR2KT8kdjpqc29uX2VuY29kZSgkdik7IH0KICAgICRvWydjdXN0b21fbG9nbyddPWdldF9jdXN0b21fbG9nbygpP3dwX2dldF9hdHRhY2htZW50X2ltYWdlX3VybChnZXRfdGhlbWVfbW9kKCdjdXN0b21fbG9nbycpLCdmdWxsJyk6bnVsbDsKICAgICRvWydzaXRlX2ljb24nXT1nZXRfc2l0ZV9pY29uX3VybCgpOwogICAgJG9bJ3djX2VtYWlsX2hlYWRlcl9pbWFnZSddPWdldF9vcHRpb24oJ3dvb2NvbW1lcmNlX2VtYWlsX2hlYWRlcl9pbWFnZScpOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSk7Cg==';
const VER='dep-074144';
const GKEY='ps_lg';
const PHASES=["R"];
const OUT='analize/lg_recon.json';
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
  try{ const l=await fx(SNIP,{headers:A},'list'); const arr=JSON.parse(await l.text());
  for(const s of (Array.isArray(arr)?arr:[]).filter(s=>s.active&&/^TEMP/.test(s.name||''))){
    await fetch(SNIP+'/'+s.id,{method:'POST',headers:A,body:JSON.stringify({id:s.id,active:false})}); } }catch(e){ out.list_praleistas=String(e).slice(0,80); }
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP PS '+VER,
    code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'create');
  const ct=await c.text(); out.kurimas=c.status; try{sid=JSON.parse(ct).id; out.sid=sid;}catch(e){out.kurimo_atsakas=ct.slice(0,400);}
  await miegok(9000);
  for(let i=0;i<PHASES.length;i++){
    const f=PHASES[i];
    if(i>0) await miegok(5000);
    const d=await fx(WP+'/?'+GKEY+'='+encodeURIComponent(f),{headers:UA},'faze_'+f);
    const t=await d.text();
    try{ out[f]=JSON.parse(t); }catch(e){ out['zalias_'+f]=t.slice(0,3000); }
  }
}catch(e){ out.klaida=String(e).slice(0,500); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put(OUT, Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
