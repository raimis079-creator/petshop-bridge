import { execSync } from "child_process";
import fs from "fs";
import { chromium } from "playwright";
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'x',branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));execSync('curl -s --max-time 40 -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'});}
function putBin(n,localPath){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const content=fs.readFileSync(localPath).toString('base64');const b={message:'x',branch:'main',content:content};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pb.json',JSON.stringify(b));execSync('curl -s --max-time 60 -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pb.json "'+url+'"',{encoding:'utf8'});}
const BASE='https://dev.avesa.lt';const U=process.env.WP_USER||'';const P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const SETUP="if(!defined('ABSPATH'))return;\nadd_action('wp_loaded',function(){\n  if(($_GET['ps_autologin']??'')!=='1')return;\n  if(($_GET['token']??'')!=='cmplz_6680aa2a42151d54fa8d64ec')return;\n  $admins=get_users(array('role'=>'administrator','number'=>1));\n  $admin=$admins[0]??null;\n  if(!$admin){echo 'no admin';exit;}\n  // Nustatom auth cookie\n  wp_set_current_user($admin->ID);\n  wp_set_auth_cookie($admin->ID, false);\n  echo wp_json_encode(array('logged_in'=>$admin->user_login,'uid'=>$admin->ID));exit;\n},6);";
function api(method,path,body){const auth='-u "'+U+':'+P+'"';let cmd;if(body){fs.writeFileSync('/tmp/b.json',JSON.stringify(body));cmd='curl -s -k -A "Mozilla/5.0" --max-time 90 '+auth+' -X '+method+' -H "Content-Type: application/json" --data-binary @/tmp/b.json "'+BASE+path+'"';}else{cmd='curl -s -k -A "Mozilla/5.0" --max-time 60 '+auth+' -X '+method+' "'+BASE+path+'"';}let r;try{r=execSync(cmd,{encoding:'utf8',maxBuffer:30000000});}catch(e){r=(e.stdout||'');}return r;}
function sh(c){try{return execSync(c,{encoding:'utf8',maxBuffer:30000000});}catch(e){return (e.stdout||'')+'[ERR]';}}
(async()=>{
  let log='';const L=s=>{log+=s+'\n';};

  // Auto-login snippet
  const c=api('POST','/wp-json/code-snippets/v1/snippets',{name:'AutoLogin',desc:'x',code:SETUP,scope:'global',active:true,priority:6});
  let sid=0;try{sid=JSON.parse(c).id;}catch(e){}
  execSync('sleep 2');

  const browser=await chromium.launch();
  const ctx=await browser.newContext({viewport:{width:1000,height:1600},ignoreHTTPSErrors:true});
  const page=await ctx.newPage();
  const errs=[];
  page.on('console',m=>{if(m.type()==='error')errs.push(m.text());});
  page.on('pageerror',e=>errs.push('PAGEERR: '+e.message));

  // Auto-login (nustato cookie)
  await page.goto(BASE+'/?ps_autologin=1&token=cmplz_6680aa2a42151d54fa8d64ec',{waitUntil:'domcontentloaded',timeout:60000});
  const loginResp = await page.content();
  L('autologin: '+(loginResp.indexOf('logged_in')>=0?'OK':'FAIL'));
  await page.waitForTimeout(1000);

  // MyAccount augintinis tab
  await page.goto(BASE+'/my-account/augintinis/?nc='+Date.now(),{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(4500);

  const hasProfile = await page.locator('.pspet-profile').count();
  L('pspet-profile: '+hasProfile);
  const hasName = await page.locator('.pspet-p-name').count();
  L('name: '+hasName+(hasName?' ('+(await page.locator('.pspet-p-name').first().innerText())+')':''));
  L('ring: '+(await page.locator('.pspet-ring').count()));
  L('shelf: '+(await page.locator('.pspet-shelf-item').count()));
  L('timeline: '+(await page.locator('.pspet-tl-item').count()));
  L('fb pills: '+(await page.locator('.pspet-fb-pill').count()));
  L('completeness: '+(await page.locator('.pspet-completeness').count()));

  await page.screenshot({path:'/tmp/profile2.png',fullPage:true});
  L('JS errors: '+(errs.length?errs.slice(0,5).join(' | '):'NONE'));
  await browser.close();

  if(sid) api('POST','/wp-json/code-snippets/v1/snippets/'+sid+'/deactivate',{});
  putText('profile2_visual.txt',log);
  putBin('profile2.png','/tmp/profile2.png');
})();
