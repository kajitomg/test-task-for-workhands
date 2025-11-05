<script
    setup
    lang='ts'
>
import { type Component } from 'vue';

interface Props {
  as?: string | Component
  type?: 'button' | 'submit' | 'reset'
}

const props = withDefaults(defineProps<Props>(), {
  as: 'button',
  type: 'button'
})
</script>

<template>
  <component
      :is='$props.as'
      v-bind="$attrs"
      :type="as === 'button' ? type : undefined"
      class='flex py-1 px-2 cursor-pointer items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none aria-disabled:opacity-50 aria-disabled:cursor-not-allowed aria-disabled:pointer-events-none'>
    <slot/>
  </component>
</template>

<style scoped>

</style>