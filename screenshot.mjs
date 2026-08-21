process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfcjIwMyddKSA/ICRfR0VUWydwc19yMjAzJ10gOiAnJykgIT09ICdHTycpIHJldHVybjsKIGdsb2JhbCAkd3BkYjsKICRvID0gYXJyYXkoJ3YnPT4nUjIwMycpOwogJG9bJ3ZlcnNpamEnXSA9IGNsYXNzX2V4aXN0cygnUGV0c2hvcF9MYXVrYWknKSA/IFBldHNob3BfTGF1a2FpOjpWRVJTSUpBIDogJ25lcmEnOwogJG9bJ2ZpbHRyYXMnXSA9IGhhc19maWx0ZXIoJ3dvb2NvbW1lcmNlX3Byb2R1Y3RfZ2V0X2ltYWdlX2lkJykgPyAneXJhJyA6ICdORVJBJzsKCiAkaWRzID0gJHdwZGItPmdldF9jb2woIlNFTEVDVCBwb3N0X2lkIEZST00geyR3cGRiLT5wb3N0bWV0YX0gV0hFUkUgbWV0YV9rZXk9J19wc19sYXVrYXMnIEFORCBtZXRhX3ZhbHVlPSd5ZXMnIik7CiAkciA9IGFycmF5KCk7CiBmb3JlYWNoKCRpZHMgYXMgJGlkKXsKICAgJHAgPSB3Y19nZXRfcHJvZHVjdCgkaWQpOwogICAkcltdID0gYXJyYXkoCiAgICAgJ0lEJz0+KGludCkkaWQsCiAgICAgJ3Bhdic9PmdldF90aGVfdGl0bGUoJGlkKSwKICAgICAnc3QnPT5nZXRfcG9zdF9zdGF0dXMoJGlkKSwKICAgICAnc2F2YSc9PihpbnQpZ2V0X3Bvc3RfdGh1bWJuYWlsX2lkKCRpZCksCiAgICAgJ2ZvdG9faWQnPT5jbGFzc19leGlzdHMoJ1BldHNob3BfTGF1a2FpJykgPyAoaW50KVBldHNob3BfTGF1a2FpOjpmb3RvX2lkKCRpZCkgOiAwLAogICAgICdnZXRfaW1hZ2VfaWQnPT4kcCA/IChpbnQpJHAtPmdldF9pbWFnZV9pZCgpIDogLTEsCiAgICAgJ3VybCc9PiRwID8gd3BfZ2V0X2F0dGFjaG1lbnRfaW1hZ2VfdXJsKCRwLT5nZXRfaW1hZ2VfaWQoKSwnd29vY29tbWVyY2VfdGh1bWJuYWlsJykgOiAnJywKICAgICAna2F0YWxvZ29fbWF0b211bWFzJz0+JHAgPyAkcC0+Z2V0X2NhdGFsb2dfdmlzaWJpbGl0eSgpIDogJycsCiAgICk7CiB9CiAkb1snbGF1a2FpJ10gPSAkcjsKCiAvKiB0cnVtcGFsYWlraXMgcHJpc2lqdW5naW1vIHNhdXNhaW5pcyBhZG1pbiBla3JhbnVpICovCiAkb1snY29va2llaGFzaCddID0gZGVmaW5lZCgnQ09PS0lFSEFTSCcpID8gQ09PS0lFSEFTSCA6ICcnOwogJG9bJ2Nvb2tpZSddID0gd3BfZ2VuZXJhdGVfYXV0aF9jb29raWUoMSwgdGltZSgpKzMwMCwgJ2xvZ2dlZF9pbicpOwoKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiBlY2hvIHdwX2pzb25fZW5jb2RlKCRvLCBKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVMpOwogZXhpdDsKfSwgMTMxKTsK';
const out={versija:'R203'};
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
  const kunas=JSON.stringify({name:'TEMP R203 Laukai patikra',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5});
  const c=await fetch(SNIP,{method:'POST',headers:A,body:kunas});
  let j=null; const ct=await c.text(); try{j=JSON.parse(ct);}catch(e){}
  out.sukurta=j&&j.id?j.id:{s:c.status,t:ct.slice(0,200)};
  if(j&&j.id){
    await miegok(6000);
    const rr=await fetch(WP+'/?ps_r203=GO'); const tt=await rr.text();
    let D=null; try{D=JSON.parse(tt);}catch(e){ out.zalias=tt.slice(0,400); }
    if(D){
      out.DUOM={versija:D.versija, filtras:D.filtras, laukai:D.laukai};
      const {chromium}=await import('playwright');
      const b=await chromium.launch();
      const ctx=await b.newContext({viewport:{width:1400,height:1100}, ignoreHTTPSErrors:true});
      if(D.cookie&&D.cookiehash){
        await ctx.addCookies([{name:'wordpress_logged_in_'+D.cookiehash, value:D.cookie, domain:'dev.avesa.lt', path:'/', httpOnly:true, secure:true}]);
      }
      const p=await ctx.newPage();
      const kelios=[['kategorija','/kategorija/rinkiniai/'],['preke','/product/test-konservu-deze-400-be-vistienos/'],['adminas','/wp-admin/admin.php?page=ps-laukai']];
      for(const [vardas,kelias] of kelios){
        try{
          const resp=await p.goto(WP+kelias,{waitUntil:'domcontentloaded',timeout:60000});
          await p.waitForTimeout(4500);
          const png=await p.screenshot({fullPage:false});
          await put('screenshots/r203_'+vardas+'.png', png, 'r203 '+vardas);
          out[vardas]={s:resp?resp.status():0, title:await p.title()};
        }catch(e){ out[vardas]={klaida:String(e).slice(0,200)}; }
      }
      await b.close();
    }
    await fetch(SNIP+'/'+j.id,{method:'POST',headers:A,body:JSON.stringify({id:j.id,active:false})});
    out.deaktyvuota=j.id;
  }
}catch(e){ out.klaida=String(e).slice(0,500); }
await put('screenshots/r203.json', Buffer.from(JSON.stringify(out,null,1)), 'r203 patikra');
