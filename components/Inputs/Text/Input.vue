<template>
  <label :for="id">
    <input
      ref="input"
      @keyup.enter="$emit('enter')"
      type="text"
      v-model.trim="value"
      :id="id"
      :name="id"
      :placeholder="placeholder"
      :class="{ 'text-xs': size === 'very small', 'text-sm': size === 'small', 'text-base': size === 'medium' }"
      class="bg-white p-2 w-full text-slate-950 leading-none rounded-lg appearance-none border-0 focus:outline-0 placeholder:text-slate-950/65"
    />
  </label>
</template>

<script setup lang="ts">
const props = defineProps<{
  size: Size;
  input: string;
  placeholder: string;
  id: string;
}>();

const emits = defineEmits<{
  (e: "updateInput", input: string): void;
  (e: "enter"): void;
}>();

// Computes a copy of the 'input' prop which is bound to the Text Input using v-model,
// The Computed value has a Getter to get the value of the 'input' prop, and a Setter which emits the 'updateInput' function
// to update the value of 'input' whenever v-model locally updates 'value'.
// This is a seperate variable instead of binding the 'input' prop directly because props should be read only so shouldn't be used.
// https://vuejs.org/guide/components/events.html#usage-with-v-model (Scroll down a little bit)
const value = computed({
  get() {
    return props.input;
  },
  set(value) {
    emits("updateInput", value);
  },
});

// Template ref for the Text Input field.
const input = ref<HTMLInputElement | null>(null);

// Focuses on the Text Input.
const focusText = () => {
  input.value?.focus();
};

// Unfocuses off of the Text Input.
const unfocusText = () => {
  input.value?.blur();
};

// Exposes the 'focusText' and 'unfocusText' functions to be able to be accessed via Template Refs on instances of this Component being used by any Parent Components.
// We're doing this to allow Parent Components using instances of this Component to focus on unfocus the Text Input.
defineExpose({
  focusText,
  unfocusText,
});
</script>
