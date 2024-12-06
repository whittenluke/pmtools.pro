Element adapter
Create, respond to and listen to element drag operations
About
Drag previews
Unregistered elements
Other utilities
The element adapter enables you to create rich drag and drop experiences, such as lists, boards, grids, resizing and so on.

The element adapter contains the essential pieces for element operations:

draggable: enable dragging of an element.
dropTargetForElements: marking an element as a valid drop target
monitorForElements: create a monitor to listen for element drag operation events anywhere.
types: all types for this adapter.
There are also a number of optional element utilities:

setCustomNativeDragPreview: use a new element as the native drag preview
pointerOutsideOfPreview: native drag preview function to place the users pointer outside of the drag preview
centerUnderPointer: native drag preview function to place the center of the ntaive drag preview under the users pointer
preserveOffsetOnSource: native drag preview function to match the pointer position on a native drag preview as close as possible to the pointer position on the draggable element
disableNativeDragPreview: disable the native drag preview (helpful if you want to use your own custom drag preview or have no drag preview)
scrollJustEnoughIntoView: scroll an element just enough into view so it is visible (helpful when working with default native drag previews)
It is likely that some top level utilities will be helpful for your experience as well

Draggable
A draggable is an HTMLElement that can be dragged around by a user.

A draggable can be located:

Outside of any drop targets
Inside any amount of levels of nested drop targets
So, anywhere!
While a drag operation is occurring:

