import express from "express";
import { studentsDb } from "../connectDb.js";
import {ObjectId} from "mongodb";

const router = express.Router();
const collection = studentsDb.collection("students");

router.get("/", async (req, res) => {
    const results = await collection.find({}).toArray();
    res.send(results).status(200);
});

router.post("/", async (req, res) => {
    try {
        const { name, studentID } = req.body;
        if (typeof name !== "string" || !Number.isInteger(studentID)) {
            return res.status(400).send("invalid data");
        }
        const result = await collection.insertOne({
            name: name.trim(),
            studentID
        });
        res.status(201).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error adding student");
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
        res.status(500).send("error deleting student");
    }
});

router.patch("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, studentID } = req.body;
        if (!ObjectId.isValid(id)) {
            return res.status(400).send("Invalid ID");
        }
        if (typeof name !== "string" || !Number.isInteger(studentID)) {
            return res.status(400).send("invalid data");
        }
        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { name: name.trim(), studentID } }
        );
        if (result.matchedCount === 0) {
            return res.status(404).send("not found");
        }

        res.status(200).json(result);
    } catch (err) {
        res.status(500).send("error updating student");
    }
});



router.get("/browse", async (req, res) => {
    try {
        let collection = await studentsDb.collection("students");
        let query = {
            name: "Jesse",
            studentID: 1204,
        };
        let results = await collection.find(query).toArray();
        res.send(results).status(200);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error browsing students");
    }
});


export default router;

