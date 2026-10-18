import express from "express";
import {rentalCarsDb} from "../connectDb.js";
import {ObjectId} from "mongodb";

const router = express.Router();
const collection = rentalCarsDb.collection("rental_cars");

router.get("/", async (req, res) => {
    try {
        const collection = rentalCarsDb.collection("rental_cars");
        const results = await collection.find({}).toArray();

        res.status(200).send(results);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching rental cars");
    }
});

router.post("/", async (req, res) => {
    try {
        const { car_make, car_model, car_year } = req.body;
        if (typeof car_make !== "string" || typeof car_model !== "string") {
            return res.status(400).send("invalid data");
        }
        const result = await collection.insertOne({
            car_make: car_make.trim(),
            car_model: car_model.trim(),
            car_year: String(car_year)
        });
        res.status(201).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error adding car");
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        if (!ObjectId.isValid(id)) {
            return res.status(400).send("invalid ID");
        }
        const result = await collection.deleteOne({
            _id: new ObjectId(id)
        });
        if (result.deletedCount === 0) {
            return res.status(404).send("not found");
        }
        res.status(200).json(result);
    } catch (err) {
        res.status(500).send("error deleting car");
    }
});

router.patch("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { car_make, car_model, car_year } = req.body;
        if (!ObjectId.isValid(id)) {
            return res.status(400).send("Invalid ID");
        }
        if (typeof car_make !== "string" || typeof car_model !== "string") {
            return res.status(400).send("invalid data");
        }
        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    car_make: car_make.trim(),
                    car_model: car_model.trim(),
                    car_year: String(car_year)
                }
            }
        );
        if (result.matchedCount === 0) {
            return res.status(404).send("not found");
        }

        res.status(200).json(result);
    } catch (err) {
        res.status(500).send("error updating car");
    }
});
router.get("/browse", async (req, res) => {
    try {
        const query = { car_make: "Toyota" };
        const results = await collection.find(query).toArray();

        res.status(200).json(results);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error browsing rental cars");
    }
});

export default router;
