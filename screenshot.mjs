// S637 — A/B testas 493 + DB pavadinimų analizė
const USER=process.env.WP_USER.trim(), PASS=process.env.WP_APP_PASS.trim();
const AUTH='Basic '+Buffer.from(USER+':'+PASS).toString('base64');
const BASE='https://dev.avesa.lt/wp-json/code-snippets/v1/snippets';
const TOK=process.env.GH_TOKEN;
process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const PROBE2='aWYoIWRlZmluZWQoJ0FCU1BBVEgnKSlyZXR1cm47CmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoKCRfR0VUWydwc19zbmlwZGIyJ10/PycnKSE9PSdTNjM3eCcpIHJldHVybjsKICBpZighKCBjdXJyZW50X3VzZXJfY2FuKCdtYW5hZ2Vfb3B0aW9ucycpIHx8ICgoJF9HRVRbJ2snXT8/JycpPT09J3BzMjAyNicpICkpIHJldHVybjsKICBnbG9iYWwgJHdwZGI7ICR0ID0gJHdwZGItPnByZWZpeC4nc25pcHBldHMnOyAkb3V0ID0gYXJyYXkoJ3YnPT4nU05JUERCMi1WMScpOwogICRvdXRbJ3RvdGFsJ10gPSAoaW50KSAkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gJHQiKTsKICAkb3V0WydhY3RpdmVfcmVpa3NtZXMnXSA9ICR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGFjdGl2ZSwgQ09VTlQoKikgYyBGUk9NICR0IEdST1VQIEJZIGFjdGl2ZSIsIEFSUkFZX0EpOwogICRvdXRbJ3N0dWxwZWxpYWknXSA9ICR3cGRiLT5nZXRfY29sKCJTSE9XIENPTFVNTlMgRlJPTSAkdCIpOwogIC8vIHBhdmFkaW5pbXUgc2FibG9uYWk6IHBpcm1pIDIgem9kemlhaQogICRvdXRbJ3RvcF9zYWJsb25haSddID0gJHdwZGItPmdldF9yZXN1bHRzKAogICAgIlNFTEVDVCBTVUJTVFJJTkdfSU5ERVgobmFtZSwnICcsMykgc2FiLCBDT1VOVCgqKSBjLCBTVU0oYWN0aXZlPTEpIGFrdAogICAgIEZST00gJHQgR1JPVVAgQlkgc2FiIEhBVklORyBjPj01IE9SREVSIEJZIGMgREVTQyBMSU1JVCA0MCIsIEFSUkFZX0EpOwogIC8vIHBvenltaWFpIGF0c2tpcmFpCiAgJHBhdCA9IGFycmF5KAogICAgJ3ByZWZpeF9URU1QJyAgID0+ICJuYW1lIExJS0UgJ1RFTVAlJyIsCiAgICAnem9kaXNfVEVNUCcgICAgPT4gIm5hbWUgTElLRSAnJVRFTVAlJyIsCiAgICAnem9kaXNfdG1wJyAgICAgPT4gIm5hbWUgTElLRSAnJXRtcCUnIiwKICAgICdza2xpYXVzdF90ZW1wJyA9PiAibmFtZSBMSUtFICclKHRlbXApJSciLAogICAgJ3VpX2F1ZGl0JyAgICAgID0+ICJuYW1lIExJS0UgJyVVSSBMb2NhbGl6YXRpb24gUnVudGltZSBBdWRpdCUnIiwKICAgICdyZWNvbicgICAgICAgICA9PiAibmFtZSBMSUtFICclUmVjb24lJyIsCiAgICAnZHJ5JyAgICAgICAgICAgPT4gIm5hbWUgTElLRSAnJURyeSUnIiwKICApOwogIGZvcmVhY2goJHBhdCBhcyAkaz0+JHcpewogICAgJG91dFsncG96eW1pYWknXVska10gPSBhcnJheSgKICAgICAgJ3Zpc28nICAgICAgPT4gKGludCkgJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NICR0IFdIRVJFICR3IiksCiAgICAgICduZWFrdHl2dXMnID0+IChpbnQpICR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSAkdCBXSEVSRSAoJHcpIEFORCBhY3RpdmU9MCIpLAogICAgICAnYWt0eXZ1cycgICA9PiAoaW50KSAkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gJHQgV0hFUkUgKCR3KSBBTkQgYWN0aXZlPTEiKSwKICAgICk7CiAgfQogIC8vIE5FQUtUWVZVUyBCRSBqb2tpbyB0ZW1wIHBvenltaW8g4oCUIGthIGppZSBpcyB0aWtydWp1IHlyYQogICRub3RlbXAgPSAiYWN0aXZlPTAgQU5EIG5hbWUgTk9UIExJS0UgJyVURU1QJScgQU5EIG5hbWUgTk9UIExJS0UgJyV0bXAlJyI7CiAgJG91dFsnbmVha3R5dnVzX2JlX3RlbXBfa2lla2lzJ10gPSAoaW50KSAkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gJHQgV0hFUkUgJG5vdGVtcCIpOwogICRvdXRbJ25lYWt0eXZ1c19iZV90ZW1wX3B2eiddID0gJHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaWQsbmFtZSBGUk9NICR0IFdIRVJFICRub3RlbXAgT1JERVIgQlkgaWQgREVTQyBMSU1JVCAzMCIsIEFSUkFZX0EpOwogIC8vIHNlbmEga29waWphCiAgJGIgPSAkdC4nX2Jha19zNjM2JzsKICAkb3V0WydiYWNrdXAnXSA9IGFycmF5KCd5cmEnPT4oYm9vbCkkd3BkYi0+Z2V0X3ZhcigiU0hPVyBUQUJMRVMgTElLRSAnJGInIiksCiAgICAgICAgICAgICAgICAgICAgICAgICAnZWlsdWNpdSc9PihpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NICRiIikpOwogIGhlYWRlcignQ29udGVudC1UeXBlOmFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICBlY2hvIHdwX2pzb25fZW5jb2RlKCRvdXQsIEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QUkVUVFlfUFJJTlQpOyBleGl0Owp9LCA2KTsK';

