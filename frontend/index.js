const shirt_component = ({ product, design, cost, stock }, index) => `
    <div class="shirt-component ${stock === 0? 'disabled': ''}" >
        <h3>${product}</h3>      
        <img src="${design}">
        <div>
            <h4>${cost} vbucks</h4>
            <h4>${stock} pcs in stock</h4>
        </div>
        <div>
        <input id="idx-${index}" class="cart" type="button" value="Add to Cart" ${stock === 0? 'disabled': ''}>
        <form ${stock === 0? 'disabled': ''} action="/details/details.html?" method="GET">
            <input type="hidden" name="id" value="${product}" ${stock === 0? 'disabled': ''} />
            <input class="details" type="submit" value="Details" ${stock === 0? 'disabled': ''}>
        </form >
        <div>
    </div>
`;

async function getAllShirts() {
  const shirt_container = document.querySelector(".shirt-container");
  const response = await fetch("/api/shirts");
  const shirts = await response.json();
  shirts.forEach((shirt, i) => {
    shirt_container.insertAdjacentHTML("afterbegin", shirt_component(shirt, i));
  });
  addToCartButtons();
}

function addToCartButtons() {
  const shirt_divs = [...document.getElementsByClassName("cart")];
  shirt_divs.forEach((element) => {
    element.addEventListener("click", clickCart);
  });
}

async function clickCart(e) {
  try {
    const response = await fetch('/api/basket', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(
            {
                UUID: getCookie("UUID"),
                product: Number(e.target.id.split("-")[1]),
                qty: 1
            }),
        })
        document.getElementById("cart-container").innerHTML = "";
        await fillCart();
        e.target.setAttribute("disabled", true);
        setTimeout(() => {e.target.removeAttribute("disabled")}, 1000)
  } catch {
    console.log("Something's wrong, I can feel it 😭");
  }
}
getAllShirts();



const searchbox_component = () => 
`
    <h4>Sizes</h4>
    <form class="searchForm">
    <input class="clear" type="radio" name="Size" value="XS">
    <label for="Size" > XS </label>
    <input class="clear" type="radio" name="Size" value="S">
    <label for="Size" > S </label>
    <input class="clear" type="radio" name="Size" value="M">
    <label for="Size" > M </label>
    <input class="clear" type="radio" name="Size" value="L">
    <label for="Size" > L </label>
    <input class="clear" type="radio" name="Size" value="XL">
    <label for="Size" > XL </label>
    <input class="clear" type="radio" name="Size" value="XXL">
    <label for="Size" > XXL </label>
    <input class="clear" type="radio" name="Size" value="XXXL">
    <label for="Size" > XXXL </label>
    <input class="clear" type="radio" name="Size" value="I'm fat">
    <label for="Size" > I'm fat </label>
    </form>
    <hr>
    <h4>Genders</h4>
    <form class="searchForm">
    <input class="clear" type="radio" name="Gender" value="Male">
    <label for="Gender">Male</label>
    <input class="clear" type="radio" name="Gender" value="Female">
    <label for="Gender">Female</label>
    <input class="clear" type="radio" name="Gender" value="Unisex">
    <label for="Gender">Unisex</label>
    <input class="clear" type="radio" name="Gender" value="Apache helicopter">
    <label for="Gender">Apache helicopter</label>
    </form >
    <hr>
    <h4>Type</h4>
    <form class="searchForm">
    <input class="clear" type="radio" name="Type" value="Shirt">
    <label for="Type">Not Hoodie</label>
    <input class="clear" type="radio" name="Type" value="Hoodie">
    <label for="Type">Not Shirt</label>
    </form>
    <hr>
    <input onClick=clearSelection() type="button" value="Clear Selection">
    <input onClick=search() type="button" value="Search">
    `

document.querySelector("#searchBox").insertAdjacentHTML("afterbegin", searchbox_component())

clearSelection = () => {
    console.log('a')
    const radios = [...document.getElementsByClassName("clear")];
    radios.forEach(x => {
        x.checked = false;
    })
}

function isChecked() {
    const checked = {
        size: null,
        gender: null,
        type: null
    };
    [...document.getElementsByClassName("clear")].forEach(x => {
        if (x.name === "Size" && x.checked) {
            checked.size = x.value;
        }
        if (x.name === "Gender" && x.checked) {
            checked.gender = x.value;
        }
        if (x.name === "Type" && x.checked) {
            checked.type = x.value;
        }
    })
    console.log(checked)
    return checked;
}

async function search() {
    const shirt_container = document.querySelector(".shirt-container");
    shirt_container.innerHTML = "";
    const response = await fetch("api/shirts");
    const data = await response.json();
    const checked = isChecked();
    const filteredData = data.filter(x => {
        if (checked.size === null) {
            return true
        } 
        if (x.size.includes(checked.size)) {
            return true
        }
        return false;
    })
    .filter(x => {
        if (checked.gender === null) {
            return true;
        } 
        if (x.gender === checked.gender) {
            return true;
        }
        return false;
    })
    .filter(x => {
        if(checked.type === null){
            return true;
        } 
        if(x.type === checked.type){
            return true;
        }
        return false;
    })
    filteredData.forEach((shirt, i) => {
      shirt_container.insertAdjacentHTML("afterbegin", shirt_component(shirt, i));
    });
    console.log("Results found " + filteredData.length)
    addToCartButtons();
}