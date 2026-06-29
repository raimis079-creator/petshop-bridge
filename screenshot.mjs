import { execSync } from "child_process";
import fs from "fs";
const env={...process.env};
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}

const IDS=[14472,14470,14468,14467,14280,14279,14277,14276,12828,12720,12719,12718,14473,14471,14469,14281,14278,12721];
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
    const reIdx=c.search(/Rekomenduo/i);
    const dIdx=c.search(/Dienos\s+norma/i);
    const hasMatrix=/<table/i.test(c)||/\b(\d+(?:[-–]\d+)?\s*kg)/.test(c);
    
    out[id]={
      title:(j.title&&j.title.rendered)||'',
      cLen:c.length,
      sIdx,reIdx,dIdx,
      hasMatrix,
      ctx:sIdx>=0?c.substring(sIdx,sIdx+600):'NONE'
    };
  }catch(e){out[id]={err:String(e).slice(0,100)};}
}
commit('real_content_check.json',JSON.stringify(out,null,1));
console.log("done");
