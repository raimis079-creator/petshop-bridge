import { execSync } from "child_process";
import fs from "fs";
import crypto from "crypto";
const env={...process.env};
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}

const skuShaUrl=`https://api.github.com/repos/${repo}/contents/screenshots/animonda_sku_html_sets.json?ref=main&t=${Date.now()}`;
const skuRes=execSync(`curl -sL -H "Authorization: Bearer ${tok}" "${skuShaUrl}"`,{encoding:'utf8',maxBuffer:50000000});
const skuJson=JSON.parse(skuRes);
const SKU_HTML=JSON.parse(Buffer.from(skuJson.content,'base64').toString('utf-8'));

const base='https://dev.avesa.lt/wp-json/wp/v2/product';
const env2={...process.env,WP_PASS_CLEAN:(process.env.WP_APP_PASS||'').replace(/\s+/g,'')};
function md5(s){return crypto.createHash('md5').update(s).digest('hex');}
function dec(s){return s.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;amp;/g,'&amp;').replace(/&amp;nbsp;/g,'&nbsp;').replace(/&amp;quot;/g,'"').replace(/&amp;#39;/g,"'").replace(/&ndash;/g,'–');}

const stages={fetched:0,planned:0,passed:0,failed:0,applied:0};
const planned=[];const apply=[];

for(const [sku,obj] of Object.entries(SKU_HTML)){
  try{
    const r=execSync(`curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" "${base}/${sku}?context=edit&_fields=id,title,content"`,{env:env2,encoding:'utf8',maxBuffer:50000000});
    const j=JSON.parse(r);
    stages.fetched++;
    let c=(j.content&&j.content.raw)||'';
    let prev;let it=0;do{prev=c;c=dec(c);it++;}while(prev!==c&&it<5);
    
    let newT;
    const sIdx=c.search(/Šėrim/i);
    if(sIdx>=0){
      // Insert pries Šėrim markerį - rasti paragraph pradžia
      const upTo=c.substring(0,sIdx);
      const lastPOpenIdx=upTo.lastIndexOf('<p');
      const insertIdx=lastPOpenIdx>=0?lastPOpenIdx:sIdx;
      newT=c.substring(0,insertIdx)+obj.html+'\n'+c.substring(insertIdx);
    } else {
      // Nera Šėrim markerio - append gale
      newT=c+'\n\n<h3>Šėrimo rekomendacija</h3>\n'+obj.html;
    }
    
    const guards={
      lengthGrew:newT.length>c.length,
      hasShaltinis:newT.includes('Šaltinis:')&&newT.includes('Animonda'),
      hasB2B:newT.includes('b2b-black'),
      hasTable:/<table/i.test(newT),
      noScript:!newT.toLowerCase().includes('<script'),
    };
    const pass=Object.values(guards).every(v=>v);
    planned.push({id:sku,title:j.title?.rendered||'',pass,guards,oldLen:c.length,newLen:newT.length,hadMarker:sIdx>=0});
    stages.planned++;
    if(!pass){stages.failed++;continue;}
    stages.passed++;
    
    const updatePayload=JSON.stringify({content:newT});
    fs.writeFileSync('/tmp/upd.json',updatePayload);
    const up=execSync(`curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" -X POST -H "Content-Type: application/json" -d @/tmp/upd.json "${base}/${sku}"`,{env:env2,encoding:'utf8',maxBuffer:50000000});
    const upJ=JSON.parse(up);
    const verLen=(upJ.content?.rendered||'').length;
    apply.push({id:sku,verLen,newLen:newT.length,oldLen:c.length});
    stages.applied++;
  }catch(e){planned.push({id:sku,err:String(e).slice(0,100)});stages.failed++;}
}

commit(`animonda_sets_apply_${Date.now()}.json`,JSON.stringify({stages,planned,apply},null,1));
console.log("done");
