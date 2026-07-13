import { execSync } from "child_process";
import fs from "fs";
import { chromium } from "playwright";
function putBinary(n,buf){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;for(let a=0;a<4;a++){try{const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'x',branch:'main',content:buf.toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pb.json',JSON.stringify(b));const r=execSync('curl -s --max-time 45 -w "\nHTTP:%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pb.json "'+url+'"',{encoding:'utf8',maxBuffer:80000000});if(/HTTP:20[01]/.test(r))return true;}catch(e){}execSync('sleep 2');}return false;}
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'x',branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));execSync('curl -s --max-time 40 -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'});}
let out='';const L=s=>{out+=s+'\n';};
const BASE='https://dev.avesa.lt';const U=process.env.WP_USER||'';const P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const FIX="if ( ! defined( 'ABSPATH' ) ) { return; }\n\n/**\n * Petshop Produktu Nuotrauku Vienodinimas v2\n * WC thumbnail = uncropped -> skirtingi native aspect ratios -> skirtingi auk\u0161\u010diai.\n * Fix: 1:1 box + object-fit:contain visose produkt\u0173 loop'o formose.\n * v2: prid\u0117ta build-a-box (Mix and Match) preki\u0173 eilut\u0117s (.mnm_child_product_images).\n * Nieko neapkarpo (rinkini\u0173 pla\u010dios nuotraukos lieka pilnos), tik vienodina auk\u0161t\u012f.\n */\nadd_action( 'wp_head', function () {\n\techo '<style id=\"ps-img-uniform\">\n\t/* Shop/kategorija/pana\u0161\u016bs/cross-sell loop */\n\t.product-small .box-image img,\n\tul.products li.product .box-image img,\n\t.related .product-small .box-image img,\n\t.up-sells .product-small .box-image img{\n\t\taspect-ratio:1/1 !important;\n\t\twidth:100% !important;\n\t\theight:auto !important;\n\t\tobject-fit:contain !important;\n\t\tobject-position:center !important;\n\t}\n\t.product-small .box-image,\n\tul.products li.product .box-image{\n\t\taspect-ratio:1/1 !important;\n\t\tdisplay:block !important;\n\t}\n\t/* Build-a-box (Mix and Match) preki\u0173 eilut\u0117s */\n\t.mnm_child_product_images{\n\t\twidth:90px !important;\n\t\taspect-ratio:1/1 !important;\n\t\tdisplay:block !important;\n\t}\n\t.mnm_child_product_images .mnm_child_product_image,\n\t.mnm_child_product_images figure{\n\t\twidth:100% !important;\n\t\theight:100% !important;\n\t\tmargin:0 !important;\n\t}\n\t.mnm_child_product_images img{\n\t\taspect-ratio:1/1 !important;\n\t\twidth:100% !important;\n\t\theight:100% !important;\n\t\tobject-fit:contain !important;\n\t\tobject-position:center !important;\n\t}\n\t</style>' . \"\\n\";\n}, 99 );\n";
function api(method,path,body){const auth='-u "'+U+':'+P+'"';let cmd;if(body){fs.writeFileSync('/tmp/b.json',JSON.stringify(body));cmd='curl -s -k --max-time 90 -w "\nHTTP:%{http_code}" '+auth+' -X '+method+' -H "Content-Type: application/json" --data-binary @/tmp/b.json "'+BASE+path+'"';}else{cmd='curl -s -k --max-time 60 -w "\nHTTP:%{http_code}" '+auth+' -X '+method+' "'+BASE+path+'"';}let r;try{r=execSync(cmd,{encoding:'utf8',maxBuffer:30000000});}catch(e){r=(e.stdout||'')+'\nHTTP:TIMEOUT';}return{code:(r.match(/HTTP:(\S+)$/)||[])[1]||'?',body:r.replace(/\nHTTP:\S+$/,'')};}
(async()=>{try{
  let u=api('POST','/wp-json/code-snippets/v1/snippets/705',{id:705,name:'Petshop Produktu Nuotrauku Vienodinimas v1',code:FIX,scope:'global',active:true,priority:10});
  L('update 705 http='+u.code);
  execSync('sleep 3');
  const b=await chromium.launch({args:['--no-sandbox']});
  const d=await b.newContext({viewport:{width:1280,height:1000},ignoreHTTPSErrors:true});
  const p=await d.newPage();
  await p.goto(BASE+'/product/susidek-konservu-rinkini-sunims/',{waitUntil:'domcontentloaded',timeout:50000});
  await p.waitForTimeout(6000);
  const r=await p.evaluate(()=>{
    var forms=[...document.querySelectorAll('.psc-form')].filter(f=>f.style.display!=='none');
    if(!forms.length) return {err:'no form'};
    var imgs=[...forms[0].querySelectorAll('.mnm_child_product_images img')].filter(i=>i.offsetParent!==null).slice(0,6);
    return imgs.map(i=>{var b=i.getBoundingClientRect();return {w:Math.round(b.width),h:Math.round(b.height)};});
  });
  L('build-a-box img dimensions: '+JSON.stringify(r));
  // scroll to items area
  await p.evaluate(()=>{var f=[...document.querySelectorAll('.psc-form')].filter(x=>x.style.display!=='none')[0];if(f)f.scrollIntoView({block:'start'});});
  await p.waitForTimeout(1500);
  putBinary('boxitems_uniform.png', await p.screenshot()); L('shot ok');
  // regresija: /konservai-sunims/ (kategorija) — turi likti uniform
  const p2=await d.newPage();
  await p2.goto(BASE+'/product/animonda-grancarno-adult-beef-duck-hearts-konservai-suaugusiems-sunims-su-jautiena-ir-anciu-sirdelemis-400-g-x-6-vnt/',{waitUntil:'domcontentloaded',timeout:50000}); await p2.waitForTimeout(4000);
  const r2=await p2.evaluate(()=>{return [...document.querySelectorAll('.related .product-small .box-image img')].slice(0,4).map(i=>Math.round(i.getBoundingClientRect().height));});
  L('regr /related/ heights: '+JSON.stringify(r2));
  await d.close(); await b.close();
}catch(e){L('!!! '+e);}
finally{ putText('_boxfix.txt',out); }
})();
