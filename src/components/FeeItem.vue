<template>
  <div class="flex items-start justify-between gap-4">
    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-2 mb-1">
        <h3 class="text-sm font-medium text-gray-900">{{ fee.description }}</h3>
        <span 
          class="text-xs px-2 py-0.5 rounded-full shrink-0"
          :class="getStatusClass(fee.status)"
        >
          {{ fee.status }}
        </span>
      </div>
      <p class="text-xs text-gray-500">{{ fee.category }} • {{ fee.fullSemester }}</p>
      <div class="flex items-center gap-4 mt-2">
        <p class="text-lg font-semibold text-gray-900">₱{{ fee.amount.toLocaleString() }}</p>
        <p v-if="fee.balance > 0 && fee.balance < fee.amount" class="text-sm font-medium text-amber-600">
          Balance: ₱{{ fee.balance.toLocaleString() }}
        </p>
        <p class="text-xs text-gray-500">Due {{ fee.formattedDueDate }}</p>
      </div>
    </div>
    <button 
      v-if="fee.status === 'paid'" 
      class="text-sm text-gray-600 hover:text-gray-900 shrink-0"
      @click="$emit('view', fee)"
    >
      View
    </button>
    <button 
      v-else-if="fee.status === 'pending'" 
      class="text-sm text-gray-400 cursor-not-allowed shrink-0"
      disabled
    >
      Pending
    </button>
    <button 
      v-else 
      class="text-sm text-ic-primary hover:text-ic-primary/80 font-medium shrink-0"
      @click="$emit('pay', fee)"
    >
      Pay
    </button>
  </div>
</template>

<script setup>
defineProps({
  fee: {
    type: Object,
    required: true
  }
})

defineEmits(['view', 'pay'])

const getStatusClass = (status) => {
  const classes = {
    paid: 'bg-gray-100 text-gray-700',
    pending: 'bg-amber-50 text-amber-700',
    unpaid: 'bg-red-50 text-red-700'
  }
  return classes[status] || 'bg-gray-100 text-gray-700'
}
</script>
