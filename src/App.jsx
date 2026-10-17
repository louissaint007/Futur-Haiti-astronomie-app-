import { Suspense, lazy, useEffect, useState } from 'react';
import { celestialBodies, planetById } from './data/planets.js';
import { dwarfPlanets, dwarfPlanetById } from './data/dwarfPlanets.js';
import { majorMoons } from './data/majorMoons.js';
import { spaceArchive } from './data/spaceArchive.js';

const SolarScene = lazy(() => import('./SolarScene.jsx'));
const EarthGlobe = lazy(() => import('./EarthGlobe.jsx'));

const copy = {
  fr: {
    explore:'Explorer', learn:'Apprendre', compare:'Comparer', quiz:'Mini quiz',
    headline:'Le système solaire, à portée de main.', subhead:'Touchez un monde pour vous en approcher.',
    navTitle:'ESPACE DE DÉCOUVERTE', planets:'SOLEIL + 8 PLANÈTES', dwarfExploreTitle:'PLANÈTES NAINES', guide:'GUIDE D’EXPLORATION',
    drag:'Glisser pour tourner', zoom:'Molette pour zoomer', gestureTwo:'2 doigts : tourner / zoomer', selection:'Faites un premier voyage',
    selectionHint:'Choisissez une planète sur la scène ou dans la liste.', overview:'Vue complète',
    labels:'Noms des planètes', time:'TEMPS PÉDAGOGIQUE', timeNote:'Mouvements accélérés pour les observer.',
    followOn:'Suivi auto · ON', followOff:'Suivi auto · OFF',
    cameraViews:'ANGLES DE VUE', viewOrbit:'Orbital', viewTop:'Dessus', viewSide:'Profil', viewClose:'Proche', viewWide:'Panorama', nextView:'Vue suivante', info:'Info', hideDetails:'Masquer la fiche', showDetails:'Afficher la fiche',
    scaleNote:'Visualisation pédagogique : tailles, distances et vitesses sont adaptées. Les données affichées gardent leurs unités réelles.',
    modePed:'Vue pédagogique', about:'À propos', type:'PLANÈTE', diameter:'DIAMÈTRE', day:'UNE JOURNÉE',
    year:'UNE ANNÉE', temperature:'TEMPÉRATURE', moons:'LUNES CONNUES', more:'Le savais-tu ?',
    compareEarth:'Comparer à la Terre', wow:'Voyager vers Saturne', appTag:'EXPLORER · COMPRENDRE · APPRENDRE',
    learnTitle:'Voir pour comprendre', learnIntro:'Choisissez une petite expérience.',
    learningPathTitle:'Où sommes-nous ?', learningPathCaption:'Le système solaire se trouve dans la Voie lactée.', learningEarth:'Terre', learningSolar:'Système solaire', learningGalaxy:'Voie lactée', learningUniverse:'Univers observable',
    starTypesTitle:'Quelques types d’étoiles', starTypesIntro:'Choisis une étoile pour découvrir sa surface et son évolution.', starConcept:'Conception d’artiste · texture illustrative', starPhoto:'Photographie réelle du Soleil', starSunName:'Étoile semblable au Soleil', starSunFact:'Le Soleil est une étoile de type G, dite naine jaune. Sa surface visible, la photosphère, est un plasma chaud qui présente une granulation et des taches solaires.', starRedDwarfName:'Naine rouge', starRedDwarfFact:'Petite et moins chaude que le Soleil, une naine rouge rayonne surtout dans le rouge et l’infrarouge. Les détails colorés de cette vue sont une interprétation artistique, pas une carte de sa surface.', starRedGiantName:'Géante rouge', starRedGiantFact:'En vieillissant, une étoile comme le Soleil se dilate et sa surface se refroidit. De grandes cellules de convection peuvent couvrir une partie importante de cette immense enveloppe.', starBlueName:'Étoile bleue massive', starBlueFact:'Les étoiles bleues massives sont beaucoup plus chaudes et lumineuses que le Soleil, et consomment leur combustible rapidement. Leur surface est représentée ici de façon artistique.',
    moonModelTitle:'Soleil, Terre et Lune', moonModelIntro:'Fais tourner la Lune autour de la Terre et observe comment sa phase apparente change.', moonPhaseLabel:'Position de la Lune', moonPhaseNames:['Nouvelle Lune','Premier croissant','Premier quartier','Lune gibbeuse croissante','Pleine Lune','Lune gibbeuse décroissante','Dernier quartier','Dernier croissant'], moonIllumination:'Partie éclairée visible', moonOrbitFact:'Les phases viennent de la position de la Lune autour de la Terre; la Lune ne produit pas sa propre lumière.', moonEclipseNote:'Une éclipse demande un alignement précis. Comme l’orbite lunaire est inclinée d’environ 5°, il n’y a pas d’éclipse à chaque nouvelle ou pleine Lune.', moonSunLabel:'Lumière du Soleil', moonEarthLabel:'Terre', moonMoonLabel:'Lune', moonScaleNote:'Schéma simplifié : les distances, les tailles et l’inclinaison ne sont pas à l’échelle.',
    smallWorldsTitle:'Au-delà des huit planètes', smallWorldsIntro:'D’autres corps orbitent autour du Soleil : ils ne sont pas tous des planètes.', dwarfPlanetsHeading:'Planètes naines reconnues', dwarfPlanetsStatus:'5 reconnues par l’UAI', dwarfPlanetsDefinition:'Elles orbitent autour du Soleil et sont presque rondes, mais n’ont pas dégagé leur voisinage orbital comme les huit planètes.', moreCandidates:'D’autres candidates pourraient être reconnues à l’avenir.', smallBodyHeading:'Petits corps : les distinguer', asteroidsLabel:'Astéroïdes', asteroidsFact:'Petits corps rocheux. Beaucoup se trouvent dans la ceinture entre Mars et Jupiter.', cometsLabel:'Comètes', cometsFact:'Corps riches en glaces et poussières; près du Soleil, leur matière peut former une chevelure et une queue.', meteorChainLabel:'Météoroïde → météore → météorite', meteorChainFact:'Un fragment dans l’espace est un météoroïde. La traînée lumineuse dans l’atmosphère est un météore; s’il en reste au sol, c’est une météorite.', scienceSources:'Sources scientifiques ↗',
    moonWorldsTitle:'Les lunes remarquables des géantes', moonWorldsIntro:'Choisis Jupiter, Uranus ou Neptune; les sphères gardent leur rapport de diamètre.', moonParentJupiter:'Jupiter', moonParentUranus:'Uranus', moonParentNeptune:'Neptune', moonScaleLabel:'Diamètre réel', moonPreviewLabel:'Aperçu agrandi · rapport des tailles conservé', moonWaterLabel:'Eau et glace', moonSources:'NASA · diamètres et mondes océaniques ↗',
    journeyTitle:'Notre place dans l’espace', journeyIntro:'Un court voyage pour relier la Terre, le Soleil et les planètes.', journeyStart:'Commencer le parcours', journeyStep:'Étape', journeyOf:'sur', journeyNext:'Étape suivante', journeyCheck:'Vérifier mes acquis', journeyRestart:'Recommencer', journeyAddressTitle:'Notre adresse cosmique', journeyAddressBody:'Nous vivons sur la Terre, l’une des huit planètes de notre système solaire. Ce système se trouve dans la galaxie appelée Voie lactée.', journeyStarTitle:'Le Soleil est une étoile', journeyStarBody:'Le Soleil produit sa propre lumière : c’est une étoile. Les autres étoiles nous paraissent petites surtout parce qu’elles sont beaucoup plus lointaines.', journeyOrbitTitle:'Les planètes orbitent autour du Soleil', journeyOrbitBody:'La gravité du Soleil maintient les huit planètes sur leur orbite. Une orbite est le trajet d’un astre autour d’un autre.', journeyScaleTitle:'Comparer les diamètres', journeyScaleBody:'Le diamètre de Jupiter vaut environ 11 fois celui de la Terre. Celui du Soleil vaut environ 109 fois celui de la Terre. Dans la scène, les tailles sont adaptées pour rester visibles.', journeyEarthValue:'Terre · 12 742 km', journeyJupiterValue:'Jupiter · 139 820 km · ≈ 11 Terres', journeySunValue:'Soleil · 1 392 000 km · ≈ 109 Terres',
    sunIsStar:'Le Soleil est une étoile', sunIsStarSub:'Notre étoile proche éclaire huit planètes.', sunIsStarBody:'Le Soleil est une étoile : une immense sphère de gaz chaud qui produit sa propre lumière. Il nous paraît beaucoup plus grand et lumineux que les autres étoiles parce qu’il est bien plus proche de la Terre. Les huit planètes connues de notre système solaire orbitent autour de lui.',
    dayNight:'Le jour et la nuit', dayNightSub:'La Terre tourne sur elle-même.',
    seasons:'Les saisons', seasonsSub:'L’axe incliné accompagne la Terre autour du Soleil.',
    marsYear:'Une année sur Mars', marsYearSub:'Compare les tours de la Terre et de Mars.',
    bigPlanet:'Les géantes', bigPlanetSub:'Compare la taille de Jupiter avec la Terre.',
    lessonDay:'La moitié tournée vers le Soleil reçoit la lumière du jour. En tournant, chaque région passe ensuite dans la nuit.',
    lessonSeason:'L’axe de la Terre reste incliné d’environ 23,4°. Au fil de l’année, chaque hémisphère reçoit la lumière différemment.',
    lessonMars:'Mars est plus loin du Soleil. Son orbite est plus grande et un tour prend 687 jours terrestres.',
    lessonSize:'Le diamètre de Jupiter est environ 11 fois celui de la Terre. Les sphères de comparaison suivent ce rapport.',
    stopLesson:'Terminer l’expérience', compareHeading:'Comparer deux mondes', choose:'Choisir', firstWorld:'Monde A', secondWorld:'Monde B',
    earth:'Terre', diameterCompare:'Diamètre', distanceCompare:'Distance du Soleil', massCompare:'Masse (Terre = 1)', gravityCompare:'Gravité (Terre = 1)', dayCompare:'Durée du jour', yearCompare:'Durée de l’année', temperatureCompare:'Température', quizTitle:'Teste ton intuition',
    correct:'Bien vu !', incorrect:'Pas tout à fait.', continueQuiz:'Question suivante', quizDone:'Mission accomplie !',
    restartQuiz:'Rejouer', aboutTitle:'Apprendre en explorant',
    aboutText:'Cette démonstration illustre la vision de Futur Haiti : utiliser les nouvelles technologies pour rendre certains concepts éducatifs plus visuels, interactifs et accessibles.',
    aboutFact:'Prototype éducatif indépendant. Il ne représente pas un programme officiellement adopté par une institution.',
    close:'Fermer', sun:'Soleil', milKm:'millions de km', au:'UA', multiple:'Nombre en évolution', moonNone:'Aucune lune connue', moonKnown:'lune connue', moonsKnown:'lunes déjà connues', countChanging:'Décompte évolutif', moonsAsOf:'Source NASA · août 2026',
    globeMode:'GLOBE MANIPULABLE', globeTitle:'Explore la Terre', globeSubtitle:'Le globe reste immobile jusqu’à ce que tu le manipules.', globeCanvas:'Globe terrestre interactif et immobile', globeInstructions:'Glisse pour faire tourner le globe · pince ou utilise + et − pour zoomer.', globeControls:'Commandes du globe', globeReset:'Recentrer le globe', zoomIn:'Zoomer davantage', zoomOut:'Dézoomer', openGlobe:'Manipuler le globe', openGlobeSub:'Tourne la Terre et observe-la de près',
    question:'QUESTION', questionOne:'Quelle planète est la plus grande ?', questionFour:'Le Soleil est…', answerStar:'Une étoile', answerPlanet:'Une planète', answerMoon:'Un satellite naturel', explainStar:'Le Soleil est une étoile parce qu’il produit sa propre lumière. Les planètes, elles, réfléchissent la lumière qu’elles reçoivent.', explainMercury:'Mercure est la planète la plus proche du Soleil. Elle met environ 88 jours terrestres pour en faire le tour.', questionFive:'Qu’est-ce qui provoque l’alternance du jour et de la nuit ?', answerRotation:'La rotation de la Terre sur elle-même', answerRevolution:'La révolution de la Terre autour du Soleil', answerMoonMotion:'Le mouvement de la Lune', explainRotation:'La Terre tourne sur elle-même. La moitié tournée vers le Soleil est éclairée; l’autre est dans la nuit.', questionSix:'Quelle est la cause principale des saisons sur Terre ?', answerTilt:'L’inclinaison de l’axe terrestre', answerDistance:'La distance Terre–Soleil qui change fortement', answerSunHeat:'Le Soleil qui chauffe davantage toute la Terre', explainSeasons:'L’axe terrestre est incliné. Pendant son orbite, les hémisphères reçoivent la lumière solaire avec des angles et des durées différents.', questionSeven:'Comment appelle-t-on le trajet d’une planète autour du Soleil ?', answerOrbit:'Une orbite', explainOrbit:'Une orbite est le trajet d’un astre autour d’un autre. Les huit planètes de notre système solaire orbitent autour du Soleil.',
    questionTwo:'Quelle planète est la plus proche du Soleil ?',
    questionThree:'Quelle planète possède les anneaux les plus visibles ?',
    factSolarSystem:'Huit planètes orbitent autour du Soleil.', intro:'Explorez notre système solaire',
    introBy:'Une expérience éducative interactive par Futur Haiti', enter:'Entrer dans l’espace',
    skip:'Passer l’introduction', timeLabel:'PAUSE', scale:'COMPARAISON DES TAILLES',
    home:'PLANÈTE HABITÉE', thanks:'Merci d’explorer',
    realImages:'Images NASA & missions', realImagesSub:'Archives de missions spatiales', imageCredit:'Image', missionsTitle:'Missions marquantes', sourceLink:'Source NASA ↗', imageContext:'Image réelle issue d’une mission ou d’un observatoire spatial. Certaines vues scientifiques sont recolorées ou assemblées.',
    globalView:'Vue globale', detailView:'Détail / surface',
    diameterVisual:'Rapport des diamètres', earthReference:'', largerThan:'fois plus grand que', comparedWorld:'Monde choisi',
  },
  ht: {
    explore:'Eksplore', learn:'Aprann', compare:'Konpare', quiz:'Ti egzamen',
    headline:'Sistèm solè a nan men ou.', subhead:'Chwazi yon planèt pou pwoche bò kote l.',
    navTitle:'ESPAS DEKOUVÈT', planets:'SOLÈY + 8 PLANÈT YO', dwarfExploreTitle:'PLANÈT NEN YO', guide:'GID EKSPLORASYON',
    drag:'Trennen pou vire', zoom:'Wou sourit pou rale', gestureTwo:'2 dwèt: vire / rale', selection:'Fè premye vwayaj ou',
    selectionHint:'Chwazi yon planèt sou sèn nan oswa nan lis la.', overview:'Tout sistèm nan',
    labels:'Non planèt yo', time:'TAN POU APRANN', timeNote:'Mouvman yo akselere pou nou ka obsève yo.',
    followOn:'Swivi otomatik · AKTIF', followOff:'Swivi otomatik · KANPE',
    cameraViews:'ANG DE VI', viewOrbit:'Òbit', viewTop:'Anwo', viewSide:'Kòt', viewClose:'Pre', viewWide:'Lwen', nextView:'Pwochen ang', info:'Enfò', hideDetails:'Kache enfòmasyon yo', showDetails:'Montre enfòmasyon yo',
    scaleNote:'Vizyalizasyon pou aprann: gwosè, distans ak vitès adapte. Done yo kenbe vrè inite yo.',
    modePed:'Vizyalizasyon aprantisaj', about:'Konsènan', type:'KALITE PLANÈT', diameter:'DYAMÈT', day:'YON JOUNEN',
    year:'YON ANE', temperature:'TANPERATI', moons:'LALIN KI KONI', more:'Èske w te konnen?',
    compareEarth:'Konpare ak Latè', wow:'Vwayaje pou ale Satin', appTag:'EKSPLÒRE · KONPRANN · APRANN',
    learnTitle:'Gade pou w konprann', learnIntro:'Chwazi yon ti eksperyans.',
    learningPathTitle:'Ki kote nou ye?', learningPathCaption:'Sistèm solè a nan Wout Lakte a.', learningEarth:'Latè', learningSolar:'Sistèm solè a', learningGalaxy:'Wout Lakte', learningUniverse:'Linivè nou ka obsève',
    starTypesTitle:'Kèk kalite etwal', starTypesIntro:'Chwazi yon etwal pou dekouvri sifas li ak evolisyon li.', starConcept:'Konsepsyon atis · teksti ilistratif', starPhoto:'Vrè foto Solèy la', starSunName:'Etwal ki sanble ak Solèy la', starSunFact:'Solèy la se yon etwal tip G, yo rele tinen jòn. Sifas li nou wè a, fotosfè a, se yon plasma cho ki gen granil ak tach solèy.', starRedDwarfName:'Tinen wouj', starRedDwarfFact:'Yon tinen wouj piti epi li mwens cho pase Solèy la; li bay sitou limyè wouj ak enfrawouj. Ti detay koulè nan imaj sa a se entèpretasyon atistik, se pa yon kat sifas li.', starRedGiantName:'Jeyan wouj', starRedGiantFact:'Lè yon etwal tankou Solèy la ap vyeyi, li vin pi gwo epi sifas li vin pi fre. Gwo selil konveksyon ka kouvri yon bon pati anvlòp jeyan sa a.', starBlueName:'Gwo etwal ble', starBlueFact:'Gwo etwal ble yo pi cho epi pi klere pase Solèy la, epi yo boule gaz yo vit. Imaj sa a montre sifas yo yon fason atistik.',
    moonModelTitle:'Solèy, Latè ak Lalin', moonModelIntro:'Fè Lalin nan vire toutotou Latè pou w wè kijan faz li parèt diferan.', moonPhaseLabel:'Pozisyon Lalin nan', moonPhaseNames:['Nouvo Lalin','Premye kwasan','Premye ka','Lalin prèske plen k ap grandi','Plen Lalin','Lalin prèske plen k ap bese','Dènye ka','Dènye kwasan'], moonIllumination:'Pati ki klere nou ka wè', moonOrbitFact:'Faz yo depann de pozisyon Lalin nan toutotou Latè; Lalin nan pa pwodui limyè pa li.', moonEclipseNote:'Eklips mande yon aliyman presi. Òbit Lalin nan panche anviwon 5°, se poutèt sa pa gen eklips chak fwa gen nouvo oswa plen Lalin.', moonSunLabel:'Limyè Solèy la', moonEarthLabel:'Latè', moonMoonLabel:'Lalin', moonScaleNote:'Dyagram senplifye: distans, gwosè ak pant lan pa respekte echèl la.',
    smallWorldsTitle:'Pi lwen pase uit planèt yo', smallWorldsIntro:'Gen lòt ast k ap vire toutotou Solèy la; se pa tout ki planèt.', dwarfPlanetsHeading:'Planèt nen yo rekonèt', dwarfPlanetsStatus:'Inyon Astwonomik Entènasyonal la rekonèt 5', dwarfPlanetsDefinition:'Yo vire toutotou Solèy la, yo prèske won, men yo poko netwaye zòn òbit yo tankou uit planèt yo.', moreCandidates:'Yo ka rekonèt lòt kandida pi devan.', smallBodyHeading:'Ti kò yo: fè diferans lan', asteroidsLabel:'Astewoyid', asteroidsFact:'Ti kò wòch. Anpil ladan yo nan senti ki ant Mas ak Jipitè.', cometsLabel:'Komèt', cometsFact:'Kò ki gen glas ak pousyè; bò kote Solèy la, materyèl yo ka fòme yon nyaj ak yon ke.', meteorChainLabel:'Meteowoyid → meteyò → meteyorit', meteorChainFact:'Yon ti moso nan lespas se meteowoyid. Tras limyè a nan atmosfè a se meteyò; si gen moso ki rive atè, se meteyorit.', scienceSources:'Sous syantifik ↗',
    moonWorldsTitle:'Gwo lalin planèt jeyan yo', moonWorldsIntro:'Chwazi Jipitè, Iranis oswa Neptin; esfè yo respekte rapò dyamèt yo.', moonParentJupiter:'Jipitè', moonParentUranus:'Iranis', moonParentNeptune:'Neptin', moonScaleLabel:'Vrè dyamèt', moonPreviewLabel:'Aperçu agrandi · rapò gwosè yo konsève', moonWaterLabel:'Dlo ak glas', moonSources:'NASA · dyamèt ak monn oseyanik ↗',
    journeyTitle:'Kote nou ye nan lespas', journeyIntro:'Yon ti vwayaj pou konekte Latè, Solèy la ak planèt yo.', journeyStart:'Kòmanse vwayaj la', journeyStep:'Etap', journeyOf:'sou', journeyNext:'Etap apre a', journeyCheck:'Verifye sa mwen aprann', journeyRestart:'Rekòmanse', journeyAddressTitle:'Adrès nou nan lespas', journeyAddressBody:'Nou rete sou Latè, youn nan uit planèt sistèm solè nou an. Sistèm sa a nan yon galaksi ki rele Wout Lakte.', journeyStarTitle:'Solèy la se yon etwal', journeyStarBody:'Solèy la pwodui limyè pa li: se yon etwal. Lòt etwal yo parèt piti sitou paske yo pi lwen anpil.', journeyOrbitTitle:'Planèt yo ap fè òbit Solèy la', journeyOrbitBody:'Gravite Solèy la kenbe uit planèt yo sou òbit yo. Òbit se chemen yon ast ki fè wonn yon lòt.', journeyScaleTitle:'Konpare dyamèt yo', journeyScaleBody:'Dyamèt Jipitè anviwon 11 fwa dyamèt Latè. Dyamèt Solèy la anviwon 109 fwa dyamèt Latè. Nan sèn nan, gwosè yo adapte pou yo rete vizib.', journeyEarthValue:'Latè · 12 742 km', journeyJupiterValue:'Jipitè · 139 820 km · ≈ 11 Latè', journeySunValue:'Solèy · 1 392 000 km · ≈ 109 Latè',
    sunIsStar:'Solèy la se yon etwal', sunIsStarSub:'Etwal ki toupre nou an klere uit planèt.', sunIsStarBody:'Solèy la se yon etwal: yon gwo boul gaz cho ki pwodui limyè pa li. Li sanble pi gwo ak pi klere pase lòt etwal yo paske li pi pre Latè. Uit planèt yo nan sistèm solè nou an ap fè wonn Solèy la.',
    dayNight:'Lajounen ak lannuit', dayNightSub:'Latè ap vire sou tèt li.',
    seasons:'Sezon yo', seasonsSub:'Aks panche a akonpaye Latè bò kote Solèy la.',
    marsYear:'Yon ane sou Mas', marsYearSub:'Konpare tou Latè ak tou Mas.',
    bigPlanet:'Planèt jeyan yo', bigPlanetSub:'Konpare gwosè Jipitè ak Latè.',
    lessonDay:'Mwatye Latè ki bay fas ak Solèy la jwenn limyè lajounen. Pandan Latè ap vire, zòn yo antre nan lannuit.',
    lessonSeason:'Aks Latè panche anviwon 23.4°. Pandan ane a ap pase, chak emisfè jwenn limyè a yon fason diferan.',
    lessonMars:'Mas pi lwen Solèy la. Òbit li pi laj epi yon tou pran 687 jou sou Latè.',
    lessonSize:'Dyamèt Jipitè anviwon 11 fwa dyamèt Latè. Gwosè yo sou ekran an suiv rapò sa a.',
    stopLesson:'Fini eksperyans lan', compareHeading:'Konpare de monn', choose:'Chwazi', firstWorld:'Monn A', secondWorld:'Monn B',
    earth:'Latè', diameterCompare:'Dyamèt', distanceCompare:'Distans ak Solèy la', massCompare:'Mas (Latè = 1)', gravityCompare:'Gravite (Latè = 1)', dayCompare:'Dire jounen an', yearCompare:'Dire ane a', temperatureCompare:'Tanperati', quizTitle:'Teste konesans ou',
    correct:'Se sa menm!', incorrect:'Se pa sa.', continueQuiz:'Pwochen kesyon', quizDone:'Misyon fini!',
    restartQuiz:'Rekòmanse', aboutTitle:'Aprann pandan w ap eksplore',
    aboutText:'Demonstrasyon sa a montre vizyon Futur Haiti: sèvi ak nouvo teknoloji pou fè kèk sijè edikatif pi vizyèl, entèaktif ak aksesib.',
    aboutFact:'Pwototip edikatif endepandan. Li pa yon pwogram yon enstitisyon adopte ofisyèlman.',
    close:'Fèmen', sun:'Solèy', milKm:'milyon km', au:'UA', multiple:'Kantite a ap chanje', moonNone:'Pa gen lalin nou konnen', moonKnown:'lalin nou konnen', moonsKnown:'lalin nou deja konnen', countChanging:'Kantite a ap chanje', moonsAsOf:'Sous NASA · out 2026',
    globeMode:'GLOB KI KA MANIPILE', globeTitle:'Eksplore Latè', globeSubtitle:'Glòb la rete san l pa vire jiskaske ou manyen l.', globeCanvas:'Glòb Latè entèaktif ki pa vire poukont li', globeInstructions:'Trennen pou vire glòb la · peze ak de dwèt oswa itilize + ak − pou rale.', globeControls:'Kontwòl glòb la', globeReset:'Mete glòb la nan mitan ankò', zoomIn:'Rale pi pre', zoomOut:'Rale pi lwen', openGlobe:'Manyen glòb la', openGlobeSub:'Vire Latè epi gade l pi pre',
    question:'KESYON', questionOne:'Ki planèt ki pi gwo a?', questionFour:'Solèy la se…', answerStar:'Yon etwal', answerPlanet:'Yon planèt', answerMoon:'Yon satelit natirèl', explainStar:'Solèy la se yon etwal paske li pwodui limyè pa li. Planèt yo menm reflete limyè yo resevwa.', explainMercury:'Mèki se planèt ki pi pre Solèy la. Li pran anviwon 88 jou sou Latè pou l fè yon tou.', questionFive:'Ki sa ki fè lajounen ak lannuit chanje?', answerRotation:'Latè k ap vire sou tèt li', answerRevolution:'Latè k ap fè wonn Solèy la', answerMoonMotion:'Mouvman Lalin nan', explainRotation:'Latè ap vire sou tèt li. Mwatye ki bay fas ak Solèy la jwenn limyè; lòt mwatye a nan fènwa.', questionSix:'Ki pi gwo koz sezon yo sou Latè?', answerTilt:'Aks Latè ki panche', answerDistance:'Distans Latè ak Solèy la ki chanje anpil', answerSunHeat:'Solèy la ki chofe tout Latè a plis', explainSeasons:'Aks Latè panche. Pandan Latè ap fè wonn, chak emisfè resevwa limyè Solèy la ak ang ak dire ki diferan.', questionSeven:'Ki non chemen yon planèt fè toutotou Solèy la?', answerOrbit:'Yon òbit', explainOrbit:'Òbit se chemen yon ast fè toutotou yon lòt. Uit planèt ki nan sistèm solè nou an ap fè òbit Solèy la.',
    questionTwo:'Ki planèt ki pi pre Solèy la?', questionThree:'Ki planèt ki gen bag ki pi vizib yo?',
    factSolarSystem:'Uit planèt ap fè wonn Solèy la.', intro:'Eksplore sistèm solè nou an',
    introBy:'Yon eksperyans aprantisaj entèaktif pa Futur Haiti', enter:'Antre nan lespas',
    skip:'Pase entwodiksyon an', timeLabel:'KANPE', scale:'KONPARE GWOSÈ YO',
    home:'N AP VIV SOU LI', thanks:'Mèsi paske w ap eksplore',
    realImages:'Imaj NASA ak misyon yo', realImagesSub:'Achiv misyon espasyal yo', imageCredit:'Imaj', missionsTitle:'Misyon enpòtan', sourceLink:'Sous NASA ↗', imageContext:'Imaj reyèl ki soti nan yon misyon oswa yon obsèvatwa espasyal. Gen kèk imaj syantifik yo ki gen koulè modifye oswa ki fèt ak plizyè imaj.',
    globalView:'Tout planèt la', detailView:'Detay / sifas',
    diameterVisual:'Konpare dyamèt yo', earthReference:'rapò reyèl', largerThan:'fwa pi laj pase', comparedWorld:'Monn n ap konpare a',
  },
};

