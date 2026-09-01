process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNTU1YiBTdXBlciBDYWNoZSBkaWFnbm9zdGlrYSAoa29kxJdsIG5lIHNlcnZlJ2luYSkgKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgJGY9aXNzZXQoJF9HRVRbJ3BzX3NlbyddKT8kX0dFVFsncHNfc2VvJ106Jyc7IGlmKCRmIT09J1InKSByZXR1cm47CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZ2xvYmFsICR3cGRiOyAkbz1hcnJheSgndic9PidTMTU1NWInKTsgQHNldF90aW1lX2xpbWl0KDI1MCk7CiAgdHJ5ewogICAgJHNjPVdQX0NPTlRFTlRfRElSLicvY2FjaGUvc3VwZXJjYWNoZS8nOyAkb1snaG9zdHMnXT1hcnJheV9tYXAoJ2Jhc2VuYW1lJyxnbG9iKCRzYy4nKicsR0xPQl9PTkxZRElSKSk7CiAgICAkd2Fsaz1mdW5jdGlvbigkZCwkZGVwdGg9MCkgdXNlICgmJHdhbGspeyAkcj1hcnJheSgpOyBmb3JlYWNoKGdsb2IoJGQuJy8qJykgYXMgJHgpeyAkbj1zdHJfcmVwbGFjZShXUF9DT05URU5UX0RJUi4nL2NhY2hlL3N1cGVyY2FjaGUvJywnJywkeCk7IGlmKGlzX2RpcigkeCkpeyBpZigkZGVwdGg8NCkgJHI9YXJyYXlfbWVyZ2UoJHIsJHdhbGsoJHgsJGRlcHRoKzEpKTsgfSBlbHNlICRyW109JG4uJyAnLmZpbGVzaXplKCR4KS4nQiAnLmRhdGUoJ0g6aTpzJyxmaWxlbXRpbWUoJHgpKTsgfSByZXR1cm4gJHI7IH07CiAgICAkb1snZmlsZXMnXT1hcnJheV9zbGljZSgkd2FsayhydHJpbSgkc2MsJy8nKSksMCw0MCk7CiAgICAkb1snd3BfY2FjaGVfZGlyJ109YXJyYXlfc2xpY2UoYXJyYXlfbWFwKGZuKCR4KT0+YmFzZW5hbWUoJHgpLicgJy5maWxlc2l6ZSgkeCksZ2xvYihXUF9DT05URU5UX0RJUi4nL2NhY2hlL3dwLWNhY2hlLSonKSksMCwxMCk7CiAgICAvLyBwaWxuaSBoZWFkZXInaWFpICsga29tZW50YXJhcwogICAgJHVybHM9YXJyYXkoJ3ByYWRpbmlzJz0+aG9tZV91cmwoJy8nKSwna2F0ZWdvcmlqYSc9PmhvbWVfdXJsKCcva2F0ZWdvcmlqYS9zdW5pbXMvbWFpc3Rhcy1zdW5pbXMvc2F1c2FzLW1haXN0YXMtc3VuaW1zLycpLCd0YWtzYXMnPT5ob21lX3VybCgnL3Rha3Nhcy8nKSk7CiAgICBmb3JlYWNoKCR1cmxzIGFzICRrPT4kdSl7ICR0MD1taWNyb3RpbWUodHJ1ZSk7ICRnPXdwX3JlbW90ZV9nZXQoJHUsYXJyYXkoJ3RpbWVvdXQnPT40MCwnc3NsdmVyaWZ5Jz0+ZmFsc2UsJ3VzZXItYWdlbnQnPT4nTW96aWxsYS81LjAgZGlhZycpKTsgJG1zPShpbnQpcm91bmQoKG1pY3JvdGltZSh0cnVlKS0kdDApKjEwMDApOyAkYj13cF9yZW1vdGVfcmV0cmlldmVfYm9keSgkZyk7CiAgICAgIHByZWdfbWF0Y2hfYWxsKCd+PCEtLVxzKihbXj5dezAsOTB9KD86U3VwZXItQ2FjaGV8RHluYW1pYyBwYWdlfHN1cGVyY2FjaGUpW14+XXswLDYwfSktLT5+aScsJGIsJG0pOyAkaD13cF9yZW1vdGVfcmV0cmlldmVfaGVhZGVycygkZyktPmdldEFsbCgpOyB1bnNldCgkaFsnbGluayddKTsKICAgICAgJG9bJ3JlcSddWyRrXT1hcnJheSgnbXMnPT4kbXMsJ2tvbWVudCc9PmFycmF5X3NsaWNlKCRtWzFdLDAsNCksJ2hkcic9PmFycmF5X2ludGVyc2VjdF9rZXkoJGgsYXJyYXlfZmxpcChhcnJheSgnY2FjaGUtY29udHJvbCcsJ3NldC1jb29raWUnLCd2YXJ5JywneC13cC1zdXBlci1jYWNoZScsJ2NvbnRlbnQtdHlwZScsJ2V4cGlyZXMnKSkpKTsgfQogICAgLy8gZGVidWcgbG9nIGplaSB5cmEKICAgIGdsb2JhbCAkd3Bfc3VwZXJfY2FjaGVfZGVidWcsJGNhY2hlX3BhdGgsJHdwX2NhY2hlX2RlYnVnX2xvZzsgJG9bJ2RlYnVnJ109YXJyYXkoJ29uJz0+JHdwX3N1cGVyX2NhY2hlX2RlYnVnLCdsb2cnPT4kd3BfY2FjaGVfZGVidWdfbG9nPz9udWxsKTsKICAgIC8vIGFyIFdDIHBhxb55bWkgRE9OT1RDQUNIRVBBR0UgcGVyIHRlbXBsYXRlX3JlZGlyZWN0IGthdGVnb3Jpam9qZT8gdGlrcmluYW0gcGVyIGxvb3BiYWNrIHN1IFggaGVhZGVyJ2l1IG5lZ2FsaW07IHRpa3JpbmFtIGtvZMSFCiAgICAkb1snd2NfcHJldmVudCddPWFycmF5KCk7IGZvcmVhY2goZ2xvYihXUF9QTFVHSU5fRElSLicvd29vY29tbWVyY2UvaW5jbHVkZXMvY2xhc3Mtd2MtY2FjaGUtaGVscGVyLnBocCcpIGFzICRwKXsgJGM9ZmlsZV9nZXRfY29udGVudHMoJHApOyBwcmVnX21hdGNoX2FsbCgnfmZ1bmN0aW9uIChwcmV2ZW50X2NhY2hpbmd8c2V0X25vY2FjaGV8bm9jYWNoZSlbXntdKlx7W159XXswLDQwMH1+cycsJGMsJG0pOyAkb1snd2NfcHJldmVudCddPWFycmF5X21hcChmbigkeCk9PnN1YnN0cihwcmVnX3JlcGxhY2UoJ35ccyt+JywnICcsJHgpLDAsMzAwKSwkbVswXSk7IH0KICAgIC8vIGdsb2JhbHVzICRjYWNoZV9yZWplY3RlZF91cmkga2FpcCBQSFAgasSvIG1hdG8KICAgIGluY2x1ZGUgV1BfQ09OVEVOVF9ESVIuJy93cC1jYWNoZS1jb25maWcucGhwJzsgJG9bJ3Jlal91cmknXT0kY2FjaGVfcmVqZWN0ZWRfdXJpOyAkb1snY2FjaGVfcGF0aCddPSRjYWNoZV9wYXRoOyAkb1snY2FjaGVfcGFnZV9zZWNyZXQnXT1pc3NldCgkY2FjaGVfcGFnZV9zZWNyZXQpPyd5cmEnOiduZXJhJzsgJG9bJ3dwX2NhY2hlX2hvbWVfcGF0aCddPSR3cF9jYWNoZV9ob21lX3BhdGg/P251bGw7ICRvWydjYWNoZWRfZGlyZWN0J109JGNhY2hlZF9kaXJlY3RfcGFnZXM/P251bGw7ICRvWyd1c2VfZmxvY2snXT0kdXNlX2Zsb2NrPz9udWxsOyAkb1snc2VtX2lkJ109JHNlbV9pZD8/bnVsbDsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJG9bJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9VTkVTQ0FQRURfU0xBU0hFUyk7IGV4aXQ7Cn0pOwo=';
const VER='dep-094930';
const GKEY='ps_seo';
const PHASES=["R"];
const OUT='analize/s1555b.json';
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
