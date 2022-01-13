document.querySelector("form").addEventListener("submit", async e => {
    document.querySelector("div.loadingio-spinner-eclipse-rthltslkmep").style.display = "inline-block"
    document.querySelector("form").style.display = "none"
    e.preventDefault()

    //send post request with form data
    let req = await fetch("/slayer", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(Object.fromEntries(new FormData(document.querySelector("form")).entries()))
    })

    //wait for response of simulated data
    let res = await req.json()

    if (res.length == 1) {
        document.querySelector("div.loadingio-spinner-eclipse-rthltslkmep").style.display = "none"
        document.querySelector(".result").style.display = "block"
        return document.querySelector(".result fieldset h1").innerText = res[0]
    }

    console.log(res)

    //parse it
    console.log(res[1])
    let title = res[0]
    let drops = JSON.parse(res[1])
    let ticket = res[2]
    document.querySelector("div.loadingio-spinner-eclipse-rthltslkmep").style.display = "none"
    document.querySelector(".result").style.display = "block"
    Object.keys(drops).forEach(key => {
        let value = drops[key]
        document.querySelector(".result fieldset h1").innerText += `${value}x ${key}\n`
    })
})