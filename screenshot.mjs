import { execSync } from "child_process";
import fs from "fs";
import { chromium } from "playwright";
function putBinary(n,buf){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;for(let a=0;a<4;a++){try{const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'pf '+n,branch:'main',content:buf.toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pb.json',JSON.stringify(b));const r=execSync('curl -s --max-time 45 -w "\nHTTP:%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pb.json "'+url+'"',{encoding:'utf8',maxBuffer:80000000});if(/HTTP:20[01]/.test(r))return true;}catch(e){}execSync('sleep 2');}return false;}
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'pf '+n,branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));execSync('curl -s --max-time 40 -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'});}
let out='';const L=s=>{out+=s+'\n';console.log(s);};
const BASE='https://dev.avesa.lt';const U=process.env.WP_USER||'';const P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const PHP="if ( ! defined('ABSPATH') ) { return; }\nadd_action('wp_loaded', function(){\n  if ( ! isset($_GET['ps_widclear']) ) { return; }\n  $tok = isset($_GET['token']) ? sanitize_text_field(wp_unslash($_GET['token'])) : '';\n  if ( $tok !== 'cmplz_6680aa2a42151d54fa8d64ec' ) { return; }\n  $confirm = isset($_GET['confirm']) && $_GET['confirm']==='CLEAR_FOOTER1';\n  $sw = get_option('sidebars_widgets');\n  $before = isset($sw['sidebar-footer-1']) ? $sw['sidebar-footer-1'] : array();\n  $result = array('before_footer1'=>$before,'applied'=>false);\n  if($confirm && is_array($before) && count($before)){\n    // backup once\n    if(!get_option('ps_sidebars_widgets_backup')){\n      update_option('ps_sidebars_widgets_backup', $sw, false);\n      $result['backup']='sukurtas';\n    } else { $result['backup']='jau_buvo'; }\n    if(!isset($sw['wp_inactive_widgets'])||!is_array($sw['wp_inactive_widgets'])) $sw['wp_inactive_widgets']=array();\n    $sw['wp_inactive_widgets']=array_merge($sw['wp_inactive_widgets'], $before);\n    $sw['sidebar-footer-1']=array();\n    update_option('sidebars_widgets', $sw);\n    $result['applied']=true;\n    $result['after_footer1']=array();\n  }\n  header('Content-Type: application/json; charset=utf-8');\n  echo wp_json_encode($result, JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES);\n  exit;\n}, 6);";
function api(method,path,body){const auth='-u "'+U+':'+P+'"';let cmd;if(body){fs.writeFileSync('/tmp/b.json',JSON.stringify(body));cmd='curl -s -k --max-time 90 -w "\nHTTP:%{http_code}" '+auth+' -X '+method+' -H "Content-Type: application/json" --data-binary @/tmp/b.json "'+BASE+path+'"';}else{cmd='curl -s -k --max-time 60 -w "\nHTTP:%{http_code}" '+auth+' -X '+method+' "'+BASE+path+'"';}let r;try{r=execSync(cmd,{encoding:'utf8',maxBuffer:30000000});}catch(e){r=(e.stdout||'')+'\nHTTP:TIMEOUT';}return{code:(r.match(/HTTP:(\S+)$/)||[])[1]||'?',body:r.replace(/\nHTTP:\S+$/,'')};}
function chk(u){try{const r=execSync('curl -s -k --max-time 30 "'+u+'"',{encoding:'utf8',maxBuffer:30000000});return r;}catch(e){return '';}}
function has(b,t){return b.indexOf(t)>-1;}
(async()=>{let id=0;try{
  const c=api('POST','/wp-json/code-snippets/v1/snippets',{name:'Petshop WidClear tmp',desc:'token clear footer1',code:PHP,scope:'global',active:true,priority:10});
  try{id=JSON.parse(c.body).id;}catch(e){}
  L('id='+id); if(!id){L('fail '+c.body.slice(0,200));putText('_widclear.txt',out);return;}
  execSync('sleep 2');
  const r=execSync('curl -s -k --max-time 45 "'+BASE+'/?ps_widclear=1&confirm=CLEAR_FOOTER1&token=cmplz_6680aa2a42151d54fa8d64ec"',{encoding:'utf8'});
  L('CLEAR: '+r.slice(0,300));
  execSync('sleep 2');
  // verify text absence
  const sun=chk(BASE+'/kategorija/sunims/');
  L('/sunims/ Naujausi='+has(sun,'>Naujausi<')+' Populiariausi='+has(sun,'Populiariausi')+' GeriausiaiIvert='+has(sun,'Geriausiai įvertinti'));
  const child=chk(BASE+'/kategorija/maistas-sunims/');
  L('/maistas-sunims/ Populiariausi='+has(child,'Populiariausi')+' Geriausiai='+has(child,'Geriausiai įvertinti'));
  const hp=chk(BASE+'/');
  L('/home/ Populiariausi='+has(hp,'Populiariausi')+' Geriausiai='+has(hp,'Geriausiai įvertinti'));
  // screenshot sunims full
  const b=await chromium.launch({args:['--no-sandbox']});
  const d=await b.newContext({viewport:{width:1280,height:1000},ignoreHTTPSErrors:true});
  const pg=await d.newPage(); await pg.goto(BASE+'/kategorija/sunims/',{waitUntil:'domcontentloaded',timeout:60000}); await pg.waitForTimeout(3500);
  putBinary('landing_after_clear.png', await pg.screenshot({fullPage:true})); L('shot ok');
  await d.close(); await b.close();
}catch(e){L('!!! '+e);}
finally{ if(id){api('POST','/wp-json/code-snippets/v1/snippets/'+id+'/deactivate',{});L('deact '+id);} putText('_widclear.txt',out+'\nID='+id); }
})();
