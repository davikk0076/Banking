import '../Styles/App.css';
import { useState, useEffect } from 'react';
import AddTransactionForm from './AddTransactionForm';
import AccountSelect from './AccountSelect';
import DonutChart from './DonutChart';

function App() {
    const [transactions, setTransactions] = useState([])
    const [showForm, setShowForm] = useState(false)
    const [account, setAccount] = useState({label: "Все", value: "all"})
    const [categories, setCategories] = useState([])
    
    useEffect(() => {
      const fetchData = async () => {
        let response = await fetch("http://localhost:3001/transaction")
        let data = await response.json()

        if (account.value !== "all") {
          data = data.filter(item => item.info.account.value === account.value)
        }
        const checkedIds = categories.filter(cat => cat.info.checked).map(cat => cat.id)
        data = data.filter(item => checkedIds.includes(item.info.category_id))
        
        setTransactions(data)

        response = await fetch("http://localhost:3001/category")
        data = await response.json()
        setCategories(data)
      };
      fetchData();
    }, [transactions, account, categories])

    const addTransaction = (data) => {
      data.account = account
      fetch("http://localhost:3001/transaction", {
        method: "POST", 
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
      })
    }

    const addTransactionButton = () => {
      if (account.value === "all" || categories.length === 0){
        alert("Выберите счет и добавьте хотя бы одну категорию")
      } else {
        setShowForm(true)
      }
    }

    const addCategory = () => {
      const input = document.getElementById("category")
      if (input.value !== "") {
        const data = {category: input.value}
        fetch("http://localhost:3001/category", {
          method: "POST", 
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(data)
        })
        input.value = ""
      }
    }

    const checkCategory = (category) => {
      category.info.checked = !category.info.checked
      fetch(`http://localhost:3001/category/${category.id}`, {
        method: "PUT", 
        headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify(category.info)
      })
    }
  
  return (
    <div className="d-flex container">
      <div className="box col-md-4">
        <div className="box mb-3">
          <label className="form-label fw-bold">Счета/Кошельки <i className='bi bi-wallet2'></i></label>
          <AccountSelect giveValue={setAccount}/>
        </div>

        <DonutChart transactions={transactions}/>

        <div className="box">
          <label className="form-label fw-bold">Категории</label>
          <div className="d-flex col-auto">
            <input className="form-control" id="category" placeholder="Введите название"/>
            <button className="btn btn-primary btn-standard btn-primary-custom" 
            onClick={() => addCategory()}>Добавить</button>
          </div>
          {categories.map((category, index) => (
            <div key={index} class="form-check d-flex justify-content-between">
              <input class="form-check-input my-auto" type="checkbox" checked={category.info.checked} 
              onClick={() => checkCategory(category)}/>
              <label class="form-check-label my-auto" for="flexCheckDefault">
                {category.info.category}
              </label>
              <i className="bi bi-trash btn btn-danger btn-standard my-auto scale-50" 
              onClick={() => fetch(`http://localhost:3001/category/${category.id}`, {method: "DELETE"})}></i>
            </div>
          ))}
        </div>
      </div>

      <div className="col-md-8 box">
        <div className='d-flex mb-2'>
          <button className="btn btn-primary btn-standard btn-primary-custom" 
          onClick={() => addTransactionButton()}>
            + Транзакция
          </button>
        </div>
        {transactions.map((transaction, index) => (
          <div key={index} className='d-flex'>
            <div className="box d-flex justify-content-between mx-4 flex-fill">
              <div className="my-auto">
                <div className="transaction-main">{categories.find(cat => cat.id === transaction.info.category_id).info.category}</div>
                <div className="transaction-label">{transaction.info.label}</div>
              </div>
              <div className="transaction-main  my-auto">{transaction.info.account.label}</div>
              <div className={`transaction-main my-auto ${transaction.info.is_profit ? 'text-success' : 'text-danger'}`}>
                  {transaction.info.is_profit ? '+' : '-'}{transaction.info.sum} ₽
              </div>
            </div>
            <i class="bi bi-trash btn btn-danger btn-standard btn-red my-auto" 
            onClick={() => fetch(`http://localhost:3001/transaction/${transaction.id}`, {method: "DELETE"})}></i>
          </div>
        ))}
      </div>
      <AddTransactionForm show={showForm} onClose={() => {setShowForm(false)}} onSubmit={addTransaction} categories={categories} setCategories={setCategories}/>
    </div>
  );
}

export default App;
