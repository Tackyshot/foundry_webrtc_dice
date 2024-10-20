function _mergeNamespaces(n, m) {
    m.forEach(function (e) {
        e && typeof e !== 'string' && !Array.isArray(e) && Object.keys(e).forEach(function (k) {
            if (k !== 'default' && !(k in n)) {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    });
    return Object.freeze(n);
}

class $e8379818650e2442$export$93654d4f2d6cd524 {
    constructor(){
        this.encoder = new TextEncoder();
        this._pieces = [];
        this._parts = [];
    }
    append_buffer(data) {
        this.flush();
        this._parts.push(data);
    }
    append(data) {
        this._pieces.push(data);
    }
    flush() {
        if (this._pieces.length > 0) {
            const buf = new Uint8Array(this._pieces);
            this._parts.push(buf);
            this._pieces = [];
        }
    }
    toArrayBuffer() {
        const buffer = [];
        for (const part of this._parts)buffer.push(part);
        return $e8379818650e2442$var$concatArrayBuffers(buffer).buffer;
    }
}
function $e8379818650e2442$var$concatArrayBuffers(bufs) {
    let size = 0;
    for (const buf of bufs)size += buf.byteLength;
    const result = new Uint8Array(size);
    let offset = 0;
    for (const buf of bufs){
        const view = new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
        result.set(view, offset);
        offset += buf.byteLength;
    }
    return result;
}


function $0cfd7828ad59115f$export$417857010dc9287f(data) {
    const unpacker = new $0cfd7828ad59115f$var$Unpacker(data);
    return unpacker.unpack();
}
function $0cfd7828ad59115f$export$2a703dbb0cb35339(data) {
    const packer = new $0cfd7828ad59115f$export$b9ec4b114aa40074();
    const res = packer.pack(data);
    if (res instanceof Promise) return res.then(()=>packer.getBuffer());
    return packer.getBuffer();
}
class $0cfd7828ad59115f$var$Unpacker {
    constructor(data){
        this.index = 0;
        this.dataBuffer = data;
        this.dataView = new Uint8Array(this.dataBuffer);
        this.length = this.dataBuffer.byteLength;
    }
    unpack() {
        const type = this.unpack_uint8();
        if (type < 0x80) return type;
        else if ((type ^ 0xe0) < 0x20) return (type ^ 0xe0) - 0x20;
        let size;
        if ((size = type ^ 0xa0) <= 0x0f) return this.unpack_raw(size);
        else if ((size = type ^ 0xb0) <= 0x0f) return this.unpack_string(size);
        else if ((size = type ^ 0x90) <= 0x0f) return this.unpack_array(size);
        else if ((size = type ^ 0x80) <= 0x0f) return this.unpack_map(size);
        switch(type){
            case 0xc0:
                return null;
            case 0xc1:
                return undefined;
            case 0xc2:
                return false;
            case 0xc3:
                return true;
            case 0xca:
                return this.unpack_float();
            case 0xcb:
                return this.unpack_double();
            case 0xcc:
                return this.unpack_uint8();
            case 0xcd:
                return this.unpack_uint16();
            case 0xce:
                return this.unpack_uint32();
            case 0xcf:
                return this.unpack_uint64();
            case 0xd0:
                return this.unpack_int8();
            case 0xd1:
                return this.unpack_int16();
            case 0xd2:
                return this.unpack_int32();
            case 0xd3:
                return this.unpack_int64();
            case 0xd4:
                return undefined;
            case 0xd5:
                return undefined;
            case 0xd6:
                return undefined;
            case 0xd7:
                return undefined;
            case 0xd8:
                size = this.unpack_uint16();
                return this.unpack_string(size);
            case 0xd9:
                size = this.unpack_uint32();
                return this.unpack_string(size);
            case 0xda:
                size = this.unpack_uint16();
                return this.unpack_raw(size);
            case 0xdb:
                size = this.unpack_uint32();
                return this.unpack_raw(size);
            case 0xdc:
                size = this.unpack_uint16();
                return this.unpack_array(size);
            case 0xdd:
                size = this.unpack_uint32();
                return this.unpack_array(size);
            case 0xde:
                size = this.unpack_uint16();
                return this.unpack_map(size);
            case 0xdf:
                size = this.unpack_uint32();
                return this.unpack_map(size);
        }
    }
    unpack_uint8() {
        const byte = this.dataView[this.index] & 0xff;
        this.index++;
        return byte;
    }
    unpack_uint16() {
        const bytes = this.read(2);
        const uint16 = (bytes[0] & 0xff) * 256 + (bytes[1] & 0xff);
        this.index += 2;
        return uint16;
    }
    unpack_uint32() {
        const bytes = this.read(4);
        const uint32 = ((bytes[0] * 256 + bytes[1]) * 256 + bytes[2]) * 256 + bytes[3];
        this.index += 4;
        return uint32;
    }
    unpack_uint64() {
        const bytes = this.read(8);
        const uint64 = ((((((bytes[0] * 256 + bytes[1]) * 256 + bytes[2]) * 256 + bytes[3]) * 256 + bytes[4]) * 256 + bytes[5]) * 256 + bytes[6]) * 256 + bytes[7];
        this.index += 8;
        return uint64;
    }
    unpack_int8() {
        const uint8 = this.unpack_uint8();
        return uint8 < 0x80 ? uint8 : uint8 - 256;
    }
    unpack_int16() {
        const uint16 = this.unpack_uint16();
        return uint16 < 0x8000 ? uint16 : uint16 - 65536;
    }
    unpack_int32() {
        const uint32 = this.unpack_uint32();
        return uint32 < 2 ** 31 ? uint32 : uint32 - 2 ** 32;
    }
    unpack_int64() {
        const uint64 = this.unpack_uint64();
        return uint64 < 2 ** 63 ? uint64 : uint64 - 2 ** 64;
    }
    unpack_raw(size) {
        if (this.length < this.index + size) throw new Error(`BinaryPackFailure: index is out of range ${this.index} ${size} ${this.length}`);
        const buf = this.dataBuffer.slice(this.index, this.index + size);
        this.index += size;
        return buf;
    }
    unpack_string(size) {
        const bytes = this.read(size);
        let i = 0;
        let str = "";
        let c;
        let code;
        while(i < size){
            c = bytes[i];
            // The length of a UTF-8 sequence is specified in the first byte:
            // 0xxxxxxx means length 1,
            // 110xxxxx means length 2,
            // 1110xxxx means length 3,
            // 11110xxx means length 4.
            // 10xxxxxx is for non-initial bytes.
            if (c < 0xa0) {
                // One-byte sequence: bits 0xxxxxxx
                code = c;
                i++;
            } else if ((c ^ 0xc0) < 0x20) {
                // Two-byte sequence: bits 110xxxxx 10xxxxxx
                code = (c & 0x1f) << 6 | bytes[i + 1] & 0x3f;
                i += 2;
            } else if ((c ^ 0xe0) < 0x10) {
                // Three-byte sequence: bits 1110xxxx 10xxxxxx 10xxxxxx
                code = (c & 0x0f) << 12 | (bytes[i + 1] & 0x3f) << 6 | bytes[i + 2] & 0x3f;
                i += 3;
            } else {
                // Four-byte sequence: bits 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
                code = (c & 0x07) << 18 | (bytes[i + 1] & 0x3f) << 12 | (bytes[i + 2] & 0x3f) << 6 | bytes[i + 3] & 0x3f;
                i += 4;
            }
            str += String.fromCodePoint(code);
        }
        this.index += size;
        return str;
    }
    unpack_array(size) {
        const objects = new Array(size);
        for(let i = 0; i < size; i++)objects[i] = this.unpack();
        return objects;
    }
    unpack_map(size) {
        const map = {};
        for(let i = 0; i < size; i++){
            const key = this.unpack();
            map[key] = this.unpack();
        }
        return map;
    }
    unpack_float() {
        const uint32 = this.unpack_uint32();
        const sign = uint32 >> 31;
        const exp = (uint32 >> 23 & 0xff) - 127;
        const fraction = uint32 & 0x7fffff | 0x800000;
        return (sign === 0 ? 1 : -1) * fraction * 2 ** (exp - 23);
    }
    unpack_double() {
        const h32 = this.unpack_uint32();
        const l32 = this.unpack_uint32();
        const sign = h32 >> 31;
        const exp = (h32 >> 20 & 0x7ff) - 1023;
        const hfrac = h32 & 0xfffff | 0x100000;
        const frac = hfrac * 2 ** (exp - 20) + l32 * 2 ** (exp - 52);
        return (sign === 0 ? 1 : -1) * frac;
    }
    read(length) {
        const j = this.index;
        if (j + length <= this.length) return this.dataView.subarray(j, j + length);
        else throw new Error("BinaryPackFailure: read index out of range");
    }
}
class $0cfd7828ad59115f$export$b9ec4b114aa40074 {
    getBuffer() {
        return this._bufferBuilder.toArrayBuffer();
    }
    pack(value) {
        if (typeof value === "string") this.pack_string(value);
        else if (typeof value === "number") {
            if (Math.floor(value) === value) this.pack_integer(value);
            else this.pack_double(value);
        } else if (typeof value === "boolean") {
            if (value === true) this._bufferBuilder.append(0xc3);
            else if (value === false) this._bufferBuilder.append(0xc2);
        } else if (value === undefined) this._bufferBuilder.append(0xc0);
        else if (typeof value === "object") {
            if (value === null) this._bufferBuilder.append(0xc0);
            else {
                const constructor = value.constructor;
                if (value instanceof Array) {
                    const res = this.pack_array(value);
                    if (res instanceof Promise) return res.then(()=>this._bufferBuilder.flush());
                } else if (value instanceof ArrayBuffer) this.pack_bin(new Uint8Array(value));
                else if ("BYTES_PER_ELEMENT" in value) {
                    const v = value;
                    this.pack_bin(new Uint8Array(v.buffer, v.byteOffset, v.byteLength));
                } else if (value instanceof Date) this.pack_string(value.toString());
                else if (value instanceof Blob) return value.arrayBuffer().then((buffer)=>{
                    this.pack_bin(new Uint8Array(buffer));
                    this._bufferBuilder.flush();
                });
                else if (constructor == Object || constructor.toString().startsWith("class")) {
                    const res = this.pack_object(value);
                    if (res instanceof Promise) return res.then(()=>this._bufferBuilder.flush());
                } else throw new Error(`Type "${constructor.toString()}" not yet supported`);
            }
        } else throw new Error(`Type "${typeof value}" not yet supported`);
        this._bufferBuilder.flush();
    }
    pack_bin(blob) {
        const length = blob.length;
        if (length <= 0x0f) this.pack_uint8(0xa0 + length);
        else if (length <= 0xffff) {
            this._bufferBuilder.append(0xda);
            this.pack_uint16(length);
        } else if (length <= 0xffffffff) {
            this._bufferBuilder.append(0xdb);
            this.pack_uint32(length);
        } else throw new Error("Invalid length");
        this._bufferBuilder.append_buffer(blob);
    }
    pack_string(str) {
        const encoded = this._textEncoder.encode(str);
        const length = encoded.length;
        if (length <= 0x0f) this.pack_uint8(0xb0 + length);
        else if (length <= 0xffff) {
            this._bufferBuilder.append(0xd8);
            this.pack_uint16(length);
        } else if (length <= 0xffffffff) {
            this._bufferBuilder.append(0xd9);
            this.pack_uint32(length);
        } else throw new Error("Invalid length");
        this._bufferBuilder.append_buffer(encoded);
    }
    pack_array(ary) {
        const length = ary.length;
        if (length <= 0x0f) this.pack_uint8(0x90 + length);
        else if (length <= 0xffff) {
            this._bufferBuilder.append(0xdc);
            this.pack_uint16(length);
        } else if (length <= 0xffffffff) {
            this._bufferBuilder.append(0xdd);
            this.pack_uint32(length);
        } else throw new Error("Invalid length");
        const packNext = (index)=>{
            if (index < length) {
                const res = this.pack(ary[index]);
                if (res instanceof Promise) return res.then(()=>packNext(index + 1));
                return packNext(index + 1);
            }
        };
        return packNext(0);
    }
    pack_integer(num) {
        if (num >= -32 && num <= 0x7f) this._bufferBuilder.append(num & 0xff);
        else if (num >= 0x00 && num <= 0xff) {
            this._bufferBuilder.append(0xcc);
            this.pack_uint8(num);
        } else if (num >= -128 && num <= 0x7f) {
            this._bufferBuilder.append(0xd0);
            this.pack_int8(num);
        } else if (num >= 0x0000 && num <= 0xffff) {
            this._bufferBuilder.append(0xcd);
            this.pack_uint16(num);
        } else if (num >= -32768 && num <= 0x7fff) {
            this._bufferBuilder.append(0xd1);
            this.pack_int16(num);
        } else if (num >= 0x00000000 && num <= 0xffffffff) {
            this._bufferBuilder.append(0xce);
            this.pack_uint32(num);
        } else if (num >= -2147483648 && num <= 0x7fffffff) {
            this._bufferBuilder.append(0xd2);
            this.pack_int32(num);
        } else if (num >= -9223372036854776000 && num <= 0x7fffffffffffffff) {
            this._bufferBuilder.append(0xd3);
            this.pack_int64(num);
        } else if (num >= 0x0000000000000000 && num <= 0xffffffffffffffff) {
            this._bufferBuilder.append(0xcf);
            this.pack_uint64(num);
        } else throw new Error("Invalid integer");
    }
    pack_double(num) {
        let sign = 0;
        if (num < 0) {
            sign = 1;
            num = -num;
        }
        const exp = Math.floor(Math.log(num) / Math.LN2);
        const frac0 = num / 2 ** exp - 1;
        const frac1 = Math.floor(frac0 * 2 ** 52);
        const b32 = 2 ** 32;
        const h32 = sign << 31 | exp + 1023 << 20 | frac1 / b32 & 0x0fffff;
        const l32 = frac1 % b32;
        this._bufferBuilder.append(0xcb);
        this.pack_int32(h32);
        this.pack_int32(l32);
    }
    pack_object(obj) {
        const keys = Object.keys(obj);
        const length = keys.length;
        if (length <= 0x0f) this.pack_uint8(0x80 + length);
        else if (length <= 0xffff) {
            this._bufferBuilder.append(0xde);
            this.pack_uint16(length);
        } else if (length <= 0xffffffff) {
            this._bufferBuilder.append(0xdf);
            this.pack_uint32(length);
        } else throw new Error("Invalid length");
        const packNext = (index)=>{
            if (index < keys.length) {
                const prop = keys[index];
                // eslint-disable-next-line no-prototype-builtins
                if (obj.hasOwnProperty(prop)) {
                    this.pack(prop);
                    const res = this.pack(obj[prop]);
                    if (res instanceof Promise) return res.then(()=>packNext(index + 1));
                }
                return packNext(index + 1);
            }
        };
        return packNext(0);
    }
    pack_uint8(num) {
        this._bufferBuilder.append(num);
    }
    pack_uint16(num) {
        this._bufferBuilder.append(num >> 8);
        this._bufferBuilder.append(num & 0xff);
    }
    pack_uint32(num) {
        const n = num & 0xffffffff;
        this._bufferBuilder.append((n & 0xff000000) >>> 24);
        this._bufferBuilder.append((n & 0x00ff0000) >>> 16);
        this._bufferBuilder.append((n & 0x0000ff00) >>> 8);
        this._bufferBuilder.append(n & 0x000000ff);
    }
    pack_uint64(num) {
        const high = num / 2 ** 32;
        const low = num % 2 ** 32;
        this._bufferBuilder.append((high & 0xff000000) >>> 24);
        this._bufferBuilder.append((high & 0x00ff0000) >>> 16);
        this._bufferBuilder.append((high & 0x0000ff00) >>> 8);
        this._bufferBuilder.append(high & 0x000000ff);
        this._bufferBuilder.append((low & 0xff000000) >>> 24);
        this._bufferBuilder.append((low & 0x00ff0000) >>> 16);
        this._bufferBuilder.append((low & 0x0000ff00) >>> 8);
        this._bufferBuilder.append(low & 0x000000ff);
    }
    pack_int8(num) {
        this._bufferBuilder.append(num & 0xff);
    }
    pack_int16(num) {
        this._bufferBuilder.append((num & 0xff00) >> 8);
        this._bufferBuilder.append(num & 0xff);
    }
    pack_int32(num) {
        this._bufferBuilder.append(num >>> 24 & 0xff);
        this._bufferBuilder.append((num & 0x00ff0000) >>> 16);
        this._bufferBuilder.append((num & 0x0000ff00) >>> 8);
        this._bufferBuilder.append(num & 0x000000ff);
    }
    pack_int64(num) {
        const high = Math.floor(num / 2 ** 32);
        const low = num % 2 ** 32;
        this._bufferBuilder.append((high & 0xff000000) >>> 24);
        this._bufferBuilder.append((high & 0x00ff0000) >>> 16);
        this._bufferBuilder.append((high & 0x0000ff00) >>> 8);
        this._bufferBuilder.append(high & 0x000000ff);
        this._bufferBuilder.append((low & 0xff000000) >>> 24);
        this._bufferBuilder.append((low & 0x00ff0000) >>> 16);
        this._bufferBuilder.append((low & 0x0000ff00) >>> 8);
        this._bufferBuilder.append(low & 0x000000ff);
    }
    constructor(){
        this._bufferBuilder = new ($e8379818650e2442$export$93654d4f2d6cd524)();
        this._textEncoder = new TextEncoder();
    }
}

/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
/* eslint-env node */

let logDisabled_ = true;
let deprecationWarnings_ = true;

/**
 * Extract browser version out of the provided user agent string.
 *
 * @param {!string} uastring userAgent string.
 * @param {!string} expr Regular expression used as match criteria.
 * @param {!number} pos position in the version string to be returned.
 * @return {!number} browser version.
 */
function extractVersion(uastring, expr, pos) {
  const match = uastring.match(expr);
  return match && match.length >= pos && parseInt(match[pos], 10);
}

// Wraps the peerconnection event eventNameToWrap in a function
// which returns the modified event object (or false to prevent
// the event).
function wrapPeerConnectionEvent(window, eventNameToWrap, wrapper) {
  if (!window.RTCPeerConnection) {
    return;
  }
  const proto = window.RTCPeerConnection.prototype;
  const nativeAddEventListener = proto.addEventListener;
  proto.addEventListener = function(nativeEventName, cb) {
    if (nativeEventName !== eventNameToWrap) {
      return nativeAddEventListener.apply(this, arguments);
    }
    const wrappedCallback = (e) => {
      const modifiedEvent = wrapper(e);
      if (modifiedEvent) {
        if (cb.handleEvent) {
          cb.handleEvent(modifiedEvent);
        } else {
          cb(modifiedEvent);
        }
      }
    };
    this._eventMap = this._eventMap || {};
    if (!this._eventMap[eventNameToWrap]) {
      this._eventMap[eventNameToWrap] = new Map();
    }
    this._eventMap[eventNameToWrap].set(cb, wrappedCallback);
    return nativeAddEventListener.apply(this, [nativeEventName,
      wrappedCallback]);
  };

  const nativeRemoveEventListener = proto.removeEventListener;
  proto.removeEventListener = function(nativeEventName, cb) {
    if (nativeEventName !== eventNameToWrap || !this._eventMap
        || !this._eventMap[eventNameToWrap]) {
      return nativeRemoveEventListener.apply(this, arguments);
    }
    if (!this._eventMap[eventNameToWrap].has(cb)) {
      return nativeRemoveEventListener.apply(this, arguments);
    }
    const unwrappedCb = this._eventMap[eventNameToWrap].get(cb);
    this._eventMap[eventNameToWrap].delete(cb);
    if (this._eventMap[eventNameToWrap].size === 0) {
      delete this._eventMap[eventNameToWrap];
    }
    if (Object.keys(this._eventMap).length === 0) {
      delete this._eventMap;
    }
    return nativeRemoveEventListener.apply(this, [nativeEventName,
      unwrappedCb]);
  };

  Object.defineProperty(proto, 'on' + eventNameToWrap, {
    get() {
      return this['_on' + eventNameToWrap];
    },
    set(cb) {
      if (this['_on' + eventNameToWrap]) {
        this.removeEventListener(eventNameToWrap,
          this['_on' + eventNameToWrap]);
        delete this['_on' + eventNameToWrap];
      }
      if (cb) {
        this.addEventListener(eventNameToWrap,
          this['_on' + eventNameToWrap] = cb);
      }
    },
    enumerable: true,
    configurable: true
  });
}

function disableLog(bool) {
  if (typeof bool !== 'boolean') {
    return new Error('Argument type: ' + typeof bool +
        '. Please use a boolean.');
  }
  logDisabled_ = bool;
  return (bool) ? 'adapter.js logging disabled' :
    'adapter.js logging enabled';
}

/**
 * Disable or enable deprecation warnings
 * @param {!boolean} bool set to true to disable warnings.
 */
function disableWarnings(bool) {
  if (typeof bool !== 'boolean') {
    return new Error('Argument type: ' + typeof bool +
        '. Please use a boolean.');
  }
  deprecationWarnings_ = !bool;
  return 'adapter.js deprecation warnings ' + (bool ? 'disabled' : 'enabled');
}

function log() {
  if (typeof window === 'object') {
    if (logDisabled_) {
      return;
    }
    if (typeof console !== 'undefined' && typeof console.log === 'function') {
      console.log.apply(console, arguments);
    }
  }
}

/**
 * Shows a deprecation warning suggesting the modern and spec-compatible API.
 */
function deprecated(oldMethod, newMethod) {
  if (!deprecationWarnings_) {
    return;
  }
  console.warn(oldMethod + ' is deprecated, please use ' + newMethod +
      ' instead.');
}

/**
 * Browser detector.
 *
 * @return {object} result containing browser and version
 *     properties.
 */
function detectBrowser(window) {
  // Returned result object.
  const result = {browser: null, version: null};

  // Fail early if it's not a browser
  if (typeof window === 'undefined' || !window.navigator ||
      !window.navigator.userAgent) {
    result.browser = 'Not a browser.';
    return result;
  }

  const {navigator} = window;

  // Prefer navigator.userAgentData.
  if (navigator.userAgentData && navigator.userAgentData.brands) {
    const chromium = navigator.userAgentData.brands.find((brand) => {
      return brand.brand === 'Chromium';
    });
    if (chromium) {
      return {browser: 'chrome', version: parseInt(chromium.version, 10)};
    }
  }

  if (navigator.mozGetUserMedia) { // Firefox.
    result.browser = 'firefox';
    result.version = extractVersion(navigator.userAgent,
      /Firefox\/(\d+)\./, 1);
  } else if (navigator.webkitGetUserMedia ||
      (window.isSecureContext === false && window.webkitRTCPeerConnection)) {
    // Chrome, Chromium, Webview, Opera.
    // Version matches Chrome/WebRTC version.
    // Chrome 74 removed webkitGetUserMedia on http as well so we need the
    // more complicated fallback to webkitRTCPeerConnection.
    result.browser = 'chrome';
    result.version = extractVersion(navigator.userAgent,
      /Chrom(e|ium)\/(\d+)\./, 2);
  } else if (window.RTCPeerConnection &&
      navigator.userAgent.match(/AppleWebKit\/(\d+)\./)) { // Safari.
    result.browser = 'safari';
    result.version = extractVersion(navigator.userAgent,
      /AppleWebKit\/(\d+)\./, 1);
    result.supportsUnifiedPlan = window.RTCRtpTransceiver &&
        'currentDirection' in window.RTCRtpTransceiver.prototype;
  } else { // Default fallthrough: not supported.
    result.browser = 'Not a supported browser.';
    return result;
  }

  return result;
}

/**
 * Checks if something is an object.
 *
 * @param {*} val The something you want to check.
 * @return true if val is an object, false otherwise.
 */
function isObject(val) {
  return Object.prototype.toString.call(val) === '[object Object]';
}

/**
 * Remove all empty objects and undefined values
 * from a nested object -- an enhanced and vanilla version
 * of Lodash's `compact`.
 */
function compactObject(data) {
  if (!isObject(data)) {
    return data;
  }

  return Object.keys(data).reduce(function(accumulator, key) {
    const isObj = isObject(data[key]);
    const value = isObj ? compactObject(data[key]) : data[key];
    const isEmptyObject = isObj && !Object.keys(value).length;
    if (value === undefined || isEmptyObject) {
      return accumulator;
    }
    return Object.assign(accumulator, {[key]: value});
  }, {});
}

/* iterates the stats graph recursively. */
function walkStats(stats, base, resultSet) {
  if (!base || resultSet.has(base.id)) {
    return;
  }
  resultSet.set(base.id, base);
  Object.keys(base).forEach(name => {
    if (name.endsWith('Id')) {
      walkStats(stats, stats.get(base[name]), resultSet);
    } else if (name.endsWith('Ids')) {
      base[name].forEach(id => {
        walkStats(stats, stats.get(id), resultSet);
      });
    }
  });
}

/* filter getStats for a sender/receiver track. */
function filterStats(result, track, outbound) {
  const streamStatsType = outbound ? 'outbound-rtp' : 'inbound-rtp';
  const filteredResult = new Map();
  if (track === null) {
    return filteredResult;
  }
  const trackStats = [];
  result.forEach(value => {
    if (value.type === 'track' &&
        value.trackIdentifier === track.id) {
      trackStats.push(value);
    }
  });
  trackStats.forEach(trackStat => {
    result.forEach(stats => {
      if (stats.type === streamStatsType && stats.trackId === trackStat.id) {
        walkStats(result, stats, filteredResult);
      }
    });
  });
  return filteredResult;
}

/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
/* eslint-env node */
const logging = log;

function shimGetUserMedia$2(window, browserDetails) {
  const navigator = window && window.navigator;

  if (!navigator.mediaDevices) {
    return;
  }

  const constraintsToChrome_ = function(c) {
    if (typeof c !== 'object' || c.mandatory || c.optional) {
      return c;
    }
    const cc = {};
    Object.keys(c).forEach(key => {
      if (key === 'require' || key === 'advanced' || key === 'mediaSource') {
        return;
      }
      const r = (typeof c[key] === 'object') ? c[key] : {ideal: c[key]};
      if (r.exact !== undefined && typeof r.exact === 'number') {
        r.min = r.max = r.exact;
      }
      const oldname_ = function(prefix, name) {
        if (prefix) {
          return prefix + name.charAt(0).toUpperCase() + name.slice(1);
        }
        return (name === 'deviceId') ? 'sourceId' : name;
      };
      if (r.ideal !== undefined) {
        cc.optional = cc.optional || [];
        let oc = {};
        if (typeof r.ideal === 'number') {
          oc[oldname_('min', key)] = r.ideal;
          cc.optional.push(oc);
          oc = {};
          oc[oldname_('max', key)] = r.ideal;
          cc.optional.push(oc);
        } else {
          oc[oldname_('', key)] = r.ideal;
          cc.optional.push(oc);
        }
      }
      if (r.exact !== undefined && typeof r.exact !== 'number') {
        cc.mandatory = cc.mandatory || {};
        cc.mandatory[oldname_('', key)] = r.exact;
      } else {
        ['min', 'max'].forEach(mix => {
          if (r[mix] !== undefined) {
            cc.mandatory = cc.mandatory || {};
            cc.mandatory[oldname_(mix, key)] = r[mix];
          }
        });
      }
    });
    if (c.advanced) {
      cc.optional = (cc.optional || []).concat(c.advanced);
    }
    return cc;
  };

  const shimConstraints_ = function(constraints, func) {
    if (browserDetails.version >= 61) {
      return func(constraints);
    }
    constraints = JSON.parse(JSON.stringify(constraints));
    if (constraints && typeof constraints.audio === 'object') {
      const remap = function(obj, a, b) {
        if (a in obj && !(b in obj)) {
          obj[b] = obj[a];
          delete obj[a];
        }
      };
      constraints = JSON.parse(JSON.stringify(constraints));
      remap(constraints.audio, 'autoGainControl', 'googAutoGainControl');
      remap(constraints.audio, 'noiseSuppression', 'googNoiseSuppression');
      constraints.audio = constraintsToChrome_(constraints.audio);
    }
    if (constraints && typeof constraints.video === 'object') {
      // Shim facingMode for mobile & surface pro.
      let face = constraints.video.facingMode;
      face = face && ((typeof face === 'object') ? face : {ideal: face});
      const getSupportedFacingModeLies = browserDetails.version < 66;

      if ((face && (face.exact === 'user' || face.exact === 'environment' ||
                    face.ideal === 'user' || face.ideal === 'environment')) &&
          !(navigator.mediaDevices.getSupportedConstraints &&
            navigator.mediaDevices.getSupportedConstraints().facingMode &&
            !getSupportedFacingModeLies)) {
        delete constraints.video.facingMode;
        let matches;
        if (face.exact === 'environment' || face.ideal === 'environment') {
          matches = ['back', 'rear'];
        } else if (face.exact === 'user' || face.ideal === 'user') {
          matches = ['front'];
        }
        if (matches) {
          // Look for matches in label, or use last cam for back (typical).
          return navigator.mediaDevices.enumerateDevices()
            .then(devices => {
              devices = devices.filter(d => d.kind === 'videoinput');
              let dev = devices.find(d => matches.some(match =>
                d.label.toLowerCase().includes(match)));
              if (!dev && devices.length && matches.includes('back')) {
                dev = devices[devices.length - 1]; // more likely the back cam
              }
              if (dev) {
                constraints.video.deviceId = face.exact
                  ? {exact: dev.deviceId}
                  : {ideal: dev.deviceId};
              }
              constraints.video = constraintsToChrome_(constraints.video);
              logging('chrome: ' + JSON.stringify(constraints));
              return func(constraints);
            });
        }
      }
      constraints.video = constraintsToChrome_(constraints.video);
    }
    logging('chrome: ' + JSON.stringify(constraints));
    return func(constraints);
  };

  const shimError_ = function(e) {
    if (browserDetails.version >= 64) {
      return e;
    }
    return {
      name: {
        PermissionDeniedError: 'NotAllowedError',
        PermissionDismissedError: 'NotAllowedError',
        InvalidStateError: 'NotAllowedError',
        DevicesNotFoundError: 'NotFoundError',
        ConstraintNotSatisfiedError: 'OverconstrainedError',
        TrackStartError: 'NotReadableError',
        MediaDeviceFailedDueToShutdown: 'NotAllowedError',
        MediaDeviceKillSwitchOn: 'NotAllowedError',
        TabCaptureError: 'AbortError',
        ScreenCaptureError: 'AbortError',
        DeviceCaptureError: 'AbortError'
      }[e.name] || e.name,
      message: e.message,
      constraint: e.constraint || e.constraintName,
      toString() {
        return this.name + (this.message && ': ') + this.message;
      }
    };
  };

  const getUserMedia_ = function(constraints, onSuccess, onError) {
    shimConstraints_(constraints, c => {
      navigator.webkitGetUserMedia(c, onSuccess, e => {
        if (onError) {
          onError(shimError_(e));
        }
      });
    });
  };
  navigator.getUserMedia = getUserMedia_.bind(navigator);

  // Even though Chrome 45 has navigator.mediaDevices and a getUserMedia
  // function which returns a Promise, it does not accept spec-style
  // constraints.
  if (navigator.mediaDevices.getUserMedia) {
    const origGetUserMedia = navigator.mediaDevices.getUserMedia.
      bind(navigator.mediaDevices);
    navigator.mediaDevices.getUserMedia = function(cs) {
      return shimConstraints_(cs, c => origGetUserMedia(c).then(stream => {
        if (c.audio && !stream.getAudioTracks().length ||
            c.video && !stream.getVideoTracks().length) {
          stream.getTracks().forEach(track => {
            track.stop();
          });
          throw new DOMException('', 'NotFoundError');
        }
        return stream;
      }, e => Promise.reject(shimError_(e))));
    };
  }
}

/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
/* eslint-env node */

function shimMediaStream(window) {
  window.MediaStream = window.MediaStream || window.webkitMediaStream;
}

function shimOnTrack$1(window) {
  if (typeof window === 'object' && window.RTCPeerConnection && !('ontrack' in
      window.RTCPeerConnection.prototype)) {
    Object.defineProperty(window.RTCPeerConnection.prototype, 'ontrack', {
      get() {
        return this._ontrack;
      },
      set(f) {
        if (this._ontrack) {
          this.removeEventListener('track', this._ontrack);
        }
        this.addEventListener('track', this._ontrack = f);
      },
      enumerable: true,
      configurable: true
    });
    const origSetRemoteDescription =
        window.RTCPeerConnection.prototype.setRemoteDescription;
    window.RTCPeerConnection.prototype.setRemoteDescription =
      function setRemoteDescription() {
        if (!this._ontrackpoly) {
          this._ontrackpoly = (e) => {
            // onaddstream does not fire when a track is added to an existing
            // stream. But stream.onaddtrack is implemented so we use that.
            e.stream.addEventListener('addtrack', te => {
              let receiver;
              if (window.RTCPeerConnection.prototype.getReceivers) {
                receiver = this.getReceivers()
                  .find(r => r.track && r.track.id === te.track.id);
              } else {
                receiver = {track: te.track};
              }

              const event = new Event('track');
              event.track = te.track;
              event.receiver = receiver;
              event.transceiver = {receiver};
              event.streams = [e.stream];
              this.dispatchEvent(event);
            });
            e.stream.getTracks().forEach(track => {
              let receiver;
              if (window.RTCPeerConnection.prototype.getReceivers) {
                receiver = this.getReceivers()
                  .find(r => r.track && r.track.id === track.id);
              } else {
                receiver = {track};
              }
              const event = new Event('track');
              event.track = track;
              event.receiver = receiver;
              event.transceiver = {receiver};
              event.streams = [e.stream];
              this.dispatchEvent(event);
            });
          };
          this.addEventListener('addstream', this._ontrackpoly);
        }
        return origSetRemoteDescription.apply(this, arguments);
      };
  } else {
    // even if RTCRtpTransceiver is in window, it is only used and
    // emitted in unified-plan. Unfortunately this means we need
    // to unconditionally wrap the event.
    wrapPeerConnectionEvent(window, 'track', e => {
      if (!e.transceiver) {
        Object.defineProperty(e, 'transceiver',
          {value: {receiver: e.receiver}});
      }
      return e;
    });
  }
}

function shimGetSendersWithDtmf(window) {
  // Overrides addTrack/removeTrack, depends on shimAddTrackRemoveTrack.
  if (typeof window === 'object' && window.RTCPeerConnection &&
      !('getSenders' in window.RTCPeerConnection.prototype) &&
      'createDTMFSender' in window.RTCPeerConnection.prototype) {
    const shimSenderWithDtmf = function(pc, track) {
      return {
        track,
        get dtmf() {
          if (this._dtmf === undefined) {
            if (track.kind === 'audio') {
              this._dtmf = pc.createDTMFSender(track);
            } else {
              this._dtmf = null;
            }
          }
          return this._dtmf;
        },
        _pc: pc
      };
    };

    // augment addTrack when getSenders is not available.
    if (!window.RTCPeerConnection.prototype.getSenders) {
      window.RTCPeerConnection.prototype.getSenders = function getSenders() {
        this._senders = this._senders || [];
        return this._senders.slice(); // return a copy of the internal state.
      };
      const origAddTrack = window.RTCPeerConnection.prototype.addTrack;
      window.RTCPeerConnection.prototype.addTrack =
        function addTrack(track, stream) {
          let sender = origAddTrack.apply(this, arguments);
          if (!sender) {
            sender = shimSenderWithDtmf(this, track);
            this._senders.push(sender);
          }
          return sender;
        };

      const origRemoveTrack = window.RTCPeerConnection.prototype.removeTrack;
      window.RTCPeerConnection.prototype.removeTrack =
        function removeTrack(sender) {
          origRemoveTrack.apply(this, arguments);
          const idx = this._senders.indexOf(sender);
          if (idx !== -1) {
            this._senders.splice(idx, 1);
          }
        };
    }
    const origAddStream = window.RTCPeerConnection.prototype.addStream;
    window.RTCPeerConnection.prototype.addStream = function addStream(stream) {
      this._senders = this._senders || [];
      origAddStream.apply(this, [stream]);
      stream.getTracks().forEach(track => {
        this._senders.push(shimSenderWithDtmf(this, track));
      });
    };

    const origRemoveStream = window.RTCPeerConnection.prototype.removeStream;
    window.RTCPeerConnection.prototype.removeStream =
      function removeStream(stream) {
        this._senders = this._senders || [];
        origRemoveStream.apply(this, [stream]);

        stream.getTracks().forEach(track => {
          const sender = this._senders.find(s => s.track === track);
          if (sender) { // remove sender
            this._senders.splice(this._senders.indexOf(sender), 1);
          }
        });
      };
  } else if (typeof window === 'object' && window.RTCPeerConnection &&
             'getSenders' in window.RTCPeerConnection.prototype &&
             'createDTMFSender' in window.RTCPeerConnection.prototype &&
             window.RTCRtpSender &&
             !('dtmf' in window.RTCRtpSender.prototype)) {
    const origGetSenders = window.RTCPeerConnection.prototype.getSenders;
    window.RTCPeerConnection.prototype.getSenders = function getSenders() {
      const senders = origGetSenders.apply(this, []);
      senders.forEach(sender => sender._pc = this);
      return senders;
    };

    Object.defineProperty(window.RTCRtpSender.prototype, 'dtmf', {
      get() {
        if (this._dtmf === undefined) {
          if (this.track.kind === 'audio') {
            this._dtmf = this._pc.createDTMFSender(this.track);
          } else {
            this._dtmf = null;
          }
        }
        return this._dtmf;
      }
    });
  }
}

function shimSenderReceiverGetStats(window) {
  if (!(typeof window === 'object' && window.RTCPeerConnection &&
      window.RTCRtpSender && window.RTCRtpReceiver)) {
    return;
  }

  // shim sender stats.
  if (!('getStats' in window.RTCRtpSender.prototype)) {
    const origGetSenders = window.RTCPeerConnection.prototype.getSenders;
    if (origGetSenders) {
      window.RTCPeerConnection.prototype.getSenders = function getSenders() {
        const senders = origGetSenders.apply(this, []);
        senders.forEach(sender => sender._pc = this);
        return senders;
      };
    }

    const origAddTrack = window.RTCPeerConnection.prototype.addTrack;
    if (origAddTrack) {
      window.RTCPeerConnection.prototype.addTrack = function addTrack() {
        const sender = origAddTrack.apply(this, arguments);
        sender._pc = this;
        return sender;
      };
    }
    window.RTCRtpSender.prototype.getStats = function getStats() {
      const sender = this;
      return this._pc.getStats().then(result =>
        /* Note: this will include stats of all senders that
         *   send a track with the same id as sender.track as
         *   it is not possible to identify the RTCRtpSender.
         */
        filterStats(result, sender.track, true));
    };
  }

  // shim receiver stats.
  if (!('getStats' in window.RTCRtpReceiver.prototype)) {
    const origGetReceivers = window.RTCPeerConnection.prototype.getReceivers;
    if (origGetReceivers) {
      window.RTCPeerConnection.prototype.getReceivers =
        function getReceivers() {
          const receivers = origGetReceivers.apply(this, []);
          receivers.forEach(receiver => receiver._pc = this);
          return receivers;
        };
    }
    wrapPeerConnectionEvent(window, 'track', e => {
      e.receiver._pc = e.srcElement;
      return e;
    });
    window.RTCRtpReceiver.prototype.getStats = function getStats() {
      const receiver = this;
      return this._pc.getStats().then(result =>
        filterStats(result, receiver.track, false));
    };
  }

  if (!('getStats' in window.RTCRtpSender.prototype &&
      'getStats' in window.RTCRtpReceiver.prototype)) {
    return;
  }

  // shim RTCPeerConnection.getStats(track).
  const origGetStats = window.RTCPeerConnection.prototype.getStats;
  window.RTCPeerConnection.prototype.getStats = function getStats() {
    if (arguments.length > 0 &&
        arguments[0] instanceof window.MediaStreamTrack) {
      const track = arguments[0];
      let sender;
      let receiver;
      let err;
      this.getSenders().forEach(s => {
        if (s.track === track) {
          if (sender) {
            err = true;
          } else {
            sender = s;
          }
        }
      });
      this.getReceivers().forEach(r => {
        if (r.track === track) {
          if (receiver) {
            err = true;
          } else {
            receiver = r;
          }
        }
        return r.track === track;
      });
      if (err || (sender && receiver)) {
        return Promise.reject(new DOMException(
          'There are more than one sender or receiver for the track.',
          'InvalidAccessError'));
      } else if (sender) {
        return sender.getStats();
      } else if (receiver) {
        return receiver.getStats();
      }
      return Promise.reject(new DOMException(
        'There is no sender or receiver for the track.',
        'InvalidAccessError'));
    }
    return origGetStats.apply(this, arguments);
  };
}

function shimAddTrackRemoveTrackWithNative(window) {
  // shim addTrack/removeTrack with native variants in order to make
  // the interactions with legacy getLocalStreams behave as in other browsers.
  // Keeps a mapping stream.id => [stream, rtpsenders...]
  window.RTCPeerConnection.prototype.getLocalStreams =
    function getLocalStreams() {
      this._shimmedLocalStreams = this._shimmedLocalStreams || {};
      return Object.keys(this._shimmedLocalStreams)
        .map(streamId => this._shimmedLocalStreams[streamId][0]);
    };

  const origAddTrack = window.RTCPeerConnection.prototype.addTrack;
  window.RTCPeerConnection.prototype.addTrack =
    function addTrack(track, stream) {
      if (!stream) {
        return origAddTrack.apply(this, arguments);
      }
      this._shimmedLocalStreams = this._shimmedLocalStreams || {};

      const sender = origAddTrack.apply(this, arguments);
      if (!this._shimmedLocalStreams[stream.id]) {
        this._shimmedLocalStreams[stream.id] = [stream, sender];
      } else if (this._shimmedLocalStreams[stream.id].indexOf(sender) === -1) {
        this._shimmedLocalStreams[stream.id].push(sender);
      }
      return sender;
    };

  const origAddStream = window.RTCPeerConnection.prototype.addStream;
  window.RTCPeerConnection.prototype.addStream = function addStream(stream) {
    this._shimmedLocalStreams = this._shimmedLocalStreams || {};

    stream.getTracks().forEach(track => {
      const alreadyExists = this.getSenders().find(s => s.track === track);
      if (alreadyExists) {
        throw new DOMException('Track already exists.',
          'InvalidAccessError');
      }
    });
    const existingSenders = this.getSenders();
    origAddStream.apply(this, arguments);
    const newSenders = this.getSenders()
      .filter(newSender => existingSenders.indexOf(newSender) === -1);
    this._shimmedLocalStreams[stream.id] = [stream].concat(newSenders);
  };

  const origRemoveStream = window.RTCPeerConnection.prototype.removeStream;
  window.RTCPeerConnection.prototype.removeStream =
    function removeStream(stream) {
      this._shimmedLocalStreams = this._shimmedLocalStreams || {};
      delete this._shimmedLocalStreams[stream.id];
      return origRemoveStream.apply(this, arguments);
    };

  const origRemoveTrack = window.RTCPeerConnection.prototype.removeTrack;
  window.RTCPeerConnection.prototype.removeTrack =
    function removeTrack(sender) {
      this._shimmedLocalStreams = this._shimmedLocalStreams || {};
      if (sender) {
        Object.keys(this._shimmedLocalStreams).forEach(streamId => {
          const idx = this._shimmedLocalStreams[streamId].indexOf(sender);
          if (idx !== -1) {
            this._shimmedLocalStreams[streamId].splice(idx, 1);
          }
          if (this._shimmedLocalStreams[streamId].length === 1) {
            delete this._shimmedLocalStreams[streamId];
          }
        });
      }
      return origRemoveTrack.apply(this, arguments);
    };
}

function shimAddTrackRemoveTrack(window, browserDetails) {
  if (!window.RTCPeerConnection) {
    return;
  }
  // shim addTrack and removeTrack.
  if (window.RTCPeerConnection.prototype.addTrack &&
      browserDetails.version >= 65) {
    return shimAddTrackRemoveTrackWithNative(window);
  }

  // also shim pc.getLocalStreams when addTrack is shimmed
  // to return the original streams.
  const origGetLocalStreams = window.RTCPeerConnection.prototype
    .getLocalStreams;
  window.RTCPeerConnection.prototype.getLocalStreams =
    function getLocalStreams() {
      const nativeStreams = origGetLocalStreams.apply(this);
      this._reverseStreams = this._reverseStreams || {};
      return nativeStreams.map(stream => this._reverseStreams[stream.id]);
    };

  const origAddStream = window.RTCPeerConnection.prototype.addStream;
  window.RTCPeerConnection.prototype.addStream = function addStream(stream) {
    this._streams = this._streams || {};
    this._reverseStreams = this._reverseStreams || {};

    stream.getTracks().forEach(track => {
      const alreadyExists = this.getSenders().find(s => s.track === track);
      if (alreadyExists) {
        throw new DOMException('Track already exists.',
          'InvalidAccessError');
      }
    });
    // Add identity mapping for consistency with addTrack.
    // Unless this is being used with a stream from addTrack.
    if (!this._reverseStreams[stream.id]) {
      const newStream = new window.MediaStream(stream.getTracks());
      this._streams[stream.id] = newStream;
      this._reverseStreams[newStream.id] = stream;
      stream = newStream;
    }
    origAddStream.apply(this, [stream]);
  };

  const origRemoveStream = window.RTCPeerConnection.prototype.removeStream;
  window.RTCPeerConnection.prototype.removeStream =
    function removeStream(stream) {
      this._streams = this._streams || {};
      this._reverseStreams = this._reverseStreams || {};

      origRemoveStream.apply(this, [(this._streams[stream.id] || stream)]);
      delete this._reverseStreams[(this._streams[stream.id] ?
        this._streams[stream.id].id : stream.id)];
      delete this._streams[stream.id];
    };

  window.RTCPeerConnection.prototype.addTrack =
    function addTrack(track, stream) {
      if (this.signalingState === 'closed') {
        throw new DOMException(
          'The RTCPeerConnection\'s signalingState is \'closed\'.',
          'InvalidStateError');
      }
      const streams = [].slice.call(arguments, 1);
      if (streams.length !== 1 ||
          !streams[0].getTracks().find(t => t === track)) {
        // this is not fully correct but all we can manage without
        // [[associated MediaStreams]] internal slot.
        throw new DOMException(
          'The adapter.js addTrack polyfill only supports a single ' +
          ' stream which is associated with the specified track.',
          'NotSupportedError');
      }

      const alreadyExists = this.getSenders().find(s => s.track === track);
      if (alreadyExists) {
        throw new DOMException('Track already exists.',
          'InvalidAccessError');
      }

      this._streams = this._streams || {};
      this._reverseStreams = this._reverseStreams || {};
      const oldStream = this._streams[stream.id];
      if (oldStream) {
        // this is using odd Chrome behaviour, use with caution:
        // https://bugs.chromium.org/p/webrtc/issues/detail?id=7815
        // Note: we rely on the high-level addTrack/dtmf shim to
        // create the sender with a dtmf sender.
        oldStream.addTrack(track);

        // Trigger ONN async.
        Promise.resolve().then(() => {
          this.dispatchEvent(new Event('negotiationneeded'));
        });
      } else {
        const newStream = new window.MediaStream([track]);
        this._streams[stream.id] = newStream;
        this._reverseStreams[newStream.id] = stream;
        this.addStream(newStream);
      }
      return this.getSenders().find(s => s.track === track);
    };

  // replace the internal stream id with the external one and
  // vice versa.
  function replaceInternalStreamId(pc, description) {
    let sdp = description.sdp;
    Object.keys(pc._reverseStreams || []).forEach(internalId => {
      const externalStream = pc._reverseStreams[internalId];
      const internalStream = pc._streams[externalStream.id];
      sdp = sdp.replace(new RegExp(internalStream.id, 'g'),
        externalStream.id);
    });
    return new RTCSessionDescription({
      type: description.type,
      sdp
    });
  }
  function replaceExternalStreamId(pc, description) {
    let sdp = description.sdp;
    Object.keys(pc._reverseStreams || []).forEach(internalId => {
      const externalStream = pc._reverseStreams[internalId];
      const internalStream = pc._streams[externalStream.id];
      sdp = sdp.replace(new RegExp(externalStream.id, 'g'),
        internalStream.id);
    });
    return new RTCSessionDescription({
      type: description.type,
      sdp
    });
  }
  ['createOffer', 'createAnswer'].forEach(function(method) {
    const nativeMethod = window.RTCPeerConnection.prototype[method];
    const methodObj = {[method]() {
      const args = arguments;
      const isLegacyCall = arguments.length &&
          typeof arguments[0] === 'function';
      if (isLegacyCall) {
        return nativeMethod.apply(this, [
          (description) => {
            const desc = replaceInternalStreamId(this, description);
            args[0].apply(null, [desc]);
          },
          (err) => {
            if (args[1]) {
              args[1].apply(null, err);
            }
          }, arguments[2]
        ]);
      }
      return nativeMethod.apply(this, arguments)
        .then(description => replaceInternalStreamId(this, description));
    }};
    window.RTCPeerConnection.prototype[method] = methodObj[method];
  });

  const origSetLocalDescription =
      window.RTCPeerConnection.prototype.setLocalDescription;
  window.RTCPeerConnection.prototype.setLocalDescription =
    function setLocalDescription() {
      if (!arguments.length || !arguments[0].type) {
        return origSetLocalDescription.apply(this, arguments);
      }
      arguments[0] = replaceExternalStreamId(this, arguments[0]);
      return origSetLocalDescription.apply(this, arguments);
    };

  // TODO: mangle getStats: https://w3c.github.io/webrtc-stats/#dom-rtcmediastreamstats-streamidentifier

  const origLocalDescription = Object.getOwnPropertyDescriptor(
    window.RTCPeerConnection.prototype, 'localDescription');
  Object.defineProperty(window.RTCPeerConnection.prototype,
    'localDescription', {
      get() {
        const description = origLocalDescription.get.apply(this);
        if (description.type === '') {
          return description;
        }
        return replaceInternalStreamId(this, description);
      }
    });

  window.RTCPeerConnection.prototype.removeTrack =
    function removeTrack(sender) {
      if (this.signalingState === 'closed') {
        throw new DOMException(
          'The RTCPeerConnection\'s signalingState is \'closed\'.',
          'InvalidStateError');
      }
      // We can not yet check for sender instanceof RTCRtpSender
      // since we shim RTPSender. So we check if sender._pc is set.
      if (!sender._pc) {
        throw new DOMException('Argument 1 of RTCPeerConnection.removeTrack ' +
            'does not implement interface RTCRtpSender.', 'TypeError');
      }
      const isLocal = sender._pc === this;
      if (!isLocal) {
        throw new DOMException('Sender was not created by this connection.',
          'InvalidAccessError');
      }

      // Search for the native stream the senders track belongs to.
      this._streams = this._streams || {};
      let stream;
      Object.keys(this._streams).forEach(streamid => {
        const hasTrack = this._streams[streamid].getTracks()
          .find(track => sender.track === track);
        if (hasTrack) {
          stream = this._streams[streamid];
        }
      });

      if (stream) {
        if (stream.getTracks().length === 1) {
          // if this is the last track of the stream, remove the stream. This
          // takes care of any shimmed _senders.
          this.removeStream(this._reverseStreams[stream.id]);
        } else {
          // relying on the same odd chrome behaviour as above.
          stream.removeTrack(sender.track);
        }
        this.dispatchEvent(new Event('negotiationneeded'));
      }
    };
}

function shimPeerConnection$1(window, browserDetails) {
  if (!window.RTCPeerConnection && window.webkitRTCPeerConnection) {
    // very basic support for old versions.
    window.RTCPeerConnection = window.webkitRTCPeerConnection;
  }
  if (!window.RTCPeerConnection) {
    return;
  }

  // shim implicit creation of RTCSessionDescription/RTCIceCandidate
  if (browserDetails.version < 53) {
    ['setLocalDescription', 'setRemoteDescription', 'addIceCandidate']
      .forEach(function(method) {
        const nativeMethod = window.RTCPeerConnection.prototype[method];
        const methodObj = {[method]() {
          arguments[0] = new ((method === 'addIceCandidate') ?
            window.RTCIceCandidate :
            window.RTCSessionDescription)(arguments[0]);
          return nativeMethod.apply(this, arguments);
        }};
        window.RTCPeerConnection.prototype[method] = methodObj[method];
      });
  }
}

// Attempt to fix ONN in plan-b mode.
function fixNegotiationNeeded(window, browserDetails) {
  wrapPeerConnectionEvent(window, 'negotiationneeded', e => {
    const pc = e.target;
    if (browserDetails.version < 72 || (pc.getConfiguration &&
        pc.getConfiguration().sdpSemantics === 'plan-b')) {
      if (pc.signalingState !== 'stable') {
        return;
      }
    }
    return e;
  });
}

var chromeShim = /*#__PURE__*/Object.freeze({
    __proto__: null,
    fixNegotiationNeeded: fixNegotiationNeeded,
    shimAddTrackRemoveTrack: shimAddTrackRemoveTrack,
    shimAddTrackRemoveTrackWithNative: shimAddTrackRemoveTrackWithNative,
    shimGetSendersWithDtmf: shimGetSendersWithDtmf,
    shimGetUserMedia: shimGetUserMedia$2,
    shimMediaStream: shimMediaStream,
    shimOnTrack: shimOnTrack$1,
    shimPeerConnection: shimPeerConnection$1,
    shimSenderReceiverGetStats: shimSenderReceiverGetStats
});

/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
/* eslint-env node */

function shimGetUserMedia$1(window, browserDetails) {
  const navigator = window && window.navigator;
  const MediaStreamTrack = window && window.MediaStreamTrack;

  navigator.getUserMedia = function(constraints, onSuccess, onError) {
    // Replace Firefox 44+'s deprecation warning with unprefixed version.
    deprecated('navigator.getUserMedia',
      'navigator.mediaDevices.getUserMedia');
    navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);
  };

  if (!(browserDetails.version > 55 &&
      'autoGainControl' in navigator.mediaDevices.getSupportedConstraints())) {
    const remap = function(obj, a, b) {
      if (a in obj && !(b in obj)) {
        obj[b] = obj[a];
        delete obj[a];
      }
    };

    const nativeGetUserMedia = navigator.mediaDevices.getUserMedia.
      bind(navigator.mediaDevices);
    navigator.mediaDevices.getUserMedia = function(c) {
      if (typeof c === 'object' && typeof c.audio === 'object') {
        c = JSON.parse(JSON.stringify(c));
        remap(c.audio, 'autoGainControl', 'mozAutoGainControl');
        remap(c.audio, 'noiseSuppression', 'mozNoiseSuppression');
      }
      return nativeGetUserMedia(c);
    };

    if (MediaStreamTrack && MediaStreamTrack.prototype.getSettings) {
      const nativeGetSettings = MediaStreamTrack.prototype.getSettings;
      MediaStreamTrack.prototype.getSettings = function() {
        const obj = nativeGetSettings.apply(this, arguments);
        remap(obj, 'mozAutoGainControl', 'autoGainControl');
        remap(obj, 'mozNoiseSuppression', 'noiseSuppression');
        return obj;
      };
    }

    if (MediaStreamTrack && MediaStreamTrack.prototype.applyConstraints) {
      const nativeApplyConstraints =
        MediaStreamTrack.prototype.applyConstraints;
      MediaStreamTrack.prototype.applyConstraints = function(c) {
        if (this.kind === 'audio' && typeof c === 'object') {
          c = JSON.parse(JSON.stringify(c));
          remap(c, 'autoGainControl', 'mozAutoGainControl');
          remap(c, 'noiseSuppression', 'mozNoiseSuppression');
        }
        return nativeApplyConstraints.apply(this, [c]);
      };
    }
  }
}

/*
 *  Copyright (c) 2018 The adapter.js project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
/* eslint-env node */

function shimGetDisplayMedia(window, preferredMediaSource) {
  if (window.navigator.mediaDevices &&
    'getDisplayMedia' in window.navigator.mediaDevices) {
    return;
  }
  if (!(window.navigator.mediaDevices)) {
    return;
  }
  window.navigator.mediaDevices.getDisplayMedia =
    function getDisplayMedia(constraints) {
      if (!(constraints && constraints.video)) {
        const err = new DOMException('getDisplayMedia without video ' +
            'constraints is undefined');
        err.name = 'NotFoundError';
        // from https://heycam.github.io/webidl/#idl-DOMException-error-names
        err.code = 8;
        return Promise.reject(err);
      }
      if (constraints.video === true) {
        constraints.video = {mediaSource: preferredMediaSource};
      } else {
        constraints.video.mediaSource = preferredMediaSource;
      }
      return window.navigator.mediaDevices.getUserMedia(constraints);
    };
}

/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
/* eslint-env node */

function shimOnTrack(window) {
  if (typeof window === 'object' && window.RTCTrackEvent &&
      ('receiver' in window.RTCTrackEvent.prototype) &&
      !('transceiver' in window.RTCTrackEvent.prototype)) {
    Object.defineProperty(window.RTCTrackEvent.prototype, 'transceiver', {
      get() {
        return {receiver: this.receiver};
      }
    });
  }
}

function shimPeerConnection(window, browserDetails) {
  if (typeof window !== 'object' ||
      !(window.RTCPeerConnection || window.mozRTCPeerConnection)) {
    return; // probably media.peerconnection.enabled=false in about:config
  }
  if (!window.RTCPeerConnection && window.mozRTCPeerConnection) {
    // very basic support for old versions.
    window.RTCPeerConnection = window.mozRTCPeerConnection;
  }

  if (browserDetails.version < 53) {
    // shim away need for obsolete RTCIceCandidate/RTCSessionDescription.
    ['setLocalDescription', 'setRemoteDescription', 'addIceCandidate']
      .forEach(function(method) {
        const nativeMethod = window.RTCPeerConnection.prototype[method];
        const methodObj = {[method]() {
          arguments[0] = new ((method === 'addIceCandidate') ?
            window.RTCIceCandidate :
            window.RTCSessionDescription)(arguments[0]);
          return nativeMethod.apply(this, arguments);
        }};
        window.RTCPeerConnection.prototype[method] = methodObj[method];
      });
  }

  const modernStatsTypes = {
    inboundrtp: 'inbound-rtp',
    outboundrtp: 'outbound-rtp',
    candidatepair: 'candidate-pair',
    localcandidate: 'local-candidate',
    remotecandidate: 'remote-candidate'
  };

  const nativeGetStats = window.RTCPeerConnection.prototype.getStats;
  window.RTCPeerConnection.prototype.getStats = function getStats() {
    const [selector, onSucc, onErr] = arguments;
    return nativeGetStats.apply(this, [selector || null])
      .then(stats => {
        if (browserDetails.version < 53 && !onSucc) {
          // Shim only promise getStats with spec-hyphens in type names
          // Leave callback version alone; misc old uses of forEach before Map
          try {
            stats.forEach(stat => {
              stat.type = modernStatsTypes[stat.type] || stat.type;
            });
          } catch (e) {
            if (e.name !== 'TypeError') {
              throw e;
            }
            // Avoid TypeError: "type" is read-only, in old versions. 34-43ish
            stats.forEach((stat, i) => {
              stats.set(i, Object.assign({}, stat, {
                type: modernStatsTypes[stat.type] || stat.type
              }));
            });
          }
        }
        return stats;
      })
      .then(onSucc, onErr);
  };
}

function shimSenderGetStats(window) {
  if (!(typeof window === 'object' && window.RTCPeerConnection &&
      window.RTCRtpSender)) {
    return;
  }
  if (window.RTCRtpSender && 'getStats' in window.RTCRtpSender.prototype) {
    return;
  }
  const origGetSenders = window.RTCPeerConnection.prototype.getSenders;
  if (origGetSenders) {
    window.RTCPeerConnection.prototype.getSenders = function getSenders() {
      const senders = origGetSenders.apply(this, []);
      senders.forEach(sender => sender._pc = this);
      return senders;
    };
  }

  const origAddTrack = window.RTCPeerConnection.prototype.addTrack;
  if (origAddTrack) {
    window.RTCPeerConnection.prototype.addTrack = function addTrack() {
      const sender = origAddTrack.apply(this, arguments);
      sender._pc = this;
      return sender;
    };
  }
  window.RTCRtpSender.prototype.getStats = function getStats() {
    return this.track ? this._pc.getStats(this.track) :
      Promise.resolve(new Map());
  };
}

function shimReceiverGetStats(window) {
  if (!(typeof window === 'object' && window.RTCPeerConnection &&
      window.RTCRtpSender)) {
    return;
  }
  if (window.RTCRtpSender && 'getStats' in window.RTCRtpReceiver.prototype) {
    return;
  }
  const origGetReceivers = window.RTCPeerConnection.prototype.getReceivers;
  if (origGetReceivers) {
    window.RTCPeerConnection.prototype.getReceivers = function getReceivers() {
      const receivers = origGetReceivers.apply(this, []);
      receivers.forEach(receiver => receiver._pc = this);
      return receivers;
    };
  }
  wrapPeerConnectionEvent(window, 'track', e => {
    e.receiver._pc = e.srcElement;
    return e;
  });
  window.RTCRtpReceiver.prototype.getStats = function getStats() {
    return this._pc.getStats(this.track);
  };
}

function shimRemoveStream(window) {
  if (!window.RTCPeerConnection ||
      'removeStream' in window.RTCPeerConnection.prototype) {
    return;
  }
  window.RTCPeerConnection.prototype.removeStream =
    function removeStream(stream) {
      deprecated('removeStream', 'removeTrack');
      this.getSenders().forEach(sender => {
        if (sender.track && stream.getTracks().includes(sender.track)) {
          this.removeTrack(sender);
        }
      });
    };
}

function shimRTCDataChannel(window) {
  // rename DataChannel to RTCDataChannel (native fix in FF60):
  // https://bugzilla.mozilla.org/show_bug.cgi?id=1173851
  if (window.DataChannel && !window.RTCDataChannel) {
    window.RTCDataChannel = window.DataChannel;
  }
}

function shimAddTransceiver(window) {
  // https://github.com/webrtcHacks/adapter/issues/998#issuecomment-516921647
  // Firefox ignores the init sendEncodings options passed to addTransceiver
  // https://bugzilla.mozilla.org/show_bug.cgi?id=1396918
  if (!(typeof window === 'object' && window.RTCPeerConnection)) {
    return;
  }
  const origAddTransceiver = window.RTCPeerConnection.prototype.addTransceiver;
  if (origAddTransceiver) {
    window.RTCPeerConnection.prototype.addTransceiver =
      function addTransceiver() {
        this.setParametersPromises = [];
        // WebIDL input coercion and validation
        let sendEncodings = arguments[1] && arguments[1].sendEncodings;
        if (sendEncodings === undefined) {
          sendEncodings = [];
        }
        sendEncodings = [...sendEncodings];
        const shouldPerformCheck = sendEncodings.length > 0;
        if (shouldPerformCheck) {
          // If sendEncodings params are provided, validate grammar
          sendEncodings.forEach((encodingParam) => {
            if ('rid' in encodingParam) {
              const ridRegex = /^[a-z0-9]{0,16}$/i;
              if (!ridRegex.test(encodingParam.rid)) {
                throw new TypeError('Invalid RID value provided.');
              }
            }
            if ('scaleResolutionDownBy' in encodingParam) {
              if (!(parseFloat(encodingParam.scaleResolutionDownBy) >= 1.0)) {
                throw new RangeError('scale_resolution_down_by must be >= 1.0');
              }
            }
            if ('maxFramerate' in encodingParam) {
              if (!(parseFloat(encodingParam.maxFramerate) >= 0)) {
                throw new RangeError('max_framerate must be >= 0.0');
              }
            }
          });
        }
        const transceiver = origAddTransceiver.apply(this, arguments);
        if (shouldPerformCheck) {
          // Check if the init options were applied. If not we do this in an
          // asynchronous way and save the promise reference in a global object.
          // This is an ugly hack, but at the same time is way more robust than
          // checking the sender parameters before and after the createOffer
          // Also note that after the createoffer we are not 100% sure that
          // the params were asynchronously applied so we might miss the
          // opportunity to recreate offer.
          const {sender} = transceiver;
          const params = sender.getParameters();
          if (!('encodings' in params) ||
              // Avoid being fooled by patched getParameters() below.
              (params.encodings.length === 1 &&
               Object.keys(params.encodings[0]).length === 0)) {
            params.encodings = sendEncodings;
            sender.sendEncodings = sendEncodings;
            this.setParametersPromises.push(sender.setParameters(params)
              .then(() => {
                delete sender.sendEncodings;
              }).catch(() => {
                delete sender.sendEncodings;
              })
            );
          }
        }
        return transceiver;
      };
  }
}

function shimGetParameters(window) {
  if (!(typeof window === 'object' && window.RTCRtpSender)) {
    return;
  }
  const origGetParameters = window.RTCRtpSender.prototype.getParameters;
  if (origGetParameters) {
    window.RTCRtpSender.prototype.getParameters =
      function getParameters() {
        const params = origGetParameters.apply(this, arguments);
        if (!('encodings' in params)) {
          params.encodings = [].concat(this.sendEncodings || [{}]);
        }
        return params;
      };
  }
}

function shimCreateOffer(window) {
  // https://github.com/webrtcHacks/adapter/issues/998#issuecomment-516921647
  // Firefox ignores the init sendEncodings options passed to addTransceiver
  // https://bugzilla.mozilla.org/show_bug.cgi?id=1396918
  if (!(typeof window === 'object' && window.RTCPeerConnection)) {
    return;
  }
  const origCreateOffer = window.RTCPeerConnection.prototype.createOffer;
  window.RTCPeerConnection.prototype.createOffer = function createOffer() {
    if (this.setParametersPromises && this.setParametersPromises.length) {
      return Promise.all(this.setParametersPromises)
        .then(() => {
          return origCreateOffer.apply(this, arguments);
        })
        .finally(() => {
          this.setParametersPromises = [];
        });
    }
    return origCreateOffer.apply(this, arguments);
  };
}

function shimCreateAnswer(window) {
  // https://github.com/webrtcHacks/adapter/issues/998#issuecomment-516921647
  // Firefox ignores the init sendEncodings options passed to addTransceiver
  // https://bugzilla.mozilla.org/show_bug.cgi?id=1396918
  if (!(typeof window === 'object' && window.RTCPeerConnection)) {
    return;
  }
  const origCreateAnswer = window.RTCPeerConnection.prototype.createAnswer;
  window.RTCPeerConnection.prototype.createAnswer = function createAnswer() {
    if (this.setParametersPromises && this.setParametersPromises.length) {
      return Promise.all(this.setParametersPromises)
        .then(() => {
          return origCreateAnswer.apply(this, arguments);
        })
        .finally(() => {
          this.setParametersPromises = [];
        });
    }
    return origCreateAnswer.apply(this, arguments);
  };
}

var firefoxShim = /*#__PURE__*/Object.freeze({
    __proto__: null,
    shimAddTransceiver: shimAddTransceiver,
    shimCreateAnswer: shimCreateAnswer,
    shimCreateOffer: shimCreateOffer,
    shimGetDisplayMedia: shimGetDisplayMedia,
    shimGetParameters: shimGetParameters,
    shimGetUserMedia: shimGetUserMedia$1,
    shimOnTrack: shimOnTrack,
    shimPeerConnection: shimPeerConnection,
    shimRTCDataChannel: shimRTCDataChannel,
    shimReceiverGetStats: shimReceiverGetStats,
    shimRemoveStream: shimRemoveStream,
    shimSenderGetStats: shimSenderGetStats
});

/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

function shimLocalStreamsAPI(window) {
  if (typeof window !== 'object' || !window.RTCPeerConnection) {
    return;
  }
  if (!('getLocalStreams' in window.RTCPeerConnection.prototype)) {
    window.RTCPeerConnection.prototype.getLocalStreams =
      function getLocalStreams() {
        if (!this._localStreams) {
          this._localStreams = [];
        }
        return this._localStreams;
      };
  }
  if (!('addStream' in window.RTCPeerConnection.prototype)) {
    const _addTrack = window.RTCPeerConnection.prototype.addTrack;
    window.RTCPeerConnection.prototype.addStream = function addStream(stream) {
      if (!this._localStreams) {
        this._localStreams = [];
      }
      if (!this._localStreams.includes(stream)) {
        this._localStreams.push(stream);
      }
      // Try to emulate Chrome's behaviour of adding in audio-video order.
      // Safari orders by track id.
      stream.getAudioTracks().forEach(track => _addTrack.call(this, track,
        stream));
      stream.getVideoTracks().forEach(track => _addTrack.call(this, track,
        stream));
    };

    window.RTCPeerConnection.prototype.addTrack =
      function addTrack(track, ...streams) {
        if (streams) {
          streams.forEach((stream) => {
            if (!this._localStreams) {
              this._localStreams = [stream];
            } else if (!this._localStreams.includes(stream)) {
              this._localStreams.push(stream);
            }
          });
        }
        return _addTrack.apply(this, arguments);
      };
  }
  if (!('removeStream' in window.RTCPeerConnection.prototype)) {
    window.RTCPeerConnection.prototype.removeStream =
      function removeStream(stream) {
        if (!this._localStreams) {
          this._localStreams = [];
        }
        const index = this._localStreams.indexOf(stream);
        if (index === -1) {
          return;
        }
        this._localStreams.splice(index, 1);
        const tracks = stream.getTracks();
        this.getSenders().forEach(sender => {
          if (tracks.includes(sender.track)) {
            this.removeTrack(sender);
          }
        });
      };
  }
}

function shimRemoteStreamsAPI(window) {
  if (typeof window !== 'object' || !window.RTCPeerConnection) {
    return;
  }
  if (!('getRemoteStreams' in window.RTCPeerConnection.prototype)) {
    window.RTCPeerConnection.prototype.getRemoteStreams =
      function getRemoteStreams() {
        return this._remoteStreams ? this._remoteStreams : [];
      };
  }
  if (!('onaddstream' in window.RTCPeerConnection.prototype)) {
    Object.defineProperty(window.RTCPeerConnection.prototype, 'onaddstream', {
      get() {
        return this._onaddstream;
      },
      set(f) {
        if (this._onaddstream) {
          this.removeEventListener('addstream', this._onaddstream);
          this.removeEventListener('track', this._onaddstreampoly);
        }
        this.addEventListener('addstream', this._onaddstream = f);
        this.addEventListener('track', this._onaddstreampoly = (e) => {
          e.streams.forEach(stream => {
            if (!this._remoteStreams) {
              this._remoteStreams = [];
            }
            if (this._remoteStreams.includes(stream)) {
              return;
            }
            this._remoteStreams.push(stream);
            const event = new Event('addstream');
            event.stream = stream;
            this.dispatchEvent(event);
          });
        });
      }
    });
    const origSetRemoteDescription =
      window.RTCPeerConnection.prototype.setRemoteDescription;
    window.RTCPeerConnection.prototype.setRemoteDescription =
      function setRemoteDescription() {
        const pc = this;
        if (!this._onaddstreampoly) {
          this.addEventListener('track', this._onaddstreampoly = function(e) {
            e.streams.forEach(stream => {
              if (!pc._remoteStreams) {
                pc._remoteStreams = [];
              }
              if (pc._remoteStreams.indexOf(stream) >= 0) {
                return;
              }
              pc._remoteStreams.push(stream);
              const event = new Event('addstream');
              event.stream = stream;
              pc.dispatchEvent(event);
            });
          });
        }
        return origSetRemoteDescription.apply(pc, arguments);
      };
  }
}

function shimCallbacksAPI(window) {
  if (typeof window !== 'object' || !window.RTCPeerConnection) {
    return;
  }
  const prototype = window.RTCPeerConnection.prototype;
  const origCreateOffer = prototype.createOffer;
  const origCreateAnswer = prototype.createAnswer;
  const setLocalDescription = prototype.setLocalDescription;
  const setRemoteDescription = prototype.setRemoteDescription;
  const addIceCandidate = prototype.addIceCandidate;

  prototype.createOffer =
    function createOffer(successCallback, failureCallback) {
      const options = (arguments.length >= 2) ? arguments[2] : arguments[0];
      const promise = origCreateOffer.apply(this, [options]);
      if (!failureCallback) {
        return promise;
      }
      promise.then(successCallback, failureCallback);
      return Promise.resolve();
    };

  prototype.createAnswer =
    function createAnswer(successCallback, failureCallback) {
      const options = (arguments.length >= 2) ? arguments[2] : arguments[0];
      const promise = origCreateAnswer.apply(this, [options]);
      if (!failureCallback) {
        return promise;
      }
      promise.then(successCallback, failureCallback);
      return Promise.resolve();
    };

  let withCallback = function(description, successCallback, failureCallback) {
    const promise = setLocalDescription.apply(this, [description]);
    if (!failureCallback) {
      return promise;
    }
    promise.then(successCallback, failureCallback);
    return Promise.resolve();
  };
  prototype.setLocalDescription = withCallback;

  withCallback = function(description, successCallback, failureCallback) {
    const promise = setRemoteDescription.apply(this, [description]);
    if (!failureCallback) {
      return promise;
    }
    promise.then(successCallback, failureCallback);
    return Promise.resolve();
  };
  prototype.setRemoteDescription = withCallback;

  withCallback = function(candidate, successCallback, failureCallback) {
    const promise = addIceCandidate.apply(this, [candidate]);
    if (!failureCallback) {
      return promise;
    }
    promise.then(successCallback, failureCallback);
    return Promise.resolve();
  };
  prototype.addIceCandidate = withCallback;
}

function shimGetUserMedia(window) {
  const navigator = window && window.navigator;

  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    // shim not needed in Safari 12.1
    const mediaDevices = navigator.mediaDevices;
    const _getUserMedia = mediaDevices.getUserMedia.bind(mediaDevices);
    navigator.mediaDevices.getUserMedia = (constraints) => {
      return _getUserMedia(shimConstraints(constraints));
    };
  }

  if (!navigator.getUserMedia && navigator.mediaDevices &&
    navigator.mediaDevices.getUserMedia) {
    navigator.getUserMedia = function getUserMedia(constraints, cb, errcb) {
      navigator.mediaDevices.getUserMedia(constraints)
        .then(cb, errcb);
    }.bind(navigator);
  }
}

function shimConstraints(constraints) {
  if (constraints && constraints.video !== undefined) {
    return Object.assign({},
      constraints,
      {video: compactObject(constraints.video)}
    );
  }

  return constraints;
}

function shimRTCIceServerUrls(window) {
  if (!window.RTCPeerConnection) {
    return;
  }
  // migrate from non-spec RTCIceServer.url to RTCIceServer.urls
  const OrigPeerConnection = window.RTCPeerConnection;
  window.RTCPeerConnection =
    function RTCPeerConnection(pcConfig, pcConstraints) {
      if (pcConfig && pcConfig.iceServers) {
        const newIceServers = [];
        for (let i = 0; i < pcConfig.iceServers.length; i++) {
          let server = pcConfig.iceServers[i];
          if (server.urls === undefined && server.url) {
            deprecated('RTCIceServer.url', 'RTCIceServer.urls');
            server = JSON.parse(JSON.stringify(server));
            server.urls = server.url;
            delete server.url;
            newIceServers.push(server);
          } else {
            newIceServers.push(pcConfig.iceServers[i]);
          }
        }
        pcConfig.iceServers = newIceServers;
      }
      return new OrigPeerConnection(pcConfig, pcConstraints);
    };
  window.RTCPeerConnection.prototype = OrigPeerConnection.prototype;
  // wrap static methods. Currently just generateCertificate.
  if ('generateCertificate' in OrigPeerConnection) {
    Object.defineProperty(window.RTCPeerConnection, 'generateCertificate', {
      get() {
        return OrigPeerConnection.generateCertificate;
      }
    });
  }
}

function shimTrackEventTransceiver(window) {
  // Add event.transceiver member over deprecated event.receiver
  if (typeof window === 'object' && window.RTCTrackEvent &&
      'receiver' in window.RTCTrackEvent.prototype &&
      !('transceiver' in window.RTCTrackEvent.prototype)) {
    Object.defineProperty(window.RTCTrackEvent.prototype, 'transceiver', {
      get() {
        return {receiver: this.receiver};
      }
    });
  }
}

function shimCreateOfferLegacy(window) {
  const origCreateOffer = window.RTCPeerConnection.prototype.createOffer;
  window.RTCPeerConnection.prototype.createOffer =
    function createOffer(offerOptions) {
      if (offerOptions) {
        if (typeof offerOptions.offerToReceiveAudio !== 'undefined') {
          // support bit values
          offerOptions.offerToReceiveAudio =
            !!offerOptions.offerToReceiveAudio;
        }
        const audioTransceiver = this.getTransceivers().find(transceiver =>
          transceiver.receiver.track.kind === 'audio');
        if (offerOptions.offerToReceiveAudio === false && audioTransceiver) {
          if (audioTransceiver.direction === 'sendrecv') {
            if (audioTransceiver.setDirection) {
              audioTransceiver.setDirection('sendonly');
            } else {
              audioTransceiver.direction = 'sendonly';
            }
          } else if (audioTransceiver.direction === 'recvonly') {
            if (audioTransceiver.setDirection) {
              audioTransceiver.setDirection('inactive');
            } else {
              audioTransceiver.direction = 'inactive';
            }
          }
        } else if (offerOptions.offerToReceiveAudio === true &&
            !audioTransceiver) {
          this.addTransceiver('audio', {direction: 'recvonly'});
        }

        if (typeof offerOptions.offerToReceiveVideo !== 'undefined') {
          // support bit values
          offerOptions.offerToReceiveVideo =
            !!offerOptions.offerToReceiveVideo;
        }
        const videoTransceiver = this.getTransceivers().find(transceiver =>
          transceiver.receiver.track.kind === 'video');
        if (offerOptions.offerToReceiveVideo === false && videoTransceiver) {
          if (videoTransceiver.direction === 'sendrecv') {
            if (videoTransceiver.setDirection) {
              videoTransceiver.setDirection('sendonly');
            } else {
              videoTransceiver.direction = 'sendonly';
            }
          } else if (videoTransceiver.direction === 'recvonly') {
            if (videoTransceiver.setDirection) {
              videoTransceiver.setDirection('inactive');
            } else {
              videoTransceiver.direction = 'inactive';
            }
          }
        } else if (offerOptions.offerToReceiveVideo === true &&
            !videoTransceiver) {
          this.addTransceiver('video', {direction: 'recvonly'});
        }
      }
      return origCreateOffer.apply(this, arguments);
    };
}

function shimAudioContext(window) {
  if (typeof window !== 'object' || window.AudioContext) {
    return;
  }
  window.AudioContext = window.webkitAudioContext;
}

var safariShim = /*#__PURE__*/Object.freeze({
    __proto__: null,
    shimAudioContext: shimAudioContext,
    shimCallbacksAPI: shimCallbacksAPI,
    shimConstraints: shimConstraints,
    shimCreateOfferLegacy: shimCreateOfferLegacy,
    shimGetUserMedia: shimGetUserMedia,
    shimLocalStreamsAPI: shimLocalStreamsAPI,
    shimRTCIceServerUrls: shimRTCIceServerUrls,
    shimRemoteStreamsAPI: shimRemoteStreamsAPI,
    shimTrackEventTransceiver: shimTrackEventTransceiver
});

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var sdp$1 = {exports: {}};

/* eslint-env node */

var hasRequiredSdp;

function requireSdp () {
	if (hasRequiredSdp) return sdp$1.exports;
	hasRequiredSdp = 1;
	(function (module) {

		// SDP helpers.
		const SDPUtils = {};

		// Generate an alphanumeric identifier for cname or mids.
		// TODO: use UUIDs instead? https://gist.github.com/jed/982883
		SDPUtils.generateIdentifier = function() {
		  return Math.random().toString(36).substring(2, 12);
		};

		// The RTCP CNAME used by all peerconnections from the same JS.
		SDPUtils.localCName = SDPUtils.generateIdentifier();

		// Splits SDP into lines, dealing with both CRLF and LF.
		SDPUtils.splitLines = function(blob) {
		  return blob.trim().split('\n').map(line => line.trim());
		};
		// Splits SDP into sessionpart and mediasections. Ensures CRLF.
		SDPUtils.splitSections = function(blob) {
		  const parts = blob.split('\nm=');
		  return parts.map((part, index) => (index > 0 ?
		    'm=' + part : part).trim() + '\r\n');
		};

		// Returns the session description.
		SDPUtils.getDescription = function(blob) {
		  const sections = SDPUtils.splitSections(blob);
		  return sections && sections[0];
		};

		// Returns the individual media sections.
		SDPUtils.getMediaSections = function(blob) {
		  const sections = SDPUtils.splitSections(blob);
		  sections.shift();
		  return sections;
		};

		// Returns lines that start with a certain prefix.
		SDPUtils.matchPrefix = function(blob, prefix) {
		  return SDPUtils.splitLines(blob).filter(line => line.indexOf(prefix) === 0);
		};

		// Parses an ICE candidate line. Sample input:
		// candidate:702786350 2 udp 41819902 8.8.8.8 60769 typ relay raddr 8.8.8.8
		// rport 55996"
		// Input can be prefixed with a=.
		SDPUtils.parseCandidate = function(line) {
		  let parts;
		  // Parse both variants.
		  if (line.indexOf('a=candidate:') === 0) {
		    parts = line.substring(12).split(' ');
		  } else {
		    parts = line.substring(10).split(' ');
		  }

		  const candidate = {
		    foundation: parts[0],
		    component: {1: 'rtp', 2: 'rtcp'}[parts[1]] || parts[1],
		    protocol: parts[2].toLowerCase(),
		    priority: parseInt(parts[3], 10),
		    ip: parts[4],
		    address: parts[4], // address is an alias for ip.
		    port: parseInt(parts[5], 10),
		    // skip parts[6] == 'typ'
		    type: parts[7],
		  };

		  for (let i = 8; i < parts.length; i += 2) {
		    switch (parts[i]) {
		      case 'raddr':
		        candidate.relatedAddress = parts[i + 1];
		        break;
		      case 'rport':
		        candidate.relatedPort = parseInt(parts[i + 1], 10);
		        break;
		      case 'tcptype':
		        candidate.tcpType = parts[i + 1];
		        break;
		      case 'ufrag':
		        candidate.ufrag = parts[i + 1]; // for backward compatibility.
		        candidate.usernameFragment = parts[i + 1];
		        break;
		      default: // extension handling, in particular ufrag. Don't overwrite.
		        if (candidate[parts[i]] === undefined) {
		          candidate[parts[i]] = parts[i + 1];
		        }
		        break;
		    }
		  }
		  return candidate;
		};

		// Translates a candidate object into SDP candidate attribute.
		// This does not include the a= prefix!
		SDPUtils.writeCandidate = function(candidate) {
		  const sdp = [];
		  sdp.push(candidate.foundation);

		  const component = candidate.component;
		  if (component === 'rtp') {
		    sdp.push(1);
		  } else if (component === 'rtcp') {
		    sdp.push(2);
		  } else {
		    sdp.push(component);
		  }
		  sdp.push(candidate.protocol.toUpperCase());
		  sdp.push(candidate.priority);
		  sdp.push(candidate.address || candidate.ip);
		  sdp.push(candidate.port);

		  const type = candidate.type;
		  sdp.push('typ');
		  sdp.push(type);
		  if (type !== 'host' && candidate.relatedAddress &&
		      candidate.relatedPort) {
		    sdp.push('raddr');
		    sdp.push(candidate.relatedAddress);
		    sdp.push('rport');
		    sdp.push(candidate.relatedPort);
		  }
		  if (candidate.tcpType && candidate.protocol.toLowerCase() === 'tcp') {
		    sdp.push('tcptype');
		    sdp.push(candidate.tcpType);
		  }
		  if (candidate.usernameFragment || candidate.ufrag) {
		    sdp.push('ufrag');
		    sdp.push(candidate.usernameFragment || candidate.ufrag);
		  }
		  return 'candidate:' + sdp.join(' ');
		};

		// Parses an ice-options line, returns an array of option tags.
		// Sample input:
		// a=ice-options:foo bar
		SDPUtils.parseIceOptions = function(line) {
		  return line.substring(14).split(' ');
		};

		// Parses a rtpmap line, returns RTCRtpCoddecParameters. Sample input:
		// a=rtpmap:111 opus/48000/2
		SDPUtils.parseRtpMap = function(line) {
		  let parts = line.substring(9).split(' ');
		  const parsed = {
		    payloadType: parseInt(parts.shift(), 10), // was: id
		  };

		  parts = parts[0].split('/');

		  parsed.name = parts[0];
		  parsed.clockRate = parseInt(parts[1], 10); // was: clockrate
		  parsed.channels = parts.length === 3 ? parseInt(parts[2], 10) : 1;
		  // legacy alias, got renamed back to channels in ORTC.
		  parsed.numChannels = parsed.channels;
		  return parsed;
		};

		// Generates a rtpmap line from RTCRtpCodecCapability or
		// RTCRtpCodecParameters.
		SDPUtils.writeRtpMap = function(codec) {
		  let pt = codec.payloadType;
		  if (codec.preferredPayloadType !== undefined) {
		    pt = codec.preferredPayloadType;
		  }
		  const channels = codec.channels || codec.numChannels || 1;
		  return 'a=rtpmap:' + pt + ' ' + codec.name + '/' + codec.clockRate +
		      (channels !== 1 ? '/' + channels : '') + '\r\n';
		};

		// Parses a extmap line (headerextension from RFC 5285). Sample input:
		// a=extmap:2 urn:ietf:params:rtp-hdrext:toffset
		// a=extmap:2/sendonly urn:ietf:params:rtp-hdrext:toffset
		SDPUtils.parseExtmap = function(line) {
		  const parts = line.substring(9).split(' ');
		  return {
		    id: parseInt(parts[0], 10),
		    direction: parts[0].indexOf('/') > 0 ? parts[0].split('/')[1] : 'sendrecv',
		    uri: parts[1],
		    attributes: parts.slice(2).join(' '),
		  };
		};

		// Generates an extmap line from RTCRtpHeaderExtensionParameters or
		// RTCRtpHeaderExtension.
		SDPUtils.writeExtmap = function(headerExtension) {
		  return 'a=extmap:' + (headerExtension.id || headerExtension.preferredId) +
		      (headerExtension.direction && headerExtension.direction !== 'sendrecv'
		        ? '/' + headerExtension.direction
		        : '') +
		      ' ' + headerExtension.uri +
		      (headerExtension.attributes ? ' ' + headerExtension.attributes : '') +
		      '\r\n';
		};

		// Parses a fmtp line, returns dictionary. Sample input:
		// a=fmtp:96 vbr=on;cng=on
		// Also deals with vbr=on; cng=on
		SDPUtils.parseFmtp = function(line) {
		  const parsed = {};
		  let kv;
		  const parts = line.substring(line.indexOf(' ') + 1).split(';');
		  for (let j = 0; j < parts.length; j++) {
		    kv = parts[j].trim().split('=');
		    parsed[kv[0].trim()] = kv[1];
		  }
		  return parsed;
		};

		// Generates a fmtp line from RTCRtpCodecCapability or RTCRtpCodecParameters.
		SDPUtils.writeFmtp = function(codec) {
		  let line = '';
		  let pt = codec.payloadType;
		  if (codec.preferredPayloadType !== undefined) {
		    pt = codec.preferredPayloadType;
		  }
		  if (codec.parameters && Object.keys(codec.parameters).length) {
		    const params = [];
		    Object.keys(codec.parameters).forEach(param => {
		      if (codec.parameters[param] !== undefined) {
		        params.push(param + '=' + codec.parameters[param]);
		      } else {
		        params.push(param);
		      }
		    });
		    line += 'a=fmtp:' + pt + ' ' + params.join(';') + '\r\n';
		  }
		  return line;
		};

		// Parses a rtcp-fb line, returns RTCPRtcpFeedback object. Sample input:
		// a=rtcp-fb:98 nack rpsi
		SDPUtils.parseRtcpFb = function(line) {
		  const parts = line.substring(line.indexOf(' ') + 1).split(' ');
		  return {
		    type: parts.shift(),
		    parameter: parts.join(' '),
		  };
		};

		// Generate a=rtcp-fb lines from RTCRtpCodecCapability or RTCRtpCodecParameters.
		SDPUtils.writeRtcpFb = function(codec) {
		  let lines = '';
		  let pt = codec.payloadType;
		  if (codec.preferredPayloadType !== undefined) {
		    pt = codec.preferredPayloadType;
		  }
		  if (codec.rtcpFeedback && codec.rtcpFeedback.length) {
		    // FIXME: special handling for trr-int?
		    codec.rtcpFeedback.forEach(fb => {
		      lines += 'a=rtcp-fb:' + pt + ' ' + fb.type +
		      (fb.parameter && fb.parameter.length ? ' ' + fb.parameter : '') +
		          '\r\n';
		    });
		  }
		  return lines;
		};

		// Parses a RFC 5576 ssrc media attribute. Sample input:
		// a=ssrc:3735928559 cname:something
		SDPUtils.parseSsrcMedia = function(line) {
		  const sp = line.indexOf(' ');
		  const parts = {
		    ssrc: parseInt(line.substring(7, sp), 10),
		  };
		  const colon = line.indexOf(':', sp);
		  if (colon > -1) {
		    parts.attribute = line.substring(sp + 1, colon);
		    parts.value = line.substring(colon + 1);
		  } else {
		    parts.attribute = line.substring(sp + 1);
		  }
		  return parts;
		};

		// Parse a ssrc-group line (see RFC 5576). Sample input:
		// a=ssrc-group:semantics 12 34
		SDPUtils.parseSsrcGroup = function(line) {
		  const parts = line.substring(13).split(' ');
		  return {
		    semantics: parts.shift(),
		    ssrcs: parts.map(ssrc => parseInt(ssrc, 10)),
		  };
		};

		// Extracts the MID (RFC 5888) from a media section.
		// Returns the MID or undefined if no mid line was found.
		SDPUtils.getMid = function(mediaSection) {
		  const mid = SDPUtils.matchPrefix(mediaSection, 'a=mid:')[0];
		  if (mid) {
		    return mid.substring(6);
		  }
		};

		// Parses a fingerprint line for DTLS-SRTP.
		SDPUtils.parseFingerprint = function(line) {
		  const parts = line.substring(14).split(' ');
		  return {
		    algorithm: parts[0].toLowerCase(), // algorithm is case-sensitive in Edge.
		    value: parts[1].toUpperCase(), // the definition is upper-case in RFC 4572.
		  };
		};

		// Extracts DTLS parameters from SDP media section or sessionpart.
		// FIXME: for consistency with other functions this should only
		//   get the fingerprint line as input. See also getIceParameters.
		SDPUtils.getDtlsParameters = function(mediaSection, sessionpart) {
		  const lines = SDPUtils.matchPrefix(mediaSection + sessionpart,
		    'a=fingerprint:');
		  // Note: a=setup line is ignored since we use the 'auto' role in Edge.
		  return {
		    role: 'auto',
		    fingerprints: lines.map(SDPUtils.parseFingerprint),
		  };
		};

		// Serializes DTLS parameters to SDP.
		SDPUtils.writeDtlsParameters = function(params, setupType) {
		  let sdp = 'a=setup:' + setupType + '\r\n';
		  params.fingerprints.forEach(fp => {
		    sdp += 'a=fingerprint:' + fp.algorithm + ' ' + fp.value + '\r\n';
		  });
		  return sdp;
		};

		// Parses a=crypto lines into
		//   https://rawgit.com/aboba/edgertc/master/msortc-rs4.html#dictionary-rtcsrtpsdesparameters-members
		SDPUtils.parseCryptoLine = function(line) {
		  const parts = line.substring(9).split(' ');
		  return {
		    tag: parseInt(parts[0], 10),
		    cryptoSuite: parts[1],
		    keyParams: parts[2],
		    sessionParams: parts.slice(3),
		  };
		};

		SDPUtils.writeCryptoLine = function(parameters) {
		  return 'a=crypto:' + parameters.tag + ' ' +
		    parameters.cryptoSuite + ' ' +
		    (typeof parameters.keyParams === 'object'
		      ? SDPUtils.writeCryptoKeyParams(parameters.keyParams)
		      : parameters.keyParams) +
		    (parameters.sessionParams ? ' ' + parameters.sessionParams.join(' ') : '') +
		    '\r\n';
		};

		// Parses the crypto key parameters into
		//   https://rawgit.com/aboba/edgertc/master/msortc-rs4.html#rtcsrtpkeyparam*
		SDPUtils.parseCryptoKeyParams = function(keyParams) {
		  if (keyParams.indexOf('inline:') !== 0) {
		    return null;
		  }
		  const parts = keyParams.substring(7).split('|');
		  return {
		    keyMethod: 'inline',
		    keySalt: parts[0],
		    lifeTime: parts[1],
		    mkiValue: parts[2] ? parts[2].split(':')[0] : undefined,
		    mkiLength: parts[2] ? parts[2].split(':')[1] : undefined,
		  };
		};

		SDPUtils.writeCryptoKeyParams = function(keyParams) {
		  return keyParams.keyMethod + ':'
		    + keyParams.keySalt +
		    (keyParams.lifeTime ? '|' + keyParams.lifeTime : '') +
		    (keyParams.mkiValue && keyParams.mkiLength
		      ? '|' + keyParams.mkiValue + ':' + keyParams.mkiLength
		      : '');
		};

		// Extracts all SDES parameters.
		SDPUtils.getCryptoParameters = function(mediaSection, sessionpart) {
		  const lines = SDPUtils.matchPrefix(mediaSection + sessionpart,
		    'a=crypto:');
		  return lines.map(SDPUtils.parseCryptoLine);
		};

		// Parses ICE information from SDP media section or sessionpart.
		// FIXME: for consistency with other functions this should only
		//   get the ice-ufrag and ice-pwd lines as input.
		SDPUtils.getIceParameters = function(mediaSection, sessionpart) {
		  const ufrag = SDPUtils.matchPrefix(mediaSection + sessionpart,
		    'a=ice-ufrag:')[0];
		  const pwd = SDPUtils.matchPrefix(mediaSection + sessionpart,
		    'a=ice-pwd:')[0];
		  if (!(ufrag && pwd)) {
		    return null;
		  }
		  return {
		    usernameFragment: ufrag.substring(12),
		    password: pwd.substring(10),
		  };
		};

		// Serializes ICE parameters to SDP.
		SDPUtils.writeIceParameters = function(params) {
		  let sdp = 'a=ice-ufrag:' + params.usernameFragment + '\r\n' +
		      'a=ice-pwd:' + params.password + '\r\n';
		  if (params.iceLite) {
		    sdp += 'a=ice-lite\r\n';
		  }
		  return sdp;
		};

		// Parses the SDP media section and returns RTCRtpParameters.
		SDPUtils.parseRtpParameters = function(mediaSection) {
		  const description = {
		    codecs: [],
		    headerExtensions: [],
		    fecMechanisms: [],
		    rtcp: [],
		  };
		  const lines = SDPUtils.splitLines(mediaSection);
		  const mline = lines[0].split(' ');
		  description.profile = mline[2];
		  for (let i = 3; i < mline.length; i++) { // find all codecs from mline[3..]
		    const pt = mline[i];
		    const rtpmapline = SDPUtils.matchPrefix(
		      mediaSection, 'a=rtpmap:' + pt + ' ')[0];
		    if (rtpmapline) {
		      const codec = SDPUtils.parseRtpMap(rtpmapline);
		      const fmtps = SDPUtils.matchPrefix(
		        mediaSection, 'a=fmtp:' + pt + ' ');
		      // Only the first a=fmtp:<pt> is considered.
		      codec.parameters = fmtps.length ? SDPUtils.parseFmtp(fmtps[0]) : {};
		      codec.rtcpFeedback = SDPUtils.matchPrefix(
		        mediaSection, 'a=rtcp-fb:' + pt + ' ')
		        .map(SDPUtils.parseRtcpFb);
		      description.codecs.push(codec);
		      // parse FEC mechanisms from rtpmap lines.
		      switch (codec.name.toUpperCase()) {
		        case 'RED':
		        case 'ULPFEC':
		          description.fecMechanisms.push(codec.name.toUpperCase());
		          break;
		      }
		    }
		  }
		  SDPUtils.matchPrefix(mediaSection, 'a=extmap:').forEach(line => {
		    description.headerExtensions.push(SDPUtils.parseExtmap(line));
		  });
		  const wildcardRtcpFb = SDPUtils.matchPrefix(mediaSection, 'a=rtcp-fb:* ')
		    .map(SDPUtils.parseRtcpFb);
		  description.codecs.forEach(codec => {
		    wildcardRtcpFb.forEach(fb=> {
		      const duplicate = codec.rtcpFeedback.find(existingFeedback => {
		        return existingFeedback.type === fb.type &&
		          existingFeedback.parameter === fb.parameter;
		      });
		      if (!duplicate) {
		        codec.rtcpFeedback.push(fb);
		      }
		    });
		  });
		  // FIXME: parse rtcp.
		  return description;
		};

		// Generates parts of the SDP media section describing the capabilities /
		// parameters.
		SDPUtils.writeRtpDescription = function(kind, caps) {
		  let sdp = '';

		  // Build the mline.
		  sdp += 'm=' + kind + ' ';
		  sdp += caps.codecs.length > 0 ? '9' : '0'; // reject if no codecs.
		  sdp += ' ' + (caps.profile || 'UDP/TLS/RTP/SAVPF') + ' ';
		  sdp += caps.codecs.map(codec => {
		    if (codec.preferredPayloadType !== undefined) {
		      return codec.preferredPayloadType;
		    }
		    return codec.payloadType;
		  }).join(' ') + '\r\n';

		  sdp += 'c=IN IP4 0.0.0.0\r\n';
		  sdp += 'a=rtcp:9 IN IP4 0.0.0.0\r\n';

		  // Add a=rtpmap lines for each codec. Also fmtp and rtcp-fb.
		  caps.codecs.forEach(codec => {
		    sdp += SDPUtils.writeRtpMap(codec);
		    sdp += SDPUtils.writeFmtp(codec);
		    sdp += SDPUtils.writeRtcpFb(codec);
		  });
		  let maxptime = 0;
		  caps.codecs.forEach(codec => {
		    if (codec.maxptime > maxptime) {
		      maxptime = codec.maxptime;
		    }
		  });
		  if (maxptime > 0) {
		    sdp += 'a=maxptime:' + maxptime + '\r\n';
		  }

		  if (caps.headerExtensions) {
		    caps.headerExtensions.forEach(extension => {
		      sdp += SDPUtils.writeExtmap(extension);
		    });
		  }
		  // FIXME: write fecMechanisms.
		  return sdp;
		};

		// Parses the SDP media section and returns an array of
		// RTCRtpEncodingParameters.
		SDPUtils.parseRtpEncodingParameters = function(mediaSection) {
		  const encodingParameters = [];
		  const description = SDPUtils.parseRtpParameters(mediaSection);
		  const hasRed = description.fecMechanisms.indexOf('RED') !== -1;
		  const hasUlpfec = description.fecMechanisms.indexOf('ULPFEC') !== -1;

		  // filter a=ssrc:... cname:, ignore PlanB-msid
		  const ssrcs = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:')
		    .map(line => SDPUtils.parseSsrcMedia(line))
		    .filter(parts => parts.attribute === 'cname');
		  const primarySsrc = ssrcs.length > 0 && ssrcs[0].ssrc;
		  let secondarySsrc;

		  const flows = SDPUtils.matchPrefix(mediaSection, 'a=ssrc-group:FID')
		    .map(line => {
		      const parts = line.substring(17).split(' ');
		      return parts.map(part => parseInt(part, 10));
		    });
		  if (flows.length > 0 && flows[0].length > 1 && flows[0][0] === primarySsrc) {
		    secondarySsrc = flows[0][1];
		  }

		  description.codecs.forEach(codec => {
		    if (codec.name.toUpperCase() === 'RTX' && codec.parameters.apt) {
		      let encParam = {
		        ssrc: primarySsrc,
		        codecPayloadType: parseInt(codec.parameters.apt, 10),
		      };
		      if (primarySsrc && secondarySsrc) {
		        encParam.rtx = {ssrc: secondarySsrc};
		      }
		      encodingParameters.push(encParam);
		      if (hasRed) {
		        encParam = JSON.parse(JSON.stringify(encParam));
		        encParam.fec = {
		          ssrc: primarySsrc,
		          mechanism: hasUlpfec ? 'red+ulpfec' : 'red',
		        };
		        encodingParameters.push(encParam);
		      }
		    }
		  });
		  if (encodingParameters.length === 0 && primarySsrc) {
		    encodingParameters.push({
		      ssrc: primarySsrc,
		    });
		  }

		  // we support both b=AS and b=TIAS but interpret AS as TIAS.
		  let bandwidth = SDPUtils.matchPrefix(mediaSection, 'b=');
		  if (bandwidth.length) {
		    if (bandwidth[0].indexOf('b=TIAS:') === 0) {
		      bandwidth = parseInt(bandwidth[0].substring(7), 10);
		    } else if (bandwidth[0].indexOf('b=AS:') === 0) {
		      // use formula from JSEP to convert b=AS to TIAS value.
		      bandwidth = parseInt(bandwidth[0].substring(5), 10) * 1000 * 0.95
		          - (50 * 40 * 8);
		    } else {
		      bandwidth = undefined;
		    }
		    encodingParameters.forEach(params => {
		      params.maxBitrate = bandwidth;
		    });
		  }
		  return encodingParameters;
		};

		// parses http://draft.ortc.org/#rtcrtcpparameters*
		SDPUtils.parseRtcpParameters = function(mediaSection) {
		  const rtcpParameters = {};

		  // Gets the first SSRC. Note that with RTX there might be multiple
		  // SSRCs.
		  const remoteSsrc = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:')
		    .map(line => SDPUtils.parseSsrcMedia(line))
		    .filter(obj => obj.attribute === 'cname')[0];
		  if (remoteSsrc) {
		    rtcpParameters.cname = remoteSsrc.value;
		    rtcpParameters.ssrc = remoteSsrc.ssrc;
		  }

		  // Edge uses the compound attribute instead of reducedSize
		  // compound is !reducedSize
		  const rsize = SDPUtils.matchPrefix(mediaSection, 'a=rtcp-rsize');
		  rtcpParameters.reducedSize = rsize.length > 0;
		  rtcpParameters.compound = rsize.length === 0;

		  // parses the rtcp-mux attrіbute.
		  // Note that Edge does not support unmuxed RTCP.
		  const mux = SDPUtils.matchPrefix(mediaSection, 'a=rtcp-mux');
		  rtcpParameters.mux = mux.length > 0;

		  return rtcpParameters;
		};

		SDPUtils.writeRtcpParameters = function(rtcpParameters) {
		  let sdp = '';
		  if (rtcpParameters.reducedSize) {
		    sdp += 'a=rtcp-rsize\r\n';
		  }
		  if (rtcpParameters.mux) {
		    sdp += 'a=rtcp-mux\r\n';
		  }
		  if (rtcpParameters.ssrc !== undefined && rtcpParameters.cname) {
		    sdp += 'a=ssrc:' + rtcpParameters.ssrc +
		      ' cname:' + rtcpParameters.cname + '\r\n';
		  }
		  return sdp;
		};


		// parses either a=msid: or a=ssrc:... msid lines and returns
		// the id of the MediaStream and MediaStreamTrack.
		SDPUtils.parseMsid = function(mediaSection) {
		  let parts;
		  const spec = SDPUtils.matchPrefix(mediaSection, 'a=msid:');
		  if (spec.length === 1) {
		    parts = spec[0].substring(7).split(' ');
		    return {stream: parts[0], track: parts[1]};
		  }
		  const planB = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:')
		    .map(line => SDPUtils.parseSsrcMedia(line))
		    .filter(msidParts => msidParts.attribute === 'msid');
		  if (planB.length > 0) {
		    parts = planB[0].value.split(' ');
		    return {stream: parts[0], track: parts[1]};
		  }
		};

		// SCTP
		// parses draft-ietf-mmusic-sctp-sdp-26 first and falls back
		// to draft-ietf-mmusic-sctp-sdp-05
		SDPUtils.parseSctpDescription = function(mediaSection) {
		  const mline = SDPUtils.parseMLine(mediaSection);
		  const maxSizeLine = SDPUtils.matchPrefix(mediaSection, 'a=max-message-size:');
		  let maxMessageSize;
		  if (maxSizeLine.length > 0) {
		    maxMessageSize = parseInt(maxSizeLine[0].substring(19), 10);
		  }
		  if (isNaN(maxMessageSize)) {
		    maxMessageSize = 65536;
		  }
		  const sctpPort = SDPUtils.matchPrefix(mediaSection, 'a=sctp-port:');
		  if (sctpPort.length > 0) {
		    return {
		      port: parseInt(sctpPort[0].substring(12), 10),
		      protocol: mline.fmt,
		      maxMessageSize,
		    };
		  }
		  const sctpMapLines = SDPUtils.matchPrefix(mediaSection, 'a=sctpmap:');
		  if (sctpMapLines.length > 0) {
		    const parts = sctpMapLines[0]
		      .substring(10)
		      .split(' ');
		    return {
		      port: parseInt(parts[0], 10),
		      protocol: parts[1],
		      maxMessageSize,
		    };
		  }
		};

		// SCTP
		// outputs the draft-ietf-mmusic-sctp-sdp-26 version that all browsers
		// support by now receiving in this format, unless we originally parsed
		// as the draft-ietf-mmusic-sctp-sdp-05 format (indicated by the m-line
		// protocol of DTLS/SCTP -- without UDP/ or TCP/)
		SDPUtils.writeSctpDescription = function(media, sctp) {
		  let output = [];
		  if (media.protocol !== 'DTLS/SCTP') {
		    output = [
		      'm=' + media.kind + ' 9 ' + media.protocol + ' ' + sctp.protocol + '\r\n',
		      'c=IN IP4 0.0.0.0\r\n',
		      'a=sctp-port:' + sctp.port + '\r\n',
		    ];
		  } else {
		    output = [
		      'm=' + media.kind + ' 9 ' + media.protocol + ' ' + sctp.port + '\r\n',
		      'c=IN IP4 0.0.0.0\r\n',
		      'a=sctpmap:' + sctp.port + ' ' + sctp.protocol + ' 65535\r\n',
		    ];
		  }
		  if (sctp.maxMessageSize !== undefined) {
		    output.push('a=max-message-size:' + sctp.maxMessageSize + '\r\n');
		  }
		  return output.join('');
		};

		// Generate a session ID for SDP.
		// https://tools.ietf.org/html/draft-ietf-rtcweb-jsep-20#section-5.2.1
		// recommends using a cryptographically random +ve 64-bit value
		// but right now this should be acceptable and within the right range
		SDPUtils.generateSessionId = function() {
		  return Math.random().toString().substr(2, 22);
		};

		// Write boiler plate for start of SDP
		// sessId argument is optional - if not supplied it will
		// be generated randomly
		// sessVersion is optional and defaults to 2
		// sessUser is optional and defaults to 'thisisadapterortc'
		SDPUtils.writeSessionBoilerplate = function(sessId, sessVer, sessUser) {
		  let sessionId;
		  const version = sessVer !== undefined ? sessVer : 2;
		  if (sessId) {
		    sessionId = sessId;
		  } else {
		    sessionId = SDPUtils.generateSessionId();
		  }
		  const user = sessUser || 'thisisadapterortc';
		  // FIXME: sess-id should be an NTP timestamp.
		  return 'v=0\r\n' +
		      'o=' + user + ' ' + sessionId + ' ' + version +
		        ' IN IP4 127.0.0.1\r\n' +
		      's=-\r\n' +
		      't=0 0\r\n';
		};

		// Gets the direction from the mediaSection or the sessionpart.
		SDPUtils.getDirection = function(mediaSection, sessionpart) {
		  // Look for sendrecv, sendonly, recvonly, inactive, default to sendrecv.
		  const lines = SDPUtils.splitLines(mediaSection);
		  for (let i = 0; i < lines.length; i++) {
		    switch (lines[i]) {
		      case 'a=sendrecv':
		      case 'a=sendonly':
		      case 'a=recvonly':
		      case 'a=inactive':
		        return lines[i].substring(2);
		        // FIXME: What should happen here?
		    }
		  }
		  if (sessionpart) {
		    return SDPUtils.getDirection(sessionpart);
		  }
		  return 'sendrecv';
		};

		SDPUtils.getKind = function(mediaSection) {
		  const lines = SDPUtils.splitLines(mediaSection);
		  const mline = lines[0].split(' ');
		  return mline[0].substring(2);
		};

		SDPUtils.isRejected = function(mediaSection) {
		  return mediaSection.split(' ', 2)[1] === '0';
		};

		SDPUtils.parseMLine = function(mediaSection) {
		  const lines = SDPUtils.splitLines(mediaSection);
		  const parts = lines[0].substring(2).split(' ');
		  return {
		    kind: parts[0],
		    port: parseInt(parts[1], 10),
		    protocol: parts[2],
		    fmt: parts.slice(3).join(' '),
		  };
		};

		SDPUtils.parseOLine = function(mediaSection) {
		  const line = SDPUtils.matchPrefix(mediaSection, 'o=')[0];
		  const parts = line.substring(2).split(' ');
		  return {
		    username: parts[0],
		    sessionId: parts[1],
		    sessionVersion: parseInt(parts[2], 10),
		    netType: parts[3],
		    addressType: parts[4],
		    address: parts[5],
		  };
		};

		// a very naive interpretation of a valid SDP.
		SDPUtils.isValidSDP = function(blob) {
		  if (typeof blob !== 'string' || blob.length === 0) {
		    return false;
		  }
		  const lines = SDPUtils.splitLines(blob);
		  for (let i = 0; i < lines.length; i++) {
		    if (lines[i].length < 2 || lines[i].charAt(1) !== '=') {
		      return false;
		    }
		    // TODO: check the modifier a bit more.
		  }
		  return true;
		};

		// Expose public methods.
		{
		  module.exports = SDPUtils;
		} 
	} (sdp$1));
	return sdp$1.exports;
}

var sdpExports = requireSdp();
var SDPUtils = /*@__PURE__*/getDefaultExportFromCjs(sdpExports);

var sdp = /*#__PURE__*/_mergeNamespaces({
    __proto__: null,
    default: SDPUtils
}, [sdpExports]);

/*
 *  Copyright (c) 2017 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
/* eslint-env node */

function shimRTCIceCandidate(window) {
  // foundation is arbitrarily chosen as an indicator for full support for
  // https://w3c.github.io/webrtc-pc/#rtcicecandidate-interface
  if (!window.RTCIceCandidate || (window.RTCIceCandidate && 'foundation' in
      window.RTCIceCandidate.prototype)) {
    return;
  }

  const NativeRTCIceCandidate = window.RTCIceCandidate;
  window.RTCIceCandidate = function RTCIceCandidate(args) {
    // Remove the a= which shouldn't be part of the candidate string.
    if (typeof args === 'object' && args.candidate &&
        args.candidate.indexOf('a=') === 0) {
      args = JSON.parse(JSON.stringify(args));
      args.candidate = args.candidate.substring(2);
    }

    if (args.candidate && args.candidate.length) {
      // Augment the native candidate with the parsed fields.
      const nativeCandidate = new NativeRTCIceCandidate(args);
      const parsedCandidate = SDPUtils.parseCandidate(args.candidate);
      for (const key in parsedCandidate) {
        if (!(key in nativeCandidate)) {
          Object.defineProperty(nativeCandidate, key,
            {value: parsedCandidate[key]});
        }
      }

      // Override serializer to not serialize the extra attributes.
      nativeCandidate.toJSON = function toJSON() {
        return {
          candidate: nativeCandidate.candidate,
          sdpMid: nativeCandidate.sdpMid,
          sdpMLineIndex: nativeCandidate.sdpMLineIndex,
          usernameFragment: nativeCandidate.usernameFragment,
        };
      };
      return nativeCandidate;
    }
    return new NativeRTCIceCandidate(args);
  };
  window.RTCIceCandidate.prototype = NativeRTCIceCandidate.prototype;

  // Hook up the augmented candidate in onicecandidate and
  // addEventListener('icecandidate', ...)
  wrapPeerConnectionEvent(window, 'icecandidate', e => {
    if (e.candidate) {
      Object.defineProperty(e, 'candidate', {
        value: new window.RTCIceCandidate(e.candidate),
        writable: 'false'
      });
    }
    return e;
  });
}

function shimRTCIceCandidateRelayProtocol(window) {
  if (!window.RTCIceCandidate || (window.RTCIceCandidate && 'relayProtocol' in
      window.RTCIceCandidate.prototype)) {
    return;
  }

  // Hook up the augmented candidate in onicecandidate and
  // addEventListener('icecandidate', ...)
  wrapPeerConnectionEvent(window, 'icecandidate', e => {
    if (e.candidate) {
      const parsedCandidate = SDPUtils.parseCandidate(e.candidate.candidate);
      if (parsedCandidate.type === 'relay') {
        // This is a libwebrtc-specific mapping of local type preference
        // to relayProtocol.
        e.candidate.relayProtocol = {
          0: 'tls',
          1: 'tcp',
          2: 'udp',
        }[parsedCandidate.priority >> 24];
      }
    }
    return e;
  });
}

function shimMaxMessageSize(window, browserDetails) {
  if (!window.RTCPeerConnection) {
    return;
  }

  if (!('sctp' in window.RTCPeerConnection.prototype)) {
    Object.defineProperty(window.RTCPeerConnection.prototype, 'sctp', {
      get() {
        return typeof this._sctp === 'undefined' ? null : this._sctp;
      }
    });
  }

  const sctpInDescription = function(description) {
    if (!description || !description.sdp) {
      return false;
    }
    const sections = SDPUtils.splitSections(description.sdp);
    sections.shift();
    return sections.some(mediaSection => {
      const mLine = SDPUtils.parseMLine(mediaSection);
      return mLine && mLine.kind === 'application'
          && mLine.protocol.indexOf('SCTP') !== -1;
    });
  };

  const getRemoteFirefoxVersion = function(description) {
    // TODO: Is there a better solution for detecting Firefox?
    const match = description.sdp.match(/mozilla...THIS_IS_SDPARTA-(\d+)/);
    if (match === null || match.length < 2) {
      return -1;
    }
    const version = parseInt(match[1], 10);
    // Test for NaN (yes, this is ugly)
    return version !== version ? -1 : version;
  };

  const getCanSendMaxMessageSize = function(remoteIsFirefox) {
    // Every implementation we know can send at least 64 KiB.
    // Note: Although Chrome is technically able to send up to 256 KiB, the
    //       data does not reach the other peer reliably.
    //       See: https://bugs.chromium.org/p/webrtc/issues/detail?id=8419
    let canSendMaxMessageSize = 65536;
    if (browserDetails.browser === 'firefox') {
      if (browserDetails.version < 57) {
        if (remoteIsFirefox === -1) {
          // FF < 57 will send in 16 KiB chunks using the deprecated PPID
          // fragmentation.
          canSendMaxMessageSize = 16384;
        } else {
          // However, other FF (and RAWRTC) can reassemble PPID-fragmented
          // messages. Thus, supporting ~2 GiB when sending.
          canSendMaxMessageSize = 2147483637;
        }
      } else if (browserDetails.version < 60) {
        // Currently, all FF >= 57 will reset the remote maximum message size
        // to the default value when a data channel is created at a later
        // stage. :(
        // See: https://bugzilla.mozilla.org/show_bug.cgi?id=1426831
        canSendMaxMessageSize =
          browserDetails.version === 57 ? 65535 : 65536;
      } else {
        // FF >= 60 supports sending ~2 GiB
        canSendMaxMessageSize = 2147483637;
      }
    }
    return canSendMaxMessageSize;
  };

  const getMaxMessageSize = function(description, remoteIsFirefox) {
    // Note: 65536 bytes is the default value from the SDP spec. Also,
    //       every implementation we know supports receiving 65536 bytes.
    let maxMessageSize = 65536;

    // FF 57 has a slightly incorrect default remote max message size, so
    // we need to adjust it here to avoid a failure when sending.
    // See: https://bugzilla.mozilla.org/show_bug.cgi?id=1425697
    if (browserDetails.browser === 'firefox'
         && browserDetails.version === 57) {
      maxMessageSize = 65535;
    }

    const match = SDPUtils.matchPrefix(description.sdp,
      'a=max-message-size:');
    if (match.length > 0) {
      maxMessageSize = parseInt(match[0].substring(19), 10);
    } else if (browserDetails.browser === 'firefox' &&
                remoteIsFirefox !== -1) {
      // If the maximum message size is not present in the remote SDP and
      // both local and remote are Firefox, the remote peer can receive
      // ~2 GiB.
      maxMessageSize = 2147483637;
    }
    return maxMessageSize;
  };

  const origSetRemoteDescription =
      window.RTCPeerConnection.prototype.setRemoteDescription;
  window.RTCPeerConnection.prototype.setRemoteDescription =
    function setRemoteDescription() {
      this._sctp = null;
      // Chrome decided to not expose .sctp in plan-b mode.
      // As usual, adapter.js has to do an 'ugly worakaround'
      // to cover up the mess.
      if (browserDetails.browser === 'chrome' && browserDetails.version >= 76) {
        const {sdpSemantics} = this.getConfiguration();
        if (sdpSemantics === 'plan-b') {
          Object.defineProperty(this, 'sctp', {
            get() {
              return typeof this._sctp === 'undefined' ? null : this._sctp;
            },
            enumerable: true,
            configurable: true,
          });
        }
      }

      if (sctpInDescription(arguments[0])) {
        // Check if the remote is FF.
        const isFirefox = getRemoteFirefoxVersion(arguments[0]);

        // Get the maximum message size the local peer is capable of sending
        const canSendMMS = getCanSendMaxMessageSize(isFirefox);

        // Get the maximum message size of the remote peer.
        const remoteMMS = getMaxMessageSize(arguments[0], isFirefox);

        // Determine final maximum message size
        let maxMessageSize;
        if (canSendMMS === 0 && remoteMMS === 0) {
          maxMessageSize = Number.POSITIVE_INFINITY;
        } else if (canSendMMS === 0 || remoteMMS === 0) {
          maxMessageSize = Math.max(canSendMMS, remoteMMS);
        } else {
          maxMessageSize = Math.min(canSendMMS, remoteMMS);
        }

        // Create a dummy RTCSctpTransport object and the 'maxMessageSize'
        // attribute.
        const sctp = {};
        Object.defineProperty(sctp, 'maxMessageSize', {
          get() {
            return maxMessageSize;
          }
        });
        this._sctp = sctp;
      }

      return origSetRemoteDescription.apply(this, arguments);
    };
}

function shimSendThrowTypeError(window) {
  if (!(window.RTCPeerConnection &&
      'createDataChannel' in window.RTCPeerConnection.prototype)) {
    return;
  }

  // Note: Although Firefox >= 57 has a native implementation, the maximum
  //       message size can be reset for all data channels at a later stage.
  //       See: https://bugzilla.mozilla.org/show_bug.cgi?id=1426831

  function wrapDcSend(dc, pc) {
    const origDataChannelSend = dc.send;
    dc.send = function send() {
      const data = arguments[0];
      const length = data.length || data.size || data.byteLength;
      if (dc.readyState === 'open' &&
          pc.sctp && length > pc.sctp.maxMessageSize) {
        throw new TypeError('Message too large (can send a maximum of ' +
          pc.sctp.maxMessageSize + ' bytes)');
      }
      return origDataChannelSend.apply(dc, arguments);
    };
  }
  const origCreateDataChannel =
    window.RTCPeerConnection.prototype.createDataChannel;
  window.RTCPeerConnection.prototype.createDataChannel =
    function createDataChannel() {
      const dataChannel = origCreateDataChannel.apply(this, arguments);
      wrapDcSend(dataChannel, this);
      return dataChannel;
    };
  wrapPeerConnectionEvent(window, 'datachannel', e => {
    wrapDcSend(e.channel, e.target);
    return e;
  });
}


/* shims RTCConnectionState by pretending it is the same as iceConnectionState.
 * See https://bugs.chromium.org/p/webrtc/issues/detail?id=6145#c12
 * for why this is a valid hack in Chrome. In Firefox it is slightly incorrect
 * since DTLS failures would be hidden. See
 * https://bugzilla.mozilla.org/show_bug.cgi?id=1265827
 * for the Firefox tracking bug.
 */
function shimConnectionState(window) {
  if (!window.RTCPeerConnection ||
      'connectionState' in window.RTCPeerConnection.prototype) {
    return;
  }
  const proto = window.RTCPeerConnection.prototype;
  Object.defineProperty(proto, 'connectionState', {
    get() {
      return {
        completed: 'connected',
        checking: 'connecting'
      }[this.iceConnectionState] || this.iceConnectionState;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(proto, 'onconnectionstatechange', {
    get() {
      return this._onconnectionstatechange || null;
    },
    set(cb) {
      if (this._onconnectionstatechange) {
        this.removeEventListener('connectionstatechange',
          this._onconnectionstatechange);
        delete this._onconnectionstatechange;
      }
      if (cb) {
        this.addEventListener('connectionstatechange',
          this._onconnectionstatechange = cb);
      }
    },
    enumerable: true,
    configurable: true
  });

  ['setLocalDescription', 'setRemoteDescription'].forEach((method) => {
    const origMethod = proto[method];
    proto[method] = function() {
      if (!this._connectionstatechangepoly) {
        this._connectionstatechangepoly = e => {
          const pc = e.target;
          if (pc._lastConnectionState !== pc.connectionState) {
            pc._lastConnectionState = pc.connectionState;
            const newEvent = new Event('connectionstatechange', e);
            pc.dispatchEvent(newEvent);
          }
          return e;
        };
        this.addEventListener('iceconnectionstatechange',
          this._connectionstatechangepoly);
      }
      return origMethod.apply(this, arguments);
    };
  });
}

function removeExtmapAllowMixed(window, browserDetails) {
  /* remove a=extmap-allow-mixed for webrtc.org < M71 */
  if (!window.RTCPeerConnection) {
    return;
  }
  if (browserDetails.browser === 'chrome' && browserDetails.version >= 71) {
    return;
  }
  if (browserDetails.browser === 'safari' && browserDetails.version >= 605) {
    return;
  }
  const nativeSRD = window.RTCPeerConnection.prototype.setRemoteDescription;
  window.RTCPeerConnection.prototype.setRemoteDescription =
  function setRemoteDescription(desc) {
    if (desc && desc.sdp && desc.sdp.indexOf('\na=extmap-allow-mixed') !== -1) {
      const sdp = desc.sdp.split('\n').filter((line) => {
        return line.trim() !== 'a=extmap-allow-mixed';
      }).join('\n');
      // Safari enforces read-only-ness of RTCSessionDescription fields.
      if (window.RTCSessionDescription &&
          desc instanceof window.RTCSessionDescription) {
        arguments[0] = new window.RTCSessionDescription({
          type: desc.type,
          sdp,
        });
      } else {
        desc.sdp = sdp;
      }
    }
    return nativeSRD.apply(this, arguments);
  };
}

function shimAddIceCandidateNullOrEmpty(window, browserDetails) {
  // Support for addIceCandidate(null or undefined)
  // as well as addIceCandidate({candidate: "", ...})
  // https://bugs.chromium.org/p/chromium/issues/detail?id=978582
  // Note: must be called before other polyfills which change the signature.
  if (!(window.RTCPeerConnection && window.RTCPeerConnection.prototype)) {
    return;
  }
  const nativeAddIceCandidate =
      window.RTCPeerConnection.prototype.addIceCandidate;
  if (!nativeAddIceCandidate || nativeAddIceCandidate.length === 0) {
    return;
  }
  window.RTCPeerConnection.prototype.addIceCandidate =
    function addIceCandidate() {
      if (!arguments[0]) {
        if (arguments[1]) {
          arguments[1].apply(null);
        }
        return Promise.resolve();
      }
      // Firefox 68+ emits and processes {candidate: "", ...}, ignore
      // in older versions.
      // Native support for ignoring exists for Chrome M77+.
      // Safari ignores as well, exact version unknown but works in the same
      // version that also ignores addIceCandidate(null).
      if (((browserDetails.browser === 'chrome' && browserDetails.version < 78)
           || (browserDetails.browser === 'firefox'
               && browserDetails.version < 68)
           || (browserDetails.browser === 'safari'))
          && arguments[0] && arguments[0].candidate === '') {
        return Promise.resolve();
      }
      return nativeAddIceCandidate.apply(this, arguments);
    };
}

// Note: Make sure to call this ahead of APIs that modify
// setLocalDescription.length
function shimParameterlessSetLocalDescription(window, browserDetails) {
  if (!(window.RTCPeerConnection && window.RTCPeerConnection.prototype)) {
    return;
  }
  const nativeSetLocalDescription =
      window.RTCPeerConnection.prototype.setLocalDescription;
  if (!nativeSetLocalDescription || nativeSetLocalDescription.length === 0) {
    return;
  }
  window.RTCPeerConnection.prototype.setLocalDescription =
    function setLocalDescription() {
      let desc = arguments[0] || {};
      if (typeof desc !== 'object' || (desc.type && desc.sdp)) {
        return nativeSetLocalDescription.apply(this, arguments);
      }
      // The remaining steps should technically happen when SLD comes off the
      // RTCPeerConnection's operations chain (not ahead of going on it), but
      // this is too difficult to shim. Instead, this shim only covers the
      // common case where the operations chain is empty. This is imperfect, but
      // should cover many cases. Rationale: Even if we can't reduce the glare
      // window to zero on imperfect implementations, there's value in tapping
      // into the perfect negotiation pattern that several browsers support.
      desc = {type: desc.type, sdp: desc.sdp};
      if (!desc.type) {
        switch (this.signalingState) {
          case 'stable':
          case 'have-local-offer':
          case 'have-remote-pranswer':
            desc.type = 'offer';
            break;
          default:
            desc.type = 'answer';
            break;
        }
      }
      if (desc.sdp || (desc.type !== 'offer' && desc.type !== 'answer')) {
        return nativeSetLocalDescription.apply(this, [desc]);
      }
      const func = desc.type === 'offer' ? this.createOffer : this.createAnswer;
      return func.apply(this)
        .then(d => nativeSetLocalDescription.apply(this, [d]));
    };
}

var commonShim = /*#__PURE__*/Object.freeze({
    __proto__: null,
    removeExtmapAllowMixed: removeExtmapAllowMixed,
    shimAddIceCandidateNullOrEmpty: shimAddIceCandidateNullOrEmpty,
    shimConnectionState: shimConnectionState,
    shimMaxMessageSize: shimMaxMessageSize,
    shimParameterlessSetLocalDescription: shimParameterlessSetLocalDescription,
    shimRTCIceCandidate: shimRTCIceCandidate,
    shimRTCIceCandidateRelayProtocol: shimRTCIceCandidateRelayProtocol,
    shimSendThrowTypeError: shimSendThrowTypeError
});

/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

// Shimming starts here.
function adapterFactory({window} = {}, options = {
  shimChrome: true,
  shimFirefox: true,
  shimSafari: true,
}) {
  // Utils.
  const logging = log;
  const browserDetails = detectBrowser(window);

  const adapter = {
    browserDetails,
    commonShim,
    extractVersion: extractVersion,
    disableLog: disableLog,
    disableWarnings: disableWarnings,
    // Expose sdp as a convenience. For production apps include directly.
    sdp,
  };

  // Shim browser if found.
  switch (browserDetails.browser) {
    case 'chrome':
      if (!chromeShim || !shimPeerConnection$1 ||
          !options.shimChrome) {
        logging('Chrome shim is not included in this adapter release.');
        return adapter;
      }
      if (browserDetails.version === null) {
        logging('Chrome shim can not determine version, not shimming.');
        return adapter;
      }
      logging('adapter.js shimming chrome.');
      // Export to the adapter global object visible in the browser.
      adapter.browserShim = chromeShim;

      // Must be called before shimPeerConnection.
      shimAddIceCandidateNullOrEmpty(window, browserDetails);
      shimParameterlessSetLocalDescription(window);

      shimGetUserMedia$2(window, browserDetails);
      shimMediaStream(window);
      shimPeerConnection$1(window, browserDetails);
      shimOnTrack$1(window);
      shimAddTrackRemoveTrack(window, browserDetails);
      shimGetSendersWithDtmf(window);
      shimSenderReceiverGetStats(window);
      fixNegotiationNeeded(window, browserDetails);

      shimRTCIceCandidate(window);
      shimRTCIceCandidateRelayProtocol(window);
      shimConnectionState(window);
      shimMaxMessageSize(window, browserDetails);
      shimSendThrowTypeError(window);
      removeExtmapAllowMixed(window, browserDetails);
      break;
    case 'firefox':
      if (!firefoxShim || !shimPeerConnection ||
          !options.shimFirefox) {
        logging('Firefox shim is not included in this adapter release.');
        return adapter;
      }
      logging('adapter.js shimming firefox.');
      // Export to the adapter global object visible in the browser.
      adapter.browserShim = firefoxShim;

      // Must be called before shimPeerConnection.
      shimAddIceCandidateNullOrEmpty(window, browserDetails);
      shimParameterlessSetLocalDescription(window);

      shimGetUserMedia$1(window, browserDetails);
      shimPeerConnection(window, browserDetails);
      shimOnTrack(window);
      shimRemoveStream(window);
      shimSenderGetStats(window);
      shimReceiverGetStats(window);
      shimRTCDataChannel(window);
      shimAddTransceiver(window);
      shimGetParameters(window);
      shimCreateOffer(window);
      shimCreateAnswer(window);

      shimRTCIceCandidate(window);
      shimConnectionState(window);
      shimMaxMessageSize(window, browserDetails);
      shimSendThrowTypeError(window);
      break;
    case 'safari':
      if (!safariShim || !options.shimSafari) {
        logging('Safari shim is not included in this adapter release.');
        return adapter;
      }
      logging('adapter.js shimming safari.');
      // Export to the adapter global object visible in the browser.
      adapter.browserShim = safariShim;

      // Must be called before shimCallbackAPI.
      shimAddIceCandidateNullOrEmpty(window, browserDetails);
      shimParameterlessSetLocalDescription(window);

      shimRTCIceServerUrls(window);
      shimCreateOfferLegacy(window);
      shimCallbacksAPI(window);
      shimLocalStreamsAPI(window);
      shimRemoteStreamsAPI(window);
      shimTrackEventTransceiver(window);
      shimGetUserMedia(window);
      shimAudioContext(window);

      shimRTCIceCandidate(window);
      shimRTCIceCandidateRelayProtocol(window);
      shimMaxMessageSize(window, browserDetails);
      shimSendThrowTypeError(window);
      removeExtmapAllowMixed(window, browserDetails);
      break;
    default:
      logging('Unsupported browser!');
      break;
  }

  return adapter;
}

/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
/* eslint-env node */


const adapter =
  adapterFactory({window: typeof window === 'undefined' ? undefined : window});

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}
class $fcbcc7538a6776d5$export$f1c5f4c9cb95390b {
    constructor(){
        this.chunkedMTU = 16300 // The original 60000 bytes setting does not work when sending data from Firefox to Chrome, which is "cut off" after 16384 bytes and delivered individually.
        ;
        // Binary stuff
        this._dataCount = 1;
        this.chunk = (blob)=>{
            const chunks = [];
            const size = blob.byteLength;
            const total = Math.ceil(size / this.chunkedMTU);
            let index = 0;
            let start = 0;
            while(start < size){
                const end = Math.min(size, start + this.chunkedMTU);
                const b = blob.slice(start, end);
                const chunk = {
                    __peerData: this._dataCount,
                    n: index,
                    data: b,
                    total: total
                };
                chunks.push(chunk);
                start = end;
                index++;
            }
            this._dataCount++;
            return chunks;
        };
    }
}
function $fcbcc7538a6776d5$export$52c89ebcdc4f53f2(bufs) {
    let size = 0;
    for (const buf of bufs)size += buf.byteLength;
    const result = new Uint8Array(size);
    let offset = 0;
    for (const buf of bufs){
        result.set(buf, offset);
        offset += buf.byteLength;
    }
    return result;
}




const $fb63e766cfafaab9$var$webRTCAdapter = //@ts-ignore
(adapter).default || (adapter);
const $fb63e766cfafaab9$export$25be9502477c137d = new class {
    isWebRTCSupported() {
        return typeof RTCPeerConnection !== "undefined";
    }
    isBrowserSupported() {
        const browser = this.getBrowser();
        const version = this.getVersion();
        const validBrowser = this.supportedBrowsers.includes(browser);
        if (!validBrowser) return false;
        if (browser === "chrome") return version >= this.minChromeVersion;
        if (browser === "firefox") return version >= this.minFirefoxVersion;
        if (browser === "safari") return !this.isIOS && version >= this.minSafariVersion;
        return false;
    }
    getBrowser() {
        return $fb63e766cfafaab9$var$webRTCAdapter.browserDetails.browser;
    }
    getVersion() {
        return $fb63e766cfafaab9$var$webRTCAdapter.browserDetails.version || 0;
    }
    isUnifiedPlanSupported() {
        const browser = this.getBrowser();
        const version = $fb63e766cfafaab9$var$webRTCAdapter.browserDetails.version || 0;
        if (browser === "chrome" && version < this.minChromeVersion) return false;
        if (browser === "firefox" && version >= this.minFirefoxVersion) return true;
        if (!window.RTCRtpTransceiver || !("currentDirection" in RTCRtpTransceiver.prototype)) return false;
        let tempPc;
        let supported = false;
        try {
            tempPc = new RTCPeerConnection();
            tempPc.addTransceiver("audio");
            supported = true;
        } catch (e) {} finally{
            if (tempPc) tempPc.close();
        }
        return supported;
    }
    toString() {
        return `Supports:
    browser:${this.getBrowser()}
    version:${this.getVersion()}
    isIOS:${this.isIOS}
    isWebRTCSupported:${this.isWebRTCSupported()}
    isBrowserSupported:${this.isBrowserSupported()}
    isUnifiedPlanSupported:${this.isUnifiedPlanSupported()}`;
    }
    constructor(){
        this.isIOS = typeof navigator !== "undefined" ? [
            "iPad",
            "iPhone",
            "iPod"
        ].includes(navigator.platform) : false;
        this.supportedBrowsers = [
            "firefox",
            "chrome",
            "safari"
        ];
        this.minFirefoxVersion = 59;
        this.minChromeVersion = 72;
        this.minSafariVersion = 605;
    }
}();


const $9a84a32bf0bf36bb$export$f35f128fd59ea256 = (id)=>{
    // Allow empty ids
    return !id || /^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/.test(id);
};


const $0e5fd1585784c252$export$4e61f672936bec77 = ()=>Math.random().toString(36).slice(2);


const $4f4134156c446392$var$DEFAULT_CONFIG = {
    iceServers: [
        {
            urls: "stun:stun.l.google.com:19302"
        },
        {
            urls: [
                "turn:eu-0.turn.peerjs.com:3478",
                "turn:us-0.turn.peerjs.com:3478"
            ],
            username: "peerjs",
            credential: "peerjsp"
        }
    ],
    sdpSemantics: "unified-plan"
};
class $4f4134156c446392$export$f8f26dd395d7e1bd extends ($fcbcc7538a6776d5$export$f1c5f4c9cb95390b) {
    noop() {}
    blobToArrayBuffer(blob, cb) {
        const fr = new FileReader();
        fr.onload = function(evt) {
            if (evt.target) cb(evt.target.result);
        };
        fr.readAsArrayBuffer(blob);
        return fr;
    }
    binaryStringToArrayBuffer(binary) {
        const byteArray = new Uint8Array(binary.length);
        for(let i = 0; i < binary.length; i++)byteArray[i] = binary.charCodeAt(i) & 0xff;
        return byteArray.buffer;
    }
    isSecure() {
        return location.protocol === "https:";
    }
    constructor(...args){
        super(...args);
        this.CLOUD_HOST = "0.peerjs.com";
        this.CLOUD_PORT = 443;
        // Browsers that need chunking:
        this.chunkedBrowsers = {
            Chrome: 1,
            chrome: 1
        };
        // Returns browser-agnostic default config
        this.defaultConfig = $4f4134156c446392$var$DEFAULT_CONFIG;
        this.browser = ($fb63e766cfafaab9$export$25be9502477c137d).getBrowser();
        this.browserVersion = ($fb63e766cfafaab9$export$25be9502477c137d).getVersion();
        this.pack = $0cfd7828ad59115f$export$2a703dbb0cb35339;
        this.unpack = $0cfd7828ad59115f$export$417857010dc9287f;
        /**
	 * A hash of WebRTC features mapped to booleans that correspond to whether the feature is supported by the current browser.
	 *
	 * :::caution
	 * Only the properties documented here are guaranteed to be present on `util.supports`
	 * :::
	 */ this.supports = function() {
            const supported = {
                browser: ($fb63e766cfafaab9$export$25be9502477c137d).isBrowserSupported(),
                webRTC: ($fb63e766cfafaab9$export$25be9502477c137d).isWebRTCSupported(),
                audioVideo: false,
                data: false,
                binaryBlob: false,
                reliable: false
            };
            if (!supported.webRTC) return supported;
            let pc;
            try {
                pc = new RTCPeerConnection($4f4134156c446392$var$DEFAULT_CONFIG);
                supported.audioVideo = true;
                let dc;
                try {
                    dc = pc.createDataChannel("_PEERJSTEST", {
                        ordered: true
                    });
                    supported.data = true;
                    supported.reliable = !!dc.ordered;
                    // Binary test
                    try {
                        dc.binaryType = "blob";
                        supported.binaryBlob = !(0, $fb63e766cfafaab9$export$25be9502477c137d).isIOS;
                    } catch (e) {}
                } catch (e) {} finally{
                    if (dc) dc.close();
                }
            } catch (e) {} finally{
                if (pc) pc.close();
            }
            return supported;
        }();
        // Ensure alphanumeric ids
        this.validateId = ($9a84a32bf0bf36bb$export$f35f128fd59ea256);
        this.randomToken = ($0e5fd1585784c252$export$4e61f672936bec77);
    }
}
const $4f4134156c446392$export$7debb50ef11d5e0b = new $4f4134156c446392$export$f8f26dd395d7e1bd();



const $257947e92926277a$var$LOG_PREFIX = "PeerJS: ";
var $257947e92926277a$export$243e62d78d3b544d;
(function(LogLevel) {
    /**
	 * Prints no logs.
	 */ LogLevel[LogLevel["Disabled"] = 0] = "Disabled";
    /**
	 * Prints only errors.
	 */ LogLevel[LogLevel["Errors"] = 1] = "Errors";
    /**
	 * Prints errors and warnings.
	 */ LogLevel[LogLevel["Warnings"] = 2] = "Warnings";
    /**
	 * Prints all logs.
	 */ LogLevel[LogLevel["All"] = 3] = "All";
})($257947e92926277a$export$243e62d78d3b544d || ($257947e92926277a$export$243e62d78d3b544d = {}));
class $257947e92926277a$var$Logger {
    get logLevel() {
        return this._logLevel;
    }
    set logLevel(logLevel) {
        this._logLevel = logLevel;
    }
    log(...args) {
        if (this._logLevel >= 3) this._print(3, ...args);
    }
    warn(...args) {
        if (this._logLevel >= 2) this._print(2, ...args);
    }
    error(...args) {
        if (this._logLevel >= 1) this._print(1, ...args);
    }
    setLogFunction(fn) {
        this._print = fn;
    }
    _print(logLevel, ...rest) {
        const copy = [
            $257947e92926277a$var$LOG_PREFIX,
            ...rest
        ];
        for(const i in copy)if (copy[i] instanceof Error) copy[i] = "(" + copy[i].name + ") " + copy[i].message;
        if (logLevel >= 3) console.log(...copy);
        else if (logLevel >= 2) console.warn("WARNING", ...copy);
        else if (logLevel >= 1) console.error("ERROR", ...copy);
    }
    constructor(){
        this._logLevel = 0;
    }
}
var $257947e92926277a$export$2e2bcd8739ae039 = new $257947e92926277a$var$Logger();


var $c4dcfd1d1ea86647$exports = {};
var $c4dcfd1d1ea86647$var$has = Object.prototype.hasOwnProperty, $c4dcfd1d1ea86647$var$prefix = "~";
/**
 * Constructor to create a storage for our `EE` objects.
 * An `Events` instance is a plain object whose properties are event names.
 *
 * @constructor
 * @private
 */ function $c4dcfd1d1ea86647$var$Events() {}
//
// We try to not inherit from `Object.prototype`. In some engines creating an
// instance in this way is faster than calling `Object.create(null)` directly.
// If `Object.create(null)` is not supported we prefix the event names with a
// character to make sure that the built-in object properties are not
// overridden or used as an attack vector.
//
if (Object.create) {
    $c4dcfd1d1ea86647$var$Events.prototype = Object.create(null);
    //
    // This hack is needed because the `__proto__` property is still inherited in
    // some old browsers like Android 4, iPhone 5.1, Opera 11 and Safari 5.
    //
    if (!new $c4dcfd1d1ea86647$var$Events().__proto__) $c4dcfd1d1ea86647$var$prefix = false;
}
/**
 * Representation of a single event listener.
 *
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
 * @constructor
 * @private
 */ function $c4dcfd1d1ea86647$var$EE(fn, context, once) {
    this.fn = fn;
    this.context = context;
    this.once = once || false;
}
/**
 * Add a listener for a given event.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} once Specify if the listener is a one-time listener.
 * @returns {EventEmitter}
 * @private
 */ function $c4dcfd1d1ea86647$var$addListener(emitter, event, fn, context, once) {
    if (typeof fn !== "function") throw new TypeError("The listener must be a function");
    var listener = new $c4dcfd1d1ea86647$var$EE(fn, context || emitter, once), evt = $c4dcfd1d1ea86647$var$prefix ? $c4dcfd1d1ea86647$var$prefix + event : event;
    if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;
    else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);
    else emitter._events[evt] = [
        emitter._events[evt],
        listener
    ];
    return emitter;
}
/**
 * Clear event by name.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} evt The Event name.
 * @private
 */ function $c4dcfd1d1ea86647$var$clearEvent(emitter, evt) {
    if (--emitter._eventsCount === 0) emitter._events = new $c4dcfd1d1ea86647$var$Events();
    else delete emitter._events[evt];
}
/**
 * Minimal `EventEmitter` interface that is molded against the Node.js
 * `EventEmitter` interface.
 *
 * @constructor
 * @public
 */ function $c4dcfd1d1ea86647$var$EventEmitter() {
    this._events = new $c4dcfd1d1ea86647$var$Events();
    this._eventsCount = 0;
}
/**
 * Return an array listing the events for which the emitter has registered
 * listeners.
 *
 * @returns {Array}
 * @public
 */ $c4dcfd1d1ea86647$var$EventEmitter.prototype.eventNames = function eventNames() {
    var names = [], events, name;
    if (this._eventsCount === 0) return names;
    for(name in events = this._events)if ($c4dcfd1d1ea86647$var$has.call(events, name)) names.push($c4dcfd1d1ea86647$var$prefix ? name.slice(1) : name);
    if (Object.getOwnPropertySymbols) return names.concat(Object.getOwnPropertySymbols(events));
    return names;
};
/**
 * Return the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Array} The registered listeners.
 * @public
 */ $c4dcfd1d1ea86647$var$EventEmitter.prototype.listeners = function listeners(event) {
    var evt = $c4dcfd1d1ea86647$var$prefix ? $c4dcfd1d1ea86647$var$prefix + event : event, handlers = this._events[evt];
    if (!handlers) return [];
    if (handlers.fn) return [
        handlers.fn
    ];
    for(var i = 0, l = handlers.length, ee = new Array(l); i < l; i++)ee[i] = handlers[i].fn;
    return ee;
};
/**
 * Return the number of listeners listening to a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Number} The number of listeners.
 * @public
 */ $c4dcfd1d1ea86647$var$EventEmitter.prototype.listenerCount = function listenerCount(event) {
    var evt = $c4dcfd1d1ea86647$var$prefix ? $c4dcfd1d1ea86647$var$prefix + event : event, listeners = this._events[evt];
    if (!listeners) return 0;
    if (listeners.fn) return 1;
    return listeners.length;
};
/**
 * Calls each of the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Boolean} `true` if the event had listeners, else `false`.
 * @public
 */ $c4dcfd1d1ea86647$var$EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
    var evt = $c4dcfd1d1ea86647$var$prefix ? $c4dcfd1d1ea86647$var$prefix + event : event;
    if (!this._events[evt]) return false;
    var listeners = this._events[evt], len = arguments.length, args, i;
    if (listeners.fn) {
        if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);
        switch(len){
            case 1:
                return listeners.fn.call(listeners.context), true;
            case 2:
                return listeners.fn.call(listeners.context, a1), true;
            case 3:
                return listeners.fn.call(listeners.context, a1, a2), true;
            case 4:
                return listeners.fn.call(listeners.context, a1, a2, a3), true;
            case 5:
                return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
            case 6:
                return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
        }
        for(i = 1, args = new Array(len - 1); i < len; i++)args[i - 1] = arguments[i];
        listeners.fn.apply(listeners.context, args);
    } else {
        var length = listeners.length, j;
        for(i = 0; i < length; i++){
            if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);
            switch(len){
                case 1:
                    listeners[i].fn.call(listeners[i].context);
                    break;
                case 2:
                    listeners[i].fn.call(listeners[i].context, a1);
                    break;
                case 3:
                    listeners[i].fn.call(listeners[i].context, a1, a2);
                    break;
                case 4:
                    listeners[i].fn.call(listeners[i].context, a1, a2, a3);
                    break;
                default:
                    if (!args) for(j = 1, args = new Array(len - 1); j < len; j++)args[j - 1] = arguments[j];
                    listeners[i].fn.apply(listeners[i].context, args);
            }
        }
    }
    return true;
};
/**
 * Add a listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */ $c4dcfd1d1ea86647$var$EventEmitter.prototype.on = function on(event, fn, context) {
    return $c4dcfd1d1ea86647$var$addListener(this, event, fn, context, false);
};
/**
 * Add a one-time listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */ $c4dcfd1d1ea86647$var$EventEmitter.prototype.once = function once(event, fn, context) {
    return $c4dcfd1d1ea86647$var$addListener(this, event, fn, context, true);
};
/**
 * Remove the listeners of a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn Only remove the listeners that match this function.
 * @param {*} context Only remove the listeners that have this context.
 * @param {Boolean} once Only remove one-time listeners.
 * @returns {EventEmitter} `this`.
 * @public
 */ $c4dcfd1d1ea86647$var$EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
    var evt = $c4dcfd1d1ea86647$var$prefix ? $c4dcfd1d1ea86647$var$prefix + event : event;
    if (!this._events[evt]) return this;
    if (!fn) {
        $c4dcfd1d1ea86647$var$clearEvent(this, evt);
        return this;
    }
    var listeners = this._events[evt];
    if (listeners.fn) {
        if (listeners.fn === fn && (!once || listeners.once) && (!context || listeners.context === context)) $c4dcfd1d1ea86647$var$clearEvent(this, evt);
    } else {
        for(var i = 0, events = [], length = listeners.length; i < length; i++)if (listeners[i].fn !== fn || once && !listeners[i].once || context && listeners[i].context !== context) events.push(listeners[i]);
        //
        // Reset the array, or remove it completely if we have no more listeners.
        //
        if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
        else $c4dcfd1d1ea86647$var$clearEvent(this, evt);
    }
    return this;
};
/**
 * Remove all listeners, or those of the specified event.
 *
 * @param {(String|Symbol)} [event] The event name.
 * @returns {EventEmitter} `this`.
 * @public
 */ $c4dcfd1d1ea86647$var$EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
    var evt;
    if (event) {
        evt = $c4dcfd1d1ea86647$var$prefix ? $c4dcfd1d1ea86647$var$prefix + event : event;
        if (this._events[evt]) $c4dcfd1d1ea86647$var$clearEvent(this, evt);
    } else {
        this._events = new $c4dcfd1d1ea86647$var$Events();
        this._eventsCount = 0;
    }
    return this;
};
//
// Alias methods names because people roll like that.
//
$c4dcfd1d1ea86647$var$EventEmitter.prototype.off = $c4dcfd1d1ea86647$var$EventEmitter.prototype.removeListener;
$c4dcfd1d1ea86647$var$EventEmitter.prototype.addListener = $c4dcfd1d1ea86647$var$EventEmitter.prototype.on;
//
// Expose the prefix.
//
$c4dcfd1d1ea86647$var$EventEmitter.prefixed = $c4dcfd1d1ea86647$var$prefix;
//
// Allow `EventEmitter` to be imported as module namespace.
//
$c4dcfd1d1ea86647$var$EventEmitter.EventEmitter = $c4dcfd1d1ea86647$var$EventEmitter;
$c4dcfd1d1ea86647$exports = $c4dcfd1d1ea86647$var$EventEmitter;



