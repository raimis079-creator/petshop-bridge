import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
const IDS="34484,12883,16311,23502,16959,18131,34510,15832,34471,23904,19089,15754,18221,22877,15856,18372,16189,17440,15734,19902,19866,17657,14031,17574,19692,19570,19875,17446,15547,15671,15039,34486,19134,13144,15184,17723,15336,17386,16528,19393,19869,15942,18674,17305,15484,23247,26512,15309,19872,16922,20911,19878,18955,13143,15706,24072,24080,18719,16782,19863,17805,15976,15543,18679,15312,26819,15746,18745,15181,17932,15345,18346,34488,15351,15342,15539,16889,13635,34500,15271,15515,23452,12564,16122,26987,16329,21599,17732,12895,19095,13751".split(",");
function putFile(name,str){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'dupattr',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function wp(path){ try{ return execSync('curl -sk -u "$WPU:$WPP" "'+DEV+path+'"',{encoding:'utf8',maxBuffer:50000000,timeout:90000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; } }
let all=[];
for(let i=0;i<IDS.length;i+=45){
  const chunk=IDS.slice(i,i+45).join(',');
  const r=wp('/wp-json/wc/v3/products?include='+chunk+'&per_page=45&_fields=id,slug,name,attributes,meta_data');
  let a; try{ a=JSON.parse(r); }catch(e){ continue; }
  if(Array.isArray(a)) a.forEach(p=>{
    const pak=(p.attributes||[]).find(x=>/pakuot|dydis/i.test(x.name||''));
    const dpq=(p.meta_data||[]).find(m=>m.key==='_dp_pack_qty');
    all.push({id:p.id,slug:p.slug,name:(p.name||'').slice(0,80),pak:pak?pak.options:[],dpq:dpq?dpq.value:''});
  });
}
let out='id\tslug\tname\tpak\tdpq\n';
all.forEach(p=>out+=p.id+'\t'+p.slug+'\t'+p.name.replace(/\t/g,' ')+'\t'+JSON.stringify(p.pak)+'\t'+p.dpq+'\n');
putFile('dupattr.tsv',out);
putFile('dupattr_meta.json',JSON.stringify({n:all.length}));
