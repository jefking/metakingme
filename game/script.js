(function () {
    "use strict";

    var STORAGE_KEY = "standaloneGameSettings";
    var WORLD_WIDTH = 960;
    var WORLD_HEIGHT = 620;
    var MAX_OBSTACLES = 28;
    var SPRITE_SIZE = 32;
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
        { name: "Zebra", kind: "zebra", x: 720, y: 130, radius: 17, speed: 116 },
        { name: "Turtle", kind: "turtle", x: 815, y: 500, radius: 16, speed: 54 },
        { name: "Squirrel", kind: "squirrel", x: 360, y: 480, radius: 14, speed: 150 },
        { name: "Hippo", kind: "hippo", x: 570, y: 430, radius: 21, speed: 72 },
        { name: "Giraffe", kind: "giraffe", x: 705, y: 330, radius: 19, speed: 98 },
        { name: "Butterfly", kind: "butterfly", x: 450, y: 130, radius: 13, speed: 138 },
        { name: "Cow", kind: "cow", x: 280, y: 300, radius: 17, speed: 92 }
    ];
    var defaultSettings = {
        highContrast: false,
        reducedMotion: false,
        largeText: false
    };

    var app = document.getElementById("app");
    var gameInstance = null;

    if (!app) {
        return;
    }

    var state = {
        route: getRoute(),
        settings: loadSettings()
    };
    var animalSprites = loadAnimalSprites();

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
        stopGame();

        app.innerHTML = [
            '<div class="app-shell">',
            '  <header class="shell-header">',
            '    <a class="brand" href="#play" data-route="play">',
            '      <span class="brand-mark" aria-hidden="true"></span>',
            '      <span>Zoo Rescue</span>',
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
            "    Zoo Rescue runs standalone inside /game.",
            "  </footer>",
            "</div>"
        ].join("");

        if (state.route === "play") {
            window.requestAnimationFrame(startGame);
        }
    }

    function playView() {
        return [
            '<section class="game-view" aria-labelledby="game-title">',
            '  <div class="game-heading">',
            '    <p class="eyebrow">Pac-style rescue run</p>',
            '    <h1 id="game-title">Zoo Rescue</h1>',
            '    <div class="game-stats" aria-label="Game status">',
            metricView("Rescued", '<span data-rescued>0 / ' + ANIMAL_SPECS.length + '</span>'),
            metricView("Carrying", '<span data-carrying>None</span>'),
            metricView("Obstacles", '<span data-growth>0</span>'),
            "    </div>",
            "  </div>",
            '  <section class="stage-panel" aria-label="Zoo Rescue game stage" tabindex="-1" data-stage>',
            '    <canvas class="game-canvas" width="' + WORLD_WIDTH + '" height="' + WORLD_HEIGHT + '" data-game-canvas aria-label="Mouse controlled zoo rescue game"></canvas>',
            '    <div class="stage-toolbar" aria-live="polite">',
            '      <span data-status>Catch loose animals and return them to the zoo.</span>',
            '      <button class="button primary" type="button" data-action="restart-game">Restart</button>',
            "    </div>",
            "  </section>",
            "</section>"
        ].join("");
    }

    function metricView(label, value) {
        return [
            '<div class="metric">',
            "  <span>" + label + "</span>",
            "  <strong>" + value + "</strong>",
            "</div>"
        ].join("");
    }

    function settingsView() {
        return [
            '<section class="settings-view" aria-labelledby="settings-title">',
            '  <div class="settings-intro">',
            '    <p class="eyebrow">Player options</p>',
            '    <h2 id="settings-title">Access settings</h2>',
            '    <p class="lead">Preferences save in this browser and apply to the game stage.</p>',
            "  </div>",
            '  <div class="settings-panel">',
            settingRow("highContrast", "High contrast", "Increase visual contrast for text and controls."),
            settingRow("reducedMotion", "Reduced motion", "Slow moving parts and reduce growth animation."),
            settingRow("largeText", "Large text", "Increase interface text size."),
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
        var status = app.querySelector("[data-status]");
        var rescuedStat = app.querySelector("[data-rescued]");
        var carryingStat = app.querySelector("[data-carrying]");
        var growthStat = app.querySelector("[data-growth]");
        var dpr = window.devicePixelRatio || 1;
        var running = true;
        var animationFrame = 0;
        var lastTime = performance.now();
        var nextGrowth = 4;
        var game = createInitialGame(settings);

        resizeCanvas();
        canvas.addEventListener("pointermove", setTarget);
        canvas.addEventListener("pointerdown", setTarget);
        window.addEventListener("resize", resizeCanvas);
        animationFrame = window.requestAnimationFrame(loop);

        function reset() {
            game = createInitialGame(settings);
            lastTime = performance.now();
            nextGrowth = 4;
            updateHud();
        }

        function destroy() {
            running = false;
            window.cancelAnimationFrame(animationFrame);
            canvas.removeEventListener("pointermove", setTarget);
            canvas.removeEventListener("pointerdown", setTarget);
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

        function eventToWorld(event) {
            var rect = canvas.getBoundingClientRect();
            return {
                x: ((event.clientX - rect.left) / rect.width) * WORLD_WIDTH,
                y: ((event.clientY - rect.top) / rect.height) * WORLD_HEIGHT
            };
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
            var speedFactor = settings.reducedMotion ? 0.55 : 1;
            movePlayer(delta * speedFactor);
            moveAnimals(delta * speedFactor);
            updateCarriedAnimal();
            checkCatchAndDrop();
            growObstacles(delta);
            nextGrowth -= delta;
            if (nextGrowth <= 0) {
                addGrowingObstacle();
                nextGrowth = 6 + Math.random() * 4;
            }
            updateHud();
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
                if (overlapDistance > 0 && overlapDistance < radius) {
                    var push = radius - overlapDistance;
                    entity.x += (ox / overlapDistance) * push;
                    entity.y += (oy / overlapDistance) * push;
                }
            });

            entity.x = clamp(entity.x, entity.r, WORLD_WIDTH - entity.r);
            entity.y = clamp(entity.y, entity.r, WORLD_HEIGHT - entity.r);
        }

        function updateCarriedAnimal() {
            var animal = game.player.carrying;
            if (!animal) {
                return;
            }
            animal.x = game.player.x + 18;
            animal.y = game.player.y - 18;
        }

        function checkCatchAndDrop() {
            var player = game.player;

            if (!player.carrying) {
                game.animals.some(function (animal) {
                    if (!animal.rescued && !animal.carried && distance(player, animal) < player.r + animal.r + 4) {
                        animal.carried = true;
                        player.carrying = animal;
                        game.message = animal.name + " caught.";
                        return true;
                    }
                    return false;
                });
            }

            if (player.carrying && pointInRect(player.x, player.y, game.zoo)) {
                player.carrying.rescued = true;
                player.carrying.carried = false;
                player.carrying.x = game.zoo.x + game.zoo.w - 26;
                player.carrying.y = game.zoo.y + 24 + game.rescued * 14;
                game.rescued += 1;
                game.message = player.carrying.name + " returned to zoo.";
                player.carrying = null;
            }

            if (game.rescued === game.animals.length) {
                game.message = "All animals safe at zoo.";
            }
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
                game.message = obstacle.type === "tree" ? "Tree grew near path." : "Brush grew near path.";
            }
        }

        function updateHud() {
            if (rescuedStat) {
                rescuedStat.textContent = game.rescued + " / " + game.animals.length;
            }
            if (carryingStat) {
                carryingStat.textContent = game.player.carrying ? game.player.carrying.name : "None";
            }
            if (growthStat) {
                growthStat.textContent = String(game.obstacles.length);
            }
            if (status) {
                status.textContent = game.message;
            }
        }

        function draw() {
            drawField();
            drawZoo();
            game.obstacles.forEach(drawObstacle);
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
            drawPlayer();
            drawTarget();
        }

        function drawField() {
            context.clearRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
            context.fillStyle = settings.highContrast ? "#000000" : "#dff0c8";
            context.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
            context.fillStyle = settings.highContrast ? "#202020" : "#cfe4b4";
            for (var x = 24; x < WORLD_WIDTH; x += 48) {
                for (var y = 24; y < WORLD_HEIGHT; y += 48) {
                    context.beginPath();
                    context.arc(x, y, 3, 0, Math.PI * 2);
                    context.fill();
                }
            }
        }

        function drawZoo() {
            var zoo = game.zoo;
            context.fillStyle = settings.highContrast ? "#ffffff" : "#f7e3a4";
            context.fillRect(zoo.x, zoo.y, zoo.w, zoo.h);
            context.strokeStyle = settings.highContrast ? "#00e5ff" : "#8b5a2b";
            context.lineWidth = 6;
            context.strokeRect(zoo.x, zoo.y, zoo.w, zoo.h);
            context.fillStyle = settings.highContrast ? "#00e5ff" : "#8b5a2b";
            for (var x = zoo.x + 12; x < zoo.x + zoo.w; x += 22) {
                context.fillRect(x, zoo.y - 6, 6, zoo.h + 12);
            }
            context.fillStyle = settings.highContrast ? "#000000" : "#243322";
            context.font = "800 24px system-ui, sans-serif";
            context.textAlign = "center";
            context.fillText("ZOO", zoo.x + zoo.w / 2, zoo.y + zoo.h / 2 + 8);
        }

        function drawObstacle(obstacle) {
            var radius = obstacle.currentRadius;
            if (obstacle.type === "tree") {
                context.fillStyle = settings.highContrast ? "#f5f5f5" : "#75431b";
                context.fillRect(obstacle.x - 5, obstacle.y + radius * 0.15, 10, radius * 0.72);
                context.fillStyle = settings.highContrast ? "#ffe600" : "#1f7a3a";
                context.beginPath();
                context.arc(obstacle.x, obstacle.y, radius, 0, Math.PI * 2);
                context.fill();
                context.fillStyle = settings.highContrast ? "#000000" : "#2da450";
                context.beginPath();
                context.arc(obstacle.x - radius * 0.35, obstacle.y + 2, radius * 0.48, 0, Math.PI * 2);
                context.arc(obstacle.x + radius * 0.35, obstacle.y + 1, radius * 0.48, 0, Math.PI * 2);
                context.fill();
                return;
            }

            context.fillStyle = settings.highContrast ? "#ff5fb7" : "#4d9f45";
            context.beginPath();
            context.arc(obstacle.x, obstacle.y, radius, 0, Math.PI * 2);
            context.fill();
            context.fillStyle = settings.highContrast ? "#ffffff" : "#67bd5f";
            context.beginPath();
            context.arc(obstacle.x - radius * 0.25, obstacle.y - radius * 0.15, radius * 0.42, 0, Math.PI * 2);
            context.arc(obstacle.x + radius * 0.24, obstacle.y - radius * 0.05, radius * 0.38, 0, Math.PI * 2);
            context.fill();
        }

        function drawAnimal(animal) {
            context.save();
            context.translate(animal.x, animal.y);
            context.rotate(Math.sin(performance.now() / 260 + animal.x) * 0.05);
            if (drawAnimalSprite(animal)) {
                context.restore();
                drawAnimalLabel(animal);
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
            drawAnimalLabel(animal);
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

        function drawAnimalLabel(animal) {
            if (animal.carried) {
                return;
            }
            context.fillStyle = settings.highContrast ? "#ffffff" : "#20311e";
            context.font = "700 " + (settings.largeText ? 15 : 12) + "px system-ui, sans-serif";
            context.textAlign = "center";
            context.fillText(animal.name, animal.x, animal.y + animal.r + 15);
        }

        function drawPlayer() {
            var player = game.player;
            context.save();
            context.translate(player.x, player.y);
            context.fillStyle = settings.highContrast ? "#00e5ff" : "#204b8f";
            context.beginPath();
            context.arc(0, -8, 10, 0, Math.PI * 2);
            context.fill();
            context.fillStyle = settings.highContrast ? "#ffffff" : "#f4c68b";
            context.beginPath();
            context.arc(0, -18, 8, 0, Math.PI * 2);
            context.fill();
            context.fillStyle = settings.highContrast ? "#ffe600" : "#f2b544";
            context.fillRect(-13, -31, 26, 6);
            context.fillStyle = settings.highContrast ? "#00e5ff" : "#204b8f";
            context.fillRect(-10, 2, 7, 18);
            context.fillRect(3, 2, 7, 18);
            context.strokeStyle = settings.highContrast ? "#ffffff" : "#17315b";
            context.lineWidth = 4;
            context.beginPath();
            context.moveTo(-13, -5);
            context.lineTo(-22, 6);
            context.moveTo(13, -5);
            context.lineTo(22, 6);
            context.stroke();
            context.restore();

            context.fillStyle = settings.highContrast ? "#ffffff" : "#1d1f1f";
            context.font = "800 13px system-ui, sans-serif";
            context.textAlign = "center";
            context.fillText("Worker", player.x, player.y + 36);
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

        return {
            destroy: destroy,
            reset: reset,
            getSnapshot: function () {
                return {
                    rescued: game.rescued,
                    animals: game.animals.length,
                    obstacles: game.obstacles.length
                };
            }
        };
    }

    function createInitialGame(settings) {
        var game = {
            zoo: { x: 38, y: 38, w: 148, h: 106 },
            player: { x: 125, y: 205, targetX: 125, targetY: 205, r: 17, speed: 220, carrying: null },
            animals: createAnimals(),
            obstacles: [],
            rescued: 0,
            message: "Catch loose animals and return them to the zoo."
        };

        var count = settings.reducedMotion ? 12 : 16;
        for (var i = 0; i < count; i += 1) {
            var obstacle = placeObstacle(false, game);
            if (obstacle) {
                game.obstacles.push(obstacle);
            }
        }

        return game;
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

    function createAnimals() {
        return ANIMAL_SPECS.map(function (spec) {
            return createAnimal(spec.name, spec.kind, spec.x, spec.y, spec.radius, spec.speed);
        });
    }

    function createAnimal(name, kind, x, y, radius, speed) {
        return {
            name: name,
            kind: kind,
            x: x,
            y: y,
            r: radius,
            speed: speed,
            angle: Math.random() * Math.PI * 2,
            wanderTime: 0.5 + Math.random(),
            spriteOffset: Math.floor(Math.random() * 8),
            carried: false,
            rescued: false
        };
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
                type: isTree ? "tree" : "brush"
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
        var routeLink = event.target.closest("[data-route]");
        var action = event.target.closest("[data-action]");

        if (routeLink) {
            event.preventDefault();
            window.location.hash = routeLink.dataset.route;
            return;
        }

        if (action && action.dataset.action === "restart-game" && gameInstance) {
            gameInstance.reset();
        }
    });

    app.addEventListener("change", function (event) {
        var target = event.target;

        if (target.matches("[data-setting]")) {
            state.settings[target.dataset.setting] = target.checked;
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
        },
        getGameSnapshot: function () {
            return gameInstance && gameInstance.getSnapshot ? gameInstance.getSnapshot() : null;
        }
    };

    render();
}());
