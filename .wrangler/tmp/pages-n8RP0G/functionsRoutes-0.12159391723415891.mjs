import { onRequestGet as __api_master_accounts_ts_onRequestGet } from "/home/ian/Projects/tv-max/functions/api/master/accounts.ts"
import { onRequestOptions as __api_master_accounts_ts_onRequestOptions } from "/home/ian/Projects/tv-max/functions/api/master/accounts.ts"
import { onRequestOptions as __api_master_delete_ts_onRequestOptions } from "/home/ian/Projects/tv-max/functions/api/master/delete.ts"
import { onRequestPost as __api_master_delete_ts_onRequestPost } from "/home/ian/Projects/tv-max/functions/api/master/delete.ts"
import { onRequestOptions as __api_master_freeze_ts_onRequestOptions } from "/home/ian/Projects/tv-max/functions/api/master/freeze.ts"
import { onRequestPost as __api_master_freeze_ts_onRequestPost } from "/home/ian/Projects/tv-max/functions/api/master/freeze.ts"
import { onRequestOptions as __api_master_generate_ts_onRequestOptions } from "/home/ian/Projects/tv-max/functions/api/master/generate.ts"
import { onRequestPost as __api_master_generate_ts_onRequestPost } from "/home/ian/Projects/tv-max/functions/api/master/generate.ts"
import { onRequestOptions as __api_master_login_ts_onRequestOptions } from "/home/ian/Projects/tv-max/functions/api/master/login.ts"
import { onRequestPost as __api_master_login_ts_onRequestPost } from "/home/ian/Projects/tv-max/functions/api/master/login.ts"
import { onRequestOptions as __api_master_renew_ts_onRequestOptions } from "/home/ian/Projects/tv-max/functions/api/master/renew.ts"
import { onRequestPost as __api_master_renew_ts_onRequestPost } from "/home/ian/Projects/tv-max/functions/api/master/renew.ts"
import { onRequestOptions as __api_master_unbind_ts_onRequestOptions } from "/home/ian/Projects/tv-max/functions/api/master/unbind.ts"
import { onRequestPost as __api_master_unbind_ts_onRequestPost } from "/home/ian/Projects/tv-max/functions/api/master/unbind.ts"
import { onRequestOptions as __api_operator_login_ts_onRequestOptions } from "/home/ian/Projects/tv-max/functions/api/operator/login.ts"
import { onRequestPost as __api_operator_login_ts_onRequestPost } from "/home/ian/Projects/tv-max/functions/api/operator/login.ts"
import { onRequestGet as __api_operator_status_ts_onRequestGet } from "/home/ian/Projects/tv-max/functions/api/operator/status.ts"
import { onRequestOptions as __api_operator_status_ts_onRequestOptions } from "/home/ian/Projects/tv-max/functions/api/operator/status.ts"

export const routes = [
    {
      routePath: "/api/master/accounts",
      mountPath: "/api/master",
      method: "GET",
      middlewares: [],
      modules: [__api_master_accounts_ts_onRequestGet],
    },
  {
      routePath: "/api/master/accounts",
      mountPath: "/api/master",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_master_accounts_ts_onRequestOptions],
    },
  {
      routePath: "/api/master/delete",
      mountPath: "/api/master",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_master_delete_ts_onRequestOptions],
    },
  {
      routePath: "/api/master/delete",
      mountPath: "/api/master",
      method: "POST",
      middlewares: [],
      modules: [__api_master_delete_ts_onRequestPost],
    },
  {
      routePath: "/api/master/freeze",
      mountPath: "/api/master",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_master_freeze_ts_onRequestOptions],
    },
  {
      routePath: "/api/master/freeze",
      mountPath: "/api/master",
      method: "POST",
      middlewares: [],
      modules: [__api_master_freeze_ts_onRequestPost],
    },
  {
      routePath: "/api/master/generate",
      mountPath: "/api/master",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_master_generate_ts_onRequestOptions],
    },
  {
      routePath: "/api/master/generate",
      mountPath: "/api/master",
      method: "POST",
      middlewares: [],
      modules: [__api_master_generate_ts_onRequestPost],
    },
  {
      routePath: "/api/master/login",
      mountPath: "/api/master",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_master_login_ts_onRequestOptions],
    },
  {
      routePath: "/api/master/login",
      mountPath: "/api/master",
      method: "POST",
      middlewares: [],
      modules: [__api_master_login_ts_onRequestPost],
    },
  {
      routePath: "/api/master/renew",
      mountPath: "/api/master",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_master_renew_ts_onRequestOptions],
    },
  {
      routePath: "/api/master/renew",
      mountPath: "/api/master",
      method: "POST",
      middlewares: [],
      modules: [__api_master_renew_ts_onRequestPost],
    },
  {
      routePath: "/api/master/unbind",
      mountPath: "/api/master",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_master_unbind_ts_onRequestOptions],
    },
  {
      routePath: "/api/master/unbind",
      mountPath: "/api/master",
      method: "POST",
      middlewares: [],
      modules: [__api_master_unbind_ts_onRequestPost],
    },
  {
      routePath: "/api/operator/login",
      mountPath: "/api/operator",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_operator_login_ts_onRequestOptions],
    },
  {
      routePath: "/api/operator/login",
      mountPath: "/api/operator",
      method: "POST",
      middlewares: [],
      modules: [__api_operator_login_ts_onRequestPost],
    },
  {
      routePath: "/api/operator/status",
      mountPath: "/api/operator",
      method: "GET",
      middlewares: [],
      modules: [__api_operator_status_ts_onRequestGet],
    },
  {
      routePath: "/api/operator/status",
      mountPath: "/api/operator",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_operator_status_ts_onRequestOptions],
    },
  ]