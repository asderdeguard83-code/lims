<template>
  <div class="products-panel">
    <h3>ПРОДУКТЫ</h3>
    
    <div class="control-panel">
      <button @click="$emit('add-product')" title="Добавить продукт">
        <span class="button-icon">+</span>
        <span class="button-text">Добавить</span>
      </button>
      <button @click="handleDelete" :disabled="!currentProduct" title="Удалить продукт">
        <span class="button-icon">−</span>
        <span class="button-text">Удалить</span>
      </button>
      <button @click="$emit('save')" title="Сохранить">
        <span class="button-icon">💾</span>
        <span class="button-text">Сохранить</span>
      </button>
      <button @click="$emit('load')" title="Загрузить">
        <span class="button-icon">📁</span>
        <span class="button-text">Загрузить</span>
      </button>
    </div>
    
    <div class="search-box">
      <input 
        v-model="searchQuery" 
        placeholder="Поиск продуктов..."
        type="text"
        @input="handleSearch"
      >
    </div>
    
    <div class="filter-group">
      <select v-model="selectedGroup" @change="handleGroupChange">
        <option value="all">Все продукты</option>
        <option 
          v-for="group in productGroups" 
          :key="group.id"
          :value="group.id"
        >
          {{ group.name }}
        </option>
      </select>
    </div>
    
    <div class="products-list">
      <div 
        v-for="product in filteredProducts" 
        :key="product.id"
        :class="['product-item', { active: product.id === currentProduct?.id }]"
        @click="handleSelectProduct(product)"
      >
        <div class="product-name">{{ product.name }}</div>
        <div class="product-standard">{{ product.standard }}</div>
        <div class="product-indicators">
          Показателей: {{ getProductIndicatorsCount(product) }}
        </div>
      </div>
      
      <div v-if="filteredProducts.length === 0" class="empty-state">
        Нет продуктов. Добавьте продукт для отображения
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useProductsStore } from '@/stores/productsStore'
import type { Product } from '@/types/technicalRequirements'

const productsStore = useProductsStore()

const searchQuery = ref('')
const selectedGroup = ref('all')

const productGroups = computed(() => productsStore.productGroups)
const filteredProducts = computed(() => productsStore.filteredProducts)
const currentProduct = computed(() => productsStore.currentProduct)

const emit = defineEmits<{
  'add-product': []
  'delete-product': [product: Product]
  'select-product': [product: Product]
  'save': []
  'load': []
}>()

function handleSearch() {
  productsStore.setSearchQuery(searchQuery.value)
}

function handleGroupChange() {
  productsStore.setSelectedGroup(selectedGroup.value as any)
}

function handleSelectProduct(product: Product) {
  console.log('ProductsPanel: Выбор продукта', product.id, product.name)
  productsStore.setCurrentProduct(product)
  emit('select-product', product)
}

function handleDelete() {
  if (currentProduct.value) {
    console.log('ProductsPanel: Запрос на удаление', currentProduct.value.id, currentProduct.value.name)
    emit('delete-product', currentProduct.value)
  } else {
    console.log('ProductsPanel: Нет выбранного продукта для удаления')
  }
}

function getProductIndicatorsCount(product: Product): number {
  return product.characteristics.reduce((total, char) => total + char.indicators.length, 0)
}

// Автоматически выбираем первый продукт при загрузке
watch(filteredProducts, (newProducts) => {
  if (newProducts.length > 0 && !currentProduct.value) {
    console.log('ProductsPanel: Автовыбор первого продукта')
    productsStore.setCurrentProduct(newProducts[0])
  }
}, { immediate: true })
</script>

<style scoped>
.control-panel {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;

  button {
    padding: 10px 8px;
    border: 1px solid #ddd;
    background: white;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
    flex: 1;
    min-width: 70px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    color: #2c3e50;

    &:hover:not(:disabled) {
      background: #f8f9fa;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    }

    &:first-child {
      border-color: #27ae60;
      color: #27ae60;
    }

    &:nth-child(2) {
      border-color: #e74c3c;
      color: #e74c3c;
    }

    &:nth-child(3) {
      border-color: #3498db;
      color: #3498db;
    }

    &:last-child {
      border-color: #f39c12;
      color: #f39c12;
    }

    .button-icon {
      font-size: 18px;
      line-height: 1;
      font-weight: bold;
    }

    .button-text {
      font-size: 11px;
      line-height: 1;
      font-weight: 500;
    }
  }
}

/* Адаптивность */
@media (max-width: 768px) {
  .products-panel {
    width: 100%;
    min-width: auto;
    border-right: none;
    border-bottom: 1px solid #e0e0e0;

    .control-panel {
      button {
        min-width: 60px;
        padding: 8px 6px;
        
        .button-text {
          font-size: 10px;
        }
      }
    }
  }
}
</style>