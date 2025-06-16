DROP TABLE IF EXISTS censo;
CREATE EXTENSION postgis;
CREATE TABLE censo (
    cd_setor BIGINT PRIMARY KEY,
    situacao VARCHAR(50),
    area_km2 FLOAT,
    nm_mun VARCHAR(100),
    geom GEOMETRY(MultiPolygon, 4326)
);

