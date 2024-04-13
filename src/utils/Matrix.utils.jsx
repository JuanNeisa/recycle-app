import * as XLSX from "xlsx";
import { splitingUnitsPerMaterial } from "./ProcessingFile.utils";

function SundaysInAMonth(date) {
  const sundayArr = [];
  const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
  const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  let daysCounter = 0;

  for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
    if (d.getDay() === 0) sundayArr.push(d.getDate());
    daysCounter++;
  }

  return { sundayArr, daysCounter };
}

function randomDates(days, amount) {
  const randomDays = days.sort(() => Math.random() - 0.5);
  return randomDays.slice(0, amount);
}

function setDefaultHeader() {
  const worksheet = XLSX.utils.aoa_to_sheet([]);
  worksheet["!ref"] = "A1:AG25";

  worksheet["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 31 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: 31 } },
    { s: { r: 2, c: 1 }, e: { r: 2, c: 15 } },
    { s: { r: 2, c: 16 }, e: { r: 2, c: 17 } },
    { s: { r: 2, c: 18 }, e: { r: 2, c: 31 } },
    { s: { r: 3, c: 1 }, e: { r: 3, c: 15 } },
    { s: { r: 3, c: 16 }, e: { r: 3, c: 17 } },
    { s: { r: 3, c: 18 }, e: { r: 3, c: 31 } },
  ];
  worksheet["!cols"] = [
    { wch: 12 }, // Ancho de la columna A
    { wch: 4 },
    { wch: 4 },
    { wch: 4 },
    { wch: 4 },
    { wch: 4 },
    { wch: 4 },
    { wch: 4 },
    { wch: 4 },
    { wch: 4 },
    { wch: 4 },
    { wch: 4 },
    { wch: 4 },
    { wch: 4 },
    { wch: 4 },
    { wch: 4 },
    { wch: 4 },
    { wch: 4 },
    { wch: 4 },
    { wch: 4 },
    { wch: 4 },
    { wch: 4 },
    { wch: 4 },
    { wch: 4 },
    { wch: 4 },
    { wch: 4 },
    { wch: 4 },
    { wch: 4 },
    { wch: 4 },
    { wch: 4 },
    { wch: 4 },
    { wch: 4 },
  ];

  //  Set default header for the first sheet in the workbook
  worksheet["A1"] = { v: "ENTRADA DE MATERIAL", t: "s" };
  worksheet["A2"] = { v: "FUNDACIÓN CONCIENCIA RECIPROCO AMBIENTAL", t: "s" };
  worksheet["A3"] = { v: "RECICLADOR", t: "s" };
  worksheet["A4"] = { v: "MACRORUTA", t: "s" };
  worksheet["A5"] = { v: "Dia", t: "s" };
  worksheet["A24"] = { v: "RECHAZO", t: "s" };
  worksheet["Q3"] = { v: "VEHICULO", t: "s" };
  worksheet["Q4"] = { v: "MES", t: "s" };

  // Set daysOfTheMonth
  Array.from({ length: 31 }, (_, index) => index + 1).forEach((day, i) => {
    const cellAddress = XLSX.utils.encode_cell({ r: 4, c: day });
    worksheet[cellAddress] = { v: day, t: "s" };
  });

  return worksheet;
}

function filterByMaterial(array, propiedad) {
  return array.reduce((acc, obj) => {
    const clave = obj[propiedad];
    if (!acc[clave]) {
      acc[clave] = [];
    }
    acc[clave].push(obj);
    return acc;
  }, {});
}

export function setInformation(data, date) {
  const workbook = XLSX.utils.book_new();
  const { sundayArr, daysCounter } = SundaysInAMonth(date);
  const workingDays = Array.from(
    { length: daysCounter },
    (_, index) => index + 1
  ).filter((element) => !sundayArr.includes(element));
  // set Random matrix
  data.result.forEach((person) => {
    const worksheet = setDefaultHeader();
    const matrixData = splitingUnitsPerMaterial(person, data.numberOfParts);
    const filter = filterByMaterial(matrixData, "MATERIAL");

    // set Personal information
    worksheet["B3"] = { v: person.RECICLADOR, t: "s" };
    worksheet["B4"] = { v: person.MACRORUTA, t: "s" };
    worksheet["S3"] = { v: person.VEHICULO, t: "s" };
    worksheet["S4"] = { v: (date.getMonth() + 1) + " - " + date.getFullYear(), t: "s" };

    Object.entries(filter).forEach(([key, value], index) => {
      const randomDaysArr = randomDates(workingDays, data.numberOfParts);
      
      // Set material name
      worksheet["A" + (index + 6)] = { v: key, t: "s" };
      // Set values in material row
      value.forEach((item, i) => {
        const cellAddress = XLSX.utils.encode_cell({
          r: index + 5,
          c: randomDaysArr[i],
        });
        worksheet[cellAddress] = { v: item["Entrada diaria"], t: "s" };
      });

      sundayArr.forEach((dayNumber, j) => {
        const cellAddress = XLSX.utils.encode_cell({
          r: index + 5,
          c: dayNumber,
        });
        worksheet[cellAddress] = { v: "|", t: "s" };
      });
    });

    XLSX.utils.book_append_sheet(workbook, worksheet, person.CEDULA);
  });

  XLSX.writeFile(workbook, "Matriz_Material.xlsx");
}
