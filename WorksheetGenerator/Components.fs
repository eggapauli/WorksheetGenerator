module Components

open FunScript

module Replacements =
    [<JSEmitInline("undefined")>]
    let empty(): unit = failwith "Never"

    module System =
        module Math =
            [<JSEmit("Math.round({0} / 10^{1}) * 10^{1}")>]
            let round(x : float, n: int) : unit = failwith "never"
        module Random =
            [<JSEmitInline("Math.random({0})")>]
            let nextDouble (r: System.Random) : unit = failwith "never"

let customComponents =
    [
        ExpressionReplacer.createUnsafe <@ fun (x: float, n: int) -> System.Math.Round(x, n) @> <@ Replacements.System.Math.round @>

        ExpressionReplacer.createUnsafe <@ fun () -> System.Random() @> <@ Replacements.empty @>
        ExpressionReplacer.createUnsafe <@ fun (r: System.Random) -> r.NextDouble() @> <@ Replacements.System.Random.nextDouble @>
    ]