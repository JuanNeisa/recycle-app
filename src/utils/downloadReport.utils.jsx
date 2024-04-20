import * as XLSX from "xlsx";
import JSZip from "jszip";
import FileSaver from "file-saver";

// Utils
import { setInformation } from "./Matrix.utils";

export function filterByProperty(array, property) {
  return array.reduce((acc, obj) => {
    const clave = obj[property];
    if (!acc[clave]) {
      acc[clave] = [];
    }
    acc[clave].push(obj);
    return acc;
  }, {});
}

const s2ab = (s) => {
  const buf = new ArrayBuffer(s.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
  return buf;
};

function downloadGeneralReport(data) {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Hoja1");

  // Download Excel file
  // XLSX.writeFile(workbook, "reporte-general.xlsx");
  return new Blob([s2ab(XLSX.write(workbook, { type: "binary" }))], {
    type: "application/octet-stream",
  });
}

function downloadIndividualReport(data) {
  const workbook = XLSX.utils.book_new();
  const filter = filterByProperty(data, "CEDULA");

  Object.entries(filter).forEach(([key, value]) => {
    const worksheet = XLSX.utils.json_to_sheet(value);
    XLSX.utils.book_append_sheet(workbook, worksheet, key);
  });

  // Download Excel file
  // XLSX.writeFile(workbook, "reporte-individual.xlsx");
  return new Blob([s2ab(XLSX.write(workbook, { type: "binary" }))], {
    type: "application/octet-stream",
  });
}

function downloadMatrixReport(data, selectedDate) {
  const filter = filterByProperty(data, "CEDULA");
  const workbook = setInformation(Object.entries(filter), selectedDate);

  return new Blob([s2ab(XLSX.write(workbook, { type: "binary" }))], {
    type: "application/octet-stream",
  });
}

export function downloadZipFile(data, selectedDate) {
  const zip = new JSZip();
  const individualReportBlob = downloadIndividualReport(data);
  const generalReportBlob = downloadGeneralReport(data);
  const matrixReport = downloadMatrixReport(data, selectedDate);

  zip.file("reporte-Individual.xlsx", individualReportBlob);
  zip.file("reporte-General.xlsx", generalReportBlob);
  zip.file("matriz-materiales.xlsx", matrixReport);

  zip.generateAsync({ type: "blob" }).then((blob) => {
    FileSaver.saveAs(blob, "reportes.zip");
  });
}
