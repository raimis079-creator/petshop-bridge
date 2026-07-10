import { execSync } from "child_process";
import fs from "fs";
function putFile(n,s){
  const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
  for(let a=0;a<4;a++){ try{
    const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+n;
    let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){}
    const b={message:'ci',branch:'main',content:Buffer.from(s,'utf8').toString('base64')}; if(sha) b.sha=sha;
    fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));
    const r=execSync('curl -s -w "\nHTTP:%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'});
    if(/HTTP:20[01]/.test(r)) return true;
  }catch(e){} execSync('sleep 2'); }
  return false;
}
let out=''; const L=(s)=>{out+=s+'\n';};
const U=process.env.WP_USER||''; const P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH=U+':'+P;
function head(url){
  const r=execSync('curl -sk -o /dev/null -w "%{http_code} %{redirect_url}" --max-time 25 "'+url+'" 2>/dev/null || echo "ERR -"',{encoding:'utf8'}).trim();
  return r;
}
function api(url){
  const code=execSync('curl -sk -o /tmp/r.json -w "%{http_code}" --max-time 40 -u "'+AUTH+'" "'+url+'" 2>/dev/null || echo ERR',{encoding:'utf8'}).trim();
  let b=''; try{ b=fs.readFileSync('/tmp/r.json','utf8'); }catch(e){}
  return {code, body:b};
}

L('############ DUK NUORODU PATIKRA ############'); L('');
L('=== 1. Devynios DUK nuorodos ===');
const links=['/my-account/','/my-account/orders/','/kontaktai/','/pristatymas/','/apmokejimas/','/grazinimas/',
             '/hipoalerginis-maistas/','/monoproteinis-maistas/','/be-grudu-maistas/'];
const bad=[];
for(const l of links){
  const r=head('https://dev.avesa.lt'+l);
  const [code,redir]=r.split(' ');
  const ok = code==='200';
  L('  '+(ok?'✅':'❌')+' '+String(code).padEnd(4)+' '+l.padEnd(28)+(redir&&redir!=='-'?' -> '+redir.replace('https://dev.avesa.lt',''):''));
  if(!ok) bad.push({l,code,redir});
}
L('');

L('=== 2. Alternatyvos neveikiancioms ===');
const alts={
 '/my-account/':['/paskyra/','/mano-paskyra/','/account/'],
 '/my-account/orders/':['/paskyra/uzsakymai/','/my-account/orders'],
 '/hipoalerginis-maistas/':['/kategorija/hipoalerginis-maistas/','/preke-zyme/hipoalerginis/','/hipoalerginis/'],
 '/monoproteinis-maistas/':['/kategorija/monoproteinis-maistas/','/monoproteinis/'],
 '/be-grudu-maistas/':['/kategorija/be-grudu-maistas/','/be-grudu/'],
};
for(const b of bad){
  const cands = alts[b.l]||[];
  L('  '+b.l+' (HTTP '+b.code+'):');
  for(const c of cands){
    const r=head('https://dev.avesa.lt'+c);
    const [code]=r.split(' ');
    L('     '+(code==='200'?'✅':'  ')+' '+String(code).padEnd(4)+' '+c);
  }
}
L('');

L('=== 3. WC puslapiai (my-account) ===');
const ss=api('https://dev.avesa.lt/wp-json/wc/v3/system_status');
if(ss.code==='200'){
  try{
    const j=JSON.parse(ss.body);
    for(const p of (j.pages||[])) L('  '+String(p.page_name).padEnd(16)+' id='+p.page_id+'  set='+p.page_set+'  exists='+p.page_exists+'  visible='+p.page_visible);
  }catch(e){ L('  parse err'); }
}
L('');

L('=== 4. Ar yra puslapiu su "hipoalerg/monoprotein/be-grudu" ===');
for(const s of ['hipoalerg','monoprotein','be-grudu','grudu']){
  const r=api('https://dev.avesa.lt/wp-json/wp/v2/pages?search='+s+'&per_page=5&_fields=id,slug,link,title');
  if(r.code==='200'){
    try{ const arr=JSON.parse(r.body);
      L('  "'+s+'" puslapiai: '+(arr.length?arr.map(p=>p.slug).join(', '):'—'));
    }catch(e){}
  }
  const c=api('https://dev.avesa.lt/wp-json/wc/v3/products/categories?search='+s+'&per_page=5');
  if(c.code==='200'){
    try{ const arr=JSON.parse(c.body);
      L('  "'+s+'" kategorijos: '+(arr.length?arr.map(x=>x.slug+'('+x.count+')').join(', '):'—'));
    }catch(e){}
  }
}
L('');

L('=== 5. Pristatymo kainos ===');
const zn=api('https://dev.avesa.lt/wp-json/wc/v3/shipping/zones');
if(zn.code==='200'){
  try{
    const zones=JSON.parse(zn.body);
    for(const z of zones){
      L('');
      L('  [zone '+z.id+'] "'+z.name+'"');
      const m=api('https://dev.avesa.lt/wp-json/wc/v3/shipping/zones/'+z.id+'/methods');
      if(m.code==='200'){
        const ms=JSON.parse(m.body);
        for(const x of ms){
          const cost = x.settings?.cost?.value ?? x.settings?.min_amount?.value ?? '?';
          L('    '+(x.enabled?'✅':'  ')+' '+String(x.method_id).padEnd(38)+' "'+x.title+'"');
          const s=x.settings||{};
          for(const [k,v] of Object.entries(s)){
            if(v && v.value!=='' && v.value!==undefined && /cost|min_amount|requires|free/.test(k)){
              L('         '+k+' = '+JSON.stringify(v.value).slice(0,90));
            }
          }
        }
      } else L('    metodu HTTP '+m.code);
    }
  }catch(e){ L('  parse err: '+e.message.slice(0,80)); }
}
putFile('duk_recon.txt', out); console.log(out);
