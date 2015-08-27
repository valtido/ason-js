!function(a){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=a();else if("function"==typeof define&&define.amd)define([],a);else{var b;b="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,b.isMyJsonValid=a()}}(function(){return function a(b,c,d){function e(g,h){if(!c[g]){if(!b[g]){var i="function"==typeof require&&require;if(!h&&i)return i(g,!0);if(f)return f(g,!0);var j=new Error("Cannot find module '"+g+"'");throw j.code="MODULE_NOT_FOUND",j}var k=c[g]={exports:{}};b[g][0].call(k.exports,function(a){var c=b[g][1][a];return e(c?c:a)},k,k.exports,a,b,c,d)}return c[g].exports}for(var f="function"==typeof require&&require,g=0;g<d.length;g++)e(d[g]);return e}({1:[function(a,b,c){function d(a,b){return n.isUndefined(b)?""+b:n.isNumber(b)&&!isFinite(b)?b.toString():n.isFunction(b)||n.isRegExp(b)?b.toString():b}function e(a,b){return n.isString(a)?a.length<b?a:a.slice(0,b):a}function f(a){return e(JSON.stringify(a.actual,d),128)+" "+a.operator+" "+e(JSON.stringify(a.expected,d),128)}function g(a,b,c,d,e){throw new q.AssertionError({message:c,actual:a,expected:b,operator:d,stackStartFunction:e})}function h(a,b){a||g(a,!0,b,"==",q.ok)}function i(a,b){if(a===b)return!0;if(n.isBuffer(a)&&n.isBuffer(b)){if(a.length!=b.length)return!1;for(var c=0;c<a.length;c++)if(a[c]!==b[c])return!1;return!0}return n.isDate(a)&&n.isDate(b)?a.getTime()===b.getTime():n.isRegExp(a)&&n.isRegExp(b)?a.source===b.source&&a.global===b.global&&a.multiline===b.multiline&&a.lastIndex===b.lastIndex&&a.ignoreCase===b.ignoreCase:n.isObject(a)||n.isObject(b)?k(a,b):a==b}function j(a){return"[object Arguments]"==Object.prototype.toString.call(a)}function k(a,b){if(n.isNullOrUndefined(a)||n.isNullOrUndefined(b))return!1;if(a.prototype!==b.prototype)return!1;if(n.isPrimitive(a)||n.isPrimitive(b))return a===b;var c=j(a),d=j(b);if(c&&!d||!c&&d)return!1;if(c)return a=o.call(a),b=o.call(b),i(a,b);var e,f,g=r(a),h=r(b);if(g.length!=h.length)return!1;for(g.sort(),h.sort(),f=g.length-1;f>=0;f--)if(g[f]!=h[f])return!1;for(f=g.length-1;f>=0;f--)if(e=g[f],!i(a[e],b[e]))return!1;return!0}function l(a,b){return a&&b?"[object RegExp]"==Object.prototype.toString.call(b)?b.test(a):a instanceof b?!0:b.call({},a)===!0?!0:!1:!1}function m(a,b,c,d){var e;n.isString(c)&&(d=c,c=null);try{b()}catch(f){e=f}if(d=(c&&c.name?" ("+c.name+").":".")+(d?" "+d:"."),a&&!e&&g(e,c,"Missing expected exception"+d),!a&&l(e,c)&&g(e,c,"Got unwanted exception"+d),a&&e&&c&&!l(e,c)||!a&&e)throw e}var n=a("util/"),o=Array.prototype.slice,p=Object.prototype.hasOwnProperty,q=b.exports=h;q.AssertionError=function(a){this.name="AssertionError",this.actual=a.actual,this.expected=a.expected,this.operator=a.operator,a.message?(this.message=a.message,this.generatedMessage=!1):(this.message=f(this),this.generatedMessage=!0);var b=a.stackStartFunction||g;if(Error.captureStackTrace)Error.captureStackTrace(this,b);else{var c=new Error;if(c.stack){var d=c.stack,e=b.name,h=d.indexOf("\n"+e);if(h>=0){var i=d.indexOf("\n",h+1);d=d.substring(i+1)}this.stack=d}}},n.inherits(q.AssertionError,Error),q.fail=g,q.ok=h,q.equal=function(a,b,c){a!=b&&g(a,b,c,"==",q.equal)},q.notEqual=function(a,b,c){a==b&&g(a,b,c,"!=",q.notEqual)},q.deepEqual=function(a,b,c){i(a,b)||g(a,b,c,"deepEqual",q.deepEqual)},q.notDeepEqual=function(a,b,c){i(a,b)&&g(a,b,c,"notDeepEqual",q.notDeepEqual)},q.strictEqual=function(a,b,c){a!==b&&g(a,b,c,"===",q.strictEqual)},q.notStrictEqual=function(a,b,c){a===b&&g(a,b,c,"!==",q.notStrictEqual)},q["throws"]=function(a,b,c){m.apply(this,[!0].concat(o.call(arguments)))},q.doesNotThrow=function(a,b){m.apply(this,[!1].concat(o.call(arguments)))},q.ifError=function(a){if(a)throw a};var r=Object.keys||function(a){var b=[];for(var c in a)p.call(a,c)&&b.push(c);return b}},{"util/":7}],2:[function(a,b,c){(function(c){function d(){}function e(){m.log.apply(m,arguments)}function f(){m.log.apply(m,arguments)}function g(){m.warn.apply(m,arguments)}function h(a){r[a]=p()}function i(a){var b=r[a];if(!b)throw new Error("No such label: "+a);var c=p()-b;m.log(a+": "+c+"ms")}function j(){var a=new Error;a.name="Trace",a.message=n.format.apply(null,arguments),m.error(a.stack)}function k(a){m.log(n.inspect(a)+"\n")}function l(a){if(!a){var b=q.call(arguments,1);o.ok(!1,n.format.apply(null,b))}}var m,n=a("util"),o=a("assert"),p=a("date-now"),q=Array.prototype.slice,r={};m="undefined"!=typeof c&&c.console?c.console:"undefined"!=typeof window&&window.console?window.console:{};for(var s=[[d,"log"],[e,"info"],[f,"warn"],[g,"error"],[h,"time"],[i,"timeEnd"],[j,"trace"],[k,"dir"],[l,"assert"]],t=0;t<s.length;t++){var u=s[t],v=u[0],w=u[1];m[w]||(m[w]=v)}b.exports=m}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{assert:1,"date-now":3,util:7}],3:[function(a,b,c){function d(){return(new Date).getTime()}b.exports=d},{}],4:[function(a,b,c){"function"==typeof Object.create?b.exports=function(a,b){a.super_=b,a.prototype=Object.create(b.prototype,{constructor:{value:a,enumerable:!1,writable:!0,configurable:!0}})}:b.exports=function(a,b){a.super_=b;var c=function(){};c.prototype=b.prototype,a.prototype=new c,a.prototype.constructor=a}},{}],5:[function(a,b,c){function d(){if(!h){h=!0;for(var a,b=g.length;b;){a=g,g=[];for(var c=-1;++c<b;)a[c]();b=g.length}h=!1}}function e(){}var f=b.exports={},g=[],h=!1;f.nextTick=function(a){g.push(a),h||setTimeout(d,0)},f.title="browser",f.browser=!0,f.env={},f.argv=[],f.version="",f.versions={},f.on=e,f.addListener=e,f.once=e,f.off=e,f.removeListener=e,f.removeAllListeners=e,f.emit=e,f.binding=function(a){throw new Error("process.binding is not supported")},f.cwd=function(){return"/"},f.chdir=function(a){throw new Error("process.chdir is not supported")},f.umask=function(){return 0}},{}],6:[function(a,b,c){b.exports=function(a){return a&&"object"==typeof a&&"function"==typeof a.copy&&"function"==typeof a.fill&&"function"==typeof a.readUInt8}},{}],7:[function(a,b,c){(function(b,d){function e(a,b){var d={seen:[],stylize:g};return arguments.length>=3&&(d.depth=arguments[2]),arguments.length>=4&&(d.colors=arguments[3]),p(b)?d.showHidden=b:b&&c._extend(d,b),v(d.showHidden)&&(d.showHidden=!1),v(d.depth)&&(d.depth=2),v(d.colors)&&(d.colors=!1),v(d.customInspect)&&(d.customInspect=!0),d.colors&&(d.stylize=f),i(d,a,d.depth)}function f(a,b){var c=e.styles[b];return c?"["+e.colors[c][0]+"m"+a+"["+e.colors[c][1]+"m":a}function g(a,b){return a}function h(a){var b={};return a.forEach(function(a,c){b[a]=!0}),b}function i(a,b,d){if(a.customInspect&&b&&A(b.inspect)&&b.inspect!==c.inspect&&(!b.constructor||b.constructor.prototype!==b)){var e=b.inspect(d,a);return t(e)||(e=i(a,e,d)),e}var f=j(a,b);if(f)return f;var g=Object.keys(b),p=h(g);if(a.showHidden&&(g=Object.getOwnPropertyNames(b)),z(b)&&(g.indexOf("message")>=0||g.indexOf("description")>=0))return k(b);if(0===g.length){if(A(b)){var q=b.name?": "+b.name:"";return a.stylize("[Function"+q+"]","special")}if(w(b))return a.stylize(RegExp.prototype.toString.call(b),"regexp");if(y(b))return a.stylize(Date.prototype.toString.call(b),"date");if(z(b))return k(b)}var r="",s=!1,u=["{","}"];if(o(b)&&(s=!0,u=["[","]"]),A(b)){var v=b.name?": "+b.name:"";r=" [Function"+v+"]"}if(w(b)&&(r=" "+RegExp.prototype.toString.call(b)),y(b)&&(r=" "+Date.prototype.toUTCString.call(b)),z(b)&&(r=" "+k(b)),0===g.length&&(!s||0==b.length))return u[0]+r+u[1];if(0>d)return w(b)?a.stylize(RegExp.prototype.toString.call(b),"regexp"):a.stylize("[Object]","special");a.seen.push(b);var x;return x=s?l(a,b,d,p,g):g.map(function(c){return m(a,b,d,p,c,s)}),a.seen.pop(),n(x,r,u)}function j(a,b){if(v(b))return a.stylize("undefined","undefined");if(t(b)){var c="'"+JSON.stringify(b).replace(/^"|"$/g,"").replace(/'/g,"\\'").replace(/\\"/g,'"')+"'";return a.stylize(c,"string")}return s(b)?a.stylize(""+b,"number"):p(b)?a.stylize(""+b,"boolean"):q(b)?a.stylize("null","null"):void 0}function k(a){return"["+Error.prototype.toString.call(a)+"]"}function l(a,b,c,d,e){for(var f=[],g=0,h=b.length;h>g;++g)f.push(F(b,String(g))?m(a,b,c,d,String(g),!0):"");return e.forEach(function(e){e.match(/^\d+$/)||f.push(m(a,b,c,d,e,!0))}),f}function m(a,b,c,d,e,f){var g,h,j;if(j=Object.getOwnPropertyDescriptor(b,e)||{value:b[e]},j.get?h=j.set?a.stylize("[Getter/Setter]","special"):a.stylize("[Getter]","special"):j.set&&(h=a.stylize("[Setter]","special")),F(d,e)||(g="["+e+"]"),h||(a.seen.indexOf(j.value)<0?(h=q(c)?i(a,j.value,null):i(a,j.value,c-1),h.indexOf("\n")>-1&&(h=f?h.split("\n").map(function(a){return"  "+a}).join("\n").substr(2):"\n"+h.split("\n").map(function(a){return"   "+a}).join("\n"))):h=a.stylize("[Circular]","special")),v(g)){if(f&&e.match(/^\d+$/))return h;g=JSON.stringify(""+e),g.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)?(g=g.substr(1,g.length-2),g=a.stylize(g,"name")):(g=g.replace(/'/g,"\\'").replace(/\\"/g,'"').replace(/(^"|"$)/g,"'"),g=a.stylize(g,"string"))}return g+": "+h}function n(a,b,c){var d=0,e=a.reduce(function(a,b){return d++,b.indexOf("\n")>=0&&d++,a+b.replace(/\u001b\[\d\d?m/g,"").length+1},0);return e>60?c[0]+(""===b?"":b+"\n ")+" "+a.join(",\n  ")+" "+c[1]:c[0]+b+" "+a.join(", ")+" "+c[1]}function o(a){return Array.isArray(a)}function p(a){return"boolean"==typeof a}function q(a){return null===a}function r(a){return null==a}function s(a){return"number"==typeof a}function t(a){return"string"==typeof a}function u(a){return"symbol"==typeof a}function v(a){return void 0===a}function w(a){return x(a)&&"[object RegExp]"===C(a)}function x(a){return"object"==typeof a&&null!==a}function y(a){return x(a)&&"[object Date]"===C(a)}function z(a){return x(a)&&("[object Error]"===C(a)||a instanceof Error)}function A(a){return"function"==typeof a}function B(a){return null===a||"boolean"==typeof a||"number"==typeof a||"string"==typeof a||"symbol"==typeof a||"undefined"==typeof a}function C(a){return Object.prototype.toString.call(a)}function D(a){return 10>a?"0"+a.toString(10):a.toString(10)}function E(){var a=new Date,b=[D(a.getHours()),D(a.getMinutes()),D(a.getSeconds())].join(":");return[a.getDate(),J[a.getMonth()],b].join(" ")}function F(a,b){return Object.prototype.hasOwnProperty.call(a,b)}var G=/%[sdj%]/g;c.format=function(a){if(!t(a)){for(var b=[],c=0;c<arguments.length;c++)b.push(e(arguments[c]));return b.join(" ")}for(var c=1,d=arguments,f=d.length,g=String(a).replace(G,function(a){if("%%"===a)return"%";if(c>=f)return a;switch(a){case"%s":return String(d[c++]);case"%d":return Number(d[c++]);case"%j":try{return JSON.stringify(d[c++])}catch(b){return"[Circular]"}default:return a}}),h=d[c];f>c;h=d[++c])g+=q(h)||!x(h)?" "+h:" "+e(h);return g},c.deprecate=function(a,e){function f(){if(!g){if(b.throwDeprecation)throw new Error(e);b.traceDeprecation?console.trace(e):console.error(e),g=!0}return a.apply(this,arguments)}if(v(d.process))return function(){return c.deprecate(a,e).apply(this,arguments)};if(b.noDeprecation===!0)return a;var g=!1;return f};var H,I={};c.debuglog=function(a){if(v(H)&&(H=b.env.NODE_DEBUG||""),a=a.toUpperCase(),!I[a])if(new RegExp("\\b"+a+"\\b","i").test(H)){var d=b.pid;I[a]=function(){var b=c.format.apply(c,arguments);console.error("%s %d: %s",a,d,b)}}else I[a]=function(){};return I[a]},c.inspect=e,e.colors={bold:[1,22],italic:[3,23],underline:[4,24],inverse:[7,27],white:[37,39],grey:[90,39],black:[30,39],blue:[34,39],cyan:[36,39],green:[32,39],magenta:[35,39],red:[31,39],yellow:[33,39]},e.styles={special:"cyan",number:"yellow","boolean":"yellow",undefined:"grey","null":"bold",string:"green",date:"magenta",regexp:"red"},c.isArray=o,c.isBoolean=p,c.isNull=q,c.isNullOrUndefined=r,c.isNumber=s,c.isString=t,c.isSymbol=u,c.isUndefined=v,c.isRegExp=w,c.isObject=x,c.isDate=y,c.isError=z,c.isFunction=A,c.isPrimitive=B,c.isBuffer=a("./support/isBuffer");var J=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];c.log=function(){console.log("%s - %s",E(),c.format.apply(c,arguments))},c.inherits=a("inherits"),c._extend=function(a,b){if(!b||!x(b))return a;for(var c=Object.keys(b),d=c.length;d--;)a[c[d]]=b[c[d]];return a}}).call(this,a("_process"),"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"./support/isBuffer":6,_process:5,inherits:4}],8:[function(a,b,c){c["date-time"]=/^\d{4}-(?:0[0-9]{1}|1[0-2]{1})-[0-9]{2}[tT ]\d{2}:\d{2}:\d{2}(\.\d+)?([zZ]|[+-]\d{2}:\d{2})$/,c.date=/^\d{4}-(?:0[0-9]{1}|1[0-2]{1})-[0-9]{2}$/,c.time=/^\d{2}:\d{2}:\d{2}$/,c.email=/^\S+@\S+$/,c["ip-address"]=c.ipv4=/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,c.ipv6=/^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/,c.uri=/^[a-zA-Z][a-zA-Z0-9+-.]*:[^\s]*$/,c.color=/(#?([0-9A-Fa-f]{3,6})\b)|(aqua)|(black)|(blue)|(fuchsia)|(gray)|(green)|(lime)|(maroon)|(navy)|(olive)|(orange)|(purple)|(red)|(silver)|(teal)|(white)|(yellow)|(rgb\(\s*\b([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\b\s*,\s*\b([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\b\s*,\s*\b([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\b\s*\))|(rgb\(\s*(\d?\d%|100%)+\s*,\s*(\d?\d%|100%)+\s*,\s*(\d?\d%|100%)+\s*\))/,c.hostname=/^([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])(\.([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]{0,61}[a-zA-Z0-9]))*$/,c.alpha=/^[a-zA-Z]+$/,c.alphanumeric=/^[a-zA-Z0-9]+$/,c.style=/\s*(.+?):\s*([^;]+);?/g,c.phone=/^\+(?:[0-9] ?){6,14}[0-9]$/,c["utc-millisec"]=/^[0-9]+(\.?[0-9]+)?$/},{}],9:[function(a,b,c){var d=a("generate-object-property"),e=a("generate-function"),f=a("jsonpointer"),g=a("xtend"),h=a("./formats"),i=function(a,b,c){if(/^https?:\/\//.test(c))return null;var d=function(a){return a&&a.id===c?a:"object"==typeof a&&a?Object.keys(a).reduce(function(b,c){return b||d(a[c])},null):null},e=d(a);if(e)return e;c=c.replace(/^#/,""),c=c.replace(/\/$/,"");try{return f.get(a,decodeURI(c))}catch(g){var h=b[c]||b[c.replace(/^#/,"")];return h||null}},j=function(a){for(var b=/\[[^\[\]"]+\]/;b.test(a);)a=a.replace(b,".*");return a},k={};k.any=function(){return"true"},k["null"]=function(a){return a+" === null"},k["boolean"]=function(a){return"typeof "+a+' === "boolean"'},k.array=function(a){return"Array.isArray("+a+")"},k.object=function(a){return"typeof "+a+' === "object" && '+a+" && !Array.isArray("+a+")"},k.number=function(a){return"typeof "+a+' === "number"'},k.integer=function(a){return"typeof "+a+' === "number" && (Math.floor('+a+") === "+a+" || "+a+" > 9007199254740992 || "+a+" < -9007199254740992)"},k.string=function(a){return"typeof "+a+' === "string"'};var l=function(a){for(var b=[],c=0;c<a.length;c++)b.push("object"==typeof a[c]?JSON.stringify(a[c]):a[c]);for(var c=1;c<b.length;c++)if(b.indexOf(b[c])!==c)return!1;return!0},m=function(a,b,c,f,n){var o=n?g(h,n.formats):h,p={unique:l,formats:o},q=n?!!n.verbose:!1,r=n&&void 0!==n.greedy?n.greedy:!1,s={},t=function(a){return a+(s[a]=(s[a]||0)+1)},u={},v=function(a){if(u[a])return u[a];var b=t("pattern");return p[b]=new RegExp(a),u[a]=b,b},w=["i","j","k","l","m","n","o","p","q","r","s","t","u","v","x","y","z"],x=function(){var a=w.shift();return w.push(a+a[0]),a},y=function(a,e,f,g){var l=e.properties,s=e.type,u=!1;Array.isArray(e.items)&&(l={},e.items.forEach(function(a,b){l[b]=a}),s="array",u=!0);var w=0,A=function(b,c,d){if(z("errors++"),f===!0)if(z("if (validate.errors === null) validate.errors = []"),q)z("validate.errors.push({field:%s,message:%s,value:%s})",JSON.stringify(j(c||a)),JSON.stringify(b),d||a);else{var e=t("error");p[e]={field:j(c||a),message:b},z("validate.errors.push(%s)",e)}};e.required===!0?(w++,z("if (%s === undefined) {",a),A("is required"),z("} else {")):(w++,z("if (%s !== undefined) {",a));var B=[].concat(s).map(function(b){return k[b||"any"](a)}).join(" || ")||"true";if("true"!==B&&(w++,z("if (!(%s)) {",B),A("is the wrong type"),z("} else {")),u)if(e.additionalItems===!1)z("if (%s.length > %d) {",a,e.items.length),A("has additional items"),z("}");else if(e.additionalItems){var C=x();z("for (var %s = %d; %s < %s.length; %s++) {",C,e.items.length,C,a,C),y(a+"["+C+"]",e.additionalItems,f,g),z("}")}if(e.format&&o[e.format]){"string"!==s&&h[e.format]&&z("if (%s) {",k.string(a));var D=t("format");p[D]=o[e.format],"function"==typeof p[D]?z("if (!%s(%s)) {",D,a):z("if (!%s.test(%s)) {",D,a),A("must be "+e.format+" format"),z("}"),"string"!==s&&h[e.format]&&z("}")}if(Array.isArray(e.required)){var E=function(b){var c=d(a,b);z("if (%s === undefined) {",c),A("is required",c),z("missing++"),z("}")};z("if ((%s)) {","object"!==s?k.object(a):"true"),z("var missing = 0"),e.required.map(E),z("}"),r||(z("if (missing === 0) {"),w++)}if(e.uniqueItems&&("array"!==s&&z("if (%s) {",k.array(a)),z("if (!(unique(%s))) {",a),A("must be unique"),z("}"),"array"!==s&&z("}")),e["enum"]){var F=e["enum"].some(function(a){return"object"==typeof a}),G=F?function(b){return"JSON.stringify("+a+") !== JSON.stringify("+JSON.stringify(b)+")"}:function(b){return a+" !== "+JSON.stringify(b)};z("if (%s) {",e["enum"].map(G).join(" && ")||"false"),A("must be an enum value"),z("}")}if(e.dependencies&&("object"!==s&&z("if (%s) {",k.object(a)),Object.keys(e.dependencies).forEach(function(b){var c=e.dependencies[b];"string"==typeof c&&(c=[c]);var h=function(b){return d(a,b)+" !== undefined"};Array.isArray(c)&&(z("if (%s !== undefined && !(%s)) {",d(a,b),c.map(h).join(" && ")||"true"),A("dependencies not set"),z("}")),"object"==typeof c&&(z("if (%s !== undefined) {",d(a,b)),y(a,c,f,g),z("}"))}),"object"!==s&&z("}")),e.additionalProperties||e.additionalProperties===!1){"object"!==s&&z("if (%s) {",k.object(a));var C=x(),H=t("keys"),I=function(a){return H+"["+C+"] !== "+JSON.stringify(a)},J=function(a){return"!"+v(a)+".test("+H+"["+C+"])"},K=Object.keys(l||{}).map(I).concat(Object.keys(e.patternProperties||{}).map(J)).join(" && ")||"true";z("var %s = Object.keys(%s)",H,a)("for (var %s = 0; %s < %s.length; %s++) {",C,C,H,C)("if (%s) {",K),e.additionalProperties===!1?(g&&z("delete %s",a+"["+H+"["+C+"]]"),A("has additional properties",null,JSON.stringify(a+".")+" + "+H+"["+C+"]")):y(a+"["+H+"["+C+"]]",e.additionalProperties,f,g),z("}")("}"),"object"!==s&&z("}")}if(e.$ref){var L=i(c,n&&n.schemas||{},e.$ref);if(L){var M=b[e.$ref];M||(b[e.$ref]=function(a){return M(a)},M=m(L,b,c,!1,n));var D=t("ref");p[D]=M,z("if (!(%s(%s))) {",D,a),A("referenced schema does not match"),z("}")}}if(e.not){var N=t("prev");z("var %s = errors",N),y(a,e.not,!1,g),z("if (%s === errors) {",N),A("negative schema matches"),z("} else {")("errors = %s",N)("}")}if(e.items&&!u){"array"!==s&&z("if (%s) {",k.array(a));var C=x();z("for (var %s = 0; %s < %s.length; %s++) {",C,C,a,C),y(a+"["+C+"]",e.items,f,g),z("}"),"array"!==s&&z("}")}if(e.patternProperties){"object"!==s&&z("if (%s) {",k.object(a));var H=t("keys"),C=x();z("var %s = Object.keys(%s)",H,a)("for (var %s = 0; %s < %s.length; %s++) {",C,C,H,C),Object.keys(e.patternProperties).forEach(function(b){var c=v(b);z("if (%s.test(%s)) {",c,H+"["+C+"]"),y(a+"["+H+"["+C+"]]",e.patternProperties[b],f,g),z("}")}),z("}"),"object"!==s&&z("}")}if(e.pattern){var O=v(e.pattern);"string"!==s&&z("if (%s) {",k.string(a)),z("if (!(%s.test(%s))) {",O,a),A("pattern mismatch"),z("}"),"string"!==s&&z("}")}if(e.allOf&&e.allOf.forEach(function(b){y(a,b,f,g)}),e.anyOf&&e.anyOf.length){var N=t("prev");e.anyOf.forEach(function(b,c){0===c?z("var %s = errors",N):z("if (errors !== %s) {",N)("errors = %s",N),y(a,b,!1,!1)}),e.anyOf.forEach(function(a,b){b&&z("}")}),z("if (%s !== errors) {",N),A("no schemas match"),z("}")}if(e.oneOf&&e.oneOf.length){var N=t("prev"),P=t("passes");z("var %s = errors",N)("var %s = 0",P),e.oneOf.forEach(function(b,c){y(a,b,!1,!1),z("if (%s === errors) {",N)("%s++",P)("} else {")("errors = %s",N)("}")}),z("if (%s !== 1) {",P),A("no (or more than one) schemas match"),z("}")}if(void 0!==e.multipleOf){"number"!==s&&"integer"!==s&&z("if (%s) {",k.number(a));var Q=(0|e.multipleOf)!==e.multipleOf?Math.pow(10,e.multipleOf.toString().split(".").pop().length):1;Q>1?z("if ((%d*%s) % %d) {",Q,a,Q*e.multipleOf):z("if (%s % %d) {",a,e.multipleOf),A("has a remainder"),z("}"),"number"!==s&&"integer"!==s&&z("}")}for(void 0!==e.maxProperties&&("object"!==s&&z("if (%s) {",k.object(a)),z("if (Object.keys(%s).length > %d) {",a,e.maxProperties),A("has more properties than allowed"),z("}"),"object"!==s&&z("}")),void 0!==e.minProperties&&("object"!==s&&z("if (%s) {",k.object(a)),z("if (Object.keys(%s).length < %d) {",a,e.minProperties),A("has less properties than allowed"),z("}"),"object"!==s&&z("}")),void 0!==e.maxItems&&("array"!==s&&z("if (%s) {",k.array(a)),z("if (%s.length > %d) {",a,e.maxItems),A("has more items than allowed"),z("}"),"array"!==s&&z("}")),void 0!==e.minItems&&("array"!==s&&z("if (%s) {",k.array(a)),z("if (%s.length < %d) {",a,e.minItems),A("has less items than allowed"),z("}"),"array"!==s&&z("}")),void 0!==e.maxLength&&("string"!==s&&z("if (%s) {",k.string(a)),z("if (%s.length > %d) {",a,e.maxLength),A("has longer length than allowed"),z("}"),"string"!==s&&z("}")),void 0!==e.minLength&&("string"!==s&&z("if (%s) {",k.string(a)),z("if (%s.length < %d) {",a,e.minLength),A("has less length than allowed"),z("}"),"string"!==s&&z("}")),void 0!==e.minimum&&(z("if (%s %s %d) {",a,e.exclusiveMinimum?"<=":"<",e.minimum),A("is less than minimum"),z("}")),void 0!==e.maximum&&(z("if (%s %s %d) {",a,e.exclusiveMaximum?">=":">",e.maximum),A("is more than maximum"),z("}")),l&&Object.keys(l).forEach(function(b){y(d(a,b),l[b],f,g)});w--;)z("}")},z=e("function validate(data) {")("validate.errors = null")("var errors = 0");return y("data",a,f,n&&n.filter),z("return errors === 0")("}"),z=z.toFunction(p),z.errors=null,z.__defineGetter__("error",function(){return z.errors?z.errors.map(function(a){return a.field+" "+a.message}).join("\n"):""}),z.toJSON=function(){return a},z};b.exports=function(a,b){return"string"==typeof a&&(a=JSON.parse(a)),m(a,{},a,!0,b)},b.exports.filter=function(a,c){var d=b.exports(a,g(c,{filter:!0}));return function(a){return d(a),a}}},{"./formats":8,"generate-function":10,"generate-object-property":11,jsonpointer:13,xtend:14}],10:[function(a,b,c){var d=a("util"),e=/[\{\[]/,f=/[\}\]]/;b.exports=function(){var a=[],b=0,c=function(c){for(var d="";d.length<2*b;)d+="  ";a.push(d+c)},g=function(a){return a?f.test(a.trim()[0])&&e.test(a[a.length-1])?(b--,c(d.format.apply(d,arguments)),b++,g):e.test(a[a.length-1])?(c(d.format.apply(d,arguments)),b++,g):f.test(a.trim()[0])?(b--,c(d.format.apply(d,arguments)),g):(c(d.format.apply(d,arguments)),g):g};return g.toString=function(){return a.join("\n")},g.toFunction=function(a){var b="return ("+g.toString()+")",c=Object.keys(a||{}).map(function(a){return a}),d=c.map(function(b){return a[b]});return Function.apply(null,c.concat(b)).apply(null,d)},arguments.length&&g.apply(null,arguments),g}},{util:7}],11:[function(a,b,c){var d=a("is-property"),e=function(a,b){return d(b)?a+"."+b:a+"["+JSON.stringify(b)+"]"};e.valid=d,b.exports=e},{"is-property":12}],12:[function(a,b,c){"use strict";function d(a){return/^[$A-Z\_a-z\xaa\xb5\xba\xc0-\xd6\xd8-\xf6\xf8-\u02c1\u02c6-\u02d1\u02e0-\u02e4\u02ec\u02ee\u0370-\u0374\u0376\u0377\u037a-\u037d\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03f5\u03f7-\u0481\u048a-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05d0-\u05ea\u05f0-\u05f2\u0620-\u064a\u066e\u066f\u0671-\u06d3\u06d5\u06e5\u06e6\u06ee\u06ef\u06fa-\u06fc\u06ff\u0710\u0712-\u072f\u074d-\u07a5\u07b1\u07ca-\u07ea\u07f4\u07f5\u07fa\u0800-\u0815\u081a\u0824\u0828\u0840-\u0858\u08a0\u08a2-\u08ac\u0904-\u0939\u093d\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097f\u0985-\u098c\u098f\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09bd\u09ce\u09dc\u09dd\u09df-\u09e1\u09f0\u09f1\u0a05-\u0a0a\u0a0f\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32\u0a33\u0a35\u0a36\u0a38\u0a39\u0a59-\u0a5c\u0a5e\u0a72-\u0a74\u0a85-\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2\u0ab3\u0ab5-\u0ab9\u0abd\u0ad0\u0ae0\u0ae1\u0b05-\u0b0c\u0b0f\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32\u0b33\u0b35-\u0b39\u0b3d\u0b5c\u0b5d\u0b5f-\u0b61\u0b71\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99\u0b9a\u0b9c\u0b9e\u0b9f\u0ba3\u0ba4\u0ba8-\u0baa\u0bae-\u0bb9\u0bd0\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c33\u0c35-\u0c39\u0c3d\u0c58\u0c59\u0c60\u0c61\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbd\u0cde\u0ce0\u0ce1\u0cf1\u0cf2\u0d05-\u0d0c\u0d0e-\u0d10\u0d12-\u0d3a\u0d3d\u0d4e\u0d60\u0d61\u0d7a-\u0d7f\u0d85-\u0d96\u0d9a-\u0db1\u0db3-\u0dbb\u0dbd\u0dc0-\u0dc6\u0e01-\u0e30\u0e32\u0e33\u0e40-\u0e46\u0e81\u0e82\u0e84\u0e87\u0e88\u0e8a\u0e8d\u0e94-\u0e97\u0e99-\u0e9f\u0ea1-\u0ea3\u0ea5\u0ea7\u0eaa\u0eab\u0ead-\u0eb0\u0eb2\u0eb3\u0ebd\u0ec0-\u0ec4\u0ec6\u0edc-\u0edf\u0f00\u0f40-\u0f47\u0f49-\u0f6c\u0f88-\u0f8c\u1000-\u102a\u103f\u1050-\u1055\u105a-\u105d\u1061\u1065\u1066\u106e-\u1070\u1075-\u1081\u108e\u10a0-\u10c5\u10c7\u10cd\u10d0-\u10fa\u10fc-\u1248\u124a-\u124d\u1250-\u1256\u1258\u125a-\u125d\u1260-\u1288\u128a-\u128d\u1290-\u12b0\u12b2-\u12b5\u12b8-\u12be\u12c0\u12c2-\u12c5\u12c8-\u12d6\u12d8-\u1310\u1312-\u1315\u1318-\u135a\u1380-\u138f\u13a0-\u13f4\u1401-\u166c\u166f-\u167f\u1681-\u169a\u16a0-\u16ea\u16ee-\u16f0\u1700-\u170c\u170e-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176c\u176e-\u1770\u1780-\u17b3\u17d7\u17dc\u1820-\u1877\u1880-\u18a8\u18aa\u18b0-\u18f5\u1900-\u191c\u1950-\u196d\u1970-\u1974\u1980-\u19ab\u19c1-\u19c7\u1a00-\u1a16\u1a20-\u1a54\u1aa7\u1b05-\u1b33\u1b45-\u1b4b\u1b83-\u1ba0\u1bae\u1baf\u1bba-\u1be5\u1c00-\u1c23\u1c4d-\u1c4f\u1c5a-\u1c7d\u1ce9-\u1cec\u1cee-\u1cf1\u1cf5\u1cf6\u1d00-\u1dbf\u1e00-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffc\u2071\u207f\u2090-\u209c\u2102\u2107\u210a-\u2113\u2115\u2119-\u211d\u2124\u2126\u2128\u212a-\u212d\u212f-\u2139\u213c-\u213f\u2145-\u2149\u214e\u2160-\u2188\u2c00-\u2c2e\u2c30-\u2c5e\u2c60-\u2ce4\u2ceb-\u2cee\u2cf2\u2cf3\u2d00-\u2d25\u2d27\u2d2d\u2d30-\u2d67\u2d6f\u2d80-\u2d96\u2da0-\u2da6\u2da8-\u2dae\u2db0-\u2db6\u2db8-\u2dbe\u2dc0-\u2dc6\u2dc8-\u2dce\u2dd0-\u2dd6\u2dd8-\u2dde\u2e2f\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303c\u3041-\u3096\u309d-\u309f\u30a1-\u30fa\u30fc-\u30ff\u3105-\u312d\u3131-\u318e\u31a0-\u31ba\u31f0-\u31ff\u3400-\u4db5\u4e00-\u9fcc\ua000-\ua48c\ua4d0-\ua4fd\ua500-\ua60c\ua610-\ua61f\ua62a\ua62b\ua640-\ua66e\ua67f-\ua697\ua6a0-\ua6ef\ua717-\ua71f\ua722-\ua788\ua78b-\ua78e\ua790-\ua793\ua7a0-\ua7aa\ua7f8-\ua801\ua803-\ua805\ua807-\ua80a\ua80c-\ua822\ua840-\ua873\ua882-\ua8b3\ua8f2-\ua8f7\ua8fb\ua90a-\ua925\ua930-\ua946\ua960-\ua97c\ua984-\ua9b2\ua9cf\uaa00-\uaa28\uaa40-\uaa42\uaa44-\uaa4b\uaa60-\uaa76\uaa7a\uaa80-\uaaaf\uaab1\uaab5\uaab6\uaab9-\uaabd\uaac0\uaac2\uaadb-\uaadd\uaae0-\uaaea\uaaf2-\uaaf4\uab01-\uab06\uab09-\uab0e\uab11-\uab16\uab20-\uab26\uab28-\uab2e\uabc0-\uabe2\uac00-\ud7a3\ud7b0-\ud7c6\ud7cb-\ud7fb\uf900-\ufa6d\ufa70-\ufad9\ufb00-\ufb06\ufb13-\ufb17\ufb1d\ufb1f-\ufb28\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40\ufb41\ufb43\ufb44\ufb46-\ufbb1\ufbd3-\ufd3d\ufd50-\ufd8f\ufd92-\ufdc7\ufdf0-\ufdfb\ufe70-\ufe74\ufe76-\ufefc\uff21-\uff3a\uff41-\uff5a\uff66-\uffbe\uffc2-\uffc7\uffca-\uffcf\uffd2-\uffd7\uffda-\uffdc][$A-Z\_a-z\xaa\xb5\xba\xc0-\xd6\xd8-\xf6\xf8-\u02c1\u02c6-\u02d1\u02e0-\u02e4\u02ec\u02ee\u0370-\u0374\u0376\u0377\u037a-\u037d\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03f5\u03f7-\u0481\u048a-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05d0-\u05ea\u05f0-\u05f2\u0620-\u064a\u066e\u066f\u0671-\u06d3\u06d5\u06e5\u06e6\u06ee\u06ef\u06fa-\u06fc\u06ff\u0710\u0712-\u072f\u074d-\u07a5\u07b1\u07ca-\u07ea\u07f4\u07f5\u07fa\u0800-\u0815\u081a\u0824\u0828\u0840-\u0858\u08a0\u08a2-\u08ac\u0904-\u0939\u093d\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097f\u0985-\u098c\u098f\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09bd\u09ce\u09dc\u09dd\u09df-\u09e1\u09f0\u09f1\u0a05-\u0a0a\u0a0f\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32\u0a33\u0a35\u0a36\u0a38\u0a39\u0a59-\u0a5c\u0a5e\u0a72-\u0a74\u0a85-\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2\u0ab3\u0ab5-\u0ab9\u0abd\u0ad0\u0ae0\u0ae1\u0b05-\u0b0c\u0b0f\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32\u0b33\u0b35-\u0b39\u0b3d\u0b5c\u0b5d\u0b5f-\u0b61\u0b71\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99\u0b9a\u0b9c\u0b9e\u0b9f\u0ba3\u0ba4\u0ba8-\u0baa\u0bae-\u0bb9\u0bd0\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c33\u0c35-\u0c39\u0c3d\u0c58\u0c59\u0c60\u0c61\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbd\u0cde\u0ce0\u0ce1\u0cf1\u0cf2\u0d05-\u0d0c\u0d0e-\u0d10\u0d12-\u0d3a\u0d3d\u0d4e\u0d60\u0d61\u0d7a-\u0d7f\u0d85-\u0d96\u0d9a-\u0db1\u0db3-\u0dbb\u0dbd\u0dc0-\u0dc6\u0e01-\u0e30\u0e32\u0e33\u0e40-\u0e46\u0e81\u0e82\u0e84\u0e87\u0e88\u0e8a\u0e8d\u0e94-\u0e97\u0e99-\u0e9f\u0ea1-\u0ea3\u0ea5\u0ea7\u0eaa\u0eab\u0ead-\u0eb0\u0eb2\u0eb3\u0ebd\u0ec0-\u0ec4\u0ec6\u0edc-\u0edf\u0f00\u0f40-\u0f47\u0f49-\u0f6c\u0f88-\u0f8c\u1000-\u102a\u103f\u1050-\u1055\u105a-\u105d\u1061\u1065\u1066\u106e-\u1070\u1075-\u1081\u108e\u10a0-\u10c5\u10c7\u10cd\u10d0-\u10fa\u10fc-\u1248\u124a-\u124d\u1250-\u1256\u1258\u125a-\u125d\u1260-\u1288\u128a-\u128d\u1290-\u12b0\u12b2-\u12b5\u12b8-\u12be\u12c0\u12c2-\u12c5\u12c8-\u12d6\u12d8-\u1310\u1312-\u1315\u1318-\u135a\u1380-\u138f\u13a0-\u13f4\u1401-\u166c\u166f-\u167f\u1681-\u169a\u16a0-\u16ea\u16ee-\u16f0\u1700-\u170c\u170e-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176c\u176e-\u1770\u1780-\u17b3\u17d7\u17dc\u1820-\u1877\u1880-\u18a8\u18aa\u18b0-\u18f5\u1900-\u191c\u1950-\u196d\u1970-\u1974\u1980-\u19ab\u19c1-\u19c7\u1a00-\u1a16\u1a20-\u1a54\u1aa7\u1b05-\u1b33\u1b45-\u1b4b\u1b83-\u1ba0\u1bae\u1baf\u1bba-\u1be5\u1c00-\u1c23\u1c4d-\u1c4f\u1c5a-\u1c7d\u1ce9-\u1cec\u1cee-\u1cf1\u1cf5\u1cf6\u1d00-\u1dbf\u1e00-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffc\u2071\u207f\u2090-\u209c\u2102\u2107\u210a-\u2113\u2115\u2119-\u211d\u2124\u2126\u2128\u212a-\u212d\u212f-\u2139\u213c-\u213f\u2145-\u2149\u214e\u2160-\u2188\u2c00-\u2c2e\u2c30-\u2c5e\u2c60-\u2ce4\u2ceb-\u2cee\u2cf2\u2cf3\u2d00-\u2d25\u2d27\u2d2d\u2d30-\u2d67\u2d6f\u2d80-\u2d96\u2da0-\u2da6\u2da8-\u2dae\u2db0-\u2db6\u2db8-\u2dbe\u2dc0-\u2dc6\u2dc8-\u2dce\u2dd0-\u2dd6\u2dd8-\u2dde\u2e2f\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303c\u3041-\u3096\u309d-\u309f\u30a1-\u30fa\u30fc-\u30ff\u3105-\u312d\u3131-\u318e\u31a0-\u31ba\u31f0-\u31ff\u3400-\u4db5\u4e00-\u9fcc\ua000-\ua48c\ua4d0-\ua4fd\ua500-\ua60c\ua610-\ua61f\ua62a\ua62b\ua640-\ua66e\ua67f-\ua697\ua6a0-\ua6ef\ua717-\ua71f\ua722-\ua788\ua78b-\ua78e\ua790-\ua793\ua7a0-\ua7aa\ua7f8-\ua801\ua803-\ua805\ua807-\ua80a\ua80c-\ua822\ua840-\ua873\ua882-\ua8b3\ua8f2-\ua8f7\ua8fb\ua90a-\ua925\ua930-\ua946\ua960-\ua97c\ua984-\ua9b2\ua9cf\uaa00-\uaa28\uaa40-\uaa42\uaa44-\uaa4b\uaa60-\uaa76\uaa7a\uaa80-\uaaaf\uaab1\uaab5\uaab6\uaab9-\uaabd\uaac0\uaac2\uaadb-\uaadd\uaae0-\uaaea\uaaf2-\uaaf4\uab01-\uab06\uab09-\uab0e\uab11-\uab16\uab20-\uab26\uab28-\uab2e\uabc0-\uabe2\uac00-\ud7a3\ud7b0-\ud7c6\ud7cb-\ud7fb\uf900-\ufa6d\ufa70-\ufad9\ufb00-\ufb06\ufb13-\ufb17\ufb1d\ufb1f-\ufb28\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40\ufb41\ufb43\ufb44\ufb46-\ufbb1\ufbd3-\ufd3d\ufd50-\ufd8f\ufd92-\ufdc7\ufdf0-\ufdfb\ufe70-\ufe74\ufe76-\ufefc\uff21-\uff3a\uff41-\uff5a\uff66-\uffbe\uffc2-\uffc7\uffca-\uffcf\uffd2-\uffd7\uffda-\uffdc0-9\u0300-\u036f\u0483-\u0487\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u0610-\u061a\u064b-\u0669\u0670\u06d6-\u06dc\u06df-\u06e4\u06e7\u06e8\u06ea-\u06ed\u06f0-\u06f9\u0711\u0730-\u074a\u07a6-\u07b0\u07c0-\u07c9\u07eb-\u07f3\u0816-\u0819\u081b-\u0823\u0825-\u0827\u0829-\u082d\u0859-\u085b\u08e4-\u08fe\u0900-\u0903\u093a-\u093c\u093e-\u094f\u0951-\u0957\u0962\u0963\u0966-\u096f\u0981-\u0983\u09bc\u09be-\u09c4\u09c7\u09c8\u09cb-\u09cd\u09d7\u09e2\u09e3\u09e6-\u09ef\u0a01-\u0a03\u0a3c\u0a3e-\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a66-\u0a71\u0a75\u0a81-\u0a83\u0abc\u0abe-\u0ac5\u0ac7-\u0ac9\u0acb-\u0acd\u0ae2\u0ae3\u0ae6-\u0aef\u0b01-\u0b03\u0b3c\u0b3e-\u0b44\u0b47\u0b48\u0b4b-\u0b4d\u0b56\u0b57\u0b62\u0b63\u0b66-\u0b6f\u0b82\u0bbe-\u0bc2\u0bc6-\u0bc8\u0bca-\u0bcd\u0bd7\u0be6-\u0bef\u0c01-\u0c03\u0c3e-\u0c44\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c62\u0c63\u0c66-\u0c6f\u0c82\u0c83\u0cbc\u0cbe-\u0cc4\u0cc6-\u0cc8\u0cca-\u0ccd\u0cd5\u0cd6\u0ce2\u0ce3\u0ce6-\u0cef\u0d02\u0d03\u0d3e-\u0d44\u0d46-\u0d48\u0d4a-\u0d4d\u0d57\u0d62\u0d63\u0d66-\u0d6f\u0d82\u0d83\u0dca\u0dcf-\u0dd4\u0dd6\u0dd8-\u0ddf\u0df2\u0df3\u0e31\u0e34-\u0e3a\u0e47-\u0e4e\u0e50-\u0e59\u0eb1\u0eb4-\u0eb9\u0ebb\u0ebc\u0ec8-\u0ecd\u0ed0-\u0ed9\u0f18\u0f19\u0f20-\u0f29\u0f35\u0f37\u0f39\u0f3e\u0f3f\u0f71-\u0f84\u0f86\u0f87\u0f8d-\u0f97\u0f99-\u0fbc\u0fc6\u102b-\u103e\u1040-\u1049\u1056-\u1059\u105e-\u1060\u1062-\u1064\u1067-\u106d\u1071-\u1074\u1082-\u108d\u108f-\u109d\u135d-\u135f\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17b4-\u17d3\u17dd\u17e0-\u17e9\u180b-\u180d\u1810-\u1819\u18a9\u1920-\u192b\u1930-\u193b\u1946-\u194f\u19b0-\u19c0\u19c8\u19c9\u19d0-\u19d9\u1a17-\u1a1b\u1a55-\u1a5e\u1a60-\u1a7c\u1a7f-\u1a89\u1a90-\u1a99\u1b00-\u1b04\u1b34-\u1b44\u1b50-\u1b59\u1b6b-\u1b73\u1b80-\u1b82\u1ba1-\u1bad\u1bb0-\u1bb9\u1be6-\u1bf3\u1c24-\u1c37\u1c40-\u1c49\u1c50-\u1c59\u1cd0-\u1cd2\u1cd4-\u1ce8\u1ced\u1cf2-\u1cf4\u1dc0-\u1de6\u1dfc-\u1dff\u200c\u200d\u203f\u2040\u2054\u20d0-\u20dc\u20e1\u20e5-\u20f0\u2cef-\u2cf1\u2d7f\u2de0-\u2dff\u302a-\u302f\u3099\u309a\ua620-\ua629\ua66f\ua674-\ua67d\ua69f\ua6f0\ua6f1\ua802\ua806\ua80b\ua823-\ua827\ua880\ua881\ua8b4-\ua8c4\ua8d0-\ua8d9\ua8e0-\ua8f1\ua900-\ua909\ua926-\ua92d\ua947-\ua953\ua980-\ua983\ua9b3-\ua9c0\ua9d0-\ua9d9\uaa29-\uaa36\uaa43\uaa4c\uaa4d\uaa50-\uaa59\uaa7b\uaab0\uaab2-\uaab4\uaab7\uaab8\uaabe\uaabf\uaac1\uaaeb-\uaaef\uaaf5\uaaf6\uabe3-\uabea\uabec\uabed\uabf0-\uabf9\ufb1e\ufe00-\ufe0f\ufe20-\ufe26\ufe33\ufe34\ufe4d-\ufe4f\uff10-\uff19\uff3f]*$/.test(a);

}b.exports=d},{}],13:[function(a,b,c){var d=(a("console"),function(a){return a.replace(/~./g,function(a){switch(a){case"~0":return"~";case"~1":return"/"}throw"Invalid tilde escape: "+a})}),e=function(a,b,c){var f=d(b.shift());if("undefined"==typeof a[f])throw"Value for pointer '"+b+"' not found.";if(0!==b.length)return e(a[f],b,c);if("undefined"==typeof c)return a[f];var g=a[f];return null===c?delete a[f]:a[f]=c,g},f=function(a,b){if("object"!=typeof a)throw"Invalid input object.";if(""===b)return[];if(!b)throw"Invalid JSON pointer.";b=b.split("/");var c=b.shift();if(""!==c)throw"Invalid JSON pointer.";return b},g=function(a,b){return b=f(a,b),0===b.length?a:e(a,b)},h=function(a,b,c){if(b=f(a,b),0===b.length)throw"Invalid JSON pointer for set.";return e(a,b,c)};c.get=g,c.set=h},{console:2}],14:[function(a,b,c){function d(){for(var a={},b=0;b<arguments.length;b++){var c=arguments[b];for(var d in c)c.hasOwnProperty(d)&&(a[d]=c[d])}return a}b.exports=d},{}]},{},[9])(9)});
//# sourceMappingURL=is-my-json-valid.min.js.map