const quizzes = [
  { key:'questionOne', correct:'jupiter', explanation:'lessonSize', options:['earth','jupiter','saturn'] },
  { key:'questionTwo', correct:'mercury', explanation:'explainMercury', options:['mercury','venus','mars'] },
  { key:'questionThree', correct:'saturn', explanation:'factSaturn', options:['jupiter','saturn','uranus'] },
  { key:'questionFour', correct:'star', explanation:'explainStar', options:['star','planet','moon'] },
  { key:'questionFive', correct:'rotation', explanation:'explainRotation', options:['rotation','revolution','moonMotion'] },
  { key:'questionSix', correct:'tilt', explanation:'explainSeasons', options:['tilt','distance','sunHeat'] },
  { key:'questionSeven', correct:'orbit', explanation:'explainOrbit', options:['orbit','rotation','moonMotion'] },
];
const guidedJourney = [
  { title:'journeyAddressTitle', body:'journeyAddressBody', planet:'earth' },
  { title:'journeyStarTitle', body:'journeyStarBody', planet:'sun' },
  { title:'journeyOrbitTitle', body:'journeyOrbitBody', planet:'earth' },
  { title:'journeyScaleTitle', body:'journeyScaleBody', planet:'jupiter' },
];
const lessons = [
  { id:'star', title:'sunIsStar', subtitle:'sunIsStarSub', body:'sunIsStarBody', planet:'sun', symbol:'☼' },
  { id:'day', title:'dayNight', subtitle:'dayNightSub', body:'lessonDay', planet:'earth', symbol:'◐' },
  { id:'seasons', title:'seasons', subtitle:'seasonsSub', body:'lessonSeason', planet:'earth', symbol:'◒' },
  { id:'mars', title:'marsYear', subtitle:'marsYearSub', body:'lessonMars', planet:'mars', symbol:'↗' },
  { id:'size', title:'bigPlanet', subtitle:'bigPlanetSub', body:'lessonSize', planet:'jupiter', symbol:'◎' },
];
const sunComparison = {
  id:'sun', name:{fr:'Soleil',ht:'Solèy'}, diameterKm:1392000, earthDiameters:1392000 / 12742,
  color:'#f6b93b', distanceAu:0, massEarth:333000, gravityEarth:27.9,
  day:{fr:'Environ 25 jours',ht:'Anviwon 25 jou'}, year:{fr:'—',ht:'—'},
  temperature:{fr:'Photosphère : environ 5 500 °C',ht:'Fotosfè: anviwon 5 500 °C'},
};
const comparisonWorlds = [sunComparison, ...celestialBodies];

