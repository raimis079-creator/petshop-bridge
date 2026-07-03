import { execSync } from "child_process"; import fs from "fs";
const WP_USER=process.env.WP_USER, WP_PASS=process.env.WP_APP_PASS;
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'cw',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbcw.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbcw.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:35000}); }catch(e){ return 'EXC:'+e.message; } }
const pcode=Buffer.from("YWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCgkX0dFVFsncHNjX2NtcHdvcmsnXSA/PyAnJykgIT09ICcxJykgcmV0dXJuOwogIGlmICgoJF9HRVRbJ2snXSA/PyAnJykgIT09ICdwczIwMjYnICYmICFjdXJyZW50X3VzZXJfY2FuKCdtYW5hZ2Vfb3B0aW9ucycpKSByZXR1cm47CiAgJG91dD1hcnJheSgpOwogIC8vIER1YmVuxJdsacWzIGthdGVnb3JpamEgLSByYW5kYW0gc2x1ZwogICRkdWIgPSBnZXRfdGVybV9ieSgnc2x1ZycsJ2R1YmVuZWxpYWktc3VuaW1zJywncHJvZHVjdF9jYXQnKTsKICBpZighJGR1Yil7IAogICAgJHRlcm1zID0gZ2V0X3Rlcm1zKGFycmF5KCd0YXhvbm9teSc9Pidwcm9kdWN0X2NhdCcsJ2hpZGVfZW1wdHknPT5mYWxzZSwnbmFtZV9fbGlrZSc9Pid1YmVuxJdsJykpOwogICAgZm9yZWFjaCgkdGVybXMgYXMgJHQpeyAkb3V0WydkdWJfY2FuZGlkYXRlcyddW109YXJyYXkoJ2lkJz0+JHQtPnRlcm1faWQsJ3NsdWcnPT4kdC0+c2x1ZywnbmFtZSc9PiR0LT5uYW1lKTsgfQogIH0gZWxzZSB7CiAgICAkb3V0WydkdWInXT1hcnJheSgnaWQnPT4kZHViLT50ZXJtX2lkLCdzbHVnJz0+JGR1Yi0+c2x1ZywnY291bnQnPT4kZHViLT5jb3VudCk7CiAgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG91dCk7IGV4aXQ7Cn0pOwo=",'base64').toString('utf8').trim();
(async()=>{
  var out={};
  fs.writeFileSync('/tmp/b557.json', JSON.stringify({name:'PSC CMPWORK', code:pcode, scope:'global', active:true}));
  exec('curl -sk -m 20 -X PUT -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" --data-binary @/tmp/b557.json "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  var r=exec('curl -sk -m 25 "'+BASE+'/?psc_cmpwork=1&k=ps2026"');
  var m=r.match(/(\{.*\})/s); out.info=m?JSON.parse(m[0]):(r||'').slice(0,200);
  exec('curl -sk -m 20 -X DELETE -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  // Dubenėlių HTML su pa_tipas filtru (runtime preset, TURI veikti)
  var slug = (out.info && out.info.dub) ? out.info.dub.slug : 'dubeneliai-sunims';
  // pirma paimam dubenėlių pa_tipas terminą
  var html = exec('curl -sk -m 30 "'+BASE+'/kategorija/sunims/'+slug+'/?nc='+Date.now()+'"');
  // ištraukiam filter_tipas nuorodą
  var hrefs = html.match(/filter_tipas=[a-z0-9-]+/gi) || [];
  out.dub_filter_hrefs = [...new Set(hrefs)].slice(0,5);
  // testuojam pirmą
  if(out.dub_filter_hrefs.length>0){
    var testurl = BASE+'/kategorija/sunims/'+slug+'/?yith_wcan=1&'+out.dub_filter_hrefs[0]+'&query_type_tipas=or&nc='+Date.now();
    var html2 = exec('curl -sk -m 30 "'+testurl+'"');
    out.dub_test_url = testurl;
    out.dub_nerasta = html2.includes('Produktų nerasta');
    var rc = html2.match(/woocommerce-result-count[^>]*>([^<]+)</);
    out.dub_count = rc?rc[1].trim():'(nerasta)';
  }
  commit('compare_working.json', Buffer.from(JSON.stringify(out),'utf8').toString('base64'));
  console.log(JSON.stringify(out).slice(0,400));
})();
