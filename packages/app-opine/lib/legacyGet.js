import { isTrue } from '../utils.js';

export default (req, _res, next) => {
  if (!req.get('X-HYPER-LEGACY-GET')) return next();

  req.isLegacyGetEnabled = isTrue(req.get('X-HYPER-LEGACY-GET'));
  next();
};
