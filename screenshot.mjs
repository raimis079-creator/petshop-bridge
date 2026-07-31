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
 const m=o.match(/__RC:(\d+)\s*$/);return{rc:m?+m[1]:-1,out:o.replace(/__RC:\d+\s*$/,'')};}catch(e){return{rc:-99,out:''};}}
const O={}; const AUTH='-u "'+WU+':'+WP+'"', API=SITE+'/wp-json/code-snippets/v1/snippets';

const php = Buffer.from(`<?php
add_action('wp_loaded', function(){
  if ( ! isset($_GET['ps_qv']) ) return;
  $k=$_GET['ps_qv']; global $wpdb; $T=Petshop_Cart_Tracker::table(); $CID='c_qv_test';

  if ($k==='deploy') {
    $p=WP_PLUGIN_DIR.'/petshop-core/includes/class-cart-recovery.php';
    $new=base64_decode('PD9waHAKLyoqCiAqIFBldHNob3AgQ2FydCBSZWNvdmVyeSDigJQgUzMxOC4KICoKICogU2F1Z3VzIGtyZXBzZWxpbyBhdGt1cmltYXMgaXMgYXBsZWlzdG8ga3JlcHNlbGlvIGxhaXNrby4KICoKICogU0NBTk5FUi1TQUZFIChhcmNoaXRla3R1cmFfdjIgwqcyKToKICogICBHRVQgIC9hdGt1cnRpLWtyZXBzZWxpLz90PXt0b2tlbn0gIC0+IHBlZWsgICAgLT4gUEFUVklSVElOSU1PIHB1c2xhcGlzIChOSUVLTyBuZWF0a3VyaWEpCiAqICAgUE9TVCB0dW8gcGFjaXUgVVJMICAgICAgICAgICAgICAgICAtPiBjb25zdW1lIC0+IGF0a3VyaWEgKyBudWtyZWlwaWEgaSBrcmVwc2VsaQogKgogKiBBVEtVUklNTyBUQUlTWUtMRVM6CiAqICAgLSB0aWsgQUtUWVZJT1MgaXIgcmVhbGlhaSBwZXJrYW1vcyBwcmVrZXMgKGBpc19wdXJjaGFzYWJsZSgpYCArIGBpc19pbl9zdG9jaygpYCkKICogICAtIGthaW5vcyBEQUJBUlRJTkVTIChzbmFwc2hvdCdlIGp1IE5FU0FVR09KQU0gc2Ftb25pbmdhaSkKICogICAtIGtpZWtpYWkgcmlib2phbWkgcGFnYWwgUkVBTFUgbGlrdXRpCiAqICAgLSB2YXJpYWNpam9zIGF0a3VyaWFtb3MgdGlrIGplaSB2aXMgZGFyIGdhbGlvamEKICogICAtIGJlbnQgdmllbmEgYXRrdXJ0YSAtPiBudWtyZWlwaW1hcyBpIGtyZXBzZWxpCiAqICAgLSBuZSB2aWVuYSAtPiBBSVNLVVMgcHJhbmVzaW1hcywgTkUgdHVzY2lhcyBrcmVwc2VsaXMKICogICAtIHRva2VuYXMgdmllbmthcnRpbmlzIC0+IHBha2FydG90aW5pcyBuYXVkb2ppbWFzIHByZWtpdSBORURVQkxJVU9KQQogKgogKiBAcGFja2FnZSBwZXRzaG9wLWNvcmUKICogQHNpbmNlIDAuMjIuMCAoUzMxOCwgMjAyNi0wNy0zMSkKICovCgppZiAoICEgZGVmaW5lZCggJ0FCU1BBVEgnICkgKSB7IGV4aXQ7IH0KCmNsYXNzIFBldHNob3BfQ2FydF9SZWNvdmVyeSB7CgoJY29uc3QgUFVSUE9TRSAgPSAnY2FydF9yZWNvdmVyeSc7Cgljb25zdCBRVUVSWSAgICA9ICdwc19jYXJ0cmVjJzsKCS8qKiBOdW9yb2RvcyBnYWxpb2ppbWFzLiBORSBkZXRla3RvcmlhdXMgNyBkLiBsYW5nYXMg4oCUIGF0c2tpcmFzIGRhbHlrYXMuICovCgljb25zdCBUVExfREFZUyA9IDc7CgoJcHVibGljIHN0YXRpYyBmdW5jdGlvbiBpbml0KCkgewoJCWFkZF9hY3Rpb24oICdpbml0JywgYXJyYXkoIF9fQ0xBU1NfXywgJ2FkZF9yZXdyaXRlJyApICk7CgkJYWRkX2FjdGlvbiggJ3RlbXBsYXRlX3JlZGlyZWN0JywgYXJyYXkoIF9fQ0xBU1NfXywgJ2hhbmRsZScgKSApOwoJfQoKCXB1YmxpYyBzdGF0aWMgZnVuY3Rpb24gYWRkX3Jld3JpdGUoKSB7CgkJYWRkX3Jld3JpdGVfcnVsZSggJ15hdGt1cnRpLWtyZXBzZWxpLz8kJywgJ2luZGV4LnBocD8nIC4gc2VsZjo6UVVFUlkgLiAnPTEnLCAndG9wJyApOwoJCWFkZF9yZXdyaXRlX3RhZyggJyUnIC4gc2VsZjo6UVVFUlkgLiAnJScsICcoW14mXSspJyApOwoJfQoKCS8qKgoJICogQXRrdXJpbW8gbnVvcm9kYS4gVG9rZW5lIOKAlCBUSUsgY2FydF9pZCwgam9raW8gUElJLgoJICovCglwdWJsaWMgc3RhdGljIGZ1bmN0aW9uIGxpbmsoICRjYXJ0X2lkICkgewoJCSRjYXJ0X2lkID0gdHJpbSggKHN0cmluZykgJGNhcnRfaWQgKTsKCQlpZiAoICcnID09PSAkY2FydF9pZCB8fCAhIGNsYXNzX2V4aXN0cyggJ1BldHNob3BfQWN0aW9uX1Rva2VucycgKSApIHsgcmV0dXJuICcnOyB9CgkJJHRva2VuID0gUGV0c2hvcF9BY3Rpb25fVG9rZW5zOjpnZW5lcmF0ZSggYXJyYXkoCgkJCSdwdXJwb3NlJyAgICAgPT4gc2VsZjo6UFVSUE9TRSwKCQkJJ3Jlc291cmNlX2lkJyA9PiAkY2FydF9pZCwKCQkJJ3R0bF9zZWNvbmRzJyA9PiBzZWxmOjpUVExfREFZUyAqIERBWV9JTl9TRUNPTkRTLAoJCSkgKTsKCQlpZiAoICEgaXNfc3RyaW5nKCAkdG9rZW4gKSB8fCAnJyA9PT0gJHRva2VuICkgeyByZXR1cm4gJyc7IH0KCQlyZXR1cm4gYWRkX3F1ZXJ5X2FyZyggJ3QnLCByYXd1cmxlbmNvZGUoICR0b2tlbiApLCBob21lX3VybCggJy9hdGt1cnRpLWtyZXBzZWxpLycgKSApOwoJfQoKCS8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqLwoJLyogU25hcHNob3QgLT4gYXRrdXJpYW1vcyBwcmVrZXMgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICovCgkvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi8KCgkvKioKCSAqIEl2ZXJ0aW5hLCBrYXMgaXMgc25hcHNob3QnbyBSRUFMSUFJIGF0a3VyaWFtYSBTSUFORElFTi4KCSAqCgkgKiBAcmV0dXJuIGFycmF5IG9rW10sIHNraXBwZWRbXQoJICovCglwdWJsaWMgc3RhdGljIGZ1bmN0aW9uIGV2YWx1YXRlKCAkY2FydF9pZCApIHsKCQkkb3V0ID0gYXJyYXkoICdvaycgPT4gYXJyYXkoKSwgJ3NraXBwZWQnID0+IGFycmF5KCkgKTsKCQlpZiAoICEgY2xhc3NfZXhpc3RzKCAnUGV0c2hvcF9DYXJ0X1RyYWNrZXInICkgKSB7IHJldHVybiAkb3V0OyB9CgkJJHJvdyA9IFBldHNob3BfQ2FydF9UcmFja2VyOjpnZXRfcm93KCAkY2FydF9pZCApOwoJCWlmICggISAkcm93ICkgeyByZXR1cm4gJG91dDsgfQoKCQkkaXRlbXMgPSBqc29uX2RlY29kZSggKHN0cmluZykgJHJvd1snc25hcHNob3RfanNvbiddLCB0cnVlICk7CgkJaWYgKCAhIGlzX2FycmF5KCAkaXRlbXMgKSApIHsgcmV0dXJuICRvdXQ7IH0KCgkJZm9yZWFjaCAoICRpdGVtcyBhcyAkaXQgKSB7CgkJCSRwaWQgID0gaXNzZXQoICRpdFsncHJvZHVjdF9pZCddICkgPyAoaW50KSAkaXRbJ3Byb2R1Y3RfaWQnXSA6IDA7CgkJCSR2aWQgID0gaXNzZXQoICRpdFsndmFyaWF0aW9uX2lkJ10gKSA/IChpbnQpICRpdFsndmFyaWF0aW9uX2lkJ10gOiAwOwoJCQkkcXR5ICA9IGlzc2V0KCAkaXRbJ3F1YW50aXR5J10gKSA/IChmbG9hdCkgJGl0WydxdWFudGl0eSddIDogMDsKCQkJJHZhciAgPSBpc3NldCggJGl0Wyd2YXJpYXRpb24nXSApICYmIGlzX2FycmF5KCAkaXRbJ3ZhcmlhdGlvbiddICkgPyAkaXRbJ3ZhcmlhdGlvbiddIDogYXJyYXkoKTsKCQkJJHVzZSAgPSAkdmlkID8gJHZpZCA6ICRwaWQ7CgoJCQlpZiAoICEgJHVzZSB8fCAkcXR5IDw9IDAgKSB7CgkJCQkkb3V0Wydza2lwcGVkJ11bXSA9IGFycmF5KCAnaWQnID0+ICR1c2UsICduYW1lJyA9PiAnJywgJ3JlYXNvbicgPT4gJ2ludmFsaWQnICk7CgkJCQljb250aW51ZTsKCQkJfQoKCQkJJHAgPSB3Y19nZXRfcHJvZHVjdCggJHVzZSApOwoJCQlpZiAoICEgJHAgKSB7CgkJCQkkb3V0Wydza2lwcGVkJ11bXSA9IGFycmF5KCAnaWQnID0+ICR1c2UsICduYW1lJyA9PiAnJywgJ3JlYXNvbicgPT4gJ25lYmVlZ3ppc3R1b2phJyApOwoJCQkJY29udGludWU7CgkJCX0KCQkJJG5hbWUgPSAkcC0+Z2V0X25hbWUoKTsKCgkJCS8vIGJhemluaXMgcHJvZHVrdGFzIHR1cmkgYnV0aSBwdWJsaXNoCgkJCWlmICggJHBpZCAmJiAncHVibGlzaCcgIT09IGdldF9wb3N0X3N0YXR1cyggJHBpZCApICkgewoJCQkJJG91dFsnc2tpcHBlZCddW10gPSBhcnJheSggJ2lkJyA9PiAkdXNlLCAnbmFtZScgPT4gJG5hbWUsICdyZWFzb24nID0+ICduZWJlcGFyZHVvZGFtYScgKTsKCQkJCWNvbnRpbnVlOwoJCQl9CgkJCWlmICggISAkcC0+aXNfcHVyY2hhc2FibGUoKSApIHsKCQkJCSRvdXRbJ3NraXBwZWQnXVtdID0gYXJyYXkoICdpZCcgPT4gJHVzZSwgJ25hbWUnID0+ICRuYW1lLCAncmVhc29uJyA9PiAnbmViZXBhcmR1b2RhbWEnICk7CgkJCQljb250aW51ZTsKCQkJfQoJCQlpZiAoICEgJHAtPmlzX2luX3N0b2NrKCkgKSB7CgkJCQkkb3V0Wydza2lwcGVkJ11bXSA9IGFycmF5KCAnaWQnID0+ICR1c2UsICduYW1lJyA9PiAkbmFtZSwgJ3JlYXNvbicgPT4gJ25lYmV0dXJpbWUnICk7CgkJCQljb250aW51ZTsKCQkJfQoKCQkJLy8gLS0tIFZBUklBQ0lKT1MgcGF0aWtyYSAoUzMxOGIpIC0tLQoJCQkvLyDigJ5wYXJlbnQgcHVibGlzaCIgTkVQQUtBTktBOiB2YXJpYWNpamEgZ2FsaSBlZ3ppc3R1b3RpLCBiZXQgcHJpa2xhdXN5dGkKCQkJLy8gS0lUQU0gcHJvZHVrdHVpIGFyYmEgdHVyZXRpIHBhc2lrZWl0dXNpdXMgYXRyaWJ1dHVzLgoJCQlpZiAoICR2aWQgKSB7CgkJCQkvLyAoYSkgYXIgdGFpIHRpa3JhaSB2YXJpYWNpamEKCQkJCWlmICggISAkcC0+aXNfdHlwZSggJ3ZhcmlhdGlvbicgKSApIHsKCQkJCQkkb3V0Wydza2lwcGVkJ11bXSA9IGFycmF5KCAnaWQnID0+ICR1c2UsICduYW1lJyA9PiAkbmFtZSwgJ3JlYXNvbicgPT4gJ3ZhcmlhY2lqYV9uZWdhbGlvamEnICk7CgkJCQkJY29udGludWU7CgkJCQl9CgkJCQkvLyAoYikgYXIgcHJpa2xhdXNvIFRBTSBQQUNJQU0gcGFyZW50J3VpCgkJCQkkcGFyZW50ID0gKGludCkgJHAtPmdldF9wYXJlbnRfaWQoKTsKCQkJCWlmICggISAkcGFyZW50IHx8ICggJHBpZCAmJiAkcGFyZW50ICE9PSAkcGlkICkgKSB7CgkJCQkJJG91dFsnc2tpcHBlZCddW10gPSBhcnJheSggJ2lkJyA9PiAkdXNlLCAnbmFtZScgPT4gJG5hbWUsICdyZWFzb24nID0+ICd2YXJpYWNpamFfa2l0YW1fcHJvZHVrdHVpJyApOwoJCQkJCWNvbnRpbnVlOwoJCQkJfQoJCQkJLy8gKGMpIHBhcmVudCB0dXJpIGJ1dGkgcHVibGlzaAoJCQkJaWYgKCAncHVibGlzaCcgIT09IGdldF9wb3N0X3N0YXR1cyggJHBhcmVudCApICkgewoJCQkJCSRvdXRbJ3NraXBwZWQnXVtdID0gYXJyYXkoICdpZCcgPT4gJHVzZSwgJ25hbWUnID0+ICRuYW1lLCAncmVhc29uJyA9PiAnbmViZXBhcmR1b2RhbWEnICk7CgkJCQkJY29udGludWU7CgkJCQl9CgkJCQkvLyAoZCkgYXRyaWJ1dGFpIHR1cmkgVEVCRUdBTElPVEkKCQkJCSRjdXIgPSAkcC0+Z2V0X3ZhcmlhdGlvbl9hdHRyaWJ1dGVzKCk7CgkJCQlmb3JlYWNoICggKGFycmF5KSAkdmFyIGFzICRhayA9PiAkYXYgKSB7CgkJCQkJaWYgKCAnJyA9PT0gJGF2ICkgeyBjb250aW51ZTsgfSAgICAgICAgICAgICAgIC8vIOKAnmJldCBrb2tzIiDigJQgcHJhbGVpZHppYW0KCQkJCQlpZiAoICEgYXJyYXlfa2V5X2V4aXN0cyggJGFrLCAoYXJyYXkpICRjdXIgKSApIHsKCQkJCQkJJG91dFsnc2tpcHBlZCddW10gPSBhcnJheSggJ2lkJyA9PiAkdXNlLCAnbmFtZScgPT4gJG5hbWUsICdyZWFzb24nID0+ICdhdHJpYnV0YXNfZGluZ28nICk7CgkJCQkJCWNvbnRpbnVlIDI7CgkJCQkJfQoJCQkJCSRub3dfdiA9ICRjdXJbICRhayBdOwoJCQkJCS8vIHR1c2NpYSB2YXJpYWNpam9zIHJlaWtzbWUgcmVpc2tpYSDigJ5iZXQga29rcyIg4oCUIHRpbmthCgkJCQkJaWYgKCAnJyAhPT0gJG5vd192ICYmIChzdHJpbmcpICRub3dfdiAhPT0gKHN0cmluZykgJGF2ICkgewoJCQkJCQkkb3V0Wydza2lwcGVkJ11bXSA9IGFycmF5KCAnaWQnID0+ICR1c2UsICduYW1lJyA9PiAkbmFtZSwgJ3JlYXNvbicgPT4gJ2F0cmlidXRhc19wYXNpa2VpdGUnICk7CgkJCQkJCWNvbnRpbnVlIDI7CgkJCQkJfQoJCQkJfQoJCQl9CgoJCQkvLyBraWVraXMgcmlib2phbWFzIHBhZ2FsIFJFQUxVIGxpa3V0aQoJCQkkZmluYWwgPSAkcXR5OwoJCQkkbGltaXRlZCA9IGZhbHNlOwoJCQlpZiAoICRwLT5tYW5hZ2luZ19zdG9jaygpICkgewoJCQkJJHN0b2NrID0gJHAtPmdldF9zdG9ja19xdWFudGl0eSgpOwoJCQkJaWYgKCBudWxsICE9PSAkc3RvY2sgJiYgJHN0b2NrIDwgJHF0eSApIHsKCQkJCQlpZiAoICRzdG9jayA8PSAwICkgewoJCQkJCQkkb3V0Wydza2lwcGVkJ11bXSA9IGFycmF5KCAnaWQnID0+ICR1c2UsICduYW1lJyA9PiAkbmFtZSwgJ3JlYXNvbicgPT4gJ25lYmV0dXJpbWUnICk7CgkJCQkJCWNvbnRpbnVlOwoJCQkJCX0KCQkJCQkkZmluYWwgPSAkc3RvY2s7ICRsaW1pdGVkID0gdHJ1ZTsKCQkJCX0KCQkJfQoKCQkJJG91dFsnb2snXVtdID0gYXJyYXkoCgkJCQkncHJvZHVjdF9pZCcgICA9PiAkcGlkLAoJCQkJJ3ZhcmlhdGlvbl9pZCcgPT4gJHZpZCwKCQkJCSd2YXJpYXRpb24nICAgID0+ICR2YXIsCgkJCQkncXR5JyAgICAgICAgICA9PiAkZmluYWwsCgkJCQkncXR5X3dhbnRlZCcgICA9PiAkcXR5LAoJCQkJJ2xpbWl0ZWQnICAgICAgPT4gJGxpbWl0ZWQsCgkJCQknbmFtZScgICAgICAgICA9PiAkbmFtZSwKCQkJCSdwcmljZScgICAgICAgID0+IChmbG9hdCkgd2NfZ2V0X3ByaWNlX3RvX2Rpc3BsYXkoICRwICksCgkJCSk7CgkJfQoJCXJldHVybiAkb3V0OwoJfQoKCS8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqLwoJLyogTWFyc3J1dGFzICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICovCgkvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi8KCglwdWJsaWMgc3RhdGljIGZ1bmN0aW9uIGhhbmRsZSgpIHsKCQlpZiAoICEgZ2V0X3F1ZXJ5X3Zhciggc2VsZjo6UVVFUlkgKSApIHsgcmV0dXJuOyB9CgoJCSRyYXcgPSBpc3NldCggJF9SRVFVRVNUWyd0J10gKSA/IHNhbml0aXplX3RleHRfZmllbGQoIHdwX3Vuc2xhc2goICRfUkVRVUVTVFsndCddICkgKSA6ICcnOwoJCWlmICggJycgPT09ICRyYXcgfHwgISBjbGFzc19leGlzdHMoICdQZXRzaG9wX0FjdGlvbl9Ub2tlbnMnICkgKSB7CgkJCXNlbGY6OnBhZ2UoICdOdW9yb2RhIG5ldGVpc2luZ2EnLCAnPHA+xaBpIG51b3JvZGEgbmViZWdhbGlvamEuPC9wPicgLiBzZWxmOjpob21lX2xpbmsoKSApOwoJCX0KCgkJJGlzX3Bvc3QgPSAoIGlzc2V0KCAkX1NFUlZFUlsnUkVRVUVTVF9NRVRIT0QnXSApICYmICdQT1NUJyA9PT0gc3RydG91cHBlciggJF9TRVJWRVJbJ1JFUVVFU1RfTUVUSE9EJ10gKSApOwoKCQkvKiAtLS0tLS0tLS0tIEdFVDogVElLIHBlZWssIE5JRUtPIG5lYXRrdXJpYW0gLS0tLS0tLS0tLSAqLwoJCWlmICggISAkaXNfcG9zdCApIHsKCQkJJHBlZWsgPSBQZXRzaG9wX0FjdGlvbl9Ub2tlbnM6OnBlZWsoICRyYXcgKTsKCQkJaWYgKCBlbXB0eSggJHBlZWtbJ3ZhbGlkJ10gKSApIHsKCQkJCXNlbGY6OnBhZ2UoICdOdW9yb2RhIG5lYmVnYWxpb2phJywKCQkJCQknPHA+xaBpIGtyZXDFoWVsaW8gYXRrxatyaW1vIG51b3JvZGEgbmViZWdhbGlvamEgYXJiYSBqYXUgYnV2byBwYW5hdWRvdGEuPC9wPicgLiBzZWxmOjpob21lX2xpbmsoKSApOwoJCQl9CgkJCSRjYXJ0X2lkID0gc2VsZjo6Y2FydF9pZF9mcm9tKCAkcGVlayApOwoJCQkkZXYgPSBzZWxmOjpldmFsdWF0ZSggJGNhcnRfaWQgKTsKCgkJCWlmICggISAkZXZbJ29rJ10gKSB7CgkJCQlzZWxmOjpwYWdlKCAnS3JlcMWhZWxpbyBhdGt1cnRpIG5lcGF2eWtvJywgc2VsZjo6c2tpcHBlZF9odG1sKCAkZXZbJ3NraXBwZWQnXSwgdHJ1ZSApIC4gc2VsZjo6aG9tZV9saW5rKCAnUGVyxb5pxatyxJd0aSBwcmVrZXMnICkgKTsKCQkJfQoKCQkJJGh0bWwgID0gJzxwPlJhZG9tZSBqxatzxbMgacWhc2F1Z290xIUga3JlcMWhZWzEry4gTm9yaXRlIGrEryBhdGt1cnRpPzwvcD4nOwoJCQkkaHRtbCAuPSBzZWxmOjppdGVtc19odG1sKCAkZXZbJ29rJ10gKTsKCQkJaWYgKCAkZXZbJ3NraXBwZWQnXSApIHsgJGh0bWwgLj0gc2VsZjo6c2tpcHBlZF9odG1sKCAkZXZbJ3NraXBwZWQnXSwgZmFsc2UgKTsgfQoJCQkkaHRtbCAuPSAnPGZvcm0gbWV0aG9kPSJwb3N0IiBhY3Rpb249IiI+JwoJCQkJLiAnPGlucHV0IHR5cGU9ImhpZGRlbiIgbmFtZT0idCIgdmFsdWU9IicgLiBlc2NfYXR0ciggJHJhdyApIC4gJyI+JwoJCQkJLiB3cF9ub25jZV9maWVsZCggJ3BzX2NhcnRyZWMnLCAnX3Bzbm9uY2UnLCB0cnVlLCBmYWxzZSApCgkJCQkuICc8YnV0dG9uIHR5cGU9InN1Ym1pdCIgc3R5bGU9ImJhY2tncm91bmQ6IzJkNmEzNTtjb2xvcjojZmZmO2JvcmRlcjowO3BhZGRpbmc6MTRweCAyNnB4O2JvcmRlci1yYWRpdXM6OHB4O2ZvbnQtc2l6ZToxNXB4O2ZvbnQtd2VpZ2h0OjYwMDtjdXJzb3I6cG9pbnRlcjsiPkF0a3VydGkga3JlcMWhZWzErzwvYnV0dG9uPicKCQkJCS4gJzwvZm9ybT4nOwoJCQlzZWxmOjpwYWdlKCAnQXRrdXJ0aSBrcmVwxaFlbMSvJywgJGh0bWwgKTsKCQl9CgoJCS8qIC0tLS0tLS0tLS0gUE9TVDogY29uc3VtZSArIGF0a3VyaW1hcyAtLS0tLS0tLS0tICovCgkJaWYgKCAhIGlzc2V0KCAkX1BPU1RbJ19wc25vbmNlJ10gKSB8fCAhIHdwX3ZlcmlmeV9ub25jZSggc2FuaXRpemVfdGV4dF9maWVsZCggd3BfdW5zbGFzaCggJF9QT1NUWydfcHNub25jZSddICkgKSwgJ3BzX2NhcnRyZWMnICkgKSB7CgkJCXNlbGY6OnBhZ2UoICdOZXBhdnlrbycsICc8cD5TZXNpamEgbmViZWdhbGlvamEuIEJhbmR5a2l0ZSBkYXIga2FydMSFIGnFoSBsYWnFoWtvLjwvcD4nIC4gc2VsZjo6aG9tZV9saW5rKCkgKTsKCQl9CgoJCSRyZXMgPSBQZXRzaG9wX0FjdGlvbl9Ub2tlbnM6OmNvbnN1bWUoICRyYXcgKTsKCQlpZiAoIGVtcHR5KCAkcmVzWyd2YWxpZCddICkgKSB7CgkJCXNlbGY6OnBhZ2UoICdOdW9yb2RhIG5lYmVnYWxpb2phJywKCQkJCSc8cD7FoGkgbnVvcm9kYSBqYXUgYnV2byBwYW5hdWRvdGEgYXJiYSBuZWJlZ2FsaW9qYS48L3A+JyAuIHNlbGY6OmhvbWVfbGluaygpICk7CgkJfQoKCQkkY2FydF9pZCA9IHNlbGY6OmNhcnRfaWRfZnJvbSggJHJlcyApOwoJCSRldiA9IHNlbGY6OmV2YWx1YXRlKCAkY2FydF9pZCApOwoKCQlpZiAoICEgJGV2WydvayddICkgewoJCQlzZWxmOjpwYWdlKCAnS3JlcMWhZWxpbyBhdGt1cnRpIG5lcGF2eWtvJywKCQkJCXNlbGY6OnNraXBwZWRfaHRtbCggJGV2Wydza2lwcGVkJ10sIHRydWUgKSAuIHNlbGY6OmhvbWVfbGluayggJ1BlcsW+acWrcsSXdGkgcHJla2VzJyApICk7CgkJfQoKCQlpZiAoICEgZnVuY3Rpb25fZXhpc3RzKCAnV0MnICkgfHwgISBXQygpLT5jYXJ0ICkgewoJCQlpZiAoIGZ1bmN0aW9uX2V4aXN0cyggJ3djX2xvYWRfY2FydCcgKSApIHsgd2NfbG9hZF9jYXJ0KCk7IH0KCQl9CgkJJGFkZGVkID0gMDsKCQlmb3JlYWNoICggJGV2WydvayddIGFzICRpICkgewoJCQkkciA9IFdDKCktPmNhcnQtPmFkZF90b19jYXJ0KAoJCQkJKGludCkgJGlbJ3Byb2R1Y3RfaWQnXSwKCQkJCShmbG9hdCkgJGlbJ3F0eSddLAoJCQkJKGludCkgJGlbJ3ZhcmlhdGlvbl9pZCddLAoJCQkJKGFycmF5KSAkaVsndmFyaWF0aW9uJ10KCQkJKTsKCQkJaWYgKCAkciApIHsgJGFkZGVkKys7IH0KCQl9CgoJCWlmICggISAkYWRkZWQgKSB7CgkJCXNlbGY6OnBhZ2UoICdLcmVwxaFlbGlvIGF0a3VydGkgbmVwYXZ5a28nLAoJCQkJJzxwPk5lcGF2eWtvIMSvZMSXdGkgcHJla2nFsyDEryBrcmVwxaFlbMSvLiBQYWJhbmR5a2l0ZSBkYXIga2FydMSFIGFyYmEgc3VzaXNpZWtpdGUgc3UgbXVtaXMuPC9wPicgLiBzZWxmOjpob21lX2xpbmsoKSApOwoJCX0KCgkJd3Bfc2FmZV9yZWRpcmVjdCggd2NfZ2V0X2NhcnRfdXJsKCkgKTsKCQlleGl0OwoJfQoKCS8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqLwoJLyogUGFnYWxiaW7El3MgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqLwoJLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovCgoJcHJvdGVjdGVkIHN0YXRpYyBmdW5jdGlvbiBjYXJ0X2lkX2Zyb20oICRyZXMgKSB7CgkJJHJvdyA9IGlzc2V0KCAkcmVzWydyb3cnXSApID8gJHJlc1sncm93J10gOiBhcnJheSgpOwoJCWlmICggaXNfYXJyYXkoICRyb3cgKSAmJiAhIGVtcHR5KCAkcm93WydyZXNvdXJjZV9pZCddICkgKSB7IHJldHVybiAoc3RyaW5nKSAkcm93WydyZXNvdXJjZV9pZCddOyB9CgkJaWYgKCBpc19vYmplY3QoICRyb3cgKSAmJiAhIGVtcHR5KCAkcm93LT5yZXNvdXJjZV9pZCApICkgeyByZXR1cm4gKHN0cmluZykgJHJvdy0+cmVzb3VyY2VfaWQ7IH0KCQlyZXR1cm4gJyc7Cgl9CgoJcHJvdGVjdGVkIHN0YXRpYyBmdW5jdGlvbiBpdGVtc19odG1sKCAkaXRlbXMgKSB7CgkJJGggPSAnPHVsIHN0eWxlPSJwYWRkaW5nLWxlZnQ6MThweDttYXJnaW46MTRweCAwIDE4cHg7Ij4nOwoJCWZvcmVhY2ggKCAkaXRlbXMgYXMgJGkgKSB7CgkJCSRoIC49ICc8bGkgc3R5bGU9Im1hcmdpbi1ib3R0b206OHB4OyI+JyAuIGVzY19odG1sKCAkaVsnbmFtZSddICkKCQkJCS4gJyDigJQgPHN0cm9uZz4nIC4gZXNjX2h0bWwoIHJ0cmltKCBydHJpbSggbnVtYmVyX2Zvcm1hdCggKGZsb2F0KSAkaVsncXR5J10sIDIsICcsJywgJycgKSwgJzAnICksICcsJyApICkgLiAnIHZudC48L3N0cm9uZz4nCgkJCQkuICcgwrcgJyAuIHdwX3N0cmlwX2FsbF90YWdzKCB3Y19wcmljZSggKGZsb2F0KSAkaVsncHJpY2UnXSApICk7CgkJCWlmICggISBlbXB0eSggJGlbJ2xpbWl0ZWQnXSApICkgewoJCQkJJGggLj0gJyA8c3BhbiBzdHlsZT0iY29sb3I6IzdBODY3Qztmb250LXNpemU6MTNweDsiPihsaWt1dGlzIG1hxb5lc25pcyBuZWkgYnV2byk8L3NwYW4+JzsKCQkJfQoJCQkkaCAuPSAnPC9saT4nOwoJCX0KCQlyZXR1cm4gJGggLiAnPC91bD48cCBzdHlsZT0iY29sb3I6IzdBODY3Qztmb250LXNpemU6MTNweDsiPkthaW5vcyDigJQgZGFiYXJ0aW7El3MuPC9wPic7Cgl9CgoJcHJvdGVjdGVkIHN0YXRpYyBmdW5jdGlvbiBza2lwcGVkX2h0bWwoICRza2lwcGVkLCAkcHJpbWFyeSApIHsKCQlpZiAoICEgJHNraXBwZWQgKSB7IHJldHVybiAnJzsgfQoJCSRoID0gJHByaW1hcnkKCQkJPyAnPHA+RGVqYSwgbsSXIHZpZW5vcyBrcmVwxaFlbGlvIHByZWvEl3MgbmViZWdhbGltZSBwYXNpxatseXRpOjwvcD4nCgkJCTogJzxwIHN0eWxlPSJjb2xvcjojN0E4NjdDO2ZvbnQtc2l6ZToxNHB4O21hcmdpbi10b3A6MTRweDsiPsWgacWzIHByZWtpxbMgYXRrdXJ0aSBuZXBhdnlrczo8L3A+JzsKCQkkaCAuPSAnPHVsIHN0eWxlPSJwYWRkaW5nLWxlZnQ6MThweDtjb2xvcjojN0E4NjdDO2ZvbnQtc2l6ZToxNHB4OyI+JzsKCQlmb3JlYWNoICggJHNraXBwZWQgYXMgJHMgKSB7CgkJCSRuID0gJHNbJ25hbWUnXSA/ICRzWyduYW1lJ10gOiAnUHJla8SXJzsKCQkJJGggLj0gJzxsaT4nIC4gZXNjX2h0bWwoICRuICkgLiAnIOKAlCAnIC4gZXNjX2h0bWwoICRzWydyZWFzb24nXSApIC4gJzwvbGk+JzsKCQl9CgkJcmV0dXJuICRoIC4gJzwvdWw+JzsKCX0KCglwcm90ZWN0ZWQgc3RhdGljIGZ1bmN0aW9uIGhvbWVfbGluayggJGxhYmVsID0gJ0dyxK/FvnRpIMSvIHBldHNob3AubHQnICkgewoJCXJldHVybiAnPHA+PGEgaHJlZj0iJyAuIGVzY191cmwoIGhvbWVfdXJsKCAnLycgKSApIC4gJyIgc3R5bGU9ImNvbG9yOiMyZDZhMzU7Ij4nIC4gZXNjX2h0bWwoICRsYWJlbCApIC4gJzwvYT48L3A+JzsKCX0KCglwcm90ZWN0ZWQgc3RhdGljIGZ1bmN0aW9uIHBhZ2UoICR0aXRsZSwgJGh0bWwgKSB7CgkJc3RhdHVzX2hlYWRlciggMjAwICk7CgkJbm9jYWNoZV9oZWFkZXJzKCk7CgkJaGVhZGVyKCAnQ29udGVudC1UeXBlOiB0ZXh0L2h0bWw7IGNoYXJzZXQ9dXRmLTgnICk7CgkJZWNobyAnPCFET0NUWVBFIGh0bWw+PGh0bWwgbGFuZz0ibHQiPjxoZWFkPjxtZXRhIGNoYXJzZXQ9InV0Zi04Ij4nCgkJCS4gJzxtZXRhIG5hbWU9InZpZXdwb3J0IiBjb250ZW50PSJ3aWR0aD1kZXZpY2Utd2lkdGgsaW5pdGlhbC1zY2FsZT0xIj4nCgkJCS4gJzxtZXRhIG5hbWU9InJvYm90cyIgY29udGVudD0ibm9pbmRleCxub2ZvbGxvdyI+JwoJCQkuICc8dGl0bGU+JyAuIGVzY19odG1sKCAkdGl0bGUgKSAuICcg4oCUIFBldHNob3AubHQ8L3RpdGxlPjwvaGVhZD4nCgkJCS4gJzxib2R5IHN0eWxlPSJtYXJnaW46MDtiYWNrZ3JvdW5kOiNGM0VGRTU7Zm9udC1mYW1pbHk6QXJpYWwsSGVsdmV0aWNhLHNhbnMtc2VyaWY7Y29sb3I6IzFGMkEyNDsiPicKCQkJLiAnPGRpdiBzdHlsZT0ibWF4LXdpZHRoOjYwMHB4O21hcmdpbjo0OHB4IGF1dG87YmFja2dyb3VuZDojZmZmO2JvcmRlci1yYWRpdXM6MTJweDtwYWRkaW5nOjMycHggMjhweDsiPicKCQkJLiAnPGgxIHN0eWxlPSJmb250LXNpemU6MjJweDttYXJnaW46MCAwIDE2cHg7Ij4nIC4gZXNjX2h0bWwoICR0aXRsZSApIC4gJzwvaDE+JwoJCQkuICRodG1sCgkJCS4gJzwvZGl2PjwvYm9keT48L2h0bWw+JzsKCQlleGl0OwoJfQp9Cg==');
    if(!file_exists($p.'.bak_S318b')) copy($p,$p.'.bak_S318b');
    file_put_contents($p,$new); clearstatcache(true,$p);
    nocache_headers(); header('Content-Type: application/json');
    echo wp_json_encode(array('MATCH'=>(substr(hash_file('sha256',$p),0,16)===substr(hash('sha256',$new),0,16))?'YES':'NO')); exit;
  }

  if ($k==='setup') {
    // A: paprasta preke, norim 2
    // B: preke su likuciu 1, norim 5
    // C: VARIACIJA
    $ids=wc_get_products(array('limit'=>30,'status'=>'publish','return'=>'ids'));
    $a=0;$b=0; foreach((array)$ids as $x){ $p=wc_get_product($x);
      if($p&&$p->is_purchasable()&&$p->is_in_stock()&&!$p->is_type('variable')){ if(!$a){$a=(int)$x;} elseif(!$b){$b=(int)$x;break;} } }
    $vp=wc_get_products(array('limit'=>1,'status'=>'publish','type'=>'variable','return'=>'objects'));
    $vid=0;$vparent=0;$vattr=array();
    if($vp){ $vparent=$vp[0]->get_id();
      foreach($vp[0]->get_children() as $ch){ $v=wc_get_product($ch);
        if($v&&$v->is_purchasable()&&$v->is_in_stock()){ $vid=(int)$ch; $vattr=$v->get_variation_attributes(); break; } } }
    // B likutis 1
    $pb=wc_get_product($b); $b_had_manage=$pb->get_manage_stock(); $b_had_qty=$pb->get_stock_quantity();
    $pb->set_manage_stock(true); $pb->set_stock_quantity(1); $pb->save();
    update_option('ps_qv_restore',array('b'=>$b,'manage'=>$b_had_manage,'qty'=>$b_had_qty),false);

    $items=array(
      array('product_id'=>$a,'variation_id'=>0,'quantity'=>2,'variation'=>array(),'item_data'=>array()),
      array('product_id'=>$b,'variation_id'=>0,'quantity'=>5,'variation'=>array(),'item_data'=>array()));
    if($vid) $items[]=array('product_id'=>$vparent,'variation_id'=>$vid,'quantity'=>1,'variation'=>$vattr,'item_data'=>array());

    $wpdb->query($wpdb->prepare("DELETE FROM $T WHERE cart_id=%s",$CID));
    $now=current_time('mysql',true);
    $wpdb->insert($T,array('cart_id'=>$CID,'email'=>'qv@example.com','last_cart_activity_at'=>$now,
      'cart_hash'=>'hqv','snapshot_json'=>wp_json_encode($items),'snapshot_version'=>1,
      'status'=>'abandoned','status_changed_at'=>$now,'created_at'=>$now,'updated_at'=>$now));
    $link=Petshop_Cart_Recovery::link($CID);
    parse_str(parse_url($link,PHP_URL_QUERY),$q);
    nocache_headers(); header('Content-Type: application/json');
    echo wp_json_encode(array('token'=>$q['t']??'','A'=>$a,'B'=>$b,'V_parent'=>$vparent,'V_id'=>$vid,'V_attr'=>$vattr,
      'plan'=>Petshop_Cart_Recovery::evaluate($CID)),JSON_UNESCAPED_SLASHES|JSON_UNESCAPED_UNICODE); exit;
  }

  if ($k==='cart') {
    if(!WC()->cart && function_exists('wc_load_cart')) wc_load_cart();
    $out=array();
    foreach((array)WC()->cart->get_cart() as $ck=>$it){
      $out[]=array('product_id'=>(int)$it['product_id'],'variation_id'=>(int)$it['variation_id'],
        'quantity'=>(float)$it['quantity'],'variation'=>$it['variation']??array());
    }
    nocache_headers(); header('Content-Type: application/json');
    echo wp_json_encode(array('items'=>$out,'count'=>count($out)),JSON_UNESCAPED_SLASHES|JSON_UNESCAPED_UNICODE); exit;
  }

  if ($k==='cleanup') {
    $wpdb->query($wpdb->prepare("DELETE FROM $T WHERE cart_id=%s",$CID));
    $rs=get_option('ps_qv_restore');
    if(is_array($rs)){ $pb=wc_get_product($rs['b']); if($pb){ $pb->set_manage_stock($rs['manage']); $pb->set_stock_quantity($rs['qty']); $pb->save(); } }
    delete_option('ps_qv_restore');
    nocache_headers(); header('Content-Type: application/json'); echo wp_json_encode(array('ok'=>1)); exit;
  }
},1);`).toString('base64');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP Qty+Variation Verify v1',code:Buffer.from(php,'base64').toString('utf8'),scope:'global',active:true}));
let sid=null;
for(let i=0;i<4&&!sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else sh('sleep 4');
}
if(sid){
  sh('sleep 3');
  const dp=sh('curl -sSk "'+SITE+'/?ps_qv=deploy"'); try{O.deploy=JSON.parse(dp.out);}catch(e){O.deploy_raw=dp.out.slice(0,200);}
  sh('sleep 2');
  const g=sh('curl -sSk "'+SITE+'/?ps_qv=setup"'); try{O.setup=JSON.parse(g.out);}catch(e){O.setup_raw=g.out.slice(0,400);}
  const tok=O.setup&&O.setup.token;
  if(tok){
    sh('rm -f /tmp/cj3.txt');
    sh('curl -sSk -c /tmp/cj3.txt -b /tmp/cj3.txt -o /dev/null "'+SITE+'/cart/"');
    const c0=sh('curl -sSk -c /tmp/cj3.txt -b /tmp/cj3.txt "'+SITE+'/?ps_qv=cart"');
    try{O.cart_pries=JSON.parse(c0.out);}catch(e){O.cart_pries_raw=c0.out.slice(0,200);}
    sh('curl -sSk -c /tmp/cj3.txt -b /tmp/cj3.txt -o /tmp/g3.html "'+SITE+'/atkurti-krepseli/?t='+encodeURIComponent(tok)+'"');
    const g3=fs.readFileSync('/tmp/g3.html','utf8');
    const m=g3.match(/name="_psnonce"\s+value="([^"]+)"/);
    if(m){
      const pp=sh('curl -sSk -c /tmp/cj3.txt -b /tmp/cj3.txt -o /dev/null -w "%{http_code}|%{redirect_url}" -X POST '
        +'--data-urlencode "t='+tok+'" --data-urlencode "_psnonce='+m[1]+'" "'+SITE+'/atkurti-krepseli/"');
      O.post=pp.out.trim();
      const c1=sh('curl -sSk -c /tmp/cj3.txt -b /tmp/cj3.txt "'+SITE+'/?ps_qv=cart"');
      try{O.cart_po_POST=JSON.parse(c1.out);}catch(e){O.cart_po_raw=c1.out.slice(0,300);}
      // pakartotinis
      sh('curl -sSk -c /tmp/cj3.txt -b /tmp/cj3.txt -o /dev/null -X POST --data-urlencode "t='+tok+'" --data-urlencode "_psnonce='+m[1]+'" "'+SITE+'/atkurti-krepseli/"');
      const c2=sh('curl -sSk -c /tmp/cj3.txt -b /tmp/cj3.txt "'+SITE+'/?ps_qv=cart"');
      try{O.cart_po_pakartotinio=JSON.parse(c2.out);}catch(e){}
    }
  }
  sh('curl -sSk -o /dev/null "'+SITE+'/?ps_qv=cleanup"');
  fs.writeFileSync('/tmp/de.json',JSON.stringify({active:false}));
  sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/de.json "'+API+'/'+sid+'"');
}
putB64('qv.json', Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
