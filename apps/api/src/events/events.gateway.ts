import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "ws";

@WebSocketGateway({
  path: "/ws",
})
export class EventsGateway {
  @WebSocketServer()
  server: Server;
}
