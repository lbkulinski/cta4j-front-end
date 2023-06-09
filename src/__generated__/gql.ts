/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\nquery GetBuses($routeId: ID!, $stopId: ID!) {\n    getBuses(routeId: $routeId, stopId: $stopId) {\n        id\n        type\n        stop\n        route\n        destination\n        predictionTime\n        arrivalTime\n        delayed\n    }\n}\n": types.GetBusesDocument,
    "\nquery GetRouteDirections($id: ID!) {\n    getRouteDirections(id: $id) {\n        name\n    }\n}\n": types.GetRouteDirectionsDocument,
    "\nquery GetRouteStops($id: ID!, $direction: String!) {\n    getRouteStops(id: $id, direction: $direction) {\n        id\n        name\n        latitude\n        longitude\n    }\n}\n": types.GetRouteStopsDocument,
    "\nquery GetTrains($stationId: ID!) {\n    getTrains(stationId: $stationId) {\n        line\n        destination\n        run\n        predictionTime\n        arrivalTime\n        due\n        scheduled\n        delayed\n    }\n}\n": types.GetTrainsDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nquery GetBuses($routeId: ID!, $stopId: ID!) {\n    getBuses(routeId: $routeId, stopId: $stopId) {\n        id\n        type\n        stop\n        route\n        destination\n        predictionTime\n        arrivalTime\n        delayed\n    }\n}\n"): (typeof documents)["\nquery GetBuses($routeId: ID!, $stopId: ID!) {\n    getBuses(routeId: $routeId, stopId: $stopId) {\n        id\n        type\n        stop\n        route\n        destination\n        predictionTime\n        arrivalTime\n        delayed\n    }\n}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nquery GetRouteDirections($id: ID!) {\n    getRouteDirections(id: $id) {\n        name\n    }\n}\n"): (typeof documents)["\nquery GetRouteDirections($id: ID!) {\n    getRouteDirections(id: $id) {\n        name\n    }\n}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nquery GetRouteStops($id: ID!, $direction: String!) {\n    getRouteStops(id: $id, direction: $direction) {\n        id\n        name\n        latitude\n        longitude\n    }\n}\n"): (typeof documents)["\nquery GetRouteStops($id: ID!, $direction: String!) {\n    getRouteStops(id: $id, direction: $direction) {\n        id\n        name\n        latitude\n        longitude\n    }\n}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nquery GetTrains($stationId: ID!) {\n    getTrains(stationId: $stationId) {\n        line\n        destination\n        run\n        predictionTime\n        arrivalTime\n        due\n        scheduled\n        delayed\n    }\n}\n"): (typeof documents)["\nquery GetTrains($stationId: ID!) {\n    getTrains(stationId: $stationId) {\n        line\n        destination\n        run\n        predictionTime\n        arrivalTime\n        due\n        scheduled\n        delayed\n    }\n}\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;