const JPHP='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCFpc3NldCgkX0dFVFsncHNfam9zJ10pfHwkX0dFVFsncHNfam9zJ10hPT0nSm82UnQzV2snKXtyZXR1cm47fQoJQHNldF90aW1lX2xpbWl0KDMwMCk7IGdsb2JhbCAkd3BkYjsgJHBmPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCk7CgkkaWRzPWdldF9wb3N0cyhhcnJheSgncG9zdF90eXBlJz0+J3Byb2R1Y3QnLCdwb3N0X3N0YXR1cyc9PidwdWJsaXNoJywncG9zdHNfcGVyX3BhZ2UnPT4tMSwnZmllbGRzJz0+J2lkcycpKTsKCSRqcz1hcnJheSgpOwoJZm9yZWFjaCgkaWRzIGFzICRpZCl7CgkJJHRpdGxlPWdldF90aGVfdGl0bGUoJGlkKTsKCQkkbWFuPShzdHJpbmcpZ2V0X3Bvc3RfbWV0YSgkaWQsJ19sZWdhY3lfbWFudWZhY3R1cmVyJyx0cnVlKTsKCQlpZihzdHJpcG9zKCR0aXRsZSwnam9zZXJhJyk9PT1mYWxzZSAmJiBzdHJpcG9zKCRtYW4sJ2pvc2VyYScpPT09ZmFsc2UpIGNvbnRpbnVlOwoJCSRwPXdjX2dldF9wcm9kdWN0KCRpZCk7IGlmKCEkcCkgY29udGludWU7CgkJJG1hcHBlZD0oaW50KSR3cGRiLT5nZXRfdmFyKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgZmVlZGluZ190YWJsZV9pZCBGUk9NIHskcGZ9cHNfZmVlZGluZ19tYXAgV0hFUkUgcHJvZHVjdF9pZD0lZCIsJGlkKSk7CgkJJGpzW109YXJyYXkoJ2lkJz0+JGlkLCdza3UnPT4oc3RyaW5nKWdldF9wb3N0X21ldGEoJGlkLCdfc2t1Jyx0cnVlKSwndCc9Pm1iX3N1YnN0cigkdGl0bGUsMCw3MiksCgkJCSdzdG9jayc9PiRwLT5nZXRfc3RvY2tfc3RhdHVzKCksJ21hcCc9PiRtYXBwZWQ/Om51bGwpOwoJfQoJJG9bJ3RvdGFsJ109Y291bnQoJGpzKTsKCSRpbj1hcnJheV9maWx0ZXIoJGpzLGZ1bmN0aW9uKCRyKXtyZXR1cm4gJHJbJ3N0b2NrJ109PT0naW5zdG9jayc7fSk7Cgkkb1snaW5zdG9jayddPWNvdW50KCRpbik7Cgkkb1snaW5zdG9ja19tYXBwZWQnXT1jb3VudChhcnJheV9maWx0ZXIoJGluLGZ1bmN0aW9uKCRyKXtyZXR1cm4gKGJvb2wpJHJbJ21hcCddO30pKTsKCSRvWyd1bm1hcHBlZCddPWFycmF5X3ZhbHVlcyhhcnJheV9maWx0ZXIoJGluLGZ1bmN0aW9uKCRyKXtyZXR1cm4gISRyWydtYXAnXTt9KSk7Cgkkb1sndW5tYXBwZWRfbiddPWNvdW50KCRvWyd1bm1hcHBlZCddKTsKCS8vIGtva2lhcyBKb3NlcmEgbGVudGVsZXMgamF1IHR1cmltCgkkb1snZXhpc3RpbmcnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpZCxsaW5lLHNoYXBlLHJvd19kaW1lbnNpb24sd2VpZ2h0X2Jhc2lzLHN0YXR1cyxyb3dfY291bnQKCQlGUk9NIHskcGZ9cHNfZmVlZGluZ190YWJsZXMgV0hFUkUgYnJhbmQgTElLRSAnJUpvc2VyYSUnIE9SREVSIEJZIGlkIiwgQVJSQVlfQSk7CgloZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSk7Cg==';
import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function putResult(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'jos',content:Buffer.from(JSON.stringify(o,null,1)).toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:40*1024*1024});}
const U=process.env.WP_USER||'',P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
fs.writeFileSync('/tmp/wpu',U);fs.writeFileSync('/tmp/wpp',P);
function hit(u){try{return execSync(`curl -sk -m 150 -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" "${u}"`,{maxBuffer:60*1024*1024}).toString();}catch(e){return 'ERR';}}
function wj(m,p,b){fs.writeFileSync('/tmp/b.json',JSON.stringify(b));try{return execSync(`curl -sk -m 60 -X ${m} -H "Content-Type: application/json" -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" -d @/tmp/b.json "https://dev.avesa.lt/wp-json/${p}"`,{maxBuffer:20*1024*1024}).toString();}catch(e){return 'ERR';}}
function get(u){try{return execSync(`curl -sLk --max-time 25 -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120" "${u}"`,{maxBuffer:30*1024*1024}).toString();}catch(e){return '';}}
const o={};
// A. WP
const mk=wj('POST','code-snippets/v1/snippets',{name:'Josera Recon v1 (read-only)',code:Buffer.from(JPHP,'base64').toString('utf8'),scope:'front-end',active:true,priority:10});
let id=null; try{id=JSON.parse(mk).id;}catch(e){o.mk=mk.slice(0,200);}
if(id){ const r=hit('https://dev.avesa.lt/?ps_jos=Jo6Rt3Wk'); try{o.wp=JSON.parse(r);}catch(e){o.wp_raw=r.slice(0,700);}
        wj('POST',`code-snippets/v1/snippets/${id}`,{active:false}); }
// B. saltiniai
const sites=[['josera_lt','https://www.josera.lt'],['josera_de','https://www.josera.de'],
             ['josera_com','https://www.josera.com'],['petmarket','https://petmarket.lt'],
             ['dogsnanny','https://dogsnanny.lt'],['petirvet','https://petirvet.lt'],['kgshop','https://www.kgshop.eu']];
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
      if(/<sitemapindex/i.test(xml)){ for(const l of locs) if(/produkt|product|preke|hund|katze|dog|cat/i.test(l)) q.push(l); }
      else for(const l of locs) if(/josera/i.test(l)) urls.push(l);
    }
    const uu=[...new Set(urls)];
    r.n=uu.length; r.sample=uu.slice(0,6);
  }catch(e){ r.err=String(e.message).slice(0,120); }
  o.sites[n]=r;
}
putResult('jos.json',o); console.log('DONE');
