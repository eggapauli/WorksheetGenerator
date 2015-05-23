[<FunScript.JS>]
module KnockoutBindingHandlers

open System
open FunScript
open FunScript.TypeScript

type FullKnockoutBindingHandler<'a> =
    {
        init: HTMLElement * (unit -> 'a) * (unit -> obj) * obj * KnockoutBindingContext -> unit
        update: HTMLElement * (unit -> 'a) * (unit -> obj) * obj * KnockoutBindingContext -> unit
    }
    interface KnockoutBindingHandler

type KnockoutComputed<'a> = {
    read: unit -> 'a
    write: string -> unit
}

Globals.ko.bindingHandlers.["numericValue"] <-
    {
        init = fun (element, valueAccessor: unit -> KnockoutObservable<_>, allBindingsAccessor, viewModel, bindingContext) ->
            let underlyingObservable = valueAccessor()
            let interceptor =
                Globals.ko.computed.Invoke
                    {
                        read = underlyingObservable.Invoke
                        write = fun value ->
                            match Double.TryParse value with
                            | (true, parsed) -> underlyingObservable.Invoke parsed
                            | _ -> ()
                    }
            Globals.ko.bindingHandlers.value.init(element, (fun () -> interceptor :> obj), Func<_>(allBindingsAccessor), viewModel, bindingContext)
        update = fun (element, valueAccessor: unit -> KnockoutObservable<_>, allBindingsAccessor, viewModel, bindingContext) ->
            Globals.ko.bindingHandlers.value.update(element, (fun () -> valueAccessor() :> obj), Func<_>(allBindingsAccessor), viewModel, bindingContext)
    }

Globals.ko.bindingHandlers.["editableText"] <-
    {
        init = fun (element, valueAccessor: unit -> KnockoutObservable<_>, allBindingsAccessor, viewModel, bindingContext) ->
            element.addEventListener("blur", fun _ ->
                valueAccessor().Invoke element.innerHTML
            )
        update = fun (element, valueAccessor: unit -> KnockoutObservable<_>, allBindingsAccessor, viewModel, bindingContext) ->
            element.innerHTML <- valueAccessor() |> Globals.ko.utils.unwrapObservable
    }

type SliderConfig = {
    min: float
    max: float
    scale: float
    step: float
    range: bool
    lower: KnockoutObservable<float>
    upper: KnockoutObservable<float>
}

type BootstrapSliderConfig = {
    min: float
    max: float
    scale: float
    step: float
    range: bool
    value: float list
}

type JQuery with
    [<JSEmitInline("({0}.slider({1}))")>]
    member x.slider (config: BootstrapSliderConfig) : JQuery = failwith "never"

type JQuerySlideEventObject =
    inherit JQueryEventObject

[<AutoOpen>]
module Ext =
    type JQuerySlideEventObject with
        [<JSEmitInline("({0}.value)")>]
        member x.value: float list = failwith "never"

Globals.ko.bindingHandlers.["slider"] <-
    {
        init = fun (element, valueAccessor: unit -> SliderConfig, allBindingsAccessor, viewModel, bindingContext) ->
            let value = valueAccessor()
            let sliderConfig =
                {
                    min = value.min
                    max = value.max
                    scale = value.scale
                    step = value.step
                    range = true
                    value = [ value.lower.Invoke(); value.upper.Invoke() ]
                }
            let jqElem = Globals.Dollar.Invoke element
            jqElem
                .slider(sliderConfig)
                .on("slide", fun (e: JQueryEventObject) _ ->
                    let evt = (e :?> JQuerySlideEventObject)
                    value.lower.Invoke evt.value.[0]
                    value.upper.Invoke evt.value.[1]
                    :> obj
                ) |> ignore
        update = fun (element, valueAccessor: unit -> SliderConfig, allBindingsAccessor, viewModel, bindingContext) ->
            failwith "Not supported"
    }
