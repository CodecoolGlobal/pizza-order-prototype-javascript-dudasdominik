const size_component = (sizes) => {
    let component = "";
    sizes.forEach(element => {
        component += `<input type="radio" name="sizeSelect" value="${element} ">
                      <label for=sizeSelect>${element}</label>
        `;
    });
    console.log("<form>" + component + "</form>");
   return "<form>" + component + "</form>";
}

function fillContent(shirt) {
    document.querySelector("#design").src = shirt.design;
    document.querySelector("#product").innerText = shirt.product;
    document.querySelector("#sizes").innerHTML = size_component(shirt.size);
    document.querySelector("#material").innerText = shirt.material.join(", ");
    document.querySelector("#cost").innerText = shirt.cost;
    document.querySelector("#stock").innerText = shirt.stock;
    document.querySelector("#type").innerText = shirt.type;
    document.querySelector("#gender").innerText = shirt.gender;
    
}

async function getShirtData() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    console.log(urlParams.get("id"))
    const response = await fetch(`/api/shirts/${urlParams.get("id")}`);
    const shirt = await response.json();
    document.title = `⭐ Shirt ⁓ ${shirt.product}`
    fillContent(shirt);
}

document.querySelector("#order-minus").addEventListener("click", () => {
    document.querySelector("#order-num").value = parseInt(document.querySelector("#order-num").value) - 1;
    if (Number(document.querySelector("#order-num").value - 1) < 1) {
        document.querySelector("#order-num").value = 1;
        document.querySelector("#order-minus").setAttribute("disabled", "disabled");
    } else {
        document.querySelector("#order-plus").removeAttribute("disabled");
    }
})

document.querySelector("#order-plus").addEventListener("click", async function(e) {
    document.querySelector("#order-num").value = parseInt(document.querySelector("#order-num").value) + 1;
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const response = await fetch(`/api/shirts/${urlParams.get("id")}`);
    const shirt = await response.json();
    if (Number(document.querySelector("#order-num").value) + 1 > shirt.stock) {
        document.querySelector("#order-num").value = shirt.stock;
        document.querySelector("#order-plus").setAttribute("disabled", "disabled");
    } else {
        document.querySelector("#order-minus").removeAttribute("disabled");
    }
})


getShirtData();
document.querySelector("#order-minus").setAttribute("disabled", "disabled");