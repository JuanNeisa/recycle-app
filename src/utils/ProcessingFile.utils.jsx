import Papa from "papaparse";

const getPersonalData = (recycler) => {
  return Object.fromEntries(
    Object.entries(recycler).filter(([key]) => key === key.toUpperCase())
  );
};

const generationRandomParts = (
  materialName,
  materialValue,
  numberOfParts,
  percentage,
  rejected
) => {
  const decimalPrecision = 1;

  let isValid = false;
  let randomParts = [];

  while (!isValid) {
    // Inicializamos de nuevo los valores
    let remainingMaterialValue = materialValue;
    randomParts = [];
    isValid = true; // Suponemos que será válido al inicio

    const averageValue = materialValue / numberOfParts;
    const max = averageValue + averageValue * percentage;
    const min = averageValue + averageValue * (percentage * -1);

    for (let i = 1; i <= numberOfParts - 1; i++) {
      const randomPart = parseFloat(
        (Math.random() * (max - min) + min).toFixed(decimalPrecision)
      );

      // Verificar si el valor generado excede lo disponible
      if (randomPart > remainingMaterialValue) {
        isValid = false; // Indicamos que no es válido
        break; // Salimos del ciclo y reiniciamos el proceso
      }

      randomParts.push({
        MATERIAL: materialName,
        ["Entrada diaria"]: randomPart,
      });

      remainingMaterialValue -= randomPart;

      // Verificar si remainingMaterialValue es negativo
      if (remainingMaterialValue < 0) {
        isValid = false; // Indicamos que no es válido
        break; // Salimos del ciclo y reiniciamos el proceso
      }
    }

    // Agregar el valor restante al final
    if (isValid) {
      randomParts.push({
        MATERIAL: materialName,
        ["Entrada diaria"]: parseFloat(
          remainingMaterialValue.toFixed(decimalPrecision)
        ),
      });
    }
  }

  // Agregar valores de rechazo
  return randomParts.map((part) => {
    const partValue = part["Entrada diaria"];
    const randomRejected =
      Math.random() * (rejected + 0.05 - rejected) + rejected;
    const rejectedPart = partValue * randomRejected;
    const rejectedValue = rejectedPart >= 1 ? rejectedPart : 0;

    return {
      ...part,
      Rechazado:
        Math.random() < 0.5
          ? parseFloat(rejectedValue.toFixed(decimalPrecision))
          : 0,
    };
  });
};

const recyclingMaterials = (
  materialsArray,
  numberOfParts,
  percentage,
  rejected
) => {
  const randomParts = [];
  materialsArray.forEach(([material, value]) => {
    randomParts.push(
      ...generationRandomParts(
        material,
        value,
        numberOfParts,
        percentage,
        rejected
      )
    );
  });

  return randomParts;
};

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

const getWeekNumber = (fecha) => {
  let sundayCounter = 1;
  const dateObj = new Date(fecha);
  const selectedDay = dateObj.getDate();

  for (let i = selectedDay; i >= 1; i--) {
    if (dateObj.getDay() === 0) sundayCounter++;
    dateObj.setDate(dateObj.getDate() - 1);
  }

  const firstDayOfMonth = new Date(
    dateObj.getFullYear(),
    dateObj.getMonth() + 1,
    1
  );
  return firstDayOfMonth.getDay() === 0 ? sundayCounter - 1 : sundayCounter;
};

const getRandomDays = (
  selectedDate,
  holidays,
  materialsArray,
  numberOfParts
) => {
  const { sundayArr, daysCounter } = sundaysInAMonth(selectedDate);
  sundayArr.push(...holidays);
  const workingDays = Array.from(
    { length: daysCounter },
    (_, index) => index + 1
  ).filter((element) => !sundayArr.includes(element));
  const randomDays = [];

  materialsArray.forEach(() => {
    randomDays.push(
      ...workingDays
        .sort(() => Math.random() - 0.5)
        .slice(0, numberOfParts)
        .sort((a, b) => a - b)
    );
  });

  return randomDays;
};

export function removeBlankPropertiesFromObject(obj) {
  const cleanedObj = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key) && obj[key].trim() !== "") {
      cleanedObj[key] = obj[key];
    }
  }
  return cleanedObj;
}

export function generateGlobalInformation(csvData, selectedDate) {
  const { result, numberOfParts, percentage, rejected, holidays } = csvData;

  const globalResponse = [];
  result.forEach((recycler) => {
    const personalData = getPersonalData(recycler);
    // Random part assign
    const randomParts = recyclingMaterials(
      Object.entries(recycler).filter(([key]) => key !== key.toUpperCase()),
      numberOfParts,
      percentage,
      rejected
    );
    const randomDays = getRandomDays(
      selectedDate,
      holidays,
      Object.entries(recycler).filter(([key]) => key !== key.toUpperCase()),
      numberOfParts
    );

    // Map the new information
    randomParts.forEach((part, i) => {
      globalResponse.push({
        ...personalData,
        ...part,
        ["Numero de semana"]: getWeekNumber(
          selectedDate.getFullYear() +
            "-" +
            (selectedDate.getMonth() + 1) +
            "-" +
            randomDays[i]
        ),
        DIA: randomDays[i],
      });
    });
  });

  return globalResponse;
}

// Improved readCSVFile function
export async function readCSVFile(file, key) {
  try {
    return await parseCSV(file, key);
  } catch (error) {
    console.error("Error reading CSV file:", error);
    throw error;
  }
}

// Function to parse the CSV file
function parseCSV(file, key) {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      complete: (result) => {
        try {
          const cleanedData = result.data
            .filter((row) => row[key]?.trim())
            .map(removeBlankPropertiesFromObject);
          resolve(cleanedData);
        } catch (err) {
          reject(new Error(`Error processing CSV data: ${err.message}`));
        }
      },
      error: (error) => {
        reject(new Error(`Error parsing CSV file: ${error.message}`));
      },
    });
  });
}
