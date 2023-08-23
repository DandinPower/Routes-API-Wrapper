function getLength (something: string | number): number {
    if ((<string> something).length) {
        return (<string> something).length;
    }
    else {
        return something.toString().length;
    }
}

let tom: string = "Tom";
console.log(getLength(tom));