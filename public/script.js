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

    //parse it
    console.log(JSON.parse(res[1]))
    document.querySelector("div.loadingio-spinner-eclipse-rthltslkmep").style.display = "none"
})