const fillItemContent = ({design, product, cost}, {qty, id}) => `
    <div class="items">
        <img src=${design}></img>
        <div>
            <h3>${product}</h3>
            <h4>${cost} vbucks</h4>
            <h4>${qty} piece</h4>
        </div>
        <h5>${cost * qty}</h5> 
        <a id="del-${id}" class="delete">❌</a>
    </div>
    <hr>
`
const fillCheckoutMenu = () => `
   <form>
   <input id="name"class="inputs" type="text" placeholder="Name">
   <input id="email"class="inputs" type="email" placeholder="Email address">
   <input type="submit" hidden>
   <input id="city"class="inputs" type="text" placeholder="City">
   <input id="street"class="inputs" type="text" placeholder="Street">
   <input id="checkout" onclick=checkoutListener() type="button" disabled value="Press to Checkout">
   </form>
`

async function doTheFill() {
    const response_basket = await fetch(`/api/basket/${getCookie("UUID")}`);
    const basket = await response_basket.json();
    const response_data = await fetch("/api/shirts");
    const data = await response_data.json();

    const cart_content = document.querySelector(".cart-content");
    
    let sumTotal = 0;

    basket.products.forEach(element => {
        cart_content.insertAdjacentHTML("afterbegin", fillItemContent(data[element.id], element));
        sumTotal += data[element.id].cost * element.qty
    });
    cart_content.insertAdjacentHTML("beforeend", `<h1>Total: ${sumTotal} vbucks</h1>`);
    document.querySelector('.checkout-content').insertAdjacentHTML("afterbegin",fillCheckoutMenu());
    document.querySelectorAll('.inputs').forEach(element => {
        console.log('a')
        element.addEventListener('input', (e) => {
            if(![...document.querySelectorAll('.inputs')].map((x) => x.value !== '').every((x)=> x)){
                document.getElementById('checkout').setAttribute('disabled','disabled')
            }else{
                document.getElementById('checkout').removeAttribute('disabled')
            }
    
        })
    })
    assignDelete();
}

function assignDelete() {
    document.querySelectorAll(".delete").forEach(x => {
        x.addEventListener("click", deleteFromCart)
    })
}

async function deleteFromCart (e) {
    await fetch(`/api/basket/${getCookie("UUID")}/${e.target.id.split("-")[1]}`, {method: "DELETE"})
    document.querySelector(".cart-content").innerHTML = "";
    document.querySelector(".checkout-content").innerHTML = "";
    doTheFill();
}

async function checkoutListener (e) {
    console.log("hello")
    const inputs = document.querySelectorAll(".inputs");
    currentTime = new Date();
    const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    const response = await fetch(`/api/purchase/${getCookie("UUID")}`, {
        method: "POST", 
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        body: JSON.stringify({ 
            date: {
                year: currentTime.getFullYear(),
               month: month[currentTime.getMonth()],
               day: currentTime.getDate(),
               hour: currentTime.getHours(),
               minute: currentTime.getMinutes()
              },
              customer: {
                name: inputs[0].value,
                email: inputs[1].value,
                address: {
                  city: inputs[2].value,
                  street: inputs[3].value,
                }
              }
    })})
    if (!response.ok) {
        alert("Something went wrong!");
    }
    document.querySelector(".cart-content").innerHTML = "";
    document.querySelector(".checkout-content").innerHTML = "";
    doTheFill();
    
}


doTheFill();
