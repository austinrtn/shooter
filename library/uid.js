const ids = [];

export function createId(){
    let id = ids.length;
    ids.push(id);
    return id;
}