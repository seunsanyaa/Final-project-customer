/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as analytics from "../analytics.js";
import type * as bookings from "../bookings.js";
import type * as car from "../car.js";
import type * as clerk from "../clerk.js";
import type * as customers from "../customers.js";
import type * as http from "../http.js";
import type * as payment from "../payment.js";
import type * as promotions from "../promotions.js";
import type * as review from "../review.js";
import type * as staff from "../staff.js";
import type * as users from "../users.js";
import type * as util from "../util.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  analytics: typeof analytics;
  bookings: typeof bookings;
  car: typeof car;
  clerk: typeof clerk;
  customers: typeof customers;
  http: typeof http;
  payment: typeof payment;
  promotions: typeof promotions;
  review: typeof review;
  staff: typeof staff;
  users: typeof users;
  util: typeof util;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
