ko.bindingHandlers["numericValue"] = {
    init: (element: HTMLElement, valueAccessor, allBindingsAccessor: KnockoutAllBindingsAccessor) => {
        var underlyingObservable = valueAccessor();
        var interceptor = ko.computed({
            read: underlyingObservable,
            write: (value: string) => {
                underlyingObservable(parseFloat(value) || 0);
            }
        });
        ko.bindingHandlers.value.init(element, () => { return interceptor; }, allBindingsAccessor);
    },
    update: ko.bindingHandlers.value.update
};

ko.bindingHandlers["editableText"] = {
    init: (element: HTMLElement, valueAccessor) => {
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

ko.bindingHandlers["slider"] = {
    init: (element: HTMLElement, valueAccessor) => {
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