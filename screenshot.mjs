import { execSync } from "child_process";
import fs from "fs";
const env={...process.env};
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}

// Žinom, kad sutvarkyti: 19479, 19574, 19500 (Animonda); 14276, 12828 (Real Dog); kelios Monge
const SPOT_IDS=[19479,19574,19500,19602,19355,19708,14276,12828,14279,12586,12660,12663,17394,17400,19526,17735];
const env2={...process.env,WP_PASS_CLEAN:(process.env.WP_APP_PASS||'').replace(/\s+/g,'')};

const out={};
for(const id of SPOT_IDS){
  try{
    const r=execSync(`curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/${id}?context=edit&_fields=id,title,content"`,{env:env2,encoding:'utf8',maxBuffer:50000000});
    const j=JSON.parse(r);
    const c=(j.content&&j.content.raw)||'';
    out[id]={
      title:(j.title&&j.title.rendered)||'',
      cLen:c.length,
      hasB2B:c.includes('b2b-black'),
      hasShaltinis:/Šaltinis:\s*gamintojo/i.test(c),
      hasSerim:/Šėrim/i.test(c),
      hasTable:/<table/i.test(c)
    };
  }catch(e){out[id]={err:String(e).slice(0,100)};}
}
commit('diag_spot.json',JSON.stringify(out,null,1));
console.log("done");
