/**
 * Model search plugin, node half. Pure UI plugin: the empty apply exists so the
 * row mounts in the host composition and therefore appears in the client
 * module graph; the browser half ships via exports["./client"], discovered
 * through the package.json dsh.client declaration.
 */
/** Host plugin body — no host-side behavior for this surface plugin. */
function apply() {}
export { apply };
