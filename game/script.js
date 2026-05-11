(function () {
    "use strict";

    var STORAGE_KEY = "standaloneGameSettings";
    var BADGE_STORAGE_KEY = "zooRescueUnlockedBadges";
    var WORLD_WIDTH = 960;
    var WORLD_HEIGHT = 620;
    var MAX_OBSTACLES = 28;
    var SPRITE_SIZE = 32;
    var GRASS_TILE_SIZE = 32;
    var FAST_BADGE_LIMIT_SECONDS = 60;
    var END_FADE_MS = 1700;
    var END_PANEL_DELAY_MS = 520;
    var END_PANEL_FADE_MS = 640;
    var FIREWORK_DURATION_MS = 1800;
    var STOLEN_LOSS_LIMIT = 9;
    var BAD_PERSON_SPEED = 320;
    var BAD_PERSON_HIDE_MIN = 4;
    var BAD_PERSON_HIDE_MAX = 12;
    var BAD_PERSON_EDGE_OFFSET = 64;
    var BAD_PERSON_SAFE_DISTANCE = 220;
    var BAD_PERSON_ZOO_DISTANCE = 190;
    var COIN_DROP_INTERVAL = 10;
    var COINS_PER_DROP = 3;
    var MAX_VISIBLE_COINS = 6;
    var WOLF_COUNT = 3;
    var WOLF_HIDE_MIN = 2;
    var WOLF_HIDE_MAX = 40;
    var WOLF_SPEED = 238;
    var WOLF_EDGE_OFFSET = 58;
    var WOLF_SAFE_DISTANCE = 180;
    var KNIFE_REACH = 24;
    var SPEAR_REACH = 86;
    var BARRIER_PACK_SIZE = 3;
    var BARRIER_COST = 10;
    var BARRIER_RADIUS = 18;
    var BARRIER_COOLDOWN_MIN = 10;
    var BARRIER_COOLDOWN_MAX = 50;
    var BARRIER_COVERAGE_LIMIT = 0.045;
    var BARRIER_WALL_GAP = 34;
    var BARRIER_NOTICE_SECONDS = 3.4;
    var SHOP_ITEMS = {
        knife: { id: "knife", name: "Knife", cost: 3 },
        spear: { id: "spear", name: "Spear", cost: 1 },
        brick: { id: "brick", name: "Bricks", cost: BARRIER_COST, barrier: true },
        stone: { id: "stone", name: "Stones", cost: BARRIER_COST, barrier: true }
    };
    var BAD_PERSON_SPRITES = {
        front: [
            "................",
            ".....kkkkkk.....",
            "....kkkkkkkk....",
            ".....ssssss.....",
            "....smmmmms.....",
            "....ssssssss....",
            "......rrrr......",
            "...rrrrrrrrrr...",
            "..rrr.rrrr.rrr..",
            ".rr...rrrr...rr.",
            ".bb...rrrr......",
            ".bbb..rrrr......",
            ".bbb..pppp......",
            ".....pp..pp.....",
            ".....pp..pp.....",
            ".....pp..pp.....",
            "....kkk..kkk....",
            "...kkkk..kkkk...",
            "................",
            "................"
        ],
        back: [
            "................",
            ".....kkkkkk.....",
            "....kkkkkkkk....",
            "....kkkkkkkk....",
            ".....kkkkkk.....",
            "....rrrrrrrr....",
            "...rrrrrrrrrr...",
            "..rrr.rrrr.rrr..",
            ".rr...rrrr...rr.",
            "......rrrr...bb.",
            "......rrrr..bbb.",
            "......rrrr..bbb.",
            "......pppp......",
            ".....pp..pp.....",
            ".....pp..pp.....",
            ".....pp..pp.....",
            "....kkk..kkk....",
            "...kkkk..kkkk...",
            "................",
            "................"
        ],
        side: [
            "................",
            "......kkkk......",
            ".....kkkkkk.....",
            "......ssss......",
            ".....smmm.......",
            "......sssss.....",
            "......rrrr......",
            ".....rrrrrrr....",
            "....rr.rrrrr....",
            "...rr..rrrrr....",
            "..bb...rrrr.....",
            ".bbb...rrrr.....",
            ".bbb...pppp.....",
            "......pp.pp.....",
            "......pp.pp.....",
            ".....pp..pp.....",
            "....kk...kk.....",
            "...kkk...kkk....",
            "................",
            "................"
        ]
    };
    var WOLF_SPRITE = [
        "......................",
        "........dd............",
        ".......dggd...........",
        "......dglggd...d......",
        ".....dgglgggdddgd.....",
        "..d..dgggggggggggd....",
        ".dgd.dggggggggggggd...",
        "dggddgggggggggggegd...",
        ".ddddggggggggggdggd...",
        "....dgggggggggd.dgd...",
        "....dgggd..dggd..d....",
        "....dkkd...dkkd.......",
        "......................"
    ];
    var ANIMAL_SPRITE_PATHS = {
        zebra: "./images/zebra.png",
        turtle: "./images/turtle.png",
        squirrel: "./images/squirrel.png",
        hippo: "./images/hippo.png",
        giraffe: "./images/giraffe.png",
        butterfly: "./images/butterfly.png",
        cow: "./images/cow.png"
    };
    var ANIMAL_SPECS = [
        { kind: "zebra", x: 720, y: 130, radius: 17, speed: 116 },
        { kind: "turtle", x: 815, y: 500, radius: 16, speed: 54 },
        { kind: "squirrel", x: 360, y: 480, radius: 14, speed: 150 },
        { kind: "hippo", x: 570, y: 430, radius: 21, speed: 72 },
        { kind: "giraffe", x: 705, y: 330, radius: 19, speed: 98 },
        { kind: "butterfly", x: 450, y: 130, radius: 13, speed: 138 },
        { kind: "cow", x: 280, y: 300, radius: 17, speed: 92 }
    ];
    var WORKER_SPRITE = {
        width: 16,
        height: 16,
        rects: [
            ["workerHatLight", 5, 0, 6, 1],
            ["workerHat", 4, 1, 8, 1],
            ["workerSkin", 6, 2, 4, 3],
            ["workerSkinShade", 9, 3, 1, 2],
            ["workerInk", 6, 4, 1, 1],
            ["workerInk", 9, 4, 1, 1],
            ["workerShirt", 3, 6, 3, 3],
            ["workerShirt", 10, 6, 3, 3],
            ["workerShirt", 5, 6, 6, 4],
            ["workerShirtLight", 7, 6, 2, 4],
            ["workerSkin", 2, 8, 2, 2],
            ["workerSkin", 12, 8, 2, 2],
            ["workerPants", 5, 10, 3, 4],
            ["workerPants", 9, 10, 3, 4],
            ["workerBoot", 4, 14, 4, 1],
            ["workerBoot", 9, 14, 4, 1],
            ["workerBoot", 5, 15, 2, 1],
            ["workerBoot", 10, 15, 2, 1]
        ]
    };
    var ZOO_SIGN_SPRITE = {
        width: 17,
        height: 5,
        rects: [
            ["zooInk", 0, 0, 5, 1],
            ["zooInk", 3, 1, 1, 1],
            ["zooInk", 2, 2, 1, 1],
            ["zooInk", 1, 3, 1, 1],
            ["zooInk", 0, 4, 5, 1],
            ["zooInk", 6, 0, 4, 1],
            ["zooInk", 6, 1, 1, 3],
            ["zooInk", 9, 1, 1, 3],
            ["zooInk", 6, 4, 4, 1],
            ["zooInk", 11, 0, 4, 1],
            ["zooInk", 11, 1, 1, 3],
            ["zooInk", 14, 1, 1, 3],
            ["zooInk", 11, 4, 4, 1]
        ]
    };
    var TREE_SPRITES = [
        {
            width: 16,
            height: 18,
            rects: [
                ["spriteShadow", 4, 17, 9, 1],
                ["treeTrunk", 7, 10, 3, 7],
                ["treeTrunkLight", 8, 10, 1, 6],
                ["treeLeafDark", 6, 1, 4, 2],
                ["treeLeaf", 5, 2, 6, 3],
                ["treeLeafLight", 7, 2, 3, 1],
                ["treeLeafDark", 3, 4, 10, 2],
                ["treeLeaf", 2, 6, 12, 4],
                ["treeLeafLight", 4, 6, 4, 2],
                ["treeLeafDark", 10, 6, 3, 3],
                ["treeLeaf", 4, 9, 8, 3],
                ["treeLeafLight", 6, 9, 3, 1]
            ]
        },
        {
            width: 16,
            height: 18,
            rects: [
                ["spriteShadow", 3, 17, 10, 1],
                ["treeTrunk", 7, 12, 2, 5],
                ["treeTrunkLight", 8, 12, 1, 4],
                ["treeLeafDark", 7, 0, 2, 2],
                ["treeLeaf", 6, 2, 4, 2],
                ["treeLeafLight", 7, 2, 1, 1],
                ["treeLeafDark", 5, 4, 6, 2],
                ["treeLeaf", 4, 6, 8, 2],
                ["treeLeafLight", 6, 6, 3, 1],
                ["treeLeafDark", 3, 8, 10, 2],
                ["treeLeaf", 2, 10, 12, 3],
                ["treeLeafLight", 5, 10, 4, 1]
            ]
        },
        {
            width: 16,
            height: 18,
            rects: [
                ["spriteShadow", 4, 17, 9, 1],
                ["treeTrunk", 6, 11, 4, 6],
                ["treeTrunkLight", 8, 11, 1, 5],
                ["treeLeafDark", 3, 3, 5, 5],
                ["treeLeaf", 2, 5, 6, 5],
                ["treeLeafLight", 4, 5, 2, 2],
                ["treeLeafDark", 8, 2, 5, 5],
                ["treeLeaf", 8, 4, 6, 5],
                ["treeLeafLight", 9, 4, 3, 2],
                ["treeLeafDark", 5, 7, 7, 4],
                ["treeLeaf", 4, 9, 8, 3]
            ]
        }
    ];
    var BRUSH_SPRITES = [
        {
            width: 16,
            height: 14,
            rects: [
                ["spriteShadow", 3, 13, 10, 1],
                ["brushDark", 3, 7, 10, 4],
                ["brushLeaf", 2, 5, 5, 5],
                ["brushLeaf", 7, 4, 6, 6],
                ["brushLight", 4, 5, 3, 2],
                ["brushLight", 9, 5, 3, 2],
                ["brushDark", 5, 9, 8, 3]
            ]
        },
        {
            width: 16,
            height: 14,
            rects: [
                ["spriteShadow", 2, 13, 12, 1],
                ["brushDark", 2, 8, 12, 3],
                ["brushLeaf", 3, 5, 4, 5],
                ["brushLeaf", 8, 4, 5, 6],
                ["brushLeaf", 5, 7, 7, 4],
                ["brushLight", 4, 5, 2, 2],
                ["brushLight", 10, 5, 2, 2],
                ["brushFlower", 7, 4, 1, 1],
                ["brushFlower", 12, 7, 1, 1]
            ]
        },
        {
            width: 16,
            height: 14,
            rects: [
                ["spriteShadow", 4, 13, 9, 1],
                ["brushDark", 4, 8, 9, 3],
                ["brushLeaf", 5, 4, 5, 6],
                ["brushLeaf", 2, 7, 4, 4],
                ["brushLeaf", 10, 6, 4, 5],
                ["brushLight", 6, 4, 2, 2],
                ["brushLight", 11, 7, 2, 2],
                ["brushFlower", 4, 7, 1, 1]
            ]
        }
    ];
    var defaultSettings = {
        highContrast: false,
        reducedMotion: false,
        largeText: false
    };
    var BADGE_DEFINITIONS = [
        {
            id: "fast",
            name: "Fast!",
            power: "+35 keeper speed",
            fill: "#f0b13d",
            accent: "#fff1bd",
            ink: "#2e2110"
        },
        {
            id: "smooth",
            name: "Smooth!",
            power: "+12 catch reach",
            fill: "#116f63",
            accent: "#c9f7e2",
            ink: "#ffffff"
        },
        {
            id: "safeKeeper",
            name: "Safe Keeper",
            power: "Slower thief",
            fill: "#204b8f",
            accent: "#d8e7ff",
            ink: "#ffffff"
        }
    ];
    var BADGE_BY_ID = {};

    BADGE_DEFINITIONS.forEach(function (badge) {
        BADGE_BY_ID[badge.id] = badge;
    });

    var app = document.getElementById("app");
    var gameInstance = null;

    if (!app) {
        return;
    }

    var state = {
        settings: loadSettings()
    };
    var animalSprites = loadAnimalSprites();

    function loadSettings() {
        try {
            var saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
            return Object.assign({}, defaultSettings, saved || {});
        } catch (error) {
            return Object.assign({}, defaultSettings);
        }
    }

    function loadUnlockedBadges() {
        try {
            var saved = JSON.parse(window.localStorage.getItem(BADGE_STORAGE_KEY));
            return normalizeBadgeIds(Array.isArray(saved) ? saved : []);
        } catch (error) {
            return [];
        }
    }

    function saveUnlockedBadges(badgeIds) {
        try {
            window.localStorage.setItem(BADGE_STORAGE_KEY, JSON.stringify(normalizeBadgeIds(badgeIds)));
        } catch (error) {
            return;
        }
    }

    function normalizeBadgeIds(badgeIds) {
        var normalized = [];
        (badgeIds || []).forEach(function (badgeId) {
            if (BADGE_BY_ID[badgeId] && normalized.indexOf(badgeId) === -1) {
                normalized.push(badgeId);
            }
        });
        return normalized;
    }

    function mergeBadgeIds(existingIds, newIds) {
        return normalizeBadgeIds((existingIds || []).concat(newIds || []));
    }

    function createBadgePowers(badgeIds) {
        var normalized = normalizeBadgeIds(badgeIds);
        return {
            playerSpeedBonus: normalized.indexOf("fast") === -1 ? 0 : 35,
            catchRadiusBonus: normalized.indexOf("smooth") === -1 ? 0 : 12,
            badPersonSpeedMultiplier: normalized.indexOf("safeKeeper") === -1 ? 1 : 0.78
        };
    }

    function setDocumentFlags() {
        document.documentElement.dataset.contrast = state.settings.highContrast ? "high" : "standard";
        document.documentElement.dataset.motion = state.settings.reducedMotion ? "reduced" : "standard";
        document.documentElement.dataset.text = state.settings.largeText ? "large" : "standard";
    }

    function render() {
        setDocumentFlags();
        stopGame();

        app.innerHTML = [
            '<div class="app-shell">',
            '  <header class="shell-header">',
            '    <h1 class="brand">',
            '      <span class="brand-mark" aria-hidden="true"></span>',
            '      <span>Zoo Rescue</span>',
            '    </h1>',
            '    <button class="button primary shell-restart" type="button" data-action="restart-game">Restart</button>',
            "  </header>",
            '  <main class="shell-main" id="main">',
            playView(),
            "  </main>",
            "</div>"
        ].join("");

        startGame();
    }

    function playView() {
        return [
            '<section class="game-view" aria-label="Zoo Rescue game stage" tabindex="-1" data-stage>',
            '  <canvas class="game-canvas" width="' + WORLD_WIDTH + '" height="' + WORLD_HEIGHT + '" data-game-canvas aria-label="Mouse controlled zoo rescue game"></canvas>',
            '  <div class="stage-controls">',
            '    <button class="button primary help-button" type="button" data-help-toggle aria-expanded="false" aria-controls="help-panel">Help</button>',
            '    <aside class="shop-panel" data-shop aria-label="Shop">',
            '      <div class="shop-head">',
            '        <strong>Shop</strong>',
            '        <span data-coin-count>0 coins</span>',
            '      </div>',
            '      <button class="shop-item" type="button" data-shop-buy="knife">',
            '        <span>Knife</span>',
            '        <strong>3 coins</strong>',
            '        <em data-knife-status>Not owned</em>',
            '      </button>',
            '      <button class="shop-item" type="button" data-shop-buy="spear">',
            '        <span>Spear</span>',
            '        <strong>1 coin</strong>',
            '        <em data-spear-status>0 owned</em>',
            '      </button>',
            '      <button class="shop-item" type="button" data-shop-buy="brick" aria-pressed="false">',
            '        <span>Bricks</span>',
            '        <strong>10 coins</strong>',
            '        <em data-brick-status>3 barriers</em>',
            '      </button>',
            '      <button class="shop-item" type="button" data-shop-buy="stone" aria-pressed="false">',
            '        <span>Stones</span>',
            '        <strong>10 coins</strong>',
            '        <em data-stone-status>3 barriers</em>',
            '      </button>',
            '      <p class="shop-note" data-barrier-note hidden></p>',
            "    </aside>",
            "  </div>",
            '  <section class="help-panel" id="help-panel" data-help-panel aria-label="How to play" hidden>',
            '    <div class="help-head">',
            '      <h2>HOW TO PLAY</h2>',
            '      <button class="button help-close" type="button" data-help-close>Close</button>',
            '    </div>',
            '    <p>Protect the zoo animals from the bad guy and wolves.</p>',
            '    <p>Enemies will try to steal animals and carry them to the drop-off corner.</p>',
            '    <p>Use your weapons to stop enemies before they escape.</p>',
            '    <p>Buy knives and spears from the shop to defend the zoo.</p>',
            '    <p>Use bricks and stones to build barriers and protect the zoo animals from enemies.</p>',
            '    <p>Be careful not to block the entire map, or your barriers will reset.</p>',
            '    <p>Only 3 wolves can appear at once, but more will keep spawning over time.</p>',
            '    <p>Collect and save all the animals to win the game.</p>',
            '    <p>If too many animals are stolen, you lose.</p>',
            "  </section>",
            "  </section>",
        ].join("");
    }

    function startGame() {
        var canvas = app.querySelector("[data-game-canvas]");
        if (!canvas || gameInstance) {
            return;
        }
        gameInstance = createZooRescueGame(canvas, state.settings);
    }

    function stopGame() {
        if (gameInstance) {
            gameInstance.destroy();
            gameInstance = null;
        }
    }

    function createZooRescueGame(canvas, settings) {
        var context = canvas.getContext("2d");
        var stage = canvas.closest("[data-stage]");
        var shop = stage ? stage.querySelector("[data-shop]") : null;
        var helpButton = stage ? stage.querySelector("[data-help-toggle]") : null;
        var helpPanel = stage ? stage.querySelector("[data-help-panel]") : null;
        var helpClose = stage ? stage.querySelector("[data-help-close]") : null;
        var dpr = window.devicePixelRatio || 1;
        var running = true;
        var animationFrame = 0;
        var lastTime = performance.now();
        var nextGrowth = 4;
        var unlockedBadges = loadUnlockedBadges();
        var game = createInitialGame(settings, unlockedBadges);

        resizeCanvas();
        renderShop();
        canvas.addEventListener("pointermove", setTarget);
        canvas.addEventListener("pointerdown", onCanvasPointerDown);
        if (shop) {
            shop.addEventListener("click", onShopClick);
        }
        if (helpButton) {
            helpButton.addEventListener("click", onHelpToggle);
        }
        if (helpClose) {
            helpClose.addEventListener("click", onHelpClose);
        }
        document.addEventListener("keydown", onHelpKeyDown);
        window.addEventListener("resize", resizeCanvas);
        draw();
        animationFrame = window.requestAnimationFrame(loop);

        function reset() {
            unlockedBadges = loadUnlockedBadges();
            game = createInitialGame(settings, unlockedBadges);
            lastTime = performance.now();
            nextGrowth = 4;
            renderShop();
            setHelpOpen(false);
        }

        function destroy() {
            running = false;
            window.cancelAnimationFrame(animationFrame);
            canvas.removeEventListener("pointermove", setTarget);
            canvas.removeEventListener("pointerdown", onCanvasPointerDown);
            if (shop) {
                shop.removeEventListener("click", onShopClick);
            }
            if (helpButton) {
                helpButton.removeEventListener("click", onHelpToggle);
            }
            if (helpClose) {
                helpClose.removeEventListener("click", onHelpClose);
            }
            document.removeEventListener("keydown", onHelpKeyDown);
            window.removeEventListener("resize", resizeCanvas);
        }

        function resizeCanvas() {
            var rect = canvas.getBoundingClientRect();
            canvas.width = Math.round(rect.width * dpr);
            canvas.height = Math.round(rect.height * dpr);
            context.setTransform(canvas.width / WORLD_WIDTH, 0, 0, canvas.height / WORLD_HEIGHT, 0, 0);
            context.imageSmoothingEnabled = false;
        }

        function setTarget(event) {
            var point = eventToWorld(event);
            game.player.targetX = point.x;
            game.player.targetY = point.y;
        }

        function onCanvasPointerDown(event) {
            var point = eventToWorld(event);
            if (placeSelectedBarrier(point)) {
                return;
            }
            game.player.targetX = point.x;
            game.player.targetY = point.y;
        }

        function eventToWorld(event) {
            var rect = canvas.getBoundingClientRect();
            return {
                x: ((event.clientX - rect.left) / rect.width) * WORLD_WIDTH,
                y: ((event.clientY - rect.top) / rect.height) * WORLD_HEIGHT
            };
        }

        function onShopClick(event) {
            var button = event.target.closest("[data-shop-buy]");
            if (!button || !shop || !shop.contains(button)) {
                return;
            }

            buyShopItem(button.dataset.shopBuy);
        }

        function onHelpToggle() {
            setHelpOpen(!isHelpOpen());
        }

        function onHelpClose() {
            setHelpOpen(false);
            if (helpButton) {
                helpButton.focus();
            }
        }

        function onHelpKeyDown(event) {
            if (event.key === "Escape" && isHelpOpen()) {
                onHelpClose();
            }
        }

        function isHelpOpen() {
            return Boolean(helpPanel && !helpPanel.hidden);
        }

        function setHelpOpen(isOpen) {
            if (!helpPanel || !helpButton) {
                return;
            }

            helpPanel.hidden = !isOpen;
            helpButton.setAttribute("aria-expanded", isOpen ? "true" : "false");
            if (isOpen && helpClose) {
                helpClose.focus();
            }
        }

        function buyShopItem(itemId) {
            var item = SHOP_ITEMS[itemId];
            if (!item || game.ended) {
                return;
            }

            if (item.barrier) {
                buyBarrierPack(itemId, item);
                return;
            }

            if (game.coins < item.cost) {
                return;
            }

            if (itemId === "knife" && game.inventory.knife) {
                return;
            }

            game.coins -= item.cost;
            if (itemId === "knife") {
                game.inventory.knife = true;
            } else if (itemId === "spear") {
                game.inventory.spear += 1;
            }
            renderShop();
        }

        function buyBarrierPack(itemId, item) {
            if (game.inventory[itemId] > 0) {
                game.placementMode = itemId;
                renderShop();
                return;
            }

            if (game.coins < item.cost || game.barrierCooldown > 0 || getBarrierInventoryTotal() > 0) {
                return;
            }

            game.coins -= item.cost;
            game.inventory[itemId] = BARRIER_PACK_SIZE;
            game.placementMode = itemId;
            game.barrierCooldown = randomBarrierCooldown();
            renderShop();
        }

        function getBarrierInventoryTotal() {
            return (game.inventory.brick || 0) + (game.inventory.stone || 0);
        }

        function renderShop() {
            if (!shop || !game) {
                return;
            }

            var coinCount = shop.querySelector("[data-coin-count]");
            var knifeStatus = shop.querySelector("[data-knife-status]");
            var spearStatus = shop.querySelector("[data-spear-status]");
            var knifeButton = shop.querySelector('[data-shop-buy="knife"]');
            var spearButton = shop.querySelector('[data-shop-buy="spear"]');
            var brickStatus = shop.querySelector("[data-brick-status]");
            var stoneStatus = shop.querySelector("[data-stone-status]");
            var brickButton = shop.querySelector('[data-shop-buy="brick"]');
            var stoneButton = shop.querySelector('[data-shop-buy="stone"]');
            var barrierNote = shop.querySelector("[data-barrier-note]");

            if (coinCount) {
                coinCount.textContent = game.coins + (game.coins === 1 ? " coin" : " coins");
            }
            if (knifeStatus) {
                knifeStatus.textContent = game.inventory.knife ? "Owned" : "Not owned";
            }
            if (spearStatus) {
                spearStatus.textContent = game.inventory.spear + " owned";
            }
            if (knifeButton) {
                knifeButton.disabled = game.ended || game.inventory.knife || game.coins < SHOP_ITEMS.knife.cost;
            }
            if (spearButton) {
                spearButton.disabled = game.ended || game.coins < SHOP_ITEMS.spear.cost;
            }
            renderBarrierStatus("brick", brickStatus);
            renderBarrierStatus("stone", stoneStatus);
            updateBarrierButton("brick", brickButton);
            updateBarrierButton("stone", stoneButton);
            if (barrierNote) {
                barrierNote.hidden = !(game.barrierNoticeTimer > 0 && game.barrierNotice);
                barrierNote.textContent = game.barrierNotice || "";
            }
        }

        function renderBarrierStatus(itemId, status) {
            var stock = game.inventory[itemId] || 0;
            if (!status) {
                return;
            }

            if (stock > 0) {
                status.textContent = (game.placementMode === itemId ? "Placing, " : "Ready, ") + stock + " left";
                return;
            }

            if (game.barrierCooldown > 0) {
                status.textContent = "Restock in " + Math.ceil(game.barrierCooldown) + "s";
                return;
            }

            if (getBarrierInventoryTotal() > 0) {
                status.textContent = "Finish current pack";
                return;
            }

            status.textContent = BARRIER_PACK_SIZE + " barriers";
        }

        function updateBarrierButton(itemId, button) {
            var stock = game.inventory[itemId] || 0;
            var lockedByPack = getBarrierInventoryTotal() > 0 && stock <= 0;
            if (!button) {
                return;
            }

            button.disabled = game.ended || (stock <= 0 && (game.coins < SHOP_ITEMS[itemId].cost || game.barrierCooldown > 0 || lockedByPack));
            button.setAttribute("aria-pressed", game.placementMode === itemId ? "true" : "false");
        }

        function loop(now) {
            if (!running) {
                return;
            }

            var delta = Math.min((now - lastTime) / 1000, 0.05);
            lastTime = now;
            update(delta);
            draw();
            animationFrame = window.requestAnimationFrame(loop);
        }

        function update(delta) {
            if (game.ended) {
                return;
            }

            game.elapsedTime += delta;
            updateBarrierTimers(delta);
            var speedFactor = settings.reducedMotion ? 0.55 : 1;
            movePlayer(delta * speedFactor);
            moveAnimals(delta * speedFactor);
            moveBadPerson(delta, settings.reducedMotion ? 0.7 : 1);
            if (game.ended) {
                return;
            }
            moveWolves(delta, settings.reducedMotion ? 0.72 : 1);
            if (game.ended) {
                return;
            }
            updateCarriedAnimal();
            updateReleasedAnimal();
            updateWolfCarriedAnimals();
            checkWeaponHits();
            updateCoinDrops(delta);
            collectCoins();
            checkCatchAndDrop();
            if (game.ended) {
                return;
            }
            growObstacles(delta);
            nextGrowth -= delta;
            if (nextGrowth <= 0) {
                addGrowingObstacle();
                nextGrowth = 6 + Math.random() * 4;
            }
        }

        function updateBarrierTimers(delta) {
            var shouldRender = false;
            if (game.barrierCooldown > 0) {
                var previousCooldownLabel = Math.ceil(game.barrierCooldown);
                game.barrierCooldown = Math.max(0, game.barrierCooldown - delta);
                shouldRender = shouldRender || Math.ceil(game.barrierCooldown) !== previousCooldownLabel;
            }

            if (game.barrierNoticeTimer > 0) {
                game.barrierNoticeTimer = Math.max(0, game.barrierNoticeTimer - delta);
                shouldRender = shouldRender || game.barrierNoticeTimer === 0;
            }

            if (shouldRender) {
                renderShop();
            }
        }

        function movePlayer(delta) {
            var player = game.player;
            var dx = player.targetX - player.x;
            var dy = player.targetY - player.y;
            var distance = Math.hypot(dx, dy);
            if (distance < 1) {
                return;
            }

            var step = Math.min(distance, player.speed * delta);
            moveEntity(player, (dx / distance) * step, (dy / distance) * step);
        }

        function moveAnimals(delta) {
            game.animals.forEach(function (animal) {
                if (animal.rescued || animal.carried) {
                    return;
                }

                animal.wanderTime -= delta;
                if (animal.wanderTime <= 0) {
                    chooseAnimalDirection(animal);
                }

                var dx = Math.cos(animal.angle) * animal.speed * delta;
                var dy = Math.sin(animal.angle) * animal.speed * delta;
                var previousX = animal.x;
                var previousY = animal.y;
                moveEntity(animal, dx, dy);

                if (animal.x === previousX && animal.y === previousY) {
                    chooseAnimalDirection(animal);
                }

                if (animal.x < animal.r + 8 || animal.x > WORLD_WIDTH - animal.r - 8) {
                    animal.angle = Math.PI - animal.angle;
                }
                if (animal.y < animal.r + 8 || animal.y > WORLD_HEIGHT - animal.r - 8) {
                    animal.angle = -animal.angle;
                }
            });
        }

        function moveBadPerson(delta, speedFactor) {
            var badPerson = game.badPerson;
            if (badPerson.hiddenTime > 0) {
                badPerson.hiddenTime = Math.max(0, badPerson.hiddenTime - delta);
                if (badPerson.hiddenTime === 0) {
                    spawnBadPerson();
                }
                return;
            }

            if (badPerson.mode === "patrol" && game.rescued > 0) {
                planBadPersonReleaseRun();
            }

            if (!badPerson.route.length || badPerson.routeIndex >= badPerson.route.length) {
                planBadPersonExitRoute();
            }

            var target = badPerson.route[badPerson.routeIndex];
            moveBadPersonToward(target, delta * speedFactor);

            if (distance(badPerson, game.player) < badPerson.r + game.player.r + 4) {
                recoverReleasedAnimal();
                sendBadPersonAway();
                return;
            }

            if (distance(badPerson, target) <= (target.radius || 18)) {
                advanceBadPersonRoute(target);
            }
        }

        function moveBadPersonToward(target, delta) {
            var badPerson = game.badPerson;
            var dx = target.x - badPerson.x;
            var dy = target.y - badPerson.y;
            var targetDistance = Math.hypot(dx, dy);
            if (targetDistance <= 1) {
                return;
            }

            var step = Math.min(targetDistance, badPerson.speed * delta);
            badPerson.angle = Math.atan2(dy, dx);
            badPerson.x += (dx / targetDistance) * step;
            badPerson.y += (dy / targetDistance) * step;
            resolveBarrierCollision(badPerson);
        }

        function updateCoinDrops(delta) {
            game.coinDropTimer -= delta;
            if (game.coinDropTimer > 0 || !isBadPersonVisible()) {
                return;
            }

            dropBadPersonCoins();
            game.coinDropTimer += COIN_DROP_INTERVAL;
            if (game.coinDropTimer <= 0) {
                game.coinDropTimer = COIN_DROP_INTERVAL;
            }
        }

        function isBadPersonVisible() {
            return game.badPerson && game.badPerson.hiddenTime <= 0 && !game.ended;
        }

        function dropBadPersonCoins() {
            var badPerson = game.badPerson;
            var dropCount = Math.min(COINS_PER_DROP, MAX_VISIBLE_COINS - game.coinPickups.length);
            for (var index = 0; index < dropCount; index += 1) {
                var angle = (Math.PI * 2 * index) / COINS_PER_DROP + Math.random() * 0.55;
                var spread = 20 + Math.random() * 18;
                game.coinPickups.push({
                    x: clamp(badPerson.x + Math.cos(angle) * spread, 12, WORLD_WIDTH - 12),
                    y: clamp(badPerson.y + Math.sin(angle) * spread, 12, WORLD_HEIGHT - 12),
                    r: 8,
                    value: 1,
                    bob: Math.random() * Math.PI * 2
                });
            }
        }

        function collectCoins() {
            var collected = false;
            for (var index = game.coinPickups.length - 1; index >= 0; index -= 1) {
                var coin = game.coinPickups[index];
                if (distance(game.player, coin) <= game.player.r + coin.r + 6) {
                    game.coins += coin.value;
                    game.coinPickups.splice(index, 1);
                    collected = true;
                }
            }

            if (collected) {
                renderShop();
            }
        }

        function spawnBadPerson() {
            var badPerson = game.badPerson;
            var spawn = findBadPersonEdgePoint(BAD_PERSON_SAFE_DISTANCE);
            badPerson.x = spawn.x;
            badPerson.y = spawn.y;
            badPerson.targetX = spawn.x;
            badPerson.targetY = spawn.y;
            badPerson.hiddenTime = 0;
            badPerson.releaseAnimal = null;
            badPerson.dropPoint = null;

            if (game.rescued > 0) {
                planBadPersonReleaseRun();
            } else {
                planBadPersonPatrolRoute();
            }
        }

        function sendBadPersonAway() {
            var badPerson = game.badPerson;
            if (badPerson.releaseAnimal) {
                dropReleasedAnimal();
            }
            badPerson.hiddenTime = randomBadPersonDelay();
            badPerson.mode = "hidden";
            badPerson.route = [];
            badPerson.routeIndex = 0;
            badPerson.releaseAnimal = null;
            badPerson.dropPoint = null;
            badPerson.x = -BAD_PERSON_EDGE_OFFSET;
            badPerson.y = -BAD_PERSON_EDGE_OFFSET;
        }

        function advanceBadPersonRoute(target) {
            var badPerson = game.badPerson;
            if (target.action === "release") {
                releaseRescuedAnimal();
                return;
            }

            if (target.action === "drop") {
                dropReleasedAnimal();
                if (!game.ended) {
                    badPerson.routeIndex += 1;
                }
                return;
            }

            if (target.action === "leave") {
                sendBadPersonAway();
                return;
            }

            badPerson.routeIndex += 1;
            if (badPerson.routeIndex >= badPerson.route.length) {
                sendBadPersonAway();
            }
        }

        function planBadPersonPatrolRoute() {
            var badPerson = game.badPerson;
            setBadPersonRoute("patrol", [
                findSneakyPoint(badPerson),
                findSneakyPoint(badPerson),
                findBadPersonEdgePoint(BAD_PERSON_SAFE_DISTANCE)
            ]);
        }

        function planBadPersonReleaseRun() {
            var badPerson = game.badPerson;
            var zoo = game.zoo;
            var approach = findZooApproachPoint();
            setBadPersonRoute("release", [
                findSneakyPoint(badPerson),
                approach,
                {
                    x: zoo.x + zoo.w / 2,
                    y: zoo.y + zoo.h / 2,
                    radius: 20,
                    action: "release"
                }
            ]);
        }

        function planBadPersonExitRoute() {
            var exit = findBadPersonEdgePoint(BAD_PERSON_SAFE_DISTANCE);
            var dropPoint = edgeDropPoint(exit, game.badPerson.releaseAnimal ? game.badPerson.releaseAnimal.r : game.badPerson.r);
            game.badPerson.dropPoint = dropPoint;
            setBadPersonRoute("exit", [
                findSneakyPoint(game.badPerson),
                {
                    x: dropPoint.x,
                    y: dropPoint.y,
                    radius: 16,
                    action: "drop"
                },
                {
                    x: exit.x,
                    y: exit.y,
                    radius: 16,
                    action: "leave"
                }
            ]);
        }

        function setBadPersonRoute(mode, route) {
            var badPerson = game.badPerson;
            badPerson.mode = mode;
            badPerson.route = route;
            badPerson.routeIndex = 0;
        }

        function releaseRescuedAnimal() {
            var animal = findRescuedAnimal();
            if (!animal) {
                planBadPersonExitRoute();
                return;
            }

            var badPerson = game.badPerson;
            animal.rescued = false;
            animal.carried = true;
            animal.rescueOrder = 0;
            game.rescued = Math.max(0, game.rescued - 1);
            layoutRescuedAnimals();
            badPerson.releaseAnimal = animal;
            planBadPersonExitRoute();
        }

        function findRescuedAnimal() {
            var latestAnimal = null;
            for (var index = game.animals.length - 1; index >= 0; index -= 1) {
                if (game.animals[index].rescued && (!latestAnimal || game.animals[index].rescueOrder > latestAnimal.rescueOrder)) {
                    latestAnimal = game.animals[index];
                }
            }
            return latestAnimal;
        }

        function recoverReleasedAnimal() {
            var badPerson = game.badPerson;
            var animal = badPerson.releaseAnimal;
            if (!animal) {
                return;
            }

            animal.rescued = true;
            animal.carried = false;
            game.rescueSequence += 1;
            animal.rescueOrder = game.rescueSequence;
            game.rescued += 1;
            badPerson.releaseAnimal = null;
            badPerson.dropPoint = null;
            layoutRescuedAnimals();
        }

        function dropReleasedAnimal() {
            var badPerson = game.badPerson;
            var animal = badPerson.releaseAnimal;
            if (!animal) {
                return;
            }

            var spot = badPerson.dropPoint || edgeDropPoint(badPerson, animal.r);
            animal.carried = false;
            animal.rescued = false;
            animal.rescueOrder = 0;
            animal.x = spot.x;
            animal.y = spot.y;
            animal.angle = angleFromEdge(spot);
            animal.wanderTime = 0.6 + Math.random();
            badPerson.releaseAnimal = null;
            badPerson.dropPoint = null;
            recordAnimalStolen();
        }

        function updateReleasedAnimal() {
            var badPerson = game.badPerson;
            var animal = badPerson.releaseAnimal;
            if (!animal) {
                return;
            }

            animal.x = clamp(badPerson.x - Math.cos(badPerson.angle) * 26, animal.r, WORLD_WIDTH - animal.r);
            animal.y = clamp(badPerson.y - Math.sin(badPerson.angle) * 26, animal.r, WORLD_HEIGHT - animal.r);
            animal.angle = badPerson.angle;
        }

        function moveWolves(delta, speedFactor) {
            game.wolves.forEach(function (wolf) {
                moveWolf(wolf, delta, speedFactor);
            });
        }

        function moveWolf(wolf, delta, speedFactor) {
            if (wolf.hiddenTime > 0) {
                wolf.hiddenTime = Math.max(0, wolf.hiddenTime - delta);
                if (wolf.hiddenTime === 0) {
                    spawnWolf(wolf);
                }
                return;
            }

            if (wolf.mode === "patrol" && game.rescued > 0) {
                planWolfStealRun(wolf);
            }

            if (!wolf.route.length || wolf.routeIndex >= wolf.route.length) {
                sendWolfAway(wolf);
                return;
            }

            var target = wolf.route[wolf.routeIndex];
            moveWolfToward(wolf, target, delta * speedFactor);

            if (distance(wolf, target) <= (target.radius || 16)) {
                advanceWolfRoute(wolf, target);
            }
        }

        function moveWolfToward(wolf, target, delta) {
            var dx = target.x - wolf.x;
            var dy = target.y - wolf.y;
            var targetDistance = Math.hypot(dx, dy);
            if (targetDistance <= 1) {
                return;
            }

            var step = Math.min(targetDistance, wolf.speed * delta);
            wolf.angle = Math.atan2(dy, dx);
            wolf.x += (dx / targetDistance) * step;
            wolf.y += (dy / targetDistance) * step;
            resolveBarrierCollision(wolf);
        }

        function spawnWolf(wolf) {
            var spawn = findWolfEdgePoint();
            wolf.x = spawn.x;
            wolf.y = spawn.y;
            wolf.angle = angleFromEdge(edgeDropPoint(spawn, wolf.r));
            wolf.hiddenTime = 0;
            wolf.releaseAnimal = null;
            wolf.dropPoint = null;

            if (game.rescued > 0) {
                planWolfStealRun(wolf);
            } else {
                planWolfPatrolRoute(wolf);
            }
        }

        function planWolfPatrolRoute(wolf) {
            var exit = findWolfEdgePoint();
            setWolfRoute(wolf, "patrol", [
                findSneakyPoint(wolf),
                {
                    x: exit.x,
                    y: exit.y,
                    radius: 18,
                    action: "leave"
                }
            ]);
        }

        function planWolfStealRun(wolf) {
            var zoo = game.zoo;
            var approach = findZooApproachPoint();
            setWolfRoute(wolf, "steal", [
                findSneakyPoint(wolf),
                approach,
                {
                    x: zoo.x + zoo.w / 2,
                    y: zoo.y + zoo.h / 2,
                    radius: 18,
                    action: "steal"
                }
            ]);
        }

        function setWolfRoute(wolf, mode, route) {
            wolf.mode = mode;
            wolf.route = route;
            wolf.routeIndex = 0;
        }

        function advanceWolfRoute(wolf, target) {
            if (target.action === "steal") {
                wolfStealAnimal(wolf);
                return;
            }

            if (target.action === "drop") {
                dropWolfAnimal(wolf);
                if (!game.ended) {
                    wolf.routeIndex += 1;
                }
                return;
            }

            if (target.action === "leave") {
                sendWolfAway(wolf);
                return;
            }

            wolf.routeIndex += 1;
            if (wolf.routeIndex >= wolf.route.length) {
                sendWolfAway(wolf);
            }
        }

        function wolfStealAnimal(wolf) {
            var animal = findRescuedAnimal();
            if (!animal) {
                planWolfPatrolRoute(wolf);
                return;
            }

            animal.rescued = false;
            animal.carried = true;
            animal.rescueOrder = 0;
            game.rescued = Math.max(0, game.rescued - 1);
            layoutRescuedAnimals();

            wolf.releaseAnimal = animal;
            planWolfExitRoute(wolf);
        }

        function planWolfExitRoute(wolf) {
            var exit = findWolfEdgePoint();
            var dropPoint = edgeDropPoint(exit, wolf.releaseAnimal ? wolf.releaseAnimal.r : wolf.r);
            wolf.dropPoint = dropPoint;
            setWolfRoute(wolf, "exit", [
                findSneakyPoint(wolf),
                {
                    x: dropPoint.x,
                    y: dropPoint.y,
                    radius: 16,
                    action: "drop"
                },
                {
                    x: exit.x,
                    y: exit.y,
                    radius: 16,
                    action: "leave"
                }
            ]);
        }

        function updateWolfCarriedAnimals() {
            game.wolves.forEach(function (wolf) {
                var animal = wolf.releaseAnimal;
                if (!animal) {
                    return;
                }
                animal.x = clamp(wolf.x - Math.cos(wolf.angle) * 24, animal.r, WORLD_WIDTH - animal.r);
                animal.y = clamp(wolf.y - Math.sin(wolf.angle) * 24, animal.r, WORLD_HEIGHT - animal.r);
                animal.angle = wolf.angle;
            });
        }

        function checkWeaponHits() {
            game.wolves.forEach(function (wolf) {
                if (wolf.hiddenTime > 0) {
                    return;
                }

                var hitDistance = distance(game.player, wolf);
                if (game.inventory.knife && hitDistance <= game.player.r + wolf.r + KNIFE_REACH) {
                    defeatWolf(wolf);
                    return;
                }

                if (game.inventory.spear > 0 && hitDistance <= game.player.r + wolf.r + SPEAR_REACH) {
                    game.inventory.spear -= 1;
                    renderShop();
                    defeatWolf(wolf);
                }
            });
        }

        function defeatWolf(wolf) {
            recoverWolfAnimal(wolf);
            game.wolvesDefeated += 1;
            wolf.hiddenTime = randomWolfDelay();
            wolf.mode = "hidden";
            wolf.route = [];
            wolf.routeIndex = 0;
            wolf.releaseAnimal = null;
            wolf.dropPoint = null;
            wolf.x = -WOLF_EDGE_OFFSET;
            wolf.y = -WOLF_EDGE_OFFSET;
        }

        function recoverWolfAnimal(wolf) {
            var animal = wolf.releaseAnimal;
            if (!animal) {
                return;
            }

            animal.rescued = true;
            animal.carried = false;
            game.rescueSequence += 1;
            animal.rescueOrder = game.rescueSequence;
            game.rescued += 1;
            layoutRescuedAnimals();
        }

        function dropWolfAnimal(wolf) {
            var animal = wolf.releaseAnimal;
            if (!animal) {
                return;
            }

            var spot = wolf.dropPoint || edgeDropPoint(wolf, animal.r);
            animal.carried = false;
            animal.rescued = false;
            animal.rescueOrder = 0;
            animal.x = spot.x;
            animal.y = spot.y;
            animal.angle = angleFromEdge(spot);
            animal.wanderTime = 0.6 + Math.random();
            wolf.releaseAnimal = null;
            wolf.dropPoint = null;
            recordAnimalStolen();
        }

        function sendWolfAway(wolf) {
            if (wolf.releaseAnimal) {
                dropWolfAnimal(wolf);
            }
            wolf.hiddenTime = randomWolfDelay();
            wolf.mode = "hidden";
            wolf.route = [];
            wolf.routeIndex = 0;
            wolf.releaseAnimal = null;
            wolf.dropPoint = null;
            wolf.x = -WOLF_EDGE_OFFSET;
            wolf.y = -WOLF_EDGE_OFFSET;
        }

        function findWolfEdgePoint() {
            var point = findBadPersonEdgePoint(WOLF_SAFE_DISTANCE);
            if (point.x < 0) {
                point.x = -WOLF_EDGE_OFFSET;
            } else if (point.x > WORLD_WIDTH) {
                point.x = WORLD_WIDTH + WOLF_EDGE_OFFSET;
            }
            if (point.y < 0) {
                point.y = -WOLF_EDGE_OFFSET;
            } else if (point.y > WORLD_HEIGHT) {
                point.y = WORLD_HEIGHT + WOLF_EDGE_OFFSET;
            }
            return point;
        }

        function findSneakyPoint(fromPoint) {
            var zooBuffer = {
                x: game.zoo.x - 90,
                y: game.zoo.y - 90,
                w: game.zoo.w + 180,
                h: game.zoo.h + 180
            };

            for (var attempt = 0; attempt < 80; attempt += 1) {
                var spot = {
                    x: 76 + Math.random() * (WORLD_WIDTH - 152),
                    y: 76 + Math.random() * (WORLD_HEIGHT - 152),
                    r: game.badPerson.r
                };
                if (pointInRect(spot.x, spot.y, zooBuffer) || distance(spot, game.player) < 120 || distance(spot, fromPoint) < 120) {
                    continue;
                }
                if (isBlockedByObstacle(spot)) {
                    continue;
                }
                return spot;
            }

            return { x: WORLD_WIDTH * 0.72, y: WORLD_HEIGHT * 0.74, r: game.badPerson.r };
        }

        function findZooApproachPoint() {
            var zoo = game.zoo;
            var points = [
                { x: zoo.x + zoo.w + 92, y: zoo.y + zoo.h + 76 },
                { x: zoo.x + zoo.w + 118, y: zoo.y + zoo.h / 2 },
                { x: zoo.x + zoo.w / 2, y: zoo.y + zoo.h + 104 },
                { x: zoo.x + zoo.w + 148, y: zoo.y + zoo.h + 124 }
            ];
            return points[Math.floor(Math.random() * points.length)];
        }

        function findBadPersonEdgePoint(minPlayerDistance) {
            var zooCenter = {
                x: game.zoo.x + game.zoo.w / 2,
                y: game.zoo.y + game.zoo.h / 2
            };
            var bestPoint = randomBadPersonEdgePoint();
            var bestScore = -1;

            for (var attempt = 0; attempt < 60; attempt += 1) {
                var point = randomBadPersonEdgePoint();
                var playerDistance = distance(point, game.player);
                var zooDistance = distance(point, zooCenter);
                var score = Math.min(playerDistance, minPlayerDistance) + Math.min(zooDistance, BAD_PERSON_ZOO_DISTANCE) + Math.random() * 40;
                if (playerDistance >= minPlayerDistance && zooDistance >= BAD_PERSON_ZOO_DISTANCE) {
                    return point;
                }
                if (score > bestScore) {
                    bestScore = score;
                    bestPoint = point;
                }
            }

            return bestPoint;
        }

        function randomBadPersonEdgePoint() {
            var edge = Math.floor(Math.random() * 4);
            if (edge === 0) {
                return { x: Math.random() * WORLD_WIDTH, y: -BAD_PERSON_EDGE_OFFSET };
            }
            if (edge === 1) {
                return { x: WORLD_WIDTH + BAD_PERSON_EDGE_OFFSET, y: Math.random() * WORLD_HEIGHT };
            }
            if (edge === 2) {
                return { x: Math.random() * WORLD_WIDTH, y: WORLD_HEIGHT + BAD_PERSON_EDGE_OFFSET };
            }
            return { x: -BAD_PERSON_EDGE_OFFSET, y: Math.random() * WORLD_HEIGHT };
        }

        function edgeDropPoint(edgePoint, radius) {
            var padding = radius + 8;
            return {
                x: clamp(edgePoint.x, padding, WORLD_WIDTH - padding),
                y: clamp(edgePoint.y, padding, WORLD_HEIGHT - padding)
            };
        }

        function angleFromEdge(point) {
            if (point.x <= 30) {
                return 0;
            }
            if (point.x >= WORLD_WIDTH - 30) {
                return Math.PI;
            }
            if (point.y <= 30) {
                return Math.PI / 2;
            }
            return -Math.PI / 2;
        }

        function isBlockedByObstacle(entity) {
            for (var index = 0; index < game.obstacles.length; index += 1) {
                if (distance(entity, game.obstacles[index]) < entity.r + game.obstacles[index].radius + 18) {
                    return true;
                }
            }
            return false;
        }

        function chooseAnimalDirection(animal) {
            var awayFromPlayer = Math.atan2(animal.y - game.player.y, animal.x - game.player.x);
            var randomTurn = (Math.random() - 0.5) * Math.PI;
            animal.angle = distance(animal, game.player) < 170 ? awayFromPlayer + randomTurn : Math.random() * Math.PI * 2;
            animal.wanderTime = 0.8 + Math.random() * 1.8;
        }

        function moveEntity(entity, dx, dy) {
            entity.x = clamp(entity.x + dx, entity.r, WORLD_WIDTH - entity.r);
            entity.y = clamp(entity.y + dy, entity.r, WORLD_HEIGHT - entity.r);

            game.obstacles.forEach(function (obstacle) {
                var radius = obstacle.currentRadius + entity.r;
                var ox = entity.x - obstacle.x;
                var oy = entity.y - obstacle.y;
                var overlapDistance = Math.hypot(ox, oy);
                if (overlapDistance < radius) {
                    if (entity === game.player) {
                        game.touchedObstacle = true;
                    }
                }
                if (overlapDistance > 0 && overlapDistance < radius) {
                    var push = radius - overlapDistance;
                    entity.x += (ox / overlapDistance) * push;
                    entity.y += (oy / overlapDistance) * push;
                }
            });

            entity.x = clamp(entity.x, entity.r, WORLD_WIDTH - entity.r);
            entity.y = clamp(entity.y, entity.r, WORLD_HEIGHT - entity.r);
        }

        function resolveBarrierCollision(entity) {
            game.placedBarriers.forEach(function (barrier) {
                var radius = barrier.currentRadius + entity.r;
                var ox = entity.x - barrier.x;
                var oy = entity.y - barrier.y;
                var overlapDistance = Math.hypot(ox, oy);
                if (overlapDistance > 0 && overlapDistance < radius) {
                    var push = radius - overlapDistance;
                    entity.x += (ox / overlapDistance) * push;
                    entity.y += (oy / overlapDistance) * push;
                } else if (overlapDistance === 0) {
                    entity.x += radius;
                }
            });
        }

        function placeSelectedBarrier(point) {
            var itemId = game.placementMode;
            if (game.ended || !itemId) {
                return false;
            }

            if (!game.inventory[itemId]) {
                game.placementMode = null;
                renderShop();
                return false;
            }

            var barrier = createPlacedBarrier(itemId, point.x, point.y);
            if (!isSafeBarrierSpot(barrier, game)) {
                setBarrierNotice("Need open space for barrier.");
                return true;
            }

            game.obstacles.push(barrier);
            game.placedBarriers.push(barrier);
            game.inventory[itemId] -= 1;
            if (game.inventory[itemId] <= 0) {
                game.inventory[itemId] = 0;
                game.placementMode = null;
            }

            if (barrierCoverageTooHigh()) {
                resetPlacedBarriers("Barriers reset: too much map blocked.");
            } else if (barrierSpansMap()) {
                resetPlacedBarriers("Barriers reset: wall crossed map.");
            } else {
                renderShop();
            }

            return true;
        }

        function setBarrierNotice(message) {
            game.barrierNotice = message;
            game.barrierNoticeTimer = BARRIER_NOTICE_SECONDS;
            renderShop();
        }

        function resetPlacedBarriers(message) {
            game.obstacles = game.obstacles.filter(function (obstacle) {
                return !obstacle.barrier;
            });
            game.placedBarriers = [];
            game.placementMode = null;
            setBarrierNotice(message);
        }

        function barrierCoverageTooHigh() {
            var barrierArea = game.placedBarriers.reduce(function (sum, barrier) {
                return sum + Math.PI * barrier.radius * barrier.radius;
            }, 0);

            return barrierArea / (WORLD_WIDTH * WORLD_HEIGHT) >= BARRIER_COVERAGE_LIMIT;
        }

        function barrierSpansMap() {
            var barriers = game.placedBarriers;
            var visited = [];

            for (var start = 0; start < barriers.length; start += 1) {
                if (visited[start]) {
                    continue;
                }

                var stack = [start];
                var touchesLeft = false;
                var touchesRight = false;
                var touchesTop = false;
                var touchesBottom = false;
                visited[start] = true;

                while (stack.length) {
                    var index = stack.pop();
                    var barrier = barriers[index];
                    touchesLeft = touchesLeft || barrier.x - barrier.radius <= BARRIER_WALL_GAP;
                    touchesRight = touchesRight || barrier.x + barrier.radius >= WORLD_WIDTH - BARRIER_WALL_GAP;
                    touchesTop = touchesTop || barrier.y - barrier.radius <= BARRIER_WALL_GAP;
                    touchesBottom = touchesBottom || barrier.y + barrier.radius >= WORLD_HEIGHT - BARRIER_WALL_GAP;

                    if ((touchesLeft && touchesRight) || (touchesTop && touchesBottom)) {
                        return true;
                    }

                    for (var next = 0; next < barriers.length; next += 1) {
                        if (visited[next]) {
                            continue;
                        }
                        if (distance(barrier, barriers[next]) <= barrier.radius + barriers[next].radius + BARRIER_WALL_GAP) {
                            visited[next] = true;
                            stack.push(next);
                        }
                    }
                }
            }

            return false;
        }

        function updateCarriedAnimal() {
            var animal = game.player.carrying;
            if (!animal) {
                return;
            }
            animal.x = clamp(game.player.x + 18, animal.r, WORLD_WIDTH - animal.r);
            animal.y = clamp(game.player.y - 18, animal.r, WORLD_HEIGHT - animal.r);
        }

        function checkCatchAndDrop() {
            var player = game.player;

            if (!player.carrying) {
                game.animals.some(function (animal) {
                    if (!animal.rescued && !animal.carried && distance(player, animal) < player.r + animal.r + 4 + player.catchBonus) {
                        animal.carried = true;
                        player.carrying = animal;
                        return true;
                    }
                    return false;
                });
            }

            if (player.carrying && pointInRect(player.x, player.y, game.zoo)) {
                player.carrying.rescued = true;
                player.carrying.carried = false;
                game.rescueSequence += 1;
                player.carrying.rescueOrder = game.rescueSequence;
                game.rescued += 1;
                layoutRescuedAnimals();
                player.carrying = null;
            }

            if (game.rescued === game.animals.length) {
                endGame();
            }
        }

        function recordAnimalStolen() {
            game.animalsStolen += 1;
            if (game.animalsStolen >= STOLEN_LOSS_LIMIT) {
                loseGame();
            }
        }

        function endGame() {
            if (game.ended) {
                return;
            }
            game.ended = true;
            game.failed = false;
            game.score = game.rescued;
            game.earnedBadges = awardBadges();
            game.endStartedAt = performance.now();
            game.fireworks = settings.reducedMotion ? [] : createFireworks();
            renderShop();
        }

        function loseGame() {
            if (game.ended) {
                return;
            }
            game.ended = true;
            game.failed = true;
            game.score = game.rescued;
            game.earnedBadges = [];
            game.endStartedAt = performance.now();
            game.fireworks = [];
            renderShop();
        }

        function awardBadges() {
            var earnedBadges = [];
            if (game.elapsedTime < FAST_BADGE_LIMIT_SECONDS) {
                earnedBadges.push("fast");
            }
            if (!game.touchedObstacle) {
                earnedBadges.push("smooth");
            }
            if (game.animalsStolen === 0) {
                earnedBadges.push("safeKeeper");
            }

            if (earnedBadges.length) {
                game.unlockedBadges = mergeBadgeIds(game.unlockedBadges, earnedBadges);
                saveUnlockedBadges(game.unlockedBadges);
            }

            return earnedBadges;
        }

        function createFireworks() {
            var colors = settings.highContrast ? ["#ffe600", "#ffffff", "#00e5ff", "#ff5fb7"] : ["#f0b13d", "#ffffff", "#2d65b3", "#cc4b8c", "#67bd5f"];
            var bursts = [
                { x: WORLD_WIDTH * 0.28, y: WORLD_HEIGHT * 0.28, delay: 0 },
                { x: WORLD_WIDTH * 0.72, y: WORLD_HEIGHT * 0.24, delay: 180 },
                { x: WORLD_WIDTH * 0.5, y: WORLD_HEIGHT * 0.2, delay: 360 },
                { x: WORLD_WIDTH * 0.22, y: WORLD_HEIGHT * 0.58, delay: 540 },
                { x: WORLD_WIDTH * 0.78, y: WORLD_HEIGHT * 0.57, delay: 720 }
            ];
            var fireworks = [];

            bursts.forEach(function (burst, burstIndex) {
                var particleCount = 24;
                for (var index = 0; index < particleCount; index += 1) {
                    fireworks.push({
                        x: burst.x,
                        y: burst.y,
                        angle: (Math.PI * 2 * index) / particleCount + Math.random() * 0.12,
                        speed: 76 + Math.random() * 92,
                        delay: burst.delay + Math.random() * 80,
                        duration: FIREWORK_DURATION_MS - burst.delay * 0.42,
                        color: colors[(index + burstIndex) % colors.length],
                        size: 3 + Math.floor(Math.random() * 3)
                    });
                }
            });

            return fireworks;
        }

        function growObstacles(delta) {
            game.obstacles.forEach(function (obstacle) {
                if (obstacle.currentRadius < obstacle.radius) {
                    var growthRate = settings.reducedMotion ? obstacle.radius : obstacle.radius * 1.8;
                    obstacle.currentRadius = Math.min(obstacle.radius, obstacle.currentRadius + growthRate * delta);
                }
            });
        }

        function addGrowingObstacle() {
            if (game.obstacles.length >= MAX_OBSTACLES) {
                return;
            }

            var obstacle = placeObstacle(true, game);
            if (obstacle) {
                game.obstacles.push(obstacle);
            }
        }

        function layoutRescuedAnimals() {
            var rescuedAnimals = game.animals.filter(function (animal) {
                return animal.rescued && !animal.carried;
            }).sort(function (a, b) {
                return a.rescueOrder - b.rescueOrder;
            });
            var count = rescuedAnimals.length;
            if (!count) {
                return;
            }

            var zoo = game.zoo;
            var columns = Math.ceil(Math.sqrt(count * (zoo.w / zoo.h)));
            var rows = Math.ceil(count / columns);
            var paddingX = 24;
            var paddingY = 24;
            var usableW = Math.max(1, zoo.w - paddingX * 2);
            var usableH = Math.max(1, zoo.h - paddingY * 2);

            rescuedAnimals.forEach(function (animal, index) {
                var column = index % columns;
                var row = Math.floor(index / columns);
                animal.x = zoo.x + paddingX + (columns === 1 ? usableW / 2 : (column / (columns - 1)) * usableW);
                animal.y = zoo.y + paddingY + (rows === 1 ? usableH / 2 : (row / (rows - 1)) * usableH);
                animal.angle = Math.PI / 2;
            });
        }

        function draw() {
            var palette = pixelPalette();

            drawField(palette);
            drawZoo(palette);
            game.obstacles.forEach(function (obstacle) {
                drawObstacle(obstacle, palette);
            });
            drawCoins();
            game.animals.forEach(function (animal) {
                if (!animal.rescued || animal.carried) {
                    drawAnimal(animal);
                }
            });
            game.animals.forEach(function (animal) {
                if (animal.rescued && !animal.carried) {
                    drawAnimal(animal);
                }
            });
            drawWolves();
            drawBadPerson();
            drawPlayer(palette);
            if (!game.ended) {
                drawTarget();
            } else {
                drawEndSequence();
            }
        }

        function drawField(palette) {
            context.clearRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
            context.fillStyle = palette.grassBase;
            context.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

            for (var y = 0; y < WORLD_HEIGHT; y += GRASS_TILE_SIZE) {
                for (var x = 0; x < WORLD_WIDTH; x += GRASS_TILE_SIZE) {
                    drawGrassTile(x, y, (x / GRASS_TILE_SIZE + y / GRASS_TILE_SIZE) % 4, palette);
                }
            }
        }

        function drawZoo(palette) {
            var zoo = game.zoo;
            var signW = 88;
            var signH = 36;
            var signX = zoo.x + zoo.w / 2 - signW / 2;
            var signY = zoo.y + zoo.h / 2 - signH / 2;

            drawPixelRect(zoo.x, zoo.y, zoo.w, zoo.h, palette.zooFloor);
            drawPixelRect(zoo.x + 8, zoo.y + 8, zoo.w - 16, zoo.h - 16, palette.zooShade);

            for (var x = zoo.x + 8; x < zoo.x + zoo.w; x += 20) {
                drawPixelRect(x, zoo.y - 6, 8, zoo.h + 12, palette.zooWood);
                drawPixelRect(x + 2, zoo.y - 2, 3, zoo.h + 4, palette.zooWoodLight);
            }

            drawPixelRect(zoo.x - 4, zoo.y + 12, zoo.w + 8, 8, palette.zooWood);
            drawPixelRect(zoo.x - 4, zoo.y + zoo.h - 22, zoo.w + 8, 8, palette.zooWood);
            drawPixelRect(signX, signY, signW, signH, palette.zooWood);
            drawPixelRect(signX + 6, signY + 6, signW - 12, signH - 12, palette.zooFloor);
            drawPixelSprite(ZOO_SIGN_SPRITE, zoo.x + zoo.w / 2, zoo.y + zoo.h / 2, 4, palette);
        }

        function drawObstacle(obstacle, palette) {
            if (obstacle.barrier) {
                drawBarrier(obstacle, palette);
                return;
            }

            var radius = obstacle.currentRadius;
            var sprites = obstacle.type === "tree" ? TREE_SPRITES : BRUSH_SPRITES;
            var sprite = sprites[obstacle.variant % sprites.length] || sprites[0];
            var finalScale = Math.max(2, Math.round(obstacle.radius / (obstacle.type === "tree" ? 8 : 9)));
            var scale = Math.max(1, Math.round(finalScale * (radius / obstacle.radius)));

            drawPixelSprite(sprite, obstacle.x, obstacle.y, scale, palette);
        }

        function drawBarrier(obstacle, palette) {
            if (obstacle.type === "brick") {
                drawBrickBarrier(obstacle, palette);
            } else {
                drawStoneBarrier(obstacle, palette);
            }
        }

        function drawBrickBarrier(obstacle, palette) {
            var width = Math.round(obstacle.currentRadius * 2.28);
            var height = Math.round(obstacle.currentRadius * 1.44);
            var left = obstacle.x - width / 2;
            var top = obstacle.y - height / 2;
            var brickHeight = Math.max(6, Math.round(height / 3.4));
            var brickWidth = Math.max(12, Math.round(width / 3));

            drawPixelRect(left + 3, top + height - 2, width - 6, 5, palette.spriteShadow);
            drawPixelRect(left, top + 3, width, height - 5, palette.brickMortar);

            for (var row = 0; row < 3; row += 1) {
                var y = top + 4 + row * (brickHeight + 1);
                var offset = row % 2 === 0 ? 1 : -brickWidth / 2 + 2;
                for (var x = left + offset; x < left + width - 2; x += brickWidth + 2) {
                    var clippedX = Math.max(left + 2, x);
                    var clippedW = Math.min(brickWidth, left + width - 2 - clippedX);
                    if (clippedW > 3) {
                        drawPixelRect(clippedX, y, clippedW, brickHeight, palette.brick);
                        drawPixelRect(clippedX + 2, y + 2, Math.max(2, clippedW - 5), 2, palette.brickLight);
                    }
                }
            }
        }

        function drawStoneBarrier(obstacle, palette) {
            var radius = obstacle.currentRadius;
            var left = obstacle.x - radius * 1.18;
            var top = obstacle.y - radius * 0.82;

            drawPixelRect(left + 5, top + radius * 1.35, radius * 1.7, 5, palette.spriteShadow);
            drawPixelRect(left + 3, top + 11, radius * 0.9, radius * 0.72, palette.stoneDark);
            drawPixelRect(left + 8, top + 6, radius * 0.82, radius * 0.78, palette.stone);
            drawPixelRect(left + 14, top + 9, radius * 0.34, 4, palette.stoneLight);
            drawPixelRect(left + radius * 0.86, top + 4, radius * 0.98, radius * 0.9, palette.stoneDark);
            drawPixelRect(left + radius, top, radius * 0.88, radius * 0.82, palette.stone);
            drawPixelRect(left + radius * 1.16, top + 4, radius * 0.36, 4, palette.stoneLight);
            drawPixelRect(left + radius * 1.42, top + 12, radius * 0.72, radius * 0.66, palette.stone);
            drawPixelRect(left + radius * 1.55, top + 15, radius * 0.3, 4, palette.stoneLight);
        }

        function drawCoins() {
            game.coinPickups.forEach(function (coin) {
                var y = coin.y + (settings.reducedMotion ? 0 : Math.sin(performance.now() / 220 + coin.bob) * 2);
                context.save();
                context.fillStyle = settings.highContrast ? "#ffe600" : "#f0b13d";
                context.strokeStyle = settings.highContrast ? "#ffffff" : "#8b5a2b";
                context.lineWidth = 2;
                context.beginPath();
                context.arc(coin.x, y, coin.r, 0, Math.PI * 2);
                context.fill();
                context.stroke();
                drawTextFit("C", coin.x, y + 4, 12, 12, 10, "900", settings.highContrast ? "#000000" : "#5a3a12", "center");
                context.restore();
            });
        }

        function drawWolves() {
            game.wolves.forEach(function (wolf) {
                if (wolf.hiddenTime > 0 || game.ended) {
                    return;
                }
                drawWolf(wolf);
            });
        }

        function drawWolf(wolf) {
            var facingLeft = Math.cos(wolf.angle) < 0;
            context.save();
            context.translate(Math.round(wolf.x), Math.round(wolf.y));
            if (facingLeft) {
                context.scale(-1, 1);
            }

            drawWolfPixelSprite();
            context.restore();
        }

        function drawWolfPixelSprite() {
            var scale = 3;
            var colors = {
                d: settings.highContrast ? "#ffffff" : "#2c3138",
                g: settings.highContrast ? "#000000" : "#5e6570",
                l: settings.highContrast ? "#ffe600" : "#8a929d",
                k: settings.highContrast ? "#ffffff" : "#1f2328",
                e: settings.highContrast ? "#ffe600" : "#f0b13d"
            };

            context.translate(-(WOLF_SPRITE[0].length * scale) / 2, -7 * scale);
            WOLF_SPRITE.forEach(function (row, y) {
                for (var x = 0; x < row.length; x += 1) {
                    var color = colors[row.charAt(x)];
                    if (color) {
                        context.fillStyle = color;
                        context.fillRect(x * scale, y * scale, scale, scale);
                    }
                }
            });
        }

        function drawAnimal(animal) {
            context.save();
            context.translate(animal.x, animal.y);
            context.rotate(Math.sin(performance.now() / 260 + animal.x) * 0.05);
            if (drawAnimalSprite(animal)) {
                context.restore();
                return;
            }
            if (animal.kind === "zebra") {
                drawZebra(animal);
            } else if (animal.kind === "turtle") {
                drawTurtle(animal);
            } else if (animal.kind === "squirrel") {
                drawSquirrel(animal);
            } else if (animal.kind === "hippo") {
                drawHippo(animal);
            } else if (animal.kind === "giraffe") {
                drawGiraffe(animal);
            } else if (animal.kind === "cow") {
                drawCow(animal);
            } else {
                drawButterfly(animal);
            }
            context.restore();
        }

        function drawAnimalSprite(animal) {
            var image = animalSprites[animal.kind];
            if (!image || !image.complete || !image.naturalWidth) {
                return false;
            }

            var direction = getSpriteDirection(animal);
            var rowOffset = direction === "front" ? 1 : direction === "back" ? 2 : 0;
            var moving = !settings.reducedMotion && !animal.rescued;
            var row = (moving ? 3 : 0) + rowOffset;
            var frames = moving ? 8 : 2;
            var frame = moving ? Math.floor(performance.now() / 130 + animal.spriteOffset) % frames : 0;
            var drawSize = Math.max(SPRITE_SIZE, Math.round(animal.r * 2.75));

            if (direction === "side" && Math.cos(animal.angle) < 0) {
                context.scale(-1, 1);
            }

            context.imageSmoothingEnabled = false;
            context.drawImage(
                image,
                frame * SPRITE_SIZE,
                row * SPRITE_SIZE,
                SPRITE_SIZE,
                SPRITE_SIZE,
                -drawSize / 2,
                -drawSize / 2,
                drawSize,
                drawSize
            );
            return true;
        }

        function getSpriteDirection(animal) {
            if (Math.abs(Math.sin(animal.angle)) > 0.68) {
                return Math.sin(animal.angle) > 0 ? "front" : "back";
            }
            return "side";
        }

        function drawZebra(animal) {
            context.fillStyle = "#f8f8f8";
            context.strokeStyle = "#1d1f1f";
            context.lineWidth = 2;
            context.beginPath();
            context.ellipse(0, 0, animal.r * 1.15, animal.r * 0.72, 0, 0, Math.PI * 2);
            context.fill();
            context.stroke();
            context.strokeStyle = "#1d1f1f";
            for (var i = -2; i <= 2; i += 1) {
                context.beginPath();
                context.moveTo(i * 6 - 3, -animal.r * 0.55);
                context.lineTo(i * 6 + 3, animal.r * 0.55);
                context.stroke();
            }
        }

        function drawTurtle(animal) {
            context.fillStyle = "#396b35";
            context.beginPath();
            context.ellipse(0, 0, animal.r * 1.15, animal.r * 0.82, 0, 0, Math.PI * 2);
            context.fill();
            context.strokeStyle = "#c4d67e";
            context.lineWidth = 2;
            context.stroke();
            context.fillStyle = "#75a653";
            context.beginPath();
            context.arc(animal.r * 0.9, 0, animal.r * 0.35, 0, Math.PI * 2);
            context.fill();
        }

        function drawSquirrel(animal) {
            context.fillStyle = "#a45f2b";
            context.beginPath();
            context.arc(0, 0, animal.r * 0.72, 0, Math.PI * 2);
            context.arc(animal.r * 0.7, -animal.r * 0.38, animal.r * 0.42, 0, Math.PI * 2);
            context.fill();
            context.strokeStyle = "#7c3d18";
            context.lineWidth = 5;
            context.beginPath();
            context.arc(-animal.r * 0.8, -animal.r * 0.05, animal.r * 0.75, Math.PI * 0.4, Math.PI * 1.5);
            context.stroke();
        }

        function drawHippo(animal) {
            context.fillStyle = "#8a8f99";
            context.beginPath();
            context.ellipse(0, 0, animal.r * 1.25, animal.r * 0.85, 0, 0, Math.PI * 2);
            context.fill();
            context.fillStyle = "#b3b7bf";
            context.beginPath();
            context.ellipse(animal.r * 0.62, 0, animal.r * 0.58, animal.r * 0.52, 0, 0, Math.PI * 2);
            context.fill();
        }

        function drawGiraffe(animal) {
            context.fillStyle = "#d7a640";
            context.fillRect(-animal.r * 0.75, -animal.r * 0.2, animal.r * 1.2, animal.r * 0.75);
            context.fillRect(animal.r * 0.2, -animal.r * 1.1, animal.r * 0.28, animal.r * 1.05);
            context.beginPath();
            context.arc(animal.r * 0.46, -animal.r * 1.12, animal.r * 0.36, 0, Math.PI * 2);
            context.fill();
            context.fillStyle = "#7c4d1e";
            context.fillRect(-animal.r * 0.45, -animal.r * 0.02, 5, 5);
            context.fillRect(-animal.r * 0.05, animal.r * 0.16, 5, 5);
            context.fillRect(animal.r * 0.28, -animal.r * 0.58, 5, 5);
        }

        function drawButterfly(animal) {
            context.fillStyle = "#cc4b8c";
            context.beginPath();
            context.ellipse(-animal.r * 0.35, 0, animal.r * 0.42, animal.r * 0.72, -0.5, 0, Math.PI * 2);
            context.ellipse(animal.r * 0.35, 0, animal.r * 0.42, animal.r * 0.72, 0.5, 0, Math.PI * 2);
            context.fill();
            context.strokeStyle = "#31233a";
            context.lineWidth = 3;
            context.beginPath();
            context.moveTo(0, -animal.r * 0.75);
            context.lineTo(0, animal.r * 0.75);
            context.stroke();
        }

        function drawCow(animal) {
            context.fillStyle = "#f8f8f8";
            context.strokeStyle = "#1d1f1f";
            context.lineWidth = 2;
            context.beginPath();
            context.ellipse(0, 0, animal.r * 1.1, animal.r * 0.7, 0, 0, Math.PI * 2);
            context.fill();
            context.stroke();
            context.fillStyle = "#1d1f1f";
            context.beginPath();
            context.arc(-animal.r * 0.35, -animal.r * 0.08, animal.r * 0.26, 0, Math.PI * 2);
            context.arc(animal.r * 0.18, animal.r * 0.12, animal.r * 0.22, 0, Math.PI * 2);
            context.fill();
            context.fillStyle = "#fcb4b8";
            context.beginPath();
            context.ellipse(animal.r * 0.62, 0, animal.r * 0.42, animal.r * 0.36, 0, 0, Math.PI * 2);
            context.fill();
        }

        function drawPlayer(palette) {
            var player = game.player;
            drawPixelSprite(WORKER_SPRITE, player.x, player.y - 8, 3, palette);
        }

        function drawBadPerson() {
            var badPerson = game.badPerson;
            if (!badPerson || badPerson.hiddenTime > 0 || game.ended) {
                return;
            }

            context.save();
            context.translate(Math.round(badPerson.x), Math.round(badPerson.y));
            drawBadPersonPixelSprite(badPerson);
            context.restore();
        }

        function drawBadPersonPixelSprite(badPerson) {
            var scale = 3;
            var direction = getBadPersonSpriteDirection(badPerson);
            var rows = BAD_PERSON_SPRITES[direction];
            var colors = {
                k: settings.highContrast ? "#ffffff" : "#151518",
                s: settings.highContrast ? "#ffe600" : "#f5c18c",
                m: settings.highContrast ? "#000000" : "#1f1f1f",
                r: settings.highContrast ? "#ff5fb7" : "#6f1d2d",
                p: settings.highContrast ? "#00e5ff" : "#3b3b42",
                b: settings.highContrast ? "#ffe600" : "#8b6f42"
            };

            if (direction === "side" && Math.cos(badPerson.angle) < 0) {
                context.scale(-1, 1);
            }

            context.translate(-(rows[0].length * scale) / 2, -12 * scale);
            rows.forEach(function (row, y) {
                for (var x = 0; x < row.length; x += 1) {
                    var color = colors[row.charAt(x)];
                    if (color) {
                        context.fillStyle = color;
                        context.fillRect(x * scale, y * scale, scale, scale);
                    }
                }
            });
        }

        function getBadPersonSpriteDirection(badPerson) {
            if (Math.abs(Math.sin(badPerson.angle)) > 0.68) {
                return Math.sin(badPerson.angle) > 0 ? "front" : "back";
            }
            return "side";
        }

        function drawTarget() {
            context.strokeStyle = settings.highContrast ? "#ffe600" : "#d84d66";
            context.lineWidth = 2;
            context.beginPath();
            context.arc(game.player.targetX, game.player.targetY, 9, 0, Math.PI * 2);
            context.moveTo(game.player.targetX - 13, game.player.targetY);
            context.lineTo(game.player.targetX + 13, game.player.targetY);
            context.moveTo(game.player.targetX, game.player.targetY - 13);
            context.lineTo(game.player.targetX, game.player.targetY + 13);
            context.stroke();
        }

        function drawGrassTile(x, y, variant, palette) {
            var base = variant % 2 === 0 ? palette.grassBase : palette.grassAlt;

            drawPixelRect(x, y, GRASS_TILE_SIZE, GRASS_TILE_SIZE, base);
            drawPixelRect(x + 4, y + 6, 4, 8, palette.grassMid);
            drawPixelRect(x + 8, y + 10, 4, 4, palette.grassDark);
            drawPixelRect(x + 20, y + 4, 8, 4, palette.grassLight);
            drawPixelRect(x + 24, y + 8, 4, 8, palette.grassMid);

            if (variant === 1 || variant === 3) {
                drawPixelRect(x + 12, y + 22, 8, 4, palette.grassLight);
                drawPixelRect(x + 16, y + 18, 4, 4, palette.grassDark);
            } else {
                drawPixelRect(x + 4, y + 24, 8, 4, palette.grassLight);
                drawPixelRect(x + 12, y + 20, 4, 4, palette.grassMid);
            }
        }

        function drawPixelSprite(sprite, centerX, centerY, scale, palette) {
            var left = Math.round(centerX - sprite.width * scale / 2);
            var top = Math.round(centerY - sprite.height * scale / 2);

            sprite.rects.forEach(function (rect) {
                drawPixelRect(
                    left + rect[1] * scale,
                    top + rect[2] * scale,
                    rect[3] * scale,
                    rect[4] * scale,
                    palette[rect[0]]
                );
            });
        }

        function drawPixelRect(x, y, width, height, color) {
            if (!color) {
                return;
            }

            context.fillStyle = color;
            context.fillRect(Math.round(x), Math.round(y), Math.round(width), Math.round(height));
        }

        function pixelPalette() {
            if (settings.highContrast) {
                return {
                    grassBase: "#000000",
                    grassAlt: "#101010",
                    grassLight: "#303030",
                    grassMid: "#202020",
                    grassDark: "#ffffff",
                    zooFloor: "#ffffff",
                    zooShade: "#d8d8d8",
                    zooWood: "#00e5ff",
                    zooWoodLight: "#ffffff",
                    zooInk: "#000000",
                    spriteShadow: "#ffffff",
                    treeLeaf: "#ffe600",
                    treeLeafLight: "#ffffff",
                    treeLeafDark: "#00e5ff",
                    treeTrunk: "#f5f5f5",
                    treeTrunkLight: "#000000",
                    brushLeaf: "#ff5fb7",
                    brushLight: "#ffffff",
                    brushDark: "#ffe600",
                    brushFlower: "#00e5ff",
                    workerHat: "#ffe600",
                    workerHatLight: "#ffffff",
                    workerSkin: "#ffffff",
                    workerSkinShade: "#d8d8d8",
                    workerInk: "#000000",
                    workerShirt: "#00e5ff",
                    workerShirtLight: "#ffffff",
                    workerPants: "#ffe600",
                    workerBoot: "#ffffff",
                    brick: "#ff5fb7",
                    brickLight: "#ffffff",
                    brickMortar: "#000000",
                    stone: "#ffffff",
                    stoneLight: "#ffe600",
                    stoneDark: "#00e5ff"
                };
            }

            return {
                grassBase: "#dff0c8",
                grassAlt: "#d7ecc0",
                grassLight: "#eaf8d8",
                grassMid: "#cfe4b4",
                grassDark: "#a7c982",
                zooFloor: "#f7e3a4",
                zooShade: "#e8c875",
                zooWood: "#8b5a2b",
                zooWoodLight: "#b37739",
                zooInk: "#243322",
                spriteShadow: "rgba(31, 49, 30, 0.24)",
                treeLeaf: "#1f7a3a",
                treeLeafLight: "#2da450",
                treeLeafDark: "#145b2a",
                treeTrunk: "#75431b",
                treeTrunkLight: "#a86730",
                brushLeaf: "#4d9f45",
                brushLight: "#67bd5f",
                brushDark: "#2f7f38",
                brushFlower: "#f0b13d",
                workerHat: "#d9962f",
                workerHatLight: "#f2b544",
                workerSkin: "#f4c68b",
                workerSkinShade: "#d89558",
                workerInk: "#17315b",
                workerShirt: "#204b8f",
                workerShirtLight: "#2d65b3",
                workerPants: "#1f365f",
                workerBoot: "#1d1f1f",
                brick: "#9e3f2f",
                brickLight: "#d46b4d",
                brickMortar: "#f1c9a0",
                stone: "#8d9392",
                stoneLight: "#c4c9c7",
                stoneDark: "#676f70"
            };
        }

        function drawEndSequence() {
            var age = game.endStartedAt ? performance.now() - game.endStartedAt : END_FADE_MS;
            var overlayTarget = settings.highContrast ? 0.9 : 0.76;
            var overlayAlpha = settings.reducedMotion ? overlayTarget : Math.min(overlayTarget, overlayTarget * (age / END_FADE_MS));
            var panelAlpha = settings.reducedMotion ? 1 : clamp((age - END_PANEL_DELAY_MS) / END_PANEL_FADE_MS, 0, 1);

            context.fillStyle = settings.highContrast ? "rgba(0, 0, 0, " + overlayAlpha + ")" : "rgba(29, 36, 31, " + overlayAlpha + ")";
            context.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
            drawFireworks(age);

            if (panelAlpha > 0) {
                drawEndPanel(panelAlpha);
            }
        }

        function drawFireworks(age) {
            if (!game.fireworks.length) {
                return;
            }

            context.save();
            game.fireworks.forEach(function (particle) {
                var localAge = age - particle.delay;
                if (localAge < 0 || localAge > particle.duration) {
                    return;
                }

                var progress = localAge / particle.duration;
                var eased = 1 - Math.pow(1 - progress, 2);
                var x = particle.x + Math.cos(particle.angle) * particle.speed * eased;
                var y = particle.y + Math.sin(particle.angle) * particle.speed * eased + 68 * progress * progress;
                var tailX = particle.x + Math.cos(particle.angle) * particle.speed * Math.max(0, eased - 0.16);
                var tailY = particle.y + Math.sin(particle.angle) * particle.speed * Math.max(0, eased - 0.16) + 68 * Math.max(0, progress - 0.08) * Math.max(0, progress - 0.08);
                var alpha = 1 - progress;

                context.globalAlpha = alpha;
                context.strokeStyle = particle.color;
                context.lineWidth = Math.max(2, particle.size - 1);
                context.beginPath();
                context.moveTo(tailX, tailY);
                context.lineTo(x, y);
                context.stroke();
                context.fillStyle = particle.color;
                context.fillRect(Math.round(x), Math.round(y), particle.size, particle.size);
            });
            context.restore();
        }

        function drawEndPanel(alpha) {
            var failed = Boolean(game.failed);
            var panel = {
                x: settings.largeText ? 96 : 140,
                y: settings.largeText ? 50 : 64,
                w: settings.largeText ? 768 : 680,
                h: settings.largeText ? 520 : 492
            };
            var contentX = panel.x + 34;
            var contentW = panel.w - 68;
            var statGap = 12;
            var statY = panel.y + (settings.largeText ? (failed ? 198 : 152) : (failed ? 176 : 136));
            var statH = settings.largeText ? 74 : 64;
            var statW = (contentW - statGap * 3) / 4;
            var badgeY = statY + statH + (settings.largeText ? 42 : 40);
            var rowH = settings.largeText ? 56 : 52;
            var rowGap = 9;
            var badgeIds = game.earnedBadges;

            context.save();
            context.globalAlpha = alpha;
            context.fillStyle = settings.highContrast ? "#000000" : "#ffffff";
            context.fillRect(panel.x, panel.y, panel.w, panel.h);
            context.strokeStyle = settings.highContrast ? "#ffe600" : "#f7e3a4";
            context.lineWidth = 6;
            context.strokeRect(panel.x + 3, panel.y + 3, panel.w - 6, panel.h - 6);
            context.strokeStyle = settings.highContrast ? "#ffffff" : "#116f63";
            context.lineWidth = 2;
            context.strokeRect(panel.x + 14, panel.y + 14, panel.w - 28, panel.h - 28);

            context.beginPath();
            context.rect(panel.x + 20, panel.y + 20, panel.w - 40, panel.h - 40);
            context.clip();

            drawTextFit(failed ? "Zoo failed!" : "Zoo saved!", WORLD_WIDTH / 2, panel.y + (settings.largeText ? 58 : 54), contentW, settings.largeText ? 45 : 40, 28, "900", failed ? (settings.highContrast ? "#ff5fb7" : "#c83f67") : (settings.highContrast ? "#ffe600" : "#116f63"), "center");
            drawTextFit("Score " + game.score + " / " + game.animals.length, WORLD_WIDTH / 2, panel.y + (settings.largeText ? 105 : 98), contentW, settings.largeText ? 34 : 30, 22, "900", settings.highContrast ? "#ffffff" : "#1d241f", "center");
            if (failed) {
                drawFailureSign(WORLD_WIDTH / 2 - 138, panel.y + (settings.largeText ? 124 : 116), 276, settings.largeText ? 48 : 42);
            }

            drawStatCell("Time", formatTime(game.elapsedTime), contentX, statY, statW, statH);
            drawStatCell("Rescued", game.rescued + " of " + game.animals.length, contentX + (statW + statGap), statY, statW, statH);
            drawStatCell("Stolen", game.animalsStolen + " / " + STOLEN_LOSS_LIMIT, contentX + (statW + statGap) * 2, statY, statW, statH);
            drawStatCell("Obstacles", game.touchedObstacle ? "Touched" : "Clean", contentX + (statW + statGap) * 3, statY, statW, statH);

            if (failed) {
                drawTextFit("Too many animals were stolen.", contentX, badgeY + 24, contentW, settings.largeText ? 28 : 24, 17, "900", settings.highContrast ? "#ffffff" : "#59635d", "left");
                context.restore();
                return;
            }

            drawTextFit("Badges earned: " + badgeIds.length, contentX, badgeY - 16, contentW, settings.largeText ? 22 : 19, 15, "900", settings.highContrast ? "#ffe600" : "#1d241f", "left");

            if (!badgeIds.length) {
                drawTextFit("No badge this run", contentX, badgeY + 28, contentW, settings.largeText ? 23 : 20, 15, "800", settings.highContrast ? "#ffffff" : "#59635d", "left");
                context.restore();
                return;
            }

            badgeIds.forEach(function (badgeId, index) {
                var badge = BADGE_BY_ID[badgeId];
                if (!badge) {
                    return;
                }
                drawBadgeRow(badge, contentX, badgeY + index * (rowH + rowGap), contentW, rowH);
            });

            context.restore();
        }

        function drawFailureSign(x, y, width, height) {
            var fill = settings.highContrast ? "#000000" : "#c83f67";
            var stroke = settings.highContrast ? "#ff5fb7" : "#8d1738";
            var ink = settings.highContrast ? "#ff5fb7" : "#ffffff";

            context.save();
            context.fillStyle = fill;
            context.fillRect(x, y, width, height);
            context.strokeStyle = stroke;
            context.lineWidth = 4;
            context.strokeRect(x + 2, y + 2, width - 4, height - 4);
            drawTextFit("FAILURE", x + width / 2, y + height - 12, width - 28, height - 12, 22, "900", ink, "center");
            context.restore();
        }

        function drawStatCell(label, value, x, y, width, height) {
            context.save();
            context.beginPath();
            context.rect(x, y, width, height);
            context.clip();
            context.fillStyle = settings.highContrast ? "#101010" : "#e5efd7";
            context.fillRect(x, y, width, height);
            context.strokeStyle = settings.highContrast ? "#ffffff" : "#bdc9b5";
            context.lineWidth = 2;
            context.strokeRect(x + 1, y + 1, width - 2, height - 2);
            drawTextFit(label, x + 10, y + 23, width - 20, settings.largeText ? 15 : 13, 10, "900", settings.highContrast ? "#ffe600" : "#59635d", "left");
            drawTextFit(value, x + 10, y + height - 16, width - 20, settings.largeText ? 24 : 21, 14, "900", settings.highContrast ? "#ffffff" : "#1d241f", "left");
            context.restore();
        }

        function drawBadgeRow(badge, x, y, width, height) {
            var fill = settings.highContrast ? "#000000" : badge.fill;
            var accent = settings.highContrast ? "#ffe600" : badge.accent;
            var ink = settings.highContrast ? "#ffffff" : badge.ink;
            var muted = settings.highContrast ? "#ffffff" : badge.accent;
            var iconX = x + 29;
            var iconY = y + height / 2;
            var textX = x + 64;
            var textW = width - 82;

            context.save();
            context.beginPath();
            context.rect(x, y, width, height);
            context.clip();

            context.fillStyle = fill;
            context.fillRect(x, y, width, height);
            context.strokeStyle = accent;
            context.lineWidth = 3;
            context.strokeRect(x + 1.5, y + 1.5, width - 3, height - 3);

            context.fillStyle = accent;
            context.beginPath();
            context.arc(iconX, iconY, 18, 0, Math.PI * 2);
            context.fill();
            drawTextFit(badge.name.charAt(0), iconX, iconY + 8, 28, 24, 15, "900", fill, "center");
            drawTextFit(badge.name, textX, y + 23, textW, settings.largeText ? 22 : 20, 14, "900", ink, "left");
            drawTextFit(badge.power, textX, y + height - 12, textW, settings.largeText ? 17 : 15, 11, "800", muted, "left");

            context.restore();
        }

        function drawTextFit(text, x, y, maxWidth, maxSize, minSize, weight, color, align) {
            var size = maxSize;
            var output = String(text);

            context.textAlign = align || "left";
            context.textBaseline = "alphabetic";
            context.fillStyle = color;
            context.font = weight + " " + size + "px system-ui, sans-serif";

            while (size > minSize && context.measureText(output).width > maxWidth) {
                size -= 1;
                context.font = weight + " " + size + "px system-ui, sans-serif";
            }

            if (context.measureText(output).width > maxWidth) {
                output = truncateText(output, maxWidth);
            }

            context.fillText(output, x, y);
        }

        function truncateText(text, maxWidth) {
            var output = text;
            var suffix = "...";

            while (output.length > 1 && context.measureText(output + suffix).width > maxWidth) {
                output = output.slice(0, -1);
            }

            return output.length > 1 ? output + suffix : output;
        }

        function formatTime(seconds) {
            var totalSeconds = Math.max(0, Math.round(seconds));
            var minutes = Math.floor(totalSeconds / 60);
            var remainder = totalSeconds % 60;
            return minutes + ":" + (remainder < 10 ? "0" : "") + remainder;
        }

        return {
            destroy: destroy,
            reset: reset,
            getSnapshot: function () {
                return {
                    rescued: game.rescued,
                    animals: game.animals.length,
                    obstacles: game.obstacles.length,
                    ended: game.ended,
                    failed: game.failed,
                    badPersonAway: game.badPerson.hiddenTime > 0,
                    elapsedTime: Number(game.elapsedTime.toFixed(1)),
                    touchedObstacle: game.touchedObstacle,
                    animalsStolen: game.animalsStolen,
                    stolenLossLimit: STOLEN_LOSS_LIMIT,
                    coins: game.coins,
                    coinPickups: game.coinPickups.length,
                    inventory: Object.assign({}, game.inventory),
                    placedBarriers: game.placedBarriers.length,
                    placementMode: game.placementMode,
                    barrierCooldown: Number(game.barrierCooldown.toFixed(1)),
                    wolves: game.wolves.map(function (wolf) {
                        return {
                            hidden: wolf.hiddenTime > 0,
                            mode: wolf.mode,
                            carrying: Boolean(wolf.releaseAnimal)
                        };
                    }),
                    wolvesDefeated: game.wolvesDefeated,
                    earnedBadges: game.earnedBadges.slice(),
                    unlockedBadges: game.unlockedBadges.slice(),
                    activePowers: Object.assign({}, game.activePowers)
                };
            }
        };
    }

    function createInitialGame(settings, unlockedBadges) {
        var zoo = { x: 38, y: 38, w: 148, h: 106 };
        var badgeIds = normalizeBadgeIds(unlockedBadges);
        var activePowers = createBadgePowers(badgeIds);
        var player = createPlayer(zoo, activePowers);
        var game = {
            zoo: zoo,
            player: player,
            badPerson: createBadPerson(activePowers),
            wolves: createWolves(activePowers),
            animals: [],
            obstacles: [],
            placedBarriers: [],
            coinPickups: [],
            coins: 0,
            coinDropTimer: COIN_DROP_INTERVAL,
            inventory: {
                knife: false,
                spear: 0,
                brick: 0,
                stone: 0
            },
            placementMode: null,
            barrierCooldown: 0,
            barrierNotice: "",
            barrierNoticeTimer: 0,
            rescued: 0,
            rescueSequence: 0,
            score: 0,
            ended: false,
            failed: false,
            elapsedTime: 0,
            touchedObstacle: false,
            animalsStolen: 0,
            wolvesDefeated: 0,
            earnedBadges: [],
            endStartedAt: 0,
            fireworks: [],
            unlockedBadges: badgeIds,
            activePowers: activePowers
        };

        game.animals = createAnimals(game);

        var count = settings.reducedMotion ? 12 : 16;
        for (var i = 0; i < count; i += 1) {
            var obstacle = placeObstacle(false, game);
            if (obstacle) {
                game.obstacles.push(obstacle);
            }
        }

        return game;
    }

    function createPlayer(zoo, activePowers) {
        var startX = zoo.x + zoo.w / 2;
        var startY = zoo.y + zoo.h / 2;
        return {
            x: startX,
            y: startY,
            targetX: startX,
            targetY: startY,
            r: 17,
            speed: 220 + activePowers.playerSpeedBonus,
            catchBonus: activePowers.catchRadiusBonus,
            carrying: null
        };
    }

    function createBadPerson(activePowers) {
        return {
            x: -BAD_PERSON_EDGE_OFFSET,
            y: -BAD_PERSON_EDGE_OFFSET,
            targetX: -BAD_PERSON_EDGE_OFFSET,
            targetY: -BAD_PERSON_EDGE_OFFSET,
            r: 18,
            speed: BAD_PERSON_SPEED * activePowers.badPersonSpeedMultiplier,
            angle: Math.PI,
            hiddenTime: randomBadPersonDelay(),
            mode: "hidden",
            route: [],
            routeIndex: 0,
            releaseAnimal: null,
            dropPoint: null
        };
    }

    function createWolves(activePowers) {
        var wolves = [];
        for (var index = 0; index < WOLF_COUNT; index += 1) {
            wolves.push({
                index: index,
                x: -WOLF_EDGE_OFFSET,
                y: -WOLF_EDGE_OFFSET,
                targetX: -WOLF_EDGE_OFFSET,
                targetY: -WOLF_EDGE_OFFSET,
                r: 16,
                speed: WOLF_SPEED * activePowers.badPersonSpeedMultiplier,
                angle: Math.PI,
                hiddenTime: randomWolfDelay(),
                mode: "hidden",
                route: [],
                routeIndex: 0,
                releaseAnimal: null,
                dropPoint: null
            });
        }
        return wolves;
    }

    function randomBadPersonDelay() {
        return BAD_PERSON_HIDE_MIN + Math.random() * (BAD_PERSON_HIDE_MAX - BAD_PERSON_HIDE_MIN);
    }

    function randomWolfDelay() {
        return WOLF_HIDE_MIN + Math.random() * (WOLF_HIDE_MAX - WOLF_HIDE_MIN);
    }

    function randomBarrierCooldown() {
        return BARRIER_COOLDOWN_MIN + Math.random() * (BARRIER_COOLDOWN_MAX - BARRIER_COOLDOWN_MIN);
    }

    function loadAnimalSprites() {
        var sprites = {};
        Object.keys(ANIMAL_SPRITE_PATHS).forEach(function (kind) {
            var image = new Image();
            image.src = ANIMAL_SPRITE_PATHS[kind];
            sprites[kind] = image;
        });
        return sprites;
    }

    function createAnimals(game) {
        var animals = [];
        ANIMAL_SPECS.forEach(function (spec) {
            var spot = findAnimalStartSpot(spec, animals, game);
            animals.push(createAnimal(spec.kind, spot.x, spot.y, spec.radius, spec.speed));
        });
        return animals;
    }

    function findAnimalStartSpot(spec, animals, game) {
        for (var attempt = 0; attempt < 120; attempt += 1) {
            var spot = {
                x: spec.radius + 48 + Math.random() * (WORLD_WIDTH - spec.radius * 2 - 96),
                y: spec.radius + 48 + Math.random() * (WORLD_HEIGHT - spec.radius * 2 - 96),
                r: spec.radius
            };

            if (isSafeAnimalStartSpot(spot, animals, game)) {
                return spot;
            }
        }

        return { x: spec.x, y: spec.y, r: spec.radius };
    }

    function isSafeAnimalStartSpot(spot, animals, game) {
        var zooBuffer = {
            x: game.zoo.x - 76,
            y: game.zoo.y - 76,
            w: game.zoo.w + 152,
            h: game.zoo.h + 152
        };

        if (pointInRect(spot.x, spot.y, zooBuffer)) {
            return false;
        }

        if (distance(spot, game.player) < spot.r + game.player.r + 120) {
            return false;
        }

        for (var i = 0; i < animals.length; i += 1) {
            if (distance(spot, animals[i]) < spot.r + animals[i].r + 56) {
                return false;
            }
        }

        return true;
    }

    function createAnimal(kind, x, y, radius, speed) {
        return {
            kind: kind,
            x: x,
            y: y,
            r: radius,
            speed: speed,
            angle: Math.random() * Math.PI * 2,
            wanderTime: 0.5 + Math.random(),
            spriteOffset: Math.floor(Math.random() * 8),
            carried: false,
            rescued: false,
            rescueOrder: 0
        };
    }

    function createPlacedBarrier(type, x, y) {
        return {
            x: clamp(x, BARRIER_RADIUS + 4, WORLD_WIDTH - BARRIER_RADIUS - 4),
            y: clamp(y, BARRIER_RADIUS + 4, WORLD_HEIGHT - BARRIER_RADIUS - 4),
            radius: BARRIER_RADIUS,
            currentRadius: BARRIER_RADIUS,
            type: type,
            barrier: true,
            variant: Math.floor(Math.random() * 4)
        };
    }

    function isSafeBarrierSpot(barrier, game) {
        var zooBlock = {
            x: game.zoo.x - barrier.radius,
            y: game.zoo.y - barrier.radius,
            w: game.zoo.w + barrier.radius * 2,
            h: game.zoo.h + barrier.radius * 2
        };

        if (pointInRect(barrier.x, barrier.y, zooBlock)) {
            return false;
        }

        if (distance(barrier, game.player) < barrier.radius + game.player.r + 8) {
            return false;
        }

        for (var animalIndex = 0; animalIndex < game.animals.length; animalIndex += 1) {
            var animal = game.animals[animalIndex];
            if (!animal.carried && distance(barrier, animal) < barrier.radius + animal.r + 8) {
                return false;
            }
        }

        if (game.badPerson.hiddenTime <= 0 && distance(barrier, game.badPerson) < barrier.radius + game.badPerson.r + 10) {
            return false;
        }

        for (var wolfIndex = 0; wolfIndex < game.wolves.length; wolfIndex += 1) {
            var wolf = game.wolves[wolfIndex];
            if (wolf.hiddenTime <= 0 && distance(barrier, wolf) < barrier.radius + wolf.r + 10) {
                return false;
            }
        }

        for (var obstacleIndex = 0; obstacleIndex < game.obstacles.length; obstacleIndex += 1) {
            var obstacle = game.obstacles[obstacleIndex];
            var spacing = obstacle.barrier ? 3 : 8;
            if (distance(barrier, obstacle) < barrier.radius + obstacle.radius + spacing) {
                return false;
            }
        }

        return true;
    }

    function placeObstacle(growing, targetGame) {
        var activeGame = targetGame;
        if (!activeGame) {
            return null;
        }

        for (var attempt = 0; attempt < 90; attempt += 1) {
            var isTree = Math.random() > 0.45;
            var radius = isTree ? 22 + Math.random() * 12 : 17 + Math.random() * 9;
            var obstacle = {
                x: 42 + Math.random() * (WORLD_WIDTH - 84),
                y: 42 + Math.random() * (WORLD_HEIGHT - 84),
                radius: radius,
                currentRadius: growing ? 3 : radius,
                type: isTree ? "tree" : "brush",
                variant: Math.floor(Math.random() * (isTree ? TREE_SPRITES.length : BRUSH_SPRITES.length))
            };
            if (isSafeObstacleSpot(obstacle, activeGame)) {
                return obstacle;
            }
        }
        return null;
    }

    function isSafeObstacleSpot(obstacle, game) {
        var zooBuffer = {
            x: game.zoo.x - 54,
            y: game.zoo.y - 54,
            w: game.zoo.w + 108,
            h: game.zoo.h + 108
        };

        if (pointInRect(obstacle.x, obstacle.y, zooBuffer)) {
            return false;
        }

        if (distance(obstacle, game.player) < obstacle.radius + game.player.r + 80) {
            return false;
        }

        for (var i = 0; i < game.animals.length; i += 1) {
            if (!game.animals[i].rescued && distance(obstacle, game.animals[i]) < obstacle.radius + game.animals[i].r + 62) {
                return false;
            }
        }

        for (var j = 0; j < game.obstacles.length; j += 1) {
            if (distance(obstacle, game.obstacles[j]) < obstacle.radius + game.obstacles[j].radius + 38) {
                return false;
            }
        }

        return true;
    }

    function distance(a, b) {
        return Math.hypot(a.x - b.x, a.y - b.y);
    }

    function clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    function pointInRect(x, y, rect) {
        return x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h;
    }

    app.addEventListener("click", function (event) {
        var action = event.target.closest("[data-action]");

        if (action && action.dataset.action === "restart-game" && gameInstance) {
            gameInstance.reset();
        }
    });

    window.GameApp = {
        getState: function () {
            return JSON.parse(JSON.stringify(state));
        },
        getBadges: function () {
            return JSON.parse(JSON.stringify(BADGE_DEFINITIONS));
        },
        getGameSnapshot: function () {
            return gameInstance && gameInstance.getSnapshot ? gameInstance.getSnapshot() : null;
        }
    };

    render();
}());
