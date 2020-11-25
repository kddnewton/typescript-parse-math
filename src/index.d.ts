import type { Value, Add, Sub, Mult, ToValue, FromValue } from "./math";

// A type that represents a failure to parse the input string. Can be returned
// in any number of circumstances.
type ParsingFailed = { error: true } & "parsing failed";

// A convenience type that allows an easy way to skip over whitespace by just
// ignoring it.
type SkipWhitespace<S extends string> =
  string extends S
    ? ParsingFailed
    : S extends ` ${infer S}` | `\n${infer S}` ? SkipWhitespace<S> : S;

// Parses a number recursively for each digit or returns a failure. I don't
// think you can get away with refining this further without the result being
// an unrefined union, so here just explicitly listing out every number.
type ParseNumber<S extends string> =
  S extends `0${infer Remain}` ? ParseNumberRecur<ToValue<0>, Remain> :
  S extends `1${infer Remain}` ? ParseNumberRecur<ToValue<1>, Remain> :
  S extends `2${infer Remain}` ? ParseNumberRecur<ToValue<2>, Remain> :
  S extends `3${infer Remain}` ? ParseNumberRecur<ToValue<3>, Remain> :
  S extends `4${infer Remain}` ? ParseNumberRecur<ToValue<4>, Remain> :
  S extends `5${infer Remain}` ? ParseNumberRecur<ToValue<5>, Remain> :
  S extends `6${infer Remain}` ? ParseNumberRecur<ToValue<6>, Remain> :
  S extends `7${infer Remain}` ? ParseNumberRecur<ToValue<7>, Remain> :
  S extends `8${infer Remain}` ? ParseNumberRecur<ToValue<8>, Remain> :
  S extends `9${infer Remain}` ? ParseNumberRecur<ToValue<9>, Remain> :
  ParsingFailed;

type Base = ToValue<10>;
type ParseNumberRecur<Accum extends Value, S extends string> =
  S extends "" | " "
    ? Accum
    : ParseNumber<S> extends infer Result
      ? Result extends ParsingFailed
        ? Accum
        : Result extends Value
          ? Add<Mult<Accum, Base>, Result>
          : never
    : never;

// Parses an addition or returns a failure.
type ParseAdd<S extends string> =
  S extends `${infer Left}+${infer Right}`
    ? ParseExpr<Left> extends infer LeftResult
      ? ParseExpr<Right> extends infer RightResult
        ? LeftResult extends Value
          ? RightResult extends Value
            ? Add<LeftResult, RightResult>
            : never
          : never
        : never
      : never
    : ParsingFailed;

// Parses a subtraction or returns a failure.
type ParseSub<S extends string> =
  S extends `${infer Left}-${infer Right}`
    ? ParseExpr<Left> extends infer LeftResult
      ? ParseExpr<Right> extends infer RightResult
        ? LeftResult extends Value
          ? RightResult extends Value
            ? Sub<LeftResult, RightResult>
            : never
          : never
        : never
      : never
    : ParsingFailed;

// Parses a multiplication or returns a failure.
type ParseMult<S extends string> =
  S extends `${infer Left}*${infer Right}`
    ? ParseExpr<Left> extends infer LeftResult
      ? ParseExpr<Right> extends infer RightResult
        ? LeftResult extends Value
          ? RightResult extends Value
            ? Mult<LeftResult, RightResult>
            : never
          : never
        : never
      : never
    : ParsingFailed;

// Parses multiplication nodes, or delegates down to numbers.
type ParseTerm<S extends string> =
  ParseMult<SkipWhitespace<S>> extends infer MultResult
    ? MultResult extends ParsingFailed
      ? ParseNumber<SkipWhitespace<S>>
      : MultResult
    : never;

// Parses addition nodes, subtraction nodes, or delegates down to terms.
type ParseExpr<S extends string> =
  ParseAdd<SkipWhitespace<S>> extends infer AddResult
    ? AddResult extends ParsingFailed
      ? ParseSub<SkipWhitespace<S>> extends infer SubResult
        ? SubResult extends ParsingFailed
          ? ParseTerm<S>
          : SubResult
        : never
      : AddResult
    : never;

// The top of the parse tree. Handles converting whatever value is returned into
// the number that it represents.
//
// The grammar that is being represented here is:
//
//     Root: Expr
//     Expr: Add | Sub | Term
//     Add: Expr "+" Expr
//     Sub: Expr "-" Expr
//     Term: Mult | Number
//     Mult: Expr "*" Expr
//     Number: Digit+
//     Digit: "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"
export type ParseMath<S extends string> =
  ParseExpr<S> extends infer Result
    ? Result extends Value
      ? FromValue<Result>
      : ParsingFailed
    : never;

// Reexport all of the exposed types from the math module.
export * from "./math";
