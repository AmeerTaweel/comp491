import { env } from '$env/dynamic/private';
import fs from 'node:fs';
import { finished } from 'node:stream/promises';
import { error } from '@sveltejs/kit';
import { parse as parse_csv } from 'csv-parse';

export async function load() {
	const logs_dir = env.LOGS_DIR.replace(/\/$/g, '');

	// Read logfiles that contain detected communication/remote memory operations
	let filenames = undefined;
	try {
		filenames = fs.readdirSync(logs_dir).filter((filename) => filename.match(/^snoopie_log_\d+$/));
	} catch (err) {
		console.log(err);
		return error(404, { message: `Logs directory ${logs_dir} not found.` });
	}

	let objects      = {}
	let code_lines   = {}
	let instructions = {}
	let devices      = new Set()
	for (const filename of filenames) {
		const parser = fs.createReadStream(`${logs_dir}/${filename}`)
			.pipe(parse_csv({ delimiter: ',', columns: true }))

		parser.on('data', (row) => {
			// Get source and target device
			const source_device = parseInt(row.running_dev_id);
			const target_device = parseInt(row.mem_dev_id);
			const instruction   = row.op_code;
			const code_line     = parseInt(row.code_linenum);
			const object        = row.obj_offset;

			devices.add(source_device)

			if (!(source_device in objects)){
				objects[source_device] = {}
			}
			if (!(`${object},${target_device}` in objects[source_device])) {
				objects[source_device][`${object},${target_device}`] = 0
			}
			objects[source_device][`${object},${target_device}`]++
			if (!(source_device in code_lines)){
				code_lines[source_device] = {}
			}
			if (!(`${code_line},${target_device}` in code_lines[source_device])) {
				code_lines[source_device][`${code_line},${target_device}`] = 0
			}
			code_lines[source_device][`${code_line},${target_device}`]++
			if (!(source_device in instructions)){
				instructions[source_device] = {}
			}
			if (!(`${instruction},${target_device}` in instructions[source_device])) {
				instructions[source_device][`${instruction},${target_device}`] = 0
			}
			instructions[source_device][`${instruction},${target_device}`]++
		});

		await finished(parser)
	}

	function restructure(dict) {
		let new_dict = {}
		for (const device of Object.keys(dict)) {
			new_dict[device] = []
			for (const [k, v] of Object.entries(dict[device])) {
				const [id, target] = k.split(",")
				new_dict[device].push({id, target, count: v})
			}
		}
		return new_dict
	}

	objects = restructure(objects)
	code_lines = restructure(code_lines)
	instructions = restructure(instructions)

	return { logs_dir, objects, code_lines, instructions, devices: [...devices] };
}
