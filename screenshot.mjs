import { execSync } from "child_process"; import fs from "fs";
const WP_USER=process.env.WP_USER, WP_PASS=process.env.WP_APP_PASS;
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'cc',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbcc.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbcc.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:35000}); }catch(e){ return 'EXC:'+e.message; } }
const pcode=Buffer.from("YWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCgkX0dFVFsncHNjX2NjJ10gPz8gJycpICE9PSAnMScpIHJldHVybjsKICBpZiAoKCRfR0VUWydrJ10gPz8gJycpICE9PSAncHMyMDI2JyAmJiAhY3VycmVudF91c2VyX2NhbignbWFuYWdlX29wdGlvbnMnKSkgcmV0dXJuOwogIAogICRvdXQgPSBhcnJheSgpOwogIC8vIFBhY2snYWkgaXIganUgYmF6aW5pYWkgcHJvZHVrdGFpCiAgJHBhaXJzID0gYXJyYXkoCiAgICBhcnJheSgncGFjayc9PjM0NDQ5LCAnYmFzZSc9PjE3NDkzLCAnbGFiZWwnPT4nTWlhbW9yIGtvbnNlcnZhaSAyNHZudCcpLAogICAgYXJyYXkoJ3BhY2snPT4zNDQ3MSwgJ2Jhc2UnPT4xODU5MCwgJ2xhYmVsJz0+J0V4Y2x1c2lvbiBzYXVzYXMgMnZudCcpLAogICk7CiAgCiAgZm9yZWFjaCAoJHBhaXJzIGFzICRwKSB7CiAgICAkcGFja19jYXRzID0gd3BfZ2V0X3Bvc3RfdGVybXMoJHBbJ3BhY2snXSwgJ3Byb2R1Y3RfY2F0JywgYXJyYXkoJ2ZpZWxkcyc9PidhbGwnKSk7CiAgICAkYmFzZV9jYXRzID0gd3BfZ2V0X3Bvc3RfdGVybXMoJHBbJ2Jhc2UnXSwgJ3Byb2R1Y3RfY2F0JywgYXJyYXkoJ2ZpZWxkcyc9PidhbGwnKSk7CiAgICAkb3V0W10gPSBhcnJheSgKICAgICAgJ2xhYmVsJyA9PiAkcFsnbGFiZWwnXSwKICAgICAgJ3BhY2tfaWQnID0+ICRwWydwYWNrJ10sCiAgICAgICdwYWNrX2NhdGVnb3JpZXMnID0+IGFycmF5X21hcChmdW5jdGlvbigkdCl7IHJldHVybiAkdC0+dGVybV9pZC4nOicuJHQtPm5hbWU7IH0sICRwYWNrX2NhdHMpLAogICAgICAnYmFzZV9pZCcgPT4gJHBbJ2Jhc2UnXSwKICAgICAgJ2Jhc2VfY2F0ZWdvcmllcycgPT4gYXJyYXlfbWFwKGZ1bmN0aW9uKCR0KXsgcmV0dXJuICR0LT50ZXJtX2lkLic6Jy4kdC0+bmFtZTsgfSwgJGJhc2VfY2F0cyksCiAgICApOwogIH0KICAKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRvdXQpOyBleGl0Owp9KTsK",'base64').toString('utf8').trim();
(async()=>{
  fs.writeFileSync('/tmp/b557.json', JSON.stringify({name:'PSC CC', code:pcode, scope:'global', active:true}));
  exec('curl -sk -m 20 -X PUT -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" --data-binary @/tmp/b557.json "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  var r=exec('curl -sk -m 30 "'+BASE+'/?psc_cc=1&k=ps2026"');
  var m=r.match(/(\[.*\])/s); commit('check_cats.json', m?m[0]:(r||'').slice(0,600));
  exec('curl -sk -m 20 -X DELETE -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  console.log('done');
})();
