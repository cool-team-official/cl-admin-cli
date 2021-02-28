#!/usr/bin/env node

const program = require("commander");
const fs = require("fs");
const ora = require("ora");
const childProcess = require("child_process");
const chalk = require("chalk");

// 模块路径
const modulePath = `${process.cwd()}/cool/modules`;

// 约定文件
const files = fs.readdirSync(modulePath);

program.usage("Install dependencies").parse(process.argv);

// 指定名称安装
const names = program.args;

async function start() {
	const spinner = ora().start();

	spinner.color = "green";

	for (let i = 0; i < files.length; i++) {
		let name = files[i];

		if (names.length > 0 && !names.includes(name)) {
			continue;
		}

		let next = () => {
			return new Promise((resolve, reject) => {
				spinner.text = `${name} install...`;

				childProcess.exec(`cd ${modulePath}/${name}/ && yarn`, function (error) {
					if (error) {
						console.error(error);
						reject(error);
					} else {
						resolve();
					}
				});
			});
		};

		await next();
	}

	spinner.stop();

	console.log(chalk.green("Installed successfully!"));
}

start();
