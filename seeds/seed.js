const connect = require('../db/index');
const Place = require('../models/Place.model');
const mongoose = require('mongoose');
const rawGreenSpaces = require('./ilots-de-fraicheur-espaces-verts-frais.json');
const rawTerrasses = require('./terrasses-autorisations.json');

//Convert terrasses to schema
function convertRawTerrassesToSchema(terrasse) {
  let name = null;
  if (terrasse.fields.nom_enseigne) {
    name = terrasse.fields.nom_enseigne
      .replace('SAL', '')
      .replace('SARL', '')
      .replace('SAS', '')
      .replace('SNC', '')
      .replace('SOC', '')
      .trim();
  } else {
    name = terrasse.fields.nom_societe
      .replace('SAL', '')
      .replace('SARL', '')
      .replace('SAS', '')
      .trim();
  }
  const address =
    terrasse.fields.adresse + ' ' + terrasse.fields.arrondissement;
  let geometry = { type: 'Point', coordinates: [0, 0] };
  if (terrasse.geometry) {
    geometry = terrasse.geometry;
  }
  const typology = terrasse.fields.typologie;
  console.log(name);
  return {
    name,
    address,
    geometry,
    typology,
  };
}

//Converts green spaces to schema
function convertRawGreenSpacesToSchema(greenSpace) {
  const name = greenSpace.fields.nom;
  const address =
    greenSpace.fields.adresse + ' ' + greenSpace.fields.arrondissement;
  const { geo_shape } = greenSpace.fields;
  const typology = greenSpace.fields.categorie;
  return {
    name,
    address,
    geometry: geo_shape,
    typology,
  };
}

//Seeds the DB
async function seedDB() {
  await connect();

  const formatedTerrasses = rawTerrasses
    .filter((obj) => {
      if (
        obj.fields.typologie !== 'ETALAGE' &&
        obj.fields.typologie !== 'CONTRE ETALAGE'
      ) {
        return true;
      }
      return false;
    })
    .map(convertRawTerrassesToSchema);

  const foramtedGreenSpaces = rawGreenSpaces.map(convertRawGreenSpacesToSchema);

  const createdTerrasses = await Place.create(formatedTerrasses);
  const createdGreenSpaces = await Place.create(foramtedGreenSpaces);

  console.log(
    `Created ${createdTerrasses.length} terrasses and ${createdGreenSpaces.length} green spaces`
  );

  await mongoose.connection.close();
  console.log('Connection closed.');
}

seedDB();
