export function createTable(data) {
    const tabla = document.createElement("table");
    const cabecera = document.createElement("tr");

    // Header
    for (let key in data[0]) {
        const th = document.createElement("th");
        th.textContent = key;
        cabecera.appendChild(th);
    }
    tabla.appendChild(cabecera);

    // Data
    data.forEach(item => {
        const fila = document.createElement("tr");
        for (let key in item) {
            const celda = document.createElement("td");
            celda.textContent = item[key];
            fila.appendChild(celda);
        }
        tabla.appendChild(fila);
    });

    return tabla;
}