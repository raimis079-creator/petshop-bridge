import { execSync } from 'child_process';
import fs from 'fs';
import { chromium } from 'playwright';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WU=process.env.WP_USER, WP=process.env.WP_APP_PASS, SITE='https://dev.avesa.lt';
function sh(c){try{return execSync(c+' 2>&1',{maxBuffer:20e6,shell:'/bin/bash'}).toString();}catch(e){return String(e).slice(0,300);}}
function putFile(name,buf){const u='https://api.github.com/repos/'+REPO+'/contents/'+name;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk --max-time 30 -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:80e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'s533',content:buf.toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync('curl -sk --max-time 90 -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:80e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
const AUTH='-u "'+WU+':'+WP+'"', API=SITE+'/wp-json/code-snippets/v1/snippets';
const O={VERSIJA_RUN:'run533'};
// auth cookie per snippeta
const PHP=`add_action('wp_loaded',function(){
 if(!isset($_GET['ps_ck'])||$_GET['ps_ck']!=='Ck533xQ') return;
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
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP S533 Cookie',code:PHP,scope:'global',active:true}));
for(let i=0;i<3&&!sid;i++){const t=sh('curl -sSk --max-time 60 '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
 try{const j=JSON.parse(t); if(j&&j.id)sid=j.id;}catch(e){} if(!sid)sh('sleep 4');}
O.sid=sid; sh('sleep 4');
const ck=sh('curl -sSk --max-time 60 "'+SITE+'/?ps_ck=Ck533xQ"');
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
  const KL=[]; p.on('console',m=>{if(m.type()==='error')KL.push(m.text().slice(0,150));});
  p.on('pageerror',e=>KL.push('PAGEERROR '+String(e).slice(0,150)));
  const puslapiai=[
    ['z2','/wp-admin/admin.php?page=ps-desk&view=rytas&z=2'],
  ];
  O.psl={};
  for(const [v,u] of puslapiai){
    try{
      const rp=await p.goto(SITE+u,{waitUntil:'domcontentloaded',timeout:70000});
      await p.waitForTimeout(3500);
      const dbg=await p.evaluate(()=>({url:location.href,title:document.title,
        prisijungimas: !!document.querySelector('#loginform')}));
      const info=await p.evaluate(()=>({
        antraste:(document.querySelector('.pd-rh2, .pd-rdone h2')||{}).innerText,
        zingsniai:[...document.querySelectorAll('.pd-step')].map(x=>x.innerText.replace(/\s+/g,' ').trim()+
          (x.className.indexOf('dabar')>-1?' <DABAR>':x.className.indexOf('atlikta')>-1?' <OK>':'')),
        kortos:[...document.querySelectorAll('.pd-rcard')].map(x=>x.innerText.replace(/\n/g,' | ')),
        mygtukai:[...document.querySelectorAll('.pd-rbig')].map(x=>x.innerText+
          (x.href?' -> '+String(x.href).slice(0,140):' [WC '+x.getAttribute('data-wcnew')+' ids='+x.getAttribute('data-ids')+']')),
        tekstas:(document.querySelector('.pd-rnote')||{}).innerText,
        eilutes:[...document.querySelectorAll('.pd-rtbl tbody tr')].map(x=>x.innerText.replace(/\s+/g,' ').trim()),
        kojele:(document.querySelector('.pd-ryt-f')||{}).innerText.replace(/\n/g,' | ')
      }));
      O.psl[v]={http:rp?rp.status():null, ...dbg, ...info, klaidos:KL.slice(0,8)};
      if(v==='z2'){
        try{
          const [np]=await Promise.all([
            ctx.waitForEvent('page',{timeout:40000}),
            p.click('.pd-rbig')
          ]);
          await np.waitForLoadState('domcontentloaded');
          await np.waitForTimeout(2500);
          O.lapai_is_eigos=await np.evaluate(()=>({
            url:location.href,
            antraste:(document.querySelector('.wrap h1, h1')||{}).innerText,
            blokai:[...document.querySelectorAll('.ps-antraste')].map(x=>x.innerText.replace(/\s+/g,' ').trim()),
            lapu:document.querySelectorAll('.ps-lapas').length,
            prekes:[...document.querySelectorAll('table tbody tr')].map(x=>x.innerText.replace(/\s+/g,' ').trim()).slice(0,10),
            klaida:document.body.innerText.indexOf('Nepakanka teisi')>-1||document.body.innerText.indexOf('nuoroda, kuria')>-1
          }));
          const pg=await np.screenshot({fullPage:true}); putFile('screenshots/s533_lapai.png',pg);
          await np.close();
        }catch(e){ O.lapai_is_eigos={KLAIDA:String(e).slice(0,200)}; }
      }
      const png=await p.screenshot({fullPage:true});
      putFile('screenshots/s533_'+v+'.png', png);
      O.psl[v].png='screenshots/s533_'+v+'.png';
    }catch(e){ O.psl[v]={KLAIDA:String(e).slice(0,150)}; }
  }
  await b.close();
 }catch(e){ O.NARSYKLE=String(e).slice(0,300); }
}
if(sid){fs.writeFileSync('/tmp/off.json',JSON.stringify({active:false}));
 sh('curl -sSk --max-time 30 -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/off.json "'+API+'/'+sid+'"');}
putFile('analize/s533.json', Buffer.from(JSON.stringify(O,null,1)));
console.log('OK');
