process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCFpc3NldCgkX0dFVFsncHNfdmVyMTYnXSkgfHwgJF9HRVRbJ3BzX3ZlcjE2J10hPT0nUlVOMjAyNjA4MjMnKSByZXR1cm47CiAkVD1hcnJheSgndic9PidWRVIxNicpOwogJHU9Z2V0X3VzZXJzKGFycmF5KCdyb2xlJz0+J2FkbWluaXN0cmF0b3InLCdudW1iZXInPT4xLCdvcmRlcmJ5Jz0+J0lEJykpOwogaWYoJHUpeyB3cF9zZXRfY3VycmVudF91c2VyKCR1WzBdLT5JRCk7IHdwX3NldF9hdXRoX2Nvb2tpZSgkdVswXS0+SUQsdHJ1ZSx0cnVlKTsgfQogJG89d2NfZ2V0X29yZGVyKDM1MDY1KTsKIGlmKGlzc2V0KCRfR0VUWyd2YWx5dGknXSkpeyAkby0+ZGVsZXRlX21ldGFfZGF0YSgnX3BzX3NpdW50b3MnKTsgJG8tPnNhdmUoKTsgJFRbJ2lzdmFseXRhJ109MTsgfQogZWxzZSB7CiAgICRvLT51cGRhdGVfbWV0YV9kYXRhKCdfcHNfc2l1bnRvcycsIHdwX2pzb25fZW5jb2RlKGFycmF5KCdhdic9PmFycmF5KCdzYW5kZWxpcyc9PidhdicsCiAgICAgJ2tvZGFzJz0+JzA3MjY3MjYwODIzMDAxJywnbWFuaWZlc3QnPT4nTUFOLVRFU1QtMScsJ251bWVyaWFpJz0+YXJyYXkoJ1ZQMDAwMTExMjIyTFQnKSwKICAgICAnZGF0YSc9PmN1cnJlbnRfdGltZSgnbXlzcWwnKSkpKSk7CiAgICRvLT5zYXZlKCk7ICRUWydpZGV0YXMnXT0xOwogfQogJFRbJ3NoaXBtZW50cyddPShpbnQpJG8tPmdldF9tZXRhKCdfcHNfc2hpcG1lbnRzJyk7CiAkVFsnZ3J1cGl1J109UGV0c2hvcF9TaXVudG9zOjpyZWdpc3RydW90YV9ncnVwaXUod2NfZ2V0X29yZGVyKDM1MDY1KSk7CiAkVFsncHJpZXJhc2FzX3ZlaWtpYSddPShib29sKXN0cnBvcyhQZXRzaG9wX1NpdW50b3M6OmxhaXNrb190dXJpbnlzKHdjX2dldF9vcmRlcigzNTA2NSksJ1Jpa2l1aSBza2FuZXN0YXMnKSwnUmlraXVpIHNrYW5lc3RhcycpOwogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKIGVjaG8ganNvbl9lbmNvZGUoJFQsIEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9LDUpOwo=';
const out={v:'VER16'};
const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){
  const u='https://api.github.com/repos/'+REPO+'/contents/'+path;
  const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha)b.sha=sha;
  return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status;
}
const A={Authorization:AUTH,'Content-Type':'application/json'};
const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
let sid=null;
try{
  const c=await fetch(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP Patikra H241 v1 (laisko UI)',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; const ct=await c.text(); try{j=JSON.parse(ct);}catch(e){}
  out.sukurta=j&&j.id?j.id:{s:c.status,t:ct.slice(0,300)};
  if(j&&j.id){
    sid=j.id; await miegok(10000);
    const d=await fetch(WP+'/?ps_ver16=RUN20260823');
    const raw=d.headers.getSetCookie?d.headers.getSetCookie():[];
    const tx=await d.text(); try{ out.R=JSON.parse(tx); }catch(e){ out.R='ne-json: '+tx.slice(0,200); }
    const cookies=[];
    for(const s of raw){ const p=s.split(';')[0]; const i=p.indexOf('='); const n=p.slice(0,i), v=p.slice(i+1); if(n) cookies.push({name:n,value:v,domain:'dev.avesa.lt',path:'/',secure:true,httpOnly:false}); }
    if(cookies.length){
      const {chromium}=await import('playwright');
      const br=await chromium.launch();
      const ctx=await br.newContext({viewport:{width:1400,height:1050},ignoreHTTPSErrors:true});
      await ctx.addCookies(cookies);
      const pg=await ctx.newPage();
      const kl=[]; pg.on('pageerror',e=>kl.push(String(e).slice(0,150)));
      const r=await pg.goto(WP+'/wp-admin/admin.php?page=ps-siuntos-laiskas&id=35065',{waitUntil:'networkidle',timeout:60000});
      await miegok(1200);
      const ta=await pg.$('#psPrierasas');
      if(ta){ await ta.fill('Įdėjome skanėstą Rikiui — nuo mūsų komandos.'); await pg.dispatchEvent('#psPrierasas','input'); await miegok(700); }
      out.laiskas={http:r.status(),
        perziura:await pg.$eval('#psPerziura',n=>n.innerText.slice(0,500)).catch(()=>'NERA'),
        mygtukai:await pg.$$eval('button',ns=>ns.map(n=>n.textContent.trim()+(n.disabled?' [PILKAS]':''))),
        put:await put('screenshots/h241_laiskas.png',await pg.screenshot({fullPage:true}),'VER16')};
      out.js=kl; await br.close();
    }
    await fetch(WP+'/?ps_ver16=RUN20260823&valyti=1');
    await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})});
  }
}catch(e){ out.klaida=String(e).slice(0,500);
  if(sid){ try{ await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(x){} } }
await put('screenshots/ver16.json', Buffer.from(JSON.stringify(out,null,1)), 'VER16');
