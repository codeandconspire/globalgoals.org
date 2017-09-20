# Global Goals

> Public facing website for The Global Goals website

## Stack

Deploy -> now -> Build assets -> Publish assets to S3

Prismic.io -> Hook -> now -> Empty cache (Redis)

www -> now -> Write/Read from cache (Redis)

## TODO

- [ ] Fix Now (org)
- [x] Configure routes (redirects)
- [ ] Set up static file serving
- [x] Set up Prismic.io
- [x] Configure web hook endpoint
- [ ] Set up S3
- [ ] Create deploy scripts (npm script + publish to S3)
- [x] Investigate DNS (hosting, email addresses etc.)
- [ ] Add license and open repo
