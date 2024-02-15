import "./index.css";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { createTable } from "./functions/renderTable";

// Global variables
let cleanedData;
let reportInfo;
let numberOfParts = 8;

// DOM Elements
const fileInput = document.getElementById("file-input");
const customDropdown = document.getElementById("custom-dropdown");
const outputSpan = document.getElementById("output-span");
const generateReportBtn = document.getElementById("generate-btn");
const generalReportBtn = document.getElementById("general-report");
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
  let seriesOfWeek = Array.from({ length: numberOfParts }, (_, i) => Math.floor(i / (numberOfParts / 4)) + 1);
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
  downloadIndividualReport(reportInfo, 'reporte-individual')
);
generalReportBtn.addEventListener("click", () => downloadReport(reportInfo, 'reporte-general'));
fileInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return;
  readCSVFile(file);
});
