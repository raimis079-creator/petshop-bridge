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
const TS="1782150235";
const out={};
function wc(p){ return JSON.parse(execSync(`curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wc/v3/${p}"`,{encoding:'utf8',env,maxBuffer:20000000})); }
function cs(method,p,body){ let cmd; if(body){ fs.writeFileSync('/tmp/c.json',JSON.stringify(body)); cmd=`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" -X ${method} -d @/tmp/c.json "https://dev.avesa.lt/wp-json/code-snippets/v1/${p}"`; } else { cmd=`curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" -X ${method} "https://dev.avesa.lt/wp-json/code-snippets/v1/${p}"`; } return JSON.parse(execSync(cmd,{encoding:'utf8',env,maxBuffer:20000000})); }
// 1) APPLY Pasaro forma
const fa=execSync(`curl -sk --max-time 90 "https://dev.avesa.lt/?petshop_attr_pasforma=apply&confirm=APPLY&k=ps2026"`,{encoding:'utf8',maxBuffer:10000000});
const fm=fa.match(/Viso:\s*<b>(\d+)<\/b>.*?PARSED:\s*<b>(\d+)<\/b>.*?REVIEW:\s*<b>(\d+)<\/b>/s);
out.forma_apply=fm?{viso:+fm[1],parsed:+fm[2],review:+fm[3],mode:/APPLY<\/h2>/.test(fa)}:'no';
// verify keli
out.verify=[];
for(const id of [18341,18206,18172]){ try{ const p=wc('products/'+id+'?_fields=id,name,attributes'); const zr=(p.attributes||[]).find(a=>a.slug==='pa_zuvies_rusis'); const pf=(p.attributes||[]).find(a=>a.slug==='pa_pasaro_forma'); out.verify.push(id+' '+p.name.slice(0,30)+' | rusis='+(zr?zr.options.join(','):'-')+' | forma='+(pf?pf.options.join(','):'-')); }catch(e){ out.verify.push(id+' ERR'); } }
// 2) maker preset (3 filtrai)
const maker=`add_action('init', function(){ if (empty($_GET['ps_make_zuv']) || ($_GET['k']??'')!=='ps2026') return; $ex=get_page_by_path('akvariumo-zuvu-filtras', OBJECT, 'yith_wcan_preset'); if($ex){ header('Content-Type: application/json'); echo json_encode(array('exists'=>$ex->ID)); exit; } $pid=wp_insert_post(array('post_title'=>"Akvariumo zuvu filtras",'post_name'=>'akvariumo-zuvu-filtras','post_status'=>'publish','post_type'=>'yith_wcan_preset')); $base=array('customize_terms'=>'no','terms'=>array(),'price_ranges'=>array(),'label_position'=>'below','column_number'=>4,'show_toggle'=>'no','show_search'=>'yes','order_by'=>'name','order'=>'asc','show_count'=>'no','hierarchical'=>'no','adoptive'=>'hide','enabled'=>'yes','price_slider_design'=>'slider','price_slider_adaptive_limits'=>'no','price_slider_min'=>0,'price_slider_max'=>100,'price_slider_step'=>1,'order_options'=>array('menu_order'),'show_stock_filter'=>'yes','show_sale_filter'=>'yes','show_featured_filter'=>'no','use_all_terms'=>'yes','type'=>'tax'); $f1=array_merge($base,array('title'=>"\\xC5\\xBDuvies r\\xC5\\xAB\\xC5\\xA1is",'filter_design'=>'checkbox','toggle_style'=>'opened','multiple'=>'yes','relation'=>'or','taxonomy'=>'pa_zuvies_rusis')); $f2=array_merge($base,array('title'=>"Pa\\xC5\\xA1aro forma",'filter_design'=>'checkbox','toggle_style'=>'opened','multiple'=>'yes','relation'=>'or','taxonomy'=>'pa_pasaro_forma')); $f3=array_merge($base,array('title'=>"Prek\\xC4\\x97s \\xC5\\xBEenklas",'filter_design'=>'select','toggle_style'=>'closed','multiple'=>'no','relation'=>'and','taxonomy'=>'product_brand')); update_post_meta($pid,'_enabled','yes'); update_post_meta($pid,'_layout','default'); update_post_meta($pid,'_filters',array('1'=>$f1,'2'=>$f2,'3'=>$f3)); header('Content-Type: application/json'); echo json_encode(array('created'=>$pid)); exit; }, 5);`;
let mk=null; try{ const lst=cs('GET','snippets?per_page=100'); if(Array.isArray(lst)){ const e=lst.find(s=>s.name==='TEMP Make ZUV'); if(e) mk=e.id; } }catch(e){}
let mr; if(mk){ mr=cs('PUT','snippets/'+mk,{name:'TEMP Make ZUV',scope:'global',active:true,code:maker}); } else { mr=cs('POST','snippets',{name:'TEMP Make ZUV',scope:'global',active:true,code:maker}); }
execSync('sleep 2');
out.make=execSync(`curl -sk --max-time 40 "https://dev.avesa.lt/?ps_make_zuv=1&k=ps2026"`,{encoding:'utf8'}).slice(0,160);
// 3) Kontekstas v17
let php=fs.readFileSync('modules/kontekstas_v17.txt','utf8').replace(/^\uFEFF?<\?php\s*/,'');
const kr=cs('PUT','snippets/332',{ name:'Petshop Filtru Kontekstas v17 [VISADA AKTYVUS]', scope:'global', active:true, code:php });
out.kontekstas={id:kr.id,active:kr.active};
execSync('sleep 1');
try{ cs('PUT','snippets/'+mr.id,{active:false}); out.maker_off=true; }catch(e){}
// visual
const { chromium } = await import('playwright');
const browser = await chromium.launch({ args:['--no-sandbox','--disable-setuid-sandbox'] });
const ctx = await browser.newContext({ viewport:{ width:1280, height:1050 }, ignoreHTTPSErrors:true });
const page = await ctx.newPage();
await page.goto('https://dev.avesa.lt/zuvims/akvariumo-zuvyciu-maistas/',{ waitUntil:'domcontentloaded', timeout:60000 });
await page.waitForTimeout(4500);
out.dom = await page.evaluate(()=>{ const rc=document.querySelector('.woocommerce-result-count'); const opts=[...document.querySelectorAll('.yith-wcan-filters .term-name, .yith-wcan-filters label')].map(e=>e.textContent.trim()).filter(Boolean).slice(0,20); return {count_text:rc?rc.textContent.trim():'', has_rusis:!!document.body.innerText.match(/\u017duvies r\u016b\u0161is/), has_forma:!!document.body.innerText.match(/Pa\u0161aro forma/), has_baltymu:!!document.body.innerText.match(/Baltym\u0173 \u0161altinis/), opts}; });
const png=await page.screenshot({fullPage:false});
out.png=putResult('zuvfilter_'+TS+'.png', png);
await browser.close();
out.fin=putResult('zuvfilter_'+TS+'.txt', out);