You can add new draggables
You can remount a draggable. See Reconciliation
You can change the dimensions of the dragging draggable during a drag. But keep in mind that won't change the drag preview image, as that is collected only at the start of the drag (in onGenerateDragPreview())
You can remove the dragging draggable during a drag operation. When a draggable is removed it's event functions (eg onDrag) will no longer be called. Being able to remove the dragging draggable is a common requirement for virtual lists
Draggable argument overview
element: HTMLElement: a HTMLElement that will be draggable (using HTMLElement as that is the interface that allows the "draggable" attribute)
dragHandle?: Element: an optional Element that can be used to designate the part of the draggable that can exclusively used to drag the whole draggable
canDrag?: (args: GetFeedbackArgs) => boolean: used to conditionally allow dragging (see below)
getInitialData?: (args: GetFeedbackArgs) => Record<string, unknown>: a one time attaching of data to a draggable as a drag is starting. If you want to understand the type of data attached to a drop target elsewhere in your application, see our typing data guide.
getInitialDataForExternal?: (args: GetFeedbackArgs) => {[Key in NativeMediaType]?: string;}: used to attach native data (eg "text/plain") to other windows or applications.
type GetFeedbackArgs = {
/**
_ The user input as a drag is trying to start (the `initial` input)
_/
input: Input;
/**
_ The `draggable` element
_/
element: HTMLElement;
/\*\*
_ The `dragHandle` element for the `draggable`
_/
dragHandle: Element | null;
};
onGenerateDragPreview
onDragStart
onDrag
onDropTargetChange
onDrop
Drag handles
A drag handle is the part of your draggable element that can be dragged in order to drag the whole draggable. By default, the entire draggable acts as a drag handle. However, you can optionally mark a child element of a draggable element as the drag handle.

draggable({
element: myElement,
dragHandle: myDragHandleElement,
});
You can also implement a drag handle by making a small part of an element the draggable, and then using setCustomNativeDragPreview to generate a preview for the entire entity.

Conditional dragging (canDrag())
A draggable can conditionally allow dragging by using the canDrag() function. Returning true from canDrag() will allow the drag, and returning false will prevent a drag.

draggable({
element: myElement,
// disable dragging
canDrag: () => false,
});
Drop on me!
Last dropped: none

Disabling a drag by returning false from canDrag() will prevent any other draggable on the page from being dragged. @atlaskit/pragmatic-drag-and-drop calls event.preventDefault() under the hood when canDrag() returns false, which cancels the drag operation. Unfortunately, once a drag event has started, a draggable element cannot individually opt out of dragging and allow another element to be dragged.

If you want to disable dragging for a draggable, but still want a parent draggable to be able to be dragged, then rather than using canDrag() you can conditionally apply draggable()

Here is example of what that could look like using react:

import {useEffect} from 'react';
import {draggable} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

function noop(){};

function Item({isDraggingEnabled}: {isDraggingEnabled: boolean}) {
const ref = useRef();

useEffect({
// when disabled, don't make the element draggable
// this will allow a parent draggable to still be dragged
if(!isDraggingEnabled) {
return noop;
}
return draggable({
element: ref.current,
});
}, [isDraggingEnabled]);

return <div ref={ref}>Draggable item</div>
};
Data for external consumers (getInitialDataForExternal())
getInitialDataForExternal() allows you want to attach data to a drag operation that can be used by other windowss or applications (externally)

draggable({
element: myElement,
getInitialData: () => ({ taskId: task.id }),
getInitialDataForExternal: () => ({
'text/plain': task.description,
'text/uri-list': task.url,
}),
});
We also have a helper formatURLsForExternal(urls: string[]): string that allows you to attach multiple urls for external consumers.

import { formatURLsForExternal } from '@atlaskit/pragmatic-drag-and-drop/element/format-urls-for-external';

draggable({
element: myElement,
getInitialData: () => ({ taskId: task.id }),
getInitialDataForExternal: () => ({
'text/plain': task.description,
'text/uri-list': formatURLsForExternal([task.url, task.anotherUrl]),
}),
});
Data attached for external consumers can be accessed by any external consumer that the user drops on. It is important that you don't expose private data.

Attaching external data from a draggable will not trigger the external adapter in the window that the draggable started in, but it will trigger the external adapter in other windows (eg in <iframe>s).

Drop target for elements
A drop target for elements.

The default dropEffect for this type of drop target is "move". This lines up with our design guides. You can override this default with getDropEffect().

import {dropTargetForElements} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

const cleanup = dropTargetForElements({
element: myElement,
onDragStart: () => console.log('Something started dragging in me!');
});
Monitor for elements
A monitor for elements.

import {monitorForElements} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

const cleanup = monitorForElements({
onDragStart: () => console.log('Dragging an element');
});
Types
Generally you won't need to explicitly use our provided types, but we expose a number of TypeScript types if you would like to use them.

All events on draggables, drop targets and monitors, are given the following base payload:

type ElementEventBasePayload = {
location: DragLocationHistory;
source: ElementDragPayload;
};

type ElementDragPayload = {
element: HTMLElement;
dragHandle: Element | null;
data: Record<string, unknown>;
};
For all the arguments for all events, you can use our event map type:

type ElementEventPayloadMap = {
onDragStart: ElementEventBasePayload;
// .. the rest of the events
};
Draggable feedback functions (canDrag, getInitialData, getInitialDataForExternal) are given the following:

type ElementGetFeedbackArgs = {
/**
_ The user input as a drag is trying to start (the `initial` input)
_/
input: Input;
/**
_ The `draggable` element
_/
element: HTMLElement;
/\*\*
_ The `dragHandle` element for the `draggable`
_/
dragHandle: Element | null;
};
Drop targets are given a little bit more information in each event:

type ElementDropTargetEventBasePayload = ElementEventBasePayload & {
/\*\*
_ A convenance pointer to this drop targets values
_/
self: DropTargetRecord;
};
For all arguments for all events on drop targets, you can use our event map type:

type ElementDropTargetEventPayloadMap = {
onDragStart: ElementDropTargetEventBasePayload;
// .. the rest of the events
};
Drop target feedback functions (canDrop, getData, getDropEffect, getIsSticky) are given the following:

type ElementDropTargetGetFeedbackArgs = {
/**
_ The users *current* input
_/
input: Input;
/**
_ The data associated with the entity being dragged
_/
source: ElementDragPayload;
/\*\*
_ This drop target's element
_/
element: Element;
};
The monitor feedback function (canMonitor), is given the following:

type ElementMonitorGetFeedbackArgs = {
/**
_ The users `initial` drag location
_/
initial: DragLocation;
/**
_ The data associated with the entity being dragged
_/
source: ElementDragPayload;
};
You can get these type from the element adapter import:

import type {
// Payload for the draggable being dragged
ElementDragPayload,
// Base events
ElementEventBasePayload,
ElementEventPayloadMap,
// Drop target events
ElementDropTargetEventBasePayload,
ElementDropTargetEventPayloadMap,
// Feedback types
ElementGetFeedbackArgs,
ElementDropTargetGetFeedbackArgs,
ElementMonitorGetFeedbackArgs,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
There are also some types (eg DropTargetLocation) that can be used for all adapters which can be found on our top level utilities page

Drag previews
How to control what is under the users pointer while a drag is occurring
About
Drag previews
Unregistered elements
Other utilities
A drag preview is the thing that a user drags around during a drag operation. We have a number of supported techniques for controlling what the drag preview looks like.

Native drag previews
We recommend using native drag previews where possible as they have great performance characteristics (they are not rendered on the main thread) and they can be dragged between applications

Browsers have built in "native" mechanisms for rendering a drag preview

There are a few techniques you can use to control what a native drag preview will look like:

Approach 1: Use a custom native drag preview
You can ask the browser to take a photo of another visible element on the page and use that as the drag preview. There are some design constraints when leveraging native drag previews.

There are lots of platform gotchas when working with custom native drag previews. We recommend using our setCustomNativeDragPreview() as it makes it safe and easy to work with custom native drag previews.

Mounting a new element with setCustomNativeDragPreview
You can use setCustomNativeDragPreview to mount a new element to the page to be used as the drag preview. setCustomNativeDragPreview will call your cleanup function to remove the preview element from the page after the browser has taken a photo of the element. setCustomNativeDragPreview adds the container Element to the document.body and will remove the container Element after your cleanup function is called.

setCustomNativeDragPreview has been designed to work with any view abstraction.

Note: you are welcome to use the onGenerateDragPreview | nativeSetDragImage API directly. However, we recommend you use setCustomNativeDragPreview as it covers over a number of gotchas.

Usage example: react portals
This technique requires your component to be re-rendered, but maintains the current react context

type State =
| {
type: 'idle';
}
| {
type: 'preview';
container: HTMLElement;
};

function Item() {
const [state, setState] = useState<State>({ type: 'idle' });
const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        invariant(ref.current);

        return draggable({
            element: ref.current,
            onGenerateDragPreview({ nativeSetDragImage }) {
                setCustomNativeDragPreview({
                    render({ container }) {
                        // Cause a `react` re-render to create your portal synchronously
                        setState({ type: 'preview', container });
                        // In our cleanup function: cause a `react` re-render to create remove your portal
                        // Note: you can also remove the portal in `onDragStart`,
                        // which is when the cleanup function is called
                        return () => setState({ type: 'idle' });
                    },
                    nativeSetDragImage,
                });
            },
        });
    }, []);

    return (
        <>
            <div ref={ref}>Drag Me</div>
            {state.type === 'preview' ? ReactDOM.createPortal(<Preview />, state.container) : null}
        </>
    );

}
Usage example: A new react application
This technique requires no re-rendering of your component, but does not maintain the current react context

import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';

draggable({
element: myElement,
onGenerateDragPreview: ({ nativeSetDragImage }) => {
setCustomNativeDragPreview({
render({ container }) {
ReactDOM.render(<Preview item={item} />, container);
return function cleanup() {
ReactDOM.unmountComponentAtNode(container);
};
},
nativeSetDragImage,
});
},
});
Usage example: plain JavaScript
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';

draggable({
element: myElement,
onGenerateDragPreview: ({ nativeSetDragImage }) => {
setCustomNativeDragPreview({
render({ container }) {
// Create our preview element
const preview = document.createElement('div');

                // Populate and style the preview element however you like
                preview.textContent = 'My Preview';
                Object.assign(preview.style, {
                    padding: '20px',
                    backgroundColor: 'lightpink',
                });

                // put the "preview" element into the container element
                container.appendChild(preview);
            },
            nativeSetDragImage,
        });
    },

});
Positioning the drag preview
You can control where the custom native drag preview is placed by using the getOffset() argument.

You can return an {x: number, y: number} object from getOffset() which will control where the native drag preview is rendered relative to the users pointer. {x: 0, y: 0} represents having the users pointer user the top left corner of the drag preview.

For clarity:

const rect = container.getBoundingClientRect()
{x: 0, y: 0} → top left of the container will be under the users pointer (default)
{x: rect.width, y: 0} top right of the container will be under the users pointer
{x: rect.width, y: rect.height} bottom right of the container will be under the users pointer
{x: 0, y: rect.height} bottom left of the container will be under the users pointer
type GetOffsetFn = (args: { container: HTMLElement }) => {
x: number;
y: number;
};
Notes:

GetOffsetFn needs to return x and y as numbers as that is what the platform requires
You cannot use negative values (not supported by browsers). If you want to push the drag preview away from the users pointer, use offsetFromPointer (see below)
The max offset value for an axis is the border-box. Values greater than the border-box get trimmed to be the border-box value
getOffset is called in the next microtask after setCustomNativeDragPreview:render. This helps ensure that the drag preview element has finished rendering into the container before getOffset is called. Some frameworks like react@18 won't render the element to be used for the drag preview into the container until the next microtask.
{x: rect.width + 1, y: rect.height + 1} effectively becomes {x: rect.width, y: rect.height}.

import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';

draggable({
element: myElement,
onGenerateDragPreview: ({ nativeSetDragImage }) => {
setCustomNativeDragPreview({
// place the (near) top middle of the `container` under the users pointer
getOffset: () => {
const rect = container.getBoundingClientRect();
return { x: rect.width / 2, y: 16 };
},
render({ container }) {
ReactDOM.render(<Preview item={item} />, container);
return function cleanup() {
ReactDOM.unmountComponentAtNode(container);
};
},
nativeSetDragImage,
});
},
});
We have getOffset() helpers for setCustomnativeDragPreview():

centerUnderPointer: centers the custom native drag preview under the users cursor
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';
import { centerUnderPointer } from '@atlaskit/pragmatic-drag-and-drop/element/center-under-pointer';

draggable({
element: myElement,
onGenerateDragPreview: ({ nativeSetDragImage }) => {
setCustomNativeDragPreview({
getOffset: centerUnderPointer,
render({ container }) {
/_ ... _/
},
nativeSetDragImage,
});
},
});
pointerOutsideOfPreview: a cross browser mechanism to place the pointer outside of the drag preview
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';
import { pointerOutsideOfPreview } from '@atlaskit/pragmatic-drag-and-drop/element/offset-from-pointer';

draggable({
element: myElement,
onGenerateDragPreview: ({ nativeSetDragImage }) => {
setCustomNativeDragPreview({
// `x` and `y` can be any CSS value
getOffset: pointerOutsideOfPreview({
x: '8px',
y: 'calc(var(--grid) _ 2)',
}),
render({ container }) {
/_ ... \*/
},
nativeSetDragImage,
});
},
});
Note: if you are using css variables inside of your getOffset() you need to be sure your css variables are available at the <body> element, as the container is temporarily mounted as a child of <body>

