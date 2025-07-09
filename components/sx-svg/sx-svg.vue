<template>
	<!-- #ifdef MP -->
	<view class="sx-svg" :style="style" @click="$emit('click')" />
	<!-- #endif -->
	<!-- #ifndef MP -->
	<view class="sx-svg" v-html="svgHtml" :style="style" @click="$emit('click')" />
	<!-- #endif -->
</template>

<script>
const SVG_FILE_PATH = '/static/svg';

export default {
	name: 'sx-svg',
	options: {
		virtualHost: true
	},
	props: {
		name: {
			type: String,
			default: '',
			required: true
		},
		color: {
			type: String,
			default: '',
		},
		gradient: {
		  type: Array, // ['#ff00cc', '#3333ff']
		  default: () => []
		},
		gradientType: {
		  type: String,
		  default: 'linear', // 'linear' 或 'radial'
		},
		gradientDirection: {
		  type: [Object, String],
		  default: 'to right', // 默认左到右
		},
		size: {
			type: [Number, String, Array],
			default: ''
		},
		width: {
			type: [String, Number],
			default: 40
		},
		height: {
			type: [String, Number],
			default: 40
		},
		unit: {
			type: String,
			default: 'rpx'
		},
		watch: {
			type: Boolean,
			default: process.env.NODE_ENV === 'development'
		},
	},
	data() {
		return {
			svgHtml: '',
			gradientId: `gradient-${Math.random().toString(36).slice(2, 8)}`
		};
	},
	computed: {
		style() {
			const { size, unit, svgHtml } = this;
			let { width, height } = this;
			if (size) {
				if (Object.prototype.toString.call(size) === '[object Array]') {
					[width = width, height = height] = size;
				} else {
					[width, height] = [size, size];
				}
			}
			let res = `width:${width}${unit};height:${height}${unit};`;
			// #ifdef MP
			res += `background-image:url("data:image/svg+xml,${encodeURIComponent(svgHtml)}");`;
			// #endif
			return res;
		},
	},
	created() {
		this.getSvgHtml();
		
		if (this.watch) {
			this.$watch('$props', () => this.getSvgHtml(), { deep: true })
		}
	},
	methods: {
		async getSvgHtml() {
			const ctx = await this.fileReader(this.name);
			const regex = /<svg[\s\S]*?<\/svg>/i;
			let [html] = ctx.match(regex);
			this.svgHtml = this.setSvgColor(html);
		},
		fileReader(name) {
			const path = `${SVG_FILE_PATH}/${name}.svg`;
			return new Promise((resolve, reject) => {
				// #ifdef APP-PLUS
				plus.io.resolveLocalFileSystemURL(
					`_www/${path}`,
					entry => entry.file((file) => {
						const fileReader = new plus.io.FileReader();
						fileReader.onloadend = (evt) => resolve(evt.target.result);
						fileReader.onerror = (error) => reject(error);
						fileReader.readAsText(file, 'utf-8');
					}),
					error => reject(error)
				);
				// #endif

				// #ifdef MP
				const fs = uni.getFileSystemManager();
				fs.readFile({
					filePath: path,
					encoding: 'binary',
					success: (res) => resolve(res.data),
					fail: reject,
				});
				// #endif
 
				// #ifndef APP-PLUS  || MP
				fetch(path)
					.then(res => res.text())
					.then(ctx => resolve(ctx))
					.catch(err => reject(err))
				// #endif
			})
		},
		isCustomDirection(obj) {
			return (obj && typeof obj === 'object' && ['x1', 'y1', 'x2', 'y2'].every(key => key in obj));
		},
		getGradientDirectionAttr(direction) {
			if (this.isCustomDirection(direction)) {
				return direction
			}
		  switch (direction) {
				// 向右
		    case 'to right':
				case 'tr':
					return { x1: '0%', y1: '0%', x2: '100%', y2: '0%' }
				// 向左
		    case 'to left':
				case 'tl':
					return { x1: '100%', y1: '0%', x2: '0%', y2: '0%' }
				// 向下
		    case 'to bottom':
				case 'tb':
					return { x1: '0%', y1: '0%', x2: '0%', y2: '100%' }
				// 向上
		    case 'to top':
				case 'tt':
					return { x1: '0%', y1: '100%', x2: '0%', y2: '0%' }
				// 向右下角
		    case 'to bottom right':
		    case 'tbr':
					return { x1: '0%', y1: '0%', x2: '100%', y2: '100%' }
				// 向左下角
				case 'to bottom left':
				case 'tbl':
					return { x1: '100%', y1: '0%', x2: '0%', y2: '100%' }
				// 向右上角
				case 'to top right':
				case 'ttr':
					return { x1: '0%', y1: '100%', x2: '100%', y2: '0%' }
				// 向左上角
		    case 'to top left':
		    case 'ttl':
					return { x1: '100%', y1: '100%', x2: '0%', y2: '0%' }
		    // 默认向右
		    default:
					return { x1: '0%', y1: '0%', x2: '100%', y2: '0%' }
		  }
		},
		
		setSvgColor(html) {
      // 处理CSS变量颜色值
      let colorValue = this.color;
      if (colorValue && colorValue.startsWith('var(')) {
        const varName = colorValue.match(/var\(([^)]+)\)/)[1];
        colorValue = getComputedStyle(document.documentElement).getPropertyValue(varName).trim() || colorValue;
      }

      if (this.gradient && this.gradient.length > 1) {
        const gradientId = this.gradientId

        // 渐变方向（只对 linear 有效）
        const { x1, y1, x2, y2 } = this.getGradientDirectionAttr(this.gradientDirection)

        const gradientDef = 
          this.gradientType === 'radial'
            ? `
          <defs>
            <radialGradient id="${gradientId}" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              ${this.gradient.map((color, index) => {
                const offset = (index / (this.gradient.length - 1)) * 100
                return `<stop offset="${offset}%" stop-color="${color}" />`
              }).join('')}
            </radialGradient>
          </defs>
          `
            : `
          <defs>
            <linearGradient id="${gradientId}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">
		          ${this.gradient.map((color, index) => {
		            const offset = (index / (this.gradient.length - 1)) * 100
		            return `<stop offset="${offset}%" stop-color="${color}" />`
		          }).join('')}
		        </linearGradient>
		      </defs>
		      `
		    // 插入 defs
		    html = html.replace(/<svg([^>]*)>/i, `<svg$1>${gradientDef}`)
		
		    // 替换 fill/stroke 为渐变引用
		    html = html.replace(/(fill|stroke)="(?!none)[^"]*"/g, `$1="url(#${gradientId})"`)
		
		    return html
		  }
		
		  // 普通颜色
		  if (!this.color) {
		    return html
		  }
			
		  return html.replace(/(fill|stroke)="(?!none)[^"]*"/g, (match, attr) => {
		    // attr 是 "fill" 或 "stroke"
		    return `${attr}="${colorValue}"`
        })
		}
	},
}
</script>

<style>
::v-deep svg {
	width: 100% !important;
	height: 100% !important;
}

/* #ifdef MP */
.sx-svg {
	background-repeat: no-repeat;
	background-size: contain;
}
/* #endif */
</style>