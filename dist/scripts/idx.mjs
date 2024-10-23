import DiceWebRTCModule from './dicewebrtcv12.mjs';

// import DiceWebRTCModule from './dicewebrtc.mjs';
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
    console.log('DICE WEBRTC MODULE Hooks.once ready');
    game.dicewebrtc = new DiceWebRTCModule();

    console.log('game.dicewebrtc !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!', game.dicewebrtc);

    game.dicewebrtc.render(true);
});

// Hooks.on('createChatMessage', (message, options, userId) => {
//     if (game.user.id !== userId) return;
    
//     const messageData = {
//         type: 'chatMessage',
//         content: message.data.content,
//         speaker: message.data.speaker,
//         timestamp: message.data.timestamp
//     };

//     game.dicewebrtc.activeConnections.forEach(conn => {
//         if (conn.open) conn.send(messageData);
//     });
// });

// Use for token updates
// const debouncedTokenUpdate = foundry.utils.debounce((tokenId, updates) => {
//     const token = canvas.tokens.get(tokenId);
//     if (!token || !token.actor || !token.actor.isOwner) return;

//     game.dicewebrtc.activeConnections.forEach(conn => {
//         if (conn.open) {
//             conn.send({
//                 type: 'tokenUpdate',
//                 tokenId: tokenId,
//                 updates: updates
//             });
//         }
//     });
// }, 100);

// Hooks.on('updateToken', (token, updates) => {
//     debouncedTokenUpdate(token.id, updates);
// });

// Hooks.on('renderChatLog', (app, html, data) => {
//     const chatControls = html.find('#chat-controls');
//     const qrButton = $(`<a class="webrtc-chat-control" title="Open Dice WebRTC Module">
//                             <i class="fas fa-qrcode"></i>
//                         </a>`);
    
//     qrButton.click(() => game.dicewebrtc.render(true));
//     chatControls.append(qrButton);
// });
