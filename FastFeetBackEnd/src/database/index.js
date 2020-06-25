import Sequelize from "sequelize";
import mongoose from "mongoose";

import databaseConfig from "../config/database";
import mongoConfig from "../config/mongo";

// Importar models e colocar no array
import User from "../app/models/User";
import Recipient from "../app/models/Recipient";

import File from "../app/models/File";
import Deliveryman from "../app/models/Deliveryman";
import Delivery from "../app/models/Delivery";
import DeliveryProblem from "../app/models/DeliveryProblem";

const models = [User, Recipient, Deliveryman, File, Delivery, DeliveryProblem];

class Database {
  constructor() {
    this.init();
    this.mongo();
  }
  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map((model) => model.init(this.connection))
      .map(
        (model) => model.associate && model.associate(this.connection.models)
      );
  }

  mongo() {
    this.mongoConnection = mongoose.connect(
      `mongodb://${mongoConfig.host}:${mongoConfig.port}/${mongoConfig.database}`,
      // 'mongodb://192.168.99.100:27017/gobarber',
      { userNewUrlParse: true, useFindAndModify: true }
    );
  }

  // mongo() {
  //   this.mongoConnection = mongoose.connect(
  //     `mongodb://${mongoConfig.username}:${mongoConfig.password}@${mongoConfig.host}:${mongoConfig.port}/${mongoConfig.database}`,
  //     {
  //       useNewUrlParser: true,
  //       useFindAndModify: true,
  //       useUnifiedTopology: true,
  //     }
  //   );
  // }
}

export default new Database();
