<template>
  <div class="flex flex-col bg-slate-800 w-full px-10 py-8 rounded-lg">
    <!-- HEADER -->
    <header class="flex items-center justify-center gap-x-12">
      <!-- LEFT -->
      <div class="grow">
        <GeneralTitle size="very large" text="Profile" color="white" class="py-[5.75px]" />
      </div>
      <!-- RIGHT -->
      <TransitionCustom name="fade" mode="out-in">
        <div v-if="isEdit" class="flex items-center justify-center gap-x-2">
          <!-- CONFIRM -->
          <IconWithTooltip
            @click="confirmChanges"
            size="large"
            iconType="checkmark"
            color="white"
            tooltipText="Confirm"
            isAccent
          />
          <!-- CANCEL -->
          <IconWithTooltip
            @click="cancelChanges"
            size="large"
            iconType="cancel"
            color="white"
            tooltipText="Cancel"
            isAccent
          />
        </div>
        <div v-else class="flex items-center justify-center gap-x-2">
          <!-- EDIT -->
          <IconWithTooltip
            @click="toggleIsEdit"
            size="large"
            iconType="edit"
            color="white"
            tooltipText="Edit"
            isAccent
          />
        </div>
      </TransitionCustom>
    </header>
    <main>
      <TransitionCustom name="fade" mode="out-in">
        <div v-if="isEdit" class="flex flex-col gap-y-6 gap-x-6 pt-6">
          <!-- MATCH PREFERENCE -->
          <div v-if="userStore.isCustomer" class="flex flex-col gap-y-2">
            <InputsTitle
              size="medium"
              title="Match Preference"
              :required="profileInputs.customer?.matchPreference?.required"
            />
            <div class="relative flex items-center justify-center w-full bg-slate-900 rounded-xl">
              <button
                v-for="option in ['Any', 'Good', 'Best']"
                @click="changeMatchPreference(option)"
                type="button"
                class="flex items-center justify-center p-4 w-full"
              >
                <p class="z-10 text-white text-base font-bold">{{ option }}</p>
              </button>
              <!-- SELECTED BUTTON OVERLAY -->
              <div
                :class="{
                'translate-x-[-100%]': (profileInputs.customer?.matchPreference as MatchPreferenceInput).selected === 'Any',
                'translate-x-[0%]': (profileInputs.customer?.matchPreference as MatchPreferenceInput).selected === 'Good',
                'translate-x-[100%]': (profileInputs.customer?.matchPreference as MatchPreferenceInput).selected === 'Best'
            }"
                class="absolute w-1/3 h-full bg-blue-600 transition-transform duration-300 rounded-xl"
              ></div>
            </div>
          </div>
          <!-- PHONE NUMBER & EMAIL -->
          <div class="pb-1 columns-2">
            <InputsPhoneNumber
              @changeSelected="changeSelected"
              size="medium"
              :answer="(profileInputs[userStore.user?.userType].phoneNumber as PhoneNumberInput)"
            />
            <!-- EMAIL -->
            <InputsEmail
              @updateInput="updateInput"
              :size="'medium'"
              :answer="(profileInputs[userStore.user?.userType].email as TextInput)"
            />
          </div>
        </div>
        <div v-else :class="[userStore.isCustomer ? 'columns-3' : 'columns-2']" class="gap-x-6 pt-10 pb-3">
          <!-- ANSWERS -->
          <div v-for="[key, value] in Object.entries(profileInputs[userStore.user?.userType])" :key="value.id">
            <AnswersNormal size="medium" :title="value.title" :text="profile[key]" />
          </div>
        </div>
      </TransitionCustom>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "~~/store/user";

const { questionsBoilerplate } = getFormInfo();
const { updateInput, changeSelected, matchPreferenceStrToNum, phoneNumberStrToSelected, phoneNumberSelectedToStr } =
  useForm();
const { generateID, deepCopy } = useUtilities();

const props = defineProps<{
  profile: Profile;
}>();

const userStore = useUserStore();

/* EDIT MODE */
const isEdit = ref(true);

const toggleIsEdit = () => {
  isEdit.value = !isEdit.value;
};

/* ACTIONS */
const confirmChanges = async () => {
  const profileInfo = {
    ...Object.fromEntries(
      Object.entries(profileInputs.value[userStore.user?.userType]).map(([key, value]) => [
        key,
        (value as MatchPreferenceInput | PhoneNumberInput)?.selected ?? (value as TextInput)?.input,
      ])
    ),
  } as { email: string; matchPreference: MatchPreference; phoneNumber: PhoneNumberSelected };

  console.log(profileInfo);

  /* 
  const { data, error } = await useFetch<{ updatedUser: IUser }>(`/api/${userStore.user?.userType}/editProfile`, {
    method: "PATCH",
    body: deepCopy({
      profileInfo,
    }),
  });

  const updatedUser = data.value?.updatedUser;

  if (!updatedUser || error.value) {
    console.error(error.value);
    return;
  }

  userStore.user = updatedUser
  */

  userStore.user = {
    ...userStore.user,
    email: profileInfo?.email,
    phoneNumber: phoneNumberSelectedToStr(profileInfo.phoneNumber),
    matchPreference: matchPreferenceStrToNum(profileInfo.matchPreference),
  };

  toggleIsEdit();
};

const cancelChanges = () => {
  toggleIsEdit();
};

const changeMatchPreference = (selected: string) => {
  (profileInputs.value.customer?.matchPreference as MatchPreferenceInput).selected = selected;
};

// Service Inputs
// #region
interface ProfileInputs {
  customer: Record<string, FormInput>;
  business: Record<string, FormInput>;
}

const profileInputs = ref<ProfileInputs>({
  customer: {
    matchPreference: {
      type: "none",
      id: "matchPreference",
      title: "Match Preference",
      required: true,
      selected: props.profile?.matchPreference ?? "",
      errors: [],
      warnings: [],
    },
    phoneNumber: {
      type: "phoneNumber",
      id: "phoneNumber",
      title: "Phone Number",
      required: false,
      selected: props.profile?.phoneNumber
        ? phoneNumberStrToSelected(props.profile?.phoneNumber)
        : {
            areaCode: null,
            prefix: null,
            lineNumber: null,
          },
      errors: [],
      warnings: [],
    },
    email: {
      type: "email",
      title: "Email",
      required: true,
      input: props.profile?.email ?? "",
      placeholder: questionsBoilerplate.email.placeholder,
      id: questionsBoilerplate.email.id,
      errors: [],
      warnings: [],
    },
  },
  business: {
    phoneNumber: {
      type: "phoneNumber",
      id: "phoneNumber",
      title: "Phone Number",
      required: false,
      selected: props.profile?.phoneNumber
        ? phoneNumberStrToSelected(props.profile?.phoneNumber)
        : {
            areaCode: null,
            prefix: null,
            lineNumber: null,
          },
      errors: [],
      warnings: [],
    },
    email: {
      type: "email",
      title: "Email",
      required: true,
      input: props.profile?.email ?? "",
      placeholder: questionsBoilerplate.email.placeholder,
      id: questionsBoilerplate.email.id,
      errors: [],
      warnings: [],
    },
  },
});
// #endregion
</script>
