<script setup lang="ts">
defineProps<{
  nameRequest: {
    names: string[]
    nrNum: string
  }
}>()
</script>
<template>
  <ModalBase
    :title="$t('form.manageNR.heading')"
  >
    <!-- nr info section -->
    <div class="-mt-4 flex flex-col gap-2">
      <!-- nr names display -->
      <div class="flex gap-8">
        <span class="font-semibold">{{ $t('form.manageNR.requestedNames', nameRequest.names.length) }}</span>
        <ul>
          <li v-for="name in nameRequest.names" :key="name">
            {{ name }}
          </li>
        </ul>
      </div>
      <!-- nr number display -->
      <div class="flex gap-8">
        <span class="font-semibold">{{ $t('form.manageNR.nrNum') }}</span>
        <span>{{ nameRequest.nrNum }}</span>
      </div>
    </div>
    <FormAddNameRequest :nr-num="nameRequest.nrNum" />
  </ModalBase>
</template>
