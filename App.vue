<script>
import { useI18n } from '@/composables/useI18n.js'
import { useTheme } from '@/composables/useTheme.js'
import { useSound } from '@/composables/useSound.js'

const { initTheme } = useTheme()
const {initLocale}  = useI18n()
const { initializeSound } = useSound()

export default {
	async onLaunch() {
		console.log('App Launch - Starting system initialization')
		
		try {
      initTheme()
      initLocale()

			// 并行初始化所有系统（语言系统初始化已包含预加载）
			await Promise.all([
				initializeSound()
			])

			console.log('App launch completed - All systems initialized successfully')
		} catch (error) {
			console.error('Failed to initialize app systems:', error)
		}
	},
	async onShow() {
		console.log('App Show')
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
