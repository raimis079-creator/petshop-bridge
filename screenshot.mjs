process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uICgpIHsKICAgIGlmICghaXNzZXQoJF9HRVRbJ3BzX2V4NTMnXSkpIHJldHVybjsKICAgIEBzZXRfdGltZV9saW1pdCgyODApOyBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7ICRvPVsnVkVSU0lKQSc9PidTMTU5OS1BMiddOwogICAgJG51bz0nMjAyNS0wNi0wMSc7CiAgICAkb1snYXBpbXRpcyddPSR3cGRiLT5nZXRfcm93KCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgQ09VTlQoRElTVElOQ1QgdXpzYWt5bWFzX2lkKSB1LCBDT1VOVCgqKSBlLCBTVU0oa2FpbmFfY3QpLzEwMCBzdW1hIEZST00geyRwfXBzX2lzdF9mYWt0X2VpbHV0ZXMgV0hFUkUgYXBtb2tldGFfYXQ+PSVzIEFORCB0ZXN0aW5pcz0wIiwkbnVvKSxBUlJBWV9BKTsKICAgICRvWydtdWx0aSddPSR3cGRiLT5nZXRfcm93KCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgU1VNKG4+PTIpIG11bHRpLCBDT1VOVCgqKSB2aXNvIEZST00gKFNFTEVDVCB1enNha3ltYXNfaWQsIENPVU5UKERJU1RJTkNUIHByZWtlX2lkKSBuIEZST00geyRwfXBzX2lzdF9mYWt0X2VpbHV0ZXMgV0hFUkUgYXBtb2tldGFfYXQ+PSVzIEFORCB0ZXN0aW5pcz0wIEdST1VQIEJZIHV6c2FreW1hc19pZCkgeCIsJG51byksQVJSQVlfQSk7CiAgICAvLyAxLiBrYXRlZ29yaWpvcwogICAgJG9bJ2thdCddPSR3cGRiLT5nZXRfcmVzdWx0cygkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIGthdGVnb3JpanVfa2VsaWFzIGssIENPVU5UKERJU1RJTkNUIHV6c2FreW1hc19pZCkgdSwgU1VNKGtpZWtpcykgdm50LCBST1VORChTVU0oa2FpbmFfY3QpLzEwMCkgc3VtYSBGUk9NIHskcH1wc19pc3RfZmFrdF9laWx1dGVzIFdIRVJFIGFwbW9rZXRhX2F0Pj0lcyBBTkQgdGVzdGluaXM9MCBHUk9VUCBCWSBrIE9SREVSIEJZIHN1bWEgREVTQyBMSU1JVCAyNSIsJG51byksQVJSQVlfQSk7CiAgICAvLyAyLiBrYXRlZ29yaWp1IHBvcm9zIChnaWxpYXVzaWEpCiAgICAkcm93cz0kd3BkYi0+Z2V0X3Jlc3VsdHMoJHdwZGItPnByZXBhcmUoIlNFTEVDVCB1enNha3ltYXNfaWQgdSwgcHJla2VfaWQgcGlkLCBrYXRlZ29yaWp1X2tlbGlhcyBrLCBicmVuZGFzX3NsdWcgYiBGUk9NIHskcH1wc19pc3RfZmFrdF9laWx1dGVzIFdIRVJFIGFwbW9rZXRhX2F0Pj0lcyBBTkQgdGVzdGluaXM9MCBBTkQgcHJla2VfaWQ+MCIsJG51byksQVJSQVlfQSk7CiAgICAkb3JkPVtdOyBmb3JlYWNoICgkcm93cyBhcyAkcikgeyAkb3JkWyRyWyd1J11dWyRyWydwaWQnXV09WyRyWydrJ10sJHJbJ2InXV07IH0KICAgICRrcD1bXTsgJHBwPVtdOwogICAgZm9yZWFjaCAoJG9yZCBhcyAkdT0+JGl0ZW1zKSB7IGlmIChjb3VudCgkaXRlbXMpPDIpIGNvbnRpbnVlOyAkcGlkcz1hcnJheV9rZXlzKCRpdGVtcyk7IHNvcnQoJHBpZHMpOwogICAgICAgIGZvciAoJGk9MDskaTxjb3VudCgkcGlkcyk7JGkrKykgZm9yICgkaj0kaSsxOyRqPGNvdW50KCRwaWRzKTskaisrKSB7ICRhPSRwaWRzWyRpXTsgJGI9JHBpZHNbJGpdOyAkcHBbIiRhfCRiIl09KCRwcFsiJGF8JGIiXT8/MCkrMTsgJGthPSRpdGVtc1skYV1bMF07ICRrYj0kaXRlbXNbJGJdWzBdOyBpZiAoJGthPT09JGtiKSBjb250aW51ZTsgJGtrPVska2EsJGtiXTsgc29ydCgka2spOyAka2V5PWltcGxvZGUoJyArICcsJGtrKTsgJGtwWyRrZXldPSgka3BbJGtleV0/PzApKzE7IH0gfQogICAgYXJzb3J0KCRrcCk7ICRvWydrYXRfcG9yb3MnXT1hcnJheV9zbGljZSgka3AsMCwzMCx0cnVlKTsKICAgIGFyc29ydCgkcHApOyAkdG9wPWFycmF5X3NsaWNlKCRwcCwwLDMwMDAsdHJ1ZSk7CiAgICAvLyBXQyBpbmZvCiAgICAkaW5mbz1mdW5jdGlvbigkaWQpeyBzdGF0aWMgJGM9W107IGlmKGlzc2V0KCRjWyRpZF0pKSByZXR1cm4gJGNbJGlkXTsgJHByPXdjX2dldF9wcm9kdWN0KCRpZCk7IGlmKCEkcHJ8fCRwci0+Z2V0X3N0YXR1cygpIT09J3B1Ymxpc2gnKXsgcmV0dXJuICRjWyRpZF09bnVsbDsgfSAkc3JjPWFycmF5X21hcChmbigkcyk9PiRzWydzb3VyY2UnXSxhcnJheV9maWx0ZXIoUGV0c2hvcF9Tb3VyY2VzOjpzYWx0aW5pYWkoJGlkKVsnc2FsdGluaWFpJ10/P1tdLGZuKCRzKT0+JHNbJ2lzX2FjdGl2ZSddJiYoaW50KSRzWydzdG9ja19xdHknXT4wKSk7ICRjb3N0PShmbG9hdClnZXRfcG9zdF9tZXRhKCRpZCwnX2Nvc3RfcHJpY2UnLHRydWUpOyBmb3JlYWNoKFsnX3ZmX2Nvc3QnLCdfemJfY29zdCddIGFzICRrKXsgJHY9KGZsb2F0KWdldF9wb3N0X21ldGEoJGlkLCRrLHRydWUpOyBpZigkY29zdDw9MCYmJHY+MCkkY29zdD0kdjsgfSByZXR1cm4gJGNbJGlkXT1bJ3Bhdic9Pm1iX3N1YnN0cigkcHItPmdldF9uYW1lKCksMCw1NSksJ2thaW5hJz0+KGZsb2F0KSRwci0+Z2V0X3ByaWNlKCksJ3Nhdic9PiRjb3N0LCdzYW5kJz0+Z2V0X3Bvc3RfbWV0YSgkaWQsJ19wc19zYW5kZWxpcycsdHJ1ZSksJ3NyYyc9PmFycmF5X3ZhbHVlcygkc3JjKSwna2F0Jz0+aW1wbG9kZSgnLycsd3BfZ2V0X3Bvc3RfdGVybXMoJGlkLCdwcm9kdWN0X2NhdCcsWydmaWVsZHMnPT4nc2x1Z3MnXSkpLCdzdG9jayc9PihpbnQpJHByLT5nZXRfc3RvY2tfcXVhbnRpdHkoKV07IH07CiAgICAkb3V0PVtdOyBmb3JlYWNoICgkdG9wIGFzICRrZXk9PiRuKSB7IGlmICgkbjwzKSBicmVhazsgWyRhLCRiXT1leHBsb2RlKCd8Jywka2V5KTsgJGlhPSRpbmZvKChpbnQpJGEpOyAkaWI9JGluZm8oKGludCkkYik7IGlmKCEkaWF8fCEkaWIpIGNvbnRpbnVlOwogICAgICAgICRkZXplPShwcmVnX21hdGNoKCcva29uc2Vydi8nLCRpYVsna2F0J10pJiZwcmVnX21hdGNoKCcva29uc2Vydi8nLCRpYlsna2F0J10pKXx8KHByZWdfbWF0Y2goJy9za2FuZXN0LycsJGlhWydrYXQnXSkmJnByZWdfbWF0Y2goJy9za2FuZXN0LycsJGliWydrYXQnXSkpOyAKICAgICAgICAkYmVuZHJhcz1hcnJheV92YWx1ZXMoYXJyYXlfaW50ZXJzZWN0KCRpYVsnc3JjJ10sJGliWydzcmMnXSkpOwogICAgICAgIGlmICgkZGV6ZSkgY29udGludWU7ICRvdXRbXT1bJ24nPT4kbiwnYSc9PiRhLCdiJz0+JGIsJ0EnPT4kaWFbJ3BhdiddLCdCJz0+JGliWydwYXYnXSwna2F0QSc9PiRpYVsna2F0J10sJ2thdEInPT4kaWJbJ2thdCddLCdzYW5kQSc9PiRpYVsnc2FuZCddLCdzYW5kQic9PiRpYlsnc2FuZCddLCdiZW5kcmFzJz0+JGJlbmRyYXMsJ3N1bWEnPT5yb3VuZCgkaWFbJ2thaW5hJ10rJGliWydrYWluYSddLDIpLCdzYXYnPT5yb3VuZCgkaWFbJ3NhdiddKyRpYlsnc2F2J10sMiksJ2RlemUnPT4kZGV6ZT8xOjBdOyBpZiAoY291bnQoJG91dCk+PTgwKSBicmVhazsgfQogICAgJG9bJ3Bvcm9zJ109JG91dDsKICAgIC8vIGJyYW5kLWxldmVsOiBzYXVzYXMgKyBrb25zZXJ2YWkvc2thbmVzdGFpIHRvIHBhdGllcyBicmVuZG8KICAgICRicD1bXTsgZm9yZWFjaCAoJG9yZCBhcyAkdT0+JGl0ZW1zKSB7ICRicz1bXTsgZm9yZWFjaCAoJGl0ZW1zIGFzICRwaWQ9PiR4KSB7ICRic1skeFsxXV1bXT0keFswXTsgfSBmb3JlYWNoICgkYnMgYXMgJGI9PiRrcykgeyAka3M9YXJyYXlfdW5pcXVlKCRrcyk7IGlmIChjb3VudCgka3MpPj0yICYmICRiKSB7ICRicFskYl09KCRicFskYl0/PzApKzE7IH0gfSB9IGFyc29ydCgkYnApOyAkb1snYnJhbmRfbXVsdGknXT1hcnJheV9zbGljZSgkYnAsMCwxMix0cnVlKTsgJGJrPVtdOyBmb3JlYWNoICgkb3JkIGFzICR1PT4kaXRlbXMpIHsgJGJzPVtdOyBmb3JlYWNoICgkaXRlbXMgYXMgJHBpZD0+JHgpIHsgJGJzWyR4WzFdXVtdPXByZWdfcmVwbGFjZSgnL14uKiA+IC8nLCcnLCR4WzBdKTsgfSBmb3JlYWNoICgkYnMgYXMgJGI9PiRrcykgeyAka3M9YXJyYXlfdW5pcXVlKCRrcyk7IHNvcnQoJGtzKTsgaWYgKGNvdW50KCRrcyk+PTIgJiYgaW5fYXJyYXkoJGIsWydleGNsdXNpb24nLCdvbnRhcmlvJywnam9zZXJhJywnYW5pbW9uZGEnLCdwZXNzJywnbWlhbW9yJ10pKSB7ICRrPSRiLic6ICcuaW1wbG9kZSgnICsgJywka3MpOyAkYmtbJGtdPSgkYmtbJGtdPz8wKSsxOyB9IH0gfSBhcnNvcnQoJGJrKTsgJG9bJ2JyYW5kX2thdCddPWFycmF5X3NsaWNlKCRiaywwLDI1LHRydWUpOwogICAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fSU5WQUxJRF9VVEY4X1NVQlNUSVRVVEUpOyBleGl0Owp9KTsK';
const VER='dep-125311';
const GKEY='ps_ex53';
const PHASES=["R"];
const OUT='analize/s1599_b.json';
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