var Observe;

Observe = (function() {
  function Observe(collection, root, callback, curr, path) {
    var base, item, j, key, len, new_path, type_of_curr;
    this.collection = collection;
    if (curr == null) {
      curr = null;
    }
    if (path == null) {
      path = null;
    }
    curr = curr || root;
    if (!root) {
      throw new Error("Observe: Object missing.");
    }
    if (typeof callback !== "function") {
      throw new Error("Observe: Callback should be a function.");
    }
    type_of_curr = curr.constructor.name;
    if (type_of_curr === "Array") {
      base = path;
      for (key = j = 0, len = curr.length; j < len; key = ++j) {
        item = curr[key];
        if (typeof item === "object") {
          new_path = (base || '') + "[" + key + "]";
          new Observe(this.collection, root, callback, item, new_path);
          new_path = "";
        }
      }
    }
    if (type_of_curr === "Object") {
      base = path;
      for (key in curr) {
        item = curr[key];
        if (typeof item === "object") {
          if (base) {
            new_path = base + "." + key;
          }
          if (!base) {
            new_path = "" + key;
          }
          new Observe(this.collection, root, callback, item, new_path);
          new_path = "";
        }
      }
    }
    if (curr.constructor.name === "Array") {
      base = path;
      Array.observe(curr, (function(_this) {
        return function(changes) {
          var original, result;
          result = {};
          original = {};
          changes.forEach(function(change, i) {
            var index_or_name, is_add, part;
            index_or_name = change.index > -1 ? change.index : change.name;
            new_path = (base || '') + "[" + index_or_name + "]";
            part = {
              collection: _this.collection,
              path: new_path,
              value: change.object[change.index] || change.object[change.name] || change.object
            };
            is_add = change.addedCount > 0 || change.type === "add";
            if (typeof part.value === "object" && is_add) {
              new Observe(_this.collection, root, callback, part.value, part.path);
              new_path = "";
            }
            result[i] = part;
            return original[i] = change;
          });
          return callback(result, original);
        };
      })(this));
    } else if (curr.constructor.name === "Object") {
      base = path;
      Object.observe(curr, (function(_this) {
        return function(changes) {
          var original, result;
          result = {};
          original = {};
          changes.forEach(function(change, i) {
            var is_add, part;
            if (base) {
              new_path = base + "." + change.name;
            }
            if (!base) {
              new_path = "" + change.name;
            }
            part = {
              collection: _this.collection,
              path: new_path,
              value: change.object[change.name]
            };
            is_add = change.type === "add" || change.addedCount > 0;
            if (typeof part.value === "object" && is_add) {
              new Observe(_this.collection, root, callback, part.value, part.path);
              new_path = "";
            }
            result[i] = part;
            return original[i] = change;
          });
          return callback(result, original);
        };
      })(this));
    }
  }

  return Observe;

})();

