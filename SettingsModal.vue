<template>
  <BaseModal title="Настройки характеристик" @close="$emit('close')">
    <div class="settings-content">
      <!-- Раздел 1: Критерии классификации -->
      <section class="criteria-section">
        <h3>Критерии классификации</h3>
        <div class="criteria-list">
          <div 
            v-for="criterion in sortedCriteria" 
            :key="criterion.id"
            :class="['criterion-item', { universal: criterion.isUniversal, disabled: hasUniversalCriterion && !criterion.isUniversal }]"
          >
            <span class="criterion-name">{{ criterion.name }}</span>
            <div class="criterion-actions">
              <button 
                v-if="!criterion.isUniversal" 
                @click="moveCriterionUp(criterion.id)"
                :disabled="hasUniversalCriterion || criterion.order === 1"
                title="Переместить вверх"
              >↑</button>
              <button 
                v-if="!criterion.isUniversal" 
                @click="moveCriterionDown(criterion.id)"
                :disabled="hasUniversalCriterion || criterion.order === criteria.length - (hasUniversalCriterion ? 1 : 0)"
                title="Переместить вниз"
              >↓</button>
              <button 
                v-if="!criterion.isUniversal" 
                @click="deleteCriterion(criterion.id)"
                :disabled="hasUniversalCriterion"
                class="delete-btn"
                title="Удалить критерий"
              >×</button>
            </div>
          </div>
        </div>
        
        <!-- Добавление нового критерия -->
        <div class="add-criterion-form">
          <input 
            v-model="newCriterionName" 
            type="text" 
            placeholder="Введите название нового критерия"
            :disabled="hasUniversalCriterion"
            class="criterion-input"
          >
          <button 
            @click="addCriterion" 
            :disabled="!newCriterionName.trim() || hasUniversalCriterion"
            class="add-criterion-btn"
          >
            + Добавить критерий
          </button>
        </div>

        <!-- Предупреждение о универсальном критерии -->
        <div v-if="hasUniversalCriterion" class="universal-warning">
          ⚠️ Активен универсальный критерий "Для любых критериев". Другие критерии недоступны.
        </div>
      </section>

      <!-- Раздел 2: Форма добавления новой характеристики -->
      <section class="add-characteristic-section">
        <h3>Добавить характеристику</h3>
        <form @submit.prevent="addCharacteristic" class="characteristic-form">
          <div class="form-row">
            <!-- Выпадающий список критериев -->
            <select 
              v-model="newCharacteristic.criteriaId"
              :disabled="hasUniversalCriterion"
              class="criteria-select"
            >
              <option value="">Выберите критерий</option>
              <option 
                v-for="criterion in availableCriteria" 
                :key="criterion.id"
                :value="criterion.id"
                :disabled="criterion.disabled"
              >
                {{ criterion.name }}
              </option>
            </select>
            
            <!-- Выпадающий список значений -->
            <select 
              v-model="newCharacteristic.value"
              :disabled="!newCharacteristic.criteriaId || hasUniversalCriterion"
              class="value-select"
            >
              <option value="">Выберите значение</option>
              <option 
                v-for="value in availableValues" 
                :key="value"
                :value="value"
              >
                {{ value }}
              </option>
            </select>
            
            <button 
              type="submit" 
              :disabled="!canAddCharacteristic || hasUniversalCriterion"
              class="add-characteristic-btn"
            >
              + Добавить в таблицу
            </button>
          </div>
        </form>
      </section>
    </div>

    <template #footer>
      <button class="close-button" @click="$emit('close')">Закрыть</button>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import BaseModal from '@/components/ui/BaseModal.vue'

interface Criterion {
  id: string
  name: string
  order: number
  isUniversal: boolean
  values: string[]
}

interface Characteristic {
  id: string
  criteriaId: string
  value: string
}