var $78455e22dea96b8c$exports = {};

$parcel$export($78455e22dea96b8c$exports, "ConnectionType", () => $78455e22dea96b8c$export$3157d57b4135e3bc);
$parcel$export($78455e22dea96b8c$exports, "PeerErrorType", () => $78455e22dea96b8c$export$9547aaa2e39030ff);
$parcel$export($78455e22dea96b8c$exports, "BaseConnectionErrorType", () => $78455e22dea96b8c$export$7974935686149686);
$parcel$export($78455e22dea96b8c$exports, "DataConnectionErrorType", () => $78455e22dea96b8c$export$49ae800c114df41d);
$parcel$export($78455e22dea96b8c$exports, "SerializationType", () => $78455e22dea96b8c$export$89f507cf986a947);
$parcel$export($78455e22dea96b8c$exports, "SocketEventType", () => $78455e22dea96b8c$export$3b5c4a4b6354f023);
$parcel$export($78455e22dea96b8c$exports, "ServerMessageType", () => $78455e22dea96b8c$export$adb4a1754da6f10d);
var $78455e22dea96b8c$export$3157d57b4135e3bc;
(function(ConnectionType) {
    ConnectionType["Data"] = "data";
    ConnectionType["Media"] = "media";
})($78455e22dea96b8c$export$3157d57b4135e3bc || ($78455e22dea96b8c$export$3157d57b4135e3bc = {}));
var $78455e22dea96b8c$export$9547aaa2e39030ff;
(function(PeerErrorType) {
    /**
	 * The client's browser does not support some or all WebRTC features that you are trying to use.
	 */ PeerErrorType["BrowserIncompatible"] = "browser-incompatible";
    /**
	 * You've already disconnected this peer from the server and can no longer make any new connections on it.
	 */ PeerErrorType["Disconnected"] = "disconnected";
    /**
	 * The ID passed into the Peer constructor contains illegal characters.
	 */ PeerErrorType["InvalidID"] = "invalid-id";
    /**
	 * The API key passed into the Peer constructor contains illegal characters or is not in the system (cloud server only).
	 */ PeerErrorType["InvalidKey"] = "invalid-key";
    /**
	 * Lost or cannot establish a connection to the signalling server.
	 */ PeerErrorType["Network"] = "network";
    /**
	 * The peer you're trying to connect to does not exist.
	 */ PeerErrorType["PeerUnavailable"] = "peer-unavailable";
    /**
	 * PeerJS is being used securely, but the cloud server does not support SSL. Use a custom PeerServer.
	 */ PeerErrorType["SslUnavailable"] = "ssl-unavailable";
    /**
	 * Unable to reach the server.
	 */ PeerErrorType["ServerError"] = "server-error";
    /**
	 * An error from the underlying socket.
	 */ PeerErrorType["SocketError"] = "socket-error";
    /**
	 * The underlying socket closed unexpectedly.
	 */ PeerErrorType["SocketClosed"] = "socket-closed";
    /**
	 * The ID passed into the Peer constructor is already taken.
	 *
	 * :::caution
	 * This error is not fatal if your peer has open peer-to-peer connections.
	 * This can happen if you attempt to {@apilink Peer.reconnect} a peer that has been disconnected from the server,
	 * but its old ID has now been taken.
	 * :::
	 */ PeerErrorType["UnavailableID"] = "unavailable-id";
    /**
	 * Native WebRTC errors.
	 */ PeerErrorType["WebRTC"] = "webrtc";
})($78455e22dea96b8c$export$9547aaa2e39030ff || ($78455e22dea96b8c$export$9547aaa2e39030ff = {}));
var $78455e22dea96b8c$export$7974935686149686;
(function(BaseConnectionErrorType) {
    BaseConnectionErrorType["NegotiationFailed"] = "negotiation-failed";
    BaseConnectionErrorType["ConnectionClosed"] = "connection-closed";
})($78455e22dea96b8c$export$7974935686149686 || ($78455e22dea96b8c$export$7974935686149686 = {}));
var $78455e22dea96b8c$export$49ae800c114df41d;
(function(DataConnectionErrorType) {
    DataConnectionErrorType["NotOpenYet"] = "not-open-yet";
    DataConnectionErrorType["MessageToBig"] = "message-too-big";
})($78455e22dea96b8c$export$49ae800c114df41d || ($78455e22dea96b8c$export$49ae800c114df41d = {}));
var $78455e22dea96b8c$export$89f507cf986a947;
(function(SerializationType) {
    SerializationType["Binary"] = "binary";
    SerializationType["BinaryUTF8"] = "binary-utf8";
    SerializationType["JSON"] = "json";
    SerializationType["None"] = "raw";
})($78455e22dea96b8c$export$89f507cf986a947 || ($78455e22dea96b8c$export$89f507cf986a947 = {}));
var $78455e22dea96b8c$export$3b5c4a4b6354f023;
(function(SocketEventType) {
    SocketEventType["Message"] = "message";
    SocketEventType["Disconnected"] = "disconnected";
    SocketEventType["Error"] = "error";
    SocketEventType["Close"] = "close";
})($78455e22dea96b8c$export$3b5c4a4b6354f023 || ($78455e22dea96b8c$export$3b5c4a4b6354f023 = {}));
var $78455e22dea96b8c$export$adb4a1754da6f10d;
(function(ServerMessageType) {
    ServerMessageType["Heartbeat"] = "HEARTBEAT";
    ServerMessageType["Candidate"] = "CANDIDATE";
    ServerMessageType["Offer"] = "OFFER";
    ServerMessageType["Answer"] = "ANSWER";
    ServerMessageType["Open"] = "OPEN";
    ServerMessageType["Error"] = "ERROR";
    ServerMessageType["IdTaken"] = "ID-TAKEN";
    ServerMessageType["InvalidKey"] = "INVALID-KEY";
    ServerMessageType["Leave"] = "LEAVE";
    ServerMessageType["Expire"] = "EXPIRE";
})($78455e22dea96b8c$export$adb4a1754da6f10d || ($78455e22dea96b8c$export$adb4a1754da6f10d = {}));


