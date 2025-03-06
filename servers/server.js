const express = require("express");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/login page.html");
});

app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    const users = JSON.parse(fs.readFileSync("users.json", "utf8"));
    const user = users.find(u => u.username === username);

    if (user && (await bcrypt.compare(password, user.password))) {
        res.send("<h2>Успешный вход!</h2>");
    } else {
        res.send("<h2>Ошибка входа! Неверные данные.</h2>");
    }
});


app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});

document.addEventListener("DOMContentLoaded", () => {
    const workspaceId = "exampleWorkspace";
    const spentElem = document.getElementById("current-spent");
    const limitElem = document.getElementById("quota-limit");
    const daysLeftElem = document.getElementById("days-left");
    const setQuotaBtn = document.getElementById("set-quota");
    const removeQuotaBtn = document.getElementById("remove-quota");

    function fetchQuota() {
        fetch(`/api/quotas/${workspaceId}`)
            .then(res => res.json())
            .then(data => {
                if (data) {
                    spentElem.textContent = `$${data.spent || 0}`;
                    limitElem.textContent = data.limit ? `$${data.limit}` : "Не установлен";
                    daysLeftElem.textContent = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() - new Date().getDate();
                }
            });
    }

    setQuotaBtn.addEventListener("click", () => {
        const limit = prompt("Введите лимит квоты в $:");
        if (limit) {
            fetch(`/api/quotas/${workspaceId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ limit: parseFloat(limit), spent: 0 })
            }).then(fetchQuota);
        }
    });

    removeQuotaBtn.addEventListener("click", () => {
        fetch(`/api/quotas/${workspaceId}`, { method: "DELETE" }).then(fetchQuota);
    });

    fetchQuota();
});
