import { execSync } from "child_process";
import fs from "fs";
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'x',branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));execSync('curl -s --max-time 40 -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'});}
import { chromium } from "playwright";
let out='';const L=s=>{out+=s+'\n';};
const BASE='https://dev.avesa.lt';
(async()=>{try{
  const b=await chromium.launch({args:['--no-sandbox']});
  const d=await b.newContext({viewport:{width:1280,height:1200},ignoreHTTPSErrors:true});
  const p=await d.newPage();
  await p.goto(BASE+'/product/susidek-konservu-rinkini-sunims/',{waitUntil:'domcontentloaded',timeout:60000});
  await p.waitForTimeout(5000);
  const info=await p.evaluate(()=>{
    const res={};
    // find el containing "Pasirinkite 12" or "kad tęstumėte"
    const all=[...document.querySelectorAll('*')];
    const msg=all.find(e=>e.children.length===0 && /kad tęstumėte|Pasirinkote .* vnt/i.test(e.textContent||''));
    if(msg){
      // climb ancestors
      let chain=[];let n=msg;
      for(let i=0;i<6 && n;i++){chain.push((n.tagName||'')+'.'+(typeof n.className==='string'?n.className.replace(/\s+/g,'.'):'')+(n.id?'#'+n.id:''));n=n.parentElement;}
      res.msg_chain=chain;
    }
    // find the standalone quantity form (the bottom one)
    const forms=[...document.querySelectorAll('form.cart, .cart, form')];
    res.forms=forms.map(f=>({tag:f.tagName,cls:(typeof f.className==='string'?f.className:''),hasQty:!!f.querySelector('.quantity, input.qty'),txt:(f.innerText||'').replace(/\s+/g,' ').slice(0,60)}));
    // all quantity inputs + their context
    const qtys=[...document.querySelectorAll('.quantity, input.qty')];
    res.qty_count=qtys.length;
    // the single_add_to_cart form specifically
    const sac=document.querySelector('form.cart:not(.grouped_form):not(.bundle_form)');
    if(sac){ res.single_add_to_cart={cls:sac.className, parentCls:(sac.parentElement&&typeof sac.parentElement.className==='string')?sac.parentElement.className:'', txt:(sac.innerText||'').replace(/\s+/g,' ').slice(0,80)}; }
    return res;
  });
  L(JSON.stringify(info,null,2));
  await d.close(); await b.close();
}catch(e){L('!!! '+e);}
finally{ putText('_boxdom.txt',out); }
})();
