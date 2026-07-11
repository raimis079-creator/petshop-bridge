import { execSync } from "child_process";
import fs from "fs";
import { chromium } from "playwright";
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;for(let a=0;a<5;a++){try{const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'pvm '+n,branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));const r=execSync('curl -s -w "\\nHTTP:%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8',maxBuffer:50000000});if(/HTTP:20[01]/.test(r))return true;}catch(e){}execSync('sleep 3');}return false;}
function putBin(path,buf){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;for(let a=0;a<5;a++){try{const url='https://api.github.com/repos/'+repo+'/contents/'+path;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'img '+path,branch:'main',content:buf.toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pb.json',JSON.stringify(b));const r=execSync('curl -s -w "\\nHTTP:%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pb.json "'+url+'"',{encoding:'utf8',maxBuffer:50000000});if(/HTTP:20[01]/.test(r))return true;}catch(e){}execSync('sleep 3');}return false;}
let out='';const L=s=>{out+=s+'\n';console.log(s);};
const BASE='https://dev.avesa.lt';const U=process.env.WP_USER||'';const P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const RENDER_PHP=Buffer.from("LyoqCiAqIFBldHNob3AgU2Fza2FpdG9zIFJlbmRlciBMSVZFIHYxICh0b2tlbikgLSBhdHZhaXpkdW9qYSBHWVZBIGJhc2UucGhwCiAqIFJVTjogLz9wc19yZW5kZXJfbGl2ZT0xJnRva2VuPWNtcGx6XzY2ODBhYTJhNDIxNTFkNTRmYThkNjRlYyZvaWQ9PElEPgogKi8KaWYgKCAhIGRlZmluZWQoICdBQlNQQVRIJyApICkgeyByZXR1cm47IH0KYWRkX2FjdGlvbiggJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uICgpIHsKCWlmICggISBpc3NldCggJF9HRVRbJ3BzX3JlbmRlcl9saXZlJ10gKSApIHsgcmV0dXJuOyB9CgkkdG9rZW4gPSBpc3NldCggJF9HRVRbJ3Rva2VuJ10gKSA/IHNhbml0aXplX3RleHRfZmllbGQoIHdwX3Vuc2xhc2goICRfR0VUWyd0b2tlbiddICkgKSA6ICcnOwoJaWYgKCAkdG9rZW4gIT09ICdjbXBsel82NjgwYWEyYTQyMTUxZDU0ZmE4ZDY0ZWMnICkgeyByZXR1cm47IH0KCSRvcmRlcl9pZCA9IGlzc2V0KCAkX0dFVFsnb2lkJ10gKSA/IGludHZhbCggJF9HRVRbJ29pZCddICkgOiAwOwoJJG8gPSAkb3JkZXJfaWQgPyB3Y19nZXRfb3JkZXIoICRvcmRlcl9pZCApIDogbnVsbDsKCWlmICggISAkbyApIHsgaGVhZGVyKCdDb250ZW50LVR5cGU6IHRleHQvaHRtbDsgY2hhcnNldD11dGYtOCcpOyBlY2hvICc8aDI+bm8gb3JkZXI8L2gyPic7IGV4aXQ7IH0KCgkkdHBsID0gZ2V0X3N0eWxlc2hlZXRfZGlyZWN0b3J5KCkgLiAnL3dvb2NvbW1lcmNlLWRlbGl2ZXJ5LW5vdGVzL2Jhc2UucGhwJzsKCSRvcmRlciA9IGFycmF5KAoJCSdpZCcgPT4gJG9yZGVyX2lkLCAnb3JkZXJOdW1iZXInID0+ICRvLT5nZXRfb3JkZXJfbnVtYmVyKCksCgkJJ2RhdGUnID0+ICRvLT5nZXRfZGF0ZV9jcmVhdGVkKCkgPyAkby0+Z2V0X2RhdGVfY3JlYXRlZCgpLT5kYXRlKCdZLW0tZCBIOmk6cycpIDogZGF0ZSgnWS1tLWQgSDppOnMnKSwKCQknZG9jdW1lbnREYXRlJyA9PiBkYXRlKCdZLW0tZCcpLAoJKTsKCSR3Y2RuID0gZ2V0X29wdGlvbiggJ3djZG5fc2V0dGluZ3MnLCBhcnJheSgpICk7CgkkbG9nb191cmwgPSAnJzsgaWYgKCAhIGVtcHR5KCAkd2Nkblsnc3RvcmVMb2dvJ10gKSApIHsgJHNsPSR3Y2RuWydzdG9yZUxvZ28nXTsgJGxvZ29fdXJsID0gaXNfbnVtZXJpYygkc2wpP3dwX2dldF9hdHRhY2htZW50X3VybChpbnR2YWwoJHNsKSk6JHNsOyB9CglpZiAoICEgJGxvZ29fdXJsICkgeyAkbG9nb191cmwgPSB3cF9nZXRfYXR0YWNobWVudF91cmwoIDMwOCApOyB9Cgkkc2hvcCA9IGFycmF5KCAnbG9nbycgPT4gJGxvZ29fdXJsLCAnbG9nb19wYXRoJyA9PiAnJyApOwoJJHR5cGUgPSAnaHRtbCc7ICR0ZW1wbGF0ZSA9ICdpbnZvaWNlJzsKCW9iX3N0YXJ0KCk7IGluY2x1ZGUgJHRwbDsgJGh0bWwgPSBvYl9nZXRfY2xlYW4oKTsKCWhlYWRlciggJ0NvbnRlbnQtVHlwZTogdGV4dC9odG1sOyBjaGFyc2V0PXV0Zi04JyApOwoJZWNobyAnPCFET0NUWVBFIGh0bWw+PGh0bWwgbGFuZz0ibHQiPjxoZWFkPjxtZXRhIGNoYXJzZXQ9InV0Zi04Ij48bWV0YSBuYW1lPSJ2aWV3cG9ydCIgY29udGVudD0id2lkdGg9Nzk0Ij4nOwoJZWNobyAnPHN0eWxlPmJvZHl7YmFja2dyb3VuZDojZjBmMGYwO21hcmdpbjowO3BhZGRpbmc6MjRweDtmb250LWZhbWlseTpBcmlhbCxzYW5zLXNlcmlmO30gLnBzLXBhZ2V7YmFja2dyb3VuZDojZmZmO21heC13aWR0aDo3OTRweDttYXJnaW46MCBhdXRvO3BhZGRpbmc6MzRweCA0MHB4O2JveC1zaGFkb3c6MCAxcHggNnB4IHJnYmEoMCwwLDAsLjE1KTttaW4taGVpZ2h0OjkwMHB4O308L3N0eWxlPic7CgllY2hvICc8L2hlYWQ+PGJvZHk+PGRpdiBjbGFzcz0icHMtcGFnZSI+JyAuICRodG1sIC4gJzwvZGl2PjwvYm9keT48L2h0bWw+JzsKCWV4aXQ7Cn0sIDYgKTsK",'base64').toString('utf8');
function api(method,path,body){const auth='-u "'+U+':'+P+'"';let cmd;if(body){fs.writeFileSync('/tmp/b.json',JSON.stringify(body));cmd='curl -s -k -w "\\nHTTP:%{http_code}" '+auth+' -X '+method+' -H "Content-Type: application/json" --data-binary @/tmp/b.json "'+BASE+path+'"';}else{cmd='curl -s -k -w "\\nHTTP:%{http_code}" '+auth+' -X '+method+' "'+BASE+path+'"';}let r;try{r=execSync(cmd,{encoding:'utf8',maxBuffer:30000000});}catch(e){r=(e.stdout||'')+'\nHTTP:ERR';}return{code:(r.match(/HTTP:(\S+)$/)||[])[1]||'?',body:r.replace(/\nHTTP:\S+$/,'')};}
function deploySnip(name,code,re){const list=api('GET','/wp-json/code-snippets/v1/snippets?limit=300');let ex=null;try{ex=JSON.parse(list.body).find(s=>re.test(s.name));}catch(e){}const payload={name,desc:'token',code,scope:'front-end',active:true,priority:10};const c=ex?api('POST','/wp-json/code-snippets/v1/snippets/'+ex.id,payload):api('POST','/wp-json/code-snippets/v1/snippets',payload);let id=0;try{id=JSON.parse(c.body).id;}catch(e){}return id;}
(async()=>{const R={};let browser;let orderId=0;let renId=0;try{
  L('=== Apmoketas uzsakymas (Paysera, processing) -> PVM saskaita fakturа ===');
  const ob={payment_method:'paysera',payment_method_title:'Mokėjimas internetu',set_paid:true,status:'processing',
    billing:{first_name:'Testas',last_name:'Testauskas',address_1:'Testinė g. 1',city:'Vilnius',postcode:'01001',country:'LT',email:'terra@gyvunai.lt',phone:'+37060000000'},
    line_items:[{product_id:18623,quantity:1}],shipping_lines:[{method_id:'woo_lithuaniapost_lpexpress_terminal',method_title:'LP Express',total:'0.00'}]};
  const cr=api('POST','/wp-json/wc/v3/orders',ob);try{const j=JSON.parse(cr.body);orderId=j.id;L('  #'+orderId+' status='+j.status+' total='+j.total);}catch(e){L('  klaida: '+cr.body.slice(0,200));}
  R.order_id=orderId;
  if(orderId){
    renId=deploySnip('Petshop Saskaitos Render LIVE v1',RENDER_PHP,/Render LIVE/i);
    L('  render-live id='+renId); execSync('sleep 2');
    browser=await chromium.launch({args:['--no-sandbox']});
    const ctx=await browser.newContext({ignoreHTTPSErrors:true,viewport:{width:900,height:1200}});
    const page=await ctx.newPage();
    await page.goto(BASE+'/?ps_render_live=1&token=cmplz_6680aa2a42151d54fa8d64ec&oid='+orderId,{waitUntil:'domcontentloaded',timeout:60000});
    await page.waitForTimeout(3500);
    const info=await page.evaluate(()=>{const t=document.querySelector('.ps-title')||document.querySelector('div'); const body=document.body.innerText; return {title:(document.querySelector('.ps-page')?document.querySelector('.ps-page').innerText.slice(0,80):''), has_paybox: body.includes('Apmokėjimo informacija'), has_avpn: /AVPN/.test(body), has_iapv:/IAPV/.test(body)};});
    L('  title top: '+info.title.replace(/\n/g,' | '));
    L('  paybox rodoma (turi buti NE): '+info.has_paybox);
    L('  AVPN (turi buti TAIP): '+info.has_avpn+' | IAPV (turi buti NE): '+info.has_iapv);
    R.checks=info;
    putBin('screenshots/invoice_v26_PVM.png', await page.screenshot({fullPage:true}));
    L('  screenshot PVM issaugotas');
  }
  L('DONE');
}catch(e){L('!!! '+(e&&e.stack?e.stack:e));}
finally{
  try{if(browser)await browser.close();}catch(e){}
  if(orderId){const d=api('DELETE','/wp-json/wc/v3/orders/'+orderId+'?force=true');L('  #'+orderId+' trynimas HTTP '+d.code);const chk=api('GET','/wp-json/wc/v3/orders/'+orderId);L('  po trynimo HTTP '+chk.code);}
  if(renId){api('POST','/wp-json/code-snippets/v1/snippets/'+renId+'/deactivate',{});L('  render deakt');}
  putText('pvm_result.json',JSON.stringify(R,null,2));putText('_run25b_log.txt',out);
}})();
