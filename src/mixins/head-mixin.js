function getOptions(vm, keys) {
  return keys.reduce((acc, key) => {
    const value = vm.$options[key];
    Object.assign(acc, {
      [key]: typeof value === "function" ? value.call(vm) : value
    });
    return acc;
  }, {});
}

function metasToHTML(metaMap) {
  return metaMap
    ? Object.keys(metaMap)
        .map(metaKey => {
          return `<meta ${Object.keys(metaMap[metaKey])
            .map(key => `${key}="${metaMap[metaKey][key]}"`)
            .join(" ")} />`;
        })
        .join("")
    : "";
}

const clientHeadMixin = {
  created() {
    const options = getOptions(this, ["title", "metas"]);
    if (typeof options.title !== "undefined") {
      document.title = options.title;
    }
    if (typeof options.metas !== "undefined") {
      options.metas.forEach(meta => {
        let target = document.head.querySelector(
          `meta[${meta.key}="${meta.props[meta.key]}"]`
        );
        if (!target) {
          target = document.createElement("head");
          document.head.appendChild(target);
        }
        Object.keys(meta.props).forEach(key => {
          target.setAttribute(key, meta.props[key]);
        });
      });
    }
  }
};

const serverHeadMixin = {
  created() {
    const options = getOptions(this, ["title", "metas"]);
    if (typeof options.title !== "undefined") {
      this.$ssrContext.title = options.title;
    }
    if (typeof options.metas !== "undefined") {
      if (!this.$ssrContext.metaMap) {
        this.$ssrContext.metaMap = {};
      }
      const { metaMap } = this.$ssrContext;
      options.metas.forEach(meta => {
        metaMap[meta.props[meta.key]] = meta.props;
      });
      this.$ssrContext.metas = metasToHTML(metaMap);
    }
  }
};

export default process.env.VUE_ENV === "server"
  ? serverHeadMixin
  : clientHeadMixin;
