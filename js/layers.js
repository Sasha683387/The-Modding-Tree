addLayer("a", {
    name: "Achievements",
    symbol: "A",
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
        secretUnlocked: false,
    }},
    color: "#f1c40f",
    row: "side", // ИСПРАВЛЕНИЕ: выносим слой из основного дерева в боковую панель
    type: "side", // ИСПРАВЛЕНИЕ: тип side полностью защищает ачивки от любых reset'ов!

    update(diff) {
        let earned = 0
        for (let row in this.achievements) {
            for (let col in this.achievements[row]) {
                if (hasAchievement("a", row + col)) earned++
            }
        }
        player.a.points = new Decimal(earned)
    },

        tabFormat: {
        "Main": {
            content: [
                "main-display",
                ["display-text", function() {
                    // Считаем полученные ачивки прямо в момент рендеринга текста
                    let earned = 0
                    if (hasAchievement("a", 11)) earned++
                    if (hasAchievement("a", 12)) earned++
                    if (hasAchievement("a", 13)) earned++
                    if (hasAchievement("a", 21)) earned++
                    if (hasAchievement("a", 22)) earned++
                    if (hasAchievement("a", 31)) earned++

                    let boost = earned * 10 // Умножаем на 10%
                    return "Each completed achievement increases main points generation by <b>+10%</b> (Total: <b>+" + boost + "%</b>)<br><br>"
                }],
                "blank",
                "achievements",
                "blank",
                "blank",
                "clickables"
            ]
        }
    },


    clickables: {
        11: {
            title: "",
            display() { return "" },
            style: {
                "background-color": "transparent",
                "border": "none",
                "box-shadow": "none",
                "width": "20px",
                "height": "20px",
                "cursor": "default"
            },
            canClick() { return !hasAchievement('a', 31) },
            onClick() {
                player.a.secretUnlocked = true
                earnAchievement('a', 31)
            }
        }
    },

    achievements: {
        11: {
            name: "The Beginning",
            done() { return player.points.gte(10) },
            tooltip: "Reach 10 base points."
        },
        12: {
            name: "Prestige Elite",
            done() { return player.p.points.gte(100) },
            tooltip: "Reach 100 Prestige Points."
        },
        13: {
            name: "Heavy Industry",
            done() { return player.b.points.gte(3) },
            tooltip: "Have 3 Boosters."
        },
        21: {
            name: "Paradoxical Mind",
            done() { return hasUpgrade('nb', 13) },
            tooltip: "Unlock Not Booster Challenges."
        },
        22: {
            name: "Unstoppable",
            done() { return hasChallenge('nb', 11) },
            tooltip: "Complete 'Zero Efficiency' challenge."
        },
        31: {
            name: "🕵️‍♂️ Secret Agent",
            done() { return player.a.secretUnlocked },
            tooltip: "You found the invisible switch! Permanent x1.5 boost to main points.",
            unlocked() { return hasAchievement('a', 31) }
        }
    }
});
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
    exponent() {
        let exp = new Decimal(0.5)
        if (hasUpgrade('p', 33)) exp = exp.add(upgradeEffect('p', 33))
        return exp
    },
    row: 0,
    layerShown() { return true },

    update(diff) {
        if (hasUpgrade('p', 13) && !inChallenge('nb', 11)) {
            let autoRate = new Decimal(0.5)
            if (hasAchievement('a', 22)) autoRate = new Decimal(1.0)
            player.p.points = player.p.points.add(autoRate.times(diff))
        }
    },

    passiveGeneration() {
        if (player.b && player.b.unlocked && player.b.points.gte(1)) {
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
        if (hasUpgrade('p', 31) && !inChallenge('nb', 11)) mult = mult.times(upgradeEffect('p', 31))
        
        if (inChallenge('nb', 11)) {
            if (hasUpgrade('p', 102)) mult = mult.times(2)
            if (hasUpgrade('p', 105)) mult = mult.times(upgradeEffect('p', 105))
        }
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
        11: { title: "Point Booster", description: "Double your point generation rate.", cost: new Decimal(1), unlocked() { return !inChallenge('nb', 11) } },
        12: { 
            title: "Self-Synergy", 
            description: "Points boost prestige points gain.", 
            cost: new Decimal(2),
            unlocked() { return !inChallenge('nb', 11) },
            effect() { return player.points.add(1).pow(0.12).min(5) },
            effectDisplay() { return format(upgradeEffect('p', 12))+"x" }
        },
        13: { title: "Automation Core", description: "Generates Prestige Points per second.", cost: new Decimal(5), unlocked() { return !inChallenge('nb', 11) } },
        21: {
            title: "Time Dilator",
            description: "Boost point generation based on time spent in this prestige.",
            cost: new Decimal(15),
            unlocked() { return !inChallenge('nb', 11) && hasUpgrade('p', 11) },
            effect() { return new Decimal(player.p.resetTime).add(1).pow(0.35) },
            effectDisplay() { return format(upgradeEffect('p', 21))+"x" }
        },
        22: {
            title: "Upgrade Synergy",
            description: "Prestige points gain is multiplied by total purchased upgrades.",
            cost: new Decimal(40),
            unlocked() { return !inChallenge('nb', 11) && hasUpgrade('p', 12) },
            effect() { return new Decimal(player.p.upgrades.length).add(1).pow(0.5) },
            effectDisplay() { return format(upgradeEffect('p', 22))+"x" }
        },
        23: {
            title: "Overdrive",
            description: "Prestige Points boost base point generation.",
            cost: new Decimal(100),
            unlocked() { return !inChallenge('nb', 11) && hasUpgrade('p', 13) },
            effect() { return player.p.points.add(1).pow(0.2) },
            effectDisplay() { return format(upgradeEffect('p', 23))+"x" }
        },
        31: {
            title: "Booster Synergy",
            description: "Boosters give an additional multiplier to Prestige Points.",
            cost: new Decimal(50000),
            unlocked() { return player.b.points.gte(12) && !inChallenge('nb', 11) },
            effect() { return player.b.points.add(1).pow(1.1) },
            effectDisplay() { return format(upgradeEffect('p', 31)) + "x" }
        },
        32: {
            title: "Not Booster Catalysis",
            description: "Your 'not boosters' boost basic point generation significantly.",
            cost: new Decimal(250000),
            unlocked() { return player.b.points.gte(12) && !inChallenge('nb', 11) && hasUpgrade('p', 31) },
            effect() { return player.nb.points.add(1).pow(0.35) },
            effectDisplay() { return format(upgradeEffect('p', 32)) + "x" }
        },
        33: {
            title: "The 12th Dimension",
            description: "Slightly increase the exponent of Prestige Point generation.",
            cost: new Decimal(2000000),
            unlocked() { return player.b.points.gte(12) && !inChallenge('nb', 11) && hasUpgrade('p', 32) },
            effect() { return new Decimal(0.03) },
            effectDisplay() { return "+" + format(upgradeEffect('p', 33)) }
        },

        101: { title: "Emergency Friction", description: "Multiply base point generation by 4x inside this challenge.", cost: new Decimal(2), unlocked() { return inChallenge('nb', 11) } },
        102: { title: "Prestige Overclock", description: "Prestige points gain is multiplied by 2x inside this challenge.", cost: new Decimal(5), unlocked() { return inChallenge('nb', 11) && hasUpgrade('p', 101) } },
        103: {
            title: "The Core Catalyst",
            description: "Main points gain is boosted exponentially based on your current Prestige Points.",
            cost: new Decimal(20),
            unlocked() { return inChallenge('nb', 11) && hasUpgrade('p', 102) },
            effect() { return player.p.points.add(1).pow(0.3) },
            effectDisplay() { return format(upgradeEffect('p', 103)) + "x" }
        },
        104: {
            title: "Anti-Booster Synergizer",
            description: "Your unspent 'not boosters' boost main points generation rate inside the challenge.",
            cost: new Decimal(75),
            unlocked() { return inChallenge('nb', 11) && hasUpgrade('p', 103) },
            effect() { return player.nb.points.add(1).pow(0.25) },
            effectDisplay() { return format(upgradeEffect('p', 104)) + "x" }
        },
        105: {
            title: "Quantum Paradox",
            description: "Total base points grant an exponential boost to Prestige Points production.",
            cost: new Decimal(250),
            unlocked() { return inChallenge('nb', 11) && hasUpgrade('p', 104) },
            effect() { return player.points.add(1).log10().add(1).pow(0.4) },
            effectDisplay() { return format(upgradeEffect('p', 105)) + "x" }
        },
        106: {
            title: "Cubic Overdrive",
            description: "Your total purchased challenge upgrades give a boost to main point generation rate.",
            cost: new Decimal(1000),
            unlocked() { return inChallenge('nb', 11) && hasUpgrade('p', 105) },
            effect() {
                let count = player.p.upgrades.filter(upg => Number(upg) >= 100).length
                return new Decimal(count).pow(2).add(1)
            },
            effectDisplay() { return format(upgradeEffect('p', 106)) + "x" }
        },
        107: { title: "The Final Breakthrough", description: "Shatter the final wall! Multiplies base point generation rate by a massive 25x.", cost: new Decimal(5000), unlocked() { return inChallenge('nb', 11) && hasUpgrade('p', 106) } }
    }
});
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
    type: "static", 
    base: 1.5, 
    exponent: 1.2, 
    row: 1, 
    layerShown() { return player.p.points.gte(20) || player.b.unlocked },
    
    tabFormat: {
        "Main": {
            content: [
                "main-display", 
                "prestige-button", 
                "blank",
                ["display-text", function() {
                    let boosters = player.b.points
                    let currentMult = boosters.gt(0) ? (inChallenge('nb', 11) ? boosters.add(1).pow(0.5) : boosters.add(1).pow(1.75)) : new Decimal(1)
                    return "<h3>Booster Power:</h3><br>🔥 Each Booster multiplies your main points generation by <b>X^1.75</b>!<br>Current Multiplier: <b>" + format(currentMult) + "x</b><br>"
                }],
                "blank",
                "milestones"
            ]
        }
    },

    milestones: {
        0: {
            requirementDescription: "8 Boosters (Requires 'Zero Efficiency' completed)",
            effectDescription: "Keep Prestige Upgrades on all resets.",
            done() { return player.b.points.gte(8) && hasChallenge('nb', 11) },
            unlocked() { return hasChallenge('nb', 11) }
        },
        1: {
            requirementDescription: "10 Boosters (Requires 'Square Rooted' completed)",
            effectDescription: "Unlock a 3x boost to Not Boosters production.",
            done() { return player.b.points.gte(10) && hasChallenge('nb', 12) },
            unlocked() { return hasChallenge('nb', 12) }
        }
    },
    
    doReset(resettingLayer) {
        if (layers[resettingLayer].row > this.row) {
            layerDataReset("b", [])
        }
    }
});

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
    type: "none", 
    row: 1,
    layerShown() { return player.b.points.gte(7) || player.nb.unlocked },

    update(diff) {
        if (!player.nb.unlocked && player.b.points.gte(7)) {
            player.nb.unlocked = true
        }

        if (player.nb.unlocked) {
            let gain = new Decimal(0.5) 
            if (hasUpgrade('nb', 11)) gain = gain.times(2)
            if (hasUpgrade('nb', 12)) gain = gain.times(upgradeEffect('nb', 12))
            if (hasChallenge('nb', 12)) gain = gain.times(challengeEffect('nb', 12))
            if (hasMilestone('b', 1)) gain = gain.times(3)
            if (hasAchievement('a', 21)) gain = gain.times(1.15) 
            player.nb.points = player.nb.points.add(gain.times(diff))
        }
    },

    tabFormat: {
        "Main": {
            content: [
                "main-display",
                "blank",
                "upgrades",
                "blank",
                "challenges"
            ]
        }
    },

    upgrades: {
        11: {
            title: "Anti-Acceleration",
            description: "Double your 'not boosters' production rate.",
            cost: new Decimal(15) 
        },
        12: {
            title: "Reverse Logic",
            description: "Your 'not boosters' boost your main game point generation rate.",
            cost: new Decimal(45), 
            effect() { return player.nb.points.add(1).pow(0.15) }, 
            effectDisplay() { return format(upgradeEffect('nb', 12)) + "x" }
        },
        13: {
            title: "The Ultimate Paradox",
            description: "Shatter the logic entirely. Unlocks Not Boosters Challenges below!",
            cost: new Decimal(200), 
            unlocked() { return hasUpgrade('nb', 11) && hasUpgrade('nb', 12) }
        }
    },

    challenges: {
        11: {
            name: "Zero Efficiency",
            challengeDescription: "Your Booster formula is nerfed to X^0.5. Normal Prestige Upgrades are hidden, but unlock 7 Hardcore Upgrades!",
            goalDescription: "Reach 5.00e6 points.", 
            canComplete() { return player.points.gte(5e6) },
            rewardDescription: "Permanently double the Prestige passive automation rate (from 25% to 50% per second).",
            unlocked() { return hasUpgrade('nb', 13) },
            
            onEnter() {
                layerDataReset("p", []) 
                player.points = new Decimal(0) 
            },
            onComplete() {
                player.p.upgrades = player.p.upgrades.filter(upg => Number(upg) < 100)
                layerDataReset("p", [])
            },
            onExit() {
                player.p.upgrades = player.p.upgrades.filter(upg => Number(upg) < 100)
                layerDataReset("p", [])
            }
        },
        12: {
            name: "Square Rooted",
            challengeDescription: "Your point gain is square rooted!",
            goalDescription: "Reach 2,500 points.", 
            canComplete() { return player.points.gte(2500) },
            rewardDescription: "You get 20% more 'not boosters' currency.",
            unlocked() { return hasUpgrade('nb', 13) },
            rewardEffect() {
                return new Decimal(1.2)
            },
            
            onEnter() {
                layerDataReset("p", [])
                player.points = new Decimal(0)
            },
            onComplete() {
                layerDataReset("p", [])
            },
            onExit() {
                layerDataReset("p", [])
            }
        }
    },

    doReset(resettingLayer) {
        if (layers[resettingLayer].row > this.row) {
            layerDataReset("nb", [])
        }
    }
});

