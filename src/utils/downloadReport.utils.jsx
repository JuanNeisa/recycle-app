import * as XLSX from "xlsx";
import JSZip from "jszip";
import FileSaver from "file-saver";
import dayjs from 'dayjs';

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

function downloadMatrixReport(data, selectedDate, holidays) {
  const filter = filterByProperty(data, "CEDULA");
  const workbook = setInformation(Object.entries(filter), selectedDate, holidays);

  return new Blob([s2ab(XLSX.write(workbook, { type: "binary" }))], {
    type: "application/octet-stream",
  });
}

function downloadMassBalancReport(data, materialsCode) {
  const workbook = XLSX.utils.book_new();
  let index = 0;

  while (data[index]) {
    const valorActual = data[index];
    const valorSiguiente = data[index + 1];
    const massObject = {
      MACRORUTA: valorActual.MACRORUTA,
      SEMANA: valorActual["Numero de semana"] || valorActual.SEMANA,
      ID_RECICLADOR: valorActual.CEDULA || valorActual.ID_RECICLADOR,
      VEHICULO: valorActual.VEHICULO,
      CANTIDAD_MATERIAL:
        valorActual["Entrada diaria"] || valorActual.CANTIDAD_MATERIAL,
      TIPO_MATERIAL:
        materialsCode[valorActual.MATERIAL] || valorActual.TIPO_MATERIAL,
      RECHAZO: parseFloat(valorActual.Rechazado ?? valorActual.RECHAZO),
    };

    if (
      valorSiguiente &&
      (valorSiguiente.MATERIAL === valorActual.MATERIAL ||
        materialsCode[valorSiguiente.MATERIAL] === valorActual.TIPO_MATERIAL) &&
      (valorSiguiente["Numero de semana"] === valorActual["Numero de semana"] ||
        valorSiguiente["Numero de semana"] === valorActual.SEMANA)
    ) {
      massObject.CANTIDAD_MATERIAL =
        parseFloat(valorSiguiente["Entrada diaria"]) +
        parseFloat(
          valorActual["Entrada diaria"] || valorActual.CANTIDAD_MATERIAL
        );
      massObject.RECHAZO = valorSiguiente.Rechazado +
      (valorActual.Rechazado ?? valorActual.RECHAZO);
      data[index] = massObject;
      data.splice(index + 1, 1);
    } else {
      data[index] = massObject;
      index++;
    }
  }

  const worksheet = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(workbook, worksheet, "Hoja1");

  return new Blob([s2ab(XLSX.write(workbook, { type: "binary" }))], {
    type: "application/octet-stream",
  });
}

export function downloadZipFile(data, selectedDate, holidays, materialsCode) {
  const zip = new JSZip();
  const instantTime = new Date();
  const individualReportBlob = downloadIndividualReport(data);
  const generalReportBlob = downloadGeneralReport(data);
  const matrixReport = downloadMatrixReport(data, selectedDate, holidays);
  const massBalanceReport = downloadMassBalancReport(data, materialsCode);

  zip.file("reporte-individual.xlsx", individualReportBlob);
  zip.file("reporte-general.xlsx", generalReportBlob);
  zip.file("matriz-materiales.xlsx", matrixReport);
  zip.file("balance-masas.xlsx", massBalanceReport);

  zip.generateAsync({ type: "blob" }).then((blob) => {
    FileSaver.saveAs(blob, "reporte_" + dayjs().format('YYYYMMDD_HHmmss') + ".zip");
  });
}
