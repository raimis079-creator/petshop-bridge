import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}
const BASE="https://dev.avesa.lt/wp-json";
function cj(u){try{execSync(`curl -sk --max-time 50 -u "$WP_USER:$WP_PASS_CLEAN" "${u}" -o /tmp/r.json`,{env,maxBuffer:200000000});return JSON.parse(fs.readFileSync('/tmp/r.json','utf8'));}catch(e){return {err:String(e).slice(0,120)};}}
function parseWeight(title){
  const t=title.replace(/&amp;/g,'&').replace(/&#8211;/g,'-');
  let m=t.match(/(\d+)\s*\+\s*(\d+)\s*kg\b/i); if(m)return {kg:parseFloat(m[1])+parseFloat(m[2]),fmt:(parseFloat(m[1])+parseFloat(m[2]))+' kg'};
  m=t.match(/(\d+(?:[,.]\d+)?)\s*kg\b/i); if(m){const v=parseFloat(m[1].replace(',','.'));return {kg:v,fmt:m[1].replace('.',',')+' kg'};}
  m=t.match(/(\d+(?:[,.]\d+)?)\s*(gr|g)\b/i); if(m){const v=parseFloat(m[1].replace(',','.'))/1000;return {kg:v,fmt:m[1]+' g'};}
  return null;
}
// 1) Pilnas Farmina sąrašas (wp/v2 - su product_brand=301)
let acc=[],page=1;
while(page<=3){const p=cj(`${BASE}/wp/v2/product?product_brand=301&per_page=100&page=${page}&_fields=id,title`);if(!Array.isArray(p)||!p.length)break;acc=acc.concat(p);if(p.length<100)break;page++;}
const ids=acc.map(x=>x.id);
fs.writeFileSync('/tmp/ids.txt',ids.join("\n"));
// 2) Surenkam visus atributus per wc/v3
execSync('rm -rf /tmp/a && mkdir -p /tmp/a',{env});
try{execSync(`cat /tmp/ids.txt | xargs -P 12 -I{} curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" "${BASE}/wc/v3/products/{}?_fields=id,name,attributes" -o /tmp/a/{}.json`,{env,maxBuffer:200000000});}catch(e){}

const rep={planned:[],applied:[],noTitleWeight:[]};
for(const x of acc){
  let w={};try{w=JSON.parse(fs.readFileSync('/tmp/a/'+x.id+'.json','utf8'));}catch(e){continue;}
  const title=w.name||(x.title&&x.title.rendered)||'';
  const pw=parseWeight(title);
  if(!pw){rep.noTitleWeight.push({id:x.id,title});continue;}
  const at=w.attributes||[];
  const pakIdx=at.findIndex(a=>/pakuot/i.test(a.name||''));
  const currOpts=pakIdx>=0?(at[pakIdx].options||[]):[];
  // Target value - same format as Svoris display
  const target=pw.fmt;
  // Patikrink ar jau sutampa
  const numericMatch=currOpts.some(o=>{
    const cm=String(o).match(/(\d+(?:[,.]\d+)?)\s*(kg|g)/i);
    if(!cm)return false;
    const cv=parseFloat(cm[1].replace(',','.'))*(cm[2].toLowerCase()==='g'?0.001:1);
    return Math.abs(cv-pw.kg)<0.001;
  });
  if(numericMatch){rep.planned.push({id:x.id,title,curr:currOpts,target,ok:true});continue;}
  rep.planned.push({id:x.id,title,curr:currOpts,target,ok:false});
  // Pataisom — jei atributas yra, perrašom; jei nėra, pridedam
  let newAt=at.map(a=>({name:a.name,position:a.position,visible:a.visible,variation:a.variation,options:a.options}));
  if(pakIdx>=0){newAt[pakIdx]={...newAt[pakIdx],options:[target]};}
  else newAt.push({name:'Pakuotės dydis',position:99,visible:true,variation:false,options:[target]});
  fs.writeFileSync('/tmp/ab.json',JSON.stringify({attributes:newAt}));
  try{
    execSync(`curl -sk -X PUT -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" "${BASE}/wc/v3/products/${x.id}" -d @/tmp/ab.json -o /tmp/ar.json`,{env,maxBuffer:200000000});
    const r=JSON.parse(fs.readFileSync('/tmp/ar.json','utf8'));
    const aa=(r.attributes||[]).find(a=>/pakuot/i.test(a.name||''));
    rep.applied.push({id:x.id,setTo:target,confirmed:aa?aa.options:null});
  }catch(e){rep.applied.push({id:x.id,err:String(e).slice(0,100)});}
}
commit("farmina_pakfix_"+Date.now()+".json",JSON.stringify({total:acc.length,plannedMismatch:rep.planned.filter(p=>!p.ok).length,plannedOk:rep.planned.filter(p=>p.ok).length,noTitleWeight:rep.noTitleWeight,appliedCount:rep.applied.length,planned:rep.planned,applied:rep.applied},null,1));
console.log("PAKFIX DONE");
