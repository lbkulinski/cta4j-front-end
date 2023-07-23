/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Bus = {
  __typename?: 'Bus';
  arrivalTime: Scalars['String'];
  delayed: Scalars['Boolean'];
  destination: Scalars['String'];
  id: Scalars['ID'];
  predictionTime: Scalars['String'];
  route: Scalars['String'];
  stop: Scalars['String'];
  type: Type;
};

export type Direction = {
  __typename?: 'Direction';
  name: Scalars['String'];
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
  getBuses: Array<Bus>;
  getRouteDirections: Array<Direction>;
  getRouteStops: Array<Stop>;
  getRoutes: Array<Route>;
  getStations: Array<Station>;
  getTrains: Array<Train>;
};


export type QueryGetBusesArgs = {
  routeId: Scalars['ID'];
  stopId: Scalars['ID'];
};


export type QueryGetRouteDirectionsArgs = {
  id: Scalars['ID'];
};


export type QueryGetRouteStopsArgs = {
  direction: Scalars['String'];
  id: Scalars['ID'];
};


export type QueryGetTrainsArgs = {
  stationId: Scalars['ID'];
};

export type Route = {
  __typename?: 'Route';
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type Station = {
  __typename?: 'Station';
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type Stop = {
  __typename?: 'Stop';
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type Train = {
  __typename?: 'Train';
  arrivalTime: Scalars['String'];
  delayed: Scalars['Boolean'];
  destination: Scalars['String'];
  due: Scalars['Boolean'];
  line: Line;
  predictionTime: Scalars['String'];
  run: Scalars['Int'];
  scheduled: Scalars['Boolean'];
  station: Scalars['String'];
};

export enum Type {
  Arrival = 'ARRIVAL',
  Departure = 'DEPARTURE'
}

export type GetBusesQueryVariables = Exact<{
  routeId: Scalars['ID'];
  stopId: Scalars['ID'];
}>;


export type GetBusesQuery = { __typename?: 'Query', getBuses: Array<{ __typename?: 'Bus', id: string, type: Type, stop: string, route: string, destination: string, predictionTime: string, arrivalTime: string, delayed: boolean }> };

export type GetRouteDirectionsQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetRouteDirectionsQuery = { __typename?: 'Query', getRouteDirections: Array<{ __typename?: 'Direction', name: string }> };

export type GetRouteStopsQueryVariables = Exact<{
  id: Scalars['ID'];
  direction: Scalars['String'];
}>;


export type GetRouteStopsQuery = { __typename?: 'Query', getRouteStops: Array<{ __typename?: 'Stop', id: string, name: string }> };

export type GetTrainsQueryVariables = Exact<{
  stationId: Scalars['ID'];
}>;


export type GetTrainsQuery = { __typename?: 'Query', getTrains: Array<{ __typename?: 'Train', line: Line, destination: string, run: number, predictionTime: string, arrivalTime: string, due: boolean, scheduled: boolean, delayed: boolean }> };


export const GetBusesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetBuses"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"routeId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"stopId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getBuses"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"routeId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"routeId"}}},{"kind":"Argument","name":{"kind":"Name","value":"stopId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stopId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"stop"}},{"kind":"Field","name":{"kind":"Name","value":"route"}},{"kind":"Field","name":{"kind":"Name","value":"destination"}},{"kind":"Field","name":{"kind":"Name","value":"predictionTime"}},{"kind":"Field","name":{"kind":"Name","value":"arrivalTime"}},{"kind":"Field","name":{"kind":"Name","value":"delayed"}}]}}]}}]} as unknown as DocumentNode<GetBusesQuery, GetBusesQueryVariables>;
export const GetRouteDirectionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetRouteDirections"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getRouteDirections"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<GetRouteDirectionsQuery, GetRouteDirectionsQueryVariables>;
export const GetRouteStopsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetRouteStops"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"direction"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getRouteStops"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"direction"},"value":{"kind":"Variable","name":{"kind":"Name","value":"direction"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<GetRouteStopsQuery, GetRouteStopsQueryVariables>;
export const GetTrainsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTrains"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"stationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getTrains"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"stationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stationId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"line"}},{"kind":"Field","name":{"kind":"Name","value":"destination"}},{"kind":"Field","name":{"kind":"Name","value":"run"}},{"kind":"Field","name":{"kind":"Name","value":"predictionTime"}},{"kind":"Field","name":{"kind":"Name","value":"arrivalTime"}},{"kind":"Field","name":{"kind":"Name","value":"due"}},{"kind":"Field","name":{"kind":"Name","value":"scheduled"}},{"kind":"Field","name":{"kind":"Name","value":"delayed"}}]}}]}}]} as unknown as DocumentNode<GetTrainsQuery, GetTrainsQueryVariables>;