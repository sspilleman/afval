import { getCalendar } from "./api.ts";
import { getIcal } from "./ical.ts";
import { serve, ServeInit } from "std/http/server.ts";
import { RouteHandler, Router } from "libs/router/mod.ts";

const getCal: RouteHandler = async (_request, _params, headers) => {
  const json = await getCalendar();
  if (!json) return new Response("error", { status: 400, headers });
  const ical = getIcal(json.dataList);
  // await Deno.writeTextFile("afval.json", JSON.stringify(json, undefined, "  "));
  // await Deno.writeTextFile("afval.ical", ical);
  headers.set("content-type", "text/calendar; charset=utf-8");
  return new Response(ical, { status: 200, headers });
};

const router = new Router();
router.get("/", [getCal]);

const getDefaultHeaders = (request: Request): Headers => {
  const headers = new Headers();
  const authorization = request.headers.get("Authorization");
  if (authorization) headers.set("Authorization", authorization);
  const origin = <string> request.headers.get("origin") ||
    <string> request.headers.get("host");
  headers.set("Access-Control-Allow-Origin", origin);
  headers.set("Access-Control-Allow-Credentials", "true");
  headers.set("Access-Control-Expose-Headers", "*");
  headers.set("access-control-expose-headers", "*");
  return headers;
};

const hostname = "0.0.0.0";
const port = 4000;
const options: ServeInit = { hostname, port };

await serve(async (request: Request) => {
  const headers = getDefaultHeaders(request);
  try {
    if (request.method === "OPTIONS") {
      headers.set(
        "Access-Control-Allow-Headers",
        "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With, X-Forwarded-For",
      );
      return new Response(null, { status: 204, headers });
    } else {
      return await router.route(request, headers);
    }
  } catch (error) {
    console.log("catch", error);
    return new Response("Internal Server Error", { status: 500, headers });
  }
}, options).catch((err) => console.log(err));
