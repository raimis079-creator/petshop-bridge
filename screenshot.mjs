import { execSync } from "child_process";
import crypto from "crypto";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}
const md5=s=>crypto.createHash('md5').update(s,'utf8').digest('hex');
const BASE="https://dev.avesa.lt/wp-json";
function decodeOnce(s){return s.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;amp;/g,'&amp;').replace(/&amp;nbsp;/g,'&nbsp;').replace(/&amp;quot;/g,'"').replace(/&amp;#39;/g,"'");}
function decodeRepeated(s){let prev;let iter=0;do{prev=s;s=decodeOnce(s);iter++;}while(prev!==s&&iter<5);return s;}

// Loaduojam sku_html.json is bridge repo
const shResp=execSync(`curl -s -H "Authorization: Bearer ${tok}" "https://api.github.com/repos/${repo}/contents/screenshots/monge_sku_html.json?ref=main&t=${Date.now()}"`,{encoding:'utf8',maxBuffer:300000000});
const shJson=JSON.parse(shResp);
const sh=JSON.parse(Buffer.from(shJson.content,'base64').toString('utf-8'));
commit("dbg_stages.json",JSON.stringify({s:"sh loaded",cnt:Object.keys(sh).length}));
const SKIP=new Set([16217,16248,17415,17418,16225,16228]);
const IDS=Object.keys(sh).map(k=>parseInt(k)).filter(id=>!SKIP.has(id));
commit("dbg_stages.json",JSON.stringify({s:"IDS filtered",cnt:IDS.length}));
fs.writeFileSync('/tmp/ids.txt',IDS.join("\n"));
execSync('rm -rf /tmp/c && mkdir -p /tmp/c',{env});
try{execSync(`cat /tmp/ids.txt | xargs -P 12 -I{} curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" "${BASE}/wp/v2/product/{}?context=edit&_fields=id,content,status,title" -o /tmp/c/{}.json`,{env,maxBuffer:200000000});}catch(e){}

const rep={planned:[],apply:[]};
const builds={};
let allPass=true;
commit("dbg_stages.json",JSON.stringify({s:"after curl xargs"}));
let loopCnt=0;
try {
for(const id of IDS){
  loopCnt++;
  if (loopCnt%10===0) commit("dbg_stages.json",JSON.stringify({s:"loop",n:loopCnt,id}));
  let j={};try{j=JSON.parse(fs.readFileSync('/tmp/c/'+id+'.json','utf8'));}catch(e){rep.planned.push({id,err:'read'});allPass=false;continue;}
  const raw=(j.content&&j.content.raw)||"";
  const html=sh[id].html;
  if(!html){rep.planned.push({id,err:'no_html'});allPass=false;continue;}
  let zb=raw;
  // Pasalinkim esamus blokus jei buvo
  const tblStart=zb.indexOf('<style>.b2b-black');
  if(tblStart>=0){const tblEnd=zb.indexOf('</table></div>',tblStart);if(tblEnd>=0){zb=zb.slice(0,tblStart).replace(/\s+$/,'')+zb.slice(tblEnd+'</table></div>'.length);}else{const altEnd=zb.indexOf('</div>',tblStart);if(altEnd>=0){zb=zb.slice(0,tblStart).replace(/\s+$/,'')+zb.slice(altEnd+'</div>'.length);}}}
  const vlStart=zb.indexOf('<style>.b2b-vetlife');
  if(vlStart>=0){const vlEnd=zb.indexOf('</div>',vlStart);if(vlEnd>=0){zb=zb.slice(0,vlStart).replace(/\s+$/,'')+zb.slice(vlEnd+'</div>'.length);}}
  const decoded=decodeRepeated(zb);
  const sIdx=decoded.search(/Šėrimo\s+instrukcij/);
  let pEnd=-1;
  if(sIdx>=0){
    const pP=decoded.indexOf('</p>',sIdx);
    const pD=decoded.indexOf('</div>',sIdx);
    if(pP<0&&pD<0) pEnd=-1;
    else if(pP<0) pEnd=pD;
    else if(pD<0) pEnd=pP;
    else pEnd=Math.min(pP,pD);
  }
  if(sIdx<0||pEnd<0){rep.planned.push({id,err:'marker',title:(j.title&&j.title.rendered)||''});allPass=false;continue;}
  const closeTag=decoded.slice(pEnd,pEnd+6)==='</div>'?6:4;
  const cut=pEnd+closeTag;
  const newT=decoded.slice(0,cut)+'\n'+html+decoded.slice(cut);
  const g={
    noEncP:!/&lt;p&gt;|&lt;\/p&gt;|&lt;strong&gt;/.test(newT),
    noDoubleEnt:!/&amp;amp;|&amp;nbsp;/.test(newT),
    hasRealP:/<p[\s>]/.test(newT)&&/<\/p>/.test(newT),
    hasSerimo:/Šėrimo\s+instrukcij/.test(newT),
    hasTable:/<table/.test(newT)&&/<\/table>/.test(newT),
    oneBlackBlock:(newT.match(/<div class="b2b-black">/g)||[]).length===1,
    hasShaltinis:newT.includes('Šaltinis:')&&newT.includes('Monge'),
    introMin:newT.length>=1500,
    pakuoteAbsent:!/Pakuotės dydis.*cm/.test(newT)
  };
  const pass=Object.values(g).every(Boolean);
  rep.planned.push({id,title:(j.title&&j.title.rendered)||'',guards:g,pass});
  if(!pass){allPass=false;continue;}
  builds[id]={newT,status:j.status};
}
} catch(e) { commit("monge_tbl_apply_"+Date.now()+".json",JSON.stringify({stage_err:String(e).slice(0,500),rep},null,1)); process.exit(1); }
commit("dbg_stages.json",JSON.stringify({s:"planning done",fails:rep.planned.filter(p=>!p.pass).length}));
if(!allPass){commit("monge_tbl_apply_"+Date.now()+".json",JSON.stringify({abort:1,rep},null,1));console.log("ABORT");process.exit(0);}

for(const id of IDS){
  const b=builds[id];
  fs.writeFileSync('/tmp/body.json',JSON.stringify({content:b.newT}));
  try{
    execSync(`curl -sk -X POST -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" "${BASE}/wp/v2/product/${id}" -d @/tmp/body.json -o /tmp/w.json`,{env,maxBuffer:200000000});
    execSync(`curl -sk -u "$WP_USER:$WP_PASS_CLEAN" "${BASE}/wp/v2/product/${id}?context=edit&_fields=content" -o /tmp/rb.json`,{env});
    const rb=(JSON.parse(fs.readFileSync('/tmp/rb.json','utf8')).content||{}).raw||"";
    rep.apply.push({id,lossless:md5(rb)===md5(b.newT)});
  }catch(e){rep.apply.push({id,err:String(e).slice(0,100)});}
}
commit("monge_tbl_apply_"+Date.now()+".json",JSON.stringify(rep,null,1));
console.log("MONGE TBL DONE",IDS.length);
