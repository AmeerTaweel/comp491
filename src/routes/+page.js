import { redirect } from '@sveltejs/kit';

export function load() {
	// Redirect to default page
	redirect(302, '/system-view');
}
