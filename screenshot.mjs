import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const OLD="https://petshop.lt";
const BIDS=["24", "11", "6", "32", "36", "34", "35", "27", "7", "12", "29", "5", "4", "21"];
function putFile(name,str){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'blogresolve',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
const out={ts:new Date().toISOString(),res:[]};
for(const bid of BIDS){
  const u=OLD+'/index.php?route=blog/article/prints&blogid='+bid+'&view=print';
  let title='',h1='';
  try{
    const html=execSync('curl -sL -A "Mozilla/5.0" --max-time 40 "'+u+'"',{encoding:'utf8',maxBuffer:20000000,timeout:45000});
    title=((html.match(/<title>([^<]*)<\/title>/i)||[])[1]||'').replace(/&amp;/g,'&').trim().slice(0,80);
    h1=((html.match(/<h1[^>]*>([^<]*)<\/h1>/i)||[])[1]||'').trim().slice(0,80);
  }catch(e){ title='EXC'; }
  out.res.push({bid,title,h1});
  putFile('blogresolve.json',JSON.stringify(out));
}
putFile('blogresolve.json',JSON.stringify(out));
