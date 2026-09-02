process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uICgpIHsKICAgIGlmICghaXNzZXQoJF9HRVRbJ3BzX2V4NTInXSkpIHJldHVybjsKICAgIEBzZXRfdGltZV9saW1pdCgyODApOyBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7ICRvPVsnVkVSU0lKQSc9PidTMTU5OS1BMSddOwogICAgJG51bz0nMjAyNS0wNi0wMSc7CiAgICAkb1snYXBpbXRpcyddPSR3cGRiLT5nZXRfcm93KCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgQ09VTlQoRElTVElOQ1QgdXpzYWt5bWFzX2lkKSB1LCBDT1VOVCgqKSBlLCBTVU0oa2FpbmFfY3QpLzEwMCBzdW1hIEZST00geyRwfXBzX2lzdF9mYWt0X2VpbHV0ZXMgV0hFUkUgYXBtb2tldGFfYXQ+PSVzIEFORCB0ZXN0aW5pcz0wIiwkbnVvKSxBUlJBWV9BKTsKICAgICRvWydtdWx0aSddPSR3cGRiLT5nZXRfcm93KCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgU1VNKG4+PTIpIG11bHRpLCBDT1VOVCgqKSB2aXNvIEZST00gKFNFTEVDVCB1enNha3ltYXNfaWQsIENPVU5UKERJU1RJTkNUIHByZWtlX2lkKSBuIEZST00geyRwfXBzX2lzdF9mYWt0X2VpbHV0ZXMgV0hFUkUgYXBtb2tldGFfYXQ+PSVzIEFORCB0ZXN0aW5pcz0wIEdST1VQIEJZIHV6c2FreW1hc19pZCkgeCIsJG51byksQVJSQVlfQSk7CiAgICAvLyAxLiBrYXRlZ29yaWpvcwogICAgJG9bJ2thdCddPSR3cGRiLT5nZXRfcmVzdWx0cygkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIGthdGVnb3JpanVfa2VsaWFzIGssIENPVU5UKERJU1RJTkNUIHV6c2FreW1hc19pZCkgdSwgU1VNKGtpZWtpcykgdm50LCBST1VORChTVU0oa2FpbmFfY3QpLzEwMCkgc3VtYSBGUk9NIHskcH1wc19pc3RfZmFrdF9laWx1dGVzIFdIRVJFIGFwbW9rZXRhX2F0Pj0lcyBBTkQgdGVzdGluaXM9MCBHUk9VUCBCWSBrIE9SREVSIEJZIHN1bWEgREVTQyBMSU1JVCAyNSIsJG51byksQVJSQVlfQSk7CiAgICAvLyAyLiBrYXRlZ29yaWp1IHBvcm9zIChnaWxpYXVzaWEpCiAgICAkcm93cz0kd3BkYi0+Z2V0X3Jlc3VsdHMoJHdwZGItPnByZXBhcmUoIlNFTEVDVCB1enNha3ltYXNfaWQgdSwgcHJla2VfaWQgcGlkLCBrYXRlZ29yaWp1X2tlbGlhcyBrLCBicmVuZGFzX3NsdWcgYiBGUk9NIHskcH1wc19pc3RfZmFrdF9laWx1dGVzIFdIRVJFIGFwbW9rZXRhX2F0Pj0lcyBBTkQgdGVzdGluaXM9MCBBTkQgcHJla2VfaWQ+MCIsJG51byksQVJSQVlfQSk7CiAgICAkb3JkPVtdOyBmb3JlYWNoICgkcm93cyBhcyAkcikgeyAkb3JkWyRyWyd1J11dWyRyWydwaWQnXV09WyRyWydrJ10sJHJbJ2InXV07IH0KICAgICRrcD1bXTsgJHBwPVtdOwogICAgZm9yZWFjaCAoJG9yZCBhcyAkdT0+JGl0ZW1zKSB7IGlmIChjb3VudCgkaXRlbXMpPDIpIGNvbnRpbnVlOyAkcGlkcz1hcnJheV9rZXlzKCRpdGVtcyk7IHNvcnQoJHBpZHMpOwogICAgICAgIGZvciAoJGk9MDskaTxjb3VudCgkcGlkcyk7JGkrKykgZm9yICgkaj0kaSsxOyRqPGNvdW50KCRwaWRzKTskaisrKSB7ICRhPSRwaWRzWyRpXTsgJGI9JHBpZHNbJGpdOyAkcHBbIiRhfCRiIl09KCRwcFsiJGF8JGIiXT8/MCkrMTsgJGthPSRpdGVtc1skYV1bMF07ICRrYj0kaXRlbXNbJGJdWzBdOyBpZiAoJGthPT09JGtiKSBjb250aW51ZTsgJGtrPVska2EsJGtiXTsgc29ydCgka2spOyAka2V5PWltcGxvZGUoJyArICcsJGtrKTsgJGtwWyRrZXldPSgka3BbJGtleV0/PzApKzE7IH0gfQogICAgYXJzb3J0KCRrcCk7ICRvWydrYXRfcG9yb3MnXT1hcnJheV9zbGljZSgka3AsMCwzMCx0cnVlKTsKICAgIGFyc29ydCgkcHApOyAkdG9wPWFycmF5X3NsaWNlKCRwcCwwLDQwMCx0cnVlKTsKICAgIC8vIFdDIGluZm8KICAgICRpbmZvPWZ1bmN0aW9uKCRpZCl7IHN0YXRpYyAkYz1bXTsgaWYoaXNzZXQoJGNbJGlkXSkpIHJldHVybiAkY1skaWRdOyAkcHI9d2NfZ2V0X3Byb2R1Y3QoJGlkKTsgaWYoISRwcnx8JHByLT5nZXRfc3RhdHVzKCkhPT0ncHVibGlzaCcpeyByZXR1cm4gJGNbJGlkXT1udWxsOyB9ICRzcmM9YXJyYXlfbWFwKGZuKCRzKT0+JHNbJ3NvdXJjZSddLGFycmF5X2ZpbHRlcihQZXRzaG9wX1NvdXJjZXM6OnNhbHRpbmlhaSgkaWQpWydzYWx0aW5pYWknXT8/W10sZm4oJHMpPT4kc1snaXNfYWN0aXZlJ10mJihpbnQpJHNbJ3N0b2NrX3F0eSddPjApKTsgJGNvc3Q9KGZsb2F0KWdldF9wb3N0X21ldGEoJGlkLCdfY29zdF9wcmljZScsdHJ1ZSk7IGZvcmVhY2goWydfdmZfY29zdCcsJ196Yl9jb3N0J10gYXMgJGspeyAkdj0oZmxvYXQpZ2V0X3Bvc3RfbWV0YSgkaWQsJGssdHJ1ZSk7IGlmKCRjb3N0PD0wJiYkdj4wKSRjb3N0PSR2OyB9IHJldHVybiAkY1skaWRdPVsncGF2Jz0+bWJfc3Vic3RyKCRwci0+Z2V0X25hbWUoKSwwLDU1KSwna2FpbmEnPT4oZmxvYXQpJHByLT5nZXRfcHJpY2UoKSwnc2F2Jz0+JGNvc3QsJ3NhbmQnPT5nZXRfcG9zdF9tZXRhKCRpZCwnX3BzX3NhbmRlbGlzJyx0cnVlKSwnc3JjJz0+YXJyYXlfdmFsdWVzKCRzcmMpLCdrYXQnPT5pbXBsb2RlKCcvJyx3cF9nZXRfcG9zdF90ZXJtcygkaWQsJ3Byb2R1Y3RfY2F0JyxbJ2ZpZWxkcyc9PidzbHVncyddKSksJ3N0b2NrJz0+KGludCkkcHItPmdldF9zdG9ja19xdWFudGl0eSgpXTsgfTsKICAgICRvdXQ9W107IGZvcmVhY2ggKCR0b3AgYXMgJGtleT0+JG4pIHsgaWYgKCRuPDQpIGJyZWFrOyBbJGEsJGJdPWV4cGxvZGUoJ3wnLCRrZXkpOyAkaWE9JGluZm8oKGludCkkYSk7ICRpYj0kaW5mbygoaW50KSRiKTsgaWYoISRpYXx8ISRpYikgY29udGludWU7CiAgICAgICAgJGRlemU9KHByZWdfbWF0Y2goJy9rb25zZXJ2LycsJGlhWydrYXQnXSkmJnByZWdfbWF0Y2goJy9rb25zZXJ2LycsJGliWydrYXQnXSkpfHwocHJlZ19tYXRjaCgnL3NrYW5lc3QvJywkaWFbJ2thdCddKSYmcHJlZ19tYXRjaCgnL3NrYW5lc3QvJywkaWJbJ2thdCddKSk7IAogICAgICAgICRiZW5kcmFzPWFycmF5X3ZhbHVlcyhhcnJheV9pbnRlcnNlY3QoJGlhWydzcmMnXSwkaWJbJ3NyYyddKSk7CiAgICAgICAgJG91dFtdPVsnbic9PiRuLCdhJz0+JGEsJ2InPT4kYiwnQSc9PiRpYVsncGF2J10sJ0InPT4kaWJbJ3BhdiddLCdrYXRBJz0+JGlhWydrYXQnXSwna2F0Qic9PiRpYlsna2F0J10sJ3NhbmRBJz0+JGlhWydzYW5kJ10sJ3NhbmRCJz0+JGliWydzYW5kJ10sJ2JlbmRyYXMnPT4kYmVuZHJhcywnc3VtYSc9PnJvdW5kKCRpYVsna2FpbmEnXSskaWJbJ2thaW5hJ10sMiksJ3Nhdic9PnJvdW5kKCRpYVsnc2F2J10rJGliWydzYXYnXSwyKSwnZGV6ZSc9PiRkZXplPzE6MF07IGlmIChjb3VudCgkb3V0KT49ODApIGJyZWFrOyB9CiAgICAkb1sncG9yb3MnXT0kb3V0OwogICAgLy8gYnJhbmQtbGV2ZWw6IHNhdXNhcyArIGtvbnNlcnZhaS9za2FuZXN0YWkgdG8gcGF0aWVzIGJyZW5kbwogICAgJGJwPVtdOyBmb3JlYWNoICgkb3JkIGFzICR1PT4kaXRlbXMpIHsgJGJzPVtdOyBmb3JlYWNoICgkaXRlbXMgYXMgJHBpZD0+JHgpIHsgJGJzWyR4WzFdXVtdPSR4WzBdOyB9IGZvcmVhY2ggKCRicyBhcyAkYj0+JGtzKSB7ICRrcz1hcnJheV91bmlxdWUoJGtzKTsgaWYgKGNvdW50KCRrcyk+PTIgJiYgJGIpIHsgJGJwWyRiXT0oJGJwWyRiXT8/MCkrMTsgfSB9IH0gYXJzb3J0KCRicCk7ICRvWydicmFuZF9tdWx0aSddPWFycmF5X3NsaWNlKCRicCwwLDIwLHRydWUpOwogICAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fSU5WQUxJRF9VVEY4X1NVQlNUSVRVVEUpOyBleGl0Owp9KTsK';
const VER='dep-125128';
const GKEY='ps_ex52';
const PHASES=["R"];
const OUT='analize/s1599_a.json';
const DATA=[];
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
  let dq='';
  if(DATA.length){ out.data={}; for(const p of DATA){ const name=p.split('/').pop();
      const g=await fx('https://api.github.com/repos/'+REPO+'/contents/'+p,{headers:{Authorization:'Bearer '+TOK,Accept:'application/vnd.github.raw+json'}},'gh_'+name);
      const buf=Buffer.from(await g.arrayBuffer());
      const m=await fx(WP+'/wp-json/wp/v2/media',{method:'POST',headers:{Authorization:AUTH,'Content-Type':'text/plain','Content-Disposition':'attachment; filename="'+name+'"'},body:buf},'media_'+name);
      const mt=await m.text(); try{ const j=JSON.parse(mt); out.data[name]={id:j.id,status:m.status}; dq+='&d_'+name.replace(/\W/g,'_')+'='+j.id; }catch(e){ out.data[name]={status:m.status,err:mt.slice(0,200)}; } } }
  await miegok(9000);
  if(process.env.GTM_SA_JSON){ try{ const sr=await fx(WP+'/wp-json/ps-seo-temp/v1/sa',{method:'POST',headers:{Authorization:AUTH,'Content-Type':'text/plain'},body:process.env.GTM_SA_JSON},'sa'); out.sa_push={status:sr.status,body:(await sr.text()).slice(0,200)}; }catch(e){ out.sa_push=String(e).slice(0,200);} }
  for(let i=0;i<PHASES.length;i++){
    const f=PHASES[i];
    if(i>0) await miegok(5000);
    const d=await fx(WP+'/?'+GKEY+'='+encodeURIComponent(f)+dq,{headers:UA},'faze_'+f);
    const t=await d.text();
    try{ out[f]=JSON.parse(t); }catch(e){ out['zalias_'+f]=t.slice(0,3000); }
  }
}catch(e){ out.klaida=String(e).slice(0,500); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put(OUT, Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
