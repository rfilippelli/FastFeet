import NotificationDelivery from "../schemas/NotificationDelivery";
import User from "../models/User";

class NotificationController {
  async index(req, res) {
    const checkIsProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });

    if (!checkIsProvider) {
      return res
        .status(401)
        .json({ error: "Only providers can load notifications" });
    }

    const notifications = await NotificationDelivery.find({
      user: req.userId,
    })
      .sort({ createdAt: "desc" })
      .limit(20);

    return res.json(notifications);
  }

  async update(req, res) {
    const notification = await NotificationDelivery.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    return res.json(notification);
  }
}
export default new NotificationDeliveryController();
