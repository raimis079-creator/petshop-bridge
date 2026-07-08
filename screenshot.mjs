import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putFile(name,str){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'cs',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function get(path){ try{ return execSync('curl -sk -u "$WPU:$WPP" --max-time 50 "'+DEV+path+'"',{encoding:'utf8',maxBuffer:20000000,timeout:55000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; } }
const html=get('/pagrindinis-test/?nc='+Date.now());
const out={};
// istraukiam <style> bloka
const sIdx=html.indexOf('.ph-cat-grid{');
out.style_found=sIdx>=0;
if(sIdx>=0){
  // ar yra <br> ar <p> viduje style?
  const styleChunk=html.slice(sIdx-50, sIdx+800);
  out.br_in_style=(styleChunk.match(/<br/gi)||[]).length;
  out.p_in_style=(styleChunk.match(/<\/?p>/gi)||[]).length;
  out.sample=styleChunk.replace(/\n/g,'\\n').slice(0,500);
}
// ar ph-cat-grid display grid rule pilna?
out.grid_rule=html.indexOf('grid-template-columns:repeat(5,minmax(0,1fr))')>=0;
putFile('checkstyle.json',JSON.stringify(out));