Function.prototype.getter = function(prop, get) {
  return Object.defineProperty(this.prototype, prop, {
    get: get,
    configurable: true,
    enumerable: false
  });
};

Function.prototype.setter = function(prop, set) {
  return Object.defineProperty(this.prototype, prop, {
    set: set,
    configurable: true,
    enumerable: false
  });
};

Function.prototype.property = function(prop, desc) {
  return Object.defineProperty(this.prototype, prop, desc);
};

if ($.fn.findAll == null) {
  $.fn.findAll = function(selector) {
    return this.find(selector).add(this.filter(selector));
  };
}

if ($.fn.value == null) {
  $.fn.value = function(val, text) {
    var txt;
    if (text == null) {
      text = false;
    }
    console.info("go back to value change how it works");
    if (val) {
      $(this).data('value', arguments[0]);
      if (text === true) {
        txt = $.trim(val);
        $(this).text(txt);
      }
      $(this).trigger('jom.change');
      return $(this);
    }
    return $(this).data('value');
  };
}

var Asset,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

Asset = (function() {
  Asset.name = null;

  Asset.source = "";

  Asset.origin = "";

  Asset.content_type = {};

  Asset.element = {};

  function Asset(asset) {
    var $asset, arr, params, part, ref, split, type;
    $asset = $(asset);
    this.rel = $asset.attr("rel");
    if (this.rel === void 0) {
      throw new Error("jom: rel=asset is required");
    }
    this.name = ($asset.attr("name")) || null;
    this.source = $asset.attr("source");
    this.asset = $asset.attr("asset");
    this.schema = $asset.attr("schema");
    this.original = asset;
    this.clone = $asset.clone();
    type = $asset.attr("type");
    if (type === void 0) {
      throw new Error("jom: asset type is required");
    }
    split = type.split(";");
    part = $.trim(split[0]);
    params = $.trim(split[1]) || null;
    this.content_type = {
      full: type,
      part: part,
      type: part.split("/")[0],
      media: part.split("/")[1],
      params: params
    };
    $asset.get(0).asset = true;
    this.element = this.create_element();
    switch (this.content_type.part) {
      case 'text/html':
        this.error('name');
        this.error('source');
        this.error('asset');
        break;
      case 'text/json':
        this.error('name');
        this.error('source');
        this.error('asset');
        if (this.asset === "collection") {
          this.error('schema');
        }
        break;
      default:
        this.error('source');
    }
    arr = ['schema', 'collection', 'template', 'javascript', 'css', 'img', 'plain'];
    if (this.asset && (ref = this.asset, indexOf.call(arr, ref) >= 0) === false) {
      throw new Error("jom: asset attr '" + this.asset + "' is not valid");
    }
    this;
  }

  Asset.prototype.error = function(type) {
    var arr;
    arr = ['name', 'source', 'asset', 'schema'];
    if (indexOf.call(arr, type) >= 0 && this[type] === void 0) {
      throw new Error("jom: " + type + " attr is required");
    }
  };

  Asset.prototype.create_element = function() {
    var element;
    switch (this.content_type.part) {
      case 'text/html':
        element = "<link    rel=import href='" + this.source + "' type='text/html' name='" + this.name + "' asset='" + this.asset + "' />";
        break;
      case 'text/css':
        element = "<link    href='" + this.source + "' rel='stylesheet' type='text/css' name='" + this.name + "' asset='" + this.asset + "' />";
        break;
      case 'text/javascript':
        element = "<script  src='" + this.source + "' type='text/javascript' async=true name='" + this.name + "' asset='" + this.asset + "' />";
        break;
      case 'text/json':
        element = "<script  source='" + this.source + "' type='" + this.content_type.part + "' async='true' name='" + this.name + "' asset='" + this.asset + "' schema='" + this.schema + "' />";
        break;
      case "text/plain":
        element = "<script  type='" + this.content_type.part + "' async='true' name='" + this.name + "' asset='" + this.asset + "' />";
        break;
      default:
        element = null;
        if (typeof console !== "undefined" && console !== null) {
          if (typeof console.warn === "function") {
            console.warn("media: ", this.content_type.part);
          }
        }
        throw new Error("jom: asset media `" + this.content_type.full + "` type is not valid");
    }
    return element;
  };

  return Asset;

})();

