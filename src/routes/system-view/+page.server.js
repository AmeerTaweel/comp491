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

	// Parse logfiles and buid communication graph
	let communication_graph = {};
	for (const filename of filenames) {
		const parser = fs.createReadStream(`${logs_dir}/${filename}`)
			.pipe(parse_csv({ delimiter: ',', columns: true }))

		parser.on('data', (row) => {
			// Get source and target device
			const source_device = parseInt(row.running_dev_id);
			const target_device = parseInt(row.mem_dev_id);
			const message_bytes = parseInt(row.mem_range);

			if (!(source_device in communication_graph)) {
				communication_graph[source_device] = {};
			}
			if (!(target_device in communication_graph[source_device])) {
				communication_graph[source_device][target_device] = {
					transfers: 0,
					bytes: 0
				};
			}
			communication_graph[source_device][target_device].transfers += 1;
			communication_graph[source_device][target_device].bytes     += message_bytes;
		});

		await finished(parser)
	}

	return { logs_dir, communication_graph };
}
