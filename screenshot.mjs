import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
function putResult(name, obj){
  const isBuf=Buffer.isBuffer(obj);
  const b64=isBuf?obj.toString('base64'):Buffer.from((typeof obj==='string')?obj:JSON.stringify(obj,null,1),'utf8').toString('base64');
  const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;
  const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;
  function getSha(){try{return JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){return '';}}
  function doPut(sha){const body={message:'r',content:b64,branch:'main'};if(sha)body.sha=sha;fs.writeFileSync('/tmp/p_'+name+'.json',JSON.stringify(body));return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/p_'+name+'.json "'+url+'"',{encoding:'utf8'}).trim();}
  let code='';for(let i=0;i<5;i++){const sha=getSha();code=doPut(sha);if(code==='200'||code==='201')return code;execSync('sleep 2');}return 'FAIL:'+code;
}
const TS="1782141485";
const out={};
function cs(method,p,body){ let cmd; if(body){ fs.writeFileSync('/tmp/c.json',JSON.stringify(body)); cmd=`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" -X ${method} -d @/tmp/c.json "https://dev.avesa.lt/wp-json/code-snippets/v1/${p}"`; } else { cmd=`curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" -X ${method} "https://dev.avesa.lt/wp-json/code-snippets/v1/${p}"`; } return JSON.parse(execSync(cmd,{encoding:'utf8',env,maxBuffer:20000000})); }
// 1) maker snippet (sukurti tevine-filtras preset)
const maker=`add_action('init', function(){ if (empty($_GET['ps_make_tevine']) || ($_GET['k']??'')!=='ps2026') return; $ex=get_page_by_path('tevine-filtras', OBJECT, 'yith_wcan_preset'); if($ex){ header('Content-Type: application/json'); echo json_encode(array('exists'=>$ex->ID)); exit; } $pid=wp_insert_post(array('post_title'=>"Tevines kategorijos filtras",'post_name'=>'tevine-filtras','post_status'=>'publish','post_type'=>'yith_wcan_preset')); $brand=array('title'=>"Prek\\xC4\\x97s \\xC5\\xBEenklas",'customize_terms'=>'no','terms'=>array(),'price_ranges'=>array(),'filter_design'=>'select','label_position'=>'below','column_number'=>4,'show_toggle'=>'no','show_search'=>'yes','toggle_style'=>'opened','order_by'=>'name','order'=>'asc','show_count'=>'no','hierarchical'=>'no','multiple'=>'no','relation'=>'and','adoptive'=>'hide','enabled'=>'yes','price_slider_design'=>'slider','price_slider_adaptive_limits'=>'no','price_slider_min'=>0,'price_slider_max'=>100,'price_slider_step'=>1,'order_options'=>array('menu_order'),'show_stock_filter'=>'yes','show_sale_filter'=>'yes','show_featured_filter'=>'no','taxonomy'=>'product_brand','use_all_terms'=>'yes','type'=>'tax'); update_post_meta($pid,'_enabled','yes'); update_post_meta($pid,'_layout','default'); update_post_meta($pid,'_filters',array('1'=>$brand)); header('Content-Type: application/json'); echo json_encode(array('created'=>$pid)); exit; }, 5);`;
let mk=null; try{ const lst=cs('GET','snippets?per_page=100'); if(Array.isArray(lst)){ const e=lst.find(s=>s.name==='TEMP Make Tevine'); if(e) mk=e.id; } }catch(e){}
let mr; if(mk){ mr=cs('PUT','snippets/'+mk,{name:'TEMP Make Tevine',scope:'global',active:true,code:maker}); } else { mr=cs('POST','snippets',{name:'TEMP Make Tevine',scope:'global',active:true,code:maker}); }
out.maker={id:mr.id,active:mr.active};
execSync('sleep 2');
// 2) hit maker endpoint
const mkres=execSync(`curl -sk --max-time 40 "https://dev.avesa.lt/?ps_make_tevine=1&k=ps2026"`,{encoding:'utf8'});
out.make_result=mkres.slice(0,300);
// 3) deploy Kontekstas v14
let php=fs.readFileSync('modules/kontekstas_v14.txt','utf8').replace(/^\uFEFF?<\?php\s*/,'');
const kr=cs('PUT','snippets/332',{ name:'Petshop Filtru Kontekstas v14 [VISADA AKTYVUS]', scope:'global', active:true, code:php });
out.kontekstas={id:kr.id,active:kr.active};
// 4) visual grauzikams
const { chromium } = await import('playwright');
const browser = await chromium.launch({ args:['--no-sandbox','--disable-setuid-sandbox'] });
const ctx = await browser.newContext({ viewport:{ width:1280, height:950 }, ignoreHTTPSErrors:true });
const page = await ctx.newPage();
await page.goto('https://dev.avesa.lt/kategorija/grauzikams/',{ waitUntil:'domcontentloaded', timeout:60000 });
await page.waitForTimeout(4500);
out.dom = await page.evaluate(()=>{ const rc=document.querySelector('.woocommerce-result-count'); const filters=[...document.querySelectorAll('.yith-wcan-filter-title, .widget-title')].map(e=>e.textContent.trim()); return {count_text:rc?rc.textContent.trim():'', filters, has_baltymu: !!document.body.innerText.match(/Baltym\u0173 \u0161altinis/), has_brand: !!document.body.innerText.match(/Prek\u0117s \u017eenklas/)}; });
const png=await page.screenshot({fullPage:false});
out.png=putResult('grbrand_'+TS+'.png', png);
await browser.close();
out.fin=putResult('grbrand_'+TS+'.txt', out);
