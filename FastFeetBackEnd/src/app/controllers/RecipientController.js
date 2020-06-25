import * as Yup from "yup";
import { Op } from "sequelize";

import Recipient from "../models/Recipient";

class RecipientController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      street: Yup.string().required(),
      number: Yup.number().required(),
      complement: Yup.string().notRequired(),
      state: Yup.string().required(),
      city: Yup.string().required(),
      zip_code: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "validation fails" });
    }

    const {
      name,
      street,
      number,
      complement,
      state,
      city,
      zip_code,
    } = req.body;

    const { id } = await Recipient.create({
      name,
      street,
      number,
      complement,
      state,
      city,
      zip_code,
    });

    return res.json({
      id,
      name,
      street,
      number,
      complement,
      state,
      city,
      zip_code,
    });
  }

  async index(req, res) {
    const { query: recipientName, page = 1 } = req.query;

    const response = recipientName
      ? await Recipient.findAll({
          where: {
            name: {
              [Op.iLike]: `${recipientName}%`,
            },
          },
          order: ["id"],
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
          limit: 8,
          offset: (page - 1) * 8,
        })
      : await Recipient.findAll({
          order: ["id"],
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
          limit: 8,
          offset: (page - 1) * 8,
        });
    const total = await Recipient.count();
    return res.json({
      page: Number(page),
      pages: Math.ceil(total / 8),
      total: response.length,
      items: response,
    });

    // return res.json(response);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      street: Yup.string(),
      number: Yup.number(),
      complement: Yup.string(),
      state: Yup.string(),
      city: Yup.string(),
      zip_code: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Validation fails" });
    }

    const { id } = req.params;

    const recipient = await Recipient.findByPk(id);

    if (!recipient) {
      return res.status(400).json({ error: "Recipient does not exists" });
    }

    await recipient.update(req.body);

    return res.json(req.body);
  }

  async destroy(req, res) {
    const { id } = req.params;

    const recipient = await Recipient.findByPk(id);

    if (!recipient) {
      return res.status(400).json({ error: "Recipient does not exists" });
    }

    await recipient.destroy();

    return res.json({});
  }

  async show(req, res) {
    const { id } = req.params;

    const recipient = await Recipient.findByPk(id, {
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
    });

    if (!recipient) {
      return res.status(400).json({ error: "Recipient does not exists" });
    }

    return res.json(recipient);
  }
}

export default new RecipientController();
