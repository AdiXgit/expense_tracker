import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Typography,
  TextField,
  Card,
  CardContent,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [filter, setFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("asc"); // State for sorting

  // Fetch expenses from the backend
  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/expenses/yourUserId",
        { headers: { Authorization: token } }
      );
      setExpenses(response.data);
    } catch (err) {
      console.error("Failed to fetch expenses");
    }
  };

  // Add a new expense
  const addExpense = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/expenses",
        { amount, category, description },
        { headers: { Authorization: token } }
      );
      setAmount("");
      setCategory("");
      setDescription("");
      fetchExpenses();
    } catch (err) {
      console.error("Failed to add expense");
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Filter and sort expenses
  const filteredExpenses = filter
    ? expenses.filter((expense) =>
        expense.category.toLowerCase().includes(filter.toLowerCase())
      )
    : expenses;

  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    if (sortOrder === "asc") return a.amount - b.amount;
    if (sortOrder === "desc") return b.amount - a.amount;
    return 0;
  });

  // Chart data preparation
  const categoryData = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + parseFloat(expense.amount);
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        label: "Expenses by Category",
        data: Object.values(categoryData),
        backgroundColor: ["#ff6384", "#36a2eb", "#ffce56", "#4caf50", "#ab47bc"],
        hoverBackgroundColor: ["#ff6384", "#36a2eb", "#ffce56", "#4caf50", "#ab47bc"],
      },
    ],
  };

  return (
    <div className="container">
      <Typography variant="h4" gutterBottom className="title">
        Dashboard
      </Typography>

      {/* Add Expense Form */}
      <form onSubmit={addExpense} style={{ marginBottom: 20 }}>
        <TextField
          label="Amount"
          fullWidth
          margin="normal"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <TextField
          label="Category"
          fullWidth
          margin="normal"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <TextField
          label="Description"
          fullWidth
          margin="normal"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Add Expense
        </Button>
      </form>

      {/* Filter and Sort */}
      <TextField
        label="Filter by Category"
        fullWidth
        margin="normal"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <FormControl fullWidth style={{ margin: "20px 0" }}>
        <InputLabel>Sort by Amount</InputLabel>
        <Select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <MenuItem value="asc">Ascending</MenuItem>
          <MenuItem value="desc">Descending</MenuItem>
        </Select>
      </FormControl>

      {/* Expenses List */}
      <Typography variant="h5" gutterBottom>
        Expenses
      </Typography>
      <ul className="expense-list">
        {sortedExpenses.map((expense) => (
          <li key={expense._id} className="expense-item">
            <span>{expense.category}</span>
            <span>${expense.amount}</span>
          </li>
        ))}
      </ul>

      {/* Expense Distribution Chart */}
      <Card>
        <CardContent>
          <Typography variant="h6">Expense Distribution</Typography>
          <Pie data={chartData} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
