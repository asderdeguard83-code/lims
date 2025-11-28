import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Set } from '@/types/technicalRequirements'

export const useSetsStore = defineStore('sets', () => {
  // Инициализируем с одним набором по умолчанию
  const sets = ref<Set[]>([
    {
      id: '1',
      name: 'Набор1',
      products: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ])
  
  const currentSetIndex = ref(0)

  // Вычисляемое свойство для текущего набора
  const currentSet = computed(() => {
    return sets.value.length > 0 ? sets.value[currentSetIndex.value] : null
  })

  function addSet(setData: Omit<Set, 'id' | 'createdAt' | 'updatedAt'>) {
    const newSet: Set = {
      ...setData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    sets.value.push(newSet)
    currentSetIndex.value = sets.value.length - 1
    
    console.log('✅ Набор добавлен:', newSet.name)
    console.log('📊 Всего наборов:', sets.value.length)
    console.log('🎯 Текущий набор:', currentSet.value?.name)
    
    return newSet
  }

  function deleteSet(setId: string) {
    console.log('🗑️ Удаление набора ID:', setId)
    
    const index = sets.value.findIndex(s => s.id === setId)
    if (index === -1) {
      console.log('❌ Набор не найден')
      return
    }
    
    // Удаляем набор
    sets.value.splice(index, 1)
    console.log('✅ Набор удален. Осталось:', sets.value.length)
    
    // Обновляем текущий индекс
    if (sets.value.length === 0) {
      currentSetIndex.value = 0
    } else if (currentSetIndex.value >= sets.value.length) {
      currentSetIndex.value = sets.value.length - 1
    }
    
    console.log('🎯 Новый текущий набор:', currentSet.value?.name || 'нет')
  }

  function updateSetName(setId: string, newName: string) {
    console.log('✏️ Обновление названия набора:', setId, '->', newName)
    
    const set = sets.value.find(s => s.id === setId)
    if (!set) {
      console.log('❌ Набор не найден')
      return
    }
    
    set.name = newName
    set.updatedAt = new Date()
    
    console.log('✅ Название обновлено:', set.name)
  }

  function switchToSet(index: number) {
    if (index >= 0 && index < sets.value.length) {
      currentSetIndex.value = index
      console.log('🔄 Переключение на набор:', currentSet.value?.name)
    }
  }

  function switchToNextSet() {
    if (sets.value.length <= 1) return
    
    const nextIndex = (currentSetIndex.value + 1) % sets.value.length
    switchToSet(nextIndex)
  }

  function switchToPrevSet() {
    if (sets.value.length <= 1) return
    
    const prevIndex = (currentSetIndex.value - 1 + sets.value.length) % sets.value.length
    switchToSet(prevIndex)
  }

  // Для отладки
  function debugState() {
    console.log('=== DEBUG SETS STORE ===')
    console.log('Наборы:', sets.value.map(s => ({id: s.id, name: s.name})))
    console.log('Текущий индекс:', currentSetIndex.value)
    console.log('Текущий набор:', currentSet.value?.name)
    console.log('========================')
  }

  return {
    sets: computed(() => sets.value),
    currentSet,
    currentSetIndex: computed(() => currentSetIndex.value),
    addSet,
    deleteSet,
    updateSetName,
    switchToSet,
    switchToNextSet,
    switchToPrevSet,
    debugState
  }
})