import preview from '@/pages/api/preview'

import http from 'http'
import fetch from 'isomorphic-fetch'
import listen from 'test-listen'
import {
  apiResolver,
  __ApiPreviewProps,
} from 'next/dist/next-server/server/api-utils'
import { waitFor } from '@testing-library/react'

let server: http.Server, url: string

beforeAll(async (done) => {
  const dummyApiContext: __ApiPreviewProps = {
    previewModeEncryptionKey: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    previewModeId: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    previewModeSigningKey: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
  }
  server = http.createServer((req, res) =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    apiResolver(req, res, undefined, preview, dummyApiContext)
  )
  url = await listen(server)
  done()
})

afterAll((done) => server.close(done))

test('Should return 403 if required query string is missing', async () => {
  const response = await fetch(url + '/api/preview')
  const data = await response.json()
  expect(response.status).toBeGreaterThanOrEqual(400)
  expect(data.message).toContain('Invalid')
})

test('Should redirect to /blogs/[slug] if required query strings are passed', async () => {
  const response = await fetch(
    `${url}?secret=${process.env.DATOCMS_PREVIEW_SECRET}&slug=javascript-variables`
  )
  await waitFor(() => {
    expect(response.url).toMatch('javascript-variables')
  })
})

test('Should return 400 if the slug is invalid', async () => {
  const response = await fetch(
    `${url}?secret=${process.env.DATOCMS_PREVIEW_SECRET}&slug=abc`
  )
  expect(response.status).toBeGreaterThanOrEqual(400)
  expect((await response.json()).message).toContain('Invalid')
})