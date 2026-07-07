import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
const BLOG=["auksciausios-kokybes-sausi-maistai-konservai-sunims-katems-ontario", "miamor-is-meiles-katems", "susipazinkime-prins", "auksciausios-kokybes-pasarai-sunims-katems-rasco", "saugus-biologiniai-antiparazitiniai-preparatai-gyvunams", "jorksyro-terjeras", "rusu-melynoji", "siamo-kate", "geriausias-sausas-sunu-maistas", "royal-canin-kaciu-maistas", "sterilizuotu-kaciu-maistas", "josera-kaciu-maistas", "rotveileris-s-v", "cvergsnauceris", "mastifas", "taksas", "biglis", "kaukazo-aviganis", "samojedas", "senbernaras", "amerikieciu-putbulterjeras", "tibeto-mastifas", "dzeko-raselo-terjeras", "ciau-ciau", "havanu-bisonai", "josera-sunu-maistas", "kinu-kuduotasis-suo", "amerikieciu-buldogas", "bokseris", "dalmantinas", "kolis", "suns-mitybos-auditas-skaiciai-kurie-pades-sutaupyti", "hipoalerginis-maistas-senjoru-sunims-kaip-issirinkti-be-burtu", "monoproteininis-maistas-sunims-kas-tai-ir-kada-verta-rinktis", "suo-nuolat-kasosi-7-priezastys-ir-3-minuciu-planas-ka-daryti-siandien", "maistas-sterilizuotai-katei-su-antsvorio-problema-ka-pirkti-ir-kaip-maitinti"];
function putFile(name,str){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'matchrecon',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function wp(path){ try{ return execSync('curl -sk -u "$WPU:$WPP" "'+DEV+path+'"',{encoding:'utf8',maxBuffer:200000000,timeout:120000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; } }
const out={ts:new Date().toISOString(),start:'ok'}; putFile('matchrecon_meta.json',JSON.stringify(out));

// 1. BLOG PARITETAS: kiekvienam senam blog slug -> ar naujame yra post/page tuo slug (ar panašiu)
try{
  const res=[];
  for(const s of BLOG){
    let found='none', ntype='', ntitle='';
    for(const ep of ['posts','pages']){
      const r=wp('/wp-json/wp/v2/'+ep+'?slug='+encodeURIComponent(s)+'&status=any&_fields=id,slug,title,status');
      try{ const a=JSON.parse(r); if(Array.isArray(a)&&a.length){ found=a[0].status; ntype=ep; ntitle=(a[0].title&&a[0].title.rendered||'').slice(0,40); break; } }catch(e){}
    }
    res.push({slug:s,found,ntype,ntitle});
  }
  out.blog_parity=res;
  const miss=res.filter(r=>r.found==='none').length;
  out.blog_missing=miss; out.blog_present=res.length-miss;
  putFile('matchrecon_meta.json',JSON.stringify(out));
}catch(e){ out.blog_err=String(e).slice(0,150); putFile('matchrecon_meta.json',JSON.stringify(out)); }

// 2. NAUJI PRODUKTAI: id,slug,sku,name (visi publish) -> CSV
try{
  let all=[]; let page=1;
  while(page<=35){
    const r=wp('/wp-json/wc/v3/products?status=publish&per_page=100&page='+page+'&_fields=id,slug,sku,name');
    let a; try{ a=JSON.parse(r); }catch(e){ break; }
    if(!Array.isArray(a)||!a.length) break;
    a.forEach(p=>all.push({id:p.id,slug:p.slug,sku:p.sku||'',name:(p.name||'').replace(/\s+/g,' ').trim()}));
    if(a.length<100) break; page++;
  }
  out.new_products=all.length;
  let csv='id,slug,sku,name\n';
  all.forEach(p=>{ csv+=p.id+',"'+p.slug+'","'+String(p.sku).replace(/"/g,'')+'","'+p.name.replace(/"/g,'')+'"\n'; });
  putFile('naujas_produktai.csv',csv);
  putFile('matchrecon_meta.json',JSON.stringify(out));
}catch(e){ out.prod_err=String(e).slice(0,150); putFile('matchrecon_meta.json',JSON.stringify(out)); }

// 3. BRENDAI (Prekių ženklai taksonomija) + kategorijos
try{
  // rasti brand taksonomija
  const taxes=JSON.parse(wp('/wp-json/wc/v3/products/attributes'));
  out.attrs=Array.isArray(taxes)?taxes.map(t=>({id:t.id,slug:t.slug,name:t.name})):'na';
}catch(e){ out.attr_err=String(e).slice(0,100); }
try{
  let cats=[]; let p=1; while(p<=5){ const r=wp('/wp-json/wc/v3/products/categories?per_page=100&page='+p+'&_fields=id,slug,name,count'); let a; try{a=JSON.parse(r);}catch(e){break;} if(!Array.isArray(a)||!a.length)break; cats=cats.concat(a); if(a.length<100)break; p++; }
  out.new_categories=cats.length;
  let csv='id,slug,name,count\n'; cats.forEach(c=>csv+=c.id+',"'+c.slug+'","'+(c.name||'').replace(/"/g,'')+'",'+c.count+'\n');
  putFile('naujas_kategorijos.csv',csv);
}catch(e){ out.cat_err=String(e).slice(0,100); }

out.done=true; putFile('matchrecon_meta.json',JSON.stringify(out));
