import { useState, useEffect } from 'react';
import { components } from 'react-select';
import CreatableSelect from 'react-select/creatable';

const Option = (props) => {
  return (
    <div className='d-flex'>
      <components.Option {...props} />
        <i className="bi bi-trash btn btn-danger btn-standard btn-red my-auto scale-75" 
      onClick={() => {fetch(`http://localhost:3001/account/${props.value}`, {method: "DELETE"})}}></i>
    </div>
  )
}

function AccountSelect({giveValue}) {
  const [options, setOptions] = useState([])
  const [value, setValue] = useState({label: "Все", value: "all"})

  const fetchOptions = async () => {
      const response = await fetch("http://localhost:3001/account")
      const data = await response.json()
      setOptions(data)
    }

  const handleCreate = (inputValue) => {
    const newOption = {label: inputValue, value: inputValue.toLowerCase()}

    fetch("http://localhost:3001/account", {
        method: "POST", 
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(newOption)
      })
    setValue(newOption)
    giveValue(newOption)
  }

  const handleChange = (newValue) => {
    setValue(newValue)
    giveValue(newValue)
  }

  useEffect(() => {fetchOptions()})

  return (
    <CreatableSelect
      onChange={(newValue) => handleChange(newValue)}
      onCreateOption={handleCreate}
      options={options}
      value={value}
      components={{ Option }}
    />
  )
}

export default AccountSelect;