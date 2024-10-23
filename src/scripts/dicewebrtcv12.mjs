import { Peer } from 'peerjs';
import QRCode from 'qrcode';

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

export default class DiceWebRTCModule extends HandlebarsApplicationMixin(ApplicationV2) {
    static ID = 'dice-webrtc-module';

    static DEFAULT_OPTIONS = {
        tag: 'form',
        form: {
            handler: DiceWebRTCModule.formHandler,
            submitOnChange: false,
            closeOnSubmit: false,
        },
        actions: {
            'generate-qr': DiceWebRTCModule.newQRCode,
        }
    }

    static PARTS = {
        form: {
            template: `modules/${DiceWebRTCModule.ID}/templates/module-config.hbs`,
        }
    }

    static MESSAGE_TYPES = {
        ROLL_REQUEST: 'ROLL_REQUEST', // - request to roll dice
        // AUTH: 'AUTH', // - authentication request
        // ACTOR_UPDATE: 'ACTOR_UPDATE', // - contains updated actor data
        // ACTOR_SYNC: 'ACTOR_SYNC', // - request to sync actor data
        // CHAT: 'CHAT' // - chat message
    };

    async _prepareContext(options) {
        const context = await super._prepareContext(options);
        return {
            ...context,
            peerId: this.peerId,
            qrCodeUrl: this.qrCodeUrl,
        };
    }
    
    constructor(options) {
        super(options);
        this.peer = null;
        this.peerId = this.getPeerId();
        this.peerDataConnection = null;
        this.qrCodeUrl = null;
        this.initializePeer();
        this.generateQRCode();
    }

    static async formHandler(event, form, formData) {
        console.log('formHandler', event, form, formData);
    }

    static async newQRCode() {
        await this.generateQRCode();
    }

    async generateQRCode() {
        if (this.peerId) {
            try {
                this.qrCodeUrl = await QRCode.toDataURL(this.peerId);
                return null;
            } catch (error) {
                console.error('Error generating QR code:', error);
                ui.notifications.error('Failed to generate QR code.');
                return null;
            }
        } else {
            ui.notifications.error('No peer ID found.');
            return null;
        }
    }

    // static async generateAndDisplayQR() {
    //     if(this.peerId){
    //         try {
    //             const url = await QRCode.toDataURL(this.peerId);
    //             const content = `
    //                 <div style="text-align: center;">
    //                     <h3>Scan to Connect</h3>
    //                     <img src="${url}" alt="QR Code" style="max-width: 200px;">
    //                     <p>Peer ID: ${this.peerId}</p>
    //                 </div>
    //             `;
                
    //             ChatMessage.create({
    //                 content: content,
    //                 whisper: [game.user.id],
    //                 type: CONST.CHAT_MESSAGE_TYPES.OTHER
    //             });
    //         } catch (error) {
    //             console.error('Error generating QR code:', error);
    //             ui.notifications.error('Failed to generate QR code.');
    //         }
    //     }
    //     else {
    //         ui.notifications.error('No peer ID found.');
    //     }
    // }

    generatePeerId() {
        const peerId = `${DiceWebRTCModule.ID}.${game.userId}.${foundry.utils.randomID(16)}`;
        game.user.setFlag(DiceWebRTCModule.ID, 'peerId', peerId); // - technically async, but we don't care. save it optimistically. trust brah
        return peerId;
    }

    getPeerId() {
        let peerId = game.user.getFlag(DiceWebRTCModule.ID, 'peerId');
        if (!peerId) {
            peerId = this.generatePeerId();
        }
        return peerId;
    }

    async initializePeer() {
        if (this.peer) {
            this.peer.destroy();
        }
        this.peer = new Peer(this.peerId);

        this.peer.on('open', (id) => {
            console.log('My peer ID is: ' + id);
        });
        
        this.peer.on('error', (error) => {
            console.error('PeerJS error:', error);
        });

        this.peer.on('connection', (conn) => {
            console.log('Incoming connection from:', conn.peer);

            conn.on('open', () => {
                console.log('Connection established with:', conn.peer);

                if (!this.peerDataConnection) {
                    this.peerDataConnection = conn;
                    console.log('Active connection established with:', conn.peer);
                } else {
                    console.log('Connection attempt rejected. Already have an active connection.');
                    conn.close();
                }
                // You can add additional logic here, such as authentication

            });

            conn.on('data', (data) => {
                console.log('Received data:', data);
                // Handle incoming data here
                // For example, you might want to parse the data and take appropriate actions
                switch (data.type) {
                    case DiceWebRTCModule.MESSAGE_TYPES.ROLL_REQUEST:
                        this.handleRollRequest(data);
                        break;
                    // case DiceWebRTCModule.MESSAGE_TYPES.ACTOR_UPDATE:
                    //     this.handleActorUpdate(data);
                    //     break;
                    // case DiceWebRTCModule.MESSAGE_TYPES.ACTOR_SYNC:
                    //     this.handleSyncRequest(conn);
                    //     break;
                    // case DiceWebRTCModule.MESSAGE_TYPES.AUTH:
                    //     this.handleAuthRequest(conn, data);
                    //     break;
                    default:
                        console.warn('Unknown message type:', data.type);
                }
            });

            conn.on('close', () => {
                console.log('Connection closed:', conn.peer);
                if (this.peerDataConnection === conn) {
                    console.log('Active connection closed. Resetting peerDataConnection.');
                    this.peerDataConnection = null;
                    // You might want to add additional cleanup logic here
                    // For example, updating UI or notifying the user
                    ui.notifications.warn('Connection with remote peer has been closed.');
                } else {
                    console.log('A non-active connection was closed.');
                }
            });

            conn.on('error', (error) => {
                console.error('Connection error:', error);
                if (this.peerDataConnection === conn) {
                    console.log('Error in active connection. Resetting peerDataConnection.');
                    this.peerDataConnection = null;
                    // Additional error handling logic can be added here
                    ui.notifications.error('Error in connection with remote peer.');
                }
            });
        });
    }

    handleRollRequest(data) {
        console.log('handleRollRequest', data);
    }
}
