import { execSync } from "child_process";
import fs from "fs";
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'x',branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));execSync('curl -s --max-time 40 -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'});}
let out='';const L=s=>{out+=s+'\n';};
const MK=(process.env.SENDER_MARKETING_TOKEN||'').trim();
const API='https://api.sender.net/v2';
function call(method, path, body){
  let cmd='curl -s --max-time 30 -w "\nHTTP:%{http_code}" -X '+method+' -H "Authorization: Bearer '+MK+'" -H "Accept: application/json" -H "Content-Type: application/json" "'+API+path+'"';
  if(body){fs.writeFileSync('/tmp/sb.json',JSON.stringify(body));cmd='curl -s --max-time 30 -w "\nHTTP:%{http_code}" -X '+method+' -H "Authorization: Bearer '+MK+'" -H "Accept: application/json" -H "Content-Type: application/json" --data-binary @/tmp/sb.json "'+API+path+'"';}
  let r;try{r=execSync(cmd,{encoding:'utf8',maxBuffer:10000000});}catch(e){r=(e.stdout||'')+'\nHTTP:ERR';}
  const code=(r.match(/HTTP:(\S+)$/)||[])[1]||'?';
  const raw=r.replace(/\nHTTP:\S+$/,'');
  let j=null;try{j=JSON.parse(raw);}catch(e){}
  return {code, raw, j};
}
(async()=>{
  // 1. create group PS_TEST
  L('=== 1. Kuriu grupe PS_TEST ===');
  let gid=null;
  const c=call('POST','/groups',{title:'PS_TEST'});
  L('POST /groups HTTP '+c.code);
  if(c.code==='200'||c.code==='201'){
    gid=(c.j&&c.j.data&&(c.j.data.id||c.j.data.group_id))||(c.j&&c.j.id)||null;
    L('  ✅ Grupe sukurta, ID: '+gid);
  } else {
    L('  atsakymas: '+c.raw.slice(0,250));
  }
  // fallback: list groups to get id if not returned
  if(!gid){
    const g=call('GET','/groups');
    try{const arr=(g.j.data||g.j||[]);const f=arr.find(x=>/PS_TEST/i.test(x.title||x.name||''));if(f)gid=f.id;}catch(e){}
    L('  (per list gautas ID: '+gid+')');
  }
  // 2. add subscriber terra@gyvunai.lt to the group
  L('');
  L('=== 2. Pridedu kontakta terra@gyvunai.lt ===');
  // Sender v2: POST /subscribers  with groups array
  const subBody={email:'terra@gyvunai.lt', firstname:'Petshop', lastname:'Test'};
  if(gid) subBody.groups=[String(gid)];
  const s=call('POST','/subscribers', subBody);
  L('POST /subscribers HTTP '+s.code);
  if(s.code==='200'||s.code==='201'){
    L('  ✅ Kontaktas pridetas');
  } else {
    L('  atsakymas: '+s.raw.slice(0,250));
  }
  // 3. verify: list groups again
  L('');
  L('=== 3. Patvirtinimas ===');
  const v=call('GET','/groups');
  try{
    const arr=(v.j.data||v.j||[]);
    const names=arr.map(x=>({title:x.title||x.name, id:x.id, subs:x.subscribers_count!==undefined?x.subscribers_count:(x.active_subscribers!==undefined?x.active_subscribers:'?')}));
    L('Grupes dabar: '+JSON.stringify(names));
  }catch(e){L('list parse err: '+v.raw.slice(0,150));}
  putText('_psgroup.txt', out+'\nGID='+gid);
  console.log('done');
})();