var $f5f881ec4575f1fc$exports = {};
$f5f881ec4575f1fc$exports = JSON.parse('{"name":"peerjs","version":"1.5.4","keywords":["peerjs","webrtc","p2p","rtc"],"description":"PeerJS client","homepage":"https://peerjs.com","bugs":{"url":"https://github.com/peers/peerjs/issues"},"repository":{"type":"git","url":"https://github.com/peers/peerjs"},"license":"MIT","contributors":["Michelle Bu <michelle@michellebu.com>","afrokick <devbyru@gmail.com>","ericz <really.ez@gmail.com>","Jairo <kidandcat@gmail.com>","Jonas Gloning <34194370+jonasgloning@users.noreply.github.com>","Jairo Caro-Accino Viciana <jairo@galax.be>","Carlos Caballero <carlos.caballero.gonzalez@gmail.com>","hc <hheennrryy@gmail.com>","Muhammad Asif <capripio@gmail.com>","PrashoonB <prashoonbhattacharjee@gmail.com>","Harsh Bardhan Mishra <47351025+HarshCasper@users.noreply.github.com>","akotynski <aleksanderkotbury@gmail.com>","lmb <i@lmb.io>","Jairooo <jairocaro@msn.com>","Moritz St\xfcckler <moritz.stueckler@gmail.com>","Simon <crydotsnakegithub@gmail.com>","Denis Lukov <denismassters@gmail.com>","Philipp Hancke <fippo@andyet.net>","Hans Oksendahl <hansoksendahl@gmail.com>","Jess <jessachandler@gmail.com>","khankuan <khankuan@gmail.com>","DUODVK <kurmanov.work@gmail.com>","XiZhao <kwang1imsa@gmail.com>","Matthias Lohr <matthias@lohr.me>","=frank tree <=frnktrb@googlemail.com>","Andre Eckardt <aeckardt@outlook.com>","Chris Cowan <agentme49@gmail.com>","Alex Chuev <alex@chuev.com>","alxnull <alxnull@e.mail.de>","Yemel Jardi <angel.jardi@gmail.com>","Ben Parnell <benjaminparnell.94@gmail.com>","Benny Lichtner <bennlich@gmail.com>","fresheneesz <bitetrudpublic@gmail.com>","bob.barstead@exaptive.com <bob.barstead@exaptive.com>","chandika <chandika@gmail.com>","emersion <contact@emersion.fr>","Christopher Van <cvan@users.noreply.github.com>","eddieherm <edhermoso@gmail.com>","Eduardo Pinho <enet4mikeenet@gmail.com>","Evandro Zanatta <ezanatta@tray.net.br>","Gardner Bickford <gardner@users.noreply.github.com>","Gian Luca <gianluca.cecchi@cynny.com>","PatrickJS <github@gdi2290.com>","jonnyf <github@jonathanfoss.co.uk>","Hizkia Felix <hizkifw@gmail.com>","Hristo Oskov <hristo.oskov@gmail.com>","Isaac Madwed <i.madwed@gmail.com>","Ilya Konanykhin <ilya.konanykhin@gmail.com>","jasonbarry <jasbarry@me.com>","Jonathan Burke <jonathan.burke.1311@googlemail.com>","Josh Hamit <josh.hamit@gmail.com>","Jordan Austin <jrax86@gmail.com>","Joel Wetzell <jwetzell@yahoo.com>","xizhao <kevin.wang@cloudera.com>","Alberto Torres <kungfoobar@gmail.com>","Jonathan Mayol <mayoljonathan@gmail.com>","Jefferson Felix <me@jsfelix.dev>","Rolf Erik Lekang <me@rolflekang.com>","Kevin Mai-Husan Chia <mhchia@users.noreply.github.com>","Pepijn de Vos <pepijndevos@gmail.com>","JooYoung <qkdlql@naver.com>","Tobias Speicher <rootcommander@gmail.com>","Steve Blaurock <sblaurock@gmail.com>","Kyrylo Shegeda <shegeda@ualberta.ca>","Diwank Singh Tomer <singh@diwank.name>","So\u0308ren Balko <Soeren.Balko@gmail.com>","Arpit Solanki <solankiarpit1997@gmail.com>","Yuki Ito <yuki@gnnk.net>","Artur Zayats <zag2art@gmail.com>"],"funding":{"type":"opencollective","url":"https://opencollective.com/peer"},"collective":{"type":"opencollective","url":"https://opencollective.com/peer"},"files":["dist/*"],"sideEffects":["lib/global.ts","lib/supports.ts"],"main":"dist/bundler.cjs","module":"dist/bundler.mjs","browser-minified":"dist/peerjs.min.js","browser-unminified":"dist/peerjs.js","browser-minified-msgpack":"dist/serializer.msgpack.mjs","types":"dist/types.d.ts","engines":{"node":">= 14"},"targets":{"types":{"source":"lib/exports.ts"},"main":{"source":"lib/exports.ts","sourceMap":{"inlineSources":true}},"module":{"source":"lib/exports.ts","includeNodeModules":["eventemitter3"],"sourceMap":{"inlineSources":true}},"browser-minified":{"context":"browser","outputFormat":"global","optimize":true,"engines":{"browsers":"chrome >= 83, edge >= 83, firefox >= 80, safari >= 15"},"source":"lib/global.ts"},"browser-unminified":{"context":"browser","outputFormat":"global","optimize":false,"engines":{"browsers":"chrome >= 83, edge >= 83, firefox >= 80, safari >= 15"},"source":"lib/global.ts"},"browser-minified-msgpack":{"context":"browser","outputFormat":"esmodule","isLibrary":true,"optimize":true,"engines":{"browsers":"chrome >= 83, edge >= 83, firefox >= 102, safari >= 15"},"source":"lib/dataconnection/StreamConnection/MsgPack.ts"}},"scripts":{"contributors":"git-authors-cli --print=false && prettier --write package.json && git add package.json package-lock.json && git commit -m \\"chore(contributors): update and sort contributors list\\"","check":"tsc --noEmit && tsc -p e2e/tsconfig.json --noEmit","watch":"parcel watch","build":"rm -rf dist && parcel build","prepublishOnly":"npm run build","test":"jest","test:watch":"jest --watch","coverage":"jest --coverage --collectCoverageFrom=\\"./lib/**\\"","format":"prettier --write .","format:check":"prettier --check .","semantic-release":"semantic-release","e2e":"wdio run e2e/wdio.local.conf.ts","e2e:bstack":"wdio run e2e/wdio.bstack.conf.ts"},"devDependencies":{"@parcel/config-default":"^2.9.3","@parcel/packager-ts":"^2.9.3","@parcel/transformer-typescript-tsc":"^2.9.3","@parcel/transformer-typescript-types":"^2.9.3","@semantic-release/changelog":"^6.0.1","@semantic-release/git":"^10.0.1","@swc/core":"^1.3.27","@swc/jest":"^0.2.24","@types/jasmine":"^4.3.4","@wdio/browserstack-service":"^8.11.2","@wdio/cli":"^8.11.2","@wdio/globals":"^8.11.2","@wdio/jasmine-framework":"^8.11.2","@wdio/local-runner":"^8.11.2","@wdio/spec-reporter":"^8.11.2","@wdio/types":"^8.10.4","http-server":"^14.1.1","jest":"^29.3.1","jest-environment-jsdom":"^29.3.1","mock-socket":"^9.0.0","parcel":"^2.9.3","prettier":"^3.0.0","semantic-release":"^21.0.0","ts-node":"^10.9.1","typescript":"^5.0.0","wdio-geckodriver-service":"^5.0.1"},"dependencies":{"@msgpack/msgpack":"^2.8.0","eventemitter3":"^4.0.7","peerjs-js-binarypack":"^2.1.0","webrtc-adapter":"^9.0.0"},"alias":{"process":false,"buffer":false}}');


