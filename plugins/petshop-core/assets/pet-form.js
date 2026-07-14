/* Petshop "Mano augintinis" anketa — M8 (S196) */
(function(){
	'use strict';

	var CFG = window.PSPetConfig || {};
	var REST = CFG.restUrl || '/wp-json/petshop/v1';
	var IMAGES = CFG.imagesUrl || '';

	function speciesImg(species){
		var map = { dog:'pet-dog', cat:'pet-cat', bird:'pet-bird', rodent:'pet-rodent', fish:'pet-fish', reptile:'pet-reptile', other:'pet-other' };
		var key = map[species] || 'pet-other';
		if (IMAGES) return '<img src="' + IMAGES + key + '.png" alt="" style="width:100%;height:100%;object-fit:contain">';
		return SPECIES[species] ? SPECIES[species].icon : '🐾';
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

	var NEEDS = [
		{ code: 'daily', label: 'Kasdienė mityba' },
		{ code: 'digestion', label: 'Jautrus virškinimas' },
		{ code: 'skin_allergy', label: 'Odos jautrumas / kasymasis' },
		{ code: 'sterilised', label: 'Sterilizuotas / svorio kontrolė' },
		{ code: 'picky_eater', label: 'Išrankus augintinis' }
	];

	var state = {
		step: 1,
		data: {
			species: null,
			species_detail: null,
			pet_name: null,
			primary_need: null,
			life_stage: null,
			dog_size: null,
			is_sterilised: null,
			feeding_type: null,
			current_food_brand: null,
			current_food_free_text: null
		}
	};

	var root = null;

	// --- localStorage juodraštis ---
	function saveDraft(){
		if (IS_LOGGED_IN) return; // prisijungęs — saugom į DB, ne localStorage
		var now = Date.now();
		var draft = {
			schema_version: 1,
			draft_id: state.data.draft_id || genId(),
			created_at: state.data.created_at || new Date(now).toISOString(),
			expires_at: new Date(now + DRAFT_TTL_DAYS*86400000).toISOString(),
			current_step: state.step,
			pet_data: state.data
		};
		state.data.draft_id = draft.draft_id;
		state.data.created_at = draft.created_at;
		try { localStorage.setItem(DRAFT_KEY, JSON.stringify(draft)); } catch(e){}
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

	// --- Render ---
	function render(){
		if (!root) return;
		if (state.step === 1) renderStep1();
		else if (state.step === 2) renderStep2();
		else if (state.step === 3) renderResult();
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

		// Progresas
		wrap.appendChild(progressBar(1));

		var illust = el('div', 'pspet-illustration');
		illust.innerHTML = speciesIcon();
		wrap.appendChild(illust);

		wrap.appendChild(el('h2', 'pspet-title', 'Papasakokite apie savo augintinį'));
		wrap.appendChild(el('p', 'pspet-subtitle', 'Tai užtruks mažiau nei minutę'));

		// Rūšis
		var fSpecies = el('div', 'pspet-field');
		fSpecies.appendChild(el('label', 'pspet-label', 'Kas jūsų augintinis?'));
		var primaryPills = el('div', 'pspet-pills');
		['dog','cat'].forEach(function(sp){ primaryPills.appendChild(speciesPill(sp)); });
		// "Kitas augintinis" mygtukas — išskleidžia likusius
		var otherToggle = el('div', 'pspet-pill', '<span class="pspet-pill-icon">🐾</span> Kitas augintinis');
		otherToggle.onclick = function(){
			var more = fSpecies.querySelector('.pspet-species-more');
			more.classList.toggle('open');
			otherToggle.classList.toggle('active');
		};
		primaryPills.appendChild(otherToggle);
		fSpecies.appendChild(primaryPills);

		var morePills = el('div', 'pspet-pills pspet-species-more');
		['bird','rodent','fish','reptile','other'].forEach(function(sp){ morePills.appendChild(speciesPill(sp)); });
		fSpecies.appendChild(morePills);
		wrap.appendChild(fSpecies);

		// Vardas
		var fName = el('div', 'pspet-field');
		fName.appendChild(el('label', 'pspet-label', 'Augintinio vardas <span class="pspet-sublabel">(neprivaloma)</span>'));
		var nameInput = el('input', 'pspet-input');
		nameInput.type = 'text';
		nameInput.placeholder = 'Kaip vadinasi jūsų augintinis?';
		nameInput.value = state.data.pet_name || '';
		nameInput.oninput = function(){ state.data.pet_name = this.value || null; saveDraft(); };
		fName.appendChild(nameInput);
		wrap.appendChild(fName);

		// Poreikis (tik šuo/katė)
		var needField = el('div', 'pspet-field pspet-need-field');
		if (state.data.species === 'dog' || state.data.species === 'cat') {
			needField.appendChild(el('label', 'pspet-label', 'Kas šiuo metu aktualiausia? <span class="pspet-sublabel">(pasirinkite vieną, jei turite)</span>'));
			var needPills = el('div', 'pspet-pills pspet-pills-stack');
			NEEDS.forEach(function(n){
				var p = el('div', 'pspet-pill' + (state.data.primary_need === n.code ? ' active' : ''), n.label);
				p.onclick = function(){
					state.data.primary_need = (state.data.primary_need === n.code) ? null : n.code;
					saveDraft(); renderStep1();
				};
				needPills.appendChild(p);
			});
			needField.appendChild(needPills);
		}
		wrap.appendChild(needField);

		// Veiksmai
		var actions = el('div', 'pspet-actions');
		var btnNext = el('button', 'pspet-btn pspet-btn-primary', 'Tęsti');
		btnNext.onclick = function(){
			if (!state.data.species) { alert('Pasirinkite gyvūno rūšį'); return; }
			state.step = 2; saveDraft(); render();
		};
		actions.appendChild(btnNext);
		wrap.appendChild(actions);

		root.appendChild(wrap);
	}

	function speciesPill(sp){
		var cfg = SPECIES[sp];
		var p = el('div', 'pspet-pill' + (state.data.species === sp ? ' active' : ''),
			'<span class="pspet-pill-icon">'+cfg.icon+'</span> '+cfg.label);
		p.onclick = function(){
			state.data.species = sp;
			// Išvalom rūšiai nebūdingus laukus
			if (sp !== 'dog') state.data.dog_size = null;
			if (sp !== 'cat') state.data.is_sterilised = null;
			if (sp !== 'dog' && sp !== 'cat') state.data.primary_need = null;
			saveDraft(); renderStep1();
		};
		return p;
	}

	function speciesIcon(){
		return state.data.species ? speciesImg(state.data.species) : (IMAGES ? '<img src="'+IMAGES+'pet-other.png" alt="" style="width:100%;height:100%;object-fit:contain">' : '🐾');
	}

	function renderStep2(){
		root.innerHTML = '';
		var wrap = el('div', 'pspet-wrap');
		wrap.appendChild(progressBar(2));

		var illust = el('div', 'pspet-illustration');
		illust.innerHTML = speciesIcon();
		wrap.appendChild(illust);

		var titleText = state.data.pet_name
			? ('Dar keli klausimai apie „' + state.data.pet_name + '“')
			: 'Dar keli klausimai';
		wrap.appendChild(el('h2', 'pspet-title', titleText));
		wrap.appendChild(el('p', 'pspet-subtitle', 'Padės tiksliau priminti apie maisto papildymą'));

		var sp = state.data.species;

		if (sp === 'dog' || sp === 'cat') {
			// Amžius
			wrap.appendChild(pillField('Amžiaus etapas', 'life_stage', [
				{ code: 'junior', label: sp === 'cat' ? 'Jauniklė (iki 1 m.)' : 'Jauniklis (iki 1 m.)' },
				{ code: 'adult', label: sp === 'cat' ? 'Suaugusi (1–7 m.)' : 'Suaugęs (1–7 m.)' },
				{ code: 'senior', label: sp === 'cat' ? 'Senjorė (7+ m.)' : 'Senjoras (7+ m.)' }
			]));
			if (sp === 'dog') {
				wrap.appendChild(pillField('Dydis', 'dog_size', [
					{ code: 'small', label: 'Mažas (iki 10 kg)' },
					{ code: 'medium', label: 'Vidutinis (10–25 kg)' },
					{ code: 'large', label: 'Didelis (25+ kg)' },
					{ code: 'unknown', label: 'Nežinau' }
				]));
			} else {
				wrap.appendChild(pillField('Ar sterilizuota?', 'is_sterilised', [
					{ code: 'yes', label: 'Taip' },
					{ code: 'no', label: 'Ne' },
					{ code: 'unknown', label: 'Nežinau' }
				]));
			}
			wrap.appendChild(pillField('Maitinimo tipas', 'feeding_type', [
				{ code: 'dry_only', label: 'Tik sausas' },
				{ code: 'mostly_dry', label: 'Daugiausia sausas' },
				{ code: 'mixed', label: 'Mišrus' }
			]));
			wrap.appendChild(foodAutocomplete());
		} else if (sp === 'bird') {
			wrap.appendChild(textField('Paukščio rūšis', 'species_detail', 'Pvz. papūgėlė, kakariki, žako...'));
			wrap.appendChild(pillField('Amžiaus etapas', 'life_stage', [
				{ code: 'junior', label: 'Jauniklis' },
				{ code: 'adult', label: 'Suaugęs' },
				{ code: 'senior', label: 'Nežinau' }
			]));
		} else if (sp === 'rodent') {
			wrap.appendChild(textField('Graužiko rūšis', 'species_detail', 'Triušis, jūrų kiaulytė, žiurkėnas...'));
		} else if (sp === 'fish') {
			wrap.appendChild(pillField('Akvariumas', 'species_detail', [
				{ code: 'freshwater', label: 'Gėlavandenis' },
				{ code: 'marine', label: 'Jūrinis / sūraus vandens' },
				{ code: 'pond', label: 'Tvenkinys' }
			]));
		} else if (sp === 'reptile') {
			wrap.appendChild(textField('Rūšis', 'species_detail', 'Pvz. barzdotoji agama, leopardinis gekonas...'));
		} else {
			wrap.appendChild(textField('Kokį augintinį turite?', 'species_detail', 'Trumpai aprašykite'));
		}

		// Veiksmai
		var actions = el('div', 'pspet-actions');
		var btnBack = el('button', 'pspet-btn pspet-btn-secondary', 'Atgal');
		btnBack.onclick = function(){ state.step = 1; saveDraft(); render(); };
		var btnSave = el('button', 'pspet-btn pspet-btn-primary', 'Išsaugoti profilį');
		btnSave.onclick = function(){ submitProfile(); };
		actions.appendChild(btnBack);
		actions.appendChild(btnSave);
		wrap.appendChild(actions);

		var skip = el('button', 'pspet-skip', 'Praleisti — užpildysiu vėliau');
		skip.onclick = function(){ submitProfile(); };
		wrap.appendChild(skip);

		root.appendChild(wrap);
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
			state.data.current_food_free_text = q || null;
			state.data.current_food_brand = null;
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
		[['Nežinau tikslaus pavadinimo','unknown'],['Kitas maistas','other'],['Nešeriu sausu maistu','none']].forEach(function(o){
			var b = el('button', 'pspet-special-opt', o[0]);
			b.onclick = function(){
				input.value = o[0];
				state.data.current_food_free_text = o[0];
				state.data.current_food_brand = null;
				sug.classList.remove('open');
				saveDraft();
			};
			special.appendChild(b);
		});
		f.appendChild(special);
		return f;
	}

	function fetchBrands(q, sug, input){
		fetch(REST + '/brands?q=' + encodeURIComponent(q) + '&species=' + encodeURIComponent(state.data.species))
			.then(function(r){ return r.json(); })
			.then(function(data){
				sug.innerHTML = '';
				if (!data.brands || !data.brands.length) { sug.classList.remove('open'); return; }
				data.brands.forEach(function(b){
					var s = el('div', 'pspet-suggestion', b.name);
					s.onclick = function(){
						input.value = b.name;
						state.data.current_food_brand = b.name;
						state.data.current_food_free_text = null;
						sug.classList.remove('open');
						saveDraft();
					};
					sug.appendChild(s);
				});
				sug.classList.add('open');
			})
			.catch(function(){ sug.classList.remove('open'); });
	}

	function progressBar(step){
		var p = el('div', 'pspet-progress');
		p.appendChild(el('span', null, step + ' iš 2'));
		var bar = el('div', 'pspet-progress-bar');
		var fill = el('div', 'pspet-progress-fill');
		fill.style.width = (step === 1 ? '50' : '100') + '%';
		bar.appendChild(fill);
		p.appendChild(bar);
		return p;
	}

	// --- Submit ---
	function submitProfile(){
		if (IS_LOGGED_IN) {
			// Prisijungęs — POST į DB
			var payload = {};
			Object.keys(state.data).forEach(function(k){
				if (state.data[k] !== null && k !== 'draft_id' && k !== 'created_at') payload[k] = state.data[k];
			});
			fetch(REST + '/pet-profile', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': NONCE },
				body: JSON.stringify(payload),
				credentials: 'same-origin'
			})
			.then(function(r){ return r.json(); })
			.then(function(data){
				if (data.ok) {
					state.savedPetId = data.pet_id;
					state.step = 3; render();
				} else {
					showError('Nepavyko išsaugoti. Bandykite dar kartą.');
				}
			})
			.catch(function(){ showError('Nepavyko išsaugoti. Bandykite dar kartą.'); });
		} else {
			// Neprisijungęs — rodom rezultatą su email CTA
			saveDraft();
			state.step = 3; render();
		}
	}

	function renderResult(){
		root.innerHTML = '';
		var wrap = el('div', 'pspet-wrap');

		var name = state.data.pet_name || 'Jūsų augintinis';

		var header = el('div', 'pspet-result-header');
		var avatar = el('div', 'pspet-result-avatar');
		avatar.innerHTML = speciesIcon();
		header.appendChild(avatar);
		header.appendChild(el('h2', 'pspet-result-name', name + ' — profilis sukurtas'));
		header.appendChild(el('p', 'pspet-result-meta', resultMeta()));
		wrap.appendChild(header);

		if (!IS_LOGGED_IN) {
			// Email CTA
			var saveBox = el('div', 'pspet-save-box');
			saveBox.appendChild(el('div', 'pspet-save-title', 'Norite išsaugoti profilį ir gauti priminimus?'));
			saveBox.appendChild(el('div', 'pspet-save-sub', 'Įveskite el. paštą ir atsiųsime saugią prisijungimo nuorodą.'));
			var row = el('div', 'pspet-save-row');
			var email = el('input', 'pspet-input');
			email.type = 'email';
			email.placeholder = 'jusu@email.lt';
			var btn = el('button', 'pspet-btn pspet-btn-primary', 'Siųsti nuorodą');
			btn.style.flex = '0 0 auto';
			btn.onclick = function(){ requestMagicLink(email.value, saveBox); };
			row.appendChild(email);
			row.appendChild(btn);
			saveBox.appendChild(row);
			wrap.appendChild(saveBox);

			wrap.appendChild(el('p', 'pspet-note', 'Nuotrauką galėsite pridėti išsaugoję profilį. Juodraštis saugomas 30 dienų.'));

			var skip = el('button', 'pspet-skip', 'Praleisti, kol kas neišsaugoti');
			skip.onclick = function(){ if (CFG.homeUrl) window.location.href = CFG.homeUrl; };
			wrap.appendChild(skip);
		} else {
			// Prisijungęs — jau išsaugota
			wrap.appendChild(el('p', 'pspet-note', 'Profilis išsaugotas! Galite pridėti nuotrauką ir peržiūrėti visas funkcijas.'));
			var btn2 = el('button', 'pspet-btn pspet-btn-primary', 'Eiti į mano augintinį');
			btn2.style.width = '100%';
			btn2.onclick = function(){ if (CFG.petPageUrl) window.location.href = CFG.petPageUrl; };
			wrap.appendChild(btn2);
			clearDraft();
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

	function requestMagicLink(email, box){
		if (!email || email.indexOf('@') < 0) { alert('Įveskite teisingą el. paštą'); return; }
		fetch(REST + '/magic-login/request', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email: email })
		})
		.then(function(r){ return r.json(); })
		.then(function(){
			box.innerHTML = '<div class="pspet-save-title">Patikrinkite el. paštą</div>' +
				'<div class="pspet-save-sub">Jei paskyra egzistuoja, išsiuntėme prisijungimo nuorodą į ' + email + '. Prisijungę rasite savo augintinio profilį.</div>';
		})
		.catch(function(){ alert('Nepavyko išsiųsti. Bandykite dar kartą.'); });
	}

	function showError(msg){
		var e = el('div', 'pspet-error', msg);
		root.insertBefore(e, root.firstChild);
		setTimeout(function(){ e.remove(); }, 5000);
	}

	// --- Init ---
	function init(){
		root = document.getElementById('pspet-form');
		if (!root) return;

		// Grįžtantis anoniminis — patikrinam juodraštį
		if (!IS_LOGGED_IN) {
			var draft = loadDraft();
			if (draft && draft.pet_data && draft.pet_data.species) {
				showDraftPrompt(draft);
				return;
			}
		}
		render();
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
