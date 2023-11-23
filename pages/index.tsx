import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { prisma } from '../lib/prisma'


interface Notes{
  notes: {
    id: string
    model: string
    date: string
    qty:  string
    license: string
    content: string
  }[]
}

interface FormData {
  model: string
  date: string
  qty:  string
  license: string
  content: string
  id: string
}

const Home = ({notes}: Notes) => {
  const [form, setForm] = useState<FormData>({model: '', date: '', qty: '', license: '', content: '', id: ''})
  const router = useRouter()

  const refreshData = () => {
    router.replace(router.asPath)
  }

  async function create(data: FormData) {
    try {
      fetch('http://localhost:3000/api/create', {
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST'
      }).then(() => {
        if(data.id) {
          deleteNote(data.id)
          setForm({model: '', date: '', qty: '', license: '', content: '', id: ''})
          refreshData()
        } else {
          setForm({model: '', date: '', qty: '', license: '', content: '', id: ''})
          refreshData()

        }
      }
        )
    } catch (error) {
      console.log(error);
    }
  }


  async function deleteNote(id: string) {
    try {
     fetch(`http://localhost:3000/api/note/${id}`, {
       headers: {
         "Content-Type": "application/json",
       },
       method: 'DELETE'
     }).then(() => {
       refreshData()
     })
    } catch (error) {
     console.log(error); 
    }
  }

  const handleSubmit = async (data: FormData) => {
    try {
     create(data) 
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="border-t-4 border-color: #42412C;">
       <div><img src="../logo.svg"></img></div>
      <h1 className="text-center font-bold text-2xl mt-4 textColor:#556B79">Batch Form</h1>
      <form onSubmit={e => {
        e.preventDefault()
        handleSubmit(form)
      }} className='w-auto min-w-[25%] max-w-min mx-auto space-y-6 flex flex-col items-stretch'>
        <select
          value={form.model}
          onChange={e => setForm({...form, model: e.target.value})}
          className="border-2 rounded border-gray-600 p-1"
        >
        <option value="" disabled selected>Model</option>
        <option value="Model 1">Model 1</option>
        <option value="Model 2">Model 2</option>
        <option value="Model 3">Model 3</option>
        </select>
        <input type="date"
          placeholder="Date"
          value={form.date}
          onChange={e => setForm({...form, date: e.target.value})}
          className="border-2 rounded border-gray-600 p-1"
        />
         <input type="number"
          min="0" step="1"
          placeholder="Qty"
          value={form.qty}
          onChange={e => setForm({...form, qty: e.target.value})}
          className="border-2 rounded border-gray-600 p-1"
        />
        <select
        value={form.license}
        onChange={e => setForm({...form, license: e.target.value})}
        className="border-2 rounded border-gray-600 p-1"
        >
        <option value="" disabled selected>License Level</option>
        <option value="0">0</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
        </select>
        <textarea 
          placeholder="Comments"
          value={form.content}
          onChange={e => setForm({...form, content: e.target.value})}
          className="border-2 rounded border-gray-600 p-1"
        />
        <button type="submit" className="bg-blue-500 text-white rounded p-1">Add +</button>
      </form>
      <div className="w-auto min-w-[25%] max-w-min mt-20 mx-auto space-y-6 flex flex-col items-stretch">
        <ul>
          {notes.map(note => (
            <li key={note.id} className="border-b border-gray-600 p-2">
              <div className="flex justify-between">
                <div className="flex-1">
                  <h3 className="font-bold">{note.model}</h3>
                  <p className="text-sm">{note.date}</p>
                  <p className="text-sm">{note.qty}</p>
                  <p className="text-sm">{note.license}</p>
                  <p className="text-sm">{note.content}</p>
                </div>
                <button onClick={() => setForm({model: note.model, date: note.date, qty: note.qty, license: note.license, content: note.content, id: note.id})} className="bg-blue-500 mr-3 px-3 text-white rounded">Update</button>
                <button onClick={() => deleteNote(note.id)} className="bg-red-500 px-3 text-white rounded">X</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Home


export const getServerSideProps: GetServerSideProps = async () => {
  const notes = await prisma.note.findMany({
    select: {
      model: true,
      id: true,
      qty: true,
      license: true,
      date: true,
      content: true
    }
  })

  return {
    props: {
      notes
    }
  }
}