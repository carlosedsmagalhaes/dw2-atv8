import pool from "./db";
import * as fs from "fs";
import * as path from "path";

interface GeoJSONFeature {
  type: string;
  properties: { [key: string]: any };
  geometry: { [key: string]: any };
}

interface GeoJSON {
  type: string;
  features: GeoJSONFeature[];
}

async function importGeoJSON(filePath: string) {
  try {
    const tableName = "censo";
    const geojsonData: GeoJSON = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    console.log(
      `Iniciando importação de ${geojsonData.features.length} registros para a tabela ${tableName}.`
    );

    for (const feature of geojsonData.features) {
      const cd_setor = feature.properties.CD_SETOR || 0;
      const situacao = feature.properties.SITUACAO || "";
      const area_km2 = feature.properties.AREA_KM2 || 0;
      const nm_mun = feature.properties.NM_MUN || "";
      const geom = JSON.stringify(feature.geometry);

      const insertQuery = `
        INSERT INTO ${tableName} (cd_setor, situacao, area_km2, nm_mun, geom)
        VALUES ($1, $2, $3, $4, ST_SetSRID(ST_GeomFromGeoJSON($5), 4326))
      `;

      await pool.query(insertQuery, [cd_setor,situacao, area_km2, nm_mun, geom]);
    }

    console.log(`Importação concluída com sucesso na tabela ${tableName}.`);
  } catch (error) {
    console.error("Erro na importação:", error);
  }
}

// Caminho para os arquivos GeoJSON
const campinas = path.join(__dirname, "../../data/", "censo_2022_campinas.geojson");
const jacarei = path.join(__dirname, "../../data/", "censo_2022_jacarei.geojson");
const piracicaba = path.join(__dirname, "../../data/", "censo_2022_piracicaba.geojson");
const ribeirao_preto = path.join(__dirname, "../../data/", "censo_2022_ribeirao_preto.geojson");
const sao_jose_do_rio_preto = path.join(__dirname, "../../data/", "censo_2022_sao_jose_do_rio_preto.geojson");
const sao_jose_dos_campos = path.join(__dirname, "../../data/", "censo_2022_sao_jose_dos_campos.geojson");
const sorocaba = path.join(__dirname, "../../data/", "censo_2022_sorocaba.geojson");

// Executa a função
importGeoJSON(campinas);
importGeoJSON(jacarei);
importGeoJSON(piracicaba);
importGeoJSON(ribeirao_preto);
importGeoJSON(sao_jose_do_rio_preto);
importGeoJSON(sao_jose_dos_campos);
importGeoJSON(sorocaba);

