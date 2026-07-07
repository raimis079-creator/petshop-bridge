import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putFile(name,str){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'cs',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function wp(path){ try{ return execSync('curl -sk -u "$WPU:$WPP" "'+DEV+path+'"',{encoding:'utf8',maxBuffer:20000000,timeout:50000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; } }
// ieskom bet kokio statuso (publish+draft) - ar produktas apskritai yra kataloge
const terms=['sepija','athena','sensiplus','josera salmon','josera lamb','josera festival','kepenys','kiaules snipas','jaucio penis','gimcat','trixie kilimelis purvui','miamor kremas'];
const out={};
for(const t of terms){
  const r=wp('/wp-json/wc/v3/products?search='+encodeURIComponent(t)+'&status=any&per_page=10&_fields=id,slug,name,status,stock_status');
  let a; try{ a=JSON.parse(r); }catch(e){ a=[]; }
  out[t]=(Array.isArray(a)?a:[]).map(p=>({slug:p.slug,name:(p.name||'').slice(0,55),status:p.status,stock:p.stock_status}));
}
putFile('catsearch.json',JSON.stringify(out));
