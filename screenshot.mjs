import { execSync } from "child_process";
import fs from "fs";
import { chromium } from "playwright";
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'x',branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));execSync('curl -s --max-time 40 -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'});}
let out='';const L=s=>{out+=s+'\n';};
const BASE='https://dev.avesa.lt';
(async()=>{try{
  const b=await chromium.launch({args:['--no-sandbox']});
  const d=await b.newContext({viewport:{width:1280,height:1200},ignoreHTTPSErrors:true});
  const p=await d.newPage();
  await p.goto(BASE+'/product/susidek-konservu-rinkini-sunims/',{waitUntil:'domcontentloaded',timeout:60000});
  await p.waitForTimeout(5000);
  const info=await p.evaluate(()=>{
    const sel=(el)=>{if(!el)return'';let s=el.tagName.toLowerCase();if(el.id)s+='#'+el.id;if(typeof el.className==='string'&&el.className.trim())s+='.'+el.className.trim().split(/\s+/).join('.');return s;};
    const res={};
    // message
    const msg=[...document.querySelectorAll('.mnm_message, .mnm_status')].map(e=>({sel:sel(e),y:Math.round(e.getBoundingClientRect().top+scrollY),txt:(e.innerText||'').replace(/\s+/g,' ').slice(0,50)}));
    res.messages=msg;
    // all quantity boxes: distinguish item-row vs footer by ancestor
    const qtys=[...document.querySelectorAll('.quantity')].map(q=>{
      const inItemTable = !!q.closest('td, .mnm_item, tr.mnm_product, .mnm_child_product');
      return {y:Math.round(q.getBoundingClientRect().top+scrollY), inItemTable, parent:sel(q.parentElement), grandparent:sel(q.parentElement&&q.parentElement.parentElement)};
    });
    // only footer (not item) quantities
    res.footer_qty=qtys.filter(q=>!q.inItemTable);
    res.item_qty_count=qtys.filter(q=>q.inItemTable).length;
    // add to cart buttons + visibility
    res.addcart=[...document.querySelectorAll('button[type=submit], .single_add_to_cart_button, .mnm_add_to_cart button, .psc-summary button, button.button')].map(bt=>({sel:sel(bt),y:Math.round(bt.getBoundingClientRect().top+scrollY),vis:bt.offsetHeight>0,txt:(bt.innerText||'').replace(/\s+/g,' ').slice(0,30)})).filter(x=>/krepšel|pasirink|cart|konserv/i.test(x.txt));
    // psc custom summary box
    const psc=document.querySelector('.psc-summary, [class*="summary"], [class*="jusu"]');
    res.psc_summary=psc?sel(psc):'(nerastas)';
    return res;
  });
  L(JSON.stringify(info,null,2));
  await d.close(); await b.close();
}catch(e){L('!!! '+e);}
finally{ putText('_boxdom2.txt',out); }
})();
