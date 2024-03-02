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
          <GeneralTitle size="very large" text="Login" color="white" />
          <!-- DESCRIPTION -->
          <p class="text-white text-base">Welcome back, please enter your email and password to continue</p>
        </header>
        <!-- MAIN -->
        <main class="flex flex-col gap-y-4">
          <!-- CUSTOMER/BUSINESS SELECT -->
          <LayoutsRegistrationUserTypeSelection @changeUserType="changeUserType" :userType="userType" />
          <!-- EMAIL & PASSWORD ERRORS -->
          <InputsAlerts size="medium" :errors="emailAndPasswordErrors" :warnings="[]" />
          <!-- INPUTS -->
          <div class="flex flex-col gap-y-6">
            <!-- Wrap these Inputs in a ClientOnly Component because LastPass's Input autofill causes an SSR hydration error -->
            <ClientOnly>
              <!-- EMAIL -->
              <InputsEmail @updateInput="updateInput" :size="'medium'" :answer="questions.email" />
              <!-- PASSWORD -->
              <InputsPassword
                @updateInput="updateInput"
                :size="'medium'"
                :answer="questions.password"
                autocomplete="current"
              />
            </ClientOnly>
          </div>
          <!-- INPUT FOOTER -->
          <div class="flex flex-col-reverse items-center justify-center gap-2 sm:flex-row">
            <!-- SIGN UP LINK -->
            <div class="flex items-center justify-center gap-x-2 w-full min-w-0 sm:w-auto">
              <p class="text-white text-sm leading-tight truncate">Don't have an account?</p>
              <!-- SIGN UP -->
              <NuxtLink to="/signup">
                <GeneralTitle size="very small" text="Sign Up" color="white" isClickable />
              </NuxtLink>
            </div>
          </div>
        </main>
        <!-- LOG IN BUTTON -->
        <GeneralButton type="submit" color="white" data="Log In" />
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
const { loginCustomer, loginBusiness } = useAuth();
const { updateInput } = useForm();
const { questionsBoilerplate } = getFormInfo();

definePageMeta({
  middleware: "is-logged-out",
});

useSeoMeta({
  title: "Login",
});

// The user's type.
const userType = ref<UserType>("customer");

// Changes the user's type to the passed 'type'.
const changeUserType = (type: UserType) => {
  userType.value = type;
};

const questions = ref<LoginQuestions>({
  email: {
    type: "email",
    title: "Email",
    required: true,
    input: "",
    placeholder: questionsBoilerplate.email.placeholder,
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
    id: questionsBoilerplate.password.id,
    errors: [],
    warnings: [],
  },
});

// Stores any Form Errors that pertain to both the Email and Password Form Inputs.
const emailAndPasswordErrors = ref<Alert[]>([]);

// Attempts to login the User with the form's email and password values, and handles any returned Form Errors.
const submit = async () => {
  // Using the form's email and password values, login the User and return any Form Errors if present.
  const errors =
    userType.value === "customer"
      ? ((await loginCustomer({
          email: questions.value.email.input,
          password: questions.value.password.input,
        })) as FormErrors)
      : ((await loginBusiness({
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

  // Assign this value to any Form Errors whose key is 'both', otherwise clear any errors that may have previously been there.
  emailAndPasswordErrors.value = errors["both"] ?? [];
};
</script>
