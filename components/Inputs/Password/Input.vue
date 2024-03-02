<template>
  <label :for="id">
    <input
      @keyup.enter="$emit('enter')"
      type="password"
      v-model.trim="value"
      :id="id"
      :name="id"
      :placeholder="placeholder"
      :autocomplete="autocompleteType"
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
  autocomplete: PasswordAutocomplete;
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

const autocompleteType = computed(() => {
  if (props.autocomplete === "new") {
    return "new-password";
  } else if (props.autocomplete === "current") {
    return "current-password";
  }
});
</script>
