const $ = (id) => document.getElementById(id);
function calcularIMC() {
    const peso = parseFloat($("peso").value);
    const altura = parseFloat($("altura").value);
    const edad = parseInt($("edad").value);
    const genero = $("genero").value;
    const actividad = $("actividad").value;

    // Validar los datos de entrada
    if (isNaN(peso) || isNaN(altura) || isNaN(edad) || peso <= 0 || altura <= 0 || edad <= 0) {
        alert("Por favor, ingresa valores válidos.");
        return;
    }

    // Calcular IMC
    const imc = (peso / (altura * altura)).toFixed(2);
    $("imcResultado").textContent = imc;

    // Clasificación del IMC
    let clasificacion;
    switch (true) {
        case imc < 18.5:
            clasificacion = "Bajo peso";
            break;
        case imc >= 18.5 && imc < 25:
            clasificacion = "Peso normal";
            break;
        case imc >= 25 && imc < 30:
            clasificacion = "Sobrepeso";
            break;
        default:
            clasificacion = "Obesidad";
    }
    $("clasificacion").textContent = clasificacion;
    $("resultado").style.display = "block";

    // Calcular TDEE (Total Daily Energy Expenditure)
    const tdee = calcularTDEE(peso, altura, edad, genero, actividad);
    $("tdee").textContent = `Calorías diarias recomendadas: ${tdee.toFixed()} kcal`;

    // Recomendaciones nutricionales
    const recomendaciones = obtenerRecomendaciones(imc);
    $("recomendaciones").textContent = recomendaciones;

    // Marcar el rango correspondiente en la tabla
    marcarRango(imc);
}

function calcularTDEE(peso, altura, edad, genero, actividad) {
    const bmr = genero === "masculino"
        ? 10 * peso + 6.25 * altura * 100 - 5 * edad + 5
        : 10 * peso + 6.25 * altura * 100 - 5 * edad - 161;

    const factorActividad = {
        "sedentario": 1.2,
        "ligero": 1.375,
        "moderado": 1.55,
        "intenso": 1.725
    }[actividad] || 1.2;

    return bmr * factorActividad;
}

function obtenerRecomendaciones(imc) {
    switch (true) {
        case imc < 18.5:
            return "Estás por debajo del peso saludable. Es importante incrementar tu ingesta calórica y consultar con un profesional.";
        case imc >= 18.5 && imc < 25:
            return "Tu peso es saludable. Mantén una dieta balanceada y sigue un estilo de vida activo.";
        case imc >= 25 && imc < 30:
            return "Tienes sobrepeso. Considera ajustar tu dieta y aumentar la actividad física.";
        default:
            return "Estás en el rango de obesidad. Es recomendable buscar asesoramiento médico para adoptar hábitos saludables.";
    }
}

function marcarRango(imc) {
    const classAdd = 'table--imc__rowselected';
    const filas = document.querySelectorAll('#tablaIMC tr');
    filas.forEach(fila => fila.classList.remove(classAdd));
    
    switch (true) {
        case imc < 18.5:
            filas[1].classList.add(classAdd);
            break;
        case imc >= 18.5 && imc < 25:
            filas[2].classList.add(classAdd);
            break;
        case imc >= 25 && imc < 30:
            filas[3].classList.add(classAdd);
            break;
        default:
            filas[4].classList.add(classAdd);
    }
}
