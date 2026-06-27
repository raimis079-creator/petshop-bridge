import { execSync } from "child_process";
import crypto from "crypto";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}
const md5=s=>crypto.createHash('md5').update(s,'utf8').digest('hex');
const STY='<style>.b2b-black,.b2b-black *{color:#000 !important;} .b2b-black table{border-collapse:collapse;width:auto;max-width:100%;} .b2b-black td,.b2b-black th{border-bottom:2px solid #d3d3d3;padding:7px;text-align:left;}</style>';
const MARK='<p><strong>\u0160\u0117rimo rekomendacija:</strong></p>';
const CAP='<p>Rekomenduojama paros doz\u0117 suaugusioms kat\u0117ms (g):</p>';
const IDS=[16889,16886];
const H2=/Rekomenduojama paros doz/i;
const STOP=/(Sud\u0117tis|Analiz|Analitin|Nurodymai|Energin|Priedai|Sand\u0117liav|Komponent|Kuo i\u0161si)/i;
function clean(s){return s.replace(/<[^>]+>/g,' ').replace(/&amp;nbsp;|&nbsp;/g,' ').replace(/\xa0/g,' ').replace(/&ndash;|&#8211;/g,'\u2013').replace(/&amp;/g,'&').replace(/\s+/g,' ').trim();}
function spanEnd(T,start){let i=start;const re=/^\s*<p\b[^>]*>[\s\S]*?<\/p>/;let end=start;while(true){const m=T.slice(i).match(re);if(!m)break;const ct=clean(m[0]);if(STOP.test(ct))break;i+=m[0].length;end=i;}return end;}
execSync('rm -rf /tmp/c && mkdir -p /tmp/c',{env});
fs.writeFileSync('/tmp/ids.txt',IDS.join("\n"));
try{execSync(`cat /tmp/ids.txt | xargs -P 4 -I{} curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/{}?context=edit&_fields=id,content" -o /tmp/c/{}.json`,{env,maxBuffer:200000000});}catch(e){}
const builds={};const rep={};let okAll=true;
for(const id of IDS){let T="";try{T=(JSON.parse(fs.readFileSync('/tmp/c/'+id+'.json','utf8')).content||{}).raw||"";}catch(e){rep[id]={err:'read'};okAll=false;continue;}
  const hi=T.search(H2);if(hi<0){rep[id]={err:'no_head'};okAll=false;continue;}
  let s=-1;for(const tg of ['<p','<h2','<h3','<h4']){const k=T.lastIndexOf(tg,hi);if(k>s)s=k;}
  const end=spanEnd(T,s);const ct=clean(T.slice(s,end));
  const re=/(\d+(?:,\d+)?)\s*kg\s+(\d+)\s+(\d+)/g;let m;const rows=[];
  while((m=re.exec(ct))){rows.push({w:m[1],lo:m[2],hi:m[3]});}
  const good=rows.length>=4;
  rep[id]={n:rows.length,first:rows[0],last:rows[rows.length-1],good,span:ct.slice(0,160)};
  if(!good){okAll=false;continue;}
  const body=rows.map(r=>'<tr><td>'+r.w+' kg</td><td>'+r.lo+' g</td><td>'+r.hi+' g</td></tr>').join('');
  const table='<div class="b2b-black"><table><thead><tr><th>K\u016bno svoris</th><th>Ma\u017eas aktyvumas</th><th>Didelis aktyvumas</th></tr></thead><tbody>'+body+'</tbody></table></div>';
  const block=MARK+CAP+STY+table;
  const newT=T.slice(0,s)+block+T.slice(end);
  builds[id]={newT,sample:rows[0].lo+' g',rowsTxt:rows.map(r=>r.w+':'+r.lo+'/'+r.hi).join(' ')};
}
console.log('PARSE:',JSON.stringify(rep,null,1));
if(!okAll){console.log('ABORT');commit("prins_ca2_"+Date.now()+".json",JSON.stringify({abort:1,rep}));process.exit(0);}
const wres={};
for(const id of IDS){const newT=builds[id].newT;
  fs.writeFileSync('/tmp/body.json',JSON.stringify({content:newT}));
  try{execSync(`curl -sk -X POST -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" "https://dev.avesa.lt/wp-json/wp/v2/product/${id}" -d @/tmp/body.json -o /tmp/w.json`,{env,maxBuffer:200000000});}catch(e){}
  let rb="";try{execSync(`curl -sk -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/${id}?context=edit&_fields=content" -o /tmp/rb.json`,{env});rb=(JSON.parse(fs.readFileSync('/tmp/rb.json','utf8')).content||{}).raw||"";}catch(e){}
  let fe="";try{execSync(`curl -skL -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/?p=${id}&ps_desc=1" -o /tmp/fe.html`,{env,maxBuffer:200000000});fe=fs.readFileSync('/tmp/fe.html','utf8');}catch(e){}
  wres[id]={rows:builds[id].rowsTxt,lossless:md5(rb)===md5(newT),b2b:rb.includes('b2b-black'),tbl:rb.includes('<table>'),val:rb.includes(builds[id].sample),fe_b2b:fe.includes('b2b-black'),fe_tbl:fe.includes('<table'),fe_val:fe.includes(builds[id].sample)};
}
console.log('WRITE/VERIFY:',JSON.stringify(wres,null,1));
commit("prins_ca2_"+Date.now()+".json",JSON.stringify({rep,wres},null,1));
console.log('DONE');
