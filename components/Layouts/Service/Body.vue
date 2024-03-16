<template>
  <div>
    <!-- EDIT & READ -->
    <TransitionCustom name="fade" mode="out-in">
      <div
        v-if="isEdit"
        class="gap-x-6 pt-10"
        :class="{
          'pb-1': !hasToggle,
          'colums-1': numCols === 1,
          'columns-2': numCols === 2,
          'columns-3': numCols === 3,
          'columns-4': numCols === 4,
        }"
      >
        <!-- INPUTS -->
        <div v-for="[key, value] in Object.entries(inputs)" :key="value.id">
          <!-- COUNTER -->
          <div v-if="value.type === 'counter'" class="flex items-center gap-x-4">
            <InputsCounter
              @changeSelected="$emit('changeSelected', $event)"
              size="medium"
              :answer="(value as Counter)"
            />
            <!-- INTERNET SPEED BUTTON -->
            <NuxtLink
              v-if="serviceType === 'Internet' && key === 'speed'"
              to="https://www.speedtest.net/"
              target="_blank"
            >
              <IconWithTooltip
                size="large"
                iconType="search"
                color="white"
                tooltipText="Find your internet speed"
                isAccent
              />
            </NuxtLink>
            <!-- LAWN SIZE BUTTON -->
            <NuxtLink
              v-if="serviceType === 'Lawn' && key === 'lawnSize'"
              to="https://www.measuremylawn.com/"
              target="_blank"
            >
              <IconWithTooltip
                size="large"
                iconType="search"
                color="white"
                tooltipText="Find your lawn size"
                isAccent
              />
            </NuxtLink>
          </div>
          <!-- TOGGLE -->
          <InputsToggle
            v-else-if="value.type === 'toggle'"
            @changeSelected="$emit('changeSelected', $event)"
            size="medium"
            :answer="(value as ToggleInput)"
          />
        </div>
      </div>
      <div
        v-else
        class="gap-x-6 pt-10 pb-3"
        :class="[
          {
            'colums-1': numCols === 1,
            'columns-2': numCols === 2,
            'columns-3': numCols === 3,
            'columns-4': numCols === 4,
          },
        ]"
      >
        <!-- ANSWERS -->
        <div v-for="[key, value] in Object.entries(inputs)" :key="value.id">
          <!-- COUNTERS -->
          <AnswersNormal
            v-if="value.type === 'counter'"
            size="medium"
            :title="value.title"
            :text="`${(value as Counter).text.left}${serviceRead[key]} ${(value as Counter).text.right}`"
          />
          <!-- TOGGLE -->
          <AnswersNormal
            v-else-if="value.type === 'toggle'"
            size="medium"
            :title="value.title"
            :text="capitalize(serviceRead[key]?.toString())"
          />
        </div>
      </div>
    </TransitionCustom>
  </div>
</template>

<script setup lang="ts">
const { capitalize } = useUtilities();

const props = defineProps<{
  serviceRead: Service | null;
  serviceType: string;
  inputs: Record<string, FormInput>;
  isEdit?: boolean;
}>();

defineEmits<{
  (e: "changeSelected", args: { answer: FormInput; selected: number | string | boolean }): void;
}>();

// Computes num of columns to seperate the inputs/answers into
const numCols = computed(() => Object.keys(props.inputs)?.length);

// Computes whether this Component's inputs contain a toggle input, because the toggle has a different height than the other inputs
// so the height of the Component should be a little different.
const hasToggle = computed(() => Object.values(props.inputs).some((curInput) => curInput.type === "toggle"));
</script>
