/** @type {import('./$types').PageLoad} */

export async function load({ params }) {
    const jobAddr = params.job;

    return {
        jobAddr
    };
}
