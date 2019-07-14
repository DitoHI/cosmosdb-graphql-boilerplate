'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.default = {
  exitAppIfUnauthorized: (user, checkIsActive = true) => {
    if (!user) {
      throw Error('You are not authenticated');
    }
    if (checkIsActive && !user.isActived) {
      throw Error('You are currently not active');
    }
    return;
  }
};
//# sourceMappingURL=common.js.map
