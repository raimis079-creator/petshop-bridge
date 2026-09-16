// petshop_ads_offline_konv_v1_1_7d_RUN.js (S1687, VIENKARTINIS: dienos=7 — įkelti 09-10…12 užsakymus, praleistus dėl klaidos; po paleidimo grąžinti v1_1_RUN su dienos=3) — PATAISA: laiko juosta Europe/Vilnius (Google atmetė visas eilutes: „Conversion Time requires a timezone“; +03:00 iš JSON įkėlime dingsta) — WC apmokėti užsakymai su gclid → Google Ads offline konversijos.
// Šaltinis: petshop.lt mu-plugin petshop-ads-offline v1.1 (JSON). Paleisti kasdien (Schedule: Daily, ~06:00).
// Prieš pirmą paleidimą UI turi būti sukurtas konversijos veiksmas "Import from clicks" pavadinimu KONV.
var URL  = 'https://petshop.lt/?ps_ads_offline=AiedogHzttJiKz8HZgLFUvMdke546YIc&dienos=7';
var KONV = 'Įkėlimas neprisijungus'; // UI sukurtas pavadinimas (S1677)

function main() {
  var r = UrlFetchApp.fetch(URL, { muteHttpExceptions: true });
  if (r.getResponseCode() !== 200) { Logger.log('KLAIDA: HTTP ' + r.getResponseCode()); return; }
  var d = JSON.parse(r.getContentText());
  Logger.log('WC užsakymų su gclid per ' + d.dienos + ' d.: ' + d.n);
  if (!d.n) { return; }
  var up = AdsApp.bulkUploads().newCsvUpload(
    ['Google Click ID', 'Conversion Name', 'Conversion Time', 'Conversion Value', 'Conversion Currency'],
    { moneyInMicros: false, timeZone: 'Europe/Vilnius' });
  up.forOfflineConversions();
  d.eil.forEach(function (e) {
    up.append({ 'Google Click ID': e.gclid, 'Conversion Name': KONV, 'Conversion Time': e.laikas.replace(/([+-]\d\d:\d\d|Z)$/, ''),
                'Conversion Value': e.verte, 'Conversion Currency': e.valiuta });
    Logger.log('#' + e.uzs + '  ' + e.laikas + '  ' + e.verte + ' ' + e.valiuta);
  });
  up.apply();
  Logger.log('Įkelta eilučių: ' + d.n + ' (laiko juosta Europe/Vilnius). Rezultatas: Tikslai → Konversijos → Įkėlimai. Ads konversijos rodomos po ~3 val.');
}
