ko.bindingHandlers["numericValue"] = {
    init: (element: HTMLElement, valueAccessor: () => KnockoutObservable<number>, allBindingsAccessor: KnockoutAllBindingsAccessor) => {
        var underlyingObservable = valueAccessor();
        var interceptor = ko.computed({
            read: () => underlyingObservable().toString(),
            write: value => {
                underlyingObservable(parseFloat(value) || 0);
            }
        });
        ko.bindingHandlers.value.init(element, () => { return interceptor; }, allBindingsAccessor);
    },
    update: ko.bindingHandlers.value.update
};

ko.bindingHandlers["editableText"] = {
    init: (element: HTMLElement, valueAccessor: () => KnockoutObservable<string>) => {
        element.addEventListener("blur", () => {
            var observable = valueAccessor();
            observable(this.innerHTML);
        });
    },
    update: (element, valueAccessor) => {
        var value = ko.utils.unwrapObservable(valueAccessor());
        element.innerHTML = value;
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