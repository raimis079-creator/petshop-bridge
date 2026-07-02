import { execSync } from "child_process";
const tok=process.env.GH_TOKEN;
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:20000}); }catch(e){ return 'EXC:'+e.message; } }
const WP_USER=process.env.WP_USER, WP_PASS=process.env.WP_APP_PASS;
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
(async()=>{
  exec('curl -sk -m 15 -o /dev/null -X POST -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" -d \'{"status":"publish"}\' "'+BASE+'/wp-json/wp/v2/pages/34253"');
  exec('curl -sk -m 15 -o /dev/null -X POST -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" -d \'{"status":"publish"}\' "'+BASE+'/wp-json/wp/v2/pages/34254"');
  var html = exec('curl -sk -m 20 "'+BASE+'/sprendimai/isrankus-augintinis/?nc='+Date.now()+'"');
  // rasti platesni konteksta apie NAUJAUSI
  var idx = html.indexOf('NAUJAUSI');
  console.log('NAUJAUSI idx:', idx);
  console.log(html.slice(Math.max(0,idx-800), idx+50));
  exec('curl -sk -m 15 -o /dev/null -X POST -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" -d \'{"status":"draft"}\' "'+BASE+'/wp-json/wp/v2/pages/34254"');
  exec('curl -sk -m 15 -o /dev/null -X POST -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" -d \'{"status":"draft"}\' "'+BASE+'/wp-json/wp/v2/pages/34253"');
})();
