const express = require("express");
const router = express.Router();

const Controller = require("../controllers/receipt.controller");
const validate = require("../middlewares/validateReq.middleware");
const CommonValidation = require("../validators/common.validator");
const authenticate = require("../middlewares/authenticate.middleware");

router.get(
  "/",
  validate(CommonValidation.paginationSchema, "QUERY"),
  authenticate,
  Controller.getReceipts
);

router.get(
  "/:id",
  validate(CommonValidation.mogooseIdSchema, "PARAM"),
  validate(CommonValidation.paginationSchema, "QUERY"),
  authenticate,
  Controller.getReceipt
);

module.exports = router;
