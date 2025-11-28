<template>
  <BaseModal title="Добавить продукт" @close="$emit('cancel')">
    <form @submit.prevent="handleSubmit" class="add-product-form">
      <!-- Название продукта -->
      <div class="form-group">
        <label class="form-label">
          Название продукта *
          <span class="required-star">*</span>
        </label>
        <div class="input-with-dropdown">
          <input
            v-model="productName"
            type="text"
            placeholder="Выберите или введите название"
            required
            @focus="showNameSuggestions = true"
            @blur="onNameInputBlur"
            @input="filterNameSuggestions"
          >
          <div v-if="showNameSuggestions && filteredNameSuggestions.length > 0" class="suggestions-dropdown">
            <div
              v-for="suggestion in filteredNameSuggestions"
              :key="suggestion"
              class="suggestion-item"
              @mousedown="selectNameSuggestion(suggestion)"
            >
              {{ suggestion }}
            </div>
          </div>
        </div>
      </div>

      <!-- Нормативный документ -->
      <div class="form-group">
        <label class="form-label">
          Нормативный документ *
          <span class="required-star">*</span>
        </label>
        <div class="input-with-dropdown">
          <input
            v-model="productStandard"
            type="text"
            placeholder="Выберите или введите ГОСТ"
            required
            @focus="showStandardSuggestions = true"
            @blur="onStandardInputBlur"
            @input="filterStandardSuggestions"
          >
          <div v-if="showStandardSuggestions && filteredStandardSuggestions.length > 0" class="suggestions-dropdown">
            <div
              v-for="suggestion in filteredStandardSuggestions"
              :key="suggestion"
              class="suggestion-item"
              @mousedown="selectStandardSuggestion(suggestion)"
            >
              {{ suggestion }}
            </div>
          </div>
        </div>
      </div>

      <!-- Группа продуктов -->
      <div class="form-group">
        <label class="form-label">Группа продуктов</label>
        <select v-model="productGroup" class="form-select">
          <option value="">Выберите группу</option>
          <option
            v-for="group in productGroups"
            :key="group.id"
            :value="group.id"
          >
            {{ group.name }}
          </option>
        </select>
      </div>
    </form>

    <template #footer>
      <button type="button" class="cancel-button" @click="$emit('cancel')">
        Отмена
      </button>
      <button 
        type="button" 
        class="confirm-button" 
        @click="handleSubmit"
        :disabled="!isFormValid"
      >
        Создать
      </button>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import type { ProductGroup } from '@/types/technicalRequirements'

const productName = ref('')
const productStandard = ref('')
const productGroup = ref<ProductGroup | ''>('')
const showNameSuggestions = ref(false)
const showStandardSuggestions = ref(false)

const nameSuggestions = [
  'Бетон тяжелый',
  'Бетон легкий',
  'Асфальтобетон',
  'Цемент М500',
  'Песок строительный',
  'Щебень гранитный',
  'Битум нефтяной',
  'Керамзит',
  'Керамический кирпич',
  'Раствор кладочный',
  'Грунтовка строительная полимерная',
  'Шпатлевка финишная',
  'Гипсокартон',
  'Металлопрокат',
  'Лакокрасочные материалы'
]

const standardSuggestions = [
  'ГОСТ 7473-2010',
  'ГОСТ 9128-2013',
  'ГОСТ 33029-2014',
  'ГОСТ 8267-93',
  'ГОСТ 31108-2003',
  'ГОСТ 26633-2015',
  'ГОСТ 10180-2012',
  'ГОСТ 5781-82',
  'ГОСТ 380-2005',
  'ГОСТ 530-2012',
  'ГОСТ 28013-98',
  'ГОСТ 31357-2007',
  'ГОСТ 8736-2014',
  'ГОСТ 22245-90',
  'ГОСТ 10268-80'
]

const productGroups = [
  { id: 'road-materials', name: 'Дорожные материалы' },
  { id: 'construction-materials', name: 'Строительные материалы' },
  { id: 'binding-materials', name: 'Вяжущие материалы' },
  { id: 'fillers', name: 'Наполнители' },
  { id: 'finishing-materials', name: 'Отделочные материалы' },
  { id: 'metal-products', name: 'Металлоизделия' }
]

const filteredNameSuggestions = ref(nameSuggestions)
const filteredStandardSuggestions = ref(standardSuggestions)

const isFormValid = computed(() => {
  return productName.value.trim() !== '' && productStandard.value.trim() !== ''
})

const emit = defineEmits<{
  create: [productData: any]
  cancel: []
}>()

function filterNameSuggestions() {
  const query = productName.value.toLowerCase()
  filteredNameSuggestions.value = nameSuggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(query)
  )
}

function filterStandardSuggestions() {
  const query = productStandard.value.toLowerCase()
  filteredStandardSuggestions.value = standardSuggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(query)
  )
}

function selectNameSuggestion(suggestion: string) {
  productName.value = suggestion
  showNameSuggestions.value = false
}

function selectStandardSuggestion(suggestion: string) {
  productStandard.value = suggestion
  showStandardSuggestions.value = false
}

function onNameInputBlur() {
  // Небольшая задержка чтобы клик по suggestion успел обработаться
  setTimeout(() => {
    showNameSuggestions.value = false
  }, 200)
}

function onStandardInputBlur() {
  setTimeout(() => {
    showStandardSuggestions.value = false
  }, 200)
}

function handleSubmit() {
  if (!isFormValid.value) return

  const productData = {
    name: productName.value.trim(),
    standard: productStandard.value.trim(),
    group: productGroup.value as ProductGroup,
    characteristics: []
  }
  
  console.log('Создание продукта:', productData)
  emit('create', productData)
  
  // Сброс формы
  productName.value = ''
  productStandard.value = ''
  productGroup.value = ''
  showNameSuggestions.value = false
  showStandardSuggestions.value = false
}
</script>

<style scoped>
.add-product-form {
  max-width: 500px;
}

.form-group {
  margin-bottom: 24px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #2c3e50;
  font-size: 14px;
}

.required-star {
  color: #e74c3c;
  margin-left: 4px;
}

.input-with-dropdown {
  position: relative;
  width: 100%;
}

input, .form-select {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
  background: white;
}

input:focus, .form-select:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

input::placeholder {
  color: #999;
}

.form-select {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 8L2 4h8z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
  background-size: 12px;
}

.suggestions-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 2px solid #3498db;
  border-top: none;
  border-radius: 0 0 8px 8px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.suggestion-item {
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s ease;
  font-size: 14px;
}

.suggestion-item:hover {
  background: #f8f9fa;
}

.suggestion-item:last-child {
  border-bottom: none;
}

.cancel-button {
  padding: 10px 20px;
  border: 2px solid #bdc3c7;
  background: white;
  color: #2c3e50;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.cancel-button:hover {
  background: #f8f9fa;
  border-color: #95a5a6;
}

.confirm-button {
  padding: 10px 20px;
  border: 2px solid #27ae60;
  background: #27ae60;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.confirm-button:hover:not(:disabled) {
  background: #219a52;
  border-color: #219a52;
}

.confirm-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: #bdc3c7;
  border-color: #bdc3c7;
}

/* Адаптивность */
@media (max-width: 768px) {
  .add-product-form {
    max-width: 100%;
  }
  
  input, .form-select {
    padding: 14px 16px;
    font-size: 16px; /* Улучшение для мобильных */
  }
}
</style>