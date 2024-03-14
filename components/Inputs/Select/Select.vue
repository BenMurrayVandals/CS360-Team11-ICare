<template>
  <InputsBase :size="size" :answer="answer">
    <!-- ANSWER INPUT SLOT CONTENT -->
    <template #input>
      <!-- SELECT INPUT -->
      <InputsSelectInput
        @changeSelected="$emit('changeSelected', { answer: answer, selected: $event })"
        @updateInput="changeSelectedDebounced(answer, $event)"
        :size="size"
        :answer="answer"
        :selected="answer.selected"
        :placeholder="answer.placeholder"
        :availableOptions="availableOptions"
        :isUnselectable="isUnselectable"
      />
    </template>
  </InputsBase>
</template>

<script setup lang="ts">
// import { useFuse } from "@vueuse/integrations/useFuse";
const { debounce } = getFuncDelays();

const props = defineProps<{
  size: Size;
  answer: Select;
  isUnselectable?: boolean;
}>();

const emits = defineEmits<{
  (e: "changeSelected", args: { answer: Select; selected: string }): void;
}>();

// Emits the 'changeSelected' function after a specified time.
// This function is used to update the selected option from the Text Field. Whenever the selected option is changed, the value of 'availableOptions'
// recomputes, but we only want the available options to recompute after the User is done typing.
const changeSelectedDebounced = debounce((answer: Select, input: string) => {
  emits("changeSelected", { answer: answer, selected: input });
}, 300);

// Computes the options that are available to be selected from the Select Input Dropdown.
const availableOptions = computed(() => {
  // Creates a copy of the 'options' Answer Prop Array that will be returned later.
  let options = props.answer.options;

  /*
    // If this Component uses a Text Input, and there is a selected option, such as being entered from the Text Input.
    if (props.isTextInput && props.answer.selected) {
      // Perform a text search on the 'options' Array to match Options whose 'text' field matches the selected option, sorting the matched Options by
      // best matching.
      const { results: searchResults } = useFuse(props.answer.selected, options, {
        fuseOptions: {
          keys: ["text"],
        },
      });
  
      // Returns the matched Options from the text search.
      const searchResultItems = searchResults.value.map((curResult) => curResult.item);
  
      // If there are matched Options, but not every Option was matched.
      if (searchResultItems.length >= 1 && searchResultItems.length < options.length) {
        // Assign the 'options' Array to be a new Array of the matched Options followed by the remaining Options that weren't matched by the text search.
        options = [...searchResultItems, ...options.filter((curOption) => !searchResultItems.some((curItem) => curItem.text === curOption.text))];
      }
      // If every Option was matched by the text search.
      else if (searchResultItems.length === options.length) {
        // Assign the 'options' Array to be same matched Options that have just been resorted.
        options = searchResultItems;
      }
    }
    */

  // If there is a selected option, filter out the Option from the 'options' Array whose text matches the selected option and return the new Array. Otherwise, just
  // return the 'options' Array if there isn't a selected option.
  return props.answer.selected
    ? options.filter((option) => option.text.toLowerCase() !== props.answer.selected.toLowerCase())
    : options;
});
</script>
