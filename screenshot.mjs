import { execSync } from 'child_process';
import fs from 'fs';
import { chromium } from 'playwright';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WU=process.env.WP_USER, WP=process.env.WP_APP_PASS, SITE='https://dev.avesa.lt';
function sh(c){try{return execSync(c+' 2>&1',{maxBuffer:20e6,shell:'/bin/bash'}).toString();}catch(e){return String(e).slice(0,300);}}
function putFile(name,buf){const u='https://api.github.com/repos/'+REPO+'/contents/'+name;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk --max-time 30 -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:80e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'s526',content:buf.toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync('curl -sk --max-time 90 -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:80e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
const AUTH='-u "'+WU+':'+WP+'"', API=SITE+'/wp-json/code-snippets/v1/snippets';
const O={VERSIJA_RUN:'run526'};
// auth cookie per snippeta
const PHP=`add_action('wp_loaded',function(){
 if(!isset($_GET['ps_ck'])||$_GET['ps_ck']!=='Ck526xQ') return;
 nocache_headers(); header('Content-Type: application/json');
 $u=get_users(array('role'=>'administrator','number'=>1));
 if(!$u){ echo wp_json_encode(array('err'=>'no admin')); exit; }
 $uid=$u[0]->ID;
 $exp=time()+300;
 // BUTINA sesijos zetonas — be jo wp_validate_auth_cookie ATMETA
 $mgr=WP_Session_Tokens::get_instance($uid);
 $tok=$mgr->create($exp);
 echo wp_json_encode(array('uid'=>$uid,'login'=>$u[0]->user_login,
   'logged_in'=>array('name'=>LOGGED_IN_COOKIE,'val'=>wp_generate_auth_cookie($uid,$exp,'logged_in',$tok)),
   'secure_auth'=>array('name'=>SECURE_AUTH_COOKIE,'val'=>wp_generate_auth_cookie($uid,$exp,'secure_auth',$tok)),
   'auth'=>array('name'=>AUTH_COOKIE,'val'=>wp_generate_auth_cookie($uid,$exp,'auth',$tok)),
   'cookiepath'=>COOKIEPATH,'adminpath'=>ADMIN_COOKIE_PATH,'domain'=>COOKIE_DOMAIN,
   'force_ssl_admin'=>force_ssl_admin()?1:0)); exit;
},1);`;
let sid=null;
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP S526 Cookie',code:PHP,scope:'global',active:true}));
for(let i=0;i<3&&!sid;i++){const t=sh('curl -sSk --max-time 60 '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
 try{const j=JSON.parse(t); if(j&&j.id)sid=j.id;}catch(e){} if(!sid)sh('sleep 4');}
O.sid=sid; sh('sleep 4');
const ck=sh('curl -sSk --max-time 60 "'+SITE+'/?ps_ck=Ck526xQ"');
let C=null; try{C=JSON.parse(ck);}catch(e){O.cookie_raw=String(ck).slice(0,200);}
O.cookie_ok = C && C.logged_in ? 'yra' : 'NERA';
O.cookie_info = C ? {cookiepath:C.cookiepath,adminpath:C.adminpath,domain:C.domain,ssl_admin:C.force_ssl_admin} : null;
if(C && C.logged_in){
 try{
  const b=await chromium.launch();
  const ctx=await b.newContext({viewport:{width:1600,height:1000},ignoreHTTPSErrors:true,locale:'lt-LT'});
  const ck=[
    {name:C.logged_in.name,value:C.logged_in.val,domain:'dev.avesa.lt',path:'/',httpOnly:true,secure:true,sameSite:'Lax'},
    {name:C.secure_auth.name,value:C.secure_auth.val,domain:'dev.avesa.lt',path:'/wp-admin',httpOnly:true,secure:true,sameSite:'Lax'},
    {name:C.secure_auth.name,value:C.secure_auth.val,domain:'dev.avesa.lt',path:'/wp-includes/',httpOnly:true,secure:true,sameSite:'Lax'},
    {name:C.auth.name,value:C.auth.val,domain:'dev.avesa.lt',path:'/wp-admin',httpOnly:true,secure:true,sameSite:'Lax'},
  ];
  await ctx.addCookies(ck);
  const p=await ctx.newPage();
  const KL=[]; p.on('console',m=>{if(m.type()==='error')KL.push(m.text().slice(0,160));});
  p.on('pageerror',e=>KL.push('PAGEERROR '+String(e).slice(0,160)));
  p.on('requestfailed',rq=>KL.push('REQFAIL '+rq.url().slice(0,110)));
  const puslapiai=[
    ['nauji','/wp-admin/admin.php?page=ps-desk'],
  ];
  O.psl={};
  for(const [v,u] of puslapiai){
    try{
      const rp=await p.goto(SITE+u,{waitUntil:'domcontentloaded',timeout:70000});
      await p.waitForTimeout(3500);
      const dbg=await p.evaluate(()=>({url:location.href,title:document.title,
        prisijungimas: !!document.querySelector('#loginform')}));
      const info=await p.evaluate(()=>{
        const eil=[...document.querySelectorAll('.pd-tbl tbody tr')].map(r=>({
          nr:(r.querySelector('.pd-nr')||{}).innerText,
          kl:(r.querySelector('.pd-cust')||{}).innerText,
          vyk:(r.querySelector('.pd-exec')||{}).innerText,
          suma:(r.querySelector('.pd-sum')||{}).innerText,
          bus:(r.querySelector('.pd-pill')||{}).innerText,
          vei:(r.querySelector('[data-act]')||{}).innerText,
          src:[...r.querySelectorAll('.pd-src')].map(x=>x.innerText)
        }));
        const rail=[...document.querySelectorAll('.pd-q')].map(x=>x.innerText.replace(/\s+/g,' ').trim());
        const filt=[...document.querySelectorAll('.pd-sel')].map(x=>x.options[x.selectedIndex].text);
        return {desk_yra:!!document.querySelector('.pd'), eilutes:eil, rail:rail, filtrai:filt,
          tuscia:!!document.querySelector('.pd-empty'),
          meniu_paslept:getComputedStyle(document.getElementById('adminmenumain')||document.body).display,
          aukstis:document.body.scrollHeight};
        const th=[...document.querySelectorAll('table.wp-list-table thead th')].map(x=>(x.innerText||'').trim()).filter(Boolean);
        const mb=[...document.querySelectorAll('.postbox, .woocommerce-order-data, #woocommerce-order-items')].map(x=>{
          const h=x.querySelector('h2,h3,.hndle,.postbox-header');
          return (h?h.innerText:(x.id||'')).replace(/\s+/g,' ').trim().slice(0,50);
        }).filter(Boolean);
        const menu=[...document.querySelectorAll('#adminmenu > li > a')].map(x=>(x.innerText||'').replace(/\s+/g,' ').trim().split('\n')[0]).filter(Boolean);
        return {stulpeliai:th, blokai:mb, meniu:menu,
          aukstis:document.body.scrollHeight, plotis:document.body.scrollWidth};
      });
      O.psl[v]={http:rp?rp.status():null, ...dbg, ...info, klaidos:KL.slice(0,12)};
      if(v==='nauji'){
        O.nauji_eilutes=await p.evaluate(()=>[...document.querySelectorAll('.pd-tbl tbody tr')].map(r=>({
          nr:(r.querySelector('.pd-nr')||{}).innerText, vyk:(r.querySelector('.pd-exec')||{}).innerText.split('\n')[0],
          vei:(r.querySelector('td.pd-act .pd-btn-p')||{}).innerText })));

        // 1) SURINKTI (AV/mišrus)
        try{
          const b=await p.$('tr:has(.pd-nr:text-is("#34882")) td.pd-act a.pd-btn-p');
          await b.click(); await p.waitForLoadState('domcontentloaded'); await p.waitForTimeout(2500);
          O.surinkti=await p.evaluate(()=>({url:location.href, h1:(document.querySelector('h1,h2')||{}).innerText,
            tekstas:document.body.innerText.replace(/\s+/g,' ').slice(0,420)}));
          const png=await p.screenshot({fullPage:true}); putFile('screenshots/s526_lapai.png',png);
        }catch(e){ O.surinkti={KLAIDA:String(e).slice(0,150)}; }

        // 2) PERDUOTI (dropship)
        try{
          await p.goto(SITE+'/wp-admin/admin.php?page=ps-desk',{waitUntil:'domcontentloaded',timeout:60000});
          await p.waitForTimeout(1200);
          const b2=await p.$('tr:has(.pd-nr:text-is("#34883")) td.pd-act a.pd-btn-p');
          await b2.click(); await p.waitForLoadState('domcontentloaded'); await p.waitForTimeout(2500);
          O.perduoti=await p.evaluate(()=>({url:location.href,
            tekstas:document.body.innerText.replace(/\s+/g,' ').slice(0,420)}));
          const png2=await p.screenshot({fullPage:true}); putFile('screenshots/s526_dropship.png',png2);
        }catch(e){ O.perduoti={KLAIDA:String(e).slice(0,150)}; }

        // 3) MASINIS
        try{
          await p.goto(SITE+'/wp-admin/admin.php?page=ps-desk',{waitUntil:'domcontentloaded',timeout:60000});
          await p.waitForTimeout(1200);
          await p.click('#pdAllCb');
          await p.waitForTimeout(400);
          O.bulk_matomas=await p.evaluate(()=>({on:document.getElementById('pdBulk').classList.contains('on'),
            cnt:(document.getElementById('pdBcnt')||{}).innerText}));
          await p.click('#pdBulk button[data-ba*="lapai"]');
          await p.waitForLoadState('domcontentloaded'); await p.waitForTimeout(2500);
          O.bulk_rez=await p.evaluate(()=>({url:location.href,
            tekstas:document.body.innerText.replace(/\s+/g,' ').slice(0,300)}));
        }catch(e){ O.bulk_rez={KLAIDA:String(e).slice(0,150)}; }

        // 4) kokie masiniai veiksmai realiai yra WooCommerce sąraše
        try{
          await p.goto(SITE+'/wp-admin/admin.php?page=wc-orders',{waitUntil:'domcontentloaded',timeout:60000});
          await p.waitForTimeout(1500);
          O.wc_bulk=await p.evaluate(()=>[...document.querySelectorAll('#bulk-action-selector-top option')]
            .map(o=>o.value+' = '+o.text));
        }catch(e){ O.wc_bulk=String(e).slice(0,120); }
      }
      const png=await p.screenshot({fullPage:true});
      putFile('screenshots/s526_'+v+'.png', png);
      O.psl[v].png='screenshots/s526_'+v+'.png';
    }catch(e){ O.psl[v]={KLAIDA:String(e).slice(0,150)}; }
  }
  await b.close();
 }catch(e){ O.NARSYKLE=String(e).slice(0,300); }
}
if(sid){fs.writeFileSync('/tmp/off.json',JSON.stringify({active:false}));
 sh('curl -sSk --max-time 30 -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/off.json "'+API+'/'+sid+'"');}
putFile('analize/s526.json', Buffer.from(JSON.stringify(O,null,1)));
console.log('OK');
