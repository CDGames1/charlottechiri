// 11th Month Anniversary Monopoly Game (fixed JS)
// Replaces the original MonopolyGame class

class MonopolyGame {
    constructor() {
        this.players = [];
        this.currentPlayer = 0;
        this.currentTurn = 0; // Track the current turn index
        this.board = [];
        this.bank = {
            money: 20580,
            houses: 32,
            hotels: 12
        };
        this.gamePhase = 'waiting'; // waiting, playing, ended
        this.isMultiplayer = false;
        this.isHost = false;
        this.roomCode = null;
        this.peer = null;
        this.connections = [];
        this.diceValues = [1, 1];
        this.canRoll = true;

        this.initializeBoard();
        this.initializeEventListeners();
        this.initializePhotoCarousel();
    }

    initializeBoard() {
        // Standard Monopoly board spaces
        this.board = [
            { id: 0, name: 'GO', type: 'go', price: 0, rent: 0 },
            { id: 1, name: 'Mediterranean Ave', type: 'property', color: 'brown', price: 60, rent: [2, 10, 30, 90, 160, 250] },
            { id: 2, name: 'Community Chest', type: 'community-chest', price: 0, rent: 0 },
            { id: 3, name: 'Baltic Ave', type: 'property', color: 'brown', price: 60, rent: [4, 20, 60, 180, 320, 450] },
            { id: 4, name: 'Income Tax', type: 'tax', price: 0, rent: 200 },
            { id: 5, name: 'Reading Railroad', type: 'railroad', price: 200, rent: [25, 50, 100, 200] },
            { id: 6, name: 'Oriental Ave', type: 'property', color: 'light-blue', price: 100, rent: [6, 30, 90, 270, 400, 550] },
            { id: 7, name: 'Chance', type: 'chance', price: 0, rent: 0 },
            { id: 8, name: 'Vermont Ave', type: 'property', color: 'light-blue', price: 100, rent: [6, 30, 90, 270, 400, 550] },
            { id: 9, name: 'Connecticut Ave', type: 'property', color: 'light-blue', price: 120, rent: [8, 40, 100, 300, 450, 600] },
            { id: 10, name: 'Jail', type: 'jail', price: 0, rent: 0 },
            { id: 11, name: 'St. Charles Place', type: 'property', color: 'pink', price: 140, rent: [10, 50, 150, 450, 625, 750] },
            { id: 12, name: 'Electric Company', type: 'utility', price: 150, rent: [4, 10] },
            { id: 13, name: 'States Ave', type: 'property', color: 'pink', price: 140, rent: [10, 50, 150, 450, 625, 750] },
            { id: 14, name: 'Virginia Ave', type: 'property', color: 'pink', price: 160, rent: [12, 60, 180, 500, 700, 900] },
            { id: 15, name: 'Pennsylvania Railroad', type: 'railroad', price: 200, rent: [25, 50, 100, 200] },
            { id: 16, name: 'St. James Place', type: 'property', color: 'orange', price: 180, rent: [14, 70, 200, 550, 750, 950] },
            { id: 17, name: 'Community Chest', type: 'community-chest', price: 0, rent: 0 },
            { id: 18, name: 'Tennessee Ave', type: 'property', color: 'orange', price: 180, rent: [14, 70, 200, 550, 750, 950] },
            { id: 19, name: 'New York Ave', type: 'property', color: 'orange', price: 200, rent: [16, 80, 220, 600, 800, 1000] },
            { id: 20, name: 'Free Parking', type: 'parking', price: 0, rent: 0 },
            { id: 21, name: 'Kentucky Ave', type: 'property', color: 'red', price: 220, rent: [18, 90, 250, 700, 875, 1050] },
            { id: 22, name: 'Chance', type: 'chance', price: 0, rent: 0 },
            { id: 23, name: 'Indiana Ave', type: 'property', color: 'red', price: 220, rent: [18, 90, 250, 700, 875, 1050] },
            { id: 24, name: 'Illinois Ave', type: 'property', color: 'red', price: 240, rent: [20, 100, 300, 750, 925, 1100] },
            { id: 25, name: 'B&O Railroad', type: 'railroad', price: 200, rent: [25, 50, 100, 200] },
            { id: 26, name: 'Atlantic Ave', type: 'property', color: 'yellow', price: 260, rent: [22, 110, 330, 800, 975, 1150] },
            { id: 27, name: 'Ventnor Ave', type: 'property', color: 'yellow', price: 260, rent: [22, 110, 330, 800, 975, 1150] },
            { id: 28, name: 'Water Works', type: 'utility', price: 150, rent: [4, 10] },
            { id: 29, name: 'Marvin Gardens', type: 'property', color: 'yellow', price: 280, rent: [24, 120, 360, 850, 1025, 1200] },
            { id: 30, name: 'Go to Jail', type: 'go-to-jail', price: 0, rent: 0 },
            { id: 31, name: 'Pacific Ave', type: 'property', color: 'green', price: 300, rent: [26, 130, 390, 900, 1100, 1275] },
            { id: 32, name: 'North Carolina Ave', type: 'property', color: 'green', price: 300, rent: [26, 130, 390, 900, 1100, 1275] },
            { id: 33, name: 'Community Chest', type: 'community-chest', price: 0, rent: 0 },
            { id: 34, name: 'Pennsylvania Ave', type: 'property', color: 'green', price: 320, rent: [28, 150, 450, 1000, 1200, 1400] },
            { id: 35, name: 'Short Line Railroad', type: 'railroad', price: 200, rent: [25, 50, 100, 200] },
            { id: 36, name: 'Chance', type: 'chance', price: 0, rent: 0 },
            { id: 37, name: 'Park Place', type: 'property', color: 'dark-blue', price: 350, rent: [35, 175, 500, 1100, 1300, 1500] },
            { id: 38, name: 'Luxury Tax', type: 'tax', price: 0, rent: 100 },
            { id: 39, name: 'Boardwalk', type: 'property', color: 'dark-blue', price: 400, rent: [50, 200, 600, 1400, 1700, 2000] }
        ];
    }

