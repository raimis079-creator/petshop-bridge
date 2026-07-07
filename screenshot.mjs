import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
function putFile(name,str){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'gt2',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function wp(path){ try{ return execSync('curl -sk -u "$WPU:$WPP" "'+DEV+path+'"',{encoding:'utf8',maxBuffer:5000000,timeout:30000,env:{...process.env,WPU:process.env.WP_USER,WPP:process.env.WP_APP_PASS}}); }catch(e){ return 'EXC:'+String(e.message||e).slice(0,200); } }
const out={};
const slug='auksciausios-kokybes-sausi-maistai-konservai-sunims-katems-ontario';
out.r1=wp('/wp-json/wp/v2/pages?slug='+slug+'&status=any&_fields=status,slug').slice(0,300);
out.r2=wp('/wp-json/wp/v2/posts?slug='+slug+'&status=any&_fields=status,slug').slice(0,300);
const slug2='miamor-is-meiles-katems';
out.r3=wp('/wp-json/wp/v2/posts?slug='+slug2+'&status=any&_fields=status,slug').slice(0,300);
putFile('gatetest2.json',JSON.stringify(out));
