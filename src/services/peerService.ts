import Peer from "peerjs";
import type { DataConnection } from "peerjs";
import type { PeerMessage } from "../types";

export class PeerService {
  private peer: Peer | null = null;
  private connections: Map<string, DataConnection> = new Map();
  private messageHandlers: Array<
    (peerId: string, message: PeerMessage) => void
  > = [];

  /**
   * Initialize peer as host
   */
  async initializeHost(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.peer = new Peer();

      this.peer.on("open", (id) => {
        console.log("Host peer initialized:", id);
        resolve(id);
      });

      this.peer.on("error", (error) => {
        console.error("Peer error:", error);
        reject(error);
      });

      this.peer.on("connection", (conn) => {
        this.handleConnection(conn);
      });
    });
  }

  /**
   * Connect to host as participant
   */
  async connectToHost(hostPeerId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Connection timeout"));
      }, 30000); // 30 second timeout

      if (!this.peer) {
        this.peer = new Peer();

        this.peer.on("open", (myPeerId) => {
          console.log("Participant peer initialized:", myPeerId);
          this.attemptConnection(hostPeerId, resolve, reject, timeout);
        });

        this.peer.on("error", (error) => {
          clearTimeout(timeout);
          console.error("Peer initialization error:", error);
          reject(error);
        });
      } else {
        this.attemptConnection(hostPeerId, resolve, reject, timeout);
      }
    });
  }

  private attemptConnection(
    hostPeerId: string,
    resolve: () => void,
    reject: (error: Error) => void,
    timeout: ReturnType<typeof setTimeout>,
  ) {
    console.log("Attempting to connect to host:", hostPeerId);
    const conn = this.peer!.connect(hostPeerId, {
      reliable: true,
    });

    this.handleConnection(conn);

    conn.on("open", () => {
      clearTimeout(timeout);
      console.log("Connected to host successfully");
      resolve();
    });

    conn.on("error", (error) => {
      clearTimeout(timeout);
      console.error("Connection error:", error);
      reject(
        new Error(
          "Could not connect to host. Make sure the host has started the event and you are on the same network.",
        ),
      );
    });
  }

  /**
   * Handle incoming connection
   */
  private handleConnection(conn: DataConnection) {
    console.log("New connection:", conn.peer);
    this.connections.set(conn.peer, conn);

    conn.on("data", (data) => {
      try {
        const message = data as PeerMessage;
        console.log("Received message:", message);
        this.messageHandlers.forEach((handler) => handler(conn.peer, message));
      } catch (error) {
        console.error("Error handling message:", error);
      }
    });

    conn.on("close", () => {
      console.log("Connection closed:", conn.peer);
      this.connections.delete(conn.peer);
    });

    conn.on("error", (error) => {
      console.error("Connection error:", error);
      this.connections.delete(conn.peer);
    });
  }

  /**
   * Send message to specific peer
   */
  send(peerId: string, message: PeerMessage) {
    const conn = this.connections.get(peerId);
    if (conn && conn.open) {
      conn.send(message);
    } else {
      console.error("No open connection to peer:", peerId);
    }
  }

  /**
   * Broadcast message to all connected peers
   */
  broadcast(message: PeerMessage) {
    this.connections.forEach((conn) => {
      if (conn.open) {
        conn.send(message);
      }
    });
  }

  /**
   * Register message handler
   */
  onMessage(handler: (peerId: string, message: PeerMessage) => void) {
    this.messageHandlers.push(handler);
  }

  /**
   * Get peer ID
   */
  getPeerId(): string | null {
    return this.peer?.id || null;
  }

  /**
   * Get all connected peer IDs
   */
  getConnectedPeers(): string[] {
    return Array.from(this.connections.keys());
  }

  /**
   * Disconnect and cleanup
   */
  disconnect() {
    this.connections.forEach((conn) => conn.close());
    this.connections.clear();
    this.peer?.destroy();
    this.peer = null;
    this.messageHandlers = [];
  }
}

export const peerService = new PeerService();
