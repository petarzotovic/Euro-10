# Auto škola Euro 10, sajt

Statički sajt (HTML, CSS, JavaScript) za Auto školu Euro 10 iz Novog Sada. Radi na desktopu i telefonu, bez build koraka i bez dodatnih biblioteka.

## Struktura

```
index.html        stranica
css/style.css     svi stilovi
js/main.js        interakcije (meni, skrolovanje, sat, recenzije, kartice usluga)
assets/logo.png   logo
```

## Objavljivanje na GitHub Pages

1. Napravi novi repozitorijum na GitHubu i ubaci sve fajlove iz ovog foldera u njegov koren.
2. U repozitorijumu otvori **Settings › Pages**.
3. Pod **Build and deployment** izaberi **Deploy from a branch**, granu `main` i folder `/ (root)`, pa sačuvaj.
4. Posle minut-dva sajt je dostupan na `https://<korisnik>.github.io/<repozitorijum>/`.

Za sopstveni domen (npr. `autoskolaeuro10.com`) upiši ga u **Settings › Pages › Custom domain** i podesi DNS kod registra domena.

## Lokalno pregledanje

Otvori `index.html` u pregledaču, ili pokreni mali server u ovom folderu:

```
python3 -m http.server 8000
```

pa otvori `http://localhost:8000`.

## Napomene

- Mapa u sekciji Kontakt je prava Google mapa (ugrađena preko `iframe`).
- Recenzije su prepisane sa Google mapa. Nove se dodaju u `index.html`, u bloku `rev-track` (svaka recenzija je jedan `<figure class="rev">`; drugi, isti niz služi za neprekidno klizanje).
- Animacija autića u sekciji Koraci i pojavljivanje sekcija pri skrolovanju koriste CSS scroll animacije (Chrome, Edge, novije verzije Safarija). U ostalim pregledačima sadržaj se prikazuje bez animacije.
