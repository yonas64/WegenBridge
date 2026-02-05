const MissingPerson = require("../models/missingPerson.model");

// Create missing person
exports.createMissingPerson = async (req, res) => {
  try {
    const {
      name,
      age,
      gender,
      lastSeenLocation,
      lastSeenDate,
      description,
    } = req.body;

    const photoUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const newMissingPerson = new MissingPerson({
      createdBy: req.user.id,
      name,
      age,
      gender,
      lastSeenLocation,
      lastSeenDate,
      description,
      photoUrl
    });

    await newMissingPerson.save();

    res.status(201).json({
      success: true,
      message: "Missing person created successfully",
      data: newMissingPerson
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating missing person",
      error: error.message
    });
  }
};





// Get all missing persons + Search functionality
exports.getAllMissingPersons = async (req, res) => {
  try {
    const { name, gender, location, status, fromDate, toDate, q } = req.query;

    let filter = {};

    // Search by exact fields
    if (name) filter.name = { $regex: name, $options: "i" };
    if (gender) filter.gender = gender;
    if (location) filter.lastSeenLocation = { $regex: location, $options: "i" };
    if (status) filter.status = status;

    // Date range filter
    if (fromDate || toDate) {
      filter.lastSeenDate = {};
      if (fromDate) filter.lastSeenDate.$gte = new Date(fromDate);
      if (toDate) filter.lastSeenDate.$lte = new Date(toDate);
    }

    // General keyword search (search in multiple fields)
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { lastSeenLocation: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } }
      ];
    }

    const missingPersons = await MissingPerson.find(filter).sort({ createdAt: -1 });

    res.json(missingPersons);

  } catch (error) {
    res.status(500).json({ message: "Error fetching missing persons", error });
  }
}

// Update status (missing → found)
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["missing", "found"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updatedPerson = await MissingPerson.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedPerson) {
      return res.status(404).json({ message: "Missing person not found" });
    }

    res.json(updatedPerson);

  } catch (error) {
    res.status(500).json({ message: "Error updating status", error });
  }
};


// Delete a missing person (optional)
exports.deleteMissingPerson = async (req, res) => {
  try {
    const deleted = await MissingPerson.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Missing person not found" });
    }

    res.json({ message: "Missing person deleted" });

  } catch (error) {
    res.status(500).json({ message: "Error deleting missing person", error });
  }
};



// Get missing person by ID
exports.getMissingPersonById = async (req, res) => {
  try {
    const missingPerson = await MissingPerson.findById(req.params.id);

    if (!missingPerson) {
      return res.status(404).json({ message: "Missing person not found" });
    }

    res.json(missingPerson);

  } catch (error) {
    res.status(500).json({ message: "Error fetching missing person", error });
  }
};

