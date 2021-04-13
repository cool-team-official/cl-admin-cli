// 参考官方例子 https://cn.vuejs.org/v2/guide/custom-directive.html

export default {
	// 聚焦元素
	focus: {
		inserted: function(el) {
			el.focus();
		}
	}
};

// 在模块中使用
// <input v-focus />
