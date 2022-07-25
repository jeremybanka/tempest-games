import type { FC } from "react"

import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node"
import { redirect, json } from "@remix-run/node"
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react"

import { Wayfarer } from "./git.server"
import { getUser } from "./session.server"
import tailwindStylesheetUrl from "./styles/tailwind.css"
import { AuthError } from "./utils"

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: tailwindStylesheetUrl }]
}

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Remix Notes",
  viewport: "width=device-width,initial-scale=1",
})

type LoaderData = {
  user: Awaited<ReturnType<typeof getUser>>
  status: Awaited<ReturnType<typeof Wayfarer.status>>
  diff: Awaited<ReturnType<typeof Wayfarer.diff>>
}

export const loader: LoaderFunction = async ({ request }) => {
  return json<LoaderData>({
    user: await getUser(request),
    status: await Wayfarer.status(),
    diff: await Wayfarer.diff(),
  })
}

const App: FC = () => {
  useLoaderData()
  return (
    <html lang="en" className="h-full">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
export default App
