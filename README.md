# Futur Haiti — Explorateur du système solaire

Démo éducative web en français et en kreyòl ayisyen. La scène 3D est rendue localement avec Three.js; les textures des corps célestes sont générées par le navigateur. Aucun compte, backend ou service de données externe n’est nécessaire.

## Lancer sous Windows

Installez Node.js 24 ou une version compatible avec Vite 8, puis ouvrez un terminal dans ce dossier :

```powershell
npm install
npm run dev
```

Ouvrez l’adresse affichée par Vite, généralement `http://localhost:5173`.

Pour préparer les fichiers de production : `npm run build`. Pour tester cette version compilée : `npm run preview`.

## Déploiement sur Vercel

Importez ce dépôt GitHub dans Vercel. Vercel détecte Vite automatiquement; utilisez `npm run build` comme commande de compilation et `dist` comme dossier de sortie. Aucun backend ni variable d’environnement n’est requis.

## Explorer

- Faites glisser la scène pour tourner autour du Soleil; utilisez la molette pour zoomer.
- Choisissez l’un des cinq cadrages rapides : orbital, dessus, profil, proche ou panorama; faites ensuite glisser librement la scène pour continuer à explorer.
- Sur téléphone, un doigt fait orbiter la caméra; deux doigts font pivoter le point de vue et pincer pour régler le zoom.
- Sélectionnez une planète dans la scène ou dans le panneau de gauche pour voyager vers elle.
- Après sélection, la caméra suit la planète sur son orbite. Le bouton « Suivi auto · ON/OFF » arrête ou reprend le suivi; le glisser-déposer et la molette permettent toujours de modifier manuellement le point de vue.
- Le panneau pédagogique donne distance moyenne, diamètre, durée du jour et de l’année, température indicative, lunes et fait intéressant.
- « Apprendre » propose les expériences jour/nuit, saisons, année martienne et tailles comparées.
- « Comparer » met en regard diamètre, distance au Soleil, masse relative, gravité de surface, durée du jour et de l’année, ainsi qu’une température indicative.
- Le comparateur propose deux sélecteurs indépendants pour le Soleil et chacune des huit planètes. Les diamètres se calculent depuis les valeurs NASA; le Soleil mesure environ 1 392 000 km, soit 109 fois le diamètre terrestre.
- La comparaison montre aussi deux sphères côte à côte dont le diamètre suit le rapport réel avec la Terre (les plus petites gardent un minimum visible).
- Sélectionnez une planète, puis « Images NASA & missions » pour consulter la vue globale du monde (disque entier ou globe presque entier) et, lorsqu’elle est disponible, l’image rapprochée ou de surface déjà présente. Utilisez les onglets « Vue globale » et « Détail / surface » pour passer de l’une à l’autre.
- Les fichiers sont fournis avec le projet pour rester disponibles hors ligne. Certaines images globales sont des mosaïques NASA assemblées à partir de plusieurs captures; leur légende le précise. Les crédits et liens NASA sont associés à chaque image.
- Le quiz contient trois questions visuelles avec un retour explicatif.
- Les commandes 1×, 10× et 100× modifient la vitesse de la simulation; Pause arrête les mouvements orbitaux.
- FR / KREYÒL change l’interface sans rechargement.
- « Voyager vers Saturne » déclenche un déplacement caméra vers la planète et ses anneaux.

## Précision scientifique

Les valeurs des huit planètes sont centralisées dans `src/data/planets.js`; la fiche de comparaison du Soleil est dans `src/App.jsx`. Distances et tailles visibles dans la scène 3D sont adaptées pour garder toutes les planètes explorables sur un seul écran; elles ne constituent pas un modèle à l’échelle. Les sphères du comparateur suivent le rapport des diamètres sélectionnés, avec un minimum d’affichage pour garder les petits corps visibles; la ligne de comparaison donne aussi leur rapport numérique. Les vitesses orbitales de la scène sont volontairement accélérées.

Les décomptes de lunes signalés comme évolutifs affichent les satellites connus dans les pages NASA consultées en août 2026 : [Jupiter (115)](https://science.nasa.gov/jupiter/jupiter-moons/), [Saturne (293)](https://science.nasa.gov/saturn/moons/), [Uranus (29)](https://science.nasa.gov/uranus/moons/facts/) et [Neptune (16)](https://science.nasa.gov/neptune/moons/). Ces nombres peuvent changer à mesure que de nouveaux satellites sont confirmés.

Sources de référence : [NASA/JPL — Chapter 1: The Solar System](https://science.nasa.gov/learn/basics-of-space-flight/chapter1-2/) et [NASA — Solar System Facts](https://science.nasa.gov/solar-system/solar-system-facts/). Les décomptes de lunes des géantes sont évolutifs et sont indiqués comme tels plutôt qu’énumérés comme des valeurs fixes.

Les images de la galerie incluent des vues globales NASA de Mercure ([MESSENGER](https://science.nasa.gov/mercury/exploration/)), Mars ([Mariner 7](https://science.nasa.gov/photojournal/mars-full-disk-approach-view-from-mariner-7/)), Jupiter ([Voyager 2](https://science.nasa.gov/photojournal/jupiter/)), Saturne ([Cassini](https://science.nasa.gov/photojournal/the-greatest-saturn-portrait-yet/)) et Neptune ([Voyager 2](https://science.nasa.gov/resource/neptune-full-disk-view/)). Les autres images et crédits sont consignés par image dans `src/data/spaceArchive.js`. Les missions mentionnées sont des exemples documentés; la liste n’est pas exhaustive et les concepts futurs sont présentés comme tels.

Cette démonstration est un prototype éducatif indépendant. Elle n’est pas présentée comme un programme officiellement adopté par une institution.

## Stack

- React 19
- Vite 8
- Three.js WebGLRenderer, OrbitControls et CSS2DRenderer
- Textures procédurales locales, sans modèles ou images distants requis
