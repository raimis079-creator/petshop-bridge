import { execSync } from "child_process";
import fs from "fs";
function putBinary(n,buf){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;for(let a=0;a<4;a++){try{const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'pf '+n,branch:'main',content:buf.toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pb.json',JSON.stringify(b));const r=execSync('curl -s --max-time 45 -w "\nHTTP:%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pb.json "'+url+'"',{encoding:'utf8',maxBuffer:80000000});if(/HTTP:20[01]/.test(r))return true;}catch(e){}execSync('sleep 2');}return false;}
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'pf '+n,branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));execSync('curl -s --max-time 40 -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'});}
let out='';const L=s=>{out+=s+'\n';};
const items=[
  {id:34498,img:"https://dev.avesa.lt/wp-content/uploads/2026/07/dp-clean-34498-300x300.jpg"},
  {id:34500,img:"https://dev.avesa.lt/wp-content/uploads/2026/07/dp-clean-34500-300x300.jpg"},
  {id:34488,img:"https://dev.avesa.lt/wp-content/uploads/2026/07/dp-clean-34488-300x300.jpg"},
  {id:34172,img:"https://dev.avesa.lt/wp-content/uploads/2026/06/rink-churu-mix-7-300x202.jpg"},
  {id:34170,img:"https://dev.avesa.lt/wp-content/uploads/2026/06/rink-churu-9-300x300.jpg"},
  {id:24992,img:"https://dev.avesa.lt/wp-content/uploads/2026/06/7a943fa8-d69f-462b-a6b5-2f58e3f76161-300x300.png"},
  {id:17305,img:"https://dev.avesa.lt/wp-content/uploads/2026/06/ne-negriunantis-besisypsantis-kiausinis-1-300x300.png"},
  {id:26342,img:"https://dev.avesa.lt/wp-content/uploads/2026/06/f2f81f02-00f1-4e57-82cf-3dc22f3a4e20-300x300.png"},
  {id:24790,img:"https://dev.avesa.lt/wp-content/uploads/2026/06/0077f575-7b0f-4066-81f0-575b0686bed2-300x300.png"},
  {id:32554,img:"https://dev.avesa.lt/wp-content/uploads/2026/06/0004979_32_40210-trixie-be-eco-vico-tualetas-namelis-katei-40x40x56-cm-antracitopilksvas-300x300.jpeg"},
  {id:27866,img:"https://dev.avesa.lt/wp-content/uploads/2026/06/e495f2db6e9f46129787ee7c806a601b-300x300.jpg"},
  {id:33990,img:"https://dev.avesa.lt/wp-content/uploads/2026/06/0007860_36_44541-trixie-baza-draskykle-2-stulpai-su-guoliu-50-cm-sviesi-300x300.jpeg"},
  {id:32578,img:"https://dev.avesa.lt/wp-content/uploads/2026/06/0009143_36_43371-trixie-baena-draskykle-stulpas-69-cm-pilka-300x300.jpeg"},
  {id:25121,img:"https://dev.avesa.lt/wp-content/uploads/2026/06/e6639996-7e2f-48c5-885d-5c2c8fb5b105-300x300.png"},
  {id:20800,img:"https://dev.avesa.lt/wp-content/uploads/2026/06/e4d0f9b8-02b5-4760-a5fd-47ade4d25f5a-300x300.png"},
  {id:18485,img:"https://dev.avesa.lt/wp-content/uploads/2026/06/pasta-duo-malt-vistiena_1779787865-300x300.jpg"},
  {id:26790,img:"https://dev.avesa.lt/wp-content/uploads/2026/06/2ccfac68-38ea-467c-9210-426449e5dd17-300x300.png"},
  {id:26017,img:"https://dev.avesa.lt/wp-content/uploads/2026/06/1d50d39b-561f-4307-91a7-544b5b385a5a-300x300.png"},
  {id:19268,img:"https://dev.avesa.lt/wp-content/uploads/2026/06/11184-antkaklis-katei-su-varpeliu-su-peduciu-paveiksliuku_1734012606-300x280.jpg"},
  {id:33894,img:"https://dev.avesa.lt/wp-content/uploads/2026/06/0006602_13_39821-trixie-capri-2-boksas-xs-s-37x34x55-cm-tamsiai-pilka-sviesiai-pilka-1-300x232.jpeg"}
];
(async()=>{let ok=0;
for(const it of items){
  try{const b=execSync('curl -s -k --max-time 25 "'+it.img+'"',{encoding:'buffer',maxBuffer:20000000});
    if(b.length>500){putBinary('c'+it.id+'.png',b);ok++;L('ok '+it.id+' '+b.length);}else{L('small '+it.id);}
  }catch(e){L('err '+it.id);}
}
putText('_catdl.txt',out+'\nDONE ok='+ok);
})();
