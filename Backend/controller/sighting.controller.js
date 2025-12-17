const Sighting = require("../models/sighting.model");
const MissingPerson = require("../models/missingPerson.model");

// Report a sighting
exports.createSighting =  (req, res) => {
  try {
    const { missingPersonId, location, sightingDate, description, photoUrl } = req.body;

    // Check if missing person exists
    // const missingPerson =  MissingPerson.findById(missingPersonId);
    // if (!missingPerson) {
    //   return res.status(404).json({ message: "Missing person not found" });
    // }

    const newSighting = new Sighting({
      missingPerson: missingPersonId,
       reportedBy: req.user.id, // from auth middleware
      location,
      sightingDate,
      description,
      photoUrl
    });

     newSighting.save();
    res.status(201).json(newSighting);

  } catch (error) {
    res.status(500).json({ message: "Error reporting sighting", error });
  }
};


// Get all sightings for a missing person
exports.getSightingsByMissingPerson = async (req, res) => {
  try {
    const { missingPersonId } = req.params;

    // Check if missing person exists
    const missingPerson = await MissingPerson.findById(missingPersonId);
    if (!missingPerson) {
      return res.status(404).json({ message: "Missing person not found" });
    }

    const sightings = await Sighting.find({ missingPerson: missingPersonId }).sort({ createdAt: -1 });
    res.json(sightings);

  } catch (error) {
    res.status(500).json({ message: "Error fetching sightings", error });
  }
};



// Get sightings with search + filters
exports.getSightings = async (req, res) => {
  try {
    const { 
      missingPersonId,
      location,
      fromDate,
      toDate,
      reportedBy,
      q
    } = req.query;

    let filter = {};

    // Filter by missing person
    if (missingPersonId) {
      filter.missingPerson = missingPersonId;
    }

    // Filter by reporter
    if (reportedBy) {
      filter.reportedBy = reportedBy;
    }

    // Search by location
    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }

    // Date range
    if (fromDate || toDate) {
      filter.sightingDate = {};
      if (fromDate) filter.sightingDate.$gte = new Date(fromDate);
      if (toDate) filter.sightingDate.$lte = new Date(toDate);
    }

    // Keyword search
    if (q) {
      filter.$or = [
        { description: { $regex: q, $options: "i" } },
        { location: { $regex: q, $options: "i" } }
      ];
    }

    const sightings = await Sighting.find(filter)
      .populate("missingPerson", "name age gender photoUrl")
      .populate("reportedBy", "name email")
      .sort({ createdAt: -1 });

    res.json(sightings);

  } catch (error) {
    res.status(500).json({ message: "Error fetching sightings", error });
  }
};