// Исходные данные критериев
const initialCriteria = ref<Criterion[]>([
  { 
    id: '1', 
    name: 'Максимальная крупность зерен', 
    order: 1, 
    isUniversal: false,
    values: ['A32', 'A40', 'A50', 'A63', 'A80']
  },
  { 
    id: '2', 
    name: 'Слой покрытия', 
    order: 2, 
    isUniversal: false,
    values: ['Тонкий', 'Средний', 'Толстый', 'Очень толстый']
  },
  { 
    id: '3', 
    name: 'Условия движения', 
    order: 3, 
    isUniversal: false,
    values: ['Легковые', 'Грузовые', 'Спецтранспорт', 'Все типы']
  }
])

const criteria = ref<Criterion[]>([...initialCriteria.value])
const newCriterionName = ref('')
const newCharacteristic = reactive({
  criteriaId: '',
  value: ''
})

// Вычисляемые свойства
const hasUniversalCriterion = computed(() => {
  return criteria.value.some(c => c.isUniversal)
})

const sortedCriteria = computed(() => {
  return [...criteria.value].sort((a, b) => a.order - b.order)
})

const availableCriteria = computed(() => {
  return criteria.value.map(criterion => ({
    ...criterion,
    disabled: hasUniversalCriterion.value && !criterion.isUniversal
  }))
})

const availableValues = computed(() => {
  if (!newCharacteristic.criteriaId) return []
  const criterion = criteria.value.find(c => c.id === newCharacteristic.criteriaId)
  return criterion?.values || []
})

const canAddCharacteristic = computed(() => {
  return newCharacteristic.criteriaId && newCharacteristic.value
})

const emit = defineEmits<{
  close: []
}>()

// Методы для работы с критериями
function addCriterion() {
  if (!newCriterionName.value.trim()) return

  const newCriterion: Criterion = {
    id: Date.now().toString(),
    name: newCriterionName.value.trim(),
    order: criteria.value.length + 1,
    isUniversal: newCriterionName.value.trim() === 'Для любых критериев',
    values: []
  }

  // Проверка правила №1
  if (newCriterion.isUniversal) {
    if (hasUniversalCriterion.value) {
      alert('Критерий "Для любых критериев" уже существует!')
      return
    }
    
    // Перемещаем универсальный критерий на первую позицию
    criteria.value.forEach(c => {
      if (c.isUniversal) return
      c.order += 1
    })
    newCriterion.order = 1
    
    // Меняем название вкладки на "Общие"
    newCriterion.name = 'Общие'
  }

  criteria.value.push(newCriterion)
  newCriterionName.value = ''
  
  console.log('Добавлен критерий:', newCriterion.name)
}

function deleteCriterion(criterionId: string) {
  const index = criteria.value.findIndex(c => c.id === criterionId)
  if (index !== -1) {
    const deletedCriterion = criteria.value[index]
    criteria.value.splice(index, 1)
    
    // Обновляем порядок оставшихся критериев
    criteria.value.forEach((criterion, idx) => {
      criterion.order = idx + 1
    })
    
    console.log('Удален критерий:', deletedCriterion.name)
  }
}

function moveCriterionUp(criterionId: string) {
  const index = criteria.value.findIndex(c => c.id === criterionId)
  if (index > 0) {
    const currentOrder = criteria.value[index].order
    const prevOrder = criteria.value[index - 1].order
    
    criteria.value[index].order = prevOrder
    criteria.value[index - 1].order = currentOrder
  }
}

function moveCriterionDown(criterionId: string) {
  const index = criteria.value.findIndex(c => c.id === criterionId)
  if (index < criteria.value.length - 1) {
    const currentOrder = criteria.value[index].order
    const nextOrder = criteria.value[index + 1].order
    
    criteria.value[index].order = nextOrder
    criteria.value[index + 1].order = currentOrder
  }
}

// Методы для работы с характеристиками
function addCharacteristic() {
  if (!canAddCharacteristic.value) return

  const criterion = criteria.value.find(c => c.id === newCharacteristic.criteriaId)
  if (!criterion) return

  const newChar: Characteristic = {
    id: Date.now().toString(),
    criteriaId: newCharacteristic.criteriaId,
    value: newCharacteristic.value
  }

  console.log('Добавлена характеристика:', {
    criterion: criterion.name,
    value: newCharacteristic.value
  })

  // Сброс формы
  newCharacteristic.criteriaId = ''
  newCharacteristic.value = ''
}

