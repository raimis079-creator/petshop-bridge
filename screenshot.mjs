import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
function putResult(name, obj){
  const b64=Buffer.from(JSON.stringify(obj,null,1),'utf8').toString('base64');
  const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;
  const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;
  function getSha(){try{return JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){return '';}}
  function doPut(sha){const body={message:'r',content:b64,branch:'main'};if(sha)body.sha=sha;fs.writeFileSync('/tmp/p.json',JSON.stringify(body));return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/p.json "'+url+'"',{encoding:'utf8',maxBuffer:50000000}).trim();}
  let code='';for(let i=0;i<5;i++){const sha=getSha();code=doPut(sha);if(code==='200'||code==='201')return code;execSync('sleep 2');}return 'FAIL:'+code;
}
const TS="1782161783";
const out={steps:[]};
try{
  function cs(method,p,body){ fs.writeFileSync('/tmp/c.json',JSON.stringify(body)); const t=execSync(`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" -X ${method} -d @/tmp/c.json "https://dev.avesa.lt/wp-json/code-snippets/v1/${p}"`,{encoding:'utf8',env,maxBuffer:20000000}); try{return JSON.parse(t);}catch(e){ return {raw:t.slice(0,200)}; } }
  let php=fs.readFileSync('descproto_v5.php','utf8').replace(/^\uFEFF?<\?php\s*/,'');
  const r=cs('PUT','snippets/512',{name:'Petshop Aprasymu Accordion PROTO v5 (test ps_desc)',scope:'global',active:true,code:php});
  out.snippet={id:r.id,active:r.active,raw:r.raw};
  out.steps.push('deploy ok');
  execSync('sleep 2');
  const P=[
   ['01','monge','https://dev.avesa.lt/product/monge-mini-puppy-sausas-pasaras-eriena-ir-ryziai-75kg/?ps_desc=1'],
   ['02','farmina','https://dev.avesa.lt/product/farmina-vet-life-cat-dry-hypoallergenic-porkpotato-adult-15-kg/?ps_desc=1'],
   ['04','josera','https://dev.avesa.lt/product/josera-nature-energetic-125-kg-begrudis-sausas-maistas-suaugusiems-aktyviems-sunims/?ps_desc=1'],
   ['05','exclusion','https://dev.avesa.lt/product/exclusion-mediterraneo-mono-noble-sausas-pasaras-sunims-s-su-eriena-7-kg/?ps_desc=1'],
   ['07','narvas','https://dev.avesa.lt/product/trixie-metalinis-narvas-xl-116x86x77-cm/?ps_desc=1'],
   ['09','tualetas','https://dev.avesa.lt/product/nobleza-atviras-tualetas-katems-44-5x34x18-5cm/?ps_desc=1'],
  ];
  const { chromium } = await import('playwright');
  const browser = await chromium.launch({ args:['--no-sandbox','--disable-setuid-sandbox'] });
  const page = await (await browser.newContext({viewport:{width:1180,height:1400},ignoreHTTPSErrors:true})).newPage();
  out.tests=[];
  for(const [n,slug,url] of P){
    const rec={n,slug};
    try{
      const resp=await page.goto(url,{waitUntil:'domcontentloaded',timeout:60000}); rec.status=resp?resp.status():0; await page.waitForTimeout(2000);
      try{ const tl=await page.$('li.description_tab a, a[href="#tab-description"]'); if(tl){await tl.click();await page.waitForTimeout(500);} }catch(e){}
      rec.d=await page.evaluate(()=>{
        const dets=[...document.querySelectorAll('.ps-desc-acc details')];
        const titles=dets.map(d=>d.querySelector('summary').textContent.trim());
        const openStates=dets.map(d=>d.hasAttribute('open'));
        const se=document.querySelector('.woocommerce-product-details__short-description')||document.querySelector('.product-short-description');
        const st=se?se.innerText:''; const stray_short=/<\/?(p|strong|span|em|div|ul|li|br)\b|&lt;|&nbsp;|<style/i.test(st);
        const te=document.querySelector('#tab-description'); const dt=te?te.innerText:''; const stray_desc=/<\/?(p|strong|span|em|div)\b|&lt;|<style|\.b2b-/i.test(dt);
        const pkgdims=/Pakuot\u0117s dydis|\d+\s*[x\u00D7]\s*\d+\s*[x\u00D7]\s*\d+\s*cm/i.test(dt);
        return {acc:!!document.querySelector('.ps-desc-acc'),titles,openStates,stray_short,stray_desc,pkgdims,short:st.slice(0,80)};
      });
    }catch(e){ rec.err=e.message.slice(0,90); }
    out.tests.push(rec);
  }
  await browser.close();
}catch(e){ out.fatal=e.message.slice(0,200); }
putResult('v5v2_'+TS+'.json', out);
