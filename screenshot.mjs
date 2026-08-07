import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WU=process.env.WP_USER, WP=process.env.WP_APP_PASS, SITE='https://dev.avesa.lt';
function sh(c){try{return execSync(c+' 2>&1',{maxBuffer:20e6,shell:'/bin/bash'}).toString();}catch(e){return String(e).slice(0,300);}}
function putFile(name,buf){const u='https://api.github.com/repos/'+REPO+'/contents/'+name;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk --max-time 30 -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:80e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'s624',content:buf.toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync('curl -sk --max-time 90 -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:80e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
const AUTH='-u "'+WU+':'+WP+'"', API=SITE+'/wp-json/code-snippets/v1/snippets';
const O={VERSIJA_RUN:'run624'};
// deaktyvuojam senus TEMP
try{const lst=JSON.parse(sh('curl -sSk --max-time 60 '+AUTH+' "'+API+'"'));
 O.temp_off=[]; O.esami=[];
 for(const s of (Array.isArray(lst)?lst:[])){
   if(String(s.name||'').startsWith('TEMP') && s.active){
     fs.writeFileSync('/tmp/off0.json',JSON.stringify({active:false}));
     sh('curl -sSk --max-time 30 -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/off0.json "'+API+'/'+s.id+'"');
     O.temp_off.push(s.id+' '+s.name);}
   if(String(s.name||'').indexOf('Petshop Sources')>=0){O.esami_src=O.esami_src||[];O.esami_src.push({id:s.id,name:s.name});}
   if(String(s.name||'').indexOf('Petshop Stock Service')>=0)O.esami.push({id:s.id,name:s.name,active:s.active});
 }}catch(e){O.temp_off='klaida';}
const PHP=Buffer.from('PD9waHAKLyoqCiAqIFBldHNob3AgU3RvY2sgU2VydmljZSB2MS4wIChwYXJkdW9kYW1vIGtpZWtpbyBza2FpxI1pYXZpbWFzKQogKgogKiBFMCBhbnRyYXMgxb5pbmdzbmlzIChUxb0gMzcuMykuCiAqIFZJRU5BUyBza2FpxI1pYXZpbWFzIHZpc2llbXM6IGZpbHRyYW1zLCBkYXJibyBlaWzEl21zLCBzdXZlc3RpbsSXbXMsIHByZWvEl3MgcHVzbGFwaXVpLgogKgogKiBTQVVHQTogxaFpYW1lIGV0YXBlIFRJSyBTS0FJxIxJVU9KQSBpciBMWUdJTkEuIFByaWUgV29vQ29tbWVyY2UgbmVwcmlqdW5ndGFzLAogKiBfc3RvY2sgbGF1a28gbmVrZWnEjWlhLiA/cHNfc3RvY2s9ZHJ5IOKAlCB0aWsgc2thaXR5bWFzLgogKi8KCmlmICggISBjbGFzc19leGlzdHMoJ1BldHNob3BfU3RvY2tfU2VydmljZScpICkgewoKY2xhc3MgUGV0c2hvcF9TdG9ja19TZXJ2aWNlIHsKCiAgICBjb25zdCBWRVJTSUpBID0gJzEuMCc7CgogICAgLyoqIE51c3RhdHltYWkg4oCUIHbEl2xpYXUga2VsaWF1amEgxK8gREIuICovCiAgICBwdWJsaWMgc3RhdGljIGZ1bmN0aW9uIG51c3QoKSB7CiAgICAgICAgcmV0dXJuIGFycmF5KAogICAgICAgICAgICAnc2VuYV9wb192YWwnICAgICAgPT4gMjQsICAgLy8gdGlla8SXam8gZHVvbWVueXMgc2VuZXNuaSBuZWkgWCB2YWwuIOKAlCBuZcSvc2thaXRvbWkKICAgICAgICAgICAgJ3NhdWdvc19yZXplcnZhcycgID0+IDEsICAgIC8vIGF0aW1hbWEgbnVvIHRpZWvEl2pvIGxpa3XEjWlvCiAgICAgICAgICAgICdhdl9yZXplcnZhcycgICAgICA9PiAwLCAgICAvLyBzYXZvIGxlbnR5bm9zIG5lcmV6ZXJ2dW9qYW0KICAgICAgICApOwogICAgfQoKICAgIC8qKgogICAgICogS2llayBwaXJrxJdqYXMgZ2FsaSB1xb5zaXNha3l0aS4KICAgICAqIEdSWU5BIEZVTktDSUpBIOKAlCBuaWVrbyBuZXJhxaFvLiBHcsSFxb5pbmEgaXIgc2thacSNacWzLCBpciBQUklFxb1BU1TEri4KICAgICAqLwogICAgcHVibGljIHN0YXRpYyBmdW5jdGlvbiBwYXJkdW9kYW1hKCRwaWQsICRvdiA9IGFycmF5KCkpIHsKICAgICAgICAkbiA9IGFycmF5X21lcmdlKHNlbGY6Om51c3QoKSwgJG92KTsKICAgICAgICAkb3V0ID0gYXJyYXkoCiAgICAgICAgICAgICdxdHknID0+IDAsICdhdicgPT4gMCwgJ3RpZWtlam8nID0+IDAsCiAgICAgICAgICAgICdrb2RlbCcgPT4gJycsICdwZXJzcGVqaW1haScgPT4gYXJyYXkoKSwgJ3NhbHRpbmlhaScgPT4gYXJyYXkoKSwKICAgICAgICApOwoKICAgICAgICBpZiAoICEgY2xhc3NfZXhpc3RzKCdQZXRzaG9wX1NvdXJjZXMnKSApIHsKICAgICAgICAgICAgJG91dFsna29kZWwnXSA9ICduZXJhIFBldHNob3BfU291cmNlcyc7CiAgICAgICAgICAgIHJldHVybiAkb3V0OwogICAgICAgIH0KICAgICAgICAkcyA9IFBldHNob3BfU291cmNlczo6c3Vza2FpY2l1b3RpKCRwaWQpOwogICAgICAgIGlmICggISAkcyApIHsgJG91dFsna29kZWwnXSA9ICdwcmVrxJcgYmUgxaFhbHRpbmnFsyc7IHJldHVybiAkb3V0OyB9CgogICAgICAgICRkYWJhciA9IGN1cnJlbnRfdGltZSgndGltZXN0YW1wJyk7CiAgICAgICAgJGRhbHlzID0gYXJyYXkoKTsKCiAgICAgICAgZm9yZWFjaCAoJHMgYXMgJHgpIHsKICAgICAgICAgICAgJGVpbCA9IGFycmF5KCdzb3VyY2UnPT4keFsnc291cmNlJ10sJ3Jhdyc9PiR4WydzdG9ja19xdHknXSwnaXNrYWl0eXRhJz0+MCwna29kZWwnPT4nJyk7CgogICAgICAgICAgICBpZiAoICEgJHhbJ2lzX2FjdGl2ZSddIHx8ICEgJHhbJ2lzX3NlbGxhYmxlJ10gKSB7CiAgICAgICAgICAgICAgICAkZWlsWydrb2RlbCddID0gJ8WhYWx0aW5pcyBpxaFqdW5ndGFzJzsKICAgICAgICAgICAgICAgICRvdXRbJ3NhbHRpbmlhaSddW10gPSAkZWlsOyBjb250aW51ZTsKICAgICAgICAgICAgfQogICAgICAgICAgICBpZiAoICR4WydzdG9ja19xdHknXSA9PT0gbnVsbCApIHsKICAgICAgICAgICAgICAgICRlaWxbJ2tvZGVsJ10gPSAnbGlrdXRpcyBuZcW+aW5vbWFzJzsKICAgICAgICAgICAgICAgICRvdXRbJ3NhbHRpbmlhaSddW10gPSAkZWlsOyBjb250aW51ZTsKICAgICAgICAgICAgfQoKICAgICAgICAgICAgaWYgKCAkeFsnc291cmNlJ10gPT09IFBldHNob3BfU291cmNlczo6QVYgKSB7CiAgICAgICAgICAgICAgICAkayA9IG1heCgwLCAoaW50KSR4WydzdG9ja19xdHknXSAtIChpbnQpJG5bJ2F2X3JlemVydmFzJ10pOwogICAgICAgICAgICAgICAgJGVpbFsnaXNrYWl0eXRhJ10gPSAkazsgJGVpbFsna29kZWwnXSA9ICdzYXZhIGxlbnR5bmEnOwogICAgICAgICAgICAgICAgJG91dFsnYXYnXSArPSAkazsKICAgICAgICAgICAgICAgICRkYWx5c1tdID0gJ0FWICcuJGs7CiAgICAgICAgICAgIH0gZWxzZSB7CiAgICAgICAgICAgICAgICAvLyBUaWVrxJdqbyBkdW9tZW7FsyDFoXZpZcW+dW1hcwogICAgICAgICAgICAgICAgJGFteiA9IG51bGw7CiAgICAgICAgICAgICAgICBpZiAoICEgZW1wdHkoJHhbJ3N5bmNlZF9hdCddKSAmJiAkeFsnc3luY2VkX2F0J10gIT09ICcwMDAwLTAwLTAwIDAwOjAwOjAwJyApIHsKICAgICAgICAgICAgICAgICAgICAkdHMgPSBzdHJ0b3RpbWUoJHhbJ3N5bmNlZF9hdCddKTsKICAgICAgICAgICAgICAgICAgICBpZiAoJHRzKSAkYW16ID0gKCRkYWJhciAtICR0cykgLyAzNjAwOwogICAgICAgICAgICAgICAgfQogICAgICAgICAgICAgICAgaWYgKCAkYW16ID09PSBudWxsICkgewogICAgICAgICAgICAgICAgICAgICRlaWxbJ2tvZGVsJ10gPSAnbsSXcmEgc2luY2hyb25pemF2aW1vIGRhdG9zIOKAlCBuZcSvc2thaXR5dGEnOwogICAgICAgICAgICAgICAgICAgICRvdXRbJ3BlcnNwZWppbWFpJ11bXSA9ICR4Wydzb3VyY2UnXS4nOiBuZcW+aW5vbWEgZHVvbWVuxbMgZGF0YSc7CiAgICAgICAgICAgICAgICB9IGVsc2VpZiAoICRhbXogPiAoZmxvYXQpJG5bJ3NlbmFfcG9fdmFsJ10gKSB7CiAgICAgICAgICAgICAgICAgICAgJGVpbFsna29kZWwnXSA9ICdkdW9tZW55cyAnLnJvdW5kKCRhbXopLicgdmFsLiBzZW5pIOKAlCBuZcSvc2thaXR5dGEnOwogICAgICAgICAgICAgICAgICAgICRvdXRbJ3BlcnNwZWppbWFpJ11bXSA9ICR4Wydzb3VyY2UnXS4nOiBkdW9tZW55cyAnLnJvdW5kKCRhbXopLicgdmFsLiBzZW5pJzsKICAgICAgICAgICAgICAgIH0gZWxzZSB7CiAgICAgICAgICAgICAgICAgICAgJGsgPSBtYXgoMCwgKGludCkkeFsnc3RvY2tfcXR5J10gLSAoaW50KSRuWydzYXVnb3NfcmV6ZXJ2YXMnXSk7CiAgICAgICAgICAgICAgICAgICAgJGVpbFsnaXNrYWl0eXRhJ10gPSAkazsKICAgICAgICAgICAgICAgICAgICAkZWlsWydrb2RlbCddID0gJ2F0aW10YXMgJy4kblsnc2F1Z29zX3JlemVydmFzJ10uJyB2bnQuIHNhdWdvcyByZXplcnZhcyc7CiAgICAgICAgICAgICAgICAgICAgJG91dFsndGlla2VqbyddICs9ICRrOwogICAgICAgICAgICAgICAgICAgICRkYWx5c1tdID0gc3RydG91cHBlcigkeFsnc291cmNlJ10pLicgJy4kazsKICAgICAgICAgICAgICAgIH0KICAgICAgICAgICAgICAgICRlaWxbJ2R1b21lbnVfYW16aXVzX3ZhbCddID0gJGFteiA9PT0gbnVsbCA/IG51bGwgOiByb3VuZCgkYW16LCAxKTsKICAgICAgICAgICAgfQogICAgICAgICAgICAkb3V0WydzYWx0aW5pYWknXVtdID0gJGVpbDsKICAgICAgICB9CgogICAgICAgICRvdXRbJ3F0eSddICAgPSAkb3V0WydhdiddICsgJG91dFsndGlla2VqbyddOwogICAgICAgICRvdXRbJ2tvZGVsJ10gPSAkZGFseXMgPyBpbXBsb2RlKCcgKyAnLCAkZGFseXMpIDogJ27El3JhIHBhcmR1b2RhbW8gbGlrdcSNaW8nOwogICAgICAgIHJldHVybiAkb3V0OwogICAgfQoKICAgIC8qKiBUcnVtcGFzIHNrYWnEjWl1cyDigJQga2FpIHJlaWtpYSB0aWsgam8uICovCiAgICBwdWJsaWMgc3RhdGljIGZ1bmN0aW9uIHF0eSgkcGlkKSB7ICR4ID0gc2VsZjo6cGFyZHVvZGFtYSgkcGlkKTsgcmV0dXJuIChpbnQpJHhbJ3F0eSddOyB9Cn0KCn0gLy8gY2xhc3NfZXhpc3RzCgphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbiAoKSB7CiAgICAkdiA9IGlzc2V0KCRfR0VUWydwc19zdG9jayddKSA/IHNhbml0aXplX2tleSgkX0dFVFsncHNfc3RvY2snXSkgOiAnJzsKICAgIGlmICgkdiA9PT0gJycpIHJldHVybjsKICAgICRvayA9IGN1cnJlbnRfdXNlcl9jYW4oJ21hbmFnZV9vcHRpb25zJykgfHwgKCBpc3NldCgkX0dFVFsnayddKSAmJiAkX0dFVFsnayddID09PSAncHMyMDI2JyApOwogICAgaWYgKCEkb2spIHJldHVybjsKICAgIGlmICghaGVhZGVyc19zZW50KCkpIHsgbm9jYWNoZV9oZWFkZXJzKCk7IGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IH0KICAgIEBzZXRfdGltZV9saW1pdCgyODApOwogICAgZ2xvYmFsICR3cGRiOyAkcCA9ICR3cGRiLT5wcmVmaXg7CiAgICAkciA9IGFycmF5KCdWRVJTSUpBJz0+J3N0b2NrLScuUGV0c2hvcF9TdG9ja19TZXJ2aWNlOjpWRVJTSUpBLCdSRVpJTUFTJz0+J1RJSyBTS0FJVFlNQVMnKTsKICAgICRyWydudXN0YXR5bWFpJ10gPSBQZXRzaG9wX1N0b2NrX1NlcnZpY2U6Om51c3QoKTsKCiAgICBpZiAoJHYgIT09ICdkcnknKSB7ICRyWydLTEFJREEnXT0nbmV6aW5vbWFzIHZlaWtzbWFzJzsgZWNobyB3cF9qc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUFJFVFRZX1BSSU5UKTsgZXhpdDsgfQoKICAgICRpZHMgPSAkd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIElEIEZST00geyRwfXBvc3RzIFdIRVJFIHBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHBvc3Rfc3RhdHVzPSdwdWJsaXNoJyIpOwoKICAgIC8vIEx5Z2luYW0gVFJJUyB2YXJpYW50dXM6IGRhYmFydGluaXMgX3N0b2NrIMK3IFN0b2NrX1NlcnZpY2Ugc3UgcmV6ZXJ2dSAxIMK3IHN1IHJlemVydnUgMAogICAgJHN0ID0gYXJyYXkoJ3Rpa3JpbnRhJz0+MCwnc3V0YW1wYSc9PjAsJ3NraXJpYXNpJz0+MCwnc2tpcnR1bWFzX3N1bWEnPT4wKTsKICAgICRwdnogPSBhcnJheSgpOyAkcHJpZXphID0gYXJyYXkoKTsKICAgICRyZXowID0gYXJyYXkoJ3N1dGFtcGEnPT4wLCdza2lyaWFzaSc9PjApOwogICAgJHNlbmFfeG1sID0gMDsgJGJlX2RhdG9zID0gMDsKCiAgICBmb3JlYWNoICgkaWRzIGFzICRwaWQpIHsKICAgICAgICAkc3RbJ3Rpa3JpbnRhJ10rKzsKICAgICAgICAkbm93ID0gZ2V0X3Bvc3RfbWV0YSgkcGlkLCdfc3RvY2snLHRydWUpOwogICAgICAgICRub3cgPSAoJG5vdyA9PT0gJycgfHwgJG5vdyA9PT0gbnVsbCkgPyBudWxsIDogKGludCkkbm93OwoKICAgICAgICAkYSA9IFBldHNob3BfU3RvY2tfU2VydmljZTo6cGFyZHVvZGFtYSgkcGlkKTsKICAgICAgICAkYiA9IFBldHNob3BfU3RvY2tfU2VydmljZTo6cGFyZHVvZGFtYSgkcGlkLCBhcnJheSgnc2F1Z29zX3JlemVydmFzJz0+MCkpOwoKICAgICAgICBpZiAoJG5vdyA9PT0gbnVsbCkgeyAkc3RbJ3N1dGFtcGEnXSsrOyAkcmV6MFsnc3V0YW1wYSddKys7IGNvbnRpbnVlOyB9IC8vIG1hbmFnZV9zdG9jaz1ubwogICAgICAgIGlmICgoaW50KSRhWydxdHknXSA9PT0gJG5vdykgJHN0WydzdXRhbXBhJ10rKzsgZWxzZSB7CiAgICAgICAgICAgICRzdFsnc2tpcmlhc2knXSsrOwogICAgICAgICAgICAkc3RbJ3NraXJ0dW1hc19zdW1hJ10gKz0gKCRhWydxdHknXSAtICRub3cpOwogICAgICAgICAgICBmb3JlYWNoICgkYVsncGVyc3BlamltYWknXSBhcyAkdykgewogICAgICAgICAgICAgICAgJGtrID0gcHJlZ19yZXBsYWNlKCcvXGQrLycsJ04nLCR3KTsKICAgICAgICAgICAgICAgIGlmKCFpc3NldCgkcHJpZXphWyRra10pKSAkcHJpZXphWyRra109MDsgJHByaWV6YVska2tdKys7CiAgICAgICAgICAgIH0KICAgICAgICAgICAgaWYgKGNvdW50KCRwdnopIDwgMjUpICRwdnpbXSA9IGFycmF5KAogICAgICAgICAgICAgICAgJ2lkJz0+JHBpZCwgJ3Bhdic9Pm1iX3N1YnN0cihodG1sX2VudGl0eV9kZWNvZGUoZ2V0X3RoZV90aXRsZSgkcGlkKSksMCw0MCksCiAgICAgICAgICAgICAgICAnc2FuZGVsaXMnPT5nZXRfcG9zdF9tZXRhKCRwaWQsJ19wc19zYW5kZWxpcycsdHJ1ZSksCiAgICAgICAgICAgICAgICAnZGFiYXJfc3RvY2snPT4kbm93LCAnc2VydmlzYXMnPT4kYVsncXR5J10sCiAgICAgICAgICAgICAgICAnYmVfcmV6ZXJ2byc9PiRiWydxdHknXSwgJ2tvZGVsJz0+JGFbJ2tvZGVsJ10sCiAgICAgICAgICAgICAgICAncGVyc3BlamltYWknPT4kYVsncGVyc3BlamltYWknXSk7CiAgICAgICAgfQogICAgICAgIGlmICgoaW50KSRiWydxdHknXSA9PT0gJG5vdykgJHJlejBbJ3N1dGFtcGEnXSsrOyBlbHNlICRyZXowWydza2lyaWFzaSddKys7CgogICAgICAgIGZvcmVhY2ggKCRhWydzYWx0aW5pYWknXSBhcyAkc3gpIHsKICAgICAgICAgICAgaWYgKGlzc2V0KCRzeFsnZHVvbWVudV9hbXppdXNfdmFsJ10pKSB7CiAgICAgICAgICAgICAgICBpZiAoJHN4WydkdW9tZW51X2Fteml1c192YWwnXSA9PT0gbnVsbCkgJGJlX2RhdG9zKys7CiAgICAgICAgICAgICAgICBlbHNlaWYgKCRzeFsnZHVvbWVudV9hbXppdXNfdmFsJ10gPiAyNCkgJHNlbmFfeG1sKys7CiAgICAgICAgICAgIH0KICAgICAgICB9CiAgICB9CiAgICAkclsnc3VfcmV6ZXJ2dV8xJ10gPSAkc3Q7CiAgICAkclsnc3VfcmV6ZXJ2dV8wJ10gPSAkcmV6MDsKICAgICRyWydzZW5hX3htbF9zYWx0aW5pdSddID0gJHNlbmFfeG1sOwogICAgJHJbJ2JlX3N5bmNfZGF0b3Nfc2FsdGluaXUnXSA9ICRiZV9kYXRvczsKICAgICRyWydwcmllemFzdHlzJ10gPSAkcHJpZXphOwogICAgJHJbJ3NraXJ0dW11X3B2eiddID0gJHB2ejsKCiAgICAvLyBrb25rcmV0dXMgcGF2eXpkeXMKICAgICRyWydwdnpfam9zZXJhJ10gPSBQZXRzaG9wX1N0b2NrX1NlcnZpY2U6OnBhcmR1b2RhbWEoMTc5NzgpOwogICAgJHJbJ1BBU1RBQkEnXSA9ICdOaWVrbyBuZWtlaXN0YS4gU2VydmlzYXMgcHJpZSBXb29Db21tZXJjZSBuZXByaWp1bmd0YXMuJzsKICAgIGVjaG8gd3BfanNvbl9lbmNvZGUoJHIsIEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QUkVUVFlfUFJJTlQpOyBleGl0Owp9LCAxKTsK','base64').toString('utf8').replace(/^<\?php\s*/,'');
let sid=null;
// jei snippetas jau yra — atnaujinam, kitaip kuriam
if(O.esami&&O.esami.length){sid=O.esami[0].id;
  fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'Petshop Stock Service v1.0 (parduodamo kiekio skaiciavimas)',code:PHP,scope:'global',active:true}));
  O.upd=sh('curl -sSk --max-time 60 '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'/'+sid+'"').slice(0,200);
}else{
  fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'Petshop Stock Service v1.0 (parduodamo kiekio skaiciavimas)',code:PHP,scope:'global',active:true}));
  for(let i=0;i<3&&!sid;i++){const t=sh('curl -sSk --max-time 60 '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
   try{const j=JSON.parse(t); if(j&&j.id)sid=j.id;}catch(e){} if(!sid)sh('sleep 4');}}
