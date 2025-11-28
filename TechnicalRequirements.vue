<template>
  <div class="technical-requirements">
    <div class="main-layout">
      <ProductsPanel 
        :products="productsStore.filteredProducts"
        :current-product="productsStore.currentProduct"
        @add-product="uiStore.openAddProductModal"
        @delete-product="confirmDeleteProduct"
        @select-product="selectProduct"
        @save="saveRequirements"
        @load="loadRequirements"
      />
      
      <div class="main-content">
        <SetsPanel 
		:current-set="setsStore.currentSet"
		@prev-set="setsStore.switchToPrevSet"
		@next-set="setsStore.switchToNextSet"
		@add-set="handleAddSet"
		@delete-set="handleDeleteSet"
		@open-settings="uiStore.openSettingsModal"
		@update-set-name="handleUpdateSetName"
		/>
        
        <CharacteristicsTable 
          :characteristics="currentCharacteristics"
          @select-characteristic="selectCharacteristic"
        />
        
        <IndicatorsTable 
          :indicators="currentIndicators"
          @add-indicators="uiStore.openAddIndicatorsModal"
          @delete-indicators="confirmDeleteIndicators"
          @update-indicator="updateIndicator"
        />
      </div>
    </div>
    
    <!-- Модальные окна -->
    <AddProductModal 
      v-if="uiStore.showAddProductModal"
      @create="createProduct"
      @cancel="uiStore.closeAllModals"
    />
    
    <SettingsModal 
      v-if="uiStore.showSettingsModal"
      @close="uiStore.closeAllModals"
    />
    
    <AddIndicatorsModal 
      v-if="uiStore.showAddIndicatorsModal"
      @add="addSelectedIndicators"
      @cancel="uiStore.closeAllModals"
    />
    
    <ConfirmationModal 
      v-if="uiStore.showConfirmationModal"
      :data="uiStore.confirmationModalData"
      @confirm="handleConfirmation"
      @cancel="uiStore.closeAllModals"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useProductsStore, useSetsStore, useUIStore } from '@/stores'
import ProductsPanel from '@/components/products/ProductsPanel.vue'
import AddProductModal from '@/components/products/AddProductModal.vue'
import SetsPanel from '@/components/requirements/SetsPanel.vue'
import CharacteristicsTable from '@/components/requirements/CharacteristicsTable.vue'
import IndicatorsTable from '@/components/requirements/IndicatorsTable.vue'
import SettingsModal from '@/components/requirements/SettingsModal.vue'
import AddIndicatorsModal from '@/components/requirements/AddIndicatorsModal.vue'
import ConfirmationModal from '@/components/ui/ConfirmationModal.vue'
import type { Product, Indicator } from '@/types/technicalRequirements'

const productsStore = useProductsStore()
const setsStore = useSetsStore()
const uiStore = useUIStore()

const currentCharacteristics = computed(() => 
  productsStore.currentProduct?.characteristics || []
)

const currentIndicators = computed(() => {
  if (!productsStore.currentProduct) return []
  return productsStore.currentProduct.characteristics.flatMap(ch => ch.indicators)
})

onMounted(() => {
  if (productsStore.filteredProducts.length > 0 && !productsStore.currentProduct) {
    productsStore.setCurrentProduct(productsStore.filteredProducts[0])
  }
})

// В секции script добавьте/обновите эти функции:

function handleUpdateSetName(setId: string, newName: string) {
  console.log('🔄 TechnicalRequirements: Обновление названия набора')
  setsStore.updateSetName(setId, newName)
  setsStore.debugState() // Для отладки
}

function handleAddSet() {
  console.log('➕ TechnicalRequirements: Добавление нового набора')
  const newSetName = `Набор${setsStore.sets.length + 1}`
  setsStore.addSet({
    name: newSetName,
    products: []
  })
  setsStore.debugState() // Для отладки
}

function handleDeleteSet() {
  if (!setsStore.currentSet) {
    console.log('❌ TechnicalRequirements: Нет текущего набора')
    return
  }
  
  console.log('🗑️ TechnicalRequirements: Подтверждение удаления набора')
  uiStore.openConfirmationModal({
    title: 'Подтверждение удаления',
    message: `Вы уверены, что хотите удалить набор: "${setsStore.currentSet.name}"? Это действие нельзя отменить.`,
    confirmText: 'Удалить',
    confirmAction: () => {
      console.log('✅ TechnicalRequirements: Удаление набора')
      setsStore.deleteSet(setsStore.currentSet!.id)
      setsStore.debugState() // Для отладки
    }
  })
}

// Существующие функции остаются без изменений
function selectProduct(product: Product) {
  productsStore.setCurrentProduct(product)
}

function selectCharacteristic(characteristic: any) {
  console.log('Selected characteristic:', characteristic)
}

function createProduct(productData: any) {
  const newProduct = productsStore.addProduct(productData)
  productsStore.setCurrentProduct(newProduct)
  uiStore.closeAllModals()
}

function confirmDeleteProduct(product: Product) {
  uiStore.openConfirmationModal({
    title: 'Подтверждение удаления',
    message: `Вы уверены, что хотите удалить продукт: "${product.name}"? Это действие нельзя отменить.`,
    confirmText: 'Удалить',
    confirmAction: () => {
      productsStore.deleteProduct(product.id)
    }
  })
}

function confirmDeleteIndicators(indicatorIds: string[]) {
  if (!productsStore.currentProduct) return
  
  uiStore.openConfirmationModal({
    title: 'Подтверждение удаления',
    message: `Вы уверены, что хотите удалить ${indicatorIds.length} показателей? Это действие нельзя отменить.`,
    confirmText: `Удалить (${indicatorIds.length})`,
    confirmAction: () => {
      productsStore.deleteIndicators(productsStore.currentProduct!.id, indicatorIds)
    }
  })
}

function addSelectedIndicators(indicatorIds: string[]) {
  if (!productsStore.currentProduct) return
  
  const indicatorsToAdd = [
    {
      id: '1',
      name: 'Проход через сито 45,0 мм',
      standard: 'ГОСТ 7473-2010',
      unit: '%',
      comparison: 'range',
      value: '',
      deviation: '',
      note: '',
      additionalRequirements: ''
    },
    {
      id: '2', 
      name: 'Прочность на сжатие',
      standard: 'ГОСТ 7473-2010',
      unit: 'МПа',
      comparison: 'greater',
      value: '',
      deviation: '',
      note: '',
      additionalRequirements: ''
    }
  ].filter(ind => indicatorIds.includes(ind.id))
  
  productsStore.addIndicatorsToProduct(productsStore.currentProduct.id, indicatorsToAdd)
  uiStore.closeAllModals()
}

function updateIndicator(indicator: Indicator) {
  if (!productsStore.currentProduct) return
  productsStore.updateIndicator(productsStore.currentProduct.id, indicator)
}

function saveRequirements() {
  console.log('Сохранение требований:', {
    products: productsStore.products,
    sets: setsStore.sets
  })
  alert('Требования сохранены!')
}

function loadRequirements() {
  console.log('Загрузка требований...')
  alert('Функция загрузки в разработке')
}

function handleConfirmation() {
  if (uiStore.confirmationModalData?.confirmAction) {
    uiStore.confirmationModalData.confirmAction()
  }
  uiStore.closeAllModals()
}
</script>