//moment.lang("de");

var viewModel = new WorksheetViewModel();

window.addEventListener("load", () => {
    ko.applyBindings(viewModel);
});
