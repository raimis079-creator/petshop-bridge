process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import fs from 'fs';
import { chromium } from 'playwright';
const B='https://dev.avesa.lt';
const U=process.env.WP_USER,P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='Basic '+Buffer.from(U+':'+P).toString('base64');
const TOK=process.env.GH_TOKEN||'';
fs.mkdirSync('screenshots',{recursive:true});
const out={marker:'FRONT-ZERO-CHECK v1'};
async function wp(p,o={}){try{const r=await fetch(B+p,{...o,headers:{'Authorization':AUTH,'Content-Type':'application/json',...(o.headers||{})}});return{status:r.status,text:await r.text()}}catch(e){return{status:0,text:String(e)}}}
function js(t){const i=Math.min(...['[','{'].map(c=>{const x=t.indexOf(c);return x<0?1e9:x}));try{return JSON.parse(t.slice(i))}catch(e){return null}}
const php=Buffer.from('YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCSRrPSRfR0VUWydwc19mcm9udCddID8/ICcnOyBpZigkayE9PSdGcjU1TmIyJykgcmV0dXJuOwoJJGFjdD0kX0dFVFsnYWN0J10gPz8gJyc7CgkkVElEPTI2MDc3OyAkQ0lEPTM0MTcyOwoJJG89YXJyYXkoJ21hcmtlcic9PidGUk9OVC1aRVJPJyk7CglpZigkYWN0PT09J3plcm8nKXsKCQkkcD13Y19nZXRfcHJvZHVjdCgkVElEKTsKCQl1cGRhdGVfb3B0aW9uKCdwc190bXBfb3JpZ19xdHknLCRwLT5nZXRfc3RvY2tfcXVhbnRpdHkoKSk7CgkJdXBkYXRlX29wdGlvbigncHNfdG1wX29yaWdfc3MnLCRwLT5nZXRfc3RvY2tfc3RhdHVzKCkpOwoJCSRwLT5zZXRfc3RvY2tfcXVhbnRpdHkoMCk7ICRwLT5zZXRfc3RvY2tfc3RhdHVzKCdvdXRvZnN0b2NrJyk7ICRwLT5zYXZlKCk7CgkJd2NfZGVsZXRlX3Byb2R1Y3RfdHJhbnNpZW50cygkVElEKTsgd2NfZGVsZXRlX3Byb2R1Y3RfdHJhbnNpZW50cygkQ0lEKTsKCQkkb1snemVyb2VkJ109YXJyYXkoJ2lkJz0+JFRJRCwnYnV2byc9PmdldF9vcHRpb24oJ3BzX3RtcF9vcmlnX3F0eScpKTsKCX0gZWxzZWlmKCRhY3Q9PT0ncmVzdG9yZScpewoJCSRwPXdjX2dldF9wcm9kdWN0KCRUSUQpOwoJCSRwLT5zZXRfc3RvY2tfcXVhbnRpdHkoKGludClnZXRfb3B0aW9uKCdwc190bXBfb3JpZ19xdHknKSk7ICRwLT5zZXRfc3RvY2tfc3RhdHVzKGdldF9vcHRpb24oJ3BzX3RtcF9vcmlnX3NzJywnaW5zdG9jaycpKTsgJHAtPnNhdmUoKTsKCQl3Y19kZWxldGVfcHJvZHVjdF90cmFuc2llbnRzKCRUSUQpOyB3Y19kZWxldGVfcHJvZHVjdF90cmFuc2llbnRzKCRDSUQpOwoJCSRvWydyZXN0b3JlZCddPWFycmF5KCdxdHknPT53Y19nZXRfcHJvZHVjdCgkVElEKS0+Z2V0X3N0b2NrX3F1YW50aXR5KCksJ3NzJz0+d2NfZ2V0X3Byb2R1Y3QoJFRJRCktPmdldF9zdG9ja19zdGF0dXMoKSk7CgkJZGVsZXRlX29wdGlvbigncHNfdG1wX29yaWdfcXR5Jyk7IGRlbGV0ZV9vcHRpb24oJ3BzX3RtcF9vcmlnX3NzJyk7Cgl9IGVsc2UgewoJCSRwPXdjX2dldF9wcm9kdWN0KCRUSUQpOwoJCSRvWydzdGF0ZSddPWFycmF5KCdxdHknPT4kcC0+Z2V0X3N0b2NrX3F1YW50aXR5KCksJ3NzJz0+JHAtPmdldF9zdG9ja19zdGF0dXMoKSk7Cgl9CgloZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSk7Cg==','base64').toString('utf8');
const sr=await wp('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP Front Zero v1',code:php,scope:'global',active:true,priority:5})});
const sn=js(sr.text); out.snip=sn&&sn.id?sn.id:null;
await new Promise(r=>setTimeout(r,3000));

