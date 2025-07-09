<script>
import { useI18n } from '@/composables/useI18n.js'
import { useTheme } from '@/composables/useTheme.js'
import { useSound } from '@/composables/useSound.js'

let isInitialized = false  // 全局初始化标记

export default {
	async onLaunch() {
		console.log('App Launch - Starting system initialization')
		
		try {
			// 使用组合函数获取初始化方法
			const { initTheme } = useTheme()
			const { initializeLanguageSystem } = useI18n()
			const { initializeSound } = useSound()
      initTheme()

			// 并行初始化所有系统（语言系统初始化已包含预加载）
			await Promise.all([
				initializeLanguageSystem(), // 现在已经包含了预加载所有语言文件
				initializeSound()
			])


			isInitialized = true
			console.log('App launch completed - All systems initialized successfully')
		} catch (error) {
			console.error('Failed to initialize app systems:', error)
		}
	},
	async onShow() {
		console.log('App Show')
		
		// // 如果还没有初始化，等待一下再检查
		// if (!isInitialized) {
		// 	console.log('App Show - Waiting for initialization to complete')
		// 	// 等待最多3秒，如果还没初始化完成，就强制初始化
		// 	for (let i = 0; i < 30; i++) {
		// 		await new Promise(resolve => setTimeout(resolve, 100))
		// 		if (isInitialized) break
		// 	}
		//
		// 	// 如果还是没有初始化，执行一次初始化
		// 	if (!isInitialized) {
		// 		console.log('App Show - Forcing initialization')
		// 		try {
		// 			// 使用组合函数获取初始化方法
		// 			const { initializeLanguageSystem } = useI18n()
		// 			const { initializeThemeSystem, applyTheme } = useTheme()
		// 			const { initializeSound } = useSound()
		//
		// 			// 并行初始化所有系统
		// 			await Promise.all([
		// 				initializeLanguageSystem(),
		// 				initializeThemeSystem(),
		// 				initializeSound()
		// 			])
		//
		// 			// 重新应用主题
		// 			await applyTheme()
		//
		// 			isInitialized = true
		// 			console.log('Forced initialization completed')
		// 		} catch (error) {
		// 			console.error('Failed to force initialize:', error)
		// 		}
		// 	}
		// }
	},
	onHide() {
		console.log('App Hide')
	}
}
</script>

<style lang="scss">
	@import '@/styles/index.scss';
	/* 
	 * 全局样式现在通过 uni.scss 统一管理
	 * 这里只保留 App 级别特有的样式
	 */
</style>
