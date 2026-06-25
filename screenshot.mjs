import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}
function readRaw(id){for(let i=0;i<4;i++){try{execSync(`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/${id}?context=edit&_fields=content" -o /tmp/r.json`,{encoding:'utf8',env,maxBuffer:50000000});return (JSON.parse(fs.readFileSync('/tmp/r.json','utf8')).content||{}).raw||'';}catch(e){execSync('sleep 3');}}return null;}
const MARK='<p><strong>\u0160\u0117rimo instrukcija:</strong></p>';
const targets={
 "Mini Chicken & Rice":25403,
 "Mini Senior Chicken & Rice":26435,
 "Mini Senior Salmon":26438,
 "Mini Lamb & Sweet Potato":26884,
 "Mini Lamb":25411,
 "Mini Duck & Potato (fixed)":26296,
 "Mini Salmon & Chicken (fixed)":26901,
 "MiniJunior Duck & Salmon":25387,
 "YoungStar":25439,
 "Kids":27130,
 "HP Junior Sea Fish":26441,
 "Junior Duck & Potato":26925,
 "SensiJunior (done)":26399
};
const out={};
for(const [name,id] of Object.entries(targets)){
  const T=readRaw(id);
  if(T===null){out[name]={id,ERR:"read"};continue;}
  const i=T.lastIndexOf(MARK);
  const seg = i>=0 ? T.slice(i) : "";
  const rows=[...seg.matchAll(/<tr>([\s\S]*?)<\/tr>/g)].map(m=>m[1].replace(/<\/?t[hd]>/g,'|').replace(/\|\|+/g,'|').replace(/^\||\|$/g,'').trim());
  const legacy = /Rekomenduojamas kiekis per par/.test(T) || /Neaktyvus \/ pagyven/.test(T);
  out[name]={id,hasMark:i>=0,legacyEmbed:legacy,rows};
}
commit("audit2_"+Date.now()+".json", JSON.stringify(out,null,2));
console.log("DONE");
