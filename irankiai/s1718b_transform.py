# -*- coding: utf-8 -*-
"""S1718b — tekstų/meta optimizavimas Google+AI: title ≤60, description ≤158, H2/H3 struktūra gamintojams, abejotini teiginiai išimti."""
import sys, re, io
sys.path.insert(0, 'tekstai')
from hubai import HUBAI
from gamintojai_1 import GAMINTOJAI_1
from gamintojai_2 import GAMINTOJAI_2

T = {
 'sunims': 'Prekės šunims – maistas, skanėstai, priežiūra | Petshop.lt',
 'katems': 'Prekės katėms – maistas, kraikas, priežiūra | Petshop.lt',
 'grauzikams': 'Prekės graužikams – pašaras, narvai, kraikas | Petshop.lt',
 'pauksciams': 'Prekės paukščiams – lesalas ir aksesuarai | Petshop.lt',
 'zuvims': 'Prekės žuvims – maistas ir akvariumų įranga | Petshop.lt',
 'animonda': 'Animonda – konservai šunims ir katėms, Carny | Petshop.lt',
 'miamor': 'Miamor – konservai katėms, Feine Filets | Petshop.lt',
 'exclusion': 'Exclusion – hipoalerginis maistas šunims ir katėms | Petshop.lt',
 'romar': 'Romar – natūralūs džiovinti skanėstai šunims | Petshop.lt',
 'josera': 'Josera – sausas maistas šunims ir katėms | Petshop.lt',
 'ontario': 'Ontario – sausas maistas ir konservai šunims | Petshop.lt',
 'gnatek': 'Gnatek – džiovinti skanėstai ir kramtalai šunims | Petshop.lt',
 'quattro': 'Quattro – begrūdis maistas šunims ir katėms | Petshop.lt',
 'monge': 'Monge – sausas maistas šunims ir katėms, BWild | Petshop.lt',
 'hikari': 'Hikari – maistas akvariumo žuvims ir koi | Petshop.lt',
 'royal-canin': 'Royal Canin – sausas maistas katėms ir šunims | Petshop.lt',
 'belocat': 'BeloCat – tofu ir bentonitinis kraikas katėms | Petshop.lt',
 'ambrosia': 'Ambrosia – begrūdis sausas maistas šunims | Petshop.lt',
 'pess': 'Pess – biologinė apsauga nuo erkių ir blusų | Petshop.lt',
 'rasco': 'Rasco – sausas maistas šunims 15 kg, konservai | Petshop.lt',
 'gimcat': 'GimCat – pastos, papildai ir skanėstai katėms | Petshop.lt',
 'churu': 'Churu – kreminiai skanėstai katėms ir šunims | Petshop.lt',
 'duvo': 'Duvo+ – žaislai, kramtalai, dubenėliai | Petshop.lt',
 'prins': 'Prins – ProCare begrūdis maistas šunims, katėms | Petshop.lt',
 'trixie': 'Trixie – aksesuarai šunims, katėms, graužikams | Petshop.lt',
 'farmina': 'Farmina – N&D, Vet Life maistas šunims, katėms | Petshop.lt',
 'haumiau': 'Hau&Miau – antienos skanėstai šunims 500 g | Petshop.lt',
 'georplast': 'Georplast – dubenėliai, tualetai, šėryklos | Petshop.lt',
 'flexi': 'Flexi – automatiniai pavadėliai šunims | Petshop.lt',
 'nobleza': 'Nobleza – apranga, guoliai, draskyklės | Petshop.lt',
 'happet': 'Happet – draskyklės, tualetai, guoliai | Petshop.lt',
 'eukanuba': 'Eukanuba – sausas maistas šunims 12–18 kg | Petshop.lt',
 'real-dog': 'Real Dog – sausas maistas šunims 20 kg | Petshop.lt',
 'land-fleisch': 'Landfleisch – konservai šunims ir katėms | Petshop.lt',
 '8in1': '8in1 – skanėstai šunims Delights, Flavours | Petshop.lt',
 'furminator': 'FURminator – deShedding šukos šunims, katėms | Petshop.lt',
 'gemon': 'Gemon – sausas maistas šunims ir katėms 20 kg | Petshop.lt',
 'deli-nature': 'Deli Nature – lesalai paukščiams, graužikams | Petshop.lt',
 'comfy': 'Comfy – šampūnai, guoliai, kraikai, narvai | Petshop.lt',
 'nobby': 'Nobby – petnešos, guoliai, draskyklės | Petshop.lt',
 'dingo': 'Dingo – tempimo žaislai šunims, Agility | Petshop.lt',
 '4dogs': '4Dogs – Himalajų sūrio kramtalai šunims S, M, L | Petshop.lt',
 'frendi': 'Frendi – šlapias maistas katėms padaže | Petshop.lt',
 'catit': 'Catit Pixi – fontanas ir žaislai katėms | Petshop.lt',
}
D_HUB = {
 'sunims': 'Sausas ir šlapias maistas, skanėstai, antkakliai, guoliai, žaislai ir priežiūros priemonės šunims. Padedame išsirinkti pagal sudėtį. Pristatymas 1–3 d. d.',
 'katems': 'Sausas ir šlapias maistas, skanėstai, kraikai, tualetai, draskyklės ir žaislai katėms. Padedame išsirinkti pagal sudėtį. Pristatymas 1–3 d. d.',
 'grauzikams': 'Pašarai ir skanėstai triušiams, jūrų kiaulytėms, šinšiloms, žiurkėnams; narvai, kraikas ir šienas. Pristatymas 1–3 d. d., į paštomatą nuo 30 € nemokamai.',
 'pauksciams': 'Lesalai ir skanėstai papūgoms, amadinams, kanarėlėms; lesyklos, girdyklos, laktos narvams. Pristatymas 1–3 d. d., į paštomatą nuo 30 € nemokamai.',
 'zuvims': 'Maistas akvariumo ir tvenkinių žuvims pagal rūšį (granulės, dribsniai, vafliukai), akvariumų įranga. Pristatymas 1–3 d. d., į paštomatą nuo 30 € nemokamai.',
}
MAX_D = 158
D_OVR = {
 'pess': 'Pess biologiniai antkakliai, lašiukai ir purškiklis nuo erkių ir blusų su eteriniais aliejais – šunims iki 10 kg ir 10–20 kg, katėms.',
 'frendi': 'Frendi konservai katėms: gabaliukai padaže su vištiena, kalakutiena, triušiena, jautiena, lašiša ar žuvimi – 100 g maišeliai ir 400 g skardinės nuo 0,59 €.',
}

