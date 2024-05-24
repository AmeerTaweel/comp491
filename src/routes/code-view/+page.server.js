import { env } from '$env/dynamic/private';
import fs from 'node:fs';
import { finished } from 'node:stream/promises';
import { error } from '@sveltejs/kit';
import { parse as parse_csv } from 'csv-parse';

export async function load() {
	const logs_dir = env.LOGS_DIR.replace(/\/$/g, '');

	let filenames = undefined;
	try {
		filenames = fs.readdirSync(logs_dir).filter((filename) => filename.match(/^codeline_log_\d+.txt$/));
	} catch (err) {
		console.log(err);
		return error(404, { message: `Logs directory ${logs_dir} not found.` });
	}

	// Parse logfiles and buid code line data
	let code_lines = {};
	let files = {}
	for (const filename of filenames) {
		const parser = fs.createReadStream(`${logs_dir}/${filename}`)
			.pipe(parse_csv({ delimiter: ',', columns: true }))

		parser.on('data', (row) => {
			const idx  = parseInt(row.code_line_index);
			const num  = parseInt(row.code_linenum);
			const dir  = row.dir_path;
			const file = row.file

			if (file.trim() === "") return

			code_lines[idx] = {idx, num, dir, file}

			if (!(file in files)) {
				files[file] = fs.readFileSync(`${logs_dir}/${file}`).toString()
			}
		});

		await finished(parser)
	}

	// Read logfiles that contain detected communication/remote memory operations
	filenames = undefined;
	try {
		filenames = fs.readdirSync(logs_dir).filter((filename) => filename.match(/^snoopie_log_\d+$/));
	} catch (err) {
		console.log(err);
		return error(404, { message: `Logs directory ${logs_dir} not found.` });
	}

	// Parse logfiles and buid communication graph
	let line_transfers = {};
	let line_objects   = {};
	for (const filename of filenames) {
		const parser = fs.createReadStream(`${logs_dir}/${filename}`)
			.pipe(parse_csv({ delimiter: ',', columns: true }))

		parser.on('data', (row) => {
			// Get source and target device
			const source_device = parseInt(row.running_dev_id);
			const target_device = parseInt(row.mem_dev_id);
			const obj           = row.obj_offset;
			const line_idx      = parseInt(row.code_line_index);
			const message_bytes = parseInt(row.mem_range);

			if (!(line_idx in line_objects)) {
				line_objects[line_idx] = new Set()
			}

			line_objects[line_idx].add(obj)

			if (!(line_idx in line_transfers)) {
				line_transfers[line_idx] = {}
			}

			if (!(source_device in line_transfers[line_idx])) {
				line_transfers[line_idx][source_device] = {};
			}
			if (!(target_device in line_transfers[line_idx][source_device])) {
				line_transfers[line_idx][source_device][target_device] = {
					transfers: 0,
					bytes: 0
				};
			}
			line_transfers[line_idx][source_device][target_device].transfers += 1;
			line_transfers[line_idx][source_device][target_device].bytes     += message_bytes;
		});

		await finished(parser)
	}

	const objectMap = (obj, fn) =>
		Object.fromEntries(
			Object.entries(obj).map(
				([k, v], i) => [k, fn(v, k, i)]
			)
		)

	const line_objects_counts = objectMap(line_objects, v => v.size)

	return { logs_dir, code_lines, line_transfers, line_objects_counts, files };
}
