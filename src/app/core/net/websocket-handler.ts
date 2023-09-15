import { environment } from '../../../environments/environment';
import { TokenService } from '../services/token.service';

class WebsocketHandler {
  private socket: WebSocket | null = null;
  private readonly url: string;
  private onOpen: () => void;
  private onClose: () => void;
  private onMessage: (event: MessageEvent) => void;
  private onError: (event: Event) => void;

  constructor(
    private tokenService: TokenService,
    host: string,
    uri: string,
    onOpen: () => void,
    onClose: () => void,
    onMessage: (event: MessageEvent) => void,
    onError: (event: Event) => void,
    secure = false
  ) {
    let url = uri;
    if (!uri.startsWith('wss://') && !uri.startsWith('ws://')) {
      const { baseUrl } = environment.api;
      url = baseUrl + (baseUrl.endsWith('/') && url.startsWith('/') ? url.substring(1) : url);
      url = secure ? `wss://${host}${url}` : `ws://${host}${url}`;
    }
    this.url = url;
    this.onOpen = onOpen;
    this.onClose = onClose;
    this.onMessage = onMessage;
    this.onError = onError;
  }

  public connect() {
    const token = this.tokenService.token.enable ? this.tokenService.token.token || '' : '';
    this.socket = new WebSocket(this.url, [token]);
    this.socket.onopen = this.onOpen;
    this.socket.onclose = this.onClose;
    this.socket.onmessage = this.onMessage;
    this.socket.onerror = this.onError;
  }

  public disconnect() {
    if (this.socket) {
      this.socket.close();
    }
  }

  public send(message: string) {
    if (this.socket) {
      this.socket.send(JSON.stringify({ message }));
    }
  }
}

export { WebsocketHandler };
