import { execSync } from "child_process";
import fs from "fs";
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;for(let a=0;a<5;a++){try{const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'qa '+n,branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));const r=execSync('curl -s -w "\\nHTTP:%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8',maxBuffer:50000000});if(/HTTP:20[01]/.test(r))return true;}catch(e){}execSync('sleep 3');}return false;}
let out='';const L=s=>{out+=s+'\n';console.log(s);};
const BASE='https://dev.avesa.lt';
const UA='Mozilla/5.0 (recon)';
const BRANDS_CSV = Buffer.from('c2x1ZyxuYW1lLGNvdW50LGxpbmsKIjRkb2dzIiwiNERvZ3MiLDExLCIvZ2FtaW50b2phcy80ZG9ncy8iCiI4aW4xIiwiOElOMSIsMjEsIi9nYW1pbnRvamFzLzhpbjEvIgoiYWJha3VzIiwiQWJha3VzIiwwLCIvZ2FtaW50b2phcy9hYmFrdXMvIgoiYWQtYmkiLCJBZCBCaSIsMTIsIi9nYW1pbnRvamFzL2FkLWJpLyIKImFsZGEiLCJBTERBIiw1LCIvZ2FtaW50b2phcy9hbGRhLyIKImFtYnJvc2lhIiwiQW1icm9zaWEiLDE1LCIvZ2FtaW50b2phcy9hbWJyb3NpYS8iCiJhbmltb25kYSIsIkFuaW1vbmRhIiw2NCwiL2dhbWludG9qYXMvYW5pbW9uZGEvIgoiYW50b3MiLCJBTlRPUyIsMjEsIi9nYW1pbnRvamFzL2FudG9zLyIKImFudHktaW5zZWN0IiwiQU5UWSBJTlNFQ1QiLDAsIi9nYW1pbnRvamFzL2FudHktaW5zZWN0LyIKImFwb2xsbyIsIkFwb2xsbyIsMywiL2dhbWludG9qYXMvYXBvbGxvLyIKImFxdWFyaXMiLCJBcXVhcmlzIiw2LCIvZ2FtaW50b2phcy9hcXVhcmlzLyIKImJhcnJ5LWtpbmciLCJCYXJyeSBLaW5nIiwzLCIvZ2FtaW50b2phcy9iYXJyeS1raW5nLyIKImJhenlsIiwiQkFaWUwiLDMsIi9nYW1pbnRvamFzL2JhenlsLyIKImJlYXBoYXIiLCJCZWFwaGFyIiwwLCIvZ2FtaW50b2phcy9iZWFwaGFyLyIKImJlZXp0ZWVzIiwiQkVFWlRFRVMiLDQsIi9nYW1pbnRvamFzL2JlZXp0ZWVzLyIKImJlbG9jYXQiLCJCZWxvQ2F0Iiw2MSwiL2dhbWludG9qYXMvYmVsb2NhdC8iCiJiaW9rYXRzIiwiQmlva2F0J3MiLDEsIi9nYW1pbnRvamFzL2Jpb2thdHMvIgoiYmlvdmV0YSIsIkJJT1ZFVEEiLDUsIi9nYW1pbnRvamFzL2Jpb3ZldGEvIgoiYmlvdmV0ZXJpbmFyeSIsImJpb1ZFVEVSSU5BUlkiLDYsIi9nYW1pbnRvamFzL2Jpb3ZldGVyaW5hcnkvIgoiYm9nYXIiLCJCT0dBUiIsMCwiL2dhbWludG9qYXMvYm9nYXIvIgoiYm9uLWFwcGV0aXQiLCJCb24gQXBwZXRpdCIsMSwiL2dhbWludG9qYXMvYm9uLWFwcGV0aXQvIgoiYm9zY2giLCJCb3NjaCIsMSwiL2dhbWludG9qYXMvYm9zY2gvIgoiYnVsdCIsIkJ1bHQiLDAsIi9nYW1pbnRvamFzL2J1bHQvIgoiY2FuZGlvbGkiLCJDQU5ESU9MSSIsMTYsIi9nYW1pbnRvamFzL2NhbmRpb2xpLyIKImNhdHNfYmVzdCIsIkNBVCdTX0JFU1QiLDExLCIvZ2FtaW50b2phcy9jYXRzX2Jlc3QvIgoiY2F0ZXNzeSIsIkNhdGVzc3kiLDAsIi9nYW1pbnRvamFzL2NhdGVzc3kvIgoiY2F0aXQiLCJDYXRpdCIsOCwiL2dhbWludG9qYXMvY2F0aXQvIgoiY2F6byIsIkNBWk8iLDQsIi9nYW1pbnRvamFzL2Nhem8vIgoiY2hhbXAtcmljaGVyIiwiQ0hBTVAgUklDSEVSIiwyLCIvZ2FtaW50b2phcy9jaGFtcC1yaWNoZXIvIgoiY2hld2xsYWdlbiIsIkNoZXdsbGFnZW4iLDIxLCIvZ2FtaW50b2phcy9jaGV3bGxhZ2VuLyIKImNoaXBzaSIsIkNISVBTSSIsMiwiL2dhbWludG9qYXMvY2hpcHNpLyIKImNodWNraXQiLCJDaHVja2l0ISIsMiwiL2dhbWludG9qYXMvY2h1Y2tpdC8iCiJjaHVydSIsIkNodXJ1Iiw2NCwiL2dhbWludG9qYXMvY2h1cnUvIgoiY2lhbyIsIkNJQU8iLDUsIi9nYW1pbnRvamFzL2NpYW8vIgoiY29tZnkiLCJDT01GWSIsMzksIi9nYW1pbnRvamFzL2NvbWZ5LyIKImNvb2Nrb28iLCJDb29ja29vIiwyNCwiL2dhbWludG9qYXMvY29vY2tvby8iCiJjb3N5Y2F0IiwiQ09TWUNBVCIsMiwiL2dhbWludG9qYXMvY29zeWNhdC8iCiJjb3N5cGV0IiwiQ09TWVBFVCIsMSwiL2dhbWludG9qYXMvY29zeXBldC8iCiJkZWxpLW5hdHVyZSIsIkRlbGkgTmF0dXJlIiwxNiwiL2dhbWludG9qYXMvZGVsaS1uYXR1cmUvIgoiZGluZ28iLCJEaW5nbyIsMTMsIi9nYW1pbnRvamFzL2RpbmdvLyIKImRvZy1mYW50YXN5IiwiRG9nIEZhbnRhc3kiLDMsIi9nYW1pbnRvamFzL2RvZy1mYW50YXN5LyIKImRvZ2d5ZWJhZyIsIkRvZ2d5ZUJhZyIsMSwiL2dhbWludG9qYXMvZG9nZ3llYmFnLyIKImRvZ290ZWthIiwiRG9nb3Rla2EiLDE5LCIvZ2FtaW50b2phcy9kb2dvdGVrYS8iCiJkb2xpbmEtbm90ZWNpIiwiRG9saW5hIE5vdGVjaSIsNSwiL2dhbWludG9qYXMvZG9saW5hLW5vdGVjaS8iCiJkcmFrb25hcGUiLCJEUkFLT05BUEUiLDEsIi9nYW1pbnRvamFzL2RyYWtvbmFwZS8iCiJkdXZvIiwiRHV2bysiLDQ3LCIvZ2FtaW50b2phcy9kdXZvLyIKImVjb21meSIsIkVDT01GWSIsMTMsIi9nYW1pbnRvamFzL2Vjb21meS8iCiJldWthbnViYSIsIkV1a2FudWJhIiwzNywiL2dhbWludG9qYXMvZXVrYW51YmEvIgoiZXhjbHVzaW9uIiwiRXhjbHVzaW9uIiw3OCwiL2dhbWludG9qYXMvZXhjbHVzaW9uLyIKImV4cGVydHVzIiwiRVhQRVJUVVMiLDQsIi9nYW1pbnRvamFzL2V4cGVydHVzLyIKImZhbWlseS1jYXQiLCJGYW1pbHkgQ2F0Iiw1LCIvZ2FtaW50b2phcy9mYW1pbHktY2F0LyIKImZhbWlseS1kb2ciLCJGYW1pbHkgRG9nIiw3LCIvZ2FtaW50b2phcy9mYW1pbHktZG9nLyIKImZhcm1pbmEiLCJGYXJtaW5hIiwxNTUsIi9nYW1pbnRvamFzL2Zhcm1pbmEvIgoiZmluZS1kb2ciLCJGaW5lIERvZyIsMCwiL2dhbWludG9qYXMvZmluZS1kb2cvIgoiZmxleGkiLCJGTEVYSSIsNjYsIi9nYW1pbnRvamFzL2ZsZXhpLyIKImZyZW5kaSIsIkZyZW5kaSIsOCwiL2dhbWludG9qYXMvZnJlbmRpLyIKImZ1cm1pbmF0b3IiLCJGVVJNSU5BVE9SIiwyOSwiL2dhbWludG9qYXMvZnVybWluYXRvci8iCiJnZW1vbiIsIkdlbW9uIiwxNywiL2dhbWludG9qYXMvZ2Vtb24vIgoiZ2VuaWEiLCJHRU5JQSIsOCwiL2dhbWludG9qYXMvZ2VuaWEvIgoiZ2VvcnBsYXN0IiwiR2VvcnBsYXN0Iiw2OSwiL2dhbWludG9qYXMvZ2VvcnBsYXN0LyIKImdpZ2kiLCJHSUdJIiwxNCwiL2dhbWludG9qYXMvZ2lnaS8iCiJnaW1ib3JuIiwiR2ltYm9ybiIsMiwiL2dhbWludG9qYXMvZ2ltYm9ybi8iCiJnaW1jYXQiLCJHaW1DYXQiLDM2LCIvZ2FtaW50b2phcy9naW1jYXQvIgoiZ2ltZG9nIiwiR2ltRG9nIiw3LCIvZ2FtaW50b2phcy9naW1kb2cvIgoiZ25hdGVrIiwiR25hdGVrIiwyOSwiL2dhbWludG9qYXMvZ25hdGVrLyIKImdyZWVuLXBldGZvb2QiLCJHcmVlbiBQZXRmb29kIiwzLCIvZ2FtaW50b2phcy9ncmVlbi1wZXRmb29kLyIKImdyZWVucGV0Zm9vZCIsIkdyZWVuUGV0Rm9vZCIsOCwiL2dhbWludG9qYXMvZ3JlZW5wZXRmb29kLyIKImhhcCIsIkhBUCIsMTQsIi9nYW1pbnRvamFzL2hhcC8iCiJoYXBwZXQiLCJIQVBQRVQiLDUyLCIvZ2FtaW50b2phcy9oYXBwZXQvIgoiaGF1bWlhdSIsIkhhdSZhbXA7TWlhdSIsMjUsIi9nYW1pbnRvamFzL2hhdW1pYXUvIgoiaGlrYXJpIiwiSGlrYXJpIiw0MCwiL2dhbWludG9qYXMvaGlrYXJpLyIKImlhbXMiLCJJQU1TIiw1LCIvZ2FtaW50b2phcy9pYW1zLyIKImpvZXNfY2F0IiwiSk9FJ1NfQ0FUIiwyLCIvZ2FtaW50b2phcy9qb2VzX2NhdC8iCiJqb3NlcmEiLCJKb3NlcmEiLDIxNiwiL2dhbWludG9qYXMvam9zZXJhLyIKImstOSIsIkstOSIsMTEsIi9nYW1pbnRvamFzL2stOS8iCiJrOSIsIks5IiwwLCIvZ2FtaW50b2phcy9rOS8iCiJrYXJvby13aWxkIiwiS0FST08gV0lMRCIsMywiL2dhbWludG9qYXMva2Fyb28td2lsZC8iCiJrYXRyaW5leCIsIkthdHJpbmV4IiwxLCIvZ2FtaW50b2phcy9rYXRyaW5leC8iCiJsYW5kLWZsZWlzY2giLCJMQU5EIEZMRUlTQ0giLDIwLCIvZ2FtaW50b2phcy9sYW5kLWZsZWlzY2gvIgoibGVjaGF0IiwiTGVjaGF0IiwwLCIvZ2FtaW50b2phcy9sZWNoYXQvIgoibGVzc2llLWxhbmQiLCJMZXNzaWUgTGFuZCIsMSwiL2dhbWludG9qYXMvbGVzc2llLWxhbmQvIgoibGl0dGxlLW9uZSIsIkxJVFRMRSBPTkUiLDI0LCIvZ2FtaW50b2phcy9saXR0bGUtb25lLyIKImx1cGktcGV0cyIsIkx1cGktcGV0cyIsMCwiL2dhbWludG9qYXMvbHVwaS1wZXRzLyIKIm1hZ2ljLWNhdCIsIk1hZ2ljIENhdCIsMCwiL2dhbWludG9qYXMvbWFnaWMtY2F0LyIKIm1hdHRlbyIsIk1hdHRlbyIsMywiL2dhbWludG9qYXMvbWF0dGVvLyIKIm1lcnZ1ZSIsIk1FUlZVRSIsMTEsIi9nYW1pbnRvamFzL21lcnZ1ZS8iCiJtaWFtb3IiLCJNaWFtb3IiLDMzLCIvZ2FtaW50b2phcy9taWFtb3IvIgoibW9uZ2UiLCJNb25nZSIsMTE5LCIvZ2FtaW50b2phcy9tb25nZS8iCiJtcHMiLCJNUFMiLDcsIi9nYW1pbnRvamFzL21wcy8iCiJuYXR1cmVzLW1pciIsIk5BVFVSRSdTIE1JUiIsMTAsIi9nYW1pbnRvamFzL25hdHVyZXMtbWlyLyIKIm5pbmEtb3R0b3Nzb24iLCJOaW5hIE90dG9zc29uIiw3LCIvZ2FtaW50b2phcy9uaW5hLW90dG9zc29uLyIKIm5vYmJ5IiwiTm9iYnkiLDgwLCIvZ2FtaW50b2phcy9ub2JieS8iCiJub2JsZXphIiwiTk9CTEVaQSIsNjcsIi9nYW1pbnRvamFzL25vYmxlemEvIgoib25lLXdpc2giLCJPbmUgV2lzaCIsMywiL2dhbWludG9qYXMvb25lLXdpc2gvIgoib250YXJpbyIsIk9udGFyaW8iLDU2LCIvZ2FtaW50b2phcy9vbnRhcmlvLyIKInBlc3MiLCJQZXNzIiw2LCIvZ2FtaW50b2phcy9wZXNzLyIKInBldC1ub3ZhIiwiUEVUIE5PVkEiLDgsIi9nYW1pbnRvamFzL3BldC1ub3ZhLyIKInBldHNob3AtbHQiLCJQZXRzaG9wLmx0IiwxLCIvZ2FtaW50b2phcy9wZXRzaG9wLWx0LyIKInByaW5zIiwiUHJpbnMiLDIzLCIvZ2FtaW50b2phcy9wcmlucy8iCiJwcm8tbnV0cml0aW9uIiwiUHJvLU51dHJpdGlvbiIsMCwiL2dhbWludG9qYXMvcHJvLW51dHJpdGlvbi8iCiJwdXJpbmEiLCJQdXJpbmEiLDAsIi9nYW1pbnRvamFzL3B1cmluYS8iCiJxdWF0dHJvIiwiUXVhdHRybyIsNjQsIi9nYW1pbnRvamFzL3F1YXR0cm8vIgoicmFzY28iLCJSYXNjbyIsMTEsIi9nYW1pbnRvamFzL3Jhc2NvLyIKInJlYWwtZG9nIiwiUmVhbCBEb2ciLDIxLCIvZ2FtaW50b2phcy9yZWFsLWRvZy8iCiJyb21hciIsIlJvbWFyIiwyNywiL2dhbWludG9qYXMvcm9tYXIvIgoicm95YWwtY2FuaW4iLCJSb3lhbCBDYW5pbiIsMjUsIi9nYW1pbnRvamFzL3JveWFsLWNhbmluLyIKInNhbnRvdml0YSIsIlNBTlRPVklUQSIsMiwiL2dhbWludG9qYXMvc2FudG92aXRhLyIKInNlZWN1cml0eSIsIlNFRUNVUklUWSIsMTAsIi9nYW1pbnRvamFzL3NlZWN1cml0eS8iCiJzaGlueWNhdCIsIlNoaW55Q2F0IiwxLCIvZ2FtaW50b2phcy9zaGlueWNhdC8iCiJzaW1iYSIsIlNpbWJhIiwwLCIvZ2FtaW50b2phcy9zaW1iYS8iCiJzbWFydC1ib25lcyIsIlNNQVJUIEJPTkVTIiwxMywiL2dhbWludG9qYXMvc21hcnQtYm9uZXMvIgoic3VtLXBsYXN0IiwiU3VtLVBsYXN0IiwzNiwiL2dhbWludG9qYXMvc3VtLXBsYXN0LyIKInN1cGVyLWJlbmVrIiwiU3VwZXIgQmVuZWsiLDE1LCIvZ2FtaW50b2phcy9zdXBlci1iZW5lay8iCiJ0cml4aWUiLCJUcml4aWUiLDI3NiwiL2dhbWludG9qYXMvdHJpeGllLyIKInRydWx5IiwiVFJVTFkiLDE1LCIvZ2FtaW50b2phcy90cnVseS8iCiJ2ZXRvY2FuaXMiLCJWZXRvY2FuaXMiLDEyLCIvZ2FtaW50b2phcy92ZXRvY2FuaXMvIgoidmV0b3F1aW5vbCIsIlZFVE9RVUlOT0wiLDEwLCIvZ2FtaW50b2phcy92ZXRvcXVpbm9sLyIKInZpdGFwb2wiLCJWaXRhcG9sIiw1LCIvZ2FtaW50b2phcy92aXRhcG9sLyIKIndhbnB5IiwiV0FOUFkiLDE4LCIvZ2FtaW50b2phcy93YW5weS8iCiJ5YXJybyIsIllhcnJvIiw0LCIvZ2FtaW50b2phcy95YXJyby8iCiJ6aWFybmtvIiwiWmlhcm5rbyIsMywiL2dhbWludG9qYXMvemlhcm5rby8iCiJ6b2x1eCIsIlpvbHV4IiwxNSwiL2dhbWludG9qYXMvem9sdXgvIgoK','base64').toString('utf8');
function sh(c){try{return execSync(c,{encoding:'utf8',maxBuffer:30000000});}catch(e){return (e.stdout||'')+'[ERR]';}}

