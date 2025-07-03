<script setup>
// 在uni-app中，App级别的生命周期钩子直接使用，无需导入
onLaunch(() => {
	console.log('App Launch')
})

onShow(() => {
	console.log('App Show')
})

onHide(() => {
	console.log('App Hide')
})
</script>

<style>
	/* Import calculator icons */
	@import './static/calculator-icons.css';
	
	/*每个页面公共css */
	/* Global styles */
	page {
		background-color: #2C2C2E;
		font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, sans-serif;
		height: 100%;
		overflow: hidden;
	}
	
	/* 防止页面滚动 */
	uni-page-body,
	uni-page-wrapper {
		height: 100%;
		overflow: hidden;
	}
	
	.safe-area-inset-bottom {
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
	}
	
	.safe-area-inset-top {
		padding-top: constant(safe-area-inset-top);
		padding-top: env(safe-area-inset-top);
	}
	
	/* Button press animation */
	.button-press {
		transform: scale(0.95);
		transition: transform 0.1s ease-out;
		border-radius: 40%;
	}
</style>
