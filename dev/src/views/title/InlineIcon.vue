<template>
    <span class="icon-parent" :style="`width: ${size}px;`"><img class="inline-img" :style="`height: ${size}px; width: ${size}px;`" :src="imageUrl"></span>
</template>
  
<script lang="ts">
import { PropType, defineComponent, computed, ref, onMounted } from 'vue';

export default defineComponent({
    name: 'RotatedBGText',
    props: {
        imgurl: {
            type: String,
            default: 'home',
        },
        size: {
            type: Number,
            default: 25
        }
    },
    setup(props) {
        const imageUrl = computed(()=>{
            return 'src/assets/png/' + props.imgurl + '.png';
        });
        
        return {
            imageUrl
        }
    }
});
</script>