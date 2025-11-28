<template>
  <BaseModal title="Добавить показатели" @close="$emit('cancel')">
    <div class="add-indicators-content">
      <div class="search-box">
        <input 
          v-model="searchQuery" 
          placeholder="Поиск показателей..."
          type="text"
        >
      </div>
      
      <label class="select-all">
        <input 
          type="checkbox" 
          v-model="selectAll"
          @change="toggleSelectAll"
        >
        Все показатели
      </label>
      
      <div class="indicators-list">
        <div 
          v-for="indicator in filteredIndicators" 
          :key="indicator.id"
          class="indicator-item"
        >
          <label>
            <input 
              type="checkbox" 
              v-model="selectedIndicators"
              :value="indicator.id"
            >
            <span class="indicator-name">{{ indicator.name }}</span>
            <span class="indicator-unit">{{ indicator.unit }}</span>
          </label>
        </div>
      </div>
    </div>

    <template #footer>
      <button class="cancel-button" @click="$emit('cancel')">Отмена</button>
      <button 
        class="confirm-button" 
        @click="addSelected"
        :disabled="selectedIndicators.length === 0"
      >
        Добавить выбранные ({{ selectedIndicators.length }})
      </button>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import BaseModal from '@/components/ui/BaseModal.vue'

const searchQuery = ref('')
const selectAll = ref(false)
const selectedIndicators = ref<string[]>([])

const availableIndicators = [
  { id: '1', name: 'Проход через сито 45,0 мм', unit: '%' },
  { id: '2', name: 'Прочность на сжатие', unit: 'МПа' },
  { id: '3', name: 'Водонепроницаемость', unit: 'W' },
  { id: '4', name: 'Морозостойкость', unit: 'F' },
  { id: '5', name: 'Истираемость', unit: 'г/см²' }
]

const filteredIndicators = computed(() => {
  if (!searchQuery.value) {
    return availableIndicators
  }
  
  return availableIndicators.filter(indicator =>
    indicator.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedIndicators.value = filteredIndicators.value.map(i => i.id)
  } else {
    selectedIndicators.value = []
  }
}

const emit = defineEmits<{
  add: [indicatorIds: string[]]
  cancel: []
}>()

function addSelected() {
  if (selectedIndicators.value.length > 0) {
    emit('add', selectedIndicators.value)
  }
}
</script>

<style scoped>
.add-indicators-content {
  .search-box {
    margin-bottom: 16px;

    input {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
  }

  .select-all {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
    font-weight: 500;
  }

  .indicators-list {
    max-height: 400px;
    overflow-y: auto;
    border: 1px solid #e0e0e0;
    border-radius: 4px;

    .indicator-item {
      padding: 12px;
      border-bottom: 1px solid #f0f0f0;

      &:last-child {
        border-bottom: none;
      }

      label {
        display: flex;
        align-items: center;
        gap: 12px;
        cursor: pointer;
        width: 100%;
      }

      .indicator-name {
        flex: 1;
      }

      .indicator-unit {
        color: #666;
        font-size: 12px;
        min-width: 40px;
        text-align: right;
      }
    }
  }
}
</style>