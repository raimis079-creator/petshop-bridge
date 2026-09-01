process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNTY5IGthcyByZWRpcmVjdCdpbmEgcGV0c2hvcC5sdCDihpIgZGV2ICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogICRmPWlzc2V0KCRfR0VUWydwc19zZW8nXSk/JF9HRVRbJ3BzX3NlbyddOicnOyBpZigkZiE9PSdSJykgcmV0dXJuOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7ICRvPWFycmF5KCd2Jz0+J1MxNTY5Jyk7CiAgdHJ5eyAkaHQ9ZmlsZV9nZXRfY29udGVudHMoQUJTUEFUSC4nLmh0YWNjZXNzJyk7ICRvWydodF9hdmVzYSddPWFycmF5X3ZhbHVlcyhhcnJheV9maWx0ZXIoZXhwbG9kZSgiXG4iLCRodCksZm4oJGwpPT5zdHJpcG9zKCRsLCdhdmVzYScpIT09ZmFsc2V8fHN0cmlwb3MoJGwsJ2RldicpIT09ZmFsc2UpKTsgJG9bJ2h0X2Z1bGxfbGVuJ109c3RybGVuKCRodCk7CiAgICAkd2M9ZmlsZV9nZXRfY29udGVudHMoQUJTUEFUSC4nd3AtY29uZmlnLnBocCcpOyBwcmVnX21hdGNoKCd+L1wqIFIxOTQgZGV2IHZlaWRyb2Rpcy4qP1xuXH1cbn5zJywkd2MsJG0pOyAkb1snd3Bjb25maWdfZGV2X2Jsb2NrJ109JG1bMF0/PyduZXJhJzsgJG9bJ3dwY29uZmlnX2F2ZXNhX2xpbmVzJ109YXJyYXlfdmFsdWVzKGFycmF5X2ZpbHRlcihleHBsb2RlKCJcbiIsJHdjKSxmbigkbCk9PnN0cmlwb3MoJGwsJ2F2ZXNhJykhPT1mYWxzZSkpOwogICAgJG9bJ3ZlaWRyb2RpcyddPWZpbGVfZ2V0X2NvbnRlbnRzKFdQTVVfUExVR0lOX0RJUi4nL3BldHNob3AtZGV2LXZlaWRyb2Rpcy5waHAnKTsKICAgICRvWydkZXZfcm91dGVyX3Jvb3QnXT1maWxlX2V4aXN0cyhBQlNQQVRILidkZXYtcm91dGVyLnBocCcpOyAkb1snZGV2X2RvY3Jvb3RfZmlsZXMnXT1AYXJyYXlfbWFwKCdiYXNlbmFtZScsKGFycmF5KWdsb2IoJy9ob21lL2d5dnVuYWkyL2RvbWFpbnMvYXZlc2EubHQvcHVibGljX2h0bWwvZGV2LyonKSk7CiAgICAkb1snZGV2X3JvdXRlciddPWZpbGVfZXhpc3RzKCcvaG9tZS9neXZ1bmFpMi9kb21haW5zL2F2ZXNhLmx0L3B1YmxpY19odG1sL2Rldi9kZXYtcm91dGVyLnBocCcpP3N1YnN0cihmaWxlX2dldF9jb250ZW50cygnL2hvbWUvZ3l2dW5haTIvZG9tYWlucy9hdmVzYS5sdC9wdWJsaWNfaHRtbC9kZXYvZGV2LXJvdXRlci5waHAnKSwwLDE1MDApOm51bGw7ICRvWydkZXZfaW5kZXgnXT1maWxlX2V4aXN0cygnL2hvbWUvZ3l2dW5haTIvZG9tYWlucy9hdmVzYS5sdC9wdWJsaWNfaHRtbC9kZXYvaW5kZXgucGhwJyk/c3Vic3RyKGZpbGVfZ2V0X2NvbnRlbnRzKCcvaG9tZS9neXZ1bmFpMi9kb21haW5zL2F2ZXNhLmx0L3B1YmxpY19odG1sL2Rldi9pbmRleC5waHAnKSwwLDYwMCk6bnVsbDsgJG9bJ2Rldl9odCddPWZpbGVfZXhpc3RzKCcvaG9tZS9neXZ1bmFpMi9kb21haW5zL2F2ZXNhLmx0L3B1YmxpY19odG1sL2Rldi8uaHRhY2Nlc3MnKT9maWxlX2dldF9jb250ZW50cygnL2hvbWUvZ3l2dW5haTIvZG9tYWlucy9hdmVzYS5sdC9wdWJsaWNfaHRtbC9kZXYvLmh0YWNjZXNzJyk6bnVsbDsKICAgICRvWydzaXRldXJsJ109Z2V0X29wdGlvbignc2l0ZXVybCcpOyAkb1snaG9tZSddPWdldF9vcHRpb24oJ2hvbWUnKTsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJG9bJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKTsgfQogIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTKTsgZXhpdDsKfSk7Cg==';
const VER='dep-145200';
const GKEY='ps_seo';
const PHASES=["R"];
const OUT='analize/s1569.json';
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
