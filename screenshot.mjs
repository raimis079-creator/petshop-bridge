process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIElNUDQgRGluYW1pbmlvIHR1cmluaW8gZGV0ZWtjaWphIHYxLjAgKHJlYWQtb25seSkgKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYoKGlzc2V0KCRfR0VUWydwc19iaXMnXSk/JF9HRVRbJ3BzX2JpcyddOicnKSE9PSdJTVA0JykgcmV0dXJuOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgJG89YXJyYXkoJ3YnPT4nSU1QNC12MS4wJyk7CiAgdHJ5ewogICAgJGRpcj1QRVRTSE9QX0NPUkVfRElSLid0ZW1wbGF0ZXMvZW1haWxzLyc7CiAgICBmb3JlYWNoKFBldHNob3BfRW1haWxfRGlzcGF0Y2g6OmZsb3dzKCkgYXMgJGY9PiRjKXsKICAgICAgJHA9JGRpci4kY1sndGVtcGxhdGUnXS4nLnBocCc7CiAgICAgIGlmKCFmaWxlX2V4aXN0cygkcCkpeyAkb1skZl09J0ZBSUxPIE5FUkEnOyBjb250aW51ZTsgfQogICAgICAkdD1maWxlX2dldF9jb250ZW50cygkcCk7CiAgICAgIC8qIG51aW1hbSBrb21lbnRhcnVzLCBrYWQgem9kemlhaSBrb21lbnRhcnVvc2UgbmVrbGFpZGludHUgKi8KICAgICAgJHN3PScnOwogICAgICBmb3JlYWNoKHRva2VuX2dldF9hbGwoJHQpIGFzICR0b2spewogICAgICAgIGlmKGlzX2FycmF5KCR0b2spKXsgaWYoaW5fYXJyYXkoJHRva1swXSxhcnJheShUX0NPTU1FTlQsVF9ET0NfQ09NTUVOVCksdHJ1ZSkpIGNvbnRpbnVlOyAkc3cuPSR0b2tbMV07IH0KICAgICAgICBlbHNlICRzdy49JHRvazsKICAgICAgfQogICAgICAkcj1hcnJheSgpOwogICAgICBmb3JlYWNoKGFycmF5KCdmb3JlYWNoJywnaW1wbG9kZScsJ2FycmF5X21hcCcsJ3doaWxlJywnYXJyYXlfc2xpY2UnLCdjb3VudCgnKSBhcyAkeil7CiAgICAgICAgJG49c3Vic3RyX2NvdW50KCRzdywkeik7IGlmKCRuKSAkclskel09JG47CiAgICAgIH0KICAgICAgaWYoJHIpICRvWyRmXT0kcjsKICAgIH0KICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJG9bJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAgJy4kZS0+Z2V0TGluZSgpOyB9CiAgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9KTsK';
const VER='IMP4-171151';
const GKEY='ps_bis';
const PHASES=["IMP4"];
const OUT='analize/imp4.json';
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
