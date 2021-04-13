// 参考官方例子 https://cn.vuejs.org/v2/guide/filters.html

export default {
	// 首字母大写
	capitalize: function(value) {
		if (!value) return "";
		value = value.toString();
		return value.charAt(0).toUpperCase() + value.slice(1);
	}
};

// 在双花括号中
// {{ message | capitalize }}

// 在 `v-bind` 中
// <div v-bind:id="rawId | formatId"></div>
