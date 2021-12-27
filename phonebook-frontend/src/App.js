import React, { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const personsToShow = newFilter === ''
    ? persons
    : persons.filter(person => person['name'].toLowerCase().includes(newFilter.toLowerCase()))

  const addPerson = (event) => {
    event.preventDefault()
  
    if (persons.some( person => person['name'] === newName )) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with new one?`)) {
        const person = persons.find(person => person.name === newName)
        
        const changedPerson = { ...person, number: newNumber}
        
        personService
          .update(changedPerson.id, changedPerson)
          .then(returnedData => {
            setPersons(persons.map(person => person.name !== newName ? person : changedPerson))
            setIsError(false)
            handleNotificationShow(`Updated ${returnedData.name}`)
          })
      } 
      setNewName('')
      setNewNumber('')
      return
    }

    const personObject = {
      name: newName,
      number: newNumber
    }

    personService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
        setIsError(false)
        handleNotificationShow(`Added ${returnedPerson.name}`)
      }).catch(error => {
        setIsError(true)
        handleNotificationShow(`${error.response.data.error}`)
      })
  }

  const handleNotificationShow = (message) => {
    setNotificationMessage(message)
    setTimeout(() => {
      setNotificationMessage(null)
    }, 3000)
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }

  const handlePersonDelete = (person) => {
      if (window.confirm(`Are you sure you want to delete ${person.name}`)) {
        personService
          .remove(person.id)
          .then(returnedPerson => {
            setPersons(persons.filter(n => n.id !== person.id))
            setIsError(false)
            handleNotificationShow(`Deleted ${person.name}`)
          }).catch(error => {
            setIsError(true)
            handleNotificationShow(`Information of '${person.name}' has already been removed from server`)
            setPersons(persons.filter(n => n.id !== person.id))
          })
      }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notificationMessage} isError={isError}/>
      <Filter value={newFilter} handleChange={handleFilterChange}/>
      <h2>Add a new</h2>
      <PersonForm 
        submit={addPerson} 
        newName={newName} 
        newNumber={newNumber} 
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange} />
      <h2>Numbers</h2>
      <Persons personsToShow={personsToShow} handlePersonDelete={handlePersonDelete}/>
    </div>
  )

}

export default App