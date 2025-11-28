import type { Indicator } from '@/types/technicalRequirements'

export function validateIndicator(indicator: Indicator): string[] {
  const errors: string[] = []
  
  if (!indicator.name?.trim()) {
    errors.push('Название показателя обязательно')
  }
  
  if (!indicator.standard) {
    errors.push('Нормативный документ обязателен')
  }
  
  if (indicator.comparison === 'range') {
    const rangePattern = /^\d+\s*-\s*\d+$/
    if (!rangePattern.test(indicator.value)) {
      errors.push('Для диапазона используйте формат "число-число"')
    }
  }
  
  if (indicator.value && !/^[\d\s\-.,]+$/.test(indicator.value)) {
    errors.push('Значение должно содержать только цифры и допустимые символы (-, ., )')
  }
  
  return errors
}

export function validateIndicatorsForSave(indicators: Indicator[]): boolean {
  return indicators.every(indicator => {
    const errors = validateIndicator(indicator)
    return errors.length === 0
  })
}