import { execSync } from "child_process";
import fs from "fs";
import crypto from "crypto";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const md5=s=>crypto.createHash('md5').update(s,'utf8').digest('hex');
function commit(name, str){
  const b64=Buffer.from(str,'utf8').toString('base64');
  const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;
  const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;
  let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){}
  const body={message:'r',content:b64,branch:'main'}; if(sha)body.sha=sha;
  fs.writeFileSync('/tmp/cb.json', JSON.stringify(body));
  return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8',maxBuffer:80000000}).trim();
}
const TS=String(Date.now());
function readRaw(id){const r=JSON.parse(execSync(`curl -sk --max-time 25 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/${id}?context=edit&_fields=content"`,{encoding:'utf8',env,maxBuffer:20000000}));return (r.content&&r.content.raw)||'';}

const CLOSE_DOG='<p>Nurodyti kiekiai \u2014 vienam gyv\u016bnui per par\u0105. Pritaikykite pagal \u0161uns b\u016bkl\u0119 ir aktyvum\u0105. Visada turi b\u016bti \u0161vie\u017eio geriamojo vandens.</p>';
const CLOSE_PUP='<p>Nurodyti kiekiai \u2014 vienam \u0161uniukui per par\u0105, pagal numatom\u0105 suaugusio svor\u012f ir am\u017e\u012f. Visada turi b\u016bti \u0161vie\u017eio geriamojo vandens.</p>';

function dogTable(rows){ // rows: [[svoris,neakt,norm,akt],...]
  let t='<table>\n<tr><th>\u0160uns svoris</th><th>Neaktyvus / senyvas</th><th>Normaliai aktyvus</th><th>Aktyvus</th></tr>\n';
  rows.forEach(r=>{t+='<tr><td>'+r[0]+'</td><td>'+r[1]+'</td><td>'+r[2]+'</td><td>'+r[3]+'</td></tr>\n';});
  return t+'</table>';
}
const FESTIVAL=dogTable([['5 kg','45 g','60 g','75 g'],['10 kg','80 g','110 g','135 g'],['20 kg','135 g','180 g','230 g'],['30 kg','180 g','250 g','315 g'],['40 kg','225 g','310 g','390 g'],['60 kg','305 g','420 g','530 g'],['80 kg','380 g','520 g','655 g']]);
const LAMBRICE=dogTable([['5 kg','50 g','65 g','70 g'],['10 kg','95 g','125 g','150 g'],['20 kg','155 g','205 g','265 g'],['30 kg','205 g','280 g','350 g'],['40 kg','260 g','345 g','440 g'],['60 kg','345 g','470 g','600 g'],['80 kg','430 g','585 g','750 g']]);
const KIDS='<table>\n<tr><th>Suaugusio svoris</th><th>2 m\u0117n.</th><th>3 m\u0117n.</th><th>4 m\u0117n.</th><th>5\u20136 m\u0117n.</th><th>7\u201312 m\u0117n.</th></tr>\n<tr><td>10 kg</td><td>90\u2013120 g</td><td>140\u2013160 g</td><td>170\u2013180 g</td><td>165\u2013190 g</td><td>160\u2013180 g</td></tr>\n<tr><td>20 kg</td><td>140\u2013170 g</td><td>240\u2013295 g</td><td>310\u2013375 g</td><td>320\u2013390 g</td><td>300\u2013360 g</td></tr>\n<tr><td>30 kg</td><td>190\u2013230 g</td><td>290\u2013350 g</td><td>370\u2013450 g</td><td>410\u2013480 g</td><td>400\u2013450 g</td></tr>\n<tr><td>40 kg</td><td>255\u2013310 g</td><td>400\u2013440 g</td><td>410\u2013530 g</td><td>490\u2013570 g</td><td>480\u2013540 g</td></tr>\n<tr><td>60 kg</td><td>290\u2013355 g</td><td>490\u2013560 g</td><td>580\u2013720 g</td><td>660\u2013800 g</td><td>800\u2013900 g</td></tr>\n<tr><td>80 kg</td><td>390\u2013475 g</td><td>550\u2013650 g</td><td>690\u2013900 g</td><td>820\u20131000 g</td><td>930\u20131000 g</td></tr>\n</table>';

// id -> {table, close}
const PLAN={
  26449:[FESTIVAL,CLOSE_DOG], 25415:[FESTIVAL,CLOSE_DOG],          // Festival
  26423:[FESTIVAL,CLOSE_DOG], 25443:[FESTIVAL,CLOSE_DOG],          // Active Nature (ta pati lentele kaip Festival - patvirtinta josera datasheet)
  25419:[LAMBRICE,CLOSE_DOG], 21014:[LAMBRICE,CLOSE_DOG],          // Lamb+Rice A/S / Lamb & Rice
  25475:[KIDS,CLOSE_PUP], 25471:[KIDS,CLOSE_PUP], 24644:[KIDS,CLOSE_PUP] // Kids
};

const results=[];
for(const id of Object.keys(PLAN)){
  const [table,close]=PLAN[id];
  const r={id:+id};
  let h; try{ h=readRaw(id); }catch(e){ r.status='SKIP'; r.reason='read err'; results.push(r); continue; }
  if(/<table>/.test(h)){ r.status='SKIP'; r.reason='jau turi lentele'; results.push(r); continue; }
  const am=h.match(/Analitin[\s\S]*?<\/p>\s*<p>[\s\S]*?<\/p>/);
  if(!am){ r.status='SKIP'; r.reason='Analitiniu nerasta - negaliu ideti'; results.push(r); continue; }
  const sm=h.match(/Sud\u0117tis:[\s\S]*?<\/p>/);
  const sud_md5=sm?md5(sm[0]):null;
  const anal_md5=md5(am[0]);
  const block='\n<p><strong>\u0160\u0117rimo instrukcija:</strong></p>\n'+table+'\n'+close;
  const after=h.replace(am[0], am[0]+block);
  // guards pre
  if(after.indexOf(table)===-1){ r.status='SKIP'; r.reason='insert nepavyko'; results.push(r); continue; }
  // write
  fs.writeFileSync('/tmp/body.json', JSON.stringify({content: after}));
  let wc; try{ wc=execSync(`curl -sk --max-time 40 -o /dev/null -w "%{http_code}" -X PUT -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" -d @/tmp/body.json "https://dev.avesa.lt/wp-json/wp/v2/product/${id}"`,{encoding:'utf8',env,maxBuffer:50000000}).trim(); }catch(e){ r.status='ERR'; r.reason='write '+e; results.push(r); continue; }
  r.write_http=wc;
  // verify
  execSync('sleep 1');
  let after2; try{ after2=readRaw(id); }catch(e){ after2=''; }
  const sm2=after2.match(/Sud\u0117tis:[\s\S]*?<\/p>/);
  const am2=after2.match(/Analitin[\s\S]*?<\/p>\s*<p>[\s\S]*?<\/p>/);
  r.table_live=/<table>/.test(after2);
  r.sud_intact = sud_md5? (sm2 && md5(sm2[0])===sud_md5) : 'n/a';
  r.anal_intact = am2 && md5(am2[0])===anal_md5;
  r.lossless = md5(after)===md5(after2);
  r.status = (wc==='200' && r.table_live && r.anal_intact && (r.sud_intact===true||r.sud_intact==='n/a') && r.lossless)?'OK':'CHECK';
  results.push(r);
}
commit("batch1_"+TS+".json", JSON.stringify(results,null,2));
console.log("DONE "+TS+" "+results.filter(r=>r.status==='OK').length+"/"+results.length+" OK");
