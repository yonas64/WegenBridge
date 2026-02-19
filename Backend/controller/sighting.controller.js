const https = require("https");
const querystring = require("querystring");
const Sighting = require("../models/sighting.model");
const MissingPerson = require("../models/missingPerson.model");
const Notification = require("../models/notification.model");
const { compareLocalPhotos, isFaceMatch } = require("../utils/faceMatcher");

const sendSms = async ({ to, body }) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM;

  if (!accountSid || !authToken || !from || !to || !body) {
    return false;
  }

  const postData = querystring.stringify({
    To: to,
    From: from,
    Body: body,
  });

  const options = {
    hostname: "api.twilio.com",
    path: `/2010-04-01/Accounts/${accountSid}/Messages.json`,
    method: "POST",
    auth: `${accountSid}:${authToken}`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": Buffer.byteLength(postData),
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      res.on("data", () => {});
      res.on("end", () => {
        resolve(res.statusCode >= 200 && res.statusCode < 300);
      });
    });

    req.on("error", reject);
    req.write(postData);
    req.end();
  });
};

// Report a sighting
exports.createSighting = async (req, res) => {
  try {
    const { missingPersonId, location, sightingDate, description, phoneNumber } = req.body;
    const photoUrl = req.file ? `/uploads/${req.file.filename}` : req.body.photoUrl;

    // Check if missing person exists
    const missingPerson = await MissingPerson.findById(missingPersonId);
    if (!missingPerson) {
      return res.status(404).json({ message: "Missing person not found" });
    }

    const newSighting = new Sighting({
      missingPerson: missingPersonId,
       reportedBy: req.user.id, // from auth middleware
      location,
      sightingDate,
      description,
      photoUrl,
      phoneNumber
    });

    await newSighting.save();

    const message = `New sighting reported for ${missingPerson.name}. Location: ${location}. ` +
      (description ? `Details: ${description}. ` : "") +
      (phoneNumber ? `Reporter phone: ${phoneNumber}` : "");

    await Notification.create({
      recipientUser: missingPerson.createdBy,
      recipientPhone: missingPerson.contactPhone,
      recipientEmail: missingPerson.contactEmail,
      title: "New Sighting Reported",
      message,
      type: "sighting",
      relatedMissingPerson: missingPerson._id,
      relatedSighting: newSighting._id,
    });

    if (missingPerson.contactPhone) {
      try {
        await sendSms({ to: missingPerson.contactPhone, body: message });
      } catch (err) {
        // Avoid failing the request if SMS fails
        console.error("SMS send failed", err);
      }
    }

    // Automatic photo matching across other active missing-person reports.
    // If similarity passes threshold, notify the original reporter.
    if (photoUrl) {
      const candidates = await MissingPerson.find({
        _id: { $ne: missingPerson._id },
        status: "missing",
        photoUrl: { $exists: true, $ne: null },
      }).select("_id name createdBy contactPhone contactEmail photoUrl");

      for (const candidate of candidates) {
        const similarity = await compareLocalPhotos(photoUrl, candidate.photoUrl);
        if (!isFaceMatch(similarity)) continue;

        const alreadyNotified = await Notification.findOne({
          type: "face_match",
          relatedMissingPerson: candidate._id,
          relatedSighting: newSighting._id,
        }).select("_id");

        if (alreadyNotified) continue;

        const matchPercent = Math.round(similarity * 100);
        await Notification.create({
          recipientUser: candidate.createdBy,
          recipientPhone: candidate.contactPhone,
          recipientEmail: candidate.contactEmail,
          title: "Possible Face Match Found",
          message: `A new sighting photo may match ${candidate.name} (${matchPercent}% similarity). Please review this report.`,
          type: "face_match",
          relatedMissingPerson: candidate._id,
          relatedSighting: newSighting._id,
        });
      }
    }

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

// Get one sighting by ID
exports.getSightingById = async (req, res) => {
  try {
    const sighting = await Sighting.findById(req.params.id)
      .populate("missingPerson", "name photoUrl")
      .populate("reportedBy", "name email");

    if (!sighting) {
      return res.status(404).json({ message: "Sighting not found" });
    }

    res.json(sighting);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sighting", error });
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

// Update a sighting report (owner only)
exports.updateSighting = async (req, res) => {
  try {
    const allowedFields = ["location", "sightingDate", "description", "photoUrl", "phoneNumber"];

    const sighting = await Sighting.findById(req.params.id);
    if (!sighting) {
      return res.status(404).json({ message: "Sighting not found" });
    }

    if (String(sighting.reportedBy) !== String(req.user._id)) {
      return res.status(403).json({ message: "Forbidden: You can only update your own sightings" });
    }

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        sighting[field] = req.body[field];
      }
    }

    if (req.file) {
      sighting.photoUrl = `/uploads/${req.file.filename}`;
    }

    const updatedSighting = await sighting.save();
    res.json(updatedSighting);
  } catch (error) {
    res.status(500).json({ message: "Error updating sighting", error });
  }
};
