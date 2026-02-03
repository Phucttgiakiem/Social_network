import { io } from "socket.io-client";

class SocketIOService {
    socket = null;

    connect() {
        if (!this.socket) {
            this.socket = io("http://localhost:8096", {
                transports: ["websocket"],
                withCredentials: true,
            });
            console.log("socket created");
        }
    }

    on(event, callback) {
        if (!this.socket) {
            this.connect();
        }
        this.socket.on(event, callback);
    }

    off(event, callback) {
        if (this.socket) {
            this.socket.off(event, callback);
        }
    }

    emit(event, data) {
        if (this.socket) {
            this.socket.emit(event, data);
        }
    }
}

export default new SocketIOService();
