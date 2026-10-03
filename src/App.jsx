import { Suspense, lazy, useEffect, useState } from 'react';
import { celestialBodies, planetById } from './data/planets.js';
import { spaceArchive } from './data/spaceArchive.js';

const SolarScene = lazy(() => import('./SolarScene.jsx'));

const copy = {
  fr: {
    explore:'Explorer', learn:'Apprendre', compare:'Comparer', quiz:'Mini quiz',
    headline:'Le système solaire, à portée de main.', subhead:'Touchez un monde pour vous en approcher.',
    navTitle:'ESPACE DE DÉCOUVERTE', planets:'SOLEIL + 8 PLANÈTES', guide:'GUIDE D’EXPLORATION',
    drag:'Glisser pour tourner', zoom:'Molette pour zoomer', gestureTwo:'2 doigts : tourner / zoomer', selection:'Faites un premier voyage',
    selectionHint:'Choisissez une planète sur la scène ou dans la liste.', overview:'Vue complète',
    labels:'Noms des planètes', time:'TEMPS PÉDAGOGIQUE', timeNote:'Mouvements accélérés pour les observer.',
    followOn:'Suivi auto · ON', followOff:'Suivi auto · OFF',
    cameraViews:'ANGLES DE VUE', viewOrbit:'Orbital', viewTop:'Dessus', viewSide:'Profil', viewClose:'Proche', viewWide:'Panorama',
    scaleNote:'Visualisation pédagogique : tailles, distances et vitesses sont adaptées. Les données affichées gardent leurs unités réelles.',
    modePed:'Vue pédagogique', about:'À propos', type:'PLANÈTE', diameter:'DIAMÈTRE', day:'UNE JOURNÉE',
    year:'UNE ANNÉE', temperature:'TEMPÉRATURE', moons:'LUNES CONNUES', more:'Le savais-tu ?',
    compareEarth:'Comparer à la Terre', wow:'Voyager vers Saturne', appTag:'EXPLORER · COMPRENDRE · APPRENDRE',
    learnTitle:'Voir pour comprendre', learnIntro:'Choisissez une petite expérience.',
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
    question:'QUESTION', questionOne:'Quelle planète est la plus grande ?',
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
    navTitle:'ESPAS DEKOUVÈT', planets:'SOLÈY + 8 PLANÈT YO', guide:'GID EKSPLORASYON',
    drag:'Trennen pou vire', zoom:'Wou sourit pou rale', gestureTwo:'2 dwèt: vire / rale', selection:'Fè premye vwayaj ou',
    selectionHint:'Chwazi yon planèt sou sèn nan oswa nan lis la.', overview:'Tout sistèm nan',
    labels:'Non planèt yo', time:'TAN POU APRANN', timeNote:'Mouvman yo akselere pou nou ka obsève yo.',
    followOn:'Swivi otomatik · AKTIF', followOff:'Swivi otomatik · KANPE',
    cameraViews:'ANG DE VI', viewOrbit:'Òbit', viewTop:'Anwo', viewSide:'Kòt', viewClose:'Pre', viewWide:'Lwen',
    scaleNote:'Vizyalizasyon pou aprann: gwosè, distans ak vitès adapte. Done yo kenbe vrè inite yo.',
    modePed:'Vizyalizasyon aprantisaj', about:'Konsènan', type:'KALITE PLANÈT', diameter:'DYAMÈT', day:'YON JOUNEN',
    year:'YON ANE', temperature:'TANPERATI', moons:'LALIN KI KONI', more:'Èske w te konnen?',
    compareEarth:'Konpare ak Latè', wow:'Vwayaje pou ale Satin', appTag:'EKSPLÒRE · KONPRANN · APRANN',
    learnTitle:'Gade pou w konprann', learnIntro:'Chwazi yon ti eksperyans.',
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
    question:'KESYON', questionOne:'Ki planèt ki pi gwo a?',
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
  { key:'questionOne', correct:'jupiter', options:['earth','jupiter','saturn'] },
  { key:'questionTwo', correct:'mercury', options:['mercury','venus','mars'] },
  { key:'questionThree', correct:'saturn', options:['jupiter','saturn','uranus'] },
];
const lessons = [
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
  const [intro, setIntro] = useState(true);
  const [lessonId, setLessonId] = useState(null);
  const [compareId, setCompareId] = useState('jupiter');
  const [compareReferenceId, setCompareReferenceId] = useState('earth');
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [archiveImageIndex, setArchiveImageIndex] = useState(0);
  const [notice, setNotice] = useState('');
  const t = copy[locale];
  const selected = selectedId && selectedId !== 'sun' ? planetById[selectedId] : null;
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

  useEffect(() => {
    const timer = window.setTimeout(() => setIntro(false), 4200);
    return () => window.clearTimeout(timer);
  }, []);
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

  const names = Object.fromEntries(celestialBodies.map(body => [body.id, body.name[locale]]));
  const nameOf = id => names[id] || t.sun;
  const focus = id => {
    setSelectedId(id);
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
  const selectMode = next => {
    setMode(next);
    setLessonId(null);
    if (next === 'quiz') {
      setQuizIndex(0);
      setQuizAnswer(null);
      setIsPaused(true);
    } else if (next !== 'learn') setIsPaused(false);
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
  const localizeQuizName = id => nameOf(id);

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

      <main className="explorer-layout">
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
            </div>
            <div className="side-actions">
              <button className="secondary-action" onClick={overview}><span>◎</span>{t.overview}<b>↗</b></button>
              <button className="secondary-action wow-action" onClick={() => focus('saturn')}><span>⌁</span>{t.wow}<b>→</b></button>
            </div>
          </>}

          {mode === 'learn' && <div className="lesson-list-block">
            <div className="section-caption">{t.guide}<span>04</span></div><p className="side-intro">{t.learnIntro}</p>
            {lessons.map(item => <button key={item.id} className={'lesson-card ' + (lessonId === item.id ? 'active' : '')} onClick={() => setLessonId(item.id)}>
              <span className="lesson-symbol">{item.symbol}</span><span><strong>{t[item.title]}</strong><small>{t[item.subtitle]}</small></span><i>↗</i>
            </button>)}
            {lesson && <div className="lesson-explanation"><span className="eyebrow">{t.learnTitle}</span><p>{t[lesson.body]}</p><button onClick={() => { setLessonId(null); setIsPaused(false); }}>{t.stopLesson}</button></div>}
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
            <button className="outline-button" onClick={() => focus(compare.id === 'sun' ? compareReference.id : compare.id)}>{t.explore} {compare.id === 'sun' ? compareReference.name[locale] : compare.name[locale]} <b>→</b></button>
          </div>}

          {mode === 'quiz' && <div className="quiz-panel">
            {quizIndex >= quizzes.length ? <><span className="quiz-finish">✦</span><h2>{t.quizDone}</h2><button className="outline-button" onClick={() => { setQuizIndex(0); setQuizAnswer(null); }}>{t.restartQuiz}</button></> : <>
              <span className="quiz-kicker">{t.question} {quizIndex + 1} / {quizzes.length}</span><h2>{t[quiz.key]}</h2>
              <div className="quiz-options">{quiz.options.map(id => {
                const answered = quizAnswer !== null;
                const right = id === quiz.correct;
                const chosenWrong = id === quizAnswer && !right;
                return <button key={id} disabled={answered} className={'quiz-option ' + (answered && right ? 'correct ' : '') + (chosenWrong ? 'wrong' : '')} onClick={() => chooseAnswer(id)}>
                  <span className={'planet-swatch swatch-' + id}><i/></span>{localizeQuizName(id)}{answered && right && <b>✓</b>}{chosenWrong && <b>×</b>}
                </button>;
              })}</div>
              {quizAnswer && <div className={'quiz-feedback ' + (quizAnswer === quiz.correct ? 'good' : '')}><strong>{quizAnswer === quiz.correct ? t.correct : t.incorrect}</strong><p>{planetById[quiz.correct].fact[locale]}</p><button onClick={nextQuestion}>{quizIndex + 1 === quizzes.length ? t.quizDone : t.continueQuiz} →</button></div>}
            </>}
          </div>}
          <div className="sidebar-footnote"><span>i</span><p>{t.scaleNote}</p></div>
        </aside>

        <section className={'stage-column ' + (mode === 'explore' && (selected || selectedId === 'sun') ? 'has-planet-detail' : '')} aria-label={t.explore}>
          <div className="scene-topline"><span><i className="live-indicator"/>{selected ? nameOf(selected.id).toUpperCase() : selectedId === 'sun' ? t.sun.toUpperCase() : t.overview.toUpperCase()}</span>
            <div className="scene-toggles">
              <button className={'label-toggle ' + (followPlanet ? 'on' : '')} aria-pressed={followPlanet} onClick={() => setFollowPlanet(value => !value)}><i/><span>{followPlanet ? t.followOn : t.followOff}</span></button>
              <button className={'label-toggle ' + (showLabels ? 'on' : '')} aria-pressed={showLabels} onClick={() => setShowLabels(value => !value)}><i/><span>{t.labels}</span></button>
            </div>
          </div>
          <Suspense fallback={<div className="scene-loading"><span>✦</span><strong>Préparation de la scène 3D…</strong></div>}>
            <SolarScene selectedId={selectedId} onSelect={id => { setSelectedId(id); setFocusRequest(value => value + 1); setLessonId(null); }} timeScale={timeScale} isPaused={isPaused} focusRequest={focusRequest} viewId={viewId} viewRequest={viewRequest} showLabels={showLabels} followPlanet={followPlanet} locale={locale}/>
          </Suspense>
          <div className="camera-view-picker" role="group" aria-label={t.cameraViews}>
            <span>{t.cameraViews}</span>
            {[['orbit','◉',t.viewOrbit],['top','↑',t.viewTop],['side','↔',t.viewSide],['close','⊕',t.viewClose],['wide','⤢',t.viewWide]].map(([id,icon,label]) =>
              <button key={id} className={viewId === id ? 'active' : ''} aria-pressed={viewId === id} onClick={() => chooseView(id)}><i>{icon}</i>{label}</button>
            )}
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

          {mode === 'explore' && selected && <article className="planet-detail">
            <button className="detail-close" aria-label={t.close} onClick={overview}>×</button>
            <div className="detail-heading"><span className={'detail-planet planet-' + selected.id}/><div><span className="eyebrow">{selected.type[locale].toUpperCase()}</span><h2>{nameOf(selected.id)}</h2></div></div>
            <div className="detail-orbit">{selected.distanceKm} {t.milKm}<span>·</span>{selected.distanceAu} {t.au}</div>
            <div className="metrics-grid">
              <Metric label={t.diameter} value={selected.diameterKm.toLocaleString('fr-FR')} unit="km"/>
              <Metric label={t.day} value={selected.day[locale]}/><Metric label={t.year} value={selected.year[locale]}/>
              <Metric label={t.temperature} value={selected.temperature[locale]}/>
            </div>
            <div className="detail-fact"><span>✦</span><p>{selected.fact[locale]}</p></div>
            <button className="archive-open-button" onClick={() => { setArchiveImageIndex(0); setArchiveOpen(true); }}><span>▧</span><span><strong>{t.realImages}</strong><small>{t.realImagesSub}</small></span><b>↗</b></button>
            <div className="detail-footer"><span><small>{t.moons}</small><strong>{moonCount(selected)}</strong>{selected.moonsChanging && <small>{t.moonsAsOf}</small>}</span><button onClick={() => { setMode('compare'); setCompareId(selected.id === 'earth' ? 'jupiter' : selected.id); setCompareReferenceId('earth'); }}>{t.compareEarth} <b>→</b></button></div>
          </article>}
          {mode === 'explore' && selectedId === 'sun' && <article className="planet-detail sun-detail"><button className="detail-close" onClick={overview}>×</button><div className="detail-heading"><span className="detail-planet planet-sun">☼</span><div><span className="eyebrow">{locale === 'fr' ? 'ÉTOILE' : 'ZETWAL'}</span><h2>{t.sun}</h2></div></div><div className="detail-fact"><span>✦</span><p>{locale === 'fr' ? 'Le Soleil rassemble plus de 99 % de la masse du système solaire et fournit l’énergie qui éclaire les planètes.' : 'Solèy la gen plis pase 99% mas sistèm solè a epi li bay planèt yo limyè ak enèji.'}</p></div><button className="archive-open-button" onClick={() => { setArchiveImageIndex(0); setArchiveOpen(true); }}><span>▧</span><span><strong>{t.realImages}</strong><small>{t.realImagesSub}</small></span><b>↗</b></button></article>}
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
      {notice && <div className="notice-toast">✦ {notice}</div>}
    </div>
  );
}

export default App;
