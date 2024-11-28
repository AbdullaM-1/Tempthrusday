const express = require("express");
const router = express.Router();

const Controller = require("../controllers/confirmation.controller");
const validate = require("../middlewares/validateReq.middleware");
const ConfirmationValidation = require("../validators/confirmation.validator");
const CommonValidation = require("../validators/common.validator");
const authenticate = require("../middlewares/authenticate.middleware");
const Authorize = require("../middlewares/authorize.middlware");

router.post(
  "/",
  validate(ConfirmationValidation.createSchema, "BODY"),
  authenticate,
  Authorize.isUser,
  Controller.createConfirmation
);

router.get(
  "/",
  validate(CommonValidation.paginationSchema, "QUERY"),
  authenticate,
  Controller.getConfirmations
);

router.get(
  "/:id",
  validate(CommonValidation.mogooseIdSchema, "PARAM"),
  authenticate,
  Controller.getConfirmation
);

router.patch(
  "/:id",
  validate(CommonValidation.mogooseIdSchema, "PARAM"),
  validate(ConfirmationValidation.updateSchema, "BODY"),
  authenticate,
  Authorize.isUser,
  Controller.updateConfirmation
);

module.exports = router;
