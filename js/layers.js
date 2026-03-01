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
        },
        13: {
        title: "(#3) The First Difficulty",
        description: "Double your point gain again",
        cost: new Decimal(4),
        },
        14: {
        title: "(#4) The Lower Gap",
        description: "x3 your point gain",
        cost: new Decimal(5),
        },
        15: {
        title: "(#5) The Lower Gap",
        description: "Double your point gain yet again",
        cost: new Decimal(9),
        },
        21: {
        title: "(#6) The Lower Gap",
        description: "Double your point gain yet yet again",
        cost: new Decimal(15),
        },
        22: {
        title: "(#7) The Lower Gap",
        description: "Double your point gain yet yet yet again",
        cost: new Decimal(19),
        },
        23: {
        title: "(#8) The Lower Gap",
        description: "Double your point gain yet yet yet yet again",
        cost: new Decimal(24),
        },
        24: {
        title: "(#9) Negativity",
        description: "x1.01 point gain:)",
        cost: new Decimal(43),
        },
        25: {
        title: "(#10) Negativity",
        description: "Boost your points by prestige points.(slightly)",
        cost: new Decimal(68),
            effect() {
        return player[this.layer].points.add(1).pow(0.1)
    },
    effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
        31: {
        title: "(#11) Negativity",
        description: "x1.4 your point gain",
        cost: new Decimal(109),
        },
        32: {
        title: "(#12) Negativity",
        description: "x3.14 your point gain",
        cost: new Decimal(167),
        },
        33: {
        title: "(#13) Unimpossible",
        description: "x2.71828 your point gain",
        cost: new Decimal(297),
        },
        34: {
        title: "(#14) Unimpossible",
        description: "x10 your point gain",
        cost: new Decimal(571),
        },
        35: {
        title: "(#15) Friendliness",
        description: "x2.123 your point gain",
        cost: new Decimal(1213),
        },
        41: {
        title: "(#16) Friendliness",
        description: "Boost your points gain by prestige more",
        cost: new Decimal(2051),
            effect() {
        return player[this.layer].points.add(1).pow(0.15)
    },
    effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
        42: {
        title: "(#17) Friendliness",
        description: "x6.21 your point gain",
        cost: new Decimal(5028),
        },
        43: {
        title: "(#18) True Ease",
        description: "x2.22 your point gain",
        cost: new Decimal(8367),
        },
        44: {
        title: "(#19) True Ease",
        description: "x1.23 point gain",
        cost: new Decimal(14025),
        },
        45: {
        title: "(#20) True Ease",
        description: "x6 point gain",
        cost: new Decimal(25100),
    },
        51: {
        title: "(#???) impossible",
        description: "x1e10 point gain",
        cost: new Decimal(1e308),
    },
        52: {
        title: "(#21) True Ease",
        description: "x1.015 point gain",
        cost: new Decimal(100000),
    },
        53: {
        title: "(#NL1) New Layer",
        description: "Last upgrade before next layer. x1.001 point gain",
        cost: new Decimal(175000),
    },
}})
addLayer("sp", {
    name: "super prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "SP", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#ff0000",
    requires: new Decimal(5e9), // Can be a function that takes requirement increases into account
    resource: "super prestige points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "s", description: "S: Reset for super prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
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
        },
        13: {
        title: "(#SP3) This boost again:cry:",
        description: "Boost your points gain by super prestige",
        cost: new Decimal(3),
            effect() {
        return player[this.layer].points.add(1).pow(1)
    },
    effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
}})