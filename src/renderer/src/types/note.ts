export interface Tag {
  name: string
  color: string
}

export interface Note {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
  notebook?: string
  status?: 'active' | 'on-hold' | 'completed' | 'dropped'
  tags?: string[]
  pinned?: boolean
  deleted?: boolean
}

export interface Notebook {
  id: string
  name: string
  parentId?: string
  children?: Notebook[]
  count?: number
}
