const axios = require("axios");
const Transaction = require("../models/Transaction");

const fetchAndInitialize = async (req, res) => {
  try {
    const response = await axios.get(
      "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
    );
    const transactions = response.data;

    await Transaction.deleteMany({});
    await Transaction.insertMany(transactions);

    res.status(200).send("Database initialized with seed data");
  } catch (error) {
    res.status(500).send("Error initializing database");
  }
};

const getAllTransactions = async (req, res) => {
  const { month, search, page = 1, perPage = 10 } = req.query;
  const regex = new RegExp(search, "i");
  const start = new Date(2021, month - 1, 1);
  const end = new Date(2024, month, 0);

  const query = {
    dateOfSale: { $gte: start, $lte: end },
  };

  try {
    const transactions = await Transaction.find(query)
      .skip((page - 1) * perPage)
      .limit(parseInt(perPage));

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).send("Error fetching transactions");
  }
};

const getStatistics = async (req, res) => {
  const { month } = req.query;
  const start = new Date(2000, month - 1, 1);
  const end = new Date(2024, month, 0);

  try {
    const totalSaleAmount = await Transaction.aggregate([
      { $match: { dateOfSale: { $gte: start, $lte: end } } },
      { $group: { _id: null, total: { $sum: "$price" } } },
    ]);

    const totalSoldItems = await Transaction.countDocuments({
      dateOfSale: { $gte: start, $lte: end },
      isSold: true,
    });

    const totalNotSoldItems = await Transaction.countDocuments({
      dateOfSale: { $gte: start, $lte: end },
      isSold: false,
    });

    res.status(200).json({
      totalSaleAmount: totalSaleAmount[0]?.total || 0,
      totalSoldItems,
      totalNotSoldItems,
    });
  } catch (error) {
    res.status(500).send("Error fetching statistics");
  }
};

const getBarChart = async (req, res) => {
  const { month } = req.query;
  const start = new Date(2000, month - 1, 1);
  const end = new Date(2024, month, 0);

  try {
    const priceRanges = [
      { range: "0-100", min: 0, max: 100 },
      { range: "101-200", min: 101, max: 200 },
      { range: "201-300", min: 201, max: 300 },
      { range: "301-400", min: 301, max: 400 },
      { range: "401-500", min: 401, max: 500 },
      { range: "501-600", min: 501, max: 600 },
      { range: "601-700", min: 601, max: 700 },
      { range: "701-800", min: 701, max: 800 },
      { range: "801-900", min: 801, max: 900 },
      { range: "901-above", min: 901, max: Infinity },
    ];

    const results = await Promise.all(
      priceRanges.map(async ({ range, min, max }) => {
        const count = await Transaction.countDocuments({
          dateOfSale: { $gte: start, $lte: end },
          price: { $gte: min, $lt: max },
        });

        return { range, count };
      })
    );

    res.status(200).json(results);
  } catch (error) {
    res.status(500).send("Error fetching bar chart data");
  }
};

const getPieChart = async (req, res) => {
  const { month } = req.query;
  const start = new Date(2000, month - 1, 1);
  const end = new Date(2024, month, 0);

  try {
    const categories = await Transaction.aggregate([
      { $match: { dateOfSale: { $gte: start, $lte: end } } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).send("Error fetching pie chart data");
  }
};

const getCombinedData = async (req, res) => {
  try {
    const [transactions, stats, barChart, pieChart] = await Promise.all([
      getAllTransactions(req, res),
      getStatistics(req, res),
      getBarChart(req, res),
      getPieChart(req, res),
    ]);

    res.status(200).json({ transactions, stats, barChart, pieChart });
  } catch (error) {
    res.status(500).send("Error fetching combined data");
  }
};

module.exports = {
  fetchAndInitialize,
  getAllTransactions,
  getStatistics,
  getBarChart,
  getPieChart,
  getCombinedData,
};
