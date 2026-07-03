import { execSync } from "child_process"; import fs from "fs";
const WP_USER=process.env.WP_USER, WP_PASS=process.env.WP_APP_PASS;
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commitB64(name,b64){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'ct',branch:'main',content:b64}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbct.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbct.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:35000}); }catch(e){ return 'EXC:'+e.message; } }
const pcode=Buffer.from("YWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCgkX0dFVFsncHNjX2NsZWFudGVzdCddID8/ICcnKSAhPT0gJzEnKSByZXR1cm47CiAgaWYgKCgkX0dFVFsnayddID8/ICcnKSAhPT0gJ3BzMjAyNicgJiYgIWN1cnJlbnRfdXNlcl9jYW4oJ21hbmFnZV9vcHRpb25zJykpIHJldHVybjsKICAkb3V0PWFycmF5KCk7CiAgZ2xvYmFsICR3cGRiOyAkdD0kd3BkYi0+cHJlZml4LidzbmlwcGV0cyc7CiAgLy8gacWhdHJpbmFtIGJyaWRnZSA1NjQgKG5lcmVpa2FsaW5nYXMpCiAgJHdwZGItPmRlbGV0ZSgkdCwgYXJyYXkoJ2lkJz0+NTY0KSk7CiAgJG91dFsnYnJpZGdlX2RlbGV0ZWQnXT10cnVlOwogICRvdXRbJ2JyaWRnZV9zdGlsbF9leGlzdHMnXT0kd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gJHQgV0hFUkUgaWQ9NTY0Iik7CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyB3cF9qc29uX2VuY29kZSgkb3V0KTsgZXhpdDsKfSk7Cg==",'base64').toString('utf8').trim();
(async()=>{
  var out={tests:{}};
  fs.writeFileSync('/tmp/b557.json', JSON.stringify({name:'PSC CLEANTEST', code:pcode, scope:'global', active:true}));
  exec('curl -sk -m 20 -X PUT -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" --data-binary @/tmp/b557.json "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  var r=exec('curl -sk -m 25 "'+BASE+'/?psc_cleantest=1&k=ps2026"');
  var m=r.match(/(\{.*\})/s); out.cleanup=m?JSON.parse(m[0]):(r||'').slice(0,150);
  exec('curl -sk -m 20 -X DELETE -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  // Testuojam visus 8 tipus per curl (be JS, greitai)
  var tests = {'uzdaras-namelis':23,'kilimelis':13,'su-remeliu':9,'atviras':6,'kampinis':6,'semtuvelis':6,'automatinis':1,'priedai':1};
  for (var slug in tests){
    var html = exec('curl -sk -m 25 "'+BASE+'/kategorija/katems/tualetai-kraikai-semtuveliai/?yith_wcan=1&filter_tipas='+slug+'&query_type_tipas=or&nc='+Date.now()+Math.random()+'"');
    var nerasta = html.includes('Produktų nerasta');
    var rc = html.match(/woocommerce-result-count[^>]*>([^<]+)</);
    out.tests[slug]={nerasta:nerasta, count:rc?rc[1].trim():'(nėra)'};
  }
  commitB64('cleanup_test.json', Buffer.from(JSON.stringify(out),'utf8').toString('base64'));
  console.log(JSON.stringify(out).slice(0,500));
})();
