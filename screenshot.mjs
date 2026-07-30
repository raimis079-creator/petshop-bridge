import { execSync } from 'child_process';
import fs from 'fs';
import { chromium } from 'playwright';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const SITE='https://dev.avesa.lt';
function putB64(n,b){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+n;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:50e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:b,...(s?{sha:s}:{})}));
  const c=execSync('curl -sk -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:50e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
function q(){ try{ const o=execSync('curl -sSk "'+SITE+'/?ps_cq=Cq6d" 2>/dev/null',{maxBuffer:20e6}).toString();
  const j=JSON.parse(o); return (j.rows&&j.rows[0])?j.rows[0]:null; }catch(e){ return null; } }
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const brief=r=>r?{cart:String(r.cart_id).slice(0,14),items:r.items,act:r.last_cart_activity_at,
  hash:String(r.cart_hash||'').slice(0,10),email:r.email,src:r.email_source,snap:r.snapshot}:null;
const O={};
// naudojam TA PACIA variacine preke, kuri T2 metu veike
const PROD='https://dev.avesa.lt/product/automatine-serykla-girdykla-gyvunui-eat-and-drink-16-l/';
(async()=>{
 let br;
 try{
  br=await chromium.launch({args:['--no-sandbox','--ignore-certificate-errors']});
  const ctx=await br.newContext({viewport:{width:1280,height:900},ignoreHTTPSErrors:true});
  const p=await ctx.newPage();

  await p.goto(PROD,{waitUntil:'domcontentloaded',timeout:60000}); await wait(3000);
  const sels=await p.$$('form.variations_form select');
  for(const s of sels){ const o=await s.$$eval('option',os=>os.map(x=>x.value).filter(Boolean));
    if(o.length){ await s.selectOption(o[0]); await wait(1200);} }
  await wait(1500);
  const b=await p.$('button.single_add_to_cart_button:not([disabled])');
  O.btn_found=!!b;
  if(b){ await b.click(); await wait(4500); }
  O.step1_added=brief(q());

  // --- checkout el. pastas ---
  await p.goto(SITE+'/checkout/',{waitUntil:'domcontentloaded',timeout:60000}); await wait(4000);
  O.checkout_url=p.url();
  const em=await p.$('#billing_email');
  O.email_field=!!em;
  if(em){ await em.fill('guest-cart-test@example.com'); await em.dispatchEvent('change');
          await em.dispatchEvent('blur'); await wait(5000); }
  O.step2_email=brief(q());

  // --- miesto / pristatymo keitimas ---
  const city=await p.$('#billing_city');
  if(city){ await city.fill('Kaunas'); await city.dispatchEvent('change'); await wait(5000); }
  const ship=await p.$$('input[name^="shipping_method"]');
  O.ship_options=ship.length;
  if(ship.length>1){ await ship[1].check().catch(()=>{}); await wait(5000); }
  O.step3_shipping=brief(q());

  // --- kiekio keitimas ---
  await p.goto(SITE+'/cart/',{waitUntil:'domcontentloaded',timeout:60000}); await wait(3000);
  const qty=await p.$('input.qty');
  O.qty_field=!!qty;
  if(qty){
    await qty.fill('3');
    const upd=await p.$('button[name="update_cart"], input[name="update_cart"]');
    O.update_btn=!!upd;
    if(upd){ await p.evaluate(()=>{const b=document.querySelector('[name="update_cart"]'); if(b){b.disabled=false;b.click();}}); }
    else { await qty.dispatchEvent('change'); }
    await wait(6000);
  }
  O.step4_qty=brief(q());
  await ctx.close();
 }catch(e){ O.err=String(e).slice(0,400); }
 try{ if(br) await br.close(); }catch(e){}
 putB64('bt2.json', Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
 console.log('done');
})();
