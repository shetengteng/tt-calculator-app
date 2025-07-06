<script>
import { useI18n } from '@/composables/useI18n.js'
import { useTheme } from '@/composables/useTheme.js'
import { useSound } from '@/composables/useSound.js'

export default {
	async onLaunch() {
		console.log('App Launch')
	},
	async onShow() {
		console.log('App Show - Refreshing all caches')
		
		try {
			// 使用组合函数获取刷新方法
			const { initializeLanguageSystem } = useI18n()
			const { initializeThemeSystem, applyTheme } = useTheme()
			const { initializeSound } = useSound()
			
			// 并行刷新所有缓存（语言系统初始化已包含预加载）
			await Promise.all([
				initializeLanguageSystem(), // 现在已经包含了预加载所有语言文件
				initializeThemeSystem(),
				initializeSound()
			])
			
			// 重新应用主题
			applyTheme()
			
			console.log('All caches refreshed and languages preloaded successfully')
		} catch (error) {
			console.error('Failed to refresh caches on app show:', error)
		}
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
