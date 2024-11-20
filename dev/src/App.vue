<template>
	<RouterView />
</template>

<script lang="ts">
	import { ref, onMounted, computed } from 'vue';
	import { useRoute, useRouter } from 'vue-router';

	const appDiv = ref<HTMLElement | null>(null);
	const appBody = ref<HTMLElement | null>(null);

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