import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putFile(name,str){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'gt',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function wp(path){ try{ return execSync('curl -sk -u "$WPU:$WPP" "'+DEV+path+'"',{encoding:'utf8',maxBuffer:5000000,timeout:30000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC:'+String(e.message||e).slice(0,150); } }
const out={};
out.raw_pages=wp('/wp-json/wp/v2/pages?slug=jorksyro-terjeras&status=any&_fields=status,slug').slice(0,500);
out.raw_posts=wp('/wp-json/wp/v2/posts?slug=miamor-is-meiles-katems&status=any&_fields=status,slug').slice(0,500);
out.user=process.env.WPU||'MISSING';
out.pass_len=(process.env.WPP||'').length;
putFile('gatetest.json',JSON.stringify(out));
