import { execSync } from "child_process";
import fs from "fs";
import { chromium } from "playwright";
function putBinary(n,buf){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;for(let a=0;a<4;a++){try{const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'pf '+n,branch:'main',content:buf.toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pb.json',JSON.stringify(b));const r=execSync('curl -s --max-time 45 -w "\nHTTP:%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pb.json "'+url+'"',{encoding:'utf8',maxBuffer:80000000});if(/HTTP:20[01]/.test(r))return true;}catch(e){}execSync('sleep 2');}return false;}
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'pf '+n,branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));execSync('curl -s --max-time 40 -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'});}
let out='';const L=s=>{out+=s+'\n';console.log(s);};
const BASE='https://dev.avesa.lt';const U=process.env.WP_USER||'';const P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const FIX="if ( ! defined( 'ABSPATH' ) ) { return; }\n\n/**\n * Petshop Mobile Filtru Dublio Fix v1\n * #329 (Filtrai PILNAS v14) mobile (<850px) perkelia #shop-sidebar i <body>,\n * kad YITH AJAX jo nesunaikintu. Perkeltas off-canvas praranda Flatsome hide\n * wrapper'i -> matosi normal flow po footeriu (dublis).\n * FIX: paslepti body-child #shop-sidebar mobile. Atidarant Flatsome/Magnific\n * perkelia ji i .mfp-content (nebe body>#shop-sidebar) -> off-canvas veikia.\n * Desktop nepaliestas (ten #shop-sidebar lieka savo kolonoje, ne body vaikas).\n */\nadd_action( 'wp_head', function () {\n\tif ( ! function_exists( 'is_product_category' ) ) { return; }\n\tif ( ! ( is_product_category() || is_shop() || ( function_exists('is_product_taxonomy') && is_product_taxonomy() ) ) ) { return; }\n\techo '<style id=\"ps-mobile-filter-fix\">@media (max-width:849px){body > #shop-sidebar{display:none !important;}}</style>' . \"\\n\";\n}, 99 );\n";
function api(method,path,body){const auth='-u "'+U+':'+P+'"';let cmd;if(body){fs.writeFileSync('/tmp/b.json',JSON.stringify(body));cmd='curl -s -k --max-time 90 -w "\nHTTP:%{http_code}" '+auth+' -X '+method+' -H "Content-Type: application/json" --data-binary @/tmp/b.json "'+BASE+path+'"';}else{cmd='curl -s -k --max-time 60 -w "\nHTTP:%{http_code}" '+auth+' -X '+method+' "'+BASE+path+'"';}let r;try{r=execSync(cmd,{encoding:'utf8',maxBuffer:30000000});}catch(e){r=(e.stdout||'')+'\nHTTP:TIMEOUT';}return{code:(r.match(/HTTP:(\S+)$/)||[])[1]||'?',body:r.replace(/\nHTTP:\S+$/,'')};}
(async()=>{let id=0;try{
  const c=api('POST','/wp-json/code-snippets/v1/snippets',{name:'Petshop Mobile Filtru Dublio Fix v1',desc:'Paslepia body>#shop-sidebar mobile (dublis po footeriu)',code:FIX,scope:'global',active:true,priority:10});
  try{id=JSON.parse(c.body).id;}catch(e){}
  L('FIX snippet id='+id+' http='+c.code);
  if(!id){L('fail '+c.body.slice(0,200));putText('_mff.txt',out);return;}
  execSync('sleep 3');
  const b=await chromium.launch({args:['--no-sandbox']});
  const m=await b.newContext({viewport:{width:390,height:844},isMobile:true,ignoreHTTPSErrors:true});
  const pg=await m.newPage();
  await pg.goto(BASE+'/kategorija/sunims/maistas-sunims/',{waitUntil:'domcontentloaded',timeout:60000});
  await pg.waitForTimeout(4500);
  // evaluate sidebar state
  const info=await pg.evaluate(()=>{
    const oc=document.querySelector('#shop-sidebar');
    const disp=oc?getComputedStyle(oc).display:'NONE-EL';
    const bodyChild=oc?(oc.parentElement===document.body):false;
    const visibleInFlow=oc?(disp!=='none' && oc.offsetHeight>0):false;
    return {exists:!!oc,disp,bodyChild,visibleInFlow,scrollH:document.body.scrollHeight};
  });
  L('SIDEBAR: '+JSON.stringify(info));
  putBinary('maistas_mobile_fixed.png', await pg.screenshot({fullPage:true})); L('shot full ok');
  // try open off-canvas
  let opened=false;
  try{
    const trig=await pg.$('[data-open="#shop-sidebar"]');
    if(trig){ await trig.click({force:true}); await pg.waitForTimeout(1500);
      const op=await pg.evaluate(()=>{const oc=document.querySelector('#shop-sidebar');const inMfp=oc&&oc.closest&&oc.closest('.mfp-content');const vis=oc&&oc.offsetHeight>0&&getComputedStyle(oc).display!=='none';return {inMfp:!!inMfp,vis};});
      L('AFTER CLICK: '+JSON.stringify(op)); opened=op.vis;
      putBinary('maistas_mobile_offcanvas.png', await pg.screenshot()); L('shot offcanvas ok');
    } else { L('no trigger found on mobile viewport'); }
  }catch(e){L('open test err '+e);}
  await m.close(); await b.close();
}catch(e){L('!!! '+e);}
finally{ putText('_mff.txt',out+'\nFIX_ID='+id); }
})();
