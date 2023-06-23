<script setup lang="ts">
import { useField } from "vee-validate";
import { NInput } from "naive-ui";

interface Props {
  name: string;
  placeholder?: string;
  type?: "text" | "textarea" | "password";
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: "",
  type: "text",
});

const { errorMessage, value } = useField<string>(() => props.name);
</script>
<template>
  <div>
    <n-input
      v-model:value="value"
      size="large"
      :type="props.type"
      :placeholder="props.placeholder"
    />
    <span>{{ errorMessage }}</span>
  </div>
</template>
