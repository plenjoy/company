export function getParams(summary, spec) {
  const size = summary.get('size');
  const cover = summary.get('cover');
  return spec.getIn([size, cover, 'parameters']).toJS();
}