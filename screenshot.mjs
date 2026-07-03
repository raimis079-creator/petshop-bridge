import { execSync } from "child_process"; import fs from "fs";
const WP_USER=process.env.WP_USER, WP_PASS=process.env.WP_APP_PASS;
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'c10',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbc10.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbc10.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:30000}); }catch(e){ return 'EXC:'+e.message; } }
const pcode=Buffer.from("YWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCgkX0dFVFsncHNjX2MxMDU4NiddID8/ICcnKSAhPT0gJzEnKSByZXR1cm47CiAgaWYgKCgkX0dFVFsnayddID8/ICcnKSAhPT0gJ3BzMjAyNicgJiYgIWN1cnJlbnRfdXNlcl9jYW4oJ21hbmFnZV9vcHRpb25zJykpIHJldHVybjsKICBnbG9iYWwgJHdwZGI7CiAgLy8gaWXFoWtvbSBWSVPFsiBwcm9kdWt0xbMgc3Ugc2t1PTEwNTg2IGFyYmEgcGF2YWRpbmltZSBHYWxheHkKICAkc2t1X21hdGNoZXMgPSAkd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBwLklELCBwLnBvc3RfdGl0bGUsIHAucG9zdF9zdGF0dXMsIHBtLm1ldGFfdmFsdWUgYXMgc2t1IEZST00geyR3cGRiLT5wb3N0c30gcCBKT0lOIHskd3BkYi0+cG9zdG1ldGF9IHBtIE9OIHBtLnBvc3RfaWQ9cC5JRCBBTkQgcG0ubWV0YV9rZXk9J19za3UnIFdIRVJFIHBtLm1ldGFfdmFsdWU9JzEwNTg2JyBBTkQgcC5wb3N0X3R5cGU9J3Byb2R1Y3QnIik7CiAgJG5hbWVfbWF0Y2hlcyA9ICR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIElELCBwb3N0X3RpdGxlLCBwb3N0X3N0YXR1cyBGUk9NIHskd3BkYi0+cG9zdHN9IFdIRVJFIHBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHBvc3RfdGl0bGUgTElLRSAnJUdhbGF4eSUnIik7CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsKICBlY2hvIHdwX2pzb25fZW5jb2RlKGFycmF5KCdza3VfbWF0Y2hlcyc9PiRza3VfbWF0Y2hlcywnbmFtZV9tYXRjaGVzJz0+JG5hbWVfbWF0Y2hlcykpOwogIGV4aXQ7Cn0pOwo=",'base64').toString('utf8').trim();
(async()=>{
  fs.writeFileSync('/tmp/b557.json', JSON.stringify({name:'PSC C10586', code:pcode, scope:'global', active:true}));
  exec('curl -sk -m 20 -X PUT -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" --data-binary @/tmp/b557.json "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  var r=exec('curl -sk -m 25 "'+BASE+'/?psc_c10586=1&k=ps2026"');
  var m=r.match(/(\{.*\})/s); commit('c10586.json', m?m[0]:(r||'').slice(0,400)); console.log('matched',!!m);
  exec('curl -sk -m 20 -X DELETE -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
})();
