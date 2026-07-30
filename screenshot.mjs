import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WU=process.env.WP_USER, WP=process.env.WP_APP_PASS, SITE='https://dev.avesa.lt';
function putB64(n,b){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+n;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:50e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:b,...(s?{sha:s}:{})}));
  const c=execSync('curl -sk -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:50e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
function sh(c){try{const o=execSync(c+' 2>&1; echo "__RC:$?"',{maxBuffer:50e6,shell:'/bin/bash'}).toString();
 const m=o.match(/__RC:(\d+)\s*$/);return{rc:m?+m[1]:-1,out:o.replace(/__RC:\d+\s*$/,'')};}catch(e){return{rc:-99,out:String(e).slice(0,300)};}}
const AUTH='-u "'+WU+':'+WP+'"', API=SITE+'/wp-json/code-snippets/v1/snippets';
const O={}; let sid=null;
const php=Buffer.from('PD9waHAKLyoqCiAqIFRFTVAgRmxhdHNvbWUgU29jaWFsIFJlY29uIHYxCiAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogICAgaWYgKCAhIGlzc2V0KCRfR0VUWydwc19zb2MnXSkgfHwgJF9HRVRbJ3BzX3NvYyddICE9PSAnU280cScgKSByZXR1cm47CiAgICAkciA9IGFycmF5KCk7CiAgICAkbW9kcyA9IGdldF90aGVtZV9tb2RzKCk7CiAgICAkc29jID0gYXJyYXkoKTsKICAgIGZvcmVhY2ggKCAoYXJyYXkpJG1vZHMgYXMgJGsgPT4gJHYgKSB7CiAgICAgICAgaWYgKCAhIGlzX3NjYWxhcigkdikgKSBjb250aW51ZTsKICAgICAgICBpZiAoIHByZWdfbWF0Y2goJyNmYWNlYm9va3xpbnN0YWdyYW18dHdpdHRlcnx5b3V0dWJlfGxpbmtlZGlufHRpa3Rva3xwaW50ZXJlc3R8c29jaWFsfGVtYWlsfHdoYXRzYXBwfHRlbGVncmFtfHZrfHNuYXBjaGF0I2knLCAkaykKICAgICAgICAgICAgIHx8ICggaXNfc3RyaW5nKCR2KSAmJiBwcmVnX21hdGNoKCcjaHR0cDovL3VybHx5b3VyQGVtYWlsI2knLCAkdikgKSApIHsKICAgICAgICAgICAgJHNvY1ska10gPSAkdjsKICAgICAgICB9CiAgICB9CiAgICBrc29ydCgkc29jKTsKICAgICRyWydzb2NpYWxfbW9kcyddID0gJHNvYzsKICAgICRyWyd0aGVtZSddID0gZ2V0X29wdGlvbignc3R5bGVzaGVldCcpIC4gJyAvIHBhcmVudDogJyAuIGdldF9vcHRpb24oJ3RlbXBsYXRlJyk7CgogICAgLy8ga3VyIG5hdWRvamFtaSBoZWFkZXIvZm9vdGVyIGVsZW1lbnRhaQogICAgJHJbJ2hlYWRlcl9lbGVtZW50cyddID0gZ2V0X3RoZW1lX21vZCgnaGVhZGVyX2VsZW1lbnRzJyk7CiAgICAkclsnZm9vdGVyX2VsZW1lbnRzJ10gPSBnZXRfdGhlbWVfbW9kKCdmb290ZXJfZWxlbWVudHMnKTsKICAgICRyWyd0b3RhbF9tb2RzJ10gPSBjb3VudCgoYXJyYXkpJG1vZHMpOwoKICAgIG5vY2FjaGVfaGVhZGVycygpOwogICAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAgIGVjaG8gd3BfanNvbl9lbmNvZGUoJHIsIEpTT05fVU5FU0NBUEVEX1NMQVNIRVN8SlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7CiAgICBleGl0Owp9LCAxKTsK','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP Flatsome Social Recon v1',code:php,scope:'global',active:true}));
for(let i=0;i<4&&!sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,200); sh('sleep 4');}
}
O.sid=sid;
if(sid){ sh('sleep 3');
  const g=sh('curl -sSk "'+SITE+'/?ps_soc=So4q"');
  try{O.data=JSON.parse(g.out);}catch(e){O.raw=g.out.slice(0,2500);}
  fs.writeFileSync('/tmp/de.json',JSON.stringify({active:false}));
  sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/de.json "'+API+'/'+sid+'"');
}
putB64('sc.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
