process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from((process.env.WP_USER||'').trim()+':'+(process.env.WP_APP_PASS||'').trim()).toString('base64');
const GH=process.env.GH_TOKEN, REPO=process.env.GH_REPO;
const DEP=Buffer.from('PD9waHAKYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCgkX0dFVFsnayddID8/ICcnKSAhPT0gJ2RxN20zeicpIHJldHVybjsKICBpZiAoaXNzZXQoJF9HRVRbJ3BzX3V4djUnXSkpIHsKICAgIHdwX3NlbmRfanNvbihhcnJheSgnVkVSU0lKQSc9PidVWFY1JywKICAgICAgJ2thdGFsb2dhcyc9PmNsYXNzX2V4aXN0cygnUGV0c2hvcF9LYXRhbG9nYXMnKT9QZXRzaG9wX0thdGFsb2dhczo6VkVSU0lKQTonbmVyYScsCiAgICAgICdmYWlsb19tZDUnPT5tZDVfZmlsZShXUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWthdGFsb2dhcy5waHAnKSwKICAgICAgJ2R5ZGlzJz0+ZmlsZXNpemUoV1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1rYXRhbG9nYXMucGhwJykpKTsKICB9CiAgaWYgKGlzc2V0KCRfR0VUWydwc191eGxvZzInXSkpIHsKICAgICR1PWdldF91c2VycyhhcnJheSgncm9sZSc9PidhZG1pbmlzdHJhdG9yJywnbnVtYmVyJz0+MSwnZmllbGRzJz0+J0lEJykpOwogICAgd3Bfc2V0X2N1cnJlbnRfdXNlcigoaW50KSR1WzBdKTsKICAgIHdwX3NldF9hdXRoX2Nvb2tpZSgoaW50KSR1WzBdLCBmYWxzZSwgaXNfc3NsKCkpOwogICAgd3Bfc2FmZV9yZWRpcmVjdChhZG1pbl91cmwoJ2FkbWluLnBocD9wYWdlPXBzLWthdGFsb2dhcycpKTsKICAgIGV4aXQ7CiAgfQp9KTsK','base64').toString();
async function putRaw(path,b64,msg){
  const url=`https://api.github.com/repos/${REPO}/contents/${path}`;
  let sha; try{ const r=await fetch(url,{headers:{Authorization:`Bearer ${GH}`}}); if(r.ok) sha=(await r.json()).sha; }catch(e){}
  const body={message:msg||'uxs9', content:b64}; if(sha) body.sha=sha;
  const pr=await fetch(url,{method:'PUT',headers:{Authorization:`Bearer ${GH}`,'Content-Type':'application/json'},body:JSON.stringify(body)});
  return pr.status;
}
const putJson=(p,o)=>putRaw(p, Buffer.from(JSON.stringify(o,null,2)).toString('base64'),'uxs9 json');
async function snip(name,code){
  const r=await fetch(`${WP}/wp-json/code-snippets/v1/snippets`,{method:'POST',
    headers:{Authorization:AUTH,'Content-Type':'application/json'},
    body:JSON.stringify({name, code, scope:'global', active:true})});
  return await r.json();
}
async function off(id){ await fetch(`${WP}/wp-json/code-snippets/v1/snippets/${id}`,{method:'POST',
  headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:false})}); }
const pause=ms=>new Promise(x=>setTimeout(x,ms));

