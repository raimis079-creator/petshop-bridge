import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'wj',content:Buffer.from(JSON.stringify(o,null,1)).toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:40*1024*1024});}
function get(u){try{return execSync(`curl -sLk --max-time 25 -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120" "${u}"`,{maxBuffer:30*1024*1024}).toString();}catch(e){return '';}}
const B='https://prinspetfoods.com';
const o={};
// 1. kokie post_type yra
const routes=get(B+'/wp-json/');
o.has_wpjson = routes.length>100;
try{ const j=JSON.parse(routes); o.namespaces=j.namespaces; }catch(e){ o.routes_head=routes.slice(0,200); }
// 2. produktu tipai
for(const pt of ['product','products','wp/v2/product','wp/v2/pages','wp/v2/posts']){
  const p = pt.startsWith('wp/v2')?pt:('wp/v2/'+pt);
  const r=get(`${B}/wp-json/${p}?per_page=1`);
  o['probe_'+pt]= r.slice(0,120);
}
// 3. bandom paimti standard fit puslapi per wp-json su content.rendered
const s=get(`${B}/wp-json/wp/v2/search?search=standard%20fit&per_page=5`);
o.search=s.slice(0,500);
try{
  const arr=JSON.parse(s);
  o.hits=arr.map(x=>({id:x.id,type:x.type,subtype:x.subtype,url:x.url,title:x.title}));
  if(arr.length){
    const h=arr[0];
    const ep = h.subtype==='page'?'pages':(h.subtype||'posts');
    const full=get(`${B}/wp-json/wp/v2/${ep}/${h.id}`);
    try{
      const j=JSON.parse(full);
      const c=(j.content&&j.content.rendered)||'';
      o.content_len=c.length;
      o.content_tables=(c.match(/<table/gi)||[]).length;
      for(const kw of ['feeding','Feeding','gram','Gram','kg','advice','dosage']){
        const i=c.indexOf(kw);
        if(i>=0) o['c_'+kw]=c.slice(Math.max(0,i-100),i+260).replace(/<[^>]+>/g,' ').replace(/\s+/g,' ');
      }
    }catch(e){ o.full_head=full.slice(0,200); }
  }
}catch(e){ o.search_err=String(e.message).slice(0,120); }
// 4. media/pdf
const md=get(`${B}/wp-json/wp/v2/media?search=feeding&per_page=10`);
try{ const arr=JSON.parse(md); o.media=arr.map(x=>({t:x.title&&x.title.rendered,u:x.source_url})).slice(0,10); }catch(e){ o.media_head=md.slice(0,150); }
pr('wj.json',o); console.log('DONE');
