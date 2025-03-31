export class Either {
  constructor(value) {
    this.value = value
  }

  static Left(value) {
    return new _Left(value)
  }

  static Right(value) {
    return new _Right(value)
  }

  isLeft() {
    return this instanceof _Left
  }

  isRight() {
    return this instanceof _Right
  }

  map(fn) {
    return this.isRight() ? Either.Right(fn(this.value)) : this
  }

  chain(fn) {
    return this.isRight() ? fn(this.value) : this
  }

  either(leftFn, rightFn) {
    return this.isLeft() ? leftFn(this.value) : rightFn(this.value)
  }
}

class _Left extends Either {
  constructor(value) {
    super(value)
  }
}

class _Right extends Either {
  constructor(value) {
    super(value)
  }
}

export const Right = Either.Right
export const Left = Either.Left
