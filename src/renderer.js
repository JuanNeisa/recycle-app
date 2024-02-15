import "./index.css";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { createTable } from "./functions/renderTable";

// Global variables
let cleanedData;
let numberOfParts = 8;

// DOM Elements
const fileInput = document.getElementById("file-input");
const outputSpan = document.getElementById("output-span");
const generalReportBtn = document.getElementById("general-report");
const individualReportBtn = document.getElementById("individual-report");
const tableContainer = document.getElementById("report-viewer");

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
  const average = material / numberOfParts;
  const parts = [];
  let sum = 0;
  for (let i = 0; i < numberOfParts - 1; i++) {
    const factor = 0.5 + Math.random();
    let part = average * factor;
    part = Math.round(part * 100) / 100;
    if (part <= 0) part = 0.01;
    parts.push(part);
    sum += part;
  }
  let lastPart = material - sum;
  lastPart = Math.round(lastPart * 100) / 100;
  if (lastPart <= 0) lastPart = 0.01;
  parts.push(lastPart);

  return parts;
}

function splitingUnitsPerMaterial(person) {
  const { CEDULA, RECICLADOR, ...materials } = person;
  let seriesOfWeek = [1, 1, 2, 2, 3, 3, 4, 4];
  const response = [];
  // Creation of random parts
  Object.entries(materials).forEach(([key, value], i) => {
    generationRandomParts(value).forEach((part, j) => {
      response.push({
        CEDULA,
        RECICLADOR,
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

function generateGeneralReport(data) {
  // Limpiar la pantalla
  tableContainer.innerHTML = "";
  const { CEDULA, RECICLADOR, ...materials } = data[0];
  const sumaryResult = [
    {
      "Numero de personas": data.length,
      "Numero de materiales": Object.keys(materials).length,
      "Numero de partes": numberOfParts,
    },
  ];
  const renderTable = createTable(sumaryResult);
  tableContainer.appendChild(renderTable);

  const report = data.map(splitingUnitsPerMaterial).flat();
  const downloadButton = document.createElement("button");
  downloadButton.innerHTML = "Descargar reporte";
  downloadButton.classList.add("custom-botton");
  downloadButton.style.margin = "20px 12px";
  downloadButton.addEventListener("click", () => {
    downloadReport(report, "Reporte-general");
  });
  tableContainer.appendChild(downloadButton);
}

function generateIndividualReport(data) {
  // Limpiar la pantalla
  tableContainer.innerHTML = "";
  const sumaryResult = data.map(({ CEDULA, RECICLADOR, ...rest }) => {
    return {
      CEDULA,
      NOMBRE: RECICLADOR,
       "UNIDADES DE MATERIAL RECICLADO": Object.values(rest).reduce((a, b) => parseInt(a) + parseInt(b), 0),
    };
  });
  const renderTable = createTable(sumaryResult);
  tableContainer.appendChild(renderTable);

  // Generar reporte
  const report = data.map(splitingUnitsPerMaterial).flat();
  const downloadButton = document.createElement("button");
  downloadButton.innerHTML = "Descargar reporte";
  downloadButton.classList.add("custom-botton");
  downloadButton.style.margin = "20px 12px";
  downloadButton.addEventListener("click", () => {
    downloadIndividualReport(report, "Reporte-individual");
  });
  tableContainer.appendChild(downloadButton);
}

function enableReportsGeneration() {
  outputSpan.innerHTML = "🟢 Informacion cargada correctamente";
  generalReportBtn.style.display = "inline";
  individualReportBtn.style.display = "inline";
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
individualReportBtn.addEventListener("click", () =>
  generateIndividualReport(cleanedData)
);
generalReportBtn.addEventListener("click", () =>
  generateGeneralReport(cleanedData)
);
fileInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return;
  readCSVFile(file);
});
