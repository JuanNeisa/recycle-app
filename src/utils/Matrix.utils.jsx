import { arrayIncludes } from "@mui/x-date-pickers/internals/utils/utils";
import * as XLSX from "xlsx";

const sundaysInAMonth = (date) => {
  const sundayArr = [];
  const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
  const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  let daysCounter = 0;

  for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
    if (d.getDay() === 0) sundayArr.push(d.getDate());
    daysCounter++;
  }

  return { sundayArr, daysCounter };
};

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

const filterByMaterial = (array, propiedad) =>{
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
  const { sundayArr, daysCounter } = sundaysInAMonth(date);
  // set Random matrix
  data.forEach(([CEDULA, materialsArray], i) => {
    const worksheet = setDefaultHeader();

    // set Personal information
    worksheet["B3"] = { v: materialsArray[0].RECICLADOR, t: "s" };
    worksheet["B4"] = { v: materialsArray[0].MACRORUTA, t: "s" };
    worksheet["S3"] = { v: materialsArray[0].VEHICULO, t: "s" };
    worksheet["S4"] = { v: (date.getMonth() + 1) + " - " + date.getFullYear(), t: "s" };

    Object.entries(filterByMaterial(materialsArray, 'MATERIAL')).forEach(([material, arrayPerMaterial], j) => {
      // Set material name
      worksheet["A" + (j + 6)] = { v: material, t: "s" };

       // Set values in material row
       arrayPerMaterial.forEach((item, i) => {
        const cellAddress = XLSX.utils.encode_cell({
          r: j + 5,
          c: item.DIA,
        });
        worksheet[cellAddress] = { v: item["Entrada diaria"], t: "n" };
      });

      sundayArr.forEach((dayNumber, k) => {
        const cellAddress = XLSX.utils.encode_cell({
          r: j + 5,
          c: dayNumber,
        });
        worksheet[cellAddress] = { v: "|", t: "s" };
      });
    })

    XLSX.utils.book_append_sheet(workbook, worksheet, CEDULA);
  });

  // Download Excel file
  // XLSX.writeFile(workbook, "Matriz_Material.xlsx");
  return workbook;
}
