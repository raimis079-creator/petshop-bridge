/**
 * PETSHOP ADS APPLY #1 v1.0 (S1666) — Raimio patvirtinta seka, 2 veiksmai.
 * (1) Prins Puppy 23394555043 -> PAUSED
 * (2) Brand_Exclusion sharedSets/11895318074 -> campaigns 21472017542 ir 21565450990
 * BIUDZETAI IR tROAS NELIECIAMI.
 * Po veiksmu pats pasitikrina ir issiuncia rezultata i petshop.lt.
 * Naudojimas: Google Ads -> Tools -> Scripts -> + -> ideti -> Authorize -> RUN (ne Preview).
 */
var URL = 'https://petshop.lt/?rest_route=/ps-web/v1/ads-recon';
var KEY = 'FDPFp74rq8G8ceoglCn5sA7YrR1IA8lo';

var CID = '7541530584';
var PRINS = '23394555043';
var SSET = '11895318074';
var PMAX = ['21472017542', '21565450990'];

function main() {
  var out = { v: 'ADS APPLY #1 v1.0', kada: new Date().toISOString(), klaidos: [], veiksmai: [] };

  // --- (1) Prins -> PAUSED
  try {
    var c = rastiKampanija(PRINS);
    if (!c) {
      out.klaidos.push('Prins ' + PRINS + ' nerasta nei viename selektoriuje');
    } else if (c.isPaused()) {
      out.veiksmai.push({ zingsnis: 'prins_pause', busena: 'jau_paused', vardas: c.getName() });
    } else {
      c.pause();
      out.veiksmai.push({ zingsnis: 'prins_pause', busena: 'ok', vardas: c.getName() });
    }
  } catch (e) { out.klaidos.push('prins_pause: ' + e); }

  // --- (2) Brand_Exclusion -> 2 PMax
  var jauPriskirta = esamiPriskyrimai();
  out.priskyrimai_pries = jauPriskirta;
  var ops = [];
  var opsCamp = [];
  for (var i = 0; i < PMAX.length; i++) {
    var rn = 'customers/' + CID + '/campaigns/' + PMAX[i];
    if (jauPriskirta.indexOf(PMAX[i]) !== -1) {
      out.veiksmai.push({ zingsnis: 'sset_' + PMAX[i], busena: 'jau_priskirta' });
      continue;
    }
    ops.push({
      campaignSharedSetOperation: {
        create: {
          campaign: rn,
          sharedSet: 'customers/' + CID + '/sharedSets/' + SSET
        }
      }
    });
    opsCamp.push(PMAX[i]);
  }
  if (ops.length) {
    try {
      var res = AdsApp.mutate(ops);
      var k = 0;
      while (res.hasNext()) {
        var r = res.next();
        var cid = opsCamp[k++];
        if (r.isSuccessful()) {
          out.veiksmai.push({ zingsnis: 'sset_' + cid, busena: 'ok', rn: r.getResourceName ? r.getResourceName() : '' });
        } else {
          out.veiksmai.push({ zingsnis: 'sset_' + cid, busena: 'KLAIDA', kl: r.getErrorMessages().join(' | ') });
          out.klaidos.push('sset_' + cid + ': ' + r.getErrorMessages().join(' | '));
        }
      }
    } catch (e) { out.klaidos.push('mutate: ' + e); }
  }

  // --- PATIKRA
  out.priskyrimai_po = esamiPriskyrimai();
  out.busenos = [];
  var ids = [PRINS].concat(PMAX);
  var q = AdsApp.search(
    'SELECT campaign.id, campaign.name, campaign.status, campaign.advertising_channel_type, ' +
    'campaign_budget.amount_micros, campaign.maximize_conversion_value.target_roas ' +
    'FROM campaign WHERE campaign.id IN (' + ids.join(',') + ')');
  while (q.hasNext()) {
    var row = q.next();
    out.busenos.push({
      id: String(row.campaign.id),
      vardas: row.campaign.name,
      status: row.campaign.status,
      tipas: row.campaign.advertisingChannelType,
      biudzetas: row.campaignBudget ? Number(row.campaignBudget.amountMicros) / 1000000 : null,
      troas: row.campaign.maximizeConversionValue ? row.campaign.maximizeConversionValue.targetRoas : null
    });
  }

  out.ok = out.klaidos.length === 0;
  Logger.log(JSON.stringify(out, null, 2));
  siusti(out);
}

function rastiKampanija(id) {
  var sel = [];
  try { sel.push(AdsApp.campaigns()); } catch (e) {}
  try { sel.push(AdsApp.shoppingCampaigns()); } catch (e) {}
  try { sel.push(AdsApp.videoCampaigns()); } catch (e) {}
  try { sel.push(AdsApp.performanceMaxCampaigns()); } catch (e) {}
  for (var i = 0; i < sel.length; i++) {
    try {
      var it = sel[i].withIds([id]).get();
      if (it.hasNext()) return it.next();
    } catch (e) {}
  }
  return null;
}

function esamiPriskyrimai() {
  var r = [];
  try {
    var it = AdsApp.search(
      'SELECT campaign_shared_set.campaign, campaign_shared_set.shared_set, campaign_shared_set.status ' +
      'FROM campaign_shared_set WHERE campaign_shared_set.status = "ENABLED"');
    while (it.hasNext()) {
      var row = it.next();
      var ss = String(row.campaignSharedSet.sharedSet);
      if (ss.indexOf('/' + SSET) !== -1) {
        var cm = String(row.campaignSharedSet.campaign);
        r.push(cm.substring(cm.lastIndexOf('/') + 1));
      }
    }
  } catch (e) { r.push('KLAIDA:' + e); }
  return r;
}

function siusti(out) {
  try {
    var resp = UrlFetchApp.fetch(URL, {
      method: 'post',
      contentType: 'application/json',
      headers: { 'x-ps-key': KEY },
      payload: JSON.stringify(out),
      muteHttpExceptions: true
    });
    Logger.log('SIUNTIMAS: ' + resp.getResponseCode() + ' ' + resp.getContentText().substring(0, 300));
  } catch (e) { Logger.log('SIUNTIMO KLAIDA: ' + e); }
}
