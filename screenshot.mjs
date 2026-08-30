process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIG5scmVjb24gbmF1amllbmxhaXNrdSBzaXN0ZW1vcyByZWNvbiAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICAkZj0oaXNzZXQoJF9HRVRbJ3BzX25sJ10pPyRfR0VUWydwc19ubCddOicnKTsgaWYoJGYhPT0nR08nKSByZXR1cm47CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAkbz1hcnJheSgndic9PidubHJlY29uJyk7CiAgdHJ5ewogICAgZ2xvYmFsICR3cGRiOwogICAgLy8gMS4gbXUtcGx1Z2lucyBzdXNpamUgc3UgbGFpc2thaXMvbmF1amllbmxhaXNraWFpcwogICAgJG9bJ211J109YXJyYXkoKTsKICAgIGZvcmVhY2goc2NhbmRpcihXUE1VX1BMVUdJTl9ESVIpIGFzICRmbil7CiAgICAgIGlmKCFwcmVnX21hdGNoKCcvbGFpc2t8bmF1amllbnxrYW1wYW58cmV6dWx0YXR8c2VuZGVyL2knLCRmbikpIGNvbnRpbnVlOwogICAgICAkcD1XUE1VX1BMVUdJTl9ESVIuJy8nLiRmbjsgaWYoIWlzX2ZpbGUoJHApKSBjb250aW51ZTsKICAgICAgJGM9ZmlsZV9nZXRfY29udGVudHMoJHAsZmFsc2UsbnVsbCwwLDYwMCk7CiAgICAgIHByZWdfbWF0Y2goJy9WZXJzaW9uOlxzKihbMC05Ll0rKS9pJywkYywkbTEpOwogICAgICBwcmVnX21hdGNoKCcvUGx1Z2luIE5hbWU6XHMqKC4rKS9pJywkYywkbTIpOwogICAgICAkb1snbXUnXVtdPWFycmF5KCdmJz0+JGZuLCdkeWRpcyc9PmZpbGVzaXplKCRwKSwnbWQ1Jz0+bWQ1X2ZpbGUoJHApLAogICAgICAgICd2ZXInPT5pc3NldCgkbTFbMV0pPyRtMVsxXTonPycsJ25hbWUnPT5pc3NldCgkbTJbMV0pP3RyaW0oJG0yWzFdKTonPycpOwogICAgfQogICAgLy8gMi4gbGVudGVsZXMKICAgICR0YWJzPSR3cGRiLT5nZXRfY29sKCJTSE9XIFRBQkxFUyBMSUtFICd7JHdwZGItPnByZWZpeH1wc1xcXyUnIik7CiAgICAkb1sncHNfbGVudGVsZXMnXT1hcnJheSgpOwogICAgZm9yZWFjaCgkdGFicyBhcyAkdCl7CiAgICAgICRuPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIGAkdGAiKTsKICAgICAgJG9bJ3BzX2xlbnRlbGVzJ11bc3RyX3JlcGxhY2UoJHdwZGItPnByZWZpeCwnJywkdCldPSRuOwogICAgfQogICAgLy8gMy4gbmF1amllbmxhaXNraXUgbGVudGVsZSBkZXRhbGlhdSAoamVpIHlyYSkKICAgICRudD0kd3BkYi0+cHJlZml4Lidwc19uYXVqaWVubGFpc2tpYWknOwogICAgaWYoaW5fYXJyYXkoJG50LCR0YWJzKSl7CiAgICAgICRvWydubF9zdHVscGVsaWFpJ109JHdwZGItPmdldF9jb2woIlNIT1cgQ09MVU1OUyBGUk9NIGAkbnRgIik7CiAgICAgICRvWydubF9laWx1dGVzJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgKiBGUk9NIGAkbnRgIE9SREVSIEJZIGlkIERFU0MgTElNSVQgNSIsQVJSQVlfQSk7CiAgICB9CiAgICAvLyA0LiBwc19lbWFpbF9qb2JzIHN1dmVzdGluZQogICAgJGVqPSR3cGRiLT5wcmVmaXguJ3BzX2VtYWlsX2pvYnMnOwogICAgaWYoaW5fYXJyYXkoJGVqLCR0YWJzKSl7CiAgICAgICRvWydlbWFpbF9qb2JzX3BhZ2FsX2tsYXNlJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1Qga2xhc2UsQ09VTlQoKikgbiBGUk9NIGAkZWpgIEdST1VQIEJZIGtsYXNlIE9SREVSIEJZIG4gREVTQyBMSU1JVCAxNSIsQVJSQVlfQSk7CiAgICAgIGlmKCEkb1snZW1haWxfam9ic19wYWdhbF9rbGFzZSddKQogICAgICAgICRvWydlal9zdHVscGVsaWFpJ109JHdwZGItPmdldF9jb2woIlNIT1cgQ09MVU1OUyBGUk9NIGAkZWpgIik7CiAgICB9CiAgICAvLyA1LiBrbGFzZXMvYWRhcHRlcmlzCiAgICBmb3JlYWNoKGFycmF5KCdQZXRzaG9wX1NlbmRlcl9BZGFwdGVyJywnUGV0c2hvcF9FbWFpbF9EaXNwYXRjaCcsJ1BldHNob3BfRXZlbnRfUmVnaXN0cnknKSBhcyAkaykKICAgICAgJG9bJ2tsYXNlcyddWyRrXT1jbGFzc19leGlzdHMoJGspOwogICAgaWYoY2xhc3NfZXhpc3RzKCdQZXRzaG9wX1NlbmRlcl9BZGFwdGVyJykpewogICAgICB0cnl7ICRyPW5ldyBSZWZsZWN0aW9uQ2xhc3MoJ1BldHNob3BfU2VuZGVyX0FkYXB0ZXInKTsKICAgICAgICAkb1snc2VuZGVyX21ldG9kYWknXT1hcnJheV9tYXAoZnVuY3Rpb24oJG0pe3JldHVybiAkbS0+Z2V0TmFtZSgpO30sJHItPmdldE1ldGhvZHMoKSk7CiAgICAgICAgaWYoJHItPmhhc01ldGhvZCgnaXNfY29uZmlndXJlZCcpKXsgJG1tPSRyLT5nZXRNZXRob2QoJ2lzX2NvbmZpZ3VyZWQnKTsKICAgICAgICAgIGlmKCRtbS0+aXNTdGF0aWMoKSkgJG9bJ3NlbmRlcl9jb25maWd1cmVkJ109UGV0c2hvcF9TZW5kZXJfQWRhcHRlcjo6aXNfY29uZmlndXJlZCgpOwogICAgICAgIH0KICAgICAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydzZW5kZXJfcmVmbCddPSRlLT5nZXRNZXNzYWdlKCk7IH0KICAgIH0KICAgIC8vIDYuIGNyb24ga2FibGlhaQogICAgJGNyPV9nZXRfY3Jvbl9hcnJheSgpOyAkb1snY3JvbiddPWFycmF5KCk7CiAgICBmb3JlYWNoKCRjciBhcyAkdHM9PiRob29rcykgZm9yZWFjaCgkaG9va3MgYXMgJGg9PiR4KQogICAgICBpZihwcmVnX21hdGNoKCcvbGFpc2t8bmF1amllbnxrYW1wYW58c2VuZGVyfGVtYWlsfG5sL2knLCRoKSkKICAgICAgICAkb1snY3JvbiddWyRoXT1nbWRhdGUoJ1ktbS1kIEg6aScsJHRzKTsKICAgIC8vIDcuIHByZW51bWVyYXRvcml1L3N1dGlraW11IHZpZXRvcwogICAgZm9yZWFjaChhcnJheSgncHNfbmxfcHJlbnVtZXJhdG9yaWFpJywncHNfc3V0aWtpbWFpJywncHNfZXZlbnRfbG9nJywncHNfd2ViaG9va19sb2cnKSBhcyAkdDIpewogICAgICAkZnQ9JHdwZGItPnByZWZpeC4kdDI7CiAgICAgIGlmKGluX2FycmF5KCRmdCwkdGFicykmJiFpc3NldCgkb1sncHNfbGVudGVsZXMnXVskdDJdKSkgJG9bJ3BzX2xlbnRlbGVzJ11bJHQyXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSBgJGZ0YCIpOwogICAgfQogICAgLy8gOC4gb3B0aW9ucyBzdSBzZW5kZXIvbmwgcmFrdHUKICAgICRvWydvcHRpb25zJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1Qgb3B0aW9uX25hbWUsTEVOR1RIKG9wdGlvbl92YWx1ZSkgbGVuIEZST00geyR3cGRiLT5vcHRpb25zfSBXSEVSRSBvcHRpb25fbmFtZSBMSUtFICclc2VuZGVyJScgT1Igb3B0aW9uX25hbWUgTElLRSAnJW5hdWppZW5sYWlzayUnIE9SIG9wdGlvbl9uYW1lIExJS0UgJ3BzX25sJScgTElNSVQgMjAiLEFSUkFZX0EpOwogICAgLy8gOS4gV1AgdXNlcmlhaSBzdSBuYXVqaWVubGFpc2tpbyBzdXRpa2ltdSBtZXRhIChqZWkgdG9raWEgbWV0YSB5cmEpCiAgICAkb1snY29uc2VudF9tZXRhJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgbWV0YV9rZXksQ09VTlQoKikgbiBGUk9NIHskd3BkYi0+dXNlcm1ldGF9IFdIRVJFIG1ldGFfa2V5IExJS0UgJyVjb25zZW50JScgT1IgbWV0YV9rZXkgTElLRSAnJXN1dGlraW0lJyBPUiBtZXRhX2tleSBMSUtFICclbmV3c2xldHRlciUnIEdST1VQIEJZIG1ldGFfa2V5IixBUlJBWV9BKTsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJG9bJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9KTsK';
const VER='dep-213028';
const GKEY='ps_nl';
const PHASES=["GO"];
const OUT='analize/nlrecon.json';
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
    try{ out[f]=JSON.parse(t); }catch(e){ out['zalias_'+f]=t.slice(0,3000); }
  }
}catch(e){ out.klaida=String(e).slice(0,500); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put(OUT, Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
