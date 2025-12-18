/* eslint-disable prettier/prettier */
import { join } from 'path'
import { existsSync, mkdirSync, writeFileSync, readFileSync, unlinkSync, readdirSync, statSync, rmSync } from 'fs'
import { homedir } from 'os'
import { app } from 'electron'

/**
 * Obtiene la ruta de la carpeta de documentos del usuario según el sistema operativo
 */
export function getDocumentsPath(): string {
  const docPath = app.getPath('documents')
  if (docPath && existsSync(docPath)) return docPath
  const home = homedir()
  const candidates = ['Documents', 'Documentos', 'My Documents']
  for (const name of candidates) {
    const p = join(home, name)
    if (existsSync(p)) return p
  }
  return join(home, 'Documents')
}

/**
 * Obtiene la ruta de la carpeta inkdrop-notes
 */
export function getInkdropNotesPath(): string {
  const documentsPath = getDocumentsPath()
  return join(documentsPath, 'inkdrop-notes')
}

/**
 * Asegura que la carpeta inkdrop-notes existe, creándola si es necesario
 */
export function ensureInkdropNotesFolder(): string {
  const inkdropPath = getInkdropNotesPath()
  try {
    if (!existsSync(inkdropPath)) {
      mkdirSync(inkdropPath, { recursive: true })
      console.log('Carpeta inkdrop-notes creada en:', inkdropPath)
    } else {
      console.log('Carpeta inkdrop-notes ya existe en:', inkdropPath)
    }
  } catch (error) {
    console.error('Error al crear carpeta inkdrop-notes:', error)
    throw error
  }
  return inkdropPath
}

/**
 * Sanitiza el nombre del archivo para que sea válido en el sistema de archivos
 */
