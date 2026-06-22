import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
function putResult(name, obj){
  const b64=Buffer.from((typeof obj==='string')?obj:JSON.stringify(obj,null,1),'utf8').toString('base64');
  const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;
  const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;
  function getSha(){try{return JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){return '';}}
  function doPut(sha){const body={message:'r',content:b64,branch:'main'};if(sha)body.sha=sha;fs.writeFileSync('/tmp/p.json',JSON.stringify(body));return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/p.json "'+url+'"',{encoding:'utf8'}).trim();}
  let code='';for(let i=0;i<5;i++){const sha=getSha();code=doPut(sha);if(code==='200'||code==='201')return code;execSync('sleep 2');}return 'FAIL:'+code;
}
const TS="1782126736";
const prods=JSON.parse(execSync(`curl -sk --max-time 35 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wc/v3/products?category=106&per_page=100&status=any&_fields=id,name,status"`,{encoding:'utf8',env,maxBuffer:25000000}));
// spalvu leksikonas (saknys -> kanonine reiksme)
const lex=[
 [/antracit/i,'Antracito'],[/pilk\u0161v/i,'Pilk\u0161va'],[/tamsiai pilk/i,'Tamsiai pilka'],[/\u0161viesiai pilk/i,'\u0161viesiai pilka'],[/pilkai ro\u017ein/i,'Pilkai ro\u017ein\u0117'],[/pilk/i,'Pilka'],
 [/m\u0117lynai pilk/i,'M\u0117lynai pilka'],[/m\u0117lyn/i,'M\u0117lyna'],[/melsv/i,'Melsva'],[/\u017eydr/i,'\u017dydra'],[/turkio/i,'Turkio'],[/j\u016bros vand/i,'J\u016bros vandens'],
 [/balt/i,'Balta'],[/krem/i,'Kremin\u0117'],[/sm\u0117li/i,'Sm\u0117lio'],[/kapu\u010din/i,'Kapu\u010dino'],[/garsty\u010di/i,'Garsty\u010di\u0173'],
 [/juod/i,'Juoda'],[/rausvai rud/i,'Rausvai ruda'],[/rud/i,'Ruda'],[/ro\u017ein/i,'Ro\u017ein\u0117'],[/raudon/i,'Raudona'],[/aviet/i,'Avietin\u0117'],
 [/\u017ealsv/i,'\u017dalsva'],[/salotin/i,'Salotin\u0117'],[/\u017eal/i,'\u017dalia'],[/oran\u017ein/i,'Oran\u017ein\u0117'],[/violetin/i,'Violetin\u0117'],[/sidabr/i,'Sidabrin\u0117'],[/\u0161viesus/i,'\u0161viesi']
];
function kind(n){ const s=n.toLowerCase(); if(/semtuv|mentel|lopetel|kastuv/.test(s))return 'SEMTUVELIS'; if(/kilim/.test(s))return 'KILIMELIS'; if(/stovas|laikikl|priedas|filtr/.test(s))return 'PRIEDAS'; if(/tualet|namelis/.test(s))return 'TUALETAS'; if(/guolis|sleptuve/.test(s))return 'STRAGLERIS'; return 'KITA'; }
function colors(n){ const found=[]; for(const [re,val] of lex){ if(re.test(n) && !found.includes(val)) found.push(val); } return found; }
const out={tualetai:[],semtuveliai:[],kita:[]};
let noColor=0;
for(const p of prods){
  const k=kind(p.name); const c=colors(p.name);
  if(!c.length) noColor++;
  const row={id:p.id,kind:k,colors:c,name:p.name.slice(0,55)};
  if(k==='TUALETAS') out.tualetai.push(row);
  else if(k==='SEMTUVELIS') out.semtuveliai.push(row);
  else out.kita.push(row);
}
out.summary={viso:prods.length,tualetai:out.tualetai.length,semtuveliai:out.semtuveliai.length,kita:out.kita.length,be_spalvos:noColor};
out.fin=putResult('spalvos_recon_'+TS+'.txt', out);
