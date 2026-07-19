import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const U=process.env.WP_USER||'', P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
fs.writeFileSync('/tmp/wpu',U); fs.writeFileSync('/tmp/wpp',P);
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 for(let i=0;i<4;i++){ try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}?nocache=${Math.random()}"`).toString()); if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'neg',content:Buffer.from(JSON.stringify(o)).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync(`curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}"`).toString().trim();
  if(c==='200'||c==='201')return c;} return 'fail';}
const o={};
// login URL: -D headers, -o /dev/null body, NEsekam redirect (kad matytume Location)
const LOGIN='https://dev.avesa.lt/?ps_tlogin=TlogKw8Nx7z';
try{
  const hdr=execSync(`curl -skD - -o /dev/null -m 60 -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" "${LOGIN}"`,{maxBuffer:10*1024*1024}).toString();
  const status=(hdr.match(/HTTP\/[\d.]+\s+(\d+)/)||[])[1]||null;
  const loc=(hdr.match(/^location:\s*(.+)$/im)||[])[1]||null;
  const setcookies=(hdr.match(/^set-cookie:.*$/gim)||[]);
  const authcookie=setcookies.filter(c=>/wordpress_logged_in|wordpress_sec/i.test(c));
  o.login_status=status;
  o.redirect_location=loc;
  o.redirect_i_paskyra=(loc && /mano-paskyra|augintinis|account/i.test(loc))?true:false;
  o.auth_cookie_set=authcookie.length>0;
  o.set_cookie_count=setcookies.length;
  // NEGATYVUS PASS: nera redirect i paskyra IR nera auth cookie
  o.NEG_TEST_PASS=(!o.redirect_i_paskyra && !o.auth_cookie_set);
}catch(e){ o.err=String(e).slice(0,200); }
console.log('PUT:',pr('neg.json',o));
