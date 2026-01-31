import '../Styles/DonutChart.css';

function DonutChart({ transactions }) {
    if (transactions.length === 0) {return}

    let income = 0
    let expense = 0
    let balance = 0
    
    const incomeTransactions = transactions.filter(t => t.info.is_profit).map(t => t.info.sum)
    if (incomeTransactions.length !== 0) {income = incomeTransactions.reduce((sum, val) => sum + val)}
    const expenseTransactions = transactions.filter(t => !t.info.is_profit).map(t => t.info.sum)
    if (expenseTransactions.length !== 0) {expense = expenseTransactions.reduce((sum, val) => sum + val)}
    balance = income - expense
    const red_percentage = (expense / (income + expense) * 100).toFixed(2)

    return (
        <div className="red-percentage" style={{"--red-percentage": red_percentage}}>
            <div className="chart-container">
                <div className="half-donut">
                    <div className="center-balance m-auto">
                        БАЛАНС
                        <div claclassNamess="balance-amount">{balance.toLocaleString('ru-RU')} ₽</div>
                    </div>
                </div>
            </div>

            <div className="d-flex justify-content-between">
                <div className="income-label">
                    Доход:<br/>
                    {income.toLocaleString('ru-RU')} ₽
                </div>
                <div className="expenses-label">
                    Расход:<br/>
                    {expense.toLocaleString('ru-RU')} ₽
                </div>
            </div>
        </div>
    )
}

export default DonutChart;