var Shadow;

Shadow = (function() {
  function Shadow() {
    var _ref, _ref1, _ref2, _ref3, _ref4;
    this.root = ((_ref = document.currentScript) != null ? _ref.parentNode : void 0) || ((_ref1 = arguments.callee) != null ? (_ref2 = _ref1.caller) != null ? (_ref3 = _ref2.caller) != null ? (_ref4 = _ref3["arguments"][0]) != null ? _ref4.target : void 0 : void 0 : void 0 : void 0) || null;
    this.traverseAncestry();
    this.root;
  }

  Shadow.prototype.traverseAncestry = function(parent) {
    var _ref;
    if (((_ref = this.root) != null ? _ref.parentNode : void 0) || parent) {
      this.root = this.root.parentNode || parent;
      return this.traverseAncestry(this.root.parentNode);
    }
  };

  Shadow.getter("body", function() {
    return ($(this.root).children().filter('[body]').get(0)) || null;
  });

  Shadow.getter("host", function() {
    var _ref;
    return ((_ref = this.root) != null ? _ref.host : void 0) || null;
  });

  return Shadow;

})();

Object.defineProperty(window, "Root", {
  get: function() {
    return new Shadow();
  }
});

var Collection;

Collection = (function() {
  Collection.name = "";

  Collection.document = [];

  Collection.schema = {};

  Collection.errors = [];

  Collection.observing = false;

  function Collection(name, document, schema) {
    if (document == null) {
      document = [];
    }
    if (name === void 0 || !name || typeof name !== "string") {
      throw new Error("jom: collection name is required");
    }
    this.name = name;
    this.errors = [];
    this.document = [];
    this.schema = {};
    this.attach_schema(schema);
    this.attach_document(document);
    this.observing = false;
  }

  Collection.prototype.generate_id = function() {
    return new Date().getTime();
  };

  Collection.prototype.meta = function() {
    return {
      id: this.generate_id()
    };
  };

  Collection.prototype.add = function(obj) {
    var is_valid;
    is_valid = this.is_valid(obj);
    if (is_valid) {
      return this.document.push(obj);
    } else {
      return this.errors.push("Cannot add the document, is not valid. " + (obj.toString()));
    }
  };

  Collection.prototype.attach_document = function(document) {
    var i, item, len, length;
    if (document == null) {
      document = [];
    }
    length = document.length || Object.keys(document).length;
    if (length) {
      if (Array.isArray(document)) {
        for (i = 0, len = document.length; i < len; i++) {
          item = document[i];
          item.meta = this.meta();
          Object.defineProperty(item, "meta", {
            enumerable: false
          });
          this.add(item);
        }
      } else {
        document.meta = this.meta();
        Object.defineProperty(document, "meta", {
          enumerable: false
        });
        this.add(document);
      }
    }
    this.is_valid();
    return this.document;
  };

  Collection.prototype.attach_schema = function(schema) {
    if (schema !== void 0 && schema['$schema'] === void 0) {
      schema['$schema'] = 'http://json-schema.org/draft-04/schema#';
    }
    this.schema = schema;
    this.is_valid();
    return this.schema;
  };

  Collection.prototype.errors_to_string = function() {
    return JSON.stringify(this.errors);
  };

  Collection.prototype.schema_valid = function() {
    return this.schema.is_valid();
  };

  Collection.prototype.is_valid = function(doc) {
    var document, documentValidator, errors, i, len, ref, validator;
    if (doc == null) {
      doc = null;
    }
    validator = isMyJsonValid;
    errors = [];
    if (this.schema === void 0) {
      return false;
    }
    documentValidator = validator(this.schema.tree, {
      verbose: true
    });
    if (doc !== null) {
      documentValidator(doc);
      if (documentValidator.errors && documentValidator.errors.length) {
        errors = documentValidator.errors;
      }
    } else {
      ref = this.document;
      for (i = 0, len = ref.length; i < len; i++) {
        doc = ref[i];
        documentValidator(doc);
        if (documentValidator.errors && documentValidator.errors.length) {
          errors.push(documentValidator.errors);
        }
      }
    }
    if (errors.length) {
      if (typeof console !== "undefined" && console !== null) {
        if (typeof console.error === "function") {
          console.error("Collection: ", this.name, errors);
        }
      }
    }
    if (errors.length) {
      return false;
    } else {
      return true;
    }
    if (this.schema === void 0) {
      return true;
    }
    if (document !== null && document.toString() !== "[object Object]") {
      this.errors.push("collection: document is wrong");
      return false;
    }
    if (this.schema["$schema"] === void 0) {
      throw new Error("jom: $schema is missing");
    }
    env.addSchema(this.name, this.schema);
    document = document || this.document;
    this.errors = env.validate(this.name, document);
    if (!this.errors) {
      return true;
    }
    return false;
  };

  Collection.prototype.join = function(a, b) {
    var args, arr, first, join, result;
    join = this.join;
    b = "" + b;
    first = b[0];
    result = first === "[" ? a + b : a + "." + b;
    if (arguments.length > 2) {
      args = Array.prototype.splice.call(arguments, 2);
      arr = [];
      arr.push(result);
      arr.push.apply(arr, args);
      result = this.join.apply(this, arr);
    }
    return result;
  };

  Collection.prototype.findByPath = function(path) {
    var i, item, len, regx, result, split, text;
    regx = /(\[)(\d+)(\])/g;
    text = path.replace(regx, ".$2").replace(/^\.*/, "");
    split = text.split(".");
    result = this.document;
    for (i = 0, len = split.length; i < len; i++) {
      item = split[i];
      if (result === void 0) {
        return result;
      }
      result = result[item];
    }
    return result;
  };

  return Collection;

})();

