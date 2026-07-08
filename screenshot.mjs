import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
const PHP=Buffer.from("YWRkX2FjdGlvbignd3BfaGVhZCcsIGZ1bmN0aW9uKCkgewogIGlmICghaXNfcGFnZShbJ2FwaWUtbXVzJywna29udGFrdGFpJywncHJpc3RhdHltYXMnLCdhcG1va2VqaW1hcycsJ2dyYXppbmltYXMnLCd0YWlzeWtsZXMnLCdwcml2YXR1bW8tcG9saXRpa2EnLCdzbGFwdWt1LXBvbGl0aWthJywnc3VudS12ZWlzbGVzJ10pKSB7CiAgICByZXR1cm47CiAgfQogIGVjaG8gJzxzdHlsZT4KICAucGFnZS13cmFwcGVyIC5jb2wtaW5uZXIgcCBhOm5vdCguYnV0dG9uKTpub3QoLnBrLXRlbCBhKSwKICAucGFnZS13cmFwcGVyIC5jb2wtaW5uZXIgbGkgYTpub3QoLmJ1dHRvbikgewogICAgY29sb3I6IzJENUYzRjsKICAgIGZvbnQtd2VpZ2h0OjYwMDsKICAgIHRleHQtZGVjb3JhdGlvbjp1bmRlcmxpbmU7CiAgICB0ZXh0LXVuZGVybGluZS1vZmZzZXQ6M3B4OwogIH0KICAucGFnZS13cmFwcGVyIC5jb2wtaW5uZXIgcCBhOm5vdCguYnV0dG9uKTpob3ZlciwKICAucGFnZS13cmFwcGVyIC5jb2wtaW5uZXIgbGkgYTpub3QoLmJ1dHRvbik6aG92ZXIgewogICAgY29sb3I6IzFGNDQyRDsKICAgIHRleHQtZGVjb3JhdGlvbi10aGlja25lc3M6MnB4OwogIH0KICAucGFnZS13cmFwcGVyIC5jb2wtaW5uZXIgaDIgewogICAgbWFyZ2luLXRvcDoxLjhlbTsKICB9CiAgPC9zdHlsZT4nOwp9LCAxMDEpOw==","base64").toString("utf8");
function putBin(name,buf){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'lc',branch:'main',content:buf.toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function putFile(name,str){ putBin(name, Buffer.from(str,'utf8')); }
function api(path,method,obj){ let cmd='curl -sk -u "$WPU:$WPP" -H "Content-Type: application/json" '; if(method) cmd+='-X '+method+' '; if(obj){ fs.writeFileSync('/tmp/body.json', JSON.stringify(obj)); cmd+='-d @/tmp/body.json '; } cmd+='"'+DEV+path+'"'; try{ return execSync(cmd,{encoding:'utf8',maxBuffer:20000000,timeout:60000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; }}
function get(path){ try{ return execSync('curl -sk -u "$WPU:$WPP" --max-time 50 "'+DEV+path+'"',{encoding:'utf8',maxBuffer:20000000,timeout:55000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; } }
(async()=>{
  const out={};
  // kuriam neaktyvu -> check -> aktyvuojam
  const c=api('/wp-json/code-snippets/v1/snippets','POST',{name:'Petshop Turinio Nuorodu Stilius Legal Puslapiuose v1',code:PHP,scope:'global',active:false});
  let sid=0,err=''; try{ const j=JSON.parse(c); sid=j.id; err=j.code_error||''; }catch(e){ err='parse'; }
  out.sid=sid; out.pre_err=err;
  if(sid && !err){
    api('/wp-json/code-snippets/v1/snippets/'+sid,'PUT',{active:true});
    const chk=api('/wp-json/code-snippets/v1/snippets/'+sid+'?_fields=active,code_error');
    out.post=chk.slice(0,120);
    // verify - taisykles turi hide-style
    const html=get('/taisykles/?nc='+Date.now());
    out.has_css=html.indexOf('text-underline-offset:3px')>=0;
    out.color=html.indexOf('#2D5F3F')>=0;
    // home NEturi (site-wide neislugo)
    const home=get('/?nc='+Date.now());
    out.home_no_css=home.indexOf('text-underline-offset:3px')<0;
  }
  // screenshot taisykles (matysim nuorodas)
  const { chromium } = await import('playwright');
  const browser = await chromium.launch({ args:['--no-sandbox','--ignore-certificate-errors'] });
  const ctx = await browser.newContext({ httpCredentials:{ username:WPU, password:WPP }, ignoreHTTPSErrors:true, viewport:{width:1280,height:1200} });
  const page = await ctx.newPage();
  await page.goto(DEV+'/taisykles/?nc='+Date.now(), { waitUntil:'domcontentloaded', timeout:60000 });
  await page.waitForTimeout(3000);
  // scroll i 2.3 kur privatumo nuoroda
  await page.evaluate(()=>{ const el=[...document.querySelectorAll('a')].find(a=>a.href.includes('privatumo-politika')); if(el) el.scrollIntoView({block:'center'}); });
  await page.waitForTimeout(1000);
  putBin('linkcss_taisykles.png', await page.screenshot({ fullPage:false }));
  // ir apie-mus (patikrinam ar mygtukai NEsugadinti)
  await page.goto(DEV+'/apie-mus/?nc='+Date.now(), { waitUntil:'domcontentloaded', timeout:60000 });
  await page.waitForTimeout(3000);
  putBin('linkcss_apiemus.png', await page.screenshot({ fullPage:true }));
  await browser.close();
  putFile('linkcss.json', JSON.stringify(out));
})().catch(e=>{ console.log('ERR', String(e).slice(0,200)); });
