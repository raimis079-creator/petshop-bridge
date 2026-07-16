const OPHP='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCFpc3NldCgkX0dFVFsncHNfb24nXSl8fCRfR0VUWydwc19vbiddIT09J09uNVZiOUtjJyl7cmV0dXJuO30KCUBzZXRfdGltZV9saW1pdCgzMDApOyBnbG9iYWwgJHdwZGI7ICRwZj0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgpOwoJJGlkcz1nZXRfcG9zdHMoYXJyYXkoJ3Bvc3RfdHlwZSc9Pidwcm9kdWN0JywncG9zdF9zdGF0dXMnPT4ncHVibGlzaCcsJ3Bvc3RzX3Blcl9wYWdlJz0+LTEsJ2ZpZWxkcyc9PidpZHMnKSk7Cgkkb249YXJyYXkoKTsKCWZvcmVhY2goJGlkcyBhcyAkaWQpewoJCSRtYW49KHN0cmluZylnZXRfcG9zdF9tZXRhKCRpZCwnX2xlZ2FjeV9tYW51ZmFjdHVyZXInLHRydWUpOwoJCSR0aXRsZT1nZXRfdGhlX3RpdGxlKCRpZCk7CgkJaWYoc3RyaXBvcygkbWFuLCdvbnRhcmlvJyk9PT1mYWxzZSAmJiBzdHJpcG9zKCR0aXRsZSwnb250YXJpbycpPT09ZmFsc2UpIGNvbnRpbnVlOwoJCSRwPXdjX2dldF9wcm9kdWN0KCRpZCk7IGlmKCEkcCkgY29udGludWU7CgkJJG1hcHBlZD0oaW50KSR3cGRiLT5nZXRfdmFyKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgZmVlZGluZ190YWJsZV9pZCBGUk9NIHskcGZ9cHNfZmVlZGluZ19tYXAgV0hFUkUgcHJvZHVjdF9pZD0lZCIsJGlkKSk7CgkJJG9uW109YXJyYXkoJ2lkJz0+JGlkLCdza3UnPT4oc3RyaW5nKWdldF9wb3N0X21ldGEoJGlkLCdfc2t1Jyx0cnVlKSwndCc9Pm1iX3N1YnN0cigkdGl0bGUsMCw3NiksCgkJCSdzdG9jayc9PiRwLT5nZXRfc3RvY2tfc3RhdHVzKCksJ21hcCc9PiRtYXBwZWQ/Om51bGwpOwoJfQoJJG9bJ3RvdGFsJ109Y291bnQoJG9uKTsKCSRpbj1hcnJheV9maWx0ZXIoJG9uLGZ1bmN0aW9uKCRyKXtyZXR1cm4gJHJbJ3N0b2NrJ109PT0naW5zdG9jayc7fSk7Cgkkb1snaW5zdG9jayddPWNvdW50KCRpbik7Cgkkb1snbWFwcGVkJ109Y291bnQoYXJyYXlfZmlsdGVyKCRpbixmdW5jdGlvbigkcil7cmV0dXJuIChib29sKSRyWydtYXAnXTt9KSk7Cgkkb1sndW5tYXBwZWQnXT1hcnJheV92YWx1ZXMoYXJyYXlfZmlsdGVyKCRpbixmdW5jdGlvbigkcil7cmV0dXJuICEkclsnbWFwJ107fSkpOwoJJG9bJ3VubWFwcGVkX24nXT1jb3VudCgkb1sndW5tYXBwZWQnXSk7CgloZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSk7Cg==';
import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'on',content:Buffer.from(JSON.stringify(o,null,1)).toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:40*1024*1024});}
const U=process.env.WP_USER||'',P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
fs.writeFileSync('/tmp/wpu',U);fs.writeFileSync('/tmp/wpp',P);
function hit(u){try{return execSync(`curl -sk -m 150 -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" "${u}"`,{maxBuffer:60*1024*1024}).toString();}catch(e){return 'ERR';}}
function wj(m,p,b){fs.writeFileSync('/tmp/b.json',JSON.stringify(b));try{return execSync(`curl -sk -m 60 -X ${m} -H "Content-Type: application/json" -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" -d @/tmp/b.json "https://dev.avesa.lt/wp-json/${p}"`,{maxBuffer:20*1024*1024}).toString();}catch(e){return 'ERR';}}
function get(u,mt){try{return execSync(`curl -sLk --max-time ${mt||22} -A "Mozilla/5.0 Chrome/120" "${u}"`,{maxBuffer:25*1024*1024}).toString();}catch(e){return '';}}
const o={};
const mk=wj('POST','code-snippets/v1/snippets',{name:'Ontario Recon v1 (read-only)',code:Buffer.from(OPHP,'base64').toString('utf8'),scope:'front-end',active:true,priority:10});
let id=null; try{id=JSON.parse(mk).id;}catch(e){o.mk=mk.slice(0,200);}
if(id){ const r=hit('https://dev.avesa.lt/?ps_on=On5Vb9Kc'); try{o.wp=JSON.parse(r);}catch(e){o.wp_raw=r.slice(0,600);}
        wj('POST',`code-snippets/v1/snippets/${id}`,{active:false}); }
// saltiniai
o.dom={};
for(const c of ['https://www.ontario-pet.cz','https://ontario-pet.cz','https://www.ontariopet.com','https://ontariopet.eu','https://www.placek.cz']){
  try{ const st=execSync(`curl -sk -m 15 -o /dev/null -w "%{http_code}" -A "Mozilla/5.0 Chrome/120" -L "${c}"`).toString().trim();
       o.dom[c]={http:st};
       if(st==='200'){ const h=get(c); o.dom[c].title=(h.match(/<title[^>]*>([\s\S]*?)<\/title>/i)||[,''])[1].replace(/\s+/g,' ').trim().slice(0,60); }
  }catch(e){ o.dom[c]={http:'000'}; }
}
pr('on.json',o); console.log('DONE');
