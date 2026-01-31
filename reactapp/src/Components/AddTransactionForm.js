import { useEffect, useState } from 'react';

function AddTransactionForm({ show, onClose, onSubmit, categories, setCategories}) {
  const [data, setData] = useState({
    account: '',
    category_id: 1,
    label: '',
    sum: 0,
    is_profit: true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : name === 'sum' || name === 'category_id' ? Number(value) : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(data)
    onClose()
    setData({ account: '', category_id: 1, label: '', sum: 0, is_profit: true })
  }

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:3001/category")
      const responseData = await response.json()
      setCategories(responseData)
    }
    fetchData()
  }, [categories, setCategories])

  if (!show) return null

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">Новая транзакция</h5>
            <button 
              type="button" 
              className="btn-close btn-close-white"
              onClick={onClose}
            ></button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              
              <div className="mb-3">
                <label className="form-label fw-bold">Описание транзакции</label>
                <input
                  type="text"
                  className="form-control"
                  name="label"
                  value={data.label}
                  onChange={handleChange}
                  required
                  placeholder="Например: Зарплата за январь"
                />
                <div className="form-text">Введите краткое описание транзакции</div>
              </div>
              
              <div className="mb-3">
                <label className="form-label fw-bold">Сумма</label>
                <div className="input-group">
                  <input
                    type="number"
                    className="form-control"
                    name="sum"
                    value={data.sum}
                    onChange={handleChange}
                    required
                    placeholder="1000"
                    min="0"
                  />
                  <span className="input-group-text">₽</span>
                </div>
                <div className="form-text">Введите сумму транзакции</div>
              </div>
              
              <div className="mb-3">
                <label className="form-label fw-bold">Тип транзакции</label>
                <div className="d-flex gap-3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="is_profit"
                      id="incomeRadio"
                      checked={data.is_profit === true}
                      onChange={() => setData(prev => ({...prev, is_profit: true}))}
                    />
                    <label className="form-check-label text-success fw-bold" htmlFor="incomeRadio">
                      <i className="bi bi-arrow-up-circle me-1"></i> Доход
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="is_profit"
                      id="expenseRadio"
                      checked={data.is_profit === false}
                      onChange={() => setData(prev => ({...prev, is_profit: false}))}
                    />
                    <label className="form-check-label text-danger fw-bold" htmlFor="expenseRadio">
                      <i className="bi bi-arrow-down-circle me-1"></i> Расход
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="mb-3">
                <label className="form-label fw-bold">Категория</label>
                <select
                  className="form-select"
                  name="category_id"
                  value={data.category_id}
                  onChange={handleChange}
                >
                  {categories.map((category, index) => (
                    <option key={index} value={category.id}>{category.info.category}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-danger btn-standard btn-red"
                onClick={onClose}
              >
                <i className="bi bi-x-circle me-1"></i> Отмена
              </button>
              <button 
                type="submit" 
                className="btn btn-primary btn-standard btn-primary-custom"
              >
                <i className="bi bi-check-circle me-1"></i> Добавить транзакцию
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddTransactionForm;