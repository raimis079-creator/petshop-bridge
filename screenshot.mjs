import { execSync } from "child_process";
import crypto from "crypto";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const U=process.env.WP_USER;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}
const md5=s=>crypto.createHash('md5').update(s,'utf8').digest('hex');
const STY='<style>.b2b-black,.b2b-black *{color:#000 !important;} .b2b-black table{border-collapse:collapse;width:auto;max-width:100%;} .b2b-black td,.b2b-black th{border-bottom:2px solid #d3d3d3;padding:7px;text-align:left;}</style>';
const MARK='<p><strong>\u0160\u0117rimo rekomendacija:</strong></p>';
const CFG={
 17299:{rows:1,h:['\u0160uns svoris','Paros doz\u0117']},17296:{rows:1,h:['\u0160uns svoris','Paros doz\u0117']},
 17293:{rows:1,h:['\u0160uns svoris','Paros doz\u0117']},17286:{rows:1,h:['\u0160uns svoris','Paros doz\u0117']},
 17283:{rows:1,h:['\u0160uns svoris','Paros doz\u0117']},17280:{rows:1,h:['\u0160uns svoris','Paros doz\u0117']},
 17268:{rows:1,h:['\u0160uns svoris','Paros doz\u0117']},17265:{rows:1,h:['\u0160uns svoris','Paros doz\u0117']},
 17262:{rows:1,h:['\u0160uns svoris','Paros doz\u0117']},17272:{rows:1,h:['\u0160uns svoris','Paros doz\u0117']},
 16234:{rows:2,h:['Kat\u0117s svoris','Namie ir lauke','Kambarin\u0117ms']},
 16210:{rows:2,h:['Kat\u0117s svoris','Namuose ir lauke','Namuose']},
 16207:{rows:2,h:['Kat\u0117s svoris','Namuose ir lauke','Namuose']},
 16204:{rows:2,h:['Kat\u0117s svoris','Senjor\u0117','Dieta']},
};
const IDS=Object.keys(CFG).map(Number);
const HEAD=/(\u0160\u0117rim(?:o|as)\s+(?:rekomendacij|instrukcij|norm))/i;
const STOP=/(Sud\u0117tis|Analitin|Energin|\u012esp\u0117jim|Priedai|Maisting|Trumpas prek|Pagrindinis apra|Sand\u0117liav)/i;
function clean(s){return s.replace(/<!--[\s\S]*?-->/g,' ').replace(/<[^>]+>/g,' ').replace(/&amp;nbsp;|&nbsp;/g,' ').replace(/\xa0/g,' ').replace(/&#8211;|&ndash;/g,'\u2013').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/\s+/g,' ').trim();}
function parse(span){
  let s=clean(span).replace(/^\s*\u0160\u0117rim(?:o|as)\s+(?:rekomendacij\w*|instrukcij\w*|norm\w*)\s*:?\s*/i,'');
  const wm=s.match(/(\u0160uns svoris|Kat\u0117s svoris|Svoris)\s*\(kg\)/i);
  if(!wm)return{err:'no_whdr'};
  const intro=s.slice(0,wm.index).trim().replace(/[\s:]+$/,'');
  const toks=s.slice(wm.index+wm[0].length).split(/\s+/).filter(Boolean);
  const isN=t=>/^\d+(?:,\d+)?$/.test(t);
  let i=0;const weights=[];while(i<toks.length&&isN(toks[i])){weights.push(toks[i]);i++;}
  const rows=[];let storage='';
  while(i<toks.length){let lbl=[];while(i<toks.length&&!isN(toks[i])){lbl.push(toks[i]);i++;}
    if(i>=toks.length){storage=lbl.join(' ');break;}
    const v=[];while(i<toks.length&&isN(toks[i])){v.push(toks[i]);i++;}
    rows.push({label:lbl.join(' '),vals:v});}
  return{intro,weights,rows,storage};
}
function spanEnd(T,start){ // consume consecutive <p>..</p> blocks (feeding), stop before section
  let i=start;const re=/^\s*<p\b[^>]*>[\s\S]*?<\/p>/;
  let end=start;
  while(true){const m=T.slice(i).match(re);if(!m)break;const blk=m[0];const ct=clean(blk);
    if(STOP.test(ct))break; i+=blk.length; end=i; }
  return end;
}
execSync('rm -rf /tmp/c && mkdir -p /tmp/c',{env});
fs.writeFileSync('/tmp/ids.txt',IDS.join("\n"));
try{execSync(`cat /tmp/ids.txt | xargs -P 8 -I{} curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/{}?context=edit&_fields=id,content" -o /tmp/c/{}.json`,{env,maxBuffer:200000000});}catch(e){}
const report=[];let okAll=true; const builds={};
for(const id of IDS){
  let T="";try{T=(JSON.parse(fs.readFileSync('/tmp/c/'+id+'.json','utf8')).content||{}).raw||"";}catch(e){report.push({id,err:'read'});okAll=false;continue;}
  const hp=T.search(HEAD);if(hp<0){report.push({id,err:'no_head'});okAll=false;continue;}
  let start=-1;for(const tg of ['<p','<h2','<h3','<h4']){const k=T.lastIndexOf(tg,hp);if(k>start)start=k;}
  const end=spanEnd(T,start);
  const span=T.slice(start,end);
  const P=parse(span);
  const cfg=CFG[id];
  if(P.err){report.push({id,err:P.err});okAll=false;continue;}
  const wN=P.weights.length;
  const good=wN>=3 && P.rows.length===cfg.rows && P.rows.every(r=>r.vals.length===wN);
  if(!good){report.push({id,err:'shape',wN,rowsN:P.rows.length,rowLens:P.rows.map(r=>r.vals.length)});okAll=false;continue;}
  // build table
  let th='<tr><th>'+cfg.h[0]+'</th>'+cfg.h.slice(1).map(x=>'<th>'+x+'</th>').join('')+'</tr>';
  let body='';
  for(let k=0;k<wN;k++){let tds='<td>'+P.weights[k]+' kg</td>';for(let r=0;r<cfg.rows;r++)tds+='<td>'+P.rows[r].vals[k]+' g</td>';body+='<tr>'+tds+'</tr>';}
  const table='<div class="b2b-black"><table><thead>'+th+'</thead><tbody>'+body+'</tbody></table></div>';
  const introP=P.intro?('<p>'+P.intro+'</p>'):'';
  const storP=P.storage?('<p>'+P.storage+'</p>'):'';
  const block=MARK+introP+STY+table+storP;
  const newT=T.slice(0,start)+block+T.slice(end);
  builds[id]={newT, sample:P.rows[0].vals[0]+' g', wN, intro:P.intro.slice(0,40), storage:P.storage};
  report.push({id,wN,rows:cfg.rows,sample:P.weights[0]+'kg\u2192'+P.rows[0].vals[0]+'g .. '+P.weights[wN-1]+'kg\u2192'+P.rows[0].vals[wN-1]+'g',storage:P.storage});
}
console.log('PARSE REPORT:');report.forEach(r=>console.log('  ',JSON.stringify(r)));
if(!okAll){console.log('ABORT: not all valid, no writes');commit("ont_B_apply_"+Date.now()+".json",JSON.stringify({abort:true,report}));process.exit(0);}
// WRITE
const wres={};
for(const id of IDS){const newT=builds[id].newT;
  fs.writeFileSync('/tmp/body.json',JSON.stringify({content:newT}));
  try{execSync(`curl -sk -X POST -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" "https://dev.avesa.lt/wp-json/wp/v2/product/${id}" -d @/tmp/body.json -o /tmp/w.json`,{env,maxBuffer:200000000});}catch(e){}
  // readback
  let rb="";try{execSync(`curl -sk -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/${id}?context=edit&_fields=content" -o /tmp/rb.json`,{env});rb=(JSON.parse(fs.readFileSync('/tmp/rb.json','utf8')).content||{}).raw||"";}catch(e){}
  wres[id]={lossless: md5(rb)===md5(newT), b2b: rb.includes('b2b-black'), tbl: rb.includes('<table>'), val: rb.includes(builds[id].sample)};
}
console.log('\nWRITE/VERIFY:');for(const id of IDS)console.log('  ',id,JSON.stringify(wres[id]));
commit("ont_B_apply_"+Date.now()+".json",JSON.stringify({report,wres},null,1));
console.log('DONE');
