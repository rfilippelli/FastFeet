import Mail from "../../lib/Mail";

class NotificationDeliveryMail {
  get key() {
    return "NotificationDeliveryMail";
  }

  async handle({ data }) {
    const { deliveryman, product, recipient } = data;

    await Mail.sendMail({
      to: `${deliveryman.name} <${deliveryman.email}>`,
      subject: "Nova entrega cadastrada",
      template: "NotificationDelivery",
      context: {
        deliveryman: deliveryman.name,
        product,
        recipient: recipient.name,
        city: recipient.city,
        state: recipient.state,
        street: recipient.street,
        number: recipient.number,
        zip_code: recipient.zip_code,
      },
    });
  }
}

export default new NotificationDeliveryMail();
