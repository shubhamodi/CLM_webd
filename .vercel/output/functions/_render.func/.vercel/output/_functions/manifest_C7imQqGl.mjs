import 'cookie';
import { bold, red, yellow, dim, blue } from 'kleur/colors';
import './chunks/astro_CNcTebje.mjs';
import 'clsx';
import { compile } from 'path-to-regexp';

const dateTimeFormat = new Intl.DateTimeFormat([], {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false
});
const levels = {
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  silent: 90
};
function log(opts, level, label, message, newLine = true) {
  const logLevel = opts.level;
  const dest = opts.dest;
  const event = {
    label,
    level,
    message,
    newLine
  };
  if (!isLogLevelEnabled(logLevel, level)) {
    return;
  }
  dest.write(event);
}
function isLogLevelEnabled(configuredLogLevel, level) {
  return levels[configuredLogLevel] <= levels[level];
}
function info(opts, label, message, newLine = true) {
  return log(opts, "info", label, message, newLine);
}
function warn(opts, label, message, newLine = true) {
  return log(opts, "warn", label, message, newLine);
}
function error(opts, label, message, newLine = true) {
  return log(opts, "error", label, message, newLine);
}
function debug(...args) {
  if ("_astroGlobalDebug" in globalThis) {
    globalThis._astroGlobalDebug(...args);
  }
}
function getEventPrefix({ level, label }) {
  const timestamp = `${dateTimeFormat.format(/* @__PURE__ */ new Date())}`;
  const prefix = [];
  if (level === "error" || level === "warn") {
    prefix.push(bold(timestamp));
    prefix.push(`[${level.toUpperCase()}]`);
  } else {
    prefix.push(timestamp);
  }
  if (label) {
    prefix.push(`[${label}]`);
  }
  if (level === "error") {
    return red(prefix.join(" "));
  }
  if (level === "warn") {
    return yellow(prefix.join(" "));
  }
  if (prefix.length === 1) {
    return dim(prefix[0]);
  }
  return dim(prefix[0]) + " " + blue(prefix.splice(1).join(" "));
}
if (typeof process !== "undefined") {
  let proc = process;
  if ("argv" in proc && Array.isArray(proc.argv)) {
    if (proc.argv.includes("--verbose")) ; else if (proc.argv.includes("--silent")) ; else ;
  }
}
class Logger {
  options;
  constructor(options) {
    this.options = options;
  }
  info(label, message, newLine = true) {
    info(this.options, label, message, newLine);
  }
  warn(label, message, newLine = true) {
    warn(this.options, label, message, newLine);
  }
  error(label, message, newLine = true) {
    error(this.options, label, message, newLine);
  }
  debug(label, ...messages) {
    debug(label, ...messages);
  }
  level() {
    return this.options.level;
  }
  forkIntegrationLogger(label) {
    return new AstroIntegrationLogger(this.options, label);
  }
}
class AstroIntegrationLogger {
  options;
  label;
  constructor(logging, label) {
    this.options = logging;
    this.label = label;
  }
  /**
   * Creates a new logger instance with a new label, but the same log options.
   */
  fork(label) {
    return new AstroIntegrationLogger(this.options, label);
  }
  info(message) {
    info(this.options, this.label, message);
  }
  warn(message) {
    warn(this.options, this.label, message);
  }
  error(message) {
    error(this.options, this.label, message);
  }
  debug(message) {
    debug(this.label, message);
  }
}

