export namespace WS {

    export type Events = 'error' | 'message' | 'close' | 'open';

    export interface Data<T = any> {
        timeStamp:number;
        data:T;
    };


    export type DataEventHandler<T = any> = (ev:CustomEvent<Data<T>>)=>void;
    export type CloseEventHandler = (arg:CloseEvent)=>void;
    export type EventHandler = (arg:Event) => void;

    export class ReconnectingWebsocket<T = any> extends EventTarget{

        private socket: WebSocket;

        private reconnectTimeout: any;

        constructor(
            private url?: string,
            private reconnectInterval: number = 1500
        ) {
            super();
            this.open();
            window.addEventListener('offline',() => this.close());
            window.addEventListener('online',() => this.open());
        }
        off(event: "message", handler: DataEventHandler<T>): this;
        off(event: "close", handler: CloseEventHandler): this;
        off(event: "error" | "open" | "reconnecting", handler: EventHandler): this;
        off(event: Events & 'reconnecting', handler: CloseEventHandler | EventHandler | DataEventHandler<T>): this {
            this.removeEventListener(event,handler);
            return this;
        }
        
        on(event: "message", handler: DataEventHandler<T>): this;
        on(event: "close", handler: CloseEventHandler): this;
        on(event: "error" | "open" | "reconnecting", handler: EventHandler): this;
        on(event: Events & 'reconnecting', handler: CloseEventHandler | EventHandler | DataEventHandler<T>): this {
            this.addEventListener(event,handler);
            return this;
        }

        open() : this {
            this.socket = new WebSocket(this.url);
            this.socket.onopen = this.onOpen.bind(this);
            this.socket.onclose = this.onOpen.bind(this);
            this.socket.onerror = this.onError.bind(this);
            this.socket.onmessage = this.onMessage.bind(this);
            return this;
        }

        close(): this {
            if(this.socket)
                this.socket.close();
            return this;
        }

        send(data: T) : this {
            if(data instanceof ArrayBuffer || data instanceof Blob)
                this.socket.send(data);
            else
                this.socket.send(JSON.stringify(data));
            return this;
        }

        reconnect() : this {
            if(this.socket) {
                this.socket.close();
            }
            clearInterval(this.reconnectTimeout);
            this.reconnectTimeout = setInterval(() => {
                this.open();
                this.dispatchEvent(new CustomEvent('reconnecting'))
            },this.reconnectInterval)
            return this;
        }
        
        protected onOpen(ev: Event) {
            clearInterval(this.reconnectTimeout);
            this.dispatchEvent(new CustomEvent('open'));
        }

        protected onClose(ev: CloseEvent) {
            this.reconnect();
            this.dispatchEvent(new CustomEvent('close'));
        }

        protected onError(ev: Event) {
            this.reconnect();
            this.dispatchEvent(new CustomEvent('error'));
        }

        protected onMessage(ev: MessageEvent<T>) {
            this.dispatchEvent(new CustomEvent<Data<T>>('message',{
                detail:{
                    data:ev.data,
                    timeStamp:ev.timeStamp
                }
            }));
        }
    }

    export class JSONWebsocketClient<T = any> extends ReconnectingWebsocket<T> {

        protected onMessage(ev: MessageEvent<T>): void {
            try {
                this.dispatchEvent(new CustomEvent<Data<T>>('message',{
                    detail:{
                        data:JSON.parse(ev.data as any),
                        timeStamp:ev.timeStamp
                    }
                }));
            } catch(e) {
                console.error(e);
            }
        }
    }
}