const URL_=B+'/produktas/churu-ivairiu-skoniu-rinkinys-katems-7-vnt/';
async function apziura(pg,zyme){
  const r={};
  try{
    await pg.goto(URL_,{waitUntil:'domcontentloaded',timeout:60000});
    await pg.waitForTimeout(4000);
    r.url=pg.url(); r.title=await pg.title();
    r.info=await pg.evaluate(()=>{
      const norm=s=>(s||'').replace(/\s+/g,' ').trim();
      const items=[...document.querySelectorAll('.mnm_item, .mnm_child_item, [class*="mnm"][class*="item"], form.mnm_form tr, .product-small')].slice(0,40);
      const rows=items.map(el=>({
        txt:norm(el.innerText).slice(0,70),
        cls:el.className.slice(0,80),
        input:!!el.querySelector('input[type=number],input.qty,select'),
        disabled:!!el.querySelector('input[disabled],select[disabled]'),
        outofstock:/nėra|neturime|out of stock|išparduota/i.test(norm(el.innerText))
      })).filter(x=>x.txt);
      const btn=document.querySelector('button[type=submit].single_add_to_cart_button, .single_add_to_cart_button');
      return {
        rows:rows,
        qtyInputs:document.querySelectorAll('form input.qty, form input[type=number]').length,
        addBtn: btn?{txt:norm(btn.innerText),disabled:btn.disabled,cls:btn.className.slice(0,60)}:null,
        bodyHas26077: document.body.innerHTML.includes('26077'),
        pageTxt: norm(document.body.innerText).slice(0,900)
      };
    });
  }catch(e){ r.err=String(e).slice(0,250); }
  await pg.screenshot({path:`screenshots/front_${zyme}.png`,fullPage:true});
  return r;
}
try{
  const br=await chromium.launch();
  const ctx=await br.newContext({ignoreHTTPSErrors:true,viewport:{width:1500,height:1200}});
  const pg=await ctx.newPage();
  out.normalus=await apziura(pg,'normalus');
  const z=await pg.goto(`${B}/?ps_front=Fr55Nb2&act=zero`,{timeout:60000}); out.zero=js(await z.text());
  await pg.waitForTimeout(2000);
  out.nulinis=await apziura(pg,'nulinis');
  const rr=await pg.goto(`${B}/?ps_front=Fr55Nb2&act=restore`,{timeout:60000}); out.restore=js(await rr.text());
  await br.close();
}catch(e){ out.err=String(e).slice(0,400); }
if(out.snip){const d=await wp('/wp-json/code-snippets/v1/snippets/'+out.snip,{method:'POST',body:JSON.stringify({active:false})});out.deact=d.status;}
async function put(p,buf,m){const r=await fetch('https://api.github.com/repos/raimis079-creator/petshop-bridge/contents/'+p,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify({message:m,content:buf.toString('base64')})});return r.status}
for(const f of ['screenshots/front_normalus.png','screenshots/front_nulinis.png']){ if(fs.existsSync(f)) console.log(f,await put(f,fs.readFileSync(f),'front shot')); }
console.log('info',await put('screenshots/front_info.json',Buffer.from(JSON.stringify(out,null,1)),'front result'));