class $8f5bfa60836d261d$export$4798917dbf149b79 extends ($c4dcfd1d1ea86647$exports.EventEmitter) {
    constructor(secure, host, port, path, key, pingInterval = 5000){
        super();
        this.pingInterval = pingInterval;
        this._disconnected = true;
        this._messagesQueue = [];
        const wsProtocol = secure ? "wss://" : "ws://";
        this._baseUrl = wsProtocol + host + ":" + port + path + "peerjs?key=" + key;
    }
    start(id, token) {
        this._id = id;
        const wsUrl = `${this._baseUrl}&id=${id}&token=${token}`;
        if (!!this._socket || !this._disconnected) return;
        this._socket = new WebSocket(wsUrl + "&version=" + ($f5f881ec4575f1fc$exports.version));
        this._disconnected = false;
        this._socket.onmessage = (event)=>{
            let data;
            try {
                data = JSON.parse(event.data);
                (0, $257947e92926277a$export$2e2bcd8739ae039).log("Server message received:", data);
            } catch (e) {
                ($257947e92926277a$export$2e2bcd8739ae039).log("Invalid server message", event.data);
                return;
            }
            this.emit(($78455e22dea96b8c$export$3b5c4a4b6354f023).Message, data);
        };
        this._socket.onclose = (event)=>{
            if (this._disconnected) return;
            ($257947e92926277a$export$2e2bcd8739ae039).log("Socket closed.", event);
            this._cleanup();
            this._disconnected = true;
            this.emit(($78455e22dea96b8c$export$3b5c4a4b6354f023).Disconnected);
        };
        // Take care of the queue of connections if necessary and make sure Peer knows
        // socket is open.
        this._socket.onopen = ()=>{
            if (this._disconnected) return;
            this._sendQueuedMessages();
            ($257947e92926277a$export$2e2bcd8739ae039).log("Socket open");
            this._scheduleHeartbeat();
        };
    }
    _scheduleHeartbeat() {
        this._wsPingTimer = setTimeout(()=>{
            this._sendHeartbeat();
        }, this.pingInterval);
    }
    _sendHeartbeat() {
        if (!this._wsOpen()) {
            ($257947e92926277a$export$2e2bcd8739ae039).log(`Cannot send heartbeat, because socket closed`);
            return;
        }
        const message = JSON.stringify({
            type: ($78455e22dea96b8c$export$adb4a1754da6f10d).Heartbeat
        });
        this._socket.send(message);
        this._scheduleHeartbeat();
    }
    /** Is the websocket currently open? */ _wsOpen() {
        return !!this._socket && this._socket.readyState === 1;
    }
    /** Send queued messages. */ _sendQueuedMessages() {
        //Create copy of queue and clear it,
        //because send method push the message back to queue if smth will go wrong
        const copiedQueue = [
            ...this._messagesQueue
        ];
        this._messagesQueue = [];
        for (const message of copiedQueue)this.send(message);
    }
    /** Exposed send for DC & Peer. */ send(data) {
        if (this._disconnected) return;
        // If we didn't get an ID yet, we can't yet send anything so we should queue
        // up these messages.
        if (!this._id) {
            this._messagesQueue.push(data);
            return;
        }
        if (!data.type) {
            this.emit(($78455e22dea96b8c$export$3b5c4a4b6354f023).Error, "Invalid message");
            return;
        }
        if (!this._wsOpen()) return;
        const message = JSON.stringify(data);
        this._socket.send(message);
    }
    close() {
        if (this._disconnected) return;
        this._cleanup();
        this._disconnected = true;
    }
    _cleanup() {
        if (this._socket) {
            this._socket.onopen = this._socket.onmessage = this._socket.onclose = null;
            this._socket.close();
            this._socket = undefined;
        }
        clearTimeout(this._wsPingTimer);
    }
}






