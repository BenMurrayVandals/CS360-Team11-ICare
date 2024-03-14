<template>
  <Transition>
    <slot></slot>
  </Transition>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* USER LISTINGS */
.users-move,
.users-enter-active,
.users-leave-active {
  transition: all 0.3s ease;
}

.users-enter-active {
  /* Entering users will enter from underneath already existing users */
  z-index: 5;
}

.users-leave-active {
  /* Leaving users will exit underneath any existing or entering users */
  z-index: 0;
  /* Ensures that leaving users are taken out of layout flow so that moving animations can be calculated correctly.  */
  position: absolute;
}

.users-enter-from,
.users-leave-to {
  opacity: 0;
  /* users will enter going down and will leave going up */
  transform: translateY(-25%);
}

/* ALERTS */
.alerts-fade-enter-active,
.alerts-fade-leave-active,
.alert-move,
.alert-enter-active,
.alert-leave-active {
  transition: all 0.3s ease;
}

.alerts-fade-enter-from,
.alerts-fade-leave-to {
  opacity: 0;
}

.alert-enter-from,
.alert-leave-to {
  opacity: 0;
  /* Alerts will enter going down and will leave going up */
  transform: translateY(-25%);
}

.alert-leave-active {
  position: absolute;
}
</style>
