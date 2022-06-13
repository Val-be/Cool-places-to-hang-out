const connect = require("../db/index");
const Place = require("../models/Place.model");
const mongoose = require("mongoose");
const rawGreenSpaces = require("./ilots-de-fraicheur-espaces-verts-frais.json");
const rawTerrasses = require("./terrasses-autorisations.json");

//Convert terrasses to schema
function convertRawTerrassesToSchema(terrasse) {
  const name = terrasse.fields.nom_societe
    .replace("SAL", "")
    .replace("SARL", "")
    .replace("SAS", "")
    .trim();
  const adress = terrasse.fields.adresse + " " + terrasse.fields.arrondissement;
  const geolocation = terrasse.fields.geo_shape.coordinates;
  const typology = terrasse.fields.typologie;
  return {
    name,
    adress,
    geolocation,
    typology,
  };
}

//Converts green spaces to schema
function convertRawGreenSpacesToSchema(greenSpace) {
  const name = greenSpace.fields.nom;
  const adress =
    greenSpace.fields.adresse + " " + greenSpace.fields.arrondissement;
  const geolocation = greenSpace.fields.geo_shape.coordinates;
  const typology = greenSpace.fields.categorie;
  return {
    name,
    adress,
    geolocation,
    typology,
  };
}

//Seeds the DB
async function seedDB() {
  await connect();

  const formatedTerrasses = rawTerrasses
    .filter((obj) => {
      return (
        obj.fields.typologie !== "ETALAGE" &&
        obj.fields.typologie !== "CONTRE ETALAGE"
      );
    })
    .map(convertRawTerrassesToSchema);

  const foramtedGreenSpaces = rawGreenSpaces.map(convertRawGreenSpacesToSchema);

  const createdTerrasses = await Place.create(formatedTerrasses);
  const createdGreenSpaces = await Place.create(foramtedGreenSpaces);

  console.log(
    `Created ${createdTerrasses.length} terrasses and ${createdGreenSpaces.length} green spaces`
  );

  await mongoose.connection.close();
  console.log("Connection closed.");
}

seedDB();