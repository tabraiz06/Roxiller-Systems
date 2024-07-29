import React, { useState, useEffect } from "react";
import axios from "axios";

const TransactionsStats = ({ month }) => {
  const [stats, setStats] = useState({
    totalSaleAmount: 0,
    totalSoldItems: 0,
    totalNotSoldItems: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `http://localhost:5000/api/transactions/statistics`,
        {
          params: { month },
        }
      );

      setStats(response.data);
    };

    fetchData();
  }, [month]);

  return (
    <div>
      <h3>Total Sale Amount: {stats.totalSaleAmount}</h3>
      <h3>Total Sold Items: {stats.totalSoldItems}</h3>
      <h3>Total Not Sold Items: {stats.totalNotSoldItems}</h3>
    </div>
  );
};

export default TransactionsStats;
