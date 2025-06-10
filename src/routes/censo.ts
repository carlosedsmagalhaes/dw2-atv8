import { Router } from "express";
import { list, getByPoint} from "../controllers/CensoController";

const routes = Router();

routes.get("/", list);
routes.get("/point", getByPoint);

export default routes;