/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://www.lqcfchurc.org",
  generateRobotsTxt: true,

  exclude: ["/lq-login"],

  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: "/lq-login",
      },
    ],
  },
};
