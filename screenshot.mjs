process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from((process.env.WP_USER||'').trim()+':'+(process.env.WP_APP_PASS||'').trim()).toString('base64');
const GH=process.env.GH_TOKEN, REPO=process.env.GH_REPO;
const PHP=Buffer.from('PD9waHAKYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCgkX0dFVFsnayddID8/ICcnKSAhPT0gJ2RxN20zeicpIHJldHVybjsKICBpZiAoaXNzZXQoJF9HRVRbJ3BzX2dhdl9kaWFnJ10pKSB7CiAgICAkb3V0PWFycmF5KCdWRVJTSUpBJz0+J0dBVkRJQUcnKTsKICAgICRvdXRbJ2dhdmltYXMnXT1jbGFzc19leGlzdHMoJ1BldHNob3BfR2F2aW1hcycpP1BldHNob3BfR2F2aW1hczo6VkVSU0lKQTonbmVyYSc7CiAgICAkb3V0WydwYXJ0aWpvcyddPWNsYXNzX2V4aXN0cygnUGV0c2hvcF9QYXJ0aWpvcycpP1BldHNob3BfUGFydGlqb3M6OlZFUlNJSkE6J25lcmEnOwogICAgJG91dFsna2F0YWxvZ2FzJ109Y2xhc3NfZXhpc3RzKCdQZXRzaG9wX0thdGFsb2dhcycpP1BldHNob3BfS2F0YWxvZ2FzOjpWRVJTSUpBOiduZXJhJzsKICAgICRvdXRbJ3ZhcnRhaSddPWNsYXNzX2V4aXN0cygnUGV0c2hvcF9WYXJ0YWknKT9QZXRzaG9wX1ZhcnRhaTo6VkVSU0lKQTonbmVyYSc7CiAgICAvKiBLb2tpZSBBSkFYIHZlaWtzbWFpIHJlZ2lzdHJ1b3RpIGdhdmltdWkgKi8KICAgIGdsb2JhbCAkd3BfZmlsdGVyOwogICAgJG91dFsnYWpheCddPWFycmF5KCk7CiAgICBmb3JlYWNoKCR3cF9maWx0ZXIgYXMgJGs9PiR2KXsKICAgICAgaWYoc3RycG9zKCRrLCd3cF9hamF4X3BzX2dhdicpPT09MCB8fCBzdHJwb3MoJGssJ3dwX2FqYXhfcHNfcGFydCcpPT09MCl7ICRvdXRbJ2FqYXgnXVtdPSRrOyB9CiAgICB9CiAgICAvKiBQSFAga2xhaWR1IHp1cm5hbGFzICovCiAgICAkbG9nPWluaV9nZXQoJ2Vycm9yX2xvZycpOwogICAgJG91dFsnZXJyb3JfbG9nJ109JGxvZzsKICAgIGZvcmVhY2goYXJyYXkoJGxvZywgV1BfQ09OVEVOVF9ESVIuJy9kZWJ1Zy5sb2cnLCBBQlNQQVRILidlcnJvcl9sb2cnKSBhcyAkZil7CiAgICAgIGlmKCRmICYmIGZpbGVfZXhpc3RzKCRmKSAmJiBpc19yZWFkYWJsZSgkZikpewogICAgICAgICRzej1maWxlc2l6ZSgkZik7CiAgICAgICAgJGZoPWZvcGVuKCRmLCdyJyk7IGZzZWVrKCRmaCwgbWF4KDAsJHN6LTYwMDApKTsgJHQ9ZnJlYWQoJGZoLDYwMDApOyBmY2xvc2UoJGZoKTsKICAgICAgICAkZWlsPWFycmF5X2ZpbHRlcihleHBsb2RlKCJcbiIsJHQpKTsKICAgICAgICAkc3Y9YXJyYXkoKTsKICAgICAgICBmb3JlYWNoKGFycmF5X3JldmVyc2UoJGVpbCkgYXMgJGUpewogICAgICAgICAgaWYoc3RyaXBvcygkZSwncGV0c2hvcCcpIT09ZmFsc2UgfHwgc3RyaXBvcygkZSwnRmF0YWwnKSE9PWZhbHNlIHx8IHN0cmlwb3MoJGUsJ1VuY2F1Z2h0JykhPT1mYWxzZSl7CiAgICAgICAgICAgICRzdltdPW1iX3N1YnN0cigkZSwwLDIyMCk7CiAgICAgICAgICAgIGlmKGNvdW50KCRzdik+PTgpIGJyZWFrOwogICAgICAgICAgfQogICAgICAgIH0KICAgICAgICBpZigkc3YpeyAkb3V0Wydsb2cnXVskZl09JHN2OyB9CiAgICAgIH0KICAgIH0KICAgIC8qIEdhdmltbyBmYWlsbyBtZXRvZGFpICovCiAgICBpZihjbGFzc19leGlzdHMoJ1BldHNob3BfR2F2aW1hcycpKXsgJG91dFsnZ2F2X21ldG9kYWknXT1nZXRfY2xhc3NfbWV0aG9kcygnUGV0c2hvcF9HYXZpbWFzJyk7IH0KICAgIGlmKGNsYXNzX2V4aXN0cygnUGV0c2hvcF9QYXJ0aWpvcycpKXsgJG91dFsncGFydF9tZXRvZGFpJ109Z2V0X2NsYXNzX21ldGhvZHMoJ1BldHNob3BfUGFydGlqb3MnKTsgfQogICAgd3Bfc2VuZF9qc29uKCRvdXQpOwogIH0KICBpZiAoaXNzZXQoJF9HRVRbJ3BzX2dhdl9sb2cnXSkpIHsKICAgICR1PWdldF91c2VycyhhcnJheSgncm9sZSc9PidhZG1pbmlzdHJhdG9yJywnbnVtYmVyJz0+MSwnZmllbGRzJz0+J0lEJykpOwogICAgd3Bfc2V0X2N1cnJlbnRfdXNlcigoaW50KSR1WzBdKTsKICAgIHdwX3NldF9hdXRoX2Nvb2tpZSgoaW50KSR1WzBdLCBmYWxzZSwgaXNfc3NsKCkpOwogICAgd3Bfc2FmZV9yZWRpcmVjdChhZG1pbl91cmwoJ2FkbWluLnBocD9wYWdlPXBzLWdhdmltYXMnKSk7CiAgICBleGl0OwogIH0KfSk7Cg==','base64').toString();
async function jsonSafe(r){ const t=await r.text();
  const a=t.indexOf('['), o=t.indexOf('{');
  const i=(a>=0&&(a<o||o<0))?a:o; if(i<0) return null;
  try{ return JSON.parse(t.slice(i)); }catch(e){ return null; } }
