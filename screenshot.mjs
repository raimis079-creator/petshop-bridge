process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFNhcmdhcyB2MS40IERlcGxveSB2MS4wICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogICR2PWlzc2V0KCRfR0VUWydwc19iaXMnXSk/JF9HRVRbJ3BzX2JpcyddOicnOwogIGlmKCFpbl9hcnJheSgkdixhcnJheSgnU1JHRCcsJ1NSR1QnKSkpIHJldHVybjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICRvPWFycmF5KCd2Jz0+J1NSR0QtdjEuMCcsJ2Zhc2UnPT4kdik7CiAgdHJ5ewogICAgaWYoJHY9PT0nU1JHRCcpewogICAgICAkTUQ1PSdhMGE3MzM2YzNjNzI2ZjRmYTI4YWQ2NDZmNTBmN2NkOSc7ICRHWVZBUz0nYTM2ZDlkOTIwOWE3OWU2ZmEwNmFmMTQxMWJiMTI1NGEnOwogICAgICAkZHN0PVdQTVVfUExVR0lOX0RJUi4nL3BldHNob3Atc2FyZ2FzLnBocCc7CiAgICAgIGlmKG1kNV9maWxlKCRkc3QpIT09JEdZVkFTKXsgJG9bJ1NUT1AnXT0nR1lWQVMgUEFTSUtFSVRFOiAnLm1kNV9maWxlKCRkc3QpOyB9CiAgICAgIGVsc2V7CiAgICAgICAgJHI9d3BfcmVtb3RlX2dldCgnaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3JhaW1pczA3OS1jcmVhdG9yL3BldHNob3AtYnJpZGdlL21haW4vZGVwbG95L3BldHNob3Atc2FyZ2FzLnBocC5iNjQ/dj0nLiRNRDUuJy0nLnRpbWUoKSxhcnJheSgndGltZW91dCc9PjMwLCdoZWFkZXJzJz0+YXJyYXkoJ0NhY2hlLUNvbnRyb2wnPT4nbm8tY2FjaGUnKSkpOwogICAgICAgICRrPWJhc2U2NF9kZWNvZGUodHJpbSh3cF9yZW1vdGVfcmV0cmlldmVfYm9keSgkcikpKTsKICAgICAgICBpZihtZDUoJGspIT09JE1ENSl7ICRvWydTVE9QJ109J01ENTogJy5tZDUoJGspOyB9CiAgICAgICAgZWxzZWlmKEB0b2tlbl9nZXRfYWxsKCRrLFRPS0VOX1BBUlNFKT09PWZhbHNlKXsgJG9bJ1NUT1AnXT0nU0lOVEFLU0UnOyB9CiAgICAgICAgZWxzZXsKICAgICAgICAgICRiPVdQX0NPTlRFTlRfRElSLicvdXBsb2Fkcy9wcy1iYWNrdXBzJzsgaWYoIWlzX2RpcigkYikpIHdwX21rZGlyX3AoJGIpOwogICAgICAgICAgY29weSgkZHN0LCRiLicvcGV0c2hvcC1zYXJnYXMucGhwLmJha19zMTQ3N18nLmdtZGF0ZSgnWW1kX0hpcycpKTsKICAgICAgICAgIGZpbGVfcHV0X2NvbnRlbnRzKCRkc3QsJGspOwogICAgICAgICAgJG9bJ2lyYXN5dGEnXT1tZDVfZmlsZSgkZHN0KT09PSRNRDU/J09LJzonTUQ1IFBPJzsKICAgICAgICB9CiAgICAgIH0KICAgIH0KICAgIGlmKCR2PT09J1NSR1QnKXsKICAgICAgJG9bJ2F0YXNrYWl0YSddPVBldHNob3BfU2FyZ2FzOjpkdW9tZW51X3N2YXJhKCk7CiAgICAgICRvWydvcGNpamEnXT1nZXRfb3B0aW9uKCdwc19zYXJnYXNfc3ZhcmEnKTsKICAgIH0KICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJG9bJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAgJy4kZS0+Z2V0TGluZSgpOyB9CiAgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9KTsK'; const VER='SRGD-v1.0'; const out={v:VER};
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
  const l=await fx(SNIP,{headers:A},'list'); const arr=JSON.parse(await l.text());
  for(const s of (Array.isArray(arr)?arr:[]).filter(s=>s.active&&/^TEMP/.test(s.name||''))){
    await fetch(SNIP+'/'+s.id,{method:'POST',headers:A,body:JSON.stringify({id:s.id,active:false})}); }
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP PS BIS Sargas Deploy v1.0 (back-in-stock zvalgyba)',
    code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'create');
  const ct=await c.text(); out.kurimas=c.status; try{sid=JSON.parse(ct).id; out.sid=sid;}catch(e){out.kurimo_atsakas=ct.slice(0,400);}
  await miegok(9000);
  const dA=await fx(WP+'/?ps_bis=SRGD',{headers:UA},'dep');
  const tA=await dA.text(); try{ out.deploy=JSON.parse(tA); }catch(e){ out.zaliasA=tA.slice(0,1200); }
  await miegok(5000);
  const dB=await fx(WP+'/?ps_bis=SRGT',{headers:UA},'test');
  const tB=await dB.text(); try{ out.testas=JSON.parse(tB); }catch(e){ out.zaliasB=tB.slice(0,1200); }
}catch(e){ out.klaida=String(e).slice(0,500); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put('analize/srg_dep.json', Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
