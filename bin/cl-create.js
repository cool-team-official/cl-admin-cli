#!/usr/bin/env node

const program = require("commander");
const fs = require("fs");
const ora = require("ora");
const chalk = require("chalk");

program.usage("Create module").parse(process.argv);

// 模块名称
const [name] = program.args;

if (!name) {
	console.log(chalk.red("Module name is null!"));
	process.exit(0);
}

// 模块地址
const modulePath = `${process.cwd()}/src/cool/modules/${name}`;

// 文件内容
const FILE_TEXT = {
	common: `export default {};`,
	pages: `export default [];`,
	views: `export default [];`,
	index: `import components from "./components";
import directives from "./directives";
import filters from "./filters";
import pages from "./pages";
import service from "./service";
import store from "./store";
import views from "./views";

export default {
    components,
    directives,
    filters,
    pages,
    service,
    store,
    views
};
`
};

async function start() {
	const spinner = ora().start();

	spinner.color = "green";

	const files = [
		"components",
		"directives",
		"filters",
		"pages",
		"service",
		"static",
		"store",
		"views"
	];

	fs.mkdirSync(modulePath);

	files.forEach((e) => {
		fs.mkdirSync(`${modulePath}/${e}`);

		let key = null;

		if (e !== "static") {
			if (["pages", "views"].includes(e)) {
				key = e;
			} else {
				key = "common";
			}

			fs.writeFileSync(`${modulePath}/${e}/index.js`, FILE_TEXT[key]);
		}
	});

	fs.writeFileSync(`${modulePath}/index.js`, FILE_TEXT.index);

	spinner.stop();

	console.log(chalk.green(`${name} created successfully!`));
}

fs.stat(modulePath, (error, status) => {
	if (status) {
		console.log(chalk.red(`${name} is exist!`));
		process.exit(0);
	} else {
		start();
	}
});
