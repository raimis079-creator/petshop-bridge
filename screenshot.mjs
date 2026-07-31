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
// pirma deaktyvuoti visus senus TEMP S318 Logic snippetus
try{
  const l=sh('curl -sSk '+AUTH+' "'+API+'?per_page=100"').out;
  const arr=JSON.parse(l);
  O.deactivated=[];
  for(const x of arr){
    if(/TEMP S318 Logic/i.test(x.name||'') && x.active){
      fs.writeFileSync('/tmp/d0.json',JSON.stringify({active:false}));
      sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/d0.json "'+API+'/'+x.id+'"');
      O.deactivated.push(x.id);
    }
  }
}catch(e){ O.deact_err=String(e).slice(0,150); }
const php=Buffer.from('PD9waHAKLyoqCiAqIFRFTVAgUzMxOCBMb2dpYyBUZXN0cyB2MQogKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICAgIGlmICggISBpc3NldCgkX0dFVFsncHNfcnQnXSkgfHwgJF9HRVRbJ3BzX3J0J10gIT09ICdSdDN2JyApIHJldHVybjsKICAgIGdsb2JhbCAkd3BkYjsgJHI9YXJyYXkoKTsKICAgICRUPVBldHNob3BfQ2FydF9UcmFja2VyOjp0YWJsZSgpOwoKICAgIC8vIDMgcHJla2VzOiBnZXJhLCAiaXN0cmludGEiLCAibmViZXR1cmltZSIKICAgICRpZHM9d2NfZ2V0X3Byb2R1Y3RzKGFycmF5KCdsaW1pdCc9PjMwLCdzdGF0dXMnPT4ncHVibGlzaCcsJ3JldHVybic9PidpZHMnKSk7CiAgICAkZ29vZD0wOyAkc2Vjb25kPTA7CiAgICBmb3JlYWNoKChhcnJheSkkaWRzIGFzICR4KXsgJHA9d2NfZ2V0X3Byb2R1Y3QoJHgpOwogICAgICBpZigkcCYmJHAtPmlzX3B1cmNoYXNhYmxlKCkmJiRwLT5pc19pbl9zdG9jaygpKXsgaWYoISRnb29kKXskZ29vZD0oaW50KSR4O30gZWxzZWlmKCEkc2Vjb25kKXskc2Vjb25kPShpbnQpJHg7IGJyZWFrO30gfSB9CiAgICAkclsncHJla2VzJ109YXJyYXkoJ2dlcmEnPT4kZ29vZCwnYW50cmEnPT4kc2Vjb25kKTsKCiAgICAkbWs9ZnVuY3Rpb24oJGNpZCwkaXRlbXMpIHVzZSAoJHdwZGIsJFQpewogICAgICAgICR3cGRiLT5xdWVyeSgkd3BkYi0+cHJlcGFyZSgiREVMRVRFIEZST00gJFQgV0hFUkUgY2FydF9pZD0lcyIsJGNpZCkpOwogICAgICAgICRub3c9Y3VycmVudF90aW1lKCdteXNxbCcsdHJ1ZSk7CiAgICAgICAgJHdwZGItPmluc2VydCgkVCxhcnJheSgnY2FydF9pZCc9PiRjaWQsJ2VtYWlsJz0+J3JlYy10ZXN0QGV4YW1wbGUuY29tJywnZW1haWxfc291cmNlJz0+J2NoZWNrb3V0JywKICAgICAgICAgICdsYXN0X2NhcnRfYWN0aXZpdHlfYXQnPT4kbm93LCdjYXJ0X2hhc2gnPT4naCcuc3Vic3RyKG1kNSgkY2lkKSwwLDgpLAogICAgICAgICAgJ3NuYXBzaG90X2pzb24nPT53cF9qc29uX2VuY29kZSgkaXRlbXMpLCdzbmFwc2hvdF92ZXJzaW9uJz0+MSwKICAgICAgICAgICdzdGF0dXMnPT4nYWJhbmRvbmVkJywnc3RhdHVzX2NoYW5nZWRfYXQnPT4kbm93LCdjcmVhdGVkX2F0Jz0+JG5vdywndXBkYXRlZF9hdCc9PiRub3cpKTsKICAgIH07CiAgICAkaXQ9ZnVuY3Rpb24oJHBpZCwkcXR5LCR2aWQ9MCwkdmFyPWFycmF5KCkpeyByZXR1cm4gYXJyYXkoJ3Byb2R1Y3RfaWQnPT4kcGlkLCd2YXJpYXRpb25faWQnPT4kdmlkLAogICAgICAgICdxdWFudGl0eSc9PiRxdHksJ3ZhcmlhdGlvbic9PiR2YXIsJ2l0ZW1fZGF0YSc9PmFycmF5KCkpOyB9OwoKICAgIC8vID09PSBBOiB2aXNrYXMgZ2VyYWkgPT09CiAgICAkQT0nY19yZWNfQSc7ICRtaygkQSxhcnJheSgkaXQoJGdvb2QsMiksJGl0KCRzZWNvbmQsMSkpKTsKICAgICRldkE9UGV0c2hvcF9DYXJ0X1JlY292ZXJ5OjpldmFsdWF0ZSgkQSk7CiAgICAkclsnQV92aXNrYXNfZ2VyYWknXT1hcnJheSgnb2snPT5jb3VudCgkZXZBWydvayddKSwnc2tpcHBlZCc9PmNvdW50KCRldkFbJ3NraXBwZWQnXSksCiAgICAgICdpdGVtcyc9PmFycmF5X21hcChmdW5jdGlvbigkeCl7cmV0dXJuIGFycmF5KCduJz0+bWJfc3Vic3RyKCR4WyduYW1lJ10sMCwyNiksJ3EnPT4keFsncXR5J10sJ2thaW5hJz0+JHhbJ3ByaWNlJ10sJ3JpYm90YSc9PiR4WydsaW1pdGVkJ10pO30sJGV2QVsnb2snXSkpOwoKICAgIC8vID09PSBCOiB2aWVuYSBwcmVrZSBORUJFRUdaSVNUVU9KQSA9PT0KICAgICRCPSdjX3JlY19CJzsgJG1rKCRCLGFycmF5KCRpdCgkZ29vZCwxKSwkaXQoOTk5OTk5OTksMSkpKTsKICAgICRldkI9UGV0c2hvcF9DYXJ0X1JlY292ZXJ5OjpldmFsdWF0ZSgkQik7CiAgICAkclsnQl9kaW5ndXNpX3ByZWtlJ109YXJyYXkoJ29rJz0+Y291bnQoJGV2Qlsnb2snXSksJ3NraXBwZWQnPT4kZXZCWydza2lwcGVkJ10pOwoKICAgIC8vID09PSBDOiBwcmVrZSBpIGRyYWZ0ID09PQogICAgJEM9J2NfcmVjX0MnOyAkbWsoJEMsYXJyYXkoJGl0KCRzZWNvbmQsMSkpKTsKICAgICRvbGRfc3Q9Z2V0X3Bvc3Rfc3RhdHVzKCRzZWNvbmQpOwogICAgd3BfdXBkYXRlX3Bvc3QoYXJyYXkoJ0lEJz0+JHNlY29uZCwncG9zdF9zdGF0dXMnPT4nZHJhZnQnKSk7CiAgICAkZXZDPVBldHNob3BfQ2FydF9SZWNvdmVyeTo6ZXZhbHVhdGUoJEMpOwogICAgJHJbJ0NfZHJhZnQnXT1hcnJheSgnb2snPT5jb3VudCgkZXZDWydvayddKSwnc2tpcHBlZCc9PiRldkNbJ3NraXBwZWQnXSk7CiAgICB3cF91cGRhdGVfcG9zdChhcnJheSgnSUQnPT4kc2Vjb25kLCdwb3N0X3N0YXR1cyc9PiRvbGRfc3QpKTsKICAgICRyWydDX2F0c3RhdHl0YSddPWdldF9wb3N0X3N0YXR1cygkc2Vjb25kKTsKCiAgICAvLyA9PT0gRDogbGlrdXRpcyBtYXplc25pcyA9PT0KICAgICREPSdjX3JlY19EJzsKICAgICRwPXdjX2dldF9wcm9kdWN0KCRnb29kKTsKICAgICRoYWRfbWFuYWdlPSRwLT5nZXRfbWFuYWdlX3N0b2NrKCk7ICRoYWRfcXR5PSRwLT5nZXRfc3RvY2tfcXVhbnRpdHkoKTsKICAgICRwLT5zZXRfbWFuYWdlX3N0b2NrKHRydWUpOyAkcC0+c2V0X3N0b2NrX3F1YW50aXR5KDEpOyAkcC0+c2F2ZSgpOwogICAgJG1rKCRELGFycmF5KCRpdCgkZ29vZCw1KSkpOwogICAgJGV2RD1QZXRzaG9wX0NhcnRfUmVjb3Zlcnk6OmV2YWx1YXRlKCREKTsKICAgICRyWydEX2xpa3V0aXMnXT1hcnJheSgnb2snPT5jb3VudCgkZXZEWydvayddKSwKICAgICAgJ3F0eV9ub3Jlam8nPT4kZXZEWydvayddPyRldkRbJ29rJ11bMF1bJ3F0eV93YW50ZWQnXTpudWxsLAogICAgICAncXR5X2dhdXMnPT4kZXZEWydvayddPyRldkRbJ29rJ11bMF1bJ3F0eSddOm51bGwsCiAgICAgICdyaWJvdGEnPT4kZXZEWydvayddPyRldkRbJ29rJ11bMF1bJ2xpbWl0ZWQnXTpudWxsKTsKICAgIC8vIDAgbGlrdXRpcwogICAgJHA9d2NfZ2V0X3Byb2R1Y3QoJGdvb2QpOyAkcC0+c2V0X3N0b2NrX3F1YW50aXR5KDApOyAkcC0+c2F2ZSgpOwogICAgJGV2RDA9UGV0c2hvcF9DYXJ0X1JlY292ZXJ5OjpldmFsdWF0ZSgkRCk7CiAgICAkclsnRF9udWxpcyddPWFycmF5KCdvayc9PmNvdW50KCRldkQwWydvayddKSwnc2tpcHBlZCc9PiRldkQwWydza2lwcGVkJ10pOwogICAgLy8gYXRzdGF0b20KICAgICRwPXdjX2dldF9wcm9kdWN0KCRnb29kKTsgJHAtPnNldF9tYW5hZ2Vfc3RvY2soJGhhZF9tYW5hZ2UpOyAkcC0+c2V0X3N0b2NrX3F1YW50aXR5KCRoYWRfcXR5KTsgJHAtPnNhdmUoKTsKICAgICRwcD13Y19nZXRfcHJvZHVjdCgkZ29vZCk7CiAgICAkclsnRF9hdHN0YXR5dGEnXT1hcnJheSgnbWFuYWdlJz0+JHBwLT5nZXRfbWFuYWdlX3N0b2NrKCk/MTowLCdxdHknPT4kcHAtPmdldF9zdG9ja19xdWFudGl0eSgpLCdpbl9zdG9jayc9PiRwcC0+aXNfaW5fc3RvY2soKT8xOjApOwoKICAgIC8vID09PSBFOiBWSVNPUyBwcmVrZXMgZGluZ3VzaW9zID09PQogICAgJEU9J2NfcmVjX0UnOyAkbWsoJEUsYXJyYXkoJGl0KDk5OTk5OTk4LDEpLCRpdCg5OTk5OTk5NywyKSkpOwogICAgJGV2RT1QZXRzaG9wX0NhcnRfUmVjb3Zlcnk6OmV2YWx1YXRlKCRFKTsKICAgICRyWydFX3Zpc29zX2Rpbmd1c2lvcyddPWFycmF5KCdvayc9PmNvdW50KCRldkVbJ29rJ10pLCdza2lwcGVkJz0+Y291bnQoJGV2RVsnc2tpcHBlZCddKSk7CgogICAgLy8gPT09IEY6IG51b3JvZG9zIGdlbmVyYXZpbWFzID09PQogICAgJGxpbms9UGV0c2hvcF9DYXJ0X1JlY292ZXJ5OjpsaW5rKCRBKTsKICAgICRyWydGX251b3JvZGEnXT1hcnJheSgneXJhJz0+JGxpbms/MTowLCd0dXJpX2NhcnRfaWQnPT4oc3RycG9zKCRsaW5rLCRBKSE9PWZhbHNlKT8nVEFJUF9CTE9HQUknOidORV9HRVJBSScsCiAgICAgICdpbGdpcyc9PnN0cmxlbigkbGluaykpOwogICAgcGFyc2Vfc3RyKHBhcnNlX3VybCgkbGluayxQSFBfVVJMX1FVRVJZKSwkcSk7CiAgICAkdG9rPWlzc2V0KCRxWyd0J10pPyRxWyd0J106Jyc7CiAgICAkcGs9UGV0c2hvcF9BY3Rpb25fVG9rZW5zOjpwZWVrKCR0b2spOwogICAgJHJbJ0ZfcGVlayddPWFycmF5KCd2YWxpZCc9PiRwa1sndmFsaWQnXT8/bnVsbCwKICAgICAgJ3Jlc291cmNlX2lkJz0+aXNfYXJyYXkoJHBrWydyb3cnXT8/bnVsbCk/KCRwa1sncm93J11bJ3Jlc291cmNlX2lkJ10/P251bGwpOihpc19vYmplY3QoJHBrWydyb3cnXT8/bnVsbCk/JHBrWydyb3cnXS0+cmVzb3VyY2VfaWQ6bnVsbCkpOwoKICAgIC8vIHZhbG9tCiAgICBmb3JlYWNoKGFycmF5KCRBLCRCLCRDLCRELCRFKSBhcyAkeCkgJHdwZGItPnF1ZXJ5KCR3cGRiLT5wcmVwYXJlKCJERUxFVEUgRlJPTSAkVCBXSEVSRSBjYXJ0X2lkPSVzIiwkeCkpOwogICAgbm9jYWNoZV9oZWFkZXJzKCk7IGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgICBlY2hvIHdwX2pzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1NMQVNIRVN8SlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0sIDEpOwo=','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP S318 Logic Dump v1',code:php,scope:'global',active:true}));
for(let i=0;i<4&&!sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(sid){
  sh('sleep 4');
  const d=sh('curl -sSk "'+SITE+'/?ps_rt=Rt3v"');
  try{O.dry=JSON.parse(d.out);}catch(e){O.dry_raw=d.out.slice(0,500);}
  const a=sh('curl -sSk "'+SITE+'/?ps_rt=Rt3v"');
  try{O.apply=JSON.parse(a.out);}catch(e){O.apply_raw=a.out.slice(0,500);}
  fs.writeFileSync('/tmp/de.json',JSON.stringify({active:false}));
  sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/de.json "'+API+'/'+sid+'"');
  // sanity: ar svetaine gyva po deploy
  sh('sleep 3');
  O.site_code=sh('curl -sSk -o /dev/null -w "%{http_code}" "'+SITE+'/"').out.trim();
  O.account_code=sh('curl -sSk -o /dev/null -w "%{http_code}" "'+SITE+'/my-account/"').out.trim();
}
putB64('rtest.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
