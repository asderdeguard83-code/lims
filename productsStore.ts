import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Product, ProductGroup, Characteristic, Indicator } from '@/types/technicalRequirements'

export const useProductsStore = defineStore('products', () => {
  const products = ref<Product[]>([
    {
      id: '1',
      name: 'Бетон тяжелый',
      standard: 'ГОСТ 7473-2010',
      group: 'construction-materials',
      characteristics: [
        {
          id: '1',
          name: 'A32',
          criteria: 'Максимальная крупность зерен',
          order: 1,
          indicators: [
            {
              id: '1',
              name: 'Проход через сито 45,0 мм',
              standard: 'ГОСТ 7473-2010',
              unit: '%',
              comparison: 'range',
              value: '90-100',
              deviation: '5',
              note: 'нет',
              additionalRequirements: 'нет',
              order: 1
            }
          ]
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      name: 'Асфальтобетон',
      standard: 'ГОСТ 9128-2013',
      group: 'road-materials',
      characteristics: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ])
  
  const currentProduct = ref<Product | null>(null)
  const searchQuery = ref('')
  const selectedGroup = ref<ProductGroup | 'all'>('all')

  const productGroups = [
    { id: 'road-materials', name: 'Дорожные материалы' },
    { id: 'construction-materials', name: 'Строительные материалы' },
    { id: 'binding-materials', name: 'Вяжущие материалы' },
    { id: 'fillers', name: 'Наполнители' }
  ]

  const filteredProducts = computed(() => {
    let filtered = products.value
    
    if (selectedGroup.value !== 'all') {
      filtered = filtered.filter(product => 
        product.group === selectedGroup.value
      )
    }
    
    if (searchQuery.value) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    }
    
    return filtered
  })

  function addProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    products.value.push(newProduct)
    return newProduct
  }

  function deleteProduct(productId: string) {
  console.log('Удаление продукта ID:', productId)
  
  // Создаем новый массив для реактивности
  products.value = products.value.filter(product => {
    if (product.id === productId) {
      console.log('Найден продукт для удаления:', product.name)
      return false // Исключаем из массива
    }
    return true
  })
  
  // Обновляем текущий продукт
  if (currentProduct.value?.id === productId) {
    if (products.value.length > 0) {
      currentProduct.value = products.value[0]
      console.log('Автовыбор нового продукта:', currentProduct.value.name)
    } else {
      currentProduct.value = null
      console.log('Продуктов не осталось, текущий продукт сброшен')
    }
  }
  
  console.log('Продуктов после удаления:', products.value.length)
}

  function setCurrentProduct(product: Product | null) {
    currentProduct.value = product
  }

  function setSearchQuery(query: string) {
    searchQuery.value = query
  }

  function setSelectedGroup(group: ProductGroup | 'all') {
    selectedGroup.value = group
  }

  function addIndicatorsToProduct(productId: string, indicators: any[]) {
    const product = products.value.find(p => p.id === productId)
    if (product) {
      // Если у продукта нет характеристик, создаем базовую
      if (product.characteristics.length === 0) {
        product.characteristics.push({
          id: Date.now().toString(),
          name: 'Основные показатели',
          criteria: 'Общие',
          order: 1,
          indicators: []
        })
      }
      
      const newIndicators = indicators.map(indicatorData => ({
        ...indicatorData,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        order: product.characteristics[0].indicators.length + 1
      }))
      
      product.characteristics[0].indicators.push(...newIndicators)
    }
  }

  function deleteIndicators(productId: string, indicatorIds: string[]) {
    const product = products.value.find(p => p.id === productId)
    if (product) {
      product.characteristics.forEach(char => {
        const initialLength = char.indicators.length
        char.indicators = char.indicators.filter(ind => !indicatorIds.includes(ind.id))
        
        // Если удалили какие-то показатели, обновляем порядок оставшихся
        if (char.indicators.length !== initialLength) {
          char.indicators.forEach((ind, index) => {
            ind.order = index + 1
          })
        }
      })
    }
  }

  function updateIndicator(productId: string, updatedIndicator: Indicator) {
    const product = products.value.find(p => p.id === productId)
    if (product) {
      for (const char of product.characteristics) {
        const indicatorIndex = char.indicators.findIndex(ind => ind.id === updatedIndicator.id)
        if (indicatorIndex !== -1) {
          char.indicators[indicatorIndex] = { ...updatedIndicator }
          break
        }
      }
    }
  }

  return {
    products,
    currentProduct,
    searchQuery,
    selectedGroup,
    productGroups,
    filteredProducts,
    addProduct,
    deleteProduct,
    setCurrentProduct,
    setSearchQuery,
    setSelectedGroup,
    addIndicatorsToProduct,
    deleteIndicators,
    updateIndicator
  }
})