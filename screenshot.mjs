import { execSync } from "child_process";
import crypto from "crypto";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}
const md5=s=>crypto.createHash('md5').update(s,'utf8').digest('hex');
const STY='<style>.b2b-black,.b2b-black *{color:#000 !important;} .b2b-black table{border-collapse:collapse;width:auto;max-width:100%;} .b2b-black td,.b2b-black th{border-bottom:2px solid #d3d3d3;padding:7px;text-align:left;}</style>';
const MARK='<p><strong>\u0160\u0117rimo rekomendacija:</strong></p>';
const IDS=[17216,17213];
const HEAD=/(\u0160\u0117rim(?:o|as)\s+(?:rekomendacij|instrukcij|norm))/i;
execSync('rm -rf /tmp/c && mkdir -p /tmp/c',{env});
fs.writeFileSync('/tmp/ids.txt',IDS.join("\n"));
try{execSync(`cat /tmp/ids.txt | xargs -P 4 -I{} curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/{}?context=edit&_fields=id,content" -o /tmp/c/{}.json`,{env,maxBuffer:200000000});}catch(e){}
const res={};let okAll=true;const builds={};
for(const id of IDS){
  let T="";try{T=(JSON.parse(fs.readFileSync('/tmp/c/'+id+'.json','utf8')).content||{}).raw||"";}catch(e){res[id]={err:'read'};okAll=false;continue;}
  const hp=T.search(HEAD);if(hp<0){res[id]={err:'no_head'};okAll=false;continue;}
  let start=-1;for(const tg of ['<p','<h2','<h3','<h4']){const k=T.lastIndexOf(tg,hp);if(k>start)start=k;}
  // table extent
  const tm=T.slice(start).match(/<table[\s\S]*?<\/table>/);
  if(!tm){res[id]={err:'no_table'};okAll=false;continue;}
  const tStart=start+tm.index, tEnd=tStart+tm[0].length;
  const tableHTML=tm[0];
  // intro = text in heading <p> after </strong>, before </p>
  const headP=T.slice(start, T.indexOf('</p>',hp)+4);
  let intro='';const sm=headP.match(/<\/strong>([\s\S]*?)<\/p>/);
  if(sm){intro=sm[1].replace(/&nbsp;/g,' ').replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim();}
  const introP=intro?('<p>'+intro+'</p>'):'';
  const cap='<p>Rekomenduojama paros norma (g)</p>';
  const block=MARK+introP+cap+STY+'<div class="b2b-black">'+tableHTML+'</div>';
  const newT=T.slice(0,start)+block+T.slice(tEnd);
  builds[id]={newT,tableMd5:md5(tableHTML),intro:intro.slice(0,50)};
}
if(!okAll){console.log('ABORT',JSON.stringify(res));commit("ont_B_fix_"+Date.now()+".json",JSON.stringify({abort:true,res}));process.exit(0);}
for(const id of IDS){const newT=builds[id].newT;
  fs.writeFileSync('/tmp/body.json',JSON.stringify({content:newT}));
  try{execSync(`curl -sk -X POST -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" "https://dev.avesa.lt/wp-json/wp/v2/product/${id}" -d @/tmp/body.json -o /tmp/w.json`,{env,maxBuffer:200000000});}catch(e){}
  let rb="";try{execSync(`curl -sk -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/${id}?context=edit&_fields=content" -o /tmp/rb.json`,{env});rb=(JSON.parse(fs.readFileSync('/tmp/rb.json','utf8')).content||{}).raw||"";}catch(e){}
  const rtm=rb.match(/<table[\s\S]*?<\/table>/);
  res[id]={lossless:md5(rb)===md5(builds[id].newT), b2b:rb.includes('b2b-black'), tblVerbatim: rtm?md5(rtm[0])===builds[id].tableMd5:false, intro:builds[id].intro};
}
console.log('FIXHEAD WRITE/VERIFY:');for(const id of IDS)console.log('  ',id,JSON.stringify(res[id]));
commit("ont_B_fix_"+Date.now()+".json",JSON.stringify(res,null,1));
console.log('DONE');
