import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
function putResult(name, obj){
  const b64=Buffer.from((typeof obj==='string')?obj:JSON.stringify(obj,null,1),'utf8').toString('base64');
  const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;
  const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;
  function getSha(){try{return JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){return '';}}
  function doPut(sha){const body={message:'r',content:b64,branch:'main'};if(sha)body.sha=sha;fs.writeFileSync('/tmp/p.json',JSON.stringify(body));return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/p.json "'+url+'"',{encoding:'utf8'}).trim();}
  let code='';for(let i=0;i<5;i++){const sha=getSha();code=doPut(sha);if(code==='200'||code==='201')return code;execSync('sleep 2');}return 'FAIL:'+code;
}
const TS="1782145822";
const out={};
function cs(method,p,body){ let cmd; if(body){ fs.writeFileSync('/tmp/c.json',JSON.stringify(body)); cmd=`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" -X ${method} -d @/tmp/c.json "https://dev.avesa.lt/wp-json/code-snippets/v1/${p}"`; } else { cmd=`curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" -X ${method} "https://dev.avesa.lt/wp-json/code-snippets/v1/${p}"`; } return JSON.parse(execSync(cmd,{encoding:'utf8',env,maxBuffer:20000000})); }
let php=fs.readFileSync('modules/pauksrusis.php','utf8').replace(/^\uFEFF?<\?php\s*/,'');
const r=cs('PUT','snippets/507',{name:'Paukscio Rusis Modulis v1.3',scope:'global',priority:11,active:true,code:php});
out.snippet={id:r.id,active:r.active};
execSync('sleep 2');
const html=execSync(`curl -sk --max-time 60 "https://dev.avesa.lt/?petshop_attr_pauksrusis=dry&k=ps2026"`,{encoding:'utf8',maxBuffer:10000000});
const m=html.match(/Viso:\s*<b>(\d+)<\/b>.*?PARSED:\s*<b>(\d+)<\/b>.*?REVIEW:\s*<b>(\d+)<\/b>/s);
out.summary=m?{viso:+m[1],parsed:+m[2],review:+m[3]}:'no';
out.dist={};
[...html.matchAll(/=&gt; ([^<]+)<\/td>/g)].forEach(x=>{ x[1].split(' | ').forEach(t=>{ t=t.trim(); out.dist[t]=(out.dist[t]||0)+1; }); });
out.has_bang_term = /Banguotosios/.test(html);
out.fin=putResult('pauksdry4_'+TS+'.txt', out);
