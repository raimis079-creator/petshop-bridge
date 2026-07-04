import { execSync } from "child_process"; import fs from "fs";
const WP_USER=process.env.WP_USER, WP_PASS=process.env.WP_APP_PASS;
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'fk',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbfk.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbfk.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:35000}); }catch(e){ return 'EXC:'+e.message; } }
const pcode=Buffer.from("YWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCgkX0dFVFsncHNjX2tyayddID8/ICcnKSAhPT0gJzEnKSByZXR1cm47CiAgaWYgKCgkX0dFVFsnayddID8/ICcnKSAhPT0gJ3BzMjAyNicgJiYgIWN1cnJlbnRfdXNlcl9jYW4oJ21hbmFnZV9vcHRpb25zJykpIHJldHVybjsKICBnbG9iYWwgJHdwZGI7CiAgLy8gS3JhaWt1IHBhaWXFoWthIC0gdmlzb3Mga2F0ZWdvcmlqb3Mgc3UgImtyYWlrIiBwYXZhZGluaW1lCiAgJGNhdHMgPSAkd3BkYi0+Z2V0X3Jlc3VsdHMoIgogICAgU0VMRUNUIHQudGVybV9pZCwgdC5uYW1lLCB0LnNsdWcsIHR0LmNvdW50LCB0dC5wYXJlbnQKICAgIEZST00geyR3cGRiLT50ZXJtc30gdAogICAgSU5ORVIgSk9JTiB7JHdwZGItPnRlcm1fdGF4b25vbXl9IHR0IE9OIHR0LnRlcm1faWQ9dC50ZXJtX2lkCiAgICBXSEVSRSB0dC50YXhvbm9teT0ncHJvZHVjdF9jYXQnIEFORCAodC5uYW1lIExJS0UgJyVrcmFpayUnIE9SIHQuc2x1ZyBMSUtFICcla3JhaWslJykKICAgIE9SREVSIEJZIHQubmFtZSIsIEFSUkFZX0EpOwogIAogIC8vIElyIHByZWtpxbMgcGF2YWRpbmltdW9zZSAia3JhaWthcyIga2llayB5cmEKICAkcHJvZF9jb3VudCA9ICR3cGRiLT5nZXRfdmFyKCIKICAgIFNFTEVDVCBDT1VOVCgqKSBGUk9NIHskd3BkYi0+cG9zdHN9IHAKICAgIFdIRVJFIHAucG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcC5wb3N0X3N0YXR1cz0ncHVibGlzaCcKICAgIEFORCAocC5wb3N0X3RpdGxlIExJS0UgJyVrcmFpayUnIE9SIHAucG9zdF90aXRsZSBMSUtFICclS3JhaWslJykiKTsKICAKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOwogIGVjaG8gd3BfanNvbl9lbmNvZGUoYXJyYXkoJ2NhdHMnPT4kY2F0cywncHJvZHVjdHNfd2l0aF9rcmFpa19pbl90aXRsZSc9PiRwcm9kX2NvdW50KSk7IGV4aXQ7Cn0pOwo=",'base64').toString('utf8').trim();
(async()=>{
  fs.writeFileSync('/tmp/b557.json', JSON.stringify({name:'PSC KRK', code:pcode, scope:'global', active:true}));
  exec('curl -sk -m 20 -X PUT -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" --data-binary @/tmp/b557.json "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  var r=exec('curl -sk -m 25 "'+BASE+'/?psc_krk=1&k=ps2026"');
  var m=r.match(/(\{.*\})/s); commit('find_kraikai.json', m?m[0]:(r||'').slice(0,600));
  exec('curl -sk -m 20 -X DELETE -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  console.log('done');
})();
