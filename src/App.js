  
import React, { useState, useEffect } from 'react'
import ultimateService from "./services/ultimateService";
import axios from 'axios'

const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}

const useResource = (baseUrl) => {
  const [resources, setResources] = useState([])

  useEffect( () => {
    async function get () {
      const resources = await ultimateService.getAll(baseUrl)
      if (resources) {
        setResources(resources)
      }
    }
    get()
  }, [])

  const create = async (resource) => {
    const created = await ultimateService.create(resource, baseUrl)
    debugger
    setResources(resources.concat(created))
  }

  const update = async (resource) => {
    const updated = await ultimateService.update(resource.id, resource, baseUrl)
    setResources(resources.concat(updated))
  }

  const service = {
    create,
    update
  }

  return [
    resources, service
  ]
}

const App = () => {
  const content = useField('text')
  const name = useField('text')
  const number = useField('text')

  const [notes, noteService] = useResource('http://localhost:3005/notes')
  const [persons, personService] = useResource('http://localhost:3005/persons')

  const handleNoteSubmit = (event) => {
    event.preventDefault()
    noteService.create({ content: content.value })
  }

  const handlePersonSubmit = (event) => {
    event.preventDefault()
    personService.create({ name: name.value, number: number.value})
  }

  return (
      <div>
        <h2>notes</h2>
        <form onSubmit={handleNoteSubmit}>
          <input {...content} />
          <button>create</button>
        </form>
        {notes.map(n => <p key={n.id}>{n.content}</p>)}

        <h2>persons</h2>
        <form onSubmit={handlePersonSubmit}>
          name <input {...name} /> <br/>
          number <input {...number} />
          <button>create</button>
        </form>
        {persons.map(n => <p key={n.id}>{n.name} {n.number}</p>)}
      </div>
  )
}

export default App