let modInfo = {
	name: "The Anything Tree",
	author: "Sasha683387",
	pointsName: "points",
	modFiles: ["layers.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (10), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
	// ДОБАВЬТЕ ИЛИ ПРОГЕРИРУЙТЕ СЛЕДУЮЩУЮ СТРОКУ:
    hasTickers: true, // Включает верхнюю бегущую строку новостей
}

// Set your version in num and name
let VERSION = {
	num: "1.0",
	name: "Release!",
}


let changelog = `<h1>Changelog:</h1><br>
	<h3>v1.0 - Release!</h3><br>
        - Endgame: Challenge Zero Efficiency completed.<br>
        - Added 16 news ticker messages<br>
        - Added 16 upgrades and 1 challenge!<br>
		- Added first 3 layers.<br>
		- Added news ticker.`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if (!canGenPoints()) return new Decimal(0)

	let gain = new Decimal(1) // Базовый доход

	// 1. БУСТЫ ОТ СЛОЯ PRESTIGE (В обычном режиме работает вся сетка 11-23)
	if (!inChallenge('nb', 11)) {
		if (hasUpgrade('p', 11)) gain = gain.times(2)
		if (hasUpgrade('p', 21)) gain = gain.times(upgradeEffect('p', 21))
		if (hasUpgrade('p', 23)) gain = gain.times(upgradeEffect('p', 23))
	}

	// 🔥 ВНУТРИ ЧЕЛЛЕНДЖА работают ВСЕ 7 хардкорных престиж-апгрейдов (101-107)
	if (inChallenge('nb', 11)) {
		if (hasUpgrade('p', 101)) gain = gain.times(5)
		if (hasUpgrade('p', 103)) gain = gain.times(upgradeEffect('p', 103))
		if (hasUpgrade('p', 104)) gain = gain.times(upgradeEffect('p', 104)) // Буст от Not Boosters
		if (hasUpgrade('p', 106)) gain = gain.times(upgradeEffect('p', 106)) // Кубический буст от количества кнопок
		if (hasUpgrade('p', 107)) gain = gain.times(150) // Финальный прорыв 150х!
	}

	// 2. Формула Бустеров (X^2 или X^1)
	let boosters = player.b.points
	if (boosters.gt(0)) {
		if (inChallenge('nb', 11)) {
			gain = gain.times(boosters) // Дебафф челленджа
		} else {
			gain = gain.times(boosters.pow(2)) // Стандартный режим
		}
	}

	// 3. Бусты от слоя Not Boosters (работают только вне челленджа)
	if (hasUpgrade('nb', 12) && !inChallenge('nb', 11)) {
		gain = gain.times(upgradeEffect('nb', 12))
	}

	return gain
}



// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new Decimal("1e24"))
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}

// Your exact custom news ticker sentences
function getNewsTicker() {
    let news = [
		"Why Oleg is angry",
		"Thismessageislong!",
		"Why flame is called FlamemasterNXF",
		"why t h  i   s       m           e            s                 s                    a                      g                             e                           is									s					o						f						t					c					a				p					p					e				d							",
		"Next update in -2 hours",
		"Tis massege is nat wrytn b nob!111!!",
		"Hi! This is News Ticker! You cant disable it off!",
        "Welcome to The Anything Tree!",
        "Rumors say that clicking faster doesn't actually help... or does it?",
        "Scientists are shocked by the exponential growth of your points.",
        "Why are you at row -1?",
        "GO PLAY PRESTIGE TREE!",
        "News: Player disabled news ticker",
        "This message is this message is this message is this message is this message is wasting your time.",
        "This message is not (HARDCAPPE",
        "Why are you playing this game"
    ];
    return news[Math.floor(Math.random() * news.length)];
}

// Внедряем тикер в DOM браузера, как только документ полностью загрузится
window.addEventListener('DOMContentLoaded', () => {
    // Создаем контейнер строки
    let tickerContainer = document.createElement("div");
    tickerContainer.id = "custom-news-ticker";
    tickerContainer.style = "position:fixed; top:0; left:0; width:100%; background:#191b26; color:#ffdf00; font-family:Arial,sans-serif; font-size:16px; font-weight:bold; padding:8px 0; z-index:999999; border-bottom:2px solid #2d3042; overflow:hidden; white-space:nowrap;";

    // Создаем текст
    let tickerText = document.createElement("div");
    tickerText.id = "ticker-text";
    tickerText.style = "display:inline-block; padding-left:100%;";
    tickerText.innerText = getNewsTicker();

    // Добавляем анимацию движения
    let style = document.createElement("style");
    style.innerHTML = `
        @keyframes scroll-ticker {
            0% { transform: translate3d(0, 0, 0); }
            100% { transform: translate3d(-100%, 0, 0); }
        }
        #ticker-text { animation: scroll-ticker 15s linear infinite; }
    `;

    document.body.appendChild(style);
    tickerContainer.appendChild(tickerText);
    document.body.appendChild(tickerContainer);

    // Сдвигаем основное Vue-приложение TMT чуть ниже
    let appElement = document.getElementById("app");
    if (appElement) appElement.style.marginTop = "45px";

    // Цикл обновления фраз каждые 15 секунд
    setInterval(() => {
        let textElement = document.getElementById("ticker-text");
        if (textElement) textElement.innerText = getNewsTicker();
    }, 15000);
});

// Системные заглушки движка TMT
function displayThingsByLayer() {}
function isEndgame() { return player.points.gte(new Decimal("e100")); }
var doNotCallTheseFunctionsEveryTick = [];


