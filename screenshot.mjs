process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfcjIyMSddKSA/ICRfR0VUWydwc19yMjIxJ10gOiAnJykgIT09ICdHTycpIHJldHVybjsKIGdsb2JhbCAkd3BkYjsKICRvID0gYXJyYXkoJ3YnPT4nUjIyMScpOwogLyogcGlnaSBwYXByYXN0YSBwcmVrZSB0ZXN0dWkgKi8KICRpZHMgPSAkd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIHAuSUQgRlJPTSB7JHdwZGItPnBvc3RzfSBwCiAgIEpPSU4geyR3cGRiLT5wb3N0bWV0YX0gbSBPTiBtLnBvc3RfaWQ9cC5JRCBBTkQgbS5tZXRhX2tleT0nX3ByaWNlJwogICBXSEVSRSBwLnBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHAucG9zdF9zdGF0dXM9J3B1Ymxpc2gnCiAgICAgQU5EIENBU1QobS5tZXRhX3ZhbHVlIEFTIERFQ0lNQUwoMTAsMikpIEJFVFdFRU4gMS41IEFORCA0LjAKICAgT1JERVIgQlkgcC5JRCBMSU1JVCA1Iik7CiAkb1sna2FuZGlkYXRhaSddPWFycmF5KCk7CiBmb3JlYWNoKCRpZHMgYXMgJGlkKXsKICAgJHAgPSB3Y19nZXRfcHJvZHVjdCgkaWQpOwogICBpZighJHAgfHwgJHAtPmdldF90eXBlKCkhPT0nc2ltcGxlJyB8fCAhJHAtPmlzX2luX3N0b2NrKCkpIGNvbnRpbnVlOwogICAkb1sna2FuZGlkYXRhaSddW10gPSBhcnJheSgnaWQnPT4oaW50KSRpZCwncGF2Jz0+JHAtPmdldF9uYW1lKCksJ2thaW5hJz0+JHAtPmdldF9wcmljZSgpLCdzbHVnJz0+JHAtPmdldF9zbHVnKCkpOwogfQogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKIGVjaG8gd3BfanNvbl9lbmNvZGUoJG8sIEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9VTkVTQ0FQRURfU0xBU0hFUyk7IGV4aXQ7Cn0sIDEzMSk7Cg==';
const out={versija:'R221'};
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
  const kunas=JSON.stringify({name:'ZZ R221 Kasos mokestis',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5});
  const c=await fetch(SNIP,{method:'POST',headers:A,body:kunas});
  let j=null; const ct=await c.text(); try{j=JSON.parse(ct);}catch(e){}
  out.sukurta=j&&j.id?j.id:{s:c.status,t:ct.slice(0,200)};
  if(j&&j.id){
    await miegok(6000);
    const rr=await fetch(WP+'/?ps_r221=GO'); let D=null; try{ D=JSON.parse(await rr.text()); }catch(e){}
    out.kandidatai=D?D.kandidatai:null;
    if(D && D.kandidatai && D.kandidatai.length){
      const preke=D.kandidatai[0];
      out.testine=preke;
      const {chromium}=await import('playwright');
      const b=await chromium.launch();
      const ctx=await b.newContext({viewport:{width:1400,height:1400},ignoreHTTPSErrors:true});
      const p=await ctx.newPage();
      await p.goto(WP+'/?add-to-cart='+preke.id,{waitUntil:'domcontentloaded',timeout:60000});
      await p.waitForTimeout(3000);
      /* KREPSELIS */
      await p.goto(WP+'/krepselis/',{waitUntil:'domcontentloaded',timeout:60000});
      await p.waitForTimeout(4000);
      out.krepselis={
        mokescio_eiluciu:(await p.locator('text=Mažo krepšelio mokestis').count()),
        tekstas:(await p.locator('.cart_totals, .cart-totals, table').first().innerText().catch(()=>'')).slice(0,900)
      };
      await put('screenshots/r221_krepselis.png', await p.screenshot(), 'r221 krepselis');
      /* KASA */
      await p.goto(WP+'/kasa/',{waitUntil:'domcontentloaded',timeout:60000});
      await p.waitForTimeout(5000);
      out.kasa={
        mokescio_eiluciu:(await p.locator('text=Mažo krepšelio mokestis').count()),
        tekstas:(await p.locator('#order_review, .woocommerce-checkout-review-order, form').first().innerText().catch(()=>'')).slice(0,1200)
      };
      await put('screenshots/r221_kasa.png', await p.screenshot(), 'r221 kasa');
      await b.close();
    }
    await fetch(SNIP+'/'+j.id,{method:'POST',headers:A,body:JSON.stringify({id:j.id,active:false})});
  }
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('screenshots/r221.json', Buffer.from(JSON.stringify(out,null,1)), 'r221 kasos mokestis');
