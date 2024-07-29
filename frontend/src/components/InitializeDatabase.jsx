import React from "react";
import axios from "axios";

const InitializeDatabase = () => {
  const initializeDatabase = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/transactions/initialize"
      );
      alert(response.data);
    } catch (error) {
      console.error(error);
      alert("Error initializing database");
    }
  };

  return (
    <div>
      <button onClick={initializeDatabase}>Initialize Database</button>
    </div>
  );
};

export default InitializeDatabase;
