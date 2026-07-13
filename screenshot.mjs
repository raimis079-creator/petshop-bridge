import { execSync } from "child_process";
import fs from "fs";
import { chromium } from "playwright";
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'x',branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));execSync('curl -s --max-time 40 -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'});}
let out='';const L=s=>{out+=s+'\n';};
const BASE='https://dev.avesa.lt';const U=process.env.WP_USER||'';const P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const FIX="if ( ! defined( 'ABSPATH' ) ) { return; }\n\n/**\n * Petshop Build-a-box UI Valymas v2\n * Build-a-box (#547 psc-form) palieka matom\u0105 MNM container add-to-cart blok\u0105 apa\u010dioje:\n * validacijos \u017einut\u0119 (.mnm_status/.mnm_message) + container kiek\u012f (.mnm_button_wrap .quantity).\n * Custom \u201eJ\u016bs\u0173 rinkinys\" suvestin\u0117 + proxy CTA juos pakei\u010dia -> paslepiam.\n * Scope: body.petshop-choice-page .psc-form. Container kiekis yra .mnm_button_wrap viduje;\n * preki\u0173 kiekiai (.mnm_child_products) NEPALIESTI. Tikras add-to-cart mygtukas lieka (proxy j\u012f spaud\u017eia).\n */\nadd_action( 'wp_head', function () {\n\tif ( ! function_exists( 'is_product' ) || ! is_product() ) { return; }\n\techo '<style id=\"ps-boxui\">\n\tbody.petshop-choice-page .psc-form .mnm_button_wrap .ux-quantity,\n\tbody.petshop-choice-page .psc-form .mnm_button_wrap .quantity{display:none !important;}\n\tbody.petshop-choice-page .psc-form .mnm_status,\n\tbody.petshop-choice-page .psc-form .mnm_message{display:none !important;}\n\t</style>' . \"\\n\";\n}, 99 );\n";
function api(method,path,body){const auth='-u "'+U+':'+P+'"';let cmd;if(body){fs.writeFileSync('/tmp/b.json',JSON.stringify(body));cmd='curl -s -k --max-time 90 -w "\nHTTP:%{http_code}" '+auth+' -X '+method+' -H "Content-Type: application/json" --data-binary @/tmp/b.json "'+BASE+path+'"';}else{cmd='curl -s -k --max-time 60 -w "\nHTTP:%{http_code}" '+auth+' -X '+method+' "'+BASE+path+'"';}let r;try{r=execSync(cmd,{encoding:'utf8',maxBuffer:30000000});}catch(e){r=(e.stdout||'')+'\nHTTP:TIMEOUT';}return{code:(r.match(/HTTP:(\S+)$/)||[])[1]||'?',body:r.replace(/\nHTTP:\S+$/,'')};}
(async()=>{let id=709;try{
  let u=api('POST','/wp-json/code-snippets/v1/snippets/709',{id:709,name:'Petshop Build-a-box UI Valymas v1',code:FIX,scope:'global',active:true,priority:10});
  L('update 709 http='+u.code);
  execSync('sleep 3');
  const b=await chromium.launch({args:['--no-sandbox']});
  const d=await b.newContext({viewport:{width:1280,height:1000},ignoreHTTPSErrors:true});
  const p=await d.newPage();
  await p.goto(BASE+'/product/susidek-konservu-rinkini-sunims/',{waitUntil:'domcontentloaded',timeout:50000});
  await p.waitForTimeout(6000);
  const r=await p.evaluate(()=>{
    function vis(el){return el && el.offsetParent!==null && el.getBoundingClientRect().height>0;}
    // visible container quantity (in .mnm_button_wrap)
    var cq=[...document.querySelectorAll('.psc-form .mnm_button_wrap .quantity, .psc-form .mnm_button_wrap .ux-quantity')].filter(vis).length;
    // visible message with tęstumėte
    var msgVis=[...document.querySelectorAll('.psc-form .mnm_message, .psc-form .mnm_status')].filter(el=>vis(el) && /tęstum|Pasirinkite \d/i.test(el.textContent||'')).length;
    // any visible element with kad tęstumėte
    var anyMsg=[...document.querySelectorAll('*')].filter(el=>el.children.length<=1 && vis(el) && /kad tęstumėte/i.test(el.textContent||'')).length;
    // item quantities visible
    var itemQ=[...document.querySelectorAll('.mnm_child_products .quantity, .mnm_child_products input.qty')].filter(vis).length;
    // proxy CTA present
    var proxy=[...document.querySelectorAll('.psc-proxy-cta, .psc-cta-slot button')].filter(vis).map(b=>(b.innerText||'').trim().slice(0,30));
    return {container_qty_visible:cq, msg_status_visible:msgVis, any_kad_testumete_visible:anyMsg, item_qty_visible:itemQ, proxy_cta:proxy};
  });
  L('REZULTATAS: '+JSON.stringify(r));
  await d.close(); await b.close();
}catch(e){L('!!! '+e);}
finally{ putText('_boxui2.txt',out); }
})();
