import * as Yup from "yup";
import { isBefore, isAfter, getHours } from "date-fns";

import { Op } from "sequelize";
import Delivery from "../models/Delivery";
import Recipient from "../models/Recipient";
import File from "../models/File";
import Deliveryman from "../models/Deliveryman";
import Withdraw from "../models/Withdraw";

import Queue from "../../lib/Queue";
import NotificationDeliveryMail from "../jobs/NotificationDeliveryMail";

class DeliverymanDeliveryController {
  async index(req, res) {
    const { id: deliverymanId } = req.params;

    const deliveryman = await Deliveryman.findByPk(deliverymanId);

    if (!deliveryman) {
      return res.status(400).json({ error: "Delivery man does not exists" });
    }

    const deliveries = await Delivery.findAll({
      where: {
        signature_id: { [Op.not]: null },
        deliveryman_id: deliverymanId,
      },
      attributes: [
        "id",
        "deliveryman_id",
        "product",
        "status",
        "start_date",
        "end_date",
        "canceled_at",
      ],
      order: ["id"],
      include: [
        {
          model: Recipient,
          as: "recipient",
          attributes: [
            "id",
            "name",
            "state",
            "city",
            "street",
            "number",
            "complement",
            "zip_code",
          ],
        },
        {
          model: File,
          as: "signature",
          attributes: ["id", "url", "path"],
        },
      ],
    });

    return res.json(deliveries);
  }

  async show(req, res) {
    const { id } = req.params;

    const delivery = await Delivery.findAll({
      where: {
        id: id,
        end_date: {
          [Op.ne]: null,
        },
      },
      attributes: ["id", "product", "start_date", "end_date"],
      include: [
        {
          model: Recipient,
          as: "recipient",
          attributes: ["id", "name"],
        },
        {
          model: Deliveryman,
          as: "deliveryman",
          attributes: ["id", "name"],
        },
      ],
    });

    if (!delivery) {
      return res(400).json({ error: "Delivery does not exist" });
    }

    return res.json(delivery);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      start_date: Yup.date().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "validation fails" });
    }
    const { deliveryman_id, delivery_id, status } = req.params;

    const delivery = await Delivery.findByPk(delivery_id);

    if (!delivery) {
      return res.status(401).json({ error: "Delivery not found!" });
    }

    /*
     * Check if delivery man exists
     */
    const deliveryman = await Deliveryman.findByPk(deliveryman_id);

    if (!deliveryman) {
      return res.status(400).json({ error: "Delivery man does not exists" });
    }

    const dateStart = new Date();

    const checkWithdraws = await Delivery.findAndCountAll({
      where: {
        deliveryman_id: deliveryman_id,
        [Op.or]: [
          {
            start_date: null,
          },
          {
            start_date: new Date(),
          },
        ],
      },
    });

    if (checkWithdraws === 5) {
      return res
        .status(400)
        .json({ error: "Maximum number of withdrawals 5 times per day" });
    }

    const hourStart = 8;
    const hourEnd = 18;
    const hourGet = getHours(new Date());

    if (isBefore(hourGet, hourStart)) {
      return res.status(400).json({
        error: "Past Hours are not permitted",
      });
    }
    if (isAfter(hourGet, hourEnd)) {
      return res.status(400).json({
        error: "After Hours are not permitted",
      });
    }

    // await delivery.update({ status: Status });

    await delivery.update({ status: "RETIRADA", start_date: dateStart });

    return res.json({ hourGet });
  }
}

export default new DeliverymanDeliveryController();