class $b82fb8fc0514bfc1$export$89e6bb5ad64bf4a {
    constructor(connection){
        this.connection = connection;
    }
    /** Returns a PeerConnection object set up correctly (for data, media). */ startConnection(options) {
        const peerConnection = this._startPeerConnection();
        // Set the connection's PC.
        this.connection.peerConnection = peerConnection;
        if (this.connection.type === ($78455e22dea96b8c$export$3157d57b4135e3bc).Media && options._stream) this._addTracksToConnection(options._stream, peerConnection);
        // What do we need to do now?
        if (options.originator) {
            const dataConnection = this.connection;
            const config = {
                ordered: !!options.reliable
            };
            const dataChannel = peerConnection.createDataChannel(dataConnection.label, config);
            dataConnection._initializeDataChannel(dataChannel);
            this._makeOffer();
        } else this.handleSDP("OFFER", options.sdp);
    }
    /** Start a PC. */ _startPeerConnection() {
        ($257947e92926277a$export$2e2bcd8739ae039).log("Creating RTCPeerConnection.");
        const peerConnection = new RTCPeerConnection(this.connection.provider.options.config);
        this._setupListeners(peerConnection);
        return peerConnection;
    }
    /** Set up various WebRTC listeners. */ _setupListeners(peerConnection) {
        const peerId = this.connection.peer;
        const connectionId = this.connection.connectionId;
        const connectionType = this.connection.type;
        const provider = this.connection.provider;
        // ICE CANDIDATES.
        ($257947e92926277a$export$2e2bcd8739ae039).log("Listening for ICE candidates.");
        peerConnection.onicecandidate = (evt)=>{
            if (!evt.candidate || !evt.candidate.candidate) return;
            ($257947e92926277a$export$2e2bcd8739ae039).log(`Received ICE candidates for ${peerId}:`, evt.candidate);
            provider.socket.send({
                type: ($78455e22dea96b8c$export$adb4a1754da6f10d).Candidate,
                payload: {
                    candidate: evt.candidate,
                    type: connectionType,
                    connectionId: connectionId
                },
                dst: peerId
            });
        };
        peerConnection.oniceconnectionstatechange = ()=>{
            switch(peerConnection.iceConnectionState){
                case "failed":
                    ($257947e92926277a$export$2e2bcd8739ae039).log("iceConnectionState is failed, closing connections to " + peerId);
                    this.connection.emitError(($78455e22dea96b8c$export$7974935686149686).NegotiationFailed, "Negotiation of connection to " + peerId + " failed.");
                    this.connection.close();
                    break;
                case "closed":
                    ($257947e92926277a$export$2e2bcd8739ae039).log("iceConnectionState is closed, closing connections to " + peerId);
                    this.connection.emitError(($78455e22dea96b8c$export$7974935686149686).ConnectionClosed, "Connection to " + peerId + " closed.");
                    this.connection.close();
                    break;
                case "disconnected":
                    ($257947e92926277a$export$2e2bcd8739ae039).log("iceConnectionState changed to disconnected on the connection with " + peerId);
                    break;
                case "completed":
                    peerConnection.onicecandidate = ()=>{};
                    break;
            }
            this.connection.emit("iceStateChanged", peerConnection.iceConnectionState);
        };
        // DATACONNECTION.
        ($257947e92926277a$export$2e2bcd8739ae039).log("Listening for data channel");
        // Fired between offer and answer, so options should already be saved
        // in the options hash.
        peerConnection.ondatachannel = (evt)=>{
            ($257947e92926277a$export$2e2bcd8739ae039).log("Received data channel");
            const dataChannel = evt.channel;
            const connection = provider.getConnection(peerId, connectionId);
            connection._initializeDataChannel(dataChannel);
        };
        // MEDIACONNECTION.
        ($257947e92926277a$export$2e2bcd8739ae039).log("Listening for remote stream");
        peerConnection.ontrack = (evt)=>{
            ($257947e92926277a$export$2e2bcd8739ae039).log("Received remote stream");
            const stream = evt.streams[0];
            const connection = provider.getConnection(peerId, connectionId);
            if (connection.type === ($78455e22dea96b8c$export$3157d57b4135e3bc).Media) {
                const mediaConnection = connection;
                this._addStreamToMediaConnection(stream, mediaConnection);
            }
        };
    }
    cleanup() {
        ($257947e92926277a$export$2e2bcd8739ae039).log("Cleaning up PeerConnection to " + this.connection.peer);
        const peerConnection = this.connection.peerConnection;
        if (!peerConnection) return;
        this.connection.peerConnection = null;
        //unsubscribe from all PeerConnection's events
        peerConnection.onicecandidate = peerConnection.oniceconnectionstatechange = peerConnection.ondatachannel = peerConnection.ontrack = ()=>{};
        const peerConnectionNotClosed = peerConnection.signalingState !== "closed";
        let dataChannelNotClosed = false;
        const dataChannel = this.connection.dataChannel;
        if (dataChannel) dataChannelNotClosed = !!dataChannel.readyState && dataChannel.readyState !== "closed";
        if (peerConnectionNotClosed || dataChannelNotClosed) peerConnection.close();
    }
    async _makeOffer() {
        const peerConnection = this.connection.peerConnection;
        const provider = this.connection.provider;
        try {
            const offer = await peerConnection.createOffer(this.connection.options.constraints);
            (0, $257947e92926277a$export$2e2bcd8739ae039).log("Created offer.");
            if (this.connection.options.sdpTransform && typeof this.connection.options.sdpTransform === "function") offer.sdp = this.connection.options.sdpTransform(offer.sdp) || offer.sdp;
            try {
                await peerConnection.setLocalDescription(offer);
                (0, $257947e92926277a$export$2e2bcd8739ae039).log("Set localDescription:", offer, `for:${this.connection.peer}`);
                let payload = {
                    sdp: offer,
                    type: this.connection.type,
                    connectionId: this.connection.connectionId,
                    metadata: this.connection.metadata
                };
                if (this.connection.type === (0, $78455e22dea96b8c$export$3157d57b4135e3bc).Data) {
                    const dataConnection = this.connection;
                    payload = {
                        ...payload,
                        label: dataConnection.label,
                        reliable: dataConnection.reliable,
                        serialization: dataConnection.serialization
                    };
                }
                provider.socket.send({
                    type: (0, $78455e22dea96b8c$export$adb4a1754da6f10d).Offer,
                    payload: payload,
                    dst: this.connection.peer
                });
            } catch (err) {
                // TODO: investigate why _makeOffer is being called from the answer
                if (err != "OperationError: Failed to set local offer sdp: Called in wrong state: kHaveRemoteOffer") {
                    provider.emitError((0, $78455e22dea96b8c$export$9547aaa2e39030ff).WebRTC, err);
                    (0, $257947e92926277a$export$2e2bcd8739ae039).log("Failed to setLocalDescription, ", err);
                }
            }
        } catch (err_1) {
            provider.emitError(($78455e22dea96b8c$export$9547aaa2e39030ff).WebRTC, err_1);
            ($257947e92926277a$export$2e2bcd8739ae039).log("Failed to createOffer, ", err_1);
        }
    }
    async _makeAnswer() {
        const peerConnection = this.connection.peerConnection;
        const provider = this.connection.provider;
        try {
            const answer = await peerConnection.createAnswer();
            (0, $257947e92926277a$export$2e2bcd8739ae039).log("Created answer.");
            if (this.connection.options.sdpTransform && typeof this.connection.options.sdpTransform === "function") answer.sdp = this.connection.options.sdpTransform(answer.sdp) || answer.sdp;
            try {
                await peerConnection.setLocalDescription(answer);
                (0, $257947e92926277a$export$2e2bcd8739ae039).log(`Set localDescription:`, answer, `for:${this.connection.peer}`);
                provider.socket.send({
                    type: (0, $78455e22dea96b8c$export$adb4a1754da6f10d).Answer,
                    payload: {
                        sdp: answer,
                        type: this.connection.type,
                        connectionId: this.connection.connectionId
                    },
                    dst: this.connection.peer
                });
            } catch (err) {
                provider.emitError((0, $78455e22dea96b8c$export$9547aaa2e39030ff).WebRTC, err);
                (0, $257947e92926277a$export$2e2bcd8739ae039).log("Failed to setLocalDescription, ", err);
            }
        } catch (err_1) {
            provider.emitError(($78455e22dea96b8c$export$9547aaa2e39030ff).WebRTC, err_1);
            ($257947e92926277a$export$2e2bcd8739ae039).log("Failed to create answer, ", err_1);
        }
    }
    /** Handle an SDP. */ async handleSDP(type, sdp) {
        sdp = new RTCSessionDescription(sdp);
        const peerConnection = this.connection.peerConnection;
        const provider = this.connection.provider;
        ($257947e92926277a$export$2e2bcd8739ae039).log("Setting remote description", sdp);
        const self = this;
        try {
            await peerConnection.setRemoteDescription(sdp);
            (0, $257947e92926277a$export$2e2bcd8739ae039).log(`Set remoteDescription:${type} for:${this.connection.peer}`);
            if (type === "OFFER") await self._makeAnswer();
        } catch (err) {
            provider.emitError(($78455e22dea96b8c$export$9547aaa2e39030ff).WebRTC, err);
            ($257947e92926277a$export$2e2bcd8739ae039).log("Failed to setRemoteDescription, ", err);
        }
    }
    /** Handle a candidate. */ async handleCandidate(ice) {
        ($257947e92926277a$export$2e2bcd8739ae039).log(`handleCandidate:`, ice);
        try {
            await this.connection.peerConnection.addIceCandidate(ice);
            (0, $257947e92926277a$export$2e2bcd8739ae039).log(`Added ICE candidate for:${this.connection.peer}`);
        } catch (err) {
            this.connection.provider.emitError(($78455e22dea96b8c$export$9547aaa2e39030ff).WebRTC, err);
            ($257947e92926277a$export$2e2bcd8739ae039).log("Failed to handleCandidate, ", err);
        }
    }
    _addTracksToConnection(stream, peerConnection) {
        ($257947e92926277a$export$2e2bcd8739ae039).log(`add tracks from stream ${stream.id} to peer connection`);
        if (!peerConnection.addTrack) return ($257947e92926277a$export$2e2bcd8739ae039).error(`Your browser does't support RTCPeerConnection#addTrack. Ignored.`);
        stream.getTracks().forEach((track)=>{
            peerConnection.addTrack(track, stream);
        });
    }
    _addStreamToMediaConnection(stream, mediaConnection) {
        ($257947e92926277a$export$2e2bcd8739ae039).log(`add stream ${stream.id} to media connection ${mediaConnection.connectionId}`);
        mediaConnection.addStream(stream);
    }
}





class $23779d1881157a18$export$6a678e589c8a4542 extends ($c4dcfd1d1ea86647$exports.EventEmitter) {
    /**
	 * Emits a typed error message.
	 *
	 * @internal
	 */ emitError(type, err) {
        ($257947e92926277a$export$2e2bcd8739ae039).error("Error:", err);
        // @ts-ignore
        this.emit("error", new $23779d1881157a18$export$98871882f492de82(`${type}`, err));
    }
}
class $23779d1881157a18$export$98871882f492de82 extends Error {
    /**
	 * @internal
	 */ constructor(type, err){
        if (typeof err === "string") super(err);
        else {
            super();
            Object.assign(this, err);
        }
        this.type = type;
    }
}


class $5045192fc6d387ba$export$23a2a68283c24d80 extends ($23779d1881157a18$export$6a678e589c8a4542) {
    /**
	 * Whether the media connection is active (e.g. your call has been answered).
	 * You can check this if you want to set a maximum wait time for a one-sided call.
	 */ get open() {
        return this._open;
    }
    constructor(/**
		 * The ID of the peer on the other end of this connection.
		 */ peer, provider, options){
        super();
        this.peer = peer;
        this.provider = provider;
        this.options = options;
        this._open = false;
        this.metadata = options.metadata;
    }
}


class $5c1d08c7c57da9a3$export$4a84e95a2324ac29 extends ($5045192fc6d387ba$export$23a2a68283c24d80) {
    static #_ = this.ID_PREFIX = "mc_";
    /**
	 * For media connections, this is always 'media'.
	 */ get type() {
        return ($78455e22dea96b8c$export$3157d57b4135e3bc).Media;
    }
    get localStream() {
        return this._localStream;
    }
    get remoteStream() {
        return this._remoteStream;
    }
    constructor(peerId, provider, options){
        super(peerId, provider, options);
        this._localStream = this.options._stream;
        this.connectionId = this.options.connectionId || $5c1d08c7c57da9a3$export$4a84e95a2324ac29.ID_PREFIX + ($4f4134156c446392$export$7debb50ef11d5e0b).randomToken();
        this._negotiator = new ($b82fb8fc0514bfc1$export$89e6bb5ad64bf4a)(this);
        if (this._localStream) this._negotiator.startConnection({
            _stream: this._localStream,
            originator: true
        });
    }
    /** Called by the Negotiator when the DataChannel is ready. */ _initializeDataChannel(dc) {
        this.dataChannel = dc;
        this.dataChannel.onopen = ()=>{
            ($257947e92926277a$export$2e2bcd8739ae039).log(`DC#${this.connectionId} dc connection success`);
            this.emit("willCloseOnRemote");
        };
        this.dataChannel.onclose = ()=>{
            ($257947e92926277a$export$2e2bcd8739ae039).log(`DC#${this.connectionId} dc closed for:`, this.peer);
            this.close();
        };
    }
    addStream(remoteStream) {
        ($257947e92926277a$export$2e2bcd8739ae039).log("Receiving stream", remoteStream);
        this._remoteStream = remoteStream;
        super.emit("stream", remoteStream); // Should we call this `open`?
    }
    /**
	 * @internal
	 */ handleMessage(message) {
        const type = message.type;
        const payload = message.payload;
        switch(message.type){
            case ($78455e22dea96b8c$export$adb4a1754da6f10d).Answer:
                // Forward to negotiator
                this._negotiator.handleSDP(type, payload.sdp);
                this._open = true;
                break;
            case ($78455e22dea96b8c$export$adb4a1754da6f10d).Candidate:
                this._negotiator.handleCandidate(payload.candidate);
                break;
            default:
                ($257947e92926277a$export$2e2bcd8739ae039).warn(`Unrecognized message type:${type} from peer:${this.peer}`);
                break;
        }
    }
    /**
     * When receiving a {@apilink PeerEvents | `call`} event on a peer, you can call
     * `answer` on the media connection provided by the callback to accept the call
     * and optionally send your own media stream.

     *
     * @param stream A WebRTC media stream.
     * @param options
     * @returns
     */ answer(stream, options = {}) {
        if (this._localStream) {
            ($257947e92926277a$export$2e2bcd8739ae039).warn("Local stream already exists on this MediaConnection. Are you answering a call twice?");
            return;
        }
        this._localStream = stream;
        if (options && options.sdpTransform) this.options.sdpTransform = options.sdpTransform;
        this._negotiator.startConnection({
            ...this.options._payload,
            _stream: stream
        });
        // Retrieve lost messages stored because PeerConnection not set up.
        const messages = this.provider._getMessages(this.connectionId);
        for (const message of messages)this.handleMessage(message);
        this._open = true;
    }
    /**
	 * Exposed functionality for users.
	 */ /**
	 * Closes the media connection.
	 */ close() {
        if (this._negotiator) {
            this._negotiator.cleanup();
            this._negotiator = null;
        }
        this._localStream = null;
        this._remoteStream = null;
        if (this.provider) {
            this.provider._removeConnection(this);
            this.provider = null;
        }
        if (this.options && this.options._stream) this.options._stream = null;
        if (!this.open) return;
        this._open = false;
        super.emit("close");
    }
}






class $abf266641927cd89$export$2c4e825dc9120f87 {
    constructor(_options){
        this._options = _options;
    }
    _buildRequest(method) {
        const protocol = this._options.secure ? "https" : "http";
        const { host: host, port: port, path: path, key: key } = this._options;
        const url = new URL(`${protocol}://${host}:${port}${path}${key}/${method}`);
        // TODO: Why timestamp, why random?
        url.searchParams.set("ts", `${Date.now()}${Math.random()}`);
        url.searchParams.set("version", ($f5f881ec4575f1fc$exports.version));
        return fetch(url.href, {
            referrerPolicy: this._options.referrerPolicy
        });
    }
    /** Get a unique ID from the server via XHR and initialize with it. */ async retrieveId() {
        try {
            const response = await this._buildRequest("id");
            if (response.status !== 200) throw new Error(`Error. Status:${response.status}`);
            return response.text();
        } catch (error) {
            ($257947e92926277a$export$2e2bcd8739ae039).error("Error retrieving ID", error);
            let pathError = "";
            if (this._options.path === "/" && this._options.host !== ($4f4134156c446392$export$7debb50ef11d5e0b).CLOUD_HOST) pathError = " If you passed in a `path` to your self-hosted PeerServer, you'll also need to pass in that same path when creating a new Peer.";
            throw new Error("Could not get an ID from the server." + pathError);
        }
    }
    /** @deprecated */ async listAllPeers() {
        try {
            const response = await this._buildRequest("peers");
            if (response.status !== 200) {
                if (response.status === 401) {
                    let helpfulError = "";
                    if (this._options.host === (0, $4f4134156c446392$export$7debb50ef11d5e0b).CLOUD_HOST) helpfulError = "It looks like you're using the cloud server. You can email team@peerjs.com to enable peer listing for your API key.";
                    else helpfulError = "You need to enable `allow_discovery` on your self-hosted PeerServer to use this feature.";
                    throw new Error("It doesn't look like you have permission to list peers IDs. " + helpfulError);
                }
                throw new Error(`Error. Status:${response.status}`);
            }
            return response.json();
        } catch (error) {
            ($257947e92926277a$export$2e2bcd8739ae039).error("Error retrieving list peers", error);
            throw new Error("Could not get list peers from the server." + error);
        }
    }
}










class $6366c4ca161bc297$export$d365f7ad9d7df9c9 extends ($5045192fc6d387ba$export$23a2a68283c24d80) {
    static #_ = this.ID_PREFIX = "dc_";
    static #_2 = this.MAX_BUFFERED_AMOUNT = 8388608;
    get type() {
        return ($78455e22dea96b8c$export$3157d57b4135e3bc).Data;
    }
    constructor(peerId, provider, options){
        super(peerId, provider, options);
        this.connectionId = this.options.connectionId || $6366c4ca161bc297$export$d365f7ad9d7df9c9.ID_PREFIX + ($0e5fd1585784c252$export$4e61f672936bec77)();
        this.label = this.options.label || this.connectionId;
        this.reliable = !!this.options.reliable;
        this._negotiator = new ($b82fb8fc0514bfc1$export$89e6bb5ad64bf4a)(this);
        this._negotiator.startConnection(this.options._payload || {
            originator: true,
            reliable: this.reliable
        });
    }
    /** Called by the Negotiator when the DataChannel is ready. */ _initializeDataChannel(dc) {
        this.dataChannel = dc;
        this.dataChannel.onopen = ()=>{
            ($257947e92926277a$export$2e2bcd8739ae039).log(`DC#${this.connectionId} dc connection success`);
            this._open = true;
            this.emit("open");
        };
        this.dataChannel.onmessage = (e)=>{
            ($257947e92926277a$export$2e2bcd8739ae039).log(`DC#${this.connectionId} dc onmessage:`, e.data);
        // this._handleDataMessage(e);
        };
        this.dataChannel.onclose = ()=>{
            ($257947e92926277a$export$2e2bcd8739ae039).log(`DC#${this.connectionId} dc closed for:`, this.peer);
            this.close();
        };
    }
    /**
	 * Exposed functionality for users.
	 */ /** Allows user to close connection. */ close(options) {
        if (options?.flush) {
            this.send({
                __peerData: {
                    type: "close"
                }
            });
            return;
        }
        if (this._negotiator) {
            this._negotiator.cleanup();
            this._negotiator = null;
        }
        if (this.provider) {
            this.provider._removeConnection(this);
            this.provider = null;
        }
        if (this.dataChannel) {
            this.dataChannel.onopen = null;
            this.dataChannel.onmessage = null;
            this.dataChannel.onclose = null;
            this.dataChannel = null;
        }
        if (!this.open) return;
        this._open = false;
        super.emit("close");
    }
    /** Allows user to send data. */ send(data, chunked = false) {
        if (!this.open) {
            this.emitError(($78455e22dea96b8c$export$49ae800c114df41d).NotOpenYet, "Connection is not open. You should listen for the `open` event before sending messages.");
            return;
        }
        return this._send(data, chunked);
    }
    async handleMessage(message) {
        const payload = message.payload;
        switch(message.type){
            case ($78455e22dea96b8c$export$adb4a1754da6f10d).Answer:
                await this._negotiator.handleSDP(message.type, payload.sdp);
                break;
            case ($78455e22dea96b8c$export$adb4a1754da6f10d).Candidate:
                await this._negotiator.handleCandidate(payload.candidate);
                break;
            default:
                ($257947e92926277a$export$2e2bcd8739ae039).warn("Unrecognized message type:", message.type, "from peer:", this.peer);
                break;
        }
    }
}


class $a229bedbcaa6ca23$export$ff7c9d4c11d94e8b extends ($6366c4ca161bc297$export$d365f7ad9d7df9c9) {
    get bufferSize() {
        return this._bufferSize;
    }
    _initializeDataChannel(dc) {
        super._initializeDataChannel(dc);
        this.dataChannel.binaryType = "arraybuffer";
        this.dataChannel.addEventListener("message", (e)=>this._handleDataMessage(e));
    }
    _bufferedSend(msg) {
        if (this._buffering || !this._trySend(msg)) {
            this._buffer.push(msg);
            this._bufferSize = this._buffer.length;
        }
    }
    // Returns true if the send succeeds.
    _trySend(msg) {
        if (!this.open) return false;
        if (this.dataChannel.bufferedAmount > ($6366c4ca161bc297$export$d365f7ad9d7df9c9).MAX_BUFFERED_AMOUNT) {
            this._buffering = true;
            setTimeout(()=>{
                this._buffering = false;
                this._tryBuffer();
            }, 50);
            return false;
        }
        try {
            this.dataChannel.send(msg);
        } catch (e) {
            ($257947e92926277a$export$2e2bcd8739ae039).error(`DC#:${this.connectionId} Error when sending:`, e);
            this._buffering = true;
            this.close();
            return false;
        }
        return true;
    }
    // Try to send the first message in the buffer.
    _tryBuffer() {
        if (!this.open) return;
        if (this._buffer.length === 0) return;
        const msg = this._buffer[0];
        if (this._trySend(msg)) {
            this._buffer.shift();
            this._bufferSize = this._buffer.length;
            this._tryBuffer();
        }
    }
    close(options) {
        if (options?.flush) {
            this.send({
                __peerData: {
                    type: "close"
                }
            });
            return;
        }
        this._buffer = [];
        this._bufferSize = 0;
        super.close();
    }
    constructor(...args){
        super(...args);
        this._buffer = [];
        this._bufferSize = 0;
        this._buffering = false;
    }
}




class $9fcfddb3ae148f88$export$f0a5a64d5bb37108 extends ($a229bedbcaa6ca23$export$ff7c9d4c11d94e8b) {
    close(options) {
        super.close(options);
        this._chunkedData = {};
    }
    constructor(peerId, provider, options){
        super(peerId, provider, options);
        this.chunker = new ($fcbcc7538a6776d5$export$f1c5f4c9cb95390b)();
        this.serialization = ($78455e22dea96b8c$export$89f507cf986a947).Binary;
        this._chunkedData = {};
    }
    // Handles a DataChannel message.
    _handleDataMessage({ data: data }) {
        const deserializedData = ($0cfd7828ad59115f$export$417857010dc9287f)(data);
        // PeerJS specific message
        const peerData = deserializedData["__peerData"];
        if (peerData) {
            if (peerData.type === "close") {
                this.close();
                return;
            }
            // Chunked data -- piece things back together.
            // @ts-ignore
            this._handleChunk(deserializedData);
            return;
        }
        this.emit("data", deserializedData);
    }
    _handleChunk(data) {
        const id = data.__peerData;
        const chunkInfo = this._chunkedData[id] || {
            data: [],
            count: 0,
            total: data.total
        };
        chunkInfo.data[data.n] = new Uint8Array(data.data);
        chunkInfo.count++;
        this._chunkedData[id] = chunkInfo;
        if (chunkInfo.total === chunkInfo.count) {
            // Clean up before making the recursive call to `_handleDataMessage`.
            delete this._chunkedData[id];
            // We've received all the chunks--time to construct the complete data.
            // const data = new Blob(chunkInfo.data);
            const data = ($fcbcc7538a6776d5$export$52c89ebcdc4f53f2)(chunkInfo.data);
            this._handleDataMessage({
                data: data
            });
        }
    }
    _send(data, chunked) {
        const blob = ($0cfd7828ad59115f$export$2a703dbb0cb35339)(data);
        if (blob instanceof Promise) return this._send_blob(blob);
        if (!chunked && blob.byteLength > this.chunker.chunkedMTU) {
            this._sendChunks(blob);
            return;
        }
        this._bufferedSend(blob);
    }
    async _send_blob(blobPromise) {
        const blob = await blobPromise;
        if (blob.byteLength > this.chunker.chunkedMTU) {
            this._sendChunks(blob);
            return;
        }
        this._bufferedSend(blob);
    }
    _sendChunks(blob) {
        const blobs = this.chunker.chunk(blob);
        ($257947e92926277a$export$2e2bcd8739ae039).log(`DC#${this.connectionId} Try to send ${blobs.length} chunks...`);
        for (const blob of blobs)this.send(blob, true);
    }
}




class $bbaee3f15f714663$export$6f88fe47d32c9c94 extends ($a229bedbcaa6ca23$export$ff7c9d4c11d94e8b) {
    _handleDataMessage({ data: data }) {
        super.emit("data", data);
    }
    _send(data, _chunked) {
        this._bufferedSend(data);
    }
    constructor(...args){
        super(...args);
        this.serialization = ($78455e22dea96b8c$export$89f507cf986a947).None;
    }
}





