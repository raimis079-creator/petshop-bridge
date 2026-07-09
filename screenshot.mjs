import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
const SNIPPET=Buffer.from("LyoqCiAqIFNFTyBBdXRvIEgxIHYxIChwYWdlIGZhbGxiYWNrICsgX3BldHNob3BfaDEpCiAqCiAqIFByaWRlZGEgPGgxPiB0aWsgdGllbXMgYHBhZ2VgIHRpcG8gcHVzbGFwaWFtcywga3VyaXVvc2UgdHVyaW55amUgSDEgbmVyYS4KICogTWF0b21hIEgxIGdhbGltYSBwZXJyYXN5dGkgY3VzdG9tIGxhdWt1IGBfcGV0c2hvcF9oMWAgTkVLRUlDSUFOVCBTRU8gPHRpdGxlPi4KICoKICogTmVsaWVjaWE6CiAqICAgLSBwb3N0dSAoYmxvZykgLSBqaWUgamF1IHR1cmkgaDEuZW50cnktdGl0bGUgaXMgdGhlbWUKICogICAtIFdvb0NvbW1lcmNlIHNpc3RlbWluaXUgcHVzbGFwaXUgKHNob3AvY2FydC9jaGVja291dC9teS1hY2NvdW50KQogKiAgIC0gcHVzbGFwaXUsIGt1cmllIGphdSB0dXJpIDxoMT4gdHVyaW55amUgKGR2aWd1Ym8gSDEgYXBzYXVnYSkKICovCmFkZF9maWx0ZXIoJ3RoZV9jb250ZW50JywgZnVuY3Rpb24gKCRjb250ZW50KSB7CgogICAgaWYgKGlzX2FkbWluKCkgfHwgIWlzX3Npbmd1bGFyKCdwYWdlJykgfHwgIWluX3RoZV9sb29wKCkgfHwgIWlzX21haW5fcXVlcnkoKSkgewogICAgICAgIHJldHVybiAkY29udGVudDsKICAgIH0KCiAgICAvLyBXb29Db21tZXJjZSBzaXN0ZW1pbmlhaSBwdXNsYXBpYWkgLSBXb28gdHZhcmtvIHBhdHMKICAgIGlmIChmdW5jdGlvbl9leGlzdHMoJ2lzX2NhcnQnKSAmJiAoaXNfY2FydCgpIHx8IGlzX2NoZWNrb3V0KCkgfHwgaXNfYWNjb3VudF9wYWdlKCkpKSB7CiAgICAgICAgcmV0dXJuICRjb250ZW50OwogICAgfQogICAgaWYgKGZ1bmN0aW9uX2V4aXN0cygnd2NfZ2V0X3BhZ2VfaWQnKSkgewogICAgICAgICRzaG9wX2lkID0gKGludCkgd2NfZ2V0X3BhZ2VfaWQoJ3Nob3AnKTsKICAgICAgICBpZiAoJHNob3BfaWQgPiAwICYmIGdldF90aGVfSUQoKSA9PT0gJHNob3BfaWQpIHsKICAgICAgICAgICAgcmV0dXJuICRjb250ZW50OwogICAgICAgIH0KICAgIH0KCiAgICAvLyBKYXUgeXJhIEgxIHR1cmlueWplIC0+IG5pZWtvIG5lZGFyb20KICAgIGlmIChzdHJpcG9zKCRjb250ZW50LCAnPGgxJykgIT09IGZhbHNlKSB7CiAgICAgICAgcmV0dXJuICRjb250ZW50OwogICAgfQoKICAgICRjdXN0b20gID0gdHJpbSgoc3RyaW5nKSBnZXRfcG9zdF9tZXRhKGdldF90aGVfSUQoKSwgJ19wZXRzaG9wX2gxJywgdHJ1ZSkpOwogICAgJGhlYWRpbmcgPSAoJGN1c3RvbSAhPT0gJycpID8gJGN1c3RvbSA6IGdldF90aGVfdGl0bGUoKTsKCiAgICBpZiAoJGhlYWRpbmcgPT09ICcnKSB7CiAgICAgICAgcmV0dXJuICRjb250ZW50OwogICAgfQoKICAgIHJldHVybiAnPGgxIGNsYXNzPSJlbnRyeS10aXRsZSBwZXRzaG9wLWF1dG8taDEiPicgLiBlc2NfaHRtbCgkaGVhZGluZykgLiAnPC9oMT4nIC4gJGNvbnRlbnQ7Cgp9LCAyMCk7CgovLyBTdGlsaXVzIHRpayBhdXRvLUgxIChuZWtlaWNpYSBlc2FtdSBIMSBwdXNsYXBpdW9zZSkKYWRkX2FjdGlvbignd3BfaGVhZCcsIGZ1bmN0aW9uICgpIHsKICAgIGlmICghaXNfc2luZ3VsYXIoJ3BhZ2UnKSkgewogICAgICAgIHJldHVybjsKICAgIH0KICAgIGVjaG8gJzxzdHlsZT4ucGV0c2hvcC1hdXRvLWgxe2ZvbnQtc2l6ZToycmVtO2xpbmUtaGVpZ2h0OjEuMjtjb2xvcjojMkQ1RjNGO21hcmdpbjowIDAgLjhlbTtmb250LXdlaWdodDo3MDA7fUBtZWRpYShtYXgtd2lkdGg6NjAwcHgpey5wZXRzaG9wLWF1dG8taDF7Zm9udC1zaXplOjEuNTVyZW07fX08L3N0eWxlPic7Cn0sIDEwMCk7","base64").toString("utf8");
function putFile(name,str){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'s2',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function api(path,method,obj){ let cmd='curl -sk -u "$WPU:$WPP" -H "Content-Type: application/json" '; if(method) cmd+='-X '+method+' '; if(obj){ fs.writeFileSync('/tmp/body.json', JSON.stringify(obj)); cmd+='-d @/tmp/body.json '; } cmd+='"'+DEV+path+'"'; try{ return execSync(cmd,{encoding:'utf8',maxBuffer:20000000,timeout:60000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; }}
function code(u){ try{ return execSync('curl -sk -o /dev/null -w "%{http_code}" -u "$WPU:$WPP" -L --max-time 15 "'+DEV+u+'"',{encoding:'utf8',timeout:17000,env:{...process.env,WPU,WPP}}).trim(); }catch(e){ return 'TO'; } }
let out='';

// === A. TRASH 34574, 34576 (be force -> i sikslede, atstatoma) ===
for(const id of [34574, 34576]){
  const r = api('/wp-json/wp/v2/pages/'+id, 'DELETE', null);
  try{
    const j = JSON.parse(r);
    const st = (j.status) || (j.previous && j.previous.status) || '?';
    out += 'DELETE '+id+': status='+st+' (trash)\n';
  }catch(e){ out += 'DELETE '+id+': raw='+r.slice(0,140)+'\n'; }
}
out += '\n';
// Patikra po trynimo
for(const u of ['/naujas-augintinis/','/naujas-augintinis-2/','/naujas-augintinis-3/']){
  out += code(u)+'  '+u+'\n';
}
// Ar 34570 gyvas ir turi turini
const p = api('/wp-json/wp/v2/pages/34570?context=edit&_fields=id,slug,status,content');
try{ const j=JSON.parse(p); out += '34570: slug='+j.slug+' status='+j.status+' len='+((j.content&&j.content.raw)||'').length+'\n'; }catch(e){ out += '34570 read err\n'; }
out += '\n';

// === B. Sukurti H1 snippet NEAKTYVU ===
const created = api('/wp-json/code-snippets/v1/snippets', 'POST', {
  name: 'SEO Auto H1 v1 (page fallback + _petshop_h1)',
  code: SNIPPET,
  scope: 'front-end',
  active: false,
  priority: 10
});
let snipId = null;
try{
  const j = JSON.parse(created);
  snipId = j.id;
  out += 'SNIPPET created: id='+j.id+' active='+j.active+'\n';
}catch(e){ out += 'SNIPPET create ERR: '+created.slice(0,250)+'\n'; }

// === C. Perskaityti atgal -> code_error ===
if(snipId){
  const back = api('/wp-json/code-snippets/v1/snippets/'+snipId);
  try{
    const j = JSON.parse(back);
    out += 'code_error: '+(j.code_error === null ? 'null (OK)' : JSON.stringify(j.code_error))+'\n';
    out += 'active: '+j.active+'\n';
    out += 'scope: '+j.scope+'\n';
    out += 'code len: '+((j.code||'').length)+'\n';
    out += 'turi _petshop_h1: '+((j.code||'').includes('_petshop_h1'))+'\n';
  }catch(e){ out += 'readback ERR\n'; }
}
putFile('step2.txt', out);
