import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
const P587=Buffer.from("YWRkX2FjdGlvbignd3BfaGVhZCcsIGZ1bmN0aW9uKCkgewogICAgaWYgKCFpc19wYWdlKFsnYXBpZS1tdXMnLCdrb250YWt0YWknLCdwcmlzdGF0eW1hcycsJ2FwbW9rZWppbWFzJywnZ3JhemluaW1hcycsJ3RhaXN5a2xlcycsJ3ByaXZhdHVtby1wb2xpdGlrYScsJ3NsYXB1a3UtcG9saXRpa2EnLCdzdW51LXZlaXNsZXMnLCdwcmlleml1cm9zLXByaWVtb25lcy1zdW5pbXMnXSkpIHsKICAgICAgICByZXR1cm47CiAgICB9CiAgICBlY2hvICc8c3R5bGU+LmZvb3Rlci13aWRnZXRzLmZvb3Rlci5mb290ZXItMXtkaXNwbGF5Om5vbmUgIWltcG9ydGFudDt9PC9zdHlsZT4nOwp9LCAxMDApOw==","base64").toString("utf8");
const P594=Buffer.from("YWRkX2FjdGlvbignd3BfaGVhZCcsIGZ1bmN0aW9uKCkgewogIGlmICghaXNfcGFnZShbJ2FwaWUtbXVzJywna29udGFrdGFpJywncHJpc3RhdHltYXMnLCdhcG1va2VqaW1hcycsJ2dyYXppbmltYXMnLCd0YWlzeWtsZXMnLCdwcml2YXR1bW8tcG9saXRpa2EnLCdzbGFwdWt1LXBvbGl0aWthJywnc3VudS12ZWlzbGVzJywncHJpZXppdXJvcy1wcmllbW9uZXMtc3VuaW1zJ10pKSB7CiAgICByZXR1cm47CiAgfQogIGVjaG8gJzxzdHlsZT4KICAucGFnZS13cmFwcGVyIC5jb2wtaW5uZXIgcCBhOm5vdCguYnV0dG9uKTpub3QoLnBrLXRlbCBhKSwKICAucGFnZS13cmFwcGVyIC5jb2wtaW5uZXIgbGkgYTpub3QoLmJ1dHRvbikgewogICAgY29sb3I6IzJENUYzRjsKICAgIGZvbnQtd2VpZ2h0OjYwMDsKICAgIHRleHQtZGVjb3JhdGlvbjp1bmRlcmxpbmU7CiAgICB0ZXh0LXVuZGVybGluZS1vZmZzZXQ6M3B4OwogIH0KICAucGFnZS13cmFwcGVyIC5jb2wtaW5uZXIgcCBhOm5vdCguYnV0dG9uKTpob3ZlciwKICAucGFnZS13cmFwcGVyIC5jb2wtaW5uZXIgbGkgYTpub3QoLmJ1dHRvbik6aG92ZXIgewogICAgY29sb3I6IzFGNDQyRDsKICAgIHRleHQtZGVjb3JhdGlvbi10aGlja25lc3M6MnB4OwogIH0KICAucGFnZS13cmFwcGVyIC5jb2wtaW5uZXIgaDIgewogICAgbWFyZ2luLXRvcDoxLjhlbTsKICB9CiAgPC9zdHlsZT4nOwp9LCAxMDEpOw==","base64").toString("utf8");
function putFile(name,str){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'us',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function api(path,method,obj){ let cmd='curl -sk -u "$WPU:$WPP" -H "Content-Type: application/json" '; if(method) cmd+='-X '+method+' '; if(obj){ fs.writeFileSync('/tmp/body.json', JSON.stringify(obj)); cmd+='-d @/tmp/body.json '; } cmd+='"'+DEV+path+'"'; try{ return execSync(cmd,{encoding:'utf8',maxBuffer:20000000,timeout:60000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; }}
function get(path){ try{ return execSync('curl -sk -u "$WPU:$WPP" --max-time 50 "'+DEV+path+'"',{encoding:'utf8',maxBuffer:20000000,timeout:55000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; } }
const out={};
// atnaujinam abu snippet'us (PUT su nauju code)
const u587=api('/wp-json/code-snippets/v1/snippets/587','PUT',{code:P587});
out.s587_err=''; try{ out.s587_err=JSON.parse(u587).code_error; }catch(e){ out.s587_err='parse'; }
const u594=api('/wp-json/code-snippets/v1/snippets/594','PUT',{code:P594});
out.s594_err=''; try{ out.s594_err=JSON.parse(u594).code_error; }catch(e){ out.s594_err='parse'; }
// verify care hub - dabar turi buti footer paslėptas + CSS
const html=get('/prieziuros-priemones-sunims/?nc='+Date.now());
out.hub_foot1=html.indexOf('.footer-widgets.footer.footer-1{display:none')>=0;
out.hub_linkcss=html.indexOf('text-underline-offset:3px')>=0;
// ir tikrinam kad seni puslapiai vis dar veikia (regresija)
const tais=get('/taisykles/?nc='+Date.now());
out.tais_foot1=tais.indexOf('.footer-widgets.footer.footer-1{display:none')>=0;
out.tais_linkcss=tais.indexOf('text-underline-offset:3px')>=0;
putFile('updsnips.json',JSON.stringify(out));
