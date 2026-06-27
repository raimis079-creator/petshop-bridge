import fs from "fs";
import { execSync } from "child_process";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}
function putBin(name, buf){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}fs.writeFileSync('/tmp/b64.txt',buf.toString('base64'));const o={message:'r',branch:'main',content:buf.toString('base64')};if(sha)o.sha=sha;fs.writeFileSync('/tmp/put.json',JSON.stringify(o));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/put.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}
const base='https://storage.googleapis.com/prinspetfoods/products/large/';
const cands={
 sc:['prins-procare-grainfree-skin-coat-voedingswijzer.webp'],
 sens:['prins-procare-grainfree-sensible-voedingswijzer.webp','prins-procare-grainfree-sensible-hypoallergic-voedingswijzer.webp','prins-procare-grainfree-sensible-3kg-voedingswijzer.webp'],
 ape:['prins-procare-grainfree-adult-pro-energy-voedingswijzer.webp','prins-procare-grainfree-junior-adult-voedingswijzer.webp','prins-procare-grainfree-pro-energy-voedingswijzer.webp']
};
const out={};
for(const [key,list] of Object.entries(cands)){
  for(const fn of list){
    const url=base+fn;
    try{
      execSync(`curl -s -o /tmp/img.bin -w "%{http_code} %{content_type} %{size_download}" "${url}" > /tmp/hdr.txt 2>/dev/null`);
      const hdr=fs.readFileSync('/tmp/hdr.txt','utf8').trim();
      const [code,ctype,size]=hdr.split(/\s+/);
      if(code==='200' && /image/.test(ctype||'') && parseInt(size)>2000){
        const buf=fs.readFileSync('/tmp/img.bin');
        const pc=putBin('gtab_'+key+'.webp',buf);
        out[key]={fn,code,ctype,size:parseInt(size),put:pc};
        break;
      }else{ out[key+'_try_'+fn]={code,ctype,size}; }
    }catch(e){ out[key+'_err']=String(e).slice(0,120); }
  }
}
commit('gcs_status_'+Date.now()+'.json',JSON.stringify(out,null,1));
console.log('GCS DONE');
