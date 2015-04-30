//moment.lang("de");

var viewModel = new WorkSheetViewModel();

window.addEventListener("load", () => {
    ko.applyBindings(viewModel);
});
