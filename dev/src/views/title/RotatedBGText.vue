<template>
    <span class="rotate backgrounded rotated-text" :style="`transform: rotate(${tilt}deg);`"><slot></slot></span>
</template>
  
<script lang="ts">
import { PropType, defineComponent, computed, ref, onMounted } from 'vue';

export default defineComponent({
    name: 'RotatedBGText',
    props: {
        tilt: {
            type: Number,
            default: -3,
        }
    },
    setup() {
        onMounted(() => {
            
        });
        return {
            
        }
    }
});
</script>