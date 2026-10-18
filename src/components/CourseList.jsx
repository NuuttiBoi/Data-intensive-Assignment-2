
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const API = "http://localhost:5050/courses";

const Course = ({ course, editCourse, deleteCourse }) => (
    <tr>
        <td>{course.course_name}</td>
        <td>{course.course_credits}</td>
        <td>{course.CourseID}</td>
        <td>
            <button onClick={() => editCourse(course)}>
                Edit
            </button>
            <button onClick={() => deleteCourse(course._id)}>
                Delete
            </button>
        </td>
    </tr>
);

export default function CourseList() {
    const [courses, setCourses] = useState([]);
    const location = useLocation();

    const [courseName, setCourseName] = useState("");
    const [courseCredits, setCourseCredits] = useState("");
    const [courseID, setCourseID] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState("");

    async function getCourses() {
        try {
            const endpoint =
                location.pathname === "/courses/browse"
                    ? `${API}/browse`
                    : API;

            const response = await fetch(endpoint);

            if (!response.ok) {
                throw new Error(await response.text());
            }

            setCourses(await response.json());
        } catch (err) {
            setError(err.message);
        }
    }

    useEffect(() => {
        getCourses();
    }, [location.pathname]);

    function resetForm() {
        setCourseName("");
        setCourseCredits("");
        setCourseID("");
        setEditingId(null);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        const data = {
            course_name: courseName,
            course_credits: Number(courseCredits),
            CourseID: Number(courseID)
        };

        const url = editingId
            ? `${API}/${editingId}`
            : API;

        const method = editingId ? "PATCH" : "POST";

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(await response.text());
            }

            resetForm();
            await getCourses();
        } catch (err) {
            setError(err.message);
        }
    }

    function editCourse(course) {
        setEditingId(course._id);
        setCourseName(course.course_name);
        setCourseCredits(String(course.course_credits));
        setCourseID(String(course.CourseID));
    }

    async function deleteCourse(id) {
        if (!window.confirm("Delete this course?")) {
            return;
        }

        setError("");

        try {
            const response = await fetch(`${API}/${id}`, {
                method: "DELETE"
            });

            if (!response.ok) {
                throw new Error(await response.text());
            }

            await getCourses();
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <>
            <h2>Courses</h2>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Course name"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    required
                />

                <input
                    type="number"
                    placeholder="Course credits"
                    value={courseCredits}
                    onChange={(e) => setCourseCredits(e.target.value)}
                    min="0"
                    step="1"
                    required
                />

                <input
                    type="number"
                    placeholder="Course ID"
                    value={courseID}
                    onChange={(e) => setCourseID(e.target.value)}
                    step="1"
                    required
                />
                <button type="submit">
                    {editingId ? "Save Changes" : "Add Course"}
                </button>
                {editingId && (
                    <button type="button" onClick={resetForm}>
                        Cancel
                    </button>
                )}
            </form>
            {error && <p role="alert">{error}</p>}
            <table>
                <thead>
                <tr>
                    <th>Course name</th>
                    <th>Course credits</th>
                    <th>Course ID</th>
                    <th>Actions</th>
                </tr>
                </thead>

                <tbody>
                {courses.map((course) => (
                    <Course
                        key={course._id}
                        course={course}
                        editCourse={editCourse}
                        deleteCourse={deleteCourse}
                    />
                ))}
                </tbody>
            </table>
        </>
    );
}
