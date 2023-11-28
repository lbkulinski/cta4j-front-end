/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Bus = {
  __typename?: 'Bus';
  arrivalTime: Scalars['String']['output'];
  delayed: Scalars['Boolean']['output'];
  destination: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  predictionTime: Scalars['String']['output'];
  route: Scalars['String']['output'];
  stop: Scalars['String']['output'];
  type: Type;
};

export type Direction = {
  __typename?: 'Direction';
  name: Scalars['String']['output'];
};

export enum Line {
  Blue = 'BLUE',
  Brown = 'BROWN',
  Green = 'GREEN',
  Orange = 'ORANGE',
  Pink = 'PINK',
  Purple = 'PURPLE',
  Red = 'RED',
  Yellow = 'YELLOW'
}

export type Query = {
  __typename?: 'Query';
  followBus: Array<Bus>;
  followTrain: Array<Train>;
  getBuses: Array<Bus>;
  getRouteDirections: Array<Direction>;
  getRouteStops: Array<Stop>;
  getRoutes: Array<Route>;
  getStations: Array<Station>;
  getTrains: Array<Train>;
};


export type QueryFollowBusArgs = {
  id: Scalars['ID']['input'];
};


export type QueryFollowTrainArgs = {
  run: Scalars['Int']['input'];
};


export type QueryGetBusesArgs = {
  routeId: Scalars['ID']['input'];
  stopId: Scalars['ID']['input'];
};


export type QueryGetRouteDirectionsArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetRouteStopsArgs = {
  direction: Scalars['String']['input'];
  id: Scalars['ID']['input'];
};


export type QueryGetTrainsArgs = {
  stationId: Scalars['ID']['input'];
};

