process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import fs from 'fs';
import { chromium } from 'playwright';
const B='https://dev.avesa.lt';
const U=process.env.WP_USER,P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='Basic '+Buffer.from(U+':'+P).toString('base64');
const TOK=process.env.GH_TOKEN||'';
fs.mkdirSync('screenshots',{recursive:true});
const out={marker:'SARGAS NARSYKLE v1'};
async function wp(p,o={}){try{const r=await fetch(B+p,{...o,headers:{'Authorization':AUTH,'Content-Type':'application/json',...(o.headers||{})}});return{status:r.status,text:await r.text()}}catch(e){return{status:0,text:String(e)}}}
function js(t){const i=Math.min(...['[','{'].map(c=>{const x=t.indexOf(c);return x<0?1e9:x}));try{return JSON.parse(t.slice(i))}catch(e){return null}}
const s1=await wp('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP Sargas Setup v1',code:Buffer.from('YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCSRrPSRfR0VUWydwc19zZXR1cCddID8/ICcnOyBpZigkayE9PSdTdDQ0WXk4JykgcmV0dXJuOwoJJFRJRD0yNjA3NzsgJENJRD0zNDE3MjsKCSRhY3Q9JF9HRVRbJ2FjdCddID8/ICcnOwoJJG89YXJyYXkoJ21hcmtlcic9PidTRVRVUCcpOwoJJHA9d2NfZ2V0X3Byb2R1Y3QoJFRJRCk7CglpZigkYWN0PT09J3NldCcpewoJCWlmKGdldF9vcHRpb24oJ3BzX3NldHVwX29yaWcnKT09PWZhbHNlKXsgdXBkYXRlX29wdGlvbigncHNfc2V0dXBfb3JpZycsJHAtPmdldF9zdG9ja19xdWFudGl0eSgpKTsgdXBkYXRlX29wdGlvbigncHNfc2V0dXBfb3JpZ3NzJywkcC0+Z2V0X3N0b2NrX3N0YXR1cygpKTsgfQoJCSRwLT5zZXRfc3RvY2tfcXVhbnRpdHkoKGludCkoJF9HRVRbJ3EnXSA/PyA0KSk7ICRwLT5zZXRfc3RvY2tfc3RhdHVzKCdpbnN0b2NrJyk7ICRwLT5zYXZlKCk7CgkJd2NfZGVsZXRlX3Byb2R1Y3RfdHJhbnNpZW50cygkVElEKTsgd2NfZGVsZXRlX3Byb2R1Y3RfdHJhbnNpZW50cygkQ0lEKTsKCX0gZWxzZWlmKCRhY3Q9PT0ncmVzdG9yZScpewoJCSRwLT5zZXRfc3RvY2tfcXVhbnRpdHkoKGludClnZXRfb3B0aW9uKCdwc19zZXR1cF9vcmlnJykpOyAkcC0+c2V0X3N0b2NrX3N0YXR1cyhnZXRfb3B0aW9uKCdwc19zZXR1cF9vcmlnc3MnLCdpbnN0b2NrJykpOyAkcC0+c2F2ZSgpOwoJCXdjX2RlbGV0ZV9wcm9kdWN0X3RyYW5zaWVudHMoJFRJRCk7IHdjX2RlbGV0ZV9wcm9kdWN0X3RyYW5zaWVudHMoJENJRCk7CgkJZGVsZXRlX29wdGlvbigncHNfc2V0dXBfb3JpZycpOyBkZWxldGVfb3B0aW9uKCdwc19zZXR1cF9vcmlnc3MnKTsKCX0KCSRjPXdjX2dldF9wcm9kdWN0KCRDSUQpOwoJJG9bJ2tvbXBvbmVudGFzJ109YXJyYXkoJ2lkJz0+JFRJRCwnbGlrdXRpcyc9PndjX2dldF9wcm9kdWN0KCRUSUQpLT5nZXRfc3RvY2tfcXVhbnRpdHkoKSwnc3MnPT53Y19nZXRfcHJvZHVjdCgkVElEKS0+Z2V0X3N0b2NrX3N0YXR1cygpKTsKCSRvWydyaW5raW55cyddPWFycmF5KCdpZCc9PiRDSUQsJ2luX3N0b2NrJz0+JGMtPmlzX2luX3N0b2NrKCk/MTowLCdzcyc9PiRjLT5nZXRfc3RvY2tfc3RhdHVzKCksCgkJJ2dhbGltYSc9PmNsYXNzX2V4aXN0cygnUGV0c2hvcF9SaW5raW5pdV9MaWt1Y2lhaScpP1BldHNob3BfUmlua2luaXVfTGlrdWNpYWk6OmdhbGltYV92aWVzYWkoJENJRCk6bnVsbCwKCQkndXJsJz0+Z2V0X3Blcm1hbGluaygkQ0lEKSk7CgloZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSwgMTMwKTsK','base64').toString('utf8'),scope:'global',active:true,priority:5})});
out.snip=js(s1.text)?.id||null;
await new Promise(r=>setTimeout(r,3000));
const files=[];
try{
  const br=await chromium.launch();
  const ctx=await br.newContext({ignoreHTTPSErrors:true,viewport:{width:1500,height:1200}});
  const pg=await ctx.newPage();
  // 1) likutis 4 -> galima 2
  let r=await pg.goto(`${B}/?ps_setup=St44Yy8&act=set&q=4`,{timeout:60000});
  out.setup=js(await r.text());
  const URL_=out.setup?.rinkinys?.url;
  out.url=URL_;
  if(URL_){
    await pg.goto(URL_,{waitUntil:'domcontentloaded',timeout:60000});
    await pg.waitForTimeout(5000);
    out.puslapis=await pg.evaluate(()=>{
      const n=s=>(s||'').replace(/\s+/g,' ').trim();
      return {title:document.title,
        stock:n((document.querySelector('.stock')||{}).innerText),
        btn:(()=>{const b=document.querySelector('.single_add_to_cart_button');return b?{txt:n(b.innerText),disabled:b.disabled||b.classList.contains('disabled')}:null;})(),
        qtyMax:(document.querySelector('form.cart input.qty')||{}).max||''};
    });
    await pg.screenshot({path:'screenshots/sargas_pusl.png',fullPage:false}); files.push('screenshots/sargas_pusl.png');
    // bandom pirkti 3
    try{
      const q=await pg.$('form.cart input.qty'); if(q){ await q.fill('3'); }
      const btn=await pg.$('.single_add_to_cart_button');
      if(btn && !(await btn.isDisabled())){ await btn.click(); await pg.waitForTimeout(6000); }
      out.po_paspaudimo=await pg.evaluate(()=>{
        const n=s=>(s||'').replace(/\s+/g,' ').trim();
        return {url:location.href,
          klaidos:[...document.querySelectorAll('.woocommerce-error li,.woocommerce-error,.wc-block-components-notice-banner')].map(e=>n(e.innerText)).slice(0,4),
          sekme:[...document.querySelectorAll('.woocommerce-message')].map(e=>n(e.innerText)).slice(0,2)};
      });
      await pg.screenshot({path:'screenshots/sargas_po.png',fullPage:false}); files.push('screenshots/sargas_po.png');
      // krepselis
      await pg.goto(B+'/krepselis/',{waitUntil:'domcontentloaded',timeout:60000}); await pg.waitForTimeout(4000);
      out.krepselis=await pg.evaluate(()=>{
        const n=s=>(s||'').replace(/\s+/g,' ').trim();
        return {klaidos:[...document.querySelectorAll('.woocommerce-error li,.woocommerce-error')].map(e=>n(e.innerText)).slice(0,4),
          eilutes:[...document.querySelectorAll('.cart_item')].map(e=>n(e.innerText).slice(0,60)),
          checkout:!!document.querySelector('.checkout-button')};
      });
      await pg.screenshot({path:'screenshots/sargas_krepselis.png',fullPage:false}); files.push('screenshots/sargas_krepselis.png');
    }catch(e){ out.pirkimo_err=String(e).slice(0,250); }
  }
  // 2) likutis 0
  r=await pg.goto(`${B}/?ps_setup=St44Yy8&act=set&q=0`,{timeout:60000}); out.setup0=js(await r.text());
  if(URL_){ await pg.goto(URL_,{waitUntil:'domcontentloaded',timeout:60000}); await pg.waitForTimeout(4000);
    out.puslapis0=await pg.evaluate(()=>{const n=s=>(s||'').replace(/\s+/g,' ').trim();
      return {stock:n((document.querySelector('.stock')||{}).innerText),
        btn:!!document.querySelector('.single_add_to_cart_button')};});
    await pg.screenshot({path:'screenshots/sargas_nulis.png',fullPage:false}); files.push('screenshots/sargas_nulis.png');
  }
  // atstatom
  r=await pg.goto(`${B}/?ps_setup=St44Yy8&act=restore`,{timeout:60000}); out.restore=js(await r.text());
  await br.close();
}catch(e){ out.err=String(e).slice(0,400); }
if(out.snip) await wp('/wp-json/code-snippets/v1/snippets/'+out.snip,{method:'POST',body:JSON.stringify({active:false})});
async function put(p,buf,m){const r=await fetch('https://api.github.com/repos/raimis079-creator/petshop-bridge/contents/'+p,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify({message:m,content:buf.toString('base64')})});return r.status}
for(const f of files){ console.log(f,await put(f,fs.readFileSync(f),'sargas shot')); }
console.log('info',await put('screenshots/sargas_narsykle.json',Buffer.from(JSON.stringify(out,null,1)),'rinkrec result narsykle'));
