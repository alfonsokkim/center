from bs4 import BeautifulSoup

def get_meta_tag(doc):
    soup = BeautifulSoup(doc, features="html.parser")
    print(soup.find_all("meta"))

str = """
<head><meta http-equiv="origin-trial" content="A7vZI3v+Gz7JfuRolKNM4Aff6zaGuT7X0mf3wtoZTnKv6497cVMnhy03KDqX7kBz/q/iidW7srW31oQbBt4VhgoAAACUeyJvcmlnaW4iOiJodHRwczovL3d3dy5nb29nbGUuY29tOjQ0MyIsImZlYXR1cmUiOiJEaXNhYmxlVGhpcmRQYXJ0eVN0b3JhZ2VQYXJ0aXRpb25pbmczIiwiZXhwaXJ5IjoxNzU3OTgwODAwLCJpc1N1YmRvbWFpbiI6dHJ1ZSwiaXNUaGlyZFBhcnR5Ijp0cnVlfQ=="><style>:root{--cmp-color-primary:#0071f2;--cmp-color-primary-dark:#0065d9;--cmp-color-primary-darker:#005ac1;--cmp-color-primary-border:#0071f2;--cmp-color-primary-hover:#0065d9;--cmp-color-primary-active:#005ac1;--cmp-color-secondary:#c7ccd3;--cmp-color-secondary-border:#c7ccd3;--cmp-color-secondary-hover:#c7ccd3;--cmp-color-secondary-active:#c7ccd3;--cmp-color-tertiary:#c7ccd3;--cmp-color-tertiary-border:#c7ccd3;--cmp-color-tertiary-hover:#c7ccd3;--cmp-color-tertiary-active:#c7ccd3;--cmp-color-white:#fff;--cmp-color-grey-1:#f4f4f4;--cmp-color-grey-2:#eee;--cmp-color-grey-3:#e8eff9;--cmp-color-grey-4:#d2e0f3;--cmp-color-grey-5:#c7ccd3;--cmp-color-grey-6:#838b95;--cmp-color-grey-7:#2b333b;--cmp-color-grey-8:#2d3339;--cmp-color-grey-rgaa:#929292;--cmp-color-black:#050a0f;--cmp-color-backdrop:rgba(0,0,0,.5);--cmp-color-links:#0071f2;--cmp-color-links-hover:#0065d9;--cmp-layout-container-border-radius:20px;--cmp-layout-container-border-radius-mobile:8px;--cmp-layout-container-mobile-height:600px;--cmp-layout-container-mobile-width:100%;--cmp-layout-container-desktop-height:480px;--cmp-layout-container-desktop-width:770px;--cmp-layout-container-desktop-max-width:770px;--cmp-layout-container-desktop-max-height:480px;--cmp-layout-container-mobile-max-width:600px;--cmp-layout-container-mobile-max-height:600px;--cmp-spacing-1:4px;--cmp-spacing-2:8px;--cmp-spacing-3:12px;--cmp-spacing-4:16px;--cmp-spacing-5:20px;--cmp-spacing-6:24px;--cmp-spacing-7:32px;--cmp-spacing-8:40px;--cmp-spacing-9:50px;--cmp-margins-h1-bottom:var(--cmp-spacing-3);--cmp-paddings-layout-body:16px;--cmp-colors-text-link:var(--cmp-color-primary-dark);--cmp-colors-text-link-hover:var(--cmp-color-primary-darker);--cmp-colors-background-body:var(--cmp-color-white);--cmp-colors-background-header:transparent;--cmp-colors-background-primary:var(--cmp-color-primary);--cmp-colors-background-primary-hover:var(--cmp-color-primary-dark);--cmp-colors-background-primary-active:var(--cmp-color-primary-darker);--cmp-colors-background-secondary:transparent;--cmp-colors-background-secondary-hover:var(--cmp-color-primary-dark);--cmp-colors-background-secondary-active:var(--cmp-color-primary-darker);--cmp-colors-background-tertiary:var(--cmp-color-primary);--cmp-colors-background-tertiary-hover:var(--cmp-color-primary-dark);--cmp-colors-background-tertiary-active:var(--cmp-color-primary-darker);--cmp-colors-background-quaternary:var(--cmp-color-grey-1);--cmp-colors-background-quaternary-hover:var(--cmp-color-grey-1);--cmp-colors-background-quaternary-active:var(--cmp-color-grey-1);--cmp-colors-text-default:var(--cmp-color-grey-8);--cmp-colors-text-h1:var(--cmp-color-black);--cmp-colors-text-on-primary:var(--cmp-color-white);--cmp-colors-text-on-primary-hover:var(--cmp-color-white);--cmp-colors-text-on-primary-active:var(--cmp-color-white);--cmp-colors-text-on-secondary:var(--cmp-color-secondary);--cmp-colors-text-on-secondary-hover:var(--cmp-color-secondary);--cmp-colors-text-on-secondary-active:var(--cmp-color-secondary);--cmp-colors-text-on-tertiary:var(--cmp-color-secondary);--cmp-colors-text-on-tertiary-hover:var(--cmp-color-secondary);--cmp-colors-text-on-tertiary-active:var(--cmp-color-secondary);--cmp-colors-text-on-quaternary:var(--cmp-color-primary);--cmp-colors-text-on-quaternary-hover:var(--cmp-color-primary-dark);--cmp-colors-text-on-quaternary-active:var(--cmp-color-primary-darker);--cmp-colors-border-primary:var(--cmp-color-primary);--cmp-colors-border-secondary:var(--cmp-color-secondary);--cmp-colors-border-tertiary:var(--cmp-color-secondary);--cmp-colors-border-tertiary-hover:var(--cmp-color-secondary);--cmp-colors-border-tertiary-active:var(--cmp-color-secondary);--cmp-colors-border-quaternary:transparent;--cmp-colors-border-quaternary-hover:var(--cmp-color-primary);--cmp-colors-border-quaternary-active:var(--cmp-color-primary-dark);--cmp-colors-border-header:var(--cmp-color-grey-2);--cmp-colors-border-spinner:var(--cmp-color-primary);--cmp-colors-border-spinner-background:var(--cmp-color-grey-3);--cmp-components-navigation-height:76px;--cmp-components-navigation-height-mobile:218px;--cmp-components-button-padding:18px 24px;--cmp-components-button-border-radius:30px;--cmp-components-navigation-padding-mobile:24px 12px 0;--cmp-typography-align:left;--cmp-typography-align-h1:center;--cmp-typography-size-h1:16px;--cmp-typography-weight-h1:500;--cmp-typography-weight-h1-bold:bolder;--cmp-template-1-components-button-refuse-top-position:-40px;--cmp-template-1-components-button-refuse-padding:8px 15px;--cmp-template-1-components-button-refuse-font-size:15px}.fast-cmp-spinner{animation:fast-cmp-spin 1.1s linear infinite;border:12px solid #e8eff9;border-left:12px solid #0071f2;border:12px solid var(--cmp-colors-border-spinner-background);border-left-color:var(--cmp-colors-border-spinner);border-radius:50%;font-size:16px;height:154px;left:50%;margin:-77px 0 0 -77px;position:absolute;top:50%;transform:translateZ(0);width:154px}@keyframes fast-cmp-spin{0%{transform:rotate(0deg)}to{transform:rotate(1turn)}}#fast-cmp-settings,.fast-cmp-container button{background-color:#f4f4f4;background-color:var(--cmp-color-grey-1);border:none;border-radius:30px;color:#2b333b;color:var(--cmp-color-grey-7);cursor:pointer;font-family:system-ui;font-weight:400;line-height:1;margin:0;padding:12px 24px;transition:all .2s ease}.fast-cmp-container button:disabled{cursor:default;opacity:.5}#fast-cmp-settings:not(:disabled):active,#fast-cmp-settings:not(:disabled):hover,.fast-cmp-container button:not(:disabled):active,.fast-cmp-container button:not(:disabled):hover{background-color:#eee;background-color:var(--cmp-color-grey-2);color:#2b333b;color:var(--cmp-color-grey-7)}#fast-cmp-root{height:100%;left:0;position:fixed;top:0;width:100%;z-index:2147483647}@supports (-webkit-touch-callout:none){#fast-cmp-root{height:-webkit-fill-available}}#fast-cmp-root>iframe{border:none;bottom:0;color-scheme:light;height:100%;left:0;position:relative;right:0;top:0;width:100%}#fast-cmp-backdrop{background:rgba(0,0,0,.5);background:var(--cmp-color-backdrop);bottom:0;left:0;position:fixed;right:0;top:0;z-index:-1}#fast-cmp-tracing{height:0;left:0;opacity:0;position:absolute;top:0;width:0;z-index:-1}#fast-cmp-settings{bottom:8px;font-size:11px;left:8px;opacity:1;padding:6px 9px;position:fixed;width:auto;z-index:2147483647}html[data-fast-cmp-locked]{min-height:100vh!important;min-height:calc(var(--fast-cmp-vh, 1vh)*100)!important}html[data-fast-cmp-locked] body{left:0;position:fixed!important;right:0;width:100%!important}</style><script type="text/javascript" async="" charset="utf-8" src="https://www.gstatic.com/recaptcha/releases/QvLuXwupqtKCyjBw2xIzFLIf/recaptcha__en_gb.js" crossorigin="anonymous" integrity="sha384-r7ws9y9NqFSNWUFHfqEJ1lHRralOC4lWeqLy6nnBrcNz1gXpVrgSsVygRVn2b+pA"></script><script type="text/javascript" async="" charset="UTF-8" src="https://static.fastcmp.com/fast-cmp-stub.modern.b653304859700ef48693.js"></script>
<title>HTML meta tag</title>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="title" property="og:title" content="W3Schools.com">
<meta name="Keywords" content="HTML, Python, CSS, SQL, JavaScript, How to, PHP, Java, C, C++, C#, jQuery, Bootstrap, Colors, W3.CSS, XML, MySQL, Icons, NodeJS, React, Graphics, Angular, R, AI, Git, Data Science, Code Game, Tutorials, Programming, Web Development, Training, Learning, Quiz, Exercises, Courses, Lessons, References, Examples, Learn to code, Source code, Demos, Tips, Website">
<meta name="Description" content="Well organized and easy to understand Web building tutorials with lots of examples of how to use HTML, CSS, JavaScript, SQL, Python, PHP, Bootstrap, Java, XML and more.">
<meta property="og:image" content="https://www.w3schools.com/images/w3schools_logo_436_2.png">
<meta property="og:image:type" content="image/png">
<meta property="og:image:width" content="436">
<meta property="og:image:height" content="228">
<meta property="og:description" content="W3Schools offers free online tutorials, references and exercises in all the major languages of the web. Covering popular subjects like HTML, CSS, JavaScript, Python, SQL, Java, and many, many more.">
<link rel="icon" href="https://www.w3schools.com/favicon.ico">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="manifest" href="/site.webmanifest" crossorigin="use-credentials">
<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#04aa6d">
<meta name="msapplication-TileColor" content="#00a300">
<meta name="theme-color" content="#ffffff">
<meta name="format-detection" content="telephone=no">
<link rel="preload" href="/lib/fonts/fontawesome.woff2?14663396" as="font" type="font/woff2" crossorigin=""> 
<link rel="preload" href="/lib/fonts/source-code-pro-v14-latin-regular.woff2" as="font" type="font/woff2" crossorigin=""> 
<link rel="preload" href="/lib/fonts/roboto-mono-v13-latin-500.woff2" as="font" type="font/woff2" crossorigin=""> 
<link rel="preload" href="/lib/fonts/source-sans-pro-v14-latin-700.woff2" as="font" type="font/woff2" crossorigin=""> 
<link rel="preload" href="/lib/fonts/source-sans-pro-v14-latin-600.woff2" as="font" type="font/woff2" crossorigin="">
<link rel="preload" href="/lib/fonts/SourceSansPro-Regular.woff2" as="font" type="font/woff2" crossorigin="">
<link rel="preload" href="/lib/fonts/freckle-face-v9-latin-regular.woff2" as="font" type="font/woff2" crossorigin=""> 
<link rel="stylesheet" href="/lib/topnav/main.v1.0.93.css">
<link rel="stylesheet" href="/lib/my-learning/main.v1.0.75.css">
<link rel="stylesheet" href="/lib/pathfinder/main.v1.0.12.css">
<link rel="stylesheet" href="/lib/w3schools.css?v=1.0.1">
<link rel="stylesheet" href="/plus/plans/main.css?v=1.0.1">
<link rel="stylesheet" href="/lib/sparteo.css?v=1.0.5">
<script async="" src="https://www.googletagmanager.com/gtm.js?id=GTM-KTCFC3S"></script><script data-cfasync="false" data-no-optimize="1" data-wpmeteor-nooptimize="true" nowprocket="">window.FAST_CMP_OPTIONS={domainUid:"849c868d-5fd6-58f9-8963-b1468ae3b279",countryCode:"NO",jurisdiction:"tcfeuv2",customOpener: true,policyUrl:"https://www.w3schools.com/about/about_privacy.asp",displaySynchronous:!1,publisherName:"W3Schools",publisherLogo:function(r){return r.createElement("img",{src:"https://www.w3schools.com/images/w3schools_logo_500_04AA6D.webp",height:"40"})},bootstrap:{excludedIABVendors:[],excludedGoogleVendors:[]},custom:{vendors:[]},},function(){var o={484:function(r){window.FAST_CMP_T0=Date.now(),window.FAST_CMP_QUEUE={},window.FAST_CMP_QUEUE_ID=0,r.exports={name:"light",handler:function(){var r=Array.prototype.slice.call(arguments);if(!r.length)return Object.values(window.FAST_CMP_QUEUE);"ping"===r[0]?"function"==typeof r[2]&&r[2]({cmpLoaded:!1,cmpStatus:"stub",apiVersion:"2.0",cmpId:parseInt("388",10)}):window.FAST_CMP_QUEUE[window.FAST_CMP_QUEUE_ID++]=r}}}},n={};function e(r){return(e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(r){return typeof r}:function(r){return r&&"function"==typeof Symbol&&r.constructor===Symbol&&r!==Symbol.prototype?"symbol":typeof r})(r)}var r,a=function r(e){var a=n[e];if(void 0!==a)return a.exports;var t=n[e]={exports:{}};return o[e](t,t.exports,r),t.exports}(484),i="__tcfapiLocator",c=window,t=c;for(;t;){try{if(t.frames[i]){r=t;break}}catch(o){}if(t===c.top)break;t=t.parent}if("custom"!==c.FAST_CMP_HANDLER)for(var s in r?(c.__tcfapi=a.handler,c.FAST_CMP_HANDLER=a.name):(function r(){var e=c.document,a=!!c.frames[i];if(!a)if(e.body){var t=e.createElement("iframe");t.style.cssText="display:none",t.name=i,e.body.appendChild(t)}else setTimeout(r,5);return!a}(),c.__tcfapi=a.handler,c.FAST_CMP_HANDLER=a.name,c.addEventListener("message",function(t){var o="string"==typeof t.data,r={};if(o)try{r=JSON.parse(t.data)}catch(t){}else r=t.data;var n="object"===e(r)?r.__tcfapiCall:null;n&&window.__tcfapi(n.command,n.version,function(r,e){var a={__tcfapiReturn:{returnValue:r,success:e,callId:n.callId}};t&&t.source&&t.source.postMessage&&t.source.postMessage(o?JSON.stringify(a):a,"*")},n.parameter)},!1)),window.FAST_CMP_QUEUE||{})c.__tcfapi.apply(null,window.FAST_CMP_QUEUE[s])}()</script>
<script data-cfasync="false" data-no-optimize="1" data-wpmeteor-nooptimize="true" nowprocket="" async="" charset="UTF-8" src="https://static.fastcmp.com/fast-cmp-stub.js"></script>
<style>
#nav_tutorials,#nav_references,#nav_certified,#nav_services,#nav_exercises {display:none;letter-spacing:0;position:absolute;width:100%;background-color:#282A35;color:white;padding-bottom:40px;z-index: 5 !important;font-family: 'Source Sans Pro Topnav', sans-serif !important;}
</style>

<!-- Google Tag Manager -->
<script>
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-KTCFC3S');

var subjectFolder = location.pathname;
subjectFolder = subjectFolder.replace("/", "");
if (subjectFolder.startsWith("python/") == true ) {
  if (subjectFolder.includes("/numpy/") == true ) {
    subjectFolder = "numpy/"
  } else if (subjectFolder.includes("/pandas/") == true ) {
      subjectFolder = "pandas/"
  } else if (subjectFolder.includes("/scipy/") == true ) {
      subjectFolder = "scipy/"
  }
}
subjectFolder = subjectFolder.substr(0, subjectFolder.indexOf("/"));
</script>
<!-- End Google Tag Manager -->
<script src="/lib/uic.js?v=1.1.0"></script>
<script src="/lib/uic_prov.js?v=1.4.7"></script>

<script data-cfasync="false" type="text/javascript">

uic_prov_pre("default","",subjectFolder);
var stickyadstatus = "";
function fix_stickyad() {
  document.getElementById("stickypos").style.position = "sticky";
  var elem = document.getElementById("stickyadcontainer");
  if (!elem) {return false;}
  if (document.getElementById("skyscraper")) {
    var skyWidth = Number(w3_getStyleValue(document.getElementById("skyscraper"), "width").replace("px", ""));
    if (isNaN(skyWidth) && document.getElementById("upperfeatureshowcaselink").parentElement) {
      skyWidth = Number(w3_getStyleValue(document.getElementById("upperfeatureshowcaselink").parentElement, "width").replace("px", ""));
    }
  }
  else {
    var skyWidth = Number(w3_getStyleValue(document.getElementById("right"), "width").replace("px", ""));  
  }
  elem.style.width = skyWidth + "px";
  if (window.innerWidth <= 992) {
    elem.style.position = "";
    elem.style.top = stickypos + "px";
    return false;
  }
  var stickypos = document.getElementById("stickypos").offsetTop;
  var docTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
  var adHeight = Number(w3_getStyleValue(elem, "height").replace("px", ""));
  if (stickyadstatus == "") {
    if ((stickypos - docTop) < 100) {
      elem.style.position = "fixed";
      elem.style.top = "100px";
      stickyadstatus = "sticky";
      document.getElementById("stickypos").style.position = "sticky";

    }
  } else {
    if ((docTop + 100) - stickypos < 0) {  
      elem.style.position = "";
      elem.style.top = stickypos + "px";
      stickyadstatus = "";
      document.getElementById("stickypos").style.position = "static";
    }
  }
  if (stickyadstatus == "sticky") {
    if ((docTop + adHeight + 100) > document.getElementById("footer").offsetTop) {
      elem.style.position = "absolute";
      elem.style.top = (document.getElementById("footer").offsetTop - adHeight) + "px";
      document.getElementById("stickypos").style.position = "static";
    } else {
        elem.style.position = "fixed";
        elem.style.top = "100px";
        stickyadstatus = "sticky";
        document.getElementById("stickypos").style.position = "sticky";
    }
  }
}
function w3_getStyleValue(elmnt,style) {
  if (window.getComputedStyle) {
    return window.getComputedStyle(elmnt,null).getPropertyValue(style);
  } else {
    return elmnt.currentStyle[style];
  }
}
</script><script type="text/javascript" async="" data-cfasync="false" src="https://www.flashb.id/universal/55f786fc-6e0e-5368-ade6-451e5d54251d.js"></script>

<script src="/lib/common-deps/main.v1.0.17.js"></script>
<script src="/lib/user-session/main.v1.0.51.js"></script>
<script src="/lib/topnav/main.v1.0.93.js"></script>
<script src="/lib/my-learning/main.v1.0.75.js"></script>

<link rel="stylesheet" type="text/css" href="/browserref.css">
<style>
.notsupported,.notsupported:hover,.notsupported:active,.notsupported:visited,.notsupported:link {
  color:rgb(197,128,128)
}
img.viewport {
   border: 10px solid #f1f1f1;
   border-radius: 3px;
}
</style>
<script type="text/javascript" async="" charset="UTF-8" src="https://sync.sparteo.com/crossfire.js"></script></head>
"""

get_meta_tag(str)