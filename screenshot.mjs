process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfcjIxOCddKSA/ICRfR0VUWydwc19yMjE4J10gOiAnJykgIT09ICdHTycpIHJldHVybjsKIGdsb2JhbCAkd3BkYjsKICRvID0gYXJyYXkoJ3YnPT4nUjIxOCcpOwoKIC8qIC0tLS0gMS4gS2FzIGthYmluYXNpIGFudCBrcmVwc2VsaW8gbW9rZXNjaXUgLS0tLSAqLwogZ2xvYmFsICR3cF9maWx0ZXI7CiAka2FibCA9IGFycmF5KCk7CiBmb3JlYWNoKGFycmF5KCd3b29jb21tZXJjZV9jYXJ0X2NhbGN1bGF0ZV9mZWVzJykgYXMgJGgpewogICBpZihlbXB0eSgkd3BfZmlsdGVyWyRoXSkpIHsgJGthYmxbJGhdPSduZXJhJzsgY29udGludWU7IH0KICAgZm9yZWFjaCgkd3BfZmlsdGVyWyRoXS0+Y2FsbGJhY2tzIGFzICRwcj0+JGNicyl7CiAgICAgZm9yZWFjaCgkY2JzIGFzICRjYil7CiAgICAgICAkZiA9ICRjYlsnZnVuY3Rpb24nXTsKICAgICAgIGlmKGlzX2FycmF5KCRmKSkgJHYgPSAoaXNfb2JqZWN0KCRmWzBdKT9nZXRfY2xhc3MoJGZbMF0pOihzdHJpbmcpJGZbMF0pLic6OicuJGZbMV07CiAgICAgICBlbHNlaWYoaXNfc3RyaW5nKCRmKSkgJHYgPSAkZjsKICAgICAgIGVsc2VpZigkZiBpbnN0YW5jZW9mIENsb3N1cmUpewogICAgICAgICAkcmYgPSBuZXcgUmVmbGVjdGlvbkZ1bmN0aW9uKCRmKTsKICAgICAgICAgJHYgPSAnY2xvc3VyZSBAICcuYmFzZW5hbWUoJHJmLT5nZXRGaWxlTmFtZSgpKS4nOicuJHJmLT5nZXRTdGFydExpbmUoKTsKICAgICAgIH0gZWxzZSAkdiA9ICduZXppbm9tYSc7CiAgICAgICAka2FibFskaF1bXSA9ICR2LicgKHByICcuJHByLicpJzsKICAgICB9CiAgIH0KIH0KICRvWydmZWVfa2FibGl1a2FpJ10gPSAka2FibDsKCiAvKiAtLS0tIDIuIEt1ciBrb2RlIG1pbmltYXMgbWF6YXMga3JlcHNlbGlzIC0tLS0gKi8KICRpZXNrb3RpID0gYXJyYXkoJ01hxb5vIGtyZXDFoWVsaW8nLCAnbWF6byBrcmVwc2VsaW8nLCAnc21hbGxfY2FydCcsICdhZGRfZmVlJywgJ21hemFzX2tyZXBzZWxpcycpOwogJHJhZG8gPSBhcnJheSgpOwogJG11ID0gZGVmaW5lZCgnV1BNVV9QTFVHSU5fRElSJykgPyBXUE1VX1BMVUdJTl9ESVIgOiBXUF9DT05URU5UX0RJUi4nL211LXBsdWdpbnMnOwogZm9yZWFjaChhcnJheV9tZXJnZSgoYXJyYXkpZ2xvYigkbXUuJy8qLnBocCcpLCAoYXJyYXkpZ2xvYigkbXUuJy8qLyoucGhwJykpIGFzICRmKXsKICAgJGMgPSBAZmlsZV9nZXRfY29udGVudHMoJGYpOyBpZigkYz09PWZhbHNlKSBjb250aW51ZTsKICAgZm9yZWFjaCgkaWVza290aSBhcyAkcSl7IGlmKHN0cnBvcygkYywkcSkhPT1mYWxzZSkgJHJhZG9bJ01VOiAnLmJhc2VuYW1lKCRmKV1bXSA9ICRxOyB9CiB9CiAvKiBzbmlwcGV0YWkgKi8KICR0ID0gJHdwZGItPnByZWZpeC4nc25pcHBldHMnOwogZm9yZWFjaCgkd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpZCxuYW1lLGFjdGl2ZSxjb2RlIEZST00gJHQgV0hFUkUgY29kZSBMSUtFICclY2FsY3VsYXRlX2ZlZXMlJyBPUiBjb2RlIExJS0UgJyVhZGRfZmVlJSciLCBBUlJBWV9BKSBhcyAkcyl7CiAgICRyYWRvWydTTklQICcuJHNbJ2lkJ10uJyAnLigkc1snYWN0aXZlJ10/J0FLVFlWVVMnOidpc2p1bmd0YXMnKV0gPSBtYl9zdWJzdHIoJHNbJ25hbWUnXSwwLDcwKTsKIH0KIC8qIFdDIG51c3RhdHltYWkgKi8KICRvWyd3Y19mZWVfb3BjaWpvcyddID0gJHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1Qgb3B0aW9uX25hbWUsIExFRlQob3B0aW9uX3ZhbHVlLDEyMCkgdiBGUk9NIHskd3BkYi0+b3B0aW9uc30KICAgV0hFUkUgb3B0aW9uX25hbWUgTElLRSAnJW1va2VzdCUnIE9SIG9wdGlvbl9uYW1lIExJS0UgJyVfZmVlJScgT1Igb3B0aW9uX25hbWUgTElLRSAnJWtyZXBzZWwlJyBMSU1JVCAyNSIsIEFSUkFZX0EpOwogJG9bJ21va2VzY2lvX3NhbHRpbmlhaSddID0gJHJhZG87CgogLyogLS0tLSAzLiBBciB5cmEgV0Mgc2hpcHBpbmcvZmVlIGtsYXNlIHN1IHRva2l1IHZhcmR1IC0tLS0gKi8KICRvWydzaGlwcGluZ196b25vcyddID0gYXJyYXkoKTsKIGlmKGNsYXNzX2V4aXN0cygnV0NfU2hpcHBpbmdfWm9uZXMnKSl7CiAgIGZvcmVhY2goV0NfU2hpcHBpbmdfWm9uZXM6OmdldF96b25lcygpIGFzICR6KXsKICAgICBmb3JlYWNoKCR6WydzaGlwcGluZ19tZXRob2RzJ10gYXMgJG0pewogICAgICAgJG9bJ3NoaXBwaW5nX3pvbm9zJ11bXSA9ICR6Wyd6b25lX25hbWUnXS4nIMK3ICcuJG0tPmdldF90aXRsZSgpLicgwrcgJy4kbS0+aWQuJyDCtyAnLigkbS0+aXNfZW5hYmxlZCgpPydvbic6J29mZicpOwogICAgIH0KICAgfQogfQoKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiBlY2hvIHdwX2pzb25fZW5jb2RlKCRvLCBKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVMpOwogZXhpdDsKfSwgMTMxKTsK';
const out={versija:'R218'};
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
  const kunas=JSON.stringify({name:'ZZ R218 Krepselio mokestis',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5});
  const c=await fetch(SNIP,{method:'POST',headers:A,body:kunas});
  let j=null; const ct=await c.text(); try{j=JSON.parse(ct);}catch(e){}
  out.sukurta=j&&j.id?j.id:{s:c.status,t:ct.slice(0,200)};
  if(j&&j.id){
    await miegok(6000);
    const rr=await fetch(WP+'/?ps_r218=GO'); const tt=await rr.text();
    try{ out.DUOM=JSON.parse(tt); }catch(e){ out.zalias=tt.slice(0,600); }
    /* a11y: kategorijos ir prekes HTML */
    const kat=await (await fetch(WP+'/kategorija/rinkiniai/')).text();
    const pre=await (await fetch(WP+'/product/test-konservu-deze-400-be-vistienos/')).text();
    const tuscios=(h)=>{ let n=0; const re=/<a\b[^>]*>([\s\S]*?)<\/a>/g; let m;
      while((m=re.exec(h))){ const vidus=m[1].replace(/<[^>]*>/g,'').replace(/&nbsp;|\s/g,'');
        const turiAria=/aria-label=|title=/.test(m[0]); const turiImg=/<img|<svg/.test(m[1]);
        if(!vidus && !turiAria && !turiImg) n++; } return n; };
    const antrastes=(h)=>{ const r={}; for(const lv of [1,2,3,4,5,6]) r['h'+lv]=(h.match(new RegExp('<h'+lv+'[\\s>]','g'))||[]).length; return r; };
    out.a11y={
      kategorija:{tuscios_nuorodos:tuscios(kat), antrastes:antrastes(kat)},
      preke:{tuscios_nuorodos:tuscios(pre), antrastes:antrastes(pre)},
      psnl_check:(kat.match(/psnl-check/g)||[]).length
    };
    await fetch(SNIP+'/'+j.id,{method:'POST',headers:A,body:JSON.stringify({id:j.id,active:false})});
  }
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('screenshots/r218.json', Buffer.from(JSON.stringify(out,null,1)), 'r218 mokestis + a11y');
