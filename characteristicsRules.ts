import type { Characteristic } from '@/types/technicalRequirements'

export function handleUniversalCriterion(
  characteristics: Characteristic[], 
  newCriterion: Characteristic
): Characteristic[] {
  const hasUniversal = newCriterion.name === 'Для любых критериев'
  
  if (hasUniversal) {
    return [
      { ...newCriterion, name: 'Общие' },
      ...characteristics.map(ch => ({ ...ch, disabled: true }))
    ]
  }
  
  const existingUniversal = characteristics.find(ch => 
    ch.name === 'Для любых критериев' || ch.name === 'Общие'
  )
  
  if (existingUniversal) {
    throw new Error('Критерий "Для любых критериев" уже существует')
  }
  
  return [...characteristics, newCriterion]
}

export function reorderCharacteristics(
  characteristics: Characteristic[], 
  fromIndex: number, 
  toIndex: number
): Characteristic[] {
  const result = [...characteristics]
  const [removed] = result.splice(fromIndex, 1)
  result.splice(toIndex, 0, removed)
  
  return result.map((ch, index) => ({
    ...ch,
    order: index
  }))
}