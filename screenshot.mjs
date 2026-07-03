import { execSync } from "child_process"; import fs from "fs";
const WP_USER=process.env.WP_USER, WP_PASS=process.env.WP_APP_PASS;
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:30000}); }catch(e){ return 'EXC:'+e.message; } }
var r=exec('curl -sk -m 20 "'+BASE+'/wp-json/wc/v3/products/17920" -H "Authorization: '+AUTH+'"');
try{ var p=JSON.parse(r); console.log(JSON.stringify({permalink:p.permalink, type:p.type, variations:(p.variations||[]).length, price:p.price})); }
catch(e){ console.log('ERR', r.slice(0,200)); }
