import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){
  const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;
  let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}
  const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;
  fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));
  return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8',maxBuffer:80000000}).trim();
}
// fetch snippet 512 via WP code-snippets REST
let raw="";
for(let i=0;i<4;i++){try{execSync(`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/512?context=edit" -o /tmp/s.json`,{encoding:'utf8',env,maxBuffer:50000000});raw=fs.readFileSync('/tmp/s.json','utf8');break;}catch(e){execSync('sleep 3');}}
let obj={};try{obj=JSON.parse(raw);}catch(e){}
const code=obj.code||"";
const out={id:obj.id,name:obj.name,active:obj.active,scope:obj.scope,len:code.length,
  has_media:/@media/.test(code),
  has_overflow:/overflow-x/.test(code),
  // find anchor points
  style_markers:(code.match(/<style[^>]*>/g)||[]).length,
  css_tail:code.slice(code.indexOf('.ps-desc'), code.indexOf('.ps-desc')+1200)
};
commit("snip512_recon.json", JSON.stringify(out,null,2));
// also stash full code for next step
commit("snip512_code.txt", code);
console.log("DONE len="+code.length);
