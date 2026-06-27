import fs from "fs";
import { execSync } from "child_process";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}
function putBin(name, buf){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const o={message:'r',branch:'main',content:buf.toString('base64')};if(sha)o.sha=sha;fs.writeFileSync('/tmp/put.json',JSON.stringify(o));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/put.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}
const UA="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36";
const cands={
 lamb:['https://www.prinspetfoods.nl/static/uploads/pictures/large/prins-procare-protection-lamb-hypoallergic-voedingswijzer.png','https://www.prinspetfoods.nl/static/uploads/pictures/normal/prins-procare-protection-lamb-hypoallergic-voedingswijzer.png'],
 sportlife:['https://www.prinspetfoods.nl/static/uploads/pictures/large/prins-procare-sport-life-excellent-voedingswijzer.png','https://www.prinspetfoods.nl/static/uploads/pictures/normal/prins-procare-sport-life-excellent-voedingswijzer.png']
};
const out={};
for(const [key,list] of Object.entries(cands)){
  for(const url of list){
    try{
      execSync(`curl -s -A "${UA}" -o /tmp/img.bin -w "%{http_code} %{content_type} %{size_download}" "${url}" > /tmp/hdr.txt 2>/dev/null`);
      const [code,ctype,size]=fs.readFileSync('/tmp/hdr.txt','utf8').trim().split(/\s+/);
      if(code==='200' && /image/.test(ctype||'') && parseInt(size)>3000){
        const buf=fs.readFileSync('/tmp/img.bin');
        out[key]={url,code,ctype,size:parseInt(size),put:putBin('ptab_'+key+'.png',buf)};break;
      }else out[key+'_try']={url:url.slice(-40),code,ctype,size};
    }catch(e){out[key+'_err']=String(e).slice(0,100);}
  }
}
commit('limg_status_'+Date.now()+'.json',JSON.stringify(out,null,1));
console.log('LIMG DONE');