class $817f931e3f9096cf$export$48880ac635f47186 extends ($a229bedbcaa6ca23$export$ff7c9d4c11d94e8b) {
    // Handles a DataChannel message.
    _handleDataMessage({ data: data }) {
        const deserializedData = this.parse(this.decoder.decode(data));
        // PeerJS specific message
        const peerData = deserializedData["__peerData"];
        if (peerData && peerData.type === "close") {
            this.close();
            return;
        }
        this.emit("data", deserializedData);
    }
    _send(data, _chunked) {
        const encodedData = this.encoder.encode(this.stringify(data));
        if (encodedData.byteLength >= ($4f4134156c446392$export$7debb50ef11d5e0b).chunkedMTU) {
            this.emitError(($78455e22dea96b8c$export$49ae800c114df41d).MessageToBig, "Message too big for JSON channel");
            return;
        }
        this._bufferedSend(encodedData);
    }
    constructor(...args){
        super(...args);
        this.serialization = ($78455e22dea96b8c$export$89f507cf986a947).JSON;
        this.encoder = new TextEncoder();
        this.decoder = new TextDecoder();
        this.stringify = JSON.stringify;
        this.parse = JSON.parse;
    }
}
class $416260bce337df90$export$ecd1fc136c422448 extends ($23779d1881157a18$export$6a678e589c8a4542) {
    static #_ = this.DEFAULT_KEY = "peerjs";
    /**
	 * The brokering ID of this peer
	 *
	 * If no ID was specified in {@apilink Peer | the constructor},
	 * this will be `undefined` until the {@apilink PeerEvents | `open`} event is emitted.
	 */ get id() {
        return this._id;
    }
    get options() {
        return this._options;
    }
    get open() {
        return this._open;
    }
    /**
	 * @internal
	 */ get socket() {
        return this._socket;
    }
    /**
	 * A hash of all connections associated with this peer, keyed by the remote peer's ID.
	 * @deprecated
	 * Return type will change from Object to Map<string,[]>
	 */ get connections() {
        const plainConnections = Object.create(null);
        for (const [k, v] of this._connections)plainConnections[k] = v;
        return plainConnections;
    }
    /**
	 * true if this peer and all of its connections can no longer be used.
	 */ get destroyed() {
        return this._destroyed;
    }
    /**
	 * false if there is an active connection to the PeerServer.
	 */ get disconnected() {
        return this._disconnected;
    }
    constructor(id, options){
        super();
        this._serializers = {
            raw: ($bbaee3f15f714663$export$6f88fe47d32c9c94),
            json: ($817f931e3f9096cf$export$48880ac635f47186),
            binary: ($9fcfddb3ae148f88$export$f0a5a64d5bb37108),
            "binary-utf8": ($9fcfddb3ae148f88$export$f0a5a64d5bb37108),
            default: ($9fcfddb3ae148f88$export$f0a5a64d5bb37108)
        };
        this._id = null;
        this._lastServerId = null;
        // States.
        this._destroyed = false // Connections have been killed
        ;
        this._disconnected = false // Connection to PeerServer killed but P2P connections still active
        ;
        this._open = false // Sockets and such are not yet open.
        ;
        this._connections = new Map() // All connections for this peer.
        ;
        this._lostMessages = new Map() // src => [list of messages]
        ;
        let userId;
        // Deal with overloading
        if (id && id.constructor == Object) options = id;
        else if (id) userId = id.toString();
        // Configurize options
        options = {
            debug: 0,
            host: ($4f4134156c446392$export$7debb50ef11d5e0b).CLOUD_HOST,
            port: ($4f4134156c446392$export$7debb50ef11d5e0b).CLOUD_PORT,
            path: "/",
            key: $416260bce337df90$export$ecd1fc136c422448.DEFAULT_KEY,
            token: ($4f4134156c446392$export$7debb50ef11d5e0b).randomToken(),
            config: ($4f4134156c446392$export$7debb50ef11d5e0b).defaultConfig,
            referrerPolicy: "strict-origin-when-cross-origin",
            serializers: {},
            ...options
        };
        this._options = options;
        this._serializers = {
            ...this._serializers,
            ...this.options.serializers
        };
        // Detect relative URL host.
        if (this._options.host === "/") this._options.host = window.location.hostname;
        // Set path correctly.
        if (this._options.path) {
            if (this._options.path[0] !== "/") this._options.path = "/" + this._options.path;
            if (this._options.path[this._options.path.length - 1] !== "/") this._options.path += "/";
        }
        // Set whether we use SSL to same as current host
        if (this._options.secure === undefined && this._options.host !== ($4f4134156c446392$export$7debb50ef11d5e0b).CLOUD_HOST) this._options.secure = ($4f4134156c446392$export$7debb50ef11d5e0b).isSecure();
        else if (this._options.host == ($4f4134156c446392$export$7debb50ef11d5e0b).CLOUD_HOST) this._options.secure = true;
        // Set a custom log function if present
        if (this._options.logFunction) ($257947e92926277a$export$2e2bcd8739ae039).setLogFunction(this._options.logFunction);
        ($257947e92926277a$export$2e2bcd8739ae039).logLevel = this._options.debug || 0;
        this._api = new ($abf266641927cd89$export$2c4e825dc9120f87)(options);
        this._socket = this._createServerConnection();
        // Sanity checks
        // Ensure WebRTC supported
        if (!($4f4134156c446392$export$7debb50ef11d5e0b).supports.audioVideo && !($4f4134156c446392$export$7debb50ef11d5e0b).supports.data) {
            this._delayedAbort(($78455e22dea96b8c$export$9547aaa2e39030ff).BrowserIncompatible, "The current browser does not support WebRTC");
            return;
        }
        // Ensure alphanumeric id
        if (!!userId && !($4f4134156c446392$export$7debb50ef11d5e0b).validateId(userId)) {
            this._delayedAbort(($78455e22dea96b8c$export$9547aaa2e39030ff).InvalidID, `ID "${userId}" is invalid`);
            return;
        }
        if (userId) this._initialize(userId);
        else this._api.retrieveId().then((id)=>this._initialize(id)).catch((error)=>this._abort(($78455e22dea96b8c$export$9547aaa2e39030ff).ServerError, error));
    }
    _createServerConnection() {
        const socket = new ($8f5bfa60836d261d$export$4798917dbf149b79)(this._options.secure, this._options.host, this._options.port, this._options.path, this._options.key, this._options.pingInterval);
        socket.on(($78455e22dea96b8c$export$3b5c4a4b6354f023).Message, (data)=>{
            this._handleMessage(data);
        });
        socket.on(($78455e22dea96b8c$export$3b5c4a4b6354f023).Error, (error)=>{
            this._abort(($78455e22dea96b8c$export$9547aaa2e39030ff).SocketError, error);
        });
        socket.on(($78455e22dea96b8c$export$3b5c4a4b6354f023).Disconnected, ()=>{
            if (this.disconnected) return;
            this.emitError(($78455e22dea96b8c$export$9547aaa2e39030ff).Network, "Lost connection to server.");
            this.disconnect();
        });
        socket.on(($78455e22dea96b8c$export$3b5c4a4b6354f023).Close, ()=>{
            if (this.disconnected) return;
            this._abort(($78455e22dea96b8c$export$9547aaa2e39030ff).SocketClosed, "Underlying socket is already closed.");
        });
        return socket;
    }
    /** Initialize a connection with the server. */ _initialize(id) {
        this._id = id;
        this.socket.start(id, this._options.token);
    }
    /** Handles messages from the server. */ _handleMessage(message) {
        const type = message.type;
        const payload = message.payload;
        const peerId = message.src;
        switch(type){
            case ($78455e22dea96b8c$export$adb4a1754da6f10d).Open:
                this._lastServerId = this.id;
                this._open = true;
                this.emit("open", this.id);
                break;
            case ($78455e22dea96b8c$export$adb4a1754da6f10d).Error:
                this._abort(($78455e22dea96b8c$export$9547aaa2e39030ff).ServerError, payload.msg);
                break;
            case ($78455e22dea96b8c$export$adb4a1754da6f10d).IdTaken:
                this._abort(($78455e22dea96b8c$export$9547aaa2e39030ff).UnavailableID, `ID "${this.id}" is taken`);
                break;
            case ($78455e22dea96b8c$export$adb4a1754da6f10d).InvalidKey:
                this._abort(($78455e22dea96b8c$export$9547aaa2e39030ff).InvalidKey, `API KEY "${this._options.key}" is invalid`);
                break;
            case ($78455e22dea96b8c$export$adb4a1754da6f10d).Leave:
                ($257947e92926277a$export$2e2bcd8739ae039).log(`Received leave message from ${peerId}`);
                this._cleanupPeer(peerId);
                this._connections.delete(peerId);
                break;
            case ($78455e22dea96b8c$export$adb4a1754da6f10d).Expire:
                this.emitError(($78455e22dea96b8c$export$9547aaa2e39030ff).PeerUnavailable, `Could not connect to peer ${peerId}`);
                break;
            case ($78455e22dea96b8c$export$adb4a1754da6f10d).Offer:
                {
                    // we should consider switching this to CALL/CONNECT, but this is the least breaking option.
                    const connectionId = payload.connectionId;
                    let connection = this.getConnection(peerId, connectionId);
                    if (connection) {
                        connection.close();
                        ($257947e92926277a$export$2e2bcd8739ae039).warn(`Offer received for existing Connection ID:${connectionId}`);
                    }
                    // Create a new connection.
                    if (payload.type === ($78455e22dea96b8c$export$3157d57b4135e3bc).Media) {
                        const mediaConnection = new ($5c1d08c7c57da9a3$export$4a84e95a2324ac29)(peerId, this, {
                            connectionId: connectionId,
                            _payload: payload,
                            metadata: payload.metadata
                        });
                        connection = mediaConnection;
                        this._addConnection(peerId, connection);
                        this.emit("call", mediaConnection);
                    } else if (payload.type === ($78455e22dea96b8c$export$3157d57b4135e3bc).Data) {
                        const dataConnection = new this._serializers[payload.serialization](peerId, this, {
                            connectionId: connectionId,
                            _payload: payload,
                            metadata: payload.metadata,
                            label: payload.label,
                            serialization: payload.serialization,
                            reliable: payload.reliable
                        });
                        connection = dataConnection;
                        this._addConnection(peerId, connection);
                        this.emit("connection", dataConnection);
                    } else {
                        ($257947e92926277a$export$2e2bcd8739ae039).warn(`Received malformed connection type:${payload.type}`);
                        return;
                    }
                    // Find messages.
                    const messages = this._getMessages(connectionId);
                    for (const message of messages)connection.handleMessage(message);
                    break;
                }
            default:
                {
                    if (!payload) {
                        ($257947e92926277a$export$2e2bcd8739ae039).warn(`You received a malformed message from ${peerId} of type ${type}`);
                        return;
                    }
                    const connectionId = payload.connectionId;
                    const connection = this.getConnection(peerId, connectionId);
                    if (connection && connection.peerConnection) // Pass it on.
                    connection.handleMessage(message);
                    else if (connectionId) // Store for possible later use
                    this._storeMessage(connectionId, message);
                    else ($257947e92926277a$export$2e2bcd8739ae039).warn("You received an unrecognized message:", message);
                    break;
                }
        }
    }
    /** Stores messages without a set up connection, to be claimed later. */ _storeMessage(connectionId, message) {
        if (!this._lostMessages.has(connectionId)) this._lostMessages.set(connectionId, []);
        this._lostMessages.get(connectionId).push(message);
    }
    /**
	 * Retrieve messages from lost message store
	 * @internal
	 */ //TODO Change it to private
    _getMessages(connectionId) {
        const messages = this._lostMessages.get(connectionId);
        if (messages) {
            this._lostMessages.delete(connectionId);
            return messages;
        }
        return [];
    }
    /**
	 * Connects to the remote peer specified by id and returns a data connection.
	 * @param peer The brokering ID of the remote peer (their {@apilink Peer.id}).
	 * @param options for specifying details about Peer Connection
	 */ connect(peer, options = {}) {
        options = {
            serialization: "default",
            ...options
        };
        if (this.disconnected) {
            ($257947e92926277a$export$2e2bcd8739ae039).warn("You cannot connect to a new Peer because you called .disconnect() on this Peer and ended your connection with the server. You can create a new Peer to reconnect, or call reconnect on this peer if you believe its ID to still be available.");
            this.emitError(($78455e22dea96b8c$export$9547aaa2e39030ff).Disconnected, "Cannot connect to new Peer after disconnecting from server.");
            return;
        }
        const dataConnection = new this._serializers[options.serialization](peer, this, options);
        this._addConnection(peer, dataConnection);
        return dataConnection;
    }
    /**
	 * Calls the remote peer specified by id and returns a media connection.
	 * @param peer The brokering ID of the remote peer (their peer.id).
	 * @param stream The caller's media stream
	 * @param options Metadata associated with the connection, passed in by whoever initiated the connection.
	 */ call(peer, stream, options = {}) {
        if (this.disconnected) {
            ($257947e92926277a$export$2e2bcd8739ae039).warn("You cannot connect to a new Peer because you called .disconnect() on this Peer and ended your connection with the server. You can create a new Peer to reconnect.");
            this.emitError(($78455e22dea96b8c$export$9547aaa2e39030ff).Disconnected, "Cannot connect to new Peer after disconnecting from server.");
            return;
        }
        if (!stream) {
            ($257947e92926277a$export$2e2bcd8739ae039).error("To call a peer, you must provide a stream from your browser's `getUserMedia`.");
            return;
        }
        const mediaConnection = new ($5c1d08c7c57da9a3$export$4a84e95a2324ac29)(peer, this, {
            ...options,
            _stream: stream
        });
        this._addConnection(peer, mediaConnection);
        return mediaConnection;
    }
    /** Add a data/media connection to this peer. */ _addConnection(peerId, connection) {
        ($257947e92926277a$export$2e2bcd8739ae039).log(`add connection ${connection.type}:${connection.connectionId} to peerId:${peerId}`);
        if (!this._connections.has(peerId)) this._connections.set(peerId, []);
        this._connections.get(peerId).push(connection);
    }
    //TODO should be private
    _removeConnection(connection) {
        const connections = this._connections.get(connection.peer);
        if (connections) {
            const index = connections.indexOf(connection);
            if (index !== -1) connections.splice(index, 1);
        }
        //remove from lost messages
        this._lostMessages.delete(connection.connectionId);
    }
    /** Retrieve a data/media connection for this peer. */ getConnection(peerId, connectionId) {
        const connections = this._connections.get(peerId);
        if (!connections) return null;
        for (const connection of connections){
            if (connection.connectionId === connectionId) return connection;
        }
        return null;
    }
    _delayedAbort(type, message) {
        setTimeout(()=>{
            this._abort(type, message);
        }, 0);
    }
    /**
	 * Emits an error message and destroys the Peer.
	 * The Peer is not destroyed if it's in a disconnected state, in which case
	 * it retains its disconnected state and its existing connections.
	 */ _abort(type, message) {
        ($257947e92926277a$export$2e2bcd8739ae039).error("Aborting!");
        this.emitError(type, message);
        if (!this._lastServerId) this.destroy();
        else this.disconnect();
    }
    /**
	 * Destroys the Peer: closes all active connections as well as the connection
	 * to the server.
	 *
	 * :::caution
	 * This cannot be undone; the respective peer object will no longer be able
	 * to create or receive any connections, its ID will be forfeited on the server,
	 * and all of its data and media connections will be closed.
	 * :::
	 */ destroy() {
        if (this.destroyed) return;
        ($257947e92926277a$export$2e2bcd8739ae039).log(`Destroy peer with ID:${this.id}`);
        this.disconnect();
        this._cleanup();
        this._destroyed = true;
        this.emit("close");
    }
    /** Disconnects every connection on this peer. */ _cleanup() {
        for (const peerId of this._connections.keys()){
            this._cleanupPeer(peerId);
            this._connections.delete(peerId);
        }
        this.socket.removeAllListeners();
    }
    /** Closes all connections to this peer. */ _cleanupPeer(peerId) {
        const connections = this._connections.get(peerId);
        if (!connections) return;
        for (const connection of connections)connection.close();
    }
    /**
	 * Disconnects the Peer's connection to the PeerServer. Does not close any
	 *  active connections.
	 * Warning: The peer can no longer create or accept connections after being
	 *  disconnected. It also cannot reconnect to the server.
	 */ disconnect() {
        if (this.disconnected) return;
        const currentId = this.id;
        ($257947e92926277a$export$2e2bcd8739ae039).log(`Disconnect peer with ID:${currentId}`);
        this._disconnected = true;
        this._open = false;
        this.socket.close();
        this._lastServerId = currentId;
        this._id = null;
        this.emit("disconnected", currentId);
    }
    /** Attempts to reconnect with the same ID.
	 *
	 * Only {@apilink Peer.disconnect | disconnected peers} can be reconnected.
	 * Destroyed peers cannot be reconnected.
	 * If the connection fails (as an example, if the peer's old ID is now taken),
	 * the peer's existing connections will not close, but any associated errors events will fire.
	 */ reconnect() {
        if (this.disconnected && !this.destroyed) {
            ($257947e92926277a$export$2e2bcd8739ae039).log(`Attempting reconnection to server with ID ${this._lastServerId}`);
            this._disconnected = false;
            this._initialize(this._lastServerId);
        } else if (this.destroyed) throw new Error("This peer cannot reconnect to the server. It has already been destroyed.");
        else if (!this.disconnected && !this.open) // Do nothing. We're still connecting the first time.
        ($257947e92926277a$export$2e2bcd8739ae039).error("In a hurry? We're still trying to make the initial connection!");
        else throw new Error(`Peer ${this.id} cannot reconnect because it is not disconnected from the server!`);
    }
    /**
	 * Get a list of available peer IDs. If you're running your own server, you'll
	 * want to set allow_discovery: true in the PeerServer options. If you're using
	 * the cloud server, email team@peerjs.com to get the functionality enabled for
	 * your key.
	 */ listAllPeers(cb = (_)=>{}) {
        this._api.listAllPeers().then((peers)=>cb(peers)).catch((error)=>this._abort(($78455e22dea96b8c$export$9547aaa2e39030ff).ServerError, error));
    }
}

var browser = {};

var canPromise;
var hasRequiredCanPromise;

function requireCanPromise () {
	if (hasRequiredCanPromise) return canPromise;
	hasRequiredCanPromise = 1;
	// can-promise has a crash in some versions of react native that dont have
	// standard global objects
	// https://github.com/soldair/node-qrcode/issues/157

	canPromise = function () {
	  return typeof Promise === 'function' && Promise.prototype && Promise.prototype.then
	};
	return canPromise;
}

var qrcode = {};

var utils$1 = {};

var hasRequiredUtils$1;

function requireUtils$1 () {
	if (hasRequiredUtils$1) return utils$1;
	hasRequiredUtils$1 = 1;
	let toSJISFunction;
	const CODEWORDS_COUNT = [
	  0, // Not used
	  26, 44, 70, 100, 134, 172, 196, 242, 292, 346,
	  404, 466, 532, 581, 655, 733, 815, 901, 991, 1085,
	  1156, 1258, 1364, 1474, 1588, 1706, 1828, 1921, 2051, 2185,
	  2323, 2465, 2611, 2761, 2876, 3034, 3196, 3362, 3532, 3706
	];

	/**
	 * Returns the QR Code size for the specified version
	 *
	 * @param  {Number} version QR Code version
	 * @return {Number}         size of QR code
	 */
	utils$1.getSymbolSize = function getSymbolSize (version) {
	  if (!version) throw new Error('"version" cannot be null or undefined')
	  if (version < 1 || version > 40) throw new Error('"version" should be in range from 1 to 40')
	  return version * 4 + 17
	};

	/**
	 * Returns the total number of codewords used to store data and EC information.
	 *
	 * @param  {Number} version QR Code version
	 * @return {Number}         Data length in bits
	 */
	utils$1.getSymbolTotalCodewords = function getSymbolTotalCodewords (version) {
	  return CODEWORDS_COUNT[version]
	};

	/**
	 * Encode data with Bose-Chaudhuri-Hocquenghem
	 *
	 * @param  {Number} data Value to encode
	 * @return {Number}      Encoded value
	 */
	utils$1.getBCHDigit = function (data) {
	  let digit = 0;

	  while (data !== 0) {
	    digit++;
	    data >>>= 1;
	  }

	  return digit
	};

	utils$1.setToSJISFunction = function setToSJISFunction (f) {
	  if (typeof f !== 'function') {
	    throw new Error('"toSJISFunc" is not a valid function.')
	  }

	  toSJISFunction = f;
	};

	utils$1.isKanjiModeEnabled = function () {
	  return typeof toSJISFunction !== 'undefined'
	};

	utils$1.toSJIS = function toSJIS (kanji) {
	  return toSJISFunction(kanji)
	};
	return utils$1;
}

var errorCorrectionLevel = {};

var hasRequiredErrorCorrectionLevel;

function requireErrorCorrectionLevel () {
	if (hasRequiredErrorCorrectionLevel) return errorCorrectionLevel;
	hasRequiredErrorCorrectionLevel = 1;
	(function (exports) {
		exports.L = { bit: 1 };
		exports.M = { bit: 0 };
		exports.Q = { bit: 3 };
		exports.H = { bit: 2 };

		function fromString (string) {
		  if (typeof string !== 'string') {
		    throw new Error('Param is not a string')
		  }

		  const lcStr = string.toLowerCase();

		  switch (lcStr) {
		    case 'l':
		    case 'low':
		      return exports.L

		    case 'm':
		    case 'medium':
		      return exports.M

		    case 'q':
		    case 'quartile':
		      return exports.Q

		    case 'h':
		    case 'high':
		      return exports.H

		    default:
		      throw new Error('Unknown EC Level: ' + string)
		  }
		}

		exports.isValid = function isValid (level) {
		  return level && typeof level.bit !== 'undefined' &&
		    level.bit >= 0 && level.bit < 4
		};

		exports.from = function from (value, defaultValue) {
		  if (exports.isValid(value)) {
		    return value
		  }

		  try {
		    return fromString(value)
		  } catch (e) {
		    return defaultValue
		  }
		}; 
	} (errorCorrectionLevel));
	return errorCorrectionLevel;
}

var bitBuffer;
var hasRequiredBitBuffer;

function requireBitBuffer () {
	if (hasRequiredBitBuffer) return bitBuffer;
	hasRequiredBitBuffer = 1;
	function BitBuffer () {
	  this.buffer = [];
	  this.length = 0;
	}

	BitBuffer.prototype = {

	  get: function (index) {
	    const bufIndex = Math.floor(index / 8);
	    return ((this.buffer[bufIndex] >>> (7 - index % 8)) & 1) === 1
	  },

	  put: function (num, length) {
	    for (let i = 0; i < length; i++) {
	      this.putBit(((num >>> (length - i - 1)) & 1) === 1);
	    }
	  },

	  getLengthInBits: function () {
	    return this.length
	  },

	  putBit: function (bit) {
	    const bufIndex = Math.floor(this.length / 8);
	    if (this.buffer.length <= bufIndex) {
	      this.buffer.push(0);
	    }

	    if (bit) {
	      this.buffer[bufIndex] |= (0x80 >>> (this.length % 8));
	    }

	    this.length++;
	  }
	};

	bitBuffer = BitBuffer;
	return bitBuffer;
}

/**
 * Helper class to handle QR Code symbol modules
 *
 * @param {Number} size Symbol size
 */

var bitMatrix;
var hasRequiredBitMatrix;

function requireBitMatrix () {
	if (hasRequiredBitMatrix) return bitMatrix;
	hasRequiredBitMatrix = 1;
	function BitMatrix (size) {
	  if (!size || size < 1) {
	    throw new Error('BitMatrix size must be defined and greater than 0')
	  }

	  this.size = size;
	  this.data = new Uint8Array(size * size);
	  this.reservedBit = new Uint8Array(size * size);
	}

	/**
	 * Set bit value at specified location
	 * If reserved flag is set, this bit will be ignored during masking process
	 *
	 * @param {Number}  row
	 * @param {Number}  col
	 * @param {Boolean} value
	 * @param {Boolean} reserved
	 */
	BitMatrix.prototype.set = function (row, col, value, reserved) {
	  const index = row * this.size + col;
	  this.data[index] = value;
	  if (reserved) this.reservedBit[index] = true;
	};

	/**
	 * Returns bit value at specified location
	 *
	 * @param  {Number}  row
	 * @param  {Number}  col
	 * @return {Boolean}
	 */
	BitMatrix.prototype.get = function (row, col) {
	  return this.data[row * this.size + col]
	};

	/**
	 * Applies xor operator at specified location
	 * (used during masking process)
	 *
	 * @param {Number}  row
	 * @param {Number}  col
	 * @param {Boolean} value
	 */
	BitMatrix.prototype.xor = function (row, col, value) {
	  this.data[row * this.size + col] ^= value;
	};

	/**
	 * Check if bit at specified location is reserved
	 *
	 * @param {Number}   row
	 * @param {Number}   col
	 * @return {Boolean}
	 */
	BitMatrix.prototype.isReserved = function (row, col) {
	  return this.reservedBit[row * this.size + col]
	};

	bitMatrix = BitMatrix;
	return bitMatrix;
}

var alignmentPattern = {};

/**
 * Alignment pattern are fixed reference pattern in defined positions
 * in a matrix symbology, which enables the decode software to re-synchronise
 * the coordinate mapping of the image modules in the event of moderate amounts
 * of distortion of the image.
 *
 * Alignment patterns are present only in QR Code symbols of version 2 or larger
 * and their number depends on the symbol version.
 */

var hasRequiredAlignmentPattern;

function requireAlignmentPattern () {
	if (hasRequiredAlignmentPattern) return alignmentPattern;
	hasRequiredAlignmentPattern = 1;
	(function (exports) {
		const getSymbolSize = requireUtils$1().getSymbolSize;

		/**
		 * Calculate the row/column coordinates of the center module of each alignment pattern
		 * for the specified QR Code version.
		 *
		 * The alignment patterns are positioned symmetrically on either side of the diagonal
		 * running from the top left corner of the symbol to the bottom right corner.
		 *
		 * Since positions are simmetrical only half of the coordinates are returned.
		 * Each item of the array will represent in turn the x and y coordinate.
		 * @see {@link getPositions}
		 *
		 * @param  {Number} version QR Code version
		 * @return {Array}          Array of coordinate
		 */
		exports.getRowColCoords = function getRowColCoords (version) {
		  if (version === 1) return []

		  const posCount = Math.floor(version / 7) + 2;
		  const size = getSymbolSize(version);
		  const intervals = size === 145 ? 26 : Math.ceil((size - 13) / (2 * posCount - 2)) * 2;
		  const positions = [size - 7]; // Last coord is always (size - 7)

		  for (let i = 1; i < posCount - 1; i++) {
		    positions[i] = positions[i - 1] - intervals;
		  }

		  positions.push(6); // First coord is always 6

		  return positions.reverse()
		};

		/**
		 * Returns an array containing the positions of each alignment pattern.
		 * Each array's element represent the center point of the pattern as (x, y) coordinates
		 *
		 * Coordinates are calculated expanding the row/column coordinates returned by {@link getRowColCoords}
		 * and filtering out the items that overlaps with finder pattern
		 *
		 * @example
		 * For a Version 7 symbol {@link getRowColCoords} returns values 6, 22 and 38.
		 * The alignment patterns, therefore, are to be centered on (row, column)
		 * positions (6,22), (22,6), (22,22), (22,38), (38,22), (38,38).
		 * Note that the coordinates (6,6), (6,38), (38,6) are occupied by finder patterns
		 * and are not therefore used for alignment patterns.
		 *
		 * let pos = getPositions(7)
		 * // [[6,22], [22,6], [22,22], [22,38], [38,22], [38,38]]
		 *
		 * @param  {Number} version QR Code version
		 * @return {Array}          Array of coordinates
		 */
		exports.getPositions = function getPositions (version) {
		  const coords = [];
		  const pos = exports.getRowColCoords(version);
		  const posLength = pos.length;

		  for (let i = 0; i < posLength; i++) {
		    for (let j = 0; j < posLength; j++) {
		      // Skip if position is occupied by finder patterns
		      if ((i === 0 && j === 0) || // top-left
		          (i === 0 && j === posLength - 1) || // bottom-left
		          (i === posLength - 1 && j === 0)) { // top-right
		        continue
		      }

		      coords.push([pos[i], pos[j]]);
		    }
		  }

		  return coords
		}; 
	} (alignmentPattern));
	return alignmentPattern;
}

var finderPattern = {};

var hasRequiredFinderPattern;

function requireFinderPattern () {
	if (hasRequiredFinderPattern) return finderPattern;
	hasRequiredFinderPattern = 1;
	const getSymbolSize = requireUtils$1().getSymbolSize;
	const FINDER_PATTERN_SIZE = 7;

	/**
	 * Returns an array containing the positions of each finder pattern.
	 * Each array's element represent the top-left point of the pattern as (x, y) coordinates
	 *
	 * @param  {Number} version QR Code version
	 * @return {Array}          Array of coordinates
	 */
	finderPattern.getPositions = function getPositions (version) {
	  const size = getSymbolSize(version);

	  return [
	    // top-left
	    [0, 0],
	    // top-right
	    [size - FINDER_PATTERN_SIZE, 0],
	    // bottom-left
	    [0, size - FINDER_PATTERN_SIZE]
	  ]
	};
	return finderPattern;
}

var maskPattern = {};

/**
 * Data mask pattern reference
 * @type {Object}
 */

var hasRequiredMaskPattern;

function requireMaskPattern () {
	if (hasRequiredMaskPattern) return maskPattern;
	hasRequiredMaskPattern = 1;
	(function (exports) {
		exports.Patterns = {
		  PATTERN000: 0,
		  PATTERN001: 1,
		  PATTERN010: 2,
		  PATTERN011: 3,
		  PATTERN100: 4,
		  PATTERN101: 5,
		  PATTERN110: 6,
		  PATTERN111: 7
		};

		/**
		 * Weighted penalty scores for the undesirable features
		 * @type {Object}
		 */
		const PenaltyScores = {
		  N1: 3,
		  N2: 3,
		  N3: 40,
		  N4: 10
		};

		/**
		 * Check if mask pattern value is valid
		 *
		 * @param  {Number}  mask    Mask pattern
		 * @return {Boolean}         true if valid, false otherwise
		 */
		exports.isValid = function isValid (mask) {
		  return mask != null && mask !== '' && !isNaN(mask) && mask >= 0 && mask <= 7
		};

		/**
		 * Returns mask pattern from a value.
		 * If value is not valid, returns undefined
		 *
		 * @param  {Number|String} value        Mask pattern value
		 * @return {Number}                     Valid mask pattern or undefined
		 */
		exports.from = function from (value) {
		  return exports.isValid(value) ? parseInt(value, 10) : undefined
		};

		/**
		* Find adjacent modules in row/column with the same color
		* and assign a penalty value.
		*
		* Points: N1 + i
		* i is the amount by which the number of adjacent modules of the same color exceeds 5
		*/
		exports.getPenaltyN1 = function getPenaltyN1 (data) {
		  const size = data.size;
		  let points = 0;
		  let sameCountCol = 0;
		  let sameCountRow = 0;
		  let lastCol = null;
		  let lastRow = null;

		  for (let row = 0; row < size; row++) {
		    sameCountCol = sameCountRow = 0;
		    lastCol = lastRow = null;

		    for (let col = 0; col < size; col++) {
		      let module = data.get(row, col);
		      if (module === lastCol) {
		        sameCountCol++;
		      } else {
		        if (sameCountCol >= 5) points += PenaltyScores.N1 + (sameCountCol - 5);
		        lastCol = module;
		        sameCountCol = 1;
		      }

		      module = data.get(col, row);
		      if (module === lastRow) {
		        sameCountRow++;
		      } else {
		        if (sameCountRow >= 5) points += PenaltyScores.N1 + (sameCountRow - 5);
		        lastRow = module;
		        sameCountRow = 1;
		      }
		    }

		    if (sameCountCol >= 5) points += PenaltyScores.N1 + (sameCountCol - 5);
		    if (sameCountRow >= 5) points += PenaltyScores.N1 + (sameCountRow - 5);
		  }

		  return points
		};

		/**
		 * Find 2x2 blocks with the same color and assign a penalty value
		 *
		 * Points: N2 * (m - 1) * (n - 1)
		 */
		exports.getPenaltyN2 = function getPenaltyN2 (data) {
		  const size = data.size;
		  let points = 0;

		  for (let row = 0; row < size - 1; row++) {
		    for (let col = 0; col < size - 1; col++) {
		      const last = data.get(row, col) +
		        data.get(row, col + 1) +
		        data.get(row + 1, col) +
		        data.get(row + 1, col + 1);

		      if (last === 4 || last === 0) points++;
		    }
		  }

		  return points * PenaltyScores.N2
		};

		/**
		 * Find 1:1:3:1:1 ratio (dark:light:dark:light:dark) pattern in row/column,
		 * preceded or followed by light area 4 modules wide
		 *
		 * Points: N3 * number of pattern found
		 */
		exports.getPenaltyN3 = function getPenaltyN3 (data) {
		  const size = data.size;
		  let points = 0;
		  let bitsCol = 0;
		  let bitsRow = 0;

		  for (let row = 0; row < size; row++) {
		    bitsCol = bitsRow = 0;
		    for (let col = 0; col < size; col++) {
		      bitsCol = ((bitsCol << 1) & 0x7FF) | data.get(row, col);
		      if (col >= 10 && (bitsCol === 0x5D0 || bitsCol === 0x05D)) points++;

		      bitsRow = ((bitsRow << 1) & 0x7FF) | data.get(col, row);
		      if (col >= 10 && (bitsRow === 0x5D0 || bitsRow === 0x05D)) points++;
		    }
		  }

		  return points * PenaltyScores.N3
		};

		/**
		 * Calculate proportion of dark modules in entire symbol
		 *
		 * Points: N4 * k
		 *
		 * k is the rating of the deviation of the proportion of dark modules
		 * in the symbol from 50% in steps of 5%
		 */
		exports.getPenaltyN4 = function getPenaltyN4 (data) {
		  let darkCount = 0;
		  const modulesCount = data.data.length;

		  for (let i = 0; i < modulesCount; i++) darkCount += data.data[i];

		  const k = Math.abs(Math.ceil((darkCount * 100 / modulesCount) / 5) - 10);

		  return k * PenaltyScores.N4
		};

		/**
		 * Return mask value at given position
		 *
		 * @param  {Number} maskPattern Pattern reference value
		 * @param  {Number} i           Row
		 * @param  {Number} j           Column
		 * @return {Boolean}            Mask value
		 */
		function getMaskAt (maskPattern, i, j) {
		  switch (maskPattern) {
		    case exports.Patterns.PATTERN000: return (i + j) % 2 === 0
		    case exports.Patterns.PATTERN001: return i % 2 === 0
		    case exports.Patterns.PATTERN010: return j % 3 === 0
		    case exports.Patterns.PATTERN011: return (i + j) % 3 === 0
		    case exports.Patterns.PATTERN100: return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 === 0
		    case exports.Patterns.PATTERN101: return (i * j) % 2 + (i * j) % 3 === 0
		    case exports.Patterns.PATTERN110: return ((i * j) % 2 + (i * j) % 3) % 2 === 0
		    case exports.Patterns.PATTERN111: return ((i * j) % 3 + (i + j) % 2) % 2 === 0

		    default: throw new Error('bad maskPattern:' + maskPattern)
		  }
		}

		/**
		 * Apply a mask pattern to a BitMatrix
		 *
		 * @param  {Number}    pattern Pattern reference number
		 * @param  {BitMatrix} data    BitMatrix data
		 */
		exports.applyMask = function applyMask (pattern, data) {
		  const size = data.size;

		  for (let col = 0; col < size; col++) {
		    for (let row = 0; row < size; row++) {
		      if (data.isReserved(row, col)) continue
		      data.xor(row, col, getMaskAt(pattern, row, col));
		    }
		  }
		};

		/**
		 * Returns the best mask pattern for data
		 *
		 * @param  {BitMatrix} data
		 * @return {Number} Mask pattern reference number
		 */
		exports.getBestMask = function getBestMask (data, setupFormatFunc) {
		  const numPatterns = Object.keys(exports.Patterns).length;
		  let bestPattern = 0;
		  let lowerPenalty = Infinity;

		  for (let p = 0; p < numPatterns; p++) {
		    setupFormatFunc(p);
		    exports.applyMask(p, data);

		    // Calculate penalty
		    const penalty =
		      exports.getPenaltyN1(data) +
		      exports.getPenaltyN2(data) +
		      exports.getPenaltyN3(data) +
		      exports.getPenaltyN4(data);

		    // Undo previously applied mask
		    exports.applyMask(p, data);

		    if (penalty < lowerPenalty) {
		      lowerPenalty = penalty;
		      bestPattern = p;
		    }
		  }

		  return bestPattern
		}; 
	} (maskPattern));
	return maskPattern;
}

var errorCorrectionCode = {};

var hasRequiredErrorCorrectionCode;

function requireErrorCorrectionCode () {
	if (hasRequiredErrorCorrectionCode) return errorCorrectionCode;
	hasRequiredErrorCorrectionCode = 1;
	const ECLevel = requireErrorCorrectionLevel();

	const EC_BLOCKS_TABLE = [
	// L  M  Q  H
	  1, 1, 1, 1,
	  1, 1, 1, 1,
	  1, 1, 2, 2,
	  1, 2, 2, 4,
	  1, 2, 4, 4,
	  2, 4, 4, 4,
	  2, 4, 6, 5,
	  2, 4, 6, 6,
	  2, 5, 8, 8,
	  4, 5, 8, 8,
	  4, 5, 8, 11,
	  4, 8, 10, 11,
	  4, 9, 12, 16,
	  4, 9, 16, 16,
	  6, 10, 12, 18,
	  6, 10, 17, 16,
	  6, 11, 16, 19,
	  6, 13, 18, 21,
	  7, 14, 21, 25,
	  8, 16, 20, 25,
	  8, 17, 23, 25,
	  9, 17, 23, 34,
	  9, 18, 25, 30,
	  10, 20, 27, 32,
	  12, 21, 29, 35,
	  12, 23, 34, 37,
	  12, 25, 34, 40,
	  13, 26, 35, 42,
	  14, 28, 38, 45,
	  15, 29, 40, 48,
	  16, 31, 43, 51,
	  17, 33, 45, 54,
	  18, 35, 48, 57,
	  19, 37, 51, 60,
	  19, 38, 53, 63,
	  20, 40, 56, 66,
	  21, 43, 59, 70,
	  22, 45, 62, 74,
	  24, 47, 65, 77,
	  25, 49, 68, 81
	];

	const EC_CODEWORDS_TABLE = [
	// L  M  Q  H
	  7, 10, 13, 17,
	  10, 16, 22, 28,
	  15, 26, 36, 44,
	  20, 36, 52, 64,
	  26, 48, 72, 88,
	  36, 64, 96, 112,
	  40, 72, 108, 130,
	  48, 88, 132, 156,
	  60, 110, 160, 192,
	  72, 130, 192, 224,
	  80, 150, 224, 264,
	  96, 176, 260, 308,
	  104, 198, 288, 352,
	  120, 216, 320, 384,
	  132, 240, 360, 432,
	  144, 280, 408, 480,
	  168, 308, 448, 532,
	  180, 338, 504, 588,
	  196, 364, 546, 650,
	  224, 416, 600, 700,
	  224, 442, 644, 750,
	  252, 476, 690, 816,
	  270, 504, 750, 900,
	  300, 560, 810, 960,
	  312, 588, 870, 1050,
	  336, 644, 952, 1110,
	  360, 700, 1020, 1200,
	  390, 728, 1050, 1260,
	  420, 784, 1140, 1350,
	  450, 812, 1200, 1440,
	  480, 868, 1290, 1530,
	  510, 924, 1350, 1620,
	  540, 980, 1440, 1710,
	  570, 1036, 1530, 1800,
	  570, 1064, 1590, 1890,
	  600, 1120, 1680, 1980,
	  630, 1204, 1770, 2100,
	  660, 1260, 1860, 2220,
	  720, 1316, 1950, 2310,
	  750, 1372, 2040, 2430
	];

	/**
	 * Returns the number of error correction block that the QR Code should contain
	 * for the specified version and error correction level.
	 *
	 * @param  {Number} version              QR Code version
	 * @param  {Number} errorCorrectionLevel Error correction level
	 * @return {Number}                      Number of error correction blocks
	 */
	errorCorrectionCode.getBlocksCount = function getBlocksCount (version, errorCorrectionLevel) {
	  switch (errorCorrectionLevel) {
	    case ECLevel.L:
	      return EC_BLOCKS_TABLE[(version - 1) * 4 + 0]
	    case ECLevel.M:
	      return EC_BLOCKS_TABLE[(version - 1) * 4 + 1]
	    case ECLevel.Q:
	      return EC_BLOCKS_TABLE[(version - 1) * 4 + 2]
	    case ECLevel.H:
	      return EC_BLOCKS_TABLE[(version - 1) * 4 + 3]
	    default:
	      return undefined
	  }
	};

	/**
	 * Returns the number of error correction codewords to use for the specified
	 * version and error correction level.
	 *
	 * @param  {Number} version              QR Code version
	 * @param  {Number} errorCorrectionLevel Error correction level
	 * @return {Number}                      Number of error correction codewords
	 */
	errorCorrectionCode.getTotalCodewordsCount = function getTotalCodewordsCount (version, errorCorrectionLevel) {
	  switch (errorCorrectionLevel) {
	    case ECLevel.L:
	      return EC_CODEWORDS_TABLE[(version - 1) * 4 + 0]
	    case ECLevel.M:
	      return EC_CODEWORDS_TABLE[(version - 1) * 4 + 1]
	    case ECLevel.Q:
	      return EC_CODEWORDS_TABLE[(version - 1) * 4 + 2]
	    case ECLevel.H:
	      return EC_CODEWORDS_TABLE[(version - 1) * 4 + 3]
	    default:
	      return undefined
	  }
	};
	return errorCorrectionCode;
}

