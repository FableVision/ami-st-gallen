<template>
	<RouterView />
	<div class="preload-images">
		<img src="@/assets/jpg/1.jpg" />
		<img src="@/assets/jpg/2.jpg" />
		<img src="@/assets/jpg/5.jpg" />
		<img src="@/assets/jpg/6.jpg" />
		<img src="@/assets/jpg/8.jpg" />
		<img src="@/assets/jpg/9.jpg" />
		<img src="@/assets/jpg/10.jpg" />
		<img src="@/assets/jpg/11.jpg" />
		<img src="@/assets/jpg/12.jpg" />
		<img src="@/assets/jpg/15.jpg" />
		<img src="@/assets/jpg/16.jpg" />
		<img src="@/assets/jpg/17.jpg" />
		<img src="@/assets/jpg/18.jpg" />
		<img src="@/assets/jpg/19.jpg" />
		<img src="@/assets/jpg/20.jpg" />
		<img src="@/assets/jpg/21.jpg" />
		<img src="@/assets/jpg/22.jpg" />
		<img src="@/assets/jpg/23.jpg" />
		<img src="@/assets/jpg/24.jpg" />
		<img src="@/assets/jpg/25.jpg" />
		<img src="@/assets/jpg/26.jpg" />
		<img src="@/assets/jpg/27.jpg" />
		<img src="@/assets/jpg/28.jpg" />
		<img src="@/assets/jpg/29.jpg" />
		<img src="@/assets/jpg/30.jpg" />
		<img src="@/assets/jpg/31.jpg" />
		<img src="@/assets/jpg/32.jpg" />
		<img src="@/assets/jpg/33.jpg" />
		<img src="@/assets/jpg/34.jpg" />
		<img src="@/assets/jpg/35.jpg" />
	</div>
</template>

<script lang="ts">
	import { ref, onMounted, computed } from 'vue';
	import { useRoute, useRouter } from 'vue-router';

	const appDiv = ref<HTMLElement | null>(null);
	const appBody = ref<HTMLElement | null>(null);
	import '@/assets/base.css';

	export default {
        setup() {
			const router = useRouter()
			const route = useRoute()
			const assetImport = import.meta.glob("./assets/**/*"); // Force imports everything in the assets folder

			return {
                router
            }
		}
	}
</script>