(function () {
    "use strict";

    var STORAGE_KEY = "standaloneGameSettings";
    var WORLD_WIDTH = 960;
    var WORLD_HEIGHT = 620;
    var MAX_OBSTACLES = 28;
    var SPRITE_SIZE = 32;
    var GRASS_TILE_SIZE = 32;
    var BAD_PERSON_SPEED = 320;
    var BAD_PERSON_PLAYER_DELAY = 5;
    var BAD_PERSON_STEAL_DELAY = 7;
    var BAD_SPAWN_POINTS = [
        { x: WORLD_WIDTH - 70, y: WORLD_HEIGHT - 70 },
        { x: WORLD_WIDTH - 70, y: 72 },
        { x: WORLD_WIDTH * 0.58, y: WORLD_HEIGHT - 66 }
    ];
    var BAD_PATROL_POINTS = [
        { x: WORLD_WIDTH - 82, y: WORLD_HEIGHT - 82 },
        { x: WORLD_WIDTH - 88, y: 88 },
        { x: WORLD_WIDTH * 0.56, y: WORLD_HEIGHT - 92 }
    ];
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
        draw();
        animationFrame = window.requestAnimationFrame(loop);

        function reset() {
            game = createInitialGame(settings);
            lastTime = performance.now();
            nextGrowth = 4;
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
            if (game.ended) {
                return;
            }

            var speedFactor = settings.reducedMotion ? 0.55 : 1;
            movePlayer(delta * speedFactor);
            moveAnimals(delta * speedFactor);
            moveBadPerson(delta, settings.reducedMotion ? 0.7 : 1);
            updateCarriedAnimal();
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

            var target = getBadPersonTarget();
            var dx = target.x - badPerson.x;
            var dy = target.y - badPerson.y;
            var targetDistance = Math.hypot(dx, dy);
            if (targetDistance > 1) {
                var step = Math.min(targetDistance, badPerson.speed * speedFactor * delta);
                badPerson.angle = Math.atan2(dy, dx);
                moveEntity(badPerson, (dx / targetDistance) * step, (dy / targetDistance) * step);
            }

            if (distance(badPerson, game.player) < badPerson.r + game.player.r + 4) {
                sendBadPersonAway(BAD_PERSON_PLAYER_DELAY);
                return;
            }

            if (game.rescued > 0 && pointInRect(badPerson.x, badPerson.y, game.zoo)) {
                stealRescuedAnimal();
            }
        }

        function getBadPersonTarget() {
            var badPerson = game.badPerson;
            if (game.rescued > 0) {
                return {
                    x: game.zoo.x + game.zoo.w / 2,
                    y: game.zoo.y + game.zoo.h / 2
                };
            }

            if (distance(badPerson, { x: badPerson.patrolX, y: badPerson.patrolY }) < 22) {
                chooseBadPatrolTarget();
            }

            return { x: badPerson.patrolX, y: badPerson.patrolY };
        }

        function chooseBadPatrolTarget() {
            var badPerson = game.badPerson;
            var point = BAD_PATROL_POINTS[Math.floor(Math.random() * BAD_PATROL_POINTS.length)];
            badPerson.patrolX = point.x;
            badPerson.patrolY = point.y;
        }

        function spawnBadPerson() {
            var badPerson = game.badPerson;
            var bestPoint = BAD_SPAWN_POINTS[0];
            var bestDistance = -1;

            BAD_SPAWN_POINTS.forEach(function (point) {
                var playerDistance = distance(point, game.player);
                if (playerDistance > bestDistance) {
                    bestDistance = playerDistance;
                    bestPoint = point;
                }
            });

            badPerson.x = bestPoint.x;
            badPerson.y = bestPoint.y;
            badPerson.targetX = bestPoint.x;
            badPerson.targetY = bestPoint.y;
            badPerson.hiddenTime = 0;
            chooseBadPatrolTarget();
        }

        function sendBadPersonAway(seconds) {
            var badPerson = game.badPerson;
            badPerson.hiddenTime = seconds;
            badPerson.x = -80;
            badPerson.y = -80;
        }

        function stealRescuedAnimal() {
            var animal = findRescuedAnimal();
            if (!animal) {
                return;
            }

            var spot = findStolenAnimalSpot(animal);
            animal.rescued = false;
            animal.carried = false;
            animal.rescueOrder = 0;
            animal.x = spot.x;
            animal.y = spot.y;
            animal.angle = Math.random() * Math.PI * 2;
            animal.wanderTime = 0.6 + Math.random();
            game.rescued = Math.max(0, game.rescued - 1);
            layoutRescuedAnimals();
            sendBadPersonAway(BAD_PERSON_STEAL_DELAY);
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

        function findStolenAnimalSpot(animal) {
            var zooBuffer = {
                x: game.zoo.x - 80,
                y: game.zoo.y - 80,
                w: game.zoo.w + 160,
                h: game.zoo.h + 160
            };

            for (var attempt = 0; attempt < 80; attempt += 1) {
                var spot = {
                    x: animal.r + 32 + Math.random() * (WORLD_WIDTH - animal.r * 2 - 64),
                    y: animal.r + 32 + Math.random() * (WORLD_HEIGHT - animal.r * 2 - 64),
                    r: animal.r
                };
                if (pointInRect(spot.x, spot.y, zooBuffer) || distance(spot, game.player) < 140) {
                    continue;
                }
                if (isBlockedByObstacle(spot)) {
                    continue;
                }
                return spot;
            }

            return { x: WORLD_WIDTH - animal.r - 44, y: WORLD_HEIGHT - animal.r - 44 };
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

        function endGame() {
            if (game.ended) {
                return;
            }
            game.ended = true;
            game.score = game.rescued;
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
            drawBadPerson();
            drawPlayer(palette);
            if (!game.ended) {
                drawTarget();
            } else {
                drawEndScore();
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
            var radius = obstacle.currentRadius;
            var sprites = obstacle.type === "tree" ? TREE_SPRITES : BRUSH_SPRITES;
            var sprite = sprites[obstacle.variant % sprites.length] || sprites[0];
            var finalScale = Math.max(2, Math.round(obstacle.radius / (obstacle.type === "tree" ? 8 : 9)));
            var scale = Math.max(1, Math.round(finalScale * (radius / obstacle.radius)));

            drawPixelSprite(sprite, obstacle.x, obstacle.y, scale, palette);
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
                    workerBoot: "#ffffff"
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
                workerBoot: "#1d1f1f"
            };
        }

        function drawEndScore() {
            context.fillStyle = settings.highContrast ? "rgba(0, 0, 0, 0.82)" : "rgba(29, 36, 31, 0.72)";
            context.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
            context.fillStyle = settings.highContrast ? "#ffe600" : "#ffffff";
            context.font = "900 " + (settings.largeText ? 66 : 54) + "px system-ui, sans-serif";
            context.textAlign = "center";
            context.fillText("Score " + game.score + " / " + game.animals.length, WORLD_WIDTH / 2, WORLD_HEIGHT / 2 + 18);
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
                    badPersonAway: game.badPerson.hiddenTime > 0
                };
            }
        };
    }

    function createInitialGame(settings) {
        var zoo = { x: 38, y: 38, w: 148, h: 106 };
        var player = createPlayer(zoo);
        var game = {
            zoo: zoo,
            player: player,
            badPerson: createBadPerson(),
            animals: [],
            obstacles: [],
            rescued: 0,
            rescueSequence: 0,
            score: 0,
            ended: false
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

    function createPlayer(zoo) {
        var startX = zoo.x + zoo.w / 2;
        var startY = zoo.y + zoo.h / 2;
        return { x: startX, y: startY, targetX: startX, targetY: startY, r: 17, speed: 220, carrying: null };
    }

    function createBadPerson() {
        var spawn = BAD_SPAWN_POINTS[0];
        var patrol = BAD_PATROL_POINTS[0];
        return {
            x: spawn.x,
            y: spawn.y,
            targetX: spawn.x,
            targetY: spawn.y,
            patrolX: patrol.x,
            patrolY: patrol.y,
            r: 18,
            speed: BAD_PERSON_SPEED,
            angle: Math.PI,
            hiddenTime: 0
        };
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
        getGameSnapshot: function () {
            return gameInstance && gameInstance.getSnapshot ? gameInstance.getSnapshot() : null;
        }
    };

    render();
}());
