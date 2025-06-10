import { Request, Response } from "express";
import db from "./db";

// Retornar o concurso mais recente
export async function list(reg: Request, res: Response) {
  const { city } = reg.query as { city: string };

  // Verifica se a cidade foi informada
  if (!city) {
    res.status(400).json({ message: "Cidade não informada" });
  } else {
    try {
      // Obtém todos os setores censitários de uma determinada cidade
      const result = await db.query(
        `SELECT ST_AsText(geom) as geom
        FROM censo 
        WHERE nm_mun = $1`,
        [city]
      );
      // Obtém o centroide de todos os setores censitários de uma determinada cidade
      const result_center = await db.query(
        `SELECT ST_X(ST_Centroid(ST_Union(geom))) as longitude,
        ST_Y(ST_Centroid(ST_Union(geom))) as latitude
        FROM censo 
        WHERE nm_mun = $1`,
        [city]
      );

      res.json({centroid:result_center.rows[0], polygons:result.rows});
    } catch (error: any) {
      res.json({ message: "Erro interno do servidor" });
    }
  }
}

// Retornar os dados de um determinado concurso.
export async function getByPoint(req: Request, res: Response) {
  const { x, y } = req.query as { x: string; y: string };

  // Verifica se as coordenadas foram informadas e são válidas
  if (!x || !y || isNaN(parseFloat(x)) || isNaN(parseFloat(y))) {
    res.status(400).json({ message: "Cidade não informada" });
  } else {
    try {
      const result = await db.query(
        `SELECT cd_setor, situacao, area_km2, nm_mun, ST_AsText(geom) as geom
      FROM censo 
      WHERE ST_Contains(geom, ST_SetSRID(ST_MakePoint($1, $2), 4326))`,
        [parseFloat(x), parseFloat(y)]
      );

      res.json(result.rows[0]);
    } catch (error: any) {
      res.json({ message: "Erro interno do servidor" });
    }
  }
}
