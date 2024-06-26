<template>
  <div class="flex flex-col bg-slate-800 w-full px-10 py-8 rounded-lg">
    <!-- HEADER -->
    <header class="flex items-center justify-center gap-x-12">
      <!-- LEFT -->
      <div class="grow">
        <TransitionCustom name="fade" mode="out-in">
          <InputsSelect
            v-if="isEdit"
            @changeSelected="changeSelected"
            size="medium"
            :answer="serviceTypeInput"
            showSelectedOption
          />
          <GeneralTitle v-else size="very large" :text="service.serviceType" color="white" class="py-[5.75px]" />
        </TransitionCustom>
      </div>
      <!-- RIGHT -->
      <div v-if="!isReadOnly">
        <TransitionCustom name="fade" mode="out-in">
          <div v-if="isEdit" class="flex items-center justify-center gap-x-2">
            <!-- CONFIRM -->
            <IconWithTooltip
              v-if="serviceTypeInput?.selected"
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
            <!-- DELETE -->
            <IconWithTooltip
              @click="deleteService"
              size="large"
              iconType="remove"
              color="white"
              tooltipText="Delete"
              isAccent
            />
          </div>
        </TransitionCustom>
      </div>
      <div v-else-if="!isAcceptedMatch" class="flex items-center justify-center gap-x-2">
        <!-- ACCEPT -->
        <IconWithTooltip
          @click="$emit('acceptMatch', service.id)"
          size="large"
          iconType="checkmark"
          color="white"
          tooltipText="Accept"
          isAccent
        />
        <!-- DENY -->
        <IconWithTooltip
          @click="$emit('denyMatch', service.id)"
          size="large"
          iconType="remove"
          color="white"
          tooltipText="Deny"
          isAccent
        />
      </div>
    </header>
    <main>
      <LayoutsServiceBody
        v-if="isEdit ? serviceTypeInput.selected : service.serviceType"
        @changeSelected="changeSelected"
        :serviceRead="service"
        :serviceType="isEdit ? serviceTypeInput.selected : service.serviceType"
        :serviceInputs="
          serviceInputs[isOppositeUserType ? userStore.oppositeUserType : userStore.user?.userType][isEdit ? serviceTypeInput.selected : service.serviceType] ?? null
        "
        :isEdit="isEdit"
      />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useServiceStore } from "~~/store/service";
import { useUserStore } from "~~/store/user";

const { questionsBoilerplate } = getFormInfo();
const { changeSelected, phoneNumberStrToSelected } = useForm();
const { generateID, deepCopy } = useUtilities();

const props = defineProps<{
  service: Service;
  isReadOnly?: boolean;
  isAcceptedMatch?: boolean;
  isOppositeUserType?: boolean;
}>();

const emits = defineEmits<{
  (e: "acceptMatch", serviceID: string);
  (e: "denyMatch", serviceID: string);
}>();

const serviceStore = useServiceStore();
const userStore = useUserStore();

/* EDIT MODE */
const isEdit = ref(props.service?.serviceType || props.isReadOnly ? false : true);

const toggleIsEdit = () => {
  if (props.isReadOnly) isEdit.value = false;

  isEdit.value = !isEdit.value;
};

/* ACTIONS */
const confirmChanges = async () => {
  let service: Service;

  // Adding new service
  if (!props.service?.serviceType && serviceTypeInput.value.selected) {
    service = await $fetch<Service>(
      `/api/${userStore.user?.userType}/services/${serviceTypeInput.value.selected.toLowerCase()}Services/add${
        serviceTypeInput.value.selected
      }Service`,
      {
        method: "POST",
        body: deepCopy({
          ...Object.fromEntries(
            Object.entries(serviceInputs.value[userStore.user?.userType][serviceTypeInput.value?.selected]).map(
              ([key, value]) => [key, (value as Counter | ToggleInput)?.selected]
            )
          ),
        }),
      }
    );

    console.log(service);

    if (!service) return;
  }
  // Editing existing service
  else if (props.service.serviceType && serviceTypeInput.value.selected) {
    service = await $fetch<Service>(
      `/api/${userStore.user?.userType}/services/${props.service.serviceType.toLowerCase()}Services/edit${
        props.service.serviceType
      }Service`,
      {
        method: "PATCH",
        body: deepCopy({
          id: props.service?.id,
          serviceType: serviceTypeInput.value.selected,
          ...Object.fromEntries(
            Object.entries(serviceInputs.value[userStore.user?.userType][serviceTypeInput.value?.selected]).map(
              ([key, value]) => [key, (value as Counter | ToggleInput)?.selected]
            )
          ),
        }),
      }
    );

    console.log(service);

    if (!service) return;
  } else return;

  const index = serviceStore.services?.findIndex((curService) => curService?.id === props.service?.id);
  const key = props.service?.key ?? null;

  if (index !== -1) {
    serviceStore.services[index] = {
      ...service,
      key,
    };
  }

  toggleIsEdit();
};

