process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const A={Authorization:AUTH,'Content-Type':'application/json'};
const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNTI5ayBjYXJ0K2NsICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgJGY9KGlzc2V0KCRfR0VUWydwc19zdDInXSk/JF9HRVRbJ3BzX3N0MiddOicnKTsgaWYoJGYhPT0nQ0FSVCcmJiRmIT09J0NMJykgcmV0dXJuOwogIGlmKCRmPT09J0NBUlQnKXsKICAgIGlmKGZ1bmN0aW9uX2V4aXN0cygnV0MnKSYmV0MoKS0+Y2FydCl7CiAgICAgIGlmKFdDKCktPnNlc3Npb24mJiFXQygpLT5zZXNzaW9uLT5oYXNfc2Vzc2lvbigpKSBXQygpLT5zZXNzaW9uLT5zZXRfY3VzdG9tZXJfc2Vzc2lvbl9jb29raWUodHJ1ZSk7CiAgICAgIFdDKCktPmNhcnQtPmVtcHR5X2NhcnQoKTsKICAgICAgJGs9V0MoKS0+Y2FydC0+YWRkX3RvX2NhcnQoMzUwOTgsMSwwLGFycmF5KCksYXJyYXkoJ3BzX3ByZW5fcmV6aW1hcyc9Pidjb25maXJtJywncHNfcHJlbl9pbnRlcnZhbGFzJz0+MjgpKTsKICAgICAgV0MoKS0+Y2FydC0+Y2FsY3VsYXRlX3RvdGFscygpOwogICAgICBpZigkayl7IHdwX3NhZmVfcmVkaXJlY3Qod2NfZ2V0X2NoZWNrb3V0X3VybCgpKTsgZXhpdDsgfQogICAgICB3cF9kaWUoJ2FkZF90b19jYXJ0IEZBSUwnKTsKICAgIH0KICAgIHdwX2RpZSgnV0MgbmVyYScpOwogIH0KICBpZihmdW5jdGlvbl9leGlzdHMoJ1dDJykmJldDKCktPmNhcnQpIFdDKCktPmNhcnQtPmVtcHR5X2NhcnQoKTsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvICd7IkNMIjoib2sifSc7IGV4aXQ7Cn0sIDIwKTsK';
const VER='sutikimas-klik-3';
const out={v:VER,zingsniai:[]};
async function put(p,buf,m){ const u='https://api.github.com/repos/'+REPO+'/contents/'+p; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:m,content:buf.toString('base64')}; if(sha)b.sha=sha;
  return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
try{
  const l=await fetch(SNIP,{headers:A}); const arr=JSON.parse(await l.text());
  for(const s of (Array.isArray(arr)?arr:[]).filter(s=>s.active&&/^TEMP/.test(s.name||''))){
    await fetch(SNIP+'/'+s.id,{method:'POST',headers:A,body:JSON.stringify({id:s.id,active:false})}); }
  const c=await fetch(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP PS '+VER,
    code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  out.sid=JSON.parse(await c.text()).id;
  await new Promise(r=>setTimeout(r,9000));
  const {chromium}=await import('playwright');
  const br=await chromium.launch();
  const ctx=await br.newContext({ignoreHTTPSErrors:true,viewport:{width:1200,height:1100}});
  const pg=await ctx.newPage();
  let nr=0;
  const Z=async(vardas,fn)=>{ nr++; try{ const r=await fn(pg); out.zingsniai.push({nr,vardas,ok:true,rez:r===undefined?null:r}); }
    catch(e){ out.zingsniai.push({nr,vardas,ok:false,klaida:String(e).slice(0,250)});
      try{ const b=await pg.screenshot(); await put('analize/sut_fail_'+nr+'.png',b,VER); }catch(x){} } };

  await Z('krepselio uzpildymas + checkout',async p=>{
    await p.goto(WP+'/?ps_st2=CART',{waitUntil:'domcontentloaded',timeout:60000});
    await p.waitForTimeout(2500);
    try{ await p.click('button:has-text("PRIIMTI")',{timeout:4000}); await p.waitForTimeout(800);}catch(e){}
    const u=p.url();
    if(!/uzsakym|checkout|atsiskaitymas/i.test(u)) throw new Error('ne checkout: '+u);
    return u;
  });
  await Z('varnele matoma su tekstu',async p=>{
    const el=p.locator('#ps_pren_sutikimas');
    await el.waitFor({state:'attached',timeout:15000});
    const t=await p.textContent('.ps-pren-sutikimas');
    if(!/prenumeratos taisykl/i.test(t)) throw new Error('nera teksto: '+String(t).slice(0,80));
    return String(t).trim().slice(0,90);
  });
  await Z('bandymas be varneles -> musu klaida',async p=>{
    await p.click('#place_order');
    await p.waitForTimeout(3500);
    const t=await p.textContent('body');
    if(!/pažymėkite sutikimą su prenumeratos taisyklėmis/i.test(t)) throw new Error('nera klaidos');
    return 'klaida parodyta';
  });
  await Z('pazymejus varnele klaidos neber',async p=>{
    const lb=p.locator('.ps-pren-sutikimas label');
    await lb.click();
    const ch=await p.locator('#ps_pren_sutikimas').isChecked();
    if(!ch) throw new Error('nepazymeta');
    const b=await p.screenshot({fullPage:true});
    await put('analize/sutikimas_checkout.png',b,VER);
    return 'pazymeta + nuotrauka';
  });
  await br.close();
  out.VISKAS_ZALIA=out.zingsniai.every(z=>z.ok);
}catch(e){ out.klaida=String(e).slice(0,400); }
try{ await fetch(WP+'/?ps_st2=CL',{headers:{'User-Agent':'Mozilla/5.0'}}); }catch(e){}
try{ if(out.sid) await fetch(SNIP+'/'+out.sid,{method:'POST',headers:A,body:JSON.stringify({id:out.sid,active:false})}); }catch(e){}
await put('analize/sutikimas_klik.json',Buffer.from(JSON.stringify(out,null,1)),VER);
console.log('ok');
