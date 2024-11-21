<template>
	<div class="main-center-vertically" style="background-color: var(--orange)">
		<h1 class="title-text"><RotatedBGText>Art</RotatedBGText>iculate</h1>
		<button class="button white-button" @click="router.push('/game')">Play</button>
	</div>
</template>

<script lang='ts'>
	import '@/assets/base.css'

	import { PropType, defineComponent, computed, ref, onMounted } from 'vue';
	import { useRouter } from 'vue-router'
	import RotatedBGText from './RotatedBGText.vue';

	export default defineComponent({
		name: 'Home',
		components: {
			RotatedBGText
		},
		props:{

		},
		setup(){
			const router = useRouter();

			return{
				router, RotatedBGText
			}
		}
});
</script>