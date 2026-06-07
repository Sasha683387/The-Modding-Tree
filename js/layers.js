// ==========================================
// ROW 0: PRESTIGE LAYER (GREEN) - 7 CHALLENGE UPGRADES
// ==========================================
addLayer("p", {
    name: "Prestige",
    symbol: "P",
    position: 0,
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
    }},
    color: "#2ecc71", 
    requires: new Decimal(10), 
    resource: "prestige points",
    baseResource: "points",
    baseAmount() { return player.points },
    type: "normal",
    exponent: 0.5,
    row: 0,
    layerShown() { return true },

    passiveGeneration() {
        if (player.b.points.gte(1)) {
            let basePassive = new Decimal(0.25)
            if (hasChallenge('nb', 11)) basePassive = new Decimal(0.50)
            return basePassive.toNumber()
        }
        return 0
    },

    gainMult() {
        let mult = new Decimal(1)
        if (hasUpgrade('p', 12) && !inChallenge('nb', 11)) mult = mult.times(upgradeEffect('p', 12))
        if (hasUpgrade('p', 22) && !inChallenge('nb', 11)) mult = mult.times(upgradeEffect('p', 22))
        
        // ХАРДКОРНЫЕ МНОЖИТЕЛИ ПРЕСТИЖА (ВНУТРИ ЧЕЛЛЕНДЖА)
        if (inChallenge('nb', 11) && hasUpgrade('p', 102)) mult = mult.times(3)
        if (inChallenge('nb', 11) && hasUpgrade('p', 105)) mult = mult.times(upgradeEffect('p', 105))
        return mult
    },

    tabFormat: {
        "Main": {
            content: [
                "main-display",
                "prestige-button",
                "blank",
                ["display-text", function() {
                    if (inChallenge('nb', 11)) return "<h3 style='color:#e74c3c'>⚠️ CHALLENGE ACTIVE: Normal upgrades are hidden! Use Challenge Upgrades!</h3>"
                    return "<h3>Prestige Upgrades</h3>"
                }],
                "upgrades"
            ]
        }
    },

    upgrades: {
        // ==========================================
        // ОБЫЧНЫЕ АПГРЕЙДЫ ПРЕСТИЖА (Скрываются в челлендже)
        // ==========================================
        11: { title: "Point Booster", description: "Double your point generation rate.", cost: new Decimal(1), unlocked() { return !inChallenge('nb', 11) } },
        12: { 
            title: "Self-Synergy", 
            description: "Points boost prestige points gain.", 
            cost: new Decimal(2),
            unlocked() { return !inChallenge('nb', 11) },
            effect() { return player.points.add(1).pow(0.15).min(10) },
            effectDisplay() { return format(upgradeEffect('p', 12))+"x" }
        },
        13: { title: "Automation Core", description: "Generates 0.5 Prestige Points per second.", cost: new Decimal(5), unlocked() { return !inChallenge('nb', 11) } },
        21: {
            title: "Time Dilator",
            description: "Boost point generation based on time spent in this prestige.",
            cost: new Decimal(12),
            unlocked() { return !inChallenge('nb', 11) && hasUpgrade('p', 11) },
            effect() { return new Decimal(player.p.resetTime).add(1).pow(0.5) },
            effectDisplay() { return format(upgradeEffect('p', 21))+"x" }
        },
        22: {
            title: "Upgrade Synergy",
            description: "Prestige points gain is multiplied by total purchased upgrades.",
            cost: new Decimal(25),
            unlocked() { return !inChallenge('nb', 11) && hasUpgrade('p', 12) },
            effect() {
                let count = player.p.upgrades.length
                return new Decimal(count).add(1).pow(0.75)
            },
            effectDisplay() { return format(upgradeEffect('p', 22))+"x" }
        },
        23: {
            title: "Overdrive",
            description: "Prestige Points boost base point generation.",
            cost: new Decimal(75),
            unlocked() { return !inChallenge('nb', 11) && hasUpgrade('p', 13) },
            effect() { return player.p.points.add(1).pow(0.25) },
            effectDisplay() { return format(upgradeEffect('p', 23))+"x" }
        },

        // ==========================================
        // ХАРДКОРНЫЕ АПГРЕЙДЫ (Появляются ТОЛЬКО внутри челленджа 11)
        // ==========================================
        101: {
            title: "Emergency Friction",
            description: "Multiply base point generation by 5x inside this challenge.",
            cost: new Decimal(2),
            unlocked() { return inChallenge('nb', 11) }
        },
        102: {
            title: "Prestige Overclock",
            description: "Prestige points gain is multiplied by 3x inside this challenge.",
            cost: new Decimal(5),
            unlocked() { return inChallenge('nb', 11) && hasUpgrade('p', 101) }
        },
        103: {
            title: "The Core Catalyst",
            description: "Main points gain is boosted exponentially based on your current Prestige Points.",
            cost: new Decimal(15),
            unlocked() { return inChallenge('nb', 11) && hasUpgrade('p', 102) },
            effect() { return player.p.points.add(1).pow(0.4) },
            effectDisplay() { return format(upgradeEffect('p', 103)) + "x" }
        },
        // 🔥 НОВЫЕ СЛЕДУЮЩИЕ 4 УЛУЧШЕНИЯ ДЛЯ ЧЕЛЛЕНДЖА:
        104: {
            title: "Anti-Booster Synergizer",
            description: "Your unspent 'not boosters' boost main points generation rate inside the challenge.",
            cost: new Decimal(45),
            unlocked() { return inChallenge('nb', 11) && hasUpgrade('p', 103) },
            effect() { return player.nb.points.add(1).pow(0.3) },
            effectDisplay() { return format(upgradeEffect('p', 104)) + "x" }
        },
        105: {
            title: "Quantum Paradox",
            description: "Total base points grant an exponential boost to Prestige Points production.",
            cost: new Decimal(120),
            unlocked() { return inChallenge('nb', 11) && hasUpgrade('p', 104) },
            effect() { return player.points.add(1).log10().add(1).pow(0.5) },
            effectDisplay() { return format(upgradeEffect('p', 105)) + "x" }
        },
        106: {
            title: "Cubic Overdrive",
            description: "Your total purchased challenge upgrades give a cubic boost to main point generation rate.",
            cost: new Decimal(400),
            unlocked() { return inChallenge('nb', 11) && hasUpgrade('p', 105) },
            effect() {
                // Считаем сколько хардкорных апгрейдов куплено (начинаются со 100)
                let count = player.p.upgrades.filter(upg => upg >= 100).length
                return new Decimal(count).pow(3).add(1)
            },
            effectDisplay() { return format(upgradeEffect('p', 106)) + "x" }
        },
        107: {
            title: "The Final Breakthrough",
            description: "Shatter the final wall! Multiplies base point generation rate by a massive 150x.",
            cost: new Decimal(1500),
            unlocked() { return inChallenge('nb', 11) && hasUpgrade('p', 106) }
        }
    }
})

