import { execSync } from "child_process";
import fs from "fs";
const env={...process.env};
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}

const IDS=[17394,17400,17403,17406,17409,17412,17415,17418,17421];
const base='https://dev.avesa.lt/wp-json/wp/v2/product';
const out={};
function dec(s){return s.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;amp;/g,'&amp;').replace(/&amp;nbsp;/g,'&nbsp;').replace(/&amp;quot;/g,'"').replace(/&amp;#39;/g,"'").replace(/&ndash;/g,'–');}
for(const id of IDS){
  try{
    const r=execSync(`curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" "${base}/${id}?context=edit&_fields=id,title,content"`,{env:{...process.env,WP_PASS_CLEAN:process.env.WP_APP_PASS.replace(/\s+/g,'')},encoding:'utf8',maxBuffer:50000000});
    const j=JSON.parse(r);
    let c=(j.content&&j.content.raw)||'';
    let prev;let it=0;do{prev=c;c=dec(c);it++;}while(prev!==c&&it<5);
    // Extract "Šėrimo rekomendacija" + 1000 simbolių po jo
    const idx=c.search(/Šėrimo\s+(?:instrukcij|rekomendacij)/);
    out[id]={title:(j.title&&j.title.rendered)||'',block:idx>=0?c.substring(idx,idx+1500):'NONE'};
  }catch(e){out[id]={err:String(e).slice(0,100)};}
}
commit('monge_cons.json',JSON.stringify(out,null,1));
console.log("done");
