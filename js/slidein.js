(function () {
  window.addEventListener("load", function () {
    wpSlideIn(wpSlideInParams);
  });

  var wpSlideIn = function (params) {
    var that = this;

    that.constructor = function () {
      that.prepareParams();
      that.setOrigin();
      that.cookieToken =
        "wp-slidein-expire-" +
        that.hashCode(params.cookieToken || params.url + params.contentUrl);

      wpSlideInParams.cookieName = that.cookieToken;

      if (!params.expireDays || that.getCookie() === "") {
        that.hasPoped = false;

        that.buildContainer();
        that.buildContentContainer();
        that.buildContent();
        that.buildClose();
        that.buildShadow();
        that.buildGoLayer();

        if (params.animation === "slide") {
          that.prepareSlideIn();
        } else {
          that.prepareFadeIn();
        }

        that.setPopBehavior();

        document.body.appendChild(that.containerEl);
      }
    };

    that.prepareParams = function () {
      var defaultParams = {
        url: "",
        decryptUrl: false,
        contentUrl: "",
        decryptContentUrl: false,
        contentType: "iframe",
        cookieToken: "",
        width: "90%",
        height: "90%",
        timeout: 15000,
        delayClose: 0,
        clickStart: true,
        closeIntent: true,
        closeButtonColor: "#000",
        closeCrossColor: "#fff",
        postitialBehavior: false,
        shadow: false,
        shadowColor: "#000",
        shadowOpacity: "0",
        shadeColor: "#111",
        shadeOpacity: ".5",
        border: "1px",
        borderRadius: "0px",
        borderColor: "#000",
        leadOut: true,
        allowScrollbars: false,
        animation: "slide",
        direction: "up",
        verticalPosition: "center",
        horizontalPosition: "center",
        expireDays: 1,
      };

      for (var key in defaultParams) {
        if (
          defaultParams.hasOwnProperty(key) &&
          typeof params[key] === "undefined"
        )
          params[key] = defaultParams[key];
      }

      params.url = params.decryptUrl
        ? decodeURIComponent(params.url)
        : params.url;

      if (typeof params.contentUrl === "string" && params.contentUrl !== "") {
        params.contentUrl = params.decryptContentUrl
          ? decodeURIComponent(params.contentUrl)
          : params.contentUrl;
      } else {
        params.contentUrl = params.url;
      }

      params.timeout =
        params.timeout !== "false"
          ? parseInt(params.timeout) !== NaN
            ? params.timeout
            : false
          : false;
      params.contentType =
        ["iframe", "img", "video"].indexOf(params.contentType) !== -1
          ? params.contentType
          : "iframe";
    };

    that.setHrefPostitialEvent = (element) => {
      element.addEventListener("click", function (event) {
        if (!that.hasPoped) {
          event.preventDefault();
          event.stopImmediatePropagation();
          event.stopPropagation();
          that.popIt();
          that.hrefEvent = event;
          that.closeEl.addEventListener("click", () => {
            location.href = element.href;
          });
          that.goEl.addEventListener("click", () => {
            that.unPopIt();
            setTimeout(() => (location.href = element.href), 100);
          });
          if (params.shadow) {
            that.shadowEl.addEventListener("click", () => {
              location.href = element.href;
            });
          }
          element.removeEventListener("click", that.setHrefPostitialEvent);
        }
      });
    };

    that.setPostitialBehavior = () => {
      var allLinks = document.links;

      for (var i = 0, n = allLinks.length; i < n; i++) {
        allLinks[i].addEventListener(
          "click",
          that.setHrefPostitialEvent(allLinks[i])
        );
      }
    };

    that.setPopBehavior = function () {
      if (
        typeof params.postitialBehavior !== "undefined" &&
        params.postitialBehavior
      ) {
        window.onload = that.setPostitialBehavior();
      }

      if (typeof params.clickStart !== "undefined" && params.clickStart) {
        window.addEventListener("click", that.popIt);
      }

      if (typeof params.timeout === "number") {
        setTimeout(that.popIt, params.timeout);
      }

      if (params.closeIntent) {
        window.addEventListener("mousemove", that.checkIntent);
      }
    };

    that.setOrigin = function () {
      that.origin = {
        top: "50%",
        left: "50%",
        translateTop: "-50%",
        translateLeft: "-50%",
      };

      if (typeof params.verticalPosition !== "undefined") {
        switch (params.verticalPosition) {
          case "top":
            that.origin.top = "0";
            that.origin.translateTop = "0";
            break;
          case "bottom":
            that.origin.top = "100%";
            that.origin.translateTop = "-100%";
            break;
        }
      }

      if (typeof params.horizontalPosition !== "undefined") {
        switch (params.horizontalPosition) {
          case "left":
            that.origin.left = "0";
            that.origin.translateLeft = "0";
            break;
          case "right":
            that.origin.left = "100%";
            that.origin.translateLeft = "-100%";
            break;
        }
      }
    };

    that.buildContainer = function () {
      that.containerEl = document.createElement("div");
      const pxRegex = /px/;
      const isHeightInPx =
        typeof params.height === "string" && pxRegex.test(params.height);
      const isWidthInPx =
        typeof params.width === "string" && pxRegex.test(params.width);
      Object.assign(that.containerEl.style, {
        position: "fixed",
        top: that.origin.top,
        left: that.origin.left,
        transform:
          "translate(" +
          that.origin.translateLeft +
          ", " +
          that.origin.translateTop +
          ")",
        maxWidth: "100%",
        width: typeof params.width === "string" ? params.width : "90%",
        height:
          isHeightInPx && isWidthInPx
            ? undefined
            : typeof params.height === "string"
            ? params.height
            : "90%",
        aspectRatio:
          isHeightInPx &&
          isWidthInPx &&
          typeof params.width === "string" &&
          typeof params.height === "string"
            ? `${params.width.replace("px", "")}/${params.height.replace(
                "px",
                ""
              )}`
            : "unset",
        boxSizing: "content-box",
        border:
          params.border +
          " solid " +
          (typeof params.borderColor === "string"
            ? params.borderColor
            : "#fff"),
        background:
          typeof params.borderColor === "string" ? params.borderColor : "#fff",
        boxShadow:
          "0 0 50px rgba(" +
          that.hexToRgbA(
            typeof params.shadeColor === "string" ? params.shadeColor : "#000"
          ) +
          "," +
          (typeof params.shadeOpacity === "string"
            ? params.shadeOpacity
            : ".5") +
          ")",
        borderRadius: params.borderRadius,
        transition: "all .5s",
        pointerEvents: "none",
        zIndex: "2147483646",
      });
    };

    that.buildContentContainer = function () {
      that.contentCtnEl = document.createElement("div");

      Object.assign(that.contentCtnEl.style, {
        objectFit: "fill",
        width: "1px",
        height: "1px%",
        minWidth: "100%",
        minHeight: "100%",
        position: "absolute",
        overflow:
          ((params.leadOut || !params.allowScrollbars) &&
            params.contentType === "iframe") ||
          params.contentType !== "iframe"
            ? "hidden"
            : "scroll",
        top: "0",
        left: "0",
        right: "0",
        bottom: "0",
        border: "0",
      });

      that.containerEl.appendChild(that.contentCtnEl);
    };

    that.buildContent = function () {
      that.contentEl = document.createElement(params.contentType);

      if (
        (params.leadOut || !params.allowScrollbars) &&
        params.contentType === "iframe"
      ) {
        that.contentEl.scrolling = "no";
      } else if (params.contentType === "video") {
        Object.assign(that.contentEl, {
          autoplay: true,
          playsInline: true,
          controls: false,
          muted: true,
        });
      }

      Object.assign(that.contentEl.style, {
        objectFit: "fill",
        width: "1px",
        height: "1px",
        minWidth: "100%",
        minHeight: "100%",
        position: "absolute",
        overflow:
          ((params.leadOut || !params.allowScrollbars) &&
            params.contentType === "iframe") ||
          params.contentType !== "iframe"
            ? "hidden"
            : "scroll",
        top: "0",
        left: "0",
        right: "0",
        bottom: "0",
        border: "0",
      });

      that.contentCtnEl.appendChild(that.contentEl);
    };

    that.buildGoLayer = function () {
      if (params.leadOut) {
        that.goEl = document.createElement("a");

        that.goEl.href = typeof params.url === "string" ? params.url : "";
        that.goEl.target = "_blank";
        Object.assign(that.goEl.style, {
          position: "absolute",
          top: params.border,
          left: params.border,
          right: params.border,
          bottom: params.border,
          zIndex: "2147483647",
        });

        that.containerEl.appendChild(that.goEl);
      }
    };

    that.buildClose = function () {
      that.closeEl = document.createElement("div");

      if (
        typeof params.postitialBehavior === "boolean" &&
        params.postitialBehavior
      ) {
        that.closeEl.innerHTML =
          "Continue " +
          `<svg height="10px" width="20px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 227.096 227.096" xml:space="preserve"><g><g><polygon style="fill:#FFFF;" points="152.835,39.285 146.933,45.183 211.113,109.373 0,109.373 0,117.723 211.124,117.723 146.933,181.902 152.835,187.811 227.096,113.55 "/></g></g></svg>`;
      } else {
        that.closeEl.innerHTML =
          "Close <svg " +
          'version="1.1" style="' +
          "enable-background:new 0 0 47.971 47.971; " +
          "width: .7em; " +
          "height: .7em; " +
          "fill: " +
          (typeof params.closeCrossColor === "string"
            ? params.closeCrossColor
            : "#000") +
          '" ' +
          'xmlns="http://www.w3.org/2000/svg" ' +
          'xmlns:xlink="http://www.w3.org/1999/xlink" ' +
          'x="0px" ' +
          'y="0px" ' +
          'viewBox="0 0 47.971 47.971" ' +
          'xml:space="preserve">' +
          '<path d="M28.228,23.986L47.092,5.122c1.172-1.171,1.172-3.071,0-4.242c-1.172-1.172-3.07-1.172-4.242,0L23.986,19.744L5.121,0.88\n' +
          "\tc-1.172-1.172-3.07-1.172-4.242,0c-1.172,1.171-1.172,3.071,0,4.242l18.865,18.864L0.879,42.85c-1.172,1.171-1.172,3.071,0,4.242\n" +
          "\tC1.465,47.677,2.233,47.97,3,47.97s1.535-0.293,2.121-0.879l18.865-18.864L42.85,47.091c0.586,0.586,1.354,0.879,2.121,0.879\n" +
          '\ts1.535-0.293,2.121-0.879c1.172-1.171,1.172-3.071,0-4.242L28.228,23.986z"/>\n</svg>';
      }

      Object.assign(that.closeEl.style, {
        position: "absolute",
        display: params.delayClose ? "none" : "block",
        top: params.verticalPosition === "top" ? "100%" : "0",
        right:
          params.verticalPosition === "top"
            ? "50%"
            : typeof params.border === "string"
            ? params.border
            : "0",
        background:
          typeof params.closeButtonColor === "string"
            ? params.closeButtonColor
            : "#fff",
        color:
          typeof params.closeCrossColor === "string"
            ? params.closeCrossColor
            : "#000",
        borderRadius:
          params.verticalPosition === "top" ? "0 0 5px 5px" : "5px 5px 0 0",
        padding: "0 .5em",
        fontSize: "12px",
        lineHeight: "1.5em",
        textAlign: "center",
        cursor: "pointer",
        transform:
          params.verticalPosition === "top"
            ? "translate(50%, 0)"
            : "translate(0, -100%)",
        zIndex: "2147483647",
        boxShadow:
          "0 0 10px rgba(" +
          that.hexToRgbA(
            typeof params.shadeColor === "string" ? params.shadeColor : "#000"
          ) +
          "," +
          (typeof params.shadeOpacity === "string"
            ? params.shadeOpacity
            : ".5") +
          ")",
      });

      that.closeEl.addEventListener("click", that.unPopIt);
      that.containerEl.appendChild(that.closeEl);
    };

    that.buildShadow = function () {
      that.shadowEl = document.createElement("div");

      if (params.shadow) {
        Object.assign(that.shadowEl.style, {
          position: "fixed",
          top: "0",
          left: "0",
          right: "0",
          bottom: "0",
          background:
            "rgba(" +
            that.hexToRgbA(
              typeof params.shadowColor === "string"
                ? params.shadowColor
                : "#000"
            ) +
            "," +
            (typeof params.shadowOpacity === "string"
              ? params.shadowOpacity
              : ".5") +
            ")",
          transition: "all .4s",
          opacity: "0",
          pointerEvents: "none",
          zIndex: "2147483646",
        });

        document.body.appendChild(that.shadowEl);
      }
    };

    that.setCookie = function () {
      var d = new Date();
      d.setTime(d.getTime() + params.expireDays * 60 * 60 * 1000);
      var expires = "expires=" + d.toUTCString();
      document.cookie =
        that.cookieToken +
        "=" +
        Math.round(d.getTime() / 1000) +
        ";" +
        expires +
        ";path=/";
    };

    that.getCookie = function () {
      var name = that.cookieToken + "=";
      var decodedCookie = decodeURIComponent(document.cookie);
      var ca = decodedCookie.split(";");
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === " ") {
          c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
          return c.substring(name.length, c.length);
        }
      }
      return "";
    };

    that.hexToRgbA = function (hex) {
      var c;

      if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split("");
        if (c.length === 3) {
          c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = "0x" + c.join("");
        return [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(",");
      }
      throw new Error("Bad Hex");
    };

    that.hashCode = function (s) {
      return s.split("").reduce(function (a, b) {
        a = (a << 5) - a + b.charCodeAt(0);
        return a & a;
      }, 0);
    };

    that.prepareFadeIn = function () {
      that.containerEl.style.opacity = "0";
    };

    that.fadeIn = function () {
      that.containerEl.style.opacity = "1";
    };

    that.prepareSlideIn = function () {
      switch (params.direction) {
        case "up":
          that.containerEl.style.marginTop = "calc(100vh + 40px)";
          break;
        case "bottom":
          that.containerEl.style.marginTop = "calc(-100vh - 40px)";
          break;
        case "left":
          that.containerEl.style.marginLeft = "calc(100vw + 40px)";
          break;
        case "right":
          that.containerEl.style.marginLeft = "calc(-100vw - 40px)";
          break;
        default:
          that.containerEl.style.marginTop = "calc(-100vh - 40px)";
      }
    };

    that.slideIn = function () {
      that.containerEl.style.margin = "0";
    };

    that.popIt = function () {
      if (!that.hasPoped) {
        that.setCookie();

        that.contentEl.src = params.contentUrl;
        window.removeEventListener("click", that.popIt);
        that.hasPoped = true;
        that.shadowEl.style.opacity = "1";
        that.shadowEl.style.pointerEvents = "auto";
        that.containerEl.style.pointerEvents = "auto";

        if (params.animation === "slide") {
          that.slideIn();
        } else {
          that.fadeIn();
        }

        if (params.delayClose) {
          setTimeout(that.activateClose, params.delayClose);
        } else {
          that.activateClose();
        }
      }
    };

    that.activateClose = function () {
      that.closeEl.style.display = "block";

      if (params.shadow) {
        that.shadowEl.addEventListener("click", that.unPopIt);
      }
    };

    that.unPopIt = function () {
      that.shadowEl.style.opacity = "0";
      that.shadowEl.style.pointerEvents = "none";
      that.containerEl.style.opacity = "0";
      that.containerEl.style.pointerEvents = "none";
      that.prepareSlideIn();
      setTimeout(function () {
        that.contentCtnEl.removeChild(that.contentEl);
      }, 1000);
    };

    that.checkIntent = function (e) {
      if (e.pageY < 50 && e.movementY < 0) {
        that.popIt();
      }
    };

    that.constructor();
  };
})();