preserveOffsetOnSource: applies the initial cursor offset to the custom native drag preview for a seamless experience
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';
import { preserveOffsetOnSource } from '@atlaskit/pragmatic-drag-and-drop/element/preserve-offset-on-source';

draggable({
element: myElement,
onGenerateDragPreview: ({ nativeSetDragImage, location, source }) => {
setCustomNativeDragPreview({
getOffset: preserveOffsetOnSource({
element: source.element,
input: location.current.input,
}),
render({ container }) {
/_ ... _/
},
nativeSetDragImage,
});
},
});
Note: this helper works best when the rendered preview has the same dimensions as the dragged element

Gotcha: CSS transforms
When creating custom drag preview element with setCustomNativeDragPreview, there is mixed support for applying CSS transforms to the drag preview element.

Scale Rotate Translate (avoid)
Chrome (114.0)
Firefox (115.0)
Safari (16.5.2) (broken) (broken) (broken)
Avoid using translate for positioning a drag preview (or pushing it away from the cursor). Please use setCustomNativeDragPreview > getOffset for that (see above)

You can use CSS transforms as a progressive enhancement. For Chrome and Firefox you can use CSS transforms, but for Safari you cannot. You will need do a browser check for Safari, and only add CSS transforms to your preview element when the browser is not Safari.

