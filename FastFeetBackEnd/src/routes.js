import { Router } from "express";
import multer from "multer";
import multerConfig from "./config/multer";

import UserController from "./app/controllers/UserController";
import SessionController from "./app/controllers/SessionController";

import authMiddleware from "./app/middlewares/auth";
import RecipientController from "./app/controllers/RecipientController";
import DeliverymanController from "./app/controllers/DeliverymanController";
import FileController from "./app/controllers/FileController";
import DeliveryController from "./app/controllers/DeliveryController";
import DeliverymanDeliveryController from "./app/controllers/DeliverymanDeliveryController";
import DeliveryFinishController from "./app/controllers/DeliveryFinishController";
import DeliveryPendingController from "./app/controllers/DeliveryPendingController";

import Delivery from "./app/models/Delivery";
import DeliveryProblemController from "./app/controllers/DeliveryProblemController";

const routes = new Router();
const upload = multer(multerConfig);

routes.post("/users", UserController.store);

routes.post("/sessions", SessionController.store);

//Rotas de Arquivos
routes.post("/files", upload.single("file"), FileController.store);

// Rotas de entregadores

routes.get("/deliverymen/:id", DeliverymanController.show);

routes.get("/deliverymen", DeliverymanController.index);
routes.post("/deliverymen", DeliverymanController.store);
routes.put("/deliverymen/:id", DeliverymanController.update);
routes.delete("/deliverymen/:id", DeliverymanController.destroy);

//Rotas de Encomendas
routes.post("/recipients", RecipientController.store);
routes.get("/recipients", RecipientController.index);
routes.put("/recipients/:id", RecipientController.update);
routes.delete("/recipients/:id", RecipientController.destroy);
routes.get("/recipients/:id", RecipientController.show);

//Rotas de Entregas
routes.get("/deliveries", DeliveryController.index);
routes.post("/deliveries", DeliveryController.store);
routes.put("/deliveries/:id", DeliveryController.update);
routes.delete("/deliveries/:id", DeliveryController.destroy);
routes.get("/deliveries/:id", DeliveryController.show);

//Rotas de Entregas Por Entregador
//routes.get('/deliverymans/:id', DeliverymanController.show);
routes.get("/deliverymans/:id", DeliveryPendingController.index);

//routes.get("/deliveryman/:id/deliveries", DeliverymanDeliveryController.show);
routes.get("/deliveryman/:id/deliveries", DeliverymanDeliveryController.index);

routes.put(
  "/deliveryman/:deliveryman_id/delivery/:delivery_id",
  DeliverymanDeliveryController.update
);

//Rota finalizar entrega
routes.put(
  "/deliveryman/:deliveryman_id/delivery/:delivery_id/finish",
  DeliveryFinishController.update
);

//Rotas de Problemas na entrega
routes.post("/delivery/:id/problems", DeliveryProblemController.store);
routes.get("/delivery/problems", DeliveryProblemController.index);
routes.get("/delivery/:id/problems", DeliveryProblemController.show);
routes.delete(
  "/problem/:id/cancel-delivery",
  DeliveryProblemController.destroy
);

routes.use(authMiddleware);

routes.put("/users", UserController.update);

export default routes;
