function GameInterface() {
  const types = {
    PROMPT: prompt,
    CONFIRM: confirm,
    ALERT: alert,
  };
  const history = [];

  function saveRenderData(renderData) { history.push(renderData); }

  return {
    get type() {
      return {
        ...Object
          .keys(types)
          .reduce((obj, key) => Object.assign(obj, { [key]: key }), {})
      };
    },
    backTo(to = 1) {
      if (history.length + 1 < to) return;

      const renderData = history[history.length - to - 1];

      history.splice(-to, to);

      this.update(renderData);
    },
    update() { this.render(history.pop()); },
    render({ type, message, onSubmit, onCancel, defaultValue } = {}, noHistory) {
      if (!types.hasOwnProperty(type)) return false;

      if (!noHistory) saveRenderData({ type, message, onSubmit, onCancel, defaultValue });

      let messageStr = message;
      if (Array.isArray(message)) {
        messageStr = message.map((msg) => {
          if (typeof msg === 'function') return msg();
          return msg;
        }).join('\n');
      }
      if (typeof messageStr === 'function') messageStr = message();

      const renderFn = types[type];
      const result = renderFn(messageStr, defaultValue);

      if (result === null || result === false || result === undefined) {
        if (onCancel) onCancel();
      } else {
        if (onSubmit) onSubmit(result);
      }
    },
  }
}

export default GameInterface;
