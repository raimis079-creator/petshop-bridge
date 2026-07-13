import { execSync } from "child_process";
import fs from "fs";
import { chromium } from "playwright";
function putBinary(n,buf){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;for(let a=0;a<4;a++){try{const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'x',branch:'main',content:buf.toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pb.json',JSON.stringify(b));const r=execSync('curl -s --max-time 45 -w "\nHTTP:%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pb.json "'+url+'"',{encoding:'utf8',maxBuffer:80000000});if(/HTTP:20[01]/.test(r))return true;}catch(e){}execSync('sleep 2');}return false;}
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'x',branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));execSync('curl -s --max-time 40 -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'});}
let out='';const L=s=>{out+=s+'\n';};
const BASE='https://dev.avesa.lt';const U=process.env.WP_USER||'';const P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const FIX="if ( ! defined( 'ABSPATH' ) ) { return; }\n\n/**\n * Petshop UI Lokalizacija v2\n * Nei\u0161verst\u0173 angli\u0161k\u0173 UI eilu\u010di\u0173 vertimas \u012f lietuvi\u0173.\n * 3 sluoksniai: gettext, gettext_with_context, widget_title (WC/YITH widget antra\u0161t\u0117s).\n * Ple\u010diama: prid\u0117k eilut\u0119 \u012f $map (match pagal originali\u0105 angli\u0161k\u0105 eilut\u0119, tiksl\u0173 case).\n */\nfunction petshop_ui_l10n_map() {\n\treturn array(\n\t\t// WooCommerce widget antra\u0161t\u0117s (shop-sidebar) \u2014 saugomos su did\u017eiosiom\n\t\t'Active Filters'    => 'Aktyv\u016bs filtrai',\n\t\t'Active filters'    => 'Aktyv\u016bs filtrai',\n\t\t'Filter by'         => 'Filtruoti pagal',\n\t\t'Filter by price'   => 'Filtruoti pagal kain\u0105',\n\t\t// YITH Ajax filtras\n\t\t'Clear'             => 'I\u0161valyti',\n\t\t// WooCommerce\n\t\t'Select options'    => 'Pasirinkti',\n\t\t'Add to cart'       => '\u012e krep\u0161el\u012f',\n\t\t'Read more'         => 'Pla\u010diau',\n\t\t// Rinkinio d\u0117\u017e\u0117 (build-a-box)\n\t\t'Clear selections'  => 'I\u0161valyti pasirinkimus',\n\t\t'Clear selection'   => 'I\u0161valyti pasirinkim\u0105',\n\t);\n}\n\nadd_filter( 'gettext', function ( $translation, $text, $domain ) {\n\t$map = petshop_ui_l10n_map();\n\treturn isset( $map[ $text ] ) ? $map[ $text ] : $translation;\n}, 20, 3 );\n\nadd_filter( 'gettext_with_context', function ( $translation, $text, $context, $domain ) {\n\t$map = petshop_ui_l10n_map();\n\treturn isset( $map[ $text ] ) ? $map[ $text ] : $translation;\n}, 20, 4 );\n\n// Widget antra\u0161t\u0117s (WC layered nav filters \u201eActive Filters\" ir kt.) \u2014 neina per gettext\nadd_filter( 'widget_title', function ( $title ) {\n\t$map = petshop_ui_l10n_map();\n\treturn isset( $map[ $title ] ) ? $map[ $title ] : $title;\n}, 20 );\n";
function api(method,path,body){const auth='-u "'+U+':'+P+'"';let cmd;if(body){fs.writeFileSync('/tmp/b.json',JSON.stringify(body));cmd='curl -s -k --max-time 90 -w "\nHTTP:%{http_code}" '+auth+' -X '+method+' -H "Content-Type: application/json" --data-binary @/tmp/b.json "'+BASE+path+'"';}else{cmd='curl -s -k --max-time 60 -w "\nHTTP:%{http_code}" '+auth+' -X '+method+' "'+BASE+path+'"';}let r;try{r=execSync(cmd,{encoding:'utf8',maxBuffer:30000000});}catch(e){r=(e.stdout||'')+'\nHTTP:TIMEOUT';}return{code:(r.match(/HTTP:(\S+)$/)||[])[1]||'?',body:r.replace(/\nHTTP:\S+$/,'')};}
(async()=>{try{
  // update #707
  let u=api('POST','/wp-json/code-snippets/v1/snippets/707',{id:707,name:'Petshop UI Lokalizacija v1',code:FIX,scope:'global',active:true,priority:10});
  L('update 707 http='+u.code);
  execSync('sleep 3');
  const b=await chromium.launch({args:['--no-sandbox']});
  const d=await b.newContext({viewport:{width:1280,height:1100},ignoreHTTPSErrors:true});
  const p=await d.newPage();
  await p.goto(BASE+'/kategorija/katems/vitaminai-ir-papildai-katems/',{waitUntil:'domcontentloaded',timeout:60000});
  await p.waitForTimeout(4000);
  // click filter "Imunitetui ir vitaminai"
  let clicked=false;
  try{
    const el=await p.evaluateHandle(()=>{
      const labels=[...document.querySelectorAll('label, a, .yith-wcan-label, li')];
      return labels.find(l=>/Imunitetui ir vitaminai/i.test(l.textContent||''));
    });
    if(el){ await el.asElement().click(); clicked=true; await p.waitForTimeout(4000); }
  }catch(e){L('click err '+e);}
  L('filter clicked='+clicked);
  // read active filters heading
  const info=await p.evaluate(()=>{
    const texts=[];
    document.querySelectorAll('.widget-title, .widgettitle, .widget_layered_nav_filters .title, h3, h4, .shop-sidebar *').forEach(el=>{
      const t=(el.innerText||'').trim();
      if(t && /aktyv|active filter/i.test(t)) texts.push(t);
    });
    return [...new Set(texts)];
  });
  L('antraštės su aktyv/active: '+JSON.stringify(info));
  putBinary('active_filters_check.png', await p.screenshot({clip:{x:0,y:100,width:520,height:600}})); L('shot ok');
  await d.close(); await b.close();
}catch(e){L('!!! '+e);}
finally{ putText('_afcheck.txt',out); }
})();
