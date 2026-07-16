const EPHP='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCFpc3NldCgkX0dFVFsncHNfZXhyJ10pfHwkX0dFVFsncHNfZXhyJ10hPT0nRXg0TXA3UXonKXtyZXR1cm47fQoJQHNldF90aW1lX2xpbWl0KDMwMCk7IGdsb2JhbCAkd3BkYjsgJHBmPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCk7CgkvLyBFeGNsdXNpb24gcHJvZHVrdGFpIHBlciBicmFuZCB0YWtzb25vbWlqYSBBUkJBIF9sZWdhY3lfbWFudWZhY3R1cmVyCgkkaWRzPWdldF9wb3N0cyhhcnJheSgncG9zdF90eXBlJz0+J3Byb2R1Y3QnLCdwb3N0X3N0YXR1cyc9PidwdWJsaXNoJywncG9zdHNfcGVyX3BhZ2UnPT4tMSwnZmllbGRzJz0+J2lkcycpKTsKCSRleD1hcnJheSgpOwoJZm9yZWFjaCgkaWRzIGFzICRpZCl7CgkJJHNrdT0oc3RyaW5nKWdldF9wb3N0X21ldGEoJGlkLCdfc2t1Jyx0cnVlKTsKCQkkbWFuPShzdHJpbmcpZ2V0X3Bvc3RfbWV0YSgkaWQsJ19sZWdhY3lfbWFudWZhY3R1cmVyJyx0cnVlKTsKCQkkdGl0bGU9Z2V0X3RoZV90aXRsZSgkaWQpOwoJCSRpc2V4ID0gKHN0cmlwb3MoJG1hbiwnZXhjbHVzaW9uJykhPT1mYWxzZSkgfHwgKHN0cmlwb3MoJHRpdGxlLCdleGNsdXNpb24nKSE9PWZhbHNlKQoJCSAgICAgICAgfHwgcHJlZ19tYXRjaCgnL14oSFl8SEh8SU58VVJ8UkV8REl8SEV8TU18TU98TkcpL2knLCRza3UpOwoJCWlmKCEkaXNleCkgY29udGludWU7CgkJJHA9d2NfZ2V0X3Byb2R1Y3QoJGlkKTsgaWYoISRwKSBjb250aW51ZTsKCQkkbWFwcGVkPShpbnQpJHdwZGItPmdldF92YXIoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBmZWVkaW5nX3RhYmxlX2lkIEZST00geyRwZn1wc19mZWVkaW5nX21hcCBXSEVSRSBwcm9kdWN0X2lkPSVkIiwkaWQpKTsKCQkkZXhbXT1hcnJheSgnaWQnPT4kaWQsJ3NrdSc9PiRza3UsJ3QnPT5tYl9zdWJzdHIoJHRpdGxlLDAsNzApLAoJCQknc3RvY2snPT4kcC0+Z2V0X3N0b2NrX3N0YXR1cygpLCdtYXAnPT4kbWFwcGVkPzpudWxsKTsKCX0KCSRvWyd0b3RhbCddPWNvdW50KCRleCk7Cgkkb1snaW5zdG9jayddPWNvdW50KGFycmF5X2ZpbHRlcigkZXgsZnVuY3Rpb24oJHIpe3JldHVybiAkclsnc3RvY2snXT09PSdpbnN0b2NrJzt9KSk7Cgkkb1snaW5zdG9ja19tYXBwZWQnXT1jb3VudChhcnJheV9maWx0ZXIoJGV4LGZ1bmN0aW9uKCRyKXtyZXR1cm4gJHJbJ3N0b2NrJ109PT0naW5zdG9jaycgJiYgJHJbJ21hcCddO30pKTsKCSRvWydpbnN0b2NrX3VubWFwcGVkJ109YXJyYXlfdmFsdWVzKGFycmF5X2ZpbHRlcigkZXgsZnVuY3Rpb24oJHIpe3JldHVybiAkclsnc3RvY2snXT09PSdpbnN0b2NrJyAmJiAhJHJbJ21hcCddO30pKTsKCSRvWyd1bm1hcHBlZF9uJ109Y291bnQoJG9bJ2luc3RvY2tfdW5tYXBwZWQnXSk7CgloZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSk7Cg==';
import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function putResult(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'ex',content:Buffer.from(JSON.stringify(o,null,1)).toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:40*1024*1024});}
const U=process.env.WP_USER||'',P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
fs.writeFileSync('/tmp/wpu',U);fs.writeFileSync('/tmp/wpp',P);
function hit(u){try{return execSync(`curl -sk -m 150 -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" "${u}"`,{maxBuffer:60*1024*1024}).toString();}catch(e){return 'ERR';}}
function wj(m,p,b){fs.writeFileSync('/tmp/b.json',JSON.stringify(b));try{return execSync(`curl -sk -m 60 -X ${m} -H "Content-Type: application/json" -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" -d @/tmp/b.json "https://dev.avesa.lt/wp-json/${p}"`,{maxBuffer:20*1024*1024}).toString();}catch(e){return 'ERR';}}
function get(u){try{return execSync(`curl -sLk --max-time 25 -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120" "${u}"`,{maxBuffer:30*1024*1024}).toString();}catch(e){return '';}}
const o={};

// A. WP recon
const mk=wj('POST','code-snippets/v1/snippets',{name:'Exclusion Recon v1 (read-only, likutis)',code:Buffer.from(EPHP,'base64').toString('utf8'),scope:'front-end',active:true,priority:10});
let id=null; try{id=JSON.parse(mk).id;}catch(e){o.mk=mk.slice(0,200);}
if(id){ const r=hit('https://dev.avesa.lt/?ps_exr=Ex4Mp7Qz'); try{o.wp=JSON.parse(r);}catch(e){o.wp_raw=r.slice(0,800);}
        wj('POST',`code-snippets/v1/snippets/${id}`,{active:false}); o.snip=id; }

// B. Saltiniu medziokle: sitemap -> exclusion/mediterraneo
const sites=[['kika','https://www.kika.lt'],['zoomarket','https://www.zoomarket.lt'],
             ['petmarket','https://www.petmarket.lt'],['vetlita','https://vetlita.lt'],
             ['exclusion_lt','https://exclusion.lt'],['petirvet','https://petirvet.lt']];
o.sites={};
for(const [n,base] of sites){
  const r={};
  try{
    const rob=get(base+'/robots.txt');
    let maps=[...rob.matchAll(/Sitemap:\s*(\S+)/gi)].map(m=>m[1].trim());
    if(!maps.length) maps=[base+'/wp-sitemap.xml',base+'/sitemap_index.xml',base+'/sitemap.xml'];
    const seen=new Set(); const q=[...maps]; const urls=[];
    while(q.length && seen.size<25){
      const sm=q.shift(); if(!sm||seen.has(sm))continue; seen.add(sm);
      const xml=get(sm); if(!xml)continue;
      const locs=[...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)].map(m=>m[1]);
      if(/<sitemapindex/i.test(xml)){ for(const l of locs) if(/produkt|product|preke/i.test(l)) q.push(l); }
      else for(const l of locs) if(/exclusion|mediterraneo|noble/i.test(l)) urls.push(l);
    }
    r.n=[...new Set(urls)].length; r.sample=[...new Set(urls)].slice(0,10);
    r.puppy=[...new Set(urls)].filter(u=>/puppy|szczen|suniuk|jauni|kitten|kaciuk|cat|kate/i.test(u)).slice(0,12);
  }catch(e){ r.err=String(e.message).slice(0,150); }
  o.sites[n]=r;
}
putResult('ex.json',o); console.log('DONE');
