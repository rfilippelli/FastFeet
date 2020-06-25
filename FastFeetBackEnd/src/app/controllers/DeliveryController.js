import * as Yup from "yup";
import { isBefore, isAfter, getHours } from "date-fns";

import { Op } from "sequelize";
import Delivery from "../models/Delivery";
import Recipient from "../models/Recipient";
import File from "../models/File";
import Deliveryman from "../models/Deliveryman";
import Queue from "../../lib/Queue";
import NotificationDeliveryMail from "../jobs/NotificationDeliveryMail";

class DeliveryController {
  async show(req, res) {
    const { id } = req.params;

    const delivery = await Delivery.findByPk(id, {
      attributes: ["id", "product"],
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

  async index(req, res) {
    const { query: productName, page = 1, limit = 8 } = req.query;

    const response = productName
      ? await Delivery.findAll({
          where: {
            product: {
              [Op.iLike]: `${productName}%`,
            },
          },
          order: ["id"],
          attributes: ["id", "product", "status", "start_date", "end_date"],
          include: [
            {
              model: Recipient,
              as: "recipient",
              attributes: [
                "id",
                "name",
                "street",
                "number",
                "complement",
                "state",
                "city",
                "zip_code",
              ],
            },
          ],

          include: [
            {
              model: Deliveryman,
              as: "deliveryman",
              attributes: ["id", "name", "email"],
              include: [
                {
                  model: File,
                  as: "avatar",
                  attributes: ["name", "path", "url"],
                },
              ],
            },
          ],

          include: [
            {
              model: File,
              as: "signature",
              attributes: ["id", "path", "url"],
            },
          ],
        })
      : await Delivery.findAll({
          attributes: ["id", "product", "status", "start_date", "end_date"],
          order: ["id"],
          limit: 8,
          offset: (page - 1) * 8,
          include: [
            {
              model: Recipient,
              as: "recipient",
              attributes: [
                "id",
                "name",
                "street",
                "number",
                "complement",
                "state",
                "city",
                "zip_code",
              ],
            },

            {
              model: Deliveryman,
              as: "deliveryman",
              attributes: ["id", "name", "email"],
              include: [
                {
                  model: File,
                  as: "avatar",
                  attributes: ["name", "path", "url"],
                },
              ],
            },

            {
              model: File,
              as: "signature",
              attributes: ["id", "path", "url"],
            },
          ],
        });
    const total = await Delivery.count();
    // return res.json(response);
    return res.json({
      page: Number(page),
      pages: Math.ceil(total / limit),
      total,
      items: response,
    });
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.string().required(),
      deliveryman_id: Yup.string().required(),
      product: Yup.string().required(),
      // start_date: Yup.date().required(), //das 8 as 18h
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "validation fails" });
    }

    /**
     * Check for dates avalaible : 8 to 18hs
     */
    const dateStart = new Date();
    const hourStart = getHours(new Date(2020, 1, 1, 8));
    const hourEnd = getHours(new Date(2020, 1, 1, 24));
    const hourGet = getHours(new Date());

    if (isBefore(hourGet, hourStart)) {
      return res.status(400).json({
        error: "Past Hours are not permitted" + hourStart + hourGet,
      });
    }
    if (isAfter(hourEnd, hourStart)) {
      return res.status(400).json({ error: "After Hours are not permitted" });
    }

    const { recipient_id, deliveryman_id, product } = req.body;

    const recipientExists = await Recipient.findByPk(recipient_id);

    const deliveryExists = await Delivery.findOne({ where: { recipient_id } });
    /*
     * Check if delivery man already exists in database
     */
    if (deliveryExists) {
      return res.status(400).json({ error: "Delivery already exists" });
    }

    const {
      id,
      signature_id,
      start_date,
      end_date,
      canceled_at,
    } = await Delivery.create({
      recipient_id,
      deliveryman_id,
      product,
      status: "PENDENTE",
      // start_date: dateStart,
    });

    await Queue.add(NotificationDeliveryMail.key, {
      deliveryman_id,
      recipient: recipientExists,
      product,
    });

    return res.json({
      id,
      recipient_id,
      deliveryman_id,
      signature_id,
      product,
      start_date,
      end_date,
      canceled_at,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.string().required(),
      deliveryman_id: Yup.string().required(),
      product: Yup.string().required(),
      status: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "validation fails" });
    }

    const { id } = req.params;

    const delivery = await Delivery.findByPk(id);

    if (!delivery) {
      return res.status(400).json({ error: "Delivery does not exists" });
    }

    const { recipient_id, reliveryman_id, product, status } = req.body;

    await delivery.update({ recipient_id, reliveryman_id, product, status });

    return res.json({ recipient_id, reliveryman_id, product, status });
  }

  async destroy(req, res) {
    const { id } = req.params;

    const delivery = await Delivery.findByPk(id);
    if (!delivery) {
      return res.status(400).json({ error: "Delivery does not exist" });
    }

    await delivery.destroy();

    return res.json({});
  }
}

export default new DeliveryController();
