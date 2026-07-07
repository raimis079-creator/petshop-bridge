import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
const IDS="12564,15376,13144,19393,12568,26093,12662,18181,19290,26512,18101,18106,12556,19297,13108,16054,19306,34471,21599,18919,12550,23831,22765,18745,19902,18092,18098,12830,16020,19095,15734,18320,16528,15976,17296,23452,19570,12486,13637,18040,16785,18109,13635,19089,18221,15312,18302,15181,16189,18715,17932,15700,18524,12663,16959,19137,19309,12554,12719,17574,26819,18115,18134,12457,23904,19281,19620,13974,18959,19692,18665,14031,15729,19054,25159,12456,12468,20911,16534,21875,15318,13869,18084,15394,15543,17305,18341,15391,18051,24080,15048,18188,13143,16782,18951,16078,12483,12661,18080,12659,18054,15754,18043,12484,12544,18191,15309,12883,17386,15671,12828,22877,15342,15196,26987";
function putFile(name,str){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'verif',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function wp(path){ try{ return execSync('curl -sk -u "$WPU:$WPP" "'+DEV+path+'"',{encoding:'utf8',maxBuffer:50000000,timeout:90000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; } }
const idarr=IDS.split(',');
let all=[];
for(let i=0;i<idarr.length;i+=50){
  const chunk=idarr.slice(i,i+50).join(',');
  const r=wp('/wp-json/wc/v3/products?include='+chunk+'&per_page=50&_fields=id,slug,name,attributes');
  let a; try{ a=JSON.parse(r); }catch(e){ continue; }
  if(Array.isArray(a)) a.forEach(p=>{
    const pak=(p.attributes||[]).find(x=>/pakuot|dydis/i.test(x.name||''));
    all.push({id:p.id,slug:p.slug,name:(p.name||'').slice(0,80),pak:pak?pak.options:[]});
  });
}
let out='id\tslug\tname\tpak\n';
all.forEach(p=>out+=p.id+'\t'+p.slug+'\t'+p.name.replace(/\t/g,' ')+'\t'+JSON.stringify(p.pak)+'\n');
putFile('verifattr.tsv',out);
putFile('verifattr_meta.json',JSON.stringify({n:all.length}));
