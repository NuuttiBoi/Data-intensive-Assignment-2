
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const API = "http://localhost:5050/rental_cars";

const RentalCar = ({ rental_car, editRentalCar, deleteRentalCar }) => (
    <tr>
        <td>{rental_car.car_make}</td>
        <td>{rental_car.car_model}</td>
        <td>{rental_car.car_year}</td>
        <td>
            <button onClick={() => editRentalCar(rental_car)}>
                Edit
            </button>
            <button onClick={() => deleteRentalCar(rental_car._id)}>
                Delete
            </button>
        </td>
    </tr>
);

export default function RentalCarList() {
    const [rentalCars, setRentalCars] = useState([]);
    const location = useLocation();

    const [carMake, setCarMake] = useState("");
    const [carModel, setCarModel] = useState("");
    const [carYear, setCarYear] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState("");

    async function getRentalCars() {
        try {
            const endpoint =
                location.pathname === "/rental_cars/browse"
                    ? `${API}/browse`
                    : API;

            const response = await fetch(endpoint);

            if (!response.ok) {
                throw new Error(
                    `An error occurred: ${response.statusText}`
                );
            }

            const rentalCars = await response.json();
            setRentalCars(rentalCars);
        } catch (err) {
            setError(err.message);
        }
    }

    useEffect(() => {
        getRentalCars();
    }, [location.pathname]);

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        const data = {
            car_make: carMake,
            car_model: carModel,
            car_year: carYear
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

            setCarMake("");
            setCarModel("");
            setCarYear("");
            setEditingId(null);

            await getRentalCars();
        } catch (err) {
            setError(err.message);
        }
    }

    function editRentalCar(rentalCar) {
        setEditingId(rentalCar._id);
        setCarMake(rentalCar.car_make);
        setCarModel(rentalCar.car_model);
        setCarYear(String(rentalCar.car_year));
    }

    async function deleteRentalCar(id) {
        if (!window.confirm("Delete this car?")) {
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

            await getRentalCars();
        } catch (err) {
            setError(err.message);
        }
    }

    function rentalCarList() {
        return rentalCars.map((rental_car) => (
            <RentalCar
                rental_car={rental_car}
                key={rental_car._id}
                editRentalCar={editRentalCar}
                deleteRentalCar={deleteRentalCar}
            />
        ));
    }

    return (
        <>
            <h2>Rental Cars</h2>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Car make"
                    value={carMake}
                    onChange={(e) => setCarMake(e.target.value)}
                    required
                />

                <input
                    type="text"
                    placeholder="Car model"
                    value={carModel}
                    onChange={(e) => setCarModel(e.target.value)}
                    required
                />

                <input
                    type="number"
                    placeholder="Car year"
                    value={carYear}
                    onChange={(e) => setCarYear(e.target.value)}
                    required
                />

                <button type="submit">
                    {editingId ? "Save Changes" : "Add rental car"}
                </button>

                {editingId && (
                    <button
                        type="button"
                        onClick={() => {
                            setEditingId(null);
                            setCarMake("");
                            setCarModel("");
                            setCarYear("");
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
                    <th>Car make</th>
                    <th>Car model</th>
                    <th>Car year</th>
                    <th>Actions</th>
                </tr>
                </thead>

                <tbody>
                {rentalCarList()}
                </tbody>
            </table>
        </>
    );
}
