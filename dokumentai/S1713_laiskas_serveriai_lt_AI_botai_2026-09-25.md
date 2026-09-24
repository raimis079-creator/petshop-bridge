# S1713 — laiškas serveriai.lt dėl AI botų blokavimo (2.10)

Siunčia: R (pagalba@serveriai.lt / DirectAdmin užklausa). Prieš siunčiant įrašyti paskyros ID / domeno užsakymo numerį.

---

**Tema:** petshop.lt — serverio lygmenyje blokuojami AI paieškos botai (GPTBot, ChatGPT-User, ClaudeBot) — prašome atblokuoti

Laba diena,

svetainė petshop.lt (paskyra: __________) yra jūsų hostinge. Pastebėjome, kad OpenAI ir Anthropic vartotojų agentai (user-agent) blokuojami dar prieš pasiekiant svetainę.

**Access logų duomenys (2026-09-18…09-24, 7 paros):**

| User-agent | Užklausos | 403 | 500 | Ryšys nutrauktas be atsakymo | 200 |
|---|---|---|---|---|---|
| ChatGPT-User | 1 076 | 508 | 30 | 538 | 0 |
| GPTBot | 144 | 71 | 0 | 72 | 0 |
| ClaudeBot | 184 | 87 | 0 | — | 1 (tik robots.txt) |

**Testas iš paties serverio** (curl į https://petshop.lt/ su skirtingais user-agent):
- GPTBot, ChatGPT-User, ClaudeBot → ryšys nutraukiamas per ~26 ms (cURL error 56, jokio HTTP atsakymo);
- OAI-SearchBot, Claude-User, PerplexityBot, Applebot, Amazonbot, Bytespider, paprastas curl → 200.

Svetainės `.htaccess` user-agent taisyklių neturi, WordPress pluginai botų nefiltruoja, IP blokavimų nesame nustatę. Todėl blokavimas vyksta hostingo WAF / „bot protection“ lygmenyje.

**Prašome:**
1. Įtraukti į išimtis (atblokuoti) šiuos user-agent: **GPTBot, ChatGPT-User, OAI-SearchBot, ClaudeBot, Claude-User, PerplexityBot**.
2. Jei šis nustatymas valdomas per DirectAdmin ar kliento savitarną — nurodyti, kur jį galime keisti patys.
3. Pateikti sąrašą, kokie kiti user-agent jūsų pusėje blokuojami pagal nutylėjimą.

Šie botai reikalingi, kad ChatGPT, Claude ir Perplexity galėtų atidaryti mūsų puslapius, kai vartotojai klausia apie prekes — dabar jie negali ir cituoja konkurentus. Visi jie gerbia robots.txt; jei reikia apkrovos apribojimų (rate limit), su tuo sutinkame.

Konkrečias logų eilutes su 403 galime pateikti.

Ačiū,
Raimundas Bulakas
UAB Avesa / petshop.lt

---

**Patikra po atsakymo (C):** `ps-bridge/s1712/b.php` fazė E (`ps_s1712b=E`) — GPTBot / ChatGPT-User / ClaudeBot turi grąžinti 200; tada pakartoti 7 AI užklausas iš S1712.
