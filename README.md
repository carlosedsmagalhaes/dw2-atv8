# Servidor de Importação e Consulta de Dados Censitários

Este projeto implementa um servidor Express com Node.js para importação e consulta de dados censitários geoespaciais provenientes de arquivos no formato GeoJSON.

## Estrutura do Projeto

- Os dados estão localizados na pasta `data/`, contendo arquivos GeoJSON com informações do Censo 2022 de diversas cidades do estado de São Paulo.
- O script `load.ts` realiza a importação dos dados geoespaciais para o banco de dados PostgreSQL com PostGIS.
- O servidor expõe rotas REST para consulta desses dados via API.

## Endpoints da API

### `GET /censo?city=name`
Lista todos os setores censitários de uma cidade armazenados no banco de dados.

### `GET /censo/point?y=<latitude>&x=<longitude>`
Consulta o setor censitário que contém o ponto geográfico fornecido.

**Exemplo de requisição:**
```
http://localhost:3001/censo/point?y=-23.354557&x=-45.955810
```

**Exemplo de resposta:**
```json
{
  "cd_setor": "352440205000236",
  "situacao": "Rural",
  "area_km2": 44.9009403805158,
  "nm_mun": "Jacareí",
  "geom": "MULTIPOLYGON(...)"
}
```

## Instalação
1. Clone o repositório:
```
git clone https://github.com/arleysouza/dw2-atv8.git server
```
2. Acesse a pasta do projeto e instale as dependências:
```
cd server
npm install
```


## Carregamento dos Dados no Banco de Dados
1. Crie um banco de dados no PostgreSQL;
2. Edite o arquivo `.env` com os parâmetros de conexão apropriados (usuário, senha, host e nome do banco);
3. No pgAdmin (ou outro cliente PostgreSQL), copie os comandos do arquivo `data/comandos.sql` e cole para excecutar os comando para criar a tabela no banco de dados;
4. Execute o comando `npm run load` para carregar os arquivos `data/*.geojson` nas tabela `censo` .
