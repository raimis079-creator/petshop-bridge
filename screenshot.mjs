process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzgxaCBrZWxpdSBzYXJnYXMgKyByb2R5bW8gcG9reWNpbyBzaW11bGlhY2lqYSAocmVhZC1vbmx5KSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE3ODFoJ10pKSByZXR1cm47IEBzZXRfdGltZV9saW1pdCgxNjApOyBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRyPVsndic9PidTMTc4MWgnXTsKICAkcm09ZnVuY3Rpb24oJG4peyAkbT1uZXcgUmVmbGVjdGlvbk1ldGhvZCgnUGV0c2hvcF9EYXJiYWxhdWtpcycsJG4pOyAkbS0+c2V0QWNjZXNzaWJsZSh0cnVlKTsgcmV0dXJuICRtOyB9OwogIHRyeXsKICAgICRyWydtZDUnXT1tZDVfZmlsZShXUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWRhcmJhbGF1a2lzLnBocCcpOyAkclsndmVyJ109UGV0c2hvcF9EYXJiYWxhdWtpczo6VkVSU0lKQTsKICAgICRhcD0kcm0oJ2F0dmlyYV9wYXJ0aWphJyk7CiAgICAkaWRzPSR3cGRiLT5nZXRfY29sKCJTRUxFQ1QgaWQgRlJPTSB7JFB9d2Nfb3JkZXJzIFdIRVJFIHR5cGU9J3Nob3Bfb3JkZXInIEFORCAoc3RhdHVzIElOKCd3Yy1wcm9jZXNzaW5nJywnd2Mtb24taG9sZCcpIE9SIChzdGF0dXM9J3djLWNvbXBsZXRlZCcgQU5EIGRhdGVfY3JlYXRlZF9nbXQ+PURBVEVfU1VCKFVUQ19USU1FU1RBTVAoKSxJTlRFUlZBTCA0IERBWSkpKSIpOwogICAgJHJbJ3Rpa3JpbnRhJ109Y291bnQoJGlkcyk7ICRzaz1bXTsgJG5lc3VyPVtdOyAkc0E9W107ICRzQj1bXTsKICAgIGZvcmVhY2goJGlkcyBhcyAkaWQpeyAkbz13Y19nZXRfb3JkZXIoJGlkKTsgaWYoISRvfHwhJG8tPmlzX3BhaWQoKSkgY29udGludWU7ICRucj0kby0+Z2V0X29yZGVyX251bWJlcigpOyAkc3Q9JG8tPmdldF9zdGF0dXMoKTsKICAgICAgJHNwcj1qc29uX2RlY29kZSgoc3RyaW5nKSRvLT5nZXRfbWV0YSgnX3BzX21pc3J1c19zcHJlbmRpbWFzJyksdHJ1ZSk7IGlmKCFpc19hcnJheSgkc3ByKSkgJHNwcj1bXTsgJHJ1cz0oc3RyaW5nKSRvLT5nZXRfbWV0YSgnX3BzX3J1c2l1b3RhJyk7ICRzcHJlc3Rhcz0oc3RyaW5nKSRvLT5nZXRfbWV0YSgnX3BzX21pc3J1c19zcHJlc3RhcycpOwogICAgICAkcGVyZD1qc29uX2RlY29kZSgoc3RyaW5nKSRvLT5nZXRfbWV0YSgnX3BzX2Ryb3BzaGlwX3NlbnRfc3JjJyksdHJ1ZSk7IGlmKCFpc19hcnJheSgkcGVyZCkpICRwZXJkPVtdOyAkYXY9ZmFsc2U7ICRzcmNzPVtdOwogICAgICBmb3JlYWNoKCRvLT5nZXRfaXRlbXMoKSBhcyAkaXQpeyAkcz0oc3RyaW5nKSRpdC0+Z2V0X21ldGEoJ19wc19zb3VyY2UnKTsgaWYoJHM9PT0nYXYnKSAkYXY9dHJ1ZTsgaWYoJHMpICRzcmNzWyRzXT0xOyB9CiAgICAgIGlmKCRzdCE9PSdjb21wbGV0ZWQnICYmICEkcnVzICYmICEkc3ByICYmIGNvdW50KCRzcmNzKT4xKSAkbmVzdXJbXT0kbnIuJyAoJy5pbXBsb2RlKCcrJyxhcnJheV9rZXlzKCRzcmNzKSkuJyknOwogICAgICAvLyBTQVJHQVMgQTogcGxhbmFzIHlyYSwgYmV0IOKAnlN1csWrxaFpdW90YeKAnCBuZXNwYXVzdGEKICAgICAgaWYoJHNwciAmJiAhJHJ1cyAmJiAhJHNwcmVzdGFzKSAkc0FbXT0kbnIuJyAnLiRzdC4nIHBsYW5hcyAnLmpzb25fZW5jb2RlKCRzcHIpOwogICAgICBmb3JlYWNoKCRvLT5nZXRfaXRlbXMoKSBhcyAkaWlkPT4kaXQpeyAkcz0oc3RyaW5nKSRpdC0+Z2V0X21ldGEoJ19wc19zb3VyY2UnKTsgaWYoISRzfHwkcz09PSdhdicpIGNvbnRpbnVlOyAkaz0oc3RyaW5nKSRpdC0+Z2V0X21ldGEoJ19wc19rZWxpYXMnKTsKICAgICAgICAvLyBTQVJHQVMgQjogbWlzcnVzICh5cmEgQVYgZWlsdXRlKSwgdGlla2VqbyBwcmVrZSBlaW5hIGtsaWVudHVpIChwbGFuYXMgdGllc2lhaSBhcmJhIHBlcmR1b3RhIHRpZWtlanVpKSwgbyB6bW9nYXVzIHNwcmVuZGltbyBlaWx1dGVqZSBuZXJhCiAgICAgICAgaWYoJGF2ICYmICRrPT09JycgJiYgISRpdC0+Z2V0X21ldGEoJ19wc19rb25zb2xpZGFjaWphJykgJiYgKCd0aWVzaWFpJz09PSgkc3ByWyRzXT8/JycpIHx8ICFlbXB0eSgkcGVyZFskc10pKSkgJHNCW109JG5yLicgJy4kc3QuJyBbJy4kcy4nXSAnLm1iX3N1YnN0cigkaXQtPmdldF9uYW1lKCksMCwzNCkuKCFlbXB0eSgkcGVyZFskc10pPycg4oCUIFBFUkRVT1RBICcuJHBlcmRbJHNdOicg4oCUIHBsYW5hcyB0aWVzaWFpJyk7CiAgICAgICAgaWYoJHN0PT09J2NvbXBsZXRlZCd8fCRrIT09JycpIGNvbnRpbnVlOwogICAgICAgICRiPWNsYXNzX2V4aXN0cygnUGV0c2hvcF9BVl9UaWVraW1hcycpP1BldHNob3BfQVZfVGlla2ltYXM6OmVpbHV0ZXNfYnVrbGUoJG8tPmdldF9pZCgpLChpbnQpJGlpZCk6bnVsbDsgJGJhc2U9JGl0LT5nZXRfbWV0YSgnX3BzX2tvbnNvbGlkYWNpamEnKXx8J2F2Jz09PSgkc3ByWyRzXT8/JycpfHwkYjsKICAgICAgICAkb2xkPSgkYmFzZXx8KCEkcnVzJiYkYXAtPmludm9rZShudWxsLCRzKSYmJGF2KSk/J2lfYXYnOid0aWVzaWFpJzsgJG5ldz0oJGJhc2V8fCghJHJ1cyYmIWlzc2V0KCRzcHJbJHNdKSYmJGF2KSk/J2lfYXYnOid0aWVzaWFpJzsKICAgICAgICBpZigkb2xkIT09JG5ldykgJHNrW109JG5yLicgWycuJHMuJ10gJy5tYl9zdWJzdHIoJGl0LT5nZXRfbmFtZSgpLDAsMzApLicgJy4kb2xkLicg4oaSICcuJG5ldy4nIChwbGFuYXMgJy5qc29uX2VuY29kZSgkc3ByKS4nKSc7IH0gfQogICAgJHJbJ3Nhcmdhc19BX3BsYW5hc19iZV9zdXJ1c2l1b3RhJ109JHNBOyAkclsnc2FyZ2FzX0Jfa2xpZW50dWlfYmVfc3ByZW5kaW1vJ109JHNCOyAkclsncG9fcGF0YWlzb3Nfcm9keW1hc19rZWlzdHVzaSddPSRzazsgJHJbJ25lc3VydXNpdW90aV9taXNydXNfZGFiYXInXT0kbmVzdXI7CiAgICAkb2lkPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBvcmRlcl9pZCBGUk9NIHskUH13Y19vcmRlcnNfbWV0YSBXSEVSRSBtZXRhX2tleT0nX3BzX29yZGVyX251bWJlcicgQU5EIG1ldGFfdmFsdWU9JzEzOTQnIExJTUlUIDEiKTsgJG89d2NfZ2V0X29yZGVyKCRvaWQpOwogICAgJHg9WydzcHInPT4kby0+Z2V0X21ldGEoJ19wc19taXNydXNfc3ByZW5kaW1hcycpLCdlaWwnPT5bXSwncGFzdGFib3MnPT5bXV07IGZvcmVhY2goJG8tPmdldF9pdGVtcygpIGFzICRpdCl7ICR4WydlaWwnXVtdPW1iX3N1YnN0cigkaXQtPmdldF9uYW1lKCksMCwyNikuJyB8IHNyYz0nLiRpdC0+Z2V0X21ldGEoJ19wc19zb3VyY2UnKS4nIGtlbGlhcz0nLiRpdC0+Z2V0X21ldGEoJ19wc19rZWxpYXMnKS4nIGtvbnM9Jy4kaXQtPmdldF9tZXRhKCdfcHNfa29uc29saWRhY2lqYScpOyB9CiAgICBmb3JlYWNoKHdjX2dldF9vcmRlcl9ub3RlcyhbJ29yZGVyX2lkJz0+JG9pZCwnb3JkZXJfYnknPT4nZGF0ZV9jcmVhdGVkJywnb3JkZXInPT4nREVTQycsJ2xpbWl0Jz0+NV0pIGFzICRuKXsgJHhbJ3Bhc3RhYm9zJ11bXT0kbi0+ZGF0ZV9jcmVhdGVkLT5kYXRlKCdtLWQgSDppOnMnKS4nIFsnLiRuLT5hZGRlZF9ieS4nXSAnLm1iX3N1YnN0cih3cF9zdHJpcF9hbGxfdGFncygkbi0+Y29udGVudCksMCwyMDApOyB9ICRyWyd1MTM5NCddPSR4OwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkclsnZXJyJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QUkVUVFlfUFJJTlR8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0pOwo=';
const VER='dep-102727';
const GKEY='ps_s1781h';
const PHASES=["1"];
const OUT='analize/s1781_h.json';
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
  // EKRANO NUOTRAUKOS (browser=1): fazė grąžina shots:[{n,u,w}], cookies:[{name,value}]
  const SH=(()=>{ for(const f of PHASES){ if(out[f]&&out[f].shots) return out[f]; } return null; })();
  if(SH){ try{ const {chromium}=await import('playwright'); const br=await chromium.launch(); const ctx=await br.newContext({viewport:{width:1440,height:900},ignoreHTTPSErrors:true});
      if(SH.cookies){ await ctx.addCookies(SH.cookies.map(c=>({name:c.name,value:c.value,domain:new URL(WP).hostname,path:'/',secure:true}))); }
      out.shots={};
      for(const s of SH.shots){ try{ const pg=await ctx.newPage(); const errs=[]; pg.on('pageerror',e=>errs.push('pageerror: '+String(e).slice(0,300))); pg.on('console',m=>{ if(m.type()==='error'||m.type()==='warning') errs.push(m.type()+': '+m.text().slice(0,300)); }); pg.on('response',r=>{ if(r.status()>=400) errs.push('http '+r.status()+' '+r.url().slice(0,120)); });
          if(s.w) await pg.setViewportSize({width:s.w,height:s.h||900}); await pg.goto(s.u,{waitUntil:'networkidle',timeout:60000}); await pg.waitForTimeout(800);
          const res={}; if(s.click){ try{ await pg.click(s.click,{timeout:5000}); await pg.waitForTimeout(600); res.clicked=s.click; }catch(e){ res.click_err=String(e).slice(0,200); } }
          if(s.eval){ try{ res.eval=await pg.evaluate(s.eval); }catch(e){ res.eval_err=String(e).slice(0,200); } }
          const buf=await pg.screenshot({fullPage:!!s.full}); const st=await put('screenshots/'+s.n+'.png',buf,VER+' '+s.n); out.shots[s.n]=Object.assign({status:st,url:pg.url(),title:await pg.title(),errors:errs.slice(0,12)},res); await pg.close(); }catch(e){ out.shots[s.n]=String(e).slice(0,200); } }
      await br.close(); }catch(e){ out.shots_klaida=String(e).slice(0,300); } }
}catch(e){ out.klaida=String(e).slice(0,500); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put(OUT, Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