// HEAD be redirect sekimo
function head(p){
  const cmd='curl -s -k -I -A "'+UA+'" -o /tmp/h.txt -w "%{http_code}" "'+BASE+p+'"';
  const code=sh(cmd).trim();
  let hdr='';try{hdr=fs.readFileSync('/tmp/h.txt','utf8');}catch(e){}
  const loc=(hdr.match(/^location:\s*([^\r\n]+)/im)||[])[1]||'';
  const xrb=(hdr.match(/^x-redirect-by:\s*([^\r\n]+)/im)||[])[1]||'';
  return {code, loc:loc.trim(), xrb:xrb.trim()};
}
// Seka redirect chain iki 5 hop
function chain(p, maxHop=5){
  const hops=[];
  let cur=p; let last=null;
  for(let i=0;i<maxHop;i++){
    const h=head(cur);
    hops.push({url:cur, ...h});
    last=h;
    if(!/^30[1278]$/.test(h.code) || !h.loc) break;
    // reliatyvus vs absoliutus
    cur=h.loc.startsWith('http')? h.loc.replace(BASE,'') : h.loc;
    if(!cur.startsWith('/')) break;
  }
  return {hops, final: hops[hops.length-1]};
}

(async ()=>{
  const R={};
  try {
    // 1. skaitau brand terms
    const csv=BRANDS_CSV.split('\n').filter(Boolean);
    const header=csv.shift();
    const brands=csv.map(r=>{
      const m=r.match(/^"([^"]*)","([^"]*)","?([0-9]+)"?,"([^"]*)"$/);
      return m?{slug:m[1],name:m[2],count:+m[3],link:m[4]}:null;
    }).filter(Boolean);
    L('brands loaded: '+brands.length);

    const findings=[];
    let done=0;
    for(const b of brands){
      // Trys variantai kiekvienam brand'ui
      const variants=['/'+b.slug, '/'+b.slug+'/', '/gamintojas/'+b.slug+'/'];
      const results={};
      for(const v of variants){
        results[v]=chain(v);
      }

      // Analize: 6-toji QA salyga
      // BLOGAI: /{slug} arba /{slug}/ -> 200/301 kur galutinis tiketinas /gamintojas/{slug}/, bet finish yra /product/... ir x-redirect-by=WordPress
      const bareResults=[results['/'+b.slug], results['/'+b.slug+'/']];
      for(const idx of [0,1]){
        const path=['/'+b.slug,'/'+b.slug+'/'][idx];
        const c=bareResults[idx];
        const finalUrl=c.final.url;
        const firstXrb=c.hops[0].xrb;
        const firstCode=c.hops[0].code;
        const finalCode=c.final.code;
        const isProductRedirect=/^\/product\//.test(finalUrl);
        const targetIsBrand=/^\/gamintojas\//.test(finalUrl);
        const brandArchiveOK=(results['/gamintojas/'+b.slug+'/'].final.code==='200');

        // Melagingas praejimas: WP spejimas -> produktas, o brand archyvas egzistuoja
        if(firstXrb==='WordPress' && isProductRedirect && brandArchiveOK && b.count>0){
          findings.push({
            severity:'HIGH',
            brand:b.slug, name:b.name, count:b.count,
            checked_url:path,
            first_hop:{code:firstCode, xrb:firstXrb},
            final_url:finalUrl,
            expected:'/gamintojas/'+b.slug+'/',
            reason:'x-redirect-by:WordPress spejimas i produkta, brand archyvas egzistuoja'
          });
        }
        // Melagingas praejimas: WP spejimas i BET KOKI kita puslapi (ne brand archyva, ne 404)
        else if(firstXrb==='WordPress' && !targetIsBrand && finalCode==='200' && brandArchiveOK && b.count>0){
          findings.push({
            severity:'MEDIUM',
            brand:b.slug, name:b.name, count:b.count,
            checked_url:path,
            first_hop:{code:firstCode, xrb:firstXrb},
            final_url:finalUrl,
            expected:'/gamintojas/'+b.slug+'/',
            reason:'WP redirect_canonical spejimas i ne-brand puslapi'
          });
        }
        // 200 be redirect - taip pat problema (WP spejo, kad {slug} = kazkokia egzistuojanti kategorija ar puslapis)
        else if(firstCode==='200' && !targetIsBrand && brandArchiveOK && b.count>0){
          findings.push({
            severity:'LOW',
            brand:b.slug, name:b.name, count:b.count,
            checked_url:path,
            first_hop:{code:firstCode, xrb:firstXrb||'nera'},
            final_url:finalUrl,
            expected:'/gamintojas/'+b.slug+'/',
            reason:'200 be redirect - {slug} sutampa su egzistuojanciu URL (page/kategorija)'
          });
        }
      }
      done++;
      if(done%20===0) L('progresas: '+done+'/'+brands.length);
    }

    // Suvestine
    const by={HIGH:0,MEDIUM:0,LOW:0};
    for(const f of findings) by[f.severity]++;
    L('=== SUVESTINE ===');
    L('  HIGH   (WP -> produktas, kai yra brand): '+by.HIGH);
    L('  MEDIUM (WP -> ne-brand): '+by.MEDIUM);
    L('  LOW    (200 be redirect, ne brand):     '+by.LOW);
    L('=== HIGH detales (max 15) ===');
    findings.filter(f=>f.severity==='HIGH').slice(0,15).forEach(f=>L('  ['+f.checked_url+'] -> '+f.final_url+' | brand='+f.brand+' count='+f.count+' | tiketa: '+f.expected));
    L('=== MEDIUM detales (max 10) ===');
    findings.filter(f=>f.severity==='MEDIUM').slice(0,10).forEach(f=>L('  ['+f.checked_url+'] -> '+f.final_url+' | brand='+f.brand));
    L('=== LOW detales (max 10) ===');
    findings.filter(f=>f.severity==='LOW').slice(0,10).forEach(f=>L('  ['+f.checked_url+'] -> '+f.final_url+' | brand='+f.brand));

    R.brands_checked=brands.length;
    R.findings=findings;
    R.by_severity=by;
    L('DONE');
  } catch (e) { L('!!! '+(e&&e.stack?e.stack:String(e))); }
  finally {
    putText('exclusion_qa_scan.json', JSON.stringify(R, null, 2));
    putText('_qa_log.txt', out);
  }
})();
