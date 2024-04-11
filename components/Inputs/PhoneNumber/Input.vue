<template>
  <div class="flex items-center gap-x-2">
    <div class="flex items-center gap-x-1">
      <!-- OPENING PARENTHESIS -->
      <AnswersText size="large" text="(" />
      <!-- AREA CODE -->
      <label :for="areaCodeId" class="rounded-md overflow-hidden">
        <input
          ref="areaCode"
          @input="updateInput"
          @blur="updateInput"
          @keydown.enter="updateInput"
          type="number"
          :id="areaCodeId"
          :name="answer.id"
          :min="100"
          :max="999"
          v-model="selectedCopy.areaCode"
          class="bg-white text-slate-950 text-center w-max h-6 leading-none appearance-none focus:outline-none"
        />
      </label>
      <!-- CLOSING PARENTHESIS -->
      <AnswersText size="large" text=")" />
    </div>
    <!-- DASH 1 -->
    <AnswersText size="large" text="-" />
    <!-- PREFIX -->
    <label :for="prefixId" class="rounded-md overflow-hidden">
      <input
        ref="prefix"
        @input="updateInput"
        @blur="updateInput"
        @keydown.enter="updateInput"
        type="number"
        :id="prefixId"
        :name="answer.id"
        :min="100"
        :max="999"
        v-model="selectedCopy.prefix"
        class="bg-white text-slate-950 text-center w-max h-6 leading-none appearance-none focus:outline-none"
      />
    </label>
    <!-- DASH 2 -->
    <AnswersText size="large" text="-" />
    <!-- LINE NUMBER -->
    <label :for="lineNumberId" class="rounded-md overflow-hidden">
      <input
        ref="lineNumber"
        @input="updateInput"
        @blur="updateInput"
        @keydown.enter="updateInput"
        type="number"
        :id="lineNumberId"
        :name="answer.id"
        :min="1000"
        :max="9999"
        v-model="selectedCopy.lineNumber"
        class="bg-white text-slate-950 text-center w-max h-6 leading-none appearance-none focus:outline-none"
      />
    </label>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  size: Size;
  answer: PhoneNumberInput;
}>();

const emits = defineEmits<{
  (e: "changeSelected", selected: PhoneNumberSelected): void;
}>();

// Template Refs for the three inputs
const areaCode = ref<HTMLElement>(null);
const prefix = ref<HTMLElement>(null);
const lineNumber = ref<HTMLElement>(null);

// Form IDs for the three inputs
const areaCodeId = props.answer.id + "-areaCode";
const prefixId = props.answer.id + "-prefix";
const lineNumberId = props.answer.id + "-lineNumber";

// A copy of the 'selected' prop which is bound to the Number Input using v-model
// This is a seperate variable to avoid directly modifying the 'selected' prop since it's a nested property of the 'answer' Object prop
// So modifying it would unintentionally modify the parent Object as well without emitting anything
// https://vuejs.org/guide/components/props.html#one-way-data-flow
const selectedCopy = ref<PhoneNumberSelected>(props.answer.selected);

// Whenever the value of 'selected' changes, update the value of 'selectedCopy'.
// This will keep the values of 'selected' and 'selectedCopy' the same.
watch(
  [() => props.answer.selected.areaCode, () => props.answer.selected.prefix, () => props.answer.selected.lineNumber],
  () => {
    // Update the value of 'selectedCopy' to equal the value of 'selected'
    selectedCopy.value = props.answer.selected;
  }
);

// Truncates the passed 'number' to only include the first number of digits equal to the passed 'numDigits'.
const truncateNumber = (number: number, numDigits: number) => +number?.toString()?.slice(0, numDigits);

// Updates the phone number input value
const updateInput = () => {
  // Verfifies Area Code is only 3 digits long.
  if (selectedCopy.value.areaCode >= 1000) selectedCopy.value.areaCode = truncateNumber(selectedCopy.value.areaCode, 3);
  // Verfifies Prefix is only 3 digits long.
  if (selectedCopy.value.prefix >= 1000) selectedCopy.value.prefix = truncateNumber(selectedCopy.value.prefix, 3);
  // Verfifies Line Number is only 3 digits long.
  if (selectedCopy.value.lineNumber >= 10000)
    selectedCopy.value.lineNumber = truncateNumber(selectedCopy.value.lineNumber, 4);

  const isAreaCodeValid =
    selectedCopy.value.areaCode && selectedCopy.value.areaCode > 99 && selectedCopy.value.areaCode < 1000;
  const isPrefixValid = selectedCopy.value.prefix && selectedCopy.value.prefix > 99 && selectedCopy.value.prefix < 1000;
  const isLineNumValid =
    selectedCopy.value.lineNumber && selectedCopy.value.lineNumber > 999 && selectedCopy.value.lineNumber < 10000;

  // If the input values are valid
  if (isAreaCodeValid && isPrefixValid && isLineNumValid) {
    // Emit the 'changeSelected' function.
    emits("changeSelected", selectedCopy.value);
  } else {
    // If the focused element is the Area Code input that is valid, and the next input (Prefix) isn't valid.
    if (areaCode.value === document.activeElement && isAreaCodeValid && !isPrefixValid) {
      // Focus on the Prefix field.
      prefix.value.focus();
    }
    // If the focused element is the Prefix input that is valid, and the next input (Line Number) isn't valid.
    else if (prefix.value === document.activeElement && isPrefixValid && !isLineNumValid) {
      // Focus on the Line Number field.
      lineNumber.value.focus();
    }
  }
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
