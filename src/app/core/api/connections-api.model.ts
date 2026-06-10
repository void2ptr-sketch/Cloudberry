import type { CloudConnection, CloudConnectionInput } from '../domain';

/** Request body: `POST /connections`, `PUT /connections/:id` */
export type ConnectionRequest = CloudConnectionInput;

/** Response body: `GET /connections` */
export type ConnectionsListResponse = CloudConnection[];

/** Response body: `POST /connections`, `PUT /connections/:id` */
export type ConnectionResponse = CloudConnection;

/** Response body: `DELETE /connections/:id` (204 No Content) */
export type DeleteConnectionResponse = void;
