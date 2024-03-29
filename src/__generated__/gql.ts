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
    "\nsubscription BusesSubscribe($routeId: ID!, $stopId: ID!) {\n    busesSubscribe(routeId: $routeId, stopId: $stopId) {\n        id\n        type\n        stop\n        route\n        destination\n        predictionTime\n        arrivalTime\n        delayed\n    }\n}\n": types.BusesSubscribeDocument,
    "\nquery RouteDirections($id: ID!) {\n    routeDirections(id: $id) {\n        name\n    }\n}\n": types.RouteDirectionsDocument,
    "\nquery Routes {\n    routes {\n        id\n        name\n    }\n}\n": types.RoutesDocument,
    "\nquery RouteStops($id: ID!, $direction: String!) {\n    routeStops(id: $id, direction: $direction) {\n        id\n        name\n    }\n}\n": types.RouteStopsDocument,
    "\nquery Bus {\n    bus(id: \"4374\") {\n        id\n        type\n        stop\n        route\n        destination\n        predictionTime\n        arrivalTime\n        delayed\n    }\n}\n": types.BusDocument,
    "\nquery Train {\n    train(run: 1225) {\n        run\n        line\n        destination\n        station\n        predictionTime\n        arrivalTime\n        due\n        scheduled\n        delayed\n    }\n}\n": types.TrainDocument,
    "\nquery Stations {\n    stations {\n        id\n        name\n    }\n}\n": types.StationsDocument,
    "\nsubscription TrainsSubscribe($stationId: ID!) {\n    trainsSubscribe(stationId: $stationId) {\n        line\n        destination\n        run\n        predictionTime\n        arrivalTime\n        due\n        scheduled\n        delayed\n    }\n}\n": types.TrainsSubscribeDocument,
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
export function gql(source: "\nsubscription BusesSubscribe($routeId: ID!, $stopId: ID!) {\n    busesSubscribe(routeId: $routeId, stopId: $stopId) {\n        id\n        type\n        stop\n        route\n        destination\n        predictionTime\n        arrivalTime\n        delayed\n    }\n}\n"): (typeof documents)["\nsubscription BusesSubscribe($routeId: ID!, $stopId: ID!) {\n    busesSubscribe(routeId: $routeId, stopId: $stopId) {\n        id\n        type\n        stop\n        route\n        destination\n        predictionTime\n        arrivalTime\n        delayed\n    }\n}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nquery RouteDirections($id: ID!) {\n    routeDirections(id: $id) {\n        name\n    }\n}\n"): (typeof documents)["\nquery RouteDirections($id: ID!) {\n    routeDirections(id: $id) {\n        name\n    }\n}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nquery Routes {\n    routes {\n        id\n        name\n    }\n}\n"): (typeof documents)["\nquery Routes {\n    routes {\n        id\n        name\n    }\n}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nquery RouteStops($id: ID!, $direction: String!) {\n    routeStops(id: $id, direction: $direction) {\n        id\n        name\n    }\n}\n"): (typeof documents)["\nquery RouteStops($id: ID!, $direction: String!) {\n    routeStops(id: $id, direction: $direction) {\n        id\n        name\n    }\n}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nquery Bus {\n    bus(id: \"4374\") {\n        id\n        type\n        stop\n        route\n        destination\n        predictionTime\n        arrivalTime\n        delayed\n    }\n}\n"): (typeof documents)["\nquery Bus {\n    bus(id: \"4374\") {\n        id\n        type\n        stop\n        route\n        destination\n        predictionTime\n        arrivalTime\n        delayed\n    }\n}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nquery Train {\n    train(run: 1225) {\n        run\n        line\n        destination\n        station\n        predictionTime\n        arrivalTime\n        due\n        scheduled\n        delayed\n    }\n}\n"): (typeof documents)["\nquery Train {\n    train(run: 1225) {\n        run\n        line\n        destination\n        station\n        predictionTime\n        arrivalTime\n        due\n        scheduled\n        delayed\n    }\n}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nquery Stations {\n    stations {\n        id\n        name\n    }\n}\n"): (typeof documents)["\nquery Stations {\n    stations {\n        id\n        name\n    }\n}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nsubscription TrainsSubscribe($stationId: ID!) {\n    trainsSubscribe(stationId: $stationId) {\n        line\n        destination\n        run\n        predictionTime\n        arrivalTime\n        due\n        scheduled\n        delayed\n    }\n}\n"): (typeof documents)["\nsubscription TrainsSubscribe($stationId: ID!) {\n    trainsSubscribe(stationId: $stationId) {\n        line\n        destination\n        run\n        predictionTime\n        arrivalTime\n        due\n        scheduled\n        delayed\n    }\n}\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;