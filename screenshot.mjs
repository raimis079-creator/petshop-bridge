import { execSync } from "child_process";
import crypto from "crypto";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}
const md5=s=>crypto.createHash('md5').update(s,'utf8').digest('hex');
const STY='<style>.b2b-black,.b2b-black *{color:#000 !important;} .b2b-black table{border-collapse:collapse;width:auto;max-width:100%;} .b2b-black td,.b2b-black th{border-bottom:2px solid #d3d3d3;padding:7px;text-align:left;}</style>';
const MARK='<p><strong>\u0160\u0117rimo rekomendacija:</strong></p>';
const HEAD=/(\u0160\u0117rim(?:o|as)\s+(?:rekomendacij|instrukcij|norm))/i;
const STOP=/(Sud\u0117tis|Analitin|Energin|\u012esp\u0117jim|Priedai|Maisting|Trumpas prek|Pagrindinis apra)/i;
function clean(s){return s.replace(/<[^>]+>/g,' ').replace(/&amp;nbsp;|&nbsp;/g,' ').replace(/\xa0/g,' ').replace(/&ndash;/g,'\u2013').replace(/&amp;/g,'&').replace(/\s+/g,' ').trim();}
function spanEnd(T,start){let i=start;const re=/^\s*<p\b[^>]*>[\s\S]*?<\/p>/;let end=start;while(true){const m=T.slice(i).match(re);if(!m)break;const ct=clean(m[0]);if(STOP.test(ct))break;i+=m[0].length;end=i;}return end;}
function read(id){try{return (JSON.parse(fs.readFileSync('/tmp/c/'+id+'.json','utf8')).content||{}).raw||"";}catch(e){return"";}}
execSync('rm -rf /tmp/c && mkdir -p /tmp/c',{env});
fs.writeFileSync('/tmp/ids.txt',"16222\n17210");
try{execSync(`cat /tmp/ids.txt | xargs -P 4 -I{} curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/{}?context=edit&_fields=id,content" -o /tmp/c/{}.json`,{env,maxBuffer:200000000});}catch(e){}
const builds={};const rep={};
// ---- 16222 ----
{const id=16222;const T=read(id);const hp=T.search(HEAD);let s=-1;for(const tg of ['<p','<h2','<h3','<h4']){const k=T.lastIndexOf(tg,hp);if(k>s)s=k;}
 const end=spanEnd(T,s);const ct=clean(T.slice(s,end));
 const re=/(\d+(?:,\d+)?)kg\s*\|\s*(\d+)\s*\(g\)\s*\|\s*(\d+)\s*\(g\)/g;let m;const rows=[];
 while((m=re.exec(ct))){rows.push({w:m[1],lauke:m[2],nam:m[3]});}
 const good=rows.length>=10;
 rep[id]={n:rows.length,first:rows[0],last:rows[rows.length-1],good};
 if(good){let body=rows.map(r=>'<tr><td>'+r.w+' kg</td><td>'+r.lauke+' g</td><td>'+r.nam+' g</td></tr>').join('');
  const table='<div class="b2b-black"><table><thead><tr><th>Kat\u0117s svoris</th><th>Gyvenan\u010dios lauke</th><th>Namin\u0117ms</th></tr></thead><tbody>'+body+'</tbody></table></div>';
  const block=MARK+STY+table;const newT=T.slice(0,s)+block+T.slice(end);builds[id]={newT,sample:rows[0].lauke+' g'};}
}
// ---- 17210 ----
{const id=17210;const T=read(id);const hp=T.search(HEAD);let s=-1;for(const tg of ['<p','<h2','<h3','<h4']){const k=T.lastIndexOf(tg,hp);if(k>s)s=k;}
 // heading p
 const hEnd=T.indexOf('</p>',hp)+4;const introClean=clean(T.slice(s,hEnd)).replace(/^.*?(?:instrukcij\w*|rekomendacij\w*)\s*:?\s*/i,'');
 // matrix p = <p> containing "Būsimas"
 const bi=T.indexOf('B\u016bsimas',hEnd);const mpS=T.lastIndexOf('<p',bi);const mpE=T.indexOf('</p>',bi)+4;
 const mct=clean(T.slice(mpS,mpE));
 const weights=[...mct.matchAll(/(\d+)kg/g)].map(x=>x[1]); // 25..90
 const ageRe=/(\d+-\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)/g;let am;const ages=[];
 while((am=ageRe.exec(mct))){ages.push({a:am[1],v:[am[2],am[3],am[4],am[5],am[6],am[7],am[8],am[9]]});}
 // note (energy) inside matrix p?
 let note='';const ni=mct.search(/Metabolizuojam/i);if(ni>-1)note=mct.slice(ni).trim();
 const good=weights.length===8 && ages.length>=5 && ages.every(a=>a.v.length===8);
 rep[id]={weights:weights.join('/'),ageN:ages.length,ages:ages.map(a=>a.a).join(','),note:note.slice(0,40),good};
 if(good){
  let th='<tr><th>Am\u017eius (m\u0117n.)</th>'+weights.map(w=>'<th>'+w+' kg</th>').join('')+'</tr>';
  let body=ages.map(a=>'<tr><td>'+a.a+'</td>'+a.v.map(x=>'<td>'+x+' g</td>').join('')+'</tr>').join('');
  const table='<div class="b2b-black"><table><thead>'+th+'</thead><tbody>'+body+'</tbody></table></div>';
  const introP=introClean?'<p>'+introClean+'</p>':'';
  const cap='<p>B\u016bsimas suaugusio \u0161uns svoris / Dienos norma, g</p>';
  const noteP=note?'<p>'+note+'</p>':'';
  const block=MARK+introP+cap+STY+table+noteP;
  const newT=T.slice(0,s)+block+T.slice(mpE);builds[id]={newT,sample:ages[0].v[0]+' g'};
 }
}
console.log('PARSE:',JSON.stringify(rep,null,1));
const allGood=Object.values(rep).every(r=>r.good);
if(!allGood){console.log('ABORT');commit("ont_B_d4_"+Date.now()+".json",JSON.stringify({abort:true,rep}));process.exit(0);}
const wres={};
for(const id of [16222,17210]){const newT=builds[id].newT;
  fs.writeFileSync('/tmp/body.json',JSON.stringify({content:newT}));
  try{execSync(`curl -sk -X POST -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" "https://dev.avesa.lt/wp-json/wp/v2/product/${id}" -d @/tmp/body.json -o /tmp/w.json`,{env,maxBuffer:200000000});}catch(e){}
  let rb="";try{execSync(`curl -sk -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/${id}?context=edit&_fields=content" -o /tmp/rb.json`,{env});rb=(JSON.parse(fs.readFileSync('/tmp/rb.json','utf8')).content||{}).raw||"";}catch(e){}
  wres[id]={lossless:md5(rb)===md5(newT),b2b:rb.includes('b2b-black'),tbl:rb.includes('<table>'),val:rb.includes(builds[id].sample),energy:id===17210?rb.includes('Metabolizuojam'):'n/a'};
}
console.log('WRITE/VERIFY:',JSON.stringify(wres,null,1));
commit("ont_B_d4_"+Date.now()+".json",JSON.stringify({rep,wres},null,1));
console.log('DONE');
