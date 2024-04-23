const getPersonalData = (recycler) => {
  return Object.fromEntries(
    Object.entries(recycler).filter(([key]) => key === key.toUpperCase())
  );
};

const generationRandomParts = (materialName, materialValue, numberOfParts) => {
  const decimalPrecision = 1;
  const promedio = materialValue / numberOfParts;
  const partes = [];

  // Iteramos sobre el número de partes
  for (let i = 0; i < numberOfParts - 1; i++) {
    // Generamos un valor aleatorio dentro del rango del promedio más/menos 5%
    let parte = promedio + Math.random() * 0.1 * promedio - 0.05 * promedio;
    // Redondeamos la parte al número de decimales especificado
    parte = parseFloat(parte.toFixed(decimalPrecision));
    // Añadimos la parte al arreglo
    partes.push({
      MATERIAL: materialName,
      ["Entrada diaria"]: parseFloat(parte),
    });
    // Restamos el valor de la parte al total
    materialValue -= parte;
  }

  // La última parte es el resto que queda
  partes.push({
    MATERIAL: materialName,
    ["Entrada diaria"]: parseFloat(materialValue.toFixed(decimalPrecision)),
  });
  return partes;
};

const recyclingMaterials = (materialsArray, numberOfParts) => {
  const randomParts = [];
  materialsArray.forEach(([material, value]) => {
    randomParts.push(...generationRandomParts(material, value, numberOfParts));
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
  return sundayCounter;
};

const getRandomDays = (selectedDate, materialsArray, numberOfParts) => {
  const { sundayArr, daysCounter } = sundaysInAMonth(selectedDate);
  const workingDays = Array.from(
    { length: daysCounter },
    (_, index) => index + 1
  ).filter((element) => !sundayArr.includes(element));
  const randomDays = [];

  materialsArray.forEach(() => {
    randomDays.push(
      ...workingDays.sort(() => Math.random() - 0.5).slice(0, numberOfParts).sort((a, b) => a - b)
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
  const { result, numberOfParts } = csvData;

  const globalResponse = [];
  result.forEach((recycler) => {
    const personalData = getPersonalData(recycler);
    // Random part assign
    const randomParts = recyclingMaterials(
      Object.entries(recycler).filter(([key]) => key !== key.toUpperCase()),
      numberOfParts
    );
    const randomDays = getRandomDays(
      selectedDate,
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