var Component;

Component = (function() {
  var disabled, regx, regxG;

  disabled = false;

  regx = /\${([^\s{}]+)}/;

  regxG = /\${([^\s{}]+)}/g;

  function Component(component) {
    var $component, collections, template;
    if (component === void 0) {
      throw new Error("jom: component is required");
    }
    $component = $(component);
    $component.get(0).component = true;
    template = $component.attr("template");
    collections = $component.attr("collections");
    if (!template) {
      throw new Error("jom: component template is required");
    }
    if (!collections) {
      throw new Error("jom: component collections is required");
    }
    this.skip = false;
    this.attr = {
      template: template,
      collections: collections
    };
    collections = collections.split(/\s*,\s*/g);
    this.collections_list = collections;
    this.element = $component.get(0);
    if (!this.element.createShadowRoot) {
      this.element = wrap(this.element);
    }
    this.hide();
    this.ready = false;
    this.template = null;
    this.collections = [];
    this.create_shadow();
    this.root = this.element.shadowRoot;
    this.handles = [];
    this.events = [];
    this.scripts = [];
    this.scripts.status = "init";
    this.init = {
      template: false,
      collections: false
    };
    this;
  }

  Component.prototype.hide = function() {
    var $root;
    $root = $(this.root);
    return $root.find("");
  };

  Component.prototype.show = function() {};

  Component.prototype.enable = function() {
    return disabled = false;
  };

  Component.prototype.disable = function() {
    return disabled = true;
  };

  Component.prototype.destroy = function() {};

  Component.prototype.create_shadow = function() {
    return this.element.createShadowRoot();
  };

  Component.prototype.define_template = function(template) {
    if (!template || template instanceof Template === false) {
      throw new Error("jom: template cant be added");
    }
    return this.template = template;
  };

  Component.prototype.define_collection = function(collection) {
    if (!collection || collection instanceof Collection === false) {
      throw new Error("jom: collection cant be added");
    }
    this.collections.push(collection);
    return this.collections;
  };

  Component.prototype.watcher = function(changes, collection) {
    var change, key, results;
    throw new Error("what watcher!!!");
    if (collection.name === this.collection.name) {
      results = [];
      for (key in changes) {
        change = changes[key];
        if (change.path.slice(0, this.path.length) === this.path) {
          results.push($(this.handles).each((function(_this) {
            return function(i, handle) {
              var event, j, k, len, len1, partial, ref, ref1, results1;
              if (handle.handle.path === change.path) {
                $(handle).trigger('change', change);
                partial = change.path.replace(_this.path, "").replace(/^\./, "");
                ref = _this.events;
                for (j = 0, len = ref.length; j < len; j++) {
                  event = ref[j];
                  if (event.type === "change:before" && event.path === partial) {
                    event.callback.call(_this);
                  }
                }
                switch (handle.handle.type) {
                  case "attr_name":
                    $(handle).attr(handle.handle.attr.name, "");
                    break;
                  case "attr_value":
                    $(handle).attr(handle.handle.attr.name, change.value);
                    break;
                  case "node":
                    $(handle).text(change.value);
                    break;
                  default:
                    throw new Error("jom: unexpected handle type");
                }
                ref1 = _this.events;
                results1 = [];
                for (k = 0, len1 = ref1.length; k < len1; k++) {
                  event = ref1[k];
                  if (event.type === "change" && event.path === partial) {
                    results1.push(event.callback.call(_this));
                  } else {
                    results1.push(void 0);
                  }
                }
                return results1;
              }
            };
          })(this)));
        } else {
          results.push(void 0);
        }
      }
      return results;
    }
  };

  Component.prototype.handlebars = function(content, component) {
    var $content, c, collections;
    if (content instanceof ShadowRoot) {
      content = content.children;
    }
    collections = component.collections;
    $content = $(content);
    c = $content.findAll('*').not('script, style, link, [repeat]').filter(function() {
      return $(this).parents('[repeat]').length === 0;
    });
    c.each((function(_this) {
      return function(i, node) {
        var attr, collection, e, j, key, len, name, new_text, path, raw, ref, ref1, ref2, result, rx, text;
        text = $(node).text();
        if ($(node).children().length === 0 && regx.test(text) === true) {
          raw = text;
          key = text.match(regx)[1];
          ref = key.split(':'), collection = ref[0], path = ref[1];
          collection = collections[collection];
          if (collection === void 0) {
            throw new Error("component: `" + raw + "` is wrong, start with collection.");
          }
          new_text = collection.findByPath($.trim(path));
          if (new_text === void 0) {
            if (jom.env === "production") {
              console.info(new_text);
              new_text = "";
            } else {
              throw new Error("Data: not found for `" + raw + "` key.");
            }
          }
          $(node).text(text.replace(regx, new_text));
          node.handle = {
            type: "node",
            path: path,
            full: collection.join(collection.name, path)
          };
          _this.handles.push(node);
        }
        ref1 = node.attributes;
        for (key = j = 0, len = ref1.length; j < len; key = ++j) {
          attr = ref1[key];
          if (regx.test(attr.name)) {
            text = attr.name;
            raw = text;
            try {
              key = text.match(regx)[1];
            } catch (_error) {
              e = _error;
              throw new Error("Component: wrong key on attr name " + text);
            }
            ref2 = key.split(':'), collection = ref2[0], path = ref2[1];
            collection = collections[collection];
            if (collection === void 0) {
              throw new Error("component: `" + raw + "` is wrong, start with collection.");
            }
            new_text = collection.findByPath($.trim(path));
            if (new_text === void 0 && jom.env === "production") {
              new_text = "";
            }
            name = text.replace(regx, new_text);
            $(node).removeAttr(attr.name).attr(name, attr.value);
            node.handle = {
              attr: attr,
              type: "attr_name",
              path: path,
              full: collection.join(collection.name, path)
            };
            _this.handles.push(node);
          }
          if (regx.test(attr.value)) {
            text = attr.value;
            raw = text;
            rx = new RegExp(regx.toString().slice(1, -1), 'gi');
            result = text.match(rx);
            $(result).each(function(i, item) {
              var find_from_collection, ref3;
              try {
                key = item.match(regx)[1];
              } catch (_error) {
                e = _error;
                throw new Error("Component: wrong key on attr value " + text);
              }
              ref3 = key.split(':'), collection = ref3[0], path = ref3[1];
              if (collection === void 0) {
                throw new Error("component: `" + raw + "` is wrong, start with collection.");
              }
              collection = collections[collection];
              find_from_collection = collection.findByPath($.trim(path));
              if (find_from_collection === void 0 && jom.env === "production") {
                return text = text.replace(regx, "");
              } else {
                return text = text.replace(regx, find_from_collection);
              }
            });
            attr.value = text;
            node.handle = {
              attr: attr,
              type: "attr_value",
              path: path,
              full: collection.join(collection.name, path)
            };
            _this.handles.push(node);
          }
        }
        return node;
      };
    })(this));
    return $content;
  };

  Component.prototype.handle_template_scripts = function(content) {
    var escapeRegExp, scripts;
    escapeRegExp = function(str) {
      return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    };
    scripts = $(content).add(content.children).findAll('script');
    $(scripts).filter('[src]').each(function(i, script) {
      return script.onload = function() {
        return script.has_loaded = true;
      };
    });
    return $(scripts).not('[src]').eq(0).each(function(i, script) {
      var front, is_script_prepared, reg;
      front = "";
      reg = new RegExp("^" + (escapeRegExp(front)));
      is_script_prepared = reg.test(script.text);
      script.text = "(function(){\nvar\nshadow      = jom.shadow,\nbody        = shadow.body,\nhost        = shadow.host,\nroot        = shadow.root,\ncomponent   = host.component,\ncollections = component.collections\n;\n\n" + script.text + "\n})()";
      return script;
    });
  };

  Component.prototype.on = function(type, path, callback) {
    var event, j, len, types;
    types = type.split(" ");
    if (arguments.length === 2) {
      callback = path;
      path = null;
    }
    for (j = 0, len = types.length; j < len; j++) {
      type = types[j];
      event = {};
      event.type = type;
      event.callback = callback;
      event.path = path;
      this.events.push(event);
    }
    return this;
  };

  Component.prototype.trigger = function(type, params) {
    var event, handle, j, k, l, len, len1, len2, part, ref, ref1, types;
    if (params == null) {
      params = {};
    }
    types = type.split(" ");
    for (j = 0, len = types.length; j < len; j++) {
      type = types[j];
      ref = this.events;
      for (k = 0, len1 = ref.length; k < len1; k++) {
        event = ref[k];
        if (type === event.type) {
          if (event.path === null) {
            event.callback.call(handle, event, params);
          }
          ref1 = this.handles;
          for (l = 0, len2 = ref1.length; l < len2; l++) {
            handle = ref1[l];
            part = !!~handle.handle.path.indexOf(event.path);
            if (handle.handle.path && part) {
              event.callback.call(handle, event, params);
            }
          }
        }
      }
    }
    return this;
  };

  Component.prototype.repeat = function(element, data) {
    var $element, clone, collection, e, index, item, j, key, len, path, prefix, raw, ref, repeat, x;
    if (data == null) {
      data = null;
    }
    if (data === null) {
      data = [];
    }
    $element = $(element);
    key = $element.attr('repeat');
    raw = key;
    if (key === void 0) {
      throw new Error("component: `repeat` attr missing");
    }
    try {
      key = key.match(regx)[1];
    } catch (_error) {
      e = _error;
      throw new Error("Component: Wrong key `" + key + "`");
    }
    repeat = $([]);
    ref = key.split(":"), collection = ref[0], path = ref[1];
    if (collection === void 0) {
      throw new Error("component: `" + raw + "` is wrong, start with collection.");
    }
    if (path !== void 0 && path.length) {
      data = this.collections[collection].findByPath(path);
    } else {
      data = this.collections[collection].document;
    }
    if (data === void 0) {
      throw new Error("component: data not found `" + path + "`");
    }
    if (path === void 0) {
      path = "";
    }
    for (index = j = 0, len = data.length; j < len; index = ++j) {
      item = data[index];
      clone = $element.clone();
      clone.attr("repeated", true);
      clone.attr("repeat", null);
      clone.attr('repeat-index', index);
      clone.get(0).style.display = '';
      prefix = this.collections[collection].join(path, "[" + index + "]");
      prefix = collection + ":" + prefix;
      x = clone[0].outerHTML.replace(/(\${)([^\s{}]+)(})/g, "$1" + prefix + ".$2$3");
      x = x.replace(/(\{repeat\.index})/g, index);
      x = x.replace(/(\{repeat\.length})/g, data.length);
      repeat = repeat.add(x);
    }
    return repeat;
  };

  Component.prototype.reset_collection = function(collections) {
    var collection, comma, j, len, list;
    list = [];
    comma = "";
    if (collections instanceof Array === false) {
      throw new Error("component: reset expects an array");
    }
    for (j = 0, len = collections.length; j < len; j++) {
      collection = collections[j];
      if (collection instanceof Collection === false) {
        throw new Error("component: reset expects a collection");
      }
      list.push(collection.name);
    }
    this.collections = collections;
    this.collections_list = list;
    comma = list.join(',');
    $(this.element).attr('collections', comma);
    return delete this.element.jinit;
  };

  return Component;

})();


