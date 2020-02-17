export function formatDate(time) {
    if (!time) {
        return ''
    }
    let date = new Date(time);
    let str = date.toISOString().replace('T',' ');
    return str.substr(0, str.lastIndexOf('.'));
}