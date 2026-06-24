import { execSync } from "child_process";
import fs from "fs";
import crypto from "crypto";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const md5=s=>crypto.createHash('md5').update(s,'utf8').digest('hex');
function commit(name, str){
  const b64=Buffer.from(str,'utf8').toString('base64');const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;
  const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;
  let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}
  const body={message:'r',content:b64,branch:'main'};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));
  return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8',maxBuffer:80000000}).trim();
}
const TS=String(Date.now());
function readRaw(id){
  for(let i=0;i<4;i++){
    try{
      execSync(`curl -sk --max-time 45 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/${id}?context=edit&_fields=content" -o /tmp/r${id}.json`,{encoding:'utf8',env,maxBuffer:50000000});
      const r=JSON.parse(fs.readFileSync('/tmp/r'+id+'.json','utf8'));
      return (r.content&&r.content.raw)||'';
    }catch(e){ execSync('sleep 3'); }
  }
  return null;
}
function writeRaw(id, content){fs.writeFileSync('/tmp/body.json',JSON.stringify({content}));return execSync(`curl -sk --max-time 45 -o /dev/null -w "%{http_code}" -X PUT -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" -d @/tmp/body.json "https://dev.avesa.lt/wp-json/wp/v2/product/${id}"`,{encoding:'utf8',env,maxBuffer:50000000}).trim();}

const results=[];
for(const id of [17978,18046,17995]){
  try{
    let h=readRaw(id);
    if(h===null){ results.push({id,ERR:"skaitymas nepavyko po 4 bandymu"}); continue; }
    const marker='<p><strong>\u0160\u0117rimo instrukcija:</strong></p>';
    const idx=h.lastIndexOf(marker);
    if(idx<0){ results.push({id,SKIP:"mano marker nerastas (gal jau pataisyta)"}); continue; }
    let newH=h.slice(0,idx).replace(/\s+$/,'');
    const myTableGone = newH.indexOf('<th>\u0160uns svoris</th>')<0;
    const shorter = newH.length < h.length;
    if(!myTableGone || !shorter){ results.push({id,SKIP:"guard",myTableGone,shorter}); continue; }
    const wc=writeRaw(id,newH);
    const after=readRaw(id);
    results.push({id,write:wc,
      removed_chars:h.length-newH.length,
      my_table_gone: after!==null && after.indexOf('<th>\u0160uns svoris</th>')<0,
      old_text_stays: after!==null && /(\u0160\u0117rimo rekomendacija|Vienam gyv\u016bnui rekomenduojamas)/i.test(after),
      lossless: after!==null && md5(after)===md5(newH)});
  }catch(e){ results.push({id,ERR:String(e).slice(0,100)}); }
}
commit("dupfix2_"+TS+".json", JSON.stringify(results,null,2));
console.log("DONE "+TS);
