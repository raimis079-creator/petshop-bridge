import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
const SNIP=Buffer.from("LyoqCiAqIFBldHNob3AgQnVsayBTbmlwcGV0IERlbGV0ZSB2MiAoVEVNUCkKICoKICogVmllbmthcnRpbmlzIHNuaXBwZXQnYXM6IGlzdHJpbmEgQ29kZSBTbmlwcGV0cyBwbHVnaW4gc25pcHBldCd1cyBwYWdhbCBJRCBzYXJhc2EuCiAqIFRyaWdnZXI6ID9idWxrX3NuaXBfZGVsPUlEMSxJRDIsSUQzLC4uLiZ0b2tlbj1TRUNSRVRfVE9LRU4KICogTmF1ZG9qYSBwbHVnaW4gZnVua2NpamEgZGVsZXRlX3NuaXBwZXQoKSBhcmJhIGZhbGxiYWNrIGRpcmVjdCBEQi4KICogUG8gbmF1ZG9qaW1vIHNuaXBwZXQnYSBERUFLVFlWVU9USS4KICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCkgewogICAgaWYgKGVtcHR5KCRfR0VUWydidWxrX3NuaXBfZGVsJ10pKSByZXR1cm47CiAgICAvLyBTZWNyZXQgdG9rZW4gKHVuaXEsIGhhcmRjb2RlZCBwZXIgc2Vzc2lvbikKICAgICRFWFBFQ1RFRF9UT0tFTiA9ICdwZXRzaG9wX2J1bGtfMjAyNjA3MDlfJy5tZDUoJ2F2ZXNhX3J5aFRTMDhzQ1YnKTsKICAgIGlmIChlbXB0eSgkX0dFVFsndG9rZW4nXSkgfHwgJF9HRVRbJ3Rva2VuJ10gIT09ICRFWFBFQ1RFRF9UT0tFTikgewogICAgICAgIHdwX2RpZSgnQmFkIHRva2VuJywgJ0J1bGsgU25pcHBldCBEZWwnLCBbJ3Jlc3BvbnNlJyA9PiA0MDNdKTsKICAgIH0KICAgICRyYXcgPSBzYW5pdGl6ZV90ZXh0X2ZpZWxkKCRfR0VUWydidWxrX3NuaXBfZGVsJ10pOwogICAgJGlkcyA9IGFycmF5X2ZpbHRlcihhcnJheV9tYXAoJ2ludHZhbCcsIGV4cGxvZGUoJywnLCAkcmF3KSkpOwogICAgaWYgKGVtcHR5KCRpZHMpKSB3cF9kaWUoJ05lcmEgSUQnLCAnQnVsayBTbmlwcGV0IERlbCcsIFsncmVzcG9uc2UnID0+IDQwMF0pOwogICAgCiAgICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogdGV4dC9wbGFpbjsgY2hhcnNldD11dGYtOCcpOwogICAgZWNobyAiQlVMSyBERUxFVEUgU1RBUlRcbiI7CiAgICBlY2hvICJUb3RhbCBJRDogIi5jb3VudCgkaWRzKS4iXG5cbiI7CiAgICAKICAgICRvayA9IDA7ICRmYWlsID0gMDsKICAgIGdsb2JhbCAkd3BkYjsKICAgIC8vIFJhc3RpIENvZGUgU25pcHBldHMgbGVudGVsZQogICAgJHRhYmxlX3ZhcmlhbnRzID0gWyR3cGRiLT5wcmVmaXguJ3NuaXBwZXRzJywgJHdwZGItPnByZWZpeC4nbXNfc25pcHBldHMnLCAkd3BkYi0+cHJlZml4Lidjb2RlX3NuaXBwZXRzJ107CiAgICAkdGFibGUgPSBudWxsOwogICAgZm9yZWFjaCAoJHRhYmxlX3ZhcmlhbnRzIGFzICR2KSB7CiAgICAgICAgaWYgKCR3cGRiLT5nZXRfdmFyKCJTSE9XIFRBQkxFUyBMSUtFICckdiciKSkgeyAkdGFibGUgPSAkdjsgYnJlYWs7IH0KICAgIH0KICAgIGVjaG8gInRhYmxlOiAiLigkdGFibGUgPzogJ05FUkFTVEEnKS4iXG5cbiI7CiAgICAKICAgIGZvcmVhY2ggKCRpZHMgYXMgJGlkKSB7CiAgICAgICAgJGRvbmUgPSBmYWxzZTsKICAgICAgICAvLyAxKSBCYW5kYXUgcGx1Z2luIGZ1bmtjaWphCiAgICAgICAgaWYgKGZ1bmN0aW9uX2V4aXN0cygnZGVsZXRlX3NuaXBwZXQnKSkgewogICAgICAgICAgICAkcmVzID0gZGVsZXRlX3NuaXBwZXQoJGlkKTsKICAgICAgICAgICAgaWYgKCRyZXMgIT09IGZhbHNlKSB7CiAgICAgICAgICAgICAgICBlY2hvICJbJGlkXSBkZWxldGVfc25pcHBldCgpIC0+IE9LXG4iOwogICAgICAgICAgICAgICAgJG9rKys7CiAgICAgICAgICAgICAgICAkZG9uZSA9IHRydWU7CiAgICAgICAgICAgIH0KICAgICAgICB9CiAgICAgICAgLy8gMikgRmFsbGJhY2s6IGRpcmVjdCBEQgogICAgICAgIGlmICghJGRvbmUgJiYgJHRhYmxlKSB7CiAgICAgICAgICAgICRkZWwgPSAkd3BkYi0+ZGVsZXRlKCR0YWJsZSwgWydpZCcgPT4gJGlkXSwgWyclZCddKTsKICAgICAgICAgICAgaWYgKCRkZWwgIT09IGZhbHNlICYmICRkZWwgPiAwKSB7CiAgICAgICAgICAgICAgICBlY2hvICJbJGlkXSBEQiBkZWxldGUgLT4gT0tcbiI7CiAgICAgICAgICAgICAgICAkb2srKzsKICAgICAgICAgICAgICAgICRkb25lID0gdHJ1ZTsKICAgICAgICAgICAgfSBlbHNlaWYgKCRkZWwgPT09IGZhbHNlKSB7CiAgICAgICAgICAgICAgICBlY2hvICJbJGlkXSBEQiBGQUlMOiAiLiR3cGRiLT5sYXN0X2Vycm9yLiJcbiI7CiAgICAgICAgICAgICAgICAkZmFpbCsrOwogICAgICAgICAgICB9IGVsc2UgewogICAgICAgICAgICAgICAgZWNobyAiWyRpZF0gREI6IG5lcmFzdGFzXG4iOwogICAgICAgICAgICAgICAgJGZhaWwrKzsKICAgICAgICAgICAgfQogICAgICAgIH0KICAgICAgICBpZiAoISRkb25lKSAkZmFpbCsrOwogICAgfQogICAgCiAgICBlY2hvICJcbk9LOiAkb2sgLyBGQUlMOiAkZmFpbFxuIjsKICAgIGV4aXQ7Cn0sIDUpOw==","base64").toString("utf8");
const TOKEN="petshop_bulk_20260709_546b9bdecacf5d2c62c21c1bb98c6f51";
function putFile(n,s){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+n; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'bd2',branch:'main',content:Buffer.from(s,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function api(path,method,obj){ let cmd='curl -sk -u "$WPU:$WPP" -H "Content-Type: application/json" '; if(method) cmd+='-X '+method+' '; if(obj){ fs.writeFileSync('/tmp/body.json', JSON.stringify(obj)); cmd+='-d @/tmp/body.json '; } cmd+='"'+DEV+path+'"'; try{ return execSync(cmd,{encoding:'utf8',maxBuffer:20000000,timeout:60000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; }}
function fetch(u){ try{ return execSync('curl -sk --max-time 120 "'+DEV+u+'"',{encoding:'utf8',maxBuffer:5000000,timeout:125000}); }catch(e){ return 'EXC: '+e.message.slice(0,100); } }

const IDS = [69,137,191,438,439,444,456,487,488,489,490,491,496,497,498,499,500,501,504,505,506,508,511,522,523,526,527,528,529,530,531,533,534,536,537,538,540,541,542,543,544,545,546,548,549,551,552,553,554,574,575,576,577,578,579,580,581,583,584,585,586,588,589,590,591,592,593,595,596,597,598,599,600,601,602,603,604,605,606,607,608];

(async()=>{
  let out='';

  // 1. UPDATE snippet 612 su nauju kodu (v2)
  const upd = api('/wp-json/code-snippets/v1/snippets/612','PUT',{
    name: 'Petshop Bulk Snippet Delete v2 (TEMP)',
    code: SNIP
  });
  try{ const j=JSON.parse(upd); out += 'update 612 code_error='+(j.code_error===null?'null (OK)':JSON.stringify(j.code_error))+'\n'; }
  catch(e){ out += 'UPD ERR\n'; }

  // Activate
  api('/wp-json/code-snippets/v1/snippets/612','PUT',{active:true});
  await new Promise(r=>setTimeout(r,3000));
  out += 'aktyvintas\n\n';

  // 2. Trigger (81 ID + token)
  const idParam = IDS.join(',');
  out += '=== TRIGGER response ===\n';
  const res = fetch('/?bulk_snip_del='+idParam+'&token='+TOKEN+'&nc='+Date.now());
  out += res.slice(0,8000)+'\n\n';

  // Deactivate
  api('/wp-json/code-snippets/v1/snippets/612','PUT',{active:false});
  out += 'deaktyvintas\n\n';

  // 3. Post-verify
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

  // 4. Homepage verify
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

  putFile('bulkdel2.txt', out);
})().catch(e=>{ console.log('ERR', String(e).slice(0,300)); });
