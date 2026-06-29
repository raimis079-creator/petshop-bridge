import { execSync } from "child_process";
import fs from "fs";
import crypto from "crypto";
const env={...process.env};
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}

// 27 HTML_TABLE SKU - tik tie kuriems originali HTML lentelė reikia ištrinti
const HTML_TABLE_IDS=[19471,19475,19479,19483,19488,19492,19496,19500,19504,19508,19530,19534,19538,19542,19545,19549,19553,19557,19562,19566,19570,19574,19578,19582,19586,19590,19594,19598,19602];

const base='https://dev.avesa.lt/wp-json/wp/v2/product';
const env2={...process.env,WP_PASS_CLEAN:(process.env.WP_APP_PASS||'').replace(/\s+/g,'')};
function md5(s){return crypto.createHash('md5').update(s).digest('hex');}
function dec(s){return s.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;amp;/g,'&amp;').replace(/&amp;nbsp;/g,'&nbsp;').replace(/&amp;quot;/g,'"').replace(/&amp;#39;/g,"'").replace(/&ndash;/g,'–');}

const stages={fetched:0,planned:0,passed:0,failed:0,applied:0};
const planned=[];const apply=[];

for(const sku of HTML_TABLE_IDS){
  try{
    const r=execSync(`curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" "${base}/${sku}?context=edit&_fields=id,title,content"`,{env:env2,encoding:'utf8',maxBuffer:50000000});
    const j=JSON.parse(r);
    stages.fetched++;
    let c=(j.content&&j.content.raw)||'';
    let prev;let it=0;do{prev=c;c=dec(c);it++;}while(prev!==c&&it<5);
    
    // Ištrinti originalią HTML lentelę
    let newT=c;
    // 1. Pašalinti <p>...ŠUNS SVORIS...REKOMENDUOJAMAS KONSERVO KIEKIS</p>
    newT=newT.replace(/<p>[^<]*?ŠUNS SVORIS[^<]*?REKOMENDUOJAMAS KONSERVO KIEKIS[^<]*?<\/p>\s*/gi,'');
    // 2. Pašalinti <table class="product-detail-feeding-recommendation__table">...</table>
    newT=newT.replace(/<table\s+class="product-detail-feeding-recommendation__table"[^>]*>[\s\S]*?<\/table>\s*/gi,'');
    
    const removed=c.length-newT.length;
    const guards={
      removedSomething:removed>500,  // >500 simboliai ištrintos
      stillHasB2B:newT.includes('b2b-black'),  // mūsų b2b-black išliko
      stillHasShaltinis:newT.includes('Šaltinis:')&&newT.includes('Animonda'),
      stillHasSerimo:/Šėrim/i.test(newT),
      noOriginalTable:!newT.includes('product-detail-feeding-recommendation__table'),
      noScript:!newT.toLowerCase().includes('<script'),
    };
    const pass=Object.values(guards).every(v=>v);
    planned.push({id:sku,title:j.title?.rendered||'',pass,guards,oldLen:c.length,newLen:newT.length,removed});
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

commit(`animonda_clean_${Date.now()}.json`,JSON.stringify({stages,planned,apply},null,1));
console.log("done");
