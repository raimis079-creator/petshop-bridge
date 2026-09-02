process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgQVVESVQgTSDigJQgbGFuZ8WzIGlyIG51b3JvZMWzIMW+ZW3El2xhcGlzIChyZWFkLW9ubHkpICovCmFkZF9hY3Rpb24oJ2FkbWluX21lbnUnLCBmdW5jdGlvbigpewogIGlmICghaXNzZXQoJF9HRVRbJ3BzX2F1MTInXSkpIHJldHVybjsKfSwgOTk5KTsKYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfYXUxMiddKSkgcmV0dXJuOyBnbG9iYWwgJHdwZGI7ICRvPWFycmF5KCk7CiAgLy8gMS4gdmlzaSBwZXRzaG9wIGFkbWluIHB1c2xhcGlhaSBpcyBrb2RvCiAgJGZpbGVzPWFycmF5X21lcmdlKGdsb2IoV1BNVV9QTFVHSU5fRElSLicvKi5waHAnKSxnbG9iKFdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLSovKi5waHAnKSxnbG9iKFdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLSovaW5jbHVkZXMvKi5waHAnKSk7CiAgZm9yZWFjaCgkZmlsZXMgYXMgJGZwKXsgJGM9ZmlsZV9nZXRfY29udGVudHMoJGZwKTsgJGI9YmFzZW5hbWUoJGZwKTsKICAgIGlmKHByZWdfbWF0Y2hfYWxsKCIvYWRkXyhtZW51fHN1Ym1lbnUpX3BhZ2VcKFxzKihbXjtdezAsMjYwfSkvcyIsJGMsJG0pKXsgZm9yZWFjaCgkbVsyXSBhcyAkaT0+JGFyZyl7ICRhcmc9cHJlZ19yZXBsYWNlKCcvXHMrLycsJyAnLCRhcmcpOyBpZihwcmVnX21hdGNoX2FsbCgiLycoW2EtejAtOVwtX10rKScvIiwkYXJnLCRzbCkpeyAkb1snbWVudSddW109YXJyYXkoJGIsJG1bMV1bJGldLG1iX3N1YnN0cigkYXJnLDAsMjAwKSk7IH0gfSB9CiAgICBpZihwcmVnX21hdGNoX2FsbCgiL3BhZ2U9KHBzLVthLXpcLV0rfHdjLW9yZGVyc3x3Yy1yZXBvcnRzfHdjLXNldHRpbmdzKS8iLCRjLCRwbSkpeyAkY250PWFycmF5X2NvdW50X3ZhbHVlcygkcG1bMV0pOyAkb1snbGlua3Nfb3V0J11bJGJdPSRjbnQ7IH0KICAgIGlmKHByZWdfbWF0Y2hfYWxsKCIvKGFkbWluXC5waHBcP3BhZ2U9cHMtW2EtelwtXStbXidcIl17MCw0MH0pLyIsJGMsJGxtKSl7ICRvWydsaW5rX2Zvcm1zJ11bJGJdPWFycmF5X3ZhbHVlcyhhcnJheV91bmlxdWUoYXJyYXlfbWFwKGZ1bmN0aW9uKCR4KXtyZXR1cm4gcHJlZ19yZXBsYWNlKCcvWyY/XT8oX3dwbm9uY2V8Zyk9W14mXSovJywnJywkeCk7fSwkbG1bMV0pKSk7IH0KICAgIGlmKHByZWdfbWF0Y2hfYWxsKCIvKGdldF9lZGl0X29yZGVyX3VybHxwb3N0XC5waHBcP3Bvc3Q9fGFjdGlvbj1lZGl0JihhbXA7KT9pZD18dGFyZ2V0PVwiX2JsYW5rXCIpLyIsJGMsJGVtKSl7ICRvWyd3Y19lZGl0J11bJGJdPWFycmF5X2NvdW50X3ZhbHVlcygkZW1bMV0pOyB9CiAgICBpZihwcmVnX21hdGNoX2FsbCgiLyhBdGdhbFteJ1wiPF17MCwzMH184oaQIFteJ1wiPF17MCwzMH0pL3UiLCRjLCRhbSkpeyAkb1snYXRnYWwnXVskYl09YXJyYXlfdmFsdWVzKGFycmF5X3VuaXF1ZShhcnJheV9tYXAoJ3RyaW0nLCRhbVsxXSkpKTsgfQogIH0KICAvLyAyLiByZWFsdXMgbWVuaXUga2FpcCBtYXRvIGRhcmJ1b3RvamFzIOKAlCBpcyBhZG1pbiBIVE1MCiAgJHU9Z2V0X3VzZXJfYnkoJ2xvZ2luJywndGVzdHVvdG9qYXMnKTsgJHVpZD0kdS0+SUQ7ICRleHA9dGltZSgpKzYwMDsgJHRvaz1XUF9TZXNzaW9uX1Rva2Vuczo6Z2V0X2luc3RhbmNlKCR1aWQpLT5jcmVhdGUoJGV4cCk7CiAgJGNzPWFycmF5KG5ldyBXUF9IdHRwX0Nvb2tpZShhcnJheSgnbmFtZSc9PlNFQ1VSRV9BVVRIX0NPT0tJRSwndmFsdWUnPT53cF9nZW5lcmF0ZV9hdXRoX2Nvb2tpZSgkdWlkLCRleHAsJ3NlY3VyZV9hdXRoJywkdG9rKSkpLG5ldyBXUF9IdHRwX0Nvb2tpZShhcnJheSgnbmFtZSc9PkFVVEhfQ09PS0lFLCd2YWx1ZSc9PndwX2dlbmVyYXRlX2F1dGhfY29va2llKCR1aWQsJGV4cCwnYXV0aCcsJHRvaykpKSxuZXcgV1BfSHR0cF9Db29raWUoYXJyYXkoJ25hbWUnPT5MT0dHRURfSU5fQ09PS0lFLCd2YWx1ZSc9PndwX2dlbmVyYXRlX2F1dGhfY29va2llKCR1aWQsJGV4cCwnbG9nZ2VkX2luJywkdG9rKSkpKTsKICAkcj13cF9yZW1vdGVfZ2V0KGFkbWluX3VybCgnYWRtaW4ucGhwP3BhZ2U9cHMta2F0YWxvZ2FzJyksYXJyYXkoJ2Nvb2tpZXMnPT4kY3MsJ3RpbWVvdXQnPT42MCwnc3NsdmVyaWZ5Jz0+ZmFsc2UpKTsgJGI9aXNfd3BfZXJyb3IoJHIpPycnOndwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCRyKTsKICBpZihwcmVnX21hdGNoKCcvPHVsIGlkPSJhZG1pbm1lbnUiLio/PFwvdWw+XHMqPGRpdiBjbGFzcz0iY2xlYXIiPi9zJywkYiwkbW0pKXsgcHJlZ19tYXRjaF9hbGwoJy88YSBocmVmPSIoW14iXSspIltePl0qPiguKj8pPFwvYT4vcycsJG1tWzBdLCRhbSk7IGZvcmVhY2goJGFtWzFdIGFzICRpPT4kaCl7ICR0PXRyaW0ocHJlZ19yZXBsYWNlKCcvXHMrLycsJyAnLHdwX3N0cmlwX2FsbF90YWdzKCRhbVsyXVskaV0pKSk7IGlmKCR0KSAkb1snbWVudV9saXZlJ11bXT0kdC4nIOKGkiAnLmh0bWxfZW50aXR5X2RlY29kZSgkaCk7IH0gfQogICRvWydtZW51X2xpdmVfbiddPWNvdW50KCRvWydtZW51X2xpdmUnXT8/YXJyYXkoKSk7CiAgLy8ga2F0YWxvZ28gdmlyc3V0aW5lIGp1b3N0YSAvIG51b3JvZG9zIGkga2l0dXMgbGFuZ3VzCiAgaWYocHJlZ19tYXRjaCgnLzxkaXYgaWQ9IndwYm9keS1jb250ZW50Ii4qJC9zJywkYiwkdykpeyBwcmVnX21hdGNoX2FsbCgnL2hyZWY9IihbXiJdKnBhZ2U9KHBzLVthLXpcLV0rfHdjLW9yZGVycylbXiJdKikiLycsJHdbMF0sJGttKTsgJG9bJ2thdGFsb2dhc19vdXQnXT1hcnJheV9jb3VudF92YWx1ZXMoJGttWzJdKTsgcHJlZ19tYXRjaF9hbGwoJy88YVtePl0qaHJlZj0iW14iXSpwYWdlPXBzLVthLXpcLV0rW14iXSoiW14+XSo+KC4qPyk8XC9hPi9zJywkd1swXSwka3QpOyAkb1sna2F0YWxvZ2FzX291dF90eHQnXT1hcnJheV92YWx1ZXMoYXJyYXlfdW5pcXVlKGFycmF5X21hcChmdW5jdGlvbigkeCl7cmV0dXJuIHRyaW0ocHJlZ19yZXBsYWNlKCcvXHMrLycsJyAnLHdwX3N0cmlwX2FsbF90YWdzKCR4KSkpO30sYXJyYXlfc2xpY2UoJGt0WzFdLDAsMjApKSkpOyB9CiAgZm9yZWFjaChhcnJheSgncHMtdGlla2ltYXMnLCdwcy1sYWlza2FpJmI9bGF1a2lhJywncHMtcmlua2luaWFpJywncHMtYXRhc2thaXRvcycpIGFzICRwZyl7ICRyPXdwX3JlbW90ZV9nZXQoYWRtaW5fdXJsKCdhZG1pbi5waHA/cGFnZT0nLiRwZyksYXJyYXkoJ2Nvb2tpZXMnPT4kY3MsJ3RpbWVvdXQnPT42MCwnc3NsdmVyaWZ5Jz0+ZmFsc2UpKTsgJGI9aXNfd3BfZXJyb3IoJHIpPycnOndwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCRyKTsgaWYocHJlZ19tYXRjaCgnLzxkaXYgaWQ9IndwYm9keS1jb250ZW50Ii4qJC9zJywkYiwkdykpeyBwcmVnX21hdGNoX2FsbCgnL2hyZWY9IihbXiJdKnBhZ2U9KHBzLVthLXpcLV0rfHdjLW9yZGVycylbXiJdKikiLycsJHdbMF0sJGttKTsgJG9bJ291dCddWyRwZ109YXJyYXlfY291bnRfdmFsdWVzKCRrbVsyXSk7IHByZWdfbWF0Y2goJy88aDFbXj5dKj4oLio/KTxcL2gxPi9zJywkd1swXSwkaDEpOyAkb1snaDEnXVskcGddPXRyaW0od3Bfc3RyaXBfYWxsX3RhZ3MoJGgxWzFdPz8nJykpOyB9IGVsc2UgJG9bJ291dCddWyRwZ109J25lcmEgd3Bib2R5ICgnLnN0cmxlbigkYikuJyknOyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9KTsK';
const VER='dep-155327';
const GKEY='ps_au12';
const PHASES=["M"];
const OUT='analize/audit_m2.json';
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
