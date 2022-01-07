document.querySelector("form").addEventListener("submit", async e => {
    document.querySelector("div.loadingio-spinner-eclipse-rthltslkmep").style.display = "inline-block"
    document.querySelector("form").style.display = "none"
    e.preventDefault()
    let req = await fetch("/slayer", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(Object.fromEntries(new FormData(document.querySelector("form")).entries()))
    })
    let res = await req.text()
    console.log(res)
    document.querySelector("div.loadingio-spinner-eclipse-rthltslkmep").style.display = "none"
})