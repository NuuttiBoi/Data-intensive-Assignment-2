import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
const API = "http://localhost:5050/student";
const Student = ({ student, editStudent, deleteStudent }) => (
    <tr>
        <td>{student.name}</td>
        <td>{student.studentID}</td>
        <td>
            <button onClick={() => editStudent(student)}>
                Edit
            </button>
            <button onClick={() => deleteStudent(student._id)}>
                Delete
            </button>
        </td>
    </tr>
);
export default function StudentList() {
    const [students, setStudents] = useState([]);
    const location = useLocation();
    const [name, setName] = useState("");
    const [studentID, setStudentID] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState("");
    async function getStudents() {
        try {
            const endpoint =
                location.pathname === "/students/browse"
                    ? `${API}/browse`
                    : API;
            const response = await fetch(endpoint);
            if (!response.ok) {
                throw new Error(
                    `An error occurred: ${response.statusText}`
                );
            }
            const students = await response.json();
            setStudents(students);
        } catch (err) {
            setError(err.message);
        }
    }
    useEffect(() => {
        getStudents();
    }, [location.pathname]);
    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        const data = {
            name,
            studentID: Number(studentID)
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
                throw new Error("Failed to save student");
            }
            setName("");
            setStudentID("");
            setEditingId(null);
            await getStudents();
        } catch (err) {
            setError(err.message);
        }
    }
    function editStudent(student) {
        setEditingId(student._id);
        setName(student.name);
        setStudentID(String(student.studentID));
    }
    async function deleteStudent(id) {
        if (!window.confirm("Delete this student?")) {
            return;
        }
        setError("");
        try {
            const response = await fetch(`${API}/${id}`, {
                method: "DELETE"
            });
            if (!response.ok) {
                throw new Error("Failed to delete student");
            }
            await getStudents();
        } catch (err) {
            setError(err.message);
        }
    }
    function studentList() {
        return students.map((student) => {
            return (
                <Student
                    student={student}
                    key={student._id}
                    editStudent={editStudent}
                    deleteStudent={deleteStudent}
                />
            );
        });
    }
    return (
        <>
            <h2>Students</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Student name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Student ID"
                    value={studentID}
                    onChange={(e) => setStudentID(e.target.value)}
                    required
                />
                <button type="submit">
                    {editingId ? "Save Changes" : "Add Student"}
                </button>
                {editingId && (
                    <button
                        type="button"
                        onClick={() => {
                            setEditingId(null);
                            setName("");
                            setStudentID("");
                        }}
                    >
                        Cancel
                    </button>
                )}
            </form>
            {error && <p role="alert">{error}</p>}
            <table>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Student ID</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {studentList()}
                </tbody>
            </table>
        </>
    );
}
