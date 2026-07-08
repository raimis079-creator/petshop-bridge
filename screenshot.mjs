import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putFile(name,str){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'dc',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function api(p){ try{ return execSync('curl -sk -u "$WPU:$WPP" --max-time 25 "'+DEV+p+'"',{encoding:'utf8',maxBuffer:20000000,timeout:27000,env:{...process.env,WPU,WPP}}); }catch(e){ return ''; } }
let out='';
for(const id of [34570, 34574, 34576]){
  const r = api('/wp-json/wp/v2/pages/'+id+'?context=edit&_fields=id,slug,status,date,modified,content,link');
  try{
    const j = JSON.parse(r);
    const raw = (j.content && j.content.raw) || '';
    out += 'id='+j.id+' slug='+j.slug+' status='+j.status+'\n';
    out += '  link: '+j.link+'\n';
    out += '  created: '+j.date+' modified: '+j.modified+'\n';
    out += '  content len: '+raw.length+'\n';
    out += '  has petshop-landing: '+(raw.indexOf('petshop-landing')>=0)+'\n';
    out += '  has "Ko reikia pradžiai": '+(raw.indexOf('Ko reikia prad')>=0)+'\n';
    out += '\n';
  }catch(e){ out += 'id='+id+' PARSE ERR: '+r.slice(0,120)+'\n\n'; }
}
// kur veda /naujas-augintinis/
try{
  const eff = execSync('curl -sk -o /dev/null -w "code=%{http_code} eff=%{url_effective}" -u "$WPU:$WPP" -L --max-time 15 "'+DEV+'/naujas-augintinis/"',{encoding:'utf8',timeout:17000,env:{...process.env,WPU,WPP}});
  out += '/naujas-augintinis/ → '+eff+'\n';
}catch(e){}
putFile('dupcheck.txt', out);
