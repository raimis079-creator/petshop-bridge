import { execSync } from "child_process"; import fs from "fs"; import crypto from "crypto";
const WP_USER=process.env.WP_USER, WP_PASS=process.env.WP_APP_PASS;
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commitB64(name,b64){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'ctadep',branch:'main',content:b64}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbcta.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbcta.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000}); }catch(e){ return 'EXC:'+e.message; } }
const code=Buffer.from("Ly8gUGV0c2hvcCBSaW5raW5pbyBDVEEgQmFubmVyaXMga2F0ZWdvcmlqb3NlIHYxCi8vIMSucHJhc3TFsyBrYXRlZ29yaWrFsyBhcmNoeXZvIHZpcsWhdWplIHJvZG8ga3ZpZXRpbcSFIHN1c2lkxJd0aSBzYXZvIHJpbmtpbsSvICsgbnVvcm9kxIUgxK8ga29uc3RydWt0b3JpxbMuCmFkZF9hY3Rpb24oJ3dvb2NvbW1lcmNlX2FyY2hpdmVfZGVzY3JpcHRpb24nLCBmdW5jdGlvbigpewogICAgaWYgKCFmdW5jdGlvbl9leGlzdHMoJ2lzX3Byb2R1Y3RfY2F0ZWdvcnknKSB8fCAhaXNfcHJvZHVjdF9jYXRlZ29yeSgpKSByZXR1cm47CiAgICAkdGVybSA9IGdldF9xdWVyaWVkX29iamVjdCgpOwogICAgaWYgKCEkdGVybSB8fCBlbXB0eSgkdGVybS0+c2x1ZykpIHJldHVybjsKCiAgICAvLyBrYXRlZ29yaWphIOKGkiDFvm9kaXMgKyBrb25zdHJ1a3RvcmnFsyBudW9yb2RvcwogICAgJG1hcCA9IGFycmF5KAogICAgICAgICdrb25zZXJ2YWktc3VuaW1zJyA9PiBhcnJheSgndyc9Pidrb25zZXJ2dXMnLCAnbGlua3MnPT5hcnJheShhcnJheSgn8J+OgSBTdXNpZMSXayBrb25zZXJ2xbMgcmlua2luxK8gxaF1bmltcycsIDM0MjA3KSkpLAogICAgICAgICdrb25zZXJ2YWkta2F0ZW1zJyA9PiBhcnJheSgndyc9Pidrb25zZXJ2dXMnLCAnbGlua3MnPT5hcnJheShhcnJheSgn8J+OgSBTdXNpZMSXayBrb25zZXJ2xbMgcmlua2luxK8ga2F0xJdtcycsIDM0MjE3KSkpLAogICAgICAgICdza2FuZXN0YWktc3VuaW1zJyA9PiBhcnJheSgndyc9Pidza2FuxJdzdHVzJywgJ2xpbmtzJz0+YXJyYXkoYXJyYXkoJ/CfjoEgU2thbsSXc3TFsyByaW5raW55cycsIDM0MjI4KSwgYXJyYXkoJ/CfprQgS3JhbXRhbMWzIHJpbmtpbnlzJywgMzQyMzIpKSksCiAgICAgICAgJ3NrYW5lc3RhaS1rYXRlbXMnID0+IGFycmF5KCd3Jz0+J3NrYW7El3N0dXMnLCAnbGlua3MnPT5hcnJheShhcnJheSgn8J+OgSBTdXNpZMSXayBza2FuxJdzdMWzIHJpbmtpbsSvIGthdGVpJywgMzQyNDIpKSksCiAgICApOwogICAgaWYgKCFpc3NldCgkbWFwWyR0ZXJtLT5zbHVnXSkpIHJldHVybjsKICAgICRjZmcgPSAkbWFwWyR0ZXJtLT5zbHVnXTsKCiAgICAkYnRucyA9ICcnOwogICAgZm9yZWFjaCAoJGNmZ1snbGlua3MnXSBhcyAkbCkgewogICAgICAgIGlmIChnZXRfcG9zdF9zdGF0dXMoJGxbMV0pICE9PSAncHVibGlzaCcpIGNvbnRpbnVlOwogICAgICAgICR1cmwgPSBnZXRfcGVybWFsaW5rKCRsWzFdKTsKICAgICAgICBpZiAoISR1cmwpIGNvbnRpbnVlOwogICAgICAgICRidG5zIC49ICc8YSBocmVmPSInLmVzY191cmwoJHVybCkuJyIgY2xhc3M9InBzYy1jdGEtYnRuIj4nLmVzY19odG1sKCRsWzBdKS4nPC9hPic7CiAgICB9CiAgICBpZiAoISRidG5zKSByZXR1cm47CgogICAgZWNobyAnPGRpdiBjbGFzcz0icHNjLWN0YS1iYW5uZXIiPic7CiAgICBlY2hvICAgJzxkaXYgY2xhc3M9InBzYy1jdGEtdGV4dCI+JzsKICAgIGVjaG8gICAgICc8c3BhbiBjbGFzcz0icHNjLWN0YS10aXRsZSI+Tm9yaSBzdXRhdXB5dGk/IFN1c2lkxJdrIHNhdm8gcmlua2luxK8hPC9zcGFuPic7CiAgICBlY2hvICAgICAnPHNwYW4gY2xhc3M9InBzYy1jdGEtc3ViIj5QYXNpcmluayBtxJdnc3RhbXVzICcuZXNjX2h0bWwoJGNmZ1sndyddKS4nIMSvIHZpZW7EhSBkxJfFvsSZIOKAlCBkYXVnaWF1IGltaSwgcGlnaWF1IGnFoWVpbmEuPC9zcGFuPic7CiAgICBlY2hvICAgJzwvZGl2Pic7CiAgICBlY2hvICAgJzxkaXYgY2xhc3M9InBzYy1jdGEtYnRucyI+Jy4kYnRucy4nPC9kaXY+JzsKICAgIGVjaG8gJzwvZGl2Pic7CiAgICA/PgogICAgPHN0eWxlPgogICAgLnBzYy1jdGEtYmFubmVyewogICAgICAgIGRpc3BsYXk6ZmxleDsgYWxpZ24taXRlbXM6Y2VudGVyOyBqdXN0aWZ5LWNvbnRlbnQ6c3BhY2UtYmV0d2VlbjsgZ2FwOjIwcHg7IGZsZXgtd3JhcDp3cmFwOwogICAgICAgIGJhY2tncm91bmQ6bGluZWFyLWdyYWRpZW50KDEzNWRlZywjM2E2YjQ2LCMyZjVhM2EpOyBjb2xvcjojZmZmOwogICAgICAgIGJvcmRlci1yYWRpdXM6MTRweDsgcGFkZGluZzoyMHB4IDI2cHg7IG1hcmdpbjowIDAgMjZweDsKICAgICAgICBib3gtc2hhZG93OjAgNHB4IDE2cHggcmdiYSg0Nyw5MCw1OCwuMTgpOwogICAgfQogICAgLnBzYy1jdGEtdGV4dHsgZGlzcGxheTpmbGV4OyBmbGV4LWRpcmVjdGlvbjpjb2x1bW47IGdhcDo0cHg7IH0KICAgIC5wc2MtY3RhLXRpdGxleyBmb250LXNpemU6MjBweDsgZm9udC13ZWlnaHQ6NzAwOyBsaW5lLWhlaWdodDoxLjI7IH0KICAgIC5wc2MtY3RhLXN1YnsgZm9udC1zaXplOjE0cHg7IG9wYWNpdHk6LjkyOyB9CiAgICAucHNjLWN0YS1idG5zeyBkaXNwbGF5OmZsZXg7IGdhcDoxMHB4OyBmbGV4LXdyYXA6d3JhcDsgfQogICAgLnBzYy1jdGEtYnRuewogICAgICAgIGRpc3BsYXk6aW5saW5lLWJsb2NrOyBiYWNrZ3JvdW5kOiNmZmY7IGNvbG9yOiMyZjVhM2EgIWltcG9ydGFudDsKICAgICAgICBmb250LXdlaWdodDo3MDA7IGZvbnQtc2l6ZToxNHB4OyB0ZXh0LWRlY29yYXRpb246bm9uZTsKICAgICAgICBwYWRkaW5nOjExcHggMjBweDsgYm9yZGVyLXJhZGl1czo5cHg7IHdoaXRlLXNwYWNlOm5vd3JhcDsKICAgICAgICB0cmFuc2l0aW9uOnRyYW5zZm9ybSAuMTJzIGVhc2UsIGJveC1zaGFkb3cgLjEycyBlYXNlOwogICAgfQogICAgLnBzYy1jdGEtYnRuOmhvdmVyeyB0cmFuc2Zvcm06dHJhbnNsYXRlWSgtMnB4KTsgYm94LXNoYWRvdzowIDRweCAxMnB4IHJnYmEoMCwwLDAsLjE4KTsgY29sb3I6IzJmNWEzYSAhaW1wb3J0YW50OyB9CiAgICBAbWVkaWEgKG1heC13aWR0aDo2MDBweCl7CiAgICAgICAgLnBzYy1jdGEtYmFubmVyeyBmbGV4LWRpcmVjdGlvbjpjb2x1bW47IGFsaWduLWl0ZW1zOmZsZXgtc3RhcnQ7IHRleHQtYWxpZ246bGVmdDsgfQogICAgICAgIC5wc2MtY3RhLWJ0bnsgd2lkdGg6MTAwJTsgdGV4dC1hbGlnbjpjZW50ZXI7IH0KICAgICAgICAucHNjLWN0YS1idG5zeyB3aWR0aDoxMDAlOyB9CiAgICB9CiAgICA8L3N0eWxlPgogICAgPD9waHAKfSwgMTUpOwo=",'base64').toString('utf8');
(async()=>{
  var out={local_md5:'fda91f5952c7eba9944ba9bdd314e083'};
  // sukuriam naują snippetą (POST be id)
  fs.writeFileSync('/tmp/cta.json', JSON.stringify({name:'Petshop Rinkinio CTA Banneris kategorijose v1', code:code, scope:'front-end', active:true}));
  var cr=exec('curl -sk -X POST -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" --data-binary @/tmp/cta.json "'+BASE+'/wp-json/code-snippets/v1/snippets"');
  var newid=0; try{ var j=JSON.parse(cr); newid=j.id; out.name=j.name; out.active=j.active; out.remote_md5=crypto.createHash('md5').update(j.code||'','utf8').digest('hex'); out.match=(out.remote_md5===out.local_md5); }catch(e){ out.create_err=cr.slice(0,200); }
  out.snippet_id=newid;
  // konservai-sunims archyvo URL — per probe? paprasčiau: bandom standartinį permalink
  var url=BASE+'/kategorija/konservai-sunims/';
  try{
    const { chromium } = await import('playwright');
    const b=await chromium.launch({args:['--no-sandbox']});
    const c=await b.newContext({ignoreHTTPSErrors:true,viewport:{width:1300,height:900}});
    const p=await c.newPage();
    var resp=await p.goto(url,{waitUntil:'domcontentloaded'});
    out.http1=resp?resp.status():0;
    // jei 404, bandom kitą kelią
    if(out.http1>=400){ url=BASE+'/product-category/konservai-sunims/'; resp=await p.goto(url,{waitUntil:'domcontentloaded'}); out.http2=resp?resp.status():0; }
    await p.waitForTimeout(3500);
    out.final_url=url;
    out.banner = await p.evaluate(()=>{ var b=document.querySelector('.psc-cta-banner'); return b?b.textContent.replace(/\s+/g,' ').trim().slice(0,120):'NĖRA'; });
    out.btns = await p.evaluate(()=> [].slice.call(document.querySelectorAll('.psc-cta-btn')).map(function(a){return a.textContent.trim();}));
    const buf=await p.screenshot({fullPage:false});
    commitB64('cta_1782988171.png', buf.toString('base64'));
    await b.close();
  }catch(e){ out.shot_err=e.message; }
  commitB64('ctadep_1782988171.json', Buffer.from(JSON.stringify(out),'utf8').toString('base64'));
  console.log(JSON.stringify(out));
})();
