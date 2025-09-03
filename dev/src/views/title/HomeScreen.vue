<template>
	<div class="main-center-vertically" style="background-color: var(--orange);">
		<h1 class="title-text"><RotatedBGText>Art</RotatedBGText>icolare</h1>
		<p style="font-size: 20pt; margin: 20px 100px; text-align: center;">S"Ecco come funziona: l’obiettivo è descrivere e indovinare il maggior numero possibile di opere d'arte nel tempo stabilito da voi.
Attenzione! Le parole alla sinistra dell’immagine non possono essere usate nella descrizione."</p>
		<button class="button white-button" @click="router.push('/game')">Inizia a giocare</button>
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