function Metric({ label, value, unit }) {
  return <div className="metric-card"><span>{label}</span><strong>{value}</strong>{unit && <small>{unit}</small>}</div>;
}

const starTypes = [
  { id:'sun', name:'starSunName', fact:'starSunFact', image:'/nasa/sun.jpg', imageClass:'star-image-sun', real:true },
  { id:'red-dwarf', name:'starRedDwarfName', fact:'starRedDwarfFact', image:'/stars/red-dwarf.svg' },
  { id:'red-giant', name:'starRedGiantName', fact:'starRedGiantFact', image:'/stars/red-giant.svg' },
  { id:'blue-massive', name:'starBlueName', fact:'starBlueFact', image:'/stars/blue-massive.svg' },
];

function App() {
  const [locale, setLocale] = useState('fr');
  const [mode, setMode] = useState('explore');
  const [selectedId, setSelectedId] = useState(null);
  const [focusRequest, setFocusRequest] = useState(0);
  const [timeScale, setTimeScale] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [followPlanet, setFollowPlanet] = useState(true);
  const [viewId, setViewId] = useState('orbit');
  const [viewRequest, setViewRequest] = useState(0);
  const [detailsCollapsed, setDetailsCollapsed] = useState(false);
  const [intro, setIntro] = useState(true);
  const [lessonId, setLessonId] = useState(null);
  const [starTypeId, setStarTypeId] = useState('sun');
  const [journeyStep, setJourneyStep] = useState(-1);
  const [moonAngle, setMoonAngle] = useState(0);
  const [dwarfPlanetId, setDwarfPlanetId] = useState('ceres');
  const [moonParentId, setMoonParentId] = useState('jupiter');
  const [selectedMoonId, setSelectedMoonId] = useState('europa');
  const [compareId, setCompareId] = useState('jupiter');
  const [compareReferenceId, setCompareReferenceId] = useState('earth');
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [archiveImageIndex, setArchiveImageIndex] = useState(0);
  const [earthGlobeOpen, setEarthGlobeOpen] = useState(false);
  const [notice, setNotice] = useState('');
  const t = copy[locale];
  const selected = selectedId && selectedId !== 'sun' ? (planetById[selectedId] || dwarfPlanetById[selectedId]) : null;
  const lesson = lessons.find(item => item.id === lessonId);
  const compare = comparisonWorlds.find(body => body.id === compareId) || planetById.jupiter;
  const compareReference = comparisonWorlds.find(body => body.id === compareReferenceId) || planetById.earth;
  const largerWorld = compare.earthDiameters >= compareReference.earthDiameters ? compare : compareReference;
  const smallerWorld = largerWorld === compare ? compareReference : compare;
  const diameterRatio = largerWorld.earthDiameters / smallerWorld.earthDiameters;
  const comparisonScale = 72 / Math.max(compare.earthDiameters, compareReference.earthDiameters);
  const archive = spaceArchive[selectedId || 'earth'];
  const archiveImages = archive ? [archive.global, ...(archive.global?.image === archive.image ? [] : [archive])].filter(Boolean) : [];
  const archiveImage = archiveImages[archiveImageIndex] || archiveImages[0];
  const quiz = quizzes[quizIndex];
  const selectedDwarfPlanet = dwarfPlanetById[dwarfPlanetId] || dwarfPlanets[0];
  const selectedMoon = majorMoons.find(moon => moon.id === selectedMoonId) || majorMoons[0];
  const visibleMoons = majorMoons.filter(moon => moon.planet === moonParentId);
  const moonPhaseIndex = Math.floor((((moonAngle + 22.5) % 360) / 45));
  const moonIlluminationPercent = Math.round((1 - Math.cos(moonAngle * Math.PI / 180)) * 50);
  const moonOrbitRadius = 66;
  const moonOrbitRadians = moonAngle * Math.PI / 180;
  const moonPosition = { x: 178 - Math.cos(moonOrbitRadians) * moonOrbitRadius, y: 102 + Math.sin(moonOrbitRadians) * moonOrbitRadius };


  useEffect(() => {
    if (!selectedId) return undefined;
    const mobile = window.matchMedia('(max-width: 820px)');
    const syncDetails = () => setDetailsCollapsed(mobile.matches);
    syncDetails();
    mobile.addEventListener('change', syncDetails);
    return () => mobile.removeEventListener('change', syncDetails);
  }, [selectedId, mode]);
  useEffect(() => {
    if (!notice) return undefined;
    const timer = window.setTimeout(() => setNotice(''), 2600);
    return () => window.clearTimeout(timer);
  }, [notice]);
  useEffect(() => {
    if (!lesson) return undefined;
    setMode('learn');
    setSelectedId(lesson.planet);
    setFocusRequest(value => value + 1);
    setIsPaused(true);
    const timer = window.setTimeout(() => setIsPaused(false), 1300);
    return () => window.clearTimeout(timer);
  }, [lessonId]);

  const names = Object.fromEntries([...celestialBodies, ...dwarfPlanets].map(body => [body.id, body.name[locale]]));
  const nameOf = id => names[id] || t.sun;
  const focus = id => {
    setSelectedId(id);
    setDetailsCollapsed(false);
    setFocusRequest(value => value + 1);
    setLessonId(null);
  };
  const overview = () => {
    setSelectedId(null);
    setLessonId(null);
    setFocusRequest(value => value + 1);
  };
  const chooseView = id => {
    setViewId(id);
    setViewRequest(value => value + 1);
  };
  const cycleView = () => {
    const views = ['orbit','top','side','close','wide'];
    chooseView(views[(views.indexOf(viewId) + 1) % views.length]);
  };
  const selectMode = next => {
    setMode(next);
    setLessonId(null);
    if (next !== 'learn') setJourneyStep(-1);
    if (next === 'quiz') {
      setQuizIndex(0);
      setQuizAnswer(null);
      setIsPaused(true);
    } else if (next !== 'learn') setIsPaused(false);
  };
  const startJourney = () => {
    setJourneyStep(0);
    focus(guidedJourney[0].planet);
    setIsPaused(false);
  };
  const advanceJourney = () => {
    if (journeyStep >= guidedJourney.length - 1) {
      selectMode('quiz');
      return;
    }
    const nextStep = journeyStep + 1;
    setJourneyStep(nextStep);
    focus(guidedJourney[nextStep].planet);
    setIsPaused(false);
  };
  const restartJourney = () => {
    setJourneyStep(-1);
    setSelectedId(null);
    setLessonId(null);
    setFocusRequest(value => value + 1);
  };
  const chooseAnswer = id => {
    if (quizAnswer || !quiz) return;
    setQuizAnswer(id);
    if (id === quiz.correct) setNotice(t.correct);
  };
  const nextQuestion = () => {
    setQuizAnswer(null);
    setQuizIndex(value => Math.min(value + 1, quizzes.length));
  };
  const moonCount = body => body.moonsChanging
    ? `${t.countChanging} · ${body.moons} ${t.moonsKnown}`
    : body.moons === 0 ? t.moonNone : `${body.moons} ${body.moons === 1 ? t.moonKnown : (locale === 'fr' ? 'lunes connues' : t.moonsKnown)}`;
  const localizeQuizName = id => planetById[id]?.name[locale] || t[id === 'star' ? 'answerStar' : id === 'planet' ? 'answerPlanet' : id === 'moon' ? 'answerMoon' : id === 'rotation' ? 'answerRotation' : id === 'revolution' ? 'answerRevolution' : id === 'moonMotion' ? 'answerMoonMotion' : id === 'tilt' ? 'answerTilt' : id === 'distance' ? 'answerDistance' : id === 'orbit' ? 'answerOrbit' : 'answerSunHeat'];

  return (
    <div className="app-frame">
      <header className="topbar">
        <button className="brand" onClick={overview} aria-label="Futur Haiti, accueil">
          <span className="brand-mark">✦</span><span><strong>FUTUR <b>HAITI</b></strong><small>{t.appTag}</small></span>
        </button>
        <div className="topbar-center"><span className="system-live"/>{t.factSolarSystem}<span className="topbar-separator">·</span><span className="muted-label">{t.modePed}</span></div>
        <div className="topbar-actions">
          <div className="language-switch" aria-label="Langue">
            <button className={locale === 'fr' ? 'active' : ''} onClick={() => setLocale('fr')}>FR</button>
            <button className={locale === 'ht' ? 'active' : ''} onClick={() => setLocale('ht')}>KREYÒL</button>
          </div>
          <button className="about-button" onClick={() => setAboutOpen(true)}>{t.about}</button>
        </div>
      </header>

      <main className={'explorer-layout ' + (mode === 'compare' ? 'compare-mode' : '')}>
        <aside className="sidebar">
          <div className="side-heading"><span className="eyebrow">{t.navTitle}</span><h1>{t.headline}</h1><p>{t.subhead}</p></div>
          <nav className="mode-tabs" aria-label={t.navTitle}>
            {[
              ['explore',t.explore,'⌖'],['learn',t.learn,'✧'],['compare',t.compare,'◫'],['quiz',t.quiz,'？'],
            ].map(([id,label,icon]) => <button key={id} className={mode === id ? 'active' : ''} onClick={() => selectMode(id)}><span className="nav-symbol">{icon}</span>{label}</button>)}
          </nav>

          {mode === 'explore' && <>
            <div className="planet-list-block">
              <div className="section-caption">{t.planets}<span>09</span></div>
              <div className="planet-list">
                <button className={'planet-row ' + (selectedId === 'sun' ? 'selected' : '')} onClick={() => focus('sun')}>
                  <span className="planet-swatch swatch-sun"><i/></span><span className="planet-row-name">{t.sun}</span><span className="planet-index">☼</span>
                </button>
                {celestialBodies.map((body,index) => <button key={body.id} className={'planet-row ' + (selectedId === body.id ? 'selected' : '')} onClick={() => focus(body.id)}>
                  <span className={'planet-swatch swatch-' + body.id}><i/></span><span className="planet-row-name">{nameOf(body.id)}</span>
                  {body.id === 'earth' && <span className="home-tag">{t.home}</span>}<span className="planet-index">{String(index + 1).padStart(2,'0')}</span>
                </button>)}
              </div>
              <div className="dwarf-explore-heading">{t.dwarfExploreTitle}</div>
              <div className="planet-list dwarf-explore-list" role="group" aria-label={t.dwarfPlanetsHeading}>
                {dwarfPlanets.map(body => <button key={body.id} className={'planet-row ' + (selectedId === body.id ? 'selected' : '')} onClick={() => focus(body.id)}>
                  <span className="planet-swatch dwarf-swatch" style={{'--dwarf-color':body.color}}><i/></span><span className="planet-row-name">{nameOf(body.id)}</span><span className="planet-kind-tag">{body.diameterKm.toLocaleString(locale === 'fr' ? 'fr-FR' : 'fr-FR')} km</span>
                </button>)}
              </div>
            </div>
            <div className="side-actions">
              <button className="secondary-action" onClick={overview}><span>◎</span>{t.overview}<b>↗</b></button>
              <button className="secondary-action wow-action" onClick={() => focus('saturn')}><span>⌁</span>{t.wow}<b>→</b></button>
            </div>
          </>}

          {mode === 'learn' && <div className="lesson-list-block">
            <div className="section-caption">{t.guide}<span>05</span></div><p className="side-intro">{t.learnIntro}</p>
            <div className="learning-path"><strong>{t.learningPathTitle}</strong><small>{t.learningPathCaption}</small><div className="learning-path-track"><span className="learning-path-step">{t.learningEarth}</span><span className="learning-path-step">{t.learningSolar}</span><span className="learning-path-step">{t.learningGalaxy}</span><span className="learning-path-step">{t.learningUniverse}</span></div></div>
            <section className="moon-worlds" aria-labelledby="moon-worlds-title">
              <div className="moon-worlds-heading"><span>◔</span><div><h2 id="moon-worlds-title">{t.moonWorldsTitle}</h2><p>{t.moonWorldsIntro}</p></div></div>
              <div className="moon-parent-tabs" role="group" aria-label={t.moonWorldsTitle}>
                {['jupiter','uranus','neptune'].map((id,index) => <button key={id} className={moonParentId === id ? 'active' : ''} aria-pressed={moonParentId === id} onClick={() => { setMoonParentId(id); setSelectedMoonId(majorMoons.find(moon => moon.planet === id).id); }}>{t[['moonParentJupiter','moonParentUranus','moonParentNeptune'][index]]}</button>)}
              </div>
              <div className="moon-size-list" role="group" aria-label={t.moonScaleLabel}>
                {visibleMoons.map(moon => <button key={moon.id} className={'moon-size-choice ' + (selectedMoonId === moon.id ? 'active' : '')} aria-pressed={selectedMoonId === moon.id} onClick={() => setSelectedMoonId(moon.id)}>
                  <span className="moon-size-orb" style={{'--moon-ratio':moon.diameterKm / 5268, '--moon-color':moon.color}} aria-hidden="true"/><strong>{moon.name[locale]}</strong><small>{moon.diameterKm.toLocaleString('fr-FR')} km</small>
                </button>)}
              </div>
              <article className="moon-world-detail" aria-live="polite">
                <span className="moon-preview-orb" style={{'--moon-ratio':selectedMoon.diameterKm / 5268, '--moon-color':selectedMoon.color}} aria-hidden="true"/>
                <div><span className="eyebrow">{t.moonPreviewLabel}</span><h3>{selectedMoon.name[locale]} · {selectedMoon.diameterKm.toLocaleString('fr-FR')} km</h3><small className="moon-water-status">{selectedMoon.status[locale]}</small><p><strong>{t.moonWaterLabel}:</strong> {selectedMoon.water[locale]}</p></div>
              </article>
              <div className="moon-world-sources"><a href="https://ssd.jpl.nasa.gov/sats/phys_par/sep.html" target="_blank" rel="noreferrer">{t.moonSources}</a><a href="https://science.nasa.gov/photojournal/major-moons-of-uranus/" target="_blank" rel="noreferrer">{locale === 'fr' ? 'Modèles des lunes d’Uranus ↗' : 'Modèl lalin Iranis yo ↗'}</a><a href="https://science.nasa.gov/resource/ocean-worlds-triton/" target="_blank" rel="noreferrer">Triton · NASA ↗</a></div>
            </section>
            <section className="guided-mission" aria-label={t.journeyTitle}>
              <div className="guided-mission-kicker"><span>✦</span>{t.journeyTitle}</div>
              {journeyStep < 0 ? <><p>{t.journeyIntro}</p><button className="guided-primary" onClick={startJourney}>{t.journeyStart} <b>→</b></button></> : <>
                <div className="guided-progress-label"><span>{t.journeyStep} {journeyStep + 1} {t.journeyOf} {guidedJourney.length}</span><span>{Math.round((journeyStep + 1) / guidedJourney.length * 100)}%</span></div>
                <div className="guided-progress" role="progressbar" aria-valuemin="0" aria-valuemax={guidedJourney.length} aria-valuenow={journeyStep + 1}><i style={{width:`${(journeyStep + 1) / guidedJourney.length * 100}%`}}/></div>
                <h2>{t[guidedJourney[journeyStep].title]}</h2><p>{t[guidedJourney[journeyStep].body]}</p>
                {journeyStep === guidedJourney.length - 1 && <div className="guided-scale-facts"><span>{t.journeyEarthValue}</span><span>{t.journeyJupiterValue}</span><span>{t.journeySunValue}</span></div>}
                <div className="guided-actions"><button className="guided-reset" onClick={restartJourney}>{t.journeyRestart}</button><button className="guided-primary" onClick={advanceJourney}>{journeyStep === guidedJourney.length - 1 ? t.journeyCheck : t.journeyNext} <b>→</b></button></div>
              </>}
            </section>
            <section className="moon-model" aria-labelledby="moon-model-title">
              <div className="moon-model-heading"><span>☾</span><div><h2 id="moon-model-title">{t.moonModelTitle}</h2><p>{t.moonModelIntro}</p></div></div>
              <svg className="moon-model-diagram" viewBox="0 0 356 204" role="img" aria-label={`${t.moonSunLabel}, ${t.moonEarthLabel}, ${t.moonMoonLabel}: ${t.moonPhaseNames[moonPhaseIndex]}`}>
                <defs><radialGradient id="moonModelSun"><stop stopColor="#fff3bd"/><stop offset=".7" stopColor="#ffc34b"/><stop offset="1" stopColor="#ef812f"/></radialGradient><radialGradient id="moonModelEarth"><stop stopColor="#64bce9"/><stop offset=".75" stopColor="#2874bd"/><stop offset="1" stopColor="#152a57"/></radialGradient><marker id="moonModelArrow" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><path d="M0 0 7 3.5 0 7z" fill="#f1c66b"/></marker></defs>
                <path d="M66 102H132" stroke="#f1c66b" strokeOpacity=".65" strokeDasharray="4 5" markerEnd="url(#moonModelArrow)"/><text x="98" y="91" textAnchor="middle">{t.moonSunLabel}</text>
                <circle cx="178" cy="102" r="66" fill="none" stroke="#8292b7" strokeOpacity=".38" strokeDasharray="3 5"/>
                <circle cx="178" cy="102" r="21" fill="url(#moonModelEarth)" stroke="#9edaff" strokeOpacity=".6"/><path d="M163 101q7-13 16-7t16 1M164 108q10-5 15 3t14-1" fill="none" stroke="#75d6aa" strokeOpacity=".65" strokeWidth="3"/>
                <circle cx={moonPosition.x} cy={moonPosition.y} r="8" fill="#d9d6cb" stroke="#fff4d2" strokeWidth="1.5"/><circle cx={moonPosition.x-2} cy={moonPosition.y-2} r="2" fill="#a5a295" opacity=".6"/><circle cx={moonPosition.x+3} cy={moonPosition.y+2} r="1.5" fill="#99968d" opacity=".55"/>
                <circle cx="35" cy="102" r="23" fill="url(#moonModelSun)"/><text x="35" y="139" textAnchor="middle">{t.sun}</text><text x="178" y="143" textAnchor="middle">{t.moonEarthLabel}</text><text x={moonPosition.x} y={moonPosition.y+20} textAnchor="middle">{t.moonMoonLabel}</text>
              </svg>
              <div className="moon-phase-result"><span className="moon-phase-glyph" aria-hidden="true">{['🌑','🌒','🌓','🌔','🌕','🌖','🌗','🌘'][moonPhaseIndex]}</span><div><strong>{t.moonPhaseNames[moonPhaseIndex]}</strong><small>{t.moonIllumination} · {moonIlluminationPercent}%</small></div></div>
              <label className="moon-phase-control" htmlFor="moon-phase-slider"><span>{t.moonPhaseLabel}</span><output htmlFor="moon-phase-slider">{moonAngle}°</output><input id="moon-phase-slider" type="range" min="0" max="359" step="1" value={moonAngle} onChange={event => setMoonAngle(Number(event.target.value))} aria-valuetext={`${t.moonPhaseNames[moonPhaseIndex]}, ${moonIlluminationPercent}%`}/></label>
              <p className="moon-model-fact">{t.moonOrbitFact}</p><p className="moon-eclipse-note">{t.moonEclipseNote}</p><small className="moon-model-scale-note">{t.moonScaleNote}</small>
            </section>
            <details className="small-worlds">
              <summary><span className="small-worlds-mark">✧</span><span><strong>{t.smallWorldsTitle}</strong><small>{t.smallWorldsIntro}</small></span><b>⌄</b></summary>
              <div className="small-worlds-content">
                <div className="small-worlds-section-title"><strong>{t.dwarfPlanetsHeading}</strong><span>{t.dwarfPlanetsStatus}</span></div>
                <p className="small-worlds-definition">{t.dwarfPlanetsDefinition}</p>
                <div className="dwarf-planet-picker" role="group" aria-label={t.dwarfPlanetsHeading}>
                  {dwarfPlanets.map(body => <button key={body.id} className={dwarfPlanetId === body.id ? 'active' : ''} aria-pressed={dwarfPlanetId === body.id} onClick={() => { setDwarfPlanetId(body.id); focus(body.id); }}><i style={{'--dwarf-color':body.color}}/>{body.name[locale]}</button>)}
                </div>
                <article className="dwarf-planet-fact"><span className="dwarf-planet-orb" style={{'--dwarf-color':selectedDwarfPlanet.color}}/><div><strong>{selectedDwarfPlanet.name[locale]} · {selectedDwarfPlanet.diameterKm.toLocaleString('fr-FR')} km</strong><p>{selectedDwarfPlanet.fact[locale]}</p></div></article>
                <small className="dwarf-candidate-note">{t.moreCandidates}</small>
                <div className="small-worlds-section-title small-body-heading"><strong>{t.smallBodyHeading}</strong></div>
                <div className="small-body-cards"><article><span>◌</span><div><strong>{t.asteroidsLabel}</strong><p>{t.asteroidsFact}</p></div></article><article><span>☄</span><div><strong>{t.cometsLabel}</strong><p>{t.cometsFact}</p></div></article><article><span>✦</span><div><strong>{t.meteorChainLabel}</strong><p>{t.meteorChainFact}</p></div></article></div>
                <div className="small-worlds-sources"><a href="https://science.nasa.gov/dwarf-planets/" target="_blank" rel="noreferrer">NASA · {t.dwarfPlanetsHeading} ↗</a><a href="https://spaceplace.nasa.gov/asteroid-or-meteor/en/" target="_blank" rel="noreferrer">NASA Space Place · {t.smallBodyHeading} ↗</a></div>
              </div>
            </details>
            {lessons.map(item => <button key={item.id} className={'lesson-card ' + (lessonId === item.id ? 'active' : '')} onClick={() => setLessonId(item.id)}>
              <span className="lesson-symbol">{item.symbol}</span><span><strong>{t[item.title]}</strong><small>{t[item.subtitle]}</small></span><i>↗</i>
            </button>)}
            {lesson && <div className="lesson-explanation"><span className="eyebrow">{t.learnTitle}</span><p>{t[lesson.body]}</p><button onClick={() => { setLessonId(null); setIsPaused(false); }}>{t.stopLesson}</button></div>}
            <section className="star-types" aria-labelledby="star-types-title">
              <div className="star-types-heading"><span>✦</span><div><h2 id="star-types-title">{t.starTypesTitle}</h2><p>{t.starTypesIntro}</p></div></div>
              <div className="star-type-picker" role="group" aria-label={t.starTypesTitle}>
                {starTypes.map(star => <button key={star.id} className={'star-type-choice ' + (starTypeId === star.id ? 'active' : '')} aria-pressed={starTypeId === star.id} onClick={() => setStarTypeId(star.id)}>
                  <img src={star.image} className={star.imageClass || ''} alt="" loading="lazy"/><span>{t[star.name]}</span>
                </button>)}
              </div>
              {starTypes.filter(star => star.id === starTypeId).map(star => <article className="star-type-detail" key={star.id} aria-live="polite">
                <div className="star-type-art"><img src={star.image} className={star.imageClass || ''} alt="" loading="lazy"/><span>{star.real ? t.starPhoto : t.starConcept}</span></div>
                <div><h3>{t[star.name]}</h3><p>{t[star.fact]}</p></div>
              </article>)}
            </section>
          </div>}

          {mode === 'compare' && <div className="compare-panel">
            <div className="section-caption">{t.scale}<span>09</span></div><h2>{t.compareHeading}</h2><p>{t.scaleNote}</p>
            <div className="compare-world-selects">
              <label className="select-label">{t.firstWorld}<select value={compareId} onChange={event => { const nextId=event.target.value; setCompareId(nextId); if(nextId===compareReferenceId) setCompareReferenceId(compareId); }}>
                {comparisonWorlds.map(body => <option key={body.id} value={body.id}>{body.name[locale]}</option>)}
              </select></label>
              <label className="select-label">{t.secondWorld}<select value={compareReferenceId} onChange={event => { const nextId=event.target.value; setCompareReferenceId(nextId); if(nextId===compareId) setCompareId(compareReferenceId); }}>
                {comparisonWorlds.map(body => <option key={body.id} value={body.id}>{body.name[locale]}</option>)}
              </select></label>
            </div>
            <div className="size-comparison">
              <div className="size-planet"><span className={'compare-orb compare-orb-' + compare.id} style={{'--compare-color':compare.color,'--compare-diameter':`${Math.max(1.5,compare.earthDiameters*comparisonScale)}px`}} role="img" aria-label={`${compare.name[locale]} · ${compare.diameterKm.toLocaleString(locale === 'fr' ? 'fr-FR' : 'en-US')} km`}/><strong>{compare.name[locale]}</strong><small>{compare.diameterKm.toLocaleString(locale === 'fr' ? 'fr-FR' : 'en-US')} km</small></div>
              <div className="size-divider"><span>VS</span><small>{diameterRatio.toLocaleString(locale === 'fr' ? 'fr-FR' : 'en-US',{maximumFractionDigits:1})}×</small></div>
              <div className="size-planet"><span className={'compare-orb compare-orb-' + compareReference.id} style={{'--compare-color':compareReference.color,'--compare-diameter':`${Math.max(1.5,compareReference.earthDiameters*comparisonScale)}px`}} role="img" aria-label={`${compareReference.name[locale]} · ${compareReference.diameterKm.toLocaleString(locale === 'fr' ? 'fr-FR' : 'en-US')} km`}/><strong>{compareReference.name[locale]}</strong><small>{compareReference.diameterKm.toLocaleString(locale === 'fr' ? 'fr-FR' : 'en-US')} km</small></div>
            </div>
            <p className="comparison-scale-label">{t.diameterVisual}<span>{nameOf(largerWorld.id)} / {nameOf(smallerWorld.id)} · {diameterRatio.toLocaleString(locale === 'fr' ? 'fr-FR' : 'en-US',{maximumFractionDigits:1})}×</span></p>
            <div className="compare-metrics">
              <div><span>{t.diameterCompare}</span><strong>{compare.diameterKm.toLocaleString(locale === 'fr' ? 'fr-FR' : 'en-US')} km <i>·</i> {compareReference.diameterKm.toLocaleString(locale === 'fr' ? 'fr-FR' : 'en-US')} km</strong></div>
              <div><span>{t.distanceCompare}</span><strong>{compare.distanceAu} UA <i>·</i> {compareReference.distanceAu} UA</strong></div>
              <div><span>{t.massCompare}</span><strong>{compare.massEarth.toLocaleString(locale === 'fr' ? 'fr-FR' : 'en-US')}× <i>·</i> {compareReference.massEarth.toLocaleString(locale === 'fr' ? 'fr-FR' : 'en-US')}×</strong></div>
              <div><span>{t.gravityCompare}</span><strong>{compare.gravityEarth}× <i>·</i> {compareReference.gravityEarth}×</strong></div>
              <div><span>{t.dayCompare}</span><strong>{compare.day[locale]} <i>·</i> {compareReference.day[locale]}</strong></div>
              <div><span>{t.yearCompare}</span><strong>{compare.year[locale]} <i>·</i> {compareReference.year[locale]}</strong></div>
              <div><span>{t.temperatureCompare}</span><strong>{compare.temperature[locale]} <i>·</i> {compareReference.temperature[locale]}</strong></div>
            </div>
            <button className="outline-button" onClick={() => { const worldToExplore = compare.id === 'sun' ? compareReference.id : compare.id; selectMode('explore'); focus(worldToExplore); }}>{t.explore} {compare.id === 'sun' ? compareReference.name[locale] : compare.name[locale]} <b>→</b></button>
          </div>}

          {mode === 'quiz' && <div className="quiz-panel">
            {quizIndex >= quizzes.length ? <><span className="quiz-finish">✦</span><h2>{t.quizDone}</h2><button className="outline-button" onClick={() => { setQuizIndex(0); setQuizAnswer(null); }}>{t.restartQuiz}</button></> : <>
              <span className="quiz-kicker">{t.question} {quizIndex + 1} / {quizzes.length}</span><h2>{t[quiz.key]}</h2>
              <div className="quiz-options">{quiz.options.map(id => {
                const answered = quizAnswer !== null;
                const right = id === quiz.correct;
                const chosenWrong = id === quizAnswer && !right;
                return <button key={id} disabled={answered} className={'quiz-option ' + (answered && right ? 'correct ' : '') + (chosenWrong ? 'wrong' : '')} onClick={() => chooseAnswer(id)}>
                  {planetById[id] ? <span className={'planet-swatch swatch-' + id}><i/></span> : <span className="quiz-symbol">{id === 'star' ? '✦' : id === 'tilt' ? '∠' : '↻'}</span>}{localizeQuizName(id)}{answered && right && <b>✓</b>}{chosenWrong && <b>×</b>}
                </button>;
              })}</div>
              {quizAnswer && <div className={'quiz-feedback ' + (quizAnswer === quiz.correct ? 'good' : '')}><strong>{quizAnswer === quiz.correct ? t.correct : t.incorrect}</strong><p>{t[quiz.explanation] || planetById[quiz.correct]?.fact[locale]}</p><button onClick={nextQuestion}>{quizIndex + 1 === quizzes.length ? t.quizDone : t.continueQuiz} →</button></div>}
            </>}
          </div>}
          <div className="sidebar-footnote"><span>i</span><p>{t.scaleNote}</p></div>
        </aside>

        <section className={'stage-column ' + (mode === 'explore' && (selected || selectedId === 'sun') && !detailsCollapsed ? 'has-planet-detail' : '')} aria-label={t.explore}>
          <div className="scene-topline"><span><i className="live-indicator"/>{selected ? nameOf(selected.id).toUpperCase() : selectedId === 'sun' ? t.sun.toUpperCase() : t.overview.toUpperCase()}{(selected || selectedId === 'sun') && <button className="planet-info-bubble" aria-expanded={!detailsCollapsed} aria-label={detailsCollapsed ? t.showDetails : t.hideDetails} onClick={() => setDetailsCollapsed(value => !value)}>{t.info}</button>}</span>
            <div className="scene-toggles">
              <button className={'label-toggle ' + (followPlanet ? 'on' : '')} aria-pressed={followPlanet} onClick={() => setFollowPlanet(value => !value)}><i/><span>{followPlanet ? t.followOn : t.followOff}</span></button>
              <button className={'label-toggle ' + (showLabels ? 'on' : '')} aria-pressed={showLabels} onClick={() => setShowLabels(value => !value)}><i/><span>{t.labels}</span></button>
            </div>
          </div>
          <Suspense fallback={<div className="scene-loading"><span>✦</span><strong>Préparation de la scène 3D…</strong></div>}>
            <SolarScene selectedId={selectedId} onSelect={id => { setSelectedId(id); setDetailsCollapsed(false); setFocusRequest(value => value + 1); setLessonId(null); }} timeScale={timeScale} isPaused={isPaused || earthGlobeOpen} focusRequest={focusRequest} viewId={viewId} viewRequest={viewRequest} showLabels={showLabels} followPlanet={followPlanet} locale={locale}/>
          </Suspense>
          <div className="camera-view-picker" role="group" aria-label={t.cameraViews}>
            <button className="camera-next-button" aria-label={t.nextView} title={t.nextView} onClick={cycleView}><i>◉</i><span>{t[({orbit:'viewOrbit',top:'viewTop',side:'viewSide',close:'viewClose',wide:'viewWide'})[viewId]]}</span><b>↻</b></button>
          </div>
          <div className="scene-instructions"><span>◉ {t.drag}</span><i/><span>⌕ {t.zoom}</span><i/><span>{t.gestureTwo}</span></div>
          <div className="scene-bottom">
            <div className="time-controls"><button className={'pause-button ' + (isPaused ? 'paused' : '')} aria-label={isPaused ? 'Lecture' : 'Pause'} onClick={() => setIsPaused(value => !value)}>{isPaused ? '▶' : 'Ⅱ'}</button>
              <div className="time-control-copy"><strong>{t.time}</strong><small>{isPaused ? t.timeLabel : timeScale + '× · ' + t.timeNote}</small></div>
              <div className="speed-buttons">{[1,10,100].map(speed => <button key={speed} className={timeScale === speed ? 'active' : ''} onClick={() => { setTimeScale(speed); setIsPaused(false); }}>{speed}×</button>)}</div>
            </div>
            <button className="overview-button" onClick={overview}><span>◎</span>{t.overview}</button>
          </div>
          <div className="scale-legend"><span/> {t.scaleNote}</div>

          {mode === 'explore' && selected && <article className={'planet-detail ' + (detailsCollapsed ? 'collapsed' : '')}>
            <button className="detail-close" aria-label={t.close} onClick={overview}>×</button>
            <button className="detail-collapse" aria-expanded={!detailsCollapsed} aria-label={detailsCollapsed ? t.showDetails : t.hideDetails} title={detailsCollapsed ? t.showDetails : t.hideDetails} onClick={() => setDetailsCollapsed(value => !value)}>{detailsCollapsed ? t.info : '⌄'}</button>
            <div className="detail-heading"><span className={'detail-planet planet-' + selected.id}/><div><span className="eyebrow">{selected.type[locale].toUpperCase()}</span><h2>{nameOf(selected.id)}</h2></div></div>
            {!detailsCollapsed && <>
            <div className="detail-orbit">{selected.distanceKm.toLocaleString('fr-FR')} {t.milKm}<span>·</span>{selected.distanceAu.toLocaleString('fr-FR',{maximumFractionDigits:3})} {t.au}</div>
            <div className="metrics-grid">
              <Metric label={t.diameter} value={selected.diameterKm.toLocaleString('fr-FR')} unit="km"/>
              {selected.day && <Metric label={t.day} value={selected.day[locale]}/>}<Metric label={t.year} value={selected.year?.[locale] || `${selected.orbitYears} ${locale === 'fr' ? 'ans terrestres' : 'ane sou Latè'}`}/>
              {selected.temperature && <Metric label={t.temperature} value={selected.temperature[locale]}/>}
            </div>
            <div className="detail-fact"><span>✦</span><p>{selected.fact[locale]}</p></div>
            {selected.id === 'earth' && <button className="earth-globe-open-button" onClick={() => setEarthGlobeOpen(true)}><span aria-hidden="true">◎</span><span><strong>{t.openGlobe}</strong><small>{t.openGlobeSub}</small></span><b>↗</b></button>}
            {spaceArchive[selected.id] && <button className="archive-open-button" onClick={() => { setArchiveImageIndex(0); setArchiveOpen(true); }}><span>▧</span><span><strong>{t.realImages}</strong><small>{t.realImagesSub}</small></span><b>↗</b></button>}
            {!dwarfPlanetById[selected.id] && <div className="detail-footer"><span><small>{t.moons}</small><strong>{moonCount(selected)}</strong>{selected.moonsChanging && <small>{t.moonsAsOf}</small>}</span><button onClick={() => { setMode('compare'); setCompareId(selected.id === 'earth' ? 'jupiter' : selected.id); setCompareReferenceId('earth'); }}>{t.compareEarth} <b>→</b></button></div>}
            </>}
          </article>}
          {mode === 'explore' && selectedId === 'sun' && <article className={'planet-detail sun-detail ' + (detailsCollapsed ? 'collapsed' : '')}><button className="detail-close" onClick={overview}>×</button><button className="detail-collapse" aria-expanded={!detailsCollapsed} aria-label={detailsCollapsed ? t.showDetails : t.hideDetails} title={detailsCollapsed ? t.showDetails : t.hideDetails} onClick={() => setDetailsCollapsed(value => !value)}>{detailsCollapsed ? t.info : '⌄'}</button><div className="detail-heading"><span className="detail-planet planet-sun">☼</span><div><span className="eyebrow">{locale === 'fr' ? 'ÉTOILE' : 'ZETWAL'}</span><h2>{t.sun}</h2></div></div>{!detailsCollapsed && <><div className="detail-fact"><span>✦</span><p>{locale === 'fr' ? 'Le Soleil rassemble plus de 99 % de la masse du système solaire et fournit l’énergie qui éclaire les planètes.' : 'Solèy la gen plis pase 99% mas sistèm solè a epi li bay planèt yo limyè.'}</p></div><button className="archive-open-button" onClick={() => { setArchiveImageIndex(0); setArchiveOpen(true); }}><span>▧</span><span><strong>{t.realImages}</strong><small>{t.realImagesSub}</small></span><b>↗</b></button></>}</article>}
          {!selected && !selectedId && !lesson && mode === 'explore' && <div className="welcome-chip"><span>✧</span><div><strong>{t.selection}</strong><small>{t.selectionHint}</small></div><button onClick={() => focus('earth')}>→</button></div>}
          {lesson && <div className="lesson-live-chip"><span>✦</span><div><strong>{t[lesson.title]}</strong><small>{t[lesson.body]}</small></div><button onClick={() => { setLessonId(null); setIsPaused(false); }}>×</button></div>}
        </section>
      </main>

      {intro && <div className="intro-screen" role="dialog" aria-label={t.intro}>
        <div className="intro-orbit intro-orbit-one"/><div className="intro-orbit intro-orbit-two"/>
        <span className="intro-sun">✦</span><span className="intro-dot intro-dot-one"/><span className="intro-dot intro-dot-two"/>
        <div className="intro-copy"><span className="eyebrow">FUTUR HAITI · SCIENCES</span><h2>{t.intro}</h2><p>{t.introBy}</p><button onClick={() => setIntro(false)}>{t.enter} <b>→</b></button></div>
        <button className="skip-intro" onClick={() => setIntro(false)}>{t.skip}</button>
      </div>}
      {aboutOpen && <div className="modal-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) setAboutOpen(false); }}><section className="about-modal" role="dialog" aria-modal="true" aria-labelledby="about-title">
        <button className="detail-close" onClick={() => setAboutOpen(false)}>×</button><span className="about-star">✦</span><span className="eyebrow">FUTUR HAITI</span><h2 id="about-title">{t.aboutTitle}</h2><p>{t.aboutText}</p><small>{t.aboutFact}</small><button className="modal-close-button" onClick={() => setAboutOpen(false)}>{t.close}</button>
      </section></div>}
      {archiveOpen && archive && <div className="modal-backdrop archive-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) setArchiveOpen(false); }}><section className="archive-modal" role="dialog" aria-modal="true" aria-labelledby="archive-title">
        <button className="detail-close" aria-label={t.close} onClick={() => setArchiveOpen(false)}>×</button>
        <div className="archive-modal-heading"><span className="eyebrow">NASA · {archive.mission}</span><h2 id="archive-title">{nameOf(selectedId || 'earth')} <span>— {t.realImages}</span></h2></div>
        {archiveImages.length > 1 && <div className="archive-image-tabs" role="tablist" aria-label={t.realImages}>{archiveImages.map((item,index)=><button key={item.image} role="tab" aria-selected={archiveImageIndex===index} className={archiveImageIndex===index?'active':''} onClick={()=>setArchiveImageIndex(index)}>{index===0?t.globalView:t.detailView}</button>)}</div>}
        <figure className="archive-image"><img src={archiveImage.image} alt={archiveImage.title[locale]} /><figcaption><strong>{archiveImage.title[locale]}</strong><span>{archiveImage.date} · {archiveImage.credit}</span></figcaption></figure>
        <p className="archive-context">{t.imageContext}</p>
        <div className="archive-missions"><div className="archive-section-heading"><h3>{t.missionsTitle}</h3><span>{String(archive.missions.length).padStart(2,'0')}</span></div>
          {archive.missions.map(item => <article className="archive-mission" key={item.name}><span className="mission-mark">✦</span><div><strong>{item.name}</strong><small>{item.when} · {item.note[locale]}</small></div><a href={item.url} target="_blank" rel="noreferrer" aria-label={t.sourceLink}>↗</a></article>)}
        </div>
        <a className="archive-source-link" href={archiveImage.source} target="_blank" rel="noreferrer">{t.sourceLink}</a>
      </section></div>}
      {earthGlobeOpen && <Suspense fallback={<div className="earth-globe-backdrop"><div className="scene-loading"><span>✦</span><strong>{t.globeTitle}</strong></div></div>}><EarthGlobe copy={t} onClose={() => setEarthGlobeOpen(false)}/></Suspense>}
      {notice && <div className="notice-toast">✦ {notice}</div>}
    </div>
  );
}

export default App;