function getRouteGenerator(segments, addTrailingSlash) {
  const template = segments.map((segment) => {
    return "/" + segment.map((part) => {
      if (part.spread) {
        return `:${part.content.slice(3)}(.*)?`;
      } else if (part.dynamic) {
        return `:${part.content}`;
      } else {
        return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      }
    }).join("");
  }).join("");
  let trailing = "";
  if (addTrailingSlash === "always" && segments.length) {
    trailing = "/";
  }
  const toPath = compile(template + trailing);
  return (params) => {
    const path = toPath(params);
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware(_, next) {
      return next();
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes
  };
}

const manifest = deserializeManifest({"adapterName":"@astrojs/vercel/serverless","routes":[{"file":"404.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/404","isIndex":false,"type":"page","pattern":"^\\/404$","segments":[[{"content":"404","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/404.astro","pathname":"/404","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"never"}}},{"file":"about/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/about","isIndex":false,"type":"page","pattern":"^\\/about$","segments":[[{"content":"about","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/about.astro","pathname":"/about","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"never"}}},{"file":"api/register","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/register","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/register$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"register","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/register.ts","pathname":"/api/register","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"never"}}},{"file":"api/updateDatabase","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/updatedatabase","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/updateDatabase$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"updateDatabase","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/updateDatabase.ts","pathname":"/api/updateDatabase","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"never"}}},{"file":"contact/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/contact","isIndex":false,"type":"page","pattern":"^\\/contact$","segments":[[{"content":"contact","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/contact.astro","pathname":"/contact","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"never"}}},{"file":"demo/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/demo","isIndex":false,"type":"page","pattern":"^\\/demo$","segments":[[{"content":"demo","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/demo.astro","pathname":"/demo","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"never"}}},{"file":"faq/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/faq","isIndex":false,"type":"page","pattern":"^\\/faq$","segments":[[{"content":"faq","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/faq.astro","pathname":"/faq","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"never"}}},{"file":"features/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/features","isIndex":false,"type":"page","pattern":"^\\/features$","segments":[[{"content":"features","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/features.astro","pathname":"/features","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"never"}}},{"file":"landing/click-through/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/landing/click-through","isIndex":false,"type":"page","pattern":"^\\/landing\\/click-through$","segments":[[{"content":"landing","dynamic":false,"spread":false}],[{"content":"click-through","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/landing/click-through.astro","pathname":"/landing/click-through","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"never"}}},{"file":"landing/lead-generation/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/landing/lead-generation","isIndex":false,"type":"page","pattern":"^\\/landing\\/lead-generation$","segments":[[{"content":"landing","dynamic":false,"spread":false}],[{"content":"lead-generation","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/landing/lead-generation.astro","pathname":"/landing/lead-generation","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"never"}}},{"file":"landing/pre-launch/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/landing/pre-launch","isIndex":false,"type":"page","pattern":"^\\/landing\\/pre-launch$","segments":[[{"content":"landing","dynamic":false,"spread":false}],[{"content":"pre-launch","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/landing/pre-launch.astro","pathname":"/landing/pre-launch","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"never"}}},{"file":"landing/product/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/landing/product","isIndex":false,"type":"page","pattern":"^\\/landing\\/product$","segments":[[{"content":"landing","dynamic":false,"spread":false}],[{"content":"product","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/landing/product.astro","pathname":"/landing/product","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"never"}}},{"file":"landing/sales/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/landing/sales","isIndex":false,"type":"page","pattern":"^\\/landing\\/sales$","segments":[[{"content":"landing","dynamic":false,"spread":false}],[{"content":"sales","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/landing/sales.astro","pathname":"/landing/sales","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"never"}}},{"file":"landing/subscription/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/landing/subscription","isIndex":false,"type":"page","pattern":"^\\/landing\\/subscription$","segments":[[{"content":"landing","dynamic":false,"spread":false}],[{"content":"subscription","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/landing/subscription.astro","pathname":"/landing/subscription","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"never"}}},{"file":"login/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/login","isIndex":false,"type":"page","pattern":"^\\/login$","segments":[[{"content":"login","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/login.astro","pathname":"/login","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"never"}}},{"file":"pricing/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/pricing","isIndex":false,"type":"page","pattern":"^\\/pricing$","segments":[[{"content":"pricing","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/pricing.astro","pathname":"/pricing","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"never"}}},{"file":"privacy/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/privacy","isIndex":false,"type":"page","pattern":"^\\/privacy$","segments":[[{"content":"privacy","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/privacy.astro","pathname":"/privacy","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"never"}}},{"file":"privacy/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/privacy","isIndex":false,"type":"page","pattern":"^\\/privacy$","segments":[[{"content":"privacy","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/privacy.md","pathname":"/privacy","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"never"}}},{"file":"rss.xml","links":[],"scripts":[],"styles":[],"routeData":{"route":"/rss.xml","isIndex":false,"type":"endpoint","pattern":"^\\/rss\\.xml$","segments":[[{"content":"rss.xml","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/rss.xml.ts","pathname":"/rss.xml","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"never"}}},{"file":"services/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/services","isIndex":false,"type":"page","pattern":"^\\/services$","segments":[[{"content":"services","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/services.astro","pathname":"/services","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"never"}}},{"file":"signup/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/signup","isIndex":false,"type":"page","pattern":"^\\/signup$","segments":[[{"content":"signup","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/signup.astro","pathname":"/signup","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"never"}}},{"file":"terms/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/terms","isIndex":false,"type":"page","pattern":"^\\/terms$","segments":[[{"content":"terms","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/terms.astro","pathname":"/terms","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"never"}}},{"file":"terms/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/terms","isIndex":false,"type":"page","pattern":"^\\/terms$","segments":[[{"content":"terms","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/terms.md","pathname":"/terms","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"never"}}},{"file":"whatsapp/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/whatsapp","isIndex":false,"type":"page","pattern":"^\\/whatsapp$","segments":[[{"content":"whatsapp","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/whatsapp.astro","pathname":"/whatsapp","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"never"}}},{"file":"index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"never"}}},{"file":"","links":[],"scripts":[{"stage":"head-inline","children":"!(function(w,p,f,c){if(!window.crossOriginIsolated && !navigator.serviceWorker) return;c=w[p]=Object.assign(w[p]||{},{\"lib\":\"/~partytown/\",\"debug\":false});c[f]=(c[f]||[]).concat([\"dataLayer.push\"])})(window,'partytown','forward');/* Partytown 0.8.2 - MIT builder.io */\n!function(t,e,n,i,o,r,a,s,d,c,l,p){function u(){p||(p=1,\"/\"==(a=(r.lib||\"/~partytown/\")+(r.debug?\"debug/\":\"\"))[0]&&(d=e.querySelectorAll('script[type=\"text/partytown\"]'),i!=t?i.dispatchEvent(new CustomEvent(\"pt1\",{detail:t})):(s=setTimeout(f,1e4),e.addEventListener(\"pt0\",w),o?h(1):n.serviceWorker?n.serviceWorker.register(a+(r.swPath||\"partytown-sw.js\"),{scope:a}).then((function(t){t.active?h():t.installing&&t.installing.addEventListener(\"statechange\",(function(t){\"activated\"==t.target.state&&h()}))}),console.error):f())))}function h(t){c=e.createElement(t?\"script\":\"iframe\"),t||(c.style.display=\"block\",c.style.width=\"0\",c.style.height=\"0\",c.style.border=\"0\",c.style.visibility=\"hidden\",c.setAttribute(\"aria-hidden\",!0)),c.src=a+\"partytown-\"+(t?\"atomics.js?v=0.8.2\":\"sandbox-sw.html?\"+Date.now()),e.querySelector(r.sandboxParent||\"body\").appendChild(c)}function f(n,o){for(w(),i==t&&(r.forward||[]).map((function(e){delete t[e.split(\".\")[0]]})),n=0;n<d.length;n++)(o=e.createElement(\"script\")).innerHTML=d[n].innerHTML,o.nonce=r.nonce,e.head.appendChild(o);c&&c.parentNode.removeChild(c)}function w(){clearTimeout(s)}r=t.partytown||{},i==t&&(r.forward||[]).map((function(e){l=t,e.split(\".\").map((function(e,n,i){l=l[i[n]]=n+1<i.length?\"push\"==i[n+1]?[]:l[i[n]]||{}:function(){(t._ptf=t._ptf||[]).push(i,arguments)}}))})),\"complete\"==e.readyState?u():(t.addEventListener(\"DOMContentLoaded\",u),t.addEventListener(\"load\",u))}(window,document,navigator,top,window.crossOriginIsolated);;((d,s)=>(s=d.currentScript,d.addEventListener('astro:before-swap',()=>s.remove(),{once:true})))(document);"}],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"never"}}}],"site":"https://www.contravault.com/","base":"/","trailingSlash":"never","compressHTML":true,"componentMetadata":[["/Users/tanmayjuneja/Documents/Blozum Company Docs/CLM Website/src/pages/landing/click-through.astro",{"propagation":"none","containsHead":true}],["/Users/tanmayjuneja/Documents/Blozum Company Docs/CLM Website/src/pages/landing/lead-generation.astro",{"propagation":"none","containsHead":true}],["/Users/tanmayjuneja/Documents/Blozum Company Docs/CLM Website/src/pages/landing/pre-launch.astro",{"propagation":"none","containsHead":true}],["/Users/tanmayjuneja/Documents/Blozum Company Docs/CLM Website/src/pages/landing/product.astro",{"propagation":"none","containsHead":true}],["/Users/tanmayjuneja/Documents/Blozum Company Docs/CLM Website/src/pages/landing/sales.astro",{"propagation":"none","containsHead":true}],["/Users/tanmayjuneja/Documents/Blozum Company Docs/CLM Website/src/pages/landing/subscription.astro",{"propagation":"none","containsHead":true}],["/Users/tanmayjuneja/Documents/Blozum Company Docs/CLM Website/src/pages/privacy.md",{"propagation":"none","containsHead":true}],["/Users/tanmayjuneja/Documents/Blozum Company Docs/CLM Website/src/pages/terms.md",{"propagation":"none","containsHead":true}],["/Users/tanmayjuneja/Documents/Blozum Company Docs/CLM Website/src/pages/[...blog]/[...page].astro",{"propagation":"in-tree","containsHead":true}],["/Users/tanmayjuneja/Documents/Blozum Company Docs/CLM Website/src/pages/[...blog]/[category]/[...page].astro",{"propagation":"in-tree","containsHead":true}],["/Users/tanmayjuneja/Documents/Blozum Company Docs/CLM Website/src/pages/[...blog]/[tag]/[...page].astro",{"propagation":"in-tree","containsHead":true}],["/Users/tanmayjuneja/Documents/Blozum Company Docs/CLM Website/src/pages/[...blog]/index.astro",{"propagation":"in-tree","containsHead":true}],["/Users/tanmayjuneja/Documents/Blozum Company Docs/CLM Website/src/pages/about.astro",{"propagation":"none","containsHead":true}],["/Users/tanmayjuneja/Documents/Blozum Company Docs/CLM Website/src/pages/contact.astro",{"propagation":"none","containsHead":true}],["/Users/tanmayjuneja/Documents/Blozum Company Docs/CLM Website/src/pages/features.astro",{"propagation":"none","containsHead":true}],["/Users/tanmayjuneja/Documents/Blozum Company Docs/CLM Website/src/pages/pricing.astro",{"propagation":"none","containsHead":true}],["/Users/tanmayjuneja/Documents/Blozum Company Docs/CLM Website/src/pages/services.astro",{"propagation":"none","containsHead":true}],["/Users/tanmayjuneja/Documents/Blozum Company Docs/CLM Website/src/pages/whatsapp.astro",{"propagation":"none","containsHead":true}],["/Users/tanmayjuneja/Documents/Blozum Company Docs/CLM Website/src/pages/404.astro",{"propagation":"none","containsHead":true}],["/Users/tanmayjuneja/Documents/Blozum Company Docs/CLM Website/src/pages/faq.astro",{"propagation":"none","containsHead":true}],["/Users/tanmayjuneja/Documents/Blozum Company Docs/CLM Website/src/pages/index.astro",{"propagation":"none","containsHead":true}],["/Users/tanmayjuneja/Documents/Blozum Company Docs/CLM Website/src/pages/login.astro",{"propagation":"none","containsHead":true}],["/Users/tanmayjuneja/Documents/Blozum Company Docs/CLM Website/src/pages/privacy.astro",{"propagation":"none","containsHead":true}],["/Users/tanmayjuneja/Documents/Blozum Company Docs/CLM Website/src/pages/signup.astro",{"propagation":"none","containsHead":true}],["/Users/tanmayjuneja/Documents/Blozum Company Docs/CLM Website/src/pages/terms.astro",{"propagation":"none","containsHead":true}],["\u0000astro:content",{"propagation":"in-tree","containsHead":false}],["/Users/tanmayjuneja/Documents/Blozum Company Docs/CLM Website/src/utils/blog.ts",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/[...blog]/[...page]@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astrojs-ssr-virtual-entry",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/[...blog]/[category]/[...page]@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/[...blog]/[tag]/[...page]@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/[...blog]/index@_@astro",{"propagation":"in-tree","containsHead":false}],["/Users/tanmayjuneja/Documents/Blozum Company Docs/CLM Website/src/pages/rss.xml.ts",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/rss.xml@_@ts",{"propagation":"in-tree","containsHead":false}]],"renderers":[],"clientDirectives":[["idle","(()=>{var i=t=>{let e=async()=>{await(await t())()};\"requestIdleCallback\"in window?window.requestIdleCallback(e):setTimeout(e,200)};(self.Astro||(self.Astro={})).idle=i;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var s=(i,t)=>{let a=async()=>{await(await i())()};if(t.value){let e=matchMedia(t.value);e.matches?a():e.addEventListener(\"change\",a,{once:!0})}};(self.Astro||(self.Astro={})).media=s;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var l=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let a of e)if(a.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=l;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000noop-middleware":"_noop-middleware.mjs","\u0000@astrojs-manifest":"manifest_C7imQqGl.mjs","/Users/tanmayjuneja/Documents/Blozum Company Docs/CLM Website/node_modules/@astrojs/react/vnode-children.js":"chunks/vnode-children_BkR_XoPb.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"chunks/generic_DYvCwyR8.mjs","\u0000@astro-page:src/pages/404@_@astro":"chunks/404_BoAlndES.mjs","\u0000@astro-page:src/pages/about@_@astro":"chunks/about_DxIbRcWW.mjs","\u0000@astro-page:src/pages/api/register@_@ts":"chunks/register_CJ6qoiPg.mjs","\u0000@astro-page:src/pages/api/updateDatabase@_@ts":"chunks/updateDatabase_eSM5-5Z3.mjs","\u0000@astro-page:src/pages/contact@_@astro":"chunks/contact_B-PpUOry.mjs","\u0000@astro-page:src/pages/demo@_@astro":"chunks/demo_Ol3PDlTE.mjs","\u0000@astro-page:src/pages/faq@_@astro":"chunks/faq_BsdT0lSJ.mjs","\u0000@astro-page:src/pages/features@_@astro":"chunks/features_1HNRkRwe.mjs","\u0000@astro-page:src/pages/landing/click-through@_@astro":"chunks/click-through_DBcXn8M6.mjs","\u0000@astro-page:src/pages/landing/lead-generation@_@astro":"chunks/lead-generation_DSq95Ayk.mjs","\u0000@astro-page:src/pages/landing/pre-launch@_@astro":"chunks/pre-launch_DHY-yENz.mjs","\u0000@astro-page:src/pages/landing/product@_@astro":"chunks/product_G5AOEdmO.mjs","\u0000@astro-page:src/pages/landing/sales@_@astro":"chunks/sales_HdwVPxH9.mjs","\u0000@astro-page:src/pages/landing/subscription@_@astro":"chunks/subscription_DHKhsnyi.mjs","\u0000@astro-page:src/pages/login@_@astro":"chunks/login_Dg9F8AnY.mjs","\u0000@astro-page:src/pages/pricing@_@astro":"chunks/pricing_YksEWELB.mjs","\u0000@astro-page:src/pages/privacy@_@astro":"chunks/privacy_CNs21Ric.mjs","\u0000@astro-page:src/pages/privacy@_@md":"chunks/privacy_DJARvYxQ.mjs","\u0000@astro-page:src/pages/rss.xml@_@ts":"chunks/rss_lylWcwgV.mjs","\u0000@astro-page:src/pages/services@_@astro":"chunks/services_BpvfpEWL.mjs","\u0000@astro-page:src/pages/signup@_@astro":"chunks/signup_D45yyxx7.mjs","\u0000@astro-page:src/pages/terms@_@astro":"chunks/terms_Du2iCFOs.mjs","\u0000@astro-page:src/pages/terms@_@md":"chunks/terms_DwfdmAI-.mjs","\u0000@astro-page:src/pages/whatsapp@_@astro":"chunks/whatsapp_B98TfvyG.mjs","\u0000@astro-page:src/pages/[...blog]/[category]/[...page]@_@astro":"chunks/_.._CVUFay22.mjs","\u0000@astro-page:src/pages/[...blog]/[tag]/[...page]@_@astro":"chunks/_.._BukQMfiN.mjs","\u0000@astro-page:src/pages/[...blog]/[...page]@_@astro":"chunks/_.._D8FQMUMo.mjs","\u0000@astro-page:src/pages/index@_@astro":"chunks/index_DHMNGPiG.mjs","\u0000@astro-page:src/pages/[...blog]/index@_@astro":"chunks/index_tQEvLXge.mjs","/Users/tanmayjuneja/Documents/Blozum Company Docs/CLM Website/src/assets/images/BLZ_new.svg":"chunks/BLZ_new_BSmlkSTI.mjs","/Users/tanmayjuneja/Documents/Blozum Company Docs/CLM Website/src/assets/images/app-store.png":"chunks/app-store_X0wRXlF5.mjs","/Users/tanmayjuneja/Documents/Blozum Company Docs/CLM Website/src/assets/images/google-play.png":"chunks/google-play_BBCkFASF.mjs","/Users/tanmayjuneja/Documents/Blozum Company Docs/CLM Website/src/content/post/astrowind-template-in-depth.mdx?astroContentCollectionEntry=true":"chunks/astrowind-template-in-depth_BliNn-8j.mjs","/Users/tanmayjuneja/Documents/Blozum Company Docs/CLM Website/src/content/post/astrowind-template-in-depth.mdx?astroPropagatedAssets":"chunks/astrowind-template-in-depth_CE17Xby_.mjs","/Users/tanmayjuneja/Documents/Blozum Company Docs/CLM Website/src/content/post/astrowind-template-in-depth.mdx":"chunks/astrowind-template-in-depth_5h1h7JUk.mjs","/astro/hoisted.js?q=0":"hoisted-BIJKVhCs.js","~/components/ui/Form.tsx":"Form-BtVBsnar.js","@astrojs/react/client.js":"client-CHO8tTYE.js","/astro/hoisted.js?q=1":"hoisted-C-yFQQvw.js","~/components/FAQ":"FAQ-DUHDtlu8.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/_astro/app-store.t3tG4Jz3.png","/_astro/BLZ_new.CFQzJEsA.svg","/_astro/google-play.ISTMcpLO.png","/_astro/favicon.DzE1ydnO.ico","/_astro/favicon.CB--Vq8_.svg","/_astro/click-through.ChQTCJUi.css","/_astro/faq.DDQBAvMT.css","/FAQ-DUHDtlu8.js","/Form-BtVBsnar.js","/client-CHO8tTYE.js","/dashboard.png","/dashboard2.png","/hoisted-BIJKVhCs.js","/hoisted-C-yFQQvw.js","/_astro/index.BmEITYko.js","/_astro/index.ChMpTUw4.js","/_astro/jsx-runtime.CF0zoOaq.js","/_astro/whatsapp.461f6212.CZP2n6f1.js","/_astro/whatsapp.BZSSoeoh.css","/404.html","/about/index.html","/api/register","/api/updateDatabase","/contact/index.html","/demo/index.html","/faq/index.html","/features/index.html","/landing/click-through/index.html","/landing/lead-generation/index.html","/landing/pre-launch/index.html","/landing/product/index.html","/landing/sales/index.html","/landing/subscription/index.html","/login/index.html","/pricing/index.html","/privacy/index.html","/privacy/index.html","/rss.xml","/services/index.html","/signup/index.html","/terms/index.html","/terms/index.html","/whatsapp/index.html","/index.html","/~partytown/partytown-atomics.js","/~partytown/partytown-media.js","/~partytown/partytown-sw.js","/~partytown/partytown.js"],"buildFormat":"directory","checkOrigin":false});

export { AstroIntegrationLogger as A, Logger as L, getEventPrefix as g, levels as l, manifest };
