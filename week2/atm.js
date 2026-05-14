let balance = 10000;
const pin = 1234;

function updateBalance() {
    document.getElementById("balance").innerHTML =
        "Bank Balance: " + balance;
}

function withdrawal() {

    let amount =
        parseInt(document.getElementById("amount").value);

    // Using modulus operator
    if (amount % 100 != 0) {
        alert("Amount must be multiple of 100");
        return;
    }

    let enteredPin = prompt("Enter PIN");

    if (enteredPin != pin) {
        alert("Wrong PIN");
        return;
    }

    if (amount > balance) {
        alert("Insufficient Balance");
        return;
    }

    balance = balance - amount;

    updateBalance();

    alert("Withdrawal Successful");
}

function deposit() {

    let amount =
        parseInt(document.getElementById("amount").value);

    // Using modulus operator
    if (amount % 100 != 0) {
        alert("Amount must be multiple of 100");
        return;
    }

    let enteredPin = prompt("Enter PIN");

    if (enteredPin != pin) {
        alert("Wrong PIN");
        return;
    }

    balance = balance + amount;

    updateBalance();

    alert("Deposit Successful");
}