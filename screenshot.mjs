import { execSync } from "child_process";
import fs from "fs";
function ghget(path){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;const r=execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "https://api.github.com/repos/'+repo+'/contents/'+path+'?ref=main"',{encoding:'utf8',maxBuffer:20000000});return JSON.parse(r);}
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'pf '+n,branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));execSync('curl -s --max-time 40 -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'});}
let out='';const L=s=>{out+=s+'\n';};
const BASE='https://dev.avesa.lt';const U=process.env.WP_USER||'';const P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const files=[
  "upl_cat-katems-maistas-v1.webp",
  "upl_cat-katems-kraikai-v1.webp",
  "upl_cat-katems-tualetai-v1.webp",
  "upl_cat-katems-skanestai-v1.webp",
  "upl_cat-katems-zaislai-v1.webp",
  "upl_cat-katems-draskykles-v1.webp",
  "upl_cat-katems-dubeneliai-v1.webp",
  "upl_cat-katems-vitaminai-v1.webp"
];
(async()=>{const map={};
for(const fn of files){
  try{
    const d=ghget('assets/katems-kategorijos/'+fn);
    fs.writeFileSync('/tmp/'+fn,Buffer.from(d.content,'base64'));
    const cmd='curl -s -k --max-time 60 -w "\nHTTP:%{http_code}" -u "'+U+':'+P+'" -X POST -H "Content-Disposition: attachment; filename='+fn+'" -H "Content-Type: image/webp" --data-binary @/tmp/'+fn+' "'+BASE+'/wp-json/wp/v2/media"';
    const r=execSync(cmd,{encoding:'utf8',maxBuffer:20000000});
    const code=(r.match(/HTTP:(\S+)$/)||[])[1];const body=r.replace(/\nHTTP:\S+$/,'');
    let id=0,url='';try{const j=JSON.parse(body);id=j.id;url=j.source_url;}catch(e){}
    map[fn]={id,url,code};L(fn+' -> id='+id+' '+code);
  }catch(e){L(fn+' ERR '+e);}
}
putText('cat_media_ids.json',JSON.stringify(map,null,2));putText('_catupload.txt',out);
})();
