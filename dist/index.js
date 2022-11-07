(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(script) {
    const fetchOpts = {};
    if (script.integrity)
      fetchOpts.integrity = script.integrity;
    if (script.referrerpolicy)
      fetchOpts.referrerPolicy = script.referrerpolicy;
    if (script.crossorigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (script.crossorigin === "anonymous")
      fetchOpts.credentials = "omit";
    else
      fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
function makeMap(str, expectsLowerCase) {
  const map = /* @__PURE__ */ Object.create(null);
  const list = str.split(",");
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase ? (val) => !!map[val.toLowerCase()] : (val) => !!map[val];
}
const specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
const isSpecialBooleanAttr = /* @__PURE__ */ makeMap(specialBooleanAttrs);
function includeBooleanAttr(value) {
  return !!value || value === "";
}
function normalizeStyle(value) {
  if (isArray(value)) {
    const res = {};
    for (let i = 0; i < value.length; i++) {
      const item = value[i];
      const normalized = isString(item) ? parseStringStyle(item) : normalizeStyle(item);
      if (normalized) {
        for (const key in normalized) {
          res[key] = normalized[key];
        }
      }
    }
    return res;
  } else if (isString(value)) {
    return value;
  } else if (isObject(value)) {
    return value;
  }
}
const listDelimiterRE = /;(?![^(]*\))/g;
const propertyDelimiterRE = /:(.+)/;
function parseStringStyle(cssText) {
  const ret = {};
  cssText.split(listDelimiterRE).forEach((item) => {
    if (item) {
      const tmp = item.split(propertyDelimiterRE);
      tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return ret;
}
function normalizeClass(value) {
  let res = "";
  if (isString(value)) {
    res = value;
  } else if (isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      const normalized = normalizeClass(value[i]);
      if (normalized) {
        res += normalized + " ";
      }
    }
  } else if (isObject(value)) {
    for (const name in value) {
      if (value[name]) {
        res += name + " ";
      }
    }
  }
  return res.trim();
}
const toDisplayString = (val) => {
  return isString(val) ? val : val == null ? "" : isArray(val) || isObject(val) && (val.toString === objectToString || !isFunction(val.toString)) ? JSON.stringify(val, replacer, 2) : String(val);
};
const replacer = (_key, val) => {
  if (val && val.__v_isRef) {
    return replacer(_key, val.value);
  } else if (isMap(val)) {
    return {
      [`Map(${val.size})`]: [...val.entries()].reduce((entries, [key, val2]) => {
        entries[`${key} =>`] = val2;
        return entries;
      }, {})
    };
  } else if (isSet(val)) {
    return {
      [`Set(${val.size})`]: [...val.values()]
    };
  } else if (isObject(val) && !isArray(val) && !isPlainObject(val)) {
    return String(val);
  }
  return val;
};
const EMPTY_OBJ = {};
const EMPTY_ARR = [];
const NOOP = () => {
};
const NO = () => false;
const onRE = /^on[^a-z]/;
const isOn = (key) => onRE.test(key);
const isModelListener = (key) => key.startsWith("onUpdate:");
const extend = Object.assign;
const remove = (arr, el) => {
  const i = arr.indexOf(el);
  if (i > -1) {
    arr.splice(i, 1);
  }
};
const hasOwnProperty = Object.prototype.hasOwnProperty;
const hasOwn = (val, key) => hasOwnProperty.call(val, key);
const isArray = Array.isArray;
const isMap = (val) => toTypeString(val) === "[object Map]";
const isSet = (val) => toTypeString(val) === "[object Set]";
const isFunction = (val) => typeof val === "function";
const isString = (val) => typeof val === "string";
const isSymbol = (val) => typeof val === "symbol";
const isObject = (val) => val !== null && typeof val === "object";
const isPromise = (val) => {
  return isObject(val) && isFunction(val.then) && isFunction(val.catch);
};
const objectToString = Object.prototype.toString;
const toTypeString = (value) => objectToString.call(value);
const toRawType = (value) => {
  return toTypeString(value).slice(8, -1);
};
const isPlainObject = (val) => toTypeString(val) === "[object Object]";
const isIntegerKey = (key) => isString(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
const isReservedProp = /* @__PURE__ */ makeMap(
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
);
const cacheStringFunction = (fn) => {
  const cache = /* @__PURE__ */ Object.create(null);
  return (str) => {
    const hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
};
const camelizeRE = /-(\w)/g;
const camelize = cacheStringFunction((str) => {
  return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : "");
});
const hyphenateRE = /\B([A-Z])/g;
const hyphenate = cacheStringFunction((str) => str.replace(hyphenateRE, "-$1").toLowerCase());
const capitalize = cacheStringFunction((str) => str.charAt(0).toUpperCase() + str.slice(1));
const toHandlerKey = cacheStringFunction((str) => str ? `on${capitalize(str)}` : ``);
const hasChanged = (value, oldValue) => !Object.is(value, oldValue);
const invokeArrayFns = (fns, arg) => {
  for (let i = 0; i < fns.length; i++) {
    fns[i](arg);
  }
};
const def = (obj, key, value) => {
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: false,
    value
  });
};
const toNumber = (val) => {
  const n = parseFloat(val);
  return isNaN(n) ? val : n;
};
let _globalThis;
const getGlobalThis = () => {
  return _globalThis || (_globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
};
let activeEffectScope;
class EffectScope {
  constructor(detached = false) {
    this.active = true;
    this.effects = [];
    this.cleanups = [];
    if (!detached && activeEffectScope) {
      this.parent = activeEffectScope;
      this.index = (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(this) - 1;
    }
  }
  run(fn) {
    if (this.active) {
      const currentEffectScope = activeEffectScope;
      try {
        activeEffectScope = this;
        return fn();
      } finally {
        activeEffectScope = currentEffectScope;
      }
    }
  }
  on() {
    activeEffectScope = this;
  }
  off() {
    activeEffectScope = this.parent;
  }
  stop(fromParent) {
    if (this.active) {
      let i, l;
      for (i = 0, l = this.effects.length; i < l; i++) {
        this.effects[i].stop();
      }
      for (i = 0, l = this.cleanups.length; i < l; i++) {
        this.cleanups[i]();
      }
      if (this.scopes) {
        for (i = 0, l = this.scopes.length; i < l; i++) {
          this.scopes[i].stop(true);
        }
      }
      if (this.parent && !fromParent) {
        const last = this.parent.scopes.pop();
        if (last && last !== this) {
          this.parent.scopes[this.index] = last;
          last.index = this.index;
        }
      }
      this.active = false;
    }
  }
}
function recordEffectScope(effect, scope = activeEffectScope) {
  if (scope && scope.active) {
    scope.effects.push(effect);
  }
}
const createDep = (effects) => {
  const dep = new Set(effects);
  dep.w = 0;
  dep.n = 0;
  return dep;
};
const wasTracked = (dep) => (dep.w & trackOpBit) > 0;
const newTracked = (dep) => (dep.n & trackOpBit) > 0;
const initDepMarkers = ({ deps }) => {
  if (deps.length) {
    for (let i = 0; i < deps.length; i++) {
      deps[i].w |= trackOpBit;
    }
  }
};
const finalizeDepMarkers = (effect) => {
  const { deps } = effect;
  if (deps.length) {
    let ptr = 0;
    for (let i = 0; i < deps.length; i++) {
      const dep = deps[i];
      if (wasTracked(dep) && !newTracked(dep)) {
        dep.delete(effect);
      } else {
        deps[ptr++] = dep;
      }
      dep.w &= ~trackOpBit;
      dep.n &= ~trackOpBit;
    }
    deps.length = ptr;
  }
};
const targetMap = /* @__PURE__ */ new WeakMap();
let effectTrackDepth = 0;
let trackOpBit = 1;
const maxMarkerBits = 30;
let activeEffect;
const ITERATE_KEY = Symbol("");
const MAP_KEY_ITERATE_KEY = Symbol("");
class ReactiveEffect {
  constructor(fn, scheduler = null, scope) {
    this.fn = fn;
    this.scheduler = scheduler;
    this.active = true;
    this.deps = [];
    this.parent = void 0;
    recordEffectScope(this, scope);
  }
  run() {
    if (!this.active) {
      return this.fn();
    }
    let parent = activeEffect;
    let lastShouldTrack = shouldTrack;
    while (parent) {
      if (parent === this) {
        return;
      }
      parent = parent.parent;
    }
    try {
      this.parent = activeEffect;
      activeEffect = this;
      shouldTrack = true;
      trackOpBit = 1 << ++effectTrackDepth;
      if (effectTrackDepth <= maxMarkerBits) {
        initDepMarkers(this);
      } else {
        cleanupEffect(this);
      }
      return this.fn();
    } finally {
      if (effectTrackDepth <= maxMarkerBits) {
        finalizeDepMarkers(this);
      }
      trackOpBit = 1 << --effectTrackDepth;
      activeEffect = this.parent;
      shouldTrack = lastShouldTrack;
      this.parent = void 0;
      if (this.deferStop) {
        this.stop();
      }
    }
  }
  stop() {
    if (activeEffect === this) {
      this.deferStop = true;
    } else if (this.active) {
      cleanupEffect(this);
      if (this.onStop) {
        this.onStop();
      }
      this.active = false;
    }
  }
}
function cleanupEffect(effect) {
  const { deps } = effect;
  if (deps.length) {
    for (let i = 0; i < deps.length; i++) {
      deps[i].delete(effect);
    }
    deps.length = 0;
  }
}
let shouldTrack = true;
const trackStack = [];
function pauseTracking() {
  trackStack.push(shouldTrack);
  shouldTrack = false;
}
function resetTracking() {
  const last = trackStack.pop();
  shouldTrack = last === void 0 ? true : last;
}
function track(target, type, key) {
  if (shouldTrack && activeEffect) {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
    }
    let dep = depsMap.get(key);
    if (!dep) {
      depsMap.set(key, dep = createDep());
    }
    trackEffects(dep);
  }
}
function trackEffects(dep, debuggerEventExtraInfo) {
  let shouldTrack2 = false;
  if (effectTrackDepth <= maxMarkerBits) {
    if (!newTracked(dep)) {
      dep.n |= trackOpBit;
      shouldTrack2 = !wasTracked(dep);
    }
  } else {
    shouldTrack2 = !dep.has(activeEffect);
  }
  if (shouldTrack2) {
    dep.add(activeEffect);
    activeEffect.deps.push(dep);
  }
}
function trigger(target, type, key, newValue, oldValue, oldTarget) {
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    return;
  }
  let deps = [];
  if (type === "clear") {
    deps = [...depsMap.values()];
  } else if (key === "length" && isArray(target)) {
    depsMap.forEach((dep, key2) => {
      if (key2 === "length" || key2 >= newValue) {
        deps.push(dep);
      }
    });
  } else {
    if (key !== void 0) {
      deps.push(depsMap.get(key));
    }
    switch (type) {
      case "add":
        if (!isArray(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
          if (isMap(target)) {
            deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        } else if (isIntegerKey(key)) {
          deps.push(depsMap.get("length"));
        }
        break;
      case "delete":
        if (!isArray(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
          if (isMap(target)) {
            deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        }
        break;
      case "set":
        if (isMap(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
        }
        break;
    }
  }
  if (deps.length === 1) {
    if (deps[0]) {
      {
        triggerEffects(deps[0]);
      }
    }
  } else {
    const effects = [];
    for (const dep of deps) {
      if (dep) {
        effects.push(...dep);
      }
    }
    {
      triggerEffects(createDep(effects));
    }
  }
}
function triggerEffects(dep, debuggerEventExtraInfo) {
  const effects = isArray(dep) ? dep : [...dep];
  for (const effect of effects) {
    if (effect.computed) {
      triggerEffect(effect);
    }
  }
  for (const effect of effects) {
    if (!effect.computed) {
      triggerEffect(effect);
    }
  }
}
function triggerEffect(effect, debuggerEventExtraInfo) {
  if (effect !== activeEffect || effect.allowRecurse) {
    if (effect.scheduler) {
      effect.scheduler();
    } else {
      effect.run();
    }
  }
}
const isNonTrackableKeys = /* @__PURE__ */ makeMap(`__proto__,__v_isRef,__isVue`);
const builtInSymbols = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((key) => key !== "arguments" && key !== "caller").map((key) => Symbol[key]).filter(isSymbol)
);
const get = /* @__PURE__ */ createGetter();
const shallowGet = /* @__PURE__ */ createGetter(false, true);
const readonlyGet = /* @__PURE__ */ createGetter(true);
const arrayInstrumentations = /* @__PURE__ */ createArrayInstrumentations();
function createArrayInstrumentations() {
  const instrumentations = {};
  ["includes", "indexOf", "lastIndexOf"].forEach((key) => {
    instrumentations[key] = function(...args) {
      const arr = toRaw(this);
      for (let i = 0, l = this.length; i < l; i++) {
        track(arr, "get", i + "");
      }
      const res = arr[key](...args);
      if (res === -1 || res === false) {
        return arr[key](...args.map(toRaw));
      } else {
        return res;
      }
    };
  });
  ["push", "pop", "shift", "unshift", "splice"].forEach((key) => {
    instrumentations[key] = function(...args) {
      pauseTracking();
      const res = toRaw(this)[key].apply(this, args);
      resetTracking();
      return res;
    };
  });
  return instrumentations;
}
function createGetter(isReadonly2 = false, shallow = false) {
  return function get2(target, key, receiver) {
    if (key === "__v_isReactive") {
      return !isReadonly2;
    } else if (key === "__v_isReadonly") {
      return isReadonly2;
    } else if (key === "__v_isShallow") {
      return shallow;
    } else if (key === "__v_raw" && receiver === (isReadonly2 ? shallow ? shallowReadonlyMap : readonlyMap : shallow ? shallowReactiveMap : reactiveMap).get(target)) {
      return target;
    }
    const targetIsArray = isArray(target);
    if (!isReadonly2 && targetIsArray && hasOwn(arrayInstrumentations, key)) {
      return Reflect.get(arrayInstrumentations, key, receiver);
    }
    const res = Reflect.get(target, key, receiver);
    if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
      return res;
    }
    if (!isReadonly2) {
      track(target, "get", key);
    }
    if (shallow) {
      return res;
    }
    if (isRef(res)) {
      return targetIsArray && isIntegerKey(key) ? res : res.value;
    }
    if (isObject(res)) {
      return isReadonly2 ? readonly(res) : reactive(res);
    }
    return res;
  };
}
const set = /* @__PURE__ */ createSetter();
const shallowSet = /* @__PURE__ */ createSetter(true);
function createSetter(shallow = false) {
  return function set2(target, key, value, receiver) {
    let oldValue = target[key];
    if (isReadonly(oldValue) && isRef(oldValue) && !isRef(value)) {
      return false;
    }
    if (!shallow) {
      if (!isShallow(value) && !isReadonly(value)) {
        oldValue = toRaw(oldValue);
        value = toRaw(value);
      }
      if (!isArray(target) && isRef(oldValue) && !isRef(value)) {
        oldValue.value = value;
        return true;
      }
    }
    const hadKey = isArray(target) && isIntegerKey(key) ? Number(key) < target.length : hasOwn(target, key);
    const result = Reflect.set(target, key, value, receiver);
    if (target === toRaw(receiver)) {
      if (!hadKey) {
        trigger(target, "add", key, value);
      } else if (hasChanged(value, oldValue)) {
        trigger(target, "set", key, value);
      }
    }
    return result;
  };
}
function deleteProperty(target, key) {
  const hadKey = hasOwn(target, key);
  target[key];
  const result = Reflect.deleteProperty(target, key);
  if (result && hadKey) {
    trigger(target, "delete", key, void 0);
  }
  return result;
}
function has(target, key) {
  const result = Reflect.has(target, key);
  if (!isSymbol(key) || !builtInSymbols.has(key)) {
    track(target, "has", key);
  }
  return result;
}
function ownKeys(target) {
  track(target, "iterate", isArray(target) ? "length" : ITERATE_KEY);
  return Reflect.ownKeys(target);
}
const mutableHandlers = {
  get,
  set,
  deleteProperty,
  has,
  ownKeys
};
const readonlyHandlers = {
  get: readonlyGet,
  set(target, key) {
    return true;
  },
  deleteProperty(target, key) {
    return true;
  }
};
const shallowReactiveHandlers = /* @__PURE__ */ extend({}, mutableHandlers, {
  get: shallowGet,
  set: shallowSet
});
const toShallow = (value) => value;
const getProto = (v) => Reflect.getPrototypeOf(v);
function get$1(target, key, isReadonly2 = false, isShallow2 = false) {
  target = target["__v_raw"];
  const rawTarget = toRaw(target);
  const rawKey = toRaw(key);
  if (!isReadonly2) {
    if (key !== rawKey) {
      track(rawTarget, "get", key);
    }
    track(rawTarget, "get", rawKey);
  }
  const { has: has2 } = getProto(rawTarget);
  const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
  if (has2.call(rawTarget, key)) {
    return wrap(target.get(key));
  } else if (has2.call(rawTarget, rawKey)) {
    return wrap(target.get(rawKey));
  } else if (target !== rawTarget) {
    target.get(key);
  }
}
function has$1(key, isReadonly2 = false) {
  const target = this["__v_raw"];
  const rawTarget = toRaw(target);
  const rawKey = toRaw(key);
  if (!isReadonly2) {
    if (key !== rawKey) {
      track(rawTarget, "has", key);
    }
    track(rawTarget, "has", rawKey);
  }
  return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
}
function size(target, isReadonly2 = false) {
  target = target["__v_raw"];
  !isReadonly2 && track(toRaw(target), "iterate", ITERATE_KEY);
  return Reflect.get(target, "size", target);
}
function add(value) {
  value = toRaw(value);
  const target = toRaw(this);
  const proto = getProto(target);
  const hadKey = proto.has.call(target, value);
  if (!hadKey) {
    target.add(value);
    trigger(target, "add", value, value);
  }
  return this;
}
function set$1(key, value) {
  value = toRaw(value);
  const target = toRaw(this);
  const { has: has2, get: get2 } = getProto(target);
  let hadKey = has2.call(target, key);
  if (!hadKey) {
    key = toRaw(key);
    hadKey = has2.call(target, key);
  }
  const oldValue = get2.call(target, key);
  target.set(key, value);
  if (!hadKey) {
    trigger(target, "add", key, value);
  } else if (hasChanged(value, oldValue)) {
    trigger(target, "set", key, value);
  }
  return this;
}
function deleteEntry(key) {
  const target = toRaw(this);
  const { has: has2, get: get2 } = getProto(target);
  let hadKey = has2.call(target, key);
  if (!hadKey) {
    key = toRaw(key);
    hadKey = has2.call(target, key);
  }
  get2 ? get2.call(target, key) : void 0;
  const result = target.delete(key);
  if (hadKey) {
    trigger(target, "delete", key, void 0);
  }
  return result;
}
function clear() {
  const target = toRaw(this);
  const hadItems = target.size !== 0;
  const result = target.clear();
  if (hadItems) {
    trigger(target, "clear", void 0, void 0);
  }
  return result;
}
function createForEach(isReadonly2, isShallow2) {
  return function forEach(callback, thisArg) {
    const observed = this;
    const target = observed["__v_raw"];
    const rawTarget = toRaw(target);
    const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
    !isReadonly2 && track(rawTarget, "iterate", ITERATE_KEY);
    return target.forEach((value, key) => {
      return callback.call(thisArg, wrap(value), wrap(key), observed);
    });
  };
}
function createIterableMethod(method, isReadonly2, isShallow2) {
  return function(...args) {
    const target = this["__v_raw"];
    const rawTarget = toRaw(target);
    const targetIsMap = isMap(rawTarget);
    const isPair = method === "entries" || method === Symbol.iterator && targetIsMap;
    const isKeyOnly = method === "keys" && targetIsMap;
    const innerIterator = target[method](...args);
    const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
    !isReadonly2 && track(rawTarget, "iterate", isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY);
    return {
      next() {
        const { value, done } = innerIterator.next();
        return done ? { value, done } : {
          value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
          done
        };
      },
      [Symbol.iterator]() {
        return this;
      }
    };
  };
}
function createReadonlyMethod(type) {
  return function(...args) {
    return type === "delete" ? false : this;
  };
}
function createInstrumentations() {
  const mutableInstrumentations2 = {
    get(key) {
      return get$1(this, key);
    },
    get size() {
      return size(this);
    },
    has: has$1,
    add,
    set: set$1,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, false)
  };
  const shallowInstrumentations2 = {
    get(key) {
      return get$1(this, key, false, true);
    },
    get size() {
      return size(this);
    },
    has: has$1,
    add,
    set: set$1,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, true)
  };
  const readonlyInstrumentations2 = {
    get(key) {
      return get$1(this, key, true);
    },
    get size() {
      return size(this, true);
    },
    has(key) {
      return has$1.call(this, key, true);
    },
    add: createReadonlyMethod("add"),
    set: createReadonlyMethod("set"),
    delete: createReadonlyMethod("delete"),
    clear: createReadonlyMethod("clear"),
    forEach: createForEach(true, false)
  };
  const shallowReadonlyInstrumentations2 = {
    get(key) {
      return get$1(this, key, true, true);
    },
    get size() {
      return size(this, true);
    },
    has(key) {
      return has$1.call(this, key, true);
    },
    add: createReadonlyMethod("add"),
    set: createReadonlyMethod("set"),
    delete: createReadonlyMethod("delete"),
    clear: createReadonlyMethod("clear"),
    forEach: createForEach(true, true)
  };
  const iteratorMethods = ["keys", "values", "entries", Symbol.iterator];
  iteratorMethods.forEach((method) => {
    mutableInstrumentations2[method] = createIterableMethod(method, false, false);
    readonlyInstrumentations2[method] = createIterableMethod(method, true, false);
    shallowInstrumentations2[method] = createIterableMethod(method, false, true);
    shallowReadonlyInstrumentations2[method] = createIterableMethod(method, true, true);
  });
  return [
    mutableInstrumentations2,
    readonlyInstrumentations2,
    shallowInstrumentations2,
    shallowReadonlyInstrumentations2
  ];
}
const [mutableInstrumentations, readonlyInstrumentations, shallowInstrumentations, shallowReadonlyInstrumentations] = /* @__PURE__ */ createInstrumentations();
function createInstrumentationGetter(isReadonly2, shallow) {
  const instrumentations = shallow ? isReadonly2 ? shallowReadonlyInstrumentations : shallowInstrumentations : isReadonly2 ? readonlyInstrumentations : mutableInstrumentations;
  return (target, key, receiver) => {
    if (key === "__v_isReactive") {
      return !isReadonly2;
    } else if (key === "__v_isReadonly") {
      return isReadonly2;
    } else if (key === "__v_raw") {
      return target;
    }
    return Reflect.get(hasOwn(instrumentations, key) && key in target ? instrumentations : target, key, receiver);
  };
}
const mutableCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(false, false)
};
const shallowCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(false, true)
};
const readonlyCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(true, false)
};
const reactiveMap = /* @__PURE__ */ new WeakMap();
const shallowReactiveMap = /* @__PURE__ */ new WeakMap();
const readonlyMap = /* @__PURE__ */ new WeakMap();
const shallowReadonlyMap = /* @__PURE__ */ new WeakMap();
function targetTypeMap(rawType) {
  switch (rawType) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
function getTargetType(value) {
  return value["__v_skip"] || !Object.isExtensible(value) ? 0 : targetTypeMap(toRawType(value));
}
function reactive(target) {
  if (isReadonly(target)) {
    return target;
  }
  return createReactiveObject(target, false, mutableHandlers, mutableCollectionHandlers, reactiveMap);
}
function shallowReactive(target) {
  return createReactiveObject(target, false, shallowReactiveHandlers, shallowCollectionHandlers, shallowReactiveMap);
}
function readonly(target) {
  return createReactiveObject(target, true, readonlyHandlers, readonlyCollectionHandlers, readonlyMap);
}
function createReactiveObject(target, isReadonly2, baseHandlers, collectionHandlers, proxyMap) {
  if (!isObject(target)) {
    return target;
  }
  if (target["__v_raw"] && !(isReadonly2 && target["__v_isReactive"])) {
    return target;
  }
  const existingProxy = proxyMap.get(target);
  if (existingProxy) {
    return existingProxy;
  }
  const targetType = getTargetType(target);
  if (targetType === 0) {
    return target;
  }
  const proxy = new Proxy(target, targetType === 2 ? collectionHandlers : baseHandlers);
  proxyMap.set(target, proxy);
  return proxy;
}
function isReactive(value) {
  if (isReadonly(value)) {
    return isReactive(value["__v_raw"]);
  }
  return !!(value && value["__v_isReactive"]);
}
function isReadonly(value) {
  return !!(value && value["__v_isReadonly"]);
}
function isShallow(value) {
  return !!(value && value["__v_isShallow"]);
}
function isProxy(value) {
  return isReactive(value) || isReadonly(value);
}
function toRaw(observed) {
  const raw = observed && observed["__v_raw"];
  return raw ? toRaw(raw) : observed;
}
function markRaw(value) {
  def(value, "__v_skip", true);
  return value;
}
const toReactive = (value) => isObject(value) ? reactive(value) : value;
const toReadonly = (value) => isObject(value) ? readonly(value) : value;
function trackRefValue(ref) {
  if (shouldTrack && activeEffect) {
    ref = toRaw(ref);
    {
      trackEffects(ref.dep || (ref.dep = createDep()));
    }
  }
}
function triggerRefValue(ref, newVal) {
  ref = toRaw(ref);
  if (ref.dep) {
    {
      triggerEffects(ref.dep);
    }
  }
}
function isRef(r) {
  return !!(r && r.__v_isRef === true);
}
function shallowRef(value) {
  return createRef(value, true);
}
function createRef(rawValue, shallow) {
  if (isRef(rawValue)) {
    return rawValue;
  }
  return new RefImpl(rawValue, shallow);
}
class RefImpl {
  constructor(value, __v_isShallow) {
    this.__v_isShallow = __v_isShallow;
    this.dep = void 0;
    this.__v_isRef = true;
    this._rawValue = __v_isShallow ? value : toRaw(value);
    this._value = __v_isShallow ? value : toReactive(value);
  }
  get value() {
    trackRefValue(this);
    return this._value;
  }
  set value(newVal) {
    const useDirectValue = this.__v_isShallow || isShallow(newVal) || isReadonly(newVal);
    newVal = useDirectValue ? newVal : toRaw(newVal);
    if (hasChanged(newVal, this._rawValue)) {
      this._rawValue = newVal;
      this._value = useDirectValue ? newVal : toReactive(newVal);
      triggerRefValue(this);
    }
  }
}
function unref(ref) {
  return isRef(ref) ? ref.value : ref;
}
const shallowUnwrapHandlers = {
  get: (target, key, receiver) => unref(Reflect.get(target, key, receiver)),
  set: (target, key, value, receiver) => {
    const oldValue = target[key];
    if (isRef(oldValue) && !isRef(value)) {
      oldValue.value = value;
      return true;
    } else {
      return Reflect.set(target, key, value, receiver);
    }
  }
};
function proxyRefs(objectWithRefs) {
  return isReactive(objectWithRefs) ? objectWithRefs : new Proxy(objectWithRefs, shallowUnwrapHandlers);
}
var _a;
class ComputedRefImpl {
  constructor(getter, _setter, isReadonly2, isSSR) {
    this._setter = _setter;
    this.dep = void 0;
    this.__v_isRef = true;
    this[_a] = false;
    this._dirty = true;
    this.effect = new ReactiveEffect(getter, () => {
      if (!this._dirty) {
        this._dirty = true;
        triggerRefValue(this);
      }
    });
    this.effect.computed = this;
    this.effect.active = this._cacheable = !isSSR;
    this["__v_isReadonly"] = isReadonly2;
  }
  get value() {
    const self2 = toRaw(this);
    trackRefValue(self2);
    if (self2._dirty || !self2._cacheable) {
      self2._dirty = false;
      self2._value = self2.effect.run();
    }
    return self2._value;
  }
  set value(newValue) {
    this._setter(newValue);
  }
}
_a = "__v_isReadonly";
function computed$1(getterOrOptions, debugOptions, isSSR = false) {
  let getter;
  let setter;
  const onlyGetter = isFunction(getterOrOptions);
  if (onlyGetter) {
    getter = getterOrOptions;
    setter = NOOP;
  } else {
    getter = getterOrOptions.get;
    setter = getterOrOptions.set;
  }
  const cRef = new ComputedRefImpl(getter, setter, onlyGetter || !setter, isSSR);
  return cRef;
}
function callWithErrorHandling(fn, instance, type, args) {
  let res;
  try {
    res = args ? fn(...args) : fn();
  } catch (err) {
    handleError(err, instance, type);
  }
  return res;
}
function callWithAsyncErrorHandling(fn, instance, type, args) {
  if (isFunction(fn)) {
    const res = callWithErrorHandling(fn, instance, type, args);
    if (res && isPromise(res)) {
      res.catch((err) => {
        handleError(err, instance, type);
      });
    }
    return res;
  }
  const values = [];
  for (let i = 0; i < fn.length; i++) {
    values.push(callWithAsyncErrorHandling(fn[i], instance, type, args));
  }
  return values;
}
function handleError(err, instance, type, throwInDev = true) {
  const contextVNode = instance ? instance.vnode : null;
  if (instance) {
    let cur = instance.parent;
    const exposedInstance = instance.proxy;
    const errorInfo = type;
    while (cur) {
      const errorCapturedHooks = cur.ec;
      if (errorCapturedHooks) {
        for (let i = 0; i < errorCapturedHooks.length; i++) {
          if (errorCapturedHooks[i](err, exposedInstance, errorInfo) === false) {
            return;
          }
        }
      }
      cur = cur.parent;
    }
    const appErrorHandler = instance.appContext.config.errorHandler;
    if (appErrorHandler) {
      callWithErrorHandling(appErrorHandler, null, 10, [err, exposedInstance, errorInfo]);
      return;
    }
  }
  logError(err, type, contextVNode, throwInDev);
}
function logError(err, type, contextVNode, throwInDev = true) {
  {
  }
}
let isFlushing = false;
let isFlushPending = false;
const queue = [];
let flushIndex = 0;
const pendingPostFlushCbs = [];
let activePostFlushCbs = null;
let postFlushIndex = 0;
const resolvedPromise = /* @__PURE__ */ Promise.resolve();
let currentFlushPromise = null;
function nextTick(fn) {
  const p2 = currentFlushPromise || resolvedPromise;
  return fn ? p2.then(this ? fn.bind(this) : fn) : p2;
}
function findInsertionIndex(id) {
  let start = flushIndex + 1;
  let end = queue.length;
  while (start < end) {
    const middle = start + end >>> 1;
    const middleJobId = getId(queue[middle]);
    middleJobId < id ? start = middle + 1 : end = middle;
  }
  return start;
}
function queueJob(job) {
  if (!queue.length || !queue.includes(job, isFlushing && job.allowRecurse ? flushIndex + 1 : flushIndex)) {
    if (job.id == null) {
      queue.push(job);
    } else {
      queue.splice(findInsertionIndex(job.id), 0, job);
    }
    queueFlush();
  }
}
function queueFlush() {
  if (!isFlushing && !isFlushPending) {
    isFlushPending = true;
    currentFlushPromise = resolvedPromise.then(flushJobs);
  }
}
function invalidateJob(job) {
  const i = queue.indexOf(job);
  if (i > flushIndex) {
    queue.splice(i, 1);
  }
}
function queuePostFlushCb(cb) {
  if (!isArray(cb)) {
    if (!activePostFlushCbs || !activePostFlushCbs.includes(cb, cb.allowRecurse ? postFlushIndex + 1 : postFlushIndex)) {
      pendingPostFlushCbs.push(cb);
    }
  } else {
    pendingPostFlushCbs.push(...cb);
  }
  queueFlush();
}
function flushPreFlushCbs(seen, i = isFlushing ? flushIndex + 1 : 0) {
  for (; i < queue.length; i++) {
    const cb = queue[i];
    if (cb && cb.pre) {
      queue.splice(i, 1);
      i--;
      cb();
    }
  }
}
function flushPostFlushCbs(seen) {
  if (pendingPostFlushCbs.length) {
    const deduped = [...new Set(pendingPostFlushCbs)];
    pendingPostFlushCbs.length = 0;
    if (activePostFlushCbs) {
      activePostFlushCbs.push(...deduped);
      return;
    }
    activePostFlushCbs = deduped;
    activePostFlushCbs.sort((a, b) => getId(a) - getId(b));
    for (postFlushIndex = 0; postFlushIndex < activePostFlushCbs.length; postFlushIndex++) {
      activePostFlushCbs[postFlushIndex]();
    }
    activePostFlushCbs = null;
    postFlushIndex = 0;
  }
}
const getId = (job) => job.id == null ? Infinity : job.id;
const comparator = (a, b) => {
  const diff = getId(a) - getId(b);
  if (diff === 0) {
    if (a.pre && !b.pre)
      return -1;
    if (b.pre && !a.pre)
      return 1;
  }
  return diff;
};
function flushJobs(seen) {
  isFlushPending = false;
  isFlushing = true;
  queue.sort(comparator);
  const check = NOOP;
  try {
    for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
      const job = queue[flushIndex];
      if (job && job.active !== false) {
        if (false)
          ;
        callWithErrorHandling(job, null, 14);
      }
    }
  } finally {
    flushIndex = 0;
    queue.length = 0;
    flushPostFlushCbs();
    isFlushing = false;
    currentFlushPromise = null;
    if (queue.length || pendingPostFlushCbs.length) {
      flushJobs();
    }
  }
}
function emit$1(instance, event, ...rawArgs) {
  if (instance.isUnmounted)
    return;
  const props = instance.vnode.props || EMPTY_OBJ;
  let args = rawArgs;
  const isModelListener2 = event.startsWith("update:");
  const modelArg = isModelListener2 && event.slice(7);
  if (modelArg && modelArg in props) {
    const modifiersKey = `${modelArg === "modelValue" ? "model" : modelArg}Modifiers`;
    const { number, trim } = props[modifiersKey] || EMPTY_OBJ;
    if (trim) {
      args = rawArgs.map((a) => a.trim());
    }
    if (number) {
      args = rawArgs.map(toNumber);
    }
  }
  let handlerName;
  let handler = props[handlerName = toHandlerKey(event)] || props[handlerName = toHandlerKey(camelize(event))];
  if (!handler && isModelListener2) {
    handler = props[handlerName = toHandlerKey(hyphenate(event))];
  }
  if (handler) {
    callWithAsyncErrorHandling(handler, instance, 6, args);
  }
  const onceHandler = props[handlerName + `Once`];
  if (onceHandler) {
    if (!instance.emitted) {
      instance.emitted = {};
    } else if (instance.emitted[handlerName]) {
      return;
    }
    instance.emitted[handlerName] = true;
    callWithAsyncErrorHandling(onceHandler, instance, 6, args);
  }
}
function normalizeEmitsOptions(comp, appContext, asMixin = false) {
  const cache = appContext.emitsCache;
  const cached = cache.get(comp);
  if (cached !== void 0) {
    return cached;
  }
  const raw = comp.emits;
  let normalized = {};
  let hasExtends = false;
  if (!isFunction(comp)) {
    const extendEmits = (raw2) => {
      const normalizedFromExtend = normalizeEmitsOptions(raw2, appContext, true);
      if (normalizedFromExtend) {
        hasExtends = true;
        extend(normalized, normalizedFromExtend);
      }
    };
    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendEmits);
    }
    if (comp.extends) {
      extendEmits(comp.extends);
    }
    if (comp.mixins) {
      comp.mixins.forEach(extendEmits);
    }
  }
  if (!raw && !hasExtends) {
    if (isObject(comp)) {
      cache.set(comp, null);
    }
    return null;
  }
  if (isArray(raw)) {
    raw.forEach((key) => normalized[key] = null);
  } else {
    extend(normalized, raw);
  }
  if (isObject(comp)) {
    cache.set(comp, normalized);
  }
  return normalized;
}
function isEmitListener(options, key) {
  if (!options || !isOn(key)) {
    return false;
  }
  key = key.slice(2).replace(/Once$/, "");
  return hasOwn(options, key[0].toLowerCase() + key.slice(1)) || hasOwn(options, hyphenate(key)) || hasOwn(options, key);
}
let currentRenderingInstance = null;
let currentScopeId = null;
function setCurrentRenderingInstance(instance) {
  const prev = currentRenderingInstance;
  currentRenderingInstance = instance;
  currentScopeId = instance && instance.type.__scopeId || null;
  return prev;
}
function withCtx(fn, ctx = currentRenderingInstance, isNonScopedSlot) {
  if (!ctx)
    return fn;
  if (fn._n) {
    return fn;
  }
  const renderFnWithContext = (...args) => {
    if (renderFnWithContext._d) {
      setBlockTracking(-1);
    }
    const prevInstance = setCurrentRenderingInstance(ctx);
    const res = fn(...args);
    setCurrentRenderingInstance(prevInstance);
    if (renderFnWithContext._d) {
      setBlockTracking(1);
    }
    return res;
  };
  renderFnWithContext._n = true;
  renderFnWithContext._c = true;
  renderFnWithContext._d = true;
  return renderFnWithContext;
}
function markAttrsAccessed() {
}
function renderComponentRoot(instance) {
  const { type: Component, vnode, proxy, withProxy, props, propsOptions: [propsOptions], slots, attrs, emit, render, renderCache, data, setupState, ctx, inheritAttrs } = instance;
  let result;
  let fallthroughAttrs;
  const prev = setCurrentRenderingInstance(instance);
  try {
    if (vnode.shapeFlag & 4) {
      const proxyToUse = withProxy || proxy;
      result = normalizeVNode(render.call(proxyToUse, proxyToUse, renderCache, props, setupState, data, ctx));
      fallthroughAttrs = attrs;
    } else {
      const render2 = Component;
      if (false)
        ;
      result = normalizeVNode(render2.length > 1 ? render2(props, false ? {
        get attrs() {
          markAttrsAccessed();
          return attrs;
        },
        slots,
        emit
      } : { attrs, slots, emit }) : render2(props, null));
      fallthroughAttrs = Component.props ? attrs : getFunctionalFallthrough(attrs);
    }
  } catch (err) {
    blockStack.length = 0;
    handleError(err, instance, 1);
    result = createVNode(Comment);
  }
  let root = result;
  if (fallthroughAttrs && inheritAttrs !== false) {
    const keys = Object.keys(fallthroughAttrs);
    const { shapeFlag } = root;
    if (keys.length) {
      if (shapeFlag & (1 | 6)) {
        if (propsOptions && keys.some(isModelListener)) {
          fallthroughAttrs = filterModelListeners(fallthroughAttrs, propsOptions);
        }
        root = cloneVNode(root, fallthroughAttrs);
      }
    }
  }
  if (vnode.dirs) {
    root = cloneVNode(root);
    root.dirs = root.dirs ? root.dirs.concat(vnode.dirs) : vnode.dirs;
  }
  if (vnode.transition) {
    root.transition = vnode.transition;
  }
  {
    result = root;
  }
  setCurrentRenderingInstance(prev);
  return result;
}
const getFunctionalFallthrough = (attrs) => {
  let res;
  for (const key in attrs) {
    if (key === "class" || key === "style" || isOn(key)) {
      (res || (res = {}))[key] = attrs[key];
    }
  }
  return res;
};
const filterModelListeners = (attrs, props) => {
  const res = {};
  for (const key in attrs) {
    if (!isModelListener(key) || !(key.slice(9) in props)) {
      res[key] = attrs[key];
    }
  }
  return res;
};
function shouldUpdateComponent(prevVNode, nextVNode, optimized) {
  const { props: prevProps, children: prevChildren, component } = prevVNode;
  const { props: nextProps, children: nextChildren, patchFlag } = nextVNode;
  const emits = component.emitsOptions;
  if (nextVNode.dirs || nextVNode.transition) {
    return true;
  }
  if (optimized && patchFlag >= 0) {
    if (patchFlag & 1024) {
      return true;
    }
    if (patchFlag & 16) {
      if (!prevProps) {
        return !!nextProps;
      }
      return hasPropsChanged(prevProps, nextProps, emits);
    } else if (patchFlag & 8) {
      const dynamicProps = nextVNode.dynamicProps;
      for (let i = 0; i < dynamicProps.length; i++) {
        const key = dynamicProps[i];
        if (nextProps[key] !== prevProps[key] && !isEmitListener(emits, key)) {
          return true;
        }
      }
    }
  } else {
    if (prevChildren || nextChildren) {
      if (!nextChildren || !nextChildren.$stable) {
        return true;
      }
    }
    if (prevProps === nextProps) {
      return false;
    }
    if (!prevProps) {
      return !!nextProps;
    }
    if (!nextProps) {
      return true;
    }
    return hasPropsChanged(prevProps, nextProps, emits);
  }
  return false;
}
function hasPropsChanged(prevProps, nextProps, emitsOptions) {
  const nextKeys = Object.keys(nextProps);
  if (nextKeys.length !== Object.keys(prevProps).length) {
    return true;
  }
  for (let i = 0; i < nextKeys.length; i++) {
    const key = nextKeys[i];
    if (nextProps[key] !== prevProps[key] && !isEmitListener(emitsOptions, key)) {
      return true;
    }
  }
  return false;
}
function updateHOCHostEl({ vnode, parent }, el) {
  while (parent && parent.subTree === vnode) {
    (vnode = parent.vnode).el = el;
    parent = parent.parent;
  }
}
const isSuspense = (type) => type.__isSuspense;
function queueEffectWithSuspense(fn, suspense) {
  if (suspense && suspense.pendingBranch) {
    if (isArray(fn)) {
      suspense.effects.push(...fn);
    } else {
      suspense.effects.push(fn);
    }
  } else {
    queuePostFlushCb(fn);
  }
}
function provide(key, value) {
  if (!currentInstance)
    ;
  else {
    let provides = currentInstance.provides;
    const parentProvides = currentInstance.parent && currentInstance.parent.provides;
    if (parentProvides === provides) {
      provides = currentInstance.provides = Object.create(parentProvides);
    }
    provides[key] = value;
  }
}
function inject(key, defaultValue, treatDefaultAsFactory = false) {
  const instance = currentInstance || currentRenderingInstance;
  if (instance) {
    const provides = instance.parent == null ? instance.vnode.appContext && instance.vnode.appContext.provides : instance.parent.provides;
    if (provides && key in provides) {
      return provides[key];
    } else if (arguments.length > 1) {
      return treatDefaultAsFactory && isFunction(defaultValue) ? defaultValue.call(instance.proxy) : defaultValue;
    } else
      ;
  }
}
const INITIAL_WATCHER_VALUE = {};
function watch(source, cb, options) {
  return doWatch(source, cb, options);
}
function doWatch(source, cb, { immediate, deep, flush, onTrack, onTrigger } = EMPTY_OBJ) {
  const instance = currentInstance;
  let getter;
  let forceTrigger = false;
  let isMultiSource = false;
  if (isRef(source)) {
    getter = () => source.value;
    forceTrigger = isShallow(source);
  } else if (isReactive(source)) {
    getter = () => source;
    deep = true;
  } else if (isArray(source)) {
    isMultiSource = true;
    forceTrigger = source.some((s) => isReactive(s) || isShallow(s));
    getter = () => source.map((s) => {
      if (isRef(s)) {
        return s.value;
      } else if (isReactive(s)) {
        return traverse(s);
      } else if (isFunction(s)) {
        return callWithErrorHandling(s, instance, 2);
      } else
        ;
    });
  } else if (isFunction(source)) {
    if (cb) {
      getter = () => callWithErrorHandling(source, instance, 2);
    } else {
      getter = () => {
        if (instance && instance.isUnmounted) {
          return;
        }
        if (cleanup) {
          cleanup();
        }
        return callWithAsyncErrorHandling(source, instance, 3, [onCleanup]);
      };
    }
  } else {
    getter = NOOP;
  }
  if (cb && deep) {
    const baseGetter = getter;
    getter = () => traverse(baseGetter());
  }
  let cleanup;
  let onCleanup = (fn) => {
    cleanup = effect.onStop = () => {
      callWithErrorHandling(fn, instance, 4);
    };
  };
  if (isInSSRComponentSetup) {
    onCleanup = NOOP;
    if (!cb) {
      getter();
    } else if (immediate) {
      callWithAsyncErrorHandling(cb, instance, 3, [
        getter(),
        isMultiSource ? [] : void 0,
        onCleanup
      ]);
    }
    return NOOP;
  }
  let oldValue = isMultiSource ? [] : INITIAL_WATCHER_VALUE;
  const job = () => {
    if (!effect.active) {
      return;
    }
    if (cb) {
      const newValue = effect.run();
      if (deep || forceTrigger || (isMultiSource ? newValue.some((v, i) => hasChanged(v, oldValue[i])) : hasChanged(newValue, oldValue)) || false) {
        if (cleanup) {
          cleanup();
        }
        callWithAsyncErrorHandling(cb, instance, 3, [
          newValue,
          oldValue === INITIAL_WATCHER_VALUE ? void 0 : oldValue,
          onCleanup
        ]);
        oldValue = newValue;
      }
    } else {
      effect.run();
    }
  };
  job.allowRecurse = !!cb;
  let scheduler;
  if (flush === "sync") {
    scheduler = job;
  } else if (flush === "post") {
    scheduler = () => queuePostRenderEffect(job, instance && instance.suspense);
  } else {
    job.pre = true;
    if (instance)
      job.id = instance.uid;
    scheduler = () => queueJob(job);
  }
  const effect = new ReactiveEffect(getter, scheduler);
  if (cb) {
    if (immediate) {
      job();
    } else {
      oldValue = effect.run();
    }
  } else if (flush === "post") {
    queuePostRenderEffect(effect.run.bind(effect), instance && instance.suspense);
  } else {
    effect.run();
  }
  return () => {
    effect.stop();
    if (instance && instance.scope) {
      remove(instance.scope.effects, effect);
    }
  };
}
function instanceWatch(source, value, options) {
  const publicThis = this.proxy;
  const getter = isString(source) ? source.includes(".") ? createPathGetter(publicThis, source) : () => publicThis[source] : source.bind(publicThis, publicThis);
  let cb;
  if (isFunction(value)) {
    cb = value;
  } else {
    cb = value.handler;
    options = value;
  }
  const cur = currentInstance;
  setCurrentInstance(this);
  const res = doWatch(getter, cb.bind(publicThis), options);
  if (cur) {
    setCurrentInstance(cur);
  } else {
    unsetCurrentInstance();
  }
  return res;
}
function createPathGetter(ctx, path) {
  const segments = path.split(".");
  return () => {
    let cur = ctx;
    for (let i = 0; i < segments.length && cur; i++) {
      cur = cur[segments[i]];
    }
    return cur;
  };
}
function traverse(value, seen) {
  if (!isObject(value) || value["__v_skip"]) {
    return value;
  }
  seen = seen || /* @__PURE__ */ new Set();
  if (seen.has(value)) {
    return value;
  }
  seen.add(value);
  if (isRef(value)) {
    traverse(value.value, seen);
  } else if (isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      traverse(value[i], seen);
    }
  } else if (isSet(value) || isMap(value)) {
    value.forEach((v) => {
      traverse(v, seen);
    });
  } else if (isPlainObject(value)) {
    for (const key in value) {
      traverse(value[key], seen);
    }
  }
  return value;
}
function useTransitionState() {
  const state = {
    isMounted: false,
    isLeaving: false,
    isUnmounting: false,
    leavingVNodes: /* @__PURE__ */ new Map()
  };
  onMounted(() => {
    state.isMounted = true;
  });
  onBeforeUnmount(() => {
    state.isUnmounting = true;
  });
  return state;
}
const TransitionHookValidator = [Function, Array];
const BaseTransitionImpl = {
  name: `BaseTransition`,
  props: {
    mode: String,
    appear: Boolean,
    persisted: Boolean,
    onBeforeEnter: TransitionHookValidator,
    onEnter: TransitionHookValidator,
    onAfterEnter: TransitionHookValidator,
    onEnterCancelled: TransitionHookValidator,
    onBeforeLeave: TransitionHookValidator,
    onLeave: TransitionHookValidator,
    onAfterLeave: TransitionHookValidator,
    onLeaveCancelled: TransitionHookValidator,
    onBeforeAppear: TransitionHookValidator,
    onAppear: TransitionHookValidator,
    onAfterAppear: TransitionHookValidator,
    onAppearCancelled: TransitionHookValidator
  },
  setup(props, { slots }) {
    const instance = getCurrentInstance();
    const state = useTransitionState();
    let prevTransitionKey;
    return () => {
      const children = slots.default && getTransitionRawChildren(slots.default(), true);
      if (!children || !children.length) {
        return;
      }
      let child = children[0];
      if (children.length > 1) {
        for (const c of children) {
          if (c.type !== Comment) {
            child = c;
            break;
          }
        }
      }
      const rawProps = toRaw(props);
      const { mode } = rawProps;
      if (state.isLeaving) {
        return emptyPlaceholder(child);
      }
      const innerChild = getKeepAliveChild(child);
      if (!innerChild) {
        return emptyPlaceholder(child);
      }
      const enterHooks = resolveTransitionHooks(innerChild, rawProps, state, instance);
      setTransitionHooks(innerChild, enterHooks);
      const oldChild = instance.subTree;
      const oldInnerChild = oldChild && getKeepAliveChild(oldChild);
      let transitionKeyChanged = false;
      const { getTransitionKey } = innerChild.type;
      if (getTransitionKey) {
        const key = getTransitionKey();
        if (prevTransitionKey === void 0) {
          prevTransitionKey = key;
        } else if (key !== prevTransitionKey) {
          prevTransitionKey = key;
          transitionKeyChanged = true;
        }
      }
      if (oldInnerChild && oldInnerChild.type !== Comment && (!isSameVNodeType(innerChild, oldInnerChild) || transitionKeyChanged)) {
        const leavingHooks = resolveTransitionHooks(oldInnerChild, rawProps, state, instance);
        setTransitionHooks(oldInnerChild, leavingHooks);
        if (mode === "out-in") {
          state.isLeaving = true;
          leavingHooks.afterLeave = () => {
            state.isLeaving = false;
            instance.update();
          };
          return emptyPlaceholder(child);
        } else if (mode === "in-out" && innerChild.type !== Comment) {
          leavingHooks.delayLeave = (el, earlyRemove, delayedLeave) => {
            const leavingVNodesCache = getLeavingNodesForType(state, oldInnerChild);
            leavingVNodesCache[String(oldInnerChild.key)] = oldInnerChild;
            el._leaveCb = () => {
              earlyRemove();
              el._leaveCb = void 0;
              delete enterHooks.delayedLeave;
            };
            enterHooks.delayedLeave = delayedLeave;
          };
        }
      }
      return child;
    };
  }
};
const BaseTransition = BaseTransitionImpl;
function getLeavingNodesForType(state, vnode) {
  const { leavingVNodes } = state;
  let leavingVNodesCache = leavingVNodes.get(vnode.type);
  if (!leavingVNodesCache) {
    leavingVNodesCache = /* @__PURE__ */ Object.create(null);
    leavingVNodes.set(vnode.type, leavingVNodesCache);
  }
  return leavingVNodesCache;
}
function resolveTransitionHooks(vnode, props, state, instance) {
  const { appear, mode, persisted = false, onBeforeEnter, onEnter, onAfterEnter, onEnterCancelled, onBeforeLeave, onLeave, onAfterLeave, onLeaveCancelled, onBeforeAppear, onAppear, onAfterAppear, onAppearCancelled } = props;
  const key = String(vnode.key);
  const leavingVNodesCache = getLeavingNodesForType(state, vnode);
  const callHook2 = (hook, args) => {
    hook && callWithAsyncErrorHandling(hook, instance, 9, args);
  };
  const callAsyncHook = (hook, args) => {
    const done = args[1];
    callHook2(hook, args);
    if (isArray(hook)) {
      if (hook.every((hook2) => hook2.length <= 1))
        done();
    } else if (hook.length <= 1) {
      done();
    }
  };
  const hooks = {
    mode,
    persisted,
    beforeEnter(el) {
      let hook = onBeforeEnter;
      if (!state.isMounted) {
        if (appear) {
          hook = onBeforeAppear || onBeforeEnter;
        } else {
          return;
        }
      }
      if (el._leaveCb) {
        el._leaveCb(true);
      }
      const leavingVNode = leavingVNodesCache[key];
      if (leavingVNode && isSameVNodeType(vnode, leavingVNode) && leavingVNode.el._leaveCb) {
        leavingVNode.el._leaveCb();
      }
      callHook2(hook, [el]);
    },
    enter(el) {
      let hook = onEnter;
      let afterHook = onAfterEnter;
      let cancelHook = onEnterCancelled;
      if (!state.isMounted) {
        if (appear) {
          hook = onAppear || onEnter;
          afterHook = onAfterAppear || onAfterEnter;
          cancelHook = onAppearCancelled || onEnterCancelled;
        } else {
          return;
        }
      }
      let called = false;
      const done = el._enterCb = (cancelled) => {
        if (called)
          return;
        called = true;
        if (cancelled) {
          callHook2(cancelHook, [el]);
        } else {
          callHook2(afterHook, [el]);
        }
        if (hooks.delayedLeave) {
          hooks.delayedLeave();
        }
        el._enterCb = void 0;
      };
      if (hook) {
        callAsyncHook(hook, [el, done]);
      } else {
        done();
      }
    },
    leave(el, remove2) {
      const key2 = String(vnode.key);
      if (el._enterCb) {
        el._enterCb(true);
      }
      if (state.isUnmounting) {
        return remove2();
      }
      callHook2(onBeforeLeave, [el]);
      let called = false;
      const done = el._leaveCb = (cancelled) => {
        if (called)
          return;
        called = true;
        remove2();
        if (cancelled) {
          callHook2(onLeaveCancelled, [el]);
        } else {
          callHook2(onAfterLeave, [el]);
        }
        el._leaveCb = void 0;
        if (leavingVNodesCache[key2] === vnode) {
          delete leavingVNodesCache[key2];
        }
      };
      leavingVNodesCache[key2] = vnode;
      if (onLeave) {
        callAsyncHook(onLeave, [el, done]);
      } else {
        done();
      }
    },
    clone(vnode2) {
      return resolveTransitionHooks(vnode2, props, state, instance);
    }
  };
  return hooks;
}
function emptyPlaceholder(vnode) {
  if (isKeepAlive(vnode)) {
    vnode = cloneVNode(vnode);
    vnode.children = null;
    return vnode;
  }
}
function getKeepAliveChild(vnode) {
  return isKeepAlive(vnode) ? vnode.children ? vnode.children[0] : void 0 : vnode;
}
function setTransitionHooks(vnode, hooks) {
  if (vnode.shapeFlag & 6 && vnode.component) {
    setTransitionHooks(vnode.component.subTree, hooks);
  } else if (vnode.shapeFlag & 128) {
    vnode.ssContent.transition = hooks.clone(vnode.ssContent);
    vnode.ssFallback.transition = hooks.clone(vnode.ssFallback);
  } else {
    vnode.transition = hooks;
  }
}
function getTransitionRawChildren(children, keepComment = false, parentKey) {
  let ret = [];
  let keyedFragmentCount = 0;
  for (let i = 0; i < children.length; i++) {
    let child = children[i];
    const key = parentKey == null ? child.key : String(parentKey) + String(child.key != null ? child.key : i);
    if (child.type === Fragment) {
      if (child.patchFlag & 128)
        keyedFragmentCount++;
      ret = ret.concat(getTransitionRawChildren(child.children, keepComment, key));
    } else if (keepComment || child.type !== Comment) {
      ret.push(key != null ? cloneVNode(child, { key }) : child);
    }
  }
  if (keyedFragmentCount > 1) {
    for (let i = 0; i < ret.length; i++) {
      ret[i].patchFlag = -2;
    }
  }
  return ret;
}
function defineComponent(options) {
  return isFunction(options) ? { setup: options, name: options.name } : options;
}
const isAsyncWrapper = (i) => !!i.type.__asyncLoader;
const isKeepAlive = (vnode) => vnode.type.__isKeepAlive;
function onActivated(hook, target) {
  registerKeepAliveHook(hook, "a", target);
}
function onDeactivated(hook, target) {
  registerKeepAliveHook(hook, "da", target);
}
function registerKeepAliveHook(hook, type, target = currentInstance) {
  const wrappedHook = hook.__wdc || (hook.__wdc = () => {
    let current = target;
    while (current) {
      if (current.isDeactivated) {
        return;
      }
      current = current.parent;
    }
    return hook();
  });
  injectHook(type, wrappedHook, target);
  if (target) {
    let current = target.parent;
    while (current && current.parent) {
      if (isKeepAlive(current.parent.vnode)) {
        injectToKeepAliveRoot(wrappedHook, type, target, current);
      }
      current = current.parent;
    }
  }
}
function injectToKeepAliveRoot(hook, type, target, keepAliveRoot) {
  const injected = injectHook(type, hook, keepAliveRoot, true);
  onUnmounted(() => {
    remove(keepAliveRoot[type], injected);
  }, target);
}
function injectHook(type, hook, target = currentInstance, prepend = false) {
  if (target) {
    const hooks = target[type] || (target[type] = []);
    const wrappedHook = hook.__weh || (hook.__weh = (...args) => {
      if (target.isUnmounted) {
        return;
      }
      pauseTracking();
      setCurrentInstance(target);
      const res = callWithAsyncErrorHandling(hook, target, type, args);
      unsetCurrentInstance();
      resetTracking();
      return res;
    });
    if (prepend) {
      hooks.unshift(wrappedHook);
    } else {
      hooks.push(wrappedHook);
    }
    return wrappedHook;
  }
}
const createHook = (lifecycle) => (hook, target = currentInstance) => (!isInSSRComponentSetup || lifecycle === "sp") && injectHook(lifecycle, hook, target);
const onBeforeMount = createHook("bm");
const onMounted = createHook("m");
const onBeforeUpdate = createHook("bu");
const onUpdated = createHook("u");
const onBeforeUnmount = createHook("bum");
const onUnmounted = createHook("um");
const onServerPrefetch = createHook("sp");
const onRenderTriggered = createHook("rtg");
const onRenderTracked = createHook("rtc");
function onErrorCaptured(hook, target = currentInstance) {
  injectHook("ec", hook, target);
}
function invokeDirectiveHook(vnode, prevVNode, instance, name) {
  const bindings = vnode.dirs;
  const oldBindings = prevVNode && prevVNode.dirs;
  for (let i = 0; i < bindings.length; i++) {
    const binding = bindings[i];
    if (oldBindings) {
      binding.oldValue = oldBindings[i].value;
    }
    let hook = binding.dir[name];
    if (hook) {
      pauseTracking();
      callWithAsyncErrorHandling(hook, instance, 8, [
        vnode.el,
        binding,
        vnode,
        prevVNode
      ]);
      resetTracking();
    }
  }
}
const NULL_DYNAMIC_COMPONENT = Symbol();
function renderList(source, renderItem, cache, index) {
  let ret;
  const cached = cache && cache[index];
  if (isArray(source) || isString(source)) {
    ret = new Array(source.length);
    for (let i = 0, l = source.length; i < l; i++) {
      ret[i] = renderItem(source[i], i, void 0, cached && cached[i]);
    }
  } else if (typeof source === "number") {
    ret = new Array(source);
    for (let i = 0; i < source; i++) {
      ret[i] = renderItem(i + 1, i, void 0, cached && cached[i]);
    }
  } else if (isObject(source)) {
    if (source[Symbol.iterator]) {
      ret = Array.from(source, (item, i) => renderItem(item, i, void 0, cached && cached[i]));
    } else {
      const keys = Object.keys(source);
      ret = new Array(keys.length);
      for (let i = 0, l = keys.length; i < l; i++) {
        const key = keys[i];
        ret[i] = renderItem(source[key], key, i, cached && cached[i]);
      }
    }
  } else {
    ret = [];
  }
  if (cache) {
    cache[index] = ret;
  }
  return ret;
}
function renderSlot(slots, name, props = {}, fallback, noSlotted) {
  if (currentRenderingInstance.isCE || currentRenderingInstance.parent && isAsyncWrapper(currentRenderingInstance.parent) && currentRenderingInstance.parent.isCE) {
    return createVNode("slot", name === "default" ? null : { name }, fallback && fallback());
  }
  let slot = slots[name];
  if (slot && slot._c) {
    slot._d = false;
  }
  openBlock();
  const validSlotContent = slot && ensureValidVNode(slot(props));
  const rendered = createBlock(Fragment, {
    key: props.key || validSlotContent && validSlotContent.key || `_${name}`
  }, validSlotContent || (fallback ? fallback() : []), validSlotContent && slots._ === 1 ? 64 : -2);
  if (!noSlotted && rendered.scopeId) {
    rendered.slotScopeIds = [rendered.scopeId + "-s"];
  }
  if (slot && slot._c) {
    slot._d = true;
  }
  return rendered;
}
function ensureValidVNode(vnodes) {
  return vnodes.some((child) => {
    if (!isVNode(child))
      return true;
    if (child.type === Comment)
      return false;
    if (child.type === Fragment && !ensureValidVNode(child.children))
      return false;
    return true;
  }) ? vnodes : null;
}
const getPublicInstance = (i) => {
  if (!i)
    return null;
  if (isStatefulComponent(i))
    return getExposeProxy(i) || i.proxy;
  return getPublicInstance(i.parent);
};
const publicPropertiesMap = /* @__PURE__ */ extend(/* @__PURE__ */ Object.create(null), {
  $: (i) => i,
  $el: (i) => i.vnode.el,
  $data: (i) => i.data,
  $props: (i) => i.props,
  $attrs: (i) => i.attrs,
  $slots: (i) => i.slots,
  $refs: (i) => i.refs,
  $parent: (i) => getPublicInstance(i.parent),
  $root: (i) => getPublicInstance(i.root),
  $emit: (i) => i.emit,
  $options: (i) => resolveMergedOptions(i),
  $forceUpdate: (i) => i.f || (i.f = () => queueJob(i.update)),
  $nextTick: (i) => i.n || (i.n = nextTick.bind(i.proxy)),
  $watch: (i) => instanceWatch.bind(i)
});
const PublicInstanceProxyHandlers = {
  get({ _: instance }, key) {
    const { ctx, setupState, data, props, accessCache, type, appContext } = instance;
    let normalizedProps;
    if (key[0] !== "$") {
      const n = accessCache[key];
      if (n !== void 0) {
        switch (n) {
          case 1:
            return setupState[key];
          case 2:
            return data[key];
          case 4:
            return ctx[key];
          case 3:
            return props[key];
        }
      } else if (setupState !== EMPTY_OBJ && hasOwn(setupState, key)) {
        accessCache[key] = 1;
        return setupState[key];
      } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
        accessCache[key] = 2;
        return data[key];
      } else if ((normalizedProps = instance.propsOptions[0]) && hasOwn(normalizedProps, key)) {
        accessCache[key] = 3;
        return props[key];
      } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
        accessCache[key] = 4;
        return ctx[key];
      } else if (shouldCacheAccess) {
        accessCache[key] = 0;
      }
    }
    const publicGetter = publicPropertiesMap[key];
    let cssModule, globalProperties;
    if (publicGetter) {
      if (key === "$attrs") {
        track(instance, "get", key);
      }
      return publicGetter(instance);
    } else if ((cssModule = type.__cssModules) && (cssModule = cssModule[key])) {
      return cssModule;
    } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
      accessCache[key] = 4;
      return ctx[key];
    } else if (globalProperties = appContext.config.globalProperties, hasOwn(globalProperties, key)) {
      {
        return globalProperties[key];
      }
    } else
      ;
  },
  set({ _: instance }, key, value) {
    const { data, setupState, ctx } = instance;
    if (setupState !== EMPTY_OBJ && hasOwn(setupState, key)) {
      setupState[key] = value;
      return true;
    } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
      data[key] = value;
      return true;
    } else if (hasOwn(instance.props, key)) {
      return false;
    }
    if (key[0] === "$" && key.slice(1) in instance) {
      return false;
    } else {
      {
        ctx[key] = value;
      }
    }
    return true;
  },
  has({ _: { data, setupState, accessCache, ctx, appContext, propsOptions } }, key) {
    let normalizedProps;
    return !!accessCache[key] || data !== EMPTY_OBJ && hasOwn(data, key) || setupState !== EMPTY_OBJ && hasOwn(setupState, key) || (normalizedProps = propsOptions[0]) && hasOwn(normalizedProps, key) || hasOwn(ctx, key) || hasOwn(publicPropertiesMap, key) || hasOwn(appContext.config.globalProperties, key);
  },
  defineProperty(target, key, descriptor) {
    if (descriptor.get != null) {
      target._.accessCache[key] = 0;
    } else if (hasOwn(descriptor, "value")) {
      this.set(target, key, descriptor.value, null);
    }
    return Reflect.defineProperty(target, key, descriptor);
  }
};
let shouldCacheAccess = true;
function applyOptions(instance) {
  const options = resolveMergedOptions(instance);
  const publicThis = instance.proxy;
  const ctx = instance.ctx;
  shouldCacheAccess = false;
  if (options.beforeCreate) {
    callHook(options.beforeCreate, instance, "bc");
  }
  const {
    data: dataOptions,
    computed: computedOptions,
    methods,
    watch: watchOptions,
    provide: provideOptions,
    inject: injectOptions,
    created,
    beforeMount,
    mounted,
    beforeUpdate,
    updated,
    activated,
    deactivated,
    beforeDestroy,
    beforeUnmount,
    destroyed,
    unmounted,
    render,
    renderTracked,
    renderTriggered,
    errorCaptured,
    serverPrefetch,
    expose,
    inheritAttrs,
    components,
    directives,
    filters
  } = options;
  const checkDuplicateProperties = null;
  if (injectOptions) {
    resolveInjections(injectOptions, ctx, checkDuplicateProperties, instance.appContext.config.unwrapInjectedRef);
  }
  if (methods) {
    for (const key in methods) {
      const methodHandler = methods[key];
      if (isFunction(methodHandler)) {
        {
          ctx[key] = methodHandler.bind(publicThis);
        }
      }
    }
  }
  if (dataOptions) {
    const data = dataOptions.call(publicThis, publicThis);
    if (!isObject(data))
      ;
    else {
      instance.data = reactive(data);
    }
  }
  shouldCacheAccess = true;
  if (computedOptions) {
    for (const key in computedOptions) {
      const opt = computedOptions[key];
      const get2 = isFunction(opt) ? opt.bind(publicThis, publicThis) : isFunction(opt.get) ? opt.get.bind(publicThis, publicThis) : NOOP;
      const set2 = !isFunction(opt) && isFunction(opt.set) ? opt.set.bind(publicThis) : NOOP;
      const c = computed({
        get: get2,
        set: set2
      });
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => c.value,
        set: (v) => c.value = v
      });
    }
  }
  if (watchOptions) {
    for (const key in watchOptions) {
      createWatcher(watchOptions[key], ctx, publicThis, key);
    }
  }
  if (provideOptions) {
    const provides = isFunction(provideOptions) ? provideOptions.call(publicThis) : provideOptions;
    Reflect.ownKeys(provides).forEach((key) => {
      provide(key, provides[key]);
    });
  }
  if (created) {
    callHook(created, instance, "c");
  }
  function registerLifecycleHook(register, hook) {
    if (isArray(hook)) {
      hook.forEach((_hook) => register(_hook.bind(publicThis)));
    } else if (hook) {
      register(hook.bind(publicThis));
    }
  }
  registerLifecycleHook(onBeforeMount, beforeMount);
  registerLifecycleHook(onMounted, mounted);
  registerLifecycleHook(onBeforeUpdate, beforeUpdate);
  registerLifecycleHook(onUpdated, updated);
  registerLifecycleHook(onActivated, activated);
  registerLifecycleHook(onDeactivated, deactivated);
  registerLifecycleHook(onErrorCaptured, errorCaptured);
  registerLifecycleHook(onRenderTracked, renderTracked);
  registerLifecycleHook(onRenderTriggered, renderTriggered);
  registerLifecycleHook(onBeforeUnmount, beforeUnmount);
  registerLifecycleHook(onUnmounted, unmounted);
  registerLifecycleHook(onServerPrefetch, serverPrefetch);
  if (isArray(expose)) {
    if (expose.length) {
      const exposed = instance.exposed || (instance.exposed = {});
      expose.forEach((key) => {
        Object.defineProperty(exposed, key, {
          get: () => publicThis[key],
          set: (val) => publicThis[key] = val
        });
      });
    } else if (!instance.exposed) {
      instance.exposed = {};
    }
  }
  if (render && instance.render === NOOP) {
    instance.render = render;
  }
  if (inheritAttrs != null) {
    instance.inheritAttrs = inheritAttrs;
  }
  if (components)
    instance.components = components;
  if (directives)
    instance.directives = directives;
}
function resolveInjections(injectOptions, ctx, checkDuplicateProperties = NOOP, unwrapRef = false) {
  if (isArray(injectOptions)) {
    injectOptions = normalizeInject(injectOptions);
  }
  for (const key in injectOptions) {
    const opt = injectOptions[key];
    let injected;
    if (isObject(opt)) {
      if ("default" in opt) {
        injected = inject(opt.from || key, opt.default, true);
      } else {
        injected = inject(opt.from || key);
      }
    } else {
      injected = inject(opt);
    }
    if (isRef(injected)) {
      if (unwrapRef) {
        Object.defineProperty(ctx, key, {
          enumerable: true,
          configurable: true,
          get: () => injected.value,
          set: (v) => injected.value = v
        });
      } else {
        ctx[key] = injected;
      }
    } else {
      ctx[key] = injected;
    }
  }
}
function callHook(hook, instance, type) {
  callWithAsyncErrorHandling(isArray(hook) ? hook.map((h) => h.bind(instance.proxy)) : hook.bind(instance.proxy), instance, type);
}
function createWatcher(raw, ctx, publicThis, key) {
  const getter = key.includes(".") ? createPathGetter(publicThis, key) : () => publicThis[key];
  if (isString(raw)) {
    const handler = ctx[raw];
    if (isFunction(handler)) {
      watch(getter, handler);
    }
  } else if (isFunction(raw)) {
    watch(getter, raw.bind(publicThis));
  } else if (isObject(raw)) {
    if (isArray(raw)) {
      raw.forEach((r) => createWatcher(r, ctx, publicThis, key));
    } else {
      const handler = isFunction(raw.handler) ? raw.handler.bind(publicThis) : ctx[raw.handler];
      if (isFunction(handler)) {
        watch(getter, handler, raw);
      }
    }
  } else
    ;
}
function resolveMergedOptions(instance) {
  const base = instance.type;
  const { mixins, extends: extendsOptions } = base;
  const { mixins: globalMixins, optionsCache: cache, config: { optionMergeStrategies } } = instance.appContext;
  const cached = cache.get(base);
  let resolved;
  if (cached) {
    resolved = cached;
  } else if (!globalMixins.length && !mixins && !extendsOptions) {
    {
      resolved = base;
    }
  } else {
    resolved = {};
    if (globalMixins.length) {
      globalMixins.forEach((m) => mergeOptions(resolved, m, optionMergeStrategies, true));
    }
    mergeOptions(resolved, base, optionMergeStrategies);
  }
  if (isObject(base)) {
    cache.set(base, resolved);
  }
  return resolved;
}
function mergeOptions(to, from, strats, asMixin = false) {
  const { mixins, extends: extendsOptions } = from;
  if (extendsOptions) {
    mergeOptions(to, extendsOptions, strats, true);
  }
  if (mixins) {
    mixins.forEach((m) => mergeOptions(to, m, strats, true));
  }
  for (const key in from) {
    if (asMixin && key === "expose")
      ;
    else {
      const strat = internalOptionMergeStrats[key] || strats && strats[key];
      to[key] = strat ? strat(to[key], from[key]) : from[key];
    }
  }
  return to;
}
const internalOptionMergeStrats = {
  data: mergeDataFn,
  props: mergeObjectOptions,
  emits: mergeObjectOptions,
  methods: mergeObjectOptions,
  computed: mergeObjectOptions,
  beforeCreate: mergeAsArray,
  created: mergeAsArray,
  beforeMount: mergeAsArray,
  mounted: mergeAsArray,
  beforeUpdate: mergeAsArray,
  updated: mergeAsArray,
  beforeDestroy: mergeAsArray,
  beforeUnmount: mergeAsArray,
  destroyed: mergeAsArray,
  unmounted: mergeAsArray,
  activated: mergeAsArray,
  deactivated: mergeAsArray,
  errorCaptured: mergeAsArray,
  serverPrefetch: mergeAsArray,
  components: mergeObjectOptions,
  directives: mergeObjectOptions,
  watch: mergeWatchOptions,
  provide: mergeDataFn,
  inject: mergeInject
};
function mergeDataFn(to, from) {
  if (!from) {
    return to;
  }
  if (!to) {
    return from;
  }
  return function mergedDataFn() {
    return extend(isFunction(to) ? to.call(this, this) : to, isFunction(from) ? from.call(this, this) : from);
  };
}
function mergeInject(to, from) {
  return mergeObjectOptions(normalizeInject(to), normalizeInject(from));
}
function normalizeInject(raw) {
  if (isArray(raw)) {
    const res = {};
    for (let i = 0; i < raw.length; i++) {
      res[raw[i]] = raw[i];
    }
    return res;
  }
  return raw;
}
function mergeAsArray(to, from) {
  return to ? [...new Set([].concat(to, from))] : from;
}
function mergeObjectOptions(to, from) {
  return to ? extend(extend(/* @__PURE__ */ Object.create(null), to), from) : from;
}
function mergeWatchOptions(to, from) {
  if (!to)
    return from;
  if (!from)
    return to;
  const merged = extend(/* @__PURE__ */ Object.create(null), to);
  for (const key in from) {
    merged[key] = mergeAsArray(to[key], from[key]);
  }
  return merged;
}
function initProps(instance, rawProps, isStateful, isSSR = false) {
  const props = {};
  const attrs = {};
  def(attrs, InternalObjectKey, 1);
  instance.propsDefaults = /* @__PURE__ */ Object.create(null);
  setFullProps(instance, rawProps, props, attrs);
  for (const key in instance.propsOptions[0]) {
    if (!(key in props)) {
      props[key] = void 0;
    }
  }
  if (isStateful) {
    instance.props = isSSR ? props : shallowReactive(props);
  } else {
    if (!instance.type.props) {
      instance.props = attrs;
    } else {
      instance.props = props;
    }
  }
  instance.attrs = attrs;
}
function updateProps(instance, rawProps, rawPrevProps, optimized) {
  const { props, attrs, vnode: { patchFlag } } = instance;
  const rawCurrentProps = toRaw(props);
  const [options] = instance.propsOptions;
  let hasAttrsChanged = false;
  if ((optimized || patchFlag > 0) && !(patchFlag & 16)) {
    if (patchFlag & 8) {
      const propsToUpdate = instance.vnode.dynamicProps;
      for (let i = 0; i < propsToUpdate.length; i++) {
        let key = propsToUpdate[i];
        if (isEmitListener(instance.emitsOptions, key)) {
          continue;
        }
        const value = rawProps[key];
        if (options) {
          if (hasOwn(attrs, key)) {
            if (value !== attrs[key]) {
              attrs[key] = value;
              hasAttrsChanged = true;
            }
          } else {
            const camelizedKey = camelize(key);
            props[camelizedKey] = resolvePropValue(options, rawCurrentProps, camelizedKey, value, instance, false);
          }
        } else {
          if (value !== attrs[key]) {
            attrs[key] = value;
            hasAttrsChanged = true;
          }
        }
      }
    }
  } else {
    if (setFullProps(instance, rawProps, props, attrs)) {
      hasAttrsChanged = true;
    }
    let kebabKey;
    for (const key in rawCurrentProps) {
      if (!rawProps || !hasOwn(rawProps, key) && ((kebabKey = hyphenate(key)) === key || !hasOwn(rawProps, kebabKey))) {
        if (options) {
          if (rawPrevProps && (rawPrevProps[key] !== void 0 || rawPrevProps[kebabKey] !== void 0)) {
            props[key] = resolvePropValue(options, rawCurrentProps, key, void 0, instance, true);
          }
        } else {
          delete props[key];
        }
      }
    }
    if (attrs !== rawCurrentProps) {
      for (const key in attrs) {
        if (!rawProps || !hasOwn(rawProps, key) && true) {
          delete attrs[key];
          hasAttrsChanged = true;
        }
      }
    }
  }
  if (hasAttrsChanged) {
    trigger(instance, "set", "$attrs");
  }
}
function setFullProps(instance, rawProps, props, attrs) {
  const [options, needCastKeys] = instance.propsOptions;
  let hasAttrsChanged = false;
  let rawCastValues;
  if (rawProps) {
    for (let key in rawProps) {
      if (isReservedProp(key)) {
        continue;
      }
      const value = rawProps[key];
      let camelKey;
      if (options && hasOwn(options, camelKey = camelize(key))) {
        if (!needCastKeys || !needCastKeys.includes(camelKey)) {
          props[camelKey] = value;
        } else {
          (rawCastValues || (rawCastValues = {}))[camelKey] = value;
        }
      } else if (!isEmitListener(instance.emitsOptions, key)) {
        if (!(key in attrs) || value !== attrs[key]) {
          attrs[key] = value;
          hasAttrsChanged = true;
        }
      }
    }
  }
  if (needCastKeys) {
    const rawCurrentProps = toRaw(props);
    const castValues = rawCastValues || EMPTY_OBJ;
    for (let i = 0; i < needCastKeys.length; i++) {
      const key = needCastKeys[i];
      props[key] = resolvePropValue(options, rawCurrentProps, key, castValues[key], instance, !hasOwn(castValues, key));
    }
  }
  return hasAttrsChanged;
}
function resolvePropValue(options, props, key, value, instance, isAbsent) {
  const opt = options[key];
  if (opt != null) {
    const hasDefault = hasOwn(opt, "default");
    if (hasDefault && value === void 0) {
      const defaultValue = opt.default;
      if (opt.type !== Function && isFunction(defaultValue)) {
        const { propsDefaults } = instance;
        if (key in propsDefaults) {
          value = propsDefaults[key];
        } else {
          setCurrentInstance(instance);
          value = propsDefaults[key] = defaultValue.call(null, props);
          unsetCurrentInstance();
        }
      } else {
        value = defaultValue;
      }
    }
    if (opt[0]) {
      if (isAbsent && !hasDefault) {
        value = false;
      } else if (opt[1] && (value === "" || value === hyphenate(key))) {
        value = true;
      }
    }
  }
  return value;
}
function normalizePropsOptions(comp, appContext, asMixin = false) {
  const cache = appContext.propsCache;
  const cached = cache.get(comp);
  if (cached) {
    return cached;
  }
  const raw = comp.props;
  const normalized = {};
  const needCastKeys = [];
  let hasExtends = false;
  if (!isFunction(comp)) {
    const extendProps = (raw2) => {
      hasExtends = true;
      const [props, keys] = normalizePropsOptions(raw2, appContext, true);
      extend(normalized, props);
      if (keys)
        needCastKeys.push(...keys);
    };
    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendProps);
    }
    if (comp.extends) {
      extendProps(comp.extends);
    }
    if (comp.mixins) {
      comp.mixins.forEach(extendProps);
    }
  }
  if (!raw && !hasExtends) {
    if (isObject(comp)) {
      cache.set(comp, EMPTY_ARR);
    }
    return EMPTY_ARR;
  }
  if (isArray(raw)) {
    for (let i = 0; i < raw.length; i++) {
      const normalizedKey = camelize(raw[i]);
      if (validatePropName(normalizedKey)) {
        normalized[normalizedKey] = EMPTY_OBJ;
      }
    }
  } else if (raw) {
    for (const key in raw) {
      const normalizedKey = camelize(key);
      if (validatePropName(normalizedKey)) {
        const opt = raw[key];
        const prop = normalized[normalizedKey] = isArray(opt) || isFunction(opt) ? { type: opt } : opt;
        if (prop) {
          const booleanIndex = getTypeIndex(Boolean, prop.type);
          const stringIndex = getTypeIndex(String, prop.type);
          prop[0] = booleanIndex > -1;
          prop[1] = stringIndex < 0 || booleanIndex < stringIndex;
          if (booleanIndex > -1 || hasOwn(prop, "default")) {
            needCastKeys.push(normalizedKey);
          }
        }
      }
    }
  }
  const res = [normalized, needCastKeys];
  if (isObject(comp)) {
    cache.set(comp, res);
  }
  return res;
}
function validatePropName(key) {
  if (key[0] !== "$") {
    return true;
  }
  return false;
}
function getType(ctor) {
  const match = ctor && ctor.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : ctor === null ? "null" : "";
}
function isSameType(a, b) {
  return getType(a) === getType(b);
}
function getTypeIndex(type, expectedTypes) {
  if (isArray(expectedTypes)) {
    return expectedTypes.findIndex((t) => isSameType(t, type));
  } else if (isFunction(expectedTypes)) {
    return isSameType(expectedTypes, type) ? 0 : -1;
  }
  return -1;
}
const isInternalKey = (key) => key[0] === "_" || key === "$stable";
const normalizeSlotValue = (value) => isArray(value) ? value.map(normalizeVNode) : [normalizeVNode(value)];
const normalizeSlot = (key, rawSlot, ctx) => {
  if (rawSlot._n) {
    return rawSlot;
  }
  const normalized = withCtx((...args) => {
    return normalizeSlotValue(rawSlot(...args));
  }, ctx);
  normalized._c = false;
  return normalized;
};
const normalizeObjectSlots = (rawSlots, slots, instance) => {
  const ctx = rawSlots._ctx;
  for (const key in rawSlots) {
    if (isInternalKey(key))
      continue;
    const value = rawSlots[key];
    if (isFunction(value)) {
      slots[key] = normalizeSlot(key, value, ctx);
    } else if (value != null) {
      const normalized = normalizeSlotValue(value);
      slots[key] = () => normalized;
    }
  }
};
const normalizeVNodeSlots = (instance, children) => {
  const normalized = normalizeSlotValue(children);
  instance.slots.default = () => normalized;
};
const initSlots = (instance, children) => {
  if (instance.vnode.shapeFlag & 32) {
    const type = children._;
    if (type) {
      instance.slots = toRaw(children);
      def(children, "_", type);
    } else {
      normalizeObjectSlots(children, instance.slots = {});
    }
  } else {
    instance.slots = {};
    if (children) {
      normalizeVNodeSlots(instance, children);
    }
  }
  def(instance.slots, InternalObjectKey, 1);
};
const updateSlots = (instance, children, optimized) => {
  const { vnode, slots } = instance;
  let needDeletionCheck = true;
  let deletionComparisonTarget = EMPTY_OBJ;
  if (vnode.shapeFlag & 32) {
    const type = children._;
    if (type) {
      if (optimized && type === 1) {
        needDeletionCheck = false;
      } else {
        extend(slots, children);
        if (!optimized && type === 1) {
          delete slots._;
        }
      }
    } else {
      needDeletionCheck = !children.$stable;
      normalizeObjectSlots(children, slots);
    }
    deletionComparisonTarget = children;
  } else if (children) {
    normalizeVNodeSlots(instance, children);
    deletionComparisonTarget = { default: 1 };
  }
  if (needDeletionCheck) {
    for (const key in slots) {
      if (!isInternalKey(key) && !(key in deletionComparisonTarget)) {
        delete slots[key];
      }
    }
  }
};
function createAppContext() {
  return {
    app: null,
    config: {
      isNativeTag: NO,
      performance: false,
      globalProperties: {},
      optionMergeStrategies: {},
      errorHandler: void 0,
      warnHandler: void 0,
      compilerOptions: {}
    },
    mixins: [],
    components: {},
    directives: {},
    provides: /* @__PURE__ */ Object.create(null),
    optionsCache: /* @__PURE__ */ new WeakMap(),
    propsCache: /* @__PURE__ */ new WeakMap(),
    emitsCache: /* @__PURE__ */ new WeakMap()
  };
}
let uid = 0;
function createAppAPI(render, hydrate) {
  return function createApp2(rootComponent, rootProps = null) {
    if (!isFunction(rootComponent)) {
      rootComponent = Object.assign({}, rootComponent);
    }
    if (rootProps != null && !isObject(rootProps)) {
      rootProps = null;
    }
    const context = createAppContext();
    const installedPlugins = /* @__PURE__ */ new Set();
    let isMounted = false;
    const app = context.app = {
      _uid: uid++,
      _component: rootComponent,
      _props: rootProps,
      _container: null,
      _context: context,
      _instance: null,
      version,
      get config() {
        return context.config;
      },
      set config(v) {
      },
      use(plugin, ...options) {
        if (installedPlugins.has(plugin))
          ;
        else if (plugin && isFunction(plugin.install)) {
          installedPlugins.add(plugin);
          plugin.install(app, ...options);
        } else if (isFunction(plugin)) {
          installedPlugins.add(plugin);
          plugin(app, ...options);
        } else
          ;
        return app;
      },
      mixin(mixin) {
        {
          if (!context.mixins.includes(mixin)) {
            context.mixins.push(mixin);
          }
        }
        return app;
      },
      component(name, component) {
        if (!component) {
          return context.components[name];
        }
        context.components[name] = component;
        return app;
      },
      directive(name, directive) {
        if (!directive) {
          return context.directives[name];
        }
        context.directives[name] = directive;
        return app;
      },
      mount(rootContainer, isHydrate, isSVG) {
        if (!isMounted) {
          const vnode = createVNode(rootComponent, rootProps);
          vnode.appContext = context;
          if (isHydrate && hydrate) {
            hydrate(vnode, rootContainer);
          } else {
            render(vnode, rootContainer, isSVG);
          }
          isMounted = true;
          app._container = rootContainer;
          rootContainer.__vue_app__ = app;
          return getExposeProxy(vnode.component) || vnode.component.proxy;
        }
      },
      unmount() {
        if (isMounted) {
          render(null, app._container);
          delete app._container.__vue_app__;
        }
      },
      provide(key, value) {
        context.provides[key] = value;
        return app;
      }
    };
    return app;
  };
}
function setRef(rawRef, oldRawRef, parentSuspense, vnode, isUnmount = false) {
  if (isArray(rawRef)) {
    rawRef.forEach((r, i) => setRef(r, oldRawRef && (isArray(oldRawRef) ? oldRawRef[i] : oldRawRef), parentSuspense, vnode, isUnmount));
    return;
  }
  if (isAsyncWrapper(vnode) && !isUnmount) {
    return;
  }
  const refValue = vnode.shapeFlag & 4 ? getExposeProxy(vnode.component) || vnode.component.proxy : vnode.el;
  const value = isUnmount ? null : refValue;
  const { i: owner, r: ref } = rawRef;
  const oldRef = oldRawRef && oldRawRef.r;
  const refs = owner.refs === EMPTY_OBJ ? owner.refs = {} : owner.refs;
  const setupState = owner.setupState;
  if (oldRef != null && oldRef !== ref) {
    if (isString(oldRef)) {
      refs[oldRef] = null;
      if (hasOwn(setupState, oldRef)) {
        setupState[oldRef] = null;
      }
    } else if (isRef(oldRef)) {
      oldRef.value = null;
    }
  }
  if (isFunction(ref)) {
    callWithErrorHandling(ref, owner, 12, [value, refs]);
  } else {
    const _isString = isString(ref);
    const _isRef = isRef(ref);
    if (_isString || _isRef) {
      const doSet = () => {
        if (rawRef.f) {
          const existing = _isString ? refs[ref] : ref.value;
          if (isUnmount) {
            isArray(existing) && remove(existing, refValue);
          } else {
            if (!isArray(existing)) {
              if (_isString) {
                refs[ref] = [refValue];
                if (hasOwn(setupState, ref)) {
                  setupState[ref] = refs[ref];
                }
              } else {
                ref.value = [refValue];
                if (rawRef.k)
                  refs[rawRef.k] = ref.value;
              }
            } else if (!existing.includes(refValue)) {
              existing.push(refValue);
            }
          }
        } else if (_isString) {
          refs[ref] = value;
          if (hasOwn(setupState, ref)) {
            setupState[ref] = value;
          }
        } else if (_isRef) {
          ref.value = value;
          if (rawRef.k)
            refs[rawRef.k] = value;
        } else
          ;
      };
      if (value) {
        doSet.id = -1;
        queuePostRenderEffect(doSet, parentSuspense);
      } else {
        doSet();
      }
    }
  }
}
const queuePostRenderEffect = queueEffectWithSuspense;
function createRenderer(options) {
  return baseCreateRenderer(options);
}
function baseCreateRenderer(options, createHydrationFns) {
  const target = getGlobalThis();
  target.__VUE__ = true;
  const { insert: hostInsert, remove: hostRemove, patchProp: hostPatchProp, createElement: hostCreateElement, createText: hostCreateText, createComment: hostCreateComment, setText: hostSetText, setElementText: hostSetElementText, parentNode: hostParentNode, nextSibling: hostNextSibling, setScopeId: hostSetScopeId = NOOP, cloneNode: hostCloneNode, insertStaticContent: hostInsertStaticContent } = options;
  const patch = (n1, n2, container, anchor = null, parentComponent = null, parentSuspense = null, isSVG = false, slotScopeIds = null, optimized = !!n2.dynamicChildren) => {
    if (n1 === n2) {
      return;
    }
    if (n1 && !isSameVNodeType(n1, n2)) {
      anchor = getNextHostNode(n1);
      unmount(n1, parentComponent, parentSuspense, true);
      n1 = null;
    }
    if (n2.patchFlag === -2) {
      optimized = false;
      n2.dynamicChildren = null;
    }
    const { type, ref, shapeFlag } = n2;
    switch (type) {
      case Text:
        processText(n1, n2, container, anchor);
        break;
      case Comment:
        processCommentNode(n1, n2, container, anchor);
        break;
      case Static:
        if (n1 == null) {
          mountStaticNode(n2, container, anchor, isSVG);
        }
        break;
      case Fragment:
        processFragment(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        break;
      default:
        if (shapeFlag & 1) {
          processElement(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        } else if (shapeFlag & 6) {
          processComponent(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        } else if (shapeFlag & 64) {
          type.process(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, internals);
        } else if (shapeFlag & 128) {
          type.process(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, internals);
        } else
          ;
    }
    if (ref != null && parentComponent) {
      setRef(ref, n1 && n1.ref, parentSuspense, n2 || n1, !n2);
    }
  };
  const processText = (n1, n2, container, anchor) => {
    if (n1 == null) {
      hostInsert(n2.el = hostCreateText(n2.children), container, anchor);
    } else {
      const el = n2.el = n1.el;
      if (n2.children !== n1.children) {
        hostSetText(el, n2.children);
      }
    }
  };
  const processCommentNode = (n1, n2, container, anchor) => {
    if (n1 == null) {
      hostInsert(n2.el = hostCreateComment(n2.children || ""), container, anchor);
    } else {
      n2.el = n1.el;
    }
  };
  const mountStaticNode = (n2, container, anchor, isSVG) => {
    [n2.el, n2.anchor] = hostInsertStaticContent(n2.children, container, anchor, isSVG, n2.el, n2.anchor);
  };
  const moveStaticNode = ({ el, anchor }, container, nextSibling) => {
    let next;
    while (el && el !== anchor) {
      next = hostNextSibling(el);
      hostInsert(el, container, nextSibling);
      el = next;
    }
    hostInsert(anchor, container, nextSibling);
  };
  const removeStaticNode = ({ el, anchor }) => {
    let next;
    while (el && el !== anchor) {
      next = hostNextSibling(el);
      hostRemove(el);
      el = next;
    }
    hostRemove(anchor);
  };
  const processElement = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    isSVG = isSVG || n2.type === "svg";
    if (n1 == null) {
      mountElement(n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
    } else {
      patchElement(n1, n2, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
    }
  };
  const mountElement = (vnode, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    let el;
    let vnodeHook;
    const { type, props, shapeFlag, transition, patchFlag, dirs } = vnode;
    if (vnode.el && hostCloneNode !== void 0 && patchFlag === -1) {
      el = vnode.el = hostCloneNode(vnode.el);
    } else {
      el = vnode.el = hostCreateElement(vnode.type, isSVG, props && props.is, props);
      if (shapeFlag & 8) {
        hostSetElementText(el, vnode.children);
      } else if (shapeFlag & 16) {
        mountChildren(vnode.children, el, null, parentComponent, parentSuspense, isSVG && type !== "foreignObject", slotScopeIds, optimized);
      }
      if (dirs) {
        invokeDirectiveHook(vnode, null, parentComponent, "created");
      }
      if (props) {
        for (const key in props) {
          if (key !== "value" && !isReservedProp(key)) {
            hostPatchProp(el, key, null, props[key], isSVG, vnode.children, parentComponent, parentSuspense, unmountChildren);
          }
        }
        if ("value" in props) {
          hostPatchProp(el, "value", null, props.value);
        }
        if (vnodeHook = props.onVnodeBeforeMount) {
          invokeVNodeHook(vnodeHook, parentComponent, vnode);
        }
      }
      setScopeId(el, vnode, vnode.scopeId, slotScopeIds, parentComponent);
    }
    if (dirs) {
      invokeDirectiveHook(vnode, null, parentComponent, "beforeMount");
    }
    const needCallTransitionHooks = (!parentSuspense || parentSuspense && !parentSuspense.pendingBranch) && transition && !transition.persisted;
    if (needCallTransitionHooks) {
      transition.beforeEnter(el);
    }
    hostInsert(el, container, anchor);
    if ((vnodeHook = props && props.onVnodeMounted) || needCallTransitionHooks || dirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
        needCallTransitionHooks && transition.enter(el);
        dirs && invokeDirectiveHook(vnode, null, parentComponent, "mounted");
      }, parentSuspense);
    }
  };
  const setScopeId = (el, vnode, scopeId, slotScopeIds, parentComponent) => {
    if (scopeId) {
      hostSetScopeId(el, scopeId);
    }
    if (slotScopeIds) {
      for (let i = 0; i < slotScopeIds.length; i++) {
        hostSetScopeId(el, slotScopeIds[i]);
      }
    }
    if (parentComponent) {
      let subTree = parentComponent.subTree;
      if (vnode === subTree) {
        const parentVNode = parentComponent.vnode;
        setScopeId(el, parentVNode, parentVNode.scopeId, parentVNode.slotScopeIds, parentComponent.parent);
      }
    }
  };
  const mountChildren = (children, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, start = 0) => {
    for (let i = start; i < children.length; i++) {
      const child = children[i] = optimized ? cloneIfMounted(children[i]) : normalizeVNode(children[i]);
      patch(null, child, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
    }
  };
  const patchElement = (n1, n2, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    const el = n2.el = n1.el;
    let { patchFlag, dynamicChildren, dirs } = n2;
    patchFlag |= n1.patchFlag & 16;
    const oldProps = n1.props || EMPTY_OBJ;
    const newProps = n2.props || EMPTY_OBJ;
    let vnodeHook;
    parentComponent && toggleRecurse(parentComponent, false);
    if (vnodeHook = newProps.onVnodeBeforeUpdate) {
      invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
    }
    if (dirs) {
      invokeDirectiveHook(n2, n1, parentComponent, "beforeUpdate");
    }
    parentComponent && toggleRecurse(parentComponent, true);
    const areChildrenSVG = isSVG && n2.type !== "foreignObject";
    if (dynamicChildren) {
      patchBlockChildren(n1.dynamicChildren, dynamicChildren, el, parentComponent, parentSuspense, areChildrenSVG, slotScopeIds);
    } else if (!optimized) {
      patchChildren(n1, n2, el, null, parentComponent, parentSuspense, areChildrenSVG, slotScopeIds, false);
    }
    if (patchFlag > 0) {
      if (patchFlag & 16) {
        patchProps(el, n2, oldProps, newProps, parentComponent, parentSuspense, isSVG);
      } else {
        if (patchFlag & 2) {
          if (oldProps.class !== newProps.class) {
            hostPatchProp(el, "class", null, newProps.class, isSVG);
          }
        }
        if (patchFlag & 4) {
          hostPatchProp(el, "style", oldProps.style, newProps.style, isSVG);
        }
        if (patchFlag & 8) {
          const propsToUpdate = n2.dynamicProps;
          for (let i = 0; i < propsToUpdate.length; i++) {
            const key = propsToUpdate[i];
            const prev = oldProps[key];
            const next = newProps[key];
            if (next !== prev || key === "value") {
              hostPatchProp(el, key, prev, next, isSVG, n1.children, parentComponent, parentSuspense, unmountChildren);
            }
          }
        }
      }
      if (patchFlag & 1) {
        if (n1.children !== n2.children) {
          hostSetElementText(el, n2.children);
        }
      }
    } else if (!optimized && dynamicChildren == null) {
      patchProps(el, n2, oldProps, newProps, parentComponent, parentSuspense, isSVG);
    }
    if ((vnodeHook = newProps.onVnodeUpdated) || dirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
        dirs && invokeDirectiveHook(n2, n1, parentComponent, "updated");
      }, parentSuspense);
    }
  };
  const patchBlockChildren = (oldChildren, newChildren, fallbackContainer, parentComponent, parentSuspense, isSVG, slotScopeIds) => {
    for (let i = 0; i < newChildren.length; i++) {
      const oldVNode = oldChildren[i];
      const newVNode = newChildren[i];
      const container = oldVNode.el && (oldVNode.type === Fragment || !isSameVNodeType(oldVNode, newVNode) || oldVNode.shapeFlag & (6 | 64)) ? hostParentNode(oldVNode.el) : fallbackContainer;
      patch(oldVNode, newVNode, container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, true);
    }
  };
  const patchProps = (el, vnode, oldProps, newProps, parentComponent, parentSuspense, isSVG) => {
    if (oldProps !== newProps) {
      for (const key in newProps) {
        if (isReservedProp(key))
          continue;
        const next = newProps[key];
        const prev = oldProps[key];
        if (next !== prev && key !== "value") {
          hostPatchProp(el, key, prev, next, isSVG, vnode.children, parentComponent, parentSuspense, unmountChildren);
        }
      }
      if (oldProps !== EMPTY_OBJ) {
        for (const key in oldProps) {
          if (!isReservedProp(key) && !(key in newProps)) {
            hostPatchProp(el, key, oldProps[key], null, isSVG, vnode.children, parentComponent, parentSuspense, unmountChildren);
          }
        }
      }
      if ("value" in newProps) {
        hostPatchProp(el, "value", oldProps.value, newProps.value);
      }
    }
  };
  const processFragment = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    const fragmentStartAnchor = n2.el = n1 ? n1.el : hostCreateText("");
    const fragmentEndAnchor = n2.anchor = n1 ? n1.anchor : hostCreateText("");
    let { patchFlag, dynamicChildren, slotScopeIds: fragmentSlotScopeIds } = n2;
    if (fragmentSlotScopeIds) {
      slotScopeIds = slotScopeIds ? slotScopeIds.concat(fragmentSlotScopeIds) : fragmentSlotScopeIds;
    }
    if (n1 == null) {
      hostInsert(fragmentStartAnchor, container, anchor);
      hostInsert(fragmentEndAnchor, container, anchor);
      mountChildren(n2.children, container, fragmentEndAnchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
    } else {
      if (patchFlag > 0 && patchFlag & 64 && dynamicChildren && n1.dynamicChildren) {
        patchBlockChildren(n1.dynamicChildren, dynamicChildren, container, parentComponent, parentSuspense, isSVG, slotScopeIds);
        if (n2.key != null || parentComponent && n2 === parentComponent.subTree) {
          traverseStaticChildren(n1, n2, true);
        }
      } else {
        patchChildren(n1, n2, container, fragmentEndAnchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
      }
    }
  };
  const processComponent = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    n2.slotScopeIds = slotScopeIds;
    if (n1 == null) {
      if (n2.shapeFlag & 512) {
        parentComponent.ctx.activate(n2, container, anchor, isSVG, optimized);
      } else {
        mountComponent(n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized);
      }
    } else {
      updateComponent(n1, n2, optimized);
    }
  };
  const mountComponent = (initialVNode, container, anchor, parentComponent, parentSuspense, isSVG, optimized) => {
    const instance = initialVNode.component = createComponentInstance(initialVNode, parentComponent, parentSuspense);
    if (isKeepAlive(initialVNode)) {
      instance.ctx.renderer = internals;
    }
    {
      setupComponent(instance);
    }
    if (instance.asyncDep) {
      parentSuspense && parentSuspense.registerDep(instance, setupRenderEffect);
      if (!initialVNode.el) {
        const placeholder = instance.subTree = createVNode(Comment);
        processCommentNode(null, placeholder, container, anchor);
      }
      return;
    }
    setupRenderEffect(instance, initialVNode, container, anchor, parentSuspense, isSVG, optimized);
  };
  const updateComponent = (n1, n2, optimized) => {
    const instance = n2.component = n1.component;
    if (shouldUpdateComponent(n1, n2, optimized)) {
      if (instance.asyncDep && !instance.asyncResolved) {
        updateComponentPreRender(instance, n2, optimized);
        return;
      } else {
        instance.next = n2;
        invalidateJob(instance.update);
        instance.update();
      }
    } else {
      n2.el = n1.el;
      instance.vnode = n2;
    }
  };
  const setupRenderEffect = (instance, initialVNode, container, anchor, parentSuspense, isSVG, optimized) => {
    const componentUpdateFn = () => {
      if (!instance.isMounted) {
        let vnodeHook;
        const { el, props } = initialVNode;
        const { bm, m, parent } = instance;
        const isAsyncWrapperVNode = isAsyncWrapper(initialVNode);
        toggleRecurse(instance, false);
        if (bm) {
          invokeArrayFns(bm);
        }
        if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeBeforeMount)) {
          invokeVNodeHook(vnodeHook, parent, initialVNode);
        }
        toggleRecurse(instance, true);
        if (el && hydrateNode) {
          const hydrateSubTree = () => {
            instance.subTree = renderComponentRoot(instance);
            hydrateNode(el, instance.subTree, instance, parentSuspense, null);
          };
          if (isAsyncWrapperVNode) {
            initialVNode.type.__asyncLoader().then(
              () => !instance.isUnmounted && hydrateSubTree()
            );
          } else {
            hydrateSubTree();
          }
        } else {
          const subTree = instance.subTree = renderComponentRoot(instance);
          patch(null, subTree, container, anchor, instance, parentSuspense, isSVG);
          initialVNode.el = subTree.el;
        }
        if (m) {
          queuePostRenderEffect(m, parentSuspense);
        }
        if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeMounted)) {
          const scopedInitialVNode = initialVNode;
          queuePostRenderEffect(() => invokeVNodeHook(vnodeHook, parent, scopedInitialVNode), parentSuspense);
        }
        if (initialVNode.shapeFlag & 256 || parent && isAsyncWrapper(parent.vnode) && parent.vnode.shapeFlag & 256) {
          instance.a && queuePostRenderEffect(instance.a, parentSuspense);
        }
        instance.isMounted = true;
        initialVNode = container = anchor = null;
      } else {
        let { next, bu, u, parent, vnode } = instance;
        let originNext = next;
        let vnodeHook;
        toggleRecurse(instance, false);
        if (next) {
          next.el = vnode.el;
          updateComponentPreRender(instance, next, optimized);
        } else {
          next = vnode;
        }
        if (bu) {
          invokeArrayFns(bu);
        }
        if (vnodeHook = next.props && next.props.onVnodeBeforeUpdate) {
          invokeVNodeHook(vnodeHook, parent, next, vnode);
        }
        toggleRecurse(instance, true);
        const nextTree = renderComponentRoot(instance);
        const prevTree = instance.subTree;
        instance.subTree = nextTree;
        patch(
          prevTree,
          nextTree,
          hostParentNode(prevTree.el),
          getNextHostNode(prevTree),
          instance,
          parentSuspense,
          isSVG
        );
        next.el = nextTree.el;
        if (originNext === null) {
          updateHOCHostEl(instance, nextTree.el);
        }
        if (u) {
          queuePostRenderEffect(u, parentSuspense);
        }
        if (vnodeHook = next.props && next.props.onVnodeUpdated) {
          queuePostRenderEffect(() => invokeVNodeHook(vnodeHook, parent, next, vnode), parentSuspense);
        }
      }
    };
    const effect = instance.effect = new ReactiveEffect(
      componentUpdateFn,
      () => queueJob(update),
      instance.scope
    );
    const update = instance.update = () => effect.run();
    update.id = instance.uid;
    toggleRecurse(instance, true);
    update();
  };
  const updateComponentPreRender = (instance, nextVNode, optimized) => {
    nextVNode.component = instance;
    const prevProps = instance.vnode.props;
    instance.vnode = nextVNode;
    instance.next = null;
    updateProps(instance, nextVNode.props, prevProps, optimized);
    updateSlots(instance, nextVNode.children, optimized);
    pauseTracking();
    flushPreFlushCbs();
    resetTracking();
  };
  const patchChildren = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized = false) => {
    const c1 = n1 && n1.children;
    const prevShapeFlag = n1 ? n1.shapeFlag : 0;
    const c2 = n2.children;
    const { patchFlag, shapeFlag } = n2;
    if (patchFlag > 0) {
      if (patchFlag & 128) {
        patchKeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        return;
      } else if (patchFlag & 256) {
        patchUnkeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        return;
      }
    }
    if (shapeFlag & 8) {
      if (prevShapeFlag & 16) {
        unmountChildren(c1, parentComponent, parentSuspense);
      }
      if (c2 !== c1) {
        hostSetElementText(container, c2);
      }
    } else {
      if (prevShapeFlag & 16) {
        if (shapeFlag & 16) {
          patchKeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        } else {
          unmountChildren(c1, parentComponent, parentSuspense, true);
        }
      } else {
        if (prevShapeFlag & 8) {
          hostSetElementText(container, "");
        }
        if (shapeFlag & 16) {
          mountChildren(c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        }
      }
    }
  };
  const patchUnkeyedChildren = (c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    c1 = c1 || EMPTY_ARR;
    c2 = c2 || EMPTY_ARR;
    const oldLength = c1.length;
    const newLength = c2.length;
    const commonLength = Math.min(oldLength, newLength);
    let i;
    for (i = 0; i < commonLength; i++) {
      const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
      patch(c1[i], nextChild, container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
    }
    if (oldLength > newLength) {
      unmountChildren(c1, parentComponent, parentSuspense, true, false, commonLength);
    } else {
      mountChildren(c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, commonLength);
    }
  };
  const patchKeyedChildren = (c1, c2, container, parentAnchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    let i = 0;
    const l2 = c2.length;
    let e1 = c1.length - 1;
    let e2 = l2 - 1;
    while (i <= e1 && i <= e2) {
      const n1 = c1[i];
      const n2 = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
      if (isSameVNodeType(n1, n2)) {
        patch(n1, n2, container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
      } else {
        break;
      }
      i++;
    }
    while (i <= e1 && i <= e2) {
      const n1 = c1[e1];
      const n2 = c2[e2] = optimized ? cloneIfMounted(c2[e2]) : normalizeVNode(c2[e2]);
      if (isSameVNodeType(n1, n2)) {
        patch(n1, n2, container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
      } else {
        break;
      }
      e1--;
      e2--;
    }
    if (i > e1) {
      if (i <= e2) {
        const nextPos = e2 + 1;
        const anchor = nextPos < l2 ? c2[nextPos].el : parentAnchor;
        while (i <= e2) {
          patch(null, c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]), container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
          i++;
        }
      }
    } else if (i > e2) {
      while (i <= e1) {
        unmount(c1[i], parentComponent, parentSuspense, true);
        i++;
      }
    } else {
      const s1 = i;
      const s2 = i;
      const keyToNewIndexMap = /* @__PURE__ */ new Map();
      for (i = s2; i <= e2; i++) {
        const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
        if (nextChild.key != null) {
          keyToNewIndexMap.set(nextChild.key, i);
        }
      }
      let j;
      let patched = 0;
      const toBePatched = e2 - s2 + 1;
      let moved = false;
      let maxNewIndexSoFar = 0;
      const newIndexToOldIndexMap = new Array(toBePatched);
      for (i = 0; i < toBePatched; i++)
        newIndexToOldIndexMap[i] = 0;
      for (i = s1; i <= e1; i++) {
        const prevChild = c1[i];
        if (patched >= toBePatched) {
          unmount(prevChild, parentComponent, parentSuspense, true);
          continue;
        }
        let newIndex;
        if (prevChild.key != null) {
          newIndex = keyToNewIndexMap.get(prevChild.key);
        } else {
          for (j = s2; j <= e2; j++) {
            if (newIndexToOldIndexMap[j - s2] === 0 && isSameVNodeType(prevChild, c2[j])) {
              newIndex = j;
              break;
            }
          }
        }
        if (newIndex === void 0) {
          unmount(prevChild, parentComponent, parentSuspense, true);
        } else {
          newIndexToOldIndexMap[newIndex - s2] = i + 1;
          if (newIndex >= maxNewIndexSoFar) {
            maxNewIndexSoFar = newIndex;
          } else {
            moved = true;
          }
          patch(prevChild, c2[newIndex], container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
          patched++;
        }
      }
      const increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : EMPTY_ARR;
      j = increasingNewIndexSequence.length - 1;
      for (i = toBePatched - 1; i >= 0; i--) {
        const nextIndex = s2 + i;
        const nextChild = c2[nextIndex];
        const anchor = nextIndex + 1 < l2 ? c2[nextIndex + 1].el : parentAnchor;
        if (newIndexToOldIndexMap[i] === 0) {
          patch(null, nextChild, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        } else if (moved) {
          if (j < 0 || i !== increasingNewIndexSequence[j]) {
            move(nextChild, container, anchor, 2);
          } else {
            j--;
          }
        }
      }
    }
  };
  const move = (vnode, container, anchor, moveType, parentSuspense = null) => {
    const { el, type, transition, children, shapeFlag } = vnode;
    if (shapeFlag & 6) {
      move(vnode.component.subTree, container, anchor, moveType);
      return;
    }
    if (shapeFlag & 128) {
      vnode.suspense.move(container, anchor, moveType);
      return;
    }
    if (shapeFlag & 64) {
      type.move(vnode, container, anchor, internals);
      return;
    }
    if (type === Fragment) {
      hostInsert(el, container, anchor);
      for (let i = 0; i < children.length; i++) {
        move(children[i], container, anchor, moveType);
      }
      hostInsert(vnode.anchor, container, anchor);
      return;
    }
    if (type === Static) {
      moveStaticNode(vnode, container, anchor);
      return;
    }
    const needTransition = moveType !== 2 && shapeFlag & 1 && transition;
    if (needTransition) {
      if (moveType === 0) {
        transition.beforeEnter(el);
        hostInsert(el, container, anchor);
        queuePostRenderEffect(() => transition.enter(el), parentSuspense);
      } else {
        const { leave, delayLeave, afterLeave } = transition;
        const remove3 = () => hostInsert(el, container, anchor);
        const performLeave = () => {
          leave(el, () => {
            remove3();
            afterLeave && afterLeave();
          });
        };
        if (delayLeave) {
          delayLeave(el, remove3, performLeave);
        } else {
          performLeave();
        }
      }
    } else {
      hostInsert(el, container, anchor);
    }
  };
  const unmount = (vnode, parentComponent, parentSuspense, doRemove = false, optimized = false) => {
    const { type, props, ref, children, dynamicChildren, shapeFlag, patchFlag, dirs } = vnode;
    if (ref != null) {
      setRef(ref, null, parentSuspense, vnode, true);
    }
    if (shapeFlag & 256) {
      parentComponent.ctx.deactivate(vnode);
      return;
    }
    const shouldInvokeDirs = shapeFlag & 1 && dirs;
    const shouldInvokeVnodeHook = !isAsyncWrapper(vnode);
    let vnodeHook;
    if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeBeforeUnmount)) {
      invokeVNodeHook(vnodeHook, parentComponent, vnode);
    }
    if (shapeFlag & 6) {
      unmountComponent(vnode.component, parentSuspense, doRemove);
    } else {
      if (shapeFlag & 128) {
        vnode.suspense.unmount(parentSuspense, doRemove);
        return;
      }
      if (shouldInvokeDirs) {
        invokeDirectiveHook(vnode, null, parentComponent, "beforeUnmount");
      }
      if (shapeFlag & 64) {
        vnode.type.remove(vnode, parentComponent, parentSuspense, optimized, internals, doRemove);
      } else if (dynamicChildren && (type !== Fragment || patchFlag > 0 && patchFlag & 64)) {
        unmountChildren(dynamicChildren, parentComponent, parentSuspense, false, true);
      } else if (type === Fragment && patchFlag & (128 | 256) || !optimized && shapeFlag & 16) {
        unmountChildren(children, parentComponent, parentSuspense);
      }
      if (doRemove) {
        remove2(vnode);
      }
    }
    if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeUnmounted) || shouldInvokeDirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
        shouldInvokeDirs && invokeDirectiveHook(vnode, null, parentComponent, "unmounted");
      }, parentSuspense);
    }
  };
  const remove2 = (vnode) => {
    const { type, el, anchor, transition } = vnode;
    if (type === Fragment) {
      {
        removeFragment(el, anchor);
      }
      return;
    }
    if (type === Static) {
      removeStaticNode(vnode);
      return;
    }
    const performRemove = () => {
      hostRemove(el);
      if (transition && !transition.persisted && transition.afterLeave) {
        transition.afterLeave();
      }
    };
    if (vnode.shapeFlag & 1 && transition && !transition.persisted) {
      const { leave, delayLeave } = transition;
      const performLeave = () => leave(el, performRemove);
      if (delayLeave) {
        delayLeave(vnode.el, performRemove, performLeave);
      } else {
        performLeave();
      }
    } else {
      performRemove();
    }
  };
  const removeFragment = (cur, end) => {
    let next;
    while (cur !== end) {
      next = hostNextSibling(cur);
      hostRemove(cur);
      cur = next;
    }
    hostRemove(end);
  };
  const unmountComponent = (instance, parentSuspense, doRemove) => {
    const { bum, scope, update, subTree, um } = instance;
    if (bum) {
      invokeArrayFns(bum);
    }
    scope.stop();
    if (update) {
      update.active = false;
      unmount(subTree, instance, parentSuspense, doRemove);
    }
    if (um) {
      queuePostRenderEffect(um, parentSuspense);
    }
    queuePostRenderEffect(() => {
      instance.isUnmounted = true;
    }, parentSuspense);
    if (parentSuspense && parentSuspense.pendingBranch && !parentSuspense.isUnmounted && instance.asyncDep && !instance.asyncResolved && instance.suspenseId === parentSuspense.pendingId) {
      parentSuspense.deps--;
      if (parentSuspense.deps === 0) {
        parentSuspense.resolve();
      }
    }
  };
  const unmountChildren = (children, parentComponent, parentSuspense, doRemove = false, optimized = false, start = 0) => {
    for (let i = start; i < children.length; i++) {
      unmount(children[i], parentComponent, parentSuspense, doRemove, optimized);
    }
  };
  const getNextHostNode = (vnode) => {
    if (vnode.shapeFlag & 6) {
      return getNextHostNode(vnode.component.subTree);
    }
    if (vnode.shapeFlag & 128) {
      return vnode.suspense.next();
    }
    return hostNextSibling(vnode.anchor || vnode.el);
  };
  const render = (vnode, container, isSVG) => {
    if (vnode == null) {
      if (container._vnode) {
        unmount(container._vnode, null, null, true);
      }
    } else {
      patch(container._vnode || null, vnode, container, null, null, null, isSVG);
    }
    flushPreFlushCbs();
    flushPostFlushCbs();
    container._vnode = vnode;
  };
  const internals = {
    p: patch,
    um: unmount,
    m: move,
    r: remove2,
    mt: mountComponent,
    mc: mountChildren,
    pc: patchChildren,
    pbc: patchBlockChildren,
    n: getNextHostNode,
    o: options
  };
  let hydrate;
  let hydrateNode;
  if (createHydrationFns) {
    [hydrate, hydrateNode] = createHydrationFns(internals);
  }
  return {
    render,
    hydrate,
    createApp: createAppAPI(render, hydrate)
  };
}
function toggleRecurse({ effect, update }, allowed) {
  effect.allowRecurse = update.allowRecurse = allowed;
}
function traverseStaticChildren(n1, n2, shallow = false) {
  const ch1 = n1.children;
  const ch2 = n2.children;
  if (isArray(ch1) && isArray(ch2)) {
    for (let i = 0; i < ch1.length; i++) {
      const c1 = ch1[i];
      let c2 = ch2[i];
      if (c2.shapeFlag & 1 && !c2.dynamicChildren) {
        if (c2.patchFlag <= 0 || c2.patchFlag === 32) {
          c2 = ch2[i] = cloneIfMounted(ch2[i]);
          c2.el = c1.el;
        }
        if (!shallow)
          traverseStaticChildren(c1, c2);
      }
    }
  }
}
function getSequence(arr) {
  const p2 = arr.slice();
  const result = [0];
  let i, j, u, v, c;
  const len = arr.length;
  for (i = 0; i < len; i++) {
    const arrI = arr[i];
    if (arrI !== 0) {
      j = result[result.length - 1];
      if (arr[j] < arrI) {
        p2[i] = j;
        result.push(i);
        continue;
      }
      u = 0;
      v = result.length - 1;
      while (u < v) {
        c = u + v >> 1;
        if (arr[result[c]] < arrI) {
          u = c + 1;
        } else {
          v = c;
        }
      }
      if (arrI < arr[result[u]]) {
        if (u > 0) {
          p2[i] = result[u - 1];
        }
        result[u] = i;
      }
    }
  }
  u = result.length;
  v = result[u - 1];
  while (u-- > 0) {
    result[u] = v;
    v = p2[v];
  }
  return result;
}
const isTeleport = (type) => type.__isTeleport;
const Fragment = Symbol(void 0);
const Text = Symbol(void 0);
const Comment = Symbol(void 0);
const Static = Symbol(void 0);
const blockStack = [];
let currentBlock = null;
function openBlock(disableTracking = false) {
  blockStack.push(currentBlock = disableTracking ? null : []);
}
function closeBlock() {
  blockStack.pop();
  currentBlock = blockStack[blockStack.length - 1] || null;
}
let isBlockTreeEnabled = 1;
function setBlockTracking(value) {
  isBlockTreeEnabled += value;
}
function setupBlock(vnode) {
  vnode.dynamicChildren = isBlockTreeEnabled > 0 ? currentBlock || EMPTY_ARR : null;
  closeBlock();
  if (isBlockTreeEnabled > 0 && currentBlock) {
    currentBlock.push(vnode);
  }
  return vnode;
}
function createElementBlock(type, props, children, patchFlag, dynamicProps, shapeFlag) {
  return setupBlock(createBaseVNode(type, props, children, patchFlag, dynamicProps, shapeFlag, true));
}
function createBlock(type, props, children, patchFlag, dynamicProps) {
  return setupBlock(createVNode(type, props, children, patchFlag, dynamicProps, true));
}
function isVNode(value) {
  return value ? value.__v_isVNode === true : false;
}
function isSameVNodeType(n1, n2) {
  return n1.type === n2.type && n1.key === n2.key;
}
const InternalObjectKey = `__vInternal`;
const normalizeKey = ({ key }) => key != null ? key : null;
const normalizeRef = ({ ref, ref_key, ref_for }) => {
  return ref != null ? isString(ref) || isRef(ref) || isFunction(ref) ? { i: currentRenderingInstance, r: ref, k: ref_key, f: !!ref_for } : ref : null;
};
function createBaseVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, shapeFlag = type === Fragment ? 0 : 1, isBlockNode = false, needFullChildrenNormalization = false) {
  const vnode = {
    __v_isVNode: true,
    __v_skip: true,
    type,
    props,
    key: props && normalizeKey(props),
    ref: props && normalizeRef(props),
    scopeId: currentScopeId,
    slotScopeIds: null,
    children,
    component: null,
    suspense: null,
    ssContent: null,
    ssFallback: null,
    dirs: null,
    transition: null,
    el: null,
    anchor: null,
    target: null,
    targetAnchor: null,
    staticCount: 0,
    shapeFlag,
    patchFlag,
    dynamicProps,
    dynamicChildren: null,
    appContext: null
  };
  if (needFullChildrenNormalization) {
    normalizeChildren(vnode, children);
    if (shapeFlag & 128) {
      type.normalize(vnode);
    }
  } else if (children) {
    vnode.shapeFlag |= isString(children) ? 8 : 16;
  }
  if (isBlockTreeEnabled > 0 && !isBlockNode && currentBlock && (vnode.patchFlag > 0 || shapeFlag & 6) && vnode.patchFlag !== 32) {
    currentBlock.push(vnode);
  }
  return vnode;
}
const createVNode = _createVNode;
function _createVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, isBlockNode = false) {
  if (!type || type === NULL_DYNAMIC_COMPONENT) {
    type = Comment;
  }
  if (isVNode(type)) {
    const cloned = cloneVNode(type, props, true);
    if (children) {
      normalizeChildren(cloned, children);
    }
    if (isBlockTreeEnabled > 0 && !isBlockNode && currentBlock) {
      if (cloned.shapeFlag & 6) {
        currentBlock[currentBlock.indexOf(type)] = cloned;
      } else {
        currentBlock.push(cloned);
      }
    }
    cloned.patchFlag |= -2;
    return cloned;
  }
  if (isClassComponent(type)) {
    type = type.__vccOpts;
  }
  if (props) {
    props = guardReactiveProps(props);
    let { class: klass, style: style2 } = props;
    if (klass && !isString(klass)) {
      props.class = normalizeClass(klass);
    }
    if (isObject(style2)) {
      if (isProxy(style2) && !isArray(style2)) {
        style2 = extend({}, style2);
      }
      props.style = normalizeStyle(style2);
    }
  }
  const shapeFlag = isString(type) ? 1 : isSuspense(type) ? 128 : isTeleport(type) ? 64 : isObject(type) ? 4 : isFunction(type) ? 2 : 0;
  return createBaseVNode(type, props, children, patchFlag, dynamicProps, shapeFlag, isBlockNode, true);
}
function guardReactiveProps(props) {
  if (!props)
    return null;
  return isProxy(props) || InternalObjectKey in props ? extend({}, props) : props;
}
function cloneVNode(vnode, extraProps, mergeRef = false) {
  const { props, ref, patchFlag, children } = vnode;
  const mergedProps = extraProps ? mergeProps(props || {}, extraProps) : props;
  const cloned = {
    __v_isVNode: true,
    __v_skip: true,
    type: vnode.type,
    props: mergedProps,
    key: mergedProps && normalizeKey(mergedProps),
    ref: extraProps && extraProps.ref ? mergeRef && ref ? isArray(ref) ? ref.concat(normalizeRef(extraProps)) : [ref, normalizeRef(extraProps)] : normalizeRef(extraProps) : ref,
    scopeId: vnode.scopeId,
    slotScopeIds: vnode.slotScopeIds,
    children,
    target: vnode.target,
    targetAnchor: vnode.targetAnchor,
    staticCount: vnode.staticCount,
    shapeFlag: vnode.shapeFlag,
    patchFlag: extraProps && vnode.type !== Fragment ? patchFlag === -1 ? 16 : patchFlag | 16 : patchFlag,
    dynamicProps: vnode.dynamicProps,
    dynamicChildren: vnode.dynamicChildren,
    appContext: vnode.appContext,
    dirs: vnode.dirs,
    transition: vnode.transition,
    component: vnode.component,
    suspense: vnode.suspense,
    ssContent: vnode.ssContent && cloneVNode(vnode.ssContent),
    ssFallback: vnode.ssFallback && cloneVNode(vnode.ssFallback),
    el: vnode.el,
    anchor: vnode.anchor
  };
  return cloned;
}
function createTextVNode(text = " ", flag = 0) {
  return createVNode(Text, null, text, flag);
}
function normalizeVNode(child) {
  if (child == null || typeof child === "boolean") {
    return createVNode(Comment);
  } else if (isArray(child)) {
    return createVNode(
      Fragment,
      null,
      child.slice()
    );
  } else if (typeof child === "object") {
    return cloneIfMounted(child);
  } else {
    return createVNode(Text, null, String(child));
  }
}
function cloneIfMounted(child) {
  return child.el === null || child.memo ? child : cloneVNode(child);
}
function normalizeChildren(vnode, children) {
  let type = 0;
  const { shapeFlag } = vnode;
  if (children == null) {
    children = null;
  } else if (isArray(children)) {
    type = 16;
  } else if (typeof children === "object") {
    if (shapeFlag & (1 | 64)) {
      const slot = children.default;
      if (slot) {
        slot._c && (slot._d = false);
        normalizeChildren(vnode, slot());
        slot._c && (slot._d = true);
      }
      return;
    } else {
      type = 32;
      const slotFlag = children._;
      if (!slotFlag && !(InternalObjectKey in children)) {
        children._ctx = currentRenderingInstance;
      } else if (slotFlag === 3 && currentRenderingInstance) {
        if (currentRenderingInstance.slots._ === 1) {
          children._ = 1;
        } else {
          children._ = 2;
          vnode.patchFlag |= 1024;
        }
      }
    }
  } else if (isFunction(children)) {
    children = { default: children, _ctx: currentRenderingInstance };
    type = 32;
  } else {
    children = String(children);
    if (shapeFlag & 64) {
      type = 16;
      children = [createTextVNode(children)];
    } else {
      type = 8;
    }
  }
  vnode.children = children;
  vnode.shapeFlag |= type;
}
function mergeProps(...args) {
  const ret = {};
  for (let i = 0; i < args.length; i++) {
    const toMerge = args[i];
    for (const key in toMerge) {
      if (key === "class") {
        if (ret.class !== toMerge.class) {
          ret.class = normalizeClass([ret.class, toMerge.class]);
        }
      } else if (key === "style") {
        ret.style = normalizeStyle([ret.style, toMerge.style]);
      } else if (isOn(key)) {
        const existing = ret[key];
        const incoming = toMerge[key];
        if (incoming && existing !== incoming && !(isArray(existing) && existing.includes(incoming))) {
          ret[key] = existing ? [].concat(existing, incoming) : incoming;
        }
      } else if (key !== "") {
        ret[key] = toMerge[key];
      }
    }
  }
  return ret;
}
function invokeVNodeHook(hook, instance, vnode, prevVNode = null) {
  callWithAsyncErrorHandling(hook, instance, 7, [
    vnode,
    prevVNode
  ]);
}
const emptyAppContext = createAppContext();
let uid$1 = 0;
function createComponentInstance(vnode, parent, suspense) {
  const type = vnode.type;
  const appContext = (parent ? parent.appContext : vnode.appContext) || emptyAppContext;
  const instance = {
    uid: uid$1++,
    vnode,
    type,
    parent,
    appContext,
    root: null,
    next: null,
    subTree: null,
    effect: null,
    update: null,
    scope: new EffectScope(true),
    render: null,
    proxy: null,
    exposed: null,
    exposeProxy: null,
    withProxy: null,
    provides: parent ? parent.provides : Object.create(appContext.provides),
    accessCache: null,
    renderCache: [],
    components: null,
    directives: null,
    propsOptions: normalizePropsOptions(type, appContext),
    emitsOptions: normalizeEmitsOptions(type, appContext),
    emit: null,
    emitted: null,
    propsDefaults: EMPTY_OBJ,
    inheritAttrs: type.inheritAttrs,
    ctx: EMPTY_OBJ,
    data: EMPTY_OBJ,
    props: EMPTY_OBJ,
    attrs: EMPTY_OBJ,
    slots: EMPTY_OBJ,
    refs: EMPTY_OBJ,
    setupState: EMPTY_OBJ,
    setupContext: null,
    suspense,
    suspenseId: suspense ? suspense.pendingId : 0,
    asyncDep: null,
    asyncResolved: false,
    isMounted: false,
    isUnmounted: false,
    isDeactivated: false,
    bc: null,
    c: null,
    bm: null,
    m: null,
    bu: null,
    u: null,
    um: null,
    bum: null,
    da: null,
    a: null,
    rtg: null,
    rtc: null,
    ec: null,
    sp: null
  };
  {
    instance.ctx = { _: instance };
  }
  instance.root = parent ? parent.root : instance;
  instance.emit = emit$1.bind(null, instance);
  if (vnode.ce) {
    vnode.ce(instance);
  }
  return instance;
}
let currentInstance = null;
const getCurrentInstance = () => currentInstance || currentRenderingInstance;
const setCurrentInstance = (instance) => {
  currentInstance = instance;
  instance.scope.on();
};
const unsetCurrentInstance = () => {
  currentInstance && currentInstance.scope.off();
  currentInstance = null;
};
function isStatefulComponent(instance) {
  return instance.vnode.shapeFlag & 4;
}
let isInSSRComponentSetup = false;
function setupComponent(instance, isSSR = false) {
  isInSSRComponentSetup = isSSR;
  const { props, children } = instance.vnode;
  const isStateful = isStatefulComponent(instance);
  initProps(instance, props, isStateful, isSSR);
  initSlots(instance, children);
  const setupResult = isStateful ? setupStatefulComponent(instance, isSSR) : void 0;
  isInSSRComponentSetup = false;
  return setupResult;
}
function setupStatefulComponent(instance, isSSR) {
  const Component = instance.type;
  instance.accessCache = /* @__PURE__ */ Object.create(null);
  instance.proxy = markRaw(new Proxy(instance.ctx, PublicInstanceProxyHandlers));
  const { setup } = Component;
  if (setup) {
    const setupContext = instance.setupContext = setup.length > 1 ? createSetupContext(instance) : null;
    setCurrentInstance(instance);
    pauseTracking();
    const setupResult = callWithErrorHandling(setup, instance, 0, [instance.props, setupContext]);
    resetTracking();
    unsetCurrentInstance();
    if (isPromise(setupResult)) {
      setupResult.then(unsetCurrentInstance, unsetCurrentInstance);
      if (isSSR) {
        return setupResult.then((resolvedResult) => {
          handleSetupResult(instance, resolvedResult, isSSR);
        }).catch((e) => {
          handleError(e, instance, 0);
        });
      } else {
        instance.asyncDep = setupResult;
      }
    } else {
      handleSetupResult(instance, setupResult, isSSR);
    }
  } else {
    finishComponentSetup(instance, isSSR);
  }
}
function handleSetupResult(instance, setupResult, isSSR) {
  if (isFunction(setupResult)) {
    if (instance.type.__ssrInlineRender) {
      instance.ssrRender = setupResult;
    } else {
      instance.render = setupResult;
    }
  } else if (isObject(setupResult)) {
    instance.setupState = proxyRefs(setupResult);
  } else
    ;
  finishComponentSetup(instance, isSSR);
}
let compile;
function finishComponentSetup(instance, isSSR, skipOptions) {
  const Component = instance.type;
  if (!instance.render) {
    if (!isSSR && compile && !Component.render) {
      const template = Component.template || resolveMergedOptions(instance).template;
      if (template) {
        const { isCustomElement, compilerOptions } = instance.appContext.config;
        const { delimiters, compilerOptions: componentCompilerOptions } = Component;
        const finalCompilerOptions = extend(extend({
          isCustomElement,
          delimiters
        }, compilerOptions), componentCompilerOptions);
        Component.render = compile(template, finalCompilerOptions);
      }
    }
    instance.render = Component.render || NOOP;
  }
  {
    setCurrentInstance(instance);
    pauseTracking();
    applyOptions(instance);
    resetTracking();
    unsetCurrentInstance();
  }
}
function createAttrsProxy(instance) {
  return new Proxy(instance.attrs, {
    get(target, key) {
      track(instance, "get", "$attrs");
      return target[key];
    }
  });
}
function createSetupContext(instance) {
  const expose = (exposed) => {
    instance.exposed = exposed || {};
  };
  let attrs;
  {
    return {
      get attrs() {
        return attrs || (attrs = createAttrsProxy(instance));
      },
      slots: instance.slots,
      emit: instance.emit,
      expose
    };
  }
}
function getExposeProxy(instance) {
  if (instance.exposed) {
    return instance.exposeProxy || (instance.exposeProxy = new Proxy(proxyRefs(markRaw(instance.exposed)), {
      get(target, key) {
        if (key in target) {
          return target[key];
        } else if (key in publicPropertiesMap) {
          return publicPropertiesMap[key](instance);
        }
      }
    }));
  }
}
function isClassComponent(value) {
  return isFunction(value) && "__vccOpts" in value;
}
const computed = (getterOrOptions, debugOptions) => {
  return computed$1(getterOrOptions, debugOptions, isInSSRComponentSetup);
};
const version = "3.2.39";
const svgNS = "http://www.w3.org/2000/svg";
const doc = typeof document !== "undefined" ? document : null;
const templateContainer = doc && /* @__PURE__ */ doc.createElement("template");
const nodeOps = {
  insert: (child, parent, anchor) => {
    parent.insertBefore(child, anchor || null);
  },
  remove: (child) => {
    const parent = child.parentNode;
    if (parent) {
      parent.removeChild(child);
    }
  },
  createElement: (tag, isSVG, is, props) => {
    const el = isSVG ? doc.createElementNS(svgNS, tag) : doc.createElement(tag, is ? { is } : void 0);
    if (tag === "select" && props && props.multiple != null) {
      el.setAttribute("multiple", props.multiple);
    }
    return el;
  },
  createText: (text) => doc.createTextNode(text),
  createComment: (text) => doc.createComment(text),
  setText: (node, text) => {
    node.nodeValue = text;
  },
  setElementText: (el, text) => {
    el.textContent = text;
  },
  parentNode: (node) => node.parentNode,
  nextSibling: (node) => node.nextSibling,
  querySelector: (selector) => doc.querySelector(selector),
  setScopeId(el, id) {
    el.setAttribute(id, "");
  },
  cloneNode(el) {
    const cloned = el.cloneNode(true);
    if (`_value` in el) {
      cloned._value = el._value;
    }
    return cloned;
  },
  insertStaticContent(content, parent, anchor, isSVG, start, end) {
    const before = anchor ? anchor.previousSibling : parent.lastChild;
    if (start && (start === end || start.nextSibling)) {
      while (true) {
        parent.insertBefore(start.cloneNode(true), anchor);
        if (start === end || !(start = start.nextSibling))
          break;
      }
    } else {
      templateContainer.innerHTML = isSVG ? `<svg>${content}</svg>` : content;
      const template = templateContainer.content;
      if (isSVG) {
        const wrapper = template.firstChild;
        while (wrapper.firstChild) {
          template.appendChild(wrapper.firstChild);
        }
        template.removeChild(wrapper);
      }
      parent.insertBefore(template, anchor);
    }
    return [
      before ? before.nextSibling : parent.firstChild,
      anchor ? anchor.previousSibling : parent.lastChild
    ];
  }
};
function patchClass(el, value, isSVG) {
  const transitionClasses = el._vtc;
  if (transitionClasses) {
    value = (value ? [value, ...transitionClasses] : [...transitionClasses]).join(" ");
  }
  if (value == null) {
    el.removeAttribute("class");
  } else if (isSVG) {
    el.setAttribute("class", value);
  } else {
    el.className = value;
  }
}
function patchStyle(el, prev, next) {
  const style2 = el.style;
  const isCssString = isString(next);
  if (next && !isCssString) {
    for (const key in next) {
      setStyle(style2, key, next[key]);
    }
    if (prev && !isString(prev)) {
      for (const key in prev) {
        if (next[key] == null) {
          setStyle(style2, key, "");
        }
      }
    }
  } else {
    const currentDisplay = style2.display;
    if (isCssString) {
      if (prev !== next) {
        style2.cssText = next;
      }
    } else if (prev) {
      el.removeAttribute("style");
    }
    if ("_vod" in el) {
      style2.display = currentDisplay;
    }
  }
}
const importantRE = /\s*!important$/;
function setStyle(style2, name, val) {
  if (isArray(val)) {
    val.forEach((v) => setStyle(style2, name, v));
  } else {
    if (val == null)
      val = "";
    if (name.startsWith("--")) {
      style2.setProperty(name, val);
    } else {
      const prefixed = autoPrefix(style2, name);
      if (importantRE.test(val)) {
        style2.setProperty(hyphenate(prefixed), val.replace(importantRE, ""), "important");
      } else {
        style2[prefixed] = val;
      }
    }
  }
}
const prefixes = ["Webkit", "Moz", "ms"];
const prefixCache = {};
function autoPrefix(style2, rawName) {
  const cached = prefixCache[rawName];
  if (cached) {
    return cached;
  }
  let name = camelize(rawName);
  if (name !== "filter" && name in style2) {
    return prefixCache[rawName] = name;
  }
  name = capitalize(name);
  for (let i = 0; i < prefixes.length; i++) {
    const prefixed = prefixes[i] + name;
    if (prefixed in style2) {
      return prefixCache[rawName] = prefixed;
    }
  }
  return rawName;
}
const xlinkNS = "http://www.w3.org/1999/xlink";
function patchAttr(el, key, value, isSVG, instance) {
  if (isSVG && key.startsWith("xlink:")) {
    if (value == null) {
      el.removeAttributeNS(xlinkNS, key.slice(6, key.length));
    } else {
      el.setAttributeNS(xlinkNS, key, value);
    }
  } else {
    const isBoolean = isSpecialBooleanAttr(key);
    if (value == null || isBoolean && !includeBooleanAttr(value)) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, isBoolean ? "" : value);
    }
  }
}
function patchDOMProp(el, key, value, prevChildren, parentComponent, parentSuspense, unmountChildren) {
  if (key === "innerHTML" || key === "textContent") {
    if (prevChildren) {
      unmountChildren(prevChildren, parentComponent, parentSuspense);
    }
    el[key] = value == null ? "" : value;
    return;
  }
  if (key === "value" && el.tagName !== "PROGRESS" && !el.tagName.includes("-")) {
    el._value = value;
    const newValue = value == null ? "" : value;
    if (el.value !== newValue || el.tagName === "OPTION") {
      el.value = newValue;
    }
    if (value == null) {
      el.removeAttribute(key);
    }
    return;
  }
  let needRemove = false;
  if (value === "" || value == null) {
    const type = typeof el[key];
    if (type === "boolean") {
      value = includeBooleanAttr(value);
    } else if (value == null && type === "string") {
      value = "";
      needRemove = true;
    } else if (type === "number") {
      value = 0;
      needRemove = true;
    }
  }
  try {
    el[key] = value;
  } catch (e) {
  }
  needRemove && el.removeAttribute(key);
}
const [_getNow, skipTimestampCheck] = /* @__PURE__ */ (() => {
  let _getNow2 = Date.now;
  let skipTimestampCheck2 = false;
  if (typeof window !== "undefined") {
    if (Date.now() > document.createEvent("Event").timeStamp) {
      _getNow2 = performance.now.bind(performance);
    }
    const ffMatch = navigator.userAgent.match(/firefox\/(\d+)/i);
    skipTimestampCheck2 = !!(ffMatch && Number(ffMatch[1]) <= 53);
  }
  return [_getNow2, skipTimestampCheck2];
})();
let cachedNow = 0;
const p = /* @__PURE__ */ Promise.resolve();
const reset = () => {
  cachedNow = 0;
};
const getNow = () => cachedNow || (p.then(reset), cachedNow = _getNow());
function addEventListener(el, event, handler, options) {
  el.addEventListener(event, handler, options);
}
function removeEventListener(el, event, handler, options) {
  el.removeEventListener(event, handler, options);
}
function patchEvent(el, rawName, prevValue, nextValue, instance = null) {
  const invokers = el._vei || (el._vei = {});
  const existingInvoker = invokers[rawName];
  if (nextValue && existingInvoker) {
    existingInvoker.value = nextValue;
  } else {
    const [name, options] = parseName(rawName);
    if (nextValue) {
      const invoker = invokers[rawName] = createInvoker(nextValue, instance);
      addEventListener(el, name, invoker, options);
    } else if (existingInvoker) {
      removeEventListener(el, name, existingInvoker, options);
      invokers[rawName] = void 0;
    }
  }
}
const optionsModifierRE = /(?:Once|Passive|Capture)$/;
function parseName(name) {
  let options;
  if (optionsModifierRE.test(name)) {
    options = {};
    let m;
    while (m = name.match(optionsModifierRE)) {
      name = name.slice(0, name.length - m[0].length);
      options[m[0].toLowerCase()] = true;
    }
  }
  const event = name[2] === ":" ? name.slice(3) : hyphenate(name.slice(2));
  return [event, options];
}
function createInvoker(initialValue, instance) {
  const invoker = (e) => {
    const timeStamp = e.timeStamp || _getNow();
    if (skipTimestampCheck || timeStamp >= invoker.attached - 1) {
      callWithAsyncErrorHandling(patchStopImmediatePropagation(e, invoker.value), instance, 5, [e]);
    }
  };
  invoker.value = initialValue;
  invoker.attached = getNow();
  return invoker;
}
function patchStopImmediatePropagation(e, value) {
  if (isArray(value)) {
    const originalStop = e.stopImmediatePropagation;
    e.stopImmediatePropagation = () => {
      originalStop.call(e);
      e._stopped = true;
    };
    return value.map((fn) => (e2) => !e2._stopped && fn && fn(e2));
  } else {
    return value;
  }
}
const nativeOnRE = /^on[a-z]/;
const patchProp = (el, key, prevValue, nextValue, isSVG = false, prevChildren, parentComponent, parentSuspense, unmountChildren) => {
  if (key === "class") {
    patchClass(el, nextValue, isSVG);
  } else if (key === "style") {
    patchStyle(el, prevValue, nextValue);
  } else if (isOn(key)) {
    if (!isModelListener(key)) {
      patchEvent(el, key, prevValue, nextValue, parentComponent);
    }
  } else if (key[0] === "." ? (key = key.slice(1), true) : key[0] === "^" ? (key = key.slice(1), false) : shouldSetAsProp(el, key, nextValue, isSVG)) {
    patchDOMProp(el, key, nextValue, prevChildren, parentComponent, parentSuspense, unmountChildren);
  } else {
    if (key === "true-value") {
      el._trueValue = nextValue;
    } else if (key === "false-value") {
      el._falseValue = nextValue;
    }
    patchAttr(el, key, nextValue, isSVG);
  }
};
function shouldSetAsProp(el, key, value, isSVG) {
  if (isSVG) {
    if (key === "innerHTML" || key === "textContent") {
      return true;
    }
    if (key in el && nativeOnRE.test(key) && isFunction(value)) {
      return true;
    }
    return false;
  }
  if (key === "spellcheck" || key === "draggable" || key === "translate") {
    return false;
  }
  if (key === "form") {
    return false;
  }
  if (key === "list" && el.tagName === "INPUT") {
    return false;
  }
  if (key === "type" && el.tagName === "TEXTAREA") {
    return false;
  }
  if (nativeOnRE.test(key) && isString(value)) {
    return false;
  }
  return key in el;
}
const DOMTransitionPropsValidators = {
  name: String,
  type: String,
  css: {
    type: Boolean,
    default: true
  },
  duration: [String, Number, Object],
  enterFromClass: String,
  enterActiveClass: String,
  enterToClass: String,
  appearFromClass: String,
  appearActiveClass: String,
  appearToClass: String,
  leaveFromClass: String,
  leaveActiveClass: String,
  leaveToClass: String
};
/* @__PURE__ */ extend({}, BaseTransition.props, DOMTransitionPropsValidators);
const rendererOptions = /* @__PURE__ */ extend({ patchProp }, nodeOps);
let renderer;
function ensureRenderer() {
  return renderer || (renderer = createRenderer(rendererOptions));
}
const createApp = (...args) => {
  const app = ensureRenderer().createApp(...args);
  const { mount } = app;
  app.mount = (containerOrSelector) => {
    const container = normalizeContainer(containerOrSelector);
    if (!container)
      return;
    const component = app._component;
    if (!isFunction(component) && !component.render && !component.template) {
      component.template = container.innerHTML;
    }
    container.innerHTML = "";
    const proxy = mount(container, false, container instanceof SVGElement);
    if (container instanceof Element) {
      container.removeAttribute("v-cloak");
      container.setAttribute("data-v-app", "");
    }
    return proxy;
  };
  return app;
};
function normalizeContainer(container) {
  if (isString(container)) {
    const res = document.querySelector(container);
    return res;
  }
  return container;
}
const style = "";
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
var tweakpane = { exports: {} };
/*! Tweakpane 3.1.0 (c) 2016 cocopon, licensed under the MIT license. */
(function(module, exports) {
  (function(global2, factory) {
    factory(exports);
  })(commonjsGlobal, function(exports2) {
    class Semver {
      constructor(text) {
        const [core, prerelease] = text.split("-");
        const coreComps = core.split(".");
        this.major = parseInt(coreComps[0], 10);
        this.minor = parseInt(coreComps[1], 10);
        this.patch = parseInt(coreComps[2], 10);
        this.prerelease = prerelease !== null && prerelease !== void 0 ? prerelease : null;
      }
      toString() {
        const core = [this.major, this.minor, this.patch].join(".");
        return this.prerelease !== null ? [core, this.prerelease].join("-") : core;
      }
    }
    class BladeApi {
      constructor(controller) {
        this.controller_ = controller;
      }
      get element() {
        return this.controller_.view.element;
      }
      get disabled() {
        return this.controller_.viewProps.get("disabled");
      }
      set disabled(disabled) {
        this.controller_.viewProps.set("disabled", disabled);
      }
      get hidden() {
        return this.controller_.viewProps.get("hidden");
      }
      set hidden(hidden) {
        this.controller_.viewProps.set("hidden", hidden);
      }
      dispose() {
        this.controller_.viewProps.set("disposed", true);
      }
    }
    class TpEvent {
      constructor(target) {
        this.target = target;
      }
    }
    class TpChangeEvent extends TpEvent {
      constructor(target, value, presetKey, last) {
        super(target);
        this.value = value;
        this.presetKey = presetKey;
        this.last = last !== null && last !== void 0 ? last : true;
      }
    }
    class TpUpdateEvent extends TpEvent {
      constructor(target, value, presetKey) {
        super(target);
        this.value = value;
        this.presetKey = presetKey;
      }
    }
    class TpFoldEvent extends TpEvent {
      constructor(target, expanded) {
        super(target);
        this.expanded = expanded;
      }
    }
    class TpTabSelectEvent extends TpEvent {
      constructor(target, index) {
        super(target);
        this.index = index;
      }
    }
    function forceCast(v) {
      return v;
    }
    function isEmpty(value) {
      return value === null || value === void 0;
    }
    function deepEqualsArray(a1, a2) {
      if (a1.length !== a2.length) {
        return false;
      }
      for (let i = 0; i < a1.length; i++) {
        if (a1[i] !== a2[i]) {
          return false;
        }
      }
      return true;
    }
    const CREATE_MESSAGE_MAP = {
      alreadydisposed: () => "View has been already disposed",
      invalidparams: (context) => `Invalid parameters for '${context.name}'`,
      nomatchingcontroller: (context) => `No matching controller for '${context.key}'`,
      nomatchingview: (context) => `No matching view for '${JSON.stringify(context.params)}'`,
      notbindable: () => `Value is not bindable`,
      propertynotfound: (context) => `Property '${context.name}' not found`,
      shouldneverhappen: () => "This error should never happen"
    };
    class TpError {
      constructor(config) {
        var _a2;
        this.message = (_a2 = CREATE_MESSAGE_MAP[config.type](forceCast(config.context))) !== null && _a2 !== void 0 ? _a2 : "Unexpected error";
        this.name = this.constructor.name;
        this.stack = new Error(this.message).stack;
        this.type = config.type;
      }
      static alreadyDisposed() {
        return new TpError({ type: "alreadydisposed" });
      }
      static notBindable() {
        return new TpError({
          type: "notbindable"
        });
      }
      static propertyNotFound(name) {
        return new TpError({
          type: "propertynotfound",
          context: {
            name
          }
        });
      }
      static shouldNeverHappen() {
        return new TpError({ type: "shouldneverhappen" });
      }
    }
    class BindingTarget {
      constructor(obj, key, opt_id) {
        this.obj_ = obj;
        this.key_ = key;
        this.presetKey_ = opt_id !== null && opt_id !== void 0 ? opt_id : key;
      }
      static isBindable(obj) {
        if (obj === null) {
          return false;
        }
        if (typeof obj !== "object") {
          return false;
        }
        return true;
      }
      get key() {
        return this.key_;
      }
      get presetKey() {
        return this.presetKey_;
      }
      read() {
        return this.obj_[this.key_];
      }
      write(value) {
        this.obj_[this.key_] = value;
      }
      writeProperty(name, value) {
        const valueObj = this.read();
        if (!BindingTarget.isBindable(valueObj)) {
          throw TpError.notBindable();
        }
        if (!(name in valueObj)) {
          throw TpError.propertyNotFound(name);
        }
        valueObj[name] = value;
      }
    }
    class ButtonApi extends BladeApi {
      get label() {
        return this.controller_.props.get("label");
      }
      set label(label) {
        this.controller_.props.set("label", label);
      }
      get title() {
        var _a2;
        return (_a2 = this.controller_.valueController.props.get("title")) !== null && _a2 !== void 0 ? _a2 : "";
      }
      set title(title) {
        this.controller_.valueController.props.set("title", title);
      }
      on(eventName, handler) {
        const bh = handler.bind(this);
        const emitter = this.controller_.valueController.emitter;
        emitter.on(eventName, () => {
          bh(new TpEvent(this));
        });
        return this;
      }
    }
    class Emitter {
      constructor() {
        this.observers_ = {};
      }
      on(eventName, handler) {
        let observers = this.observers_[eventName];
        if (!observers) {
          observers = this.observers_[eventName] = [];
        }
        observers.push({
          handler
        });
        return this;
      }
      off(eventName, handler) {
        const observers = this.observers_[eventName];
        if (observers) {
          this.observers_[eventName] = observers.filter((observer) => {
            return observer.handler !== handler;
          });
        }
        return this;
      }
      emit(eventName, event) {
        const observers = this.observers_[eventName];
        if (!observers) {
          return;
        }
        observers.forEach((observer) => {
          observer.handler(event);
        });
      }
    }
    const PREFIX = "tp";
    function ClassName(viewName) {
      const fn = (opt_elementName, opt_modifier) => {
        return [
          PREFIX,
          "-",
          viewName,
          "v",
          opt_elementName ? `_${opt_elementName}` : "",
          opt_modifier ? `-${opt_modifier}` : ""
        ].join("");
      };
      return fn;
    }
    function compose(h1, h2) {
      return (input) => h2(h1(input));
    }
    function extractValue(ev) {
      return ev.rawValue;
    }
    function bindValue(value, applyValue) {
      value.emitter.on("change", compose(extractValue, applyValue));
      applyValue(value.rawValue);
    }
    function bindValueMap(valueMap, key, applyValue) {
      bindValue(valueMap.value(key), applyValue);
    }
    function applyClass(elem, className2, active) {
      if (active) {
        elem.classList.add(className2);
      } else {
        elem.classList.remove(className2);
      }
    }
    function valueToClassName(elem, className2) {
      return (value) => {
        applyClass(elem, className2, value);
      };
    }
    function bindValueToTextContent(value, elem) {
      bindValue(value, (text) => {
        elem.textContent = text !== null && text !== void 0 ? text : "";
      });
    }
    const className$q = ClassName("btn");
    class ButtonView {
      constructor(doc2, config) {
        this.element = doc2.createElement("div");
        this.element.classList.add(className$q());
        config.viewProps.bindClassModifiers(this.element);
        const buttonElem = doc2.createElement("button");
        buttonElem.classList.add(className$q("b"));
        config.viewProps.bindDisabled(buttonElem);
        this.element.appendChild(buttonElem);
        this.buttonElement = buttonElem;
        const titleElem = doc2.createElement("div");
        titleElem.classList.add(className$q("t"));
        bindValueToTextContent(config.props.value("title"), titleElem);
        this.buttonElement.appendChild(titleElem);
      }
    }
    class ButtonController {
      constructor(doc2, config) {
        this.emitter = new Emitter();
        this.onClick_ = this.onClick_.bind(this);
        this.props = config.props;
        this.viewProps = config.viewProps;
        this.view = new ButtonView(doc2, {
          props: this.props,
          viewProps: this.viewProps
        });
        this.view.buttonElement.addEventListener("click", this.onClick_);
      }
      onClick_() {
        this.emitter.emit("click", {
          sender: this
        });
      }
    }
    class BoundValue {
      constructor(initialValue, config) {
        var _a2;
        this.constraint_ = config === null || config === void 0 ? void 0 : config.constraint;
        this.equals_ = (_a2 = config === null || config === void 0 ? void 0 : config.equals) !== null && _a2 !== void 0 ? _a2 : (v1, v2) => v1 === v2;
        this.emitter = new Emitter();
        this.rawValue_ = initialValue;
      }
      get constraint() {
        return this.constraint_;
      }
      get rawValue() {
        return this.rawValue_;
      }
      set rawValue(rawValue) {
        this.setRawValue(rawValue, {
          forceEmit: false,
          last: true
        });
      }
      setRawValue(rawValue, options) {
        const opts = options !== null && options !== void 0 ? options : {
          forceEmit: false,
          last: true
        };
        const constrainedValue = this.constraint_ ? this.constraint_.constrain(rawValue) : rawValue;
        const changed = !this.equals_(this.rawValue_, constrainedValue);
        if (!changed && !opts.forceEmit) {
          return;
        }
        this.emitter.emit("beforechange", {
          sender: this
        });
        this.rawValue_ = constrainedValue;
        this.emitter.emit("change", {
          options: opts,
          rawValue: constrainedValue,
          sender: this
        });
      }
    }
    class PrimitiveValue {
      constructor(initialValue) {
        this.emitter = new Emitter();
        this.value_ = initialValue;
      }
      get rawValue() {
        return this.value_;
      }
      set rawValue(value) {
        this.setRawValue(value, {
          forceEmit: false,
          last: true
        });
      }
      setRawValue(value, options) {
        const opts = options !== null && options !== void 0 ? options : {
          forceEmit: false,
          last: true
        };
        if (this.value_ === value && !opts.forceEmit) {
          return;
        }
        this.emitter.emit("beforechange", {
          sender: this
        });
        this.value_ = value;
        this.emitter.emit("change", {
          options: opts,
          rawValue: this.value_,
          sender: this
        });
      }
    }
    function createValue(initialValue, config) {
      const constraint = config === null || config === void 0 ? void 0 : config.constraint;
      const equals = config === null || config === void 0 ? void 0 : config.equals;
      if (!constraint && !equals) {
        return new PrimitiveValue(initialValue);
      }
      return new BoundValue(initialValue, config);
    }
    class ValueMap {
      constructor(valueMap) {
        this.emitter = new Emitter();
        this.valMap_ = valueMap;
        for (const key in this.valMap_) {
          const v = this.valMap_[key];
          v.emitter.on("change", () => {
            this.emitter.emit("change", {
              key,
              sender: this
            });
          });
        }
      }
      static createCore(initialValue) {
        const keys = Object.keys(initialValue);
        return keys.reduce((o, key) => {
          return Object.assign(o, {
            [key]: createValue(initialValue[key])
          });
        }, {});
      }
      static fromObject(initialValue) {
        const core = this.createCore(initialValue);
        return new ValueMap(core);
      }
      get(key) {
        return this.valMap_[key].rawValue;
      }
      set(key, value) {
        this.valMap_[key].rawValue = value;
      }
      value(key) {
        return this.valMap_[key];
      }
    }
    function parseObject(value, keyToParserMap) {
      const keys = Object.keys(keyToParserMap);
      const result = keys.reduce((tmp, key) => {
        if (tmp === void 0) {
          return void 0;
        }
        const parser = keyToParserMap[key];
        const result2 = parser(value[key]);
        return result2.succeeded ? Object.assign(Object.assign({}, tmp), { [key]: result2.value }) : void 0;
      }, {});
      return forceCast(result);
    }
    function parseArray(value, parseItem) {
      return value.reduce((tmp, item) => {
        if (tmp === void 0) {
          return void 0;
        }
        const result = parseItem(item);
        if (!result.succeeded || result.value === void 0) {
          return void 0;
        }
        return [...tmp, result.value];
      }, []);
    }
    function isObject2(value) {
      if (value === null) {
        return false;
      }
      return typeof value === "object";
    }
    function createParamsParserBuilder(parse) {
      return (optional) => (v) => {
        if (!optional && v === void 0) {
          return {
            succeeded: false,
            value: void 0
          };
        }
        if (optional && v === void 0) {
          return {
            succeeded: true,
            value: void 0
          };
        }
        const result = parse(v);
        return result !== void 0 ? {
          succeeded: true,
          value: result
        } : {
          succeeded: false,
          value: void 0
        };
      };
    }
    function createParamsParserBuilders(optional) {
      return {
        custom: (parse) => createParamsParserBuilder(parse)(optional),
        boolean: createParamsParserBuilder((v) => typeof v === "boolean" ? v : void 0)(optional),
        number: createParamsParserBuilder((v) => typeof v === "number" ? v : void 0)(optional),
        string: createParamsParserBuilder((v) => typeof v === "string" ? v : void 0)(optional),
        function: createParamsParserBuilder((v) => typeof v === "function" ? v : void 0)(optional),
        constant: (value) => createParamsParserBuilder((v) => v === value ? value : void 0)(optional),
        raw: createParamsParserBuilder((v) => v)(optional),
        object: (keyToParserMap) => createParamsParserBuilder((v) => {
          if (!isObject2(v)) {
            return void 0;
          }
          return parseObject(v, keyToParserMap);
        })(optional),
        array: (itemParser) => createParamsParserBuilder((v) => {
          if (!Array.isArray(v)) {
            return void 0;
          }
          return parseArray(v, itemParser);
        })(optional)
      };
    }
    const ParamsParsers = {
      optional: createParamsParserBuilders(true),
      required: createParamsParserBuilders(false)
    };
    function parseParams(value, keyToParserMap) {
      const result = ParamsParsers.required.object(keyToParserMap)(value);
      return result.succeeded ? result.value : void 0;
    }
    function disposeElement(elem) {
      if (elem && elem.parentElement) {
        elem.parentElement.removeChild(elem);
      }
      return null;
    }
    function getAllBladePositions() {
      return ["veryfirst", "first", "last", "verylast"];
    }
    const className$p = ClassName("");
    const POS_TO_CLASS_NAME_MAP = {
      veryfirst: "vfst",
      first: "fst",
      last: "lst",
      verylast: "vlst"
    };
    class BladeController {
      constructor(config) {
        this.parent_ = null;
        this.blade = config.blade;
        this.view = config.view;
        this.viewProps = config.viewProps;
        const elem = this.view.element;
        this.blade.value("positions").emitter.on("change", () => {
          getAllBladePositions().forEach((pos) => {
            elem.classList.remove(className$p(void 0, POS_TO_CLASS_NAME_MAP[pos]));
          });
          this.blade.get("positions").forEach((pos) => {
            elem.classList.add(className$p(void 0, POS_TO_CLASS_NAME_MAP[pos]));
          });
        });
        this.viewProps.handleDispose(() => {
          disposeElement(elem);
        });
      }
      get parent() {
        return this.parent_;
      }
    }
    const SVG_NS = "http://www.w3.org/2000/svg";
    function forceReflow(element) {
      element.offsetHeight;
    }
    function disableTransitionTemporarily(element, callback) {
      const t = element.style.transition;
      element.style.transition = "none";
      callback();
      element.style.transition = t;
    }
    function supportsTouch(doc2) {
      return doc2.ontouchstart !== void 0;
    }
    function getGlobalObject() {
      return new Function("return this")();
    }
    function getWindowDocument() {
      const globalObj = forceCast(getGlobalObject());
      return globalObj.document;
    }
    function getCanvasContext(canvasElement) {
      const win = canvasElement.ownerDocument.defaultView;
      if (!win) {
        return null;
      }
      const isBrowser = "document" in win;
      return isBrowser ? canvasElement.getContext("2d") : null;
    }
    const ICON_ID_TO_INNER_HTML_MAP = {
      check: '<path d="M2 8l4 4l8 -8"/>',
      dropdown: '<path d="M5 7h6l-3 3 z"/>',
      p2dpad: '<path d="M8 4v8"/><path d="M4 8h8"/><circle cx="12" cy="12" r="1.2"/>'
    };
    function createSvgIconElement(document2, iconId) {
      const elem = document2.createElementNS(SVG_NS, "svg");
      elem.innerHTML = ICON_ID_TO_INNER_HTML_MAP[iconId];
      return elem;
    }
    function insertElementAt(parentElement, element, index) {
      parentElement.insertBefore(element, parentElement.children[index]);
    }
    function removeElement(element) {
      if (element.parentElement) {
        element.parentElement.removeChild(element);
      }
    }
    function removeChildElements(element) {
      while (element.children.length > 0) {
        element.removeChild(element.children[0]);
      }
    }
    function removeChildNodes(element) {
      while (element.childNodes.length > 0) {
        element.removeChild(element.childNodes[0]);
      }
    }
    function findNextTarget(ev) {
      if (ev.relatedTarget) {
        return forceCast(ev.relatedTarget);
      }
      if ("explicitOriginalTarget" in ev) {
        return ev.explicitOriginalTarget;
      }
      return null;
    }
    const className$o = ClassName("lbl");
    function createLabelNode(doc2, label) {
      const frag = doc2.createDocumentFragment();
      const lineNodes = label.split("\n").map((line) => {
        return doc2.createTextNode(line);
      });
      lineNodes.forEach((lineNode, index) => {
        if (index > 0) {
          frag.appendChild(doc2.createElement("br"));
        }
        frag.appendChild(lineNode);
      });
      return frag;
    }
    class LabelView {
      constructor(doc2, config) {
        this.element = doc2.createElement("div");
        this.element.classList.add(className$o());
        config.viewProps.bindClassModifiers(this.element);
        const labelElem = doc2.createElement("div");
        labelElem.classList.add(className$o("l"));
        bindValueMap(config.props, "label", (value) => {
          if (isEmpty(value)) {
            this.element.classList.add(className$o(void 0, "nol"));
          } else {
            this.element.classList.remove(className$o(void 0, "nol"));
            removeChildNodes(labelElem);
            labelElem.appendChild(createLabelNode(doc2, value));
          }
        });
        this.element.appendChild(labelElem);
        this.labelElement = labelElem;
        const valueElem = doc2.createElement("div");
        valueElem.classList.add(className$o("v"));
        this.element.appendChild(valueElem);
        this.valueElement = valueElem;
      }
    }
    class LabelController extends BladeController {
      constructor(doc2, config) {
        const viewProps = config.valueController.viewProps;
        super(Object.assign(Object.assign({}, config), { view: new LabelView(doc2, {
          props: config.props,
          viewProps
        }), viewProps }));
        this.props = config.props;
        this.valueController = config.valueController;
        this.view.valueElement.appendChild(this.valueController.view.element);
      }
    }
    const ButtonBladePlugin = {
      id: "button",
      type: "blade",
      accept(params) {
        const p2 = ParamsParsers;
        const result = parseParams(params, {
          title: p2.required.string,
          view: p2.required.constant("button"),
          label: p2.optional.string
        });
        return result ? { params: result } : null;
      },
      controller(args) {
        return new LabelController(args.document, {
          blade: args.blade,
          props: ValueMap.fromObject({
            label: args.params.label
          }),
          valueController: new ButtonController(args.document, {
            props: ValueMap.fromObject({
              title: args.params.title
            }),
            viewProps: args.viewProps
          })
        });
      },
      api(args) {
        if (!(args.controller instanceof LabelController)) {
          return null;
        }
        if (!(args.controller.valueController instanceof ButtonController)) {
          return null;
        }
        return new ButtonApi(args.controller);
      }
    };
    class ValueBladeController extends BladeController {
      constructor(config) {
        super(config);
        this.value = config.value;
      }
    }
    function createBlade() {
      return new ValueMap({
        positions: createValue([], {
          equals: deepEqualsArray
        })
      });
    }
    class Foldable extends ValueMap {
      constructor(valueMap) {
        super(valueMap);
      }
      static create(expanded) {
        const coreObj = {
          completed: true,
          expanded,
          expandedHeight: null,
          shouldFixHeight: false,
          temporaryExpanded: null
        };
        const core = ValueMap.createCore(coreObj);
        return new Foldable(core);
      }
      get styleExpanded() {
        var _a2;
        return (_a2 = this.get("temporaryExpanded")) !== null && _a2 !== void 0 ? _a2 : this.get("expanded");
      }
      get styleHeight() {
        if (!this.styleExpanded) {
          return "0";
        }
        const exHeight = this.get("expandedHeight");
        if (this.get("shouldFixHeight") && !isEmpty(exHeight)) {
          return `${exHeight}px`;
        }
        return "auto";
      }
      bindExpandedClass(elem, expandedClassName) {
        const onExpand = () => {
          const expanded = this.styleExpanded;
          if (expanded) {
            elem.classList.add(expandedClassName);
          } else {
            elem.classList.remove(expandedClassName);
          }
        };
        bindValueMap(this, "expanded", onExpand);
        bindValueMap(this, "temporaryExpanded", onExpand);
      }
      cleanUpTransition() {
        this.set("shouldFixHeight", false);
        this.set("expandedHeight", null);
        this.set("completed", true);
      }
    }
    function computeExpandedFolderHeight(folder, containerElement) {
      let height = 0;
      disableTransitionTemporarily(containerElement, () => {
        folder.set("expandedHeight", null);
        folder.set("temporaryExpanded", true);
        forceReflow(containerElement);
        height = containerElement.clientHeight;
        folder.set("temporaryExpanded", null);
        forceReflow(containerElement);
      });
      return height;
    }
    function applyHeight(foldable, elem) {
      elem.style.height = foldable.styleHeight;
    }
    function bindFoldable(foldable, elem) {
      foldable.value("expanded").emitter.on("beforechange", () => {
        foldable.set("completed", false);
        if (isEmpty(foldable.get("expandedHeight"))) {
          foldable.set("expandedHeight", computeExpandedFolderHeight(foldable, elem));
        }
        foldable.set("shouldFixHeight", true);
        forceReflow(elem);
      });
      foldable.emitter.on("change", () => {
        applyHeight(foldable, elem);
      });
      applyHeight(foldable, elem);
      elem.addEventListener("transitionend", (ev) => {
        if (ev.propertyName !== "height") {
          return;
        }
        foldable.cleanUpTransition();
      });
    }
    class RackLikeApi extends BladeApi {
      constructor(controller, rackApi) {
        super(controller);
        this.rackApi_ = rackApi;
      }
    }
    function addButtonAsBlade(api, params) {
      return api.addBlade(Object.assign(Object.assign({}, params), { view: "button" }));
    }
    function addFolderAsBlade(api, params) {
      return api.addBlade(Object.assign(Object.assign({}, params), { view: "folder" }));
    }
    function addSeparatorAsBlade(api, opt_params) {
      const params = opt_params !== null && opt_params !== void 0 ? opt_params : {};
      return api.addBlade(Object.assign(Object.assign({}, params), { view: "separator" }));
    }
    function addTabAsBlade(api, params) {
      return api.addBlade(Object.assign(Object.assign({}, params), { view: "tab" }));
    }
    class NestedOrderedSet {
      constructor(extract) {
        this.emitter = new Emitter();
        this.items_ = [];
        this.cache_ = /* @__PURE__ */ new Set();
        this.onSubListAdd_ = this.onSubListAdd_.bind(this);
        this.onSubListRemove_ = this.onSubListRemove_.bind(this);
        this.extract_ = extract;
      }
      get items() {
        return this.items_;
      }
      allItems() {
        return Array.from(this.cache_);
      }
      find(callback) {
        for (const item of this.allItems()) {
          if (callback(item)) {
            return item;
          }
        }
        return null;
      }
      includes(item) {
        return this.cache_.has(item);
      }
      add(item, opt_index) {
        if (this.includes(item)) {
          throw TpError.shouldNeverHappen();
        }
        const index = opt_index !== void 0 ? opt_index : this.items_.length;
        this.items_.splice(index, 0, item);
        this.cache_.add(item);
        const subList = this.extract_(item);
        if (subList) {
          subList.emitter.on("add", this.onSubListAdd_);
          subList.emitter.on("remove", this.onSubListRemove_);
          subList.allItems().forEach((item2) => {
            this.cache_.add(item2);
          });
        }
        this.emitter.emit("add", {
          index,
          item,
          root: this,
          target: this
        });
      }
      remove(item) {
        const index = this.items_.indexOf(item);
        if (index < 0) {
          return;
        }
        this.items_.splice(index, 1);
        this.cache_.delete(item);
        const subList = this.extract_(item);
        if (subList) {
          subList.emitter.off("add", this.onSubListAdd_);
          subList.emitter.off("remove", this.onSubListRemove_);
        }
        this.emitter.emit("remove", {
          index,
          item,
          root: this,
          target: this
        });
      }
      onSubListAdd_(ev) {
        this.cache_.add(ev.item);
        this.emitter.emit("add", {
          index: ev.index,
          item: ev.item,
          root: this,
          target: ev.target
        });
      }
      onSubListRemove_(ev) {
        this.cache_.delete(ev.item);
        this.emitter.emit("remove", {
          index: ev.index,
          item: ev.item,
          root: this,
          target: ev.target
        });
      }
    }
    class InputBindingApi extends BladeApi {
      constructor(controller) {
        super(controller);
        this.onBindingChange_ = this.onBindingChange_.bind(this);
        this.emitter_ = new Emitter();
        this.controller_.binding.emitter.on("change", this.onBindingChange_);
      }
      get label() {
        return this.controller_.props.get("label");
      }
      set label(label) {
        this.controller_.props.set("label", label);
      }
      on(eventName, handler) {
        const bh = handler.bind(this);
        this.emitter_.on(eventName, (ev) => {
          bh(ev.event);
        });
        return this;
      }
      refresh() {
        this.controller_.binding.read();
      }
      onBindingChange_(ev) {
        const value = ev.sender.target.read();
        this.emitter_.emit("change", {
          event: new TpChangeEvent(this, forceCast(value), this.controller_.binding.target.presetKey, ev.options.last)
        });
      }
    }
    class InputBindingController extends LabelController {
      constructor(doc2, config) {
        super(doc2, config);
        this.binding = config.binding;
      }
    }
    class MonitorBindingApi extends BladeApi {
      constructor(controller) {
        super(controller);
        this.onBindingUpdate_ = this.onBindingUpdate_.bind(this);
        this.emitter_ = new Emitter();
        this.controller_.binding.emitter.on("update", this.onBindingUpdate_);
      }
      get label() {
        return this.controller_.props.get("label");
      }
      set label(label) {
        this.controller_.props.set("label", label);
      }
      on(eventName, handler) {
        const bh = handler.bind(this);
        this.emitter_.on(eventName, (ev) => {
          bh(ev.event);
        });
        return this;
      }
      refresh() {
        this.controller_.binding.read();
      }
      onBindingUpdate_(ev) {
        const value = ev.sender.target.read();
        this.emitter_.emit("update", {
          event: new TpUpdateEvent(this, forceCast(value), this.controller_.binding.target.presetKey)
        });
      }
    }
    class MonitorBindingController extends LabelController {
      constructor(doc2, config) {
        super(doc2, config);
        this.binding = config.binding;
        this.viewProps.bindDisabled(this.binding.ticker);
        this.viewProps.handleDispose(() => {
          this.binding.dispose();
        });
      }
    }
    function findSubBladeApiSet(api) {
      if (api instanceof RackApi) {
        return api["apiSet_"];
      }
      if (api instanceof RackLikeApi) {
        return api["rackApi_"]["apiSet_"];
      }
      return null;
    }
    function getApiByController(apiSet, controller) {
      const api = apiSet.find((api2) => api2.controller_ === controller);
      if (!api) {
        throw TpError.shouldNeverHappen();
      }
      return api;
    }
    function createBindingTarget(obj, key, opt_id) {
      if (!BindingTarget.isBindable(obj)) {
        throw TpError.notBindable();
      }
      return new BindingTarget(obj, key, opt_id);
    }
    class RackApi extends BladeApi {
      constructor(controller, pool) {
        super(controller);
        this.onRackAdd_ = this.onRackAdd_.bind(this);
        this.onRackRemove_ = this.onRackRemove_.bind(this);
        this.onRackInputChange_ = this.onRackInputChange_.bind(this);
        this.onRackMonitorUpdate_ = this.onRackMonitorUpdate_.bind(this);
        this.emitter_ = new Emitter();
        this.apiSet_ = new NestedOrderedSet(findSubBladeApiSet);
        this.pool_ = pool;
        const rack = this.controller_.rack;
        rack.emitter.on("add", this.onRackAdd_);
        rack.emitter.on("remove", this.onRackRemove_);
        rack.emitter.on("inputchange", this.onRackInputChange_);
        rack.emitter.on("monitorupdate", this.onRackMonitorUpdate_);
        rack.children.forEach((bc) => {
          this.setUpApi_(bc);
        });
      }
      get children() {
        return this.controller_.rack.children.map((bc) => getApiByController(this.apiSet_, bc));
      }
      addInput(object, key, opt_params) {
        const params = opt_params !== null && opt_params !== void 0 ? opt_params : {};
        const doc2 = this.controller_.view.element.ownerDocument;
        const bc = this.pool_.createInput(doc2, createBindingTarget(object, key, params.presetKey), params);
        const api = new InputBindingApi(bc);
        return this.add(api, params.index);
      }
      addMonitor(object, key, opt_params) {
        const params = opt_params !== null && opt_params !== void 0 ? opt_params : {};
        const doc2 = this.controller_.view.element.ownerDocument;
        const bc = this.pool_.createMonitor(doc2, createBindingTarget(object, key), params);
        const api = new MonitorBindingApi(bc);
        return forceCast(this.add(api, params.index));
      }
      addFolder(params) {
        return addFolderAsBlade(this, params);
      }
      addButton(params) {
        return addButtonAsBlade(this, params);
      }
      addSeparator(opt_params) {
        return addSeparatorAsBlade(this, opt_params);
      }
      addTab(params) {
        return addTabAsBlade(this, params);
      }
      add(api, opt_index) {
        this.controller_.rack.add(api.controller_, opt_index);
        const gapi = this.apiSet_.find((a) => a.controller_ === api.controller_);
        if (gapi) {
          this.apiSet_.remove(gapi);
        }
        this.apiSet_.add(api);
        return api;
      }
      remove(api) {
        this.controller_.rack.remove(api.controller_);
      }
      addBlade(params) {
        const doc2 = this.controller_.view.element.ownerDocument;
        const bc = this.pool_.createBlade(doc2, params);
        const api = this.pool_.createBladeApi(bc);
        return this.add(api, params.index);
      }
      on(eventName, handler) {
        const bh = handler.bind(this);
        this.emitter_.on(eventName, (ev) => {
          bh(ev.event);
        });
        return this;
      }
      setUpApi_(bc) {
        const api = this.apiSet_.find((api2) => api2.controller_ === bc);
        if (!api) {
          this.apiSet_.add(this.pool_.createBladeApi(bc));
        }
      }
      onRackAdd_(ev) {
        this.setUpApi_(ev.bladeController);
      }
      onRackRemove_(ev) {
        if (ev.isRoot) {
          const api = getApiByController(this.apiSet_, ev.bladeController);
          this.apiSet_.remove(api);
        }
      }
      onRackInputChange_(ev) {
        const bc = ev.bladeController;
        if (bc instanceof InputBindingController) {
          const api = getApiByController(this.apiSet_, bc);
          const binding = bc.binding;
          this.emitter_.emit("change", {
            event: new TpChangeEvent(api, forceCast(binding.target.read()), binding.target.presetKey, ev.options.last)
          });
        } else if (bc instanceof ValueBladeController) {
          const api = getApiByController(this.apiSet_, bc);
          this.emitter_.emit("change", {
            event: new TpChangeEvent(api, bc.value.rawValue, void 0, ev.options.last)
          });
        }
      }
      onRackMonitorUpdate_(ev) {
        if (!(ev.bladeController instanceof MonitorBindingController)) {
          throw TpError.shouldNeverHappen();
        }
        const api = getApiByController(this.apiSet_, ev.bladeController);
        const binding = ev.bladeController.binding;
        this.emitter_.emit("update", {
          event: new TpUpdateEvent(api, forceCast(binding.target.read()), binding.target.presetKey)
        });
      }
    }
    class FolderApi extends RackLikeApi {
      constructor(controller, pool) {
        super(controller, new RackApi(controller.rackController, pool));
        this.emitter_ = new Emitter();
        this.controller_.foldable.value("expanded").emitter.on("change", (ev) => {
          this.emitter_.emit("fold", {
            event: new TpFoldEvent(this, ev.sender.rawValue)
          });
        });
        this.rackApi_.on("change", (ev) => {
          this.emitter_.emit("change", {
            event: ev
          });
        });
        this.rackApi_.on("update", (ev) => {
          this.emitter_.emit("update", {
            event: ev
          });
        });
      }
      get expanded() {
        return this.controller_.foldable.get("expanded");
      }
      set expanded(expanded) {
        this.controller_.foldable.set("expanded", expanded);
      }
      get title() {
        return this.controller_.props.get("title");
      }
      set title(title) {
        this.controller_.props.set("title", title);
      }
      get children() {
        return this.rackApi_.children;
      }
      addInput(object, key, opt_params) {
        return this.rackApi_.addInput(object, key, opt_params);
      }
      addMonitor(object, key, opt_params) {
        return this.rackApi_.addMonitor(object, key, opt_params);
      }
      addFolder(params) {
        return this.rackApi_.addFolder(params);
      }
      addButton(params) {
        return this.rackApi_.addButton(params);
      }
      addSeparator(opt_params) {
        return this.rackApi_.addSeparator(opt_params);
      }
      addTab(params) {
        return this.rackApi_.addTab(params);
      }
      add(api, opt_index) {
        return this.rackApi_.add(api, opt_index);
      }
      remove(api) {
        this.rackApi_.remove(api);
      }
      addBlade(params) {
        return this.rackApi_.addBlade(params);
      }
      on(eventName, handler) {
        const bh = handler.bind(this);
        this.emitter_.on(eventName, (ev) => {
          bh(ev.event);
        });
        return this;
      }
    }
    class RackLikeController extends BladeController {
      constructor(config) {
        super({
          blade: config.blade,
          view: config.view,
          viewProps: config.rackController.viewProps
        });
        this.rackController = config.rackController;
      }
    }
    class PlainView {
      constructor(doc2, config) {
        const className2 = ClassName(config.viewName);
        this.element = doc2.createElement("div");
        this.element.classList.add(className2());
        config.viewProps.bindClassModifiers(this.element);
      }
    }
    function findInputBindingController(bcs, b) {
      for (let i = 0; i < bcs.length; i++) {
        const bc = bcs[i];
        if (bc instanceof InputBindingController && bc.binding === b) {
          return bc;
        }
      }
      return null;
    }
    function findMonitorBindingController(bcs, b) {
      for (let i = 0; i < bcs.length; i++) {
        const bc = bcs[i];
        if (bc instanceof MonitorBindingController && bc.binding === b) {
          return bc;
        }
      }
      return null;
    }
    function findValueBladeController(bcs, v) {
      for (let i = 0; i < bcs.length; i++) {
        const bc = bcs[i];
        if (bc instanceof ValueBladeController && bc.value === v) {
          return bc;
        }
      }
      return null;
    }
    function findSubRack(bc) {
      if (bc instanceof RackController) {
        return bc.rack;
      }
      if (bc instanceof RackLikeController) {
        return bc.rackController.rack;
      }
      return null;
    }
    function findSubBladeControllerSet(bc) {
      const rack = findSubRack(bc);
      return rack ? rack["bcSet_"] : null;
    }
    class BladeRack {
      constructor(blade) {
        var _a2;
        this.onBladePositionsChange_ = this.onBladePositionsChange_.bind(this);
        this.onSetAdd_ = this.onSetAdd_.bind(this);
        this.onSetRemove_ = this.onSetRemove_.bind(this);
        this.onChildDispose_ = this.onChildDispose_.bind(this);
        this.onChildPositionsChange_ = this.onChildPositionsChange_.bind(this);
        this.onChildInputChange_ = this.onChildInputChange_.bind(this);
        this.onChildMonitorUpdate_ = this.onChildMonitorUpdate_.bind(this);
        this.onChildValueChange_ = this.onChildValueChange_.bind(this);
        this.onChildViewPropsChange_ = this.onChildViewPropsChange_.bind(this);
        this.onDescendantLayout_ = this.onDescendantLayout_.bind(this);
        this.onDescendantInputChange_ = this.onDescendantInputChange_.bind(this);
        this.onDescendantMonitorUpdate_ = this.onDescendantMonitorUpdate_.bind(this);
        this.emitter = new Emitter();
        this.blade_ = blade !== null && blade !== void 0 ? blade : null;
        (_a2 = this.blade_) === null || _a2 === void 0 ? void 0 : _a2.value("positions").emitter.on("change", this.onBladePositionsChange_);
        this.bcSet_ = new NestedOrderedSet(findSubBladeControllerSet);
        this.bcSet_.emitter.on("add", this.onSetAdd_);
        this.bcSet_.emitter.on("remove", this.onSetRemove_);
      }
      get children() {
        return this.bcSet_.items;
      }
      add(bc, opt_index) {
        if (bc.parent) {
          bc.parent.remove(bc);
        }
        bc["parent_"] = this;
        this.bcSet_.add(bc, opt_index);
      }
      remove(bc) {
        bc["parent_"] = null;
        this.bcSet_.remove(bc);
      }
      find(controllerClass) {
        return forceCast(this.bcSet_.allItems().filter((bc) => {
          return bc instanceof controllerClass;
        }));
      }
      onSetAdd_(ev) {
        this.updatePositions_();
        const isRoot = ev.target === ev.root;
        this.emitter.emit("add", {
          bladeController: ev.item,
          index: ev.index,
          isRoot,
          sender: this
        });
        if (!isRoot) {
          return;
        }
        const bc = ev.item;
        bc.viewProps.emitter.on("change", this.onChildViewPropsChange_);
        bc.blade.value("positions").emitter.on("change", this.onChildPositionsChange_);
        bc.viewProps.handleDispose(this.onChildDispose_);
        if (bc instanceof InputBindingController) {
          bc.binding.emitter.on("change", this.onChildInputChange_);
        } else if (bc instanceof MonitorBindingController) {
          bc.binding.emitter.on("update", this.onChildMonitorUpdate_);
        } else if (bc instanceof ValueBladeController) {
          bc.value.emitter.on("change", this.onChildValueChange_);
        } else {
          const rack = findSubRack(bc);
          if (rack) {
            const emitter = rack.emitter;
            emitter.on("layout", this.onDescendantLayout_);
            emitter.on("inputchange", this.onDescendantInputChange_);
            emitter.on("monitorupdate", this.onDescendantMonitorUpdate_);
          }
        }
      }
      onSetRemove_(ev) {
        this.updatePositions_();
        const isRoot = ev.target === ev.root;
        this.emitter.emit("remove", {
          bladeController: ev.item,
          isRoot,
          sender: this
        });
        if (!isRoot) {
          return;
        }
        const bc = ev.item;
        if (bc instanceof InputBindingController) {
          bc.binding.emitter.off("change", this.onChildInputChange_);
        } else if (bc instanceof MonitorBindingController) {
          bc.binding.emitter.off("update", this.onChildMonitorUpdate_);
        } else if (bc instanceof ValueBladeController) {
          bc.value.emitter.off("change", this.onChildValueChange_);
        } else {
          const rack = findSubRack(bc);
          if (rack) {
            const emitter = rack.emitter;
            emitter.off("layout", this.onDescendantLayout_);
            emitter.off("inputchange", this.onDescendantInputChange_);
            emitter.off("monitorupdate", this.onDescendantMonitorUpdate_);
          }
        }
      }
      updatePositions_() {
        const visibleItems = this.bcSet_.items.filter((bc) => !bc.viewProps.get("hidden"));
        const firstVisibleItem = visibleItems[0];
        const lastVisibleItem = visibleItems[visibleItems.length - 1];
        this.bcSet_.items.forEach((bc) => {
          const ps = [];
          if (bc === firstVisibleItem) {
            ps.push("first");
            if (!this.blade_ || this.blade_.get("positions").includes("veryfirst")) {
              ps.push("veryfirst");
            }
          }
          if (bc === lastVisibleItem) {
            ps.push("last");
            if (!this.blade_ || this.blade_.get("positions").includes("verylast")) {
              ps.push("verylast");
            }
          }
          bc.blade.set("positions", ps);
        });
      }
      onChildPositionsChange_() {
        this.updatePositions_();
        this.emitter.emit("layout", {
          sender: this
        });
      }
      onChildViewPropsChange_(_ev) {
        this.updatePositions_();
        this.emitter.emit("layout", {
          sender: this
        });
      }
      onChildDispose_() {
        const disposedUcs = this.bcSet_.items.filter((bc) => {
          return bc.viewProps.get("disposed");
        });
        disposedUcs.forEach((bc) => {
          this.bcSet_.remove(bc);
        });
      }
      onChildInputChange_(ev) {
        const bc = findInputBindingController(this.find(InputBindingController), ev.sender);
        if (!bc) {
          throw TpError.shouldNeverHappen();
        }
        this.emitter.emit("inputchange", {
          bladeController: bc,
          options: ev.options,
          sender: this
        });
      }
      onChildMonitorUpdate_(ev) {
        const bc = findMonitorBindingController(this.find(MonitorBindingController), ev.sender);
        if (!bc) {
          throw TpError.shouldNeverHappen();
        }
        this.emitter.emit("monitorupdate", {
          bladeController: bc,
          sender: this
        });
      }
      onChildValueChange_(ev) {
        const bc = findValueBladeController(this.find(ValueBladeController), ev.sender);
        if (!bc) {
          throw TpError.shouldNeverHappen();
        }
        this.emitter.emit("inputchange", {
          bladeController: bc,
          options: ev.options,
          sender: this
        });
      }
      onDescendantLayout_(_) {
        this.updatePositions_();
        this.emitter.emit("layout", {
          sender: this
        });
      }
      onDescendantInputChange_(ev) {
        this.emitter.emit("inputchange", {
          bladeController: ev.bladeController,
          options: ev.options,
          sender: this
        });
      }
      onDescendantMonitorUpdate_(ev) {
        this.emitter.emit("monitorupdate", {
          bladeController: ev.bladeController,
          sender: this
        });
      }
      onBladePositionsChange_() {
        this.updatePositions_();
      }
    }
    class RackController extends BladeController {
      constructor(doc2, config) {
        super(Object.assign(Object.assign({}, config), { view: new PlainView(doc2, {
          viewName: "brk",
          viewProps: config.viewProps
        }) }));
        this.onRackAdd_ = this.onRackAdd_.bind(this);
        this.onRackRemove_ = this.onRackRemove_.bind(this);
        const rack = new BladeRack(config.root ? void 0 : config.blade);
        rack.emitter.on("add", this.onRackAdd_);
        rack.emitter.on("remove", this.onRackRemove_);
        this.rack = rack;
        this.viewProps.handleDispose(() => {
          for (let i = this.rack.children.length - 1; i >= 0; i--) {
            const bc = this.rack.children[i];
            bc.viewProps.set("disposed", true);
          }
        });
      }
      onRackAdd_(ev) {
        if (!ev.isRoot) {
          return;
        }
        insertElementAt(this.view.element, ev.bladeController.view.element, ev.index);
      }
      onRackRemove_(ev) {
        if (!ev.isRoot) {
          return;
        }
        removeElement(ev.bladeController.view.element);
      }
    }
    const bladeContainerClassName = ClassName("cnt");
    class FolderView {
      constructor(doc2, config) {
        var _a2;
        this.className_ = ClassName((_a2 = config.viewName) !== null && _a2 !== void 0 ? _a2 : "fld");
        this.element = doc2.createElement("div");
        this.element.classList.add(this.className_(), bladeContainerClassName());
        config.viewProps.bindClassModifiers(this.element);
        this.foldable_ = config.foldable;
        this.foldable_.bindExpandedClass(this.element, this.className_(void 0, "expanded"));
        bindValueMap(this.foldable_, "completed", valueToClassName(this.element, this.className_(void 0, "cpl")));
        const buttonElem = doc2.createElement("button");
        buttonElem.classList.add(this.className_("b"));
        bindValueMap(config.props, "title", (title) => {
          if (isEmpty(title)) {
            this.element.classList.add(this.className_(void 0, "not"));
          } else {
            this.element.classList.remove(this.className_(void 0, "not"));
          }
        });
        config.viewProps.bindDisabled(buttonElem);
        this.element.appendChild(buttonElem);
        this.buttonElement = buttonElem;
        const titleElem = doc2.createElement("div");
        titleElem.classList.add(this.className_("t"));
        bindValueToTextContent(config.props.value("title"), titleElem);
        this.buttonElement.appendChild(titleElem);
        this.titleElement = titleElem;
        const markElem = doc2.createElement("div");
        markElem.classList.add(this.className_("m"));
        this.buttonElement.appendChild(markElem);
        const containerElem = config.containerElement;
        containerElem.classList.add(this.className_("c"));
        this.element.appendChild(containerElem);
        this.containerElement = containerElem;
      }
    }
    class FolderController extends RackLikeController {
      constructor(doc2, config) {
        var _a2;
        const foldable = Foldable.create((_a2 = config.expanded) !== null && _a2 !== void 0 ? _a2 : true);
        const rc = new RackController(doc2, {
          blade: config.blade,
          root: config.root,
          viewProps: config.viewProps
        });
        super(Object.assign(Object.assign({}, config), { rackController: rc, view: new FolderView(doc2, {
          containerElement: rc.view.element,
          foldable,
          props: config.props,
          viewName: config.root ? "rot" : void 0,
          viewProps: config.viewProps
        }) }));
        this.onTitleClick_ = this.onTitleClick_.bind(this);
        this.props = config.props;
        this.foldable = foldable;
        bindFoldable(this.foldable, this.view.containerElement);
        this.rackController.rack.emitter.on("add", () => {
          this.foldable.cleanUpTransition();
        });
        this.rackController.rack.emitter.on("remove", () => {
          this.foldable.cleanUpTransition();
        });
        this.view.buttonElement.addEventListener("click", this.onTitleClick_);
      }
      get document() {
        return this.view.element.ownerDocument;
      }
      onTitleClick_() {
        this.foldable.set("expanded", !this.foldable.get("expanded"));
      }
    }
    const FolderBladePlugin = {
      id: "folder",
      type: "blade",
      accept(params) {
        const p2 = ParamsParsers;
        const result = parseParams(params, {
          title: p2.required.string,
          view: p2.required.constant("folder"),
          expanded: p2.optional.boolean
        });
        return result ? { params: result } : null;
      },
      controller(args) {
        return new FolderController(args.document, {
          blade: args.blade,
          expanded: args.params.expanded,
          props: ValueMap.fromObject({
            title: args.params.title
          }),
          viewProps: args.viewProps
        });
      },
      api(args) {
        if (!(args.controller instanceof FolderController)) {
          return null;
        }
        return new FolderApi(args.controller, args.pool);
      }
    };
    class LabeledValueController extends ValueBladeController {
      constructor(doc2, config) {
        const viewProps = config.valueController.viewProps;
        super(Object.assign(Object.assign({}, config), { value: config.valueController.value, view: new LabelView(doc2, {
          props: config.props,
          viewProps
        }), viewProps }));
        this.props = config.props;
        this.valueController = config.valueController;
        this.view.valueElement.appendChild(this.valueController.view.element);
      }
    }
    class SeparatorApi extends BladeApi {
    }
    const className$n = ClassName("spr");
    class SeparatorView {
      constructor(doc2, config) {
        this.element = doc2.createElement("div");
        this.element.classList.add(className$n());
        config.viewProps.bindClassModifiers(this.element);
        const hrElem = doc2.createElement("hr");
        hrElem.classList.add(className$n("r"));
        this.element.appendChild(hrElem);
      }
    }
    class SeparatorController extends BladeController {
      constructor(doc2, config) {
        super(Object.assign(Object.assign({}, config), { view: new SeparatorView(doc2, {
          viewProps: config.viewProps
        }) }));
      }
    }
    const SeparatorBladePlugin = {
      id: "separator",
      type: "blade",
      accept(params) {
        const p2 = ParamsParsers;
        const result = parseParams(params, {
          view: p2.required.constant("separator")
        });
        return result ? { params: result } : null;
      },
      controller(args) {
        return new SeparatorController(args.document, {
          blade: args.blade,
          viewProps: args.viewProps
        });
      },
      api(args) {
        if (!(args.controller instanceof SeparatorController)) {
          return null;
        }
        return new SeparatorApi(args.controller);
      }
    };
    const className$m = ClassName("");
    function valueToModifier(elem, modifier) {
      return valueToClassName(elem, className$m(void 0, modifier));
    }
    class ViewProps extends ValueMap {
      constructor(valueMap) {
        super(valueMap);
      }
      static create(opt_initialValue) {
        var _a2, _b;
        const initialValue = opt_initialValue !== null && opt_initialValue !== void 0 ? opt_initialValue : {};
        const coreObj = {
          disabled: (_a2 = initialValue.disabled) !== null && _a2 !== void 0 ? _a2 : false,
          disposed: false,
          hidden: (_b = initialValue.hidden) !== null && _b !== void 0 ? _b : false
        };
        const core = ValueMap.createCore(coreObj);
        return new ViewProps(core);
      }
      bindClassModifiers(elem) {
        bindValueMap(this, "disabled", valueToModifier(elem, "disabled"));
        bindValueMap(this, "hidden", valueToModifier(elem, "hidden"));
      }
      bindDisabled(target) {
        bindValueMap(this, "disabled", (disabled) => {
          target.disabled = disabled;
        });
      }
      bindTabIndex(elem) {
        bindValueMap(this, "disabled", (disabled) => {
          elem.tabIndex = disabled ? -1 : 0;
        });
      }
      handleDispose(callback) {
        this.value("disposed").emitter.on("change", (disposed) => {
          if (disposed) {
            callback();
          }
        });
      }
    }
    const className$l = ClassName("tbi");
    class TabItemView {
      constructor(doc2, config) {
        this.element = doc2.createElement("div");
        this.element.classList.add(className$l());
        config.viewProps.bindClassModifiers(this.element);
        bindValueMap(config.props, "selected", (selected) => {
          if (selected) {
            this.element.classList.add(className$l(void 0, "sel"));
          } else {
            this.element.classList.remove(className$l(void 0, "sel"));
          }
        });
        const buttonElem = doc2.createElement("button");
        buttonElem.classList.add(className$l("b"));
        config.viewProps.bindDisabled(buttonElem);
        this.element.appendChild(buttonElem);
        this.buttonElement = buttonElem;
        const titleElem = doc2.createElement("div");
        titleElem.classList.add(className$l("t"));
        bindValueToTextContent(config.props.value("title"), titleElem);
        this.buttonElement.appendChild(titleElem);
        this.titleElement = titleElem;
      }
    }
    class TabItemController {
      constructor(doc2, config) {
        this.emitter = new Emitter();
        this.onClick_ = this.onClick_.bind(this);
        this.props = config.props;
        this.viewProps = config.viewProps;
        this.view = new TabItemView(doc2, {
          props: config.props,
          viewProps: config.viewProps
        });
        this.view.buttonElement.addEventListener("click", this.onClick_);
      }
      onClick_() {
        this.emitter.emit("click", {
          sender: this
        });
      }
    }
    class TabPageController {
      constructor(doc2, config) {
        this.onItemClick_ = this.onItemClick_.bind(this);
        this.ic_ = new TabItemController(doc2, {
          props: config.itemProps,
          viewProps: ViewProps.create()
        });
        this.ic_.emitter.on("click", this.onItemClick_);
        this.cc_ = new RackController(doc2, {
          blade: createBlade(),
          viewProps: ViewProps.create()
        });
        this.props = config.props;
        bindValueMap(this.props, "selected", (selected) => {
          this.itemController.props.set("selected", selected);
          this.contentController.viewProps.set("hidden", !selected);
        });
      }
      get itemController() {
        return this.ic_;
      }
      get contentController() {
        return this.cc_;
      }
      onItemClick_() {
        this.props.set("selected", true);
      }
    }
    class TabPageApi {
      constructor(controller, contentRackApi) {
        this.controller_ = controller;
        this.rackApi_ = contentRackApi;
      }
      get title() {
        var _a2;
        return (_a2 = this.controller_.itemController.props.get("title")) !== null && _a2 !== void 0 ? _a2 : "";
      }
      set title(title) {
        this.controller_.itemController.props.set("title", title);
      }
      get selected() {
        return this.controller_.props.get("selected");
      }
      set selected(selected) {
        this.controller_.props.set("selected", selected);
      }
      get children() {
        return this.rackApi_.children;
      }
      addButton(params) {
        return this.rackApi_.addButton(params);
      }
      addFolder(params) {
        return this.rackApi_.addFolder(params);
      }
      addSeparator(opt_params) {
        return this.rackApi_.addSeparator(opt_params);
      }
      addTab(params) {
        return this.rackApi_.addTab(params);
      }
      add(api, opt_index) {
        this.rackApi_.add(api, opt_index);
      }
      remove(api) {
        this.rackApi_.remove(api);
      }
      addInput(object, key, opt_params) {
        return this.rackApi_.addInput(object, key, opt_params);
      }
      addMonitor(object, key, opt_params) {
        return this.rackApi_.addMonitor(object, key, opt_params);
      }
      addBlade(params) {
        return this.rackApi_.addBlade(params);
      }
    }
    class TabApi extends RackLikeApi {
      constructor(controller, pool) {
        super(controller, new RackApi(controller.rackController, pool));
        this.onPageAdd_ = this.onPageAdd_.bind(this);
        this.onPageRemove_ = this.onPageRemove_.bind(this);
        this.onSelect_ = this.onSelect_.bind(this);
        this.emitter_ = new Emitter();
        this.pageApiMap_ = /* @__PURE__ */ new Map();
        this.rackApi_.on("change", (ev) => {
          this.emitter_.emit("change", {
            event: ev
          });
        });
        this.rackApi_.on("update", (ev) => {
          this.emitter_.emit("update", {
            event: ev
          });
        });
        this.controller_.tab.selectedIndex.emitter.on("change", this.onSelect_);
        this.controller_.pageSet.emitter.on("add", this.onPageAdd_);
        this.controller_.pageSet.emitter.on("remove", this.onPageRemove_);
        this.controller_.pageSet.items.forEach((pc) => {
          this.setUpPageApi_(pc);
        });
      }
      get pages() {
        return this.controller_.pageSet.items.map((pc) => {
          const api = this.pageApiMap_.get(pc);
          if (!api) {
            throw TpError.shouldNeverHappen();
          }
          return api;
        });
      }
      addPage(params) {
        const doc2 = this.controller_.view.element.ownerDocument;
        const pc = new TabPageController(doc2, {
          itemProps: ValueMap.fromObject({
            selected: false,
            title: params.title
          }),
          props: ValueMap.fromObject({
            selected: false
          })
        });
        this.controller_.add(pc, params.index);
        const api = this.pageApiMap_.get(pc);
        if (!api) {
          throw TpError.shouldNeverHappen();
        }
        return api;
      }
      removePage(index) {
        this.controller_.remove(index);
      }
      on(eventName, handler) {
        const bh = handler.bind(this);
        this.emitter_.on(eventName, (ev) => {
          bh(ev.event);
        });
        return this;
      }
      setUpPageApi_(pc) {
        const rackApi = this.rackApi_["apiSet_"].find((api2) => api2.controller_ === pc.contentController);
        if (!rackApi) {
          throw TpError.shouldNeverHappen();
        }
        const api = new TabPageApi(pc, rackApi);
        this.pageApiMap_.set(pc, api);
      }
      onPageAdd_(ev) {
        this.setUpPageApi_(ev.item);
      }
      onPageRemove_(ev) {
        const api = this.pageApiMap_.get(ev.item);
        if (!api) {
          throw TpError.shouldNeverHappen();
        }
        this.pageApiMap_.delete(ev.item);
      }
      onSelect_(ev) {
        this.emitter_.emit("select", {
          event: new TpTabSelectEvent(this, ev.rawValue)
        });
      }
    }
    const INDEX_NOT_SELECTED = -1;
    class Tab {
      constructor() {
        this.onItemSelectedChange_ = this.onItemSelectedChange_.bind(this);
        this.empty = createValue(true);
        this.selectedIndex = createValue(INDEX_NOT_SELECTED);
        this.items_ = [];
      }
      add(item, opt_index) {
        const index = opt_index !== null && opt_index !== void 0 ? opt_index : this.items_.length;
        this.items_.splice(index, 0, item);
        item.emitter.on("change", this.onItemSelectedChange_);
        this.keepSelection_();
      }
      remove(item) {
        const index = this.items_.indexOf(item);
        if (index < 0) {
          return;
        }
        this.items_.splice(index, 1);
        item.emitter.off("change", this.onItemSelectedChange_);
        this.keepSelection_();
      }
      keepSelection_() {
        if (this.items_.length === 0) {
          this.selectedIndex.rawValue = INDEX_NOT_SELECTED;
          this.empty.rawValue = true;
          return;
        }
        const firstSelIndex = this.items_.findIndex((s) => s.rawValue);
        if (firstSelIndex < 0) {
          this.items_.forEach((s, i) => {
            s.rawValue = i === 0;
          });
          this.selectedIndex.rawValue = 0;
        } else {
          this.items_.forEach((s, i) => {
            s.rawValue = i === firstSelIndex;
          });
          this.selectedIndex.rawValue = firstSelIndex;
        }
        this.empty.rawValue = false;
      }
      onItemSelectedChange_(ev) {
        if (ev.rawValue) {
          const index = this.items_.findIndex((s) => s === ev.sender);
          this.items_.forEach((s, i) => {
            s.rawValue = i === index;
          });
          this.selectedIndex.rawValue = index;
        } else {
          this.keepSelection_();
        }
      }
    }
    const className$k = ClassName("tab");
    class TabView {
      constructor(doc2, config) {
        this.element = doc2.createElement("div");
        this.element.classList.add(className$k(), bladeContainerClassName());
        config.viewProps.bindClassModifiers(this.element);
        bindValue(config.empty, valueToClassName(this.element, className$k(void 0, "nop")));
        const itemsElem = doc2.createElement("div");
        itemsElem.classList.add(className$k("i"));
        this.element.appendChild(itemsElem);
        this.itemsElement = itemsElem;
        const contentsElem = config.contentsElement;
        contentsElem.classList.add(className$k("c"));
        this.element.appendChild(contentsElem);
        this.contentsElement = contentsElem;
      }
    }
    class TabController extends RackLikeController {
      constructor(doc2, config) {
        const cr = new RackController(doc2, {
          blade: config.blade,
          viewProps: config.viewProps
        });
        const tab = new Tab();
        super({
          blade: config.blade,
          rackController: cr,
          view: new TabView(doc2, {
            contentsElement: cr.view.element,
            empty: tab.empty,
            viewProps: config.viewProps
          })
        });
        this.onPageAdd_ = this.onPageAdd_.bind(this);
        this.onPageRemove_ = this.onPageRemove_.bind(this);
        this.pageSet_ = new NestedOrderedSet(() => null);
        this.pageSet_.emitter.on("add", this.onPageAdd_);
        this.pageSet_.emitter.on("remove", this.onPageRemove_);
        this.tab = tab;
      }
      get pageSet() {
        return this.pageSet_;
      }
      add(pc, opt_index) {
        this.pageSet_.add(pc, opt_index);
      }
      remove(index) {
        this.pageSet_.remove(this.pageSet_.items[index]);
      }
      onPageAdd_(ev) {
        const pc = ev.item;
        insertElementAt(this.view.itemsElement, pc.itemController.view.element, ev.index);
        this.rackController.rack.add(pc.contentController, ev.index);
        this.tab.add(pc.props.value("selected"));
      }
      onPageRemove_(ev) {
        const pc = ev.item;
        removeElement(pc.itemController.view.element);
        this.rackController.rack.remove(pc.contentController);
        this.tab.remove(pc.props.value("selected"));
      }
    }
    const TabBladePlugin = {
      id: "tab",
      type: "blade",
      accept(params) {
        const p2 = ParamsParsers;
        const result = parseParams(params, {
          pages: p2.required.array(p2.required.object({ title: p2.required.string })),
          view: p2.required.constant("tab")
        });
        if (!result || result.pages.length === 0) {
          return null;
        }
        return { params: result };
      },
      controller(args) {
        const c = new TabController(args.document, {
          blade: args.blade,
          viewProps: args.viewProps
        });
        args.params.pages.forEach((p2) => {
          const pc = new TabPageController(args.document, {
            itemProps: ValueMap.fromObject({
              selected: false,
              title: p2.title
            }),
            props: ValueMap.fromObject({
              selected: false
            })
          });
          c.add(pc);
        });
        return c;
      },
      api(args) {
        if (!(args.controller instanceof TabController)) {
          return null;
        }
        return new TabApi(args.controller, args.pool);
      }
    };
    function createBladeController(plugin, args) {
      const ac = plugin.accept(args.params);
      if (!ac) {
        return null;
      }
      const disabled = ParamsParsers.optional.boolean(args.params["disabled"]).value;
      const hidden = ParamsParsers.optional.boolean(args.params["hidden"]).value;
      return plugin.controller({
        blade: createBlade(),
        document: args.document,
        params: forceCast(Object.assign(Object.assign({}, ac.params), { disabled, hidden })),
        viewProps: ViewProps.create({
          disabled,
          hidden
        })
      });
    }
    class ManualTicker {
      constructor() {
        this.disabled = false;
        this.emitter = new Emitter();
      }
      dispose() {
      }
      tick() {
        if (this.disabled) {
          return;
        }
        this.emitter.emit("tick", {
          sender: this
        });
      }
    }
    class IntervalTicker {
      constructor(doc2, interval) {
        this.disabled_ = false;
        this.timerId_ = null;
        this.onTick_ = this.onTick_.bind(this);
        this.doc_ = doc2;
        this.emitter = new Emitter();
        this.interval_ = interval;
        this.setTimer_();
      }
      get disabled() {
        return this.disabled_;
      }
      set disabled(inactive) {
        this.disabled_ = inactive;
        if (this.disabled_) {
          this.clearTimer_();
        } else {
          this.setTimer_();
        }
      }
      dispose() {
        this.clearTimer_();
      }
      clearTimer_() {
        if (this.timerId_ === null) {
          return;
        }
        const win = this.doc_.defaultView;
        if (win) {
          win.clearInterval(this.timerId_);
        }
        this.timerId_ = null;
      }
      setTimer_() {
        this.clearTimer_();
        if (this.interval_ <= 0) {
          return;
        }
        const win = this.doc_.defaultView;
        if (win) {
          this.timerId_ = win.setInterval(this.onTick_, this.interval_);
        }
      }
      onTick_() {
        if (this.disabled_) {
          return;
        }
        this.emitter.emit("tick", {
          sender: this
        });
      }
    }
    class CompositeConstraint {
      constructor(constraints) {
        this.constraints = constraints;
      }
      constrain(value) {
        return this.constraints.reduce((result, c) => {
          return c.constrain(result);
        }, value);
      }
    }
    function findConstraint(c, constraintClass) {
      if (c instanceof constraintClass) {
        return c;
      }
      if (c instanceof CompositeConstraint) {
        const result = c.constraints.reduce((tmpResult, sc) => {
          if (tmpResult) {
            return tmpResult;
          }
          return sc instanceof constraintClass ? sc : null;
        }, null);
        if (result) {
          return result;
        }
      }
      return null;
    }
    class ListConstraint {
      constructor(options) {
        this.options = options;
      }
      constrain(value) {
        const opts = this.options;
        if (opts.length === 0) {
          return value;
        }
        const matched = opts.filter((item) => {
          return item.value === value;
        }).length > 0;
        return matched ? value : opts[0].value;
      }
    }
    class RangeConstraint {
      constructor(config) {
        this.maxValue = config.max;
        this.minValue = config.min;
      }
      constrain(value) {
        let result = value;
        if (!isEmpty(this.minValue)) {
          result = Math.max(result, this.minValue);
        }
        if (!isEmpty(this.maxValue)) {
          result = Math.min(result, this.maxValue);
        }
        return result;
      }
    }
    class StepConstraint {
      constructor(step, origin = 0) {
        this.step = step;
        this.origin = origin;
      }
      constrain(value) {
        const o = this.origin % this.step;
        const r = Math.round((value - o) / this.step);
        return o + r * this.step;
      }
    }
    const className$j = ClassName("lst");
    class ListView {
      constructor(doc2, config) {
        this.onValueChange_ = this.onValueChange_.bind(this);
        this.props_ = config.props;
        this.element = doc2.createElement("div");
        this.element.classList.add(className$j());
        config.viewProps.bindClassModifiers(this.element);
        const selectElem = doc2.createElement("select");
        selectElem.classList.add(className$j("s"));
        bindValueMap(this.props_, "options", (opts) => {
          removeChildElements(selectElem);
          opts.forEach((item, index) => {
            const optionElem = doc2.createElement("option");
            optionElem.dataset.index = String(index);
            optionElem.textContent = item.text;
            optionElem.value = String(item.value);
            selectElem.appendChild(optionElem);
          });
        });
        config.viewProps.bindDisabled(selectElem);
        this.element.appendChild(selectElem);
        this.selectElement = selectElem;
        const markElem = doc2.createElement("div");
        markElem.classList.add(className$j("m"));
        markElem.appendChild(createSvgIconElement(doc2, "dropdown"));
        this.element.appendChild(markElem);
        config.value.emitter.on("change", this.onValueChange_);
        this.value_ = config.value;
        this.update_();
      }
      update_() {
        this.selectElement.value = String(this.value_.rawValue);
      }
      onValueChange_() {
        this.update_();
      }
    }
    class ListController {
      constructor(doc2, config) {
        this.onSelectChange_ = this.onSelectChange_.bind(this);
        this.props = config.props;
        this.value = config.value;
        this.viewProps = config.viewProps;
        this.view = new ListView(doc2, {
          props: this.props,
          value: this.value,
          viewProps: this.viewProps
        });
        this.view.selectElement.addEventListener("change", this.onSelectChange_);
      }
      onSelectChange_(e) {
        const selectElem = forceCast(e.currentTarget);
        const optElem = selectElem.selectedOptions.item(0);
        if (!optElem) {
          return;
        }
        const itemIndex = Number(optElem.dataset.index);
        this.value.rawValue = this.props.get("options")[itemIndex].value;
      }
    }
    const className$i = ClassName("pop");
    class PopupView {
      constructor(doc2, config) {
        this.element = doc2.createElement("div");
        this.element.classList.add(className$i());
        config.viewProps.bindClassModifiers(this.element);
        bindValue(config.shows, valueToClassName(this.element, className$i(void 0, "v")));
      }
    }
    class PopupController {
      constructor(doc2, config) {
        this.shows = createValue(false);
        this.viewProps = config.viewProps;
        this.view = new PopupView(doc2, {
          shows: this.shows,
          viewProps: this.viewProps
        });
      }
    }
    const className$h = ClassName("txt");
    class TextView {
      constructor(doc2, config) {
        this.onChange_ = this.onChange_.bind(this);
        this.element = doc2.createElement("div");
        this.element.classList.add(className$h());
        config.viewProps.bindClassModifiers(this.element);
        this.props_ = config.props;
        this.props_.emitter.on("change", this.onChange_);
        const inputElem = doc2.createElement("input");
        inputElem.classList.add(className$h("i"));
        inputElem.type = "text";
        config.viewProps.bindDisabled(inputElem);
        this.element.appendChild(inputElem);
        this.inputElement = inputElem;
        config.value.emitter.on("change", this.onChange_);
        this.value_ = config.value;
        this.refresh();
      }
      refresh() {
        const formatter = this.props_.get("formatter");
        this.inputElement.value = formatter(this.value_.rawValue);
      }
      onChange_() {
        this.refresh();
      }
    }
    class TextController {
      constructor(doc2, config) {
        this.onInputChange_ = this.onInputChange_.bind(this);
        this.parser_ = config.parser;
        this.props = config.props;
        this.value = config.value;
        this.viewProps = config.viewProps;
        this.view = new TextView(doc2, {
          props: config.props,
          value: this.value,
          viewProps: this.viewProps
        });
        this.view.inputElement.addEventListener("change", this.onInputChange_);
      }
      onInputChange_(e) {
        const inputElem = forceCast(e.currentTarget);
        const value = inputElem.value;
        const parsedValue = this.parser_(value);
        if (!isEmpty(parsedValue)) {
          this.value.rawValue = parsedValue;
        }
        this.view.refresh();
      }
    }
    function boolToString(value) {
      return String(value);
    }
    function boolFromUnknown(value) {
      if (value === "false") {
        return false;
      }
      return !!value;
    }
    function BooleanFormatter(value) {
      return boolToString(value);
    }
    class NumberLiteralNode {
      constructor(text) {
        this.text = text;
      }
      evaluate() {
        return Number(this.text);
      }
      toString() {
        return this.text;
      }
    }
    const BINARY_OPERATION_MAP = {
      "**": (v1, v2) => Math.pow(v1, v2),
      "*": (v1, v2) => v1 * v2,
      "/": (v1, v2) => v1 / v2,
      "%": (v1, v2) => v1 % v2,
      "+": (v1, v2) => v1 + v2,
      "-": (v1, v2) => v1 - v2,
      "<<": (v1, v2) => v1 << v2,
      ">>": (v1, v2) => v1 >> v2,
      ">>>": (v1, v2) => v1 >>> v2,
      "&": (v1, v2) => v1 & v2,
      "^": (v1, v2) => v1 ^ v2,
      "|": (v1, v2) => v1 | v2
    };
    class BinaryOperationNode {
      constructor(operator, left, right) {
        this.left = left;
        this.operator = operator;
        this.right = right;
      }
      evaluate() {
        const op = BINARY_OPERATION_MAP[this.operator];
        if (!op) {
          throw new Error(`unexpected binary operator: '${this.operator}`);
        }
        return op(this.left.evaluate(), this.right.evaluate());
      }
      toString() {
        return [
          "b(",
          this.left.toString(),
          this.operator,
          this.right.toString(),
          ")"
        ].join(" ");
      }
    }
    const UNARY_OPERATION_MAP = {
      "+": (v) => v,
      "-": (v) => -v,
      "~": (v) => ~v
    };
    class UnaryOperationNode {
      constructor(operator, expr) {
        this.operator = operator;
        this.expression = expr;
      }
      evaluate() {
        const op = UNARY_OPERATION_MAP[this.operator];
        if (!op) {
          throw new Error(`unexpected unary operator: '${this.operator}`);
        }
        return op(this.expression.evaluate());
      }
      toString() {
        return ["u(", this.operator, this.expression.toString(), ")"].join(" ");
      }
    }
    function combineReader(parsers) {
      return (text, cursor) => {
        for (let i = 0; i < parsers.length; i++) {
          const result = parsers[i](text, cursor);
          if (result !== "") {
            return result;
          }
        }
        return "";
      };
    }
    function readWhitespace(text, cursor) {
      var _a2;
      const m = text.substr(cursor).match(/^\s+/);
      return (_a2 = m && m[0]) !== null && _a2 !== void 0 ? _a2 : "";
    }
    function readNonZeroDigit(text, cursor) {
      const ch = text.substr(cursor, 1);
      return ch.match(/^[1-9]$/) ? ch : "";
    }
    function readDecimalDigits(text, cursor) {
      var _a2;
      const m = text.substr(cursor).match(/^[0-9]+/);
      return (_a2 = m && m[0]) !== null && _a2 !== void 0 ? _a2 : "";
    }
    function readSignedInteger(text, cursor) {
      const ds = readDecimalDigits(text, cursor);
      if (ds !== "") {
        return ds;
      }
      const sign = text.substr(cursor, 1);
      cursor += 1;
      if (sign !== "-" && sign !== "+") {
        return "";
      }
      const sds = readDecimalDigits(text, cursor);
      if (sds === "") {
        return "";
      }
      return sign + sds;
    }
    function readExponentPart(text, cursor) {
      const e = text.substr(cursor, 1);
      cursor += 1;
      if (e.toLowerCase() !== "e") {
        return "";
      }
      const si = readSignedInteger(text, cursor);
      if (si === "") {
        return "";
      }
      return e + si;
    }
    function readDecimalIntegerLiteral(text, cursor) {
      const ch = text.substr(cursor, 1);
      if (ch === "0") {
        return ch;
      }
      const nzd = readNonZeroDigit(text, cursor);
      cursor += nzd.length;
      if (nzd === "") {
        return "";
      }
      return nzd + readDecimalDigits(text, cursor);
    }
    function readDecimalLiteral1(text, cursor) {
      const dil = readDecimalIntegerLiteral(text, cursor);
      cursor += dil.length;
      if (dil === "") {
        return "";
      }
      const dot = text.substr(cursor, 1);
      cursor += dot.length;
      if (dot !== ".") {
        return "";
      }
      const dds = readDecimalDigits(text, cursor);
      cursor += dds.length;
      return dil + dot + dds + readExponentPart(text, cursor);
    }
    function readDecimalLiteral2(text, cursor) {
      const dot = text.substr(cursor, 1);
      cursor += dot.length;
      if (dot !== ".") {
        return "";
      }
      const dds = readDecimalDigits(text, cursor);
      cursor += dds.length;
      if (dds === "") {
        return "";
      }
      return dot + dds + readExponentPart(text, cursor);
    }
    function readDecimalLiteral3(text, cursor) {
      const dil = readDecimalIntegerLiteral(text, cursor);
      cursor += dil.length;
      if (dil === "") {
        return "";
      }
      return dil + readExponentPart(text, cursor);
    }
    const readDecimalLiteral = combineReader([
      readDecimalLiteral1,
      readDecimalLiteral2,
      readDecimalLiteral3
    ]);
    function parseBinaryDigits(text, cursor) {
      var _a2;
      const m = text.substr(cursor).match(/^[01]+/);
      return (_a2 = m && m[0]) !== null && _a2 !== void 0 ? _a2 : "";
    }
    function readBinaryIntegerLiteral(text, cursor) {
      const prefix = text.substr(cursor, 2);
      cursor += prefix.length;
      if (prefix.toLowerCase() !== "0b") {
        return "";
      }
      const bds = parseBinaryDigits(text, cursor);
      if (bds === "") {
        return "";
      }
      return prefix + bds;
    }
    function readOctalDigits(text, cursor) {
      var _a2;
      const m = text.substr(cursor).match(/^[0-7]+/);
      return (_a2 = m && m[0]) !== null && _a2 !== void 0 ? _a2 : "";
    }
    function readOctalIntegerLiteral(text, cursor) {
      const prefix = text.substr(cursor, 2);
      cursor += prefix.length;
      if (prefix.toLowerCase() !== "0o") {
        return "";
      }
      const ods = readOctalDigits(text, cursor);
      if (ods === "") {
        return "";
      }
      return prefix + ods;
    }
    function readHexDigits(text, cursor) {
      var _a2;
      const m = text.substr(cursor).match(/^[0-9a-f]+/i);
      return (_a2 = m && m[0]) !== null && _a2 !== void 0 ? _a2 : "";
    }
    function readHexIntegerLiteral(text, cursor) {
      const prefix = text.substr(cursor, 2);
      cursor += prefix.length;
      if (prefix.toLowerCase() !== "0x") {
        return "";
      }
      const hds = readHexDigits(text, cursor);
      if (hds === "") {
        return "";
      }
      return prefix + hds;
    }
    const readNonDecimalIntegerLiteral = combineReader([
      readBinaryIntegerLiteral,
      readOctalIntegerLiteral,
      readHexIntegerLiteral
    ]);
    const readNumericLiteral = combineReader([
      readNonDecimalIntegerLiteral,
      readDecimalLiteral
    ]);
    function parseLiteral(text, cursor) {
      const num = readNumericLiteral(text, cursor);
      cursor += num.length;
      if (num === "") {
        return null;
      }
      return {
        evaluable: new NumberLiteralNode(num),
        cursor
      };
    }
    function parseParenthesizedExpression(text, cursor) {
      const op = text.substr(cursor, 1);
      cursor += op.length;
      if (op !== "(") {
        return null;
      }
      const expr = parseExpression(text, cursor);
      if (!expr) {
        return null;
      }
      cursor = expr.cursor;
      cursor += readWhitespace(text, cursor).length;
      const cl = text.substr(cursor, 1);
      cursor += cl.length;
      if (cl !== ")") {
        return null;
      }
      return {
        evaluable: expr.evaluable,
        cursor
      };
    }
    function parsePrimaryExpression(text, cursor) {
      var _a2;
      return (_a2 = parseLiteral(text, cursor)) !== null && _a2 !== void 0 ? _a2 : parseParenthesizedExpression(text, cursor);
    }
    function parseUnaryExpression(text, cursor) {
      const expr = parsePrimaryExpression(text, cursor);
      if (expr) {
        return expr;
      }
      const op = text.substr(cursor, 1);
      cursor += op.length;
      if (op !== "+" && op !== "-" && op !== "~") {
        return null;
      }
      const num = parseUnaryExpression(text, cursor);
      if (!num) {
        return null;
      }
      cursor = num.cursor;
      return {
        cursor,
        evaluable: new UnaryOperationNode(op, num.evaluable)
      };
    }
    function readBinaryOperator(ops, text, cursor) {
      cursor += readWhitespace(text, cursor).length;
      const op = ops.filter((op2) => text.startsWith(op2, cursor))[0];
      if (!op) {
        return null;
      }
      cursor += op.length;
      cursor += readWhitespace(text, cursor).length;
      return {
        cursor,
        operator: op
      };
    }
    function createBinaryOperationExpressionParser(exprParser, ops) {
      return (text, cursor) => {
        const firstExpr = exprParser(text, cursor);
        if (!firstExpr) {
          return null;
        }
        cursor = firstExpr.cursor;
        let expr = firstExpr.evaluable;
        for (; ; ) {
          const op = readBinaryOperator(ops, text, cursor);
          if (!op) {
            break;
          }
          cursor = op.cursor;
          const nextExpr = exprParser(text, cursor);
          if (!nextExpr) {
            return null;
          }
          cursor = nextExpr.cursor;
          expr = new BinaryOperationNode(op.operator, expr, nextExpr.evaluable);
        }
        return expr ? {
          cursor,
          evaluable: expr
        } : null;
      };
    }
    const parseBinaryOperationExpression = [
      ["**"],
      ["*", "/", "%"],
      ["+", "-"],
      ["<<", ">>>", ">>"],
      ["&"],
      ["^"],
      ["|"]
    ].reduce((parser, ops) => {
      return createBinaryOperationExpressionParser(parser, ops);
    }, parseUnaryExpression);
    function parseExpression(text, cursor) {
      cursor += readWhitespace(text, cursor).length;
      return parseBinaryOperationExpression(text, cursor);
    }
    function parseEcmaNumberExpression(text) {
      const expr = parseExpression(text, 0);
      if (!expr) {
        return null;
      }
      const cursor = expr.cursor + readWhitespace(text, expr.cursor).length;
      if (cursor !== text.length) {
        return null;
      }
      return expr.evaluable;
    }
    function parseNumber(text) {
      var _a2;
      const r = parseEcmaNumberExpression(text);
      return (_a2 = r === null || r === void 0 ? void 0 : r.evaluate()) !== null && _a2 !== void 0 ? _a2 : null;
    }
    function numberFromUnknown(value) {
      if (typeof value === "number") {
        return value;
      }
      if (typeof value === "string") {
        const pv = parseNumber(value);
        if (!isEmpty(pv)) {
          return pv;
        }
      }
      return 0;
    }
    function numberToString(value) {
      return String(value);
    }
    function createNumberFormatter(digits) {
      return (value) => {
        return value.toFixed(Math.max(Math.min(digits, 20), 0));
      };
    }
    const innerFormatter = createNumberFormatter(0);
    function formatPercentage(value) {
      return innerFormatter(value) + "%";
    }
    function stringFromUnknown(value) {
      return String(value);
    }
    function formatString(value) {
      return value;
    }
    function fillBuffer(buffer, bufferSize) {
      while (buffer.length < bufferSize) {
        buffer.push(void 0);
      }
    }
    function initializeBuffer(bufferSize) {
      const buffer = [];
      fillBuffer(buffer, bufferSize);
      return createValue(buffer);
    }
    function createTrimmedBuffer(buffer) {
      const index = buffer.indexOf(void 0);
      return forceCast(index < 0 ? buffer : buffer.slice(0, index));
    }
    function createPushedBuffer(buffer, newValue) {
      const newBuffer = [...createTrimmedBuffer(buffer), newValue];
      if (newBuffer.length > buffer.length) {
        newBuffer.splice(0, newBuffer.length - buffer.length);
      } else {
        fillBuffer(newBuffer, buffer.length);
      }
      return newBuffer;
    }
    function connectValues({ primary, secondary, forward, backward }) {
      let changing = false;
      function preventFeedback(callback) {
        if (changing) {
          return;
        }
        changing = true;
        callback();
        changing = false;
      }
      primary.emitter.on("change", (ev) => {
        preventFeedback(() => {
          secondary.setRawValue(forward(primary, secondary), ev.options);
        });
      });
      secondary.emitter.on("change", (ev) => {
        preventFeedback(() => {
          primary.setRawValue(backward(primary, secondary), ev.options);
        });
        preventFeedback(() => {
          secondary.setRawValue(forward(primary, secondary), ev.options);
        });
      });
      preventFeedback(() => {
        secondary.setRawValue(forward(primary, secondary), {
          forceEmit: false,
          last: true
        });
      });
    }
    function getStepForKey(baseStep, keys) {
      const step = baseStep * (keys.altKey ? 0.1 : 1) * (keys.shiftKey ? 10 : 1);
      if (keys.upKey) {
        return +step;
      } else if (keys.downKey) {
        return -step;
      }
      return 0;
    }
    function getVerticalStepKeys(ev) {
      return {
        altKey: ev.altKey,
        downKey: ev.key === "ArrowDown",
        shiftKey: ev.shiftKey,
        upKey: ev.key === "ArrowUp"
      };
    }
    function getHorizontalStepKeys(ev) {
      return {
        altKey: ev.altKey,
        downKey: ev.key === "ArrowLeft",
        shiftKey: ev.shiftKey,
        upKey: ev.key === "ArrowRight"
      };
    }
    function isVerticalArrowKey(key) {
      return key === "ArrowUp" || key === "ArrowDown";
    }
    function isArrowKey(key) {
      return isVerticalArrowKey(key) || key === "ArrowLeft" || key === "ArrowRight";
    }
    function computeOffset$1(ev, elem) {
      var _a2, _b;
      const win = elem.ownerDocument.defaultView;
      const rect = elem.getBoundingClientRect();
      return {
        x: ev.pageX - (((_a2 = win && win.scrollX) !== null && _a2 !== void 0 ? _a2 : 0) + rect.left),
        y: ev.pageY - (((_b = win && win.scrollY) !== null && _b !== void 0 ? _b : 0) + rect.top)
      };
    }
    class PointerHandler {
      constructor(element) {
        this.lastTouch_ = null;
        this.onDocumentMouseMove_ = this.onDocumentMouseMove_.bind(this);
        this.onDocumentMouseUp_ = this.onDocumentMouseUp_.bind(this);
        this.onMouseDown_ = this.onMouseDown_.bind(this);
        this.onTouchEnd_ = this.onTouchEnd_.bind(this);
        this.onTouchMove_ = this.onTouchMove_.bind(this);
        this.onTouchStart_ = this.onTouchStart_.bind(this);
        this.elem_ = element;
        this.emitter = new Emitter();
        element.addEventListener("touchstart", this.onTouchStart_, {
          passive: false
        });
        element.addEventListener("touchmove", this.onTouchMove_, {
          passive: true
        });
        element.addEventListener("touchend", this.onTouchEnd_);
        element.addEventListener("mousedown", this.onMouseDown_);
      }
      computePosition_(offset) {
        const rect = this.elem_.getBoundingClientRect();
        return {
          bounds: {
            width: rect.width,
            height: rect.height
          },
          point: offset ? {
            x: offset.x,
            y: offset.y
          } : null
        };
      }
      onMouseDown_(ev) {
        var _a2;
        ev.preventDefault();
        (_a2 = ev.currentTarget) === null || _a2 === void 0 ? void 0 : _a2.focus();
        const doc2 = this.elem_.ownerDocument;
        doc2.addEventListener("mousemove", this.onDocumentMouseMove_);
        doc2.addEventListener("mouseup", this.onDocumentMouseUp_);
        this.emitter.emit("down", {
          altKey: ev.altKey,
          data: this.computePosition_(computeOffset$1(ev, this.elem_)),
          sender: this,
          shiftKey: ev.shiftKey
        });
      }
      onDocumentMouseMove_(ev) {
        this.emitter.emit("move", {
          altKey: ev.altKey,
          data: this.computePosition_(computeOffset$1(ev, this.elem_)),
          sender: this,
          shiftKey: ev.shiftKey
        });
      }
      onDocumentMouseUp_(ev) {
        const doc2 = this.elem_.ownerDocument;
        doc2.removeEventListener("mousemove", this.onDocumentMouseMove_);
        doc2.removeEventListener("mouseup", this.onDocumentMouseUp_);
        this.emitter.emit("up", {
          altKey: ev.altKey,
          data: this.computePosition_(computeOffset$1(ev, this.elem_)),
          sender: this,
          shiftKey: ev.shiftKey
        });
      }
      onTouchStart_(ev) {
        ev.preventDefault();
        const touch = ev.targetTouches.item(0);
        const rect = this.elem_.getBoundingClientRect();
        this.emitter.emit("down", {
          altKey: ev.altKey,
          data: this.computePosition_(touch ? {
            x: touch.clientX - rect.left,
            y: touch.clientY - rect.top
          } : void 0),
          sender: this,
          shiftKey: ev.shiftKey
        });
        this.lastTouch_ = touch;
      }
      onTouchMove_(ev) {
        const touch = ev.targetTouches.item(0);
        const rect = this.elem_.getBoundingClientRect();
        this.emitter.emit("move", {
          altKey: ev.altKey,
          data: this.computePosition_(touch ? {
            x: touch.clientX - rect.left,
            y: touch.clientY - rect.top
          } : void 0),
          sender: this,
          shiftKey: ev.shiftKey
        });
        this.lastTouch_ = touch;
      }
      onTouchEnd_(ev) {
        var _a2;
        const touch = (_a2 = ev.targetTouches.item(0)) !== null && _a2 !== void 0 ? _a2 : this.lastTouch_;
        const rect = this.elem_.getBoundingClientRect();
        this.emitter.emit("up", {
          altKey: ev.altKey,
          data: this.computePosition_(touch ? {
            x: touch.clientX - rect.left,
            y: touch.clientY - rect.top
          } : void 0),
          sender: this,
          shiftKey: ev.shiftKey
        });
      }
    }
    function mapRange(value, start1, end1, start2, end2) {
      const p2 = (value - start1) / (end1 - start1);
      return start2 + p2 * (end2 - start2);
    }
    function getDecimalDigits(value) {
      const text = String(value.toFixed(10));
      const frac = text.split(".")[1];
      return frac.replace(/0+$/, "").length;
    }
    function constrainRange(value, min, max) {
      return Math.min(Math.max(value, min), max);
    }
    function loopRange(value, max) {
      return (value % max + max) % max;
    }
    const className$g = ClassName("txt");
    class NumberTextView {
      constructor(doc2, config) {
        this.onChange_ = this.onChange_.bind(this);
        this.props_ = config.props;
        this.props_.emitter.on("change", this.onChange_);
        this.element = doc2.createElement("div");
        this.element.classList.add(className$g(), className$g(void 0, "num"));
        if (config.arrayPosition) {
          this.element.classList.add(className$g(void 0, config.arrayPosition));
        }
        config.viewProps.bindClassModifiers(this.element);
        const inputElem = doc2.createElement("input");
        inputElem.classList.add(className$g("i"));
        inputElem.type = "text";
        config.viewProps.bindDisabled(inputElem);
        this.element.appendChild(inputElem);
        this.inputElement = inputElem;
        this.onDraggingChange_ = this.onDraggingChange_.bind(this);
        this.dragging_ = config.dragging;
        this.dragging_.emitter.on("change", this.onDraggingChange_);
        this.element.classList.add(className$g());
        this.inputElement.classList.add(className$g("i"));
        const knobElem = doc2.createElement("div");
        knobElem.classList.add(className$g("k"));
        this.element.appendChild(knobElem);
        this.knobElement = knobElem;
        const guideElem = doc2.createElementNS(SVG_NS, "svg");
        guideElem.classList.add(className$g("g"));
        this.knobElement.appendChild(guideElem);
        const bodyElem = doc2.createElementNS(SVG_NS, "path");
        bodyElem.classList.add(className$g("gb"));
        guideElem.appendChild(bodyElem);
        this.guideBodyElem_ = bodyElem;
        const headElem = doc2.createElementNS(SVG_NS, "path");
        headElem.classList.add(className$g("gh"));
        guideElem.appendChild(headElem);
        this.guideHeadElem_ = headElem;
        const tooltipElem = doc2.createElement("div");
        tooltipElem.classList.add(ClassName("tt")());
        this.knobElement.appendChild(tooltipElem);
        this.tooltipElem_ = tooltipElem;
        config.value.emitter.on("change", this.onChange_);
        this.value = config.value;
        this.refresh();
      }
      onDraggingChange_(ev) {
        if (ev.rawValue === null) {
          this.element.classList.remove(className$g(void 0, "drg"));
          return;
        }
        this.element.classList.add(className$g(void 0, "drg"));
        const x = ev.rawValue / this.props_.get("draggingScale");
        const aox = x + (x > 0 ? -1 : x < 0 ? 1 : 0);
        const adx = constrainRange(-aox, -4, 4);
        this.guideHeadElem_.setAttributeNS(null, "d", [`M ${aox + adx},0 L${aox},4 L${aox + adx},8`, `M ${x},-1 L${x},9`].join(" "));
        this.guideBodyElem_.setAttributeNS(null, "d", `M 0,4 L${x},4`);
        const formatter = this.props_.get("formatter");
        this.tooltipElem_.textContent = formatter(this.value.rawValue);
        this.tooltipElem_.style.left = `${x}px`;
      }
      refresh() {
        const formatter = this.props_.get("formatter");
        this.inputElement.value = formatter(this.value.rawValue);
      }
      onChange_() {
        this.refresh();
      }
    }
    class NumberTextController {
      constructor(doc2, config) {
        var _a2;
        this.originRawValue_ = 0;
        this.onInputChange_ = this.onInputChange_.bind(this);
        this.onInputKeyDown_ = this.onInputKeyDown_.bind(this);
        this.onInputKeyUp_ = this.onInputKeyUp_.bind(this);
        this.onPointerDown_ = this.onPointerDown_.bind(this);
        this.onPointerMove_ = this.onPointerMove_.bind(this);
        this.onPointerUp_ = this.onPointerUp_.bind(this);
        this.baseStep_ = config.baseStep;
        this.parser_ = config.parser;
        this.props = config.props;
        this.sliderProps_ = (_a2 = config.sliderProps) !== null && _a2 !== void 0 ? _a2 : null;
        this.value = config.value;
        this.viewProps = config.viewProps;
        this.dragging_ = createValue(null);
        this.view = new NumberTextView(doc2, {
          arrayPosition: config.arrayPosition,
          dragging: this.dragging_,
          props: this.props,
          value: this.value,
          viewProps: this.viewProps
        });
        this.view.inputElement.addEventListener("change", this.onInputChange_);
        this.view.inputElement.addEventListener("keydown", this.onInputKeyDown_);
        this.view.inputElement.addEventListener("keyup", this.onInputKeyUp_);
        const ph = new PointerHandler(this.view.knobElement);
        ph.emitter.on("down", this.onPointerDown_);
        ph.emitter.on("move", this.onPointerMove_);
        ph.emitter.on("up", this.onPointerUp_);
      }
      constrainValue_(value) {
        var _a2, _b;
        const min = (_a2 = this.sliderProps_) === null || _a2 === void 0 ? void 0 : _a2.get("minValue");
        const max = (_b = this.sliderProps_) === null || _b === void 0 ? void 0 : _b.get("maxValue");
        let v = value;
        if (min !== void 0) {
          v = Math.max(v, min);
        }
        if (max !== void 0) {
          v = Math.min(v, max);
        }
        return v;
      }
      onInputChange_(e) {
        const inputElem = forceCast(e.currentTarget);
        const value = inputElem.value;
        const parsedValue = this.parser_(value);
        if (!isEmpty(parsedValue)) {
          this.value.rawValue = this.constrainValue_(parsedValue);
        }
        this.view.refresh();
      }
      onInputKeyDown_(ev) {
        const step = getStepForKey(this.baseStep_, getVerticalStepKeys(ev));
        if (step === 0) {
          return;
        }
        this.value.setRawValue(this.constrainValue_(this.value.rawValue + step), {
          forceEmit: false,
          last: false
        });
      }
      onInputKeyUp_(ev) {
        const step = getStepForKey(this.baseStep_, getVerticalStepKeys(ev));
        if (step === 0) {
          return;
        }
        this.value.setRawValue(this.value.rawValue, {
          forceEmit: true,
          last: true
        });
      }
      onPointerDown_() {
        this.originRawValue_ = this.value.rawValue;
        this.dragging_.rawValue = 0;
      }
      computeDraggingValue_(data) {
        if (!data.point) {
          return null;
        }
        const dx = data.point.x - data.bounds.width / 2;
        return this.constrainValue_(this.originRawValue_ + dx * this.props.get("draggingScale"));
      }
      onPointerMove_(ev) {
        const v = this.computeDraggingValue_(ev.data);
        if (v === null) {
          return;
        }
        this.value.setRawValue(v, {
          forceEmit: false,
          last: false
        });
        this.dragging_.rawValue = this.value.rawValue - this.originRawValue_;
      }
      onPointerUp_(ev) {
        const v = this.computeDraggingValue_(ev.data);
        if (v === null) {
          return;
        }
        this.value.setRawValue(v, {
          forceEmit: true,
          last: true
        });
        this.dragging_.rawValue = null;
      }
    }
    const className$f = ClassName("sld");
    class SliderView {
      constructor(doc2, config) {
        this.onChange_ = this.onChange_.bind(this);
        this.props_ = config.props;
        this.props_.emitter.on("change", this.onChange_);
        this.element = doc2.createElement("div");
        this.element.classList.add(className$f());
        config.viewProps.bindClassModifiers(this.element);
        const trackElem = doc2.createElement("div");
        trackElem.classList.add(className$f("t"));
        config.viewProps.bindTabIndex(trackElem);
        this.element.appendChild(trackElem);
        this.trackElement = trackElem;
        const knobElem = doc2.createElement("div");
        knobElem.classList.add(className$f("k"));
        this.trackElement.appendChild(knobElem);
        this.knobElement = knobElem;
        config.value.emitter.on("change", this.onChange_);
        this.value = config.value;
        this.update_();
      }
      update_() {
        const p2 = constrainRange(mapRange(this.value.rawValue, this.props_.get("minValue"), this.props_.get("maxValue"), 0, 100), 0, 100);
        this.knobElement.style.width = `${p2}%`;
      }
      onChange_() {
        this.update_();
      }
    }
    class SliderController {
      constructor(doc2, config) {
        this.onKeyDown_ = this.onKeyDown_.bind(this);
        this.onKeyUp_ = this.onKeyUp_.bind(this);
        this.onPointerDownOrMove_ = this.onPointerDownOrMove_.bind(this);
        this.onPointerUp_ = this.onPointerUp_.bind(this);
        this.baseStep_ = config.baseStep;
        this.value = config.value;
        this.viewProps = config.viewProps;
        this.props = config.props;
        this.view = new SliderView(doc2, {
          props: this.props,
          value: this.value,
          viewProps: this.viewProps
        });
        this.ptHandler_ = new PointerHandler(this.view.trackElement);
        this.ptHandler_.emitter.on("down", this.onPointerDownOrMove_);
        this.ptHandler_.emitter.on("move", this.onPointerDownOrMove_);
        this.ptHandler_.emitter.on("up", this.onPointerUp_);
        this.view.trackElement.addEventListener("keydown", this.onKeyDown_);
        this.view.trackElement.addEventListener("keyup", this.onKeyUp_);
      }
      handlePointerEvent_(d, opts) {
        if (!d.point) {
          return;
        }
        this.value.setRawValue(mapRange(constrainRange(d.point.x, 0, d.bounds.width), 0, d.bounds.width, this.props.get("minValue"), this.props.get("maxValue")), opts);
      }
      onPointerDownOrMove_(ev) {
        this.handlePointerEvent_(ev.data, {
          forceEmit: false,
          last: false
        });
      }
      onPointerUp_(ev) {
        this.handlePointerEvent_(ev.data, {
          forceEmit: true,
          last: true
        });
      }
      onKeyDown_(ev) {
        const step = getStepForKey(this.baseStep_, getHorizontalStepKeys(ev));
        if (step === 0) {
          return;
        }
        this.value.setRawValue(this.value.rawValue + step, {
          forceEmit: false,
          last: false
        });
      }
      onKeyUp_(ev) {
        const step = getStepForKey(this.baseStep_, getHorizontalStepKeys(ev));
        if (step === 0) {
          return;
        }
        this.value.setRawValue(this.value.rawValue, {
          forceEmit: true,
          last: true
        });
      }
    }
    const className$e = ClassName("sldtxt");
    class SliderTextView {
      constructor(doc2, config) {
        this.element = doc2.createElement("div");
        this.element.classList.add(className$e());
        const sliderElem = doc2.createElement("div");
        sliderElem.classList.add(className$e("s"));
        this.sliderView_ = config.sliderView;
        sliderElem.appendChild(this.sliderView_.element);
        this.element.appendChild(sliderElem);
        const textElem = doc2.createElement("div");
        textElem.classList.add(className$e("t"));
        this.textView_ = config.textView;
        textElem.appendChild(this.textView_.element);
        this.element.appendChild(textElem);
      }
    }
    class SliderTextController {
      constructor(doc2, config) {
        this.value = config.value;
        this.viewProps = config.viewProps;
        this.sliderC_ = new SliderController(doc2, {
          baseStep: config.baseStep,
          props: config.sliderProps,
          value: config.value,
          viewProps: this.viewProps
        });
        this.textC_ = new NumberTextController(doc2, {
          baseStep: config.baseStep,
          parser: config.parser,
          props: config.textProps,
          sliderProps: config.sliderProps,
          value: config.value,
          viewProps: config.viewProps
        });
        this.view = new SliderTextView(doc2, {
          sliderView: this.sliderC_.view,
          textView: this.textC_.view
        });
      }
      get sliderController() {
        return this.sliderC_;
      }
      get textController() {
        return this.textC_;
      }
    }
    function writePrimitive(target, value) {
      target.write(value);
    }
    function parseListOptions(value) {
      const p2 = ParamsParsers;
      if (Array.isArray(value)) {
        return p2.required.array(p2.required.object({
          text: p2.required.string,
          value: p2.required.raw
        }))(value).value;
      }
      if (typeof value === "object") {
        return p2.required.raw(value).value;
      }
      return void 0;
    }
    function parsePickerLayout(value) {
      if (value === "inline" || value === "popup") {
        return value;
      }
      return void 0;
    }
    function parsePointDimensionParams(value) {
      const p2 = ParamsParsers;
      return p2.required.object({
        max: p2.optional.number,
        min: p2.optional.number,
        step: p2.optional.number
      })(value).value;
    }
    function normalizeListOptions(options) {
      if (Array.isArray(options)) {
        return options;
      }
      const items = [];
      Object.keys(options).forEach((text) => {
        items.push({ text, value: options[text] });
      });
      return items;
    }
    function createListConstraint(options) {
      return !isEmpty(options) ? new ListConstraint(normalizeListOptions(forceCast(options))) : null;
    }
    function findListItems(constraint) {
      const c = constraint ? findConstraint(constraint, ListConstraint) : null;
      if (!c) {
        return null;
      }
      return c.options;
    }
    function findStep(constraint) {
      const c = constraint ? findConstraint(constraint, StepConstraint) : null;
      if (!c) {
        return null;
      }
      return c.step;
    }
    function getSuitableDecimalDigits(constraint, rawValue) {
      const sc = constraint && findConstraint(constraint, StepConstraint);
      if (sc) {
        return getDecimalDigits(sc.step);
      }
      return Math.max(getDecimalDigits(rawValue), 2);
    }
    function getBaseStep(constraint) {
      const step = findStep(constraint);
      return step !== null && step !== void 0 ? step : 1;
    }
    function getSuitableDraggingScale(constraint, rawValue) {
      var _a2;
      const sc = constraint && findConstraint(constraint, StepConstraint);
      const base = Math.abs((_a2 = sc === null || sc === void 0 ? void 0 : sc.step) !== null && _a2 !== void 0 ? _a2 : rawValue);
      return base === 0 ? 0.1 : Math.pow(10, Math.floor(Math.log10(base)) - 1);
    }
    const className$d = ClassName("ckb");
    class CheckboxView {
      constructor(doc2, config) {
        this.onValueChange_ = this.onValueChange_.bind(this);
        this.element = doc2.createElement("div");
        this.element.classList.add(className$d());
        config.viewProps.bindClassModifiers(this.element);
        const labelElem = doc2.createElement("label");
        labelElem.classList.add(className$d("l"));
        this.element.appendChild(labelElem);
        const inputElem = doc2.createElement("input");
        inputElem.classList.add(className$d("i"));
        inputElem.type = "checkbox";
        labelElem.appendChild(inputElem);
        this.inputElement = inputElem;
        config.viewProps.bindDisabled(this.inputElement);
        const wrapperElem = doc2.createElement("div");
        wrapperElem.classList.add(className$d("w"));
        labelElem.appendChild(wrapperElem);
        const markElem = createSvgIconElement(doc2, "check");
        wrapperElem.appendChild(markElem);
        config.value.emitter.on("change", this.onValueChange_);
        this.value = config.value;
        this.update_();
      }
      update_() {
        this.inputElement.checked = this.value.rawValue;
      }
      onValueChange_() {
        this.update_();
      }
    }
    class CheckboxController {
      constructor(doc2, config) {
        this.onInputChange_ = this.onInputChange_.bind(this);
        this.value = config.value;
        this.viewProps = config.viewProps;
        this.view = new CheckboxView(doc2, {
          value: this.value,
          viewProps: this.viewProps
        });
        this.view.inputElement.addEventListener("change", this.onInputChange_);
      }
      onInputChange_(e) {
        const inputElem = forceCast(e.currentTarget);
        this.value.rawValue = inputElem.checked;
      }
    }
    function createConstraint$6(params) {
      const constraints = [];
      const lc = createListConstraint(params.options);
      if (lc) {
        constraints.push(lc);
      }
      return new CompositeConstraint(constraints);
    }
    const BooleanInputPlugin = {
      id: "input-bool",
      type: "input",
      accept: (value, params) => {
        if (typeof value !== "boolean") {
          return null;
        }
        const p2 = ParamsParsers;
        const result = parseParams(params, {
          options: p2.optional.custom(parseListOptions)
        });
        return result ? {
          initialValue: value,
          params: result
        } : null;
      },
      binding: {
        reader: (_args) => boolFromUnknown,
        constraint: (args) => createConstraint$6(args.params),
        writer: (_args) => writePrimitive
      },
      controller: (args) => {
        var _a2;
        const doc2 = args.document;
        const value = args.value;
        const c = args.constraint;
        if (c && findConstraint(c, ListConstraint)) {
          return new ListController(doc2, {
            props: ValueMap.fromObject({
              options: (_a2 = findListItems(c)) !== null && _a2 !== void 0 ? _a2 : []
            }),
            value,
            viewProps: args.viewProps
          });
        }
        return new CheckboxController(doc2, {
          value,
          viewProps: args.viewProps
        });
      }
    };
    const className$c = ClassName("col");
    class ColorView {
      constructor(doc2, config) {
        this.element = doc2.createElement("div");
        this.element.classList.add(className$c());
        config.foldable.bindExpandedClass(this.element, className$c(void 0, "expanded"));
        bindValueMap(config.foldable, "completed", valueToClassName(this.element, className$c(void 0, "cpl")));
        const headElem = doc2.createElement("div");
        headElem.classList.add(className$c("h"));
        this.element.appendChild(headElem);
        const swatchElem = doc2.createElement("div");
        swatchElem.classList.add(className$c("s"));
        headElem.appendChild(swatchElem);
        this.swatchElement = swatchElem;
        const textElem = doc2.createElement("div");
        textElem.classList.add(className$c("t"));
        headElem.appendChild(textElem);
        this.textElement = textElem;
        if (config.pickerLayout === "inline") {
          const pickerElem = doc2.createElement("div");
          pickerElem.classList.add(className$c("p"));
          this.element.appendChild(pickerElem);
          this.pickerElement = pickerElem;
        } else {
          this.pickerElement = null;
        }
      }
    }
    function rgbToHslInt(r, g, b) {
      const rp = constrainRange(r / 255, 0, 1);
      const gp = constrainRange(g / 255, 0, 1);
      const bp = constrainRange(b / 255, 0, 1);
      const cmax = Math.max(rp, gp, bp);
      const cmin = Math.min(rp, gp, bp);
      const c = cmax - cmin;
      let h = 0;
      let s = 0;
      const l = (cmin + cmax) / 2;
      if (c !== 0) {
        s = c / (1 - Math.abs(cmax + cmin - 1));
        if (rp === cmax) {
          h = (gp - bp) / c;
        } else if (gp === cmax) {
          h = 2 + (bp - rp) / c;
        } else {
          h = 4 + (rp - gp) / c;
        }
        h = h / 6 + (h < 0 ? 1 : 0);
      }
      return [h * 360, s * 100, l * 100];
    }
    function hslToRgbInt(h, s, l) {
      const hp = (h % 360 + 360) % 360;
      const sp = constrainRange(s / 100, 0, 1);
      const lp = constrainRange(l / 100, 0, 1);
      const c = (1 - Math.abs(2 * lp - 1)) * sp;
      const x = c * (1 - Math.abs(hp / 60 % 2 - 1));
      const m = lp - c / 2;
      let rp, gp, bp;
      if (hp >= 0 && hp < 60) {
        [rp, gp, bp] = [c, x, 0];
      } else if (hp >= 60 && hp < 120) {
        [rp, gp, bp] = [x, c, 0];
      } else if (hp >= 120 && hp < 180) {
        [rp, gp, bp] = [0, c, x];
      } else if (hp >= 180 && hp < 240) {
        [rp, gp, bp] = [0, x, c];
      } else if (hp >= 240 && hp < 300) {
        [rp, gp, bp] = [x, 0, c];
      } else {
        [rp, gp, bp] = [c, 0, x];
      }
      return [(rp + m) * 255, (gp + m) * 255, (bp + m) * 255];
    }
    function rgbToHsvInt(r, g, b) {
      const rp = constrainRange(r / 255, 0, 1);
      const gp = constrainRange(g / 255, 0, 1);
      const bp = constrainRange(b / 255, 0, 1);
      const cmax = Math.max(rp, gp, bp);
      const cmin = Math.min(rp, gp, bp);
      const d = cmax - cmin;
      let h;
      if (d === 0) {
        h = 0;
      } else if (cmax === rp) {
        h = 60 * (((gp - bp) / d % 6 + 6) % 6);
      } else if (cmax === gp) {
        h = 60 * ((bp - rp) / d + 2);
      } else {
        h = 60 * ((rp - gp) / d + 4);
      }
      const s = cmax === 0 ? 0 : d / cmax;
      const v = cmax;
      return [h, s * 100, v * 100];
    }
    function hsvToRgbInt(h, s, v) {
      const hp = loopRange(h, 360);
      const sp = constrainRange(s / 100, 0, 1);
      const vp = constrainRange(v / 100, 0, 1);
      const c = vp * sp;
      const x = c * (1 - Math.abs(hp / 60 % 2 - 1));
      const m = vp - c;
      let rp, gp, bp;
      if (hp >= 0 && hp < 60) {
        [rp, gp, bp] = [c, x, 0];
      } else if (hp >= 60 && hp < 120) {
        [rp, gp, bp] = [x, c, 0];
      } else if (hp >= 120 && hp < 180) {
        [rp, gp, bp] = [0, c, x];
      } else if (hp >= 180 && hp < 240) {
        [rp, gp, bp] = [0, x, c];
      } else if (hp >= 240 && hp < 300) {
        [rp, gp, bp] = [x, 0, c];
      } else {
        [rp, gp, bp] = [c, 0, x];
      }
      return [(rp + m) * 255, (gp + m) * 255, (bp + m) * 255];
    }
    function hslToHsvInt(h, s, l) {
      const sd = l + s * (100 - Math.abs(2 * l - 100)) / (2 * 100);
      return [
        h,
        sd !== 0 ? s * (100 - Math.abs(2 * l - 100)) / sd : 0,
        l + s * (100 - Math.abs(2 * l - 100)) / (2 * 100)
      ];
    }
    function hsvToHslInt(h, s, v) {
      const sd = 100 - Math.abs(v * (200 - s) / 100 - 100);
      return [h, sd !== 0 ? s * v / sd : 0, v * (200 - s) / (2 * 100)];
    }
    function removeAlphaComponent(comps) {
      return [comps[0], comps[1], comps[2]];
    }
    function appendAlphaComponent(comps, alpha) {
      return [comps[0], comps[1], comps[2], alpha];
    }
    const MODE_CONVERTER_MAP = {
      hsl: {
        hsl: (h, s, l) => [h, s, l],
        hsv: hslToHsvInt,
        rgb: hslToRgbInt
      },
      hsv: {
        hsl: hsvToHslInt,
        hsv: (h, s, v) => [h, s, v],
        rgb: hsvToRgbInt
      },
      rgb: {
        hsl: rgbToHslInt,
        hsv: rgbToHsvInt,
        rgb: (r, g, b) => [r, g, b]
      }
    };
    function getColorMaxComponents(mode, type) {
      return [
        type === "float" ? 1 : mode === "rgb" ? 255 : 360,
        type === "float" ? 1 : mode === "rgb" ? 255 : 100,
        type === "float" ? 1 : mode === "rgb" ? 255 : 100
      ];
    }
    function constrainColorComponents(components, mode, type) {
      var _a2;
      const ms = getColorMaxComponents(mode, type);
      return [
        mode === "rgb" ? constrainRange(components[0], 0, ms[0]) : loopRange(components[0], ms[0]),
        constrainRange(components[1], 0, ms[1]),
        constrainRange(components[2], 0, ms[2]),
        constrainRange((_a2 = components[3]) !== null && _a2 !== void 0 ? _a2 : 1, 0, 1)
      ];
    }
    function convertColorType(comps, mode, from, to) {
      const fms = getColorMaxComponents(mode, from);
      const tms = getColorMaxComponents(mode, to);
      return comps.map((c, index) => c / fms[index] * tms[index]);
    }
    function convertColor(components, from, to) {
      const intComps = convertColorType(components, from.mode, from.type, "int");
      const result = MODE_CONVERTER_MAP[from.mode][to.mode](...intComps);
      return convertColorType(result, to.mode, "int", to.type);
    }
    function isRgbColorComponent(obj, key) {
      if (typeof obj !== "object" || isEmpty(obj)) {
        return false;
      }
      return key in obj && typeof obj[key] === "number";
    }
    class Color {
      constructor(comps, mode, type = "int") {
        this.mode = mode;
        this.type = type;
        this.comps_ = constrainColorComponents(comps, mode, type);
      }
      static black(type = "int") {
        return new Color([0, 0, 0], "rgb", type);
      }
      static fromObject(obj, type = "int") {
        const comps = "a" in obj ? [obj.r, obj.g, obj.b, obj.a] : [obj.r, obj.g, obj.b];
        return new Color(comps, "rgb", type);
      }
      static toRgbaObject(color, type = "int") {
        return color.toRgbaObject(type);
      }
      static isRgbColorObject(obj) {
        return isRgbColorComponent(obj, "r") && isRgbColorComponent(obj, "g") && isRgbColorComponent(obj, "b");
      }
      static isRgbaColorObject(obj) {
        return this.isRgbColorObject(obj) && isRgbColorComponent(obj, "a");
      }
      static isColorObject(obj) {
        return this.isRgbColorObject(obj);
      }
      static equals(v1, v2) {
        if (v1.mode !== v2.mode) {
          return false;
        }
        const comps1 = v1.comps_;
        const comps2 = v2.comps_;
        for (let i = 0; i < comps1.length; i++) {
          if (comps1[i] !== comps2[i]) {
            return false;
          }
        }
        return true;
      }
      getComponents(opt_mode, type = "int") {
        return appendAlphaComponent(convertColor(removeAlphaComponent(this.comps_), { mode: this.mode, type: this.type }, { mode: opt_mode !== null && opt_mode !== void 0 ? opt_mode : this.mode, type }), this.comps_[3]);
      }
      toRgbaObject(type = "int") {
        const rgbComps = this.getComponents("rgb", type);
        return {
          r: rgbComps[0],
          g: rgbComps[1],
          b: rgbComps[2],
          a: rgbComps[3]
        };
      }
    }
    const className$b = ClassName("colp");
    class ColorPickerView {
      constructor(doc2, config) {
        this.alphaViews_ = null;
        this.element = doc2.createElement("div");
        this.element.classList.add(className$b());
        const hsvElem = doc2.createElement("div");
        hsvElem.classList.add(className$b("hsv"));
        const svElem = doc2.createElement("div");
        svElem.classList.add(className$b("sv"));
        this.svPaletteView_ = config.svPaletteView;
        svElem.appendChild(this.svPaletteView_.element);
        hsvElem.appendChild(svElem);
        const hElem = doc2.createElement("div");
        hElem.classList.add(className$b("h"));
        this.hPaletteView_ = config.hPaletteView;
        hElem.appendChild(this.hPaletteView_.element);
        hsvElem.appendChild(hElem);
        this.element.appendChild(hsvElem);
        const rgbElem = doc2.createElement("div");
        rgbElem.classList.add(className$b("rgb"));
        this.textView_ = config.textView;
        rgbElem.appendChild(this.textView_.element);
        this.element.appendChild(rgbElem);
        if (config.alphaViews) {
          this.alphaViews_ = {
            palette: config.alphaViews.palette,
            text: config.alphaViews.text
          };
          const aElem = doc2.createElement("div");
          aElem.classList.add(className$b("a"));
          const apElem = doc2.createElement("div");
          apElem.classList.add(className$b("ap"));
          apElem.appendChild(this.alphaViews_.palette.element);
          aElem.appendChild(apElem);
          const atElem = doc2.createElement("div");
          atElem.classList.add(className$b("at"));
          atElem.appendChild(this.alphaViews_.text.element);
          aElem.appendChild(atElem);
          this.element.appendChild(aElem);
        }
      }
      get allFocusableElements() {
        const elems = [
          this.svPaletteView_.element,
          this.hPaletteView_.element,
          this.textView_.modeSelectElement,
          ...this.textView_.textViews.map((v) => v.inputElement)
        ];
        if (this.alphaViews_) {
          elems.push(this.alphaViews_.palette.element, this.alphaViews_.text.inputElement);
        }
        return elems;
      }
    }
    function parseColorType(value) {
      return value === "int" ? "int" : value === "float" ? "float" : void 0;
    }
    function parseColorInputParams(params) {
      const p2 = ParamsParsers;
      return parseParams(params, {
        alpha: p2.optional.boolean,
        color: p2.optional.object({
          alpha: p2.optional.boolean,
          type: p2.optional.custom(parseColorType)
        }),
        expanded: p2.optional.boolean,
        picker: p2.optional.custom(parsePickerLayout)
      });
    }
    function getBaseStepForColor(forAlpha) {
      return forAlpha ? 0.1 : 1;
    }
    function extractColorType(params) {
      var _a2;
      return (_a2 = params.color) === null || _a2 === void 0 ? void 0 : _a2.type;
    }
    function equalsStringColorFormat(f1, f2) {
      return f1.alpha === f2.alpha && f1.mode === f2.mode && f1.notation === f2.notation && f1.type === f2.type;
    }
    function parseCssNumberOrPercentage(text, maxValue) {
      const m = text.match(/^(.+)%$/);
      if (!m) {
        return Math.min(parseFloat(text), maxValue);
      }
      return Math.min(parseFloat(m[1]) * 0.01 * maxValue, maxValue);
    }
    const ANGLE_TO_DEG_MAP = {
      deg: (angle) => angle,
      grad: (angle) => angle * 360 / 400,
      rad: (angle) => angle * 360 / (2 * Math.PI),
      turn: (angle) => angle * 360
    };
    function parseCssNumberOrAngle(text) {
      const m = text.match(/^([0-9.]+?)(deg|grad|rad|turn)$/);
      if (!m) {
        return parseFloat(text);
      }
      const angle = parseFloat(m[1]);
      const unit = m[2];
      return ANGLE_TO_DEG_MAP[unit](angle);
    }
    function parseFunctionalRgbColorComponents(text) {
      const m = text.match(/^rgb\(\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*\)$/);
      if (!m) {
        return null;
      }
      const comps = [
        parseCssNumberOrPercentage(m[1], 255),
        parseCssNumberOrPercentage(m[2], 255),
        parseCssNumberOrPercentage(m[3], 255)
      ];
      if (isNaN(comps[0]) || isNaN(comps[1]) || isNaN(comps[2])) {
        return null;
      }
      return comps;
    }
    function createFunctionalRgbColorParser(type) {
      return (text) => {
        const comps = parseFunctionalRgbColorComponents(text);
        return comps ? new Color(comps, "rgb", type) : null;
      };
    }
    function parseFunctionalRgbaColorComponents(text) {
      const m = text.match(/^rgba\(\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*\)$/);
      if (!m) {
        return null;
      }
      const comps = [
        parseCssNumberOrPercentage(m[1], 255),
        parseCssNumberOrPercentage(m[2], 255),
        parseCssNumberOrPercentage(m[3], 255),
        parseCssNumberOrPercentage(m[4], 1)
      ];
      if (isNaN(comps[0]) || isNaN(comps[1]) || isNaN(comps[2]) || isNaN(comps[3])) {
        return null;
      }
      return comps;
    }
    function createFunctionalRgbaColorParser(type) {
      return (text) => {
        const comps = parseFunctionalRgbaColorComponents(text);
        return comps ? new Color(comps, "rgb", type) : null;
      };
    }
    function parseHslColorComponents(text) {
      const m = text.match(/^hsl\(\s*([0-9A-Fa-f.]+(?:deg|grad|rad|turn)?)\s*,\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*\)$/);
      if (!m) {
        return null;
      }
      const comps = [
        parseCssNumberOrAngle(m[1]),
        parseCssNumberOrPercentage(m[2], 100),
        parseCssNumberOrPercentage(m[3], 100)
      ];
      if (isNaN(comps[0]) || isNaN(comps[1]) || isNaN(comps[2])) {
        return null;
      }
      return comps;
    }
    function createHslColorParser(type) {
      return (text) => {
        const comps = parseHslColorComponents(text);
        return comps ? new Color(comps, "hsl", type) : null;
      };
    }
    function parseHslaColorComponents(text) {
      const m = text.match(/^hsla\(\s*([0-9A-Fa-f.]+(?:deg|grad|rad|turn)?)\s*,\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*\)$/);
      if (!m) {
        return null;
      }
      const comps = [
        parseCssNumberOrAngle(m[1]),
        parseCssNumberOrPercentage(m[2], 100),
        parseCssNumberOrPercentage(m[3], 100),
        parseCssNumberOrPercentage(m[4], 1)
      ];
      if (isNaN(comps[0]) || isNaN(comps[1]) || isNaN(comps[2]) || isNaN(comps[3])) {
        return null;
      }
      return comps;
    }
    function createHslaColorParser(type) {
      return (text) => {
        const comps = parseHslaColorComponents(text);
        return comps ? new Color(comps, "hsl", type) : null;
      };
    }
    function parseHexRgbColorComponents(text) {
      const mRgb = text.match(/^#([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])$/);
      if (mRgb) {
        return [
          parseInt(mRgb[1] + mRgb[1], 16),
          parseInt(mRgb[2] + mRgb[2], 16),
          parseInt(mRgb[3] + mRgb[3], 16)
        ];
      }
      const mRrggbb = text.match(/^(?:#|0x)([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})$/);
      if (mRrggbb) {
        return [
          parseInt(mRrggbb[1], 16),
          parseInt(mRrggbb[2], 16),
          parseInt(mRrggbb[3], 16)
        ];
      }
      return null;
    }
    function parseHexRgbColor(text) {
      const comps = parseHexRgbColorComponents(text);
      return comps ? new Color(comps, "rgb", "int") : null;
    }
    function parseHexRgbaColorComponents(text) {
      const mRgb = text.match(/^#?([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])$/);
      if (mRgb) {
        return [
          parseInt(mRgb[1] + mRgb[1], 16),
          parseInt(mRgb[2] + mRgb[2], 16),
          parseInt(mRgb[3] + mRgb[3], 16),
          mapRange(parseInt(mRgb[4] + mRgb[4], 16), 0, 255, 0, 1)
        ];
      }
      const mRrggbb = text.match(/^(?:#|0x)?([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})$/);
      if (mRrggbb) {
        return [
          parseInt(mRrggbb[1], 16),
          parseInt(mRrggbb[2], 16),
          parseInt(mRrggbb[3], 16),
          mapRange(parseInt(mRrggbb[4], 16), 0, 255, 0, 1)
        ];
      }
      return null;
    }
    function parseHexRgbaColor(text) {
      const comps = parseHexRgbaColorComponents(text);
      return comps ? new Color(comps, "rgb", "int") : null;
    }
    function parseObjectRgbColorComponents(text) {
      const m = text.match(/^\{\s*r\s*:\s*([0-9A-Fa-f.]+%?)\s*,\s*g\s*:\s*([0-9A-Fa-f.]+%?)\s*,\s*b\s*:\s*([0-9A-Fa-f.]+%?)\s*\}$/);
      if (!m) {
        return null;
      }
      const comps = [
        parseFloat(m[1]),
        parseFloat(m[2]),
        parseFloat(m[3])
      ];
      if (isNaN(comps[0]) || isNaN(comps[1]) || isNaN(comps[2])) {
        return null;
      }
      return comps;
    }
    function createObjectRgbColorParser(type) {
      return (text) => {
        const comps = parseObjectRgbColorComponents(text);
        return comps ? new Color(comps, "rgb", type) : null;
      };
    }
    function parseObjectRgbaColorComponents(text) {
      const m = text.match(/^\{\s*r\s*:\s*([0-9A-Fa-f.]+%?)\s*,\s*g\s*:\s*([0-9A-Fa-f.]+%?)\s*,\s*b\s*:\s*([0-9A-Fa-f.]+%?)\s*,\s*a\s*:\s*([0-9A-Fa-f.]+%?)\s*\}$/);
      if (!m) {
        return null;
      }
      const comps = [
        parseFloat(m[1]),
        parseFloat(m[2]),
        parseFloat(m[3]),
        parseFloat(m[4])
      ];
      if (isNaN(comps[0]) || isNaN(comps[1]) || isNaN(comps[2]) || isNaN(comps[3])) {
        return null;
      }
      return comps;
    }
    function createObjectRgbaColorParser(type) {
      return (text) => {
        const comps = parseObjectRgbaColorComponents(text);
        return comps ? new Color(comps, "rgb", type) : null;
      };
    }
    const PARSER_AND_RESULT = [
      {
        parser: parseHexRgbColorComponents,
        result: {
          alpha: false,
          mode: "rgb",
          notation: "hex"
        }
      },
      {
        parser: parseHexRgbaColorComponents,
        result: {
          alpha: true,
          mode: "rgb",
          notation: "hex"
        }
      },
      {
        parser: parseFunctionalRgbColorComponents,
        result: {
          alpha: false,
          mode: "rgb",
          notation: "func"
        }
      },
      {
        parser: parseFunctionalRgbaColorComponents,
        result: {
          alpha: true,
          mode: "rgb",
          notation: "func"
        }
      },
      {
        parser: parseHslColorComponents,
        result: {
          alpha: false,
          mode: "hsl",
          notation: "func"
        }
      },
      {
        parser: parseHslaColorComponents,
        result: {
          alpha: true,
          mode: "hsl",
          notation: "func"
        }
      },
      {
        parser: parseObjectRgbColorComponents,
        result: {
          alpha: false,
          mode: "rgb",
          notation: "object"
        }
      },
      {
        parser: parseObjectRgbaColorComponents,
        result: {
          alpha: true,
          mode: "rgb",
          notation: "object"
        }
      }
    ];
    function detectStringColor(text) {
      return PARSER_AND_RESULT.reduce((prev, { parser, result: detection }) => {
        if (prev) {
          return prev;
        }
        return parser(text) ? detection : null;
      }, null);
    }
    function detectStringColorFormat(text, type = "int") {
      const r = detectStringColor(text);
      if (!r) {
        return null;
      }
      if (r.notation === "hex" && type !== "float") {
        return Object.assign(Object.assign({}, r), { type: "int" });
      }
      if (r.notation === "func") {
        return Object.assign(Object.assign({}, r), { type });
      }
      return null;
    }
    const TYPE_TO_PARSERS = {
      int: [
        parseHexRgbColor,
        parseHexRgbaColor,
        createFunctionalRgbColorParser("int"),
        createFunctionalRgbaColorParser("int"),
        createHslColorParser("int"),
        createHslaColorParser("int"),
        createObjectRgbColorParser("int"),
        createObjectRgbaColorParser("int")
      ],
      float: [
        createFunctionalRgbColorParser("float"),
        createFunctionalRgbaColorParser("float"),
        createHslColorParser("float"),
        createHslaColorParser("float"),
        createObjectRgbColorParser("float"),
        createObjectRgbaColorParser("float")
      ]
    };
    function createColorStringBindingReader(type) {
      const parsers = TYPE_TO_PARSERS[type];
      return (value) => {
        if (typeof value !== "string") {
          return Color.black(type);
        }
        const result = parsers.reduce((prev, parser) => {
          if (prev) {
            return prev;
          }
          return parser(value);
        }, null);
        return result !== null && result !== void 0 ? result : Color.black(type);
      };
    }
    function createColorStringParser(type) {
      const parsers = TYPE_TO_PARSERS[type];
      return (value) => {
        return parsers.reduce((prev, parser) => {
          if (prev) {
            return prev;
          }
          return parser(value);
        }, null);
      };
    }
    function zerofill(comp) {
      const hex = constrainRange(Math.floor(comp), 0, 255).toString(16);
      return hex.length === 1 ? `0${hex}` : hex;
    }
    function colorToHexRgbString(value, prefix = "#") {
      const hexes = removeAlphaComponent(value.getComponents("rgb")).map(zerofill).join("");
      return `${prefix}${hexes}`;
    }
    function colorToHexRgbaString(value, prefix = "#") {
      const rgbaComps = value.getComponents("rgb");
      const hexes = [rgbaComps[0], rgbaComps[1], rgbaComps[2], rgbaComps[3] * 255].map(zerofill).join("");
      return `${prefix}${hexes}`;
    }
    function colorToFunctionalRgbString(value, opt_type) {
      const formatter = createNumberFormatter(opt_type === "float" ? 2 : 0);
      const comps = removeAlphaComponent(value.getComponents("rgb", opt_type)).map((comp) => formatter(comp));
      return `rgb(${comps.join(", ")})`;
    }
    function createFunctionalRgbColorFormatter(type) {
      return (value) => {
        return colorToFunctionalRgbString(value, type);
      };
    }
    function colorToFunctionalRgbaString(value, opt_type) {
      const aFormatter = createNumberFormatter(2);
      const rgbFormatter = createNumberFormatter(opt_type === "float" ? 2 : 0);
      const comps = value.getComponents("rgb", opt_type).map((comp, index) => {
        const formatter = index === 3 ? aFormatter : rgbFormatter;
        return formatter(comp);
      });
      return `rgba(${comps.join(", ")})`;
    }
    function createFunctionalRgbaColorFormatter(type) {
      return (value) => {
        return colorToFunctionalRgbaString(value, type);
      };
    }
    function colorToFunctionalHslString(value) {
      const formatters = [
        createNumberFormatter(0),
        formatPercentage,
        formatPercentage
      ];
      const comps = removeAlphaComponent(value.getComponents("hsl")).map((comp, index) => formatters[index](comp));
      return `hsl(${comps.join(", ")})`;
    }
    function colorToFunctionalHslaString(value) {
      const formatters = [
        createNumberFormatter(0),
        formatPercentage,
        formatPercentage,
        createNumberFormatter(2)
      ];
      const comps = value.getComponents("hsl").map((comp, index) => formatters[index](comp));
      return `hsla(${comps.join(", ")})`;
    }
    function colorToObjectRgbString(value, type) {
      const formatter = createNumberFormatter(type === "float" ? 2 : 0);
      const names = ["r", "g", "b"];
      const comps = removeAlphaComponent(value.getComponents("rgb", type)).map((comp, index) => `${names[index]}: ${formatter(comp)}`);
      return `{${comps.join(", ")}}`;
    }
    function createObjectRgbColorFormatter(type) {
      return (value) => colorToObjectRgbString(value, type);
    }
    function colorToObjectRgbaString(value, type) {
      const aFormatter = createNumberFormatter(2);
      const rgbFormatter = createNumberFormatter(type === "float" ? 2 : 0);
      const names = ["r", "g", "b", "a"];
      const comps = value.getComponents("rgb", type).map((comp, index) => {
        const formatter = index === 3 ? aFormatter : rgbFormatter;
        return `${names[index]}: ${formatter(comp)}`;
      });
      return `{${comps.join(", ")}}`;
    }
    function createObjectRgbaColorFormatter(type) {
      return (value) => colorToObjectRgbaString(value, type);
    }
    const FORMAT_AND_STRINGIFIERS = [
      {
        format: {
          alpha: false,
          mode: "rgb",
          notation: "hex",
          type: "int"
        },
        stringifier: colorToHexRgbString
      },
      {
        format: {
          alpha: true,
          mode: "rgb",
          notation: "hex",
          type: "int"
        },
        stringifier: colorToHexRgbaString
      },
      {
        format: {
          alpha: false,
          mode: "hsl",
          notation: "func",
          type: "int"
        },
        stringifier: colorToFunctionalHslString
      },
      {
        format: {
          alpha: true,
          mode: "hsl",
          notation: "func",
          type: "int"
        },
        stringifier: colorToFunctionalHslaString
      },
      ...["int", "float"].reduce((prev, type) => {
        return [
          ...prev,
          {
            format: {
              alpha: false,
              mode: "rgb",
              notation: "func",
              type
            },
            stringifier: createFunctionalRgbColorFormatter(type)
          },
          {
            format: {
              alpha: true,
              mode: "rgb",
              notation: "func",
              type
            },
            stringifier: createFunctionalRgbaColorFormatter(type)
          },
          {
            format: {
              alpha: false,
              mode: "rgb",
              notation: "object",
              type
            },
            stringifier: createObjectRgbColorFormatter(type)
          },
          {
            format: {
              alpha: true,
              mode: "rgb",
              notation: "object",
              type
            },
            stringifier: createObjectRgbaColorFormatter(type)
          }
        ];
      }, [])
    ];
    function findColorStringifier(format) {
      return FORMAT_AND_STRINGIFIERS.reduce((prev, fas) => {
        if (prev) {
          return prev;
        }
        return equalsStringColorFormat(fas.format, format) ? fas.stringifier : null;
      }, null);
    }
    const className$a = ClassName("apl");
    class APaletteView {
      constructor(doc2, config) {
        this.onValueChange_ = this.onValueChange_.bind(this);
        this.value = config.value;
        this.value.emitter.on("change", this.onValueChange_);
        this.element = doc2.createElement("div");
        this.element.classList.add(className$a());
        config.viewProps.bindTabIndex(this.element);
        const barElem = doc2.createElement("div");
        barElem.classList.add(className$a("b"));
        this.element.appendChild(barElem);
        const colorElem = doc2.createElement("div");
        colorElem.classList.add(className$a("c"));
        barElem.appendChild(colorElem);
        this.colorElem_ = colorElem;
        const markerElem = doc2.createElement("div");
        markerElem.classList.add(className$a("m"));
        this.element.appendChild(markerElem);
        this.markerElem_ = markerElem;
        const previewElem = doc2.createElement("div");
        previewElem.classList.add(className$a("p"));
        this.markerElem_.appendChild(previewElem);
        this.previewElem_ = previewElem;
        this.update_();
      }
      update_() {
        const c = this.value.rawValue;
        const rgbaComps = c.getComponents("rgb");
        const leftColor = new Color([rgbaComps[0], rgbaComps[1], rgbaComps[2], 0], "rgb");
        const rightColor = new Color([rgbaComps[0], rgbaComps[1], rgbaComps[2], 255], "rgb");
        const gradientComps = [
          "to right",
          colorToFunctionalRgbaString(leftColor),
          colorToFunctionalRgbaString(rightColor)
        ];
        this.colorElem_.style.background = `linear-gradient(${gradientComps.join(",")})`;
        this.previewElem_.style.backgroundColor = colorToFunctionalRgbaString(c);
        const left = mapRange(rgbaComps[3], 0, 1, 0, 100);
        this.markerElem_.style.left = `${left}%`;
      }
      onValueChange_() {
        this.update_();
      }
    }
    class APaletteController {
      constructor(doc2, config) {
        this.onKeyDown_ = this.onKeyDown_.bind(this);
        this.onKeyUp_ = this.onKeyUp_.bind(this);
        this.onPointerDown_ = this.onPointerDown_.bind(this);
        this.onPointerMove_ = this.onPointerMove_.bind(this);
        this.onPointerUp_ = this.onPointerUp_.bind(this);
        this.value = config.value;
        this.viewProps = config.viewProps;
        this.view = new APaletteView(doc2, {
          value: this.value,
          viewProps: this.viewProps
        });
        this.ptHandler_ = new PointerHandler(this.view.element);
        this.ptHandler_.emitter.on("down", this.onPointerDown_);
        this.ptHandler_.emitter.on("move", this.onPointerMove_);
        this.ptHandler_.emitter.on("up", this.onPointerUp_);
        this.view.element.addEventListener("keydown", this.onKeyDown_);
        this.view.element.addEventListener("keyup", this.onKeyUp_);
      }
      handlePointerEvent_(d, opts) {
        if (!d.point) {
          return;
        }
        const alpha = d.point.x / d.bounds.width;
        const c = this.value.rawValue;
        const [h, s, v] = c.getComponents("hsv");
        this.value.setRawValue(new Color([h, s, v, alpha], "hsv"), opts);
      }
      onPointerDown_(ev) {
        this.handlePointerEvent_(ev.data, {
          forceEmit: false,
          last: false
        });
      }
      onPointerMove_(ev) {
        this.handlePointerEvent_(ev.data, {
          forceEmit: false,
          last: false
        });
      }
      onPointerUp_(ev) {
        this.handlePointerEvent_(ev.data, {
          forceEmit: true,
          last: true
        });
      }
      onKeyDown_(ev) {
        const step = getStepForKey(getBaseStepForColor(true), getHorizontalStepKeys(ev));
        if (step === 0) {
          return;
        }
        const c = this.value.rawValue;
        const [h, s, v, a] = c.getComponents("hsv");
        this.value.setRawValue(new Color([h, s, v, a + step], "hsv"), {
          forceEmit: false,
          last: false
        });
      }
      onKeyUp_(ev) {
        const step = getStepForKey(getBaseStepForColor(true), getHorizontalStepKeys(ev));
        if (step === 0) {
          return;
        }
        this.value.setRawValue(this.value.rawValue, {
          forceEmit: true,
          last: true
        });
      }
    }
    const className$9 = ClassName("coltxt");
    function createModeSelectElement(doc2) {
      const selectElem = doc2.createElement("select");
      const items = [
        { text: "RGB", value: "rgb" },
        { text: "HSL", value: "hsl" },
        { text: "HSV", value: "hsv" }
      ];
      selectElem.appendChild(items.reduce((frag, item) => {
        const optElem = doc2.createElement("option");
        optElem.textContent = item.text;
        optElem.value = item.value;
        frag.appendChild(optElem);
        return frag;
      }, doc2.createDocumentFragment()));
      return selectElem;
    }
    class ColorTextView {
      constructor(doc2, config) {
        this.element = doc2.createElement("div");
        this.element.classList.add(className$9());
        const modeElem = doc2.createElement("div");
        modeElem.classList.add(className$9("m"));
        this.modeElem_ = createModeSelectElement(doc2);
        this.modeElem_.classList.add(className$9("ms"));
        modeElem.appendChild(this.modeSelectElement);
        const modeMarkerElem = doc2.createElement("div");
        modeMarkerElem.classList.add(className$9("mm"));
        modeMarkerElem.appendChild(createSvgIconElement(doc2, "dropdown"));
        modeElem.appendChild(modeMarkerElem);
        this.element.appendChild(modeElem);
        const textsElem = doc2.createElement("div");
        textsElem.classList.add(className$9("w"));
        this.element.appendChild(textsElem);
        this.textsElem_ = textsElem;
        this.textViews_ = config.textViews;
        this.applyTextViews_();
        bindValue(config.colorMode, (mode) => {
          this.modeElem_.value = mode;
        });
      }
      get modeSelectElement() {
        return this.modeElem_;
      }
      get textViews() {
        return this.textViews_;
      }
      set textViews(textViews) {
        this.textViews_ = textViews;
        this.applyTextViews_();
      }
      applyTextViews_() {
        removeChildElements(this.textsElem_);
        const doc2 = this.element.ownerDocument;
        this.textViews_.forEach((v) => {
          const compElem = doc2.createElement("div");
          compElem.classList.add(className$9("c"));
          compElem.appendChild(v.element);
          this.textsElem_.appendChild(compElem);
        });
      }
    }
    function createFormatter$2(type) {
      return createNumberFormatter(type === "float" ? 2 : 0);
    }
    function createConstraint$5(mode, type, index) {
      const max = getColorMaxComponents(mode, type)[index];
      return new RangeConstraint({
        min: 0,
        max
      });
    }
    function createComponentController(doc2, config, index) {
      return new NumberTextController(doc2, {
        arrayPosition: index === 0 ? "fst" : index === 3 - 1 ? "lst" : "mid",
        baseStep: getBaseStepForColor(false),
        parser: config.parser,
        props: ValueMap.fromObject({
          draggingScale: config.colorType === "float" ? 0.01 : 1,
          formatter: createFormatter$2(config.colorType)
        }),
        value: createValue(0, {
          constraint: createConstraint$5(config.colorMode, config.colorType, index)
        }),
        viewProps: config.viewProps
      });
    }
    class ColorTextController {
      constructor(doc2, config) {
        this.onModeSelectChange_ = this.onModeSelectChange_.bind(this);
        this.colorType_ = config.colorType;
        this.parser_ = config.parser;
        this.value = config.value;
        this.viewProps = config.viewProps;
        this.colorMode = createValue(this.value.rawValue.mode);
        this.ccs_ = this.createComponentControllers_(doc2);
        this.view = new ColorTextView(doc2, {
          colorMode: this.colorMode,
          textViews: [this.ccs_[0].view, this.ccs_[1].view, this.ccs_[2].view]
        });
        this.view.modeSelectElement.addEventListener("change", this.onModeSelectChange_);
      }
      createComponentControllers_(doc2) {
        const cc = {
          colorMode: this.colorMode.rawValue,
          colorType: this.colorType_,
          parser: this.parser_,
          viewProps: this.viewProps
        };
        const ccs = [
          createComponentController(doc2, cc, 0),
          createComponentController(doc2, cc, 1),
          createComponentController(doc2, cc, 2)
        ];
        ccs.forEach((cs, index) => {
          connectValues({
            primary: this.value,
            secondary: cs.value,
            forward: (p2) => {
              return p2.rawValue.getComponents(this.colorMode.rawValue, this.colorType_)[index];
            },
            backward: (p2, s) => {
              const pickedMode = this.colorMode.rawValue;
              const comps = p2.rawValue.getComponents(pickedMode, this.colorType_);
              comps[index] = s.rawValue;
              return new Color(appendAlphaComponent(removeAlphaComponent(comps), comps[3]), pickedMode, this.colorType_);
            }
          });
        });
        return ccs;
      }
      onModeSelectChange_(ev) {
        const selectElem = ev.currentTarget;
        this.colorMode.rawValue = selectElem.value;
        this.ccs_ = this.createComponentControllers_(this.view.element.ownerDocument);
        this.view.textViews = [
          this.ccs_[0].view,
          this.ccs_[1].view,
          this.ccs_[2].view
        ];
      }
    }
    const className$8 = ClassName("hpl");
    class HPaletteView {
      constructor(doc2, config) {
        this.onValueChange_ = this.onValueChange_.bind(this);
        this.value = config.value;
        this.value.emitter.on("change", this.onValueChange_);
        this.element = doc2.createElement("div");
        this.element.classList.add(className$8());
        config.viewProps.bindTabIndex(this.element);
        const colorElem = doc2.createElement("div");
        colorElem.classList.add(className$8("c"));
        this.element.appendChild(colorElem);
        const markerElem = doc2.createElement("div");
        markerElem.classList.add(className$8("m"));
        this.element.appendChild(markerElem);
        this.markerElem_ = markerElem;
        this.update_();
      }
      update_() {
        const c = this.value.rawValue;
        const [h] = c.getComponents("hsv");
        this.markerElem_.style.backgroundColor = colorToFunctionalRgbString(new Color([h, 100, 100], "hsv"));
        const left = mapRange(h, 0, 360, 0, 100);
        this.markerElem_.style.left = `${left}%`;
      }
      onValueChange_() {
        this.update_();
      }
    }
    class HPaletteController {
      constructor(doc2, config) {
        this.onKeyDown_ = this.onKeyDown_.bind(this);
        this.onKeyUp_ = this.onKeyUp_.bind(this);
        this.onPointerDown_ = this.onPointerDown_.bind(this);
        this.onPointerMove_ = this.onPointerMove_.bind(this);
        this.onPointerUp_ = this.onPointerUp_.bind(this);
        this.value = config.value;
        this.viewProps = config.viewProps;
        this.view = new HPaletteView(doc2, {
          value: this.value,
          viewProps: this.viewProps
        });
        this.ptHandler_ = new PointerHandler(this.view.element);
        this.ptHandler_.emitter.on("down", this.onPointerDown_);
        this.ptHandler_.emitter.on("move", this.onPointerMove_);
        this.ptHandler_.emitter.on("up", this.onPointerUp_);
        this.view.element.addEventListener("keydown", this.onKeyDown_);
        this.view.element.addEventListener("keyup", this.onKeyUp_);
      }
      handlePointerEvent_(d, opts) {
        if (!d.point) {
          return;
        }
        const hue = mapRange(constrainRange(d.point.x, 0, d.bounds.width), 0, d.bounds.width, 0, 359);
        const c = this.value.rawValue;
        const [, s, v, a] = c.getComponents("hsv");
        this.value.setRawValue(new Color([hue, s, v, a], "hsv"), opts);
      }
      onPointerDown_(ev) {
        this.handlePointerEvent_(ev.data, {
          forceEmit: false,
          last: false
        });
      }
      onPointerMove_(ev) {
        this.handlePointerEvent_(ev.data, {
          forceEmit: false,
          last: false
        });
      }
      onPointerUp_(ev) {
        this.handlePointerEvent_(ev.data, {
          forceEmit: true,
          last: true
        });
      }
      onKeyDown_(ev) {
        const step = getStepForKey(getBaseStepForColor(false), getHorizontalStepKeys(ev));
        if (step === 0) {
          return;
        }
        const c = this.value.rawValue;
        const [h, s, v, a] = c.getComponents("hsv");
        this.value.setRawValue(new Color([h + step, s, v, a], "hsv"), {
          forceEmit: false,
          last: false
        });
      }
      onKeyUp_(ev) {
        const step = getStepForKey(getBaseStepForColor(false), getHorizontalStepKeys(ev));
        if (step === 0) {
          return;
        }
        this.value.setRawValue(this.value.rawValue, {
          forceEmit: true,
          last: true
        });
      }
    }
    const className$7 = ClassName("svp");
    const CANVAS_RESOL = 64;
    class SvPaletteView {
      constructor(doc2, config) {
        this.onValueChange_ = this.onValueChange_.bind(this);
        this.value = config.value;
        this.value.emitter.on("change", this.onValueChange_);
        this.element = doc2.createElement("div");
        this.element.classList.add(className$7());
        config.viewProps.bindTabIndex(this.element);
        const canvasElem = doc2.createElement("canvas");
        canvasElem.height = CANVAS_RESOL;
        canvasElem.width = CANVAS_RESOL;
        canvasElem.classList.add(className$7("c"));
        this.element.appendChild(canvasElem);
        this.canvasElement = canvasElem;
        const markerElem = doc2.createElement("div");
        markerElem.classList.add(className$7("m"));
        this.element.appendChild(markerElem);
        this.markerElem_ = markerElem;
        this.update_();
      }
      update_() {
        const ctx = getCanvasContext(this.canvasElement);
        if (!ctx) {
          return;
        }
        const c = this.value.rawValue;
        const hsvComps = c.getComponents("hsv");
        const width = this.canvasElement.width;
        const height = this.canvasElement.height;
        const imgData = ctx.getImageData(0, 0, width, height);
        const data = imgData.data;
        for (let iy = 0; iy < height; iy++) {
          for (let ix = 0; ix < width; ix++) {
            const s = mapRange(ix, 0, width, 0, 100);
            const v = mapRange(iy, 0, height, 100, 0);
            const rgbComps = hsvToRgbInt(hsvComps[0], s, v);
            const i = (iy * width + ix) * 4;
            data[i] = rgbComps[0];
            data[i + 1] = rgbComps[1];
            data[i + 2] = rgbComps[2];
            data[i + 3] = 255;
          }
        }
        ctx.putImageData(imgData, 0, 0);
        const left = mapRange(hsvComps[1], 0, 100, 0, 100);
        this.markerElem_.style.left = `${left}%`;
        const top = mapRange(hsvComps[2], 0, 100, 100, 0);
        this.markerElem_.style.top = `${top}%`;
      }
      onValueChange_() {
        this.update_();
      }
    }
    class SvPaletteController {
      constructor(doc2, config) {
        this.onKeyDown_ = this.onKeyDown_.bind(this);
        this.onKeyUp_ = this.onKeyUp_.bind(this);
        this.onPointerDown_ = this.onPointerDown_.bind(this);
        this.onPointerMove_ = this.onPointerMove_.bind(this);
        this.onPointerUp_ = this.onPointerUp_.bind(this);
        this.value = config.value;
        this.viewProps = config.viewProps;
        this.view = new SvPaletteView(doc2, {
          value: this.value,
          viewProps: this.viewProps
        });
        this.ptHandler_ = new PointerHandler(this.view.element);
        this.ptHandler_.emitter.on("down", this.onPointerDown_);
        this.ptHandler_.emitter.on("move", this.onPointerMove_);
        this.ptHandler_.emitter.on("up", this.onPointerUp_);
        this.view.element.addEventListener("keydown", this.onKeyDown_);
        this.view.element.addEventListener("keyup", this.onKeyUp_);
      }
      handlePointerEvent_(d, opts) {
        if (!d.point) {
          return;
        }
        const saturation = mapRange(d.point.x, 0, d.bounds.width, 0, 100);
        const value = mapRange(d.point.y, 0, d.bounds.height, 100, 0);
        const [h, , , a] = this.value.rawValue.getComponents("hsv");
        this.value.setRawValue(new Color([h, saturation, value, a], "hsv"), opts);
      }
      onPointerDown_(ev) {
        this.handlePointerEvent_(ev.data, {
          forceEmit: false,
          last: false
        });
      }
      onPointerMove_(ev) {
        this.handlePointerEvent_(ev.data, {
          forceEmit: false,
          last: false
        });
      }
      onPointerUp_(ev) {
        this.handlePointerEvent_(ev.data, {
          forceEmit: true,
          last: true
        });
      }
      onKeyDown_(ev) {
        if (isArrowKey(ev.key)) {
          ev.preventDefault();
        }
        const [h, s, v, a] = this.value.rawValue.getComponents("hsv");
        const baseStep = getBaseStepForColor(false);
        const ds = getStepForKey(baseStep, getHorizontalStepKeys(ev));
        const dv = getStepForKey(baseStep, getVerticalStepKeys(ev));
        if (ds === 0 && dv === 0) {
          return;
        }
        this.value.setRawValue(new Color([h, s + ds, v + dv, a], "hsv"), {
          forceEmit: false,
          last: false
        });
      }
      onKeyUp_(ev) {
        const baseStep = getBaseStepForColor(false);
        const ds = getStepForKey(baseStep, getHorizontalStepKeys(ev));
        const dv = getStepForKey(baseStep, getVerticalStepKeys(ev));
        if (ds === 0 && dv === 0) {
          return;
        }
        this.value.setRawValue(this.value.rawValue, {
          forceEmit: true,
          last: true
        });
      }
    }
    class ColorPickerController {
      constructor(doc2, config) {
        this.value = config.value;
        this.viewProps = config.viewProps;
        this.hPaletteC_ = new HPaletteController(doc2, {
          value: this.value,
          viewProps: this.viewProps
        });
        this.svPaletteC_ = new SvPaletteController(doc2, {
          value: this.value,
          viewProps: this.viewProps
        });
        this.alphaIcs_ = config.supportsAlpha ? {
          palette: new APaletteController(doc2, {
            value: this.value,
            viewProps: this.viewProps
          }),
          text: new NumberTextController(doc2, {
            parser: parseNumber,
            baseStep: 0.1,
            props: ValueMap.fromObject({
              draggingScale: 0.01,
              formatter: createNumberFormatter(2)
            }),
            value: createValue(0, {
              constraint: new RangeConstraint({ min: 0, max: 1 })
            }),
            viewProps: this.viewProps
          })
        } : null;
        if (this.alphaIcs_) {
          connectValues({
            primary: this.value,
            secondary: this.alphaIcs_.text.value,
            forward: (p2) => {
              return p2.rawValue.getComponents()[3];
            },
            backward: (p2, s) => {
              const comps = p2.rawValue.getComponents();
              comps[3] = s.rawValue;
              return new Color(comps, p2.rawValue.mode);
            }
          });
        }
        this.textC_ = new ColorTextController(doc2, {
          colorType: config.colorType,
          parser: parseNumber,
          value: this.value,
          viewProps: this.viewProps
        });
        this.view = new ColorPickerView(doc2, {
          alphaViews: this.alphaIcs_ ? {
            palette: this.alphaIcs_.palette.view,
            text: this.alphaIcs_.text.view
          } : null,
          hPaletteView: this.hPaletteC_.view,
          supportsAlpha: config.supportsAlpha,
          svPaletteView: this.svPaletteC_.view,
          textView: this.textC_.view
        });
      }
      get textController() {
        return this.textC_;
      }
    }
    const className$6 = ClassName("colsw");
    class ColorSwatchView {
      constructor(doc2, config) {
        this.onValueChange_ = this.onValueChange_.bind(this);
        config.value.emitter.on("change", this.onValueChange_);
        this.value = config.value;
        this.element = doc2.createElement("div");
        this.element.classList.add(className$6());
        config.viewProps.bindClassModifiers(this.element);
        const swatchElem = doc2.createElement("div");
        swatchElem.classList.add(className$6("sw"));
        this.element.appendChild(swatchElem);
        this.swatchElem_ = swatchElem;
        const buttonElem = doc2.createElement("button");
        buttonElem.classList.add(className$6("b"));
        config.viewProps.bindDisabled(buttonElem);
        this.element.appendChild(buttonElem);
        this.buttonElement = buttonElem;
        this.update_();
      }
      update_() {
        const value = this.value.rawValue;
        this.swatchElem_.style.backgroundColor = colorToHexRgbaString(value);
      }
      onValueChange_() {
        this.update_();
      }
    }
    class ColorSwatchController {
      constructor(doc2, config) {
        this.value = config.value;
        this.viewProps = config.viewProps;
        this.view = new ColorSwatchView(doc2, {
          value: this.value,
          viewProps: this.viewProps
        });
      }
    }
    class ColorController {
      constructor(doc2, config) {
        this.onButtonBlur_ = this.onButtonBlur_.bind(this);
        this.onButtonClick_ = this.onButtonClick_.bind(this);
        this.onPopupChildBlur_ = this.onPopupChildBlur_.bind(this);
        this.onPopupChildKeydown_ = this.onPopupChildKeydown_.bind(this);
        this.value = config.value;
        this.viewProps = config.viewProps;
        this.foldable_ = Foldable.create(config.expanded);
        this.swatchC_ = new ColorSwatchController(doc2, {
          value: this.value,
          viewProps: this.viewProps
        });
        const buttonElem = this.swatchC_.view.buttonElement;
        buttonElem.addEventListener("blur", this.onButtonBlur_);
        buttonElem.addEventListener("click", this.onButtonClick_);
        this.textC_ = new TextController(doc2, {
          parser: config.parser,
          props: ValueMap.fromObject({
            formatter: config.formatter
          }),
          value: this.value,
          viewProps: this.viewProps
        });
        this.view = new ColorView(doc2, {
          foldable: this.foldable_,
          pickerLayout: config.pickerLayout
        });
        this.view.swatchElement.appendChild(this.swatchC_.view.element);
        this.view.textElement.appendChild(this.textC_.view.element);
        this.popC_ = config.pickerLayout === "popup" ? new PopupController(doc2, {
          viewProps: this.viewProps
        }) : null;
        const pickerC = new ColorPickerController(doc2, {
          colorType: config.colorType,
          supportsAlpha: config.supportsAlpha,
          value: this.value,
          viewProps: this.viewProps
        });
        pickerC.view.allFocusableElements.forEach((elem) => {
          elem.addEventListener("blur", this.onPopupChildBlur_);
          elem.addEventListener("keydown", this.onPopupChildKeydown_);
        });
        this.pickerC_ = pickerC;
        if (this.popC_) {
          this.view.element.appendChild(this.popC_.view.element);
          this.popC_.view.element.appendChild(pickerC.view.element);
          connectValues({
            primary: this.foldable_.value("expanded"),
            secondary: this.popC_.shows,
            forward: (p2) => p2.rawValue,
            backward: (_, s) => s.rawValue
          });
        } else if (this.view.pickerElement) {
          this.view.pickerElement.appendChild(this.pickerC_.view.element);
          bindFoldable(this.foldable_, this.view.pickerElement);
        }
      }
      get textController() {
        return this.textC_;
      }
      onButtonBlur_(e) {
        if (!this.popC_) {
          return;
        }
        const elem = this.view.element;
        const nextTarget = forceCast(e.relatedTarget);
        if (!nextTarget || !elem.contains(nextTarget)) {
          this.popC_.shows.rawValue = false;
        }
      }
      onButtonClick_() {
        this.foldable_.set("expanded", !this.foldable_.get("expanded"));
        if (this.foldable_.get("expanded")) {
          this.pickerC_.view.allFocusableElements[0].focus();
        }
      }
      onPopupChildBlur_(ev) {
        if (!this.popC_) {
          return;
        }
        const elem = this.popC_.view.element;
        const nextTarget = findNextTarget(ev);
        if (nextTarget && elem.contains(nextTarget)) {
          return;
        }
        if (nextTarget && nextTarget === this.swatchC_.view.buttonElement && !supportsTouch(elem.ownerDocument)) {
          return;
        }
        this.popC_.shows.rawValue = false;
      }
      onPopupChildKeydown_(ev) {
        if (this.popC_) {
          if (ev.key === "Escape") {
            this.popC_.shows.rawValue = false;
          }
        } else if (this.view.pickerElement) {
          if (ev.key === "Escape") {
            this.swatchC_.view.buttonElement.focus();
          }
        }
      }
    }
    function colorFromObject(value, opt_type) {
      if (Color.isColorObject(value)) {
        return Color.fromObject(value, opt_type);
      }
      return Color.black(opt_type);
    }
    function colorToRgbNumber(value) {
      return removeAlphaComponent(value.getComponents("rgb")).reduce((result, comp) => {
        return result << 8 | Math.floor(comp) & 255;
      }, 0);
    }
    function colorToRgbaNumber(value) {
      return value.getComponents("rgb").reduce((result, comp, index) => {
        const hex = Math.floor(index === 3 ? comp * 255 : comp) & 255;
        return result << 8 | hex;
      }, 0) >>> 0;
    }
    function numberToRgbColor(num) {
      return new Color([num >> 16 & 255, num >> 8 & 255, num & 255], "rgb");
    }
    function numberToRgbaColor(num) {
      return new Color([
        num >> 24 & 255,
        num >> 16 & 255,
        num >> 8 & 255,
        mapRange(num & 255, 0, 255, 0, 1)
      ], "rgb");
    }
    function colorFromRgbNumber(value) {
      if (typeof value !== "number") {
        return Color.black();
      }
      return numberToRgbColor(value);
    }
    function colorFromRgbaNumber(value) {
      if (typeof value !== "number") {
        return Color.black();
      }
      return numberToRgbaColor(value);
    }
    function createColorStringWriter(format) {
      const stringify = findColorStringifier(format);
      return stringify ? (target, value) => {
        writePrimitive(target, stringify(value));
      } : null;
    }
    function createColorNumberWriter(supportsAlpha) {
      const colorToNumber = supportsAlpha ? colorToRgbaNumber : colorToRgbNumber;
      return (target, value) => {
        writePrimitive(target, colorToNumber(value));
      };
    }
    function writeRgbaColorObject(target, value, opt_type) {
      const obj = value.toRgbaObject(opt_type);
      target.writeProperty("r", obj.r);
      target.writeProperty("g", obj.g);
      target.writeProperty("b", obj.b);
      target.writeProperty("a", obj.a);
    }
    function writeRgbColorObject(target, value, opt_type) {
      const obj = value.toRgbaObject(opt_type);
      target.writeProperty("r", obj.r);
      target.writeProperty("g", obj.g);
      target.writeProperty("b", obj.b);
    }
    function createColorObjectWriter(supportsAlpha, opt_type) {
      return (target, inValue) => {
        if (supportsAlpha) {
          writeRgbaColorObject(target, inValue, opt_type);
        } else {
          writeRgbColorObject(target, inValue, opt_type);
        }
      };
    }
    function shouldSupportAlpha$1(inputParams) {
      var _a2;
      if ((inputParams === null || inputParams === void 0 ? void 0 : inputParams.alpha) || ((_a2 = inputParams === null || inputParams === void 0 ? void 0 : inputParams.color) === null || _a2 === void 0 ? void 0 : _a2.alpha)) {
        return true;
      }
      return false;
    }
    function createFormatter$1(supportsAlpha) {
      return supportsAlpha ? (v) => colorToHexRgbaString(v, "0x") : (v) => colorToHexRgbString(v, "0x");
    }
    function isForColor(params) {
      if ("color" in params) {
        return true;
      }
      if ("view" in params && params.view === "color") {
        return true;
      }
      return false;
    }
    const NumberColorInputPlugin = {
      id: "input-color-number",
      type: "input",
      accept: (value, params) => {
        if (typeof value !== "number") {
          return null;
        }
        if (!isForColor(params)) {
          return null;
        }
        const result = parseColorInputParams(params);
        return result ? {
          initialValue: value,
          params: result
        } : null;
      },
      binding: {
        reader: (args) => {
          return shouldSupportAlpha$1(args.params) ? colorFromRgbaNumber : colorFromRgbNumber;
        },
        equals: Color.equals,
        writer: (args) => {
          return createColorNumberWriter(shouldSupportAlpha$1(args.params));
        }
      },
      controller: (args) => {
        const supportsAlpha = shouldSupportAlpha$1(args.params);
        const expanded = "expanded" in args.params ? args.params.expanded : void 0;
        const picker = "picker" in args.params ? args.params.picker : void 0;
        return new ColorController(args.document, {
          colorType: "int",
          expanded: expanded !== null && expanded !== void 0 ? expanded : false,
          formatter: createFormatter$1(supportsAlpha),
          parser: createColorStringParser("int"),
          pickerLayout: picker !== null && picker !== void 0 ? picker : "popup",
          supportsAlpha,
          value: args.value,
          viewProps: args.viewProps
        });
      }
    };
    function shouldSupportAlpha(initialValue) {
      return Color.isRgbaColorObject(initialValue);
    }
    function createColorObjectReader(opt_type) {
      return (value) => {
        return colorFromObject(value, opt_type);
      };
    }
    function createColorObjectFormatter(supportsAlpha, type) {
      return (value) => {
        if (supportsAlpha) {
          return colorToObjectRgbaString(value, type);
        }
        return colorToObjectRgbString(value, type);
      };
    }
    const ObjectColorInputPlugin = {
      id: "input-color-object",
      type: "input",
      accept: (value, params) => {
        if (!Color.isColorObject(value)) {
          return null;
        }
        const result = parseColorInputParams(params);
        return result ? {
          initialValue: value,
          params: result
        } : null;
      },
      binding: {
        reader: (args) => createColorObjectReader(extractColorType(args.params)),
        equals: Color.equals,
        writer: (args) => createColorObjectWriter(shouldSupportAlpha(args.initialValue), extractColorType(args.params))
      },
      controller: (args) => {
        var _a2;
        const supportsAlpha = Color.isRgbaColorObject(args.initialValue);
        const expanded = "expanded" in args.params ? args.params.expanded : void 0;
        const picker = "picker" in args.params ? args.params.picker : void 0;
        const type = (_a2 = extractColorType(args.params)) !== null && _a2 !== void 0 ? _a2 : "int";
        return new ColorController(args.document, {
          colorType: type,
          expanded: expanded !== null && expanded !== void 0 ? expanded : false,
          formatter: createColorObjectFormatter(supportsAlpha, type),
          parser: createColorStringParser(type),
          pickerLayout: picker !== null && picker !== void 0 ? picker : "popup",
          supportsAlpha,
          value: args.value,
          viewProps: args.viewProps
        });
      }
    };
    const StringColorInputPlugin = {
      id: "input-color-string",
      type: "input",
      accept: (value, params) => {
        if (typeof value !== "string") {
          return null;
        }
        if ("view" in params && params.view === "text") {
          return null;
        }
        const format = detectStringColorFormat(value, extractColorType(params));
        if (!format) {
          return null;
        }
        const stringifier = findColorStringifier(format);
        if (!stringifier) {
          return null;
        }
        const result = parseColorInputParams(params);
        return result ? {
          initialValue: value,
          params: result
        } : null;
      },
      binding: {
        reader: (args) => {
          var _a2;
          return createColorStringBindingReader((_a2 = extractColorType(args.params)) !== null && _a2 !== void 0 ? _a2 : "int");
        },
        equals: Color.equals,
        writer: (args) => {
          const format = detectStringColorFormat(args.initialValue, extractColorType(args.params));
          if (!format) {
            throw TpError.shouldNeverHappen();
          }
          const writer = createColorStringWriter(format);
          if (!writer) {
            throw TpError.notBindable();
          }
          return writer;
        }
      },
      controller: (args) => {
        const format = detectStringColorFormat(args.initialValue, extractColorType(args.params));
        if (!format) {
          throw TpError.shouldNeverHappen();
        }
        const stringifier = findColorStringifier(format);
        if (!stringifier) {
          throw TpError.shouldNeverHappen();
        }
        const expanded = "expanded" in args.params ? args.params.expanded : void 0;
        const picker = "picker" in args.params ? args.params.picker : void 0;
        return new ColorController(args.document, {
          colorType: format.type,
          expanded: expanded !== null && expanded !== void 0 ? expanded : false,
          formatter: stringifier,
          parser: createColorStringParser(format.type),
          pickerLayout: picker !== null && picker !== void 0 ? picker : "popup",
          supportsAlpha: format.alpha,
          value: args.value,
          viewProps: args.viewProps
        });
      }
    };
    class PointNdConstraint {
      constructor(config) {
        this.components = config.components;
        this.asm_ = config.assembly;
      }
      constrain(value) {
        const comps = this.asm_.toComponents(value).map((comp, index) => {
          var _a2, _b;
          return (_b = (_a2 = this.components[index]) === null || _a2 === void 0 ? void 0 : _a2.constrain(comp)) !== null && _b !== void 0 ? _b : comp;
        });
        return this.asm_.fromComponents(comps);
      }
    }
    const className$5 = ClassName("pndtxt");
    class PointNdTextView {
      constructor(doc2, config) {
        this.textViews = config.textViews;
        this.element = doc2.createElement("div");
        this.element.classList.add(className$5());
        this.textViews.forEach((v) => {
          const axisElem = doc2.createElement("div");
          axisElem.classList.add(className$5("a"));
          axisElem.appendChild(v.element);
          this.element.appendChild(axisElem);
        });
      }
    }
    function createAxisController(doc2, config, index) {
      return new NumberTextController(doc2, {
        arrayPosition: index === 0 ? "fst" : index === config.axes.length - 1 ? "lst" : "mid",
        baseStep: config.axes[index].baseStep,
        parser: config.parser,
        props: config.axes[index].textProps,
        value: createValue(0, {
          constraint: config.axes[index].constraint
        }),
        viewProps: config.viewProps
      });
    }
    class PointNdTextController {
      constructor(doc2, config) {
        this.value = config.value;
        this.viewProps = config.viewProps;
        this.acs_ = config.axes.map((_, index) => createAxisController(doc2, config, index));
        this.acs_.forEach((c, index) => {
          connectValues({
            primary: this.value,
            secondary: c.value,
            forward: (p2) => {
              return config.assembly.toComponents(p2.rawValue)[index];
            },
            backward: (p2, s) => {
              const comps = config.assembly.toComponents(p2.rawValue);
              comps[index] = s.rawValue;
              return config.assembly.fromComponents(comps);
            }
          });
        });
        this.view = new PointNdTextView(doc2, {
          textViews: this.acs_.map((ac) => ac.view)
        });
      }
    }
    function createStepConstraint(params, initialValue) {
      if ("step" in params && !isEmpty(params.step)) {
        return new StepConstraint(params.step, initialValue);
      }
      return null;
    }
    function createRangeConstraint(params) {
      if ("max" in params && !isEmpty(params.max) || "min" in params && !isEmpty(params.min)) {
        return new RangeConstraint({
          max: params.max,
          min: params.min
        });
      }
      return null;
    }
    function createConstraint$4(params, initialValue) {
      const constraints = [];
      const sc = createStepConstraint(params, initialValue);
      if (sc) {
        constraints.push(sc);
      }
      const rc = createRangeConstraint(params);
      if (rc) {
        constraints.push(rc);
      }
      const lc = createListConstraint(params.options);
      if (lc) {
        constraints.push(lc);
      }
      return new CompositeConstraint(constraints);
    }
    function findRange(constraint) {
      const c = constraint ? findConstraint(constraint, RangeConstraint) : null;
      if (!c) {
        return [void 0, void 0];
      }
      return [c.minValue, c.maxValue];
    }
    function estimateSuitableRange(constraint) {
      const [min, max] = findRange(constraint);
      return [min !== null && min !== void 0 ? min : 0, max !== null && max !== void 0 ? max : 100];
    }
    const NumberInputPlugin = {
      id: "input-number",
      type: "input",
      accept: (value, params) => {
        if (typeof value !== "number") {
          return null;
        }
        const p2 = ParamsParsers;
        const result = parseParams(params, {
          format: p2.optional.function,
          max: p2.optional.number,
          min: p2.optional.number,
          options: p2.optional.custom(parseListOptions),
          step: p2.optional.number
        });
        return result ? {
          initialValue: value,
          params: result
        } : null;
      },
      binding: {
        reader: (_args) => numberFromUnknown,
        constraint: (args) => createConstraint$4(args.params, args.initialValue),
        writer: (_args) => writePrimitive
      },
      controller: (args) => {
        var _a2, _b;
        const value = args.value;
        const c = args.constraint;
        if (c && findConstraint(c, ListConstraint)) {
          return new ListController(args.document, {
            props: ValueMap.fromObject({
              options: (_a2 = findListItems(c)) !== null && _a2 !== void 0 ? _a2 : []
            }),
            value,
            viewProps: args.viewProps
          });
        }
        const formatter = (_b = "format" in args.params ? args.params.format : void 0) !== null && _b !== void 0 ? _b : createNumberFormatter(getSuitableDecimalDigits(c, value.rawValue));
        if (c && findConstraint(c, RangeConstraint)) {
          const [min, max] = estimateSuitableRange(c);
          return new SliderTextController(args.document, {
            baseStep: getBaseStep(c),
            parser: parseNumber,
            sliderProps: ValueMap.fromObject({
              maxValue: max,
              minValue: min
            }),
            textProps: ValueMap.fromObject({
              draggingScale: getSuitableDraggingScale(c, value.rawValue),
              formatter
            }),
            value,
            viewProps: args.viewProps
          });
        }
        return new NumberTextController(args.document, {
          baseStep: getBaseStep(c),
          parser: parseNumber,
          props: ValueMap.fromObject({
            draggingScale: getSuitableDraggingScale(c, value.rawValue),
            formatter
          }),
          value,
          viewProps: args.viewProps
        });
      }
    };
    class Point2d {
      constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
      }
      getComponents() {
        return [this.x, this.y];
      }
      static isObject(obj) {
        if (isEmpty(obj)) {
          return false;
        }
        const x = obj.x;
        const y = obj.y;
        if (typeof x !== "number" || typeof y !== "number") {
          return false;
        }
        return true;
      }
      static equals(v1, v2) {
        return v1.x === v2.x && v1.y === v2.y;
      }
      toObject() {
        return {
          x: this.x,
          y: this.y
        };
      }
    }
    const Point2dAssembly = {
      toComponents: (p2) => p2.getComponents(),
      fromComponents: (comps) => new Point2d(...comps)
    };
    const className$4 = ClassName("p2d");
    class Point2dView {
      constructor(doc2, config) {
        this.element = doc2.createElement("div");
        this.element.classList.add(className$4());
        config.viewProps.bindClassModifiers(this.element);
        bindValue(config.expanded, valueToClassName(this.element, className$4(void 0, "expanded")));
        const headElem = doc2.createElement("div");
        headElem.classList.add(className$4("h"));
        this.element.appendChild(headElem);
        const buttonElem = doc2.createElement("button");
        buttonElem.classList.add(className$4("b"));
        buttonElem.appendChild(createSvgIconElement(doc2, "p2dpad"));
        config.viewProps.bindDisabled(buttonElem);
        headElem.appendChild(buttonElem);
        this.buttonElement = buttonElem;
        const textElem = doc2.createElement("div");
        textElem.classList.add(className$4("t"));
        headElem.appendChild(textElem);
        this.textElement = textElem;
        if (config.pickerLayout === "inline") {
          const pickerElem = doc2.createElement("div");
          pickerElem.classList.add(className$4("p"));
          this.element.appendChild(pickerElem);
          this.pickerElement = pickerElem;
        } else {
          this.pickerElement = null;
        }
      }
    }
    const className$3 = ClassName("p2dp");
    class Point2dPickerView {
      constructor(doc2, config) {
        this.onFoldableChange_ = this.onFoldableChange_.bind(this);
        this.onValueChange_ = this.onValueChange_.bind(this);
        this.invertsY_ = config.invertsY;
        this.maxValue_ = config.maxValue;
        this.element = doc2.createElement("div");
        this.element.classList.add(className$3());
        if (config.layout === "popup") {
          this.element.classList.add(className$3(void 0, "p"));
        }
        const padElem = doc2.createElement("div");
        padElem.classList.add(className$3("p"));
        config.viewProps.bindTabIndex(padElem);
        this.element.appendChild(padElem);
        this.padElement = padElem;
        const svgElem = doc2.createElementNS(SVG_NS, "svg");
        svgElem.classList.add(className$3("g"));
        this.padElement.appendChild(svgElem);
        this.svgElem_ = svgElem;
        const xAxisElem = doc2.createElementNS(SVG_NS, "line");
        xAxisElem.classList.add(className$3("ax"));
        xAxisElem.setAttributeNS(null, "x1", "0");
        xAxisElem.setAttributeNS(null, "y1", "50%");
        xAxisElem.setAttributeNS(null, "x2", "100%");
        xAxisElem.setAttributeNS(null, "y2", "50%");
        this.svgElem_.appendChild(xAxisElem);
        const yAxisElem = doc2.createElementNS(SVG_NS, "line");
        yAxisElem.classList.add(className$3("ax"));
        yAxisElem.setAttributeNS(null, "x1", "50%");
        yAxisElem.setAttributeNS(null, "y1", "0");
        yAxisElem.setAttributeNS(null, "x2", "50%");
        yAxisElem.setAttributeNS(null, "y2", "100%");
        this.svgElem_.appendChild(yAxisElem);
        const lineElem = doc2.createElementNS(SVG_NS, "line");
        lineElem.classList.add(className$3("l"));
        lineElem.setAttributeNS(null, "x1", "50%");
        lineElem.setAttributeNS(null, "y1", "50%");
        this.svgElem_.appendChild(lineElem);
        this.lineElem_ = lineElem;
        const markerElem = doc2.createElement("div");
        markerElem.classList.add(className$3("m"));
        this.padElement.appendChild(markerElem);
        this.markerElem_ = markerElem;
        config.value.emitter.on("change", this.onValueChange_);
        this.value = config.value;
        this.update_();
      }
      get allFocusableElements() {
        return [this.padElement];
      }
      update_() {
        const [x, y] = this.value.rawValue.getComponents();
        const max = this.maxValue_;
        const px = mapRange(x, -max, +max, 0, 100);
        const py = mapRange(y, -max, +max, 0, 100);
        const ipy = this.invertsY_ ? 100 - py : py;
        this.lineElem_.setAttributeNS(null, "x2", `${px}%`);
        this.lineElem_.setAttributeNS(null, "y2", `${ipy}%`);
        this.markerElem_.style.left = `${px}%`;
        this.markerElem_.style.top = `${ipy}%`;
      }
      onValueChange_() {
        this.update_();
      }
      onFoldableChange_() {
        this.update_();
      }
    }
    function computeOffset(ev, baseSteps, invertsY) {
      return [
        getStepForKey(baseSteps[0], getHorizontalStepKeys(ev)),
        getStepForKey(baseSteps[1], getVerticalStepKeys(ev)) * (invertsY ? 1 : -1)
      ];
    }
    class Point2dPickerController {
      constructor(doc2, config) {
        this.onPadKeyDown_ = this.onPadKeyDown_.bind(this);
        this.onPadKeyUp_ = this.onPadKeyUp_.bind(this);
        this.onPointerDown_ = this.onPointerDown_.bind(this);
        this.onPointerMove_ = this.onPointerMove_.bind(this);
        this.onPointerUp_ = this.onPointerUp_.bind(this);
        this.value = config.value;
        this.viewProps = config.viewProps;
        this.baseSteps_ = config.baseSteps;
        this.maxValue_ = config.maxValue;
        this.invertsY_ = config.invertsY;
        this.view = new Point2dPickerView(doc2, {
          invertsY: this.invertsY_,
          layout: config.layout,
          maxValue: this.maxValue_,
          value: this.value,
          viewProps: this.viewProps
        });
        this.ptHandler_ = new PointerHandler(this.view.padElement);
        this.ptHandler_.emitter.on("down", this.onPointerDown_);
        this.ptHandler_.emitter.on("move", this.onPointerMove_);
        this.ptHandler_.emitter.on("up", this.onPointerUp_);
        this.view.padElement.addEventListener("keydown", this.onPadKeyDown_);
        this.view.padElement.addEventListener("keyup", this.onPadKeyUp_);
      }
      handlePointerEvent_(d, opts) {
        if (!d.point) {
          return;
        }
        const max = this.maxValue_;
        const px = mapRange(d.point.x, 0, d.bounds.width, -max, +max);
        const py = mapRange(this.invertsY_ ? d.bounds.height - d.point.y : d.point.y, 0, d.bounds.height, -max, +max);
        this.value.setRawValue(new Point2d(px, py), opts);
      }
      onPointerDown_(ev) {
        this.handlePointerEvent_(ev.data, {
          forceEmit: false,
          last: false
        });
      }
      onPointerMove_(ev) {
        this.handlePointerEvent_(ev.data, {
          forceEmit: false,
          last: false
        });
      }
      onPointerUp_(ev) {
        this.handlePointerEvent_(ev.data, {
          forceEmit: true,
          last: true
        });
      }
      onPadKeyDown_(ev) {
        if (isArrowKey(ev.key)) {
          ev.preventDefault();
        }
        const [dx, dy] = computeOffset(ev, this.baseSteps_, this.invertsY_);
        if (dx === 0 && dy === 0) {
          return;
        }
        this.value.setRawValue(new Point2d(this.value.rawValue.x + dx, this.value.rawValue.y + dy), {
          forceEmit: false,
          last: false
        });
      }
      onPadKeyUp_(ev) {
        const [dx, dy] = computeOffset(ev, this.baseSteps_, this.invertsY_);
        if (dx === 0 && dy === 0) {
          return;
        }
        this.value.setRawValue(this.value.rawValue, {
          forceEmit: true,
          last: true
        });
      }
    }
    class Point2dController {
      constructor(doc2, config) {
        var _a2, _b;
        this.onPopupChildBlur_ = this.onPopupChildBlur_.bind(this);
        this.onPopupChildKeydown_ = this.onPopupChildKeydown_.bind(this);
        this.onPadButtonBlur_ = this.onPadButtonBlur_.bind(this);
        this.onPadButtonClick_ = this.onPadButtonClick_.bind(this);
        this.value = config.value;
        this.viewProps = config.viewProps;
        this.foldable_ = Foldable.create(config.expanded);
        this.popC_ = config.pickerLayout === "popup" ? new PopupController(doc2, {
          viewProps: this.viewProps
        }) : null;
        const padC = new Point2dPickerController(doc2, {
          baseSteps: [config.axes[0].baseStep, config.axes[1].baseStep],
          invertsY: config.invertsY,
          layout: config.pickerLayout,
          maxValue: config.maxValue,
          value: this.value,
          viewProps: this.viewProps
        });
        padC.view.allFocusableElements.forEach((elem) => {
          elem.addEventListener("blur", this.onPopupChildBlur_);
          elem.addEventListener("keydown", this.onPopupChildKeydown_);
        });
        this.pickerC_ = padC;
        this.textC_ = new PointNdTextController(doc2, {
          assembly: Point2dAssembly,
          axes: config.axes,
          parser: config.parser,
          value: this.value,
          viewProps: this.viewProps
        });
        this.view = new Point2dView(doc2, {
          expanded: this.foldable_.value("expanded"),
          pickerLayout: config.pickerLayout,
          viewProps: this.viewProps
        });
        this.view.textElement.appendChild(this.textC_.view.element);
        (_a2 = this.view.buttonElement) === null || _a2 === void 0 ? void 0 : _a2.addEventListener("blur", this.onPadButtonBlur_);
        (_b = this.view.buttonElement) === null || _b === void 0 ? void 0 : _b.addEventListener("click", this.onPadButtonClick_);
        if (this.popC_) {
          this.view.element.appendChild(this.popC_.view.element);
          this.popC_.view.element.appendChild(this.pickerC_.view.element);
          connectValues({
            primary: this.foldable_.value("expanded"),
            secondary: this.popC_.shows,
            forward: (p2) => p2.rawValue,
            backward: (_, s) => s.rawValue
          });
        } else if (this.view.pickerElement) {
          this.view.pickerElement.appendChild(this.pickerC_.view.element);
          bindFoldable(this.foldable_, this.view.pickerElement);
        }
      }
      onPadButtonBlur_(e) {
        if (!this.popC_) {
          return;
        }
        const elem = this.view.element;
        const nextTarget = forceCast(e.relatedTarget);
        if (!nextTarget || !elem.contains(nextTarget)) {
          this.popC_.shows.rawValue = false;
        }
      }
      onPadButtonClick_() {
        this.foldable_.set("expanded", !this.foldable_.get("expanded"));
        if (this.foldable_.get("expanded")) {
          this.pickerC_.view.allFocusableElements[0].focus();
        }
      }
      onPopupChildBlur_(ev) {
        if (!this.popC_) {
          return;
        }
        const elem = this.popC_.view.element;
        const nextTarget = findNextTarget(ev);
        if (nextTarget && elem.contains(nextTarget)) {
          return;
        }
        if (nextTarget && nextTarget === this.view.buttonElement && !supportsTouch(elem.ownerDocument)) {
          return;
        }
        this.popC_.shows.rawValue = false;
      }
      onPopupChildKeydown_(ev) {
        if (this.popC_) {
          if (ev.key === "Escape") {
            this.popC_.shows.rawValue = false;
          }
        } else if (this.view.pickerElement) {
          if (ev.key === "Escape") {
            this.view.buttonElement.focus();
          }
        }
      }
    }
    function point2dFromUnknown(value) {
      return Point2d.isObject(value) ? new Point2d(value.x, value.y) : new Point2d();
    }
    function writePoint2d(target, value) {
      target.writeProperty("x", value.x);
      target.writeProperty("y", value.y);
    }
    function createDimensionConstraint(params, initialValue) {
      if (!params) {
        return void 0;
      }
      const constraints = [];
      const cs = createStepConstraint(params, initialValue);
      if (cs) {
        constraints.push(cs);
      }
      const rs = createRangeConstraint(params);
      if (rs) {
        constraints.push(rs);
      }
      return new CompositeConstraint(constraints);
    }
    function createConstraint$3(params, initialValue) {
      return new PointNdConstraint({
        assembly: Point2dAssembly,
        components: [
          createDimensionConstraint("x" in params ? params.x : void 0, initialValue.x),
          createDimensionConstraint("y" in params ? params.y : void 0, initialValue.y)
        ]
      });
    }
    function getSuitableMaxDimensionValue(constraint, rawValue) {
      var _a2, _b;
      const rc = constraint && findConstraint(constraint, RangeConstraint);
      if (rc) {
        return Math.max(Math.abs((_a2 = rc.minValue) !== null && _a2 !== void 0 ? _a2 : 0), Math.abs((_b = rc.maxValue) !== null && _b !== void 0 ? _b : 0));
      }
      const step = getBaseStep(constraint);
      return Math.max(Math.abs(step) * 10, Math.abs(rawValue) * 10);
    }
    function getSuitableMaxValue(initialValue, constraint) {
      const xc = constraint instanceof PointNdConstraint ? constraint.components[0] : void 0;
      const yc = constraint instanceof PointNdConstraint ? constraint.components[1] : void 0;
      const xr = getSuitableMaxDimensionValue(xc, initialValue.x);
      const yr = getSuitableMaxDimensionValue(yc, initialValue.y);
      return Math.max(xr, yr);
    }
    function createAxis$2(initialValue, constraint) {
      return {
        baseStep: getBaseStep(constraint),
        constraint,
        textProps: ValueMap.fromObject({
          draggingScale: getSuitableDraggingScale(constraint, initialValue),
          formatter: createNumberFormatter(getSuitableDecimalDigits(constraint, initialValue))
        })
      };
    }
    function shouldInvertY(params) {
      if (!("y" in params)) {
        return false;
      }
      const yParams = params.y;
      if (!yParams) {
        return false;
      }
      return "inverted" in yParams ? !!yParams.inverted : false;
    }
    const Point2dInputPlugin = {
      id: "input-point2d",
      type: "input",
      accept: (value, params) => {
        if (!Point2d.isObject(value)) {
          return null;
        }
        const p2 = ParamsParsers;
        const result = parseParams(params, {
          expanded: p2.optional.boolean,
          picker: p2.optional.custom(parsePickerLayout),
          x: p2.optional.custom(parsePointDimensionParams),
          y: p2.optional.object({
            inverted: p2.optional.boolean,
            max: p2.optional.number,
            min: p2.optional.number,
            step: p2.optional.number
          })
        });
        return result ? {
          initialValue: value,
          params: result
        } : null;
      },
      binding: {
        reader: (_args) => point2dFromUnknown,
        constraint: (args) => createConstraint$3(args.params, args.initialValue),
        equals: Point2d.equals,
        writer: (_args) => writePoint2d
      },
      controller: (args) => {
        const doc2 = args.document;
        const value = args.value;
        const c = args.constraint;
        if (!(c instanceof PointNdConstraint)) {
          throw TpError.shouldNeverHappen();
        }
        const expanded = "expanded" in args.params ? args.params.expanded : void 0;
        const picker = "picker" in args.params ? args.params.picker : void 0;
        return new Point2dController(doc2, {
          axes: [
            createAxis$2(value.rawValue.x, c.components[0]),
            createAxis$2(value.rawValue.y, c.components[1])
          ],
          expanded: expanded !== null && expanded !== void 0 ? expanded : false,
          invertsY: shouldInvertY(args.params),
          maxValue: getSuitableMaxValue(value.rawValue, c),
          parser: parseNumber,
          pickerLayout: picker !== null && picker !== void 0 ? picker : "popup",
          value,
          viewProps: args.viewProps
        });
      }
    };
    class Point3d {
      constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
      }
      getComponents() {
        return [this.x, this.y, this.z];
      }
      static isObject(obj) {
        if (isEmpty(obj)) {
          return false;
        }
        const x = obj.x;
        const y = obj.y;
        const z = obj.z;
        if (typeof x !== "number" || typeof y !== "number" || typeof z !== "number") {
          return false;
        }
        return true;
      }
      static equals(v1, v2) {
        return v1.x === v2.x && v1.y === v2.y && v1.z === v2.z;
      }
      toObject() {
        return {
          x: this.x,
          y: this.y,
          z: this.z
        };
      }
    }
    const Point3dAssembly = {
      toComponents: (p2) => p2.getComponents(),
      fromComponents: (comps) => new Point3d(...comps)
    };
    function point3dFromUnknown(value) {
      return Point3d.isObject(value) ? new Point3d(value.x, value.y, value.z) : new Point3d();
    }
    function writePoint3d(target, value) {
      target.writeProperty("x", value.x);
      target.writeProperty("y", value.y);
      target.writeProperty("z", value.z);
    }
    function createConstraint$2(params, initialValue) {
      return new PointNdConstraint({
        assembly: Point3dAssembly,
        components: [
          createDimensionConstraint("x" in params ? params.x : void 0, initialValue.x),
          createDimensionConstraint("y" in params ? params.y : void 0, initialValue.y),
          createDimensionConstraint("z" in params ? params.z : void 0, initialValue.z)
        ]
      });
    }
    function createAxis$1(initialValue, constraint) {
      return {
        baseStep: getBaseStep(constraint),
        constraint,
        textProps: ValueMap.fromObject({
          draggingScale: getSuitableDraggingScale(constraint, initialValue),
          formatter: createNumberFormatter(getSuitableDecimalDigits(constraint, initialValue))
        })
      };
    }
    const Point3dInputPlugin = {
      id: "input-point3d",
      type: "input",
      accept: (value, params) => {
        if (!Point3d.isObject(value)) {
          return null;
        }
        const p2 = ParamsParsers;
        const result = parseParams(params, {
          x: p2.optional.custom(parsePointDimensionParams),
          y: p2.optional.custom(parsePointDimensionParams),
          z: p2.optional.custom(parsePointDimensionParams)
        });
        return result ? {
          initialValue: value,
          params: result
        } : null;
      },
      binding: {
        reader: (_args) => point3dFromUnknown,
        constraint: (args) => createConstraint$2(args.params, args.initialValue),
        equals: Point3d.equals,
        writer: (_args) => writePoint3d
      },
      controller: (args) => {
        const value = args.value;
        const c = args.constraint;
        if (!(c instanceof PointNdConstraint)) {
          throw TpError.shouldNeverHappen();
        }
        return new PointNdTextController(args.document, {
          assembly: Point3dAssembly,
          axes: [
            createAxis$1(value.rawValue.x, c.components[0]),
            createAxis$1(value.rawValue.y, c.components[1]),
            createAxis$1(value.rawValue.z, c.components[2])
          ],
          parser: parseNumber,
          value,
          viewProps: args.viewProps
        });
      }
    };
    class Point4d {
      constructor(x = 0, y = 0, z = 0, w = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
      }
      getComponents() {
        return [this.x, this.y, this.z, this.w];
      }
      static isObject(obj) {
        if (isEmpty(obj)) {
          return false;
        }
        const x = obj.x;
        const y = obj.y;
        const z = obj.z;
        const w = obj.w;
        if (typeof x !== "number" || typeof y !== "number" || typeof z !== "number" || typeof w !== "number") {
          return false;
        }
        return true;
      }
      static equals(v1, v2) {
        return v1.x === v2.x && v1.y === v2.y && v1.z === v2.z && v1.w === v2.w;
      }
      toObject() {
        return {
          x: this.x,
          y: this.y,
          z: this.z,
          w: this.w
        };
      }
    }
    const Point4dAssembly = {
      toComponents: (p2) => p2.getComponents(),
      fromComponents: (comps) => new Point4d(...comps)
    };
    function point4dFromUnknown(value) {
      return Point4d.isObject(value) ? new Point4d(value.x, value.y, value.z, value.w) : new Point4d();
    }
    function writePoint4d(target, value) {
      target.writeProperty("x", value.x);
      target.writeProperty("y", value.y);
      target.writeProperty("z", value.z);
      target.writeProperty("w", value.w);
    }
    function createConstraint$1(params, initialValue) {
      return new PointNdConstraint({
        assembly: Point4dAssembly,
        components: [
          createDimensionConstraint("x" in params ? params.x : void 0, initialValue.x),
          createDimensionConstraint("y" in params ? params.y : void 0, initialValue.y),
          createDimensionConstraint("z" in params ? params.z : void 0, initialValue.z),
          createDimensionConstraint("w" in params ? params.w : void 0, initialValue.w)
        ]
      });
    }
    function createAxis(initialValue, constraint) {
      return {
        baseStep: getBaseStep(constraint),
        constraint,
        textProps: ValueMap.fromObject({
          draggingScale: getSuitableDraggingScale(constraint, initialValue),
          formatter: createNumberFormatter(getSuitableDecimalDigits(constraint, initialValue))
        })
      };
    }
    const Point4dInputPlugin = {
      id: "input-point4d",
      type: "input",
      accept: (value, params) => {
        if (!Point4d.isObject(value)) {
          return null;
        }
        const p2 = ParamsParsers;
        const result = parseParams(params, {
          x: p2.optional.custom(parsePointDimensionParams),
          y: p2.optional.custom(parsePointDimensionParams),
          z: p2.optional.custom(parsePointDimensionParams),
          w: p2.optional.custom(parsePointDimensionParams)
        });
        return result ? {
          initialValue: value,
          params: result
        } : null;
      },
      binding: {
        reader: (_args) => point4dFromUnknown,
        constraint: (args) => createConstraint$1(args.params, args.initialValue),
        equals: Point4d.equals,
        writer: (_args) => writePoint4d
      },
      controller: (args) => {
        const value = args.value;
        const c = args.constraint;
        if (!(c instanceof PointNdConstraint)) {
          throw TpError.shouldNeverHappen();
        }
        return new PointNdTextController(args.document, {
          assembly: Point4dAssembly,
          axes: value.rawValue.getComponents().map((comp, index) => createAxis(comp, c.components[index])),
          parser: parseNumber,
          value,
          viewProps: args.viewProps
        });
      }
    };
    function createConstraint(params) {
      const constraints = [];
      const lc = createListConstraint(params.options);
      if (lc) {
        constraints.push(lc);
      }
      return new CompositeConstraint(constraints);
    }
    const StringInputPlugin = {
      id: "input-string",
      type: "input",
      accept: (value, params) => {
        if (typeof value !== "string") {
          return null;
        }
        const p2 = ParamsParsers;
        const result = parseParams(params, {
          options: p2.optional.custom(parseListOptions)
        });
        return result ? {
          initialValue: value,
          params: result
        } : null;
      },
      binding: {
        reader: (_args) => stringFromUnknown,
        constraint: (args) => createConstraint(args.params),
        writer: (_args) => writePrimitive
      },
      controller: (args) => {
        var _a2;
        const doc2 = args.document;
        const value = args.value;
        const c = args.constraint;
        if (c && findConstraint(c, ListConstraint)) {
          return new ListController(doc2, {
            props: ValueMap.fromObject({
              options: (_a2 = findListItems(c)) !== null && _a2 !== void 0 ? _a2 : []
            }),
            value,
            viewProps: args.viewProps
          });
        }
        return new TextController(doc2, {
          parser: (v) => v,
          props: ValueMap.fromObject({
            formatter: formatString
          }),
          value,
          viewProps: args.viewProps
        });
      }
    };
    const Constants = {
      monitor: {
        defaultInterval: 200,
        defaultLineCount: 3
      }
    };
    const className$2 = ClassName("mll");
    class MultiLogView {
      constructor(doc2, config) {
        this.onValueUpdate_ = this.onValueUpdate_.bind(this);
        this.formatter_ = config.formatter;
        this.element = doc2.createElement("div");
        this.element.classList.add(className$2());
        config.viewProps.bindClassModifiers(this.element);
        const textareaElem = doc2.createElement("textarea");
        textareaElem.classList.add(className$2("i"));
        textareaElem.style.height = `calc(var(--bld-us) * ${config.lineCount})`;
        textareaElem.readOnly = true;
        config.viewProps.bindDisabled(textareaElem);
        this.element.appendChild(textareaElem);
        this.textareaElem_ = textareaElem;
        config.value.emitter.on("change", this.onValueUpdate_);
        this.value = config.value;
        this.update_();
      }
      update_() {
        const elem = this.textareaElem_;
        const shouldScroll = elem.scrollTop === elem.scrollHeight - elem.clientHeight;
        const lines = [];
        this.value.rawValue.forEach((value) => {
          if (value !== void 0) {
            lines.push(this.formatter_(value));
          }
        });
        elem.textContent = lines.join("\n");
        if (shouldScroll) {
          elem.scrollTop = elem.scrollHeight;
        }
      }
      onValueUpdate_() {
        this.update_();
      }
    }
    class MultiLogController {
      constructor(doc2, config) {
        this.value = config.value;
        this.viewProps = config.viewProps;
        this.view = new MultiLogView(doc2, {
          formatter: config.formatter,
          lineCount: config.lineCount,
          value: this.value,
          viewProps: this.viewProps
        });
      }
    }
    const className$1 = ClassName("sgl");
    class SingleLogView {
      constructor(doc2, config) {
        this.onValueUpdate_ = this.onValueUpdate_.bind(this);
        this.formatter_ = config.formatter;
        this.element = doc2.createElement("div");
        this.element.classList.add(className$1());
        config.viewProps.bindClassModifiers(this.element);
        const inputElem = doc2.createElement("input");
        inputElem.classList.add(className$1("i"));
        inputElem.readOnly = true;
        inputElem.type = "text";
        config.viewProps.bindDisabled(inputElem);
        this.element.appendChild(inputElem);
        this.inputElement = inputElem;
        config.value.emitter.on("change", this.onValueUpdate_);
        this.value = config.value;
        this.update_();
      }
      update_() {
        const values = this.value.rawValue;
        const lastValue = values[values.length - 1];
        this.inputElement.value = lastValue !== void 0 ? this.formatter_(lastValue) : "";
      }
      onValueUpdate_() {
        this.update_();
      }
    }
    class SingleLogController {
      constructor(doc2, config) {
        this.value = config.value;
        this.viewProps = config.viewProps;
        this.view = new SingleLogView(doc2, {
          formatter: config.formatter,
          value: this.value,
          viewProps: this.viewProps
        });
      }
    }
    const BooleanMonitorPlugin = {
      id: "monitor-bool",
      type: "monitor",
      accept: (value, params) => {
        if (typeof value !== "boolean") {
          return null;
        }
        const p2 = ParamsParsers;
        const result = parseParams(params, {
          lineCount: p2.optional.number
        });
        return result ? {
          initialValue: value,
          params: result
        } : null;
      },
      binding: {
        reader: (_args) => boolFromUnknown
      },
      controller: (args) => {
        var _a2;
        if (args.value.rawValue.length === 1) {
          return new SingleLogController(args.document, {
            formatter: BooleanFormatter,
            value: args.value,
            viewProps: args.viewProps
          });
        }
        return new MultiLogController(args.document, {
          formatter: BooleanFormatter,
          lineCount: (_a2 = args.params.lineCount) !== null && _a2 !== void 0 ? _a2 : Constants.monitor.defaultLineCount,
          value: args.value,
          viewProps: args.viewProps
        });
      }
    };
    const className = ClassName("grl");
    class GraphLogView {
      constructor(doc2, config) {
        this.onCursorChange_ = this.onCursorChange_.bind(this);
        this.onValueUpdate_ = this.onValueUpdate_.bind(this);
        this.element = doc2.createElement("div");
        this.element.classList.add(className());
        config.viewProps.bindClassModifiers(this.element);
        this.formatter_ = config.formatter;
        this.props_ = config.props;
        this.cursor_ = config.cursor;
        this.cursor_.emitter.on("change", this.onCursorChange_);
        const svgElem = doc2.createElementNS(SVG_NS, "svg");
        svgElem.classList.add(className("g"));
        svgElem.style.height = `calc(var(--bld-us) * ${config.lineCount})`;
        this.element.appendChild(svgElem);
        this.svgElem_ = svgElem;
        const lineElem = doc2.createElementNS(SVG_NS, "polyline");
        this.svgElem_.appendChild(lineElem);
        this.lineElem_ = lineElem;
        const tooltipElem = doc2.createElement("div");
        tooltipElem.classList.add(className("t"), ClassName("tt")());
        this.element.appendChild(tooltipElem);
        this.tooltipElem_ = tooltipElem;
        config.value.emitter.on("change", this.onValueUpdate_);
        this.value = config.value;
        this.update_();
      }
      get graphElement() {
        return this.svgElem_;
      }
      update_() {
        const bounds = this.svgElem_.getBoundingClientRect();
        const maxIndex = this.value.rawValue.length - 1;
        const min = this.props_.get("minValue");
        const max = this.props_.get("maxValue");
        const points = [];
        this.value.rawValue.forEach((v, index) => {
          if (v === void 0) {
            return;
          }
          const x = mapRange(index, 0, maxIndex, 0, bounds.width);
          const y = mapRange(v, min, max, bounds.height, 0);
          points.push([x, y].join(","));
        });
        this.lineElem_.setAttributeNS(null, "points", points.join(" "));
        const tooltipElem = this.tooltipElem_;
        const value = this.value.rawValue[this.cursor_.rawValue];
        if (value === void 0) {
          tooltipElem.classList.remove(className("t", "a"));
          return;
        }
        const tx = mapRange(this.cursor_.rawValue, 0, maxIndex, 0, bounds.width);
        const ty = mapRange(value, min, max, bounds.height, 0);
        tooltipElem.style.left = `${tx}px`;
        tooltipElem.style.top = `${ty}px`;
        tooltipElem.textContent = `${this.formatter_(value)}`;
        if (!tooltipElem.classList.contains(className("t", "a"))) {
          tooltipElem.classList.add(className("t", "a"), className("t", "in"));
          forceReflow(tooltipElem);
          tooltipElem.classList.remove(className("t", "in"));
        }
      }
      onValueUpdate_() {
        this.update_();
      }
      onCursorChange_() {
        this.update_();
      }
    }
    class GraphLogController {
      constructor(doc2, config) {
        this.onGraphMouseMove_ = this.onGraphMouseMove_.bind(this);
        this.onGraphMouseLeave_ = this.onGraphMouseLeave_.bind(this);
        this.onGraphPointerDown_ = this.onGraphPointerDown_.bind(this);
        this.onGraphPointerMove_ = this.onGraphPointerMove_.bind(this);
        this.onGraphPointerUp_ = this.onGraphPointerUp_.bind(this);
        this.props_ = config.props;
        this.value = config.value;
        this.viewProps = config.viewProps;
        this.cursor_ = createValue(-1);
        this.view = new GraphLogView(doc2, {
          cursor: this.cursor_,
          formatter: config.formatter,
          lineCount: config.lineCount,
          props: this.props_,
          value: this.value,
          viewProps: this.viewProps
        });
        if (!supportsTouch(doc2)) {
          this.view.element.addEventListener("mousemove", this.onGraphMouseMove_);
          this.view.element.addEventListener("mouseleave", this.onGraphMouseLeave_);
        } else {
          const ph = new PointerHandler(this.view.element);
          ph.emitter.on("down", this.onGraphPointerDown_);
          ph.emitter.on("move", this.onGraphPointerMove_);
          ph.emitter.on("up", this.onGraphPointerUp_);
        }
      }
      onGraphMouseLeave_() {
        this.cursor_.rawValue = -1;
      }
      onGraphMouseMove_(ev) {
        const bounds = this.view.element.getBoundingClientRect();
        this.cursor_.rawValue = Math.floor(mapRange(ev.offsetX, 0, bounds.width, 0, this.value.rawValue.length));
      }
      onGraphPointerDown_(ev) {
        this.onGraphPointerMove_(ev);
      }
      onGraphPointerMove_(ev) {
        if (!ev.data.point) {
          this.cursor_.rawValue = -1;
          return;
        }
        this.cursor_.rawValue = Math.floor(mapRange(ev.data.point.x, 0, ev.data.bounds.width, 0, this.value.rawValue.length));
      }
      onGraphPointerUp_() {
        this.cursor_.rawValue = -1;
      }
    }
    function createFormatter(params) {
      return "format" in params && !isEmpty(params.format) ? params.format : createNumberFormatter(2);
    }
    function createTextMonitor(args) {
      var _a2;
      if (args.value.rawValue.length === 1) {
        return new SingleLogController(args.document, {
          formatter: createFormatter(args.params),
          value: args.value,
          viewProps: args.viewProps
        });
      }
      return new MultiLogController(args.document, {
        formatter: createFormatter(args.params),
        lineCount: (_a2 = args.params.lineCount) !== null && _a2 !== void 0 ? _a2 : Constants.monitor.defaultLineCount,
        value: args.value,
        viewProps: args.viewProps
      });
    }
    function createGraphMonitor(args) {
      var _a2, _b, _c;
      return new GraphLogController(args.document, {
        formatter: createFormatter(args.params),
        lineCount: (_a2 = args.params.lineCount) !== null && _a2 !== void 0 ? _a2 : Constants.monitor.defaultLineCount,
        props: ValueMap.fromObject({
          maxValue: (_b = "max" in args.params ? args.params.max : null) !== null && _b !== void 0 ? _b : 100,
          minValue: (_c = "min" in args.params ? args.params.min : null) !== null && _c !== void 0 ? _c : 0
        }),
        value: args.value,
        viewProps: args.viewProps
      });
    }
    function shouldShowGraph(params) {
      return "view" in params && params.view === "graph";
    }
    const NumberMonitorPlugin = {
      id: "monitor-number",
      type: "monitor",
      accept: (value, params) => {
        if (typeof value !== "number") {
          return null;
        }
        const p2 = ParamsParsers;
        const result = parseParams(params, {
          format: p2.optional.function,
          lineCount: p2.optional.number,
          max: p2.optional.number,
          min: p2.optional.number,
          view: p2.optional.string
        });
        return result ? {
          initialValue: value,
          params: result
        } : null;
      },
      binding: {
        defaultBufferSize: (params) => shouldShowGraph(params) ? 64 : 1,
        reader: (_args) => numberFromUnknown
      },
      controller: (args) => {
        if (shouldShowGraph(args.params)) {
          return createGraphMonitor(args);
        }
        return createTextMonitor(args);
      }
    };
    const StringMonitorPlugin = {
      id: "monitor-string",
      type: "monitor",
      accept: (value, params) => {
        if (typeof value !== "string") {
          return null;
        }
        const p2 = ParamsParsers;
        const result = parseParams(params, {
          lineCount: p2.optional.number,
          multiline: p2.optional.boolean
        });
        return result ? {
          initialValue: value,
          params: result
        } : null;
      },
      binding: {
        reader: (_args) => stringFromUnknown
      },
      controller: (args) => {
        var _a2;
        const value = args.value;
        const multiline = value.rawValue.length > 1 || "multiline" in args.params && args.params.multiline;
        if (multiline) {
          return new MultiLogController(args.document, {
            formatter: formatString,
            lineCount: (_a2 = args.params.lineCount) !== null && _a2 !== void 0 ? _a2 : Constants.monitor.defaultLineCount,
            value,
            viewProps: args.viewProps
          });
        }
        return new SingleLogController(args.document, {
          formatter: formatString,
          value,
          viewProps: args.viewProps
        });
      }
    };
    class InputBinding {
      constructor(config) {
        this.onValueChange_ = this.onValueChange_.bind(this);
        this.reader = config.reader;
        this.writer = config.writer;
        this.emitter = new Emitter();
        this.value = config.value;
        this.value.emitter.on("change", this.onValueChange_);
        this.target = config.target;
        this.read();
      }
      read() {
        const targetValue = this.target.read();
        if (targetValue !== void 0) {
          this.value.rawValue = this.reader(targetValue);
        }
      }
      write_(rawValue) {
        this.writer(this.target, rawValue);
      }
      onValueChange_(ev) {
        this.write_(ev.rawValue);
        this.emitter.emit("change", {
          options: ev.options,
          rawValue: ev.rawValue,
          sender: this
        });
      }
    }
    function createInputBindingController(plugin, args) {
      const result = plugin.accept(args.target.read(), args.params);
      if (isEmpty(result)) {
        return null;
      }
      const p2 = ParamsParsers;
      const valueArgs = {
        target: args.target,
        initialValue: result.initialValue,
        params: result.params
      };
      const reader = plugin.binding.reader(valueArgs);
      const constraint = plugin.binding.constraint ? plugin.binding.constraint(valueArgs) : void 0;
      const value = createValue(reader(result.initialValue), {
        constraint,
        equals: plugin.binding.equals
      });
      const binding = new InputBinding({
        reader,
        target: args.target,
        value,
        writer: plugin.binding.writer(valueArgs)
      });
      const disabled = p2.optional.boolean(args.params.disabled).value;
      const hidden = p2.optional.boolean(args.params.hidden).value;
      const controller = plugin.controller({
        constraint,
        document: args.document,
        initialValue: result.initialValue,
        params: result.params,
        value: binding.value,
        viewProps: ViewProps.create({
          disabled,
          hidden
        })
      });
      const label = p2.optional.string(args.params.label).value;
      return new InputBindingController(args.document, {
        binding,
        blade: createBlade(),
        props: ValueMap.fromObject({
          label: label !== null && label !== void 0 ? label : args.target.key
        }),
        valueController: controller
      });
    }
    class MonitorBinding {
      constructor(config) {
        this.onTick_ = this.onTick_.bind(this);
        this.reader_ = config.reader;
        this.target = config.target;
        this.emitter = new Emitter();
        this.value = config.value;
        this.ticker = config.ticker;
        this.ticker.emitter.on("tick", this.onTick_);
        this.read();
      }
      dispose() {
        this.ticker.dispose();
      }
      read() {
        const targetValue = this.target.read();
        if (targetValue === void 0) {
          return;
        }
        const buffer = this.value.rawValue;
        const newValue = this.reader_(targetValue);
        this.value.rawValue = createPushedBuffer(buffer, newValue);
        this.emitter.emit("update", {
          rawValue: newValue,
          sender: this
        });
      }
      onTick_(_) {
        this.read();
      }
    }
    function createTicker(document2, interval) {
      return interval === 0 ? new ManualTicker() : new IntervalTicker(document2, interval !== null && interval !== void 0 ? interval : Constants.monitor.defaultInterval);
    }
    function createMonitorBindingController(plugin, args) {
      var _a2, _b, _c;
      const P = ParamsParsers;
      const result = plugin.accept(args.target.read(), args.params);
      if (isEmpty(result)) {
        return null;
      }
      const bindingArgs = {
        target: args.target,
        initialValue: result.initialValue,
        params: result.params
      };
      const reader = plugin.binding.reader(bindingArgs);
      const bufferSize = (_b = (_a2 = P.optional.number(args.params.bufferSize).value) !== null && _a2 !== void 0 ? _a2 : plugin.binding.defaultBufferSize && plugin.binding.defaultBufferSize(result.params)) !== null && _b !== void 0 ? _b : 1;
      const interval = P.optional.number(args.params.interval).value;
      const binding = new MonitorBinding({
        reader,
        target: args.target,
        ticker: createTicker(args.document, interval),
        value: initializeBuffer(bufferSize)
      });
      const disabled = P.optional.boolean(args.params.disabled).value;
      const hidden = P.optional.boolean(args.params.hidden).value;
      const controller = plugin.controller({
        document: args.document,
        params: result.params,
        value: binding.value,
        viewProps: ViewProps.create({
          disabled,
          hidden
        })
      });
      const label = (_c = P.optional.string(args.params.label).value) !== null && _c !== void 0 ? _c : args.target.key;
      return new MonitorBindingController(args.document, {
        binding,
        blade: createBlade(),
        props: ValueMap.fromObject({
          label
        }),
        valueController: controller
      });
    }
    class PluginPool {
      constructor() {
        this.pluginsMap_ = {
          blades: [],
          inputs: [],
          monitors: []
        };
      }
      getAll() {
        return [
          ...this.pluginsMap_.blades,
          ...this.pluginsMap_.inputs,
          ...this.pluginsMap_.monitors
        ];
      }
      register(r) {
        if (r.type === "blade") {
          this.pluginsMap_.blades.unshift(r);
        } else if (r.type === "input") {
          this.pluginsMap_.inputs.unshift(r);
        } else if (r.type === "monitor") {
          this.pluginsMap_.monitors.unshift(r);
        }
      }
      createInput(document2, target, params) {
        const initialValue = target.read();
        if (isEmpty(initialValue)) {
          throw new TpError({
            context: {
              key: target.key
            },
            type: "nomatchingcontroller"
          });
        }
        const bc = this.pluginsMap_.inputs.reduce((result, plugin) => result !== null && result !== void 0 ? result : createInputBindingController(plugin, {
          document: document2,
          target,
          params
        }), null);
        if (bc) {
          return bc;
        }
        throw new TpError({
          context: {
            key: target.key
          },
          type: "nomatchingcontroller"
        });
      }
      createMonitor(document2, target, params) {
        const bc = this.pluginsMap_.monitors.reduce((result, plugin) => result !== null && result !== void 0 ? result : createMonitorBindingController(plugin, {
          document: document2,
          params,
          target
        }), null);
        if (bc) {
          return bc;
        }
        throw new TpError({
          context: {
            key: target.key
          },
          type: "nomatchingcontroller"
        });
      }
      createBlade(document2, params) {
        const bc = this.pluginsMap_.blades.reduce((result, plugin) => result !== null && result !== void 0 ? result : createBladeController(plugin, {
          document: document2,
          params
        }), null);
        if (!bc) {
          throw new TpError({
            type: "nomatchingview",
            context: {
              params
            }
          });
        }
        return bc;
      }
      createBladeApi(bc) {
        if (bc instanceof InputBindingController) {
          return new InputBindingApi(bc);
        }
        if (bc instanceof MonitorBindingController) {
          return new MonitorBindingApi(bc);
        }
        if (bc instanceof RackController) {
          return new RackApi(bc, this);
        }
        const api = this.pluginsMap_.blades.reduce((result, plugin) => result !== null && result !== void 0 ? result : plugin.api({
          controller: bc,
          pool: this
        }), null);
        if (!api) {
          throw TpError.shouldNeverHappen();
        }
        return api;
      }
    }
    function createDefaultPluginPool() {
      const pool = new PluginPool();
      [
        Point2dInputPlugin,
        Point3dInputPlugin,
        Point4dInputPlugin,
        StringInputPlugin,
        NumberInputPlugin,
        StringColorInputPlugin,
        ObjectColorInputPlugin,
        NumberColorInputPlugin,
        BooleanInputPlugin,
        BooleanMonitorPlugin,
        StringMonitorPlugin,
        NumberMonitorPlugin,
        ButtonBladePlugin,
        FolderBladePlugin,
        SeparatorBladePlugin,
        TabBladePlugin
      ].forEach((p2) => {
        pool.register(p2);
      });
      return pool;
    }
    class ListApi extends BladeApi {
      constructor(controller) {
        super(controller);
        this.emitter_ = new Emitter();
        this.controller_.valueController.value.emitter.on("change", (ev) => {
          this.emitter_.emit("change", {
            event: new TpChangeEvent(this, ev.rawValue)
          });
        });
      }
      get label() {
        return this.controller_.props.get("label");
      }
      set label(label) {
        this.controller_.props.set("label", label);
      }
      get options() {
        return this.controller_.valueController.props.get("options");
      }
      set options(options) {
        this.controller_.valueController.props.set("options", options);
      }
      get value() {
        return this.controller_.valueController.value.rawValue;
      }
      set value(value) {
        this.controller_.valueController.value.rawValue = value;
      }
      on(eventName, handler) {
        const bh = handler.bind(this);
        this.emitter_.on(eventName, (ev) => {
          bh(ev.event);
        });
        return this;
      }
    }
    class SliderApi extends BladeApi {
      constructor(controller) {
        super(controller);
        this.emitter_ = new Emitter();
        this.controller_.valueController.value.emitter.on("change", (ev) => {
          this.emitter_.emit("change", {
            event: new TpChangeEvent(this, ev.rawValue)
          });
        });
      }
      get label() {
        return this.controller_.props.get("label");
      }
      set label(label) {
        this.controller_.props.set("label", label);
      }
      get maxValue() {
        return this.controller_.valueController.sliderController.props.get("maxValue");
      }
      set maxValue(maxValue) {
        this.controller_.valueController.sliderController.props.set("maxValue", maxValue);
      }
      get minValue() {
        return this.controller_.valueController.sliderController.props.get("minValue");
      }
      set minValue(minValue) {
        this.controller_.valueController.sliderController.props.set("minValue", minValue);
      }
      get value() {
        return this.controller_.valueController.value.rawValue;
      }
      set value(value) {
        this.controller_.valueController.value.rawValue = value;
      }
      on(eventName, handler) {
        const bh = handler.bind(this);
        this.emitter_.on(eventName, (ev) => {
          bh(ev.event);
        });
        return this;
      }
    }
    class TextApi extends BladeApi {
      constructor(controller) {
        super(controller);
        this.emitter_ = new Emitter();
        this.controller_.valueController.value.emitter.on("change", (ev) => {
          this.emitter_.emit("change", {
            event: new TpChangeEvent(this, ev.rawValue)
          });
        });
      }
      get label() {
        return this.controller_.props.get("label");
      }
      set label(label) {
        this.controller_.props.set("label", label);
      }
      get formatter() {
        return this.controller_.valueController.props.get("formatter");
      }
      set formatter(formatter) {
        this.controller_.valueController.props.set("formatter", formatter);
      }
      get value() {
        return this.controller_.valueController.value.rawValue;
      }
      set value(value) {
        this.controller_.valueController.value.rawValue = value;
      }
      on(eventName, handler) {
        const bh = handler.bind(this);
        this.emitter_.on(eventName, (ev) => {
          bh(ev.event);
        });
        return this;
      }
    }
    const ListBladePlugin = function() {
      return {
        id: "list",
        type: "blade",
        accept(params) {
          const p2 = ParamsParsers;
          const result = parseParams(params, {
            options: p2.required.custom(parseListOptions),
            value: p2.required.raw,
            view: p2.required.constant("list"),
            label: p2.optional.string
          });
          return result ? { params: result } : null;
        },
        controller(args) {
          const ic = new ListController(args.document, {
            props: ValueMap.fromObject({
              options: normalizeListOptions(args.params.options)
            }),
            value: createValue(args.params.value),
            viewProps: args.viewProps
          });
          return new LabeledValueController(args.document, {
            blade: args.blade,
            props: ValueMap.fromObject({
              label: args.params.label
            }),
            valueController: ic
          });
        },
        api(args) {
          if (!(args.controller instanceof LabeledValueController)) {
            return null;
          }
          if (!(args.controller.valueController instanceof ListController)) {
            return null;
          }
          return new ListApi(args.controller);
        }
      };
    }();
    function exportPresetJson(targets) {
      return targets.reduce((result, target) => {
        return Object.assign(result, {
          [target.presetKey]: target.read()
        });
      }, {});
    }
    function importPresetJson(targets, preset) {
      targets.forEach((target) => {
        const value = preset[target.presetKey];
        if (value !== void 0) {
          target.write(value);
        }
      });
    }
    class RootApi extends FolderApi {
      constructor(controller, pool) {
        super(controller, pool);
      }
      get element() {
        return this.controller_.view.element;
      }
      importPreset(preset) {
        const targets = this.controller_.rackController.rack.find(InputBindingController).map((ibc) => {
          return ibc.binding.target;
        });
        importPresetJson(targets, preset);
        this.refresh();
      }
      exportPreset() {
        const targets = this.controller_.rackController.rack.find(InputBindingController).map((ibc) => {
          return ibc.binding.target;
        });
        return exportPresetJson(targets);
      }
      refresh() {
        this.controller_.rackController.rack.find(InputBindingController).forEach((ibc) => {
          ibc.binding.read();
        });
        this.controller_.rackController.rack.find(MonitorBindingController).forEach((mbc) => {
          mbc.binding.read();
        });
      }
    }
    class RootController extends FolderController {
      constructor(doc2, config) {
        super(doc2, {
          expanded: config.expanded,
          blade: config.blade,
          props: config.props,
          root: true,
          viewProps: config.viewProps
        });
      }
    }
    const SliderBladePlugin = {
      id: "slider",
      type: "blade",
      accept(params) {
        const p2 = ParamsParsers;
        const result = parseParams(params, {
          max: p2.required.number,
          min: p2.required.number,
          view: p2.required.constant("slider"),
          format: p2.optional.function,
          label: p2.optional.string,
          value: p2.optional.number
        });
        return result ? { params: result } : null;
      },
      controller(args) {
        var _a2, _b;
        const v = (_a2 = args.params.value) !== null && _a2 !== void 0 ? _a2 : 0;
        const vc = new SliderTextController(args.document, {
          baseStep: 1,
          parser: parseNumber,
          sliderProps: ValueMap.fromObject({
            maxValue: args.params.max,
            minValue: args.params.min
          }),
          textProps: ValueMap.fromObject({
            draggingScale: getSuitableDraggingScale(void 0, v),
            formatter: (_b = args.params.format) !== null && _b !== void 0 ? _b : numberToString
          }),
          value: createValue(v),
          viewProps: args.viewProps
        });
        return new LabeledValueController(args.document, {
          blade: args.blade,
          props: ValueMap.fromObject({
            label: args.params.label
          }),
          valueController: vc
        });
      },
      api(args) {
        if (!(args.controller instanceof LabeledValueController)) {
          return null;
        }
        if (!(args.controller.valueController instanceof SliderTextController)) {
          return null;
        }
        return new SliderApi(args.controller);
      }
    };
    const TextBladePlugin = function() {
      return {
        id: "text",
        type: "blade",
        accept(params) {
          const p2 = ParamsParsers;
          const result = parseParams(params, {
            parse: p2.required.function,
            value: p2.required.raw,
            view: p2.required.constant("text"),
            format: p2.optional.function,
            label: p2.optional.string
          });
          return result ? { params: result } : null;
        },
        controller(args) {
          var _a2;
          const ic = new TextController(args.document, {
            parser: args.params.parse,
            props: ValueMap.fromObject({
              formatter: (_a2 = args.params.format) !== null && _a2 !== void 0 ? _a2 : (v) => String(v)
            }),
            value: createValue(args.params.value),
            viewProps: args.viewProps
          });
          return new LabeledValueController(args.document, {
            blade: args.blade,
            props: ValueMap.fromObject({
              label: args.params.label
            }),
            valueController: ic
          });
        },
        api(args) {
          if (!(args.controller instanceof LabeledValueController)) {
            return null;
          }
          if (!(args.controller.valueController instanceof TextController)) {
            return null;
          }
          return new TextApi(args.controller);
        }
      };
    }();
    function createDefaultWrapperElement(doc2) {
      const elem = doc2.createElement("div");
      elem.classList.add(ClassName("dfw")());
      if (doc2.body) {
        doc2.body.appendChild(elem);
      }
      return elem;
    }
    function embedStyle(doc2, id, css) {
      if (doc2.querySelector(`style[data-tp-style=${id}]`)) {
        return;
      }
      const styleElem = doc2.createElement("style");
      styleElem.dataset.tpStyle = id;
      styleElem.textContent = css;
      doc2.head.appendChild(styleElem);
    }
    class Pane extends RootApi {
      constructor(opt_config) {
        var _a2, _b;
        const config = opt_config !== null && opt_config !== void 0 ? opt_config : {};
        const doc2 = (_a2 = config.document) !== null && _a2 !== void 0 ? _a2 : getWindowDocument();
        const pool = createDefaultPluginPool();
        const rootController = new RootController(doc2, {
          expanded: config.expanded,
          blade: createBlade(),
          props: ValueMap.fromObject({
            title: config.title
          }),
          viewProps: ViewProps.create()
        });
        super(rootController, pool);
        this.pool_ = pool;
        this.containerElem_ = (_b = config.container) !== null && _b !== void 0 ? _b : createDefaultWrapperElement(doc2);
        this.containerElem_.appendChild(this.element);
        this.doc_ = doc2;
        this.usesDefaultWrapper_ = !config.container;
        this.setUpDefaultPlugins_();
      }
      get document() {
        if (!this.doc_) {
          throw TpError.alreadyDisposed();
        }
        return this.doc_;
      }
      dispose() {
        const containerElem = this.containerElem_;
        if (!containerElem) {
          throw TpError.alreadyDisposed();
        }
        if (this.usesDefaultWrapper_) {
          const parentElem = containerElem.parentElement;
          if (parentElem) {
            parentElem.removeChild(containerElem);
          }
        }
        this.containerElem_ = null;
        this.doc_ = null;
        super.dispose();
      }
      registerPlugin(bundle) {
        const plugins = "plugin" in bundle ? [bundle.plugin] : "plugins" in bundle ? bundle.plugins : [];
        plugins.forEach((p2) => {
          this.pool_.register(p2);
          this.embedPluginStyle_(p2);
        });
      }
      embedPluginStyle_(plugin) {
        if (plugin.css) {
          embedStyle(this.document, `plugin-${plugin.id}`, plugin.css);
        }
      }
      setUpDefaultPlugins_() {
        embedStyle(this.document, "default", '.tp-tbiv_b,.tp-coltxtv_ms,.tp-ckbv_i,.tp-rotv_b,.tp-fldv_b,.tp-mllv_i,.tp-sglv_i,.tp-grlv_g,.tp-txtv_i,.tp-p2dpv_p,.tp-colswv_sw,.tp-p2dv_b,.tp-btnv_b,.tp-lstv_s{-webkit-appearance:none;-moz-appearance:none;appearance:none;background-color:transparent;border-width:0;font-family:inherit;font-size:inherit;font-weight:inherit;margin:0;outline:none;padding:0}.tp-p2dv_b,.tp-btnv_b,.tp-lstv_s{background-color:var(--btn-bg);border-radius:var(--elm-br);color:var(--btn-fg);cursor:pointer;display:block;font-weight:bold;height:var(--bld-us);line-height:var(--bld-us);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.tp-p2dv_b:hover,.tp-btnv_b:hover,.tp-lstv_s:hover{background-color:var(--btn-bg-h)}.tp-p2dv_b:focus,.tp-btnv_b:focus,.tp-lstv_s:focus{background-color:var(--btn-bg-f)}.tp-p2dv_b:active,.tp-btnv_b:active,.tp-lstv_s:active{background-color:var(--btn-bg-a)}.tp-p2dv_b:disabled,.tp-btnv_b:disabled,.tp-lstv_s:disabled{opacity:.5}.tp-txtv_i,.tp-p2dpv_p,.tp-colswv_sw{background-color:var(--in-bg);border-radius:var(--elm-br);box-sizing:border-box;color:var(--in-fg);font-family:inherit;height:var(--bld-us);line-height:var(--bld-us);min-width:0;width:100%}.tp-txtv_i:hover,.tp-p2dpv_p:hover,.tp-colswv_sw:hover{background-color:var(--in-bg-h)}.tp-txtv_i:focus,.tp-p2dpv_p:focus,.tp-colswv_sw:focus{background-color:var(--in-bg-f)}.tp-txtv_i:active,.tp-p2dpv_p:active,.tp-colswv_sw:active{background-color:var(--in-bg-a)}.tp-txtv_i:disabled,.tp-p2dpv_p:disabled,.tp-colswv_sw:disabled{opacity:.5}.tp-mllv_i,.tp-sglv_i,.tp-grlv_g{background-color:var(--mo-bg);border-radius:var(--elm-br);box-sizing:border-box;color:var(--mo-fg);height:var(--bld-us);scrollbar-color:currentColor transparent;scrollbar-width:thin;width:100%}.tp-mllv_i::-webkit-scrollbar,.tp-sglv_i::-webkit-scrollbar,.tp-grlv_g::-webkit-scrollbar{height:8px;width:8px}.tp-mllv_i::-webkit-scrollbar-corner,.tp-sglv_i::-webkit-scrollbar-corner,.tp-grlv_g::-webkit-scrollbar-corner{background-color:transparent}.tp-mllv_i::-webkit-scrollbar-thumb,.tp-sglv_i::-webkit-scrollbar-thumb,.tp-grlv_g::-webkit-scrollbar-thumb{background-clip:padding-box;background-color:currentColor;border:transparent solid 2px;border-radius:4px}.tp-rotv{--font-family: var(--tp-font-family, Roboto Mono, Source Code Pro, Menlo, Courier, monospace);--bs-br: var(--tp-base-border-radius, 6px);--cnt-h-p: var(--tp-container-horizontal-padding, 4px);--cnt-v-p: var(--tp-container-vertical-padding, 4px);--elm-br: var(--tp-element-border-radius, 2px);--bld-s: var(--tp-blade-spacing, 4px);--bld-us: var(--tp-blade-unit-size, 20px);--bs-bg: var(--tp-base-background-color, #28292e);--bs-sh: var(--tp-base-shadow-color, rgba(0, 0, 0, 0.2));--btn-bg: var(--tp-button-background-color, #adafb8);--btn-bg-a: var(--tp-button-background-color-active, #d6d7db);--btn-bg-f: var(--tp-button-background-color-focus, #c8cad0);--btn-bg-h: var(--tp-button-background-color-hover, #bbbcc4);--btn-fg: var(--tp-button-foreground-color, #28292e);--cnt-bg: var(--tp-container-background-color, rgba(187, 188, 196, 0.1));--cnt-bg-a: var(--tp-container-background-color-active, rgba(187, 188, 196, 0.25));--cnt-bg-f: var(--tp-container-background-color-focus, rgba(187, 188, 196, 0.2));--cnt-bg-h: var(--tp-container-background-color-hover, rgba(187, 188, 196, 0.15));--cnt-fg: var(--tp-container-foreground-color, #bbbcc4);--in-bg: var(--tp-input-background-color, rgba(187, 188, 196, 0.1));--in-bg-a: var(--tp-input-background-color-active, rgba(187, 188, 196, 0.25));--in-bg-f: var(--tp-input-background-color-focus, rgba(187, 188, 196, 0.2));--in-bg-h: var(--tp-input-background-color-hover, rgba(187, 188, 196, 0.15));--in-fg: var(--tp-input-foreground-color, #bbbcc4);--lbl-fg: var(--tp-label-foreground-color, rgba(187, 188, 196, 0.7));--mo-bg: var(--tp-monitor-background-color, rgba(0, 0, 0, 0.2));--mo-fg: var(--tp-monitor-foreground-color, rgba(187, 188, 196, 0.7));--grv-fg: var(--tp-groove-foreground-color, rgba(187, 188, 196, 0.1))}.tp-rotv_c>.tp-cntv.tp-v-lst,.tp-tabv_c .tp-brkv>.tp-cntv.tp-v-lst,.tp-fldv_c>.tp-cntv.tp-v-lst{margin-bottom:calc(-1*var(--cnt-v-p))}.tp-rotv_c>.tp-fldv.tp-v-lst .tp-fldv_c,.tp-tabv_c .tp-brkv>.tp-fldv.tp-v-lst .tp-fldv_c,.tp-fldv_c>.tp-fldv.tp-v-lst .tp-fldv_c{border-bottom-left-radius:0}.tp-rotv_c>.tp-fldv.tp-v-lst .tp-fldv_b,.tp-tabv_c .tp-brkv>.tp-fldv.tp-v-lst .tp-fldv_b,.tp-fldv_c>.tp-fldv.tp-v-lst .tp-fldv_b{border-bottom-left-radius:0}.tp-rotv_c>*:not(.tp-v-fst),.tp-tabv_c .tp-brkv>*:not(.tp-v-fst),.tp-fldv_c>*:not(.tp-v-fst){margin-top:var(--bld-s)}.tp-rotv_c>.tp-sprv:not(.tp-v-fst),.tp-tabv_c .tp-brkv>.tp-sprv:not(.tp-v-fst),.tp-fldv_c>.tp-sprv:not(.tp-v-fst),.tp-rotv_c>.tp-cntv:not(.tp-v-fst),.tp-tabv_c .tp-brkv>.tp-cntv:not(.tp-v-fst),.tp-fldv_c>.tp-cntv:not(.tp-v-fst){margin-top:var(--cnt-v-p)}.tp-rotv_c>.tp-sprv+*:not(.tp-v-hidden),.tp-tabv_c .tp-brkv>.tp-sprv+*:not(.tp-v-hidden),.tp-fldv_c>.tp-sprv+*:not(.tp-v-hidden),.tp-rotv_c>.tp-cntv+*:not(.tp-v-hidden),.tp-tabv_c .tp-brkv>.tp-cntv+*:not(.tp-v-hidden),.tp-fldv_c>.tp-cntv+*:not(.tp-v-hidden){margin-top:var(--cnt-v-p)}.tp-rotv_c>.tp-sprv:not(.tp-v-hidden)+.tp-sprv,.tp-tabv_c .tp-brkv>.tp-sprv:not(.tp-v-hidden)+.tp-sprv,.tp-fldv_c>.tp-sprv:not(.tp-v-hidden)+.tp-sprv,.tp-rotv_c>.tp-cntv:not(.tp-v-hidden)+.tp-cntv,.tp-tabv_c .tp-brkv>.tp-cntv:not(.tp-v-hidden)+.tp-cntv,.tp-fldv_c>.tp-cntv:not(.tp-v-hidden)+.tp-cntv{margin-top:0}.tp-tabv_c .tp-brkv>.tp-cntv,.tp-fldv_c>.tp-cntv{margin-left:4px}.tp-tabv_c .tp-brkv>.tp-fldv>.tp-fldv_b,.tp-fldv_c>.tp-fldv>.tp-fldv_b{border-top-left-radius:var(--elm-br);border-bottom-left-radius:var(--elm-br)}.tp-tabv_c .tp-brkv>.tp-fldv.tp-fldv-expanded>.tp-fldv_b,.tp-fldv_c>.tp-fldv.tp-fldv-expanded>.tp-fldv_b{border-bottom-left-radius:0}.tp-tabv_c .tp-brkv .tp-fldv>.tp-fldv_c,.tp-fldv_c .tp-fldv>.tp-fldv_c{border-bottom-left-radius:var(--elm-br)}.tp-tabv_c .tp-brkv>.tp-tabv>.tp-tabv_i,.tp-fldv_c>.tp-tabv>.tp-tabv_i{border-top-left-radius:var(--elm-br)}.tp-tabv_c .tp-brkv .tp-tabv>.tp-tabv_c,.tp-fldv_c .tp-tabv>.tp-tabv_c{border-bottom-left-radius:var(--elm-br)}.tp-rotv_b,.tp-fldv_b{background-color:var(--cnt-bg);color:var(--cnt-fg);cursor:pointer;display:block;height:calc(var(--bld-us) + 4px);line-height:calc(var(--bld-us) + 4px);overflow:hidden;padding-left:var(--cnt-h-p);padding-right:calc(4px + var(--bld-us) + var(--cnt-h-p));position:relative;text-align:left;text-overflow:ellipsis;white-space:nowrap;width:100%;transition:border-radius .2s ease-in-out .2s}.tp-rotv_b:hover,.tp-fldv_b:hover{background-color:var(--cnt-bg-h)}.tp-rotv_b:focus,.tp-fldv_b:focus{background-color:var(--cnt-bg-f)}.tp-rotv_b:active,.tp-fldv_b:active{background-color:var(--cnt-bg-a)}.tp-rotv_b:disabled,.tp-fldv_b:disabled{opacity:.5}.tp-rotv_m,.tp-fldv_m{background:linear-gradient(to left, var(--cnt-fg), var(--cnt-fg) 2px, transparent 2px, transparent 4px, var(--cnt-fg) 4px);border-radius:2px;bottom:0;content:"";display:block;height:6px;right:calc(var(--cnt-h-p) + (var(--bld-us) + 4px - 6px)/2 - 2px);margin:auto;opacity:.5;position:absolute;top:0;transform:rotate(90deg);transition:transform .2s ease-in-out;width:6px}.tp-rotv.tp-rotv-expanded .tp-rotv_m,.tp-fldv.tp-fldv-expanded>.tp-fldv_b>.tp-fldv_m{transform:none}.tp-rotv_c,.tp-fldv_c{box-sizing:border-box;height:0;opacity:0;overflow:hidden;padding-bottom:0;padding-top:0;position:relative;transition:height .2s ease-in-out,opacity .2s linear,padding .2s ease-in-out}.tp-rotv.tp-rotv-cpl:not(.tp-rotv-expanded) .tp-rotv_c,.tp-fldv.tp-fldv-cpl:not(.tp-fldv-expanded)>.tp-fldv_c{display:none}.tp-rotv.tp-rotv-expanded .tp-rotv_c,.tp-fldv.tp-fldv-expanded>.tp-fldv_c{opacity:1;padding-bottom:var(--cnt-v-p);padding-top:var(--cnt-v-p);transform:none;overflow:visible;transition:height .2s ease-in-out,opacity .2s linear .2s,padding .2s ease-in-out}.tp-lstv,.tp-coltxtv_m{position:relative}.tp-lstv_s{padding:0 20px 0 4px;width:100%}.tp-lstv_m,.tp-coltxtv_mm{bottom:0;margin:auto;pointer-events:none;position:absolute;right:2px;top:0}.tp-lstv_m svg,.tp-coltxtv_mm svg{bottom:0;height:16px;margin:auto;position:absolute;right:0;top:0;width:16px}.tp-lstv_m svg path,.tp-coltxtv_mm svg path{fill:currentColor}.tp-pndtxtv,.tp-coltxtv_w{display:flex}.tp-pndtxtv_a,.tp-coltxtv_c{width:100%}.tp-pndtxtv_a+.tp-pndtxtv_a,.tp-coltxtv_c+.tp-pndtxtv_a,.tp-pndtxtv_a+.tp-coltxtv_c,.tp-coltxtv_c+.tp-coltxtv_c{margin-left:2px}.tp-btnv_b{width:100%}.tp-btnv_t{text-align:center}.tp-ckbv_l{display:block;position:relative}.tp-ckbv_i{left:0;opacity:0;position:absolute;top:0}.tp-ckbv_w{background-color:var(--in-bg);border-radius:var(--elm-br);cursor:pointer;display:block;height:var(--bld-us);position:relative;width:var(--bld-us)}.tp-ckbv_w svg{bottom:0;display:block;height:16px;left:0;margin:auto;opacity:0;position:absolute;right:0;top:0;width:16px}.tp-ckbv_w svg path{fill:none;stroke:var(--in-fg);stroke-width:2}.tp-ckbv_i:hover+.tp-ckbv_w{background-color:var(--in-bg-h)}.tp-ckbv_i:focus+.tp-ckbv_w{background-color:var(--in-bg-f)}.tp-ckbv_i:active+.tp-ckbv_w{background-color:var(--in-bg-a)}.tp-ckbv_i:checked+.tp-ckbv_w svg{opacity:1}.tp-ckbv.tp-v-disabled .tp-ckbv_w{opacity:.5}.tp-colv{position:relative}.tp-colv_h{display:flex}.tp-colv_s{flex-grow:0;flex-shrink:0;width:var(--bld-us)}.tp-colv_t{flex:1;margin-left:4px}.tp-colv_p{height:0;margin-top:0;opacity:0;overflow:hidden;transition:height .2s ease-in-out,opacity .2s linear,margin .2s ease-in-out}.tp-colv.tp-colv-cpl .tp-colv_p{overflow:visible}.tp-colv.tp-colv-expanded .tp-colv_p{margin-top:var(--bld-s);opacity:1}.tp-colv .tp-popv{left:calc(-1*var(--cnt-h-p));right:calc(-1*var(--cnt-h-p));top:var(--bld-us)}.tp-colpv_h,.tp-colpv_ap{margin-left:6px;margin-right:6px}.tp-colpv_h{margin-top:var(--bld-s)}.tp-colpv_rgb{display:flex;margin-top:var(--bld-s);width:100%}.tp-colpv_a{display:flex;margin-top:var(--cnt-v-p);padding-top:calc(var(--cnt-v-p) + 2px);position:relative}.tp-colpv_a:before{background-color:var(--grv-fg);content:"";height:2px;left:calc(-1*var(--cnt-h-p));position:absolute;right:calc(-1*var(--cnt-h-p));top:0}.tp-colpv_ap{align-items:center;display:flex;flex:3}.tp-colpv_at{flex:1;margin-left:4px}.tp-svpv{border-radius:var(--elm-br);outline:none;overflow:hidden;position:relative}.tp-svpv_c{cursor:crosshair;display:block;height:calc(var(--bld-us)*4);width:100%}.tp-svpv_m{border-radius:100%;border:rgba(255,255,255,.75) solid 2px;box-sizing:border-box;filter:drop-shadow(0 0 1px rgba(0, 0, 0, 0.3));height:12px;margin-left:-6px;margin-top:-6px;pointer-events:none;position:absolute;width:12px}.tp-svpv:focus .tp-svpv_m{border-color:#fff}.tp-hplv{cursor:pointer;height:var(--bld-us);outline:none;position:relative}.tp-hplv_c{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAABCAYAAABubagXAAAAQ0lEQVQoU2P8z8Dwn0GCgQEDi2OK/RBgYHjBgIpfovFh8j8YBIgzFGQxuqEgPhaDOT5gOhPkdCxOZeBg+IDFZZiGAgCaSSMYtcRHLgAAAABJRU5ErkJggg==);background-position:left top;background-repeat:no-repeat;background-size:100% 100%;border-radius:2px;display:block;height:4px;left:0;margin-top:-2px;position:absolute;top:50%;width:100%}.tp-hplv_m{border-radius:var(--elm-br);border:rgba(255,255,255,.75) solid 2px;box-shadow:0 0 2px rgba(0,0,0,.1);box-sizing:border-box;height:12px;left:50%;margin-left:-6px;margin-top:-6px;pointer-events:none;position:absolute;top:50%;width:12px}.tp-hplv:focus .tp-hplv_m{border-color:#fff}.tp-aplv{cursor:pointer;height:var(--bld-us);outline:none;position:relative;width:100%}.tp-aplv_b{background-color:#fff;background-image:linear-gradient(to top right, #ddd 25%, transparent 25%, transparent 75%, #ddd 75%),linear-gradient(to top right, #ddd 25%, transparent 25%, transparent 75%, #ddd 75%);background-size:4px 4px;background-position:0 0,2px 2px;border-radius:2px;display:block;height:4px;left:0;margin-top:-2px;overflow:hidden;position:absolute;top:50%;width:100%}.tp-aplv_c{bottom:0;left:0;position:absolute;right:0;top:0}.tp-aplv_m{background-color:#fff;background-image:linear-gradient(to top right, #ddd 25%, transparent 25%, transparent 75%, #ddd 75%),linear-gradient(to top right, #ddd 25%, transparent 25%, transparent 75%, #ddd 75%);background-size:12px 12px;background-position:0 0,6px 6px;border-radius:var(--elm-br);box-shadow:0 0 2px rgba(0,0,0,.1);height:12px;left:50%;margin-left:-6px;margin-top:-6px;overflow:hidden;pointer-events:none;position:absolute;top:50%;width:12px}.tp-aplv_p{border-radius:var(--elm-br);border:rgba(255,255,255,.75) solid 2px;box-sizing:border-box;bottom:0;left:0;position:absolute;right:0;top:0}.tp-aplv:focus .tp-aplv_p{border-color:#fff}.tp-colswv{background-color:#fff;background-image:linear-gradient(to top right, #ddd 25%, transparent 25%, transparent 75%, #ddd 75%),linear-gradient(to top right, #ddd 25%, transparent 25%, transparent 75%, #ddd 75%);background-size:10px 10px;background-position:0 0,5px 5px;border-radius:var(--elm-br);overflow:hidden}.tp-colswv.tp-v-disabled{opacity:.5}.tp-colswv_sw{border-radius:0}.tp-colswv_b{-webkit-appearance:none;-moz-appearance:none;appearance:none;background-color:transparent;border-width:0;cursor:pointer;display:block;height:var(--bld-us);left:0;margin:0;outline:none;padding:0;position:absolute;top:0;width:var(--bld-us)}.tp-colswv_b:focus::after{border:rgba(255,255,255,.75) solid 2px;border-radius:var(--elm-br);bottom:0;content:"";display:block;left:0;position:absolute;right:0;top:0}.tp-coltxtv{display:flex;width:100%}.tp-coltxtv_m{margin-right:4px}.tp-coltxtv_ms{border-radius:var(--elm-br);color:var(--lbl-fg);cursor:pointer;height:var(--bld-us);line-height:var(--bld-us);padding:0 18px 0 4px}.tp-coltxtv_ms:hover{background-color:var(--in-bg-h)}.tp-coltxtv_ms:focus{background-color:var(--in-bg-f)}.tp-coltxtv_ms:active{background-color:var(--in-bg-a)}.tp-coltxtv_mm{color:var(--lbl-fg)}.tp-coltxtv_w{flex:1}.tp-dfwv{position:absolute;top:8px;right:8px;width:256px}.tp-fldv.tp-fldv-not .tp-fldv_b{display:none}.tp-fldv_t{padding-left:4px}.tp-fldv_c{border-left:var(--cnt-bg) solid 4px}.tp-fldv_b:hover+.tp-fldv_c{border-left-color:var(--cnt-bg-h)}.tp-fldv_b:focus+.tp-fldv_c{border-left-color:var(--cnt-bg-f)}.tp-fldv_b:active+.tp-fldv_c{border-left-color:var(--cnt-bg-a)}.tp-grlv{position:relative}.tp-grlv_g{display:block;height:calc(var(--bld-us)*3)}.tp-grlv_g polyline{fill:none;stroke:var(--mo-fg);stroke-linejoin:round}.tp-grlv_t{margin-top:-4px;transition:left .05s,top .05s;visibility:hidden}.tp-grlv_t.tp-grlv_t-a{visibility:visible}.tp-grlv_t.tp-grlv_t-in{transition:none}.tp-grlv.tp-v-disabled .tp-grlv_g{opacity:.5}.tp-grlv .tp-ttv{background-color:var(--mo-fg)}.tp-grlv .tp-ttv::before{border-top-color:var(--mo-fg)}.tp-lblv{align-items:center;display:flex;line-height:1.3;padding-left:var(--cnt-h-p);padding-right:var(--cnt-h-p)}.tp-lblv.tp-lblv-nol{display:block}.tp-lblv_l{color:var(--lbl-fg);flex:1;-webkit-hyphens:auto;-ms-hyphens:auto;hyphens:auto;overflow:hidden;padding-left:4px;padding-right:16px}.tp-lblv.tp-v-disabled .tp-lblv_l{opacity:.5}.tp-lblv.tp-lblv-nol .tp-lblv_l{display:none}.tp-lblv_v{align-self:flex-start;flex-grow:0;flex-shrink:0;width:160px}.tp-lblv.tp-lblv-nol .tp-lblv_v{width:100%}.tp-lstv_s{padding:0 20px 0 4px;width:100%}.tp-lstv_m{color:var(--btn-fg)}.tp-sglv_i{padding:0 4px}.tp-sglv.tp-v-disabled .tp-sglv_i{opacity:.5}.tp-mllv_i{display:block;height:calc(var(--bld-us)*3);line-height:var(--bld-us);padding:0 4px;resize:none;white-space:pre}.tp-mllv.tp-v-disabled .tp-mllv_i{opacity:.5}.tp-p2dv{position:relative}.tp-p2dv_h{display:flex}.tp-p2dv_b{height:var(--bld-us);margin-right:4px;position:relative;width:var(--bld-us)}.tp-p2dv_b svg{display:block;height:16px;left:50%;margin-left:-8px;margin-top:-8px;position:absolute;top:50%;width:16px}.tp-p2dv_b svg path{stroke:currentColor;stroke-width:2}.tp-p2dv_b svg circle{fill:currentColor}.tp-p2dv_t{flex:1}.tp-p2dv_p{height:0;margin-top:0;opacity:0;overflow:hidden;transition:height .2s ease-in-out,opacity .2s linear,margin .2s ease-in-out}.tp-p2dv.tp-p2dv-expanded .tp-p2dv_p{margin-top:var(--bld-s);opacity:1}.tp-p2dv .tp-popv{left:calc(-1*var(--cnt-h-p));right:calc(-1*var(--cnt-h-p));top:var(--bld-us)}.tp-p2dpv{padding-left:calc(var(--bld-us) + 4px)}.tp-p2dpv_p{cursor:crosshair;height:0;overflow:hidden;padding-bottom:100%;position:relative}.tp-p2dpv_g{display:block;height:100%;left:0;pointer-events:none;position:absolute;top:0;width:100%}.tp-p2dpv_ax{opacity:.1;stroke:var(--in-fg);stroke-dasharray:1}.tp-p2dpv_l{opacity:.5;stroke:var(--in-fg);stroke-dasharray:1}.tp-p2dpv_m{border:var(--in-fg) solid 1px;border-radius:50%;box-sizing:border-box;height:4px;margin-left:-2px;margin-top:-2px;position:absolute;width:4px}.tp-p2dpv_p:focus .tp-p2dpv_m{background-color:var(--in-fg);border-width:0}.tp-popv{background-color:var(--bs-bg);border-radius:6px;box-shadow:0 2px 4px var(--bs-sh);display:none;max-width:168px;padding:var(--cnt-v-p) var(--cnt-h-p);position:absolute;visibility:hidden;z-index:1000}.tp-popv.tp-popv-v{display:block;visibility:visible}.tp-sprv_r{background-color:var(--grv-fg);border-width:0;display:block;height:2px;margin:0;width:100%}.tp-sldv.tp-v-disabled{opacity:.5}.tp-sldv_t{box-sizing:border-box;cursor:pointer;height:var(--bld-us);margin:0 6px;outline:none;position:relative}.tp-sldv_t::before{background-color:var(--in-bg);border-radius:1px;bottom:0;content:"";display:block;height:2px;left:0;margin:auto;position:absolute;right:0;top:0}.tp-sldv_k{height:100%;left:0;position:absolute;top:0}.tp-sldv_k::before{background-color:var(--in-fg);border-radius:1px;bottom:0;content:"";display:block;height:2px;left:0;margin-bottom:auto;margin-top:auto;position:absolute;right:0;top:0}.tp-sldv_k::after{background-color:var(--btn-bg);border-radius:var(--elm-br);bottom:0;content:"";display:block;height:12px;margin-bottom:auto;margin-top:auto;position:absolute;right:-6px;top:0;width:12px}.tp-sldv_t:hover .tp-sldv_k::after{background-color:var(--btn-bg-h)}.tp-sldv_t:focus .tp-sldv_k::after{background-color:var(--btn-bg-f)}.tp-sldv_t:active .tp-sldv_k::after{background-color:var(--btn-bg-a)}.tp-sldtxtv{display:flex}.tp-sldtxtv_s{flex:2}.tp-sldtxtv_t{flex:1;margin-left:4px}.tp-tabv.tp-v-disabled{opacity:.5}.tp-tabv_i{align-items:flex-end;display:flex;overflow:hidden}.tp-tabv.tp-tabv-nop .tp-tabv_i{height:calc(var(--bld-us) + 4px);position:relative}.tp-tabv.tp-tabv-nop .tp-tabv_i::before{background-color:var(--cnt-bg);bottom:0;content:"";height:2px;left:0;position:absolute;right:0}.tp-tabv_c{border-left:var(--cnt-bg) solid 4px;padding-bottom:var(--cnt-v-p);padding-top:var(--cnt-v-p)}.tp-tbiv{flex:1;min-width:0;position:relative}.tp-tbiv+.tp-tbiv{margin-left:2px}.tp-tbiv+.tp-tbiv::before{background-color:var(--cnt-bg);bottom:0;content:"";height:2px;left:-2px;position:absolute;width:2px}.tp-tbiv_b{background-color:var(--cnt-bg);display:block;padding-left:calc(var(--cnt-h-p) + 4px);padding-right:calc(var(--cnt-h-p) + 4px);width:100%}.tp-tbiv_b:hover{background-color:var(--cnt-bg-h)}.tp-tbiv_b:focus{background-color:var(--cnt-bg-f)}.tp-tbiv_b:active{background-color:var(--cnt-bg-a)}.tp-tbiv_b:disabled{opacity:.5}.tp-tbiv_t{color:var(--cnt-fg);height:calc(var(--bld-us) + 4px);line-height:calc(var(--bld-us) + 4px);opacity:.5;overflow:hidden;text-overflow:ellipsis}.tp-tbiv.tp-tbiv-sel .tp-tbiv_t{opacity:1}.tp-txtv{position:relative}.tp-txtv_i{padding:0 4px}.tp-txtv.tp-txtv-fst .tp-txtv_i{border-bottom-right-radius:0;border-top-right-radius:0}.tp-txtv.tp-txtv-mid .tp-txtv_i{border-radius:0}.tp-txtv.tp-txtv-lst .tp-txtv_i{border-bottom-left-radius:0;border-top-left-radius:0}.tp-txtv.tp-txtv-num .tp-txtv_i{text-align:right}.tp-txtv.tp-txtv-drg .tp-txtv_i{opacity:.3}.tp-txtv_k{cursor:pointer;height:100%;left:-3px;position:absolute;top:0;width:12px}.tp-txtv_k::before{background-color:var(--in-fg);border-radius:1px;bottom:0;content:"";height:calc(var(--bld-us) - 4px);left:50%;margin-bottom:auto;margin-left:-1px;margin-top:auto;opacity:.1;position:absolute;top:0;transition:border-radius .1s,height .1s,transform .1s,width .1s;width:2px}.tp-txtv_k:hover::before,.tp-txtv.tp-txtv-drg .tp-txtv_k::before{opacity:1}.tp-txtv.tp-txtv-drg .tp-txtv_k::before{border-radius:50%;height:4px;transform:translateX(-1px);width:4px}.tp-txtv_g{bottom:0;display:block;height:8px;left:50%;margin:auto;overflow:visible;pointer-events:none;position:absolute;top:0;visibility:hidden;width:100%}.tp-txtv.tp-txtv-drg .tp-txtv_g{visibility:visible}.tp-txtv_gb{fill:none;stroke:var(--in-fg);stroke-dasharray:1}.tp-txtv_gh{fill:none;stroke:var(--in-fg)}.tp-txtv .tp-ttv{margin-left:6px;visibility:hidden}.tp-txtv.tp-txtv-drg .tp-ttv{visibility:visible}.tp-ttv{background-color:var(--in-fg);border-radius:var(--elm-br);color:var(--bs-bg);padding:2px 4px;pointer-events:none;position:absolute;transform:translate(-50%, -100%)}.tp-ttv::before{border-color:var(--in-fg) transparent transparent transparent;border-style:solid;border-width:2px;box-sizing:border-box;content:"";font-size:.9em;height:4px;left:50%;margin-left:-2px;position:absolute;top:100%;width:4px}.tp-rotv{background-color:var(--bs-bg);border-radius:var(--bs-br);box-shadow:0 2px 4px var(--bs-sh);font-family:var(--font-family);font-size:11px;font-weight:500;line-height:1;text-align:left}.tp-rotv_b{border-bottom-left-radius:var(--bs-br);border-bottom-right-radius:var(--bs-br);border-top-left-radius:var(--bs-br);border-top-right-radius:var(--bs-br);padding-left:calc(4px + var(--bld-us) + var(--cnt-h-p));text-align:center}.tp-rotv.tp-rotv-expanded .tp-rotv_b{border-bottom-left-radius:0;border-bottom-right-radius:0}.tp-rotv.tp-rotv-not .tp-rotv_b{display:none}.tp-rotv_c>.tp-fldv.tp-v-lst>.tp-fldv_c,.tp-rotv_c>.tp-tabv.tp-v-lst>.tp-tabv_c{border-bottom-left-radius:var(--bs-br);border-bottom-right-radius:var(--bs-br)}.tp-rotv_c>.tp-fldv.tp-v-lst:not(.tp-fldv-expanded)>.tp-fldv_b{border-bottom-left-radius:var(--bs-br);border-bottom-right-radius:var(--bs-br)}.tp-rotv_c .tp-fldv.tp-v-vlst:not(.tp-fldv-expanded)>.tp-fldv_b{border-bottom-right-radius:var(--bs-br)}.tp-rotv.tp-rotv-not .tp-rotv_c>.tp-fldv.tp-v-fst{margin-top:calc(-1*var(--cnt-v-p))}.tp-rotv.tp-rotv-not .tp-rotv_c>.tp-fldv.tp-v-fst>.tp-fldv_b{border-top-left-radius:var(--bs-br);border-top-right-radius:var(--bs-br)}.tp-rotv.tp-rotv-not .tp-rotv_c>.tp-tabv.tp-v-fst{margin-top:calc(-1*var(--cnt-v-p))}.tp-rotv.tp-rotv-not .tp-rotv_c>.tp-tabv.tp-v-fst>.tp-tabv_i{border-top-left-radius:var(--bs-br);border-top-right-radius:var(--bs-br)}.tp-rotv.tp-v-disabled,.tp-rotv .tp-v-disabled{pointer-events:none}.tp-rotv.tp-v-hidden,.tp-rotv .tp-v-hidden{display:none}');
        this.pool_.getAll().forEach((plugin) => {
          this.embedPluginStyle_(plugin);
        });
        this.registerPlugin({
          plugins: [
            SliderBladePlugin,
            ListBladePlugin,
            TabBladePlugin,
            TextBladePlugin
          ]
        });
      }
    }
    const VERSION = new Semver("3.1.0");
    exports2.BladeApi = BladeApi;
    exports2.ButtonApi = ButtonApi;
    exports2.FolderApi = FolderApi;
    exports2.InputBindingApi = InputBindingApi;
    exports2.ListApi = ListApi;
    exports2.MonitorBindingApi = MonitorBindingApi;
    exports2.Pane = Pane;
    exports2.SeparatorApi = SeparatorApi;
    exports2.SliderApi = SliderApi;
    exports2.TabApi = TabApi;
    exports2.TabPageApi = TabPageApi;
    exports2.TextApi = TextApi;
    exports2.TpChangeEvent = TpChangeEvent;
    exports2.VERSION = VERSION;
    Object.defineProperty(exports2, "__esModule", { value: true });
  });
})(tweakpane, tweakpane.exports);
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "Smoothie",
  props: {
    weight: { default: 0.06 }
  },
  setup(__props, { expose }) {
    const props = __props;
    let wrap = shallowRef();
    let content = shallowRef();
    let spacer = shallowRef();
    let wrapStyle = { overflow: "auto" };
    let contentWrapStyle = { position: "sticky", top: 0 };
    let contentStyle = {
      willChange: "transform",
      position: "absolute",
      width: "100%"
    };
    let exposed = {
      el: wrap,
      y: 0
    };
    expose(exposed);
    let af;
    let ty = 0, y = 0;
    const onScroll = () => {
      {
        ({
          scrollTop: ty
        } = wrap.value);
      }
    };
    const update = () => {
      {
        spacer.value.style.height = content.value.scrollHeight + "px";
      }
    };
    let resizeObserver = new ResizeObserver(update);
    onMounted(() => {
      resizeObserver.observe(content.value);
      update();
      let aspect = 1e3 / 60;
      let prev = performance.now();
      requestAnimationFrame(function cb() {
        af = requestAnimationFrame(cb);
        let now = performance.now();
        let dt = now - prev;
        prev = now;
        let k = props.weight * dt / aspect;
        y += k * (ty - y);
        exposed.y = y;
        {
          content.value.style.transform = `translate3D(0, ${-y}px, 0)`;
        }
      });
    });
    onUpdated(() => {
      resizeObserver.observe(content.value);
    });
    onUnmounted(() => {
      cancelAnimationFrame(af);
      resizeObserver.disconnect();
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        ref_key: "wrap",
        ref: wrap,
        onScroll,
        style: normalizeStyle(unref(wrapStyle))
      }, [
        createBaseVNode("div", {
          style: normalizeStyle(unref(contentWrapStyle))
        }, [
          createBaseVNode("div", {
            ref_key: "content",
            ref: content,
            style: normalizeStyle(unref(contentStyle))
          }, [
            renderSlot(_ctx.$slots, "default")
          ], 4)
        ], 4),
        createBaseVNode("div", {
          ref_key: "spacer",
          ref: spacer
        }, null, 512)
      ], 36);
    };
  }
});
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "Smoothie",
  props: {
    weight: { default: 0.06 }
  },
  setup(__props, { expose }) {
    const props = __props;
    let wrap = shallowRef();
    let content = shallowRef();
    let spacer = shallowRef();
    let wrapStyle = { overflow: "auto" };
    let contentWrapStyle = { position: "sticky", top: 0, left: 0 };
    let contentStyle = {
      willChange: "transform",
      position: "absolute",
      width: "100%"
    };
    let exposed = {
      el: wrap,
      x: 0,
      y: 0
    };
    expose(exposed);
    let af;
    let tx = 0, ty = 0, x = 0, y = 0;
    const onScroll = () => {
      {
        ({
          scrollLeft: tx,
          scrollTop: ty
        } = wrap.value);
      }
    };
    const update = () => {
      {
        let contentWrap = content.value.parentElement;
        contentWrap.style.width = "";
        content.value.style.minWidth = contentWrap.scrollWidth + "px";
        content.value.style.width = "";
        contentWrap.style.width = "0";
        spacer.value.style.width = content.value.scrollWidth + "px";
        spacer.value.style.height = content.value.scrollHeight + "px";
      }
    };
    let resizeObserver = new ResizeObserver(update);
    onMounted(() => {
      resizeObserver.observe(content.value);
      update();
      let aspect = 1e3 / 60;
      let prev = performance.now();
      requestAnimationFrame(function cb() {
        af = requestAnimationFrame(cb);
        let now = performance.now();
        let dt = now - prev;
        prev = now;
        let k = props.weight * dt / aspect;
        y += k * (ty - y);
        exposed.y = y;
        {
          x += k * (tx - x);
          exposed.x = x;
        }
        {
          content.value.style.transform = `translate3D(${-x}px, ${-y}px, 0)`;
        }
      });
    });
    onUpdated(() => {
      resizeObserver.observe(content.value);
    });
    onUnmounted(() => {
      cancelAnimationFrame(af);
      resizeObserver.disconnect();
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        ref_key: "wrap",
        ref: wrap,
        onScroll,
        style: normalizeStyle(unref(wrapStyle))
      }, [
        createBaseVNode("div", {
          style: normalizeStyle(unref(contentWrapStyle))
        }, [
          createBaseVNode("div", {
            ref_key: "content",
            ref: content,
            style: normalizeStyle(unref(contentStyle))
          }, [
            renderSlot(_ctx.$slots, "default")
          ], 4)
        ], 4),
        createBaseVNode("div", {
          ref_key: "spacer",
          ref: spacer
        }, null, 512)
      ], 36);
    };
  }
});
const _hoisted_1 = { class: "content-wrap" };
const _hoisted_2 = /* @__PURE__ */ createBaseVNode("a", {
  id: "top",
  href: "#bottom"
}, /* @__PURE__ */ toDisplayString("Go to the #bottom"), -1);
const _hoisted_3 = { class: "content" };
const _hoisted_4 = /* @__PURE__ */ createBaseVNode("span", { style: { color: "orangered" } }, "NESTED CONTAINER ", -1);
const _hoisted_5 = /* @__PURE__ */ createBaseVNode("span", { style: { color: "orangered" } }, "NESTED VERTICAL WITH OMNI FLAVOR ", -1);
const _hoisted_6 = { style: { width: "200rem" } };
const _hoisted_7 = /* @__PURE__ */ createBaseVNode("span", { style: { color: "orangered" } }, "HORIZONTAL SCROLL ", -1);
const _hoisted_8 = { style: { width: "75rem", background: "#6d3300" } };
const _hoisted_9 = /* @__PURE__ */ createBaseVNode("span", { style: { color: "orangered" } }, "BIDERECTIONAL SCROLL ", -1);
const _hoisted_10 = ["src"];
const _hoisted_11 = /* @__PURE__ */ createBaseVNode("a", {
  id: "bottom",
  href: "#top"
}, /* @__PURE__ */ toDisplayString("Go to the #top"), -1);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "App",
  setup(__props) {
    let scrollWeight = shallowRef(0.06);
    let pane = new tweakpane.exports.Pane();
    let paneFolder = pane.addFolder({
      title: "Main content scroll weight"
    });
    paneFolder.addInput(scrollWeight, "value", {
      min: 0,
      max: 0.5,
      step: 0.01
    });
    let container = shallowRef();
    onMounted(() => {
      let c = container.value;
      paneFolder.addMonitor(c, "y", {
        view: "graph",
        min: 0,
        max: c.el.scrollHeight
      });
    });
    onUnmounted(() => {
      pane.dispose();
    });
    let images = [
      "alice-donovan-rouse-tMHAmxLyzvA-unsplash.jpg",
      "anthony-delanoix-VDS8ASoyzjw-unsplash.jpg",
      "kentaro-toma-30AwPGSEdsM-unsplash.jpg",
      "lance-anderson-PcCQgQ6KGkI-unsplash.jpg",
      "osman-rana-xhpMNieqBwA-unsplash.jpg"
    ].map((name) => "/vue-smoothie/images/" + name);
    let paragraphs = [
      "Sit amet mattis vulputate enim nulla aliquet. Facilisis leo vel fringilla est ullamcorper. Enim sit amet venenatis urna cursus eget nunc scelerisque viverra. Cursus turpis massa tincidunt dui. Tristique risus nec feugiat in fermentum posuere urna. Pharetra vel turpis nunc eget lorem dolor sed viverra.",
      "Quisque non tellus orci ac auctor augue mauris augue. Nisi quis eleifend quam adipiscing vitae proin sagittis. Varius sit amet mattis vulputate enim nulla aliquet. Egestas erat imperdiet sed euismod nisi porta. Leo duis ut diam quam nulla porttitor. Id volutpat lacus laoreet non curabitur gravida arcu ac tortor. Neque sodales ut etiam sit amet nisl purus. Eget gravida cum sociis natoque penatibus.",
      "Ipsum faucibus vitae aliquet nec ullamcorper sit. Lectus vestibulum mattis ullamcorper velit sed ullamcorper morbi. Ullamcorper a lacus vestibulum sed arcu non odio. Sem integer vitae justo eget magna fermentum iaculis. Cras tincidunt lobortis feugiat vivamus at. Mi ipsum faucibus vitae aliquet nec. Dui id ornare arcu odio ut sem nulla pharetra. Volutpat consequat mauris nunc congue nisi vitae.",
      "Fermentum odio eu feugiat pretium nibh. Accumsan tortor posuere ac ut consequat semper. Nisl suscipit adipiscing bibendum est ultricies. Tempus egestas sed sed risus pretium quam vulputate dignissim. Dolor purus non enim praesent. Vel orci porta non pulvinar. Venenatis cras sed felis eget velit aliquet. Sed tempus urna et pharetra.",
      "Eget nulla facilisi etiam dignissim diam quis enim. Ac tincidunt vitae semper quis lectus nulla at. Facilisi nullam vehicula ipsum a arcu cursus vitae congue. Tempus iaculis urna id volutpat lacus laoreet non curabitur gravida. Vel risus commodo viverra maecenas accumsan lacus vel facilisis volutpat. Adipiscing enim eu turpis egestas pretium aenean pharetra. Aliquet nec ullamcorper sit amet.",
      "Proin gravida hendrerit lectus a. Mi bibendum neque egestas congue quisque egestas diam in. Consectetur lorem donec massa sapien faucibus et molestie. Ultricies mi eget mauris pharetra. Sapien eget mi proin sed libero enim sed faucibus. Commodo odio aenean sed adipiscing diam donec. Tempor orci eu lobortis elementum nibh tellus molestie nunc. Proin gravida hendrerit lectus a. Mi bibendum neque egestas congue quisque egestas diam in."
    ];
    let longText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Iaculis at erat pellentesque adipiscing commodo. Consequat nisl vel pretium lectus quam id. Duis tristique sollicitudin nibh sit amet commodo. Amet mauris commodo quis imperdiet massa tincidunt nunc pulvinar sapien. Integer quis auctor elit sed vulputate mi. At risus viverra adipiscing at in tellus integer. Mollis nunc sed id semper risus in hendrerit gravida rutrum. Senectus et netus et malesuada fames ac turpis. Amet porttitor eget dolor morbi non arcu risus. Molestie a iaculis at erat pellentesque adipiscing commodo elit. Mus mauris vitae ultricies leo integer malesuada nunc vel risus. Ut venenatis tellus in metus vulputate eu. Elementum integer enim neque volutpat ac tincidunt vitae semper quis. Arcu cursus vitae congue mauris. Quam vulputate dignissim suspendisse in est ante in nibh mauris. Cursus turpis massa tincidunt dui ut ornare lectus sit. Magna fringilla urna porttitor rhoncus dolor purus. Ut consequat semper viverra nam libero justo laoreet sit. Enim facilisis gravida neque convallis. Turpis egestas integer eget aliquet nibh praesent tristique magna sit. Et tortor at risus viverra. Vitae aliquet nec ullamcorper sit. Volutpat blandit aliquam etiam erat. Mauris vitae ultricies leo integer malesuada nunc vel. Urna condimentum mattis pellentesque id. Dui id ornare arcu odio ut sem nulla pharetra. Ut pharetra sit amet aliquam id. Eget magna fermentum iaculis eu non diam phasellus vestibulum. Egestas pretium aenean pharetra magna. Arcu non odio euismod lacinia at. Phasellus egestas tellus rutrum tellus pellentesque eu tincidunt tortor. Cursus vitae congue mauris rhoncus aenean. In arcu cursus euismod quis viverra nibh cras. Vitae elementum curabitur vitae nunc sed velit dignissim sodales ut. Pretium lectus quam id leo in vitae turpis massa. Eget est lorem ipsum dolor. Nunc scelerisque viverra mauris in aliquam sem fringilla. Egestas purus viverra accumsan in nisl nisi scelerisque eu. Gravida neque convallis a cras semper.";
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(_sfc_main$2), {
        class: "container",
        weight: unref(scrollWeight),
        ref_key: "container",
        ref: container
      }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_1, [
            _hoisted_2,
            createBaseVNode("div", _hoisted_3, [
              createVNode(unref(_sfc_main$2), {
                class: "nested-container",
                weight: 0.1
              }, {
                default: withCtx(() => [
                  createBaseVNode("div", null, [
                    _hoisted_4,
                    createTextVNode(toDisplayString(unref(longText)), 1)
                  ])
                ]),
                _: 1
              }, 8, ["weight"]),
              createVNode(unref(_sfc_main$1), {
                class: "nested-container",
                weight: 0.3
              }, {
                default: withCtx(() => [
                  createBaseVNode("div", null, [
                    _hoisted_5,
                    createTextVNode(toDisplayString(unref(longText)), 1)
                  ])
                ]),
                _: 1
              }, 8, ["weight"]),
              createVNode(unref(_sfc_main$1), { class: "horizontal-container" }, {
                default: withCtx(() => [
                  createBaseVNode("div", _hoisted_6, [
                    _hoisted_7,
                    createTextVNode(toDisplayString(unref(longText)), 1)
                  ])
                ]),
                _: 1
              }),
              createVNode(unref(_sfc_main$1), { class: "bidirectional-container" }, {
                default: withCtx(() => [
                  createBaseVNode("div", _hoisted_8, [
                    _hoisted_9,
                    createTextVNode(toDisplayString(unref(longText)), 1)
                  ])
                ]),
                _: 1
              }),
              (openBlock(true), createElementBlock(Fragment, null, renderList(unref(images), (image, index) => {
                return openBlock(), createElementBlock(Fragment, null, [
                  createBaseVNode("img", {
                    src: image,
                    style: normalizeStyle({ gridColumn: index % 2 + 1, gridRow: index + 4 })
                  }, null, 12, _hoisted_10),
                  createBaseVNode("div", {
                    style: normalizeStyle({ gridColumn: (index + 1) % 2 + 1, gridRow: index + 4 })
                  }, toDisplayString(unref(paragraphs)[index]), 5)
                ], 64);
              }), 256))
            ]),
            _hoisted_11
          ])
        ]),
        _: 1
      }, 8, ["weight"]);
    };
  }
});
const App_vue_vue_type_style_index_0_lang = "";
createApp(_sfc_main).mount("#app");
