import { execSync } from "child_process";
import fs from "fs";
const env={...process.env};
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}

// Check several SKU: Animonda, Real Dog, Monge - patikrinkim, kokias antraštes turi
const IDS=[19479,19574,14276,12660,12586,17394];
const env2={...process.env,WP_PASS_CLEAN:(process.env.WP_APP_PASS||'').replace(/\s+/g,'')};
function dec(s){return s.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;amp;/g,'&amp;').replace(/&amp;nbsp;/g,'&nbsp;');}

const out={};
const sections=['Sudėtis','Analitinės sudedamosios dalys','Analitinė sudėtis','Priedai','Šėrimo instrukcija','Šėrimo rekomendacija','Įspėjimai','Pagaminta'];
for(const id of IDS){
  try{
    const r=execSync(`curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/${id}?context=edit&_fields=id,title,content"`,{env:env2,encoding:'utf8',maxBuffer:50000000});
    const j=JSON.parse(r);
    let c=(j.content&&j.content.raw)||'';
    let prev;let it=0;do{prev=c;c=dec(c);it++;}while(prev!==c&&it<5);
    const presence={};
    for(const s of sections){
      // ieškokim su <strong> arba be
      const r1=c.includes(`<strong>${s}`);
      const r2=c.includes(`<strong>${s}:`);
      const r3=new RegExp(`\\b${s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}\\b`,'i').test(c);
      presence[s]={strong:r1||r2,anywhere:r3};
    }
    out[id]={title:(j.title&&j.title.rendered)||'',sections:presence};
  }catch(e){out[id]={err:String(e).slice(0,80)};}
}
commit('sec_check.json',JSON.stringify(out,null,1));
console.log("done");
