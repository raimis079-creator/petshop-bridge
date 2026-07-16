const G='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCFpc3NldCgkX0dFVFsncHNfZ3QnXSl8fCRfR0VUWydwc19ndCddIT09J0d0NVdxOUxkJyl7cmV0dXJuO30KCUBzZXRfdGltZV9saW1pdCgzMDApOyBnbG9iYWwgJHdwZGI7ICRwZj0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgnaXRlbXMnPT5hcnJheSgpKTsKCSRpZHM9Z2V0X3Bvc3RzKGFycmF5KCdwb3N0X3R5cGUnPT4ncHJvZHVjdCcsJ3Bvc3Rfc3RhdHVzJz0+J3B1Ymxpc2gnLCdwb3N0c19wZXJfcGFnZSc9Pi0xLCdmaWVsZHMnPT4naWRzJykpOwoJZm9yZWFjaCgkaWRzIGFzICRpZCl7CgkJJG1hbj0oc3RyaW5nKWdldF9wb3N0X21ldGEoJGlkLCdfbGVnYWN5X21hbnVmYWN0dXJlcicsdHJ1ZSk7CgkJJHRpdGxlPWdldF90aGVfdGl0bGUoJGlkKTsKCQlpZihzdHJpcG9zKCRtYW4sJ2dlbW9uJyk9PT1mYWxzZSAmJiBzdHJpcG9zKCR0aXRsZSwnZ2Vtb24nKT09PWZhbHNlKSBjb250aW51ZTsKCQkkcD13Y19nZXRfcHJvZHVjdCgkaWQpOyBpZighJHAgfHwgJHAtPmdldF9zdG9ja19zdGF0dXMoKSE9PSdpbnN0b2NrJykgY29udGludWU7CgkJJG1hcHBlZD0oaW50KSR3cGRiLT5nZXRfdmFyKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgZmVlZGluZ190YWJsZV9pZCBGUk9NIHskcGZ9cHNfZmVlZGluZ19tYXAgV0hFUkUgcHJvZHVjdF9pZD0lZCIsJGlkKSk7CgkJaWYoJG1hcHBlZCkgY29udGludWU7CgkJJG9bJ2l0ZW1zJ11bXT1hcnJheSgnc2t1Jz0+KHN0cmluZylnZXRfcG9zdF9tZXRhKCRpZCwnX3NrdScsdHJ1ZSksCgkJCSd0aXRsZSc9Pmh0bWxfZW50aXR5X2RlY29kZSgkdGl0bGUsRU5UX1FVT1RFU3xFTlRfSFRNTDUsJ1VURi04JyksCgkJCSdtYW4nPT4kbWFuKTsKCX0KCSRvWyduJ109Y291bnQoJG9bJ2l0ZW1zJ10pOwoJaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0pOwo=';
import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'g8',content:Buffer.from(JSON.stringify(o,null,1)).toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:40*1024*1024});}
const U=process.env.WP_USER||'',P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
fs.writeFileSync('/tmp/wpu',U);fs.writeFileSync('/tmp/wpp',P);
function hit(u){try{return execSync(`curl -sk -m 150 -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" "${u}"`,{maxBuffer:60*1024*1024}).toString();}catch(e){return 'ERR';}}
function wj(m,p,b){fs.writeFileSync('/tmp/b.json',JSON.stringify(b));try{return execSync(`curl -sk -m 90 -X ${m} -H "Content-Type: application/json" -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" -d @/tmp/b.json "https://dev.avesa.lt/wp-json/${p}"`,{maxBuffer:20*1024*1024}).toString();}catch(e){return 'ERR';}}
function get(u,mt){try{return execSync(`curl -sLk --max-time ${mt||22} -A "Mozilla/5.0 Chrome/120" "${u}"`,{maxBuffer:25*1024*1024}).toString();}catch(e){return '';}}
const o={};
const mk=wj('POST','code-snippets/v1/snippets',{name:'Gemon Titles v1 (read-only)',code:Buffer.from(G,'base64').toString('utf8'),scope:'front-end',active:true,priority:10});
let id=null; try{id=JSON.parse(mk).id;}catch(e){o.mk=mk.slice(0,200);}
if(id){ const r=hit('https://dev.avesa.lt/?ps_gt=Gt5Wq9Ld'); try{o.wp=JSON.parse(r);}catch(e){o.raw=r.slice(0,500);}
        wj('POST',`code-snippets/v1/snippets/${id}`,{active:false}); }
// visu gemon PDF vardai
let urls=[];
const rob=get('https://www.monge.it/robots.txt');
let maps=[...rob.matchAll(/Sitemap:\s*(\S+)/gi)].map(m=>m[1].trim());
if(!maps.length) maps=['https://www.monge.it/sitemap_index.xml'];
const seen=new Set(); const q=[...maps];
while(q.length && seen.size<26){
  const sm=q.shift(); if(!sm||seen.has(sm))continue; seen.add(sm);
  const xml=get(sm); if(!xml||!/<loc>/i.test(xml))continue;
  const locs=[...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)].map(m=>m[1]);
  if(/<sitemapindex/i.test(xml)){ for(const l of locs) q.push(l); }
  else urls.push(...locs);
}
const gem=[...new Set(urls.filter(u=>/gemon/i.test(u) && /\/(prodotto|producto|product|products)\//i.test(u)))];
const pdfset=new Set();
for(const u of gem.slice(0,70)){
  const h=get(u); if(!h) continue;
  for(const x of [...h.matchAll(/href="([^"]+[Gg]emon[^"]*\.pdf[^"]*)"/gi)].map(x=>x[1])) pdfset.add(x);
}
o.all_pdfs=[...pdfset].map(u=>decodeURIComponent(u.split('/').pop()));
pr('g8.json',o); console.log('DONE');
