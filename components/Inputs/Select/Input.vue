<template>
  <GeneralDropdown dropdownDirection="bottom-start" height="medium">
    <!-- DROPDOWN ANCHOR SLOT CONTENT -->
    <template #anchor="{ dropdownVisible, closeDropdown }">
      <!-- DROPDOWN INPUT -->
      <div
        :aria-label="selected"
        :class="[hasEqualPadding ? 'p-2' : 'pl-4 pr-2 py-2']"
        class="flex items-center justify-between gap-x-2 bg-white w-full rounded-lg truncate [&>:first-child]:w-full"
      >
        <!-- TOOLTIP -->
        <GeneralTooltip :data="selected ? selected : placeholder" direction="top" :offset="16" isText>
          <!-- TEXT -->
          <p
            :class="[
              selected ? 'text-slate-950' : 'text-slate-950/[0.5] select-none',
              { 'text-xs': size == 'small', 'text-sm': size == 'medium' },
            ]"
            class="leading-tight cursor-pointer truncate"
          >
            {{ selected ? selected : placeholder }}
          </p>
          <!-- HIDDEN INPUT -->
          <!-- Not sure if I'm going to be using this anymore for the 'required' property as I may do that manually, but keeping it here anyways if I do -->
          <!-- We're using a hidden Text Input so we can gain access to the 'required' property, even though the Input is hidden from the user -->
          <!-- We're not using the Select Input because you can't fully hide the default Dropdown menu, and we're not using a visible Text Input because of issues with the 'size' attribute -->
          <input
            readonly
            type="text"
            :placeholder="placeholder"
            :value="selected"
            :class="{ 'text-xs': size == 'small', 'text-sm': size == 'medium' }"
            class="hidden bg-inherit text-slate-950 leading-tight w-full truncate cursor-pointer appearance-none focus:outline-none"
          />
        </GeneralTooltip>
        <!-- ICON -->
        <IconNoButton
          :size="'small'"
          iconType="dropdown arrow"
          color="white"
          :class="{ 'rotate-180 [&>:first-child>:first-child]:mb-px ': dropdownVisible }"
          class="transition-transform duration-300"
        />
      </div>
    </template>
    <!-- DROPDOWN CONTENT SLOT CONTENT -->
    <template #dropdown-content="{ closeDropdown }">
      <TransitionGroup name="dropdown-items" tag="ul" class="px-2 py-1">
        <!-- UNSELECT DROPDOWN ITEM -->
        <GeneralDropdownItem
          v-if="isUnselectable"
          @click="
            $emit('changeSelected', '');
            closeDropdown();
          "
          key="unselect"
          size="large"
          data="Unselect"
          class="text-slate-950/[0.5] italic"
          isRounded
        />
        <!-- DROPDOWN OPTIONS -->
        <GeneralDropdownItem
          v-if="availableOptions.length > 0"
          v-for="option in availableOptions"
          @click="
            $emit('changeSelected', (option as FormOption).text ? (option as FormOption).text : (option as string));
            closeDropdown();
          "
          :key="(option as FormOption).id ? (option as FormOption).id : (option as string)"
          :size="'large'"
          :data="(option as FormOption).text ? (option as FormOption).text : (option as string)"
          isRounded
        />
        <!-- NO OPTIONS -->
        <GeneralDropdownItem v-else key="no-options" :size="'large'" data="No more options" isDisabled />
      </TransitionGroup>
    </template>
  </GeneralDropdown>
</template>

<script setup lang="ts">
import Input from "~/components/Inputs/Text/Input.vue";

defineProps<{
  size: Size;
  answer: Select;
  selected: string;
  placeholder: string;
  availableOptions: FormOption[] | string[];
  isUnselectable?: boolean;
  hasEqualPadding?: boolean;
}>();

defineEmits<{
  (e: "changeSelected", selected: string): void;
  (e: "updateInput", input: string): void;
}>();

/* CONFIRMATION */
// Template Ref for the 'TextInput' Component Instance.
// This is used to access the 'focusText' and 'unfocusText' functions exposed by the Component.
const textInput = ref<InstanceType<typeof Input> | null>(null);

// If the passed 'isDropdownOpen' is true, then stop the passed Event from propagating up.
// This function is used to prevent the Dropdown from closing if the Text Input is clicked while the Dropdown is open.
// (The click event that we don't want this click event to propagate to is in the Dropdown Component).
const dontCloseDropdown = (isDropdownOpen: boolean, e: Event) => {
  if (isDropdownOpen) e.stopPropagation();
};
</script>

<style scoped>
.dropdown-items-move {
  transition: all 0.3s ease;
}
</style>
