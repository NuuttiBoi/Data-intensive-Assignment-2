import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import "./index.css";
import StudentList from "./components/StudentList";
import RentalCarList from "./components/RentalCarList.jsx";
import CourseList from "./components/CourseList.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "students",
                element: <StudentList />,
            },
            {
                path: "students/browse",
                element: <StudentList />,
            },
            {
                path: "rental_cars",
                element: <RentalCarList />,
            },
            {
                path: "rental_cars/browse",
                element: <RentalCarList />,
            },
            {
                path: "courses",
                element: <CourseList />,
            },
            {
                path: "courses/browse",
                element: <CourseList />,
            },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>,
);
