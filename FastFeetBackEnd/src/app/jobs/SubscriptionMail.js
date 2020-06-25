import Mail from "../../lib/Mail";

class SubscriptionMail {
  get key() {
    return "SubscriptionMail";
  }

  async handle({ data }) {
    const { meetup, user } = data;

    await Mail.sendMail({
      to: `${deliveryman.name} <${deliveryman.email}>`,
      ///to: `${meetup.User.name} <${meetup.User.email}>`,
      subject: "Nova entrega cadastrada",
      template: "NotificationDelivery",

      // subject: `[${meetup.title}] Nova inscrição`,

      template: "subscription",

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
      // context: {
      //   organizer: meetup.User.name,

      //   meetup: meetup.title,

      //   user: user.name,

      //   email: user.email,
      // },
    });
  }
}

export default new SubscriptionMail();
