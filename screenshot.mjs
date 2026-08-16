process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import { chromium } from 'playwright';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const out={versija:'VITRINA-C1'};
async function irasyk(){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/ata2.json`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const body={message:'vitrina recon',content:Buffer.from(JSON.stringify(out)).toString('base64')}; if(sha) body.sha=sha;
  await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/ata2.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(body)});
}
try{
const br=await chromium.launch({args:['--no-sandbox','--ignore-certificate-errors']});
const ctx=await br.newContext({httpCredentials:{username:process.env.WP_USER,password:process.env.WP_APP_PASS},ignoreHTTPSErrors:true,viewport:{width:1400,height:1100}});
const page=await ctx.newPage();
const jsErr=[]; page.on('pageerror',e=>jsErr.push(String(e).slice(0,150)));

await page.goto(WP+'/?p=34942',{waitUntil:'domcontentloaded',timeout:60000});
await page.waitForTimeout(6000);
out.url=page.url();
out.titulas=await page.title();

out.dom = await page.evaluate(()=>{
  const r={};
  const klases=new Set();
  document.querySelectorAll('[class]').forEach(el=>{
    String(el.className).split(/\s+/).forEach(c=>{ if(/^(pslk|mnm|wc-mnm)/.test(c)) klases.add(c); });
  });
  r.klases=Array.from(klases).slice(0,90);
  const f=document.querySelector('form.mnm_form, form.cart');
  r.forma = f ? {klase:f.className, id:f.id, action:(f.action||'').slice(-60)} : null;
  /* kiekio laukai */
  const q=document.querySelectorAll('input.qty, input[name^="mnm_quantity"]');
  r.qty_kiekis=q.length;
  r.qty_pvz = q.length ? {name:q[0].name, klase:q[0].className, id:q[0].id} : null;
  /* prekiu korteles */
  const kand=['.mnm_item','.wc-mnm-child-item','.pslk-kort','.pslk-preke','.product'];
  r.korteles={};
  kand.forEach(k=>{ r.korteles[k]=document.querySelectorAll(k).length; });
  /* mygtukai + - */
  r.plus=document.querySelectorAll('.plus, .wc-mnm-child-item .plus, button.plus').length;
  r.minus=document.querySelectorAll('.minus, button.minus').length;
  /* statusas / minimumas */
  const st=document.querySelector('.wc-mnm-status, .mnm_message, .mnm_price, .pslk-status, .pslk-juosta');
  r.statusas = st ? {klase:st.className, tekstas:(st.innerText||'').slice(0,120)} : null;
  /* dovanos */
  r.dovanos=document.querySelectorAll('[class*="dovan"]').length;
  const d=document.querySelector('[class*="dovan"]');
  r.dovana_pvz = d ? {klase:d.className, tekstas:(d.innerText||'').slice(0,100)} : null;
  /* dezes indikatorius (slot) */
  r.slot=document.querySelectorAll('[class*="lizd"], [class*="slot"], [class*="deze"]').length;
  /* jQuery ir MnM API */
  r.jquery = (typeof window.jQuery !== 'undefined') ? window.jQuery.fn.jquery : 'NERA';
  r.wc_mnm_params = (typeof window.wc_mnm_params !== 'undefined') ? Object.keys(window.wc_mnm_params).slice(0,15) : 'NERA';
  r.mnm_container = (typeof window.jQuery !== 'undefined' && window.jQuery('.mnm_form').length) ? 'yra' : 'nera';
  r.ajaxurl = (typeof window.wc_add_to_cart_params !== 'undefined') ? 'yra' : 'nera';
  /* body klases — ar tai laukas */
  r.body=document.body.className.slice(0,200);
  return r;
});

/* MnM jQuery ivykiai: uzkabinam klausytoja ir bandom pakeisti kieki */
out.ivykiai = await page.evaluate(()=>{
  return new Promise(res=>{
    const gauti=[];
    if (typeof window.jQuery === 'undefined') { res('NERA jQuery'); return; }
    const $=window.jQuery;
    const sarasas=['wc-mnm-container-updated','wc-mnm-quantity-changed','wc-mnm-initialized','wc-mnm-validation-status-changed','change','wc-mnm-container-quantity-updated'];
    sarasas.forEach(e=>{ $(document.body).on(e+'.psrecon', function(){ gauti.push(e); }); });
    $('.mnm_form').each(function(){ sarasas.forEach(e=>{ $(this).on(e+'.psrecon', function(){ gauti.push('forma:'+e); }); }); });
    const q=document.querySelector('input.qty, input[name^="mnm_quantity"]');
    if (q) { q.value=2; $(q).trigger('change'); q.dispatchEvent(new Event('change',{bubbles:true})); }
    setTimeout(()=>res(gauti.length?Array.from(new Set(gauti)):'nieko nesugauta'),2500);
  });
});

out.js=jsErr;
const sh=await page.screenshot({fullPage:false});
let s=null;
try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/vitrina.png`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)s=(await g.json()).sha;}catch(e){}
const b={message:'vitrina',content:sh.toString('base64')}; if(s) b.sha=s;
await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/vitrina.png`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)});
await br.close();
}catch(e){ out.bendra=String(e).slice(0,300); }
await irasyk();
console.log('ok');
