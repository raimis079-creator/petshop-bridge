/* Petshop "Mano augintinis" anketa — M8 v1.5 (S206 dublikatai + S208 redagavimas + S211 produkto tapatybe + foto po prisijungimo) */
(function(){
	'use strict';

	var CFG = window.PSPetConfig || {};
	var REST = CFG.restUrl || '/wp-json/petshop/v1';
	var IMAGES = CFG.imagesUrl || '';

	var SPECIES_KEY = { dog:'pet-dog', cat:'pet-cat', bird:'pet-bird', rodent:'pet-rodent', fish:'pet-fish', reptile:'pet-reptile', other:'pet-other' };

	// Didele iliustracija (header/avataras) — originalas.
	function speciesImg(species){
		var key = SPECIES_KEY[species] || 'pet-other';
		if (IMAGES) return '<img src="' + IMAGES + key + '.png" alt="" style="width:100%;height:100%;object-fit:contain">';
		return SPECIES[species] ? SPECIES[species].icon : '🐾';
	}

	// S211: MAZA ikona mygtukams — 96/192 webp (~2.5 KB vietoj 227 KB originalo).
	// srcset 2x, kad Retina ekrane neatrodytu minksta. <picture> su png fallback.
	function speciesIconSmall(species){
		var key = SPECIES_KEY[species] || 'pet-other';
		if (!IMAGES) return SPECIES[species] ? SPECIES[species].icon : '🐾';
		return '<picture>' +
			'<source type="image/webp" srcset="' + IMAGES + key + '-96.webp 1x, ' + IMAGES + key + '-192.webp 2x">' +
			'<img src="' + IMAGES + key + '-96.png" srcset="' + IMAGES + key + '-192.png 2x" ' +
			'width="32" height="32" alt="" loading="lazy" style="width:32px;height:32px;object-fit:contain;display:block">' +
			'</picture>';
	}
	var NONCE = CFG.nonce || '';
	var IS_LOGGED_IN = CFG.isLoggedIn || false;
	var DRAFT_KEY = 'pspet_draft';
	var DRAFT_TTL_DAYS = 30;

	// Rūšių konfigūracija — kokie laukai rodomi
	var SPECIES = {
		dog:     { label: 'Šuo', icon: '🐕', full: true },
		cat:     { label: 'Katė', icon: '🐈', full: true },
		bird:    { label: 'Paukštis', icon: '🦜', full: false },
		rodent:  { label: 'Graužikas', icon: '🐹', full: false },
		fish:    { label: 'Žuvis', icon: '🐠', full: false },
		reptile: { label: 'Roplys', icon: '🦎', full: false },
		other:   { label: 'Kitas', icon: '🐾', full: false }
	};

	// 2026-07-26 canonical: "daily" (nera poreikis, o numatytoji busena) ir "sterilised"
	// (dubliavo atskira klausima) pasalinti. 'none' = zmogus atsake "nieko is siu",
	// NULL = neatsake — ataskaitoje tai skirtingi dalykai.
	var NEEDS = [
		{ code: 'digestion', label: 'Jautrus virškinimas' },
		{ code: 'skin_coat', label: 'Oda ir kailis' },
		{ code: 'weight_control', label: 'Svorio kontrolė' },
		{ code: 'joints', label: 'Sąnariai' },
		{ code: 'picky_eater', label: 'Išrankus augintinis' },
		{ code: 'other', label: 'Kita' },
		{ code: 'none', label: 'Šiuo metu nieko iš šių' }
	];

	var state = {
		step: 1,
		data: {
			species: null,
			species_detail: null,
			pet_name: null,
			primary_need: null,
			primary_need_other: null,
			life_stage: null,
			dog_size: null,
			is_sterilised: null,
			feeding_type: null,
			feeding_type_other: null,
			wet_food_g: null,
			current_food_brand: null,
			current_food_free_text: null,
			birth_date: null,
			sensitivities: null,
			housing: null,
			activity_hint: null
		}
	};

	var root = null;

	// --- localStorage juodraštis ---
	function saveDraft(){
		if (IS_LOGGED_IN) return; // prisijungęs — saugom į DB, ne localStorage
		var now = Date.now();
		var draft = {
			schema_version: 2,
			draft_id: state.data.draft_id || genId(),
			created_at: state.data.created_at || new Date(now).toISOString(),
			expires_at: new Date(now + DRAFT_TTL_DAYS*86400000).toISOString(),
			current_step: state.step,
			// v2 (2026-07-24): anketos ETAPO eiga — kad po F5 vartotojas testu ten,
			// kur baigė, o ne pamatytu vel tuscia zieda ir 1-a sekcija.
			section_idx: (state.sectionIdx != null) ? state.sectionIdx : 0,
			confirmed_sections: state.confirmedSections || [],
			pet_data: state.data
		};
		state.data.draft_id = draft.draft_id;
		state.data.created_at = draft.created_at;
		try { localStorage.setItem(DRAFT_KEY, JSON.stringify(draft)); } catch(e){}
		// S341: bet koks anketos pakeitimas paskelbia serverini drafta pasenusiu.
		// ★ SAVEDRAFT NEKVIECIA /pet-draft — serverinis draftas kuriamas TIK
		//   galutiniame „gauti nuoroda" veiksme.
		srvDraftMarkDirty();
	}
	function loadDraft(){
		try {
			var raw = localStorage.getItem(DRAFT_KEY);
			if (!raw) return null;
			var draft = JSON.parse(raw);
			if (new Date(draft.expires_at).getTime() < Date.now()) {
				localStorage.removeItem(DRAFT_KEY);
				return null;
			}
			return draft;
		} catch(e){ return null; }
	}
	function clearDraft(){ try { localStorage.removeItem(DRAFT_KEY); } catch(e){} }
	function genId(){ return 'd_' + Math.random().toString(36).slice(2) + Date.now().toString(36); }

	// --- S341: SERVERINIO drafto busena (S328/S336) ---
	/**
	 * Esamo `DRAFT_KEY` formato NELAUZIAM — serverinio drafto busena gyvena
	 * ATSKIRAME rakte. Cia laikoma TIK tiek, kiek reikia saugiam PAKARTOJIMUI:
	 * draft_id, email, payload pirstu atspaudas, dirty veliava.
	 *
	 * TAISYKLE:
	 *   tas pats email + tas pats fingerprint + turimas draft_id
	 *     -> POST /pet-draft NEKVIECIAMAS, kartojamas TIK magic-login/request
	 *   pasikeite email arba anketos duomenys
	 *     -> dirty -> kuriamas NAUJAS serverinis draftas
	 *
	 * Tai uzdaro atveji, kai /pet-draft PAVYKO, o magic-login/request NE:
	 * pakartojimas NEKURIA naujo drafto ir neatsitrenkia i 5/email/val. limita.
	 */
	var SRV_DRAFT_KEY = 'petshop_pet_srv_draft';

	function srvFingerprint(obj){
		var raktai = Object.keys(obj || {}).sort();
		var s = '';
		for (var i = 0; i < raktai.length; i++){
			var v = obj[raktai[i]];
			if (v === null || v === undefined || v === '') continue;
			s += raktai[i] + '=' + String(v) + ';';
		}
		var h = 5381;
		for (var j = 0; j < s.length; j++){ h = ((h * 33) ^ s.charCodeAt(j)) >>> 0; }
		return h.toString(36) + '.' + s.length;
	}
	function srvDraftGet(){
		try { return JSON.parse(localStorage.getItem(SRV_DRAFT_KEY) || 'null'); } catch(e){ return null; }
	}
	function srvDraftSet(o){
		try { localStorage.setItem(SRV_DRAFT_KEY, JSON.stringify(o)); } catch(e){}
	}
	/** Anketos duomenys pasikeite — senas serverinis draftas nebeatitinka. */
	function srvDraftMarkDirty(){
		var s = srvDraftGet();
		if (s && s.draft_id && !s.dirty) { s.dirty = true; srvDraftSet(s); }
	}
	/** Serveriui siunciamas payload. Vietiniai laukai i ji nepatenka. */
	/**
	 * S344: VIENAS ribos adapteris — `_weight_kg` -> `current_weight_kg`.
	 *
	 * ★ KODEL SITO REIKEJO. Anketa svori laiko VIDINIAME lauke `_weight_kg`
	 *   (UI reiksme, localStorage, €/dienai skaiciuokle, rodymas antrasteje).
	 *   Kanoninis SERVERIO laukas — `current_weight_kg` (S335, sanitize_input).
	 *   `buildPayload()` `_weight_kg` VISADA ismesdavo, bet NIEKUR nemapindavo,
	 *   o S341 `srvPayload()` ji praleisdavo NETEISINGU vardu -> whitelist
	 *   numesdavo, ir svoris nepasiekdavo `ps_pets` NEI VIENAME kelyje.
	 *
	 * ★ ADAPTERIS, NE PERVADINIMAS. `_weight_kg` lieka vidinis — pervadinus
	 *   globaliai sulustu skaiciuokle, drafto atkurimas ir SENI localStorage irasai.
	 *
	 * ★ `weight_updated_at` klientas NESIUNCIA — ji nustato serveris (S335).
	 */
	function addCanonicalWeight(payload, data){
		if (!data || !Object.prototype.hasOwnProperty.call(data, '_weight_kg')) {
			return payload;
		}
		var value = String(data._weight_kg == null ? '' : data._weight_kg).trim();
		if (value !== '') {
			payload.current_weight_kg = value.replace(',', '.');
		}
		delete payload._weight_kg;
		return payload;
	}

	function srvPayload(){
		var out = {};
		for (var k in state.data) {
			if (!Object.prototype.hasOwnProperty.call(state.data, k)) continue;
			if (k === 'draft_id' || k === 'created_at') continue;
			var v = state.data[k];
			if (v === null || v === undefined || v === '') continue;
			out[k] = v;
		}
		return addCanonicalWeight(out, state.data);
	}

	// --- Render ---
	/**
	 * Perjungus ZINGSNI — pakelia i anketos virsu. Be sio zmogus lieka senoje
	 * scroll pozicijoje ir nemato naujo zingsnio pradzios.
	 * SVARBU: kviečiama TIK is render() (zingsnio keitimas), NE is renderStep2()
	 * (ten pill'u perpiesimas tame paciame zingsnyje — scroll sokinetu renkantis).
	 */
	var _firstRender = true;
	function scrollToTop(){
		if (_firstRender) { _firstRender = false; return; }   // puslapio uzkrovime nesokam
		var doScroll = function(){
			try {
				if (root && root.scrollIntoView) {
					root.scrollIntoView({ block: 'start', behavior: 'auto' });
					var y = window.pageYOffset || document.documentElement.scrollTop;
					if (y > 90) window.scrollTo(0, y - 80);
				}
			} catch (e) {}
		};
		if (window.requestAnimationFrame) requestAnimationFrame(doScroll); else doScroll();
	}

	function render(){
		if (!root) return;
		scrollToTop();
		// KONTRAKTAS §4.1: tiksli zingsnio zyme ivykiu stebetojui (data-step).
		try { root.setAttribute('data-step', String(state.step)); } catch (e) {}
		if (state.step === 1) renderStep1();
		else if (state.step === 2) renderStep2();
		else if (state.step === 3) renderResult();
		else if (state.step === 'duplicate') renderDuplicate();
		else if (state.step === 'complete') renderComplete();
	}

	function el(tag, cls, html){
		var e = document.createElement(tag);
		if (cls) e.className = cls;
		if (html !== undefined) e.innerHTML = html;
		return e;
	}

	function renderStep1(){
		root.innerHTML = '';
		var wrap = el('div', 'pspet-wrap');
		var isEdit = !!state.editPetId;

		// IA v1.1 S3A: kuriant profili — TIK rusis + vardas + (neprivalomas) svoris.
		// Amziaus etapas, dydis, maitinimo tipas, poreikis ir maistas renkami progresyviai veliau.
		if (isEdit) wrap.appendChild(progressBar(1));
		// S287: perimta iš skaičiuoklės — rodom PRIEŠ antraštę.
		var hn = handoffNote();
		if (hn) { wrap.appendChild(hn); }

		var head = el('div', 'pspet-head');
		var headText = el('div', 'pspet-head-text');
		headText.appendChild(el('h2', 'pspet-title', 'Papasakokite apie savo augintinį'));
		headText.appendChild(el('p', 'pspet-subtitle', 'Tai užtruks mažiau nei minutę'));
		head.appendChild(headText);
		var illust = el('div', 'pspet-illustration');
		illust.innerHTML = speciesIcon();
		head.appendChild(illust);
		wrap.appendChild(head);

		// Rūšis (privaloma)
		var fSpecies = el('div', 'pspet-field');
		fSpecies.appendChild(el('label', 'pspet-label', 'Kas jūsų augintinis?'));
		// IA v1.1: VISOS rusys matomos i\u0161 karto — pauk\u0161\u010diai, grau\u017eikai, \u017euvys ir ropliai
		// nebeslepiami po "Kitas augintinis".
		var primaryPills = el('div', 'pspet-pills');
		['dog','cat','bird','rodent','fish','reptile','other'].forEach(function(sp){ primaryPills.appendChild(speciesPill(sp)); });
		fSpecies.appendChild(primaryPills);
		wrap.appendChild(fSpecies);

		// Vardas (privalomas)
		var fName = el('div', 'pspet-field');
		fName.appendChild(el('label', 'pspet-label', 'Augintinio vardas'));
		var nameInput = el('input', 'pspet-input');
		nameInput.type = 'text';
		nameInput.placeholder = 'Koks jūsų augintinio vardas?';
		nameInput.value = state.data.pet_name || '';
		nameInput.oninput = function(){ state.data.pet_name = this.value || null; saveDraft(); };
		fName.appendChild(nameInput);
		wrap.appendChild(fName);

		// P0-1 (2026-07-24): svoris rodomas TIK suniui ir katei. Kitoms rusims
		// bendras kg laukas neprasmingas — jei prireiks, rinksim atskirai su savais vienetais.
		if (state.data.species === 'dog' || state.data.species === 'cat') {
			var fW = el('div', 'pspet-field');
			fW.appendChild(el('label', 'pspet-label', 'Svoris <span class="pspet-sublabel">(neprivaloma)</span>'));
			var wRow = el('div', null);
			wRow.style.cssText = 'display:flex;align-items:center;gap:8px';
			var wInput = el('input', 'pspet-input');
			wInput.type = 'text'; wInput.inputMode = 'decimal';
			wInput.placeholder = 'pvz. 12,5';
			wInput.style.maxWidth = '140px';
			wInput.value = state.data._weight_kg || '';
			wInput.oninput = function(){ state.data._weight_kg = this.value || null; saveDraft(); };
			var kg = el('span', null, 'kg');
			kg.style.cssText = 'color:#888;font-weight:600';
			wRow.appendChild(wInput); wRow.appendChild(kg);
			fW.appendChild(wRow);
			var hint = el('p', 'pspet-subtitle', 'Svorio prireiks dienos normai apskaičiuoti, kai pasirinksite maistą.');
			fW.appendChild(hint);
			wrap.appendChild(fW);
		} else if (state.data._weight_kg) {
			// Persijungus i rusi, kuriai kg laukas nerodomas — anksciau ivesta reiksme isvaloma.
			state.data._weight_kg = null;
			saveDraft();
		}

		// Veiksmai
		var actions = el('div', 'pspet-actions');
		var btn = el('button', 'pspet-btn pspet-btn-primary', isEdit ? 'Tęsti' : 'Sukurti profilį');
		btn.onclick = function(){
			if (!state.data.species) { alert('Pasirinkite gyvūno rūšį'); return; }
			if (!state.data.pet_name || !String(state.data.pet_name).trim()) { alert('Įrašykite augintinio vardą'); nameInput.focus(); return; }
			saveDraft();
			if (isEdit) { state.step = 2; render(); }
			else { submitProfile(); }
		};
		actions.appendChild(btn);
		wrap.appendChild(actions);

		root.appendChild(wrap);
	}

	function speciesPill(sp){
		var cfg = SPECIES[sp];
		// S211: emoji pakeisti musu iliustracijomis — emoji atrodo kaip OS elementas,
		// ne kaip Petshop produktas.
		var p = el('div', 'pspet-pill pspet-pill-species' + (state.data.species === sp ? ' active' : ''),
			'<span class="pspet-pill-icon">' + speciesIconSmall(sp) + '</span><span class="pspet-pill-text">' + cfg.label + '</span>');
		p.onclick = function(){
			state.data.species = sp;
			// Išvalom rūšiai nebūdingus laukus
			if (sp !== 'dog') state.data.dog_size = null;
			if (sp !== 'cat') state.data.is_sterilised = null;
			if (sp !== 'dog' && sp !== 'cat') { state.data.primary_need = null; state.data.primary_need_other = null; }
			saveDraft(); renderStep1();
		};
		return p;
	}

	function speciesIcon(){
		return state.data.species ? speciesImg(state.data.species) : (IMAGES ? '<img src="'+IMAGES+'pet-other.png" alt="" style="width:100%;height:100%;object-fit:contain">' : '🐾');
	}

	// --- S218: veisliu sarasai autocomplete (datalist). Neprivaloma; laisvas tekstas leidziamas. ---
	// FCI pagrindiniu + Lietuvoje populiariu veisliu sarasai (paieska per datalist; laisvas tekstas leidziamas).
	var BREEDS_DOG = ['Mišrūnas','Afganų kurtas','Airių seteris','Airių vandens spanielis','Airių vilkšunis','Akita','Aliaskos malamutas','Amerikiečių akita','Amerikiečių kokerspanielis','Amerikiečių stafordšyro terjeras','Anatolijos aviganis','Anglų buldogas','Anglų kokerspanielis','Anglų mastifas','Anglų pointeris','Anglų seteris','Anglų springerspanielis','Argentinos dogas','Australų aviganis','Australų galvijų šuo','Australų šilkinis terjeras','Azavakas','Barbetas','Basendžis','Baseto skalikas','Bavarijos kalnų skalikas','Beagle (biglis)','Bedlingtono terjeras','Belgų aviganis Grojenendalis','Belgų aviganis Lakenua','Belgų aviganis Malinua','Belgų aviganis Tervurenas','Berno zenenhundas','Bišonas frizė','Bolonietis','Bordo dogas','Borderkolis','Borderterjeras','Bordoso dogas','Boston terjeras','Bretanės spanielis','Briaro aviganis','Briuselio grifonas','Bulmastifas','Bulterjeras','Čekoslovakų vilkšunis','Černyj terjeras (Rusų juodasis)','Čihuahua','Chow chow (Čiau čiau)','Dalmatinas','Danijos-Švedijos kiemsargis','Didysis šveicarų zenenhundas','Dobermanas','Dogas (Vokiečių)','Dvergšnauceris','Entlebucho zenenhundas','Eurazieris','Filos brazileiro','Finų laika','Finų špicas','Foksterjeras lygiaplaukis','Foksterjeras šiurkščiaplaukis','Grand basetas grifonas','Grenlandijos šuo','Havanietis','Hovavartas','Ispanų mastifas','Islandų aviganis','Italų kurtas','Jack Russell terjeras','Japonų činas','Japonų špicas','Jorkšyro terjeras','Kanarų dogas','Kanė korso','Karelų meškinis šuo','Kaukazo aviganis','Kavalierius Karaliaus Čarlzo spanielis','Keeshond (Volfšpicas)','Kerio mėlynasis terjeras','Kernterjeras','Kinų kuoduotasis','Klumberspanielis','Kolis ilgaplaukis','Kolis trumpaplaukis','Komondoras','Korgis kardiganas','Korgis pembrukas','Kroatų aviganis','Kuvasas','Labradoro retriveris','Lagotto romagnolo','Landsyras','Lasa apso','Leonbergeris','Lietuvių skalikas','Maltos bišonas','Mažasis liūtšunis','Mažasis vandenšunis','Meksikos plikšunis','Mopsas','Neapolio mastifas','Niufaundlendas','Norvegų elkhundas','Norvičo terjeras','Olandų aviganis','Papijonas','Parson Russell terjeras','Pekinas','Perlinis kurtas (Bordzojus)','Persų kurtas (Saluki)','Pirėnų kalnų šuo','Pitbulterjeras','Podenko ibicenko','Pointeris','Portugalų vandens šuo','Prancūzų buldogas','Pudelis didysis','Pudelis mažasis','Pudelis nykštukinis','Pudelis toy','Puliai','Ridžbekas (Rodezijos)','Rotveileris','Rusų toy terjeras','Samojedas','Šarpėjus','Šeltis (Šetlando aviganis)','Šiaurės elnių ganytojas','Sibiro haskis','Ši tcu','Škotų seteris (Gordonas)','Škotų terjeras','Slovakų čiuvačas','Šnauceris didysis','Šnauceris vidutinis','Špicas didysis','Špicas mažasis (Pomeranijos)','Špicas vidutinis','Stafordšyro bulterjeras','Sen Bernaras','Suomių skalikas','Taksas ilgaplaukis','Taksas šiurkščiaplaukis','Taksas trumpaplaukis','Tibeto mastifas','Tibeto spanielis','Tibeto terjeras','Toso inu','Vachtelhundas','Veimaraneris','Velštererjeras','Vengrų vižla','Vesthailendo terjeras','Vidurinės Azijos aviganis','Vokiečių aviganis','Vokiečių bokseris','Vokiečių kurtsharas','Vokiečių pinčeris','Vokiečių špicas','Auksaspalvis retriveris','Flat coated retriveris','Čekų terjeras','Dandy dinmont terjeras','Silky terjeras','Skye terjeras','Sealyham terjeras','Airedale terjeras','Basenji','Bygl harjeras','Bloodhound (Šv. Huberto skalikas)','Whippet (Vipetas)','Grehaundas'];
	var BREEDS_CAT = ['Mišrūnė','Abisinijos','Amerikiečių trumpaplaukė','Amerikiečių garbanotoji','Balinezė','Bengalijos','Birmos šventoji','Bombėjaus','Britų ilgaplaukė','Britų trumpaplaukė','Burmos','Burmilos','Chartreux (Kartūzų)','Cornish Rex','Devon Rex','Donskojaus sfinksas','Egipto mau','Europos trumpaplaukė','Egzotinė trumpaplaukė','Havanos','Himalajų','Japonų bobteilas','Kanados sfinksas','Kimriko','Korato','Kurilų bobteilas','LaPerm','Meino meškėnas','Menkso','Munchkin','Nebelungo','Norvegų miško','Ociketė','Orientalinė','Persų','Peterboldas','Ragdoll','Rusų žydroji','Savana','Selkirk Rex','Siamo','Sibiro','Singapūros','Škotų nulėpausė (Scottish Fold)','Škotų stačiaausė (Scottish Straight)','Šartrų','Sfinksas','Somalio','Tailando','Tonkinezė','Turkų angora','Turkų vanas'];
	function dogSizeFromWeight(kg){
		if (!(kg > 0)) return null;
		if (kg < 10) return 'small';
		if (kg <= 25) return 'medium';
		return 'large';
	}
	function stageFromBirth(bd){
		if (!bd) return null;
		var t = Date.parse(bd + 'T00:00:00');
		if (isNaN(t) || t > Date.now()) return null;
		var y = (Date.now() - t) / 31557600000;
		if (y < 1) return 'junior';
		if (y < 7) return 'adult';
		return 'senior';
	}

	/** Gimimo data — LT selectai (Diena/Menuo/Metai), nes input[type=date] kalendorius
	 * rodomas narsykles kalba, ne svetaines. Etapo neklausiam — issivedam. */
	var MONTHS_LT = ['Sausis','Vasaris','Kovas','Balandis','Gegužė','Birželis','Liepa','Rugpjūtis','Rugsėjis','Spalis','Lapkritis','Gruodis'];
	function birthField(){
		var f = el('div', 'pspet-field');
		f.appendChild(el('label', 'pspet-label', 'Gimimo data <span class="pspet-sublabel">(jei žinote)</span>'));
		var cur = state.data.birth_date ? state.data.birth_date.split('-') : null; // [Y,M,D]
		var row = el('div', 'pspet-birth-row');
		function sel(cls){ var x = el('select', 'pspet-input ' + cls); x.style.padding = '10px'; return x; }
		var sD = sel('pspet-b-day'), sM = sel('pspet-b-month'), sY = sel('pspet-b-year');
		function opt(select, value, label){ var o = document.createElement('option'); o.value = value; o.textContent = label; select.appendChild(o); }
		opt(sD, '', 'Diena'); for (var d = 1; d <= 31; d++) opt(sD, String(d).padStart(2, '0'), String(d));
		opt(sM, '', 'Mėnuo'); MONTHS_LT.forEach(function(m, i){ opt(sM, String(i + 1).padStart(2, '0'), m); });
		var nowY = new Date().getFullYear();
		opt(sY, '', 'Metai'); for (var y = nowY; y >= 1990; y--) opt(sY, String(y), String(y));
		if (cur) { sY.value = cur[0]; sM.value = cur[1]; sD.value = cur[2]; }
		var hint = el('p', 'pspet-subtitle', '');
		function refresh(){
			if (sY.value && sM.value && sD.value) {
				var v = sY.value + '-' + sM.value + '-' + sD.value;
				var t = Date.parse(v + 'T00:00:00');
				if (isNaN(t) || t > Date.now()) { state.data.birth_date = null; hint.textContent = 'Patikrinkite datą.'; saveDraft(); return; }
				state.data.birth_date = v;
				var st = stageFromBirth(v);
				var map = { junior: 'jauniklis', adult: 'suaugęs', senior: 'senjoras' };
				hint.textContent = st ? ('Pagal datą — ' + map[st] + '. Amžiaus etapo atskirai klausti nereikės.') : '';
			} else { state.data.birth_date = null; hint.textContent = ''; }
			saveDraft();
		}
		sD.onchange = sM.onchange = sY.onchange = refresh;
		if (cur) refresh();
		row.appendChild(sD); row.appendChild(sM); row.appendChild(sY);
		f.appendChild(row);
		f.appendChild(hint);
		return f;
	}

	/** Veisle: datalist autocomplete + laisvas tekstas. "Misrunas" — pirmas sarase. */
	function breedField(sp){
		var f = el('div', 'pspet-field');
		f.appendChild(el('label', 'pspet-label', 'Veislė <span class="pspet-sublabel">(neprivaloma)</span>'));
		var listId = 'pspet-breeds-' + sp;
		var input = el('input', 'pspet-input');
		input.type = 'text';
		input.setAttribute('list', listId);
		input.placeholder = (sp === 'cat') ? 'Pvz. Britų trumpaplaukė arba Mišrūnė' : 'Pvz. Labradoro retriveris arba Mišrūnas';
		input.value = state.data.species_detail || '';
		input.oninput = function(){ state.data.species_detail = this.value || null; saveDraft(); };
		var dl = document.createElement('datalist');
		dl.id = listId;
		(sp === 'cat' ? BREEDS_CAT : BREEDS_DOG).forEach(function(b){
			var o = document.createElement('option'); o.value = b; dl.appendChild(o);
		});
		f.appendChild(input); f.appendChild(dl);
		return f;
	}

	/** Jautrumai: multi pasirinkimas + isskirtinis "Nezinoma / nepastebeta" + "Kita" laisvas tekstas. */
	var SENS_OPTS = [
		{ code: 'chicken', label: 'Vištiena' },
		{ code: 'beef', label: 'Jautiena' },
		{ code: 'grains', label: 'Grūdai' },
		{ code: 'dairy', label: 'Pieno produktai' },
		{ code: 'fish', label: 'Žuvis' },
		{ code: 'none', label: 'Jautrumų nepastebėjau' } // DoD#5: aktyvus "neturi" = 'none'; sena DB 'unknown' skaitoma kaip sinonimas
	];
	/**
	 * S230: JAUTRUMU FILTRAS. Profilio kodas -> katalogo pa_baltymu_saltinis terminai.
	 * SVARBU: slepiam tik tai, kas GAMINTOJO PAZYMETA kaip alergenas. Likes sarasas
	 * NERA "be vistienos" — 15% maisto neturi baltymo zymos visai. Todel antrastes
	 * tekstas sako, KA PADAREME, o ne ka garantuojame.
	 * 'dairy' cia NERA — kataloge pieno atributo neegzistuoja (patikrinta 2026-07-27).
	 */
	var SENS_TERMS = {
		chicken: ['Vištiena', 'Paukštiena'],
		beef:    ['Jautiena'],
		fish:    ['Lašiša', 'Žuvis (balta)', 'Tunas']
	};

	/** Grazina sutampanciu katalogo terminu sarasa (tuscias = nesutampa). */
	function sensHits(prod, csv){
		var out = [];
		if (!csv) return out;
		var codes = String(csv).split(',');
		var srcs = prod.protein_sources || [];
		codes.forEach(function(code){
			if (code === 'grains') { if (prod.has_grains === true) out.push('Grūdai'); return; }
			var terms = SENS_TERMS[code];
			if (!terms) return;                       // dairy/unknown/other — duomenu nera
			terms.forEach(function(t){
				if (srcs.indexOf(t) >= 0 && out.indexOf(t) < 0) out.push(t);
			});
		});
		return out;
	}

	/** Monoproteininiai be alergeno — i sarasо virsu (tyliai, be zenkliuku). */
	function sensSort(list, csv){
		return list.slice().sort(function(a, b){
			var am = (a.monoprotein === true && (a.protein_sources||[]).length) ? 0 : 1;
			var bm = (b.monoprotein === true && (b.protein_sources||[]).length) ? 0 : 1;
			return am - bm;
		});
	}

	function sensField(){
		var f = el('div', 'pspet-field');
		f.appendChild(el('label', 'pspet-label', 'Jautrumai / alergijos'));
		var raw = String(state.data.sensitivities || '');
		var parts = raw ? raw.split(',') : [];
		var codes = []; var other = '';
		parts.forEach(function(x){
			if (x.indexOf('other:') === 0) other = x.slice(6);
			else if (x) codes.push(x);
		});
		function commit(){
			var all = codes.slice();
			if (other) all.push('other:' + other);
			state.data.sensitivities = all.length ? all.join(',') : null;
			saveDraft();
		}
		var pills = el('div', 'pspet-pills');
		SENS_OPTS.forEach(function(o){
			var akt = codes.indexOf(o.code) >= 0 || (o.code === 'none' && codes.indexOf('unknown') >= 0);
			var b = el('button', 'pspet-pill' + (o.code === 'none' ? ' pspet-pill-unknown' : '') + (akt ? ' active' : ''), o.label);
			b.type = 'button';
			// Flatsome buttonams primeta uppercase — suvienodinam su kitu pill'u isvaizda.
			b.style.cssText = 'text-transform:none;letter-spacing:normal;font:inherit';
			b.onclick = function(){
				if (o.code === 'none') {
					var buvo = (codes.indexOf('none') >= 0 || codes.indexOf('unknown') >= 0);
					codes = buvo ? [] : ['none']; other = ''; oth.value = '';
				} else {
					var i = codes.indexOf(o.code);
					if (i >= 0) codes.splice(i, 1); else codes.push(o.code);
					['none','unknown'].forEach(function(z){ var u = codes.indexOf(z); if (u >= 0) codes.splice(u, 1); });
				}
				commit();
				pills.querySelectorAll('.pspet-pill').forEach(function(pb, idx){
					pb.classList.toggle('active', codes.indexOf(SENS_OPTS[idx].code) >= 0);
				});
			};
			pills.appendChild(b);
		});
		f.appendChild(pills);
		var oth = el('input', 'pspet-input');
		oth.type = 'text'; oth.placeholder = 'Kita (įrašykite)'; oth.style.marginTop = '8px';
		oth.value = other;
		oth.oninput = function(){
			other = this.value.replace(/,/g, ';').trim();
			if (other) { ['none','unknown'].forEach(function(z){ var u = codes.indexOf(z); if (u >= 0) codes.splice(u, 1); }); if (true) { pills.querySelectorAll('.pspet-pill').forEach(function(pb, idx){ pb.classList.toggle('active', codes.indexOf(SENS_OPTS[idx].code) >= 0); }); } }
			commit();
		};
		f.appendChild(oth);
		return f;
	}

	/** Suns dydis: suaugusiam siulomas pagal svori (galima pakeisti); jaunikliui — numatomas; galima praleisti. */
	function dogSizeField(){
		var stage = stageFromBirth(state.data.birth_date) || state.data.life_stage;
		var isPuppy = (stage === 'junior');
		var w = parseFloat(String(state.data._weight_kg || '').replace(',', '.'));
		var suggested = (!isPuppy) ? dogSizeFromWeight(w) : null;
		if (!state.data.dog_size && suggested) state.data.dog_size = suggested;
		var f = pillField(isPuppy ? 'Kokio dydžio šuo turėtų užaugti?' : 'Dydis', 'dog_size', [
			{ code: 'small', label: 'Mažas (iki 10 kg)' },
			{ code: 'medium', label: 'Vidutinis (10–25 kg)' },
			{ code: 'large', label: 'Didelis (25+ kg)' }
		]);
		if (suggested && state.data.dog_size === suggested) {
			f.appendChild(el('p', 'pspet-subtitle', 'Pasiūlyta pagal svorį — galite pakeisti.'));
		}
		if (isPuppy) f.appendChild(el('p', 'pspet-subtitle', 'Jei nežinote — galite praleisti.'));
		return f;
	}

	// ============ P1 WAU (2026-07-24) ============
	// Vienas duomenu saltinis: buildSections() suformuoja masyva KARTA per render().
	// Is jo generuojami: ziedo segmentai, accordion kortelese, "X is Y" tekstas, santraukos.
	// Niekas nebeskaiciuoja etapu is DOM sale-efekto.
	var STAGE_MASC = { junior:'jauniklis', adult:'suaugęs', senior:'senjoras' };
	var STAGE_FEM  = { junior:'jauniklė', adult:'suaugusi', senior:'senjorė' };
	var DOG_SIZE_LT = { small:'mažas', medium:'vidutinis', large:'didelis' };
	var HOUSING_LT  = { indoor:'namuose', outdoor:'lauke', mixed:'mišriai' };
	var FEED_LT     = { dry_only:'tik sausas maistas', dry_wet:'sausas ir šlapias', dry_home:'sausas ir naminis',
	                    dry_raw:'sausas ir žalias', wet_only:'tik šlapias', other:'kita' };
	// 2026-07-26 canonical maitinimo budai. Tik dry_wet leidzia misraus serimo perskaiciavima.
	var FEEDS = [
		{ code:'dry_only',   label:'Tik sausu maistu' },
		{ code:'dry_wet',    label:'Sausu ir šlapiu maistu' },
		{ code:'dry_home',   label:'Sausu ir naminiu maistu' },
		{ code:'dry_raw',    label:'Sausu ir žaliu / BARF' },
		{ code:'wet_only',   label:'Tik šlapiu maistu' },
		{ code:'other',      label:'Kita' }
	];
	// Greiti slapio maisto kiekiai pagal rusi (g per para).
	var WET_QUICK = { cat: [85, 170, 255], dog: [100, 200, 400] };
	var ACT_LT      = { low:'ramus', moderate:'vidutinis', high:'aktyvus' };

	function sensSummaryText(){
		var raw = String(state.data.sensitivities || '');
		if (!raw) return null;
		var codes = raw.split(',').filter(Boolean);
		if (!codes.length) return null;
		if (codes.indexOf('none') >= 0 || codes.indexOf('unknown') >= 0) return 'jautrumai nepastebėti';
		var lbl = { chicken:'vištiena', beef:'jautiena', grains:'grūdai', dairy:'pieno produktai', fish:'žuvis' };
		var names = codes.filter(function(c){ return c !== 'unknown' && c !== 'none'; }).map(function(c){
			return c.indexOf('other:') === 0 ? c.slice(6) : (lbl[c] || c);
		});
		return names.length ? ('jautrumai: ' + names.join(', ')) : null;
	}

	/** VIENAS saltinis tiesai: sekciju masyvas siai rusiai. Kiekviena — id/ikona/pavadinimas/
	 * intro/raktai(edit-mode atstatymui)/DOM laukai(jau nufiltruoti)/santraukos generatorius. */
	function buildSections(){
		var sp = state.data.species;
		var list = [];
		if (sp === 'dog' || sp === 'cat') {
			var isDog = (sp === 'dog');
			var STAGE = isDog ? STAGE_MASC : STAGE_FEM;
			list.push({
				id:'about', icon:'&#128062;', title:'Pagrindinė informacija', intro:null,
				keys:['birth_date'].concat(isDog ? ['dog_size'] : []).concat(['species_detail']),
				fields:[ birthField(), isDog ? dogSizeField() : null, full(breedField(sp)) ].filter(Boolean),
				summary:function(d){
					var p = [];
					var st = stageFromBirth(d.birth_date); if (st && STAGE[st]) p.push(STAGE[st]);
					if (d._weight_kg) p.push(String(d._weight_kg).replace('.', ',') + ' kg');
					if (isDog && d.dog_size && DOG_SIZE_LT[d.dog_size]) p.push(DOG_SIZE_LT[d.dog_size]);
					if (d.species_detail) p.push(d.species_detail);
					// S277: jei sekcija uzverta, o gimimo datos nera — pasakom TIESIAI.
					// Kitaip zmogus net nezino, kad toks laukas egzistuoja.
					if (!d.birth_date) { p.push('gimimo data nenurodyta'); }
					return p.length ? p.join(' · ') : 'Galite papildyti bet kada.';
				}
			});
			list.push({
				id:'wellbeing', icon:'&#128154;', title:'Savijauta ir poreikiai',
				intro:'Ši informacija padės tiksliau pritaikyti mitybos ir priežiūros pasiūlymus.',
				keys:['is_sterilised','activity_hint','sensitivities','primary_need'],
				fields:[
					pillField('Ar sterilizuotas' + (sp === 'cat' ? 'a' : '') + '?', 'is_sterilised', [
						{ code:'yes', label:'Taip' }, { code:'no', label:'Ne' }, { code:'unknown', label:'Nežinau' }
					]),
					pillField('Aktyvumo lygis', 'activity_hint', [
						{ code:'low', label:'Ramus' }, { code:'moderate', label:'Vidutinis' }, { code:'high', label:'Labai aktyvus' }
					]),
					full(sensField()),
					full(needField())
				],
				summary:function(d){
					var p = [];
					if (d.is_sterilised === 'yes') p.push('sterilizuot' + (sp === 'cat' ? 'a' : 'as'));
					else if (d.is_sterilised === 'no') p.push('nesterilizuot' + (sp === 'cat' ? 'a' : 'as'));
					if (d.activity_hint && ACT_LT[d.activity_hint]) p.push(ACT_LT[d.activity_hint] + ' aktyvumas');
					var sens = sensSummaryText(); if (sens) p.push(sens);
					// 'none' = sazinigas "nieko is siu" — santraukoje nerodom kaip poreikio.
					// 'other' — rodom irasyta teksta, jei yra.
					if (d.primary_need === 'other') {
						p.push(d.primary_need_other ? d.primary_need_other.toLowerCase() : 'kita');
					} else if (d.primary_need && d.primary_need !== 'none') {
						var n = NEEDS.filter(function(x){ return x.code === d.primary_need; })[0];
						if (n) p.push(n.label.toLowerCase());
					}
					return p.length ? p.join(' · ') : 'Galite papildyti bet kada.';
				}
			});
			list.push({
				id:'daily', icon:'&#127860;', title:'Kasdienybė ir mityba', intro:null,
				keys:['housing','feeding_type','current_food_brand','current_food_free_text'],
				fields:[
					pillField('Laikymo sąlygos', 'housing', [
						{ code:'indoor', label:'Namuose' }, { code:'outdoor', label:'Lauke' }, { code:'mixed', label:'Mišriai' }
					]),
					full(feedField()),
					// S245: 'wet_only' rezimu SAUSO maisto neklausiam — profilis ji
					// vis tiek ignoruotu (activeFood: wet_only -> tik slapias), o
					// zmogui atrodytu, kad ivestis „neissisaugo". Slapias produktas
					// pasirenkamas mitybos plane, kur matosi pakuotes ir kaina.
					full(state.data.feeding_type === 'wet_only' ? wetFoodNote() : foodAutocomplete())
				],
				summary:function(d){
					var p = [];
					if (d.housing && HOUSING_LT[d.housing]) p.push(HOUSING_LT[d.housing]);
					if (d.feeding_type && FEED_LT[d.feeding_type]) p.push(FEED_LT[d.feeding_type]);
					var food = d.current_food_brand || d.current_food_free_text;
					if (food) p.push(food);
					return p.length ? p.join(' · ') : 'Galite papildyti bet kada.';
				}
			});
		} else if (sp === 'bird' || sp === 'rodent') {
			// Minimalus profilis (Raimio sprendimas 2026-07-25): pagrindine prekyba = suo/kate.
			// Grauzikui/pauksciui NErenkam mesedziu alergenu, aktyvumo, laikymo — tik rusis + data.
			// Viena atvira sekcija (multi=false → be ziedo, be accordion ceremonijos).
			list.push({
				id:'about', icon:'&#128062;', title:'Pagrindinė informacija', intro:null,
				keys:['species_detail','birth_date'],
				fields:[
					textField(sp === 'bird' ? 'Paukščio rūšis' : 'Graužiko rūšis', 'species_detail',
						sp === 'bird' ? 'Pvz. papūgėlė, kakariki, žako...' : 'Triušis, jūrų kiaulytė, žiurkėnas...'),
					birthField()
				],
				summary:null
			});
		} else if (sp === 'fish') {
			list.push({
				id:'about', icon:'&#128062;', title:'Apie akvariumą', intro:null, keys:['species_detail'],
				fields:[ pillField('Akvariumas', 'species_detail', [
					{ code:'freshwater', label:'Gėlavandenis' }, { code:'marine', label:'Jūrinis / sūraus vandens' }, { code:'pond', label:'Tvenkinys' }
				]) ], summary:null
			});
		} else if (sp === 'reptile') {
			list.push({
				id:'about', icon:'&#128062;', title:'Pagrindinė informacija', intro:null, keys:['species_detail','birth_date'],
				fields:[ textField('Rūšis', 'species_detail', 'Pvz. barzdotoji agama, leopardinis gekonas...'), birthField() ],
				summary:null
			});
		} else {
			list.push({
				id:'about', icon:'&#128062;', title:'Apie augintinį', intro:null, keys:['species_detail'],
				fields:[ textField('Kokį augintinį turite?', 'species_detail', 'Trumpai aprašykite') ], summary:null
			});
		}
		return list;
	}

	function sectionHasValue(sec){
		return sec.keys.some(function(k){
			var v = state.data[k];
			return v !== null && v !== undefined && v !== '' && v !== '[]';
		});
	}

	function full(x){ if (x) x.classList.add('pspet-span2'); return x; }

	function renderStep2(){
		root.innerHTML = '';
		var wrap = el('div', 'pspet-wrap');
		var sp = state.data.species;
		var SECTIONS = buildSections();
		var multi = SECTIONS.length > 1;

		// Pirma initializacija (naujam mount'ui) — su edit-mode atstatymu (Raimio saugiklis #2):
		// jei augintinis JAU turi realiu duomenu, progresas negali startuoti nuo tuscio zaido.
		if (state.sectionIdx === undefined || state.confirmedSections === undefined) {
			/* S277 KLAIDA IŠTAISYTA: sectionHasValue() naudoja .some() — sekcija
			 * laikoma „padaryta", jei užpildytas BENT VIENAS jos laukas. Kuriant
			 * naują augintinį užtekdavo pasirinkti veislę ar dydį, ir „Pagrindinė
			 * informacija" užsidarydavo su NEĮVESTA gimimo data — žmogus jos
			 * nebematydavo ir net nežinodavo, kad ji egzistuoja.
			 * Ši išankstinė logika parašyta REDAGAVIMUI (kad esamas augintinis
			 * neprasidėtų nuo tuščio progreso žiedo). KURIANT nauja — netaikom:
			 * žmogus pereina visas sekcijas iš eilės. */
			var isEditMode = !!state.editPetId;
			var confirmed = [];
			var firstOpen = 0; var foundOpen = false;
			if (isEditMode) {
				SECTIONS.forEach(function(sec, i){
					if (sectionHasValue(sec)) { confirmed.push(sec.id); }
					else if (!foundOpen) { firstOpen = i; foundOpen = true; }
				});
				if (!foundOpen) firstOpen = SECTIONS.length - 1;
			}
			state.confirmedSections = confirmed;
			state.sectionIdx = multi ? firstOpen : 0;
		}
		// Jei rusis pasikeitė (atgal į 1 žingsnį ir vėl į priekį) — sectionIdx gali islipti uz ribu.
		if (state.sectionIdx >= SECTIONS.length) state.sectionIdx = SECTIONS.length - 1;

		// ---------- HERO: avataras (paprastas ARBA ziede) + vardas (be linksniavimo) ----------
		var name = (state.data.pet_name || '').trim();
		var hero = el('div', 'pspet-hero');
		var avatarHtml = state.data.photo_url ? ('<img src="' + state.data.photo_url + '" alt="">') : speciesIcon();
		var avatarBox;
		if (multi) {
			avatarBox = el('div', 'pspet-ring-wrap');
			var n = SECTIONS.length;
			var r = 37, circ = 2 * Math.PI * r;
			var gap = 6; // vizualinis tarpas tarp segmentu
			var segLen = (circ - n * gap) / n;
			var svgNS = 'http://www.w3.org/2000/svg';
			var svg = document.createElementNS(svgNS, 'svg');
			svg.setAttribute('viewBox', '0 0 84 84');
			svg.setAttribute('class', 'pspet-ring-svg');
			var offset = 0;
			SECTIONS.forEach(function(sec, i){
				var c = document.createElementNS(svgNS, 'circle');
				c.setAttribute('cx', 42); c.setAttribute('cy', 42); c.setAttribute('r', r);
				c.setAttribute('class', 'pspet-ring-seg' + (state.confirmedSections.indexOf(sec.id) >= 0 ? ' done' : ''));
				c.setAttribute('stroke-dasharray', segLen + ' ' + (circ - segLen));
				c.setAttribute('stroke-dashoffset', -offset);
				svg.appendChild(c);
				offset += segLen + gap;
			});
			avatarBox.appendChild(svg);
			var avSmall = el('div', 'pspet-ring-avatar');
			avSmall.innerHTML = avatarHtml;
			avatarBox.appendChild(avSmall);
		} else {
			avatarBox = el('div', 'pspet-hero-avatar');
			avatarBox.innerHTML = avatarHtml;
		}
		hero.appendChild(avatarBox);
		var ht = el('div', 'pspet-hero-text');
		ht.appendChild(el('h2', 'pspet-title', name ? (name + ' — susipažinkime geriau') : 'Susipažinkime geriau'));
		var promise;
		if (sp === 'dog' || sp === 'cat') {
			promise = 'Padės tiksliau apskaičiuoti mitybą, tvarkyti priminimus ir vėliau atrinkti tinkamesnius produktus.';
		} else if (sp === 'fish') {
			promise = 'Padės tvarkyti akvariumo priežiūrą, priminimus ir vėliau atrinkti tinkamesnes prekes.';
		} else {
			promise = 'Padės tvarkyti augintinio priežiūrą, priminimus ir vėliau atrinkti tinkamesnes prekes.';
		}
		ht.appendChild(el('p', 'pspet-subtitle', promise));
		if (multi) {
			var ringtext = el('div', 'pspet-ringtext');
			ringtext.textContent = state.confirmedSections.length + ' iš ' + SECTIONS.length + ' dalių paruošta';
			ht.appendChild(ringtext);
		}
		hero.appendChild(ht);
		wrap.appendChild(hero);

		// ---------- SEKCIJOS ----------
		var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		if (!multi) {
			// Viena sekcija (roplys/žuvis/kitas) — BE accordion ceremonijos, tiesiog atviras blokas.
			var only = SECTIONS[0];
			var sec = el('div', 'pspet-section pspet-section-single');
			var h = el('h3', 'pspet-section-title');
			h.innerHTML = '<span class="pspet-section-ico">' + only.icon + '</span>' + only.title;
			sec.appendChild(h);
			var body = el('div', 'pspet-section-body');
			only.fields.forEach(function(f){ body.appendChild(f); });
			sec.appendChild(body);
			wrap.appendChild(sec);
		} else {
			var stepsWrap = el('div', 'pspet-steps');
			SECTIONS.forEach(function(sec, i){
				var isDone = state.confirmedSections.indexOf(sec.id) >= 0 && i !== state.sectionIdx;
				var isActive = (i === state.sectionIdx);
				var isLocked = !isDone && !isActive && i > state.sectionIdx;
				// Busenos klases su pspet- prefiksu — bendriniai "done"/"active"/"locked" kolizavo
				// su svetaines globaliu CSS (rasta 2026-07-24: .done{display:none} kazkur teminiame/plugin CSS).
				var card = el('div', 'pspet-step' + (isDone ? ' pspet-is-done' : '') + (isActive ? ' pspet-is-active' : '') + (isLocked ? ' pspet-is-locked' : ''));

				var headId = 'pspet-sec-head-' + sec.id;
				var bodyId = 'pspet-sec-body-' + sec.id;
				var head;
				if (isLocked) {
					head = el('div', 'pspet-step-head');
					head.setAttribute('aria-disabled', 'true');
				} else {
					head = document.createElement('button');
					head.type = 'button';
					head.className = 'pspet-step-head';
					head.id = headId;
					head.setAttribute('aria-expanded', isActive ? 'true' : 'false');
					head.setAttribute('aria-controls', bodyId);
					head.onclick = function(){
						if (isActive) return;
						state.sectionIdx = i;
						render();
						setTimeout(function(){
							var b = document.getElementById('pspet-sec-head-' + sec.id);
							if (b) b.focus();
						}, reduceMotion ? 0 : 60);
					};
				}
				var num = el('div', 'pspet-step-num');
				num.innerHTML = '<span class="n">' + (i + 1) + '</span><span class="c">&#10003;</span>';
				head.appendChild(num);
				var title = el('div', 'pspet-step-title');
				title.appendChild(el('div', 't', sec.title));
				title.appendChild(el('div', 's', (isDone && sec.summary) ? sec.summary(state.data) : (isActive ? '' : 'Dar nepasiekta')));
				head.appendChild(title);
				if (!isLocked) {
					var chev = el('div', 'pspet-chevron', '');
					chev.innerHTML = '&#9662;';
					chev.setAttribute('aria-hidden', 'true');
					head.appendChild(chev);
				}
				card.appendChild(head);

				if (isActive) {
					var bodyEl = el('div', 'pspet-step-body');
					bodyEl.id = bodyId;
					bodyEl.setAttribute('role', 'region');
					bodyEl.setAttribute('aria-labelledby', headId);
					if (sec.intro) bodyEl.appendChild(el('p', 'pspet-section-intro', sec.intro));
					var fbody = el('div', 'pspet-section-body');
					sec.fields.forEach(function(f){ fbody.appendChild(f); });
					bodyEl.appendChild(fbody);
					card.appendChild(bodyEl);
				}
				stepsWrap.appendChild(card);
			});
			wrap.appendChild(stepsWrap);
		}

		// ---------- STICKY VEIKSMU JUOSTA ----------
		var isLast = !multi || (state.sectionIdx === SECTIONS.length - 1);
		var bar = el('div', 'pspet-actions-sticky');
		var savelater = el('button', 'pspet-skip pspet-savelater', 'Išsaugoti ir baigti vėliau');
		savelater.type = 'button';
		savelater.onclick = function(){ submitProfile(); };
		bar.appendChild(savelater);
		var actions = el('div', 'pspet-actions');
		var btnBack = el('button', 'pspet-btn pspet-btn-secondary', 'Atgal');
		btnBack.type = 'button';
		btnBack.onclick = function(){
			if (multi && state.sectionIdx > 0) { state.sectionIdx--; render(); return; }
			state.step = 1; saveDraft(); render();
		};
		var btnNext = el('button', 'pspet-btn pspet-btn-primary', isLast ? 'Išsaugoti profilį' : 'Toliau');
		btnNext.type = 'button';
		btnNext.onclick = function(){
			if (multi) {
				var curId = SECTIONS[state.sectionIdx].id;
				if (state.confirmedSections.indexOf(curId) < 0) state.confirmedSections.push(curId);
			}
			if (isLast) { saveDraft(); finishProfile(); return; }
			saveDraft();
			state.sectionIdx++;
			render();
			setTimeout(function(){
				var nid = 'pspet-sec-head-' + SECTIONS[state.sectionIdx].id;
				var b = document.getElementById(nid);
				if (b) b.focus();
			}, reduceMotion ? 0 : 60);
		};
		actions.appendChild(btnBack); actions.appendChild(btnNext);
		bar.appendChild(actions);

		// Slapuku juosta neturi uzdengti veiksmu mygtuku.
		try {
			var cb = document.querySelector('.cmplz-cookiebanner, #cmplz-cookiebanner-container');
			if (cb && cb.offsetHeight > 0 && cb.offsetParent !== null) {
				bar.style.bottom = 'calc(env(safe-area-inset-bottom, 0px) + ' + (cb.offsetHeight + 8) + 'px)';
			}
		} catch (e) {}

		wrap.appendChild(bar);
		root.appendChild(wrap);
	}

	/** Baigties ekranas — TIK po sekmingo backend issaugojimo (Raimio saugiklis #3).
	 * Neutralu, be vardo linksniavimo. */
	function renderComplete(){
		root.innerHTML = '';
		var wrap = el('div', 'pspet-wrap');
		var done = el('div', 'pspet-done-screen');
		var ring = el('div', 'pspet-done-ring'); ring.innerHTML = '&#10003;';
		done.appendChild(ring);
		done.appendChild(el('h2', null, 'Profilio pagrindas paruoštas'));
		done.appendChild(el('p', null, 'Visa augintinio informacija, mityba ir priminimai dabar yra vienoje vietoje.'));
		var btn = el('button', 'pspet-btn pspet-btn-primary', 'Atidaryti profilį');
		btn.type = 'button';
		btn.onclick = function(){ openSavedProfile(); };
		done.appendChild(btn);
		wrap.appendChild(done);
		root.appendChild(wrap);
	}

	/**
	 * "Kas siuo metu aktualiausia?" — vienas neprivalomas pasirinkimas.
	 * Pasirinkus "Kita" atsiveria trumpas laukas (150 simb.). Issaugojimo NEBLOKUOJAM:
	 * 'other' be teksto irgi yra signalas — musu sarasas per siauras.
	 */
	function needField(){
		var f = el('div', 'pspet-field');
		f.appendChild(el('label', 'pspet-label', 'Kas šiuo metu aktualiausia?'));
		var hint = el('div', null, 'Pasirinkti neprivaloma.');
		hint.style.cssText = 'font-size:12.5px;color:#8A968C;margin:-4px 0 8px';
		f.appendChild(hint);

		var pills = el('div', 'pspet-pills');
		NEEDS.forEach(function(opt){
			var p = el('div', 'pspet-pill' + (state.data.primary_need === opt.code ? ' active' : ''), opt.label);
			p.onclick = function(){
				state.data.primary_need = (state.data.primary_need === opt.code) ? null : opt.code;
				// Tekstas prasmingas tik su 'other' — kitaip valom.
				if (state.data.primary_need !== 'other') state.data.primary_need_other = null;
				saveDraft(); renderStep2();
			};
			pills.appendChild(p);
		});
		f.appendChild(pills);

		if (state.data.primary_need === 'other') {
			var oth = el('input', 'pspet-input');
			oth.type = 'text';
			oth.maxLength = 150;
			oth.placeholder = 'Trumpai patikslinkite, kas aktualu';
			oth.style.marginTop = '8px';
			oth.value = state.data.primary_need_other || '';
			oth.oninput = function(){
				var v = this.value.slice(0, 150).trim();
				state.data.primary_need_other = v || null;
				saveDraft();
			};
			f.appendChild(oth);
		}
		return f;
	}

	/**
	 * "Kuo dazniausiai maitinate?" — vienas neprivalomas pasirinkimas.
	 * "Kita" atveria trumpa laukа; "Sausu ir slapiu" atveria slapio kiekio klausima,
	 * nes TIK sis variantas leidzia orientacini misraus serimo perskaiciavima.
	 */
	function feedField(){
		var f = el('div', 'pspet-field');
		f.appendChild(el('label', 'pspet-label', 'Kuo dažniausiai maitinate?'));
		var hint = el('div', null, 'Pasirinkti neprivaloma.');
		hint.style.cssText = 'font-size:12.5px;color:#8A968C;margin:-4px 0 8px';
		f.appendChild(hint);

		var pills = el('div', 'pspet-pills');
		FEEDS.forEach(function(opt){
			var p = el('div', 'pspet-pill' + (state.data.feeding_type === opt.code ? ' active' : ''), opt.label);
			p.onclick = function(){
				state.data.feeding_type = (state.data.feeding_type === opt.code) ? null : opt.code;
				if (state.data.feeding_type !== 'other')   state.data.feeding_type_other = null;
				if (state.data.feeding_type !== 'dry_wet' && state.data.feeding_type !== 'wet_only') state.data.wet_food_g = null;
				saveDraft(); renderStep2();
			};
			pills.appendChild(p);
		});
		f.appendChild(pills);

		if (state.data.feeding_type === 'other') {
			var oth = el('input', 'pspet-input');
			oth.type = 'text'; oth.maxLength = 150;
			oth.placeholder = 'Trumpai patikslinkite, kuo maitinate';
			oth.style.marginTop = '8px';
			oth.value = state.data.feeding_type_other || '';
			oth.oninput = function(){
				var v = this.value.slice(0, 150).trim();
				state.data.feeding_type_other = v || null;
				saveDraft();
			};
			f.appendChild(oth);
		}

		// S231: slapio kiekio klausimas reikalingas IR dry_wet (misriam iverciui),
		// IR wet_only (ten tai vienintelis kiekio saltinis visam planui).
		if (state.data.feeding_type === 'dry_wet' || state.data.feeding_type === 'wet_only') {
			f.appendChild(wetAmountBlock());
		}
		return f;
	}

	/**
	 * Slapio maisto kiekis per para.
	 * SVARBU (Raimio uzrakinta 2026-07-27): greitieji kiekiai rodomi TIK 'dry_wet' —
	 * ten jie turi GAMINTOJO pagrinda (misraus serimo lenteles: katei 85/170/255,
	 * suniui 100/200/400). 'wet_only' atveju NESIULOM JOKIU SKAICIU: normos
	 * neskaiciuojam ir nesiulom, kieki zino pats zmogus. Bet koks musu pasiulytas
	 * dydis butu isvestas skaicius be pagrindo — ta pati taisykle kaip sausam maistui.
	 */
	function wetAmountBlock(){
		var wetOnly = (state.data.feeding_type === 'wet_only');
		var w = el('div', null);
		w.style.cssText = 'margin-top:14px;padding-top:12px;border-top:1px solid #EFEAE0';
		w.appendChild(el('label', 'pspet-label', 'Kiek visaverčio šlapio maisto gauna per dieną?'));
		var h = el('div', null, wetOnly
			? 'Neprivaloma. Įrašykite, kiek duodate — pvz. 2 skardinės po 400 g = 800.'
			: 'Neprivaloma. Padeda tiksliau apskaičiuoti sauso maisto dalį.');
		h.style.cssText = 'font-size:12.5px;color:#8A968C;margin:-4px 0 8px';
		w.appendChild(h);

		var cur = state.data.wet_food_g ? parseInt(state.data.wet_food_g, 10) : null;

		// Greitieji TIK misriam serimui.
		if (!wetOnly) {
			var sp = state.data.species === 'cat' ? 'cat' : 'dog';
			var quick = WET_QUICK[sp] || WET_QUICK.dog;
			var pills = el('div', 'pspet-pills');
			quick.forEach(function(g){
				var p = el('div', 'pspet-pill' + (cur === g ? ' active' : ''), g + ' g');
				p.onclick = function(){
					state.data.wet_food_g = (cur === g) ? null : g;
					saveDraft(); renderStep2();
				};
				pills.appendChild(p);
			});
			w.appendChild(pills);
		}

		var inp = el('input', 'pspet-input');
		inp.type = 'number'; inp.min = '0'; inp.max = '3000'; inp.step = '5';
		inp.placeholder = wetOnly ? 'Kiekis per dieną, g' : 'Kitas kiekis, g';
		inp.style.marginTop = wetOnly ? '0' : '8px';
		if (cur && (wetOnly || (WET_QUICK[state.data.species === 'cat' ? 'cat' : 'dog'] || []).indexOf(cur) < 0)) inp.value = cur;
		inp.oninput = function(){
			var v = parseInt(this.value, 10);
			state.data.wet_food_g = (!isNaN(v) && v > 0) ? Math.min(v, 3000) : null;
			saveDraft();
		};
		w.appendChild(inp);
		return w;
	}

	function pillField(label, key, options){
		var f = el('div', 'pspet-field');
		f.appendChild(el('label', 'pspet-label', label));
		var pills = el('div', 'pspet-pills');
		options.forEach(function(opt){
			var p = el('div', 'pspet-pill' + (state.data[key] === opt.code ? ' active' : ''), opt.label);
			p.onclick = function(){
				state.data[key] = (state.data[key] === opt.code) ? null : opt.code;
				saveDraft(); renderStep2();
			};
			pills.appendChild(p);
		});
		f.appendChild(pills);
		return f;
	}

	function textField(label, key, placeholder){
		var f = el('div', 'pspet-field');
		f.appendChild(el('label', 'pspet-label', label + ' <span class="pspet-sublabel">(neprivaloma)</span>'));
		var input = el('input', 'pspet-input');
		input.type = 'text';
		input.placeholder = placeholder;
		input.value = state.data[key] || '';
		input.oninput = function(){ state.data[key] = this.value || null; saveDraft(); };
		f.appendChild(input);
		return f;
	}

	/** wet_only: paaiskinam, kur pasirenkamas slapias maistas. */
	function wetFoodNote(){
		var f = el('div', 'pspet-field');
		f.appendChild(el('label', 'pspet-label', 'Dabartinis maistas'));
		var t = el('div', null, 'Šeriate tik šlapiu maistu — konkrečius konservus pasirinksite mitybos plane, kur iš karto matysite pakuotes, kainą ir kiek jų užteks.');
		t.style.cssText = 'font-size:12.5px;color:#8A968C;line-height:1.45;margin-top:-2px';
		f.appendChild(t);
		return f;
	}

	function foodAutocomplete(){
		var f = el('div', 'pspet-field');
		f.appendChild(el('label', 'pspet-label', 'Dabartinis maistas <span class="pspet-sublabel">(neprivaloma)</span>'));
		var ac = el('div', 'pspet-autocomplete');
		var input = el('input', 'pspet-input');
		input.type = 'text';
		input.placeholder = 'Pradėkite rašyti brendą...';
		input.value = state.data.current_food_brand || state.data.current_food_free_text || '';
		var sug = el('div', 'pspet-suggestions');

		var timer = null;
		input.oninput = function(){
			var q = this.value;
			// S211: rankinis tekstas = zmogus NEPASIRINKO produkto. Saugom tik free_text,
			// kad sistemoje neatrodytu, jog pasirinktas konkretus produktas.
			state.data.current_food_free_text = q || null;
			state.data.current_food_brand = null;
			clearProductIdentity();
			saveDraft();
			if (timer) clearTimeout(timer);
			if (q.length < 2) { sug.classList.remove('open'); return; }
			timer = setTimeout(function(){ fetchBrands(q, sug, input); }, 250);
		};
		ac.appendChild(input);
		ac.appendChild(sug);
		f.appendChild(ac);

		// Specialūs pasirinkimai
		var special = el('div', 'pspet-special-opts');
		// P0-4 (2026-07-24): greiti pasirinkimai NEBERASO sentinel teksto i maisto laukus.
		// current_food_free_text = tik REALUS vartotojo iraso maisto tekstas.
		// "Nezinau tikslaus pavadinimo" -> abu laukai tusti.
		// "Kitas maistas" -> isvalo ir leidzia irasyti realu pavadinima.
		// "Neseriu sausu maistu" is P0 ISIMTAS. feeding_type enum (2026-07-26):
		// dry_only|dry_wet|wet_only|dry_home|dry_raw|other
		// tokios reiksmes neturi, o teksto i maisto lauka nerasom.
		[['Nežinau tikslaus pavadinimo','unknown'],['Kitas maistas','other']].forEach(function(o){
			var b = el('button', 'pspet-special-opt', o[0]);
			b.onclick = function(){
				input.value = '';
				state.data.current_food_free_text = null;
				state.data.current_food_brand = null;
				clearProductIdentity();
				sug.classList.remove('open');
				special.querySelectorAll('.pspet-special-opt').forEach(function(x){ x.classList.remove('active'); });
				if (o[1] === 'unknown') { b.classList.add('active'); }
				else { input.focus(); }
				saveDraft();
			};
			special.appendChild(b);
		});
		f.appendChild(special);
		return f;
	}

	// S210: vietoj vien brendu — KONKRETUS PRODUKTAI (refill varikliui reikia primary_product_id).
	// Dvi grupes: produktai (pirmos), brendai (fallback zemiau).
	// S211: viena vieta, kur nutraukiamas rysys su konkreciu produktu.
	function clearProductIdentity(){
		state.data.primary_product_id      = null;
		state.data.primary_product_sku     = null;
		state.data.primary_product_name    = null;
		state.data.primary_product_package = null;
	}

	/** Dropdown'o kryptis pagal realia vieta ekrane. */
	function flipIfNeeded(sug, input){
		try {
			sug.classList.remove('pspet-up');
			var anchor = input || sug;
			var r = anchor.getBoundingClientRect();
			var need = Math.min(sug.scrollHeight || 240, 340) + 16;
			var below = window.innerHeight - r.bottom;
			var above = r.top;
			// Verciam tik jei apacioje tikrai trumpa, o virsuje vietos daugiau.
			if (below < need && above > below) sug.classList.add('pspet-up');
		} catch (e) {}
	}

	function fetchBrands(q, sug, input){
		var wq = '';
		var w = parseFloat(String(state.data._weight_kg || '').replace(',', '.'));
		if (!isNaN(w) && w > 0) { wq = '&weight_kg=' + encodeURIComponent(w); }
		fetch(REST + '/food-search?q=' + encodeURIComponent(q) + '&species=' + encodeURIComponent(state.data.species) + wq)
			.then(function(r){ return r.json(); })
			.then(function(data){
				sug.innerHTML = '';
				var prods = (data && data.products) || [];
				// S230: jautrumu filtras. Numatytai slepiam sutampancius; „Rodyti visus" grazina.
				var csv = state.data.sensitivities || '';
				var showAll = !!state._sensShowAll;
				var hidden = 0;
				if (csv && !showAll) {
					var kept = prods.filter(function(pr){ return sensHits(pr, csv).length === 0; });
					hidden = prods.length - kept.length;
					// Saugiklis: jei liko per mazai, atlaisvinam ir pasakom atvirai.
					if (kept.length < 5 && prods.length >= 5) { hidden = 0; state._sensRelaxed = true; }
					else { prods = kept; state._sensRelaxed = false; }
				}
				prods = sensSort(prods, csv);
				var brands = (data && data.brands) || [];
				if (!prods.length && !brands.length) { sug.classList.remove('open'); return; }

				if (csv && (hidden > 0 || showAll || state._sensRelaxed)) {
					var bar = el('div', null);
					bar.style.cssText = 'display:flex;justify-content:space-between;align-items:center;gap:8px;padding:9px 14px;background:#FBF9F4;border-bottom:1px solid #EFEAE0;font-size:12.5px;color:#7A867C';
					var txt = state._sensRelaxed
						? 'Pagal jūsų jautrumus radome mažai — rodome platesnį sąrašą'
						: (showAll ? 'Rodomi visi produktai' : 'Pritaikyta pagal profilį · paslėpta ' + hidden);
					bar.appendChild(el('span', null, txt));
					if (!state._sensRelaxed) {
						var tgl = el('button', null, showAll ? 'Filtruoti' : 'Rodyti visus');
						tgl.style.cssText = 'background:none;border:none;color:#2F6B4F;font:inherit;font-weight:650;cursor:pointer;white-space:nowrap;text-decoration:underline';
						tgl.onclick = function(e){ e.stopPropagation(); state._sensShowAll = !showAll; fetchBrands(q, sug, input); };
						bar.appendChild(tgl);
					}
					sug.appendChild(bar);
				}
				prods.forEach(function(pr){
					var s = el('div', 'pspet-suggestion');
					var hits = sensHits(pr, csv);
					var line1 = el('div', 'pspet-sug-name', pr.name);
					s.appendChild(line1);
					var bits = [];
					if (pr.brand) bits.push(pr.brand);
					if (pr.package) bits.push(pr.package);
					if (bits.length) {
						var line2 = el('div', 'pspet-sug-meta', bits.join(' · '));
						s.appendChild(line2);
					}
					// S230: ispejimas rodo TIKRA katalogo termina — teiginys lieka tikslus
					// net kai terminas platesnis uz profilio koda (pvz. „Paukštiena").
					if (hits.length) {
						var w = el('div', null, '\u26A0 ' + hits.join(', ') + ' \u2014 profilyje pažymėtas jautrumas');
						w.style.cssText = 'font-size:12px;color:#B4553F;margin-top:3px;line-height:1.35';
						s.appendChild(w);
					}
					s.onclick = function(){
						input.value = pr.name;
						// S211: saugom PRODUKTO TAPATYBE, ne matoma teksta. Refill'ui reikia
						// zinoti KURI pakuote zmogus perka; produktas gali buti pervadintas,
						// todel snapshot'as (name+sku+package) issaugo pasirinkima.
						state.data.primary_product_id      = pr.id;
						state.data.primary_product_sku     = pr.sku || null;
						state.data.primary_product_name    = pr.name;
						state.data.primary_product_package = pr.package || null;
						state.data.current_food_brand      = pr.brand || null;
						state.data.current_food_free_text  = null; // pasirinktas produktas != laisvas tekstas
						sug.classList.remove('open');
						saveDraft();
					};
					sug.appendChild(s);
				});

				if (brands.length) {
					var lbl = el('div', 'pspet-suggestion-group', 'Prekės ženklai');
					lbl.style.fontSize = '12px';
					lbl.style.color = '#888';
					lbl.style.padding = '6px 12px 2px';
					lbl.style.textTransform = 'uppercase';
					sug.appendChild(lbl);
					brands.forEach(function(b){
						var s = el('div', 'pspet-suggestion', b.name);
						s.onclick = function(){
							input.value = b.name;
							clearProductIdentity();
							state.data.current_food_brand = b.name;
							state.data.current_food_free_text = null;
							sug.classList.remove('open');
							saveDraft();
						};
						sug.appendChild(s);
					});
				}
				sug.classList.add('open');
				// S251: jei apacioje vietos nepakanka (lipni juosta + ekrano krastas),
				// atidarom I VIRSU. Kitaip rezultatai lieka uz matomos srities.
				flipIfNeeded(sug, input);
			})
			.catch(function(){ sug.classList.remove('open'); });
	}

	/** S287: ką jau perėmėm iš skaičiuoklės — žmogus turi matyti, kad jo darbas
	 *  neprapuolė ir kad klausiam tik to, ko dar nežinom. */
	function handoffNote(){
		var h = state.handoff;
		if (!h) { return null; }
		var parts = [];
		if (state.data.species) {
			parts.push(state.data.species === 'cat' ? 'katė' : (state.data.species === 'dog' ? 'šuo' : null));
		}
		if (h.weight_kg) { parts.push(String(h.weight_kg).replace('.', ',') + ' kg'); }
		parts = parts.filter(Boolean);
		if (!parts.length && !h.product_name) { return null; }
		var box = el('div', 'pspet-handoff');
		var t = el('div', 'pspet-handoff-t', 'Išsaugokime šį skaičiavimą jūsų augintiniui');
		box.appendChild(t);
		var txt = 'Jau žinome: ' + parts.join(', ');
		if (h.product_name) { txt += ' · ' + h.product_name; }
		txt += '. Klausiame tik to, ko dar nežinome.';
		box.appendChild(el('div', 'pspet-handoff-p', txt));
		// S288: amžių nurodė, bet DATOS neįrašom — prašom patvirtinti.
		if (h.age_months) {
			box.appendChild(el('div', 'pspet-handoff-p',
				'Skaičiuoklėje nurodėte ' + h.age_months + ' mėn. amžių. Įrašykite gimimo datą — '
				+ 'taip skaičiavimas liks tikslus ir augintiniui augant.'));
		}
		return box;
	}

	function progressBar(step){
		var p = el('div', 'pspet-progress');
		var labels = { 1: 'Pagrindinė informacija', 2: 'Dar keli klausimai' };
		p.appendChild(el('span', 'pspet-progress-step', step + ' žingsnis iš 2'));
		p.appendChild(el('span', 'pspet-progress-label', labels[step] || ''));
		var bar = el('div', 'pspet-progress-bar');
		var fill = el('div', 'pspet-progress-fill');
		fill.style.width = (step === 1 ? '50' : '100') + '%';
		bar.appendChild(fill);
		p.appendChild(bar);
		return p;
	}

	// --- Submit ---
	// S206: payload be null reiksmiu — taip update kelias veikia kaip MERGE
	// (netusti nauji laukai perraso, tusti nepaliecia esamu).
	function buildPayload(){
		var payload = {};
		Object.keys(state.data).forEach(function(k){
			if (state.data[k] !== null && k !== 'draft_id' && k !== 'created_at' && k !== '_weight_kg') payload[k] = state.data[k];
		});
		// S218: etapa issivedam is gimimo datos — zmogaus to nebeklausiam.
		if (payload.birth_date) {
			var st = stageFromBirth(payload.birth_date);
			if (st) payload.life_stage = st;
		}
		// S208: redaguojant siunciam pet_id -> serveris eina i update_pet (merge), ne i create.
		if (state.editPetId) payload.pet_id = state.editPetId;
		// S344: TAS PATS ribos adapteris kaip anoniminiame kelyje. Iki cia `_weight_kg`
		// buvo tik ISMETAMAS (zr. filtra auksciau), todel PRISIJUNGUSIO vartotojo
		// kelias svori taip pat TYLIAI PRARASDAVO.
		addCanonicalWeight(payload, state.data);
		return payload;
	}

	function postProfile(payload, opts){
		opts = opts || {};
		var httpStatus = 0;
		var btnEls = root ? root.querySelectorAll('.pspet-btn-primary') : [];
		btnEls.forEach(function(b){ b.classList.add('pspet-btn-loading'); });
		fetch(REST + '/pet-profile', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': NONCE },
			body: JSON.stringify(payload),
			credentials: 'same-origin'
		})
		.then(function(r){ httpStatus = r.status; return r.json(); })
		.then(function(data){
			// S206: galimas dublikatas — sprendzia vartotojas, tylaus antro profilio nekuriam
			if (httpStatus === 409 && data && data.code === 'duplicate_candidate') {
				state.duplicates = data.duplicate_candidates || [];
				state.step = 'duplicate';
				render();
				return;
			}
			if (data && data.ok) {
				state.savedPetId = data.pet_id;
				// S348: svoris keliauja KANONINIU payload (S335 + S344 addCanonicalWeight).
				// Buves atskiras /feeding-pet-weight kvietimas cia DUBLIAVO rasyma ir
				// kaskart perrasydavo weight_updated_at (V6 defektas) — PASALINTAS.
				clearDraft();
				/* S287: atėjus iš prekės puslapio — grąžinam ATGAL į prekę.
				 * Žmogus ten ir norėjo apsispręsti; palikti jį paskyroje reikštų
				 * nutraukti pirkimo kelią, kurį patys ir pradėjom. */
				if (state.handoff && state.handoff.return_url) {
					var back = state.handoff.return_url;
					clearHandoff();
					state.handoff = null;
					try {
						window.sessionStorage.setItem('petshop_calc_saved', '1');
					} catch (e) {}
					window.location.href = back;
					return;
				}
				clearHandoff();
				// P1 WAU (2026-07-24, Raimio saugiklis #3): "Issaugoti profili" (paskutinis
				// etapas) rodo baigties ekrana TIK po sekmingo atsakymo. "Issaugoti ir
				// baigti veliau" (opts.completion nera) elgiasi kaip anksciau — is karto
				// grazina i dashboarda, be baigties ekrano.
				if (opts.completion) { state.step = 'complete'; render(); return; }
				if (IS_LOGGED_IN && typeof opts_onSaved === 'function') { opts_onSaved(data.pet_id); return; }
				if (IS_LOGGED_IN) { window.location.href = window.location.pathname; return; }
				state.step = 3; render();
			} else {
				btnEls.forEach(function(b){ b.classList.remove('pspet-btn-loading'); });
				showError('Nepavyko išsaugoti. Bandykite dar kartą — jūsų atsakymai išsaugoti formoje.');
			}
		})
		.catch(function(){
			btnEls.forEach(function(b){ b.classList.remove('pspet-btn-loading'); });
			showError('Nepavyko išsaugoti. Patikrinkite ryšį ir bandykite dar kartą — jūsų atsakymai išsaugoti formoje.');
		});
	}

	/** "Išsaugoti ir baigti vėliau" — bet kuriame etape, be baigties ekrano. */
	function submitProfile(){
		if (IS_LOGGED_IN) {
			postProfile(buildPayload());
		} else {
			// Neprisijungęs — rodom rezultatą su email CTA
			saveDraft();
			state.step = 3; render();
		}
	}

	/** "Išsaugoti profilį" — TIK paskutiniame etape. Su baigties ekranu (tik prisijungusiems;
	 * anoniminiam vartotojui email-CTA ekranas jau ir yra jo natūrali baigtis). */
	function finishProfile(){
		if (IS_LOGGED_IN) {
			postProfile(buildPayload(), { completion: true });
		} else {
			submitProfile();
		}
	}

	function openSavedProfile(){
		if (IS_LOGGED_IN && typeof opts_onSaved === 'function') { opts_onSaved(state.savedPetId); return; }
		window.location.href = window.location.pathname;
	}

	function renderDuplicate(){
		// Apsauga: be kandidatu sis ekranas beprasmis
		if (!state.duplicates || !state.duplicates.length) { state.step = 2; renderStep2(); return; }

		root.innerHTML = '';
		var wrap = el('div', 'pspet-wrap');
		var name = state.data.pet_name || 'augintinis';

		var illust = el('div', 'pspet-illustration');
		illust.innerHTML = speciesIcon();
		wrap.appendChild(illust);

		wrap.appendChild(el('h2', 'pspet-title', 'Panašu, kad „' + name + '“ jau turite'));
		wrap.appendChild(el('p', 'pspet-subtitle', 'Radome tokio pat vardo ir rūšies profilį. Atnaujinti jį ar tai kitas augintinis?'));

		state.duplicates.forEach(function(c){
			var card = el('div', 'pspet-dup-card');
			card.style.border = '1px solid #E0E0E0';
			card.style.borderRadius = '8px';
			card.style.padding = '16px';
			card.style.marginBottom = '12px';

			var meta = [];
			if (SPECIES[c.species]) meta.push(SPECIES[c.species].label);
			if (c.has_photo) meta.push('su nuotrauka');
			if (c.created_at) meta.push('sukurta ' + String(c.created_at).slice(0, 10));

			var nm = el('div', null, c.pet_name || '(be vardo)');
			nm.style.fontWeight = '600';
			nm.style.marginBottom = '4px';
			card.appendChild(nm);

			var mt = el('div', null, meta.join(' · '));
			mt.style.fontSize = '14px';
			mt.style.color = '#666';
			mt.style.marginBottom = '12px';
			card.appendChild(mt);

			var btn = el('button', 'pspet-btn pspet-btn-primary', 'Atnaujinti šį profilį');
			btn.onclick = function(){
				var p = buildPayload();
				p.pet_id = c.id;
				postProfile(p);
			};
			card.appendChild(btn);
			wrap.appendChild(card);
		});

		var actions = el('div', 'pspet-actions');
		var addNew = el('button', 'pspet-btn pspet-btn-secondary', 'Ne, tai kitas augintinis');
		addNew.onclick = function(){
			var p = buildPayload();
			p.force_new = 1;
			postProfile(p);
		};
		actions.appendChild(addNew);
		wrap.appendChild(actions);

		var cancel = el('button', 'pspet-skip', 'Grįžti atgal');
		cancel.onclick = function(){ state.step = 2; render(); };
		wrap.appendChild(cancel);

		root.appendChild(wrap);
	}

	function renderResult(){
		root.innerHTML = '';
		var wrap = el('div', 'pspet-wrap');
		var name = state.data.pet_name || 'Jūsų augintinis';

		// #5 (IA v1.1): anonimui tarpinis zingsnis lieka TIK del el. pasto ir magic-link.
		// Jokio "profilis sukurtas" sekmes ekrano, jokios nuotraukos kaip pagrindinio veiksmo.
		if (!IS_LOGGED_IN) {
			var header = el('div', 'pspet-result-header');
			var avatar = el('div', 'pspet-result-avatar');
			avatar.innerHTML = speciesIcon();
			header.appendChild(avatar);
			header.appendChild(el('h2', 'pspet-result-name', 'Išsaugokite augintinio profilį'));
			header.appendChild(el('p', 'pspet-result-meta', name + ' \u00b7 ' + resultMeta()));
			wrap.appendChild(header);

			var saveBox = el('div', 'pspet-save-box');
			saveBox.appendChild(el('div', 'pspet-save-sub', 'Įveskite el. paštą – atsiųsime saugią prisijungimo nuorodą.'));
			var row = el('div', 'pspet-save-row');
			var email = el('input', 'pspet-input');
			email.type = 'email';
			email.placeholder = 'jusu@email.lt';
			var btn = el('button', 'pspet-btn pspet-btn-primary', 'Gauti prisijungimo nuorodą');
			btn.style.flex = '0 0 auto';
			btn.onclick = function(){ requestMagicLink(email.value, saveBox); };
			row.appendChild(email); row.appendChild(btn);
			saveBox.appendChild(row);
			// S341: INLINE busenu sritis vietoje narsykles iskylanciojo lango.
			// role/aria perjungiami dinamiskai (zr. srvStat*): klaidoms role="alert",
			// loading/success busenoms aria-live="polite".
			var stat = el('div', 'pspet-save-status');
			stat.setAttribute('aria-live', 'polite');
			saveBox.appendChild(stat);
			wrap.appendChild(saveBox);

			wrap.appendChild(el('p', 'pspet-note', 'Juodraštis saugomas 30 dienų šioje naršyklėje.'));
			var skip = el('button', 'pspet-skip', 'Praleisti, kol kas neišsaugoti');
			skip.onclick = function(){ if (CFG.homeUrl) window.location.href = CFG.homeUrl; };
			wrap.appendChild(skip);
		} else {
			// Prisijungusiam sis ekranas nebenaudojamas (onSaved veda tiesiai i B busena).
			// Paliekam tik saugikli, jei kas nors ji vis delto pasiektu.
			clearDraft();
			var btn2 = el('button', 'pspet-btn pspet-btn-primary', 'Eiti į mano augintinį');
			btn2.style.width = '100%';
			btn2.onclick = function(){ if (CFG.petPageUrl) window.location.href = CFG.petPageUrl; };
			wrap.appendChild(btn2);
		}
		root.appendChild(wrap);
	}

	function resultMeta(){
		var parts = [];
		if (state.data.species) parts.push(SPECIES[state.data.species].label);
		if (state.data.life_stage) {
			var ls = { junior: 'Jauniklis', adult: 'Suaugęs', senior: 'Senjoras' };
			parts.push(ls[state.data.life_stage] || '');
		}
		if (state.data.dog_size) {
			var ds = { small: 'Mažas', medium: 'Vidutinis', large: 'Didelis', unknown: '' };
			if (ds[state.data.dog_size]) parts.push(ds[state.data.dog_size]);
		}
		return parts.filter(Boolean).join(' · ');
	}

	// --- S341: serverinio drafto + magic-link seka ---
	/** SINGLE-FLIGHT. Be sio du paspaudimai duotu du draftus ir du laiskus. */
	var srvBusy = false;

	function srvStatBusy(stat, msg){
		if (!stat) return;
		stat.className = 'pspet-save-status pspet-save-status--busy';
		stat.removeAttribute('role');            // role="alert" reikstu assertive
		stat.setAttribute('aria-live', 'polite');
		stat.textContent = msg;
	}
	function srvStatError(stat, msg){
		if (!stat) return;
		stat.className = 'pspet-save-status pspet-save-status--error';
		stat.removeAttribute('aria-live');       // role="alert" pats reiskia assertive
		stat.setAttribute('role', 'alert');
		stat.textContent = msg;
	}
	function srvStatClear(stat){
		if (!stat) return;
		stat.className = 'pspet-save-status';
		stat.removeAttribute('role');
		stat.setAttribute('aria-live', 'polite');
		stat.textContent = '';
	}
	function srvLock(btn, on, label){
		if (!btn) return;
		btn.disabled = !!on;
		btn.setAttribute('aria-busy', on ? 'true' : 'false');
		if (label) btn.textContent = label;
	}

	/** Vienoda vieta HTTP atsakymui isskaidyti (status + body). */
	function srvFetch(kelias, kunas){
		return fetch(REST + kelias, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(kunas)
		}).then(function(r){
			return r.json().catch(function(){ return {}; }).then(function(b){
				return { status: r.status, body: b || {} };
			});
		});
	}
	function srvKlaida(zinute){
		var e = new Error('ps_srv');
		e.psMsg = zinute;
		return e;
	}
	/** Uzrakinta klaidu semantika (2026-08-02). */
	function srvDraftMsg(status, body){
		var kodas = body && body.code ? body.code : '';
		if (status === 429) return 'Per daug bandymų. Pabandykite vėliau.';
		if (status === 413) return 'Anketa per didelė. Sutrumpinkite laisvo teksto laukus.';
		if (status === 400) {
			if (kodas === 'invalid_email') return 'Įveskite teisingą el. paštą.';
			if (kodas === 'unsupported_payload_version') return 'Atnaujinkite puslapį ir bandykite dar kartą.';
			return 'Užpildykite bent augintinio rūšį ar vardą, tada bandykite dar kartą.';
		}
		return 'Nepavyko išsaugoti anketos. Bandykite dar kartą.';
	}

	/**
	 * Grazina draft_id. NAUJO drafto NEKURIA, jei turimas tinka
	 * (tas pats email, tas pats fingerprint, ne dirty).
	 */
	function srvEnsureDraft(email){
		var payload = srvPayload();
		var fp = srvFingerprint(payload);
		var s = srvDraftGet();
		if (s && s.draft_id && !s.dirty && s.email === email && s.fingerprint === fp) {
			return Promise.resolve(s.draft_id);
		}
		return srvFetch('/pet-draft', { email: email, payload: payload, payload_version: 1 })
			.then(function(res){
				if (res.status === 201 && res.body && res.body.draft_id) {
					srvDraftSet({ draft_id: res.body.draft_id, email: email,
					              fingerprint: fp, dirty: false, at: Date.now() });
					return res.body.draft_id;
				}
				throw srvKlaida(srvDraftMsg(res.status, res.body));
			}, function(){
				throw srvKlaida('Nepavyko išsaugoti anketos. Bandykite dar kartą.');
			});
	}

	function srvSendMagic(email, draftId){
		return srvFetch('/magic-login/request', { email: email, draft_id: draftId })
			.then(function(res){
				if (res.status >= 200 && res.status < 300) return true;
				throw srvKlaida(res.status === 429
					? 'Per daug bandymų. Pabandykite vėliau.'
					: 'Nepavyko išsiųsti nuorodos. Bandykite dar kartą.');
			}, function(){
				throw srvKlaida('Nepavyko išsiųsti nuorodos. Bandykite dar kartą.');
			});
	}

	/**
	 * UZRAKINTA SEKA (2026-08-02):
	 *   1 forma pildoma        -> localStorage TIK vietinis cache
	 *   2 „gauti nuoroda"      -> POST /pet-draft
	 *   3 TIK gavus 201        -> draft_id i cache -> POST magic-login/request
	 *   4 TIK priemus magic    -> „Patikrinkite el. pasta"
	 *
	 * ★ Jei /pet-draft NEISSAUGOMAS — magic link NESIUNCIAMAS. Kitaip sukurtume
	 *   butent ta klaida, kuria S328 turi pasalinti: zmogus manytu, kad anketa
	 *   bus perkelta, bet prisijunges jos NERASTU.
	 * ★ localStorage NEVALOMAS vien del nuorodos issiuntimo — vietine kopija
	 *   lieka, kol nera serveriu patvirtinto sekmingo claim'o.
	 */
	function requestMagicLink(email, box){
		if (srvBusy) return;
		var stat  = box ? box.querySelector('.pspet-save-status') : null;
		var btn   = box ? box.querySelector('.pspet-btn-primary') : null;
		var input = box ? box.querySelector('input[type=email]') : null;
		var etiketa = btn ? btn.textContent : 'Gauti prisijungimo nuorodą';

		email = (email || '').trim();
		if (!email || email.indexOf('@') < 0) {
			srvStatError(stat, 'Įveskite teisingą el. paštą.');
			if (input) input.focus();
			return;
		}

		srvBusy = true;
		srvLock(btn, true, 'Siunčiama…');
		srvStatBusy(stat, 'Išsaugome anketą…');

		srvEnsureDraft(email)
			.then(function(draftId){
				srvStatBusy(stat, 'Siunčiame nuorodą…');
				return srvSendMagic(email, draftId);
			})
			.then(function(){
				srvBusy = false;
				srvStatClear(stat);
				box.innerHTML = '<div class="pspet-save-title">Patikrinkite el. paštą</div>' +
					'<div class="pspet-save-sub" aria-live="polite">Jei paskyra egzistuoja, išsiuntėme prisijungimo nuorodą į ' + email + '. Prisijungę rasite savo augintinio profilį.</div>';
			})
			.catch(function(err){
				// Klaida NEBLOKUOJA formos: duomenys islieka, mygtukas vel aktyvus,
				// jokio automatinio kartojimo ciklo.
				srvBusy = false;
				srvLock(btn, false, etiketa);
				srvStatError(stat, (err && err.psMsg) ? err.psMsg
					: 'Nepavyko išsaugoti anketos. Bandykite dar kartą.');
			});
	}

	function showError(msg){
		var e = el('div', 'pspet-error', msg);
		root.insertBefore(e, root.firstChild);
		setTimeout(function(){ e.remove(); }, 5000);
	}

	// --- Mount API (S204): forma montuojama i BET KOKI konteineri, ne root.id ---
	var opts_onSaved = null;

	function mount(container, opts){
		if (!container) return false;
		root = container;
		if (root.style && root.style.display === 'none') root.style.display = '';
		root.innerHTML = '';
		opts = opts || {};

		// S208: kiekvienas mount pradeda nuo SVARIOS busenos. Be sito "Prideti kita augintini"
		// po ka tik sukurto profilio atsivertu su ankstesnio augintinio duomenimis.
		// opts.data — redagavimas (uzpildyta anketa), be jo — nauja anketa.
		state.step       = opts.step || 1;
		state.data       = opts.data ? opts.data : {};
		state.editPetId  = opts.petId || null;
		state.duplicates = null;
		state.savedPetId = null;
		// Reset — tikra initializacija (su edit-mode restore logika) vyksta renderStep2() viduje.
		state.sectionIdx = undefined;
		state.confirmedSections = undefined;
		opts_onSaved     = (typeof opts.onSaved === 'function') ? opts.onSaved : null;

		/* S287: PERĖMIMAS IŠ PREKĖS PUSLAPIO SKAIČIUOKLĖS.
		 * Žmogus jau įvedė svorį ir matė rezultatą — versti jį daryti tą patį
		 * iš naujo būtų nepagarba jo laikui, o CTA „Patikslinti ir išsaugoti"
		 * vestų į tuščią formą. Perimam, ką žinom, ir pasakom, ką jau turim. */
		if (!state.editPetId && !opts.data) {
			var ho = readHandoff();
			if (ho) {
				state.handoff = ho;
				if (ho.species) { state.data.species = ho.species; }
				if (ho.weight_kg) { state.data._weight_kg = String(ho.weight_kg); }
				if (ho.product_id) {
					state.data.primary_product_id      = ho.product_id;
					state.data.primary_product_name    = ho.product_name || null;
					state.data.primary_product_sku     = ho.product_sku || null;
					state.data.primary_product_package = ho.product_package || null;
				}
				/* S288: amžiaus į gimimo datą NEVERČIAM.
				 * Anksčiau tyliai apskaičiuodavau datą iš „11 mėn." ir įrašydavau
				 * kaip birth_date — po metų profilis rodytų tikslų gimtadienį,
				 * kurio žmogus NIEKADA nenurodė. Apytikslė reikšmė negali virsti
				 * faktu be žymos, o tokios žymos ps_pets neturi.
				 * Amžių tik PARODOM žinutėje ir prašom patvirtinti datą. */
			}
		}

		// Grįžtantis anoniminis — patikrinam juodraštį
		if (!IS_LOGGED_IN) {
			var draft = loadDraft();
			if (draft && draft.pet_data && draft.pet_data.species) {
				showDraftPrompt(draft);
				PetshopPetForm.mounted = true;
				return true;
			}
		}
		render();
		PetshopPetForm.mounted = true;
		return true;
	}

	/** S287: perėmimo duomenys iš prekės puslapio. Galioja 2 val. — vėliau
	 *  žmogus greičiausiai jau kitame kontekste, o seni duomenys klaidintų. */
	function readHandoff(){
		try {
			var raw = window.localStorage.getItem('petshop_calc_handoff');
			if (!raw) { return null; }
			var h = JSON.parse(raw);
			if (!h || !h.ts || (Date.now() - h.ts) > 2 * 60 * 60 * 1000) {
				window.localStorage.removeItem('petshop_calc_handoff');
				return null;
			}
			return h;
		} catch (e) { return null; }
	}
	function clearHandoff(){
		try { window.localStorage.removeItem('petshop_calc_handoff'); } catch (e) {}
	}

	var PetshopPetForm = { mounted: false, mount: mount };
	window.PetshopPetForm = PetshopPetForm;
	// Atgalinis suderinamumas su senu kvietimu
	window.PSPetFormInit = function(){
		var host = document.getElementById('pspet-form-host') || document.getElementById('pspet-form');
		return mount(host);
	};

	// --- Init: auto-mount tik ten, kur forma turi rodytis IS KARTO ---
	function init(){
		var host = document.getElementById('pspet-form-host');
		var sc = document.getElementById('pspet-form');
		// Serverio kelias ?action=create (veikia ir be JS mygtuko)
		if (window.PS_PET_FORM_OPEN && host) { mount(host); return; }
		// Shortcode puslapis (anketa matoma is karto)
		if (sc && !host) { mount(sc); return; }
		// MyAccount be action=create — laukiam mygtuko (pet-profile.js kvies mount)
	}

	function showDraftPrompt(draft){
		root.innerHTML = '';
		var wrap = el('div', 'pspet-wrap');
		var name = draft.pet_data.pet_name || 'augintinio';
		wrap.appendChild(el('h2', 'pspet-title', 'Tęsti ' + name + ' profilio kūrimą?'));
		wrap.appendChild(el('p', 'pspet-subtitle', 'Galite tęsti ten, kur sustojote, arba pradėti iš naujo.'));
		var actions = el('div', 'pspet-actions');
		var cont = el('button', 'pspet-btn pspet-btn-primary', 'Tęsti');
		cont.onclick = function(){
			state.data = draft.pet_data;
			state.step = draft.current_step || 1;
			state.sectionIdx = draft.section_idx || 0;
			state.confirmedSections = draft.confirmed_sections || [];
			render();
		};
		var fresh = el('button', 'pspet-btn pspet-btn-secondary', 'Pradėti iš naujo');
		fresh.onclick = function(){ clearDraft(); render(); };
		actions.appendChild(cont);
		actions.appendChild(fresh);
		wrap.appendChild(actions);
		root.appendChild(wrap);
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();