    initializePhotoCarousel() {
        // Gracefully handle missing DOM or missing Splide library
        const photoList = document.getElementById('photo-list');
        const splideRoot = document.getElementById('photo-splide');
        if (!photoList || !splideRoot) {
            // no carousel DOM present — skip
            return;
        }

        for (let i = 1; i <= 28; i++) {
            const li = document.createElement('li');
            li.className = 'splide__slide';

            const img = document.createElement('img');
            img.src = `photos/photo${i}.jpg`;
            img.alt = `Anniversary Photo ${i}`;
            img.onerror = () => {
                // simple SVG fallback (data URI)
                img.src = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300'><rect width='100%' height='100%' fill='%238B1538'/><text x='50%' y='50%' font-family='Arial' font-size='22' fill='white' text-anchor='middle' dominant-baseline='middle'>Photo ${i}</text></svg>`;
            };

            li.appendChild(img);
            photoList.appendChild(li);
        }

        // If Splide is available, mount it; otherwise skip safely
        if (typeof Splide !== 'undefined') {
            try {
                const splide = new Splide('#photo-splide', {
                    type: 'loop',
                    autoplay: true,
                    interval: 2000,
                    speed: 800,
                    arrows: false,
                    pagination: false,
                    pauseOnHover: false,
                    pauseOnFocus: false
                });
                splide.mount();
            } catch (e) {
                console.warn('Splide init failed:', e);
            }
        }
    }

    initializeEventListeners() {
        // Add guards before attaching listeners so missing DOM doesn't throw errors
        const bindIf = (id, fn) => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('click', fn);
        };

        bindIf('start-game-btn', () => this.startGame());
        bindIf('create-room-btn', () => this.createRoom());
        bindIf('join-room-btn', () => this.showJoinRoomModal());
        bindIf('roll-dice-btn', () => this.rollDice());
        bindIf('buy-property-btn', () => this.buyProperty());
        bindIf('build-houses-btn', () => this.showBuildModal());
        bindIf('trade-btn', () => this.showTradeModal());
        bindIf('end-turn-btn', () => this.endTurn());