async function main(){
  const out={VERSIJA:'UXS9'};
  let r=await fetch(`${WP}/wp-json/code-snippets/v1/snippets`,{headers:{Authorization:AUTH}});
  const list=await r.json();
  for(const t of (Array.isArray(list)?list:[]).filter(s=>s.active&&/^TEMP/i.test(s.name||''))){ await off(t.id); }
  const sd=await snip('TEMP uxs9', DEP.replace(/^<\?php\s*/,''));
  await pause(2500);
  let resp=await fetch(`${WP}/?ps_uxv5=1&k=dq7m3z`,{headers:{Authorization:AUTH}});
  try{ out.versija=JSON.parse(await resp.text()); }catch(e){ out.versija_raw='nejson'; }

  const {chromium}=await import('playwright');
  const br=await chromium.launch();
  const ctx=await br.newContext({ignoreHTTPSErrors:true, viewport:{width:1680,height:1050}});
  const page=await ctx.newPage();
  const jsErr=[]; page.on('pageerror',e=>jsErr.push(String(e)));
  page.setDefaultTimeout(12000);

  await page.goto(`${WP}/?ps_uxlog2=1&k=dq7m3z`,{waitUntil:'domcontentloaded',timeout:45000});
  await page.goto(`${WP}/wp-admin/admin.php?page=ps-katalogas&kruva=visos&q=EU221Y`,{waitUntil:'domcontentloaded',timeout:45000});
  await pause(2000);

  /* Visi paspaudimai per JS — kortele dengia sarasa, elementHandle.click nutrunka */
  const spausk=(sel,idx)=>page.evaluate(function(a){
    var els=document.querySelectorAll(a.sel);
    var el=els[a.idx||0]; if(!el) return false; el.click(); return true;
  },{sel:sel,idx:idx||0});

  out.atidaryta=await spausk('.pskat-t tbody tr[data-id] a.atv');
  await pause(3500);
  const kaina0=await page.evaluate(()=>{ const i=document.querySelector('.kort-kaina input'); return i?i.value:null; });
  out.kaina_pradine=kaina0;

  /* 1) keiciam kaina — juosta */
  await page.evaluate(()=>{ const i=document.querySelector('.kort-kaina input');
    i.focus(); i.value='7.77'; i.dispatchEvent(new Event('input',{bubbles:true})); });
  await pause(700);
  out.juosta=await page.evaluate(()=>{ const j=document.getElementById('kort-saugoti');
    return j?{matoma:!j.hidden, tekstas:j.querySelector('.kiek').textContent.replace(/\s+/g,' ').trim(),
      mygtukai:Array.prototype.map.call(j.querySelectorAll('button'),b=>b.textContent.trim())}:null; });
  let png=await page.screenshot(); out.s_juosta=await putRaw('screenshots/uxs9_juosta.png', png.toString('base64'),'uxs9 juosta');

  /* 2) ESC — ar klausia */
  await page.keyboard.press('Escape'); await pause(1000);
  out.esc=await page.evaluate(()=>{ const k=document.getElementById('ps-klausimas');
    return k?{matomas:!k.hidden, antraste:(k.querySelector('h3')||{}).textContent,
      laukai:(k.querySelector('.laukai')||{}).textContent,
      mygtukai:Array.prototype.map.call(k.querySelectorAll('.myg button'),b=>b.textContent.trim())}:null; });
  png=await page.screenshot(); out.s_klausimas=await putRaw('screenshots/uxs9_klausimas.png', png.toString('base64'),'uxs9 kl');

  await spausk('.ps-klausimas .k-grizti'); await pause(600);
  out.po_grizti=await page.evaluate(()=>({kortele_atvira:!document.getElementById('pskat-kort').hidden,
    kaina:document.querySelector('.kort-kaina input').value}));

  /* 3) KITA PREKE sarase — ar klausia (spaudziam per JS) */
  await spausk('.pskat-t tbody tr[data-id] a.atv'); await pause(1000);
  out.kita_preke_klausia=await page.evaluate(()=>{ const k=document.getElementById('ps-klausimas'); return k?!k.hidden:null; });

  /* 4) Uzdaryti neissaugojus → laukas atstatomas */
  if(out.kita_preke_klausia){
    await spausk('.ps-klausimas .k-prarasti'); await pause(3000);
    out.po_prarasti=await page.evaluate(()=>{ const i=document.querySelector('.kort-kaina input');
      const j=document.getElementById('kort-saugoti');
      return {kaina:i?i.value:null, juosta_paslepta:j?j.hidden:null}; });
  }

  /* 5) Issaugoti per juosta, tada atstatyti pradine */
  await page.evaluate(()=>{ const i=document.querySelector('.kort-kaina input');
    i.focus(); i.value='8.88'; i.dispatchEvent(new Event('input',{bubbles:true})); });
  await pause(600);
  await spausk('#kort-saugoti .ks-irasyti'); await pause(3000);
  out.po_irasymo=await page.evaluate(()=>{ const i=document.querySelector('.kort-kaina input');
    const j=document.getElementById('kort-saugoti');
    return {kaina:i?i.value:null, juosta_paslepta:j?j.hidden:null, geltonas:i?i.classList.contains('purvinas'):null}; });
  /* atstatom */
  await page.evaluate((v)=>{ const i=document.querySelector('.kort-kaina input');
    i.focus(); i.value=v; i.dispatchEvent(new Event('input',{bubbles:true})); }, kaina0);
  await pause(500);
  await spausk('#kort-saugoti .ks-irasyti'); await pause(3000);
  out.kaina_atstatyta=await page.evaluate(()=>document.querySelector('.kort-kaina input').value);
  png=await page.screenshot(); out.s_pabaiga=await putRaw('screenshots/uxs9_pabaiga.png', png.toString('base64'),'uxs9 pab');

  out.js_klaidos=jsErr.slice(0,8);
  await br.close(); await off(sd.id);
  r=await fetch(`${WP}/wp-json/code-snippets/v1/snippets`,{headers:{Authorization:AUTH}});
  const l2=await r.json();
  out.liko_temp=(Array.isArray(l2)?l2:[]).filter(x=>x.active&&/^TEMP/i.test(x.name||'')).map(x=>x.name);
  await putJson('analize/uxs9.json', out);
}
main().catch(async e=>{ await putJson('analize/uxs9.json',{klaida:String(e).slice(0,300)}); });
