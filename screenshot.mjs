import { execSync } from "child_process"; import fs from "fs";
const WP_USER=process.env.WP_USER, WP_PASS=process.env.WP_APP_PASS;
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commitB64(name,b64){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'review2',branch:'main',content:b64}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbrv2.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbrv2.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:40000}); }catch(e){ return 'EXC:'+e.message; } }
const pcode=Buffer.from("YWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCgkX0dFVFsncHNjX3Jldmlld3BhY2syJ10gPz8gJycpICE9PSAnMScpIHJldHVybjsKICBpZiAoKCRfR0VUWydrJ10gPz8gJycpICE9PSAncHMyMDI2JyAmJiAhY3VycmVudF91c2VyX2NhbignbWFuYWdlX29wdGlvbnMnKSkgcmV0dXJuOwogICRhY3Rpb24gPSAkX0dFVFsnYWN0aW9uJ10gPz8gJyc7CiAgJHBhZ2VfaWQgPSAzNDI1NDsKICBpZiAoJGFjdGlvbiA9PT0gJ21ldGEnKSB7CiAgICAkb3V0PWFycmF5KCk7CiAgICAkb3V0WydwYWdlX3RlbXBsYXRlJ10gPSBnZXRfcGFnZV90ZW1wbGF0ZV9zbHVnKCRwYWdlX2lkKSA/OiAnKGRlZmF1bHQpJzsKICAgICRvdXRbJ3Bvc3Rfc3RhdHVzJ10gPSBnZXRfcG9zdF9zdGF0dXMoJHBhZ2VfaWQpOwogICAgJGFsbF9tZXRhID0gZ2V0X3Bvc3RfbWV0YSgkcGFnZV9pZCk7CiAgICAkdXhfa2V5cyA9IGFycmF5KCk7CiAgICBmb3JlYWNoICgkYWxsX21ldGEgYXMgJGs9PiR2KSB7IGlmIChzdHJpcG9zKCRrLCd1eCcpIT09ZmFsc2UgfHwgc3RyaXBvcygkaywnYnVpbGRlcicpIT09ZmFsc2UgfHwgc3RyaXBvcygkaywnZmxhdHNvbWUnKSE9PWZhbHNlIHx8IHN0cmlwb3MoJGssJ3NpZGViYXInKSE9PWZhbHNlIHx8IHN0cmlwb3MoJGssJ3RlbXBsYXRlJykhPT1mYWxzZSkgJHV4X2tleXNbJGtdPSR2OyB9CiAgICAkb3V0WydyZWxldmFudF9tZXRhX2tleXMnXSA9ICR1eF9rZXlzOwogICAgZ2xvYmFsICR3cF9yZWdpc3RlcmVkX3NpZGViYXJzOwogICAgJG91dFsncmVnaXN0ZXJlZF9zaWRlYmFycyddID0gYXJyYXkoKTsKICAgIGZvcmVhY2ggKChhcnJheSkkd3BfcmVnaXN0ZXJlZF9zaWRlYmFycyBhcyAkc2lkPT4kc2IpIHsgJG91dFsncmVnaXN0ZXJlZF9zaWRlYmFycyddWyRzaWRdPSRzYlsnbmFtZSddOyB9CiAgICAvLyBhciBzaG9wLXNpZGViYXIvc2lkZWJhci1tYWluIHR1cmkgd2lkZ2V0J3UgcHJpc2tpcnR1IChibG9ncG9zdC9uYXVqYXVzaS9wb3B1bGlhcmlhdXNpIGdhbGkgYnV0aSB3b29jb21tZXJjZSB3aWRnZXQnYWkgcHJpc2tpcnRpIGdsb2JhbCBzaWRlYmFyLW1haW4pCiAgICAkc2lkZWJhcnNfd2lkZ2V0cyA9IGdldF9vcHRpb24oJ3NpZGViYXJzX3dpZGdldHMnKTsKICAgICRvdXRbJ3NpZGViYXJzX3dpZGdldHNfYXNzaWdubWVudHMnXSA9ICRzaWRlYmFyc193aWRnZXRzOwogICAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyB3cF9qc29uX2VuY29kZSgkb3V0KTsgZXhpdDsKICB9Cn0pOwo=",'base64').toString('utf8').trim();
(async()=>{
  var out={};
  fs.writeFileSync('/tmp/b557.json', JSON.stringify({name:'PSC REVIEWPACK2', code:pcode, scope:'global', active:true}));
  exec('curl -sk -m 20 -X PUT -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" --data-binary @/tmp/b557.json "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');

  // publish
  exec('curl -sk -m 15 -o /dev/null -X POST -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" -d \'{"status":"publish"}\' "'+BASE+'/wp-json/wp/v2/pages/34253"');
  exec('curl -sk -m 15 -o /dev/null -X POST -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" -d \'{"status":"publish"}\' "'+BASE+'/wp-json/wp/v2/pages/34254"');
  await new Promise(r=>setTimeout(r,1200));

  // meta info (WP vidinis, be loopback)
  var mi = exec('curl -sk -m 20 "'+BASE+'/?psc_reviewpack2=1&k=ps2026&action=meta"');
  var mm = mi.match(/(\{.*\})/s);
  out.meta = mm ? JSON.parse(mm[0]) : {raw:(mi||'').slice(0,200)};

  // RAW HTML per israsine curl (is bridge runnerio, ne is WP viduje)
  var html = exec('curl -sk -m 25 "'+BASE+'/sprendimai/isrankus-augintinis/?nc='+Date.now()+'"');
  out.html_bytes = (html||'').length;
  out.has_sidebar_word = /class="[^"]*\bsidebar\b/i.test(html);
  out.has_large9or3 = /large-(3|9)\b/.test(html);
  out.has_full_width = /full-width/i.test(html);
  var bc = html.match(/<body[^>]*class="([^"]*)"/i);
  out.body_class = bc ? bc[1] : '';
  out.has_naujausi = /NAUJAUSI/i.test(html);
  out.has_populiariausi = /POPULIARIAUSI/i.test(html);
  out.has_geriausiai = /GERIAUSIAI/i.test(html);
  var nctx = html.match(/([\s\S]{300})NAUJAUSI/i);
  out.naujausi_before_ctx = nctx ? nctx[1].replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim().slice(-250) : null;
  var titleMatches = html.match(/class="psc-sol-product-title"[^>]*>([^<]+)</g) || [];
  var titles = titleMatches.map(function(t){ var m=t.match(/>([^<]+)</); return m?m[1].trim():''; });
  var counts = {}; titles.forEach(function(t){ counts[t]=(counts[t]||0)+1; });
  var dupes = {}; Object.keys(counts).forEach(function(k){ if(counts[k]>1) dupes[k]=counts[k]; });
  out.product_titles_total = titles.length;
  out.product_titles_unique = Object.keys(counts).length;
  out.duplicate_titles = dupes;
  out.add_to_cart_button_count = (html.match(/add_to_cart_button/g)||[]).length;
  out.psc_sol_card_count = (html.match(/psc-sol-card"/g)||[]).length;
  out.psc_sol_product_count = (html.match(/psc-sol-product"/g)||[]).length;

  // revert
  exec('curl -sk -m 15 -o /dev/null -X POST -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" -d \'{"status":"draft"}\' "'+BASE+'/wp-json/wp/v2/pages/34254"');
  exec('curl -sk -m 15 -o /dev/null -X POST -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" -d \'{"status":"draft"}\' "'+BASE+'/wp-json/wp/v2/pages/34253"');
  exec('curl -sk -m 20 -X DELETE -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');

  commitB64('review2_summary.json', Buffer.from(JSON.stringify(out),'utf8').toString('base64'));
  console.log(JSON.stringify({html_bytes:out.html_bytes, has_naujausi:out.has_naujausi, dupes:out.duplicate_titles}));
})();
