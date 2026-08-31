process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNTQ3IGFwcGx5IChhZGFwdGVyaW8gcGVyc3RhdHltYXMgKyBkaW0pICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogICRmPShpc3NldCgkX0dFVFsncHNfYXAnXSk/JF9HRVRbJ3BzX2FwJ106JycpOyBpZigkZiE9PSdGSVgnJiYkZiE9PSdBUFBMWScmJiRmIT09J0RJTScpIHJldHVybjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICRvPWFycmF5KCd2Jz0+J1MxNTQ3YXAnLCdmYXplJz0+JGYpOwogIHRyeXsKICAgIGdsb2JhbCAkd3BkYjsKICAgIGlmKCRmPT09J0ZJWCcpewogICAgICAka2VsaWFzPVdQTVVfUExVR0lOX0RJUi4nL3BldHNob3AtaXN0b3Jpam9zLWFkYXB0ZXJpcy5waHAnOwogICAgICAkYWlkPWlzc2V0KCRfR0VUWydkX2FkYXB0ZXJpc190eHQnXSk/KGludCkkX0dFVFsnZF9hZGFwdGVyaXNfdHh0J106MDsKICAgICAgaWYoISRhaWQpeyAkb1snU1RPUCddPSduZXJhIG1lZGlhIGlkJzsgZWNobyBqc29uX2VuY29kZSgkbyk7IGV4aXQ7IH0KICAgICAgJGtvZGFzPWJhc2U2NF9kZWNvZGUodHJpbShmaWxlX2dldF9jb250ZW50cyhnZXRfYXR0YWNoZWRfZmlsZSgkYWlkKSkpLHRydWUpOwogICAgICB0cnl7IHRva2VuX2dldF9hbGwoJGtvZGFzLCBUT0tFTl9QQVJTRSk7IH1jYXRjaChUaHJvd2FibGUgJHRlKXsgJG9bJ1NUT1AnXT0nVE9LRU46ICcuJHRlLT5nZXRNZXNzYWdlKCk7IGVjaG8ganNvbl9lbmNvZGUoJG8pOyBleGl0OyB9CiAgICAgICRneXZhcz1tZDUoZmlsZV9nZXRfY29udGVudHMoJGtlbGlhcykpOwogICAgICBpZigkZ3l2YXMhPT0nYmNiZTI2NTRkOWRjNTc1MjVhMDhlNTkyYzk1YWQxYzcnKXsgJG9bJ1NUT1AnXT0nTUQ1OiAnLiRneXZhczsgZWNobyBqc29uX2VuY29kZSgkbyk7IGV4aXQ7IH0KICAgICAgZmlsZV9wdXRfY29udGVudHMoJGtlbGlhcywka29kYXMpOwogICAgICBpZihmdW5jdGlvbl9leGlzdHMoJ29wY2FjaGVfaW52YWxpZGF0ZScpKSBvcGNhY2hlX2ludmFsaWRhdGUoJGtlbGlhcyx0cnVlKTsKICAgICAgJG9bJ2lyYXN5dGEnXT1tZDUoJGtvZGFzKTsgd3BfZGVsZXRlX2F0dGFjaG1lbnQoJGFpZCx0cnVlKTsKICAgIH0gZWxzZWlmKCRmPT09J0FQUExZJyl7CiAgICAgIEBzZXRfdGltZV9saW1pdCgyODApOwogICAgICAkb1snYXBwbHknXT1QZXRzaG9wX0lzdF9BZGFwdGVyaXM6OnBlcnN0YXR5dGkoZmFsc2UpOwogICAgICAvLyBncmVpdGEga29udHJvbGU6IGhhc2ggc3V0YW1wYSBzdSBmYWt0dSBhbGdvcml0bXUgKHB2ei4gaXMgZGV2IGZha3QpCiAgICAgICRvWyd2aWV3X3Rlc3QnXT1hcnJheSgKICAgICAgICAndnUnPT4oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSAiLlBldHNob3BfSXN0X0FkYXB0ZXJpczo6dnUoKSksCiAgICAgICAgJ3ZlJz0+KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gIi5QZXRzaG9wX0lzdF9BZGFwdGVyaXM6OnZlKCkpLAogICAgICAgICdtZXRhaSc9PiR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIExFRlQoZGllbmEsNCkgbSwgQ09VTlQoKikgbiwgUk9VTkQoU1VNKHByZWtpdV9zdW1hX2N0KS8xMDApIHBhaiBGUk9NICIuUGV0c2hvcF9Jc3RfQWRhcHRlcmlzOjp2dSgpLiIgR1JPVVAgQlkgbSBPUkRFUiBCWSBtIixBUlJBWV9BKSwKICAgICAgICAnc3ZhcmEnPT5hcnJheSgKICAgICAgICAgICdicmVuZHVfZWlsJz0+KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gIi5QZXRzaG9wX0lzdF9BZGFwdGVyaXM6OmllKCkuIiBXSEVSRSBicmVuZGFzX3NsdWc8PicnIEFORCBicmVuZGFzX3NsdWc8PlwiJydcIiIpLAogICAgICAgICAgJ2xpdGVyYWxfa2FidXRlcyc9PihpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NICIuUGV0c2hvcF9Jc3RfQWRhcHRlcmlzOjppZSgpLiIgV0hFUkUgYnJlbmRhc19zbHVnPVwiJydcIiIpLAogICAgICAgICAgJ2thbmFsYXNfc3ZhcnVzJz0+KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gIi5QZXRzaG9wX0lzdF9BZGFwdGVyaXM6Oml1KCkuIiBXSEVSRSBrYW5hbGFzX3Bpcm1hcyBJUyBOVUxMIE9SIGthbmFsYXNfcGlybWFzPScnIiksCiAgICAgICAgICAndG9wX2JyZW5kYWknPT4kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBicmVuZGFzX3NsdWcgYiwgQ09VTlQoKikgbiBGUk9NICIuUGV0c2hvcF9Jc3RfQWRhcHRlcmlzOjppZSgpLiIgV0hFUkUgYnJlbmRhc19zbHVnPD4nJyBHUk9VUCBCWSBiIE9SREVSIEJZIG4gREVTQyBMSU1JVCA1IixBUlJBWV9BKSwKICAgICAgICApLAogICAgICApOwogICAgfSBlbHNlIHsgLy8gRElNCiAgICAgIEBzZXRfdGltZV9saW1pdCgyODApOwogICAgICAkb1snZGltJ109UGV0c2hvcF9EaW1fS2xpZW50YWk6OnBlcnNrYWljaXVvdGkoZmFsc2UpOwogICAgICAkaz1QZXRzaG9wX0RpbV9LbGllbnRhaTo6a29udHJvbGUoKTsKICAgICAgJG9bJ2tvbnRyb2xlJ109YXJyYXkoJ2tsaWVudHUnPT4ka1sna2xpZW50dSddLCdzZWdtZW50YWknPT4ka1snc2VnbWVudGFpJ10sJ2tvaG9ydHUnPT5jb3VudCgka1sna29ob3J0b3MnXSksJ3N1dGlrcmluaW1hcyc9PiRrWydrb250cm9sZV9zdV9mYWt0YWlzJ10pOwogICAgICAkb1sncml6aWtvamVfbiddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskd3BkYi0+cHJlZml4fXBzX2RpbV9rbGllbnRhaSBXSEVSRSByZWZpbGxfbGF1a2lhbWFfYXQgSVMgTk9UIE5VTEwiKTsKICAgIH0KICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJG9bJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRGaWxlKCkuJzonLiRlLT5nZXRMaW5lKCk7IH0KICBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9KTsK';
const VER='dep-193311';
const GKEY='ps_ap';
const PHASES=["FIX", "APPLY", "DIM"];
const OUT='analize/s1547_apply2.json';
const DATA=["duomenys/adapteris.txt"];
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
