// Variables globales que controlan los pasos y el acumulador
let step = 0; // Mantiene la cuenta del paso actual en la simulación
let acumulador = 0; // Acumula los resultados de las operaciones realizadas

// Agregamos los listeners para los botones de "Siguiente paso" y "Reiniciar"
document.getElementById('nextStepBtn').addEventListener('click', nextStep);
document.getElementById('resetBtn').addEventListener('click', resetSimulation);

// Diccionario de operaciones con sus códigos binarios correspondientes
const operationCodes = {
    'suma': '0000',
    'resta': '0001',
    'producto': '0010',
    'exponente': '0011',
    'and': '0100',
    'or': '0101',
    'moverMemoria': '0110',
    'finalizar': '0111'
};

// Función principal que controla el flujo de la simulación
function nextStep() {
    // Referencia al mensaje de explicación
    const explicacion = document.getElementById('mensajeExplicacion');
    resetHighlight(); // Resetea los efectos de resaltado en cada paso
    
    // Control de los diferentes pasos de la simulación
    if (step === 0) {
        // Paso 0: Preparar memoria para cargar valores (Fase Fetch)
        explicacion.textContent = "Paso 1: Fase Fetch - Preparando la memoria para cargar los valores.";
        updateALU("Fase Fetch: Preparando memoria...");
        highlightElement('memory'); // Resalta la memoria

    } else if (step === 1) {
        // Paso 1: Cargar valores de memoria en registros A y B (Fase Fetch)
        document.getElementById('regA').textContent = "1000"; // Valor 8 en binario
        document.getElementById('regB').textContent = "0011"; // Valor 3 en binario
        explicacion.textContent = "Paso 2: Fase Fetch - Los valores de la memoria se cargan en los registros. Registro A = 1000 (8), Registro B = 0011 (3).";
        updateALU("Fase Fetch: Cargando valores en registros...");
        highlightElement('registers'); // Resalta los registros

    } else if (step === 2) {
        // Paso 2: Preparar la operación de resta en la ALU (Fase Decode)
        explicacion.textContent = "Paso 3: Fase Decode - Preparando los valores para la operación de resta en la ALU.";
        updateALU("Fase Decode: Preparando para operar...");
        // Actualiza los detalles de la ALU (valores, operación, código binario)
        updateALUDetails("1000", "0011", "Restando...", operationCodes.resta);
        highlightElement('alu'); // Resalta la ALU

    } else if (step === 3) {
        // Paso 3: Ejecutar la operación de resta (Fase Decode)
        let result = parseInt("1000", 2) - parseInt("0011", 2); // Restar 8 - 3
        acumulador = result; // Almacena el resultado en el acumulador
        document.getElementById('aluMessage').textContent = `ALU: 8 - 3 = ${result}`;
        explicacion.textContent = "Paso 4: Fase Decode - La ALU realiza la resta. Resultado: 8 - 3 = 5.";
        updateALU("Fase Decode: Restando valores...");
        document.getElementById('regC').textContent = result.toString(2).padStart(4, '0'); // Almacena el resultado en Registro C en binario
        document.getElementById('acumulador').textContent = acumulador.toString(2).padStart(4, '0'); // Actualiza el acumulador con el resultado
        // Actualiza los detalles de la ALU con el resultado
        updateALUDetails("1000", "0011", result.toString(2), operationCodes.resta);
        highlightElement('alu'); // Resalta la ALU

    } else if (step === 4) {
        // Paso 4: Preparar la operación de elevar al cubo (Fase Execute)
        explicacion.textContent = "Paso 5: Fase Execute - El resultado ahora será elevado al cubo.";
        updateALU("Fase Execute: Preparando para elevar al cubo...");
        highlightElement('alu'); // Resalta la ALU

    } else if (step === 5) {
        // Paso 5: Ejecutar la operación de elevar al cubo (Fase Execute)
        let base = parseInt(document.getElementById('regC').textContent, 2); // Convierte el valor en el Registro C a decimal
        let finalResult = Math.pow(base, 3); // Eleva el valor al cubo
        acumulador = finalResult; // Almacena el resultado en el acumulador
        document.getElementById('aluMessage').textContent = `ALU: 5 ^ 3 = ${finalResult}`;
        explicacion.textContent = "Paso 6: Fase Execute - El resultado 5 es elevado al cubo. 5^3 = 125.";
        updateALU("Fase Execute: Calculando 5^3...");
        document.getElementById('regC').textContent = finalResult.toString(2); // Almacena el resultado en binario en el Registro C
        document.getElementById('acumulador').textContent = acumulador.toString(2); // Actualiza el acumulador
        // Actualiza los detalles de la ALU
        updateALUDetails(base.toString(2), "N/A", finalResult.toString(2), operationCodes.exponente);
        highlightElement('alu'); // Resalta la ALU

    } else if (step === 6) {
        // Paso 6: Almacenar el resultado final en memoria (Fase Store)
        document.getElementById('aluMessage').textContent = "Resultado final almacenado en Registro C";
        document.getElementById('mem0').textContent = document.getElementById('regC').textContent; // Guarda el resultado en la memoria
        explicacion.textContent = "Paso 7: Fase Store - El resultado final se almacena en la memoria.";
        updateALU("Fase Store: Guardando en memoria...");
        highlightElement('memory'); // Resalta la memoria
    }

    // Avanzar al siguiente paso o finalizar la simulación
    step++;
    if (step > 6) {
        document.getElementById('nextStepBtn').disabled = true; // Desactiva el botón una vez completada la simulación
        updateALU("Simulación completada.");
        explicacion.textContent = "Simulación completada.";
        // Resetea los detalles de la ALU
        updateALUDetails("N/A", "N/A", "N/A", operationCodes.finalizar);
    }
}

