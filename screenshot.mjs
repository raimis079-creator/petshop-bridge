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

// Serimo bloko istraukimas is source
function extractSerimo(h){
  const m=h.match(/<p><strong>\u0160\u0117rimo instrukcija[\s\S]*?<\/table>(\s*<p>[\s\S]*?<\/p>)?/);
  return m?m[0]:null;
}

const pairs=[
  {t:24644,s:27130,line:"Kids"},{t:25471,s:27130,line:"Kids"},{t:25475,s:27130,line:"Kids"},
  {t:26449,s:18154,line:"Festival"},{t:25415,s:18154,line:"Festival"},
  {t:25419,s:27128,line:"Lamb+Rice A/S"},
  {t:21707,s:18051,line:"Leger"}
];
// cache source serimo
const srcCache={};
const results=[];
for(const p of pairs){
  try{
    if(!srcCache[p.s]){ const sh=readRaw(p.s); srcCache[p.s]=extractSerimo(sh); }
    const ser=srcCache[p.s];
    if(!ser){ results.push({t:p.t,line:p.line,SKIP:"source neturi Serimo bloko"}); continue; }
    let T=readRaw(p.t);
    if(/<table>/.test(T)){ results.push({t:p.t,line:p.line,SKIP:"jau turi lentele"}); continue; }
    const sm=T.match(/Sud\u0117tis:[\s\S]*?<\/p>/); const sud_md5=sm?md5(sm[0]):"NONE";
    // iterpiu po Analitiniu bloko; jei nera - prie galo
    let newT;
    const am=T.match(/<p><strong>Analitin[\s\S]*?<\/p>\s*<p>[\s\S]*?<\/p>/);
    if(am){ newT=T.replace(am[0], am[0]+"\n"+ser); }
    else { newT=T.trimEnd()+"\n"+ser+"\n"; }
    // guards
    const sm2=newT.match(/Sud\u0117tis:[\s\S]*?<\/p>/);
    const sudOk = sm2 && md5(sm2[0])===sud_md5;
    const tableOk = /<table>/.test(newT);
    if(!sudOk || !tableOk){ results.push({t:p.t,line:p.line,SKIP:"guard fail",sudOk,tableOk}); continue; }
    const wc=writeRaw(p.t,newT);
    // verify
    const after=readRaw(p.t);
    const ver_table=/<table>/.test(after);
    const ver_sud = (after.match(/Sud\u0117tis:[\s\S]*?<\/p>/)||[""])[0];
    const ver_sud_ok = md5(ver_sud)===sud_md5;
    const lossless = md5(after)===md5(newT);
    results.push({t:p.t,line:p.line,write:wc,ver_table,ver_sud_ok,lossless,len:after.length});
  }catch(e){ results.push({t:p.t,line:p.line,ERR:String(e).slice(0,120)}); }
}
commit("clone1_"+TS+".json", JSON.stringify(results,null,2));
console.log("DONE "+TS);
