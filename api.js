const express = require("express");
const mongoose = require("mongoose");
const ExampleModel = require("./orgmodel");
const validateExample = require("./validation");
const app = express();

app.use(express.json());

mongoose.connect("mongodb://localhost:27017/exampledb");
// Create a new entry with validation
app.post("/api/example", async (req, res) => {
  try {
    // Run the validation function
    const errors = await validateExample(req.body);

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    // If validation passes, create the new entry
    const example = new ExampleModel(req.body);
    const savedExample = await example.save();
    res.status(201).json(savedExample);
  } catch (error) {
    res.status(500).json({ error: "Failed to create entry." });
  }
});

// Read all entries
app.get("/api/example", async (req, res) => {
  try {
    const examples = await ExampleModel.find();
    res.json(examples);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch entries." });
  }
});

// Update an entry
app.put("/api/example/:id", async (req, res) => {
  const errors = validateExample(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    const updatedExample = await ExampleModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedExample)
      return res.status(404).json({ error: "Entry not found." });
    res.json(updatedExample);
  } catch (error) {
    res.status(500).json({ error: "Failed to update entry." });
  }
});

// Delete an entry
app.delete("/api/example/:id", async (req, res) => {
  try {
    const deletedExample = await ExampleModel.findByIdAndDelete(req.params.id);
    if (!deletedExample)
      return res.status(404).json({ error: "Entry not found." });
    res.json({ message: "Entry deleted." });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete entry." });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
