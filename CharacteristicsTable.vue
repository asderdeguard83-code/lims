<template>
  <div class="characteristics-table">
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>ХАРАКТЕРИСТИКА</th>
            <th>КРИТЕРИЙ</th>
            <th>ПОРЯДОК</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="characteristic in characteristics" 
            :key="characteristic.id"
            :class="{ disabled: characteristic.disabled }"
            @click="$emit('select-characteristic', characteristic)"
          >
            <td>{{ characteristic.name }}</td>
            <td>{{ characteristic.criteria }}</td>
            <td>
              <button @click="moveUp(characteristic)">↑</button>
              <button @click="moveDown(characteristic)">↓</button>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div v-if="characteristics.length === 0" class="empty-state">
        Нет характеристик. Добавьте характеристики через настройки
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Characteristic } from '@/types/technicalRequirements'

defineProps<{
  characteristics: Characteristic[]
}>()

defineEmits<{
  'select-characteristic': [characteristic: Characteristic]
}>()

function moveUp(characteristic: Characteristic) {
  // Логика перемещения вверх
}

function moveDown(characteristic: Characteristic) {
  // Логика перемещения вниз
}
</script>

<style scoped>
.disabled {
  opacity: 0.5;
  background-color: #f5f5f5;
}
</style>