// Восстановление исходных критериев
function restoreInitialCriteria() {
  criteria.value = [...initialCriteria.value]
}
</script>

<style scoped>
.settings-content {
  max-width: 600px;
  max-height: 70vh;
  overflow-y: auto;
  padding-right: 8px;
}

.settings-content > section {
  margin-bottom: 32px;
}

h3 {
  margin-bottom: 16px;
  color: #2c3e50;
  font-size: 18px;
  font-weight: 600;
  border-bottom: 2px solid #3498db;
  padding-bottom: 8px;
}

/* Стили для раздела критериев */
.criteria-section {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.criteria-list {
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background: white;
  margin-bottom: 16px;
  max-height: 200px;
  overflow-y: auto;
}

.criterion-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  transition: all 0.3s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #f8f9fa;
  }

  &.universal {
    background: #e3f2fd;
    border-left: 4px solid #2196f3;
    
    .criterion-name {
      font-weight: 600;
      color: #1976d2;
    }
  }

  &.disabled {
    opacity: 0.5;
    background: #f5f5f5;
    
    .criterion-actions button {
      cursor: not-allowed;
    }
  }
}

.criterion-name {
  font-weight: 500;
  color: #2c3e50;
}

.criterion-actions {
  display: flex;
  gap: 4px;
  
  button {
    padding: 4px 8px;
    border: 1px solid #ddd;
    background: white;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    transition: all 0.2s ease;

    &:hover:not(:disabled) {
      background: #3498db;
      color: white;
      border-color: #3498db;
    }

    &:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }

    &.delete-btn {
      color: #e74c3c;
      border-color: #e74c3c;

      &:hover:not(:disabled) {
        background: #e74c3c;
        color: white;
      }
    }
  }
}

.add-criterion-form {
  display: flex;
  gap: 8px;
  align-items: center;

  .criterion-input {
    flex: 1;
    padding: 10px 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 14px;

    &:focus {
      outline: none;
      border-color: #3498db;
      box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.1);
    }

    &:disabled {
      background: #f5f5f5;
      color: #999;
    }
  }

  .add-criterion-btn {
    padding: 10px 16px;
    border: 1px solid #27ae60;
    background: #27ae60;
    color: white;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
    white-space: nowrap;

    &:hover:not(:disabled) {
      background: #219a52;
      border-color: #219a52;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      background: #bdc3c7;
      border-color: #bdc3c7;
    }
  }
}

.universal-warning {
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  color: #856404;
  padding: 12px;
  border-radius: 6px;
  margin-top: 12px;
  font-size: 14px;
}

/* Стили для раздела характеристик */
.add-characteristic-section {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.characteristic-form {
  .form-row {
    display: flex;
    gap: 8px;
    align-items: center;

    select {
      flex: 1;
      padding: 10px 12px;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 14px;
      background: white;
      cursor: pointer;

      &:focus {
        outline: none;
        border-color: #3498db;
        box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.1);
      }

      &:disabled {
        background: #f5f5f5;
        color: #999;
        cursor: not-allowed;
      }
    }

    .add-characteristic-btn {
      padding: 10px 16px;
      border: 1px solid #3498db;
      background: #3498db;
      color: white;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      white-space: nowrap;

      &:hover:not(:disabled) {
        background: #2980b9;
        border-color: #2980b9;
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        background: #bdc3c7;
        border-color: #bdc3c7;
      }
    }
  }
}

.close-button {
  padding: 10px 24px;
  border: 1px solid #bdc3c7;
  background: white;
  color: #2c3e50;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    background: #f8f9fa;
    border-color: #95a5a6;
  }
}

/* Адаптивность */
@media (max-width: 768px) {
  .settings-content {
    max-width: 100%;
    padding-right: 4px;
  }

  .add-criterion-form {
    flex-direction: column;
    align-items: stretch;
  }

  .characteristic-form .form-row {
    flex-direction: column;
  }

  .criterion-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .criterion-actions {
    align-self: flex-end;
  }
}
</style>