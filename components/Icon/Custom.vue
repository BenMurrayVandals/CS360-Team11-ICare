<template>
  <div
    :class="{
      'fill-white stroke-white text-white': color === 'white',
      'fill-slate-950 stroke-slate-950 text-slate-950': color === 'very dark',
      'fill-slate-900 stroke-slate-900 text-slate-900': color === 'dark',
      'fill-slate-800 stroke-slate-800 text-slate-800': color === 'normal',
      'fill-slate-500 stroke-slate-500 text-slate-500': color === 'light',
      'fill-very-light stroke-very-light text-very-light': color === 'very light',
      'fill-red-500 stroke-red-500 text-red-500': color === 'error-red',
      'fill-amber-500 stroke-amber-500 text-amber-500': color === 'warning-yellow',
      'fill-sky-500 stroke-sky-500 text-sky-500': color === 'note-blue',
      '[&>:first-child>:first-child]:absolute [&>:first-child>:first-child]:left-1/2  [&>:first-child>:first-child]:translate-x-[-50%] ':
        type !== 'sent game requests' &&
        type !== 'incoming game requests' &&
        type !== 'incoming friend requests' &&
        type !== 'sent friend requests',
      '[&>:first-child>:first-child]:top-1/2 [&>:first-child>:first-child]:translate-y-[-50%] ':
        type !== 'invite to game' && type !== 'sent game invitations' && type !== 'incoming game invitations',
    }"
    class="[&>:first-child]:relative [&>:first-child>:first-child>:first-child]:fill-inherit"
  >
    <!-- MORE OPTIONS -->
    <div
      v-if="type === 'more options'"
      :class="{
        'w-2.5 h-2.5': size === 'small',
        'w-3.5 h-3.5': size === 'medium',
        'w-4 h-4': size === 'large',
        'w-6 h-6': size === 'very large',
      }"
    >
      <Icon
        name="material-symbols:more-vert"
        :class="{
          'w-3.5 h-3.5': size === 'small',
          'w-5 h-5': size === 'medium',
          'w-6 h-6': size === 'large',
          'w-8 h-8': size == 'very large',
        }"
        class="stroke-0"
      />
    </div>
    <!-- HAMBURGER MENU -->
    <div
      v-if="type === 'hamburger menu'"
      :class="{
        'w-2.5 h-2': size === 'small',
        'w-[15px] h-2.5': size === 'medium',
        'w-[18px] h-3': size === 'large',
        'w-6 h-4': size === 'very large',
      }"
    >
      <Icon
        name="material-symbols:menu-rounded"
        :class="{
          'w-3.5 h-3.5': size === 'small',
          'w-5 h-5': size === 'medium',
          'w-6 h-6': size === 'large',
          'w-8 h-8': size == 'very large',
        }"
        class="stroke-0"
      />
    </div>
    <!-- DROPDOWN ARROW -->
    <div
      v-else-if="type === 'dropdown arrow'"
      :class="{
        'w-2 h-[5px]': size === 'small',
        'w-2.5 h-1.5': size === 'medium',
        'w-[13px] h-2': size === 'large',
        'w-[18px] h-2.5': size === 'very large',
      }"
      class="mt-0.5"
    >
      <Icon
        name="material-symbols:keyboard-arrow-down-rounded"
        rotate="0"
        :class="{
          'w-4 h-4 stroke-1': size === 'small',
          'w-5 h-5 stroke-0': size === 'medium',
          'w-7 h-7 stroke-0': size === 'large',
          'w-9 h-9 stroke-0': size == 'very large',
        }"
      />
    </div>
    <!-- NEXT & PREVIOUS ARROWS -->
    <div
      v-else-if="type === 'next arrow' || type === 'previous arrow'"
      :class="[
        [type === 'next arrow' ? 'ml-px' : 'mr-px'],
        {
          'w-[5px] h-2': size === 'small',
          'w-[7px] h-3': size === 'medium',
          'w-[9px] h-[15px]': size === 'large',
          'w-3 h-5': size === 'very large',
        },
      ]"
    >
      <Icon
        name="material-symbols:keyboard-arrow-down-rounded"
        :rotate="type === 'next arrow' ? 3 : 1"
        :class="{
          'w-4 h-4 stroke-1': size === 'small',
          'w-6 h-6 stroke-0': size === 'medium',
          'w-8 h-8 stroke-0': size === 'large',
          'w-10 h-10 stroke-0': size == 'very large',
        }"
      />
    </div>
    <!-- BACK -->
    <div
      v-else-if="type === 'back'"
      :class="{
        'w-2 h-2': size === 'small',
        'w-[13px] h-[13px]': size === 'medium',
        'w-[19px] h-[18px]': size === 'large',
        'w-6 h-6': size === 'very large',
      }"
    >
      <Icon
        name="material-symbols:arrow-back-rounded"
        :class="{
          'w-3 h-3': size === 'small',
          'w-5 h-5': size === 'medium',
          'w-7 h-7': size === 'large',
          'w-9 h-9': size == 'very large',
        }"
        class="stroke-0"
      />
    </div>
    <!-- FORWARDS -->
    <div
      v-else-if="type === 'forwards'"
      :class="{
        'w-2 h-2': size === 'small',
        'w-[13px] h-[13px]': size === 'medium',
        'w-[19px] h-[18px]': size === 'large',
        'w-6 h-6': size === 'very large',
      }"
    >
      <Icon
        name="material-symbols:arrow-forward-rounded"
        :class="{
          'w-3 h-3': size === 'small',
          'w-5 h-5': size === 'medium',
          'w-7 h-7': size === 'large',
          'w-9 h-9': size == 'very large',
        }"
        class="stroke-0"
      />
    </div>
    <!-- DOWNWARDS -->
    <div
      v-else-if="type === 'downwards'"
      :class="{
        'w-2 h-2': size === 'small',
        'w-[13px] h-[13px]': size === 'medium',
        'w-4 h-4': size === 'large',
        'w-[21px] h-[21px]': size === 'very large',
      }"
      class="mt-px"
    >
      <Icon
        name="material-symbols:arrow-downward-rounded"
        :class="{
          'w-3 h-3': size === 'small',
          'w-5 h-5': size === 'medium',
          'w-6 h-6': size === 'large',
          'w-8 h-8': size == 'very large',
        }"
        class="stroke-0"
      />
    </div>
    <!-- EDIT -->
    <div
      v-else-if="type === 'edit'"
      :class="{
        'w-2.5 h-2.5': size === 'small',
        'w-[13px] h-[13px]': size === 'medium',
        'w-4 h-4': size === 'large',
        'w-[19px] h-[19px]': size === 'very large',
      }"
    >
      <Icon
        name="material-symbols:edit-rounded"
        :class="{
          'w-3 h-3': size === 'small',
          'w-4 h-4': size === 'medium',
          'w-5 h-5': size === 'large',
          'w-6 h-6': size == 'very large',
        }"
        class="stroke-0"
      />
    </div>
    <!-- SETTINGS -->
    <div
      v-else-if="type === 'settings'"
      :class="{
        'w-[9px] h-[9px]': size === 'small',
        'w-3.5 h-3.5': size === 'medium',
        'w-[17px] h-[17px]': size === 'large',
        'w-5 h-5': size === 'very large',
      }"
    >
      <Icon
        name="material-symbols:settings"
        :class="{
          'w-2.5 h-2.5': size === 'small',
          'w-4 h-4': size === 'medium',
          'w-[20px] h-[20px]': size === 'large',
          'w-6 h-6': size == 'very large',
        }"
        class="stroke-0"
      />
    </div>
    <!-- PLUS -->
    <div
      v-else-if="type === 'plus'"
      :class="{
        'w-[9px] h-[9px]': size === 'small',
        'w-[13px] h-[13px]': size === 'medium',
        'w-[17px] h-[17px]': size === 'large',
        'w-[19px] h-[19px]': size === 'very large',
      }"
    >
      <Icon
        name="material-symbols:add-rounded"
        :class="{
          'w-3.5 h-3.5 stroke-1': size === 'small',
          'w-[22px] h-[22px]  stroke-0': size === 'medium',
          'w-7 h-7 stroke-0': size === 'large',
          'w-8 h-8 stroke-0': size == 'very large',
        }"
      />
    </div>
    <!-- MINUS -->
    <div
      v-else-if="type === 'minus'"
      :class="{
        'w-[9px] h-0.5': size === 'small',
        'w-[13px] h-0.5': size === 'medium',
        'w-[17px] h-[3px]': size === 'large',
        'w-[19px] h-[3px]': size === 'very large',
      }"
    >
      <Icon
        name="material-symbols:remove-rounded"
        :class="{
          'w-3.5 h-3.5 stroke-1': size === 'small',
          'w-[22px] h-[22px] stroke-0': size === 'medium',
          'w-7 h-7 stroke-0': size === 'large',
          'w-8 h-8 stroke-0': size == 'very large',
        }"
      />
    </div>
    <!-- CANCEL -->
    <div
      v-else-if="type === 'cancel'"
      :class="{
        'w-2.5 h-2.5': size === 'small',
        'w-3.5 h-3.5': size === 'medium',
        'w-5 h-5': size === 'large',
        'w-6 h-6': size === 'very large',
      }"
    >
      <Icon
        name="ooui:cancel"
        :class="{
          'w-2.5 h-2.5 stroke-1': size === 'small',
          'w-3.5 h-3.5 stroke-0': size === 'medium',
          'w-5 h-5 stroke-0': size === 'large',
          'w-6 h-6 stroke-0': size == 'very large',
        }"
      />
    </div>
    <!-- REMOVE -->
    <div
      v-else-if="type === 'remove'"
      :class="{
        'w-2 h-2': size === 'small',
        'w-[11px] h-[11px]': size === 'medium',
        'w-[15px] h-[15px]': size === 'large',
        'w-[18px] h-[18px]': size === 'very large',
      }"
    >
      <Icon
        name="material-symbols:close-rounded"
        :class="{
          'w-3.5 h-3.5 stroke-1': size === 'small',
          'w-5 h-5 stroke-0': size === 'medium',
          'w-[26px] h-[26px] stroke-0': size === 'large',
          'w-8 h-8 stroke-0': size == 'very large',
        }"
      />
    </div>
    <!-- CHECKMARK -->
    <div
      v-else-if="type === 'checkmark'"
      :class="{
        'w-[9px] h-[7px] mt-px': size === 'small',
        'w-[13px] h-2.5 mt-px': size === 'medium',
        'w-5 h-3.5 mt-px': size === 'large',
        'w-6 h-[17px] mt-0.5': size === 'very large',
      }"
    >
      <Icon
        name="material-symbols:done-rounded"
        :class="{
          'w-3.5 h-3.5 stroke-1': size === 'small',
          'w-5 h-5 stroke-0': size === 'medium',
          'w-[30px] h-[30px] stroke-0': size === 'large',
          'w-9 h-9 stroke-0': size == 'very large',
        }"
      />
    </div>
    <!-- NOTIFICATION -->
    <div
      v-else-if="type === 'notification'"
      :class="{
        'w-[9px] h-2.5': size === 'small',
        'w-3 h-3.5': size === 'medium',
        'w-[15px] h-[17px]': size === 'large',
        'w-[18px] h-5': size === 'very large',
      }"
    >
      <Icon
        name="bxs:bell"
        :class="{
          'w-3 h-3': size === 'small',
          'w-4 h-4': size === 'medium',
          'w-5 h-5': size === 'large',
          'w-6 h-6': size == 'very large',
        }"
        class="stroke-0"
      />
    </div>
    <!-- USER -->
    <div
      v-else-if="type === 'user'"
      :class="{
        'w-[9px] h-2.5': size === 'small',
        'w-[11px] h-3': size === 'medium',
        'w-3.5 h-4': size === 'large',
        'w-[18px] h-5': size === 'very large',
        'w-[25px] h-7': size === 'extremely large',
      }"
    >
      <Icon
        name="fa-solid:user"
        :class="{
          'w-2.5 h-2.5': size === 'small',
          'w-3 h-3': size === 'medium',
          'w-4 h-4': size === 'large',
          'w-5 h-5': size === 'very large',
          'w-7 h-7': size === 'extremely large',
        }"
        class="stroke-0"
      />
    </div>
    <!-- LOGOUT -->
    <div
      v-else-if="type === 'logout'"
      :class="{
        'w-[9px] h-[9px] ml-0.5': size === 'small',
        'w-3 h-3 ml-0.5': size === 'medium',
        'w-[17px] h-[17px] ml-1': size === 'large',
        'w-5 h-5 ml-1': size === 'very large',
      }"
    >
      <Icon
        name="material-symbols:logout-rounded"
        :class="{
          'w-3 h-3 stroke-1': size === 'small',
          'w-4 h-4 stroke-0': size === 'medium',
          'w-[22px] h-[22px] stroke-0': size === 'large',
          'w-[26px] h-[26px] stroke-0': size == 'very large',
        }"
      />
    </div>
    <!-- LOGIN -->
    <div
      v-else-if="type === 'login'"
      :class="{
        'w-[9px] h-[9px] mr-0.5': size === 'small',
        'w-3 h-3 mr-0.5': size === 'medium',
        'w-[17px] h-[17px] mr-1': size === 'large',
        'w-5 h-5 mr-1': size === 'very large',
      }"
    >
      <Icon
        name="material-symbols:login-rounded"
        :class="{
          'w-3 h-3 stroke-1': size === 'small',
          'w-4 h-4 stroke-0': size === 'medium',
          'w-[22px] h-[22px] stroke-0': size === 'large',
          'w-[26px] h-[26px] stroke-0': size == 'very large',
        }"
      />
    </div>
    <!-- ERROR -->
    <div
      v-else-if="type === 'error'"
      :class="{
        'w-3 h-3': size === 'small',
        'w-[15px] h-[15px]': size === 'medium',
        'w-[19px] h-[19px]': size === 'large',
        'w-[22px] h-[22px]': size === 'very large',
        'w-[27px] h-[27px]': size === 'extremely large',
      }"
    >
      <Icon
        name="material-symbols:error-rounded"
        :class="{
          'w-3.5 h-3.5': size === 'small',
          'w-[18px] h-[18px] ': size === 'medium',
          'w-[22px] h-[22px]': size === 'large',
          'w-[26px] h-[26px] ': size == 'very large',
          'w-8 h-8 ': size == 'extremely large',
        }"
        class="stroke-0"
      />
    </div>
    <!-- WARNING -->
    <div
      v-else-if="type === 'warning'"
      :class="{
        'w-3 h-[11px]': size === 'small',
        'w-4 h-3.5': size === 'medium',
        'w-[19px] h-[17px]': size === 'large',
        'w-[23px] h-5': size === 'very large',
        'w-7 h-6': size === 'extremely large',
      }"
    >
      <Icon
        name="material-symbols:warning-rounded"
        :class="{
          'w-3.5 h-3.5': size === 'small',
          'w-[18px] h-[18px] ': size === 'medium',
          'w-[22px] h-[22px]': size === 'large',
          'w-[26px] h-[26px] ': size == 'very large',
          'w-[32px] h-[32px] ': size == 'extremely large',
        }"
        class="stroke-0"
      />
    </div>
    <!-- NOTE -->
    <div
      v-else-if="type === 'note'"
      :class="{
        'w-3 h-3': size === 'small',
        'w-[15px] h-[15px]': size === 'medium',
        'w-[19px] h-[19px]': size === 'large',
        'w-[22px] h-[22px]': size === 'very large',
        'w-[27px] h-[27px]': size === 'extremely large',
      }"
    >
      <Icon
        name="material-symbols:info-rounded"
        :class="{
          'w-3.5 h-3.5': size === 'small',
          'w-[18px] h-[18px] ': size === 'medium',
          'w-[22px] h-[22px]': size === 'large',
          'w-[26px] h-[26px] ': size == 'very large',
          'w-8 h-8 ': size == 'extremely large',
        }"
        class="stroke-0"
      />
    </div>
    <!-- SEARCH -->
    <div
      v-else-if="type === 'search'"
      :class="{
        'w-[9px] h-[9px]': size === 'small',
        'w-3 h-3': size === 'medium',
        'w-[17px] h-[17px]': size === 'large',
        'w-5 h-5': size === 'very large',
      }"
    >
      <Icon
        name="material-symbols:search-rounded"
        :class="{
          'w-3 h-3 stroke-1': size === 'small',
          'w-4 h-4 stroke-0': size === 'medium',
          'w-[22px] h-[22px] stroke-0': size === 'large',
          'w-[26px] h-[26px] stroke-0': size == 'very large',
        }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  size: Size;
  type: string;
  color?: string;
}>();

