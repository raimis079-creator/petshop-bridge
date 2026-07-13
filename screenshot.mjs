import { execSync } from "child_process";
import fs from "fs";
import { chromium } from "playwright";
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'x',branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));execSync('curl -s --max-time 40 -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'});}
let out='';const L=s=>{out+=s+'\n';};
const BASE='https://dev.avesa.lt';
(async()=>{try{
  const b=await chromium.launch({args:['--no-sandbox']});
  const d=await b.newContext({viewport:{width:1280,height:1000},ignoreHTTPSErrors:true});
  const p=await d.newPage();
  await p.goto(BASE+'/product/susidek-konservu-rinkini-sunims/',{waitUntil:'domcontentloaded',timeout:50000});
  await p.waitForTimeout(6000);
  const info=await p.evaluate(()=>{
    function chain(el){var a=[];var n=el;for(var i=0;i<6&&n&&n.tagName;i++){var s=n.tagName.toLowerCase();if(typeof n.className==='string'&&n.className.trim())s+='.'+n.className.trim().split(/\s+/).join('.');a.unshift(s);n=n.parentElement;}return a.join(' > ');}
    function vis(el){return el && el.offsetParent!==null && el.getBoundingClientRect().height>0;}
    var res={msg:[],qty:[]};
    var all=document.querySelectorAll('*');
    for(var i=0;i<all.length;i++){
      var el=all[i];
      if(el.children.length>2) continue;
      var t=(el.textContent||'');
      if(/kad tęstumėte|Pasirinkite \d+ vnt/i.test(t) && vis(el)){
        res.msg.push({chain:chain(el), y:Math.round(el.getBoundingClientRect().top), txt:t.replace(/\s+/g,' ').slice(0,50)});
      }
    }
    // visible quantity inputs
    var qs=document.querySelectorAll('input.qty, input[type=number], .quantity');
    for(var j=0;j<qs.length;j++){
      var q=qs[j];
      if(vis(q)){
        var inItem=!!q.closest('.mnm_child_products, td');
        res.qty.push({chain:chain(q), y:Math.round(q.getBoundingClientRect().top+window.scrollY), inItem:inItem, val:q.value||''});
      }
    }
    // dedupe msg chains
    var seen={};res.msg=res.msg.filter(m=>{if(seen[m.chain])return false;seen[m.chain]=1;return true;});
    // only NON-item visible quantities (the bottom container one)
    res.footer_qty=res.qty.filter(q=>!q.inItem);
    res.item_qty_count=res.qty.filter(q=>q.inItem).length;
    delete res.qty;
    return res;
  });
  L(JSON.stringify(info,null,2));
  await d.close(); await b.close();
}catch(e){L('ERR '+e);}
finally{ putText('_boxfind.txt',out); }
})();
