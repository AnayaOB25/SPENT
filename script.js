/*SPENT STARTER DATA*/

//Monthly income shown on the dashboard
let monthlyIncome = 0;

const budget = {};

let expenses = [];

try{
    const savedExpenses = localStorage.getItem("SPENTExpenses")

    if(savedExpenses){
        expenses = JSON.parse(savedExpenses);

        if (!Array.isArray(expenses)){
            expenses = [];
        }
    }
} catch (error){
    console.error("Could not load saved expenses:", error);
    expenses = [];
}

/*select dashboard elements*/
const incomeElement = document.getElementById("monthly-income");
const totalSpentElement = document.getElementById("total-spent");
const remainingBudgetElement = document.getElementById("remaining-budget");
const expensesList = document.getElementById("expense-list");

const addExpenseButton = document.querySelector(
    ".recent-expenses .primary-button"
);

/*format money*/
function formatMoney(amount){
    return amount.toLocaleString("en-US", {
        style:"currency",
        currency:"USD"
    });
}

/*update dashboard totals*/
function updateDashboard(){
    const totalSpent = expenses.reduce((total, expense) => {
        return total + expense.amount;
    }, 0);

    const remainingBudget = monthlyIncome - totalSpent;

    incomeElement.textContent = formatMoney(monthlyIncome);
    totalSpentElement.textContent = formatMoney(totalSpent);
    remainingBudgetElement.textContent = formatMoney(remainingBudget);

    updateBudgetProgress();
}

/*Update budget progress*/
function updateBudgetProgress() {
    const budgetItems = document.querySelectorAll(
        ".budget-progress-item"
    );

    budgetItems.forEach((item) => {
        const category = item.querySelector(
            ".progress-label span:first-child"
        ).textContent.trim();

        const amountLabel = item.querySelector(
            ".progress-label span:last-child"
        );

        const progressFill = item.querySelector(".progress-fill");

        const limit = budgets[category];

        if (limit === undefined) {
            return;
        }

        const categorySpent = expenses
            .filter((expense) => expense.category === category)
            .reduce((total, expense) => total + expense.amount, 0);

        const percentage = Math.min(
            (categorySpent / limit) * 100,
            100
        );

        amountLabel.textContent =
            `${formatMoney(categorySpent)} / ${formatMoney(limit)}`;

        progressFill.style.width = `${percentage}%`;
    });
}

/*Display expenses in the table*/
function renderExpenses(){
    expensesList.innnerHTML = "";

    if (expenses.length === 0) {
        expenseList.innerHTML = `
            <tr>
                <td colspan="4" class="empty-state">
                    No expenses yet. Add your first expense!
                </td>
            </tr>
        `;

        return;
    }

    const newestExpenses = [...expenses].reverse();

    newestExpenses.forEach((expense) => {
        const row = document.createElement("tr");

        const nameCell = document.createElement("td");
        nameCell.textContent = expense.name;

        const categoryCell = document.createElement("td");
        categoryCell.textContent = expense.category;

        const dateCell = document.createElement("td");
        dateCell.textContent = new Date(
            `${expense.date}T12:00:00`
        ).toLocaleDateString("en-US");

        const amountCell = document.createElement("td");
        amountCell.textContent = formatMoney(expense.amount);

        row.append(
            nameCell,
            categoryCell,
            dateCell,
            amountCell
        );

        expenseList.appendChild(row);
    });

}

function savedExpenses(){
    localStorage.setItem(
        "SPENTExpenses",
        JSON.stringify(expenses)
    );
}

/*Add a new expense*/
function addExpense() {
    
    const name = prompt("What did you spend money on?");

    if (name === null || name.trim() === "") {
        return;
    }

    
    const categoryChoice = prompt(
        "Choose a category by entering its number:\n" +
        "1. Food\n" +
        "2. Transportation\n" +
        "3. Entertainment\n" +
        "4. Other"
    );

    if (categoryChoice === null) {
        return;
    }

    const categories = {
        "1": "Food",
        "2": "Transportation",
        "3": "Entertainment",
        "4": "Other"
    };

    const category = categories[categoryChoice.trim()];

    if (!category) {
        alert("Please enter a valid category number.");
        return;
    }

    
    const amountInput = prompt(
        "How much did you spend? Enter the amount in dollars:"
    );

    if (amountInput === null || amountInput.trim() === "") {
        return;
    }

    const amount = Number(amountInput);

    if (!Number.isFinite(amount) || amount <= 0) {
        alert("Please enter an amount greater than $0.");
        return;
    }

    
    const newExpense = {
        name: name.trim(),
        category: category,
        amount: Math.round(amount * 100) / 100,
        date: new Date().toLocaleDateString("en-CA")
    };

    
    expenses.push(newExpense);

    
    saveExpenses();
    renderExpenses();
    updateDashboard();

    alert("Expense added successfully!");
}

/*Connect the button*/
addExpenseButton.addEventListener("click", (event) => {
    event.preventDefault();
    addExpense();
});

/*Initialize the dashboard*/
renderExpenses();
updateDashboard();