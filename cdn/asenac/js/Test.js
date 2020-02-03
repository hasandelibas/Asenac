$(document).on("click", ".tab-menu li", function (e) {
    console.log("Tab-Menu Click", $(this).index());
    var index = $(this).index();
    $($(this).parents(".tab-menu").next(".tab-panel").find(".panel").removeClass("show").get(index)).addClass("show");
});
