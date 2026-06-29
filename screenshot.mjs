import { execSync } from "child_process";
import fs from "fs";
const env={...process.env};
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}

// Atsisiusti naują kodą iš GH
const codeUrl=`https://api.github.com/repos/${repo}/contents/screenshots/snippet_512_v6.php?ref=main&t=${Date.now()}`;
const codeRes=execSync(`curl -sL -H "Authorization: Bearer ${tok}" "${codeUrl}"`,{encoding:'utf8',maxBuffer:200000000});
const codeJ=JSON.parse(codeRes);
const newCode=Buffer.from(codeJ.content,'base64').toString('utf-8');
console.log("New code length:",newCode.length);

const env2={...process.env,WP_PASS_CLEAN:(process.env.WP_APP_PASS||'').replace(/\s+/g,'')};

// Pirma - paimkim dabartinį snippet'ą (kad žinotume status)
const cur=execSync(`curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/512"`,{env:env2,encoding:'utf8',maxBuffer:200000000});
const curJ=JSON.parse(cur);
console.log("Current name:",curJ.name);

// Bandykim POST atnaujinti
const payload={
  id:512,
  name:'Petshop Aprasymu Accordion v6 (LIVE, palaikymas senoms antrastems)',
  code:newCode,
  desc:'Globalus accordion - Aprašymas išskleistas, kiti sutraukti. Palaiko Animondą/Monge konservus (Analitinė sudėtis, Šėrimo rekomendacija)',
  active:true,
  scope:'global',
  tags:[],
};
fs.writeFileSync('/tmp/payload.json',JSON.stringify(payload));

// Bandykim įvairius HTTP methods - POST/PUT
const tries=[
  ['POST','https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/512'],
  ['PUT','https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/512'],
  ['POST','https://dev.avesa.lt/wp-json/code-snippets/v1/snippets'],
];
const results={};
for(const [method,url] of tries){
  try{
    const r=execSync(`curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" -X ${method} -H "Content-Type: application/json" -d @/tmp/payload.json "${url}"`,{env:env2,encoding:'utf8',maxBuffer:200000000});
    results[`${method} ${url}`]=r.substring(0,400);
  }catch(e){results[`${method} ${url}`]='ERR:'+e.message.slice(0,100);}
}

commit('snippet_update_result.json',JSON.stringify(results,null,1));
console.log("done");
