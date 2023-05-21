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
  getStations: Array<Station>;
  getTrains: Array<Train>;
};


export type QueryGetTrainsArgs = {
  stationId: Scalars['ID'];
};

export type Station = {
  __typename?: 'Station';
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

export type GetStationsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetStationsQuery = { __typename?: 'Query', getStations: Array<{ __typename?: 'Station', id: string, name: string }> };

export type GetTrainsQueryVariables = Exact<{
  stationId: Scalars['ID'];
}>;


export type GetTrainsQuery = { __typename?: 'Query', getTrains: Array<{ __typename?: 'Train', line: Line, destination: string, run: number, predictionTime: string, arrivalTime: string, due: boolean, scheduled: boolean, delayed: boolean }> };


export const GetStationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetStations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getStations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<GetStationsQuery, GetStationsQueryVariables>;
export const GetTrainsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTrains"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"stationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getTrains"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"stationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stationId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"line"}},{"kind":"Field","name":{"kind":"Name","value":"destination"}},{"kind":"Field","name":{"kind":"Name","value":"run"}},{"kind":"Field","name":{"kind":"Name","value":"predictionTime"}},{"kind":"Field","name":{"kind":"Name","value":"arrivalTime"}},{"kind":"Field","name":{"kind":"Name","value":"due"}},{"kind":"Field","name":{"kind":"Name","value":"scheduled"}},{"kind":"Field","name":{"kind":"Name","value":"delayed"}}]}}]}}]} as unknown as DocumentNode<GetTrainsQuery, GetTrainsQueryVariables>;