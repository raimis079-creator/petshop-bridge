import { execSync } from "child_process";
import fs from "fs";

function putText(n, s) {
  const repo = process.env.GH_REPO, tok = process.env.GH_TOKEN;
  for (let a = 0; a < 5; a++) {
    try {
      const url = 'https://api.github.com/repos/' + repo + '/contents/analize/' + n;
      let sha = '';
      try { sha = JSON.parse(execSync('curl -s -H "Authorization: Bearer ' + tok + '" "' + url + '?ref=main&t=' + Date.now() + '"', { encoding: 'utf8' })).sha || ''; } catch (e) {}
      const b = { message: 'c ' + n, branch: 'main', content: Buffer.from(s, 'utf8').toString('base64') };
      if (sha) b.sha = sha;
      fs.writeFileSync('/tmp/pf.json', JSON.stringify(b));
      const r = execSync('curl -s -w "\\nHTTP:%{http_code}" -X PUT -H "Authorization: Bearer ' + tok + '" -d @/tmp/pf.json "' + url + '"', { encoding: 'utf8', maxBuffer: 50000000 });
      if (/HTTP:20[01]/.test(r)) return true;
    } catch (e) {}
    execSync('sleep 3');
  }
  return false;
}
let out = ''; const L = s => { out += s + '\n'; console.log(s); };
const BASE = 'https://dev.avesa.lt';
const U = process.env.WP_USER || '';
const P = (process.env.WP_APP_PASS || '').replace(/\s+/g, '');

