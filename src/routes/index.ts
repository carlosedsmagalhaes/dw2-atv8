import { Router } from "express";
import censo from "./censo";

const routes = Router();

routes.use("/censo", censo);

routes.use("/", (_, res) => {
  res.json({message:"Rota inexistente"});
});

export default routes;