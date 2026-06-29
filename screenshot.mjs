import { execSync } from "child_process";
import fs from "fs";
const env={...process.env};
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}

// 64 publish SKU - sausi konservai ir skanestai
const IDS=[19708,19692,19685,19672,19620,19613,19609,19602,19598,19594,19590,19586,19582,19578,19574,19570,19566,19562,19557,19553,19549,19545,19542,19538,19534,19530,19526,19520,19516,19513,19508,19504,19500,19496,19492,19488,19483,19479,19475,19471,19452,19449,19446,19440,19425,19417,19414,19411,19408,19405,19399,19396,19393,19387,19381,19366,19361,19358,19355,19321,19318,19315,19312,17735];
const base='https://dev.avesa.lt/wp-json/wp/v2/product';
const env2={...process.env,WP_PASS_CLEAN:(process.env.WP_APP_PASS||'').replace(/\s+/g,'')};
function dec(s){return s.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;amp;/g,'&amp;').replace(/&amp;nbsp;/g,'&nbsp;').replace(/&amp;quot;/g,'"').replace(/&amp;#39;/g,"'").replace(/&ndash;/g,'–');}

const out={};
for(const id of IDS){
  try{
    const r=execSync(`curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" "${base}/${id}?context=edit&_fields=id,title,content"`,{env:env2,encoding:'utf8',maxBuffer:50000000});
    const j=JSON.parse(r);
    let c=(j.content&&j.content.raw)||'';
    let prev;let it=0;do{prev=c;c=dec(c);it++;}while(prev!==c&&it<5);
    const sIdx=c.search(/Šėrim/i);
    out[id]={title:(j.title&&j.title.rendered)||'',cLen:c.length,sIdx,full:c};
  }catch(e){out[id]={err:String(e).slice(0,100)};}
}
// Splituojam į 2 dalis (per didelis vienam fail'ui)
const ids=Object.keys(out);
const part1={};const part2={};
for(let i=0;i<ids.length;i++){
  if(i<32) part1[ids[i]]=out[ids[i]];
  else part2[ids[i]]=out[ids[i]];
}
commit('animonda_full_p1.json',JSON.stringify(part1,null,1));
commit('animonda_full_p2.json',JSON.stringify(part2,null,1));
console.log("done");
