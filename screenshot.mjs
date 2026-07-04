import { execSync } from "child_process"; import fs from "fs";
const WP_USER=process.env.WP_USER, WP_PASS=process.env.WP_APP_PASS;
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'wcl',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbwcl.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbwcl.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:35000}); }catch(e){ return 'EXC:'+e.message; } }
const pcode=Buffer.from("YWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCgkX0dFVFsncHNjX3djbCddID8/ICcnKSAhPT0gJzEnKSByZXR1cm47CiAgaWYgKCgkX0dFVFsnayddID8/ICcnKSAhPT0gJ3BzMjAyNicgJiYgIWN1cnJlbnRfdXNlcl9jYW4oJ21hbmFnZV9vcHRpb25zJykpIHJldHVybjsKICAKICAvLyBXb29Db21tZXJjZS5jb20gSGVscGVyIC0gcGF0aWtyaW5hbSBsaWNlbmNpanVvdHVzIHByb2R1a3R1cwogICRzdWJzY3JpcHRpb25zID0gZ2V0X29wdGlvbignd29vY29tbWVyY2VfaGVscGVyX2RhdGEnKTsKICAKICAvLyBJciB0aWVzaW9nIHBhdGlrcmluYW0gYXIgeXJhIGtva2l1IG5vcnMgc3VzaWV0dSBXb28uY29tIHByb2R1a3R1CiAgJG91dCA9IGFycmF5KAogICAgJ2hhc19oZWxwZXJfZGF0YScgPT4gIWVtcHR5KCRzdWJzY3JpcHRpb25zKSwKICAgICdyYXdfa2V5cycgPT4gaXNfYXJyYXkoJHN1YnNjcmlwdGlvbnMpID8gYXJyYXlfa2V5cygkc3Vic2NyaXB0aW9ucykgOiBudWxsLAogICk7CiAgCiAgaWYgKGlzX2FycmF5KCRzdWJzY3JpcHRpb25zKSAmJiBpc3NldCgkc3Vic2NyaXB0aW9uc1snc3Vic2NyaXB0aW9ucyddKSkgewogICAgJHByb2R1Y3RzID0gYXJyYXkoKTsKICAgIGZvcmVhY2ggKCRzdWJzY3JpcHRpb25zWydzdWJzY3JpcHRpb25zJ10gYXMgJHN1YikgewogICAgICAkcHJvZHVjdHNbXSA9IGFycmF5KAogICAgICAgICdwcm9kdWN0X25hbWUnID0+ICRzdWJbJ3Byb2R1Y3RfbmFtZSddID8/IG51bGwsCiAgICAgICAgJ3Byb2R1Y3RfaWQnID0+ICRzdWJbJ3Byb2R1Y3RfaWQnXSA/PyBudWxsLAogICAgICAgICdhY3RpdmUnID0+ICRzdWJbJ2FjdGl2ZSddID8/IG51bGwsCiAgICAgICAgJ2V4cGlyZXMnID0+IGlzc2V0KCRzdWJbJ2V4cGlyZXMnXSkgPyBkYXRlKCdZLW0tZCcsJHN1YlsnZXhwaXJlcyddKSA6IG51bGwsCiAgICAgICk7CiAgICB9CiAgICAkb3V0WydsaWNlbnNlZF9wcm9kdWN0cyddID0gJHByb2R1Y3RzOwogIH0KICAKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRvdXQpOyBleGl0Owp9KTsK",'base64').toString('utf8').trim();
(async()=>{
  fs.writeFileSync('/tmp/b557.json', JSON.stringify({name:'PSC WCL', code:pcode, scope:'global', active:true}));
  exec('curl -sk -m 20 -X PUT -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" --data-binary @/tmp/b557.json "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  var r=exec('curl -sk -m 25 "'+BASE+'/?psc_wcl=1&k=ps2026"');
  var m=r.match(/(\{.*\})/s); commit('check_wc_license.json', m?m[0]:(r||'').slice(0,600));
  exec('curl -sk -m 20 -X DELETE -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  console.log('done');
})();
