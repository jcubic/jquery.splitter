/// <reference path="./js/jquery.splitter.d.ts" />

import "jquery";
import "jquery.splitter";

function test_type<T>(x: T): boolean {
    return x === x;
};
// -----------------------------------------------------------------------------
// :: instance
// -----------------------------------------------------------------------------
$('#foo').split();
$('#foo').split({});
var splitter = $('#foo').height(200).split({
    orientation: 'vertical',
    limit: 10,
    position: '50%',
    onDrag: function(event) {
        test_type<number[]>(splitter.position());
        // pageX is undefined for touch events
        test_type<number | undefined>(event.pageX);
        test_type<TouchList | undefined>(event.changedTouches);
    }
});
$('#foo').split({
    orientation: 'horizontal',
    limit: {
        leftUpper: 10,
        rightBottom: 20
    },
    position: 100,
    invisible: true,
    percent: true,
    ignoreTags: 'script,style,link',
    onDragStart: function(event) {
        test_type<JQuery.TriggeredEvent>(event);
    },
    onDragEnd: function() {}
});
// multiple panels
$('#foo').split({
    position: ['25%', '25%', '25%']
});
$('#foo').split({
    position: [100, 200]
});
// -----------------------------------------------------------------------------
// :: options need to be valid
// -----------------------------------------------------------------------------
// @ts-expect-error
$('#foo').split({ orientation: 'diagonal' });
// @ts-expect-error
$('#foo').split({ percent: 'yes' });
// @ts-expect-error
$('#foo').split({ limit: { leftUpper: 10 } });
// @ts-expect-error
$('#foo').split({ invalidOption: true });
// -----------------------------------------------------------------------------
// :: properties
// -----------------------------------------------------------------------------
test_type<JQuerySplitter.Orientation>(splitter.orientation);
test_type<number>(splitter.limit.leftUpper);
test_type<number>(splitter.limit.rightBottom);
test_type<JQuerySplitter.Settings>(splitter.settings);
test_type<JQuerySplitter.Orientation>(splitter.settings.orientation);
// -----------------------------------------------------------------------------
// :: position
// -----------------------------------------------------------------------------
test_type<number[]>(splitter.position());
test_type<JQuerySplitter>(splitter.position(100));
test_type<JQuerySplitter>(splitter.position('50%'));
test_type<JQuerySplitter>(splitter.position([100, 200]));
test_type<JQuerySplitter>(splitter.position(100, true));
// @ts-expect-error
splitter.position(true);
// -----------------------------------------------------------------------------
// :: option
// -----------------------------------------------------------------------------
test_type<JQuerySplitter.Orientation>(splitter.option('orientation'));
test_type<number | JQuerySplitter.Limit>(splitter.option('limit'));
test_type<boolean>(splitter.option('percent'));
test_type<string>(splitter.option('ignoreTags'));
test_type<JQuerySplitter>(splitter.option('limit', 100));
test_type<JQuerySplitter>(splitter.option('position', '50%'));
test_type<JQuerySplitter>(splitter.option('orientation', 'horizontal'));
// @ts-expect-error
splitter.option('orientation', 'diagonal');
// @ts-expect-error
splitter.option('invalid');
// -----------------------------------------------------------------------------
// :: other methods
// -----------------------------------------------------------------------------
splitter.refresh();
test_type<boolean>(splitter.isActive());
splitter.destroy();
// -----------------------------------------------------------------------------
// :: jQuery methods are still available
// -----------------------------------------------------------------------------
test_type<JQuerySplitter>(splitter.addClass('foo'));
test_type<number | undefined>(splitter.width());
splitter.on('splitter.resize', function() {
    test_type<number[]>(splitter.position());
});
splitter.find('.splitter_panel');
