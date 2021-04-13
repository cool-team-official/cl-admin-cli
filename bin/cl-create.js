#!/usr/bin/env node

const program = require("commander");
const fs = require("fs");
const path = require("path");
const ora = require("ora");
const chalk = require("chalk");
const inquirer = require("inquirer");
const { copy } = require("../utils");

program.usage("Create module").parse(process.argv);

// 模块名称
const [name] = program.args;

// 根路径
const rootPath = process.cwd();

// 模块路径
const modulePath = path.join(rootPath, "src/cool/modules", name);

// vue 版本
let version = "";

// 用户选择
function start() {
	const choices = [
		{
			name: "自定义组件",
			value: "components",
			checked: true
		},
		{
			name: "自定义指令",
			value: "directives",
			checked: true
		},
		{
			name: "过滤器",
			value: "filters",
			checked: true
		},
		{
			name: "请求服务",
			value: "service",
			checked: true
		},
		{
			name: "vuex 缓存",
			value: "store",
			checked: true
		},
		{
			name: "页面路由",
			value: "pages",
			checked: true
		},
		{
			name: "视图路由",
			value: "views",
			checked: true
		}
	].filter((e) => {
		if (version === "vue3-ts-vite") {
			return e.value !== "filters";
		} else {
			return true;
		}
	});

	inquirer
		.prompt([
			{
				type: "checkbox",
				name: "funs",
				message: "选择模块要包含的功能，默认全部",
				choices,
				pageSize: 8
			}
		])
		.then((res) => {
			if (res.funs.length === 0) {
				console.log(chalk.yellowBright("至少选择一个功能！"));
				process.exit(0);
			} else {
				create(res);
			}
		})
		.catch((err) => {
			console.log(chalk.redBright("Error"));
			process.exit(0);
		});
}

// 创建文件
async function create({ funs }) {
	function next(platform) {
		const spinner = ora().start();

		spinner.color = "green";

		// 创建模块目录
		fs.mkdirSync(modulePath);

		// 导出模块
		let mod = [];
		// 文本内容
		let text = "";

		// 复制文件
		funs.filter((n) => {
			if (platform == "vue3-ts-vite") {
				return n !== "filters";
			}

			return true;
		}).forEach((n) => {
			// 创建目录
			fs.mkdirSync(`${modulePath}/${n}`);

			// 复制文件
			copy(
				path.join(
					__dirname,
					`../template/front/${platform}/${name === "test" ? "test" : "base"}/${n}`
				),
				`${modulePath}/${n}`
			);

			// 添加内容
			text += `import ${n} from "./${n}";\n`;

			// 添加导出数据
			mod.push(`	${n}`);
		});

		text += `\nexport default {
${mod.join(",\n")}
};
`;

		// 创建入口文件
		fs.writeFileSync(`${modulePath}/index.${platform == "vue2" ? "js" : "ts"}`, text);

		spinner.stop();

		console.log(chalk.green(`模块 ${name} 创建成功`));
	}

	fs.stat(`${rootPath}/vue.config.js`, (err, status) => {
		if (status) {
			next("vue2");
		} else {
			fs.stat(`${rootPath}/vite.config.ts`, (err, status) => {
				if (status) {
					next("vue3-ts-vite");
				} else {
					console.log("不是一个有效的 cool-admin 项目！");
				}
			});
		}
	});
}

// 启动验证
fs.stat(`${rootPath}/src`, (error, status) => {
	if (!status) {
		console.log(chalk.redBright("请在 cool-admin 项目下执行！"));
		process.exit(0);
	} else {
		if (!name) {
			console.log(chalk.redBright("模块名不能为空！"));
			process.exit(0);
		} else {
			fs.stat(modulePath, (error, status) => {
				if (status) {
					console.log(chalk.redBright(`${name} 模块已存在！`));
					process.exit(0);
				} else {
					function next() {
						if (name === "test") {
							create({
								funs: [
									"components",
									"directives",
									"filters",
									"pages",
									"service",
									"store",
									"views"
								]
							});
						} else {
							start();
						}
					}

					// 判断项目类型
					fs.stat(`${rootPath}/vue.config.js`, (err, status) => {
						if (status) {
							version = "vue2";
							next();
						} else {
							fs.stat(`${rootPath}/vite.config.ts`, (err, status) => {
								if (status) {
									version = "vue3-ts-vite";
									next();
								} else {
									console.log("不是一个有效的 cool-admin 项目！");
								}
							});
						}
					});
				}
			});
		}
	}
});
