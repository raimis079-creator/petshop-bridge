import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'r5',content:Buffer.from(JSON.stringify(o,null,1)).toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:40*1024*1024});}
function get(u,mt){try{return execSync(`curl -sLk --max-time ${mt||25} -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" -H "Accept-Language: lt-LT,lt;q=0.9" "${u}"`,{maxBuffer:30*1024*1024}).toString();}catch(e){return '';}}
const B='https://www.royalcanin.com';
const o={};
const cats=['/lt/cats/products/retail-products','/lt/cats/products/adult-cat-food','/lt/cats/products/kitten-food',
            '/lt/dogs/products/retail-products','/lt/dogs/products/adult-dog-food'];
let prod=new Set();
for(const c of cats){
  const h=get(B+c,30);
  for(const m of h.matchAll(/href="([^"]*\/lt\/(?:cats|dogs)\/products\/[^"]+)"/gi)){
    let u=m[1]; if(!u.startsWith('http')) u=B+u;
    if(/retail-products$|adult-cat-food$|kitten-food$|adult-dog-food$|senior|vet-products$/i.test(u)) continue;
    prod.add(u);
  }
}
const P=[...prod];
o.prod_n=P.length; o.sample=P.slice(0,18);
// musu linijos
const want=/giant-adult|medium-adult|hair.*skin|hairball|indoor|oral|sensible|sterilised/i;
o.mine=P.filter(u=>want.test(u)).slice(0,20);
// anatomija: vienas produktas
const t=o.mine[0]||P[0];
o.target=t;
if(t){
  const h=get(t,30);
  o.bytes=h.length;
  o.tables=(h.match(/<table/gi)||[]).length;
  let b=(h.match(/<body[\s\S]*<\/body>/i)||[h])[0].replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ');
  const txt=b.replace(/<[^>]+>/g,'\n').replace(/&nbsp;/g,' ').split('\n').map(x=>x.trim()).filter(Boolean).join(' | ');
  o.txt_len=txt.length;
  for(const kw of ['Šėrimo','šėrimo','norma','Norma','rekomend','g/d','Katės svoris','Šuns svoris']){
    const i=txt.indexOf(kw);
    if(i>=0){ o['kw_'+kw]=txt.slice(Math.max(0,i-150),i+520); break; }
  }
  o.pdfs=[...h.matchAll(/href="([^"]+\.pdf[^"]*)"/gi)].map(x=>x[1]).slice(0,5);
  o.json_ld=(h.match(/application\/ld\+json/gi)||[]).length;
  o.numeric=txt.split(' | ').filter(l=>/\d/.test(l)&&/(kg|g\b)/i.test(l)).slice(0,12);
}
pr('r5.json',o); console.log('DONE n='+o.prod_n);
