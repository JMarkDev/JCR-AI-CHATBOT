const { body, validationResult } = require("express-validator");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateEmail = () => {
  return body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Enter a valid email address (e.g. sample@gmail.com).")
    .custom((value) => {
      // Allow only specific domains
      const allowedDomains = [
        "gmail.com",
        "yahoo.com",
        "outlook.com",
        "protonmail.com",
      ];
      const domain = value.split("@")[1]; // Extract domain from email

      if (!allowedDomains.includes(domain)) {
        throw new Error(
          `Invalid email domain. Allowed: ${allowedDomains.join(", ")}`
        );
      }
      return true;
    });
};
const validatePassword = () => {
  return body("password").custom((value) => {
    if (!value) {
      throw new Error("Password is required");
    }
    if (value.length < 8) {
      throw new Error("Password must be at least 8 characters long");
    }
    return true;
  });
};

const validateForgotPassword = () => {
  return [
    body("password").custom((value) => {
      if (!value) {
        throw new Error("Password is required");
      }
      if (value.length < 8) {
        throw new Error("Password must be at least 8 characters long");
      }
      return true;
    }),
    body("confirmPassword").custom((value, { req }) => {
      if (!value) {
        throw new Error("Confirm password is required");
      }
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
  ];
};

const validateRequiredField = (fieldName) => {
  const fieldNameWithSpaces = fieldName
    .replace(/([A-Z])/g, " $1") // Add a space before each uppercase letter
    .replace(/^./, (str) => str.toUpperCase()); // Capitalize the first letter

  return body(fieldName)
    .trim()
    .notEmpty()
    .withMessage(`${fieldNameWithSpaces} is required`);
};

// Validation rules for login
const loginValidationRules = () => {
  return [validateEmail(), validateRequiredField("password")];
};

// Validation rules for register
const registerValidationRules = () => {
  return [
    validateRequiredField("name"),
    validateEmail(),
    validatePassword(),
    body("confirmPassword").custom((value, { req }) => {
      if (!value) {
        throw new Error("Confirm password is required");
      }

      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
  ];
};

// Middleware to validate form
const validateForm = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  return res.status(400).json({ errors: errors.array() });
};

module.exports = {
  loginValidationRules,
  registerValidationRules,
  validateForm,
  validateEmail,
  validateForgotPassword,
};