        // Keyboard: toggle any debug console etc. (guarded)
        document.addEventListener('keydown', (e) => {
            if (e.key === '`') {
                const c = document.getElementById('console');
                if (c) c.style.display = (c.style.display === 'block') ? 'none' : 'block';
            }
        });
    }

    startGame() {
        // Hide intro and show game (guarding missing elements)
        const intro = document.getElementById('intro-section');
        const gameContainer = document.getElementById('game-container');
        if (intro && typeof anime !== 'undefined' && gameContainer) {
            anime({
                targets: '#intro-section',
                opacity: 0,
                duration: 600,
                easing: 'easeOutQuad',
                complete: () => {
                    intro.style.display = 'none';
                    gameContainer.style.display = 'block';
                    anime({
                        targets: '#game-container',
                        opacity: [0, 1],
                        duration: 400,
                        easing: 'easeOutQuad'
                    });
                }
            });
        } else {
            // fallback: just toggle visibility if anime missing
            if (intro) intro.style.display = 'none';
            if (gameContainer) gameContainer.style.display = 'block';
        }

        // Initialize game board (render if DOM exists)
        this.renderBoard();

        // Add first player (local player)
        this.addPlayer('Player 1', true);

        // Add a few sample AI players for singleplayer testing (keeps example playable)
        if (this.players.length < 4) {
            this.addPlayer('Bot A', false);
            this.addPlayer('Bot B', false);
            this.addPlayer('Bot C', false);
        }

        // Update dashboard
        this.updateDashboard();
    }

    renderBoard() {
        const board = document.getElementById('game-board');
        if (!board) return;
        board.innerHTML = '';

        // Create board spaces
        this.board.forEach((space, index) => {
            const spaceElement = document.createElement('div');
            spaceElement.className = 'board-space';
            spaceElement.id = `space-${index}`;

            // Basic positioning (these will work if board container has relative positioning).
            // We only attempt to place them roughly — CSS should fine tune visuals in your HTML.
            spaceElement.style.position = 'absolute';

            // Position spaces in square formation (safe without relying on exact container size)
            if (index === 0) { // GO
                spaceElement.classList.add('corner');
                spaceElement.style.right = '0';
                spaceElement.style.bottom = '0';
            } else if (index < 10) { // Bottom row (right to left)
                spaceElement.classList.add('top-bottom');
                spaceElement.style.bottom = '0';
                spaceElement.style.left = `${Math.max(0, (10 - index) * 70 + 100)}px`;
            } else if (index === 10) { // Jail (bottom-left)
                spaceElement.classList.add('corner');
                spaceElement.style.left = '0';
                spaceElement.style.bottom = '0';
            } else if (index < 20) { // Left column (bottom to top)
                spaceElement.classList.add('side');
                spaceElement.style.left = '0';
                spaceElement.style.bottom = `${Math.max(0, (20 - index) * 70 + 100)}px`;
            } else if (index === 20) { // Free Parking (top-left)
                spaceElement.classList.add('corner');
                spaceElement.style.top = '0';
                spaceElement.style.left = '0';
            } else if (index < 30) { // Top row (left to right)
                spaceElement.classList.add('top-bottom');
                spaceElement.style.top = '0';
                spaceElement.style.left = `${Math.max(0, (index - 20) * 70 + 100)}px`;
            } else if (index === 30) { // Go to Jail (top-right)
                spaceElement.classList.add('corner');
                spaceElement.style.top = '0';
                spaceElement.style.right = '0';
            } else { // Right column (top to bottom)
                spaceElement.classList.add('side');
                spaceElement.style.right = '0';
                spaceElement.style.top = `${Math.max(0, (index - 30) * 70 + 100)}px`;
            }

            // Add color classes for properties (safe)
            if (space.type === 'property') {
                spaceElement.classList.add(`property-${space.color || 'default'}`);
            } else if (space.type === 'railroad') {
                spaceElement.classList.add('property-railroad');
            } else if (space.type === 'utility') {
                spaceElement.classList.add('property-utility');
            }

            // Add space content
            spaceElement.innerHTML = `
                <div style="font-weight: bold;">${space.name}</div>
                ${space.price > 0 ? `<div>$${space.price}</div>` : ''}
            `;

            // Add click event (safe)
            spaceElement.addEventListener('click', () => {
                this.showSpaceDetails(index);
            });

            board.appendChild(spaceElement);
        });
    }

    addPlayer(name, isLocal = false) {
        const id = this.players.length; // index-based id
        const player = {
            id: id,
            name: name || `Player ${id + 1}`,
            isLocal: !!isLocal,
            money: 1500,
            position: 0,
            properties: [],
            inJail: false,
            jailTurns: 0,
            getOutOfJailFree: 0,
            token: `token-player${id + 1}`
        };

        this.players.push(player);
        this.createPlayerToken(player);

        return player;
    }

    createPlayerToken(player) {
        const board = document.getElementById('game-board');
        if (!board) return;

        const token = document.createElement('div');
        token.className = `player-token ${player.token}`;
        token.id = `player-token-${player.id}`;
        token.style.position = 'absolute';
        token.style.left = '10px';
        token.style.top = '10px';
        token.style.width = '18px';
        token.style.height = '18px';
        token.style.borderRadius = '50%';
        token.style.background = player.isLocal ? '#7de3c7' : '#ffd166';
        token.style.display = 'flex';
        token.style.alignItems = 'center';
        token.style.justifyContent = 'center';
        token.style.fontSize = '11px';
        token.textContent = player.name.charAt(0).toUpperCase();

        board.appendChild(token);
    }

    updatePlayerPosition(player) {
        const token = document.getElementById(`player-token-${player.id}`);
        const space = document.getElementById(`space-${player.position}`);

        if (token && space) {
            const rect = space.getBoundingClientRect();
            const boardRect = document.getElementById('game-board').getBoundingClientRect();

            // Calculate position relative to board
            const left = rect.left - boardRect.left + 6 + (player.id * 18);
            const top = rect.top - boardRect.top + 6 + (player.id * 18);

            if (typeof anime !== 'undefined') {
                anime({
                    targets: token,
                    left: `${left}px`,
                    top: `${top}px`,
                    duration: 600,
                    easing: 'easeOutQuad'
                });
            } else {
                token.style.left = `${left}px`;
                token.style.top = `${top}px`;
            }
        }
    }

    rollDice() {
        // Make sure there is a players array and current indices are valid
        if (this.players.length === 0) {
            this.showMessage("No players in the game yet.");
            return;
        }

        // Only allow the currentTurn player to roll (in multiplayer host logic this may differ)
        if (this.currentTurn !== this.currentPlayer) {
            this.showMessage("It's not your turn!");
            return;
        }

        if (!this.canRoll) return;
        this.canRoll = false;

        // Animate dice rolling if dice elements exist and anime is available
        const dice1 = document.getElementById('dice1');
        const dice2 = document.getElementById('dice2');

        if (dice1 && dice2 && typeof anime !== 'undefined') {
            anime({
                targets: [dice1, dice2],
                rotate: '360deg',
                scale: [1, 1.2, 1],
                duration: 1000,
                easing: 'easeOutQuad',
                loop: 2,
                complete: () => {
                    // Generate random dice values
                    this.diceValues = [Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1];

                    dice1.textContent = this.diceValues[0];
                    dice2.textContent = this.diceValues[1];

                    // Move player
                    this.movePlayer(this.diceValues[0] + this.diceValues[1]);
                }
            });
        } else {
            // fallback random generation if no DOM/anime
            this.diceValues = [Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1];
            if (dice1) dice1.textContent = this.diceValues[0];
            if (dice2) dice2.textContent = this.diceValues[1];
            this.movePlayer(this.diceValues[0] + this.diceValues[1]);
        }
    }

    movePlayer(steps) {
        const player = this.players[this.currentPlayer];
        if (!player) return;

        const oldPosition = player.position;

        // Calculate new position
        player.position = (player.position + steps) % 40;

        // Check if passed GO
        if (player.position < oldPosition && steps > 0) {
            player.money += 200;
            this.showMessage('Passed GO! Collect $200');
            this.updateDashboard();
        }

        // Update player position visually
        this.updatePlayerPosition(player);

        // Broadcast movement to other players
        if (this.isMultiplayer) {
            this.broadcastData({
                type: 'move',
                playerId: player.id,
                position: player.position,
                money: player.money
            });
        }

        // Handle landing on space after a short delay (so animation can complete)
        setTimeout(() => {
            this.handleLanding(player);
        }, 700);
    }

    handleLanding(player) {
        const space = this.board[player.position];
        if (!space) {
            this.endTurnOptions();
            return;
        }

        switch (space.type) {
            case 'property':
            case 'railroad':
            case 'utility':
                this.handlePropertyLanding(player, space);
                break;
            case 'tax':
                this.handleTaxLanding(player, space);
                break;
            case 'chance':
                this.drawCard('chance');
                break;
            case 'community-chest':
                this.drawCard('community-chest');
                break;
            case 'go-to-jail':
                this.goToJail(player);
                break;
            default:
                this.endTurnOptions();
        }
    }

    handlePropertyLanding(player, space) {
        const property = this.getProperty(space.id);

        if (!property) {
            // Property is available for purchase
            const buyBtn = document.getElementById('buy-property-btn');
            if (buyBtn) buyBtn.disabled = false;
            this.showMessage(`You landed on ${space.name}. Would you like to buy it for $${space.price}?`);
            return;
        }

        if (!property.owner) {
            const buyBtn = document.getElementById('buy-property-btn');
            if (buyBtn) buyBtn.disabled = false;
            this.showMessage(`You landed on ${space.name}. Would you like to buy it for $${space.price}?`);
        } else if (property.owner !== player.id) {
            // Pay rent
            const rent = this.calculateRent(property, space);
            player.money -= rent;
            const owner = this.players[property.owner];
            if (owner) owner.money += rent;
            this.showMessage(`You paid $${rent} rent to ${owner ? owner.name : 'Owner'}`);
            this.updateDashboard();
            this.endTurnOptions();
        } else {
            this.endTurnOptions();
        }
    }

    handleTaxLanding(player, space) {
        player.money -= space.rent;
        this.showMessage(`You paid $${space.rent} in taxes`);
        this.updateDashboard();
        this.endTurnOptions();
    }

    calculateRent(property, space) {
        if (!property || property.mortgaged) return 0;

        if (space.type === 'property') {
            if (property.hotel) {
                return space.rent[5];
            } else if (property.houses > 0) {
                return space.rent[property.houses];
            } else {
                // Check for monopoly
                const monopoly = this.checkMonopoly(space.color, property.owner);
                return monopoly ? space.rent[0] * 2 : space.rent[0];
            }
        } else if (space.type === 'railroad') {
            const railroads = this.getPlayerRailroads(property.owner);
            return space.rent[Math.max(0, railroads.length - 1)];
        } else if (space.type === 'utility') {
            const utilities = this.getPlayerUtilities(property.owner);
            if (utilities.length === 2) {
                return (this.diceValues[0] + this.diceValues[1]) * 10;
            } else {
                return (this.diceValues[0] + this.diceValues[1]) * 4;
            }
        }

        return 0;
    }

    buyProperty() {
        const player = this.players[this.currentPlayer];
        if (!player) return;

        const space = this.board[player.position];
        if (!space || !space.price) {
            this.showMessage('This space cannot be purchased.');
            return;
        }

        if (player.money >= space.price) {
            player.money -= space.price;

            const property = {
                id: space.id,
                name: space.name,
                owner: player.id,
                houses: 0,
                hotel: false,
                mortgaged: false,
                color: space.color,
                type: space.type
            };

            player.properties.push(property);
            this.updateDashboard();
            this.showMessage(`You bought ${space.name} for $${space.price}!`);

            const buyBtn = document.getElementById('buy-property-btn');
            if (buyBtn) buyBtn.disabled = true;

            this.endTurnOptions();
        } else {
            this.showMessage("You don't have enough money to buy this property!");
        }
    }

    getProperty(spaceId) {
        for (let i = 0; i < this.players.length; i++) {
            const property = this.players[i].properties.find(p => p.id === spaceId);
            if (property) return property;
        }
        return null;
    }

    checkMonopoly(color, ownerId) {
        if (!color || ownerId == null) return false;
        const colorProperties = this.board.filter(space => space.color === color);
        const ownedProperties = this.players[ownerId]
            ? this.players[ownerId].properties.filter(p => p.color === color)
            : [];
        return colorProperties.length === ownedProperties.length && colorProperties.length > 0;
    }

    getPlayerRailroads(ownerId) {
        if (!this.players[ownerId]) return [];
        return this.players[ownerId].properties.filter(p => p.type === 'railroad');
    }

    getPlayerUtilities(ownerId) {
        if (!this.players[ownerId]) return [];
        return this.players[ownerId].properties.filter(p => p.type === 'utility');
    }

    drawCard(type) {
        const chanceCards = [
            'Advance to Go (Collect $200)',
            'Advance to Illinois Ave',
            'Advance to St. Charles Place',
            'Advance to nearest Railroad',
            'Advance to nearest Utility',
            'Bank pays you dividend of $50',
            'Get Out of Jail Free',
            'Go Back 3 Spaces',
            'Go to Jail',
            'Make general repairs on all your property',
            'Speeding fine $15',
            'Take a trip to Reading Railroad',
            'You have been elected Chairman of the Board',
            'Your building loan matures'
        ];

        const communityChestCards = [
            'Advance to Go (Collect $200)',
            'Bank error in your favor. Collect $200',
            'Doctor\'s fee. Pay $50',
            'From sale of stock you get $50',
            'Get Out of Jail Free',
            'Go to Jail',
            'Holiday fund matures. Receive $100',
            'Income tax refund. Collect $20',
            'It is your birthday. Collect $10 from every player',
            'Life insurance matures. Collect $100',
            'Pay hospital fees of $100',
            'Pay school fees of $50',
            'Receive $25 consultancy fee',
            'You are assessed for street repair',
            'You have won second prize in a beauty contest'
        ];

        // Pick a random card
        let cardText = '';
        if (type === 'chance') {
            cardText = chanceCards[Math.floor(Math.random() * chanceCards.length)];
        } else if (type === 'community-chest') {
            cardText = communityChestCards[Math.floor(Math.random() * communityChestCards.length)];
        } else {
            cardText = 'Unknown card type';
        }

        const modal = this.createModal(`${type.charAt(0).toUpperCase() + type.slice(1)} Card`, `<p>${cardText}</p>`, [
            { text: 'OK', action: () => this.closeModal() }
        ]);

        // modal already appended by createModal
    }

    endTurnOptions() {
        const endBtn = document.getElementById('end-turn-btn');
        if (endBtn) endBtn.disabled = false;

        // Check if player can build houses
        const player = this.players[this.currentPlayer];
        if (!player) return;

        const buildableProperties = this.getBuildableProperties(player);

        const buildBtn = document.getElementById('build-houses-btn');
        if (buildBtn) buildBtn.disabled = buildableProperties.length === 0;

        const tradeBtn = document.getElementById('trade-btn');
        if (tradeBtn) tradeBtn.disabled = (this.players.length <= 1);
    }

    getBuildableProperties(player) {
        const buildable = [];
        const colorGroups = {};

        // Group properties by color
        (player.properties || []).forEach(property => {
            if (property.color) {
                if (!colorGroups[property.color]) {
                    colorGroups[property.color] = [];
                }
                colorGroups[property.color].push(property);
            }
        });

        // Check for complete color sets
        Object.keys(colorGroups).forEach(color => {
            const colorProperties = this.board.filter(space => space.color === color);
            if (colorProperties.length > 0 && colorGroups[color].length === colorProperties.length) {
                buildable.push(...colorGroups[color]);
            }
        });

        return buildable;
    }

    endTurn() {
        // Reset turn state
        this.canRoll = true;
        this.currentTurn = (this.currentTurn + 1) % Math.max(1, this.players.length);

        // Send turn update in multiplayer mode
        if (this.isMultiplayer) {
            this.broadcastData({ type: 'turn', currentTurn: this.currentTurn });
        }

        // Update UI (guarded)
        const rollBtn = document.getElementById('roll-dice-btn');
        if (rollBtn) rollBtn.disabled = (this.currentTurn !== this.currentPlayer);

        const buyBtn = document.getElementById('buy-property-btn');
        if (buyBtn) buyBtn.disabled = true;
        const buildBtn = document.getElementById('build-houses-btn');
        if (buildBtn) buildBtn.disabled = true;
        const tradeBtn = document.getElementById('trade-btn');
        if (tradeBtn) tradeBtn.disabled = true;
        const endBtn = document.getElementById('end-turn-btn');
        if (endBtn) endBtn.disabled = true;

        this.updateDashboard();
        const next = this.players[this.currentTurn];
        this.showMessage(`It's now ${next ? next.name : 'Player'}'s turn`);
    }

    updateDashboard() {
        const player = this.players[this.currentPlayer];
        if (!player) return;

        const avatarEl = document.getElementById('player-avatar');
        if (avatarEl) avatarEl.textContent = player.name.substring(0, 2).toUpperCase();

        const nameEl = document.getElementById('player-name');
        if (nameEl) nameEl.textContent = player.name;

        const moneyEl = document.getElementById('player-money');
        if (moneyEl) moneyEl.textContent = `$${player.money.toLocaleString()}`;

        // Update properties list
        const propertiesList = document.getElementById('properties-list');
        if (!propertiesList) return;

        propertiesList.innerHTML = '';

        if (!player.properties || player.properties.length === 0) {
            propertiesList.innerHTML = '<div class="property-item">No properties yet</div>';
        } else {
            player.properties.forEach(property => {
                const item = document.createElement('div');
                item.className = 'property-item';
                item.innerHTML = `
                    <strong>${property.name}</strong>
                    ${property.houses > 0 ? ` (${property.houses} houses)` : ''}
                    ${property.hotel ? ' (Hotel)' : ''}
                    ${property.mortgaged ? ' (Mortgaged)' : ''}
                `;
                propertiesList.appendChild(item);
            });
        }
    }

    createModal(title, contentHTML, buttons = []) {
        // Create a modal container and append to #modal-container or document.body
        const container = document.getElementById('modal-container') || document.body;

        const modal = document.createElement('div');
        modal.className = 'modal fade-in';
        modal.style.position = 'fixed';
        modal.style.inset = '0';
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
        modal.style.zIndex = 2000;
        modal.style.background = 'rgba(2,6,23,0.6)';

        const inner = document.createElement('div');
        inner.className = 'modal-content';
        inner.style.background = '#071025';
        inner.style.padding = '16px';
        inner.style.borderRadius = '8px';
        inner.style.minWidth = '320px';
        inner.innerHTML = `
            <div class="modal-header" style="font-weight:700;margin-bottom:8px;">${title}</div>
            <div class="modal-body">${contentHTML}</div>
            <div class="modal-actions" style="margin-top:12px;text-align:right;"></div>
        `;

        const actionsDiv = inner.querySelector('.modal-actions');

        buttons.forEach(btn => {
            const b = document.createElement('button');
            b.className = 'action-btn';
            b.textContent = btn.text;
            b.style.marginLeft = '8px';
            // If action is function, call it; if it's string, eval it (string support kept but not recommended)
            if (typeof btn.action === 'function') {
                b.addEventListener('click', () => {
                    try {
                        btn.action();
                    } catch (err) {
                        console.error('Modal button action error:', err);
                    }
                });
            } else if (typeof btn.action === 'string') {
                b.addEventListener('click', () => {
                    try {
                        // safer eval: allow 'game.' calls by default
                        // if user passed e.g. 'game.joinRoom()' this will work
                        /* eslint no-eval: "off" */
                        eval(btn.action);
                    } catch (err) {
                        console.error('Modal button eval error:', err);
                    }
                });
            } else {
                // no-op click that closes modal
                b.addEventListener('click', () => this.closeModal());
            }
            actionsDiv.appendChild(b);
        });

        modal.appendChild(inner);
        container.appendChild(modal);

        return modal;
    }

    closeModal() {
        const modal = (document.getElementById('modal-container') || document.body).querySelector('.modal');
        if (modal) {
            if (typeof anime !== 'undefined') {
                anime({
                    targets: modal,
                    opacity: 0,
                    duration: 200,
                    easing: 'easeOutQuad',
                    complete: () => modal.remove()
                });
            } else {
                modal.remove();
            }
        }
    }

    showMessage(message) {
        // Create a temporary message overlay
        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(139, 21, 56, 0.9);
            color: white;
            padding: 1rem 2rem;
            border-radius: 10px;
            z-index: 1001;
            font-weight: 600;
            text-align: center;
        `;
        messageDiv.textContent = message;

        document.body.appendChild(messageDiv);

        if (typeof anime !== 'undefined') {
            anime({
                targets: messageDiv,
                opacity: [0, 1],
                scale: [0.8, 1],
                duration: 350,
                easing: 'easeOutQuad',
                complete: () => {
                    setTimeout(() => {
                        anime({
                            targets: messageDiv,
                            opacity: 0,
                            scale: 0.8,
                            duration: 250,
                            easing: 'easeOutQuad',
                            complete: () => {
                                messageDiv.remove();
                            }
                        });
                    }, 1400);
                }
            });
        } else {
            setTimeout(() => messageDiv.remove(), 1600);
        }
    }

    // Multiplayer functions
    createRoom() {
        this.roomCode = this.generateRoomCode();
        this.isHost = true;
        this.isMultiplayer = true;

        // Initialize PeerJS without forcing static ID (safer)
        try {
            this.peer = new Peer(); // let Peer assign an ID
            this.peer.on('open', (id) => {
                console.log('Peer ID:', id);
                this.showMessage(`Room created! Peer ID: ${id}`);
                const display = document.getElementById('room-code-display');
                const codeEl = document.getElementById('room-code');
                if (codeEl) codeEl.textContent = id;
                if (display) display.style.display = 'block';
                // store peer id as roomCode for convenience
                this.roomCode = id;
            });

            this.peer.on('connection', (conn) => {
                this.connections.push(conn);
                this.handleConnection(conn);
            });
        } catch (err) {
            console.error('Peer init error:', err);
            this.showMessage('Failed to initialize multiplayer (PeerJS).');
        }
    }

    showJoinRoomModal() {
        const modal = this.createModal('Join Room', `
            <div style="margin-bottom: 1rem;">
                <label>Enter Room Code (Peer ID):</label>
                <input type="text" id="room-code-input" style="width: 100%; padding: 0.5rem; margin-top: 0.5rem; border: 1px solid #ddd; border-radius: 5px;">
            </div>
        `, [
            { text: 'Join', action: () => this.joinRoomFromModal() },
            { text: 'Cancel', action: () => this.closeModal() }
        ]);

        // modal appended already
    }

    joinRoomFromModal() {
        const input = document.getElementById('room-code-input');
        if (!input) return;
        const roomCode = input.value.trim();
        if (!roomCode) {
            this.showMessage('Enter a room code.');
            return;
        }
        this.joinRoom(roomCode);
        this.closeModal();
    }

    joinRoom(roomCode) {
        if (!roomCode) return;
        this.roomCode = roomCode;
        this.isMultiplayer = true;

        try {
            this.peer = new Peer();
            this.peer.on('open', (id) => {
                console.log('Peer ID:', id);
                const conn = this.peer.connect(roomCode);
                conn.on('open', () => {
                    this.connections.push(conn);
                    this.handleConnection(conn);
                    this.showMessage('Connected to host!');
                });
            });
        } catch (err) {
            console.error('Peer connect error:', err);
            this.showMessage('Failed to connect to room.');
        }
    }

    generateRoomCode() {
        return Math.random().toString(36).substr(2, 6).toUpperCase();
    }

    handleConnection(conn) {
        conn.on('open', () => {
            console.log('Connection opened');
            this.showMessage('Player connected!');
        });

        conn.on('data', (data) => {
            console.log('Received data:', data);
            this.handleMultiplayerData(data);
        });

        conn.on('error', (err) => {
            console.error('Connection error:', err);
        });

        // on close we remove connection
        conn.on('close', () => {
            this.connections = this.connections.filter(c => c !== conn);
            this.showMessage('A player disconnected.');
        });
    }

    handleMultiplayerData(data) {
        if (!data || typeof data !== 'object') return;
        if (data.type === 'turn') {
            this.currentTurn = data.currentTurn;

            // Update UI for the new turn
            const rollBtn = document.getElementById('roll-dice-btn');
            if (rollBtn) rollBtn.disabled = (this.currentTurn !== this.currentPlayer);
            const p = this.players[this.currentTurn];
            this.showMessage(`It's now ${p ? p.name : 'Player'}'s turn`);
        }
    }

    showSpaceDetails(spaceId) {
        const space = this.board[spaceId];
        if (!space) return;

        const property = this.getProperty(spaceId);

        let content = `
            <h3>${space.name}</h3>
            <p>Type: ${space.type}</p>
        `;

        if (space.price > 0) {
            content += `<p>Price: $${space.price}</p>`;
        }

        if (property) {
            const ownerName = this.players[property.owner] ? this.players[property.owner].name : 'Unknown';
            content += `
                <p>Owner: ${ownerName}</p>
                <p>Houses: ${property.houses}</p>
                <p>Hotel: ${property.hotel ? 'Yes' : 'No'}</p>
                <p>Mortgaged: ${property.mortgaged ? 'Yes' : 'No'}</p>
            `;
        }

        this.createModal('Property Details', content, [
            { text: 'Close', action: () => this.closeModal() }
        ]);
    }

    showBuildModal() {
        const player = this.players[this.currentPlayer];
        if (!player) return;

        const buildableProperties = this.getBuildableProperties(player);

        if (buildableProperties.length === 0) {
            this.showMessage("You don't have any complete color sets to build on!");
            return;
        }

        let content = '<div style="max-height: 60vh; overflow:auto;">';
        buildableProperties.forEach(property => {
            const space = this.board[property.id] || {};
            const houseCost = (space.housePrices && space.housePrices[0]) ? space.housePrices[0] : Math.max(50, Math.floor(space.price / 2));
            const hotelCost = (space.housePrices && space.housePrices[1]) ? space.housePrices[1] : Math.max(200, Math.floor(space.price * 1));
            content += `
                <div style="margin: 1rem 0; padding: 1rem; border: 1px solid #ddd; border-radius: 5px;">
                    <h4>${property.name}</h4>
                    <p>Houses: ${property.houses}</p>
                    <p>Hotel: ${property.hotel ? 'Yes' : 'No'}</p>
                    <div style="display:flex;gap:8px;margin-top:6px;">
                        <button class="build-house-btn" data-id="${property.id}" ${property.hotel || property.houses >= 4 ? 'disabled' : ''}>
                            Build House ($${houseCost})
                        </button>
                        <button class="build-hotel-btn" data-id="${property.id}" ${property.hotel || property.houses < 4 ? 'disabled' : ''}>
                            Build Hotel ($${hotelCost})
                        </button>
                    </div>
                </div>
            `;
        });
        content += '</div>';

        const modal = this.createModal('Build Properties', content, [
            { text: 'Close', action: () => this.closeModal() }
        ]);

        // Attach event listeners to the dynamically created buttons
        const buildBtns = modal.querySelectorAll('.build-house-btn');
        buildBtns.forEach(btn => {
            const id = parseInt(btn.getAttribute('data-id'), 10);
            btn.addEventListener('click', () => this.buildHouse(id));
        });

        const hotelBtns = modal.querySelectorAll('.build-hotel-btn');
        hotelBtns.forEach(btn => {
            const id = parseInt(btn.getAttribute('data-id'), 10);
            btn.addEventListener('click', () => this.buildHotel(id));
        });
    }

    buildHouse(propertyId) {
        const player = this.players[this.currentPlayer];
        if (!player) return;

        const property = player.properties.find(p => p.id === propertyId);
        if (!property) {
            this.showMessage('You do not own that property.');
            return;
        }

        const space = this.board[propertyId] || {};
        const cost = space.housePrices ? space.housePrices[0] : Math.max(50, Math.floor(space.price / 2));

        if (player.money >= cost) {
            player.money -= cost;
            property.houses = (property.houses || 0) + 1;
            this.updateDashboard();
            this.showMessage(`Built house on ${property.name} for $${cost}!`);
            this.closeModal();
        } else {
            this.showMessage("Not enough money to build!");
        }
    }

    buildHotel(propertyId) {
        const player = this.players[this.currentPlayer];
        if (!player) return;

        const property = player.properties.find(p => p.id === propertyId);
        if (!property) {
            this.showMessage('You do not own that property.');
            return;
        }

        const space = this.board[propertyId] || {};
        const cost = space.housePrices ? space.housePrices[1] : Math.max(200, Math.floor(space.price * 1));

        if (player.money >= cost) {
            player.money -= cost;
            property.hotel = true;
            property.houses = 0;
            this.updateDashboard();
            this.showMessage(`Built hotel on ${property.name} for $${cost}!`);
            this.closeModal();
        } else {
            this.showMessage("Not enough money to build!");
        }
    }

    showTradeModal() {
        // Skeleton trade modal (extendable)
        this.showMessage("Trading feature coming soon!");
    }

    broadcastData(data) {
        this.connections.forEach(conn => {
            try {
                conn.send(data);
            } catch (err) {
                console.warn('Broadcast failed for a connection', err);
            }
        });
    }

    // Utility: go to jail (simple)
    goToJail(player) {
        player.position = 10; // jail index in this mapping
        player.inJail = true;
        player.jailTurns = 0;
        this.updatePlayerPosition(player);
        this.showMessage(`${player.name} was sent to Jail.`);
        this.endTurnOptions();
    }
}

// Initialize game when page loads
let game;
document.addEventListener('DOMContentLoaded', () => {
    game = new MonopolyGame();
});
