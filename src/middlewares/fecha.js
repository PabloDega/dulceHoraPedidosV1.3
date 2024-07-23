const verFechaConDia = async (fecha) => {
    let year = fecha.getFullYear();
    let month = fecha.getMonth() + 1;
    let day = fecha.getDate();
    let dia = fecha.getDay();
    let diaNombre = "Sábado";
    switch (dia) {
        case 0:
            diaNombre = "Domingo"
            break;
        case 1:
            diaNombre = "Lunes"
            break;
        case 2:
            diaNombre = "Martes"
            break;
        case 3:
            diaNombre = "Miércoles"
            break;
        case 4:
            diaNombre = "Jueves"
            break;
        case 5:
            diaNombre = "Viernes"
            break;
        default:
            break;
    }
    let resp = {
        numero: day + "/" + month + "/" + year,
        dia: diaNombre,
    };
    return resp;
}

module.exports = {
    verFechaConDia,
}