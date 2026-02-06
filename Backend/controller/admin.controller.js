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
