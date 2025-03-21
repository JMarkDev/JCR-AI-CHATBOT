const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");

const User = sequelize.define(
  "user",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    image: {
      type: DataTypes.STRING(250),
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    birthDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    contactNumber: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    freeQuestions: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    paidQuestions: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    subscriptionPlan: {
      type: DataTypes.ENUM("weekly", "monthly", "yearly"),
      allowNull: true,
    },
    subscriptionExpiry: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "users",
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = User;
