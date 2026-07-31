import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WU=process.env.WP_USER, WP=process.env.WP_APP_PASS, SITE='https://dev.avesa.lt';
function putB64(n,b){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+n;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:50e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:b,...(s?{sha:s}:{})}));
  const c=execSync('curl -sk -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:50e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
function sh(c){try{const o=execSync(c+' 2>&1',{maxBuffer:50e6,shell:'/bin/bash'}).toString();return o;}catch(e){return String(e).slice(0,300);}}
const AUTH='-u "'+WU+':'+WP+'"', API=SITE+'/wp-json/code-snippets/v1/snippets';
const O={fazes:[]};
function listAll(){
  let all=[], page=1;
  while(page<=5){
    const r=sh('curl -sSk '+AUTH+' "'+API+'?per_page=100&page='+page+'"');
    let arr=null; try{arr=JSON.parse(r);}catch(e){ O.fazes.push('list p'+page+' klaida: '+r.slice(0,120)); break; }
    if(!Array.isArray(arr)||arr.length===0) break;
    all=all.concat(arr); if(arr.length<100) break; page++;
  }
  return all;
}
// 1) PATIKRA: ar keturi tikrai dingo
let a1=listAll();
O.viso_pries=a1.length;
O.keturi_liko=a1.filter(s=>[1885,1937,1999,2003].includes(s.id)).map(s=>s.id);
let temp=a1.filter(s=>s.name&&s.name.indexOf('TEMP')===0);
O.TEMP_pries=temp.length;
O.TEMP_aktyvus_pries=temp.filter(s=>s.active).map(s=>s.id+':'+s.name);

// 2) TRYNIMAS — tik jei patikra rodo, kad DELETE realiai veikia
if (O.keturi_liko.length === 0) {
  let ok=0, fail=[];
  for (const s of temp) {
    const d=sh('curl -sSk -o /dev/null -w "%{http_code}" '+AUTH+' -X DELETE "'+API+'/'+s.id+'"').trim();
    if(d==='204'||d==='200') ok++; else fail.push(s.id+':'+d);
  }
  O.istrinta=ok; O.nepavyko=fail.slice(0,15);
  // 3) NEPRIKLAUSOMA PATIKRA
  const a2=listAll();
  O.viso_po=a2.length;
  O.TEMP_po=a2.filter(s=>s.name&&s.name.indexOf('TEMP')===0).map(s=>s.id+':'+s.name);
} else {
  O.SUSTABDYTA='DELETE tik atrode sekmingas — keturi vis dar sarase, netrinam masiskai';
}
O.site=sh('curl -sSk -m 25 -o /dev/null -w "%{http_code}" "'+SITE+'/"').trim();
putB64('cleanup3.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
