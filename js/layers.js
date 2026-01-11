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
        mult = new Decimal(1)
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
        cost: new Decimal(7),
        },
        21: {
        title: "(#6) The Lower Gap",
        description: "Double your point gain yet yet again",
        cost: new Decimal(10),
        },
        22: {
        title: "(#7) The Lower Gap",
        description: "Double your point gain yet yet yet again",
        cost: new Decimal(12),
        },
        23: {
        title: "(#8) The Lower Gap",
        description: "Double your point gain yet yet yet yet again",
        cost: new Decimal(15),
        },
        24: {
        title: "(#9) Negativity",
        description: "x1.01 point gain:)",
        cost: new Decimal(20),
        },
        25: {
        title: "(#10) Negativity",
        description: "Boost your points by prestige points.(slightly)",
        cost: new Decimal(28),
            effect() {
        return player[this.layer].points.add(1).pow(0.2)
    },
    effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
    },
})
