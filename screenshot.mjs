const U_B64='WyJodHRwczovL3BldG1hcmtldC5sdC9wcm9kdWt0YXMvZXhjbHVzaW9uLW1lZGl0ZXJyYW5lby1iZWdydWRpcy1tYWlzdGFzLWthdGVtcy1zdS1qYXV0aWVuYS0xNS1rZy8iLCAiaHR0cHM6Ly9wZXRtYXJrZXQubHQvcHJvZHVrdGFzL2V4Y2x1c2lvbi1tZWRpdGVycmFuZW8tbWFpc3Rhcy1rYWNpdWthbXMtc3UtdmlzdGllbmEtMTUta2cvIiwgImh0dHBzOi8vcGV0bWFya2V0Lmx0L3Byb2R1a3Rhcy9leGNsdXNpb24tbWVkaXRlcnJhbmVvLW1haXN0YXMta2F0ZW1zLXN1LXZpc3RpZW5hLTE1LWtnLyIsICJodHRwczovL3BldG1hcmtldC5sdC9wcm9kdWt0YXMvZXhjbHVzaW9uLW1lZGl0ZXJyYW5lby1tYWlzdGFzLXN0ZXJpbGl6dW90b21zLWRpZGVsZW1zLWthdGVtcy1zdS12aXN0aWVuYS0xNS1rZy8iLCAiaHR0cHM6Ly9wZXRtYXJrZXQubHQvcHJvZHVrdGFzL2V4Y2x1c2lvbi1tZWRpdGVycmFuZW8tbWFpc3Rhcy1zdGVyaWxpenVvdG9tcy1rYXRlbXMtc3UtdHVudS0xNS1rZy8iLCAiaHR0cHM6Ly9wZXRtYXJrZXQubHQvcHJvZHVrdGFzL2V4Y2x1c2lvbi1tZWRpdGVycmFuZW8tbWFpc3Rhcy1zdW5pbXMtc3UtamF1dGllbmEtbC0xMi1nLyIsICJodHRwczovL3BldG1hcmtldC5sdC9wcm9kdWt0YXMvZXhjbHVzaW9uLW1lZGl0ZXJyYW5lby1tYWlzdGFzLXN1bml1a2Ftcy1zdS1qYXV0aWVuYS1tLTEyLWtnLyIsICJodHRwczovL3BldG1hcmtldC5sdC9wcm9kdWt0YXMvZXhjbHVzaW9uLW1lZGl0ZXJyYW5lby1tYWlzdGFzLXN1bml1a2Ftcy1zdS1qYXV0aWVuYS1tLTMta2cvIiwgImh0dHBzOi8vcGV0bWFya2V0Lmx0L3Byb2R1a3Rhcy9leGNsdXNpb24tbWVkaXRlcnJhbmVvLW1haXN0YXMtc3VuaXVrYW1zLXN1LWphdXRpZW5hLXMtMi1rZy8iLCAiaHR0cHM6Ly9wZXRtYXJrZXQubHQvcHJvZHVrdGFzL2V4Y2x1c2lvbi1tZWRpdGVycmFuZW8tbWFpc3Rhcy1zdW5pdWthbXMtc3UtamF1dGllbmEtcy03LWtnLyIsICJodHRwczovL3BldG1hcmtldC5sdC9wcm9kdWt0YXMvZXhjbHVzaW9uLW1lZGl0ZXJyYW5lby1tYWlzdGFzLXN1bml1a2Ftcy1zdS10dW51LWwtMTIta2cvIiwgImh0dHBzOi8vcGV0bWFya2V0Lmx0L3Byb2R1a3Rhcy9leGNsdXNpb24tbWVkaXRlcnJhbmVvLW1haXN0YXMtc3VuaXVrYW1zLXN1LXR1bnUtbS0zLWtnLyIsICJodHRwczovL3BldG1hcmtldC5sdC9wcm9kdWt0YXMvZXhjbHVzaW9uLW1lZGl0ZXJyYW5lby1zYXVzYXMtbWFpc3Rhcy1zdGVyaWxpenVvdG9tcy1rYXRlbXMtc3UtdHVudS0xMi1rZy8iXQ==';
import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function putResult(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'pm2',content:Buffer.from(JSON.stringify(o,null,1)).toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:40*1024*1024});}
function get(u){try{return execSync(`curl -sLk --max-time 30 -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120" "${u}"`,{maxBuffer:30*1024*1024}).toString();}catch(e){return '';}}
function dec(s){return s.replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&#8211;|&ndash;|&#8212;/g,'-').replace(/&quot;/g,'"');}
function allTables(html){const res=[];for(const t of (html.match(/<table[\s\S]*?<\/table>/gi)||[])){const rows=[];
 for(const tr of (t.match(/<tr[\s\S]*?<\/tr>/gi)||[])){const c=[...tr.matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map(m=>dec(m[1].replace(/<[^>]+>/g,' ')).replace(/\s+/g,' ').trim());if(c.length)rows.push(c);}
 if(rows.length)res.push({rows});} return res;}
const urls=JSON.parse(Buffer.from(U_B64,'base64').toString('utf8'));
const o={pages:{}};
for(const u of urls){
  const h=get(u);
  if(!h){o.pages[u]={err:'tuscias'};continue;}
  const tabs=allTables(h);
  const title=dec(((h.match(/<title[^>]*>([\s\S]*?)<\/title>/i)||[,''])[1]).replace(/<[^>]+>/g,'')).replace(/\s+/g,' ').trim().slice(0,120);
  const sku=(h.match(/(?:SKU|Prekės kodas|Kodas)[:\s<\/a-z"=]*([A-Z]{2,4}[A-Z0-9\-]{2,10})/i)||[,''])[1];
  o.pages[u]={title,sku,n_tables:tabs.length,tables:tabs.slice(0,4),bytes:h.length};
}
putResult('pm2.json',o);
console.log('DONE');