const isSafari: boolean =
navigator.userAgent.includes('AppleWebKit') && !navigator.userAgent.includes('Chrome');

const transformStyles = css({
transform: 'scale(4deg)',
});

function Preview() {
return <div css={isSafari ? transformStyles : undefined}>Drag preview</div>;
}
Approach 2: Change the appearance of a draggable
This approach has the best performance characteristics, but is subject to a number of gotchas. For most consumers we recommend using setCustomNativeDragPreview

If you do nothing, then the browser will use a picture of the draggable element as the drag preview. By leveraging event timings you can control the appearance of the drag preview that the browser generates:

in onGenerateDragPreview make whatever visual changes you want to the draggable element and those changes will be captured in the drag preview

in onDragStart:

2a. revert changes of step 1. The user will never see the draggable element with the styles applied in onGenerateDragPreview due to paint timings

2b. apply visual changes to the draggable element to make it clear to the user what element is being dragged

in onDrop remove any visual changes you applied to the draggable element during the drag

More information about how this technique works 🧑‍🔬
There are a few constraints imposed by browsers that you need to follow if you want to use this technique:

Your draggable needs to be completely visible and unobfiscated at the start of the drag. This can involve insuring that your draggable is not cut off by scroll (see scrollJustEnoughIntoView), and has no layers currently on top of the draggable (for example, you might need to close some popups)
The users pointer still needs to be over the draggable after the changes you make to the draggable element in onGenerateDragPreview. Generally this means that you should not be changing the dimensions of the draggable element.
Avoid CSS transform on your draggable. In Safari, CSS transforms that impact a draggable can mess up native drag previews.
Bug 1 when a transform impacts a draggablebefore a drag starts:
Bug 2 when CSS transform is applied to a draggable element in onGenerateDragPreview
Non-native custom drag previews
In some situations, you might want to completely disable the native drag preview and render your own drag preview. The advantage of this technique is that you can update the drag preview during a drag. The downsides of this approach is that it is not as fast, and you cannot drag the non-native drag preview outside of a browser window.

To use this technique:

