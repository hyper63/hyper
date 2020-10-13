module.exports = {
  all: async () => [{ slug: 'guides' }],
  permalink: ({ request }) => `/${request.slug}`,
  data: {},
};