// PHP kodas (base64) - dekoduojam
const PHP_B64 = "LyoqCiAqIFBldHNob3AgQ29tcGxpYW56IE1vYmlsZSBCYXJpcyB2MSAoc3RpY2t5IGp1b3N0YSkKICogRFJZOiAgIC8/cHNfY21wbHpfbW9iaWxlPTEmdG9rZW49Y21wbHpfNjY4MGFhMmE0MjE1MWQ1NGZhOGQ2NGVjCiAqIEFQUExZOiAvP3BzX2NtcGx6X21vYmlsZT0xJnRva2VuPWNtcGx6XzY2ODBhYTJhNDIxNTFkNTRmYThkNjRlYyZjb25maXJtPUFQUExZX01PQklMRQogKi8KaWYgKCAhIGRlZmluZWQoICdBQlNQQVRIJyApICkgeyByZXR1cm47IH0KCmFkZF9hY3Rpb24oICd3cF9sb2FkZWQnLCBmdW5jdGlvbiAoKSB7CglpZiAoICEgaXNzZXQoICRfR0VUWydwc19jbXBsel9tb2JpbGUnXSApICkgeyByZXR1cm47IH0KCSR0b2tlbiA9IGlzc2V0KCAkX0dFVFsndG9rZW4nXSApID8gc2FuaXRpemVfdGV4dF9maWVsZCggd3BfdW5zbGFzaCggJF9HRVRbJ3Rva2VuJ10gKSApIDogJyc7CglpZiAoICR0b2tlbiAhPT0gJ2NtcGx6XzY2ODBhYTJhNDIxNTFkNTRmYThkNjRlYycgKSB7IHJldHVybjsgfQoKCWdsb2JhbCAkd3BkYjsKCSR0YmwgPSAkd3BkYi0+cHJlZml4IC4gJ2NtcGx6X2Nvb2tpZWJhbm5lcnMnOwoJJHJvdyA9ICR3cGRiLT5nZXRfcm93KCAiU0VMRUNUICogRlJPTSAkdGJsIFdIRVJFIElEID0gMSIsIEFSUkFZX0EgKTsKCWlmICggISAkcm93ICkgeyB3cF9zZW5kX2pzb24oIGFycmF5KCAnZXJyb3InID0+ICdiYW5uZXIgSUQ9MSBuZXJhc3RhcycgKSApOyB9CgoJJGNzcyA9IDw8PCdDU1MnCi8qID09PT09IFBFVFNIT1AgQ09NUExJQU5aIEJBTk5FUiBDU1MgdjIgKGRlc2t0b3AgbXlndHVrdSBlaWx1dGUgKyBtb2JpbGUgc3RpY2t5IGp1b3N0YSkgPT09PT0gKi8KCi8qIC0tLSBEZXNrdG9wOiAzIG15Z3R1a2FpIHZpZW5vamUgZWlsdXRlamUgKGlzc2F1Z290YSBpcyBsYXlvdXRfZml4KSAtLS0gKi8KLmNtcGx6LWNvb2tpZWJhbm5lciAuY21wbHotYnV0dG9ucyB7CglkaXNwbGF5OiBmbGV4ICFpbXBvcnRhbnQ7CglmbGV4LWRpcmVjdGlvbjogcm93ICFpbXBvcnRhbnQ7CglmbGV4LXdyYXA6IG5vd3JhcCAhaW1wb3J0YW50OwoJZ2FwOiA4cHggIWltcG9ydGFudDsKCXdpZHRoOiAxMDAlICFpbXBvcnRhbnQ7CglvdmVyZmxvdy14OiBoaWRkZW4gIWltcG9ydGFudDsKfQouY21wbHotY29va2llYmFubmVyIC5jbXBsei1idXR0b25zIC5jbXBsei1idG4gewoJZmxleDogMSAxIDAgIWltcG9ydGFudDsKCXdpZHRoOiBhdXRvICFpbXBvcnRhbnQ7CgltaW4td2lkdGg6IDAgIWltcG9ydGFudDsKCW1heC13aWR0aDogbm9uZSAhaW1wb3J0YW50OwoJd2hpdGUtc3BhY2U6IG5vd3JhcCAhaW1wb3J0YW50OwoJcGFkZGluZy1sZWZ0OiAxMHB4ICFpbXBvcnRhbnQ7CglwYWRkaW5nLXJpZ2h0OiAxMHB4ICFpbXBvcnRhbnQ7Cglmb250LXNpemU6IDEzcHggIWltcG9ydGFudDsKCXRleHQtb3ZlcmZsb3c6IGVsbGlwc2lzOwoJb3ZlcmZsb3c6IGhpZGRlbjsKfQouY21wbHotY29va2llYmFubmVyLAouY21wbHotY29va2llYmFubmVyIC5jbXBsei1ib2R5LAouY21wbHotY29va2llYmFubmVyIC5jbXBsei1oZWFkZXIgewoJb3ZlcmZsb3cteDogaGlkZGVuICFpbXBvcnRhbnQ7Cn0KCi8qIC0tLSBNb2JpbGUgPD03NjhweDoga29tcGFrdGlza2Egc3RpY2t5IGp1b3N0YSBhcGFjaW9qZSwgbmVkZW5naWEgdHVyaW5pbyAtLS0gKi8KQG1lZGlhIChtYXgtd2lkdGg6IDc2OHB4KSB7CgkjY21wbHotY29va2llYmFubmVyLWNvbnRhaW5lciAuY21wbHotY29va2llYmFubmVyLAoJLmNtcGx6LWNvb2tpZWJhbm5lci5jbXBsei1ib3R0b20tcmlnaHQgewoJCWxlZnQ6IDAgIWltcG9ydGFudDsKCQlyaWdodDogMCAhaW1wb3J0YW50OwoJCWJvdHRvbTogMCAhaW1wb3J0YW50OwoJCXRvcDogYXV0byAhaW1wb3J0YW50OwoJCXdpZHRoOiAxMDAlICFpbXBvcnRhbnQ7CgkJbWF4LXdpZHRoOiAxMDAlICFpbXBvcnRhbnQ7CgkJbWFyZ2luOiAwICFpbXBvcnRhbnQ7CgkJYm9yZGVyLXJhZGl1czogMTRweCAxNHB4IDAgMCAhaW1wb3J0YW50OwoJCW1heC1oZWlnaHQ6IDQydmggIWltcG9ydGFudDsKCQlvdmVyZmxvdy15OiBhdXRvICFpbXBvcnRhbnQ7CgkJcGFkZGluZzogMTBweCAxNHB4IDEycHggIWltcG9ydGFudDsKCQlib3gtc2hhZG93OiAwIC0zcHggMTZweCByZ2JhKDAsMCwwLC4xOCkgIWltcG9ydGFudDsKCX0KCS5jbXBsei1jb29raWViYW5uZXIgLmNtcGx6LWhlYWRlciB7IG1hcmdpbi1ib3R0b206IDJweCAhaW1wb3J0YW50OyB9CgkuY21wbHotY29va2llYmFubmVyIC5jbXBsei10aXRsZSB7IGZvbnQtc2l6ZTogMTVweCAhaW1wb3J0YW50OyBsaW5lLWhlaWdodDogMS4yICFpbXBvcnRhbnQ7IG1hcmdpbjogMCAhaW1wb3J0YW50OyB9CgkuY21wbHotY29va2llYmFubmVyIC5jbXBsei1sb2dvIHsgZGlzcGxheTogbm9uZSAhaW1wb3J0YW50OyB9CgkuY21wbHotY29va2llYmFubmVyIC5jbXBsei1ib2R5IHsgbWFyZ2luOiA0cHggMCA2cHggIWltcG9ydGFudDsgfQoJLmNtcGx6LWNvb2tpZWJhbm5lciAuY21wbHotbWVzc2FnZSB7IGZvbnQtc2l6ZTogMTEuNXB4ICFpbXBvcnRhbnQ7IGxpbmUtaGVpZ2h0OiAxLjMyICFpbXBvcnRhbnQ7IH0KCS5jbXBsei1jb29raWViYW5uZXIgLmNtcGx6LWJ1dHRvbnMgeyBmbGV4LXdyYXA6IHdyYXAgIWltcG9ydGFudDsgZ2FwOiA2cHggIWltcG9ydGFudDsgbWFyZ2luLXRvcDogNHB4ICFpbXBvcnRhbnQ7IH0KCS5jbXBsei1jb29raWViYW5uZXIgLmNtcGx6LWJ1dHRvbnMgLmNtcGx6LWJ0biB7IGZsZXg6IDEgMSAzMCUgIWltcG9ydGFudDsgbWluLXdpZHRoOiA5MHB4ICFpbXBvcnRhbnQ7IG1hcmdpbjogMCAhaW1wb3J0YW50OyBwYWRkaW5nOiA5cHggOHB4ICFpbXBvcnRhbnQ7IGZvbnQtc2l6ZTogMTIuNXB4ICFpbXBvcnRhbnQ7IH0KCS5jbXBsei1jb29raWViYW5uZXIgLmNtcGx6LWxpbmtzIHsgbWFyZ2luLXRvcDogNHB4ICFpbXBvcnRhbnQ7IGZvbnQtc2l6ZTogMTAuNXB4ICFpbXBvcnRhbnQ7IH0KfQpDU1M7CgoJJGFwcGx5ID0gaXNzZXQoICRfR0VUWydjb25maXJtJ10gKSAmJiAkX0dFVFsnY29uZmlybSddID09PSAnQVBQTFlfTU9CSUxFJzsKCSRvdXQgPSBhcnJheSgKCQknbW9kZScgID0+ICRhcHBseSA/ICdBUFBMWScgOiAnRFJZLVJVTicsCgkJJ1BSSUVTJyA9PiBhcnJheSgKCQkJJ2Jhbm5lcl92ZXJzaW9uJyAgICAgICAgPT4gJHJvd1snYmFubmVyX3ZlcnNpb24nXSwKCQkJJ3VzZV9jdXN0b21fY29va2llX2NzcycgPT4gJHJvd1sndXNlX2N1c3RvbV9jb29raWVfY3NzJ10sCgkJCSdjdXN0b21fY3NzX2lsZ2lzJyAgICAgID0+IHN0cmxlbiggKHN0cmluZykgJHJvd1snY3VzdG9tX2NzcyddICksCgkJCSd0dXJpX21vYmlsZV80MnZoJyAgICAgID0+ICggc3RycG9zKCAoc3RyaW5nKSAkcm93WydjdXN0b21fY3NzJ10sICc0MnZoJyApICE9PSBmYWxzZSApID8gJ3RhaXAnIDogJ25lJywKCQkpLAoJCSdQTEFOVU9KQU1BJyA9PiBhcnJheSgKCQkJJ2N1c3RvbV9jc3NfaWxnaXMnID0+IHN0cmxlbiggJGNzcyApLAoJCQknYmFubmVyX3ZlcnNpb24nICAgPT4gaW50dmFsKCAkcm93WydiYW5uZXJfdmVyc2lvbiddICkgKyAxLAoJCSksCgkpOwoKCWlmICggISAkYXBwbHkgKSB7CgkJaGVhZGVyKCAnQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04JyApOwoJCWVjaG8gd3BfanNvbl9lbmNvZGUoICRvdXQsIEpTT05fUFJFVFRZX1BSSU5UIHwgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSB8IEpTT05fVU5FU0NBUEVEX1NMQVNIRVMgKTsKCQlleGl0OwoJfQoKCS8vIOKVkOKVkOKVkCBBUFBMWSDilZDilZDilZAKCSRyZXMgPSAkd3BkYi0+dXBkYXRlKCAkdGJsLCBhcnJheSgKCQknY3VzdG9tX2NzcycgICAgICAgICAgICA9PiAkY3NzLAoJCSd1c2VfY3VzdG9tX2Nvb2tpZV9jc3MnID0+IDEsCgkJJ2Jhbm5lcl92ZXJzaW9uJyAgICAgICAgPT4gaW50dmFsKCAkcm93WydiYW5uZXJfdmVyc2lvbiddICkgKyAxLAoJKSwgYXJyYXkoICdJRCcgPT4gMSApICk7Cgkkb3V0Wyd1cGRhdGVkJ10gID0gJHJlczsKCSRvdXRbJ2RiX2Vycm9yJ10gPSAkd3BkYi0+bGFzdF9lcnJvcjsKCgkvLyBDU1MgcmVnZW4KCSR1cCAgPSB3cF91cGxvYWRfZGlyKCk7CgkkZGlyID0gJHVwWydiYXNlZGlyJ10gLiAnL2NvbXBsaWFuei9jc3MnOwoJJGRlbCA9IGFycmF5KCk7Cglmb3JlYWNoICggKGFycmF5KSBnbG9iKCAkZGlyIC4gJy8qLmNzcycgKSBhcyAkZiApIHsgaWYgKCBAdW5saW5rKCAkZiApICkgeyAkZGVsW10gPSBiYXNlbmFtZSggJGYgKTsgfSB9Cgkkb3V0Wydpc3RyaW50YV9jc3MnXSA9ICRkZWw7CgoJJGNhbGxlZCA9IGFycmF5KCk7CglpZiAoIGZ1bmN0aW9uX2V4aXN0cyggJ2NtcGx6X3Jlc2F2ZV9hbGxfYmFubmVycycgKSApIHsgY21wbHpfcmVzYXZlX2FsbF9iYW5uZXJzKCk7ICRjYWxsZWRbXSA9ICdyZXNhdmUnOyB9CglpZiAoIGZ1bmN0aW9uX2V4aXN0cyggJ2NtcGx6X21heWJlX3VwZGF0ZV9jc3MnICkgKSAgIHsgY21wbHpfbWF5YmVfdXBkYXRlX2NzcygpOyAgICRjYWxsZWRbXSA9ICdtYXliZV91cGRhdGVfY3NzJzsgfQoJaWYgKCBmdW5jdGlvbl9leGlzdHMoICdjbXBsel9nZXRfY29va2llYmFubmVyJyApICkgewoJCSRiID0gY21wbHpfZ2V0X2Nvb2tpZWJhbm5lciggMSApOwoJCWlmICggaXNfb2JqZWN0KCAkYiApICYmIG1ldGhvZF9leGlzdHMoICRiLCAnc2F2ZScgKSApIHsgJGItPnNhdmUoKTsgJGNhbGxlZFtdID0gJ2NiOjpzYXZlJzsgfQoJfQoJaWYgKCBjbGFzc19leGlzdHMoICdDTVBMWl9DT09LSUVCQU5ORVInICkgKSB7CgkJJGIyID0gbmV3IENNUExaX0NPT0tJRUJBTk5FUiggMSApOwoJCWZvcmVhY2ggKCBhcnJheSggJ2dlbmVyYXRlX2NzcycsICd1cGRhdGVfY3NzJywgJ3NhdmUnICkgYXMgJG0gKSB7CgkJCWlmICggbWV0aG9kX2V4aXN0cyggJGIyLCAkbSApICkgeyB0cnkgeyAkYjItPiRtKCk7ICRjYWxsZWRbXSA9ICdDTVBMWjo6JyAuICRtOyB9IGNhdGNoICggVGhyb3dhYmxlICRlICkge30gfQoJCX0KCX0KCSRvdXRbJ2lza3ZpZXN0YSddID0gJGNhbGxlZDsKCgkkd3BkYi0+cXVlcnkoICJERUxFVEUgRlJPTSB7JHdwZGItPm9wdGlvbnN9IFdIRVJFIG9wdGlvbl9uYW1lIExJS0UgJ190cmFuc2llbnRfY21wbHolJyBPUiBvcHRpb25fbmFtZSBMSUtFICdfdHJhbnNpZW50X3RpbWVvdXRfY21wbHolJyIgKTsKCXdwX2NhY2hlX2ZsdXNoKCk7CgljbGVhcnN0YXRjYWNoZSgpOwoKCSRvdXRbJ2Nzc19wbyddID0gYXJyYXkoKTsKCWZvcmVhY2ggKCAoYXJyYXkpIGdsb2IoICRkaXIgLiAnLyouY3NzJyApIGFzICRmICkgewoJCSRjID0gZmlsZV9nZXRfY29udGVudHMoICRmICk7CgkJJG91dFsnY3NzX3BvJ11bXSA9IGFycmF5KAoJCQknZmlsZScgICAgICA9PiBiYXNlbmFtZSggJGYgKSwKCQkJJ3NpemUnICAgICAgPT4gZmlsZXNpemUoICRmICksCgkJCSd0dXJpXzQydmgnID0+ICggc3RycG9zKCAkYywgJzQydmgnICkgIT09IGZhbHNlICkgPyAn4pyFIHlyYScgOiAn4p2MIG5lcmEnLAoJCQkndHVyaV96YWxpYSc9PiAoIHN0cmlwb3MoICRjLCAnMkQ1RjNGJyApICE9PSBmYWxzZSApID8gJ+KchScgOiAnKG5lc3ZhcmJ1KScsCgkJKTsKCX0KCSRhZnRlciA9ICR3cGRiLT5nZXRfcm93KCAiU0VMRUNUIGJhbm5lcl92ZXJzaW9uLCB1c2VfY3VzdG9tX2Nvb2tpZV9jc3MsIExFTkdUSChjdXN0b21fY3NzKSBBUyBjc3NfbGVuIEZST00gJHRibCBXSEVSRSBJRCA9IDEiLCBBUlJBWV9BICk7Cgkkb3V0WydQTyddID0gJGFmdGVyOwoKCWhlYWRlciggJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcgKTsKCWVjaG8gd3BfanNvbl9lbmNvZGUoICRvdXQsIEpTT05fUFJFVFRZX1BSSU5UIHwgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSB8IEpTT05fVU5FU0NBUEVEX1NMQVNIRVMgKTsKCWV4aXQ7Cn0sIDYgKTsK";
const phpCode = Buffer.from(PHP_B64, 'base64').toString('utf8');

