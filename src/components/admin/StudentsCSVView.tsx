import { DefaultTemplate } from '@payloadcms/next/templates'
import type { AdminViewServerPropsOnly } from 'payload'
import StudentsCSVClient from './StudentsCSVClient'

export default function StudentsCSVView({ initPageResult, params }: AdminViewServerPropsOnly) {
  const { req, permissions, visibleEntities } = initPageResult

  // Extract the JWT from the request cookie and pass it to the client as a Bearer token.
  // This avoids Payload's CSRF check which blocks same-origin POST fetch requests.
  const cookiePrefix = req.payload.config.cookiePrefix ?? 'payload'
  const cookieHeader = req.headers.get('Cookie') ?? ''
  const tokenMatch = cookieHeader.match(new RegExp(`${cookiePrefix}-token=([^;\\s]+)`))
  const token = tokenMatch?.[1] ?? null

  return (
    <DefaultTemplate
      i18n={req.i18n}
      params={params}
      payload={req.payload}
      permissions={permissions}
      req={req}
      user={req.user ?? undefined}
      visibleEntities={visibleEntities}
    >
      <StudentsCSVClient token={token} />
    </DefaultTemplate>
  )
}
