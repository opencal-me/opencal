# opencal

_A lowkey way to share what you're up to as an open invite._

## Setup

```bash
# Install tools
brew install docker rbenv nodenv yarn watchman overmind

# Set up environment
git clone git@github.com:opencal-me/opencal
cd opencal
bin/setup
```

## TODO

- [ ] Sanitize all links from description to open in new tab, and have safe
      'rel' attribute options.
- [ ] Automatically generate a sitemap with
      [Sitemap Generator](https://github.com/kjvarga/sitemap_generator)
- [x] Show a dedicated page for users without a Google refresh token, requiring
      them to proceed manually; then, disable the /login route.
