process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIGZyb250IGhvb2thaSB2MiAqLwphZGRfYWN0aW9uKCd3cF9mb290ZXInLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNkYmcyJ10pKSByZXR1cm47CiAgJHBpZD1nZXRfdGhlX0lEKCk7ICRwPXdjX2dldF9wcm9kdWN0KCRwaWQpOwogICRob29rcz1hcnJheSgnd29vY29tbWVyY2VfYmVmb3JlX2FkZF90b19jYXJ0X2J1dHRvbicsJ3dvb2NvbW1lcmNlX2JlZm9yZV9hZGRfdG9fY2FydF9mb3JtJywKICAgICd3b29jb21tZXJjZV9zaW5nbGVfcHJvZHVjdF9zdW1tYXJ5Jywnd29vY29tbWVyY2VfYWZ0ZXJfYWRkX3RvX2NhcnRfYnV0dG9uJywKICAgICd3b29jb21tZXJjZV9wcm9kdWN0X21ldGFfc3RhcnQnLCd3b29jb21tZXJjZV9iZWZvcmVfc2luZ2xlX3Byb2R1Y3Rfc3VtbWFyeScpOwogICRkPWFycmF5KCdwaWQnPT4kcGlkLCdpbl9zdG9jayc9PiRwJiYkcC0+aXNfaW5fc3RvY2soKT8xOjAsJ3B1cmNoYXNhYmxlJz0+JHAmJiRwLT5pc19wdXJjaGFzYWJsZSgpPzE6MCk7CiAgZm9yZWFjaCgkaG9va3MgYXMgJGhrKSAkZFskaGtdPWRpZF9hY3Rpb24oJGhrKTsKICBlY2hvICJcbjwhLS0gUFNEQkcyICIuanNvbl9lbmNvZGUoJGQpLiIgLS0+XG4iOwp9LDk5KTsKYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYoKGlzc2V0KCRfR0VUWydwc19mMTknXSk/JF9HRVRbJ3BzX2YxOSddOicnKSE9PSdUTycpIHJldHVybjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICRvPWFycmF5KCd2Jz0+J0RCRzItMS4wJyk7CiAgdHJ5ewogICAgZ2xvYmFsICR3cGRiOwogICAgLy8gc2VuYXMgdGVzdGluaXMgKDM1MTQ3KSArIGluLXN0b2NrIHByZWtlCiAgICAkcGlkMj0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgcC5JRCBGUk9NIHskd3BkYi0+cG9zdHN9IHAKICAgICAgSk9JTiB7JHdwZGItPnBvc3RtZXRhfSBzayBPTiBzay5wb3N0X2lkPXAuSUQgQU5EIHNrLm1ldGFfa2V5PSdfc2t1JyBBTkQgc2subWV0YV92YWx1ZTw+JycKICAgICAgSk9JTiB7JHdwZGItPnBvc3RtZXRhfSBwciBPTiBwci5wb3N0X2lkPXAuSUQgQU5EIHByLm1ldGFfa2V5PSdfcHJpY2UnIEFORCBwci5tZXRhX3ZhbHVlPjAKICAgICAgSk9JTiB7JHdwZGItPnBvc3RtZXRhfSBzdCBPTiBzdC5wb3N0X2lkPXAuSUQgQU5EIHN0Lm1ldGFfa2V5PSdfc3RvY2tfc3RhdHVzJyBBTkQgc3QubWV0YV92YWx1ZT0naW5zdG9jaycKICAgICAgV0hFUkUgcC5wb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwLnBvc3Rfc3RhdHVzPSdwdWJsaXNoJyBPUkRFUiBCWSBwLklEIERFU0MgTElNSVQgMSIpOwogICAgZm9yZWFjaChhcnJheSgnc2VuYXMnPT4zNTE0NywnaW5zdG9jayc9PiRwaWQyKSBhcyAkenltPT4kcGlkKXsKICAgICAgJHA9d2NfZ2V0X3Byb2R1Y3QoJHBpZCk7CiAgICAgICRnPXdwX3JlbW90ZV9nZXQoYWRkX3F1ZXJ5X2FyZyhhcnJheSgncHNkYmcyJz0+JzEnLCdwc25jJz0+dGltZSgpLiRwaWQpLGdldF9wZXJtYWxpbmsoJHBpZCkpLAogICAgICAgIGFycmF5KCd0aW1lb3V0Jz0+MzAsJ3NzbHZlcmlmeSc9PmZhbHNlLCdoZWFkZXJzJz0+YXJyYXkoJ0NhY2hlLUNvbnRyb2wnPT4nbm8tY2FjaGUnKSkpOwogICAgICAkaD13cF9yZW1vdGVfcmV0cmlldmVfYm9keSgkZyk7CiAgICAgIHByZWdfbWF0Y2goJy9QU0RCRzIgKFx7Lio/XH0pIC0tPi8nLCRoLCRtKTsKICAgICAgJG9bJHp5bV09aXNzZXQoJG1bMV0pP2pzb25fZGVjb2RlKCRtWzFdLHRydWUpOidORVJBU1RBJzsKICAgIH0KICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJG9bJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAgJy4kZS0+Z2V0TGluZSgpOyB9CiAgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9KTsK';
const VER='f19_dbg2-102721';
const GKEY='ps_f19';
const PHASES=["TO"];
const OUT='analize/f19_dbg2_1788085641.json';
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
    try{ out[f]=JSON.parse(t); }catch(e){ out['zalias_'+f]=t.slice(0,1500); }
  }
}catch(e){ out.klaida=String(e).slice(0,500); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put(OUT, Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
