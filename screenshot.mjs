import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}
const CH=[
 {id:17188,vals:['340\u2013575 g','1920 g'],type:'A'},
 {id:17176,vals:['100\u2013520 g','1000\u20131920 g'],type:'B'},
 {id:17182,vals:['190\u2013530 g','1350 g+','paros doz\u0117 priklauso'],type:'C+note'},
 {id:17153,vals:['200\u2013580 g','1500 g','Laikyti sausoje'],type:'C+storage'},
 {id:17165,vals:['iki 5 kg','200\u2013300 g','vir\u0161 25 kg'],type:'C+bounds'}
];
execSync('rm -rf /tmp/f && mkdir -p /tmp/f',{env});
const out=[];
for(const c of CH){
  let html='';
  try{html=execSync(`curl -sk -L --max-time 45 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/?p=${c.id}&ps_desc=1"`,{env,maxBuffer:200000000,encoding:'utf8'});}catch(e){html='';}
  const r={id:c.id,type:c.type,len:html.length};
  r.b2b=html.includes('b2b-black');
  r.table=/<table/i.test(html.slice(html.indexOf('b2b-black')>-1?html.indexOf('b2b-black'):0));
  r.head=/\u0160\u0117rimo\s+rekomendacij/i.test(html);
  r.vals=c.vals.map(v=>({v,ok:html.includes(v)}));
  // old prose leftover? spaced "5 - 10 kg" or "&nbsp; &nbsp;" in a feeding context
  r.oldspace=/\d\s+-\s+\d+\s*kg/.test(html);
  out.push(r);
}
commit("ont_A_front_"+Date.now()+".json", JSON.stringify(out,null,1));
console.log("DONE");
