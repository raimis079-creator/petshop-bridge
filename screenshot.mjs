process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNTQ5IFNFTyByZWNvbiB2MSAocmV6dWx0YXRhaS9mYWt0YWkvMzAxL3NhcmdhcyBzdHJ1a3TFq3JhKSAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3NlbyddKXx8JF9HRVRbJ3BzX3NlbyddIT09J1InKSByZXR1cm47CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICBnbG9iYWwgJHdwZGI7ICRvPWFycmF5KCd2Jz0+J1MxNTQ5UicpOyAkbXU9V1BNVV9QTFVHSU5fRElSOwogIHRyeXsKICAgIGZvcmVhY2goYXJyYXkoJ3BldHNob3AtcmV6dWx0YXRhaS5waHAnLCdwZXRzaG9wLWZha3RhaS5waHAnLCdwZXRzaG9wLWxlZ2FjeS0zMDEucGhwJywncGV0c2hvcC1zYXJnYXMucGhwJywncGV0c2hvcC1hdGFza2FpdHUtYWdyZWdhdmltYXMucGhwJywncGV0c2hvcC1pc3Rvcmlqb3MtYWRhcHRlcmlzLnBocCcpIGFzICRmKXsKICAgICAgJHA9IiRtdS8kZiI7ICRvWydmYWlsYWknXVskZl09ZmlsZV9leGlzdHMoJHApP2FycmF5KCdCJz0+ZmlsZXNpemUoJHApLCdtZDUnPT5tZDVfZmlsZSgkcCkpOm51bGw7IH0KICAgIC8vIHJlenVsdGF0YWk6IG1lbnUvc3VibWVudS90YWJzCiAgICAkYz1maWxlX2dldF9jb250ZW50cygiJG11L3BldHNob3AtcmV6dWx0YXRhaS5waHAiKTsKICAgIHByZWdfbWF0Y2hfYWxsKCIvYWRkXyg/OnN1Yik/bWVudV9wYWdlXCgoLnswLDIwMH0pL3MiLCRjLCRtKTsgJG9bJ3Jlel9tZW51J109YXJyYXlfbWFwKGZuKCR4KT0+c3Vic3RyKHByZWdfcmVwbGFjZSgnL1xzKy8nLCcgJywkeCksMCwxODApLCRtWzFdKTsKICAgIHByZWdfbWF0Y2hfYWxsKCIvY2xhc3NccysoXHcrKS8iLCRjLCRtKTsgJG9bJ3Jlel9rbGFzZXMnXT0kbVsxXTsKICAgIHByZWdfbWF0Y2hfYWxsKCIvZnVuY3Rpb25ccysoXHcrKVxzKlwoLyIsJGMsJG0pOyAkb1sncmV6X2ZuJ109JG1bMV07CiAgICBwcmVnX21hdGNoX2FsbCgiL1snXCJdKHRhYnxza2lydHVrYXN8dClbJ1wiXVxzKj0+XHMqWydcIl0oW1x3LV0rKS8iLCRjLCRtKTsgJG9bJ3Jlel90YWJzJ109YXJyYXlfdW5pcXVlKCRtWzJdKTsKICAgICRvWydyZXpfaGVhZCddPXN1YnN0cigkYywwLDE1MDApOwogICAgLy8gaXN0IGFkYXB0ZXJpczogaG93IGEgd2luZG93IHJlZ2lzdGVycyAobWVudSBzbHVnIHBhdHRlcm4pCiAgICAkYT1maWxlX2dldF9jb250ZW50cygiJG11L3BldHNob3AtaXN0b3Jpam9zLWFkYXB0ZXJpcy5waHAiKTsKICAgIHByZWdfbWF0Y2hfYWxsKCIvYWRkXyg/OnN1Yik/bWVudV9wYWdlXCgoLnswLDE2MH0pL3MiLCRhLCRtKTsgJG9bJ2FkX21lbnUnXT1hcnJheV9tYXAoZm4oJHgpPT5zdWJzdHIocHJlZ19yZXBsYWNlKCcvXHMrLycsJyAnLCR4KSwwLDE2MCksJG1bMV0pOwogICAgJGs9ZmlsZV9nZXRfY29udGVudHMoIiRtdS9wZXRzaG9wLWF0YXNrYWl0YS1rbGllbnRhaS5waHAiKTsKICAgIHByZWdfbWF0Y2hfYWxsKCIvYWRkXyg/OnN1Yik/bWVudV9wYWdlXCgoLnswLDIwMH0pL3MiLCRrLCRtKTsgJG9bJ2tsX21lbnUnXT1hcnJheV9tYXAoZm4oJHgpPT5zdWJzdHIocHJlZ19yZXBsYWNlKCcvXHMrLycsJyAnLCR4KSwwLDIwMCksJG1bMV0pOwogICAgJG9bJ2tsX2hlYWQnXT1zdWJzdHIoJGssMCwyNTAwKTsKICAgIC8vIGFsbCBQZXRzaG9wIGFkbWluIG1lbnVzCiAgICBmb3JlYWNoKGdsb2IoIiRtdS8qLnBocCIpIGFzICRmKXsgJHM9ZmlsZV9nZXRfY29udGVudHMoJGYpOyBpZihwcmVnX21hdGNoX2FsbCgiL2FkZF9zdWJtZW51X3BhZ2VcKFxzKlsnXCJdKFtcdy1dKylbJ1wiXVxzKixccypbJ1wiXShbXidcIl0rKVsnXCJdXHMqLFxzKlsnXCJdKFteJ1wiXSspWydcIl1ccyosXHMqWydcIl1bXidcIl0rWydcIl1ccyosXHMqWydcIl0oW1x3LV0rKS8iLCRzLCRtLFBSRUdfU0VUX09SREVSKSkgZm9yZWFjaCgkbSBhcyAkeCkgJG9bJ3N1Ym1lbnVzJ11bXT1iYXNlbmFtZSgkZikuJzogJy4keFsxXS4nIOKGkiAnLiR4WzNdLicgWycuJHhbNF0uJ10nOyB9CiAgICAvLyBmYWt0IERETCBwYXR0ZXJuCiAgICAkb1snZGRsX2Zha3Rfc2l1bnRvcyddPSR3cGRiLT5nZXRfcm93KCJTSE9XIENSRUFURSBUQUJMRSB7JHdwZGItPnByZWZpeH1wc19mYWt0X3NpdW50b3MiLEFSUkFZX04pWzFdPz9udWxsOwogICAgLy8gMzAxIG1hcCBmb3JtYXQKICAgICRqPWpzb25fZGVjb2RlKGZpbGVfZ2V0X2NvbnRlbnRzKCIkbXUvcGV0c2hvcC1sZWdhY3ktMzAxLW1hcC5qc29uIiksdHJ1ZSk7ICRvWydtYXBfbiddPWlzX2FycmF5KCRqKT9jb3VudCgkaik6bnVsbDsgJG9bJ21hcF9zYW1wbGUnXT1pc19hcnJheSgkaik/YXJyYXlfc2xpY2UoJGosMCwzLHRydWUpOm51bGw7ICRvWydtYXBfYXNzb2MnXT1pc19hcnJheSgkaik/KGFycmF5X2tleXMoJGopIT09cmFuZ2UoMCxjb3VudCgkaiktMSkpOm51bGw7CiAgICAkb1snbGVnYWN5MzAxX3NyYyddPWZpbGVfZ2V0X2NvbnRlbnRzKCIkbXUvcGV0c2hvcC1sZWdhY3ktMzAxLnBocCIpOwogICAgLy8gNDA0IGxvZ2dpbmcgYW55d2hlcmU/CiAgICAkb1sndGFibGVzXzQwNCddPSR3cGRiLT5nZXRfY29sKCJTSE9XIFRBQkxFUyBMSUtFICd7JHdwZGItPnByZWZpeH1wc18lNDA0JSciKTsKICAgICRvWyd0YWJsZXNfc2VvJ109JHdwZGItPmdldF9jb2woIlNIT1cgVEFCTEVTIExJS0UgJ3skd3BkYi0+cHJlZml4fXBzXyVzZW8lJyIpOwogICAgJG9bJ3RhYmxlc19nc2MnXT0kd3BkYi0+Z2V0X2NvbCgiU0hPVyBUQUJMRVMgTElLRSAneyR3cGRiLT5wcmVmaXh9cHNfJWdzYyUnIik7CiAgICAkaGl0cz1hcnJheSgpOyBmb3JlYWNoKGdsb2IoIiRtdS8qLnBocCIpIGFzICRmKXsgJHM9ZmlsZV9nZXRfY29udGVudHMoJGYpOyBpZihwcmVnX21hdGNoKCIvNDA0fHRlbXBsYXRlX3JlZGlyZWN0LyIsJHMpKSAkaGl0c1tdPWJhc2VuYW1lKCRmKTsgfSAkb1snbXVfNDA0X2hpdHMnXT0kaGl0czsKICAgIC8vIHNhcmdhcyBjcm9uIHBhdHRlcm4KICAgICRzZz1maWxlX2dldF9jb250ZW50cygiJG11L3BldHNob3Atc2FyZ2FzLnBocCIpOyBwcmVnX21hdGNoX2FsbCgiLyh3cF9zY2hlZHVsZV9ldmVudHxhZGRfYWN0aW9uXCgnW1x3X10rX2Nyb25bXHdfXSonfHJlZ2lzdGVyX2FjdGl2YXRpb24pW15cbl17MCwxMjB9LyIsJHNnLCRtKTsgJG9bJ3Nhcmdhc19jcm9uJ109JG1bMF07CiAgICAvLyByYW5rIG1hdGgKICAgICRybT1nZXRfb3B0aW9uKCdyYW5rLW1hdGgtb3B0aW9ucy1zaXRlbWFwJyk7ICRvWydybV9zaXRlbWFwJ109YXJyYXkoJ2V4aXN0cyc9PmlzX2FycmF5KCRybSksJ2xpbmtzX3Blcl9zaXRlbWFwJz0+JHJtWydpdGVtc19wZXJfcGFnZSddPz9udWxsKTsKICAgICRvWydibG9nX3B1YmxpYyddPWdldF9vcHRpb24oJ2Jsb2dfcHVibGljJyk7ICRvWydob21lJ109aG9tZV91cmwoKTsKICAgICRvWydzaXRlbWFwX2h0dHAnXT13cF9yZW1vdGVfcmV0cmlldmVfcmVzcG9uc2VfY29kZSh3cF9yZW1vdGVfaGVhZChob21lX3VybCgnL3NpdGVtYXBfaW5kZXgueG1sJyksYXJyYXkoJ3RpbWVvdXQnPT44KSkpOwogICAgJG9bJ3BzX2Nyb25zJ109YXJyYXlfdmFsdWVzKGFycmF5X2ZpbHRlcihhcnJheV9rZXlzKGFycmF5X21lcmdlKC4uLmFycmF5X3ZhbHVlcyhhcnJheV9maWx0ZXIoX2dldF9jcm9uX2FycmF5KCksJ2lzX2FycmF5JykpKSksZm4oJGgpPT5zdHJfc3RhcnRzX3dpdGgoJGgsJ3BzXycpfHxzdHJfY29udGFpbnMoJGgsJ3BldHNob3AnKSkpOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTKTsgZXhpdDsKfSk7Cg==';
const VER='dep-075524';
const GKEY='ps_seo';
const PHASES=["R"];
const OUT='recon_seo.json';
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