export type Route = {
  __typename?: 'Route';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type Station = {
  __typename?: 'Station';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type Stop = {
  __typename?: 'Stop';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type Train = {
  __typename?: 'Train';
  arrivalTime: Scalars['String']['output'];
  delayed: Scalars['Boolean']['output'];
  destination: Scalars['String']['output'];
  due: Scalars['Boolean']['output'];
  line: Line;
  predictionTime: Scalars['String']['output'];
  run: Scalars['Int']['output'];
  scheduled: Scalars['Boolean']['output'];
  station: Scalars['String']['output'];
};

export enum Type {
  Arrival = 'ARRIVAL',
  Departure = 'DEPARTURE'
}

export type GetBusesQueryVariables = Exact<{
  routeId: Scalars['ID']['input'];
  stopId: Scalars['ID']['input'];
}>;


export type GetBusesQuery = { __typename?: 'Query', getBuses: Array<{ __typename?: 'Bus', id: string, type: Type, stop: string, route: string, destination: string, predictionTime: string, arrivalTime: string, delayed: boolean }> };

export type GetRouteDirectionsQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetRouteDirectionsQuery = { __typename?: 'Query', getRouteDirections: Array<{ __typename?: 'Direction', name: string }> };

export type GetRoutesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetRoutesQuery = { __typename?: 'Query', getRoutes: Array<{ __typename?: 'Route', id: string, name: string }> };

export type GetRouteStopsQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  direction: Scalars['String']['input'];
}>;


export type GetRouteStopsQuery = { __typename?: 'Query', getRouteStops: Array<{ __typename?: 'Stop', id: string, name: string }> };

export type FollowBusQueryVariables = Exact<{ [key: string]: never; }>;


export type FollowBusQuery = { __typename?: 'Query', followBus: Array<{ __typename?: 'Bus', id: string, type: Type, stop: string, route: string, destination: string, predictionTime: string, arrivalTime: string, delayed: boolean }> };

export type FollowTrainQueryVariables = Exact<{ [key: string]: never; }>;


export type FollowTrainQuery = { __typename?: 'Query', followTrain: Array<{ __typename?: 'Train', run: number, line: Line, destination: string, station: string, predictionTime: string, arrivalTime: string, due: boolean, scheduled: boolean, delayed: boolean }> };

export type GetStationsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetStationsQuery = { __typename?: 'Query', getStations: Array<{ __typename?: 'Station', id: string, name: string }> };

export type GetTrainsQueryVariables = Exact<{
  stationId: Scalars['ID']['input'];
}>;


export type GetTrainsQuery = { __typename?: 'Query', getTrains: Array<{ __typename?: 'Train', line: Line, destination: string, run: number, predictionTime: string, arrivalTime: string, due: boolean, scheduled: boolean, delayed: boolean }> };


export const GetBusesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetBuses"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"routeId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"stopId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getBuses"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"routeId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"routeId"}}},{"kind":"Argument","name":{"kind":"Name","value":"stopId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stopId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"stop"}},{"kind":"Field","name":{"kind":"Name","value":"route"}},{"kind":"Field","name":{"kind":"Name","value":"destination"}},{"kind":"Field","name":{"kind":"Name","value":"predictionTime"}},{"kind":"Field","name":{"kind":"Name","value":"arrivalTime"}},{"kind":"Field","name":{"kind":"Name","value":"delayed"}}]}}]}}]} as unknown as DocumentNode<GetBusesQuery, GetBusesQueryVariables>;
export const GetRouteDirectionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetRouteDirections"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getRouteDirections"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<GetRouteDirectionsQuery, GetRouteDirectionsQueryVariables>;
export const GetRoutesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetRoutes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getRoutes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<GetRoutesQuery, GetRoutesQueryVariables>;
export const GetRouteStopsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetRouteStops"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"direction"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getRouteStops"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"direction"},"value":{"kind":"Variable","name":{"kind":"Name","value":"direction"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<GetRouteStopsQuery, GetRouteStopsQueryVariables>;
export const FollowBusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FollowBus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"followBus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"StringValue","value":"4374","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"stop"}},{"kind":"Field","name":{"kind":"Name","value":"route"}},{"kind":"Field","name":{"kind":"Name","value":"destination"}},{"kind":"Field","name":{"kind":"Name","value":"predictionTime"}},{"kind":"Field","name":{"kind":"Name","value":"arrivalTime"}},{"kind":"Field","name":{"kind":"Name","value":"delayed"}}]}}]}}]} as unknown as DocumentNode<FollowBusQuery, FollowBusQueryVariables>;
export const FollowTrainDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FollowTrain"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"followTrain"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"run"},"value":{"kind":"IntValue","value":"1225"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"run"}},{"kind":"Field","name":{"kind":"Name","value":"line"}},{"kind":"Field","name":{"kind":"Name","value":"destination"}},{"kind":"Field","name":{"kind":"Name","value":"station"}},{"kind":"Field","name":{"kind":"Name","value":"predictionTime"}},{"kind":"Field","name":{"kind":"Name","value":"arrivalTime"}},{"kind":"Field","name":{"kind":"Name","value":"due"}},{"kind":"Field","name":{"kind":"Name","value":"scheduled"}},{"kind":"Field","name":{"kind":"Name","value":"delayed"}}]}}]}}]} as unknown as DocumentNode<FollowTrainQuery, FollowTrainQueryVariables>;
export const GetStationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetStations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getStations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<GetStationsQuery, GetStationsQueryVariables>;
export const GetTrainsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTrains"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"stationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getTrains"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"stationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stationId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"line"}},{"kind":"Field","name":{"kind":"Name","value":"destination"}},{"kind":"Field","name":{"kind":"Name","value":"run"}},{"kind":"Field","name":{"kind":"Name","value":"predictionTime"}},{"kind":"Field","name":{"kind":"Name","value":"arrivalTime"}},{"kind":"Field","name":{"kind":"Name","value":"due"}},{"kind":"Field","name":{"kind":"Name","value":"scheduled"}},{"kind":"Field","name":{"kind":"Name","value":"delayed"}}]}}]}}]} as unknown as DocumentNode<GetTrainsQuery, GetTrainsQueryVariables>;