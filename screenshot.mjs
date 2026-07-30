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
  const j=JSON.parse(o); return (j.rows&&j.rows[0])?j.rows[0]:null; }catch(e){ return {err:String(e).slice(0,120)}; } }
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const O={T1:{},T2:{}};
const SIMPLE='https://dev.avesa.lt/product/ruda-avies-koja-1-vnt-x-20-vnt/';
const VARIABLE='https://dev.avesa.lt/product/automatine-serykla-girdykla-gyvunui-eat-and-drink-16-l/';
const brief=r=>r?{cart:String(r.cart_id).slice(0,14),items:r.items,act:r.last_cart_activity_at,
  hash:String(r.cart_hash||'').slice(0,10),email:r.email,src:r.email_source,snap:r.snapshot}:null;

(async()=>{
 let br;
 try{
  br=await chromium.launch({args:['--no-sandbox','--ignore-certificate-errors']});

  // =========== T1: SVECIO KREPSELIS ===========
  const c1=await br.newContext({viewport:{width:1280,height:900},ignoreHTTPSErrors:true});
  const p=await c1.newPage();

  await p.goto(SIMPLE,{waitUntil:'domcontentloaded',timeout:60000}); await wait(2000);
  // pridedam i krepseli
  const btn=await p.$('button[name="add-to-cart"], .single_add_to_cart_button');
  if(btn){ await btn.click(); await wait(4000); }
  O.T1.step1_added=brief(q());

  // checkout su el. pastu
  await p.goto(SITE+'/checkout/',{waitUntil:'domcontentloaded',timeout:60000}); await wait(3500);
  const em=await p.$('#billing_email');
  if(em){ await em.fill('guest-cart-test@example.com'); await em.dispatchEvent('change'); await wait(4000); }
  O.T1.step2_email=brief(q());

  // pristatymo/adreso keitimas
  const city=await p.$('#billing_city');
  if(city){ await city.fill('Kaunas'); await city.dispatchEvent('change'); await wait(4000); }
  const ship=await p.$$('input[name^="shipping_method"]');
  if(ship.length>1){ await ship[1].check().catch(()=>{}); await wait(4000); }
  O.T1.step3_shipping=brief(q());

  // kiekio keitimas krepselio puslapyje
  await p.goto(SITE+'/cart/',{waitUntil:'domcontentloaded',timeout:60000}); await wait(2500);
  const qty=await p.$('input.qty');
  if(qty){ await qty.fill('3');
    const upd=await p.$('button[name="update_cart"], input[name="update_cart"]');
    if(upd){ await upd.click({force:true}).catch(()=>{}); } else { await qty.dispatchEvent('change'); }
    await wait(5000); }
  O.T1.step4_qty=brief(q());

  await c1.close();

  // =========== T2: VARIACIJA + SALINIMAS ===========
  const c2=await br.newContext({viewport:{width:1280,height:900},ignoreHTTPSErrors:true});
  const p2=await c2.newPage();
  await p2.goto(VARIABLE,{waitUntil:'domcontentloaded',timeout:60000}); await wait(3000);
  // parenkam pirma variacija
  const sels=await p2.$$('form.variations_form select');
  for(const s of sels){
    const opts=await s.$$eval('option',os=>os.map(o=>o.value).filter(v=>v));
    if(opts.length){ await s.selectOption(opts[0]); await wait(1200); }
  }
  await wait(1500);
  const vb=await p2.$('button.single_add_to_cart_button:not([disabled])');
  if(vb){ await vb.click(); await wait(4500); }
  O.T2.step1_variation=brief(q());

  // salinam
  await p2.goto(SITE+'/cart/',{waitUntil:'domcontentloaded',timeout:60000}); await wait(2500);
  const rm=await p2.$('a.remove');
  if(rm){ await rm.click(); await wait(4500); }
  O.T2.step2_removed=brief(q());

  // atkuriam (undo)
  const undo=await p2.$('a.restore-item');
  if(undo){ await undo.click(); await wait(4500); O.T2.step3_restored=brief(q()); }
  else O.T2.step3_restored='undo nuorodos nerasta';

  // istustinam
  await p2.goto(SITE+'/cart/',{waitUntil:'domcontentloaded',timeout:60000}); await wait(2000);
  const rm2=await p2.$$('a.remove');
  for(const x of rm2){ await x.click().catch(()=>{}); await wait(3000); }
  O.T2.step4_emptied=brief(q());
  await c2.close();

 }catch(e){ O.err=String(e).slice(0,400); }
 try{ if(br) await br.close(); }catch(e){}
 putB64('bt.json', Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
 console.log('done');
})();
