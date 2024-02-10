import "./index.css";
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

function removeBlankPropertiesFromObject(obj) {
    const cleanedObj = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key) && obj[key].trim() !== '') {
            cleanedObj[key] = obj[key];
        }
    }
    return cleanedObj;
  }
  
  function splitingUnitsPerMaterial(person) {
    const { CEDULA, RECICLADOR , ...materials } = person
    let seriesOfWeek = [1,1,2,2,3,3,4,4];
    const response = [];
    Object.entries(materials).forEach(([key, value], i) => {
      const randomNumbersArray = Array.from({ length: 8 }, () => Math.random());
      const randomSum = randomNumbersArray.reduce((total, numero) => total + numero, 0);
      randomNumbersArray.forEach((randomNumber, j)=> {
        response.push(
          {
            CEDULA,
            RECICLADOR,
            MATERIAL: key,
            ['Numero de semana'] : seriesOfWeek[j],
            ['Entrada diaria'] : randomNumber / randomSum * value
          }
        )
      })
    })
    return response
  }
  
  function generateReport(data) {
  
    const report = data.map(splitingUnitsPerMaterial).flat()
    console.log(report)
    //Creacion INFORME Excel
    
    const worksheet = XLSX.utils.json_to_sheet(report);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
      XLSX.writeFile(workbook, 'datos.xlsx');
  }

function readCSVFile(file) {
    Papa.parse(file, {
        header: true,
        complete: (result) => {
            const cleanedData = result.data.filter((row) => row['RECICLADOR'] !== '').map((obj) => removeBlankPropertiesFromObject(obj));
            generateReport(cleanedData)
        },
        error: (error) => {
            console.error('Error processing CSV file:', error);
        }
    });
  }

document.getElementById("fileInput").addEventListener("change", (event) => {
    const file = (event.target).files[0];
    if (!file) return;
    readCSVFile(file);
});
