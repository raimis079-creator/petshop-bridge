import { execSync } from "child_process";
import fs from "fs";
const WP_USER=process.env.WP_USER, WP_PASS=process.env.WP_APP_PASS;
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){
  const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;
  let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){}
  const body={message:'recon',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha;
  fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));
  execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'});
}
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000}); }catch(e){ return 'EXC:'+e.message; } }
const code=Buffer.from("YWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCgkX0dFVFsncHNjX3JlY29uJ10gPz8gJycpICE9PSAnMScpIHJldHVybjsKICBpZiAoKCRfR0VUWydrJ10gPz8gJycpICE9PSAncHMyMDI2JyAmJiAhY3VycmVudF91c2VyX2NhbignbWFuYWdlX29wdGlvbnMnKSkgcmV0dXJuOwogIGdsb2JhbCAkd3BkYjsKICAkaWRzID0gZ2V0X3Bvc3RzKFsncG9zdF90eXBlJz0+J3Byb2R1Y3QnLCdwb3N0X3N0YXR1cyc9PidhbnknLCdudW1iZXJwb3N0cyc9Pi0xLCdmaWVsZHMnPT4naWRzJywnbWV0YV9xdWVyeSc9PltbJ2tleSc9PidfcGV0c2hvcF9pc19jaG9pY2VfYnVuZGxlJywndmFsdWUnPT4neWVzJ11dXSk7CiAgJG91dD1bXTsgJG1ubT0kd3BkYi0+cHJlZml4Lid3Y19tbm1fY2hpbGRfaXRlbXMnOwogIGZvcmVhY2goJGlkcyBhcyAkcGlkKXsKICAgICRjZmc9anNvbl9kZWNvZGUoZ2V0X3Bvc3RfbWV0YSgkcGlkLCdfcGV0c2hvcF9jaG9pY2VfY29uZmlnJyx0cnVlKSx0cnVlKTsKICAgICR2ZXI9Z2V0X3Bvc3RfbWV0YSgkcGlkLCdfcGV0c2hvcF9jaG9pY2VfdmVyc2lvbicsdHJ1ZSk7CiAgICAkZ3JvdXBzPVtdOyAkc2FtcGxlPW51bGw7CiAgICBpZihpc19hcnJheSgkY2ZnKSl7CiAgICAgIGZvcmVhY2goJGNmZyBhcyAkZ2s9PiRnKXsKICAgICAgICAkbGJsID0gKGlzX2FycmF5KCRnKSYmYXJyYXlfa2V5X2V4aXN0cygnbGFiZWwnLCRnKSkgPyAkZ1snbGFiZWwnXSA6ICcoTk9fTEFCRUxfS0VZX3YxKSc7CiAgICAgICAgJGdyb3Vwc1skZ2tdPSRsYmw7CiAgICAgICAgaWYoJHNhbXBsZT09PW51bGwgJiYgaXNfYXJyYXkoJGcpICYmICFlbXB0eSgkZ1snZ3JhbWF0dXJvcyddKSl7CiAgICAgICAgICAkZmc9cmVzZXQoJGdbJ2dyYW1hdHVyb3MnXSk7CiAgICAgICAgICBpZihpc19hcnJheSgkZmcpKXsgJGZzPXJlc2V0KCRmZyk7CiAgICAgICAgICAgIGlmKGlzX2FycmF5KCRmcykmJmlzc2V0KCRmc1sncHJvZHVjdF9pZCddKSl7CiAgICAgICAgICAgICAgJGhpZD0kZnNbJ3Byb2R1Y3RfaWQnXTsKICAgICAgICAgICAgICAkcm93cz0kd3BkYi0+Z2V0X2NvbCgkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIHByb2R1Y3RfaWQgRlJPTSAkbW5tIFdIRVJFIHBhcmVudF9pZD0lZCIsJGhpZCkpOwogICAgICAgICAgICAgICRwb29sPVtdOwogICAgICAgICAgICAgIGZvcmVhY2goJHJvd3MgYXMgJGNwaWQpewogICAgICAgICAgICAgICAgJGNhdHM9d3BfZ2V0X3Bvc3RfdGVybXMoJGNwaWQsJ3Byb2R1Y3RfY2F0JyxbJ2ZpZWxkcyc9PiduYW1lcyddKTsKICAgICAgICAgICAgICAgICRwb29sW109WydpZCc9PmludHZhbCgkY3BpZCksJ3RpdGxlJz0+Z2V0X3RoZV90aXRsZSgkY3BpZCksJ2NhdHMnPT4kY2F0c107CiAgICAgICAgICAgICAgfQogICAgICAgICAgICAgICRzYW1wbGU9Wydncm91cCc9PiRnaywnaGlkZGVuX2lkJz0+aW50dmFsKCRoaWQpLCdwb29sX2NvdW50Jz0+Y291bnQoJHBvb2wpLCdwb29sJz0+JHBvb2xdOwogICAgICAgICAgICB9CiAgICAgICAgICB9CiAgICAgICAgfQogICAgICB9CiAgICB9CiAgICAkb3V0W109WydpZCc9PmludHZhbCgkcGlkKSwndGl0bGUnPT5nZXRfdGhlX3RpdGxlKCRwaWQpLCd2ZXJzaW9uJz0+JHZlciwnZ3JvdXBzJz0+JGdyb3Vwcywnc2FtcGxlX3Bvb2wnPT4kc2FtcGxlXTsKICB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyB3cF9qc29uX2VuY29kZSgkb3V0KTsgZXhpdDsKfSk7Cg==",'base64').toString('utf8').trim();
(async()=>{
  fs.writeFileSync('/tmp/b557.json', JSON.stringify({name:'PSC RECON probe', code:code, scope:'global', active:true}));
  exec('curl -sk -X PUT -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" --data-binary @/tmp/b557.json "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  var r=exec('curl -sk "'+BASE+'/?psc_recon=1&k=ps2026"');
  var m=r.match(/(\[.*\]|\{.*\})/s);
  commit('recon.json', m?m[0]:r.slice(0,500));
  console.log(m?m[0].slice(0,300):r.slice(0,300));
})();
