import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
const SNIP=Buffer.from("LyoqCiAqIFBldHNob3AgQnVsayBTbmlwcGV0IERlbGV0ZSB2MSAoVEVNUCkKICoKICogVmllbmthcnRpbmlzIHNuaXBwZXQnYXM6IGlzdHJpbmEgQ29kZSBTbmlwcGV0cyBwbHVnaW4gc25pcHBldCd1cyBwYWdhbCBJRCBzYXJhc2EuCiAqIFRyaWdnZXI6ID9idWxrX3NuaXBfZGVsPUlEMSxJRDIsSUQzLC4uLgogKiBOYXVkb2phIHBsdWdpbiBmdW5rY2lqYSBkZWxldGVfc25pcHBldCgpIGFyYmEgZmFsbGJhY2sgZGlyZWN0IERCLgogKiBQbyBuYXVkb2ppbW8gc25pcHBldCdhIERFQUtUWVZVT1RJIChpciBpc2xhaWt5dGkga2FpcCBmYWxsYmFjayB0b29sKS4KICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpIHsKICAgIGlmIChlbXB0eSgkX0dFVFsnYnVsa19zbmlwX2RlbCddKSkgcmV0dXJuOwogICAgaWYgKCFjdXJyZW50X3VzZXJfY2FuKCdtYW5hZ2Vfb3B0aW9ucycpICYmICFjdXJyZW50X3VzZXJfY2FuKCdhY3RpdmF0ZV9zbmlwcGV0cycpKSB7CiAgICAgICAgd3BfZGllKCdOZXV6dGVua2EgdGVpc2l1JywgJ0J1bGsgU25pcHBldCBEZWwnLCBbJ3Jlc3BvbnNlJyA9PiA0MDNdKTsKICAgIH0KICAgICRyYXcgPSBzYW5pdGl6ZV90ZXh0X2ZpZWxkKCRfR0VUWydidWxrX3NuaXBfZGVsJ10pOwogICAgJGlkcyA9IGFycmF5X2ZpbHRlcihhcnJheV9tYXAoJ2ludHZhbCcsIGV4cGxvZGUoJywnLCAkcmF3KSkpOwogICAgaWYgKGVtcHR5KCRpZHMpKSB3cF9kaWUoJ05lcmEgSUQnLCAnQnVsayBTbmlwcGV0IERlbCcsIFsncmVzcG9uc2UnID0+IDQwMF0pOwogICAgCiAgICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogdGV4dC9wbGFpbjsgY2hhcnNldD11dGYtOCcpOwogICAgZWNobyAiQlVMSyBERUxFVEUgU1RBUlRcbiI7CiAgICBlY2hvICJUb3RhbCBJRDogIi5jb3VudCgkaWRzKS4iXG5cbiI7CiAgICAKICAgICRvayA9IDA7ICRmYWlsID0gMDsKICAgIGdsb2JhbCAkd3BkYjsKICAgIC8vIFJhc3RpIENvZGUgU25pcHBldHMgbGVudGVsZSAtIGRlZmF1bHQ6IHdwX3NuaXBwZXRzIGFyYmEgd3BfbXNfc25pcHBldHMgKG11bHRpc2l0ZSkKICAgICR0YWJsZSA9ICR3cGRiLT5wcmVmaXggLiAnc25pcHBldHMnOwogICAgLy8gUGF0aWtyYSBhciBsZW50ZWxlIGVnemlzdHVvamEKICAgICRleGlzdHMgPSAkd3BkYi0+Z2V0X3ZhcigiU0hPVyBUQUJMRVMgTElLRSAnJHRhYmxlJyIpOwogICAgaWYgKCEkZXhpc3RzKSB7CiAgICAgICAgZWNobyAiTGVudGVsZSAkdGFibGUgbmVlZ3ppc3R1b2phIC0gYmFuZHl0aSBwcmVmaXggdmFyaWFudHVzOlxuIjsKICAgICAgICAkdmFycyA9IFskd3BkYi0+cHJlZml4Lidjb2RlX3NuaXBwZXRzJywgJHdwZGItPnByZWZpeC4nbXNfc25pcHBldHMnLCAnc25pcHBldHMnXTsKICAgICAgICBmb3JlYWNoICgkdmFycyBhcyAkdikgewogICAgICAgICAgICAkZSA9ICR3cGRiLT5nZXRfdmFyKCJTSE9XIFRBQkxFUyBMSUtFICckdiciKTsKICAgICAgICAgICAgaWYgKCRlKSB7ICR0YWJsZSA9ICR2OyBlY2hvICIgIHJhZG86ICR0YWJsZVxuIjsgYnJlYWs7IH0KICAgICAgICB9CiAgICB9CiAgICAKICAgIGZvcmVhY2ggKCRpZHMgYXMgJGlkKSB7CiAgICAgICAgLy8gQmFuZGF1IHBsdWdpbiBmdW5rY2lqYQogICAgICAgIGlmIChmdW5jdGlvbl9leGlzdHMoJ2RlbGV0ZV9zbmlwcGV0JykpIHsKICAgICAgICAgICAgJHJlcyA9IGRlbGV0ZV9zbmlwcGV0KCRpZCk7CiAgICAgICAgICAgIGlmICgkcmVzICE9PSBmYWxzZSkgewogICAgICAgICAgICAgICAgZWNobyAiWyRpZF0gZGVsZXRlX3NuaXBwZXQoKSAtPiBPS1xuIjsKICAgICAgICAgICAgICAgICRvaysrOwogICAgICAgICAgICAgICAgY29udGludWU7CiAgICAgICAgICAgIH0KICAgICAgICB9CiAgICAgICAgLy8gRmFsbGJhY2s6IGRpcmVjdCBEQgogICAgICAgICRkZWwgPSAkd3BkYi0+ZGVsZXRlKCR0YWJsZSwgWydpZCcgPT4gJGlkXSwgWyclZCddKTsKICAgICAgICBpZiAoJGRlbCAhPT0gZmFsc2UgJiYgJGRlbCA+IDApIHsKICAgICAgICAgICAgZWNobyAiWyRpZF0gREIgZGVsZXRlIC0+IE9LXG4iOwogICAgICAgICAgICAkb2srKzsKICAgICAgICB9IGVsc2UgewogICAgICAgICAgICBlY2hvICJbJGlkXSBGQUlMIChkZWxldGVfc25pcHBldD1mYWxzZSwgREI9Ii52YXJfZXhwb3J0KCRkZWwsdHJ1ZSkuIiwgZXJyPSIuJHdwZGItPmxhc3RfZXJyb3IuIilcbiI7CiAgICAgICAgICAgICRmYWlsKys7CiAgICAgICAgfQogICAgfQogICAgCiAgICBlY2hvICJcbk9LOiAkb2sgLyBGQUlMOiAkZmFpbFxuIjsKICAgIGV4aXQ7Cn0sIDUpOw==","base64").toString("utf8");
function putFile(n,s){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+n; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'bd',branch:'main',content:Buffer.from(s,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function api(path,method,obj){ let cmd='curl -sk -u "$WPU:$WPP" -H "Content-Type: application/json" '; if(method) cmd+='-X '+method+' '; if(obj){ fs.writeFileSync('/tmp/body.json', JSON.stringify(obj)); cmd+='-d @/tmp/body.json '; } cmd+='"'+DEV+path+'"'; try{ return execSync(cmd,{encoding:'utf8',maxBuffer:20000000,timeout:60000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; }}
function fetch(u){ try{ return execSync('curl -sk -u "$WPU:$WPP" --max-time 120 "'+DEV+u+'"',{encoding:'utf8',maxBuffer:5000000,timeout:125000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC: '+e.message.slice(0,100); } }

const IDS = [69,137,191,438,439,444,456,487,488,489,490,491,496,497,498,499,500,501,504,505,506,508,511,522,523,526,527,528,529,530,531,533,534,536,537,538,540,541,542,543,544,545,546,548,549,551,552,553,554,574,575,576,577,578,579,580,581,583,584,585,586,588,589,590,591,592,593,595,596,597,598,599,600,601,602,603,604,605,606,607,608];

(async()=>{
  let out='';

  const cr = api('/wp-json/code-snippets/v1/snippets','POST',{
    name: 'Petshop Bulk Snippet Delete v1 (TEMP)',
    code: SNIP,
    scope: 'global',
    active: false,
    priority: 5
  });
  let sid = null;
  try{ const j=JSON.parse(cr); sid=j.id; out += 'sukurta snippet id='+sid+'\n'; }
  catch(e){ out += 'CR ERR: '+cr.slice(0,200)+'\n'; putFile('bulkdel.txt', out); return; }

  const rb = api('/wp-json/code-snippets/v1/snippets/'+sid);
  try{
    const j = JSON.parse(rb);
    out += 'code_error: '+(j.code_error === null ? 'null (OK)' : JSON.stringify(j.code_error))+'\n';
    if(j.code_error !== null){ putFile('bulkdel.txt', out); return; }
  }catch(e){}

  api('/wp-json/code-snippets/v1/snippets/'+sid,'PUT',{active:true});
  await new Promise(r=>setTimeout(r,3000));
  out += 'aktyvintas\n\n';

  const idParam = IDS.join(',');
  out += '=== TRIGGER response ===\n';
  const res = fetch('/?bulk_snip_del='+idParam+'&nc='+Date.now());
  out += res.slice(0,6000)+'\n\n';

  api('/wp-json/code-snippets/v1/snippets/'+sid,'PUT',{active:false});
  out += 'bulk_del snippet deaktyvintas\n\n';

  let all = [];
  for(let page=1; page<=10; page++){
    const r = api('/wp-json/code-snippets/v1/snippets?per_page=100&page='+page+'&_fields=id,name,active');
    try{
      const arr = JSON.parse(r);
      if(!Array.isArray(arr) || arr.length === 0) break;
      all = all.concat(arr);
      if(arr.length < 100) break;
    }catch(e){ break; }
  }
  out += '=== POST-VERIFY ===\n';
  out += 'total: '+all.length+'\n';
  out += 'aktyvūs: '+all.filter(x=>x.active).length+'\n';
  const stillExist = IDS.filter(id => all.find(x=>x.id===id));
  out += 'iš 81 dar liko: '+stillExist.length+'\n';
  if(stillExist.length > 0 && stillExist.length < 20) out += 'ID: '+stillExist.join(',')+'\n';

  const { chromium } = await import('playwright');
  const b = await chromium.launch({ args:['--no-sandbox','--ignore-certificate-errors'] });
  const ctx = await b.newContext({ ignoreHTTPSErrors:true, viewport:{width:1280,height:900} });
  const p = await ctx.newPage();
  await p.goto(DEV+'/?nc='+Date.now(), { waitUntil:'load', timeout:60000 });
  await p.waitForTimeout(3500);
  const chk = await p.evaluate(()=>{
    const heroBg = document.querySelector('.ph-hero-bg');
    const cats = [...document.querySelectorAll('.ph-cat-img')];
    return {
      hero: heroBg ? getComputedStyle(heroBg).backgroundImage.includes('hero-augintiniai') : false,
      cats: cats.filter(i=>i.complete&&i.naturalWidth>0).length+'/'+cats.length,
      tb: document.querySelectorAll('.ph-tb-item').length,
      e5: !!document.querySelector('.ph-e5'),
      footer: document.querySelectorAll('#custom_html-2, #custom_html-3, #custom_html-4, #custom_html-5').length,
    };
  });
  out += '\n=== Homepage / ===\n'+JSON.stringify(chk,null,1)+'\n';
  await ctx.close();
  await b.close();

  putFile('bulkdel.txt', out);
})().catch(e=>{ console.log('ERR', String(e).slice(0,300)); });
