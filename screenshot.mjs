import { execSync } from "child_process";
import fs from "fs";
import { chromium } from "playwright";
function putBinary(n,buf){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;for(let a=0;a<4;a++){try{const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'x',branch:'main',content:buf.toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pb.json',JSON.stringify(b));const r=execSync('curl -s --max-time 45 -w "\nHTTP:%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pb.json "'+url+'"',{encoding:'utf8',maxBuffer:80000000});if(/HTTP:20[01]/.test(r))return true;}catch(e){}execSync('sleep 2');}return false;}
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'x',branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));execSync('curl -s --max-time 40 -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'});}
let out='';const L=s=>{out+=s+'\n';console.log(s);};
const BASE='https://dev.avesa.lt';const U=process.env.WP_USER||'';const P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const FIX="if ( ! defined( 'ABSPATH' ) ) { return; }\n\n/**\n * Petshop Produktu Nuotrauku Vienodinimas v1\n * WC thumbnail = uncropped -> skirtingi native aspect ratios -> skirtingi auk\u0161\u010diai\n * loop'e (shop/kategorija/pana\u0161\u016bs/cross-sell). Fix: 1:1 box + object-fit:contain.\n * Nieko neapkarpo (rinkini\u0173 pla\u010dios nuotraukos lieka pilnos), tik vienodina auk\u0161t\u012f.\n */\nadd_action( 'wp_head', function () {\n\techo '<style id=\"ps-img-uniform\">\n\t.product-small .box-image img,\n\tul.products li.product .box-image img,\n\t.related .product-small .box-image img,\n\t.up-sells .product-small .box-image img{\n\t\taspect-ratio:1/1 !important;\n\t\twidth:100% !important;\n\t\theight:auto !important;\n\t\tobject-fit:contain !important;\n\t\tobject-position:center !important;\n\t}\n\t.product-small .box-image,\n\tul.products li.product .box-image{\n\t\taspect-ratio:1/1 !important;\n\t\tdisplay:block !important;\n\t}\n\t</style>' . \"\\n\";\n}, 99 );\n";
const PURL=BASE+'/product/animonda-grancarno-adult-beef-duck-hearts-konservai-suaugusiems-sunims-su-jautiena-ir-anciu-sirdelemis-400-g-x-6-vnt/';
function api(method,path,body){const auth='-u "'+U+':'+P+'"';let cmd;if(body){fs.writeFileSync('/tmp/b.json',JSON.stringify(body));cmd='curl -s -k --max-time 90 -w "\nHTTP:%{http_code}" '+auth+' -X '+method+' -H "Content-Type: application/json" --data-binary @/tmp/b.json "'+BASE+path+'"';}else{cmd='curl -s -k --max-time 60 -w "\nHTTP:%{http_code}" '+auth+' -X '+method+' "'+BASE+path+'"';}let r;try{r=execSync(cmd,{encoding:'utf8',maxBuffer:30000000});}catch(e){r=(e.stdout||'')+'\nHTTP:TIMEOUT';}return{code:(r.match(/HTTP:(\S+)$/)||[])[1]||'?',body:r.replace(/\nHTTP:\S+$/,'')};}
(async()=>{let id=0;try{
  const c=api('POST','/wp-json/code-snippets/v1/snippets',{name:'Petshop Produktu Nuotrauku Vienodinimas v1',desc:'1:1 box + contain loop images',code:FIX,scope:'global',active:true,priority:10});
  try{id=JSON.parse(c.body).id;}catch(e){}
  L('imgfix snippet id='+id+' http='+c.code);
  if(!id){L('fail '+c.body.slice(0,200));putText('_imgfix.txt',out);return;}
  execSync('sleep 3');
  const b=await chromium.launch({args:['--no-sandbox']});
  const d=await b.newContext({viewport:{width:1280,height:1200},ignoreHTTPSErrors:true});
  const p=await d.newPage();
  await p.goto(PURL,{waitUntil:'domcontentloaded',timeout:60000}); await p.waitForTimeout(4500);
  // measure related product image heights
  const heights=await p.evaluate(()=>{
    const imgs=[...document.querySelectorAll('.related .product-small .box-image img, .related ul.products img')];
    return imgs.slice(0,4).map(i=>Math.round(i.getBoundingClientRect().height));
  });
  L('related img heights: '+JSON.stringify(heights));
  // scroll to related, screenshot
  await p.evaluate(()=>{const el=document.querySelector('.related');if(el)el.scrollIntoView();});
  await p.waitForTimeout(1200);
  putBinary('imgfix_related.png', await p.screenshot()); L('shot ok');
  await d.close(); await b.close();
}catch(e){L('!!! '+e);}
finally{ putText('_imgfix.txt',out+'\nID='+id); }
})();
