export interface Product {
  id: string
  name: string
  standard: string
  group: ProductGroup
  characteristics: Characteristic[]
  createdAt: Date
  updatedAt: Date
}

export type ProductGroup = 
  | 'road-materials' 
  | 'construction-materials' 
  | 'binding-materials' 
  | 'fillers'

export interface Characteristic {
  id: string
  name: string
  criteria: string
  order: number
  indicators: Indicator[]
  disabled?: boolean
}

export interface Indicator {
  id: string
  name: string
  standard: string
  unit: string
  comparison: ComparisonOperator
  value: string
  deviation: string
  note: string
  additionalRequirements: string
  order: number
}

export type ComparisonOperator = 
  | 'equals' 
  | 'range' 
  | 'greater' 
  | 'less' 
  | 'greaterOrEquals' 
  | 'lessOrEquals'

export interface Set {
  id: string
  name: string
  products: Product[]
  createdAt: Date
  updatedAt: Date
}

export interface ConfirmationModalData {
  title: string
  message: string
  confirmText: string
  confirmAction: () => void
}