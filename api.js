const express = require("express")
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.json())

const PORT = 3001
let transactions = []
let accounts = [{label: "Все", value: "all"}]
let categories = []

const getAll = (req, res, variable) => {
    res.json(variable)
}

const postValue = (req, res, variable) => {
    const len = variable.length
    const item = {
        id: (len == 0 ? 1 : variable[len - 1].id + 1),
        info: req.body
    }
    if (variable === categories) {item.info.checked = true}
    variable.push(item)
    res.status(201).json(item)
}

const deleteValue = (req, res, variable) => {
    const id = parseInt(req.params.id)
    const index = variable.findIndex(t => t.id == id)
    if (index != -1) {
        variable.splice(index, 1)
        if (variable === categories) {transactions = transactions.filter(t => t.info.category_id != id)}
        res.status(204).send()
    } else {
        res.status(404).json({status: "Не найдено"})
    }
}

app.get("/transaction", (req, res) => getAll(req, res, transactions))
app.get("/account", (req, res) => getAll(req, res, accounts))
app.get("/category", (req, res) => getAll(req, res, categories))

app.post("/transaction", (req,res) => postValue(req, res, transactions))
app.post("/category", (req,res) => postValue(req, res, categories))

app.delete("/transaction/:id", (req, res) => deleteValue(req, res, transactions))
app.delete("/category/:id", (req, res) => deleteValue(req, res, categories))

app.put("/category/:id", (req, res) => {
    const id = parseInt(req.params.id)
    const index = categories.findIndex(cat => cat.id == id)

    if (index != -1) {
        const category = {
            id: id,
            info: req.body
        }
        categories[index] = category
        res.status(204).send()
    } else {
        res.status(404).json({status: "Не найдено"})
    }
})

app.post("/account", (req, res) => {
    accounts.push(req.body)
    res.status(201).json(req.body)
})

app.get("/account/:value", (req, res) => {
    const value = req.params.value
    const index = accounts.findIndex(acc => acc.value == value)
    if (index != -1) {
        res.json(accounts[index])
    } else {
        res.status(404).json({status: "Не найдено"})
    }
})

app.delete("/account/:value", (req, res) => {
    const value = req.params.value
    const index = accounts.findIndex(acc => acc.value == value)
    if (value == "all") {
        accounts = [{label: "Все", value: "all"}]
        transactions = []
        res.status(204).send()
    }
    else if (index != -1) {
        accounts.splice(index, 1)
        transactions = transactions.filter(item => item.info.account.value !== value)
        res.status(204).send()
    } else {
        res.status(404).json({status: "Не найдено"})
    }
})

app.get("/transaction/:id", (req, res) => {
    const id = req.params.id
    const index = transactions.findIndex(t => t.id == id)
    if (index != -1) {
        res.json(transactions[index])
    } else {
        res.status(404).json({status: "Не найдено"})
    }
})

app.put("/transaction/:id", (req, res) => {
    const id = parseInt(req.params.id)
    const index = transactions.findIndex(t => t.id == id)

    if (index != -1) {
        const transaction = {
            id: id,
            info: req.body
        }
        transactions[index] = transaction
        res.status(204).send()
    } else {
        res.status(404).json({status: "Не найдено"})
    }
})

app.listen(PORT, () => {
    console.log(`API работает на http://localhost:${PORT}`)
})
