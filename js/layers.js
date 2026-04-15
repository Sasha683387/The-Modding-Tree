
addLayer("a", {
    name: "Achievements",
    symbol: "A",
    row: "side",       // Puts it in side tab
    color: "#ffaa00",

    startData() {
        return {
            unlocked: true,
        }
    },

    achievements: {

        11: {
            name: "First Steps",
            tooltip: "Get 1 point",
            done() { return player.points.gte(1) },   // condition
        },

        12: {
            name: "Getting Stronger",
            tooltip: "Buy Prestige Upgrade 14",
            done() { return hasUpgrade("p", 14) },
        },

        13: {
            name: "Getting Even Stronger",
            tooltip: "Buy Prestige Upgrade 25",
            done() { return hasUpgrade("p", 25) },
        },
        14: {
            name: "Getting Too Strong",
            tooltip: "Buy Prestige Upgrade 34",
            done() { return hasUpgrade("p", 34) },
        },
        15: {
            name: "Better Boost",
            tooltip: "Buy Prestige Upgrade 41",
            done() { return hasUpgrade("p", 41) },
        },
        21: {
            name: "New Layer",
            tooltip: "Buy Prestige Upgrade 45",
            done() { return hasUpgrade("p", 45) },
        },
        22: {
            name: "BIG boost",
            tooltip: "Buy Super Prestige Upgrade 12",
            done() { return hasUpgrade("sp", 12) },
        },
        23: {
            name: "my very good tree v2",
            tooltip: "Inflation starts. Buy Hyper Prestige Upgrade 11",
            done() { return hasUpgrade("hp", 11) },
        },
        24: {
            name: "New upgrades!!!",
            tooltip: "Unlock new upgrades in Prestige",
            done() { return hasUpgrade("p", 53) },
        },
        25: {
            name: "Levels?",
            tooltip: "Unlock new layer or buy Prestige Upgrade 55",
            done() { return hasUpgrade("p", 55) },
        },
    }}),
