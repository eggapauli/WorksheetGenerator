module Program

open FunScript

[<EntryPoint>]
let entry argv = 
    Runtime.Run(components = Components.customComponents, browse=false)
    0
