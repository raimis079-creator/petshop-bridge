import { execSync } from "child_process";
import fs from "fs";
import crypto from "crypto";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const md5=s=>crypto.createHash('md5').update(s,'utf8').digest('hex');
function commit(name, str){
  const b64=Buffer.from(str,'utf8').toString('base64');
  const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;
  const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;
  let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}
  const body={message:'r',content:b64,branch:'main'};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));
  return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8',maxBuffer:80000000}).trim();
}
const TS=String(Date.now());
function readRaw(id){const r=JSON.parse(execSync(`curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/${id}?context=edit&_fields=content"`,{encoding:'utf8',env,maxBuffer:20000000}));return (r.content&&r.content.raw)||'';}
function writeRaw(id, content){fs.writeFileSync('/tmp/body.json',JSON.stringify({content}));return execSync(`curl -sk --max-time 40 -o /dev/null -w "%{http_code}" -X PUT -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" -d @/tmp/body.json "https://dev.avesa.lt/wp-json/wp/v2/product/${id}"`,{encoding:'utf8',env,maxBuffer:50000000}).trim();}
function extractSerimo(h){const m=h.match(/<p><strong>\u0160\u0117rimo instrukcija[\s\S]*?<\/table>(\s*<p>[\s\S]*?<\/p>)?/);return m?m[0]:null;}

const ser=extractSerimo(readRaw(18154)); // Festival standartine lentele
const targets=[{t:25443,line:"Active Nature"},{t:26423,line:"Active Nature"}];
const results=[];
for(const p of targets){
  try{
    let T=readRaw(p.t);
    if(/<table>/.test(T)){results.push({t:p.t,SKIP:"jau turi lentele"});continue;}
    const sm=T.match(/Sud\u0117tis:[\s\S]*?<\/p>/);const sud_md5=sm?md5(sm[0]):"NONE";
    const am=T.match(/<p><strong>Analitin[\s\S]*?<\/p>\s*<p>[\s\S]*?<\/p>/);
    let newT = am ? T.replace(am[0], am[0]+"\n"+ser) : T.trimEnd()+"\n"+ser+"\n";
    const sm2=newT.match(/Sud\u0117tis:[\s\S]*?<\/p>/);
    if(!(sm2&&md5(sm2[0])===sud_md5) || !/<table>/.test(newT)){results.push({t:p.t,SKIP:"guard"});continue;}
    const wc=writeRaw(p.t,newT);
    const after=readRaw(p.t);
    results.push({t:p.t,line:p.line,write:wc,ver_table:/<table>/.test(after),ver_sud:md5((after.match(/Sud\u0117tis:[\s\S]*?<\/p>/)||[""])[0])===sud_md5,lossless:md5(after)===md5(newT)});
  }catch(e){results.push({t:p.t,ERR:String(e).slice(0,100)});}
}
commit("clone2_"+TS+".json",JSON.stringify(results,null,2));
console.log("DONE "+TS);
