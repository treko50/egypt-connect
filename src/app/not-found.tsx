import Link from 'next/link'

export default function NotFound() {
  return (
    <html lang="en">
      <body>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>404 - Page Not Found</h2>
          <p>The page you are looking for does not exist.</p>
          <Link href="/en">Go home</Link>
        </div>
      </body>
    </html>
  )
}
