import { execSync } from 'child_process';
import fs from 'fs';

function putResult(name, obj) {
  const tok = process.env.GH_TOKEN;
  const path = `screenshots/${name}`;
  const url = `https://api.github.com/repos/raimis079-creator/petshop-bridge/contents/${path}`;
  let sha = '';
  try {
    const r = execSync(`curl -s -H "Authorization: Bearer ${tok}" "${url}"`).toString();
    const j = JSON.parse(r);
    if (j.sha) sha = j.sha;
  } catch(e) {}
  const content = Buffer.from(JSON.stringify(obj, null, 1)).toString('base64');
  fs.writeFileSync('/tmp/payload.json', JSON.stringify({ message: `result ${name}`, content, ...(sha ? { sha } : {}) }));
  execSync(`curl -s -X PUT -H "Authorization: Bearer ${tok}" -d @/tmp/payload.json "${url}"`);
}

const out = { ts: new Date().toISOString() };

function curlBody(u) {
  try { return execSync(`curl -sk --max-time 25 "${u}"`, {maxBuffer: 20*1024*1024}).toString(); }
  catch(e) { return 'ERR:' + (e.message||'').slice(0,200); }
}
function curlCode(u) {
  try { return execSync(`curl -sk -o /dev/null -w "%{http_code}" --max-time 25 "${u}"`).toString(); }
  catch(e) { return '000'; }
}

// 1. Ar plugin JS failai pasiekiami vieshai (tipines vietos)
const jsCandidates = [
  'https://dev.avesa.lt/wp-content/plugins/petshop-core/assets/pet-form.js',
  'https://dev.avesa.lt/wp-content/plugins/petshop-core/assets/pet-profile.js',
  'https://dev.avesa.lt/wp-content/plugins/petshop-core-m6/assets/pet-form.js',
  'https://dev.avesa.lt/wp-content/plugins/petshop-core-m6/assets/pet-profile.js',
];
out.js_files = {};
for (const u of jsCandidates) {
  const code = curlCode(u);
  out.js_files[u] = { code };
  if (code === '200') {
    const body = curlBody(u);
    out.js_files[u].bytes = body.length;
    out.js_files[u].head = body.slice(0, 400);
    out.js_files[u].has_mount = body.includes('PetshopPetForm');
    out.js_files[u].mounts_pspet_form = body.includes("getElementById('pspet-form')") || body.includes('getElementById("pspet-form")');
    out.js_files[u].has_sukurti = body.includes('Sukurti profil');
  }
}

// 2. MyAccount pet puslapio HTML (be login gausim redirect/login forma - fiksuojam kas matosi)
const acctUrls = [
  'https://dev.avesa.lt/my-account/mano-augintinis/',
  'https://dev.avesa.lt/my-account/',
];
out.pages = {};
for (const u of acctUrls) {
  const body = curlBody(u);
  out.pages[u] = {
    bytes: body.length,
    has_pspet_profile: body.includes('pspet-profile'),
    has_pspet_form: body.includes('pspet-form'),
    has_petform_js: body.includes('pet-form.js'),
    has_petprofile_js: body.includes('pet-profile.js'),
    has_login_form: body.includes('woocommerce-form-login'),
    title: (body.match(/<title>([^<]*)<\/title>/)||[])[1]||''
  };
}

// 3. Shortcode anketa - ar yra atskiras puslapis (tipiniai slugai)
const formPages = [
  'https://dev.avesa.lt/augintinio-anketa/',
  'https://dev.avesa.lt/mano-augintinis/',
  'https://dev.avesa.lt/anketa/',
];
for (const u of formPages) {
  const code = curlCode(u);
  out.pages[u] = { code };
  if (code === '200') {
    const body = curlBody(u);
    out.pages[u].bytes = body.length;
    out.pages[u].has_pspet_form = body.includes('pspet-form');
    out.pages[u].has_petform_js = body.includes('pet-form.js');
    out.pages[u].has_config = body.includes('pspetConfig') || body.includes('PSPET');
  }
}

// 4. REST endpointai (ar M8 REST registruotas)
const rest = curlBody('https://dev.avesa.lt/wp-json/');
try {
  const j = JSON.parse(rest);
  out.rest_namespaces = (j.namespaces||[]).filter(n => n.includes('pet') || n.includes('petshop') || n.includes('ps'));
} catch(e) { out.rest_namespaces = 'parse_err'; }

putResult('m8_recon_1.json', out);
console.log('DONE');
