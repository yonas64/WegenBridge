const MissingPerson = require("../models/missingPerson.model");
const Sighting = require("../models/sighting.model");
const User = require("../models/users");

const timeAgoLabel = (date) => {
  if (!date) return "Unknown";
  const diffMs = Date.now() - new Date(date).getTime();
  const diffMin = Math.round(diffMs / 60000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return `${diffHr} hours ago`;
  const diffDay = Math.round(diffHr / 24);
  return `${diffDay} days ago`;
};

exports.getDashboard = async (req, res) => {
  try {
    const totalCases = await MissingPerson.countDocuments();
    const reunited = await MissingPerson.countDocuments({ status: "found" });
    const activeCases = await MissingPerson.countDocuments({ status: { $ne: "found" } });
    const volunteers = await User.countDocuments();

    const recentCases = await MissingPerson.find({})
      .sort({ createdAt: -1 })
      .limit(3)
      .select("name lastSeenDate lastSeenLocation createdAt status");

    const recentSightings = await Sighting.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("reportedBy", "name")
      .populate("missingPerson", "name")
      .select("createdAt reportedBy missingPerson");

    const recentActivities = [
      ...recentCases.map((c) => ({
        id: `case-${c._id}`,
        action: "New case reported",
        user: c.name || "Unknown",
        time: timeAgoLabel(c.createdAt),
        type: "case",
        createdAt: c.createdAt,
      })),
      ...recentSightings.map((s) => ({
        id: `sighting-${s._id}`,
        action: "Sighting reported",
        user: s.reportedBy?.name || "Reporter",
        time: timeAgoLabel(s.createdAt),
        type: "sighting",
        createdAt: s.createdAt,
      })),
    ]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 6)
      .map(({ createdAt, ...rest }) => rest);

    res.json({
      stats: {
        totalCases,
        activeCases,
        reunited,
        volunteers,
        successRate: totalCases === 0 ? 0 : Math.round((reunited / totalCases) * 100),
      },
      recentCases,
      recentActivities,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching dashboard data", error });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .sort({ createdAt: -1 })
      .select("_id name email role isFrozen createdAt");

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
};

exports.setUserFrozen = async (req, res) => {
  try {
    const { id } = req.params;
    const { isFrozen } = req.body;

    if (typeof isFrozen !== "boolean") {
      return res.status(400).json({ message: "isFrozen must be boolean" });
    }

    if (String(req.user._id) === String(id)) {
      return res.status(400).json({ message: "You cannot freeze your own account" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "admin") {
      return res.status(400).json({ message: "Cannot freeze an admin account" });
    }

    user.isFrozen = isFrozen;
    user.frozenAt = isFrozen ? new Date() : null;
    await user.save();

    return res.status(200).json({
      message: isFrozen ? "User frozen successfully" : "User unfrozen successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isFrozen: user.isFrozen,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Error updating user freeze state", error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (String(req.user._id) === String(id)) {
      return res.status(400).json({ message: "You cannot delete your own account" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "admin") {
      return res.status(400).json({ message: "Cannot delete an admin account" });
    }

    await User.findByIdAndDelete(id);

    return res.status(200).json({ message: "User removed successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error removing user", error: error.message });
  }
};
