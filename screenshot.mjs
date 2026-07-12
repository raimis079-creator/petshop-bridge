import { execSync } from "child_process";
import fs from "fs";
function putBinary(n,buf){
  const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;
  for(let a=0;a<4;a++){
    try{
      const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+n;
      let sha='';
      try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}
      const b={message:'pf '+n,branch:'main',content:buf.toString('base64')};
      if(sha)b.sha=sha;
      fs.writeFileSync('/tmp/pb.json',JSON.stringify(b));
      const r=execSync('curl -s --max-time 45 -w "\nHTTP:%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pb.json "'+url+'"',{encoding:'utf8',maxBuffer:80000000});
      if(/HTTP:20[01]/.test(r))return true;
    }catch(e){}
    execSync('sleep 2');
  }
  return false;
}
function putText(n,s){
  const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;
  const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;
  let sha='';
  try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}
  const b={message:'pf '+n,branch:'main',content:Buffer.from(s,'utf8').toString('base64')};
  if(sha)b.sha=sha;
  fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));
  execSync('curl -s --max-time 40 -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'});
}
let out='';const L=s=>{out+=s+'\n';console.log(s);};
const items=[
  {id:34471,img:"https://dev.avesa.lt/wp-content/uploads/2026/07/dp-clean-34471-300x300.jpg"},
  {id:34486,img:"https://dev.avesa.lt/wp-content/uploads/2026/07/dp-clean-34486-300x300.jpg"},
  {id:34156,img:"https://dev.avesa.lt/wp-content/uploads/2026/06/rink-animonda-gc-6x400-1-300x202.jpg"},
  {id:34168,img:"https://dev.avesa.lt/wp-content/uploads/2026/06/rink-ausys-15-300x105.jpg"},
  {id:34175,img:"https://dev.avesa.lt/wp-content/uploads/2026/06/rink-composition-34175-1782850649-300x300.jpg"},
  {id:27198,img:"https://dev.avesa.lt/wp-content/uploads/2026/06/70bf1c2c-2cd8-4bf9-a307-542aa4e7f9b1-300x300.png"},
  {id:26500,img:"https://dev.avesa.lt/wp-content/uploads/2026/06/bbbb5e50-f198-4a8d-a32f-ba4a8b23f80e-300x300.png"},
  {id:33994,img:"https://dev.avesa.lt/wp-content/uploads/2026/06/0003962_10_150401-k9powerharness-l1-6385-cm50-mm-juodos-300x300.jpeg"},
  {id:33956,img:"https://dev.avesa.lt/wp-content/uploads/2026/06/0007465_10_16271-trixie-comfort-soft-touring-petnesos-s-33-50cm20mm-juodos-300x300.jpeg"},
  {id:26897,img:"https://dev.avesa.lt/wp-content/uploads/2026/06/b8653d41-bf7c-48cc-b327-4682014699f6-300x300.png"},
  {id:23934,img:"https://dev.avesa.lt/wp-content/uploads/2026/06/42c79f9d-6ac3-4d88-a212-b79fc959291a-300x300.png"},
  {id:27852,img:"https://dev.avesa.lt/wp-content/uploads/2026/06/b6fc7a843aef461091aa1b83adfd23e0-300x300.jpg"},
  {id:26640,img:"https://dev.avesa.lt/wp-content/uploads/2026/06/4ec2c9d0-03d7-41d1-acce-0683752800f9-300x300.png"},
  {id:27071,img:"https://dev.avesa.lt/wp-content/uploads/2026/06/1bd77f53-1d13-4ca7-bc20-3b5909d18621-300x300.png"},
  {id:23705,img:"https://dev.avesa.lt/wp-content/uploads/2026/06/2100ae3d-73b3-4cad-956b-623e97b0dfb5-300x300.png"},
  {id:24802,img:"https://dev.avesa.lt/wp-content/uploads/2026/06/852ac5c8-2a95-4321-9508-77a824db99be-300x300.png"},
  {id:26919,img:"https://dev.avesa.lt/wp-content/uploads/2026/06/75180810-c574-4fe2-96c9-bfa2aaf1e69d-300x300.png"},
  {id:26958,img:"https://dev.avesa.lt/wp-content/uploads/2026/06/7a6dc3a6246b4e72bce28737da6a0f45-300x300.png"},
  {id:14492,img:"https://dev.avesa.lt/wp-content/uploads/2026/06/0005079_11_680201-trixie-vimy-lietpaltis-xs-30-cm-zydras-300x300.jpeg"},
  {id:33894,img:"https://dev.avesa.lt/wp-content/uploads/2026/06/0006602_13_39821-trixie-capri-2-boksas-xs-s-37x34x55-cm-tamsiai-pilka-sviesiai-pilka-1-300x232.jpeg"}
];
(async()=>{
  let ok=0;
  for(const it of items){
    try{
      const b=execSync('curl -s -k --max-time 25 "'+it.img+'"',{encoding:'buffer',maxBuffer:20000000});
      if(b.length>500){putBinary('p'+it.id+'.png',b);ok++;L('ok '+it.id+' '+b.length);}
      else{L('small '+it.id);}
    }catch(e){L('err '+it.id);}
  }
  putText('_dlrun.txt',out+'\nDONE ok='+ok);
})();
