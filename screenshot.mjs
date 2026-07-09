import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
const SNIP=Buffer.from("LyoqCiAqIFBldHNob3AgRnJvbnRwYWdlIFNldHRlciB2MSAoVEVNUCkKICoKICogVmllbmthcnRpbmlzIHNuaXBwZXQnYXM6IHBha2VpY2lhIFdQIG9wdGlvbiAncGFnZV9vbl9mcm9udCcgaSBudXJvZHl0YSBJRC4KICogVHJpZ2VyaXM6ID9mcF91cGRhdGU9Tk5OIFVSTCBwYXJhbWV0cmFzICh0aWsgYWRtaW4gdXNlcmFtcykuCiAqIE5hdWRvamltYXM6IHV6ZWl0IGkgaHR0cHM6Ly9kZXYuYXZlc2EubHQvP2ZwX3VwZGF0ZT0zNDU0MwogKiBSZXp1bHRhdGFzOiBwYWdlX29uX2Zyb250IHBha2Vpc3RhLCBlY2hvIGNvbmZpcm1hdGlvbiwgZXhpdC4KICogUG8gbmF1ZG9qaW1vIHNuaXBwZXQnYSBERUFLVFlWVU9USSAtIGppcyBuZWJlcmVpa2FsaW5nYXMuCiAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKSB7CiAgICBpZiAoZW1wdHkoJF9HRVRbJ2ZwX3VwZGF0ZSddKSkgcmV0dXJuOwogICAgaWYgKCFjdXJyZW50X3VzZXJfY2FuKCdtYW5hZ2Vfb3B0aW9ucycpKSB7CiAgICAgICAgd3BfZGllKCdOZXV6dGVua2EgdGVpc2l1JywgJ0ZQIHNldHRlcicsIFsncmVzcG9uc2UnID0+IDQwM10pOwogICAgfQogICAgJHZhbCA9IGludHZhbCgkX0dFVFsnZnBfdXBkYXRlJ10pOwogICAgaWYgKCR2YWwgPD0gMCkgewogICAgICAgIHdwX2RpZSgnTmV0aW5rYW1hcyBJRCcsICdGUCBzZXR0ZXInLCBbJ3Jlc3BvbnNlJyA9PiA0MDBdKTsKICAgIH0KICAgICRwYWdlID0gZ2V0X3Bvc3QoJHZhbCk7CiAgICBpZiAoISRwYWdlIHx8ICRwYWdlLT5wb3N0X3N0YXR1cyAhPT0gJ3B1Ymxpc2gnIHx8ICRwYWdlLT5wb3N0X3R5cGUgIT09ICdwYWdlJykgewogICAgICAgIHdwX2RpZSgnUHVzbGFwaXMgJy4kdmFsLicgbmVlZ3ppc3R1b2phIGFyYmEgbmUgcHVibGlzaCBwYWdlJywgJ0ZQIHNldHRlcicsIFsncmVzcG9uc2UnID0+IDQwMF0pOwogICAgfQogICAgJGJlZm9yZSA9IGdldF9vcHRpb24oJ3BhZ2Vfb25fZnJvbnQnKTsKICAgIHVwZGF0ZV9vcHRpb24oJ3Nob3dfb25fZnJvbnQnLCAncGFnZScpOwogICAgdXBkYXRlX29wdGlvbigncGFnZV9vbl9mcm9udCcsICR2YWwpOwogICAgJGFmdGVyID0gZ2V0X29wdGlvbigncGFnZV9vbl9mcm9udCcpOwogICAgaGVhZGVyKCdDb250ZW50LVR5cGU6IHRleHQvcGxhaW47IGNoYXJzZXQ9dXRmLTgnKTsKICAgIGVjaG8gIk9LXG4iOwogICAgZWNobyAiYmVmb3JlIHBhZ2Vfb25fZnJvbnQ6ICRiZWZvcmVcbiI7CiAgICBlY2hvICJhZnRlciAgcGFnZV9vbl9mcm9udDogJGFmdGVyXG4iOwogICAgZWNobyAic2hvd19vbl9mcm9udDogIi5nZXRfb3B0aW9uKCdzaG93X29uX2Zyb250JykuIlxuIjsKICAgIGVjaG8gIlxuUE8gUEFUSUtST1MgLSBzbmlwcGV0J2EgZGVha3R5dnVvdC4iOwogICAgZXhpdDsKfSwgNSk7","base64").toString("utf8");
function putBin(name,buf){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'dfp',branch:'main',content:buf.toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function putFile(n,s){ putBin(n, Buffer.from(s,'utf8')); }
function api(path,method,obj){ let cmd='curl -sk -u "$WPU:$WPP" -H "Content-Type: application/json" '; if(method) cmd+='-X '+method+' '; if(obj){ fs.writeFileSync('/tmp/body.json', JSON.stringify(obj)); cmd+='-d @/tmp/body.json '; } cmd+='"'+DEV+path+'"'; try{ return execSync(cmd,{encoding:'utf8',maxBuffer:20000000,timeout:60000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; }}
function code(u){ try{ return execSync('curl -sk -o /dev/null -w "%{http_code}" -L --max-time 15 "'+DEV+u+'"',{encoding:'utf8',timeout:17000}).trim(); }catch(e){ return 'TO'; } }
function fetch(u){ try{ return execSync('curl -sk -u "$WPU:$WPP" --max-time 30 "'+DEV+u+'"',{encoding:'utf8',maxBuffer:2000000,timeout:32000,env:{...process.env,WPU,WPP}}); }catch(e){ return ''; } }
(async()=>{
  let out='';

  // 1. Sukuriu snippet'a NEAKTYVU
  const cr = api('/wp-json/code-snippets/v1/snippets','POST',{
    name: 'Petshop Frontpage Setter v1 (TEMP)',
    code: SNIP,
    scope: 'global',
    active: false,
    priority: 5
  });
  let sid = null;
  try{ const j=JSON.parse(cr); sid=j.id; out += 'sukurta snippet id='+sid+'\n'; }
  catch(e){ out += 'CR ERR: '+cr.slice(0,200)+'\n'; putFile('deploy_fp.txt', out); return; }

  // 2. Patikra code_error
  const rb = api('/wp-json/code-snippets/v1/snippets/'+sid);
  try{
    const j = JSON.parse(rb);
    out += 'code_error: '+(j.code_error === null ? 'null (OK)' : JSON.stringify(j.code_error))+'\n';
    if(j.code_error !== null){ putFile('deploy_fp.txt', out); return; }
  }catch(e){}

  // 3. Aktyvinu
  api('/wp-json/code-snippets/v1/snippets/'+sid,'PUT',{active:true});
  await new Promise(r=>setTimeout(r,3000));
  out += 'snippet aktyvintas\n\n';

  // 4. Trigger'inu su ?fp_update=34543 (auth kaip admin - basic auth)
  const trigger = fetch('/?fp_update=34543&nc='+Date.now());
  out += '=== TRIGGER response ===\n'+trigger.slice(0,600)+'\n\n';

  // 5. DEAKTYVUOJU snippet'a (owner memory: "Probe snippet'ai deactivate po naudojimo")
  api('/wp-json/code-snippets/v1/snippets/'+sid,'PUT',{active:false});
  await new Promise(r=>setTimeout(r,2000));
  out += 'snippet deaktyvuotas\n\n';

  // 6. Verifikacija - dabartinis state
  const g = api('/wp-json/wp/v2/settings');
  try{
    const j = JSON.parse(g);
    out += 'PO PAKEITIMO: page_on_front='+j.page_on_front+' show_on_front='+j.show_on_front+'\n';
  }catch(e){}

  // 7. HTTP kodai
  out += '\n=== HTTP kodai ===\n';
  out += '  '+code('/')+'  /\n';
  out += '  '+code('/pagrindinis-test/')+'  /pagrindinis-test/\n';
  out += '  '+code('/shop/')+'  /shop/\n';

  // 8. Playwright verifikacija
  const { chromium } = await import('playwright');
  const b = await chromium.launch({ args:['--no-sandbox','--ignore-certificate-errors'] });
  const ctx = await b.newContext({ ignoreHTTPSErrors:true, viewport:{width:1280,height:900} });
  const p = await ctx.newPage();
  await p.goto(DEV+'/?nc='+Date.now(), { waitUntil:'load', timeout:60000 });
  await p.waitForTimeout(4000);
  const chk = await p.evaluate(()=>{
    const h1 = document.querySelector('h1')?.innerText || 'NERA';
    const tb = document.querySelector('.ph-tb');
    const e5 = document.querySelector('.ph-e5');
    return {
      h1: h1.slice(0,80),
      hero: !!document.querySelector('.ph-hero'),
      tb_items: document.querySelectorAll('.ph-tb-item').length,
      e5_exists: !!e5,
      title: document.title.slice(0,80),
      body_home_class: document.body.className.includes('home'),
      body_woocommerce_shop: document.body.className.includes('woocommerce-shop'),
    };
  });
  out += '\n=== dev.avesa.lt/ DOM ===\n'+JSON.stringify(chk,null,1)+'\n';
  putBin('fp_root_desktop.png', await p.screenshot({ fullPage:false }));
  await p.evaluate(()=>window.scrollTo(0,document.body.scrollHeight));
  await p.waitForTimeout(1200);
  putBin('fp_root_bottom.png', await p.screenshot({ fullPage:false }));
  await ctx.close();

  // Mobile
  const cm = await b.newContext({ ignoreHTTPSErrors:true, viewport:{width:390,height:844} });
  const pm = await cm.newPage();
  await pm.goto(DEV+'/?nc='+Date.now(), { waitUntil:'load', timeout:60000 });
  await pm.waitForTimeout(3500);
  putBin('fp_root_mobile.png', await pm.screenshot({ fullPage:false }));
  await cm.close();

  await b.close();
  putFile('deploy_fp.txt', out);
})().catch(e=>{ console.log('ERR', String(e).slice(0,300)); });
