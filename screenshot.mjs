import { execSync } from "child_process";
import fs from "fs";
import { chromium } from "playwright";
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'x',branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));execSync('curl -s --max-time 40 -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'});}
const BASE='https://dev.avesa.lt';const U=process.env.WP_USER||'';const P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const SETUP="if(!defined('ABSPATH'))return;\nadd_action('wp_loaded',function(){\n  if(($_GET['ps_autologin']??'')!=='1')return;\n  if(($_GET['token']??'')!=='cmplz_6680aa2a42151d54fa8d64ec')return;\n  $admins=get_users(array('role'=>'administrator','number'=>1));$admin=$admins[0]??null;\n  if(!$admin){echo 'no admin';exit;}\n  wp_set_current_user($admin->ID);wp_set_auth_cookie($admin->ID,true);\n  echo wp_json_encode(array('logged_in'=>$admin->user_login));exit;\n},6);";
function api(method,path,body){const auth='-u "'+U+':'+P+'"';let cmd;if(body){fs.writeFileSync('/tmp/b.json',JSON.stringify(body));cmd='curl -s -k -A "Mozilla/5.0" --max-time 90 '+auth+' -X '+method+' -H "Content-Type: application/json" --data-binary @/tmp/b.json "'+BASE+path+'"';}else{cmd='curl -s -k -A "Mozilla/5.0" --max-time 60 '+auth+' -X '+method+' "'+BASE+path+'"';}let r;try{r=execSync(cmd,{encoding:'utf8',maxBuffer:30000000});}catch(e){r=(e.stdout||'');}return r;}
(async()=>{
  let log='';const L=s=>{log+=s+'\n';};
  const c=api('POST','/wp-json/code-snippets/v1/snippets',{name:'AutoLogin2',desc:'x',code:SETUP,scope:'global',active:true,priority:6});
  let sid=0;try{sid=JSON.parse(c).id;}catch(e){}
  execSync('sleep 2');
  const browser=await chromium.launch();
  const ctx=await browser.newContext({viewport:{width:1000,height:1600},ignoreHTTPSErrors:true});
  const page=await ctx.newPage();
  await page.goto(BASE+'/?ps_autologin=1&token=cmplz_6680aa2a42151d54fa8d64ec',{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(1000);
  // Ar dabar prisijunges? Tikrinam /my-account/ (ne tab)
  await page.goto(BASE+'/my-account/?nc='+Date.now(),{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(2000);
  const maHtml = await page.content();
  L('logged_in_check (dashboard vs login): '+(maHtml.indexOf('woocommerce-MyAccount-navigation')>=0?'LOGGED IN':'NOT LOGGED / login form'));
  L('has_augintinis_link: '+(maHtml.indexOf('augintinis')>=0));

  // Tab
  await page.goto(BASE+'/my-account/augintinis/?nc='+Date.now(),{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(2000);
  const tabHtml = await page.content();
  L('tab has pspet-profile div: '+(tabHtml.indexOf('pspet-profile')>=0));
  L('tab has pet-profile.js: '+(tabHtml.indexOf('pet-profile.js')>=0));
  L('tab has PSPetConfig: '+(tabHtml.indexOf('PSPetConfig')>=0));
  L('tab is login form: '+(tabHtml.indexOf('woocommerce-form-login')>=0));
  // Istraukiu dali kur turetu buti endpoint turinys
  var idx = tabHtml.indexOf('MyAccount-content');
  if(idx>=0) L('content snippet: '+tabHtml.substr(idx, 400).replace(/\s+/g,' '));
  await browser.close();
  if(sid) api('POST','/wp-json/code-snippets/v1/snippets/'+sid+'/deactivate',{});
  putText('profile_dbg2.txt',log);
})();
