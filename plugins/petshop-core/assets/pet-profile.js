/* Petshop "Mano augintinis" profilio ekranas — M8 (S199) */
(function(){
	'use strict';

	var CFG = window.PSPetConfig || {};
	var REST = CFG.restUrl || '/wp-json/petshop/v1';
	var NONCE = CFG.nonce || '';

	var SPECIES_ICON = {
		dog: '🐕', cat: '🐈', bird: '🦜', rodent: '🐹',
		fish: '🐠', reptile: '🦎', other: '🐾'
	};
	var SPECIES_LABEL = {
		dog: 'Šuo', cat: 'Katė', bird: 'Paukštis', rodent: 'Graužikas',
		fish: 'Žuvis', reptile: 'Roplys', other: 'Kitas'
	};
	var LIFE_STAGE = { junior: 'Jauniklis', adult: 'Suaugęs', senior: 'Senjoras' };
	var DOG_SIZE = { small: 'Mažas', medium: 'Vidutinis', large: 'Didelis' };
	var NEED = {
		daily: 'Kasdienė mityba', digestion: 'Jautrus virškinimas',
		skin_allergy: 'Odos jautrumas', sterilised: 'Sterilizuotas / svorio kontrolė',
		picky_eater: 'Išrankus augintinis'
	};

	var root = null;
	var pets = [];
	var activePetId = null;

	function el(tag, cls, html){
		var e = document.createElement(tag);
		if (cls) e.className = cls;
		if (html !== undefined) e.innerHTML = html;
		return e;
	}

	function init(){
		root = document.getElementById('pspet-profile');
		if (!root) return;
		loadPets();
	}

	function loadPets(){
		root.innerHTML = '<div class="pspet-loading">Kraunama...</div>';
		fetch(REST + '/pet-profile', {
			headers: { 'X-WP-Nonce': NONCE },
			credentials: 'same-origin'
		})
		.then(function(r){ return r.json(); })
		.then(function(data){
			pets = data.pets || [];
			if (!pets.length) {
				renderEmpty();
				return;
			}
			activePetId = pets[0].id;
			loadDashboard(activePetId);
		})
		.catch(function(){ root.innerHTML = '<div class="pspet-error">Nepavyko įkelti. Perkraukite puslapį.</div>'; });
	}

	function loadDashboard(petId){
		root.innerHTML = '<div class="pspet-loading">Kraunama...</div>';
		fetch(REST + '/pet-dashboard/' + petId, {
			headers: { 'X-WP-Nonce': NONCE },
			credentials: 'same-origin'
		})
		.then(function(r){ return r.json(); })
		.then(function(data){
			if (data.ok) renderProfile(data.dashboard);
			else root.innerHTML = '<div class="pspet-error">Nepavyko įkelti profilio.</div>';
		})
		.catch(function(){ root.innerHTML = '<div class="pspet-error">Nepavyko įkelti profilio.</div>'; });
	}

	function renderEmpty(){
		root.innerHTML = '';
		var wrap = el('div', 'pspet-profile');
		var empty = el('div', 'pspet-empty');
		empty.appendChild(el('div', 'pspet-empty-icon', '🐾'));
		empty.appendChild(el('div', 'pspet-empty-title', 'Susipažinkime su jūsų augintiniu'));
		empty.appendChild(el('div', 'pspet-empty-sub', 'Vienoje vietoje matysite priminimus, maisto papildymą ir įprastus pirkinius.'));
		var btn = el('button', 'pspet-btn pspet-btn-primary', 'Sukurti profilį');
		btn.style.maxWidth = '280px';
		btn.style.margin = '0 auto';
		btn.onclick = function(){ showForm(); };
		empty.appendChild(btn);
		wrap.appendChild(empty);
		root.appendChild(wrap);
	}

	function showForm(){
		// Perjungiam į anketą (pakeičiam #pspet-profile į #pspet-form)
		root.id = 'pspet-form';
		root.innerHTML = '';
		// Reload anketos JS jei įkelta
		if (window.PSPetFormInit) window.PSPetFormInit();
		else location.reload();
	}

	function renderProfile(dash){
		root.innerHTML = '';
		var wrap = el('div', 'pspet-profile');
		var pet = dash.pet;

		// Perjungiklis (jei > 1 augintinis)
		if (pets.length > 1) {
			wrap.appendChild(renderSwitcher());
		}

		// Antraštė
		wrap.appendChild(renderHeader(pet));

		// Profilio pilnumas
		if (dash.completeness && dash.completeness.show) {
			wrap.appendChild(renderCompleteness(dash.completeness, pet));
		}

		// Kas svarbu dabar
		wrap.appendChild(renderNow(dash, pet));

		// Lentynėlė
		if (dash.shelf && dash.shelf.length) {
			wrap.appendChild(renderShelf(dash.shelf, pet));
		}

		// Mitybos ritmas
		if (dash.food_rhythm && dash.food_rhythm.has_data) {
			wrap.appendChild(renderRhythm(dash.food_rhythm, dash.refill, pet));
		}

		// Priminimai
		if (dash.reminders && dash.reminders.length) {
			wrap.appendChild(renderReminders(dash.reminders));
		}

		root.appendChild(wrap);
	}

	function renderSwitcher(){
		var sw = el('div', 'pspet-switcher');
		pets.forEach(function(p){
			var item = el('div', 'pspet-switch-item' + (p.id === activePetId ? ' active' : ''));
			var av = el('div', 'pspet-switch-avatar', SPECIES_ICON[p.species] || '🐾');
			item.appendChild(av);
			item.appendChild(el('div', 'pspet-switch-name', p.pet_name || SPECIES_LABEL[p.species]));
			item.onclick = function(){ activePetId = p.id; loadDashboard(p.id); };
			sw.appendChild(item);
		});
		var add = el('div', 'pspet-switch-item');
		add.appendChild(el('div', 'pspet-switch-add', '+'));
		add.appendChild(el('div', 'pspet-switch-name', 'Pridėti'));
		add.onclick = function(){ showForm(); };
		sw.appendChild(add);
		return sw;
	}

	function renderHeader(pet){
		var h = el('div', 'pspet-p-header');
		var avatar = el('div', 'pspet-p-avatar');
		if (pet.photo_url) {
			var img = document.createElement('img');
			img.src = pet.photo_url + '?nonce=' + NONCE;
			avatar.appendChild(img);
		} else {
			avatar.textContent = SPECIES_ICON[pet.species] || '🐾';
		}
		h.appendChild(avatar);

		var info = el('div', 'pspet-p-headinfo');
		var nameRow = el('div', 'pspet-p-name');
		nameRow.appendChild(document.createTextNode(pet.pet_name || SPECIES_LABEL[pet.species]));
		var editBtn = el('button', 'pspet-p-edit', '✎');
		editBtn.title = 'Redaguoti';
		editBtn.onclick = function(){ showForm(); };
		nameRow.appendChild(editBtn);
		info.appendChild(nameRow);

		info.appendChild(el('div', 'pspet-p-meta', headerMeta(pet)));
		if (pet.primary_need) {
			info.appendChild(el('span', 'pspet-p-need', NEED[pet.primary_need] || ''));
		}
		h.appendChild(info);

		var actions = el('div', 'pspet-p-actions');
		var aEdit = el('button', 'pspet-p-action', '✎ Redaguoti profilį');
		aEdit.onclick = function(){ showForm(); };
		var aPhoto = el('button', 'pspet-p-action', pet.photo_url ? '📷 Keisti nuotrauką' : '📷 Pridėti nuotrauką');
		aPhoto.onclick = function(){ uploadPhoto(pet.pet_id); };
		var aAdd = el('button', 'pspet-p-action', '+ Pridėti kitą augintinį');
		aAdd.onclick = function(){ showForm(); };
		actions.appendChild(aEdit);
		actions.appendChild(aPhoto);
		actions.appendChild(aAdd);
		h.appendChild(actions);

		return h;
	}

	function headerMeta(pet){
		var parts = [ SPECIES_LABEL[pet.species] ];
		if (pet.species_detail) parts.push(pet.species_detail);
		if (pet.life_stage) parts.push(LIFE_STAGE[pet.life_stage]);
		if (pet.dog_size && DOG_SIZE[pet.dog_size]) parts.push(DOG_SIZE[pet.dog_size]);
		return parts.filter(Boolean).join(' · ');
	}

	function renderCompleteness(comp, pet){
		var c = el('div', 'pspet-completeness');
		var row = el('div', 'pspet-comp-row');
		var name = pet.pet_name || 'Augintinio';
		row.appendChild(el('span', 'pspet-comp-label', name + ' profilis'));
		row.appendChild(el('span', 'pspet-comp-pct', comp.percent + '%'));
		c.appendChild(row);
		var bar = el('div', 'pspet-comp-bar');
		var fill = el('div', 'pspet-comp-fill');
		fill.style.width = comp.percent + '%';
		bar.appendChild(fill);
		c.appendChild(bar);

		var hints = [];
		if (comp.missing.indexOf('photo') >= 0) hints.push('nuotrauką');
		if (comp.missing.indexOf('food') >= 0) hints.push('dabartinį maistą');
		if (hints.length) {
			c.appendChild(el('div', 'pspet-comp-hint', 'Pridėkite ' + hints.join(' ir ') + ' — profilis taps išsamesnis.'));
		}
		return c;
	}

	function renderNow(dash, pet){
		var block = el('div', 'pspet-block');
		var head = el('div', 'pspet-block-head');
		head.appendChild(el('h3', 'pspet-block-title', 'Kas svarbu dabar'));
		block.appendChild(head);

		var cards = el('div', 'pspet-now-cards');

		// Refill kortelė
		var refill = dash.refill;
		var cRefill = el('div', 'pspet-now-card card-refill');
		if (refill && refill.has_data && refill.days_left !== null) {
			cRefill.appendChild(el('div', 'pspet-now-card-label', 'Maisto liko maždaug'));
			cRefill.appendChild(renderRing(refill.days_left, refill.color));
			var btn = el('button', 'pspet-now-btn primary', refillCta(refill.color));
			btn.onclick = function(){ if (refill.permalink) window.location.href = refill.permalink; };
			cRefill.appendChild(btn);
		} else {
			cRefill.appendChild(el('div', 'pspet-now-card-label', 'Maisto papildymas'));
			cRefill.appendChild(el('div', 'pspet-now-card-value', 'Pirmą kartą užsisakę pradėsime sekti'));
		}
		cards.appendChild(cRefill);

		// Priminimo kortelė
		var cRem = el('div', 'pspet-now-card card-reminder');
		if (dash.reminders && dash.reminders.length) {
			var r = dash.reminders[0];
			cRem.appendChild(el('div', 'pspet-now-card-label', 'Kitas priminimas'));
			cRem.appendChild(el('div', 'pspet-now-card-value', daysText(r.days_left)));
			cRem.appendChild(el('div', 'pspet-now-card-label', r.label));
		} else {
			cRem.appendChild(el('div', 'pspet-now-card-label', 'Priminimai'));
			cRem.appendChild(el('div', 'pspet-now-card-value', 'Pridėkite pirmą priminimą'));
		}
		cards.appendChild(cRem);

		// Paskutinio pirkimo kortelė
		var cProd = el('div', 'pspet-now-card');
		if (refill && refill.product_name) {
			cProd.appendChild(el('div', 'pspet-now-card-label', 'Paskutinis pirkimas'));
			if (refill.product_image) {
				var img = document.createElement('img');
				img.src = refill.product_image;
				img.className = 'pspet-now-prod-img';
				cProd.appendChild(img);
			}
			cProd.appendChild(el('div', 'pspet-now-card-value', refill.product_name));
			var btnP = el('button', 'pspet-now-btn', 'Pakartoti');
			btnP.onclick = function(){ if (refill.permalink) window.location.href = refill.permalink; };
			cProd.appendChild(btnP);
		} else {
			cProd.appendChild(el('div', 'pspet-now-card-label', 'Įprastos prekės'));
			cProd.appendChild(el('div', 'pspet-now-card-value', 'Kai pirksite — atsiras čia'));
		}
		cards.appendChild(cProd);

		block.appendChild(cards);
		return block;
	}

	function renderRing(days, color){
		var ring = el('div', 'pspet-ring color-' + (color || 'green'));
		var pct = Math.max(0, Math.min(100, (days / 60) * 100));
		var circ = 2 * Math.PI * 40;
		var offset = circ * (1 - pct / 100);
		var strokeColor = color === 'orange' ? '#E67E22' : (color === 'yellow' ? '#C79A16' : '#2D5F3F');
		ring.innerHTML =
			'<svg width="90" height="90">' +
			'<circle cx="45" cy="45" r="40" fill="none" stroke="#e8e8e8" stroke-width="7"/>' +
			'<circle cx="45" cy="45" r="40" fill="none" stroke="' + strokeColor + '" stroke-width="7" ' +
			'stroke-dasharray="' + circ + '" stroke-dashoffset="' + offset + '" stroke-linecap="round"/>' +
			'</svg>' +
			'<div class="pspet-ring-num"><div class="pspet-ring-days">' + days + '</div><div class="pspet-ring-unit">d.</div></div>';
		return ring;
	}

	function refillCta(color){
		if (color === 'orange') return 'Pakartoti pirkimą';
		if (color === 'yellow') return 'Užsisakyti maistą';
		return 'Tikrinti atsargas';
	}

	function daysText(days){
		if (days === null || days === undefined) return '';
		if (days === 0) return 'Šiandien';
		if (days === 1) return 'Rytoj';
		return 'Po ' + days + ' d.';
	}

	function renderShelf(shelf, pet){
		var block = el('div', 'pspet-block');
		var head = el('div', 'pspet-block-head');
		var name = pet.pet_name || 'Augintiniui';
		head.appendChild(el('h3', 'pspet-block-title', name + ' dažniausiai perkate'));
		block.appendChild(head);

		var list = el('div', 'pspet-shelf');
		shelf.forEach(function(item){
			var it = el('div', 'pspet-shelf-item');
			if (item.image) {
				var img = document.createElement('img');
				img.src = item.image;
				img.className = 'pspet-shelf-img';
				it.appendChild(img);
			}
			it.appendChild(el('div', 'pspet-shelf-name', item.name));
			if (item.in_stock) {
				var btn = el('button', 'pspet-shelf-btn', 'Pakartoti');
				btn.onclick = function(){ if (item.permalink) window.location.href = item.permalink; };
				it.appendChild(btn);
			} else {
				var btnO = el('button', 'pspet-shelf-btn oos', 'Pranešti, kai bus');
				btnO.onclick = function(){ if (item.permalink) window.location.href = item.permalink; };
				it.appendChild(btnO);
			}
			list.appendChild(it);
		});
		block.appendChild(list);
		return block;
	}

	function renderRhythm(rhythm, refill, pet){
		var block = el('div', 'pspet-block');
		var head = el('div', 'pspet-block-head');
		head.appendChild(el('h3', 'pspet-block-title', 'Mitybos ritmas'));
		block.appendChild(head);

		var box = el('div', 'pspet-rhythm');
		var name = pet.pet_name || 'Augintiniui';
		var avg = rhythm.avg_interval_days;
		box.appendChild(el('div', 'pspet-rhythm-text',
			name + ' maistą dažniausiai papildote kas ' + Math.max(1, avg - 2) + '–' + (avg + 2) + ' dienas.'));

		// Feedback pills
		if (refill && refill.product_id) {
			var fb = el('div', 'pspet-rhythm-feedback');
			fb.appendChild(el('div', 'pspet-rhythm-fb-label', 'Ar prognozė panaši?'));
			var pills = el('div', 'pspet-fb-pills');
			[['similar','Taip, panašu'],['sooner','Baigsis anksčiau'],['later','Dar liko daugiau']].forEach(function(o){
				var p = el('button', 'pspet-fb-pill ' + o[0], o[1]);
				p.onclick = function(){ submitFeedback(pet.pet_id, refill.product_id, o[0], p, pills); };
				pills.appendChild(p);
			});
			fb.appendChild(pills);
			box.appendChild(fb);
		}
		block.appendChild(box);
		return block;
	}

	function submitFeedback(petId, productId, feedback, pill, container){
		fetch(REST + '/refill-feedback', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': NONCE },
			body: JSON.stringify({ pet_id: petId, product_id: productId, feedback: feedback }),
			credentials: 'same-origin'
		})
		.then(function(r){ return r.json(); })
		.then(function(data){
			if (data.ok) {
				Array.prototype.forEach.call(container.children, function(c){ c.classList.remove('active'); });
				pill.classList.add('active');
				var thanks = container.parentNode.querySelector('.pspet-fb-thanks');
				if (!thanks) {
					thanks = el('div', 'pspet-comp-hint pspet-fb-thanks', 'Ačiū! Prognozė atnaujinta.');
					thanks.style.marginTop = '8px';
					container.parentNode.appendChild(thanks);
				}
			}
		})
		.catch(function(){});
	}

	function renderReminders(reminders){
		var block = el('div', 'pspet-block');
		var head = el('div', 'pspet-block-head');
		head.appendChild(el('h3', 'pspet-block-title', 'Artimiausi priminimai'));
		block.appendChild(head);

		var tl = el('div', 'pspet-timeline');
		reminders.forEach(function(r){
			var item = el('div', 'pspet-tl-item');
			item.appendChild(el('div', 'pspet-tl-dot'));
			var content = el('div', 'pspet-tl-content');
			content.appendChild(el('div', 'pspet-tl-days', daysText(r.days_left)));
			content.appendChild(el('div', 'pspet-tl-label', r.label));
			item.appendChild(content);
			tl.appendChild(item);
		});
		block.appendChild(tl);
		return block;
	}

	function uploadPhoto(petId){
		var input = document.createElement('input');
		input.type = 'file';
		input.accept = 'image/jpeg,image/png,image/webp';
		input.onchange = function(){
			if (!input.files.length) return;
			var fd = new FormData();
			fd.append('photo', input.files[0]);
			fetch(REST + '/pet-photo/' + petId, {
				method: 'POST',
				headers: { 'X-WP-Nonce': NONCE },
				body: fd,
				credentials: 'same-origin'
			})
			.then(function(r){ return r.json(); })
			.then(function(data){
				if (data.ok) loadDashboard(petId);
				else alert('Nepavyko įkelti nuotraukos.');
			})
			.catch(function(){ alert('Nepavyko įkelti nuotraukos.'); });
		};
		input.click();
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();