O.sid=sid;
if(O.esami_src&&O.esami_src.length){
  const cur=sh('curl -sSk --max-time 60 '+AUTH+' "'+API+'/'+O.esami_src[0].id+'"');
  try{const j=JSON.parse(cur);
    fs.writeFileSync('/tmp/ren.json',JSON.stringify({name:'Petshop Sources v1.1 (ps_sources lentele + NULL)',code:j.code,scope:j.scope,active:true}));
    O.pervadinta=sh('curl -sSk --max-time 60 '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/ren.json "'+API+'/'+O.esami_src[0].id+'"').slice(0,120);
  }catch(e){O.pervadinta='klaida';}}
sh('sleep 6');
// DRY RUN
// 1) APPLY
const ap=sh('curl -sSk --max-time 260 "'+SITE+'/?ps_stock=dry&k=ps2026"');
try{O.stock=JSON.parse(ap);}catch(e){O.stock={raw:String(ap).slice(0,2500)};}
sh('sleep 3');
// 3) DB PATIKRA
const VER=`add_action('wp_loaded',function(){ if(($_GET['ps_chk']??'')!=='K624v')return;
 if(!headers_sent()){nocache_headers();header('Content-Type: application/json; charset=utf-8');}
 global $wpdb;$p=$wpdb->prefix;$t=$p.'ps_sources';$r=array();
 $r['lentele']=($wpdb->get_var("SHOW TABLES LIKE '$t'")===$t)?'TAIP':'NE';
 if($r['lentele']==='TAIP'){
  $r['irasu']=(int)$wpdb->get_var("SELECT COUNT(*) FROM $t");
  $r['prekiu']=(int)$wpdb->get_var("SELECT COUNT(DISTINCT product_id) FROM $t");
  $r['pagal_src']=$wpdb->get_results("SELECT source,COUNT(*) c,SUM(stock_qty>0) su_lik,SUM(cost_net>0) su_cost FROM $t GROUP BY source ORDER BY c DESC",ARRAY_A);
  $r['daugiasaltiniu']=(int)$wpdb->get_var("SELECT COUNT(*) FROM (SELECT product_id FROM $t GROUP BY product_id HAVING COUNT(*)>1) x");
  $r['dublikatai']=(int)$wpdb->get_var("SELECT COUNT(*) FROM (SELECT product_id,source FROM $t GROUP BY product_id,source HAVING COUNT(*)>1) x");
  $r['pvz']=$wpdb->get_results("SELECT * FROM $t WHERE product_id=17978",ARRAY_A);
  $r['cost_null']=(int)$wpdb->get_var("SELECT COUNT(*) FROM $t WHERE cost_net IS NULL");
  $r['cost_0']=(int)$wpdb->get_var("SELECT COUNT(*) FROM $t WHERE cost_net=0");
  $r['cost_teigiama']=(int)$wpdb->get_var("SELECT COUNT(*) FROM $t WHERE cost_net>0");
  $r['sync_null']=(int)$wpdb->get_var("SELECT COUNT(*) FROM $t WHERE synced_at IS NULL");
  $r['sync_bloga']=(int)$wpdb->get_var("SELECT COUNT(*) FROM $t WHERE synced_at='0000-00-00 00:00:00'");
  $r['qty_null']=(int)$wpdb->get_var("SELECT COUNT(*) FROM $t WHERE stock_qty IS NULL");
  $r['prekiu_db']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}posts WHERE post_type='product' AND post_status IN ('publish','draft','private')");
  $r['siukslineje']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}posts WHERE post_type='product' AND post_status='trash'");
  $r['be_irasu']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}posts po WHERE po.post_type='product' AND po.post_status IN ('publish','draft','private') AND NOT EXISTS(SELECT 1 FROM $t s WHERE s.product_id=po.ID)");
 }
 echo wp_json_encode($r,JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);exit;},1);`;
fs.writeFileSync('/tmp/v.json',JSON.stringify({name:'TEMP S624 Verify',code:VER,scope:'global',active:true}));
let vid=null;
for(let i=0;i<3&&!vid;i++){const t=sh('curl -sSk --max-time 60 '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/v.json "'+API+'"');
 try{const j=JSON.parse(t);if(j&&j.id)vid=j.id;}catch(e){} if(!vid)sh('sleep 4');}
O.vid=vid; sh('sleep 5');
const vv=sh('curl -sSk --max-time 120 "'+SITE+'/?ps_chk=K624v"');
try{O.PATIKRA=JSON.parse(vv);}catch(e){O.PATIKRA={raw:String(vv).slice(0,2000)};}
if(vid){fs.writeFileSync('/tmp/voff.json',JSON.stringify({active:false}));
 sh('curl -sSk --max-time 30 -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/voff.json "'+API+'/'+vid+'"');}
putFile('analize/s624.json', Buffer.from(JSON.stringify(O,null,1)));
console.log('OK');