const cancelChanges = () => {
  const index = serviceStore.services?.findIndex((curService) => curService?.id === props.service?.id);

  if (index !== -1 && !props.service?.serviceType) serviceStore.services.splice(index, 1);

  toggleIsEdit();
};

const deleteService = async () => {
  const deletedService = await $fetch<Service>(
    `/api/${userStore.user?.userType}/services/${props.service.serviceType?.toLowerCase()}Services/delete${
      props.service.serviceType
    }Service`,
    {
      method: "DELETE",
      body: deepCopy({
        id: props.service.id,
      }),
    }
  );

  console.log(deletedService);

  if (!deletedService) return;

  const index = serviceStore.services?.findIndex((curService) => curService?.id === deletedService?.id);

  if (index !== -1) serviceStore.services.splice(index, 1);
};

/* INPUTS */
// Service Type Input
// #region
const serviceTypeOptions: { id: string; text: string }[] = [
  { id: "serviceType-1", text: "Internet" },
  { id: "serviceType-2", text: "Lawn" },
  { id: "serviceType-3", text: "Insurance" },
  { id: "serviceType-4", text: "Morgage" },
  { id: "serviceType-5", text: "Interior" },
  { id: "serviceType-6", text: "Cell" },
];

const availableServiceTypeOptions = computed(() =>
  serviceTypeOptions.filter(
    (curOption) =>
      serviceStore.services?.every((curService) => curService?.serviceType !== curOption.text) ||
      props.service.serviceType === curOption.text
  )
);

const serviceTypeInput = ref<Select>({
  type: "select",
  id: "serviceType",
  title: "Service Type",
  required: true,
  selected: props.service?.serviceType ?? "",
  placeholder: "Select a service type",
  options: availableServiceTypeOptions.value,
  errors: [],
  warnings: [],
});

watchEffect(() => {
  serviceTypeInput.value.options = userStore.isCustomer ? availableServiceTypeOptions.value : serviceTypeOptions;
});
// #endregion

// Service Inputs
// #region
interface ServiceInputs {
  customer: Record<ServiceType, Record<string, FormInput>>;
  business: Record<ServiceType, Record<string, FormInput>>;
}

