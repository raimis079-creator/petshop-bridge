process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICRyID0gaXNzZXQoJF9HRVRbJ3BzX3IyMTcnXSkgPyAkX0dFVFsncHNfcjIxNyddIDogJyc7CiBpZigkciAhPT0gJ0RSWScgJiYgJHIgIT09ICdBUFBMWScpIHJldHVybjsKICRvID0gYXJyYXkoJ3YnPT4nUjIxNycsJ3JlemltYXMnPT4kcik7CiBpZighZnVuY3Rpb25fZXhpc3RzKCdkZWFjdGl2YXRlX3BsdWdpbnMnKSkgcmVxdWlyZV9vbmNlIEFCU1BBVEguJ3dwLWFkbWluL2luY2x1ZGVzL3BsdWdpbi5waHAnOwoKICRmYWlsYXMgPSAncG9zdGl0L3Bvc3RpdC5waHAnOwogJGFrdCA9IChhcnJheSlnZXRfb3B0aW9uKCdhY3RpdmVfcGx1Z2lucycsIGFycmF5KCkpOwogJG9bJ3ByaWVzJ10gPSBhcnJheSgna2llayc9PmNvdW50KCRha3QpLCAnYWt0eXZ1cyc9PmluX2FycmF5KCRmYWlsYXMsJGFrdCx0cnVlKSk7CgogLyogc2F1Z2lrbGlzOiBpc2p1bmdpYW0gVElLIGplaSBBUEkgcmFrdGFzIHR1c2NpYXMgaXIgbmVyYSBrYWJsaXVrdSAqLwogJHJha3RhcyA9IChzdHJpbmcpZ2V0X29wdGlvbigncG9zdGl0X2FwaV9rZXknLCcnKTsKICRvWydhcGlfcmFrdGFzJ10gPSAkcmFrdGFzID09PSAnJyA/ICdUVVNDSUFTJyA6ICdZUkEgKCcuc3RybGVuKCRyYWt0YXMpLicgc2ltYi4pJzsKICRvWydzYXVnaWtsaXMnXSA9ICgkcmFrdGFzID09PSAnJyAmJiBpbl9hcnJheSgkZmFpbGFzLCRha3QsdHJ1ZSkpID8gJ09LJyA6ICdTVE9QJzsKCiBpZigkciA9PT0gJ0FQUExZJyAmJiAkb1snc2F1Z2lrbGlzJ10gPT09ICdPSycpewogICBkZWFjdGl2YXRlX3BsdWdpbnMoJGZhaWxhcywgdHJ1ZSk7ICAgLyogdHJ1ZSA9IG5la3ZpZXN0aSBkZWFrdHl2YXZpbW8ga2FibGl1a3UgKi8KICAgJHBvID0gKGFycmF5KWdldF9vcHRpb24oJ2FjdGl2ZV9wbHVnaW5zJywgYXJyYXkoKSk7CiAgICRvWydwbyddID0gYXJyYXkoJ2tpZWsnPT5jb3VudCgkcG8pLCAnYWt0eXZ1cyc9PmluX2FycmF5KCRmYWlsYXMsJHBvLHRydWUpKTsKICAgJG9bJ2ZhaWxhaV9saWtvJ10gPSBpc19kaXIoV1BfUExVR0lOX0RJUi4nL3Bvc3RpdCcpID8gJ1RBSVAnIDogJ25lJzsKICAgJG9bJ251c3RhdHltYWlfbGlrbyddID0gZ2V0X29wdGlvbigncG9zdGl0X29wdGlvbnMnKSAhPT0gZmFsc2UgPyAnVEFJUCcgOiAnbmUnOwogfQoKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiBlY2hvIHdwX2pzb25fZW5jb2RlKCRvLCBKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVMpOwogZXhpdDsKfSwgMTMxKTsK';
const out={versija:'R217'};
const miegok=(ms)=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
const A={Authorization:AUTH,'Content-Type':'application/json'};
const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
try{
  const kunas=JSON.stringify({name:'ZZ R217 Postit isjungimas',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5});
  const c=await fetch(SNIP,{method:'POST',headers:A,body:kunas});
  let j=null; const ct=await c.text(); try{j=JSON.parse(ct);}catch(e){}
  out.sukurta=j&&j.id?j.id:{s:c.status,t:ct.slice(0,200)};
  if(j&&j.id){
    await miegok(6000);
    const d1=await fetch(WP+'/?ps_r217=DRY'); try{ out.DRY=JSON.parse(await d1.text()); }catch(e){ out.DRY='klaida'; }
    if(out.DRY && out.DRY.saugiklis==='OK'){
      const d2=await fetch(WP+'/?ps_r217=APPLY'); try{ out.APPLY=JSON.parse(await d2.text()); }catch(e){ out.APPLY='klaida'; }
      await miegok(3000);
      /* svetaine sveika po isjungimo? */
      for(const [v,k] of [['pradzia','/'],['kasa','/kasa/'],['parduotuve','/parduotuve/'],['preke','/product/test-konservu-deze-400-be-vistienos/']]){
        try{ const q=await fetch(WP+k,{redirect:'manual'}); const h=await q.text();
             out[v]={s:q.status, ilgis:h.length, klaida:/Fatal error|Parse error/i.test(h)?'TAIP':'ne'}; }
        catch(e){ out[v]='klaida'; }
      }
    }
    await fetch(SNIP+'/'+j.id,{method:'POST',headers:A,body:JSON.stringify({id:j.id,active:false})});
  }
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('screenshots/r217.json', Buffer.from(JSON.stringify(out,null,1)), 'r217 postit isjungimas');
