process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIGF0YXNrYWl0dSByZWNvbiAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX2F0J10pfHwkX0dFVFsncHNfYXQnXSE9PSdSJykgcmV0dXJuOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7ICRvPWFycmF5KCk7CiAgcmVxdWlyZV9vbmNlIEFCU1BBVEguJ3dwLWFkbWluL2luY2x1ZGVzL3BsdWdpbi5waHAnOyB3cF9zZXRfY3VycmVudF91c2VyKDEpOyAkR0xPQkFMU1snbWVudSddPWFycmF5KCk7ICRHTE9CQUxTWydzdWJtZW51J109YXJyYXkoKTsgJEdMT0JBTFNbJ2FkbWluX3BhZ2VfaG9va3MnXT1hcnJheSgpOyBkb19hY3Rpb24oJ2FkbWluX21lbnUnLCcnKTsKICBnbG9iYWwgJHN1Ym1lbnUsJHdwX2ZpbHRlciwkbWVudTsgJHBzPW51bGw7IGZvcmVhY2goJG1lbnUgYXMgJG0peyBpZihzdHJpcG9zKCRtWzBdLCdhdGFza2FpdCcpIT09ZmFsc2UpICRwcz0kbVsyXTsgfSAkb1sncGFyZW50J109JHBzOwogIGZvcmVhY2goKGFycmF5KSgkc3VibWVudVskcHNdPz9hcnJheSgpKSBhcyAkaXQpeyAkaD1nZXRfcGx1Z2luX3BhZ2VfaG9va25hbWUoJGl0WzJdLCRwcyk7ICRjYj1udWxsOyBpZihpc3NldCgkd3BfZmlsdGVyWyRoXSkpIGZvcmVhY2goJHdwX2ZpbHRlclskaF0tPmNhbGxiYWNrcyBhcyAkY2JzKSBmb3JlYWNoKCRjYnMgYXMgJGMpeyAkY2I9JGNbJ2Z1bmN0aW9uJ107IGJyZWFrIDI7IH0KICAgICRmPW51bGw7IGlmKCRjYil7IHRyeXsgJHJmPWlzX2FycmF5KCRjYik/bmV3IFJlZmxlY3Rpb25NZXRob2QoJGNiWzBdLCRjYlsxXSk6bmV3IFJlZmxlY3Rpb25GdW5jdGlvbigkY2IpOyAkZj0kcmYtPmdldEZpbGVOYW1lKCk7IH1jYXRjaChUaHJvd2FibGUgJGUpe30gfQogICAgJG9bJ2xhbmdhaSddW109YXJyYXkoJ3QnPT4kaXRbMF0sJ3NsdWcnPT4kaXRbMl0sJ2ZpbGUnPT4kZj9zdHJfcmVwbGFjZShBQlNQQVRILCcnLCRmKTpudWxsKTsgfQogIGZvcmVhY2goYXJyYXkoJ0tsaWVudMWzIGFuYWxpesSXJywnUHJla2nFsyBhbmFsaXrElycsJ0F0c2FyZ29zIGlyIHBpcmtpbWFzJywnUnl0YXMnKSBhcyAkdCl7IGZvcmVhY2goJG9bJ2xhbmdhaSddIGFzICRsKXsgaWYoJGxbJ3QnXT09PSR0JiYkbFsnZmlsZSddKXsgJGM9ZmlsZV9nZXRfY29udGVudHMoQUJTUEFUSC4kbFsnZmlsZSddKTsgcHJlZ19tYXRjaCgnL1ZlcnNpb246XHMqKFtcZC5dKykvJywkYywkdik7IHByZWdfbWF0Y2hfYWxsKCIvKD86RlJPTXxKT0lOKVxzK1tge10/XHs/XFxcJD9bYS16Xz4tXSooPzpwcmVmaXhcfT98d3BkYi0+cHJlZml4XHMqXC5ccyonKT8oW2Etel9dKykvaSIsJGMsJHRiKTsgcHJlZ19tYXRjaF9hbGwoIi88aFsxMjNdW14+XSo+KC57Miw4MH0/KTxcL2hbMTIzXT4vIiwkYywkaCk7IHByZWdfbWF0Y2hfYWxsKCIvZWNob1xzKyc8aFsyM11bXj5dKj4oW148J117Miw4MH0pLyIsJGMsJGgyKTsgcHJlZ19tYXRjaF9hbGwoIi9cKiAoPzpLYW18S0FNfEtsYXVzaW1hc3xBdHNha298S09ERUx8S29kxJdsKVteXG5dezAsMjAwfS8iLCRjLCRrKTsKICAgICAgJG9bJ3R1cmlueXMnXVskdF09YXJyYXkoJ2ZpbGUnPT4kbFsnZmlsZSddLCdzaXplJz0+c3RybGVuKCRjKSwndmVyJz0+JHY/JHZbMV06bnVsbCwnbGVudGVsZXMnPT5hcnJheV92YWx1ZXMoYXJyYXlfdW5pcXVlKCR0YlsxXSkpLCdhbnRyYXN0ZXMnPT5hcnJheV92YWx1ZXMoYXJyYXlfdW5pcXVlKGFycmF5X21lcmdlKCRoWzFdLCRoMlsxXSkpKSwna29tZW50YXJhaSc9PmFycmF5X3NsaWNlKCRrWzBdLDAsOCksJ2hkcic9PnN1YnN0cigkYywwLDEyMDApKTsgfSB9IH0KICBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9KTsK';
const VER='dep-165041';
const GKEY='ps_at';
const PHASES=["R"];
const OUT='analize/at_recon.json';
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
