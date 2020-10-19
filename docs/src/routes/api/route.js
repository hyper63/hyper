module.exports = {
  all: async () => [{ slug: 'api' }],
  permalink: ({ request }) => `/${request.slug}`,
  data: {},
};