const serviceInputs = ref<ServiceInputs>({
  customer: {
    Internet: {
      costPerMonth: {
        type: "counter",
        id: "costPerMonth",
        title: "Cost per Month",
        required: true,
        selected: (props.service as CustomerInternet)?.costPerMonth ?? 0,
        min: 0,
        max: 1000,
        text: {
          left: "$",
          right: "per month",
        },
        errors: [],
        warnings: [],
      },
      speed: {
        type: "counter",
        id: "speed",
        title: "Internet Speed",
        required: true,
        selected: (props.service as CustomerInternet)?.speed ?? 0,
        min: 0,
        max: 1000,
        text: {
          left: "",
          right: "Mbps",
        },
        errors: [],
        warnings: [],
      },
      allowLessSpeed: {
        type: "toggle",
        id: "allowLessSpeed",
        title: "Allow Less Speed",
        required: false,
        selected: (props.service as CustomerInternet)?.allowLessSpeed ?? false,
        errors: [],
        warnings: [],
      },
    },
    Lawn: {
      lawnSize: {
        type: "counter",
        id: "size",
        title: "Lawn Size",
        required: true,
        selected: (props.service as CustomerLawn)?.lawnSize ?? 0,
        min: 0,
        max: 100000,
        text: {
          left: "",
          right: "ft sq",
        },
        errors: [],
        warnings: [],
      },
      costPerMonth: {
        type: "counter",
        id: "costPerMonth",
        title: "Cost per Month",
        required: true,
        selected: (props.service as CustomerLawn)?.costPerMonth ?? 0,
        min: 0,
        max: 1000,
        text: {
          left: "$",
          right: "per month",
        },
        errors: [],
        warnings: [],
      },
    },
    Insurance: {
      costPerMonth: {
        type: "counter",
        id: "costPerMonth",
        title: "Cost per Month",
        required: true,
        selected: (props.service as CustomerInsurance)?.costPerMonth ?? 0,
        min: 0,
        max: 1000,
        text: {
          left: "$",
          right: "per month",
        },
        errors: [],
        warnings: [],
      },
      sqFootage: {
        type: "counter",
        id: "sqFootage",
        title: "Square Footage",
        required: true,
        selected: (props.service as CustomerInsurance)?.sqFootage ?? 0,
        min: 0,
        max: 10000,
        text: {
          left: "",
          right: "ft sq",
        },
        errors: [],
        warnings: [],
      },
      totalCoverage: {
        type: "counter",
        id: "totalCoverage",
        title: "Total Coverage",
        required: true,
        selected: (props.service as CustomerInsurance)?.totalCoverage ?? 0,
        min: 0,
        max: 1000,
        text: {
          left: "",
          right: "",
        },
        errors: [],
        warnings: [],
      },
      allowLessCoverage: {
        type: "toggle",
        id: "allowLessCoverage",
        title: "Allow Less Coverage",
        required: false,
        selected: (props.service as CustomerInsurance)?.allowLessCoverage ?? false,
        errors: [],
        warnings: [],
      },
    },
    Morgage: {
      sqFootage: {
        type: "counter",
        id: "sqFootage",
        title: "Square Footage",
        required: true,
        selected: (props.service as CustomerMorgage)?.sqFootage ?? 0,
        min: 0,
        max: 10000,
        text: {
          left: "",
          right: "ft sq",
        },
        errors: [],
        warnings: [],
      },
      costPerMonth: {
        type: "counter",
        id: "costPerMonth",
        title: "Cost per Month",
        required: true,
        selected: (props.service as CustomerMorgage)?.costPerMonth ?? 0,
        min: 0,
        max: 1000,
        text: {
          left: "$",
          right: "per month",
        },
        errors: [],
        warnings: [],
      },
      insuranceRate: {
        type: "counter",
        id: "insuranceRate",
        title: "Insurance Rate",
        required: true,
        selected: (props.service as CustomerMorgage)?.insuranceRate ?? 0,
        min: 0,
        max: 10000,
        text: {
          left: "",
          right: "",
        },
        errors: [],
        warnings: [],
      },
    },
    Interior: {
      sqFootage: {
        type: "counter",
        id: "sqFootage",
        title: "Square Footage",
        required: true,
        selected: (props.service as CustomerInterior)?.sqFootage ?? 0,
        min: 0,
        max: 10000,
        text: {
          left: "",
          right: "ft sq",
        },
        errors: [],
        warnings: [],
      },
      costPerMonth: {
        type: "counter",
        id: "costPerMonth",
        title: "Cost per Month",
        required: true,
        selected: (props.service as CustomerInterior)?.costPerMonth ?? 0,
        min: 0,
        max: 1000,
        text: {
          left: "$",
          right: "per month",
        },
        errors: [],
        warnings: [],
      },
    },
    Cell: {
      GBPerMonth: {
        type: "counter",
        id: "GBPerMonth",
        title: "GB per Month",
        required: true,
        selected: (props.service as CustomerCell)?.GBPerMonth ?? 0,
        min: 0,
        max: 10000,
        text: {
          left: "",
          right: "GB per month",
        },
        errors: [],
        warnings: [],
      },
      costPerMonth: {
        type: "counter",
        id: "costPerMonth",
        title: "Cost per Month",
        required: true,
        selected: (props.service as CustomerCell)?.costPerMonth ?? 0,
        min: 0,
        max: 1000,
        text: {
          left: "$",
          right: "per month",
        },
        errors: [],
        warnings: [],
      },
      allowLessGB: {
        type: "toggle",
        id: "allowLessGB",
        title: "Allow Less GB",
        required: false,
        selected: (props.service as CustomerCell)?.allowLessGB ?? false,
        errors: [],
        warnings: [],
      },
    },
  },
  business: {
    Internet: {
      costPerMonth: {
        type: "counter",
        id: "costPerMonth",
        title: "Cost per Month",
        required: true,
        selected: (props.service as BusinessInternet)?.costPerMonth ?? 0,
        min: 0,
        max: 1000,
        text: {
          left: "$",
          right: "per month",
        },
        errors: [],
        warnings: [],
      },
      speed: {
        type: "counter",
        id: "speed",
        title: "Internet Speed",
        required: true,
        selected: (props.service as BusinessInternet)?.speed ?? 0,
        min: 0,
        max: 1000,
        text: {
          left: "",
          right: "Mbps",
        },
        errors: [],
        warnings: [],
      },
    },
    Lawn: {
      costPerSqFoot: {
        type: "counter",
        id: "costPerSqFoot",
        title: "Cost per Sq Foot",
        required: true,
        selected: (props.service as BusinessLawn)?.costPerSqFoot ?? 0,
        min: 0,
        max: 1000,
        text: {
          left: "$",
          right: "per sq foot",
        },
        errors: [],
        warnings: [],
      },
    },
    Insurance: {
      costPerSqFoot: {
        type: "counter",
        id: "costPerSqFoot",
        title: "Cost per Square Foot",
        required: true,
        selected: (props.service as BusinessInsurance)?.costPerSqFoot ?? 0,
        min: 0,
        max: 1000,
        text: {
          left: "$",
          right: "per sq ft",
        },
        errors: [],
        warnings: [],
      },
      totalCoverage: {
        type: "counter",
        id: "totalCoverage",
        title: "Total Coverage",
        required: true,
        selected: (props.service as BusinessInsurance)?.totalCoverage ?? 0,
        min: 0,
        max: 1000,
        text: {
          left: "",
          right: "",
        },
        errors: [],
        warnings: [],
      },
    },
    Morgage: {
      costPerSqFoot: {
        type: "counter",
        id: "costPerSqFoot",
        title: "Cost per Square Foot",
        required: true,
        selected: (props.service as BusinessMorgage)?.costPerSqFoot ?? 0,
        min: 0,
        max: 1000,
        text: {
          left: "$",
          right: "per sq ft",
        },
        errors: [],
        warnings: [],
      },
      insuranceRate: {
        type: "counter",
        id: "insuranceRate",
        title: "Insurance Rate",
        required: true,
        selected: (props.service as BusinessMorgage)?.insuranceRate ?? 0,
        min: 0,
        max: 10000,
        text: {
          left: "",
          right: "",
        },
        errors: [],
        warnings: [],
      },
    },
    Interior: {
      costPerSqFoot: {
        type: "counter",
        id: "costPerSqFoot",
        title: "Cost per Square Foot",
        required: true,
        selected: (props.service as BusinessInterior)?.costPerSqFoot ?? 0,
        min: 0,
        max: 1000,
        text: {
          left: "$",
          right: "per sq ft",
        },
        errors: [],
        warnings: [],
      },
    },
    Cell: {
      GBPerMonth: {
        type: "counter",
        id: "GBPerMonth",
        title: "GB per Month",
        required: true,
        selected: (props.service as BusinessCell)?.GBPerMonth ?? 0,
        min: 0,
        max: 10000,
        text: {
          left: "",
          right: "GB per month",
        },
        errors: [],
        warnings: [],
      },
      costPerMonth: {
        type: "counter",
        id: "costPerMonth",
        title: "Cost per Month",
        required: true,
        selected: (props.service as BusinessCell)?.costPerMonth ?? 0,
        min: 0,
        max: 1000,
        text: {
          left: "$",
          right: "per month",
        },
        errors: [],
        warnings: [],
      },
    },
  },
});
// #endregion
</script>
