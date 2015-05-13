open System.IO
open System.Text.RegularExpressions

let slnDir = __SOURCE_DIRECTORY__

let excludeDirs = [ "node_modules"; "Scripts" ]

let getOrphanedFiles extension =
    Directory.GetFiles(slnDir, "*" + extension, SearchOption.AllDirectories)
    |> Array.filter(fun f -> excludeDirs |> List.exists (fun d -> f.Contains(d)) |> not)
    |> Array.filter(fun f -> Regex.Replace(f, extension + "$", ".ts") |> File.Exists |> not)

getOrphanedFiles ".js"
|> Array.append (getOrphanedFiles ".js.map")
|> Array.append (getOrphanedFiles ".d.ts")
|> Array.iter File.Delete
//|> Array.iter (printfn "%s")
