import express, { Router } from "express";
import fs, { readFileSync } from "fs";
import path from "path";

import { validate as uuidValidate } from "uuid";
import { v4 as uuidv4 } from "uuid";

export const apis = express.Router();

apis.use(express.json());

apis.get("/shirts", (req, res) => {
  const data = JSON.parse(fs.readFileSync("backend/data.json"));
  res.status(200).send(data);
});

apis.get("/sizes", (req, res) => {
  const data = JSON.parse(fs.readFileSync("backend/sizes.json"));
  res.status(200).send(data);
});

apis.get("/materials", (req, res) => {
  const data = JSON.parse(fs.readFileSync("backend/materials.json"));
  res.status(200).send(data);
});

apis.get("/shirts/:id", (req, res) => {
  const data = JSON.parse(fs.readFileSync("backend/data.json"));
  const index = data.findIndex((x) => x.product == req.params.id);
  if (index < 0 && index > data.length) {
    res.status(400).send(":c");
    return;
  }
  console.log(data[index] + " " + index)
  res.status(200).send({data: data[index], index: index});
});

apis.get("/generate/uuid", (req, res) => {
  res.status(200).send(uuidv4());
});

apis.post("/basket", (req, res) => {
  const { UUID, product, qty } = req.body;

  const data = fs.readFileSync("./backend/carts/carts.json");

  const carts = JSON.parse(data);
  const cart = carts.find((cart) => cart.UUID === UUID);

  if (cart) {
    const existingProduct = cart.products.find((item) => item.id === product);
    if (existingProduct) {
      existingProduct.qty += qty;
    } else {
      cart.products.push({ id: Number(product), qty });
    }

    fs.writeFileSync(
      "./backend/carts/carts.json",
      JSON.stringify(carts, null, 2)
    );

    res.status(200).send("Ok");
  } else {
    const newCart = {
      UUID: UUID,
      products: [{ id: Number(product), qty }],
    };
    carts.push(newCart);

    fs.writeFileSync(
      "./backend/carts/carts.json",
      JSON.stringify(carts, null, 2)
    );

    res.status(200).send("Ok");
  }
});

apis.get("/basket/:UUID", (req, res) => {
  const basket = JSON.parse(fs.readFileSync("backend/carts/carts.json"));
  if (!basket.some((x) => x.UUID === req.params.UUID)) {
    res.status(400).send("Something's wrong, I can feel it 😭");
    return;
  }

  const basketID = basket.findIndex((x) => x.UUID === req.params.UUID);
  res.status(200).send(JSON.stringify(basket[basketID]));
});


apis.delete("/basket/:UUID/:product", (req, res) =>{
  const carts = JSON.parse(fs.readFileSync("./backend/carts/carts.json"));
  const cartIndex = carts.findIndex((cart) => cart.UUID == req.params.UUID);
  const cart = carts.find((cart) => cart.UUID === req.params.UUID);
  let index = cart.products.findIndex((x, i) => x.id == req.params.product)
  cart.products.splice(index, 1);
  carts[cartIndex] = cart;

  fs.writeFileSync("backend/carts/carts.json/", JSON.stringify(carts))
  res.sendStatus(200, "OK");
})

apis.post("/purchase/:UUID",(req, res) => {
  // ALL DATA
  const carts = JSON.parse(fs.readFileSync("./backend/carts/carts.json"));
  const cart = carts.find((cart) => cart.UUID == req.params.UUID);
  const cartIndex = carts.findIndex((cart) => cart.UUID == req.params.UUID);
  const data = JSON.parse(fs.readFileSync("backend/data.json"));
  const form = req.body;

  if (carts[cartIndex].products.length === 0) {
    res.sendStatus(400, "Cart Empty");
    return;
  }

  for (const element of cart.products) {
    if(data[element.id].stock - element.qty < 0) {
      res.sendStatus(400, "Stock is too low!");
      return;
    }
  }
  for (const element of cart.products) {
    data[element.id].stock -= element.qty;
  }

  // Update Stock
  fs.writeFileSync("backend/data.json", JSON.stringify(data));

  // Get Total price
  const sumPrice = cart.products.reduce((x, y) => x += data[y.id].cost * y.qty, 0)

  // Add data to pusrchased JSON
  const purchases = JSON.parse(fs.readFileSync("./backend/carts/purchased.json"));
  purchases.push({
    cart: cart, 
    form: form,
    totalCost: sumPrice
  })
  fs.writeFileSync("./backend/carts/purchased.json", JSON.stringify(purchases))

  // Clear Basket
  carts[cartIndex].products = []
  fs.writeFileSync("./backend/carts/carts.json", JSON.stringify(carts))

  res.sendStatus(200, "Ok")
})

apis.get("/admin/:UUID", (req, res) => {
  if (!["b54b05cc-34ca-4f17-83cf-5f901047c91d", "5956f306-8a2b-4724-bf18-786b4dfb5d27", "f59734f7-a801-4eca-bc97-1d74b7fcffed"].includes(req.params.UUID)){
    res.sendStatus(400, "You don't have access!");
    return;
  }
  const purchases = JSON.parse(fs.readFileSync("./backend/carts/purchased.json"));
  res.status(200).send(purchases);
})