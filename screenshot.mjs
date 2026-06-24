import { execSync } from "child_process";
import fs from "fs";
import crypto from "crypto";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const md5=s=>crypto.createHash('md5').update(s,'utf8').digest('hex');
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}
function readRaw(id){for(let i=0;i<4;i++){try{execSync(`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/${id}?context=edit&_fields=content" -o /tmp/r.json`,{encoding:'utf8',env,maxBuffer:50000000});return (JSON.parse(fs.readFileSync('/tmp/r.json','utf8')).content||{}).raw||'';}catch(e){execSync('sleep 3');}}return null;}
function writeRaw(id,content){fs.writeFileSync('/tmp/body.json',JSON.stringify({content}));return execSync(`curl -sk --max-time 45 -o /dev/null -w "%{http_code}" -X PUT -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" -d @/tmp/body.json "https://dev.avesa.lt/wp-json/wp/v2/product/${id}"`,{encoding:'utf8',env,maxBuffer:50000000}).trim();}
const MARK='<p><strong>\u0160\u0117rimo instrukcija:</strong></p>';
const results=[];
// Revert SensiJunior (remove wrong old table)
for(const id of [26399,25237]){
  try{
    const T=readRaw(id); if(T===null){results.push({id,ERR:"read"});continue;}
    const idx=T.lastIndexOf(MARK);
    if(idx<0){results.push({id,NOTE:"no block (jau svarus?)"});continue;}
    let cut=idx; if(T[idx-1]==='\n') cut=idx-1;
    const base=T.slice(0,cut); const oldBlock=T.slice(cut);
    const sm=base.match(/Sud\u0117tis:[\s\S]*?<\/p>/); const analP=base.indexOf("Analitin")>-1;
    if(!sm||!analP){results.push({id,ERR:"base missing sud/anal"});continue;}
    if(!/<table>/.test(oldBlock)){results.push({id,ERR:"oldblock no table"});continue;}
    const wc=writeRaw(id,base); const after=readRaw(id);
    results.push({id,action:"REVERT SensiJunior",write:wc,
      no_serimo:after!==null&&after.lastIndexOf(MARK)<0,
      ver_sud:after!==null&&!!after.match(/Sud\u0117tis:[\s\S]*?<\/p>/),
      ver_anal:after!==null&&after.indexOf("Analitin")>-1,
      lossless:after!==null&&md5(after)===md5(base)});
  }catch(e){results.push({id,ERR:String(e).slice(0,100)});}
}
commit("waveP_"+Date.now()+".json", JSON.stringify(results,null,2));
console.log("DONE");
