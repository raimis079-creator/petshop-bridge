import { execSync } from "child_process";
import fs from "fs";
function putBinary(n,buf){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'pf '+n,branch:'main',content:buf.toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pb.json',JSON.stringify(b));execSync('curl -s --max-time 45 -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pb.json "'+url+'"',{encoding:'utf8',maxBuffer:80000000});}
const b=execSync('curl -s -k --max-time 25 "https://dev.avesa.lt/wp-content/uploads/2026/06/automatine-gertuve-fontanas-katems-catit-25l-zalias-300x300.jpg"',{encoding:'buffer',maxBuffer:20000000});
putBinary('c19140.png',b);
console.log('dl',b.length);
