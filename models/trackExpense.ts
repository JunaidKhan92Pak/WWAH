

import mongoose from "mongoose";

const LifestyleSchema = new mongoose.Schema({
  type: { type: String, required: true },
  currency: { type: String, required: true },
  internet: {
    min: { type: Number, required: true },
    max: { type: Number, required: true },
  },
  mobile: {
    min: { type: Number, required: true },
    max: { type: Number, required: true },
  },
  groceries: {
    min: { type: Number, required: true },
    max: { type: Number, required: true },
  },
  public_transport: {
    min: { type: Number, required: true },
    max: { type: Number, required: true },
  },
  rent: {
    min: { type: Number, required: true },
    max: { type: Number, required: true },
  },
  utilities: {
    min: { type: Number, required: true },
    max: { type: Number, required: true },
  },
  total_estimated_cost: {
    min: { type: Number, required: true },
    max: { type: Number, required: true },
  },
});

const ExpenseSchema = new mongoose.Schema({
  country_name: { type: String, required: true },
  university_name: { type: String, required: true },
  lifestyles: { type: [LifestyleSchema], required: true },
});

const Expense =
  mongoose.models.Expense || mongoose.model("Expense", ExpenseSchema);

export default Expense;
