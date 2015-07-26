ko.bindingHandlers["numericValue"] = {
    init: (element: HTMLElement, valueAccessor: () => KnockoutObservable<number>, allBindingsAccessor: KnockoutAllBindingsAccessor) => {
        var observable = valueAccessor();
        var interceptor = ko.computed({
            read: () => observable().toString(),
            write: value => {
                observable(parseFloat(value) || 0);
            }
        });
        ko.bindingHandlers.value.init(element, () => { return interceptor; }, allBindingsAccessor);
    },
    update: ko.bindingHandlers.value.update
};

ko.bindingHandlers["editableText"] = {
    init: (element: HTMLElement, valueAccessor: () => KnockoutObservable<string>) => {
        element.addEventListener("blur", _ => {
            var observable = valueAccessor();
            observable(element.innerText);
        });
    },
    update: (element, valueAccessor) => {
        var value = ko.utils.unwrapObservable(valueAccessor());
        element.innerText = value;
    }
};

interface ObservableSliderOptions {
    min: number
    max: number
    scale: string
    step: number
    lower: KnockoutObservable<number>
    upper: KnockoutObservable<number>
}

ko.bindingHandlers["slider"] = {
    init: (element: HTMLElement, valueAccessor: () => ObservableSliderOptions) => {
        var value = valueAccessor();
        var slider = $(element).slider({
            min: value.min,
            max: value.max,
            scale: value.scale,
            step: value.step,
            range: true,
            value: [value.lower(), value.upper()]
        })

        $(element).on("slide", (evt: any) => {
            value.lower(evt.value[0]);
            value.upper(evt.value[1]);
        });
    },
    update: (element, valueAccessor) => {
        var value = ko.utils.unwrapObservable(valueAccessor());
        element.innerHTML = value;
    }
}; 