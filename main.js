function getLength(something) {
    if (something.length) {
        return something.length;
    }
    else {
        return something.toString().length;
    }
}
var tom = "Tom";
console.log(getLength(tom));
