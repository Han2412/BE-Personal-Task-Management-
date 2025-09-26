const Todo = require("../models/todo.model");
const { getPagination } = require("../utils/paginate");
const mongoose = require("mongoose");

exports.create = async (req, res, next) => {
  try {
    const { title, description, status, dueAt } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required" });
    const todo = new Todo({ title, description, status, dueAt });
    const saved = await todo.save();
    return res.status(201).json(saved);
  } catch (err) {
    next(err);
  }
};

exports.list = async (req, res, next) => {
  try {
    // filters: status, from, to (dates), search title
    const { status, from, to, search, page = 1, limit = 10 } = req.query;
    const { skip, limit: lim, page: pg } = getPagination(page, limit);

    const filter = {};
    if (status) filter.status = status;
    if (search) filter.title = { $regex: search, $options: "i" };

    if (from || to) {
      filter.$and = [];
      if (from) filter.$and.push({ createdAt: { $gte: new Date(from) } });
      if (to) filter.$and.push({ createdAt: { $lte: new Date(to) } });
      if (filter.$and.length === 0) delete filter.$and;
      console.log("list:", filter)
    }

    const [items, total] = await Promise.all([
      Todo.find(filter).sort({ dueAt: 1, createdAt: -1 }).skip(skip).limit(lim),
      Todo.countDocuments(filter),
    ]);
    const totalPages = Math.ceil(total / lim) || 1;
    res.json({ items, meta: { total, page: pg, totalPages, limit: lim } });
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid id" });
    const todo = await Todo.findById(id);
    if (!todo) return res.status(404).json({ message: "Not found" });
    res.json(todo);
  } catch (err) {
    next(err);
  }
};

// Edit task
exports.update = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const updated = await Todo.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};
// Delete
exports.remove = async (req, res, next) => {
  try {
    const id = req.params.id;
    await Todo.findByIdAndDelete(id);
    res.status(200).json({ message: "Deleted" });
  } catch (err) {
    next(err);
  }
};

exports.stats = async (req, res, next) => {
  try {
    const total = await Todo.countDocuments();
    const done = await Todo.countDocuments({ status: "DONE" });
    const todo = await Todo.countDocuments({ status: "TODO" });
    res.json({ total, done, todo });
  } catch (err) {
    next(err);
  }
};
