import { execSync } from "child_process";
import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function putBin(name,buf){
  const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;
  let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){}
  const body={message:'r',branch:'main',content:buf.toString('base64')}; if(sha) body.sha=sha;
  fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));
  try{ execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}); }catch(e){}
}
function commit(name, str){
  const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;
  let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){}
  const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha;
  fs.writeFileSync('/tmp/cb2.json',JSON.stringify(body));
  try{ execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb2.json "'+url+'"',{encoding:'utf8'}); }catch(e){}
}
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000}); }catch(e){ return 'EXC:'+String(e).slice(0,200); } }
const UA='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';
(async()=>{
  const out={ts:new Date().toISOString()};
  // pirma — kaip atrodo 4.5KB failas?
  exec(`curl -sk -A "${UA}" "https://ontario.pet/en/wp-content/uploads/213-2002.webp" -o /tmp/o.webp`);
  out.size_first = fs.existsSync('/tmp/o.webp') ? fs.statSync('/tmp/o.webp').size : 0;
  // Patikrinu, kas viduje (hex prefix)
  if(out.size_first > 0){
    const buf = fs.readFileSync('/tmp/o.webp');
    out.hex_prefix = buf.slice(0, 16).toString('hex');
    out.is_webp = buf.slice(0,4).toString() === 'RIFF';
  }
  // bandysiu kitas dimensijų versijas (WP automatiškai daro 300x300, 600x600, 800x800)
  const urls = [
    'https://ontario.pet/en/wp-content/uploads/213-2002-768x1024.webp',
    'https://ontario.pet/en/wp-content/uploads/213-2002-1500x2000.webp',
    'https://ontario.pet/en/wp-content/uploads/213-2002-300x400.webp',
    'https://ontario.pet/en/wp-content/uploads/213-2002-scaled.webp',
    'https://ontario.pet/en/wp-content/uploads/213-2002.png',
    'https://ontario.pet/en/wp-content/uploads/213-2002.jpg'
  ];
  out.tries = {};
  for(let i=0;i<urls.length;i++){
    const f = '/tmp/v'+i+'.bin';
    exec(`curl -sk -A "${UA}" -w "%{http_code}" "${urls[i]}" -o "${f}" 2>&1`);
    const sz = fs.existsSync(f) ? fs.statSync(f).size : 0;
    out.tries[urls[i]] = sz;
  }
  // dar bandau be prefikso "en" (gal originalo path'as kitoks)
  out.tries['https://ontario.pet/wp-content/uploads/213-2002.webp'] = (() => {
    exec(`curl -sk -A "${UA}" "https://ontario.pet/wp-content/uploads/213-2002.webp" -o /tmp/cz.webp`);
    return fs.existsSync('/tmp/cz.webp') ? fs.statSync('/tmp/cz.webp').size : 0;
  })();
  // pateikiu maziausią failą inspekcijai (4.5KB versiją)
  if(out.size_first > 0){
    putBin('ontario_213.webp', fs.readFileSync('/tmp/o.webp'));
  }
  commit('ontario_diag.json', JSON.stringify(out,null,1));
})();
