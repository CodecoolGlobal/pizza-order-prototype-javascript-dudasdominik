async function getData() {
    const response = await fetch(`/api/admin/${getCookie("UUID")}`);
    const purchases = await response.json();
    fillTable(purchases);
}

const table_component = (data) =>   {    
    return (`
    <tr>
        <td>${data.cart.UUID}</td>
        <td>${data.form.customer.name}</td>
        <td>${JSON.stringify(data.cart.products.map(x => x.id))}</td>
        <td>${data.cart.products.reduce((x,y) => x += y.qty, 0)}</td>
        <td>${data.totalCost}</td>
        <td>${data.form.date.year}.${data.form.date.month}.${data.form.date.day} ${data.form.date.hour}:${data.form.date.minute}</td>
        <td>${data.form.customer.address.city}, ${data.form.customer.address.street}</td>
    </tr>
`)}

function fillTable(purchases) {
    purchases.forEach(element => {
        document.querySelector("table").insertAdjacentHTML("beforeend", table_component(element))
    });
}


getData();

function start() {
    setTimeout(_ => {
        document.querySelector("table").innerHTML = "";
        document.querySelector("table").insertAdjacentHTML("beforeend", `<tr>
        <th>UUID</th>
        <th>Name</th>
        <th>Products</th>
        <th>Total Quantity</th>
        <th>Total Price</th>
        <th>Date</th>
        <th>Location</th>
      </tr>`)
        getData();
        start();
    }, 3000);
}
start();