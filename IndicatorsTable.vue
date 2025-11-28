<template>
  <div class="indicators-table">
    <div class="table-controls">
      <button @click="$emit('add-indicators')">
        Добавить показатели (список)
      </button>
      <button 
        @click="handleDeleteSelected" 
        :disabled="selectedIndicators.length === 0"
      >
        Удалить выбранные ({{ selectedIndicators.length }})
      </button>
      
      <label class="select-all">
        <input 
          type="checkbox" 
          v-model="selectAll"
          @change="toggleSelectAll"
        >
        Все показатели
      </label>
    </div>
    
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>
              <input type="checkbox" v-model="selectAll">
            </th>
            <th>ПОКАЗАТЕЛЬ</th>
            <th>НОРМАТИВНЫЙ ДОКУМЕНТ</th>
            <th>ЕДИНИЦА ИЗМЕРЕНИЯ</th>
            <th>СРАВНЕНИЕ</th>
            <th>ЗНАЧЕНИЕ</th>
            <th>ОТКЛОНЕНИЕ</th>
            <th>ПРИМ. ПО ГОСТ</th>
            <th>ДОП. ТЕХ. ТРЕБ.</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="indicator in indicators" :key="indicator.id">
            <td>
              <input 
                type="checkbox" 
                v-model="selectedIndicators"
                :value="indicator.id"
              >
            </td>
            <td>{{ indicator.name }}</td>
            <td>
              <select 
                v-model="indicator.standard"
                @change="updateIndicator(indicator)"
              >
                <option value="">Выберите ГОСТ</option>
                <option 
                  v-for="standard in availableStandards" 
                  :key="standard"
                  :value="standard"
                >
                  {{ standard }}
                </option>
              </select>
            </td>
            <td>
              <select 
                v-model="indicator.unit"
                @change="updateIndicator(indicator)"
              >
                <option value="">Выберите единицу</option>
                <option 
                  v-for="unit in availableUnits" 
                  :key="unit"
                  :value="unit"
                >
                  {{ unit }}
                </option>
              </select>
            </td>
            <td>
              <select 
                v-model="indicator.comparison"
                @change="updateIndicator(indicator)"
              >
                <option value="">Выберите оператор</option>
                <option value="equals">равно</option>
                <option value="range">от...до</option>
                <option value="greater">больше</option>
                <option value="less">меньше</option>
                <option value="greaterOrEquals">больше или равно</option>
                <option value="lessOrEquals">меньше или равно</option>
              </select>
            </td>
            <td>
              <input 
                v-model="indicator.value" 
                type="text"
                placeholder="Введите значение"
                @blur="updateIndicator(indicator)"
                @keyup.enter="updateIndicator(indicator)"
              >
            </td>
            <td>
              <input 
                v-model="indicator.deviation" 
                type="text"
                placeholder="Допустимое отклонение"
                @blur="updateIndicator(indicator)"
                @keyup.enter="updateIndicator(indicator)"
              >
            </td>
            <td>
              <input 
                v-model="indicator.note" 
                type="text"
                placeholder="Примечание"
                @blur="updateIndicator(indicator)"
                @keyup.enter="updateIndicator(indicator)"
              >
            </td>
            <td>
              <input 
                v-model="indicator.additionalRequirements" 
                type="text"
                placeholder="Дополнительные требования"
                @blur="updateIndicator(indicator)"
                @keyup.enter="updateIndicator(indicator)"
              >
            </td>
          </tr>
        </tbody>
      </table>
      
      <div v-if="indicators.length === 0" class="empty-state">
        Нет показателей. Добавьте показатели для отображения
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Indicator } from '@/types/technicalRequirements'

const props = defineProps<{
  indicators: Indicator[]
}>()

const emit = defineEmits<{
  'add-indicators': []
  'delete-indicators': [indicatorIds: string[]]
  'update-indicator': [indicator: Indicator]
}>()

const selectedIndicators = ref<string[]>([])
const selectAll = ref(false)

const availableStandards = [
  'ГОСТ 7473-2010',
  'ГОСТ 9128-2013',
  'ГОСТ 33029-2014', 
  'ГОСТ 8267-93',
  'ГОСТ 31108-2003',
  'ГОСТ 26633-2015',
  'ГОСТ 10180-2012'
]

const availableUnits = ['%', 'МПа', 'мм', 'см', 'г/см²', 'W', 'F', 'кг/м³', 'сут']

const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedIndicators.value = props.indicators.map(i => i.id)
  } else {
    selectedIndicators.value = []
  }
}

watch(() => props.indicators, () => {
  selectAll.value = false
  selectedIndicators.value = []
})

watch(selectedIndicators, (newVal) => {
  selectAll.value = newVal.length === props.indicators.length && props.indicators.length > 0
})

function updateIndicator(indicator: Indicator) {
  emit('update-indicator', indicator)
}

function handleDeleteSelected() {
  if (selectedIndicators.value.length > 0) {
    emit('delete-indicators', selectedIndicators.value)
    selectedIndicators.value = []
  }
}
</script>

<style scoped>
.indicators-table {
  flex: 1;
  padding: 16px;
  overflow: auto;
  display: flex;
  flex-direction: column;
}

.table-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 4px;

  button {
    padding: 8px 16px;
    border: 1px solid #ddd;
    background: white;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover:not(:disabled) {
      background: #f0f0f0;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    &:first-child {
      background: #3498db;
      color: white;
      border-color: #3498db;

      &:hover {
        background: #2980b9;
      }
    }

    &:nth-child(2) {
      background: #e74c3c;
      color: white;
      border-color: #e74c3c;

      &:hover:not(:disabled) {
        background: #c0392b;
      }
    }
  }

  .select-all {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 500;
  }
}

.table-container {
  flex: 1;
  overflow-x: auto;
  border: 1px solid #e0e0e0;
  border-radius: 4px;

  table {
    width: 100%;
    border-collapse: collapse;
    min-width: 1000px;

    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #e0e0e0;
      white-space: nowrap;
    }

    th {
      background: #f8f9fa;
      font-weight: 600;
      position: sticky;
      top: 0;
      border-bottom: 2px solid #dee2e6;
    }

    tr:hover {
      background: #f8f9fa;
    }

    input[type="text"], select {
      width: 100%;
      padding: 6px 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 13px;
      transition: border-color 0.2s;

      &:focus {
        outline: none;
        border-color: #3498db;
        box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
      }

      &:hover {
        border-color: #bbb;
      }
    }

    input[type="checkbox"] {
      width: 16px;
      height: 16px;
      cursor: pointer;
    }

    select {
      background: white;
      cursor: pointer;
    }
  }

  .empty-state {
    text-align: center;
    padding: 48px;
    color: #999;
    font-style: italic;
    background: #f8f9fa;
    border-radius: 4px;
  }
}

/* Адаптивность */
@media (max-width: 768px) {
  .table-controls {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;

    button {
      width: 100%;
    }

    .select-all {
      justify-content: center;
    }
  }

  .indicators-table {
    padding: 8px;
  }
}
</style>