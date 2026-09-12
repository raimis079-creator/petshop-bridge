// petshop_ads_offline_konv_v1_0_RUN.js (S1677) — WC apmokėti užsakymai su gclid → Google Ads offline konversijos.
// Šaltinis: petshop.lt mu-plugin petshop-ads-offline v1.1 (JSON). Paleisti kasdien (Schedule: Daily, ~06:00).
// Prieš pirmą paleidimą UI turi būti sukurtas konversijos veiksmas "Import from clicks" pavadinimu KONV (žr. instrukciją).
var URL  = 'https://petshop.lt/?ps_ads_offline=AiedogHzttJiKz8HZgLFUvMdke546YIc&dienos=3';
var KONV = 'WC pirkimas (offline)';

function main() {
  var r = UrlFetchApp.fetch(URL, { muteHttpExceptions: true });
  if (r.getResponseCode() !== 200) { Logger.log('KLAIDA: HTTP ' + r.getResponseCode()); return; }
  var d = JSON.parse(r.getContentText());
  Logger.log('WC užsakymų su gclid per ' + d.dienos + ' d.: ' + d.n);
  if (!d.n) { return; }
  var up = AdsApp.bulkUploads().newCsvUpload(
    ['Google Click ID', 'Conversion Name', 'Conversion Time', 'Conversion Value', 'Conversion Currency'],
    { moneyInMicros: false });
  up.forOfflineConversions();
  d.eil.forEach(function (e) {
    up.append({ 'Google Click ID': e.gclid, 'Conversion Name': KONV, 'Conversion Time': e.laikas,
                'Conversion Value': e.verte, 'Conversion Currency': e.valiuta });
    Logger.log('#' + e.uzs + '  ' + e.laikas + '  ' + e.verte + ' ' + e.valiuta);
  });
  up.apply();
  Logger.log('Įkelta eilučių: ' + d.n + '. Rezultatas (dubliai/klaidos): Tools → Bulk actions → Uploads. Ads konversijos rodomos po ~3 val.');
}
