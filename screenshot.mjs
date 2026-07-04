import { execSync } from "child_process"; import fs from "fs";
const WP_USER=process.env.WP_USER, WP_PASS=process.env.WP_APP_PASS;
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'uv4',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbuv4.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbuv4.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:35000}); }catch(e){ return 'EXC:'+e.message; } }
const pcode=Buffer.from("YWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCgkX0dFVFsncHNjX3V2NCddID8/ICcnKSAhPT0gJzEnKSByZXR1cm47CiAgaWYgKCgkX0dFVFsnayddID8/ICcnKSAhPT0gJ3BzMjAyNicgJiYgIWN1cnJlbnRfdXNlcl9jYW4oJ21hbmFnZV9vcHRpb25zJykpIHJldHVybjsKICAkciA9IHdwX3VwZGF0ZV9wb3N0KGFycmF5KCdJRCc9PjM0NDQ1LCdwb3N0X2NvbnRlbnQnPT5iYXNlNjRfZGVjb2RlKCdQR1JwZGlCamJHRnpjejBpY0hOakxYTnZiQzFvWlhKdklqNEtQR2d4SUdOc1lYTnpQU0p3YzJNdGMyOXNMV2hsY204dGRHbDBiR1VpUGtGclkybHFiM004TDJneFBnbzhjQ0JqYkdGemN6MGljSE5qTFhOdmJDMW9aWEp2TFhSbGVIUWlQbE4xY21sdWEyOXRaU0RGb1dsMWJ5QnRaWFIxSUdkaGJHbHZhbUZ1eEkxcFlYTWdZV3RqYVdwaGN5QnBjaUJ6Y0dWamFXRnNhWFZ6SUhCaGMybkZxMng1YlhWeklNU3ZJSFpwWlc3RWhTQjJhV1YweElVc0lHdGhaQ0JpeGF0MHhiTWdiR1Z1WjNacFlYVWdjbUZ6ZEdrZ2NISmxhMlZ6SUhYRnZpQm5aWEpsYzI3RW1TQnJZV2x1eElVdVBDOXdQZ284TDJScGRqNEtDbHR3YzJOZllXdGphV3B2Y3lCd1pYSmZjR0ZuWlQwaU16QWlJR052YkhWdGJuTTlJalFpWFFvPScpKSwgdHJ1ZSk7CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsKICBlY2hvIHdwX2pzb25fZW5jb2RlKGFycmF5KCd1cGRhdGUnPT5pc193cF9lcnJvcigkcik/JHItPmdldF9lcnJvcl9tZXNzYWdlKCk6J09LJywnbGVuZ3RoJz0+c3RybGVuKGdldF9wb3N0X2ZpZWxkKCdwb3N0X2NvbnRlbnQnLDM0NDQ1KSkpKTsgZXhpdDsKfSk7Cg==",'base64').toString('utf8').trim();
(async()=>{
  fs.writeFileSync('/tmp/b557.json', JSON.stringify({name:'PSC UV4', code:pcode, scope:'global', active:true}));
  exec('curl -sk -m 20 -X PUT -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" --data-binary @/tmp/b557.json "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  var r=exec('curl -sk -m 25 "'+BASE+'/?psc_uv4=1&k=ps2026"');
  var m=r.match(/(\{.*\})/s); commit('upd_v4.json', m?m[0]:(r||'').slice(0,600));
  // Ir patikrinam
  var html=exec('curl -sk -m 25 "'+BASE+'/akcijos/"');
  var lis = html.match(/li[^>]*class="[^"]*product[^"]*"/g) || [];
  var akcija_hits = html.match(/AKCIJA/g) || [];
  commit('upd_v4_verify.json', JSON.stringify({product_lis:lis.length, akcija_mentions:akcija_hits.length, html_len:html.length}));
  exec('curl -sk -m 20 -X DELETE -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  console.log('done');
})();
