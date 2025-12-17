/* eslint-disable prettier/prettier */
import { useState, useMemo, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import NotesList from './components/NotesList'
import NoteEditor from './components/NoteEditor'
import Settings from './components/Settings'
import { SettingsProvider } from './contexts/SettingsContext'
import { Note, Notebook } from './types/note'

// Sample data
const initialNotes: Note[] = []
const initialNotebooks: Notebook[] = []

// Función para calcular contadores de notebooks basado en notas
const calculateNotebookCounts = (notebooks: Notebook[], notes: Note[]): Notebook[] => {
  return notebooks.map((notebook) => {
    const count = notes.filter((n) => !n.deleted && n.notebook === notebook.id).length
    const children = notebook.children
      ? notebook.children.map((child) => {
          const childCount = notes.filter((n) => !n.deleted && n.notebook === child.id).length
          return { ...child, count: childCount }
        })
      : undefined
    return { ...notebook, count, children }
  })
}

function App(): React.JSX.Element {
  const [notes, setNotes] = useState<Note[]>(initialNotes)
  const [selectedNoteId, setSelectedNoteId] = useState<string | undefined>(undefined)
  const [notebooks, setNotebooks] = useState<Notebook[]>(initialNotebooks)
  const [selectedNotebook, setSelectedNotebook] = useState<string | null>(null)
  const [filterType, setFilterType] = useState<'all' | 'pinned' | 'notebook' | 'status' | 'tag'>('all')
  const [selectedStatus, setSelectedStatus] = useState<Note['status'] | null>(null)
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  // Estado para tags con colores: { tagName: color }
  const [tags, setTags] = useState<Record<string, string>>({})
  const [showSettings, setShowSettings] = useState(false)
  
  // Calcular contadores de notebooks basado en notas
  const notebooksWithCounts = useMemo(
    () => calculateNotebookCounts(notebooks, notes),
    [notebooks, notes]
  )

  const selectedNote = notes.find((n) => n.id === selectedNoteId)
  
  // Handler para seleccionar notebook
  const handleNotebookSelect = (id: string | null): void => {
    setSelectedNotebook(id)
    setFilterType(id ? 'notebook' : 'all')
    setSelectedStatus(null)
    setSelectedTag(null)
  }

  // Handler para seleccionar status
  const handleStatusSelect = (status: Note['status'] | null): void => {
    setSelectedStatus(status)
    setFilterType(status ? 'status' : 'all')
    setSelectedNotebook(null)
    setSelectedTag(null)
  }

  // Handler para seleccionar tag
  const handleTagSelect = (tagName: string | null): void => {
    setSelectedTag(tagName)
    setFilterType(tagName ? 'tag' : 'all')
    setSelectedNotebook(null)
    setSelectedStatus(null)
  }

  const handleNoteSelect = (note: Note): void => {
    setSelectedNoteId(note.id)
  }

  const handleNoteUpdate = async (updatedNote: Note): Promise<void> => {
    setNotes((prevNotes) => prevNotes.map((n) => (n.id === updatedNote.id ? updatedNote : n)))
    
    // Añadir tags al estado si no existen
    if (updatedNote.tags) {
      setTags((prevTags) => {
        const newTags = { ...prevTags }
        updatedNote.tags?.forEach((tag) => {
          if (!newTags[tag]) {
            // Asignar un color por defecto si el tag no tiene color
            const defaultColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16']
            const colorIndex = Object.keys(newTags).length % defaultColors.length
            newTags[tag] = defaultColors[colorIndex]
          }
        })
        return newTags
      })
    }
    
    // Guardar automáticamente como archivo .md
    try {
      if (window.api) {
        const result = await window.api.saveNoteToFile(
          updatedNote.id,
          updatedNote.title,
          updatedNote.content,
          updatedNote.notebook
        )
        if (result && !result.success) {
          console.error('Error al guardar nota:', result.error)
        } else {
          console.log('Nota guardada exitosamente:', result?.filePath || 'OK')
        }
      } else {
        console.error('window.api no está disponible')
      }
    } catch (error) {
      console.error('Error al guardar nota en archivo:', error)
    }
  }

  const handleNewNote = async (): Promise<void> => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'Untitled Note',
      content: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'active',
      notebook: selectedNotebook || undefined
    }
    setNotes((prevNotes) => [newNote, ...prevNotes])
    setSelectedNoteId(newNote.id)
    
    // Guardar automáticamente como archivo .md
    try {
      if (window.api) {
        const result = await window.api.saveNoteToFile(
          newNote.id,
          newNote.title,
          newNote.content,
          newNote.notebook
        )
        if (result && !result.success) {
          console.error('Error al guardar nueva nota:', result.error)
        } else {
          console.log('Nueva nota guardada exitosamente:', result?.filePath || 'OK')
        }
      } else {
        console.error('window.api no está disponible')
      }
    } catch (error) {
      console.error('Error al guardar nueva nota en archivo:', error)
    }
  }

  const handlePinNote = (noteId: string): void => {
    setNotes((prevNotes) =>
      prevNotes.map((n) => (n.id === noteId ? { ...n, pinned: !n.pinned } : n))
    )
  }

  const handleDeleteNote = async (noteId: string): Promise<void> => {
    const note = notes.find((n) => n.id === noteId)
    
    setNotes((prevNotes) =>
      prevNotes.map((n) => (n.id === noteId ? { ...n, deleted: true } : n))
    )
    
    // Si la nota eliminada es la seleccionada, limpiar la selección
    if (selectedNoteId === noteId) {
      setSelectedNoteId(undefined)
    }
    
    // Eliminar archivo .md
    if (note) {
      try {
        if (window.api) {
          await window.api.deleteNoteFile(note.id, note.title, note.notebook)
        }
      } catch (error) {
        console.error('Error al eliminar archivo de nota:', error)
      }
    }
  }

  const handleCreateNotebook = async (name: string, parentId?: string): Promise<void> => {
    const newNotebook: Notebook = {
      id: `notebook-${Date.now()}`,
      name,
      parentId
    }

    // Crear carpeta física para el notebook
    try {
      if (window.api) {
        const result = await window.api.createNotebookFolder(newNotebook.id, newNotebook.name)
        if (result && !result.success) {
          console.error('Error al crear carpeta de notebook:', result.error)
        } else {
          console.log('Carpeta de notebook creada exitosamente:', result?.folderPath || 'OK')
        }
      }
    } catch (error) {
      console.error('Error al crear carpeta de notebook:', error)
    }

    if (parentId) {
      // Es un subnotebook
      setNotebooks((prev) =>
        prev.map((nb) =>
          nb.id === parentId
            ? { ...nb, children: [...(nb.children || []), newNotebook] }
            : nb
        )
      )
    } else {
      // Es un notebook principal
      setNotebooks((prev) => [...prev, newNotebook])
    }
  }

  const handleDeleteNotebook = (notebookId: string, isSubnotebook: boolean, parentId?: string): void => {
    if (window.api) {
      window.api.deleteNotebookFolder(notebookId).catch(() => {})
    }
    if (isSubnotebook && parentId) {
      // Eliminar subnotebook
      setNotebooks((prev) =>
        prev.map((nb) =>
          nb.id === parentId
            ? { ...nb, children: nb.children?.filter((child) => child.id !== notebookId) }
            : nb
        )
      )
      // Mover notas del subnotebook eliminado a sin notebook
      setNotes((prevNotes) =>
        prevNotes.map((n) => (n.notebook === notebookId ? { ...n, notebook: undefined } : n))
      )
    } else {
      // Eliminar notebook principal
      setNotebooks((prev) => prev.filter((nb) => nb.id !== notebookId))
      // Mover notas del notebook eliminado a sin notebook
      setNotes((prevNotes) =>
        prevNotes.map((n) => (n.notebook === notebookId ? { ...n, notebook: undefined } : n))
      )
    }
  }

  // Cargar notebooks y notas desde el sistema de archivos al iniciar
  useEffect(() => {
    const loadData = async (): Promise<void> => {
      if (!window.api) return

      try {
        // Cargar notebooks
        const notebooksResult = await window.api.loadNotebooks()
        if (notebooksResult.success && notebooksResult.notebooks) {
          setNotebooks(notebooksResult.notebooks)
        }

        // Cargar notas
        const notesResult = await window.api.loadNotes()
        if (notesResult.success && notesResult.notes) {
          const loadedNotes: Note[] = notesResult.notes.map((n) => ({
            id: n.id,
            title: n.title,
            content: n.content,
            notebook: n.notebook,
            createdAt: n.createdAt,
            updatedAt: n.updatedAt,
            status: 'active' as Note['status'],
            tags: []
          }))
          
          setNotes(loadedNotes)
          
          // Extraer y añadir tags al estado
          setTags((prevTags) => {
            const newTags = { ...prevTags }
            loadedNotes.forEach((note) => {
              if (note.tags) {
                note.tags.forEach((tag) => {
                  if (!newTags[tag]) {
                    // Asignar un color por defecto si el tag no tiene color
                    const defaultColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16']
                    const colorIndex = Object.keys(newTags).length % defaultColors.length
                    newTags[tag] = defaultColors[colorIndex]
                  }
                })
              }
            })
            return newTags
          })
          
          // Seleccionar la primera nota si existe
          if (loadedNotes.length > 0) {
            setSelectedNoteId(loadedNotes[0].id)
          }
        }
      } catch (error) {
        console.error('Error al cargar datos:', error)
      }
    }

    loadData()
  }, [])

  // Filtrar notas activas (no eliminadas) y según el filtro seleccionado
  const activeNotes = useMemo(() => {
    let filtered = notes.filter((n) => !n.deleted)
    
    if (filterType === 'pinned') {
      filtered = filtered.filter((n) => n.pinned)
    } else if (filterType === 'notebook' && selectedNotebook) {
      filtered = filtered.filter((n) => n.notebook === selectedNotebook)
    } else if (filterType === 'status' && selectedStatus) {
      filtered = filtered.filter((n) => (n.status || 'active') === selectedStatus)
    } else if (filterType === 'tag' && selectedTag) {
      filtered = filtered.filter((n) => n.tags?.includes(selectedTag))
    }
    
    return filtered
  }, [notes, filterType, selectedNotebook, selectedStatus, selectedTag])

  // Manejar actualización de tags
  const handleTagUpdate = (tagName: string, color: string): void => {
    setTags((prev) => ({ ...prev, [tagName]: color }))
  }

  // Manejar eliminación de tag
  const handleTagDelete = (tagName: string): void => {
    setTags((prev) => {
      const newTags = { ...prev }
      delete newTags[tagName]
      return newTags
    })
    // Remover el tag de todas las notas
    setNotes((prevNotes) =>
      prevNotes.map((note) => ({
        ...note,
        tags: note.tags?.filter((t) => t !== tagName)
      }))
    )
  }

  return (
    <SettingsProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-ink-900">
        {/* Section 1: Left Sidebar */}
        <Sidebar
          notes={notes.filter((n) => !n.deleted)}
          notebooks={notebooksWithCounts}
          tags={tags}
          selectedNotebook={selectedNotebook}
          selectedStatus={selectedStatus}
          selectedTag={selectedTag}
          onNotebookSelect={handleNotebookSelect}
          onStatusSelect={handleStatusSelect}
          onTagSelect={handleTagSelect}
          onCreateNotebook={handleCreateNotebook}
          onDeleteNotebook={handleDeleteNotebook}
          onTagUpdate={handleTagUpdate}
          onTagDelete={handleTagDelete}
          onFilterChange={setFilterType}
          onSettingsClick={() => setShowSettings(true)}
        />

        {/* Section 2: Notes List */}
        <NotesList
          notes={activeNotes}
          selectedNoteId={selectedNoteId}
          onNoteSelect={handleNoteSelect}
          onNewNote={handleNewNote}
          onPinNote={handlePinNote}
          onDeleteNote={handleDeleteNote}
        />

        {/* Section 3: Note Editor */}
        <NoteEditor
          note={selectedNote || null}
          notebooks={notebooksWithCounts}
          tags={tags}
          onNoteUpdate={handleNoteUpdate}
          onTagUpdate={handleTagUpdate}
        />

        {/* Settings Modal */}
        {showSettings && <Settings onClose={() => setShowSettings(false)} />}
      </div>
    </SettingsProvider>
  )
}

export default App
