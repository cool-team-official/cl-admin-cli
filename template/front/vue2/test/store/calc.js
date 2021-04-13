// 参考官方例子 https://vuex.vuejs.org/zh/guide/

export default {
	state: {
		count: 0
	},
	mutations: {
		increment(state) {
			state.count++;
		}
	},
	actions: {}
};