/*
Template class, keeps an instance of template information
Each template can only exist once
 */
var Template;

Template = (function() {

  /*
  Template constructor
  @param template [HTMLElement | String ]
  @return Template
   */
  function Template(template) {
    var $template, i, key, len, schema, schemas, t;
    if (template == null) {
      template = null;
    }
    this.original = template;
    $template = $(template);
    if ($template.length === 0) {
      throw new Error("jom: template is required");
    }
    this.ready = false;
    this.name = $template.attr("name");
    this.fontello = ($template.attr("fontello")) || null;
    if (this.name === void 0) {
      throw new Error("jom: template name attr is required");
    }
    t = $template.get(0);
    this.element = document.importNode(t.content, true);
    this.body = $(this.element).children("[body]");
    $template.get(0).template = true;
    if (this.body === void 0 || this.body.length === 0) {
      throw new Error("jom: template body attr is required");
    }
    this.schemas = [];
    schemas = $.trim($template.attr('schemas'));
    schemas = schemas.split(',');
    for (key = i = 0, len = schemas.length; i < len; key = ++i) {
      schema = schemas[key];
      schemas[key] = $.trim(schema);
    }
    this.schemas_list = schemas;
    schemas = schemas.join(',');
    this.schemas_attr = schemas;
    this.schemas_ready = false;
    this.cloned = null;
    this.errors = [];
    this.show_loader();
    this.load_schemas();
    this;
  }

  Template.prototype.load_schemas = function() {
    var i, j, len, len1, ref, ref1, results, schema;
    if (this.schemas_ready === true) {
      if (this.is_valid() === true) {
        return this.ready = true;
      } else {
        throw new Error("template: schemas are not valid");
      }
    } else {
      this.schemas_ready = true;
      if (this.schemas_list.length === 0) {
        this.schemas_ready = false;
      }
      ref = this.schemas_list;
      for (i = 0, len = ref.length; i < len; i++) {
        schema = ref[i];
        if (jom.schemas.get(schema) === null) {
          this.schemas_ready = false;
        }
      }
      if (this.schemas_ready === true) {
        ref1 = this.schemas_list;
        results = [];
        for (j = 0, len1 = ref1.length; j < len1; j++) {
          schema = ref1[j];
          results.push(this.schemas.push(jom.schemas.get(schema)));
        }
        return results;
      }
    }
  };

  Template.prototype.show_loader = function() {
    var css, loader;
    loader = $('<div class="temporary_loader"><i class="icon-loader animate-spin"></i>Loading...</div>');
    css = {
      position: "absolute",
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      "text-align": "center",
      display: "block",
      "background-color": "#fff"
    };
    loader.css(css);
    loader.children('i').css({
      position: 'absolute',
      top: "50%"
    });
    $(this.element).add(this.element.children).findAll('.temporary_loader').remove();
    if (this.fontello) {
      loader.children('i').addClass(this.fontello);
    }
    return $(this.element).append(loader);
  };

  Template.prototype.hide_loader = function(content) {
    return $(content).add(content.children).findAll('.temporary_loader').remove();
  };

  Template.prototype.is_valid = function() {
    var i, len, ref, schema;
    this.errors = [];
    ref = this.schemas;
    for (i = 0, len = ref.length; i < len; i++) {
      schema = ref[i];
      if (schema.is_valid() === false) {
        this.errors.push("template: schema `" + schema.name + "` is invalid");
      }
    }
    if (this.errors.length) {
      return false;
    } else {
      return true;
    }
  };

  Template.prototype.define_schema = function(schema) {
    if (!schema || schema instanceof Schema === false) {
      throw new Error("jom: template schemas attr is required");
    }
    return this.schemas.push(schema);
  };

  return Template;

})();

