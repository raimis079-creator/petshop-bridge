import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN;
function ghPut(p,buf,m){const u=`https://api.github.com/repos/raimis079-creator/petshop-bridge/contents/${p}`;let s='';try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:m,content:buf.toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:30*1024*1024});}
function get(u){ try{ return execSync(`curl -sL --max-time 20 -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120" "${u}"`,{maxBuffer:20*1024*1024}).toString(); }catch(e){ return ''; } }
const out={};
try{
// 1) HYPS (id19) - kas ten uz lenteliu?
const h=get('https://exclusion.pl/x/3-123-19');
out.hyps_title=((h.match(/<title>([^<]+)<\/title>/i)||[])[1]||'').slice(0,70);
const tabs=h.match(/<table[\s\S]*?<\/table>/gi)||[];
out.hyps_tables=tabs.map(t=>t.replace(/<[^>]+>/g,'|').replace(/&nbsp;/g,' ').replace(/\|+/g,'|').replace(/\s+/g,' ').slice(0,330));
// gal kg ir gr atskirose eilutese?
const txt=h.replace(/<[^>]+>/g,'|').replace(/&nbsp;/g,' ').replace(/\|+/g,'|').replace(/\s+/g,' ');
const i=txt.toLowerCase().indexOf('karmienia');
out.hyps_ctx = i>0 ? txt.slice(i-100, i+500) : txt.slice(0,300);

// 2) kur Noble Grain? bandom kitas kategorijas
const cats=[];
for(const c of [3,4,5,6,122,123,124,125,126,127,128,130,131,132]){
  const u=`https://exclusion.pl/x/${c}-123-155`;
  const r=execSync(`curl -s -o /dev/null -w "%{http_code}" --max-time 12 -L "${u}"`).toString().trim();
  if(r==='200') cats.push(c);
}
out.cat_prefix_ok=cats;
// bandom kita vidurini skaiciu
const mids=[];
for(const m of [120,121,122,124,125,126,127,128,129,130,131,132,133,140,150]){
  const u=`https://exclusion.pl/x/3-${m}-155`;
  const r=execSync(`curl -s -o /dev/null -w "%{http_code}" --max-time 12 -L "${u}"`).toString().trim();
  if(r==='200') mids.push(m);
}
out.mid_ok=mids;

// 3) is svetaines meniu - visos kategoriju nuorodos
const home=get('https://exclusion.pl/');
const links=new Set();
for(const m of home.matchAll(/href="(https?:\/\/exclusion\.pl\/[^"#?]+)"/gi)) links.add(m[1]);
out.home_links=[...links].slice(0,40);
out.home_bytes=home.length;
}catch(e){ out.FATAL=String(e&&e.message?e.message:e).slice(0,400); }
ghPut('screenshots/m8_probe.json',Buffer.from(JSON.stringify(out)),'hyps + NG probe');
console.log('DONE');