addLayer("p", {
    name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#0004ff",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "prestige points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let mult = new Decimal(1)
        if (hasUpgrade("p", 53)) mult = mult.times(5)
        if (hasUpgrade("p", 55)) mult = mult.times(3)
        if (hasMilestone("l", 0))
        mult = mult.times(10)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    doReset(resettingLayer) {
    if (layers[resettingLayer].row > this.row) {

        // If you have the upgrade, do nothing
        if (hasUpgrade("hp", 21)) return

        // Otherwise reset normally
        layerDataReset("hp", [])
    }
},
    autoUpgrade() {
    return hasUpgrade("sp", 21)
    },
    passiveGeneration(){
    let passive = new Decimal(0)
    if (hasUpgrade("sp", 15)) passive = passive.add(0.05) //5% Prestige Points depending on Reset
    if (hasUpgrade("sp", 31)) passive = passive.add(0.05)
    if (hasUpgrade("hp", 22)) passive = passive.add(0.15)
    if (hasUpgrade("hp", 23)) passive = passive.add(0.75)
    return passive
    },
        upgrades: {
        11: {
        title: "(#1) The First Difficulty",
        description: "Double your point gain.",
        cost: new Decimal(1),
        },
        12: {
        title: "(#2) The First Difficulty",
        description: "x1.5 your point gain",
        cost: new Decimal(2),
        unlocked() { return hasUpgrade("p", 11) },
        },
        13: {
        title: "(#3) The First Difficulty",
        description: "Double your point gain again",
        cost: new Decimal(4),
        unlocked() { return hasUpgrade("p", 12) },
        },
        14: {
        title: "(#4) The Lower Gap",
        description: "x3 your point gain",
        cost: new Decimal(7),
        unlocked() { return hasUpgrade("p", 13) },
        },
        15: {
        title: "(#5) The Lower Gap",
        description: "Double your point gain yet again",
        cost: new Decimal(15),
        unlocked() { return hasUpgrade("p", 14) },
        },
        21: {
        title: "(#6) The Lower Gap",
        description: "Double your point gain yet yet again",
        cost: new Decimal(34),
        unlocked() { return hasUpgrade("p", 15) },
        },
        22: {
        title: "(#7) The Lower Gap",
        description: "Double your point gain yet yet yet again",
        cost: new Decimal(51),
        unlocked() { return hasUpgrade("p", 21) },
        },
        23: {
        title: "(#8) The Lower Gap",
        description: "Double your point gain yet yet yet yet again",
        cost: new Decimal(82),
        unlocked() { return hasUpgrade("p", 22) },
        },
        24: {
        title: "(#9) Negativity",
        description: "x1.01 point gain:)",
        cost: new Decimal(160),
        unlocked() { return hasUpgrade("p", 23) },
        },
        25: {
        title: "(#10) Negativity",
        description: "Boost your points by prestige points.(slightly)",
        cost: new Decimal(175),
        unlocked() { return hasUpgrade("p", 24) },
            effect() {
        return player[this.layer].points.add(1).pow(0.1)
    },
    effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
        31: {
        title: "(#11) Negativity",
        description: "x1.4 your point gain",
        cost: new Decimal(225),
        unlocked() { return hasUpgrade("p", 25) },
        },
        32: {
        title: "(#12) Negativity",
        description: "x3.14 your point gain",
        cost: new Decimal(275),
        unlocked() { return hasUpgrade("p", 31) },
        },
        33: {
        title: "(#13) Unimpossible",
        description: "x2.71828 your point gain",
        cost: new Decimal(400),
        unlocked() { return hasUpgrade("p", 32) },
        },
        34: {
        title: "(#14) Unimpossible",
        description: "x10 your point gain",
        cost: new Decimal(625),
        unlocked() { return hasUpgrade("p", 33) },
        },
        35: {
        title: "(#15) Friendliness",
        description: "x2.123 your point gain",
        cost: new Decimal(1250),
        unlocked() { return hasUpgrade("p", 34) },
        },
        41: {
        title: "(#16) Friendliness",
        description: "Boost your points gain by prestige more",
        cost: new Decimal(1500),
        unlocked() { return hasUpgrade("p", 35) },
            effect() {
        return player[this.layer].points.add(1).pow(0.15)
    },
    effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
        42: {
        title: "(#17) Friendliness",
        description: "x6.21 your point gain",
        cost: new Decimal(2200),
        unlocked() { return hasUpgrade("p", 41) },
        },
        43: {
        title: "(#18) True Ease",
        description: "x2.22 your point gain",
        cost: new Decimal(3560),
        unlocked() { return hasUpgrade("p", 42) },
        },
        44: {
        title: "(#19) True Ease",
        description: "x1.23 point gain",
        cost: new Decimal(4620),
        unlocked() { return hasUpgrade("p", 43) },
        },
        45: {
        title: "(#20) True Ease",
        description: "x6 point gain",
        cost: new Decimal(5500),
        unlocked() { return hasUpgrade("p", 44) },
    },
        51: {
        title: "(#21) True Ease",
        description: "x1.015 point gain",
        cost: new Decimal(6750),
        unlocked() { return hasUpgrade("p", 45) },
    },
        52: {
        title: "(#NL1) New Layer",
        description: "Last upgrade before next layer. x1.001 point gain",
        cost: new Decimal(7150),
        unlocked() { return hasUpgrade("p", 51) },
    },
        53: {
        title: "(#22) True Ease",
        description: "Welcome back, Human! x5 your prestige gain",
        cost: new Decimal(1e13),
        unlocked() { return hasUpgrade("hp", 52) },
    },
        54: {
        title: "(#23) True Ease",
        description: "Pre-last upgrade! x5 point gain!",
        cost: new Decimal(3e15),
        unlocked() { return hasUpgrade("p", 53) },
    },
        55: {
        title: "(#NL3) True Ease",
        description: "Last upgrade! x3 prestige and point gain! And unlock levels",
        cost: new Decimal(5e15),
        unlocked() { return hasUpgrade("p", 54) },
    },
}})
addLayer("sp", {
    name: "super prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "SP", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#ff0000",
    requires: new Decimal(5e9), // Can be a function that takes requirement increases into account
    resource: "super prestige points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.9, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasMilestone("l", 0))
        mult = mult.times(5)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "s", description: "S: Reset for super prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){
    return hasUpgrade("p", 52)
    },
    autoPrestige() {
    return hasUpgrade("sp", 32)
    },
    upgrades: {
        11: {
        title: "(#SP1) New layer!!!",
        description: "Triple yur pint gan!!!",
        cost: new Decimal(1),
        },
        12: {
        title: "(#SP2) New layer!!!*10",
        description: "x10 point gain(strong!)",
        cost: new Decimal(2),
        unlocked() { return hasUpgrade("sp", 11) },
        },
        13: {
        title: "(#SP3) This boost again:cry:",
        description: "Boost your points gain by super prestige",
        cost: new Decimal(3),
        unlocked() { return hasUpgrade("sp", 12) },
            effect() {
        return player[this.layer].points.add(1).pow(1)
    },
    effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
        14: {
        title: "(#SP4) Pro tip: Hold P for automation",
        description: "New layer, better boosts. x5 points",
        cost: new Decimal(5),
        unlocked() { return hasUpgrade("sp", 13) },
        },
        15: {
        title: "(#SP5) End of the ROW_1",
        description: "x3 points and unlock Passive Gain!(5% PP/sec)",
        cost: new Decimal(8),
        unlocked() { return hasUpgrade("sp", 14) },
        },
        21: {
        title: "(#SP6) Start of the ROW_2",
        description: "Hello again. Autobuy Prestige upgrades",
        cost: new Decimal(10),
        unlocked() { return hasUpgrade("sp", 15) },
        },
        22: {
        title: "(#SP7) I ran out of upgrades",
        description: "Hi. x10000-9995 points",
        cost: new Decimal(15),
        unlocked() { return hasUpgrade("sp", 21) },
        },
        23: {
        title: "(#SP8) name",
        description: "A x10 point boost to progress further",
        cost: new Decimal(18),
        unlocked() { return hasUpgrade("sp", 22) },
        },
        24: {
        title: "(#SP9) Pre-Last upgrade of SP",
        description: "Pre-Last upgrade!!!",
        cost: new Decimal(25),
        unlocked() { return hasUpgrade("sp", 23) },
        },
        25: {
        title: "(#SP10) The End for v0.4",
        description: "this is a joke",
        cost: new Decimal(30),
        unlocked() { return hasUpgrade("sp", 24) },
        },
        31: {
        title: "(#SP11) Super Pro tip: Hold S for automation",
        description: "Upgrade your passive gain to 10%",
        cost: new Decimal(35),
        unlocked() { return hasUpgrade("sp", 25) },
        },
        32: {
        title: "(#SP12) Faster Resets",
        description: "x6 point gain and ...",
        cost: new Decimal(38),
        unlocked() { return hasUpgrade("sp", 31) },
        },
        33: {
        title: "(#SP13) Even Faster Resets",
        description: "New layer soon!!!(x10 points)",
        cost: new Decimal(40),
        unlocked() { return hasUpgrade("sp", 32) },
        },
        34: {
        title: "(#NL2) Last upgrade before the next layer!!!",
        description: "x5 point gain",
        cost: new Decimal(50),
        unlocked() { return hasUpgrade("sp", 33) },
        },
}})
addLayer("hp", {
    name: "hyper prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "HP", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 100, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#66ff00",
    requires: new Decimal(5e20), // Can be a function that takes requirement increases into account
    resource: "hyper prestige points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasMilestone("l", 0))
        mult = mult.times(3)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "h", description: "H: Reset for hyper prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){
    return hasUpgrade("sp", 34)
    },
    milestones: {
    0: {
        requirementDescription: "100 Hyper Prestige Points",
        done() { return player.p.points.gte(100) },
        effectDescription: "First milestone! x5 HPP gain.",
    },
    1: {
        requirementDescription: "250 Hyper Prestige Points",
        done() { return player.p.points.gte(250) },
        effectDescription: "Double HPP gain!!!",
    },
},
gainMult() {
    let mult = new Decimal(1)
     if (hasMilestone("hp", 0))
        mult = mult.times(5)
    if (hasMilestone("hp", 1))
        mult = mult.times(2)
    return mult
},
    upgrades: {
        11: {
        title: "(#HP1) New layer again!!!",
        description: "x5 yur pint gan!!!",
        cost: new Decimal(1),
        },
        12: {
        title: "(#HP2) When is upgrade to passive gain?",
        description: "Basic upgrade!!! x2 point gain",
        cost: new Decimal(2),
        unlocked() { return hasUpgrade("hp", 11) },
        },
        13: {
        title: "(#HP3) Basic upgrade again",
        description: "x2.22 point gain",
        cost: new Decimal(3),
        unlocked() { return hasUpgrade("hp", 12) },
        },
        14: {
        title: "(#HP4) BUAA",
        description: "x2.222 point gain",
        cost: new Decimal(4),
        unlocked() { return hasUpgrade("hp", 13) },
        },
        15: {
        title: "(#HP5) This is The Double Tree",
        description: "(End of the v0.5) x2.22222 point gain",
        cost: new Decimal(5),
        unlocked() { return hasUpgrade("hp", 14) },
        },
        21: {
        title: "(#HP6) More Easier",
        description: "(End of the v0.6)Prestige no longer resets on row 1 reset and prestige resets nothing",
        cost: new Decimal(15),
        unlocked() { return hasUpgrade("hp", 15) },
        },
        22: {
        title: "(#HP7) Even More Easier",
        description: "Upgrade your passive gain to 25%",
        cost: new Decimal(35),
        unlocked() { return hasUpgrade("hp", 21) },
        },
        23: {
        title: "(#HP8) Full Automation Prestige",
        description: "Upgrade your passive gain to 100%",
        cost: new Decimal(100),
        unlocked() { return hasUpgrade("hp", 22) },
        },
        24: {
        title: "(#HP9) New Upgrades!!! yayayayayay!",
        description: "Unlock new upgrades in Prestige.",
        cost: new Decimal(250),
        unlocked() { return hasUpgrade("hp", 23) },
        },
}}),
addLayer("l", {
    name: "levels", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "L", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#0066ff",
    requires: new Decimal(5e25), // Can be a function that takes requirement increases into account
    resource: "levels", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.9, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "s", description: "L: Reset for levels!", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){
    return hasUpgrade("p", 55)
    },
    milestones: {
    0: {
        requirementDescription: "1 Level",
        done() { return player.p.points.gte(1) },
        effectDescription: "Great! Your first level! x10 P, x5 SP, x3 HP!!!",
    },
}})