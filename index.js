var p53 = 9007199254740881; //p_prev(2^53)
var p27 = 94906249; //p_prev(sqrt(2^53));
var p17 = 65537;

var squares = [p17];
for (var i = 1; i < 32; i++) {
    squares[i] = Math.pow(squares[i - 1], 2) % p27;
}

var bytes = [];
for (var b = 0; b < 3; b++) {
    bytes[b] = [];
    for (var i = 0; i < 1024; i++) {
        var c = 1;
        for (var j = 0; i >> j; j++) {
            if (i >>> j & 1) {
                c *= squares[j + b * 10];
                c %= p27;
            }
        }
        bytes[b][i] = c;
    }
}

function hash(m) {
    var c = 1;
    for (var b = 0; b < 3; b++) {
        var i = (m >> (10 * b)) & 1023;
        c *= bytes[b][i];
        c %= p27;
    }
    return c;
}


var nodes = 64;

function place(id) {
    var place = 0;
    for (var i = 0; 1 << i < nodes; i++) {
        var a = hash((i * 2 + 1 << 22) + id);
        var b = hash((i * 2 + 2 << 22) + id);
        if (a < b) place += 1 << i;
    }
    return place;
}


var counts = [];
for (var i = 0; i < nodes; i++) {
    counts[i] = 0;
}

console.time("place a bunch");
for (var i = 0; i < 1000000; i++) {
    counts[place(i)]++;
}
console.timeEnd("place a bunch");
console.log(counts);
