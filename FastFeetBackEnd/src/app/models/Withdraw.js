import Sequelize, { Model } from "sequelize";

class Withdraw extends Model {
  static init(sequelize) {
    super.init(
      {
        date: Sequelize.DATE,
        count: Sequelize.INTEGER,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Deliverymen, {
      foreignKey: "deliverymen_id",
      as: "deliveryman",
    });
  }
}

export default Withdraw;