var polynomial = {};

var galoisField = {};

var hasRequiredGaloisField;

function requireGaloisField () {
	if (hasRequiredGaloisField) return galoisField;
	hasRequiredGaloisField = 1;
	const EXP_TABLE = new Uint8Array(512);
	const LOG_TABLE = new Uint8Array(256)
	/**
	 * Precompute the log and anti-log tables for faster computation later
	 *
	 * For each possible value in the galois field 2^8, we will pre-compute
	 * the logarithm and anti-logarithm (exponential) of this value
	 *
	 * ref {@link https://en.wikiversity.org/wiki/Reed%E2%80%93Solomon_codes_for_coders#Introduction_to_mathematical_fields}
	 */
	;(function initTables () {
	  let x = 1;
	  for (let i = 0; i < 255; i++) {
	    EXP_TABLE[i] = x;
	    LOG_TABLE[x] = i;

	    x <<= 1; // multiply by 2

	    // The QR code specification says to use byte-wise modulo 100011101 arithmetic.
	    // This means that when a number is 256 or larger, it should be XORed with 0x11D.
	    if (x & 0x100) { // similar to x >= 256, but a lot faster (because 0x100 == 256)
	      x ^= 0x11D;
	    }
	  }

	  // Optimization: double the size of the anti-log table so that we don't need to mod 255 to
	  // stay inside the bounds (because we will mainly use this table for the multiplication of
	  // two GF numbers, no more).
	  // @see {@link mul}
	  for (let i = 255; i < 512; i++) {
	    EXP_TABLE[i] = EXP_TABLE[i - 255];
	  }
	}());

	/**
	 * Returns log value of n inside Galois Field
	 *
	 * @param  {Number} n
	 * @return {Number}
	 */
	galoisField.log = function log (n) {
	  if (n < 1) throw new Error('log(' + n + ')')
	  return LOG_TABLE[n]
	};

	/**
	 * Returns anti-log value of n inside Galois Field
	 *
	 * @param  {Number} n
	 * @return {Number}
	 */
	galoisField.exp = function exp (n) {
	  return EXP_TABLE[n]
	};

	/**
	 * Multiplies two number inside Galois Field
	 *
	 * @param  {Number} x
	 * @param  {Number} y
	 * @return {Number}
	 */
	galoisField.mul = function mul (x, y) {
	  if (x === 0 || y === 0) return 0

	  // should be EXP_TABLE[(LOG_TABLE[x] + LOG_TABLE[y]) % 255] if EXP_TABLE wasn't oversized
	  // @see {@link initTables}
	  return EXP_TABLE[LOG_TABLE[x] + LOG_TABLE[y]]
	};
	return galoisField;
}

var hasRequiredPolynomial;

function requirePolynomial () {
	if (hasRequiredPolynomial) return polynomial;
	hasRequiredPolynomial = 1;
	(function (exports) {
		const GF = requireGaloisField();

		/**
		 * Multiplies two polynomials inside Galois Field
		 *
		 * @param  {Uint8Array} p1 Polynomial
		 * @param  {Uint8Array} p2 Polynomial
		 * @return {Uint8Array}    Product of p1 and p2
		 */
		exports.mul = function mul (p1, p2) {
		  const coeff = new Uint8Array(p1.length + p2.length - 1);

		  for (let i = 0; i < p1.length; i++) {
		    for (let j = 0; j < p2.length; j++) {
		      coeff[i + j] ^= GF.mul(p1[i], p2[j]);
		    }
		  }

		  return coeff
		};

		/**
		 * Calculate the remainder of polynomials division
		 *
		 * @param  {Uint8Array} divident Polynomial
		 * @param  {Uint8Array} divisor  Polynomial
		 * @return {Uint8Array}          Remainder
		 */
		exports.mod = function mod (divident, divisor) {
		  let result = new Uint8Array(divident);

		  while ((result.length - divisor.length) >= 0) {
		    const coeff = result[0];

		    for (let i = 0; i < divisor.length; i++) {
		      result[i] ^= GF.mul(divisor[i], coeff);
		    }

		    // remove all zeros from buffer head
		    let offset = 0;
		    while (offset < result.length && result[offset] === 0) offset++;
		    result = result.slice(offset);
		  }

		  return result
		};

		/**
		 * Generate an irreducible generator polynomial of specified degree
		 * (used by Reed-Solomon encoder)
		 *
		 * @param  {Number} degree Degree of the generator polynomial
		 * @return {Uint8Array}    Buffer containing polynomial coefficients
		 */
		exports.generateECPolynomial = function generateECPolynomial (degree) {
		  let poly = new Uint8Array([1]);
		  for (let i = 0; i < degree; i++) {
		    poly = exports.mul(poly, new Uint8Array([1, GF.exp(i)]));
		  }

		  return poly
		}; 
	} (polynomial));
	return polynomial;
}

var reedSolomonEncoder;
var hasRequiredReedSolomonEncoder;

function requireReedSolomonEncoder () {
	if (hasRequiredReedSolomonEncoder) return reedSolomonEncoder;
	hasRequiredReedSolomonEncoder = 1;
	const Polynomial = requirePolynomial();

	function ReedSolomonEncoder (degree) {
	  this.genPoly = undefined;
	  this.degree = degree;

	  if (this.degree) this.initialize(this.degree);
	}

	/**
	 * Initialize the encoder.
	 * The input param should correspond to the number of error correction codewords.
	 *
	 * @param  {Number} degree
	 */
	ReedSolomonEncoder.prototype.initialize = function initialize (degree) {
	  // create an irreducible generator polynomial
	  this.degree = degree;
	  this.genPoly = Polynomial.generateECPolynomial(this.degree);
	};

	/**
	 * Encodes a chunk of data
	 *
	 * @param  {Uint8Array} data Buffer containing input data
	 * @return {Uint8Array}      Buffer containing encoded data
	 */
	ReedSolomonEncoder.prototype.encode = function encode (data) {
	  if (!this.genPoly) {
	    throw new Error('Encoder not initialized')
	  }

	  // Calculate EC for this data block
	  // extends data size to data+genPoly size
	  const paddedData = new Uint8Array(data.length + this.degree);
	  paddedData.set(data);

	  // The error correction codewords are the remainder after dividing the data codewords
	  // by a generator polynomial
	  const remainder = Polynomial.mod(paddedData, this.genPoly);

	  // return EC data blocks (last n byte, where n is the degree of genPoly)
	  // If coefficients number in remainder are less than genPoly degree,
	  // pad with 0s to the left to reach the needed number of coefficients
	  const start = this.degree - remainder.length;
	  if (start > 0) {
	    const buff = new Uint8Array(this.degree);
	    buff.set(remainder, start);

	    return buff
	  }

	  return remainder
	};

	reedSolomonEncoder = ReedSolomonEncoder;
	return reedSolomonEncoder;
}

var version = {};

var mode = {};

var versionCheck = {};

/**
 * Check if QR Code version is valid
 *
 * @param  {Number}  version QR Code version
 * @return {Boolean}         true if valid version, false otherwise
 */

var hasRequiredVersionCheck;

function requireVersionCheck () {
	if (hasRequiredVersionCheck) return versionCheck;
	hasRequiredVersionCheck = 1;
	versionCheck.isValid = function isValid (version) {
	  return !isNaN(version) && version >= 1 && version <= 40
	};
	return versionCheck;
}

var regex = {};

var hasRequiredRegex;

function requireRegex () {
	if (hasRequiredRegex) return regex;
	hasRequiredRegex = 1;
	const numeric = '[0-9]+';
	const alphanumeric = '[A-Z $%*+\\-./:]+';
	let kanji = '(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|' +
	  '[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|' +
	  '[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|' +
	  '[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+';
	kanji = kanji.replace(/u/g, '\\u');

	const byte = '(?:(?![A-Z0-9 $%*+\\-./:]|' + kanji + ')(?:.|[\r\n]))+';

	regex.KANJI = new RegExp(kanji, 'g');
	regex.BYTE_KANJI = new RegExp('[^A-Z0-9 $%*+\\-./:]+', 'g');
	regex.BYTE = new RegExp(byte, 'g');
	regex.NUMERIC = new RegExp(numeric, 'g');
	regex.ALPHANUMERIC = new RegExp(alphanumeric, 'g');

	const TEST_KANJI = new RegExp('^' + kanji + '$');
	const TEST_NUMERIC = new RegExp('^' + numeric + '$');
	const TEST_ALPHANUMERIC = new RegExp('^[A-Z0-9 $%*+\\-./:]+$');

	regex.testKanji = function testKanji (str) {
	  return TEST_KANJI.test(str)
	};

	regex.testNumeric = function testNumeric (str) {
	  return TEST_NUMERIC.test(str)
	};

	regex.testAlphanumeric = function testAlphanumeric (str) {
	  return TEST_ALPHANUMERIC.test(str)
	};
	return regex;
}

var hasRequiredMode;

function requireMode () {
	if (hasRequiredMode) return mode;
	hasRequiredMode = 1;
	(function (exports) {
		const VersionCheck = requireVersionCheck();
		const Regex = requireRegex();

		/**
		 * Numeric mode encodes data from the decimal digit set (0 - 9)
		 * (byte values 30HEX to 39HEX).
		 * Normally, 3 data characters are represented by 10 bits.
		 *
		 * @type {Object}
		 */
		exports.NUMERIC = {
		  id: 'Numeric',
		  bit: 1 << 0,
		  ccBits: [10, 12, 14]
		};

		/**
		 * Alphanumeric mode encodes data from a set of 45 characters,
		 * i.e. 10 numeric digits (0 - 9),
		 *      26 alphabetic characters (A - Z),
		 *   and 9 symbols (SP, $, %, *, +, -, ., /, :).
		 * Normally, two input characters are represented by 11 bits.
		 *
		 * @type {Object}
		 */
		exports.ALPHANUMERIC = {
		  id: 'Alphanumeric',
		  bit: 1 << 1,
		  ccBits: [9, 11, 13]
		};

		/**
		 * In byte mode, data is encoded at 8 bits per character.
		 *
		 * @type {Object}
		 */
		exports.BYTE = {
		  id: 'Byte',
		  bit: 1 << 2,
		  ccBits: [8, 16, 16]
		};

		/**
		 * The Kanji mode efficiently encodes Kanji characters in accordance with
		 * the Shift JIS system based on JIS X 0208.
		 * The Shift JIS values are shifted from the JIS X 0208 values.
		 * JIS X 0208 gives details of the shift coded representation.
		 * Each two-byte character value is compacted to a 13-bit binary codeword.
		 *
		 * @type {Object}
		 */
		exports.KANJI = {
		  id: 'Kanji',
		  bit: 1 << 3,
		  ccBits: [8, 10, 12]
		};

		/**
		 * Mixed mode will contain a sequences of data in a combination of any of
		 * the modes described above
		 *
		 * @type {Object}
		 */
		exports.MIXED = {
		  bit: -1
		};

		/**
		 * Returns the number of bits needed to store the data length
		 * according to QR Code specifications.
		 *
		 * @param  {Mode}   mode    Data mode
		 * @param  {Number} version QR Code version
		 * @return {Number}         Number of bits
		 */
		exports.getCharCountIndicator = function getCharCountIndicator (mode, version) {
		  if (!mode.ccBits) throw new Error('Invalid mode: ' + mode)

		  if (!VersionCheck.isValid(version)) {
		    throw new Error('Invalid version: ' + version)
		  }

		  if (version >= 1 && version < 10) return mode.ccBits[0]
		  else if (version < 27) return mode.ccBits[1]
		  return mode.ccBits[2]
		};

		/**
		 * Returns the most efficient mode to store the specified data
		 *
		 * @param  {String} dataStr Input data string
		 * @return {Mode}           Best mode
		 */
		exports.getBestModeForData = function getBestModeForData (dataStr) {
		  if (Regex.testNumeric(dataStr)) return exports.NUMERIC
		  else if (Regex.testAlphanumeric(dataStr)) return exports.ALPHANUMERIC
		  else if (Regex.testKanji(dataStr)) return exports.KANJI
		  else return exports.BYTE
		};

		/**
		 * Return mode name as string
		 *
		 * @param {Mode} mode Mode object
		 * @returns {String}  Mode name
		 */
		exports.toString = function toString (mode) {
		  if (mode && mode.id) return mode.id
		  throw new Error('Invalid mode')
		};

		/**
		 * Check if input param is a valid mode object
		 *
		 * @param   {Mode}    mode Mode object
		 * @returns {Boolean} True if valid mode, false otherwise
		 */
		exports.isValid = function isValid (mode) {
		  return mode && mode.bit && mode.ccBits
		};

		/**
		 * Get mode object from its name
		 *
		 * @param   {String} string Mode name
		 * @returns {Mode}          Mode object
		 */
		function fromString (string) {
		  if (typeof string !== 'string') {
		    throw new Error('Param is not a string')
		  }

		  const lcStr = string.toLowerCase();

		  switch (lcStr) {
		    case 'numeric':
		      return exports.NUMERIC
		    case 'alphanumeric':
		      return exports.ALPHANUMERIC
		    case 'kanji':
		      return exports.KANJI
		    case 'byte':
		      return exports.BYTE
		    default:
		      throw new Error('Unknown mode: ' + string)
		  }
		}

		/**
		 * Returns mode from a value.
		 * If value is not a valid mode, returns defaultValue
		 *
		 * @param  {Mode|String} value        Encoding mode
		 * @param  {Mode}        defaultValue Fallback value
		 * @return {Mode}                     Encoding mode
		 */
		exports.from = function from (value, defaultValue) {
		  if (exports.isValid(value)) {
		    return value
		  }

		  try {
		    return fromString(value)
		  } catch (e) {
		    return defaultValue
		  }
		}; 
	} (mode));
	return mode;
}

var hasRequiredVersion;

function requireVersion () {
	if (hasRequiredVersion) return version;
	hasRequiredVersion = 1;
	(function (exports) {
		const Utils = requireUtils$1();
		const ECCode = requireErrorCorrectionCode();
		const ECLevel = requireErrorCorrectionLevel();
		const Mode = requireMode();
		const VersionCheck = requireVersionCheck();

		// Generator polynomial used to encode version information
		const G18 = (1 << 12) | (1 << 11) | (1 << 10) | (1 << 9) | (1 << 8) | (1 << 5) | (1 << 2) | (1 << 0);
		const G18_BCH = Utils.getBCHDigit(G18);

		function getBestVersionForDataLength (mode, length, errorCorrectionLevel) {
		  for (let currentVersion = 1; currentVersion <= 40; currentVersion++) {
		    if (length <= exports.getCapacity(currentVersion, errorCorrectionLevel, mode)) {
		      return currentVersion
		    }
		  }

		  return undefined
		}

		function getReservedBitsCount (mode, version) {
		  // Character count indicator + mode indicator bits
		  return Mode.getCharCountIndicator(mode, version) + 4
		}

		function getTotalBitsFromDataArray (segments, version) {
		  let totalBits = 0;

		  segments.forEach(function (data) {
		    const reservedBits = getReservedBitsCount(data.mode, version);
		    totalBits += reservedBits + data.getBitsLength();
		  });

		  return totalBits
		}

		function getBestVersionForMixedData (segments, errorCorrectionLevel) {
		  for (let currentVersion = 1; currentVersion <= 40; currentVersion++) {
		    const length = getTotalBitsFromDataArray(segments, currentVersion);
		    if (length <= exports.getCapacity(currentVersion, errorCorrectionLevel, Mode.MIXED)) {
		      return currentVersion
		    }
		  }

		  return undefined
		}

		/**
		 * Returns version number from a value.
		 * If value is not a valid version, returns defaultValue
		 *
		 * @param  {Number|String} value        QR Code version
		 * @param  {Number}        defaultValue Fallback value
		 * @return {Number}                     QR Code version number
		 */
		exports.from = function from (value, defaultValue) {
		  if (VersionCheck.isValid(value)) {
		    return parseInt(value, 10)
		  }

		  return defaultValue
		};

		/**
		 * Returns how much data can be stored with the specified QR code version
		 * and error correction level
		 *
		 * @param  {Number} version              QR Code version (1-40)
		 * @param  {Number} errorCorrectionLevel Error correction level
		 * @param  {Mode}   mode                 Data mode
		 * @return {Number}                      Quantity of storable data
		 */
		exports.getCapacity = function getCapacity (version, errorCorrectionLevel, mode) {
		  if (!VersionCheck.isValid(version)) {
		    throw new Error('Invalid QR Code version')
		  }

		  // Use Byte mode as default
		  if (typeof mode === 'undefined') mode = Mode.BYTE;

		  // Total codewords for this QR code version (Data + Error correction)
		  const totalCodewords = Utils.getSymbolTotalCodewords(version);

		  // Total number of error correction codewords
		  const ecTotalCodewords = ECCode.getTotalCodewordsCount(version, errorCorrectionLevel);

		  // Total number of data codewords
		  const dataTotalCodewordsBits = (totalCodewords - ecTotalCodewords) * 8;

		  if (mode === Mode.MIXED) return dataTotalCodewordsBits

		  const usableBits = dataTotalCodewordsBits - getReservedBitsCount(mode, version);

		  // Return max number of storable codewords
		  switch (mode) {
		    case Mode.NUMERIC:
		      return Math.floor((usableBits / 10) * 3)

		    case Mode.ALPHANUMERIC:
		      return Math.floor((usableBits / 11) * 2)

		    case Mode.KANJI:
		      return Math.floor(usableBits / 13)

		    case Mode.BYTE:
		    default:
		      return Math.floor(usableBits / 8)
		  }
		};

		/**
		 * Returns the minimum version needed to contain the amount of data
		 *
		 * @param  {Segment} data                    Segment of data
		 * @param  {Number} [errorCorrectionLevel=H] Error correction level
		 * @param  {Mode} mode                       Data mode
		 * @return {Number}                          QR Code version
		 */
		exports.getBestVersionForData = function getBestVersionForData (data, errorCorrectionLevel) {
		  let seg;

		  const ecl = ECLevel.from(errorCorrectionLevel, ECLevel.M);

		  if (Array.isArray(data)) {
		    if (data.length > 1) {
		      return getBestVersionForMixedData(data, ecl)
		    }

		    if (data.length === 0) {
		      return 1
		    }

		    seg = data[0];
		  } else {
		    seg = data;
		  }

		  return getBestVersionForDataLength(seg.mode, seg.getLength(), ecl)
		};

		/**
		 * Returns version information with relative error correction bits
		 *
		 * The version information is included in QR Code symbols of version 7 or larger.
		 * It consists of an 18-bit sequence containing 6 data bits,
		 * with 12 error correction bits calculated using the (18, 6) Golay code.
		 *
		 * @param  {Number} version QR Code version
		 * @return {Number}         Encoded version info bits
		 */
		exports.getEncodedBits = function getEncodedBits (version) {
		  if (!VersionCheck.isValid(version) || version < 7) {
		    throw new Error('Invalid QR Code version')
		  }

		  let d = version << 12;

		  while (Utils.getBCHDigit(d) - G18_BCH >= 0) {
		    d ^= (G18 << (Utils.getBCHDigit(d) - G18_BCH));
		  }

		  return (version << 12) | d
		}; 
	} (version));
	return version;
}

var formatInfo = {};

var hasRequiredFormatInfo;

function requireFormatInfo () {
	if (hasRequiredFormatInfo) return formatInfo;
	hasRequiredFormatInfo = 1;
	const Utils = requireUtils$1();

	const G15 = (1 << 10) | (1 << 8) | (1 << 5) | (1 << 4) | (1 << 2) | (1 << 1) | (1 << 0);
	const G15_MASK = (1 << 14) | (1 << 12) | (1 << 10) | (1 << 4) | (1 << 1);
	const G15_BCH = Utils.getBCHDigit(G15);

	/**
	 * Returns format information with relative error correction bits
	 *
	 * The format information is a 15-bit sequence containing 5 data bits,
	 * with 10 error correction bits calculated using the (15, 5) BCH code.
	 *
	 * @param  {Number} errorCorrectionLevel Error correction level
	 * @param  {Number} mask                 Mask pattern
	 * @return {Number}                      Encoded format information bits
	 */
	formatInfo.getEncodedBits = function getEncodedBits (errorCorrectionLevel, mask) {
	  const data = ((errorCorrectionLevel.bit << 3) | mask);
	  let d = data << 10;

	  while (Utils.getBCHDigit(d) - G15_BCH >= 0) {
	    d ^= (G15 << (Utils.getBCHDigit(d) - G15_BCH));
	  }

	  // xor final data with mask pattern in order to ensure that
	  // no combination of Error Correction Level and data mask pattern
	  // will result in an all-zero data string
	  return ((data << 10) | d) ^ G15_MASK
	};
	return formatInfo;
}

var segments = {};

var numericData;
var hasRequiredNumericData;

function requireNumericData () {
	if (hasRequiredNumericData) return numericData;
	hasRequiredNumericData = 1;
	const Mode = requireMode();

	function NumericData (data) {
	  this.mode = Mode.NUMERIC;
	  this.data = data.toString();
	}

	NumericData.getBitsLength = function getBitsLength (length) {
	  return 10 * Math.floor(length / 3) + ((length % 3) ? ((length % 3) * 3 + 1) : 0)
	};

	NumericData.prototype.getLength = function getLength () {
	  return this.data.length
	};

	NumericData.prototype.getBitsLength = function getBitsLength () {
	  return NumericData.getBitsLength(this.data.length)
	};

	NumericData.prototype.write = function write (bitBuffer) {
	  let i, group, value;

	  // The input data string is divided into groups of three digits,
	  // and each group is converted to its 10-bit binary equivalent.
	  for (i = 0; i + 3 <= this.data.length; i += 3) {
	    group = this.data.substr(i, 3);
	    value = parseInt(group, 10);

	    bitBuffer.put(value, 10);
	  }

	  // If the number of input digits is not an exact multiple of three,
	  // the final one or two digits are converted to 4 or 7 bits respectively.
	  const remainingNum = this.data.length - i;
	  if (remainingNum > 0) {
	    group = this.data.substr(i);
	    value = parseInt(group, 10);

	    bitBuffer.put(value, remainingNum * 3 + 1);
	  }
	};

	numericData = NumericData;
	return numericData;
}

var alphanumericData;
var hasRequiredAlphanumericData;

function requireAlphanumericData () {
	if (hasRequiredAlphanumericData) return alphanumericData;
	hasRequiredAlphanumericData = 1;
	const Mode = requireMode();

	/**
	 * Array of characters available in alphanumeric mode
	 *
	 * As per QR Code specification, to each character
	 * is assigned a value from 0 to 44 which in this case coincides
	 * with the array index
	 *
	 * @type {Array}
	 */
	const ALPHA_NUM_CHARS = [
	  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
	  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
	  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
	  ' ', '$', '%', '*', '+', '-', '.', '/', ':'
	];

	function AlphanumericData (data) {
	  this.mode = Mode.ALPHANUMERIC;
	  this.data = data;
	}

	AlphanumericData.getBitsLength = function getBitsLength (length) {
	  return 11 * Math.floor(length / 2) + 6 * (length % 2)
	};

	AlphanumericData.prototype.getLength = function getLength () {
	  return this.data.length
	};

	AlphanumericData.prototype.getBitsLength = function getBitsLength () {
	  return AlphanumericData.getBitsLength(this.data.length)
	};

	AlphanumericData.prototype.write = function write (bitBuffer) {
	  let i;

	  // Input data characters are divided into groups of two characters
	  // and encoded as 11-bit binary codes.
	  for (i = 0; i + 2 <= this.data.length; i += 2) {
	    // The character value of the first character is multiplied by 45
	    let value = ALPHA_NUM_CHARS.indexOf(this.data[i]) * 45;

	    // The character value of the second digit is added to the product
	    value += ALPHA_NUM_CHARS.indexOf(this.data[i + 1]);

	    // The sum is then stored as 11-bit binary number
	    bitBuffer.put(value, 11);
	  }

	  // If the number of input data characters is not a multiple of two,
	  // the character value of the final character is encoded as a 6-bit binary number.
	  if (this.data.length % 2) {
	    bitBuffer.put(ALPHA_NUM_CHARS.indexOf(this.data[i]), 6);
	  }
	};

	alphanumericData = AlphanumericData;
	return alphanumericData;
}

var byteData;
var hasRequiredByteData;

function requireByteData () {
	if (hasRequiredByteData) return byteData;
	hasRequiredByteData = 1;
	const Mode = requireMode();

	function ByteData (data) {
	  this.mode = Mode.BYTE;
	  if (typeof (data) === 'string') {
	    this.data = new TextEncoder().encode(data);
	  } else {
	    this.data = new Uint8Array(data);
	  }
	}

	ByteData.getBitsLength = function getBitsLength (length) {
	  return length * 8
	};

	ByteData.prototype.getLength = function getLength () {
	  return this.data.length
	};

	ByteData.prototype.getBitsLength = function getBitsLength () {
	  return ByteData.getBitsLength(this.data.length)
	};

	ByteData.prototype.write = function (bitBuffer) {
	  for (let i = 0, l = this.data.length; i < l; i++) {
	    bitBuffer.put(this.data[i], 8);
	  }
	};

	byteData = ByteData;
	return byteData;
}

var kanjiData;
var hasRequiredKanjiData;

function requireKanjiData () {
	if (hasRequiredKanjiData) return kanjiData;
	hasRequiredKanjiData = 1;
	const Mode = requireMode();
	const Utils = requireUtils$1();

	function KanjiData (data) {
	  this.mode = Mode.KANJI;
	  this.data = data;
	}

	KanjiData.getBitsLength = function getBitsLength (length) {
	  return length * 13
	};

	KanjiData.prototype.getLength = function getLength () {
	  return this.data.length
	};

	KanjiData.prototype.getBitsLength = function getBitsLength () {
	  return KanjiData.getBitsLength(this.data.length)
	};

	KanjiData.prototype.write = function (bitBuffer) {
	  let i;

	  // In the Shift JIS system, Kanji characters are represented by a two byte combination.
	  // These byte values are shifted from the JIS X 0208 values.
	  // JIS X 0208 gives details of the shift coded representation.
	  for (i = 0; i < this.data.length; i++) {
	    let value = Utils.toSJIS(this.data[i]);

	    // For characters with Shift JIS values from 0x8140 to 0x9FFC:
	    if (value >= 0x8140 && value <= 0x9FFC) {
	      // Subtract 0x8140 from Shift JIS value
	      value -= 0x8140;

	    // For characters with Shift JIS values from 0xE040 to 0xEBBF
	    } else if (value >= 0xE040 && value <= 0xEBBF) {
	      // Subtract 0xC140 from Shift JIS value
	      value -= 0xC140;
	    } else {
	      throw new Error(
	        'Invalid SJIS character: ' + this.data[i] + '\n' +
	        'Make sure your charset is UTF-8')
	    }

	    // Multiply most significant byte of result by 0xC0
	    // and add least significant byte to product
	    value = (((value >>> 8) & 0xff) * 0xC0) + (value & 0xff);

	    // Convert result to a 13-bit binary string
	    bitBuffer.put(value, 13);
	  }
	};

	kanjiData = KanjiData;
	return kanjiData;
}

var dijkstra = {exports: {}};

var hasRequiredDijkstra;

function requireDijkstra () {
	if (hasRequiredDijkstra) return dijkstra.exports;
	hasRequiredDijkstra = 1;
	(function (module) {

		/******************************************************************************
		 * Created 2008-08-19.
		 *
		 * Dijkstra path-finding functions. Adapted from the Dijkstar Python project.
		 *
		 * Copyright (C) 2008
		 *   Wyatt Baldwin <self@wyattbaldwin.com>
		 *   All rights reserved
		 *
		 * Licensed under the MIT license.
		 *
		 *   http://www.opensource.org/licenses/mit-license.php
		 *
		 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
		 * THE SOFTWARE.
		 *****************************************************************************/
		var dijkstra = {
		  single_source_shortest_paths: function(graph, s, d) {
		    // Predecessor map for each node that has been encountered.
		    // node ID => predecessor node ID
		    var predecessors = {};

		    // Costs of shortest paths from s to all nodes encountered.
		    // node ID => cost
		    var costs = {};
		    costs[s] = 0;

		    // Costs of shortest paths from s to all nodes encountered; differs from
		    // `costs` in that it provides easy access to the node that currently has
		    // the known shortest path from s.
		    // XXX: Do we actually need both `costs` and `open`?
		    var open = dijkstra.PriorityQueue.make();
		    open.push(s, 0);

		    var closest,
		        u, v,
		        cost_of_s_to_u,
		        adjacent_nodes,
		        cost_of_e,
		        cost_of_s_to_u_plus_cost_of_e,
		        cost_of_s_to_v,
		        first_visit;
		    while (!open.empty()) {
		      // In the nodes remaining in graph that have a known cost from s,
		      // find the node, u, that currently has the shortest path from s.
		      closest = open.pop();
		      u = closest.value;
		      cost_of_s_to_u = closest.cost;

		      // Get nodes adjacent to u...
		      adjacent_nodes = graph[u] || {};

		      // ...and explore the edges that connect u to those nodes, updating
		      // the cost of the shortest paths to any or all of those nodes as
		      // necessary. v is the node across the current edge from u.
		      for (v in adjacent_nodes) {
		        if (adjacent_nodes.hasOwnProperty(v)) {
		          // Get the cost of the edge running from u to v.
		          cost_of_e = adjacent_nodes[v];

		          // Cost of s to u plus the cost of u to v across e--this is *a*
		          // cost from s to v that may or may not be less than the current
		          // known cost to v.
		          cost_of_s_to_u_plus_cost_of_e = cost_of_s_to_u + cost_of_e;

		          // If we haven't visited v yet OR if the current known cost from s to
		          // v is greater than the new cost we just found (cost of s to u plus
		          // cost of u to v across e), update v's cost in the cost list and
		          // update v's predecessor in the predecessor list (it's now u).
		          cost_of_s_to_v = costs[v];
		          first_visit = (typeof costs[v] === 'undefined');
		          if (first_visit || cost_of_s_to_v > cost_of_s_to_u_plus_cost_of_e) {
		            costs[v] = cost_of_s_to_u_plus_cost_of_e;
		            open.push(v, cost_of_s_to_u_plus_cost_of_e);
		            predecessors[v] = u;
		          }
		        }
		      }
		    }

		    if (typeof d !== 'undefined' && typeof costs[d] === 'undefined') {
		      var msg = ['Could not find a path from ', s, ' to ', d, '.'].join('');
		      throw new Error(msg);
		    }

		    return predecessors;
		  },

		  extract_shortest_path_from_predecessor_list: function(predecessors, d) {
		    var nodes = [];
		    var u = d;
		    while (u) {
		      nodes.push(u);
		      predecessors[u];
		      u = predecessors[u];
		    }
		    nodes.reverse();
		    return nodes;
		  },

		  find_path: function(graph, s, d) {
		    var predecessors = dijkstra.single_source_shortest_paths(graph, s, d);
		    return dijkstra.extract_shortest_path_from_predecessor_list(
		      predecessors, d);
		  },

		  /**
		   * A very naive priority queue implementation.
		   */
		  PriorityQueue: {
		    make: function (opts) {
		      var T = dijkstra.PriorityQueue,
		          t = {},
		          key;
		      opts = opts || {};
		      for (key in T) {
		        if (T.hasOwnProperty(key)) {
		          t[key] = T[key];
		        }
		      }
		      t.queue = [];
		      t.sorter = opts.sorter || T.default_sorter;
		      return t;
		    },

		    default_sorter: function (a, b) {
		      return a.cost - b.cost;
		    },

		    /**
		     * Add a new item to the queue and ensure the highest priority element
		     * is at the front of the queue.
		     */
		    push: function (value, cost) {
		      var item = {value: value, cost: cost};
		      this.queue.push(item);
		      this.queue.sort(this.sorter);
		    },

		    /**
		     * Return the highest priority element in the queue.
		     */
		    pop: function () {
		      return this.queue.shift();
		    },

		    empty: function () {
		      return this.queue.length === 0;
		    }
		  }
		};


		// node.js module exports
		{
		  module.exports = dijkstra;
		} 
	} (dijkstra));
	return dijkstra.exports;
}

var hasRequiredSegments;

function requireSegments () {
	if (hasRequiredSegments) return segments;
	hasRequiredSegments = 1;
	(function (exports) {
		const Mode = requireMode();
		const NumericData = requireNumericData();
		const AlphanumericData = requireAlphanumericData();
		const ByteData = requireByteData();
		const KanjiData = requireKanjiData();
		const Regex = requireRegex();
		const Utils = requireUtils$1();
		const dijkstra = requireDijkstra();

		/**
		 * Returns UTF8 byte length
		 *
		 * @param  {String} str Input string
		 * @return {Number}     Number of byte
		 */
		function getStringByteLength (str) {
		  return unescape(encodeURIComponent(str)).length
		}

		/**
		 * Get a list of segments of the specified mode
		 * from a string
		 *
		 * @param  {Mode}   mode Segment mode
		 * @param  {String} str  String to process
		 * @return {Array}       Array of object with segments data
		 */
		function getSegments (regex, mode, str) {
		  const segments = [];
		  let result;

		  while ((result = regex.exec(str)) !== null) {
		    segments.push({
		      data: result[0],
		      index: result.index,
		      mode: mode,
		      length: result[0].length
		    });
		  }

		  return segments
		}

		/**
		 * Extracts a series of segments with the appropriate
		 * modes from a string
		 *
		 * @param  {String} dataStr Input string
		 * @return {Array}          Array of object with segments data
		 */
		function getSegmentsFromString (dataStr) {
		  const numSegs = getSegments(Regex.NUMERIC, Mode.NUMERIC, dataStr);
		  const alphaNumSegs = getSegments(Regex.ALPHANUMERIC, Mode.ALPHANUMERIC, dataStr);
		  let byteSegs;
		  let kanjiSegs;

		  if (Utils.isKanjiModeEnabled()) {
		    byteSegs = getSegments(Regex.BYTE, Mode.BYTE, dataStr);
		    kanjiSegs = getSegments(Regex.KANJI, Mode.KANJI, dataStr);
		  } else {
		    byteSegs = getSegments(Regex.BYTE_KANJI, Mode.BYTE, dataStr);
		    kanjiSegs = [];
		  }

		  const segs = numSegs.concat(alphaNumSegs, byteSegs, kanjiSegs);

		  return segs
		    .sort(function (s1, s2) {
		      return s1.index - s2.index
		    })
		    .map(function (obj) {
		      return {
		        data: obj.data,
		        mode: obj.mode,
		        length: obj.length
		      }
		    })
		}

		/**
		 * Returns how many bits are needed to encode a string of
		 * specified length with the specified mode
		 *
		 * @param  {Number} length String length
		 * @param  {Mode} mode     Segment mode
		 * @return {Number}        Bit length
		 */
		function getSegmentBitsLength (length, mode) {
		  switch (mode) {
		    case Mode.NUMERIC:
		      return NumericData.getBitsLength(length)
		    case Mode.ALPHANUMERIC:
		      return AlphanumericData.getBitsLength(length)
		    case Mode.KANJI:
		      return KanjiData.getBitsLength(length)
		    case Mode.BYTE:
		      return ByteData.getBitsLength(length)
		  }
		}

		/**
		 * Merges adjacent segments which have the same mode
		 *
		 * @param  {Array} segs Array of object with segments data
		 * @return {Array}      Array of object with segments data
		 */
		function mergeSegments (segs) {
		  return segs.reduce(function (acc, curr) {
		    const prevSeg = acc.length - 1 >= 0 ? acc[acc.length - 1] : null;
		    if (prevSeg && prevSeg.mode === curr.mode) {
		      acc[acc.length - 1].data += curr.data;
		      return acc
		    }

		    acc.push(curr);
		    return acc
		  }, [])
		}

		/**
		 * Generates a list of all possible nodes combination which
		 * will be used to build a segments graph.
		 *
		 * Nodes are divided by groups. Each group will contain a list of all the modes
		 * in which is possible to encode the given text.
		 *
		 * For example the text '12345' can be encoded as Numeric, Alphanumeric or Byte.
		 * The group for '12345' will contain then 3 objects, one for each
		 * possible encoding mode.
		 *
		 * Each node represents a possible segment.
		 *
		 * @param  {Array} segs Array of object with segments data
		 * @return {Array}      Array of object with segments data
		 */
		function buildNodes (segs) {
		  const nodes = [];
		  for (let i = 0; i < segs.length; i++) {
		    const seg = segs[i];

		    switch (seg.mode) {
		      case Mode.NUMERIC:
		        nodes.push([seg,
		          { data: seg.data, mode: Mode.ALPHANUMERIC, length: seg.length },
		          { data: seg.data, mode: Mode.BYTE, length: seg.length }
		        ]);
		        break
		      case Mode.ALPHANUMERIC:
		        nodes.push([seg,
		          { data: seg.data, mode: Mode.BYTE, length: seg.length }
		        ]);
		        break
		      case Mode.KANJI:
		        nodes.push([seg,
		          { data: seg.data, mode: Mode.BYTE, length: getStringByteLength(seg.data) }
		        ]);
		        break
		      case Mode.BYTE:
		        nodes.push([
		          { data: seg.data, mode: Mode.BYTE, length: getStringByteLength(seg.data) }
		        ]);
		    }
		  }

		  return nodes
		}

		/**
		 * Builds a graph from a list of nodes.
		 * All segments in each node group will be connected with all the segments of
		 * the next group and so on.
		 *
		 * At each connection will be assigned a weight depending on the
		 * segment's byte length.
		 *
		 * @param  {Array} nodes    Array of object with segments data
		 * @param  {Number} version QR Code version
		 * @return {Object}         Graph of all possible segments
		 */
		function buildGraph (nodes, version) {
		  const table = {};
		  const graph = { start: {} };
		  let prevNodeIds = ['start'];

		  for (let i = 0; i < nodes.length; i++) {
		    const nodeGroup = nodes[i];
		    const currentNodeIds = [];

		    for (let j = 0; j < nodeGroup.length; j++) {
		      const node = nodeGroup[j];
		      const key = '' + i + j;

		      currentNodeIds.push(key);
		      table[key] = { node: node, lastCount: 0 };
		      graph[key] = {};

		      for (let n = 0; n < prevNodeIds.length; n++) {
		        const prevNodeId = prevNodeIds[n];

		        if (table[prevNodeId] && table[prevNodeId].node.mode === node.mode) {
		          graph[prevNodeId][key] =
		            getSegmentBitsLength(table[prevNodeId].lastCount + node.length, node.mode) -
		            getSegmentBitsLength(table[prevNodeId].lastCount, node.mode);

		          table[prevNodeId].lastCount += node.length;
		        } else {
		          if (table[prevNodeId]) table[prevNodeId].lastCount = node.length;

		          graph[prevNodeId][key] = getSegmentBitsLength(node.length, node.mode) +
		            4 + Mode.getCharCountIndicator(node.mode, version); // switch cost
		        }
		      }
		    }

		    prevNodeIds = currentNodeIds;
		  }

		  for (let n = 0; n < prevNodeIds.length; n++) {
		    graph[prevNodeIds[n]].end = 0;
		  }

		  return { map: graph, table: table }
		}

		/**
		 * Builds a segment from a specified data and mode.
		 * If a mode is not specified, the more suitable will be used.
		 *
		 * @param  {String} data             Input data
		 * @param  {Mode | String} modesHint Data mode
		 * @return {Segment}                 Segment
		 */
		function buildSingleSegment (data, modesHint) {
		  let mode;
		  const bestMode = Mode.getBestModeForData(data);

		  mode = Mode.from(modesHint, bestMode);

		  // Make sure data can be encoded
		  if (mode !== Mode.BYTE && mode.bit < bestMode.bit) {
		    throw new Error('"' + data + '"' +
		      ' cannot be encoded with mode ' + Mode.toString(mode) +
		      '.\n Suggested mode is: ' + Mode.toString(bestMode))
		  }

		  // Use Mode.BYTE if Kanji support is disabled
		  if (mode === Mode.KANJI && !Utils.isKanjiModeEnabled()) {
		    mode = Mode.BYTE;
		  }

		  switch (mode) {
		    case Mode.NUMERIC:
		      return new NumericData(data)

		    case Mode.ALPHANUMERIC:
		      return new AlphanumericData(data)

		    case Mode.KANJI:
		      return new KanjiData(data)

		    case Mode.BYTE:
		      return new ByteData(data)
		  }
		}

		/**
		 * Builds a list of segments from an array.
		 * Array can contain Strings or Objects with segment's info.
		 *
		 * For each item which is a string, will be generated a segment with the given
		 * string and the more appropriate encoding mode.
		 *
		 * For each item which is an object, will be generated a segment with the given
		 * data and mode.
		 * Objects must contain at least the property "data".
		 * If property "mode" is not present, the more suitable mode will be used.
		 *
		 * @param  {Array} array Array of objects with segments data
		 * @return {Array}       Array of Segments
		 */
		exports.fromArray = function fromArray (array) {
		  return array.reduce(function (acc, seg) {
		    if (typeof seg === 'string') {
		      acc.push(buildSingleSegment(seg, null));
		    } else if (seg.data) {
		      acc.push(buildSingleSegment(seg.data, seg.mode));
		    }

		    return acc
		  }, [])
		};

		/**
		 * Builds an optimized sequence of segments from a string,
		 * which will produce the shortest possible bitstream.
		 *
		 * @param  {String} data    Input string
		 * @param  {Number} version QR Code version
		 * @return {Array}          Array of segments
		 */
		exports.fromString = function fromString (data, version) {
		  const segs = getSegmentsFromString(data, Utils.isKanjiModeEnabled());

		  const nodes = buildNodes(segs);
		  const graph = buildGraph(nodes, version);
		  const path = dijkstra.find_path(graph.map, 'start', 'end');

		  const optimizedSegs = [];
		  for (let i = 1; i < path.length - 1; i++) {
		    optimizedSegs.push(graph.table[path[i]].node);
		  }

		  return exports.fromArray(mergeSegments(optimizedSegs))
		};

		/**
		 * Splits a string in various segments with the modes which
		 * best represent their content.
		 * The produced segments are far from being optimized.
		 * The output of this function is only used to estimate a QR Code version
		 * which may contain the data.
		 *
		 * @param  {string} data Input string
		 * @return {Array}       Array of segments
		 */
		exports.rawSplit = function rawSplit (data) {
		  return exports.fromArray(
		    getSegmentsFromString(data, Utils.isKanjiModeEnabled())
		  )
		}; 
	} (segments));
	return segments;
}

