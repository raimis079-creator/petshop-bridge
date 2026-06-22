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
const TS="1782142050";
const out={};
function cs(method,p,body){ let cmd; if(body){ fs.writeFileSync('/tmp/c.json',JSON.stringify(body)); cmd=`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" -X ${method} -d @/tmp/c.json "https://dev.avesa.lt/wp-json/code-snippets/v1/${p}"`; } else { cmd=`curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" -X ${method} "https://dev.avesa.lt/wp-json/code-snippets/v1/${p}"`; } return JSON.parse(execSync(cmd,{encoding:'utf8',env,maxBuffer:20000000})); }
// maker preset grauziko-rusis-filtras: Grauziko rusis (checkbox) + brand (select)
const maker=`add_action('init', function(){ if (empty($_GET['ps_make_grr']) || ($_GET['k']??'')!=='ps2026') return; $ex=get_page_by_path('grauziko-rusis-filtras', OBJECT, 'yith_wcan_preset'); if($ex){ header('Content-Type: application/json'); echo json_encode(array('exists'=>$ex->ID)); exit; } $pid=wp_insert_post(array('post_title'=>"Grauziko rusis filtras",'post_name'=>'grauziko-rusis-filtras','post_status'=>'publish','post_type'=>'yith_wcan_preset')); $base=array('customize_terms'=>'no','terms'=>array(),'price_ranges'=>array(),'label_position'=>'below','column_number'=>4,'show_toggle'=>'no','show_search'=>'yes','order_by'=>'name','order'=>'asc','show_count'=>'no','hierarchical'=>'no','adoptive'=>'hide','enabled'=>'yes','price_slider_design'=>'slider','price_slider_adaptive_limits'=>'no','price_slider_min'=>0,'price_slider_max'=>100,'price_slider_step'=>1,'order_options'=>array('menu_order'),'show_stock_filter'=>'yes','show_sale_filter'=>'yes','show_featured_filter'=>'no','use_all_terms'=>'yes','type'=>'tax'); $f1=array_merge($base,array('title'=>"Grau\\xC5\\xBEiko r\\xC5\\xAB\\xC5\\xA1is",'filter_design'=>'checkbox','toggle_style'=>'opened','multiple'=>'yes','relation'=>'or','taxonomy'=>'pa_grauziko_rusis')); $f2=array_merge($base,array('title'=>"Prek\\xC4\\x97s \\xC5\\xBEenklas",'filter_design'=>'select','toggle_style'=>'closed','multiple'=>'no','relation'=>'and','taxonomy'=>'product_brand')); update_post_meta($pid,'_enabled','yes'); update_post_meta($pid,'_layout','default'); update_post_meta($pid,'_filters',array('1'=>$f1,'2'=>$f2)); header('Content-Type: application/json'); echo json_encode(array('created'=>$pid)); exit; }, 5);`;
let mk=null; try{ const lst=cs('GET','snippets?per_page=100'); if(Array.isArray(lst)){ const e=lst.find(s=>s.name==='TEMP Make GRR'); if(e) mk=e.id; } }catch(e){}
let mr; if(mk){ mr=cs('PUT','snippets/'+mk,{name:'TEMP Make GRR',scope:'global',active:true,code:maker}); } else { mr=cs('POST','snippets',{name:'TEMP Make GRR',scope:'global',active:true,code:maker}); }
out.maker_id=mr.id;
execSync('sleep 2');
out.make_result=execSync(`curl -sk --max-time 40 "https://dev.avesa.lt/?ps_make_grr=1&k=ps2026"`,{encoding:'utf8'}).slice(0,200);
// deploy Kontekstas v15
let php=fs.readFileSync('modules/kontekstas_v15.txt','utf8').replace(/^\uFEFF?<\?php\s*/,'');
const kr=cs('PUT','snippets/332',{ name:'Petshop Filtru Kontekstas v15 [VISADA AKTYVUS]', scope:'global', active:true, code:php });
out.kontekstas={id:kr.id,active:kr.active};
// deaktyvuoti maker po naudojimo
execSync('sleep 1');
try{ cs('PUT','snippets/'+mr.id,{active:false}); out.maker_off=true; }catch(e){ out.maker_off='err'; }
// visual pasaras-grauzikams
const { chromium } = await import('playwright');
const browser = await chromium.launch({ args:['--no-sandbox','--disable-setuid-sandbox'] });
const ctx = await browser.newContext({ viewport:{ width:1280, height:1000 }, ignoreHTTPSErrors:true });
const page = await ctx.newPage();
await page.goto('https://dev.avesa.lt/kategorija/grauzikams/pasaras-grauzikams/',{ waitUntil:'domcontentloaded', timeout:60000 });
await page.waitForTimeout(4500);
out.dom = await page.evaluate(()=>{ const rc=document.querySelector('.woocommerce-result-count'); const ft=[...document.querySelectorAll('.yith-wcan-filter-title')].map(e=>e.textContent.trim()); const opts=[...document.querySelectorAll('.yith-wcan-filters .term-name, .yith-wcan-filters label')].map(e=>e.textContent.trim()).slice(0,20); return {count_text:rc?rc.textContent.trim():'', filter_titles:ft, has_rusis: !!document.body.innerText.match(/Grau\u017eiko r\u016b\u0161is/), has_baltymu: !!document.body.innerText.match(/Baltym\u0173 \u0161altinis/), sample_opts:opts}; });
const png=await page.screenshot({fullPage:false});
out.png=putResult('grrfilter_'+TS+'.png', png);
await browser.close();
out.fin=putResult('grrfilter_'+TS+'.txt', out);
