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
  console.log(req.params.id);
  const index = data.findIndex((x) => x.product === req.params.id) || -1;
  if (index < 0 && index > data.length) {
    res.status(400).send(":c");
    return;
  }
  res.status(200).send(data[index]);
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
      cart.products.push({ id: product, qty });
    }

    fs.writeFileSync(
      "./backend/carts/carts.json",
      JSON.stringify(carts, null, 2)
    );

    res.status(200).send("Ok");
  } else {
    const newCart = {
      UUID: UUID,
      products: [{ id: product, qty }],
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
