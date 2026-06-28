import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}
function decodeOnce(s){return s.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;amp;/g,'&amp;').replace(/&amp;nbsp;/g,'&nbsp;').replace(/&amp;quot;/g,'"').replace(/&amp;#39;/g,"'");}
function decodeRepeated(s){let prev;let iter=0;do{prev=s;s=decodeOnce(s);iter++;}while(prev!==s&&iter<5);return s;}
const BASE="https://dev.avesa.lt/wp-json";
const out={};
for(const id of [12533,12659,16217,17415]){
  try{
    const j=JSON.parse(execSync(`curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" "${BASE}/wp/v2/product/${id}?context=edit&_fields=id,content,title"`,{env,encoding:'utf8',maxBuffer:200000000}));
    const raw=(j.content&&j.content.raw)||"";
    const decoded=decodeRepeated(raw);
    out[id]={
      title:(j.title&&j.title.rendered)||'',
      rawLen:raw.length,
      decodedLen:decoded.length,
      rawHead:raw.slice(0,500),
      decodedHead:decoded.slice(0,500),
      decodedTail:decoded.slice(-600),
      hasP_raw:/<p>/.test(raw),
      hasP_decoded:/<p>/.test(decoded),
      hasEncodedP:/&lt;p&gt;/.test(decoded),
      hasSerimo:/Šėrimo\s+instrukcij/.test(decoded),
      pTags_count:(decoded.match(/<p[\s>]/g)||[]).length
    };
  }catch(e){out[id]={err:String(e).slice(0,150)};}
}
commit("monge_diag.json",JSON.stringify(out,null,1));
console.log("DONE");
