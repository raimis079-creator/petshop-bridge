import { execSync } from 'child_process';
import fs from 'fs';
import { chromium } from 'playwright';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WU=process.env.WP_USER, WP=process.env.WP_APP_PASS, SITE='https://dev.avesa.lt';
function sh(c){try{const o=execSync(c+' 2>&1; echo "__RC:$?"',{maxBuffer:50e6,shell:'/bin/bash'}).toString();
 const m=o.match(/__RC:(\d+)\s*$/);return{rc:m?+m[1]:-1,out:o.replace(/__RC:\d+\s*$/,'')};}catch(e){return{rc:-99,out:String(e).slice(0,300)};}}
function putResult(name,txt){const u='https://api.github.com/repos/'+REPO+'/contents/analize/'+name;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk --max-time 30 -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:80e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'s372',content:Buffer.from(txt).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync('curl -sk --max-time 60 -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:80e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
const AUTH='-u "'+WU+':'+WP+'"', API=SITE+'/wp-json/code-snippets/v1/snippets';
const O={VERSIJA_RUN:'run372-v1'}; let sid=null;
try{const ls=sh('curl -sSk --max-time 40 '+AUTH+' "'+API+'?per_page=100"');const arr=JSON.parse(ls.out);const off=[];
 for(const s0 of arr){ if(s0.name&&s0.name.indexOf('TEMP')===0&&s0.active){
   fs.writeFileSync('/tmp/o.json',JSON.stringify({active:false}));
   sh('curl -sSk --max-time 30 -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/o.json "'+API+'/'+s0.id+'"'); off.push(s0.id);} }
 O.deakt=off;}catch(e){}
const PHP=Buffer.from('PD9waHAKLyoqCiAqIFRFTVAgUzM3MCBGMTQgUHJvYmUgdjEKICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgICBpZiAoICEgaXNzZXQoJF9HRVRbJ3BzX3MzNzAnXSkgfHwgJF9HRVRbJ3BzX3MzNzAnXSAhPT0gJ0szNzBtNCcgKSByZXR1cm47CiAgICBub2NhY2hlX2hlYWRlcnMoKTsgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAgIGdsb2JhbCAkd3BkYjsgJHBmPSR3cGRiLT5wcmVmaXg7CiAgICAkYWN0PWlzc2V0KCRfR0VUWydhY3QnXSk/JF9HRVRbJ2FjdCddOicnOwogICAgJHI9YXJyYXkoJ1ZFUlNJSkEnPT4nczM3MC12MScsJ2FjdCc9PiRhY3QpOwoKICAgIGlmKCRhY3Q9PT0nc3RhdGUnKXsKICAgICAgICAkclsndXpzYWt5bXUnXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHBmfXdjX29yZGVycyIpOwogICAgICAgICRyWydtYXhfaWQnXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgTUFYKGlkKSBGUk9NIHskcGZ9d2Nfb3JkZXJzIik7CiAgICAgICAgZWNobyB3cF9qc29uX2VuY29kZSgkcik7IGV4aXQ7CiAgICB9CiAgICBpZigkYWN0PT09J29yZGVyJyl7CiAgICAgICAgJGlkPShpbnQpKCRfR0VUWydpZCddPz8wKTsKICAgICAgICAkbz0kaWQ/d2NfZ2V0X29yZGVyKCRpZCk6bnVsbDsKICAgICAgICBpZighJG8peyAkclsnbmVyYSddPXRydWU7IGVjaG8gd3BfanNvbl9lbmNvZGUoJHIpOyBleGl0OyB9CiAgICAgICAgJGl0ZW1zPWFycmF5KCk7CiAgICAgICAgZm9yZWFjaCgkby0+Z2V0X2l0ZW1zKCkgYXMgJGl0KSAkaXRlbXNbXT1hcnJheSgncGF2Jz0+JGl0LT5nZXRfbmFtZSgpLCdraWVraXMnPT4kaXQtPmdldF9xdWFudGl0eSgpLCdzdW1hJz0+JGl0LT5nZXRfdG90YWwoKSk7CiAgICAgICAgJHNoaXA9YXJyYXkoKTsKICAgICAgICBmb3JlYWNoKCRvLT5nZXRfaXRlbXMoJ3NoaXBwaW5nJykgYXMgJHMpICRzaGlwW109YXJyYXkoJ3Bhdic9PiRzLT5nZXRfbmFtZSgpLCdtZXRob2RfaWQnPT4kcy0+Z2V0X21ldGhvZF9pZCgpLCdzdW1hJz0+JHMtPmdldF90b3RhbCgpLCdtZXRhJz0+JHMtPmdldF9tZXRhX2RhdGEoKT9hcnJheV9tYXAoZnVuY3Rpb24oJG0pe3JldHVybiBhcnJheSgkbS0+a2V5LGlzX3NjYWxhcigkbS0+dmFsdWUpPyRtLT52YWx1ZTonW29ial0nKTt9LCRzLT5nZXRfbWV0YV9kYXRhKCkpOmFycmF5KCkpOwogICAgICAgICRyWyd1enNha3ltYXMnXT1hcnJheSgKICAgICAgICAgICdpZCc9PiRvLT5nZXRfaWQoKSwnbnInPT4kby0+Z2V0X29yZGVyX251bWJlcigpLCdzdGF0dXMnPT4kby0+Z2V0X3N0YXR1cygpLAogICAgICAgICAgJ3RvdGFsJz0+JG8tPmdldF90b3RhbCgpLCdzaGlwcGluZ190b3RhbCc9PiRvLT5nZXRfc2hpcHBpbmdfdG90YWwoKSwndGF4Jz0+JG8tPmdldF90b3RhbF90YXgoKSwKICAgICAgICAgICdtb2tlamltYXMnPT4kby0+Z2V0X3BheW1lbnRfbWV0aG9kKCkuJyAvICcuJG8tPmdldF9wYXltZW50X21ldGhvZF90aXRsZSgpLAogICAgICAgICAgJ2VtYWlsJz0+JG8tPmdldF9iaWxsaW5nX2VtYWlsKCksJ3RlbCc9PiRvLT5nZXRfYmlsbGluZ19waG9uZSgpLAogICAgICAgICAgJ3ZhcmRhcyc9PiRvLT5nZXRfYmlsbGluZ19maXJzdF9uYW1lKCkuJyAnLiRvLT5nZXRfYmlsbGluZ19sYXN0X25hbWUoKSwKICAgICAgICAgICdtaWVzdGFzJz0+JG8tPmdldF9iaWxsaW5nX2NpdHkoKSwncGFzdGFzJz0+JG8tPmdldF9iaWxsaW5nX3Bvc3Rjb2RlKCksCiAgICAgICAgICAnaXRlbXMnPT4kaXRlbXMsJ3NoaXBwaW5nJz0+JHNoaXAsCiAgICAgICAgICAndGVybWluYWxhcyc9PiRvLT5nZXRfbWV0YSgnX3ZlbmlwYWtfcGlja3VwX3BvaW50JykgPzogKCRvLT5nZXRfbWV0YSgndmVuaXBha19waWNrdXBfcG9pbnQnKSA/OiBudWxsKSwKICAgICAgICApOwogICAgICAgIC8vIHZpc2kgb3JkZXIgbWV0YSAocGFzdG9tYXR1aSByYXN0aSkKICAgICAgICAkbW09YXJyYXkoKTsKICAgICAgICBmb3JlYWNoKCRvLT5nZXRfbWV0YV9kYXRhKCkgYXMgJG0peyAkdj0kbS0+dmFsdWU7ICRtbVskbS0+a2V5XT1pc19zY2FsYXIoJHYpPyhzdHJpbmcpJHY6J1tvYmpdJzsgfQogICAgICAgICRyWyd1enNha3ltYXMnXVsndmlzaV9tZXRhJ109JG1tOwogICAgICAgIGVjaG8gd3BfanNvbl9lbmNvZGUoJHIsIEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QUkVUVFlfUFJJTlQpOyBleGl0OwogICAgfQogICAgaWYoJGFjdD09PSdjbGVhbnVwJyl7CiAgICAgICAgJGlkPShpbnQpKCRfR0VUWydpZCddPz8wKTsKICAgICAgICBpZighJGlkKXsgJHJbJ0tMQUlEQSddPSduZXJhIGlkJzsgZWNobyB3cF9qc29uX2VuY29kZSgkcik7IGV4aXQ7IH0KICAgICAgICAkbWF4PShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBNQVgoaWQpIEZST00geyRwZn13Y19vcmRlcnMiKTsKICAgICAgICAvLyBTQVVHSUtMSVM6IHRyaW5hbSBUSUsgamVpIHRhaSBuYXVqYXVzaWFzIGlyIGppcyBuYXVqZXNuaXMgdXogMzQ3MjAKICAgICAgICBpZigkaWQ8PTM0NzIwKXsgJHJbJ0FUU0lTQUtZVEEnXT0naWQgPD0gMzQ3MjAgKGVzYW1pIHV6c2FreW1haSknOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRyKTsgZXhpdDsgfQogICAgICAgICRvPXdjX2dldF9vcmRlcigkaWQpOwogICAgICAgIGlmKCEkbyl7ICRyWyduZXJhJ109dHJ1ZTsgZWNobyB3cF9qc29uX2VuY29kZSgkcik7IGV4aXQ7IH0KICAgICAgICAkby0+ZGVsZXRlKHRydWUpOwogICAgICAgICRyWydpc3RyaW50YXMnXT0kaWQ7CiAgICAgICAgJHJbJ2xpa28nXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHBmfXdjX29yZGVycyIpOwogICAgICAgICRyWydtYXhfaWQnXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgTUFYKGlkKSBGUk9NIHskcGZ9d2Nfb3JkZXJzIik7CiAgICAgICAgZWNobyB3cF9qc29uX2VuY29kZSgkcik7IGV4aXQ7CiAgICB9CiAgICBlY2hvIHdwX2pzb25fZW5jb2RlKGFycmF5KCdlcnInPT4nYWN0JykpOyBleGl0Owp9LCAxKTsK','base64').toString('utf8').replace(/^<\?php\s*/,'');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP S370 F14 Probe v1',code:PHP,scope:'global',active:true}));
for(let i=0;i<3&&!sid;i++){const r=sh('curl -sSk --max-time 60 '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
 try{const j=JSON.parse(r.out); if(j&&j.id)sid=j.id;}catch(e){} if(!sid)sh('sleep 4');}
O.sid=sid; sh('sleep 4');
function q(a){const x=sh('curl -sSk --max-time 90 "'+SITE+'/?ps_s370=K370m4&act='+a+'&z='+Math.random()+'"');
 try{return JSON.parse(x.out);}catch(e){return {raw:x.out.slice(0,500)};}}
O.pries=q('state');
const V={}; const SHOT=[];
function push(o){ V.zingsniai=V.zingsniai||[]; V.zingsniai.push(o); }
try{
 const browser=await chromium.launch();
 const ctx=await browser.newContext({viewport:{width:390,height:844}, ignoreHTTPSErrors:true, locale:'lt-LT',
   userAgent:'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
   isMobile:true, hasTouch:true, deviceScaleFactor:3});
 const p=await ctx.newPage();
 const jsErr=[], srvErr=[], postCheckout=[];
 p.on('pageerror', e=>jsErr.push(String(e).slice(0,140)));
 p.on('console', m=>{ if(m.type()==='error') jsErr.push('console: '+m.text().slice(0,120)); });
 p.on('response', r=>{ if(r.status()>=500) srvErr.push(r.status()+' '+r.url().slice(0,90)); });
 p.on('request', r=>{ if(r.method()==='POST' && /wc-ajax=checkout|\/checkout/.test(r.url())) postCheckout.push(r.url().slice(0,90)); });

 // ---- pagalbinės ----
 async function ekranas(vardas){
   const t=await p.evaluate(()=>({
     scrollW:document.documentElement.scrollWidth, innerW:window.innerWidth,
     tekstas:(document.body.innerText||'').replace(/\s+/g,' ').slice(0,200)
   }));
   push({zingsnis:vardas, url:p.url(), hScroll:t.scrollW>t.innerW+2, scrollW:t.scrollW, innerW:t.innerW, matyti:t.tekstas});
   return t;
 }
 async function mygtukas(sel){
   const l=p.locator(sel).first();
   if(!(await l.count())) return {yra:false};
   await l.scrollIntoViewIfNeeded().catch(()=>{});
   await p.waitForTimeout(400);
   const txt=(await l.innerText().catch(()=>'')).trim();
   const box=await l.boundingBox().catch(()=>null);
   let uzdengtas=null;
   if(box){
     uzdengtas=await p.evaluate(([x,y])=>{
       const el=document.elementFromPoint(x,y); if(!el) return 'nera-elemento';
       const b=el.closest('button,a,input[type=submit]');
       return b? null : (el.tagName+'.'+(el.className||'').toString().slice(0,40));
     },[box.x+box.width/2, box.y+box.height/2]);
   }
   return {yra:true, tekstas:txt, matomas:await l.isVisible(), box, uzdengtas};
 }
 async function sutikimai(){
   try{ const b=p.locator('button:has-text("Priimti")').first(); if(await b.count()) await b.click({timeout:4000}); }catch(e){}
 }

 // ===== 1-2. PREKĖ → Į KREPŠELĮ =====
 await p.goto(SITE+'/product/zaislas-katei-plastikinis-kamuoliukas-4-cm/',{waitUntil:'domcontentloaded',timeout:60000});
 await p.waitForTimeout(2500); await sutikimai(); await p.waitForTimeout(800);
 await ekranas('preke');
 V.preke_mygtukas=await mygtukas('button[name="add-to-cart"], .single_add_to_cart_button');
 await p.locator('.single_add_to_cart_button').first().click({timeout:15000});
 await p.waitForTimeout(4000);
 await ekranas('po_i_krepseli');

 // ===== 3. KREPŠELIS =====
 await p.goto(SITE+'/cart/',{waitUntil:'domcontentloaded',timeout:60000});
 await p.waitForTimeout(3000);
 const kr=await ekranas('krepselis');
 V.krepselis={
   eiluciu:await p.locator('.woocommerce-cart-form__cart-item, tr.cart_item').count(),
   kiekis:await p.locator('input.qty').first().inputValue().catch(()=>null),
   suma:(await p.locator('.order-total .amount, .cart-subtotal .amount').first().innerText().catch(()=>null))
 };
 // Flatsome turi DU checkout mygtukus; .hide-for-small mobiliame paslėptas
 const ctaVisi=await p.locator('a[href*="/checkout"], .checkout-button').all();
 const ctaInfo=[];
 for(const c of ctaVisi){ ctaInfo.push({tekstas:(await c.innerText().catch(()=>'')).replace(/\s+/g,' ').trim().slice(0,40),
   klase:(await c.getAttribute('class'))||'', matomas:await c.isVisible().catch(()=>null)}); }
 V.krepselio_cta_visi=ctaInfo;
 V.krepselis_cta=await mygtukas('a[href*="/checkout"]:visible, .checkout-button:visible');
 const cta=p.locator('a[href*="/checkout"]:visible, .checkout-button:visible').first();
 if(await cta.count()){ await cta.click({timeout:20000}); }
 else { push({nera_matomo_cta:true}); await p.goto(SITE+'/checkout/',{waitUntil:'domcontentloaded',timeout:60000}); }
 await p.waitForTimeout(6000);
 await ekranas('checkout_atidarytas');

 // ===== 7. VALIDACIJA: bandom pateikti TUŠČIĄ formą =====
 const btnSel='#place_order';
 V.place_order_pries=await mygtukas(btnSel);
 if(V.place_order_pries.yra){
   await p.locator(btnSel).click({timeout:15000}).catch(()=>{});
   await p.waitForTimeout(5000);
   const kl=await p.locator('.woocommerce-error li, .woocommerce-error').allInnerTexts().catch(()=>[]);
   const pirmas=p.locator('.woocommerce-invalid input, .woocommerce-error li').first();
   let matomas=null, box=null;
   if(await pirmas.count()){ matomas=await pirmas.isVisible(); box=await pirmas.boundingBox().catch(()=>null); }
   V.validacija={klaidos:kl.slice(0,6), klaidu_sk:kl.length, pirma_matoma:matomas,
     ekrane: box? (box.y>=0 && box.y<844) : null};
   await ekranas('po_tuscios_formos');
 }

 // ===== 4. SVEČIO LAUKAI =====
 const ZYM='F14-'+Math.random().toString(36).slice(2,8).toUpperCase();
 V.zymuo=ZYM;
 const laukai={
   '#billing_first_name':'Testas', '#billing_last_name':ZYM,
   '#billing_address_1':'Gedimino pr. 1', '#billing_city':'Vilnius',
   '#billing_postcode':'01103', '#billing_phone':'+37060000000',
   '#billing_email':'f14.'+ZYM.toLowerCase()+'@pastas-test.lt'
 };
 for(const [sel,val] of Object.entries(laukai)){
   const l=p.locator(sel).first();
   if(await l.count()){ await l.scrollIntoViewIfNeeded().catch(()=>{}); await l.fill(val).catch(e=>push({klaida:sel+' '+String(e).slice(0,60)})); }
   else push({truksta_lauko:sel});
 }
 await p.waitForTimeout(4000);
 await ekranas('laukai_uzpildyti');

 // ===== 5. PRISTATYMAS + PAŠTOMATAS =====
 const metodai=await p.locator('input[name^="shipping_method"]').all();
 const sarasas=[];
 for(const m of metodai){ sarasas.push({val:await m.getAttribute('value'), id:await m.getAttribute('id')}); }
 V.pristatymo_metodai=sarasas;
 const pickup=sarasas.find(x=>/venipak_shipping_pickup/.test(x.val||''));
 V.pasirinktas_metodas=pickup?pickup.val:null;
 if(pickup){
   await p.locator('#'+CSS.escape(pickup.id)).check({force:true,timeout:15000}).catch(async()=>{
     await p.locator('input[value="'+pickup.val+'"]').first().click({force:true});
   });
   await p.waitForTimeout(6000);
 }
 await ekranas('metodas_pasirinktas');
 // terminalo laukas
 const visiSel=await p.locator('select').all();
 const selInfo=[];
 for(const s of visiSel){ selInfo.push({id:await s.getAttribute('id'), name:await s.getAttribute('name'), opt:await s.locator('option').count()}); }
 V.selectai=selInfo;
 const term=selInfo.find(x=>/venipak|terminal|pickup|pastomat/i.test((x.id||'')+' '+(x.name||'')));
 V.terminalo_laukas=term||null;
 if(term && term.opt>1){
   const sel='select'+(term.id?('#'+CSS.escape(term.id)):('[name="'+term.name+'"]'));
   const opts=await p.locator(sel+' option').all();
   let pick=null;
   for(const o of opts){ const v=await o.getAttribute('value'); if(v&&v!==''){ pick=v; break; } }
   if(pick){ await p.selectOption(sel,pick).catch(e=>push({terminalo_klaida:String(e).slice(0,80)})); V.terminalas_pasirinktas=pick; }
   await p.waitForTimeout(5000);
 }
 await ekranas('terminalas');

 // ===== stabilumas: keičiam lauką, ar paštomatas išlieka =====
 if(V.terminalas_pasirinktas){
   await p.locator('#billing_address_2').first().fill('but. 5').catch(()=>{});
   await p.locator('#billing_city').first().fill('Vilnius ').catch(()=>{});
   await p.locator('#billing_first_name').first().click().catch(()=>{});
   await p.waitForTimeout(7000);
   const t2=V.terminalo_laukas;
   const sel2='select'+(t2.id?('#'+CSS.escape(t2.id)):('[name="'+t2.name+'"]'));
   V.terminalas_po_pakeitimo=await p.locator(sel2).first().inputValue().catch(()=>null);
   V.terminalas_islieka = V.terminalas_po_pakeitimo===V.terminalas_pasirinktas;
 }

 // ===== 6. SANTRAUKA =====
 V.santrauka=await p.evaluate(()=>{
   const g=s=>{const e=document.querySelector(s); return e?e.innerText.replace(/\s+/g,' ').trim():null;};
   const eil=[...document.querySelectorAll('.woocommerce-checkout-review-order-table tbody tr')].map(t=>t.innerText.replace(/\s+/g,' ').trim());
   return {eilutes:eil, subtotal:g('.cart-subtotal .amount'), shipping:g('.woocommerce-shipping-totals .amount'), total:g('.order-total .amount')};
 });
 await ekranas('santrauka');

 // ===== 8. MOKĖJIMAS: bankinis pavedimas =====
 const bacs=p.locator('#payment_method_bacs');
 V.bacs_yra=await bacs.count()>0;
 if(V.bacs_yra){ await bacs.check({force:true,timeout:10000}).catch(()=>{}); await p.waitForTimeout(3000); }
 V.mokejimo_budai=await p.locator('input[name="payment_method"]').evaluateAll(a=>a.map(x=>x.value));

 // ===== 9. CTA pasiekiamumas prieš pateikimą =====
 await p.locator(btnSel).scrollIntoViewIfNeeded().catch(()=>{});
 await p.waitForTimeout(500);
 V.place_order=await mygtukas(btnSel);
 await ekranas('pries_pateikima');

 // ===== 10. PATEIKIAM =====
 const postPries=postCheckout.length;
 await p.locator(btnSel).click({timeout:20000});
 await p.waitForTimeout(12000);
 V.post_uzklausu=postCheckout.length-postPries;
 V.url_po=p.url();
 V.ekranas_po=(await p.locator('body').innerText().catch(()=>'')).replace(/\s+/g,' ').slice(0,300);
 const m=(V.url_po.match(/order-received\/(\d+)/)||[])[1];
 V.order_id=m?parseInt(m):null;
 await ekranas('order_received');
 V.js_klaidos=jsErr; V.serverio_klaidos=srvErr;
 await browser.close();
}catch(err){ V.ERR=String(err&&err.stack?err.stack:err).slice(0,900); }
O.V=V;

// uzsakymo patikra + valymas pagal TIKSLU id
if(O.V && O.V.order_id){
  O.uzsakymas=q('order&id='+O.V.order_id);
  O.po=q('state');
  O.valymas=q('cleanup&id='+O.V.order_id);
}else{ O.po=q('state'); }
if(sid){fs.writeFileSync('/tmp/off.json',JSON.stringify({active:false}));
 sh('curl -sSk --max-time 30 -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/off.json "'+API+'/'+sid+'"');}
putResult('s372.json', JSON.stringify(O,null,1));
console.log('OK');
