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

getShirtData();