export function sanitizeFileName(fileName: string): string {
  // Reemplazar caracteres inválidos con guiones bajos
  return fileName
    .replace(/[<>:"/\\|?*]/g, '_')
    .replace(/\s+/g, '_')
    .replace(/_{2,}/g, '_')
    .trim()
}

/**
 * Busca un archivo existente por ID de nota
 */
function findExistingNoteFile(noteId: string, inkdropPath: string): string | null {
  try {
    // Buscar en la carpeta raíz
    if (existsSync(inkdropPath)) {
      const files = readdirSync(inkdropPath)
      for (const file of files) {
        const filePath = join(inkdropPath, file)
        const stats = statSync(filePath)
        if (stats.isFile() && file.endsWith('.md') && file.includes(`_${noteId}.md`)) {
          return filePath
        }
      }
    }

    // Buscar en subcarpetas (notebooks)
    if (existsSync(inkdropPath)) {
      const items = readdirSync(inkdropPath)
      for (const item of items) {
        const itemPath = join(inkdropPath, item)
        const stats = statSync(itemPath)
        if (stats.isDirectory()) {
          const files = readdirSync(itemPath)
          for (const file of files) {
            const filePath = join(itemPath, file)
            if (file.endsWith('.md') && file.includes(`_${noteId}.md`)) {
              return filePath
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('Error al buscar archivo existente:', error)
  }
  return null
}

/**
 * Guarda una nota como archivo .md
 */
export function saveNoteToFile(noteId: string, title: string, content: string, notebookId?: string): string {
  try {
    // Asegurar que la carpeta existe
    const inkdropPath = ensureInkdropNotesFolder()
    console.log('Guardando nota en:', inkdropPath)
    
    // Buscar archivo existente por ID
    const existingFile = findExistingNoteFile(noteId, inkdropPath)
    if (existingFile) {
      console.log('Archivo existente encontrado:', existingFile)
      // Si existe, actualizar el contenido
      writeFileSync(existingFile, content, 'utf-8')
      
      // Si el notebook cambió o el título cambió, mover/renombrar el archivo
      const targetNotebookPath = notebookId 
        ? join(inkdropPath, sanitizeFileName(notebookId))
        : inkdropPath
      
      if (!existsSync(targetNotebookPath)) {
        mkdirSync(targetNotebookPath, { recursive: true })
        console.log('Carpeta de notebook creada:', targetNotebookPath)
      }
      
      const safeTitle = sanitizeFileName(title) || 'Untitled_Note'
      const newFileName = `${safeTitle}_${noteId}.md`
      const newFilePath = join(targetNotebookPath, newFileName)
      
      // Si la ruta es diferente, mover el archivo
      if (existingFile !== newFilePath) {
        writeFileSync(newFilePath, content, 'utf-8')
        unlinkSync(existingFile)
        console.log('Archivo movido a:', newFilePath)
        return newFilePath
      }
      
      console.log('Archivo actualizado:', existingFile)
      return existingFile
    }
    
    // Si no existe, crear nuevo archivo
    let targetPath = inkdropPath
    if (notebookId) {
      const notebookPath = join(inkdropPath, sanitizeFileName(notebookId))
      if (!existsSync(notebookPath)) {
        mkdirSync(notebookPath, { recursive: true })
        console.log('Carpeta de notebook creada:', notebookPath)
      }
      targetPath = notebookPath
    }

    // Crear nombre de archivo seguro
    const safeTitle = sanitizeFileName(title) || 'Untitled_Note'
    const fileName = `${safeTitle}_${noteId}.md`
    const filePath = join(targetPath, fileName)

    // Escribir el archivo
    writeFileSync(filePath, content, 'utf-8')
    console.log('Archivo creado exitosamente:', filePath)
    
    return filePath
  } catch (error) {
    console.error('Error al guardar nota:', error)
    throw error
  }
}

/**
 * Elimina un archivo de nota
 */
export function deleteNoteFile(noteId: string, title: string, notebookId?: string): boolean {
  try {
    const inkdropPath = getInkdropNotesPath()
    
    if (!existsSync(inkdropPath)) {
      return false
    }

    let targetPath = inkdropPath
    if (notebookId) {
      targetPath = join(inkdropPath, sanitizeFileName(notebookId))
    }

    const safeTitle = sanitizeFileName(title) || 'Untitled_Note'
    const fileName = `${safeTitle}_${noteId}.md`
    const filePath = join(targetPath, fileName)

    if (existsSync(filePath)) {
      unlinkSync(filePath)
      return true
    }

    return false
  } catch (error) {
    console.error('Error al eliminar nota:', error)
    return false
  }
}

/**
 * Lee el contenido de un archivo de nota
 */
export function readNoteFile(filePath: string): string | null {
  try {
    if (existsSync(filePath)) {
      return readFileSync(filePath, 'utf-8')
    }
    return null
  } catch (error) {
    console.error('Error al leer nota:', error)
    return null
  }
}

export function deleteNotebookFolder(notebookId: string): boolean {
  try {
    const base = getInkdropNotesPath()
    const sanitizedId = sanitizeFileName(notebookId)
    const folder = join(base, sanitizedId)
    if (existsSync(folder)) {
      rmSync(folder, { recursive: true, force: true })
      
      // Eliminar metadatos del notebook
      const metadata = loadNotebooksMetadata()
      delete metadata[sanitizedId]
      saveNotebooksMetadata(metadata)
      
      return true
    }
    return false
  } catch (error) {
    console.error('Error al eliminar notebook:', error)
    return false
  }
}

/**
 * Obtiene la ruta del archivo de metadatos de notebooks
 */
function getNotebooksMetadataPath(): string {
  return join(getInkdropNotesPath(), 'notebooks.json')
}

/**
 * Carga los metadatos de notebooks desde el archivo JSON
 */
function loadNotebooksMetadata(): Record<string, string> {
  try {
    const metadataPath = getNotebooksMetadataPath()
    if (existsSync(metadataPath)) {
      const content = readFileSync(metadataPath, 'utf-8')
      return JSON.parse(content)
    }
  } catch (error) {
    console.error('Error al cargar metadatos de notebooks:', error)
  }
  return {}
}

/**
 * Guarda los metadatos de notebooks en el archivo JSON
 */
function saveNotebooksMetadata(metadata: Record<string, string>): void {
  try {
    ensureInkdropNotesFolder()
    const metadataPath = getNotebooksMetadataPath()
    writeFileSync(metadataPath, JSON.stringify(metadata, null, 2), 'utf-8')
  } catch (error) {
    console.error('Error al guardar metadatos de notebooks:', error)
  }
}

/**
 * Crea una carpeta para un notebook dentro de inkdrop-notes
 */
export function createNotebookFolder(notebookId: string, notebookName: string): string {
  try {
    const inkdropPath = ensureInkdropNotesFolder()
    const sanitizedId = sanitizeFileName(notebookId)
    const notebookPath = join(inkdropPath, sanitizedId)
    
    if (!existsSync(notebookPath)) {
      mkdirSync(notebookPath, { recursive: true })
      console.log('Carpeta de notebook creada:', notebookPath)
    } else {
      console.log('Carpeta de notebook ya existe:', notebookPath)
    }
    
    // Guardar metadatos del notebook (nombre real)
    const metadata = loadNotebooksMetadata()
    metadata[sanitizedId] = notebookName
    saveNotebooksMetadata(metadata)
    
    return notebookPath
  } catch (error) {
    console.error('Error al crear carpeta de notebook:', error)
    throw error
  }
}

/**
 * Carga todos los notebooks desde las carpetas en inkdrop-notes
 */
export function loadNotebooksFromFilesystem(): Array<{ id: string; name: string }> {
  try {
    const inkdropPath = getInkdropNotesPath()
    if (!existsSync(inkdropPath)) {
      return []
    }

    const metadata = loadNotebooksMetadata()
    const notebooks: Array<{ id: string; name: string }> = []
    const items = readdirSync(inkdropPath)
    
    for (const item of items) {
      const itemPath = join(inkdropPath, item)
      const stats = statSync(itemPath)
      
      // Ignorar el archivo de metadatos
      if (item === 'notebooks.json') {
        continue
      }
      
      // Solo considerar carpetas (notebooks)
      if (stats.isDirectory()) {
        // El ID del notebook es el nombre de la carpeta (ya sanitizado)
        // Usar el nombre de los metadatos si existe, sino usar el ID como nombre
        notebooks.push({
          id: item, // El ID es el nombre sanitizado de la carpeta
          name: metadata[item] || item.replace(/_/g, ' ') // Usar nombre de metadatos o revertir sanitización
        })
      }
    }
    
    return notebooks
  } catch (error) {
    console.error('Error al cargar notebooks:', error)
    return []
  }
}

/**
 * Carga todas las notas desde los archivos .md en inkdrop-notes
 */
export function loadNotesFromFilesystem(): Array<{
  id: string
  title: string
  content: string
  notebook?: string
  createdAt: string
  updatedAt: string
}> {
  try {
    const inkdropPath = getInkdropNotesPath()
    if (!existsSync(inkdropPath)) {
      return []
    }

    const notes: Array<{
      id: string
      title: string
      content: string
      notebook?: string
      createdAt: string
      updatedAt: string
    }> = []

    // Función auxiliar para procesar archivos en una carpeta
    const processFolder = (folderPath: string, notebookId?: string): void => {
      try {
        const items = readdirSync(folderPath)
        
        for (const item of items) {
          const itemPath = join(folderPath, item)
          const stats = statSync(itemPath)
          
          if (stats.isFile() && item.endsWith('.md')) {
            // Formato: {title}_{noteId}.md
            // El ID es numérico (timestamp), así que buscamos el último _ seguido de números
            const match = item.match(/^(.+)_(\d+)\.md$/)
            if (match) {
              const [, titlePart, noteId] = match
              const content = readFileSync(itemPath, 'utf-8')
              const fileStats = statSync(itemPath)
              
              // Revertir sanitización del título: reemplazar _ con espacios
              const title = titlePart.replace(/_/g, ' ').trim() || 'Untitled Note'
              
              notes.push({
                id: noteId,
                title,
                content,
                notebook: notebookId,
                createdAt: fileStats.birthtime.toISOString(),
                updatedAt: fileStats.mtime.toISOString()
              })
            }
          } else if (stats.isDirectory()) {
            // Procesar subcarpetas (notebooks)
            processFolder(itemPath, item)
          }
        }
      } catch (error) {
        console.error(`Error al procesar carpeta ${folderPath}:`, error)
      }
    }

    // Procesar carpeta raíz (notas sin notebook)
    processFolder(inkdropPath)
    
    return notes
  } catch (error) {
    console.error('Error al cargar notas:', error)
    return []
  }
}

/**
 * Obtiene la ruta del archivo welcomeNote.md en resources
 */
function getWelcomeNoteTemplatePath(): string {
  // En desarrollo, está en resources/welcomeNote.md
  // En producción, está en resources/welcomeNote.md (relativo a la app)
  // Como está en asarUnpack, está disponible en la carpeta de recursos
  if (app.isPackaged) {
    // En producción, los recursos desempaquetados están en process.resourcesPath
    return join(process.resourcesPath, 'resources', 'welcomeNote.md')
  } else {
    // En desarrollo, está en la raíz del proyecto
    return join(__dirname, '../../resources/welcomeNote.md')
  }
}

/**
 * Crea la nota de bienvenida si el usuario es nuevo (no tiene notas)
 */
export function createWelcomeNoteIfNewUser(): void {
  try {
    // Verificar si ya hay notas
    const existingNotes = loadNotesFromFilesystem()
    if (existingNotes.length > 0) {
      console.log('Usuario existente, no se crea nota de bienvenida')
      return
    }

    // Leer el contenido del template
    const welcomeTemplatePath = getWelcomeNoteTemplatePath()
    if (!existsSync(welcomeTemplatePath)) {
      console.warn('No se encontró el archivo welcomeNote.md en:', welcomeTemplatePath)
      return
    }

    const welcomeContent = readFileSync(welcomeTemplatePath, 'utf-8')
    
    // Crear ID único para la nota de bienvenida
    const noteId = Date.now().toString()
    const title = 'Welcome to Inkdrop'
    
    // Guardar la nota de bienvenida
    saveNoteToFile(noteId, title, welcomeContent)
    console.log('Nota de bienvenida creada exitosamente')
  } catch (error) {
    console.error('Error al Create note de bienvenida:', error)
    // No lanzar error para no interrumpir el inicio de la app
  }
}

