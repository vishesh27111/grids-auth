import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import "../css/MatrixInput.css";

function MatrixPage () {
    const navigate = useNavigate();
    const [matrix, setMatrix] = useState(Array(5).fill(Array(5).fill("")));
    const [errors, setErrors] = useState(Array(5).fill(Array(5).fill("")));
    const [submissionError, setSubmissionError] = useState("");
    // const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

    const handleChange = (rowIdx, colIdx, value) => {
        const newMatrix = matrix.map((row, rIdx) =>
            row.map((cell, cIdx) => (rIdx === rowIdx && cIdx === colIdx ? value : cell))
        );
        setMatrix(newMatrix);

        let newErrors = errors.map(row => [...row]);
        if (!/^-?\d*\.?\d*$/.test(value)) {
            newErrors[rowIdx][colIdx] = "Only numbers allowed";
        } else {
            newErrors[rowIdx][colIdx] = "";
        }
        setErrors(newErrors);
        setSubmissionError("");
    };

    const handleSubmit = async () => {
        let valid = true;
        const newErrors = matrix.map(row => row.map(cell => {
            if (cell.trim() === "") {
                valid = false;
                return "Field cannot be empty";
            }
            else if (!/^-?\d*\.?\d*$/.test(cell)) {
                valid = false;
                return "Only numbers allowed";
            }
            return "";
        }));
        setErrors(newErrors);

        if (!valid) {
            setSubmissionError("Please ensure all fields contain only numbers and are not empty.");
            return;
        }

        try {
            const token = localStorage.getItem("authToken");
            if (!token) {
                console.error("No auth token found. User is not authenticated.");
                return;
            }
            const response = await fetch("https://node-g8h4gherfbejfqbq.eastus2-01.azurewebsites.net/storeMatrix", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token 
                },
                body: JSON.stringify({ matrix }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Matrix saved successfully:", data);
                alert("Matrix saved successfully!");
                setMatrix(Array(5).fill(Array(5).fill("")));
                setErrors(Array(5).fill().map(() => Array(5).fill("")));
                setSubmissionError("");
            } else {
                throw new Error("Failed to save matrix.");
            }
        } catch (error) {
            console.error("Error:", error);
            setSubmissionError("Error saving matrix. Please try again.");
        }
    };

    return (
        <div className="container">
            <button className="back-btn" onClick={() => navigate(-1)}>Back</button>
            <h1>Matrix Input</h1>

            <div className="matrix-container">
                {matrix.map((row, rowIndex) => (
                    <div key={rowIndex} className="matrix-row">
                        {row.map((cell, colIndex) => (
                            <div key={colIndex} className="matrix-cell">
                                <input
                                    type="text"
                                    value={cell}
                                    onChange={(e) => handleChange(rowIndex, colIndex, e.target.value)}
                                    className={errors[rowIndex][colIndex] ? "input-error" : ""}
                                />
                                {errors[rowIndex][colIndex] && <span className="error-text">{errors[rowIndex][colIndex]}</span>}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <button className="submit-btn" onClick={handleSubmit}>Submit</button>
            {submissionError && <div className="submission-error">{submissionError}</div>}

        </div>
    );
};

export default MatrixPage;