import express, { Router } from "express";
import fs, { readFileSync } from "fs";
import path from "path";

export const apis = express.Router();


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
    res.status(200).send(data[Number(req.params.id)]);
})