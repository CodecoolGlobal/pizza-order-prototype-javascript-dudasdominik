const cart_component = ({product, cost}, qty) => 
    `
        <div class="cart-component">
            <h4>${product}</h4>
            <div>
                <br>
                <span class="cart-item">${cost}</span><span class="cart-label"> vbucks</span>
                <br>
                <span class="cart-item">${qty}</span><span class="cart-label"> pcs</span>
            </div>
            <hr>
        </div>
    `

async function fillCart() {
    const response_data = await fetch("/api/shirts");
    const data = await response_data.json();

    const response_cart = await fetch(`/api/basket/${getCookie("UUID")}`);
    const cart = await response_cart.json();
 

    const cart_container = document.getElementById("cart-container");
    cart.products.forEach(element => {
        cart_container.insertAdjacentHTML("afterbegin", cart_component(data[element.id], element.qty));
    });
}



fillCart();