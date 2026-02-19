const MissingPerson = require("../models/missingPerson.model");
const Sighting = require("../models/sighting.model");
const Notification = require("../models/notification.model");
const { compareLocalPhotos, isFaceMatch } = require("../utils/faceMatcher");

// Create missing person
exports.createMissingPerson = async (req, res) => {
  try {
    const {
      name,
      age,
      gender,
      lastSeenLocation,
      lastSeenDate,
      lastSeenTime,
      description,
      contactName,
      contactPhone,
      contactEmail,
      relationship,
    } = req.body;

    const photoUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const newMissingPerson = new MissingPerson({
      createdBy: req.user.id,
      name,
      age,
      gender,
      lastSeenLocation,
      lastSeenDate,
      lastSeenTime,
      description,
      photoUrl,
      contactName,
      contactPhone,
      contactEmail,
      relationship,
    });

    await newMissingPerson.save();

    // Automatic photo matching against existing sightings.
    // If similarity passes threshold, notify the new report owner.
    if (photoUrl) {
      const sightingsWithPhotos = await Sighting.find({
        photoUrl: { $exists: true, $ne: null },
      }).select("_id location sightingDate photoUrl");

      for (const sighting of sightingsWithPhotos) {
        const similarity = await compareLocalPhotos(photoUrl, sighting.photoUrl);
        if (!isFaceMatch(similarity)) continue;

        const alreadyNotified = await Notification.findOne({
          type: "face_match",
          relatedMissingPerson: newMissingPerson._id,
          relatedSighting: sighting._id,
        }).select("_id");

        if (alreadyNotified) continue;

        const matchPercent = Math.round(similarity * 100);
        await Notification.create({
          recipientUser: newMissingPerson.createdBy,
          recipientPhone: newMissingPerson.contactPhone,
          recipientEmail: newMissingPerson.contactEmail,
          title: "Possible Face Match Found",
          message:
            `Your new report for ${newMissingPerson.name} may match an existing sighting ` +
            `(${matchPercent}% similarity). Location: ${sighting.location || "Unknown"}.`,
          type: "face_match",
          relatedMissingPerson: newMissingPerson._id,
          relatedSighting: sighting._id,
        });
      }
    }

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
    const {
      name,
      gender,
      location,
      status,
      fromDate,
      toDate,
      q,
      ageMin,
      ageMax,
      page = 1,
      limit = 50,
      sort = "createdAt:desc",
    } = req.query;

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

    // Age range filter
    if (ageMin || ageMax) {
      filter.age = {};
      if (ageMin) filter.age.$gte = Number(ageMin);
      if (ageMax) filter.age.$lte = Number(ageMax);
    }

    // General keyword search (search in multiple fields)
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { lastSeenLocation: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } }
      ];
    }

    const [sortField, sortDir] = String(sort).split(":");
    const sortOrder = sortDir === "asc" ? 1 : -1;

    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.min(100, Math.max(1, Number(limit) || 50));
    const skip = (pageNum - 1) * limitNum;

    const missingPersons = await MissingPerson.find(filter)
      .sort({ [sortField || "createdAt"]: sortOrder })
      .skip(skip)
      .limit(limitNum);

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

    const existing = await MissingPerson.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: "Missing person not found" });
    }

    if (String(existing.createdBy) !== String(req.user._id)) {
      return res.status(403).json({ message: "Forbidden: You can only update your own reports" });
    }

    existing.status = status;
    const updatedPerson = await existing.save();

    if (!updatedPerson) {
      return res.status(404).json({ message: "Missing person not found" });
    }

    res.json(updatedPerson);

  } catch (error) {
    res.status(500).json({ message: "Error updating status", error });
  }
};

// Update a missing person report (owner only)
exports.updateMissingPerson = async (req, res) => {
  try {
    const allowedFields = [
      "name",
      "age",
      "gender",
      "lastSeenLocation",
      "lastSeenDate",
      "lastSeenTime",
      "description",
      "contactName",
      "contactPhone",
      "contactEmail",
      "relationship",
      "status",
    ];

    const existing = await MissingPerson.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: "Missing person not found" });
    }

    if (String(existing.createdBy) !== String(req.user._id)) {
      return res.status(403).json({ message: "Forbidden: You can only update your own reports" });
    }

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        existing[field] = req.body[field];
      }
    }

    if (req.file) {
      existing.photoUrl = `/uploads/${req.file.filename}`;
    }

    const updated = await existing.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error updating missing person", error });
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

