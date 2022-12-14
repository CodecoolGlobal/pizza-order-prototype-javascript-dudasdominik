
const shirt_component = ({product, design, cost, stock}, index) => `
    <div class="shirt-component" id="idx-${index}">
        <h3>${product}</h3>      
        <img src="${design}">
        <div>
            <h4>${cost} vbucks</h4>
            <h4>${stock} pcs in stock</h4>
        </div>
        <div>
        <input class="cart" type="button" value="Add to Cart">
        <form action="/details/details.html?" method="GET">
            <input type="hidden" name="id" value="${index}" />
            <input class="details" type="submit" value="Details">
        </form>
        <div>
    </div>
`

async function getAllShirts() {
    const shirt_container = document.querySelector(".shirt-container");
    const response = await fetch("/api/shirts");
    const shirts = await response.json();
    shirts.forEach((shirt, i) => {
        shirt_container.insertAdjacentHTML("afterbegin", shirt_component(shirt, i));
    });
}

getAllShirts();
