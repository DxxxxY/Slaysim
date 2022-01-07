require("dotenv").config()
const express = require("express")
const { get } = require("axios")
const data = require("./data.json")
const path = require("path")
const wge = require("wge")
const utils = require("./utils")
const version = require("./package.json").version
const app = express()
const port = process.env.PORT || 80

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get("/", (req, res) => {
    res.send(wge.render(path.join(__dirname, "public/index.html"), { version }))
})

app.post("/slayer", async(req, res) => {
    minecraftID = await (await get(`https://api.minetools.eu/uuid/${req.body.username}`)).data.id
    if (!minecraftID) return res.send("This IGN could not be resolved")
    let profiles = await (await get(`https://api.hypixel.net/skyblock/profiles?key=${process.env.APIKEY}&uuid=${minecraftID}`)).data.profiles
    let profile = await (await get(`https://api.hypixel.net/skyblock/profile?key=${process.env.APIKEY}&profile=${utils.getLatestProfile(profiles, minecraftID)[0].profile_id}`)).data.profile
    let name = req.body.username
    let user = profile.members[minecraftID]

    let stats = {
        xpBuff: 0,
        priceOff: 0,
        zombie: [],
        spider: [],
        wolf: [],
        enderman: []
    }

    // Object.keys(user.slayer_bosses).forEach(boss => {
    //     //calc global xp buff
    //     let slayer = user.slayer_bosses[boss]
    //     for (let i = 0; i <= 2; i++) {
    //         if (slayer.hasOwnProperty(`boss_kills_tier_${i}`)) stats.xpBuff += 0.01 //t1 - t3
    //     }
    //     if (slayer.hasOwnProperty(`boss_kills_tier_3`)) stats.xpBuff += 0.02 //t4

    //     //calc level
    //     if (!slayer.hasOwnProperty("xp")) return
    //     let need = JSON.parse(JSON.stringify(data))[boss]

    //     //get level and progress to next
    //     for (let x in need) {
    //         if (slayer.xp < need[x]) { //if xp is lower than cumulative, we found the level
    //             stats[boss] = [+x, slayer.xp]
    //             break
    //         }
    //     }
    // })

    // if (stats.zombie[0] >= 7 && stats.spider[0] >= 7 && stats.wolf[0] >= 7 && stats.enderman[0] >= 7) stats.priceOff += 0.04

    // Object.keys(stats).forEach(e => {
    //     console.log(e, stats[e])
    // })

    // let page = wge.render(path.join(__dirname, "public/slaysim.html"), { name })
    // res.send(page)
    console.log(req.body)
    res.send("bruh")
})

app.use(express.static("public"))

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
})