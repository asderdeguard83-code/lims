<template>
  <BaseModal :title="data?.title || 'Подтверждение'" @close="$emit('cancel')">
    <p>{{ data?.message }}</p>
    
    <template #footer>
      <button class="cancel-button" @click="$emit('cancel')">Отмена</button>
      <button class="confirm-button" @click="handleConfirm">
        {{ data?.confirmText || 'Подтвердить' }}
      </button>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseModal from './BaseModal.vue'
import type { ConfirmationModalData } from '@/types/technicalRequirements'

// Исправлено: используем defineProps вместо props
const props = defineProps<{
  data: ConfirmationModalData | null
}>()

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

function handleConfirm() {
  console.log('ConfirmationModal: Подтверждение удаления')
  if (props.data?.confirmAction) {
    console.log('ConfirmationModal: Вызов confirmAction')
    props.data.confirmAction()
  }
  emit('confirm')
}
</script>

<style scoped>
/* Стили остаются без изменений */
</style>