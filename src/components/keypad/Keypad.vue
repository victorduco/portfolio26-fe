<template>
  <!-- Oct 12 disbled minimal keypad markup -->
  <div>
    <div>unlock code</div>
    <div>{{ enteredDigits.join("") }}</div>
    <div v-if="status === 'fail'">wrong code</div>
  </div>
</template>

<script setup>
// Oct 12 disbled simplified keypad logic
import { onBeforeUnmount, onMounted, ref } from "vue"; // Oct 12 disbled
import { useMeta } from "../../composables/useMeta.js"; // Oct 12 disbled

useMeta("keypad"); // Oct 12 disbled

const emit = defineEmits(["unlock"]); // Oct 12 disbled
const enteredDigits = ref([]); // Oct 12 disbled
const status = ref("idle"); // Oct 12 disbled
const CODE = "8651"; // Oct 12 disbled

const isEditableTarget = (target) => { // Oct 12 disbled
  if (!target) return false;
  const editable = target.closest?.("input, textarea, select, [contenteditable='true']");
  return Boolean(editable || target.isContentEditable);
};

function resetDigits() { // Oct 12 disbled
  enteredDigits.value = [];
}

function handleSuccess() { // Oct 12 disbled
  status.value = "success";
  emit("unlock");
}

function handleFailure() { // Oct 12 disbled
  status.value = "fail";
  resetDigits();
}

function handleButtonClick(value) { // Oct 12 disbled
  if (status.value === "fail") {
    status.value = "idle";
  }

  if (enteredDigits.value.length >= CODE.length) return;

  enteredDigits.value.push(String(value));

  if (enteredDigits.value.length === CODE.length) {
    const code = enteredDigits.value.join("");
    if (code === CODE) {
      handleSuccess();
    } else {
      handleFailure();
    }
  }
}

function handleBackspace() { // Oct 12 disbled
  if (enteredDigits.value.length === 0) return;
  enteredDigits.value = enteredDigits.value.slice(0, -1);
  if (status.value === "fail") {
    status.value = "idle";
  }
}

function handleKeyDown(event) { // Oct 12 disbled
  if (
    event.defaultPrevented ||
    event.metaKey ||
    event.ctrlKey ||
    event.altKey ||
    event.shiftKey ||
    event.repeat
  ) {
    return;
  }

  if (isEditableTarget(event.target)) return;

  if (event.key === "Backspace") {
    event.preventDefault();
    handleBackspace();
    return;
  }

  if (/^\d$/.test(event.key)) {
    event.preventDefault();
    handleButtonClick(event.key);
  }
}

onMounted(() => { // Oct 12 disbled
  if (typeof window !== "undefined") {
    window.addEventListener("keydown", handleKeyDown);
  }
});

onBeforeUnmount(() => { // Oct 12 disbled
  if (typeof window !== "undefined") {
    window.removeEventListener("keydown", handleKeyDown);
  }
});
</script>

<style scoped>
/* Oct 12 disbled original keypad styles removed */
</style>
