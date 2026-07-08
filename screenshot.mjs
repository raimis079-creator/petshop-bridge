import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putFile(name,str){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'cu',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function get(path){ try{ return execSync('curl -sk -u "$WPU:$WPP" --max-time 30 "'+DEV+path+'"',{encoding:'utf8',maxBuffer:10000000,timeout:35000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; } }
function code(u){ try{ return execSync('curl -sk -o /dev/null -w "%{http_code}" -u "$WPU:$WPP" -L "'+DEV+u+'"',{encoding:'utf8',timeout:20000,env:{...process.env,WPU,WPP}}).trim(); }catch(e){ return 'EXC'; } }
const out={};
// gaunam tikslu permalink vienos subkategorijos - ar /kategorija/... prefiksas?
const cat=get('/wp-json/wc/v3/products/categories?slug=sampunai-sunims&_fields=id,name,slug').slice(0,300);
out.sample_cat=cat;
// tikrinam abi URL formas 6 subkategorijoms
const slugs=['sampunai-sunims','higienos-priemones-sunims','sukos-sepeciai-zirkles-sunims','antiparazitines-priemones-sunims','vitaminai-ir-papildai-sunims','pirmoji-pagalba-sunims'];
out.urls={};
for(const s of slugs){
  out.urls[s]={
    kategorija: code('/kategorija/'+s+'/'),
    kategorija_sunims: code('/kategorija/sunims/'+s+'/'),
    plain: code('/'+s+'/')
  };
}
putFile('careurls.json',JSON.stringify(out));
