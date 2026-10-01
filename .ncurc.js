export default {
  cooldown: (pkg) => {
    if (
      ["@mr-hope/", "@oxfmt/", "@oxlint/", "@oxlint-tsgolint/"].some((prefix) =>
        pkg.startsWith(prefix),
      ) ||
      ["oxfmt", "oxlint", "oxlint-tsgolint", "tsdown"].includes(pkg)
    )
      return 0;

    return 1;
  },
  peer: true,
  upgrade: true,
  timeout: 360000,
  target: (name) => {
    if (name === "@types/node") return "minor";

    return "latest";
  },
};
