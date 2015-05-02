var _this = this;
ko.bindingHandlers["numericValue"] = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        var underlyingObservable = valueAccessor();
        var interceptor = ko.computed({
            read: underlyingObservable,
            write: function (value) {
                underlyingObservable(parseFloat(value) || 0);
            }
        });
        ko.bindingHandlers.value.init(element, function () {
            return interceptor;
        }, allBindingsAccessor);
    },
    update: ko.bindingHandlers.value.update
};
ko.bindingHandlers["editableText"] = {
    init: function (element, valueAccessor) {
        element.addEventListener("blur", function () {
            var observable = valueAccessor();
            observable(_this.innerHTML);
        });
    },
    update: function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        element.innerHTML = value;
    }
};
ko.bindingHandlers["slider"] = {
    init: function (element, valueAccessor) {
        var value = valueAccessor();
        var slider = $(element).slider({
            min: value.min,
            max: value.max,
            scale: value.scale,
            step: value.step,
            range: true,
            value: [value.lower(), value.upper()]
        });
        $(element).on("slide", function (evt) {
            value.lower(evt.value[0]);
            value.upper(evt.value[1]);
        });
    },
    update: function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        element.innerHTML = value;
    }
};
//# sourceMappingURL=KnockoutBindingHandlers.js.map