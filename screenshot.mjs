import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'op2',content:Buffer.from(JSON.stringify(o,null,1)).toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:40*1024*1024});}
function get(u,mt){try{return execSync(`curl -sLk --max-time ${mt||22} -A "Mozilla/5.0 Chrome/120" "${u}"`,{maxBuffer:25*1024*1024}).toString();}catch(e){return '';}}
function dec(s){return s.replace(/&nbsp;/g,' ').replace(/&amp;/g,'&');}
function allT(html){const res=[];for(const t of (html.match(/<table[\s\S]*?<\/table>/gi)||[])){const rows=[];
 for(const tr of (t.match(/<tr[\s\S]*?<\/tr>/gi)||[])){const c=[...tr.matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map(m=>dec(m[1].replace(/<[^>]+>/g,' ')).replace(/\s+/g,' ').trim());if(c.length)rows.push(c);}
 if(rows.length)res.push(rows);} return res;}
const o={};
// A. ontariopet.com home -> nuorodos
const h=get('https://www.ontariopet.com');
o.home_bytes=h.length;
o.home_title=(h.match(/<title[^>]*>([\s\S]*?)<\/title>/i)||[,''])[1].trim().slice(0,60);
const links=[...new Set([...h.matchAll(/href="([^"]+)"/gi)].map(m=>m[1]))].filter(u=>/ontariopet\.com/.test(u)||u.startsWith('/')).slice(0,40);
o.home_links=links.slice(0,20);
// B. produkto psl. bandymas: musu produkto pavadinimu google-free spejimas per ceku e-shop placek (zoohit/spokojenypes danai turi Ontario)
const sites=[['zoohit_cz','https://www.zoohit.cz'],['spokojenypes','https://www.spokojenypes.cz'],['zooplus_de','https://www.zooplus.de']];
o.retail={};
for(const [n,base] of sites){
  const urls=[];
  try{
    const rob=get(base+'/robots.txt');
    let maps=[...rob.matchAll(/Sitemap:\s*(\S+)/gi)].map(m=>m[1].trim());
    if(!maps.length) maps=[base+'/sitemap.xml',base+'/sitemap_index.xml'];
    const seen=new Set(); const q=[...maps];
    while(q.length && seen.size<18){
      const sm=q.shift(); if(!sm||seen.has(sm))continue; seen.add(sm);
      const xml=get(sm); if(!xml)continue;
      const locs=[...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)].map(m=>m[1]);
      if(/<sitemapindex/i.test(xml)){ for(const l of locs) if(/prod|shop|dog|hund|pes/i.test(l)) q.push(l); }
      else for(const l of locs) if(/ontario/i.test(l)) urls.push(l);
    }
  }catch(e){}
  const uu=[...new Set(urls)];
  o.retail[n]={n:uu.length,sample:uu.slice(0,5)};
  if(uu.length){
    o.retail[n].pages={};
    for(const u of uu.filter(x=>/adult|puppy|mini|medium|large/i.test(x)).slice(0,5)){
      const hh=get(u); if(!hh) continue;
      const tb=allT(hh).filter(rr=>{const f=rr.flat().join(' ').toLowerCase();
        return /(váha|hmotnost|gewicht|weight|kg)/.test(f)&&/(g\/|gram|den|tag|day|krmn)/.test(f)&&rr.length>=2;});
      if(tb.length) o.retail[n].pages[u]={tables:tb.slice(0,1)};
    }
  }
}
pr('op2.json',o); console.log('DONE');
