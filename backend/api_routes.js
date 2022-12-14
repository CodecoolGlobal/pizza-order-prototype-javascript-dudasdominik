import express, { Router } from "express";
import fs, { readFileSync } from "fs";
import path from "path";

import { validate as uuidValidate } from 'uuid'
import { v4 as uuidv4 } from 'uuid';

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
    console.log(req.params.id)
    const index = data.findIndex(x => x.product === req.params.id) || -1
    if (index < 0 && index > data.length){
        res.status(400).send(":c");
        return;
    }
    res.status(200).send(data[index]);
});

apis.get("/generate/uuid", (req, res) => {
    res.status(200).send(uuidv4());
});

apis.post("/basket", (req, res) => {
    console.log("uwu")
    const products = JSON.parse(fs.readFileSync("backend/data.json"));
    if (!Object.keys(req.body).every(x => ["UUID", "product", "qty"].includes(x))) {
        console.log("sajt")
        res.status(400).send("Something's wrong, I can feel it 😭");
        return
    }
    if (!uuidValidate(req.body.UUID)) {
        console.log("kondenzator")
        res.status(400).send("Wrong UUID 😭");
        return
    }
    if (products.length < req.body.product || req.body.product < 0) {
        console.log("generator")
        res.status(400).send("Wrong product ID 😭");
        return
    }
    if (products[Number(req.body.product)].stock < req.body.qty || req.body.qty < 0) {
        console.log("terminator")
        res.status(400).send("Not enough stock 😭");
        return
    }
    const basket = JSON.parse(fs.readFileSync("backend/carts/carts.json"));
    
    // Ha a UUID meg nincs benne a BASKET-ben
    if (!basket.some(x => x.UUID === req.body.UUID)) {
        basket.push({
            "UUID":req.body.UUID,
            "products": [
                {
                    "id":req.body.product,
                    "qty":req.body.qty
                }
            ]
        })
    } else { // Ha a UUID mar benne van a BASKET-ben
        const basketID = basket.findIndex(x => x.UUID === req.body.UUID)
        let shirtID = -1;
        basket[basketID].products.forEach((e, i) => {
            if (Number(e.id) === Number(req.body.product)) {
                shirtID = i;
            }
        });

        if (shirtID > 0){
            console.log("Mar benne volt")
            basket[basketID].products[shirtID].qty++;            
        } else {
            console.log("Meg nem volt benne")
            basket[basketID].products.push({
                "id": req.body.product,
                "qty": req.body.qty
            })
        }
    }
    fs.writeFileSync("backend/carts/carts.json", JSON.stringify(basket));

    res.status(200).send("ok")
})

apis.get("/basket/:UUID", (req, res) => {

    const basket = JSON.parse(fs.readFileSync("backend/carts/carts.json"));
    if (!basket.some(x => x.UUID === req.params.UUID)) {
        res.status(400).send("Something's wrong, I can feel it 😭");
        return
    }

    const basketID = basket.findIndex(x => x.UUID === req.params.UUID)
    res.status(200).send(JSON.stringify(basket[basketID]));
})
