import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const SITE='https://dev.avesa.lt';
function sh(c){try{return execSync(c+' 2>&1',{maxBuffer:20e6,shell:'/bin/bash'}).toString();}catch(e){return String(e).slice(0,200);}}
function putResult(name,txt){const u='https://api.github.com/repos/'+REPO+'/contents/analize/'+name;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk --max-time 30 -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:20e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'s434',content:Buffer.from(txt).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync('curl -sk --max-time 60 -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:20e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
const O={VERSIJA_RUN:'run434-imtis'};
const IMTIS={
 'page_veisle':'jorksyro-terjeras',
 'page_lentele':'suns-serimo-lentele-gramais',
 'page_kate':'siamo-kate',
 'product_sepija':'sepija-mineralas-skanestas-pauksciams-20-cm-1-vnt',
 'product_sampunas':'sampunas-jorksyrams-super-beno-york-professional-250-ml',
 'product_athena':'athena-pienas-katems-200-ml',
 'brand_exclusion':'exclusion',
 'brand_prins':'prins-petfoods',
 'brand_animonda':'animonda-gran-carno',
 'cat_tualetai':'katems/tualetai-kraiku-semtuveliai-kilimeliai',
 'cat_dovanos':'dovanos-sunims-bei-katems',
 'cat_lesalas':'lesalas-dekoratyviniams-pauksciams',
 'index_php':'index.php',
 'geriausias':'geriausias-sausas-sunu-maistas',
};
O.rez={};
for(const [k,p] of Object.entries(IMTIS)){
  const o=sh('curl -sSkI --max-time 25 "'+SITE+'/'+p+'"');
  const code=(o.match(/HTTP\/[\d.]+ (\d+)/)||[])[1];
  const loc=(o.match(/[Ll]ocation: (\S+)/)||[])[1]||null;
  const by=(o.match(/[Xx]-[Rr]edirect-[Bb]y: (.+)/)||[])[1]||null;
  const fin=sh('curl -sSkIL --max-time 35 -o /dev/null -w "%{http_code}|%{num_redirects}" "'+SITE+'/'+p+'"').trim();
  O.rez[k]={kelias:p, code, loc:loc?loc.replace(SITE,''):null, by:by?by.trim():null, galutinis:fin};
}
putResult('s434.json', JSON.stringify(O,null,1));
console.log('OK');
