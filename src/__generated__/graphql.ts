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

export type Query = {
  __typename?: 'Query';
  getStations: Array<Station>;
  getTrains: Array<Train>;
};


export type QueryGetTrainsArgs = {
  stationId: Scalars['Int'];
};

export enum Route {
  Blue = 'BLUE',
  Brown = 'BROWN',
  Green = 'GREEN',
  Orange = 'ORANGE',
  Pink = 'PINK',
  Purple = 'PURPLE',
  Red = 'RED',
  Yellow = 'YELLOW'
}

export type Station = {
  __typename?: 'Station';
  id: Scalars['Int'];
  name: Scalars['String'];
};

export type Train = {
  __typename?: 'Train';
  arrivalTime?: Maybe<Scalars['String']>;
  delayed: Scalars['Boolean'];
  destination?: Maybe<Scalars['String']>;
  due: Scalars['Boolean'];
  predictionTime?: Maybe<Scalars['String']>;
  route?: Maybe<Route>;
  run: Scalars['Int'];
  scheduled: Scalars['Boolean'];
  station?: Maybe<Scalars['String']>;
};

export type GetStationsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetStationsQuery = { __typename?: 'Query', getStations: Array<{ __typename?: 'Station', id: number, name: string }> };


export const GetStationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetStations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getStations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<GetStationsQuery, GetStationsQueryVariables>;