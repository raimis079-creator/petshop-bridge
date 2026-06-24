import { execSync } from "child_process";
import fs from "fs";
import crypto from "crypto";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const md5=s=>crypto.createHash('md5').update(s,'utf8').digest('hex');
function commit(name, str){
  const b64=Buffer.from(str,'utf8').toString('base64');
  const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;
  const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;
  let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}
  const body={message:'r',content:b64,branch:'main'};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));
  return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8',maxBuffer:80000000}).trim();
}
const TS=String(Date.now());
function readRaw(id){const r=JSON.parse(execSync(`curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/${id}?context=edit&_fields=content"`,{encoding:'utf8',env,maxBuffer:20000000}));return (r.content&&r.content.raw)||'';}
function writeRaw(id, content){fs.writeFileSync('/tmp/body.json',JSON.stringify({content}));return execSync(`curl -sk --max-time 40 -o /dev/null -w "%{http_code}" -X PUT -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" -d @/tmp/body.json "https://dev.avesa.lt/wp-json/wp/v2/product/${id}"`,{encoding:'utf8',env,maxBuffer:50000000}).trim();}

// 3-stulpeliu lentele LT
function buildSerimo(rows){
  let t='<p><strong>\u0160\u0117rimo instrukcija:</strong></p>\n<table>\n<tr><th>\u0160uns svoris</th><th>Neaktyvus / senyvas</th><th>Normaliai aktyvus</th><th>Aktyvus</th></tr>\n';
  rows.forEach(r=>{ t+='<tr><td>'+r[0]+' kg</td><td>'+r[1]+' g</td><td>'+r[2]+' g</td><td>'+r[3]+' g</td></tr>\n'; });
  t+='</table>\n<p>Nurodyti kiekiai \u2014 vienam gyv\u016bnui per par\u0105. Pritaikykite pagal gyv\u016bno aktyvum\u0105 ir k\u016bno b\u016bkl\u0119. Visada u\u017etikrinkite prieig\u0105 prie \u0161vie\u017eio geriamojo vandens.</p>';
  return t;
}

const DATA=[
  {recipe:"SensiPlus", ids:[19921,19920,17978], rows:[[5,55,65,85],[10,88,118,145],[20,140,195,245],[30,190,260,330],[40,240,325,410],[60,350,455,560],[80,400,545,690]]},
  {recipe:"SeniorPlus", ids:[25463,26395,20450], rows:[[5,48,65,70],[10,85,115,145],[20,145,195,245],[30,195,260,335],[40,240,325,410],[60,325,440,560],[80,400,550,700]]},
  {recipe:"Hypoallergenic", ids:[26445,26391,25617], rows:[[5,75,85,100],[10,120,145,165],[20,205,245,280],[30,280,330,380],[40,345,410,475],[60,470,555,640],[80,580,690,800]]}
];

const results=[];
for(const D of DATA){
  const ser=buildSerimo(D.rows);
  for(const id of D.ids){
    try{
      let T=readRaw(id);
      if(/<table>/.test(T)){ results.push({id,recipe:D.recipe,SKIP:"jau turi lentele"}); continue; }
      const sm=T.match(/Sud\u0117tis:[\s\S]*?<\/p>/); const sud_md5=sm?md5(sm[0]):"NONE";
      const am=T.match(/<p><strong>Analitin[\s\S]*?<\/p>\s*<p>[\s\S]*?<\/p>/); const anal_md5=am?md5(am[0]):"NONE";
      let newT = am ? T.replace(am[0], am[0]+"\n"+ser) : T.trimEnd()+"\n"+ser+"\n";
      const sm2=newT.match(/Sud\u0117tis:[\s\S]*?<\/p>/);
      const am2=newT.match(/<p><strong>Analitin[\s\S]*?<\/p>\s*<p>[\s\S]*?<\/p>/);
      if(!(sm2&&md5(sm2[0])===sud_md5) || !(am2&&md5(am2[0])===anal_md5) || !/<table>/.test(newT)){ results.push({id,recipe:D.recipe,SKIP:"guard"}); continue; }
      const wc=writeRaw(id,newT);
      const after=readRaw(id);
      results.push({id,recipe:D.recipe,write:wc,
        ver_table:/<td>5 kg<\/td>/.test(after) && /<table>/.test(after),
        ver_sud:md5((after.match(/Sud\u0117tis:[\s\S]*?<\/p>/)||[""])[0])===sud_md5,
        ver_anal:md5((after.match(/<p><strong>Analitin[\s\S]*?<\/p>\s*<p>[\s\S]*?<\/p>/)||[""])[0])===anal_md5,
        lossless:md5(after)===md5(newT)});
    }catch(e){ results.push({id,recipe:D.recipe,ERR:String(e).slice(0,100)}); }
  }
}
commit("wave1_"+TS+".json", JSON.stringify(results,null,2));
console.log("DONE "+TS);
