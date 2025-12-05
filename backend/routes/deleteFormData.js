// deleteFormData.js
module.exports = function (router, Model) {

  // DELETE BY DATE-RANGE (for all SBU models)
  router.delete("/delete-by-date-range", async (req, res) => {
    try {
      const { user, startDate, endDate } = req.query;

      if (!user || !startDate || !endDate) {
        return res
          .status(400)
          .json({ message: "User, startDate, endDate required" });
      }

      // BD time → UTC time to match MongoDB
      const startBD = new Date(`${startDate}T00:00:00+06:00`);
      const endBD = new Date(`${endDate}T23:59:59+06:00`);

      const startUTC = new Date(startBD.toISOString());
      const endUTC = new Date(endBD.toISOString());

      const result = await Model.deleteMany({
        userName: user,
        createdAt: { $gte: startUTC, $lte: endUTC }
      });

      return res.json({
        message: `Deleted ${result.deletedCount} reports for ${user} from ${startDate} to ${endDate}`,
        deletedCount: result.deletedCount
      });

    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }
  });

};
