import { Peer } from 'peerjs';
import QRCode from 'qrcode';

class DiceWebRTCModule extends Application {
    static ID = 'dice-webrtc-module';

    constructor(options = {}) {
        console.log('DiceWebRTCModule constructor');
        super(options);
        this.peer = null;
        this.activeConnections = new Map();
    }

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            id: this.ID,
            title: 'Dice WebRTC Module',
            template: `modules/${this.ID}/templates/module-config.html`,
            width: 400,
            height: 300,
            resizable: true
        });
    }

    activateListeners(html) {
        super.activateListeners(html);
        html.find('.generate-qr').click(this._onGenerateQR.bind(this));
        html.find('.disconnect-all').click(this._onDisconnectAll.bind(this));
    }

    async _onGenerateQR(event) {
        event.preventDefault();
        if (!game.user.isGM) return;
        await this._initializePeer();
    }

    _onDisconnectAll(event) {
        event.preventDefault();
        if (!game.user.isGM) return;
        this._cleanupConnections();
    }

    async _initializePeer() {
        if (this.peer) this.peer.destroy();
        this.peer = new Peer();

        this.peer.on('open', (id) => {
            console.log('My peer ID is: ' + id);
            this._generateAndDisplayQR(id);
        });

        this.peer.on('connection', this._handleIncomingConnection.bind(this));
    }

    async _generateAndDisplayQR(id) {
        try {
            const url = await QRCode.toDataURL(id);
            const content = `
                <div style="text-align: center;">
                    <h3>Scan to Connect</h3>
                    <img src="${url}" alt="QR Code" style="max-width: 200px;">
                    <p>Peer ID: ${id}</p>
                </div>
            `;
            
            ChatMessage.create({
                content: content,
                whisper: [game.user.id],
                type: CONST.CHAT_MESSAGE_TYPES.OTHER
            });
        } catch (error) {
            console.error('Error generating QR code:', error);
            ui.notifications.error('Failed to generate QR code.');
        }
    }

    _handleIncomingConnection(conn) {
        console.log('Incoming connection from:', conn.peer);

        conn.on('open', () => {
            console.log('Connection established with:', conn.peer);
            this._authenticateConnection(conn);
        });

        conn.on('data', (data) => this._handleIncomingData(conn, data));
        conn.on('close', () => this._handleConnectionClose(conn));
    }

    _authenticateConnection(conn) {
        const secret = game.settings.get(DiceWebRTCModule.ID, 'secret');
        conn.send({ type: 'auth', userName: game.user.name });
        
        // Implement your authentication logic here
        // For example, wait for a response with the correct secret
    }

    _handleIncomingData(conn, data) {
        if (!this._validateData(data)) {
            console.error('Invalid data received:', data);
            return;
        }

        switch (data.type) {
            case 'auth':
                this._handleAuthResponse(conn, data);
                break;
            case 'actorUpdate':
                this._handleActorUpdate(data);
                break;
            case 'roll':
                this._handleRollRequest(conn, data);
                break;
            // Add more cases as needed
        }
    }

    _validateData(data) {
        // Implement data validation using foundry.data.validators
        return true; // Placeholder
    }

    _handleAuthResponse(conn, data) {
        // Implement your authentication verification logic
        // If successful:
        this.activeConnections.set(conn.peer, conn);
        this._syncActorData(conn);
    }

    _handleActorUpdate(data) {
        if (!game.user.isGM) return;
        const actor = game.actors.get(data.actorId);
        if (actor && actor.isOwner) {
            actor.update(data.updates);
        }
    }

    async _handleRollRequest(conn, data) {
        const actor = game.actors.get(data.actorId);
        if (!actor || !actor.isOwner) return;

        const rollData = actor.getRollData();
        let roll;

        switch (data.rollType) {
            case 'attack':
            case 'damage':
                if (data.itemId) {
                    const item = actor.items.get(data.itemId);
                    if (!item) return;
                    roll = data.rollType === 'attack' ? await item.rollAttack() : await item.rollDamage();
                }
                break;
            case 'ability':
                roll = await actor.rollAbilityTest(data.abilityId);
                break;
            case 'skill':
                roll = await actor.rollSkill(data.skillId);
                break;
            case 'save':
                roll = await actor.rollAbilitySave(data.abilityId);
                break;
            default:
                if (data.formula) {
                    roll = new Roll(data.formula, rollData);
                    await roll.evaluate({async: true});
                }
        }

        if (roll) {
            await roll.toMessage({
                speaker: ChatMessage.getSpeaker({actor: actor}),
                flavor: data.flavor
            });
        }
    }

    _syncActorData(conn) {
        const ownedActors = game.actors.contents.filter(a => a.isOwner);
        ownedActors.forEach(actor => {
            const data = actor.toObject();
            conn.send({ type: 'actorSync', actorData: data });
        });
    }

    _handleConnectionClose(conn) {
        console.log('Connection closed:', conn.peer);
        this.activeConnections.delete(conn.peer);
    }

    _cleanupConnections() {
        this.activeConnections.forEach(conn => conn.close());
        this.activeConnections.clear();
        if (this.peer) {
            this.peer.destroy();
            this.peer = null;
        }
    }
}

Hooks.once('init', () => {
    game.settings.register(DiceWebRTCModule.ID, 'secret', {
        name: 'Connection Secret',
        hint: 'A shared secret for authenticating peer connections.',
        scope: 'world',
        config: true,
        type: String,
        default: ''
    });

    game.settings.registerMenu(DiceWebRTCModule.ID, 'configMenu', {
        name: 'Dice WebRTC Module Configuration',
        label: 'Configure',
        hint: 'Configure the WebRTC module settings.',
        icon: 'fas fa-cogs',
        type: DiceWebRTCModule,
        restricted: true
    });
});

Hooks.once('ready', () => {
    game.dicewebrtc = new DiceWebRTCModule();
});

Hooks.on('createChatMessage', (message, options, userId) => {
    if (game.user.id !== userId) return;
    
    const messageData = {
        type: 'chatMessage',
        content: message.data.content,
        speaker: message.data.speaker,
        timestamp: message.data.timestamp
    };

    game.dicewebrtc.activeConnections.forEach(conn => {
        if (conn.open) conn.send(messageData);
    });
});

// Use for token updates
const debouncedTokenUpdate = foundry.utils.debounce((tokenId, updates) => {
    const token = canvas.tokens.get(tokenId);
    if (!token || !token.actor || !token.actor.isOwner) return;

    game.dicewebrtc.activeConnections.forEach(conn => {
        if (conn.open) {
            conn.send({
                type: 'tokenUpdate',
                tokenId: tokenId,
                updates: updates
            });
        }
    });
}, 100);

Hooks.on('updateToken', (token, updates) => {
    debouncedTokenUpdate(token.id, updates);
});