function api(method, path, bodyObj) {
  const auth = '-u "' + U + ':' + P + '"';
  let cmd = 'curl -s -k -w "\\nHTTP:%{http_code}" ' + auth + ' -X ' + method + ' -H "Content-Type: application/json" "' + BASE + path + '"';
  if (bodyObj) { fs.writeFileSync('/tmp/body.json', JSON.stringify(bodyObj)); cmd = 'curl -s -k -w "\\nHTTP:%{http_code}" ' + auth + ' -X ' + method + ' -H "Content-Type: application/json" --data-binary @/tmp/body.json "' + BASE + path + '"'; }
  let r; try { r = execSync(cmd, { encoding: 'utf8', maxBuffer: 30000000 }); } catch (e) { r = (e.stdout || '') + '\nHTTP:ERR'; }
  const code = (r.match(/HTTP:(\S+)$/) || [])[1] || '?';
  const body = r.replace(/\nHTTP:\S+$/, '');
  return { code, body };
}

(async () => {
  const R = {};
  try {
    // 0. Ar jau egzistuoja toks snippet? (idempotencija)
    const list = api('GET', '/wp-json/code-snippets/v1/snippets?limit=300');
    let existing = null;
    try { existing = JSON.parse(list.body).find(s => /Complianz Mobile Baris/i.test(s.name)); } catch (e) {}
    if (existing) { L('  JAU egzistuoja snippet #' + existing.id + ' (' + existing.name + ') active=' + existing.active); R.existing_id = existing.id; }

    // 1. Sukuriam (arba atnaujinam) snippeta
    const payload = { name: 'Petshop Complianz Mobile Baris v1 (sticky juosta)', desc: 'Token-gated: perrašo cmplz banner custom_css (desktop row + mobile sticky). Deaktyvuoti po naudojimo.', code: phpCode, scope: 'front-end', active: true, priority: 10 };
    let created;
    if (existing) {
      created = api('POST', '/wp-json/code-snippets/v1/snippets/' + existing.id, payload);
      L('=== UPDATE snippet #' + existing.id + ' -> HTTP ' + created.code);
    } else {
      created = api('POST', '/wp-json/code-snippets/v1/snippets', payload);
      L('=== CREATE snippet -> HTTP ' + created.code);
    }
    let snip = null;
    try { snip = JSON.parse(created.body); } catch (e) {}
    if (snip && snip.id) {
      R.snippet_id = snip.id; R.active = snip.active; R.code_len = (snip.code || '').length;
      L('  snippet id=' + snip.id + ' active=' + snip.active + ' code_len=' + R.code_len);
    } else {
      L('  NEPAVYKO sukurti/atnaujinti. Body: ' + created.body.slice(0, 400));
    }

    // 2. Perskaitom atgal - kodo integralumas
    if (R.snippet_id) {
      const rb = api('GET', '/wp-json/code-snippets/v1/snippets/' + R.snippet_id);
      try {
        const s = JSON.parse(rb.body);
        R.readback = { active: s.active, code_len: (s.code || '').length, starts: (s.code || '').slice(0, 60), has_apply: /APPLY_MOBILE/.test(s.code || '') };
        L('  READBACK active=' + s.active + ' code_len=' + (s.code || '').length + ' has_APPLY_MOBILE=' + R.readback.has_apply);
        // aktyvuojam jei ne aktyvus
        if (!s.active) {
          const act = api('POST', '/wp-json/code-snippets/v1/snippets/' + R.snippet_id + '/activate', {});
          L('  ACTIVATE -> HTTP ' + act.code);
        }
      } catch (e) { L('  readback parse klaida: ' + rb.body.slice(0, 200)); }
    }

    // 3. DRY trigger
    if (R.snippet_id) {
      execSync('sleep 2');
      const dry = api('GET', '/?ps_cmplz_mobile=1&token=cmplz_6680aa2a42151d54fa8d64ec');
      L('=== DRY trigger -> HTTP ' + dry.code);
      L(dry.body.slice(0, 900));
      R.dry_raw = dry.body.slice(0, 2000);
    }

    L('DONE');
  } catch (e) {
    L('!!! EXCEPTION: ' + (e && e.stack ? e.stack : String(e)));
  } finally {
    putText('cmplz_deploy_run1.json', JSON.stringify(R, null, 2));
    putText('_run1_log.txt', out);
  }
})();
