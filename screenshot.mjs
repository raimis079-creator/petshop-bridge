import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'rp',content:Buffer.from(JSON.stringify(o,null,1)).toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:40*1024*1024});}
function get(u,mt){try{return execSync(`curl -sLk --max-time ${mt||25} -A "Mozilla/5.0 Chrome/120" "${u}"`,{maxBuffer:25*1024*1024}).toString();}catch(e){return '';}}
const o={};
// kategorija -> produktu nuorodos
const cat=get('https://www.realdog.lt/dry-dog-food');
const links=[...new Set([...cat.matchAll(/href="([^"]+)"/gi)].map(m=>m[1]).filter(u=>/realdog\.lt/.test(u)||u.startsWith('/')))].map(u=>u.startsWith('/')?'https://www.realdog.lt'+u:u);
o.cat_links=links.filter(u=>!/search|contact|news|blog|dry-dog|super-premium|high-premium|snack|maistas-alerg|wet|puppies$|cdn|#|facebook|instagram/i.test(u)).slice(0,20);
// pirmas produktas - pilna anatomija
const target=o.cat_links[0];
o.target=target;
if(target){
  const h=get(target,30);
  o.bytes=h.length;
  o.title=(h.match(/<title[^>]*>([\s\S]*?)<\/title>/i)||[,''])[1].replace(/\s+/g,' ').trim().slice(0,90);
  o.tables=(h.match(/<table/gi)||[]).length;
  let b=(h.match(/<body[\s\S]*<\/body>/i)||[h])[0].replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ');
  const txt=b.replace(/<[^>]+>/g,'\n').replace(/&nbsp;/g,' ').split('\n').map(x=>x.trim()).filter(Boolean).join(' | ');
  o.txt_len=txt.length;
  for(const kw of ['norma','Norma','šėrim','Šėrim','kiekis','Kiekis','svor','Svor','gram','feeding','Rekomend']){
    const i=txt.indexOf(kw);
    if(i>=0){ o['kw_'+kw]=txt.slice(Math.max(0,i-120),i+560); break; }
  }
  o.txt_mid=txt.slice(500,2200);
  o.imgs=[...h.matchAll(/<img[^>]+src="([^"]*(?:norma|serim|feeding|tabel|lentel)[^"]*)"/gi)].map(x=>x[1]).slice(0,6);
}
pr('rp.json',o); console.log('DONE');
