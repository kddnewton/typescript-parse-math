// The type that we'll be using to perform our math. It represents a signed
// number via a `sign` property and an array of length corresponding to the
// number value it represents. This is to allow mutating the value through array
// spreading.
export type Value = { sign: "+" | "-", val: any[] };

// Convenience types that represent the values 0 and 1 respectively.
type Zero = { sign: "+", val: [] };
type One = { sign: "+", val: [any] };

// Generic types that are convenience checks against whether or not a value is
// positive or negative.
type Positive = { sign: "+", val: any[] };
type Negative = { sign: "-", val: any[] };

// Converts a value into the number that it represents. Unfortunately at the
// moment this is limited to positive numbers, as we don't really have a way to
// represent negative numbers.
export type FromValue<V extends Value> =
  V extends Zero ? 0 :
  V extends Positive ? V["val"]["length"] :
  V extends Negative ? never :
  never;

// Converts a number into a value representation. Does this by increasing an
// array by 1 element until the array reaches the desired size. Only works with
// positive numbers, so if you want a negative number you need to use Negate.
export type ToValue<N extends number, A = [any]> =
  N extends 0 ? Zero :
  A extends any[]
    ? A["length"] extends N
      ? { sign: "+", val: A }
      : ToValue<N, [any, ...A]>
    : never;

// Reflects a value representation over 0 by flipping the sign.
type NegateSign<S extends Value["sign"]> = S extends "+" ? "-" : "+";
export type Negate<V extends Value> =
  V extends Zero ? Zero : { sign: NegateSign<V["sign"]>, val: V["val"] };

// Increments a value representation by 1. Special handling is necessary to
// handle the sign of the number.
export type Incr<V extends Value> =
  V extends Zero ? One :
  V extends Positive ? { sign: "+", val: [any, ...V["val"]] } :
  V extends { sign: "-", val: [any] } ? Zero :
  V extends { sign: "-", val: [any, ...infer R] } ? { sign: "-", val: R } :
  never;

// Decrements a value representation by 1. Special handling is necessary to
// handle the sign of the number.
export type Decr<V extends Value> =
  V extends Zero ? { sign: "-", val: [any] } :
  V extends Negative ? { sign: "-", val: [any, ...V["val"]] } :
  V extends One ? Zero :
  V extends { sign: "+", val: [any, ...infer R] } ? { sign: "+", val: R } :
  never;

// Adds two value representations together. Special base cases exist for if
// either value is zero. Otherwise it depends on a circular reference.
export type Add<A extends Value, B extends Value> =
  A extends Zero ? B :
  B extends Zero ? A :
  A extends Positive ? Add<Decr<A>, Incr<B>> : Add<Incr<A>, Decr<B>>;

// A convenience type that represents a subtraction by adding the negation of
// the second operand.
export type Sub<A extends Value, B extends Value> = Add<A, Negate<B>>;

// Multiplies two value representations together. Special base cases exist for
// if either of the operands are 0 or 1. Otherwise it depends on a circular
// reference.
export type Mult<A extends Value, B extends Value> =
  A extends Zero ? Zero :
  B extends Zero ? Zero :
  A extends One ? B :
  B extends One ? A :
  A extends Positive ? MultEach<A, B, Zero> :
  A extends Negative ? Negate<Mult<Negate<A>, B>> :
  never;

// This is a helper function for multiplication that will recursively perform
// the correct addition until we've hit the desired number of times.
type MultEach<A extends Value, B extends Value, Accum extends Value> =
  A extends Zero ? Accum : MultEach<Decr<A>, B, Add<Accum, B>>;
