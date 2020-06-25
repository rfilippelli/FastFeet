import * as Yup from "yup";

import Delivery from "../models/Delivery";
import Recipient from "../models/Recipient";
import Deliveryman from "../models/Deliveryman";
// import File from '../models/File';

import Queue from "../../lib/Queue";
import CancelationDeliveryMail from "../jobs/CancelationDeliveryMail";

import DeliveryProblem from "../models/DeliveryProblem";

class DeliveryProblemController {
  async store(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "validation fails" });
    }

    const { id } = req.params;

    const delivery = await Delivery.findByPk(id);

    if (!delivery) {
      return res.status(400).json({ error: "Delivery does not exists" });
    }

    if (!delivery.start_date) {
      return res
        .status(400)
        .json({ error: "This delivery has not been withdrawn" });
    }

    if (delivery.canceled_at) {
      return res
        .status(400)
        .json({ error: "This deliery already be canceled" });
    }

    const { description } = req.body;

    const deliveryProblem = await DeliveryProblem.create({
      delivery_id: id,
      description,
    });

    return res.json(deliveryProblem);
  }

  async index(req, res) {
    const { page = 1 } = req.query;

    const response = await DeliveryProblem.findAll({


});

  const total = await DeliveryProblem.count();
    return res.json({
// response});
    //  page: Number(page),
      pages: Math.ceil(total / 5),
   //   total,
      items: response,
    });

  //  return res.json({ response});
  }

  async show(req, res) {
    const { id } = req.params;

    const delivery = await Delivery.findByPk(id);

    if (!delivery) {
      return res.status(400).json({ error: "Delivery does not exists" });
    }

    const deliveryProblems = await DeliveryProblem.findAll({
      where: { delivery_id: id },
    });

    return res.json(deliveryProblems);
  }

  async destroy(req, res) {
    const { id } = req.params;

    const deliveryProblem = await DeliveryProblem.findByPk(id);
    //const { delivery_id, description } = await DeliveryProblem.findByPk(id);

    if (!deliveryProblem) {
      return res
        .status(400)
        .json({ error: "Delivery problem does not exists" });
    }

    const delivery = await Delivery.findByPk(deliveryProblem.delivery_id, {
      include: [
        {
          model: Deliveryman,
          as: "deliveryman",
          attributes: ["id", "name", "email"],
        },
        {
          model: Recipient,
          as: "recipient",
        },
      ],
    });

    await delivery.update({ canceled_at: new Date() });

    await deliveryProblem.destroy();

    // await Queue.add(CancelationDeliveryMail.key, {
    //   deliveryman: delivery.deliveryman,
    //   description,
    //   recipient: delivery.recipient,
    //   product: delivery.product,
    // });

    return res.json({ deliveryProblem });
  }
}

export default new DeliveryProblemController();

// import Delivery from "../models/Delivery";
// import DeliveryProblem from "../models/DeliveryProblem";

// class DeliveryProblemController {
//   async store(req, res) {
//     const schema = Yup.object().shape({
//       description: Yup.string().required(),
//     });

//     if (!(await schema.isValid(req.body))) {
//       return res.status(400).json({ error: "validation fails" });
//     }
//     // const { id } = req.params;

//     // const delivery = await Delivery.findByPk(id);

//     // if (!delivery) {
//     //   return res.status(400).json({ error: "Delivery does not exists" });
//     // }
//     // if (!delivery.start_date) {
//     //   return res.status(400).json({ error: "Delivery has not been withdraw" });
//     // }
//     // if (delivery.caceled_at) {
//     //   return res.status(400).json({ error: "Delivery has be canceled" });
//     // }

//     // const { description } = req.body;

//     // const deliveryProblem = await DeliveryProblem.create({
//     //   delivery_id: id,
//     //   description,
//     // });

//     res.json({ description });
//   }
// }

// export default new DeliveryProblemController();
