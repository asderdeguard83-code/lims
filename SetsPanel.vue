<template>
  <div class="sets-panel">
    <div class="set-info">
      <div class="nav-buttons">
        <button @click="$emit('prev-set')" title="Предыдущий набор">‹</button>
        <button @click="$emit('next-set')" title="Следующий набор">›</button>
      </div>
      
      <div class="set-name-container">
        <span class="set-name">{{ currentSet?.name || 'Нет наборов' }}</span>
        <button 
          class="edit-button" 
          @click="startEditing"
          :disabled="!currentSet"
          title="Редактировать название набора"
        >
          ✏️
        </button>
      </div>

      <!-- Поле редактирования названия -->
      <div v-if="isEditing" class="edit-name-container">
        <input
          ref="nameInput"
          v-model="editedName"
          type="text"
          class="name-input"
          @keyup.enter="saveName"
          @keyup.esc="cancelEditing"
          @blur="saveName"
        />
        <button class="save-button" @click="saveName" title="Сохранить">✓</button>
        <button class="cancel-button" @click="cancelEditing" title="Отменить">✕</button>
      </div>
    </div>
    
    <div class="set-controls">
      <button @click="$emit('open-settings')" title="Настройки характеристик">
        <span class="button-icon">⚙️</span>
        <span class="button-text">Настройки</span>
      </button>
      <button @click="handleAddSet" title="Добавить набор">
        <span class="button-icon">+</span>
        <span class="button-text">Добавить</span>
      </button>
      <button 
        @click="handleDeleteSet" 
        :disabled="!currentSet"
        title="Удалить набор"
      >
        <span class="button-icon">−</span>
        <span class="button-text">Удалить</span>
      </button>
      <button @click="debugStore" title="Отладка" class="debug-button">
        <span class="button-icon">🐛</span>
        <span class="button-text">Отладка</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { useSetsStore } from '@/stores/setsStore'
import { storeToRefs } from 'pinia'

const setsStore = useSetsStore()
const { currentSet } = storeToRefs(setsStore)

const isEditing = ref(false)
const editedName = ref('')
const nameInput = ref<HTMLInputElement | null>(null)

const emit = defineEmits<{
  'prev-set': []
  'next-set': [] 
  'add-set': []
  'delete-set': []
  'open-settings': []
  'update-set-name': [setId: string, newName: string]
}>()

function startEditing() {
  if (!currentSet.value) {
    console.log('❌ SetsPanel: Нет текущего набора для редактирования')
    return
  }
  
  isEditing.value = true
  editedName.value = currentSet.value.name
  console.log('✏️ SetsPanel: Начало редактирования названия:', currentSet.value.name)
  
  nextTick(() => {
    if (nameInput.value) {
      nameInput.value.focus()
      nameInput.value.select()
    }
  })
}

function saveName() {
  if (!currentSet.value) {
    console.log('❌ SetsPanel: Нет текущего набора для сохранения')
    cancelEditing()
    return
  }

  if (!editedName.value.trim()) {
    console.log('❌ SetsPanel: Пустое название, отмена редактирования')
    cancelEditing()
    return
  }

  const newName = editedName.value.trim()
  console.log('💾 SetsPanel: Сохранение названия:', currentSet.value.name, '->', newName)
  
  if (newName !== currentSet.value.name) {
    emit('update-set-name', currentSet.value.id, newName)
    console.log('✅ SetsPanel: Событие update-set-name отправлено')
  } else {
    console.log('ℹ️ SetsPanel: Название не изменилось')
  }
  
  isEditing.value = false
  editedName.value = ''
}

function cancelEditing() {
  console.log('❌ SetsPanel: Отмена редактирования')
  isEditing.value = false
  editedName.value = ''
}

function handleAddSet() {
  console.log('➕ SetsPanel: Запрос на добавление набора')
  emit('add-set')
  console.log('✅ SetsPanel: Событие add-set отправлено')
}

function handleDeleteSet() {
  if (currentSet.value) {
    console.log('🗑️ SetsPanel: Запрос на удаление набора', currentSet.value.id, currentSet.value.name)
    emit('delete-set')
    console.log('✅ SetsPanel: Событие delete-set отправлено')
  } else {
    console.log('❌ SetsPanel: Нет текущего набора для удаления')
  }
}

function debugStore() {
  console.log('🐛 SetsPanel: Запрос отладки хранилища')
  setsStore.debugState()
}
</script>

<style scoped>
.sets-panel {
  padding: 16px 24px;
  border-bottom: 2px solid #e0e0e0;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.set-info {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.nav-buttons {
  display: flex;
  gap: 4px;

  button {
    padding: 8px 12px;
    border: 1px solid #bdc3c7;
    background: white;
    border-radius: 6px;
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;
    transition: all 0.3s ease;
    min-width: 40px;

    &:hover {
      background: #3498db;
      color: white;
      border-color: #3498db;
    }

    &:active {
      transform: scale(0.95);
    }
  }
}

.set-name-container {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 40px;
}

.set-name {
  font-size: 20px;
  font-weight: 600;
  color: #2c3e50;
  padding: 8px 16px;
  background: white;
  border-radius: 6px;
  border: 2px solid transparent;
  min-width: 120px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.edit-button {
  padding: 6px 8px;
  border: 1px solid #bdc3c7;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background: #3498db;
    border-color: #3498db;
    transform: scale(1.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.edit-name-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.name-input {
  padding: 8px 12px;
  border: 2px solid #3498db;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  min-width: 150px;
  background: white;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
  }
}

.save-button, .cancel-button {
  padding: 6px 10px;
  border: 1px solid #bdc3c7;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition: all 0.3s ease;
}

.save-button {
  color: #27ae60;
  border-color: #27ae60;

  &:hover {
    background: #27ae60;
    color: white;
  }
}

.cancel-button {
  color: #e74c3c;
  border-color: #e74c3c;

  &:hover {
    background: #e74c3c;
    color: white;
  }
}

.set-controls {
  display: flex;
  gap: 12px;
  align-items: center;

  button {
    padding: 10px 16px;
    border: 1px solid #ddd;
    background: white;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    min-width: 80px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);

    &:hover:not(:disabled) {
      background: #f8f9fa;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    }

    &:active:not(:disabled) {
      transform: translateY(0);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
    }

    &:first-child {
      border-color: #3498db;
      color: #3498db;

      &:hover:not(:disabled) {
        background: #3498db;
        color: white;
      }
    }

    &:nth-child(2) {
      border-color: #27ae60;
      color: #27ae60;

      &:hover:not(:disabled) {
        background: #27ae60;
        color: white;
      }
    }

    &:nth-child(3) {
      border-color: #e74c3c;
      color: #e74c3c;

      &:hover:not(:disabled) {
        background: #e74c3c;
        color: white;
      }
    }

    &.debug-button {
      border-color: #9b59b6;
      color: #9b59b6;

      &:hover:not(:disabled) {
        background: #9b59b6;
        color: white;
      }
    }

    .button-icon {
      font-size: 16px;
      line-height: 1;
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
  .sets-panel {
    flex-direction: column;
    gap: 16px;
    padding: 12px 16px;
  }

  .set-info {
    width: 100%;
    justify-content: center;
  }

  .set-controls {
    width: 100%;
    justify-content: center;

    button {
      min-width: 70px;
      padding: 8px 12px;
    }
  }
}
</style>