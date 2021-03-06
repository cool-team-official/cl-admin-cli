#!/usr/bin/env node

const program = require("commander");
const pkg = require("../package.json");

// 检查 Node 版本
if (Number.parseFloat(process.versions.node) < 8) {
	message.error(
		`You are using Node ${process.versions.node}, but this version requires Node 11 or higher\nPlease upgrade your Node version.`
	);
	process.exit(1);
}

program
	.version(pkg.version, "-V, --version", "output the current version")
	.command("create <name>", "创建模块", { isDefault: true })
	.command("server <name>", "创建微服务", { isDefault: true })
	.parse(process.argv);

if (program.debug) console.log(program.opts());
if (program.pizzaType) console.log(`- ${program.pizzaType}`);
