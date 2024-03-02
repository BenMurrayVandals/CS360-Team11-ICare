<template>
  <div class="flex items-center justify-center bg-slate-950 h-screen">
    <!-- MAIN CONTAINER -->
    <div class="flex flex-col items-center justify-center bg-slate-900 w-full max-w-xl max-h-full rounded-2xl">
      <!-- FORM -->
      <form
        @submit.prevent="submit"
        class="flex flex-col gap-y-8 w-full px-6 py-12 overflow-y-auto scrollbar-thin scroll-track-transparent scroll-thumb-slate-900 sm:px-12"
      >
        <!-- HEADER -->
        <header class="flex flex-col gap-y-1">
          <!-- TITLE -->
          <GeneralTitle size="very large" text="Sign up" color="white" />
          <!-- DESCRIPTION -->
          <p class="text-white text-base">Welcome, please enter the following information to create an account</p>
        </header>
        <!-- MAIN -->
        <main class="flex flex-col gap-y-4">
          <!-- CUSTOMER/BUSINESS SELECT -->
          <LayoutsRegistrationUserTypeSelection @changeUserType="changeUserType" :userType="userType" />
          <!-- INPUTS -->
          <div ref="inputs" class="relative flex flex-col gap-y-6 transition-[height] duration-300 overflow-y-hidden">
            <!-- Wrap these Inputs in a ClientOnly Component because LastPass's Input autofill causes an SSR hydration error -->
            <ClientOnly>
              <!-- USERNAME NAME -->
              <TransitionGroup
                @beforeLeave="
                  positionLeavingElement($event as HTMLElement);
                  setTransitionElementHeight('before', inputs);
                "
                @leave="setTransitionElementHeight('during', inputs, userType === 'customer' ? 242 : 86)"
                @afterLeave="setTransitionElementHeight('after', inputs)"
                :name="'users'"
              >
                <div v-if="userType === 'customer'" key="customerQuestions" class="flex flex-col gap-y-4">
                  <InputsText
                    @updateInput="updateInput"
                    :key="questions.username.id"
                    :size="'medium'"
                    :answer="questions.username"
                  />
                  <!-- FIRST NAME -->
                  <InputsText
                    @updateInput="updateInput"
                    :key="questions.firstName.id"
                    :size="'medium'"
                    :answer="questions.firstName"
                  />
                  <!-- LAST NAME -->
                  <InputsText
                    @updateInput="updateInput"
                    :key="questions.lastName.id"
                    :size="'medium'"
                    :answer="questions.lastName"
                  />
                </div>
                <!-- BUSINESS NAME -->
                <InputsText
                  v-if="userType === 'business'"
                  @updateInput="updateInput"
                  :key="questions.businessName.id"
                  :size="'medium'"
                  :answer="questions.businessName"
                />
                <!-- EMAIL -->
                <InputsEmail
                  @updateInput="updateInput"
                  :key="questions.email.id"
                  :size="'medium'"
                  :answer="questions.email"
                />
                <!-- PASSWORD -->
                <InputsPassword
                  @updateInput="updateInput"
                  :key="questions.password.id"
                  :size="'medium'"
                  :answer="questions.password"
                  autocomplete="new"
                />
              </TransitionGroup>
            </ClientOnly>
          </div>
          <!-- INPUT FOOTER -->
          <div class="flex items-center justify-center gap-x-2">
            <!-- ALREADY HAVE AN ACCOUNT -->
            <p class="text-white text-sm leading-tight truncate">Already have an account?</p>
            <!-- LOG IN -->
            <NuxtLink to="/login">
              <GeneralTitle size="very small" text="Log In" color="white" isClickable />
            </NuxtLink>
          </div>
        </main>
        <!-- SIGN UP BUTTON -->
        <GeneralButton type="submit" color="white" data="Sign Up" />
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
const { signupCustomer, signupBusiness } = useAuth();
const { updateInput } = useForm();
const { questionsBoilerplate } = getFormInfo();
const { positionLeavingElement, setTransitionElementHeight } = useTransitions();

definePageMeta({
  middleware: "is-logged-out",
});

useSeoMeta({
  title: "Signup",
});

const inputs = ref<HTMLElement | null>(null);

// The user's type.
const userType = ref<UserType>("customer");

// Changes the user's type to the passed 'type'.
const changeUserType = (type: UserType) => {
  userType.value = type;
};

const questions = ref<SignupQuestions>({
  username: {
    type: "text",
    title: "Username",
    required: true,
    input: "",
    placeholder: questionsBoilerplate.username.placeholder,
    minLength: questionsBoilerplate.username.minLength,
    maxLength: questionsBoilerplate.username.maxLength,
    id: questionsBoilerplate.username.id,
    errors: [],
    warnings: [],
  },
  firstName: {
    type: "text",
    title: "First name",
    required: true,
    input: "",
    placeholder: questionsBoilerplate.firstName.placeholder,
    id: questionsBoilerplate.firstName.id,
    errors: [],
    warnings: [],
  },
  lastName: {
    type: "text",
    title: "Last name",
    required: true,
    input: "",
    placeholder: questionsBoilerplate.lastName.placeholder,
    id: questionsBoilerplate.lastName.id,
    errors: [],
    warnings: [],
  },
  businessName: {
    type: "text",
    title: "Business Name",
    required: true,
    input: "",
    placeholder: questionsBoilerplate.businessName.placeholder,
    minLength: questionsBoilerplate.businessName.minLength,
    maxLength: questionsBoilerplate.businessName.maxLength,
    id: questionsBoilerplate.businessName.id,
    errors: [],
    warnings: [],
  },
  email: {
    type: "email",
    title: "Email",
    required: true,
    input: "",
    placeholder: questionsBoilerplate.email.placeholder,
    minLength: questionsBoilerplate.email.minLength,
    maxLength: questionsBoilerplate.email.maxLength,
    id: questionsBoilerplate.email.id,
    errors: [],
    warnings: [],
  },
  password: {
    type: "password",
    title: "Password",
    required: true,
    input: "",
    placeholder: "Enter your password",
    minLength: questionsBoilerplate.password.minLength,
    maxLength: questionsBoilerplate.password.maxLength,
    id: questionsBoilerplate.password.id,
    errors: [],
    warnings: [],
  },
});

// Attempts to signin the User with the form's email and password values, and handles any returned Form Errors.
const submit = async () => {
  // Using the form's username, email, and password values, signup the new User and return any Form Errors if present.
  const errors =
    userType.value === "customer"
      ? ((await signupCustomer({
          username: questions.value.username.input,
          firstName: questions.value.firstName.input,
          lastName: questions.value.lastName.input,
          email: questions.value.email.input,
          password: questions.value.password.input,
        })) as FormErrors)
      : ((await signupBusiness({
          businessName: questions.value.businessName.input,
          email: questions.value.email.input,
          password: questions.value.password.input,
        })) as FormErrors);

  // If there are no Form Errors, return.
  if (!errors) return;

  // Loop through each Question.
  for (let question in questions.value) {
    // For each Question, assign the errors for that corresponding Question (If any) to the Question. If there are no errors, than clear any errors
    // that may have previously been there.
    (questions.value[question] as TextInput).errors = errors[question] ?? [];
  }
};
</script>
