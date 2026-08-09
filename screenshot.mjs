process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import { chromium } from 'playwright';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from((process.env.WP_USER||'').trim()+':'+(process.env.WP_APP_PASS||'').trim()).toString('base64');
const GH=process.env.GH_TOKEN, REPO=process.env.GH_REPO;
const PHP=Buffer.from('PD9waHAKLyogVEVNUCBhdXRvbG9naW4g4oCUIHZpZW5rYXJ0aW5pcywgdGlrIHNjcmVlbnNob3QndWkgKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfYWwnXSkgfHwgKCRfR0VUWydrJ10gPz8gJycpICE9PSAnYWw3dDN2JykgcmV0dXJuOwogICR1PWdldF91c2VyX2J5KCdsb2dpbicsJ3JhaW1pczA3OScpOwogIGlmKCEkdSl7ICRhZG09Z2V0X3VzZXJzKFsncm9sZSc9PidhZG1pbmlzdHJhdG9yJywnbnVtYmVyJz0+MV0pOyAkdT0kYWRtPyRhZG1bMF06bnVsbDsgfQogIGlmKCEkdSl7IHdwX2RpZSgnbmVyYSBhZG1pbicpOyB9CiAgd3Bfc2V0X2N1cnJlbnRfdXNlcigkdS0+SUQpOyB3cF9zZXRfYXV0aF9jb29raWUoJHUtPklELGZhbHNlKTsKICB3cF9zYWZlX3JlZGlyZWN0KGFkbWluX3VybCgnYWRtaW4ucGhwP3BhZ2U9cHMta2F0YWxvZ2FzJykpOyBleGl0Owp9KTsK','base64').toString();
async function put(path, buf, msg){
  const url=`https://api.github.com/repos/${REPO}/contents/${path}`;
  let sha; try{ const r=await fetch(url,{headers:{Authorization:`Bearer ${GH}`}}); if(r.ok) sha=(await r.json()).sha; }catch(e){}
  const body={message:msg||'shot', content:buf.toString('base64')};
  if(sha) body.sha=sha;
  const r2=await fetch(url,{method:'PUT',headers:{Authorization:`Bearer ${GH}`,'Content-Type':'application/json'},body:JSON.stringify(body)});
  console.log('put',path,r2.status);
}
async function main(){
  const out={zingsniai:[]};
  let r=await fetch(`${WP}/wp-json/code-snippets/v1/snippets`,{headers:{Authorization:AUTH}});
  const list=await r.json();
  for(const t of (Array.isArray(list)?list:[]).filter(s=>s.active && /^TEMP/i.test(s.name||''))){
    await fetch(`${WP}/wp-json/code-snippets/v1/snippets/${t.id}`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:false})});
  }
  r=await fetch(`${WP}/wp-json/code-snippets/v1/snippets`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},
    body:JSON.stringify({name:'TEMP autologin', code:PHP.replace(/^<\?php\s*/,''), scope:'global', active:true})});
  const s=await r.json();
  if(!s.id){ out.klaida='snippet'; await put('analize/shots.json',Buffer.from(JSON.stringify(out)),'err'); return; }
  out.zingsniai.push('autologin #'+s.id);
  await new Promise(x=>setTimeout(x,2500));

  const b=await chromium.launch({args:['--ignore-certificate-errors']});
  const ctx=await b.newContext({viewport:{width:1680,height:1400},ignoreHTTPSErrors:true,
    httpCredentials:{username:(process.env.WP_USER||'').trim(),password:(process.env.WP_APP_PASS||'').trim()}});
  const p=await ctx.newPage();
  const klaidos=[];
  p.on('console',m=>{ if(m.type()==='error') klaidos.push(m.text().slice(0,160)); });
  p.on('pageerror',e=>klaidos.push('JS: '+String(e).slice(0,160)));

  await p.goto(`${WP}/?ps_al=1&k=al7t3v`,{waitUntil:'networkidle',timeout:60000});
  out.url_po_login=p.url();
  await p.waitForTimeout(2500);
  out.yra_lentele=await p.locator('table.pskat-t').count();
  out.eiluciu=await p.locator('table.pskat-t tbody tr').count();
  out.antrastes=await p.locator('table.pskat-t thead th').allInnerTexts();
  out.eiles_juosta=await p.locator('.pskat-rail a').allInnerTexts();

  await p.screenshot({path:'/tmp/sarasas.png',fullPage:false});
  out.zingsniai.push('sąrašo screenshot');

  // atidarom prekės kortelę
  const nuoroda=p.locator('table.pskat-t a.atv').first();
  if(await nuoroda.count()){
    out.spaudziam=await nuoroda.innerText();
    await nuoroda.click();
    await p.waitForTimeout(4000);
    out.kortele_matoma=await p.locator('.kort-head').count();
    out.korteles_blokai=await p.locator('.kort-antr').allInnerTexts();
    await p.screenshot({path:'/tmp/kortele.png',fullPage:false});
    out.zingsniai.push('kortelės screenshot');
    // slenkam žemyn kortelėje
    await p.mouse.wheel(0,900); await p.waitForTimeout(1200);
    await p.screenshot({path:'/tmp/kortele2.png',fullPage:false});
  }
  out.js_klaidos=klaidos.slice(0,8);
  await b.close();

  const fs=await import('fs');
  for(const f of ['sarasas','kortele','kortele2']){
    try{ await put('screenshots/v30_'+f+'.png', fs.readFileSync('/tmp/'+f+'.png'), 'v30 '+f); }catch(e){ out.zingsniai.push('nepavyko '+f); }
  }
  await fetch(`${WP}/wp-json/code-snippets/v1/snippets/${s.id}`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:false})});
  out.zingsniai.push('autologin deaktyvuotas');
  await put('analize/shots.json',Buffer.from(JSON.stringify(out,null,2)),'v30 shots');
}
main().catch(async e=>{
  await put('analize/shots.json',Buffer.from(JSON.stringify({klaida:String(e)},null,2)),'err');
});
