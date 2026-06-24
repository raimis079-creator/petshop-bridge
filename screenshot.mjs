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
function buildSerimo(rows){
  let t='\n<p><strong>\u0160\u0117rimo instrukcija:</strong></p>\n<table>\n<tr><th>\u0160uns svoris</th><th>Neaktyvus / senyvas</th><th>Normaliai aktyvus</th><th>Aktyvus</th></tr>\n';
  rows.forEach(r=>{ t+='<tr><td>'+r[0]+' kg</td><td>'+r[1]+' g</td><td>'+r[2]+' g</td><td>'+r[3]+' g</td></tr>\n'; });
  t+='</table>\n<p>Nurodyti kiekiai \u2014 vienam gyv\u016bnui per par\u0105. Pritaikykite pagal gyv\u016bno aktyvum\u0105 ir k\u016bno b\u016bkl\u0119. Visada u\u017etikrinkite prieig\u0105 prie \u0161vie\u017eio geriamojo vandens.</p>';
  return t;
}
const DATA=[
  {recipe:"Lamb & Sweet Potato", ids:[20445,27019,25625], rows:[[5,60,80,100],[10,85,115,140],[20,140,190,240],[30,190,260,330],[40,235,325,410],[60,320,440,555],[80,400,545,600]]},
  {recipe:"Light & Vital", ids:[18046], rows:[[5,55,70,75],[10,100,130,165],[20,165,220,280],[30,220,295,375],[40,275,365,465],[60,365,495,635],[80,455,620,790]]},
  {recipe:"SensiAdult", ids:[26403,25241], rows:[[5,45,65,80],[10,75,100,130],[20,125,175,220],[30,175,235,295],[40,215,295,375],[60,290,400,505],[80,365,495,630]]},
  {recipe:"Salmon & Potato", ids:[17995,21024], rows:[[5,60,80,100],[10,85,115,140],[20,140,190,240],[30,190,260,330],[40,235,325,410],[60,320,440,550],[80,400,545,690]]}
];
const results=[];
for(const D of DATA){
  const ser=buildSerimo(D.rows);
  for(const id of D.ids){
    try{
      let T=readRaw(id);
      if(/<table>/.test(T)){ results.push({id,recipe:D.recipe,SKIP:"jau turi lentele"}); continue; }
      const sm=T.match(/Sud\u0117tis:[\s\S]*?<\/p>/); const sud_md5=sm?md5(sm[0]):"NONE";
      const analPresent=T.indexOf("Analitin")>-1;
      const newT = T + ser;
      const sm2=newT.match(/Sud\u0117tis:[\s\S]*?<\/p>/);
      if(!newT.startsWith(T) || !(sm2&&md5(sm2[0])===sud_md5) || (newT.indexOf("Analitin")>-1)!==analPresent || !/<table>/.test(newT)){ results.push({id,recipe:D.recipe,SKIP:"guard"}); continue; }
      const wc=writeRaw(id,newT);
      const after=readRaw(id);
      results.push({id,recipe:D.recipe,write:wc,
        ver_table:/<td>5 kg<\/td>/.test(after),
        ver_sud:md5((after.match(/Sud\u0117tis:[\s\S]*?<\/p>/)||[""])[0])===sud_md5,
        ver_anal:after.indexOf("Analitin")>-1,
        lossless:md5(after)===md5(newT)});
    }catch(e){ results.push({id,recipe:D.recipe,ERR:String(e).slice(0,100)}); }
  }
}
commit("wave2_"+TS+".json", JSON.stringify(results,null,2));
console.log("DONE "+TS);
