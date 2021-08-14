// The entry file of your WebAssembly module.
/* declare function sayHello(): void;

sayHello(); */

export function add(a: i32, b: i32): i32 {
  return a + b;
}
export function subtract(a: i32, b: i32): i32 {
  return a - b;
}
export function fib(n: i32): i32 {
  if (n <= 1) return 1;
  return fib(n - 1) + fib(n - 2);
}
export function mandelIter(x: f32, y: f32, maxIter: f32): f32 {
  var r: f32 = x;
  var i: f32 = y;
  for (let a: f32 = 0; a < maxIter; a++) {
    let tmpr: f32 = r * r - i * i + x;
    let tmpi: f32 = 2 * r * i + y;

    r = tmpr;
    i = tmpi;

    if (r * i > 5) {
      return (a / maxIter) * 100;
    }
  }

  return 0;
}

export function loadStore(value:i32):i32{
  
  return load<u8>(value);
}

export function saveStore(index:i32,value:i32):void{
  store<u8>(index,value);
}


export function invert(byteSize: i32): i32 {
  //const unitSize:i32 = 8;
  for (let i = 0; i < (byteSize); i += 4) {
    //let pos = i + byteSize;
    store<u8>(i + 0, 255 - load<u8>(i + 0));
    store<u8>(i + 1, 255 - load<u8>(i + 1));
    store<u8>(i + 2, 255 - load<u8>(i + 2));
    store<u8>(i + 3, 255);
  }
  return 0;
}


export function grayscale(byteSize: i32): i32 {
  for (let i = 0; i < byteSize; i += 4) {
    //let pos = i+byteSize;
    const avg = u8(0.3 * load<u8>(i) + 0.59 * load<u8>(i + 1) + 0.11 * load<u8>(i + 2));
    store<u8>(i + 0, avg);
    store<u8>(i + 1, avg);
    store<u8>(i + 2, avg);
    store<u8>(i + 3, 255);
  }
  return 0;
}

export function sepia(byteSize: i32): i32 {
  for (let i = 0; i < byteSize; i += 4) {
    //let pos = i + byteSize;
    const avg = 0.3 * load<u8>(i) + 0.59 * load<u8>(i + 1) + 0.11 * load<u8>(i + 2);
    store<u8>(i + 0, u8(min(avg + 100, 255)));
    store<u8>(i + 1, u8(min(avg + 50, 255)));
    store<u8>(i + 2, u8(avg));
    store<u8>(i + 3, 255);
  }
  return 0;
}

@inline
function addConvolveValue(pos:i32, oldValue:u8, length:i32): i32 {
  return i32(pos >= 0) & i32(pos < length) ? load<u8>(pos) : oldValue;
}

export function convolve(
  byteSize:i32,
  w:i32,
  offset:i32,
  v00:i32, v01:i32, v02:i32,
  v10:i32, v11:i32, v12:i32,
  v20:i32, v21:i32, v22:i32
): i32 {
  let divisor = (v00 + v01 + v02 + v10 + v11 + v12 + v20 + v21 + v22) || 1;
  for (let i = 0; i < byteSize; i++){
    if (((i + 1) & 3) == 0) {
      store<u8>(i, load<u8>(i));
      continue;
    }
    let stride = w * 4;
    let prev = i - stride;
    let next = i + stride;
    let oldValue = load<u8>(i);
    let res =
      v00 * addConvolveValue(prev - 4, oldValue, byteSize) +
      v01 * addConvolveValue(prev,     oldValue, byteSize) +
      v02 * addConvolveValue(prev + 4, oldValue, byteSize) +
      v10 * addConvolveValue(i - 4,    oldValue, byteSize) +
      v11 * oldValue +
      v12 * addConvolveValue(i + 4,    oldValue, byteSize) +
      v20 * addConvolveValue(next - 4, oldValue, byteSize) +
      v21 * addConvolveValue(next,     oldValue, byteSize) +
      v22 * addConvolveValue(next + 4, oldValue, byteSize);
    res /= divisor;
    res += offset;
    store<u8>(i , u8(res));
  }
  return 0;
}
