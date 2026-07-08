import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putFile(name,str){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'r2',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function code(u){ try{ return execSync('curl -sk -o /dev/null -w "%{http_code}" -u "$WPU:$WPP" -L --max-time 15 "'+DEV+u+'"',{encoding:'utf8',timeout:17000,env:{...process.env,WPU,WPP}}).trim(); }catch(e){ return 'TO'; } }
function get(path){ try{ return execSync('curl -sk -u "$WPU:$WPP" --max-time 20 "'+DEV+path+'"',{encoding:'utf8',maxBuffer:5000000,timeout:22000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; } }
let out='';
out+='=STERILIZUOTAS=\n';
out+='root:'+code('/sterilizuotas-augintinis/')+'\n';
out+='sprendimai:'+code('/sprendimai/sterilizuotas-augintinis/')+'\n';
out+='=SLUGS=\n';
out+='hipo:'+code('/hipoalerginis-maistas/')+'\n';
out+='mono:'+code('/monoproteinis-maistas/')+'\n';
out+='bg:'+code('/be-grudu-maistas/')+'\n';
out+='odai:'+code('/odai-ir-kailiui/')+'\n';
out+='=PAGES=\n';
for(const slug of ['hipoalerginis-maistas','monoproteinis-maistas','be-grudu-maistas','odai-ir-kailiui']){
  const r=get('/wp-json/wp/v2/pages?slug='+slug+'&status=any&_fields=id,slug,status');
  const m=r.match(/"id":(\d+)[^}]*"status":"(\w+)"/);
  out+=slug+':'+(m?('id'+m[1]+'/'+m[2]):'nera')+'\n';
}
out+='=SPREND_HUB=\n'+code('/sprendimai/')+'\n';
out+='=S587=\n';
const s587=get('/wp-json/code-snippets/v1/snippets/587');
for(const slug of ['hipoalerginis-maistas','monoproteinis-maistas','be-grudu-maistas','odai-ir-kailiui','sterilizuotas-augintinis']){
  out+=slug+':'+(s587.indexOf(slug)>=0?'YES':'no')+'\n';
}
putFile('recon2.txt', out);
