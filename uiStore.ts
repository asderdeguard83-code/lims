import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ConfirmationModalData } from '@/types/technicalRequirements'

export const useUIStore = defineStore('ui', () => {
  const showAddProductModal = ref(false)
  const showSettingsModal = ref(false)
  const showAddIndicatorsModal = ref(false)
  const showConfirmationModal = ref(false)
  const confirmationModalData = ref<ConfirmationModalData | null>(null)

  function openAddProductModal() {
    showAddProductModal.value = true
  }

  function openSettingsModal() {
    showSettingsModal.value = true
  }

  function openAddIndicatorsModal() {
    showAddIndicatorsModal.value = true
  }

  function openConfirmationModal(data: ConfirmationModalData) {
    confirmationModalData.value = data
    showConfirmationModal.value = true
  }

  function closeAllModals() {
    showAddProductModal.value = false
    showSettingsModal.value = false
    showAddIndicatorsModal.value = false
    showConfirmationModal.value = false
    confirmationModalData.value = null
  }

  return {
    showAddProductModal,
    showSettingsModal,
    showAddIndicatorsModal,
    showConfirmationModal,
    confirmationModalData,
    openAddProductModal,
    openSettingsModal,
    openAddIndicatorsModal,
    openConfirmationModal,
    closeAllModals
  }
})