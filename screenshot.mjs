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
function api(m,u,b){
  let c='curl -sk -o /tmp/r.json -w "%{http_code}" --max-time 60 -u "'+AUTH+'" -X '+m+' ';
  if(b){ fs.writeFileSync('/tmp/b.json',JSON.stringify(b)); c+='-H "Content-Type: application/json" -d @/tmp/b.json '; }
  c+='"'+u+'" 2>/dev/null || echo ERR';
  const code=execSync(c,{encoding:'utf8'}).trim();
  let body=''; try{ body=fs.readFileSync('/tmp/r.json','utf8'); }catch(e){}
  return {code, body};
}
function head(url){
  return execSync('curl -sk -o /dev/null -w "%{http_code}" --max-time 25 "'+url+'" 2>/dev/null || echo ERR',{encoding:'utf8'}).trim();
}
function page(url){
  const code=execSync('curl -skL -o /tmp/p.html -w "%{http_code}" --max-time 40 "'+url+'" 2>/dev/null || echo ERR',{encoding:'utf8'}).trim();
  let h=''; try{ h=fs.readFileSync('/tmp/p.html','utf8'); }catch(e){}
  return {code, html:h};
}

const html=fs.readFileSync('duk_min.html','utf8');
L('############ DUK PUSLAPIO KURIMAS ############');
L('turinys: '+html.length+' B, naujos eilutes: '+(html.match(/\n/g)||[]).length); L('');

try{
  L('=== 1. Ar /duk/ jau egzistuoja ===');
  const ex=api('GET','https://dev.avesa.lt/wp-json/wp/v2/pages?slug=duk&status=any&_fields=id,slug,status,title');
  let pageId=null;
  if(ex.code==='200'){
    const arr=JSON.parse(ex.body);
    if(arr.length){ pageId=arr[0].id; L('  RASTAS: id='+pageId+'  status='+arr[0].status); }
    else L('  nerastas — kuriam nauja');
  }
  L('');

  L('=== 2. Kuriam / atnaujinam ===');
  const payload={
    title:'Dažniausiai užduodami klausimai',
    slug:'duk',
    status:'publish',
    content:html,
    comment_status:'closed',
    ping_status:'closed'
  };
  let r;
  if(pageId){ r=api('POST','https://dev.avesa.lt/wp-json/wp/v2/pages/'+pageId,payload); L('  UPDATE id='+pageId+' -> HTTP '+r.code); }
  else{ r=api('POST','https://dev.avesa.lt/wp-json/wp/v2/pages',payload); L('  CREATE -> HTTP '+r.code); }
  if(r.code!=='200' && r.code!=='201'){ L('  ❌ '+r.body.slice(0,400)); throw new Error('create fail'); }
  const j=JSON.parse(r.body);
  pageId=j.id;
  L('  id='+pageId+'  slug='+j.slug+'  status='+j.status);
  L('  link: '+j.link);
  L('');
  await new Promise(x=>setTimeout(x,3000));

  L('=== 3. HTTP patikra ===');
  const c=head('https://dev.avesa.lt/duk/');
  L('  /duk/ -> HTTP '+c+'  '+(c==='200'?'✅':'❌'));
  L('');

  L('=== 4. Turinio patikra ===');
  const p=page('https://dev.avesa.lt/duk/');
  const checks={
    'H1 "Dažniausiai užduodami klausimai"': /<h1[^>]*>[^<]*Dažniausiai užduodami klausimai/.test(p.html),
    '"Trumpai" deze':        /petshop-trumpai|Trumpai:/.test(p.html),
    '17 klausimu (h3)':      (p.html.match(/<h3[^>]*>/g)||[]).length>=17,
    '6 sekcijos (h2)':       (p.html.match(/<h2[^>]*>/g)||[]).length>=6,
    'nera <br> tarp bloku':  !/<h3[^>]*>[^<]*<\/h3>\s*<br/.test(p.html),
    'nuoroda /my-account/':  /href="[^"]*\/my-account\/"/.test(p.html),
    'nuoroda /pristatymas/': /href="[^"]*\/pristatymas\/"/.test(p.html),
    'nuoroda /grazinimas/':  /href="[^"]*\/grazinimas\/"/.test(p.html),
    'nuoroda /hipoalerginis-maistas/': /hipoalerginis-maistas/.test(p.html),
    'veterinaro rekomendacija': /pasitarti su veterinaru/.test(p.html),
    'saskaita fakturai':     /sąskaitą faktūrą|sąskaita faktūra/i.test(p.html),
    'pristatymo kaina':      /Kiek kainuoja pristatymas/.test(p.html),
  };
  for(const [k,v] of Object.entries(checks)) L('  '+(v?'✅':'❌')+' '+k);
  L('');
  const h3s=[...(p.html.match(/<h3[^>]*>([^<]+)<\/h3>/g)||[])].map(x=>x.replace(/<[^>]+>/g,''));
  L('  Klausimai ('+h3s.length+'):');
  h3s.forEach((q,i)=>L('    '+String(i+1).padStart(2)+'. '+q));
  L('');

  L('=== 5. Visos nuorodos DUK puslapyje -> HTTP ===');
  const links=[...new Set((p.html.match(/href="(\/[a-z0-9\-\/]+\/)"/g)||[]).map(x=>x.match(/href="([^"]+)"/)[1]))];
  for(const l of links.slice(0,12)){
    const cc=head('https://dev.avesa.lt'+l);
    L('    '+(cc==='200'?'✅':'❌')+' '+cc+'  '+l);
  }
  L('');
  L('=== PAGE ID: '+pageId+' ===');
}catch(e){ L('!!! ERROR: '+e.message.slice(0,150)); }
putFile('duk_create.txt', out); console.log(out);
