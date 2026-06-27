import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}
const BASE="https://dev.avesa.lt/wp-json";
function cj(u){try{execSync(`curl -sk --max-time 50 -u "$WP_USER:$WP_PASS_CLEAN" "${u}" -o /tmp/r.json`,{env,maxBuffer:200000000});return JSON.parse(fs.readFileSync('/tmp/r.json','utf8'));}catch(e){return {err:String(e).slice(0,120)};}}
const out={};
function cnt(s,sub){return (s.split(sub).length-1);}
for(const id of [14535,14794]){
  const j=cj(`${BASE}/wp/v2/product/${id}?context=edit&_fields=id,content`);
  const raw=(j.content&&j.content.raw)||"";
  const i=raw.indexOf('Šėrimo');
  out[id]={
    len:raw.length,
    real_open_p:cnt(raw,'<p>'), real_close_p:cnt(raw,'</p>'),
    enc_open_p:cnt(raw,'&lt;p&gt;'), enc_close_p:cnt(raw,'&lt;/p&gt;'),
    real_table:cnt(raw,'<table'), enc_table:cnt(raw,'&lt;table'),
    around_serimo: i>=0?raw.slice(i-30,i+120):'(no Šėrimo)',
    tail: raw.slice(-300)
  };
}
commit("farmina_enc.json",JSON.stringify(out,null,1));
console.log("ENC DONE");