async function putResult(name,obj){
  const url='https://api.github.com/repos/raimis079-creator/petshop-bridge/contents/screenshots/'+name;
  let sha; const g=await fetch(url,{headers:{Authorization:'Bearer '+TOK}});
  if(g.status===200) sha=(await g.json()).sha;
  const body={message:'result '+name,content:Buffer.from(JSON.stringify(obj,null,1)).toString('base64')};
  if(sha) body.sha=sha;
  const r=await fetch(url,{method:'PUT',headers:{Authorization:'Bearer '+TOK,'Content-Type':'application/json'},body:JSON.stringify(body)});
  console.log('putResult',name,r.status);
}
const out={version:'S637-V1',errors:[]};
const FURL='https://dev.avesa.lt/kategorija/sunims/maistas-sunims/sausas-maistas-sunims/';

async function setActive(id,val){
  const r=await fetch(BASE+'/'+id,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:val})});
  await r.text();
  const v=await(await fetch(BASE+'/'+id,{headers:{Authorization:AUTH}})).json();
  return v.active;
}

// ---- A/B testas su narsykle ----
try{
  const {chromium}=await import('playwright');
  const br=await chromium.launch();
  const pg=await br.newPage({viewport:{width:1400,height:1100},ignoreHTTPSErrors:true});
  const errs=[]; pg.on('pageerror',e=>errs.push(String(e)));
  async function matuok(){
    await pg.goto(FURL+'?cb='+Date.now(),{waitUntil:'domcontentloaded',timeout:60000});
    await pg.waitForTimeout(4500);
    return await pg.evaluate(()=>{
      const fs=document.querySelectorAll('.yith-wcan-filters .yith-wcan-filter');
      const res=[]; fs.forEach((f,i)=>{
        const c=f.querySelector('.filter-content'), t=f.querySelector('.filter-title');
        res.push({i,t:t?t.textContent.trim().slice(0,26):null,
          d:c?getComputedStyle(c).display:'NONE',h:c?Math.round(c.getBoundingClientRect().height):0});
      });
      return {n:fs.length,f:res,styles:document.querySelectorAll('#ps-open-filter').length};
    });
  }
  // A: 493 ISJUNGTAS (dabartine busena)
  out.A_493_off_state=await setActive(493,false);
  out.A_493_off=await matuok();
  // B: 493 IJUNGTAS (kaip buvo pries)
  out.B_493_on_state=await setActive(493,true);
  await pg.waitForTimeout(2500);
  out.B_493_on=await matuok();
  // grazinam i A
  out.galutine_493=await setActive(493,false);
  await pg.waitForTimeout(2000);
  out.C_patikra=await matuok();
  out.js_klaidos=errs;
  await br.close();
}catch(e){out.errors.push({step:'ab',e:String(e)});}

// ---- DB analize ----
try{
  const code=Buffer.from(PROBE2,'base64').toString('utf8');
  const r=await fetch(BASE,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},
    body:JSON.stringify({name:'TEMP Snippetu DB Probe v2 (S637)',code,scope:'global',active:true,priority:10})});
  const j=await r.json(); out.probe2_id=j.id;
  await new Promise(r=>setTimeout(r,3000));
  const u='https://dev.avesa.lt/?ps_snipdb2=S637x&k=ps2026&cb='+Date.now();
  const rr=await fetch(u,{headers:{'User-Agent':'Mozilla/5.0'}});
  const t=await rr.text();
  try{out.db=JSON.parse(t);}catch(e){out.db_raw=t.slice(0,3000);}
}catch(e){out.errors.push({step:'db2',e:String(e)});}

await putResult('s637_v1.json',out);
console.log('DONE');
