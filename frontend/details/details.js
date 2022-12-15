const size_component = (sizes) => {
  let component = "";
  console.log(sizes)
  sizes.forEach((element) => { 
    component += `<input type="radio" name="sizeSelect" value="${element} ">
                      <label for=sizeSelect>${element}</label>
        `;
  });
  return "<form>" + component + "</form>";
};

function fillContent(shirt) {
  document.querySelector("#design").src = shirt.design;
  document.querySelector("#product").innerText = shirt.product;
  document.querySelector("#sizes").innerHTML = size_component(shirt.size);
  document.querySelector("#material").innerText = shirt.data.material.join(", ");
  document.querySelector("#cost").innerText = shirt.cost;
  document.querySelector("#stock").innerText = shirt.stock;
  document.querySelector("#type").innerText = shirt.type;
  document.querySelector("#gender").innerText = shirt.gender;
}

async function getShirtData() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  console.log(urlParams.get("id"));
  const response = await fetch(`/api/shirts/${urlParams.get("id")}`);
  const { data } = await response.json();
  console.log(data)
  document.title = `⭐ Shirt ⁓ ${data.product}`;
  fillContent(data);
}

document.querySelector("#order-minus").addEventListener("click", () => {
  document.querySelector("#order-num").value =
    parseInt(document.querySelector("#order-num").value) - 1;
  if (Number(document.querySelector("#order-num").value - 1) < 1) {
    document.querySelector("#order-num").value = 1;
    document.querySelector("#order-minus").setAttribute("disabled", "disabled");
  } else {
    document.querySelector("#order-plus").removeAttribute("disabled");
  }
});

document
  .querySelector("#order-plus")
  .addEventListener("click", async function (e) {
    document.querySelector("#order-num").value =
      parseInt(document.querySelector("#order-num").value) + 1;
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const response = await fetch(`/api/shirts/${urlParams.get("id")}`);
    const shirt = await response.json();
    if (Number(document.querySelector("#order-num").value) + 1 > shirt.stock) {
      document.querySelector("#order-num").value = shirt.stock;
      document
        .querySelector("#order-plus")
        .setAttribute("disabled", "disabled");
    } else {
      document.querySelector("#order-minus").removeAttribute("disabled");
    }
  });

async function clickCart(e) {
  try {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const response_data = await fetch(`/api/shirts/${urlParams.get("id")}`);
    const { index } = await response_data.json();
    const response = await fetch("/api/basket", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        UUID: getCookie("UUID"),
        product: Number(index),
        qty: Number(document.querySelector("#order-num").value),
      }),
    });
    document.getElementById("cart-container").innerHTML = "";
    await fillCart();
    e.target.setAttribute("disabled", true);
    setTimeout(() => {
      e.target.removeAttribute("disabled");
    }, 1000);
  } catch {
    console.log("Something's wrong, I can feel it 😭");
  }
}

document.querySelector("#add-shirts").addEventListener("click", clickCart);

getShirtData();
document.querySelector("#order-minus").setAttribute("disabled", "disabled");
