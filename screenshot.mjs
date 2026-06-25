import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}
function readRaw(id){for(let i=0;i<4;i++){try{execSync(`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/${id}?context=edit&_fields=content,slug,link" -o /tmp/r.json`,{encoding:'utf8',env,maxBuffer:50000000});const j=JSON.parse(fs.readFileSync('/tmp/r.json','utf8'));return {raw:(j.content||{}).raw||'',slug:j.slug,link:j.link};}catch(e){execSync('sleep 3');}}return null;}
const MARK='<p><strong>\u0160\u0117rimo instrukcija:</strong></p>';
const targets={
 "Duck & Potato (A/S)":26407,
 "M/M Chicken & Rice":25233,
 "M/M Chicken & Sweet Potato":25479,
 "FiestaPlus":25229,
 "M/M Duck & Sweet Potato":26362,
 "adult Lamb & Sweet Potato":20445
};
const out={};
for(const [name,id] of Object.entries(targets)){
  const r=readRaw(id);
  if(!r){out[name]={id,ERR:"read"};continue;}
  const T=r.raw; const i=T.lastIndexOf(MARK);
  let tbl = i>=0 ? T.slice(i).replace(/<\/p>[\s\S]*$/,m=>m.length>400?'</p>...':m) : "(NO MARK / no table)";
  // strip to table rows for compactness: extract all <td>...</td> sequences in table
  const rows=[...T.slice(i>=0?i:0).matchAll(/<tr>([\s\S]*?)<\/tr>/g)].map(m=>m[1].replace(/<\/?t[hd]>/g,'|').replace(/\|\|+/g,'|').replace(/^\||\|$/g,'').trim());
  out[name]={id,slug:r.slug,hasMark:i>=0,rows};
}
commit("audit1_"+Date.now()+".json", JSON.stringify(out,null,2));
console.log("DONE");
