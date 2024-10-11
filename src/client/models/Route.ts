/* tslint:disable */
/* eslint-disable */
/**
 * OpenAPI definition
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: v0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { mapValues } from '../runtime.ts';
/**
 * Represents a bus route and its details.
 * @export
 * @interface Route
 */
export interface Route {
    /**
     * The unique identifier of the route.
     * @type {string}
     * @memberof Route
     */
    id: string;
    /**
     * The name of the route.
     * @type {string}
     * @memberof Route
     */
    name: string;
}

/**
 * Check if a given object implements the Route interface.
 */
export function instanceOfRoute(value: object): value is Route {
    if (!('id' in value) || value['id'] === undefined) return false;
    if (!('name' in value) || value['name'] === undefined) return false;
    return true;
}

export function RouteFromJSON(json: any): Route {
    return RouteFromJSONTyped(json, false);
}

export function RouteFromJSONTyped(json: any, ignoreDiscriminator: boolean): Route {
    if (json == null) {
        return json;
    }
    return {
        
        'id': json['id'],
        'name': json['name'],
    };
}

  export function RouteToJSON(json: any): Route {
      return RouteToJSONTyped(json, false);
  }

  export function RouteToJSONTyped(value?: Route | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'id': value['id'],
        'name': value['name'],
    };
}