disable the native drag preview
import { disableNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview';

draggable({
element: myElement,
onGenerateDragPreview({ nativeSetDragPreview }) {
disableNativeDragPreview({ nativeSetDragPreview });
},
});
This technique renders a 1x1 transparent image as the native drag preview. There are a few alternative techniques for hiding the drag preview, but this technique yielded the best results across many browsers and devices.
render your own element in onDragStart (ideally in a portal), and under the user's pointer (you can use location.initial.input to get the users initial position)
move the new element around in response to onDrag events (use location.current.input to get the users current pointer position)
remove the new element in onDrop
If you are doing this technique, you will likely want to use the preventUnhandled utility. Using that addon will prevent the strange situation where when the user does not drop on a drop target there is a fairly large pause before the drop event. This is because the browser does a drop animation when the user does not drop on a drop target; a "return home" animation. Because you have hidden the native drag preview, the user won't see this return home drop animation, but will experience a delay. Using the preventUnhandled utility ensures that the return home drop animation won't run

No drag preview
For some experiences you might not want any drag preview (for example, resizing). All you need to do is disable the native drag preview and you are good to go.

import { disableNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview';

draggable({
element: myElement,
onGenerateDragPreview({ nativeSetDragPreview }) {
disableNativeDragPreview({ nativeSetDragPreview });
},
});
scrollJustEnoughIntoView
A little utility to quickly scroll something into view before a drag preview is captured. This is helpful if you are leveraging default drag previews (ie not using setCustomNativeDragPreview). If the draggable element is not completely in view, then the drag preview can be cut off.

import { scrollJustEnoughIntoView } from '@atlaskit/pragmatic-drag-and-drop/scroll-just-enough-into-view';

draggable({
element: myElement,
onGenerateDragPreview({ source }) {
scrollJustEnoughIntoView({ element: source.element });
},
});

Unregistered elements
How the element adapter works with draggable elements that are not registered
About
Drag previews
Unregistered elements
Other utilities
Any HTMLElement can become draggable in the browser by adding the attribute draggable="true" to that element. Additionally, <a> and <img> elements are draggable by default (as if they had draggable="true" set on them).

The element adapter is only activated by explicitly registered elements (ie draggable({element})). The element adapter will not be activated by other draggable elements on the page.

If you want the element adapter to be activated by any element (including <a> or <img> elements), then you need to register it as a draggable()

import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

draggable({
element: myAnchor,
});
Disable default dragging of anchors and images
If you want to disable browsers default setting of draggable="true" on <a> and <img> elements, you can set draggable="false"

<a href="/home" draggable="false">Home</a>
External data for anchors and images
When dragging a <a> or <img> element, they will automatically attach some data for external consumers. For example <a> will attach "text/uri-list" matching the dragging URL.

Registering anchors or images as a draggable() does not impact this default assignment of external data

import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

// "text/plain" and "text/uri-list" external data will automatically be attached
// by the browser
draggable({
element: myAnchor,
});
You can change the default external data values by using getInitialDataForExternal()

import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

draggable({
element: myAnchor,
getInitialDataForExternal: () => ({
// overiding the standard "text/uri-list" value
'text/uri-list': someOtherUrl,
// adding some new value
'application/x.something-custom': myCustomData,
}),
});
Drag previews for anchors and images
Browsers will automatically generate a drag preview when dragging <a> or <img> elements, even when those elements are registered as a draggable().

You can control this drag preview in the same way you could any other element. See drag previews.

Other utilities
Opitional utility functions for the element adapter
About
Drag previews
Unregistered elements
Other utilities
blockDraggingToIFrames
This optional utility disables the ability for a user to drag into an <iframe> element.

Scenarios where this can be helpful:

When you are shifting the interface around in reponse to a drag operation and you don't want the drag to enter into an <iframe> (for example - when resizing)
When you don't want the user to be able to drag into a <iframe> on the page (there could be lots of reasons why!)
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { blockDraggingToIFrames } from '@atlaskit/pragmatic-drag-and-drop/element/block-dragging-to-iframes';

const cleanup = combine(
blockDraggingToIFrames({ element }),
draggable({
element,
}),
);
This function sets pointer-events:none !important to all <iframe> elements for the duration of the drag.
Once an <iframe> is disabled, it will only be re-enabled once the current drag interaction is completed (and not when the CleanupFn is called)
This function currently does not watch for new <iframe> elements being adding during a drag operation.

Text selection adapter
Listen and respond to the dragging of text selections in a document
About
The text selection adapter allows you to listen and respond to text selections being dragged around in a window. Text selection is seperate from the element adapter as text selections are not based on elements, but rather, whatever text the user has wanted to select.

The text selection adapter consists of the following pieces:

dropTargetForTextSelection: marking an element as a valid drop target for text selection drag operations
monitorForTextSelection: create a monitor to listen to text selection drag operations anywhere
types: all types for this adapter
It is likely that some top level utilities will be helpful for your experience as well

Drop targets for text selection
A drop target for text selection drag operations.

The default dropEffect for this type of drop target is "copy" as generally you will be copying dragged text. However, if that is not the case for your drop target, then please update it's drop effect through getDropEffect().

import {dropTargetForTextSelection} from '@atlaskit/pragmatic-drag-and-drop/text-selection/adapter';

const cleanup = dropTargetForTextSelection({
element: myElement,
onDragStart: () => console.log('text started dragging in me');
});
Monitors for text selection
A monitor for text selection drag operations.

import {monitorForTextSelection} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

const cleanup = monitorForTextSelection({
onDragStart: () => console.log('Dragging an element');
});
Types
Generally you won't need to explicitly use our provided types, but we expose a number of TypeScript types if you would like to use them.

All events on drop targets and monitors are given the following base payload:

type TextSelectionEventBasePayload = {
location: DragLocationHistory;
source: TextSelectionDragPayload;
};

type TextSelectionDragPayload = {
/**
_ The `Text` node that is the user started the drag from.
_ Note: the `Text` node does not include all text being dragged.
_ Use the `plain` or `html` properties to get the full selection
_/
target: Text;
/** The plain text of the selection _/
plain: string;
/\*\* the HTML of the selection _/
HTML: string;
};
For all the arguments for all events, you can use our event map type:

type TextSelectionEventPayloadMap = {
onDragStart: TextSelectionEventBasePayload;
// .. the rest of the events
};
Drop targets are given a little bit more information in each event:

type TextSelectionDropTargetEventBasePayload = TextSelectionEventBasePayload & {
/\*\*
_ A convenance pointer to this drop targets values
_/
self: DropTargetRecord;
};
For all arguments for all events on drop targets, you can use our event map type:

type TextSelectionDropTargetEventPayloadMap = {
onDragStart: TextSelectionDropTargetEventBasePayload;
// .. the rest of the events
};
Drop target feedback functions (canDrop, getData, getDropEffect, getIsSticky) are given the following:

type TextSelectionDropTargetGetFeedbackArgs = {
/**
_ The users *current* input
_/
input: Input;
/**
_ The data associated with the entity being dragged
_/
source: TextSelectionDragPayload;
/\*\*
_ This drop target's element
_/
element: Element;
};
The monitor feedback function (canMonitor), is given the following:

type TextSelectionMonitorGetFeedbackArgs = {
/**
_ The users `initial` drag location
_/
initial: DragLocation;
/**
_ The data associated with the entity being dragged
_/
source: TextSelectionDragPayload;
};
You can get these type from the text selection adapter import:

import type {
// Payload for the text selection being dragged
TextSelectionDragPayload
// Base events
TextSelectionEventBasePayload
TextSelectionEventPayloadMap,
// Drop target events
TextSelectionDropTargetEventBasePayload,
TextSelectionDropTargetEventPayloadMap,
// Feedback types
TextSelectionDropTargetGetFeedbackArgs,
TextSelectionMonitorGetFeedbackArgs,
} from '@atlaskit/pragmatic-drag-and-drop/text-selection/adapter';
There are also some types (eg DropTargetLocation) that can be used for all adapters which can be found on our top level utilities page

External adapter
Respond and listen to drag operations that started outside the current window
About
Text
URLs
HTML
Files
Custom media types
The external adapter is used to listen and respond to:

drags that started from the users operating system (eg files)
drags that started from other windows (including from child <iframe>s)
The external adapter consists of the following pieces:

dropTargetForExternal: marking an element as a valid drop target for external entities
monitorForExternal: create a monitor to listen for an external drag operation events anywhere
types: all types for this adapter
There are utilities for making working with particular external data types easier:

Files
URLs
Text
HTML
Custom media
There are also some utilities for usage with any external data type:

some: combine predicates and return true if any predicate matches (eg some(containsText, containsHTML))
It is likely that some top level utilities will be helpful for your experience as well

Drop target for external
A drop target for external data.

The default dropEffect for external drop targets is "copy". This is because when you move data from outside of a window into the window, you are generally making a copy of the data. You can override this default with getDropEffect().

import { dropTargetForExternal } from '@atlaskit/pragmatic-drag-and-drop/external/adapter';

const cleanup = dropTargetForExternal({
element: myElement,
onDragEnter: () => console.log('Some external data was dragged over me');
});
Monitor for external
A monitor for native drags.

import {monitorForExternal} from '@atlaskit/pragmatic-drag-and-drop/external/adapter';

const cleanup = monitorForExternal({
onDragStart: () => console.log('An external drag has entered the window');
});
Filtering by native data types
If you only want your drop target or monitor to be active when particular types of data is being dragged (eg files), then you can provide a predicate function to canDrop and canMonitor

import {dropTargetForExternal, monitorForExternal} from '@atlaskit/pragmatic-drag-and-drop/external/adapter';
import {containsFiles} from '@atlaskit/pragmatic-drag-and-drop/external/file';

dropTargetForExternal({
element: myElement,
canDrop: containsFiles,
onDragEnter: () => console.log('A file is being dragged over me');
});

monitorForExternal({
canMonitor: containsFiles,
onDragStart: () => console.log('A file is being dragged');
});
If you want a drop target or monitor to listen for multiple types of native drag data, you can use some(). some() will return true if any predicate function returns true (the same as Array.prototype.some).

import {dropTargetForExternal, monitorForExternal} from '@atlaskit/pragmatic-drag-and-drop/external/adapter';
import {containsFiles} from '@atlaskit/pragmatic-drag-and-drop/external/file';
import {containsText} from '@atlaskit/pragmatic-drag-and-drop/external/text';

dropTargetForExternal({
canMonitor: some(containsFiles, containsText),
onDragEnter: () => console.log('A file or text is being dragged over me');
});

monitorForExternal({
canMonitor: some(containsFiles, containsText),
onDragStart: () => console.log('A file or text is being dragged');
});
You can also create your own predicate functions to facilitate your own bespoke checks.

Events
The external adapter removes some events from the standard event flow.

onGenerateDragPreview is removed from external drop targets and monitors. For external operations the drag preview has already been generated externally.
onDragStart is removed from external drop targets as an external drag operation can never start from inside a drop target in the window
If your drop target element needs to know when a drag is starting (ie a user is dragging a file into the browser), then you can use a monitor

dropTargetForExternal({
element: el,
onDragEnter: () => console.log('user is now over this drop target'),
onDragLeave: () => console.log('user is no longer over this drop target'),
onDrop: () => console.log('user dropped on this drop target (or a child drop target)'),
});
monitorForExternal({
onDragStart: () => console.log('file is entering the window'),
onDrop: () => console.log('drag is finished'),
});
Cross domain dragging and iframes
The external adapter enables you to drag data from one window, other web windows, or native applications.

Unfortunately, in Chrome@122 and Safari@14.3.1 it is not possible to drag something from a parent window to a child <iframe>, or from a child <iframe> to a parent window if they are on different domains.

For clarity, the following is permitted by all browsers:

dragging from one page to another browser tab on the same domain
dragging from one page to another browser tab on a different domain
dragging from one page native applications
dragging from one page to a child <iframe> on the same domain
dragging from a child <iframe> to a child <iframe> on the same domain
dragging from one page to an <iframe> (on any domain) on a different browser tab (on any domain)
The following is not permitted on Chrome@122 and Safari@14.3.1:

dragging from one page to a child <iframe> on a different domain
dragging from a child <iframe> to a parent page on a different domain
→ Open Chrome discussion about the behaviour

Extracting data
Due to the web platform drag and drop security model, you can know what "types" are being dragging during a drag (eg "text/plain"), but you can only see what data is being dragged (exposed through .items) during a successful "drop" event (onDrop()).

import {
dropTargetForExternal,
monitorForExternal,
} from '@atlaskit/pragmatic-drag-and-drop/external/adapter';
import { containsFiles, getFiles } from '@atlaskit/pragmatic-drag-and-drop/external/file';
import { containsText, getText } from '@atlaskit/pragmatic-drag-and-drop/external/text';

dropTargetForExternal({
canDrop: some(containsFiles, containsText),
onDrop({ source }) {
const files = getFiles({ source });
const text = getText({ source });
},
});

monitorForExternal({
canMonitor: some(containsFiles, containsText),
onDrop({ source }) {
const files = getFiles({ source });
const text = getText({ source });
},
});
Generally, you will only want to interact with source using one of our helpers (eg getText()). .items and getStringData() only return meaningful information during a successful "drop" event (onDrop())

source.items (DataTransferItem[]) will only be populated with data:

in the onDrop() event, and
when the user is dropping on a drop target (including when over a drop target due to stickiness)
Otherwise, source.items will be unpopulated ([]).

Types
Generally you won't need to explicitly use our provided types, but we expose a number of TypeScript types if you would like to use them.

All events on drop targets and monitors are given the following base payload:

type ExternalEventBasePayload = {
location: DragLocationHistory;
source: ExternalDragPayload;
};

export type ExternalDragPayload = {
/**
_ The media types that are being dragged during a drag.
_
_ @example
_
_ console.log(source.types);
_ // → ["text/plain", "text/html"]
\*/
types: NativeMediaType[];
/**
_ The entities that are being dragged.
_ Usually you will not be using these directly, but
_ our helper functions can leverage them to extract
_ particular kinds of data (eg files) that are being dragged
_/
items: DataTransferItem[];
/\*\*
_ returns the data for a given media type. \*
_ - `getStringData(mediaType)` will return `null` if there is no data for that media type
_ - `getStringData(mediaType)` will return the empty string (`""`) if the empty string (`""`)
_ was explicitly set as the data for a media type.
_ - `getStringData(mediaType)` will return null if requesting files (ie `getStringData('Files')`).
_ To access files, use `source.items`, or better still, `getFiles({source})`
_
_ Generally we recommend folks use our helpers to read native data rather than `getStringData(mediaType)`
_
_ @example
_
_ ```ts
_ // Using getStringData()
_ const text: string | null = source.getStringData("text/plain");
_
_ // Using our text helper
_ const text: string | null = getText({source});
_ ```
_ \*/
getStringData: (mediaType: string) => string | null;
};

type NativeMediaType = 'text/uri-list' | 'text/plain' | 'text/html' | 'Files' | string;
For all the arguments for all events, you can use our event map type:

type ExternalEventPayloadMap = {
onDragStart: ExternalEventBasePayload;
// .. the rest of the events
};
Drop targets are given a little bit more information in each event:

type ElementDropTargetEventBasePayload = ExternalEventBasePayload & {
/\*\*
_ A convenance pointer to this drop targets values
_/
self: DropTargetRecord;
};
For all arguments for all events on drop targets, you can use our event map type:

type ExternalDropTargetEventPayloadMap = {
onDragStart: ElementDropTargetEventBasePayload;
// .. the rest of the events
};
Drop target feedback functions (canDrop, getData, getDropEffect, getIsSticky) are given the following:

type ExternalDropTargetGetFeedbackArgs = {
/**
_ The users *current* input
_/
input: Input;
/**
_ The data associated with the entity being dragged
_/
source: ExternalDragPayload;
/\*\*
_ This drop target's element
_/
element: Element;
};
The monitor feedback function (canMonitor), is given the following:

type ExternalMonitorGetFeedbackArgs = {
/**
_ The users `initial` drag location
_/
initial: DragLocation;
/**
_ The data associated with the entity being dragged
_/
source: ExternalDragPayload;
};
You can get these type from the external adapter import:

import type {
// The data that is being dragged
NativeMediaType,
ExternalDragPayload
// Base events
ExternalEventBasePayload
ExternalEventPayloadMap,
// Drop target events
ElementDropTargetEventBasePayload,
ExternalDropTargetEventPayloadMap,
// Feedback types
ExternalDropTargetGetFeedbackArgs,
ExternalMonitorGetFeedbackArgs,
} from '@atlaskit/pragmatic-drag-and-drop/external/adapter';
There are also some types (eg DropTargetLocation) that can be used for all adapters which can be found on our top level utilities page

Blocking unhandled external drags (preventUnhandled)
The default behaviour when dropping some external entities into a window (eg files) is for that entity to be opened in a new tab. Often, if you have drop targets for external entities on your page, you want drops outside of those drop targets to be ignored, and not to open a new tab. You an use the optional preventUnhandled utility to help with that.

Text
Helpers to make working with native text data easier
About
Text
URLs
HTML
Files
Custom media types
containsText
Useful to know whether text data ("text/plain") is being dragged. Keep in mind that multiple pieces of native data can be dragged at once.

import { containsText } from '@atlaskit/pragmatic-drag-and-drop/external/text';

dropTargetForExternal({
element: myElement,
canDrop: containsText,
});

monitorForExternal({
canMonitor: containsText,
});
getText
A helper to extract text data ("text/plain") from drop data. Get text will return null when there is no text data.

import { getText } from '@atlaskit/pragmatic-drag-and-drop/external/text';

dropTargetForExternal({
element: myElement,
onDrop({ source }) {
const text: string | null = getText({ source });
},
});

monitorForExternal({
onDrop({ source }) {
const text: string | null = getText({ source });
},
});

URLs
Helpers to make working with native URL data easier
About
Text
URLs
HTML
Files
Custom media types
containsURLs
Useful to know whether URLs ("text/uri-list") is being dragged.

Keep in mind:

it is possible for multiple urls to be dragged at the same time
multiple pieces of data can be dragged at once
import { containsURLs } from '@atlaskit/pragmatic-drag-and-drop/external/url';

dropTargetForExternal({
element: myElement,
canDrop: containsURLs,
});

monitorForExternal({
canMonitor: containsURLs,
});
getURLs
A helper to extract URL data ("text/uri-list") from drop data. When there are no URLs, getURLs() will return an empty array ([]).

import { getURLs } from '@atlaskit/pragmatic-drag-and-drop/external/url';

dropTargetForExternal({
element: myElement,
onDrop({ source }) {
const urls: string[] = getURLs({ source });
},
});

monitorForExternal({
onDrop({ source }) {
const urls: string[] = getURLs({ source });
},
});

HTML
Helpers to make working with native HTML data easier
About
Text
URLs
HTML
Files
Custom media types
containsHTML
Useful to know whether text data ("text/html") is being dragged. Keep in mind that multiple pieces of native data can be dragged at once.

import { containsHTML } from '@atlaskit/pragmatic-drag-and-drop/external/html';

dropTargetForExternal({
element: myElement,
canDrop: containsHTML,
});

monitorForExternal({
canMonitor: containsHTML,
});
getHTML
A helper to extract text data ("text/html") from drop data. Get text will return null when there is no html data.

import { getHTML } from '@atlaskit/pragmatic-drag-and-drop/external/html';

dropTargetForExternal({
element: myElement,
onDrop({ source }) {
const html: string | null = getHTML({ source });
},
});

monitorForExternal({
onDrop({ source }) {
const html: string | null = getHTML({ source });
},
});

Files
Helpers to make working with file data easier
About
Text
URLs
HTML
Files
Custom media types
Accessibility
When handling file dropping, we recommend that you also add a native input for file uploads

<input type="file" />
This will help enable folks leveraging assistive technologies to perform file uploads.

Drop some images on me!

Select images

containsFiles
Useful to know whether file(s) are being dragged. Keep in mind that multiple pieces of native data can be dragged at once.

import { containsFiles } from '@atlaskit/pragmatic-drag-and-drop/external/file';

dropTargetForExternal({
element: myElement,
canDrop: containsFiles,
});

monitorForExternal({
canMonitor: containsFiles,
});
getFiles
A helper to extract files from drop data. An empty array ([]) will be returned if there were no files being dragged.

import { getFiles } from '@atlaskit/pragmatic-drag-and-drop/external/file';

dropTargetForExternal({
element: myElement,
onDrop({ source }) {
const files: File[] = getFiles({ source });
},
});

monitorForExternal({
onDrop({ source }) {
const files: File[] = getFiles({ source });
},
});

Custom media types
Working with application specific data
About
Text
URLs
HTML
Files
Custom media types
When attaching data to a native drag store (for usage in external windows and applications), you specific a "media type" for a string value.

{
"text/plain": "hello world"
}
"Media types" where previously known as "MIME types" (Multipurpose Internet Mail Extensions Type)

When passing data between different applications, it's helpful to use common media types (eg "text/plain" and "text/uri-list") as other applications will know what to do with these types of entities.

Sometimes you want to pass your own bespoke type of data to other applications, or to other instances of your application. Passing your own type of data is a helpful signal that a particular type of application entity is being dragged.

{
// fallback: a url to our trello card
"text/uri-list": card.url,

// helpful information: a trello card is being dragged
"application/vnd.trello-card-id": card.id
}
In the above example, if we see a "application/vnd.trello-card-id" dragging, then that is a strong hint that a trello card is being dragged. Whereas, as "text/uri-list" does not help us know what kind of entity the URL belongs to.

Things to keep in mind:

During a drag, only the media types (types) of data is visible to you (platform limitation). After a successful drop (onDrop()) you can read out data (by using source.items or source.getData(mediaType))
Custom media types will be visible to all external applications when a user is dragging over them, and the data will be visible if the user drops on that application. So it's important not to expose sensitive data.
Custom media type naming
When making your own media type, there are some conventions:

Note, these conventions don't appear to be enforced by browsers, but for clarity and wide compatibility, it is worth picking the most accurate one.

vendor tree (prefix: vnd.) for publicaly available products (eg "application/vnd.trello-card-id")
personal or vanity tree (prefix: prs.) for non public products or experimental types (eg "image/prs.btif")
unregistered tree (prefix x.) for use only in private environments (eg "application/x.trello-card-id")
→ More details about media type naming

Media type suffixs
You can add a suffix to your media type to add extra information about the type of data being dragged

"text/plain+json": dragging json data (same as "application/json")
"application/vnd.trello-card+json": some json information about a trello card is being dragged
→ More details about suffixs

Attaching custom media
You can attach custom media for external consumers using a draggable

import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

draggable({
element: myElement,
getInitialDataForExternal: () => ({
'application/vnd.trello-card-id': card.id,
}),
});
Consuming custom media
You can consume custom media attached from other windows or applications leveraging the external adapter.

import { dropTargetForExternal } from '@atlaskit/pragmatic-drag-and-drop/external/adapter';

dropTargetForExternal({
element: myElement,
// We are also only enabling dropping if a trello card is being dragged
canDrop: ({ source }) => source.types.includes('application/vnd.trello-card-id'),
onDrop: ({ source }) => {
const cardId: string | null = source.getData('application/vnd.trello-card-id');

        if (cardId == null) {
            return;
        }
        // do drop operation
    },

});
Native applications will also have their own mechanisms for extracting data from externally sourced drag operations.
