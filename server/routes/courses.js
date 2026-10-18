
import express from "express";
import { coursesDb } from "../connectDb.js";
import { ObjectId } from "mongodb";

const router = express.Router();
const collection = coursesDb.collection("courses");

router.get("/", async (req, res) => {
    try {
        const results = await collection.find({}).toArray();
        res.status(200).json(results);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching courses");
    }
});

router.get("/browse", async (req, res) => {
    try {
        const results = await collection.find({}).toArray();
        res.status(200).json(results);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error browsing courses");
    }
});

router.post("/", async (req, res) => {
    try {
        const { course_name, course_credits, CourseID } = req.body;

        if (
            typeof course_name !== "string" ||
            !course_name.trim() ||
            !Number.isInteger(course_credits) ||
            !Number.isInteger(CourseID)
        ) {
            return res.status(400).send("Invalid course data");
        }

        const result = await collection.insertOne({
            course_name: course_name.trim(),
            course_credits,
            CourseID
        });

        res.status(201).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error adding course");
    }
});

router.patch("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { course_name, course_credits, CourseID } = req.body;

        if (!ObjectId.isValid(id)) {
            return res.status(400).send("Invalid ID");
        }

        if (
            typeof course_name !== "string" ||
            !course_name.trim() ||
            !Number.isInteger(course_credits) ||
            !Number.isInteger(CourseID)
        ) {
            return res.status(400).send("Invalid course data");
        }

        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    course_name: course_name.trim(),
                    course_credits,
                    CourseID
                }
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).send("Course not found");
        }

        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error updating course");
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).send("Invalid ID");
        }

        const result = await collection.deleteOne({
            _id: new ObjectId(id)
        });

        if (result.deletedCount === 0) {
            return res.status(404).send("Course not found");
        }

        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting course");
    }
});

export default router;
