const $ = (id) => document.getElementById(id);

const form = $('expenseForm');
const expenseList = $('expenseList');
const startDateInput = $('startDate');
const endDateInput = $('endDate');
const filterButton = $('filterButton');
const chartCanvas = $('expenseChart');
const clearFilterButton = $('clearFilterButton');

let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

// Variable global para almacenar la instancia del gráfico
let expenseChart;

// Handle form submission
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const amount = parseFloat($('amount').value);
    const category = $('category').value.toUpperCase()
    const date = $('date').value;

    if (!amount || !category || !date) return;

    const expense = { amount, category, date };
    expenses.push(expense);
    localStorage.setItem('expenses', JSON.stringify(expenses)); // Guardar los datos en localStorage
    renderExpenses();
    updateChart();
    form.reset();
});

// Render expense list
function renderExpenses(filteredExpenses = expenses) {
    expenseList.innerHTML = '';
    filteredExpenses.forEach((exp, index) => {
        const li = document.createElement('li');
        li.textContent = `${exp.date} - ${exp.category}: $${exp.amount.toFixed(2)}`;

        // Crear el botón de eliminar
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar';
        deleteButton.style.backgroundColor = '#B91C1C';

        deleteButton.classList.add('deleteButton');

        // Función para eliminar el gasto
        deleteButton.addEventListener('click', () => {
            expenses.splice(index, 1); // Eliminar el gasto de la lista
            localStorage.setItem('expenses', JSON.stringify(expenses)); // Actualizar el localStorage
            renderExpenses(); // Volver a renderizar la lista
            updateChart(); // Actualizar el gráfico
        });

        li.appendChild(deleteButton);
        expenseList.appendChild(li);
    });
}

filterButton.addEventListener('click', () => {
    const startDate = new Date(startDateInput.value);
    const endDate = new Date(endDateInput.value);

    // Verifica si alguna fecha está vacía
    if (!startDateInput.value || !endDateInput.value) {
        alert('Por favor, ingrese ambas fechas para aplicar el filtro.');
        return; // No aplica el filtro si alguna fecha está vacía
    }

    const filteredExpenses = expenses.filter(exp => {
        const expenseDate = new Date(exp.date);
        return expenseDate >= startDate && expenseDate <= endDate;
    });

    // Si no hay resultados, muestra un mensaje
    if (filteredExpenses.length === 0) {
        alert('No se encontraron gastos en este rango de fechas.');
    }

    renderExpenses(filteredExpenses);
    updateChart(filteredExpenses);
});


//clear filters
clearFilterButton.addEventListener('click', () => {
    startDateInput.value = '';
    endDateInput.value = '';
    renderExpenses(); 
    updateChart();     
});
// Generate chart
function updateChart(filteredExpenses = expenses) {
    const ctx = chartCanvas.getContext('2d');
    const categories = [...new Set(filteredExpenses.map(exp => exp.category))];
    if (categories.length > 0) {
        chartCanvas.style.display = 'block';
    } else {
        chartCanvas.style.display = 'none';
        return;
    }
    const categoryTotals = categories.map(cat => {
        return filteredExpenses
            .filter(exp => exp.category === cat)
            .reduce((sum, exp) => sum + exp.amount, 0);
    });

    // Destruye el gráfico anterior si existe
    if (expenseChart) {
        expenseChart.destroy();
    }

    // Generar colores aleatorios
    const generateRandomColor = () => {
        const randomColor = Math.floor(Math.random() * 16777215).toString(16);
        return `#${randomColor}`;
    };

    // Crear un array de colores aleatorios
    const backgroundColors = categories.map(() => generateRandomColor());

    // Crea un nuevo gráfico
    expenseChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: categories,
            datasets: [{
                data: categoryTotals,
                backgroundColor: backgroundColors,
            }]
        }
    });
}

renderExpenses(); // Mostrar los gastos al cargar la página
updateChart(); // Mostrar el gráfico al cargar la página
