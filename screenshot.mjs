process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from((process.env.WP_USER||'').trim()+':'+(process.env.WP_APP_PASS||'').trim()).toString('base64');
const GH=process.env.GH_TOKEN, REPO=process.env.GH_REPO;
const PHP=Buffer.from('PD9waHAKYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCgkX0dFVFsnayddID8/ICcnKSAhPT0gJ2RxN20zeicpIHJldHVybjsKICBpZiAoaXNzZXQoJF9HRVRbJ3BzX2RhcmIyJ10pKSB7CiAgICAkb3V0PWFycmF5KCdWRVJTSUpBJz0+J0RBUkIyJyk7CiAgICAkb3V0Wyd0ZWlzZXNfa2xhc2UnXT1jbGFzc19leGlzdHMoJ1BldHNob3BfVGVpc2VzJyk7CiAgICBpZihjbGFzc19leGlzdHMoJ1BldHNob3BfVGVpc2VzJykpewogICAgICAkb3V0Wyd2ZXJzaWphJ109UGV0c2hvcF9UZWlzZXM6OlZFUlNJSkE7CiAgICAgIFBldHNob3BfVGVpc2VzOjp1enRpa3JpbnRpX3JvbGUoKTsKICAgICAgJHI9Z2V0X3JvbGUoUGV0c2hvcF9UZWlzZXM6OlJPTEUpOwogICAgICAkb3V0Wydyb2xlJ109ICRyID8gYXJyYXlfa2V5cyhhcnJheV9maWx0ZXIoJHItPmNhcGFiaWxpdGllcykpIDogJ25lc3VrdXJ0YSc7CiAgICAgICR1PWdldF91c2VyX2J5KCdsb2dpbicsJ3Rlc3R1b3RvamFzJyk7CiAgICAgIGlmKCEkdSl7CiAgICAgICAgJHVpZD13cF9pbnNlcnRfdXNlcihhcnJheSgndXNlcl9sb2dpbic9Pid0ZXN0dW90b2phcycsJ3VzZXJfcGFzcyc9PndwX2dlbmVyYXRlX3Bhc3N3b3JkKDE2KSwKICAgICAgICAgICd1c2VyX2VtYWlsJz0+J3Rlc3R1b3RvamFzQGRldi5hdmVzYS5sdCcsJ2Rpc3BsYXlfbmFtZSc9PidUZXN0dW90b2phcycsJ3JvbGUnPT5QZXRzaG9wX1RlaXNlczo6Uk9MRSkpOwogICAgICAgICRvdXRbJ3ZhcnRvdG9qYXMnXT1pc193cF9lcnJvcigkdWlkKT8kdWlkLT5nZXRfZXJyb3JfbWVzc2FnZSgpOignc3VrdXJ0YXMgIycuJHVpZCk7CiAgICAgIH0gZWxzZSB7ICR1LT5zZXRfcm9sZShQZXRzaG9wX1RlaXNlczo6Uk9MRSk7ICRvdXRbJ3ZhcnRvdG9qYXMnXT0namF1IGJ1dm8gIycuJHUtPklEOyB9CiAgICAgIC8qIFRlaXNpdSBwYXRpa3JhIElTIFNFUlZFUklPIOKAlCBrYSBnYWxpIGlyIGtvIG5lZ2FsaSAqLwogICAgICAkdT1nZXRfdXNlcl9ieSgnbG9naW4nLCd0ZXN0dW90b2phcycpOwogICAgICBpZigkdSl7CiAgICAgICAgJHRpa3Jvcz1hcnJheSgpOwogICAgICAgIGZvcmVhY2goYXJyYXkoJ21hbmFnZV93b29jb21tZXJjZScsJ2VkaXRfcHJvZHVjdHMnLCdwdWJsaXNoX3Byb2R1Y3RzJywndXBsb2FkX2ZpbGVzJywKICAgICAgICAgICdwc19ha2NpamFzX3RhaWt5dGknLCdkZWxldGVfcHJvZHVjdHMnLCdkZWxldGVfcHVibGlzaGVkX3Byb2R1Y3RzJywnbWFuYWdlX29wdGlvbnMnLAogICAgICAgICAgJ2FjdGl2YXRlX3BsdWdpbnMnLCdlZGl0X3VzZXJzJywnZWRpdF90aGVtZXMnLCdleHBvcnQnKSBhcyAkYyl7CiAgICAgICAgICAkdGlrcm9zWyRjXT11c2VyX2NhbigkdS0+SUQsJGMpPydUQUlQJzonbmUnOwogICAgICAgIH0KICAgICAgICAkb3V0WydnYWxpJ109JHRpa3JvczsKICAgICAgfQogICAgfQogICAgd3Bfc2VuZF9qc29uKCRvdXQpOwogIH0KICBpZiAoaXNzZXQoJF9HRVRbJ3BzX2RhcmJsb2cnXSkpIHsKICAgICR1PWdldF91c2VyX2J5KCdsb2dpbicsJ3Rlc3R1b3RvamFzJyk7CiAgICBpZighJHUpeyB3cF9kaWUoJ25lcmEgdGVzdHVvdG9qbycpOyB9CiAgICB3cF9zZXRfY3VycmVudF91c2VyKCR1LT5JRCk7CiAgICB3cF9zZXRfYXV0aF9jb29raWUoJHUtPklELCBmYWxzZSwgaXNfc3NsKCkpOwogICAgd3Bfc2FmZV9yZWRpcmVjdChhZG1pbl91cmwoJ2FkbWluLnBocD9wYWdlPXBzLWthdGFsb2dhcycpKTsKICAgIGV4aXQ7CiAgfQp9KTsK','base64').toString();
async function putRaw(path,b64,msg){
  const url=`https://api.github.com/repos/${REPO}/contents/${path}`;
  let sha; try{ const r=await fetch(url,{headers:{Authorization:`Bearer ${GH}`}}); if(r.ok) sha=(await r.json()).sha; }catch(e){}
  const body={message:msg||'teis2', content:b64}; if(sha) body.sha=sha;
  await fetch(url,{method:'PUT',headers:{Authorization:`Bearer ${GH}`,'Content-Type':'application/json'},body:JSON.stringify(body)});
}
const putJson=(p,o)=>putRaw(p, Buffer.from(JSON.stringify(o,null,2)).toString('base64'),'teis2');
const pause=ms=>new Promise(x=>setTimeout(x,ms));
async function main(){
  const out={VERSIJA:'TEIS2'};
  let r=await fetch(`${WP}/wp-json/code-snippets/v1/snippets`,{headers:{Authorization:AUTH}});
  const list=await r.json();
  for(const t of (Array.isArray(list)?list:[]).filter(s=>s.active&&/^TEMP/i.test(s.name||''))){
    await fetch(`${WP}/wp-json/code-snippets/v1/snippets/${t.id}`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:false})});
  }
  r=await fetch(`${WP}/wp-json/code-snippets/v1/snippets`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},
    body:JSON.stringify({name:'TEMP teis2', code:PHP.replace(/^<\?php\s*/,''), scope:'global', active:true})});
  const s=await r.json();
  await pause(2500);
  let resp=await fetch(`${WP}/?ps_darb2=1&k=dq7m3z`,{headers:{Authorization:AUTH}});
  try{ out.serveris=JSON.parse(await resp.text()); }catch(e){ out.raw=(await resp.text()).slice(0,400); }

  const {chromium}=await import('playwright');
  const br=await chromium.launch();
  const ctx=await br.newContext({ignoreHTTPSErrors:true, viewport:{width:1680,height:1050}});
  const page=await ctx.newPage();
  page.setDefaultTimeout(15000);
  const eik=async(u)=>{ try{ await page.goto(u,{waitUntil:'domcontentloaded',timeout:30000}); return true; }catch(e){ return String(e).slice(0,60); } };

  await eik(`${WP}/?ps_darblog=1&k=dq7m3z`);
  await pause(2500);
  out.url=page.url();
  out.mato_kataloga=await page.evaluate(()=>!!document.querySelector('.pskat-bar'));
  out.wp_meniu=await page.evaluate(()=>Array.prototype.map.call(
    document.querySelectorAll('#adminmenu > li > a'), a=>a.textContent.replace(/[0-9]+/g,'').trim()).filter(Boolean));
  let png=await page.screenshot(); out.s1=await putRaw('screenshots/teis2_katalogas.png', png.toString('base64'),'teis2');

  await eik(`${WP}/wp-admin/admin.php?page=ps-akcijos`); await pause(1500);
  out.mato_akcijas=await page.evaluate(()=>!!document.querySelector('.psakc-app'));

  out.blokuota={};
  for(const u of ['admin.php?page=wc-settings','plugins.php','users.php','options-general.php','tools.php']){
    const ok=await eik(`${WP}/wp-admin/${u}`); await pause(500);
    if(ok!==true){ out.blokuota[u]='ryšio klaida'; continue; }
    out.blokuota[u]=await page.evaluate(()=>{
      const t=document.body.innerText||'';
      if(t.indexOf('Šis skyrius neprieinamas')>=0) return 'BLOKUOTA (Petshop)';
      if(t.indexOf('neturite teisi')>=0 || t.indexOf('Sorry, you are not allowed')>=0
         || t.indexOf('nepakanka')>=0 || t.indexOf('You need a higher level')>=0) return 'BLOKUOTA (WP)';
      return 'ATIDARE: '+t.slice(0,50).replace(/\n/g,' ');
    });
  }
  png=await page.screenshot(); out.s2=await putRaw('screenshots/teis2_blokuota.png', png.toString('base64'),'teis2');
  await br.close();
  await fetch(`${WP}/wp-json/code-snippets/v1/snippets/${s.id}`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:false})});
  r=await fetch(`${WP}/wp-json/code-snippets/v1/snippets`,{headers:{Authorization:AUTH}});
  const l2=await r.json();
  out.liko_temp=(Array.isArray(l2)?l2:[]).filter(x=>x.active&&/^TEMP/i.test(x.name||'')).map(x=>x.name);
  await putJson('analize/teis2.json', out);
}
main().catch(async e=>{ await putJson('analize/teis2.json',{klaida:String(e).slice(0,300)}); });
