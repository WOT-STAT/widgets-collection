import { v4 as uuidv4 } from 'uuid';

function tryParseJson(message: string): unknown {
  try {
    return JSON.parse(message)
  } catch (error) {
    return null
  }
}

type ChangeMessage = { type: 'change', uuid: string, name: string, value: unknown }

function isChangeMessage(message: unknown): message is ChangeMessage {
  if (typeof message !== 'object') return false;
  if (message === null) return false;
  if ('type' in message && message['type'] !== 'change') return false;
  return true;
}

type DisconnectMessage = { type: 'disconnect', uuid: string }
function isDisconnectMessage(message: unknown): message is DisconnectMessage {
  if (typeof message !== 'object') return false;
  if (message === null) return false;
  if ('type' in message && message['type'] !== 'disconnect') return false;
  return true;
}

type ConnectMessage = { type: 'connect', uuid: string }
function isConnectMessage(message: unknown): message is ConnectMessage {
  if (typeof message !== 'object') return false;
  if (message === null) return false;
  if ('type' in message && message['type'] !== 'connect') return false;
  return true;
}

type UUID = string
export class RelayState<T> {
  private values = new Map<UUID, T>
  private subscribers = new Set<((uuid: UUID, value: T) => void)>()

  constructor(readonly uuid: UUID, defaultValue: T, private readonly onSet: (uuid: UUID, value: T) => void) {
    this.values.set(uuid, defaultValue)
  }

  get value() {
    return this.values.get(this.uuid) as T
  }

  set value(value: T) {
    this.values.set(this.uuid, value)
    this.onSet(this.uuid, value)
  }

  get all() {
    return [...this.values.entries()]
  }

  trigger() {
    this.onSet(this.uuid, this.value)
  }

  change(uuid: UUID, value: T) {
    if (uuid === this.uuid) return
    this.values.set(uuid, value)
    this.subscribers.forEach(subscriber => subscriber(uuid, value))
  }

  subscribe(subscriber: (uuid: UUID, value: T) => void) {
    this.subscribers.add(subscriber)
    return () => this.subscribers.delete(subscriber)
  }
}

export class WidgetsRelay {

  private websocket: WebSocket | null = null;
  private reconnect: boolean
  private readonly uuid: string
  private readonly channel: string
  private readonly states = new Map<string, RelayState<any>>()
  private retryCount = 0
  private readonly intervalHandler: ReturnType<typeof setInterval>

  constructor(options: {
    uuid?: string
    reconnect?: boolean
    channel: string
  }) {
    this.reconnect = options.reconnect ?? true;
    this.uuid = options.uuid ?? uuidv4();
    this.channel = options.channel;
    this.connect();

    this.intervalHandler = setInterval(() => {
      for (const [stateKey, stateValue] of this.states) this.sendState(stateKey, stateValue)
    }, 30000);
  }

  createState<T>(name: string, defaultValue: T): RelayState<T> {
    const relayState = new RelayState<T>(this.uuid, defaultValue, (uuid, value) => this.sendState(name, relayState))

    this.states.set(name, relayState)

    return relayState
  }

  private sendState(name: string, state: RelayState<any>) {
    if (!this.websocket) return
    if (this.websocket.readyState !== WebSocket.OPEN) return
    this.websocket.send(JSON.stringify({ type: 'change', uuid: state.uuid, name, value: state.value } satisfies ChangeMessage))
  }

  private closeConnection() {
    if (this.websocket !== null) {
      this.websocket.removeEventListener('message', this.onMessage)
      this.websocket.removeEventListener('close', this.onClose)
      this.websocket.close()
    }
  }

  private connect() {
    this.retryCount++
    this.closeConnection();
    console.log('Connecting to relay server');
    this.websocket = new WebSocket(`${import.meta.env.VITE_RELAY_URL}?uuid=${this.uuid}&channel=${this.channel}`);
    this.websocket.addEventListener('message', this.onMessage)
    this.websocket.addEventListener('close', this.onClose)
    this.websocket.addEventListener('open', this.onOpen)
  }

  dispose() {
    this.closeConnection()
    clearInterval(this.intervalHandler)
  }

  private onOpen = () => {
    this.retryCount = 0
    for (const [stateKey, stateValue] of this.states) this.sendState(stateKey, stateValue)
  }

  private onClose = (event: CloseEvent) => {

    for (const [stateKey, stateValue] of this.states) {
      for (const [uuid, _] of stateValue.all) {
        stateValue.change(uuid, undefined)
      }
    }


    if (!this.reconnect) return
    let delay = 100

    if (this.retryCount > 1000) delay = 10000
    else if (this.retryCount > 50) delay = 1000
    else if (this.retryCount > 10) delay = 500
    setTimeout(() => this.connect(), this.retryCount > 10 ? 1000 : 100)
  }

  private onMessage = (event: MessageEvent) => {
    const message = tryParseJson(event.data)
    if (!message) return

    if (isChangeMessage(message)) {
      const relayState = this.states.get(message.name)
      if (relayState === undefined) return
      relayState.change(message.uuid, message.value)
    }

    if (isDisconnectMessage(message)) {
      for (const [stateKey, stateValue] of this.states) {
        stateValue.change(message.uuid, undefined)
      }
    }

    if (isConnectMessage(message)) {
      for (const [stateKey, stateValue] of this.states) this.sendState(stateKey, stateValue)
    }
  }
}