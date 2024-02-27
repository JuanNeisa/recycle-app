import "./index.css";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { createTable } from "./functions/renderTable";

// Global variables
let cleanedData;
let reportInfo;
let numberOfParts = 8;
let reportHeader;
let decimalPrecision = 1;

// DOM Elements
const fileInput = document.getElementById("file-input");
const customDropdown = document.getElementById("custom-dropdown");
const outputSpan = document.getElementById("output-span");
const generateReportBtn = document.getElementById("generate-btn");
const generalReportBtn = document.getElementById("general-report");
const decimalPrecisionBtn = document.getElementById("decimal-precision");
const individualReportBtn = document.getElementById("individual-report");
const tableContainer = document.getElementById("report-viewer");
const reportContainer = document.getElementById("report-container");

function removeBlankPropertiesFromObject(obj) {
  const cleanedObj = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key) && obj[key].trim() !== "") {
      cleanedObj[key] = obj[key];
    }
  }
  return cleanedObj;
}

function generationRandomParts(material) {
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

function splitingUnitsPerMaterial(person) {
  let seriesOfWeek = Array.from(
    { length: numberOfParts },
    (_, i) => Math.floor(i / (numberOfParts / 4)) + 1
  );
  const response = [];
  let objHeaderResponse = {};
  reportHeader.forEach((headerItem) => {
    objHeaderResponse[headerItem] = person[headerItem];
  });
  // Creation of random parts
  Object.entries(person)
    .filter(([key,]) => key !== key.toUpperCase())
    .forEach(([key, value], i) => {
      generationRandomParts(value).forEach((part, j) => { 
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

function downloadReport(data, nombre) {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Hoja1");
  XLSX.writeFile(workbook, nombre + ".xlsx");
}

function downloadIndividualReport(data, nombre) {
  const workbook = XLSX.utils.book_new();
  cleanedData.forEach((reclycleObj) => {
    const dataFilter = data.filter((row) => row.CEDULA === reclycleObj.CEDULA);
    const worksheet = XLSX.utils.json_to_sheet(dataFilter);
    XLSX.utils.book_append_sheet(workbook, worksheet, reclycleObj.CEDULA);
  });
  XLSX.writeFile(workbook, nombre + ".xlsx");
}

function generateInfoReport(data) {
  generalReportBtn.disabled = false;
  individualReportBtn.disabled = false;

  reportInfo = data.map(splitingUnitsPerMaterial).flat();

  // Limpiar la pantalla
  tableContainer.innerHTML = "";
  const { CEDULA, RECICLADOR, ...materials } = data[0];
  const sumaryResult = [
    {
      "Numero de personas": data.length,
      "Numero de materiales": Object.keys(materials).length,
      "Numero de partes": numberOfParts,
      "Cantidad decimales": decimalPrecision
    },
  ];
  const renderTable = createTable(sumaryResult);
  tableContainer.appendChild(renderTable);
}

function enableReportsGeneration() {
  outputSpan.innerHTML = "🟢 Informacion cargada correctamente";
  reportContainer.style.display = "block";
  // Limpiar la pantalla
  tableContainer.innerHTML = "";
  generalReportBtn.disabled = true;
  individualReportBtn.disabled = true;
  customDropdown.value = "";
  reportHeader = Object.keys(cleanedData[0]).filter(
    (item) => item === item.toUpperCase()
  );
}

function readCSVFile(file) {
  Papa.parse(file, {
    header: true,
    complete: (result) => {
      cleanedData = result.data
        .filter((row) => row["RECICLADOR"] !== "")
        .map((obj) => removeBlankPropertiesFromObject(obj));
      enableReportsGeneration();
    },
    error: (error) => {
      console.error("Error processing CSV file:", error);
      outputSpan.innerHTML =
        "🔴 Error al cargar la informacion: { " + error + " }";
    },
  });
}

// EventListeners
customDropdown.addEventListener("change", function () {
  if (customDropdown.value !== "") {
    numberOfParts = customDropdown.value;
    generateReportBtn.disabled = false;
  } else {
    generateReportBtn.disabled = true;
  }
});
generateReportBtn.addEventListener("click", () =>
  generateInfoReport(cleanedData)
);
individualReportBtn.addEventListener("click", () =>
  downloadIndividualReport(reportInfo, "reporte-individual")
);
generalReportBtn.addEventListener("click", () =>
  downloadReport(reportInfo, "reporte-general")
);
fileInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return;
  readCSVFile(file);
});
decimalPrecisionBtn.addEventListener("change", function () {
  if (decimalPrecisionBtn.value > 0 && decimalPrecisionBtn.value <= 4) {
    decimalPrecision = decimalPrecisionBtn.value;
  }
});