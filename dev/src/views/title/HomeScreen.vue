<template>
  <h1>AMI ST GALLEN</h1>
  <RouterView />
</template>

<script lang='ts'>
	import '@/assets/base.css'

	import { onMounted } from 'vue'
	import { useRouter } from 'vue-router'

	export default{
		setup(){
			const router = useRouter()

			onMounted(() => {
				
			})

			return{
				router
			}
		}
	}
</script>