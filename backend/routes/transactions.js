const express = require("express");
const {
  fetchAndInitialize,
  getAllTransactions,
  getStatistics,
  getBarChart,
  getPieChart,
  getCombinedData,
} = require("../controllers/transactionsController");

const router = express.Router();

router.get("/initialize", fetchAndInitialize);
router.get("/", getAllTransactions);
router.get("/statistics", getStatistics);
router.get("/bar-chart", getBarChart);
router.get("/pie-chart", getPieChart);
router.get("/combined", getCombinedData);

module.exports = router;
