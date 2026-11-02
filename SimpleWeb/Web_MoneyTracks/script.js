// ============================
// DATA DAN PENYIMPANAN
// ============================

let transactions = JSON.parse(
    localStorage.getItem("moneyTransactions")
) || [];

let goal = Number(
    localStorage.getItem("moneyGoal")
) || 0;

// Format rupiah
function rupiah(number) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(number);
}

// Tanggal hari ini
document.getElementById("date").value =
    new Date().toISOString().split("T")[0];

// Simpan data
function saveData() {
    localStorage.setItem(
        "moneyTransactions",
        JSON.stringify(transactions)
    );

    localStorage.setItem("moneyGoal", goal);
}

// ============================
// HITUNG SALDO
// ============================

function updateDashboard() {

    let income = 0;
    let expense = 0;

    transactions.forEach(item => {

        if (item.type === "income") {
            income += item.amount;
        } else {
            expense += item.amount;
        }

    });

    let balance = income - expense;

    document.getElementById("balance").textContent =
        rupiah(balance);

    document.getElementById("income").textContent =
        rupiah(income);

    document.getElementById("expense").textContent =
        rupiah(expense);

    updateSavings(balance);
}

// ============================
// TAMBAH TRANSAKSI
// ============================

document.getElementById("transactionForm")
.addEventListener("submit", function(event) {

    event.preventDefault();

    let description =
        document.getElementById("description").value.trim();

    let amount = Number(
        document.getElementById("amount").value
    );

    let type =
        document.getElementById("type").value;

    let category =
        document.getElementById("category").value;

    let date =
        document.getElementById("date").value;

    if (
        !description ||
        !Number.isSafeInteger(amount) ||
        amount <= 0 ||
        !date
    ) {
        alert("Periksa kembali data transaksi!");
        return;
    }

    let transaction = {
        id: Date.now(),
        description,
        amount,
        type,
        category,
        date
    };

    transactions.unshift(transaction);

    saveData();

    this.reset();

    document.getElementById("date").value =
        new Date().toISOString().split("T")[0];

    renderTransactions();
    updateDashboard();
    updateChart();

});

// ============================
// TAMPILKAN TRANSAKSI
// ============================

function renderTransactions() {

    let list =
        document.getElementById("transactionList");

    let filter =
        document.getElementById("filter").value;

    list.innerHTML = "";

    let filtered = transactions.filter(item => {
        return filter === "all" || item.type === filter;
    });

    document.getElementById("emptyMessage").style.display =
        filtered.length === 0 ? "block" : "none";

    filtered.forEach(item => {

        let row = document.createElement("tr");

        let name = document.createElement("td");
        name.textContent = item.description;

        let category = document.createElement("td");
        category.textContent = item.category;

        let date = document.createElement("td");
        date.textContent = item.date;

        let amount = document.createElement("td");
        amount.textContent =
            (item.type === "income" ? "+ " : "- ") +
            rupiah(item.amount);

        amount.className =
            item.type === "income"
            ? "income-text"
            : "expense-text";

        let action = document.createElement("td");

        let deleteButton = document.createElement("button");

        deleteButton.textContent = "Hapus";
        deleteButton.className = "delete-btn";

        deleteButton.addEventListener("click", () => {

            if (confirm("Hapus transaksi ini?")) {

                transactions = transactions.filter(
                    transaction => transaction.id !== item.id
                );

                saveData();
                renderTransactions();
                updateDashboard();
                updateChart();

            }

        });

        action.appendChild(deleteButton);

        row.append(
            name,
            category,
            date,
            amount,
            action
        );

        list.appendChild(row);

    });

}

// Filter transaksi
document.getElementById("filter")
.addEventListener("change", renderTransactions);

// ============================
// GRAFIK KEUANGAN
// ============================

let financeChart;

function updateChart() {

    let income = 0;
    let expense = 0;

    transactions.forEach(item => {

        if (item.type === "income") {
            income += item.amount;
        } else {
            expense += item.amount;
        }

    });

    let ctx =
        document.getElementById("financeChart");

    if (financeChart) {
        financeChart.destroy();
    }

    financeChart = new Chart(ctx, {

        type: "bar",

        data: {

            labels: ["Pemasukan", "Pengeluaran"],

            datasets: [{

                label: "Jumlah Keuangan",

                data: [income, expense],

                backgroundColor: [
                    "#00d69a",
                    "#ff626c"
                ],

                borderRadius: 10,
                borderSkipped: false

            }]

        },

        options: {

            responsive: true,
            maintainAspectRatio: false,

            plugins: {

                legend: {
                    display: false
                }

            },

            scales: {

                y: {

                    beginAtZero: true,

                    ticks: {
                        color: "#a4b0c4"
                    },

                    grid: {
                        color: "#29374d"
                    }

                },

                x: {

                    ticks: {
                        color: "#a4b0c4"
                    },

                    grid: {
                        display: false
                    }

                }

            }

        }

    });

}

// ============================
// TARGET TABUNGAN
// ============================

document.getElementById("saveGoal")
.addEventListener("click", function() {

    let value = Number(
        document.getElementById("goal").value
    );

    if (!Number.isSafeInteger(value) || value <= 0) {
        alert("Masukkan target tabungan yang valid!");
        return;
    }

    goal = value;

    saveData();
    updateDashboard();

    document.getElementById("goal").value = "";

});

function updateSavings(balance) {

    let progress = goal > 0
        ? Math.max(0, Math.min((balance / goal) * 100, 100))
        : 0;

    document.getElementById("goalAmount").textContent =
        "Target: " + rupiah(goal);

    document.getElementById("goalProgress").textContent =
        progress.toFixed(1) + "% tercapai";

    document.getElementById("progressBar").style.width =
        progress + "%";

}

// ============================
// JALANKAN WEBSITE
// ============================

renderTransactions();
updateDashboard();
updateChart();