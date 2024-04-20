import Papa from "papaparse";
import * as XLSX from "xlsx";

export function removeBlankPropertiesFromObject(obj) {
  const cleanedObj = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key) && obj[key].trim() !== "") {
      cleanedObj[key] = obj[key];
    }
  }
  return cleanedObj;
}

export function generationRandomParts(material, numberOfParts) {
  const decimalPrecision = 1;
  const promedio = material / numberOfParts;
  const partes = [];

  // Iteramos sobre el número de partes
  for (let i = 0; i < numberOfParts - 1; i++) {
    // Generamos un valor aleatorio dentro del rango del promedio más/menos 5%
    let parte = promedio + Math.random() * 0.1 * promedio - 0.05 * promedio;
    // Redondeamos la parte al número de decimales especificado
    parte = parseFloat(parte.toFixed(decimalPrecision));
    // Añadimos la parte al arreglo
    partes.push(parseFloat(parte));
    // Restamos el valor de la parte al total
    material -= parte;
  }

  // La última parte es el resto que queda
  partes.push(parseFloat(material.toFixed(decimalPrecision)));

  return partes;
}

export function splitingUnitsPerMaterial(person, numberOfParts) {
  let seriesOfWeek = Array.from(
    { length: numberOfParts },
    (_, i) => Math.floor(i / (numberOfParts / 4)) + 1
  );
  const response = [];

  // Add personal information
  let objHeaderResponse = {};
  Object.entries(person)
    .filter(([key]) => key === key.toUpperCase())
    .forEach(([key, value]) => {
      objHeaderResponse[key] = value;
    });

  // Creation of random parts
  Object.entries(person)
    .filter(([key]) => key !== key.toUpperCase())
    .forEach(([key, value], i) => {
      generationRandomParts(value, numberOfParts).forEach((part, j) => {
        response.push({
          ...objHeaderResponse,
          MATERIAL: key,
          ["Numero de semana"]: seriesOfWeek[j],
          ["Entrada diaria"]: part,
        });
      });
    });
  return response;
}

export function downloadReport(data, nombre) {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Hoja1");
  XLSX.writeFile(workbook, nombre + ".xlsx");
}

export function downloadIndividualReport(data, cleanedData, nombre) {
  const workbook = XLSX.utils.book_new();
  cleanedData.forEach((reclycleObj) => {
    const dataFilter = data.filter((row) => row.CEDULA === reclycleObj.CEDULA);
    const worksheet = XLSX.utils.json_to_sheet(dataFilter);
    XLSX.utils.book_append_sheet(workbook, worksheet, reclycleObj.CEDULA);
  });
  XLSX.writeFile(workbook, nombre + ".xlsx");
}
