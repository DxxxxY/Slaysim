//setup
require("dotenv").config()
const express = require("express")
const { get } = require("axios")
const data = require("./data.json")
const path = require("path")
const wge = require("wge")
const utils = require("./utils")
const helmet = require("helmet");
const version = require("./package.json").version
const app = express()
const port = process.env.PORT || 80

//plugins
app.use(helmet()) //secure
app.use(express.json()) //parse json
app.use(express.urlencoded({ extended: true }))

//main page, send render
app.get("/", (req, res) => res.send(wge.render(path.join(__dirname, "public/index.html"), { version })))

app.post("/slayer", async(req, res) => {
    //get basic info
    minecraftID = await (await get(`https://api.minetools.eu/uuid/${req.body.username}`)).data.id
    if (!minecraftID) return res.send("This IGN could not be resolved")
    let profiles = await (await get(`https://api.hypixel.net/skyblock/profiles?key=${process.env.APIKEY}&uuid=${minecraftID}`)).data.profiles
    let profile = await (await get(`https://api.hypixel.net/skyblock/profile?key=${process.env.APIKEY}&profile=${utils.getLatestProfile(profiles, minecraftID)[0].profile_id}`)).data.profile
    let name = req.body.username
    let user = profile.members[minecraftID]

    //declare stats
    let stats = {
        // weekend: true,
        // combatXpBuff: 1,
        slayerXpBuff: 1,
        mf: 1,
        price: 1,
        zombie: [],
        spider: [],
        wolf: [],
        enderman: []
    }

    //declare slayer
    let slayer = {
        type: req.body.type,
        tier: req.body.tier != 5 ? req.body.tier : (req.body.type == "zombie" ? 5 : 4),
        amount: req.body.amount
    }

    //slayer loop
    Object.keys(user.slayer_bosses).forEach(boss => {
        let slayer = user.slayer_bosses[boss]

        //calc global xp buff

        // for (let i = 0; i <= 2; i++) {
        //     if (slayer.hasOwnProperty(`boss_kills_tier_${i}`)) stats.combatXpBuff += 0.01 //t1 - t3
        // }
        // if (slayer.hasOwnProperty(`boss_kills_tier_3`)) stats.combatXpBuff += 0.02 //t4

        //calc level
        if (!slayer.hasOwnProperty("xp")) return
        let need = JSON.parse(JSON.stringify(data))[boss]

        //get level and progress to next
        for (let x in need) {
            if (slayer.xp < need[x]) { //if xp is lower than cumulative, we found the level
                stats[boss] = [+x, slayer.xp]
                break
            }
        }
    })

    /* form info */

    //weekend bonus
    // if (weekend) stats.combatXpBuff += 0.2

    //buffs
    stats.mf += (+req.body.mf / 100)

    //aatrox
    if (req.body.xp) stats.slayerXpBuff += 0.25
    if (req.body.drops) stats.mf += 0.2
    if (req.body.price) stats.price /= 2

    /* player info */

    //slayer level bonus
    if (stats.zombie[0] >= 7 && stats.spider[0] >= 7 && stats.wolf[0] >= 7 && stats.enderman[0] >= 7) stats.price -= 0.04

    //send simulated data
    res.send(calcDrops(slayer.type, slayer.tier, stats.mf, slayer.amount, stats[slayer.type][0]))
})

//calculate the stack size to be dropped
const calcStack = (type, tier, item) => {
    const drops = require(`./drops/${type}/t${tier}.json`) //loot table
    let drop = drops[item]

    //if range doesnt exist, its specific
    return !drop[1][0] ? drop[1] : drop[1].random()
}

//drop into map
const drop = (type, tier, item, map) => {
    map.set(item.camel(), (map.has(item.camel()) ? map.get(item.camel()) + calcStack(type, tier, item) : calcStack(type, tier, item)))
}

//main calculation logic
const calcDrops = (type, tier, mf, amount, level) => {
    let tickets = []
    const drops = require(`./drops/${type}/t${tier}.json`) //loot table
    const levels = require(`./drops/${type}/levels.json`)

    //if it doesnt meet level requirement then remove it from drops
    Object.keys(levels).forEach(item => { if (level < levels[item]) delete drops[item] })

    let totalDrops = new Map()
    for (let i = 0; i < amount; i++) {
        let ticket = Math.random() * 100 //rng number
        let pool = [] //drop pool

        //go over each drop and see if it is bigger than ticket with mf
        Object.keys(drops).forEach(drop => {
            let dropName = drop
            let dropMeta = drops[drop]

            //ticket drop
            if (ticket < dropMeta[0] * mf) {
                pool.push([dropName, dropMeta[0]])
            }
        })

        let temp = pool.slice(0).flat().filter(value => !isNaN(value)) //clone, flatten and filter out the non-numbers
        pool = pool.filter(drop => drop[1] == Math.min(...temp)) //choose only the lowest chance drops
        pool = utils.shuffle(pool) //random shuffle between those drops, because 

        tickets.push(ticket)

        drop(type, tier, pool[0][0], totalDrops)
    }
    return [`${data[type.toUpperCase()]} T${tier} - ${amount} runs - ${mf * 100}% MF`, JSON.stringify(Object.fromEntries(totalDrops)), Math.min(...tickets)]
}

//serve static files, put last because it interferes with wge
app.use(express.static("public"))

//create server
app.listen(port, () => console.log(`Listening at http://localhost:${port}`))

//simple capitalize word
String.prototype.capitalize = function() {
    return this.toLowerCase().replace(/_/g, " ").replace(/(^|\s)([a-z])/g, function(m, p1, p2) { return p1 + p2.toUpperCase() })
}

//transform camel into separate capitalized words -> "revenantFlesh".camel() returns "Revenant Flesh"
String.prototype.camel = function() {
    return this.replace(/[A-Z-_\&](?=[a-z0-9]+)|[A-Z-_\&]+(?![a-z0-9])/g, ' $&').trim().capitalize()
}

//pick a random number from an array of 2 numbers as an inclusive range -> [ 20, 40 ].random() returns an integer between 20 and 40 (inclusive)
Array.prototype.random = function() {
    return Math.floor(Math.random() * (Math.floor(this[1]) - Math.ceil(this[0]) + 1)) + Math.ceil(this[0])
}