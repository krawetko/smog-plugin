/*
 * Creates new Object and sets its properties according to passed array arguments.
 * Ex: new Obj(['a', 'valA'], ['b', 'valB']) will create object with properties 'a' and 'b' and their respective values 'valA' and 'valB';
 */
function Obj() {
    for (var i = 0; i < arguments.length; i++) {
        this[arguments[i][0]] = arguments[i][1];
    }
}