// Actualiza el mensaje principal de la ALU
function updateALU(message) {
    document.getElementById('aluMessage').textContent = message;
}

// Actualiza los detalles de la ALU: valores, operación, código binario y resultado
function updateALUDetails(valueA, valueB, result, operationCode) {
    document.getElementById('aluA').textContent = valueA; // Valor A en binario
    document.getElementById('aluB').textContent = valueB !== "N/A" ? valueB : "0000"; // Valor B en binario o 0000 si no aplica
    document.getElementById('aluOperation').textContent = operationCode; // Código binario de la operación
    document.getElementById('aluResult').textContent = result; // Resultado de la operación
}

// Reinicia la simulación, reseteando todos los valores
function resetSimulation() {
    step = 0; // Reinicia el contador de pasos
    acumulador = 0; // Reinicia el acumulador a 0

    // Resetea los registros y la memoria a sus valores iniciales
    document.getElementById('regA').textContent = "0000";
    document.getElementById('regB').textContent = "0000";
    document.getElementById('regC').textContent = "0000";
    document.getElementById('acumulador').textContent = "0000";
    document.getElementById('mem0').textContent = "0000";
    document.getElementById('aluMessage').textContent = "ALU esperando...";
    document.getElementById('mensajeExplicacion').textContent = "Simulación reiniciada.";

    // Resetea los detalles de la ALU
    updateALUDetails("N/A", "N/A", "N/A", "N/A");

    resetHighlight(); // Quita cualquier resaltado

    document.getElementById('nextStepBtn').disabled = false; // Habilita el botón de "Siguiente paso"
}

// Resalta un elemento en la interfaz (memoria, ALU, registros) durante cada fase
function highlightElement(elementId) {
    document.getElementById(elementId).classList.add('active'); // Agrega la clase 'active' para el resaltado
}

// Quita el resaltado de todos los elementos (memoria, ALU, registros)
function resetHighlight() {
    const elements = document.querySelectorAll('.station');
    elements.forEach(element => element.classList.remove('active')); // Quita la clase 'active'
}
