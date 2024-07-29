import React, { useState } from "react";
import TransactionsTable from "./components/TransactionsTable";
import TransactionsStats from "./components/TransactionsStats";
import TransactionsBarChart from "./components/TransactionsBarChart";
import TransactionsPieChart from "./components/TransactionsPieChart";
import InitializeDatabase from "./components/InitializeDatabase";
import "./App.css";

const App = () => {
  const [month, setMonth] = useState(3); // Default to March
  const [search, setSearch] = useState("");

  return (
    <div className="App">
      <header>
        <h1>Transactions Dashboard</h1>
      </header>
      <InitializeDatabase />
      <div className="controls">
        <label>
          Select Month:
          <select
            value={month}
            onChange={(e) => setMonth(parseInt(e.target.value))}
          >
            <option value={1}>January</option>
            <option value={2}>February</option>
            <option value={3}>March</option>
            <option value={4}>April</option>
            <option value={5}>May</option>
            <option value={6}>June</option>
            <option value={7}>July</option>
            <option value={8}>August</option>
            <option value={9}>September</option>
            <option value={10}>October</option>
            <option value={11}>November</option>
            <option value={12}>December</option>
          </select>
        </label>
        <label>
          Search Transactions:
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
      </div>
      <TransactionsTable month={month} search={search} />
      <TransactionsStats month={month} />
      <TransactionsBarChart month={month} />
      <TransactionsPieChart month={month} />
    </div>
  );
};

export default App;