// ==========================================
// ROW 1: BOOSTERS LAYER (PURPLE)
// ==========================================
addLayer("b", {
    name: "Boosters",
    symbol: "B",
    position: 0,
    startData() { return { unlocked: false, points: new Decimal(0) }},
    color: "#9b59b6", 
    requires: new Decimal(200), 
    resource: "boosters",
    baseResource: "prestige points",
    baseAmount() { return player.p.points },
    type: "static", base: 3, exponent: 1.25, row: 1, 
    layerShown() { return player.p.points.gte(20) || player.b.unlocked },
    tabFormat: {
        "Main": {
            content: [
                "main-display", "prestige-button", "blank",
                ["display-text", function() {
                    let boosters = player.b.points
                    return "<h3>Booster Power:</h3><br>🔥 Each Booster multiplies your main points generation by <b>X²</b>!<br>Current Multiplier: <b>" + format(boosters.pow(2)) + "x</b><br>"
                }]
            ]
        }
    },
    doReset(resettingLayer) {
        if (layers[resettingLayer].row > this.row) return
        layerDataReset("p", []) 
    }
})

// ==========================================
// ROW 1: NOT BOOSTERS LAYER (DARK GREY)
// ==========================================
addLayer("nb", {
    name: "Not Boosters",
    symbol: "NB",
    position: 1, 
    startData() { return { unlocked: false, points: new Decimal(0) }},
    color: "#34495e", 
    requires: new Decimal(7), 
    resource: "not boosters",
    baseResource: "boosters",
    baseAmount() { return player.b.points },
    type: "normal", exponent: 0.5, row: 1, 
    layerShown() { return player.b.points.gte(7) || player.nb.unlocked },

    update(diff) {
        if (player.nb.unlocked) {
            let gain = new Decimal(1)
            if (hasUpgrade('nb', 11)) gain = gain.times(2)
            if (hasUpgrade('nb', 12)) gain = gain.times(upgradeEffect('nb', 12))
            player.nb.points = player.nb.points.add(gain.times(diff))
        }
    },

    upgrades: {
        11: { title: "Anti-Acceleration", description: "Double your 'not boosters' production rate.", cost: new Decimal(10) },
        12: { 
            title: "Reverse Logic", 
            description: "Your 'not boosters' boost your main game point generation rate.", 
            cost: new Decimal(25),
            effect() { return player.nb.points.add(1).pow(0.2) },
            effectDisplay() { return format(upgradeEffect('nb', 12)) + "x" }
        },
        13: {
            title: "The Ultimate Paradox",
            description: "Shatter the logic entirely. Unlocks Not Boosters Challenges below!",
            cost: new Decimal(100),
            unlocked() { return hasUpgrade('nb', 11) && hasUpgrade('nb', 12) }
        }
    },

    challenges: {
        11: {
            name: "Zero Efficiency",
            challengeDescription: "Your Booster formula is nerfed to X^1 instead of X^2",
            goalDescription: "Reach 1.00e7 base points.",
            canComplete() { return player.points.gte(1e7) },
            rewardDescription: "Permanently double the Prestige passive automation rate (from 25% to 50% per second).",
            unlocked() { return hasUpgrade('nb', 13) },
            onComplete() {player.p.upgrades = player.p.upgrades.filter(upg => upg < 100)},
            onExit() {player.p.upgrades = player.p.upgrades.filter(upg => upg < 100)}}},
            doReset(resettingLayer) {if (layers[resettingLayer].row > this.row) returnlayerDataReset("p", [])

            }
        }
    )





