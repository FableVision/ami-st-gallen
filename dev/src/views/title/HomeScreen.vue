<template>
	<div class="main-center-vertically" style="background-color: var(--orange); gap: .5rem;">
		<h1 style="font-size: 26pt; margin-top: 1rem;" class="title-text"><RotatedBGText>Art</RotatedBGText>icolare</h1>
		<p style="font-size: 14pt; margin: 20px 100px; text-align: center;">Ecco come funziona: l’obiettivo è descrivere e indovinare il maggior numero possibile di opere d'arte nel tempo stabilito da voi.
Attenzione! Le parole a sinistra dell’immagine non possono essere usate nella descrizione.</p>
		<button class="button white-button" @click="router.push('/game')">Inizia a giocare</button>
		<div class="title-image-container">
			<img style="user-select: none; pointer-events: none;" draggable="false" src="@/assets/png/LACedu_nero_22.png">
			<img style="user-select: none; pointer-events: none;" draggable="false" src="@/assets/png/MASILugano-Logo-eps-nero.png">
		</div>
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

			onMounted(()=>{
				document.body.style.backgroundColor = 'var(--orange)';
			});

			return{
				router, RotatedBGText
			}
		}
});
</script>