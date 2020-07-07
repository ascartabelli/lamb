"use strict";

var _ = lamb;

var assignTo = _.curry(function (target, source) {
    _.forEach(_.enumerables(source), function (key) {
        target[key] = source[key];
    });
});

var parseCSSValue = function (cssProperty) {
    return _.pipe([getComputedStyle, _.getKey(cssProperty), parseFloat]);
};
var parseHeight = parseCSSValue("height");
var parsePaddingTop = parseCSSValue("paddingTop");
var parseClientHeight = _.compose(
    _.reduceWith(_.sum),
    _.collect([parseHeight, parsePaddingTop, parseCSSValue("paddingBottom")])
);

/* ------------------------------------------------------------------- */

var getHashTarget = function () {
    return location.hash ? document.getElementById(location.hash.substr(1)) : null;
};

var onDocumentClick = function (event) {
    var href = event.target.getAttribute("href") || "";
    var hashIdx = href.indexOf("#");

    if (~hashIdx && ~location.pathname.indexOf(href.substring(0, hashIdx))) {
        var newTarget = document.getElementById(href.substr(hashIdx + 1));

        if (newTarget === getHashTarget()) { // hashchange won't fire
            scrollToHash(newTarget);
            event.preventDefault();
        }
    }
};

var scrollToHash = function (hashTarget) {
    if (hashTarget) {
        hashTarget.scrollIntoView();

        if (hashTarget.id.indexOf("cat-") === -1) {
            document.getElementById("main").scrollTop -= 40;
        }
    } else {
        document.getElementById("main").scrollTop = 0;
    }

    sendToGA();
};

var scrollToCurrentHash = _.compose(scrollToHash, getHashTarget);

var sendToGA = function () {
    ga("send", "pageview", {page: location.pathname + location.search + location.hash});
};

function onLoad () {
    var mainContainer = document.getElementById("main");
    var nav = document.querySelector(".main-nav");
    var navClone = document.body.appendChild(nav.cloneNode(true));
    var setNavCloneStyle = assignTo(navClone.style);
    var scrollLimit = parseClientHeight(nav.parentNode) - parseClientHeight(nav) + parsePaddingTop(mainContainer);

    var updateNavDisplay = function () {
        if (mainContainer.scrollTop >= scrollLimit) {
            navClone.style.display = "block";
        } else {
            navClone.style.display = "none";
        }
    };

    var updateNavCloneWidth = _.pipe([
        _.always(getComputedStyle(nav)),
        _.pick(["width"]),
        setNavCloneStyle
    ]);

    setNavCloneStyle({
        display: "none",
        position: "fixed",
        top: "0",
        left: "10px",
        zIndex: 98
    });
    updateNavCloneWidth();
    updateNavDisplay();
    scrollToCurrentHash();

    mainContainer.addEventListener("scroll", updateNavDisplay, false);
    window.addEventListener("hashchange", scrollToCurrentHash, false);
    window.addEventListener("resize", _.debounce(updateNavCloneWidth, 200), false);
    document.body.addEventListener("click", onDocumentClick, false);
}

hljs.initHighlighting();

window.addEventListener("load", onLoad, false);