var Schema;

Schema = (function() {
  function Schema(name, obj, description) {
    if (description == null) {
      description = null;
    }
    this.name = name;
    if (!this.name) {
      throw new Error("Schema: name is not defined");
    }
    this.description = description;
    this.tree = obj;
    this.errors = [];
    this.is_valid();
    this;
  }

  Schema.prototype.is_valid = function() {
    var core, errors, schemaValidator, validator;
    validator = isMyJsonValid;
    errors = [];
    core = jom.schemas_core;
    if (core === void 0) {
      this.errors.push('There was a problem with');
      return false;
    }
    schemaValidator = validator(core, {
      verbose: true
    });
    schemaValidator(this.tree);
    if (errors.length || schemaValidator.errors) {
      if (typeof console !== "undefined" && console !== null) {
        if (typeof console.error === "function") {
          console.error('schema: ', this.name, schemaValidator.errors);
        }
      }
    }
    if (schemaValidator.errors && schemaValidator.errors.length) {
      this.errors = schemaValidator.errors;
      return false;
    } else {
      return true;
    }
    return false;
  };

  return Schema;

})();

var JOM, jom,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

JOM = (function() {
  var observer;

  observer = {};

  function JOM() {
    var self;
    self = window["jom"] = this;
    $('html').append('<foot/>');
    this.templates = [];
    this.collections = [];
    this.components = [];
    this.assets = [];
    this.schemas = [];
    this.schemas_core = {
      "id": "http://json-schema.org/draft-04/schema#",
      "$schema": "http://json-schema.org/draft-04/schema#",
      "description": "Core schema meta-schema",
      "definitions": {
        "schemaArray": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#"
          }
        },
        "positiveInteger": {
          "type": "integer",
          "minimum": 0
        },
        "positiveIntegerDefault0": {
          "allOf": [
            {
              "$ref": "#/definitions/positiveInteger"
            }, {
              "default": 0
            }
          ]
        },
        "simpleTypes": {
          "enum": ["array", "boolean", "integer", "null", "number", "object", "string"]
        },
        "stringArray": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "minItems": 1,
          "uniqueItems": true
        }
      },
      "type": "object",
      "properties": {
        "id": {
          "type": "string",
          "format": "uri"
        },
        "$schema": {
          "type": "string",
          "format": "uri"
        },
        "title": {
          "type": "string"
        },
        "description": {
          "type": "string"
        },
        "default": {},
        "multipleOf": {
          "type": "number",
          "minimum": 0,
          "exclusiveMinimum": true
        },
        "maximum": {
          "type": "number"
        },
        "exclusiveMaximum": {
          "type": "boolean",
          "default": false
        },
        "minimum": {
          "type": "number"
        },
        "exclusiveMinimum": {
          "type": "boolean",
          "default": false
        },
        "maxLength": {
          "$ref": "#/definitions/positiveInteger"
        },
        "minLength": {
          "$ref": "#/definitions/positiveIntegerDefault0"
        },
        "pattern": {
          "type": "string",
          "format": "regex"
        },
        "additionalItems": {
          "anyOf": [
            {
              "type": "boolean"
            }, {
              "$ref": "#"
            }
          ],
          "default": {}
        },
        "items": {
          "anyOf": [
            {
              "$ref": "#"
            }, {
              "$ref": "#/definitions/schemaArray"
            }
          ],
          "default": {}
        },
        "maxItems": {
          "$ref": "#/definitions/positiveInteger"
        },
        "minItems": {
          "$ref": "#/definitions/positiveIntegerDefault0"
        },
        "uniqueItems": {
          "type": "boolean",
          "default": false
        },
        "maxProperties": {
          "$ref": "#/definitions/positiveInteger"
        },
        "minProperties": {
          "$ref": "#/definitions/positiveIntegerDefault0"
        },
        "required": {
          "$ref": "#/definitions/stringArray"
        },
        "additionalProperties": {
          "anyOf": [
            {
              "type": "boolean"
            }, {
              "$ref": "#"
            }
          ],
          "default": {}
        },
        "definitions": {
          "type": "object",
          "additionalProperties": {
            "$ref": "#"
          },
          "default": {}
        },
        "properties": {
          "type": "object",
          "additionalProperties": {
            "$ref": "#"
          },
          "default": {}
        },
        "patternProperties": {
          "type": "object",
          "additionalProperties": {
            "$ref": "#"
          },
          "default": {}
        },
        "dependencies": {
          "type": "object",
          "additionalProperties": {
            "anyOf": [
              {
                "$ref": "#"
              }, {
                "$ref": "#/definitions/stringArray"
              }
            ]
          }
        },
        "enum": {
          "type": "array",
          "minItems": 1,
          "uniqueItems": true
        },
        "type": {
          "anyOf": [
            {
              "$ref": "#/definitions/simpleTypes"
            }, {
              "type": "array",
              "items": {
                "$ref": "#/definitions/simpleTypes"
              },
              "minItems": 1,
              "uniqueItems": true
            }
          ]
        },
        "allOf": {
          "$ref": "#/definitions/schemaArray"
        },
        "anyOf": {
          "$ref": "#/definitions/schemaArray"
        },
        "oneOf": {
          "$ref": "#/definitions/schemaArray"
        },
        "not": {
          "$ref": "#"
        }
      },
      "dependencies": {
        "exclusiveMaximum": ["maximum"],
        "exclusiveMinimum": ["minimum"]
      },
      "default": {}
    };
    this.schemas.core = this.schemas_core;
    this.timeout = 60 * 1000;
    this.collections.get = function(name) {
      return self.get('collection', name);
    };
    this.templates.get = function(name) {
      return self.get('template', name);
    };
    this.schemas.get = function(name) {
      return self.get('schema', name);
    };
    this.components.get = function(name) {
      return self.get('component', name);
    };
    this.assets.get = function(name) {
      return self.get('asset', name);
    };
    this.tasks();
    this.env = "production";
    this.app = {
      title: "JOM is Awesome"
    };
    this;
  }

  JOM.prototype.tasks = function() {
    return setTimeout((function(_this) {
      return function() {
        _this.load_assets();
        _this.load_components();
        _this.load_templates();
        _this.load_collections();
        _this.load_schemas();
        _this.inject_assets();
        _this.assemble_components();
        _this.watch_collections();
        return _this.tasks();
      };
    })(this), 100);
  };

  JOM.prototype.get = function(what, name) {
    var arr, item, k, key, len, ref, ref1;
    if (name == null) {
      name = false;
    }
    arr = ['collection', 'template', 'asset', 'schema'];
    if (ref = !what, indexOf.call(arr, ref) >= 0) {
      throw new Error("jom: cannot get anything naughty.");
    }
    if (name === false) {
      return this[what + "s"];
    }
    ref1 = this[what + "s"];
    for (key = k = 0, len = ref1.length; k < len; key = ++k) {
      item = ref1[key];
      if (name === item.name) {
        return this[what + "s"][key];
      }
    }
    return null;
  };

  JOM.prototype.inject_assets = function() {
    return $.each(this.assets, function(i, asset) {
      var foot;
      if ((asset.queued != null) !== true) {
        asset.queued = true;
        foot = $('html>foot');
        if (asset.content_type.part === "text/json") {
          $.getJSON(asset.source).done(function(response) {
            return foot.find("script[source='" + asset.source + "']").get(0).response = response;
          }).fail(function(xhr, status, err) {
            if (typeof console !== "undefined" && console !== null) {
              if (typeof console.info === "function") {
                console.info(status, err);
              }
            }
            throw new Error('Faild: to load a json asset');
          });
        }
        return foot.append(asset.element);
      }
    });
  };

  JOM.prototype.load_assets = function() {
    return $('link[rel="asset"]').each((function(_this) {
      return function(i, asset) {
        var exists;
        exists = $(_this.assets).filter(function() {
          return _this.source === $(asset).attr("source");
        });
        if ("jinit" in asset === false && exists.length === 0) {
          asset.jinit = true;
          return _this.assets.push(new Asset(asset));
        }
      };
    })(this));
  };

  JOM.prototype.load_schemas = function() {
    return $('foot script[asset=schema]').each((function(_this) {
      return function(i, schema) {
        var name, obj, s;
        if ("jinit" in schema === false && schema.response !== void 0) {
          schema.jinit = true;
          s = schema.response || {};
          name = $(schema).attr('name');
          obj = new Schema(name, s);
          return _this.schemas.push(obj);
        }
      };
    })(this));
  };

  JOM.prototype.load_components = function() {
    return $('component').each((function(_this) {
      return function(i, component) {
        var c;
        if ("jinit" in component === false) {
          component.jinit = true;
          c = new Component(component);
          _this.components.push(c);
          return component.component = c;
        }
      };
    })(this));
  };

  JOM.prototype.load_templates = function() {
    return $("foot link[rel=import][asset=template]").filter(function(i, link) {
      return link["import"] !== null;
    }).each((function(_this) {
      return function(i, link) {
        var templates;
        templates = link["import"].querySelectorAll("template");
        return $(templates).each(function(j, template) {
          var name;
          if (template && "jinit" in template === false && link["import"] !== void 0) {
            template.jinit = true;
            name = $(template).attr('name');
            return _this.templates.push(new Template(template));
          }
        });
      };
    })(this));
  };

  JOM.prototype.load_collections = function() {
    return $("foot script[type='text/json'][asset=collection]").each((function(_this) {
      return function(i, collection) {
        var name, response, schema, schema_attr;
        schema_attr = $(collection).attr('schema');
        schema = false;
        if (schema_attr !== void 0) {
          schema = jom.schemas.get(schema_attr);
        }
        if ("jinit" in collection === false && collection.response !== void 0 && schema) {
          collection.jinit = true;
          name = $(collection).attr("name");
          response = collection.response;
          return _this.collections.push(new Collection(name, response, schema));
        }
      };
    })(this));
  };

  JOM.prototype.assemble_components = function() {
    return $.each(this.components, (function(_this) {
      return function(i, component) {
        var c, collections_available, k, l, len, len1, ref, ref1, template;
        if (component.skip === true) {
          return true;
        }
        if (component.ready === true) {
          component.skip = true;
          component.template.hide_loader(component.root);
          return true;
        }
        if ("timer" in component === false) {
          component.timer = new Date();
        }
        if (new Date() - component.timer > _this.timeout) {
          component.trigger('timeout');
          component.trigger('error', 'timeout');
          throw new Error("jom: Component `" + component.name + "` timedout");
        }
        template = jom.templates.get(component.attr.template);
        if (component.init.template === false && template) {
          component.init.template = true;
          template = new Template(template.original);
          template.show_loader();
          component.define_template(template);
          component.handle_template_scripts(template.element);
          component.template.component = component;
          component.root.appendChild(template.element);
          template.element = component.root;
        }
        if (template && template.ready === false) {
          component.template.load_schemas();
        }
        if (component.init.collections === false) {
          collections_available = true;
          if (component.collections_list.length === 0) {
            collections_available = false;
          }
          ref = component.collections_list;
          for (k = 0, len = ref.length; k < len; k++) {
            c = ref[k];
            if (jom.collections.get(c) === null) {
              collections_available = false;
            }
          }
        }
        if (component.init.collections === false && collections_available === true) {
          component.init.collections = true;
          ref1 = component.collections_list;
          for (l = 0, len1 = ref1.length; l < len1; l++) {
            c = ref1[l];
            component.define_collection(jom.collections.get(c));
          }
        }
        if (component.init.template === true && component.init.collections === true && component.template.ready === true && _this.scripts_loaded(component) === true) {
          _this.repeater(component);
          component.handlebars(component.root.children, component);
          _this.image_source_change(component);
          component.show();
          component.ready = true;
          return component.trigger('ready');
        }
      };
    })(this));
  };

  JOM.prototype.scripts_loaded = function(component) {
    var all_done, scripts;
    all_done = true;
    scripts = $(component.root).add(component.root.children).findAll('script[src]');
    $(scripts).each(function(i, script) {
      if ((script.has_loaded != null) !== true) {
        return all_done = false;
      }
    });
    return all_done;
  };

  JOM.prototype.image_source_change = function(component) {
    return $(component.root).add(component.root.children).findAll('[body] img').not('[repeat] img').each(function(i, image) {
      var $image;
      $image = $(image);
      return $image.attr('src', $image.attr("source"));
    });
  };

  JOM.prototype.repeater = function(component, context) {
    if (context == null) {
      context = null;
    }
    if (context instanceof ShadowRoot) {
      context = context.children;
    }
    context = context || $(component.template.element.children).findAll('[body]');
    return $('[repeat]', context).each(function(i, repeater) {
      var items;
      repeater = $(repeater);
      items = component.repeat(repeater);
      items.insertAfter(repeater);
      return repeater.hide();
    });
  };

  JOM.prototype.watch_collections = function() {
    var collection, key, ref, results;
    ref = this.collections;
    results = [];
    for (key in ref) {
      collection = ref[key];
      if (collection.observing === false) {
        collection.observing = true;
        results.push(new Observe(collection, collection.document, (function(_this) {
          return function(changes) {
            var change, results1;
            results1 = [];
            for (key in changes) {
              change = changes[key];
              results1.push($.each(_this.components, function(i, component) {
                var ref1;
                if (ref1 = change.collection.name, indexOf.call(component.collections_list, ref1) >= 0) {
                  $(component.root).add(component.root.children).findAll('[repeated]').remove();
                  $(component.root).add(component.root.children).findAll('[repeat]').show();
                  _this.repeater(component, component.root);
                  component.handlebars(component.root, component);
                  _this.image_source_change(component);
                  $(component.root.host).trigger("change", [change, component.collections]);
                  $(component.root).find('[repeat]').hide();
                  return component.trigger("change", change);
                }
              }));
            }
            return results1;
          };
        })(this)));
      } else {
        results.push(void 0);
      }
    }
    return results;
  };

  JOM.prototype.resolve = function(path) {
    var first, href, pr, result, second, url;
    href = location.href;
    pr = href.replace(location.protocol + "//", "").replace(location.host, "");
    url = pr;
    first = path[0];
    second = path[1];
    result = "";
    switch (first) {
      case "/":
        if (second !== "/") {
          result = path;
        }
        break;
      default:
        result = url.replace(/([\/]?[^\/]+[\/]?)$/g, "/" + path);
    }
    return result;
  };

  JOM.getter('shadow', function() {
    return new Shadow();
  });

  return JOM;

})();

jom = JOM = new JOM();
