<template>
  <div class="flex items-center gap-x-2">
    <!-- LEFT TEXT -->
    <AnswersText v-if="answer.text.left" :size="size" :text="answer.text.left" />
    <!-- COUNTER -->
    <div class="flex items-center w-max h-6 rounded-md overflow-hidden shadow">
      <!-- DEINCRIMENT BUTTON -->
      <button
        @click="!isAboveMax ? $emit('updateCounter', counter - 1) : null"
        type="button"
        :disabled="isMin"
        class="flex items-center justify-center bg-slate-900 w-6 h-full"
      >
        <IconCustom
          type="minus"
          size="small"
          color="white"
          :class="[isMin ? 'opacity-50' : 'opacity-100']"
          class="transition-color duration-300"
        />
      </button>
      <!-- COUNTER VALUE -->
      <label :for="answer.id" class="h-full">
        <input
          @input="updateInput"
          @blur="checkMinMax"
          @keydown.enter="checkMinMax"
          type="number"
          :id="answer.id"
          :name="answer.id"
          :min="answer.min"
          :max="answer.max"
          v-model="counter"
          class="bg-white text-slate-950 text-center w-max h-full leading-none appearance-none focus:outline-none"
        />
      </label>
      <!-- INCRIMENT BUTTON -->
      <button
        @click="!isBelowMin ? $emit('updateCounter', counter + 1) : null"
        type="button"
        :disabled="isMax"
        class="flex items-center justify-center bg-slate-900 w-6 h-full"
      >
        <IconCustom
          type="plus"
          size="small"
          color="white"
          :class="[isMax ? 'opacity-50' : 'opacity-100']"
          class="transition-color duration-300"
        />
      </button>
    </div>
    <!-- RIGHT TEXT -->
    <AnswersText v-if="answer.text.right" :size="size" :text="answer.text.right" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  size: Size;
  answer: Counter;
}>();

const emits = defineEmits<{
  (e: "updateCounter", value: number): void;
}>();

// A copy of the 'selected' prop which is bound to the Number Input using v-model
// This is a seperate variable to avoid directly modifying the 'selected' prop since it's a nested property of the 'answer' Object prop
// So modifying it would unintentionally modify the parent Object as well without emitting anything
// https://vuejs.org/guide/components/props.html#one-way-data-flow
const counter = ref(props.answer.selected);

// Whenever the value of 'selected' changes, update the value of 'counter'
// This will keep the values of 'selected' and 'counter' the same
// Expect for situations when the value of 'counter' is outside the min or max values and the 'checkMinMax' function corrects the 'selected' value to either the min or max value
// But the value of 'selected' is already either the min or max value, so it doesn't change, therefore not triggering the Watcher
// In those cases, the 'checkMinMax' function updates the value of 'counter' directly
watch(
  () => props.answer.selected,
  () => {
    // Update the value of 'counter' to equal the value of 'selected'
    counter.value = props.answer.selected;
  }
);

// Computes if the current counter value is at its maximum value
const isMax = computed(() => counter.value >= props.answer.max);
// Computes if the current counter value is above its maximum value
const isAboveMax = computed(() => counter.value > props.answer.max);

// Computes if the current counter value is at its minimum value
const isMin = computed(() => counter.value <= props.answer.min);
// Computes if the current counter value is below its minimum value
const isBelowMin = computed(() => counter.value < props.answer.min);

// Updates the value of the counter
const updateInput = () => {
  // If the value of the counter isn't blank and is inbetween the minimum and maximum values
  if (counter.value && counter.value >= props.answer.min && counter.value <= props.answer.max) {
    // Emit the 'updateCounter' function to update the value of the counter to the current value
    emits("updateCounter", counter.value);
  }
};

// Checks if the value of 'selected' is above the maximum value or below and minimum value, and adjusts the selected value if so
const checkMinMax = () => {
  // Sets a Timeout of 100ms
  // This is because if the Incriment or Deincriment buttons are clicked, the counter is unfocused which will call this function
  // We need the Timeout so that this function executes after the Incriment/Deincriment functions, and for some reason NextTick doesn't work in this case
  setTimeout(() => {
    // If the value of the counter isn't blank
    if (counter.value) {
      // If the value of the counter is below the minimum value
      if (isBelowMin.value) {
        // Emit the 'updateCounter' function to update the value of the counter to the minimum value
        emits("updateCounter", props.answer.min);

        // If the value of 'counter' is different than the min value which was just used to update the value of 'selected'
        if (counter.value != props.answer.min) {
          // Update the value of 'counter' to equal the min value
          counter.value = props.answer.min;
        }
      }
      // If the value of the counter is above the maximum value
      else if (isAboveMax.value) {
        // Emit the 'updateCounter' function to update the value of the counter to the maximum value
        emits("updateCounter", props.answer.max);

        // If the value of 'counter' is different than the max value which was just used to update the value of 'selected'
        if (counter.value != props.answer.max) {
          // Update the value of 'counter' to equal the max value
          counter.value = props.answer.max;
        }
      }
    }
    // If the value of the counter is blank
    else {
      // Emit the 'updateCounter' function to update the value of the counter to the minimum value
      emits("updateCounter", props.answer.min);

      // If the value of 'counter' is different than the min value which was just used to update the value of 'selected'
      if (counter.value != props.answer.min) {
        // Update the value of 'counter' to equal the min value
        counter.value = props.answer.min;
      }
    }
  }, 100);
};
</script>

<style scoped>
/* Removes the default number Input Incriment and Deincriment arrows for Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  @apply appearance-none;
}

/* Removes the default number Input Incriment and Deincriment arrows for Firefox */
input[type="number"] {
  appearance: textfield;
}
</style>