def trim_desc(d):
    d = d.strip()
    if len(d) <= MAX_D: return d
    d2 = re.sub(r'\s*Pristatymas[^.]*\.\s*$', '', d).strip()
    if len(d2) <= MAX_D: return d2
    cut = max(d2.rfind('. ', 0, MAX_D - 1), d2.rfind('; ', 0, MAX_D - 1))
    if cut > 80: return d2[:cut + 1].strip()
    cut = d2.rfind(', ', 0, MAX_D - 3)
    return d2[:cut].rstrip(',;') + '.'

# teiginių pataisos (abejotinos gamintojų deklaracijos — išimtos)
FIX = {
 'haumiau': [('Sudėtis – mėsa be dirbtinių priedų; tikslią kiekvienos prekės sudėtį rasite kortelėje.', 'Tikslią kiekvienos prekės sudėtį rasite kortelėje.')],
 'ontario': [('Sudėtyje – mėsa kaip pirmas ingredientas, be dirbtinių dažiklių ir konservantų;', 'Sudėtyje – mėsa kaip pirmas ingredientas;')],
}

def struktura(g):
    """Gamintojo tekstas: <h2>Apie X</h2> + <p>…; „Kaip rinktis:" pastraipa → <h3>Kaip rinktis</h3><p>…"""
    t = g['tekstas'].strip()
    for a, b in FIX.get(g['slug'], []):
        assert a in t, (g['slug'], a)
        t = t.replace(a, b)
    parts = re.findall(r'<p>(.*?)</p>', t, flags=re.S)
    assert parts and ''.join(re.findall(r'<(h\d|p)', t)) == 'p' * len(parts), g['slug']
    out = ['<h2>Apie %s</h2>' % g['name']]
    for p in parts:
        p = p.strip()
        m = re.match(r'Kaip rinktis:\s*(.*)', p, flags=re.S)
        if m:
            rest = m.group(1).strip()
            rest = rest[0].upper() + rest[1:]
            out.append('<h3>Kaip rinktis %s</h3>' % kaip(g)); out.append('<p>%s</p>' % rest)
        else:
            out.append('<p>%s</p>' % p)
    return '\n'.join(out)

def kaip(g):
    k = g.get('kat', '')
    if 'maist' in k or 'pašar' in k or 'konserv' in k or 'lesal' in k: return '%s maistą' % g['name']
    if 'skanėst' in k or 'kramtal' in k: return '%s skanėstus' % g['name']
    if 'kraik' in k: return '%s kraiką' % g['name']
    return '%s prekes' % g['name']

def main():
    rows = []
    for g in HUBAI:
        g['meta_title'] = T[g['slug']]; g['meta_desc'] = D_HUB[g['slug']]
    for g in GAMINTOJAI_1 + GAMINTOJAI_2:
        g['meta_title'] = T[g['slug']]; g['meta_desc'] = D_OVR.get(g['slug']) or trim_desc(g['meta_desc']); g['tekstas'] = struktura(g)
    for g in HUBAI + GAMINTOJAI_1 + GAMINTOJAI_2:
        assert len(g['meta_title']) <= 63, (g['slug'], len(g['meta_title']))
        assert len(g['meta_desc']) <= MAX_D, (g['slug'], len(g['meta_desc']))
        rows.append('%-13s T%2d D%3d | %s' % (g['slug'], len(g['meta_title']), len(g['meta_desc']), g['meta_desc']))
    print('\n'.join(rows))
    import json
    json.dump({'HUBAI': HUBAI, 'G1': GAMINTOJAI_1, 'G2': GAMINTOJAI_2}, open('tekstai_v2.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=0)

if __name__ == '__main__':
    main()
