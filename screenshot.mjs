import { execSync } from "child_process";
import fs from "fs";
function putBinary(n,buf){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'pf '+n,branch:'main',content:buf.toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pb.json',JSON.stringify(b));execSync('curl -s --max-time 45 -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pb.json "'+url+'"',{encoding:'utf8',maxBuffer:80000000});}
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'x','branch':'main',content:Buffer.from(s).toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));execSync('curl -s --max-time 40 -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'});}
const items=[
  {id:21099,img:"https://dev.avesa.lt/wp-content/uploads/2026/06/0a5df8e4-bc41-4a2a-a6a9-ac61be4c2e53-300x300.png"},
  {id:20691,img:"https://dev.avesa.lt/wp-content/uploads/2026/06/e5b7e6fb-aca8-4f95-b96b-4308550f736e-300x300.png"},
  {id:20703,img:"https://dev.avesa.lt/wp-content/uploads/2026/06/6b630504-189e-414d-8bb4-2fdd7d64e65f-300x300.png"},
  {id:20642,img:"https://dev.avesa.lt/wp-content/uploads/2026/06/5d8c982c-77ac-4273-ae88-7e6648b43bbb-300x300.png"},
  {id:20648,img:"https://dev.avesa.lt/wp-content/uploads/2026/06/a5eba42b-e31e-4b24-92bb-3cff59a9a98a-300x300.png"},
  {id:20666,img:"https://dev.avesa.lt/wp-content/uploads/2026/06/5b6fca0e-565a-4c58-b9c0-ee0774dd93c4-300x300.png"},
  {id:23983,img:"https://dev.avesa.lt/wp-content/uploads/2026/06/bb32e3ff-de94-41df-a4de-5f4e52176f49-300x300.png"},
  {id:21401,img:"https://dev.avesa.lt/wp-content/uploads/2026/06/450cf55d-cb3f-41f1-9c03-ef9009c19570-300x300.png"},
  {id:20846,img:"https://dev.avesa.lt/wp-content/uploads/2026/06/d05f74e2-e748-4e4a-8f8c-9f2d6a024e39-300x300.png"},
  {id:25993,img:"https://dev.avesa.lt/wp-content/uploads/2026/06/9cd2a4ae-e528-452d-9cf7-ed73fad2cd0a-300x300.png"},
  {id:17555,img:"https://dev.avesa.lt/wp-content/uploads/2026/06/me-medzio-drozliu-kraikas-grauzikams-900-g-1-300x300.png"},
  {id:15642,img:"https://dev.avesa.lt/wp-content/uploads/2026/06/s-sienas-grauzikams-ekologiskas-450-g-1-300x300.png"}
];let ok=0;
for(const it of items){try{const b=execSync('curl -s -k --max-time 25 "'+it.img+'"',{encoding:'buffer',maxBuffer:20000000});if(b.length>500){putBinary('g'+it.id+'.png',b);ok++;}}catch(e){}}
putText('_grauzdl.txt','ok='+ok);
