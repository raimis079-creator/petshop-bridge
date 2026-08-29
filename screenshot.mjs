process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIEUzIHJlY29uIHYxLjAgKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYoKGlzc2V0KCRfR0VUWydwc19lMyddKT8kX0dFVFsncHNfZTMnXTonJykhPT0nUjEnKSByZXR1cm47CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICBlcnJvcl9yZXBvcnRpbmcoMCk7CiAgZ2xvYmFsICR3cGRiOwogICRvPWFycmF5KCd2Jz0+J0UzUjEnKTsKICB0cnl7CiAgICAvLyAxLiBsZW50ZWxlcwogICAgJHR0PSR3cGRiLT5nZXRfY29sKCJTSE9XIFRBQkxFUyBMSUtFICd7JHdwZGItPnByZWZpeH1wc19lbWFpbCUnIik7CiAgICAkb1snbGVudGVsZXMnXT0kdHQ7CiAgICBmb3JlYWNoKCR0dCBhcyAkdCl7CiAgICAgICRvWydkZXNjJ11bJHRdPSR3cGRiLT5nZXRfY29sKCJERVNDUklCRSBgJHRgIiwwKTsKICAgICAgJG9bJ2tpZWsnXVskdF09KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gYCR0YCIpOwogICAgfQogICAgLy8gMi4gam9icyBwanV2aXMKICAgICRqdD0kd3BkYi0+cHJlZml4Lidwc19lbWFpbF9qb2JzJzsKICAgICRvWydqb2JzX3N0YXR1cyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHN0YXR1cyxDT1VOVCgqKSBjIEZST00gYCRqdGAgR1JPVVAgQlkgc3RhdHVzIixBUlJBWV9BKTsKICAgICRvWydqb2JzX2Zsb3cnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBmbG93LGZsb3dfY2xhc3MsQ09VTlQoKikgYyxTVU0oZGVsaXZlcmVkX2F0IElTIE5PVCBOVUxMKSBkLFNVTShvcGVuZWRfYXQgSVMgTk9UIE5VTEwpIG9wLFNVTShjbGlja2VkX2F0IElTIE5PVCBOVUxMKSBjbCBGUk9NIGAkanRgIEdST1VQIEJZIGZsb3csZmxvd19jbGFzcyBPUkRFUiBCWSBjIERFU0MgTElNSVQgMjUiLEFSUkFZX0EpOwogICAgLy8gMy4gc3VwcHJlc3Npb24gcGp1dmlzIChqZWkgeXJhIHJlYXNvbi90eXBlIHN0dWxwZWxpcykKICAgIGZvcmVhY2goJHR0IGFzICR0KXsgaWYoc3RycG9zKCR0LCdzdXBwcmVzcycpIT09ZmFsc2UpewogICAgICAkY29scz0kb1snZGVzYyddWyR0XTsKICAgICAgZm9yZWFjaChhcnJheSgncmVhc29uJywndHlwZScsJ3NvdXJjZScpIGFzICRjKSBpZihpbl9hcnJheSgkYywkY29scyx0cnVlKSkKICAgICAgICAkb1snc3VwcF8nLiRjXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBgJGNgLENPVU5UKCopIGsgRlJPTSBgJHRgIEdST1VQIEJZIGAkY2AiLEFSUkFZX0EpOwogICAgfX0KICAgIC8vIDQuIGZsb3dzCiAgICBpZihjbGFzc19leGlzdHMoJ1BldHNob3BfRW1haWxfRGlzcGF0Y2gnKSl7CiAgICAgICRmPWFycmF5KCk7IGZvcmVhY2goUGV0c2hvcF9FbWFpbF9EaXNwYXRjaDo6Zmxvd3MoKSBhcyAkaz0+JGMpeyAkZlska109aXNzZXQoJGNbJ2NsYXNzJ10pPyRjWydjbGFzcyddOihpc19zdHJpbmcoJGMpPyRjOmpzb25fZW5jb2RlKGFycmF5X2tleXMoKGFycmF5KSRjKSkpOyB9CiAgICAgICRvWydmbG93cyddPSRmOwogICAgfQogICAgLy8gNS4ga2FtcGFuaWp1IGxhbmdhcwogICAgaWYoY2xhc3NfZXhpc3RzKCdQZXRzaG9wX0thbXBhbmlqdV9MYW5nYXMnKSl7CiAgICAgICRtPWFycmF5KCk7IGZvcmVhY2goKG5ldyBSZWZsZWN0aW9uQ2xhc3MoJ1BldHNob3BfS2FtcGFuaWp1X0xhbmdhcycpKS0+Z2V0TWV0aG9kcygpIGFzICRtbSl7CiAgICAgICAgJHA9YXJyYXkoKTsgZm9yZWFjaCgkbW0tPmdldFBhcmFtZXRlcnMoKSBhcyAkcHApeyRwW109JHBwLT5nZXROYW1lKCk7fQogICAgICAgICRtWyRtbS0+Z2V0TmFtZSgpXT1pbXBsb2RlKCcsJywkcCk7CiAgICAgIH0KICAgICAgJG9bJ2thbXBfbWV0b2RhaSddPSRtOwogICAgfQogICAgLy8gNi4gYWRtaW4gc2FrYQogICAgJGFmPVdQTVVfUExVR0lOX0RJUi4nL3BldHNob3AtbGFuZ2FpLWFkbWluLnBocCc7CiAgICAkb1snYWRtaW5fbWQ1J109ZmlsZV9leGlzdHMoJGFmKT9tZDVfZmlsZSgkYWYpOidORVJBJzsKICAgICRvWydhZG1pbl92ZXInXT1maWxlX2V4aXN0cygkYWYpPyhwcmVnX21hdGNoKCcvdlxkK1wuXGQrLycsZmlsZV9nZXRfY29udGVudHMoJGFmLGZhbHNlLG51bGwsMCw0MDApLCRtdik/JG12WzBdOic/Jyk6Jy0nOwogICAgLy8gYXIgeXJhIGFkZF9zdWJtZW51IGkgcGV0c2hvcC1sYW5nYWkgaXMga2l0dXIKICAgICRvWydtdV9mYWlsYWknXT1hcnJheV9tYXAoJ2Jhc2VuYW1lJyxnbG9iKFdQTVVfUExVR0lOX0RJUi4nL3BldHNob3AtKi5waHAnKSk7CiAgICAvLyA3LiBjb25zZW50L3N1cHByZXNzaW9uIHNrYWljaWFpIHN0b3AtZ28gZm9ybXVsZW1zCiAgICAkY2w9JHdwZGItPnByZWZpeC4ncHNfY29uc2VudF9sb2cnOwogICAgaWYoJHdwZGItPmdldF92YXIoIlNIT1cgVEFCTEVTIExJS0UgJyRjbCciKSkgJG9bJ2NvbnNlbnRfa2llayddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVChESVNUSU5DVCBlbWFpbCkgRlJPTSBgJGNsYCIpOwogICAgLy8gOC4gam9icyBsYWlrbyBzdHVscGVsaWFpIHBhdnl6ZHlzCiAgICAkb1snam9ic19wdnonXT0kd3BkYi0+Z2V0X3JvdygiU0VMRUNUICogRlJPTSBgJGp0YCBPUkRFUiBCWSBpZCBERVNDIExJTUlUIDEiLEFSUkFZX0EpOwogICAgaWYoaXNfYXJyYXkoJG9bJ2pvYnNfcHZ6J10pKSBmb3JlYWNoKCRvWydqb2JzX3B2eiddIGFzICRrPT4kdil7IGlmKHN0cmxlbigoc3RyaW5nKSR2KT44MCkgJG9bJ2pvYnNfcHZ6J11bJGtdPXN1YnN0cigkdiwwLDgwKS4nLi4uJzsgfQogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCAnLiRlLT5nZXRMaW5lKCk7IH0KICBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0pOwo=';
const VER='e3_recon-201705';
const GKEY='ps_e3';
const PHASES=["R1"];
const OUT='analize/e3_recon.json';
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
  const l=await fx(SNIP,{headers:A},'list'); const arr=JSON.parse(await l.text());
  for(const s of (Array.isArray(arr)?arr:[]).filter(s=>s.active&&/^TEMP/.test(s.name||''))){
    await fetch(SNIP+'/'+s.id,{method:'POST',headers:A,body:JSON.stringify({id:s.id,active:false})}); }
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
