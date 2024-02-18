import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "ws";

@WebSocketGateway()
export class EventsGateway {
  @WebSocketServer()
  server: Server;
}
