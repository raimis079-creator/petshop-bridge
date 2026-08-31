process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNTQ3YiBmaWx0cmFpIChESUVHVEkrVkVSKSAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX2ZiJ10pKSByZXR1cm47CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICBnbG9iYWwgJHdwZGI7CiAgJG89YXJyYXkoJ3YnPT4nUzE1NDdmYicsJ2ZhemUnPT4kX0dFVFsncHNfZmInXSk7CiAgJGZhaWxhaT1hcnJheSgKICAgICdhZCc9PmFycmF5KCdwZXRzaG9wLWlzdG9yaWpvcy1hZGFwdGVyaXMucGhwJywnNTI4NGNiNDg4ZTQ1NTNiYjA0N2NkY2MyZWJlMDYyNTInKSwKICAgICdrbCc9PmFycmF5KCdwZXRzaG9wLWF0YXNrYWl0YS1rbGllbnRhaS5waHAnLCc2YjdmNGYxNTc4NDFiNjdlNDdiMzcyOTk4ZWQ1NTk3MicpLAogICAgJ3ByJz0+YXJyYXkoJ3BldHNob3AtYXRhc2thaXRhLXByZWtlcy5waHAnLCc1ZjlhMDM0NmM2ZmRlOTc0ODIzMzE3ZGRiYjNhOGNjYScpLAogICAgJ2F0Jz0+YXJyYXkoJ3BldHNob3AtYXRhc2thaXRhLWF0c2FyZ29zLnBocCcsJzFkYWI2NDI1MGRlNDZkZmViMjgzMGRlY2Y5YjM3MWNiJyksCiAgKTsKICB0cnl7CiAgICBpZignRElFR1RJJz09PSRfR0VUWydwc19mYiddKXsKICAgICAgJGJkaXI9V1BfQ09OVEVOVF9ESVIuJy91cGxvYWRzL3BzLWJhY2t1cHMnOyBpZighaXNfZGlyKCRiZGlyKSkgd3BfbWtkaXJfcCgkYmRpcik7CiAgICAgIGZvcmVhY2goJGZhaWxhaSBhcyAkaz0+JGZpKXsKICAgICAgICAka2VsaWFzPVdQTVVfUExVR0lOX0RJUi4nLycuJGZpWzBdOwogICAgICAgICRneXZhcz1tZDVfZmlsZSgka2VsaWFzKTsKICAgICAgICBpZigkZ3l2YXMhPT0kZmlbMV0peyAkb1snU1RPUCddPSRrLicgTUQ1OiAnLiRneXZhczsgZWNobyBqc29uX2VuY29kZSgkbyk7IGV4aXQ7IH0KICAgICAgICAkYWlkPWlzc2V0KCRfR0VUWydkXycuJGsuJ190eHQnXSk/KGludCkkX0dFVFsnZF8nLiRrLidfdHh0J106MDsKICAgICAgICBpZighJGFpZCl7ICRvWydTVE9QJ109J25lcmEgZF8nLiRrLidfdHh0JzsgZWNobyBqc29uX2VuY29kZSgkbyk7IGV4aXQ7IH0KICAgICAgICAka29kYXM9YmFzZTY0X2RlY29kZSh0cmltKGZpbGVfZ2V0X2NvbnRlbnRzKGdldF9hdHRhY2hlZF9maWxlKCRhaWQpKSkpOwogICAgICAgIHRva2VuX2dldF9hbGwoJGtvZGFzLCBUT0tFTl9QQVJTRSk7CiAgICAgICAgY29weSgka2VsaWFzLCRiZGlyLicvJy4kZmlbMF0uJy5iYWtfUzE1NDdiJyk7CiAgICAgICAgZmlsZV9wdXRfY29udGVudHMoJGtlbGlhcywka29kYXMpOwogICAgICAgIGlmKGZ1bmN0aW9uX2V4aXN0cygnb3BjYWNoZV9pbnZhbGlkYXRlJykpIG9wY2FjaGVfaW52YWxpZGF0ZSgka2VsaWFzLHRydWUpOwogICAgICAgIHdwX2RlbGV0ZV9hdHRhY2htZW50KCRhaWQsdHJ1ZSk7CiAgICAgICAgJG9bJGtdPWFycmF5KCdtZDUnPT5tZDVfZmlsZSgka2VsaWFzKSwnQic9PmZpbGVzaXplKCRrZWxpYXMpKTsKICAgICAgfQogICAgfQogICAgaWYoJ1ZFUic9PT0kX0dFVFsncHNfZmInXSl7CiAgICAgIGlmKCFjbGFzc19leGlzdHMoJ1BldHNob3BfQW5hbGl6ZV9GaWx0cmFpJykpeyAkb1snU1RPUCddPSdrbGFzZXMgbmVyYSc7IGVjaG8ganNvbl9lbmNvZGUoJG8pOyBleGl0OyB9CiAgICAgICR2ZT1QZXRzaG9wX0lzdF9BZGFwdGVyaXM6OnZlKCk7ICR2dT1QZXRzaG9wX0lzdF9BZGFwdGVyaXM6OnZ1KCk7CiAgICAgIC8qIGJlIGZpbHRybyAqLwogICAgICAkb1snYmUnXT1hcnJheSgKICAgICAgICAndXpzJz0+KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gJHZ1IiksCiAgICAgICAgJ2VpbCc9PihpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NICR2ZSIpLAogICAgICApOwogICAgICAvKiBqb3NlcmEgKyBzdW8gKyAyMDI1ICovCiAgICAgICRfR0VUWydmX2JyZW5kYXMnXT0nam9zZXJhJzsgJF9HRVRbJ2ZfZ3l2dW5hcyddPSdzdW8nOyAkX0dFVFsnZl9udW8nXT0nMjAyNS0wMS0wMSc7ICRfR0VUWydmX2lraSddPScyMDI1LTEyLTMxJzsKICAgICAgJHI9bmV3IFJlZmxlY3Rpb25Qcm9wZXJ0eSgnUGV0c2hvcF9BbmFsaXplX0ZpbHRyYWknLCdmJyk7ICRyLT5zZXRBY2Nlc3NpYmxlKHRydWUpOyAkci0+c2V0VmFsdWUobnVsbCxudWxsKTsKICAgICAgJGV3PVBldHNob3BfQW5hbGl6ZV9GaWx0cmFpOjplaWxfd2hlcmUoJ2UnKS5QZXRzaG9wX0FuYWxpemVfRmlsdHJhaTo6ZWlsX3BlcmlvZGFzKCdlJyk7CiAgICAgICR1dz1QZXRzaG9wX0FuYWxpemVfRmlsdHJhaTo6dXpzX3doZXJlKCd1Jyk7CiAgICAgICRvWydqb3NlcmFfc3VvXzIwMjUnXT1hcnJheSgKICAgICAgICAnZWlsJz0+KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gJHZlIGUgV0hFUkUgMT0xICRldyIpLAogICAgICAgICdlaWxfcGFqX2V1cic9PnJvdW5kKChpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT0FMRVNDRShTVU0oZS5rYWluYV9jdCksMCkgRlJPTSAkdmUgZSBXSEVSRSAxPTEgJGV3IikvMTAwLDIpLAogICAgICAgICd1enMnPT4oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSAkdnUgdSBXSEVSRSAxPTEgJHV3IiksCiAgICAgICAgJ2tsaWVudHUnPT4oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoRElTVElOQ1QgdS5rbGllbnRhc19lbWFpbF9oYXNoKSBGUk9NICR2dSB1IFdIRVJFIDE9MSAkdXciKSwKICAgICAgKTsKICAgICAgLyogZGltX3doZXJlIHNlZ21lbnRhaSAqLwogICAgICAkZHc9UGV0c2hvcF9BbmFsaXplX0ZpbHRyYWk6OmRpbV93aGVyZSgnay5yYWt0YXMnKTsKICAgICAgJG9bJ2pvc2VyYV9zZWcnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBrLnNlZ21lbnRhcywgQ09VTlQoKikgbiBGUk9NIHskd3BkYi0+cHJlZml4fXBzX2RpbV9rbGllbnRhaSBrIFdIRVJFIGsudGVzdGluaXM9MCAkZHcgR1JPVVAgQlkgay5zZWdtZW50YXMgT1JERVIgQlkgbiBERVNDIixBUlJBWV9BKTsKICAgICAgLyoga2F0ZSBmaWx0cmFzICovCiAgICAgICRfR0VUWydmX2JyZW5kYXMnXT0nJzsgJF9HRVRbJ2ZfZ3l2dW5hcyddPSdrYXRlJzsgJF9HRVRbJ2ZfbnVvJ109Jyc7ICRfR0VUWydmX2lraSddPScnOwogICAgICAkci0+c2V0VmFsdWUobnVsbCxudWxsKTsKICAgICAgJGV3Mj1QZXRzaG9wX0FuYWxpemVfRmlsdHJhaTo6ZWlsX3doZXJlKCdlJyk7CiAgICAgICRvWydrYXRlJ109YXJyYXkoJ2VpbCc9PihpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NICR2ZSBlIFdIRVJFIDE9MSAkZXcyIikpOwogICAgICAvKiB0YXgga2VsaWFzOiBhbmltb25kYSBwcmVrZV90YXhfd2hlcmUgKi8KICAgICAgJF9HRVRbJ2ZfZ3l2dW5hcyddPScnOyAkX0dFVFsnZl9icmVuZGFzJ109J2FuaW1vbmRhJzsgJHItPnNldFZhbHVlKG51bGwsbnVsbCk7CiAgICAgICR0dz1QZXRzaG9wX0FuYWxpemVfRmlsdHJhaTo6cHJla2VfdGF4X3doZXJlKCdwLklEJyk7CiAgICAgICRvWydhbmltb25kYV90YXhfcHJla2l1J109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyR3cGRiLT5wb3N0c30gcCBXSEVSRSBwLnBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHAucG9zdF9zdGF0dXM9J3B1Ymxpc2gnICR0dyIpOwogICAgICAkb1snYnJhbmRfdGF4J109UGV0c2hvcF9BbmFsaXplX0ZpbHRyYWk6OmJyYW5kX3RheCgpOwogICAgICAkb1snYnJlbmR1X3NhcmFzZSddPWNvdW50KFBldHNob3BfQW5hbGl6ZV9GaWx0cmFpOjpicmVuZGFpKCkpOwogICAgICAkb1sna2F0X2Ryb3Bkb3duX29rJ109ZnVuY3Rpb25fZXhpc3RzKCd3cF9kcm9wZG93bl9jYXRlZ29yaWVzJyk7CiAgICB9CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydrbGFpZGEnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGVjaG8ganNvbl9lbmNvZGUoJG8pOyBleGl0Owp9KTsK';
const VER='dep-200807';
const GKEY='ps_fb';
const PHASES=["DIEGTI", "VER"];
const OUT='analize/s1547_fb.json';
const DATA=["duomenys/ad.txt", "duomenys/kl.txt", "duomenys/pr.txt", "duomenys/at.txt"];
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
