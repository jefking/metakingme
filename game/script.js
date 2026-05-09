(function () {
    "use strict";

    var STORAGE_KEY = "standaloneGameSettings";
    var defaultSettings = {
        highContrast: false,
        reducedMotion: false,
        largeText: false,
        sound: false,
        inputMode: "keyboard"
    };

    var app = document.getElementById("app");

    if (!app) {
        return;
    }

    var state = {
        route: getRoute(),
        settings: loadSettings()
    };

    function getRoute() {
        var route = window.location.hash.replace(/^#\/?/, "");
        return route === "settings" ? "settings" : "play";
    }

    function loadSettings() {
        try {
            var saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
            return Object.assign({}, defaultSettings, saved || {});
        } catch (error) {
            return Object.assign({}, defaultSettings);
        }
    }

    function saveSettings() {
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.settings));
        } catch (error) {
            return;
        }
    }

    function setDocumentFlags() {
        document.documentElement.dataset.contrast = state.settings.highContrast ? "high" : "standard";
        document.documentElement.dataset.motion = state.settings.reducedMotion ? "reduced" : "standard";
        document.documentElement.dataset.text = state.settings.largeText ? "large" : "standard";
    }

    function checked(setting) {
        return state.settings[setting] ? "checked" : "";
    }

    function current(route) {
        return state.route === route ? 'aria-current="page"' : "";
    }

    function render() {
        setDocumentFlags();

        app.innerHTML = [
            '<div class="app-shell">',
            '  <header class="shell-header">',
            '    <a class="brand" href="#play" data-route="play">',
            '      <span class="brand-mark" aria-hidden="true"></span>',
            '      <span>Game</span>',
            '    </a>',
            '    <nav class="nav" aria-label="Game app">',
            '      <a class="nav-link" href="#play" data-route="play" ' + current("play") + ">Stage</a>",
            '      <a class="nav-link" href="#settings" data-route="settings" ' + current("settings") + ">Access</a>",
            "    </nav>",
            "  </header>",
            '  <main class="shell-main" id="main">',
            state.route === "settings" ? settingsView() : playView(),
            "  </main>",
            '  <footer class="shell-footer">',
            "    Standalone app. Assets, styles, and scripts stay inside /game.",
            "  </footer>",
            "</div>"
        ].join("");
    }

    function playView() {
        return [
            '<section class="play-view" aria-labelledby="game-title">',
            "  <div>",
            '    <p class="eyebrow">Standalone game SPA</p>',
            '    <h1 id="game-title">Game space ready</h1>',
            '    <p class="lead">Future game logic will mount here without using the main website assets, styles, or scripts.</p>',
            '    <ul class="status-list" aria-label="Build status">',
            '      <li><span class="status-dot" aria-hidden="true"></span><span>SPA shell active</span></li>',
            '      <li><span class="status-dot alt" aria-hidden="true"></span><span>Local image, CSS, and JavaScript paths ready</span></li>',
            '      <li><span class="status-dot alert" aria-hidden="true"></span><span>Game rules and mechanics pending</span></li>',
            "    </ul>",
            '    <div class="action-row">',
            '      <button class="button primary" type="button" data-action="focus-stage">Enter game stage</button>',
            '      <a class="button" href="#settings" data-route="settings">Open access settings</a>',
            "    </div>",
            "  </div>",
            '  <section class="stage-panel" aria-label="Game stage placeholder" tabindex="-1" data-stage>',
            '    <div class="stage-inner">',
            '      <img class="stage-mark" src="./images/ready-mark.svg" alt="">',
            '      <div class="stage-status">',
            "        <strong>Awaiting game brief</strong>",
            "        <span>Next step can define world, rules, input, scoring, win state, and assets.</span>",
            "      </div>",
            '      <div class="stage-slots" aria-label="Future game parts">',
            '        <span class="stage-slot">World</span>',
            '        <span class="stage-slot">Rules</span>',
            '        <span class="stage-slot">Score</span>',
            '        <span class="stage-slot">Win State</span>',
            "      </div>",
            "    </div>",
            "  </section>",
            "</section>"
        ].join("");
    }

    function settingsView() {
        return [
            '<section class="settings-view" aria-labelledby="settings-title">',
            '  <div class="settings-intro">',
            '    <p class="eyebrow">Player options</p>',
            '    <h2 id="settings-title">Access settings</h2>',
            '    <p class="lead">These preferences are ready for the future game loop and save in this browser.</p>',
            "  </div>",
            '  <div class="settings-panel">',
            settingRow("highContrast", "High contrast", "Increase visual contrast for text and controls."),
            settingRow("reducedMotion", "Reduced motion", "Limit animation and movement where possible."),
            settingRow("largeText", "Large text", "Increase interface text size."),
            settingRow("sound", "Sound enabled", "Keep audio opt-in for players."),
            inputModeView(),
            "  </div>",
            "</section>"
        ].join("");
    }

    function settingRow(key, title, description) {
        return [
            '<label class="setting-row">',
            '  <span class="setting-copy">',
            "    <strong>" + title + "</strong>",
            "    <span>" + description + "</span>",
            "  </span>",
            '  <span class="switch">',
            '    <input type="checkbox" data-setting="' + key + '" ' + checked(key) + ">",
            '    <span aria-hidden="true"></span>',
            "  </span>",
            "</label>"
        ].join("");
    }

    function inputModeView() {
        var modes = [
            ["keyboard", "Keyboard"],
            ["pointer", "Pointer"],
            ["touch", "Touch"]
        ];

        return [
            '<section class="input-mode">',
            "  <fieldset>",
            "    <legend>Preferred input</legend>",
            "    <p>Future controls can adapt to this choice.</p>",
            '    <div class="input-options">',
            modes.map(function (mode) {
                var checkedAttribute = state.settings.inputMode === mode[0] ? "checked" : "";
                return [
                    '<label class="input-option">',
                    '  <input type="radio" name="inputMode" value="' + mode[0] + '" ' + checkedAttribute + ">",
                    "  <span>" + mode[1] + "</span>",
                    "</label>"
                ].join("");
            }).join(""),
            "    </div>",
            "  </fieldset>",
            "</section>"
        ].join("");
    }

    app.addEventListener("click", function (event) {
        var routeLink = event.target.closest("[data-route]");
        var action = event.target.closest("[data-action]");

        if (routeLink) {
            event.preventDefault();
            window.location.hash = routeLink.dataset.route;
            return;
        }

        if (action && action.dataset.action === "focus-stage") {
            var stage = app.querySelector("[data-stage]");
            if (stage) {
                stage.focus();
            }
        }
    });

    app.addEventListener("change", function (event) {
        var target = event.target;

        if (target.matches("[data-setting]")) {
            state.settings[target.dataset.setting] = target.checked;
            saveSettings();
            render();
        }

        if (target.name === "inputMode") {
            state.settings.inputMode = target.value;
            saveSettings();
            render();
        }
    });

    window.addEventListener("hashchange", function () {
        state.route = getRoute();
        render();
    });

    window.GameApp = {
        getState: function () {
            return JSON.parse(JSON.stringify(state));
        }
    };

    render();
}());
