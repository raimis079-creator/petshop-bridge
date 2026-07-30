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
// pirma deaktyvuoti visus senus TEMP S316 Cleanup snippetus
try{
  const l=sh('curl -sSk '+AUTH+' "'+API+'?per_page=100"').out;
  const arr=JSON.parse(l);
  O.deactivated=[];
  for(const x of arr){
    if(/TEMP S316 Cleanup/i.test(x.name||'') && x.active){
      fs.writeFileSync('/tmp/d0.json',JSON.stringify({active:false}));
      sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/d0.json "'+API+'/'+x.id+'"');
      O.deactivated.push(x.id);
    }
  }
}catch(e){ O.deact_err=String(e).slice(0,150); }
const php=Buffer.from('PD9waHAKLyoqCiAqIFRFTVAgQ2FydCBQZXJzaXN0ZW5jZSBDaGVjayB2MQogKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICAgIGlmICggISBpc3NldCgkX0dFVFsncHNfcGMnXSkgfHwgJF9HRVRbJ3BzX3BjJ10gIT09ICdQYzJzJyApIHJldHVybjsKICAgIGdsb2JhbCAkd3BkYjsgJFQ9JHdwZGItPnByZWZpeC4ncHNfY2FydHMnOyAkcj1hcnJheSgpOwogICAgJHJbJ3Jvd3Nfbm93J109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gJFQiKTsKICAgICRyWydhdXRvX2luY3JlbWVudCddPSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQVVUT19JTkNSRU1FTlQgRlJPTSBpbmZvcm1hdGlvbl9zY2hlbWEuVEFCTEVTIFdIRVJFIFRBQkxFX1NDSEVNQT1EQVRBQkFTRSgpIEFORCBUQUJMRV9OQU1FPSd7JHdwZGItPnByZWZpeH1wc19jYXJ0cyciKTsKICAgIC8vIGFyIGthcyBub3JzIFRSSU5BOiBpZXNrb20gREVMRVRFIEZST00gcHNfY2FydHMga29kZQogICAgJGhpdHM9YXJyYXkoKTsKICAgIGZvcmVhY2ggKGFycmF5KFdQX1BMVUdJTl9ESVIsIGdldF9zdHlsZXNoZWV0X2RpcmVjdG9yeSgpLCBXUE1VX1BMVUdJTl9ESVIpIGFzICRkaXIpIHsKICAgICAgICBpZighaXNfZGlyKCRkaXIpKSBjb250aW51ZTsKICAgICAgICAkcmlpPW5ldyBSZWN1cnNpdmVJdGVyYXRvckl0ZXJhdG9yKG5ldyBSZWN1cnNpdmVEaXJlY3RvcnlJdGVyYXRvcigkZGlyLCBGaWxlc3lzdGVtSXRlcmF0b3I6OlNLSVBfRE9UUykpOwogICAgICAgIGZvcmVhY2ggKCRyaWkgYXMgJGYpIHsgaWYoISRmLT5pc0ZpbGUoKXx8c3Vic3RyKCRmLT5nZXRGaWxlbmFtZSgpLC00KSE9PScucGhwJyljb250aW51ZTsKICAgICAgICAgICAgJGM9QGZpbGVfZ2V0X2NvbnRlbnRzKCRmLT5nZXRQYXRobmFtZSgpKTsgaWYoISRjKWNvbnRpbnVlOwogICAgICAgICAgICBpZiAocHJlZ19tYXRjaCgnI3BzX2NhcnRzIycsJGMpICYmIHByZWdfbWF0Y2goJyNERUxFVEV8VFJVTkNBVEV8RFJPUCNpJywkYykpCiAgICAgICAgICAgICAgICAkaGl0c1tdPXN0cl9yZXBsYWNlKEFCU1BBVEgsJycsJGYtPmdldFBhdGhuYW1lKCkpOyB9CiAgICB9CiAgICAkclsnZmlsZXNfd2l0aF9kZWxldGUnXT1hcnJheV92YWx1ZXMoYXJyYXlfdW5pcXVlKCRoaXRzKSk7CiAgICAvLyBha3R5dnVzIHNuaXBwZXRhaSBzdSBwc19jYXJ0cwogICAgJHN0PSR3cGRiLT5wcmVmaXguJ3NuaXBwZXRzJzsKICAgICRyWydzbmlwcGV0c19wc19jYXJ0cyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLG5hbWUsYWN0aXZlIEZST00gJHN0IFdIRVJFIGNvZGUgTElLRSAnJXBzX2NhcnRzJSciLCBBUlJBWV9BKTsKICAgIC8vIFRFU1RBUzogaXJhc29tIGVpbHV0ZSBpciB0aWtyaW5hbSBhciBpc2xpZWthCiAgICAkd3BkYi0+aW5zZXJ0KCRULCBhcnJheSgnY2FydF9pZCc9PidjX3BlcnNpc3RfdGVzdCcsJ2xhc3RfY2FydF9hY3Rpdml0eV9hdCc9PmN1cnJlbnRfdGltZSgnbXlzcWwnLHRydWUpLAogICAgICAnY2FydF9oYXNoJz0+J3Rlc3RoYXNoJywnc25hcHNob3RfanNvbic9PndwX2pzb25fZW5jb2RlKGFycmF5KGFycmF5KCdwcm9kdWN0X2lkJz0+MSwndmFyaWF0aW9uX2lkJz0+MCwncXVhbnRpdHknPT4xLCd2YXJpYXRpb24nPT5hcnJheSgpLCdpdGVtX2RhdGEnPT5hcnJheSgpKSkpLAogICAgICAnc3RhdHVzJz0+J2FjdGl2ZScsJ2NyZWF0ZWRfYXQnPT5jdXJyZW50X3RpbWUoJ215c3FsJyx0cnVlKSwndXBkYXRlZF9hdCc9PmN1cnJlbnRfdGltZSgnbXlzcWwnLHRydWUpKSk7CiAgICAkclsnaW5zZXJ0ZWQnXT0kd3BkYi0+aW5zZXJ0X2lkPzE6MDsKICAgICRyWydyZWFkX2JhY2snXT0kd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIGNhcnRfaWQgRlJPTSAkVCBXSEVSRSBjYXJ0X2lkPSVzIiwnY19wZXJzaXN0X3Rlc3QnKSk7CiAgICBub2NhY2hlX2hlYWRlcnMoKTsgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAgIGVjaG8gd3BfanNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfU0xBU0hFU3xKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSwgMSk7Cg==','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP S316 Cleanup Dump v1',code:php,scope:'global',active:true}));
for(let i=0;i<4&&!sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(sid){
  sh('sleep 4');
  const d=sh('curl -sSk "'+SITE+'/?ps_pc=Pc2s"');
  try{O.dry=JSON.parse(d.out);}catch(e){O.dry_raw=d.out.slice(0,500);}
  const a=sh('curl -sSk "'+SITE+'/?ps_pc=Pc2s"');
  try{O.apply=JSON.parse(a.out);}catch(e){O.apply_raw=a.out.slice(0,500);}
  fs.writeFileSync('/tmp/de.json',JSON.stringify({active:false}));
  sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/de.json "'+API+'/'+sid+'"');
  // sanity: ar svetaine gyva po deploy
  sh('sleep 3');
  O.site_code=sh('curl -sSk -o /dev/null -w "%{http_code}" "'+SITE+'/"').out.trim();
  O.account_code=sh('curl -sSk -o /dev/null -w "%{http_code}" "'+SITE+'/my-account/"').out.trim();
}
putB64('chk.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