/* HOW FILL, STROKE, AND TEXT COLOR WORKS */
// Each Icon inherits its Fill color, Stroke color, and Text color. Only Fill color inheritance is manually given because Stroke and Text color
// seems to automatically inherit.
// If the 'color' Prop is given, then the Icon's Fill, Stroke, and Text colors will inherit from that passed color on this Component's Root Element.
// If the 'color' Prop is not given, then the Icon's Fill, Stroke, and Text colors will inherit from the closest ancestor that does have a Fill, Stroke or Text styling

// FILL
// Fill is responsible for the color of most Icons. If an Icon uses two or more seperate Icons, then the Fill will only provide the color for the first Icon.

// STROKE
// Stroke is responsible for the Stroke color of all Icons. It seems that inheriting a Stroke color also unintentionally adds a Stroke Weight of 1px. So since
// all Icons are automatically inheriting a Stroke color, each Icon that shouldn't have any Stroke Weight needs to manually have their Stroke Weights set to 0px.

// TEXT
// Text is responsible for the color of some Icons that for whatever reason can't or doesn't use Fill to provide their color. These include some Icons that tend to
// be comprised of thin lines instead of fillable space, and for Icons that use two or more seperate Icons wherein any Icon after the first Icon won't inherit their
// color from Fill but will instead inherit their color from Text.
</script>