async function putRaw(path,b64,msg){
  const url=`https://api.github.com/repos/${REPO}/contents/${path}`;
  let sha; try{ const r=await fetch(url,{headers:{Authorization:`Bearer ${GH}`}}); if(r.ok) sha=(await r.json()).sha; }catch(e){}
  const body={message:msg||'gd', content:b64}; if(sha) body.sha=sha;
  await fetch(url,{method:'PUT',headers:{Authorization:`Bearer ${GH}`,'Content-Type':'application/json'},body:JSON.stringify(body)});
}
async function snip(name,code){
  const r=await fetch(`${WP}/wp-json/code-snippets/v1/snippets`,{method:'POST',
    headers:{Authorization:AUTH,'Content-Type':'application/json'},
    body:JSON.stringify({name, code, scope:'global', active:true})});
  return await jsonSafe(r)||{};
}
const pause=ms=>new Promise(x=>setTimeout(x,ms));
async function main(){
  const out={};
  let r=await fetch(`${WP}/wp-json/code-snippets/v1/snippets`,{headers:{Authorization:AUTH}});
  const list=await jsonSafe(r);
  for(const t of (Array.isArray(list)?list:[]).filter(s=>s.active&&/^TEMP/i.test(s.name||''))){
    await fetch(`${WP}/wp-json/code-snippets/v1/snippets/${t.id}`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:false})});
  }
  const s=await snip('TEMP gd', PHP.replace(/^<\?php\s*/,''));
  await pause(2500);
  let resp=await fetch(`${WP}/?ps_gav_diag=1&k=dq7m3z`,{headers:{Authorization:AUTH}});
  out.serveris=await jsonSafe(resp);

  const {chromium}=await import('playwright');
  const br=await chromium.launch();
  const ctx=await br.newContext({ignoreHTTPSErrors:true, viewport:{width:1680,height:1050}});
  const page=await ctx.newPage();
  const jsErr=[], kons=[], neok=[];
  page.on('pageerror',e=>jsErr.push(String(e).slice(0,200)));
  page.on('console',m=>{ if(m.type()==='error') kons.push(m.text().slice(0,200)); });
  page.on('response',res=>{ if(res.status()>=400) neok.push(res.status()+' '+res.url().slice(-90)); });
  page.setDefaultTimeout(15000);
  try{ await page.goto(`${WP}/?ps_gav_log=1&k=dq7m3z`,{waitUntil:'networkidle',timeout:45000}); }catch(e){ out.nav=String(e).slice(0,80); }
  await pause(3000);
  out.url=page.url();
  out.langas=await page.evaluate(()=>{
    const b=document.querySelector('.psgav-bar');
    return {juosta:!!b, turinys:(document.body.innerText||'').slice(0,300)};
  });
  /* Bandom ieskoti prekes */
  out.paieskos_laukas=await page.evaluate(()=>{
    const i=document.querySelector('input[type=search], .gav-ieskoti, #gav-q, .psgav input[type=text]');
    return i?{klase:i.className,id:i.id,placeholder:i.placeholder}:null;
  });
  if(out.paieskos_laukas){
    await page.evaluate(()=>{
      const i=document.querySelector('input[type=search], .gav-ieskoti, #gav-q');
      if(i){ i.focus(); i.value='animonda'; i.dispatchEvent(new Event('input',{bubbles:true})); }
    });
    await pause(3000);
    out.rezultatai=await page.evaluate(()=>{
      const r=document.querySelector('.gav-rez, .rez, .paieska-rez');
      return r?r.innerText.slice(0,250):'nerasta konteinerio';
    });
  }
  let png=await page.screenshot(); out.s1=await putRaw('screenshots/gav_diag.png', png.toString('base64'),'gd');
  out.js_klaidos=jsErr.slice(0,6);
  out.konsole=kons.slice(0,6);
  out.blogi=neok.slice(0,8);
  await br.close();
  if(s.id) await fetch(`${WP}/wp-json/code-snippets/v1/snippets/${s.id}`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:false})});
  await putRaw('analize/gavdiag.json', Buffer.from(JSON.stringify(out,null,2)).toString('base64'),'gd');
}
main().catch(e=>{});
