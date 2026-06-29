import { execSync } from "child_process";
import fs from "fs";
import { chromium } from "playwright";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const WP_USER=process.env.WP_USER, WP_PASS=process.env.WP_APP_PASS;
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
function putBin(name,buf){
  const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;
  let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){}
  const body={message:'r',branch:'main',content:buf.toString('base64')}; if(sha) body.sha=sha;
  fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));
  execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'});
}
function call(method, path, bodyObj){
  let cmd='curl -sk -X '+method+' -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" -H "Accept: application/json"';
  if(bodyObj!==undefined){ fs.writeFileSync('/tmp/b.json', JSON.stringify(bodyObj)); cmd+=' -d @/tmp/b.json'; }
  cmd+=' "'+BASE+path+'"';
  let raw=''; try{ raw=execSync(cmd,{encoding:'utf8',maxBuffer:300000000}); }catch(e){ return {__exc:String(e).slice(0,150)}; }
  try{ return JSON.parse(raw); }catch(e){ return {__pe:true, raw:raw.slice(0,200)}; }
}
const CSS_A = '#menu-item-34126{border-left:2px solid #e2e2e2;padding-left:20px !important;margin-left:12px;} #menu-item-34126>a,#menu-item-34127>a,#menu-item-34128>a{font-weight:700 !important;} #menu-item-34128>a::after{content:"";display:inline-block;width:7px;height:7px;border-radius:50%;background:#e8830c;margin-left:7px;vertical-align:middle;}';
const CSS_B = '#menu-item-34126{border-left:2px solid #e2e2e2;padding-left:16px !important;margin-left:10px;} #menu-item-34126>a{font-weight:700 !important;background:#eef4f0;border-radius:6px;padding-top:4px !important;padding-bottom:4px !important;} #menu-item-34127>a{font-weight:700 !important;} #menu-item-34128>a{font-weight:700 !important;} #menu-item-34128>a::after{content:"";display:inline-block;width:7px;height:7px;border-radius:50%;background:#e8830c;margin-left:7px;vertical-align:middle;}';
const mkCode = (css) => "add_action('wp_head', function(){ if(is_admin()) return; echo '<style id=\"ps-menu-group\">"+css+"</style>'; });";

const log={ts:new Date().toISOString(), steps:{}};
// create snippet (front-end) with A
const cr = call('POST','/wp-json/code-snippets/v1/snippets', {name:'Petshop Meniu Grupavimas v1 (komerciniai 3)', desc:'A/B test menu group styling', code:mkCode(CSS_A), scope:'front-end', active:false, priority:99});
const sid = cr && cr.id ? cr.id : null;
log.steps.create={id:sid, err:(cr&&(cr.__exc||cr.code))||null};

(async()=>{
  if(!sid){ putBin('menu_ab_log.json'); fs.writeFileSync('/tmp/x',''); console.log('NO ID'); return; }
  call('POST','/wp-json/code-snippets/v1/snippets/'+sid+'/activate', {});

  const browser=await chromium.launch({args:['--no-sandbox']});
  const ctx=await browser.newContext({ignoreHTTPSErrors:true, viewport:{width:1440,height:900}, userAgent:'Mozilla/5.0'});
  const page=await ctx.newPage();

  // VARIANT A
  await page.goto('https://dev.avesa.lt/?nocache='+Date.now(), {waitUntil:'networkidle', timeout:60000});
  await page.waitForTimeout(2000);
  putBin('variant_A.png', await page.screenshot({clip:{x:0,y:95,width:1440,height:75}}));

  // switch to B
  call('POST','/wp-json/code-snippets/v1/snippets/'+sid, {code:mkCode(CSS_B)});
  await page.goto('https://dev.avesa.lt/?nocache='+Date.now(), {waitUntil:'networkidle', timeout:60000});
  await page.waitForTimeout(2000);
  putBin('variant_B.png', await page.screenshot({clip:{x:0,y:95,width:1440,height:75}}));

  // leave A live
  call('POST','/wp-json/code-snippets/v1/snippets/'+sid, {code:mkCode(CSS_A)});

  log.steps.final='variant A live; snippet id '+sid;
  // commit log via a tiny put using putBin trick (text)
  fs.writeFileSync('/tmp/log.txt', JSON.stringify(log));
  await ctx.close(); await browser.close();
  // commit log as json
  const url='https://api.github.com/repos/'+repo+'/contents/screenshots/menu_ab_log.json';
  let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){}
  const body={message:'r',branch:'main',content:Buffer.from(JSON.stringify(log,null,1),'utf8').toString('base64')}; if(sha) body.sha=sha;
  fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));
  execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'});
  console.log("DONE sid="+sid);
})();
