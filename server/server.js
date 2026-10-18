import express from "express";
import cors from "cors";
import students from "./routes/students.js";
import courses from "./routes/courses.js";
import rentalCars from "./routes/rental_cars.js";
const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/student", students);
app.use("/courses", courses);
app.use("/rental_cars", rentalCars);
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});