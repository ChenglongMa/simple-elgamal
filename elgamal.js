let p, q, g, x, y, msg, k, c1, c2, plain_msg, msgs, prim_roots_of_q;
/**
 * Refined mod function to extend % operation
 * @param n
 * @returns {number}
 */
Number.prototype.mod = function (n) {
    return ((this % n) + n) % n;
};

/**
 * Checks if the num is prime
 * @param num
 * @returns {boolean}
 */
const isPrime = num => {
    for (let i = 2, s = Math.sqrt(num); i <= s; i++)
        if (num % i === 0) return false;
    return num > 1;
};

/**
 * Gets the prime roots of a specific prime number
 * @param prime
 * @returns {[]}
 */
function roots(prime) {
    let o = 1;
    let k;
    const roots = [];
    for (let r = 2; r < prime; r++) {
        k = Math.pow(r, o);
        k %= prime;
        while (k > 1) {
            o++;
            k *= r;
            k %= prime;
        }
        if (o === (prime - 1)) {
            roots.push(r);
        }
        o = 1;
    }
    return roots;
}

/**
 * Fast exponentiation
 * @param x
 * @param exp
 * @param n
 * @returns {number}
 */
function modularExponentiation(x, exp, n) {
    if (n === 1) {
        return 0;
    }
    let res = 1;
    for (let i = 0; i < exp; i++) {
        res = (res * x) % n;
    }
    return res;
}

/**
 * Verify if the entered p is prime
 * @param ele
 */
function onChangeP(ele) {
    let error_msg;
    if (isPrime(ele.value)) {
        p = Number(ele.value);
        error_msg = '';
    } else {
        error_msg = "P must be a prime number";
    }
    document.getElementById('p-error').innerText = error_msg;
}

/**
 * Verify if the entered Q is prime and get its prime roots.
 * @param ele
 */
function onChangeQ(ele) {
    let error_msg;
    if (isPrime(ele.value)) {
        q = Number(ele.value);
        prim_roots_of_q = roots(q);
        error_msg = `"G" could be [${prim_roots_of_q.slice(0, 10).toString()} ...]`;
    } else {
        error_msg = "Q must be a prime number";
    }
    document.getElementById('q-error').innerText = error_msg;
}

/**
 * Verify if G is a prime root of Q
 * @param value
 */
function verifyG(value) {
    let error_msg;
    if (prim_roots_of_q.includes(value)) {
        g = value;
        error_msg = "";
    } else {
        error_msg = `"G" can only be chosen from [${prim_roots_of_q.slice(0, 3).toString()} ...]`;
    }
    document.getElementById('g-error').innerText = error_msg;
}

/**
 * Verify if the value < max
 * @param value
 * @param max
 * @param id
 * @returns {number|*}
 */
function verifyCeiling(value, max, id) {
    const ele = document.getElementById(id);
    if (value < max) {
        ele.value = value;
        return value;
    }
    ele.value = NaN;
    return NaN;
}

/**
 * Gets a random element of a specific array
 * @param array
 * @returns {*}
 */
function getRandomElement(array) {
    const max = array.length;
    const randomId = genRandom(max);
    return array[randomId];
}

/**
 * Gets a random G
 */
function genG() {
    if (prim_roots_of_q) {
        const g = getRandomElement(prim_roots_of_q);
        document.getElementById('g').value = g;
        verifyG(g);
        document.getElementById('g-error').innerText = '';
    } else {
        document.getElementById('g-error').innerText = `Please enter "P" firstly.`;
    }
}

/**
 * Gets a random number which is < max
 * @param max
 * @param id
 * @returns {number}
 */
function genRandom(max, id = null) {
    const ran = Math.floor(Math.random() * max - 1);
    if (id) {
        document.getElementById(id).value = ran;
    }
    return ran;
}

/**
 * Gets the inverse using extended euclidean algorithm
 * @param a
 * @param n
 * @returns {number}
 */
function inverse(a, n) {
    let t = 0, r = n, newt = 1, newr = a;
    while (newr !== 0) {
        const quotient = Math.floor(r / newr);
        [t, newt] = [newt, t - quotient * newt];
        [r, newr] = [newr, r - quotient * newr];
    }
    if (r !== 1) {
        throw Error(`${a} is not invertible.`);
    }
    if (t < 0) {
        t += n;
    }
    return t;
}

/**
 * Gets the public key
 */
function generateKey() {
    y = modularExponentiation(g, x, p);
    document.getElementById('y').value = y;
    document.getElementById('pk').innerText = `{${p}, ${g}, ${y}}`;
}

/**
 * Encrypts the message with k
 * @param msg
 * @param k
 * @returns {[number, number]}
 */
function encrypt(msg, k) {
    c1 = modularExponentiation(g, k, p);
    c2 = (modularExponentiation(y, k, p) * Number(msg).mod(p)).mod(p);
    return [c1, c2];
}

/**
 * Encrypts the message
 */
function encryptMsg() {
    [c1, c2] = encrypt(msg, k);
    document.getElementById('c1').value = c1;
    document.getElementById('c2').value = c2;
    document.getElementById('cipher').innerText = `{${c1}, ${c2}}`;
}

/**
 * Decrypt the cipher pair
 * @param c1
 * @param c2
 * @returns {number}
 */
function decrypt(c1, c2) {
    const m = modularExponentiation(c1, x, p);
    const invAx = inverse(m, p);
    return (c2 * invAx.mod(p)).mod(p);
}

/**
 * Decrypts the message
 */
function decryptMsg() {
    plain_msg = decrypt(c1, c2);
    document.getElementById('de-msg').value = plain_msg;
}

/**
 * Encrypts all messages
 */
function encryptAll() {
    msgs = [];
    for (let i = 1; i <= 5; i++) {
        const msg = document.getElementById(`msg${i}`).value;
        const k = document.getElementById(`k${i}`).value;
        let c1, c2;
        [c1, c2] = encrypt(msg, k);
        msgs.push([msg, c1, c2]);
        document.getElementById(`cph${i}`).value = `{${c1}, ${c2}}`;
    }
}


/**
 * Calculates the products of all messages
 */
function calculate() {
    let mmsg, mc1, mc2;
    [mmsg, mc1, mc2] = msgs.reduce((a, b) => {
        // msg multi, c1 multi, c2 multi
        return [(a[0] * b[0]) % p, (a[1] * b[1]) % p, (a[2] * b[2]) % p];
    });
    mmsg %= p;
    mc1 %= p;
    mc2 %= p;
    document.getElementById('msg-multi').value = mmsg;
    document.getElementById('cph-multi').value = `{${mc1}, ${mc2}}`;
    const plain = decrypt(mc1, mc2);
    document.getElementById('de-multi').value = plain;
    const res_msg = document.getElementById('result');
    const correct = mmsg === plain;
    res_msg.innerHTML = correct ? "\u2714" : "\u2718";
    res_msg.style.color = correct ? "green" : "red";
}
