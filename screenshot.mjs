import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putBin(name,buf){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'s3',branch:'main',content:buf.toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function putFile(name,str){ putBin(name, Buffer.from(str,'utf8')); }
function api(path,method,obj){ let cmd='curl -sk -u "$WPU:$WPP" -H "Content-Type: application/json" '; if(method) cmd+='-X '+method+' '; if(obj){ fs.writeFileSync('/tmp/body.json', JSON.stringify(obj)); cmd+='-d @/tmp/body.json '; } cmd+='"'+DEV+path+'"'; try{ return execSync(cmd,{encoding:'utf8',maxBuffer:20000000,timeout:60000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; }}
function get(u){ try{ return execSync('curl -sk -u "$WPU:$WPP" -L --max-time 25 "'+DEV+u+'"',{encoding:'utf8',maxBuffer:20000000,timeout:27000,env:{...process.env,WPU,WPP}}); }catch(e){ return ''; } }
(async()=>{
  let out='';
  // === AKTYVUOJU snippet 609 ===
  const act = api('/wp-json/code-snippets/v1/snippets/609','PUT',{active:true});
  try{ const j=JSON.parse(act); out += 'snippet 609 active='+j.active+' code_error='+(j.code_error===null?'null':JSON.stringify(j.code_error))+'\n\n'; }
  catch(e){ out += 'activate ERR: '+act.slice(0,200)+'\n\n'; }
  execSync('sleep 4');

  // === VERIFIKACIJA ===
  const tests = [
    ['LANDING', '/naujas-augintinis/', 1],
    ['LANDING', '/hipoalerginis-maistas/', 1],
    ['LANDING', '/monoproteinis-maistas/', 1],
    ['LANDING', '/be-grudu-maistas/', 1],
    ['LANDING', '/odai-ir-kailiui/', 1],
    ['JAU-TUREJO-H1', '/sunu-veisles/', 1],
    ['JAU-TUREJO-H1', '/apie-mus/', 1],
    ['JAU-TUREJO-H1', '/sprendimai/', 1],
    ['HOMEPAGE', '/pagrindinis-test/', 1],
    ['VEISLE', '/kolis/', 1],
    ['VEISLE', '/bokseris/', 1],
    ['VEISLE', '/taksas/', 1],
    ['VEISLE', '/siamo-kate/', 1],
    ['INFO', '/kontaktai/', 1],
    ['INFO', '/pristatymas/', 1],
    ['INFO', '/pasiulymai/', 1],
    ['BLOG', '/hipoalerginis-maistas-senjoru-sunims-kaip-issirinkti-be-burtu/', 1],
    ['BLOG', '/suo-nuolat-kasosi-7-priezastys-ir-3-minuciu-planas-ka-daryti-siandien/', 1],
    ['WOO', '/krepselis/', null],
    ['WOO', '/mano-paskyra/', null],
    ['WOO', '/apmokejimas/', null],
  ];
  let pass=0, fail=0;
  for(const [grp, u, expect] of tests){
    const html = get(u);
    if(!html || html.length < 500){ out += 'FETCH-FAIL '+u+'\n'; fail++; continue; }
    const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]{0,150}?)<\/h1>/g)];
    const n = h1s.length;
    const auto = html.includes('petshop-auto-h1');
    const texts = h1s.map(m=>m[1].replace(/<[^>]+>/g,'').trim().slice(0,45));
    let verdict;
    if(expect === null){ verdict = 'INFO(woo)'; }
    else if(n === expect){ verdict='OK'; pass++; }
    else { verdict='FAIL(tikėtasi '+expect+')'; fail++; }
    out += verdict.padEnd(22)+' h1='+n+' auto='+(auto?'Y':'n')+'  '+grp.padEnd(14)+u+'\n';
    if(texts.length) out += '                       → '+texts.join(' | ')+'\n';
  }
  out += '\nPASS='+pass+' FAIL='+fail+'\n';

  // === Ar niekur nera >1 H1 (pilnas pages skenavimas) ===
  let pages=[];
  for(let p=1;p<=3;p++){
    const r = api('/wp-json/wp/v2/pages?per_page=100&status=publish&_fields=id,slug,link&page='+p);
    if(!r || r[0]!=='[') break;
    let a; try{ a=JSON.parse(r); }catch(e){ break; }
    if(!a.length) break; pages=pages.concat(a); if(a.length<100) break;
  }
  out += '\nPublished pages: '+pages.length+'\n';
  putFile('step3.txt', out);

  // === Screenshot: 1 veisle + 1 landing ===
  const { chromium } = await import('playwright');
  const browser = await chromium.launch({ args:['--no-sandbox','--ignore-certificate-errors'] });
  for(const [name, u, w, h] of [['h1_veisle','/kolis/',1280,900],['h1_landing','/hipoalerginis-maistas/',1280,900],['h1_mobile','/kolis/',390,844]]){
    const ctx = await browser.newContext({ httpCredentials:{ username:WPU, password:WPP }, ignoreHTTPSErrors:true, viewport:{width:w,height:h} });
    const pg = await ctx.newPage();
    await pg.goto(DEV+u+'?nc='+Date.now(), { waitUntil:'domcontentloaded', timeout:60000 });
    await pg.waitForTimeout(3500);
    putBin(name+'.png', await pg.screenshot({ fullPage:false }));
    await ctx.close();
  }
  await browser.close();
})().catch(e=>{ console.log('ERR', String(e).slice(0,250)); });
