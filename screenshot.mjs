import { execSync } from "child_process"; import fs from "fs";
const WP_USER=process.env.WP_USER, WP_PASS=process.env.WP_APP_PASS;
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commitB64(name,b64){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'review',branch:'main',content:b64}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbrv.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbrv.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:60000}); }catch(e){ return 'EXC:'+e.message; } }
const pcode=Buffer.from("YWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCgkX0dFVFsncHNjX3Jldmlld3BhY2snXSA/PyAnJykgIT09ICcxJykgcmV0dXJuOwogIGlmICgoJF9HRVRbJ2snXSA/PyAnJykgIT09ICdwczIwMjYnICYmICFjdXJyZW50X3VzZXJfY2FuKCdtYW5hZ2Vfb3B0aW9ucycpKSByZXR1cm47CiAgJGFjdGlvbiA9ICRfR0VUWydhY3Rpb24nXSA/PyAnJzsKICAkcGFyZW50X2lkID0gMzQyNTM7ICRwYWdlX2lkID0gMzQyNTQ7CgogIGlmICgkYWN0aW9uID09PSAncHVibGlzaCcpIHsKICAgIHdwX3VwZGF0ZV9wb3N0KGFycmF5KCdJRCc9PiRwYXJlbnRfaWQsJ3Bvc3Rfc3RhdHVzJz0+J3B1Ymxpc2gnKSk7CiAgICB3cF91cGRhdGVfcG9zdChhcnJheSgnSUQnPT4kcGFnZV9pZCwncG9zdF9zdGF0dXMnPT4ncHVibGlzaCcpKTsKICAgIGVjaG8gJ29rJzsgZXhpdDsKICB9CiAgaWYgKCRhY3Rpb24gPT09ICdyZXZlcnQnKSB7CiAgICB3cF91cGRhdGVfcG9zdChhcnJheSgnSUQnPT4kcGFyZW50X2lkLCdwb3N0X3N0YXR1cyc9PidkcmFmdCcpKTsKICAgIHdwX3VwZGF0ZV9wb3N0KGFycmF5KCdJRCc9PiRwYWdlX2lkLCdwb3N0X3N0YXR1cyc9PidkcmFmdCcpKTsKICAgIGVjaG8gJ29rJzsgZXhpdDsKICB9CgogIGlmICgkYWN0aW9uID09PSAndGVjaGluZm8nKSB7CiAgICAkb3V0ID0gYXJyYXkoKTsKCiAgICAvLyAxLiBQYWdlIHRlbXBsYXRlIG1ldGEKICAgICRvdXRbJ3BhZ2VfdGVtcGxhdGUnXSA9IGdldF9wYWdlX3RlbXBsYXRlX3NsdWcoJHBhZ2VfaWQpID86ICcoZGVmYXVsdCknOwogICAgJG91dFsncG9zdF9zdGF0dXMnXSA9IGdldF9wb3N0X3N0YXR1cygkcGFnZV9pZCk7CgogICAgLy8gMi4gQXIgbmF1ZG9qYW1hcyBGbGF0c29tZSBVWCBCdWlsZGVyIMWhaXRhbSBwdXNsYXBpdWkgKHBhcHJhc3RhaSBtZXRhIHJha3RhcyB1eF9idWlsZGVyIGFyYmEgX2J1aWx0X3dpdGhfdXgpCiAgICAkYWxsX21ldGEgPSBnZXRfcG9zdF9tZXRhKCRwYWdlX2lkKTsKICAgICR1eF9rZXlzID0gYXJyYXkoKTsKICAgIGZvcmVhY2ggKCRhbGxfbWV0YSBhcyAkaz0+JHYpIHsgaWYgKHN0cmlwb3MoJGssJ3V4JykgIT09IGZhbHNlIHx8IHN0cmlwb3MoJGssJ2J1aWxkZXInKSAhPT0gZmFsc2UgfHwgc3RyaXBvcygkaywnZmxhdHNvbWUnKSAhPT0gZmFsc2UpICR1eF9rZXlzWyRrXSA9ICR2OyB9CiAgICAkb3V0WydmbGF0c29tZV91eF9tZXRhX2tleXMnXSA9ICR1eF9rZXlzOwoKICAgIC8vIDMuIFJhdyBIVE1MIGFuYWxpesSXCiAgICAkaHRtbCA9IGZpbGVfZ2V0X2NvbnRlbnRzKGhvbWVfdXJsKCcvc3ByZW5kaW1haS9pc3Jhbmt1cy1hdWdpbnRpbmlzLycpIC4gJz9uYz0nIC4gdGltZSgpKTsKICAgICRvdXRbJ2h0bWxfYnl0ZXMnXSA9IHN0cmxlbigkaHRtbCk7CgogICAgLy8gc2lkZWJhciBkZXRla2NpamEKICAgICRvdXRbJ2hhc19zaWRlYmFyX2NsYXNzJ10gPSAoYm9vbCkgcHJlZ19tYXRjaCgnL2NsYXNzPSJbXiJdKlxic2lkZWJhclxiW14iXSoiL2knLCAkaHRtbCk7CiAgICAkb3V0WydoYXNfY29sX2xhcmdlXzlfb3JfMyddID0gKGJvb2wpIHByZWdfbWF0Y2goJy9sYXJnZS0oM3w5KVxiLycsICRodG1sKTsKICAgICRvdXRbJ2hhc19mdWxsX3dpZHRoX2NsYXNzJ10gPSAoYm9vbCkgcHJlZ19tYXRjaCgnL2Z1bGwtd2lkdGgvaScsICRodG1sKTsKICAgIHByZWdfbWF0Y2goJy88Ym9keVtePl0qY2xhc3M9IihbXiJdKikiL2knLCAkaHRtbCwgJGJvZHljbGFzcyk7CiAgICAkb3V0Wydib2R5X2NsYXNzJ10gPSBpc3NldCgkYm9keWNsYXNzWzFdKSA/ICRib2R5Y2xhc3NbMV0gOiAnJzsKCiAgICAvLyAiTmF1amF1c2kgLyBQb3B1bGlhcmlhdXNpIC8gR2VyaWF1c2lhaSB2ZXJ0aW50aSIgLSBpZXNrb20gaGVhZGluZyB0ZWtzdHUgaXIga29udGVrc3RvCiAgICAkb3V0WydoYXNfbmF1amF1c2knXSA9IChib29sKSBwcmVnX21hdGNoKCcvTkFVSkFVU0kvaScsICRodG1sKTsKICAgICRvdXRbJ2hhc19wb3B1bGlhcmlhdXNpJ10gPSAoYm9vbCkgcHJlZ19tYXRjaCgnL1BPUFVMSUFSSUFVU0kvaScsICRodG1sKTsKICAgICRvdXRbJ2hhc19nZXJpYXVzaWFpJ10gPSAoYm9vbCkgcHJlZ19tYXRjaCgnL0dFUklBVVNJQUkvaScsICRodG1sKTsKICAgIC8vIGtvbnRla3N0YXMgYXBpZSBqdSBrb250ZWluZXJpICh3aWRnZXQgYXJlYSBpZC9jbGFzcykKICAgIGlmIChwcmVnX21hdGNoKCcvKC57MjAwfSlOQVVKQVVTSS9pcycsICRodG1sLCAkY3R4KSkgeyAkb3V0WyduYXVqYXVzaV9jb250ZXh0X2JlZm9yZSddID0gdHJpbShzdHJpcF90YWdzKCRjdHhbMV0pKTsgfQogICAgcHJlZ19tYXRjaCgnLyg8YXNpZGVbXj5dKj58PGRpdltePl0qaWQ9IlteIl0qc2lkZWJhclteIl0qIltePl0qPnw8ZGl2W14+XSppZD0iW14iXSpmb290ZXJbXiJdKiJbXj5dKj4pL2knLCAkaHRtbCwgJHdyYXBjdHgpOwogICAgJG91dFsnbmVhcmJ5X3dyYXBfdGFnX3NhbXBsZSddID0gaXNzZXQoJHdyYXBjdHhbMV0pID8gJHdyYXBjdHhbMV0gOiAnKG5lcmFzdGEpJzsKCiAgICAvLyBwYWthcnRvdHUgcHJvZHVrdHUgcGF2YWRpbmltdSBkZXRla2NpamEgLSBpbWFtIHZpc3VzIHBzYy1zb2wtcHJvZHVjdC10aXRsZSB0ZWtzdHVzCiAgICBwcmVnX21hdGNoX2FsbCgnL2NsYXNzPSJwc2Mtc29sLXByb2R1Y3QtdGl0bGUiW14+XSo+KFtePF0rKTwvJywgJGh0bWwsICR0aXRsZXMpOwogICAgJHRsaXN0ID0gaXNzZXQoJHRpdGxlc1sxXSkgPyAkdGl0bGVzWzFdIDogYXJyYXkoKTsKICAgICRjb3VudHMgPSBhcnJheV9jb3VudF92YWx1ZXMoJHRsaXN0KTsKICAgICRkdXBlcyA9IGFycmF5X2ZpbHRlcigkY291bnRzLCBmdW5jdGlvbigkYyl7IHJldHVybiAkYz4xOyB9KTsKICAgICRvdXRbJ3Byb2R1Y3RfdGl0bGVzX3RvdGFsJ10gPSBjb3VudCgkdGxpc3QpOwogICAgJG91dFsncHJvZHVjdF90aXRsZXNfdW5pcXVlJ10gPSBjb3VudCgkY291bnRzKTsKICAgICRvdXRbJ2R1cGxpY2F0ZV90aXRsZXMnXSA9ICRkdXBlczsKCiAgICAvLyBzaG9ydGNvZGUgYWRkX3RvX2NhcnQgdGlrcmluaW1hcyAtIGFyIHRpa3JhcyBXQyBzaG9ydGNvZGUgb3V0cHV0ICh0dXJpIGNsYXNzIGFkZF90b19jYXJ0X2J1dHRvbikKICAgICRvdXRbJ2hhc193Y19hZGRfdG9fY2FydF9idXR0b25fY2xhc3MnXSA9IChib29sKSBwcmVnX21hdGNoKCcvYWRkX3RvX2NhcnRfYnV0dG9uLycsICRodG1sKTsKICAgICRvdXRbJ2FkZF90b19jYXJ0X2J1dHRvbl9jb3VudCddID0gc3Vic3RyX2NvdW50KCRodG1sLCAnYWRkX3RvX2NhcnRfYnV0dG9uJyk7CgogICAgLy8gYXIgd2lkZ2V0J2FpIHByaXNraXJ0aSBzcGVjaWZpc2thaSBzaG9wIHB1c2xhcGlhbXMgYXIgZ2xvYmFsaWFpIChyZWdpc3RlcmVkIHNpZGViYXJzKQogICAgZ2xvYmFsICR3cF9yZWdpc3RlcmVkX3NpZGViYXJzOwogICAgJG91dFsncmVnaXN0ZXJlZF9zaWRlYmFycyddID0gYXJyYXkoKTsKICAgIGZvcmVhY2ggKChhcnJheSkkd3BfcmVnaXN0ZXJlZF9zaWRlYmFycyBhcyAkc2lkPT4kc2IpIHsgJG91dFsncmVnaXN0ZXJlZF9zaWRlYmFycyddWyRzaWRdID0gJHNiWyduYW1lJ107IH0KCiAgICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRvdXQpOyBleGl0OwogIH0KfSk7Cg==",'base64').toString('utf8').trim();
(async()=>{
  var out={};
  fs.writeFileSync('/tmp/b557.json', JSON.stringify({name:'PSC REVIEWPACK', code:pcode, scope:'global', active:true}));
  exec('curl -sk -m 20 -X PUT -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" --data-binary @/tmp/b557.json "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');

  // publish
  exec('curl -sk -m 15 "'+BASE+'/?psc_reviewpack=1&k=ps2026&action=publish"');
  await new Promise(r=>setTimeout(r,1500));

  // tech info
  var ti = exec('curl -sk -m 25 "'+BASE+'/?psc_reviewpack=1&k=ps2026&action=techinfo"');
  var mti = ti.match(/(\{.*\})/s);
  out.techinfo = mti ? JSON.parse(mti[0]) : {raw: (ti||'').slice(0,300)};

  var url = BASE+'/sprendimai/isrankus-augintinis/';

  try{
    const { chromium } = await import('playwright');
    const b=await chromium.launch({args:['--no-sandbox']});

    // DESKTOP 1440
    const cD=await b.newContext({ignoreHTTPSErrors:true,viewport:{width:1440,height:1000}});
    const pD=await cD.newPage();
    await pD.goto(url+'?nc='+Date.now(),{waitUntil:'domcontentloaded',timeout:25000});
    await pD.waitForTimeout(3500);
    out.desktop_ids = await pD.evaluate(()=> [].slice.call(document.querySelectorAll('.psc-sol-product a.psc-sol-product-img')).map(function(a){var m=a.href.match(/\/product\/([^\/]+)\/?$/); return m?m[1]:a.href;}));
    const bufD = await pD.screenshot({fullPage:true});
    commitB64('rv_desktop_full.png', bufD.toString('base64'));
    await cD.close();

    // MOBILE 390
    const cM=await b.newContext({ignoreHTTPSErrors:true, viewport:{width:390,height:844}, isMobile:true, hasTouch:true});
    const pM=await cM.newPage();
    await pM.goto(url+'?nc='+Date.now(),{waitUntil:'domcontentloaded',timeout:25000});
    await pM.waitForTimeout(3500);
    const bufM = await pM.screenshot({fullPage:true});
    commitB64('rv_mobile_full.png', bufM.toString('base64'));
    await cM.close();

    await b.close();
  }catch(e){ out.shot_err = e.message.slice(0,300); }

  // revert
  exec('curl -sk -m 15 "'+BASE+'/?psc_reviewpack=1&k=ps2026&action=revert"');
  exec('curl -sk -m 20 -X DELETE -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');

  commitB64('review_summary.json', Buffer.from(JSON.stringify(out),'utf8').toString('base64'));
  console.log('done, desktop_ids:', (out.desktop_ids||[]).length);
})();