var hasRequiredQrcode;

function requireQrcode () {
	if (hasRequiredQrcode) return qrcode;
	hasRequiredQrcode = 1;
	const Utils = requireUtils$1();
	const ECLevel = requireErrorCorrectionLevel();
	const BitBuffer = requireBitBuffer();
	const BitMatrix = requireBitMatrix();
	const AlignmentPattern = requireAlignmentPattern();
	const FinderPattern = requireFinderPattern();
	const MaskPattern = requireMaskPattern();
	const ECCode = requireErrorCorrectionCode();
	const ReedSolomonEncoder = requireReedSolomonEncoder();
	const Version = requireVersion();
	const FormatInfo = requireFormatInfo();
	const Mode = requireMode();
	const Segments = requireSegments();

	/**
	 * QRCode for JavaScript
	 *
	 * modified by Ryan Day for nodejs support
	 * Copyright (c) 2011 Ryan Day
	 *
	 * Licensed under the MIT license:
	 *   http://www.opensource.org/licenses/mit-license.php
	 *
	//---------------------------------------------------------------------
	// QRCode for JavaScript
	//
	// Copyright (c) 2009 Kazuhiko Arase
	//
	// URL: http://www.d-project.com/
	//
	// Licensed under the MIT license:
	//   http://www.opensource.org/licenses/mit-license.php
	//
	// The word "QR Code" is registered trademark of
	// DENSO WAVE INCORPORATED
	//   http://www.denso-wave.com/qrcode/faqpatent-e.html
	//
	//---------------------------------------------------------------------
	*/

	/**
	 * Add finder patterns bits to matrix
	 *
	 * @param  {BitMatrix} matrix  Modules matrix
	 * @param  {Number}    version QR Code version
	 */
	function setupFinderPattern (matrix, version) {
	  const size = matrix.size;
	  const pos = FinderPattern.getPositions(version);

	  for (let i = 0; i < pos.length; i++) {
	    const row = pos[i][0];
	    const col = pos[i][1];

	    for (let r = -1; r <= 7; r++) {
	      if (row + r <= -1 || size <= row + r) continue

	      for (let c = -1; c <= 7; c++) {
	        if (col + c <= -1 || size <= col + c) continue

	        if ((r >= 0 && r <= 6 && (c === 0 || c === 6)) ||
	          (c >= 0 && c <= 6 && (r === 0 || r === 6)) ||
	          (r >= 2 && r <= 4 && c >= 2 && c <= 4)) {
	          matrix.set(row + r, col + c, true, true);
	        } else {
	          matrix.set(row + r, col + c, false, true);
	        }
	      }
	    }
	  }
	}

	/**
	 * Add timing pattern bits to matrix
	 *
	 * Note: this function must be called before {@link setupAlignmentPattern}
	 *
	 * @param  {BitMatrix} matrix Modules matrix
	 */
	function setupTimingPattern (matrix) {
	  const size = matrix.size;

	  for (let r = 8; r < size - 8; r++) {
	    const value = r % 2 === 0;
	    matrix.set(r, 6, value, true);
	    matrix.set(6, r, value, true);
	  }
	}

	/**
	 * Add alignment patterns bits to matrix
	 *
	 * Note: this function must be called after {@link setupTimingPattern}
	 *
	 * @param  {BitMatrix} matrix  Modules matrix
	 * @param  {Number}    version QR Code version
	 */
	function setupAlignmentPattern (matrix, version) {
	  const pos = AlignmentPattern.getPositions(version);

	  for (let i = 0; i < pos.length; i++) {
	    const row = pos[i][0];
	    const col = pos[i][1];

	    for (let r = -2; r <= 2; r++) {
	      for (let c = -2; c <= 2; c++) {
	        if (r === -2 || r === 2 || c === -2 || c === 2 ||
	          (r === 0 && c === 0)) {
	          matrix.set(row + r, col + c, true, true);
	        } else {
	          matrix.set(row + r, col + c, false, true);
	        }
	      }
	    }
	  }
	}

	/**
	 * Add version info bits to matrix
	 *
	 * @param  {BitMatrix} matrix  Modules matrix
	 * @param  {Number}    version QR Code version
	 */
	function setupVersionInfo (matrix, version) {
	  const size = matrix.size;
	  const bits = Version.getEncodedBits(version);
	  let row, col, mod;

	  for (let i = 0; i < 18; i++) {
	    row = Math.floor(i / 3);
	    col = i % 3 + size - 8 - 3;
	    mod = ((bits >> i) & 1) === 1;

	    matrix.set(row, col, mod, true);
	    matrix.set(col, row, mod, true);
	  }
	}

	/**
	 * Add format info bits to matrix
	 *
	 * @param  {BitMatrix} matrix               Modules matrix
	 * @param  {ErrorCorrectionLevel}    errorCorrectionLevel Error correction level
	 * @param  {Number}    maskPattern          Mask pattern reference value
	 */
	function setupFormatInfo (matrix, errorCorrectionLevel, maskPattern) {
	  const size = matrix.size;
	  const bits = FormatInfo.getEncodedBits(errorCorrectionLevel, maskPattern);
	  let i, mod;

	  for (i = 0; i < 15; i++) {
	    mod = ((bits >> i) & 1) === 1;

	    // vertical
	    if (i < 6) {
	      matrix.set(i, 8, mod, true);
	    } else if (i < 8) {
	      matrix.set(i + 1, 8, mod, true);
	    } else {
	      matrix.set(size - 15 + i, 8, mod, true);
	    }

	    // horizontal
	    if (i < 8) {
	      matrix.set(8, size - i - 1, mod, true);
	    } else if (i < 9) {
	      matrix.set(8, 15 - i - 1 + 1, mod, true);
	    } else {
	      matrix.set(8, 15 - i - 1, mod, true);
	    }
	  }

	  // fixed module
	  matrix.set(size - 8, 8, 1, true);
	}

	/**
	 * Add encoded data bits to matrix
	 *
	 * @param  {BitMatrix}  matrix Modules matrix
	 * @param  {Uint8Array} data   Data codewords
	 */
	function setupData (matrix, data) {
	  const size = matrix.size;
	  let inc = -1;
	  let row = size - 1;
	  let bitIndex = 7;
	  let byteIndex = 0;

	  for (let col = size - 1; col > 0; col -= 2) {
	    if (col === 6) col--;

	    while (true) {
	      for (let c = 0; c < 2; c++) {
	        if (!matrix.isReserved(row, col - c)) {
	          let dark = false;

	          if (byteIndex < data.length) {
	            dark = (((data[byteIndex] >>> bitIndex) & 1) === 1);
	          }

	          matrix.set(row, col - c, dark);
	          bitIndex--;

	          if (bitIndex === -1) {
	            byteIndex++;
	            bitIndex = 7;
	          }
	        }
	      }

	      row += inc;

	      if (row < 0 || size <= row) {
	        row -= inc;
	        inc = -inc;
	        break
	      }
	    }
	  }
	}

	/**
	 * Create encoded codewords from data input
	 *
	 * @param  {Number}   version              QR Code version
	 * @param  {ErrorCorrectionLevel}   errorCorrectionLevel Error correction level
	 * @param  {ByteData} data                 Data input
	 * @return {Uint8Array}                    Buffer containing encoded codewords
	 */
	function createData (version, errorCorrectionLevel, segments) {
	  // Prepare data buffer
	  const buffer = new BitBuffer();

	  segments.forEach(function (data) {
	    // prefix data with mode indicator (4 bits)
	    buffer.put(data.mode.bit, 4);

	    // Prefix data with character count indicator.
	    // The character count indicator is a string of bits that represents the
	    // number of characters that are being encoded.
	    // The character count indicator must be placed after the mode indicator
	    // and must be a certain number of bits long, depending on the QR version
	    // and data mode
	    // @see {@link Mode.getCharCountIndicator}.
	    buffer.put(data.getLength(), Mode.getCharCountIndicator(data.mode, version));

	    // add binary data sequence to buffer
	    data.write(buffer);
	  });

	  // Calculate required number of bits
	  const totalCodewords = Utils.getSymbolTotalCodewords(version);
	  const ecTotalCodewords = ECCode.getTotalCodewordsCount(version, errorCorrectionLevel);
	  const dataTotalCodewordsBits = (totalCodewords - ecTotalCodewords) * 8;

	  // Add a terminator.
	  // If the bit string is shorter than the total number of required bits,
	  // a terminator of up to four 0s must be added to the right side of the string.
	  // If the bit string is more than four bits shorter than the required number of bits,
	  // add four 0s to the end.
	  if (buffer.getLengthInBits() + 4 <= dataTotalCodewordsBits) {
	    buffer.put(0, 4);
	  }

	  // If the bit string is fewer than four bits shorter, add only the number of 0s that
	  // are needed to reach the required number of bits.

	  // After adding the terminator, if the number of bits in the string is not a multiple of 8,
	  // pad the string on the right with 0s to make the string's length a multiple of 8.
	  while (buffer.getLengthInBits() % 8 !== 0) {
	    buffer.putBit(0);
	  }

	  // Add pad bytes if the string is still shorter than the total number of required bits.
	  // Extend the buffer to fill the data capacity of the symbol corresponding to
	  // the Version and Error Correction Level by adding the Pad Codewords 11101100 (0xEC)
	  // and 00010001 (0x11) alternately.
	  const remainingByte = (dataTotalCodewordsBits - buffer.getLengthInBits()) / 8;
	  for (let i = 0; i < remainingByte; i++) {
	    buffer.put(i % 2 ? 0x11 : 0xEC, 8);
	  }

	  return createCodewords(buffer, version, errorCorrectionLevel)
	}

	/**
	 * Encode input data with Reed-Solomon and return codewords with
	 * relative error correction bits
	 *
	 * @param  {BitBuffer} bitBuffer            Data to encode
	 * @param  {Number}    version              QR Code version
	 * @param  {ErrorCorrectionLevel} errorCorrectionLevel Error correction level
	 * @return {Uint8Array}                     Buffer containing encoded codewords
	 */
	function createCodewords (bitBuffer, version, errorCorrectionLevel) {
	  // Total codewords for this QR code version (Data + Error correction)
	  const totalCodewords = Utils.getSymbolTotalCodewords(version);

	  // Total number of error correction codewords
	  const ecTotalCodewords = ECCode.getTotalCodewordsCount(version, errorCorrectionLevel);

	  // Total number of data codewords
	  const dataTotalCodewords = totalCodewords - ecTotalCodewords;

	  // Total number of blocks
	  const ecTotalBlocks = ECCode.getBlocksCount(version, errorCorrectionLevel);

	  // Calculate how many blocks each group should contain
	  const blocksInGroup2 = totalCodewords % ecTotalBlocks;
	  const blocksInGroup1 = ecTotalBlocks - blocksInGroup2;

	  const totalCodewordsInGroup1 = Math.floor(totalCodewords / ecTotalBlocks);

	  const dataCodewordsInGroup1 = Math.floor(dataTotalCodewords / ecTotalBlocks);
	  const dataCodewordsInGroup2 = dataCodewordsInGroup1 + 1;

	  // Number of EC codewords is the same for both groups
	  const ecCount = totalCodewordsInGroup1 - dataCodewordsInGroup1;

	  // Initialize a Reed-Solomon encoder with a generator polynomial of degree ecCount
	  const rs = new ReedSolomonEncoder(ecCount);

	  let offset = 0;
	  const dcData = new Array(ecTotalBlocks);
	  const ecData = new Array(ecTotalBlocks);
	  let maxDataSize = 0;
	  const buffer = new Uint8Array(bitBuffer.buffer);

	  // Divide the buffer into the required number of blocks
	  for (let b = 0; b < ecTotalBlocks; b++) {
	    const dataSize = b < blocksInGroup1 ? dataCodewordsInGroup1 : dataCodewordsInGroup2;

	    // extract a block of data from buffer
	    dcData[b] = buffer.slice(offset, offset + dataSize);

	    // Calculate EC codewords for this data block
	    ecData[b] = rs.encode(dcData[b]);

	    offset += dataSize;
	    maxDataSize = Math.max(maxDataSize, dataSize);
	  }

	  // Create final data
	  // Interleave the data and error correction codewords from each block
	  const data = new Uint8Array(totalCodewords);
	  let index = 0;
	  let i, r;

	  // Add data codewords
	  for (i = 0; i < maxDataSize; i++) {
	    for (r = 0; r < ecTotalBlocks; r++) {
	      if (i < dcData[r].length) {
	        data[index++] = dcData[r][i];
	      }
	    }
	  }

	  // Apped EC codewords
	  for (i = 0; i < ecCount; i++) {
	    for (r = 0; r < ecTotalBlocks; r++) {
	      data[index++] = ecData[r][i];
	    }
	  }

	  return data
	}

	/**
	 * Build QR Code symbol
	 *
	 * @param  {String} data                 Input string
	 * @param  {Number} version              QR Code version
	 * @param  {ErrorCorretionLevel} errorCorrectionLevel Error level
	 * @param  {MaskPattern} maskPattern     Mask pattern
	 * @return {Object}                      Object containing symbol data
	 */
	function createSymbol (data, version, errorCorrectionLevel, maskPattern) {
	  let segments;

	  if (Array.isArray(data)) {
	    segments = Segments.fromArray(data);
	  } else if (typeof data === 'string') {
	    let estimatedVersion = version;

	    if (!estimatedVersion) {
	      const rawSegments = Segments.rawSplit(data);

	      // Estimate best version that can contain raw splitted segments
	      estimatedVersion = Version.getBestVersionForData(rawSegments, errorCorrectionLevel);
	    }

	    // Build optimized segments
	    // If estimated version is undefined, try with the highest version
	    segments = Segments.fromString(data, estimatedVersion || 40);
	  } else {
	    throw new Error('Invalid data')
	  }

	  // Get the min version that can contain data
	  const bestVersion = Version.getBestVersionForData(segments, errorCorrectionLevel);

	  // If no version is found, data cannot be stored
	  if (!bestVersion) {
	    throw new Error('The amount of data is too big to be stored in a QR Code')
	  }

	  // If not specified, use min version as default
	  if (!version) {
	    version = bestVersion;

	  // Check if the specified version can contain the data
	  } else if (version < bestVersion) {
	    throw new Error('\n' +
	      'The chosen QR Code version cannot contain this amount of data.\n' +
	      'Minimum version required to store current data is: ' + bestVersion + '.\n'
	    )
	  }

	  const dataBits = createData(version, errorCorrectionLevel, segments);

	  // Allocate matrix buffer
	  const moduleCount = Utils.getSymbolSize(version);
	  const modules = new BitMatrix(moduleCount);

	  // Add function modules
	  setupFinderPattern(modules, version);
	  setupTimingPattern(modules);
	  setupAlignmentPattern(modules, version);

	  // Add temporary dummy bits for format info just to set them as reserved.
	  // This is needed to prevent these bits from being masked by {@link MaskPattern.applyMask}
	  // since the masking operation must be performed only on the encoding region.
	  // These blocks will be replaced with correct values later in code.
	  setupFormatInfo(modules, errorCorrectionLevel, 0);

	  if (version >= 7) {
	    setupVersionInfo(modules, version);
	  }

	  // Add data codewords
	  setupData(modules, dataBits);

	  if (isNaN(maskPattern)) {
	    // Find best mask pattern
	    maskPattern = MaskPattern.getBestMask(modules,
	      setupFormatInfo.bind(null, modules, errorCorrectionLevel));
	  }

	  // Apply mask pattern
	  MaskPattern.applyMask(maskPattern, modules);

	  // Replace format info bits with correct values
	  setupFormatInfo(modules, errorCorrectionLevel, maskPattern);

	  return {
	    modules: modules,
	    version: version,
	    errorCorrectionLevel: errorCorrectionLevel,
	    maskPattern: maskPattern,
	    segments: segments
	  }
	}

	/**
	 * QR Code
	 *
	 * @param {String | Array} data                 Input data
	 * @param {Object} options                      Optional configurations
	 * @param {Number} options.version              QR Code version
	 * @param {String} options.errorCorrectionLevel Error correction level
	 * @param {Function} options.toSJISFunc         Helper func to convert utf8 to sjis
	 */
	qrcode.create = function create (data, options) {
	  if (typeof data === 'undefined' || data === '') {
	    throw new Error('No input text')
	  }

	  let errorCorrectionLevel = ECLevel.M;
	  let version;
	  let mask;

	  if (typeof options !== 'undefined') {
	    // Use higher error correction level as default
	    errorCorrectionLevel = ECLevel.from(options.errorCorrectionLevel, ECLevel.M);
	    version = Version.from(options.version);
	    mask = MaskPattern.from(options.maskPattern);

	    if (options.toSJISFunc) {
	      Utils.setToSJISFunction(options.toSJISFunc);
	    }
	  }

	  return createSymbol(data, version, errorCorrectionLevel, mask)
	};
	return qrcode;
}

var canvas$1 = {};

var utils = {};

var hasRequiredUtils;

function requireUtils () {
	if (hasRequiredUtils) return utils;
	hasRequiredUtils = 1;
	(function (exports) {
		function hex2rgba (hex) {
		  if (typeof hex === 'number') {
		    hex = hex.toString();
		  }

		  if (typeof hex !== 'string') {
		    throw new Error('Color should be defined as hex string')
		  }

		  let hexCode = hex.slice().replace('#', '').split('');
		  if (hexCode.length < 3 || hexCode.length === 5 || hexCode.length > 8) {
		    throw new Error('Invalid hex color: ' + hex)
		  }

		  // Convert from short to long form (fff -> ffffff)
		  if (hexCode.length === 3 || hexCode.length === 4) {
		    hexCode = Array.prototype.concat.apply([], hexCode.map(function (c) {
		      return [c, c]
		    }));
		  }

		  // Add default alpha value
		  if (hexCode.length === 6) hexCode.push('F', 'F');

		  const hexValue = parseInt(hexCode.join(''), 16);

		  return {
		    r: (hexValue >> 24) & 255,
		    g: (hexValue >> 16) & 255,
		    b: (hexValue >> 8) & 255,
		    a: hexValue & 255,
		    hex: '#' + hexCode.slice(0, 6).join('')
		  }
		}

		exports.getOptions = function getOptions (options) {
		  if (!options) options = {};
		  if (!options.color) options.color = {};

		  const margin = typeof options.margin === 'undefined' ||
		    options.margin === null ||
		    options.margin < 0
		    ? 4
		    : options.margin;

		  const width = options.width && options.width >= 21 ? options.width : undefined;
		  const scale = options.scale || 4;

		  return {
		    width: width,
		    scale: width ? 4 : scale,
		    margin: margin,
		    color: {
		      dark: hex2rgba(options.color.dark || '#000000ff'),
		      light: hex2rgba(options.color.light || '#ffffffff')
		    },
		    type: options.type,
		    rendererOpts: options.rendererOpts || {}
		  }
		};

		exports.getScale = function getScale (qrSize, opts) {
		  return opts.width && opts.width >= qrSize + opts.margin * 2
		    ? opts.width / (qrSize + opts.margin * 2)
		    : opts.scale
		};

		exports.getImageWidth = function getImageWidth (qrSize, opts) {
		  const scale = exports.getScale(qrSize, opts);
		  return Math.floor((qrSize + opts.margin * 2) * scale)
		};

		exports.qrToImageData = function qrToImageData (imgData, qr, opts) {
		  const size = qr.modules.size;
		  const data = qr.modules.data;
		  const scale = exports.getScale(size, opts);
		  const symbolSize = Math.floor((size + opts.margin * 2) * scale);
		  const scaledMargin = opts.margin * scale;
		  const palette = [opts.color.light, opts.color.dark];

		  for (let i = 0; i < symbolSize; i++) {
		    for (let j = 0; j < symbolSize; j++) {
		      let posDst = (i * symbolSize + j) * 4;
		      let pxColor = opts.color.light;

		      if (i >= scaledMargin && j >= scaledMargin &&
		        i < symbolSize - scaledMargin && j < symbolSize - scaledMargin) {
		        const iSrc = Math.floor((i - scaledMargin) / scale);
		        const jSrc = Math.floor((j - scaledMargin) / scale);
		        pxColor = palette[data[iSrc * size + jSrc] ? 1 : 0];
		      }

		      imgData[posDst++] = pxColor.r;
		      imgData[posDst++] = pxColor.g;
		      imgData[posDst++] = pxColor.b;
		      imgData[posDst] = pxColor.a;
		    }
		  }
		}; 
	} (utils));
	return utils;
}

var hasRequiredCanvas;

function requireCanvas () {
	if (hasRequiredCanvas) return canvas$1;
	hasRequiredCanvas = 1;
	(function (exports) {
		const Utils = requireUtils();

		function clearCanvas (ctx, canvas, size) {
		  ctx.clearRect(0, 0, canvas.width, canvas.height);

		  if (!canvas.style) canvas.style = {};
		  canvas.height = size;
		  canvas.width = size;
		  canvas.style.height = size + 'px';
		  canvas.style.width = size + 'px';
		}

		function getCanvasElement () {
		  try {
		    return document.createElement('canvas')
		  } catch (e) {
		    throw new Error('You need to specify a canvas element')
		  }
		}

		exports.render = function render (qrData, canvas, options) {
		  let opts = options;
		  let canvasEl = canvas;

		  if (typeof opts === 'undefined' && (!canvas || !canvas.getContext)) {
		    opts = canvas;
		    canvas = undefined;
		  }

		  if (!canvas) {
		    canvasEl = getCanvasElement();
		  }

		  opts = Utils.getOptions(opts);
		  const size = Utils.getImageWidth(qrData.modules.size, opts);

		  const ctx = canvasEl.getContext('2d');
		  const image = ctx.createImageData(size, size);
		  Utils.qrToImageData(image.data, qrData, opts);

		  clearCanvas(ctx, canvasEl, size);
		  ctx.putImageData(image, 0, 0);

		  return canvasEl
		};

		exports.renderToDataURL = function renderToDataURL (qrData, canvas, options) {
		  let opts = options;

		  if (typeof opts === 'undefined' && (!canvas || !canvas.getContext)) {
		    opts = canvas;
		    canvas = undefined;
		  }

		  if (!opts) opts = {};

		  const canvasEl = exports.render(qrData, canvas, opts);

		  const type = opts.type || 'image/png';
		  const rendererOpts = opts.rendererOpts || {};

		  return canvasEl.toDataURL(type, rendererOpts.quality)
		}; 
	} (canvas$1));
	return canvas$1;
}

var svgTag = {};

var hasRequiredSvgTag;

function requireSvgTag () {
	if (hasRequiredSvgTag) return svgTag;
	hasRequiredSvgTag = 1;
	const Utils = requireUtils();

	function getColorAttrib (color, attrib) {
	  const alpha = color.a / 255;
	  const str = attrib + '="' + color.hex + '"';

	  return alpha < 1
	    ? str + ' ' + attrib + '-opacity="' + alpha.toFixed(2).slice(1) + '"'
	    : str
	}

	function svgCmd (cmd, x, y) {
	  let str = cmd + x;
	  if (typeof y !== 'undefined') str += ' ' + y;

	  return str
	}

	function qrToPath (data, size, margin) {
	  let path = '';
	  let moveBy = 0;
	  let newRow = false;
	  let lineLength = 0;

	  for (let i = 0; i < data.length; i++) {
	    const col = Math.floor(i % size);
	    const row = Math.floor(i / size);

	    if (!col && !newRow) newRow = true;

	    if (data[i]) {
	      lineLength++;

	      if (!(i > 0 && col > 0 && data[i - 1])) {
	        path += newRow
	          ? svgCmd('M', col + margin, 0.5 + row + margin)
	          : svgCmd('m', moveBy, 0);

	        moveBy = 0;
	        newRow = false;
	      }

	      if (!(col + 1 < size && data[i + 1])) {
	        path += svgCmd('h', lineLength);
	        lineLength = 0;
	      }
	    } else {
	      moveBy++;
	    }
	  }

	  return path
	}

	svgTag.render = function render (qrData, options, cb) {
	  const opts = Utils.getOptions(options);
	  const size = qrData.modules.size;
	  const data = qrData.modules.data;
	  const qrcodesize = size + opts.margin * 2;

	  const bg = !opts.color.light.a
	    ? ''
	    : '<path ' + getColorAttrib(opts.color.light, 'fill') +
	      ' d="M0 0h' + qrcodesize + 'v' + qrcodesize + 'H0z"/>';

	  const path =
	    '<path ' + getColorAttrib(opts.color.dark, 'stroke') +
	    ' d="' + qrToPath(data, size, opts.margin) + '"/>';

	  const viewBox = 'viewBox="' + '0 0 ' + qrcodesize + ' ' + qrcodesize + '"';

	  const width = !opts.width ? '' : 'width="' + opts.width + '" height="' + opts.width + '" ';

	  const svgTag = '<svg xmlns="http://www.w3.org/2000/svg" ' + width + viewBox + ' shape-rendering="crispEdges">' + bg + path + '</svg>\n';

	  if (typeof cb === 'function') {
	    cb(null, svgTag);
	  }

	  return svgTag
	};
	return svgTag;
}

var hasRequiredBrowser;

function requireBrowser () {
	if (hasRequiredBrowser) return browser;
	hasRequiredBrowser = 1;
	const canPromise = requireCanPromise();

	const QRCode = requireQrcode();
	const CanvasRenderer = requireCanvas();
	const SvgRenderer = requireSvgTag();

	function renderCanvas (renderFunc, canvas, text, opts, cb) {
	  const args = [].slice.call(arguments, 1);
	  const argsNum = args.length;
	  const isLastArgCb = typeof args[argsNum - 1] === 'function';

	  if (!isLastArgCb && !canPromise()) {
	    throw new Error('Callback required as last argument')
	  }

	  if (isLastArgCb) {
	    if (argsNum < 2) {
	      throw new Error('Too few arguments provided')
	    }

	    if (argsNum === 2) {
	      cb = text;
	      text = canvas;
	      canvas = opts = undefined;
	    } else if (argsNum === 3) {
	      if (canvas.getContext && typeof cb === 'undefined') {
	        cb = opts;
	        opts = undefined;
	      } else {
	        cb = opts;
	        opts = text;
	        text = canvas;
	        canvas = undefined;
	      }
	    }
	  } else {
	    if (argsNum < 1) {
	      throw new Error('Too few arguments provided')
	    }

	    if (argsNum === 1) {
	      text = canvas;
	      canvas = opts = undefined;
	    } else if (argsNum === 2 && !canvas.getContext) {
	      opts = text;
	      text = canvas;
	      canvas = undefined;
	    }

	    return new Promise(function (resolve, reject) {
	      try {
	        const data = QRCode.create(text, opts);
	        resolve(renderFunc(data, canvas, opts));
	      } catch (e) {
	        reject(e);
	      }
	    })
	  }

	  try {
	    const data = QRCode.create(text, opts);
	    cb(null, renderFunc(data, canvas, opts));
	  } catch (e) {
	    cb(e);
	  }
	}

	browser.create = QRCode.create;
	browser.toCanvas = renderCanvas.bind(null, CanvasRenderer.render);
	browser.toDataURL = renderCanvas.bind(null, CanvasRenderer.renderToDataURL);

	// only svg for now.
	browser.toString = renderCanvas.bind(null, function (data, _, opts) {
	  return SvgRenderer.render(data, opts)
	});
	return browser;
}

var browserExports = requireBrowser();
var QRCode = /*@__PURE__*/getDefaultExportFromCjs(browserExports);

class DiceWebRTCModule extends Application {
    static ID = 'dice-webrtc-module';

    constructor(options = {}) {
        super(options);
        this.peer = null;
        this.activeConnections = new Map();
    }

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            id: this.ID,
            title: 'Dice WebRTC Module',
            template: `modules/${this.ID}/templates/module-config.html`,
            width: 400,
            height: 300,
            resizable: true
        });
    }

    activateListeners(html) {
        super.activateListeners(html);
        html.find('.generate-qr').click(this._onGenerateQR.bind(this));
        html.find('.disconnect-all').click(this._onDisconnectAll.bind(this));
    }

    async _onGenerateQR(event) {
        event.preventDefault();
        if (!game.user.isGM) return;
        await this._initializePeer();
    }

    _onDisconnectAll(event) {
        event.preventDefault();
        if (!game.user.isGM) return;
        this._cleanupConnections();
    }

    async _initializePeer() {
        if (this.peer) this.peer.destroy();
        this.peer = new $416260bce337df90$export$ecd1fc136c422448();

        this.peer.on('open', (id) => {
            console.log('My peer ID is: ' + id);
            this._generateAndDisplayQR(id);
        });

        this.peer.on('connection', this._handleIncomingConnection.bind(this));
    }

    async _generateAndDisplayQR(id) {
        try {
            const url = await QRCode.toDataURL(id);
            const content = `
                <div style="text-align: center;">
                    <h3>Scan to Connect</h3>
                    <img src="${url}" alt="QR Code" style="max-width: 200px;">
                    <p>Peer ID: ${id}</p>
                </div>
            `;
            
            ChatMessage.create({
                content: content,
                whisper: [game.user.id],
                type: CONST.CHAT_MESSAGE_TYPES.OTHER
            });
        } catch (error) {
            console.error('Error generating QR code:', error);
            ui.notifications.error('Failed to generate QR code.');
        }
    }

    _handleIncomingConnection(conn) {
        console.log('Incoming connection from:', conn.peer);

        conn.on('open', () => {
            console.log('Connection established with:', conn.peer);
            this._authenticateConnection(conn);
        });

        conn.on('data', (data) => this._handleIncomingData(conn, data));
        conn.on('close', () => this._handleConnectionClose(conn));
    }

    _authenticateConnection(conn) {
        game.settings.get(DiceWebRTCModule.ID, 'secret');
        conn.send({ type: 'auth', userName: game.user.name });
        
        // Implement your authentication logic here
        // For example, wait for a response with the correct secret
    }

    _handleIncomingData(conn, data) {
        if (!this._validateData(data)) {
            console.error('Invalid data received:', data);
            return;
        }

        switch (data.type) {
            case 'auth':
                this._handleAuthResponse(conn, data);
                break;
            case 'actorUpdate':
                this._handleActorUpdate(data);
                break;
            case 'roll':
                this._handleRollRequest(conn, data);
                break;
            // Add more cases as needed
        }
    }

    _validateData(data) {
        // Implement data validation using foundry.data.validators
        return true; // Placeholder
    }

    _handleAuthResponse(conn, data) {
        // Implement your authentication verification logic
        // If successful:
        this.activeConnections.set(conn.peer, conn);
        this._syncActorData(conn);
    }

    _handleActorUpdate(data) {
        if (!game.user.isGM) return;
        const actor = game.actors.get(data.actorId);
        if (actor && actor.isOwner) {
            actor.update(data.updates);
        }
    }

    async _handleRollRequest(conn, data) {
        const actor = game.actors.get(data.actorId);
        if (!actor || !actor.isOwner) return;

        const rollData = actor.getRollData();
        let roll;

        switch (data.rollType) {
            case 'attack':
            case 'damage':
                if (data.itemId) {
                    const item = actor.items.get(data.itemId);
                    if (!item) return;
                    roll = data.rollType === 'attack' ? await item.rollAttack() : await item.rollDamage();
                }
                break;
            case 'ability':
                roll = await actor.rollAbilityTest(data.abilityId);
                break;
            case 'skill':
                roll = await actor.rollSkill(data.skillId);
                break;
            case 'save':
                roll = await actor.rollAbilitySave(data.abilityId);
                break;
            default:
                if (data.formula) {
                    roll = new Roll(data.formula, rollData);
                    await roll.evaluate({async: true});
                }
        }

        if (roll) {
            await roll.toMessage({
                speaker: ChatMessage.getSpeaker({actor: actor}),
                flavor: data.flavor
            });
        }
    }

    _syncActorData(conn) {
        const ownedActors = game.actors.contents.filter(a => a.isOwner);
        ownedActors.forEach(actor => {
            const data = actor.toObject();
            conn.send({ type: 'actorSync', actorData: data });
        });
    }

    _handleConnectionClose(conn) {
        console.log('Connection closed:', conn.peer);
        this.activeConnections.delete(conn.peer);
    }

    _cleanupConnections() {
        this.activeConnections.forEach(conn => conn.close());
        this.activeConnections.clear();
        if (this.peer) {
            this.peer.destroy();
            this.peer = null;
        }
    }
}

Hooks.once('init', () => {
    game.settings.register(DiceWebRTCModule.ID, 'secret', {
        name: 'Connection Secret',
        hint: 'A shared secret for authenticating peer connections.',
        scope: 'world',
        config: true,
        type: String,
        default: ''
    });

    game.settings.registerMenu(DiceWebRTCModule.ID, 'configMenu', {
        name: 'Dice WebRTC Module Configuration',
        label: 'Configure',
        hint: 'Configure the WebRTC module settings.',
        icon: 'fas fa-cogs',
        type: DiceWebRTCModule,
        restricted: true
    });
});

Hooks.once('ready', () => {
    game.dicewebrtc = new DiceWebRTCModule();
});

Hooks.on('createChatMessage', (message, options, userId) => {
    if (game.user.id !== userId) return;
    
    const messageData = {
        type: 'chatMessage',
        content: message.data.content,
        speaker: message.data.speaker,
        timestamp: message.data.timestamp
    };

    game.dicewebrtc.activeConnections.forEach(conn => {
        if (conn.open) conn.send(messageData);
    });
});

// Use for token updates
const debouncedTokenUpdate = foundry.utils.debounce((tokenId, updates) => {
    const token = canvas.tokens.get(tokenId);
    if (!token || !token.actor || !token.actor.isOwner) return;

    game.dicewebrtc.activeConnections.forEach(conn => {
        if (conn.open) {
            conn.send({
                type: 'tokenUpdate',
                tokenId: tokenId,
                updates: updates
            });
        }
    });
}, 100);

Hooks.on('updateToken', (token, updates) => {
    debouncedTokenUpdate(token.id, updates);
});
//# sourceMappingURL=idx.js.map
