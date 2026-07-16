const PPHP='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCFpc3NldCgkX0dFVFsncHNfcHJuJ10pfHwkX0dFVFsncHNfcHJuJ10hPT0nUHI4TnM0VHEnKXtyZXR1cm47fQoJQHNldF90aW1lX2xpbWl0KDMwMCk7IGdsb2JhbCAkd3BkYjsgJHBmPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCk7CgkkaWRzPWdldF9wb3N0cyhhcnJheSgncG9zdF90eXBlJz0+J3Byb2R1Y3QnLCdwb3N0X3N0YXR1cyc9PidwdWJsaXNoJywncG9zdHNfcGVyX3BhZ2UnPT4tMSwnZmllbGRzJz0+J2lkcycpKTsKCSRwcz1hcnJheSgpOwoJZm9yZWFjaCgkaWRzIGFzICRpZCl7CgkJLy8gYnJhbmQgdGFrc29ub21pamEgbmVwYXRpa2ltYSAoNDMgbWFudWYgdnMgMjMgYnJhbmQpIC0+IF9sZWdhY3lfbWFudWZhY3R1cmVyCgkJJG1hbj0oc3RyaW5nKWdldF9wb3N0X21ldGEoJGlkLCdfbGVnYWN5X21hbnVmYWN0dXJlcicsdHJ1ZSk7CgkJJHRpdGxlPWdldF90aGVfdGl0bGUoJGlkKTsKCQlpZihzdHJpcG9zKCRtYW4sJ3ByaW5zJyk9PT1mYWxzZSAmJiBzdHJpcG9zKCR0aXRsZSwncHJpbnMnKT09PWZhbHNlKSBjb250aW51ZTsKCQkkcD13Y19nZXRfcHJvZHVjdCgkaWQpOyBpZighJHApIGNvbnRpbnVlOwoJCSRtYXBwZWQ9KGludCkkd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIGZlZWRpbmdfdGFibGVfaWQgRlJPTSB7JHBmfXBzX2ZlZWRpbmdfbWFwIFdIRVJFIHByb2R1Y3RfaWQ9JWQiLCRpZCkpOwoJCSRwc1tdPWFycmF5KCdpZCc9PiRpZCwnc2t1Jz0+KHN0cmluZylnZXRfcG9zdF9tZXRhKCRpZCwnX3NrdScsdHJ1ZSksJ3QnPT5tYl9zdWJzdHIoJHRpdGxlLDAsNzQpLAoJCQknbWFuJz0+JG1hbiwnc3RvY2snPT4kcC0+Z2V0X3N0b2NrX3N0YXR1cygpLCdtYXAnPT4kbWFwcGVkPzpudWxsKTsKCX0KCSRvWyd0b3RhbCddPWNvdW50KCRwcyk7CgkkaW49YXJyYXlfZmlsdGVyKCRwcyxmdW5jdGlvbigkcil7cmV0dXJuICRyWydzdG9jayddPT09J2luc3RvY2snO30pOwoJJG9bJ2luc3RvY2snXT1jb3VudCgkaW4pOwoJJG9bJ21hcHBlZCddPWNvdW50KGFycmF5X2ZpbHRlcigkaW4sZnVuY3Rpb24oJHIpe3JldHVybiAoYm9vbCkkclsnbWFwJ107fSkpOwoJJG9bJ3VubWFwcGVkJ109YXJyYXlfdmFsdWVzKGFycmF5X2ZpbHRlcigkaW4sZnVuY3Rpb24oJHIpe3JldHVybiAhJHJbJ21hcCddO30pKTsKCSRvWyd1bm1hcHBlZF9uJ109Y291bnQoJG9bJ3VubWFwcGVkJ10pOwoJaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0pOwo=';
import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'pr',content:Buffer.from(JSON.stringify(o,null,1)).toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:40*1024*1024});}
const U=process.env.WP_USER||'',P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
fs.writeFileSync('/tmp/wpu',U);fs.writeFileSync('/tmp/wpp',P);
function hit(u){try{return execSync(`curl -sk -m 150 -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" "${u}"`,{maxBuffer:60*1024*1024}).toString();}catch(e){return 'ERR';}}
function wj(m,p,b){fs.writeFileSync('/tmp/b.json',JSON.stringify(b));try{return execSync(`curl -sk -m 60 -X ${m} -H "Content-Type: application/json" -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" -d @/tmp/b.json "https://dev.avesa.lt/wp-json/${p}"`,{maxBuffer:20*1024*1024}).toString();}catch(e){return 'ERR';}}
function get(u){try{return execSync(`curl -sLk --max-time 25 -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120" "${u}"`,{maxBuffer:30*1024*1024}).toString();}catch(e){return '';}}
const o={};
const mk=wj('POST','code-snippets/v1/snippets',{name:'Prins Recon v1 (read-only)',code:Buffer.from(PPHP,'base64').toString('utf8'),scope:'front-end',active:true,priority:10});
let id=null; try{id=JSON.parse(mk).id;}catch(e){o.mk=mk.slice(0,200);}
if(id){ const r=hit('https://dev.avesa.lt/?ps_prn=Pr8Ns4Tq'); try{o.wp=JSON.parse(r);}catch(e){o.wp_raw=r.slice(0,600);}
        wj('POST',`code-snippets/v1/snippets/${id}`,{active:false}); }
// saltiniai - filtras platus (S218 pamoka: sub-brendu URL neturi motininio vardo)
const sites=[['prins_nl','https://www.prins.nl'],['prinspetfoods','https://www.prinspetfoods.com'],
             ['prins_com','https://prinspetfoods.nl'],['petmarket','https://petmarket.lt']];
o.disc={};
for(const [n,base] of sites){
  const urls=[];
  try{
    const rob=get(base+'/robots.txt');
    let maps=[...rob.matchAll(/Sitemap:\s*(\S+)/gi)].map(m=>m[1].trim());
    if(!maps.length) maps=[base+'/sitemap.xml',base+'/sitemap_index.xml',base+'/wp-sitemap.xml'];
    const seen=new Set(); const q=[...maps];
    while(q.length && seen.size<28){
      const sm=q.shift(); if(!sm||seen.has(sm))continue; seen.add(sm);
      const xml=get(sm); if(!xml)continue;
      const locs=[...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)].map(m=>m[1]);
      if(/<sitemapindex/i.test(xml)){ for(const l of locs) q.push(l); }
      else for(const l of locs) if(/procare|vitalcare|fit|opti|prins|hondenvoer|kattenvoer/i.test(l)) urls.push(l);
    }
  }catch(e){}
  const uu=[...new Set(urls)];
  o.disc[n]={n:uu.length,sample:uu.slice(0,10)};
}
pr('pr.json',o); console.log('DONE');
