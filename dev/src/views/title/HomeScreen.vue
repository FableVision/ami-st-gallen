<template>
	<div class="main-center-vertically" style="background-color: var(--orange)">
		<h1 class="title-text"><RotatedBGText>Art</RotatedBGText>iculate</h1>
		<p style="font-size: 20pt; margin: 20px 100px; text-align: center;">So geht's: Das Ziel ist es, in der von euch definierten Zeit so viele Gemälde wie möglich zu beschreiben und zu erraten. 
			Aber Achtung! Die Wörter links vom Bild dürfen in eurer Beschreibung nicht vorkommen.</p>
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